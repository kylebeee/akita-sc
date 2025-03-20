import { Account, arc4, bytes } from "@algorandfoundation/algorand-typescript";

export function bytes16(value?: bytes | string) {
    return new arc4.StaticBytes<16>(value)
}

export function bytes32(value?: bytes | string) {
    return new arc4.StaticBytes<32>(value)
}