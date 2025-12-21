import { Application, assert, Box, Bytes, bytes, Global, GlobalState, gtxn, OnCompleteAction, op, TransactionType, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, abimethod, Contract, methodSelector } from "@algorandfoundation/algorand-typescript/arc4"
import { GlobalStateKeyAkitaDAO, GlobalStateKeyChildContractVersion, GlobalStateKeyClearProgram } from "../../../constants"
import { BoxKeyBoxedContract } from "../../../utils/base-contracts/factory"
import { ERR_CONTRACT_NOT_SET, ERR_INVALID_CALL_ORDER } from "../../../utils/errors"
import { getAkitaAppList, getSpendingAccount, rekeyAddress, rekeyBackIfNecessary } from "../../../utils/functions"
import { AkitaDAOGlobalStateKeysWallet } from "../../dao/constants"
import { ERR_NOT_AKITA_DAO } from "../social/errors"

// CONTRACT IMPORTS
import { type AkitaBaseFeeGeneratorContract } from "../../../utils/base-contracts/base"
import { MAX_AVM_BYTE_ARRAY_LENGTH } from "../../../utils/constants"
import { AbstractedAccountFactory } from "../../account/factory.algo"

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

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: Application, clearProgram: bytes): void {
    this.akitaDAO.value = akitaDAO
    this.clearProgram.value = clearProgram
  }

  setClearProgram(wallet: Application, rekeyBack: boolean, clearProgram: bytes): void {
    const sender = getSpendingAccount(wallet)
    assert(sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    this.clearProgram.value = clearProgram

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  initBoxedContract(wallet: Application, version: string, size: uint64): void {
    const sender = getSpendingAccount(wallet)
    assert(sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    this.childContractVersion.value = version

    if (!this.boxedContract.exists) {
      this.boxedContract.create({ size })
    } else {
      this.boxedContract.resize(size)
    }
  }

  loadBoxedContract(wallet: Application, offset: uint64, data: bytes): void {
    const sender = getSpendingAccount(wallet)
    assert(sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    // max chunk size is 2026 bytes
    // ABI encoding overhead: [selector:4][wallet:8][offset:8][data_length:2] = 22 bytes
    // 2048 - 22 = 2026 bytes max per chunk
    const expectedPreviousCalls: uint64 = offset / 2026
    const txn = gtxn.Transaction(Txn.groupIndex - expectedPreviousCalls - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 4
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector(this.initBoxedContract)
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)
    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)
    this.boxedContract.replace(offset, data)
  }

  deleteBoxedContract(wallet: Application, rekeyBack: boolean): void {
    const sender = getSpendingAccount(wallet)
    assert(sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    this.boxedContract.delete()

    rekeyBackIfNecessary(rekeyBack, wallet)
  }

  updateApp(wallet: Application, rekeyBack: boolean, appId: Application): void {
    const sender = getSpendingAccount(wallet)

    // require the new contract to be uploaded in the same txn group
    // the call before must be a call to loadBoxedContract
    const txn = gtxn.Transaction(Txn.groupIndex - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 4
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector(this.loadBoxedContract)
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)

    const approvalSize: uint64 = this.boxedContract.length

    let chunk1: bytes
    let chunk2: bytes
    if (approvalSize > MAX_AVM_BYTE_ARRAY_LENGTH) {
      chunk1 = this.boxedContract.extract(0, MAX_AVM_BYTE_ARRAY_LENGTH)
      chunk2 = this.boxedContract.extract(MAX_AVM_BYTE_ARRAY_LENGTH, approvalSize - MAX_AVM_BYTE_ARRAY_LENGTH)
    } else {
      chunk1 = this.boxedContract.extract(0, approvalSize)
      chunk2 = Bytes('')
    }

    abiCall<typeof AkitaBaseFeeGeneratorContract.prototype.update>({
      sender,
      appId,
      args: [this.childContractVersion.value],
      onCompletion: OnCompleteAction.UpdateApplication,
      approvalProgram: [chunk1, chunk2],
      clearStateProgram: this.clearProgram.value,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
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

  updateRevocation(
    wallet: Application,
    rekeyBack: boolean,
    app: Application
  ): void {
    const sender = getSpendingAccount(wallet)
    assert(sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)

    const appId = getAkitaAppList(this.akitaDAO.value).wallet

    abiCall<typeof AbstractedAccountFactory.prototype.updateRevocation>({
      sender,
      appId,
      args: [app],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
