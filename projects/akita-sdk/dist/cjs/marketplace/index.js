"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceSDK = void 0;
exports.newListing = newListing;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const config_1 = require("../config");
const MarketplaceClient_1 = require("../generated/MarketplaceClient");
const listing_1 = require("./listing");
__exportStar(require("./listing"), exports);
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with the Marketplace contract.
 * Use this to create listings, purchase items, and delist items.
 */
class MarketplaceSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: MarketplaceClient_1.MarketplaceFactory, ...params }, config_1.ENV_VAR_NAMES.MARKETPLACE_APP_ID);
    }
    // ========== Factory/Listing Methods ==========
    /**
     * Creates a new listing and returns a ListingSDK instance.
     * Can list either an ASA or a PrizeBox based on the `isPrizeBox` flag.
     * @returns ListingSDK for the newly created listing
     */
    async list({ sender, signer, isPrizeBox = false, price, paymentAsset, expiration, reservedFor, gateId, marketplace, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new listing
        const isAlgoPayment = BigInt(paymentAsset) === 0n;
        const cost = this.listCost(isAlgoPayment);
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        let appId;
        if (isPrizeBox) {
            const { prizeId } = rest;
            ({ return: appId } = await this.client.send.listPrizeBox({
                ...sendParams,
                args: {
                    payment,
                    prizeId,
                    price,
                    paymentAsset,
                    expiration,
                    reservedFor,
                    gateId,
                    marketplace,
                },
            }));
        }
        else {
            const { asset, amount, name, proof } = rest;
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(asset),
                receiver: this.client.appAddress,
            });
            ({ return: appId } = await this.client.send.list({
                ...sendParams,
                args: {
                    payment,
                    assetXfer,
                    price,
                    paymentAsset,
                    expiration,
                    reservedFor,
                    gateId,
                    marketplace,
                    name,
                    proof,
                },
            }));
        }
        if (appId === undefined) {
            throw new Error('Failed to create new listing');
        }
        return new listing_1.ListingSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer,
            },
        });
    }
    /**
     * Gets a ListingSDK instance for an existing listing.
     * @param appId - The app ID of the listing
     * @returns ListingSDK for the specified listing
     */
    getListing({ appId }) {
        return new listing_1.ListingSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer,
            },
        });
    }
    /**
     * Gets the cost to create a new listing.
     * @param isAlgoPayment - Whether the listing will accept ALGO as payment
     */
    listCost(isAlgoPayment = true) {
        // Base cost: MIN_PROGRAM_PAGES + (GLOBAL_STATE_KEY_UINT_COST * globalUints) + (GLOBAL_STATE_KEY_BYTES_COST * globalBytes)
        const baseCost = 606500n;
        // Global.minBalance for the child app
        const minBalance = 100000n;
        // Asset opt-in MBR (1x for ALGO payment, 2x for ASA payment)
        const optinMbr = isAlgoPayment ? 100000n : 200000n;
        return baseCost + minBalance + optinMbr;
    }
    // ========== Purchase Methods ==========
    /**
     * Purchases a listing.
     * Use `isAsa: true` with `paymentAsset` and `paymentAmount` for ASA payments, otherwise ALGO is used.
     * Provide `gateTxn` for gated listings.
     */
    async purchase({ sender, signer, listingAppId, marketplace, isAsa = false, gateTxn, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Use opUps to handle app reference limits (royalty distribution, DAO access, etc.)
        const group = this.client.newGroup();
        if (isAsa) {
            const { paymentAsset, paymentAmount } = rest;
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(paymentAmount),
                assetId: BigInt(paymentAsset),
                receiver: this.client.appAddress,
            });
            if (gateTxn) {
                group.gatedPurchaseAsa({
                    ...sendParams,
                    args: {
                        assetXfer,
                        gateTxn,
                        appId: listingAppId,
                        marketplace,
                    },
                });
            }
            else {
                group.purchaseAsa({
                    ...sendParams,
                    args: {
                        assetXfer,
                        appId: listingAppId,
                        marketplace,
                    },
                });
            }
        }
        else {
            // Get listing to determine price for ALGO purchases
            const listing = this.getListing({ appId: BigInt(listingAppId) });
            const listingState = await listing.state();
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: (0, algokit_utils_1.microAlgo)(listingState.price),
                receiver: this.client.appAddress,
            });
            if (gateTxn) {
                group.gatedPurchase({
                    ...sendParams,
                    args: {
                        payment,
                        gateTxn,
                        appId: listingAppId,
                        marketplace,
                    },
                });
            }
            else {
                group.purchase({
                    ...sendParams,
                    args: {
                        payment,
                        appId: listingAppId,
                        marketplace,
                    },
                });
            }
        }
        // Add opUps to increase app reference limit
        // purchase + payment (and possibly assetXfer) = 2-3 transactions, so we can add up to 13-14 opUps
        for (let i = 0; i < 10; i++) {
            group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
        }
        await group.send(sendParams);
    }
    // ========== Delist Methods ==========
    /**
     * Removes a listing and returns the asset to the seller.
     * Can only be called by the seller.
     */
    async delist({ sender, signer, appId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.delist({
            ...sendParams,
            args: { appId },
        });
    }
    // ========== Admin Methods ==========
    /**
     * Updates the Akita DAO reference.
     */
    async updateAkitaDAO({ sender, signer, akitaDao }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDao({
            ...sendParams,
            args: { akitaDao },
        });
    }
    /**
     * Updates the Akita DAO Escrow reference.
     */
    async updateAkitaDAOEscrow({ sender, signer, app }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.updateAkitaDaoEscrow({
            ...sendParams,
            args: { app },
        });
    }
}
exports.MarketplaceSDK = MarketplaceSDK;
/**
 * Convenience function to create a new listing and return the SDK.
 * Creates a marketplace SDK, creates the listing, and returns the listing SDK.
 */
async function newListing({ factoryParams, algorand, readerAccount, sendParams, ...listParams }) {
    const marketplace = new MarketplaceSDK({ factoryParams, algorand, readerAccount, sendParams });
    return await marketplace.list(listParams);
}
//# sourceMappingURL=index.js.map