import { setCurrentNetwork } from 'akita-sdk';
import { MarketplaceSDK } from 'akita-sdk/marketplace';
import { MarketplaceClient, MarketplaceFactory } from '../../smart_contracts/artifacts/marketplace/MarketplaceClient';
import { FixtureAndAccount } from '../types';

export type DeployMarketplaceParams = FixtureAndAccount & {
    args: {
        version: string;
        childVersion: string;
        akitaDao: bigint;
        akitaDaoEscrow: bigint;
    };
};

export const deployMarketplace = async ({
    fixture,
    sender,
    signer,
    args,
}: DeployMarketplaceParams): Promise<{ client: MarketplaceClient; sdk: MarketplaceSDK }> => {
    // Ensure network is set for SDK initialization (fixtures are always localnet)
    setCurrentNetwork('localnet');
    
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(MarketplaceFactory, {
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

    const sdk = new MarketplaceSDK({
        algorand,
        factoryParams: {
            appId: client.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
    });

    return { client, sdk };
};

