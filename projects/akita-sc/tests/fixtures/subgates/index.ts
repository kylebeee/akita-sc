import { AkitaReferrerGateClient, AkitaReferrerGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/akita-referrer/AkitaReferrerGateClient';
import { AssetGateClient, AssetGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/asset/AssetGateClient';
import { MerkleAddressGateClient, MerkleAddressGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/merkle-address/MerkleAddressGateClient';
import { MerkleAssetGateClient, MerkleAssetGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/merkle-asset/MerkleAssetGateClient';
import { NfdRootGateClient, NfdRootGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/nfd-root/NFDRootGateClient';
import { NfdGateClient, NfdGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/nfd/NFDGateClient';


import { PollGateClient, PollGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/poll/PollGateClient';
import { SocialActivityGateClient, SocialActivityGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/social-activity/SocialActivityGateClient';
import { SocialFollowerCountGateClient, SocialFollowerCountGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/social-follower-count/SocialFollowerCountGateClient';
import { SocialFollowerIndexGateClient, SocialFollowerIndexGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/social-follower-index/SocialFollowerIndexGateClient';
import { SocialImpactGateClient, SocialImpactGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/social-impact/SocialImpactGateClient';
import { SocialModeratorGateClient, SocialModeratorGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/social-moderator/SocialModeratorGateClient';
import { StakingAmountGateClient, StakingAmountGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/staking-amount/StakingAmountGateClient';
import { StakingPowerGateClient, StakingPowerGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/staking-power/StakingPowerGateClient';
import { SubscriptionStreakGateClient, SubscriptionStreakGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/subscription-streak/SubscriptionStreakGateClient';
import { SubscriptionGateClient, SubscriptionGateFactory } from '../../../smart_contracts/artifacts/gates/sub-gates/subscription/SubscriptionGateClient';
import { FixtureAndAccount } from '../../types';

export type DeploySubgateParams = FixtureAndAccount & {
    args: {
        version: string;
        akitaDao: bigint;
    };
};

export const deployAkitaReferrerGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: AkitaReferrerGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(AkitaReferrerGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployAssetGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: AssetGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(AssetGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployMerkleAddressGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: MerkleAddressGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(MerkleAddressGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployMerkleAssetGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: MerkleAssetGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(MerkleAssetGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployNFDGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: NfdGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(NfdGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployNFDRootGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: NfdRootGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(NfdRootGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployPollGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: PollGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(PollGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySocialActivityGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SocialActivityGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SocialActivityGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySocialFollowerCountGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SocialFollowerCountGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SocialFollowerCountGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySocialFollowerIndexGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SocialFollowerIndexGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SocialFollowerIndexGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySocialImpactGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SocialImpactGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SocialImpactGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySocialModeratorGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SocialModeratorGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SocialModeratorGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployStakingAmountGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: StakingAmountGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(StakingAmountGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deployStakingPowerGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: StakingPowerGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(StakingPowerGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySubscriptionGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SubscriptionGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SubscriptionGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export const deploySubscriptionStreakGate = async ({
    fixture,
    sender,
    signer,
    args,
}: DeploySubgateParams): Promise<{ client: SubscriptionStreakGateClient; appId: bigint }> => {
    const { algorand } = fixture.context;
    const factory = algorand.client.getTypedAppFactory(SubscriptionStreakGateFactory, {
        defaultSender: sender,
        defaultSigner: signer,
    });
    const results = await factory.send.create.create({
        args: { version: args.version, akitaDao: args.akitaDao },
    });
    return { client: results.appClient, appId: results.appClient.appId };
};

export type SubgateClients = {
    akitaReferrerGate: { client: AkitaReferrerGateClient; appId: bigint };
    assetGate: { client: AssetGateClient; appId: bigint };
    merkleAddressGate: { client: MerkleAddressGateClient; appId: bigint };
    merkleAssetGate: { client: MerkleAssetGateClient; appId: bigint };
    nfdGate: { client: NfdGateClient; appId: bigint };
    nfdRootGate: { client: NfdRootGateClient; appId: bigint };
    pollGate: { client: PollGateClient; appId: bigint };
    socialActivityGate: { client: SocialActivityGateClient; appId: bigint };
    socialFollowerCountGate: { client: SocialFollowerCountGateClient; appId: bigint };
    socialFollowerIndexGate: { client: SocialFollowerIndexGateClient; appId: bigint };
    socialImpactGate: { client: SocialImpactGateClient; appId: bigint };
    socialModeratorGate: { client: SocialModeratorGateClient; appId: bigint };
    stakingAmountGate: { client: StakingAmountGateClient; appId: bigint };
    stakingPowerGate: { client: StakingPowerGateClient; appId: bigint };
    subscriptionGate: { client: SubscriptionGateClient; appId: bigint };
    subscriptionStreakGate: { client: SubscriptionStreakGateClient; appId: bigint };
};

export const deployAllSubgates = async (params: DeploySubgateParams): Promise<SubgateClients> => {
    const [
        akitaReferrerGate,
        assetGate,
        merkleAddressGate,
        merkleAssetGate,
        nfdGate,
        nfdRootGate,
        pollGate,
        socialActivityGate,
        socialFollowerCountGate,
        socialFollowerIndexGate,
        socialImpactGate,
        socialModeratorGate,
        stakingAmountGate,
        stakingPowerGate,
        subscriptionGate,
        subscriptionStreakGate,
    ] = await Promise.all([
        deployAkitaReferrerGate(params),
        deployAssetGate(params),
        deployMerkleAddressGate(params),
        deployMerkleAssetGate(params),
        deployNFDGate(params),
        deployNFDRootGate(params),
        deployPollGate(params),
        deploySocialActivityGate(params),
        deploySocialFollowerCountGate(params),
        deploySocialFollowerIndexGate(params),
        deploySocialImpactGate(params),
        deploySocialModeratorGate(params),
        deployStakingAmountGate(params),
        deployStakingPowerGate(params),
        deploySubscriptionGate(params),
        deploySubscriptionStreakGate(params),
    ]);

    return {
        akitaReferrerGate,
        assetGate,
        merkleAddressGate,
        merkleAssetGate,
        nfdGate,
        nfdRootGate,
        pollGate,
        socialActivityGate,
        socialFollowerCountGate,
        socialFollowerIndexGate,
        socialImpactGate,
        socialModeratorGate,
        stakingAmountGate,
        stakingPowerGate,
        subscriptionGate,
        subscriptionStreakGate,
    };
};
