import { Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

export class SpendingAccountFactoryInterface extends Contract {

  mint(payment: gtxn.PaymentTxn, plugin: uint64): uint64 { return 0 }

  delete(id: uint64): void {}

  exists(address: Address): boolean { return false }

  get(address: Address): uint64 { return 0 }

  mustGet(address: Address): uint64 { return 0 }

  getList(addresses: Address[]): uint64[] { return [] }

  mustGetList(addresses: Address[]): uint64[] { return [] }
}

export class SpendingAccountInterface extends Contract {
  create(walletID: uint64, plugin: uint64): void {}

  deleteApplication(): void {}

  rekey(address: Address): void {}

  optin(payment: gtxn.PaymentTxn, asset: uint64): void {}
}