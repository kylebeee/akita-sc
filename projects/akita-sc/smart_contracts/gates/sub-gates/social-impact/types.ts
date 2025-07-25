import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Operator } from '../../types'

export type ImpactRegistryInfo = {
  op: Operator
  value: uint64
}

export type ImpactGateCheckParams = {
  user: Address
  registryID: uint64
}