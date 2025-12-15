import { MaybeSigner } from "../types";
import {
  PollArgs,
} from '../generated/PollClient';
import { PollFactoryArgs } from '../generated/PollFactoryClient';
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

// Factory Types
type FactoryContractArgs = PollFactoryArgs["obj"];

export type NewPollParams = MaybeSigner & Omit<
  FactoryContractArgs['new(pay,uint8,uint64,uint64,string,string[],uint64)uint64'],
  'payment'
>;

// Individual Poll Types
type PollContractArgs = PollArgs["obj"];

export type VoteParams = MaybeSigner & {
  /** Array of option indices (0-based) to vote for */
  votes: bigint[];
  /** Optional gate transaction for gated polls */
  gateTxn?: AppCallMethodCall;
};

export type DeleteBoxesParams = MaybeSigner & PollContractArgs['deleteBoxes(address[])void'];

export type HasVotedParams = PollContractArgs['hasVoted(address)bool'];

export type PollState = {
  type: number;
  gateId: bigint;
  endTime: bigint;
  optionCount: bigint;
  maxSelected: bigint;
  boxCount: bigint;
  question: string;
  optionOne: string;
  optionTwo: string;
  optionThree: string;
  optionFour: string;
  optionFive: string;
  votesOne: bigint;
  votesTwo: bigint;
  votesThree: bigint;
  votesFour: bigint;
  votesFive: bigint;
};

// Poll type constants
export enum PollTypeEnum {
  SingleChoice = 10,
  MultipleChoice = 20,
  SingleChoiceImpact = 30,
  MultipleChoiceImpact = 40,
}

// MBR constant for votes box
export const VOTES_MBR = 15_300n;

