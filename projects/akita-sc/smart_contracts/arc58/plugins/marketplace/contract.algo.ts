import { Account, Application, assert, Asset, Bytes, GlobalState, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, compileArc4, encodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, Global } from '@algorandfoundation/algorand-typescript/op'
import { GateMustCheckAbiMethod } from '../../../gates/constants'
import { GateArgs } from '../../../gates/types'
import { ListingGlobalStateKeyGateID, ListingGlobalStateKeyPaymentAsset, ListingGlobalStateKeyPrice } from '../../../marketplace/constants'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../../../utils/constants'
import { getAccounts, getAkitaAppList, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { Proof } from '../../../utils/types/merkles'
import { MarketplacePluginGlobalStateKeyFactory } from './constants'
import { ERR_LISTING_CREATOR_NOT_MARKETPLACE, ERR_NOT_ENOUGH_ASSET } from './errors'

// CONTRACT IMPORTS
import { Listing } from '../../../marketplace/listing.algo'
import type { Marketplace } from '../../../marketplace/marketplace.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'


export class MarketplacePlugin extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: MarketplacePluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, factory: Application, akitaDAO: Application): void {
    this.version.value = version
    this.factory.value = factory
    this.akitaDAO.value = akitaDAO
  }

  // MARKETPLACE PLUGIN METHODS -------------------------------------------------------------------

  list(
    wallet: Application,
    rekeyBack: boolean,
    asset: uint64, // 0 | Asset
    assetAmount: uint64,
    price: uint64,
    paymentAsset: uint64, // 0 | Asset
    expiration: uint64,
    reservedFor: Account,
    gateID: uint64,
    marketplace: Account,
    name: string,
    proof: Proof,
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    assert(AssetHolding.assetBalance(sender, asset)[0] >= assetAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(asset))) {
      abiCall<typeof Marketplace.prototype.optin>({
        sender,
        appId: this.factory.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.factory.value.address,
            amount: Global.assetOptInMinBalance
          }),
          asset,
        ]
      })
    }

    if (!this.factory.value.address.isOptedIn(Asset(paymentAsset))) {
      abiCall<typeof Marketplace.prototype.optin>({
        sender,
        appId: this.factory.value,
        args: [
          itxn.payment({
            sender,
            receiver: this.factory.value.address,
            amount: Global.assetOptInMinBalance
          }),
          paymentAsset,
        ]
      })
    }

    const optinMBR: uint64 = paymentAsset === 0 ? Global.assetOptInMinBalance : Global.assetOptInMinBalance * 2

    const listing = compileArc4(Listing)

    const childContractMBR: uint64 = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * listing.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * listing.globalBytes) +
      Global.minBalance +
      optinMBR
    )

    return abiCall<typeof Marketplace.prototype.list>({
      sender,
      appId: this.factory.value,
      args: [
        itxn.payment({
          sender,
          receiver: this.factory.value.address,
          amount: childContractMBR
        }),
        itxn.assetTransfer({
          sender,
          assetReceiver: this.factory.value.address,
          assetAmount: assetAmount,
          xferAsset: asset
        }),
        price,
        paymentAsset,
        expiration,
        reservedFor,
        gateID,
        marketplace,
        name,
        proof,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      fee: 0,
    }).returnValue
  }

  purchase(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    marketplace: Account,
    args: GateArgs
  ): void {
    const { origin, sender } = getAccounts(wallet)

    assert(appId.creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    const price = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyPrice))[0]
    const paymentAsset = Asset(op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyPaymentAsset))[0])

    if (paymentAsset.id === 0) {
      if (args.length > 0) {
        const { gate } = getAkitaAppList(this.akitaDAO.value)
        const gateID = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyGateID))[0]

        const gateTxn = itxn.applicationCall({
          appId: gate,
          appArgs: [
            methodSelector(GateMustCheckAbiMethod),
            origin,
            gateID,
            encodeArc4(args)
          ],
        })

        abiCall<typeof Marketplace.prototype.gatedPurchase>({
          sender,
          appId: this.factory.value,
          args: [
            itxn.payment({
              sender,
              receiver: this.factory.value.address,
              amount: price
            }),
            gateTxn,
            appId,
            marketplace,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      } else {
        abiCall<typeof Marketplace.prototype.purchase>({
          sender,
          appId: this.factory.value,
          args: [
            itxn.payment({
              sender,
              receiver: this.factory.value.address,
              amount: price
            }),
            appId,
            marketplace
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      }
    } else {
      if (args.length > 0) {
        const { gate } = getAkitaAppList(this.akitaDAO.value)
        const gateID = op.AppGlobal.getExUint64(appId, Bytes(ListingGlobalStateKeyGateID))[0]

        const gateTxn = itxn.applicationCall({
          appId: gate,
          appArgs: [
            methodSelector(GateMustCheckAbiMethod),
            origin,
            gateID,
            encodeArc4(args)
          ],
        })

        abiCall<typeof Marketplace.prototype.gatedPurchaseAsa>({
          sender,
          appId: this.factory.value,
          args: [
            itxn.assetTransfer({
              sender,
              assetReceiver: this.factory.value.address,
              assetAmount: price,
              xferAsset: paymentAsset
            }),
            gateTxn,
            appId,
            marketplace
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      } else {
        abiCall<typeof Marketplace.prototype.purchaseAsa>({
          sender,
          appId: this.factory.value,
          args: [
            itxn.assetTransfer({
              sender,
              assetReceiver: this.factory.value.address,
              assetAmount: price,
              xferAsset: paymentAsset
            }),
            appId,
            marketplace
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
      }
    }
  }

  changePrice(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    price: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall<typeof Listing.prototype.changePrice>({
      sender,
      appId,
      args: [price],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  delist(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(appId.creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall<typeof Listing.prototype.delist>({
      appId,
      args: [sender],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}
