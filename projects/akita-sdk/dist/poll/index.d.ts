import { BaseSDK } from "../base";
import { PollClient } from '../generated/PollClient';
import { NewContractSDKParams } from "../types";
import { VoteParams, DeleteBoxesParams, HasVotedParams, PollState } from "./types";
export * from "./factory";
export * from "./types";
/**
 * SDK for interacting with an individual Poll contract.
 * Use this to vote, check voting status, and manage poll cleanup.
 */
export declare class PollSDK extends BaseSDK<PollClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the poll.
     */
    state(): Promise<PollState>;
    /**
     * Checks if the poll has ended.
     */
    hasEnded(): Promise<boolean>;
    /**
     * Checks if a user has voted in the poll.
     */
    hasVoted({ user }: HasVotedParams): Promise<boolean>;
    /**
     * Gets the options as an array.
     */
    getOptions(): Promise<string[]>;
    /**
     * Gets the vote counts as an array.
     */
    getVoteCounts(): Promise<bigint[]>;
    /**
     * Casts a vote in the poll.
     * Provide `gateTxn` for gated polls.
     * @param votes - Array of option indices (0-based) to vote for
     */
    vote({ sender, signer, votes, gateTxn }: VoteParams): Promise<void>;
    /**
     * Deletes vote boxes and refunds MBR to voters.
     * Can only be called after the poll has ended.
     * @param addresses - Array of addresses to refund
     */
    deleteBoxes({ sender, signer, addresses }: DeleteBoxesParams): Promise<void>;
}
