import { Contract } from "@algorandfoundation/tealscript";
import { PrizeBox } from "./prize_box.algo";

export class PrizeBoxFactory extends Contract {
    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });

    createApplication(version: string): void {
        this.childContractVersion.value = version;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.app.creator)
    }

    mint(payment: PayTxn, owner: Address): AppID {
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (
                100_000
                + (28_500 * PrizeBox.schema.global.numUint)
                + (50_000 * PrizeBox.schema.global.numByteSlice)
            ),
        });

        sendMethodCall<typeof PrizeBox.prototype.createApplication>({
            methodArgs: [owner],
            approvalProgram: PrizeBox.approvalProgram(),
            clearStateProgram: PrizeBox.clearProgram(),
            globalNumUint: PrizeBox.schema.global.numUint,
            globalNumByteSlice: PrizeBox.schema.global.numByteSlice,
            extraProgramPages: 0,
            fee: 0,
        });

        return this.itxn.createdApplicationID;
    }
}