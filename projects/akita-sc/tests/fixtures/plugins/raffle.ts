import { RafflePluginSDK } from 'akita-sdk/wallet';
import { RafflePluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/raffle/RafflePluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    version: string;
    factory: bigint;
  }
}

export const deployRafflePlugin = async ({ fixture, sender, signer, args: { version, factory } }: DeployParams): Promise<RafflePluginSDK> => {
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    RafflePluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      version,
      factory: factory,
    }
  })

  console.log('RafflePlugin deployed with appId:', client.appId);

  return new RafflePluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
