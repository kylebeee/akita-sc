import {
    GlobalState,
    assert,
    uint64,
    Account,
    gtxn,
    itxn,
    Asset,
    abimethod,
    op,
} from '@algorandfoundation/algorand-typescript'
import { Global, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, DynamicArray, DynamicBytes } from '@algorandfoundation/algorand-typescript/arc4'

import { classes } from 'polytype'

import {
    AKITA_LISTING_AKITA_DAO_APP_ID_KEY,
    AKITA_LISTING_ASSET_KEY,
    AKITA_LISTING_PRICE_KEY,
    AKITA_LISTING_PAYMENT_ASSET_KEY,
    AKITA_LISTING_SELLER_KEY,
    AKITA_LISTING_MARKETPLACE_KEY,
    AKITA_LISTING_CREATOR_ROYALTY_KEY,
    AKITA_LISTING_MARKETPLACE_ROYALTY_KEY,
    AKITA_LISTING_EXPIRATION_ROUND_KEY,
    AKITA_LISTING_RESERVED_FOR_KEY,
    AKITA_LISTING_GATE_ID_KEY,
} from './constants'
import { AkitaAppIDsAkitaSocialImpactPlugin } from '../../utils/constants'

import { AkitaDAO } from '../dao/dao.algo'
import { ContractWithCreatorOnlyOptInAndArc59AndGate } from '../../utils/base_contracts/gate.algo'
import { AkitaSocialImpact } from '../arc58/plugins/social/impact.algo'

import { RoyaltyAmounts } from '../../utils/types/royalties'

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

export class Listing extends classes(ContractWithCreatorOnlyOptInAndArc59AndGate, AkitaDAO) {
    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = GlobalState<uint64>({ key: AKITA_LISTING_AKITA_DAO_APP_ID_KEY })

    /** the asset for sale */
    asset = GlobalState<Asset>({ key: AKITA_LISTING_ASSET_KEY })

    /** the price of the asset */
    price = GlobalState<uint64>({ key: AKITA_LISTING_PRICE_KEY })

    /** the asset to use for payment */
    paymentAsset = GlobalState<Asset>({ key: AKITA_LISTING_PAYMENT_ASSET_KEY })

    /** the address selling the asset */
    seller = GlobalState<Address>({ key: AKITA_LISTING_SELLER_KEY })

    /**
     * The address of the marketplace that listed the asset to send the fee to
     *
     * IMPORTANT: this is a double sided marketplace fee contract
     * the marketplace referred to internally in the contract
     * is the listing side marketplace.
     * the buyer side marketplace provides their address at
     * the time of purchase
     */
    marketplace = GlobalState<Account>({ key: AKITA_LISTING_MARKETPLACE_KEY })

    /** the amount the creator will get for the sale */
    creatorRoyalty = GlobalState<uint64>({ key: AKITA_LISTING_CREATOR_ROYALTY_KEY })

    /** the amount the marketplace will get for the sale */
    marketplaceRoyalties = GlobalState<uint64>({ key: AKITA_LISTING_MARKETPLACE_ROYALTY_KEY })

    /** the round the listing expires on, once this passes all that can be done is delist */
    expirationRound = GlobalState<uint64>({ key: AKITA_LISTING_EXPIRATION_ROUND_KEY })

    /** the address the sale is reserved for */
    reservedFor = GlobalState<Address>({ key: AKITA_LISTING_RESERVED_FOR_KEY })

    /** the gate ID to use to check if the user is qualified to buy */
    gateID = GlobalState<uint64>({ key: AKITA_LISTING_GATE_ID_KEY })

    /**
     *
     * @returns whether the payment asset is algo
     */
    private paidInAlgo(): boolean {
        return this.paymentAsset.value.id === 0
    }

    private getUserImpact(address: Address): uint64 {
        return abiCall(AkitaSocialImpact.prototype.getUserImpact, {
            appId: AkitaAppIDsAkitaSocialImpactPlugin,
            args: [address],
            fee: 0,
        }).returnValue // TODO:AkitaSocialImpact contract not migrated to puya-ts yet
    }

    private getAmounts(amount: uint64): RoyaltyAmounts {
        let creatorAmount = op.divw(...op.mulw(amount, this.creatorRoyalty.value), 10000)
        if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
            creatorAmount = 1
        }
        const nftFees = super.class(AkitaDAO).nftFees.value
        const minTax = nftFees.marketplaceSalePercentageMinimum
        const maxTax = nftFees.marketplaceSalePercentageMaximum
        const impact = this.getUserImpact(this.seller.value)
        const akitaTaxRate = maxTax.native - op.divw(...op.mulw(maxTax.native - minTax.native, impact - 1), 999)

