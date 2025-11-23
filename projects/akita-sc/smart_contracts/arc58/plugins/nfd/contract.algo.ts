import { Account, Application, assert, bytes, Bytes, GlobalState, itxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Contract } from '@algorandfoundation/algorand-typescript/arc4'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { NFDGlobalStateKeysName } from '../../../utils/constants/nfd'
import { getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { NFDGlobalStateKeySaleAmountKey, NFDPluginGlobalStateKeyRegistry } from './constants'
import { ERR_NOT_AN_NFD } from './errors'

// CONTRACT IMPORTS
import type { NFD } from '../../../utils/types/nfd'
import type { NFDRegistry } from '../../../utils/types/nfd-registry'

export class NFDPlugin extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registry = GlobalState<Application>({ key: NFDPluginGlobalStateKeyRegistry })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private isNFD(NFDApp: Application): boolean {
    const nfdNameBytes = op.AppGlobal.getExBytes(NFDApp, Bytes(NFDGlobalStateKeysName))[0]

    return abiCall<typeof NFDRegistry.prototype.isValidNfdAppId>({
      appId: this.registry.value,
      args: [String(nfdNameBytes), NFDApp.id]
    }).returnValue
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(registry: uint64) {
    this.registry.value = Application(registry)
  }

  // X METHODS ------------------------------------------------------------------------------

  deleteFields(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    fieldNames: bytes[]
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.deleteFields>({
      sender,
      appId,
      args: [fieldNames],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  updateFields(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    fieldAndVals: bytes[]
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.updateFields>({
      sender,
      appId,
      args: [fieldAndVals],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  offerForSale(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    sellAmount: uint64,
    reservedFor: Account
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.offerForSale>({
      sender,
      appId,
      args: [sellAmount, reservedFor],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  cancelSale(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.cancelSale>({
      sender,
      appId,
      args: [],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  postOffer(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    offer: uint64,
    note: string
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.postOffer>({
      sender,
      appId,
      args: [offer, note],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  purchase(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    const [saleAmountBytes, saleAmountBytesExists] = op.AppGlobal.getExBytes(appId.id, Bytes(NFDGlobalStateKeySaleAmountKey))
    assert(saleAmountBytesExists, 'No sale amount set')

    abiCall<typeof NFD.prototype.purchase>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: btoi(saleAmountBytes)
        }),
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  updateHash(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    hash: bytes
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.updateHash>({
      sender,
      appId,
      args: [hash],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  contractLock(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    lock: boolean
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.contractLock>({
      sender,
      appId,
      args: [lock],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  segmentLock(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    lock: boolean,
    usdPrice: uint64
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.segmentLock>({
      sender,
      appId,
      args: [lock, usdPrice],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  vaultOptInLock(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    lock: boolean
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.vaultOptInLock>({
      sender,
      appId,
      args: [lock],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  vaultOptIn(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    assets: uint64[]
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.vaultOptIn>({
      sender,
      appId,
      args: [assets],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  vaultSend(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    amount: uint64,
    receiver: Account,
    note: string,
    asset: uint64,
    otherAssets: uint64[]
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.vaultSend>({
      sender,
      appId,
      args: [amount, receiver, note, asset, otherAssets],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  renew(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    years: uint64
  ): void {

    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    const price = abiCall<typeof NFD.prototype.getRenewPrice>({
      sender,
      appId,
      args: []
    }).returnValue

    abiCall<typeof NFD.prototype.renew>({
      sender,
      appId,
      args: [
        itxn.payment({
          sender,
          receiver: appId.address,
          amount: (price * years)
        })
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  setPrimaryAddress(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    fieldName: string,
    address: Account
  ): void {
    const sender = getSpendingAccount(wallet)

    assert(this.isNFD(appId), ERR_NOT_AN_NFD)

    abiCall<typeof NFD.prototype.setPrimaryAddress>({
      sender,
      appId,
      args: [fieldName, address],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}
