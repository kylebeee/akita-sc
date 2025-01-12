import { pcg64Init, pcg64Random } from "../../utils/types/lib_pcg/pcg64.algo";
import { RandomnessBeacon } from "../../utils/types/vrf_beacon";
import { MAX_UINT64 } from "../../utils/constants";
import { ContractWithOptInCreatorOnlyArc59AndGate } from "../../utils/base_contracts/gate.algo";

const errs = {
    TOO_SHORT: 'Raffles cannot be less than one hour',
    MUST_BE_CALLED_FROM_FACTORY: 'Only the creator of this app can call this method',
    NOT_LIVE: 'Raffle is not live',
    TICKET_ASSET_NOT_ALGO: 'ticket asset is not algo',
    TICKET_ASSET_ALGO: 'ticket asset is algo',
    FAILED_GATE: 'Gate check failed',
    FAILED_TO_GET_SEED: 'Failed to get seed',
    INVALID_MBR_AMOUNT: 'Invalid mbr amount',
    INVALID_MBR_RECIPIENT: 'Invalid mbr recipient',
    INVALID_ASSET: 'Invalid asset',
    BELOW_MIN: 'Amount is below minimum',
    ABOVE_MAX: 'Amount is above maximum',
    INVALID_RECEIVER: 'Invalid receiver',
    RAFFLE_HAS_NOT_ENDED: 'Raffle has not ended',
    WINNER_ALREADY_FOUND: 'Winner has already been found',
    ALREADY_ENTERED: 'You have already entered the raffle',
    NOT_ENDED: 'Raffle has not ended',
    NOT_ENOUGH_TIME: 'Not enough time has passed since the raffle ended',
    WINNER_ALREADY_DRAWN: 'Winning ticket has already been drawn',
    ENTRY_DOES_NOT_EXIST: 'Entry does not exist',
    WINNER_NOT_FOUND: 'Winner not found',
    ALL_REFUNDS_COMPLETE: 'All refunds have been completed',
    PRIZE_ALREADY_CLAIMED: 'Prize has already been claimed',
    BOXES_ARENT_CLEARED: 'Boxes are not cleared',
    PRIZE_NOT_CLAIMED: 'Prize has not been claimed',
    NO_WINNING_TICKET_YET: 'No winning ticket yet',
    TICKETS_NOT_RECLAIMED: 'Tickets have not been reclaimed',
    STILL_HAS_WEIGHTS_BOXES: 'Still has weights boxes',
    MUST_ALLOCATE_AT_LEAST_FOUR_HIGHEST_BIDS_CHUNKS: 'Must allocate at least four weights chunks',
}

// const RANDOMNESS_BEACON_APPID_TESTNET: AppID = AppID.fromUint64(600011887);
// const RANDOMNESS_BEACON_APPID_MAINNET: AppID = AppID.fromUint64(1615566206);

const entriesByAddressMBR = 18_900;
const entryMBR = 18_900;
export const weightsListMBR = 13_113_300;
export const entryTotalMBR = entryMBR + entriesByAddressMBR;

const roundsPerHour = 1285;

export type EntryInfo = {
    address: Address;
    location: WeightLocation;
}

export type WeightLocation = uint64;
// 4096*8 bytes = 32KB
export const ChunkSize = 4096;
export const MaxChunksPerGroup = 4;
// 8 references per txn * 16 group size / 32 references per box * box holding 4096 entries = 16_384
export const MaxIterationsPerGroup = 16_384;
// 4 accounts per txn * 16 group size = 64
export const MaxRefundIterationsPerGroup = 64;
export type WeightsList = StaticArray<{ amount: uint64 }, typeof ChunkSize>;

export type RaffleState = {
    ticketAsset: AssetID;
    startingRound: uint64;
    endingRound: uint64;
    seller: Address;
    minTickets: uint64;
    maxTickets: uint64;
    entryCount: uint64;
    ticketCount: uint64;
    winningTicket: uint64;
    raffleWinner: Address;
    prize: AssetID;
    rafflePrizeClaimed: boolean;
    gateID: uint64;
    vrfBeaconAppID: AppID;
    vrfGetFailureCount: uint64;
    entryID: uint64;
    findWinnerCursor: uint64;
    refundMBRCursor: uint64;
}

