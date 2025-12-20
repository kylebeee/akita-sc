import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockMarketplace extends Contract {

    ping(): uint64 {
        return 1002
    }
}

