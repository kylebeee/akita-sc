import { BaseSDK } from "../../base";
import { StakingPluginArgs, StakingPluginClient, StakingPluginFactory } from "../../generated/StakingPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = StakingPluginArgs["obj"];

type StakeArgs = (
  Omit<ContractArgs['stake(uint64,bool,uint64,uint8,uint64,uint64,bool)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type WithdrawArgs = (
  Omit<ContractArgs['withdraw(uint64,bool,uint64,uint8)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class StakingPluginSDK extends BaseSDK<StakingPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: StakingPluginFactory, ...params });
  }

  stake(): PluginSDKReturn;
  stake(args: StakeArgs): PluginSDKReturn;
  stake(args?: StakeArgs): PluginSDKReturn {
    const methodName = 'stake';
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

        const params = await this.client.params.stake({
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

  withdraw(): PluginSDKReturn;
  withdraw(args: WithdrawArgs): PluginSDKReturn;
  withdraw(args?: WithdrawArgs): PluginSDKReturn {
    const methodName = 'withdraw';
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

        const params = await this.client.params.withdraw({
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
