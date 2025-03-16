import { Account, arc4, assert, BoxMap, bytes, Global, GlobalState, uint64, itxn, Bytes, Contract, abimethod, gtxn, Asset } from '@algorandfoundation/algorand-typescript';
import { AkitaAssets, AkitaDAOState, AppList, arc4AkitaAssets, arc4AppList, arc4ExecutionInfo, arc4Fees, arc4NFTFees, arc4ProposalDetails, arc4ProposalSettings, arc4SocialFees, arc4StakingFees, arc4SubscriptionFees, ExecutionInfo, ExecutionKey, NFTFees, ProposalDetails, ProposalSettings, SocialFees, StakingFees, SubscriptionFees } from './types';

import { ERR_ALREADY_INITIALIZED, ERR_INVALID_RECEIVE_PAYMENT, ERR_VERSION_CANNOT_BE_EMPTY } from './errors';
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op';
import { AkitaDAOBoxPrefixExecutions, AkitaDAOBoxPrefixProposals, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysAppList, AkitaDAOGlobalStateKeysContentPolicy, AkitaDAOGlobalStateKeysDisbursementCursor, AkitaDAOGlobalStateKeysKrbyPercentage, AkitaDAOGlobalStateKeysMinimumRewardsImpact, AkitaDAOGlobalStateKeysModeratorPercentage, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysProposalID, AkitaDAOGlobalStateKeysProposalSettings, AkitaDAOGlobalStateKeysRevocationAddress, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysStatus, AkitaDAOGlobalStateKeysSubscriptionFees } from './constants';
import { GlobalStateKeyVersion } from '../constants';

const STATUS_INIT: uint64 = 0;
// const STATUS_LOADING_REWARDS = 1;
// const STATUS_DISTRIBUTING_REWARDS = 2;
// const STATUS_RUNNING = 3;

// const DEFAULT_VERSION: string = '1.0';
// const DEFAULT_CONTENT_POLICY: string = 'ipfs://mrehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh';
// const DEFAULT_MINIMUM_REWARDS_IMPACT = 400;
// const DEFAULT_SOCIAL_POST_FEE = 100_000_000;
// const DEFAULT_SOCIAL_REACT_FEE = 10_000_000;
// const DEFAULT_STAKING_POOL_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_SERVICE_CREATION_FEE = 50_000_000;
// const DEFAULT_SUBSCRIPTION_PAYMENT_PERCENTAGE_FEE = 4;
// const DEFAULT_OMNIGEM_SALE_FEE = 100_000_000;
// const DEFAULT_NFT_LISTING_CREATION_FEE = 1_000_000;
// const DEFAULT_NFT_SHUFFLE_CREATION_FEE = 10_000_000;
// const DEFAULT_AUCTION_CREATION_FEE = 10_000_000;
// const DEFAULT_HYPER_SWAP_FEE = 10_000_000;
// const DEFAULT_KRBY_PERCENTAGE_FEE = 30;
// const DEFAULT_MODERATOR_PERCENTAGE_FEE = 4;
// const DEFAULT_MINIMUM_PROPOSAL_THRESHOLD = 10;
// const DEFAULT_MINIMUM_VOTE_THRESHOLD = 10;

export const STATUS_DRAFT: uint64 = 0;
export const STATUS_INVALID: uint64 = 1;
export const STATUS_PROPOSED: uint64 = 2;
export const STATUS_VOTING: uint64 = 3;

export const STATUS_REJECTED: uint64 = 9;
export const STATUS_APPROVED: uint64 = 10;

export const PROPOSAL_TYPE_UPDATE_CONTENT_POLICY: uint64 = 0;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_REWARD_IMPACT: uint64 = 1;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_POST_FEE: uint64 = 2;
export const PROPOSAL_TYPE_UPDATE_SOCIAL_REACT_FEE: uint64 = 3;
export const PROPOSAL_TYPE_UPDATE_STAKING_POOL_CREATION_FEE: uint64 = 4;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_SERVICE_CREATION_FEE: uint64 = 5;
export const PROPOSAL_TYPE_UPDATE_SUBSCRIPTION_PAYMENT_FEE: uint64 = 6;
export const PROPOSAL_TYPE_UPDATE_OMNIGEM_SALE_FEE: uint64 = 7;
export const PROPOSAL_TYPE_UPDATE_NFT_LISTING_CREATION_FEE: uint64 = 8;
export const PROPOSAL_TYPE_UPDATE_NFT_SHUFFLE_CREATION_FEE: uint64 = 9;
export const PROPOSAL_TYPE_UPDATE_AUCTION_CREATION_FEE: uint64 = 10;
export const PROPOSAL_TYPE_UPDATE_HYPER_SWAP_FEE: uint64 = 11;
export const PROPOSAL_TYPE_UPDATE_KRBY_FEE: uint64 = 12;
export const PROPOSAL_TYPE_UPDATE_MODERATOR_FEE: uint64 = 13;
export const PROPOSAL_TYPE_UPDATE_MINIMUM_VOTE_THRESHOLD: uint64 = 14;
export const PROPOSAL_TYPE_UPDATE_REVOCATION_ADDRESS: uint64 = 15;

