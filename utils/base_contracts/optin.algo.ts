import {
    Account,
    Application,
    arc4,
    assert,
    Bytes,
    Contract,
    Global,
    gtxn,
    itxn,
    OnCompleteAction,
    op,
    TemplateVar,
    Txn,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, decodeArc4, DynamicArray, methodSelector, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { itob } from '@algorandfoundation/algorand-typescript/op'
import { AssetInbox } from '../types/asset_inbox'
import { AbstractedAccount } from '../../contracts/arc58/abstracted_account.algo'
import { OptInPlugin } from '../../contracts/arc58/plugins/optin.algo'
import { arc4AssetAndAmount } from '../types/optin'
import { AbstractAccountGlobalStateKeysControlledAddress } from '../../contracts/arc58/constants'

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

export class ContractWithArc59Send extends Contract {
    protected arc59OptInAndSend(recipient: Address, asset: uint64, amount: uint64, closeOut: boolean): void {
        const inboxAddress = Application(assetInbox).address

        const canCallData = abiCall(AssetInbox.prototype.arc59_getSendAssetInfo, {
            appId: assetInbox,
            onCompletion: OnCompleteAction.NoOp,
            args: [recipient, asset],
            fee: 0,
        }).returnValue

        const mbr = canCallData.mbr
        const routerOptedIn = canCallData.routerOptedIn
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim

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
            assetCloseTo: inboxAddress,
            assetReceiver: inboxAddress,
            assetAmount: amount,
            xferAsset: asset,
            fee: 0,
        })

        if (closeOut) {
            xferTxn.set({ assetCloseTo: inboxAddress })
        }

        abiCall(AssetInbox.prototype.arc59_sendAsset, {
            appId: assetInbox,
            onCompletion: OnCompleteAction.NoOp,
            args: [xferTxn, recipient, receiverAlgoNeededForClaim],
            fee: 0,
        })
    }
}

export class ContractWithArc58Send extends Contract {
    protected getControlledAccount(app: Application): Account {
        const [controlledAccountBytes] = op.AppGlobal.getExBytes(
            app,
            Bytes(AbstractAccountGlobalStateKeysControlledAddress)
        )
        return Account(Bytes(controlledAccountBytes))
    }

    protected arc58OptInAndSend(recipientAppID: uint64, optin: arc4AssetAndAmount): void {
        const controlledAccount = this.getControlledAccount(Application(recipientAppID))

        const rekeyTxn = itxn.applicationCall({
            appId: recipientAppID,
            onCompletion: OnCompleteAction.NoOp,
            appArgs: [
                methodSelector(AbstractedAccount.prototype.arc58_rekeyToPlugin),
                itob(optinPlugin),
                new DynamicArray<UintN64>(),
            ],
            fee: 0,
        })

        const optinTxn = itxn.applicationCall({
            appId: optinPlugin,
            onCompletion: OnCompleteAction.NoOp,
            appArgs: [
                // methodSelector('optInToAsset(uint64,boolean,uint64,pay)void'),
                methodSelector(OptInPlugin.prototype.optInToAsset),
                recipientAppID,
                true,
                optin.asset,
                itxn.payment({
                    receiver: controlledAccount,
                    amount: Global.assetOptInMinBalance,
                    fee: 0,
                }),
            ],
            fee: 0,
        })

        const rekeyBackTxn = itxn.applicationCall({
            appId: recipientAppID,
            onCompletion: OnCompleteAction.NoOp,
            appArgs: [methodSelector(AbstractedAccount.prototype.arc58_verifyAuthAddr)],
            fee: 0,
        })

        if (optin.amount.native > 0) {
            const xferTxn = itxn.assetTransfer({
                assetAmount: optin.amount.native,
                assetReceiver: controlledAccount,
                xferAsset: optin.asset.native,
                fee: 0,
            })

            itxn.submitGroup(rekeyTxn, optinTxn, xferTxn, rekeyBackTxn)
            return
        }

        itxn.submitGroup(rekeyTxn, optinTxn, rekeyBackTxn)
    }
}

export class ContractWithCreatorOnlyOptInAndArc59 extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc59Send
) { }

export class ContractWithCreatorOnlyOptInAndArc58 extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc58Send
) { }

export class ContractWithCreatorOnlyOptInAndArc59AndArc58 extends classes(
    ContractWithCreatorOnlyOptIn,
    ContractWithArc59Send,
    ContractWithArc58Send
) { }
