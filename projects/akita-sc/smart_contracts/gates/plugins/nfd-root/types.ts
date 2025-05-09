import { arc4, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type NFDRootRegistryInfo = {
    root: bytes
}

export class arc4NFDRootRegistryInfo extends arc4.Struct<{
    root: arc4.Str
}> {}

export type NFDRootGateCheckParams = {
    user: Address
    registryID: uint64
    NFD: uint64
}

export class arc4NFDRootGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
    NFD: arc4.UintN64
}> {}