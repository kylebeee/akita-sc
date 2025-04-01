import { ContractWithOptInCreatorOnlyArc59AndGate } from '../../utils/base_contracts/gate.algo'
import { AkitaAppIDsAkitaSocialImpactPlugin } from '../../utils/constants'
import { RoyaltyAmounts } from '../../utils/types/royalties'
import { AkitaSocialImpact } from '../arc58/plugins/social/impact.algo'
import {
    AKITA_MARKETPLACE_COMPOSABLE_PERCENTAGE_KEY,
    AKITA_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM_KEY,
    AKITA_MARKETPLACE_SALE_PERCENTAGE_MINIMUM_KEY,
} from '../dao/constants'

const errs = {
    MUST_BE_CALLED_FROM_FACTORY: 'must be called from the factory',
    INVALID_EXPIRATION_ROUND: 'invalid expiration round',
    PAYMENT_ASSET_MUST_BE_ALGO: 'payment asset must be algo',
    LISTING_EXPIRED: 'listing expired',
    ONLY_SELLER_CAN_DELIST: 'only the seller can delist',
    FAILED_GATE: 'gate check failed',
    RESERVED_FOR_DIFFERENT_ADDRESS: 'reserved for different address',
    MUST_BE_SELLER: 'must be the seller',
}

export type Royalties = {
    creator: uint64
    marketplace: uint64
}

export class Listing extends ContractWithOptInCreatorOnlyArc59AndGate {
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = GlobalStateKey<AppID>({ key: 'akita_dao_app_id' })

    /** the asset for sale */
    asset = GlobalStateKey<AssetID>({ key: 'asset' })

    /** the price of the asset */
    price = GlobalStateKey<uint64>({ key: 'price' })

    /** the asset to use for payment */
    paymentAsset = GlobalStateKey<AssetID>({ key: 'payment_asset' })

    /** the address selling the asset */
    seller = GlobalStateKey<Address>({ key: 'seller' })

    /**
     * The address of the marketplace that listed the asset to send the fee to
     *
     * IMPORTANT: this is a double sided marketplace fee contract
     * the marketplace referred to internally in the contract
     * is the listing side marketplace.
     * the buyer side marketplace provides their address at
     * the time of purchase
     */
    marketplace = GlobalStateKey<Address>({ key: 'marketplace' })

    /** the amount the creator will get for the sale */
    creatorRoyalty = GlobalStateKey<uint64>({ key: 'creator_royalty' })

    /** the amount the marketplace will get for the sale */
    marketplaceRoyalties = GlobalStateKey<uint64>({ key: 'marketplace_royalties' })

    /** the round the listing expires on, once this passes all that can be done is delist */
    expirationRound = GlobalStateKey<uint64>({ key: 'expiration_round' })

    /** the address the sale is reserved for */
    reservedFor = GlobalStateKey<Address>({ key: 'reserved_for' })

    /** the gate ID to use to check if the user is qualified to buy */
    gateID = GlobalStateKey<uint64>({ key: 'gate_id' })

    /**
     *
     * @returns whether the payment asset is algo
     */
    private paidInAlgo(): boolean {
        return this.paymentAsset.value === AssetID.fromUint64(0)
    }

