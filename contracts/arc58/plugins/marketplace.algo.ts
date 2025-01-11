import { Contract } from '@algorandfoundation/tealscript';
import { Marketplace } from '../../marketplace/marketplace.algo';
import { Listing } from '../../marketplace/listing.algo';
import { AKITA_LISTING_PAYMENT_ASSET_KEY, AKITA_LISTING_PRICE_KEY } from '../../marketplace/constants';

const errs = {
    NOT_ENOUGH_ASSET: 'Not enough asset',
    CREATOR_NOT_AUCTION_FACTORY: 'Creator is not the auction factory',
    LISTING_CREATOR_NOT_MARKETPLACE: 'Creator is not the marketplace'
};

export class MarketplacePlugin extends Contract {
    programVersion = 10;

    /** the app id of the auction factory contract */
    factoryAppID = TemplateVar<AppID>();

    list(
        sender: AppID,
        rekeyBack: boolean,
        asset: AssetID,
        assetAmount: uint64,
        price: uint64,
        paymentAsset: AssetID,
        name: string,
        proof: bytes<32>[],
        marketplace: Address,
        marketplaceRoyalties: uint64,
        expirationRound: uint64,
        reservedFor: Address,
        gateID: uint64,
    ): AppID {
        assert(sender.address.assetBalance(asset) >= assetAmount, errs.NOT_ENOUGH_ASSET);

        const needsToOptIntoAsset = !this.factoryAppID.address.isOptedInToAsset(asset);

        if (needsToOptIntoAsset) {
            this.pendingGroup.addMethodCall<typeof Marketplace.prototype.optin, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: this.factoryAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    asset
                ],
                fee: 0,
                isFirstTxn: true
            });
        }

        const needsToOptIntoPaymentAsset = !this.factoryAppID.address.isOptedInToAsset(paymentAsset);

        if (needsToOptIntoPaymentAsset) {
            this.pendingGroup.addMethodCall<typeof Marketplace.prototype.optin, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: this.factoryAppID.address,
                        amount: globals.assetOptInMinBalance,
                        fee: 0,
                    },
                    paymentAsset
                ],
                fee: 0,
                isFirstTxn: !needsToOptIntoAsset
            });
        }

        const optinMBR = (paymentAsset.id === 0)
            ? (globals.assetOptInMinBalance)
            : (globals.assetOptInMinBalance * 2);
    
        let childContractMBR = (
            100_000
            + (28_500 * Listing.schema.global.numUint)
            + (50_000 * Listing.schema.global.numByteSlice)
            + optinMBR
        );

        this.pendingGroup.addMethodCall<typeof Marketplace.prototype.list, AppID>({
            sender: sender.address,
            applicationID: this.factoryAppID,
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: this.factoryAppID.address,
                    amount: childContractMBR,
                    fee: 0,
                },
                {
                    sender: sender.address,
                    assetReceiver: this.factoryAppID.address,
                    assetAmount: assetAmount,
                    xferAsset: asset,
                    fee: 0,
                },
                price,
                paymentAsset,
                name,
                proof,
                marketplace,
                marketplaceRoyalties,
                expirationRound,
                reservedFor,
                gateID,
            ],
            approvalProgram: Listing.approvalProgram(),
            clearStateProgram: Listing.clearProgram(),
            globalNumUint: Listing.schema.global.numUint,
            globalNumByteSlice: Listing.schema.global.numByteSlice,
            extraProgramPages: 0,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
            isFirstTxn: !needsToOptIntoAsset && !needsToOptIntoPaymentAsset,
        });

        this.pendingGroup.submit();

        return this.itxn.createdApplicationID;
    }

    purchase(
        sender: AppID,
        rekeyBack: boolean,
        listingAppID: AppID,
        marketplace: Address,
        args: bytes[]
    ): void {
        assert(listingAppID.creator === this.factoryAppID.address, errs.LISTING_CREATOR_NOT_MARKETPLACE);

        const price = listingAppID.globalState(AKITA_LISTING_PRICE_KEY) as uint64;
        const paymentAsset = listingAppID.globalState(AKITA_LISTING_PAYMENT_ASSET_KEY) as AssetID;

        if (paymentAsset.id === 0) {
            sendMethodCall<typeof Marketplace.prototype.purchase, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        receiver: this.factoryAppID.address,
                        amount: price,
                        fee: 0,
                    },
                    listingAppID,
                    marketplace,
                    args
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        } else {
            sendMethodCall<typeof Marketplace.prototype.purchaseAsa, void>({
                sender: sender.address,
                applicationID: this.factoryAppID,
                methodArgs: [
                    {
                        sender: sender.address,
                        assetReceiver: this.factoryAppID.address,
                        assetAmount: price,
                        xferAsset: paymentAsset,
                    },
                    listingAppID,
                    marketplace,
                    args
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        }
    }

    changePrice(sender: AppID, rekeyBack: boolean, listingAppID: AppID, price: uint64): void {
        assert(listingAppID.creator === this.factoryAppID.address, errs.LISTING_CREATOR_NOT_MARKETPLACE);
        
        sendMethodCall<typeof Listing.prototype.changePrice, void>({
            sender: sender.address,
            applicationID: listingAppID,
            methodArgs: [ price ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    delist(sender: AppID, rekeyBack: boolean, listingAppID: AppID): void {
        assert(listingAppID.creator === this.factoryAppID.address, errs.LISTING_CREATOR_NOT_MARKETPLACE);
        
        sendMethodCall<typeof Marketplace.prototype.delist, void>({
            sender: sender.address,
            applicationID: listingAppID,
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }
}