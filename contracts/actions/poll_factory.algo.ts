import { Contract } from "@algorandfoundation/tealscript";
import { Poll, PollType } from "./poll.algo";

export class PollFactory extends Contract {

    // mints new Poll contracts
    mint(
        pmt: PayTxn,
        type: PollType,
        gateID: uint64,
        endTime: uint64,
        selectionMax: uint64,
        question: string,
        options: string[],
    ): AppID {

        assert(pmt.amount === (
                100_000 // requires 3 extra pages
                + (28_500 * Poll.schema.global.numUint)
                + (50_000 * Poll.schema.global.numByteSlice)
            )
        );
        assert(pmt.receiver === this.app.address);

        sendMethodCall<typeof Poll.prototype.createApplication>({
            methodArgs: [
                type,
                gateID,
                endTime,
                selectionMax,
                question,
                options,
            ],
            approvalProgram: Poll.approvalProgram(),
            clearStateProgram: Poll.clearProgram(),
            globalNumUint: Poll.schema.global.numUint,
            globalNumByteSlice: Poll.schema.global.numByteSlice,
            // extraProgramPages: 1,
            fee: 0,
        });

        // mint a new poll contract
        return this.itxn.createdApplicationID;
    }
}