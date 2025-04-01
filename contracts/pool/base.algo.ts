import { Contract } from "@algorandfoundation/algorand-typescript";
import { PoolMBRData } from "./types";

export class BasePool extends Contract {
    /** @returns the mbr created for each boxmap entry */
    // @ts-ignore
    @abimethod({ readonly: true })
    mbr(): PoolMBRData {
        return {
            entries: 25_300,
            entriesByAddress: 25_300,
            disbursements: 6_100
        }
    }
}