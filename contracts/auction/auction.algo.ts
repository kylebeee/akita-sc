import { ContractWithOptInCreatorOnlyArc59AndGate } from '../../utils/base_contracts/gate.algo';
import { pcg64Init, pcg64Random } from '../../utils/types/lib_pcg/pcg64.algo';
import { RoyaltyAmounts } from '../../utils/types/royalties';
import { RandomnessBeacon } from '../../utils/types/vrf_beacon';

const errs = {
    MUST_BE_CALLED_FROM_FACTORY: 'must be called from the factory',
    AUCTION_NOT_LIVE: 'auction is not live',
    AUCTION_HAS_NOT_ENDED: 'auction has not ended',
    PRIZE_ALREADY_CLAIMED: 'prize already claimed',
    HIGHEST_BIDS_ALREADY_GATHERED: 'highest bids already gathered',
    NOT_ENOUGH_TIME: 'not enough time has passed',
    HIGHEST_BIDS_NOT_GATHERED: 'highest bids not gathered',
    CANNOT_REFUND_MOST_RECENT_BID: 'cannot refund most recent bid',
    BID_NOT_FOUND: 'bid not found',
    BID_ALREADY_EXISTS: 'bid already exists',
    BID_ALREADY_REFUNDED: 'bid already refunded',
    WINNER_ALREADY_DRAWN: 'winner already drawn',
    WINNING_NUMBER_NOT_FOUND: 'winning number not found',
    WINNER_ALREADY_FOUND: 'winner already found',
    WINNER_NOT_FOUND: 'winner not found',
    RAFFLE_ALREADY_PRIZE_CLAIMED: 'raffle prize already claimed',
    PRIZE_NOT_CLAIMED: 'prize not claimed',
    RAFFLE_WINNER_NOT_FOUND: 'raffle winner not found',
    RAFFLE_WINNER_HAS_NOT_CLAIMED: 'raffle winner has not claimed',
}

// sniping is defined as bidding in the last 45 rounds (~2 minutes at 2.7s blocktime)
export const SNIPE_RANGE: uint64 = 45
// if a snipe bid takes place, extend the auction by an additional 120 (~5 minutes at 2.7s blocktime)
export const SNIPE_EXTENSION: uint64 = 120

// const RANDOMNESS_BEACON_APPID: AppID = AppID.fromUint64(1615566206);

const bidsByAddressMBR = 18_500;
export const bidMBR = 34_900 + bidsByAddressMBR;

export type BidInfo = {
    address: Address,
    amount: uint64,
    refunded: boolean,
    marketplace: Address,
}

export class Auction extends ContractWithOptInCreatorOnlyArc59AndGate {
    /** the asset up for auction */
    prize = GlobalStateKey<AssetID>({ key: 'prize' });
    /** whether the prize has been claimed */
    prizeClaimed = GlobalStateKey<boolean>({ key: 'prize_claimed' });
    /** the asset that is being used for bidding in the auction */
    bidAsset = GlobalStateKey<AssetID>({ key: 'bid_asset' });
    /** the percentage fee to take for the raffle on each bid in hundreds to support two decimals */
    bidFee = GlobalStateKey<uint64>({ key: 'bid_fee' })
    /** the starting amount to begin bids at */
    startingBid = GlobalStateKey<uint64>({ key: 'starting_bid' });
    /** the smallest amount each new bid need increment the auction price */
    bidMinimumIncrease = GlobalStateKey<uint64>({ key: 'bid_minimum_increase' });
    /** the round that the auction starts on */
    startingRound = GlobalStateKey<uint64>({ key: 'starting_round' });
    /** the round that the auction ends on */
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
    /** the address selling the asset */
    seller = GlobalStateKey<Address>({ key: 'seller' });
    /** the royalty percentage the creator will get for the auction */
    creatorRoyalty = GlobalStateKey<uint64>({ key: 'creator_royalty' });
    /** 
     * The address of the marketplace that created the auction to send the fee to
     * 
     * IMPORTANT: this is a double sided marketplace fee contract
     * the marketplace referred to internally in the contract
     * is the listing side marketplace.
     * the buyer side marketplace provides their address at
     * the time of purchase
    */
    marketplace = GlobalStateKey<Address>({ key: 'marketplace' });
    /** the royalty percentage each side of the market will take for the auction  */
    marketplaceRoyalties = GlobalStateKey<uint64>({ key: 'marketplace_royalties' });
    /** the gate ID to use to check if the user is qualified to bid in the auction */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' });
    /** the app ID to fetch VRF proofs from */
    vrfBeaconAppID = GlobalStateKey<AppID>({ key: 'vrf_beacon_app_id' });
    /** counter for how many times we've failed to get rng from the beacon */
    vrfGetFailureCount = GlobalStateKey<uint64>({ key: 'vrf_get_failure_count' });
    /** the number of bids that have been refunded */
    refundCount = GlobalStateKey<uint64>({ key: 'refund_count' });
    /** the total sum of all bids */
    bidTotal = GlobalStateKey<uint128>({ key: 'bid_total' });
    /** the total sum of all highest bids */
    weightedBidTotal = GlobalStateKey<uint64>();
    /** the id or index of the last bid */
    bidID = GlobalStateKey<uint64>({ key: 'bid_id' });
    /** the total amount collected for the loser raffle */
    raffleAmount = GlobalStateKey<uint64>({ key: 'raffle_amount' });
    /** whether the raffle winner has claimed their prize */
    rafflePrizeClaimed = GlobalStateKey<boolean>({ key: 'raffle_prize_claimed' });
    /**
     * we count how many unique addresses bid so we can 
     * properly get each bids % of the total bid amount
    */
    uniqueAddressCount = GlobalStateKey<uint64>({ key: 'unique_address_count' });
    /** 
     * when we go through the participants for the raffle
     * it may take multiple groups of txns so we have a variable
     * for tracking how far through the list we are
    */
    findWinnerCursor = GlobalStateKey<uint64>({ key: 'find_winner_cursor' });
    /** tracks sum iterated over during find raffle loop */
    findWinnerTotalCursor = GlobalStateKey<uint64>({ key: 'find_winner_total_cursor' });
    
