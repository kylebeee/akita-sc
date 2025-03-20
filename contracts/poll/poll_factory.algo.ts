import { assert, compile, Global, gtxn, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { FactoryContract } from "../../utils/base_contracts/factory.algo";
import { Poll } from "./poll.algo";
import { PollType } from "./types";
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from "../../utils/errors";
import { methodSelector } from "@algorandfoundation/algorand-typescript/arc4";

export class PollFactory extends FactoryContract {

  mint(
    payment: gtxn.PaymentTxn,
    type: PollType,
    gateID: uint64,
    endTime: uint64,
    selectionMax: uint64,
    question: string,
    options: string[],
  ): uint64 {

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)

    const poll = compile(Poll)
    assert(payment.amount ===
      (
        100_000 + (28_500 * poll.globalUints) + (50_000 * poll.globalBytes)
      ),
      ERR_INVALID_PAYMENT_AMOUNT
    )

    const mint = itxn
      .applicationCall({
        appArgs: [
          methodSelector(Poll.prototype.createApplication),
          type,
          endTime,
          selectionMax,
          question,
          options,
          gateID
        ],
        approvalProgram: poll.approvalProgram,
        clearStateProgram: poll.clearStateProgram,
        globalNumBytes: poll.globalBytes,
        globalNumUint: poll.globalUints,
        fee: 0,
      })
      .submit()

    return mint.createdApp.id
  }
}