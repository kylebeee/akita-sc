import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, Bool, StaticArray, Uint64 } from "@algorandfoundation/algorand-typescript/arc4"

export type WeightLocation = uint64

export type BidInfo = {
    address: Address
    amount: uint64
    marketplace: Address
    refunded: boolean
}

export class arc4BidInfo extends arc4.Struct<{
    address: Address
    amount: Uint64
    marketplace: Address
    refunded: Bool
}> {}

export type FindWinnerCursors = {
    startingIndex: uint64
    currentRangeStart: uint64
}

export class arc4FindWinnerCursors extends arc4.Struct<{
    startingIndex: Uint64
    currentRangeStart: Uint64
}> {}

export type WeightsList = StaticArray<Uint64, 4096>

export type AuctionMBRData = {
    bids: uint64
    weights: uint64
    bidsByAddress: uint64
    locations: uint64
}