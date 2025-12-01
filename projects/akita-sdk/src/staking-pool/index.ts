import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { 
  StakingPoolClient, 
  StakingPoolFactory, 
  StakingPoolArgs,
  StakingPoolState,
  StakingPoolMbrData
} from '../generated/StakingPoolClient';
import { hasSenderSigner, MaybeSigner, NewContractSDKParams } from "../types";
import { 
  AddRewardParams,
  AddRewardAsaParams,
  FinalizePoolParams,
  EnterPoolParams,
  StartDisbursementParams,
  RaffleParams,
  DisburseRewardsParams,
  FinalizeDistributionParams,
  OptinAssetParams,
  CheckParams,
  CheckResult,
  IsEnteredParams,
  StakingPoolMbrParams
} from "./types";

export * from "./factory";
export * from "./types";

type PoolContractArgs = StakingPoolArgs["obj"];

/**
 * SDK for interacting with an individual Staking Pool contract.
 * Use this to manage pool state, add rewards, and handle entries.
 */
export class StakingPoolSDK extends BaseSDK<StakingPoolClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: StakingPoolFactory, ...params });
  }

  // ========== Read Methods ==========

  /**
   * Gets the current state of the pool.
   */
  async getState(): Promise<StakingPoolState> {
    const { return: state } = await this.client.send.getState({ args: {} });

    if (state === undefined) {
      throw new Error('Failed to get pool state');
    }

    return state;
  }

  /**
   * Checks if pool signups are currently open.
   */
  async signUpsOpen(): Promise<boolean> {
    const { return: isOpen } = await this.client.send.signUpsOpen({ args: {} });
    return isOpen ?? false;
  }

  /**
   * Checks if the pool is currently live (active).
   */
  async isLive(): Promise<boolean> {
    const { return: live } = await this.client.send.isLive({ args: {} });
    return live ?? false;
  }

  /**
   * Checks if an address is entered in the pool.
   */
  async isEntered({ address }: IsEnteredParams): Promise<boolean> {
    const { return: entered } = await this.client.send.isEntered({ args: { address } });
    return entered ?? false;
  }

  /**
   * Checks eligibility and stake amount for an address/asset combination.
   */
  async check({ address, asset }: CheckParams): Promise<CheckResult> {
    const { return: result } = await this.client.send.check({ args: { address, asset } });

    if (result === undefined) {
      throw new Error('Failed to check eligibility');
    }

    return {
      isEligible: result.valid,
      stake: result.balance
    };
  }

  /**
   * Gets MBR data for the pool based on winning tickets count.
   */
  async getMbr({ winningTickets }: StakingPoolMbrParams): Promise<StakingPoolMbrData> {
    const { return: mbrData } = await this.client.send.mbr({ args: { winningTickets } });

    if (mbrData === undefined) {
      throw new Error('Failed to get MBR data');
    }

    return mbrData;
  }

  // ========== Write Methods ==========

  /**
   * Initializes the pool after creation.
   */
  async init(params?: MaybeSigner): Promise<void> {
    const { sender, signer } = params || {};

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.init({
      ...sendParams,
      args: {}
    });
  }

  /**
   * Opts the pool contract into an asset.
   */
  async optinAsset({ sender, signer, asset }: OptinAssetParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(100_000), // Standard ASA opt-in MBR
      receiver: this.client.appAddress,
    });

    await this.client.send.optIn({
      ...sendParams,
      args: {
        payment,
        asset
      }
    });
  }

  /**
   * Adds a reward to the pool.
   */
  async addReward({ sender, signer, reward, amount }: AddRewardAsaParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    // Get MBR for reward
    const mbrData = await this.getMbr({ winningTickets: reward.winnerCount });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrData.rewards),
      receiver: this.client.appAddress,
    });

    const assetXfer = this.client.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: BigInt(amount),
      assetId: BigInt(reward.asset),
      receiver: this.client.appAddress,
    });

    await this.client.send.addRewardAsa({
      ...sendParams,
      args: {
        payment,
        assetXfer,
        reward
      }
    });
  }

  /**
   * Finalizes the pool with signup, start, and end timestamps.
   */
  async finalize({ sender, signer, signupTimestamp, startTimestamp, endTimestamp }: FinalizePoolParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.finalize({
      ...sendParams,
      args: {
        signupTimestamp,
        startTimestamp,
        endTimestamp
      }
    });
  }

  /**
   * Enters the pool with specified entries.
   */
  async enter({ sender, signer, entries, args = [] }: EnterPoolParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    // Get MBR for entries
    const mbrData = await this.getMbr({ winningTickets: 0 });

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrData.entries * BigInt(entries.length) + mbrData.entriesByAddress),
      receiver: this.client.appAddress,
    });

    // Transform entries to the expected format
    const formattedEntries: [bigint | number, bigint | number, Uint8Array[]][] = entries.map(e => [
      e.asset,
      e.amount,
      e.proofs ?? []
    ]);

    await this.client.send.enter({
      ...sendParams,
      args: {
        payment,
        entries: formattedEntries,
        args
      }
    });
  }

  /**
   * Starts the disbursement phase for a reward.
   */
  async startDisbursement({ sender, signer, rewardId }: StartDisbursementParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.startDisbursement({
      ...sendParams,
      args: { rewardId }
    });
  }

  /**
   * Runs a raffle for a raffle-type reward.
   */
  async raffle({ sender, signer, rewardId }: RaffleParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.raffle({
      ...sendParams,
      args: { rewardId }
    });
  }

  /**
   * Disburses rewards to participants.
   */
  async disburseRewards({ sender, signer, rewardId, iterationAmount }: DisburseRewardsParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.disburseRewards({
      ...sendParams,
      args: {
        rewardId,
        iterationAmount
      }
    });
  }

  /**
   * Finalizes the distribution for a reward.
   */
  async finalizeDistribution({ sender, signer, rewardId }: FinalizeDistributionParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.finalizeDistribution({
      ...sendParams,
      args: { rewardId }
    });
  }

  /**
   * Updates the Akita DAO escrow reference.
   */
  async updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & PoolContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.updateAkitaDaoEscrow({
      ...sendParams,
      args: { app }
    });
  }

  /**
   * Updates the Akita DAO reference.
   */
  async updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & PoolContractArgs['updateAkitaDAO(uint64)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.updateAkitaDao({
      ...sendParams,
      args: { akitaDao }
    });
  }
}
