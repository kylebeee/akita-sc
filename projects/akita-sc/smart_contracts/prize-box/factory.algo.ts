import {
  abimethod,
  Account,
  Application,
  assertMatch,
  Global,
  gtxn,
  itxn,
  uint64
} from '@algorandfoundation/algorand-typescript'
import { compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'

// CONTRACT IMPORTS
import { FactoryContract } from '../utils/base-contracts/factory'
import { PrizeBox } from './contract.algo'


export class PrizeBoxFactory extends FactoryContract {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.childContractVersion.value = version
    this.akitaDAO.value = akitaDAO
  }

  // PRIZE BOX FACTORY METHODS --------------------------------------------------------------------

  mint(payment: gtxn.PaymentTxn, owner: Account): uint64 {

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
