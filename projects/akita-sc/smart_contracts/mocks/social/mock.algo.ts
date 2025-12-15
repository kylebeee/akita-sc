import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockAkitaSocial extends Contract {

    ping(): uint64 {
        return 1008
    }
}
