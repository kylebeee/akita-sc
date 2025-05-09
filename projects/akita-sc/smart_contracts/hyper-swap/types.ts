import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, StaticBytes, UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export type OfferValue = {
    state: UintN8
    root: StaticBytes<32>
    leaves: uint64
    escrowed: uint64
    participantsRoot: StaticBytes<32>
    participantsLeaves: uint64
    acceptances: uint64
    expiration: uint64
}

export class arc4OfferValue extends arc4.Struct<{
    state: UintN8
    root: StaticBytes<32>
    leaves: arc4.UintN64
    escrowed: arc4.UintN64
    participantsRoot: StaticBytes<32>
    participantsLeaves: arc4.UintN64
    acceptances: arc4.UintN64
    expiration: arc4.UintN64
}> {}

export type ParticipantKey = {
    id: uint64
    address: Address
}

export class arc4ParticipantKey extends arc4.Struct<{
    id: arc4.UintN64
    address: Address
}> {}

export type EscrowKey = {
    id: uint64
    sender: Address
    asset: uint64
}

export class arc4EscrowKey extends arc4.Struct<{
    id: arc4.UintN64
    sender: Address
    asset: arc4.UintN64
}> {}

export type HashKey = {
    id: uint64
    hash: StaticBytes<32>
}

export class arc4HashKey extends arc4.Struct<{
    id: arc4.UintN64
    hash: StaticBytes<32>
}> {}

export type HyperSwapMBRData = {
    offers: uint64
    participants: uint64
    hashes: uint64
    mm: {
        root: uint64
        data: uint64
    }
}