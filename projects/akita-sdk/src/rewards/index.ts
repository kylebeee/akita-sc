import { BaseSDK } from "../base";
import { RewardsClient, RewardsFactory } from '../generated/RewardsClient'
import { NewContractSDKParams } from "../types";

export class RewardsSDK extends BaseSDK<RewardsClient> {
  constructor(params: NewContractSDKParams) {
    super({ factory: RewardsFactory, ...params });
  }
}