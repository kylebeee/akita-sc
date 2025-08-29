import { Address } from "cluster"
import { StakingType } from "../staking/types"
import { StructField } from "@algorandfoundation/algokit-utils/types/app-arc56";

export type GateType = 'asset' | 'merkle_address' | 'merkle_asset' | 'nfd' | 'nfd_root' | 'social_activity' | 'social_follower_count' | 'social_follower_index' | 'social_impact' | 'social_moderator' | 'staking_amount' | 'staking_power' | 'subscription' | 'subscription_streak'

export interface GateRegistryConfig {
  asset?: bigint;
  merkle_address?: bigint;
  merkle_asset?: bigint;
  nfd?: bigint;
  nfd_root?: bigint;
  social_activity?: bigint;
  social_follower_count?: bigint;
  social_follower_index?: bigint;
  social_impact?: bigint;
  social_moderator?: bigint;
  staking_amount?: bigint;
  staking_power?: bigint;
  subscription?: bigint;
  subscription_streak?: bigint;
}

export type GateEncodingInfo<T extends Record<string, StructField[]> = Record<string, StructField[]>> = {
  registerShape: keyof T
  checkShape: keyof T
  structs: T
}

export enum Operator {
  Equal = 10,
  NotEqual = 20,
  LessThan = 30,
  LessThanOrEqualTo = 40,
  GreaterThan = 50,
  GreaterThanOrEqualTo = 60,
  IncludedIn = 70,
  IncludedInRoot = 80,
  NotIncludedIn = 90,
}

export enum LogicalOperator {
  None = 0,
  And = 10,
  Or = 20,
}

export type GateRegistrationFilterAndArg = GateRegistrationArg & {
  layer: bigint
  appId: bigint,
  logicalOperator: LogicalOperator
}

export type GateRegistrationArg = (
  | {
    type: 'asset'
    asset: bigint | number
    op: Operator,
    value: bigint | number
  }
  | {
    type: 'merkle_address' | 'merkle_asset',
    creator: string,
    name: string
  }
  | { type: 'nfd' }
  | {
    type: 'nfd_root',
    root: string
  }
  | {
    type: 'social_activity' | 'social_follower_count' | 'social_impact' | 'social_moderator',
    op: Operator,
    value: bigint | number
  }
  | {
    type: 'social_follower_index',
    user: string,
    op: Operator,
    value: bigint | number
  }
  | {
    type: 'staking_amount'
    op: Operator
    asset: bigint | number
    stakingType: StakingType
    amount: bigint | number
    includeEscrowed: boolean
  }
  | {
    type: 'staking_power'
    op: Operator
    asset: bigint | number
    power: bigint | number
  }
  | {
    type: 'subscription'
    merchant: string
    id: bigint | number
  }
  | {
    type: 'subscription_streak'
    merchant: string
    id: bigint | number
    op: Operator
    streak: bigint | number
  }
)

export type GateCheckArg = (
  | { type: 'asset' }
  | {
    type: 'merkle_address',
    proof: Uint8Array<ArrayBufferLike>[]
  }
  | {
    type: 'merkle_asset'
    asset: bigint | number
    proof: Uint8Array<ArrayBufferLike>[]
  }
  | {
    type: 'nfd'
    appId: bigint | number
  }
  | {
    type: 'nfd_root',
    root: string
  }
  | { type: 'social_activity' }
  | { type: 'social_follower_count' }
  | {
    type: 'social_follower_index',
    index: bigint | number
  }
  | { type: 'social_impact' }
  | { type: 'social_moderator' }
  | { type: 'staking_amount' }
  | { type: 'staking_power' }
  | { type: 'subscription' }
  | { type: 'subscription_streak' }
)

// export type GateFilter = {
//   layer: uint64 // the comparison nesting level
//   app: uint64 // the app id of the gate to use
//   logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
// }