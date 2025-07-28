import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { ProposalActionType, ProposalStatus, PayoutEscrowType, ProposalVoteType } from './types'

export const AkitaDAOGlobalStateKeysInitialized = 'initialized'
export const AkitaDAOGlobalStateKeysContentPolicy = 'content_policy'
export const AkitaDAOGlobalStateKeysWalletID = 'wallet_id'
export const AkitaDAOGlobalStateKeysProposalActionLimit = 'proposal_action_limit'
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

export const AkitaDAOGlobalStateKeysAkitaAssets = 'akita_assets'
export const AkitaDAOGlobalStateKeysUpgradeAppProposalSettings = 'upgrade_app_ps'
export const AkitaDAOGlobalStateKeysAddPluginProposalSettings = 'add_plugin_ps'
export const AkitaDAOGlobalStateKeysRemovePluginProposalSettings = 'remove_plugin_ps'
export const AkitaDAOGlobalStateKeysRemoveExecutePluginProposalSettings = 'remove_execute_plugin_ps'
export const AkitaDAOGlobalStateKeysAddAllowanceProposalSettings = 'add_allowance_ps'
export const AkitaDAOGlobalStateKeysRemoveAllowanceProposalSettings = 'remove_allowance_ps'
export const AkitaDAOGlobalStateKeysNewEscrowProposalSettings = 'new_escrow_ps'
export const AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings = 'toggle_escrow_lock_ps'
export const AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings = 'update_fields_ps'

export const AkitaDAOGlobalStateKeysRevocationAddress = 'revocation_address'
export const AkitaDAOGlobalStateKeysProposalID = 'proposal_id'
export const AkitaDAOGlobalStateKeysDisbursementCursor = 'disbursement_cursor'

export const AkitDAOBoxPrefixEscrows = 'e'
export const AkitaDAOBoxPrefixReceiveEscrows = 'r'
export const AkitaDAOBoxPrefixReceiveAssets = 's'
export const AkitaDAOBoxPrefixPayoutEscrows = 'p' 
export const AkitaDAOBoxPrefixProposals = 'l'
export const AkitaDAOBoxPrefixProposalVotes = 'v'
export const AkitaDAOBoxPrefixExecutions = 'x'

// payout escrows
export const AkitaDAOEscrowAccountKrby = 'krby'
export const AkitaDAOEscrowAccountModerators = 'moderators'
export const AkitaDAOEscrowAccountGovernors = 'governors'
// receive escrows
export const AkitaDAOEscrowAccountSocial = 'social'
export const AkitaDAOEscrowAccountStakingPools = 'staking_pools'
export const AkitaDAOEscrowAccountSubscriptions = 'subscriptions'
export const AkitaDAOEscrowAccountMarketplace = 'marketplace'
export const AkitaDAOEscrowAccountAuctions = 'auctions'
export const AkitaDAOEscrowAccountRaffles = 'raffles'

export const MethodRestrictionByteLength: uint64 = 20

export const MinDAOPluginMBR: uint64 = 50_500
export const MinDAONamedPluginMBR: uint64 = 18_900
export const MinDAOEscrowMBR: uint64 = 6_100
export const DAOReceiveEscrowsMBR: uint64 = 32_900
export const DAOReceiveAssetsMBR: uint64 = 9_300
export const MinDAOPayoutEscrowsMBR: uint64 = 8_100
export const DAOAllowanceMBR: uint64 = 29_300
export const MinDAOProposalsMBR: uint64 = 42_100
export const DAOProposalVotesMBR: uint64 = 22_500
export const DAOExecutionsMBR: uint64 = 0

export const DAOPayoutEscrowIndividualByteLength: uint64 = 32
export const DAOPayoutEscrowGroupByteLength: uint64 = 8

export const EscrowDisbursementPhaseIdle = new Uint8(0)
export const EscrowDisbursementPhasePreparation = new Uint8(10)
export const EscrowDisbursementPhaseAllocation = new Uint8(20)
export const EscrowDisbursementPhaseFinalization = new Uint8(30)

export const PayoutEscrowTypeIndividual: PayoutEscrowType = new Uint8(10)
export const PayoutEscrowTypeGroup: PayoutEscrowType = new Uint8(20)

// proposal statuses
export const ProposalStatusDraft: ProposalStatus = new Uint8(0)
export const ProposalStatusInvalid: ProposalStatus = new Uint8(10)
export const ProposalStatusVoting: ProposalStatus = new Uint8(20)
export const ProposalStatusRejected: ProposalStatus = new Uint8(30)
export const ProposalStatusApproved: ProposalStatus = new Uint8(40)
export const ProposalStatusExecuted: ProposalStatus = new Uint8(50)

// proposal actions
export const ProposalActionTypeUpgradeApp: ProposalActionType = new Uint8(10)
export const ProposalActionTypeAddPlugin: ProposalActionType = new Uint8(20)
export const ProposalActionTypeAddNamedPlugin: ProposalActionType = new Uint8(21)
export const ProposalActionTypeExecutePlugin: ProposalActionType = new Uint8(30)
export const ProposalActionTypeExecuteNamedPlugin: ProposalActionType = new Uint8(31)
export const ProposalActionTypeRemoveExecutePlugin: ProposalActionType = new Uint8(32)
export const ProposalActionTypeRemovePlugin: ProposalActionType = new Uint8(40)
export const ProposalActionTypeRemoveNamedPlugin: ProposalActionType = new Uint8(41)
export const ProposalActionTypeAddAllowance: ProposalActionType = new Uint8(50)
export const ProposalActionTypeRemoveAllowance: ProposalActionType = new Uint8(60)
export const ProposalActionTypeNewEscrow: ProposalActionType = new Uint8(70)
export const ProposalActionTypeToggleEscrowLock: ProposalActionType = new Uint8(71)
export const ProposalActionTypeNewReceiveEscrow: ProposalActionType = new Uint8(72)
export const ProposalActionTypeUpdateFields: ProposalActionType = new Uint8(80)

// proposal vote types
export const ProposalVoteTypeApprove: ProposalVoteType = new Uint8(10)
export const ProposalVoteTypeReject: ProposalVoteType = new Uint8(20)
export const ProposalVoteTypeAbstain: ProposalVoteType = new Uint8(30)