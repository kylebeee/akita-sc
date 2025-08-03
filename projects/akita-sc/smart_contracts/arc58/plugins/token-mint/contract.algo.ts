import { abimethod, Application, assertMatch, Global, gtxn, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../utils/base-contracts/base";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { ERR_INVALID_PAYMENT } from "../../account/errors";

export class TokenMintPlugin extends AkitaBaseContract {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // TOKEN MINT PLUGIN METHODS -----------------------------------------------------------------

  mint(
    walletID: uint64,
    rekeyBack: boolean,
    assetName: string,
    unitName: string,
    total: uint64,
    decimals: uint64,
    manager: Address,
    reserve: Address,
    freeze: Address,
    clawback: Address,
    defaultFrozen: boolean,
    url: string,
    mbrPayment: gtxn.PaymentTxn
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    assertMatch(
      mbrPayment,
      {
        receiver: sender,
        amount: Global.assetCreateMinBalance
      },
      ERR_INVALID_PAYMENT
    )

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
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
      .submit()

    return createTxn.createdAsset.id
  }
}