import { UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export const HyperSwapGlobalStateKeyOfferCursor = 'offer_cursor'

export const HyperSwapBoxPrefixOffers = 'o'
export const HyperSwapBoxPrefixParticipants = 'p'
export const HyperSwapBoxPrefixHashes = 'h'


export const META_MERKLE_ADDRESS_SCHEMA = 1
export const META_MERKLE_TRADE_SCHEMA = 4
export const META_MERKLE_TRADE_TYPE = 3

export const STATE_OFFERED = new UintN8(0) // an offer has been made and is pending acceptance by the other parties
export const STATE_ESCROWING = new UintN8(1) // the offer is accepted by both parties and the contract is collecting the assets
export const STATE_DISBURSING = new UintN8(2) // the contract has collected all assets from both parties and is dispersing the assets to the other parties
export const STATE_COMPLETED = new UintN8(3) // the trade has completed and the contract can be deleted
export const STATE_CANCELLED = new UintN8(4) // the trade was cancelled
export const STATE_CANCEL_COMPLETED = new UintN8(5) // the trade was cancelled and any necessary withdraws completed