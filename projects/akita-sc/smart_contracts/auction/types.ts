import { Account, uint64 } from "@algorandfoundation/algorand-typescript"
import { StaticArray, Uint64 } from "@algorandfoundation/algorand-typescript/arc4"

export type WeightLocation = uint64

export type BidInfo = {
  account: Account
  amount: uint64
  marketplace: Account
  refunded: boolean
}

export type FindWinnerCursors = {
  startingIndex: uint64
  currentRangeStart: uint64
}

export type WeightsList = StaticArray<Uint64, 4096>

export type AuctionMBRData = {
  bids: uint64
  weights: uint64
  bidsByAddress: uint64
  locations: uint64
}