    /**
     * we get the winning number from the randomness beacon
     * after the auction ends & we have ran gatherHighestBids
     * to compile our list 
     */
    winningTicket = GlobalStateKey<uint64>({ key: 'winning_number' });
    /** the winning address of the raffle */
    raffleWinner = GlobalStateKey<Address>({ key: 'raffle_winner' });

    /**
     * the list of bids in the auction
     */
    bids = BoxMap<uint64, BidInfo>();
    /** 
     * when we run our raffle we need to transform
     * our list of bids into an address based box
    */
    bidsByAddress = BoxMap<Address, uint64>();

    private newBidID(): uint64 {
        const id = this.bidID.value;
        this.bidID.value += 1;
        return id;
    }

    private getBidFee(amount: uint64): uint64 {
        return (amount * this.bidFee.value - 1) / 100 + 1
    }

    private getAmounts(amount: uint64): RoyaltyAmounts {
        let creatorAmount = wideRatio([amount, this.creatorRoyalty.value], [10000]);
        if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
            creatorAmount = 1;
        }

        let marketplaceAmount = wideRatio([amount, this.marketplaceRoyalties.value], [10000]);
        if (marketplaceAmount === 0 && this.marketplaceRoyalties.value > 0 && amount > 0) {
            marketplaceAmount = 1;
        }

        const sellerAmount = amount - (creatorAmount + (2 * marketplaceAmount));

