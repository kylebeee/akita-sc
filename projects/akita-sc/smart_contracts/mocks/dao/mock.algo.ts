import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { abimethod } from "@algorandfoundation/algorand-typescript/arc4";

export class MockAkitaDAO extends Contract {

    @abimethod({ allowActions: ['UpdateApplication'] })
    update(newVersion: string): void { }

    ping(): uint64 {
        return 1337
    }
}