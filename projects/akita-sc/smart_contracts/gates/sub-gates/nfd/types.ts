import { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type NFDRootRegistryInfo = {
  root: bytes
}

export type NFDRootGateCheckParams = {
  user: Address
  registryID: uint64
  NFD: uint64
}

export type NFDGateCheckParams = {
  user: Address
  NFD: uint64
}