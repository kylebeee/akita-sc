import { SubscriptionsPluginSDK } from 'akita-sdk/wallet';
import { SubscriptionsPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/subscriptions/SubscriptionsPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args?: {
    akitaDao: bigint;
    version?: string;
  }
}

export const deploySubscriptionsPlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<SubscriptionsPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    SubscriptionsPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
    createParams: {
      method: 'create',
      args: {
        akitaDao: args?.akitaDao ?? 0n,
        version: args?.version ?? '0.0.1',
      }
    }
  })

  console.log('SubscriptionsPlugin deployed with appId:', client.appId);

  return new SubscriptionsPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};