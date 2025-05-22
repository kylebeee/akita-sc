import { Application, assert, assertMatch, Contract, Global, GlobalState, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript"
import { ERR_INVALID_PAYMENT, ERR_ONLY_CREATOR_CAN_REKEY, ERR_ONLY_FACTORY_CAN_DELETE, ERR_ONLY_WALLET_OR_PLUGIN } from "./errors"
import { abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4"
import { SpendingAccountGlobalStateKeyPluginID, SpendingAccountGlobalStateKeyWalletID } from "./constants";
import { fee } from '../../utils/constants'
import { SpendingAccountInterface } from "../../utils/types/spend-accounts";
 
export class SpendingAccountContract extends Contract implements SpendingAccountInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the wallet that owns the spending account */
  walletID = GlobalState<uint64>({ key: SpendingAccountGlobalStateKeyWalletID })
  /** the plugin that the spending account was created for */
  pluginID = GlobalState<uint64>({ key: SpendingAccountGlobalStateKeyPluginID })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private isWallet() {
    return Txn.sender === Application(this.walletID.value).address
  }

  private isPlugin() {
    return Txn.sender === Application(this.pluginID.value).address
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(walletID: uint64, plugin: uint64): void {
    this.walletID.value = walletID
    this.pluginID.value = plugin
  }

  @abimethod({ allowActions: ['DeleteApplication'] })
  deleteApplication(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_ONLY_FACTORY_CAN_DELETE)
  }

  // SPENDING ACCOUNT METHODS ---------------------------------------------------------------------

  rekey(address: Address): void {
    assert(this.isWallet(), ERR_ONLY_CREATOR_CAN_REKEY)

    itxn
      .payment({
        amount: 0,
        rekeyTo: address.native,
        fee,
      })
      .submit()
  }

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(this.isWallet() || this.isPlugin(), ERR_ONLY_WALLET_OR_PLUGIN)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: Global.assetOptInMinBalance,
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset,
        fee,
      })
      .submit()
  }
}