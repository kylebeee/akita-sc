import { setCurrentNetwork } from 'akita-sdk';
import { StakingPluginSDK } from 'akita-sdk/wallet';
import { StakingPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/staking/StakingPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    akitaDao: bigint;
    version: string;
  }
}

export const deployStakingPlugin = async ({ fixture, sender, signer, args: { akitaDao, version } }: DeployParams): Promise<StakingPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    StakingPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      akitaDao,
      version,
    }
  })

  console.log('StakingPlugin deployed with appId:', client.appId);

  return new StakingPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
