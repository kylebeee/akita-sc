import { Bytes, bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { SubGateInterface } from "../utils/types/gates"
import { abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4"

export class MockGate extends Contract implements SubGateInterface {

  cost(arg: bytes): uint64 {
    return 0
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    return 0
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    return false
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return Bytes('')
  }
}