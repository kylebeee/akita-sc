import { ContractWithOptInCreatorOnly } from '../../utils/base_contracts/optin.algo';

const errs = {
    MUST_BE_CALLED_FROM_FACTORY: 'must be called from the factory',
}

export type Royalties = {
    creator: uint64,
    marketplace: uint64,
}

export class Listing extends ContractWithOptInCreatorOnly {
    /** the asset for sale */
    asset = GlobalStateKey<AssetID>({ key: 'asset' });
    /** the price of the asset */
    price = GlobalStateKey<uint64>({ key: 'price' });
    /** the asset to use for payment */
    paymentAsset = GlobalStateKey<AssetID>({ key: 'payment_asset' });
    /** the address selling the asset */
    seller = GlobalStateKey<Address>({ key: 'seller' });
    /* 
     * 
     * the address of the marketplace that listed the asset to send the fee to
     * 
     * IMPORTANT: this is a double sided marketplace fee contract
     * the marketplace referred to internally in the contract
     * is the listing side marketplace.
     * the buyer side marketplace provides their address at
     * the time of purchase
    */
    marketplace = GlobalStateKey<Address>({ key: 'marketplace' });
    /** the amount the creator will get for the sale */
    creatorAmount = GlobalStateKey<uint64>({ key: 'creator_amount' });
    /** the amount the seller will get for the sale */
    sellerAmount = GlobalStateKey<uint64>({ key: 'seller_amount' });
    /** the amount the marketplace will get for the sale */
    marketplaceAmount = GlobalStateKey<uint64>({ key: 'marketplace_amount' })
    /** the round the listing expires on */
    expiration = GlobalStateKey<uint64>({ key: 'expiration' });
    /** the address the sale is reserved for */
    reservedFor = GlobalStateKey<Address>({ key: 'reserved_for' });
    /** the gate ID to use to check if the user is qualified to buy */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' });

    /**
     * set the calculated amounts for each party
     * @param {uint64} price the listing sale price
     * @param {(uint64, uint64)} royalties the % the creator & marketplace should get of the sale
    */
    private calcAndSetPrices(price: uint64, royalties: Royalties): void {
        /** 
         * the extra - 1 & + 1 on these operations is to round to the ceiling
         * this means that when an extremely low unit price/asa is used
         * we dont accidentally take zero fees
         * on the other hand that means that in certain cases the fee may be a
         * higher % than what was set
        */
        const creatorAmount = (price * royalties.creator - 1) / 10000 + 1;
        this.creatorAmount.value = creatorAmount;

        const marketplaceAmount = (price * royalties.marketplace - 1) / 10000 + 1;
        this.marketplaceAmount.value = marketplaceAmount;

        const sellerAmount = price - (creatorAmount + (2 * marketplaceAmount));
        this.sellerAmount.value = sellerAmount;
    }

    /**
     * create the listing application
     * @param {uint64} asset the asa ID that is to be sold
     * @param {Address} seller the wallet of the account selling the asset
     * @param {uint64} price the price the asset should be sold for
     * @param {uint64} creatorRoyalties the royalty % for the asset creator
     * @param {uint64} marketplace the wallet that the listing fee should go to
     * @param {uint64} marketplaceRoyalties the % the marketplaces will split
     * @param {Address} reservedFor the address thats allowed to purchase
     * @param {uint64} gateID the gate ID to use to check if the user is qualified to buy
     * @throws {Error} - if the caller is not the factory
     */
    createApplication(
        asset: AssetID,
        seller: Address,
        price: uint64,
        paymentAsset: AssetID,
        creatorRoyalties: uint64,
        marketplace: Address,
        marketplaceRoyalties: uint64,
        reservedFor: Address,
        gateID: uint64,
    ): void {
        assert(globals.callerApplicationID !== AppID.fromUint64(0), errs.MUST_BE_CALLED_FROM_FACTORY)

        this.asset.value = asset;
        this.seller.value = seller;
        this.price.value = price;
        this.paymentAsset.value = paymentAsset;
        this.marketplace.value = marketplace;
        this.reservedFor.value = reservedFor;
        this.gateID.value = gateID;
        this.calcAndSetPrices(
            price,
            {
                creator: creatorRoyalties,
                marketplace: marketplaceRoyalties,
            }
        );
    }

