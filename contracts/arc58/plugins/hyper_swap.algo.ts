import { Contract } from '@algorandfoundation/tealscript'
import {
    HYPER_SWAP_HASH_MBR_AMOUNT,
    HYPER_SWAP_OFFER_MBR_AMOUNT,
    HYPER_SWAP_PARTICIPANT_MBR_AMOUNT,
    HyperSwap,
} from '../../hyper_swap/hyper_swap.algo'
import { AkitaAppIDsDAO, AkitaAppIDsHyperSwap, AkitaAppIDsOptinPlugin } from '../../../utils/constants'
import { AbstractedAccount } from '../abstracted_account.algo'
import { OptInPlugin } from './optin.algo'

const AKITA_DAO_HYPER_SWAP_OFFER_FEE_KEY = 'hyper_swap_offer_fee'

export class HyperSwapPlugin extends Contract {
    private canCallArc58OptIn(walletAppID: AppID): boolean {
        return sendMethodCall<typeof AbstractedAccount.prototype.arc58_canCall, boolean>({
            applicationID: walletAppID,
            methodArgs: [AppID.fromUint64(AkitaAppIDsOptinPlugin), this.app.address],
            fee: 0,
        })
    }

    private arc58OptIn(sender: AppID, recipientAppID: AppID, asset: AssetID): void {
        this.pendingGroup.addPayment({
            sender: sender.address,
            amount: globals.assetOptInMinBalance,
            receiver: this.app.address,
            fee: 0,
            isFirstTxn: true,
        })

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_rekeyToPlugin, void>({
            applicationID: recipientAppID,
            methodArgs: [AppID.fromUint64(AkitaAppIDsOptinPlugin), []],
            fee: 0,
        })

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
                },
            ],
            fee: 0,
        })

        this.pendingGroup.addMethodCall<typeof AbstractedAccount.prototype.arc58_verifyAuthAddr, void>({
            applicationID: recipientAppID,
            fee: 0,
        })

        this.pendingGroup.submit()
    }

    offer(
        sender: AppID,
        rekeyBack: boolean,
        root: bytes32,
        leaves: uint64,
        participantsRoot: bytes32,
        participantLeaves: uint64,
        expiration: uint64
    ) {
        const akitaFee = AppID.fromUint64(AkitaAppIDsDAO).globalState(AKITA_DAO_HYPER_SWAP_OFFER_FEE_KEY) as uint64

        sendMethodCall<typeof HyperSwap.prototype.offer, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsHyperSwap),
            methodArgs: [
                {
                    sender: sender.address,
                    amount: HYPER_SWAP_OFFER_MBR_AMOUNT,
                    receiver: AppID.fromUint64(AkitaAppIDsHyperSwap).address,
                },
                {
                    sender: sender.address,
                    amount: akitaFee,
                    receiver: AppID.fromUint64(AkitaAppIDsDAO).address,
                },
                root,
                leaves,
                participantsRoot,
                participantLeaves,
                expiration,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    accept(sender: AppID, rekeyBack: boolean, id: uint64, proof: bytes32[]) {
        sendMethodCall<typeof HyperSwap.prototype.accept, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsHyperSwap),
            methodArgs: [
                {
                    sender: sender.address,
                    amount: HYPER_SWAP_PARTICIPANT_MBR_AMOUNT,
                    receiver: AppID.fromUint64(AkitaAppIDsHyperSwap).address,
                },
                id,
                proof,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    escrow(sender: AppID, rekeyBack: boolean, id: uint64, receiver: Address, amount: uint64, proof: bytes32[]) {
        sendMethodCall<typeof HyperSwap.prototype.escrow, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsHyperSwap),
            methodArgs: [
                {
                    sender: sender.address,
                    amount: amount + HYPER_SWAP_HASH_MBR_AMOUNT,
                    receiver: AppID.fromUint64(AkitaAppIDsHyperSwap).address,
                },
                id,
                receiver,
                amount,
                proof,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    escrowAsa(
        sender: AppID,
        rekeyBack: boolean,
        id: uint64,
        receiver: Address,
        asset: AssetID,
        amount: uint64,
        proof: bytes32[]
    ) {
        let mbrAmount = HYPER_SWAP_HASH_MBR_AMOUNT

        if (!receiver.isOptedInToAsset(asset)) {
            mbrAmount += globals.minBalance + globals.assetOptInMinBalance + globals.minTxnFee
        }

        const hyperSwapApp = AppID.fromUint64(AkitaAppIDsHyperSwap)

        if (!hyperSwapApp.address.isOptedInToAsset(asset)) {
            mbrAmount += globals.assetOptInMinBalance
        }

        sendMethodCall<typeof HyperSwap.prototype.escrowAsa, void>({
            sender: sender.address,
            applicationID: hyperSwapApp,
            methodArgs: [
                {
                    sender: sender.address,
                    amount: mbrAmount,
                    receiver: hyperSwapApp.address,
                    fee: 0,
                },
                {
                    sender: sender.address,
                    assetAmount: amount,
                    assetReceiver: receiver,
                    xferAsset: asset,
                    fee: 0,
                },
                id,
                receiver,
                asset,
                amount,
                proof,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    disburse(
        sender: AppID,
        rekeyBack: boolean,
        id: uint64,
        receiverAppID: AppID,
        receiver: Address,
        asset: AssetID,
        amount: uint64
    ) {
        // if we can and need to opt the receiver in ahead of time
        if (receiverAppID.id !== 0) {
            assert(receiverAppID.address === receiver, 'receiverAppID address mismatch')
            if (!receiverAppID.address.isOptedInToAsset(asset)) {
                const canCallArc58OptIn = this.canCallArc58OptIn(receiverAppID)
                if (canCallArc58OptIn) {
                    this.arc58OptIn(sender, receiverAppID, asset)
                }
            }
        }

        sendMethodCall<typeof HyperSwap.prototype.disburse, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsHyperSwap),
            methodArgs: [id, receiver, asset, amount],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    cancel(sender: AppID, rekeyBack: boolean, id: uint64, proof: bytes32[]) {
        sendMethodCall<typeof HyperSwap.prototype.cancel, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsHyperSwap),
            methodArgs: [id, proof],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }
}
