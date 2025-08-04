import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { BaseSDK } from "../../base";
import { OptInPluginArgs, OptInPluginClient, OptInPluginFactory } from "../../generated/OptInPluginClient";
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk from "algosdk";

const assetOptInCost = 100_000 // This is the cost for asset opt-in, adjust as necessary

type ContractArgs = OptInPluginArgs["obj"];

type OptInArgs = (
  Omit<ContractArgs['optin(uint64,bool,uint64[],pay)void'], 'walletId' | 'rekeyBack' | 'mbrPayment'>
  & MaybeSigner
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
      return () => ({
        appId: this.client.appId,
        selector: this.client.appClient.getABIMethod('optin').getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return [] }
      });
    }

    const { sender, signer, assets } = args;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return () => ({
      appId: this.client.appId,
      selector: this.client.appClient.getABIMethod('optin').getSelector(),
      getTxns: async ({ walletId }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: new AlgoAmount({ microAlgos: assetOptInCost * assets.length }),
          receiver: algosdk.getApplicationAddress(walletId),
        })

        return (
          await this.client.createTransaction.optin({
            ...sendParams,
            args: { walletId, ...args, rekeyBack, mbrPayment },
          })
        ).transactions
      }
    });
  }
}