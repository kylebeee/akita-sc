import {
  abimethod,
  assert,
  assertMatch,
  Global,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { PrizeBox } from './contract.algo'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { FactoryContract } from '../utils/base-contracts/factory'
import { AccountMinimumBalance, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'

const prizeBox = compileArc4(PrizeBox)

export class PrizeBoxFactory extends FactoryContract {

  @abimethod({ onCreate: 'require' })
  createApplication(version: string): void {
    this.childContractVersion.value = version
  }

  @abimethod({ allowActions: 'UpdateApplication' })
  updateApplication(): void {
    assert(Txn.sender === Global.creatorAddress, 'Only the creator can update the application')
  }

  mint(payment: gtxn.PaymentTxn, owner: Address): uint64 {
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          MIN_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * prizeBox.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * prizeBox.globalBytes) +
          AccountMinimumBalance
        ),
      },
      ERR_INVALID_PAYMENT
    )

    const prizeBoxApp = prizeBox.call
      .createApplication({
        args: [owner],
        fee: 0,
      })
      .itxn
      .createdApp

    itxn
      .payment({
        receiver: prizeBoxApp.address,
        amount: AccountMinimumBalance,
        fee: 0,
      })
      .submit()

    return prizeBoxApp.id
  }
}
