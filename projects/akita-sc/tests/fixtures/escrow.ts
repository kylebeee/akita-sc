import { EscrowFactoryClient, EscrowFactoryFactory } from '../../smart_contracts/artifacts/escrow/EscrowFactoryClient'
import { FixtureAndAccount } from '../types';

export const deployEscrowFactory = async ({ fixture, sender, signer }: FixtureAndAccount): Promise<EscrowFactoryClient> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    EscrowFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.deploy({
    onUpdate: 'append',
    onSchemaBreak: 'append',
  })

  await client.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

  return client;
};