import { Application, itxn, uint64, Contract, GlobalState, Account } from "@algorandfoundation/algorand-typescript";
import { abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PaySiloPluginGlobalStateKeyRecipient } from "./constants";

export class PaySiloPlugin extends Contract {

  recipient = GlobalState<Account>({ key: PaySiloPluginGlobalStateKeyRecipient })

  @abimethod({ onCreate: 'require' })
  create(recipient: Address): void {
    this.recipient.value = recipient.native
  }

  pay(walletID: uint64, rekeyBack: boolean, asset: uint64, amount: uint64): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    if (asset === 0) {
      itxn
        .payment({
          sender,
          receiver: this.recipient.value,
          amount,
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
        .submit()
    } else {
      itxn
        .assetTransfer({
          sender,
          assetReceiver: this.recipient.value,
          assetAmount: amount,
          xferAsset: asset,
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        })
        .submit()
    }
  }
}
