import { MaybeSigner } from "../types";
import { AuctionArgs, BidInfo, FindWinnerCursors, FunderInfo } from '../generated/AuctionClient';
import { AuctionFactoryArgs } from '../generated/AuctionFactoryClient';
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";
export { BidInfo, FindWinnerCursors, FunderInfo };
type FactoryContractArgs = AuctionFactoryArgs["obj"];
export type NewAuctionParams = MaybeSigner & Omit<FactoryContractArgs['newAuction(pay,axfer,string,byte[32][],uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64'], 'payment' | 'assetXfer'> & ({
    isPrizeBox: true;
    prizeBoxId: bigint | number;
} | {
    isPrizeBox: false;
    prizeAsset: bigint | number;
    prizeAmount: bigint | number;
});
export type NewPrizeBoxAuctionParams = MaybeSigner & Omit<FactoryContractArgs['newPrizeBoxAuction(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64'], 'payment'>;
export type DeleteAuctionParams = MaybeSigner & FactoryContractArgs['deleteAuctionApp(uint64)void'];
export type CancelAuctionParams = MaybeSigner & FactoryContractArgs['cancelAuction(uint64)void'];
type AuctionContractArgs = AuctionArgs["obj"];
export type InitAuctionParams = MaybeSigner & Omit<AuctionContractArgs['init(pay,uint64)void'], 'payment'>;
type BaseBidParams = MaybeSigner & {
    /** The amount to bid */
    amount: bigint | number;
    /** Marketplace address for referrals */
    marketplace: string;
    /** Optional gate transaction for gated auctions */
    gateTxn?: AppCallMethodCall;
};
export type BidParams = BaseBidParams & ({
    /** Whether bidding with ASA (true) or ALGO (false/undefined) */
    isAsa?: false;
} | {
    /** Whether bidding with ASA (true) or ALGO (false/undefined) */
    isAsa: true;
    /** The bid asset ID (required when isAsa is true) */
    bidAsset: bigint | number;
});
export type RefundBidParams = MaybeSigner & AuctionContractArgs['refundBid(uint64)void'];
export type FindWinnerParams = MaybeSigner & AuctionContractArgs['findWinner(uint64)void'];
export type RefundMBRParams = MaybeSigner & AuctionContractArgs['refundMBR(uint64)void'];
export type ClearWeightsBoxesParams = MaybeSigner & AuctionContractArgs['clearWeightsBoxes(uint64)uint64'];
export type ClaimPrizeParams = MaybeSigner;
export type ClaimRafflePrizeParams = MaybeSigner;
export type RaffleParams = MaybeSigner;
export type GetBidParams = {
    /** The bid ID to look up */
    bidId: bigint | number;
};
export type HasBidParams = {
    /** The address to check */
    address: string;
};
export type AuctionState = {
    prize: bigint;
    isPrizeBox: boolean;
    prizeClaimed: boolean;
    bidAsset: bigint;
    bidFee: bigint;
    startingBid: bigint;
    bidMinimumIncrease: bigint;
    startTimestamp: bigint;
    endTimestamp: bigint;
    seller: string;
    creatorRoyalty: bigint;
    marketplace: string;
    marketplaceRoyalties: bigint;
    gateId: bigint;
    vrfFailureCount: bigint;
    refundCount: bigint;
    bidTotal: bigint;
    weightedBidTotal: bigint;
    highestBid: bigint;
    bidID: bigint;
    raffleAmount: bigint;
    rafflePrizeClaimed: boolean;
    uniqueAddressCount: bigint;
    weightsBoxCount: bigint;
    winningTicket: bigint;
    raffleWinner: string;
    raffleRound: bigint;
};
export type AuctionMbrData = {
    bids: bigint;
    weights: bigint;
    bidsByAddress: bigint;
    locations: bigint;
};
export type OptInParams = MaybeSigner & {
    asset: bigint | number;
};
