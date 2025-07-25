import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type SubscriptionRegistryInfo = {
    merchant: Address
    id: uint64
}

export type SubscriptionGateCheckParams = {
    user: Address
    registryID: uint64
}