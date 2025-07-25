import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";

export class DualStake extends Contract {
    mint(): void {}
    redeem(): void {}
    get_rate(): uint64 { return 0 }
}
