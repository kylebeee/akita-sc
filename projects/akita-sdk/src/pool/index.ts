import { BaseSDK } from "../base";
import { PoolClient, PoolFactory } from '../generated/PoolClient'
import { NewContractSDKParams } from "../types";

export class PoolSDK extends BaseSDK<PoolClient> {
  constructor(params: NewContractSDKParams) {
    super({ factory: PoolFactory, ...params });
  }
}