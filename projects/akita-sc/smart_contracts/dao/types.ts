import { arc4, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Bool, DynamicArray, DynamicBytes, StaticBytes, Str, Struct, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4MethodInfo, MethodRestriction, SpendAllowanceType } from '../arc58/account/types';
import { CID } from '../utils/types/base';

export class arc4DAOPluginInfo extends Struct<{
  /** the type of delegation the plugin is using */
  delegationType: UintN8;
  /** the spending account to use for the plugin */
  spendingApp: UintN64;
  /** The last round or unix time at which this plugin can be called */
  lastValid: UintN64;
  /** The number of rounds or seconds that must pass before the plugin can be called again */
  cooldown: UintN64;
  /** The methods that are allowed to be called for the plugin by the address */
  methods: DynamicArray<arc4MethodInfo>;
  /** Whether the plugin has allowance restrictions */
  useAllowance: Bool;
  /** Whether to use unix timestamps or round for lastValid and cooldown */
  useRounds: Bool;
  /** The last round or unix time the plugin was called */
  lastCalled: UintN64;
  /** The round or unix time the plugin was installed */
  start: UintN64;
  /** whether to require the group ID of the submitted group to match */
  useExecutionKey: Bool;
}> { }

export type ProposalStatus = UintN8

export type ProposalAction = UintN8

export type ProposalUpgradeApp = {
  app: uint64
  executionKey: ExecutionKey
}

export type ProposalAddPlugin = {
  app: uint64,
  allowedCaller: Address,
  delegationType: UintN8,
  lastValid: uint64,
  cooldown: uint64,
  methods: MethodRestriction[],
  useAllowance: boolean,
  useRounds: boolean,
  useExecutionKey: boolean,
}

export type ProposalAddNamedPlugin = {
  name: string,
  app: uint64,
  allowedCaller: Address,
  delegationType: UintN8,
  lastValid: uint64,
  cooldown: uint64,
  methods: MethodRestriction[],
  useAllowance: boolean,
  useRounds: boolean,
  useExecutionKey: boolean,
}

export type ProposalExecutePlugin = {
  app: uint64
  txns: bytes[][]
}

export type ProposalExecuteNamedPlugin = {
  name: string
  txns: bytes[][]
}

export type ProposalRemovePlugin = {
  app: uint64
}

export type ProposalRemoveNamedPlugin = {
  name: string
}

export type ProposalAddAllowance = {
  plugin: uint64,
  caller: Address,
  asset: uint64,
  type: SpendAllowanceType,
  allowed: uint64,
  max: uint64,
  interval: uint64,
}

export type ProposalRemoveAllowance = {
  plugin: uint64,
  caller: Address,
  asset: uint64,
}

export type ProposalUpdateField = {
  field: string
  value: string
}

export type ProposalDetails = {
  status: ProposalStatus
  action: ProposalAction
  cid: CID
  created: uint64
  votes: uint64
  creator: Address
  data: bytes
}

export class arc4ProposalDetails extends arc4.Struct<{
  status: ProposalStatus
  action: ProposalAction
  cid: StaticBytes<36>
  created: arc4.UintN64
  votes: arc4.UintN64
  creator: Address
  data: DynamicBytes
}> { }

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
}> { }

export type EscrowInfo = {
  /** the escrow app id */
  escrow: uint64
  /** the account that uses the escrow */
  account: Address
  /** whether the account is allowed to opt in */
  optinAllowed: boolean
}

export class arc4EscrowInfo extends arc4.Struct<{
  escrow: UintN64,
  account: Address,
  optinAllowed: arc4.Bool,
}> { }

// distribute Bones for DAU
// distribute Bones for Bones Stakers
// distribute Bones for Service Usage
// distribute AKTA & other tokens for Bones Stakers

export type AkitaDAOState = {
  status: uint64
  version: string
  contentPolicy: arc4.StaticBytes<36>
  minimumRewardsImpact: uint64
  akitaAppList: AkitaAppList
  otherAppList: OtherAppList
  socialFees: SocialFees
  stakingFees: StakingFees
  subscriptionFees: SubscriptionFees
  nftFees: NFTFees
  krbyPercentage: uint64
  moderatorPercentage: uint64
  akitaAssets: AkitaAssets
  proposalSettings: ProposalSettings
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
}> { }

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
}> { }

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
}> { }

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
}> { }

export type StakingFees = {
  /** the cost to create a staking pool */
  creationFee: uint64
  /** the min tax to take on each users rewards based on impact */
  impactTaxMin: uint64
  /** the max tax to take on each users rewards based on impact */
  impactTaxMax: uint64
}

export class arc4StakingFees extends arc4.Struct<{
  creationFee: arc4.UintN64
  impactTaxMin: arc4.UintN64
  impactTaxMax: arc4.UintN64
}> { }

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
}> { }

export type SwapFees = {
  impactTaxMin: uint64
  impactTaxMax: uint64
}

export class arc4SwapFees extends arc4.Struct<{
  impactTaxMin: arc4.UintN64
  impactTaxMax: arc4.UintN64
}> { }

