

import { RevenueManagerPluginSDK } from 'akita-sdk';
import { RevenueManagerPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/revenue-manager/RevenueManagerPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount

export const deployRevenueManagerPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<RevenueManagerPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    RevenueManagerPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  return new RevenueManagerPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};