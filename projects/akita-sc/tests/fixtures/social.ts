import { SocialSDK } from 'akita-sdk';
import { AkitaSocialClient, AkitaSocialFactory } from '../../smart_contracts/artifacts/social/AkitaSocialClient';
import { AkitaSocialGraphClient, AkitaSocialGraphFactory } from '../../smart_contracts/artifacts/social/AkitaSocialGraphClient';
import { AkitaSocialImpactClient, AkitaSocialImpactFactory } from '../../smart_contracts/artifacts/social/AkitaSocialImpactClient';
import { AkitaSocialModerationClient, AkitaSocialModerationFactory } from '../../smart_contracts/artifacts/social/AkitaSocialModerationClient';
import { FixtureAndAccount } from '../types';
import { logger } from '../utils/logger';

export type SocialContractsResult = {
    socialClient: AkitaSocialClient;
    graphClient: AkitaSocialGraphClient;
    impactClient: AkitaSocialImpactClient;
    moderationClient: AkitaSocialModerationClient;
    sdk: SocialSDK;
};

type DeploySocialSystemParams = FixtureAndAccount & {
    args: {
        akitaDao: bigint;
        akitaDaoEscrow: bigint;
        version: string;
    }
}

/**
 * Deploy all three social contracts (Social, Graph, Impact) and return an SDK instance
 */
export const deploySocialSystem = async ({
    fixture,
    sender,
    signer,
    args: { akitaDao, akitaDaoEscrow, version }
}: DeploySocialSystemParams): Promise<SocialContractsResult> => {
    const { algorand } = fixture.context;

    // 1. Deploy AkitaSocialImpact first (no dependencies)
    const impactFactory = algorand.client.getTypedAppFactory(
        AkitaSocialImpactFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const impactResults = await impactFactory.send.create.create({
        args: {
            akitaDao,
            version,
        }
    });
    const impactClient = impactResults.appClient;
    logger.deploy('AkitaSocialImpact', impactClient.appId, impactClient.appAddress.toString());

    // 2. Deploy AkitaSocialGraph (bare create, then update akitaDAO)
    const graphFactory = algorand.client.getTypedAppFactory(
        AkitaSocialGraphFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const graphResults = await graphFactory.send.create.bare({});
    const graphClient = graphResults.appClient;

    // Note: updateAkitaDao requires sender to be the DAO wallet
    // For testing, we skip this step and use direct contract calls where needed
    logger.deploy('AkitaSocialGraph', graphClient.appId, graphClient.appAddress.toString());

    // 3. Deploy AkitaSocial (requires DAO and escrow)
    const socialFactory = algorand.client.getTypedAppFactory(
        AkitaSocialFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const socialResults = await socialFactory.send.create.create({
        args: {
            version,
            akitaDao,
            akitaDaoEscrow,
        }
    });
    const socialClient = socialResults.appClient;
    logger.deploy('AkitaSocial', socialClient.appId, socialClient.appAddress.toString());

    // 4. Deploy AkitaSocialModeration
    const moderationFactory = algorand.client.getTypedAppFactory(
        AkitaSocialModerationFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const moderationResults = await moderationFactory.send.create.create({
        args: {
            akitaDao,
            version,
        }
    });
    const moderationClient = moderationResults.appClient;
    logger.deploy('AkitaSocialModeration', moderationClient.appId, moderationClient.appAddress.toString());

    // 4. Create unified SDK instance
    const sdk = new SocialSDK({
        algorand,
        daoAppId: akitaDao,
        socialFactoryParams: {
            appId: socialClient.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
        graphFactoryParams: {
            appId: graphClient.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
        impactFactoryParams: {
            appId: impactClient.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
        moderationFactoryParams: {
            appId: moderationClient.appId,
            defaultSender: sender,
            defaultSigner: signer,
        },
    });

    return {
        socialClient,
        graphClient,
        impactClient,
        moderationClient,
        sdk,
    };
};

// Individual deploy functions for more granular control

type DeploySocialParams = FixtureAndAccount & {
    args: {
        akitaDao: bigint;
        akitaDaoEscrow: bigint;
        version: string;
    }
}

export const deploySocial = async ({
    fixture,
    sender,
    signer,
    args: { akitaDao, akitaDaoEscrow, version }
}: DeploySocialParams) => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(
        AkitaSocialFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const results = await factory.send.create.create({
        args: {
            version,
            akitaDao,
            akitaDaoEscrow,
        }
    });

    const client = results.appClient;
    logger.deploy('AkitaSocial', client.appId, client.appAddress.toString());

    return client;
}

type DeploySocialGraphParams = FixtureAndAccount & {
    args: {
        akitaDao: bigint;
    }
}

export const deploySocialGraph = async ({
    fixture,
    sender,
    signer,
    args: { akitaDao }
}: DeploySocialGraphParams) => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(
        AkitaSocialGraphFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const results = await factory.send.create.bare({});
    const client = results.appClient;

    // Note: updateAkitaDao requires sender to be the DAO wallet
    // Skip for standalone tests
    logger.deploy('AkitaSocialGraph', client.appId, client.appAddress.toString());

    return client;
}

type DeploySocialImpactParams = FixtureAndAccount & {
    args: {
        akitaDao: bigint;
        version: string;
    }
}

export const deploySocialImpact = async ({
    fixture,
    sender,
    signer,
    args: { akitaDao, version }
}: DeploySocialImpactParams) => {
    const { algorand } = fixture.context;

    const factory = algorand.client.getTypedAppFactory(
        AkitaSocialImpactFactory,
        {
            defaultSender: sender,
            defaultSigner: signer,
        }
    );

    const results = await factory.send.create.create({
        args: {
            akitaDao,
            version,
        }
    });

    const client = results.appClient;
    logger.deploy('AkitaSocialImpact', client.appId, client.appAddress.toString());

    return client;
}
