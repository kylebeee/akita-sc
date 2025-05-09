import { arc4, Asset, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type ProposalDetails = {
    status: uint64
    action: uint64
    cid: bytes
    created: uint64
    votes: uint64
    plugin: uint64
    executionKey: ExecutionKey
    creator: Address
}

export class arc4ProposalDetails extends arc4.Struct<{
    status: arc4.UintN64
    action: arc4.UintN64
    cid: arc4.StaticBytes<36>
    created: arc4.UintN64
    votes: arc4.UintN64
    plugin: arc4.UintN64
    executionKey: ExecutionKey
    creator: Address
}> {}

export type ExecutionKey = arc4.StaticBytes<32>

export type ExecutionInfo = {
    /** whether the txn group has been executed */
    executed: boolean
    /** The last round at which this plugin can be called */
    lastValidRound: uint64
}

export class arc4ExecutionInfo extends arc4.Struct<{
    executed: arc4.Bool
    lastValidRound: arc4.UintN64
}> {}

// distribute Bones for DAU
// distribute Bones for Bones Stakers
// distribute Bones for Service Usage
// distribute AKTA & other tokens for Bones Stakers

export type AkitaDAOState = {
    status: arc4.UintN64
    version: arc4.Str
    contentPolicy: arc4.StaticBytes<36>
    minimumRewardsImpact: arc4.UintN64
    akitaAppList: arc4AkitaAppList
    otherAppList: arc4OtherAppList
    socialFees: arc4SocialFees
    stakingFees: arc4StakingFees
    subscriptionFees: arc4SubscriptionFees
    nftFees: arc4NFTFees
    krbyPercentage: arc4.UintN64
    moderatorPercentage: arc4.UintN64
    akitaAssets: arc4AkitaAssets
    proposalSettings: arc4ProposalSettings
    revocationAddress: Address
}

export type AkitaAppList = {
    staking: uint64 // universal staking
    rewards: uint64 // akita rewards distro
    pool: uint64 // akita staking pools
    prizeBox: uint64 // akita prize box
    subscriptions: uint64 // akita subscriptions
    gate: uint64 // main gate
    auction: uint64 // Akita Auctions
    hyperSwap: uint64 // Akita HyperSwap
    raffle: uint64 // Akita Raffle
    metaMerkles: uint64 // Akita MetaMerkles
    marketplace: uint64 // Akita Marketplace
    akitaNFD: uint64 // akita.algo NFD
    // empty slot
    // empty slot
    // empty slot
}

export class arc4AkitaAppList extends arc4.Struct<{
    staking: arc4.UintN64
    rewards: arc4.UintN64
    pool: arc4.UintN64
    prizeBox: arc4.UintN64
    subscriptions: arc4.UintN64
    gate: arc4.UintN64
    auction: arc4.UintN64
    hyperSwap: arc4.UintN64
    raffle: arc4.UintN64
    metaMerkles: arc4.UintN64
    marketplace: arc4.UintN64
    akitaNFD: arc4.UintN64
}> {}

export type PluginAppList = {
    optin: uint64
    social: uint64
    impact: uint64
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
}

export class arc4PluginAppList extends arc4.Struct<{
    optin: arc4.UintN64
    social: arc4.UintN64
    impact: arc4.UintN64
}> {}

export type OtherAppList = {
    vrfBeacon: uint64 // vrf beacon
    nfdRegistry: uint64 // NFD Registry
    assetInbox: uint64 // asset inbox
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
    // empty slot
}

export class arc4OtherAppList extends arc4.Struct<{
    vrfBeacon: arc4.UintN64
    nfdRegistry: arc4.UintN64
    assetInbox: arc4.UintN64
}> {}

export type SocialFees = {
    /** the cost to post on akita social */
    postFee: uint64
    /** the cost to react to something on akita social */
    reactFee: uint64
    /**
     * the smallest percentage of tax the system takes for social interactions
     * padded with two decimals 1% = 100
     */
    impactTaxMin: uint64
    /**
     * the largest percentage of tax the system takes for social interactions
     * padded with two decimals 20% = 2000
     */
    impactTaxMax: uint64
}

export class arc4SocialFees extends arc4.Struct<{
    postFee: arc4.UintN64
    reactFee: arc4.UintN64
    impactTaxMin: arc4.UintN64
    impactTaxMax: arc4.UintN64
}> {}

export type StakingFees = {
    /** the cost to create a rewards distribution  */
    rewardsFee: uint64
    /** the cost to create a staking pool */
    poolCreationFee: uint64
}

export class arc4StakingFees extends arc4.Struct<{
    rewardsFee: arc4.UintN64
    poolCreationFee: arc4.UintN64
}> {}

export type SubscriptionFees = {
    /** the cost to create a subscription service */
    serviceCreationFee: uint64
    /** the per-payment percentage of subscriptions as a whole number. eg. 3.5% is 350 */
    paymentPercentage: uint64
    /** the per-payment trigger percentage of subscriptions */
    triggerPercentage: uint64
}

export class arc4SubscriptionFees extends arc4.Struct<{
    serviceCreationFee: arc4.UintN64
    paymentPercentage: arc4.UintN64
    triggerPercentage: arc4.UintN64
}> {}

export type SwapFees = {
    HyperSwapImpactTaxMin: uint64
    HyperSwapImpactTaxMax: uint64
}

export class arc4SwapFees extends arc4.Struct<{
    HyperSwapImpactTaxMin: arc4.UintN64
    HyperSwapImpactTaxMax: arc4.UintN64
}> {}

export type NFTFees = {
    omnigemSaleFee: uint64 // omnigem sale fee
    marketplaceSalePercentageMinimum: uint64 // the minimum percentage to take on an NFT sale based on user impact
    marketplaceSalePercentageMaximum: uint64 // the maximum percentage to take on an NFT sale based on user impact
    marketplaceComposablePercentage: uint64 // the percentage each side of the composable marketplace takes on an NFT sale
    shuffleSalePercentage: uint64 // the nft shuffle sale % fee
    auctionSalePercentageMinimum: uint64 // the minimum percentage to take on an NFT auction based on user impact
    auctionSalePercentageMaximum: uint64 // the maximum percentage to take on an NFT auction based on user impact
    auctionComposablePercentage: uint64 // the percentage each side of the composable auction takes on an NFT sale
}

export class arc4NFTFees extends arc4.Struct<{
    omnigemSaleFee: arc4.UintN64
    marketplaceSalePercentageMinimum: arc4.UintN64
    marketplaceSalePercentageMaximum: arc4.UintN64
    marketplaceComposablePercentage: arc4.UintN64
    shuffleSalePercentage: arc4.UintN64
    auctionSalePercentageMinimum: arc4.UintN64
    auctionSalePercentageMaximum: arc4.UintN64
    auctionComposablePercentage: arc4.UintN64
}> {}

export type arc4Fees = {
    postFee: arc4.UintN64
    reactFee: arc4.UintN64
    impactTaxMin: arc4.UintN64
    impactTaxMax: arc4.UintN64
    rewardsFee: arc4.UintN64
    poolCreationFee: arc4.UintN64
    subscriptionServiceCreationFee: arc4.UintN64
    subscriptionPaymentPercentage: arc4.UintN64
    subscriptionTriggerPercentage: arc4.UintN64
    HyperSwapImpactTaxMin: arc4.UintN64
    HyperSwapImpactTaxMax: arc4.UintN64
    omnigemSaleFee: arc4.UintN64
    marketplaceSalePercentageMinimum: arc4.UintN64
    marketplaceSalePercentageMaximum: arc4.UintN64
    marketplaceComposablePercentage: arc4.UintN64
    shuffleSalePercentage: arc4.UintN64
    auctionSalePercentageMinimum: arc4.UintN64
    auctionSalePercentageMaximum: arc4.UintN64
    auctionComposablePercentage: arc4.UintN64
    krbyPercentage: arc4.UintN64
    moderatorPercentage: arc4.UintN64
}

export type AkitaAssets = {
    /** the Akita token asset id */
    akta: Asset
    /** the Bones governance token asset id */
    bones: Asset
}

export class arc4AkitaAssets extends arc4.Struct<{
    akta: arc4.UintN64
    bones: arc4.UintN64
}> {}

export type ProposalSettings = {
    /** the minimum staking power needed to create a proposal */
    minimumProposalThreshold: uint64
    /** the minimum of positive votes necessary to pass a proposal */
    minimumVoteThreshold: uint64
}

/** arc4 variant of ProposalSettings */
export class arc4ProposalSettings extends arc4.Struct<{
    minimumProposalThreshold: arc4.UintN64
    minimumVoteThreshold: arc4.UintN64
}> {}
