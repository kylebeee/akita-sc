import { ContractWithOptInCreatorOnlyArc59AndGate } from '../../utils/base_contracts/gate.algo';
import { AkitaAppIDsAkitaSocialImpactPlugin, MAX_UINT64 } from '../../utils/constants';
import { pcg64Init, pcg64Random } from '../../utils/types/lib_pcg/pcg64.algo';
import { RoyaltyAmounts } from '../../utils/types/royalties';
import { RandomnessBeacon } from '../../utils/types/vrf_beacon';
import { AkitaSocialImpact } from '../arc58/plugins/social/impact.algo';
import { AKITA_AUCTION_COMPOSABLE_PERCENTAGE_KEY, AKITA_AUCTION_SALE_PERCENTAGE_MAXIMUM_KEY, AKITA_AUCTION_SALE_PERCENTAGE_MINIMUM_KEY } from '../dao/constants';

const errs = {
    MUST_BE_CALLED_FROM_FACTORY: 'must be called from the factory',
    NOT_APPLICABLE_TO_THIS_AUCTION: 'not applicable to this auction',
    MUST_ALLOCATE_AT_LEAST_THREE_HIGHEST_BIDS_CHUNKS: 'must allocate at least three highest bids chunks',
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
    ALL_REFUNDS_COMPLETE: 'all refunds complete',
    TOO_MANY_PARTICIPANTS: 'too many participants',
    NOT_ALL_REFUNDS_COMPLETE: 'not all refunds complete',
    RAFFLE_ALREADY_PRIZE_CLAIMED: 'raffle prize already claimed',
    PRIZE_NOT_CLAIMED: 'prize not claimed',
    RAFFLE_WINNER_NOT_FOUND: 'raffle winner not found',
    RAFFLE_WINNER_HAS_NOT_CLAIMED: 'raffle winner has not claimed',
    STILL_HAS_HIGHEST_BIDS_BOXES: 'still has highest bids boxes',
}

// sniping is defined as bidding in the last 45 rounds (~2 minutes at 2.7s blocktime)
export const SNIPE_RANGE: uint64 = 45
// if a snipe bid takes place, extend the auction by an additional 120 (~5 minutes at 2.7s blocktime)
export const SNIPE_EXTENSION: uint64 = 120

// const RANDOMNESS_BEACON_APPID: AppID = AppID.fromUint64(1615566206);

const bidsByAddressMBR = 18_500;
export const bidMBR = 34_900;
export const weightsListMBR = 13_113_300;
export const locationMBR = 18_900
export const bidTotalMBR = bidMBR + bidsByAddressMBR + locationMBR;

export type WeightLocation = uint64;

export type BidInfo = {
    address: Address,
    amount: uint64,
    marketplace: Address,
    refunded: uint8
}

// 4096*8 bytes = 32KB
export const ChunkSize = 4096;
export const MaxChunksPerGroup = 4;
// 4 accounts per txn * 16 group size = 64
export const MaxRefundIterationsPerGroup = 64;
export type WeightsList = StaticArray<{ amount: uint64 }, typeof ChunkSize>;

export class Auction extends ContractWithOptInCreatorOnlyArc59AndGate {
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = GlobalStateKey<AppID>({ key: 'akita_dao_app_id' });
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
    /** highest bid the contract has received thus far */
    highestBid = GlobalStateKey<uint64>();
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
    /** the number of boxes allocated to tracking weights */
    weightsBoxCount = GlobalStateKey<uint64>({ key: 'weights_box_count' });
    /** totals for each box of weights for our skip list */
    weightTotals = GlobalStateKey<StaticArray<uint64, 15>>({ key: 'w_totals' })
    /** 
     * cursors to track iteration of finding winner
     * index being for the bid iteration
     * amountIndex being the index for the amount of the bids seen
    */
    findWinnerCursors = GlobalStateKey<{ index: uint64, amountIndex: uint64 }>({ key: 'find_winner_cursors' });
    /** cursor to track iteration of MBR refunds */
    refundMBRCursor = GlobalStateKey<uint64>({ key: 'refund_mbr_cursor' });
    /**
     * we get the winning number from the randomness beacon
     * after the auction ends & we have ran findWinner
     * to compile our list 
     */
    winningTicket = GlobalStateKey<uint64>({ key: 'winning_ticket' });
    /** the winning address of the raffle */
    raffleWinner = GlobalStateKey<Address>({ key: 'raffle_winner' });

    /**
     * the list of bids in the auction
     */
    bids = BoxMap<uint64, BidInfo>({ prefix: 'b' });

    /**
     * weights set for bidders
     */
    weights = BoxMap<uint64, WeightsList>({ prefix: 'h' });

    /** 
     * when we run our raffle we need to transform
     * our list of bids into an address based box
    */
    bidsByAddress = BoxMap<Address, WeightLocation>({ prefix: 'a' });

