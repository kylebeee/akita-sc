import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'

export type RoyaltyAmounts = {
    creator: uint64
    akita: uint64
    marketplace: uint64
    seller: uint64
}

export class arc4RoyaltyAmounts extends arc4.Struct<{
    creator: arc4.UintN64
    akita: arc4.UintN64
    marketplace: arc4.UintN64
    seller: arc4.UintN64
}> {}
