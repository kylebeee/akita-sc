import { abimethod, Account, Application, assert, Asset, Bytes, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, compileArc4, encodeArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4"
import { AssetHolding, btoi, Global } from "@algorandfoundation/algorand-typescript/op"
import { classes } from "polytype"
import { AuctionGlobalStateKeyBidAsset, AuctionGlobalStateKeyBidFee, AuctionGlobalStateKeyGateID } from "../../../auction/constants"
import { GateMustCheckAbiMethod } from "../../../gates/constants"
import { GateArgs } from "../../../gates/types"
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants"
import { getAccounts, getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { Proof } from "../../../utils/types/merkles"
import { AuctionPluginGlobalStateKeyFactory } from "./constants"
import { ERR_AUCTION_PRIZE_CANNOT_BE_ALGO, ERR_CREATOR_NOT_AUCTION_FACTORY, ERR_NOT_ENOUGH_ASSET } from "./errors"

// CONTRACT IMPORTS
import { BaseAuction } from "../../../auction/base"
import { Auction } from "../../../auction/contract.algo"
import type { AuctionFactory } from "../../../auction/factory.algo"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"


export class AuctionPlugin extends classes(BaseAuction, AkitaBaseContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: AuctionPluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: uint64, akitaDAO: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
    this.akitaDAO.value = Application(akitaDAO)
  }

  // AUCTION PLUGIN METHODS -----------------------------------------------------------------------

  new(
    wallet: Application,
    rekeyBack: boolean,
    prizeID: uint64, // 0 | Asset | Application
    prizeAmount: uint64,
    name: string,
    proof: Proof,
    bidAssetID: uint64, // 0 | Asset
    bidFee: uint64,
    startingBid: uint64,
    bidMinimumIncrease: uint64,
    startTimestamp: uint64,
    endtimestamp: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64,
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    assert(prizeID !== 0, ERR_AUCTION_PRIZE_CANNOT_BE_ALGO)
    const senderPrizeBalance = AssetHolding.assetBalance(sender, prizeID)[0]
    assert(senderPrizeBalance >= prizeAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(prizeID))) {
      abiCall<typeof AuctionFactory.prototype.optIn>({
        sender,
        appId: this.factory.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.factory.value.address,
            amount: Global.assetOptInMinBalance
          }),
          Asset(prizeID),
        ]
      })
    }

    if (!this.factory.value.address.isOptedIn(Asset(bidAssetID))) {
      abiCall<typeof AuctionFactory.prototype.optIn>({
        sender,
        appId: this.factory.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.factory.value.address,
            amount: Global.assetOptInMinBalance
          }),
          Asset(bidAssetID),
        ]
      })
    }

    const isAlgoBid = bidAssetID === 0
    const optinMBR: uint64 = isAlgoBid
      ? Global.assetOptInMinBalance
      : Global.assetOptInMinBalance * 2

    const costs = this.mbr()

    const auction = compileArc4(Auction)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * auction.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * auction.globalBytes) +
      Global.minBalance +
      optinMBR +
      (weightsListCount * costs.weights)
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR
    })

    const prizeTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.factory.value.address,
      assetAmount: prizeAmount,
      xferAsset: Asset(prizeID)
    })

    const newAuction = abiCall<typeof AuctionFactory.prototype.newAuction>({
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
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    }).returnValue

    return newAuction
  }

  clearWeightsBoxes(
    wallet: Application,
    rekeyBack: boolean,
    auctionAppID: uint64,
    iterationAmount: uint64
  ): void {
    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Auction.prototype.clearWeightsBoxes>({
      sender,
      appId: this.factory.value,
      args: [iterationAmount],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  deleteAuctionApp(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof AuctionFactory.prototype.deleteAuctionApp>({
      sender,
      appId: this.factory.value,
      args: [appId],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  bid(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    amount: uint64,
    args: GateArgs,
    marketplace: Account
  ): void {
    const { origin, sender } = getAccounts(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    const { bids, bidsByAddress, locations } = this.mbr()
    let mbr = bids
    const bidFee = btoi(op.AppGlobal.getExBytes(appId, Bytes(AuctionGlobalStateKeyBidFee))[0])
    if (bidFee > 0) {
      const hasBid = abiCall<typeof Auction.prototype.hasBid>({
        sender,
        appId: appId,
        args: [sender],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }).returnValue

      if (!hasBid) {
        mbr += (bidsByAddress + locations)
      }
    }

    const bidAsset = Asset(btoi(op.AppGlobal.getExBytes(appId, Bytes(AuctionGlobalStateKeyBidAsset))[0]))
    if (bidAsset.id === 0) {

      const mbrPayment = itxn.payment({
        sender,
        receiver: appId.address,
        amount: amount + mbr
      })

      if (args.length > 0) {
        const gate = getAkitaAppList(this.akitaDAO.value).gate
        const gateID = op.AppGlobal.getExUint64(appId, Bytes(AuctionGlobalStateKeyGateID))[0]

        abiCall<typeof Auction.prototype.gatedBid>({
          sender,
          appId,
          args: [
            mbrPayment,
            itxn.applicationCall({
              sender,
              appId: gate,
              appArgs: [
                methodSelector(GateMustCheckAbiMethod),
                origin,
                gateID,
                encodeArc4(args)
              ]
            }),
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      } else {
        abiCall<typeof Auction.prototype.bid>({
          sender,
          appId,
          args: [
            mbrPayment,
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      }
    } else {
      const mbrTxn = itxn.payment({
        sender,
        receiver: appId.address,
        amount: mbr
      })

      const xferTxn = itxn.assetTransfer({
        sender,
        assetReceiver: appId.address,
        assetAmount: amount,
        xferAsset: bidAsset
      })

      if (args.length > 0) {
        const gate = getAkitaAppList(this.akitaDAO.value).gate
        const gateID = op.AppGlobal.getExUint64(appId, Bytes(AuctionGlobalStateKeyGateID))[0]

        abiCall<typeof Auction.prototype.gatedBidAsa>({
          sender,
          appId,
          args: [
            mbrTxn,
            xferTxn,
            itxn.applicationCall({
              sender,
              appId: gate,
              appArgs: [
                methodSelector(GateMustCheckAbiMethod),
                origin,
                gateID,
                encodeArc4(args)
              ]
            }),
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      } else {
        abiCall<typeof Auction.prototype.bidAsa>({
          sender,
          appId,
          args: [
            mbrTxn,
            xferTxn,
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      }
    }
  }

  refundBid(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    id: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.refundBid>({
      sender,
      appId,
      args: [id],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  claimPrize(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.claimPrize>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  claimRafflePrize(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.claimRafflePrize>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  raffle(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Auction.prototype.raffle>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  findWinner(
    wallet: Application,
    rekeyBack: boolean,
    auctionAppID: uint64,
    iterationAmount: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(Application(auctionAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.findWinner>({
      sender,
      appId: auctionAppID,
      args: [iterationAmount],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  deleteApplication(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.deleteApplication>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  cancel(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_AUCTION_FACTORY)

    abiCall<typeof Auction.prototype.cancel>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}
