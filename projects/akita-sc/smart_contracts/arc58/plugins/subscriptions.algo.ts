import { Contract } from '@algorandfoundation/tealscript'
import { blockMBR, Subscriptions, subscriptionsListMBR, subscriptionsMBR } from '../../subscriptions/contract.algo'
import { AkitaAppIDsSubscriptions } from '../../../utils/constants'

export class SubscriptionsPlugin extends Contract {
    /** the app id for the Akita DAO */
    daoAppID = GlobalStateKey<AppID>({ key: 'dao_app_id' })

    createApplication(daoAppID: AppID): void {
        this.daoAppID.value = daoAppID
    }

    newService(
        sender: AppID,
        rekeyBack: boolean,
        interval: uint64,
        asset: AssetID,
        amount: uint64,
        passes: uint64,
        gate: uint64,
        cid: bytes<59>
    ): uint64 {
        return sendMethodCall<typeof Subscriptions.prototype.newService, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: AppID.fromUint64(AkitaAppIDsSubscriptions).address,
                    amount: 5_000_000,
                },
                interval,
                asset,
                amount,
                passes,
                gate,
                cid,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    pauseService(sender: AppID, rekeyBack: boolean, index: uint64): void {
        sendMethodCall<typeof Subscriptions.prototype.pauseService, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [index],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    activateService(sender: AppID, rekeyBack: boolean, index: uint64): void {
        sendMethodCall<typeof Subscriptions.prototype.activateService, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [index],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    shutdownService(sender: AppID, rekeyBack: boolean, index: uint64): void {
        sendMethodCall<typeof Subscriptions.prototype.shutdownService, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [index],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    block(sender: AppID, rekeyBack: boolean, address: Address): void {
        sendMethodCall<typeof Subscriptions.prototype.block, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: AppID.fromUint64(AkitaAppIDsSubscriptions).address,
                    amount: blockMBR,
                },
                address,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    unblock(sender: AppID, rekeyBack: boolean, address: Address): void {
        sendMethodCall<typeof Subscriptions.prototype.unblock, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [address],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    subscribe(
        sender: AppID,
        rekeyBack: boolean,
        recipient: Address,
        amount: uint64,
        interval: uint64,
        index: uint64,
        args: bytes[]
    ): void {
        let mbrAmount = subscriptionsMBR

        const firstSubscription = sendMethodCall<typeof Subscriptions.prototype.isFirstSubscription, boolean>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [sender.address],
            fee: 0,
        })

        if (firstSubscription) {
            mbrAmount += subscriptionsListMBR
        }

        sendMethodCall<typeof Subscriptions.prototype.subscribe, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: recipient,
                    amount: amount + mbrAmount,
                },
                recipient,
                amount,
                interval,
                index,
                args,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    optin(sender: AppID, rekeyBack: boolean, asset: AssetID): void {
        sendMethodCall<typeof Subscriptions.prototype.optin, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: AppID.fromUint64(AkitaAppIDsSubscriptions).address,
                    amount: globals.assetOptInMinBalance,
                    fee: 0,
                },
                asset,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    subscribeAsa(
        sender: AppID,
        rekeyBack: boolean,
        asset: AssetID,
        recipient: Address,
        amount: uint64,
        interval: uint64,
        index: uint64,
        args: bytes[]
    ): void {
        let mbrAmount = subscriptionsMBR

        const firstSubscription = sendMethodCall<typeof Subscriptions.prototype.isFirstSubscription, boolean>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [sender.address],
            fee: 0,
        })

        if (firstSubscription) {
            mbrAmount += subscriptionsListMBR
        }

        if (!this.daoAppID.value.address.isOptedInToAsset(asset)) {
            mbrAmount += globals.assetOptInMinBalance
        }

        sendMethodCall<typeof Subscriptions.prototype.subscribeAsa, void>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: recipient,
                    amount: mbrAmount,
                },
                {
                    sender: sender.address,
                    assetReceiver: AppID.fromUint64(AkitaAppIDsSubscriptions).address,
                    xferAsset: asset,
                    assetAmount: amount,
                },
                recipient,
                amount,
                interval,
                index,
                args,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    triggerPayment(sender: AppID, rekeyBack: boolean, address: Address, index: uint64, args: bytes[]): void {
        sendMethodCall<typeof Subscriptions.prototype.triggerPayment, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [address, index, args],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    streakCheck(sender: AppID, rekeyBack: boolean, address: Address, index: uint64): void {
        sendMethodCall<typeof Subscriptions.prototype.streakCheck, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [address, index],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    setPasses(sender: AppID, rekeyBack: boolean, index: uint64, addresses: Address[]): void {
        sendMethodCall<typeof Subscriptions.prototype.setPasses, uint64>({
            sender: sender.address,
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [index, addresses],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }
}
