import { uint64 } from '@algorandfoundation/algorand-typescript'

export type RoyaltyAmounts = {
    creator: uint64
    akita: uint64
    marketplace: uint64
    seller: uint64
}