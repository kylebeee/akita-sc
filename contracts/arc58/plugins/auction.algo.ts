import { Contract } from '@algorandfoundation/tealscript';
import { appCreatorsMBR, AuctionFactory } from '../../auction/auction_factory.algo';
import { Auction, bidMBR, weightsListMBR } from '../../auction/auction.algo';
import { AKITA_AUCTION_BID_ASSET_KEY } from '../../auction/constants';

const errs = {
    AUCTION_PRIZE_CANNOT_BE_ALGO: 'auction prize cannot be algo',
    NOT_ENOUGH_ASSET: 'Not enough asset',
    CREATOR_NOT_AUCTION_FACTORY: 'Creator is not the auction factory'
}

export class AuctionPlugin extends Contract {
    programVersion = 10;

    /** the app id of the auction factory contract */
    factoryAppID = TemplateVar<AppID>();

    new(
        sender: AppID,
        rekeyBack: boolean,
        prize: AssetID,
        prizeAmount: uint64,
        name: string,
        proof: bytes<32>[],
        bidAsset: AssetID,
        bidFee: uint64,
        startingBid: uint64,
        bidMinimumIncrease: uint64,
        startingRound: uint64,
        endingRound: uint64,
        marketplace: Address,
        gateID: uint64,
        weightsListCount: uint64,
    ): AppID {
        assert(prize.id !== 0, errs.AUCTION_PRIZE_CANNOT_BE_ALGO);
        assert(sender.address.assetBalance(prize) >= prizeAmount, errs.NOT_ENOUGH_ASSET);

        const needsToOptIntoPrize = !this.factoryAppID.address.isOptedInToAsset(prize);

        if (needsToOptIntoPrize) {
            this.pendingGroup.addMethodCall<typeof AuctionFactory.prototype.optin, void>({
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

        const needsToOptIntoBidAsset = !this.factoryAppID.address.isOptedInToAsset(bidAsset);

        if (needsToOptIntoBidAsset) {
            this.pendingGroup.addMethodCall<typeof AuctionFactory.prototype.optin, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: this.factoryAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    bidAsset
                ],
                fee: 0,
                isFirstTxn: !needsToOptIntoPrize
            });
        }

        const optinMBR = (bidAsset.id === 0)
            ? (globals.assetOptInMinBalance)
            : (globals.assetOptInMinBalance * 2);

        let childContractMBR = (
            100_000
            + (28_500 * Auction.schema.global.numUint)
            + (50_000 * Auction.schema.global.numByteSlice)
            + optinMBR
            + weightsListCount * weightsListMBR
            + appCreatorsMBR
        );

        this.pendingGroup.addMethodCall<typeof AuctionFactory.prototype.new, AppID>({
            sender: sender.address,
            applicationID: this.factoryAppID,
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: this.factoryAppID.address,
                    amount: childContractMBR,
                    fee: 0
                },
                {
                    sender: sender.address,
                    assetReceiver: sender.address,
                    assetAmount: prizeAmount,
                    xferAsset: prize,
                    fee: 0
                },
                name,
                proof,
                bidAsset,
                bidFee,
                startingBid,
                bidMinimumIncrease,
                startingRound,
                endingRound,
                marketplace,
                gateID,
                weightsListCount
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
            isFirstTxn: !needsToOptIntoPrize && !needsToOptIntoBidAsset
        });

        this.pendingGroup.submit();
        
        return this.itxn.createdApplicationID;
    }

    clearWeightsBoxes(
        sender: AppID,
        rekeyBack: boolean,
        creator: Address,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof AuctionFactory.prototype.clearWeightsBoxes>({
            sender: sender.address,
            applicationID: this.factoryAppID,
            methodArgs: [
                creator,
                auctionAppID
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }
    
    deleteAuctionApp(
        sender: AppID,
        rekeyBack: boolean,
        creator: Address,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof AuctionFactory.prototype.deleteAuctionApp>({
            sender: sender.address,
            applicationID: this.factoryAppID,
            methodArgs: [
                creator,
                auctionAppID
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    bid(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID,
        amount: uint64,
        marketplace: Address
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        const bidAsset = auctionAppID.globalState(AKITA_AUCTION_BID_ASSET_KEY) as AssetID;

        if (bidAsset.id === 0) {
            sendMethodCall<typeof Auction.prototype.bid>({
                sender: sender.address,
                applicationID: auctionAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: auctionAppID.address,
                        amount: amount + bidMBR,
                        fee: 0,
                    },
                    marketplace
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        } else {
            sendMethodCall<typeof Auction.prototype.bidAsa>({
                sender: sender.address,
                applicationID: auctionAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: auctionAppID.address,
                        amount: amount + bidMBR,
                        fee: 0,
                    },
                    {
                        sender: sender.address,
                        assetAmount: amount,
                        xferAsset: bidAsset,
                        assetReceiver: auctionAppID.address,
                    },
                    marketplace
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        }
    }

    refundBid(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID,
        id: uint64
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.refundBid>({
            sender: sender.address,
            applicationID: auctionAppID,
            methodArgs: [id],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    claimPrize(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.claimPrize>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    claimRafflePrize(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.claimRafflePrize>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    raffle(sender: AppID, rekeyBack: boolean, auctionAppID: AppID): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.raffle>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    findWinner(sender: AppID, rekeyBack: boolean, auctionAppID: AppID): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.findWinner>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    deleteApplication(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.deleteApplication>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    cancel(
        sender: AppID,
        rekeyBack: boolean,
        auctionAppID: AppID
    ): void {
        assert(auctionAppID.creator === this.factoryAppID.address, errs.CREATOR_NOT_AUCTION_FACTORY);

        sendMethodCall<typeof Auction.prototype.cancel>({
            sender: sender.address,
            applicationID: auctionAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }
}