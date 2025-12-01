import { UpdateAkitaDAOPluginSDK } from 'akita-sdk';
import { UpdateAkitaDaoPluginFactory } from '../../../smart_contracts/artifacts/arc58/plugins/update-akita-dao/UpdateAkitaDAOPluginClient';
import { FixtureAndAccount } from '../../types';

type DeployParams = FixtureAndAccount & {
  args: {
    akitaDao: bigint;
  }
}

export const deployUpdateAkitaDaoPlugin = async ({ fixture, sender, signer, args: { akitaDao } }: DeployParams): Promise<UpdateAkitaDAOPluginSDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    UpdateAkitaDaoPluginFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  // Get a clear program to use (minimal clear program - version 11)
  const clearProgram = new Uint8Array([0x0b]); // #pragma version 11

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      clearProgram,
    }
  })

  // Fund the plugin for box storage
  // The boxed contract box needs space for a compiled contract (~8KB typical)
  const boxSize = 8192; // 8KB placeholder
  const boxMbr = 2500 + (400 * boxSize); // Base MBR + per-byte cost

  await client.appClient.fundAppAccount({
    amount: (boxMbr + 100_000).microAlgos(), // Extra for min balance
  });

  return new UpdateAkitaDAOPluginSDK({ algorand, factoryParams: { appId: client.appId } });
};
