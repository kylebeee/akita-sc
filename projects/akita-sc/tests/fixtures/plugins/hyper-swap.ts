import { HyperSwapPluginSDK } from 'akita-sdk/wallet';
import { HyperSwapPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/hyper-swap/HyperSwapPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    akitaDao: bigint;
    version: string;
  }
}

export const deployHyperSwapPlugin = async ({ fixture, sender, signer, args: { akitaDao, version } }: DeployParams): Promise<HyperSwapPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(HyperSwapPluginFactory, {
    defaultSender: sender,
    defaultSigner: signer,
  });

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version,
    }
  });

  console.log('HyperSwapPlugin deployed with appId:', client.appId);

  return new HyperSwapPluginSDK({
    algorand,
    factoryParams: { appId: client.appId },
  });
};
