import {
  Account,
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
  TransactionType,
  OnCompleteAction,
  itxnCompose,
  Asset,
  clone,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, itob, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, decodeArc4, methodSelector, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AkitaAppList,
  AkitaAssets,
  DAOPluginInfo,
  EscrowAssetKey,
  ExecutionInfo,
  ExecutionKey,
  NFTFees,
  OtherAppList,
  PayoutEscrowInfo,
  PayoutEscrowType,
  PluginAppList,
  ProposalAction,
  ProposalAddAllowance,
  ProposalAddNamedPlugin,
  ProposalAddPlugin,
  ProposalDetails,
  ProposalExecutePlugin,
  ProposalRemoveAllowance,
  ProposalRemoveNamedPlugin,
  ProposalRemovePlugin,
  ProposalSettings,
  ProposalStatus,
  ProposalUpdateField,
  ProposalUpgradeApp,
  ProposalVoteInfo,
  ProposalVoteKey,
  ReceiveEscrowInfo,
  SocialFees,
  StakingFees,
  SubscriptionFees,
  SwapFees,
} from './types'

import { ERR_ALREADY_INITIALIZED, ERR_ASSET_ALREADY_ALLOCATED, ERR_BAD_DAO_DELEGATION_TYPE, ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_IS_ALREADY_OPTED_IN, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_OPTED_IN, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD, ERR_INVALID_AUCTION_RAFFLE_PERCENTAGE, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MAX, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MIN, ERR_INVALID_CONTENT_POLICY, ERR_INVALID_FIELD, ERR_INVALID_IMPACT_TAX_MAX, ERR_INVALID_IMPACT_TAX_MIN, ERR_INVALID_KRBY_PERCENTAGE, ERR_INVALID_MARKETPLACE_COMPOSABLE_PERCENTAGE, ERR_INVALID_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, ERR_INVALID_METHOD_SIGNATURE_LENGTH, ERR_INVALID_MINIMUM_REWARDS_IMPACT, ERR_INVALID_MOD_PERCENTAGE, ERR_INVALID_PAYMENT_PERCENTAGE, ERR_INVALID_POOL_CREATION_FEE, ERR_INVALID_POOL_IMPACT_TAX_MAX, ERR_INVALID_POOL_IMPACT_TAX_MIN, ERR_INVALID_POST_FEE, ERR_INVALID_PROPOSAL_FEE, ERR_INVALID_PROPOSAL_STATE, ERR_INVALID_PROPOSAL_STATUS, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MAX, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MIN, ERR_INVALID_REACT_FEE, ERR_INVALID_REVOCATION_ADDRESS, ERR_INVALID_SERVICE_CREATION_FEE, ERR_INVALID_SHUFFLE_SALE_PERCENTAGE, ERR_INVALID_SWAP_IMPACT_TAX_MAX, ERR_INVALID_SWAP_IMPACT_TAX_MIN, ERR_INVALID_TOTAL_PERCENTAGE_FEES, ERR_INVALID_TRIGGER_PERCENTAGE, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST, ERR_VERSION_CANNOT_BE_EMPTY, ERR_WRONG_METHOD_FOR_EXECUTION_KEY_LOCKED_PLUGIN } from './errors'
import {
  AkitaDAOBoxPrefixProposals,
  AkitaDAOGlobalStateKeysAkitaAppList,
  AkitaDAOGlobalStateKeysAkitaAssets,
  AkitaDAOGlobalStateKeysContentPolicy,
  AkitaDAOGlobalStateKeysKrbyPercentage,
  AkitaDAOGlobalStateKeysModeratorPercentage,
  AkitaDAOGlobalStateKeysNFTFees,
  AkitaDAOGlobalStateKeysOtherAppList,
  AkitaDAOGlobalStateKeysPluginAppList,
  AkitaDAOGlobalStateKeysProposalFee,
  AkitaDAOGlobalStateKeysProposalID,
  AkitaDAOGlobalStateKeysRevocationAddress,
  AkitaDAOGlobalStateKeysSocialFees,
  AkitaDAOGlobalStateKeysStakingFees,
  AkitaDAOGlobalStateKeysSubscriptionFees,
  AkitaDAOGlobalStateKeysSwapFees,
  AkitDAOBoxPrefixEscrows,
  ProposalActionAddAllowance,
  ProposalActionAddNamedPlugin,
  ProposalActionAddPlugin,
  ProposalActionExecuteNamedPlugin,
  ProposalActionExecutePlugin,
  ProposalActionRemoveAllowance,
  ProposalActionRemoveNamedPlugin,
  ProposalActionRemovePlugin,
  ProposalActionUpdateFields,
  ProposalActionUpgradeApp,
  ProposalStatusApproved,
  ProposalStatusDraft,
  ProposalStatusVoting,
  AkitaDAOGlobalStateKeysMinRewardsImpact,
  EscrowDisbursementPhaseIdle,
  EscrowDisbursementPhaseAllocation,
  AkitaDAOEscrowAccountModerators,
  AkitaDAOEscrowAccountKrby,
  EscrowDisbursementPhaseFinalization,
  AkitaDAOGlobalStateKeysProposalCreationSettings,
  AkitaDAOGlobalStateKeysProposalParticipationSettings,
  AkitaDAOGlobalStateKeysProposalApprovalThresholdSettings,
  AkitaDAOGlobalStateKeysProposalVotingDurationSettings,
  AkitaDAOBoxPrefixReceiveEscrows,
  AkitaDAOBoxPrefixProposalVotes,
  MinDAOPluginMBR,
  MinDAONamedPluginMBR,
  DAOAllowanceMBR,
  MinDAOEscrowMBR,
  MinDAOProposalsMBR,
  DAOProposalVotesMBR,
  DAOReceiveEscrowsMBR,
  DAOReceiveAssetsMBR,
  AkitDAOBoxPrefixReceiveAssets,
  AkitaDAOBoxPrefixPayoutEscrows,
  AkitaDAOBoxPrefixExecutions,
  AkitaDAOEscrowAccountGovernors,
  PayoutEscrowTypeIndividual,
  MinDAOPayoutEscrowsMBR,
  DAOPayoutEscrowIndividualByteLength,
  DAOPayoutEscrowGroupByteLength,
  DAOExecutionsMBR,
  AkitaDAOGlobalStateKeysInitialized,
  AkitaDAOEscrowAccountSocial,
  AkitaDAOEscrowAccountSubscriptions,
  AkitaDAOEscrowAccountStakingPools,
  AkitaDAOEscrowAccountMarketplace,
  AkitaDAOEscrowAccountAuctions,
  AkitaDAOEscrowAccountRaffles,
  PayoutEscrowTypeGroup,
} from './constants'
import { GlobalStateKeyVersion } from '../constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { BoxCostPerByte, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from '../utils/constants'
import { AbstractAccountBoxPrefixAllowances, AbstractAccountBoxPrefixNamedPlugins, AbstractAccountBoxPrefixPlugins, AbstractAccountGlobalStateKeysControlledAddress, AbstractAccountGlobalStateKeysEscrowFactory, AbstractAccountGlobalStateKeysLastChange, AbstractAccountGlobalStateKeysSpendingAddress, MethodRestrictionByteLength } from '../arc58/account/constants'
import { AddAllowanceInfo, AllowanceInfo, AllowanceKey, DelegationTypeSelf, FullPluginValidation, FundsRequest, MethodInfo, MethodRestriction, MethodValidation, PluginKey, PluginValidation, SpendAllowanceTypeDrip, SpendAllowanceTypeFlat, SpendAllowanceTypeWindow } from '../arc58/account/types'
import { ERR_ALLOWANCE_ALREADY_EXISTS, ERR_ALLOWANCE_DOES_NOT_EXIST, ERR_ALLOWANCE_EXCEEDED, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_INVALID_ONCOMPLETE, ERR_INVALID_PLUGIN_CALL, ERR_INVALID_SENDER_ARG, ERR_INVALID_SENDER_VALUE, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_MISSING_REKEY_BACK, ERR_NOT_USING_ESCROW } from '../arc58/account/errors'
import { CID } from '../utils/types/base'
import { AppCreatorsMbr, calcPercent, getOrigin, getStakingPower } from '../utils/functions'
import { ONE_DAY } from '../gates/sub-gates/staking-power/constants'
// import { EscrowFactory } from '../escrow/factory.algo'
import { ERR_FORBIDDEN } from '../escrow/errors'
// import { AkitaDAOInterface } from '../utils/types/dao'
import { NewCostForARC58 } from '../escrow/constants'
import { MinPoolRewardsMBR, POOL_STAKING_TYPE_LOCK, POOL_STAKING_TYPE_NONE, PoolGlobalStateBytesCount, PoolGlobalStateUintCount, WinnerCountCap } from '../pool/constants'
import { RootKey } from '../meta-merkles/types'
// import { PoolFactoryInterface } from '../utils/types/pool'
import { EscrowFactoryInterface } from '../utils/types/escrows'

