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
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'

export class PrizeBoxFactory extends FactoryContract {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string): void {
    this.childContractVersion.value = version
  }

  // PRIZE BOX FACTORY METHODS --------------------------------------------------------------------

  mint(payment: gtxn.PaymentTxn, owner: Address): uint64 {

    const prizeBox = compileArc4(PrizeBox)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          MIN_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * prizeBox.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * prizeBox.globalBytes) +
          Global.minBalance
        ),
      },
      ERR_INVALID_PAYMENT
    )

    const prizeBoxApp = prizeBox.call
      .create({
        args: [owner],
      })
      .itxn
      .createdApp

    itxn
      .payment({
        receiver: prizeBoxApp.address,
        amount: Global.minBalance,
      })
      .submit()

    return prizeBoxApp.id
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // TODO: create readonly methods
}
