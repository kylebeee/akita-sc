import { Contract } from "@algorandfoundation/tealscript";

export class NFDRegistry extends Contract {
    isValidNfdAppId(nfdName: string, nfdAppId: uint64): boolean {
        return false
    }
}

