import { Contract } from "@algorandfoundation/algorand-typescript";
import { StakingMBRData } from "./types";

export class BaseStaking extends Contract {
  protected mbr(): StakingMBRData {
    return {
      stakes: 28_900,
      heartbeats: 70_100,
    }
  }
}