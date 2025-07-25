import { Marketplace } from '../../../marketplace/marketplace.algo'
import { Listing } from '../../../marketplace/listing.algo'
import { Application, assert, Asset, Bytes, GlobalState, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, compileArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../../../utils/types/merkles'
import { ERR_LISTING_CREATOR_NOT_MARKETPLACE, ERR_NOT_ENOUGH_ASSET } from './errors'
import { AssetHolding, Global } from '@algorandfoundation/algorand-typescript/op'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../../../utils/constants'
import { ListingGlobalStateKeyGateID, ListingGlobalStateKeyPaymentAsset, ListingGlobalStateKeyPrice } from '../../../marketplace/constants'
import { GateArgs, GateInterface } from '../../../utils/types/gates'
import { getAccounts, getAkitaAppList, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { MarketplacePluginGlobalStateKeyFactory } from './constants'

export class MarketplacePlugin extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: MarketplacePluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(version: string, factory: uint64, akitaDAO: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
    this.akitaDAO.value = Application(akitaDAO)
  }

  // MARKETPLACE PLUGIN METHODS -------------------------------------------------------------------

  list(
    walletID: uint64,
    rekeyBack: boolean,
    asset: uint64,
    assetAmount: uint64,
    price: uint64,
    paymentAsset: uint64,
    expiration: uint64,
    reservedFor: Address,
    gateID: uint64,
    marketplace: Address,
    name: string,
    proof: Proof,
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(AssetHolding.assetBalance(sender, asset)[0] >= assetAmount, ERR_NOT_ENOUGH_ASSET)

    if (!this.factory.value.address.isOptedIn(Asset(asset))) {
      abiCall(
        Marketplace.prototype.optin,
        {
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
        }
      )
    }

    if (!this.factory.value.address.isOptedIn(Asset(paymentAsset))) {
      abiCall(
        Marketplace.prototype.optin,
        {
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
        }
      )
    }

    const optinMBR = paymentAsset === 0 ? Global.assetOptInMinBalance : Global.assetOptInMinBalance * 2

    const listing = compileArc4(Listing)

    const childContractMBR = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * listing.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * listing.globalBytes) +
      Global.minBalance +
      optinMBR
    )

    return abiCall(
      Marketplace.prototype.list,
      {
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
      }
    ).returnValue
  }

  purchase(
    walletID: uint64,
    rekeyBack: boolean,
    listingID: uint64,
    marketplace: Address,
    args: GateArgs
  ): void {
    const wallet = Application(walletID)
    const { origin, sender } = getAccounts(wallet)

    assert(Application(listingID).creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    const price = op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyPrice))[0]
    const paymentAsset = Asset(op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyPaymentAsset))[0])

    if (paymentAsset.id === 0) {
      if (args.length > 0) {
        const { gate } = getAkitaAppList(this.akitaDAO.value)
        const gateID = op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyGateID))[0]

        const gateTxn = itxn.applicationCall({
          appId: gate,
          appArgs: [
            methodSelector(GateInterface.prototype.mustCheck),
            new Address(origin),
            gateID,
            args
          ],
        })

        abiCall(
          Marketplace.prototype.gatedPurchase,
          {
            sender,
            appId: this.factory.value,
            args: [
              itxn.payment({
                sender,
                receiver: this.factory.value.address,
                amount: price
              }),
              gateTxn,
              listingID,
              marketplace,
            ],
            rekeyTo: rekeyAddress(rekeyBack, wallet)
          }
        )
      } else {
        abiCall(
          Marketplace.prototype.purchase,
          {
            sender,
            appId: this.factory.value,
            args: [
              itxn.payment({
                sender,
                receiver: this.factory.value.address,
                amount: price
              }),
              listingID,
              marketplace
            ],
            rekeyTo: rekeyAddress(rekeyBack, wallet)
          }
        )
      }
    } else {
      if (args.length > 0) {
        const { gate } = getAkitaAppList(this.akitaDAO.value)
        const gateID = op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyGateID))[0]

        const gateTxn = itxn.applicationCall({
          appId: gate,
          appArgs: [
            methodSelector(GateInterface.prototype.mustCheck),
            new Address(origin),
            gateID,
            args
          ],
        })

        abiCall(
          Marketplace.prototype.gatedPurchaseAsa,
          {
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
              listingID,
              marketplace
            ],
            rekeyTo: rekeyAddress(rekeyBack, wallet)
          }
        )
      } else {
        abiCall(
          Marketplace.prototype.purchaseAsa,
          {
            sender,
            appId: this.factory.value,
            args: [
              itxn.assetTransfer({
                sender,
                assetReceiver: this.factory.value.address,
                assetAmount: price,
                xferAsset: paymentAsset
              }),
              listingID,
              marketplace
            ],
            rekeyTo: rekeyAddress(rekeyBack, wallet)
          }
        )
      }
    }
  }

  changePrice(
    walletID: uint64,
    rekeyBack: boolean,
    listingID: uint64,
    price: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(listingID).creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall(
      Listing.prototype.changePrice,
      {
        sender,
        appId: listingID,
        args: [price],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  delist(
    walletID: uint64,
    rekeyBack: boolean,
    listingID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(Application(listingID).creator === this.factory.value.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall(
      Listing.prototype.delist,
      {
        appId: listingID,
        args: [new Address(sender)],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
