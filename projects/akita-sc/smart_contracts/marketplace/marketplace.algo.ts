import { abiCall, abimethod, Address, compileArc4, decodeArc4, StaticArray } from '@algorandfoundation/algorand-typescript/arc4'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { Proof } from '../utils/types/merkles'
import { Listing } from './listing.algo'
import { Application, assert, assertMatch, BoxMap, Global, gtxn, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { ServiceFactoryContract } from '../utils/base-contracts/factory'
import { Royalties } from '../utils/base-contracts/royalties'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { arc4FloorData } from './types'
import { ERR_NOT_A_LISTING, ERR_PRICE_TOO_LOW } from './errors'
import { GateArgs } from '../utils/types/gates'

const listing = compileArc4(Listing)

export class Marketplace extends classes(
  ServiceFactoryContract,
  Royalties,
  ContractWithOptIn,
) {

  floors = BoxMap<string, StaticArray<arc4FloorData, 10>>({ keyPrefix: '' })

  @abimethod({ onCreate: 'require' })
  createApplication(version: string): void {
    this.childContractVersion.value = version
  }

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
    const optinMBR = isAlgoPayment
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = this.fmbr()

    const childAppMBR = AccountMinimumBalance + optinMBR

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

    const creatorRoyalty = this.royalties(false, assetXfer.xferAsset, name, proof)

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
          this.akitaDAO.value.id,
        ],
        fee: 0,
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
          fee: 0,
        }),
        assetXfer.xferAsset.id,
      ],
      fee: 0,
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: listingApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
        fee: 0,
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
            fee: 0,
          }),
          paymentAsset,
        ],
        fee: 0,
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
    listingAppID: uint64,
    marketplace: Address,
    args: GateArgs
  ): void {
    assert(Application(listingAppID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    assertMatch(
      payment,
      { receiver: Global.currentApplicationAddress },
      ERR_INVALID_PAYMENT
    )

    abiCall(
      Listing.prototype.purchase,
      {
        appId: listingAppID,
        args: [
          itxn.payment({
            receiver: Application(listingAppID).address,
            amount: payment.amount,
            fee: 0,
          }),
          new Address(Txn.sender),
          marketplace,
          args,
        ],
        fee: 0,
      }
    )

    const { amount, creatorAddress } = this.getAppCreator(listingAppID)

    itxn
      .payment({
        amount,
        receiver: creatorAddress.native,
        fee: 0,
      })
      .submit()
  }

  purchaseAsa(
    assetXfer: gtxn.AssetTransferTxn,
    listingAppID: uint64,
    marketplace: Address,
    args: GateArgs
  ): void {
    assert(Application(listingAppID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
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
        appId: listingAppID,
        args: [
          itxn.assetTransfer({
            assetReceiver: Application(listingAppID).address,
            assetAmount: assetXfer.assetAmount,
            xferAsset: assetXfer.xferAsset,
            fee: 0,
          }),
          new Address(Txn.sender),
          marketplace,
          args,
        ],
        fee: 0,
      }
    )

    const { amount, creatorAddress } = this.getAppCreator(listingAppID)

    itxn
      .payment({
        amount,
        receiver: creatorAddress.native,
        fee: 0,
      })
      .submit()
  }

  delist(listingAppID: uint64): void {
    assert(Application(listingAppID).creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)

    abiCall(
      Listing.prototype.delist,
      {
        appId: listingAppID,
        args: [new Address(Txn.sender)],
        fee: 0,
      }
    )

    const { amount, creatorAddress } = this.getAppCreator(listingAppID)

    itxn
      .payment({
        amount,
        receiver: creatorAddress.native,
        fee: 0,
      })
      .submit()
  }
}
