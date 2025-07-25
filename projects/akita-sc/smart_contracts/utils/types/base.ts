import { arc4, bytes, uint64 } from '@algorandfoundation/algorand-typescript'

export function uint8(v: uint64) {
    return new arc4.Uint8(v)
}

export function bytes16(v: bytes) {
    return v.slice(0, 16).toFixed({ length: 16 })
}

export type CID = bytes<36>