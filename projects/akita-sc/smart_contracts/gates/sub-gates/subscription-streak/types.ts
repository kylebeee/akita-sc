import { Account, uint64 } from '@algorandfoundation/algorand-typescript'
import { Operator } from '../../types'

export type SubscriptionStreakGateRegistryInfo = {
  merchant: Account
  id: uint64
  op: Operator
  streak: uint64
}