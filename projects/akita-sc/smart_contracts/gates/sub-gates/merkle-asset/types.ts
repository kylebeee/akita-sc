import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../../../utils/types/merkles'

export type MerkleAssetRegistryInfo = {
  creator: Address
  name: string
}

export type MerkleAssetGateCheckParams = {
  user: Address
  registryID: uint64
  asset: uint64
  proof: Proof
}