export const PROPOSAL_TYPE_UPDATE_AKITA_DAO: uint64 = 16;
export const PROPOSAL_TYPE_UPDATE_ABSTRACTED_ACCOUNT_FACTORY: uint64 = 17;
export const PROPOSAL_TYPE_UPDATE_AKITA_SOCIAL: uint64 = 18;

export const PROPOSAL_TYPE_ADD_DAO_PLUGIN: uint64 = 19;
export const PROPOSAL_TYPE_USE_DAO_PLUGIN: uint64 = 20;
export const PROPOSAL_TYPE_REMOVE_DAO_PLUGIN: uint64 = 21;

export const PROPOSAL_TYPE_ADD_AKITA_SOCIAL_MODERATOR: uint64 = 22;
export const PROPOSAL_TYPE_REMOVE_AKITA_SOCIAL_MODERATOR: uint64 = 23;

export const PROPOSAL_TYPE_ADD_SOCIAL_ACTION: uint64 = 24;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_ACTION: uint64 = 25;

export const PROPOSAL_TYPE_ADD_SOCIAL_GATE: uint64 = 26;
export const PROPOSAL_TYPE_REMOVE_SOCIAL_GATE: uint64 = 27;

export const PLUGIN_STATUS_APPROVED: uint64 = 1;

/**
 * The Akita DAO contract has several responsibilities:
 * [-] Manages the disbursement of the bones token
 * [x] Manages the content policy of the protocol
 * [-] Manages the minimum impact score to qualify for daily disbursement
 * [x] Sets the fee to post on akita social
 * [x] Sets the fee to react on akita social
 * [-] Sets the fee structure for Akita Staking
 * [x] Sets the fee structure for Akita Subscriptions
 * [-] Sets the fee structure for Akita NFT Listings
 * [-] Sets the fee structure for Akita NFT Shuffles
 * [-] Sets the fee structure for Akita Auctions
 * [-] Sets the fee structure for Akita Asset Swaps
 */

