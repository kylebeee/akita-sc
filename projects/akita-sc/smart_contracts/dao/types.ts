import { arc4, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Bool, DynamicArray, DynamicBytes, StaticBytes, Struct, Uint64, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4MethodInfo, MethodInfo, MethodRestriction, SpendAllowanceType } from '../arc58/account/types';
import { CID } from '../utils/types/base';

export class arc4DAOPluginInfo extends Struct<{
  /** the type of delegation the plugin is using */
  delegationType: Uint8;
  /** the escrow account to use for the plugin */
  escrow: Uint64;
  /** The last round or unix time at which this plugin can be called */
  lastValid: Uint64;
  /** The number of rounds or seconds that must pass before the plugin can be called again */
  cooldown: Uint64;
  /** The methods that are allowed to be called for the plugin by the address */
  methods: DynamicArray<arc4MethodInfo>;
  /** Whether to use unix timestamps or round for lastValid and cooldown */
  useRounds: Bool;
  /** The last round or unix time the plugin was called */
  lastCalled: Uint64;
  /** The round or unix time the plugin was installed */
  start: Uint64;
  /** whether to require the group ID of the submitted group to match */
  useExecutionKey: Bool;
  /** the power needed to propose plugin execution */
  executionProposalCreationMinimum: Uint64;
  /** the threshold of participation needed to execute the plugin */
  executionParticipationThreshold: Uint64;
  /** the threshold of approval votes needed to execute the plugin */
  executionApprovalThreshold: Uint64;
  /** the amount of seconds the voting period lasts */
  executionVotingDuration: Uint64;
}> { }

export type DAOPluginInfo = {
  /** the type of delegation the plugin is using */
  delegationType: Uint8;
  /** the escrow account to use for the plugin */
  escrow: uint64;
  /** The last round or unix time at which this plugin can be called */
  lastValid: uint64;
  /** The number of rounds or seconds that must pass before the plugin can be called again */
  cooldown: uint64;
  /** The methods that are allowed to be called for the plugin by the address */
  methods: MethodInfo[];
  /** Whether to use unix timestamps or round for lastValid and cooldown */
  useRounds: boolean;
  /** The last round or unix time the plugin was called */
  lastCalled: uint64;
  /** The round or unix time the plugin was installed */
  start: uint64;
  /** whether to require the group ID of the submitted group to match */
  useExecutionKey: boolean;
  /** the power needed to propose plugin execution */
  executionProposalCreationMinimum: uint64;
  /** the threshold of participation needed to execute the plugin */
  executionParticipationThreshold: uint64;
  /** the threshold of approval votes needed to execute the plugin */
  executionApprovalThreshold: uint64;
  /** the amount of seconds the voting period lasts */
  executionVotingDuration: uint64;
}

export type ProposalStatus = Uint8

export type ProposalAction = Uint8

export type ProposalUpgradeApp = {
  app: uint64
  executionKey: ExecutionKey
}

export type ProposalAddPlugin = {
  app: uint64
  allowedCaller: Address
  delegationType: Uint8
  escrow: string  
  lastValid: uint64
  cooldown: uint64
  methods: MethodRestriction[]
  useRounds: boolean
  useExecutionKey: boolean
  executionProposalCreationMinimum: uint64
  executionParticipationThreshold: uint64
  executionApprovalThreshold: uint64
  executionVotingDuration: uint64
  sourceLink: string
  allowances: AllowanceProposal[]
}

export type AllowanceProposal = {
  asset: uint64
  type: SpendAllowanceType
  max: uint64
  allowed: uint64
  spent: uint64
  interval: uint64
  last: uint64
}

export type ProposalAddNamedPlugin = {
  name: string,
  app: uint64,
  allowedCaller: Address,
  delegationType: Uint8,
  lastValid: uint64,
  cooldown: uint64,
  methods: MethodRestriction[],
  useAllowance: boolean,
  useRounds: boolean,
  useExecutionKey: boolean,
  executionParticipationThreshold: uint64
  executionApprovalThreshold: uint64
  executionVotingDuration: uint64
  sourceLink: string
  allowances: AllowanceProposal[]
}

export type ProposalExecutePlugin = {
  app: uint64
  allowedCaller: Address,
  executionKey: ExecutionKey
}

export type ProposalExecuteNamedPlugin = {
  name: string
  app: uint64
  allowedCaller: Address,
  executionKey: ExecutionKey
}

export type ProposalRemovePlugin = {
  app: uint64
  allowedCaller: Address,
}

export type ProposalRemoveNamedPlugin = {
  name: string
  app: uint64
  allowedCaller: Address
}

