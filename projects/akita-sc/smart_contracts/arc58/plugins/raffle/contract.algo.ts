import { abimethod, Application, assert, Asset, Bytes, itxn, op, TemplateVar, uint64 } from "@algorandfoundation/algorand-typescript"
import { Plugin } from "../../../utils/base-contracts/plugin"
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

const raffle = compileArc4(Raffle)

const factoryApp = TemplateVar<Application>('FACTORY_APP')

export class RafflePlugin extends classes(
  Plugin,
  BaseRaffle,
  ServiceFactoryContract
) {

  @abimethod({ onCreate: 'require' })
  createApplication(version: string): void {
    this.version.value = version
  }

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
    weightsListCount: uint64,
  ): Application {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)
    const senderPrizeBalance = AssetHolding.assetBalance(sender, prizeID)[0]
    assert(senderPrizeBalance >= prizeAmount, ERR_NOT_ENOUGH_ASSET)

    if (!factoryApp.address.isOptedIn(Asset(prizeID))) {
      abiCall(
        RaffleFactory.prototype.optin,
        {
          sender,
          appId: factoryApp,
          args: [
            itxn.payment({
              sender,
              receiver: factoryApp.address,
              amount: Global.assetOptInMinBalance,
              fee: 0,
            }),
            prizeID,
          ],
          fee: 0,
        }
      )
    }

    let optinMBR = 0
    const prizeAssetIsAlgo = prizeID === 0
    if (prizeAssetIsAlgo) {
      optinMBR = Global.assetOptInMinBalance
    }

    const ticketAssetIsAlgo = ticketAssetID === 0
    if (ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const fcosts = this.fmbr()
    const costs = this.mbr()

    const childContractMBR = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      AccountMinimumBalance +
      optinMBR +
      (weightsListCount * costs.weights) +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: factoryApp.address,
      amount: childContractMBR,
      fee: 0,
    })

    const prizeTxn = itxn.assetTransfer({
      sender,
      assetReceiver: factoryApp.address,
      assetAmount: prizeAmount,
      xferAsset: prizeID,
      fee: 0,
    })

    const raffleApp = abiCall(
      RaffleFactory.prototype.newRaffle,
      {
        sender,
        appId: factoryApp,
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
          weightsListCount
        ],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    ).returnValue

    return Application(raffleApp)
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
    weightsListCount: uint64,
  ): Application {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(super.getPrizeBoxOwner(Application(prizeBoxID)) === sender, ERR_NOT_PRIZE_BOX_OWNER)

    abiCall(
      PrizeBox.prototype.transfer,
      {
        sender,
        appId: prizeBoxID,
        args: [new Address(factoryApp.address)],
        fee: 0,
      }
    )

    let optinMBR = 0
    const ticketAssetIsAlgo = ticketAssetID === 0
    if (ticketAssetIsAlgo) {
      optinMBR += Global.assetOptInMinBalance
    }

    const fcosts = this.fmbr()
    const costs = this.mbr()

    const childContractMBR = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * raffle.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * raffle.globalBytes) +
      AccountMinimumBalance +
      optinMBR +
      (weightsListCount * costs.weights) +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: factoryApp.address,
      amount: childContractMBR,
      fee: 0,
    })

    const raffleApp = abiCall(
      RaffleFactory.prototype.newPrizeBoxRaffle,
      {
        sender,
        appId: factoryApp,
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
          weightsListCount
        ],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    ).returnValue

    return Application(raffleApp)
  }

  enter(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
    amount: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    const { entries, entriesByAddress } = this.mbr()
    const mbr = entries + entriesByAddress

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
              fee: 0,
            }),
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
              fee: 0,
            }),
            itxn.assetTransfer({
              sender,
              assetReceiver: Application(raffleAppID).address,
              assetAmount: amount,
              xferAsset: ticketAsset,
              fee: 0,
            }),
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

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
              fee: 0,
            }),
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
              fee: 0,
            }),
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.raffle,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
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
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.findWinner,
      {
        sender,
        appId: raffleAppID,
        args: [iterationAmount],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  claimRafflePrize(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.claimRafflePrize,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  deleteRaffleApplication(
    walletID: uint64,
    rekeyBack: boolean,
    raffleAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(Application(raffleAppID).creator === factoryApp.address, ERR_CREATOR_NOT_RAFFLE_FACTORY)

    abiCall(
      Raffle.prototype.deleteApplication,
      {
        sender,
        appId: raffleAppID,
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
