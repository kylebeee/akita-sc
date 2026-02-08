import { TestProxyRekeyPluginFactory, TestProxyRekeyPluginClient } from '../../../smart_contracts/artifacts/arc58/plugins/test-proxy-rekey/TestProxyRekeyPluginClient';
import { FixtureAndAccount } from '../../types';
import { PluginSDKReturn, PluginHookParams, AkitaSDK } from 'akita-sdk';
import { Address } from 'algosdk';
import { AlgorandClient } from '@algorandfoundation/algokit-utils/types/algorand-client';
import { SendParams } from '@algorandfoundation/algokit-utils/types/transaction';

type DeployParams = FixtureAndAccount

type ProxyPayArgs = {
  payPlugin: bigint;
  receiver: string;
  asset: bigint;
  amount: bigint;
  rekeyBack?: boolean;
};

const DEFAULT_READER = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
const DEFAULT_SEND_PARAMS: SendParams = {};

export class TestProxyRekeyPluginSDK implements AkitaSDK<TestProxyRekeyPluginClient> {
  client: TestProxyRekeyPluginClient;
  algorand: AlgorandClient;
  readerAccount: string = DEFAULT_READER;
  sendParams: SendParams = DEFAULT_SEND_PARAMS;

  constructor(client: TestProxyRekeyPluginClient, algorand: AlgorandClient) {
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

  proxyPay(): PluginSDKReturn;
  proxyPay(args: ProxyPayArgs): PluginSDKReturn;
  proxyPay(args?: ProxyPayArgs): PluginSDKReturn {
    const methodName = 'proxyPay';
    
    if (args === undefined) {
      return (spendingAddress?: Address | string) => ({
        appId: this.client.appId,
        selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
        getTxns: async () => []
      });
    }

    const { payPlugin, receiver, asset, amount, rekeyBack = true } = args;

    return (spendingAddress?: Address | string) => ({
      appId: this.client.appId,
      selectors: [this.client.appClient.getABIMethod(methodName)!.getSelector()],
      getTxns: async ({ wallet }: PluginHookParams) => {
        const params = await this.client.params.proxyPay({
          args: { wallet, rekeyBack, payPlugin, receiver, asset, amount },
        });

        return [{
          type: 'methodCall' as const,
          ...params
        }];
      }
    });
  }
}

export const deployTestProxyRekeyPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<TestProxyRekeyPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    TestProxyRekeyPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  );

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  });

  console.log('TestProxyRekeyPlugin deployed with appId:', client.appId);

  return new TestProxyRekeyPluginSDK(client, algorand);
};
