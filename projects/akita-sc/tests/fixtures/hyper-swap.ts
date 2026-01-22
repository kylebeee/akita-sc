import { HyperSwapSDK, setCurrentNetwork } from 'akita-sdk';
import { HyperSwapFactory } from '../../smart_contracts/artifacts/hyper-swap/HyperSwapClient';
import { FixtureAndAccount } from '../types';

export type DeployHyperSwapParams = FixtureAndAccount & {
  args: {
    version: string;
    akitaDao: bigint;
  };
};

export const deployHyperSwap = async ({
  fixture,
  sender,
  signer,
  args,
}: DeployHyperSwapParams): Promise<HyperSwapSDK> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(HyperSwapFactory, {
    defaultSender: sender,
    defaultSigner: signer,
  });

  const results = await factory.send.create.create({
    args: {
      version: args.version,
      akitaDao: args.akitaDao,
    },
  });

  const client = results.appClient;

  return new HyperSwapSDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    },
  });
};
