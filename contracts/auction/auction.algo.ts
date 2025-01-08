import { Contract } from '@algorandfoundation/tealscript';
import { ContractWithOptInCreatorOnly } from '../../utils/base_contracts/optin.algo';

// sniping is defined as bidding in the last 30 seconds
const SNIPE_RANGE: uint64 = 60
// if a snipe bid takes place, extend the auction by an additional 2 minutes
const SNIPE_EXTENSION: uint64 = 120

const RANDOMNESS_BEACON_APPID: AppID = AppID.fromUint64(1615566206);

interface BidInfo {
    address: Address,
    amount: uint64;
    refunded: boolean
}

export class Auction extends ContractWithOptInCreatorOnly {

    /** the address selling the asset */
    seller = GlobalStateKey<Address>({ key: 'seller' });
    /** the creator royalties */
    creatorRoyalties = GlobalStateKey<uint64>({ key: 'creator_royalties' });
    /**  */
    marketplace = GlobalStateKey<Address>({ key: 'marketplace' });

    marketplaceRoyalties = GlobalStateKey<uint64>({ key: 'marketplace_royalties' });

    startingRound = GlobalStateKey<uint64>({  key: 'starting_round' });
    
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
    // last bid is the index of the box key with the bid info
    lastBid = GlobalStateKey<uint64>({ key: 'last_bid' });
    /** the minimum amount each new bid needs to increase */
    minBidIncrease = GlobalStateKey<uint64>({ key: 'min_bid_increase' });

    prize = GlobalStateKey<AssetID>({ key: 'asset' });
    
    prizeAmount = GlobalStateKey<uint64>();

    startingBid = GlobalStateKey<uint64>();

    biddingFee = GlobalStateKey<uint64>()

    feesAccumulated = GlobalStateKey<uint64>();

    bidTotal = GlobalStateKey<uint64>();

    refundCount = GlobalStateKey<uint64>();

    raffleClaimed = GlobalStateKey<uint64>();

    /** 
     * when we go through the participants for the raffle
     * it may take multiple groups of txns so we have a variable
     * for tracking how far through the list we are
    */
    gatherHighestBidsCursor = GlobalStateKey<uint64>();

    /**
     * we count how many unique addresses bid so we can 
     * properly get each bids % of the total bid amount
    */
    uniqueAddressCount = GlobalStateKey<uint64>();

    /**
     * 
     */
    weightedTotal = GlobalStateKey<uint128>();

    /** 
     * when we go through the participants for the raffle
     * it may take multiple groups of txns so we have a variable
     * for tracking how far through the list we are
    */
    findRaffleWinnerCursor = GlobalStateKey<uint64>();

    vrfRound = GlobalStateKey<uint64>();

    /**
     * we get the winning number from the randomness beacon
     * after the auction ends & we have ran gatherHighestBids
     * to compile our list 
     */
    winningNumber = GlobalStateKey<uint64>();

    downCount = GlobalStateKey<uint64>();

    winningAddress = GlobalStateKey<Address>();

    bids = BoxMap<uint64, BidInfo>();

    /** 
     * when we run our raffle we need to transform
     * our list of bids into an address based box
    */
    bidsByAddress = BoxMap<Address, uint64>();

    /**
     * 
     * @returns a boolean of whether the auction is live
     */
    isLive(): boolean {
        return (
            globals.round <= this.startingRound.value
            && globals.round >= this.endingRound.value
        )
    }

    protected getBidFee(amt: uint64): uint64 {
        if (this.biddingFee.value > 0) {
            return (amt * this.biddingFee.value - 1) / 100 + 1
        }
        return 0
    }

