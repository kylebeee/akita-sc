import { BaseSDK } from "../../base";
import { MarketplacePluginArgs, MarketplacePluginClient, MarketplacePluginFactory } from "../../generated/MarketplacePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";

type ContractArgs = MarketplacePluginArgs["obj"];

type ListArgs = (
  Omit<ContractArgs['list(uint64,bool,uint64,uint64,uint64,uint64,uint64,address,uint64,address,string,byte[32][])uint64'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type PurchaseArgs = (
  Omit<ContractArgs['purchase(uint64,bool,uint64,address,byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type DelistArgs = (
  Omit<ContractArgs['delist(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class MarketplacePluginSDK extends BaseSDK<MarketplacePluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: MarketplacePluginFactory, ...params });
  }

  list(): PluginSDKReturn;
  list(args: ListArgs): PluginSDKReturn;
  list(args?: ListArgs): PluginSDKReturn {
    const methodName = 'list';
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

        const params = await this.client.params.list({
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

  purchase(): PluginSDKReturn;
  purchase(args: PurchaseArgs): PluginSDKReturn;
  purchase(args?: PurchaseArgs): PluginSDKReturn {
    const methodName = 'purchase';
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

        const params = await this.client.params.purchase({
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

  delist(): PluginSDKReturn;
  delist(args: DelistArgs): PluginSDKReturn;
  delist(args?: DelistArgs): PluginSDKReturn {
    const methodName = 'delist';
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

        const params = await this.client.params.delist({
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

