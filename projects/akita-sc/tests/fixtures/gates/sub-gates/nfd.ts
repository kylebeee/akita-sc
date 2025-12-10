import { NfdGateArgs, NfdGateClient, NfdGateFactory } from '../../../../smart_contracts/artifacts/gates/sub-gates/nfd/NFDGateClient';
import { FixtureAndAccount } from '../../../types';

type CreateArgs = NfdGateArgs['obj']['create(string,uint64)void'];
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> };

export const deployNFDGate = async ({
  fixture,
  sender,
  signer,
  args: { akitaDao = 0n, version = '0.0.1' },
}: DeployParams): Promise<NfdGateClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(NfdGateFactory, {
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