export type ProposalAddAllowance = {
  app: uint64,
  allowedCaller: Address,
  asset: uint64,
  type: SpendAllowanceType,
  allowed: uint64,
  max: uint64,
  interval: uint64,
}

export type ProposalRemoveAllowance = {
  app: uint64,
  allowedCaller: Address,
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
  created: arc4.Uint64
  votes: arc4.Uint64
  creator: Address
  data: DynamicBytes
}> { }

export type ProposalVoteKey = {
  proposalId: uint64
  voter: Address
}

export type ProposalVoteType = Uint8

export type ProposalVoteInfo = {
  type: ProposalVoteType
  power: uint64
}

export type ExecutionKey = bytes<32>

export type ExecutionInfo = {
  /** whether the txn group has been executed */
  executed: boolean
  /** The last round at which this plugin can be called */
  lastValidRound: uint64
}

export class arc4ExecutionInfo extends arc4.Struct<{
  executed: arc4.Bool
  lastValidRound: arc4.Uint64
}> { }

export type ReceiveEscrowDisbursementPhase = Uint8

export type ReceiveEscrowInfo = {
  /** the source address of funds for the escrow */
  source: Address
  /** whether the escrow is allocatable for paying the DAO/krby/mods */
  allocatable: boolean
  /** whether the account is allowed to opt in */
  optinAllowed: boolean
  /** the number of assets the escrow is opted into */
  optinCount: uint64
  /** the current phase of the escrow disbursement */
  phase: ReceiveEscrowDisbursementPhase
  /** allocation counter to track the number of assets we need to disburse */
  allocationCounter: uint64
  /** the last unix time the escrow was disbursed */
  lastDisbursement: uint64
  /** the unix timestamp the escrow was created */
  creationDate: uint64
}

export class arc4EscrowInfo extends arc4.Struct<{
  escrow: Uint64,
  account: Address,
  optinAllowed: arc4.Bool,
  phase: ReceiveEscrowDisbursementPhase,
  lastDisbursement: Uint64,
  creationDate: Uint64
}> { }

export type EscrowAssetKey = {
  escrow: uint64
  asset: uint64
}

export type PayoutEscrowType = Uint8

export type PayoutEscrowInfo = {
  type: PayoutEscrowType
  data: bytes
}

export type PayoutEscrowIndividual = {
  recipient: Address
}

export type PayoutEscrowPool = {
  poolID: uint64
}


// distribute Bones for DAU
// distribute Bones for Bones Stakers
// distribute Bones for Service Usage
// distribute AKTA & other tokens for Bones Stakers

export type AkitaDAOState = {
  initialized: boolean
  version: string
  contentPolicy: CID
  minRewardsImpact: uint64
  akitaAppList: AkitaAppList
  otherAppList: OtherAppList
  socialFees: SocialFees
  stakingFees: StakingFees
  subscriptionFees: SubscriptionFees
  nftFees: NFTFees
  krbyPercentage: uint64
  moderatorPercentage: uint64
  akitaAssets: AkitaAssets
  proposalSettings: {
    creation: ProposalSettings
    participation: ProposalSettings
    approval: ProposalSettings
    duration: ProposalSettings
  }
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
  akitaNfd: uint64 // akita.algo NFD
  social: uint64 // akita social
  impact: uint64 // akita impact
  // empty slot
  // empty slot
  // empty slot
}

export class arc4AkitaAppList extends arc4.Struct<{
  staking: arc4.Uint64
  rewards: arc4.Uint64
  pool: arc4.Uint64
  prizeBox: arc4.Uint64
  subscriptions: arc4.Uint64
  gate: arc4.Uint64
  auction: arc4.Uint64
  hyperSwap: arc4.Uint64
  raffle: arc4.Uint64
  metaMerkles: arc4.Uint64
  marketplace: arc4.Uint64
  akitaNFD: arc4.Uint64
  social: arc4.Uint64
  impact: arc4.Uint64
}> { }

export type PluginAppList = {
  optin: uint64
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
  optin: arc4.Uint64
  social: arc4.Uint64
  impact: arc4.Uint64
}> { }

export type OtherAppList = {
  vrfBeacon: uint64 // vrf beacon
  nfdRegistry: uint64 // NFD Registry
  assetInbox: uint64 // asset inbox
  escrowFactory: uint64 // escrow factory
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
  vrfBeacon: arc4.Uint64
  nfdRegistry: arc4.Uint64
  assetInbox: arc4.Uint64
  escrowFactory: arc4.Uint64
}> { }

