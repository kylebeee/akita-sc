import { Application, assertMatch, Global, gtxn, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Contract } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { ERR_INVALID_PAYMENT } from "../../account/errors";
import { CreateAssetParams } from "./types";

export class AsaMintPlugin extends Contract {

  mint(
    walletID: uint64,
    rekeyBack: boolean,
    assets: CreateAssetParams[],
    mbrPayment: gtxn.PaymentTxn
  ): uint64[] {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: Global.assetCreateMinBalance * assets.length
      },
      ERR_INVALID_PAYMENT
    )

    let assetsCreated: uint64[] = [];
    for (let i: uint64 = 0; i < assets.length; i++) {
      const {
        assetName,
        unitName,
        total,
        decimals,
        manager,
        reserve,
        freeze,
        clawback,
        defaultFrozen,
        url
      } = assets[i];

      const createTxn = itxn
        .assetConfig({
          sender,
          assetName,
          unitName,
          total,
          decimals,
          manager: manager.native,
          reserve: reserve.native,
          freeze: freeze.native,
          clawback: clawback.native,
          defaultFrozen,
          url,
          rekeyTo: i < (assets.length - 1) ? Global.zeroAddress : rekeyAddress(rekeyBack, wallet)
        })
        .submit()

      assetsCreated.push(createTxn.createdAsset.id);
    }

    return assetsCreated
  }
}