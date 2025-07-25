import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export type Operator = Uint8
export type LogicalOperator = Uint8

export const AND: LogicalOperator = new Uint8(10)
export const OR: LogicalOperator = new Uint8(20)

export type GateFilter = {
  layer: uint64 // the comparison nesting level
  app: uint64 // the signature of the gate to use
  logicalOperator: LogicalOperator // the logical operator to apply between this gate filter and the next
}

export type GateFilterEntry = {
  layer: uint64
  app: uint64
  registryEntry: uint64
  logicalOperator: LogicalOperator
}

export type GateMBRData = {
  appRegistry: uint64
  gateRegistry: uint64
}