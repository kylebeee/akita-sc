import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Operator } from '../../types'

export type SubscriptionStreakRegistryInfo = {
    merchant: Address
    id: uint64
    op: Operator
    streak: uint64
}

export class arc4SubscriptionStreakRegistryInfo extends arc4.Struct<{
    merchant: Address
    id: arc4.UintN64
    op: arc4.UintN64
    streak: arc4.UintN64
}> {}

export type SubscriptionStreakGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4SubscriptionStreakGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}
