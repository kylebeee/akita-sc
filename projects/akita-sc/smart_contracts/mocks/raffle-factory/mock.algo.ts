import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockRaffleFactory extends Contract {

    ping(): uint64 {
        return 1003
    }
}
