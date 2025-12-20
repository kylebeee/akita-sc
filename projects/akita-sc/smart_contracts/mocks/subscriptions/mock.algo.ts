import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockSubscriptions extends Contract {

    ping(): uint64 {
        return 1007
    }
}

