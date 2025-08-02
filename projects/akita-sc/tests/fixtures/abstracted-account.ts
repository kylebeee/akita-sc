import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryClient, AbstractedAccountFactoryFactory } from '../../smart_contracts/artifacts/arc58/account/AbstractedAccountFactoryClient'
import { EscrowFactoryClient } from '../../smart_contracts/artifacts/escrow/EscrowFactoryClient';
import { FixtureAndAccount } from '../types';
import { WalletFactorySDK } from 'akita-sdk'
import { deployEscrowFactory } from './escrow';

type CreateArgs = AbstractedAccountFactoryArgs["obj"]["create(uint64,string,string,uint64,uint64)void"]
type DeployParams = FixtureAndAccount & { args: CreateArgs }

const abstractedAccountFactoryTestArgs: CreateArgs = {
  akitaDao: 0n,
  version: '0.0.1',
  childVersion: '0.0.1',
  escrowFactoryApp: 0n,
  revocationApp: 0n,
}

export const deployAbstractedAccountFactory = async ({ fixture, sender, signer, args }: DeployParams): Promise<WalletFactorySDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    AbstractedAccountFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({ args })

  await client.appClient.fundAppAccount({ amount: (100_000).microAlgos() });

  return new WalletFactorySDK({ algorand, appId: client.appId });
};

export const deployAbstractedAccountFactoryAndEscrowFactory = async ({ fixture, sender, signer }: Omit<DeployParams, 'args'>): Promise<{ aaFactory: WalletFactorySDK; eFactory: EscrowFactoryClient }> => {
  const eFactory = await deployEscrowFactory({ fixture, sender, signer });
  const args = { ...abstractedAccountFactoryTestArgs, escrowFactoryApp: eFactory.appId };
  const aaFactory = await deployAbstractedAccountFactory({ fixture, sender, signer, args });

  return { aaFactory, eFactory };
};