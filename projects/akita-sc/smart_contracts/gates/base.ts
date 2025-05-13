import { Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { GateMBRData } from "./types";

export class BaseGate extends Contract {
  protected mbr(length: uint64): GateMBRData {
    return {
      appRegistry: 6_100,
      gateRegistry: 6_100 + (400 * (32 * length)),
    }
  }
}