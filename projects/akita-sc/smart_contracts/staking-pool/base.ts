import { Contract, abimethod, uint64 } from "@algorandfoundation/algorand-typescript";
import { BoxCostPerByte } from "../utils/constants";
import { MinPoolRewardsMBR, PoolDisbursementSMBR, PoolEntriesByAddressMBR, PoolEntriesMBR, PoolUniquesMBR } from "./constants";
import { StakingPoolMBRData } from "./types";

export class BaseStakingPool extends Contract {
  
  protected rewardsMbr(winningTickets: uint64): uint64 {
    return MinPoolRewardsMBR + (BoxCostPerByte * winningTickets)
  }

  /** @returns the mbr created for each boxmap entry */
  @abimethod({ readonly: true })
  mbr(winningTickets: uint64): StakingPoolMBRData {
    return {
      entries: PoolEntriesMBR,
      uniques: PoolUniquesMBR,
      entriesByAddress: PoolEntriesByAddressMBR,
      rewards: this.rewardsMbr(winningTickets),
      disbursements: PoolDisbursementSMBR
    }
  }
}