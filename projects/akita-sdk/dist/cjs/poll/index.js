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
exports.PollSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const PollClient_1 = require("../generated/PollClient");
const types_1 = require("./types");
__exportStar(require("./factory"), exports);
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with an individual Poll contract.
 * Use this to vote, check voting status, and manage poll cleanup.
 */
class PollSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PollClient_1.PollFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the poll.
     */
    async state() {
        const state = await this.client.state.global.getAll();
        return {
            type: Number(state.type ?? 0),
            gateId: state.gateId ?? 0n,
            endTime: state.endTime ?? 0n,
            optionCount: state.optionCount ?? 0n,
            maxSelected: state.maxSelected ?? 0n,
            boxCount: state.boxCount ?? 0n,
            question: state.question ?? '',
            optionOne: state.optionOne ?? '',
            optionTwo: state.optionTwo ?? '',
            optionThree: state.optionThree ?? '',
            optionFour: state.optionFour ?? '',
            optionFive: state.optionFive ?? '',
            votesOne: state.votesOne ?? 0n,
            votesTwo: state.votesTwo ?? 0n,
            votesThree: state.votesThree ?? 0n,
            votesFour: state.votesFour ?? 0n,
            votesFive: state.votesFive ?? 0n,
        };
    }
    /**
     * Checks if the poll has ended.
     */
    async hasEnded() {
        const pollState = await this.state();
        const now = BigInt(Math.floor(Date.now() / 1000));
        return now > pollState.endTime;
    }
    /**
     * Checks if a user has voted in the poll.
     */
    async hasVoted({ user }) {
        const hasVoted = await this.client.hasVoted({ args: { user } });
        return hasVoted ?? false;
    }
    /**
     * Gets the options as an array.
     */
    async getOptions() {
        const pollState = await this.state();
        const options = [];
        if (pollState.optionCount >= 1n)
            options.push(pollState.optionOne);
        if (pollState.optionCount >= 2n)
            options.push(pollState.optionTwo);
        if (pollState.optionCount >= 3n)
            options.push(pollState.optionThree);
        if (pollState.optionCount >= 4n)
            options.push(pollState.optionFour);
        if (pollState.optionCount >= 5n)
            options.push(pollState.optionFive);
        return options;
    }
    /**
     * Gets the vote counts as an array.
     */
    async getVoteCounts() {
        const pollState = await this.state();
        const votes = [];
        if (pollState.optionCount >= 1n)
            votes.push(pollState.votesOne);
        if (pollState.optionCount >= 2n)
            votes.push(pollState.votesTwo);
        if (pollState.optionCount >= 3n)
            votes.push(pollState.votesThree);
        if (pollState.optionCount >= 4n)
            votes.push(pollState.votesFour);
        if (pollState.optionCount >= 5n)
            votes.push(pollState.votesFive);
        return votes;
    }
    // ========== Write Methods ==========
    /**
     * Casts a vote in the poll.
     * Provide `gateTxn` for gated polls.
     * @param votes - Array of option indices (0-based) to vote for
     */
    async vote({ sender, signer, votes, gateTxn }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const mbrPayment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(types_1.VOTES_MBR),
            receiver: this.client.appAddress,
        });
        if (gateTxn) {
            await this.client.send.gatedVote({
                ...sendParams,
                args: {
                    mbrPayment,
                    gateTxn,
                    votes,
                },
            });
        }
        else {
            await this.client.send.vote({
                ...sendParams,
                args: {
                    mbrPayment,
                    votes,
                },
            });
        }
    }
    /**
     * Deletes vote boxes and refunds MBR to voters.
     * Can only be called after the poll has ended.
     * @param addresses - Array of addresses to refund
     */
    async deleteBoxes({ sender, signer, addresses }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.deleteBoxes({
            ...sendParams,
            args: { addresses },
        });
    }
}
exports.PollSDK = PollSDK;
//# sourceMappingURL=index.js.map