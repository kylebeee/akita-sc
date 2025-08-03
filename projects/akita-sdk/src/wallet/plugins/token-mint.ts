import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { BaseSDK } from "../../base";
import { TokenMintPluginArgs, TokenMintPluginClient, TokenMintPluginFactory } from "../../generated/TokenMintPluginClient";
import { NewContractSDKParams, WithSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk from "algosdk";

const assetCreateCost = 100_000 // This is the cost for asset creation, adjust as necessary

type ContractArgs = TokenMintPluginArgs["obj"];

type MintArgs = (
  Omit<ContractArgs['mint(uint64,bool,string,string,uint64,uint64,address,address,address,address,bool,string,pay)uint64'], 'walletId' | 'rekeyBack' | 'mbrPayment'>
  & WithSigner
  & { rekeyBack?: boolean }
);

export class TokenMintPluginSDK extends BaseSDK<TokenMintPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: TokenMintPluginFactory, ...params });
  }

  mint(): PluginSDKReturn;
  mint(args: MintArgs): PluginSDKReturn;
  mint(args?: MintArgs): PluginSDKReturn {
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return {
        selector: this.client.appClient.getABIMethod('mint').getSelector(),
        getTxns: async ({}: PluginHookParams) => { return [] }
      };
    }

    return {
      selector: this.client.appClient.getABIMethod('mint').getSelector(),
      getTxns: async ({ walletId }: PluginHookParams) => {

      const rekeyBack = args.rekeyBack ?? true;

      const mbrPayment = this.client.algorand.createTransaction.payment({
        sender: args.sender,
        amount: new AlgoAmount({ microAlgos: assetCreateCost }),
        receiver: algosdk.getApplicationAddress(walletId)
      })

      return (
        await this.client.createTransaction.mint({
          args: { walletId, ...args, rekeyBack, mbrPayment },
          ...this.sendParams
        })
      ).transactions
    }
  }
  }
}