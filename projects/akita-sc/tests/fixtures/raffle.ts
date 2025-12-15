import { RaffleFactorySDK } from 'akita-sdk/raffle';
import { RaffleFactoryClient, RaffleFactoryFactory } from '../../smart_contracts/artifacts/raffle/RaffleFactoryClient';
import { FixtureAndAccount } from '../types';

export type DeployRaffleFactoryParams = FixtureAndAccount & {
    args: {
        version: string;
        childVersion: string;
        akitaDao: bigint;
        akitaDaoEscrow: bigint;
    };
};

export const deployRaffleFactory = async ({
    fixture,
    sender,
    signer,
    args,
}: DeployRaffleFactoryParams): Promise<{ client: RaffleFactoryClient; sdk: RaffleFactorySDK }> => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(RaffleFactoryFactory, {
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

    const sdk = new RaffleFactorySDK({
        algorand,
        factoryParams: {
            appId: client.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
    });

    return { client, sdk };
};

