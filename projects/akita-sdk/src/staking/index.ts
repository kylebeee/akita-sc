import { BaseSDK } from "../base";
import { StakingClient, StakingFactory } from '../generated/StakingClient'
import { NewContractSDKParams } from "../types";

export class StakingSDK extends BaseSDK<StakingClient> {
  constructor(params: NewContractSDKParams) {
    super({ factory: StakingFactory, ...params });
  }

  

}