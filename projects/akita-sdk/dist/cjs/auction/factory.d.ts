import { BaseSDK } from "../base";
import { AuctionFactoryClient, AuctionFactoryArgs } from '../generated/AuctionFactoryClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { AuctionSDK } from "./index";
import { NewAuctionParams, DeleteAuctionParams, CancelAuctionParams, OptInParams } from "./types";
export type AuctionFactoryContractArgs = AuctionFactoryArgs["obj"];
/**
 * SDK for interacting with the Auction Factory contract.
 * Used to create new auctions, delete completed auctions, and cancel pending auctions.
 */
export declare class AuctionFactorySDK extends BaseSDK<AuctionFactoryClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new auction with an ASA prize and returns an AuctionSDK instance.
     * Uses opUp for raffle auctions (weightsListCount > 0) to expand reference limits.
     * @returns AuctionSDK for the newly created auction
     */
    newAuction({ sender, signer, isPrizeBox, name, proof, bidAssetId, bidFee, startingBid, bidMinimumIncrease, startTimestamp, endTimestamp, gateId, marketplace, weightsListCount, ...rest }: NewAuctionParams): Promise<AuctionSDK>;
    /**
     * Gets an AuctionSDK instance for an existing auction.
     * @param appId - The app ID of the auction
     * @returns AuctionSDK for the specified auction
     */
    get({ appId }: {
        appId: bigint;
    }): AuctionSDK;
    /**
     * Gets the cost to create a new auction.
     */
    cost({ isPrizeBox, bidAssetId, weightsListCount }: {
        isPrizeBox: boolean;
        bidAssetId: bigint | number;
        weightsListCount: bigint | number;
    }): Promise<bigint>;
    optIn({ sender, signer, asset }: OptInParams): Promise<void>;
    /**
     * Deletes an auction after all cleanup is complete.
     * Can only be called after prize is claimed, raffle prize is claimed, and all MBR is refunded.
     */
    deleteAuction({ sender, signer, appId }: DeleteAuctionParams): Promise<void>;
    /**
     * Cancels an auction before it starts.
     * Returns the prize and MBR to the seller.
     */
    cancelAuction({ sender, signer, appId }: CancelAuctionParams): Promise<void>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & AuctionFactoryContractArgs['updateAkitaDAO(uint64)void']): Promise<void>;
    /**
     * Updates the Akita DAO Escrow reference.
     */
    updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & AuctionFactoryContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void>;
}
/**
 * Convenience function to create a new auction and return the SDK.
 * Creates a factory SDK, creates the auction, and returns the auction SDK.
 */
export declare function newAuction({ factoryParams, algorand, readerAccount, sendParams, ...auctionParams }: NewContractSDKParams & NewAuctionParams): Promise<AuctionSDK>;
