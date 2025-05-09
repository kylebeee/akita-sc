import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { StakingType } from "../../../staking/types"
import { Operator } from "../../types"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type StakingAmountRegistryInfo = {
    op: Operator
    asset: uint64
    type: StakingType
    amount: uint64
    includeStaked: boolean
}

export class arc4StakingAmountRegistryInfo extends arc4.Struct<{
    op: arc4.UintN8
    asset: arc4.UintN64
    amount: arc4.UintN64
    type: arc4.UintN8
    includeStaked: arc4.Bool
}> {}

export type StakingAmountGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4StakingAmountGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}