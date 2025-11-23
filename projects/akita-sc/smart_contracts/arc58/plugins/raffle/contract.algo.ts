import { abimethod, Account, Application, assert, Asset, Bytes, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4"
import { AssetHolding, btoi, Global } from "@algorandfoundation/algorand-typescript/op"
import { classes } from "polytype"
import { GateArgs } from "../../../gates/types"
import { RaffleGlobalStateKeyTicketAsset } from "../../../raffle/constants"
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants"
import { ERR_NOT_PRIZE_BOX_OWNER } from "../../../utils/errors"
import { getPrizeBoxOwner, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { Proof } from "../../../utils/types/merkles"
import { RafflePluginGlobalStateKeyFactory } from "./constants"
import { ERR_CREATOR_NOT_RAFFLE_FACTORY, ERR_NOT_ENOUGH_ASSET } from "./errors"

// CONTRACT IMPORTS
import type { PrizeBox } from "../../../prize-box/contract.algo"
import { BaseRaffle } from "../../../raffle/base"
import { Raffle } from "../../../raffle/contract.algo"
import type { RaffleFactory } from "../../../raffle/factory.algo"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"


export class RafflePlugin extends classes(BaseRaffle, AkitaBaseContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: RafflePluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: Application): void {
    this.version.value = version
    this.factory.value = factory
  }

  // RAFFLE PLUGIN METHODS ------------------------------------------------------------------------

  newRaffle(
    wallet: Application,
    rekeyBack: boolean,
    prizeID: uint64, // 0 | Asset
    prizeAmount: uint64,
    ticketAssetID: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Account,
    name: string,
    proof: Proof,
    weightsListCount: uint64
  ): uint64 {
    const sender = getSpendingAccount(wallet)
    const senderPrizeBalance = AssetHolding.assetBalance(sender, prizeID)[0]
    assert(senderPrizeBalance >= prizeAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(prizeID))) {
      abiCall<typeof RaffleFactory.prototype.optin>({
        sender,
        appId: this.factory.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.factory.value.address,
            amount: Global.assetOptInMinBalance,
          }),
          prizeID,
        ],
      })
    }

    let optinMBR: uint64 = 0
    const prizeAssetIsAlgo = prizeID === 0
    if (!prizeAssetIsAlgo) {
      optinMBR = Global.assetOptInMinBalance
    }

    const ticketAssetIsAlgo = ticketAssetID === 0
    if (!ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const raffle = compileArc4(Raffle)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      Global.minBalance +
      optinMBR
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR,
    })

    const prizeTxn = itxn.assetTransfer({
      sender,
      assetReceiver: this.factory.value.address,
      assetAmount: prizeAmount,
      xferAsset: prizeID,
    })

    const raffleApp = abiCall<typeof RaffleFactory.prototype.newRaffle>({
      sender,
      appId: this.factory.value,
      args: [
        mbrTxn,
        prizeTxn,
        ticketAssetID,
        startTimestamp,
        endTimestamp,
        minTickets,
        maxTickets,
        gateID,
        marketplace,
        name,
        proof,
        weightsListCount
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue

    return raffleApp
  }

  newPrizeBoxRaffle(
    wallet: Application,
    rekeyBack: boolean,
    prizeBox: Application,
    ticketAssetID: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Account,
    weightsListCount: uint64
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    assert(getPrizeBoxOwner(this.akitaDAO.value, prizeBox) === sender, ERR_NOT_PRIZE_BOX_OWNER)

    abiCall<typeof PrizeBox.prototype.transfer>({
      sender,
      appId: prizeBox,
      args: [this.factory.value.address],
    })

    let optinMBR: uint64 = 0
    const ticketAssetIsAlgo = ticketAssetID === 0
    if (ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const raffle = compileArc4(Raffle)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      Global.minBalance +
      optinMBR
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR,
    })

    const raffleApp = abiCall<typeof RaffleFactory.prototype.newPrizeBoxRaffle>({
      sender,
      appId: this.factory.value,
      args: [
        mbrTxn,
        prizeBox,
        ticketAssetID,
        startTimestamp,
        endTimestamp,
        minTickets,
        maxTickets,
        gateID,
        marketplace,
        weightsListCount
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue

    return raffleApp
  }

  enter(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    amount: uint64,
    marketplace: Account,
    args: GateArgs
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    const { entries, entriesByAddress } = this.mbr()
    const mbr: uint64 = entries + entriesByAddress

    const ticketAsset = Asset(btoi(op.AppGlobal.getExBytes(appId, Bytes(RaffleGlobalStateKeyTicketAsset))[0]))
    if (ticketAsset.id === 0) {
      abiCall<typeof Raffle.prototype.enter>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount + mbr,
          }),
          marketplace,
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Raffle.prototype.enterAsa>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: mbr,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: appId.address,
            assetAmount: amount,
            xferAsset: ticketAsset,
          }),
          marketplace,
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  add(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    amount: uint64,
    args: GateArgs
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    const ticketAsset = Asset(btoi(op.AppGlobal.getExBytes(appId, Bytes(RaffleGlobalStateKeyTicketAsset))[0]))
    if (ticketAsset.id === 0) {
      abiCall<typeof Raffle.prototype.add>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount,
          }),
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Raffle.prototype.addAsa>({
        sender,
        appId,
        args: [
          itxn.assetTransfer({
            sender,
            assetReceiver: appId.address,
            assetAmount: amount,
            xferAsset: ticketAsset,
          }),
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  raffle(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall<typeof Raffle.prototype.raffle>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  findWinner(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    iterationAmount: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall<typeof Raffle.prototype.findWinner>({
      sender,
      appId,
      args: [iterationAmount],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  claimRafflePrize(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall<typeof Raffle.prototype.claimRafflePrize>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  deleteRaffleApplication(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall<typeof Raffle.prototype.deleteApplication>({
      sender,
      appId,
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
