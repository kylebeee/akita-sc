import { Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { StakingType } from "../../staking/types";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";
import { RootKey } from "../../meta-merkles/types";

export class PoolFactoryInterface extends Contract {
    create(version: string, childVersion: string, akitaDAO: uint64): void { }
    setEscrow(escrow: uint64): void { }
    newPool(
        payment: gtxn.PaymentTxn,
        title: string,
        type: StakingType,
        marketplace: Address,
        stakeKey: RootKey,
        minimumStakeAmount: uint64,
        gateID: uint64,
        maxEntries: uint64,
    ): uint64 { return 0; }
    deletePool(poolID: uint64): void { }
}