import { Contract } from "@algorandfoundation/tealscript";

export interface PayoutInfo {
    amountToSeller: uint64;
    commissionAddress: Address;
    amountToCommission: uint64;
    segmentRootOwner: Address;
    amountToSegmentRoot: uint64;
}

export class NFD extends Contract {

    updateApplication(versionNum: string): void {}

    gas(): void {}

    mintAsa(nfdName: string, url: string): void {}

    deleteFields(fieldNames: bytes[]): void {}

    updateSegmentCount(childNfdName: string, childNfdAppID: uint64): void {}

    getFieldUpdateCost(fieldAndVals: bytes[]): uint64 { return 0; }

    updateFields(fieldAndVals: bytes[]): void {}

    readField(fieldName: bytes): bytes { return ''; }

    offerForSale(sellAmount: uint64, reservedFor: Address): void {}

    cancelSale(): void {}

    postOffer(offer: uint64, note: string): void {}

    mintPayout(oneYearPrice: uint64, segmentPlatformCostInAlgo: uint64): PayoutInfo {
        return {
            amountToSeller: 0,
            commissionAddress: Address.zeroAddress,
            amountToCommission: 0,
            segmentRootOwner: Address.zeroAddress,
            amountToSegmentRoot: 0,
        }
    }

    purchase(payment: PayTxn): void {}

    isAddressInField(fieldName: string, address: Address): boolean { return false; }

    getRenewPrice(): uint64 { return 0; }

    updateHash(hash: bytes): void {}

    contractLock(lock: boolean): void {}

    segmentLock(lock: boolean, usdPrice: uint64): void {}

    vaultOptInLock(lock: boolean): void {}

    vaultOptIn(assets: uint64[]): void {}

    vaultSend(amount: uint64, receiver: Address, note: string, asset: uint64, otherAssets: uint64[]): void {}

    renew(payment: PayTxn): void {}

    setPrimaryAddress(fieldName: string, address: Address): void {}
}

