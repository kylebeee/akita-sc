import { Account, Bytes, bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { Address, DynamicArray, DynamicBytes } from "@algorandfoundation/algorand-typescript/arc4";

export class EscrowFactoryInterface extends Contract {

  new(payment: gtxn.PaymentTxn): uint64 { return 0 }

  cost(): uint64 { return 0 }

  delete(id: uint64): void {}

  exists(address: Address): boolean { return false }

  get(address: Address): bytes { return Bytes('') }

  mustGet(address: Address): bytes { return Bytes('') }

  getList(addresses: DynamicArray<Address>): DynamicArray<DynamicBytes> { return new DynamicArray<DynamicBytes>() }

  mustGetList(addresses: DynamicArray<Address>): DynamicArray<DynamicBytes> { return new DynamicArray<DynamicBytes>() }
}

export class EscrowInterface extends Contract {

  rekey(rekeyTo: Account): void {}

  delete(): void {}
}