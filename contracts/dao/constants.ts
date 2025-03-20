import { uint64 } from "@algorandfoundation/algorand-typescript";

export const AkitaDAOGlobalStateKeysStatus = 'status';
export const AkitaDAOGlobalStateKeysContentPolicy = 'content_policy';
export const AkitaDAOGlobalStateKeysMinimumRewardsImpact = 'minimum_rewards_impact';
export const AkitaDAOGlobalStateKeysAppList = 'app_list';
export const AkitaDAOGlobalStateKeysSocialFees = 'social_fees';
export const AkitaDAOGlobalStateKeysStakingFees = 'staking_fees';
export const AkitaDAOGlobalStateKeysSubscriptionFees = 'subscription_fees';
export const AkitaDAOGlobalStateKeysNFTFees = 'nft_fees';
export const AkitaDAOGlobalStateKeysKrbyPercentage = 'krby_percentage';
export const AkitaDAOGlobalStateKeysModeratorPercentage = 'mod_percentage';
export const AkitaDAOGlobalStateKeysAkitaAssets = 'akita_assets';
export const AkitaDAOGlobalStateKeysProposalSettings = 'proposal_settings';
export const AkitaDAOGlobalStateKeysRevocationAddress = 'revocation_address';
export const AkitaDAOGlobalStateKeysProposalID = 'proposal_id';
export const AkitaDAOGlobalStateKeysDisbursementCursor = 'disbursement_cursor';

export const AkitaDAOBoxPrefixProposals = 'p'
export const AkitaDAOBoxPrefixExecutions = 'e'

export const STATUS_INIT: uint64 = 0;
// const STATUS_LOADING_REWARDS = 1;
// const STATUS_DISTRIBUTING_REWARDS = 2;
// const STATUS_RUNNING = 3;

// const DEFAULT_VERSION: string = '1.0';
// const DEFAULT_CONTENT_POLICY: string = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
// const DEFAULT_MINIMUM_REWARDS_IMPACT = 400;
// const DEFAULT_SOCIAL_POST_FEE = 100_000_000;
// const DEFAULT_SOCIAL_REACT_FEE = 10_000_000;
// const DEFAULT_STAKING_POOL_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_SERVICE_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE_FEE = 4;
// const DEFAULT_OMNIGEM_SALE_FEE = 100_000_000;
// const DEFAULT_NFT_LISTING_CREATION_FEE = 1_000_000;
// const DEFAULT_NFT_SHUFFLE_CREATION_FEE = 10_000_000;
// const DEFAULT_AUCTION_CREATION_FEE = 10_000_000;
// const DEFAULT_HYPER_SWAP_FEE = 10_000_000;
// const DEFAULT_KRBY_PERCENTAGE_FEE = 30;
// const DEFAULT_MODERATOR_PERCENTAGE_FEE = 4;
// const DEFAULT_MINIMUM_PROPOSAL_THRESHOLD = 10;
// const DEFAULT_MINIMUM_VOTE_THRESHOLD = 10;

export const STATUS_DRAFT: uint64 = 0;
export const STATUS_INVALID: uint64 = 1;
export const STATUS_PROPOSED: uint64 = 2;
export const STATUS_VOTING: uint64 = 3;

export const STATUS_REJECTED: uint64 = 9;
export const STATUS_APPROVED: uint64 = 10;

export const PROPOSAL_TYPE_UPDATE_CONTENT_POLICY: uint64 = 0;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_REWARD_IMPACT: uint64 = 1;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_POST_FEE: uint64 = 2;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_REACT_FEE: uint64 = 3;
export const PROPOSAL_TYPE_UPDATE_STAKING_POOL_CREATION_FEE: uint64 = 4;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_SERVICE_CREATION_FEE: uint64 = 5;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_PAYMENT_FEE: uint64 = 6;
export const PROPOSAL_TYPE_UPDATE_OMNIGEM_SALE_FEE: uint64 = 7;
export const PROPOSAL_TYPE_UPDATE_NFT_LISTING_CREATION_FEE: uint64 = 8;
export const PROPOSAL_TYPE_UPDATE_NFT_SHUFFLE_CREATION_FEE: uint64 = 9;
export const PROPOSAL_TYPE_UPDATE_AUCTION_CREATION_FEE: uint64 = 10;
export const PROPOSAL_TYPE_UPDATE_HYPER_SWAP_FEE: uint64 = 11;
export const PROPOSAL_TYPE_UPDATE_KRBY_FEE: uint64 = 12;
export const PROPOSAL_TYPE_UPDATE_MODERATOR_FEE: uint64 = 13;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_VOTE_THRESHOLD: uint64 = 14;
export const PROPOSAL_TYPE_UPDATE_REVOCATION_ADDRESS: uint64 = 15;

export const PROPOSAL_TYPE_UPDATE_AKITA_DAO: uint64 = 16;
export const PROPOSAL_TYPE_UPDATE_ABSTRACTED_ACCOUNT_FACTORY: uint64 = 17;
export const PROPOSAL_TYPE_UPDATE_AKITA_SOCIAL: uint64 = 18;

export const PROPOSAL_TYPE_ADD_DAO_PLUGIN: uint64 = 19;
export const PROPOSAL_TYPE_USE_DAO_PLUGIN: uint64 = 20;
export const PROPOSAL_TYPE_REMOVE_DAO_PLUGIN: uint64 = 21;

export const PROPOSAL_TYPE_ADD_AKITA_SOCIAL_MODERATOR: uint64 = 22;
export const PROPOSAL_TYPE_REMOVE_AKITA_SOCIAL_MODERATOR: uint64 = 23;

export const PROPOSAL_TYPE_ADD_SOCIAL_ACTION: uint64 = 24;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_ACTION: uint64 = 25;

export const PROPOSAL_TYPE_ADD_SOCIAL_GATE: uint64 = 26;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_GATE: uint64 = 27;

export const PLUGIN_STATUS_APPROVED: uint64 = 1;