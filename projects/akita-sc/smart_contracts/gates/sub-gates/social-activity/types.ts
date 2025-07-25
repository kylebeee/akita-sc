

import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Operator } from "../../types"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type ActivityRegistryInfo = {
  op: Operator
  value: uint64
}

export type ActivityGateCheckParams = {
  registryID: uint64
  user: Address
}