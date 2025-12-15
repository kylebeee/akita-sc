import { BaseSDK } from "../../base";
import { PollPluginContractArgs, PollPluginContractClient, PollPluginContractFactory } from "../../generated/PollPluginContractClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = PollPluginContractArgs["obj"];

type NewArgs = (
  Omit<ContractArgs['new(uint64,bool,uint8,uint64,uint64,string,string[],uint64)uint64'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type DeleteBoxesArgs = (
  Omit<ContractArgs['deleteBoxes(uint64,bool,uint64,address[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type VoteArgs = (
  Omit<ContractArgs['vote(uint64,bool,uint64,uint64[],byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class PollPluginSDK extends BaseSDK<PollPluginContractClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: PollPluginContractFactory, ...params });
  }

  new(): PluginSDKReturn;
  new(args: NewArgs): PluginSDKReturn;
  new(args?: NewArgs): PluginSDKReturn {
    const methodName = 'new';
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

        const params = await this.client.params.new({
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

  deleteBoxes(): PluginSDKReturn;
  deleteBoxes(args: DeleteBoxesArgs): PluginSDKReturn;
  deleteBoxes(args?: DeleteBoxesArgs): PluginSDKReturn {
    const methodName = 'deleteBoxes';
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

        const params = await this.client.params.deleteBoxes({
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

  vote(): PluginSDKReturn;
  vote(args: VoteArgs): PluginSDKReturn;
  vote(args?: VoteArgs): PluginSDKReturn {
    const methodName = 'vote';
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

        const params = await this.client.params.vote({
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

