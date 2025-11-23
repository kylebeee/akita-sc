import { Account, Application, Asset, bytes, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, abimethod, encodeArc4, methodSelector, Uint8 } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { GateMustCheckAbiMethod } from "../../../gates/constants"
import { GateArgs } from "../../../gates/types"
import { ServiceID, SubscriptionID, SubscriptionKey } from "../../../subscriptions/types"
import { getAccounts, getAkitaAppList, getSpendingAccount, getSubscriptionFees, getWalletIDUsingAkitaDAO, originOr, rekeyAddress } from "../../../utils/functions"
import { CID } from "../../../utils/types/base"

// CONTRACT IMPORTS
import { BaseSubscriptions } from "../../../subscriptions/base"
import type { Subscriptions } from "../../../subscriptions/contract.algo"
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
    wallet: Application,
    rekeyBack: boolean,
    asset: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.optin>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: Global.assetOptInMinBalance,
        }),
        asset,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  newService(
    wallet: Application,
    rekeyBack: boolean,
    interval: uint64,
    asset: uint64,
    amount: uint64,
    passes: uint64,
    gate: uint64,
    title: string,
    bannerImage: CID,
    highlightMessage: Uint8,
    highlightColor: bytes<3>
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const fee = getSubscriptionFees(this.akitaDAO.value).serviceCreationFee

    return abiCall<typeof Subscriptions.prototype.newService>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: fee,
        }),
        interval,
        asset,
        amount,
        passes,
        gate,
        title,
        bannerImage,
        highlightMessage,
        highlightColor,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue
  }

  setServiceDescription(
    wallet: Application,
    rekeyBack: boolean,
    id: ServiceID,
    offset: uint64,
    data: bytes
  ): void {
    const sender = getSpendingAccount(wallet)
    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.setServiceDescription>({
      sender,
      appId,
      args: [
        id,
        offset,
        data,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  } 


  pauseService(
    wallet: Application,
    rekeyBack: boolean,
    id: SubscriptionID
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.pauseService>({
      sender,
      appId,
      args: [id],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  activateService(
    wallet: Application,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.activateService>({
      sender,
      appId,
      args: [index],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  shutdownService(
    wallet: Application,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.shutdownService>({
      sender,
      appId,
      args: [index],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  block(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.block>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: this.mbr().blocks,
        }),
        address,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  unblock(
    wallet: Application,
    rekeyBack: boolean,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.unblock>({
      sender,
      appId,
      args: [address],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  subscribe(
    wallet: Application,
    rekeyBack: boolean,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr()
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall<typeof Subscriptions.prototype.isFirstSubscription>({
      sender,
      appId,
      args: [sender],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue

    if (firstSubscription) {
      mbrAmount += costs.subscriptionslist
    }

    if (args.length > 0) {

      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const service = abiCall<typeof Subscriptions.prototype.getService>({
        sender,
        appId,
        args: [recipient, index],
      }).returnValue

      const gateTxn = itxn.applicationCall({
        sender,
        appId: gate,
        appArgs: [
          methodSelector(GateMustCheckAbiMethod),
          origin,
          service.gateID,
          encodeArc4(args)
        ]
      })

      abiCall<typeof Subscriptions.prototype.gatedSubscribe>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount + mbrAmount,
          }),
          gateTxn,
          recipient,
          amount,
          interval,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Subscriptions.prototype.subscribe>({
        sender,
        appId: appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount + mbrAmount,
          }),
          recipient,
          amount,
          interval,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  subscribeAsa(
    wallet: Application,
    rekeyBack: boolean,
    asset: uint64,
    recipient: Account,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs // TODO: gated subscribeAsa
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr()
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall<typeof Subscriptions.prototype.isFirstSubscription>({
      sender,
      appId,
      args: [sender],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue

    if (firstSubscription) {
      mbrAmount += costs.subscriptionslist
    }

    if (!this.akitaDAO.value.address.isOptedIn(Asset(asset))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    if (args.length > 0) {

      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const service = abiCall<typeof Subscriptions.prototype.getService>({
        sender,
        appId,
        args: [recipient, index],
      }).returnValue

      const gateTxn = itxn.applicationCall({
        sender,
        appId: gate,
        appArgs: [
          methodSelector(GateMustCheckAbiMethod),
          origin,
          service.gateID,
          encodeArc4(args)
        ]
      })

      abiCall<typeof Subscriptions.prototype.gatedSubscribeAsa>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: mbrAmount,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: appId.address,
            xferAsset: asset,
            assetAmount: amount,
          }),
          gateTxn,
          recipient,
          amount,
          interval,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Subscriptions.prototype.subscribe>({
        sender,
        appId: appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount + mbrAmount,
          }),
          recipient,
          amount,
          interval,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  triggerPayment(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    id: SubscriptionID,
    args: GateArgs
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    if (args.length > 0) {
      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const subWallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, address)
      const subOrigin = originOr(subWallet, address)

      const sub = abiCall<typeof Subscriptions.prototype.getSubscription>({
        sender,
        appId,
        args: [{address, id}],
      }).returnValue

      abiCall<typeof Subscriptions.prototype.gatedTriggerPayment>({
        sender,
        appId,
        args: [
          itxn.applicationCall({
            sender,
            appId: gate,
            appArgs: [
              methodSelector(GateMustCheckAbiMethod),
              subOrigin,
              sub.gateID,
              encodeArc4(args)
            ]
          }),
          {address, id}
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Subscriptions.prototype.triggerPayment>({
        sender,
        appId,
        args: [{address, id}],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  streakCheck(
    wallet: Application,
    rekeyBack: boolean,
    key: SubscriptionKey
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.streakCheck>({
      sender,
      appId,
      args: [key],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  setPasses(
    wallet: Application,
    rekeyBack: boolean,
    id: SubscriptionID,
    addresses: Account[]
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)
    abiCall<typeof Subscriptions.prototype.setPasses>({
      sender,
      appId,
      args: [id, addresses],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
