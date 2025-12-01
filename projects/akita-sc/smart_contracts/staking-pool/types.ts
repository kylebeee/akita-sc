import { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { GateArgs } from '../gates/types'
import { RootKey } from '../meta-merkles/types'
import { StakingType } from '../staking/types'
import { Proof } from '../utils/types/merkles'

export type StakingPoolStatus = Uint8
export type DistributionType = Uint8
export type DisbursementPhase = Uint8
export type StakingPoolStakingType = Uint8

export type EntryKey = {
    address: Account
    asset: uint64
}

export type StakeEntry = {
    asset: uint64
    quantity: uint64
    proof: Proof
}

export type EntryData = {
    address: Account
    asset: uint64
    quantity: uint64,
    gateArgs: GateArgs
    disqualified: boolean
}

export type EntryValue = {
    id: uint64
    quantity: uint64
}

export type Reward = {
    asset: uint64 // the reward asset
    distribution: DistributionType // the way we want to distribute it
    rate: uint64 // the rate at which we distribute the reward
    expiration: uint64 // the number seconds after disbursement to expire the reward
    interval: uint64 // how often this reward is eligible to be disbursed
    qualifiedStakers: uint64 // the total stake that qualifies for this reward
    qualifiedStake: uint64 // the total stake that qualifies for the reward
    winnerCount: uint64 // shuffle distribution only: the number of winners to select
    winningTickets: uint64[] // the winning tickets for the raffle
    raffleCursor: RaffleCursor // the cursor for the raffle
    vrfFailureCount: uint64 // the number of VRF failures for this reward
    phase: DisbursementPhase // the current phase of disbursement
    disbursementCursor: uint64 // the cursor for the disbursement
    activeDisbursementID: uint64 // the ID of the active disbursement
    activeDisbursementRoundStart: uint64 // the timestamp window for the active disbursement
    lastDisbursementTimestamp: uint64 // the timestamp of the last disbursement
}

export type StakingPoolState = {
    status: Uint8
    title: string
    type: StakingType
    signupTimestamp: uint64
    startTimestamp: uint64
    allowLateSignups: boolean
    endTimestamp: uint64
    maxEntries: uint64
    entryCount: uint64
    rewardCount: uint64
    totalStaked: uint64
    stakeKey: RootKey
    minimumStakeAmount: uint64
    gateID: uint64
    creator: Account
}

export type StakingPoolMBRData = {
    entries: uint64
    uniques: uint64
    entriesByAddress: uint64
    rewards: uint64
    disbursements: uint64
}

export type RaffleCursor = {
    ticket: uint64
    stake: uint64
    disbursed: uint64
}