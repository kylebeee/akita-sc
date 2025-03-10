import { Account, Application, arc4, Asset, bytes, uint64 } from "@algorandfoundation/algorand-typescript";

export type ProposalDetails = {
    status: uint64;
    action: uint64;
    cid: bytes;
    creator: Account;
    created: uint64;
    votes: uint64;
    plugin: Application;
    executionKey: ExecutionKey;
}

export type ExecutionKey = bytes;

export type ExecutionInfo = {
    /** whether the txn group has been executed */
    executed: boolean,
    /** The last round at which this plugin can be called */
    lastValidRound: uint64;
};

// distribute Bones for DAU
// distribute Bones for Bones Stakers
// distribute Bones for Service Usage
// distribute AKTA & other tokens for Bones Stakers

export type AkitaDAOState = {
    status: arc4.UintN64;
    version: arc4.Str;
    contentPolicy: arc4.StaticBytes<36>;
    minimumRewardsImpact: arc4.UintN64;
    appList: arc4AppList;
    socialFees: arc4SocialFees;
    stakingFees: arc4StakingFees;
    subscriptionFees: arc4SubscriptionFees;
    nftFees: arc4NFTFees;
    krbyPercentage: arc4.UintN64;
    moderatorPercentage: arc4.UintN64;
    akitaAssets: arc4AkitaAssets;
    proposalSettings: arc4ProposalSettings;
    revocationAddress: arc4.Address;
}

export type AppList = {
    vrfBeacon: Application; // vrf beacon
    social: Application; // social app
    impact: Application; // impact app
    staking: Application; // universal staking
    rewards: Application; // akita rewards distro
    pool: Application; // akita staking pools
    subscriptions: Application; // akita subscriptions
    gate: Application; // main gate
    nfdRegistry: Application; // NFD Registry
    nfd: Application; // Akita Root NFD
    auction: Application; // Akita Auctions
    hyperSwap: Application; // Akita HyperSwap
    raffle: Application; // Akita Raffle
    metaMerkles: Application; // Akita MetaMerkles
    marketplace: Application; // Akita Marketplace
}

export class arc4AppList extends arc4.Struct<{
    vrfBeacon: arc4.UintN64;
    social: arc4.UintN64;
    impact: arc4.UintN64;
    staking: arc4.UintN64;
    rewards: arc4.UintN64;
    pool: arc4.UintN64;
    subscriptions: arc4.UintN64;
    gate: arc4.UintN64;
    nfdRegistry: arc4.UintN64;
    nfd: arc4.UintN64;
    auction: arc4.UintN64;
    hyperSwap: arc4.UintN64;
    raffle: arc4.UintN64;
    metaMerkles: arc4.UintN64;
    marketplace: arc4.UintN64;
}> {}

export type SocialFees = {
    /** the cost to post on akita social */
    postFee: uint64;
    /** the cost to react to something on akita social */
    reactFee: uint64;
    /**
     * the smallest percentage of tax the system takes for social interactions
     * padded with two decimals 1% = 100
    */
    impactTaxMin: uint64;
    /**
     * the largest percentage of tax the system takes for social interactions
     * padded with two decimals 20% = 2000 
    */
    impactTaxMax: uint64;
}

export class arc4SocialFees extends arc4.Struct<{
    postFee: arc4.UintN64;
    reactFee: arc4.UintN64;
    impactTaxMin: arc4.UintN64;
    impactTaxMax: arc4.UintN64;
}> {}

export type StakingFees = {
    /** the cost to create a rewards distribution  */
    rewardsFee: uint64;
    /** the cost to create a staking pool */
    poolCreationFee: uint64;
}

export class arc4StakingFees extends arc4.Struct<{
    rewardsFee: arc4.UintN64;
    poolCreationFee: arc4.UintN64;
}> {}

export type SubscriptionFees = {
    /** the cost to create a subscription service */
    serviceCreationFee: uint64;
    /** the per-payment percentage of subscriptions as a whole number. eg. 3.5% is 35 */
    paymentPercentage: uint64;
    /** the per-payment trigger percentage of subscriptions */
    triggerPercentage: uint64;
}

export class arc4SubscriptionFees extends arc4.Struct<{
    serviceCreationFee: arc4.UintN64;
    paymentPercentage: arc4.UintN64;
    triggerPercentage: arc4.UintN64;
}> {}

export type NFTFees = {
    omnigemSaleFee: uint64; // omnigem sale fee
    marketplaceSalePercentageMinimum: uint64; // the minimum percentage to take on an NFT sale based on user impact
    marketplaceSalePercentageMaximum: uint64; // the maximum percentage to take on an NFT sale based on user impact
    marketplaceComposablePercentage: uint64; // the percentage each side of the composable marketplace takes on an NFT sale
    shuffleSalePercentage: uint64; // the nft shuffle sale % fee
    auctionSalePercentageMinimum: uint64; // the minimum percentage to take on an NFT auction based on user impact
    auctionSalePercentageMaximum: uint64; // the maximum percentage to take on an NFT auction based on user impact
    auctionComposablePercentage: uint64; // the percentage each side of the composable auction takes on an NFT sale
}

export class arc4NFTFees extends arc4.Struct<{
    omnigemSaleFee: arc4.UintN64;
    marketplaceSalePercentageMinimum: arc4.UintN64;
    marketplaceSalePercentageMaximum: arc4.UintN64;
    marketplaceComposablePercentage: arc4.UintN64;
    shuffleSalePercentage: arc4.UintN64;
    auctionSalePercentageMinimum: arc4.UintN64;
    auctionSalePercentageMaximum: arc4.UintN64;
    auctionComposablePercentage: arc4.UintN64;
}> {}

export type arc4Fees = {
    postFee: arc4.UintN64;
    reactFee: arc4.UintN64;
    impactTaxMin: arc4.UintN64;
    impactTaxMax: arc4.UintN64;
    rewardsFee: arc4.UintN64;
    poolCreationFee: arc4.UintN64;
    subscriptionServiceCreationFee: arc4.UintN64;
    subscriptionPaymentPercentage: arc4.UintN64;
    subscriptionTriggerPercentage: arc4.UintN64;
    omnigemSaleFee: arc4.UintN64;
    marketplaceSalePercentageMinimum: arc4.UintN64;
    marketplaceSalePercentageMaximum: arc4.UintN64;
    marketplaceComposablePercentage: arc4.UintN64;
    shuffleSalePercentage: arc4.UintN64;
    auctionSalePercentageMinimum: arc4.UintN64;
    auctionSalePercentageMaximum: arc4.UintN64;
    auctionComposablePercentage: arc4.UintN64;
    krbyPercentage: arc4.UintN64;
    moderatorPercentage: arc4.UintN64;
}

export type AkitaAssets = {
    /** the Akita token asset id */
    akta: Asset;
    /** the Bones governance token asset id */
    bones: Asset;
}

export class arc4AkitaAssets extends arc4.Struct<{
    akta: arc4.UintN64;
    bones: arc4.UintN64;
}> {}

export type ProposalSettings = {
    /** the minimum staking power needed to create a proposal */
    minimumProposalThreshold: uint64;
    /** the minimum of positive votes necessary to pass a proposal */
    minimumVoteThreshold: uint64;
}

/** arc4 variant of ProposalSettings */
export class arc4ProposalSettings extends arc4.Struct<{
    minimumProposalThreshold: arc4.UintN64;
    minimumVoteThreshold: arc4.UintN64;
}> {}