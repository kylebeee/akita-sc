import { BaseSDK } from "../base";
import { MarketplaceClient, MarketplaceArgs } from '../generated/MarketplaceClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { ListingSDK } from "./listing";
import { ListParams, PurchaseParams, DelistParams } from "./types";
export * from "./listing";
export * from "./types";
export type MarketplaceContractArgs = MarketplaceArgs["obj"];
/**
 * SDK for interacting with the Marketplace contract.
 * Use this to create listings, purchase items, and delist items.
 */
export declare class MarketplaceSDK extends BaseSDK<MarketplaceClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Creates a new listing and returns a ListingSDK instance.
     * Can list either an ASA or a PrizeBox based on the `isPrizeBox` flag.
     * @returns ListingSDK for the newly created listing
     */
    list({ sender, signer, isPrizeBox, price, paymentAsset, expiration, reservedFor, gateId, marketplace, ...rest }: ListParams): Promise<ListingSDK>;
    /**
     * Gets a ListingSDK instance for an existing listing.
     * @param appId - The app ID of the listing
     * @returns ListingSDK for the specified listing
     */
    getListing({ appId }: {
        appId: bigint;
    }): ListingSDK;
    /**
     * Gets the cost to create a new listing.
     * @param isAlgoPayment - Whether the listing will accept ALGO as payment
     */
    listCost(isAlgoPayment?: boolean): bigint;
    /**
     * Purchases a listing.
     * Use `isAsa: true` with `paymentAsset` and `paymentAmount` for ASA payments, otherwise ALGO is used.
     * Provide `gateTxn` for gated listings.
     */
    purchase({ sender, signer, listingAppId, marketplace, isAsa, gateTxn, ...rest }: PurchaseParams): Promise<void>;
    /**
     * Removes a listing and returns the asset to the seller.
     * Can only be called by the seller.
     */
    delist({ sender, signer, appId }: DelistParams): Promise<void>;
    /**
     * Updates the Akita DAO reference.
     */
    updateAkitaDAO({ sender, signer, akitaDao }: MaybeSigner & MarketplaceContractArgs['updateAkitaDAO(uint64)void']): Promise<void>;
    /**
     * Updates the Akita DAO Escrow reference.
     */
    updateAkitaDAOEscrow({ sender, signer, app }: MaybeSigner & MarketplaceContractArgs['updateAkitaDAOEscrow(uint64)void']): Promise<void>;
}
/**
 * Convenience function to create a new listing and return the SDK.
 * Creates a marketplace SDK, creates the listing, and returns the listing SDK.
 */
export declare function newListing({ factoryParams, algorand, readerAccount, sendParams, ...listParams }: NewContractSDKParams & ListParams): Promise<ListingSDK>;
