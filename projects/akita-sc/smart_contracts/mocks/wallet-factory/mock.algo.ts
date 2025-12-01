import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockAbstractedAccountFactory extends Contract {

    ping(): uint64 {
        return 4242
    }
}

