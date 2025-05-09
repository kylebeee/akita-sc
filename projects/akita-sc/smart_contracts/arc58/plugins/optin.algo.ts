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
import { Plugin } from '../../utils/base-contracts/plugin'


export class OptInPlugin extends Plugin {

    @abimethod({ onCreate: 'require' })
    createApplication(): void {}

    optInToAsset(walletID: uint64, rekeyBack: boolean, asset: uint64, mbrPayment: gtxn.PaymentTxn): void {
        const wallet = Application(walletID)
        const sender = this.getSpendingAccount(wallet)

        assert(!sender.isOptedIn(Asset(asset)), 'asset already opted in')
        assert(mbrPayment.amount >= Global.assetOptInMinBalance, 'asset mismatch')

        itxn.assetTransfer({
            sender,
            assetReceiver: sender,
            assetAmount: 0,
            xferAsset: asset,
            rekeyTo: this.rekeyAddress(rekeyBack, wallet),
            fee: 0,
        }).submit()
    }
}
