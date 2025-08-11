import { Account, Application, assert, assertMatch, Asset, BoxMap, bytes, clone, Contract, GlobalState, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { ProposalActionType, ProposalVoteType, AkitaAppList, AkitaAssets, AkitaDAOApps, AkitaDAOFees, DAOPluginKey, NFTFees, OtherAppList, PluginAppList, ProposalAction, ProposalAddAllowances, ProposalAddNamedPlugin, ProposalAddPlugin, ProposalDetails, ProposalExecutePlugin, ProposalNewEscrow, ProposalRemoveAllowances, ProposalRemoveNamedPlugin, ProposalRemovePlugin, ProposalSettings, ProposalToggleEscrowLock, ProposalUpdateField, ProposalUpgradeApp, ProposalVoteInfo, ProposalVoteKey, SocialFees, StakingFees, SubscriptionFees, SwapFees, WalletFees, ProposalRemoveExecutePlugin } from "./types";
import { AbstractAccountBoxPrefixPlugins, ABSTRACTED_ACCOUNT_MINT_PAYMENT } from "../account/constants";
import { AddAllowanceInfo, EscrowInfo, ExecutionKey } from "../account/types";
import { GlobalStateKeyVersion } from "../../constants";
import { CID } from "../../utils/types/base";
import { AkitaDAOGlobalStateKeysInitialized, AkitaDAOGlobalStateKeysContentPolicy, AkitaDAOBoxPrefixProposals, AkitaDAOBoxPrefixProposalVotes, AkitaDAOGlobalStateKeysAddAllowanceProposalSettings, AkitaDAOGlobalStateKeysAddPluginProposalSettings, AkitaDAOGlobalStateKeysAkitaAppList, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysMinRewardsImpact, AkitaDAOGlobalStateKeysNewEscrowProposalSettings, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysOtherAppList, AkitaDAOGlobalStateKeysPluginAppList, AkitaDAOGlobalStateKeysProposalActionLimit, AkitaDAOGlobalStateKeysProposalID, AkitaDAOGlobalStateKeysRemoveAllowanceProposalSettings, AkitaDAOGlobalStateKeysRemoveExecutePluginProposalSettings, AkitaDAOGlobalStateKeysRemovePluginProposalSettings, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysSubscriptionFees, AkitaDAOGlobalStateKeysSwapFees, AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings, AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings, AkitaDAOGlobalStateKeysUpgradeAppProposalSettings, AkitaDAOGlobalStateKeysWalletID, DAOProposalVotesMBR, DAOReceiveAssetsMBR, DAOReceiveEscrowsMBR, MinDAOPayoutEscrowsMBR, PayoutEscrowTypeGroup, ProposalActionTypeAddAllowance, ProposalActionTypeAddNamedPlugin, ProposalActionTypeAddPlugin, ProposalActionTypeExecuteNamedPlugin, ProposalActionTypeExecutePlugin, ProposalActionTypeNewEscrow, ProposalActionTypeRemoveAllowance, ProposalActionTypeRemoveNamedPlugin, ProposalActionTypeRemovePlugin, ProposalActionTypeToggleEscrowLock, ProposalActionTypeUpdateFields, ProposalActionTypeUpgradeApp, ProposalStatusApproved, ProposalStatusDraft, ProposalStatusExecuted, ProposalStatusRejected, ProposalStatusVoting, ProposalVoteTypeAbstain, ProposalVoteTypeApprove, ProposalVoteTypeReject, AkitaDAOGlobalStateKeysWalletFees, ProposalActionTypeRemoveExecutePlugin } from "./constants";
import { BoxCostPerByte } from "../../utils/constants";
import { abiCall, abimethod, Address, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { btoi, Global, Txn } from "@algorandfoundation/algorand-typescript/op";
import { AbstractedAccountFactoryInterface, AbstractedAccountInterface } from "../../utils/abstract-account";
import { calcPercent, getOrigin, getStakingPower, percentageOf } from "../../utils/functions";
import { ERR_INVALID_PAYMENT } from "../../utils/errors";
import { ERR_EMPTY_ACTION_LIST, ERR_TOO_MANY_ACTIONS, ERR_VOTING_DURATION_NOT_MET, ERR_VOTING_PARTICIPATION_NOT_MET, ERR_ALREADY_INITIALIZED, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD, ERR_INVALID_PROPOSAL_ACTION, ERR_INVALID_PROPOSAL_STATE, ERR_PAYMENT_NOT_REQUIRED, ERR_PAYMENT_REQUIRED, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_VERSION_CANNOT_BE_EMPTY } from "./errors";
import { ERR_FORBIDDEN } from "../account/errors";

export class AkitaDAO extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  initialized = GlobalState<boolean>({ initialValue: false, key: AkitaDAOGlobalStateKeysInitialized })
  /** the version number of the DAO */
  version = GlobalState<string>({ initialValue: '', key: GlobalStateKeyVersion })
  /** the arc58 wallet the DAO controls */
  walletID = GlobalState<uint64>({ initialValue: 0, key: AkitaDAOGlobalStateKeysWalletID })
  /** the number of actions allowed in a proposal */
  proposalActionLimit = GlobalState<uint64>({ initialValue: 5, key: AkitaDAOGlobalStateKeysProposalActionLimit })
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
  /** the fees for akita wallet operations */
  walletFees = GlobalState<WalletFees>({ key: AkitaDAOGlobalStateKeysWalletFees })
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

  private creationRequirements(actions: ProposalAction[]): { totalFee: uint64, powerRequired: uint64 } {
    let totalFee: uint64 = 0
    let powerRequired: uint64 = 0
    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      const { fee, power } = this.getProposalSettings(type, data)

      totalFee += fee

      if (power > powerRequired) {
        powerRequired = power
      }
    }

    return { totalFee, powerRequired }
  }

  private createOrUpdateProposal(
    id: uint64,
    cid: CID,
    actions: ProposalAction[],
    origin: Account,
    feesPaid: uint64,
    powerRequired: uint64
  ): uint64 {

    assert(actions.length > 0, ERR_EMPTY_ACTION_LIST)
    assert(actions.length <= this.proposalActionLimit.value, ERR_TOO_MANY_ACTIONS)

    if (this.initialized.value === false) {
      assert(Txn.sender === Global.creatorAddress, ERR_FORBIDDEN)

      id = this.newProposalID()

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
        feesPaid,
        actions: clone(actions)
      }
      return id
    }

    const userPower = getStakingPower(
      this.akitaAppList.value.staking,
      new Address(origin),
      this.akitaAssets.value.bones
    )

    assert(userPower >= powerRequired, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD)

    let created: uint64 = 0
    if (id === 0) {
      id = this.newProposalID()
      created = Global.latestTimestamp
    } else {
      created = this.proposals(id).value.created
    }

    this.proposals(id).value = {
      status: ProposalStatusDraft,
      cid,
      votes: {
        approvals: 0,
        rejections: 0,
        abstains: 0,
      },
      creator: new Address(origin),
      votingTs: 0,
      created,
      feesPaid,
      actions: clone(actions)
    }

    return id
  }

  private getProposalSettings(type: ProposalActionType, data: bytes): ProposalSettings {
    switch (type) {
      case ProposalActionTypeUpgradeApp: {
        return this.upgradeAppProposalSettings.value
      }
      case ProposalActionTypeAddPlugin:
      case ProposalActionTypeAddNamedPlugin: {
        return this.addPluginProposalSettings.value
      }
      case ProposalActionTypeExecutePlugin:
      case ProposalActionTypeExecuteNamedPlugin: {
        const { plugin, escrow } = decodeArc4<ProposalExecutePlugin>(data)
        assert(this.plugins({ plugin, escrow }).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
        return this.plugins({ plugin, escrow }).value
      }
      case ProposalActionTypeRemovePlugin:
      case ProposalActionTypeRemoveNamedPlugin: {
        return this.removePluginProposalSettings.value
      }
      case ProposalActionTypeAddAllowance: {
        return this.addAllowanceProposalSettings.value
      }
      case ProposalActionTypeRemoveAllowance: {
        return this.removeAllowanceProposalSettings.value
      }
      case ProposalActionTypeNewEscrow: {
        return this.newEscrowProposalSettings.value
      }
      case ProposalActionTypeToggleEscrowLock: {
        return this.toggleEscrowLockProposalSettings.value
      }
      case ProposalActionTypeUpdateFields: {
        return this.updateFieldsProposalSettings.value
      }
      default: {
        assert(false, ERR_INVALID_PROPOSAL_ACTION)
      }
    }
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
      useExecutionKey,
      defaultToEscrow,
      fee,
      power,
      duration,
      participation,
      approval,
      allowances
    } = clone(data);

    if (useExecutionKey) {
      this.plugins({ plugin, escrow }).value = {
        fee,
        power,
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
            useExecutionKey,
            defaultToEscrow
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
            useExecutionKey,
            defaultToEscrow
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

  private toggleEscrowLock(escrow: string): EscrowInfo {
    return abiCall(
      AbstractedAccountInterface.prototype.arc58_toggleEscrowLock,
      {
        appId: this.walletID.value,
        args: [escrow]
      }
    ).returnValue
  }

  private updateField(field: string, value: bytes): void {
    switch (field) {
      case AkitaDAOGlobalStateKeysContentPolicy: {
        this.contentPolicy.value = value.toFixed({ length: 36 })
        break
      }
      case AkitaDAOGlobalStateKeysProposalActionLimit: {
        this.proposalActionLimit.value = btoi(value)
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
      case AkitaDAOGlobalStateKeysWalletFees: {
        const walletFees = decodeArc4<WalletFees>(value)
        this.walletFees.value = clone(walletFees)
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
      removeAllowance: ProposalSettings,
      newEscrow: ProposalSettings,
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

    this.walletFees.value = { createFee: fees.walletCreateFee }

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
    const { walletFactory } = this.akitaAppList.value

    this.walletID.value = abiCall(
      AbstractedAccountFactoryInterface.prototype.new,
      {
        appId: walletFactory,
        args: [
          itxn.payment({
            receiver: Application(walletFactory).address,
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

  newProposalPreInitialized(cid: CID, actions: ProposalAction[]): uint64 {
    assert(this.initialized.value === false, ERR_ALREADY_INITIALIZED)
    
    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    const { powerRequired } = this.creationRequirements(actions)

    return this.createOrUpdateProposal(0, cid, actions, origin, 0, powerRequired)
  }

  newProposal(payment: gtxn.PaymentTxn, cid: CID, actions: ProposalAction[]): uint64 {
    assert(this.initialized.value === true, ERR_ALREADY_INITIALIZED)

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    const { totalFee, powerRequired } = this.creationRequirements(actions)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalFee
      },
      ERR_INVALID_PAYMENT
    )

    return this.createOrUpdateProposal(0, cid, actions, origin, totalFee, powerRequired)
  }

  editProposal(id: uint64, cid: CID, actions: ProposalAction[]): void {
    assert(this.proposals(id).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { feesPaid } = this.proposals(id).value

    const { status, creator } = this.proposals(id).value
    assert(status === ProposalStatusDraft, ERR_INVALID_PROPOSAL_STATE)
    
    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    assert(origin === creator.native, ERR_INCORRECT_SENDER)

    const { totalFee, powerRequired } = this.creationRequirements(actions)

    assert(totalFee <= feesPaid, ERR_PAYMENT_REQUIRED)

    this.createOrUpdateProposal(0, cid, actions, origin, totalFee, powerRequired)
  }

  editProposalWithPayment(payment: gtxn.PaymentTxn, id: uint64, cid: CID, actions: ProposalAction[]): void {
    assert(this.proposals(id).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { feesPaid } = this.proposals(id).value

    const { status, creator } = this.proposals(id).value
    assert(status === ProposalStatusDraft, ERR_INVALID_PROPOSAL_STATE)

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    assert(origin === creator.native, ERR_INCORRECT_SENDER)

    const { totalFee, powerRequired } = this.creationRequirements(actions)

    assert(totalFee > feesPaid, ERR_PAYMENT_NOT_REQUIRED)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalFee - feesPaid
      },
      ERR_INVALID_PAYMENT
    )

    this.createOrUpdateProposal(id, cid, actions, origin, totalFee, powerRequired)
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
    assert(this.initialized.value === true, ERR_ALREADY_INITIALIZED)
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

    const { staking } = this.akitaAppList.value
    const { bones } = this.akitaAssets.value
    const power = getStakingPower(staking, voter, bones)

    // getStakingPower will return 0 if the unlock is within 1 week
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

    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      const { duration, participation, approval } = this.getProposalSettings(type, data)

      if (duration > highestDuration) {
        highestDuration = duration
      }

      if (participation > highestParticipation) {
        highestParticipation = participation
      }

      if (approval > highestApproval) {
        highestApproval = approval
      }
    }

    assert(Global.latestTimestamp > (votingTs + highestDuration), ERR_VOTING_DURATION_NOT_MET)
    const participationThreshold = calcPercent(circulatingSupply, highestParticipation)
    assert(totalVotes >= participationThreshold, ERR_VOTING_PARTICIPATION_NOT_MET)

    if (approvalPercentage >= highestApproval) {
      this.proposals(proposalID).value.status = ProposalStatusApproved
    } else {
      this.proposals(proposalID).value.status = ProposalStatusRejected
    }
  }

  executeProposal(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator, actions } = clone(this.proposals(proposalID).value)

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
        case ProposalActionTypeRemoveExecutePlugin: {
          const { executionKey } = decodeArc4<ProposalRemoveExecutePlugin>(data)
          this.removeExecution(executionKey)
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
          const { escrow } = decodeArc4<ProposalNewEscrow>(data)
          this.newEscrow(escrow)
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
}