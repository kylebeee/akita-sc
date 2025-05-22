import { assert, Contract, Global, itxn, Txn } from "@algorandfoundation/algorand-typescript";
import { abimethod } from "@algorandfoundation/algorand-typescript/arc4";
import { ERR_NOT_CREATOR, ERR_ONLY_CREATOR_CAN_REKEY } from "./errors";

export class ReceiveAccount extends Contract {

  rekey(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_ONLY_CREATOR_CAN_REKEY)

    itxn
      .payment({
        amount: 0,
        receiver: Global.creatorAddress,
        rekeyTo: Global.creatorAddress
      })
      .submit()
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_NOT_CREATOR)
    itxn
      .payment({ closeRemainderTo: Global.creatorAddress })
      .submit()
  }
}