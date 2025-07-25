import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"
import { Operator } from "../../types"

export type StakingPowerRegistryInfo = {
  op: Operator
  asset: uint64
  power: uint64
}

export type StakingPowerGateCheckParams = {
  user: Address
  registryID: uint64
}