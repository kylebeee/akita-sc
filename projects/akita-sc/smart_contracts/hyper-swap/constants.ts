import { uint64 } from "@algorandfoundation/algorand-typescript"
import { UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export const HyperSwapGlobalStateKeyOfferCursor = 'offer_cursor'
export const HyperSwapGlobalStateKeySpendingAccountFactoryApp = 'spending_account_factory_app'

export const HyperSwapBoxPrefixOffers = 'o'
export const HyperSwapBoxPrefixParticipants = 'p'
export const HyperSwapBoxPrefixHashes = 'h'


export const META_MERKLE_ADDRESS_SCHEMA: uint64 = 1
export const META_MERKLE_TRADE_SCHEMA: uint64 = 4
export const META_MERKLE_TRADE_TYPE: uint64 = 3

export const STATE_OFFERED = new UintN8(0) // an offer has been made and is pending acceptance by the other parties
export const STATE_ESCROWING = new UintN8(10) // the offer is accepted by both parties and the contract is collecting the assets
export const STATE_DISBURSING = new UintN8(20) // the contract has collected all assets from both parties and is dispersing the assets to the other parties
export const STATE_COMPLETED = new UintN8(30) // the trade has completed and the contract can be deleted
export const STATE_CANCELLED = new UintN8(40) // the trade was cancelled
export const STATE_CANCEL_COMPLETED = new UintN8(50) // the trade was cancelled and any necessary withdraws completed