        return {
            creator: creatorAmount,
            marketplace: marketplaceAmount,
            seller: sellerAmount
        }
    }

    private transferPurchaseToBuyer(buyer: Address): void {
        // transfer asa to buyer
        const prizeAmount = this.app.address.assetBalance(this.prize.value);
        // transfer asa to buyer
        if (buyer.isOptedInToAsset(this.prize.value)) {
            sendAssetTransfer({
                assetCloseTo: buyer,
                assetReceiver: buyer,
                assetAmount: prizeAmount,
                xferAsset: this.prize.value,
                fee: 0,
            });
        } else {
            this.arc59OptInAndSend(
                buyer,
                this.prize.value,
                prizeAmount,
                true
            );
        }
    }

    private completeAlgoPayments(amount: uint64, buySideMarketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(amount);
        
        // pay the creator        
        sendPayment({
            receiver: this.prize.value.creator,
            amount: amounts.creator,
            fee: 0,
        });

        // pay listing marketplace
        sendPayment({
            receiver: this.marketplace.value,
            amount: amounts.marketplace,
            fee: 0,
        });

        // pay buying marketplace
        sendPayment({
            receiver: buySideMarketplace,
            amount: amounts.marketplace,
            fee: 0,
        });

        // pay seller
        sendPayment({
            receiver: this.seller.value,
            amount: amounts.seller,
            fee: 0,
        });
    }

    private completeAsaPayments(amount: uint64, buySideMarketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(amount);

        // pay the creator
        if (this.prize.value.creator.isOptedInToAsset(this.bidAsset.value)) {
            sendAssetTransfer({
                assetReceiver: this.prize.value.creator,
                assetAmount: amounts.creator,
                xferAsset: this.bidAsset.value,
                fee: 0,
            });
        } else {
            this.arc59OptInAndSend(
                this.prize.value.creator,
                this.bidAsset.value,
                amounts.creator,
                false
            );
        }

        // pay listing marketplace
        if (this.marketplace.value.isOptedInToAsset(this.bidAsset.value)) {
            sendAssetTransfer({
                assetReceiver: this.marketplace.value,
                assetAmount: amounts.marketplace,
                xferAsset: this.bidAsset.value,
                fee: 0,
            });
        } else {
            this.arc59OptInAndSend(
                this.marketplace.value,
                this.bidAsset.value,
                amounts.marketplace,
                false
            );
        }

        // pay buying marketplace
        if (buySideMarketplace.isOptedInToAsset(this.bidAsset.value)) {
            sendAssetTransfer({
                assetReceiver: buySideMarketplace,
                assetAmount: amounts.marketplace,
                xferAsset: this.bidAsset.value,
                fee: 0,
            });
        } else {
            this.arc59OptInAndSend(
                buySideMarketplace,
                this.bidAsset.value,
                amounts.marketplace,
                false
            );
        }

        // pay seller
        if (this.seller.value.isOptedInToAsset(this.bidAsset.value)) {
            sendAssetTransfer({
                assetReceiver: this.seller.value,
                assetAmount: amounts.seller,
                xferAsset: this.bidAsset.value,
                fee: 0,
            });
        } else {
            this.arc59OptInAndSend(
                this.seller.value,
                this.bidAsset.value,
                amounts.seller,
                false
            );
        }
    }

    /**
     * 
     * @returns a boolean of whether the auction is live
     */
    @abi.readonly
    isLive(): boolean {
        return (
            globals.round <= this.startingRound.value
            && globals.round >= this.endingRound.value
        )
    }

    createApplication(
        prize: AssetID,
        bidAsset: AssetID,
        bidFee: uint64,
        startingBid: uint64,
        bidMinimumIncrease: uint64,
        startingRound: uint64,
        endingRound: uint64,
        seller: Address,
        creatorRoyalty: uint64,
        marketplace: Address,
        marketplaceRoyalties: uint64,
        gateID: uint64,
        vrfBeaconAppID: AppID,
    ) {
        assert(this.txn.sender === globals.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY);

        this.prize.value = prize;
        this.prizeClaimed.value = false;
        this.bidAsset.value = bidAsset;
        this.bidFee.value = bidFee;
        this.startingBid.value = startingBid;
        this.bidMinimumIncrease.value = bidMinimumIncrease;
        this.startingRound.value = startingRound;
        this.endingRound.value = endingRound;
        this.seller.value = seller;
        this.creatorRoyalty.value = creatorRoyalty;
        this.marketplace.value = marketplace;
        this.marketplaceRoyalties.value = marketplaceRoyalties;
        this.gateID.value = gateID;
        this.vrfBeaconAppID.value = vrfBeaconAppID;

        this.refundCount.value = 0;
        this.bidTotal.value = 0 as uint128;
        this.weightedBidTotal.value = 0;
        this.bidID.value = 0;
        this.raffleAmount.value = 0;
        this.rafflePrizeClaimed.value = false;
        this.uniqueAddressCount.value = 0;
        this.findWinnerCursor.value = 0;
        this.findWinnerTotalCursor.value = 0;
        this.winningTicket.value = 0;
        this.raffleWinner.value = globals.zeroAddress;
    }

    bid(payment: PayTxn, marketplace: Address): void {

        const id = this.newBidID();

        assert(this.isLive(), errs.AUCTION_NOT_LIVE);
        assert(!this.bids(id).exists, errs.BID_ALREADY_EXISTS);

        let minimumBidAmount = bidMBR;
        if (id > 0) {
            const lastBidInfo = this.bids(id - 1).value;
            minimumBidAmount += lastBidInfo.amount + this.bidMinimumIncrease.value;
        } else {
            minimumBidAmount += this.startingBid.value;
        }

        /** 
         * Verify payment transaction, if we ignore
         * who sent the payment we can allow txn
         * sponsorships
        */
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: {
                greaterThanEqualTo: minimumBidAmount
            }
        });

        const bidAmount = payment.amount - bidMBR;

        this.bids(id).value = {
            address: this.txn.sender,
            amount: bidAmount,
            refunded: false,
            marketplace: marketplace,
        };

        if (this.bidsByAddress(this.txn.sender).exists) {
            const lastBid = this.bidsByAddress(this.txn.sender).value;
            this.weightedBidTotal.value += (bidAmount - lastBid);
            this.bidsByAddress(this.txn.sender).value = bidAmount;
        } else {
            this.uniqueAddressCount.value += 1;
            this.weightedBidTotal.value += bidAmount;
            this.bidsByAddress(this.txn.sender).value = bidAmount
        }

        // if this is a snipe increase the time left by 2 minutes
        if (globals.round > (this.endingRound.value - SNIPE_RANGE)) {
            this.endingRound.value += SNIPE_EXTENSION;
        }

        if (this.bidFee.value > 0) {
            const bidFee = this.getBidFee(bidAmount);
            this.raffleAmount.value += bidFee;
        }

        this.bidTotal.value += bidAmount as uint128;
    }

    bidAsa(payment: PayTxn, assetXfer: AssetTransferTxn, marketplace: Address): void {

        const id = this.newBidID();

        assert(this.isLive(), errs.AUCTION_NOT_LIVE);
        assert(!this.bids(id).exists, errs.BID_ALREADY_EXISTS);

        let minimumBidAmount = 0;
        if (id > 0) {
            const lastBidInfo = this.bids(id - 1).value;
            minimumBidAmount += lastBidInfo.amount + this.bidMinimumIncrease.value;
        } else {
            minimumBidAmount += this.startingBid.value;
        }

        /** 
         * Verify payment transaction, if we ignore
         * who sent the payment we can allow txn
         * sponsorships
        */
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: bidMBR,
        });

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: { greaterThanEqualTo: minimumBidAmount },
        });

        const bidAmount = payment.amount - bidMBR;

        this.bids(id).value = {
            address: this.txn.sender,
            amount: bidAmount,
            refunded: false,
            marketplace: marketplace,
        };

        if (this.bidsByAddress(this.txn.sender).exists) {
            const lastBid = this.bidsByAddress(this.txn.sender).value;
            this.weightedBidTotal.value += (bidAmount - lastBid);
            this.bidsByAddress(this.txn.sender).value = bidAmount;
        } else {
            this.uniqueAddressCount.value += 1;
            this.weightedBidTotal.value += bidAmount;
            this.bidsByAddress(this.txn.sender).value = bidAmount
        }

        // if this is a snipe increase the time left by 2 minutes
        if (globals.round > (this.endingRound.value - SNIPE_RANGE)) {
            this.endingRound.value += SNIPE_EXTENSION;
        }

        if (this.bidFee.value > 0) {
            const bidFee = this.getBidFee(bidAmount);
            this.raffleAmount.value += bidFee;
        }

        this.bidTotal.value += bidAmount as uint128;
    }

    refundBid(id: uint64): void {
        // make sure were not refunding the last bid
        assert(id < this.bidID.value, errs.CANNOT_REFUND_MOST_RECENT_BID);
        // make sure the bid exists
        assert(this.bids(id).exists, errs.BID_NOT_FOUND);
        // get bid info
        const bid = this.bids(id).value;
        // make sure its not already refunded
        assert(!bid.refunded, errs.BID_ALREADY_REFUNDED);
        // mark the bid as refunded
        this.bids(id).value.refunded = true;

        const bidFee = this.getBidFee(bid.amount);

        const returnAmount = bid.amount - bidFee

        if (this.bidAsset.value.id === 0) {
            // return the bidders funds
            sendPayment({
                amount: returnAmount,
                receiver: bid.address,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                assetAmount: returnAmount,
                assetReceiver: bid.address,
                xferAsset: this.bidAsset.value,
                fee: 0,
            });
        }
        // increment our refund counter
        this.refundCount.value += 1;
    }

    claimPrize(): void {
        // make sure the auction has ended
        assert(globals.round > this.endingRound.value, errs.AUCTION_HAS_NOT_ENDED)
        assert(!this.prizeClaimed.value, errs.PRIZE_ALREADY_CLAIMED);

        // get the winners details
        const winner = this.bids(this.bidID.value).value;

        this.transferPurchaseToBuyer(winner.address);

        if (this.bidAsset.value.id === 0) {
            this.completeAlgoPayments(winner.amount, winner.marketplace);
        } else {
            this.completeAsaPayments(winner.amount, winner.marketplace);
        }

        this.prizeClaimed.value = true;
    }

    raffle(): void {
        const roundToUse = (this.endingRound.value + 1) + (4 * this.vrfGetFailureCount.value);
        assert(globals.round >= roundToUse + 8, errs.NOT_ENOUGH_TIME);
        assert(this.winningTicket.value === 0, errs.WINNER_ALREADY_DRAWN);

        const seed = sendMethodCall<typeof RandomnessBeacon.prototype.get, bytes>({
            applicationID: this.vrfBeaconAppID.value,
            methodArgs: [roundToUse, this.txn.txID],
            fee: 0,
        });

        if (seed.length === 0) {
            this.vrfGetFailureCount.value += 1;
            return;
        }

        let rngState = pcg64Init(substring3(seed, 0, 16) as bytes<16>);
        const rngResult = pcg64Random(rngState, 1, this.weightedBidTotal.value, 1);
        this.winningTicket.value = rngResult[1][0];
    }

    findWinner(): void {
        assert(globals.round < this.endingRound.value, errs.AUCTION_HAS_NOT_ENDED);
        assert(this.winningTicket.value !== 0, errs.WINNING_NUMBER_NOT_FOUND);
        const complete = (this.bidID.value - 1) === this.findWinnerCursor.value;
        assert(!complete, errs.WINNER_ALREADY_FOUND);

        // walk the index from the winner to find the
        const startingIndex = this.findWinnerCursor.value;
        const remainder = (this.bidID.value - 1) - this.findWinnerCursor.value;
        // at most with calling this (15 * 4) / 2 because of box reference limits
        const iterationAmount = (remainder > 30) ? 30 : remainder;

        for (let i = startingIndex; i < iterationAmount; i += 1) {
            const bid = this.bids(i).value;
            const amt = this.bidsByAddress(bid.address).value;

            // bids cant match so if we hit
            // an address where the bids dont match
            // we know its an address we've already seen
            if (bid.amount !== amt) {
                // we can delete the bid
                this.bids(i).delete();
                
                sendPayment({
                    receiver: bid.address,
                    amount: (bidMBR - bidsByAddressMBR),
                    fee: 0,
                });
                continue;
            } else {
                // we can delete both the bid and the bidsByAddress
                this.bids(i).delete();
                this.bidsByAddress(bid.address).delete();

                sendPayment({
                    receiver: bid.address,
                    amount: bidMBR,
                    fee: 0,
                });
            }

            const isWinner = (this.findWinnerTotalCursor.value + bid.amount) >= this.winningTicket.value;
            if (isWinner) {
                this.raffleWinner.value = bid.address;
            }

            this.findWinnerTotalCursor.value += bid.amount;
        }

        this.findWinnerCursor.value += iterationAmount;
    }

    claimRafflePrize(): void {
        assert(this.raffleWinner.value !== globals.zeroAddress, errs.WINNER_NOT_FOUND);
        assert(!this.rafflePrizeClaimed.value, errs.RAFFLE_ALREADY_PRIZE_CLAIMED)
        
        if (this.bidAsset.value.id === 0) {
            sendPayment({
                receiver: this.raffleWinner.value,
                amount: this.raffleAmount.value,
                fee: 0,
            });
        } else {
            if (this.raffleWinner.value.isOptedInToAsset(this.bidAsset.value)) {
                sendAssetTransfer({
                    assetReceiver: this.raffleWinner.value,
                    assetAmount: this.raffleAmount.value,
                    xferAsset: this.bidAsset.value,
                    fee: 0,
                });
            } else {
                this.arc59OptInAndSend(
                    this.raffleWinner.value,
                    this.bidAsset.value,
                    this.raffleAmount.value,
                    false
                );
            }
        }

        this.rafflePrizeClaimed.value = true;
    }

    deleteApplication(): void {
        assert(this.refundCount.value === (this.bidID.value + 1))
        assert(this.prizeClaimed.value, errs.PRIZE_NOT_CLAIMED)
        assert(this.rafflePrizeClaimed.value, errs.RAFFLE_WINNER_HAS_NOT_CLAIMED);
    }
    /**
     * deletes the application & returns the mbr + asset
     * to the seller IF the auction hasn't started
     */
    @allow.call('DeleteApplication')
    cancel(): void {
        assert(this.txn.sender == this.seller.value);
        assert(globals.round < this.startingRound.value)

        this.pendingGroup.addAssetTransfer({
            assetCloseTo: this.seller.value,
            assetReceiver: this.seller.value,
            assetAmount: this.app.address.assetBalance(this.prize.value),
            xferAsset: this.prize.value,
            fee: 0,
            isFirstTxn: true,
        });

        this.pendingGroup.addPayment({
            receiver: this.seller.value,
            closeRemainderTo: this.seller.value,
            amount: 0,
        });

        this.pendingGroup.submit();
    }
}