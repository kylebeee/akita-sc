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
exports.AuctionSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const AuctionClient_1 = require("../generated/AuctionClient");
__exportStar(require("./factory"), exports);
__exportStar(require("./types"), exports);
/**
 * SDK for interacting with an individual Auction contract.
 * Use this to place bids, refund bids, claim prizes, and manage auction state.
 */
class AuctionSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: AuctionClient_1.AuctionFactory, ...params });
    }
    // ========== Read Methods ==========
    /**
     * Gets the current state of the auction.
     */
    async state() {
        const state = await this.client.state.global.getAll();
        return {
            prize: state.prize ?? 0n,
            isPrizeBox: state.isPrizeBox ?? false,
            prizeClaimed: state.prizeClaimed ?? false,
            bidAsset: state.bidAsset ?? 0n,
            bidFee: state.bidFee ?? 0n,
            startingBid: state.startingBid ?? 0n,
            bidMinimumIncrease: state.bidMinimumIncrease ?? 0n,
            startTimestamp: state.startTimestamp ?? 0n,
            endTimestamp: state.endTimestamp ?? 0n,
            seller: state.seller?.toString() ?? '',
            creatorRoyalty: state.creatorRoyalty ?? 0n,
            marketplace: state.marketplace?.toString() ?? '',
            marketplaceRoyalties: state.marketplaceRoyalties ?? 0n,
            gateId: state.gateId ?? 0n,
            vrfFailureCount: state.vrfFailureCount ?? 0n,
            refundCount: state.refundCount ?? 0n,
            bidTotal: state.bidTotal ?? 0n,
            weightedBidTotal: state.weightedBidTotal ?? 0n,
            highestBid: state.highestBid ?? 0n,
            bidID: state.bidId ?? 0n,
            raffleAmount: state.raffleAmount ?? 0n,
            rafflePrizeClaimed: state.rafflePrizeClaimed ?? false,
            uniqueAddressCount: state.uniqueAddressCount ?? 0n,
            weightsBoxCount: state.weightsBoxCount ?? 0n,
            winningTicket: state.winningTicket ?? 0n,
            raffleWinner: state.raffleWinner?.toString() ?? '',
            raffleRound: state.raffleRound ?? 0n,
        };
    }
    /**
     * Checks if the auction is currently live (accepting bids).
     */
    async isLive() {
        const isLive = await this.client.isLive();
        return isLive ?? false;
    }
    /**
     * Gets the MBR (Minimum Balance Requirement) data for auction operations.
     * These are constant values defined in the auction contract.
     */
    async mbr() {
        return this.client.mbr();
    }
    /**
     * Gets a bid by its ID.
     */
    async getBid({ bidId }) {
        const bid = await this.client.state.box.bids.value(bidId);
        if (bid === undefined) {
            throw new Error(`Bid ${bidId} not found`);
        }
        return bid;
    }
    /**
     * Checks if an address has placed a bid.
     */
    async hasBid({ address }) {
        const hasBid = await this.client.hasBid({ args: { address } });
        return hasBid ?? false;
    }
    /**
     * Gets the minimum bid amount required for the next bid.
     */
    async getMinimumBidAmount() {
        const state = await this.state();
        if (state.highestBid > 0n) {
            return state.highestBid + state.bidMinimumIncrease;
        }
        return state.startingBid;
    }
    // ========== Write Methods ==========
    /**
     * Places a bid in the auction.
     * Use `isAsa: true` and `bidAsset` for ASA bids, otherwise ALGO is used.
     * Provide `gateTxn` for gated auctions.
     * Uses opUp for raffle auctions (bidFee > 0) to expand reference limits.
     */
    async bid({ sender, signer, amount, marketplace, isAsa = false, gateTxn, ...rest }) {
        const sendParams = this.getRequiredSendParams({ sender, signer });
        // Get MBR costs
        const { bids, bidsByAddress, locations } = await this.mbr();
        const auctionState = await this.state();
        let mbrCost = bids;
        // Check if first time bidder - always need bidsByAddress MBR
        const hasBidResult = await this.hasBid({ address: sendParams.sender.toString() });
        if (!hasBidResult) {
            mbrCost += bidsByAddress;
            // Only need locations MBR if bidFee > 0
            if (auctionState.bidFee > 0n) {
                mbrCost += locations;
            }
        }
        // Raffle auctions need opUp for weight box references
        const isRaffleAuction = auctionState.bidFee > 0n;
        if (isAsa) {
            const { bidAsset } = rest;
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: (0, algokit_utils_1.microAlgo)(mbrCost),
                receiver: this.client.appAddress,
            });
            const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
                ...sendParams,
                amount: BigInt(amount),
                assetId: BigInt(bidAsset),
                receiver: this.client.appAddress,
            });
            if (gateTxn) {
                if (isRaffleAuction) {
                    const group = this.client.newGroup();
                    group.gatedBidAsa({ ...sendParams, args: { payment, assetXfer, gateTxn, marketplace } });
                    for (let i = 0; i < 3; i++) {
                        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                    }
                    await group.send(sendParams);
                }
                else {
                    await this.client.send.gatedBidAsa({
                        ...sendParams,
                        args: { payment, assetXfer, gateTxn, marketplace },
                    });
                }
            }
            else {
                if (isRaffleAuction) {
                    const group = this.client.newGroup();
                    group.bidAsa({ ...sendParams, args: { payment, assetXfer, marketplace } });
                    for (let i = 0; i < 3; i++) {
                        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                    }
                    await group.send(sendParams);
                }
                else {
                    await this.client.send.bidAsa({
                        ...sendParams,
                        args: { payment, assetXfer, marketplace },
                    });
                }
            }
        }
        else {
            const payment = await this.client.algorand.createTransaction.payment({
                ...sendParams,
                amount: (0, algokit_utils_1.microAlgo)(BigInt(amount) + mbrCost),
                receiver: this.client.appAddress,
            });
            if (gateTxn) {
                if (isRaffleAuction) {
                    const group = this.client.newGroup();
                    group.gatedBid({ ...sendParams, args: { payment, gateTxn, marketplace } });
                    for (let i = 0; i < 3; i++) {
                        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                    }
                    await group.send(sendParams);
                }
                else {
                    await this.client.send.gatedBid({
                        ...sendParams,
                        args: { payment, gateTxn, marketplace },
                    });
                }
            }
            else {
                if (isRaffleAuction) {
                    const group = this.client.newGroup();
                    group.bid({ ...sendParams, args: { payment, marketplace } });
                    for (let i = 0; i < 3; i++) {
                        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : undefined });
                    }
                    await group.send(sendParams);
                }
                else {
                    await this.client.send.bid({
                        ...sendParams,
                        args: { payment, marketplace },
                    });
                }
            }
        }
    }
    /**
     * Refunds a specific bid (not the most recent one).
     */
    async refundBid({ sender, signer, id }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.refundBid({
            ...sendParams,
            args: { id },
        });
    }
    /**
     * Triggers the raffle to draw the winning ticket number.
     * Only applicable for auctions with bid fees (loser raffle).
     */
    async raffle(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.raffle({
            ...sendParams,
            args: {},
        });
    }
    /**
     * Iterates to find the raffle winner based on the winning ticket.
     * May need to be called multiple times for large auctions.
     * Uses opUp transactions to expand reference limits for iterating through weight boxes.
     */
    async findWinner({ sender, signer, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        // Use transaction group with opUp to expand reference limits for weight box iteration
        const group = this.client.newGroup();
        // Add opUp calls to provide more foreign reference slots
        // Scale opUp count with iterationAmount to support larger batches (15-19 range)
        // Each iteration may access multiple weight/location boxes
        // Max group size is 16, so we can have max 15 opUps + 1 findWinner call = 16 total
        // Formula: base 3 opUps, plus 1 per 2 iterations, capped at 15
        const opUpCount = Math.min(15, Math.max(3, 3 + Math.floor(Number(iterationAmount) / 2)));
        for (let i = 0; i < opUpCount; i++) {
            group.opUp({
                ...sendParams,
                args: {},
                note: i > 0 ? `opUp-${i}` : undefined,
            });
        }
        group.findWinner({
            ...sendParams,
            args: { iterationAmount },
        });
        await group.send(sendParams);
    }
    /**
     * Claims the auction prize for the highest bidder.
     * Also distributes royalties to marketplace, creator, and Akita.
     * Uses opUp transactions to expand reference limits for royalty distribution.
     */
    async claimPrize(params) {
        const sendParams = this.getSendParams(params);
        // Use transaction group with opUp to expand reference limits
        // claimPrize needs many references: prize, buyer, seller, 2x marketplace, akitaDAO, escrow, creator
        const group = this.client.newGroup();
        group.claimPrize({
            ...sendParams,
            args: {},
        });
        for (let i = 0; i < 6; i++) {
            group.opUp({
                ...sendParams,
                args: {},
                note: i > 0 ? `${i}` : undefined,
            });
        }
        await group.send(sendParams);
    }
    /**
     * Claims the raffle prize for the raffle winner (loser raffle).
     */
    async claimRafflePrize(params) {
        const sendParams = this.getSendParams(params);
        await this.client.send.claimRafflePrize({
            ...sendParams,
            args: {},
        });
    }
    /**
     * Refunds MBR to auction participants after prizes are claimed.
     * May need to be called multiple times for large auctions.
     */
    async refundMBR({ sender, signer, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        await this.client.send.refundMbr({
            ...sendParams,
            args: { iterationAmount },
        });
    }
    /**
     * Clears the weights boxes after all prizes have been claimed.
     * Returns the MBR for the weights boxes to the factory.
     */
    async clearWeightsBoxes({ sender, signer, iterationAmount }) {
        const sendParams = this.getSendParams({ sender, signer });
        const { return: returnAmount } = await this.client.send.clearWeightsBoxes({
            ...sendParams,
            args: { iterationAmount },
        });
        if (returnAmount === undefined) {
            throw new Error('Failed to clear weights boxes');
        }
        return returnAmount;
    }
}
exports.AuctionSDK = AuctionSDK;
//# sourceMappingURL=index.js.map