import { Application, itxn, uint64, Contract, Global } from "@algorandfoundation/algorand-typescript";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PayParams } from "./types";

export class PayPlugin extends Contract {

  pay(wallet: Application, rekeyBack: boolean, payments: PayParams[]): void {
    const sender = getSpendingAccount(wallet)

    for (let i: uint64 = 0; i < payments.length; i++) {
      const { receiver, asset, amount } = payments[i];

      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: receiver.native,
            amount,
            rekeyTo: i < (payments.length - 1) ? Global.zeroAddress : rekeyAddress(rekeyBack, wallet),
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: receiver.native,
            assetAmount: amount,
            xferAsset: asset,
            rekeyTo: i < (payments.length - 1) ? Global.zeroAddress : rekeyAddress(rekeyBack, wallet),
          })
          .submit()
      }
    }
  }
}
