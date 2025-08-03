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
import { AbstractAccountNumGlobalBytes, AbstractAccountNumGlobalUints } from './constants'

export class AbstractedAccountFactory extends FactoryContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the escrow factory app */
  escrowFactory = GlobalState<Application>({ key: GlobalStateKeyEscrowFactory })
  /** the default app thats allowed to revoke plugins */
  revocation = GlobalState<Application>({ key: GlobalStateKeyRevocation })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string, childVersion: string, escrowFactoryApp: uint64, revocationApp: uint64): void {
    this.akitaDAO.value = Application(akitaDAO)
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.escrowFactory.value = Application(escrowFactoryApp)
    this.revocation.value = Application(revocationApp)
  }

  // ABSTRACTED ACCOUNT FACTORY METHODS -----------------------------------------------------------

  updateRevocationApp(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.revocation.value = Application(app)
  }

  new(payment: gtxn.PaymentTxn, controlledAddress: Address, admin: Address, nickname: string): uint64 {

    const abstractedAccount = compileArc4(AbstractedAccount)

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * abstractedAccount.globalUints) + // 228_000
      (GLOBAL_STATE_KEY_BYTES_COST * abstractedAccount.globalBytes) + // 300_000
      Global.minBalance +
      ARC58WalletIDsByAccountsMbr
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: childMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const walletID = abstractedAccount.call
      .create({
        args: [
          this.childContractVersion.value,
          controlledAddress,
          admin,
          this.escrowFactory.value.id,
          this.revocation.value.id,
          nickname,
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

    return walletID
  }

  @abimethod({ readonly: true })
  cost(): uint64 {
    // const abstractedAccount = compileArc4(AbstractedAccount)

    return (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * AbstractAccountNumGlobalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * AbstractAccountNumGlobalBytes) +
      Global.minBalance +
      ARC58WalletIDsByAccountsMbr
    )
  }
}
