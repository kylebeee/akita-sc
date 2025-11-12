import {
  Account,
  assert,
  Box,
  Bytes,
  bytes,
  Global,
  GlobalState,
  gtxn,
  OnCompleteAction,
  TransactionType,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { Contract, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { AkitaBaseFeeGeneratorContract } from './base'
import { ERR_CONTRACT_NOT_SET, ERR_INVALID_CALL_ORDER } from '../errors'

export const BaseFactoryGlobalStateKeyChildContractVersion = 'child_contract_version'
export const BoxKeyBoxedContract = 'bc'

export type AppCreatorValue = {
  creator: Account
  amount: uint64
}

export class FactoryContract extends AkitaBaseFeeGeneratorContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the current version of the child contract */
  childContractVersion = GlobalState<string>({ key: BaseFactoryGlobalStateKeyChildContractVersion })

  // BOXES ----------------------------------------------------------------------------------------

  boxedContract = Box<bytes>({ key: BoxKeyBoxedContract })

  // AKITA FACTORY METHODS --------------------------------------------------------------------

  initBoxedContract(version: string, size: uint64): void {
    this.childContractVersion.value = version
    if (!this.boxedContract.exists) {
      assert(Txn.sender === Global.creatorAddress, ERR_NOT_AKITA_DAO)
      this.boxedContract.create({ size })
    } else {
      assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
      this.boxedContract.resize(size)
    }
  }

  loadBoxedContract(offset: uint64, data: bytes): void {
    const expectedPreviousCalls: uint64 = offset / 2032
    const txn = gtxn.Transaction(Txn.groupIndex - expectedPreviousCalls - 1)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 3
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector('initBoxedContract(string,uint64)void')
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)
    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)
    this.boxedContract.replace(offset, data)
  }

  deleteBoxedContract(): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.boxedContract.delete()
  }
}
