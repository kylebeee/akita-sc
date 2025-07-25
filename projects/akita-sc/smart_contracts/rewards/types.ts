import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type DisbursementDetails = {
    /** the creator of the disbursement */
    creator: Address
    /** the disbursement status */
    finalized: boolean
    /** the disbursement title */
    title: string
    /** the amount of tokens to distribute */
    amount: uint64
    /** the unix timestamp of the disbursement */
    timeToUnlock: uint64
    /** the expiration time as a unix timestamp */
    expiration: uint64
    /** the number of users with allocations */
    allocations: uint64
    /** the amount already distributed from this allocation */
    distributed: uint64
    /** notes */
    note: string
}

export type UserAllocationsKey = {
    /** the disbursement id */
    disbursementID: uint64
    /** the address of the account */
    address: Address
    /** the asset id being distributed */
    asset: uint64
}

export type UserAllocation = {
    /** the address of the account */
    address: Address
    /** the amount the user is owed */
    amount: uint64
}

export type AllocationReclaimDetails = {
    /** the address of the account */
    address: Address
    /** the asset id being distributed */
    asset: uint64
}

export type ClaimDetails = {
    /** the id of reward distribution */
    id: uint64
    /** the asset id being claimed */
    asset: uint64
}

export type RewardsMBRData = {
    disbursements: uint64
    userAllocations: uint64
}