import { Application, Asset, Global, gtxn, itxn, abimethod, assertMatch, uint64, assert, Contract } from "@algorandfoundation/algorand-typescript";
import { ERR_INVALID_PAYMENT } from "../../../utils/errors";
import { ERR_ALREADY_OPTED_IN } from "./errors";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { fee } from "../../../utils/constants";

export class OptInPlugin extends Contract {

  optInToAsset(walletID: uint64, rekeyBack: boolean, asset: uint64, mbrPayment: gtxn.PaymentTxn): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assert(!sender.isOptedIn(Asset(asset)), ERR_ALREADY_OPTED_IN)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: Global.assetOptInMinBalance
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .assetTransfer({
        sender,
        assetReceiver: sender,
        assetAmount: 0,
        xferAsset: Asset(asset),
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      })
      .submit();
  }
}
