import { Application, Asset, Global, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from 'polytype'
import { BaseSubscriptions } from "../../../subscriptions/base"
import { CID } from "../../../utils/types/base"
import { abiCall, abimethod, Address, encodeArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4"
import { Subscriptions } from "../../../subscriptions/contract.algo"
import { GateArgs, GateInterface } from "../../../utils/types/gates"
import { getAccounts, getAkitaAppList, getSpendingAccount, getSubscriptionFees, getWalletIDUsingAkitaDAO, originOr, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class SubscriptionsPlugin extends classes(BaseSubscriptions, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
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
          }),
          asset,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
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
          }),
          interval,
          asset,
          amount,
          passes,
          gate,
          cid,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
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
          }),
          address,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
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
    const { origin, sender } = getAccounts(wallet)

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
      }
    ).returnValue

    if (firstSubscription) {
      mbrAmount += costs.subscriptionslist
    }

    if (args.length > 0) {

      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const service = abiCall(
        Subscriptions.prototype.getService,
        {
          sender,
          appId: subscriptionsApp,
          args: [recipient, index],
        }
      ).returnValue

      const gateTxn = itxn.applicationCall({
        sender,
        appId: gate,
        appArgs: [
          methodSelector(GateInterface.prototype.mustCheck),
          new Address(origin),
          service.gateID,
          encodeArc4(args)
        ]
      })

      abiCall(
        Subscriptions.prototype.gatedSubscribe,
        {
          sender,
          appId: subscriptionsApp,
          args: [
            itxn.payment({
              sender,
              receiver: subscriptionsApp.address,
              amount: amount + mbrAmount,
            }),
            gateTxn,
            recipient,
            amount,
            interval,
            index,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
        }
      )
    } else {
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
            }),
            recipient,
            amount,
            interval,
            index,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
        }
      )
    }
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
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: subscriptionsApp.address,
            xferAsset: asset,
            assetAmount: amount,
          }),
          recipient,
          amount,
          interval,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
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

    if (args.length > 0) {
      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const subWallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, address.native)
      const subOrigin = originOr(subWallet, address.native)

      const sub = abiCall(
        Subscriptions.prototype.getSubscription,
        {
          sender,
          appId: subscriptionsApp,
          args: [address, index],
        }
      ).returnValue

      abiCall(
        Subscriptions.prototype.gatedTriggerPayment,
        {
          sender,
          appId: subscriptionsApp,
          args: [
            itxn.applicationCall({
              sender,
              appId: gate,
              appArgs: [
                methodSelector(GateInterface.prototype.mustCheck),
                new Address(subOrigin),
                sub.gateID,
                encodeArc4(args)
              ]
            }),
            address,
            index,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
        }
      )
    } else {
      abiCall(
        Subscriptions.prototype.triggerPayment,
        {
          sender,
          appId: subscriptionsApp,
          args: [address, index],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
        }
      )
    }
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
      }
    )
  }

  setPasses(
    walletID: uint64,
    rekeyBack: boolean,
    index: uint64,
    addresses: Address[]
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
      }
    )
  }
}
