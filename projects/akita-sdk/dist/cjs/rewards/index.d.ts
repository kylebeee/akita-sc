import { BaseSDK } from "../base";
import { RewardsClient, DisbursementDetails, RewardsMbrData } from '../generated/RewardsClient';
import { NewContractSDKParams } from "../types";
import { GetMbrParams, GetDisbursementParams, GetUserAllocationParams, RewardsGlobalState, OptInAssetParams, CreateDisbursementParams, EditDisbursementParams, CreateUserAllocationsParams, CreateAsaUserAllocationsParams, FinalizeDisbursementParams, CreateInstantDisbursementParams, CreateInstantAsaDisbursementParams, ClaimRewardsParams, ReclaimRewardsParams, UpdateAkitaDaoParams } from "./types";
export * from "./types";
/**
 * SDK for interacting with the Rewards contract.
 * Use this to create disbursements, manage allocations, and claim/reclaim rewards.
 */
export declare class RewardsSDK extends BaseSDK<RewardsClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Calculates the number of opUp calls needed for a given reference count.
     * @param referencesNeeded - Number of references needed for the operation
     * @param baseReferences - Base references available (default 8)
     * @returns Number of opUp calls needed (0 if none needed)
     */
    private calculateOpUpsNeeded;
    /**
     * Adds the required number of opUp calls to a transaction group.
     * Each opUp call adds 8 more reference slots to the group.
     */
    private addOpUps;
    /**
     * Gets the current global state of the rewards contract.
     */
    getState(): Promise<RewardsGlobalState>;
    /**
     * Gets the MBR (Minimum Balance Requirement) data for creating disbursements.
     * @param title - The disbursement title
     * @param note - The disbursement note
     */
    mbr({ title, note }: GetMbrParams): Promise<RewardsMbrData>;
    /**
     * Gets a specific disbursement by ID.
     */
    getDisbursement({ id }: GetDisbursementParams): Promise<DisbursementDetails>;
    /**
     * Gets all disbursements as a map.
     */
    getDisbursements(): Promise<Map<bigint, DisbursementDetails>>;
    /**
     * Gets a user's allocation for a specific disbursement and asset.
     */
    getUserAllocation({ address, disbursementId, asset }: GetUserAllocationParams): Promise<bigint>;
    /**
     * Checks if a user has an allocation for a specific disbursement and asset.
     */
    hasAllocation({ address, disbursementId, asset }: GetUserAllocationParams): Promise<boolean>;
    /**
     * Opts the rewards contract into an asset.
     */
    optIn({ sender, signer, asset }: OptInAssetParams): Promise<void>;
    /**
     * Creates a new disbursement.
     * Returns the disbursement ID.
     */
    createDisbursement({ sender, signer, title, timeToUnlock, expiration, note, }: CreateDisbursementParams): Promise<bigint>;
    /**
     * Edits an existing disbursement (only before finalization).
     */
    editDisbursement({ sender, signer, id, title, timeToUnlock, expiration, note, }: EditDisbursementParams): Promise<void>;
    /**
     * Helper to format allocations for the contract.
     */
    private formatAllocations;
    /**
     * Calculates the total amount from allocations.
     */
    private sumAllocations;
    /**
     * Creates ALGO allocations for a disbursement.
     * The payment includes both MBR for the boxes and the actual ALGO to distribute.
     * Automatically adds opUp calls for large allocation batches.
     */
    createUserAllocations({ sender, signer, id, allocations, }: CreateUserAllocationsParams): Promise<void>;
    /**
     * Creates ASA allocations for a disbursement.
     * Requires both an MBR payment and an asset transfer.
     * Automatically adds opUp calls for large allocation batches.
     */
    createAsaUserAllocations({ sender, signer, id, asset, allocations, }: CreateAsaUserAllocationsParams): Promise<void>;
    /**
     * Finalizes a disbursement, locking it for distribution.
     */
    finalizeDisbursement({ sender, signer, id }: FinalizeDisbursementParams): Promise<void>;
    /**
     * Creates and finalizes an ALGO disbursement in a single call.
     * Returns the disbursement ID.
     * Automatically adds opUp calls for large allocation batches.
     */
    createInstantDisbursement({ sender, signer, timeToUnlock, expiration, allocations, }: CreateInstantDisbursementParams): Promise<bigint>;
    /**
     * Creates and finalizes an ASA disbursement in a single call.
     * Returns the disbursement ID.
     * Automatically adds opUp calls for large allocation batches.
     */
    createInstantAsaDisbursement({ sender, signer, timeToUnlock, expiration, asset, allocations, }: CreateInstantAsaDisbursementParams): Promise<bigint>;
    /**
     * Claims rewards from one or more disbursements.
     * The caller claims their allocated rewards.
     * Automatically adds opUp calls for claiming from many disbursements.
     */
    claimRewards({ sender, signer, rewards }: ClaimRewardsParams): Promise<void>;
    /**
     * Reclaims unclaimed rewards after a disbursement has expired.
     * Only the disbursement creator can reclaim.
     * Automatically adds opUp calls for reclaiming many allocations.
     */
    reclaimRewards({ sender, signer, id, reclaims }: ReclaimRewardsParams): Promise<void>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDao({ sender, signer, akitaDao }: UpdateAkitaDaoParams): Promise<void>;
}
