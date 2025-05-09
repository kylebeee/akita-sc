import { Bytes, uint64 } from "@algorandfoundation/algorand-typescript"

export const NFDGlobalStateKeysName = 'i.name'
export const NFDGlobalStateKeysParentAppID = 'i.parentAppID'
export const NFDGlobalStateKeysVersion = 'i.ver'
export const NFDGlobalStateKeysTimeChanged = 'i.timeChanged'

export const NFDMetaKeyVerifiedAddresses = 'v.caAlgo.0.as'
export const NFDMetaKeyVerifiedDomain = 'v.domain'
export const NFDMetaKeyVerifiedTwitter = 'v.twitter'
export const NFDMetaKeyVerifiedDiscord = 'v.discord'
export const NFDMetaKeyVerifiedTelegram = 'v.telegram'

export const ONE_MILLION_AKITA: uint64 = 1_000_000_000_000
export const TWO_HUNDRED_THOUSAND_AKITA: uint64 = 200_000_000_000
export const TEN_THOUSAND_AKITA: uint64 = 10_000_000_000

export const THIRTY_DAYS: uint64 = 2_592_000
export const ONE_YEAR: uint64 = 31_536_000