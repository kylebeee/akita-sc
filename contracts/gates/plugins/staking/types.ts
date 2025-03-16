import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { Operator } from "../../types";
import { StakingType } from "../../../staking/types";

export class arc4StakingType extends arc4.Struct<{
    asset: arc4.UintN64
    type: arc4.UintN64
}> {}

export type StakingAmountRegistryInfo = {
    op: Operator
    asset: uint64
    type: StakingType
    amount: uint64
    includeStaked: boolean
}

export class arc4StakingAmountRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64
    asset: arc4.UintN64
    amount: arc4.UintN64
    type: arc4.UintN64
    includeStaked: arc4.Bool
}> {}

export type StakingAmountGateCheckParams = {
    user: arc4.Address
    registryID: uint64
}

export class arc4StakingAmountGateCheckParams extends arc4.Struct<{
    user: arc4.Address
    registryID: arc4.UintN64
}> {}


// export const RegistryInfoParamsLength = len<Operator>() + len<AssetID>() + len<uint64>();
export type RegistryInfo = {
    op: Operator
    asset: uint64
    power: uint64
}

export class arc4StakingPowerRegistryInfo extends arc4.Struct<{
    op: arc4.UintN64
    asset: arc4.UintN64
    power: arc4.UintN64
}> {}

// export const StakingPowerGateCheckParamsLength = len<Address>() + len<uint64>();
export type StakingPowerGateCheckParams = {
    user: arc4.Address
    registryID: uint64
}

export class arc4StakingPowerGateCheckParams extends arc4.Struct<{
    user: arc4.Address
    registryID: arc4.UintN64
}> {}