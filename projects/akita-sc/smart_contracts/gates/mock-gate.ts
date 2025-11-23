import { Account, Bytes, bytes, Contract, gtxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abimethod } from "@algorandfoundation/algorand-typescript/arc4"

export class MockGate extends Contract {

  cost(arg: bytes): uint64 {
    return 0
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    return 0
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    return false
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return Bytes('')
  }
}