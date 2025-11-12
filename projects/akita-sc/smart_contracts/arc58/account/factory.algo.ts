import {
  Application,
  assert,
  assertMatch,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { GlobalStateKeyEscrowFactory, GlobalStateKeyRevocation } from '../../constants'
import { AbstractedAccount } from './contract.algo'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { abimethod, Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_INVALID_PAYMENT } from '../../utils/errors'
import { FactoryContract } from '../../utils/base-contracts/factory'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../../utils/constants'
import { ARC58WalletIDsByAccountsMbr } from '../../escrow/constants'
import { AbstractAccountNumGlobalBytes, AbstractAccountNumGlobalUints, AbstractedAccountFactoryGlobalStateKeyDomain } from './constants'
import { costInstantDisbursement, getWalletFees, getWalletIDUsingAkitaDAO, referrerOrZeroAddress, sendReferralPayment } from '../../utils/functions'
import { AbstractedAccountFactoryInterface } from '../../utils/abstract-account'


export class AbstractedAccountFactory extends FactoryContract implements AbstractedAccountFactoryInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the escrow factory app */
  escrowFactory = GlobalState<Application>({ key: GlobalStateKeyEscrowFactory })
  /** the default app thats allowed to revoke plugins */
  revocation = GlobalState<Application>({ key: GlobalStateKeyRevocation })
  /** domain */
  domain = GlobalState<string>({ key: AbstractedAccountFactoryGlobalStateKeyDomain })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(
    akitaDAO: Application,
    akitaDAOEscrow: Application,
    version: string,
    escrowFactory: Application,
    revocation: Application,
    domain: string
  ): void {
    this.akitaDAO.value = akitaDAO
    this.akitaDAOEscrow.value = akitaDAOEscrow
    this.version.value = version
    this.escrowFactory.value = escrowFactory
    this.revocation.value = revocation
    this.domain.value = domain
  }

  // ABSTRACTED ACCOUNT FACTORY METHODS -----------------------------------------------------------

  updateRevocation(app: Application): void {
    assert(Txn.sender === this.getAkitaDAOWallet().address, ERR_NOT_AKITA_DAO)
    this.revocation.value = app
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

    const approvalSize = this.boxedContract.length
    const chunk1 = this.boxedContract.extract(0, 4096)
    const chunk2 = this.boxedContract.extract(4096, approvalSize - 4096)

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
        approvalProgram: [chunk1, chunk2],
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
}
