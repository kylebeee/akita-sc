import { BaseSDK } from "../../base";
import { AsaMintPluginArgs, AsaMintPluginClient, AsaMintPluginFactory } from "../../generated/AsaMintPluginClient";
import { hasSenderSigner, NewContractSDKParams, MaybeSigner } from "../../types";
import { PluginHookParams, PluginSDKReturn } from "../../types";
import algosdk, { Address } from "algosdk";
import { microAlgo } from "@algorandfoundation/algokit-utils";
import { getTxns } from "../utils";

const assetCreateCost = 100_000

type CreateAssetParams = {
  assetName: string,
  unitName: string,
  total: bigint | number,
  decimals: bigint | number,
  manager: string,
  reserve: string,
  freeze: string,
  clawback: string,
  defaultFrozen: boolean,
  url: string,
}

type ContractArgs = AsaMintPluginArgs["obj"];

type MintArgs = (
  Omit<ContractArgs['mint(uint64,bool,(string,string,uint64,uint64,address,address,address,address,bool,string)[],pay)uint64[]'], 'wallet' | 'rekeyBack' | 'assets' | 'mbrPayment'>
  & MaybeSigner
  & {
    rekeyBack?: boolean
    assets: CreateAssetParams[]
  }
);

export class AsaMintPluginSDK extends BaseSDK<AsaMintPluginClient> {

  constructor(params: NewContractSDKParams) {
    super({ factory: AsaMintPluginFactory, ...params });
  }

  mint(): PluginSDKReturn;
  mint(args: MintArgs): PluginSDKReturn;
  mint(args?: MintArgs): PluginSDKReturn {
    const methodName = 'mint';
    if (args === undefined) {
      // Called without arguments - return selector for method restrictions
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
        getTxns
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
      selectors: [this.client.appClient.getABIMethod(methodName).getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {

        const rekeyBack = args.rekeyBack ?? true;

        const mbrPayment = this.client.algorand.createTransaction.payment({
          ...sendParams,
          amount: microAlgo(assetCreateCost * assets.length),
          receiver: spendingAddress ? spendingAddress : algosdk.getApplicationAddress(wallet),
        })

        const assetsTuple = assets.map(asset => [
          asset.assetName,
          asset.unitName,
          asset.total,
          asset.decimals,
          asset.manager,
          asset.reserve,
          asset.freeze,
          asset.clawback,
          asset.defaultFrozen,
          asset.url,
        ] as [string, string, bigint | number, bigint | number, string, string, string, string, boolean, string])

        const params = (
          await this.client.params.mint({
            ...sendParams,
            args: { wallet, assets: assetsTuple, rekeyBack, mbrPayment },
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