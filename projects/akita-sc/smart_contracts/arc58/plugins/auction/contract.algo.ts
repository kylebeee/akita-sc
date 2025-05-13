import { abimethod, Application, assert, Asset, Bytes, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from "polytype"
import { Proof } from "../../../utils/types/merkles"
import { abiCall, Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4"
import { ERR_AUCTION_PRIZE_CANNOT_BE_ALGO, ERR_CREATOR_NOT_AUCTION_FACTORY, ERR_NOT_ENOUGH_ASSET } from "./errors"
import { AssetHolding, btoi, Global } from "@algorandfoundation/algorand-typescript/op"
import { AuctionFactory } from "../../../auction/factory.algo"
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants"
import { BaseAuction } from "../../../auction/base"
import { Auction } from "../../../auction/contract.algo"
import { AuctionGlobalStateKeyBidAsset, AuctionGlobalStateKeyBidFee } from "../../../auction/constants"
import { GateArgs } from "../../../utils/types/gates"
import { AuctionPluginGlobalStateKeyFactory } from "./constants"
import { fmbr, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"
import { fee } from "../../../utils/constants"

export class AuctionPlugin extends classes(BaseAuction, AkitaBaseContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: AuctionPluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, factory: uint64, akitaDAO: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
    this.akitaDAO.value = Application(akitaDAO)
  }

  // AUCTION PLUGIN METHODS -----------------------------------------------------------------------

  new(
    walletID: uint64,
    rekeyBack: boolean,
    prizeID: uint64,
    prizeAmount: uint64,
    name: string,
    proof: Proof,
    bidAssetID: uint64,
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endtimestamp: uint64,
    gateID: uint64,
    marketplace: Address,
    weightsListCount: uint64,
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(prizeID !== 0, ERR_AUCTION_PRIZE_CANNOT_BE_ALGO)
    const senderPrizeBalance = AssetHolding.assetBalance(sender, prizeID)[0]
    assert(senderPrizeBalance >= prizeAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(prizeID))) {
      abiCall(
        AuctionFactory.prototype.optin,
        {
          sender,
          appId: this.factory.value,
          args: [
            itxn.payment({
              sender,
              receiver: this.factory.value.address,
              amount: Global.assetOptInMinBalance,
              fee,
            }),
            prizeID,
          ],
          fee,
        }
      )
    }

    if (!this.factory.value.address.isOptedIn(Asset(bidAssetID))) {
      abiCall(
        AuctionFactory.prototype.optin,
        {
          sender,
          appId: this.factory.value,
          args: [
            itxn.payment({
              sender,
              receiver: this.factory.value.address,
              amount: Global.assetOptInMinBalance,
              fee,
            }),
            bidAssetID,
          ],
          fee,
        }
      )
    }

    const isAlgoBid = bidAssetID === 0
    const optinMBR: uint64 = isAlgoBid
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const fcosts = fmbr()
    const costs = this.mbr()

    const auction = compileArc4(Auction)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * auction.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * auction.globalBytes) +
      AccountMinimumBalance +
      optinMBR +
      (weightsListCount * costs.weights) +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR,
      fee,
    })

    const prizeTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.factory.value.address,
      assetAmount: prizeAmount,
      xferAsset: Asset(prizeID),
      fee,
    })

    const newAuction = abiCall(
      AuctionFactory.prototype.newAuction,
      {
        sender,
        appId: this.factory.value,
        args: [
          mbrTxn,
          prizeTxn,
          name,
          proof,
          bidAssetID,
          bidFee,
          startingBid,
          bidMinimumIncrease,
          startTimestamp,
          endtimestamp,
          gateID,
          marketplace,
          weightsListCount
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee
      }
    ).returnValue

    return newAuction
  }

  clearWeightsBoxes(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64,
    iterationAmount: uint64
  ): void {
    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Auction.prototype.clearWeightsBoxes,
      {
        sender,
        appId: this.factory.value,
        args: [iterationAmount],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  deleteAuctionApp(
    walletID: uint64,
    rekeyBack: boolean,
    creator: Address,
    auctionAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      AuctionFactory.prototype.deleteAuctionApp,
      {
        sender,
        appId: this.factory.value,
        args: [auctionAppID],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  bid(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64,
    amount: uint64,
    args: GateArgs,
    marketplace: Address
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    const { bids, bidsByAddress, locations } = this.mbr()
    let mbr = bids
    const bidFee = btoi(op.AppGlobal.getExBytes(auctionAppID, Bytes(AuctionGlobalStateKeyBidFee))[0])
    if (bidFee > 0) {
      const hasBid = abiCall(
        Auction.prototype.hasBid,
        {
          sender,
          appId: auctionAppID,
          args: [new Address(sender)],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      ).returnValue

      if (!hasBid) {
        mbr += (bidsByAddress + locations)
      }
    }

    const bidAsset = Asset(btoi(op.AppGlobal.getExBytes(auctionAppID, Bytes(AuctionGlobalStateKeyBidAsset))[0]))
    if (bidAsset.id === 0) {
      abiCall(
        Auction.prototype.bid,
        {
          sender,
          appId: auctionAppID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(auctionAppID).address,
              amount: amount + mbr,
              fee,
            }),
            args,
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    } else {
      const mbrTxn = itxn.payment({
        sender,
        receiver: Application(auctionAppID).address,
        amount: mbr,
        fee,
      })

      const xferTxn = itxn.assetTransfer({
        sender,
        assetReceiver: Application(auctionAppID).address,
        assetAmount: amount,
        xferAsset: bidAsset,
        fee,
      })

      abiCall(
        Auction.prototype.bidAsa,
        {
          sender,
          appId: auctionAppID,
          args: [
            mbrTxn,
            xferTxn,
            args,
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    }
  }

  refundBid(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64,
    id: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.refundBid,
      {
        sender,
        appId: auctionAppID,
        args: [id],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  claimPrize(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.claimPrize,
      {
        sender,
        appId: auctionAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  claimRafflePrize(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.claimRafflePrize,
      {
        sender,
        appId: auctionAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  raffle(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64
  ): void {
    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Auction.prototype.raffle,
      {
        sender,
        appId: auctionAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  findWinner(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64,
    iterationAmount: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.findWinner,
      {
        sender,
        appId: auctionAppID,
        args: [iterationAmount],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  deleteApplication(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.deleteApplication,
      {
        sender,
        appId: auctionAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  cancel(
    walletID: uint64,
    rekeyBack: boolean,
    auctionAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall(
      Auction.prototype.cancel,
      {
        sender,
        appId: auctionAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}
