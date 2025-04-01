import {
    Application,
    Asset,
    Global,
    assert,
    itxn,
    abimethod,
    uint64,
    gtxn,
} from '@algorandfoundation/algorand-typescript'
import { Plugin } from '../../../utils/base_contracts/plugin.algo'

export class OptInPlugin extends Plugin {
    // @ts-ignore
    @abimethod({ onCreate: 'require' })
    createApplication(): void {}

    optInToAsset(sender: uint64, rekeyBack: boolean, asset: uint64, mbrPayment: gtxn.PaymentTxn): void {
        const controlledAccount = this.getControlledAccount(Application(sender))

        assert(!controlledAccount.isOptedIn(Asset(asset)), 'asset already opted in')
        assert(mbrPayment.amount >= Global.assetOptInMinBalance, 'asset mismatch')

        itxn.assetTransfer({
            sender: controlledAccount,
            assetReceiver: controlledAccount,
            assetAmount: 0,
            xferAsset: asset,
            rekeyTo: rekeyBack ? Application(sender).address : Global.zeroAddress,
            fee: 0,
        }).submit()
    }
}
