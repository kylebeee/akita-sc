import { pcg64Init, pcg64Random } from "../../utils/types/lib_pcg/pcg64.algo";
import { RandomnessBeacon } from "../../utils/types/vrf_beacon";
import { MAX_UINT64 } from "../../utils/constants";
import { ContractWithOptInCreatorOnlyArc59AndGate } from "../../utils/base_contracts/gate.algo";

const errs = {
    TOO_SHORT: 'Raffles cannot be less than one hour',
    CREATOR_ONLY: 'Only the creator of this app can call this method',
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
    PRIZE_ALREADY_CLAIMED: 'Prize has already been claimed',
    BOXES_ARENT_CLEARED: 'Boxes are not cleared',
    PRIZE_NOT_CLAIMED: 'Prize has not been claimed',
    NO_WINNING_TICKET_YET: 'No winning ticket yet',
    TICKETS_NOT_RECLAIMED: 'Tickets have not been reclaimed',
}

// const RANDOMNESS_BEACON_APPID_TESTNET: AppID = AppID.fromUint64(600011887);
// const RANDOMNESS_BEACON_APPID_MAINNET: AppID = AppID.fromUint64(1615566206);

const entriesByAddressMBR = 18_500;
export const entryMBR = 18_500 + entriesByAddressMBR;
const roundsPerHour = 1285;

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
    findWinnerTotalCursor: uint64;
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
    /** 
     * when we go through the participants for the raffle
     * it may take multiple groups of txns so we have a variable
     * for tracking how far through the list we are
    */
    findWinnerCursor = GlobalStateKey<uint64>({ key: 'find_winner_cursor' });
    /** tracks sum iterated over during find raffle loop */
    findWinnerTotalCursor = GlobalStateKey<uint64>({ key: 'find_winner_total_cursor' });
    /**
     * The entries for the raffle
     * 
     * 2_500 + (400 * (8 + 32)) = 18_500
     */
    entries = BoxMap<uint64, Address>();
    
    /** 
     * The address map of entries for the raffle
     * 
     * 2_500 + (400 * (32 + 8)) = 18_500
     * 
    */
    entriesByAddress = BoxMap<Address, uint64>();

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
        this.findWinnerTotalCursor.value = 0;
    }

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

    enter(payment: PayTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id === 0, errs.TICKET_ASSET_NOT_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);

        verifyPayTxn(payment, {
            amount: {
                greaterThanEqualTo: this.minTickets.value + entryMBR,
                lessThanEqualTo: this.maxTickets.value + entryMBR,
            },
            receiver: this.app.address,
        });

        assert(!this.entriesByAddress(this.txn.sender).exists, errs.ALREADY_ENTERED)

        this.entries(this.entryCount.value).value = this.txn.sender;
        this.entriesByAddress(this.txn.sender).value = this.entryCount.value;
        this.entryCount.value += 1;
        this.ticketCount.value += payment.amount - entryMBR;
    }    

    enterAsa(payment: PayTxn, assetXfer: AssetTransferTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.ticketAsset.value.id !== 0, errs.TICKET_ASSET_ALGO)
        assert(this.gate(this.txn.sender, this.gateID.value, args), errs.FAILED_GATE);

        verifyPayTxn(payment, {
            amount: entryMBR,
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

        assert(!this.entriesByAddress(this.txn.sender).exists, errs.ALREADY_ENTERED)

        this.entries(this.entryCount.value).value = this.txn.sender;
        this.entriesByAddress(this.txn.sender).value = this.entryCount.value;
        this.entryCount.value += 1;
        this.ticketCount.value += assetXfer.assetAmount;
    }

    raffle(): void {
        const roundToUse = (this.endingRound.value + 1) + (4 * this.vrfGetFailureCount.value);
        assert(globals.round >= (roundToUse + 8), errs.NOT_ENOUGH_TIME);
        assert(this.winningTicket.value === 0, errs.WINNER_ALREADY_DRAWN);

        const seed = sendMethodCall<typeof RandomnessBeacon.prototype.get, bytes>({
            applicationID: this.vrfBeaconAppID.value,
            methodArgs: [ roundToUse, this.txn.txID ],
            fee: 0,
        });

        if (seed.length === 0) {
            this.vrfGetFailureCount.value += 1;
            return;
        }

        let rngState = pcg64Init(substring3(seed, 0, 16) as bytes<16>);

        let upperBound = this.ticketCount.value;
        if (upperBound < MAX_UINT64) {
            upperBound = upperBound += 1;
        }

        const rngResult = pcg64Random(rngState, 1, upperBound, 1);
        const winningTicket = rngResult[1][0];

        this.winningTicket.value = winningTicket;
    }

    findWinner(): void {
        assert(globals.round < this.endingRound.value, errs.RAFFLE_HAS_NOT_ENDED)
        assert(this.winningTicket.value > 0, errs.NO_WINNING_TICKET_YET);
        const complete = this.entryID.value === this.findWinnerCursor.value;
        assert(!complete, errs.WINNER_ALREADY_FOUND);

        // walk the index from the winner to find the
        const startingIndex = this.findWinnerCursor.value;
        const remainder = this.entryID.value - this.findWinnerCursor.value;
        // at most with calling this (15 * 4) / 2 because of box reference limits
        const iterationAmount = (remainder > 30) ? 30 : remainder;

        for (let i = startingIndex; i < iterationAmount; i += 1) {
            const address = this.entries(i).value;
            const amt = this.entriesByAddress(address).value;

            this.entries(i).delete();
            this.entriesByAddress(address).delete();

            // return the users MBR
            sendPayment({
                receiver: address,
                amount: entryMBR,
                fee: 0,
            });

            const isWinner = this.findWinnerTotalCursor.value + amt >= this.winningTicket.value;
            if (isWinner) {
                this.raffleWinner.value = address;
            }

            this.findWinnerTotalCursor.value += amt;
        }

        this.findWinnerCursor.value = iterationAmount;
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

    deleteApplication(): void {
        assert(this.txn.sender === this.app.creator, errs.CREATOR_ONLY);
        assert(this.rafflePrizeClaimed.value, errs.PRIZE_NOT_CLAIMED);
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
            findWinnerTotalCursor: this.findWinnerTotalCursor.value
        }
    }
}