import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

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

export class arc4DisbursementDetails extends arc4.Struct<{
    creator: Address
    finalized: arc4.Bool
    title: arc4.Str
    amount: arc4.UintN64
    timeToUnlock: arc4.UintN64
    expiration: arc4.UintN64
    allocations: arc4.UintN64
    distributed: arc4.UintN64
    note: arc4.Str
}> { }

export type UserAllocationsKey = {
    /** the address of the account */
    address: Address
    /** the disbursement id */
    disbursementID: uint64
    /** the asset id being distributed */
    asset: uint64
}

export class arc4UserAllocationsKey extends arc4.Struct<{
    address: Address
    disbursementID: arc4.UintN64
    asset: arc4.UintN64
}> { }

export type UserAlloction = {
    /** the address of the account */
    address: Address
    /** the amount the user is owed */
    amount: uint64
}

export class arc4UserAllocation extends arc4.Struct<{
    address: Address
    amount: arc4.UintN64
}> { }

export type AllocationReclaimDetails = {
    /** the address of the account */
    address: Address
    /** the asset id being distributed */
    asset: uint64
}

export class arc4AllocationReclaimDetails extends arc4.Struct<{
    address: Address
    asset: arc4.UintN64
}> { }

export type ClaimDetails = {
    /** the id of reward distribution */
    id: uint64
    /** the asset id being claimed */
    asset: uint64
}

export class arc4ClaimDetails extends arc4.Struct<{
    id: arc4.UintN64
    asset: arc4.UintN64
}> { }