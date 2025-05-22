import { arc4, bytes, Contract, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4GateFilter } from '../../gates/types'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type GateArgs = bytes[]

export class GateInterface extends Contract {
    create(version: string, akitaDAO: uint64): void {}
    update(newVersion: string): void {}
    updateAkitaDAO(app: uint64): void {}
    register(payment: gtxn.PaymentTxn, filters: arc4.DynamicArray<arc4GateFilter>, args: GateArgs): arc4.UintN64 { return new arc4.UintN64(0) }
    check(caller: Address, gateID: uint64, args: GateArgs): boolean { return false }
    size(gateID: uint64): uint64 { return 0 }
}