import { abiCall, abimethod, Address, compileArc4, StaticArray } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../utils/types/merkles'
import { Listing } from './listing.algo'
import { Application, assert, assertMatch, BoxMap, Global, gtxn, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { ServiceFactoryContract } from '../utils/base-contracts/factory'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { arc4FloorData } from './types'
import { ERR_NOT_A_LISTING, ERR_PRICE_TOO_LOW } from './errors'
import { GateArgs } from '../utils/types/gates'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { fmbr, royalties } from '../utils/functions'
import { fee } from '../utils/constants'

export class Marketplace extends classes(ServiceFactoryContract, ContractWithOptIn) {

  // BOXES ----------------------------------------------------------------------------------------

  floors = BoxMap<string, StaticArray<arc4FloorData, 10>>({ keyPrefix: '' })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, childVersion: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // MARKETPLACE METHODS --------------------------------------------------------------------------

  list(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    price: uint64,
    paymentAsset: uint64,
    expiration: uint64,
    reservedFor: Address,
    gateID: uint64,
    marketplace: Address,
    name: string,
    proof: Proof
  ): uint64 {
    /** lowest split is 4 */
    assert(price >= 4, ERR_PRICE_TOO_LOW)

    const isAlgoPayment = paymentAsset === 0
    const optinMBR: uint64 = isAlgoPayment
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = fmbr()

    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR

    const listing = compileArc4(Listing)
    
    // ensure they paid enough to cover the contract mint + mbr costs
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          MIN_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * listing.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * listing.globalBytes) +
          childAppMBR +
          fcosts.appCreators
        ),
      },
      ERR_INVALID_PAYMENT
    )

    // make sure they actually send the asset they want to sell
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: { greaterThan: 0 },
      },
      ERR_INVALID_PAYMENT
    )

    const creatorRoyalty = royalties(this.akitaDAO.value, assetXfer.xferAsset, name, proof)

    // mint listing contract
    const listingApp = listing.call
      .createApplication({
        args: [
          assetXfer.xferAsset.id,
          false,
          price,
          paymentAsset,
          expiration,
          new Address(Txn.sender),
          reservedFor,
          creatorRoyalty,
          gateID,
          marketplace,
          this.childContractVersion.value,
          this.akitaDAO.value.id,
        ],
        fee,
      })
      .itxn
      .createdApp

    // optin child contract to sale asset
    listing.call.optin({
      appId: listingApp,
      args: [
        itxn.payment({
          receiver: listingApp.address,
          amount: Global.assetOptInMinBalance,
          fee,
        }),
        assetXfer.xferAsset.id,
      ],
      fee,
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: listingApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
        fee,
      })
      .submit()

    if (!isAlgoPayment) {
      // optin child contract to payment asset
      listing.call.optin({
        appId: listingApp,
        args: [
          itxn.payment({
            receiver: listingApp.address,
            amount: optinMBR,
            fee,
          }),
          paymentAsset,
        ],
        fee,
      })
    }

    return listingApp.id
  }

  listPrizeBox(
    payment: gtxn.PaymentTxn,
    prizeID: uint64,
    price: uint64,
    paymentAsset: uint64,
    expiration: uint64,
    reservedFor: Address,
    gateID: uint64,
    marketplace: Address,
  ): uint64 {
    // TODO: implement this
    return 0
  }

  purchase(
    payment: gtxn.PaymentTxn,
    listingID: uint64,
    marketplace: Address,
    args: GateArgs
  ): void {
    assert(Application(listingID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    assertMatch(
      payment,
      { receiver: Global.currentApplicationAddress },
      ERR_INVALID_PAYMENT
    )

    abiCall(
      Listing.prototype.purchase,
      {
        appId: listingID,
        args: [
          itxn.payment({
            receiver: Application(listingID).address,
            amount: payment.amount,
            fee,
          }),
          new Address(Txn.sender),
          marketplace,
          args,
        ],
        fee,
      }
    )

    const { amount, creator } = this.appCreators(listingID).value

    itxn
      .payment({
        amount,
        receiver: creator,
        fee,
      })
      .submit()
  }

  purchaseAsa(
    assetXfer: gtxn.AssetTransferTxn,
    listingID: uint64,
    marketplace: Address,
    args: GateArgs
  ): void {
    assert(Application(listingID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: { greaterThan: 0 },
      },
      ERR_INVALID_TRANSFER
    )

    abiCall(
      Listing.prototype.purchaseAsa,
      {
        appId: listingID,
        args: [
          itxn.assetTransfer({
            assetReceiver: Application(listingID).address,
            assetAmount: assetXfer.assetAmount,
            xferAsset: assetXfer.xferAsset,
            fee,
          }),
          new Address(Txn.sender),
          marketplace,
          args,
        ],
        fee,
      }
    )

    const { amount, creator } = this.appCreators(listingID).value

    itxn
      .payment({
        amount,
        receiver: creator,
        fee,
      })
      .submit()
  }

  delist(listingID: uint64): void {
    assert(Application(listingID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)

    abiCall(
      Listing.prototype.delist,
      {
        appId: listingID,
        args: [new Address(Txn.sender)],
        fee,
      }
    )

    const { amount, creator } = this.appCreators(listingID).value

    itxn
      .payment({
        amount,
        receiver: creator,
        fee,
      })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // TODO: add readonly list methods
}
