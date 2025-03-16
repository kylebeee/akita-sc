import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";

// export const RegistryInfoLengthMinimum = len<Address>() + 1;

export type MerkleAddressRegistryInfo = {
    creator: arc4.Address
    name: string
}

export class arc4MerkleAddressRegistryInfo extends arc4.Struct<{
    creator: arc4.Address,
    name: arc4.Str,
}> {}

// export const MerkleAddressGateCheckParamsLengthMinimum = len<Address>() + len<uint64>() + 64;

export type MerkleAddressGateCheckParams = {
    user: arc4.Address
    registryID: uint64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>
}

export class arc4MerkleAddressGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    registryID: arc4.UintN64,
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>,
}> {}



// export const RegistryInfoLengthMinimum = len<Address>() + 1;
export type MerkleAssetRegistryInfo = {
    creator: arc4.Address
    name: string
}

export class arc4MerkleAssetRegistryInfo extends arc4.Struct<{
    creator: arc4.Address,
    name: arc4.Str,
}> {}

// export const MerkleAssetGateCheckParamsLengthMinimum = len<Address>() + len<uint64>() + len<AssetID>() + 64;
export type MerkleAssetGateCheckParams = {
    user: arc4.Address
    registryID: uint64
    asset: uint64
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>;
}

export class arc4MerkleAssetGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    registryID: arc4.UintN64,
    asset: arc4.UintN64,
    proof: arc4.DynamicArray<arc4.StaticBytes<32>>,
}> {}