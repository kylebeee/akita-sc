

import { PayPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/pay/PayPluginClient';
import { FixtureAndAccount } from '../../types';
import { PayPluginSDK } from 'akita-sdk'

type DeployParams = FixtureAndAccount

export const deployPayPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<PayPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    PayPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  console.log('PayPlugin deployed with appId:', client.appId);

  return new PayPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};