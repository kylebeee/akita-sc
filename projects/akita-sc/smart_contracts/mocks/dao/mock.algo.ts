import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class MockAkitaDAO extends Contract {

    ping(): uint64 {
        return 1337
    }
}