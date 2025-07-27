import { Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AllocationReclaimDetails, ClaimDetails, UserAllocation } from "../../rewards/types";


export class RewardsInterface extends Contract {
    create(version: string, akitaDAO: uint64): void { }
    update(newVersion: string): void { }
    updateAkitaDAO(app: uint64): void { }
    createDisbursement(
        mbrPayment: gtxn.PaymentTxn,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): uint64 { return 0 }
    editDisbursement(
        id: uint64,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): void { }
    createUserAllocations(
        payment: gtxn.PaymentTxn,
        id: uint64,
        allocations: UserAllocation[]
    ): void { }
    createAsaUserAllocations(
        mbrPayment: gtxn.PaymentTxn,
        assetXfer: gtxn.AssetTransferTxn,
        id: uint64,
        allocations: UserAllocation[]
    ): void {}
    finalizeDisbursement(id: uint64): void {}
    claimRewards(rewards: ClaimDetails[]): void {}
    reclaimRewards(id: uint64, reclaims: AllocationReclaimDetails[]): void {}
}