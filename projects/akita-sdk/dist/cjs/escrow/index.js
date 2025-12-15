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
exports.EscrowFactorySDK = exports.EscrowSDK = void 0;
exports.newEscrow = newEscrow;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const config_1 = require("../config");
const EscrowClient_1 = require("../generated/EscrowClient");
const EscrowFactoryClient_1 = require("../generated/EscrowFactoryClient");
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with an individual Escrow contract.
 * Escrows are minimal contracts that hold funds and can be rekeyed.
 */
class EscrowSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: EscrowClient_1.EscrowFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the creator of the escrow.
     */
    async getCreator() {
        const state = await this.client.state.global.getAll();
        return state.creator?.toString() ?? '';
    }
    // ========== Write Methods ==========
    /**
     * Rekeys the escrow to a new account.
     * Can only be called by the factory (creator).
     */
    async rekey({ sender, signer, rekeyTo }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.rekey({
            ...sendParams,
            args: { rekeyTo },
        });
    }
}
exports.EscrowSDK = EscrowSDK;
/**
 * SDK for interacting with the Escrow Factory contract.
 * Used to create, register, and delete escrows.
 */
class EscrowFactorySDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: EscrowFactoryClient_1.EscrowFactoryFactory, ...params }, config_1.ENV_VAR_NAMES.ESCROW_FACTORY_APP_ID);
    }
    // ========== Factory Methods ==========
    /**
     * Creates a new escrow and returns an EscrowSDK instance.
     * @returns EscrowSDK for the newly created escrow
     */
    async new(params) {
        const sendParams = this.getRequiredSendParams(params);
        // Get the cost for creating a new escrow
        const cost = await this.cost();
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        const { return: appId } = await this.client.send.new({
            ...sendParams,
            args: { payment },
        });
        if (appId === undefined) {
            throw new Error('Failed to create new escrow');
        }
        return new EscrowSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer,
            },
        });
    }
    /**
     * Gets an EscrowSDK instance for an existing escrow.
     * @param appId - The app ID of the escrow
     * @returns EscrowSDK for the specified escrow
     */
    get({ appId }) {
        return new EscrowSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer,
            },
        });
    }
    /**
     * Registers an escrow (or self) to enable lookup by address.
     */
    async register({ sender, signer, app }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const cost = await this.registerCost();
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        await this.client.send.register({
            ...sendParams,
            args: {
                payment,
                app,
            },
        });
    }
    /**
     * Deletes an escrow and refunds MBR.
     */
    async delete({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.delete({
            ...sendParams,
            args: { id },
        });
    }
    // ========== Read Methods ==========
    /**
     * Gets the cost to create a new escrow.
     */
    async cost() {
        return await this.client.cost();
    }
    /**
     * Gets the cost to register an escrow.
     */
    async registerCost() {
        return await this.client.registerCost();
    }
    /**
     * Checks if an escrow exists for an address.
     */
    async exists({ address }) {
        const exists = await this.client.exists({ args: { address } });
        return exists ?? false;
    }
    /**
     * Gets the creator bytes for an address.
     * Returns empty bytes if not found.
     */
    async getCreator({ address }) {
        const creator = await this.client.get({ args: { address } });
        return creator ?? new Uint8Array();
    }
    /**
     * Gets creator bytes for multiple addresses.
     */
    async getList({ addresses }) {
        const creators = await this.client.getList({ args: { addresses } });
        return creators ?? [];
    }
}
exports.EscrowFactorySDK = EscrowFactorySDK;
/**
 * Convenience function to create a new escrow and return the SDK.
 */
async function newEscrow({ factoryParams, algorand, readerAccount, sendParams, ...escrowParams }) {
    const factory = new EscrowFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.new(escrowParams);
}
//# sourceMappingURL=index.js.map