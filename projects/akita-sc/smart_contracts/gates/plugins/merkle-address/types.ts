import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type MerkleAddressRegistryInfo = {
    creator: Address
    name: string
}

export class arc4MerkleAddressRegistryInfo extends arc4.Struct<{
    creator: Address
    name: arc4.Str
}> {}

export type MerkleAddressGateCheckParams = {
    user: Address
    registryID: uint64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>
}

export class arc4MerkleAddressGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>
}> {}