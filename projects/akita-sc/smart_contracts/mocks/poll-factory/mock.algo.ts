import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockPollFactory extends Contract {

    ping(): uint64 {
        return 1004
    }
}

