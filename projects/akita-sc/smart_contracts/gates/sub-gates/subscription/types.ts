import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type SubscriptionGateRegistryInfo = {
  merchant: Address
  id: uint64
}