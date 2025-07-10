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
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, GTxn, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Bool, decodeArc4, DynamicArray, methodSelector, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AkitaAppList,
  AkitaAssets,
  AkitaDAOState,
  arc4DAOPluginInfo,
  DAOPluginInfo,
  EscrowAssetKey,
  ExecutionInfo,
  ExecutionKey,
  Fees,
  NFTFees,
  OtherAppList,
  PluginAppList,
  ProposalAction,
  ProposalAddAllowance,
  ProposalAddNamedPlugin,
  ProposalAddPlugin,
  ProposalDetails,
  ProposalExecuteNamedPlugin,
  ProposalExecutePlugin,
  ProposalRemoveAllowance,
  ProposalRemoveNamedPlugin,
  ProposalRemovePlugin,
  ProposalSettings,
  ProposalStatus,
  ProposalUpdateField,
  ProposalUpgradeApp,
  ReceiveEscrowInfo,
  SocialFees,
  StakingFees,
  SubscriptionFees,
  SwapFees,
} from './types'

import { ERR_ALREADY_INITIALIZED, ERR_ASSET_ALREADY_ALLOCATED, ERR_BAD_DAO_DELEGATION_TYPE, ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_NOT_ALLOCATABLE, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_ESCROW_NOT_IDLE, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE, ERR_ESCROW_NOT_OPTED_IN, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INSUFFICIENT_PROPOSAL_THRESHOLD, ERR_INVALID_AUCTION_RAFFLE_PERCENTAGE, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MAX, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MIN, ERR_INVALID_CONTENT_POLICY, ERR_INVALID_FIELD, ERR_INVALID_IMPACT_TAX_MAX, ERR_INVALID_IMPACT_TAX_MIN, ERR_INVALID_KRBY_PERCENTAGE, ERR_INVALID_MARKETPLACE_COMPOSABLE_PERCENTAGE, ERR_INVALID_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, ERR_INVALID_METHOD_SIGNATURE_LENGTH, ERR_INVALID_MINIMUM_REWARDS_IMPACT, ERR_INVALID_MOD_PERCENTAGE, ERR_INVALID_PAYMENT_PERCENTAGE, ERR_INVALID_POOL_CREATION_FEE, ERR_INVALID_POOL_IMPACT_TAX_MAX, ERR_INVALID_POOL_IMPACT_TAX_MIN, ERR_INVALID_POST_FEE, ERR_INVALID_PROPOSAL_FEE, ERR_INVALID_PROPOSAL_STATUS, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MAX, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MIN, ERR_INVALID_REACT_FEE, ERR_INVALID_REVOCATION_ADDRESS, ERR_INVALID_SERVICE_CREATION_FEE, ERR_INVALID_SHUFFLE_SALE_PERCENTAGE, ERR_INVALID_SWAP_IMPACT_TAX_MAX, ERR_INVALID_SWAP_IMPACT_TAX_MIN, ERR_INVALID_TOTAL_PERCENTAGE_FEES, ERR_INVALID_TRIGGER_PERCENTAGE, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_VERSION_CANNOT_BE_EMPTY, ERR_WRONG_METHOD_FOR_EXECUTION_KEY_LOCKED_PLUGIN } from './errors'
import {
  AkitaDAOBoxPrefixExecutions,
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
  AkitaDAOGlobalStateKeysProposalSettings,
  AkitaDAOGlobalStateKeysRevocationAddress,
  AkitaDAOGlobalStateKeysSocialFees,
  AkitaDAOGlobalStateKeysStakingFees,
  AkitaDAOGlobalStateKeysStatus,
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
  DAOStatusInit,
  ProposalStatusApproved,
  ProposalStatusDraft,
  ProposalStatusVoting,
  AkitaDAOGlobalStateKeysMinRewardsImpact,
  EscrowDisbursementPhaseIdle,
  EscrowDisbursementPhaseAllocation,
  AkitDAOBoxPrefixEscrowAssets,
  AkitaDAOEscrowAccountModerators,
  AkitaDAOEscrowAccountKrby,
  EscrowDisbursementPhaseFinalization,
  AkitaDAOGlobalStateKeysProposalCreationSettings,
  AkitaDAOGlobalStateKeysProposalParticipationSettings,
  AkitaDAOGlobalStateKeysProposalApprovalThresholdSettings,
  AkitaDAOGlobalStateKeysProposalVotingDurationSettings,
  AkitaDAOBoxPrefixReceiveEscrows,
} from './constants'
import { GlobalStateKeyVersion } from '../constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { ACCOUNT_LENGTH, CID_LENGTH, DIVISOR, fee, FIVE_ALGO, MAX_POST_FEE, MAX_REACT_FEE, MIN_AUCTION_SALE_IMPACT_TAX_MAX, MIN_AUCTION_SALE_IMPACT_TAX_MIN, MIN_IMPACT_TAX_MAX, MIN_IMPACT_TAX_MIN, MIN_MARKETPLACE_COMPOSABLE_PERCENTAGE, MIN_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, MIN_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, MIN_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, MIN_PAYMENT_PERCENTAGE, MIN_POOL_IMPACT_TAX_MAX, MIN_POOL_IMPACT_TAX_MIN, MIN_POST_FEE, MIN_RAFFLE_SALE_IMPACT_TAX_MAX, MIN_RAFFLE_SALE_IMPACT_TAX_MIN, MIN_REACT_FEE, MIN_SWAP_IMPACT_TAX_MAX, MIN_SWAP_IMPACT_TAX_MIN, MIN_TRIGGER_PERCENTAGE, ONE_PERCENT } from '../utils/constants'
import { AbstractAccountBoxPrefixAllowances, AbstractAccountBoxPrefixNamedPlugins, AbstractAccountBoxPrefixPlugins, AbstractAccountGlobalStateKeysControlledAddress, AbstractAccountGlobalStateKeysEscrowFactory, AbstractAccountGlobalStateKeysLastChange, AbstractAccountGlobalStateKeysSpendingAddress } from '../arc58/account/constants'
import { AddAllowanceInfo, AllowanceInfo, AllowanceKey, arc4MethodInfo, DelegationTypeSelf, FullPluginValidation, FundsRequest, MethodRestriction, MethodValidation, PluginInfo, PluginKey, PluginValidation, SpendAllowanceTypeDrip, SpendAllowanceTypeFlat, SpendAllowanceTypeWindow } from '../arc58/account/types'
import { ERR_ALLOWANCE_ALREADY_EXISTS, ERR_ALLOWANCE_DOES_NOT_EXIST, ERR_ALLOWANCE_EXCEEDED, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_INVALID_ONCOMPLETE, ERR_INVALID_PLUGIN_CALL, ERR_INVALID_SENDER_ARG, ERR_INVALID_SENDER_VALUE, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_MISSING_REKEY_BACK, ERR_NOT_USING_ESCROW } from '../arc58/account/errors'
import { CID } from '../utils/types/base'
import { calcPercent, getOrigin, getStakingPower } from '../utils/functions'
import { ONE_DAY } from '../gates/plugins/staking-power/constants'
import { EscrowFactory } from '../escrow/factory.algo'
import { ERR_FORBIDDEN } from '../escrow/errors'
import { AkitaDAOInterface } from '../utils/types/dao'


