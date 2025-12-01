import { Account, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { CID } from '../utils/types/base'

export type SubscriptionID = uint64

export type ServicesKey = {
  address: Account
  id: uint64
}

export type ServiceID = uint64

export type ServiceStatus = Uint8

export const ServiceStatusNone: ServiceStatus = new Uint8(0)
export const ServiceStatusDraft: ServiceStatus = new Uint8(10)
export const ServiceStatusActive: ServiceStatus = new Uint8(20)
export const ServiceStatusPaused: ServiceStatus = new Uint8(30)
export const ServiceStatusShutdown: ServiceStatus = new Uint8(40)

export type Service = {
  status: ServiceStatus
  interval: uint64
  asset: uint64
  amount: uint64
  passes: uint64
  gateID: uint64
  title: string
  description: string
  bannerImage: CID
  highlightMessage: Uint8
  highlightColor: bytes<3>
}

export type BlockListKey = {
  address: bytes<16>
  blocked: bytes<16>
}

export type SubscriptionKey = {
    address: Account;
    id: uint64;
};

export type SubscriptionInfo = {
  recipient: Account // 32
  serviceID: ServiceID // 8
  startDate: uint64 // 8
  amount: uint64
  interval: uint64
  asset: uint64
  gateID: uint64
  lastPayment: uint64
  streak: uint64
  escrowed: uint64
}

export type TriggerListRequest = {
  address: Account,
  ids: uint64[]
}

export type TriggerInfo = {
  index: uint64
  id: uint64
  triggerable: boolean
}

export type PassesKey = {
  address: Account
  id: uint64
}

export type SubscriptionInfoWithDetails = {
  recipient: Account
  startDate: uint64
  amount: uint64
  interval: uint64
  asset: uint64
  gateID: uint64
  serviceID: uint64
  status: ServiceStatus
  title: string
  description: string
  bannerImage: CID
  highlightMessage: Uint8
  highlightColor: bytes<3>
  lastPayment: uint64
  streak: uint64
  escrowed: uint64
  passes: Account[]
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