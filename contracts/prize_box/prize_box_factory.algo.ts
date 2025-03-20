import { abimethod, arc4, assert, compile, Global, gtxn, itxn, OnCompleteAction, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { PrizeBox } from "./prize_box.algo";
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from "../../utils/errors";
import { Address, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { FactoryContract } from "../../utils/base_contracts/factory.algo";

export class PrizeBoxFactory extends FactoryContract {

    // @ts-ignore
    @abimethod({ onCreate: 'require' })
    createApplication(version: string): void {
        this.childContractVersion.value = version
    }

    // @ts-ignore
    @abimethod({ allowActions: 'UpdateApplication' })
    updateApplication(): void {
        assert(Txn.sender === Global.creatorAddress, 'Only the creator can update the application')
    }

    mint(payment: gtxn.PaymentTxn, owner: Address): uint64 {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)

        const prizeBox = compile(PrizeBox)

        assert(payment.amount === (100_000 + (28_500 * prizeBox.globalBytes) + (50_000 * prizeBox.globalUints)), ERR_INVALID_PAYMENT_AMOUNT)
        
        return itxn
            .applicationCall({
                onCompletion:  OnCompleteAction.NoOp,
                appArgs: [
                    methodSelector(PrizeBox.prototype.createApplication),
                    owner
                ],
                approvalProgram: prizeBox.approvalProgram,
                clearStateProgram: prizeBox.clearStateProgram,
                globalNumUint: prizeBox.globalUints,
                globalNumBytes: prizeBox.globalBytes,
                fee: 0,
            })
            .submit()
            .createdApp
            .id
    }
}