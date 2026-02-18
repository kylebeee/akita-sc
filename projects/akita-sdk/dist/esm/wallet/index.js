import { AbstractedAccountFactory, PluginInfoFromTuple, EscrowInfoFromTuple } from '../generated/AbstractedAccountClient';
import { isPluginSDKReturn, hasSenderSigner } from '../types';
import { BaseSDK } from '../base';
import { ENV_VAR_NAMES } from '../config';
import algosdk, { Address, ALGORAND_ZERO_ADDRESS_STRING, makeEmptyTransactionSigner } from 'algosdk';
import { MAX_UINT64 } from '../constants';
import { AllowanceInfoTranslate, AllowancesToTuple, domainBoxKey, executionBoxKey, forceProperties, ValueMap } from './utils';
import { NewEscrowFeeAmount } from './constants';
import { encodeLease, microAlgo } from '@algorandfoundation/algokit-utils';
import { prepareGroupWithCost } from '../simulate/prepare';
import { WalletGroupComposer } from './group';
export * from './constants';
export * from './factory';
export * from './group';
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
            usePlugin: async ({ firstValid = 0n, windowSize = 0n, consolidateFees = true, skipSignatures = false, ...args }) => {
                const { lease } = args;
                const [suggestedParams, { plugins: _plugins, useRounds, length, group, sendParams }, admin] = await Promise.all([
                    this.client.algorand.getSuggestedParams(),
                    this.prepareUsePlugin(args),
                    this.client.state.global.admin()
                ]);
                const validityPeriod = 1000n;
                const start = firstValid !== 0n ? firstValid : BigInt(suggestedParams.firstValid);
                if (windowSize === 0n) {
                    windowSize = BigInt(suggestedParams.lastValid) - BigInt(suggestedParams.firstValid);
                }
                const f = (await (await group.composer()).build()).atc;
                const f1 = forceProperties(f, { sender: admin, signer: makeEmptyTransactionSigner() });
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
                const maxFees = new Map([
                    ...Array.from({ length: length }, (_, i) => [i, microAlgo(BigInt(suggestedParams.minFee) * 272n)]),
                ]);
                // Use prepareGroupWithCost to get both the prepared group and cost information
                const { atc: populatedGroup, expectedCost } = await prepareGroupWithCost(f1, this.client.algorand.client.algod, {
                    coverAppCallInnerTransactionFees: true,
                    populateAppCallResources: true
                }, {
                    maxFees,
                    suggestedParams: suggestedParams,
                }, admin);
                // Determine which signer to use at build time
                const signerToUse = skipSignatures
                    ? makeEmptyTransactionSigner() // Placeholder - will be replaced at send() time
                    : sendParams.signer;
                const groups = {
                    lease: encodeLease(lease),
                    firstValid: start,
                    lastValid: endTarget,
                    useRounds,
                    ids: [],
                    atcs: [],
                    expectedCost,
                    send: async (options) => {
                        // Get current round to determine which group is valid
                        const status = await this.client.algorand.client.algod.status().do();
                        const currentRound = BigInt(status.lastRound);
                        // Find the group whose validity window includes the current round
                        let selectedIndex = -1;
                        for (let i = 0; i < groups.atcs.length; i++) {
                            const groupStart = groups.firstValid + (BigInt(i) * validityPeriod);
                            const groupEnd = i === groups.atcs.length - 1
                                ? groups.lastValid
                                : groupStart + validityPeriod - 1n;
                            if (currentRound >= groupStart && currentRound <= groupEnd) {
                                selectedIndex = i;
                                break;
                            }
                        }
                        if (selectedIndex === -1) {
                            throw new Error(`No valid group for current round ${currentRound}. ` +
                                `Window: ${groups.firstValid}-${groups.lastValid}`);
                        }
                        const atc = groups.atcs[selectedIndex];
                        if (skipSignatures) {
                            if (!options?.signer) {
                                throw new Error('signer is required when skipSignatures is true');
                            }
                            const signedAtc = forceProperties(atc, { signer: options.signer });
                            // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
                            return await this.client.algorand.newGroup()
                                .addAtc(signedAtc)
                                .send();
                        }
                        else {
                            const finalAtc = options?.signer
                                ? forceProperties(atc, { signer: options.signer })
                                : atc;
                            // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
                            return await this.client.algorand.newGroup()
                                .addAtc(finalAtc)
                                .send();
                        }
                    }
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
                        sender: sendParams.sender,
                        signer: signerToUse,
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
    group() {
        return new WalletGroupComposer(this);
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
        const segments = [];
        for (const call of calls) {
            const { appId, getTxns, opUpCount = 0 } = call(spendingAddress);
            const callTxns = await getTxns({ wallet: this.client.appId });
            const last = segments[segments.length - 1];
            if (last && last.appId === appId) {
                last.txns.push(...callTxns);
                last.opUpCount += opUpCount;
            }
            else {
                segments.push({ appId, txns: callTxns, opUpCount });
            }
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
        const group = this.client.newGroup();
        let totalOpUpCount = 0;
        let lastUseRounds = false;
        let lastPluginAppId = 0n;
        for (let segIdx = 0; segIdx < segments.length; segIdx++) {
            const segment = segments[segIdx];
            const isFirstSegment = segIdx === 0;
            lastPluginAppId = segment.appId;
            totalOpUpCount += segment.opUpCount;
            // Fetch plugin info and calculate method offsets for this segment
            const key = { plugin: segment.appId, caller, escrow };
            let methods = [];
            let useRounds = false;
            let useExecutionKey = false;
            if (this.plugins.has(key)) {
                ({ methods, useRounds, useExecutionKey } = this.plugins.get(key));
            }
            else {
                ({ methods, useRounds, useExecutionKey } = await this.getPluginByKey(key));
            }
            lastUseRounds = useRounds;
            const methodOffsets = [];
            const methodSignatures = [];
            if (methods.length > 0) {
                for (let i = 0; i < methods.length; i++) {
                    methodSignatures.push(methods[i].name.toString());
                }
                for (const txn of segment.txns) {
                    if (txn.type === 'methodCall' && 'appId' in txn && txn.appId === segment.appId) {
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
                // fundsRequest only on the first segment's rekey
                fundsRequest: isFirstSegment ? fundsRequest?.map(({ asset, amount }) => ([asset, amount])) : []
            };
            let boxReferences = [];
            // Lease/execution key box references only on first segment
            if (isFirstSegment) {
                if (lease !== '') {
                    boxReferences.push(executionBoxKey(lease));
                }
                if (useExecutionKey) {
                    if (!hasSenderSigner(sendParams)) {
                        throw new Error('Sender and signer must be provided');
                    }
                    boxReferences.push(domainBoxKey(sendParams.sender));
                }
            }
            // Add rekey for this segment
            if (name && segments.length === 1) {
                group.arc58RekeyToNamedPlugin({
                    ...sendParams,
                    args: {
                        name,
                        ...rekeyArgs
                    },
                    extraFee: isFirstSegment ? microAlgo(1000n + BigInt(fundsRequest.length * 1000)) : microAlgo(1000n),
                    boxReferences: boxReferences.length > 0 ? boxReferences : undefined
                });
            }
            else {
                group.arc58RekeyToPlugin({
                    ...sendParams,
                    args: {
                        plugin: segment.appId,
                        ...rekeyArgs
                    },
                    extraFee: isFirstSegment ? microAlgo(1000n + BigInt(fundsRequest.length * 1000)) : microAlgo(1000n),
                    boxReferences: boxReferences.length > 0 ? boxReferences : undefined
                });
            }
            // Add segment transactions
            const composer = await group.composer();
            for (const txn of segment.txns) {
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
            // Add verifyAuthAddress after this segment's transactions
            // Note differentiates each verifyAuth so they have unique txn IDs within the group
            group.arc58VerifyAuthAddress({
                ...sendParams,
                args: {},
                ...(segments.length > 1 ? { note: new TextEncoder().encode(`v${segIdx}`) } : {})
            });
        }
        // Calculate actual txn count manually, accounting for companion transactions
        // (ABI method calls with transaction-type args like `pay` expand to multiple txns)
        const ABI_TXN_TYPES = ['txn', 'pay', 'keyreg', 'acfg', 'axfer', 'afrz', 'appl'];
        let actualTxnCount = 0;
        for (const segment of segments) {
            actualTxnCount += 2; // rekey + verifyAuth
            for (const txn of segment.txns) {
                actualTxnCount += 1;
                if (txn.type === 'methodCall') {
                    for (const arg of txn.method.args) {
                        if (typeof arg.type === 'string' && ABI_TXN_TYPES.includes(arg.type)) {
                            actualTxnCount += 1;
                        }
                    }
                }
            }
        }
        // Add opUp transactions after all segments, using the last segment's appId
        const hasSigner = hasSenderSigner(sendParams);
        const opUpLimit = Math.min(totalOpUpCount, (16 - actualTxnCount));
        if (totalOpUpCount > 0 && hasSigner && opUpLimit > 0) {
            const opUpComposer = await group.composer();
            for (let i = 0; i < opUpLimit; i++) {
                opUpComposer.addAppCallMethodCall({
                    sender: sendParams.sender,
                    signer: sendParams.signer,
                    appId: lastPluginAppId,
                    method: algosdk.ABIMethod.fromSignature('opUp()void'),
                    args: [],
                    maxFee: microAlgo(1000),
                    note: new TextEncoder().encode(String(i))
                });
            }
        }
        const length = await (await group.composer()).count();
        const plugins = [...new Set(segments.map(s => s.appId))];
        return { plugins, caller, useRounds: lastUseRounds, length, group, sendParams: sendParams };
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
        const { plugins, caller, length, group, sendParams: preparedSendParams } = await this.prepareUsePlugin(params);
        const { escrow = '', fundsRequest, consolidateFees = false } = params;
        let result;
        if (consolidateFees) {
            // Build the ATC from the group
            const atc = (await (await group.composer()).build()).atc;
            const appliedAtc = forceProperties(atc, {
                sender: preparedSendParams.sender,
                signer: preparedSendParams.signer
            });
            // Get suggested params for fee calculation
            const suggestedParams = await this.client.algorand.getSuggestedParams();
            // Set max fees for all transactions to allow prepareGroupWithCost to work
            const maxFees = new Map(Array.from({ length }, (_, i) => [i, microAlgo(BigInt(suggestedParams.minFee) * 272n)]));
            // Use prepareGroupWithCost to populate resources and calculate fees
            const { atc: populatedAtc } = await prepareGroupWithCost(appliedAtc, this.client.algorand.client.algod, {
                coverAppCallInnerTransactionFees: true,
                populateAppCallResources: true
            }, {
                maxFees,
                suggestedParams
            });
            // Consolidate all fees to the first transaction
            const feeGroup = populatedAtc.clone().buildGroup();
            const totalFees = feeGroup.reduce((acc, txn) => acc + txn.txn.fee, 0n);
            const consolidatedAtc = forceProperties(populatedAtc, {
                fees: new Map([
                    [0, microAlgo(totalFees)],
                    ...Array.from({ length: length - 1 }, (_, i) => [i + 1, microAlgo(0n)]),
                ])
            });
            // Use AlgoKit Utils TransactionComposer to send and get proper confirmations
            result = await this.client.algorand.newGroup()
                .addAtc(consolidatedAtc)
                .send();
        }
        else {
            result = await group.send({ ...sendParams });
        }
        for (const plugin of plugins) {
            await this.updateCache({ plugin, caller, escrow }, fundsRequest?.map(({ asset }) => asset)).catch(error => {
                console.warn('Failed to update plugin cache:', error);
            });
        }
        return result;
    }
    async addPlugin({ sender, signer, name = '', client, caller, global = false, methods = [], escrow = '', admin = false, delegationType = 0n, lastValid = MAX_UINT64, cooldown = 0n, useRounds = false, useExecutionKey = false, coverFees = false, canReclaim = true, defaultToEscrow = false, allowances = [] }) {
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
        // Check if controlled address differs from app address - requires extra fee for MBR transfer inner txn
        const controlledAddress = await this.client.state.global.controlledAddress();
        const hasExternalControlledAddress = controlledAddress !== this.client.appAddress.toString();
        // Calculate extra fee:
        // - NewEscrowFeeAmount (6000) if creating a new escrow
        // - 1000 if controlled address is external (for MBR transfer inner txn)
        const extraFee = microAlgo((newEscrow ? NewEscrowFeeAmount : 0n) + (hasExternalControlledAddress ? 1000n : 0n));
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
            coverFees,
            canReclaim,
            defaultToEscrow
        };
        const group = this.client.newGroup();
        if (name !== '') {
            group.arc58AddNamedPlugin({
                ...sendParams,
                args: { name, ...args },
                extraFee
            });
        }
        else {
            group.arc58AddPlugin({
                ...sendParams,
                args,
                extraFee
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
    async optInEscrow({ sender, signer, ...args }) {
        const sendParams = this.getSendParams({ sender, signer });
        return await this.client.send.arc58OptInEscrow({ ...sendParams, args });
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