"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleFactorySDK = void 0;
exports.newRaffle = newRaffle;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const config_1 = require("../config");
const RaffleFactoryClient_1 = require("../generated/RaffleFactoryClient");
const index_1 = require("./index");
/**
 * SDK for interacting with the Raffle Factory contract.
 * Used to create new raffles and manage raffle lifecycle.
 */
class RaffleFactorySDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: RaffleFactoryClient_1.RaffleFactoryFactory, ...params }, config_1.ENV_VAR_NAMES.RAFFLE_FACTORY_APP_ID);
    }
    /**
     * Creates a new raffle with an ASA prize and returns a RaffleSDK instance.
     * @returns RaffleSDK for the newly created raffle
     */
    async newRaffle({ sender, signer, prizeAsset, prizeAmount, ticketAsset, startTimestamp, endTimestamp, minTickets, maxTickets, gateId, marketplace, name, proof, weightsListCount, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new raffle
        const isAlgoTicket = BigInt(ticketAsset) === 0n;
        const cost = this.cost({ isPrizeBox: false, isAlgoTicket, weightsListCount });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
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
        let appId;
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
            appId = result.returns[0];
        }
        else {
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
        return new index_1.RaffleSDK({
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
    async newPrizeBoxRaffle({ sender, signer, prizeBox, ticketAsset, startTimestamp, endTimestamp, minTickets, maxTickets, gateId, marketplace, weightsListCount, }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new raffle
        const isAlgoTicket = BigInt(ticketAsset) === 0n;
        const cost = this.cost({ isPrizeBox: true, isAlgoTicket, weightsListCount });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
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
        return new index_1.RaffleSDK({
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
    get({ appId }) {
        return new index_1.RaffleSDK({
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
    cost({ isPrizeBox = false, isAlgoTicket = true, weightsListCount = 1n, raffleCreationFee = 10000000n } = {}) {
        // Base cost: MAX_PROGRAM_PAGES + (GLOBAL_STATE_KEY_UINT_COST * globalUints) + (GLOBAL_STATE_KEY_BYTES_COST * globalBytes)
        const baseCost = 1398500n;
        const minBalance = 100000n;
        const assetOptInMinBalance = 100000n;
        const weightsMbr = 13113300n; // per weights box
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
    async deleteRaffle({ sender, signer, appId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.deleteRaffle({
            ...sendParams,
            args: { appId },
        });
    }
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
exports.RaffleFactorySDK = RaffleFactorySDK;
/**
 * Convenience function to create a new raffle and return the SDK.
 * Creates a factory SDK, creates the raffle, and returns the raffle SDK.
 */
async function newRaffle({ factoryParams, algorand, readerAccount, sendParams, ...raffleParams }) {
    const factory = new RaffleFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.newRaffle(raffleParams);
}
//# sourceMappingURL=factory.js.map