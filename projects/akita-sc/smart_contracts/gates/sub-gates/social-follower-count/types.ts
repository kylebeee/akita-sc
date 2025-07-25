import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Operator } from "../../types"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type FollowerCountRegistryInfo = {
  op: Operator
  value: uint64
}

export type FollowerCountGateCheckParams = {
  user: Address
  registryID: uint64
}