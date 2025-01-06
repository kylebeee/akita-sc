import { Contract } from "@algorandfoundation/tealscript";

export class RandomnessBeacon extends Contract {
    programVersion = 10;

    get(round: uint64, userData: bytes): bytes { return ''; }
}