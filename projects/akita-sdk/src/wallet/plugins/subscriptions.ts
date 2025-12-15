import { BaseSDK } from "../../base";
import { SubscriptionsPluginArgs, SubscriptionsPluginClient, SubscriptionsPluginFactory } from "../../generated/SubscriptionsPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = SubscriptionsPluginArgs["obj"];

type OptInArgs = (
  Omit<ContractArgs['optIn(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type InitDescriptionArgs = (
  Omit<ContractArgs['initDescription(uint64,uint64)void'], 'wallet'>
  & MaybeSigner
);

type LoadDescriptionArgs = (
  Omit<ContractArgs['loadDescription(uint64,uint64,byte[])void'], 'wallet'>
  & MaybeSigner
);

type NewServiceArgs = (
  Omit<ContractArgs['newService(uint64,bool,uint64,uint64,uint64,uint64,uint64,string,byte[36],uint8,byte[3])uint64'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type PauseServiceArgs = (
  Omit<ContractArgs['pauseService(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type ShutdownServiceArgs = (
  Omit<ContractArgs['shutdownService(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type BlockArgs = (
  Omit<ContractArgs['block(uint64,bool,address)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type UnblockArgs = (
  Omit<ContractArgs['unblock(uint64,bool,address)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type SubscribeArgs = (
  Omit<ContractArgs['subscribe(uint64,bool,uint64,address,uint64,uint64,uint64,byte[][])void'], 'wallet' | 'rekeyBack' | 'index' | 'args' | 'asset'>
  & MaybeSigner
  & {
    rekeyBack?: boolean;
    index?: bigint | number;
    args?: Uint8Array[];
    asset?: bigint | number;
  }
);

type TriggerPaymentArgs = (
  Omit<ContractArgs['triggerPayment(uint64,bool,address,uint64,byte[][])void'], 'wallet' | 'rekeyBack' | 'args'>
  & MaybeSigner
  & {
    rekeyBack?: boolean;
    args?: Uint8Array[];
  }
);

type StreakCheckArgs = (
  Omit<ContractArgs['streakCheck(uint64,bool,(address,uint64))void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type SetPassesArgs = (
  Omit<ContractArgs['setPasses(uint64,bool,uint64,address[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class SubscriptionsPluginSDK extends BaseSDK<SubscriptionsPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: SubscriptionsPluginFactory, ...params });
  }

  optIn(): PluginSDKReturn;
  optIn(args: OptInArgs): PluginSDKReturn;
  optIn(args?: OptInArgs): PluginSDKReturn {
    const methodName = 'optIn';
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

        const params = await this.client.params.optIn({
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

  initDescription(): PluginSDKReturn;
  initDescription(args: InitDescriptionArgs): PluginSDKReturn;
  initDescription(args?: InitDescriptionArgs): PluginSDKReturn {
    const methodName = 'initDescription';
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
        const params = await this.client.params.initDescription({
          ...sendParams,
          args: { wallet, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  loadDescription(): PluginSDKReturn;
  loadDescription(args: LoadDescriptionArgs): PluginSDKReturn;
  loadDescription(args?: LoadDescriptionArgs): PluginSDKReturn {
    const methodName = 'loadDescription';
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
        const params = await this.client.params.loadDescription({
          ...sendParams,
          args: { wallet, ...args },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  newService(): PluginSDKReturn;
  newService(args: NewServiceArgs): PluginSDKReturn;
  newService(args?: NewServiceArgs): PluginSDKReturn {
    const methodName = 'newService';
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, rekeyBack: rekeyBackArg, ...rest } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = rekeyBackArg ?? true;

        const params = await this.client.params.newService({
          ...sendParams,
          args: { wallet, rekeyBack, ...rest },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  pauseService(): PluginSDKReturn;
  pauseService(args: PauseServiceArgs): PluginSDKReturn;
  pauseService(args?: PauseServiceArgs): PluginSDKReturn {
    const methodName = 'pauseService';
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

        const params = await this.client.params.pauseService({
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

  shutdownService(): PluginSDKReturn;
  shutdownService(args: ShutdownServiceArgs): PluginSDKReturn;
  shutdownService(args?: ShutdownServiceArgs): PluginSDKReturn {
    const methodName = 'shutdownService';
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

        const params = await this.client.params.shutdownService({
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

  block(): PluginSDKReturn;
  block(args: BlockArgs): PluginSDKReturn;
  block(args?: BlockArgs): PluginSDKReturn {
    const methodName = 'block';
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

        const params = await this.client.params.block({
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

  unblock(): PluginSDKReturn;
  unblock(args: UnblockArgs): PluginSDKReturn;
  unblock(args?: UnblockArgs): PluginSDKReturn {
    const methodName = 'unblock';
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

        const params = await this.client.params.unblock({
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

  subscribe(): PluginSDKReturn;
  subscribe(args: SubscribeArgs): PluginSDKReturn;
  subscribe(args?: SubscribeArgs): PluginSDKReturn {
    const methodName = 'subscribe';
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, asset = 0n, index = 0n, args: gateArgs = [], ...rest } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.subscribe({
          ...sendParams,
          args: { wallet, rekeyBack, asset, index, args: gateArgs, ...rest },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  triggerPayment(): PluginSDKReturn;
  triggerPayment(args: TriggerPaymentArgs): PluginSDKReturn;
  triggerPayment(args?: TriggerPaymentArgs): PluginSDKReturn {
    const methodName = 'triggerPayment';
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, args: gateArgs = [], ...rest } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.triggerPayment({
          ...sendParams,
          args: { wallet, rekeyBack, args: gateArgs, ...rest },
        });

        return [{
          type: 'methodCall',
          ...params
        }];
      }
    });
  }

  streakCheck(): PluginSDKReturn;
  streakCheck(args: StreakCheckArgs): PluginSDKReturn;
  streakCheck(args?: StreakCheckArgs): PluginSDKReturn {
    const methodName = 'streakCheck';
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

        const params = await this.client.params.streakCheck({
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

  setPasses(): PluginSDKReturn;
  setPasses(args: SetPassesArgs): PluginSDKReturn;
  setPasses(args?: SetPassesArgs): PluginSDKReturn {
    const methodName = 'setPasses';
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

        const params = await this.client.params.setPasses({
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
