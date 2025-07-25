import { uint64 } from "@algorandfoundation/algorand-typescript"
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
export type StakingAmountGateCheckParams = {
    user: Address
    registryID: uint64
}