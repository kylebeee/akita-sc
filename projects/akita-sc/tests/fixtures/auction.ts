import { setCurrentNetwork } from 'akita-sdk';
import { AuctionFactorySDK } from 'akita-sdk/auction';
import { FixtureAndAccount } from '../types';
import { AuctionFactoryClient, AuctionFactoryFactory } from '../../smart_contracts/artifacts/auction/AuctionFactoryClient';
import { AuctionFactory } from '../../smart_contracts/artifacts/auction/AuctionClient';

export type DeployAuctionFactoryParams = FixtureAndAccount & {
  args: {
    version: string;
    childVersion: string;
    akitaDao: bigint;
    akitaDaoEscrow: bigint;
  };
};

export const deployAuctionFactory = async ({
  fixture,
  sender,
  signer,
  args,
}: DeployAuctionFactoryParams): Promise<{ client: AuctionFactoryClient; sdk: AuctionFactorySDK }> => {
  // Ensure network is set for SDK initialization (fixtures are always localnet)
  setCurrentNetwork('localnet');
  
  const { algorand } = fixture.context;

  const factory = algorand.client.getTypedAppFactory(AuctionFactoryFactory, {
    defaultSender: sender,
    defaultSigner: signer,
  });

  const results = await factory.send.create.create({
    args: {
      version: args.version,
      childVersion: args.childVersion,
      akitaDao: args.akitaDao,
      akitaDaoEscrow: args.akitaDaoEscrow,
    },
  });

  const client = results.appClient;

  // Fund the factory for box storage
  const fundAmount = (
    100_000 + // min balance
    3_280_100 // boxed contract storage (same as abstracted account factory)
  );

  await client.appClient.fundAppAccount({ amount: fundAmount.microAlgos() });

  // Compile the Auction contract to get its approval program
  const auctionFactory = algorand.client.getTypedAppFactory(
    AuctionFactory,
    {
      defaultSender: sender,
      defaultSigner: signer,
    }
  );

  const compiledAuction = await auctionFactory.appFactory.compile();
  const size = compiledAuction.approvalProgram.length;
  const perTxn = (
    2048 // max args
    - 4 // selector
    - 8 // offset
    - 4 // dynamic byte array header
  );
  const uploadCount = 1 + Math.floor(size / perTxn);

  // Initialize the box and load the contract in chunks
  const initParams = await client.params.initBoxedContract({ args: { version: args.childVersion, size } });
  let loadParams = [];
  for (let i = 0; i < uploadCount; i++) {
    const chunk = compiledAuction.approvalProgram.slice(
      i * perTxn,
      (i + 1) * perTxn,
    );

    loadParams.push(await client.params.loadBoxedContract({ args: { offset: (i * perTxn), data: chunk } }));
  }

  const composer = await client.newGroup().composer();

  composer.addAppCallMethodCall(initParams);
  for (let i = 0; i < loadParams.length; i++) {
    composer.addAppCallMethodCall(loadParams[i]);
  }

  await composer.send();

  const sdk = new AuctionFactorySDK({
    algorand,
    factoryParams: {
      appId: client.appId,
      defaultSender: sender,
      defaultSigner: signer,
    },
  });

  return { client, sdk };
};

