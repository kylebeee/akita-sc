import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Operator } from '../../types'

export type SubscriptionStreakRegistryInfo = {
  merchant: Address
  id: uint64
  op: Operator
  streak: uint64
}

export type SubscriptionStreakGateCheckParams = {
  user: Address
  registryID: uint64
}