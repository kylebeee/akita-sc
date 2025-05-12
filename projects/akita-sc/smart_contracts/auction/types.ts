import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, Bool, StaticArray, UintN64, UintN8 } from "@algorandfoundation/algorand-typescript/arc4"
import { ChunkSize } from "./constants"

export type WeightLocation = uint64

export type BidInfo = {
    address: Address
    amount: uint64
    marketplace: Address
    refunded: boolean
}

export class arc4BidInfo extends arc4.Struct<{
    address: Address
    amount: UintN64
    marketplace: Address
    refunded: Bool
}> {}

export type FindWinnerCursors = {
    startingIndex: uint64
    currentRangeStart: uint64
}

export class arc4FindWinnerCursors extends arc4.Struct<{
    startingIndex: UintN64
    currentRangeStart: UintN64
}> {}

export type WeightsList = StaticArray<UintN64, 4096>

export type AuctionMBRData = {
    bids: uint64
    weights: uint64
    bidsByAddress: uint64
    locations: uint64
}