import { BaseSDK } from "../../base";
import { PaySiloFactoryPluginArgs, PaySiloFactoryPluginClient, PaySiloFactoryPluginFactory } from "../../generated/PaySiloFactoryPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = PaySiloFactoryPluginArgs["obj"];

type MintArgs = (
  Omit<ContractArgs['mint(uint64,bool,address)uint64'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class PaySiloFactoryPluginSDK extends BaseSDK<PaySiloFactoryPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: PaySiloFactoryPluginFactory, ...params });
  }

  mint(): PluginSDKReturn;
  mint(args: MintArgs): PluginSDKReturn;
  mint(args?: MintArgs): PluginSDKReturn {
    const methodName = 'mint';
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
}
