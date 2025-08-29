import { arc4, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Struct, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AddAllowanceInfo, MethodRestriction } from '../account/types';
import { CID } from '../../utils/types/base';

export type ProposalStatus = Uint8
export type ProposalActionType = Uint8
export type ProposalVoteType = Uint8
export type PayoutEscrowType = Uint8

export type ProposalUpgradeApp = {
  app: uint64
  executionKey: bytes<32>
  groups: bytes<32>[]
  firstValid: uint64
  lastValid: uint64
}

export type ProposalAddPlugin = {
  plugin: uint64,
  caller: Address,
  escrow: string,
  delegationType: Uint8,
  lastValid: uint64,
  cooldown: uint64,
  methods: MethodRestriction[],
  useRounds: boolean,
  useExecutionKey: boolean,
  defaultToEscrow: boolean,
  fee: uint64,
  power: uint64,
  duration: uint64,
  participation: uint64,
  approval: uint64
  sourceLink: string
  allowances: AddAllowanceInfo[]
}

export type ProposalAddNamedPlugin = {
  name: string,
  plugin: uint64,
  caller: Address,
  escrow: string,
  delegationType: Uint8,
  lastValid: uint64,
  cooldown: uint64,
  methods: MethodRestriction[],
  useRounds: boolean,
  useExecutionKey: boolean,
  defaultToEscrow: boolean,
  fee: uint64,
  power: uint64,
  duration: uint64,
  participation: uint64,
  approval: uint64
  sourceLink: string
  allowances: AddAllowanceInfo[]
}

export type ProposalExecutePlugin = {
  plugin: uint64
  escrow: string
  executionKey: bytes<32>
  groups: bytes<32>[]
  firstValid: uint64
  lastValid: uint64
}

export type ProposalExecuteNamedPlugin = {
  name: string
  executionKey: bytes<32>
  groups: bytes<32>[]
  firstValid: uint64
  lastValid: uint64
}

export type ProposalRemoveExecutePlugin = {
  executionKey: bytes<32>
}

export type ProposalRemovePlugin = {
  plugin: uint64
  caller: Address
  escrow: string
}

export type ProposalRemoveNamedPlugin = {
  name: string
  plugin: uint64
  caller: Address
  escrow: string
}

export type ProposalAddAllowances = {
  escrow: string
  allowances: AddAllowanceInfo[]
}

export type ProposalRemoveAllowances = {
  escrow: string
  assets: uint64[]
}

// export type EscrowType = Uint8

// export const EscrowTypeDefault: EscrowType = new Uint8(0)
// export const EscrowTypeReceive: EscrowType = new Uint8(10)
// export const EscrowTypePayout: EscrowType = new Uint8(20)

export type ProposalNewEscrow = {
  escrow: string
}

export type ProposalToggleEscrowLock = {
  escrow: string
}

export type ProposalUpdateField = {
  field: string
  value: bytes
}

export type ProposalDetails = {
  // the status of the proposal
  status: ProposalStatus
  // markdown content description of the proposal
  cid: CID
  // vote counters
  votes: ProposalVoteTotals
  // the origin address of the proposal creator
  creator: Address
  // the timestamp the proposal went to voting
  votingTs: uint64
  // the timestamp the proposal was created
  created: uint64
  // the fees paid to create the proposal
  feesPaid: uint64
  // the actions
  actions: ProposalAction[]
}

export type ProposalAction = {
  // the action type the proposal wants to take
  type: ProposalActionType
  // the data specific to the proposal action
  data: bytes
}

export type ProposalVoteTotals = {
  approvals: uint64
  rejections: uint64
  abstains: uint64
}

export type ProposalVoteKey = {
  proposalID: uint64
  voter: Address
}

export type ProposalVoteInfo = {
  type: ProposalVoteType
  power: uint64
}


export type ExecutionInfo = {
  /** whether the txn group has been executed */
  executed: boolean
  /** The last round at which this plugin can be called */
  lastValidRound: uint64
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
  walletFactory: uint64 // abstracted account factory
  social: uint64 // akita social
  impact: uint64 // akita impact
  // empty slot
}

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
  // empty slot
  // empty slot
}

export type OtherAppList = {
  vrfBeacon: uint64 // vrf beacon
  nfdRegistry: uint64 // NFD Registry
  assetInbox: uint64 // asset inbox
  escrowFactory: uint64 // escrow factory
  akitaNfd: uint64 // akita.algo NFD
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
  walletFactory: uint64 // abstracted account factory
  escrowFactory: uint64 // escrow factory
}

export type WalletFees = {
  /** the fee the DAO charges for wallet creation */
  createFee: uint64
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
  walletCreateFee: uint64

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

export type DAOPluginKey = {
  plugin: uint64
  escrow: string
}

export type ProposalSettings = {
  // the minimum amount of ALGO needed to create a proposal
  fee: uint64
  // the minimum power needed to create a proposal
  power: uint64
  /** the minimum duration of the voting period */
  duration: uint64
  /** the minimum participation % needed for a proposal to be valid, basis points in the thousands so 1_000 = 1% */
  participation: uint64
  /** the minimum approval % needed for a proposal to be valid, basis points in the thousands so 1_000 = 1% */
  approval: uint64
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