/**
 * The Akita DAO contract has several responsibilities:
 * [ ] Manages the disbursement of the bones token
 * [ ] Manages the disbursement of earned income
 * [x] Manages the content policy of the protocol
 * [x] Manages the minimum impact score to qualify for daily disbursement
 * [x] Manages service fees
 */

export class AkitaDAODep extends Contract { // implements AkitaDAOInterface

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  initialized = GlobalState<boolean>({ initialValue: false, key: AkitaDAOGlobalStateKeysInitialized })
  /** the version number of the DAO */
  version = GlobalState<string>({ initialValue: '', key: GlobalStateKeyVersion })
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
  // internal state variables
  /** The default settings for creating proposals by proposal action */
  proposalCreationSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalCreationSettings })
  /** The default minimum participation needed for a proposal to be valid */
  proposalParticipationSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalParticipationSettings })
  /** The default threshold of approval votes needed for a proposal to pass */
  proposalApprovalThresholdSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalApprovalThresholdSettings })
  /** The default duration for which a proposal must be open for voting */
  proposalVotingDurationSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalVotingDurationSettings })
  /** The address this app controls */
  controlledAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysControlledAddress })
  /** The last time state has changed on the abstracted account (not including lastCalled for cooldowns) in unix time */
  lastChange = GlobalState<uint64>({ key: AbstractAccountGlobalStateKeysLastChange })
  /** [TEMPORARY STATE FIELD] The spending address for the currently active plugin */
  spendingAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysSpendingAddress })
  /** the spending account factory to use for allowances */
  escrowFactory = GlobalState<Application>({ key: AbstractAccountGlobalStateKeysEscrowFactory })
  /** revocation msig */
  revocationAddress = GlobalState<Account>({ key: AkitaDAOGlobalStateKeysRevocationAddress })
  /** the next proposal id */
  proposalID = GlobalState<uint64>({ initialValue: 0, key: AkitaDAOGlobalStateKeysProposalID })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<PluginKey, DAOPluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, PluginKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins })
  /** the escrows that this wallet has created for specific callers with allowances */
  escrows = BoxMap<string, uint64>({ keyPrefix: AkitDAOBoxPrefixEscrows })
  /** escrow accounts for services to payback revenue to the DAO */
  receiveEscrows = BoxMap<uint64, ReceiveEscrowInfo>({ keyPrefix: AkitaDAOBoxPrefixReceiveEscrows })
  /** box map of escrow assets that have already been processed during this allocation */
  receiveAssets = BoxMap<EscrowAssetKey, bytes<0>>({ keyPrefix: AkitDAOBoxPrefixReceiveAssets })
  /** escrow accounts meant to payout recipients */
  payoutEscrows = BoxMap<uint64, PayoutEscrowInfo>({ keyPrefix: AkitaDAOBoxPrefixPayoutEscrows })
  /** The Allowances for plugins installed on the smart contract with useAllowance set to true */
  allowances = BoxMap<AllowanceKey, AllowanceInfo>({ keyPrefix: AbstractAccountBoxPrefixAllowances }) // 38_500
  /** voting state of a proposal */
  proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** votes by proposal id & address */
  proposalVotes = BoxMap<ProposalVoteKey, ProposalVoteInfo>({ keyPrefix: AkitaDAOBoxPrefixProposalVotes })
  /** execution keys and their state */
  executions = BoxMap<ExecutionKey, ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private updateLastChange() {
    this.lastChange.value = Global.latestTimestamp
  }

  private pluginsMbr(methodCount: uint64): uint64 {
    return MinDAOPluginMBR + (
      BoxCostPerByte * (MethodRestrictionByteLength * methodCount)
    );
  }

  private namedPluginsMbr(name: string): uint64 {
    return MinDAONamedPluginMBR + (BoxCostPerByte * Bytes(name).length);
  }

  private escrowsMbr(name: string): uint64 {
    return MinDAOEscrowMBR + (BoxCostPerByte * Bytes(name).length);
  }

  private receiveEscrowsMbr(): uint64 {
    return DAOReceiveEscrowsMBR
  }

  private receiveAssetsMbr(): uint64 {
    return DAOReceiveAssetsMBR
  }

  private payoutEscrowsMbr(payoutEscrowType: PayoutEscrowType): uint64 {
    const typeLength = (payoutEscrowType === PayoutEscrowTypeIndividual)
      ? DAOPayoutEscrowIndividualByteLength
      : DAOPayoutEscrowGroupByteLength
    return MinDAOPayoutEscrowsMBR + (BoxCostPerByte * typeLength)
  }

  private allowancesMbr(): uint64 {
    return DAOAllowanceMBR;
  }

  private proposalsMbr(data: bytes): uint64 {
    return MinDAOProposalsMBR + (BoxCostPerByte * data.length)
  }

  private proposalVotesMbr(): uint64 {
    return DAOProposalVotesMBR
  }

  private executionsMbr(): uint64 {
    return DAOExecutionsMBR
  }

  private maybeNewEscrow(escrow: string): uint64 {
    if (escrow === '') {
      return 0;
    }

    return this.escrows(escrow).exists
      ? this.escrows(escrow).value
      : this.newEscrow(escrow);
  }

  private newEscrow(escrow: string): uint64 {
    const escrowID = abiCall(
      EscrowFactoryInterface.prototype.new,
      {
        sender: this.controlledAddress.value,
        appId: this.escrowFactory.value,
        args: [
          itxn.payment({
            sender: this.controlledAddress.value,
            amount: NewCostForARC58 + Global.minBalance,
            receiver: this.escrowFactory.value.address
          }),
        ]
      }
    ).returnValue

    this.escrows(escrow).value = escrowID

    return escrowID;
  }

  private newIndividualPayoutEscrow(
    escrow: string,
    recipient: Address
  ): uint64 {
    const escrowID = this.newEscrow(escrow)
    this.payoutEscrows(escrowID).value = {
      type: PayoutEscrowTypeIndividual,
      data: Bytes(recipient.native.bytes)
    }

    return escrowID
  }

  private newGroupPayoutEscrow(
    escrow: string,
    poolID: uint64
  ): uint64 {
    const escrowID = this.newEscrow(escrow)
    this.payoutEscrows(escrowID).value = {
      type: PayoutEscrowTypeGroup,
      data: Bytes(itob(poolID))
    }

    return escrowID
  }

  private newReceiveEscrow(
    escrow: string,
    source: Account,
    allocatable: boolean,
    optinAllowed: boolean
  ): uint64 {
    const escrowID = this.newEscrow(escrow)

    this.receiveEscrows(escrowID).value = {
      source: new Address(source),
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

  private newProposalID(): uint64 {
    const id = this.proposalID.value
    this.proposalID.value += 1
    return id
  }

  private pluginCallAllowed(application: uint64, allowedCaller: Account, method: bytes<4>): boolean {
    const key: PluginKey = { application, allowedCaller }

    if (!this.plugins(key).exists) {
      return false;
    }

    if (this.plugins(key).value.useExecutionKey) {
      return false;
    }

    const { useRounds, lastCalled, cooldown, methods } = clone(this.plugins(key).value)
    let methodAllowed = methods.length > 0 ? false : true;
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      if (methods[i].selector === method) {
        methodAllowed = true;
        break;
      }
    }

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    return (
      lastCalled >= epochRef &&
      (epochRef - lastCalled) >= cooldown &&
      methodAllowed
    )
  }

  private txnRekeysBack(txn: gtxn.Transaction): boolean {
    // this check is for manual rekeyTo calls, it only ever uses the controlled address so its okay to hardcode it here
    if (
      txn.sender === this.controlledAddress.value &&
      txn.rekeyTo === Global.currentApplicationAddress
    ) {
      return true;
    }

    return (
      txn.type === TransactionType.ApplicationCall
      && txn.appId === Global.currentApplicationId
      && txn.numAppArgs === 1
      && txn.onCompletion === OnCompleteAction.NoOp
      && txn.appArgs(0) === methodSelector('arc58_verifyAuthAddr()void')
    )
  }

  private pluginCheck(key: PluginKey): PluginValidation {

    const exists = this.plugins(key).exists;
    if (!exists) {
      return {
        exists: false,
        expired: true,
        hasCooldown: true,
        onCooldown: true,
        hasMethodRestrictions: false,
        valid: false
      }
    }

    const { useExecutionKey, useRounds, lastValid, lastCalled, cooldown, methods } = clone(this.plugins(key).value)

    if (useExecutionKey) {
      assert(this.executions(Global.groupId).exists)
    }

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    const expired = epochRef > lastValid;
    const hasCooldown = cooldown > 0;
    const onCooldown = (epochRef - lastCalled) < cooldown;
    const hasMethodRestrictions = methods.length > 0;

    const valid = exists && !expired && !onCooldown;

    return {
      exists,
      expired,
      hasCooldown,
      onCooldown,
      hasMethodRestrictions,
      valid
    }
  }

  private fullPluginCheck(
    key: PluginKey,
    txn: gtxn.ApplicationCallTxn,
    methodOffsets: uint64[],
    methodIndex: uint64
  ): FullPluginValidation {

    const check = this.pluginCheck(key);

    if (!check.valid) {
      return {
        ...check,
        methodAllowed: false,
        methodHasCooldown: true,
        methodOnCooldown: true
      }
    }

    let mCheck: MethodValidation = {
      methodAllowed: !check.hasMethodRestrictions,
      methodHasCooldown: false,
      methodOnCooldown: false
    }

    if (check.hasMethodRestrictions) {
      assert(methodIndex < methodOffsets.length, ERR_MALFORMED_OFFSETS);
      mCheck = this.methodCheck(key, txn, methodOffsets[methodIndex]);
    }

    return {
      ...check,
      ...mCheck,
      valid: check.valid && mCheck.methodAllowed
    }
  }

  /**
   * Guarantee that our txn group is valid in a single loop over all txns in the group
   * 
   * @param key the box key for the plugin were checking
   * @param methodOffsets the indices of the methods being used in the group
   */
  private assertValidGroup(key: PluginKey, methodOffsets: uint64[]): void {

    const epochRef = this.plugins(key).value.useRounds
      ? Global.round
      : Global.latestTimestamp;

    const initialCheck = this.pluginCheck(key);

    assert(initialCheck.exists, ERR_PLUGIN_DOES_NOT_EXIST);
    assert(!initialCheck.expired, ERR_PLUGIN_EXPIRED);
    assert(!initialCheck.onCooldown, ERR_PLUGIN_ON_COOLDOWN);

    let rekeysBack = false;
    let methodIndex: uint64 = 0;

    for (let i: uint64 = (Txn.groupIndex + 1); i < Global.groupSize; i += 1) {
      const txn = gtxn.Transaction(i)

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true;
        break;
      }

      if (txn.type !== TransactionType.ApplicationCall) {
        continue;
      }

      assert(txn.appId.id === key.application, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY);
      assert(txn.onCompletion === OnCompleteAction.NoOp, ERR_INVALID_ONCOMPLETE);
      // ensure the first arg to a method call is the app id itself
      // index 1 is used because arg[0] is the method selector
      assert(txn.numAppArgs > 1, ERR_INVALID_SENDER_ARG);
      assert(Application(btoi(txn.appArgs(1))) === Global.currentApplicationId, ERR_INVALID_SENDER_VALUE);

      const check = this.fullPluginCheck(key, txn, methodOffsets, methodIndex);

      assert(!check.methodOnCooldown, ERR_METHOD_ON_COOLDOWN);
      assert(check.valid, ERR_INVALID_PLUGIN_CALL);

      if (initialCheck.hasCooldown) {
        this.plugins(key).value.lastCalled = epochRef
      }

      methodIndex += 1;
    }

    assert(rekeysBack, ERR_MISSING_REKEY_BACK);
  }

  /**
   * Checks if the method call is allowed
   * 
   * @param key the box key for the plugin were checking
   * @param caller the address that triggered the plugin or global address
   * @param offset the index of the method being used
   * @returns whether the method call is allowed
   */
  private methodCheck(key: PluginKey, txn: gtxn.ApplicationCallTxn, offset: uint64): MethodValidation {

    assert(len(txn.appArgs(0)) === 4, ERR_INVALID_METHOD_SIGNATURE_LENGTH);
    const selectorArg = txn.appArgs(0).toFixed({ length: 4 })

    const { useRounds, methods } = clone(this.plugins(key).value)
    const { selector, cooldown, lastCalled } = methods[offset]

    const hasCooldown = cooldown > 0

    const epochRef = useRounds ? Global.round : Global.latestTimestamp
    const onCooldown = (epochRef - lastCalled) < cooldown

    if (selector === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        const lastCalled = useRounds
          ? Global.round
          : Global.latestTimestamp

        methods[offset].lastCalled = lastCalled
        this.plugins(key).value.methods = clone(methods)
      }

      return {
        methodAllowed: true,
        methodHasCooldown: hasCooldown,
        methodOnCooldown: onCooldown
      }
    }

    return {
      methodAllowed: false,
      methodHasCooldown: true,
      methodOnCooldown: true
    }
  }

  private transferFunds(key: PluginKey, fundsRequests: FundsRequest[]): void {
    for (let i: uint64 = 0; i < fundsRequests.length; i += 1) {
      const { escrow } = this.plugins(key).value

      const allowanceKey: AllowanceKey = {
        escrow,
        asset: fundsRequests[i].asset
      }

      this.verifyAllowance(allowanceKey, fundsRequests[i]);

      if (fundsRequests[i].asset !== 0) {
        itxn
          .assetTransfer({
            sender: this.controlledAddress.value,
            assetReceiver: this.spendingAddress.value,
            assetAmount: fundsRequests[i].amount,
            xferAsset: fundsRequests[i].asset
          })
          .submit();
      } else {
        itxn
          .payment({
            sender: this.controlledAddress.value,
            receiver: this.spendingAddress.value,
            amount: fundsRequests[i].amount
          })
          .submit();
      }
    }
  }

  private verifyAllowance(
    key: AllowanceKey,
    fundRequest: FundsRequest
  ): void {
    assert(this.allowances(key).exists, ERR_ALLOWANCE_DOES_NOT_EXIST);
    const { type, spent, allowed, last, max, interval, start, useRounds } = this.allowances(key).value
    const newLast = useRounds ? Global.round : Global.latestTimestamp

    if (type === SpendAllowanceTypeFlat) {
      const leftover: uint64 = allowed - spent;

      assert(leftover >= fundRequest.amount, ERR_ALLOWANCE_EXCEEDED);

      this.allowances(key).value = {
        ...this.allowances(key).value,
        spent: (spent + fundRequest.amount)
      }
    } else if (type === SpendAllowanceTypeWindow) {
      const currentWindowStart = this.getLatestWindowStart(useRounds, start, interval)

      if (currentWindowStart > last) {
        assert(allowed >= fundRequest.amount, ERR_ALLOWANCE_EXCEEDED);

        this.allowances(key).value = {
          ...this.allowances(key).value,
          spent: fundRequest.amount,
          last: newLast
        }
      } else {
        // calc the remaining amount available in the current window
        const leftover: uint64 = allowed - spent;
        assert(leftover >= fundRequest.amount, ERR_ALLOWANCE_EXCEEDED);

        this.allowances(key).value = {
          ...this.allowances(key).value,
          spent: (spent + fundRequest.amount),
          last: newLast
        }
      }

    } else if (type === SpendAllowanceTypeDrip) {
      const epochRef = useRounds ? Global.round : Global.latestTimestamp;

      const amount = fundRequest.amount
      const accrualRate = allowed
      const lastLeftover = spent

      const passed: uint64 = epochRef - last
      const accrued: uint64 = lastLeftover + ((passed / interval) * accrualRate)

      const available: uint64 = accrued > max ? max : accrued

      assert(available >= amount, ERR_ALLOWANCE_EXCEEDED);

      this.allowances(key).value = {
        ...this.allowances(key).value,
        spent: (available - amount),
        last: newLast
      }
    }
  }

  private getLatestWindowStart(useRounds: boolean, start: uint64, interval: uint64): uint64 {
    if (useRounds) {
      return Global.round - ((Global.round - start) % interval)
    }
    return Global.latestTimestamp - ((Global.latestTimestamp - start) % interval)
  }

  /**
   * What the value of this.address.value.authAddr should be when this.controlledAddress
   * is able to be controlled by this app. It will either be this.app.address or zeroAddress
   */
  private getAuthAddr(): Account {
    return this.spendingAddress.value === this.controlledAddress.value
      ? Global.zeroAddress
      : Global.currentApplicationAddress
  }

  /**
   * Add an app to the list of approved plugins
   *
   * @param app The app to add
   * @param allowedCaller The address of that's allowed to call the app
   * or the global zero address for any address
   * @param admin Whether the plugin has permissions to change the admin account
   * @param delegationType the ownership of the delegation for last_interval updates
   * @param escrow The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created
   * @param lastValid The timestamp or round when the permission expires
   * @param cooldown The number of seconds or rounds that must pass before the plugin can be called again
   * @param methods The methods that are allowed to be called for the plugin by the address
   * @param useRounds Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp
   * @param useExecutionKey Whether the plugin uses an execution key for usage
   * @param executionProposalCreationMinimum This minimum staking power required to create a proposal to use the plugin
   * @param executionParticipationThreshold The minimum participation required for a proposal to use the plugin to be valid
   * @param executionApprovalThreshold The minimum approval threshold required for a proposal to use the plugin to pass
   * @param executionVotingDuration The duration for which a proposal to use the plugin must be open for voting
  */
  private addPlugin(
    app: uint64,
    allowedCaller: Address,
    delegationType: Uint8,
    escrow: string,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean,
    executionProposalCreationMinimum: uint64,
    executionParticipationThreshold: uint64,
    executionApprovalThreshold: uint64,
    executionVotingDuration: uint64
  ): void {
    assert(delegationType !== DelegationTypeSelf, ERR_BAD_DAO_DELEGATION_TYPE)
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native }

    let methodInfos: MethodInfo[] = []
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push({ ...methods[i], lastCalled: 0 })
    }

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.pluginsMbr(methods.length)
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    this.plugins(key).value = {
      delegationType,
      escrow: escrowID,
      lastValid,
      cooldown,
      methods: clone(methodInfos),
      useRounds,
      lastCalled: 0,
      start: epochRef,
      useExecutionKey,
      executionProposalCreationMinimum,
      executionParticipationThreshold,
      executionApprovalThreshold,
      executionVotingDuration,
    }

    this.updateLastChange();
  }

  // private validateRemovePluginProposal(params: ProposalRemovePlugin): boolean {
  //   return false
  // }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   * @param allowedCaller The address that's allowed to call the app
  */
  private removePlugin(app: uint64, allowedCaller: Address): void {
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };
    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const methodsLength: uint64 = this.plugins(key).value.methods.length

    this.plugins(key).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: this.pluginsMbr(methodsLength)
        })
        .submit()
    }

    this.updateLastChange();
  }

  // TODO:
  // private validateAddNamedPluginProposal(params: ProposalAddNamedPlugin): void {}

  /**
   * Add a named plugin
   *
   * @param name The plugin name
   * @param app The app to add
   * @param allowedCaller The address that's allowed to call the app
   * or the global zero address for any address
   * @param admin Whether the plugin has permissions to change the admin account
   * @param delegationType the ownership of the delegation for last_interval updates
   * @param escrow The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created
   * @param lastValid The timestamp or round when the permission expires
   * @param cooldown The number of seconds or rounds that must pass before the plugin can be called again
   * @param methods The methods that are allowed to be called for the plugin by the address
   * @param useRounds Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp
   * @param useExecutionKey Whether the plugin uses an execution key for usage
   * @param executionProposalCreationMinimum This minimum staking power required to create a proposal to use the plugin
   * @param executionParticipationThreshold The minimum participation required for a proposal to use the plugin to be valid
   * @param executionApprovalThreshold The minimum approval threshold required for a proposal to use the plugin to pass
   * @param executionVotingDuration The duration for which a proposal to use the plugin must be open for voting
  */
  private addNamedPlugin(
    name: string,
    app: uint64,
    allowedCaller: Address,
    delegationType: Uint8,
    escrow: string,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean,
    executionProposalCreationMinimum: uint64,
    executionParticipationThreshold: uint64,
    executionApprovalThreshold: uint64,
    executionVotingDuration: uint64
  ): void {
    assert(!this.namedPlugins(name).exists);
    assert(escrow === '' || this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);

    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };
    this.namedPlugins(name).value = clone(key)

    let methodInfos: MethodInfo[] = [] 
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push({ ...methods[i], lastCalled: 0 })
    }

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.pluginsMbr(methods.length) + this.namedPluginsMbr(name)
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    this.plugins(key).value = {
      delegationType,
      escrow: escrowID,
      lastValid,
      cooldown,
      methods: clone(methodInfos),
      useRounds,
      lastCalled: 0,
      start: epochRef,
      useExecutionKey,
      executionProposalCreationMinimum,
      executionParticipationThreshold,
      executionApprovalThreshold,
      executionVotingDuration,
    }
  }

  // private validateRemoveNamedPluginProposal(params: ProposalRemoveNamedPlugin): void { }

  /**
   * Remove a named plugin
   *
   * @param name The plugin name
  */
  private removeNamedPlugin(name: string): void {
    assert(this.namedPlugins(name).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    const app = clone(this.namedPlugins(name).value)
    assert(this.plugins(app).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const methodsLength: uint64 = this.plugins(app).value.methods.length

    this.namedPlugins(name).delete();
    this.plugins(app).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: this.pluginsMbr(methodsLength) + this.namedPluginsMbr(name)
        })
        .submit()
    }

  }

  // TODO:
  // private validateAddAllowanceProposal(params: ProposalAddAllowance): void { }

  /**
   * Add an allowance for an escrow account
   *
   * @param escrow The escrow to add the allowance for
   * @param allowances The list of allowances to add
  */
  private addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.allowancesMbr() * allowances.length
        })
        .submit()
    }

    for (let i: uint64 = 0; i < allowances.length; i += 1) {
      const { asset, type, allowed, max, interval, useRounds } = allowances[i];
      const key: AllowanceKey = { escrow: this.escrows(escrow).value, asset }
      assert(!this.allowances(key).exists, ERR_ALLOWANCE_ALREADY_EXISTS);
      const start = useRounds ? Global.round : Global.latestTimestamp;

      this.allowances(key).value = {
        type,
        spent: 0,
        allowed,
        last: 0,
        max,
        interval,
        start,
        useRounds
      }
    }

    this.updateLastChange();
  }

  // TODO:
  // private validateRemoveAllowanceProposal(params: ProposalRemoveAllowance): void { }

  /**
   * Remove an allowances for an escrow account
   *
   * @param escrow The escrow to remove the allowance for
   * @param assets The list of assets to remove the allowance for
  */
  private removeAllowances(escrow: string, assets: uint64[]): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: this.allowancesMbr() * assets.length
        })
        .submit()
    }

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const key: AllowanceKey = {
        escrow: this.escrows(escrow).value,
        asset: assets[i]
      }
      assert(this.allowances(key).exists, ERR_ALLOWANCE_DOES_NOT_EXIST);
      this.allowances(key).delete();
    }

    this.updateLastChange();
  }

  // private validateUpgradeAppProposal(params: ProposalUpgradeApp): void { }

  // private validateUpdateFieldsProposal(params: ProposalUpdateField[]): void {
  //   for (let i: uint64 = 0; i < params.length; i += 1) {
  //     const { field, value } = params[i]

  //     switch (field) {
  //       case AkitaDAOGlobalStateKeysContentPolicy: {
  //         assert(Bytes(value).length === CID_LENGTH, ERR_INVALID_CONTENT_POLICY)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysMinRewardsImpact: {
  //         const minRewardsImpact = decodeArc4<uint64>(Bytes(value))
  //         assert(minRewardsImpact >= 0, ERR_INVALID_MINIMUM_REWARDS_IMPACT)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysSocialFees: {
  //         const { postFee, reactFee, impactTaxMin, impactTaxMax } = decodeArc4<SocialFees>(Bytes(value))
  //         assert(postFee >= MIN_POST_FEE && postFee < MAX_POST_FEE, ERR_INVALID_POST_FEE)
  //         assert(reactFee >= MIN_REACT_FEE && reactFee < MAX_REACT_FEE, ERR_INVALID_REACT_FEE)
  //         assert(impactTaxMin >= MIN_IMPACT_TAX_MIN, ERR_INVALID_IMPACT_TAX_MIN)
  //         assert(
  //           impactTaxMax > impactTaxMin
  //           && impactTaxMax >= MIN_IMPACT_TAX_MAX
  //           && impactTaxMax <= DIVISOR,
  //           ERR_INVALID_IMPACT_TAX_MAX
  //         )
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysStakingFees: {
  //         const { creationFee, impactTaxMin, impactTaxMax } = decodeArc4<StakingFees>(Bytes(value))
  //         assert(creationFee > 0, ERR_INVALID_POOL_CREATION_FEE)
  //         assert(impactTaxMin >= MIN_POOL_IMPACT_TAX_MIN, ERR_INVALID_POOL_IMPACT_TAX_MIN)
  //         assert(
  //           impactTaxMax >= impactTaxMin
  //           && impactTaxMax >= MIN_POOL_IMPACT_TAX_MAX
  //           && impactTaxMax <= DIVISOR,
  //           ERR_INVALID_POOL_IMPACT_TAX_MAX
  //         )
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysSubscriptionFees: {
  //         const { serviceCreationFee, paymentPercentage, triggerPercentage } = decodeArc4<SubscriptionFees>(Bytes(value))
  //         assert(serviceCreationFee > 0, ERR_INVALID_SERVICE_CREATION_FEE)
  //         assert(paymentPercentage >= MIN_PAYMENT_PERCENTAGE, ERR_INVALID_PAYMENT_PERCENTAGE)
  //         assert(triggerPercentage >= MIN_TRIGGER_PERCENTAGE, ERR_INVALID_TRIGGER_PERCENTAGE)
  //         assert((paymentPercentage + triggerPercentage) < DIVISOR, ERR_INVALID_TOTAL_PERCENTAGE_FEES)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysNFTFees: {
  //         const {
  //           marketplaceSalePercentageMin,
  //           marketplaceSalePercentageMax,
  //           marketplaceComposablePercentage,
  //           marketplaceRoyaltyDefaultPercentage,
  //           shuffleSalePercentage,
  //           auctionSaleImpactTaxMin,
  //           auctionSaleImpactTaxMax,
  //           auctionComposablePercentage,
  //           auctionRafflePercentage,
  //           raffleSaleImpactTaxMin,
  //           raffleSaleImpactTaxMax,
  //           raffleComposablePercentage,
  //         } = decodeArc4<NFTFees>(Bytes(value))

  //         assert(marketplaceSalePercentageMin > MIN_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MINIMUM)
  //         assert(
  //           marketplaceSalePercentageMax > marketplaceSalePercentageMin &&
  //           marketplaceSalePercentageMax >= MIN_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM,
  //           ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM
  //         )
  //         assert(
  //           marketplaceComposablePercentage >= MIN_MARKETPLACE_COMPOSABLE_PERCENTAGE,
  //           ERR_INVALID_MARKETPLACE_COMPOSABLE_PERCENTAGE
  //         )
  //         assert(
  //           marketplaceRoyaltyDefaultPercentage >= MIN_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE,
  //           ERR_INVALID_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE
  //         )
  //         assert(
  //           (marketplaceSalePercentageMax + marketplaceComposablePercentage + marketplaceRoyaltyDefaultPercentage) <= DIVISOR,
  //           ERR_INVALID_TOTAL_PERCENTAGE_FEES
  //         )
  //         // ensure total marketplace fees are less than 100%
  //         assert(shuffleSalePercentage <= DIVISOR, ERR_INVALID_SHUFFLE_SALE_PERCENTAGE)
  //         assert(auctionSaleImpactTaxMin >= MIN_AUCTION_SALE_IMPACT_TAX_MIN, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MIN)
  //         assert(
  //           auctionSaleImpactTaxMax > auctionSaleImpactTaxMin
  //           && auctionSaleImpactTaxMax >= MIN_AUCTION_SALE_IMPACT_TAX_MAX,
  //           ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MAX
  //         )
  //         // ensure total auction fees are less than 100%
  //         assert(
  //           (auctionSaleImpactTaxMax + auctionComposablePercentage) <= DIVISOR,
  //           ERR_INVALID_TOTAL_PERCENTAGE_FEES
  //         )
  //         // ensure total auction raffle fees are less than 100%
  //         assert(auctionRafflePercentage <= DIVISOR, ERR_INVALID_AUCTION_RAFFLE_PERCENTAGE)
  //         assert(raffleSaleImpactTaxMin >= MIN_RAFFLE_SALE_IMPACT_TAX_MIN, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MIN)
  //         assert(
  //           raffleSaleImpactTaxMax > raffleSaleImpactTaxMin
  //           && raffleSaleImpactTaxMax >= MIN_RAFFLE_SALE_IMPACT_TAX_MAX,
  //           ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MAX
  //         )
  //         // ensure total raffle fees are less than 100%
  //         assert(
  //           (raffleSaleImpactTaxMax + raffleComposablePercentage) < DIVISOR,
  //           ERR_INVALID_TOTAL_PERCENTAGE_FEES
  //         )

  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysSwapFees: {
  //         const swapFees = decodeArc4<SwapFees>(Bytes(value))
  //         assert(swapFees.impactTaxMin >= MIN_SWAP_IMPACT_TAX_MIN, ERR_INVALID_SWAP_IMPACT_TAX_MIN)
  //         assert(
  //           swapFees.impactTaxMax > swapFees.impactTaxMin
  //           && swapFees.impactTaxMax >= MIN_SWAP_IMPACT_TAX_MAX
  //           && swapFees.impactTaxMax <= DIVISOR,
  //           ERR_INVALID_SWAP_IMPACT_TAX_MAX
  //         )
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysKrbyPercentage: {
  //         const krbyPercentage = btoi(Bytes(value))
  //         assert(krbyPercentage >= ONE_PERCENT && krbyPercentage < (DIVISOR - this.moderatorPercentage.value), ERR_INVALID_KRBY_PERCENTAGE)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysModeratorPercentage: {
  //         const modPercentage = btoi(Bytes(value))
  //         assert(modPercentage >= ONE_PERCENT && modPercentage < (DIVISOR - this.krbyPercentage.value), ERR_INVALID_MOD_PERCENTAGE)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysProposalFee: {
  //         const proposalFee = btoi(Bytes(value))
  //         assert(proposalFee >= FIVE_ALGO, ERR_INVALID_PROPOSAL_FEE)
  //         break
  //       }
  //       case AkitaDAOGlobalStateKeysRevocationAddress: {
  //         assert(Bytes(value).length === ACCOUNT_LENGTH, ERR_INVALID_CONTENT_POLICY)
  //         const revocationAddress = Account(Bytes(value))
  //         assert(revocationAddress !== this.revocationAddress.value && revocationAddress !== Global.zeroAddress, ERR_INVALID_REVOCATION_ADDRESS)
  //         break
  //       }
  //       default: {
  //         assert(false, ERR_INVALID_FIELD)
  //       }
  //     }
  //   }
  // }

  // TODO:
  // private validateExecutePluginProposal(params: ProposalExecutePlugin): void { }

  // TODO:
  // private validateExecuteNamedPluginProposal(params: ProposalExecuteNamedPlugin): void { }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(escrowFactoryApp: uint64): void {
    this.version.value = ''
    this.escrowFactory.value = Application(escrowFactoryApp)
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { status, action, data } = this.proposals(proposalID).value
    assert(status === ProposalStatusApproved, ERR_PROPOSAL_NOT_APPROVED)
    assert(action === ProposalActionUpgradeApp, ERR_PROPOSAL_NOT_UPGRADE_APP)

    const { app, executionKey } = decodeArc4<ProposalUpgradeApp>(data)
    assert(app === Global.currentApplicationId.id, ERR_PROPOSAL_NOT_UPGRADE_APP)
    assert(Global.groupId === executionKey, ERR_EXECUTION_KEY_MISMATCH)
  }

  init(
    version: string,
    akta: uint64,
    contentPolicy: CID,
    minRewardsImpact: uint64,
    apps: AkitaDAOApps,
    fees: AkitaDAOFees,
    proposalSettings: {
      creation: ProposalSettings,
      participation: ProposalSettings,
      approval: ProposalSettings,
      duration: ProposalSettings,
    },
    revocationAddress: Address,
    krbyPayoutAddress: Address,
    moderatorGateID: uint64,
    govStakeKey: RootKey,
    govGateID: uint64,
  ): void {
    assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
    assert(version !== '', ERR_VERSION_CANNOT_BE_EMPTY)

    this.version.value = version
    this.contentPolicy.value = contentPolicy
    this.minRewardsImpact.value = minRewardsImpact

    // this.akitaAppList.value = {
    //   staking: apps.staking,
    //   rewards: apps.rewards,
    //   pool: apps.pool,
    //   prizeBox: apps.prizeBox,
    //   subscriptions: apps.subscriptions,
    //   gate: apps.gate,
    //   auction: apps.auction,
    //   hyperSwap: apps.hyperSwap,
    //   raffle: apps.raffle,
    //   metaMerkles: apps.metaMerkles,
    //   marketplace: apps.marketplace,
    //   akitaNfd: apps.akitaNfd,
    //   social: apps.social,
    //   impact: apps.impact
    // }

    // this.pluginAppList.value = {
    //   optin: apps.optin,
    // }

    // this.otherAppList.value = {
    //   vrfBeacon: apps.vrfBeacon,
    //   nfdRegistry: apps.nfdRegistry,
    //   assetInbox: apps.assetInbox,
    //   escrowFactory: apps.escrowFactory,
    // }

    // this.socialFees.value = {
    //   postFee: fees.postFee,
    //   reactFee: fees.reactFee,
    //   impactTaxMin: fees.impactTaxMin,
    //   impactTaxMax: fees.impactTaxMax,
    // }

    // this.stakingFees.value = {
    //   creationFee: fees.poolCreationFee,
    //   impactTaxMin: fees.poolImpactTaxMin,
    //   impactTaxMax: fees.poolImpactTaxMax
    // }

    // this.subscriptionFees.value = {
    //   serviceCreationFee: fees.subscriptionServiceCreationFee,
    //   paymentPercentage: fees.subscriptionPaymentPercentage,
    //   triggerPercentage: fees.subscriptionTriggerPercentage,
    // }

    // this.nftFees.value = {
    //   marketplaceSalePercentageMin: fees.marketplaceSalePercentageMin,
    //   marketplaceSalePercentageMax: fees.marketplaceSalePercentageMax,
    //   marketplaceComposablePercentage: fees.marketplaceComposablePercentage,
    //   marketplaceRoyaltyDefaultPercentage: fees.marketplaceRoyaltyDefaultPercentage,
    //   shuffleSalePercentage: fees.shuffleSalePercentage,
    //   omnigemSaleFee: fees.omnigemSaleFee,
    //   auctionCreationFee: fees.auctionCreationFee,
    //   auctionSaleImpactTaxMin: fees.auctionSaleImpactTaxMin,
    //   auctionSaleImpactTaxMax: fees.auctionSaleImpactTaxMax,
    //   auctionComposablePercentage: fees.auctionComposablePercentage,
    //   auctionRafflePercentage: fees.auctionRafflePercentage,
    //   raffleCreationFee: fees.raffleCreationFee,
    //   raffleSaleImpactTaxMin: fees.raffleSaleImpactTaxMin,
    //   raffleSaleImpactTaxMax: fees.raffleSaleImpactTaxMax,
    //   raffleComposablePercentage: fees.raffleComposablePercentage,
    // }

    // this.swapFees.value = {
    //   impactTaxMin: fees.swapFeeImpactTaxMin,
    //   impactTaxMax: fees.swapFeeImpactTaxMax,
    // }

    // this.krbyPercentage.value = fees.krbyPercentage
    // this.moderatorPercentage.value = fees.moderatorPercentage

    // this.proposalCreationSettings.value = clone(proposalSettings.creation)
    // this.proposalParticipationSettings.value = clone(proposalSettings.participation)
    // this.proposalApprovalThresholdSettings.value = clone(proposalSettings.approval)
    // this.proposalVotingDurationSettings.value = clone(proposalSettings.duration)

    this.revocationAddress.value = revocationAddress.native

    const bonesCreateTxn = itxn
      .assetConfig({
        assetName: Bytes('Bones'),
        unitName: Bytes('BONES'),
        total: 1_000_000_000_000_000, // 1 billion
        decimals: 6,
        manager: Global.currentApplicationAddress,
        reserve: Global.currentApplicationAddress,
        freeze: Global.zeroAddress,
        clawback: Global.zeroAddress,
        defaultFrozen: false,
        url: Bytes('https://akita.community'),
      })
      .submit()

    const bones = bonesCreateTxn.createdAsset.id
    this.akitaAssets.value = { akta, bones }

    // receive escrows
    // this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountSocial,
    //   Application(apps.social).address,
    //   true,
    //   true
    // )

    // const stakingEscrow = this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountStakingPools,
    //   Application(apps.pool).address,
    //   true,
    //   true
    // )

    // abiCall(
    //   PoolFactoryInterface.prototype.setEscrow,
    //   {
    //     appId: apps.pool,
    //     args: [ stakingEscrow ]
    //   }
    // )

    // this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountSubscriptions,
    //   Application(apps.subscriptions).address,
    //   true,
    //   true
    // )

    // this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountMarketplace,
    //   Application(apps.marketplace).address,
    //   true,
    //   true
    // )

    // this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountAuctions,
    //   Application(apps.auction).address,
    //   true,
    //   true
    // )

    // this.newReceiveEscrow(
    //   AkitaDAOEscrowAccountRaffles,
    //   Application(apps.raffle).address,
    //   true,
    //   true
    // )

    // // payout escrows
    // this.newIndividualPayoutEscrow(
    //   AkitaDAOEscrowAccountKrby,
    //   krbyPayoutAddress
    // )

    // const childContractMBR: uint64 = (
    //   this.stakingFees.value.creationFee +
    //   MAX_PROGRAM_PAGES +
    //   (GLOBAL_STATE_KEY_UINT_COST * PoolGlobalStateUintCount) +
    //   (GLOBAL_STATE_KEY_BYTES_COST * PoolGlobalStateBytesCount) +
    //   Global.minBalance +
    //   AppCreatorsMbr
    // )

    // const modStakingPoolID = abiCall(
    //   PoolFactoryInterface.prototype.newPool,
    //   {
    //     appId: apps.pool,
    //     args: [
    //       itxn.payment({
    //         receiver: Application(apps.pool).address,
    //         amount: childContractMBR
    //       }),
    //       'Akita DAO Moderator Staking Pool',
    //       POOL_STAKING_TYPE_NONE,
    //       new Address(Application(stakingEscrow).address),
    //       { address: new Address(Global.zeroAddress), name: '' },
    //       0,
    //       moderatorGateID,
    //       0,
    //     ]
    //   }
    // ).returnValue

    // this.newGroupPayoutEscrow(
    //   AkitaDAOEscrowAccountModerators,
    //   modStakingPoolID
    // )

    // const govStakingPoolID = abiCall(
    //   PoolFactoryInterface.prototype.newPool,
    //   {
    //     appId: apps.pool,
    //     args: [
    //       itxn.payment({
    //         receiver: Application(apps.pool).address,
    //         amount: childContractMBR
    //       }),
    //       'Akita DAO Governance Staking Pool',
    //       POOL_STAKING_TYPE_LOCK,
    //       new Address(Application(stakingEscrow).address),
    //       govStakeKey,
    //       0,
    //       govGateID,
    //       0,
    //     ]
    //   }
    // ).returnValue

    // this.newGroupPayoutEscrow(
    //   AkitaDAOEscrowAccountGovernors,
    //   govStakingPoolID
    // )
  }

  // AKITA ARC58 METHODS --------------------------------------------------------------------------

  /**
   * Verify the abstracted account is rekeyed to this app
   */
  arc58_verifyAuthAddr(): void {
    assert(this.spendingAddress.value.authAddress === this.getAuthAddr());
    this.spendingAddress.value = Global.zeroAddress
  }

  /**
   * check whether the plugin can be used
   *
   * @param plugin the plugin to be rekeyed to
   * @param address the address that triggered the plugin
   * @returns whether the plugin can be called via txn sender or globally
   */
  @abimethod({ readonly: true })
  arc58_canCall(
    plugin: uint64,
    global: boolean,
    address: Address,
    method: bytes<4>
  ): boolean {
    if (global) {
      this.pluginCallAllowed(plugin, Global.zeroAddress, method);
    }
    return this.pluginCallAllowed(plugin, address.native, method);
  }

  /**
   * Temporarily rekey to an approved plugin app address
   *
   * @param plugin The app to rekey to
   * @param global Whether the plugin is callable globally
   * @param methodOffsets The indices of the methods being used in the group if the plugin has method restrictions these indices are required to match the methods used on each subsequent call to the plugin within the group
   * @param fundsRequest If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to be able to use during execution
   * 
  */
  arc58_rekeyToPlugin(
    plugin: uint64,
    global: boolean,
    methodOffsets: uint64[],
    fundsRequest: FundsRequest[]
  ): void {
    const pluginApp = Application(plugin)
    const caller = global ? Global.zeroAddress : Txn.sender
    const key = { application: plugin, allowedCaller: caller }

    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    this.assertValidGroup(key, methodOffsets);

    if (this.plugins(key).value.escrow !== 0) {
      const spendingApp = Application(this.plugins(key).value.escrow)
      this.spendingAddress.value = spendingApp.address;
      this.transferFunds(key, fundsRequest);
    } else {
      this.spendingAddress.value = this.controlledAddress.value;
    }

    itxn
      .payment({
        sender: this.spendingAddress.value,
        receiver: this.spendingAddress.value,
        rekeyTo: pluginApp.address,
        note: 'rekeying to plugin app'
      })
      .submit();
  }

  /**
   * Temporarily rekey to a named plugin app address
   *
   * @param name The name of the plugin to rekey to
   * @param global Whether this is global or local plugin usage
   * @param methodOffsets The indices of the methods being used in the group
   * if the plugin has method restrictions these indices are required to match
   * the methods used on each subsequent call to the plugin within the group
   * 
   */
  arc58_rekeyToNamedPlugin(name: string, global: boolean, methodOffsets: uint64[], fundsRequest: FundsRequest[]): void {
    this.arc58_rekeyToPlugin(
      this.namedPlugins(name).value.application,
      global,
      methodOffsets,
      fundsRequest
    );
  }

  // AKITA DAO METHODS ----------------------------------------------------------------------------

  newProposal(
    payment: gtxn.PaymentTxn,
    action: ProposalAction,
    cid: CID,
    data: bytes,
    status: ProposalStatus,
  ): void {
    assert(
      status === ProposalStatusDraft ||
      status === ProposalStatusVoting,
      ERR_INVALID_PROPOSAL_STATUS
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.proposalFee.value
      }
    )

    const origin = getOrigin(this.escrowFactory.value.id, Txn.sender)

    const power = getStakingPower(
      this.akitaAppList.value.staking,
      new Address(origin),
      this.akitaAssets.value.bones
    )

    let powerPrerequisite: uint64 = 0
    switch (action) {
      case ProposalActionUpgradeApp: {
        powerPrerequisite = this.proposalCreationSettings.value.upgradeApp
        break;
      }
      case ProposalActionAddPlugin:
      case ProposalActionAddNamedPlugin: {
        powerPrerequisite = this.proposalCreationSettings.value.addPlugin
        break;
      }
      case ProposalActionExecutePlugin:
      case ProposalActionExecuteNamedPlugin: {
        const params = decodeArc4<ProposalExecutePlugin>(data)
        const pluginKey: PluginKey = { application: params.app, allowedCaller: params.allowedCaller.native }
        powerPrerequisite = this.plugins(pluginKey).value.executionProposalCreationMinimum
        break;
      }
      case ProposalActionRemovePlugin:
      case ProposalActionRemoveNamedPlugin: {
        powerPrerequisite = this.proposalCreationSettings.value.removePlugin
        break;
      }
      case ProposalActionAddAllowance: {
        powerPrerequisite = this.proposalCreationSettings.value.addAllowance
        break;
      }
      case ProposalActionRemoveAllowance: {
        powerPrerequisite = this.proposalCreationSettings.value.removeAllowance
        break;
      }
      case ProposalActionUpdateFields: {
        powerPrerequisite = this.proposalCreationSettings.value.updateField
        break;
      }
    }

    assert(power >= powerPrerequisite, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD)

    // validate the origin account has atleast x bones lock staked


    const id = this.newProposalID()

    this.proposals(id).value = {
      action,
      status,
      cid,
      creator: new Address(origin),
      created: Global.latestTimestamp,
      votes: 0,
      data,
    }
  }

  submitProposal(proposalID: uint64): void { }

  finalizeProposal(proposalID: uint64, args: bytes): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { status, creator, action } = this.proposals(proposalID).value

    assert(Txn.sender === creator.native, ERR_INCORRECT_SENDER)
    assert(status === ProposalStatusVoting, ERR_INVALID_PROPOSAL_STATE)

    // TODO: assert the proposal has passed

    switch (action) {
      case ProposalActionUpgradeApp: {
        const params = decodeArc4<ProposalUpgradeApp>(args)
        // this.validateUpgradeAppProposal(params)
        break;
      }
      case ProposalActionAddPlugin: {
        const params = decodeArc4<ProposalAddPlugin>(args)
        // this.validateAddPluginProposal(params)
        break;
      }
      case ProposalActionAddNamedPlugin: {
        const params = decodeArc4<ProposalAddNamedPlugin>(args)
        // this.validateAddNamedPluginProposal(params)
        break;
      }
      case ProposalActionExecutePlugin: {
        break;
      }
      case ProposalActionExecuteNamedPlugin: {
        const params = decodeArc4<ProposalExecutePlugin>(args)
        // this.validateExecutePluginProposal(params)
        break;
      }
      case ProposalActionRemovePlugin: {
        const params = decodeArc4<ProposalRemovePlugin>(args)
        // this.validateRemovePluginProposal(params)
        break;
      }
      case ProposalActionRemoveNamedPlugin: {
        const params = decodeArc4<ProposalRemoveNamedPlugin>(args)
        // this.validateRemoveNamedPluginProposal(params)
        break;
      }
      case ProposalActionAddAllowance: {
        const params = decodeArc4<ProposalAddAllowance>(args)
        // this.validateAddAllowanceProposal(params)
        break;
      }
      case ProposalActionRemoveAllowance: {
        const params = decodeArc4<ProposalRemoveAllowance>(args)
        // this.validateRemoveAllowanceProposal(params)
        break;
      }
      case ProposalActionUpdateFields: {
        const params = decodeArc4<ProposalUpdateField[]>(args)
        // this.validateUpdateFieldsProposal(params)
        break;
      }
    }


  }

  createDailyDisbursement(): void {
    // calc the amount to distribute
    // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
    const [bonesAmount] = AssetHolding.assetBalance(Global.currentApplicationAddress, this.akitaAssets.value.bones)

    // const krbyFee = (amount * this.krbyPercentage.value) - 1 / 10_000 + 1;
    // const modFee = (amount * this.moderatorPercentage.value) - 1 / 10_000 + 1;

    // distribute to krby

    // distribute to moderators

    // distribute to stakers
  }

  arc58_pluginOptinEscrow(
    plugin: uint64,
    caller: Address,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void {
    const key: PluginKey = { application: plugin, allowedCaller: caller.native };

    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    const { escrow } = this.plugins(key).value
    assert(escrow !== 0, ERR_NOT_USING_ESCROW);
    assert(
      Txn.sender === Application(plugin).address ||
      Txn.sender === caller.native ||
      caller.native === Global.zeroAddress,
      ERR_FORBIDDEN
    );

    const escrowAddress = Application(escrow).address

    assertMatch(
      mbrPayment,
      {
        receiver: this.controlledAddress.value,
        amount: Global.assetOptInMinBalance * assets.length
      },
      ERR_INVALID_PAYMENT
    )

    itxn
      .payment({
        sender: this.controlledAddress.value,
        receiver: escrowAddress,
        amount: Global.assetOptInMinBalance * assets.length
      })
      .submit();

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      assert(
        this.allowances({ escrow, asset: assets[i] }).exists,
        ERR_ALLOWANCE_DOES_NOT_EXIST
      );

      itxn
        .assetTransfer({
          sender: escrowAddress,
          assetReceiver: escrowAddress,
          assetAmount: 0,
          xferAsset: assets[i]
        })
        .submit();
    }
  }

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optinReceiveEscrow(payment: gtxn.PaymentTxn, name: string, asset: uint64): void {
    assert(this.escrows(name).exists, ERR_ESCROW_DOES_NOT_EXIST)
    const escrowID = this.escrows(name).value
    const escrowAccount = Application(escrowID).address
    assert(!escrowAccount.isOptedIn(Asset(asset)), ERR_ESCROW_IS_ALREADY_OPTED_IN)
    assert(this.receiveEscrows(escrowID).exists, ERR_RECEIVE_ESCROW_DOES_NOT_EXIST)

    const { source, optinAllowed } = this.receiveEscrows(escrowID).value
    assert(source.native === Txn.sender, ERR_INCORRECT_SENDER)
    assert(optinAllowed === true, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN)

    const rewardsMBR: uint64 = (MinPoolRewardsMBR + (BoxCostPerByte * WinnerCountCap))

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (Global.assetOptInMinBalance * 4) + (rewardsMBR * 2),
      },
      ERR_INVALID_PAYMENT
    )

    itxnCompose.begin(
      itxn.payment({
        receiver: escrowAccount,
        amount: Global.assetOptInMinBalance
      })
    )

    itxnCompose.next(
      itxn.assetTransfer({
        sender: escrowAccount,
        assetReceiver: escrowAccount,
        assetAmount: 0,
        xferAsset: asset
      })
    )

    this.receiveEscrows(escrowID).value = {
      ...this.receiveEscrows(escrowID).value,
      optinCount: this.receiveEscrows(escrowID).value.optinCount + 1,
    }

    const krbyEscrowID = this.escrows(AkitaDAOEscrowAccountKrby).value
    const krbyAccount = Application(krbyEscrowID).address

    const krbyFundNeedsToOptIn = !krbyAccount.isOptedIn(Asset(asset))
    if (krbyFundNeedsToOptIn) {
      itxnCompose.next(
        itxn.payment({
          receiver: krbyAccount,
          amount: Global.assetOptInMinBalance
        })
      )

      itxnCompose.next(
        itxn.assetTransfer({
          sender: krbyAccount,
          assetReceiver: krbyAccount,
          assetAmount: 0,
          xferAsset: asset
        })
      )
    }

    const modEscrowID = this.escrows(AkitaDAOEscrowAccountModerators).value
    const modAccount = Application(modEscrowID).address

    const modFundNeedsToOptIn = !modAccount.isOptedIn(Asset(asset))
    if (modFundNeedsToOptIn) {
      itxnCompose.next(
        itxn.payment({
          receiver: modAccount,
          amount: Global.assetOptInMinBalance + rewardsMBR
        })
      )

      itxnCompose.next(
        itxn.assetTransfer({
          sender: modAccount,
          assetReceiver: modAccount,
          assetAmount: 0,
          xferAsset: asset
        })
      )
    }

    const govEscrowID = this.escrows(AkitaDAOEscrowAccountGovernors).value
    const govAccount = Application(govEscrowID).address

    const govFundNeedsToOptIn = !govAccount.isOptedIn(Asset(asset))
    if (govFundNeedsToOptIn) {
      itxnCompose.next(
        itxn.payment({
          receiver: govAccount,
          amount: Global.assetOptInMinBalance + rewardsMBR
        })
      )

      itxnCompose.next(
        itxn.assetTransfer({
          sender: govAccount,
          assetReceiver: govAccount,
          assetAmount: 0,
          xferAsset: asset
        })
      )
    }

    itxnCompose.submit()
  }

  startEscrowDisbursement(escrow: string): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    assert(this.receiveEscrows(this.escrows(escrow).value).exists, ERR_ESCROW_DOES_NOT_EXIST)
    // validate the time window of the last escrow payout
    const eid = this.escrows(escrow).value
    const { phase, allocatable, lastDisbursement, creationDate } = this.receiveEscrows(eid).value
    assert(phase === EscrowDisbursementPhaseIdle, ERR_ESCROW_NOT_IDLE)
    assert(allocatable, ERR_ESCROW_NOT_ALLOCATABLE)

    const latestWindow: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - creationDate) % ONE_DAY)
    assert(latestWindow >= lastDisbursement, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT)

    this.receiveEscrows(eid).value.phase = EscrowDisbursementPhaseAllocation
    this.receiveEscrows(eid).value.lastDisbursement = latestWindow
  }

  processEscrowAllocation(escrow: string, ids: uint64[]): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    const eid = this.escrows(escrow).value
    const { phase, source, optinCount } = this.receiveEscrows(eid).value
    assert(phase === EscrowDisbursementPhaseAllocation, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE)

    const sender = source.native

    const krbyEscrowID = this.escrows(AkitaDAOEscrowAccountKrby).value
    const krbyAccount = Application(krbyEscrowID).address

    const modEscrowID = this.escrows(AkitaDAOEscrowAccountModerators).value
    const modAccount = Application(modEscrowID).address

    const govEscrowID = this.escrows(AkitaDAOEscrowAccountGovernors).value
    const govAccount = Application(govEscrowID).address

    for (let i: uint64 = 0; i < ids.length; i += 1) {
      const asset = ids[i]
      assert(!this.receiveAssets({ escrow: eid, asset }).exists, ERR_ASSET_ALREADY_ALLOCATED)
      assert(sender.isOptedIn(Asset(asset)), ERR_ESCROW_NOT_OPTED_IN)

      const [balance] = AssetHolding.assetBalance(sender, asset)

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

      this.receiveAssets({ escrow: eid, asset }).create()
    }

    const allocationCounter: uint64 = this.receiveEscrows(eid).value.allocationCounter + ids.length
    this.receiveEscrows(eid).value.allocationCounter = allocationCounter
    if (allocationCounter === (optinCount + 1)) {
      this.receiveEscrows(eid).value.phase = EscrowDisbursementPhaseFinalization
    }
  }

  opUp(): void { }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  // @abimethod({ readonly: true })
  // mbr(
  //   methodCount: uint64,
  //   pluginName: string,
  //   escrowName: string,
  //   payoutEscrowType: Uint8,
  //   proposalData: bytes
  // ): AkitaDAOMBRData {
  //   return {
  //     plugins: this.pluginsMbr(methodCount),
  //     namedPlugins: this.namedPluginsMbr(pluginName),
  //     escrows: this.escrowsMbr(escrowName),
  //     receiveEscrows: this.receiveEscrowsMbr(),
  //     receiveAssets: this.receiveAssetsMbr(),
  //     payoutEscrows: this.payoutEscrowsMbr(payoutEscrowType),
  //     allowances: this.allowancesMbr(),
  //     proposals: this.proposalsMbr(proposalData),
  //     proposalVotes: this.proposalVotesMbr(),
  //     executions: this.executionsMbr(),
  //   }
  // }
}