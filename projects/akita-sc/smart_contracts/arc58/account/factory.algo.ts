import {
    assert,
    Global,
    GlobalState,
    gtxn,
    Txn,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { GlobalStateKeyRevocationApp } from '../../constants'
import { AbstractedAccount } from './contract.algo'
import { ERR_NOT_AKITA_DAO } from '../../errors'
import { Address, compileArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../../utils/errors'
import { FactoryContract } from '../../utils/base-contracts/factory'

export class AbstractedAccountFactory extends FactoryContract {
    /** the default app thats allowed to revoke plugins */
    revocationApp = GlobalState<uint64>({ key: GlobalStateKeyRevocationApp })

    createApplication(version: string, revocationApp: uint64): void {
        this.childContractVersion.value = version
        this.revocationApp.value = revocationApp
    }

    updateRevocationApp(app: uint64): void {
        assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
        this.revocationApp.value = app
    }

    mint(payment: gtxn.PaymentTxn, controlledAccount: Address, admin: Address, nickname: string): uint64 {
        const abstractedAccount = compileArc4(AbstractedAccount)
        
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        
        const childMBR: uint64 =
            300_000 +
            (28_500 * abstractedAccount.globalUints) +
            (50_000 * abstractedAccount.globalBytes)

        assert(payment.amount === childMBR, ERR_INVALID_PAYMENT_AMOUNT)

        return abstractedAccount.call.createApplication({
            args: [
                this.childContractVersion.value,
                controlledAccount,
                admin,
                this.revocationApp.value,
                nickname
            ],
            extraProgramPages: 3,
            fee: 0,
        }).itxn.createdApp.id
    }
}
