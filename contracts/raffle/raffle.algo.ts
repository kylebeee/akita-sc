import { Contract } from "@algorandfoundation/tealscript";
import { pcg64Init, pcg64Random } from "../../utils/types/lib_pcg/pcg64.algo";
import { RandomnessBeacon } from "../../utils/types/vrf_beacon";
import { Gate } from "../gates/gate.algo";
import { AkitaAppIDsGate } from "../../utils/constants";
import { ContractWithOptInCreatorOnly } from "../../utils/base_contracts/optin.algo";
import { ContractWithOptInCreatorOnlyAndGate } from "../../utils/base_contracts/gate.algo";

const errs = {
    TOO_SHORT: 'Raffles cannot be less than one hour',
    CREATOR_ONLY: 'Only the creator of this app can call this method',
    NOT_LIVE: 'Raffle is not live',
    FAILED_GATE: 'Failed gate check',
    FAILED_TO_GET_SEED: 'Failed to get seed',
    INVALID_MBR_AMOUNT: 'Invalid mbr amount',
    INVALID_MBR_RECIPIENT: 'Invalid mbr recipient',
    INVALID_ASSET: 'Invalid asset',
    BELOW_MIN: 'Amount is below minimum',
    ABOVE_MAX: 'Amount is above maximum',
    INVALID_RECEIVER: 'Invalid receiver',
    ALREADY_ENTERED: 'You have already entered the raffle',
    NOT_ENDED: 'Raffle has not ended',
    NOT_ENOUGH_TIME: 'Not enough time has passed since the raffle ended',
    TICKET_ALREADY_FOUND: 'Winning ticket has already been found',
    ENTRY_DOES_NOT_EXIST: 'Entry does not exist',
    PRIZE_ALREADY_CLAIMED: 'Prize has already been claimed',
    BOXES_ARENT_CLEARED: 'Boxes are not cleared',
    PRIZE_NOT_CLAIMED: 'Prize has not been claimed',
    NO_WINNING_TICKET_YET: 'No winning ticket yet',
    TICKETS_NOT_RECLAIMED: 'Tickets have not been reclaimed',
}

const RANDOMNESS_BEACON_APPID_TESTNET: AppID = AppID.fromUint64(600011887);
const RANDOMNESS_BEACON_APPID_MAINNET: AppID = AppID.fromUint64(1615566206);

const ENTRY_MBR = 37_000;
const APPROX_ROUNDS_IN_ONE_HOUR = 1285;
const MAX_UINT64 = Uint<64>('18446744073709551615');

export type RaffleState = {
    entryID: uint64;
    entryCursor: uint64;
    entryCursorTotal: uint64;
    ticketAsset: AssetID;
    startingRound: uint64;
    endingRound: uint64;
    minTickets: uint64;
    maxTickets: uint64;
    entryCount: uint64;
    ticketCount: uint64;
    winningTicket: uint64;
    winningAddress: Address;
    prize: AssetID;
    prizeAmount: uint64;
    prizeClaimed: boolean;
}

export class Raffle extends ContractWithOptInCreatorOnlyAndGate {
    programVersion = 10;

