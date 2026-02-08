import { Account, Application, Asset, Contract, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";

/**
 * Test plugin for close-out scenarios.
 * 
 * This plugin can:
 * - Close out ALGO balance to a specified address
 * - Close out ASA balance to a specified address
 */
export class TestCloseOutPlugin extends Contract {

  /**
   * Close out ALGO balance of the spending account.
   * Sends `amount` to `receiver` and optionally closes the remaining ALGO balance to `closeTo`.
   * If closeTo equals the sender (wallet address), no close-out is performed.
   */
  closeOutAlgo(
    wallet: Application,
    rekeyBack: boolean,
    receiver: Account,
    amount: uint64,
    closeTo: Account
  ): void {
    const sender = getSpendingAccount(wallet);

    itxn
      .payment({
        sender,
        receiver,
        amount,
        closeRemainderTo: closeTo,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
      .submit();
  }

  /**
   * Close out an ASA balance of the spending account.
   * Sends `amount` to `receiver` and closes the remaining asset balance to `assetCloseTo`.
   */
  closeOutAsset(
    wallet: Application,
    rekeyBack: boolean,
    asset: Asset,
    receiver: Account,
    assetCloseTo: Account
  ): void {
    const sender = getSpendingAccount(wallet);

    itxn
      .assetTransfer({
        sender,
        assetReceiver: receiver,
        assetAmount: 0,
        xferAsset: asset,
        assetCloseTo,
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
      .submit();
  }
}
