import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { ServiceFactoryContractMBRData } from '../utils/functions'

export type WeightLocation = uint64

export type arc4WeightLocation = arc4.UintN64

export type EntryInfo = {
    address: Address
    location: WeightLocation
}

export class arc4EntryInfo extends arc4.Struct<{
    address: Address
    location: arc4.UintN64
}> {}

export type arc4WeightsList = arc4.StaticArray<arc4.UintN64, 4096>

export type FindWinnerCursors = { index: uint64; amountIndex: uint64 }

export class arc4FindWinnerCursor extends arc4.Struct<{
    index: arc4.UintN64
    amountIndex: arc4.UintN64
}> {}

export type RaffleState = {
    ticketAsset: uint64
    startTimestamp: uint64
    endTimestamp: uint64
    seller: Address
    minTickets: uint64
    maxTickets: uint64
    entryCount: uint64
    ticketCount: uint64
    winningTicket: uint64
    winner: Address
    prize: uint64
    prizeClaimed: boolean
    gateID: uint64
    vrfFailureCount: uint64
    entryID: uint64
    refundMBRCursor: uint64
}

export class arc4RaffleState extends arc4.Struct<{
    ticketAsset: arc4.UintN64
    startingRound: arc4.UintN64
    endingRound: arc4.UintN64
    seller: Address
    minTickets: arc4.UintN64
    maxTickets: arc4.UintN64
    entryCount: arc4.UintN64
    ticketCount: arc4.UintN64
    winningTicket: arc4.UintN64
    winner: Address
    prize: arc4.UintN64
    prizeClaimed: arc4.Bool
    gateID: arc4.UintN64
    vrfFailureCount: arc4.UintN64
    entryID: arc4.UintN64
    refundMBRCursor: arc4.UintN64
}> {}

export type RaffleMBRData = {
    entries: uint64
    weights: uint64
    entriesByAddress: uint64
}

export type ExtendedRaffleMBRData = RaffleMBRData & ServiceFactoryContractMBRData