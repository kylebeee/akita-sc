import { BaseSDK } from "../base";
import { StakingClient, Stake, Escrow, StakeCheck, TotalsInfo } from '../generated/StakingClient';
import { NewContractSDKParams } from "../types";
import { StakeArgs, WithdrawArgs, CreateHeartbeatArgs, UpdateSettingsArgs, SoftCheckArgs, GetTimeLeftArgs, GetInfoArgs, GetEscrowInfoArgs, GetHeartbeatArgs, GetHeartbeatAverageArgs, GetInfoListArgs, HeartbeatEntry, StakingType, AssetCheck, OptInArgs } from "./types";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";
export * from './types';
/**
 * SDK for interacting with the global Staking contract.
 * Handles all staking operations including soft, hard, lock, and heartbeat staking.
 */
export declare class StakingSDK extends BaseSDK<StakingClient> {
    constructor(params: NewContractSDKParams);
    softCheck({ address, asset }: SoftCheckArgs): Promise<StakeCheck>;
    getTimeLeft({ address, asset }: GetTimeLeftArgs): Promise<bigint>;
    mustGetTimeLeft({ address, asset }: GetTimeLeftArgs): Promise<bigint>;
    /**
     * Gets stake info for an address and stake type.
     * Returns undefined if no stake exists.
     */
    getInfo({ address, stake }: GetInfoArgs): Promise<Stake>;
    /**
     * Gets stake info for an address and stake type.
     * Throws if no stake exists.
     */
    mustGetInfo({ address, stake }: GetInfoArgs): Promise<Stake>;
    /**
     * Gets escrow info for an address and asset.
     */
    getEscrowInfo({ address, asset }: GetEscrowInfoArgs): Promise<Escrow | undefined>;
    /**
     * Gets heartbeat data for an address and asset.
     * Returns an array of heartbeat entries.
     */
    getHeartbeat({ address, asset }: GetHeartbeatArgs): Promise<HeartbeatEntry[]>;
    /**
     * Gets heartbeat data for an address and asset.
     * Throws if no heartbeat exists.
     */
    mustGetHeartbeat({ address, asset }: GetHeartbeatArgs): Promise<HeartbeatEntry[]>;
    /**
     * Gets the average heartbeat value for an address and asset.
     */
    getHeartbeatAverage({ address, asset, includeEscrowed }: GetHeartbeatAverageArgs): Promise<bigint>;
    /**
     * Gets the average heartbeat value for an address and asset.
     * Throws if no heartbeat exists.
     */
    mustGetHeartbeatAverage({ address, asset, includeEscrowed }: GetHeartbeatAverageArgs): Promise<bigint>;
    /**
     * Gets stake info for multiple assets at once.
     */
    getInfoList({ address, type, assets }: GetInfoListArgs): Promise<Stake[]>;
    /**
     * Gets stake info for multiple assets at once.
     * Throws if any stake doesn't exist.
     */
    mustGetInfoList({ address, type, assets }: GetInfoListArgs): Promise<Stake[]>;
    stakeCheck({ address, checks, type, includeEscrowed }: {
        address: string;
        checks: AssetCheck[];
        type: StakingType;
        includeEscrowed: boolean;
    }): Promise<boolean>;
    /**
     * Stakes an asset in the staking contract.
     * @param type - The staking type (Heartbeat, Soft, Hard, Lock)
     * @param asset - The asset ID to stake
     * @param amount - The amount to stake
     * @param expiration - The expiration timestamp (for Hard/Lock staking)
     */
    stake(args: StakeArgs): Promise<void>;
    /**
     * Withdraws a stake from the contract.
     * @param asset - The asset ID (0 for ALGO)
     * @param type - The staking type
     */
    withdraw({ sender, signer, asset, type }: WithdrawArgs): Promise<AppReturn<void>>;
    /**
     * Creates a heartbeat entry for tracking stake history.
     * @param address - The address to create heartbeat for
     * @param asset - The asset ID (0 for ALGO)
     */
    createHeartbeat({ sender, signer, address, asset }: CreateHeartbeatArgs): Promise<AppReturn<void>>;
    /**
     * Updates settings for a stake (e.g., extending expiration).
     * @param asset - The asset ID
     * @param value - The new value/setting
     */
    updateSettings({ sender, signer, asset, value }: UpdateSettingsArgs): Promise<void>;
    optIn({ sender, signer, asset }: OptInArgs): Promise<void>;
    optInCost(): Promise<bigint>;
    stakeCost(asset: bigint | number, type: StakingType): Promise<bigint>;
    getTotals(assets: bigint[]): Promise<TotalsInfo[]>;
}
