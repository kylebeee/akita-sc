import { StakingPoolFactoryArgs, StakingPoolFactoryClient, StakingPoolFactoryFactory } from '../generated/StakingPoolFactoryClient'
import { hasSenderSigner, MaybeSigner, NewContractSDKParams } from '../types';
import { StakingPoolSDK } from './index';
import { BaseSDK } from '../base';
import { emptySigner } from '../constants';
import { microAlgo } from '@algorandfoundation/algokit-utils';
import { NewPoolParams, DeletePoolParams, StakingPoolMbrParams } from './types';
import { StakingPoolMbrData } from '../generated/StakingPoolClient';

export type StakingPoolFactoryContractArgs = StakingPoolFactoryArgs["obj"];

/**
 * SDK for interacting with the Staking Pool Factory contract.
 * Used to create new staking pools and manage pool templates.
 */
export class StakingPoolFactorySDK extends BaseSDK<StakingPoolFactoryClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: StakingPoolFactoryFactory, ...params });
  }

  /**
   * Creates a new staking pool via the factory and returns a StakingPoolSDK instance.
   * @returns StakingPoolSDK for the newly created pool
   */
  async new({
    sender,
    signer,
    title,
    type,
    marketplace,
    stakeKey,
    minimumStakeAmount,
    gateId = 0n,
    maxEntries = 0n
  }: NewPoolParams): Promise<StakingPoolSDK> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    const poolCost = await this.cost();

    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(poolCost),
      receiver: this.client.appAddress,
    });

    const { return: appId } = await this.client.send.newPool({
      ...sendParams,
      args: {
        payment,
        title,
        type,
        marketplace,
        stakeKey,
        minimumStakeAmount,
        gateId,
        maxEntries
      }
    });

    if (appId === undefined) {
      throw new Error('Failed to create new staking pool');
    }

    return new StakingPoolSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    });
  }

  /**
   * Gets a StakingPoolSDK instance for an existing pool.
   * Note: Cannot be static as it requires instance properties (algorand, sendParams).
   * @param appId - The app ID of the pool
   * @returns StakingPoolSDK for the specified pool
   */
  get({ appId }: { appId: bigint }): StakingPoolSDK {
    return new StakingPoolSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    });
  }

  /**
   * Gets the cost to create a new staking pool.
   */
  async cost(params?: MaybeSigner): Promise<bigint> {

    const defaultParams = {
      ...this.sendParams,
      sender: this.readerAccount,
      signer: emptySigner
    }

    const { sender, signer } = params || {};
    const sendParams = {
      ...defaultParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    const cost = await this.client.newPoolCost({
      ...sendParams,
      args: {}
    });

    return cost;
  }

  /**
   * Deletes a pool created by this factory.
   */
  async deletePool({ sender, signer, appId }: DeletePoolParams): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.deletePool({
      ...sendParams,
      args: { appId }
    });
  }

  /**
   * Sets the escrow app ID for the factory.
   */
  async setEscrow({ sender, signer, escrow }: MaybeSigner & StakingPoolFactoryContractArgs['setEscrow(uint64)void']): Promise<void> {

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    };

    await this.client.send.setEscrow({
      ...sendParams,
      args: { escrow }
    });
  }

  /**
   * Gets MBR (Minimum Balance Requirement) data for pool operations.
   */
  async getMbr({ winningTickets }: StakingPoolMbrParams): Promise<StakingPoolMbrData> {
    return await this.client.mbr({ args: { winningTickets } });
  }
}

/**
 * Convenience function to create a new staking pool and return the SDK.
 * Creates a factory SDK, creates the pool, and returns the pool SDK.
 */
export async function newStakingPool({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  ...poolParams
}: NewContractSDKParams & NewPoolParams): Promise<StakingPoolSDK> {
  const factory = new StakingPoolFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  return await factory.new(poolParams);
}