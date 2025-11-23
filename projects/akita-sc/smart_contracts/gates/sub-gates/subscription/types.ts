import { Account, uint64 } from '@algorandfoundation/algorand-typescript'

export type SubscriptionGateRegistryInfo = {
  merchant: Account
  id: uint64
}