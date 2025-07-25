import { uint64 } from "@algorandfoundation/algorand-typescript"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type RefundValue = {
    amount: uint64
    payor: Address
}