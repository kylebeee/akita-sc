import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Operator } from "../../types"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type FollowerCountRegistryInfo = {
    op: Operator
    value: uint64
}

export class arc4FollowerCountRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64
    value: arc4.UintN64
}> {}

export type FollowerCountGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4FollowerCountGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}