import { TokenMintPluginClient, TokenMintPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/token-mint/TokenMintPluginClient'
import { FixtureAndAccount } from '../../types';
import { TokenMintPluginSDK } from 'akita-sdk'

export const deployTokenMintPlugin = async ({ fixture, sender, signer }: FixtureAndAccount): Promise<TokenMintPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    TokenMintPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  return new TokenMintPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};