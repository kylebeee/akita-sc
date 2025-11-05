import { Application, Asset, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { classes } from 'polytype'
import { BaseSubscriptions } from "../../../subscriptions/base"
import { CID } from "../../../utils/types/base"
import { abiCall, abimethod, Address, encodeArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4"
import { Subscriptions } from "../../../subscriptions/contract.algo"
import { getAccounts, getAkitaAppList, getSpendingAccount, getSubscriptionFees, getWalletIDUsingAkitaDAO, originOr, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"
import { GateArgs } from "../../../gates/types"
import { GateMustCheckAbiMethod } from "../../../gates/constants"

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
    cid: CID
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
        cid,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue
  }

  pauseService(
    wallet: Application,
    rekeyBack: boolean,
    index: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.pauseService>({
      sender,
      appId,
      args: [index],
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
    address: Address
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
          amount: this.mbr(0).blocks,
        }),
        address,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  unblock(
    wallet: Application,
    rekeyBack: boolean,
    address: Address
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
    recipient: Address,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall<typeof Subscriptions.prototype.isFirstSubscription>({
      sender,
      appId,
      args: [new Address(sender)],
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
          new Address(origin),
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
    recipient: Address,
    amount: uint64,
    interval: uint64,
    index: uint64,
    args: GateArgs // TODO: gated subscribeAsa
  ): void {
    const { origin, sender } = getAccounts(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const costs = this.mbr(0)
    let mbrAmount = costs.subscriptions

    const firstSubscription = abiCall<typeof Subscriptions.prototype.isFirstSubscription>({
      sender,
      appId,
      args: [new Address(sender)],
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
          new Address(origin),
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
    address: Address,
    index: uint64,
    args: GateArgs
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    if (args.length > 0) {
      const gate = getAkitaAppList(this.akitaDAO.value).gate

      const subWallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, address.native)
      const subOrigin = originOr(subWallet, address.native)

      const sub = abiCall<typeof Subscriptions.prototype.getSubscription>({
        sender,
        appId,
        args: [address, index],
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
              new Address(subOrigin),
              sub.gateID,
              encodeArc4(args)
            ]
          }),
          address,
          index,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Subscriptions.prototype.triggerPayment>({
        sender,
        appId,
        args: [address, index],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  streakCheck(
    wallet: Application,
    rekeyBack: boolean,
    address: Address,
    index: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    abiCall<typeof Subscriptions.prototype.streakCheck>({
      sender,
      appId,
      args: [address, index],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  setPasses(
    wallet: Application,
    rekeyBack: boolean,
    index: uint64,
    addresses: Address[]
  ): void {
    const sender = getSpendingAccount(wallet)

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)
    abiCall<typeof Subscriptions.prototype.setPasses>({
      sender,
      appId,
      args: [index, addresses],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
