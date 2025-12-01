import { MaybeSigner } from "../types";
import {
  StakingPoolArgs,
  StakingPoolState,
  Reward,
  RootKey,
  FunderInfo,
  StakingPoolMbrData,
  EntryData
} from '../generated/StakingPoolClient';
import { StakingPoolFactoryArgs } from '../generated/StakingPoolFactoryClient';

// Re-export types from generated clients for convenience
export { StakingPoolState, Reward, RootKey, FunderInfo, StakingPoolMbrData, EntryData };

// Pool Factory Types
type FactoryContractArgs = StakingPoolFactoryArgs["obj"];

export type NewPoolParams = MaybeSigner & Omit<FactoryContractArgs['newPool(pay,string,uint8,address,(address,string),uint64,uint64,uint64)uint64'], 'payment'>;

export type DeletePoolParams = MaybeSigner & FactoryContractArgs['deletePool(uint64)void'];

// Individual Pool Types  
type PoolContractArgs = StakingPoolArgs["obj"];

export type AddRewardParams = MaybeSigner & Omit<PoolContractArgs['addReward(pay,(uint64,uint8,uint64,uint64,uint64,uint64,uint64,uint64,uint64[],(uint64,uint64,uint64),uint64,uint8,uint64,uint64,uint64,uint64))void'], 'payment'>;

export type AddRewardAsaParams = MaybeSigner & Omit<PoolContractArgs['addRewardAsa(pay,axfer,(uint64,uint8,uint64,uint64,uint64,uint64,uint64,uint64,uint64[],(uint64,uint64,uint64),uint64,uint8,uint64,uint64,uint64,uint64))void'], 'payment' | 'assetXfer'> & {
  /** the asset ID of the reward */
  asset: bigint;
  /** The amount of the asset to transfer for the reward */
  amount: bigint;
};

export type FinalizePoolParams = MaybeSigner & PoolContractArgs['finalize(uint64,uint64,uint64)void'];

export type Entry = {
  /** The asset ID being staked */
  asset: bigint | number;
  /** The amount being entered */
  amount: bigint | number;
  /** Optional merkle proofs for gated entry */
  proofs?: Uint8Array[];
};

export type EnterPoolParams = MaybeSigner & {
  /** Array of entries (asset, amount, optional proofs) */
  entries: Entry[];
  /** Optional additional arguments for gated entry */
  args?: Uint8Array[];
};

export type StartDisbursementParams = MaybeSigner & PoolContractArgs['startDisbursement(uint64)void'];

export type RaffleParams = MaybeSigner & PoolContractArgs['raffle(uint64)void'];

export type DisburseRewardsParams = MaybeSigner & PoolContractArgs['disburseRewards(uint64,uint64)void'];

export type FinalizeDistributionParams = MaybeSigner & PoolContractArgs['finalizeDistribution(uint64)void'];

export type OptinAssetParams = MaybeSigner & Omit<PoolContractArgs['optIn(pay,uint64)void'], 'payment'>;

export type CheckParams = PoolContractArgs['check(address,uint64)(bool,uint64)'];

export type CheckResult = {
  isEligible: boolean;
  stake: bigint;
};

export type IsEnteredParams = PoolContractArgs['isEntered(address)bool'];

export type StakingPoolMbrParams = PoolContractArgs['mbr(uint64)(uint64,uint64,uint64,uint64,uint64)'];

/** Pool status enum */
export enum PoolStatus {
  Pending = 0,
  Active = 1,
  Ended = 2,
  Distributing = 3,
  Complete = 4
}

/** Pool type enum */
export enum PoolType {
  Standard = 0,
  Raffle = 1
}

/** Reward distribution type enum */
export enum RewardDistributionType {
  Proportional = 0,
  Fixed = 1,
  Raffle = 2
}

/** Reward phase enum */
export enum RewardPhase {
  Pending = 0,
  Active = 1,
  Distributing = 2,
  Complete = 3
}
