import { StakingPoolFactorySDK } from 'akita-sdk';
import { StakingPoolFactory } from '../../smart_contracts/artifacts/staking-pool/StakingPoolClient';
import { StakingPoolFactoryArgs, StakingPoolFactoryFactory } from '../../smart_contracts/artifacts/staking-pool/StakingPoolFactoryClient';
import { FixtureAndAccount } from '../types';

type CreateArgs = StakingPoolFactoryArgs["obj"]['create(string,string,uint64,uint64)void']
type DeployParams = FixtureAndAccount & { args: Partial<CreateArgs> }

export const deployStakingPoolFactory = async ({
  fixture,
  sender,
  signer,
  args: {
    akitaDao = 0n,
    akitaDaoEscrow,
    version = '0.0.1',
    childVersion = '0.0.1',
  }
}: DeployParams): Promise<StakingPoolFactorySDK> => {
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(
    StakingPoolFactoryFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  if (akitaDaoEscrow === undefined) {
    throw new Error('akitaDaoEscrow is required to deploy Staking Pool Factory')
  }

  const { appClient: client } = await factory.send.create.create({
    args: {
      akitaDao,
      akitaDaoEscrow,
      version,
      childVersion,
    },
    extraProgramPages: 3
  })

  // Get the StakingPool contract factory to compile it
  const stakingPoolFactory = algorand.client.getTypedAppFactory(
    StakingPoolFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  )

  // Compile the staking pool contract to get the approval program
  const compiledStakingPool = await stakingPoolFactory.appFactory.compile();
  const approvalProgramSize = compiledStakingPool.approvalProgram.length;

  // Calculate box storage cost: 2500 + 400 * (key_length + value_length)
  // Key is "bc" (2 bytes), value is the approval program
  const boxStorageCost = 2500 + 400 * (2 + approvalProgramSize);

  const fundAmount = (
    100_000 + // min balance
    boxStorageCost // boxed contract storage
  )

  await client.appClient.fundAppAccount({ amount: fundAmount.microAlgos() });

  // Calculate chunk parameters for loading the approval program
  const perTxn = (
    2048 // max args
    - 4 // selector
    - 8 // offset
    - 4 // dynamic byte array header
  );
  const uploadCount = 1 + Math.floor(approvalProgramSize / perTxn);

  // Create params for init and load calls
  const initParams = await client.params.initBoxedContract({ args: { version: childVersion, size: approvalProgramSize } });
  const loadParams = []
  for (let i = 0; i < uploadCount; i++) {
    const chunk = compiledStakingPool.approvalProgram.slice(
      i * perTxn,
      (i + 1) * perTxn,
    );

    loadParams.push(await client.params.loadBoxedContract({ args: { offset: (i * perTxn), data: chunk } }));
  }

  // Execute init and load calls in a single group
  const composer = await client.newGroup().composer()

  composer.addAppCallMethodCall(initParams)
  for (let i = 0; i < loadParams.length; i++) {
    composer.addAppCallMethodCall(loadParams[i])
  }

  await composer.send()

  return new StakingPoolFactorySDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    }
  });
};
