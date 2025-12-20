import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockAuctionFactory extends Contract {

    ping(): uint64 {
        return 1001
    }
}

