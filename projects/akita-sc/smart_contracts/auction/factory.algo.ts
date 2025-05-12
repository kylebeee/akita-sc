
import { classes } from 'polytype'
import { arc4AppCreatorValue, ServiceFactoryContract } from '../utils/base-contracts/factory'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { Application, assert, assertMatch, Global, gtxn, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { Proof } from '../utils/types/merkles'
import { abimethod, Address, compileArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_BIDS_MUST_ALWAYS_INCREASE, ERR_END_MUST_BE_ATLEAST_FIVE_MINUTES_AFTER_START } from './errors'
import { BaseAuction } from './base'
import { ERR_INVALID_PAYMENT, ERR_INVALID_TRANSFER } from '../utils/errors'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'
import { Txn } from '@algorandfoundation/algorand-typescript/op'
import { Auction } from './contract.algo'
import { fmbr, royalties } from '../utils/functions'

export class AuctionFactory extends classes(
  BaseAuction,
  ServiceFactoryContract,
  ContractWithOptIn,
) {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private createChildApp(): void {}

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, childVersion: string, akitaDAO: uint64, escrow: uint64): void {
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.akitaDAO.value = Application(akitaDAO)
    this.akitaDAOEscrow.value = Application(escrow)
  }

  // AUCTION FACTORY METHODS ----------------------------------------------------------------------

  newAuction(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    name: string,
    proof: Proof,
    bidAssetID: uint64,
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64
  ): uint64 {
    assert(bidMinimumIncrease > 0, ERR_BIDS_MUST_ALWAYS_INCREASE)
    assert(endTimestamp > startTimestamp + 300, ERR_END_MUST_BE_ATLEAST_FIVE_MINUTES_AFTER_START)

    const isAlgoBid = bidAssetID === 0
    const optinMBR: uint64 = isAlgoBid
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = fmbr()
    const costs = this.mbr()

    const auction = compileArc4(Auction)

    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR + (weightsListCount * costs.weights)
    const totalMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * auction.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * auction.globalBytes) +
      childAppMBR +
      fcosts.appCreators
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
      .createApplication({
        args: [
          assetXfer.xferAsset.id,
          false,
          bidAssetID,
          bidFee,
          startingBid,
          bidMinimumIncrease,
          startTimestamp,
          endTimestamp,
          new Address(Txn.sender),
          creatorRoyalty,
          gateID,
          marketplace,
          this.childContractVersion.value,
          this.akitaDAO.value.id,
          this.akitaDAOEscrow.value.id,
        ],
        fee: 0,
      })
      .itxn
      .createdApp

    this.appCreators(auctionApp.id).value = new arc4AppCreatorValue({
      creatorAddress: new Address(payment.sender),
      amount: new UintN64(totalMBR),
    })

    auction.call.init({
      appId: auctionApp,
      args: [
        itxn.payment({
          receiver: auctionApp.address,
          amount: childAppMBR,
          fee: 0,
        }),
        weightsListCount,
      ],
      fee: 0,
    })

    // optin child contract to asset (we can use the AuctionBase)
    auction.call.optin({
      appId: auctionApp,
      args: [
        itxn.payment({
          receiver: auctionApp.address,
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
        assetReceiver: auctionApp.address,
        assetAmount: assetXfer.assetAmount,
        xferAsset: assetXfer.xferAsset,
        fee: 0,
      })
      .submit()

    if (!isAlgoBid) {
      // optin child contract to bidding asset
      auction.call.optin({
        appId: auctionApp,
        args: [
          itxn.payment({
            receiver: auctionApp.address,
            amount: Global.assetOptInMinBalance,
            fee: 0,
          }),
          bidAssetID,
        ],
        fee: 0,
      })
    }

    return auctionApp.id
  }

  newPrizeBoxAuction(
    payment: gtxn.PaymentTxn,
    prizeID: uint64,
    name: string,
    proof: Proof,
    bidAssetID: uint64,
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64
  ): uint64 {
    // TODO: implement this
    return 0
  }

  deleteAuctionApp(auctionAppID: uint64): void {
    
    const auction = compileArc4(Auction)

    auction.call.deleteApplication({ appId: auctionAppID, fee: 0 })

    const { amount, creatorAddress } = this.getAppCreator(auctionAppID)
    this.appCreators(auctionAppID).delete()

    itxn
      .payment({
        amount,
        receiver: creatorAddress.native,
        fee: 0,
      })
      .submit()
  }
}
