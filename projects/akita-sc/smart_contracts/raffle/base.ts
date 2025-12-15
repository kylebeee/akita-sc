import { abimethod, Contract } from "@algorandfoundation/algorand-typescript";
import { EntriesByAddressMBR, EntriesMBR, WeightsMBR } from "./constants";
import { RaffleMBRData } from "./types";

export class BaseRaffle extends Contract {
  @abimethod({ readonly: true })
  mbr(): RaffleMBRData {
    return {
      entries: EntriesMBR,
      weights: WeightsMBR,
      entriesByAddress: EntriesByAddressMBR
    }
  }
}