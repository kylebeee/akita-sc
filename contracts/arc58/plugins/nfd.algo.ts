import { Contract } from '@algorandfoundation/tealscript'
import { NFD } from '../../../utils/types/nfd'

const NFD_SALE_AMOUNT_KEY = 'i.sellamt'
// TODO: find the actual renewal amount key
const NFD_RENEWAL_AMOUNT_KEY = 'i.renewamt'

export class NFDPlugin extends Contract {
    appID = GlobalStateKey<AppID>({ key: 'appID' })

    createApplication(appID: AppID): void {
        this.appID.value = appID
    }

    deleteApplication(): void {
        assert(this.txn.sender === this.app.creator, 'Only the creator can delete the application')
    }

    gas(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof NFD.prototype.gas, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    deleteFields(sender: AppID, rekeyBack: boolean, fieldNames: bytes[]): void {
        sendMethodCall<typeof NFD.prototype.deleteFields, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [fieldNames],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    updateFields(sender: AppID, rekeyBack: boolean, fieldAndVals: bytes[]): void {
        sendMethodCall<typeof NFD.prototype.updateFields, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [fieldAndVals],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    offerForSale(sender: AppID, rekeyBack: boolean, sellAmount: uint64, reservedFor: Address): void {
        sendMethodCall<typeof NFD.prototype.offerForSale, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [sellAmount, reservedFor],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    cancelSale(sender: AppID, rekeyBack: boolean): void {
        sendMethodCall<typeof NFD.prototype.cancelSale, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    postOffer(sender: AppID, rekeyBack: boolean, offer: uint64, note: string): void {
        sendMethodCall<typeof NFD.prototype.postOffer, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [offer, note],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    purchase(sender: AppID, rekeyBack: boolean): void {
        assert(this.appID.value.globalStateExists(NFD_SALE_AMOUNT_KEY), 'No sale amount set')
        const saleAmount = this.appID.value.globalState(NFD_SALE_AMOUNT_KEY) as uint64

        sendMethodCall<typeof NFD.prototype.purchase, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: this.appID.value.address,
                    amount: saleAmount,
                    fee: 0,
                },
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    updateHash(sender: AppID, rekeyBack: boolean, hash: bytes): void {
        sendMethodCall<typeof NFD.prototype.updateHash, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [hash],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    contractLock(sender: AppID, rekeyBack: boolean, lock: boolean): void {
        sendMethodCall<typeof NFD.prototype.contractLock, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [lock],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    segmentLock(sender: AppID, rekeyBack: boolean, lock: boolean, usdPrice: uint64): void {
        sendMethodCall<typeof NFD.prototype.segmentLock, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [lock, usdPrice],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    vaultOptInLock(sender: AppID, rekeyBack: boolean, lock: boolean): void {
        sendMethodCall<typeof NFD.prototype.vaultOptInLock, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [lock],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    vaultOptIn(sender: AppID, rekeyBack: boolean, assets: uint64[]): void {
        sendMethodCall<typeof NFD.prototype.vaultOptIn, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [assets],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    vaultSend(
        sender: AppID,
        rekeyBack: boolean,
        amount: uint64,
        receiver: Address,
        note: string,
        asset: uint64,
        otherAssets: uint64[]
    ): void {
        sendMethodCall<typeof NFD.prototype.vaultSend, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [amount, receiver, note, asset, otherAssets],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    renew(sender: AppID, rekeyBack: boolean): void {
        assert(this.appID.value.globalStateExists(NFD_RENEWAL_AMOUNT_KEY), 'No renewal amount set')
        const renewAmount = this.appID.value.globalState(NFD_RENEWAL_AMOUNT_KEY) as uint64

        sendMethodCall<typeof NFD.prototype.renew, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [
                {
                    sender: sender.address,
                    receiver: this.appID.value.address,
                    amount: renewAmount,
                    fee: 0,
                },
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    setPrimaryAddress(sender: AppID, rekeyBack: boolean, fieldName: string, address: Address): void {
        sendMethodCall<typeof NFD.prototype.setPrimaryAddress, void>({
            sender: sender.address,
            applicationID: this.appID.value,
            methodArgs: [fieldName, address],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }
}
