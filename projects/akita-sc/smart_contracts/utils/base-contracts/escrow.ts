import { Application, assert, Asset, Contract, Global, GlobalState, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from "../../constants"
import { abiCall, abimethod } from "@algorandfoundation/algorand-typescript/arc4"
import { AkitaDAOInterface } from "../types/dao"
import { ERR_NOT_AKITA_DAO } from "../../errors"

export class AkitaBaseEscrow extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** the escrow account to use when making payments to the Akita DAO */
  akitaDAOEscrow = GlobalState<Application>({ key: GlobalStateKeyAkitaEscrow })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  optAkitaEscrowInAndSend(name: string, asset: Asset, amount: uint64): void {
    abiCall(
      AkitaDAOInterface.prototype.optinReceiveEscrow,
      {
        appId: this.akitaDAO.value,
        args: [
          itxn.payment({
            receiver: this.akitaDAOEscrow.value.address,
            amount: (Global.assetOptInMinBalance * 4),
          }),
          name,
          asset.id
        ],
      },
    )

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

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(newVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
  }

  // AKITA BASE ESCROW METHODS --------------------------------------------------------------------

  updateAkitaDAO(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAO.value = Application(app)
  }

  updateAkitaDAOEscrow(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.akitaDAOEscrow.value = Application(app)
  }
}