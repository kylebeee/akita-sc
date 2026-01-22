import { setCurrentNetwork } from 'akita-sdk';
import { SocialPluginSDK } from 'akita-sdk/wallet';
import { AkitaSocialPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/social/AkitaSocialPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    version: string;
    akitaDao: bigint;
    escrow: bigint;
  }
}

export const deploySocialPlugin = async ({ fixture, sender, signer, args: { version, akitaDao, escrow } }: DeployParams): Promise<SocialPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    AkitaSocialPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      version,
      akitaDao,
      escrow,
    }
  })

  console.log('SocialPlugin deployed with appId:', client.appId);

  return new SocialPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
