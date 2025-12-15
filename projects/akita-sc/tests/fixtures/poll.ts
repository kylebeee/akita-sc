import { PollFactorySDK } from 'akita-sdk/poll';
import { PollFactoryClient, PollFactoryFactory } from '../../smart_contracts/artifacts/poll/PollFactoryClient';
import { FixtureAndAccount } from '../types';

export type DeployPollFactoryParams = FixtureAndAccount & {
    args: {
        version: string;
        childVersion: string;
        akitaDao: bigint;
        akitaDaoEscrow: bigint;
    };
};

export const deployPollFactory = async ({
    fixture,
    sender,
    signer,
    args,
}: DeployPollFactoryParams): Promise<{ client: PollFactoryClient; sdk: PollFactorySDK }> => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(PollFactoryFactory, {
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

    const sdk = new PollFactorySDK({
        algorand,
        factoryParams: {
            appId: client.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
    });

    return { client, sdk };
};

