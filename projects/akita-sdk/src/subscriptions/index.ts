import { BaseSDK } from "../base";
import { SubscriptionsClient, SubscriptionsFactory } from '../generated/SubscriptionsClient'
import { NewContractSDKParams } from "../types";

export class SubscriptionsSDK extends BaseSDK<SubscriptionsClient> {
  constructor(params: NewContractSDKParams) {
    super({ factory: SubscriptionsFactory, ...params });
  }
}