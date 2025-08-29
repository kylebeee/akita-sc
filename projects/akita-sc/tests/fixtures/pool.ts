import { PoolFactoryArgs, PoolFactoryClient, PoolFactoryFactory } from '../../smart_contracts/artifacts/pool/PoolFactoryClient'
import { FixtureAndAccount } from '../types';

type CreateArgs = PoolFactoryArgs["obj"]['create(string,string,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployStakingPoolFactory = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
    childVersion = '0.0.1',
  }
}: DeployParams): Promise<PoolFactoryClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    PoolFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version,
      childVersion,
    }
  })

  console.log('Staking Pool Factory deployed with appId:', client.appId);

  return client;
};