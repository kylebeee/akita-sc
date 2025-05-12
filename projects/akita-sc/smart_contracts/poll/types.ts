import { arc4 } from '@algorandfoundation/algorand-typescript'
import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export type PollType = UintN8

export type arc4PollType = arc4.UintN64

export const SingleChoice: PollType = new UintN8(0)
export const MultipleChoice: PollType = new UintN8(1)
export const SingleChoiceImpact: PollType = new UintN8(2)
export const MultipleChoiceImpact: PollType = new UintN8(3)