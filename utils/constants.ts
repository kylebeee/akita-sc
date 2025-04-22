import { biguint, Uint64, uint64 } from '@algorandfoundation/algorand-typescript'
import { UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

export const arc4Zero = new UintN64(0)

export const DIVISOR: uint64 = 100_000
export const IMPACT_DIVISOR: uint64 = 1_000

export const MAX_UINT64: uint64 = Uint64('18446744073709551615')

export const roundsPerHour: uint64 = 1_333

export const AkitaDomain: string = 'akita.community'

export const EMPTY_BYTES_16 = 'AAAAAAAAAAAAAAAA'
export const EMPTY_BYTES_32 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
export const EMPTY_BYTES_36 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
export const EMPTY_BYTES_59 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

export const AkitaNFTCreatorAddress = 'AKCTRDK4OWNWHTPH4XPKLNWNLZ333VE35SKQ4FGQK3ZJA4FIHCLTRG3PFI'

export const AkitaCollectionsPrefixAKC = 'AKC'
export const AkitaCollectionsPrefixAOG = 'AOG'

export const AkitaAppIDsActionsPoll: uint64 = 0

export const AkitaAppIDsAbstractedAccountFactory: uint64 = 0
export const AkitaAppIDsAbstractedAccount: uint64 = 0

export const AkitaAppIDsAkitaSocialPlugin: uint64 = 0
export const AkitaAppIDsAkitaSocialImpactPlugin: uint64 = 1
export const AkitaAppIDsAkitaHyperSwapPlugin: uint64 = 0
export const AkitaAppIDsAkitaMBRPlugin: uint64 = 0
export const AkitaAppIDsNFDPlugin: uint64 = 0
export const AkitaAppIDsOptinPlugin: uint64 = 0
export const AkitaAppIDsStakingPlugin: uint64 = 0
export const AkitaAppIDsSubscriptionsPlugin: uint64 = 0

export const AkitaAppIDsDAO: uint64 = 0

export const AkitaAppIDsGate: uint64 = 0
export const AkitaAppIDsAssetGate: uint64 = 0
export const AkitaAppIDsFollowerCountGate: uint64 = 0
export const AkitaAppIDsFollowerIndexGate: uint64 = 0
export const AkitaAppIDsImpactGate: uint64 = 0
export const AkitaAppIDsMerkleAddressGate: uint64 = 0
export const AkitaAppIDsMerkleAssetGate: uint64 = 0
export const AkitaAppIDsNFDGate: uint64 = 0
export const AkitaAppIDsStakingAmountGate: uint64 = 0
export const AkitaAppIDsStakingPowerGate: uint64 = 0
export const AkitaAppIDsSubscriptionsGate: uint64 = 0
export const AkitaAppIDsSubscriptionsStreakGate: uint64 = 0

export const AkitaAppIDsHyperSwap: uint64 = 0
export const AkitaAppIDsMetaMerkles: uint64 = 0
export const AkitaAppIDsRewards: uint64 = 0
export const AkitaAppIDsStaking: uint64 = 0
export const AkitaAppIDsSubscriptions: uint64 = 0

export const AkitaAssetAkita: uint64 = 0 // 523683256
export const AkitaAssetBones: uint64 = 0
export const AkitaAssetYoink: uint64 = 0 // 1073483571

export const OtherAppIDsAssetInbox: uint64 = 0
export const OtherAppIDsNFDRegistry: uint64 = 0
export const OtherAppIDsAkitaRootNFD: uint64 = 0
