import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export type PollType = Uint8

export const SingleChoice: PollType = new Uint8(10)
export const MultipleChoice: PollType = new Uint8(20)
export const SingleChoiceImpact: PollType = new Uint8(30)
export const MultipleChoiceImpact: PollType = new Uint8(40)