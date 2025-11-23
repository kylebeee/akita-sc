import { Account, Application, Contract, Global, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { abimethod } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PaySiloPluginGlobalStateKeyRecipient } from "./constants";
import { PaySiloParams } from "./types";

export class PaySiloPlugin extends Contract {

  recipient = GlobalState<Account>({ key: PaySiloPluginGlobalStateKeyRecipient })

  @abimethod({ onCreate: 'require' })
  create(recipient: Account): void {
    this.recipient.value = recipient
  }

  pay(wallet: Application, rekeyBack: boolean, payments: PaySiloParams[]): void {
    const sender = getSpendingAccount(wallet)

    for (let i: uint64 = 0; i < payments.length; i++) {
      const { asset, amount } = payments[i];

      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: this.recipient.value,
            amount,
            rekeyTo: i < (payments.length - 1) ? Global.zeroAddress : rekeyAddress(rekeyBack, wallet),
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: this.recipient.value,
            assetAmount: amount,
            xferAsset: asset,
            rekeyTo: i < (payments.length - 1) ? Global.zeroAddress : rekeyAddress(rekeyBack, wallet),
          })
          .submit()
      }
    }
  }
}