    /** The id's of the raffle entries */
    entryID = GlobalStateKey<uint64>({ key: 'entry_ids' });
    /** The id cursor for cleaning up entries */
    entryCursor = GlobalStateKey<uint64>({ key: 'entry_cursor' });
    /** The total that the entry cursor has already checked */
    entryCursorTotal = GlobalStateKey<uint64>({ key: 'entry_cursor_total' });
    /** The asset required to enter the raffle */
    ticketAsset = GlobalStateKey<AssetID>({ key: 'ticket_asset' });
    /** The start round of the raffle as a unix timestamp */
    startingRound = GlobalStateKey<uint64>({ key: 'starting_round' });
    /** The end time of the raffle as a unix timestamp */
    endingRound = GlobalStateKey<uint64>({ key: 'ending_round' });
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
    winningAddress = GlobalStateKey<Address>({ key: 'winning_address' });
    /** the prize for the raffle */
    prize = GlobalStateKey<AssetID>({ key: 'prize' });
    /** the amount of the prize */
    prizeAmount = GlobalStateKey<uint64>({ key: 'prize_amount' });
    /** Indicator for whether the prize has been claimed */
    prizeClaimed = GlobalStateKey<boolean>({ key: 'prize_claimed' });
    /** the gate to use for the raffle */
    gateID = GlobalStateKey<uint64>({ key: 'gate' });

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
        ticketAsset: AssetID,
        startingRound: uint64,
        endingRound: uint64,
        minTickets: uint64,
        maxTickets: uint64,
        prize: AssetID,
        prizeAmount: uint64,
        gateID: uint64,
    ): void {
        this.entryID.value = 0;
        this.entryCursor.value = 0;
        this.entryCursorTotal.value = 0;
        this.ticketAsset.value = ticketAsset;
        this.startingRound.value = startingRound;
        assert(
            endingRound > startingRound
            && endingRound > (globals.round + APPROX_ROUNDS_IN_ONE_HOUR),
            errs.TOO_SHORT
        );
        this.endingRound.value = endingRound;
        this.minTickets.value = minTickets;
        this.maxTickets.value = maxTickets;
        this.entryCount.value = 0;
        this.ticketCount.value = 0;
        this.winningTicket.value = 0;
        this.winningAddress.value = Address.zeroAddress;
        this.prize.value = prize;
        this.prizeAmount.value = prizeAmount;
        this.prizeClaimed.value = false;
        this.gateID.value = gateID;
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

    enter(payment: PayTxn, assetXfer: AssetTransferTxn, args: bytes[]): void {
        assert(this.isLive(), errs.NOT_LIVE);
        assert(this.gate(this.gateID.value, args), errs.FAILED_GATE);

        verifyPayTxn(payment, {
            amount: ENTRY_MBR,
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
        const roundToUse = (this.endingRound.value + 1);
        assert(globals.round >= (roundToUse + 8), errs.NOT_ENOUGH_TIME);
        assert(this.winningTicket.value === 0, errs.TICKET_ALREADY_FOUND);

        const seed = sendMethodCall<typeof RandomnessBeacon.prototype.get, bytes>({
            applicationID: RANDOMNESS_BEACON_APPID_TESTNET,
            methodArgs: [ roundToUse, this.txn.txID ],
            fee: 0,
        });

        assert(seed.length > 0, errs.FAILED_TO_GET_SEED);

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
        assert(this.winningTicket.value > 0, errs.NO_WINNING_TICKET_YET);

        let groupIndex = 0;
        for (
            let i = this.entryCursor.value;
            i < this.entryCount.value || groupIndex === 15;
            i += 1
        ) {
            assert(this.entries(i).exists, errs.ENTRY_DOES_NOT_EXIST);
            groupIndex += 1;

            const entryAmount = this.entriesByAddress(this.entries(i).value).value;
            const isWinner = this.entryCursorTotal.value + entryAmount >= this.winningTicket.value;
                
            if (isWinner) {
                this.winningAddress.value = this.entries(i).value;
            }

            this.entriesByAddress(this.entries(i).value).delete();
            this.entries(i).delete();

            // return the users MBR
            sendPayment({
                receiver: this.entries(i).value,
                amount: ENTRY_MBR,
                fee: 0,
            });

            this.entryCursor.value = i;
            this.entryCursorTotal.value += entryAmount;
        }
    }

    claimPrize(): void {
        assert(!this.prizeClaimed.value, errs.PRIZE_ALREADY_CLAIMED);

        if (this.prize.value.id === 0) {
            sendPayment({
                receiver: this.winningAddress.value,
                amount: this.prizeAmount.value,
                fee: 0,
            });
        } else {
            sendAssetTransfer({
                assetSender: this.app.address,
                assetReceiver: this.winningAddress.value,
                assetAmount: this.prizeAmount.value,
                xferAsset: this.prize.value,
                fee: 0,
            });
        }

        this.prizeClaimed.value = true;
    }

    claimTickets(): void {
        assert(this.txn.sender === this.app.creator, errs.CREATOR_ONLY);
        assert(this.prizeClaimed.value, errs.PRIZE_NOT_CLAIMED);

        sendAssetTransfer({
            assetSender: this.app.address,
            assetReceiver: this.app.creator,
            assetAmount: this.app.address.assetBalance(this.ticketAsset.value),
            assetCloseTo: this.app.creator,
            xferAsset: this.ticketAsset.value,
            fee: 0,
        });
    }

    refund(): void {
        assert(this.winningTicket.value === 0, errs.NO_WINNING_TICKET_YET);
        assert(globals.round > this.endingRound.value + 1285, errs.NOT_ENOUGH_TIME);

        let groupIndex = 0;
        for (
            let i = this.entryCursor.value;
            i < this.entryCount.value || groupIndex === 15;
            i += 1
        ) {
            assert(this.entries(i).exists, errs.ENTRY_DOES_NOT_EXIST);
            groupIndex += 1;

            const entryAmount = this.entriesByAddress(this.entries(i).value).value;

            if (this.ticketAsset.value.id === 0) {
                sendPayment({
                    receiver: this.entries(i).value,
                    amount: ENTRY_MBR + entryAmount,
                    fee: 0,
                });
            } else {
                this.pendingGroup.addAssetTransfer({
                    assetSender: this.app.address,
                    assetReceiver: this.entries(i).value,
                    assetAmount: entryAmount,
                    xferAsset: this.ticketAsset.value,
                    fee: 0,
                });

                this.pendingGroup.addPayment({
                    receiver: this.entries(i).value,
                    amount: ENTRY_MBR,
                    fee: 0,
                });

                this.pendingGroup.submit();
            }

            this.entriesByAddress(this.entries(i).value).delete();
            this.entries(i).delete();

            this.entryCursor.value = i;
            this.entryCursorTotal.value += entryAmount;
        }

        if (this.entryCursor.value === this.entryCount.value) {
            this.pendingGroup.addAssetTransfer({
                assetSender: this.app.address,
                assetReceiver: this.app.creator,
                assetAmount: this.app.address.assetBalance(this.prize.value),
                assetCloseTo: this.app.creator,
                xferAsset: this.prize.value,
                fee: 0, 
            });

            this.pendingGroup.addPayment({
                receiver: this.app.creator,
                amount: this.app.address.balance,
                closeRemainderTo: this.app.creator,
                fee: 0,
            });
        }
    }

    deleteApplication(): void {
        assert(this.txn.sender === this.app.creator, errs.CREATOR_ONLY);
        assert(this.entryCursor.value === this.entryCount.value, errs.BOXES_ARENT_CLEARED);
        assert(this.prizeClaimed.value, errs.PRIZE_NOT_CLAIMED);
        assert(this.app.address.assetBalance(this.ticketAsset.value) === 0, errs.TICKETS_NOT_RECLAIMED);
    }

    getState(): RaffleState {
        return {
            entryID: this.entryID.value,
            entryCursor: this.entryCursor.value,
            entryCursorTotal: this.entryCursorTotal.value,
            ticketAsset: this.ticketAsset.value,
            startingRound: this.startingRound.value,
            endingRound: this.endingRound.value,
            minTickets: this.minTickets.value,
            maxTickets: this.maxTickets.value,
            entryCount: this.entryCount.value,
            ticketCount: this.ticketCount.value,
            winningTicket: this.winningTicket.value,
            winningAddress: this.winningAddress.value,
            prize: this.prize.value,
            prizeAmount: this.prizeAmount.value,
            prizeClaimed: this.prizeClaimed.value,
        }
    }
}