        let akitaAmount = op.divw(...op.mulw(amount, akitaTaxRate), 10000)
        if (akitaAmount === 0 && amount > 0) {
            akitaAmount = 1
        }

        const marketplaceTaxRate = nftFees.marketplaceComposablePercentage.native

        let marketplaceAmount = op.divw(...op.mulw(amount, marketplaceTaxRate), 10000)
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

    private transferPurchaseToBuyer(buyer: Account): void {
        // transfer asa to buyer
        if (buyer.isOptedIn(this.asset.value)) {
            // transfer the purchase to the caller & opt out of the asset
            itxn.assetTransfer({
                assetCloseTo: buyer,
                assetReceiver: buyer,
                assetAmount: this.asset.value.balance(Global.currentApplicationAddress),
                xferAsset: this.asset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(
                new Address(buyer),
                this.asset.value.id,
                this.asset.value.balance(Global.currentApplicationAddress),
                true
            )
        }
    }

    private completeAlgoPayments(marketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(this.price.value)

        // pay the creator
        const creatorPay = itxn.payment({
            amount: amounts.creator,
            receiver: this.asset.value.creator,
            fee: 0,
        })

        // pay listing marketplace
        const marketplacePay = itxn.payment({
            amount: amounts.marketplace,
            receiver: this.marketplace.value,
            fee: 0,
        })

        // pay buying marketplace
        const buyingMarketplacePay = itxn.payment({
            amount: amounts.marketplace,
            receiver: marketplace.native,
            fee: 0,
        })

        // pay the seller
        const sellerPay = itxn.payment({
            closeRemainderTo: this.seller.value.native,
            amount: amounts.seller,
            fee: 0,
            note: this.asset.value.name + ' Sold',
        })

        itxn.submitGroup(creatorPay, marketplacePay, buyingMarketplacePay, sellerPay)
    }

    private completeAsaPayments(marketplace: Address): void {
        // get the royalty payment amounts
        const amounts = this.getAmounts(this.price.value)

        // pay the creator
        if (this.asset.value.creator.isOptedIn(this.paymentAsset.value)) {
            itxn.assetTransfer({
                assetReceiver: this.asset.value.creator,
                assetAmount: amounts.creator,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(
                new Address(this.asset.value.creator),
                this.paymentAsset.value.id,
                amounts.creator,
                false
            )
        }

        // pay listing marketplace
        if (this.marketplace.value.isOptedIn(this.paymentAsset.value)) {
            itxn.assetTransfer({
                assetReceiver: this.marketplace.value,
                assetAmount: amounts.marketplace,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(
                new Address(this.marketplace.value),
                this.paymentAsset.value.id,
                amounts.marketplace,
                false
            )
        }

        // pay buying marketplace
        if (marketplace.native.isOptedIn(this.paymentAsset.value)) {
            itxn.assetTransfer({
                assetReceiver: marketplace.native,
                assetAmount: amounts.marketplace,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(marketplace, this.paymentAsset.value.id, amounts.marketplace, false)
        }

        // pay seller
        if (this.seller.value.native.isOptedIn(this.paymentAsset.value)) {
            itxn.assetTransfer({
                assetCloseTo: this.seller.value.native,
                assetReceiver: this.seller.value.native,
                assetAmount: amounts.seller,
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })
        } else {
            this.arc59OptInAndSend(this.seller.value, this.paymentAsset.value.id, amounts.seller, true)
        }

        // pay the seller
        itxn.payment({
            closeRemainderTo: this.seller.value.native,
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
    // @ts-ignore
    @abimethod({ onCreate: 'require' })
    public createListingApplication(
        akitaDaoAppID: uint64,
        asset: Asset,
        seller: Address,
        price: uint64,
        paymentAsset: Asset,
        creatorRoyalty: uint64,
        marketplace: Account,
        expirationRound: uint64,
        reservedFor: Address,
        gateID: uint64
    ): void {
        assert(Global.callerApplicationId !== 0, errs.MUST_BE_CALLED_FROM_FACTORY)

        this.akitaDaoAppID.value = akitaDaoAppID
        this.asset.value = asset
        this.seller.value = seller
        this.price.value = price
        this.paymentAsset.value = paymentAsset
        this.creatorRoyalty.value = creatorRoyalty
        this.marketplace.value = marketplace
        assert(expirationRound === 0 || expirationRound > Global.round, errs.INVALID_EXPIRATION_ROUND)
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
    // @ts-ignore
    @abimethod({ OnCompleteAction: 'DeleteApplication' })
    public purchase(
        payment: gtxn.PaymentTxn,
        buyer: Address,
        marketplace: Address,
        args: DynamicArray<DynamicBytes>
    ): void {
        assert(Txn.sender === Global.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.paymentAsset.value.id === 0, errs.PAYMENT_ASSET_MUST_BE_ALGO)
        assert(this.expirationRound.value === 0 || this.expirationRound.value > Global.round, errs.LISTING_EXPIRED)
        assert(this.gate(buyer, this.gateID.value, args), errs.FAILED_GATE)

        if (this.reservedFor.value.native !== Global.zeroAddress) {
            assert(buyer === this.reservedFor.value, errs.RESERVED_FOR_DIFFERENT_ADDRESS)
        }

        // if we decouple the caller & payment sender
        // then we effectively can create a system where
        // you can purchase an NFT on behalf of another
        assert(payment.sender === Global.creatorAddress)
        assert(payment.amount === this.price.value)
        assert(payment.receiver === Global.currentApplicationAddress)

        this.transferPurchaseToBuyer(buyer.native)
        this.completeAlgoPayments(marketplace)
    }

    /**
     *
     * @param {PayTxn} payment - the payment for purchasing the asset
     * @param {Address} listingSeller - the payment side marketplace address to pay for selling the asset
     * @throws {Error} - if the caller is not the reserved address
     * @throws {Error} - if the payment is not correct
     */
    // @ts-ignore
    @abimethod({ OnCompleteAction: 'DeleteApplication' })
    public purchaseAsa(
        assetXfer: gtxn.AssetTransferTxn,
        buyer: Address,
        marketplace: Address,
        args: DynamicArray<DynamicBytes>
    ): void {
        assert(Txn.sender === Global.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.paymentAsset.value.id !== 0, errs.PAYMENT_ASSET_MUST_BE_ALGO)
        assert(this.expirationRound.value === 0 || this.expirationRound.value > Global.round, errs.LISTING_EXPIRED)
        assert(this.gate(buyer, this.gateID.value, args), errs.FAILED_GATE)

        if (this.reservedFor.value.native !== Global.zeroAddress) {
            assert(buyer === this.reservedFor.value, errs.RESERVED_FOR_DIFFERENT_ADDRESS)
        }

        // if we decouple the caller & payment sender
        // then we effectively can create a system where
        // you can purchase an NFT on behalf of another
        assert(assetXfer.sender === Global.creatorAddress)
        assert(assetXfer.assetAmount === this.price.value)
        assert(assetXfer.assetReceiver === Global.currentApplicationAddress)

        this.transferPurchaseToBuyer(buyer.native)
        this.completeAsaPayments(marketplace)
    }

    /**
     * Deletes the app and returns the asset/mbr to the seller
     */
    // @ts-ignore
    @abimethod({ OnCompleteAction: 'DeleteApplication' })
    delist(caller: Address): void {
        assert(Txn.sender === Global.creatorAddress, errs.MUST_BE_CALLED_FROM_FACTORY)
        assert(this.seller.value === caller, errs.ONLY_SELLER_CAN_DELIST)

        const assetTransfer = itxn.assetTransfer({
            assetReceiver: this.seller.value.native,
            assetCloseTo: this.seller.value.native,
            assetAmount: this.paymentAsset.value.balance(Global.currentApplicationAddress),
            xferAsset: this.asset.value,
            fee: 0,
        })

        const payment = itxn.payment({
            closeRemainderTo: this.seller.value.native,
            amount: Global.currentApplicationAddress.balance,
            fee: 0,
        })

        if (!this.paidInAlgo()) {
            // opt out of payment asset
            const paymentAssetTransfer = itxn.assetTransfer({
                assetReceiver: this.seller.value.native,
                assetCloseTo: this.seller.value.native,
                assetAmount: this.paymentAsset.value.balance(Global.currentApplicationAddress),
                xferAsset: this.paymentAsset.value,
                fee: 0,
            })

            itxn.submitGroup(assetTransfer, paymentAssetTransfer, payment)
        } else {
            itxn.submitGroup(assetTransfer, payment)
        }
    }

    public changePrice(price: uint64): void {
        assert(Txn.sender === this.seller.value.native, errs.MUST_BE_SELLER)
        this.price.value = price
    }
}
