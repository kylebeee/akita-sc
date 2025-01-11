import { Contract } from '@algorandfoundation/tealscript';
import { arc59GetSendAssetInfoResponse, AssetInbox } from '../types/asset_inbox';
import { AkitaAppIDsOptinPlugin, OtherAppIDsAssetInbox } from '../constants';
import { AbstractedAccount } from '../../contracts/arc58/abstracted_account.algo';
import { OptInPlugin } from '../../contracts/arc58/plugins/optin.algo';

export class ContractWithOptIn extends Contract {
    programVersion = 10;

    /**
     * optin tells the contract to opt into an asa
     * @param payment The payment transaction
     * @param asset The asset to be opted into
     */
    optin(payment: PayTxn, asset: AssetID): void {
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: globals.assetOptInMinBalance,
        });

        sendAssetTransfer({
            sender: this.app.address,
            assetReceiver: this.app.address,
            assetAmount: 0,
            xferAsset: asset,
            fee: 0,
        });
    }
}

export class ContractWithOptInCreatorOnly extends Contract {
    programVersion = 10;

    /**
     * optin tells the contract to opt into an asa
     * @param payment The payment transaction
     * @param asset The asset to be opted into
     */
    optin(payment: PayTxn, asset: AssetID): void {
        assert(this.txn.sender === this.app.creator)

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: globals.assetOptInMinBalance,
        });

        sendAssetTransfer({
            sender: this.app.address,
            assetReceiver: this.app.address,
            assetAmount: 0,
            xferAsset: asset,
            fee: 0,
        });
    }
}

export class ContractWithArc59Send extends Contract {
    programVersion = 10;

    protected arc59OptInAndSend(recipient: Address, asset: AssetID, amount: uint64, closeOut: boolean): void {
        const assetInboxAppID = AppID.fromUint64(OtherAppIDsAssetInbox);
        const canCallData = sendMethodCall<typeof AssetInbox.prototype.arc59_getSendAssetInfo, arc59GetSendAssetInfoResponse>({
            applicationID: assetInboxAppID,
            methodArgs: [
                recipient,
                asset.id,
            ],
            fee: 0,
        });

        const mbr = canCallData.mbr;
        const routerOptedIn = canCallData.routerOptedIn;
        const receiverAlgoNeededForClaim = canCallData.receiverAlgoNeededForClaim;

        if (mbr || receiverAlgoNeededForClaim) {
            this.pendingGroup.addPayment({
                receiver: assetInboxAppID.address,
                amount: (mbr + receiverAlgoNeededForClaim),
                fee: 0,
            });
        }

        if (!routerOptedIn) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_optRouterIn, void>({
                applicationID: assetInboxAppID,
                methodArgs: [asset.id],
                fee: 0
            });
        }

        if (closeOut) {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
                applicationID: assetInboxAppID,
                methodArgs: [
                    {
                        assetCloseTo: assetInboxAppID.address,
                        assetReceiver: assetInboxAppID.address,
                        assetAmount: amount,
                        xferAsset: asset,
                        fee: 0,
                    },
                    recipient,
                    receiverAlgoNeededForClaim,
                ],
                fee: 0
            });
        } else {
            this.pendingGroup.addMethodCall<typeof AssetInbox.prototype.arc59_sendAsset, Address>({
                applicationID: assetInboxAppID,
                methodArgs: [
                    {
                        assetReceiver: assetInboxAppID.address,
                        assetAmount: amount,
                        xferAsset: asset,
                        fee: 0,
                    },
                    recipient,
                    receiverAlgoNeededForClaim,
                ],
                fee: 0
            });
        }

        this.pendingGroup.submit();
    }
}

export class ContractWithArc58Send extends Contract {
    programVersion = 10;

    protected arc58OptInAndSend(recipientAppID: AppID, asset: AssetID, amount: uint64): void {
        this.pendingGroup.addPayment({
            amount: globals.assetOptInMinBalance,
            receiver: this.app.address,
            fee: 0,
        });
        
        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin, void>({
            applicationID: recipientAppID,
            methodArgs: [
                AppID.fromUint64(AkitaAppIDsOptinPlugin),
                [],
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof OptInPlugin.prototype.optInToAsset, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsOptinPlugin),
            methodArgs: [
                recipientAppID,
                true,
                asset,
                {
                    receiver: recipientAppID.address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                }
            ],
            fee: 0,
        });

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            applicationID: recipientAppID,
            fee: 0,
        });

        this.pendingGroup.addAssetTransfer({
            assetAmount: amount,
            assetReceiver: recipientAppID.address,
            xferAsset: asset,
            fee: 0,
        });

        this.pendingGroup.submit();
    }
}

export class ContractWithOptInCreatorOnlyArc59
    extends Contract.extend(
        ContractWithOptInCreatorOnly,
        ContractWithArc59Send
    ) {}

export class ContractWithOptInCreatorOnlyArc59AndArc58 
    extends Contract.extend(
        ContractWithOptInCreatorOnly,
        ContractWithArc59Send,
        ContractWithArc58Send
    ) {}