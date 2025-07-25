import { assertMatch, Global, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { FactoryContract } from '../utils/base-contracts/factory'
import { Poll } from './contract.algo'
import { PollType } from './types'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MIN_PROGRAM_PAGES } from '../utils/constants'

export class PollFactory extends FactoryContract {
  mint(
    payment: gtxn.PaymentTxn,
    type: PollType,
    endTime: uint64,
    maxSelected: uint64,
    question: string,
    options: string[],
    gateID: uint64,
  ): uint64 {

    const poll = compileArc4(Poll)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (
          MIN_PROGRAM_PAGES +
          (GLOBAL_STATE_KEY_UINT_COST * poll.globalUints) +
          (GLOBAL_STATE_KEY_BYTES_COST * poll.globalBytes) +
          Global.minBalance
        ),
      },
      ERR_INVALID_PAYMENT
    )

    const mint = poll.call
      .create({
        args: [
          this.akitaDAO.value.id,
          type,
          endTime,
          maxSelected,
          question,
          options,
          gateID
        ],
      })
      .itxn
      .createdApp
      .id

    return mint
  }
}
