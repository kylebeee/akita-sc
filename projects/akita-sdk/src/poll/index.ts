import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import {
  PollClient,
  PollFactory,
} from '../generated/PollClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import {
  VoteParams,
  DeleteBoxesParams,
  HasVotedParams,
  PollState,
  VOTES_MBR,
} from "./types";

export * from "./factory";
export * from "./types";

/**
 * SDK for interacting with an individual Poll contract.
 * Use this to vote, check voting status, and manage poll cleanup.
 */
export class PollSDK extends BaseSDK<PollClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: PollFactory, ...params });
  }

  // ========== Read Methods ==========

  /**
   * Gets the current state of the poll.
   */
  async state(): Promise<PollState> {
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
  async hasEnded(): Promise<boolean> {
    const pollState = await this.state();
    const now = BigInt(Math.floor(Date.now() / 1000));
    return now > pollState.endTime;
  }

  /**
   * Checks if a user has voted in the poll.
   */
  async hasVoted({ user }: HasVotedParams): Promise<boolean> {
    const hasVoted = await this.client.hasVoted({ args: { user } });
    return hasVoted ?? false;
  }

  /**
   * Gets the options as an array.
   */
  async getOptions(): Promise<string[]> {
    const pollState = await this.state();
    const options: string[] = [];
    
    if (pollState.optionCount >= 1n) options.push(pollState.optionOne);
    if (pollState.optionCount >= 2n) options.push(pollState.optionTwo);
    if (pollState.optionCount >= 3n) options.push(pollState.optionThree);
    if (pollState.optionCount >= 4n) options.push(pollState.optionFour);
    if (pollState.optionCount >= 5n) options.push(pollState.optionFive);
    
    return options;
  }

  /**
   * Gets the vote counts as an array.
   */
  async getVoteCounts(): Promise<bigint[]> {
    const pollState = await this.state();
    const votes: bigint[] = [];
    
    if (pollState.optionCount >= 1n) votes.push(pollState.votesOne);
    if (pollState.optionCount >= 2n) votes.push(pollState.votesTwo);
    if (pollState.optionCount >= 3n) votes.push(pollState.votesThree);
    if (pollState.optionCount >= 4n) votes.push(pollState.votesFour);
    if (pollState.optionCount >= 5n) votes.push(pollState.votesFive);
    
    return votes;
  }

  // ========== Write Methods ==========

  /**
   * Casts a vote in the poll.
   * Provide `gateTxn` for gated polls.
   * @param votes - Array of option indices (0-based) to vote for
   */
  async vote({ sender, signer, votes, gateTxn }: VoteParams): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const mbrPayment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(VOTES_MBR),
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
    } else {
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
  async deleteBoxes({ sender, signer, addresses }: DeleteBoxesParams): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.deleteBoxes({
      ...sendParams,
      args: { addresses },
    });
  }
}

