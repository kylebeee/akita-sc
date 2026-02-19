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
exports.StakingPoolSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const StakingPoolClient_1 = require("../generated/StakingPoolClient");
__exportStar(require("./factory"), exports);
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with an individual Staking Pool contract.
 * Use this to manage pool state, add rewards, and handle entries.
 */
class StakingPoolSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: StakingPoolClient_1.StakingPoolFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the pool.
     */
    async getState() {
        const { return: state } = await this.client.send.getState({ args: {} });
        if (state === undefined) {
            throw new Error('Failed to get pool state');
        }
        return state;
    }
    /**
     * Checks if pool signups are currently open.
     */
    async signUpsOpen() {
        const isOpen = await this.client.signUpsOpen();
        return isOpen ?? false;
    }
    /**
     * Checks if the pool is currently live (active).
     */
    async isLive() {
        const isLive = await this.client.isLive();
        return isLive ?? false;
    }
    /**
     * Checks if an address is entered in the pool.
     */
    async isEntered({ address }) {
        const entered = await this.client.isEntered({ args: { address } });
        return entered ?? false;
    }
    /**
     * Checks eligibility and stake amount for an address/asset combination.
     */
    async check({ address, asset }) {
        const { return: result } = await this.client.send.check({ args: { address, asset } });
        if (result === undefined) {
            throw new Error('Failed to check eligibility');
        }
        return {
            isEligible: result.valid,
            stake: result.balance
        };
    }
    async gateCheck({ gateTxn, address, asset }) {
        await this.client.send.gateCheck({ args: { gateTxn, address, asset } });
    }
    /**
     * Gets MBR data for the pool based on winning tickets count.
     */
    async getMbr({ winningTickets }) {
        const { return: mbrData } = await this.client.send.mbr({ args: { winningTickets } });
        if (mbrData === undefined) {
            throw new Error('Failed to get MBR data');
        }
        return mbrData;
    }
    async getReward(rewardId) {
        const reward = await this.client.state.box.rewards.value(rewardId);
        if (reward === undefined) {
            throw new Error('Failed to get reward');
        }
        return reward;
    }
    async getRewards() {
        const rewards = await this.client.state.box.rewards.getMap();
        return new Map(Array.from(rewards.entries()).map(([key, value]) => [Number(key), value]));
    }
    // ========== Write Methods ==========
    /**
     * Initializes the pool after creation.
     */
    async init(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.init({
            ...sendParams,
            args: {}
        });
    }
    /**
     * Opts the pool contract into an asset.
     */
    async optIn({ sender, signer, asset }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const cost = await this.client.optInCost({ args: { asset } });
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        const group = this.client.newGroup();
        group.optIn({
            ...sendParams,
            args: {
                payment,
                asset
            }
        });
        group.opUp({
            ...sendParams,
            args: {},
        });
        return await group.send({ ...sendParams, });
    }
    /**
     * Adds a reward to the pool.
     */
    async addReward({ sender, signer, reward, amount }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get MBR for reward
        const mbrData = await this.getMbr({ winningTickets: reward.winnerCount });
        const payment = this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(mbrData.rewards),
            receiver: this.client.appAddress,
        });
        const assetXfer = this.client.algorand.createTransaction.assetTransfer({
            ...sendParams,
            amount: BigInt(amount),
            assetId: BigInt(reward.asset),
            receiver: this.client.appAddress,
        });
        await this.client.send.addRewardAsa({
            ...sendParams,
            args: {
                payment,
                assetXfer,
                reward
            }
        });
    }
    /**
     * Finalizes the pool with signup, start, and end timestamps.
     */
    async finalize({ sender, signer, signupTimestamp, startTimestamp, endTimestamp }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.finalize({
            ...sendParams,
            args: {
                signupTimestamp,
                startTimestamp,
                endTimestamp
            }
        });
    }
    /**
     * Gets the cost to enter the pool for a given address and entry count.
     * This calls the contract's enterCost method which accounts for box MBR and any pool funding shortfall.
     */
    async enterCost({ address, entryCount }) {
        return await this.client.enterCost({
            args: { address, entryCount }
        });
    }
    /**
     * Enters the pool with specified entries.
     */
    async enter({ sender, signer, entries, gateTxn }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the total cost from the contract (includes box MBR + any pool funding shortfall)
        const paymentAmount = await this.enterCost({
            address: sendParams.sender.toString(),
            entryCount: entries.length
        });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(paymentAmount),
            receiver: this.client.appAddress,
        });
        // Transform entries to the expected format
        const formattedEntries = entries.map(e => [
            e.asset,
            e.amount,
            e.proofs ?? []
        ]);
        const isGated = gateTxn !== undefined;
        if (isGated) {
            await this.client.send.gatedEnter({
                ...sendParams,
                extraFee: (0, algokit_utils_1.microAlgo)(1000 * entries.length), // Cover inner transactions to Staking contract
                args: {
                    payment,
                    gateTxn,
                    entries: formattedEntries,
                }
            });
        }
        else {
            await this.client.send.enter({
                ...sendParams,
                extraFee: (0, algokit_utils_1.microAlgo)(1000 * entries.length), // Cover inner transactions to Staking contract
                args: {
                    payment,
                    entries: formattedEntries,
                }
            });
        }
    }
    /**
     * Starts the disbursement phase for a reward.
     */
    async startDisbursement({ sender, signer, rewardId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.startDisbursement({
            ...sendParams,
            args: { rewardId }
        });
    }
    /**
     * Runs a raffle for a raffle-type reward.
     */
    async raffle({ sender, signer, rewardId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.raffle({
            ...sendParams,
            args: { rewardId }
        });
    }
    /**
     * Disburses rewards to participants.
     */
    async disburseRewards({ sender, signer, rewardId, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.disburseRewards({
            ...sendParams,
            args: {
                rewardId,
                iterationAmount
            }
        });
    }
    /**
     * Finalizes the distribution for a reward.
     */
    async finalizeDistribution({ sender, signer, rewardId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.finalizeDistribution({
            ...sendParams,
            args: { rewardId }
        });
    }
    /**
     * Updates the Akita DAO escrow reference.
     */
    async updateAkitaDAOEscrow({ sender, signer, app }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDaoEscrow({
            ...sendParams,
            args: { app }
        });
    }
    /**
     * Updates the Akita DAO reference.
     */
    async updateAkitaDAO({ sender, signer, akitaDao }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDao({
            ...sendParams,
            args: { akitaDao }
        });
    }
}
exports.StakingPoolSDK = StakingPoolSDK;
//# sourceMappingURL=index.js.map