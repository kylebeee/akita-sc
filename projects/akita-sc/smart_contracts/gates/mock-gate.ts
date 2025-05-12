import { bytes, Contract, uint64 } from "@algorandfoundation/algorand-typescript"

export class MockGate extends Contract {
    register(args: bytes): uint64 {
        return 0
    }

    check(args: bytes): boolean {
        return false
    }
}