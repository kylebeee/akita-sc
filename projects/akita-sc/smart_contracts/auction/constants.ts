import { uint64 } from "@algorandfoundation/algorand-typescript"

/**
 * this means the maximum fee is 60%
 * at first i thought 15% max was reasonable
 * but loafpickle pointed out free mints with
 * high royalties are a good use case
 * marketplaceRoyalty are double sided
 * listing interface can take a fee & so
 * can selling interface, listing side sets
 * the fee and maxes out at 5% so 10% marketplace
 * fee total limit
 */
export const creatorRoyaltyDefault: uint64 = 5_000
export const creatorRoyaltyMaximum: uint64 = 50_000

export const AuctionGlobalStateKeyPrize = 'prize'
export const AuctionGlobalStateKeyIsPrizeBox = 'is_prize_box'
export const AuctionGlobalStateKeyPrizeClaimed = 'prize_claimed'
export const AuctionGlobalStateKeyBidAsset = 'bid_asset'
export const AuctionGlobalStateKeyBidFee = 'bid_fee'
export const AuctionGlobalStateKeyStartingBid = 'starting_bid'
export const AuctionGlobalStateKeyBidMinimumIncrease = 'bid_minimum_increase'
export const AuctionGlobalStateKeyStartTimestamp = 'start_timestamp'
export const AuctionGlobalStateKeyEndTimestamp = 'end_timestamp'
export const AuctionGlobalStateKeySeller = 'seller'
export const AuctionGlobalStateKeyCreatorRoyalty = 'creator_royalty'
export const AuctionGlobalStateKeyMarketplace = 'marketplace'
export const AuctionGlobalStateKeyMarketplaceRoyalties = 'marketplace_royalties'
export const AuctionGlobalStateKeyGateID = 'gate_id'
export const AuctionGlobalStateKeyVRFFailureCount = 'vrf_failure_count'
export const AuctionGlobalStateKeyRefundCount = 'refund_count'
export const AuctionGlobalStateKeyBidTotal = 'bid_total'
export const AuctionGlobalStateKeyWeightedBidTotal = 'weighted_bid_total'
export const AuctionGlobalStateKeyHighestBid = 'highest_bid'
export const AuctionGlobalStateKeyBidID = 'bid_id'
export const AuctionGlobalStateKeyRaffleAmount = 'raffle_amount'
export const AuctionGlobalStateKeyRafflePrizeClaimed = 'raffle_prize_claimed'
export const AuctionGlobalStateKeyUniqueAddressCount = 'unique_address_count'
export const AuctionGlobalStateKeyWeightsBoxCount = 'weights_box_count'
export const AuctionGlobalStateKeyWeightTotals = 'w_totals'
export const AuctionGlobalStateKeyFindWInnerCursors = 'find_winner_cursors'
export const AuctionGlobalStateKeyRefundMBRCursor = 'refund_mbr_cursor'
export const AuctionGlobalStateKeyWinningTicket = 'winning_ticket'
export const AuctionGlobalStateKeyRaffleWinner = 'raffle_winner'
export const AuctionGlobalStateKeySalt = 'salt'

export const AuctionBoxPrefixBids = 'b'
export const AuctionBoxPrefixWeights = 'w'
export const AuctionBoxPrefixBidsByAddress = 'a'
export const AuctionBoxPrefixLocations = 'l'

// sniping is defined as bidding in the last 45 rounds (~2 minutes at 2.7s blocktime)
export const SNIPE_RANGE: uint64 = 120
// if a snipe bid takes place, extend the auction by an additional 120 (~5 minutes at 2.7s blocktime)
export const SNIPE_EXTENSION: uint64 = 300
// 4096*8 bytes = 32KB
export const ChunkSize: uint64 = 4096
export const MaxChunksPerGroup: uint64 = 4
// 4 accounts per txn * 16 group size = 64
export const MaxRefundIterationsPerGroup: uint64 = 64

