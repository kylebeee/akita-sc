import { AsaMintPluginSDK } from 'akita-sdk/wallet';
import { AsaMintPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/asa-mint/AsaMintPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount

export const deployAsaMintPlugin = async ({ fixture, sender, signer }: DeployParams): Promise<AsaMintPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    AsaMintPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  console.log('AsaMintPlugin deployed with appId:', client.appId);

  return new AsaMintPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};