export class Raffle extends ContractWithOptInCreatorOnlyArc59AndGate {
    /** The asset required to enter the raffle */
    ticketAsset = GlobalStateKey<AssetID>({ key: 'ticket_asset' });
    /** The start round of the raffle as a unix timestamp */
    startingRound = GlobalStateKey<uint64>({ key: 'starting_round' });
    /** The end time of the raffle as a unix timestamp */
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
    /** the address selling the asset */
    seller = GlobalStateKey<Address>({ key: 'seller' });
    /** The minimum number of tickets to use for the raffle */
    minTickets = GlobalStateKey<uint64>({ key: 'min_tickets' });
    /** The maximum number of tickets users can enter the raffle with */
    maxTickets = GlobalStateKey<uint64>({ key: 'max_tickets' });
    /** The number of entries for the raffle */
    entryCount = GlobalStateKey<uint64>({ key: 'entry_count' });
    /** The number of tickets entered into the raffle */
    ticketCount = GlobalStateKey<uint64>({ key: 'ticket_count' });
    /** the winning ticket */
    winningTicket = GlobalStateKey<uint64>({ key: 'winning_ticket' });
    /** the winning address of the raffle */
    raffleWinner = GlobalStateKey<Address>({ key: 'raffle_winner' });
    /** the prize for the raffle */
    prize = GlobalStateKey<AssetID>({ key: 'prize' });
    /** Indicator for whether the prize has been claimed */
    rafflePrizeClaimed = GlobalStateKey<boolean>({ key: 'raffle_prize_claimed' });
    /** the gate to use for the raffle */
    gateID = GlobalStateKey<uint64>({ key: 'gate' });
    /** the app ID to fetch VRF proofs from */
    vrfBeaconAppID = GlobalStateKey<AppID>({ key: 'vrf_beacon_app_id' });
    /** counter for how many times we've failed to get rng from the beacon */
    vrfGetFailureCount = GlobalStateKey<uint64>({ key: 'vrf_get_failure_count' });
    /** The id's of the raffle entries */
    entryID = GlobalStateKey<uint64>({ key: 'entry_id' });
    /** the number of boxes allocated to tracking weights */
    weightsBoxCount = GlobalStateKey<uint64>({ key: 'highest_bid_box_count' });
    /** cursor to track iteration of finding winner */
    findWinnerCursor = GlobalStateKey<uint64>({ key: 'find_winner_cursor' });
    /** cursor to track iteration of MBR refunds */
    refundMBRCursor = GlobalStateKey<uint64>({ key: 'refund_mbr_cursor' });

    /**
     * The entries for the raffle
     * 
     * 2_500 + (400 * (9 + 32)) = 18_900
     */
    entries = BoxMap<uint64, Address>({ prefix: 'e' });

    /**
     * weights set for bidders
     * 
     * 2_500 + (400 * (9 + 32_768)) = 13_113_300
     */
    weights = BoxMap<uint64, WeightsList>({ prefix: 'h' });

