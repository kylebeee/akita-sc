import { Contract } from "@algorandfoundation/algorand-typescript";
import { StakingMBRData } from "./types";
import { HeartbeatsMBR, SettingsMBR, StakesMBR } from "./constants";

export class BaseStaking extends Contract {
  protected mbr(): StakingMBRData {
    return {
      stakes: StakesMBR,
      heartbeats: HeartbeatsMBR,
      settings: SettingsMBR
    }
  }
}