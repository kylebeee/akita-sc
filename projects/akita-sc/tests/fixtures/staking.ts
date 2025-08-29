import { StakingArgs, StakingClient, StakingFactory } from '../../smart_contracts/artifacts/staking/StakingClient'
import { FixtureAndAccount } from '../types';

type CreateArgs = StakingArgs["obj"]['create(string,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployStaking = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
  }
}: DeployParams): Promise<StakingClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    StakingFactory,
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

  console.log('Staking deployed with appId:', client.appId);

  return client;
};