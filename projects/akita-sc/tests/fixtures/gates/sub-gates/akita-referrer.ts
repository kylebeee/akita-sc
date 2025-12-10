import { AkitaReferrerGateArgs, AkitaReferrerGateClient, AkitaReferrerGateFactory } from '../../../../smart_contracts/artifacts/gates/sub-gates/akita-referrer/AkitaReferrerGateClient';
import { FixtureAndAccount } from '../../../types';

type CreateArgs = AkitaReferrerGateArgs['obj']['create(string,uint64)void'];
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> };

export const deployAkitaReferrerGate = async ({
  fixture,
  sender,
  signer,
  args: { akitaDao = 0n, version = '0.0.1' },
}: DeployParams): Promise<AkitaReferrerGateClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(AkitaReferrerGateFactory, {
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

