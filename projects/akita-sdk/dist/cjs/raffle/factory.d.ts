import { BaseSDK } from "../base";
import { RaffleFactoryClient, RaffleFactoryArgs } from '../generated/RaffleFactoryClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { RaffleSDK } from "./index";
import { NewRaffleParams, NewPrizeBoxRaffleParams, DeleteRaffleParams } from "./types";
export type RaffleFactoryContractArgs = RaffleFactoryArgs["obj"];
/**
 * SDK for interacting with the Raffle Factory contract.
 * Used to create new raffles and manage raffle lifecycle.
 */
export declare class RaffleFactorySDK extends BaseSDK<RaffleFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new raffle with an ASA prize and returns a RaffleSDK instance.
     * @returns RaffleSDK for the newly created raffle
     */
    newRaffle({ sender, signer, prizeAsset, prizeAmount, ticketAsset, startTimestamp, endTimestamp, minTickets, maxTickets, gateId, marketplace, name, proof, weightsListCount, }: NewRaffleParams): Promise<RaffleSDK>;
    /**
     * Creates a new raffle with a PrizeBox as the prize.
     * @returns RaffleSDK for the newly created raffle
     */
    newPrizeBoxRaffle({ sender, signer, prizeBox, ticketAsset, startTimestamp, endTimestamp, minTickets, maxTickets, gateId, marketplace, weightsListCount, }: NewPrizeBoxRaffleParams): Promise<RaffleSDK>;
    /**
     * Gets a RaffleSDK instance for an existing raffle.
     * @param appId - The app ID of the raffle
     * @returns RaffleSDK for the specified raffle
     */
    get({ appId }: {
        appId: bigint;
    }): RaffleSDK;
    /**
     * Gets the cost to create a new raffle.
     * @param isPrizeBox - Whether the prize is a PrizeBox
     * @param isAlgoTicket - Whether tickets are paid in ALGO (ticketAsset === 0)
     * @param weightsListCount - Number of weights boxes
     * @param raffleCreationFee - Optional: the raffle creation fee from the DAO (default: 10 ALGO)
     */
    cost({ isPrizeBox, isAlgoTicket, weightsListCount, raffleCreationFee }?: {
        isPrizeBox?: boolean;
        isAlgoTicket?: boolean;
        weightsListCount?: bigint | number;
        raffleCreationFee?: bigint;
    }): bigint;
    /**
     * Deletes a raffle created by this factory.
     * Can only be called after prize is claimed and all MBR is refunded.
     */
    deleteRaffle({ sender, signer, appId }: DeleteRaffleParams): Promise<void>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & RaffleFactoryContractArgs['updateAkitaDAO(uint64)void']): Promise<void>;
    /**
     * Updates the Akita DAO Escrow reference.
     */
    updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & RaffleFactoryContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void>;
}
/**
 * Convenience function to create a new raffle and return the SDK.
 * Creates a factory SDK, creates the raffle, and returns the raffle SDK.
 */
export declare function newRaffle({ factoryParams, algorand, readerAccount, sendParams, ...raffleParams }: NewContractSDKParams & NewRaffleParams): Promise<RaffleSDK>;
