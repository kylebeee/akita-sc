import { uint64 } from '@algorandfoundation/algorand-typescript'

export const RaffleGlobalStateKeyTicketAsset = 'ticket_asset'
export const RaffleGlobalStateKeyStartTimestamp = 'start_timestamp'
export const RaffleGlobalStateKeyEndTimestamp = 'end_timestamp'
export const RaffleGlobalStateKeySeller = 'seller'
export const RaffleGlobalStateKeyMinTickets = 'min_tickets'
export const RaffleGlobalStateKeyMaxTickets = 'max_tickets'
export const RaffleGlobalStateKeyEntryCount = 'entry_count'
export const RaffleGlobalStateKeyTicketCount = 'ticket_count'
export const RaffleGlobalStateKeyWinningTicket = 'winning_ticket'
export const RaffleGlobalStateKeyWinner = 'winner'
export const RaffleGlobalStateKeyPrize = 'prize'
export const RaffleGlobalStateKeyIsPrizeBox = 'is_prize_box'
export const RaffleGlobalStateKeyPrizeClaimed = 'prize_claimed'
export const RaffleGlobalStateKeyCreatorRoyalty = 'creator_royalty'
export const RaffleGlobalStateKeyGateID = 'gate_id'
export const RaffleGlobalStateKeyMarketplace = 'marketplace'
export const RaffleGlobalStateKeyMarketplaceRoyalties = 'marketplace_royalties'
export const RaffleGlobalStateKeyAkitaRoyalty = 'akita_royalty'
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

export const BoxWeightTotalsSize: uint64 = 15

// 4096*8 bytes = 32KB
export const ChunkSize: uint64 = 4096
