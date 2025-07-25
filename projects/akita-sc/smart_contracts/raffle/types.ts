import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'
import { ServiceFactoryContractMBRData } from '../utils/functions'

export type WeightLocation = {
  entryID: uint64
  location: uint64
}

export type arc4WeightLocation = Uint64

export type EntryData = {
  address: Address
  marketplace: Address
}

export type arc4WeightsList = arc4.StaticArray<Uint64, 4096>

export type FindWinnerCursors = { index: uint64; amountIndex: uint64 }

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
  ticketAsset: Uint64
  startingRound: Uint64
  endingRound: Uint64
  seller: Address
  minTickets: Uint64
  maxTickets: Uint64
  entryCount: Uint64
  ticketCount: Uint64
  winningTicket: Uint64
  winner: Address
  prize: Uint64
  prizeClaimed: arc4.Bool
  gateID: Uint64
  vrfFailureCount: Uint64
  entryID: Uint64
  refundMBRCursor: Uint64
}> { }

export type RaffleMBRData = {
  entries: uint64
  weights: uint64
  entriesByAddress: uint64
}

export type ExtendedRaffleMBRData = RaffleMBRData & ServiceFactoryContractMBRData