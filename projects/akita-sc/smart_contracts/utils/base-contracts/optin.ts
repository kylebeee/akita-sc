import {
  Application,
  assert,
  Contract,
  Global,
  gtxn,
  itxn,
  OnCompleteAction,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, DynamicArray, methodSelector, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { AssetInbox } from '../types/asset-inbox'
import { AbstractedAccount } from '../../arc58/account/contract.algo'
import { OptInPlugin } from '../../arc58/plugins/optin.algo'
import { AssetAndAmount } from '../types/optin'
import { AkitaBaseContract } from './base'

export class ContractWithOptIn extends Contract {
  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(payment.receiver === Global.currentApplicationAddress)
    assert(payment.amount === Global.assetOptInMinBalance)

    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee: 0,
    }).submit()
  }
}

export class ContractWithCreatorOnlyOptIn extends Contract {
  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(Txn.sender === Global.creatorAddress)
    assert(payment.receiver === Global.currentApplicationAddress)
    assert(payment.amount === Global.assetOptInMinBalance)

    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee: 0,
    }).submit()
  }
}

export class ContractWithArc59Send extends AkitaBaseContract {
  protected arc59OptInAndSend(recipient: Address, asset: uint64, amount: uint64, closeOut: boolean): void {
    const assetInbox = super.getOtherAppList().assetInbox
    const inboxAddress = Application().address

    const { mbr, routerOptedIn, receiverAlgoNeededForClaim } = abiCall(
      AssetInbox.prototype.arc59_getSendAssetInfo,
      {
        appId: assetInbox,
        args: [recipient, asset],
        fee: 0,
      }
    ).returnValue

    if (mbr || receiverAlgoNeededForClaim) {
      itxn.payment({
        receiver: inboxAddress,
        amount: mbr + receiverAlgoNeededForClaim,
        fee: 0,
      }).submit()
    }

    if (!routerOptedIn) {
      abiCall(AssetInbox.prototype.arc59_optRouterIn, {
        appId: assetInbox,
        args: [asset],
        fee: 0,
      })
    }

    const xferTxn = itxn.assetTransfer({
      assetReceiver: inboxAddress,
      assetAmount: amount,
      xferAsset: asset,
      fee: 0,
    })

    if (closeOut) {
      xferTxn.set({
        assetReceiver: undefined,
        assetAmount: undefined,
        assetCloseTo: inboxAddress
      })
    }

    abiCall(AssetInbox.prototype.arc59_sendAsset, {
      appId: assetInbox,
      args: [xferTxn, recipient, receiverAlgoNeededForClaim],
      fee: 0,
    })
  }
}

export class ContractWithArc58Send extends AkitaBaseContract {

  protected arc58OptInAndSend(recipientWalletID: uint64, optin: AssetAndAmount): void {
    const optinPlugin = super.getPluginAppList().optin
    const origin = this.getOriginAccount(Application(recipientWalletID))

    const rekeyTxn = itxn.applicationCall({
      appId: recipientWalletID,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
        itob(optinPlugin),
        new DynamicArray<UintN64>(),
      ],
      fee: 0,
    })

    const optinPayment = itxn.payment({
      receiver: origin,
      amount: Global.assetOptInMinBalance,
      fee: 0,
    })

    const optinTxn = itxn.applicationCall({
      appId: optinPlugin,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [
        methodSelector(OptInPlugin.prototype.optInToAsset),
        recipientWalletID,
        true,
        optin.asset,
      ],
      fee: 0,
    })

    const rekeyBackTxn = itxn.applicationCall({
      appId: recipientWalletID,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)],
      fee: 0,
    })

    if (optin.amount > 0) {
      const xferTxn = itxn.assetTransfer({
        assetAmount: optin.amount,
        assetReceiver: origin,
        xferAsset: optin.asset,
        fee: 0,
      })

      itxn.submitGroup(rekeyTxn, optinTxn, xferTxn, rekeyBackTxn)
      return
    }

    itxn.submitGroup(rekeyTxn, optinPayment, optinTxn, rekeyBackTxn)
  }
}