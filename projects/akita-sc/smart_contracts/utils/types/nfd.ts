import { Account, Bytes, bytes, Contract, Global, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'

export interface PayoutInfo {
  amountToSeller: uint64
  commissionAddress: Account
  amountToCommission: uint64
  segmentRootOwner: Account
  amountToSegmentRoot: uint64
}

export class NFD extends Contract {
  updateApplication(versionNum: string): void { }

  gas(): void { }

  mintAsa(nfdName: string, url: string): void { }

  deleteFields(fieldNames: bytes[]): void { }

  updateSegmentCount(childNfdName: string, childNfdAppID: uint64): void { }

  getFieldUpdateCost(fieldAndVals: uint64[]): uint64 {
    return 0
  }

  updateFields(fieldAndVals: bytes[]): void { }

  readField(fieldName: bytes): bytes {
    return Bytes('')
  }

  offerForSale(sellAmount: uint64, reservedFor: Account): void { }

  cancelSale(): void { }

  postOffer(offer: uint64, note: string): void { }

  mintPayout(oneYearPrice: uint64, segmentPlatformCostInAlgo: uint64): PayoutInfo {
    return {
      amountToSeller: 0,
      commissionAddress: Global.zeroAddress,
      amountToCommission: 0,
      segmentRootOwner: Global.zeroAddress,
      amountToSegmentRoot: 0,
    }
  }

  purchase(payment: gtxn.PaymentTxn): void { }

  isAddressInField(fieldName: string, address: Account): boolean {
    return false
  }

  getRenewPrice(): uint64 {
    return 0
  }

  updateHash(hash: bytes): void { }

  contractLock(lock: boolean): void { }

  segmentLock(lock: boolean, usdPrice: uint64): void { }

  vaultOptInLock(lock: boolean): void { }

  vaultOptIn(assets: uint64[]): void { }

  vaultSend(amount: uint64, receiver: Account, note: string, asset: uint64, otherAssets: uint64[]): void { }

  renew(payment: gtxn.PaymentTxn): void { }

  setPrimaryAddress(fieldName: string, address: Account): void { }
}
