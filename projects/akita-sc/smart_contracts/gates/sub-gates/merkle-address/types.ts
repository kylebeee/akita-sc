import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Proof } from '../../../utils/types/merkles'

export type MerkleAddressRegistryInfo = {
    creator: Address
    name: string
}

export type MerkleAddressGateCheckParams = {
    user: Address
    registryID: uint64
    proof: Proof
}