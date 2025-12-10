import { MerkleAddressGateArgs, MerkleAddressGateClient, MerkleAddressGateFactory } from '../../../../smart_contracts/artifacts/gates/sub-gates/merkle-address/MerkleAddressGateClient';
import { FixtureAndAccount } from '../../../types';

type CreateArgs = MerkleAddressGateArgs['obj']['create(string,uint64,string,string)void'];
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> };

export const deployMerkleAddressGate = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
    registrationShape = '(address,string)',
    checkShape = 'byte[32][]',
  },
}: DeployParams): Promise<MerkleAddressGateClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(MerkleAddressGateFactory, {
    defaultSender: sender,
    defaultSigner: signer,
  });

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      version,
      registrationShape,
      checkShape,
    },
  });

  await client.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

  return client;
};

