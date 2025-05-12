import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"

export type MetaValue = {
    // the cached subscription App ID for the user
    subscriptionIndex: uint64
    // the cached NFD for the user
    NFD: uint64
    // the last time the NFD was updated and cached against this contract
    nfdTimeChanged: uint64
    // the impact score from the cached NFD
    nfdImpact: uint64
    // the cached akita NFT the user has
    akitaNFT: uint64
}

export class arc4MetaValue extends arc4.Struct<{
    subscriptionIndex: arc4.UintN64
    NFD: arc4.UintN64
    nfdTimeChanged: arc4.UintN64
    nfdImpact: arc4.UintN64
    akitaNFT: arc4.UintN64
}> {}

export type AkitaSocialImpactMBRData = {
    meta: uint64
    subscriptionStateModifier: uint64
}