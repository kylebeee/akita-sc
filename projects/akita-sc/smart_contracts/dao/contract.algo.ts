import {
  Account,
  arc4,
  assert,
  BoxMap,
  bytes,
  Global,
  GlobalState,
  uint64,
  itxn,
  Bytes,
  Contract,
  abimethod,
  gtxn,
  assertMatch,
  Application,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, Txn } from '@algorandfoundation/algorand-typescript/op'
import { Address, decodeArc4, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AkitaDAOState,
  arc4AkitaAppList,
  arc4AkitaAssets,
  arc4EscrowInfo,
  arc4ExecutionInfo,
  arc4Fees,
  arc4NFTFees,
  arc4OtherAppList,
  arc4PluginAppList,
  arc4ProposalDetails,
  arc4ProposalSettings,
  arc4SocialFees,
  arc4StakingFees,
  arc4SubscriptionFees,
  arc4SwapFees,
  EscrowInfo,
  ExecutionKey,
} from './types'

import { ERR_ALREADY_INITIALIZED, ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_INCORRECT_SENDER, ERR_INVALID_RECEIVE_PAYMENT, ERR_VERSION_CANNOT_BE_EMPTY } from './errors'
import {
  AkitaDAOBoxPrefixExecutions,
  AkitaDAOBoxPrefixProposals,
  AkitaDAOGlobalStateKeysAkitaAppList,
  AkitaDAOGlobalStateKeysAkitaAssets,
  AkitaDAOGlobalStateKeysContentPolicy,
  AkitaDAOGlobalStateKeysDisbursementCursor,
  AkitaDAOGlobalStateKeysKrbyPercentage,
  AkitaDAOGlobalStateKeysMinimumRewardsImpact,
  AkitaDAOGlobalStateKeysModeratorPercentage,
  AkitaDAOGlobalStateKeysNFTFees,
  AkitaDAOGlobalStateKeysOtherAppList,
  AkitaDAOGlobalStateKeysPluginAppList,
  AkitaDAOGlobalStateKeysProposalID,
  AkitaDAOGlobalStateKeysProposalSettings,
  AkitaDAOGlobalStateKeysRevocationAddress,
  AkitaDAOGlobalStateKeysSocialFees,
  AkitaDAOGlobalStateKeysStakingFees,
  AkitaDAOGlobalStateKeysStatus,
  AkitaDAOGlobalStateKeysSubscriptionFees,
  AkitaDAOGlobalStateKeysSwapFees,
  AkitDAOBoxPrefixEscrows,
  STATUS_INIT,
} from './constants'
import { GlobalStateKeyVersion } from '../constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { fee } from '../utils/constants'

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

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  status = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysStatus })
  /** the version number of the DAO */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the raw 36 byte content policy of the protocol */
  contentPolicy = GlobalState<bytes>({ key: AkitaDAOGlobalStateKeysContentPolicy })
  /** the minimum impact score to qualify for daily disbursement */
  minimumRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysMinimumRewardsImpact })
  /** the list of akita contract ids */
  akitaAppList = GlobalState<arc4AkitaAppList>({ key: AkitaDAOGlobalStateKeysAkitaAppList })
  /** the list of plugin contract ids */
  pluginAppList = GlobalState<arc4PluginAppList>({ key: AkitaDAOGlobalStateKeysPluginAppList })
  /** the list of other contract ids we use */
  otherAppList = GlobalState<arc4OtherAppList>({ key: AkitaDAOGlobalStateKeysOtherAppList })
  /** fees associated with akita social */
  socialFees = GlobalState<arc4SocialFees>({ key: AkitaDAOGlobalStateKeysSocialFees })
  /** fees associated with staking assets */
  stakingFees = GlobalState<arc4StakingFees>({ key: AkitaDAOGlobalStateKeysStakingFees })
  /** fees associated with subscriptions */
  subscriptionFees = GlobalState<arc4SubscriptionFees>({ key: AkitaDAOGlobalStateKeysSubscriptionFees })
  /** fees associated with NFT sales */
  nftFees = GlobalState<arc4NFTFees>({ key: AkitaDAOGlobalStateKeysNFTFees })
  /** fees associated with swaps */
  swapFees = GlobalState<arc4SwapFees>({ key: AkitaDAOGlobalStateKeysSwapFees })
  /**
   * The percentage of total rewards allocated to krby expressed in the hundreds
   * eg. 3% is 300, 12.75% is 1275
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

  // BOXES ----------------------------------------------------------------------------------------

  /** voting state of a proposal */
  proposals = BoxMap<uint64, arc4ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** Group hashes that the DAO has approved to be submitted */
  executions = BoxMap<ExecutionKey, arc4ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })
  /** named escrow accounts the DAO uses */
  escrows = BoxMap<string, EscrowInfo>({ keyPrefix: AkitDAOBoxPrefixEscrows })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newProposalID(): uint64 {
    const id = this.proposalID.value
    this.proposalID.value += 1
    return id
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(): void {
    // TODO: Add the optin plugin immediately
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(): void { }

  init(
    version: arc4.Str,
    akta: arc4.UintN64,
    contentPolicy: arc4.StaticBytes<36>,
    minimumRewardsImpact: arc4.UintN64,
    fees: arc4Fees,
    proposalSettings: arc4ProposalSettings,
    revocationAddress: Address
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
      })
      .submit()

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
      creationFee: fees.poolCreationFee,
      impactTaxMin: fees.poolImpactTaxMin,
      impactTaxMax: fees.poolImpactTaxMax
    })

    this.subscriptionFees.value = new arc4SubscriptionFees({
      serviceCreationFee: fees.subscriptionServiceCreationFee,
      paymentPercentage: fees.subscriptionPaymentPercentage,
      triggerPercentage: fees.subscriptionTriggerPercentage,
    })

    this.nftFees.value = new arc4NFTFees({
      marketplaceSalePercentageMinimum: fees.marketplaceSalePercentageMinimum,
      marketplaceSalePercentageMaximum: fees.marketplaceSalePercentageMaximum,
      marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
      marketplaceRoyaltyDefaultPercentage: fees.marketplaceRoyaltyDefaultPercentage,
      omnigemSaleFee: fees.omnigemSaleFee,
      auctionCreationFee: fees.auctionCreationFee,
      auctionSaleImpactTaxMin: fees.auctionSaleImpactTaxMin,
      auctionSaleImpactTaxMax: fees.auctionSaleImpactTaxMax,
      auctionComposablePercentage: fees.auctionComposablePercentage,
      auctionRafflePercentage: fees.auctionRafflePercentage,
      raffleCreationFee: fees.raffleCreationFee,
      raffleSaleImpactTaxMin: fees.raffleSaleImpactTaxMin,
      raffleSaleImpactTaxMax: fees.raffleSaleImpactTaxMax,
      raffleComposablePercentage: fees.raffleComposablePercentage,
    })

    this.swapFees.value = new arc4SwapFees({
      impactTaxMin: fees.swapFeeImpactTaxMin,
      impactTaxMax: fees.swapFeeImpactTaxMax,
    })

    this.krbyPercentage.value = fees.krbyPercentage.native
    this.moderatorPercentage.value = fees.moderatorPercentage.native

    this.proposalSettings.value = new arc4ProposalSettings({
      minimumProposalThreshold: proposalSettings.minimumProposalThreshold,
      minimumVoteThreshold: proposalSettings.minimumVoteThreshold,
    })

    const bones = new UintN64(bonesCreateTxn.createdAsset.id)
    this.akitaAssets.value = new arc4AkitaAssets({ akta, bones })

    this.revocationAddress.value = revocationAddress.native
    this.proposalID.value = 0
  }

  // AKITA DAO METHODS ----------------------------------------------------------------------------

  newProposal(proposalType: uint64): void {
    const id = this.newProposalID()
  }

  createDailyDisbursement(): void {
    // calc the amount to distribute
    // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
    const [bonesAmount] = AssetHolding.assetBalance(
      Global.currentApplicationAddress,
      this.akitaAssets.value.bones.native
    )

    // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
    // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

    // distribute to krby

    // distribute to moderators

    // distribute to stakers
  }

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optinEscrow(payment: gtxn.PaymentTxn, name: string, asset: uint64): void {

    assert(this.escrows(name).exists, ERR_ESCROW_DOES_NOT_EXIST)

    const escrow = this.escrows(name).value
    const escrowAccount = Application(escrow.escrow).address

    assert(escrow.account.native === Txn.sender, ERR_INCORRECT_SENDER)
    assert(escrow.optinAllowed === true, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN)

    assertMatch(
      payment,
      {
        receiver: escrowAccount,
        amount: Global.assetOptInMinBalance,
      },
      ERR_INVALID_PAYMENT
    )

    itxn.assetTransfer({
      sender: escrowAccount,
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset,
      fee,
    }).submit()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  getState(): AkitaDAOState {
    return {
      status: new UintN64(this.status.value),
      version: new arc4.Str(this.version.value),
      contentPolicy: new arc4.StaticBytes<36>(this.contentPolicy.value),
      minimumRewardsImpact: new UintN64(this.minimumRewardsImpact.value),
      akitaAppList: this.akitaAppList.value.copy(),
      otherAppList: this.otherAppList.value.copy(),
      socialFees: this.socialFees.value.copy(),
      stakingFees: this.stakingFees.value.copy(),
      subscriptionFees: this.subscriptionFees.value.copy(),
      nftFees: this.nftFees.value.copy(),
      krbyPercentage: new UintN64(this.krbyPercentage.value),
      moderatorPercentage: new UintN64(this.moderatorPercentage.value),
      proposalSettings: this.proposalSettings.value.copy(),
      akitaAssets: this.akitaAssets.value.copy(),
      revocationAddress: new Address(this.revocationAddress.value),
    }
  }
}
