import { RevenueManagerPluginSDK } from 'akita-sdk/wallet';
import { RevenueManagerPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/revenue-manager/RevenueManagerPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    akitaDao: bigint;
    version: string;
  }
}

export const deployRevenueManagerPlugin = async ({ fixture, sender, signer, args: { akitaDao, version } }: DeployParams): Promise<RevenueManagerPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    RevenueManagerPluginFactory,
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

  console.log('RevenueManagerPlugin deployed with appId:', client.appId);

  return new RevenueManagerPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
