import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { uint8 } from '../../utils/types/base'

export type PollType = UintN8

export type arc4PollType = arc4.UintN64

export const SingleChoice: PollType = uint8(0)
export const MultipleChoice: PollType = uint8(1)
export const SingleChoiceImpact: PollType = uint8(2)
export const MultipleChoiceImpact: PollType = uint8(3)