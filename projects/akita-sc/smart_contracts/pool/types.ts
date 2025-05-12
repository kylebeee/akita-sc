import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { StakingType } from '../staking/types'
import { arc4RootKey, RootKey } from '../meta-merkles/types'
import { Proof } from '../utils/types/merkles'
import { GateArgs } from '../utils/types/gates'

export type DistributionType = UintN8

/**
 * disburse the rewards at the given rate based on the users % of stake in the pool
 * eg. the rate is 1000 and a users stake is 6% of the pool, they get 166.66
 */
export const DistributionTypePercentage = new UintN8(0)
/**
 * disburse the rewards at the given rate using a flat amount
 * eg. each user gets 10 AKTA per day if they qualify
 */
export const DistributionTypeFlat = new UintN8(1)
/**
 * disburse the rewards at the given rate evenly among all participants
 * eg. the rate is 1000 & theres 6 stakers, each gets 166.66
 */
export const DistributionTypeEven = new UintN8(2)
/**
 * disburse the rewards randomly to a single user at the given rate
 * eg. the rate is 1000, one random qualified user gets it all
 */
export const DistributionTypeShuffle = new UintN8(3)

export type PoolStakingType = UintN8

export const POOL_STAKING_TYPE_NONE: PoolStakingType = new arc4.UintN8(0)
export const POOL_STAKING_TYPE_HEARTBEAT: PoolStakingType = new arc4.UintN8(1)
export const POOL_STAKING_TYPE_SOFT: PoolStakingType = new arc4.UintN8(2)
export const POOL_STAKING_TYPE_HARD: PoolStakingType = new arc4.UintN8(3)
export const POOL_STAKING_TYPE_LOCK: PoolStakingType = new arc4.UintN8(4)

export type EntryKey = {
    address: Address
    asset: uint64
}

export class arc4EntryKey extends arc4.Struct<{
    address: Address
    asset: arc4.UintN64
}> {}

export type StakeEntry = {
    asset: uint64
    quantity: uint64
    proof: Proof
}

export class arc4StakeEntry extends arc4.Struct<{
    asset: arc4.UintN64
    quantity: arc4.UintN64
    proof: Proof
}> {}

export type EntryData = {
    address: Address
    asset: uint64
    quantity: uint64,
    gateArgs: GateArgs
    disqualified: boolean
}

export class arc4EntryData extends arc4.Struct<{
    address: Address
    asset: arc4.UintN64
    quantity: arc4.UintN64
    gateArgs: GateArgs
    disqualified: arc4.Bool
}> {}

export type EntryValue = {
    id: uint64
    quantity: uint64
}

export type Reward = {
    asset: uint64
    distribution: DistributionType
    rate: uint64
    expiration: uint64
    winnerCount: uint64 // shuffle distribution only
}

export class arc4Reward extends arc4.Struct<{
    asset: arc4.UintN64
    distribution: DistributionType
    rate: arc4.UintN64
    expiration: arc4.UintN64
    winnerCount: arc4.UintN64
}> {}

export type PoolState = {
    status: UintN8
    title: string
    type: StakingType
    reward: Reward
    signupTimestamp: uint64
    startTimestamp: uint64
    allowLateSignups: boolean
    endTimestamp: uint64
    maxEntries: uint64
    entryCount: uint64
    totalStaked: uint64
    stakeKey: RootKey
    minimumStakeAmount: uint64
    gateID: uint64
    creator: Address
}

export class arc4PoolState extends arc4.Struct<{
    status: arc4.UintN8
    title: arc4.Str
    type: arc4.UintN64
    reward: arc4Reward
    signupRound: arc4.UintN64
    startingRound: arc4.UintN64
    allowLateSignups: arc4.Bool
    endingRound: arc4.UintN64
    maxEntries: arc4.UintN64
    entryCount: arc4.UintN64
    totalStaked: arc4.UintN64
    uniqueAssetsStaked: arc4.UintN64
    stakeKey: arc4RootKey
    minimumStakeAmount: arc4.UintN64
    gateID: arc4.UintN64
    creator: Address
}> {}

export type PoolMBRData = {
    entries: uint64
    entriesByAddress: uint64
    disbursements: uint64
}

export class arc4RaffleCursor extends arc4.Struct<{
    ticket: arc4.UintN64
    stake: arc4.UintN64
    disbursed: arc4.UintN64
}> {}

export type RaffleCursor = {
    ticket: uint64
    stake: uint64
    disbursed: uint64
}