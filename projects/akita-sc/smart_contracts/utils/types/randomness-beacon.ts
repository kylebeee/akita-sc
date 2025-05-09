import { Bytes, bytes, Contract, uint64 } from '@algorandfoundation/algorand-typescript'

export class RandomnessBeacon extends Contract {
    get(round: uint64, userData: bytes): bytes {
        return Bytes('')
    }
}
