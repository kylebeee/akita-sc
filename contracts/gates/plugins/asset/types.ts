import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { Operator } from "../../types";

export type RegistryInfo = {
    op: Operator
    value: uint64
}

export class arc4RegistryInfo extends arc4.Struct<{
    op: arc4.UintN64,
    value: arc4.UintN64,
}> {}

export type AssetGateCheckParams = {
    user: Address
    registryID: uint64
    asset: uint64
}

export class arc4AssetGateCheckParams extends arc4.Struct<{
    user: Address,
    registryID: arc4.UintN64,
    asset: arc4.UintN64,
}> {}