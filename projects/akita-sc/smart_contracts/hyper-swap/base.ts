import { Contract } from "@algorandfoundation/algorand-typescript";
import { HyperSwapMBRData } from "./types";

export class BaseHyperSwap extends Contract {
  protected mbr(): HyperSwapMBRData {
    return {
      offers: 50_900,
      participants: 34_900,
      hashes: 34_900,
      mm: {
        root: 40_900,
        data: 27_300,
      }
    }
  }
} 