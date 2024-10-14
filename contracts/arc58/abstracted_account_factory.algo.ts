import { Contract } from "@algorandfoundation/tealscript";
import { AbstractedAccount } from "./abstracted_account.algo";

export class AbstractedAccountFactory extends Contract {

    abstractedAccountVersion = GlobalStateKey<string>();
    revocationAppID = GlobalStateKey<AppID>();

    createApplication(version: string, revocationAppID: AppID): void {
        this.abstractedAccountVersion.value = version;
        this.revocationAppID.value = revocationAppID;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.app.creator)
    }

    mint(pmt: PayTxn, controlledAddress: Address, admin: Address, nickname: string): AppID {
        // 100_000 * (1+ExtraProgramPages) + (28_500) * schema.NumUint + (50_000) * schema.NumByteSlice
        assert(pmt.amount === (
                200_000 // requires 1 extra page
                + (28_500 * AbstractedAccount.schema.global.numUint)
                + (50_000 * AbstractedAccount.schema.global.numByteSlice)
            )
        );
        assert(pmt.receiver === this.app.address);

        sendMethodCall<typeof AbstractedAccount.prototype.createApplication>({
            methodArgs: [
                this.abstractedAccountVersion.value,
                controlledAddress,
                admin,
                this.revocationAppID.value,
                nickname,
            ],
            approvalProgram: AbstractedAccount.approvalProgram(),
            clearStateProgram: AbstractedAccount.clearProgram(),
            globalNumUint: AbstractedAccount.schema.global.numUint,
            globalNumByteSlice: AbstractedAccount.schema.global.numByteSlice,
            extraProgramPages: 1,
            fee: 0,
        });

        return this.itxn.createdApplicationID;
    }
}