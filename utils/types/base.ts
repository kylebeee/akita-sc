import { arc4, bytes, StringCompat, uint64, Uint64Compat } from '@algorandfoundation/algorand-typescript'
import { Address, DynamicArray, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

export function uint8(v: uint64) {
    return new arc4.UintN8(v)
}

export function bytes0() {
    return new arc4.StaticBytes<0>()
}

export function bytes4(value: bytes) {
    return new arc4.StaticBytes<4>(value)
}

export function bytes16(value: bytes) {
    return new arc4.StaticBytes<16>(value)
}

export function bytes31(value: Address) {
    return new arc4.StaticBytes<31>(value.bytes.slice(0, 31))
}

export function bytes32(value: bytes) {
    return new arc4.StaticBytes<32>(value)
}

export function bytes36(value: bytes) {
    return new arc4.StaticBytes<36>(value)
}

export type CID = arc4.StaticBytes<36>

export function cid(value: bytes): CID {
    return bytes36(value)
}

export type uint64Array = DynamicArray<UintN64>

export function str(s: string) {
    return new arc4.Str(s)
}