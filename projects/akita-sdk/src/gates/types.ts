import { Address } from "cluster"
import { StakingType } from "../staking/types"

export type GateType = 'asset' | 'merkle_address' | 'merkle_asset' | 'nfd' | 'nfd_root' | 'social_activity' | 'social_follower_count' | 'social_follower_index' | 'social_impact' | 'social_moderator' | 'staking_amount' | 'staking_power' | 'subscription' | 'subscription_streak'

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
  And = 10,
  Or = 20,
}

export type GateRegistrationArg = {
  layer: bigint
  appId: bigint,
  logicalOperator: 'and' | 'or'
} & (
    | {
      type: 'asset' | 'social_activity' | 'social_follower_count' | 'social_impact' | 'social_moderator',
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
      includeStaked: boolean
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
  | {
    type: 'asset'
    asset: bigint | number
  }
  | {
    type: 'merkle_address',
    proof: 
  }
  | {
    type: 'merkle_asset'
  }
  | { type: 'nfd' }
  | {
    type: 'nfd_root',
  }
  | {
    type: 'social_activity',
  }
  | {
    type: 'social_follower_count'
  }
  | {
    type: 'social_impact'
  }
  | {
    type: 'social_moderator'
  }
  | {
    type: 'social_follower_index',
  }
  | {
    type: 'staking_amount'
  }
  | {
    type: 'staking_power'
  }
  | {
    type: 'subscription'
  }
  | {
    type: 'subscription_streak'
  }
)

// export type GateFilter = {
//   layer: uint64 // the comparison nesting level
//   app: uint64 // the app id of the gate to use
//   logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
// }