export type NFTFees = {
  marketplaceSalePercentageMin: uint64 // the minimum percentage to take on an NFT sale based on user impact
  marketplaceSalePercentageMax: uint64 // the maximum percentage to take on an NFT sale based on user impact
  marketplaceComposablePercentage: uint64 // the percentage each side of the composable marketplace takes on an NFT sale
  marketplaceRoyaltyDefaultPercentage: uint64
  shuffleSalePercentage: uint64 // the nft shuffle sale % fee
  omnigemSaleFee: uint64 // omnigem sale fee
  auctionCreationFee: uint64
  auctionSaleImpactTaxMin: uint64 // the minimum percentage to take on an NFT auction based on user impact
  auctionSaleImpactTaxMax: uint64 // the maximum percentage to take on an NFT auction based on user impact
  auctionComposablePercentage: uint64 // the percentage each side of the composable auction takes on an NFT sale
  auctionRafflePercentage: uint64
  raffleCreationFee: uint64
  raffleSaleImpactTaxMin: uint64
  raffleSaleImpactTaxMax: uint64
  raffleComposablePercentage: uint64
}

export class arc4NFTFees extends arc4.Struct<{
  marketplaceSalePercentageMin: arc4.UintN64
  marketplaceSalePercentageMax: arc4.UintN64
  marketplaceComposablePercentage: arc4.UintN64
  marketplaceRoyaltyDefaultPercentage: arc4.UintN64
  shuffleSalePercentage: arc4.UintN64
  omnigemSaleFee: arc4.UintN64
  auctionCreationFee: arc4.UintN64
  auctionSaleImpactTaxMin: arc4.UintN64
  auctionSaleImpactTaxMax: arc4.UintN64
  auctionComposablePercentage: arc4.UintN64
  auctionRafflePercentage: arc4.UintN64
  raffleCreationFee: arc4.UintN64
  raffleSaleImpactTaxMin: arc4.UintN64
  raffleSaleImpactTaxMax: arc4.UintN64
  raffleComposablePercentage: arc4.UintN64
}> { }

export type Fees = {
  postFee: uint64
  reactFee: uint64
  impactTaxMin: uint64
  impactTaxMax: uint64

  poolCreationFee: uint64
  poolImpactTaxMin: uint64
  poolImpactTaxMax: uint64

  subscriptionServiceCreationFee: uint64
  subscriptionPaymentPercentage: uint64
  subscriptionTriggerPercentage: uint64

  marketplaceSalePercentageMin: uint64
  marketplaceSalePercentageMax: uint64
  marketplaceComposablePercentage: uint64
  marketplaceRoyaltyDefaultPercentage: uint64

  shuffleSalePercentage: uint64
  omnigemSaleFee: uint64

  auctionCreationFee: uint64
  auctionSaleImpactTaxMin: uint64
  auctionSaleImpactTaxMax: uint64
  auctionComposablePercentage: uint64
  auctionRafflePercentage: uint64

  raffleCreationFee: uint64
  raffleSaleImpactTaxMin: uint64
  raffleSaleImpactTaxMax: uint64
  raffleComposablePercentage: uint64

  swapFeeImpactTaxMin: uint64
  swapFeeImpactTaxMax: uint64
  swapComposablePercentage: uint64
  swapLiquidityPercentage: uint64

  krbyPercentage: uint64
  moderatorPercentage: uint64
}


export class arc4Fees extends Struct<{
  postFee: arc4.UintN64
  reactFee: arc4.UintN64
  impactTaxMin: arc4.UintN64
  impactTaxMax: arc4.UintN64

  poolCreationFee: arc4.UintN64
  poolImpactTaxMin: arc4.UintN64
  poolImpactTaxMax: arc4.UintN64

  subscriptionServiceCreationFee: arc4.UintN64
  subscriptionPaymentPercentage: arc4.UintN64
  subscriptionTriggerPercentage: arc4.UintN64

  marketplaceSalePercentageMin: arc4.UintN64
  marketplaceSalePercentageMax: arc4.UintN64
  marketplaceComposablePercentage: arc4.UintN64
  marketplaceRoyaltyDefaultPercentage: arc4.UintN64

  shuffleSalePercentage: arc4.UintN64
  omnigemSaleFee: arc4.UintN64

  auctionCreationFee: arc4.UintN64
  auctionSaleImpactTaxMin: arc4.UintN64
  auctionSaleImpactTaxMax: arc4.UintN64
  auctionComposablePercentage: arc4.UintN64
  auctionRafflePercentage: arc4.UintN64

  raffleCreationFee: arc4.UintN64
  raffleSaleImpactTaxMin: arc4.UintN64
  raffleSaleImpactTaxMax: arc4.UintN64
  raffleComposablePercentage: arc4.UintN64

  swapFeeImpactTaxMin: arc4.UintN64
  swapFeeImpactTaxMax: arc4.UintN64
  swapComposablePercentage: arc4.UintN64
  swapLiquidityPercentage: arc4.UintN64

  krbyPercentage: arc4.UintN64
  moderatorPercentage: arc4.UintN64
}> { }

export type AkitaAssets = {
  /** the Akita token asset id */
  akta: uint64
  /** the Bones governance token asset id */
  bones: uint64
}

export class arc4AkitaAssets extends arc4.Struct<{
  akta: arc4.UintN64
  bones: arc4.UintN64
}> { }

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
}> { }
