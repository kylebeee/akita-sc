import { Contract } from '@algorandfoundation/tealscript';

export type bytes0 = bytes<0>;
export type bytes4 = bytes<4>;
export type bytes16 = bytes<16>;
export type bytes24 = bytes<24>;
export type bytes59 = bytes<59>;

export const AkitaDomain = 'akita.community';

export const EMPTY_BYTES_16: bytes16 = 'AAAAAAAAAAAAAAAA' as bytes16;
export const EMPTY_BYTES_32: bytes32 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as bytes32;
export const EMPTY_BYTES_59: bytes59 = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' as bytes59;

export const AkitaCollectionsPrefixAKC = 'AKC';
export const AkitaCollectionsPrefixAOG = 'AOG';

export const AkitaAppIDsActionsPoll = 0;

export const AkitaAppIDsAbstractedAccountFactory = 0;
export const AkitaAppIDsAbstractedAccount = 0;

export const AkitaAppIDsAkitaSocialPlugin = 0;
export const AkitaAppIDsAkitaHyperSwapPlugin = 0;
export const AkitaAppIDsAkitaMBRPlugin = 0;
export const AkitaAppIDsNFDPlugin = 0;
export const AkitaAppIDsOptinPlugin = 0;
export const AkitaAppIDsStakingPlugin = 0;
export const AkitaAppIDsSubscriptionPlugin = 0;

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
export const AkitaAppIDsSubscriptionGate = 0;
export const AkitaAppIDsSubscriptionStreakGate = 0;

export const AkitaAppIDsMetaMerkles = 0;

export const AkitaAssetAkita = 0; // 523683256
export const AkitaAssetBones = 0;
export const AkitaAssetYoink = 0; // 1073483571

export const OtherAppIDsAssetInbox = 0;
export const OtherAppIDsNFDRegistry = 0;
export const OtherAppIDsAkitaRootNFD = 0;