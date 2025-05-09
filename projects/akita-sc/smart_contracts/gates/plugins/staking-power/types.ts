import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export class arc4StakingPowerRegistryInfo extends arc4.Struct<{
    op: arc4.UintN8
    asset: arc4.UintN64
    power: arc4.UintN64
}> {}

export type StakingPowerGateCheckParams = {
    user: Address
    registryID: uint64
}

export class arc4StakingPowerGateCheckParams extends arc4.Struct<{
    user: Address
    registryID: arc4.UintN64
}> {}