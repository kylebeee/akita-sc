import { Contract } from "@algorandfoundation/algorand-typescript";
import { RaffleMBRData } from "./types";
import { EntriesByAddressMBR, EntriesMBR, WeightsMBR } from "./constants";

export class BaseRaffle extends Contract {
    protected mbr(): RaffleMBRData {
        return {
            entries: EntriesMBR,
            weights: WeightsMBR,
            entriesByAddress: EntriesByAddressMBR
        }
    }
}