import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, StaticBytes } from '@algorandfoundation/algorand-typescript/arc4'

export type SubscriptionID = uint64

export class arc4ServicesKey extends arc4.Struct<{
    address: Address
    id: arc4.UintN64
}> {}

export type ServiceID = uint64

export type ServiceStatus = arc4.UintN8

export const ServiceStatusActive: ServiceStatus = new arc4.UintN8(0)
export const ServiceStatusPaused: ServiceStatus = new arc4.UintN8(1)
export const ServiceStatusShutdown: ServiceStatus = new arc4.UintN8(2)

export type Service = {
    status: ServiceStatus
    interval: uint64
    asset: uint64
    amount: uint64
    passes: uint64
    gate: uint64
    cid: StaticBytes<36>
}

export class arc4Service extends arc4.Struct<{
    status: ServiceStatus
    interval: arc4.UintN64
    asset: arc4.UintN64
    amount: arc4.UintN64
    passes: arc4.UintN64
    gate: arc4.UintN64
    cid: arc4.StaticBytes<36>
}> {}

export class arc4BlockListKey extends arc4.Struct<{
    address: arc4.StaticBytes<16>
    blocked: arc4.StaticBytes<16>
}> {}

// export type SubscriptionKey = {
//     address: Address;
//     index: uint64;
// };

export class arc4SubscriptionKey extends arc4.Struct<{
    address: Address
    id: arc4.UintN64
}> {}

export type SubscriptionInfo = {
    recipient: Address
    serviceID: ServiceID
    startDate: uint64
    amount: uint64
    interval: uint64
    asset: uint64
    gate: uint64
    lastPayment: uint64
    streak: uint64
    escrowed: uint64
}

export class arc4SubscriptionInfo extends arc4.Struct<{
    recipient: Address
    serviceID: arc4.UintN64
    startDate: arc4.UintN64
    amount: arc4.UintN64
    interval: arc4.UintN64
    asset: arc4.UintN64
    gate: arc4.UintN64
    lastPayment: arc4.UintN64
    streak: arc4.UintN64
    escrowed: arc4.UintN64
}> {}

export class arc4PassesKey extends arc4.Struct<{
    address: Address
    id: arc4.UintN64
}> {}

export type SubscriptionInfoWithPasses = {
    recipient: Address
    serviceID: uint64
    startDate: uint64
    amount: uint64
    interval: uint64
    asset: uint64
    gate: uint64
    lastPayment: uint64
    streak: uint64
    escrowed: uint64
    passes: arc4.DynamicArray<Address>
}

export class arc4SubscriptionInfoWithPasses extends arc4.Struct<{
    recipient: Address
    serviceID: arc4.UintN64
    startDate: arc4.UintN64
    amount: arc4.UintN64
    interval: arc4.UintN64
    asset: arc4.UintN64
    gate: arc4.UintN64
    lastPayment: arc4.UintN64
    streak: arc4.UintN64
    escrowed: arc4.UintN64
    passes: arc4.DynamicArray<Address>
}> {}

export type Amounts = {
    akitaFee: uint64
    triggerFee: uint64
    leftOver: uint64
}

export type SubscriptionsMBRData = {
    subscriptions: uint64
    subscriptionslist: uint64
    services: uint64
    serviceslist: uint64
    blocks: uint64
    passes: uint64
}

export type Addresses = arc4.DynamicArray<Address>