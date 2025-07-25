import { Account, Application, assert, assertMatch, Asset, Global, GlobalState, gtxn, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address } from '@algorandfoundation/algorand-typescript/arc4'
import { ListingGlobalStateKeyCreatorRoyalty, ListingGlobalStateKeyExpiration, ListingGlobalStateKeyGateID, ListingGlobalStateKeyIsPrizeBox, ListingGlobalStateKeyMarketplace, ListingGlobalStateKeyMarketplaceRoyalties, ListingGlobalStateKeyPaymentAsset, ListingGlobalStateKeyPrice, ListingGlobalStateKeyPrize, ListingGlobalStateKeyReservedFor, ListingGlobalStateKeySeller } from './constants'
import { RoyaltyAmounts } from '../utils/types/royalties'
import { PrizeBox } from '../prize-box/contract.algo'
import { ERR_INVALID_EXPIRATION, ERR_LISTING_EXPIRED, ERR_MUST_BE_CALLED_FROM_FACTORY, ERR_MUST_BE_SELLER, ERR_ONLY_SELLER_CAN_DELIST, ERR_PAYMENT_ASSET_MUST_BE_ALGO, ERR_PAYMENT_ASSET_MUST_NOT_BE_ALGO, ERR_RESERVED_FOR_DIFFERENT_ADDRESS } from './errors'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { ContractWithCreatorOnlyOptIn } from '../utils/base-contracts/optin'
import { arc59OptInAndSend, calcPercent, getNFTFees, getUserImpact, impactRange } from '../utils/functions'
import { classes } from 'polytype'
import { AkitaBaseContract } from '../utils/base-contracts/base'

