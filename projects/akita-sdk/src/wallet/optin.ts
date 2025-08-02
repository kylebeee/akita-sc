import algosdk from "algosdk";
import { BaseSDK } from "../base";
import { OptInPluginArgs, OptInPluginClient, OptInPluginFactory } from "../generated/OptInPluginClient";
import { NewContractSDKParams } from "../types";
import { AppCallMethodCall } from "@algorandfoundation/algokit-utils/types/composer";

type ContractArgs = OptInPluginArgs["obj"];

export type PluginClient<T> = {

}

export class OptinPluginSDK extends BaseSDK<OptInPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: OptInPluginFactory, ...params });
  }

  async optIn(args: ContractArgs['optin(uint64,bool,uint64[],pay)void']): Promise<algosdk.Transaction[]> {
    return (await this.client.createTransaction.optin({ args, ...this.sendParams })).transactions;
  }
}