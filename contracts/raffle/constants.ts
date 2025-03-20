import { uint64 } from "@algorandfoundation/algorand-typescript"

export const appCreatorsMBR: uint64 = 18_500

export const RaffleGlobalStateKeyTicketAsset = 'ticket_asset'
export const RaffleGlobalStateKeyStartingRound = 'starting_round'
export const RaffleGlobalStateKeyEndingRound = 'ending_round'
export const RaffleGlobalStateKeySeller = 'seller'
export const RaffleGlobalStateKeyMinTickets = 'min_tickets'
export const RaffleGlobalStateKeyMaxTickets = 'max_tickets'
export const RaffleGlobalStateKeyEntryCount = 'entry_count'
export const RaffleGlobalStateKeyTicketCount = 'ticket_count'
export const RaffleGlobalStateKeyWinningTicket = 'winning_ticket'
export const RaffleGlobalStateKeyWinner = 'winner'
export const RaffleGlobalStateKeyPrize = 'prize'
export const RaffleGlobalStateKeyPrizeClaimed = 'prize_claimed'
export const RaffleGlobalStateKeyGateID = 'gate_id'
export const RaffleGlobalStateKeyVRFFailureCount = 'vrf_failure_count'
export const RaffleGlobalStateKeyEntryID = 'entry_id'
export const RaffleGlobalStateKeyWeightsBoxCount = 'weights_box_count'
export const RaffleGlobalStateKeyWeightTotals = 'w_totals'
export const RaffleGlobalStateKeyFindWinnersCursor = 'find_winner_cursors'
export const RaffleGlobalStateKeyRefundMBRCursor = 'refund_mbr_cursor'
export const RaffleGlobalStateKeySalt = 'salt'

export const RaffleBoxPrefixEntries = 'e'
export const RaffleBoxPrefixWeights = 'w'
export const RaffleBoxPrefixEntriesByAddress = 'a'

const entriesByAddressMBR: uint64 = 18_900
const entryMBR: uint64 = 18_900

export const weightsListMBR: uint64 = 13_113_300
export const entryTotalMBR: uint64 = entryMBR + entriesByAddressMBR

export const BoxWeightTotalsSize: uint64 = 15
// 4096*8 bytes = 32KB
export const ChunkSize: uint64 = 4096
export const MaxChunksPerGroup: uint64 = 4
// 8 references per txn * 16 group size / 32 references per box * box holding 4096 entries = 16_384
export const MaxIterationsPerGroup: uint64 = 16_384
// 4 accounts per txn * 16 group size = 64
export const MaxRefundIterationsPerGroup: uint64 = 64