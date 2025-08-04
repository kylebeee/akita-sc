import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { BaseSDK } from "../../base";
import { TokenMintPluginArgs, TokenMintPluginClient, TokenMintPluginFactory } from "../../generated/TokenMintPluginClient";
import { hasSenderSigner, NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk from "algosdk";

const assetCreateCost = 100_000 // This is the cost for asset creation, adjust as necessary

type ContractArgs = TokenMintPluginArgs["obj"];

type MintArgs = (
  Omit<ContractArgs['mint(uint64,bool,string,string,uint64,uint64,address,address,address,address,bool,string,pay)uint64'], 'walletId' | 'rekeyBack' | 'mbrPayment'>
  & MaybeSigner
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
      return () => ({
        appId: this.client.appId,
        selector: this.client.appClient.getABIMethod('mint').getSelector(),
        getTxns: async ({ }: PluginHookParams) => { return [] }
      });
    }

    const { sender, signer } = args;

    const sendParams = {
      ...this.sendParams,
      ...(sender !== undefined && { sender }),
      ...(signer !== undefined && { signer })
    }

    console.log('sendParams:', sendParams);

    if (!hasSenderSigner(sendParams)) {
      throw new Error('Sender and signer must be provided either explicitly or through defaults at sdk instantiation');
    }

    return () => ({
      appId: this.client.appId,
      selector: this.client.appClient.getABIMethod('mint').getSelector(),
      getTxns: async ({ walletId }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: new AlgoAmount({ microAlgos: assetCreateCost }),
          receiver: algosdk.getApplicationAddress(walletId),
        })

        console.log('sendParams in getTxns:', sendParams);

        return (
          await this.client.createTransaction.mint({
            ...sendParams,
            args: { walletId, ...args, rekeyBack, mbrPayment },
          })
        ).transactions
      }
    });
  }
}