import { NFDPluginSDK } from 'akita-sdk/wallet';
import { NfdPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/nfd/NFDPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args?: {
    registry?: bigint;
  }
}

export const deployNFDPlugin = async ({ fixture, sender, signer, args }: DeployParams): Promise<NFDPluginSDK> => {
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    NfdPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const registry = args?.registry ?? 0n;

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      registry,
    }
  })

  console.log('NFDPlugin deployed with appId:', client.appId);

  return new NFDPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
