import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { PrizeBoxFactory, } from '../generated/PrizeBoxClient';
import { PrizeBoxFactoryFactory, } from '../generated/PrizeBoxFactoryClient';
export * from "./types";
/**
 * SDK for interacting with an individual PrizeBox contract.
 * PrizeBoxes hold multiple assets that can be transferred as a bundle.
 */
export class PrizeBoxSDK extends BaseSDK {
    constructor(params) {
        super({ factory: PrizeBoxFactory, ...params });
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
            amount: microAlgo(100000), // Asset opt-in MBR
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
/**
 * SDK for interacting with the PrizeBox Factory contract.
 * Used to create new prize boxes.
 */
export class PrizeBoxFactorySDK extends BaseSDK {
    constructor(params) {
        super({ factory: PrizeBoxFactoryFactory, ...params });
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
            amount: microAlgo(cost),
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
/**
 * Convenience function to create a new prize box and return the SDK.
 */
export async function newPrizeBox({ factoryParams, algorand, readerAccount, sendParams, ...mintParams }) {
    const factory = new PrizeBoxFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.mint(mintParams);
}
//# sourceMappingURL=index.js.map