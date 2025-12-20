import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockStakingPoolFactory extends Contract {

    ping(): uint64 {
        return 1006
    }
}

