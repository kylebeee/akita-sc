import { StakingPoolFactoryArgs, StakingPoolFactoryClient } from '../generated/StakingPoolFactoryClient';
import { MaybeSigner, NewContractSDKParams } from '../types';
import { StakingPoolSDK } from './index';
import { BaseSDK } from '../base';
import { NewPoolParams, DeletePoolParams, StakingPoolMbrParams } from './types';
import { StakingPoolMbrData } from '../generated/StakingPoolClient';
export type StakingPoolFactoryContractArgs = StakingPoolFactoryArgs["obj"];
/**
 * SDK for interacting with the Staking Pool Factory contract.
 * Used to create new staking pools and manage pool templates.
 */
export declare class StakingPoolFactorySDK extends BaseSDK<StakingPoolFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new staking pool via the factory and returns a StakingPoolSDK instance.
     * @returns StakingPoolSDK for the newly created pool
     */
    new({ sender, signer, title, type, marketplace, stakeKey, minimumStakeAmount, allowLateSignups, gateId, maxEntries }: NewPoolParams): Promise<StakingPoolSDK>;
    /**
     * Gets a StakingPoolSDK instance for an existing pool.
     * Note: Cannot be static as it requires instance properties (algorand, sendParams).
     * @param appId - The app ID of the pool
     * @returns StakingPoolSDK for the specified pool
     */
    get({ appId }: {
        appId: bigint;
    }): StakingPoolSDK;
    /**
     * Gets the cost to create a new staking pool.
     */
    cost(params?: MaybeSigner): Promise<bigint>;
    /**
     * Deletes a pool created by this factory.
     */
    deletePool({ sender, signer, appId }: DeletePoolParams): Promise<void>;
    /**
     * Sets the escrow app ID for the factory.
     */
    setEscrow({ sender, signer, escrow }: MaybeSigner & StakingPoolFactoryContractArgs['setEscrow(uint64)void']): Promise<void>;
    /**
     * Gets MBR (Minimum Balance Requirement) data for pool operations.
     */
    getMbr({ winningTickets }: StakingPoolMbrParams): Promise<StakingPoolMbrData>;
}
/**
 * Convenience function to create a new staking pool and return the SDK.
 * Creates a factory SDK, creates the pool, and returns the pool SDK.
 */
export declare function newStakingPool({ factoryParams, algorand, readerAccount, sendParams, ...poolParams }: NewContractSDKParams & NewPoolParams): Promise<StakingPoolSDK>;
