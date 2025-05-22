import { Application, assert, bytes, Bytes, GlobalState, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { NFD } from '../../../utils/types/nfd'
import { abiCall, abimethod, Address, Contract, DynamicArray, DynamicBytes } from '@algorandfoundation/algorand-typescript/arc4'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { ERR_NOT_AN_NFD } from './errors'
import { NFDGlobalStateKeySaleAmountKey, NFDPluginGlobalStateKeyRegistry } from './constants'
import { getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { NFDGlobalStateKeysName } from '../social/constants'
import { fee } from '../../../utils/constants'

export class NFDPlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registry = GlobalState<Application>({ key: NFDPluginGlobalStateKeyRegistry })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private isNFD(NFDApp: Application): boolean {
    const [nfdNameBytes] = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))

    return abiCall(
      NFDRegistry.prototype.isValidNfdAppId,
      {
        appId: this.registry.value,
        args: [String(nfdNameBytes), NFDApp.id],
        fee,
      }
    ).returnValue
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(registry: uint64) {
    this.registry.value = Application(registry)
  }

  // X METHODS ------------------------------------------------------------------------------

  deleteFields(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
    fieldNames: DynamicArray<DynamicBytes>
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.deleteFields,
      {
        sender,
        appId: nfdAppID,
        args: [fieldNames],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.updateFields,
      {
        sender,
        appId: nfdAppID,
        args: [fieldAndVals],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.offerForSale,
      {
        sender,
        appId: nfdAppID,
        args: [sellAmount, reservedFor],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  cancelSale(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.cancelSale,
      {
        sender,
        appId: nfdAppID,
        args: [],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.postOffer,
      {
        sender,
        appId: nfdAppID,
        args: [offer, note],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  purchase(
    walletID: uint64,
    rekeyBack: boolean,
    nfdAppID: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

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
            fee,
          }),
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.updateHash,
      {
        sender,
        appId: nfdAppID,
        args: [hash],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.contractLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.segmentLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock, usdPrice],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultOptInLock,
      {
        sender,
        appId: nfdAppID,
        args: [lock],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultOptIn,
      {
        sender,
        appId: nfdAppID,
        args: [assets],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.vaultSend,
      {
        sender,
        appId: nfdAppID,
        args: [amount, receiver, note, asset, otherAssets],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    const price = abiCall(
      NFD.prototype.getRenewPrice,
      {
        sender,
        appId: nfdAppID,
        args: [],
        fee,
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
            fee,
          })
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(Application(nfdAppID)), ERR_NOT_AN_NFD)

    abiCall(
      NFD.prototype.setPrimaryAddress,
      {
        sender,
        appId: nfdAppID,
        args: [fieldName, address],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}
