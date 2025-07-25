import { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { CID } from '../utils/types/base'

export type SubscriptionID = uint64

export type ServicesKey = {
  address: Address
  id: uint64
}

export type ServiceID = uint64

export type ServiceStatus = Uint8

export const ServiceStatusActive: ServiceStatus = new Uint8(10)
export const ServiceStatusPaused: ServiceStatus = new Uint8(20)
export const ServiceStatusShutdown: ServiceStatus = new Uint8(30)

export type Service = {
  status: ServiceStatus
  interval: uint64
  asset: uint64
  amount: uint64
  passes: uint64
  gateID: uint64
  cid: CID
}

export type BlockListKey = {
  address: bytes<16>
  blocked: bytes<16>
}

export type SubscriptionKey = {
    address: Address;
    id: uint64;
};

export type SubscriptionInfo = {
  recipient: Address
  serviceID: ServiceID
  startDate: uint64
  amount: uint64
  interval: uint64
  asset: uint64
  gateID: uint64
  lastPayment: uint64
  streak: uint64
  escrowed: uint64
}

export type PassesKey = {
  address: Address
  id: uint64
}

export type SubscriptionInfoWithPasses = {
  recipient: Address
  serviceID: uint64
  startDate: uint64
  amount: uint64
  interval: uint64
  asset: uint64
  gateID: uint64
  lastPayment: uint64
  streak: uint64
  escrowed: uint64
  passes: Address[]
}

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