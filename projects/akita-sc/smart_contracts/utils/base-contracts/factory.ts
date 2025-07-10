import {
  Account,
  Application,
  arc4,
  assert,
  Asset,
  BoxMap,
  Global,
  GlobalState,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, Contract, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from '../../constants'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { AkitaDAO } from '../../dao/contract.algo'

export const BaseFactoryGlobalStateKeyChildContractVersion = 'child_contract_version'
export const BaseFactoryBoxPrefixAppCreators = 'c'

export type AppCreatorValue = {
  creator: Account
  amount: uint64
}

export class arc4AppCreatorValue extends arc4.Struct<{
  creator: Address
  amount: UintN64
}> { }

export class FactoryContract extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the current version of the contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** the app ID for the akita DAO escrow to use */
  akitaDAOEscrow = GlobalState<Application>({ key: GlobalStateKeyAkitaEscrow })
  /** the current version of the child contract */
  childContractVersion = GlobalState<string>({ key: BaseFactoryGlobalStateKeyChildContractVersion })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  protected optAkitaEscrowInAndSend(name: string, asset: Asset, amount: uint64): void {
    abiCall(
      AkitaDAO.prototype.optinReceiveEscrow,
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
          xferAsset: asset,
          fee: 0,
        })
        .submit()
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(newVersion: string, newChildVersion: string): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.version.value = newVersion
    this.childContractVersion.value = newChildVersion
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

export class ServiceFactoryContract extends FactoryContract {

  // BOXES ----------------------------------------------------------------------------------------

  appCreators = BoxMap<uint64, AppCreatorValue>({ keyPrefix: BaseFactoryBoxPrefixAppCreators })

}
