import { MarketplacePluginSDK } from 'akita-sdk/wallet';
import { MarketplacePluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/marketplace/MarketplacePluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args?: {
    version?: string;
    factory: bigint;
    akitaDao: bigint;
  }
}

export const deployMarketplacePlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<MarketplacePluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    MarketplacePluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
    createParams: {
      method: 'createApplication',
      args: {
        version: args?.version ?? '0.0.1',
        factory: args?.factory ?? 0n,
        akitaDao: args?.akitaDao ?? 0n,
      }
    }
  })

  console.log('MarketplacePlugin deployed with appId:', client.appId);

  return new MarketplacePluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
