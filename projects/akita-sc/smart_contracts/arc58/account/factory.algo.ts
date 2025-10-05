import {
  Application,
  assert,
  assertMatch,
  Global,
  GlobalState,
  gtxn,
  itxn,
  op,
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

  // ABSTRACTED ACCOUNT FACTORY METHODS -----------------------------------------------------------

  updateRevocationApp(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.revocation.value = Application(app)
  }

  new(
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
