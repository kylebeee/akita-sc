import { Contract } from "@algorandfoundation/tealscript";
import { Poll, PollType } from "./poll.algo";

export class PollFactory extends Contract {

    // mints new Poll contracts
    mint(
        payment: PayTxn,
        type: PollType,
        gateID: uint64,
        endTime: uint64,
        selectionMax: uint64,
        question: string,
        options: string[],
    ): AppID {

        verifyPayTxn(payment, {
            receiver: this.app.address,
            amount: (
                100_000 // requires 3 extra pages
                + (28_500 * Poll.schema.global.numUint)
                + (50_000 * Poll.schema.global.numByteSlice)
            ),
        });

        sendMethodCall<typeof Poll.prototype.createApplication>({
            methodArgs: [
                type,
                endTime,
                selectionMax,
                question,
                options,
                gateID
            ],
            approvalProgram: Poll.approvalProgram(),
            clearStateProgram: Poll.clearProgram(),
            globalNumUint: Poll.schema.global.numUint,
            globalNumByteSlice: Poll.schema.global.numByteSlice,
            extraProgramPages: 0,
            fee: 0,
        });

        // mint a new poll contract
        return this.itxn.createdApplicationID;
    }
}