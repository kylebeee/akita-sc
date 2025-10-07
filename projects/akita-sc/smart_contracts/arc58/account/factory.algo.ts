import {
  Application,
  assert,
  assertMatch,
  Box,
  bytes,
  Global,
  GlobalState,
  gtxn,
  itxn,
  OnCompleteAction,
  op,
  TransactionType,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { GlobalStateKeyEscrowFactory, GlobalStateKeyRevocation } from '../../constants'
import { AbstractedAccount } from './contract.algo'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { abimethod, Address, compileArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_CONTRACT_NOT_SET, ERR_INVALID_CALL_ORDER, ERR_INVALID_PAYMENT } from '../../utils/errors'
import { FactoryContract } from '../../utils/base-contracts/factory'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../../utils/constants'
import { ARC58WalletIDsByAccountsMbr } from '../../escrow/constants'
import { AbstractAccountFactoryBoxKeyCompiledContract, AbstractAccountNumGlobalBytes, AbstractAccountNumGlobalUints, AbstractedAccountFactoryGlobalStateKeyDomain } from './constants'
import { costInstantDisbursement, getWalletFees, getWalletIDUsingAkitaDAO, referrerOrZeroAddress, sendReferralPayment } from '../../utils/functions'
import { AbstractedAccountFactoryInterface } from '../../utils/abstract-account'
import { GTxn } from '@algorandfoundation/algorand-typescript/op'

export class AbstractedAccountFactory extends FactoryContract implements AbstractedAccountFactoryInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the escrow factory app */
  escrowFactory = GlobalState<Application>({ key: GlobalStateKeyEscrowFactory })
  /** the default app thats allowed to revoke plugins */
  revocation = GlobalState<Application>({ key: GlobalStateKeyRevocation })
  /** domain */
  domain = GlobalState<string>({ key: AbstractedAccountFactoryGlobalStateKeyDomain })

  // BOXES ----------------------------------------------------------------------------------------

  boxedContract = Box<bytes>({ key: AbstractAccountFactoryBoxKeyCompiledContract })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(
    akitaDAO: uint64,
    version: string,
    childVersion: string,
    escrowFactoryApp: uint64,
    revocationApp: uint64,
    domain: string
  ): void {
    this.akitaDAO.value = Application(akitaDAO)
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.escrowFactory.value = Application(escrowFactoryApp)
    this.revocation.value = Application(revocationApp)
    this.domain.value = domain
  }

  initBoxedContract(size: uint64): void {
    if (!this.boxedContract.exists) {
      assert(Txn.sender === Global.creatorAddress, ERR_NOT_AKITA_DAO)
      this.boxedContract.create({ size })
    } else {
      assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
      this.boxedContract.ref.resize(size)
    }
  }

  loadBoxedContract(offset: uint64, data: bytes): void {
    const txn = gtxn.Transaction(0)
    assert((
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 2
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector('initBoxedContract(uint64)void')
      && txn.sender === Txn.sender
    ), ERR_INVALID_CALL_ORDER)
    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)
    this.boxedContract.ref.replace(offset, data)
  }

  deleteBoxedContract(): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.boxedContract.delete()
  }

  // ABSTRACTED ACCOUNT FACTORY METHODS -----------------------------------------------------------

  updateRevocationApp(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.revocation.value = Application(app)
  }

  newAccount(
    payment: gtxn.PaymentTxn,
    controlledAddress: Address,
    admin: Address,
    nickname: string,
    referrer: Address
  ): uint64 {

    const abstractedAccount = compileArc4(AbstractedAccount)

    const creationFee = getWalletFees(this.akitaDAO.value).createFee

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES + // 300_000
      (GLOBAL_STATE_KEY_UINT_COST * abstractedAccount.globalUints) + // 256_500
      (GLOBAL_STATE_KEY_BYTES_COST * abstractedAccount.globalBytes) + // 850_000
      Global.minBalance + // 100_000
      ARC58WalletIDsByAccountsMbr + // 12_100
      creationFee
    )

    let leftover: uint64 = creationFee
    let referralCost: uint64 = 0
    if (creationFee > 0) {
      const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
      const referrer = referrerOrZeroAddress(wallet);
      ({ leftover, cost: referralCost } = sendReferralPayment(this.akitaDAO.value, referrer, 0, creationFee))
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: childMBR + referralCost,
      },
      ERR_INVALID_PAYMENT
    )

    assert(this.boxedContract.exists, ERR_CONTRACT_NOT_SET)
    
    const approvalOne = this.boxedContract.ref.extract(0, 4096)
    const approvalSize = this.boxedContract.ref.length
    const approvalTwo = this.boxedContract.ref.extract(4096, (approvalSize - 4096))

    const walletID = abstractedAccount.call
      .create({
        args: [
          this.childContractVersion.value,
          controlledAddress,
          admin,
          this.domain.value,
          this.escrowFactory.value.id,
          this.revocation.value.id,
          nickname,
          referrer
        ],
        approvalProgram: [approvalOne, approvalTwo],
        clearStateProgram: abstractedAccount.clearStateProgram,
        extraProgramPages: 3
      })
      .itxn
      .createdApp
      .id

    itxn
      .payment({
        receiver: Application(walletID).address,
        amount: Global.minBalance + ARC58WalletIDsByAccountsMbr
      })
      .submit()

    if (leftover > 0) {
      itxn
        .payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount: leftover,
        })
        .submit()
    }

    return walletID
  }

  @abimethod({ readonly: true })
  cost(): uint64 {

    const creationFee = getWalletFees(this.akitaDAO.value).createFee

    let referralCost: uint64 = 0
    if (creationFee > 0) {
      const wallet = getWalletIDUsingAkitaDAO(this.akitaDAO.value, Txn.sender)
      if (wallet.id > 0) {
        referralCost = costInstantDisbursement(this.akitaDAO.value, 0, 1)
      }
    }

    return (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * AbstractAccountNumGlobalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * AbstractAccountNumGlobalBytes) +
      Global.minBalance +
      ARC58WalletIDsByAccountsMbr +
      creationFee + 
      referralCost
    )
  }

  opUp(): void {}
}
