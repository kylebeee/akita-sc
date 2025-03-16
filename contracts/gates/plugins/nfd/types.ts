import { arc4, bytes, uint64 } from "@algorandfoundation/algorand-typescript";

export type NFDRootRegistryInfo = {
    root: bytes
}

export class arc4NFDRootRegistryInfo extends arc4.Struct<{
    root: arc4.Str,
}> {}

export type NFDRootGateCheckParams = {
    user: arc4.Address
    registryID: uint64
    NFD: uint64
}

export class arc4NFDRootGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    registryID: arc4.UintN64,
    NFD: arc4.UintN64,
}> {}

export type NFDGateCheckParams = {
    user: arc4.Address
    NFD: uint64
}

export class arc4NFDGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    NFD: arc4.UintN64,
}> {}