export class AkitaDAO extends Contract {
  /** state of the DAO */
  status = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysStatus })
  /** the version number of the DAO */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the raw 36 byte content policy of the protocol */
  contentPolicy = GlobalState<bytes>({ key: AkitaDAOGlobalStateKeysContentPolicy })
  /** the minimum impact score to qualify for daily disbursement */
  minimumRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysMinimumRewardsImpact })
  /** the list of akita contract ids */
  appList = GlobalState<arc4AppList>({ key: AkitaDAOGlobalStateKeysAppList })
  /** fees associated with akita social */
  socialFees = GlobalState<arc4SocialFees>({ key: AkitaDAOGlobalStateKeysSocialFees })
  /** fees associated with staking assets */
  stakingFees = GlobalState<arc4StakingFees>({ key: AkitaDAOGlobalStateKeysStakingFees })
  /** fees associated with subscriptions */
  subscriptionFees = GlobalState<arc4SubscriptionFees>({ key: AkitaDAOGlobalStateKeysSubscriptionFees })
  /** fees associated with NFT sales */
  nftFees = GlobalState<arc4NFTFees>({ key: AkitaDAOGlobalStateKeysNFTFees })
  /**
   * The percentage of total rewards allocated to krby expressed in the hundreds
   * eg. 3% is 300, 12.75% is 1275
   * 
  */
  krbyPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysKrbyPercentage })
  /** moderator fee */
  moderatorPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysModeratorPercentage })
  /** the akita assets */
  akitaAssets = GlobalState<arc4AkitaAssets>({ key: AkitaDAOGlobalStateKeysAkitaAssets })

  // internal state variables
  proposalSettings = GlobalState<arc4ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalSettings })

  /** revocation msig */
  revocationAddress = GlobalState<Account>({ key: AkitaDAOGlobalStateKeysRevocationAddress })
  /** the next proposal id */
  proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalID })
  /** the daily disbursement cursor */
  disbursementCursor = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysDisbursementCursor })


  /** voting state of a proposal */
  proposals = BoxMap<uint64, arc4ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })

  /**
   * Group hashes that the DAO has approved to be submitted
   */
  executions = BoxMap<ExecutionKey, arc4ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })

  private newProposalID(): uint64 {
    const id = this.proposalID.value
    this.proposalID.value += 1
    return id
  }

  createApplication(): void {
    // TODO: Add the optin plugin immediately
  }

  // @ts-ignore
  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(): void {

  }

  init(
    version: arc4.Str,
    akta: arc4.UintN64,
    contentPolicy: arc4.StaticBytes<36>,
    minimumRewardsImpact: arc4.UintN64,
    fees: arc4Fees,
    proposalSettings: arc4ProposalSettings,
    revocationAddress: arc4.Address,
  ): void {
    assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
    assert(version.native !== '', ERR_VERSION_CANNOT_BE_EMPTY)

    const bonesCreateTxn = itxn
      .assetConfig({
        configAsset: 0,
        assetName: Bytes('Bones'),
        unitName: Bytes('BONES'),
        total: 100_000_000_000_000,
        decimals: 2,
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        freeze: Global.zeroAddress,
        clawback: Global.zeroAddress,
        defaultFrozen: false,
        url: Bytes(''), // TODO: figure out the URL we should have here
        metadataHash: Bytes(''), // TODO: figure out the metadata hash we should have here
      }).submit()

    this.status.value = STATUS_INIT
    this.version.value = version.native
    this.contentPolicy.value = contentPolicy.native
    this.minimumRewardsImpact.value = minimumRewardsImpact.native

    this.socialFees.value = new arc4SocialFees({
      postFee: fees.postFee,
      reactFee: fees.reactFee,
      impactTaxMin: fees.impactTaxMin,
      impactTaxMax: fees.impactTaxMax,
    })

    this.stakingFees.value = new arc4StakingFees({
      rewardsFee: fees.rewardsFee,
      poolCreationFee: fees.poolCreationFee,
    })

    this.subscriptionFees.value = new arc4SubscriptionFees({
      serviceCreationFee: fees.subscriptionServiceCreationFee,
      paymentPercentage: fees.subscriptionPaymentPercentage,
      triggerPercentage: fees.subscriptionTriggerPercentage,
    })

    this.nftFees.value = new arc4NFTFees({
      omnigemSaleFee: fees.omnigemSaleFee,
      marketplaceSalePercentageMinimum: fees.marketplaceSalePercentageMinimum,
      marketplaceSalePercentageMaximum: fees.marketplaceSalePercentageMaximum,
      marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
      shuffleSalePercentage: fees.shuffleSalePercentage,
      auctionSalePercentageMinimum: fees.auctionSalePercentageMinimum,
      auctionSalePercentageMaximum: fees.auctionSalePercentageMaximum,
      auctionComposablePercentage: fees.auctionComposablePercentage,
    })

    this.krbyPercentage.value = fees.krbyPercentage.native
    this.moderatorPercentage.value = fees.moderatorPercentage.native

    this.proposalSettings.value = new arc4ProposalSettings({
      minimumProposalThreshold: proposalSettings.minimumProposalThreshold,
      minimumVoteThreshold: proposalSettings.minimumVoteThreshold,
    })

    const bones = new arc4.UintN64(bonesCreateTxn.createdAsset.id)
    this.akitaAssets.value = new arc4AkitaAssets({ akta, bones })

    this.revocationAddress.value = revocationAddress.native;
    this.proposalID.value = 0;
  }

  newProposal(proposalType: uint64): void {
    const id = this.newProposalID();


  }

  createDailyDisbursement(): void {

    // calc the amount to distribute
    // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
    const [bonesAmount] = AssetHolding.assetBalance(Global.currentApplicationAddress, this.akitaAssets.value.bones.native);


    // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
    // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

    // distribute to krby

    // distribute to moderators

    // distribute to stakers
  }

  receivePayment(payment: gtxn.PaymentTxn): void {
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_RECEIVE_PAYMENT)
    // TODO: track the payment in some way
  }

  receiveAsaPayment(xfer: gtxn.AssetTransferTxn): void {
    assert(xfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_RECEIVE_PAYMENT);
  }

  getState(): AkitaDAOState {
    return {
      status: new arc4.UintN64(this.status.value),
      version: new arc4.Str(this.version.value),
      contentPolicy: new arc4.StaticBytes<36>(this.contentPolicy.value),
      minimumRewardsImpact: new arc4.UintN64(this.minimumRewardsImpact.value),
      appList: this.appList.value,
      socialFees: this.socialFees.value,
      stakingFees: this.stakingFees.value,
      subscriptionFees: this.subscriptionFees.value,
      nftFees: this.nftFees.value,
      krbyPercentage: new arc4.UintN64(this.krbyPercentage.value),
      moderatorPercentage: new arc4.UintN64(this.moderatorPercentage.value),
      proposalSettings: this.proposalSettings.value,
      akitaAssets: this.akitaAssets.value,
      revocationAddress: new arc4.Address(this.revocationAddress.value),
    }
  }
}