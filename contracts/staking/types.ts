import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";

export type StakingType = uint64;

/**
 * Heartbeat staking uses the average of the last 4 heartbeats
 * triggered with random jitter 4 times a day
 * 
*/
export const STAKING_TYPE_HEARTBEAT: StakingType = 0

/**
 * Soft staking uses incentivized account watching to flag
 * users that drop below their committed balance
 */
export const STAKING_TYPE_SOFT: StakingType = 1

/**
 * Hard staking uses an escrowed balance
 * 
 */
export const STAKING_TYPE_HARD: StakingType = 2

/**
 * Hard locked staking uses an escrowed balance
 * and locks the balance for a set period of time
 * 
 */
export const STAKING_TYPE_LOCK: StakingType = 3

export const arc4STAKING_TYPE_HEARTBEAT = new arc4.UintN64(STAKING_TYPE_HEARTBEAT)
export const arc4STAKING_TYPE_SOFT = new arc4.UintN64(STAKING_TYPE_SOFT)
export const arc4STAKING_TYPE_HARD = new arc4.UintN64(STAKING_TYPE_HARD)
export const arc4STAKING_TYPE_LOCK = new arc4.UintN64(STAKING_TYPE_LOCK)

export type StakeKey = {
    address: arc4.Address
    asset: uint64
    type: StakingType
}

export class arc4StakeKey extends arc4.Struct<{
    address: arc4.Address,
    asset: arc4.UintN64,
    type: arc4.UintN64,
}> {}

export type StakeValue = {
    amount: uint64
    lastUpdate: uint64
    expiration: uint64
}

export class arc4StakeValue extends arc4.Struct<{
    amount: arc4.UintN64,
    lastUpdate: arc4.UintN64,
    expiration: arc4.UintN64,
}> {}

export type EscrowValue = {
    hard: uint64
    lock: uint64
}

export class arc4EscrowValue extends arc4.Struct<{
    hard: arc4.UintN64,
    lock: arc4.UintN64,
}> {}

export type HeartbeatKey = {
    address: arc4.Address
    asset: uint64
}

export class arc4HeartbeatKey extends arc4.Struct<{
    address: arc4.Address,
    asset: arc4.UintN64,
}> {}

export type HeartbeatValues = {
    held: uint64
    hard: uint64
    lock: uint64
    timestamp: uint64
}

export class arc4HeartbeatValues extends arc4.Struct<{
    held: arc4.UintN64,
    hard: arc4.UintN64,
    lock: arc4.UintN64,
    timestamp: arc4.UintN64,
}> {}

export type StakeInfo = {
    asset: uint64
    type: StakingType
}

export class arc4StakeInfo extends arc4.Struct<{
    asset: arc4.UintN64,
    type: arc4.UintN64,
}> {}

export type AssetCheck = {
    asset: uint64
    amount: uint64
}

export class arc4AssetCheck extends arc4.Struct<{
    asset: arc4.UintN64,
    amount: arc4.UintN64,
}> {}