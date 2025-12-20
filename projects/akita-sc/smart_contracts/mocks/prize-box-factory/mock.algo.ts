import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockPrizeBoxFactory extends Contract {

    ping(): uint64 {
        return 1005
    }
}

