import { arc59GetSendAssetInfoResponse, AssetInbox } from '../types/asset_inbox';
import { AbstractedAccount } from '../../contracts/arc58/abstracted_account.algo';
import { OptInPlugin } from '../../contracts/arc58/plugins/optin.algo';
import { Account, Application, arc4, assert, Bytes, Contract, Global, gtxn, itxn, MutableArray, OnCompleteAction, op, TemplateVar, Txn, uint64 } from '@algorandfoundation/algorand-typescript';
import { Address, decodeArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { arc4AssetAndAmount } from '../types/optin';
import { classes } from 'polytype'
import { AbstractAccountGlobalStateKeysControlledAddress } from '../../contracts/arc58/constants';
import { itob } from '@algorandfoundation/algorand-typescript/op';

const assetInbox = TemplateVar<uint64>('ASSET_INBOX')

const optinPlugin = TemplateVar<uint64>('OPTIN_PLUGIN')

export class ContractWithOptIn extends Contract {
  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optin(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(payment.receiver === Global.currentApplicationAddress)
    assert(payment.amount === Global.assetOptInMinBalance)

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset,
        fee: 0,
      })
      .submit()
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

    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        assetAmount: 0,
        xferAsset: asset,
        fee: 0,
      })
      .submit()
  }
}

export class ContractWithArc59Send extends Contract {

  protected arc59OptInAndSend(recipient: Address, asset: uint64, amount: uint64, closeOut: boolean): void {

    const inboxAddress = Application(assetInbox).address

    // TODO: replace with itxn.abiCall when available
    const canCallTxn = itxn
      .applicationCall({
        appId: assetInbox,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(AssetInbox.prototype.arc59_getSendAssetInfo),
          recipient,
          asset,
        ],
        fee: 0,
      })
      .submit()

    const canCallData = decodeArc4<arc59GetSendAssetInfoResponse>(canCallTxn.lastLog)
    const mbr = canCallData.mbr
    const routerOptedIn = canCallData.routerOptedIn
    const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim

    if (mbr || receiverAlgoNeededForClaim) {
      itxn
        .payment({
          receiver: inboxAddress,
          amount: (mbr + receiverAlgoNeededForClaim),
          fee: 0,
        })
        .submit()
    }

    if (!routerOptedIn) {
      // TODO: replace with itxn.abiCall when available
      itxn
        .applicationCall({
          appId: assetInbox,
          onCompletion: OnCompleteAction.NoOp,
          appArgs: [
            methodSelector(AssetInbox.prototype.arc59_optRouterIn),
            asset,
          ],
          fee: 0,
        })
        .submit()
    }

    const xferTxn = itxn.assetTransfer({
      assetCloseTo: inboxAddress,
      assetReceiver: inboxAddress,
      assetAmount: amount,
      xferAsset: asset,
      fee: 0,
    })

    if (closeOut) {
      xferTxn.set({ assetCloseTo: inboxAddress })
    }

    // TODO: replace with itxn.abiCall when available
    itxn
      .applicationCall({
        appId: assetInbox,
        onCompletion: OnCompleteAction.NoOp,
        appArgs: [
          methodSelector(AssetInbox.prototype.arc59_sendAsset),
          xferTxn,
          recipient,
          receiverAlgoNeededForClaim,
        ],
        fee: 0,
      })
      .submit()
  }
}

export class ContractWithArc58Send extends Contract {

  protected getControlledAccount(app: Application): Account {
    const [controlledAccountBytes] = op.AppGlobal.getExBytes(app, Bytes(AbstractAccountGlobalStateKeysControlledAddress));
    return Account(Bytes(controlledAccountBytes));
  }

  protected arc58OptInAndSend(recipientAppID: uint64, optins: arc4.DynamicArray<arc4AssetAndAmount>): void {

    const controlledAccount = this.getControlledAccount(Application(recipientAppID))

    // TODO: replace with itxn.abiCall when available
    const rekeyToPlugin = itxn.applicationCall({
      appId: recipientAppID,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [
        methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
        itob(optinPlugin),
        [],
      ],
      fee: 0,
    })

    let appCalls: itxn.ApplicationCallItxnParams[] = []
    let xfers: itxn.AssetTransferItxnParams[] = []
    for (let i: uint64 = 0; i < optins.length; i++) {
      const optin = optins[i]
      const rekeyBack = i === (optins.length - 1)

      appCalls = [
        ...appCalls,
        // TODO: replace with itxn.abiCall when available
        itxn.applicationCall({
          appId: optinPlugin,
          onCompletion: OnCompleteAction.NoOp,
          appArgs: [
            methodSelector(OptInPlugin.prototype.optInToAsset),
            recipientAppID,
            rekeyBack,
            optin.asset,
            itxn.payment({
              receiver: controlledAccount,
              amount: Global.assetOptInMinBalance,
              fee: 0,
            }),
          ],
          fee: 0,
        })
      ]

      if (optin.amount.native > 0) {
        xfers = [
          ...xfers,
          itxn.assetTransfer({
            assetAmount: optin.amount.native,
            assetReceiver: controlledAccount,
            xferAsset: optin.asset.native,
            fee: 0,
          })
        ]
      }
    }

    // TODO: replace with itxn.abiCall when available
    const verifyRekeyBack = itxn.applicationCall({
      appId: recipientAppID,
      onCompletion: OnCompleteAction.NoOp,
      appArgs: [methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)],
      fee: 0,
    })

    itxn.submitGroup(rekeyToPlugin, ...appCalls, ...xfers, verifyRekeyBack)
  }
}

export class ContractWithCreatorOnlyOptInAndArc59
  extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc59Send
  ) { }

export class ContractWithCreatorOnlyOptInAndArc58
  extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc58Send
  ) { }

export class ContractWithCreatorOnlyOptInAndArc59AndArc58
  extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc59Send,
    ContractWithArc58Send
  ) { }