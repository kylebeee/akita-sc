import { MaybeSigner } from "../types";
import {
  RewardsArgs,
  DisbursementDetails,
  UserAllocationsKey,
  RewardsMbrData,
} from '../generated/RewardsClient';

// Re-export types from generated clients for convenience
export { DisbursementDetails, UserAllocationsKey, RewardsMbrData };

type ContractArgs = RewardsArgs["obj"];

// ========== Allocation Types ==========

/**
 * Represents a single user allocation for rewards distribution.
 */
export type UserAllocation = {
  /** The address of the account to receive the allocation */
  address: string;
  /** The amount the user is allocated */
  amount: bigint | number;
};

/**
 * Details for reclaiming an unclaimed allocation after expiration.
 */
export type AllocationReclaim = {
  /** The address of the account with the unclaimed allocation */
  address: string;
  /** The asset ID (0 for ALGO) */
  asset: bigint | number;
};

/**
 * Details for claiming a specific reward.
 */
export type ClaimDetail = {
  /** The disbursement ID */
  id: bigint | number;
  /** The asset ID (0 for ALGO) */
  asset: bigint | number;
};

// ========== Read Method Params ==========

export type GetMbrParams = ContractArgs['mbr(string,string)(uint64,uint64)'];

export type GetDisbursementParams = {
  /** The disbursement ID */
  id: bigint | number;
};

export type GetUserAllocationParams = {
  /** The address of the account */
  address: string;
  /** The disbursement ID */
  disbursementId: bigint | number;
  /** The asset ID (0 for ALGO) */
  asset: bigint | number;
};

// ========== Global State Type ==========

export type RewardsGlobalState = {
  /** The current disbursement ID cursor */
  disbursementId: bigint;
  /** The contract version */
  version: string;
  /** The Akita DAO app ID */
  akitaDao: bigint;
};

// ========== Write Method Params ==========

export type OptInAssetParams = MaybeSigner & Omit<ContractArgs['optIn(pay,uint64)void'], 'payment'>;

export type CreateDisbursementParams = MaybeSigner & Omit<ContractArgs['createDisbursement(pay,string,uint64,uint64,string)uint64'], 'mbrPayment'>;

export type EditDisbursementParams = MaybeSigner & ContractArgs['editDisbursement(uint64,string,uint64,uint64,string)void'];

export type CreateUserAllocationsParams = MaybeSigner & {
  /** The disbursement ID */
  id: bigint | number;
  /** Array of user allocations */
  allocations: UserAllocation[];
};

export type CreateAsaUserAllocationsParams = MaybeSigner & {
  /** The disbursement ID */
  id: bigint | number;
  /** The asset ID for the allocations */
  asset: bigint | number;
  /** Array of user allocations */
  allocations: UserAllocation[];
};

export type FinalizeDisbursementParams = MaybeSigner & ContractArgs['finalizeDisbursement(uint64)void'];

export type CreateInstantDisbursementParams = MaybeSigner & {
  /** Unix timestamp when rewards unlock (0 for immediate) */
  timeToUnlock: bigint | number;
  /** Unix timestamp when rewards expire */
  expiration: bigint | number;
  /** Array of user allocations */
  allocations: UserAllocation[];
};

export type CreateInstantAsaDisbursementParams = MaybeSigner & {
  /** Unix timestamp when rewards unlock (0 for immediate) */
  timeToUnlock: bigint | number;
  /** Unix timestamp when rewards expire */
  expiration: bigint | number;
  /** The asset ID for the disbursement */
  asset: bigint | number;
  /** Array of user allocations */
  allocations: UserAllocation[];
};

export type ClaimRewardsParams = MaybeSigner & {
  /** Array of rewards to claim */
  rewards: ClaimDetail[];
};

export type ReclaimRewardsParams = MaybeSigner & {
  /** The disbursement ID */
  id: bigint | number;
  /** Array of allocations to reclaim */
  reclaims: AllocationReclaim[];
};

export type UpdateAkitaDaoParams = MaybeSigner & ContractArgs['updateAkitaDAO(uint64)void'];