    /**
     * the addresses associated with highest bid locations
     */
    locations = BoxMap<uint64, Address>({ prefix: 'l' });

    private newBidID(): uint64 {
        const id = this.bidID.value;
        this.bidID.value += 1;
        return id;
    }

    private getMinimumBidAmount(): uint64 {
        if (this.highestBid.value > 0) {
            if (this.bidAsset.value.id === 0) {
                if (this.bidsByAddress(this.txn.sender).exists) {
                    return this.highestBid.value
                        + this.bidMinimumIncrease.value
                        + bidMBR;
                } else {
                    return this.highestBid.value
                        + this.bidMinimumIncrease.value
                        + bidTotalMBR;
                }
            }
            return this.highestBid.value + this.bidMinimumIncrease.value;
        } else {
            if (this.bidAsset.value.id === 0) {
                if (this.bidsByAddress(this.txn.sender).exists) {
                    return this.startingBid.value + bidMBR;
                } else {
                    return this.startingBid.value + bidTotalMBR;
                }
            }
            return this.startingBid.value;
        }
    }

    private setNewBid(id: uint64, bidAmount: uint64, marketplace: Address): void {
        this.bids(id).value = {
            address: this.txn.sender,
            amount: bidAmount,
            refunded: 0,
            marketplace: marketplace,
        };

        if (this.bidFee.value > 0) {
            if (this.bidsByAddress(this.txn.sender).exists) {
                const loc = this.bidsByAddress(this.txn.sender).value;
                const lastBid = this.weights(loc / ChunkSize).value[loc % ChunkSize].amount;
                this.weightedBidTotal.value += (bidAmount - lastBid);
                this.weights(loc / ChunkSize).value[loc % ChunkSize] = { amount: bidAmount };
                this.weightTotals.value[loc / ChunkSize] += (bidAmount - lastBid);
            } else {
                const loc = this.uniqueAddressCount.value;
                assert(loc < ChunkSize * this.weightsBoxCount.value, errs.TOO_MANY_PARTICIPANTS)
                this.weightedBidTotal.value += bidAmount;
                this.bidsByAddress(this.txn.sender).value = loc;
                this.weights(loc / ChunkSize).value[loc % ChunkSize] = { amount: bidAmount };
                this.weightTotals.value[loc / ChunkSize] += bidAmount;
                this.locations(loc).value = this.txn.sender;
                this.uniqueAddressCount.value += 1;
            }
        }
    }

    private getBidFee(amount: uint64): uint64 {
        const fee = wideRatio([amount, this.bidFee.value], [10_000]);
        if (fee === 0 && this.bidFee.value > 0 && amount > 0) {
            return 1;
        }
        return fee;
    }

