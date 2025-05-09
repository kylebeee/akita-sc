import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type SubscriptionRegistryInfo = {
    merchant: Address
    id: uint64
}

export class arc4SubscriptionRegistryInfo extends arc4.Struct<{
    merchant: Address
    id: arc4.UintN64
}> {}

export type SubscriptionGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4SubscriptionGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}