import { BaseSDK } from "../../base";
import { RafflePluginArgs, RafflePluginClient, RafflePluginFactory } from "../../generated/RafflePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = RafflePluginArgs["obj"];

type NewRaffleArgs = (
  Omit<ContractArgs['newRaffle(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type EnterArgs = (
  Omit<ContractArgs['enter(uint64,bool,uint64,uint64,address,byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type AddArgs = (
  Omit<ContractArgs['add(uint64,bool,uint64,uint64,byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class RafflePluginSDK extends BaseSDK<RafflePluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: RafflePluginFactory, ...params });
  }

  newRaffle(): PluginSDKReturn;
  newRaffle(args: NewRaffleArgs): PluginSDKReturn;
  newRaffle(args?: NewRaffleArgs): PluginSDKReturn {
    const methodName = 'newRaffle';
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

        const params = await this.client.params.newRaffle({
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

  enter(): PluginSDKReturn;
  enter(args: EnterArgs): PluginSDKReturn;
  enter(args?: EnterArgs): PluginSDKReturn {
    const methodName = 'enter';
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

        const params = await this.client.params.enter({
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

  add(): PluginSDKReturn;
  add(args: AddArgs): PluginSDKReturn;
  add(args?: AddArgs): PluginSDKReturn {
    const methodName = 'add';
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

        const params = await this.client.params.add({
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
