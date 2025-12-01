import { Account, Application, assert, Asset, Box, bytes, Global, gtxn, itxn, itxnCompose, OnCompleteAction, TransactionType, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, abimethod, encodeArc4, methodSelector, Uint8 } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { GateMustCheckAbiMethod } from "../../../gates/constants"
import { GateArgs } from "../../../gates/types"
import { SubscriptionID, SubscriptionKey } from "../../../subscriptions/types"
import { getAccounts, getAkitaAppList, getSpendingAccount, getWalletIDUsingAkitaDAO, originOr, rekeyAddress } from "../../../utils/functions"
import { CID } from "../../../utils/types/base"

// CONTRACT IMPORTS
import { BaseSubscriptions } from "../../../subscriptions/base"
import { MAX_DESCRIPTION_CHUNK_SIZE, MAX_DESCRIPTION_LENGTH } from "../../../subscriptions/constants"
import type { Subscriptions } from "../../../subscriptions/contract.algo"
import { ERR_BAD_DESCRIPTION_LENGTH } from "../../../subscriptions/errors"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"
import { ERR_INVALID_CALL_ORDER } from "../../../utils/errors"
import { BoxKeySubscriptionsDescription } from "./constants"
import { ERR_DESCRIPTION_NOT_INITIALIZED } from "./errors"

export class SubscriptionsPlugin extends classes(BaseSubscriptions, AkitaBaseContract) {

  // temporary storage for new service calls
  description = Box<bytes>({ key: BoxKeySubscriptionsDescription })

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

    abiCall<typeof Subscriptions.prototype.optIn>({
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

  initDescription(wallet: Application, size: uint64): void {
    assert(size <= MAX_DESCRIPTION_LENGTH, ERR_BAD_DESCRIPTION_LENGTH)
    if (!this.description.exists) {
      this.description.create({ size })
    } else {
      this.description.resize(size)
    }
  }

  loadDescription(wallet: Application, offset: uint64, data: bytes): void {
    assert(offset + data.length <= MAX_DESCRIPTION_LENGTH, ERR_BAD_DESCRIPTION_LENGTH)
    const expectedPreviousCalls: uint64 = offset / MAX_DESCRIPTION_CHUNK_SIZE
    const txn = gtxn.Transaction(Txn.groupIndex - expectedPreviousCalls - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 3
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector(this.initDescription)
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)
    assert(this.description.exists, ERR_DESCRIPTION_NOT_INITIALIZED)

    this.description.replace(offset, data)
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

    const txn = gtxn.Transaction(Txn.groupIndex - 1)
    // require loadDescription to be called first
    assert(
      Txn.groupIndex > 2 && // [arc58_rekeyToPlugin, initDescription, loadDescription]
      txn.type === TransactionType.ApplicationCall &&
      txn.appId === Global.currentApplicationId &&
      txn.numAppArgs === 4 &&
      txn.onCompletion === OnCompleteAction.NoOp &&
      txn.appArgs(0) === methodSelector(this.loadDescription),
      ERR_INVALID_CALL_ORDER
    )

    const appId = Application(getAkitaAppList(this.akitaDAO.value).subscriptions)

    const cost = abiCall<typeof Subscriptions.prototype.newServiceCost>({
      sender,
      appId,
      args: [asset],
    }).returnValue

    itxnCompose.begin<typeof Subscriptions.prototype.newService>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: cost,
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
      ]
    })

    const size = this.description.length
    if (size > MAX_DESCRIPTION_CHUNK_SIZE) {
      const chunk = this.description.extract(0, MAX_DESCRIPTION_CHUNK_SIZE)

      itxnCompose.next<typeof Subscriptions.prototype.setServiceDescription>({
        sender,
        appId,
        args: [0, chunk],
      })

      itxnCompose.next<typeof Subscriptions.prototype.setServiceDescription>({
        sender,
        appId,
        args: [0, this.description.extract(MAX_DESCRIPTION_CHUNK_SIZE, size - MAX_DESCRIPTION_CHUNK_SIZE)],
      })

    } else {
      const chunk = this.description.extract(0, size)

      itxnCompose.next<typeof Subscriptions.prototype.setServiceDescription>({
        sender,
        appId,
        args: [0, chunk],
      })
    }

    itxnCompose.next<typeof Subscriptions.prototype.activateService>({
      sender,
      appId,
      args: [],
    })

    itxnCompose.submit()

    const id = abiCall<typeof Subscriptions.prototype.getServiceList>({
      sender,
      appId,
      args: [sender],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue

    // we cant get the id back from our newService call due to the way itxnCompose works
    // so instead we can get the id incrementor and subtract 1 to get the latest created service id
    // for the user
    return (id - 1)
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
        args: [{ address, id }],
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
          { address, id }
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Subscriptions.prototype.triggerPayment>({
        sender,
        appId,
        args: [{ address, id }],
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
