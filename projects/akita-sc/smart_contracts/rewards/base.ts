import { Bytes, Contract } from "@algorandfoundation/algorand-typescript";
import { RewardsMBRData } from "./types";

export class BaseRewards extends Contract {

  protected mbr(title: string, note: string): RewardsMBRData {
    return {
      disbursements: 35_300 + (400 * (Bytes(title).length + Bytes(note).length)),
      userAllocations: 25_300
    }
  }
}