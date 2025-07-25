import { Bytes, Contract } from "@algorandfoundation/algorand-typescript";
import { RewardsMBRData } from "./types";
import { MinDisbursementsMBR, UserAllocationMBR } from "./constants";
import { BoxCostPerByte } from "../utils/constants";

export class BaseRewards extends Contract {

  protected mbr(title: string, note: string): RewardsMBRData {
    return {
      disbursements: MinDisbursementsMBR + (BoxCostPerByte * (Bytes(title).length + Bytes(note).length)),
      userAllocations: UserAllocationMBR
    }
  }
}