    init(
        asset: AssetID,
        seller: Address,
        startingRound: uint64,
        endingRound: uint64,
        minBidIncrease: uint64,
        creatorRoyalties: uint64,
        marketplace: Address,
        marketplaceRoyalties: uint64,
        startingBid: uint64,
        biddingFee: uint64,
    ) {

        assert(this.txn.sender === globals.creatorAddress)

        this.seller.value = seller;
        this.creatorRoyalties.value = creatorRoyalties;
        this.marketplace.value = marketplace;
        this.marketplaceRoyalties.value = marketplaceRoyalties;
        this.startingRound.value = startingRound;
        this.endingRound.value = endingRound;
        this.lastBid.value = 0;
        this.minBidIncrease.value = minBidIncrease;
        this.prize.value = asset;
        this.prizeAmount.value = this.app.address.assetBalance(asset);
        this.startingBid.value = startingBid;
        this.biddingFee.value = biddingFee;
        this.feesAccumulated.value = 0;
        this.bidTotal.value = 0;
        this.refundCount.value = 0;
        this.raffleClaimed.value = 0;
        this.gatherHighestBidsCursor.value = 0;
        this.uniqueAddressCount.value = 0;
        this.weightedTotal.value = 0;
        this.findRaffleWinnerCursor.value = 0;
        this.vrfRound.value = 0;
        this.winningNumber.value = 0;
        this.downCount.value = 0;
        this.winningAddress.value = globals.zeroAddress;
    }

