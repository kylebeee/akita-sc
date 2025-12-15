import { PrizeBoxFactorySDK } from 'akita-sdk/prize-box';
import { PrizeBoxFactoryClient, PrizeBoxFactoryFactory } from '../../smart_contracts/artifacts/prize-box/PrizeBoxFactoryClient';
import { FixtureAndAccount } from '../types';

export type DeployPrizeBoxFactoryParams = FixtureAndAccount & {
    args: {
        version: string;
        akitaDao: bigint;
    };
};

export const deployPrizeBoxFactory = async ({
    fixture,
    sender,
    signer,
    args,
}: DeployPrizeBoxFactoryParams): Promise<{ client: PrizeBoxFactoryClient; sdk: PrizeBoxFactorySDK }> => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(PrizeBoxFactoryFactory, {
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

    const sdk = new PrizeBoxFactorySDK({
        algorand,
        factoryParams: {
            appId: client.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
    });

    return { client, sdk };
};

