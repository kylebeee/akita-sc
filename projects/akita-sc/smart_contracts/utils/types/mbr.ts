import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address } from "@algorandfoundation/algorand-typescript/arc4"

export type RefundValue = {
    amount: uint64
    payor: Address
}

export class arc4RefundValue extends arc4.Struct<{
    amount: arc4.UintN64
    payor: Address
}> {}