import { Account, Application, Asset, Contract, Global, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall } from "@algorandfoundation/algorand-typescript/arc4";
import { getSpendingAccount, rekeyAddress } from "../../../utils/functions";
import { PayPlugin } from "../pay/contract.algo";

/**
 * Test plugin that demonstrates double rekey scenarios.
 * 
 * This plugin calls the PayPlugin internally (without rekeying back),
 * then performs another operation, then finally rekeys back to the wallet.
 * 
 * Flow:
 * 1. Wallet rekeys spending account to this plugin
 * 2. This plugin calls PayPlugin with rekeyBack=false (account stays rekeyed to PayPlugin)
 * 3. PayPlugin performs payment, rekeys to zeroAddress (stays rekeyed to PayPlugin)
 * 4. This plugin performs another payment (from the still-rekeyed account)
 * 5. This plugin rekeys back to wallet (if rekeyBack=true)
 */
export class TestProxyRekeyPlugin extends Contract {

  /**
   * Perform an ALGO payment through the PayPlugin.
   * This tests that the double rekey chain works correctly for ALGO.
   */
  proxyPay(
    wallet: Application,
    rekeyBack: boolean,
    payPlugin: Application,
    receiver: Account,
    asset: uint64,
    amount: uint64,
  ): void {
    const sender = getSpendingAccount(wallet);

    itxn
      .payment({
        sender,
        receiver: Global.currentApplicationAddress,
        amount: 0,
        rekeyTo: payPlugin.address,
      })
      .submit();

    abiCall<typeof PayPlugin.prototype.pay>({
      appId: payPlugin,
      args: [
        wallet,
        rekeyBack,
        [{ receiver, asset, amount }]
      ]
    });
  }
}
