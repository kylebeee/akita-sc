import { Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, clone, Contract, GlobalState, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { ProposalStatus, ProposalVoteType } from "./types";
import { AbstractAccountBoxPrefixPlugins, ABSTRACTED_ACCOUNT_MINT_PAYMENT } from "../account/constants";
import { AddAllowanceInfo, ExecutionKey } from "../account/types";
import { AkitaDAOGlobalStateKeysContentPolicy, AkitaDAOGlobalStateKeysInitialized } from "../../dao/constants";
import { GlobalStateKeyVersion } from "../../constants";
import { CID } from "../../utils/types/base";
import { AkitaDAOBoxPrefixPayoutEscrows, AkitaDAOBoxPrefixProposals, AkitaDAOBoxPrefixProposalVotes, AkitaDAOBoxPrefixReceiveAssets, AkitaDAOBoxPrefixReceiveEscrows, AkitaDAOEscrowAccountGovernors, AkitaDAOEscrowAccountKrby, AkitaDAOEscrowAccountModerators, AkitaDAOGlobalStateKeysAddAllowanceProposalSettings, AkitaDAOGlobalStateKeysAddPluginProposalSettings, AkitaDAOGlobalStateKeysAkitaAppList, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysKrbyPercentage, AkitaDAOGlobalStateKeysMinRewardsImpact, AkitaDAOGlobalStateKeysModeratorPercentage, AkitaDAOGlobalStateKeysNewEscrowProposalSettings, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysOtherAppList, AkitaDAOGlobalStateKeysPluginAppList, AkitaDAOGlobalStateKeysProposalFee, AkitaDAOGlobalStateKeysProposalID, AkitaDAOGlobalStateKeysRemoveAllowanceProposalSettings, AkitaDAOGlobalStateKeysRemoveExecutePluginProposalSettings, AkitaDAOGlobalStateKeysRemovePluginProposalSettings, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysSubscriptionFees, AkitaDAOGlobalStateKeysSwapFees, AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings, AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings, AkitaDAOGlobalStateKeysUpgradeAppProposalSettings, AkitaDAOGlobalStateKeysWalletID, DAOProposalVotesMBR, DAOReceiveAssetsMBR, DAOReceiveEscrowsMBR, EscrowDisbursementPhaseAllocation, EscrowDisbursementPhaseFinalization, EscrowDisbursementPhaseIdle, MinDAOPayoutEscrowsMBR, PayoutEscrowTypeGroup, PayoutEscrowTypeIndividual, ProposalActionTypeAddAllowance, ProposalActionTypeAddNamedPlugin, ProposalActionTypeAddPlugin, ProposalActionTypeExecuteNamedPlugin, ProposalActionTypeExecutePlugin, ProposalActionTypeNewEscrow, ProposalActionTypeRemoveAllowance, ProposalActionTypeRemoveExecutePlugin, ProposalActionTypeRemoveNamedPlugin, ProposalActionTypeRemovePlugin, ProposalActionTypeToggleEscrowLock, ProposalActionTypeUpdateFields, ProposalActionTypeUpgradeApp, ProposalStatusApproved, ProposalStatusDraft, ProposalStatusExecuted, ProposalStatusRejected, ProposalStatusVoting, ProposalVoteTypeAbstain, ProposalVoteTypeApprove, ProposalVoteTypeReject } from "./constants";
import { AkitaAppList, AkitaAssets, AkitaDAOApps, AkitaDAOFees, DAOPluginKey, EscrowAssetKey, EscrowTypeDefault, EscrowTypePayout, EscrowTypeReceive, NFTFees, OtherAppList, PayoutEscrowInfo, PluginAppList, ProposalAction, ProposalAddAllowances, ProposalAddNamedPlugin, ProposalAddPlugin, ProposalDetails, ProposalExecuteNamedPlugin, ProposalExecutePlugin, ProposalNewEscrow, ProposalNewIndividualPayout, ProposalNewIndividualPayoutEscrow, ProposalNewPoolPayout, ProposalNewPoolPayoutEscrow, ProposalNewReceive, ProposalNewReceiveEscrow, ProposalRemoveAllowances, ProposalRemoveNamedPlugin, ProposalRemovePlugin, ProposalSettings, ProposalToggleEscrowLock, ProposalUpdateField, ProposalUpgradeApp, ProposalVoteInfo, ProposalVoteKey, ReceiveEscrowInfo, SocialFees, StakingFees, SubscriptionFees, SwapFees } from "../../dao/types";
import { BoxCostPerByte } from "../../utils/constants";
import { abiCall, abimethod, Address, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { AssetHolding, btoi, Global, itob, Txn } from "@algorandfoundation/algorand-typescript/op";
import { AbstractedAccountFactoryInterface, AbstractedAccountInterface } from "../../utils/abstract-account";
import { ERR_ALREADY_INITIALIZED, ERR_ASSET_ALREADY_ALLOCATED, ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_OPTED_IN, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD, ERR_INVALID_PROPOSAL_ACTION, ERR_INVALID_PROPOSAL_STATE, ERR_INVALID_PROPOSAL_STATUS, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_VERSION_CANNOT_BE_EMPTY } from "../../dao/errors";
import { calcPercent, getOrigin, getStakingPower, percentageOf } from "../../utils/functions";
import { ONE_DAY } from "../plugins/social/constants";
import { ERR_INVALID_PAYMENT } from "../../utils/errors";
import { ERR_VOTING_DURATION_NOT_MET, ERR_VOTING_PARTICIPATION_NOT_MET } from "./errors";
import { ERR_FORBIDDEN } from "../account/errors";

export class AkitaDAO extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  initialized = GlobalState<boolean>({ initialValue: false, key: AkitaDAOGlobalStateKeysInitialized })
  /** the version number of the DAO */
  version = GlobalState<string>({ initialValue: '', key: GlobalStateKeyVersion })
  /** the arc58 wallet the DAO controls */
  walletID = GlobalState<uint64>({ initialValue: 0, key: AkitaDAOGlobalStateKeysWalletID })
  /** the raw 36 byte content policy of the protocol */
  contentPolicy = GlobalState<CID>({ key: AkitaDAOGlobalStateKeysContentPolicy })
  /** the minimum impact score to qualify for daily disbursement */
  minRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysMinRewardsImpact })
  /** the list of akita contract ids */
  akitaAppList = GlobalState<AkitaAppList>({ key: AkitaDAOGlobalStateKeysAkitaAppList })
  /** the list of plugin contract ids */
  pluginAppList = GlobalState<PluginAppList>({ key: AkitaDAOGlobalStateKeysPluginAppList })
  /** the list of other contract ids we use */
  otherAppList = GlobalState<OtherAppList>({ key: AkitaDAOGlobalStateKeysOtherAppList })
  /** fees associated with akita social */
  socialFees = GlobalState<SocialFees>({ key: AkitaDAOGlobalStateKeysSocialFees })
  /** fees associated with staking assets */
  stakingFees = GlobalState<StakingFees>({ key: AkitaDAOGlobalStateKeysStakingFees })
  /** fees associated with subscriptions */
  subscriptionFees = GlobalState<SubscriptionFees>({ key: AkitaDAOGlobalStateKeysSubscriptionFees })
  /** fees associated with NFT sales */
  nftFees = GlobalState<NFTFees>({ key: AkitaDAOGlobalStateKeysNFTFees })
  /** fees associated with swaps */
  swapFees = GlobalState<SwapFees>({ key: AkitaDAOGlobalStateKeysSwapFees })
  /**
   * The percentage of total rewards allocated to krby expressed in the hundreds
   * eg. 3% is 300, 12.75% is 1275
   */
  krbyPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysKrbyPercentage })
  /** moderator fee */
  moderatorPercentage = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysModeratorPercentage })
  /** fee for creating new proposals */
  proposalFee = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalFee })
  /** the akita assets */
  akitaAssets = GlobalState<AkitaAssets>({ key: AkitaDAOGlobalStateKeysAkitaAssets })

  /** The default settings for creating proposals by proposal action */
  /** proposal settings for upgrading applications */
  upgradeAppProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysUpgradeAppProposalSettings })
  /** proposal settings for adding a plugin */
  addPluginProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysAddPluginProposalSettings })
  /** proposal settings for removing a plugin */
  removePluginProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysRemovePluginProposalSettings })
  /** proposal settings for removing a plugin execution */
  removeExecutePluginProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysRemoveExecutePluginProposalSettings })
  /** proposal settings for adding an allowance */
  addAllowanceProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysAddAllowanceProposalSettings })
  /** proposal settings for removing an allowance */
  removeAllowanceProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysRemoveAllowanceProposalSettings })
  /** proposal settings for creating a new escrow */
  newEscrowProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysNewEscrowProposalSettings })
  /** proposal settings for toggling an escrow lock */
  toggleEscrowLockProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings })
  /** proposal settings for updating fields */
  updateFieldsProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings })
  /** the next proposal id */
  proposalID = GlobalState<uint64>({ initialValue: 0, key: AkitaDAOGlobalStateKeysProposalID })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<DAOPluginKey, ProposalSettings>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** escrow accounts for services to payback revenue to the DAO */
  receiveEscrows = BoxMap<uint64, ReceiveEscrowInfo>({ keyPrefix: AkitaDAOBoxPrefixReceiveEscrows })
  /** box map of escrow assets that have already been processed during this allocation */
  receiveAssets = BoxMap<EscrowAssetKey, bytes<0>>({ keyPrefix: AkitaDAOBoxPrefixReceiveAssets })
  /** escrow accounts meant to payout recipients */
  payoutEscrows = BoxMap<uint64, PayoutEscrowInfo>({ keyPrefix: AkitaDAOBoxPrefixPayoutEscrows })
  /** voting state of a proposal */
  proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** votes by proposal id & address */
  proposalVotes = BoxMap<ProposalVoteKey, ProposalVoteInfo>({ keyPrefix: AkitaDAOBoxPrefixProposalVotes })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private pluginsMbr(methodCount: uint64): uint64 {
    return 0
  }

  private receiveEscrowsMbr(): uint64 {
    return DAOReceiveEscrowsMBR
  }

  private receiveAssetsMbr(): uint64 {
    return DAOReceiveAssetsMBR
  }

  private payoutEscrowsMbr(data: bytes): uint64 {
    return MinDAOPayoutEscrowsMBR + (BoxCostPerByte * data.length)
  }

  private addPlugin(data: ProposalAddNamedPlugin): void {
    const {
      name,
      plugin,
      caller,
      escrow,
      delegationType,
      lastValid,
      cooldown,
      methods,
      useRounds,
      create,
      duration,
      participation,
      approval,
      allowances
    } = clone(data);

    let useExecutionKey = false

    if (caller.native === Global.currentApplicationAddress) {
      useExecutionKey = true
      this.plugins({ plugin, escrow }).value = {
        create,
        duration,
        participation,
        approval
      }
    }

    if (name !== '') {
      abiCall(
        AbstractedAccountInterface.prototype.arc58_addNamedPlugin,
        {
          appId: this.walletID.value,
          args: [
            name,
            plugin,
            caller,
            escrow,
            false,
            delegationType,
            lastValid,
            cooldown,
            methods,
            useRounds,
            useExecutionKey
          ]
        }
      )
    } else {
      abiCall(
        AbstractedAccountInterface.prototype.arc58_addPlugin,
        {
          appId: this.walletID.value,
          args: [
            plugin,
            caller,
            escrow,
            false,
            delegationType,
            lastValid,
            cooldown,
            methods,
            useRounds,
            useExecutionKey
          ]
        }
      )
    }

    if (escrow !== '' && allowances.length > 0) {
      this.addAllowances(escrow, allowances)
    }
  }

  private addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void {
    abiCall(
      AbstractedAccountInterface.prototype.arc58_addAllowances,
      {
        appId: this.walletID.value,
        args: [escrow, allowances]
      }
    )
  }

  private removeAllowances(escrow: string, assets: uint64[]): void {
    abiCall(
      AbstractedAccountInterface.prototype.arc58_removeAllowances,
      {
        appId: this.walletID.value,
        args: [escrow, assets]
      }
    )
  }

  private removePlugin(data: ProposalRemoveNamedPlugin): void {
    const { name, plugin, caller, escrow } = data

    if (caller.native === Global.currentApplicationAddress) {
      this.plugins({ plugin, escrow }).delete()
    }

    if (name !== '') {
      abiCall(
        AbstractedAccountInterface.prototype.arc58_removeNamedPlugin,
        {
          appId: this.walletID.value,
          args: [name]
        }
      )
      return
    }

    abiCall(
      AbstractedAccountInterface.prototype.arc58_removePlugin,
      {
        appId: this.walletID.value,
        args: [plugin, caller, escrow]
      }
    )
  }

  private newEscrow(escrow: string): uint64 {
    return abiCall(
      AbstractedAccountInterface.prototype.arc58_newEscrow,
      {
        appId: this.walletID.value,
        args: [escrow]
      }
    ).returnValue
  }

  private toggleEscrowLock(escrow: string): boolean {
    return abiCall(
      AbstractedAccountInterface.prototype.arc58_toggleEscrowLock,
      {
        appId: this.walletID.value,
        args: [escrow]
      }
    ).returnValue
  }

  private getEscrow(escrow: string, must: boolean): uint64 {
    if (must) {
      return abiCall(
        AbstractedAccountInterface.prototype.arc58_mustGetEscrow,
        {
          appId: this.walletID.value,
          args: [escrow]
        }
      ).returnValue;
    }

    return abiCall(
      AbstractedAccountInterface.prototype.arc58_getEscrow,
      {
        appId: this.walletID.value,
        args: [escrow]
      }
    ).returnValue;
  }

  private newPoolPayoutEscrow(data: ProposalNewPoolPayoutEscrow): uint64 {
    const { escrow, poolID } = clone(data)

    const escrowID = this.newEscrow(escrow)
    this.payoutEscrows(escrowID).value = {
      type: PayoutEscrowTypeGroup,
      data: Bytes(itob(poolID))
    }

    return escrowID
  }

  private newReceiveEscrow(data: ProposalNewReceiveEscrow): uint64 {
    const { source, allocatable, optinAllowed, escrow } = clone(data)

    const escrowID = this.newEscrow(escrow)

    this.receiveEscrows(escrowID).value = {
      source,
      allocatable,
      optinAllowed,
      optinCount: 0,
      phase: EscrowDisbursementPhaseIdle,
      allocationCounter: 0,
      lastDisbursement: 0,
      creationDate: Global.latestTimestamp,
    }

    return escrowID;
  }

  private updateField(field: string, value: bytes): void {
    switch (field) {
      case AkitaDAOGlobalStateKeysContentPolicy: {
        this.contentPolicy.value = value.toFixed({ length: 36 })
        break
      }
      case AkitaDAOGlobalStateKeysMinRewardsImpact: {
        this.minRewardsImpact.value = btoi(value)
        break
      }
      case AkitaDAOGlobalStateKeysAkitaAppList: {
        const akitaAppList = decodeArc4<AkitaAppList>(value)
        this.akitaAppList.value = clone(akitaAppList)
        break
      }
      case AkitaDAOGlobalStateKeysPluginAppList: {
        const pluginAppList = decodeArc4<PluginAppList>(value)
        this.pluginAppList.value = clone(pluginAppList)
        break
      }
      case AkitaDAOGlobalStateKeysOtherAppList: {
        const otherAppList = decodeArc4<OtherAppList>(value)
        this.otherAppList.value = clone(otherAppList)
        break
      }
      case AkitaDAOGlobalStateKeysSocialFees: {
        const socialFees = decodeArc4<SocialFees>(value)
        this.socialFees.value = clone(socialFees)
        break
      }
      case AkitaDAOGlobalStateKeysStakingFees: {
        const stakingFees = decodeArc4<StakingFees>(value)
        this.stakingFees.value = clone(stakingFees)
        break
      }
      case AkitaDAOGlobalStateKeysSubscriptionFees: {
        const subscriptionFees = decodeArc4<SubscriptionFees>(value)
        this.subscriptionFees.value = clone(subscriptionFees)
        break
      }
      case AkitaDAOGlobalStateKeysNFTFees: {
        const nftFees = decodeArc4<NFTFees>(value)
        this.nftFees.value = clone(nftFees)
        break
      }
      case AkitaDAOGlobalStateKeysSwapFees: {
        const swapFees = decodeArc4<SwapFees>(value)
        this.swapFees.value = clone(swapFees)
        break
      }
      case AkitaDAOGlobalStateKeysKrbyPercentage: {
        this.krbyPercentage.value = btoi(value)
        break
      }
      case AkitaDAOGlobalStateKeysModeratorPercentage: {
        this.moderatorPercentage.value = btoi(value)
        break
      }
      case AkitaDAOGlobalStateKeysProposalFee: {
        this.proposalFee.value = btoi(value)
        break
      }
      case AkitaDAOGlobalStateKeysAkitaAssets: {
        this.akitaAssets.value = decodeArc4<AkitaAssets>(value)
        break
      }
      case AkitaDAOGlobalStateKeysUpgradeAppProposalSettings: {
        const upgradeAppSettings = decodeArc4<ProposalSettings>(value)
        this.upgradeAppProposalSettings.value = clone(upgradeAppSettings)
        break
      }
      case AkitaDAOGlobalStateKeysAddPluginProposalSettings: {
        const addPluginSettings = decodeArc4<ProposalSettings>(value)
        this.addPluginProposalSettings.value = clone(addPluginSettings)
        break
      }
      case AkitaDAOGlobalStateKeysRemovePluginProposalSettings: {
        const removePluginSettings = decodeArc4<ProposalSettings>(value)
        this.removePluginProposalSettings.value = clone(removePluginSettings)
        break
      }
      case AkitaDAOGlobalStateKeysAddAllowanceProposalSettings: {
        const addAllowanceSettings = decodeArc4<ProposalSettings>(value)
        this.addAllowanceProposalSettings.value = clone(addAllowanceSettings)
        break
      }
      case AkitaDAOGlobalStateKeysRemoveAllowanceProposalSettings: {
        const removeAllowanceSettings = decodeArc4<ProposalSettings>(value)
        this.removeAllowanceProposalSettings.value = clone(removeAllowanceSettings)
        break
      }
      case AkitaDAOGlobalStateKeysNewEscrowProposalSettings: {
        const newEscrowSettings = decodeArc4<ProposalSettings>(value)
        this.newEscrowProposalSettings.value = clone(newEscrowSettings)
        break
      }
      case AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings: {
        const updateFieldsSettings = decodeArc4<ProposalSettings>(value)
        this.updateFieldsProposalSettings.value = clone(updateFieldsSettings)
        break
      }
    }
  }

  private newExecution(key: ExecutionKey, lastValidRound: uint64): void {
    abiCall(
      AbstractedAccountInterface.prototype.arc58_addExecutionKey,
      {
        appId: this.walletID.value,
        args: [key, lastValidRound]
      }
    )
  }

  private removeExecution(key: ExecutionKey): void {
    abiCall(
      AbstractedAccountInterface.prototype.arc58_removeExecutionKey,
      {
        appId: this.walletID.value,
        args: [key]
      }
    )
  }

  private newProposalID(): uint64 {
    const id = this.proposalID.value
    this.proposalID.value += 1
    return id
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(
    version: string,
    akta: uint64,
    contentPolicy: CID,
    minRewardsImpact: uint64,
    apps: AkitaDAOApps,
    fees: AkitaDAOFees,
    proposalSettings: {
      upgradeApp: ProposalSettings,
      addPlugin: ProposalSettings,
      removeExecutePlugin: ProposalSettings,
      removePlugin: ProposalSettings,
      addAllowance: ProposalSettings,
      newEscrow: ProposalSettings,
      removeAllowance: ProposalSettings,
      updateFields: ProposalSettings
    }
  ): void {
    assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
    assert(version !== '', ERR_VERSION_CANNOT_BE_EMPTY)

    this.version.value = version
    this.akitaAssets.value = { akta, bones: 0 }
    this.contentPolicy.value = contentPolicy
    this.minRewardsImpact.value = minRewardsImpact

    this.akitaAppList.value = {
      staking: apps.staking,
      rewards: apps.rewards,
      pool: apps.pool,
      prizeBox: apps.prizeBox,
      subscriptions: apps.subscriptions,
      gate: apps.gate,
      auction: apps.auction,
      hyperSwap: apps.hyperSwap,
      raffle: apps.raffle,
      metaMerkles: apps.metaMerkles,
      marketplace: apps.marketplace,
      walletFactory: apps.walletFactory,
      social: apps.social,
      impact: apps.impact
    }

    this.pluginAppList.value = {
      optin: apps.optin,
    }

    this.otherAppList.value = {
      vrfBeacon: apps.vrfBeacon,
      nfdRegistry: apps.nfdRegistry,
      assetInbox: apps.assetInbox,
      escrowFactory: apps.escrowFactory,
      akitaNfd: apps.akitaNfd,
    }

    this.socialFees.value = {
      postFee: fees.postFee,
      reactFee: fees.reactFee,
      impactTaxMin: fees.impactTaxMin,
      impactTaxMax: fees.impactTaxMax,
    }

    this.stakingFees.value = {
      creationFee: fees.poolCreationFee,
      impactTaxMin: fees.poolImpactTaxMin,
      impactTaxMax: fees.poolImpactTaxMax
    }

    this.subscriptionFees.value = {
      serviceCreationFee: fees.subscriptionServiceCreationFee,
      paymentPercentage: fees.subscriptionPaymentPercentage,
      triggerPercentage: fees.subscriptionTriggerPercentage,
    }

    this.nftFees.value = {
      marketplaceSalePercentageMin: fees.marketplaceSalePercentageMin,
      marketplaceSalePercentageMax: fees.marketplaceSalePercentageMax,
      marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
      marketplaceRoyaltyDefaultPercentage: fees.marketplaceRoyaltyDefaultPercentage,
      shuffleSalePercentage: fees.shuffleSalePercentage,
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
    }

    this.swapFees.value = {
      impactTaxMin: fees.swapFeeImpactTaxMin,
      impactTaxMax: fees.swapFeeImpactTaxMax,
    }

    this.krbyPercentage.value = fees.krbyPercentage
    this.moderatorPercentage.value = fees.moderatorPercentage

    this.upgradeAppProposalSettings.value = clone(proposalSettings.upgradeApp)
    this.addPluginProposalSettings.value = clone(proposalSettings.addPlugin)
    this.removeExecutePluginProposalSettings.value = clone(proposalSettings.removeExecutePlugin)
    this.removePluginProposalSettings.value = clone(proposalSettings.removePlugin)
    this.addAllowanceProposalSettings.value = clone(proposalSettings.addAllowance)
    this.removeAllowanceProposalSettings.value = clone(proposalSettings.removeAllowance)
    this.newEscrowProposalSettings.value = clone(proposalSettings.newEscrow)
    this.updateFieldsProposalSettings.value = clone(proposalSettings.updateFields)
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(proposalID: uint64, index: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { status } = this.proposals(proposalID).value
    const { type, data } = this.proposals(proposalID).value.actions[index]

    assert(status === ProposalStatusApproved, ERR_PROPOSAL_NOT_APPROVED)
    assert(type === ProposalActionTypeUpgradeApp, ERR_PROPOSAL_NOT_UPGRADE_APP)

    const { app, executionKey } = decodeArc4<ProposalUpgradeApp>(data)
    assert(app === Global.currentApplicationId.id, ERR_PROPOSAL_NOT_UPGRADE_APP)
    assert(Global.groupId === executionKey, ERR_EXECUTION_KEY_MISMATCH)
  }

  setup(): void {
    const walletFactoryID = this.akitaAppList.value.walletFactory
    this.walletID.value = abiCall(
      AbstractedAccountFactoryInterface.prototype.mint,
      {
        appId: walletFactoryID,
        args: [
          itxn.payment({
            receiver: Application(walletFactoryID).address,
            amount: ABSTRACTED_ACCOUNT_MINT_PAYMENT,
          }),
          new Address(Global.zeroAddress),
          new Address(Global.currentApplicationAddress),
          'AkitaDAO'
        ]
      }
    ).returnValue
  }

  init(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_FORBIDDEN)

    abiCall(
      AbstractedAccountInterface.prototype.init,
      { appId: this.walletID.value }
    )

    this.initialized.value = true
  }

  // AKITA DAO METHODS ----------------------------------------------------------------------------

  newProposal(
    payment: gtxn.PaymentTxn,
    status: ProposalStatus,
    cid: CID,
    actions: ProposalAction[]
  ): uint64 {
    assert(
      status === ProposalStatusDraft || status === ProposalStatusVoting,
      ERR_INVALID_PROPOSAL_STATUS
    )

    if (this.initialized.value === false) {
      assert(
        Txn.sender === Global.creatorAddress,
        ERR_FORBIDDEN
      )

      const id = this.newProposalID()
      this.proposals(id).value = {
        status: ProposalStatusApproved,
        cid,
        votes: {
          approvals: 0,
          rejections: 0,
          abstains: 0,
        },
        creator: new Address(Txn.sender),
        votingTs: 0,
        created: Global.latestTimestamp,
        actions: clone(actions)
      }
      return id
    }

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.proposalFee.value
      },
      ERR_INVALID_PAYMENT
    )

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)

    const power = getStakingPower(
      this.akitaAppList.value.staking,
      new Address(origin),
      this.akitaAssets.value.bones
    )

    let required: uint64 = 0
    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      let tmpRequired: uint64 = 0

      switch (type) {
        case ProposalActionTypeUpgradeApp: {
          tmpRequired = this.upgradeAppProposalSettings.value.create
          break;
        }
        case ProposalActionTypeAddPlugin:
        case ProposalActionTypeAddNamedPlugin: {
          tmpRequired = this.addPluginProposalSettings.value.create
          break;
        }
        case ProposalActionTypeExecutePlugin:
        case ProposalActionTypeExecuteNamedPlugin: {
          const { plugin, escrow } = decodeArc4<ProposalExecuteNamedPlugin>(data)
          tmpRequired = this.plugins({ plugin, escrow }).value.create
          break;
        }
        case ProposalActionTypeRemoveExecutePlugin: {
          tmpRequired = this.removeExecutePluginProposalSettings.value.create
          break;
        }
        case ProposalActionTypeRemovePlugin:
        case ProposalActionTypeRemoveNamedPlugin: {
          tmpRequired = this.removePluginProposalSettings.value.create
          break;
        }
        case ProposalActionTypeAddAllowance: {
          tmpRequired = this.addAllowanceProposalSettings.value.create
          break;
        }
        case ProposalActionTypeRemoveAllowance: {
          tmpRequired = this.removeAllowanceProposalSettings.value.create
          break;
        }
        case ProposalActionTypeNewEscrow: {
          tmpRequired = this.newEscrowProposalSettings.value.create
          break;
        }
        case ProposalActionTypeToggleEscrowLock: {
          tmpRequired = this.toggleEscrowLockProposalSettings.value.create
          break;
        }
        case ProposalActionTypeUpdateFields: {
          tmpRequired = this.updateFieldsProposalSettings.value.create
          break;
        }
        default: {
          assert(false, ERR_INVALID_PROPOSAL_ACTION);
        }
      }

      if (tmpRequired > required) {
        required = tmpRequired
      }
    }

    assert(power >= required, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD)

    const id = this.newProposalID()
    this.proposals(id).value = {
      status,
      cid,
      votes: {
        approvals: 0,
        rejections: 0,
        abstains: 0,
      },
      creator: new Address(origin),
      votingTs: Global.latestTimestamp,
      created: Global.latestTimestamp,
      actions: clone(actions)
    }

    return id
  }

  editProposal(): void {
    assert(false, 'Not implemented')
  }

  submitProposal(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator } = this.proposals(proposalID).value

    assert(status === ProposalStatusDraft, ERR_INVALID_PROPOSAL_STATE)
    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    assert(origin === creator.native, ERR_INCORRECT_SENDER)

    this.proposals(proposalID).value.votingTs = Global.latestTimestamp
    this.proposals(proposalID).value.status = ProposalStatusVoting
  }

  voteProposal(mbrPayment: gtxn.PaymentTxn, proposalID: uint64, vote: ProposalVoteType): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: DAOProposalVotesMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const { status } = this.proposals(proposalID).value
    assert(status === ProposalStatusVoting, ERR_INVALID_PROPOSAL_STATE)

    const voter = new Address(getOrigin(this.otherAppList.value.escrowFactory, Txn.sender))

    if (this.proposalVotes({ proposalID, voter }).exists) {
      const { type, power: previousPower } = this.proposalVotes({ proposalID, voter }).value

      switch (type) {
        case ProposalVoteTypeApprove: {
          this.proposals(proposalID).value.votes.approvals -= previousPower
          break;
        }
        case ProposalVoteTypeReject: {
          this.proposals(proposalID).value.votes.rejections -= previousPower
          break;
        }
        case ProposalVoteTypeAbstain: {
          this.proposals(proposalID).value.votes.abstains -= previousPower
          break;
        }
        default: {
          assert(false, ERR_INVALID_PROPOSAL_ACTION)
        }
      }
    }

    const power = getStakingPower(
      this.akitaAppList.value.staking,
      voter,
      this.akitaAssets.value.bones
    )

    assert(power > 0, ERR_FORBIDDEN)

    switch (vote) {
      case ProposalVoteTypeApprove: {
        this.proposals(proposalID).value.votes.approvals += power
        break;
      }
      case ProposalVoteTypeReject: {
        this.proposals(proposalID).value.votes.rejections += power
        break;
      }
      case ProposalVoteTypeAbstain: {
        this.proposals(proposalID).value.votes.abstains += power
        break;
      }
      default: {
        assert(false, ERR_INVALID_PROPOSAL_ACTION)
      }
    }

    this.proposalVotes({ proposalID, voter }).value = { type: vote, power }
  }

  finalizeProposal(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator, votes: { approvals, rejections, abstains }, votingTs, actions } = clone(this.proposals(proposalID).value)

    assert(Txn.sender === creator.native, ERR_INCORRECT_SENDER)
    assert(status === ProposalStatusVoting, ERR_INVALID_PROPOSAL_STATE)

    const bones = Asset(this.akitaAssets.value.bones)
    const nonCirculatingSupply = op.AssetHolding.assetBalance(this.walletID.value, bones)[0]
    const circulatingSupply: uint64 = bones.total - nonCirculatingSupply
    const totalVotes: uint64 = approvals + rejections + abstains
    const approvalPercentage = percentageOf(approvals, (approvals + rejections))

    let highestDuration: uint64 = 0
    let highestParticipation: uint64 = 0
    let highestApproval: uint64 = 0
    let highestParticipationThreshold: uint64 = 0

    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      let duration: uint64 = 0
      let participation: uint64 = 0
      let approval: uint64 = 0
      let participationThreshold: uint64 = 0

      switch (type) {
        case ProposalActionTypeUpgradeApp: {
          ({ duration, participation, approval } = this.upgradeAppProposalSettings.value)
          break
        }
        case ProposalActionTypeAddPlugin:
        case ProposalActionTypeAddNamedPlugin: {
          ({ duration, participation, approval } = this.addPluginProposalSettings.value)
          break
        }
        case ProposalActionTypeExecutePlugin:
        case ProposalActionTypeExecuteNamedPlugin: {
          const { plugin, escrow } = decodeArc4<ProposalExecutePlugin>(data)
          assert(this.plugins({ plugin, escrow }).exists, ERR_PROPOSAL_DOES_NOT_EXIST);
          ({ duration, participation, approval } = this.plugins({ plugin, escrow }).value)
          break
        }
        case ProposalActionTypeRemovePlugin:
        case ProposalActionTypeRemoveNamedPlugin: {
          ({ duration, participation, approval } = this.removePluginProposalSettings.value)
          break
        }
        case ProposalActionTypeAddAllowance: {
          ({ duration, participation, approval } = this.addAllowanceProposalSettings.value)
          break
        }
        case ProposalActionTypeRemoveAllowance: {
          ({ duration, participation, approval } = this.removeAllowanceProposalSettings.value)
          break
        }
        case ProposalActionTypeNewEscrow: {
          ({ duration, participation, approval } = this.newEscrowProposalSettings.value)
          break
        }
        case ProposalActionTypeToggleEscrowLock: {
          ({ duration, participation, approval } = this.toggleEscrowLockProposalSettings.value)
          break
        }
        case ProposalActionTypeUpdateFields: {
          ({ duration, participation, approval } = this.updateFieldsProposalSettings.value)
          break
        }
      }

      if (duration > highestDuration) {
        highestDuration = duration
      }

      participationThreshold = calcPercent(circulatingSupply, participation)
      if (participation > highestParticipation) {
        highestParticipation = participation
      }

      if (approval > highestApproval) {
        highestApproval = approval
      }

      if (participationThreshold > highestParticipationThreshold) {
        highestParticipationThreshold = participationThreshold
      }
    }

    assert(Global.latestTimestamp > (votingTs + highestDuration), ERR_VOTING_DURATION_NOT_MET)
    assert(totalVotes >= highestParticipationThreshold, ERR_VOTING_PARTICIPATION_NOT_MET)

    if (approvalPercentage >= highestApproval) {
      this.proposals(proposalID).value.status = ProposalStatusApproved
    } else {
      this.proposals(proposalID).value.status = ProposalStatusRejected
    }
  }

  executeProposal(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator, votes: { approvals, rejections, abstains }, votingTs, actions } = clone(this.proposals(proposalID).value)

    assert(Txn.sender === creator.native, ERR_INCORRECT_SENDER)
    assert(status === ProposalStatusApproved, ERR_INVALID_PROPOSAL_STATE)

    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      switch (type) {
        case ProposalActionTypeUpgradeApp:
        case ProposalActionTypeExecutePlugin:
        case ProposalActionTypeExecuteNamedPlugin: {
          const { executionKey, lastValidRound } = decodeArc4<ProposalExecutePlugin>(data)
          this.newExecution(executionKey, lastValidRound)
          break
        }
        case ProposalActionTypeAddPlugin: {
          this.addPlugin({ name: '', ...decodeArc4<ProposalAddPlugin>(data) })
          break
        }
        case ProposalActionTypeAddNamedPlugin: {
          this.addPlugin(decodeArc4<ProposalAddNamedPlugin>(data))
          break
        }
        case ProposalActionTypeRemovePlugin: {
          this.removePlugin({ name: '', ...decodeArc4<ProposalRemovePlugin>(data) })
          break
        }
        case ProposalActionTypeRemoveNamedPlugin: {
          this.removePlugin(decodeArc4<ProposalRemoveNamedPlugin>(data))
          break
        }
        case ProposalActionTypeAddAllowance: {
          const { escrow, allowances } = decodeArc4<ProposalAddAllowances>(data)
          this.addAllowances(escrow, allowances)
          break
        }
        case ProposalActionTypeRemoveAllowance: {
          const { escrow, assets } = decodeArc4<ProposalRemoveAllowances>(data)
          this.removeAllowances(escrow, assets)
          break
        }
        case ProposalActionTypeNewEscrow: {
          const { escrow, type, data: escrowData } = decodeArc4<ProposalNewEscrow>(data)
          switch (type) {
            case EscrowTypeDefault: {
              this.newEscrow(escrow)
              break
            }
            case EscrowTypeReceive: {
              const receiveData = decodeArc4<ProposalNewReceive>(data)
              this.newReceiveEscrow({ escrow, ...receiveData })
              break
            }
            // case EscrowTypeIndividualPayout: {
            //   const individualPayoutData = decodeArc4<ProposalNewIndividualPayout>(data)
            //   this.newIndividualPayoutEscrow({ escrow, ...individualPayoutData })
            //   break
            // }
            // case EscrowTypePoolPayout: {
            //   const poolPayoutData = decodeArc4<ProposalNewPoolPayout>(data)
            //   this.newPoolPayoutEscrow({ escrow, ...poolPayoutData })
            //   break
            // }
            default: {
              assert(false, ERR_INVALID_PROPOSAL_ACTION)
            }
          }
          break
        }
        case ProposalActionTypeToggleEscrowLock: {
          const { escrow } = decodeArc4<ProposalToggleEscrowLock>(data)
          this.toggleEscrowLock(escrow)
          break
        }
        case ProposalActionTypeUpdateFields: {
          const { field, value } = decodeArc4<ProposalUpdateField>(data)
          this.updateField(field, value)
          break
        }
      }
    }

    this.proposals(proposalID).value.status = ProposalStatusExecuted
  }

  startEscrowDisbursement(name: string): void {
    const escrowID = this.getEscrow(name, true)
    assert(this.receiveEscrows(escrowID).exists, ERR_ESCROW_DOES_NOT_EXIST)
    // validate the time window of the last escrow payout
    const { phase, allocatable, lastDisbursement, creationDate } = this.receiveEscrows(escrowID).value
    assert(phase === EscrowDisbursementPhaseIdle, ERR_ESCROW_NOT_IDLE)
    assert(allocatable, ERR_ESCROW_NOT_ALLOCATABLE)

    const latestWindow: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - creationDate) % ONE_DAY)
    assert(latestWindow >= lastDisbursement, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT)

    this.receiveEscrows(escrowID).value.phase = EscrowDisbursementPhaseAllocation
    this.receiveEscrows(escrowID).value.lastDisbursement = latestWindow
  }

  processEscrowAllocation(name: string, ids: uint64[]): void {
    const escrowID = this.getEscrow(name, true)
    const { phase, source, optinCount } = this.receiveEscrows(escrowID).value
    assert(phase === EscrowDisbursementPhaseAllocation, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE)

    const sender = source.native

    const krbyEscrowID = this.getEscrow(AkitaDAOEscrowAccountKrby, true)
    const krbyAccount = Application(krbyEscrowID).address

    const modEscrowID = this.getEscrow(AkitaDAOEscrowAccountModerators, true)
    const modAccount = Application(modEscrowID).address

    const govEscrowID = this.getEscrow(AkitaDAOEscrowAccountGovernors, true)
    const govAccount = Application(govEscrowID).address

    for (let i: uint64 = 0; i < ids.length; i += 1) {
      const asset = ids[i]
      assert(!this.receiveAssets({ escrow: escrowID, asset }).exists, ERR_ASSET_ALREADY_ALLOCATED)
      assert(sender.isOptedIn(Asset(asset)), ERR_ESCROW_NOT_OPTED_IN)

      const balance = AssetHolding.assetBalance(sender, asset)[0]

      const krbyAmount = calcPercent(balance, this.krbyPercentage.value)
      const modAmount = calcPercent(balance, this.moderatorPercentage.value)
      const govAmount: uint64 = balance - (krbyAmount + modAmount)

      // pay krby
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: krbyAccount,
            amount: krbyAmount
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: krbyAccount,
            assetAmount: krbyAmount,
            xferAsset: asset
          })
          .submit()
      }

      // pay moderator fund
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: modAccount,
            amount: modAmount
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: modAccount,
            assetAmount: modAmount,
            xferAsset: asset
          })
          .submit()
      }

      // pay governor fund
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: govAccount,
            amount: govAmount
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: govAccount,
            assetAmount: govAmount,
            xferAsset: asset
          })
          .submit()
      }

      this.receiveAssets({ escrow: escrowID, asset }).create()
    }

    const allocationCounter: uint64 = this.receiveEscrows(escrowID).value.allocationCounter + ids.length
    this.receiveEscrows(escrowID).value.allocationCounter = allocationCounter
    if (allocationCounter === (optinCount + 1)) {
      this.receiveEscrows(escrowID).value.phase = EscrowDisbursementPhaseFinalization
    }
  }
}