export type AkitaDAOApps = {
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
  akitaNfd: uint64 // akita.algo NFD
  optin: uint64 // optin plugin
  social: uint64 // social plugin
  impact: uint64 // impact plugin
  vrfBeacon: uint64 // vrf beacon
  nfdRegistry: uint64 // NFD Registry
  assetInbox: uint64 // asset inbox
  escrowFactory: uint64 // escrow factory
}

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
  postFee: arc4.Uint64
  reactFee: arc4.Uint64
  impactTaxMin: arc4.Uint64
  impactTaxMax: arc4.Uint64
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
  creationFee: arc4.Uint64
  impactTaxMin: arc4.Uint64
  impactTaxMax: arc4.Uint64
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
  serviceCreationFee: arc4.Uint64
  paymentPercentage: arc4.Uint64
  triggerPercentage: arc4.Uint64
}> { }

export type SwapFees = {
  impactTaxMin: uint64
  impactTaxMax: uint64
}

export class arc4SwapFees extends arc4.Struct<{
  impactTaxMin: arc4.Uint64
  impactTaxMax: arc4.Uint64
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
  marketplaceSalePercentageMin: arc4.Uint64
  marketplaceSalePercentageMax: arc4.Uint64
  marketplaceComposablePercentage: arc4.Uint64
  marketplaceRoyaltyDefaultPercentage: arc4.Uint64
  shuffleSalePercentage: arc4.Uint64
  omnigemSaleFee: arc4.Uint64
  auctionCreationFee: arc4.Uint64
  auctionSaleImpactTaxMin: arc4.Uint64
  auctionSaleImpactTaxMax: arc4.Uint64
  auctionComposablePercentage: arc4.Uint64
  auctionRafflePercentage: arc4.Uint64
  raffleCreationFee: arc4.Uint64
  raffleSaleImpactTaxMin: arc4.Uint64
  raffleSaleImpactTaxMax: arc4.Uint64
  raffleComposablePercentage: arc4.Uint64
}> { }

export type AkitaDAOFees = {
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

export type AkitaProposalSettings = {
  
}

export class arc4Fees extends Struct<{
  postFee: arc4.Uint64
  reactFee: arc4.Uint64
  impactTaxMin: arc4.Uint64
  impactTaxMax: arc4.Uint64

  poolCreationFee: arc4.Uint64
  poolImpactTaxMin: arc4.Uint64
  poolImpactTaxMax: arc4.Uint64

  subscriptionServiceCreationFee: arc4.Uint64
  subscriptionPaymentPercentage: arc4.Uint64
  subscriptionTriggerPercentage: arc4.Uint64

  marketplaceSalePercentageMin: arc4.Uint64
  marketplaceSalePercentageMax: arc4.Uint64
  marketplaceComposablePercentage: arc4.Uint64
  marketplaceRoyaltyDefaultPercentage: arc4.Uint64

  shuffleSalePercentage: arc4.Uint64
  omnigemSaleFee: arc4.Uint64

  auctionCreationFee: arc4.Uint64
  auctionSaleImpactTaxMin: arc4.Uint64
  auctionSaleImpactTaxMax: arc4.Uint64
  auctionComposablePercentage: arc4.Uint64
  auctionRafflePercentage: arc4.Uint64

  raffleCreationFee: arc4.Uint64
  raffleSaleImpactTaxMin: arc4.Uint64
  raffleSaleImpactTaxMax: arc4.Uint64
  raffleComposablePercentage: arc4.Uint64

  swapFeeImpactTaxMin: arc4.Uint64
  swapFeeImpactTaxMax: arc4.Uint64
  swapComposablePercentage: arc4.Uint64
  swapLiquidityPercentage: arc4.Uint64

  krbyPercentage: arc4.Uint64
  moderatorPercentage: arc4.Uint64
}> { }

export type AkitaAssets = {
  /** the Akita token asset id */
  akta: uint64
  /** the Bones governance token asset id */
  bones: uint64
}

export class arc4AkitaAssets extends arc4.Struct<{
  akta: arc4.Uint64
  bones: arc4.Uint64
}> { }

export type ProposalSettings = {
  upgradeApp: uint64
  addPlugin: uint64
  removePlugin: uint64
  addAllowance: uint64
  removeAllowance: uint64
  updateField: uint64
}

/** arc4 variant of ProposalSettings */
export class arc4ProposalSettings extends arc4.Struct<{
  minimumProposalThreshold: arc4.Uint64
  minimumVoteThreshold: arc4.Uint64
}> { }

export type AkitaDAOMBRData = {
  plugins: uint64
  namedPlugins: uint64
  escrows: uint64
  receiveEscrows: uint64
  receiveAssets: uint64
  payoutEscrows: uint64
  allowances: uint64
  proposals: uint64
  proposalVotes: uint64
  executions: uint64
}