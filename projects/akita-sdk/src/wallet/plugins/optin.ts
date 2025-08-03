import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { BaseSDK } from "../../base";
import { OptInPluginArgs, OptInPluginClient, OptInPluginFactory } from "../../generated/OptInPluginClient";
import { NewContractSDKParams, WithSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk from "algosdk";

const assetOptInCost = 100_000 // This is the cost for asset opt-in, adjust as necessary

type ContractArgs = OptInPluginArgs["obj"];

type OptInArgs = (
  Omit<ContractArgs['optin(uint64,bool,uint64[],pay)void'], 'walletId' | 'rekeyBack' | 'mbrPayment'>
  & WithSigner
  & { rekeyBack?: boolean }
);

export class OptinPluginSDK extends BaseSDK<OptInPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: OptInPluginFactory, ...params });
  }

  optin(): PluginSDKReturn;
  optin(args: OptInArgs): PluginSDKReturn;
  optin(args?: OptInArgs): PluginSDKReturn {
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return {
        selector: this.client.appClient.getABIMethod('optin').getSelector(),
        getTxns: async ({}: PluginHookParams) => { return [] }
      };
    }

    return {
      selector: this.client.appClient.getABIMethod('optin').getSelector(),
      getTxns: async ({ walletId }: PluginHookParams) => {

      const rekeyBack = args.rekeyBack ?? true;

      const mbrPayment = this.client.algorand.createTransaction.payment({
        sender: args.sender,
        amount: new AlgoAmount({ microAlgos: assetOptInCost * args.assets.length }),
        receiver: algosdk.getApplicationAddress(walletId)
      })

      return (
        await this.client.createTransaction.optin({
          args: { walletId, ...args, rekeyBack, mbrPayment },
          ...this.sendParams
        })
      ).transactions
    }
  }
  }
}