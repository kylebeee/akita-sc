"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const config_1 = require("../config");
const RewardsClient_1 = require("../generated/RewardsClient");
__exportStar(require("./types"), exports);
/** Base references available per transaction */
const BASE_REFERENCES = 8;
/** References added by each opUp call */
const REFERENCES_PER_OPUP = 8;
/**
 * SDK for interacting with the Rewards contract.
 * Use this to create disbursements, manage allocations, and claim/reclaim rewards.
 */
class RewardsSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: RewardsClient_1.RewardsFactory, ...params }, config_1.ENV_VAR_NAMES.REWARDS_APP_ID);
    }
    // ========== OpUp Helpers ==========
    /**
     * Calculates the number of opUp calls needed for a given reference count.
     * @param referencesNeeded - Number of references needed for the operation
     * @param baseReferences - Base references available (default 8)
     * @returns Number of opUp calls needed (0 if none needed)
     */
    calculateOpUpsNeeded(referencesNeeded, baseReferences = BASE_REFERENCES) {
        if (referencesNeeded <= baseReferences) {
            return 0;
        }
        return Math.ceil((referencesNeeded - baseReferences) / REFERENCES_PER_OPUP);
    }
    /**
     * Adds the required number of opUp calls to a transaction group.
     * Each opUp call adds 8 more reference slots to the group.
     */
    addOpUps(group, count, sendParams) {
        for (let i = 0; i < count; i++) {
            group.opUp({
                ...sendParams,
                args: {},
                // Add unique note to avoid duplicate transaction issues
                note: i > 0 ? `opUp-${i}` : undefined,
            });
        }
    }
    // ========== Read Methods ==========
    /**
     * Gets the current global state of the rewards contract.
     */
    async getState() {
        const state = await this.client.state.global.getAll();
        return {
            disbursementId: state.disbursementId ?? 1n,
            version: state.version ?? '',
            akitaDao: state.akitaDao ?? 0n,
        };
    }
    /**
     * Gets the MBR (Minimum Balance Requirement) data for creating disbursements.
     * @param title - The disbursement title
     * @param note - The disbursement note
     */
    async mbr({ title, note }) {
        return await this.client.mbr({ args: { title, note } });
    }
    /**
     * Gets a specific disbursement by ID.
     */
    async getDisbursement({ id }) {
        const disbursement = await this.client.state.box.disbursements.value(id);
        if (disbursement === undefined) {
            throw new Error(`Disbursement ${id} not found`);
        }
        return disbursement;
    }
    /**
     * Gets all disbursements as a map.
     */
    async getDisbursements() {
        const disbursements = await this.client.state.box.disbursements.getMap();
        return new Map(Array.from(disbursements.entries()).map(([key, value]) => [BigInt(key), value]));
    }
    /**
     * Gets a user's allocation for a specific disbursement and asset.
     */
    async getUserAllocation({ address, disbursementId, asset }) {
        const allocation = await this.client.state.box.userAllocations.value({
            address,
            disbursementId: BigInt(disbursementId),
            asset: BigInt(asset),
        });
        if (allocation === undefined) {
            throw new Error(`Allocation not found for address ${address}, disbursement ${disbursementId}`);
        }
        return allocation;
    }
    /**
     * Checks if a user has an allocation for a specific disbursement and asset.
     */
    async hasAllocation({ address, disbursementId, asset }) {
        try {
            const allocation = await this.client.state.box.userAllocations.value({
                address,
                disbursementId: BigInt(disbursementId),
                asset: BigInt(asset),
            });
            return allocation !== undefined;
        }
        catch {
            return false;
        }
    }
    // ========== Write Methods ==========
    /**
     * Opts the rewards contract into an asset.
     */
    async optIn({ sender, signer, asset }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Asset opt-in costs 100,000 microAlgo
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(100000),
            receiver: this.client.appAddress,
        });
        await this.client.send.optIn({
            ...sendParams,
            args: {
                payment,
                asset,
            },
        });
    }
    /**
     * Creates a new disbursement.
     * Returns the disbursement ID.
     */
    async createDisbursement({ sender, signer, title, timeToUnlock, expiration, note, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get MBR for this disbursement
        const mbrData = await this.mbr({ title, note });
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrData.disbursements),
            receiver: this.client.appAddress,
        });
        const { return: disbursementId } = await this.client.send.createDisbursement({
            ...sendParams,
            args: {
                mbrPayment,
                title,
                timeToUnlock,
                expiration,
                note,
            },
        });
        if (disbursementId === undefined) {
            throw new Error('Failed to create disbursement');
        }
        return disbursementId;
    }
    /**
     * Edits an existing disbursement (only before finalization).
     */
    async editDisbursement({ sender, signer, id, title, timeToUnlock, expiration, note, }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.editDisbursement({
            ...sendParams,
            args: {
                id,
                title,
                timeToUnlock,
                expiration,
                note,
            },
        });
    }
    /**
     * Helper to format allocations for the contract.
     */
    formatAllocations(allocations) {
        return allocations.map(a => [a.address, a.amount]);
    }
    /**
     * Calculates the total amount from allocations.
     */
    sumAllocations(allocations) {
        return allocations.reduce((sum, a) => sum + BigInt(a.amount), 0n);
    }
    /**
     * Creates ALGO allocations for a disbursement.
     * The payment includes both MBR for the boxes and the actual ALGO to distribute.
     * Automatically adds opUp calls for large allocation batches.
     */
    async createUserAllocations({ sender, signer, id, allocations, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get disbursement to calculate MBR
        const disbursement = await this.getDisbursement({ id });
        const mbrData = await this.mbr({ title: disbursement.title, note: disbursement.note });
        // MBR per allocation + total ALGO to distribute
        const mbrAmount = mbrData.userAllocations * BigInt(allocations.length);
        const totalAmount = this.sumAllocations(allocations);
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrAmount + totalAmount),
            receiver: this.client.appAddress,
        });
        // Each allocation needs ~1 box reference, plus 1 for disbursement box
        const referencesNeeded = allocations.length + 1;
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        if (opUpsNeeded === 0) {
            // No opUps needed, send directly
            await this.client.send.createUserAllocations({
                ...sendParams,
                args: {
                    payment,
                    id,
                    allocations: this.formatAllocations(allocations),
                },
            });
        }
        else {
            // Use transaction group with opUps
            const group = this.client.newGroup();
            group.createUserAllocations({
                ...sendParams,
                args: {
                    payment,
                    id,
                    allocations: this.formatAllocations(allocations),
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            await group.send(sendParams);
        }
    }
    /**
     * Creates ASA allocations for a disbursement.
     * Requires both an MBR payment and an asset transfer.
     * Automatically adds opUp calls for large allocation batches.
     */
    async createAsaUserAllocations({ sender, signer, id, asset, allocations, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get disbursement to calculate MBR
        const disbursement = await this.getDisbursement({ id });
        const mbrData = await this.mbr({ title: disbursement.title, note: disbursement.note });
        const mbrAmount = mbrData.userAllocations * BigInt(allocations.length);
        const totalAmount = this.sumAllocations(allocations);
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrAmount),
            receiver: this.client.appAddress,
        });
        const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
            ...sendParams,
            amount: totalAmount,
            assetId: BigInt(asset),
            receiver: this.client.appAddress,
        });
        // Each allocation needs ~1 box reference, plus 1 for disbursement box, plus 1 for asset
        const referencesNeeded = allocations.length + 2;
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        if (opUpsNeeded === 0) {
            await this.client.send.createAsaUserAllocations({
                ...sendParams,
                args: {
                    mbrPayment,
                    assetXfer,
                    id,
                    allocations: this.formatAllocations(allocations),
                },
            });
        }
        else {
            const group = this.client.newGroup();
            group.createAsaUserAllocations({
                ...sendParams,
                args: {
                    mbrPayment,
                    assetXfer,
                    id,
                    allocations: this.formatAllocations(allocations),
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            await group.send(sendParams);
        }
    }
    /**
     * Finalizes a disbursement, locking it for distribution.
     */
    async finalizeDisbursement({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.finalizeDisbursement({
            ...sendParams,
            args: { id },
        });
    }
    /**
     * Creates and finalizes an ALGO disbursement in a single call.
     * Returns the disbursement ID.
     * Automatically adds opUp calls for large allocation batches.
     */
    async createInstantDisbursement({ sender, signer, timeToUnlock, expiration, allocations, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // MinDisbursementsMBR (35,300) + UserAllocationMBR (25,300) per allocation
        const MIN_DISBURSEMENTS_MBR = 35300n;
        const USER_ALLOCATION_MBR = 25300n;
        const mbrAmount = MIN_DISBURSEMENTS_MBR + (USER_ALLOCATION_MBR * BigInt(allocations.length));
        const totalAmount = this.sumAllocations(allocations);
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrAmount + totalAmount),
            receiver: this.client.appAddress,
        });
        // Each allocation needs ~1 box reference, plus 1 for disbursement box
        const referencesNeeded = allocations.length + 1;
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        let disbursementId;
        if (opUpsNeeded === 0) {
            const result = await this.client.send.createInstantDisbursement({
                ...sendParams,
                args: {
                    mbrPayment,
                    timeToUnlock,
                    expiration,
                    allocations: this.formatAllocations(allocations),
                },
            });
            disbursementId = result.return;
        }
        else {
            const group = this.client.newGroup();
            group.createInstantDisbursement({
                ...sendParams,
                args: {
                    mbrPayment,
                    timeToUnlock,
                    expiration,
                    allocations: this.formatAllocations(allocations),
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            const result = await group.send(sendParams);
            disbursementId = result.returns?.[0];
        }
        if (disbursementId === undefined) {
            throw new Error('Failed to create instant disbursement');
        }
        return disbursementId;
    }
    /**
     * Creates and finalizes an ASA disbursement in a single call.
     * Returns the disbursement ID.
     * Automatically adds opUp calls for large allocation batches.
     */
    async createInstantAsaDisbursement({ sender, signer, timeToUnlock, expiration, asset, allocations, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // MinDisbursementsMBR (35,300) + UserAllocationMBR (25,300) per allocation
        const MIN_DISBURSEMENTS_MBR = 35300n;
        const USER_ALLOCATION_MBR = 25300n;
        const mbrAmount = MIN_DISBURSEMENTS_MBR + (USER_ALLOCATION_MBR * BigInt(allocations.length));
        const totalAmount = this.sumAllocations(allocations);
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrAmount),
            receiver: this.client.appAddress,
        });
        const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
            ...sendParams,
            amount: totalAmount,
            assetId: BigInt(asset),
            receiver: this.client.appAddress,
        });
        // Each allocation needs ~1 box reference, plus 1 for disbursement box, plus 1 for asset
        const referencesNeeded = allocations.length + 2;
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        let disbursementId;
        if (opUpsNeeded === 0) {
            const result = await this.client.send.createInstantAsaDisbursement({
                ...sendParams,
                args: {
                    mbrPayment,
                    assetXfer,
                    timeToUnlock,
                    expiration,
                    allocations: this.formatAllocations(allocations),
                },
            });
            disbursementId = result.return;
        }
        else {
            const group = this.client.newGroup();
            group.createInstantAsaDisbursement({
                ...sendParams,
                args: {
                    mbrPayment,
                    assetXfer,
                    timeToUnlock,
                    expiration,
                    allocations: this.formatAllocations(allocations),
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            const result = await group.send(sendParams);
            disbursementId = result.returns?.[0];
        }
        if (disbursementId === undefined) {
            throw new Error('Failed to create instant ASA disbursement');
        }
        return disbursementId;
    }
    /**
     * Claims rewards from one or more disbursements.
     * The caller claims their allocated rewards.
     * Automatically adds opUp calls for claiming from many disbursements.
     */
    async claimRewards({ sender, signer, rewards }) {
        const sendParams = this.getSendParams({ sender, signer });
        // Format rewards as [id, asset] tuples
        const formattedRewards = rewards.map(r => [r.id, r.asset]);
        // Each claim needs references for: disbursement box, allocation box, possibly asset
        // Plus inner transactions use references
        const referencesNeeded = rewards.length * 3;
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        if (opUpsNeeded === 0) {
            await this.client.send.claimRewards({
                ...sendParams,
                // Extra fee for inner transactions (2 per claim: MBR refund + reward transfer)
                extraFee: (0, algokit_utils_1.microAlgo)(2000 * rewards.length),
                args: {
                    rewards: formattedRewards,
                },
            });
        }
        else {
            const group = this.client.newGroup();
            group.claimRewards({
                ...sendParams,
                extraFee: (0, algokit_utils_1.microAlgo)(2000 * rewards.length),
                args: {
                    rewards: formattedRewards,
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            await group.send(sendParams);
        }
    }
    /**
     * Reclaims unclaimed rewards after a disbursement has expired.
     * Only the disbursement creator can reclaim.
     * Automatically adds opUp calls for reclaiming many allocations.
     */
    async reclaimRewards({ sender, signer, id, reclaims }) {
        const sendParams = this.getSendParams({ sender, signer });
        // Format reclaims as [address, asset] tuples
        const formattedReclaims = reclaims.map(r => [r.address, r.asset]);
        // Each reclaim needs references for: allocation box, possibly asset, receiver account
        const referencesNeeded = reclaims.length * 2 + 1; // +1 for disbursement box
        const opUpsNeeded = this.calculateOpUpsNeeded(referencesNeeded);
        if (opUpsNeeded === 0) {
            await this.client.send.reclaimRewards({
                ...sendParams,
                // Extra fee for inner transactions (2 per reclaim: asset transfer + MBR refund)
                extraFee: (0, algokit_utils_1.microAlgo)(2000 * reclaims.length),
                args: {
                    id,
                    reclaims: formattedReclaims,
                },
            });
        }
        else {
            const group = this.client.newGroup();
            group.reclaimRewards({
                ...sendParams,
                extraFee: (0, algokit_utils_1.microAlgo)(2000 * reclaims.length),
                args: {
                    id,
                    reclaims: formattedReclaims,
                },
            });
            this.addOpUps(group, opUpsNeeded, sendParams);
            await group.send(sendParams);
        }
    }
    /**
     * Updates the Akita DAO reference.
     */
    async updateAkitaDao({ sender, signer, akitaDao }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDao({
            ...sendParams,
            args: { akitaDao },
        });
    }
}
exports.RewardsSDK = RewardsSDK;
//# sourceMappingURL=index.js.map