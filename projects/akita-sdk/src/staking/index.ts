import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import {
  StakingClient, 
  StakingFactory,
  Stake,
  Escrow,
  StakeCheck,
  TotalsInfo
} from '../generated/StakingClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import {
  StakeArgs,
  WithdrawArgs,
  CreateHeartbeatArgs,
  UpdateSettingsArgs,
  SoftCheckArgs,
  GetTimeLeftArgs,
  GetInfoArgs,
  GetEscrowInfoArgs,
  GetHeartbeatArgs,
  GetHeartbeatAverageArgs,
  GetInfoListArgs,
  StakeCheckArgs,
  HeartbeatEntry,
  StakingType,
  StakeInfo,
  AssetCheck,
  OptInArgs
} from "./types";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { AppReturn } from "@algorandfoundation/algokit-utils/types/app";

export * from './types';

/**
 * SDK for interacting with the global Staking contract.
 * Handles all staking operations including soft, hard, lock, and heartbeat staking.
 */
export class StakingSDK extends BaseSDK<StakingClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: StakingFactory, ...params }, ENV_VAR_NAMES.STAKING_APP_ID);
  }

  async softCheck({ address, asset }: SoftCheckArgs): Promise<StakeCheck> {
    const { return: result } = await this.client.send.softCheck({ 
      args: { address, asset } 
    });

    if (result === undefined) {
      throw new Error('Failed to perform soft check');
    }

    return result
  }

  async getTimeLeft({ address, asset }: GetTimeLeftArgs): Promise<bigint> {
    const { return: timeLeft } = await this.client.send.getTimeLeft({ 
      args: { address, asset } 
    });
    return timeLeft ?? 0n;
  }

  async mustGetTimeLeft({ address, asset }: GetTimeLeftArgs): Promise<bigint> {
    const { return: timeLeft } = await this.client.send.mustGetTimeLeft({ 
      args: { address, asset } 
    });

    if (timeLeft === undefined) {
      throw new Error('No active stake found');
    }

    return timeLeft;
  }

  /**
   * Gets stake info for an address and stake type.
   * Returns undefined if no stake exists.
   */
  async getInfo({ address, stake }: GetInfoArgs): Promise<Stake> {
    return await this.client.getInfo({ 
      args: { address, stake } 
    });
  }

  /**
   * Gets stake info for an address and stake type.
   * Throws if no stake exists.
   */
  async mustGetInfo({ address, stake }: GetInfoArgs): Promise<Stake> {
    const { return: info } = await this.client.send.mustGetInfo({ 
      args: { address, stake } 
    });

    if (info === undefined) {
      throw new Error('No stake info found');
    }

    return info;
  }

  /**
   * Gets escrow info for an address and asset.
   */
  async getEscrowInfo({ address, asset }: GetEscrowInfoArgs): Promise<Escrow | undefined> {
    const { return: info } = await this.client.send.getEscrowInfo({ 
      args: { address, asset } 
    });
    return info;
  }

  /**
   * Gets heartbeat data for an address and asset.
   * Returns an array of heartbeat entries.
   */
  async getHeartbeat({ address, asset }: GetHeartbeatArgs): Promise<HeartbeatEntry[]> {
    const { return: heartbeats } = await this.client.send.getHeartbeat({ 
      args: { address, asset } 
    });

    if (!heartbeats) {
      return [];
    }

    return heartbeats.map(([timestamp, balance, escrowed, average]) => ({
      timestamp,
      balance,
      escrowed,
      average
    }));
  }

  /**
   * Gets heartbeat data for an address and asset.
   * Throws if no heartbeat exists.
   */
  async mustGetHeartbeat({ address, asset }: GetHeartbeatArgs): Promise<HeartbeatEntry[]> {
    const { return: heartbeats } = await this.client.send.mustGetHeartbeat({ 
      args: { address, asset } 
    });

    if (heartbeats === undefined) {
      throw new Error('No heartbeat found');
    }

    return heartbeats.map(([timestamp, balance, escrowed, average]) => ({
      timestamp,
      balance,
      escrowed,
      average
    }));
  }

  /**
   * Gets the average heartbeat value for an address and asset.
   */
  async getHeartbeatAverage({ address, asset, includeEscrowed }: GetHeartbeatAverageArgs): Promise<bigint> {
    const { return: average } = await this.client.send.getHeartbeatAverage({ 
      args: { address, asset, includeEscrowed } 
    });
    return average ?? 0n;
  }

  /**
   * Gets the average heartbeat value for an address and asset.
   * Throws if no heartbeat exists.
   */
  async mustGetHeartbeatAverage({ address, asset, includeEscrowed }: GetHeartbeatAverageArgs): Promise<bigint> {
    const { return: average } = await this.client.send.mustGetHeartbeatAverage({ 
      args: { address, asset, includeEscrowed } 
    });

    if (average === undefined) {
      throw new Error('No heartbeat average found');
    }

    return average;
  }

  /**
   * Gets stake info for multiple assets at once.
   */
  async getInfoList({ address, type, assets }: GetInfoListArgs): Promise<Stake[]> {
    const { return: infoList } = await this.client.send.getInfoList({ 
      args: { address, type, assets } 
    });

    if (!infoList) {
      return [];
    }

    return infoList.map(([amount, lastUpdate, expiration]) => ({
      amount,
      lastUpdate,
      expiration
    }));
  }

  /**
   * Gets stake info for multiple assets at once.
   * Throws if any stake doesn't exist.
   */
  async mustGetInfoList({ address, type, assets }: GetInfoListArgs): Promise<Stake[]> {
    const { return: infoList } = await this.client.send.mustGetInfoList({ 
      args: { address, type, assets } 
    });

    if (infoList === undefined) {
      throw new Error('Failed to get info list');
    }

    return infoList.map(([amount, lastUpdate, expiration]) => ({
      amount,
      lastUpdate,
      expiration
    }));
  }

  async stakeCheck({ 
    address, 
    checks,
    type, 
    includeEscrowed 
  }: { 
    address: string; 
    checks: AssetCheck[];
    type: StakingType;
    includeEscrowed: boolean;
  }): Promise<boolean> {

    const formattedChecks: [bigint | number, bigint | number][] = checks.map(r => [
      r.asset,
      r.amount
    ]);

    return await this.client.stakeCheck({ 
      args: { 
        address,
        checks: formattedChecks,
        type,
        includeEscrowed
      } 
    });
  }

  /**
   * Stakes an asset in the staking contract.
   * @param type - The staking type (Heartbeat, Soft, Hard, Lock)
   * @param asset - The asset ID to stake
   * @param amount - The amount to stake
   * @param expiration - The expiration timestamp (for Hard/Lock staking)
   */
  async stake(args: StakeArgs): Promise<void> {

    const { sender, signer, type, asset = 0n, amount } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    // For escrowed staking (Hard/Lock), the payment includes the amount being staked
    // For non-escrowed staking (Soft/Heartbeat), only the MBR cost is required
    const isEscrowed = type === StakingType.Hard || type === StakingType.Lock;

    let expiration: bigint;
    if (isEscrowed) {
      // ensure args.expiration is in the future
      if (args.expiration < BigInt(Date.now() / 1000)) { // AVM uses unix timestamp in seconds
        throw new Error('Expiration must be in the future');
      }
      expiration = args.expiration;
    } else {
      expiration = 0n;
    }

    const cost = await this.stakeCost(asset, type);

    if (asset === 0n) {

      const total = microAlgo(isEscrowed ? cost + amount : cost);

      const payment = this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: total,
        receiver: this.client.appAddress,
      });

      await this.client.send.stake({
        ...sendParams,
        args: {
          payment,
          type,
          amount,
          expiration
        }
      });
    } else {

      const payment = this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo(cost),
        receiver: this.client.appAddress,
      });

      const assetXfer = this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount,
        assetId: asset,
        receiver: this.client.appAddress,
      });

      await this.client.send.stakeAsa({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          type,
          amount,
          expiration
        }
      });
    }
  }

  /**
   * Withdraws a stake from the contract.
   * @param asset - The asset ID (0 for ALGO)
   * @param type - The staking type
   */
  async withdraw({ sender, signer, asset, type }: WithdrawArgs): Promise<AppReturn<void>> {
    return await this.client.send.withdraw({
      ...this.getSendParams({ sender, signer }),
      args: { asset, type }
    });
  }

  /**
   * Creates a heartbeat entry for tracking stake history.
   * @param address - The address to create heartbeat for
   * @param asset - The asset ID (0 for ALGO)
   */
  async createHeartbeat({ sender, signer, address, asset }: CreateHeartbeatArgs): Promise<AppReturn<void>> {
    return await this.client.send.createHeartbeat({
      ...this.getSendParams({ sender, signer }),
      args: { address, asset }
    });
  }

  /**
   * Updates settings for a stake (e.g., extending expiration).
   * @param asset - The asset ID
   * @param value - The new value/setting
   */
  async updateSettings({ sender, signer, asset, value }: UpdateSettingsArgs): Promise<void> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0), // May need adjustment based on operation
      receiver: this.client.appAddress,
    });

    await this.client.send.updateSettings({
      ...sendParams,
      args: {
        payment,
        asset,
        value
      }
    });
  }

  async optIn({ sender, signer, asset }: OptInArgs): Promise<void> {
    const sendParams = this.getRequiredSendParams({ sender, signer });

    const cost = await this.optInCost();

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress,
    });

    await this.client.send.optIn({ 
      ...sendParams,
      args: { payment, asset },
    });
  }

  async optInCost(): Promise<bigint> {
    return await this.client.optInCost();
  }

  async stakeCost(asset: bigint | number, type: StakingType): Promise<bigint> {
    return await this.client.stakeCost({ 
      args: { asset, type } 
    });
  }

  async getTotals(assets: bigint[]): Promise<TotalsInfo[]> {
    return await this.client.getTotals({ 
      args: { assets } 
    }) as unknown as TotalsInfo[];
  }
}
