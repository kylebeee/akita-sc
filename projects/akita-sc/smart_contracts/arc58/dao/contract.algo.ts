import { Account, Application, assert, assertMatch, Asset, BoxMap, Bytes, bytes, clone, contract, Contract, GlobalState, gtxn, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { ProposalActionType, ProposalVoteType, AkitaAppList, AkitaAssets, AkitaDAOApps, AkitaDAOFees, DAOPluginKey, NFTFees, OtherAppList, PluginAppList, ProposalAction, ProposalAddAllowances, ProposalAddNamedPlugin, ProposalAddPlugin, ProposalDetails, ProposalExecutePlugin, ProposalNewEscrow, ProposalRemoveAllowances, ProposalRemoveNamedPlugin, ProposalRemovePlugin, ProposalSettings, ProposalToggleEscrowLock, ProposalUpdateField, ProposalUpgradeApp, ProposalVoteInfo, ProposalVoteKey, SocialFees, StakingFees, SubscriptionFees, SwapFees, WalletFees, ProposalRemoveExecutePlugin, ProposalExecuteNamedPlugin } from "./types";
import { AbstractAccountBoxPrefixPlugins, ABSTRACTED_ACCOUNT_MINT_PAYMENT } from "../account/constants";
import { AddAllowanceInfo, EscrowInfo, PluginInfo, PluginKey } from "../account/types";
import { GlobalStateKeyVersion } from "../../constants";
import { CID, uint8 } from "../../utils/types/base";
import { AkitaDAOGlobalStateKeysInitialized, AkitaDAOGlobalStateKeysContentPolicy, AkitaDAOBoxPrefixProposals, AkitaDAOBoxPrefixProposalVotes, AkitaDAOGlobalStateKeysAddAllowancesProposalSettings, AkitaDAOGlobalStateKeysAddPluginProposalSettings, AkitaDAOGlobalStateKeysAkitaAppList, AkitaDAOGlobalStateKeysAkitaAssets, AkitaDAOGlobalStateKeysMinRewardsImpact, AkitaDAOGlobalStateKeysNewEscrowProposalSettings, AkitaDAOGlobalStateKeysNFTFees, AkitaDAOGlobalStateKeysOtherAppList, AkitaDAOGlobalStateKeysPluginAppList, AkitaDAOGlobalStateKeysProposalActionLimit, AkitaDAOGlobalStateKeysProposalID, AkitaDAOGlobalStateKeysRemoveAllowancesProposalSettings, AkitaDAOGlobalStateKeysRemoveExecutePluginProposalSettings, AkitaDAOGlobalStateKeysRemovePluginProposalSettings, AkitaDAOGlobalStateKeysSocialFees, AkitaDAOGlobalStateKeysStakingFees, AkitaDAOGlobalStateKeysSubscriptionFees, AkitaDAOGlobalStateKeysSwapFees, AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings, AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings, AkitaDAOGlobalStateKeysUpgradeAppProposalSettings, ProposalActionTypeAddNamedPlugin, ProposalActionTypeAddPlugin, ProposalActionTypeExecuteNamedPlugin, ProposalActionTypeExecutePlugin, ProposalActionTypeNewEscrow, ProposalActionTypeRemoveNamedPlugin, ProposalActionTypeRemovePlugin, ProposalActionTypeToggleEscrowLock, ProposalActionTypeUpdateFields, ProposalActionTypeUpgradeApp, ProposalStatusApproved, ProposalStatusDraft, ProposalStatusExecuted, ProposalStatusRejected, ProposalStatusVoting, ProposalVoteTypeAbstain, ProposalVoteTypeApprove, ProposalVoteTypeReject, AkitaDAOGlobalStateKeysWalletFees, ProposalActionTypeRemoveExecutePlugin, AkitaDAONumGlobalBytes, AkitaDAONumGlobalUints, ProposalActionTypeAddAllowances, ProposalActionTypeRemoveAllowances, DAOProposalVotesMBR, MinDAOPluginMBR, MinDAOProposalActionMbr, MinDAOProposalMBR, AkitaDAOGlobalStateKeysWallet } from "./constants";
import { BoxCostPerByte } from "../../utils/constants";
import { abiCall, abimethod, Address, decodeArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { btoi, Global, Txn } from "@algorandfoundation/algorand-typescript/op";
import { AbstractedAccountFactoryInterface, AbstractedAccountInterface } from "../../utils/abstract-account";
import { calcPercent, getOrigin, getStakingPower, percentageOf } from "../../utils/functions";
import { ERR_INVALID_PAYMENT } from "../../utils/errors";
import { ERR_EMPTY_ACTION_LIST, ERR_TOO_MANY_ACTIONS, ERR_VOTING_DURATION_NOT_MET, ERR_VOTING_PARTICIPATION_NOT_MET, ERR_ALREADY_INITIALIZED, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD, ERR_INVALID_PROPOSAL_ACTION, ERR_INVALID_PROPOSAL_STATE, ERR_PAYMENT_NOT_REQUIRED, ERR_PAYMENT_REQUIRED, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_VERSION_CANNOT_BE_EMPTY, ERR_PLUGIN_ALREADY_EXISTS, ERR_PLUGIN_DOES_NOT_EXIST, ERR_NOT_EXECUTABLE_PLUGIN, ERR_INVALID_MIN_APPROVAL, ERR_INVALID_MAX_APPROVAL, ERR_INVALID_MAX_PARTICIPATION, ERR_INVALID_DURATION, ERR_INVALID_MIN_POWER, ERR_INVALID_MAX_POWER, ERR_INVALID_CID, ERR_INVALID_PROPOSAL_ACTION_LIMIT, ERR_ACTION_LIMIT_MUST_BE_GREATER_THAN_ZERO, ERR_INVALID_MINIMUM_REWARDS_IMPACT, ERR_MIN_REWARDS_IMPACT_MUST_BE_GREATER_THAN_ZERO, ERR_MIN_REWARDS_IMPACT_MUST_BE_LESS_THAN_OR_EQUAL_TO_1000s, ERR_ALLOWANCE_LIST_EMPTY, ERR_PLUGIN_EXPIRED } from "./errors";
import { ERR_ALLOWANCE_ALREADY_EXISTS, ERR_ALLOWANCE_DOES_NOT_EXIST, ERR_ESCROW_ALREADY_EXISTS, ERR_ESCROW_DOES_NOT_EXIST, ERR_EXECUTION_EXPIRED, ERR_EXECUTION_KEY_NOT_FOUND, ERR_EXECUTION_NOT_READY, ERR_FORBIDDEN, ERR_GROUP_NOT_FOUND } from "../account/errors";

@contract({ stateTotals: { globalBytes: AkitaDAONumGlobalBytes, globalUints: AkitaDAONumGlobalUints } })
export class AkitaDAO extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  initialized = GlobalState<boolean>({ initialValue: false, key: AkitaDAOGlobalStateKeysInitialized })
  /** the version number of the DAO */
  version = GlobalState<string>({ initialValue: '', key: GlobalStateKeyVersion })
  /** the arc58 wallet the DAO controls */
  wallet = GlobalState<Application>({ key: AkitaDAOGlobalStateKeysWallet })
  /** the number of actions allowed in a proposal */
  proposalActionLimit = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalActionLimit })
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
  addAllowancesProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysAddAllowancesProposalSettings })
  /** proposal settings for removing an allowance */
  removeAllowancesProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysRemoveAllowancesProposalSettings })
  /** proposal settings for creating a new escrow */
  newEscrowProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysNewEscrowProposalSettings })
  /** proposal settings for toggling an escrow lock */
  toggleEscrowLockProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysToggleEscrowLockProposalSettings })
  /** proposal settings for updating fields */
  updateFieldsProposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings })
  /** the next proposal id */
  proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalID })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<DAOPluginKey, ProposalSettings>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** voting state of a proposal */
  proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** votes by proposal id & address */
  proposalVotes = BoxMap<ProposalVoteKey, ProposalVoteInfo>({ keyPrefix: AkitaDAOBoxPrefixProposalVotes })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private pluginsMbr(escrow: string): uint64 {
    return MinDAOPluginMBR + (BoxCostPerByte * Bytes(escrow).length)
  }

  private proposalsMbr(actions: ProposalAction[]): uint64 {
    let totalActionDataLength: uint64 = 0;
    for (let i: uint64 = 0; i < actions.length; i++) {
      totalActionDataLength += (MinDAOProposalActionMbr + actions[i].data.length)
    }

    return MinDAOProposalMBR + (BoxCostPerByte * totalActionDataLength)
  }

  private pluginExists(key: PluginKey): boolean {
    const info = abiCall<typeof AbstractedAccountInterface.prototype.arc58_getPlugins>({
      appId: this.wallet.value,
      args: [[key]]
    }).returnValue[0]

    return info.start !== 0
  }

  private getPlugin(key: PluginKey): PluginInfo {
    return abiCall<typeof AbstractedAccountInterface.prototype.arc58_getPlugins>({
      appId: this.wallet.value,
      args: [[key]]
    }).returnValue[0]
  }

  private namedPluginExists(name: string): boolean {
    const info = abiCall<typeof AbstractedAccountInterface.prototype.arc58_getNamedPlugins>({
      appId: this.wallet.value,
      args: [[name]]
    }).returnValue[0]

    return info.start !== 0
  }

  private escrowExists(escrow: string): boolean {
    const info = abiCall<typeof AbstractedAccountInterface.prototype.arc58_getEscrows>({
      appId: this.wallet.value,
      args: [[escrow]]
    }).returnValue[0]

    return info.id !== 0
  }

  private allowanceCheck(escrow: string, assets: uint64[]): { existences: boolean[], anyExist: boolean, allExist: boolean } {
    const info = abiCall<typeof AbstractedAccountInterface.prototype.arc58_getAllowances>({
      appId: this.wallet.value,
      args: [escrow, assets]
    }).returnValue

    let existences: boolean[] = []
    let anyExist: boolean = false
    let allExist: boolean = true
    for (let i: uint64 = 0; i < info.length; i++) {
      const exists = info[i].start !== 0
      existences.push(exists)
      if (exists) {
        anyExist = true
      } else {
        allExist = false
      }
    }

    return { existences, anyExist, allExist }
  }

  private executionExists(lease: bytes<32>): boolean {
    const info = abiCall<typeof AbstractedAccountInterface.prototype.arc58_getExecutions>({
      appId: this.wallet.value,
      args: [[lease]]
    }).returnValue[0]

    return info.groups.length > 0
  }

  private validateActions(actions: ProposalAction[]): void {
    assert(actions.length > 0, ERR_EMPTY_ACTION_LIST)

    for (let i: uint64 = 0; i < actions.length; i++) {
      switch (actions[i].type) {
        case ProposalActionTypeUpgradeApp: {
          // TODO: make sure its an app we control
          break;
        }
        case ProposalActionTypeAddPlugin: {
          const { plugin, caller, escrow, fee, power, duration, participation, approval } = decodeArc4<ProposalAddPlugin>(actions[i].data)
          this.validateSettings({ fee, power, duration, participation, approval })
          assert(!this.pluginExists({ plugin, caller: caller.native, escrow }), ERR_PLUGIN_ALREADY_EXISTS)
          break;
        }
        case ProposalActionTypeAddNamedPlugin: {
          const { name } = decodeArc4<ProposalAddNamedPlugin>(actions[i].data)
          assert(!this.namedPluginExists(name), ERR_PLUGIN_ALREADY_EXISTS)
          break
        }
        case ProposalActionTypeExecutePlugin: {
          const { plugin, escrow } = decodeArc4<ProposalExecutePlugin>(actions[i].data)
          const pluginInfo = this.getPlugin({ plugin, caller: Global.zeroAddress, escrow })
          assert(pluginInfo.start !== 0, ERR_PLUGIN_DOES_NOT_EXIST)
          assert(pluginInfo.useExecutionKey, ERR_NOT_EXECUTABLE_PLUGIN)
          const epochRef = pluginInfo.useRounds ? Global.round : Global.latestTimestamp
          assert(pluginInfo.lastValid > epochRef, ERR_PLUGIN_EXPIRED)
          break
        }
        case ProposalActionTypeExecuteNamedPlugin: {
          const { name } = decodeArc4<ProposalExecuteNamedPlugin>(actions[i].data)
          assert(this.namedPluginExists(name), ERR_PLUGIN_DOES_NOT_EXIST)
          break
        }
        case ProposalActionTypeRemoveExecutePlugin: {
          const { executionKey } = decodeArc4<ProposalRemoveExecutePlugin>(actions[i].data)
          assert(this.executionExists(executionKey), ERR_EXECUTION_KEY_NOT_FOUND)
          break
        }
        case ProposalActionTypeRemovePlugin: {
          const { plugin, caller, escrow } = decodeArc4<ProposalRemovePlugin>(actions[i].data)
          assert(this.pluginExists({ plugin, caller: caller.native, escrow }), ERR_PLUGIN_DOES_NOT_EXIST)
          break
        }
        case ProposalActionTypeRemoveNamedPlugin: {
          const { name } = decodeArc4<ProposalRemoveNamedPlugin>(actions[i].data)
          assert(this.namedPluginExists(name), ERR_PLUGIN_DOES_NOT_EXIST)
          break
        }
        case ProposalActionTypeAddAllowances: {
          const { escrow, allowances } = decodeArc4<ProposalAddAllowances>(actions[i].data)
          assert(allowances.length > 0, ERR_ALLOWANCE_LIST_EMPTY)

          let assets: uint64[] = []
          for (let i: uint64 = 0; i < allowances.length; i++) {
            assets.push(allowances[i].asset)
          }

          const { anyExist } = this.allowanceCheck(escrow, assets)
          assert(!anyExist, ERR_ALLOWANCE_ALREADY_EXISTS)
          break
        }
        case ProposalActionTypeRemoveAllowances: {
          const { escrow, assets } = decodeArc4<ProposalRemoveAllowances>(actions[i].data)
          assert(assets.length > 0, ERR_ALLOWANCE_LIST_EMPTY)
          const { allExist } = this.allowanceCheck(escrow, assets)
          assert(allExist, ERR_ALLOWANCE_DOES_NOT_EXIST)
          break
        }
        case ProposalActionTypeNewEscrow: {
          const { escrow } = decodeArc4<ProposalNewEscrow>(actions[i].data)
          assert(!this.escrowExists(escrow), ERR_ESCROW_ALREADY_EXISTS)
          break
        }
        case ProposalActionTypeToggleEscrowLock: {
          const { escrow } = decodeArc4<ProposalToggleEscrowLock>(actions[i].data)
          assert(this.escrowExists(escrow), ERR_ESCROW_DOES_NOT_EXIST)
          break
        }
        case ProposalActionTypeUpdateFields: {
          const { field, value } = decodeArc4<ProposalUpdateField>(actions[i].data)
          switch (field) {
            case AkitaDAOGlobalStateKeysContentPolicy: {
              assert(value.length === 36, ERR_INVALID_CID)
              break
            }
            case AkitaDAOGlobalStateKeysProposalActionLimit: {
              assert(value.length === 8, ERR_INVALID_PROPOSAL_ACTION_LIMIT)
              assert(btoi(value) > 0, ERR_ACTION_LIMIT_MUST_BE_GREATER_THAN_ZERO)
              break
            }
            case AkitaDAOGlobalStateKeysMinRewardsImpact: {
              assert(value.length === 8, ERR_INVALID_MINIMUM_REWARDS_IMPACT)
              assert(btoi(value) > 0, ERR_MIN_REWARDS_IMPACT_MUST_BE_GREATER_THAN_ZERO)
              assert(btoi(value) <= 1000, ERR_MIN_REWARDS_IMPACT_MUST_BE_LESS_THAN_OR_EQUAL_TO_1000s)
              break
            }
            case AkitaDAOGlobalStateKeysAkitaAppList: {
              decodeArc4<AkitaAppList>(value)
              break
            }
            case AkitaDAOGlobalStateKeysPluginAppList: {
              decodeArc4<PluginAppList>(value)
              break
            }
            case AkitaDAOGlobalStateKeysOtherAppList: {
              decodeArc4<OtherAppList>(value)
              break
            }
            case AkitaDAOGlobalStateKeysWalletFees: {
              decodeArc4<WalletFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysSocialFees: {
              decodeArc4<SocialFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysStakingFees: {
              decodeArc4<StakingFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysSubscriptionFees: {
              decodeArc4<SubscriptionFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysNFTFees: {
              decodeArc4<NFTFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysSwapFees: {
              decodeArc4<SwapFees>(value)
              break
            }
            case AkitaDAOGlobalStateKeysAkitaAssets: {
              decodeArc4<AkitaAssets>(value)
              break
            }
            case AkitaDAOGlobalStateKeysUpgradeAppProposalSettings:
            case AkitaDAOGlobalStateKeysAddPluginProposalSettings:
            case AkitaDAOGlobalStateKeysRemovePluginProposalSettings:
            case AkitaDAOGlobalStateKeysAddAllowancesProposalSettings:
            case AkitaDAOGlobalStateKeysRemoveAllowancesProposalSettings:
            case AkitaDAOGlobalStateKeysNewEscrowProposalSettings:
            case AkitaDAOGlobalStateKeysUpdateFieldsProposalSettings: {
              const settings = decodeArc4<ProposalSettings>(value)
              this.validateSettings(settings)
              break
            }
            default: {
              assert(false, 'Unknown field in update fields proposal action')
            }
          }
          break
        }
        default: {
          assert(false, ERR_INVALID_PROPOSAL_ACTION)
        }
      }
    }
  }

  private validateSettings(settings: ProposalSettings): void {
    assert(settings.approval > 1_000, ERR_INVALID_MIN_APPROVAL) // 1%
    assert(settings.approval <= 100_000, ERR_INVALID_MAX_APPROVAL) // 100%

    assert(settings.participation > 1_000) // 1%
    assert(settings.participation <= 100_000, ERR_INVALID_MAX_PARTICIPATION) // 100%

    assert(settings.duration > 0, ERR_INVALID_DURATION)

    assert(settings.power > 0, ERR_INVALID_MIN_POWER)
    assert(settings.power <= 1_000, ERR_INVALID_MAX_POWER)
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
      case ProposalActionTypeRemoveExecutePlugin: {
        return this.removeExecutePluginProposalSettings.value
      }
      case ProposalActionTypeRemovePlugin:
      case ProposalActionTypeRemoveNamedPlugin: {
        return this.removePluginProposalSettings.value
      }
      case ProposalActionTypeAddAllowances: {
        return this.addAllowancesProposalSettings.value
      }
      case ProposalActionTypeRemoveAllowances: {
        return this.removeAllowancesProposalSettings.value
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
      abiCall<typeof AbstractedAccountInterface.prototype.arc58_addNamedPlugin>({
        appId: this.wallet.value,
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
      })
    } else {
      abiCall<typeof AbstractedAccountInterface.prototype.arc58_addPlugin>({
        appId: this.wallet.value,
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
      })
    }

    if (escrow !== '' && allowances.length > 0) {
      this.addAllowances(escrow, allowances)
    }
  }

  private addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void {
    abiCall<typeof AbstractedAccountInterface.prototype.arc58_addAllowances>({
      appId: this.wallet.value,
      args: [escrow, allowances]
    })
  }

  private removeAllowances(escrow: string, assets: uint64[]): void {
    abiCall<typeof AbstractedAccountInterface.prototype.arc58_removeAllowances>({
      appId: this.wallet.value,
      args: [escrow, assets]
    })
  }

  private removePlugin(data: ProposalRemoveNamedPlugin): void {
    const { name, plugin, caller, escrow } = data

    if (caller.native === Global.currentApplicationAddress) {
      this.plugins({ plugin, escrow }).delete()
    }

    if (name !== '') {
      abiCall<typeof AbstractedAccountInterface.prototype.arc58_removeNamedPlugin>({
        appId: this.wallet.value,
        args: [name]
      })
      return
    }

    abiCall<typeof AbstractedAccountInterface.prototype.arc58_removePlugin>({
      appId: this.wallet.value,
      args: [plugin, caller, escrow]
    })
  }

  private newEscrow(escrow: string): uint64 {
    return abiCall<typeof AbstractedAccountInterface.prototype.arc58_newEscrow>({
      appId: this.wallet.value,
      args: [escrow]
    }).returnValue
  }

  private toggleEscrowLock(escrow: string): EscrowInfo {
    return abiCall<typeof AbstractedAccountInterface.prototype.arc58_toggleEscrowLock>({
      appId: this.wallet.value,
      args: [escrow]
    }).returnValue
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
      case AkitaDAOGlobalStateKeysAddAllowancesProposalSettings: {
        const addAllowanceSettings = decodeArc4<ProposalSettings>(value)
        this.addAllowancesProposalSettings.value = clone(addAllowanceSettings)
        break
      }
      case AkitaDAOGlobalStateKeysRemoveAllowancesProposalSettings: {
        const removeAllowanceSettings = decodeArc4<ProposalSettings>(value)
        this.removeAllowancesProposalSettings.value = clone(removeAllowanceSettings)
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

  private newExecution(key: bytes<32>, groups: bytes<32>[], firstValid: uint64, lastValid: uint64): void {
    abiCall<typeof AbstractedAccountInterface.prototype.arc58_addExecutionKey>({
      appId: this.wallet.value,
      args: [key, groups, firstValid, lastValid]
    })
  }

  private removeExecution(key: bytes<32>): void {
    abiCall<typeof AbstractedAccountInterface.prototype.arc58_removeExecutionKey>({
      appId: this.wallet.value,
      args: [key]
    })
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

    this.initialized.value = false
    this.version.value = version
    this.proposalActionLimit.value = 5
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

    this.walletFees.value = {
      createFee: fees.walletCreateFee,
      referrerPercentage: fees.walletReferrerPercentage
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

    this.upgradeAppProposalSettings.value = clone(proposalSettings.upgradeApp)
    this.addPluginProposalSettings.value = clone(proposalSettings.addPlugin)
    this.removeExecutePluginProposalSettings.value = clone(proposalSettings.removeExecutePlugin)
    this.removePluginProposalSettings.value = clone(proposalSettings.removePlugin)
    this.addAllowancesProposalSettings.value = clone(proposalSettings.addAllowance)
    this.removeAllowancesProposalSettings.value = clone(proposalSettings.removeAllowance)
    this.newEscrowProposalSettings.value = clone(proposalSettings.newEscrow)
    this.updateFieldsProposalSettings.value = clone(proposalSettings.updateFields)

    this.proposalID.value = 1
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(proposalID: uint64, index: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { status } = this.proposals(proposalID).value
    const { type, data } = this.proposals(proposalID).value.actions[index]

    assert(status === ProposalStatusApproved, ERR_PROPOSAL_NOT_APPROVED)
    assert(type === ProposalActionTypeUpgradeApp, ERR_PROPOSAL_NOT_UPGRADE_APP)

    const { app, executionKey, groups, firstValid, lastValid } = decodeArc4<ProposalUpgradeApp>(data)
    assert(app === Global.currentApplicationId.id, ERR_PROPOSAL_NOT_UPGRADE_APP)
    assert(Txn.lease === executionKey, ERR_EXECUTION_KEY_MISMATCH)
    assert(firstValid <= Global.round, ERR_EXECUTION_NOT_READY);
    assert(Global.round < lastValid, ERR_EXECUTION_EXPIRED);

    let foundGroup = false;
    for (let i: uint64 = 0; i < groups.length; i += 1) {
      if (groups[i] === Global.groupId) {
        foundGroup = true;
      }
    }

    assert(foundGroup, ERR_GROUP_NOT_FOUND)
  }

  setup(nickname: string): uint64 {
    const { walletFactory } = this.akitaAppList.value

    const cost = this.setupCost()

    const walletID = abiCall<typeof AbstractedAccountFactoryInterface.prototype.newAccount>({
      appId: walletFactory,
      args: [
        itxn.payment({
          receiver: Application(walletFactory).address,
          amount: cost,
        }),
        new Address(Global.zeroAddress),
        new Address(Global.currentApplicationAddress),
        nickname,
        new Address(Global.zeroAddress),
      ]
    }).returnValue

    this.wallet.value = Application(walletID)

    return walletID
  }

  initialize(): void {
    assert(Txn.sender === Global.creatorAddress, ERR_FORBIDDEN)
    this.initialized.value = true
  }

  // AKITA DAO METHODS ----------------------------------------------------------------------------

  newProposalPreInitialized(cid: CID, actions: ProposalAction[]): uint64 {
    assert(this.initialized.value === false, ERR_ALREADY_INITIALIZED)

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    const { powerRequired } = this.proposalCost(actions)

    this.validateActions(actions)

    return this.createOrUpdateProposal(0, cid, actions, origin, 0, powerRequired)
  }

  newProposal(payment: gtxn.PaymentTxn, cid: CID, actions: ProposalAction[]): uint64 {
    assert(this.initialized.value === true, ERR_ALREADY_INITIALIZED)

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    const { totalFee, powerRequired } = this.proposalCost(actions)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: totalFee
      },
      ERR_INVALID_PAYMENT
    )

    this.validateActions(actions)

    return this.createOrUpdateProposal(0, cid, actions, origin, totalFee, powerRequired)
  }

  editProposal(id: uint64, cid: CID, actions: ProposalAction[]): void {
    assert(this.proposals(id).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { feesPaid } = this.proposals(id).value

    const { status, creator } = this.proposals(id).value
    assert(status === ProposalStatusDraft, ERR_INVALID_PROPOSAL_STATE)

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    assert(origin === creator.native, ERR_INCORRECT_SENDER)

    const { totalFee, powerRequired } = this.proposalCost(actions)

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

    const { totalFee, powerRequired } = this.proposalCost(actions)

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

  deleteProposal(proposalId: uint64): void {
    assert(this.proposals(proposalId).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator } = this.proposals(proposalId).value
    assert(
      status === ProposalStatusDraft ||
      status === ProposalStatusExecuted,
      ERR_INVALID_PROPOSAL_STATE
    )

    const origin = getOrigin(this.otherAppList.value.escrowFactory, Txn.sender)
    assert(origin === creator.native, ERR_INCORRECT_SENDER)

    this.proposals(proposalId).delete()
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
    const nonCirculatingSupply = op.AssetHolding.assetBalance(this.wallet.value.address, bones)[0]
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
          const { executionKey, groups, firstValid, lastValid } = decodeArc4<ProposalExecutePlugin>(data)
          this.newExecution(executionKey, groups, firstValid, lastValid)
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
        case ProposalActionTypeAddAllowances: {
          const { escrow, allowances } = decodeArc4<ProposalAddAllowances>(data)
          this.addAllowances(escrow, allowances)
          break
        }
        case ProposalActionTypeRemoveAllowances: {
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

  @abimethod({ readonly: true })
  setupCost(): uint64 {
    const { walletFactory } = this.akitaAppList.value

    return abiCall<typeof AbstractedAccountFactoryInterface.prototype.cost>({
      appId: walletFactory,
    }).returnValue
  }

  @abimethod({ readonly: true })
  proposalCost(actions: ProposalAction[]): { totalFee: uint64, powerRequired: uint64 } {
    let minFee: uint64 = this.proposalsMbr(actions)
    let totalFee: uint64 = 0
    let powerRequired: uint64 = 0
    for (let i: uint64 = 0; i < actions.length; i++) {

      const { type, data } = actions[i]

      const { fee, power } = this.getProposalSettings(type, data)

      totalFee += fee

      if (type === ProposalActionTypeAddPlugin || type === ProposalActionTypeAddNamedPlugin) {
        minFee += this.pluginsMbr(String(op.bzero(24)))
      }

      if (power > powerRequired) {
        powerRequired = power
      }
    }

    if (totalFee < minFee) {
      totalFee = minFee
    }

    return { totalFee, powerRequired }
  }

  @abimethod({ readonly: true })
  getProposal(proposalID: uint64): ProposalDetails {
    if (this.proposals(proposalID).exists) {
      return this.proposals(proposalID).value
    } else {
      return {
        status: uint8(0),
        cid: op.bzero(36).toFixed({ length: 36 }),
        votes: {
          approvals: 0,
          rejections: 0,
          abstains: 0,
        },
        creator: new Address(Global.zeroAddress),
        votingTs: 0,
        created: 0,
        feesPaid: 0,
        actions: []
      }
    }
  }

  @abimethod({ readonly: true })
  mustGetProposal(proposalID: uint64): ProposalDetails {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    return this.proposals(proposalID).value
  }

  @abimethod({ readonly: true })
  proposalUpgradeAppShape(shape: ProposalUpgradeApp): ProposalUpgradeApp {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddPluginShape(shape: ProposalAddPlugin): ProposalAddPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddNamedPluginShape(shape: ProposalAddNamedPlugin): ProposalAddNamedPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemovePluginShape(shape: ProposalRemovePlugin): ProposalRemovePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveNamedPluginShape(shape: ProposalRemoveNamedPlugin): ProposalRemoveNamedPlugin {
    return shape
  }

  proposalExecutePluginShape(shape: ProposalExecutePlugin): ProposalExecutePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalExecuteNamedPluginShape(shape: ProposalExecuteNamedPlugin): ProposalExecuteNamedPlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveExecutePluginShape(shape: ProposalRemoveExecutePlugin): ProposalRemoveExecutePlugin {
    return shape
  }

  @abimethod({ readonly: true })
  proposalAddAllowancesShape(shape: ProposalAddAllowances): ProposalAddAllowances {
    return shape
  }

  @abimethod({ readonly: true })
  proposalRemoveAllowancesShape(shape: ProposalRemoveAllowances): ProposalRemoveAllowances {
    return shape
  }

  @abimethod({ readonly: true })
  proposalNewEscrowShape(shape: ProposalNewEscrow): ProposalNewEscrow {
    return shape
  }

  @abimethod({ readonly: true })
  proposalToggleEscrowLockShape(shape: ProposalToggleEscrowLock): ProposalToggleEscrowLock {
    return shape
  }

  @abimethod({ readonly: true })
  proposalUpdateFieldShape(shape: ProposalUpdateField): ProposalUpdateField {
    return shape
  }

  opUp(): void { }
}