    /** 
     * The address map of entries for the raffle
     * 
     * 2_500 + (400 * (33 + 8)) = 18_900
     * 
    */
    entriesByAddress = BoxMap<Address, WeightLocation>({ prefix: 'a' });

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
        ticketAsset: AssetID,
        startingRound: uint64,
        endingRound: uint64,
        seller: Address,
        minTickets: uint64,
        maxTickets: uint64,
        gateID: uint64,
        vrfBeaconAppID: AppID,
    ): void {
        this.prize.value = prize;
        this.ticketAsset.value = ticketAsset;
        this.startingRound.value = startingRound;
        assert(
            endingRound > startingRound
            && endingRound > (globals.round + roundsPerHour),
            errs.TOO_SHORT
        );
        this.endingRound.value = endingRound;
        this.seller.value = seller;
        this.minTickets.value = minTickets;
        this.maxTickets.value = maxTickets;
        this.entryCount.value = 0;
        this.ticketCount.value = 0;
        this.winningTicket.value = 0;
        this.raffleWinner.value = Address.zeroAddress;
        this.rafflePrizeClaimed.value = false;
        this.gateID.value = gateID;
        this.vrfBeaconAppID.value = vrfBeaconAppID;
        this.entryID.value = 0;
        this.findWinnerCursor.value = 0;
        this.refundMBRCursor.value = 0;
    }

    init(payment: PayTxn, weightListLength: uint64) {
        assert(this.txn.sender === this.app.creator, errs.MUST_BE_CALLED_FROM_FACTORY);
        assert(weightListLength >= 4, errs.MUST_ALLOCATE_AT_LEAST_FOUR_HIGHEST_BIDS_CHUNKS);
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (weightListLength * weightsListMBR)
        });

        for (let i = 0; i < weightListLength; i += 1) {
            this.weights(i).create();
        }
    }

    enter(payment: PayTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id === 0, errs.TICKET_ASSET_NOT_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);
        assert(!this.entriesByAddress(this.txn.sender).exists, errs.ALREADY_ENTERED)

        verifyPayTxn(payment, {
            amount: {
                greaterThanEqualTo: this.minTickets.value + entryTotalMBR,
                lessThanEqualTo: this.maxTickets.value + entryTotalMBR,
            },
            receiver: this.app.address,
        });

        const loc = this.entryCount.value;
        this.entries(loc).value = this.txn.sender;
        this.entriesByAddress(this.txn.sender).value = this.entryCount.value;

        const amount = payment.amount - entryTotalMBR;
        this.weights(loc / ChunkSize).value[loc % ChunkSize] = { amount: amount };

        this.entryCount.value += 1;
        this.ticketCount.value += amount;
    }

    enterAsa(payment: PayTxn, assetXfer: AssetTransferTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id !== 0, errs.TICKET_ASSET_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);
        assert(!this.entriesByAddress(this.txn.sender).exists, errs.ALREADY_ENTERED)

        verifyPayTxn(payment, {
            amount: entryTotalMBR,
            receiver: this.app.address,
        });

        verifyAssetTransferTxn(assetXfer, {
            xferAsset: this.ticketAsset.value,
            assetAmount: {
                greaterThanEqualTo: this.minTickets.value,
                lessThanEqualTo: this.maxTickets.value,
            },
            assetReceiver: this.app.address,
        });

        const loc = this.entryCount.value;
        this.entries(loc).value = this.txn.sender;
        this.entriesByAddress(this.txn.sender).value = this.entryCount.value;

        const amount = assetXfer.assetAmount;
        this.weights(loc / ChunkSize).value[loc % ChunkSize] = { amount: amount };

        this.entryCount.value += 1;
        this.ticketCount.value += amount;
    }

    add(payment: PayTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id === 0, errs.TICKET_ASSET_NOT_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);
        assert(this.entriesByAddress(this.txn.sender).exists, errs.ENTRY_DOES_NOT_EXIST);

        const loc = this.entriesByAddress(this.txn.sender).value;
        const amount = this.weights(loc / ChunkSize).value[loc % ChunkSize].amount;

        verifyPayTxn(payment, {
            amount: {
                greaterThanEqualTo: this.minTickets.value,
                lessThanEqualTo: (this.maxTickets.value - amount),
            },
            receiver: this.app.address,
        });

        this.weights(loc / ChunkSize).value[loc % ChunkSize].amount += payment.amount;
        this.ticketCount.value += amount;
    }

    addAsa(assetXfer: AssetTransferTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id !== 0, errs.TICKET_ASSET_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);
        assert(this.entriesByAddress(this.txn.sender).exists, errs.ENTRY_DOES_NOT_EXIST);

        const loc = this.entriesByAddress(this.txn.sender).value;
        const amount = this.weights(loc / ChunkSize).value[loc % ChunkSize].amount;

        verifyAssetTransferTxn(assetXfer, {
            xferAsset: this.ticketAsset.value,
            assetAmount: {
                greaterThanEqualTo: this.minTickets.value,
                lessThanEqualTo: (this.maxTickets.value - amount),
            },
            assetReceiver: this.app.address,
        });

        this.weights(loc / ChunkSize).value[loc % ChunkSize].amount += assetXfer.assetAmount;
        this.ticketCount.value += amount;
    }

    raffle(): void {
        const roundToUse = (this.endingRound.value + 1) + (4 * this.vrfGetFailureCount.value);
        assert(globals.round >= (roundToUse + 8), errs.NOT_ENOUGH_TIME);
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
        let upperBound = this.ticketCount.value;
        if (upperBound < MAX_UINT64) {
            upperBound = upperBound += 1;
        }

        const rngResult = pcg64Random(rngState, 1, upperBound, 1);
        this.winningTicket.value = rngResult[1][0];
    }

    findWinner(): void {
        assert(globals.round < this.endingRound.value, errs.RAFFLE_HAS_NOT_ENDED)
        assert(this.winningTicket.value !== 0, errs.NO_WINNING_TICKET_YET);
        const complete = this.entryCount.value === this.findWinnerCursor.value;
        assert(!complete, errs.WINNER_ALREADY_FOUND);

        // walk the index from the winner to find the
        const startingIndex = this.findWinnerCursor.value;
        const remainder = this.entryCount.value - this.findWinnerCursor.value;

        const iterationAmount = (remainder > MaxIterationsPerGroup)
            ? MaxIterationsPerGroup
            : remainder;

        let currentRangeStart = 1;
        let currentRangeEnd = 0;
        for (let i = startingIndex; i <= iterationAmount; i += 1) {
            if (globals.opcodeBudget < 100) {
                increaseOpcodeBudget()
            }

            const amount = this.weights(i / ChunkSize).value[i % ChunkSize].amount;

            currentRangeEnd = currentRangeStart + amount;
            if (this.winningTicket.value >= currentRangeStart && this.winningTicket.value <= currentRangeEnd) {
                this.raffleWinner.value = this.entries(i).value;
            }

            currentRangeStart = currentRangeEnd + 1;
        }

        this.findWinnerCursor.value += iterationAmount;
    }

    refundMBR(): void {
        const totalCap = (this.entryCount.value - 1);
        /** make sure we've already found the winner of the raffle */
        assert(totalCap === this.findWinnerCursor.value, errs.WINNER_NOT_FOUND);
        /** make sure we haven't already refunded all MBR */
        assert(totalCap !== this.refundMBRCursor.value, errs.ALL_REFUNDS_COMPLETE);

        const startingIndex = this.refundMBRCursor.value;
        const remainder = totalCap - this.refundMBRCursor.value;

        const iterationAmount = (remainder > MaxRefundIterationsPerGroup)
            ? MaxRefundIterationsPerGroup
            : remainder;

        for (let i = startingIndex; i < iterationAmount; i += 1) {
            if (globals.opcodeBudget < 100) {
                increaseOpcodeBudget()
            }

            const entry = this.entries(i).value;

            // free up the MBR
            this.entries(i).delete();
            this.entriesByAddress(entry).delete();

            sendPayment({
                receiver: entry,
                amount: entryTotalMBR,
                fee: 0,
            });
        }

        this.refundMBRCursor.value += iterationAmount;
    }

    claimRafflePrize(): void {
        assert(this.raffleWinner.value !== globals.zeroAddress, errs.WINNER_NOT_FOUND);
        assert(!this.rafflePrizeClaimed.value, errs.PRIZE_ALREADY_CLAIMED);

        let winnerAmount = 0;
        if (this.prize.value.id === 0) {
            winnerAmount = (this.app.address.balance - this.app.address.minBalance);
            if (this.prize.value === this.ticketAsset.value) {
                winnerAmount -= this.ticketCount.value;
            }

            sendPayment({
                receiver: this.raffleWinner.value,
                amount: winnerAmount,
                fee: 0,
            });
        } else {
            let shouldCloseTo = true;
            winnerAmount = this.app.address.assetBalance(this.prize.value);
            if (this.prize.value === this.ticketAsset.value) {
                winnerAmount -= this.ticketCount.value;
                shouldCloseTo = false;
            }

            if (this.raffleWinner.value.isOptedInToAsset(this.prize.value)) {
                if (shouldCloseTo) {
                    sendAssetTransfer({
                        assetReceiver: this.raffleWinner.value,
                        assetCloseTo: this.raffleWinner.value,
                        assetAmount: winnerAmount,
                        xferAsset: this.prize.value,
                        fee: 0,
                    });
                } else {
                    sendAssetTransfer({
                        assetReceiver: this.raffleWinner.value,
                        assetAmount: winnerAmount,
                        xferAsset: this.prize.value,
                        fee: 0,
                    });
                }
            } else {
                this.arc59OptInAndSend(
                    this.raffleWinner.value,
                    this.prize.value,
                    winnerAmount,
                    shouldCloseTo
                );
            }
        }

        if (this.ticketAsset.value.id === 0) {
            sendPayment({
                receiver: this.seller.value,
                amount: this.ticketCount.value,
                fee: 0,
            });
        } else {
            if (this.seller.value.isOptedInToAsset(this.ticketAsset.value)) {
                sendAssetTransfer({
                    assetReceiver: this.seller.value,
                    assetCloseTo: this.seller.value,
                    assetAmount: this.ticketCount.value,
                    xferAsset: this.ticketAsset.value,
                    fee: 0,
                });
            } else {
                this.arc59OptInAndSend(
                    this.seller.value,
                    this.ticketAsset.value,
                    this.ticketCount.value,
                    true
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
        assert(this.rafflePrizeClaimed.value, errs.PRIZE_NOT_CLAIMED);
        assert((this.entryCount.value - 1) !== this.refundMBRCursor.value, errs.ALL_REFUNDS_COMPLETE);
        assert(this.weightsBoxCount.value === 0, errs.STILL_HAS_WEIGHTS_BOXES);
    }

    getState(): RaffleState {
        return {
            ticketAsset: this.ticketAsset.value,
            startingRound: this.startingRound.value,
            endingRound: this.endingRound.value,
            seller: this.seller.value,
            minTickets: this.minTickets.value,
            maxTickets: this.maxTickets.value,
            entryCount: this.entryCount.value,
            ticketCount: this.ticketCount.value,
            winningTicket: this.winningTicket.value,
            raffleWinner: this.raffleWinner.value,
            prize: this.prize.value,
            rafflePrizeClaimed: this.rafflePrizeClaimed.value,
            gateID: this.gateID.value,
            vrfBeaconAppID: this.vrfBeaconAppID.value,
            vrfGetFailureCount: this.vrfGetFailureCount.value,
            entryID: this.entryID.value,
            findWinnerCursor: this.findWinnerCursor.value,
            refundMBRCursor: this.refundMBRCursor.value,
        }
    }
}