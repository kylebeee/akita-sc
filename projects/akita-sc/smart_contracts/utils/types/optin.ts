import { arc4, Asset, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicBytes } from '@algorandfoundation/algorand-typescript/arc4'

export type AddressOrArc58 = bytes

export type arc4AddressOrApp = DynamicBytes

export type AssetAndAmount = {
    asset: Asset
    amount: uint64
}

export class arc4AssetAndAmount extends arc4.Struct<{
    asset: arc4.UintN64
    amount: arc4.UintN64
}> {}
