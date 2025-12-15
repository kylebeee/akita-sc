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
exports.PrizeBoxFactorySDK = exports.PrizeBoxSDK = void 0;
exports.newPrizeBox = newPrizeBox;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const PrizeBoxClient_1 = require("../generated/PrizeBoxClient");
const PrizeBoxFactoryClient_1 = require("../generated/PrizeBoxFactoryClient");
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with an individual PrizeBox contract.
 * PrizeBoxes hold multiple assets that can be transferred as a bundle.
 */
class PrizeBoxSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PrizeBoxClient_1.PrizeBoxFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the prize box.
     */
    async state() {
        const state = await this.client.state.global.getAll();
        return {
            owner: state.owner?.toString() ?? '',
            optinCount: state.optinCount ?? 0n,
        };
    }
    /**
     * Gets the owner of the prize box.
     */
    async owner() {
        const prizeBoxState = await this.state();
        return prizeBoxState.owner;
    }
    // ========== Write Methods ==========
    /**
     * Opts the prize box into an asset.
     * Can only be called by the owner.
     */
    async optIn({ sender, signer, asset }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(100000), // Asset opt-in MBR
            receiver: this.client.appAddress,
        });
        await this.client.send.optin({
            ...sendParams,
            args: {
                payment,
                asset,
            },
        });
    }
    /**
     * Transfers ownership of the prize box to a new owner.
     * Can only be called by the current owner.
     */
    async transfer({ sender, signer, newOwner }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        await this.client.send.transfer({
            ...sendParams,
            args: { newOwner },
        });
    }
    /**
     * Withdraws assets from the prize box.
     * Can only be called by the owner.
     */
    async withdraw({ sender, signer, assets }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Format assets as tuples [assetId, amount]
        const assetsTuple = assets.map(a => [BigInt(a.asset), BigInt(a.amount)]);
        await this.client.send.withdraw({
            ...sendParams,
            args: { assets: assetsTuple },
        });
    }
    /**
     * Deletes the prize box and returns MBR to owner.
     * Can only be called when the box is empty (optinCount === 0).
     */
    async delete(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.delete.deleteApplication({
            ...sendParams,
            args: {},
        });
    }
}
exports.PrizeBoxSDK = PrizeBoxSDK;
/**
 * SDK for interacting with the PrizeBox Factory contract.
 * Used to create new prize boxes.
 */
class PrizeBoxFactorySDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: PrizeBoxFactoryClient_1.PrizeBoxFactoryFactory, ...params });
    }
    /**
     * Creates a new prize box and returns a PrizeBoxSDK instance.
     * @returns PrizeBoxSDK for the newly created prize box
     */
    async mint({ sender, signer, owner }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new prize box
        const cost = this.cost();
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        const { return: appId } = await this.client.send.mint({
            ...sendParams,
            args: {
                payment,
                owner,
            },
        });
        if (appId === undefined) {
            throw new Error('Failed to create new prize box');
        }
        return new PrizeBoxSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer,
            },
        });
    }
    /**
     * Gets a PrizeBoxSDK instance for an existing prize box.
     * @param appId - The app ID of the prize box
     * @returns PrizeBoxSDK for the specified prize box
     */
    get({ appId }) {
        return new PrizeBoxSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer,
            },
        });
    }
    /**
     * Gets the cost to create a new prize box.
     * Based on: MIN_PROGRAM_PAGES + (GLOBAL_STATE_KEY_UINT_COST * globalUints) + (GLOBAL_STATE_KEY_BYTES_COST * globalBytes) + Global.minBalance
     */
    cost() {
        // Base cost from compiled contract: 178,500 + minBalance (100,000)
        return 278500n;
    }
}
exports.PrizeBoxFactorySDK = PrizeBoxFactorySDK;
/**
 * Convenience function to create a new prize box and return the SDK.
 */
async function newPrizeBox({ factoryParams, algorand, readerAccount, sendParams, ...mintParams }) {
    const factory = new PrizeBoxFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.mint(mintParams);
}
//# sourceMappingURL=index.js.map