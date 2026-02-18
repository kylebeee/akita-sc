"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletGroupComposer = void 0;
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const types_1 = require("../types");
const constants_2 = require("../constants");
const algosdk_1 = require("algosdk");
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const prepare_1 = require("../simulate/prepare");
/**
 * Fluent composer returned by `wallet.group()` that queues wallet operations
 * and resolves them as a single atomic group at `send()` time.
 *
 * Tracks internal state like new escrow creation across operations so that
 * only the first addPlugin with a given escrow pays the NewEscrowFeeAmount.
 */
class WalletGroupComposer {
    constructor(wallet) {
        this.resolvers = [];
        this.postProcessors = [];
        this.newEscrows = new Set();
        this.wallet = wallet;
        this.group = wallet.client.newGroup();
    }
    getSendParams({ sender, signer } = {}) {
        return {
            ...this.wallet.sendParams,
            ...(sender !== undefined && { sender }),
            ...(signer !== undefined && { signer }),
        };
    }
    // ---------------------------------------------------------------------------
    // Complex methods
    // ---------------------------------------------------------------------------
    addPlugin(params) {
        this.resolvers.push(async () => {
            const { sender, signer, name = '', client, caller: rawCaller, global = false, methods = [], escrow = '', admin = false, delegationType = 0n, lastValid = constants_2.MAX_UINT64, cooldown = 0n, useRounds = false, useExecutionKey = false, coverFees = false, canReclaim = true, defaultToEscrow = false, allowances = [] } = params;
            let caller = rawCaller;
            const sendParams = this.getSendParams({ sender, signer });
            const plugin = client.appId;
            if (global) {
                caller = algosdk_1.ALGORAND_ZERO_ADDRESS_STRING;
            }
            // Transform methods
            let transformedMethods = [];
            if (methods.length > 0) {
                transformedMethods = methods.reduce((acc, method) => {
                    if ((0, types_1.isPluginSDKReturn)(method.name)) {
                        const selectors = method.name().selectors ?? [];
                        selectors.forEach((selector) => acc.push([selector, method.cooldown]));
                    }
                    else {
                        method.name.forEach(x => acc.push([x, method.cooldown]));
                    }
                    return acc;
                }, []);
            }
            // Check escrow — both SDK cache and this group's new escrows
            const isNewEscrow = escrow !== ''
                && !this.wallet.escrows.get(escrow)
                && !this.newEscrows.has(escrow);
            if (isNewEscrow) {
                this.newEscrows.add(escrow);
            }
            // Check if controlled address differs from app address — requires extra fee
            const controlledAddress = await this.wallet.client.state.global.controlledAddress();
            const hasExternalControlledAddress = controlledAddress !== this.wallet.client.appAddress.toString();
            const externalControlledFee = hasExternalControlledAddress ? 1000n : 0n;
            const extraFee = (0, algokit_utils_1.microAlgo)((isNewEscrow ? constants_1.NewEscrowFeeAmount : 0n) + externalControlledFee);
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
            if (name !== '') {
                this.group.arc58AddNamedPlugin({
                    ...sendParams,
                    args: { name, ...args },
                    extraFee
                });
            }
            else {
                this.group.arc58AddPlugin({
                    ...sendParams,
                    args,
                    extraFee
                });
            }
            if (allowances.length > 0) {
                if (escrow === '') {
                    throw new Error('Allowances can only be added to plugins with an escrow');
                }
                this.group.arc58AddAllowances({
                    ...sendParams,
                    args: {
                        escrow,
                        allowances: (0, utils_1.AllowancesToTuple)(allowances)
                    }
                });
            }
            // Queue post-processing (runs after the group is sent)
            const pluginKey = { plugin, caller: caller, escrow };
            const allowanceAssets = allowances.map((a) => a.asset);
            this.postProcessors.push(async () => {
                if (isNewEscrow) {
                    await this.wallet.register({ sender, signer, escrow });
                }
                await this.wallet.updateCache(pluginKey, allowanceAssets).catch(error => {
                    console.warn('Failed to update plugin cache:', error);
                });
            });
        });
        return this;
    }
    usePlugin(params) {
        this.resolvers.push(async () => {
            const { group: tempGroup } = await this.wallet.prepareUsePlugin(params);
            const atc = (await (await tempGroup.composer()).build()).atc;
            const mainComposer = await this.group.composer();
            mainComposer.addAtc(atc);
        });
        return this;
    }
    // ---------------------------------------------------------------------------
    // Simple methods
    // ---------------------------------------------------------------------------
    register({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.register({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    changeRevocationApp({ sender, signer, app }) {
        this.resolvers.push(async () => {
            this.group.setRevocationApp({ ...this.getSendParams({ sender, signer }), args: { app } });
        });
        return this;
    }
    setNickname({ sender, signer, nickname }) {
        this.resolvers.push(async () => {
            this.group.setNickname({ ...this.getSendParams({ sender, signer }), args: { nickname } });
        });
        return this;
    }
    setAvatar({ sender, signer, avatar }) {
        this.resolvers.push(async () => {
            this.group.setAvatar({ ...this.getSendParams({ sender, signer }), args: { avatar } });
        });
        return this;
    }
    setBanner({ sender, signer, banner }) {
        this.resolvers.push(async () => {
            this.group.setBanner({ ...this.getSendParams({ sender, signer }), args: { banner } });
        });
        return this;
    }
    setBio({ sender, signer, bio }) {
        this.resolvers.push(async () => {
            this.group.setBio({ ...this.getSendParams({ sender, signer }), args: { bio } });
        });
        return this;
    }
    changeAdmin({ sender, signer, newAdmin }) {
        this.resolvers.push(async () => {
            this.group.arc58ChangeAdmin({ ...this.getSendParams({ sender, signer }), args: { newAdmin } });
        });
        return this;
    }
    verifyAuthAddress(params) {
        this.resolvers.push(async () => {
            this.group.arc58VerifyAuthAddress({ ...this.getSendParams(params), args: {} });
        });
        return this;
    }
    rekeyTo({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58RekeyTo({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    canCall({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58CanCall({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    removePlugin({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58RemovePlugin({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    newEscrow({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58NewEscrow({ ...this.getSendParams({ sender, signer }), args });
            this.newEscrows.add(args.escrow);
        });
        return this;
    }
    toggleEscrowLock({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58ToggleEscrowLock({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    reclaimFunds({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58Reclaim({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    optInEscrow({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58OptInEscrow({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    addAllowances({ sender, signer, escrow, allowances }) {
        this.resolvers.push(async () => {
            this.group.arc58AddAllowances({
                ...this.getSendParams({ sender, signer }),
                args: { escrow, allowances: (0, utils_1.AllowancesToTuple)(allowances) }
            });
        });
        return this;
    }
    removeAllowances({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58RemoveAllowances({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    addExecutionKey({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58AddExecutionKey({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    removeExecutionKey({ sender, signer, ...args }) {
        this.resolvers.push(async () => {
            this.group.arc58RemoveExecutionKey({ ...this.getSendParams({ sender, signer }), args });
        });
        return this;
    }
    // ---------------------------------------------------------------------------
    // Terminal
    // ---------------------------------------------------------------------------
    async send(params) {
        // Resolve all queued operations (builds the atomic group)
        for (const resolver of this.resolvers) {
            await resolver();
        }
        // Build the ATC from the composed group
        const built = await (await this.group.composer()).build();
        const atc = built.atc;
        const length = built.transactions.length;
        // Get suggested params for fee calculation
        const suggestedParams = await this.wallet.client.algorand.getSuggestedParams();
        // Set max fees for all transactions to allow prepareGroupWithCost to work
        const maxFees = new Map(Array.from({ length }, (_, i) => [i, (0, algokit_utils_1.microAlgo)(BigInt(suggestedParams.minFee) * 272n)]));
        // Use prepareGroupWithCost to simulate the group, populate resources,
        // and calculate exact fees for inner transactions
        const { atc: populatedAtc } = await (0, prepare_1.prepareGroupWithCost)(atc, this.wallet.client.algorand.client.algod, {
            coverAppCallInnerTransactionFees: true,
            populateAppCallResources: true
        }, {
            maxFees,
            suggestedParams
        });
        // Send the prepared atomic group
        const result = await this.wallet.client.algorand.newGroup()
            .addAtc(populatedAtc)
            .send(params);
        // Run post-processors (register escrows, update caches)
        for (const postProcessor of this.postProcessors) {
            await postProcessor();
        }
        return result;
    }
}
exports.WalletGroupComposer = WalletGroupComposer;
//# sourceMappingURL=group.js.map