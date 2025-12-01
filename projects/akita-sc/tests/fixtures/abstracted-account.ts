import { WalletFactorySDK } from 'akita-sdk';
import { AbstractedAccountFactory } from '../../smart_contracts/artifacts/arc58/account/AbstractedAccountClient';
import { AbstractedAccountFactoryArgs, AbstractedAccountFactoryFactory } from '../../smart_contracts/artifacts/arc58/account/AbstractedAccountFactoryClient';
import { FixtureAndAccount } from '../types';

type CreateArgs = AbstractedAccountFactoryArgs["obj"]['create(uint64,uint64,string,uint64,uint64,string)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployAbstractedAccountFactory = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    akitaDaoEscrow = 0n,
    version = '0.0.1',
    escrowFactory = 0n,
    revocation = 0n,
    domain = 'akita.community'
  }
}: DeployParams): Promise<WalletFactorySDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    AbstractedAccountFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      akitaDaoEscrow,
      version,
      escrowFactory,
      revocation,
      domain
    },
    extraProgramPages: 3
  })

  const fundAmount = (
    100_000 + // min balance
    3_280_100 // boxed contract storage
  )

  await client.appClient.fundAppAccount({ amount: fundAmount.microAlgos() });

  const abstractedAccountFactory = algorand.client.getTypedAppFactory(
    AbstractedAccountFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  const compiledAbstractedAccount = await abstractedAccountFactory.appFactory.compile();
  const size = compiledAbstractedAccount.approvalProgram.length;
  const perTxn = (
    2048 // max args
    - 4 // selector
    - 8 // offset
    - 4 // dynamic byte array header
  );
  const uploadCount = 1 + Math.floor(size / perTxn);

  const initParams = await client.params.initBoxedContract({ args: { version: '0.0.1', size } });
  let loadParams = []
  for (let i = 0; i < uploadCount; i++) {
    const chunk = compiledAbstractedAccount.approvalProgram.slice(
      i * perTxn,
      (i + 1) * perTxn,
    );

    loadParams.push(await client.params.loadBoxedContract({ args: { offset: (i * perTxn), data: chunk } }));
  }

  const composer = await client.newGroup().composer()

  composer.addAppCallMethodCall(initParams)
  for (let i = 0; i < loadParams.length; i++) {
    composer.addAppCallMethodCall(loadParams[i])
  }

  await composer.send()

  return new WalletFactorySDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
};