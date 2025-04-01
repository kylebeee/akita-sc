import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'

export type AssetAndAmount = {
    asset: uint64
    amount: uint64
}

export class arc4AssetAndAmount extends arc4.Struct<{
    asset: arc4.UintN64
    amount: arc4.UintN64
}> {}
