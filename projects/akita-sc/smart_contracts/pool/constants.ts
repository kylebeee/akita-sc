import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Uint8 } from "@algorandfoundation/algorand-typescript/arc4"
import { DisbursementPhase, DistributionType, PoolStakingType, PoolStatus } from "./types"

export const PoolGlobalStateKeyStatus = 'status'
export const PoolGlobalStateKeyDisbursementPhase = 'disbursement_phase'
export const PoolGlobalStateKeyTitle = 'title'
export const PoolGlobalStateKeyType = 'type'
export const PoolGlobalStateKeyRewardCount = 'reward_count'
export const PoolGlobalStateKeySignupTimestamp = 'signup_timestamp'
export const PoolGlobalStateKeyAllowLateSignups = 'allow_late_signups'
export const PoolGlobalStateKeyStartTimestamp = 'start_timestamp'
export const PoolGlobalStateKeyStartRound = 'start_round'
export const PoolGlobalStateKeyEndTimestamp = 'end_timestamp'
export const PoolGlobalStateKeyRewardInterval = 'reward_interval'
export const PoolGlobalStateKeyLastDisbursementTimestamp = 'last_disbursement_timestamp'
export const PoolGlobalStateKeyMaxEntries = 'max_entries'
export const PoolGlobalStateKeyEntryCount = 'entry_count'
export const PoolGlobalStateKeyTotalStaked = 'total_staked'
export const PoolGlobalStateKeyUniqueAssetsStaked = 'unique_assets_staked'
export const PoolGlobalStateKeyStakeKey = 'stake_key'
export const PoolGlobalStateKeyMinimumStakeAmount = 'minimum_stake_amount'
export const PoolGlobalStateKeyGateID = 'gate_id'
export const PoolGlobalStateKeyGateSize = 'gate_size'
export const PoolGlobalStateKeyCreator = 'creator'
export const PoolGlobalStateKeyMarketplace = 'marketplace'
export const PoolGlobalStateKeyMarketplaceRoyalties = 'marketplace_royalties'
export const PoolGlobalStateKeyAkitaRoyalty = 'akita_royalty'
export const PoolGlobalStateKeyAkitaRoyaltyAmount = 'akita_royalty_amount'
export const PoolGlobalStateKeySalt = 'salt'
export const PoolGlobalStateKeyActiveDisbursementID = 'active_disbursement_id'
export const PoolGlobalStateKeyActiveDisbursementWindow = 'active_disbursement_window'
export const PoolGlobalStateKeyDisbursementCursor = 'disbursement_cursor'
export const PoolGlobalStateKeyQualifiedStake = 'qualified_stake'
export const PoolGlobalStateKeyWinningTickets = 'wtickets'
export const PoolGlobalStateKeyRaffleCursor = 'raffle_cursor'
export const PoolGlobalStateKeyVRFFailureCount = 'vrf_failure_count'

export const PoolBoxPrefixEntries = 'e'
export const PoolGlobalStateKeyUniques = 'u'
export const PoolBoxPrefixEntriesByAddress = 'a'
export const PoolBoxPrefixDisbursements = 'd'
export const PoolBoxPrefixRewards = 'r'

export const PoolStatusDraft: PoolStatus = new Uint8(0)
export const PoolStatusFinal: PoolStatus = new Uint8(10)

export const POOL_STAKING_TYPE_NONE: PoolStakingType = new Uint8(0)
export const POOL_STAKING_TYPE_HEARTBEAT: PoolStakingType = new Uint8(10)
export const POOL_STAKING_TYPE_SOFT: PoolStakingType = new Uint8(20)
export const POOL_STAKING_TYPE_HARD: PoolStakingType = new Uint8(30)
export const POOL_STAKING_TYPE_LOCK: PoolStakingType = new Uint8(40)

/**
 * disburse the rewards at the given rate based on the users % of stake in the pool
 * eg. the rate is 1000 and a users stake is 6% of the pool, they get 166.66
 */
export const DistributionTypePercentage: DistributionType = new Uint8(10)
/**
 * disburse the rewards at the given rate using a flat amount
 * eg. each user gets 10 AKTA per day if they qualify
 */
export const DistributionTypeFlat: DistributionType = new Uint8(20)
/**
 * disburse the rewards at the given rate evenly among all participants
 * eg. the rate is 1000 & theres 6 stakers, each gets 166.66
 */
export const DistributionTypeEven: DistributionType = new Uint8(30)
/**
 * disburse the rewards randomly to a single user at the given rate
 * eg. the rate is 1000, one random qualified user gets it all
 */
export const DistributionTypeShuffle: DistributionType = new Uint8(40)


export const DisbursementPhaseIdle: DisbursementPhase = new Uint8(0)
export const DisbursementPhasePreparation: DisbursementPhase = new Uint8(10)
export const DisbursementPhaseAllocation: DisbursementPhase = new Uint8(20)
export const DisbursementPhaseFinalization: DisbursementPhase = new Uint8(30)


export const MaxAlgoIterationAmount: uint64 = 128
// the maximum amount we can iterate in a single txn group
// if the reward is not algo we call 3 transactions per allocation
// so max inner txns is 256 / 3 = 85
export const MaxIterationAmount: uint64 = 85

// the maximum amount of uint64's we can store in a single global state key
export const MaxGlobalStateUint64Array: uint64 = 15

export const PoolEntriesMBR: uint64 = 25_300
export const PoolUniquesMBR: uint64 = 18_900
export const PoolEntriesByAddressMBR: uint64 = 25_300
export const MinPoolRewardsMBR: uint64 = 0
export const PoolDisbursementSMBR: uint64 = 6_100


export const WinnerCountCap: uint64 = 10