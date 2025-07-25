import { Contract } from "@algorandfoundation/algorand-typescript";
import { HyperSwapMBRData } from "./types";
import { HashesMBR, MetaMerkleHyperSwapDataMBR, MetaMerkleHyperSwapRootMBR, OffersMBR, ParticipantsMBR } from "./constants";

export class BaseHyperSwap extends Contract {
  protected mbr(): HyperSwapMBRData {
    return {
      offers: OffersMBR,
      participants: ParticipantsMBR,
      hashes: HashesMBR,
      mm: {
        root: MetaMerkleHyperSwapRootMBR,
        data: MetaMerkleHyperSwapDataMBR,
      }
    }
  }
} 