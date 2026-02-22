import { BaseSDK } from "../base";
import { ListingClient } from '../generated/ListingClient';
import { NewContractSDKParams } from "../types";
import { ChangePriceParams, ListingState } from "./types";
/**
 * SDK for interacting with an individual Listing contract.
 * Use this to manage listing state and change prices.
 * Note: Purchases and delisting should be done through the MarketplaceSDK.
 */
export declare class ListingSDK extends BaseSDK<ListingClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the listing.
     */
    state(): Promise<ListingState>;
    /**
     * Checks if the listing has expired.
     */
    isExpired(): Promise<boolean>;
    /**
     * Checks if the listing is reserved for a specific address.
     */
    isReserved(): Promise<boolean>;
    /**
     * Changes the price of the listing.
     * Can only be called by the seller.
     */
    changePrice({ sender, signer, price }: ChangePriceParams): Promise<void>;
}
