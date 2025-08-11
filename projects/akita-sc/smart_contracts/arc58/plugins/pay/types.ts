import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type PayParams = {
  receiver: Address
  asset: uint64
  amount: uint64
}