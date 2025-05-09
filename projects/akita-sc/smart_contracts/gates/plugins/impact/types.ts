import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { Operator } from '../../types'

export type ImpactRegistryInfo = {
    op: Operator
    value: uint64
}

export class arc4ImpactRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64
    value: arc4.UintN64
}> {}

export type ImpactGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4ImpactGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}
