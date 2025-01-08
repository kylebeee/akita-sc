import { Contract } from "@algorandfoundation/tealscript";
import { AbstractedAccount } from "./abstracted_account.algo";

export class AbstractedAccountFactory extends Contract {

    /** the version of the child contract */
    childContractVersion = GlobalStateKey<string>({ key: 'child_contract_version' });
    /** the default app thats allowed to revoke plugins */
    revocationAppID = GlobalStateKey<AppID>({ key: 'revocation_app_id' });

    createApplication(version: string, revocationAppID: AppID): void {
        this.childContractVersion.value = version;
        this.revocationAppID.value = revocationAppID;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.app.creator)
    }

    mint(payment: PayTxn, admin: Address, nickname: string): AppID {
        
        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (
                300_000 // requires 3 extra pages
                + (28_500 * AbstractedAccount.schema.global.numUint)
                + (50_000 * AbstractedAccount.schema.global.numByteSlice)
            ),
        });

        sendMethodCall<typeof AbstractedAccount.prototype.createApplication>({
            methodArgs: [
                this.childContractVersion.value,
                admin,
                this.revocationAppID.value,
                nickname,
            ],
            approvalProgram: AbstractedAccount.approvalProgram(),
            clearStateProgram: AbstractedAccount.clearProgram(),
            globalNumUint: AbstractedAccount.schema.global.numUint,
            globalNumByteSlice: AbstractedAccount.schema.global.numByteSlice,
            extraProgramPages: 3,
            fee: 0,
        });

        return this.itxn.createdApplicationID;
    }
}