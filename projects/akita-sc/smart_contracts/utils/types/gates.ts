import { bytes, Contract, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { GateFilter } from '../../gates/types'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type GateArgs = bytes[]

export class GateInterface extends Contract {
  create(version: string, akitaDAO: uint64): void { }
  update(newVersion: string): void { }
  updateAkitaDAO(app: uint64): void { }
  register(payment: gtxn.PaymentTxn, filters: GateFilter[], args: GateArgs): uint64 { return 0 }
  check(caller: Address, gateID: uint64, args: GateArgs): boolean { return false }
  mustCheck(caller: Address, gateID: uint64, args: GateArgs): void { }
  size(gateID: uint64): uint64 { return 0 }
}

export class SubGateInterface extends Contract {
  cost(args: bytes): uint64 { return 0 }
  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 { return 0 }
  check(args: bytes): boolean { return false }
}