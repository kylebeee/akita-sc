import { BaseSDK } from "../../base";
import { StakingPoolPluginArgs, StakingPoolPluginClient, StakingPoolPluginFactory } from "../../generated/StakingPoolPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = StakingPoolPluginArgs["obj"];

type NewPoolArgs = (
  Omit<ContractArgs['newPool(uint64,bool,string,uint8,address,(address,string),uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type InitPoolArgs = (
  Omit<ContractArgs['initPool(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type DeletePoolArgs = (
  Omit<ContractArgs['deletePool(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type AddRewardArgs = (
  Omit<ContractArgs['addReward(uint64,bool,uint64,(uint64,uint8,uint64,uint64,uint64,uint64,uint64,uint64,uint64[],(uint64,uint64,uint64),uint64,uint8,uint64,uint64,uint64,uint64),uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type FinalizePoolArgs = (
  Omit<ContractArgs['finalizePool(uint64,bool,uint64,uint64,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type EnterArgs = (
  Omit<ContractArgs['enter(uint64,bool,uint64,(uint64,uint64,byte[32][])[],byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class StakingPoolPluginSDK extends BaseSDK<StakingPoolPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: StakingPoolPluginFactory, ...params });
  }

  newPool(): PluginSDKReturn;
  newPool(args: NewPoolArgs): PluginSDKReturn;
  newPool(args?: NewPoolArgs): PluginSDKReturn {
    const methodName = 'newPool';
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

        const params = await this.client.params.newPool({
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

  initPool(): PluginSDKReturn;
  initPool(args: InitPoolArgs): PluginSDKReturn;
  initPool(args?: InitPoolArgs): PluginSDKReturn {
    const methodName = 'initPool';
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

        const params = await this.client.params.initPool({
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

  deletePool(): PluginSDKReturn;
  deletePool(args: DeletePoolArgs): PluginSDKReturn;
  deletePool(args?: DeletePoolArgs): PluginSDKReturn {
    const methodName = 'deletePool';
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

        const params = await this.client.params.deletePool({
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

  addReward(): PluginSDKReturn;
  addReward(args: AddRewardArgs): PluginSDKReturn;
  addReward(args?: AddRewardArgs): PluginSDKReturn {
    const methodName = 'addReward';
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

        const params = await this.client.params.addReward({
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

  finalizePool(): PluginSDKReturn;
  finalizePool(args: FinalizePoolArgs): PluginSDKReturn;
  finalizePool(args?: FinalizePoolArgs): PluginSDKReturn {
    const methodName = 'finalizePool';
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

        const params = await this.client.params.finalizePool({
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
}
