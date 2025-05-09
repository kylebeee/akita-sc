import { Marketplace } from '../../../marketplace/marketplace.algo'
import { Listing } from '../../../marketplace/listing.algo'
import { classes } from 'polytype'
import { Plugin } from '../../../utils/base-contracts/plugin'
import { ServiceFactoryContract } from '../../../utils/base-contracts/factory'
import { ContractWithArc58Send } from '../../../utils/base-contracts/optin'
import { Application, assert, Asset, Bytes, itxn, op, TemplateVar, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../../../utils/types/merkles'
import { ERR_LISTING_CREATOR_NOT_MARKETPLACE, ERR_NOT_ENOUGH_ASSET } from './errors'
import { AssetHolding, Global } from '@algorandfoundation/algorand-typescript/op'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../../../utils/constants'
import { ListingGlobalStateKeyPaymentAsset, ListingGlobalStateKeyPrice } from '../../../marketplace/constants'
import { GateArgs } from '../../../utils/types/gates'

const listing = compileArc4(Listing)

const factoryApp = TemplateVar<Application>('FACTORY_APP')

export class MarketplacePlugin extends classes(
  Plugin,
  ServiceFactoryContract,
  ContractWithArc58Send
) {

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
    const sender = this.getSpendingAccount(wallet)

    assert(AssetHolding.assetBalance(sender, asset)[0] >= assetAmount, ERR_NOT_ENOUGH_ASSET)

    if (!factoryApp.address.isOptedIn(Asset(asset))) {
      abiCall(
        Marketplace.prototype.optin,
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
            asset,
          ],
          fee: 0,
        }
      )
    }

    if (!factoryApp.address.isOptedIn(Asset(paymentAsset))) {
      abiCall(
        Marketplace.prototype.optin,
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
            paymentAsset,
          ],
          fee: 0,
        }
      )
    }

    const optinMBR = paymentAsset === 0 ? Global.assetOptInMinBalance : Global.assetOptInMinBalance * 2

    const childContractMBR = (
      MIN_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * listing.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * listing.globalBytes) +
      AccountMinimumBalance +
      optinMBR
    )

    return abiCall(
      Marketplace.prototype.list,
      {
        sender,
        appId: factoryApp,
        args: [
          itxn.payment({
            sender,
            receiver: factoryApp.address,
            amount: childContractMBR,
            fee: 0,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: factoryApp.address,
            assetAmount: assetAmount,
            xferAsset: asset,
            fee: 0,
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
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
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
    const sender = this.getSpendingAccount(wallet)

    assert(Application(listingID).creator === factoryApp.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    const price = op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyPrice))[0]
    const paymentAsset = Asset(op.AppGlobal.getExUint64(listingID, Bytes(ListingGlobalStateKeyPaymentAsset))[0])

    if (paymentAsset.id === 0) {
      abiCall(
        Marketplace.prototype.purchase,
        {
          sender,
          appId: factoryApp,
          args: [
            itxn.payment({
              sender,
              receiver: factoryApp.address,
              amount: price,
              fee: 0,
            }),
            listingID,
            marketplace,
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
        }
      )
    } else {
      abiCall(
        Marketplace.prototype.purchaseAsa,
        {
          sender,
          appId: factoryApp,
          args: [
            itxn.assetTransfer({
              sender,
              assetReceiver: factoryApp.address,
              assetAmount: price,
              xferAsset: paymentAsset,
              fee: 0,
            }),
            listingID,
            marketplace,
            args,
          ],
          rekeyTo: this.rekeyAddress(rekeyBack, wallet),
          fee: 0,
        }
      )
    }
  }

  changePrice(
    walletID: uint64,
    rekeyBack: boolean,
    listingID: uint64,
    price: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(Application(listingID).creator === factoryApp.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall(
      Listing.prototype.changePrice,
      {
        sender,
        appId: listingID,
        args: [price],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
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
    const sender = this.getSpendingAccount(wallet)

    assert(Application(listingID).creator === factoryApp.address, ERR_LISTING_CREATOR_NOT_MARKETPLACE)

    abiCall(
      Listing.prototype.delist,
      {
        appId: listingID,
        args: [new Address(sender)],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
