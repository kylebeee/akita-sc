import { AbstractedAccountFactory, PluginInfoFromTuple, EscrowInfoFromTuple } from '../generated/AbstractedAccountClient';
import { isPluginSDKReturn, hasSenderSigner } from '../types';
import { BaseSDK } from '../base';
import { ENV_VAR_NAMES } from '../config';
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING, makeEmptyTransactionSigner } from 'algosdk';
import { MAX_UINT64 } from '../constants';
import { AllowanceInfoTranslate, AllowancesToTuple, domainBoxKey, executionBoxKey, forceProperties, ValueMap } from './utils';
import { NewEscrowFeeAmount } from './constants';
import { encodeLease, microAlgo, prepareGroupForSending } from '@algorandfoundation/algokit-utils';
export * from './constants';
export * from './factory';
export * from './plugins';
export * from "./types";
// things i want to include in the SDK
// - [x] wallet creation
// - [ ] passkey signer creation
// - [x] plugin installs & management
// - [x] escrow creation & management
export class WalletSDK extends BaseSDK {
    constructor(params) {
        super({ factory: AbstractedAccountFactory, ...params }, ENV_VAR_NAMES.WALLET_APP_ID);
        this.pluginMapKeyGenerator = ({ plugin, caller = ALGORAND_ZERO_ADDRESS_STRING, escrow = '' }) => (`${plugin}${caller}${escrow}`);
        this.plugins = new ValueMap(this.pluginMapKeyGenerator);
        this.namedPlugins = new Map();
        this.escrows = new Map();
        this.allowanceMapKeyGenerator = ({ asset, escrow }) => (`${asset}${escrow}`);
        this.allowances = new ValueMap(this.allowanceMapKeyGenerator);
        this.executions = new Map();
        this.build = {
            usePlugin: async ({ firstValid = 0n, windowSize, consolidateFees = true, ...args }) => {
                const { lease } = args;
                const suggestedParams = await this.client.algorand.getSuggestedParams();
                const validityPeriod = 1000n;
                const start = firstValid !== 0n ? firstValid : BigInt(suggestedParams.firstValid);
                const { useRounds, length, group, sendParams: prepSendParams } = await this.prepareUsePlugin(args);
                const foundation = (await (await group.composer()).build()).atc;
                const admin = (await this.client.state.global.admin());
                const f1 = forceProperties(foundation, { sender: admin, signer: makeEmptyTransactionSigner() });
                let numGroupsToBuild;
                let endTarget;
                if (useRounds) {
                    endTarget = start + windowSize;
                    numGroupsToBuild = Math.ceil(Number(windowSize) / Number(validityPeriod));
                }
                else {
                    // Convert seconds to rounds (assuming ~2.7s per round)
                    const roundsNeeded = BigInt(Math.ceil(Number(windowSize) / 2.7));
                    endTarget = start + roundsNeeded;
                    numGroupsToBuild = Math.ceil(Number(roundsNeeded) / Number(validityPeriod));
                }
                const maxFees = new Map();
                for (let i = 0; i < length; i += 1) {
                    maxFees.set(i, microAlgo(257000));
                }
                const populatedGroup = await prepareGroupForSending(f1, this.client.algorand.client.algod, {
                    coverAppCallInnerTransactionFees: true,
                    populateAppCallResources: true
                }, {
                    maxFees,
                    suggestedParams: suggestedParams,
                });
                let groups = {
                    lease: encodeLease(lease),
                    firstValid: start,
                    lastValid: endTarget,
                    useRounds,
                    ids: [],
                    atcs: []
                };
                const sendParams = {
                    ...this.sendParams,
                    ...(args.sender !== undefined && { sender: args.sender }),
                    ...(args.signer !== undefined && { signer: args.signer })
                };
                for (let i = 0; i < numGroupsToBuild; i++) {
                    const groupStartRound = start + (BigInt(i) * validityPeriod);
                    let groupEndRound;
                    // For the last group, ensure it ends exactly at the target expiration
                    if (i === (numGroupsToBuild - 1)) {
                        groupEndRound = endTarget - 1n;
                    }
                    else {
                        groupEndRound = groupStartRound + validityPeriod - 1n;
                    }
                    console.log(`Building group ${i + 1}/${numGroupsToBuild} with start: ${groupStartRound}, end: ${groupEndRound}`);
                    let overwrite = {
                        sender: prepSendParams.sender,
                        signer: prepSendParams.signer,
                        firstValid: groupStartRound,
                        lastValid: groupEndRound,
                        lease: groups.lease,
                    };
                    if (consolidateFees) {
                        const feeConsolidation = populatedGroup.clone().buildGroup();
                        const totalFees = feeConsolidation.reduce((acc, txn) => acc + txn.txn.fee, 0n);
                        overwrite.fees = new Map([
                            [0, microAlgo(totalFees)],
                            ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0)]),
                        ]);
                    }
                    const finalGroup = forceProperties(populatedGroup, overwrite);
                    const groupID = finalGroup.buildGroup()[0].txn.group;
                    groups.ids.push(groupID);
                    groups.atcs.push(finalGroup);
                }
                return groups;
            }
        };
    }
    async updateCache(key, allowances) {
        const { escrow } = key;
        const requestList = [this.getPluginByKey(key)];
        if (escrow !== '' && !this.escrows.has(escrow)) {
            requestList.push(this.getEscrow(escrow));
        }
        else {
            requestList.push(Promise.resolve());
        }
        const fetchAllFloor = 5;
        if (allowances && allowances.length > 0) {
            if (allowances.length > fetchAllFloor) {
                requestList.push(this.getAllowances());
            }
            else {
                for (const allowance of allowances) {
                    requestList.push(this.getAllowance({ asset: allowance, escrow }));
                }
            }
        }
        const settled = await Promise.allSettled(requestList);
        if (settled[0].status === 'fulfilled') {
            this.plugins.set(key, settled[0].value);
        }
        if (escrow !== '' && !this.escrows.has(escrow) && settled[1].status === 'fulfilled') {
            this.escrows.set(escrow, settled[1].value);
        }
        if (allowances && allowances.length > 0 && !(allowances.length > fetchAllFloor)) {
            for (let i = 0; i < allowances.length; i++) {
                const req = settled[i + 2];
                if (req.status === 'fulfilled') {
                    this.allowances.set({ asset: allowances[i], escrow }, req.value);
                }
            }
        }
    }
    async prepareUsePlugin({ sender, signer, name = '', global = false, escrow = '', fundsRequest = [], calls, lease = '' }) {
        const sendParams = this.getSendParams({ sender, signer });
        let spendingAddress = (await this.client.state.global.controlledAddress());
        if (escrow !== '') {
            let id = 0n;
            if (this.escrows.has(escrow)) {
                id = this.escrows.get(escrow).id;
            }
            else {
                try {
                    id = (await this.getEscrow(escrow)).id;
                }
                catch (error) {
                    throw new Error(`Escrow with name ${escrow} does not exist`);
                }
            }
            spendingAddress = algosdk.getApplicationAddress(id).toString();
        }
        // call the functions provided by the plugin SDK to
        // inject our wallet ID and get back the transactions
        let plugin = 0n;
        let txns = [];
        let totalOpUpCount = 0;
        for (let i = 0; i < calls.length; i++) {
            const call = calls[i];
            const { appId, getTxns, opUpCount = 0 } = call(spendingAddress);
            if (i === 0) {
                plugin = appId;
            }
            if (appId !== plugin) {
                throw new Error(`All calls must be to the same plugin app ID: ${plugin}, but got ${appId}`);
            }
            txns.push(...(await getTxns({ wallet: this.client.appId })));
            totalOpUpCount += opUpCount;
        }
        let caller = '';
        if (global) {
            caller = ALGORAND_ZERO_ADDRESS_STRING;
        }
        else if (sendParams.sender !== undefined) {
            caller = sendParams.sender instanceof Address
                ? sendParams.sender.toString()
                : sendParams.sender;
        }
        else {
            throw new Error('Sender must be provided for non-global plugin calls');
        }
        // calculate method offsets
        const methodOffsets = [];
        const key = { plugin, caller, escrow };
        let methods = [];
        let useRounds = false;
        let useExecutionKey = false;
        if (this.plugins.has(key)) {
            ({ methods, useRounds, useExecutionKey } = this.plugins.get(key));
        }
        else {
            ({ methods, useRounds, useExecutionKey } = await this.getPluginByKey(key));
        }
        const methodSignatures = [];
        if (methods.length > 0) {
            for (let i = 0; i < methods.length; i++) {
                methodSignatures.push(methods[i].name.toString());
            }
            for (const txn of txns) {
                if (txn.type === 'methodCall' && 'appId' in txn && txn.appId === plugin) {
                    const selector = txn.method.getSelector();
                    if (!methodSignatures.includes(selector.toString())) {
                        throw new Error(`Transaction selector does not match any allowed method signatures`);
                    }
                    methodOffsets.push(methodSignatures.indexOf(selector.toString()));
                }
            }
        }
        const rekeyArgs = {
            global,
            escrow,
            methodOffsets,
            fundsRequest: fundsRequest?.map(({ asset, amount }) => ([asset, amount]))
        };
        let boxReferences = [];
        if (lease !== '') {
            boxReferences.push(executionBoxKey(lease));
        }
        if (useExecutionKey) {
            if (!hasSenderSigner(sendParams)) {
                throw new Error('Sender and signer must be provided');
            }
            boxReferences.push(domainBoxKey(sendParams.sender));
        }
        const group = this.client.newGroup();
        if (name) {
            group.arc58RekeyToNamedPlugin({
                ...sendParams,
                args: {
                    name,
                    ...rekeyArgs
                },
                extraFee: microAlgo(1000n + BigInt(fundsRequest.length * 1000)),
                boxReferences: boxReferences.length > 0 ? boxReferences : undefined
            });
        }
        else {
            group.arc58RekeyToPlugin({
                ...sendParams,
                args: {
                    plugin,
                    ...rekeyArgs
                },
                extraFee: microAlgo(1000n + BigInt(fundsRequest.length * 1000)),
                boxReferences: boxReferences.length > 0 ? boxReferences : undefined
            });
        }
        const composer = await group.composer();
        for (const txn of txns) {
            switch (txn.type) {
                case 'pay': {
                    composer.addPayment(txn);
                    break;
                }
                case 'assetCreate': {
                    composer.addAssetCreate(txn);
                    break;
                }
                case 'assetConfig': {
                    composer.addAssetConfig(txn);
                    break;
                }
                case 'assetFreeze': {
                    composer.addAssetFreeze(txn);
                    break;
                }
                case 'assetDestroy': {
                    composer.addAssetDestroy(txn);
                    break;
                }
                case 'assetTransfer': {
                    composer.addAssetTransfer(txn);
                    break;
                }
                case 'assetOptIn': {
                    composer.addAssetOptIn(txn);
                    break;
                }
                case 'assetOptOut': {
                    composer.addAssetOptOut(txn);
                    break;
                }
                case 'appCall': {
                    if ('appId' in txn && 'approvalProgram' in txn) {
                        composer.addAppUpdate(txn);
                    }
                    else if ('appId' in txn) {
                        composer.addAppCall(txn);
                    }
                    else {
                        composer.addAppCreate(txn);
                    }
                    break;
                }
                case 'keyReg': {
                    if ('voteKey' in txn) {
                        composer.addOnlineKeyRegistration(txn);
                    }
                    else {
                        composer.addOfflineKeyRegistration(txn);
                    }
                    break;
                }
                case 'txnWithSigner': {
                    composer.addTransaction(txn.txn, txn.signer);
                    break;
                }
                case 'atc': {
                    composer.addAtc(txn.atc);
                    break;
                }
                case 'methodCall': {
                    if ('appId' in txn && 'approvalProgram' in txn) {
                        composer.addAppUpdateMethodCall(txn);
                    }
                    else if ('appId' in txn) {
                        composer.addAppCallMethodCall(txn);
                    }
                    else {
                        composer.addAppCreateMethodCall(txn);
                    }
                    break;
                }
                default: {
                    throw new Error(`Unknown transaction type`);
                }
            }
        }
        group.arc58VerifyAuthAddress({ ...sendParams, args: {} });
        // Add opUp transactions if requested by plugin calls
        // These are added after verifyAuthAddr and provide additional resource reference slots
        if (totalOpUpCount > 0 && hasSenderSigner(sendParams)) {
            const opUpComposer = await group.composer();
            for (let i = 0; i < Math.min(totalOpUpCount, (16 - (txns.length + 2))); i++) {
                opUpComposer.addAppCallMethodCall({
                    sender: sendParams.sender,
                    signer: sendParams.signer,
                    appId: plugin,
                    method: algosdk.ABIMethod.fromSignature('opUp()void'),
                    args: [],
                    maxFee: microAlgo(1000),
                    // Add unique note to differentiate opUp calls
                    note: new TextEncoder().encode(String(i))
                });
            }
        }
        const length = await (await group.composer()).count();
        return { plugin, caller, useRounds, length, group, sendParams: sendParams };
    }
    async register({ sender, signer, escrow }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.register({
            ...sendParams,
            args: {
                escrow
            }
        });
    }
    async changeRevocationApp({ sender, signer, app }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setRevocationApp({
            ...sendParams,
            args: { app },
        });
    }
    async setNickname({ sender, signer, nickname }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setNickname({
            ...sendParams,
            args: { nickname }
        });
    }
    async setAvatar({ sender, signer, avatar }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setAvatar({
            ...sendParams,
            args: { avatar }
        });
    }
    async setBanner({ sender, signer, banner }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setBanner({
            ...sendParams,
            args: { banner }
        });
    }
    async setBio({ sender, signer, bio }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.setBio({
            ...sendParams,
            args: { bio }
        });
    }
    async changeAdmin({ sender, signer, newAdmin }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.arc58ChangeAdmin({
            ...sendParams,
            args: { newAdmin }
        });
    }
    async verifyAuthAddress(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.arc58VerifyAuthAddress({
            ...sendParams,
            args: {}
        });
    }
    async rekeyTo({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.arc58RekeyTo({ ...sendParams, args });
    }
    async canCall({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        const methods = isPluginSDKReturn(args.methods)
            ? args.methods().selectors
            : args.methods;
        const result = await Promise.allSettled(methods.flatMap(method => {
            return this.client.send.arc58CanCall({ ...sendParams, args: { ...args, method } });
        }));
        return result.map(x => x.status === 'fulfilled' ? x.value : false);
    }
    async usePlugin(params) {
        const sendParams = this.getSendParams(params);
        const { plugin, caller, group } = await this.prepareUsePlugin(params);
        const result = await group.send({ ...sendParams });
        const { escrow = '', fundsRequest } = params;
        await this.updateCache({ plugin, caller, escrow }, fundsRequest?.map(({ asset }) => asset)).catch(error => {
            console.warn('Failed to update plugin cache:', error);
        });
        return result;
    }
    async addPlugin({ sender, signer, name = '', client, caller, global = false, methods = [], escrow = '', admin = false, delegationType = 0n, lastValid = MAX_UINT64, cooldown = 0n, useRounds = false, useExecutionKey = false, defaultToEscrow = false, allowances = [] }) {
        const sendParams = this.getSendParams({ sender, signer });
        // Get the plugin app ID from the SDK client
        const plugin = client.appId;
        if (global) {
            caller = ALGORAND_ZERO_ADDRESS_STRING;
        }
        let transformedMethods = [];
        if (methods.length > 0) {
            transformedMethods = methods.reduce((acc, method) => {
                if (isPluginSDKReturn(method.name)) {
                    const selectors = method.name().selectors ?? [];
                    selectors.forEach((selector) => acc.push([selector, method.cooldown]));
                }
                else {
                    method.name.forEach(x => acc.push([x, method.cooldown]));
                }
                return acc;
            }, []);
        }
        const newEscrow = escrow !== '' && !this.escrows.get(escrow);
        const args = {
            plugin,
            caller: caller,
            escrow,
            admin,
            delegationType,
            lastValid,
            cooldown,
            methods: transformedMethods,
            useRounds,
            useExecutionKey,
            defaultToEscrow
        };
        const group = this.client.newGroup();
        if (name !== '') {
            group.arc58AddNamedPlugin({
                ...sendParams,
                args: { name, ...args },
                extraFee: microAlgo(newEscrow ? NewEscrowFeeAmount : 0n)
            });
        }
        else {
            group.arc58AddPlugin({
                ...sendParams,
                args,
                extraFee: microAlgo(newEscrow ? NewEscrowFeeAmount : 0n)
            });
        }
        if (allowances.length > 0) {
            if (escrow === '') {
                throw new Error('Allowances can only be added to plugins with an escrow');
            }
            group.arc58AddAllowances({
                ...sendParams,
                args: {
                    escrow,
                    allowances: AllowancesToTuple(allowances)
                }
            });
        }
        // console.log('txns',
        //   (await (await group.composer()).build()).transactions.map(txn => txn.txn)
        // )
        const result = await group.send();
        const postProcess = [];
        if (newEscrow) {
            postProcess.push(this.register({ escrow }));
        }
        postProcess.push(this.updateCache({ plugin, caller: caller, escrow }, allowances.map(allowance => allowance.asset)).catch(error => {
            console.warn('Failed to update plugin cache:', error);
        }));
        await Promise.all(postProcess);
        return result;
    }
    async removePlugin({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58RemovePlugin({
            ...sendParams,
            args
        });
    }
    async newEscrow({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58NewEscrow({
            ...sendParams,
            args
        });
    }
    async toggleEscrowLock({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58ToggleEscrowLock({
            ...sendParams,
            args
        });
    }
    async reclaimFunds({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58Reclaim({
            ...sendParams,
            args
        });
    }
    async optinEscrow({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58OptinEscrow({ ...sendParams, args });
    }
    async addAllowances({ sender, signer, escrow, allowances }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58AddAllowances({
            ...sendParams,
            args: {
                escrow,
                allowances: AllowancesToTuple(allowances)
            }
        });
    }
    async removeAllowances({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58RemoveAllowances({
            ...sendParams,
            args
        });
    }
    async addExecutionKey({ sender, signer, lease, groups, firstValid, lastValid }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58AddExecutionKey({
            ...sendParams,
            args: { lease, groups, firstValid, lastValid }
        });
    }
    async removeExecutionKey({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58RemoveExecutionKey({
            ...sendParams,
            args
        });
    }
    async getGlobalState() {
        return await this.client.state.global.getAll();
    }
    async getAdmin() {
        return (await this.client.send.arc58GetAdmin()).return;
    }
    async getPlugins() {
        this.plugins = new ValueMap(this.pluginMapKeyGenerator, Array.from(await this.client.state.box.plugins.getMap(), ([key, info]) => {
            return [
                key,
                {
                    ...info,
                    methods: info.methods.map((method) => ({
                        name: method[0],
                        cooldown: method[1],
                        lastCalled: method[2]
                    }))
                }
            ];
        }));
        return this.plugins;
    }
    async getPluginByKey(key) {
        const info = (await this.client.state.box.plugins.value(key));
        const methods = info.methods.map((method) => ({
            name: method[0],
            cooldown: method[1],
            lastCalled: method[2]
        }));
        return { ...info, methods };
    }
    async getNamedPlugins() {
        this.namedPlugins = await this.client.state.box.namedPlugins.getMap();
        return this.namedPlugins;
    }
    async getPluginByName(name) {
        const infos = (await this.client.send.arc58GetNamedPlugins({ args: { names: [name] } })).return;
        const info = PluginInfoFromTuple(infos[0]);
        const methods = info.methods.map((method) => ({
            name: method[0],
            cooldown: method[1],
            lastCalled: method[2]
        }));
        return { ...info, methods };
    }
    async getEscrows() {
        this.escrows = await this.client.state.box.escrows.getMap();
        return this.escrows;
    }
    async getEscrow(escrow) {
        return EscrowInfoFromTuple((await this.client.send.arc58GetEscrows({ args: { escrows: [escrow] } })).return[0]);
    }
    async getAllowances() {
        this.allowances = new ValueMap(this.allowanceMapKeyGenerator, Array.from(await this.client.state.box.allowances.getMap(), ([key, info]) => {
            return [
                key,
                AllowanceInfoTranslate(info)
            ];
        }));
        return this.allowances;
    }
    async getAllowance(key) {
        return AllowanceInfoTranslate((await this.client.state.box.allowances.value(key)));
    }
    async getExecutions() {
        this.executions = await this.client.state.box.executions.getMap();
        return this.executions;
    }
    async getExecution(lease) {
        return await this.client.state.box.executions.value(lease);
    }
    async getMbr(args) {
        return (await this.client.send.mbr({ args })).return;
    }
    async balance(assets) {
        return (await this.client.send.balance({ args: { assets } })).return;
    }
}
//# sourceMappingURL=index.js.map