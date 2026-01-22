import { setCurrentNetwork } from 'akita-sdk';
import { PollPluginSDK } from 'akita-sdk/wallet';
import { PollPluginContractFactory } from '../../../smart_contracts/artifacts/arc58/plugins/poll/PollPluginContractClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    version: string;
    factory: bigint;
    akitaDao: bigint;
  }
}

export const deployPollPlugin = async ({ fixture, sender, signer, args: { version, factory, akitaDao } }: DeployParams): Promise<PollPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    PollPluginContractFactory,
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

  console.log('PollPlugin deployed with appId:', client.appId);

  return new PollPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
