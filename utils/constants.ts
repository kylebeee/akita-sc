import { Contract } from '@algorandfoundation/tealscript';

export const MAX_UINT64 = Uint<64>('18446744073709551615');

export const AkitaDomain = 'akita.community';

export const EMPTY_BYTES_16: bytes<16> = 'AAAAAAAAAAAAAAAA' as bytes<16>;
export const EMPTY_BYTES_32: bytes<32> = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as bytes<32>;
export const EMPTY_BYTES_59: bytes<59> = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' as bytes<59>;

export const AkitaNFTCreatorAddress = addr('AKCTRDK4OWNWHTPH4XPKLNWNLZ333VE35SKQ4FGQK3ZJA4FIHCLTRG3PFI');

export const AkitaCollectionsPrefixAKC = 'AKC';
export const AkitaCollectionsPrefixAOG = 'AOG';

export const AkitaAppIDsActionsPoll = 0;

export const AkitaAppIDsAbstractedAccountFactory = 0;
export const AkitaAppIDsAbstractedAccount = 0;

export const AkitaAppIDsAkitaSocialPlugin = 0;
export const AkitaAppIDsAkitaSocialImpactPlugin = 1;
export const AkitaAppIDsAkitaHyperSwapPlugin = 0;
export const AkitaAppIDsAkitaMBRPlugin = 0;
export const AkitaAppIDsNFDPlugin = 0;
export const AkitaAppIDsOptinPlugin = 0;
export const AkitaAppIDsStakingPlugin = 0;
export const AkitaAppIDsSubscriptionsPlugin = 0;

export const AkitaAppIDsDAO = 0;

export const AkitaAppIDsGate = 0;
export const AkitaAppIDsAssetGate = 0;
export const AkitaAppIDsFollowerCountGate = 0;
export const AkitaAppIDsFollowerIndexGate = 0;
export const AkitaAppIDsImpactGate = 0;
export const AkitaAppIDsMerkleAddressGate = 0;
export const AkitaAppIDsMerkleAssetGate = 0;
export const AkitaAppIDsNFDGate = 0;
export const AkitaAppIDsStakingAmountGate = 0;
export const AkitaAppIDsStakingPowerGate = 0;
export const AkitaAppIDsSubscriptionsGate = 0;
export const AkitaAppIDsSubscriptionsStreakGate = 0;

export const AkitaAppIDsHyperSwap = 0;
export const AkitaAppIDsMetaMerkles = 0;
export const AkitaAppIDsRewards = 0;
export const AkitaAppIDsStaking = 0;
export const AkitaAppIDsSubscriptions = 0;

export const AkitaAssetAkita = 0; // 523683256
export const AkitaAssetBones = 0;
export const AkitaAssetYoink = 0; // 1073483571

export const OtherAppIDsAssetInbox = 0;
export const OtherAppIDsNFDRegistry = 0;
export const OtherAppIDsAkitaRootNFD = 0;