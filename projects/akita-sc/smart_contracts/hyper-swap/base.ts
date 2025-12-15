import { abimethod, Contract } from "@algorandfoundation/algorand-typescript";
import { HashesMBR, MetaMerkleHyperSwapDataMBR, MetaMerkleHyperSwapRootMBR, OffersMBR, ParticipantsMBR } from "./constants";
import { HyperSwapMBRData } from "./types";

export class BaseHyperSwap extends Contract {
  @abimethod({ readonly: true })
  mbr(): HyperSwapMBRData {
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