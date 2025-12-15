import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import {
  RaffleFactoryClient,
  RaffleFactoryFactory,
  RaffleFactoryArgs,
} from '../generated/RaffleFactoryClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { RaffleSDK } from "./index";
import {
  NewRaffleParams,
  NewPrizeBoxRaffleParams,
  DeleteRaffleParams,
} from "./types";

export type RaffleFactoryContractArgs = RaffleFactoryArgs["obj"];

/**
 * SDK for interacting with the Raffle Factory contract.
 * Used to create new raffles and manage raffle lifecycle.
 */
export class RaffleFactorySDK extends BaseSDK<RaffleFactoryClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: RaffleFactoryFactory, ...params }, ENV_VAR_NAMES.RAFFLE_FACTORY_APP_ID);
  }

  /**
   * Creates a new raffle with an ASA prize and returns a RaffleSDK instance.
   * @returns RaffleSDK for the newly created raffle
   */
  async newRaffle({
    sender,
    signer,
    prizeAsset,
    prizeAmount,
    ticketAsset,
    startTimestamp,
    endTimestamp,
    minTickets,
    maxTickets,
    gateId,
    marketplace,
    name,
    proof,
    weightsListCount,
  }: NewRaffleParams): Promise<RaffleSDK> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Get the cost for creating a new raffle
    const isAlgoTicket = BigInt(ticketAsset) === 0n;
    const cost = this.cost({ isPrizeBox: false, isAlgoTicket, weightsListCount });

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress,
    });

    const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: BigInt(prizeAmount),
      assetId: BigInt(prizeAsset),
      receiver: this.client.appAddress,
    });

    // Raffle creation with weights boxes needs multiple opUps for app reference limits
    // Each opUp adds 8 more reference slots. Max group size is 16.
    // newRaffle + pay + assetXfer = 3, so we can add up to 13 opUps
    const needsOpUp = BigInt(weightsListCount) > 0n;
    let appId: bigint | undefined;

    if (needsOpUp) {
      const group = this.client.newGroup();
      group.newRaffle({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          minTickets,
          maxTickets,
          gateId,
          marketplace,
          name,
          proof,
          weightsListCount,
        },
      });
      // Raffle creation needs multiple opUps for weight box initialization
      // Each opUp adds 8 more reference slots. Max group size is 16.
      // newRaffle + pay + assetXfer = 3, so we can add up to 13 opUps
      for (let i = 0; i < 10; i++) {
        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
      }
      const result = await group.send(sendParams);
      appId = result.returns[0] as bigint | undefined;
    } else {
      ({ return: appId } = await this.client.send.newRaffle({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          minTickets,
          maxTickets,
          gateId,
          marketplace,
          name,
          proof,
          weightsListCount,
        },
      }));
    }

    if (appId === undefined) {
      throw new Error('Failed to create new raffle');
    }

    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer,
      },
    });
  }

  /**
   * Creates a new raffle with a PrizeBox as the prize.
   * @returns RaffleSDK for the newly created raffle
   */
  async newPrizeBoxRaffle({
    sender,
    signer,
    prizeBox,
    ticketAsset,
    startTimestamp,
    endTimestamp,
    minTickets,
    maxTickets,
    gateId,
    marketplace,
    weightsListCount,
  }: NewPrizeBoxRaffleParams): Promise<RaffleSDK> {

    const sendParams = this.getRequiredSendParams({ sender, signer });

    // Get the cost for creating a new raffle
    const isAlgoTicket = BigInt(ticketAsset) === 0n;
    const cost = this.cost({ isPrizeBox: true, isAlgoTicket, weightsListCount });

    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress,
    });

    const { return: appId } = await this.client.send.newPrizeBoxRaffle({
      ...sendParams,
      args: {
        payment,
        prizeBox,
        ticketAsset,
        startTimestamp,
        endTimestamp,
        minTickets,
        maxTickets,
        gateId,
        marketplace,
        weightsListCount,
      },
    });

    if (appId === undefined) {
      throw new Error('Failed to create new prize box raffle');
    }

    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer,
      },
    });
  }

  /**
   * Gets a RaffleSDK instance for an existing raffle.
   * @param appId - The app ID of the raffle
   * @returns RaffleSDK for the specified raffle
   */
  get({ appId }: { appId: bigint }): RaffleSDK {
    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer,
      },
    });
  }

  /**
   * Gets the cost to create a new raffle.
   * @param isPrizeBox - Whether the prize is a PrizeBox
   * @param isAlgoTicket - Whether tickets are paid in ALGO (ticketAsset === 0)
   * @param weightsListCount - Number of weights boxes
   * @param raffleCreationFee - Optional: the raffle creation fee from the DAO (default: 10 ALGO)
   */
  cost({ isPrizeBox = false, isAlgoTicket = true, weightsListCount = 1n, raffleCreationFee = 10_000_000n }: { isPrizeBox?: boolean, isAlgoTicket?: boolean, weightsListCount?: bigint | number, raffleCreationFee?: bigint } = {}): bigint {
    // Base cost: MAX_PROGRAM_PAGES + (GLOBAL_STATE_KEY_UINT_COST * globalUints) + (GLOBAL_STATE_KEY_BYTES_COST * globalBytes)
    const baseCost = 1_398_500n;
    const minBalance = 100_000n;
    const assetOptInMinBalance = 100_000n;
    const weightsMbr = 13_113_300n; // per weights box
    
    // Calculate optinMBR
    let optinMbr = 0n;
    if (!isPrizeBox) {
      optinMbr += assetOptInMinBalance; // For prize asset
    }
    if (!isAlgoTicket) {
      optinMbr += assetOptInMinBalance; // For ticket asset
    }
    
    const childAppMbr = minBalance + optinMbr;
    const weightsMbrTotal = BigInt(weightsListCount) * weightsMbr;
    
    return raffleCreationFee + baseCost + childAppMbr + weightsMbrTotal;
  }

  /**
   * Deletes a raffle created by this factory.
   * Can only be called after prize is claimed and all MBR is refunded.
   */
  async deleteRaffle({ sender, signer, appId }: DeleteRaffleParams): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.deleteRaffle({
      ...sendParams,
      args: { appId },
    });
  }

  /**
   * Updates the Akita DAO reference.
   */
  async updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & RaffleFactoryContractArgs['updateAkitaDAO(uint64)void']): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.updateAkitaDao({
      ...sendParams,
      args: { akitaDao },
    });
  }

  /**
   * Updates the Akita DAO Escrow reference.
   */
  async updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & RaffleFactoryContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void> {
    const sendParams = this.getSendParams({ sender, signer });

    await this.client.send.updateAkitaDaoEscrow({
      ...sendParams,
      args: { app },
    });
  }
}

/**
 * Convenience function to create a new raffle and return the SDK.
 * Creates a factory SDK, creates the raffle, and returns the raffle SDK.
 */
export async function newRaffle({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  ...raffleParams
}: NewContractSDKParams & NewRaffleParams): Promise<RaffleSDK> {
  const factory = new RaffleFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  return await factory.newRaffle(raffleParams);
}

