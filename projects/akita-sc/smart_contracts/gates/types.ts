import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export type Operator = UintN8
export type LogicalOperator = UintN8

export const AND: LogicalOperator = new UintN8(0)
export const OR: LogicalOperator = new UintN8(1)

export type GateFilter = {
    layer: uint64 // the comparison nesting level
    app: uint64 // the signature of the gate to use
    logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
}

export class arc4GateFilter extends arc4.Struct<{
    layer: arc4.UintN64
    app: arc4.UintN64
    logicalOperator: arc4.UintN8
}> {}

export type GateFilterEntry = {
    layer: uint64
    app: uint64
    registryEntry: uint64
    logicalOperator: LogicalOperator
}

export class arc4GateFilterEntry extends arc4.Struct<{
    layer: arc4.UintN64
    app: arc4.UintN64
    registryEntry: arc4.UintN64
    logicalOperator: arc4.UintN8
}> {}

export type GateMBRData = {
    appRegistry: uint64
    gateRegistry: uint64
}