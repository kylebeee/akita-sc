import { arc4, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'

export const arc4Zero = new arc4.Uint64(0)

export const MIN_PROGRAM_PAGES: uint64 = 100_000
export const MAX_PROGRAM_PAGES: uint64 = 400_000
export const GLOBAL_STATE_KEY_UINT_COST: uint64 = 28_500
export const GLOBAL_STATE_KEY_BYTES_COST: uint64 = 50_000

export const Uint64ByteLength: uint64 = 8
export const AccountLength: uint64 = 32

export const BoxCostPerBox: uint64 = 2_500
export const BoxCostPerByte: uint64 = 400

export const DynamicOffset: uint64 = 2
export const DynamicLength: uint64 = 2

export const MAX_IMPACT: uint64 = 1_000

export const IMPACT_DIVISOR: uint64 = MAX_IMPACT // MAX IMPACT
export const DIVISOR: uint64 = 100_000 // 100%

export const MIN_POST_FEE: uint64 = 10 // 0.000010 AKTA or 10 keets
export const MAX_POST_FEE: uint64 = 100_000_000_000 // 100K AKTA
export const MIN_REACT_FEE: uint64 = 10 // 0.000010 AKTA or 10 keets
export const MAX_REACT_FEE: uint64 = 10_000_000_000 // 10K AKTA
export const MIN_IMPACT_TAX_MIN: uint64 = 10 // 0.01%
export const MIN_IMPACT_TAX_MAX: uint64 = 1_000 // 1%
export const MIN_POOL_IMPACT_TAX_MIN: uint64 = 10 // 0.01%
export const MIN_POOL_IMPACT_TAX_MAX: uint64 = 1_000 // 1%
export const MIN_PAYMENT_PERCENTAGE: uint64 = 1_000 // 1%
export const MIN_TRIGGER_PERCENTAGE: uint64 = 10 // 0.01%
export const MIN_MARKETPLACE_SALE_PERCENTAGE_MINIMUM: uint64 = 10 // 0.01%
export const MIN_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM: uint64 = 1_000 // 1%
export const MIN_MARKETPLACE_COMPOSABLE_PERCENTAGE: uint64 = 10 // 0.01%
export const MIN_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE: uint64 = 1_000 // 1%
export const MIN_AUCTION_SALE_IMPACT_TAX_MIN: uint64 = 10 // 0.01%
export const MIN_AUCTION_SALE_IMPACT_TAX_MAX: uint64 = 1_000 // 1%
export const MIN_RAFFLE_SALE_IMPACT_TAX_MIN: uint64 = 10 // 0.01%
export const MIN_RAFFLE_SALE_IMPACT_TAX_MAX: uint64 = 1_000 // 1%
export const MIN_SWAP_IMPACT_TAX_MIN: uint64 = 10 // 0.01%
export const MIN_SWAP_IMPACT_TAX_MAX: uint64 = 1_000 // 1%

export const ONE_PERCENT: uint64 = 1_000
export const TWENTY_FIVE_PERCENT: uint64 = 25_000

export const CreatorRoyaltyDefault: uint64 = 5_000 // 5%
export const CreatorRoyaltyMaximumSingle: uint64 = 50_000 // 50%
export const CreatorRoyaltyMaximumBundle: uint64 = 10_000 // 10%

export const MAX_UINT64: uint64 = Uint64('18446744073709551615')

export const CID_LENGTH: uint64 = 36

export const ACCOUNT_LENGTH: uint64 = 58

export const AkitaDomain: string = 'akita.community'

export const AkitaNFTCreatorAddress = 'AKCTRDK4OWNWHTPH4XPKLNWNLZ333VE35SKQ4FGQK3ZJA4FIHCLTRG3PFI'

export const AkitaCollectionsPrefixAKC = 'AKC'
export const AkitaCollectionsPrefixAOG = 'AOG'

export const FIVE_ALGO: uint64 = 5_000_000

export const ONE_YEAR_IN_DAYS: uint64 = 365
export const ONE_DAY: uint64 = 86_400
export const ONE_WEEK: uint64 = 604_800