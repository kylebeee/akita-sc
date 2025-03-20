import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";

export type PollType = uint64

export type arc4PollType = arc4.UintN64

export const SingleChoice: PollType = 0
export const MultipleChoice: PollType = 1
export const SingleChoiceImpact: PollType = 2
export const MultipleChoiceImpact: PollType = 3

export const arc4SingleChoice: arc4PollType = new arc4.UintN64(SingleChoice)
export const arc4MultipleChoice: arc4PollType = new arc4.UintN64(MultipleChoice)
export const arc4SingleChoiceImpact: arc4PollType = new arc4.UintN64(SingleChoiceImpact)
export const arc4MultipleChoiceImpact: arc4PollType = new arc4.UintN64(MultipleChoiceImpact)