    bid(payment: PayTxn) {

        const newBidIndex = this.lastBid.value + 1;

        assert(this.isLive());
        assert(!this.bids(newBidIndex).exists);

        const lastBidInfo = this.bids(this.lastBid.value).value;

        const requiredAmount = lastBidInfo.amount
            + this.getBoxCreateMinBalance(8, 41)
            + this.minimumBidIncrease.value;

        /** 
         * Verify payment transaction, if we ignore
         * who sent the payment we can allow txn
         * sponsorships
        */
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: { greaterThan: requiredAmount },
        });

        const bidAmount = payment.amount - this.getBoxCreateMinBalance(8, 41);

        this.bids(newBidIndex).value = {
            address: this.txn.sender,
            amount: bidAmount,
            refunded: false,
        };

        // increment the bid number
        this.lastBid.value = newBidIndex;

        // if this is a snipe increase the time left by 2 minutes
        if (globals.latestTimestamp > (this.endingRound.value - SNIPE_RANGE)) {
            this.endingRound.value += SNIPE_EXTENSION;
        }

        const bidFee = this.getBidFee(bidAmount);

        this.feesAccumulated.value += bidFee;
        this.bidTotal.value += bidAmount;
    }

    refundLostBid(bidIndex: uint64): void {
        // make sure were not refunding the last bid
        assert(bidIndex !== this.lastBid.value);
        // make sure the bid exists
        assert(this.bids(bidIndex).exists);
        // get bid info
        const bid = this.bids(bidIndex).value;
        // make sure its not already refunded
        assert(!bid.refunded);
        // mark the bid as refunded
        this.bids(bidIndex).value = {
            address: bid.address,
            amount: bid.amount,
            refunded: true,
        };

        const bidFee = this.getBidFee(bid.amount);

        const returnAmount = bid.amount - bidFee

        // return the bidders funds
        sendPayment({
            amount: returnAmount,
            receiver: bid.address,
        });
        // increment our refund counter
        this.refundCount.value += 1;
    }

    claim(): void {
        // make sure the auction has ended
        assert(globals.latestTimestamp > this.end.value)
        // get the winners details
        const winner = this.bids(this.lastBid.value).value;

        // transfer asa to buyer

        // pay creator

        // pay listing marketplace

        // pay buying marketplace

        if (this.biddingFee.value > 0) {
            // pick a random index
            RANDOMNESS_BEACON_APPID


            // payout bidding fees to participant

        }

        // close out to seller
    }

    gatherHighestBids(payment: PayTxn): void {
        // make sure the auction has ended
        assert(globals.latestTimestamp > this.end.value);

        const startingIndex = this.gatherHighestBidsCursor.value;

        const remainder = (this.lastBid.value - 1) - this.gatherHighestBidsCursor.value;

        if (remainder === 0) {
            return;
        }

        // at most with calling this (15 * 8) / 2 because of box reference limits
        const iterationAmount = (remainder > 60) ? 60 : remainder;

        const amountRequirement = iterationAmount * this.getBoxCreateMinBalance(32, 8);

        verifyPayTxn(payment, {
            amount: { greaterThanEqualTo: amountRequirement }
        })

        for (let i = startingIndex; i < iterationAmount; i += 1) {

            const bid = this.bids(i).value;
            if (this.bidsByAddress(bid.address).exists) {
                // add the difference between their last bid amount and this one
                this.weightedTotal.value += bid.amount - this.bidsByAddress(bid.address).value;
            } else {

                this.weightedTotal.value += bid.amount
                this.uniqueAddressCount.value += 1;
                this.bidsByAddress(bid.address).value = bid.amount;
            }
        }

        this.gatherHighestBidsCursor.value += iterationAmount;
    }

    queueDrawRound(): void {
        assert(globals.latestTimestamp > this.end.value)
        assert(this.vrfRound.value === 0)
        this.vrfRound.value = globals.round + 3
    }

    drawWinner(): void {
        assert(this.vrfRound.value !== 0)
        assert(globals.round > this.vrfRound.value)

        let data = sendMethodCall<[uint64, string], string>({
            name: 'must_get',
            methodArgs: [
                this.vrfRound.value,
                (itob(this.lastBid.value) + this.txn.sender)
            ],
            // beacon application id
            applicationID: RANDOMNESS_BEACON_APPID,
            fee: 0,
        });

        const max = this.weightedTotal.value;
        let result: uint64 = 0;
        if (this.isPowerOfTwo(max)) {
            // if its a power of 2 we can just modulo
            result = btoi(data.substring(24, 32)) % max;
        } else {

            const maxMinusOne = max - 1;
            const bitLen = bitlen(maxMinusOne);
            const k = (bitLen + 7) / 8;
            const b = bitLen % 8 === 0 ? 8 : bitLen % 8;

            let randomInt: uint64;
            let offset = 0;

            // this will loop at most 5 times
            // since the data is always 32 bytes
            // 5th loop fails out
            while (true) {
                let part = data.slice(offset, offset + 8);
                offset += 8;

                if (offset === 32) {
                    // pick a new round for randomness
                    this.vrfRound.value = globals.round + 3;
                    // fail out
                    assert(false)
                }

                // part = setbyte(part, 0, (getbyte(part, 0) & ((1 << b) - 1)));
                const bitMask = ((1 << b) - 1)
                const extracted = extract3(part, 0, 1);
                const newByte = extracted & bitMask;
                part = replace3(part, 0, newByte);
                randomInt = btoi(part);

                if (randomInt < max) {
                    result = randomInt;
                    break;
                }
            }
        }
    }

    findRaffleWinner(): void {

        assert(globals.latestTimestamp > this.end.value);
        assert(this.winningAddress.value !== globals.zeroAddress)

        // walk down the index from the winner to find the
        const startingIndex = this.findRaffleWinnerCursor.value;

        const remainder = (this.lastBid.value - 1) - this.findRaffleWinnerCursor.value;

        if (remainder === 0) {
            return;
        }

        // at most with calling this (15 * 8) / 2 because of box reference limits
        const iterationAmount = (remainder > 60) ? 60 : remainder;

        for (let i = startingIndex; i < iterationAmount; i += 1) {
            // reverse index
            const ri = (this.lastBid.value - 1) - i;

            const bid = this.bids(ri).value;
            const amt = this.bidsByAddress(bid.address).value;

            // bids cant match so if we hit
            // an address where the bids dont match
            // we know its an address we've already seen
            if (bid.amount !== amt) {
                continue;
            }

            if (this.downCount.value === 0) {
                this.downCount.value = this.weightedTotal.value - this.winningNumber.value;
            }

            if (bid.amount < this.downCount.value) {
                this.downCount.value -= bid.amount;
                continue;
            }

            // WINNER
            this.winningAddress.value = bid.address;
        }

        this.findRaffleWinnerCursor.value += iterationAmount;
    }

    deleteApplication(): void {

        assert(this.refundCount.value === (this.lastBid.value + 1))
        assert(this.app.address.assetBalance(this.asset.value) === 0);
        assert(this.raffleClaimed.value > 0)
    }
    /**
     * deletes the application & returns the mbr + asset
     * to the seller IF the auction hasn't started
     */
    @allow.call('DeleteApplication')
    cancel(): void {

        assert(this.txn.sender == this.seller.value);
        assert(globals.latestTimestamp < this.start.value)

        this.pendingGroup.addAssetTransfer({
            assetReceiver: this.seller.value,
            assetCloseTo: this.seller.value,
            assetAmount: this.app.address.assetBalance(this.asset.value),
            xferAsset: this.asset.value,
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