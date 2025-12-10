import { BaseSDK } from "../../base";
import { OptInPluginArgs, OptInPluginClient, OptInPluginFactory } from "../../generated/OptInPluginClient";
import { NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk, { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";

const assetOptInCost = 100_000 // This is the cost for asset opt-in, adjust as necessary

type ContractArgs = OptInPluginArgs["obj"];

type OptInArgs = (
  Omit<ContractArgs['optIn(uint64,bool,uint64[],pay)void'], 'wallet' | 'rekeyBack' | 'mbrPayment'>
  & MaybeSigner
  & { rekeyBack?: boolean }
);

export class OptInPluginSDK extends BaseSDK<OptInPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: OptInPluginFactory, ...params });
  }

  optIn(): PluginSDKReturn;
  optIn(args: OptInArgs): PluginSDKReturn;
  optIn(args?: OptInArgs): PluginSDKReturn {
    const methodName = 'optIn';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
      });
    }

    const { sender, signer, assets } = args;

    const sendParams = this.getRequiredSendParams({ sender, signer });

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: microAlgo(assetOptInCost * assets.length),
          receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(wallet),
        })

        const params = (
          await this.client.params.optIn({
            ...sendParams,
            args: { wallet, ...args, rekeyBack, mbrPayment },
            extraFee: microAlgo(1_000 * assets.length),
          })
        )

        return [{
          type: 'methodCall',
          ...params
        }]
      }
    });
  }
}