import { bytes, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, Uint8 } from "@algorandfoundation/algorand-typescript/arc4"

export type OfferValue = {
    state: Uint8
    root: bytes<32>
    leaves: uint64
    escrowed: uint64
    participantsRoot: bytes<32>
    participantsLeaves: uint64
    acceptances: uint64
    expiration: uint64
}

export type ParticipantKey = {
    id: uint64
    address: Address
}

export type EscrowKey = {
    id: uint64
    sender: Address
    asset: uint64
}

export type HashKey = {
    id: uint64
    hash: bytes<32>
}

export type HyperSwapMBRData = {
    offers: uint64
    participants: uint64
    hashes: uint64
    mm: {
        root: uint64
        data: uint64
    }
}