import { BaseSDK } from "../base";
import { StakingPoolClient, StakingPoolArgs, StakingPoolState, StakingPoolMbrData, Reward } from '../generated/StakingPoolClient';
import { GroupReturn, MaybeSigner, NewContractSDKParams } from "../types";
import { AddRewardAsaParams, FinalizePoolParams, EnterPoolParams, StartDisbursementParams, RaffleParams, DisburseRewardsParams, FinalizeDistributionParams, OptinAssetParams, CheckParams, CheckResult, IsEnteredParams, StakingPoolMbrParams, GateCheckParams } from "./types";
export * from "./factory";
export * from "./types";
type PoolContractArgs = StakingPoolArgs["obj"];
/**
 * SDK for interacting with an individual Staking Pool contract.
 * Use this to manage pool state, add rewards, and handle entries.
 */
export declare class StakingPoolSDK extends BaseSDK<StakingPoolClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the pool.
     */
    getState(): Promise<StakingPoolState>;
    /**
     * Checks if pool signups are currently open.
     */
    signUpsOpen(): Promise<boolean>;
    /**
     * Checks if the pool is currently live (active).
     */
    isLive(): Promise<boolean>;
    /**
     * Checks if an address is entered in the pool.
     */
    isEntered({ address }: IsEnteredParams): Promise<boolean>;
    /**
     * Checks eligibility and stake amount for an address/asset combination.
     */
    check({ address, asset }: CheckParams): Promise<CheckResult>;
    gateCheck({ gateTxn, address, asset }: GateCheckParams): Promise<void>;
    /**
     * Gets MBR data for the pool based on winning tickets count.
     */
    getMbr({ winningTickets }: StakingPoolMbrParams): Promise<StakingPoolMbrData>;
    getReward(rewardId: number): Promise<Reward>;
    getRewards(): Promise<Map<number, Reward>>;
    /**
     * Initializes the pool after creation.
     */
    init(params?: MaybeSigner): Promise<void>;
    /**
     * Opts the pool contract into an asset.
     */
    optIn({ sender, signer, asset }: OptinAssetParams): Promise<GroupReturn>;
    /**
     * Adds a reward to the pool.
     */
    addReward({ sender, signer, reward, amount }: AddRewardAsaParams): Promise<void>;
    /**
     * Finalizes the pool with signup, start, and end timestamps.
     */
    finalize({ sender, signer, signupTimestamp, startTimestamp, endTimestamp }: FinalizePoolParams): Promise<void>;
    /**
     * Gets the cost to enter the pool for a given address and entry count.
     * This calls the contract's enterCost method which accounts for box MBR and any pool funding shortfall.
     */
    enterCost({ address, entryCount }: {
        address: string;
        entryCount: number;
    }): Promise<bigint>;
    /**
     * Enters the pool with specified entries.
     */
    enter({ sender, signer, entries, gateTxn }: EnterPoolParams): Promise<void>;
    /**
     * Starts the disbursement phase for a reward.
     */
    startDisbursement({ sender, signer, rewardId }: StartDisbursementParams): Promise<void>;
    /**
     * Runs a raffle for a raffle-type reward.
     */
    raffle({ sender, signer, rewardId }: RaffleParams): Promise<void>;
    /**
     * Disburses rewards to participants.
     */
    disburseRewards({ sender, signer, rewardId, iterationAmount }: DisburseRewardsParams): Promise<void>;
    /**
     * Finalizes the distribution for a reward.
     */
    finalizeDistribution({ sender, signer, rewardId }: FinalizeDistributionParams): Promise<void>;
    /**
     * Updates the Akita DAO escrow reference.
     */
    updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & PoolContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & PoolContractArgs['updateAkitaDAO(uint64)void']): Promise<void>;
}
