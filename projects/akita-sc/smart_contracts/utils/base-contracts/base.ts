import { Application, assert, Asset, Global, GlobalState, itxn, Txn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Contract } from '@algorandfoundation/algorand-typescript/arc4'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from '../../constants'

import { ERR_NOT_AKITA_DAO } from '../../errors'
import { AkitaDAO } from '../../dao/contract.algo'

export class AkitaBaseContract extends Contract {
  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(newVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
  }

  updateAkitaDAO(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = Application(app)
  }
}

export class AkitaBaseEscrow extends Contract {

  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** the escrow account to use when making payments to the Akita DAO */
  akitaDAOEscrow = GlobalState<Application>({ key: GlobalStateKeyAkitaEscrow })

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(newVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
  }

  updateAkitaDAO(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = Application(app)
  }

  updateAkitaDAOEscrow(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAOEscrow.value = Application(app)
  }

  protected optAkitaEscrowInAndSend(name: string, asset: Asset, amount: uint64): void {
    abiCall(
      AkitaDAO.prototype.optinEscrow,
      {
        appId: this.akitaDAO.value,
        args: [
          itxn.payment({
            receiver: this.akitaDAOEscrow.value.address,
            amount: Global.assetOptInMinBalance,
            fee: 0,
          }),
          name,
          asset.id
        ],
        fee: 0,
      },
    )

    if (amount > 0) {
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: amount,
          xferAsset: asset.id,
          fee: 0,
        })
        .submit()
    }
  }
}