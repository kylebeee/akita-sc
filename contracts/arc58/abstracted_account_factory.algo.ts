import { GlobalStateKeyAkitaDAO, GlobalStateKeyChildContractVersion, GlobalStateKeyRevocationApp } from "../constants";
import { AbstractedAccount } from "./abstracted_account.algo";
import { Application, arc4, assert, Contract, Global, GlobalState, gtxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from "./errs";
import { ERR_NOT_AKITA_DAO } from "../errors";
import { AkitaBaseContract } from "../../utils/base_contracts/base.algo";

export class AbstractedAccountFactory extends AkitaBaseContract {
    /** The App ID of the Akita DAO contract */
    akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
    /** the version of the child contract */
    childContractVersion = GlobalState<string>({ key: GlobalStateKeyChildContractVersion })
    /** the default app thats allowed to revoke plugins */
    revocationApp = GlobalState<Application>({ key: GlobalStateKeyRevocationApp })

    createApplication(version: string, revocationApp: uint64): void {
        this.childContractVersion.value = version
        this.revocationApp.value = Application(revocationApp)
    }

    updateRevocationApp(app: uint64): void {
        assert(Txn.sender === this.akitaDAO.value.address, ERR_NOT_AKITA_DAO)
        this.revocationApp.value = Application(app)
    }

    mint(payment: gtxn.PaymentTxn, admin: arc4.Address, nickname: string): uint64 {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        const childMBR = 300_000 + (28_500 * AbstractedAccount.schema.global.numUint) + (50_000 * AbstractedAccount.schema.global.numByteSlice)
        assert(payment.amount === childMBR, ERR_INVALID_PAYMENT_AMOUNT)

        const compiled = compileArc4(AbstractedAccount)

        return compiled.call.create({
            args: [
                this.childContractVersion.value,
                admin,
                this.revocationApp.value,
                nickname,
            ],
            extraProgramPages: 3,
            fee: 0,
        }).itxn.createdApp

        // sendMethodCall<typeof AbstractedAccount.prototype.createApplication>({
        //     methodArgs: [
        //         this.childContractVersion.value,
        //         admin,
        //         this.revocationAppID.value,
        //         nickname,
        //     ],
        //     approvalProgram: AbstractedAccount.approvalProgram(),
        //     clearStateProgram: AbstractedAccount.clearProgram(),
        //     globalNumUint: AbstractedAccount.schema.global.numUint,
        //     globalNumByteSlice: AbstractedAccount.schema.global.numByteSlice,
        //     extraProgramPages: 3,
        //     fee: 0,
        // });

        // return this.itxn.createdApplicationID;
    }
}