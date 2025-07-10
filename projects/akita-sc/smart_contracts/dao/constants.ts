import { uint64 } from '@algorandfoundation/algorand-typescript'
import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export const AkitaDAOGlobalStateKeysStatus = 'status'
export const AkitaDAOGlobalStateKeysContentPolicy = 'content_policy'
export const AkitaDAOGlobalStateKeysMinRewardsImpact = 'min_rewards_impact'
export const AkitaDAOGlobalStateKeysAkitaAppList = 'akita_al'
export const AkitaDAOGlobalStateKeysPluginAppList = 'plugn_al'
export const AkitaDAOGlobalStateKeysOtherAppList = 'other_al'
export const AkitaDAOGlobalStateKeysSocialFees = 'social_fees'
export const AkitaDAOGlobalStateKeysStakingFees = 'staking_fees'
export const AkitaDAOGlobalStateKeysSubscriptionFees = 'subscription_fees'
export const AkitaDAOGlobalStateKeysSwapFees = 'swap_fees'
export const AkitaDAOGlobalStateKeysNFTFees = 'nft_fees'
export const AkitaDAOGlobalStateKeysKrbyPercentage = 'krby_percentage'
export const AkitaDAOGlobalStateKeysModeratorPercentage = 'mod_percentage'
export const AkitaDAOGlobalStateKeysProposalFee = 'proposal_fee'
export const AkitaDAOGlobalStateKeysProposalSuccessRebate = 'proposal_success_rebate'
export const AkitaDAOGlobalStateKeysAkitaAssets = 'akita_assets'
export const AkitaDAOGlobalStateKeysProposalSettings = 'proposal_settings'

export const AkitaDAOGlobalStateKeysProposalCreationSettings = 'proposal_creation_settings'
export const AkitaDAOGlobalStateKeysProposalParticipationSettings = 'proposal_participation_settings'
export const AkitaDAOGlobalStateKeysProposalApprovalThresholdSettings = 'proposal_approval_threshold_settings'
export const AkitaDAOGlobalStateKeysProposalVotingDurationSettings = 'proposal_voting_duration_settings'

export const AkitaDAOGlobalStateKeysRevocationAddress = 'revocation_address'
export const AkitaDAOGlobalStateKeysProposalID = 'proposal_id'
export const AkitaDAOGlobalStateKeysDisbursementCursor = 'disbursement_cursor'

export const AkitaDAOBoxPrefixProposals = 'l'
export const AkitaDAOBoxPrefixExecutions = 'x'
export const AkitDAOBoxPrefixEscrows = 'e'
export const AkitDAOBoxPrefixEscrowAssets = 's'
export const AkitaDAOBoxPrefixReceiveEscrows = 'r'

export const AkitaDAOEscrowAccountSocial = 'social'
export const AkitaDAOEscrowAccountStakingPools = 'staking'
export const AkitaDAOEscrowAccountSubscriptions = 'subscriptions'
export const AkitaDAOEscrowAccountMarketplace = 'marketplace'
export const AkitaDAOEscrowAccountAuctions = 'auctions'
export const AkitaDAOEscrowAccountRaffles = 'raffles'
export const AkitaDAOEscrowAccountModerators = 'moderators'
export const AkitaDAOEscrowAccountKrby = 'krby'

export const DAOStatusInit: uint64 = 0
// const DAO_STATUS_LOADING_REWARDS = 1;
// const DAO_STATUS_DISTRIBUTING_REWARDS = 2;
// const DAO_STATUS_RUNNING = 3;

export const EscrowDisbursementPhaseIdle = new UintN8(0)
export const EscrowDisbursementPhasePreparation = new UintN8(10)
export const EscrowDisbursementPhaseAllocation = new UintN8(20)
export const EscrowDisbursementPhaseFinalization = new UintN8(30)

// proposal statuses
export const ProposalStatusDraft = new UintN8(0)
export const ProposalStatusInvalid = new UintN8(10)
export const ProposalStatusVoting = new UintN8(20)
export const ProposalStatusRejected = new UintN8(30)
export const ProposalStatusApproved = new UintN8(40)

export const ProposalActionUpgradeApp = new UintN8(0)
export const ProposalActionAddPlugin = new UintN8(10)
export const ProposalActionAddNamedPlugin = new UintN8(20)
export const ProposalActionExecutePlugin = new UintN8(30)
export const ProposalActionExecuteNamedPlugin = new UintN8(40)
export const ProposalActionRemovePlugin = new UintN8(50)
export const ProposalActionRemoveNamedPlugin = new UintN8(60)
export const ProposalActionAddAllowance = new UintN8(70)
export const ProposalActionRemoveAllowance = new UintN8(80)
export const ProposalActionUpdateFields = new UintN8(90)

export const PLUGIN_STATUS_APPROVED: uint64 = 1
