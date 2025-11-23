import { Account, arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

export type WeightLocation = {
  entryID: uint64
  location: uint64
}

export type arc4WeightLocation = Uint64

export type EntryData = {
  account: Account
  marketplace: Account
}

export type arc4WeightsList = arc4.StaticArray<Uint64, 4096>

export type FindWinnerCursors = { index: uint64; amountIndex: uint64 }

export type RaffleState = {
  ticketAsset: uint64
  startTimestamp: uint64
  endTimestamp: uint64
  seller: Account
  minTickets: uint64
  maxTickets: uint64
  entryCount: uint64
  ticketCount: uint64
  winningTicket: uint64
  winner: Account
  prize: uint64
  prizeClaimed: boolean
  gateID: uint64
  vrfFailureCount: uint64
  entryID: uint64
  refundMBRCursor: uint64
}

export type RaffleMBRData = {
  entries: uint64
  weights: uint64
  entriesByAddress: uint64
}

export type ExtendedRaffleMBRData = RaffleMBRData