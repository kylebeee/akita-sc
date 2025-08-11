import { Application, itxn, uint64, Contract, GlobalState, Account, Global } from "@algorandfoundation/algorand-typescript";
import { abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PaySiloPluginGlobalStateKeyRecipient } from "./constants";
import { PaySiloParams } from "./types";

export class PaySiloPlugin extends Contract {

  recipient = GlobalState<Account>({ key: PaySiloPluginGlobalStateKeyRecipient })

  @abimethod({ onCreate: 'require' })
  create(recipient: Address): void {
    this.recipient.value = recipient.native
  }

  pay(walletID: uint64, rekeyBack: boolean, payments: PaySiloParams[]): void {
    const wallet = Application(walletID)
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
