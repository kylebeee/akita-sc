import { SubscriptionsSDK } from 'akita-sdk/subscriptions';
import { SubscriptionsArgs, SubscriptionsFactory } from '../../smart_contracts/artifacts/subscriptions/SubscriptionsClient';
import { FixtureAndAccount } from '../types';

type CreateArgs = SubscriptionsArgs["obj"]['create(string,uint64,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deploySubscriptions = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
    akitaDaoEscrow,
  }
}: DeployParams): Promise<SubscriptionsSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    SubscriptionsFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  if (akitaDaoEscrow === undefined) {
    throw new Error('akitaDaoEscrow is required to deploy Subscriptions')
  }

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      akitaDaoEscrow,
      version,
    }
  })

  return new SubscriptionsSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer
    }
  });
};