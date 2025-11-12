import { abiCall, abimethod, Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../utils/types/merkles'
import { Listing } from './listing.algo'
import { Account, Application, assert, assertMatch, Asset, Bytes, Global, gtxn, itxn, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { FactoryContract } from '../utils/base-contracts/factory'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { ERR_NOT_A_LISTING, ERR_PRICE_TOO_LOW } from './errors'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { gateCheck, getFunder, getWalletIDUsingAkitaDAO, originOrTxnSender, royalties } from '../utils/functions'
import { ListingGlobalStateKeyGateID } from './constants'
import { ERR_HAS_GATE } from '../social/errors'

export class Marketplace extends classes(FactoryContract, ContractWithOptIn) {

  // BOXES ----------------------------------------------------------------------------------------

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
  }

  // MARKETPLACE METHODS --------------------------------------------------------------------------

  list(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    price: uint64,
    paymentAsset: uint64, // 0 | Asset
    expiration: uint64,
    reservedFor: Account,
    gateID: uint64,
    marketplace: Account,
    name: string,
    proof: Proof
  ): uint64 {
    /** lowest split is 4 */
    assert(price >= 4, ERR_PRICE_TOO_LOW)

    const isAlgoPayment = paymentAsset === 0
    const optinMBR: uint64 = isAlgoPayment
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const listing = compileArc4(Listing)

    const childAppMBR: uint64 = Global.minBalance + optinMBR
    const totalMBR: uint64 = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * listing.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * listing.globalBytes) +
      childAppMBR
    )

    // ensure they paid enough to cover the contract mint + mbr costs
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalMBR
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
      .create({
        args: [
          assetXfer.xferAsset.id,
          false,
          price,
          paymentAsset,
          expiration,
          Txn.sender,
          { account: payment.sender, amount: totalMBR },
          reservedFor,
          creatorRoyalty,
          gateID,
          marketplace,
          this.childContractVersion.value,
          this.akitaDAO.value,
        ],
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
        }),
        assetXfer.xferAsset.id,
      ],
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: listingApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
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
          }),
          paymentAsset,
        ],
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

  gatedPurchase(
    payment: gtxn.PaymentTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    appId: Application,
    marketplace: Account,
  ): void {
    const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
    const origin = originOrTxnSender(wallet)

    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    const gateID = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyGateID))[0]
    assert(gateCheck(gateTxn, this.akitaDAO.value, origin, gateID))
    assertMatch(
      payment,
      { receiver: Global.currentApplicationAddress },
      ERR_INVALID_PAYMENT
    )

    abiCall<typeof Listing.prototype.purchase>({
      appId,
      args: [
        itxn.payment({
          receiver: appId.address,
          amount: payment.amount,
        }),
        Txn.sender,
        marketplace
      ],
    })

    const { account: creator, amount } = getFunder(appId)

    itxn
      .payment({
        amount,
        receiver: creator,
      })
      .submit()
  }

  purchase(
    payment: gtxn.PaymentTxn,
    appId: Application,
    marketplace: Account,
  ): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    const gateID = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyGateID))[0]
    assert(gateID === 0, ERR_HAS_GATE)
    assertMatch(
      payment,
      { receiver: Global.currentApplicationAddress },
      ERR_INVALID_PAYMENT
    )

    abiCall<typeof Listing.prototype.purchase>({
      appId,
      args: [
        itxn.payment({
          receiver: appId.address,
          amount: payment.amount,
        }),
        Txn.sender,
        marketplace
      ],
    })

    const { account: creator, amount } = getFunder(appId)

    itxn
      .payment({
        amount,
        receiver: creator,
      })
      .submit()
  }

  gatedPurchaseAsa(
    assetXfer: gtxn.AssetTransferTxn,
    gateTxn: gtxn.ApplicationCallTxn,
    appId: Application,
    marketplace: Account,
  ): void {
    // TODO: implement this method
  }

  purchaseAsa(
    assetXfer: gtxn.AssetTransferTxn,
    appId: Application,
    marketplace: Account,
  ): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)
    const gateID = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyGateID))[0]
    assert(gateID === 0, ERR_HAS_GATE)
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: { greaterThan: 0 },
      },
      ERR_INVALID_TRANSFER
    )

    abiCall<typeof Listing.prototype.purchaseAsa>({
      appId,
      args: [
        itxn.assetTransfer({
          assetReceiver: appId.address,
          assetAmount: assetXfer.assetAmount,
          xferAsset: assetXfer.xferAsset,
        }),
        Txn.sender,
        marketplace
      ],
    })

    const { account: receiver, amount } = getFunder(appId)

    itxn
      .payment({ amount, receiver })
      .submit()
  }

  delist(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_A_LISTING)

    abiCall<typeof Listing.prototype.delist>({
      appId,
      args: [Txn.sender],
    })

    const { account: receiver, amount } = getFunder(appId)

    itxn
      .payment({ amount, receiver })
      .submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // TODO: add readonly list methods
}