/**
 * The Akita DAO contract has several responsibilities:
 * [ ] Manages the disbursement of the bones token
 * [ ] Manages the disbursement of earned income
 * [x] Manages the content policy of the protocol
 * [x] Manages the minimum impact score to qualify for daily disbursement
 * [x] Manages service fees
 */

export class AkitaDAO extends Contract implements AkitaDAOInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** state of the DAO */
  status = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysStatus })
  /** the version number of the DAO */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
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
  proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalID })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<PluginKey, arc4DAOPluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, PluginKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins })
  /** the escrows that this wallet has created for specific callers with allowances */
  escrows = BoxMap<string, uint64>({ keyPrefix: AkitDAOBoxPrefixEscrows })
  /** The Allowances for plugins installed on the smart contract with useAllowance set to true */
  allowances = BoxMap<AllowanceKey, AllowanceInfo>({ keyPrefix: AbstractAccountBoxPrefixAllowances }) // 38_500
  /** voting state of a proposal */
  proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** Group hashes that the DAO has approved to be submitted */
  executions = BoxMap<ExecutionKey, ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })
  /** escrow accounts for services to payback revenue to the DAO */
  receiveEscrows = BoxMap<uint64, ReceiveEscrowInfo>({ keyPrefix: AkitaDAOBoxPrefixReceiveEscrows })
  /** box map of escrow assets that have already been processed during this allocation */
  receiveAssets = BoxMap<EscrowAssetKey, bytes<0>>({ keyPrefix: AkitDAOBoxPrefixEscrowAssets })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private updateLastChange() {
    this.lastChange.value = Global.latestTimestamp
  }

  private pluginMbr(methodCount: uint64): uint64 {
    return 36_100 + (400 * (20 * methodCount) + 4);
  }

  private namedPluginMbr(name: string): uint64 {
    return 19_700 + (400 * Bytes(name).length + 4);
  }

  private escrowsMbr(name: string): uint64 {
    return 6_900 + (400 * Bytes(name).length + 2);
  }

  private receiveEscrowsMbr(): uint64 {
    return 36_100
  }

  private receiveAssetsMbr(): uint64 {
    return 9_300
  }

  private allowanceMbr(): uint64 {
    return 29_300;
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
    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.escrowsMbr(escrow),
          fee,
        })
        .submit()
    }

    const escrowID = abiCall(
      EscrowFactory.prototype.new,
      {
        sender: this.controlledAddress.value,
        appId: this.escrowFactory.value,
        args: [
          itxn.payment({
            sender: this.controlledAddress.value,
            amount: 112_100 + Global.minBalance,
            receiver: this.escrowFactory.value.address,
            fee,
          }),
        ],
        fee,
      }
    ).returnValue

    this.escrows(escrow).value = escrowID

    return escrowID;
  }

  private newReceiveEscrow(
    escrow: string,
    caller: Address,
    allocatable: boolean,
    optinAllowed: boolean
  ): uint64 {
    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.escrowsMbr(escrow) + this.receiveEscrowsMbr(),
          fee,
        })
        .submit()
    }

    const escrowID = abiCall(
      EscrowFactory.prototype.new,
      {
        sender: this.controlledAddress.value,
        appId: this.escrowFactory.value,
        args: [
          itxn.payment({
            sender: this.controlledAddress.value,
            amount: 112_100 + Global.minBalance,
            receiver: this.escrowFactory.value.address,
            fee,
          }),
        ],
        fee,
      }
    ).returnValue

    this.escrows(escrow).value = escrowID
    this.receiveEscrows(escrowID).value = {
      escrow: escrowID,
      caller,
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

  // private mbr(methodsCount: uint64, nameLength: uint64, dataLength: uint64, escrowLength: uint64): AkitaDAOMBRData {
  //   return {
  //     plugins: 46_100 + (400 * (13 * methodsCount)),
  //     namedPlugins: 18_900 + (400 * (nameLength + 2)),
  //     allowances: 38_500,
  //     proposals: 40_500 + (400 * (dataLength + 2)),
  //     executions: 19_300,
  //     escrows: 32_900 + (400 * (escrowLength + 2)),
  //     escrowAssets: 6_100 + (400 * (escrowLength + 2)),
  //   }
  // }

  private pluginCallAllowed(application: uint64, allowedCaller: Account, method: bytes<4>): boolean {
    const key: PluginKey = { application, allowedCaller }

    if (!this.plugins(key).exists) {
      return false;
    }

    if (!this.plugins(key).value.useExecutionKey.native) {
      return false;
    }

    const methods = this.plugins(key).value.methods.copy()
    let methodAllowed = methods.length > 0 ? false : true;
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      if (methods[i].selector.native === method) {
        methodAllowed = true;
        break;
      }
    }

    const p = decodeArc4<PluginInfo>(this.plugins(key).value.bytes)
    const epochRef = p.useRounds ? Global.round : Global.latestTimestamp;

    return (
      p.lastCalled >= epochRef &&
      (epochRef - p.lastCalled) >= p.cooldown &&
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

    const pluginInfo = decodeArc4<DAOPluginInfo>(this.plugins(key).value.bytes)

    if (pluginInfo.useExecutionKey) {
      assert(this.executions(Global.groupId).exists)
    }

    const epochRef = pluginInfo.useRounds ? Global.round : Global.latestTimestamp;

    const expired = epochRef > pluginInfo.lastValid;
    const hasCooldown = pluginInfo.cooldown > 0;
    const onCooldown = (epochRef - pluginInfo.lastCalled) < pluginInfo.cooldown;
    const hasMethodRestrictions = pluginInfo.methods.length > 0;

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

    const epochRef = this.plugins(key).value.useRounds.native
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
        this.plugins(key).value.lastCalled = new UintN64(epochRef)
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

    const methods = this.plugins(key).value.methods.copy()
    const allowedMethod = methods[offset].copy()

    const hasCooldown = allowedMethod.cooldown.native > 0

    const useRounds = this.plugins(key).value.useRounds.native

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;
    const onCooldown = (epochRef - allowedMethod.lastCalled.native) < allowedMethod.cooldown.native;

    if (allowedMethod.selector.native === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        const lastCalled = useRounds
          ? Global.round
          : Global.latestTimestamp

        methods[offset].lastCalled = new UintN64(lastCalled);

        this.plugins(key).value = new arc4DAOPluginInfo({
          ...this.plugins(key).value,
          methods: methods.copy()
        });
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
      const pluginInfo = decodeArc4<PluginInfo>(this.plugins(key).value.bytes)

      const allowanceKey: AllowanceKey = {
        escrow: pluginInfo.escrow,
        asset: fundsRequests[i].asset
      }

      this.verifyAllowance(allowanceKey, fundsRequests[i]);

      if (fundsRequests[i].asset !== 0) {
        itxn
          .assetTransfer({
            sender: this.controlledAddress.value,
            assetReceiver: this.spendingAddress.value,
            assetAmount: fundsRequests[i].amount,
            xferAsset: fundsRequests[i].asset,
            fee,
          })
          .submit();
      } else {
        itxn
          .payment({
            sender: this.controlledAddress.value,
            receiver: this.spendingAddress.value,
            amount: fundsRequests[i].amount,
            fee,
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
    return (
      this.spendingAddress.value === this.controlledAddress.value
      && this.controlledAddress.value === Global.currentApplicationAddress
    ) ? Global.zeroAddress : Global.currentApplicationAddress
  }

  // TODO:
  private validateAddPluginProposal(params: ProposalAddPlugin): void {

    // validate delegation type is not self
    assert(params.delegationType !== DelegationTypeSelf, ERR_BAD_DAO_DELEGATION_TYPE)

    // validate plugin doesn't already exist
    const key: PluginKey = { application: params.app, allowedCaller: params.allowedCaller.native }
    assert(!this.plugins(key).exists, 'Plugin already exists')

    // validate execution settings are reasonable
    assert(params.executionProposalCreationMinimum >= 0, 'Invalid execution proposal creation minimum')
    assert(params.executionParticipationThreshold > 0 && params.executionParticipationThreshold <= DIVISOR, 'Invalid execution participation threshold')
    assert(params.executionApprovalThreshold > 0 && params.executionApprovalThreshold <= DIVISOR, 'Invalid execution approval threshold')
    assert(params.executionVotingDuration > 0, 'Invalid execution voting duration')

    // validate method restrictions if any
    for (let i: uint64 = 0; i < params.methods.length; i += 1) {
      const method = params.methods[i]
      // validate method selector is 4 bytes
      assert(method.selector.length === 4, ERR_INVALID_METHOD_SIGNATURE_LENGTH)
      // validate method cooldown is reasonable
      assert(method.cooldown <= 365 * ONE_DAY, 'Method cooldown too long')
    }

    // validate allowances if useAllowance is true
    if (params.allowances.length > 0) {
      for (let i: uint64 = 0; i < params.allowances.length; i += 1) {
        const allowance = params.allowances[i]

        // validate allowance type
        assert(
          allowance.type === SpendAllowanceTypeFlat ||
          allowance.type === SpendAllowanceTypeWindow ||
          allowance.type === SpendAllowanceTypeDrip,
          'Invalid allowance type'
        )

        // validate amounts are positive
        assert(allowance.allowed > 0, 'Allowance amount must be positive')

        if (allowance.type === SpendAllowanceTypeDrip) {
          assert(allowance.max > 0, 'Max allowance must be positive for drip type')
          assert(allowance.interval > 0, 'Interval must be positive for drip type')
        }

        if (allowance.type === SpendAllowanceTypeWindow) {
          assert(allowance.interval > 0, 'Interval must be positive for window type')
        }
      }
    }
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
    delegationType: UintN8,
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

    let methodInfos = new DynamicArray<arc4MethodInfo>()
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push(
        new arc4MethodInfo({
          selector: methods[i].selector,
          cooldown: new UintN64(methods[i].cooldown),
          lastCalled: new UintN64(),
        })
      )
    }

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.pluginMbr(methods.length),
          fee,
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    this.plugins(key).value = new arc4DAOPluginInfo({
      delegationType,
      escrow: new UintN64(escrowID),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
      useExecutionKey: new Bool(useExecutionKey),
      executionProposalCreationMinimum: new UintN64(executionProposalCreationMinimum),
      executionParticipationThreshold: new UintN64(executionParticipationThreshold),
      executionApprovalThreshold: new UintN64(executionApprovalThreshold),
      executionVotingDuration: new UintN64(executionVotingDuration),
    });

    this.updateLastChange();
  }

  private validateRemovePluginProposal(params: ProposalRemovePlugin): boolean {
    return false
  }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   * @param allowedCaller The address that's allowed to call the app
  */
  private removePlugin(app: uint64, allowedCaller: Address): void {
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };
    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const methods = this.plugins(key).value.methods.copy()

    this.plugins(key).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: this.pluginMbr(methods.length),
          fee,
        })
        .submit()
    }

    this.updateLastChange();
  }

  // TODO:
  private validateAddNamedPluginProposal(params: ProposalAddNamedPlugin): void {
  }

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
    delegationType: UintN8,
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
    this.namedPlugins(name).value = key

    let methodInfos = new DynamicArray<arc4MethodInfo>()
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push(
        new arc4MethodInfo({
          selector: methods[i].selector,
          cooldown: new UintN64(methods[i].cooldown),
          lastCalled: new UintN64(),
        })
      )
    }

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.pluginMbr(methods.length) + this.namedPluginMbr(name),
          fee,
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    this.plugins(key).value = new arc4DAOPluginInfo({
      delegationType,
      escrow: new UintN64(escrowID),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
      useExecutionKey: new Bool(useExecutionKey),
      executionProposalCreationMinimum: new UintN64(executionProposalCreationMinimum),
      executionParticipationThreshold: new UintN64(executionParticipationThreshold),
      executionApprovalThreshold: new UintN64(executionApprovalThreshold),
      executionVotingDuration: new UintN64(executionVotingDuration),
    });
  }

  private validateRemoveNamedPluginProposal(params: ProposalRemoveNamedPlugin): void { }

  /**
   * Remove a named plugin
   *
   * @param name The plugin name
  */
  private removeNamedPlugin(name: string): void {
    assert(this.namedPlugins(name).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    const app = this.namedPlugins(name).value
    assert(this.plugins(app).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const methods = this.plugins(app).value.methods.copy()

    this.namedPlugins(name).delete();
    this.plugins(app).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: this.pluginMbr(methods.length) + this.namedPluginMbr(name),
          fee,
        })
        .submit()
    }

  }

  // TODO:
  private validateAddAllowanceProposal(params: ProposalAddAllowance): void { }

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
          amount: this.allowanceMbr() * allowances.length,
          fee,
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
  private validateRemoveAllowanceProposal(params: ProposalRemoveAllowance): void { }

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
          amount: this.allowanceMbr() * assets.length,
          fee,
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

  private validateUpgradeAppProposal(params: ProposalUpgradeApp): void { }

  private validateUpdateFieldsProposal(params: ProposalUpdateField[]): void {
    for (let i: uint64 = 0; i < params.length; i += 1) {
      const { field, value } = params[i]

      switch (field) {
        case AkitaDAOGlobalStateKeysContentPolicy: {
          assert(Bytes(value).length === CID_LENGTH, ERR_INVALID_CONTENT_POLICY)
          break
        }
        case AkitaDAOGlobalStateKeysMinRewardsImpact: {
          const minRewardsImpact = decodeArc4<uint64>(Bytes(value))
          assert(minRewardsImpact >= 0, ERR_INVALID_MINIMUM_REWARDS_IMPACT)
          break
        }
        case AkitaDAOGlobalStateKeysSocialFees: {
          const { postFee, reactFee, impactTaxMin, impactTaxMax } = decodeArc4<SocialFees>(Bytes(value))
          assert(postFee >= MIN_POST_FEE && postFee < MAX_POST_FEE, ERR_INVALID_POST_FEE)
          assert(reactFee >= MIN_REACT_FEE && reactFee < MAX_REACT_FEE, ERR_INVALID_REACT_FEE)
          assert(impactTaxMin >= MIN_IMPACT_TAX_MIN, ERR_INVALID_IMPACT_TAX_MIN)
          assert(
            impactTaxMax > impactTaxMin
            && impactTaxMax >= MIN_IMPACT_TAX_MAX
            && impactTaxMax <= DIVISOR,
            ERR_INVALID_IMPACT_TAX_MAX
          )
          break
        }
        case AkitaDAOGlobalStateKeysStakingFees: {
          const { creationFee, impactTaxMin, impactTaxMax } = decodeArc4<StakingFees>(Bytes(value))
          assert(creationFee > 0, ERR_INVALID_POOL_CREATION_FEE)
          assert(impactTaxMin >= MIN_POOL_IMPACT_TAX_MIN, ERR_INVALID_POOL_IMPACT_TAX_MIN)
          assert(
            impactTaxMax >= impactTaxMin
            && impactTaxMax >= MIN_POOL_IMPACT_TAX_MAX
            && impactTaxMax <= DIVISOR,
            ERR_INVALID_POOL_IMPACT_TAX_MAX
          )
          break
        }
        case AkitaDAOGlobalStateKeysSubscriptionFees: {
          const { serviceCreationFee, paymentPercentage, triggerPercentage } = decodeArc4<SubscriptionFees>(Bytes(value))
          assert(serviceCreationFee > 0, ERR_INVALID_SERVICE_CREATION_FEE)
          assert(paymentPercentage >= MIN_PAYMENT_PERCENTAGE, ERR_INVALID_PAYMENT_PERCENTAGE)
          assert(triggerPercentage >= MIN_TRIGGER_PERCENTAGE, ERR_INVALID_TRIGGER_PERCENTAGE)
          assert((paymentPercentage + triggerPercentage) < DIVISOR, ERR_INVALID_TOTAL_PERCENTAGE_FEES)
          break
        }
        case AkitaDAOGlobalStateKeysNFTFees: {
          const {
            marketplaceSalePercentageMin,
            marketplaceSalePercentageMax,
            marketplaceComposablePercentage,
            marketplaceRoyaltyDefaultPercentage,
            shuffleSalePercentage,
            auctionSaleImpactTaxMin,
            auctionSaleImpactTaxMax,
            auctionComposablePercentage,
            auctionRafflePercentage,
            raffleSaleImpactTaxMin,
            raffleSaleImpactTaxMax,
            raffleComposablePercentage,
          } = decodeArc4<NFTFees>(Bytes(value))

          assert(marketplaceSalePercentageMin > MIN_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MINIMUM)
          assert(
            marketplaceSalePercentageMax > marketplaceSalePercentageMin &&
            marketplaceSalePercentageMax >= MIN_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM,
            ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM
          )
          assert(
            marketplaceComposablePercentage >= MIN_MARKETPLACE_COMPOSABLE_PERCENTAGE,
            ERR_INVALID_MARKETPLACE_COMPOSABLE_PERCENTAGE
          )
          assert(
            marketplaceRoyaltyDefaultPercentage >= MIN_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE,
            ERR_INVALID_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE
          )
          assert(
            (marketplaceSalePercentageMax + marketplaceComposablePercentage + marketplaceRoyaltyDefaultPercentage) <= DIVISOR,
            ERR_INVALID_TOTAL_PERCENTAGE_FEES
          )
          // ensure total marketplace fees are less than 100%
          assert(shuffleSalePercentage <= DIVISOR, ERR_INVALID_SHUFFLE_SALE_PERCENTAGE)
          assert(auctionSaleImpactTaxMin >= MIN_AUCTION_SALE_IMPACT_TAX_MIN, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MIN)
          assert(
            auctionSaleImpactTaxMax > auctionSaleImpactTaxMin
            && auctionSaleImpactTaxMax >= MIN_AUCTION_SALE_IMPACT_TAX_MAX,
            ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MAX
          )
          // ensure total auction fees are less than 100%
          assert(
            (auctionSaleImpactTaxMax + auctionComposablePercentage) <= DIVISOR,
            ERR_INVALID_TOTAL_PERCENTAGE_FEES
          )
          // ensure total auction raffle fees are less than 100%
          assert(auctionRafflePercentage <= DIVISOR, ERR_INVALID_AUCTION_RAFFLE_PERCENTAGE)
          assert(raffleSaleImpactTaxMin >= MIN_RAFFLE_SALE_IMPACT_TAX_MIN, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MIN)
          assert(
            raffleSaleImpactTaxMax > raffleSaleImpactTaxMin
            && raffleSaleImpactTaxMax >= MIN_RAFFLE_SALE_IMPACT_TAX_MAX,
            ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MAX
          )
          // ensure total raffle fees are less than 100%
          assert(
            (raffleSaleImpactTaxMax + raffleComposablePercentage) < DIVISOR,
            ERR_INVALID_TOTAL_PERCENTAGE_FEES
          )

          break
        }
        case AkitaDAOGlobalStateKeysSwapFees: {
          const swapFees = decodeArc4<SwapFees>(Bytes(value))
          assert(swapFees.impactTaxMin >= MIN_SWAP_IMPACT_TAX_MIN, ERR_INVALID_SWAP_IMPACT_TAX_MIN)
          assert(
            swapFees.impactTaxMax > swapFees.impactTaxMin
            && swapFees.impactTaxMax >= MIN_SWAP_IMPACT_TAX_MAX
            && swapFees.impactTaxMax <= DIVISOR,
            ERR_INVALID_SWAP_IMPACT_TAX_MAX
          )
          break
        }
        case AkitaDAOGlobalStateKeysKrbyPercentage: {
          const krbyPercentage = btoi(Bytes(value))
          assert(krbyPercentage >= ONE_PERCENT && krbyPercentage < (DIVISOR - this.moderatorPercentage.value), ERR_INVALID_KRBY_PERCENTAGE)
          break
        }
        case AkitaDAOGlobalStateKeysModeratorPercentage: {
          const modPercentage = btoi(Bytes(value))
          assert(modPercentage >= ONE_PERCENT && modPercentage < (DIVISOR - this.krbyPercentage.value), ERR_INVALID_MOD_PERCENTAGE)
          break
        }
        case AkitaDAOGlobalStateKeysProposalFee: {
          const proposalFee = btoi(Bytes(value))
          assert(proposalFee >= FIVE_ALGO, ERR_INVALID_PROPOSAL_FEE)
          break
        }
        case AkitaDAOGlobalStateKeysRevocationAddress: {
          assert(Bytes(value).length === ACCOUNT_LENGTH, ERR_INVALID_CONTENT_POLICY)
          const revocationAddress = Account(Bytes(value))
          assert(revocationAddress !== this.revocationAddress.value && revocationAddress !== Global.zeroAddress, ERR_INVALID_REVOCATION_ADDRESS)
          break
        }
        default: {
          assert(false, ERR_INVALID_FIELD)
        }
      }
    }
  }

  // TODO:
  private validateExecutePluginProposal(params: ProposalExecutePlugin): void { }

  // TODO:
  private validateExecuteNamedPluginProposal(params: ProposalExecuteNamedPlugin): void { }

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
    fees: Fees,
    proposalSettings: {
      creation: ProposalSettings,
      participation: ProposalSettings,
      approval: ProposalSettings,
      duration: ProposalSettings,
    },
    revocationAddress: Address
  ): void {
    assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
    assert(version !== '', ERR_VERSION_CANNOT_BE_EMPTY)

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

    this.status.value = DAOStatusInit
    this.version.value = version
    this.contentPolicy.value = contentPolicy
    this.minRewardsImpact.value = minRewardsImpact

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

    this.proposalCreationSettings.value = proposalSettings.creation
    this.proposalParticipationSettings.value = proposalSettings.participation
    this.proposalApprovalThresholdSettings.value = proposalSettings.approval
    this.proposalVotingDurationSettings.value = proposalSettings.duration

    const bones = bonesCreateTxn.createdAsset.id
    this.akitaAssets.value = { akta, bones }

    this.revocationAddress.value = revocationAddress.native
    this.proposalID.value = 0
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

    if (this.plugins(key).value.escrow.native !== 0) {
      const spendingApp = Application(this.plugins(key).value.escrow.native)
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
        note: 'rekeying to plugin app',
        fee,
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

  // READ ONLY METHODS ----------------------------------------------------------------------------

  /** Get the balance of a set of assets in the account */
  // @abimethod({ readonly: true })
  // balance(assets: uint64[]): uint64[] {
  //   let amounts: uint64[] = []
  //   for (let i: uint64 = 0; i < assets.length; i += 1) {
  //     let amount: uint64 = 0
  //     const asset = Asset(assets[i])

  //     if (asset.id === 0) {
  //       amount = Global.currentApplicationAddress.balance
  //     } else {
  //       const [holdingAmount, optedIn] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)
  //       if (optedIn) {
  //         amount = holdingAmount
  //       }
  //     }

  //     const escrowInfo = abiCall(Staking.prototype.getEscrowInfo, {
  //       appId: getAkitaAppList(this.akitaDAO.value).staking,
  //       args: [
  //         new Address(this.controlledAddress.value),
  //         new UintN64(asset.id)
  //       ],
  //       fee
  //     }).returnValue

  //     amounts = [...amounts, (amount + escrowInfo.hard + escrowInfo.lock)]
  //   }

  //   return amounts
  // }

  // AKITA DAO METHODS ----------------------------------------------------------------------------

  newProposal(
    payment: gtxn.PaymentTxn,
    action: ProposalAction,
    cid: CID,
    data: bytes,
    status: ProposalStatus,
  ): void {
    assert(status === ProposalStatusDraft || status === ProposalStatusVoting, ERR_INVALID_PROPOSAL_STATUS)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.proposalFee.value
      }
    )

    const origin = getOrigin(this.escrowFactory.value.id)

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
        powerPrerequisite = this.plugins(pluginKey).value.executionProposalCreationMinimum.native
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

  finalizeProposal(proposalID: uint64, args: bytes): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)

    const { action, creator } = this.proposals(proposalID).value

    assert(Txn.sender === creator.native, ERR_INCORRECT_SENDER)

    switch (action) {
      case ProposalActionUpgradeApp: {
        // TODO: ensure its an app we control
        const params = decodeArc4<ProposalUpgradeApp>(args)
        this.validateUpgradeAppProposal(params)
        break;
      }
      case ProposalActionAddPlugin: {
        const params = decodeArc4<ProposalAddPlugin>(args)
        this.validateAddPluginProposal(params)
        break;
      }
      case ProposalActionAddNamedPlugin: {
        const params = decodeArc4<ProposalAddNamedPlugin>(args)
        this.validateAddNamedPluginProposal(params)
        break;
      }
      case ProposalActionExecutePlugin: {
        const params = decodeArc4<ProposalExecutePlugin>(args)
        this.validateExecutePluginProposal(params)
        break;
      }
      case ProposalActionExecuteNamedPlugin: {
        const params = decodeArc4<ProposalExecuteNamedPlugin>(args)
        this.validateExecuteNamedPluginProposal(params)
        break;
      }
      case ProposalActionRemovePlugin: {
        const params = decodeArc4<ProposalRemovePlugin>(args)
        this.validateRemovePluginProposal(params)
        break;
      }
      case ProposalActionRemoveNamedPlugin: {
        const params = decodeArc4<ProposalRemoveNamedPlugin>(args)
        this.validateRemoveNamedPluginProposal(params)
        break;
      }
      case ProposalActionAddAllowance: {
        const params = decodeArc4<ProposalAddAllowance>(args)
        this.validateAddAllowanceProposal(params)
        break;
      }
      case ProposalActionRemoveAllowance: {
        const params = decodeArc4<ProposalRemoveAllowance>(args)
        this.validateRemoveAllowanceProposal(params)
        break;
      }
      case ProposalActionUpdateFields: {
        const params = decodeArc4<ProposalUpdateField[]>(args)
        this.validateUpdateFieldsProposal(params)
        break;
      }
    }


  }

  createModDisbursement(): void {

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
    const pluginInfo = decodeArc4<PluginInfo>(this.plugins(key).value.copy().bytes);
    assert(pluginInfo.escrow !== 0, ERR_NOT_USING_ESCROW);
    assert(
      Txn.sender === Application(plugin).address ||
      Txn.sender === caller.native ||
      caller.native === Global.zeroAddress,
      ERR_FORBIDDEN
    );

    const escrowAddress = Application(pluginInfo.escrow).address

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
        amount: Global.assetOptInMinBalance * assets.length,
        fee,
      })
      .submit();

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      assert(
        this.allowances({ escrow: pluginInfo.escrow, asset: assets[i] }).exists,
        ERR_ALLOWANCE_DOES_NOT_EXIST
      );

      itxn
        .assetTransfer({
          sender: escrowAddress,
          assetReceiver: escrowAddress,
          assetAmount: 0,
          xferAsset: assets[i],
          fee,
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

    const eid = this.escrows(name).value
    assert(this.receiveEscrows(eid).exists, ERR_ESCROW_DOES_NOT_EXIST)

    const escrow = this.receiveEscrows(eid).value
    const escrowAccount = Application(escrow.escrow).address

    assert(escrow.caller.native === Txn.sender, ERR_INCORRECT_SENDER)
    assert(escrow.optinAllowed === true, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: (Global.assetOptInMinBalance * 4),
      },
      ERR_INVALID_PAYMENT
    )

    itxnCompose.begin(
      itxn.payment({
        receiver: escrowAccount,
        amount: Global.assetOptInMinBalance,
        fee,
      })
    )

    itxnCompose.next(
      itxn.assetTransfer({
        sender: escrowAccount,
        assetReceiver: escrowAccount,
        assetAmount: 0,
        xferAsset: asset,
        fee,
      })
    )

    this.receiveEscrows(eid).value = {
      ...this.receiveEscrows(eid).value,
      optinCount: this.receiveEscrows(eid).value.optinCount + 1,
    }

    const daoNeedsToOptIn = !Global.currentApplicationAddress.isOptedIn(Asset(asset))
    if (daoNeedsToOptIn) {
      itxnCompose.next(
        itxn.assetTransfer({
          sender: Global.currentApplicationAddress,
          assetReceiver: Global.currentApplicationAddress,
          assetAmount: 0,
          xferAsset: asset,
          fee,
        })
      )
    }

    const modEid = this.escrows(AkitaDAOEscrowAccountModerators).value
    const modAccount = this.receiveEscrows(modEid).value.caller.native
    const modFundNeedsToOptIn = !modAccount.isOptedIn(Asset(asset))
    if (modFundNeedsToOptIn) {
      itxnCompose.next(
        itxn.payment({
          receiver: modAccount,
          amount: Global.assetOptInMinBalance,
          fee,
        })
      )

      itxnCompose.next(
        itxn.assetTransfer({
          sender: modAccount,
          assetReceiver: modAccount,
          assetAmount: 0,
          xferAsset: asset,
          fee,
        })
      )

      const modEscrow = this.escrows(AkitaDAOEscrowAccountModerators).value

      this.receiveEscrows(modEscrow).value = {
        ...this.receiveEscrows(modEscrow).value,
        optinCount: this.receiveEscrows(modEscrow).value.optinCount + 1,
      }
    }

    const krbyEscrow = this.escrows(AkitaDAOEscrowAccountKrby).value
    const krbyAccount = this.receiveEscrows(krbyEscrow).value.caller.native
    const krbyFundNeedsToOptIn = !krbyAccount.isOptedIn(Asset(asset))
    if (krbyFundNeedsToOptIn) {
      itxnCompose.next(
        itxn.payment({
          receiver: krbyAccount,
          amount: Global.assetOptInMinBalance,
          fee,
        })
      )

      itxnCompose.next(
        itxn.assetTransfer({
          sender: krbyAccount,
          assetReceiver: krbyAccount,
          assetAmount: 0,
          xferAsset: asset,
          fee,
        })
      )

      this.receiveEscrows(krbyEscrow).value = {
        ...this.receiveEscrows(krbyEscrow).value,
        optinCount: this.receiveEscrows(krbyEscrow).value.optinCount + 1,
      }
    }

    itxnCompose.submit()
  }

  startEscrowDisbursement(escrow: string): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    assert(this.receiveEscrows(this.escrows(escrow).value).exists, ERR_ESCROW_DOES_NOT_EXIST)
    // validate the time window of the last escrow payout
    const name = this.escrows(escrow).value
    const info = this.receiveEscrows(name).value
    assert(info.phase === EscrowDisbursementPhaseIdle, ERR_ESCROW_NOT_IDLE)
    assert(info.allocatable, ERR_ESCROW_NOT_ALLOCATABLE)

    const latestWindow: uint64 = Global.latestTimestamp - ((Global.latestTimestamp - info.creationDate) % ONE_DAY)
    assert(latestWindow >= info.lastDisbursement, ERR_ESCROW_NOT_READY_FOR_DISBURSEMENT)

    this.receiveEscrows(name).value = {
      ...info,
      phase: EscrowDisbursementPhaseAllocation,
      lastDisbursement: latestWindow,
    }
  }

  processEscrowAllocation(escrow: string, ids: uint64[]): void {
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    const eid = this.escrows(escrow).value
    const info = this.receiveEscrows(eid).value
    assert(info.phase === EscrowDisbursementPhaseAllocation, ERR_ESCROW_NOT_IN_ALLOCATION_PHASE)

    const sender = info.caller.native
    const krbyEid = this.escrows(AkitaDAOEscrowAccountKrby).value
    const krby = this.receiveEscrows(krbyEid).value.caller.native
    const modEid = this.escrows(AkitaDAOEscrowAccountModerators).value
    const moderators = this.receiveEscrows(modEid).value.caller.native

    for (let i: uint64 = 0; i < ids.length; i += 1) {
      const asset = ids[i]
      assert(!this.receiveAssets({ escrow: eid, asset }).exists, ERR_ASSET_ALREADY_ALLOCATED)
      assert(sender.isOptedIn(Asset(asset)), ERR_ESCROW_NOT_OPTED_IN)

      const [balance] = AssetHolding.assetBalance(sender, asset)

      const krbyAmount = calcPercent(balance, this.krbyPercentage.value)
      const moderatorAmount = calcPercent(balance, this.moderatorPercentage.value)
      const leftover: uint64 = balance - (krbyAmount + moderatorAmount)

      // pay krby
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: krby,
            amount: krbyAmount,
            fee,
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: krby,
            assetAmount: krbyAmount,
            xferAsset: asset,
            fee,
          })
          .submit()
      }

      // pay moderator fund
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: moderators,
            amount: moderatorAmount,
            fee,
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: moderators,
            assetAmount: moderatorAmount,
            xferAsset: asset,
            fee,
          })
          .submit()
      }

      // pay the bones fund
      if (asset === 0) {
        itxn
          .payment({
            sender,
            receiver: Global.currentApplicationAddress,
            amount: leftover,
            fee,
          })
          .submit()
      } else {
        itxn
          .assetTransfer({
            sender,
            assetReceiver: Global.currentApplicationAddress,
            assetAmount: leftover,
            xferAsset: asset,
            fee,
          })
          .submit()
      }

      this.receiveAssets({ escrow: eid, asset }).create()
    }

    const allocationCounter: uint64 = this.receiveEscrows(eid).value.allocationCounter + ids.length

    if (allocationCounter === (info.optinCount + 1)) {
      this.receiveEscrows(eid).value = {
        ...this.receiveEscrows(eid).value,
        allocationCounter,
        phase: EscrowDisbursementPhaseFinalization,
      }
    } else {
      this.receiveEscrows(eid).value = {
        ...this.receiveEscrows(eid).value,
        allocationCounter,
      }
    }
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  getState(): AkitaDAOState {
    return {
      status: this.status.value,
      version: this.version.value,
      contentPolicy: this.contentPolicy.value,
      minRewardsImpact: this.minRewardsImpact.value,
      akitaAppList: this.akitaAppList.value,
      otherAppList: this.otherAppList.value,
      socialFees: this.socialFees.value,
      stakingFees: this.stakingFees.value,
      subscriptionFees: this.subscriptionFees.value,
      nftFees: this.nftFees.value,
      krbyPercentage: this.krbyPercentage.value,
      moderatorPercentage: this.moderatorPercentage.value,
      proposalSettings: {
        creation: this.proposalCreationSettings.value,
        participation: this.proposalParticipationSettings.value,
        approval: this.proposalApprovalThresholdSettings.value,
        duration: this.proposalVotingDurationSettings.value,
      },
      akitaAssets: this.akitaAssets.value,
      revocationAddress: new Address(this.revocationAddress.value),
    }
  }
}
