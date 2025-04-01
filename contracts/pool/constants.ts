import { UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export const PoolGlobalStateKeyStatus = 'status'
export const PoolGlobalStateKeyDisbursementPhase = 'disbursement_phase'
export const PoolGlobalStateKeyTitle = 'title'
export const PoolGlobalStateKeyType = 'type'
export const PoolGlobalStateKeyReward = 'reward'
export const PoolGlobalStateKeySignUpRound = 'signup_round'
export const PoolGlobalStateKeyAllowLateSignups = 'allow_late_signups'
export const PoolGlobalStateKeyStartingRound = 'starting_round'
export const PoolGlobalStateKeyEndingRound = 'ending_round'
export const PoolGlobalStateKeyRewardInterval = 'reward_interval'
export const PoolGlobalStateKeyLastRewardRound = 'last_reward_round'
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
export const PoolGlobalStateKeyDisbursementCursor = 'disbursement_cursor'
export const PoolGlobalStateKeyQualifiedStake = 'qualified_stake'

export const PoolBoxPrefixEntries = 'e'
export const PoolBoxPrefixEntriesByAddress = 'a'
export const PoolBoxPrefixDisbursements = 'd'

export const PoolStatusDraft = new UintN8(0)
export const PoolStatusFinal = new UintN8(1)
export const PoolStatusDisbursing = new UintN8(2)

export const DisbursementPhaseIdle = new UintN8(0)
export const DisbursementPhasePreparation = new UintN8(1)
export const DisbursementPhaseAllocation = new UintN8(2)
export const DisbursementPhaseFinalization = new UintN8(3)


export const MaxAlgoIterationAmount = 128
// the maximum amount we can iterate in a single txn group
// if the reward is not algo we call 3 transactions per allocation
// so max inner txns is 256 / 3 = 85
export const MaxIterationAmount = 85