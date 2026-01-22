import { setCurrentNetwork } from 'akita-sdk';
import { StakingPoolPluginSDK } from 'akita-sdk/wallet';
import { StakingPoolPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/staking-pool/StakingPoolPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    version: string;
    factory: bigint;
    akitaDao: bigint;
  }
}

export const deployStakingPoolPlugin = async ({ fixture, sender, signer, args: { version, factory, akitaDao } }: DeployParams): Promise<StakingPoolPluginSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factoryClient = algorand.client.getTypedAppFactory(
    StakingPoolPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factoryClient.send.create.create({
    args: {
      version,
      factory,
      akitaDao
    }
  })

  console.log('StakingPoolPlugin deployed with appId:', client.appId);

  return new StakingPoolPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
