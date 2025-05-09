import { Application, assert, bytes, Bytes, Global, GlobalState, itxn, op, TemplateVar, uint64 } from '@algorandfoundation/algorand-typescript'
import { NFD } from '../../../utils/types/nfd'
import { abiCall, Address, DynamicArray, DynamicBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { Plugin } from '../../../utils/base-contracts/plugin'
import { NFDGlobalStateKeysName } from '../impact/constants'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { ERR_NOT_AN_NFD } from './errors'
import { NFDGlobalStateKeySaleAmountKey } from './constants'

const nfdRegistry = TemplateVar<Application>('nfdRegistry')

export class NFDPlugin extends Plugin {

  private isNFD(NFDApp: Application): boolean {
    const [nfdNameBytes] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))

    return abiCall(
      NFDRegistry.prototype.isValidNfdAppId,
      {
        appId: nfdRegistry,
        args: [String(nfdNameBytes), NFDApp.id],
        fee: 0,
      }
    ).returnValue
  }

  deleteFields(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    fieldNames: DynamicArray<DynamicBytes>
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.deleteFields,
      {
        sender,
        appId: nfdAppID,
        args: [fieldNames],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      },
    )
  }

  updateFields(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    fieldAndVals: DynamicArray<DynamicBytes>
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.updateFields,
      {
        sender,
        appId: nfdAppID,
        args: [fieldAndVals],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  offerForSale(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    sellAmount: uint64,
    reservedFor: Address
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.offerForSale,
      {
        sender,
        appId: nfdAppID,
        args: [sellAmount, reservedFor],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  cancelSale(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.cancelSale,
      {
        sender,
        appId: nfdAppID,
        args: [],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  postOffer(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    offer: uint64,
    note: string
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.postOffer,
      {
        sender,
        appId: nfdAppID,
        args: [offer, note],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  purchase(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    const [saleAmountBytes, saleAmountBytesExists] = op.AppGlobal.getExBytes(nfdAppID, Bytes(NFDGlobalStateKeySaleAmountKey))
    assert(saleAmountBytesExists, 'No sale amount set')

    abiCall(
      NFD.prototype.purchase,
      {
        sender,
        appId: nfdAppID,
        args: [
          itxn.payment({
            sender,
            receiver: Application(nfdAppID).address,
            amount: btoi(saleAmountBytes),
            fee: 0,
          }),
        ],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  updateHash(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    hash: bytes
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.updateHash,
      {
        sender,
        appId: nfdAppID,
        args: [hash],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  contractLock(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    lock: boolean
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.contractLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  segmentLock(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    lock: boolean,
    usdPrice: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.segmentLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock, usdPrice],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  vaultOptInLock(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    lock: boolean
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultOptInLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  vaultOptIn(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    assets: uint64[]
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultOptIn,
      {
        sender,
        appId: nfdAppID,
        args: [assets],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  vaultSend(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    amount: uint64,
    receiver: Address,
    note: string,
    asset: uint64,
    otherAssets: uint64[]
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultSend,
      {
        sender,
        appId: nfdAppID,
        args: [amount, receiver, note, asset, otherAssets],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  renew(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    years: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    const price = abiCall(
      NFD.prototype.getRenewPrice,
      {
        sender,
        appId: nfdAppID,
        args: [],
        fee: 0,
      }
    ).returnValue

    abiCall(
      NFD.prototype.renew,
      {
        sender,
        appId: nfdAppID,
        args: [
          itxn.payment({
            sender,
            receiver: Application(nfdAppID).address,
            amount: (price * years),
            fee: 0,
          })
        ],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }

  setPrimaryAddress(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    fieldName: string,
    address: Address
  ): void {
    const wallet = Application(walletID)
    const sender = this.getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.setPrimaryAddress,
      {
        sender,
        appId: nfdAppID,
        args: [fieldName, address],
        rekeyTo: this.rekeyAddress(rekeyBack, wallet),
        fee: 0,
      }
    )
  }
}
