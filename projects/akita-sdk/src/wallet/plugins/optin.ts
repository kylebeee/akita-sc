import { BaseSDK } from "../../base";
import { OptInPluginArgs, OptInPluginClient, OptInPluginFactory } from "../../generated/OptInPluginClient";
import { NewContractSDKParams, MaybeSigner, hasSenderSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk, { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { Txn } from "@algorandfoundation/algokit-utils/types/composer";

const assetOptInCost = 100_000 // This is the cost for asset opt-in, adjust as necessary

type ContractArgs = OptInPluginArgs["obj"];

type OptInArgs = (
  Omit<ContractArgs['optIn(uint64,bool,uint64[],pay)void'], 'walletId' | 'rekeyBack' | 'mbrPayment'>
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
        selector: this.client.appClient.getABIMethod(methodName).getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return {} as Txn }
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

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selector: this.client.appClient.getABIMethod(methodName).getSelector(),
      getTxns: async ({ walletId }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: microAlgo(assetOptInCost * assets.length),
          receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(walletId),
        })

        const params = (
          await this.client.params.optIn({
            ...sendParams,
            args: { walletId, ...args, rekeyBack, mbrPayment },
            extraFee: microAlgo(1_000 * assets.length),
          })
        )

        return {
          type: 'methodCall',
          ...params
        }
      }
    });
  }
}