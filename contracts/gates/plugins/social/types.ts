import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { Operator } from "../../types";

export type FollowerCountRegistryInfo = {
    op: Operator
    value: uint64
}

export class arc4FollowerCountRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64,
    value: arc4.UintN64,
}> {}

export type FollowerCountGateCheckParams = {
    user: arc4.Address
    registryID: uint64
}

export class arc4FollowerCountGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    registryID: arc4.UintN64,
}> {}


export type FollowerIndexRegistryInfo = {
    user: arc4.Address
    op: Operator
    value: uint64
}

export class arc4FollowerIndexRegistryInfo extends arc4.Struct<{
    user: arc4.Address,
    op: arc4.UintN64,
    value: arc4.UintN64,
}> {}

export type FollowerIndexGateCheckParams = {
    registryID: uint64
    index: uint64
    follower: arc4.Address
}

export class arc4FollowerIndexGateCheckParams extends arc4.Struct<{
    registryID: arc4.UintN64,
    index: arc4.UintN64,
    follower: arc4.Address,
}> {}

export type ImpactRegistryInfo = {
    op: Operator
    value: uint64
}

export class arc4ImpactRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64,
    value: arc4.UintN64,
}> {}

export type ImpactGateCheckParams = {
    user: arc4.Address
    registryID: uint64
}

export class arc4ImpactGateCheckParams extends arc4.Struct<{
    user: arc4.Address,
    registryID: arc4.UintN64,
}> {}