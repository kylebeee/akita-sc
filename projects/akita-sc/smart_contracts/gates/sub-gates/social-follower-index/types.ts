import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Operator } from "../../types"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type FollowerIndexRegistryInfo = {
    user: Address
    op: Operator
    value: uint64
}

export type FollowerIndexGateCheckParams = {
    registryID: uint64
    index: uint64
    follower: Address
}