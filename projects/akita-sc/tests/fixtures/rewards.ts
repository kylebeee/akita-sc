import { RewardsArgs, RewardsClient, RewardsFactory } from '../../smart_contracts/artifacts/rewards/RewardsClient'
import { FixtureAndAccount } from '../types';

type CreateArgs = RewardsArgs["obj"]['create(string,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployRewards = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
  }
}: DeployParams): Promise<RewardsClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    RewardsFactory,
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

  console.log('Rewards deployed with appId:', client.appId);

  return client;
};