    private getUserImpact(address: Address): uint64 {
        return sendMethodCall<typeof AkitaSocialImpact.prototype.getUserImpact, uint64>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [address],
            fee: 0,
        })
    }

    private getAmounts(amount: uint64): RoyaltyAmounts {
        let creatorAmount = wideRatio([amount, this.creatorRoyalty.value], [10000])
        if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
            creatorAmount = 1
        }

        const minTax = this.akitaDaoAppID.value.globalState(AKITA_MARKETPLACE_SALE_PERCENTAGE_MINIMUM_KEY) as uint64
        const maxTax = this.akitaDaoAppID.value.globalState(AKITA_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM_KEY) as uint64
        const impact = this.getUserImpact(this.seller.value)
        const akitaTaxRate = maxTax - wideRatio([maxTax - minTax, impact - 1], [999])

        let akitaAmount = wideRatio([amount, akitaTaxRate], [10000])
        if (akitaAmount === 0 && amount > 0) {
            akitaAmount = 1
        }

        const marketplaceTaxRate = this.akitaDaoAppID.value.globalState(
            AKITA_MARKETPLACE_COMPOSABLE_PERCENTAGE_KEY
        ) as uint64

        let marketplaceAmount = wideRatio([amount, marketplaceTaxRate], [10000])
        if (marketplaceAmount === 0 && this.marketplaceRoyalties.value > 0 && amount > 0) {
            marketplaceAmount = 1
        }

        const sellerAmount = this.price.value - (creatorAmount + akitaAmount + 2 * marketplaceAmount)

        return {
            creator: creatorAmount,
            marketplace: marketplaceAmount,
            seller: sellerAmount,
        }
    }

    private transferPurchaseToBuyer(buyer: Address): void {
        // transfer asa to buyer
        if (buyer.isOptedInToAsset(this.asset.value)) {
            // transfer the purchase to the caller & opt out of the asset
            sendAssetTransfer({
                assetCloseTo: buyer,
                assetReceiver: buyer,
                assetAmount: this.app.address.assetBalance(this.asset.value),
                xferAsset: this.asset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(buyer, this.asset.value, this.app.address.assetBalance(this.asset.value), true)
        }
    }

    private completeAlgoPayments(marketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(this.price.value)

        // pay the creator
        sendPayment({
            amount: amounts.creator,
            receiver: this.asset.value.creator,
            fee: 0,
        })

        // pay listing marketplace
        sendPayment({
            amount: amounts.marketplace,
            receiver: this.marketplace.value,
            fee: 0,
        })

        // pay buying marketplace
        sendPayment({
            amount: amounts.marketplace,
            receiver: marketplace,
            fee: 0,
        })

        // pay the seller
        sendPayment({
            closeRemainderTo: this.seller.value,
            amount: amounts.seller,
            fee: 0,
            note: this.asset.value.name + ' Sold',
        })
    }

    private completeAsaPayments(marketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(this.price.value)

        // pay the creator
        if (this.asset.value.creator.isOptedInToAsset(this.paymentAsset.value)) {
            sendAssetTransfer({
                assetReceiver: this.asset.value.creator,
                assetAmount: amounts.creator,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(this.asset.value.creator, this.paymentAsset.value, amounts.creator, false)
        }

        // pay listing marketplace
        if (this.marketplace.value.isOptedInToAsset(this.paymentAsset.value)) {
            sendAssetTransfer({
                assetReceiver: this.marketplace.value,
                assetAmount: amounts.marketplace,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(this.marketplace.value, this.paymentAsset.value, amounts.marketplace, false)
        }

        // pay buying marketplace
        if (marketplace.isOptedInToAsset(this.paymentAsset.value)) {
            sendAssetTransfer({
                assetReceiver: marketplace,
                assetAmount: amounts.marketplace,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(marketplace, this.paymentAsset.value, amounts.marketplace, false)
        }

        // pay seller
        if (this.seller.value.isOptedInToAsset(this.paymentAsset.value)) {
            sendAssetTransfer({
                assetCloseTo: this.seller.value,
                assetReceiver: this.seller.value,
                assetAmount: amounts.seller,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(this.seller.value, this.paymentAsset.value, amounts.seller, true)
        }

        // pay the seller
        sendPayment({
            closeRemainderTo: this.seller.value,
            fee: 0,
        })
    }

    /**
     * create the listing application
     * @param {AppID} akitaDaoAppID the app ID of the Akita DAO
     * @param {uint64} asset the asa ID that is to be sold
     * @param {Address} seller the wallet of the account selling the asset
     * @param {uint64} price the price the asset should be sold for
     * @param {uint64} paymentAsset the asset to use for payment
     * @param {uint64} creatorRoyalty the royalty % for the asset creator
     * @param {uint64} marketplace the wallet that the listing fee should go to
     * @param {uint64} expirationRound the round the listing expires on
     * @param {Address} reservedFor the address thats allowed to purchase
     * @param {uint64} gateID the gate ID to use to check if the user is qualified to buy
     * @throws {Error} - if the caller is not the factory
     */
    createApplication(
        akitaDaoAppID: AppID,
        asset: AssetID,
        seller: Address,
        price: uint64,
        paymentAsset: AssetID,
        creatorRoyalty: uint64,
        marketplace: Address,
        expirationRound: uint64,
        reservedFor: Address,
        gateID: uint64
    ): void {
        assert(globals.callerApplicationID !== AppID.fromUint64(0), errs.MUST_BE_CALLED_FROM_FACTORY)

        this.akitaDaoAppID.value = akitaDaoAppID
        this.asset.value = asset
        this.seller.value = seller
        this.price.value = price
        this.paymentAsset.value = paymentAsset
        this.creatorRoyalty.value = creatorRoyalty
        this.marketplace.value = marketplace
        assert(expirationRound == 0 || expirationRound > globals.round, errs.INVALID_EXPIRATION_ROUND)
        this.expirationRound.value = expirationRound
        this.reservedFor.value = reservedFor
        this.gateID.value = gateID
    }

    /**
     *
     * @param {PayTxn} payment - the payment for purchasing the asset
     * @param {Address} buyer - the buyer of the asset
     * @param {Address} listingSeller - the payment side marketplace address to pay for selling the asset
     * @param {bytes[]} args - the args to pass to the gate
     * @throws {Error} - if the caller is not the reserved address
     * @throws {Error} - if the payment is not correct
     */
    @allow.call('DeleteApplication')
    purchase(payment: PayTxn, buyer: Address, marketplace: Address, args: bytes[]): void {
        assert(this.txn.sender === globals.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.paymentAsset.value.id === 0, errs.PAYMENT_ASSET_MUST_BE_ALGO)
        assert(this.expirationRound.value == 0 || this.expirationRound.value > globals.round, errs.LISTING_EXPIRED)
        assert(this.gate(buyer, this.gateID.value, args), errs.FAILED_GATE)

        if (this.reservedFor.value !== globals.zeroAddress) {
            assert(buyer === this.reservedFor.value, errs.RESERVED_FOR_DIFFERENT_ADDRESS)
        }

        // if we decouple the caller & payment sender
        // then we effectively can create a system where
        // you can purchase an NFT on behalf of another
        verifyPayTxn(payment, {
            sender: this.app.creator,
            amount: this.price.value,
            receiver: this.app.address,
        })

        this.transferPurchaseToBuyer(buyer)
        this.completeAlgoPayments(marketplace)
    }

    /**
     *
     * @param {PayTxn} payment - the payment for purchasing the asset
     * @param {Address} listingSeller - the payment side marketplace address to pay for selling the asset
     * @throws {Error} - if the caller is not the reserved address
     * @throws {Error} - if the payment is not correct
     */
    @allow.call('DeleteApplication')
    purchaseAsa(assetXfer: AssetTransferTxn, buyer: Address, marketplace: Address, args: bytes[]): void {
        assert(this.txn.sender === globals.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.paymentAsset.value.id !== 0, errs.PAYMENT_ASSET_MUST_BE_ALGO)
        assert(this.expirationRound.value == 0 || this.expirationRound.value > globals.round, errs.LISTING_EXPIRED)
        assert(this.gate(buyer, this.gateID.value, args), errs.FAILED_GATE)

        if (this.reservedFor.value !== globals.zeroAddress) {
            assert(buyer === this.reservedFor.value, errs.RESERVED_FOR_DIFFERENT_ADDRESS)
        }

        // if we decouple the caller & payment sender
        // then we effectively can create a system where
        // you can purchase an NFT on behalf of another
        verifyAssetTransferTxn(assetXfer, {
            sender: this.app.creator,
            assetAmount: this.price.value,
            assetReceiver: this.app.address,
        })

        this.transferPurchaseToBuyer(buyer)
        this.completeAsaPayments(marketplace)
    }

    /**
     * Deletes the app and returns the asset/mbr to the seller
     */
    @allow.call('DeleteApplication')
    delist(caller: Address): void {
        assert(this.txn.sender === globals.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.seller.value === caller, errs.ONLY_SELLER_CAN_DELIST)

        this.pendingGroup.addAssetTransfer({
            assetReceiver: this.seller.value,
            assetCloseTo: this.seller.value,
            assetAmount: this.app.address.assetBalance(this.asset.value),
            xferAsset: this.asset.value,
            fee: 0,
            isFirstTxn: true,
        })

        if (!this.paidInAlgo()) {
            // opt out of payment asset
            this.pendingGroup.addAssetTransfer({
                assetReceiver: this.seller.value,
                assetCloseTo: this.seller.value,
                assetAmount: this.app.address.assetBalance(this.paymentAsset.value),
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        }

        this.pendingGroup.addPayment({
            closeRemainderTo: this.seller.value,
            amount: this.app.address.balance,
            fee: 0,
        })

        this.pendingGroup.submit()
    }

    changePrice(price: uint64): void {
        assert(this.txn.sender === this.seller.value, errs.MUST_BE_SELLER)
        this.price.value = price
    }
}
