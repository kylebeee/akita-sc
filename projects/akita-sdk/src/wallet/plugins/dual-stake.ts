import { BaseSDK } from "../../base";
import { DualStakePluginArgs, DualStakePluginClient, DualStakePluginFactory } from "../../generated/DualStakePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = DualStakePluginArgs["obj"];

type MintArgs = (
  Omit<ContractArgs['mint(uint64,bool,uint64,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

type RedeemArgs = (
  Omit<ContractArgs['redeem(uint64,bool,uint64)void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class DualStakePluginSDK extends BaseSDK<DualStakePluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: DualStakePluginFactory, ...params });
  }

  mint(): PluginSDKReturn;
  mint(args: MintArgs): PluginSDKReturn;
  mint(args?: MintArgs): PluginSDKReturn {
    const methodName = 'mint';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.mint({
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

  redeem(): PluginSDKReturn;
  redeem(args: RedeemArgs): PluginSDKReturn;
  redeem(args?: RedeemArgs): PluginSDKReturn {
    const methodName = 'redeem';
    if (args === undefined) {
      return (_spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer } = args;
    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (_spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const rekeyBack = args.rekeyBack ?? true;

        const params = await this.client.params.redeem({
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
