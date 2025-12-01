import { StakingPoolFactorySDK } from 'akita-sdk';
import { StakingPoolFactoryArgs, StakingPoolFactoryFactory } from '../../smart_contracts/artifacts/staking-pool/StakingPoolFactoryClient';
import { FixtureAndAccount } from '../types';

type CreateArgs = StakingPoolFactoryArgs["obj"]['create(string,string,uint64,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployStakingPoolFactory = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    akitaDaoEscrow,
    version = '0.0.1',
    childVersion = '0.0.1',
  }
}: DeployParams): Promise<StakingPoolFactorySDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    StakingPoolFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  if (akitaDaoEscrow === undefined) {
    throw new Error('akitaDaoEscrow is required to deploy Staking Pool Factory')
  }

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      akitaDaoEscrow,
      version,
      childVersion,
    }
  })

  return new StakingPoolFactorySDK({ algorand, factoryParams: { appId: client.appId } });
};