import { Contract } from '@algorandfoundation/tealscript';
import { RaffleFactory } from '../../raffle/raffle_factory.algo';
import { entryMBR, Raffle } from '../../raffle/raffle.algo';
import { AKITA_RAFFLE_TICKET_ASSET_KEY } from '../../raffle/contants';

const errs = {
    NOT_ENOUGH_ASSET: 'not enough asset',
    CREATOR_NOT_RAFFLE_FACTORY: 'Creator is not the raffle factory'
}

export class RafflePlugin extends Contract {

    /** the app id of the raffle factory contract */
    factoryAppID = TemplateVar<AppID>();

    new(
        sender: AppID,
        rekeyBack: boolean,
        prize: AssetID,
        prizeAmount: uint64,
        ticketAsset: AssetID,
        startingRound: uint64,
        endingRound: uint64,
        minTickets: uint64,
        maxTickets: uint64,
        gateID: uint64,
    ): AppID {
        assert(sender.address.assetBalance(prize) >= prizeAmount, errs.NOT_ENOUGH_ASSET);

        const needsToOptIntoPrize = !this.factoryAppID.address.isOptedInToAsset(prize);

        if (needsToOptIntoPrize) {
            this.pendingGroup.addMethodCall<typeof RaffleFactory.prototype.optin, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: this.factoryAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    prize
                ],
                fee: 0,
                isFirstTxn: true
            });
        }

        let optinMBR = 0;
        const prizeAssetIsAlgo = prize.id === 0;
        if (prizeAssetIsAlgo) {
            optinMBR = globals.assetOptInMinBalance;
        }

        const ticketAssetIsAlgo = ticketAsset.id === 0;
        if (ticketAssetIsAlgo) {
            optinMBR += globals.assetOptInMinBalance;
        }

        let mbrAmount = (
            100_000 // requires 3 extra pages
            + (28_500 * Raffle.schema.global.numUint)
            + (50_000 * Raffle.schema.global.numByteSlice)
            + optinMBR
        );

        this.pendingGroup.addMethodCall<typeof RaffleFactory.prototype.new, AppID>({
            sender: sender.address,
            applicationID: this.factoryAppID,
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: this.factoryAppID.address,
                    amount: mbrAmount,
                    fee: 0
                },
                {
                    sender: sender.address,
                    assetReceiver: this.factoryAppID.address,
                    assetAmount: prizeAmount,
                    xferAsset: prize,
                    fee: 0,
                },
                ticketAsset,
                startingRound,
                endingRound,
                minTickets,
                maxTickets,
                gateID,
            ],
        });

        this.pendingGroup.submit();
        
        return this.itxn.createdApplicationID;
    }

    enter(sender: AppID, rekeyBack: boolean, raffleAppID: AppID, amount: uint64, args: bytes[]): void {
        assert(raffleAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_RAFFLE_FACTORY);

        const ticketAsset = raffleAppID.globalState(AKITA_RAFFLE_TICKET_ASSET_KEY) as AssetID;

        if (ticketAsset.id === 0) {
            sendMethodCall<typeof Raffle.prototype.enter, void>({
                sender: sender.address,
                applicationID: raffleAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: raffleAppID.address,
                        amount: amount,
                        fee: 0,
                    },
                    args,
                ],
                rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
                fee: 0
            });
        } else {
            sendMethodCall<typeof Raffle.prototype.enterAsa, void>({
                sender: sender.address,
                applicationID: raffleAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: raffleAppID.address,
                        amount: entryMBR,
                        fee: 0,
                    },
                    {
                        sender: sender.address,
                        assetReceiver: raffleAppID.address,
                        assetAmount: amount,
                        xferAsset: ticketAsset,
                        fee: 0,
                    },
                    args,
                ],
                rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
                fee: 0
            });
        }
    }

    raffle(sender: AppID, rekeyBack: boolean, raffleAppID: AppID): void {
        assert(raffleAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_RAFFLE_FACTORY);

        sendMethodCall<typeof Raffle.prototype.raffle>({
            sender: sender.address,
            applicationID: raffleAppID,
            rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
            fee: 0,
        });
    }

    findWinner(sender: AppID, rekeyBack: boolean, raffleAppID: AppID): void {
        assert(raffleAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_RAFFLE_FACTORY);

        sendMethodCall<typeof Raffle.prototype.findWinner>({
            sender: sender.address,
            applicationID: raffleAppID,
            rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
            fee: 0,
        });
    }

    claimRafflePrize(sender: AppID, rekeyBack: boolean, raffleAppID: AppID): void {
        assert(raffleAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_RAFFLE_FACTORY);

        sendMethodCall<typeof Raffle.prototype.claimRafflePrize>({
            sender: sender.address,
            applicationID: raffleAppID,
            rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
            fee: 0,
        });
    }

    deleteRaffleApplication(sender: AppID, rekeyBack: boolean, raffleAppID: AppID): void {
        assert(raffleAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_RAFFLE_FACTORY);
        
        sendMethodCall<typeof Raffle.prototype.deleteApplication>({
            sender: sender.address,
            applicationID: raffleAppID,
            rekeyTo: rekeyBack ? sender.address : globals.zeroAddress,
            fee: 0,
        });
    }
}