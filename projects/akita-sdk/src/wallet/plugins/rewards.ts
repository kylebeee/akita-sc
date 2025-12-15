import { BaseSDK } from "../../base";
import { RewardsPluginArgs, RewardsPluginClient, RewardsPluginFactory } from "../../generated/RewardsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";

type ContractArgs = RewardsPluginArgs["obj"];

type ClaimRewardsArgs = (
  Omit<ContractArgs['claimRewards(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class RewardsPluginSDK extends BaseSDK<RewardsPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: RewardsPluginFactory, ...params });
  }

  claimRewards(): PluginSDKReturn;
  claimRewards(args: ClaimRewardsArgs): PluginSDKReturn;
  claimRewards(args?: ClaimRewardsArgs): PluginSDKReturn {
    const methodName = 'claimRewards';
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.claimRewards({
          ...sendParams,
          args: { wallet, rekeyBack, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }
}

