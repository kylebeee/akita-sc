import { RewardsPluginSDK } from 'akita-sdk/wallet';
import { RewardsPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/rewards/RewardsPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    akitaDao: bigint;
    version: string;
  }
}

export const deployRewardsPlugin = async ({ fixture, sender, signer, args: { akitaDao, version } }: DeployParams): Promise<RewardsPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    RewardsPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version,
    }
  })

  console.log('RewardsPlugin deployed with appId:', client.appId);

  return new RewardsPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
