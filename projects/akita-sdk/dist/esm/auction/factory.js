import { microAlgo } from "@algorandfoundation/algokit-utils";
import { BaseSDK } from "../base";
import { ENV_VAR_NAMES } from "../config";
import { AuctionFactoryFactory, } from '../generated/AuctionFactoryClient';
import { AuctionSDK } from "./index";
/**
 * SDK for interacting with the Auction Factory contract.
 * Used to create new auctions, delete completed auctions, and cancel pending auctions.
 */
export class AuctionFactorySDK extends BaseSDK {
    constructor(params) {
        super({ factory: AuctionFactoryFactory, ...params }, ENV_VAR_NAMES.AUCTION_FACTORY_APP_ID);
    }
    /**
     * Creates a new auction with an ASA prize and returns an AuctionSDK instance.
     * Uses opUp for raffle auctions (weightsListCount > 0) to expand reference limits.
     * @returns AuctionSDK for the newly created auction
     */
    async newAuction({ sender, signer, isPrizeBox = false, name, proof, bidAssetId, bidFee, startingBid, bidMinimumIncrease, startTimestamp, endTimestamp, gateId, marketplace, weightsListCount, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get the cost for creating a new auction
        const cost = await this.cost({ isPrizeBox, bidAssetId, weightsListCount });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(cost),
            receiver: this.client.appAddress,
        });
        let appId;
        // Raffle auctions with weights need opUp for additional references
        const needsOpUp = BigInt(weightsListCount) > 0n;
        if (isPrizeBox) {
            const { prizeBoxId } = rest;
            if (needsOpUp) {
                const group = this.client.newGroup();
                group.newPrizeBoxAuction({
                    ...sendParams,
                    args: {
                        payment,
                        prizeBoxId,
                        bidAssetId,
                        bidFee,
                        startingBid,
                        bidMinimumIncrease,
                        startTimestamp,
                        endTimestamp,
                        gateId,
                        marketplace,
                        weightsListCount,
                    },
                });
                // Raffle auction creation needs multiple opUps for weight box initialization
                // Each opUp adds 8 more reference slots. Max group size is 16.
                for (let i = 0; i < 10; i++) {
                    group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                }
                const result = await group.send(sendParams);
                appId = result.returns[0];
            }
            else {
                ({ return: appId } = await this.client.send.newPrizeBoxAuction({
                    ...sendParams,
                    args: {
                        payment,
                        prizeBoxId,
                        bidAssetId,
                        bidFee,
                        startingBid,
                        bidMinimumIncrease,
                        startTimestamp,
                        endTimestamp,
                        gateId,
                        marketplace,
                        weightsListCount,
                    },
                }));
            }
        }
        else {
            const { prizeAsset, prizeAmount } = rest;
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(prizeAmount),
                assetId: BigInt(prizeAsset),
                receiver: this.client.appAddress,
            });
            if (needsOpUp) {
                const group = this.client.newGroup();
                group.newAuction({
                    ...sendParams,
                    args: {
                        payment,
                        assetXfer,
                        name,
                        proof,
                        bidAssetId,
                        bidFee,
                        startingBid,
                        bidMinimumIncrease,
                        startTimestamp,
                        endTimestamp,
                        gateId,
                        marketplace,
                        weightsListCount,
                    },
                });
                // Raffle auction creation needs multiple opUps for weight box initialization
                // Each opUp adds 8 more reference slots. Max group size is 16.
                // newAuction + pay + assetXfer = 3, so we can add up to 13 opUps
                for (let i = 0; i < 10; i++) {
                    group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                }
                const result = await group.send(sendParams);
                appId = result.returns[0];
            }
            else {
                ({ return: appId } = await this.client.send.newAuction({
                    ...sendParams,
                    args: {
                        payment,
                        assetXfer,
                        name,
                        proof,
                        bidAssetId,
                        bidFee,
                        startingBid,
                        bidMinimumIncrease,
                        startTimestamp,
                        endTimestamp,
                        gateId,
                        marketplace,
                        weightsListCount,
                    },
                }));
            }
        }
        if (appId === undefined) {
            throw new Error('Failed to create new auction');
        }
        return new AuctionSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: sendParams.sender,
                defaultSigner: sendParams.signer,
            },
        });
    }
    /**
     * Gets an AuctionSDK instance for an existing auction.
     * @param appId - The app ID of the auction
     * @returns AuctionSDK for the specified auction
     */
    get({ appId }) {
        return new AuctionSDK({
            algorand: this.algorand,
            factoryParams: {
                appId,
                defaultSender: this.sendParams.sender,
                defaultSigner: this.sendParams.signer,
            },
        });
    }
    /**
     * Gets the cost to create a new auction.
     */
    async cost({ isPrizeBox, bidAssetId, weightsListCount }) {
        return await this.client.newAuctionCost({ args: { isPrizeBox, bidAssetId, weightsListCount } });
    }
    async optIn({ sender, signer, asset }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        const cost = await this.client.optInCost({ args: { asset } });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: microAlgo(cost),
            receiver: this.client.appAddress,
        });
        await this.client.send.optIn({
            ...sendParams,
            args: { payment, asset },
        });
    }
    /**
     * Deletes an auction after all cleanup is complete.
     * Can only be called after prize is claimed, raffle prize is claimed, and all MBR is refunded.
     */
    async deleteAuction({ sender, signer, appId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.deleteAuctionApp({
            ...sendParams,
            args: { appId },
        });
    }
    /**
     * Cancels an auction before it starts.
     * Returns the prize and MBR to the seller.
     */
    async cancelAuction({ sender, signer, appId }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.cancelAuction({
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
/**
 * Convenience function to create a new auction and return the SDK.
 * Creates a factory SDK, creates the auction, and returns the auction SDK.
 */
export async function newAuction({ factoryParams, algorand, readerAccount, sendParams, ...auctionParams }) {
    const factory = new AuctionFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
    return await factory.newAuction(auctionParams);
}
//# sourceMappingURL=factory.js.map