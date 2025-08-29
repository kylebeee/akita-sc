import { GateSDK } from 'akita-sdk';
import { GateArgs, GateFactory } from '../../../smart_contracts/artifacts/gates/GateClient'
import { FixtureAndAccount } from '../../types';

type CreateArgs = GateArgs["obj"]["create(string,uint64)void"]
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployGate = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
  }
}: DeployParams): Promise<GateSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    GateFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version
    }
  })

  await client.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

  return new GateSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
};