import { Application, assert, Box, Bytes, bytes, Global, GlobalState, gtxn, itxn, OnCompleteAction, op, TransactionType, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, Contract, methodSelector } from "@algorandfoundation/algorand-typescript/arc4"
import { GlobalStateKeyAkitaDAO, GlobalStateKeyChildContractVersion, GlobalStateKeyClearProgram } from "../../../constants"
import { BoxKeyBoxedContract } from "../../../utils/base-contracts/factory"
import { ERR_CONTRACT_NOT_SET, ERR_INVALID_CALL_ORDER } from "../../../utils/errors"
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { AkitaDAOGlobalStateKeysWallet } from "../../dao/constants"
import { ERR_NOT_AKITA_DAO } from "../social/errors"

// CONTRACT IMPORTS
import type { AkitaBaseFeeGeneratorContract } from "../../../utils/base-contracts/base"


export class UpdateAkitaDAOPlugin extends Contract {

  /** the app ID of the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  childContractVersion = GlobalState<string>({ key: GlobalStateKeyChildContractVersion })

  clearProgram = GlobalState<bytes>({ key: GlobalStateKeyClearProgram })

  boxedContract = Box<bytes>({ key: BoxKeyBoxedContract })

  private getAkitaDAOWallet(): Application {
    const [walletID] = op.AppGlobal.getExUint64(this.akitaDAO.value, Bytes(AkitaDAOGlobalStateKeysWallet))
    return Application(walletID)
  }

  initBoxedContract(wallet: Application, rekeyBack: boolean, version: string, size: uint64): void {
    this.childContractVersion.value = version
    if (!this.boxedContract.exists) {
      assert(Txn.sender === Global.creatorAddress, ERR_NOT_AKITA_DAO)
      this.boxedContract.create({ size })
    } else {
      assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
      this.boxedContract.resize(size)
    }

    if (rekeyBack) {
      itxn
        .payment({
          sender: Txn.sender,
          receiver: Global.currentApplicationAddress,
          amount: 0,
          rekeyTo: rekeyAddress(true, wallet),
        })
        .submit()
    }
  }

  loadBoxedContract(wallet: Application, rekeyBack: boolean, offset: uint64, data: bytes): void {
    const expectedPreviousCalls: uint64 = offset / 2027
    const txn = gtxn.Transaction(Txn.groupIndex - expectedPreviousCalls - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 3
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector(this.loadBoxedContract)
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)
    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)
    this.boxedContract.replace(offset, data)

    if (rekeyBack) {
      itxn
        .payment({
          sender: Txn.sender,
          receiver: Global.currentApplicationAddress,
          amount: 0,
          rekeyTo: rekeyAddress(true, wallet),
        })
        .submit()
    }
  }

  deleteBoxedContract(wallet: Application, rekeyBack: boolean): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.boxedContract.delete()

    if (rekeyBack) {
      itxn
        .payment({
          sender: Txn.sender,
          receiver: Global.currentApplicationAddress,
          amount: 0,
          rekeyTo: rekeyAddress(true, wallet),
        })
        .submit()
    }
  }

  updateApp(wallet: Application, rekeyBack: boolean, appId: Application): void {
    const sender = getSpendingAccount(wallet)

    // require the new contract to be uploaded in the same txn group
    // the call before must be a call to loadBoxedContract
    const txn = gtxn.Transaction(Txn.groupIndex - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 5
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector(this.loadBoxedContract)
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)

    const approvalSize = this.boxedContract.length
    const chunk1 = approvalSize > 4096 ? this.boxedContract.extract(0, 4096) : this.boxedContract.extract(0, approvalSize)
    const chunk2 = approvalSize > 4096 ? this.boxedContract.extract(4096, approvalSize - 4096) : Bytes('')

    abiCall<typeof AkitaBaseFeeGeneratorContract.prototype.update>({
      sender,
      appId,
      args: [this.childContractVersion.value],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
      onCompletion: OnCompleteAction.UpdateApplication,
      approvalProgram: [chunk1, chunk2],
      clearStateProgram: this.clearProgram.value,
      extraProgramPages: 3,
    })
  }

  updateAkitaDaoAppIDForApp(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    newAkitaDAOAppID: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaBaseFeeGeneratorContract.prototype.updateAkitaDAO>({
      sender,
      appId,
      args: [newAkitaDAOAppID],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  updateAkitaDaoEscrowForApp(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    newEscrow: Application
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof AkitaBaseFeeGeneratorContract.prototype.updateAkitaDAOEscrow>({
      sender,
      appId,
      args: [newEscrow],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
