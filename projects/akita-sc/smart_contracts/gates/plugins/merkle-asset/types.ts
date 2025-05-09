import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type MerkleAssetRegistryInfo = {
    creator: Address
    name: string
}

export class arc4MerkleAssetRegistryInfo extends arc4.Struct<{
    creator: Address
    name: arc4.Str
}> {}

export type MerkleAssetGateCheckParams = {
    user: Address
    registryID: uint64
    asset: uint64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>
}

export class arc4MerkleAssetGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
    asset: arc4.UintN64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>
}> {}