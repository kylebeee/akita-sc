
import { classes } from 'polytype'
import { FactoryContract } from '../utils/base-contracts/factory'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { Account, Application, assert, assertMatch, Asset, Bytes, Global, gtxn, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { Proof } from '../utils/types/merkles'
import { abiCall, abimethod, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_BIDS_MUST_ALWAYS_INCREASE, ERR_END_MUST_BE_ATLEAST_FIVE_MINUTES_AFTER_START, ERR_NOT_AN_AUCTION } from './errors'
import { BaseAuction } from './base'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER, ERR_NOT_PRIZE_BOX_OWNER } from '../utils/errors'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'
import { Txn } from '@algorandfoundation/algorand-typescript/op'
import { Auction } from './contract.algo'
import { getFunder, getPrizeBoxOwner, royalties } from '../utils/functions'
import { PrizeBox } from '../prize-box/contract.algo'
import { AuctionGlobalStateKeySeller } from './constants'

export class AuctionFactory extends classes(
  BaseAuction,
  FactoryContract,
  ContractWithOptIn,
) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private createChildApp(): void { }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, childVersion: string, akitaDAO: Application, akitaDAOEscrow: Application): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
  }

  // AUCTION FACTORY METHODS ----------------------------------------------------------------------

  newAuction(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    name: string,
    proof: Proof,
    bidAssetID: uint64, // 0 | Asset
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64
  ): uint64 {
    assert(bidMinimumIncrease > 0, ERR_BIDS_MUST_ALWAYS_INCREASE)
    assert(endTimestamp > startTimestamp + 300, ERR_END_MUST_BE_ATLEAST_FIVE_MINUTES_AFTER_START)

    const isAlgoBid = bidAssetID === 0
    const daoEscrowNeedsToOptIn = !this.akitaDAOEscrow.value.address.isOptedIn(Asset(bidAssetID))
    const optinMBR: uint64 = (
      Global.assetOptInMinBalance * (
        isAlgoBid ? 0 : daoEscrowNeedsToOptIn ? 2 : 6
      )
    )

    const costs = this.mbr()

    const auction = compileArc4(Auction)

    const childAppMBR: uint64 = Global.minBalance + optinMBR + (weightsListCount * costs.weights)
    const totalMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * auction.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * auction.globalBytes) +
      childAppMBR
    )

    // ensure they paid enough to cover the contract mint + mbr costs
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalMBR,
      },
      ERR_INVALID_PAYMENT
    )

    // make sure they actually sent the asset they want to auction
    assertMatch(
      assetXfer,
      {
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: { greaterThan: 0 },
      },
      ERR_INVALID_TRANSFER
    )

    const creatorRoyalty = royalties(this.akitaDAO.value, assetXfer.xferAsset, name, proof)

    const auctionApp = auction.call
      .create({
        args: [
          assetXfer.xferAsset.id,
          false,
          bidAssetID,
          bidFee,
          startingBid,
          bidMinimumIncrease,
          startTimestamp,
          endTimestamp,
          { account: payment.sender, amount: totalMBR },
          Txn.sender,
          creatorRoyalty,
          gateID,
          marketplace,
          this.childContractVersion.value,
          this.akitaDAO.value,
          this.akitaDAOEscrow.value,
        ]
      })
      .itxn
      .createdApp

    // optin child contract to asset (we can use the AuctionBase)
    auction.call.optin({
      appId: auctionApp,
      args: [
        itxn.payment({
          receiver: auctionApp.address,
          amount: Global.assetOptInMinBalance
        }),
        assetXfer.xferAsset.id,
      ]
    })

    // xfer asset to child
    itxn
      .assetTransfer({
        assetReceiver: auctionApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset
      })
      .submit()

    if (!isAlgoBid) {
      // optin child contract to bidding asset
      auction.call.optin({
        appId: auctionApp,
        args: [
          itxn.payment({
            receiver: auctionApp.address,
            amount: Global.assetOptInMinBalance
          }),
          bidAssetID,
        ]
      })
    }


    auction.call.init({
      appId: auctionApp.id,
      args: [
        itxn.payment({
          receiver: Application(auctionApp.id).address,
          amount: childAppMBR
        }),
        weightsListCount,
      ]
    })

    return auctionApp.id
  }

  newPrizeBoxAuction(
    payment: gtxn.PaymentTxn,
    prizeBoxID: uint64,
    bidAssetID: uint64, // 0 | Asset
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64
  ): uint64 {
    assert(getPrizeBoxOwner(this.akitaDAO.value, Application(prizeBoxID)) === Global.currentApplicationAddress, ERR_NOT_PRIZE_BOX_OWNER)
    assert(bidMinimumIncrease > 0, ERR_BIDS_MUST_ALWAYS_INCREASE)
    assert(endTimestamp > startTimestamp + 300, ERR_END_MUST_BE_ATLEAST_FIVE_MINUTES_AFTER_START)

    const isAlgoBid = bidAssetID === 0
    const optinMBR: uint64 = isAlgoBid ? 0 : Global.assetOptInMinBalance

    const costs = this.mbr()

    const childAppMBR: uint64 = (weightsListCount * costs.weights)

    const auction = compileArc4(Auction)

    const totalMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * auction.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * auction.globalBytes) +
      optinMBR +
      childAppMBR
    )

    // ensure they paid enough to cover the contract mint + mbr costs
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const creatorRoyalty = royalties(this.akitaDAO.value, Asset(0), '', [])

    const auctionApp = auction.call
      .create({
        args: [
          prizeBoxID,
          true,
          bidAssetID,
          bidFee,
          startingBid,
          bidMinimumIncrease,
          startTimestamp,
          endTimestamp,
          { account: payment.sender, amount: totalMBR },
          Txn.sender,
          creatorRoyalty,
          gateID,
          marketplace,
          this.childContractVersion.value,
          this.akitaDAO.value,
          this.akitaDAOEscrow.value,
        ]
      })
      .itxn
      .createdApp

    abiCall({
      method: PrizeBox.prototype.transfer,
      appId: prizeBoxID,
      args: [auctionApp.address]
    })

    const accountActivation = itxn.payment({
      receiver: auctionApp.address,
      amount: optinMBR
    })

    if (!isAlgoBid) {
      // optin child contract to bidding asset
      auction.call.optin({
        appId: auctionApp,
        args: [
          accountActivation,
          bidAssetID,
        ]
      })
    } else {
      accountActivation.submit()
    }

    auction.call.init({
      appId: auctionApp.id,
      args: [
        itxn.payment({
          receiver: Application(auctionApp.id).address,
          amount: childAppMBR
        }),
        weightsListCount,
      ]
    })

    return auctionApp.id
  }

  deleteAuctionApp(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_AN_AUCTION)
    const seller = Account(op.AppGlobal.getExBytes(appId, Bytes(AuctionGlobalStateKeySeller))[0])
    assert(seller === Txn.sender, ERR_NOT_PRIZE_BOX_OWNER)

    const auction = compileArc4(Auction)

    auction.call.deleteApplication({ appId })

    const { account: receiver, amount } = getFunder(appId)

    itxn
      .payment({ amount, receiver })
      .submit()
  }

  cancelAuction(appId: Application): void {
    assert(appId.creator === Global.currentApplicationAddress, ERR_NOT_AN_AUCTION)
    const seller = Account(op.AppGlobal.getExBytes(appId, Bytes(AuctionGlobalStateKeySeller))[0])
    assert(seller === Txn.sender, ERR_NOT_PRIZE_BOX_OWNER)

    const auction = compileArc4(Auction)

    auction.call.cancel({ appId })

    const { account: receiver, amount } = getFunder(appId)

    itxn
      .payment({ amount, receiver })
      .submit()
  }
}
