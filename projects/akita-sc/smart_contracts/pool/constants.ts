import { uint64 } from "@algorandfoundation/algorand-typescript"
import { UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export const PoolGlobalStateKeyStatus = 'status'
export const PoolGlobalStateKeyDisbursementPhase = 'disbursement_phase'
export const PoolGlobalStateKeyTitle = 'title'
export const PoolGlobalStateKeyType = 'type'
export const PoolGlobalStateKeyReward = 'reward'
export const PoolGlobalStateKeySignupTimestamp = 'signup_timestamp'
export const PoolGlobalStateKeyAllowLateSignups = 'allow_late_signups'
export const PoolGlobalStateKeyStartTimestamp = 'start_timestamp'
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
export const PoolGlobalStateKeySalt = 'salt'
export const PoolGlobalStateKeyActiveDisbursementID = 'active_disbursement_id'
export const PoolGlobalStateKeyActiveDisbursementWindow = 'active_disbursement_window'
export const PoolGlobalStateKeyDisbursementCursor = 'disbursement_cursor'
export const PoolGlobalStateKeyQualifiedStake = 'qualified_stake'
export const PoolGlobalStateKeyWinningTickets = 'wtickets'
export const PoolGlobalStateKeyRaffleCursor = 'raffle_cursor'
export const PoolGlobalStateKeyVRFFailureCount = 'vrf_failure_count'

export const PoolBoxPrefixEntries = 'e'
export const PoolBoxPrefixEntriesByAddress = 'a'
export const PoolBoxPrefixDisbursements = 'd'

export const PoolStatusDraft = new UintN8(0)
export const PoolStatusFinal = new UintN8(10)
export const PoolStatusDisbursing = new UintN8(20)

export const DisbursementPhaseIdle = new UintN8(0)
export const DisbursementPhasePreparation = new UintN8(10)
export const DisbursementPhaseAllocation = new UintN8(20)
export const DisbursementPhaseFinalization = new UintN8(30)


export const MaxAlgoIterationAmount: uint64 = 128
// the maximum amount we can iterate in a single txn group
// if the reward is not algo we call 3 transactions per allocation
// so max inner txns is 256 / 3 = 85
export const MaxIterationAmount: uint64 = 85

// the maximum amount of uint64's we can store in a single global state key
export const MaxGlobalStateUint64Array: uint64 = 15