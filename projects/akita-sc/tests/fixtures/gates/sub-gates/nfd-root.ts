import { NfdRootGateArgs, NfdRootGateClient, NfdRootGateFactory } from '../../../../smart_contracts/artifacts/gates/sub-gates/nfd-root/NFDRootGateClient';
import { FixtureAndAccount } from '../../../types';

type CreateArgs = NfdRootGateArgs['obj']['create(string,uint64)void'];
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> };

export const deployNFDRootGate = async ({
  fixture,
  sender,
  signer,
  args: { akitaDao = 0n, version = '0.0.1' },
}: DeployParams): Promise<NfdRootGateClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(NfdRootGateFactory, {
    defaultSender: sender,
    defaultSigner: signer,
  });

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version,
    },
  });

  await client.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

  return client;
};

