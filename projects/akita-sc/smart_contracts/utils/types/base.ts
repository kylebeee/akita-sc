import { arc4, bytes, op, StringCompat, uint64, Uint64Compat } from '@algorandfoundation/algorand-typescript'
import { Address, DynamicArray, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

export function uint8(v: uint64) {
    return new arc4.UintN8(v)
}

export function bytes16(v: bytes) {
    return v.slice(0, 16).toFixed({ length: 16 })
}

export type CID = bytes<36>

export type uint64Array = DynamicArray<UintN64>

export function str(s: string) {
    return new arc4.Str(s)
}