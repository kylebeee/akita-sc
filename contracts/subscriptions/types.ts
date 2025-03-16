import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"

export type SubscriptionID = uint64;

export type arc4SubscriptionID = arc4.UintN64

export class arc4ServicesKey extends arc4.Struct<{
    address: arc4.Address
    id: arc4SubscriptionID
}> { }

export type ServiceID = uint64;

export type arc4ServiceID = arc4.UintN64

export type arc4ServiceStatus = arc4.UintN64

export const ServiceStatusActive: arc4ServiceStatus = new arc4.UintN64(0)
export const ServiceStatusPaused: arc4ServiceStatus = new arc4.UintN64(1)
export const ServiceStatusShutdown: arc4ServiceStatus = new arc4.UintN64(2)

export class arc4ServicesValue extends arc4.Struct<{
    status: arc4ServiceStatus
    interval: arc4.UintN64
    asset: arc4.UintN64
    amount: arc4.UintN64
    passes: arc4.UintN64
    gate: arc4.UintN64
    cid: arc4.StaticBytes<36>
}> { }

export class arc4BlockListKey extends arc4.Struct<{
    address: arc4.StaticBytes<31>
    blocked: arc4.Address
}> { }

// export type SubscriptionKey = {
//     address: Address;
//     index: uint64;
// };

export class arc4SubscriptionKey extends arc4.Struct<{
    address: arc4.Address
    id: arc4SubscriptionID
}> { }

export class arc4SubscriptionInfo extends arc4.Struct<{
    recipient: arc4.Address
    serviceID: arc4ServiceID
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
    address: arc4.Address
    id: arc4SubscriptionID
}> { }

export type SubscriptionInfoWithPasses = {
    recipient: arc4.Address
    serviceID: uint64
    startDate: uint64
    amount: uint64
    interval: uint64
    asset: uint64
    gate: uint64
    lastPayment: uint64
    streak: uint64
    escrowed: uint64
    passes: arc4.DynamicArray<arc4.Address>
}

export class arc4SubscriptionInfoWithPasses extends arc4.Struct<{
    recipient: arc4.Address
    serviceID: arc4SubscriptionID
    startDate: arc4.UintN64
    amount: arc4.UintN64
    interval: arc4.UintN64
    asset: arc4.UintN64
    gate: arc4.UintN64
    lastPayment: arc4.UintN64
    streak: arc4.UintN64
    escrowed: arc4.UintN64
    passes: arc4.DynamicArray<arc4.Address>
}> { }

export type Amounts = {
    akitaFee: uint64;
    triggerFee: uint64;
    leftOver: uint64;
}