export class Listing extends classes(AkitaBaseContract, ContractWithCreatorOnlyOptIn) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the asset for sale */
  prize = GlobalState<uint64>({ key: ListingGlobalStateKeyPrize })
  /** whether or not the prize is an asset or a prize box */
  isPrizeBox = GlobalState<boolean>({ key: ListingGlobalStateKeyIsPrizeBox })
  /** the price of the asset */
  price = GlobalState<uint64>({ key: ListingGlobalStateKeyPrice })
  /** the asset to use for payment */
  paymentAsset = GlobalState<Asset>({ key: ListingGlobalStateKeyPaymentAsset })
  /** the timestamp the listing expires on, once this passes all that can be done is delist */
  expiration = GlobalState<uint64>({ key: ListingGlobalStateKeyExpiration })
  /** the address selling the asset */
  seller = GlobalState<Account>({ key: ListingGlobalStateKeySeller })
  /** the address the sale is reserved for */
  reservedFor = GlobalState<Address>({ key: ListingGlobalStateKeyReservedFor })
  /** the amount the creator will get for the sale */
  creatorRoyalty = GlobalState<uint64>({ key: ListingGlobalStateKeyCreatorRoyalty })
  /** the gate ID to use to check if the user is qualified to buy */
  gateID = GlobalState<uint64>({ key: ListingGlobalStateKeyGateID })

  /**
   * The address of the marketplace that listed the asset to send the fee to
   *
   * IMPORTANT: this is a double sided marketplace fee contract
   * the marketplace referred to internally in the contract
   * is the listing side marketplace.
   * the buyer side marketplace provides their address at
   * the time of purchase
   */
  marketplace = GlobalState<Account>({ key: ListingGlobalStateKeyMarketplace })
  /** the amount the marketplaces will get for the sale */
  marketplaceRoyalties = GlobalState<uint64>({ key: ListingGlobalStateKeyMarketplaceRoyalties })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private getAmounts(amount: uint64): RoyaltyAmounts {
    let creatorAmount = calcPercent(amount, this.creatorRoyalty.value)
    if (creatorAmount === 0 && this.creatorRoyalty.value > 0 && amount > 0) {
      creatorAmount = 1
    }

    const { marketplaceSalePercentageMin: min, marketplaceSalePercentageMax: max } = getNFTFees(this.akitaDAO.value)
    const impact = getUserImpact(this.akitaDAO.value, this.seller.value)
    const akitaTaxRate = impactRange(impact, min, max)

    let akitaAmount = calcPercent(amount, akitaTaxRate)
    if (akitaAmount === 0 && amount > 0) {
      akitaAmount = 1
    }

    let marketplaceAmount = calcPercent(amount, this.marketplaceRoyalties.value)
    if (marketplaceAmount === 0 && this.marketplaceRoyalties.value > 0 && amount > 0) {
      marketplaceAmount = 1
    }

    const sellerAmount: uint64 = amount - (creatorAmount + akitaAmount + (2 * marketplaceAmount))

    return {
      creator: creatorAmount,
      akita: akitaAmount,
      marketplace: marketplaceAmount,
      seller: sellerAmount,
    }
  }

  private transferPurchaseToBuyer(buyer: Account): void {
    if (this.isPrizeBox.value) {
      abiCall(
        PrizeBox.prototype.transfer,
        {
          appId: this.prize.value,
          args: [new Address(buyer)],
        }
      )
      return
    }

    const prizeAsset = Asset(this.prize.value)

    if (buyer.isOptedIn(prizeAsset)) {
      // transfer the purchase to the caller & opt out of the asset
      itxn.assetTransfer({
        assetCloseTo: buyer,
        xferAsset: prizeAsset,
      }).submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value,
        new Address(buyer),
        prizeAsset.id,
        prizeAsset.balance(Global.currentApplicationAddress),
        true
      )
    }
  }

  private completeAlgoPayments(marketplace: Address): void {
    // get the royalty payment amounts
    const amounts = this.getAmounts(this.price.value)
    const assetPrize = Asset(this.prize.value)

    // pay the creator
    const creatorPay = itxn.payment({
      amount: amounts.creator,
      receiver: assetPrize.creator,
    })

    // pay listing marketplace
    const marketplacePay = itxn.payment({
      amount: amounts.marketplace,
      receiver: this.marketplace.value,
    })

    // pay buying marketplace
    const buyingMarketplacePay = itxn.payment({
      amount: amounts.marketplace,
      receiver: marketplace.native,
    })

    // pay the seller
    const sellerPay = itxn.payment({
      amount: amounts.seller,
      note: String(assetPrize.name) + ' Sold',
    })

    itxn.submitGroup(creatorPay, marketplacePay, buyingMarketplacePay, sellerPay)
  }

  private completeAsaPayments(marketplace: Address): void {
    // get the royalty payment amounts
    const amounts = this.getAmounts(this.price.value)
    const assetPrize = Asset(this.prize.value)

    // pay the creator
    if (assetPrize.creator.isOptedIn(this.paymentAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: assetPrize.creator,
          assetAmount: amounts.creator,
          xferAsset: this.paymentAsset.value,
        })
        .submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value,
        new Address(assetPrize.creator),
        this.paymentAsset.value.id,
        amounts.creator,
        false
      )
    }

    // pay listing marketplace
    if (this.marketplace.value.isOptedIn(this.paymentAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: this.marketplace.value,
          assetAmount: amounts.marketplace,
          xferAsset: this.paymentAsset.value,
        })
        .submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value,
        new Address(this.marketplace.value),
        this.paymentAsset.value.id,
        amounts.marketplace,
        false
      )
    }

    // pay buying marketplace
    if (marketplace.native.isOptedIn(this.paymentAsset.value)) {
      itxn
        .assetTransfer({
          assetReceiver: marketplace.native,
          assetAmount: amounts.marketplace,
          xferAsset: this.paymentAsset.value,
        })
        .submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value,
        marketplace,
        this.paymentAsset.value.id,
        amounts.marketplace,
        false
      )
    }

    // pay seller
    if (this.seller.value.isOptedIn(this.paymentAsset.value)) {
      itxn
        .assetTransfer({
          assetCloseTo: this.seller.value,
          xferAsset: this.paymentAsset.value,
        })
        .submit()
    } else {
      arc59OptInAndSend(
        this.akitaDAO.value,
        new Address(this.seller.value),
        this.paymentAsset.value.id,
        amounts.seller,
        true
      )
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  /** create the listing application */
  @abimethod({ onCreate: 'require' })
  create(
    prize: uint64,
    isPrizeBox: boolean,
    price: uint64,
    paymentAsset: uint64,
    expiration: uint64,
    seller: Address,
    reservedFor: Address,
    creatorRoyalty: uint64,
    gateID: uint64,
    marketplace: Address,
    version: string,
    akitaDAO: uint64
  ): void {
    assert(Global.callerApplicationId !== 0, ERR_MUST_BE_CALLED_FROM_FACTORY)

    this.prize.value = prize
    this.isPrizeBox.value = isPrizeBox
    this.price.value = price
    this.paymentAsset.value = Asset(paymentAsset)
    assert(expiration === 0 || expiration > Global.latestTimestamp, ERR_INVALID_EXPIRATION)
    this.expiration.value = expiration
    this.seller.value = seller.native
    this.reservedFor.value = reservedFor
    this.creatorRoyalty.value = creatorRoyalty
    this.gateID.value = gateID
    this.marketplace.value = marketplace.native
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)

    // internal variables
    this.marketplaceRoyalties.value = getNFTFees(this.akitaDAO.value).marketplaceComposablePercentage
  }

  /**
   *
   * @param {PaymentTxn} payment - the payment for purchasing the asset
   * @param {Address} buyer - the buyer of the asset
   * @param {Address} listingSeller - the payment side marketplace address to pay for selling the asset
   * @param {GateArgs} args - the args to pass to the gate
   * @throws {Error} - if the caller is not the factory
   * @throws {Error} - if the buyer doesnt pass the gate
   * @throws {Error} - if the buyer is not the reserved address
   * @throws {Error} - if the payment is not correct
   */
  @abimethod({ allowActions: 'DeleteApplication' })
  purchase(
    payment: gtxn.PaymentTxn,
    buyer: Address,
    marketplace: Address
  ): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.paymentAsset.value.id === 0, ERR_PAYMENT_ASSET_MUST_BE_ALGO)
    assert(this.expiration.value === 0 || this.expiration.value > Global.latestTimestamp, ERR_LISTING_EXPIRED)

    if (this.reservedFor.value.native !== Global.zeroAddress) {
      assert(buyer === this.reservedFor.value, ERR_RESERVED_FOR_DIFFERENT_ADDRESS)
    }

    assertMatch(
      payment,
      {
        sender: Global.creatorAddress,
        receiver: Global.currentApplicationAddress,
        amount: this.price.value,
      },
      ERR_INVALID_PAYMENT
    )

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
  purchaseAsa(
    assetXfer: gtxn.AssetTransferTxn,
    buyer: Address,
    marketplace: Address
  ): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.paymentAsset.value.id !== 0, ERR_PAYMENT_ASSET_MUST_NOT_BE_ALGO)
    assert(this.expiration.value === 0 || this.expiration.value > Global.latestTimestamp, ERR_LISTING_EXPIRED)

    if (this.reservedFor.value.native !== Global.zeroAddress) {
      assert(buyer === this.reservedFor.value, ERR_RESERVED_FOR_DIFFERENT_ADDRESS)
    }

    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: this.price.value,
      },
      ERR_INVALID_TRANSFER
    )

    this.transferPurchaseToBuyer(buyer.native)
    this.completeAsaPayments(marketplace)
  }

  /** Deletes the app and returns the asset/mbr to the seller */
  @abimethod({ allowActions: 'DeleteApplication' })
  delist(caller: Address): void {
    assert(Txn.sender === Global.creatorAddress, ERR_MUST_BE_CALLED_FROM_FACTORY)
    assert(this.seller.value === caller.native, ERR_ONLY_SELLER_CAN_DELIST)

    const assetTransfer = itxn.assetTransfer({
      assetCloseTo: this.seller.value,
      xferAsset: this.prize.value,
    })

    const payment = itxn.payment({
      closeRemainderTo: this.seller.value,
    })

    if (!(this.paymentAsset.value.id === 0)) {
      // opt out of payment asset
      const paymentAssetTransfer = itxn.assetTransfer({
        assetCloseTo: this.seller.value,
        xferAsset: this.paymentAsset.value,
      })

      if (this.isPrizeBox.value) {
        abiCall(
          PrizeBox.prototype.transfer,
          {
            appId: this.prize.value,
            args: [new Address(this.seller.value)],
          }
        )
        itxn.submitGroup(paymentAssetTransfer, payment)
      } else {
        itxn.submitGroup(assetTransfer, paymentAssetTransfer, payment)
      }
    } else {
      if (this.isPrizeBox.value) {
        abiCall(
          PrizeBox.prototype.transfer,
          {
            appId: this.prize.value,
            args: [new Address(this.seller.value)],
          }
        )
        payment.submit()
      } else {
        itxn.submitGroup(assetTransfer, payment)
      }
    }
  }

  changePrice(price: uint64): void {
    assert(Txn.sender === this.seller.value, ERR_MUST_BE_SELLER)
    this.price.value = price
  }
}
