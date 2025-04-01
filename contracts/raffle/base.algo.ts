import { Contract } from "@algorandfoundation/algorand-typescript";
import { RaffleMBRData } from "./types";

export class BaseRaffle extends Contract {
    protected mbr(): RaffleMBRData {
        return {
            entries: 18_900,
            weights: 13_113_300,
            entriesByAddress: 18_900
        }
    }
}