    /**
     * 
     * @param {PayTxn} payment - the payment for purchasing the asset
     * @param {Address} marketPlaceSeller - the payment side marketplace address to pay for selling the asset
     * @throws {Error} - if the caller is not the reserved address
     * @throws {Error} - if the payment is not correct
     */
    @allow.call('DeleteApplication')
    purchase(
        payment: PayTxn,
        marketPlaceSeller: Address
    ): void {
        if (this.reservedFor.value !== globals.zeroAddress) {
            assert(this.txn.sender === this.reservedFor.value)
        }

        // if we decouple the caller & payment sender
        // then we effectively can create a system where
        // you can purchase an NFT on behalf of another
        verifyPayTxn(payment, {
            amount: this.price.value,
            receiver: this.app.address,
            closeRemainderTo: globals.zeroAddress,
            rekeyTo: globals.zeroAddress,
        })

        // transfer the purchase to the caller
        this.pendingGroup.addAssetTransfer({
            assetReceiver: this.txn.sender,
            assetAmount: this.app.address.assetBalance(this.asset.value),
            xferAsset: this.asset.value,
            fee: 0
        });

        // pay the creator their royalty
        this.pendingGroup.addPayment({
            amount: this.creatorAmount.value,
            receiver: this.asset.value.creator,
            fee: 0
        });

        // pay the listing side ui
        this.pendingGroup.addPayment({
            amount: this.marketplaceAmount.value,
            receiver: this.marketplace.value,
            fee: 0
        });

        // pay the seller side ui
        this.pendingGroup.addPayment({
            amount: this.marketplaceAmount.value,
            receiver: marketPlaceSeller,
            fee: 0,
        });

        // pay the seller
        this.pendingGroup.addPayment({
            closeRemainderTo: this.seller.value,
            fee: 0,
        });

        this.pendingGroup.submit();
    }

    /**
     * Deletes the app and returns the asset/mbr to the seller
     */
    @allow.call('DeleteApplication')
    delist(caller: Address): void {
        assert(this.txn.sender === globals.creatorAddress);
        assert(this.seller.value === caller);

        this.pendingGroup.addAssetTransfer({
            assetReceiver: this.seller.value,
            assetCloseTo: this.seller.value,
            assetAmount: this.app.address.assetBalance(this.asset.value),
            xferAsset: this.asset.value,
            fee: 0,
            isFirstTxn: true,
        });

        this.pendingGroup.addPayment({
            closeRemainderTo: this.seller.value,
            amount: this.app.address.balance,
            fee: 0,
        });

        this.pendingGroup.submit();
    }
}

// eslint-disable-next-line no-unused-vars
// export class AsaListing extends ListingBase {

//     paymentAsset = GlobalStateKey<AssetID>();

//     /**
//      * init sets up the terms of the listing
//      * 
//      * @param asset the asa ID that is to be sold
//      * @param seller the wallet of the account selling the asset
//      * @param price the price the asset should be sold for
//      * @param paymentAsset the asset used for purchase
//      * @param creatorRoyalties the royalty % for the asset creator
//      * @param marketplace the wallet that the listing fee should go to
//      * @param marketplaceRoyalties the % the marketplaces will split
//      * @param reservedFor the address thats allowed to purchase
//      */
//     init(
//         asset: AssetID,
//         seller: Address,
//         price: uint64,
//         paymentAsset: AssetID,
//         creatorRoyalties: uint64,
//         marketplace: Address,
//         marketplaceRoyalties: uint64,
//         reservedFor: Address,
//     ): void {
//         assert(this.txn.sender === globals.creatorAddress)

//         this.asset.value = asset;
//         this.seller.value = seller;
//         this.creator.value = asset.creator;
//         this.marketplace.value = marketplace;
//         this.price.value = price;
//         this.paymentAsset.value = paymentAsset;
//         this.reservedFor.value = reservedFor;
//         this.calcAndSetPrices(price, creatorRoyalties, marketplaceRoyalties);
//     }

//     /**
//      * Deletes the app and returns the asset/mbr to the seller
//      */
//     @allow.call('DeleteApplication')
//     delist(): void {
//         assert(this.txn.sender == this.seller.value);

