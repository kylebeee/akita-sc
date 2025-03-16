import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";

export type Operator = uint64
export type LogicalOperator = uint64

export const AND: LogicalOperator = 0
export const OR: LogicalOperator = 1

export type GateFilter = {
    layer: uint64 // the comparison nesting level
    app: uint64 // the signature of the gate to use
    logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
};

export class arc4GateFilter extends arc4.Struct<{
    layer: arc4.UintN64
    app: arc4.UintN64
    logicalOperator: arc4.UintN64
}> {}

export type GateFilterEntry = {
    layer: uint64
    app: uint64
    registeryEntry: uint64
    logicalOperator: LogicalOperator
}

export class arc4GateFilterEntry extends arc4.Struct<{
    layer: arc4.UintN64
    app: arc4.UintN64
    registeryEntry: arc4.UintN64
    logicalOperator: arc4.UintN64
}> {}