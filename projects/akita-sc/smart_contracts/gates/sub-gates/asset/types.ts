import { uint64 } from '@algorandfoundation/algorand-typescript'
import { Operator } from '../../types'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type RegistryInfo = {
    op: Operator
    value: uint64
}

export type AssetGateCheckParams = {
    user: Address
    registryID: uint64
    asset: uint64
}