import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type NFDRootGateCheckParams = {
  user: Address
  registryID: uint64
  NFD: uint64
}