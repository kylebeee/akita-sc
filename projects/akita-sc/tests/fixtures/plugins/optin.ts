

import { OptInPluginSDK } from 'akita-sdk/wallet';
import { OptInPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/optin/OptInPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount

export const deployOptInPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<OptInPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    OptInPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  console.log('OptInPlugin deployed with appId:', client.appId);

  return new OptInPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};