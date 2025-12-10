import { Application, assert, assertMatch, Asset, Bytes, Global, GlobalState, gtxn, itxn, itxnCompose, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Contract } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_WRONG_ESCROW_FOR_OPERATION } from '../../arc58/account/errors'
import { EscrowInfo } from '../../arc58/account/types'
import { AkitaDAOGlobalStateKeysWallet } from '../../arc58/dao/constants'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from '../../constants'
import { ERR_NOT_AKITA_DAO } from '../../errors'

// CONTRACT IMPORTS
import type { AbstractedAccount } from '../../arc58/account/contract.algo'
import { ERR_INVALID_PAYMENT } from '../errors'
import { getPluginAppList, splitOptInCount } from '../functions'

class RevenueManagerPluginStub extends Contract {
  optIn(wallet: Application, rekeyBack: boolean, assets: uint64[], mbrPayment: gtxn.PaymentTxn): void {
    return
  }
}

export const ERR_INVALID_UPGRADE = 'Invalid app upgrade'

export class AkitaBaseContract extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  protected getAkitaDAOWallet(): Application {
    const [walletID] = op.AppGlobal.getExUint64(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysWallet))
    return Application(walletID)
  }

  // AKITA BASE CONTRACT METHODS ------------------------------------------------------------------

  updateAkitaDAO(akitaDAO: Application): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = akitaDAO
  }

  opUp(): void { }
}

export class UpgradeableAkitaBaseContract extends AkitaBaseContract {

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(newVersion: string): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    const updatePlugin = getPluginAppList(this.akitaDAO.value).update
    assert(Global.callerApplicationId === updatePlugin, ERR_INVALID_UPGRADE)
    this.version.value = newVersion
  }
}

export class AkitaBaseFeeGeneratorContract extends UpgradeableAkitaBaseContract {

  /** the app ID for the akita DAO escrow to use */
  akitaDAOEscrow = GlobalState<Application>({ key: GlobalStateKeyAkitaEscrow })

  protected getEscrow(name: string): EscrowInfo {
    const appId = this.getAkitaDAOWallet()

    const escrow = abiCall<typeof AbstractedAccount.prototype.arc58_getEscrows>({
      appId,
      args: [[name]],
    }).returnValue[0]

    assert(escrow.id !== 0, ERR_ESCROW_DOES_NOT_EXIST)

    return escrow
  }

  protected optAkitaEscrowInAndSend(name: string, asset: Asset, amount: uint64): uint64 {

    const wallet = this.getAkitaDAOWallet()
    const { revenueManager } = getPluginAppList(this.akitaDAO.value)

    const { id } = this.getEscrow(name)
    assert(id === this.akitaDAOEscrow.value.id, ERR_WRONG_ESCROW_FOR_OPERATION)

    itxnCompose.begin<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin>({
      appId: wallet,
      args: [
        revenueManager,
        true,
        name,
        [0], // all the akita escrows have method restrictions with optin being index 0
        []
      ],
    })

    const optInCount = splitOptInCount(
      this.akitaDAO.value,
      this.akitaDAOEscrow.value.address,
      asset
    )

    const mbrAmount: uint64 = Global.assetOptInMinBalance * optInCount

    itxnCompose.next<typeof RevenueManagerPluginStub.prototype.optIn>({
      appId: revenueManager,
      args: [
        wallet,
        true,
        [asset.id],
        itxn.payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount: mbrAmount
        })
      ]
    })

    itxnCompose.next<typeof AbstractedAccount.prototype.arc58_verifyAuthAddress>({ appId: wallet })

    if (amount > 0) {
      itxnCompose.next(
        itxn.assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: amount,
          xferAsset: asset,
        })
      )
    }

    itxnCompose.submit()

    return mbrAmount
  }

  updateAkitaDAOEscrow(app: Application): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.akitaDAOEscrow.value = app
  }
}

export class AkitaFeeGeneratorContractWithOptIn extends AkitaBaseFeeGeneratorContract {

  /**
 * optin tells the contract to opt into an asa
 * @param payment The payment transaction
 * @param asset The asset to be opted into
 */
  optIn(payment: gtxn.PaymentTxn, asset: Asset): void {

    const count = splitOptInCount(this.akitaDAO.value, this.akitaDAOEscrow.value.address, asset)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: Global.assetOptInMinBalance * (1 + count),
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset
      })
      .submit()
  }

  @abimethod({ readonly: true })
  optInCost(asset: Asset): uint64 {
    const count = splitOptInCount(this.akitaDAO.value, this.akitaDAOEscrow.value.address, asset)
    return Global.assetOptInMinBalance * (1 + count)
  }
}