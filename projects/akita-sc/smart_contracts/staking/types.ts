import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Uint64, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export type StakingType = Uint8

/**
 * Heartbeat staking uses the average of the last 4 heartbeats
 * triggered with random jitter 4 times a day
 *
 */
export const STAKING_TYPE_HEARTBEAT: StakingType = new arc4.Uint8(10)

/**
 * Soft staking uses incentivized account watching to flag
 * users that drop below their committed balance
 */
export const STAKING_TYPE_SOFT: StakingType = new arc4.Uint8(20)

/**
 * Hard staking uses an escrowed balance
 *
 */
export const STAKING_TYPE_HARD: StakingType = new arc4.Uint8(30)

/**
 * Hard locked staking uses an escrowed balance
 * and locks the balance for a set period of time
 *
 */
export const STAKING_TYPE_LOCK: StakingType = new arc4.Uint8(40)

export type StakeKey = {
  address: Address
  asset: uint64
  type: StakingType
}

export type Stake = {
  amount: uint64
  lastUpdate: uint64
  expiration: uint64
}

export type Escrow = {
  hard: uint64
  lock: uint64
}

export type HeartbeatKey = {
  address: Address
  asset: uint64
}

export type Heartbeat = {
  held: uint64
  hard: uint64
  lock: uint64
  timestamp: uint64
}

export type Heartbeats = Heartbeat[]

export class arc4Heartbeat extends arc4.Struct<{
  held: Uint64
  hard: Uint64
  lock: Uint64
  timestamp: Uint64
}> { }

export type arc4Heartbeats = arc4.StaticArray<arc4Heartbeat, 4>

export type StakeInfo = {
  asset: uint64
  type: StakingType
}

export type AssetCheck = {
  asset: uint64
  amount: uint64
}

export type StakingMBRData = {
  stakes: uint64
  heartbeats: uint64
  settings: uint64
}