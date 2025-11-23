import { Application, assert, Asset, bytes, Bytes, Global, GlobalState, itxn, op, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Contract } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_WRONG_ESCROW_FOR_OPERATION } from '../../arc58/account/errors'
import { EscrowInfo } from '../../arc58/account/types'
import { AkitaDAOGlobalStateKeysWallet } from '../../arc58/dao/constants'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from '../../constants'
import { ERR_NOT_AKITA_DAO } from '../../errors'

// CONTRACT IMPORTS
import type { AbstractedAccount } from '../../arc58/account/contract.algo'

class MockDAO extends Contract {
  isValidUpgrade(lease: bytes<32>, appBeingUpgraded: uint64): boolean {
    return false
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

    const valid = abiCall<typeof MockDAO.prototype.isValidUpgrade>({
      appId: this.akitaDAO.value,
      args: [Txn.lease, Global.currentApplicationId.id],
    }).returnValue

    assert(valid, ERR_INVALID_UPGRADE)

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

  protected optAkitaEscrowInAndSend(name: string, asset: Asset, amount: uint64): void {

    const appId = this.getAkitaDAOWallet()
    const { id } = this.getEscrow(name)

    assert(id === this.akitaDAOEscrow.value.id, ERR_WRONG_ESCROW_FOR_OPERATION)

    abiCall<typeof AbstractedAccount.prototype.arc58_pluginOptinEscrow>({
      appId,
      args: [
        Global.currentApplicationId.id,
        Global.currentApplicationAddress,
        name,
        [asset.id],
        itxn.payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount: Global.assetOptInMinBalance,
        })
      ],
    })

    if (amount > 0) {
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: amount,
          xferAsset: asset,
        })
        .submit()
    }
  }

  updateAkitaDAOEscrow(app: Application): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.akitaDAOEscrow.value = app
  }
}