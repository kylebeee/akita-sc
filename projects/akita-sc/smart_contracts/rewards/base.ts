import { abimethod, Bytes, Contract } from "@algorandfoundation/algorand-typescript";
import { BoxCostPerByte } from "../utils/constants";
import { MinDisbursementsMBR, UserAllocationMBR } from "./constants";
import { RewardsMBRData } from "./types";

export class BaseRewards extends Contract {
  @abimethod({ readonly: true })
  mbr(title: string, note: string): RewardsMBRData {
    return {
      disbursements: MinDisbursementsMBR + (BoxCostPerByte * (Bytes(title).length + Bytes(note).length)),
      userAllocations: UserAllocationMBR
    }
  }
}