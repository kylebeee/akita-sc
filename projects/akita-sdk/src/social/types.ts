import { MaybeSigner } from '../types';
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer';

// Re-export important types from generated clients
export {
  MetaValue,
  PostValue,
  VoteListValue,
  VotesValue,
  ViewPayWallValue,
  AkitaSocialMbrData,
  TipMbrInfo,
} from '../generated/AkitaSocialClient';

export {
  MetaValue as ImpactMetaValue,
} from '../generated/AkitaSocialImpactClient';

// Re-export DAO types from generated client
export type { SocialFees, AkitaAssets } from '../generated/AkitaDAOClient';

// CID type (36 bytes for IPFS CIDv1)
export type CID = Uint8Array;

// Ref type for posts (32 bytes hash)
export type PostRef = Uint8Array;

// RefType enum matching the contract
export enum RefType {
  Post = 10,
  Asset = 20,
  Address = 30,
  App = 40,
  External = 50,
}

// ============================================================================
// Post-related types
// ============================================================================

export type PostArgs = MaybeSigner & {
  /** Optional timestamp (unix seconds). Auto-set to current time if not provided. Contract validates it's within 60 seconds of chain time. */
  timestamp?: bigint | number;
  /** Optional 24-byte nonce for key derivation. Auto-generated if not provided. */
  nonce?: Uint8Array;
  cid: CID;
  gateId?: bigint | number;
  usePayWall?: boolean;
  payWallId?: bigint | number;
};

export type EditPostArgs = MaybeSigner & {
  /** The new content CID */
  cid: CID;
  /** The post key of the post being edited */
  amendment: PostRef;
};

export type ReplyArgs = MaybeSigner & {
  /** Optional timestamp (unix seconds). Auto-set to current time if not provided. Contract validates it's within 60 seconds of chain time. */
  timestamp?: bigint | number;
  /** Optional 24-byte nonce for key derivation. Auto-generated if not provided. */
  nonce?: Uint8Array;
  cid: CID;
  ref: PostRef;
  refType: RefType;
  gateId?: bigint | number;
  usePayWall?: boolean;
  payWallId?: bigint | number;
  gateTxn?: AppCallMethodCall;
};

// ============================================================================
// Vote-related types
// ============================================================================

export type VoteArgs = MaybeSigner & {
  ref: PostRef;
  refType: RefType;
  isUp: boolean;
};

export type InvertVoteArgs = MaybeSigner & {
  ref: PostRef;
};

export type DeleteVoteArgs = MaybeSigner & {
  ref: PostRef;
};

// ============================================================================
// Reaction-related types
// ============================================================================

export type ReactArgs = MaybeSigner & {
  ref: PostRef;
  refType: RefType;
  nft: bigint | number;
  gateTxn?: AppCallMethodCall;
};

export type DeleteReactionArgs = MaybeSigner & {
  ref: PostRef;
  nft: bigint | number;
};

// ============================================================================
// Graph-related types (follows/blocks)
// ============================================================================

export type FollowArgs = MaybeSigner & {
  address: string;
  gateTxn?: AppCallMethodCall;
};

export type UnfollowArgs = MaybeSigner & {
  address: string;
};

export type BlockArgs = MaybeSigner & {
  address: string;
};

// ============================================================================
// Meta-related types
// ============================================================================

export type InitMetaArgs = MaybeSigner & {
  user?: string;
  automated?: boolean;
  subscriptionIndex?: bigint | number;
  nfd?: bigint | number;
  akitaNFT?: bigint | number;
};

export type UpdateMetaArgs = MaybeSigner & {
  followGateId?: bigint | number;
  addressGateId?: bigint | number;
  subscriptionIndex?: bigint | number;
  nfd?: bigint | number;
  akitaNFT?: bigint | number;
  defaultPayWallId?: bigint | number;
};

// ============================================================================
// PayWall types
// ============================================================================

export enum PayWallType {
  OneTimePayment = 0,
  Subscription = 1
}

export type PayWallPayOption = {
  type: PayWallType;
  assetOrSubId: bigint | number;
  amount: bigint | number;
};

export type CreatePayWallArgs = MaybeSigner & {
  userPayInfo: PayWallPayOption[];
  agentPayInfo: PayWallPayOption[];
};

// ============================================================================
// Moderation types
// ============================================================================

export type AddModeratorArgs = MaybeSigner & {
  address: string;
};

export type BanArgs = MaybeSigner & {
  address: string;
  expiration: bigint | number;
};

export type FlagPostArgs = MaybeSigner & {
  ref: PostRef;
};

// ============================================================================
// SDK Constructor types
// ============================================================================

export type SocialSDKParams = {
  socialAppId: bigint;
  graphAppId: bigint;
  impactAppId: bigint;
  ipfsUrl?: string;
};
