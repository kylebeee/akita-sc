import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, DynamicArray, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export type StakingType = UintN8

/**
 * Heartbeat staking uses the average of the last 4 heartbeats
 * triggered with random jitter 4 times a day
 *
 */
export const STAKING_TYPE_HEARTBEAT: StakingType = new arc4.UintN8(0)

/**
 * Soft staking uses incentivized account watching to flag
 * users that drop below their committed balance
 */
export const STAKING_TYPE_SOFT: StakingType = new arc4.UintN8(1)

/**
 * Hard staking uses an escrowed balance
 *
 */
export const STAKING_TYPE_HARD: StakingType = new arc4.UintN8(2)

/**
 * Hard locked staking uses an escrowed balance
 * and locks the balance for a set period of time
 *
 */
export const STAKING_TYPE_LOCK: StakingType = new arc4.UintN8(3)

export type StakeKey = {
  address: Address
  asset: uint64
  type: StakingType
}

export class arc4StakeKey extends arc4.Struct<{
  address: Address
  asset: arc4.UintN64
  type: StakingType
}> { }

export type Stake = {
  amount: uint64
  lastUpdate: uint64
  expiration: uint64
}

export class arc4Stake extends arc4.Struct<{
  amount: arc4.UintN64
  lastUpdate: arc4.UintN64
  expiration: arc4.UintN64
}> { }

export type Escrow = {
  hard: uint64
  lock: uint64
}

export class arc4Escrow extends arc4.Struct<{
  hard: arc4.UintN64
  lock: arc4.UintN64
}> { }

export type HeartbeatKey = {
  address: Address
  asset: uint64
}

export class arc4HeartbeatKey extends arc4.Struct<{
  address: Address
  asset: arc4.UintN64
}> { }

export type Heartbeat = {
  held: uint64
  hard: uint64
  lock: uint64
  timestamp: uint64
}

export type Heartbeats = Heartbeat[]

export class arc4Heartbeat extends arc4.Struct<{
  held: arc4.UintN64
  hard: arc4.UintN64
  lock: arc4.UintN64
  timestamp: arc4.UintN64
}> { }

export type arc4Heartbeats = arc4.StaticArray<arc4Heartbeat, 4>

export type StakeInfo = {
  asset: uint64
  type: StakingType
}

export class arc4StakeInfo extends arc4.Struct<{
  asset: arc4.UintN64
  type: StakingType
}> { }

export type AssetCheck = {
  asset: uint64
  amount: uint64
}

export class arc4AssetCheck extends arc4.Struct<{
  asset: arc4.UintN64
  amount: arc4.UintN64
}> { }

export type AssetChecks = DynamicArray<arc4AssetCheck>

export type StakingMBRData = {
  stakes: uint64
  heartbeats: uint64
}