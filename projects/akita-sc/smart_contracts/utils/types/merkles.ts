import { arc4, bytes, Contract, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { SchemaList } from '../../meta-merkles/types'

export type Leaf = bytes<32>

export type Proof = bytes<32>[]

export class MetaMerklesInterface extends Contract {
  create(): void { }
  addRoot(payment: gtxn.PaymentTxn, name: string, root: bytes<32>, type: uint64 ): void {}
  deleteRoot(name: string): void {}
  updateRoot(name: string, newRoot: bytes<32>): void {}
  addData(payment: gtxn.PaymentTxn, name: string, key: string, value: string): void {}
  deleteData(name: string, key: string): void {}
  verify(address: Address, name: string, leaf: Leaf, proof: Proof, type: uint64): boolean { return false }
  read(address: Address, name: string, key: string): string {  return "" }
  verifiedRead(address: Address, name: string, leaf: Leaf, proof: Proof, type: uint64, key: string): string { return "" }
  verifiedMustRead(address: Address, name: string, leaf: Leaf, proof: Proof, type: uint64, key: string): string { return "" }
  addType(payment: gtxn.PaymentTxn, description: string, schemaList: SchemaList): void {}
  rootCosts(name: string): uint64 { return 0 }
  dataCosts(name: arc4.Str, key: arc4.Str, value: arc4.Str): uint64 { return 0 }
}