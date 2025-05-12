import { bytes, Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";


export class DualStake extends Contract {
    mint(): void {}
    redeem(): void {}
    get_rate(): uint64 { return 0 }
}
