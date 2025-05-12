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
import { GlobalStateKeyRevocationApp } from '../../constants'
import { AbstractedAccount } from './contract.algo'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { abimethod, Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_INVALID_PAYMENT } from '../../utils/errors'
import { FactoryContract } from '../../utils/base-contracts/factory'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../../utils/constants'

export class AbstractedAccountFactory extends FactoryContract {
  
  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the default app thats allowed to revoke plugins */
  revocationApp = GlobalState<uint64>({ key: GlobalStateKeyRevocationApp })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(akitaDAO: uint64, version: string, childVersion: string, revocationApp: uint64): void {
    this.akitaDAO.value = Application(akitaDAO)
    this.version.value = version
    this.childContractVersion.value = childVersion
    this.revocationApp.value = revocationApp
  }

  // ABSTRACTED ACCOUNT FACTORY METHODS -----------------------------------------------------------

  updateRevocationApp(app: uint64): void {
    assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
    this.revocationApp.value = app
  }

  mint(payment: gtxn.PaymentTxn, controlledAccount: Address, admin: Address, nickname: string): uint64 {
    
    const abstractedAccount = compileArc4(AbstractedAccount)

    const childMBR: uint64 = (
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * abstractedAccount.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * abstractedAccount.globalBytes) +
      AccountMinimumBalance
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
      .createApplication({
        args: [
          this.childContractVersion.value,
          controlledAccount,
          admin,
          this.revocationApp.value,
          nickname,
        ],
        extraProgramPages: 3,
        fee: 0,
      })
      .itxn
      .createdApp
      .id

    itxn
      .payment({
        receiver: Application(walletID).address,
        amount: AccountMinimumBalance,
        fee: 0,
      })
      .submit()

    return walletID
  }
}
