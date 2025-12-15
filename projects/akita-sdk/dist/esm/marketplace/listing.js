import { BaseSDK } from "../base";
import { ListingFactory, } from '../generated/ListingClient';
/**
 * SDK for interacting with an individual Listing contract.
 * Use this to manage listing state and change prices.
 * Note: Purchases and delisting should be done through the MarketplaceSDK.
 */
export class ListingSDK extends BaseSDK {
    constructor(params) {
        super({ factory: ListingFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the listing.
     */
    async state() {
        const state = await this.client.state.global.getAll();
        return {
            prize: state.prize ?? 0n,
            isPrizeBox: state.isPrizeBox ?? false,
            price: state.price ?? 0n,
            paymentAsset: state.paymentAsset ?? 0n,
            expiration: state.expiration ?? 0n,
            seller: state.seller?.toString() ?? '',
            reservedFor: state.reservedFor?.toString() ?? '',
            creatorRoyalty: state.creatorRoyalty ?? 0n,
            gateId: state.gateId ?? 0n,
            marketplace: state.marketplace?.toString() ?? '',
            marketplaceRoyalties: state.marketplaceRoyalties ?? 0n,
        };
    }
    /**
     * Checks if the listing has expired.
     */
    async isExpired() {
        const listingState = await this.state();
        if (listingState.expiration === 0n) {
            return false; // No expiration set
        }
        const now = BigInt(Math.floor(Date.now() / 1000));
        return now > listingState.expiration;
    }
    /**
     * Checks if the listing is reserved for a specific address.
     */
    async isReserved() {
        const listingState = await this.state();
        return listingState.reservedFor !== '' && listingState.reservedFor !== 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
    }
    // ========== Write Methods ==========
    /**
     * Changes the price of the listing.
     * Can only be called by the seller.
     */
    async changePrice({ sender, signer, price }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        await this.client.send.changePrice({
            ...sendParams,
            args: { price },
        });
    }
}
//# sourceMappingURL=listing.js.map