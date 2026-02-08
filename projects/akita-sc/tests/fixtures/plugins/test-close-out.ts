import { TestCloseOutPluginFactory, TestCloseOutPluginClient } from '../../../smart_contracts/artifacts/arc58/plugins/test-close-out/TestCloseOutPluginClient';
import { FixtureAndAccount } from '../../types';
import { PluginSDKReturn, PluginHookParams, AkitaSDK } from 'akita-sdk';
import { Address } from 'algosdk';
import { microAlgo } from '@algorandfoundation/algokit-utils';
import { AlgorandClient } from '@algorandfoundation/algokit-utils/types/algorand-client';
import { SendParams } from '@algorandfoundation/algokit-utils/types/transaction';

type DeployParams = FixtureAndAccount

type CloseOutAssetArgs = {
  asset: bigint;
  receiver: string;
  assetCloseTo: string;
  rekeyBack?: boolean;
};

type CloseOutAlgoArgs = {
  receiver: string;
  amount: bigint;
  closeTo: string;
  rekeyBack?: boolean;
};

const DEFAULT_READER = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
const DEFAULT_SEND_PARAMS: SendParams = {};

export class TestCloseOutPluginSDK implements AkitaSDK<TestCloseOutPluginClient> {
  client: TestCloseOutPluginClient;
  algorand: AlgorandClient;
  readerAccount: string = DEFAULT_READER;
  sendParams: SendParams = DEFAULT_SEND_PARAMS;

  constructor(client: TestCloseOutPluginClient, algorand: AlgorandClient) {
    this.client = client;
    this.algorand = algorand;
  }

  get appId(): bigint {
    return this.client.appId;
  }

  setReaderAccount(readerAccount: string): void {
    this.readerAccount = readerAccount;
  }

  setSendParams(sendParams: SendParams): void {
    this.sendParams = sendParams;
  }

  closeOutAsset(): PluginSDKReturn;
  closeOutAsset(args: CloseOutAssetArgs): PluginSDKReturn;
  closeOutAsset(args?: CloseOutAssetArgs): PluginSDKReturn {
    const methodName = 'closeOutAsset';
    
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
        getTxns: async () => []
      });
    }

    const { asset, receiver, assetCloseTo, rekeyBack = true } = args;

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const params = await this.client.params.closeOutAsset({
          args: { wallet, rekeyBack, asset, receiver, assetCloseTo },
          maxFee: (10_000).microAlgo(),
        });

        return [{
          type: 'methodCall' as const,
          ...params
        }];
      }
    });
  }

  closeOutAlgo(): PluginSDKReturn;
  closeOutAlgo(args: CloseOutAlgoArgs): PluginSDKReturn;
  closeOutAlgo(args?: CloseOutAlgoArgs): PluginSDKReturn {
    const methodName = 'closeOutAlgo';
    
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
        getTxns: async () => []
      });
    }

    const { receiver, amount, closeTo, rekeyBack = true } = args;

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const params = await this.client.params.closeOutAlgo({
          args: { wallet, rekeyBack, receiver, amount, closeTo },
          maxFee: (10_000).microAlgo(),
        });

        return [{
          type: 'methodCall' as const,
          ...params
        }];
      }
    });
  }
}

export const deployTestCloseOutPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<TestCloseOutPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    TestCloseOutPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  );

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  });

  console.log('TestCloseOutPlugin deployed with appId:', client.appId);

  return new TestCloseOutPluginSDK(client, algorand);
};
