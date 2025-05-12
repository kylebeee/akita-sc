import { Application, Asset, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from 'polytype'
import { BaseSubscriptions } from "../../../subscriptions/base"
import { CID } from "../../../utils/types/base"
import { Addresses } from "../../../subscriptions/types"
import { abiCall, abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4"
import { Subscriptions } from "../../../subscriptions/contract.algo"
import { GateArgs } from "../../../utils/types/gates"
import { getAkitaAppList, getSpendingAccount, getSubscriptionFees, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class SubscriptionsPlugin extends classes(BaseSubscriptions, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // SUBSCRIPTIONS PLUGIN METHODS -----------------------------------------------------------------

  optin(
    walletID: uint64,
    rekeyBack: boolean,
    asset: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.optin,
      {
        sender,
        appId: subscriptionsApp,
        args: [
          itxn.payment({
            sender,
            receiver: subscriptionsApp.address,
            amount: Global.assetOptInMinBalance,
            fee: 0,
          }),
          asset,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  newService(
    walletID: uint64,
    rekeyBack: boolean,
    interval: uint64,
    asset: uint64,
    amount: uint64,
    passes: uint64,
    gate: uint64,
    cid: CID
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const fee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee

    return abiCall(
      Subscriptions.prototype.newService,
      {
        sender,
        appId: subscriptionsApp,
        args: [
          itxn.payment({
            sender,
            receiver: subscriptionsApp.address,
            amount: fee,
            fee: 0,
          }),
          interval,
          asset,
          amount,
          passes,
          gate,
          cid,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    ).returnValue
  }

  pauseService(
    walletID: uint64,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.pauseService,
      {
        sender,
        appId: subscriptionsApp,
        args: [index],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  activateService(
    walletID: uint64,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.activateService,
      {
        sender,
        appId: subscriptionsApp,
        args: [index],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  shutdownService(
    walletID: uint64,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.shutdownService,
      {
        sender,
        appId: subscriptionsApp,
        args: [index],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  block(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.block,
      {
        sender,
        appId: subscriptionsApp,
        args: [
          itxn.payment({
            sender,
            receiver: subscriptionsApp.address,
            amount: this.mbr(0).blocks,
            fee: 0,
          }),
          address,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  unblock(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.unblock,
      {
        sender,
        appId: subscriptionsApp,
        args: [address],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  subscribe(
    walletID: uint64,
    rekeyBack: boolean,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall(
      Subscriptions.prototype.isFirstSubscription,
      {
        sender,
        appId: subscriptionsApp,
        args: [new Address(sender)],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    ).returnValue

    if (firstSubscription) {
      mbrAmount += costs.subscriptionslist
    }

    abiCall(
      Subscriptions.prototype.subscribe,
      {
        sender,
        appId: subscriptionsApp,
        args: [
          itxn.payment({
            sender,
            receiver: subscriptionsApp.address,
            amount: amount + mbrAmount,
            fee: 0,
          }),
          recipient,
          amount,
          interval,
          index,
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  subscribeAsa(
    walletID: uint64,
    rekeyBack: boolean,
    asset: uint64,
    recipient: Address,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall(
      Subscriptions.prototype.isFirstSubscription,
      {
        sender,
        appId: subscriptionsApp,
        args: [new Address(sender)],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    ).returnValue

    if (firstSubscription) {
      mbrAmount += costs.subscriptionslist
    }

    if (!this.akitaDAO.value.address.isOptedIn(Asset(asset))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    abiCall(
      Subscriptions.prototype.subscribeAsa,
      {
        sender,
        appId: subscriptionsApp,
        args: [
          itxn.payment({
            sender,
            receiver: subscriptionsApp.address,
            amount: mbrAmount + amount,
            fee: 0,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: subscriptionsApp.address,
            xferAsset: asset,
            assetAmount: amount,
            fee: 0,
          }),
          recipient,
          amount,
          interval,
          index,
          args,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  triggerPayment(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address,
    index: uint64,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.triggerPayment,
      {
        sender,
        appId: subscriptionsApp,
        args: [address, index, args],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  streakCheck(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address,
    index: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall(
      Subscriptions.prototype.streakCheck,
      {
        sender,
        appId: subscriptionsApp,
        args: [address, index],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  setPasses(
    walletID: uint64,
    rekeyBack: boolean,
    index: uint64,
    addresses: Addresses
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const subscriptionsApp = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)
    abiCall(
      Subscriptions.prototype.setPasses,
      {
        sender,
        appId: subscriptionsApp,
        args: [index, addresses],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
