import { setCurrentNetwork } from 'akita-sdk';
import { AuctionPluginSDK } from 'akita-sdk/wallet';
import { AuctionPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/auction/AuctionPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    version: string;
    factory: bigint;
    akitaDao: bigint;
  }
}

export const deployAuctionPlugin = async ({ fixture, sender, signer, args: { version, factory, akitaDao } }: DeployParams): Promise<AuctionPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    AuctionPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      version,
      factory,
      akitaDao,
    }
  })

  console.log('AuctionPlugin deployed with appId:', client.appId);

  return new AuctionPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