    private getUserImpact(address: Address): uint64 {
        return sendMethodCall<typeof AkitaSocialImpact.prototype.getUserImpact, uint64>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [ address ],
            fee: 0,
        })
    }

    private getAmounts(amount: uint64): RoyaltyAmounts {
        let creatorAmount = wideRatio([amount, this.creatorRoyalty.value], [10000]);
        if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
            creatorAmount = 1;
        }

        const minTax = this.akitaDaoAppID.value.globalState(AKITA_AUCTION_SALE_PERCENTAGE_MINIMUM_KEY) as uint64;
        const maxTax = this.akitaDaoAppID.value.globalState(AKITA_AUCTION_SALE_PERCENTAGE_MAXIMUM_KEY) as uint64;
        const impact = this.getUserImpact(this.seller.value);
        const akitaTaxRate = maxTax - wideRatio([(maxTax - minTax), (impact - 1)], [999]);
        
        let akitaAmount = wideRatio([amount, akitaTaxRate], [10000]);
        if (akitaAmount === 0 && amount > 0) {
            akitaAmount = 1;
        }

        const marketplaceTaxRate = this.akitaDaoAppID.value.globalState(AKITA_AUCTION_COMPOSABLE_PERCENTAGE_KEY) as uint64;

        let marketplaceAmount = wideRatio([amount, marketplaceTaxRate], [10000]);
        if (marketplaceAmount === 0 && this.marketplaceRoyalties.value > 0 && amount > 0) {
            marketplaceAmount = 1;
        }

        const sellerAmount = amount - (creatorAmount + akitaAmount + (2 * marketplaceAmount));

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
        akitaDaoAppID: AppID,
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
        gateID: uint64,
        vrfBeaconAppID: AppID,
    ) {
        assert(this.txn.sender === globals.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY);

        this.akitaDaoAppID.value = akitaDaoAppID;
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
        this.gateID.value = gateID;
        this.vrfBeaconAppID.value = vrfBeaconAppID;
        this.vrfGetFailureCount.value = 0;
        this.refundCount.value = 0;
        this.weightedBidTotal.value = 0;
        this.highestBid.value = 0;
        this.bidID.value = 0;
        this.raffleAmount.value = 0;
        this.rafflePrizeClaimed.value = false;
        this.uniqueAddressCount.value = 0;
        this.weightTotals.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.findWinnerCursors.value = { index: 0, amountIndex: 0 };
        this.refundMBRCursor.value = 0;
        this.winningTicket.value = 0;
        this.raffleWinner.value = globals.zeroAddress;
    }

    init(payment: PayTxn, weightListLength: uint64) {
        assert(this.txn.sender === this.app.creator, errs.MUST_BE_CALLED_FROM_FACTORY);
        assert(this.bidFee.value > 0, errs.NOT_APPLICABLE_TO_THIS_AUCTION)
        assert(weightListLength >= 3, errs.MUST_ALLOCATE_AT_LEAST_THREE_HIGHEST_BIDS_CHUNKS);
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (weightListLength * weightsListMBR)
        });

        for (let i = 0; i < weightListLength; i += 1) {
            this.weights(i).create();
        }
    }

    bid(payment: PayTxn, marketplace: Address): void {
        assert(this.isLive(), errs.AUCTION_NOT_LIVE);

        const id = this.newBidID();
        let minimumBidAmount = this.getMinimumBidAmount();

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: {
                greaterThanEqualTo: minimumBidAmount
            }
        });

        let bidAmount: uint64 = 0;
        if (this.bidsByAddress(this.txn.sender).exists) {
            bidAmount = payment.amount - bidMBR;
        } else {
            bidAmount = payment.amount - bidTotalMBR;
        }

        this.setNewBid(id, bidAmount, marketplace);

        // if this is a snipe increase the time left by 2 minutes
        if (globals.round > (this.endingRound.value - SNIPE_RANGE)) {
            this.endingRound.value += SNIPE_EXTENSION;
        }

        if (this.bidFee.value > 0) {
            const bidFee = this.getBidFee(bidAmount);
            this.raffleAmount.value += bidFee;
        }

        this.highestBid.value = bidAmount;
    }

    bidAsa(payment: PayTxn, assetXfer: AssetTransferTxn, marketplace: Address): void {
        assert(this.isLive(), errs.AUCTION_NOT_LIVE);

        const id = this.newBidID();
        let minimumBidAmount = this.getMinimumBidAmount();

        if (this.bidsByAddress(this.txn.sender).exists) {
            verifyPayTxn(payment, {
                receiver: this.app.address,
                amount: bidMBR,
            });
        } else {
            verifyPayTxn(payment, {
                receiver: this.app.address,
                amount: bidTotalMBR,
            });
        }

        verifyAssetTransferTxn(assetXfer, {
            assetReceiver: this.app.address,
            assetAmount: {
                greaterThanEqualTo: minimumBidAmount
            },
            xferAsset: this.bidAsset.value,
        });

        const bidAmount: uint64 = assetXfer.assetAmount;

        this.setNewBid(id, bidAmount, marketplace);

        // if this is a snipe increase the time left by 2 minutes
        if (globals.round > (this.endingRound.value - SNIPE_RANGE)) {
            this.endingRound.value += SNIPE_EXTENSION;
        }

        if (this.bidFee.value > 0) {
            const bidFee = this.getBidFee(bidAmount);
            this.raffleAmount.value += bidFee;
        }

        this.highestBid.value = bidAmount;
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
        this.bids(id).value.refunded = 1;

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
        assert(globals.round > this.endingRound.value, errs.AUCTION_HAS_NOT_ENDED);
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

        // make upper bounds inclusive if we can
        let upperBound = this.weightedBidTotal.value;
        if (upperBound < MAX_UINT64) {
            upperBound = upperBound += 1;
        }

        const rngResult = pcg64Random(rngState, 1, upperBound, 1);
        this.winningTicket.value = rngResult[1][0];
    }

    private getWinnerWeightBoxInfo(): [uint64, uint64] {
        let startingIndex = this.findWinnerCursors.value.index;
        let currentRangeStart = this.findWinnerCursors.value.amountIndex;

        for (let i = 0; i < this.weightsBoxCount.value; i += 1) {
            const boxStake = this.weightTotals.value[i];
            if (this.winningTicket.value < (currentRangeStart + boxStake)) {
                return [startingIndex, currentRangeStart];
            }

            startingIndex += ChunkSize;
            currentRangeStart += boxStake + 1;
        }

        return [startingIndex, currentRangeStart];
    }

    findWinner(): void {
        assert(this.bidFee.value > 0, errs.NOT_APPLICABLE_TO_THIS_AUCTION);
        assert(globals.round < this.endingRound.value, errs.AUCTION_HAS_NOT_ENDED);
        assert(this.winningTicket.value !== 0, errs.WINNING_NUMBER_NOT_FOUND);        
        assert(this.raffleWinner.value === Address.zeroAddress, errs.WINNER_ALREADY_FOUND);

        const winningBoxInfo = this.getWinnerWeightBoxInfo();

        const startingIndex = winningBoxInfo[0];
        let currentRangeStart = winningBoxInfo[1];
        let currentRangeEnd = 0;

        /**
         * minus 2 because the auction winner is not participating in the raffle
         * and to account for index 0 being the starting bid
        */
        const remainder = (this.uniqueAddressCount.value - 2) - startingIndex;
        const iterationAmount = (remainder > ChunkSize) ? ChunkSize : remainder;

        const weight = this.weights(startingIndex / ChunkSize).value;

        const opUpIterationAmount = ((iterationAmount * 60) / 700)
        log(' op up iteration amount: ' + opUpIterationAmount.toString())
        for (let i = 0; i <= opUpIterationAmount; i += 1) {
            increaseOpcodeBudget()
        }

        for (let i = 0; i < iterationAmount; i += 1) {
            const amount = weight[i].amount;
            if (amount === this.highestBid.value) {
                currentRangeEnd = currentRangeStart + amount;
                currentRangeStart = currentRangeEnd + 1;
                continue;
            }

            currentRangeEnd = currentRangeStart + amount;
            if (this.winningTicket.value >= currentRangeStart && this.winningTicket.value <= currentRangeEnd) {
                this.raffleWinner.value = this.locations(startingIndex + i + 1).value;
            }
            currentRangeStart = currentRangeEnd + 1; 
        }

        this.findWinnerCursors.value.index += iterationAmount;
        this.findWinnerCursors.value.amountIndex = currentRangeStart;
    }

    refundMBR(): void {
        assert(this.prizeClaimed.value, errs.PRIZE_NOT_CLAIMED);
        /** make sure we've already found the winner of the raffle */
        assert(this.bidFee.value === 0 || this.raffleWinner.value !== globals.zeroAddress, errs.WINNER_NOT_FOUND);
        /** make sure we haven't already refunded all MBR */
        assert(this.bidID.value !== this.refundMBRCursor.value, errs.ALL_REFUNDS_COMPLETE);

        const startingIndex = this.refundMBRCursor.value;
        const remainder = this.bidID.value - this.refundMBRCursor.value;

        const iterationAmount = (remainder > MaxRefundIterationsPerGroup)
            ? MaxRefundIterationsPerGroup
            : remainder;

        for (let i = startingIndex; i < iterationAmount; i += 1) {
            if (globals.opcodeBudget < 100) {
                increaseOpcodeBudget()
            }

            const bid = this.bids(i).value;
            if (bid.refunded === 0) {
                this.refundBid(i);
            }

            // free up the MBR
            let refundAmount = bidMBR;
            this.bids(i).delete();
            if (this.bidsByAddress(bid.address).exists) {
                const loc = this.bidsByAddress(bid.address).value;
                this.bidsByAddress(bid.address).delete();
                this.locations(loc).delete();
                refundAmount = bidTotalMBR;
            }

            sendPayment({
                receiver: bid.address,
                amount: refundAmount,
                fee: 0,
            });
        }

        this.refundMBRCursor.value += iterationAmount;
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

    clearWeightsBoxes(): uint64 {
        assert(this.txn.sender === this.app.creator, errs.MUST_BE_CALLED_FROM_FACTORY);

        const iterationAmount = (this.weightsBoxCount.value > 128) ? 128 : this.weightsBoxCount.value;
        
        for (let i = 0; i < iterationAmount; i += 1) {
            const ri = (this.weightsBoxCount.value - 1) - i;
            this.weights(ri).delete();
        }

        this.weightsBoxCount.value -= iterationAmount;

        const returnAmount = iterationAmount * weightsListMBR;

        sendPayment({
            receiver: this.app.creator,
            amount: returnAmount,
            fee: 0,
        });

        return returnAmount;
    }

    deleteApplication(): void {
        assert(this.txn.sender === this.app.creator, errs.MUST_BE_CALLED_FROM_FACTORY);
        assert(this.refundCount.value === (this.bidID.value + 1));
        assert(this.prizeClaimed.value, errs.PRIZE_NOT_CLAIMED);
        assert(this.rafflePrizeClaimed.value, errs.RAFFLE_WINNER_HAS_NOT_CLAIMED);
        const refundsComplete = this.bidID.value === this.refundMBRCursor.value;
        assert(refundsComplete, errs.NOT_ALL_REFUNDS_COMPLETE);
        assert(this.weightsBoxCount.value === 0, errs.STILL_HAS_HIGHEST_BIDS_BOXES);
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