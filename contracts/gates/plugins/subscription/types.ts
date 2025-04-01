import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Operator } from '../../types'

// export const RegistryInfoLength = len<Address>() + len<uint64>();
export type SubscriptionRegistryInfo = {
    merchant: Address
    id: uint64
}

export class arc4SubscriptionRegistryInfo extends arc4.Struct<{
    merchant: Address
    id: arc4.UintN64
}> {}

// export const SubscriptionGateCheckParamsLength = len<Address>() + len<uint64>();
export type SubscriptionGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4SubscriptionGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}

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
