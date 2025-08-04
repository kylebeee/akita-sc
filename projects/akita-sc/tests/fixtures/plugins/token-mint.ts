import { TokenMintPluginArgs } from 'akita-sdk/dist/esm/generated/TokenMintPluginClient';
import { TokenMintPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/token-mint/TokenMintPluginClient'
import { FixtureAndAccount } from '../../types';
import { TokenMintPluginSDK } from 'akita-sdk'

export type CreateArgs = TokenMintPluginArgs["obj"]['create(uint64,string)void']
type DeployParams = FixtureAndAccount & { args?: CreateArgs }

export const tokenMintTestArgs: CreateArgs = {
  version: '0.0.1',
  akitaDao: 0n,
}

export const deployTokenMintPlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<TokenMintPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    TokenMintPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  if (!args) {
    args = tokenMintTestArgs;
  }

  const { appClient: client } = await factory.send.create.create({ args })

  console.log('TokenMintPlugin deployed with appId:', client.appId);

  return new TokenMintPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};