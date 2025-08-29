import { GateSDK } from 'akita-sdk';
import { AssetGateArgs, AssetGateClient, AssetGateFactory } from '../../../../smart_contracts/artifacts/gates/sub-gates/asset/AssetGateClient'
import { FixtureAndAccount } from '../../../types';

type CreateArgs = AssetGateArgs["obj"]["create(string,uint64)void"]
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployAssetGate = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    version = '0.0.1',
  }
}: DeployParams): Promise<AssetGateClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    AssetGateFactory,
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

  return client
};