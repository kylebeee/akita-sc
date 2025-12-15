import { BaseSDK } from "../../base";
import { GatePluginArgs, GatePluginClient, GatePluginFactory } from "../../generated/GatePluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = GatePluginArgs["obj"];

type RegisterArgs = (
  Omit<ContractArgs['register(uint64,bool,(uint64,uint64,uint8)[],byte[][])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class GatePluginSDK extends BaseSDK<GatePluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: GatePluginFactory, ...params });
  }

  register(): PluginSDKReturn;
  register(args: RegisterArgs): PluginSDKReturn;
  register(args?: RegisterArgs): PluginSDKReturn {
    const methodName = 'register';
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

        const params = await this.client.params.register({
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
