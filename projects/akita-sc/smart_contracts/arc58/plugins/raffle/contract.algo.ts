import { abimethod, Application, assert, Asset, Bytes, GlobalState, itxn, op, TemplateVar, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from "polytype"

import { abiCall, Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4"

import { AssetHolding, btoi, Global } from "@algorandfoundation/algorand-typescript/op"
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants"

import { ServiceFactoryContract } from "../../../utils/base-contracts/factory"

import { BaseRaffle } from "../../../raffle/base"
import { ERR_CREATOR_NOT_RAFFLE_FACTORY, ERR_NOT_ENOUGH_ASSET } from "./errors"
import { RaffleFactory } from "../../../raffle/factory.algo"
import { Raffle } from "../../../raffle/contract.algo"
import { GateArgs } from "../../../utils/types/gates"
import { RaffleGlobalStateKeyTicketAsset } from "../../../raffle/constants"
import { ERR_NOT_PRIZE_BOX_OWNER } from "../../../utils/errors"
import { PrizeBox } from "../../../prize-box/contract.algo"
import { RafflePluginGlobalStateKeyFactory } from "./constants"
import { fmbr, getPrizeBoxOwner, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { fee } from "../../../utils/constants"

export class RafflePlugin extends classes(BaseRaffle, ServiceFactoryContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: RafflePluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
  }

  // RAFFLE PLUGIN METHODS ------------------------------------------------------------------------

  newRaffle(
    walletID: uint64,
    rekeyBack: boolean,
    prizeID: uint64,
    prizeAmount: uint64,
    ticketAssetID: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address,
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    const senderPrizeBalance = AssetHolding.assetBalance(sender, prizeID)[0]
    assert(senderPrizeBalance >= prizeAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(prizeID))) {
      abiCall(
        RaffleFactory.prototype.optin,
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

    let optinMBR: uint64 = 0
    const prizeAssetIsAlgo = prizeID === 0
    if (prizeAssetIsAlgo) {
      optinMBR = Global.assetOptInMinBalance
    }

    const ticketAssetIsAlgo = ticketAssetID === 0
    if (ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const fcosts = fmbr()
    const costs = this.mbr()

    const raffle = compileArc4(Raffle)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      AccountMinimumBalance +
      optinMBR +
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
      xferAsset: prizeID,
      fee,
    })

    const raffleApp = abiCall(
      RaffleFactory.prototype.newRaffle,
      {
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
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    ).returnValue

    return raffleApp
  }

  newPrizeBoxRaffle(
    walletID: uint64,
    rekeyBack: boolean,
    prizeBoxID: uint64,
    ticketAssetID: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64,
    minTickets: uint64,
    maxTickets: uint64,
    gateID: uint64,
    marketplace: Address,
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(getPrizeBoxOwner(this.akitaDAO.value, Application(prizeBoxID)) === sender, ERR_NOT_PRIZE_BOX_OWNER)

    abiCall(
      PrizeBox.prototype.transfer,
      {
        sender,
        appId: prizeBoxID,
        args: [new Address(this.factory.value.address)],
        fee,
      }
    )

    let optinMBR: uint64 = 0
    const ticketAssetIsAlgo = ticketAssetID === 0
    if (ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const fcosts = fmbr()

    const raffle = compileArc4(Raffle)

    const childContractMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      AccountMinimumBalance +
      optinMBR +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR,
      fee,
    })

    const raffleApp = abiCall(
      RaffleFactory.prototype.newPrizeBoxRaffle,
      {
        sender,
        appId: this.factory.value,
        args: [
          mbrTxn,
          prizeBoxID,
          ticketAssetID,
          startTimestamp,
          endTimestamp,
          minTickets,
          maxTickets,
          gateID,
          marketplace,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    ).returnValue

    return raffleApp
  }

  enter(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
    amount: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    const { entries, entriesByAddress } = this.mbr()
    const mbr: uint64 = entries + entriesByAddress

    const ticketAsset = Asset(btoi(op.AppGlobal.getExBytes(raffleAppID, Bytes(RaffleGlobalStateKeyTicketAsset))[0]))
    if (ticketAsset.id === 0) {
      abiCall(
        Raffle.prototype.enter,
        {
          sender,
          appId: raffleAppID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(raffleAppID).address,
              amount: amount + mbr,
              fee,
            }),
            args,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    } else {
      abiCall(
        Raffle.prototype.enterAsa,
        {
          sender,
          appId: raffleAppID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(raffleAppID).address,
              amount: mbr,
              fee,
            }),
            itxn.assetTransfer({
              sender,
              assetReceiver: Application(raffleAppID).address,
              assetAmount: amount,
              xferAsset: ticketAsset,
              fee,
            }),
            args,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    }
  }

  add(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
    amount: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    const ticketAsset = Asset(btoi(op.AppGlobal.getExBytes(raffleAppID, Bytes(RaffleGlobalStateKeyTicketAsset))[0]))
    if (ticketAsset.id === 0) {
      abiCall(
        Raffle.prototype.add,
        {
          sender,
          appId: raffleAppID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(raffleAppID).address,
              amount: amount,
              fee,
            }),
            args,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    } else {
      abiCall(
        Raffle.prototype.addAsa,
        {
          sender,
          appId: raffleAppID,
          args: [
            itxn.assetTransfer({
              sender,
              assetReceiver: Application(raffleAppID).address,
              assetAmount: amount,
              xferAsset: ticketAsset,
              fee,
            }),
            args,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    }
  }

  raffle(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.raffle,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  findWinner(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
    iterationAmount: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.findWinner,
      {
        sender,
        appId: raffleAppID,
        args: [iterationAmount],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  claimRafflePrize(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.claimRafflePrize,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  deleteRaffleApplication(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === this.factory.value.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.deleteApplication,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}