//         this.pendingGroup.addAssetTransfer({
//             assetReceiver: this.seller.value,
//             assetCloseTo: this.seller.value,
//             assetAmount: this.app.address.assetBalance(this.asset.value),
//             xferAsset: this.asset.value,
//             fee: 0,
//             isFirstTxn: true,
//         });

//         if (!this.paidInAlgo()) {
//             // opt out of payment asset
//             this.pendingGroup.addAssetTransfer({
//                 assetReceiver: this.seller.value,
//                 assetCloseTo: this.seller.value,
//                 assetAmount: this.app.address.assetBalance(this.paymentAsset.value),
//                 xferAsset: this.paymentAsset.value,
//                 fee: 0,
//             });
//         }

//         this.pendingGroup.addPayment({
//             closeRemainderTo: this.seller.value,
//             amount: this.app.address.balance,
//             fee: 0,
//         });

//         this.pendingGroup.submit();
//     }

//     @allow.call('DeleteApplication')
//     purchase(
//         assetXfer: AssetTransferTxn,
//         marketPlaceSeller: Address
//     ): void {
//         if (this.reservedFor.value !== globals.zeroAddress) {
//             assert(this.txn.sender === this.reservedFor.value)
//         }

//         // if we decouple the caller & payment sender
//         // then we effectively can create a system where
//         // you can purchase an NFT on behalf of another
//         verifyAssetTransferTxn(assetXfer, {
//             assetAmount: this.price.value,
//             assetReceiver: this.app.address,
//             assetCloseTo: globals.zeroAddress,
//             rekeyTo: globals.zeroAddress,
//         })

//         // transfer the purchase to the caller
//         this.addAssetTransferWithRouterFallBack({
//             assetReceiver: this.txn.sender,
//             assetAmount: this.app.address.assetBalance(this.asset.value),
//             xferAsset: this.asset.value,
//             fee: 0
//         });

//         // pay the creator their royalty
//         this.addAssetTransferWithRouterFallBack({
//             assetAmount: this.creatorAmount.value,
//             assetReceiver: this.creator.value,
//             xferAsset: this.paymentAsset.value,
//             fee: 0
//         });

//         // pay the listing side ui
//         this.addAssetTransferWithRouterFallBack({
//             assetAmount: this.marketplaceAmount.value,
//             assetReceiver: this.marketplace.value,
//             xferAsset: this.paymentAsset.value,
//             fee: 0
//         });

//         // pay the seller side ui
//         this.addAssetTransferWithRouterFallBack({
//             assetAmount: this.marketplaceAmount.value,
//             assetReceiver: marketPlaceSeller,
//             xferAsset: this.paymentAsset.value,
//             fee: 0,
//         });

//         this.addAssetTransferWithRouterFallBack({
//             assetAmount: this.app.address.assetBalance(this.paymentAsset.value),
//             assetCloseTo: this.seller.value,
//             assetReceiver: this.seller.value,
//             xferAsset: this.paymentAsset.value,
//             fee: 0,
//         })

//         // pay the seller
//         this.pendingGroup.addPayment({
//             closeRemainderTo: this.seller.value,
//             fee: 0,
//         });

//         this.pendingGroup.submit();
//     }

//     /**
//      * 
//      * @returns whether the payment asset is algo
//      */
//     private paidInAlgo(): boolean {
//         return (this.paymentAsset.value === AssetID.fromUint64(0)) ? true : false;
//     }

//     /**
//      * 
//      * @param params general asset transfer params
//      */
//     private addAssetTransferWithRouterFallBack(params: {
//         xferAsset: AssetID;
//         assetAmount: uint64;
//         assetSender?: Address | undefined;
//         assetReceiver: Address;
//         assetCloseTo?: Address | undefined;
//         fee?: uint64 | undefined;
//         sender?: Address | undefined;
//         rekeyTo?: Address | undefined;
//         note?: string | undefined;
//     }): void {
//         // TODO: check if assetReceiver | assetCloseTo is opted in
//         this.pendingGroup.addAssetTransfer(params);
//         // TODO: if they're not opted send it to the ARC59 ASA Router
//     }
// }