import { BaseSDK } from "../../base";
import { PaySiloPluginArgs, PaySiloPluginClient, PaySiloPluginFactory } from "../../generated/PaySiloPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import { Address } from "algosdk";
import { getTxns } from "../utils";

type ContractArgs = PaySiloPluginArgs["obj"];

type PayArgs = (
  Omit<ContractArgs['pay(uint64,bool,(uint64,uint64)[])void'], 'wallet' | 'rekeyBack'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class PaySiloPluginSDK extends BaseSDK<PaySiloPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: PaySiloPluginFactory, ...params });
  }

  pay(): PluginSDKReturn;
  pay(args: PayArgs): PluginSDKReturn;
  pay(args?: PayArgs): PluginSDKReturn {
    const methodName = 'pay';
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

        const params = await this.client.params.pay({
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
