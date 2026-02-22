import { BaseSDK } from "../base";
import { AuctionClient, BidInfo } from '../generated/AuctionClient';
import { MaybeSigner, NewContractSDKParams } from "../types";
import { BidParams, RefundBidParams, FindWinnerParams, RefundMBRParams, ClearWeightsBoxesParams, GetBidParams, HasBidParams, AuctionState, AuctionMbrData } from "./types";
export * from "./factory";
export * from "./types";
/**
 * SDK for interacting with an individual Auction contract.
 * Use this to place bids, refund bids, claim prizes, and manage auction state.
 */
export declare class AuctionSDK extends BaseSDK<AuctionClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current state of the auction.
     */
    state(): Promise<AuctionState>;
    /**
     * Checks if the auction is currently live (accepting bids).
     */
    isLive(): Promise<boolean>;
    /**
     * Gets the MBR (Minimum Balance Requirement) data for auction operations.
     * These are constant values defined in the auction contract.
     */
    mbr(): Promise<AuctionMbrData>;
    /**
     * Gets a bid by its ID.
     */
    getBid({ bidId }: GetBidParams): Promise<BidInfo>;
    /**
     * Checks if an address has placed a bid.
     */
    hasBid({ address }: HasBidParams): Promise<boolean>;
    /**
     * Gets the minimum bid amount required for the next bid.
     */
    getMinimumBidAmount(): Promise<bigint>;
    /**
     * Places a bid in the auction.
     * Use `isAsa: true` and `bidAsset` for ASA bids, otherwise ALGO is used.
     * Provide `gateTxn` for gated auctions.
     * Uses opUp for raffle auctions (bidFee > 0) to expand reference limits.
     */
    bid({ sender, signer, amount, marketplace, isAsa, gateTxn, ...rest }: BidParams): Promise<void>;
    /**
     * Refunds a specific bid (not the most recent one).
     */
    refundBid({ sender, signer, id }: RefundBidParams): Promise<void>;
    /**
     * Triggers the raffle to draw the winning ticket number.
     * Only applicable for auctions with bid fees (loser raffle).
     */
    raffle(params?: MaybeSigner): Promise<void>;
    /**
     * Iterates to find the raffle winner based on the winning ticket.
     * May need to be called multiple times for large auctions.
     * Uses opUp transactions to expand reference limits for iterating through weight boxes.
     */
    findWinner({ sender, signer, iterationAmount }: FindWinnerParams): Promise<void>;
    /**
     * Claims the auction prize for the highest bidder.
     * Also distributes royalties to marketplace, creator, and Akita.
     * Uses opUp transactions to expand reference limits for royalty distribution.
     */
    claimPrize(params?: MaybeSigner): Promise<void>;
    /**
     * Claims the raffle prize for the raffle winner (loser raffle).
     */
    claimRafflePrize(params?: MaybeSigner): Promise<void>;
    /**
     * Refunds MBR to auction participants after prizes are claimed.
     * May need to be called multiple times for large auctions.
     */
    refundMBR({ sender, signer, iterationAmount }: RefundMBRParams): Promise<void>;
    /**
     * Clears the weights boxes after all prizes have been claimed.
     * Returns the MBR for the weights boxes to the factory.
     */
    clearWeightsBoxes({ sender, signer, iterationAmount }: ClearWeightsBoxesParams): Promise<bigint>;
}
