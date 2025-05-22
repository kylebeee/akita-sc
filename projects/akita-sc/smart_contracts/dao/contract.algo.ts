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
  TransactionType,
  OnCompleteAction,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Bool, decodeArc4, DynamicArray, methodSelector, StaticBytes, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AkitaAppList,
  AkitaAssets,
  AkitaDAOState,
  arc4DAOPluginInfo,
  EscrowInfo,
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
  SocialFees,
  StakingFees,
  SubscriptionFees,
  SwapFees,
} from './types'

import { ERR_ALREADY_INITIALIZED, ERR_BAD_DAO_DELEGATION_TYPE, ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_NOT_ALLOWED_TO_OPTIN, ERR_EXECUTION_KEY_MISMATCH, ERR_INCORRECT_SENDER, ERR_INVALID_AUCTION_RAFFLE_PERCENTAGE, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MAX, ERR_INVALID_AUCTION_SALE_IMPACT_TAX_MIN, ERR_INVALID_CONTENT_POLICY, ERR_INVALID_FIELD, ERR_INVALID_IMPACT_TAX_MAX, ERR_INVALID_IMPACT_TAX_MIN, ERR_INVALID_KRBY_PERCENTAGE, ERR_INVALID_MARKETPLACE_COMPOSABLE_PERCENTAGE, ERR_INVALID_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, ERR_INVALID_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, ERR_INVALID_METHOD_SIGNATURE_LENGTH, ERR_INVALID_MINIMUM_REWARDS_IMPACT, ERR_INVALID_MOD_PERCENTAGE, ERR_INVALID_PAYMENT_PERCENTAGE, ERR_INVALID_POOL_CREATION_FEE, ERR_INVALID_POOL_IMPACT_TAX_MAX, ERR_INVALID_POOL_IMPACT_TAX_MIN, ERR_INVALID_POST_FEE, ERR_INVALID_PROPOSAL_FEE, ERR_INVALID_PROPOSAL_STATUS, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MAX, ERR_INVALID_RAFFLE_SALE_IMPACT_TAX_MIN, ERR_INVALID_REACT_FEE, ERR_INVALID_REVOCATION_ADDRESS, ERR_INVALID_SERVICE_CREATION_FEE, ERR_INVALID_SHUFFLE_SALE_PERCENTAGE, ERR_INVALID_SWAP_IMPACT_TAX_MAX, ERR_INVALID_SWAP_IMPACT_TAX_MIN, ERR_INVALID_TOTAL_PERCENTAGE_FEES, ERR_INVALID_TRIGGER_PERCENTAGE, ERR_PLUGIN_DOES_NOT_EXIST, ERR_PLUGIN_EXPIRED, ERR_PLUGIN_ON_COOLDOWN, ERR_PROPOSAL_DOES_NOT_EXIST, ERR_PROPOSAL_NOT_APPROVED, ERR_PROPOSAL_NOT_UPGRADE_APP, ERR_VERSION_CANNOT_BE_EMPTY, ERR_WRONG_METHOD_FOR_EXECUTION_KEY_LOCKED_PLUGIN } from './errors'
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
  STATUS_INIT,
  StatusApproved,
  StatusDraft,
  StatusVoting,
} from './constants'
import { GlobalStateKeySpendingAccountFactoryApp, GlobalStateKeyVersion } from '../constants'
import { ERR_INVALID_PAYMENT } from '../utils/errors'
import { ACCOUNT_LENGTH, CID_LENGTH, DIVISOR, fee, FIVE_ALGO, MAX_IMPACT, MAX_POST_FEE, MAX_REACT_FEE, MIN_AUCTION_SALE_IMPACT_TAX_MAX, MIN_AUCTION_SALE_IMPACT_TAX_MIN, MIN_IMPACT_TAX_MAX, MIN_IMPACT_TAX_MIN, MIN_MARKETPLACE_COMPOSABLE_PERCENTAGE, MIN_MARKETPLACE_ROYALTY_DEFAULT_PERCENTAGE, MIN_MARKETPLACE_SALE_PERCENTAGE_MAXIMUM, MIN_MARKETPLACE_SALE_PERCENTAGE_MINIMUM, MIN_PAYMENT_PERCENTAGE, MIN_POOL_IMPACT_TAX_MAX, MIN_POOL_IMPACT_TAX_MIN, MIN_POST_FEE, MIN_RAFFLE_SALE_IMPACT_TAX_MAX, MIN_RAFFLE_SALE_IMPACT_TAX_MIN, MIN_REACT_FEE, MIN_SWAP_IMPACT_TAX_MAX, MIN_SWAP_IMPACT_TAX_MIN, MIN_TRIGGER_PERCENTAGE, ONE_PERCENT } from '../utils/constants'
import { AbstractAccountBoxPrefixAllowances, AbstractAccountBoxPrefixNamedPlugins, AbstractAccountBoxPrefixPlugins, AbstractAccountGlobalStateKeysControlledAddress, AbstractAccountGlobalStateKeysLastChange, AbstractAccountGlobalStateKeysLastUserInteraction, AbstractAccountGlobalStateKeysSpendingAddress } from '../arc58/account/constants'
import { AllowanceInfo, AllowanceKey, arc4MethodInfo, DelegationTypeSelf, FullPluginValidation, FundsRequest, MethodRestriction, MethodValidation, PluginInfo, PluginKey, PluginValidation, SpendAllowanceType, SpendAllowanceTypeDrip, SpendAllowanceTypeFlat, SpendAllowanceTypeWindow } from '../arc58/account/types'
import { ERR_ALLOWANCE_ALREADY_EXISTS, ERR_ALLOWANCE_DOES_NOT_EXIST, ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY, ERR_INVALID_ONCOMPLETE, ERR_INVALID_PLUGIN_CALL, ERR_INVALID_SENDER_ARG, ERR_INVALID_SENDER_VALUE, ERR_MALFORMED_OFFSETS, ERR_METHOD_ON_COOLDOWN, ERR_MISSING_REKEY_BACK, ERR_ZERO_ADDRESS_DELEGATION_TYPE } from '../arc58/account/errors'
import { SpendingAccountContract } from '../arc58/spending-account/contract.algo'
import { SpendingAccountFactory } from '../utils/types/spend-accounts'
import { CID } from '../utils/types/base'
import { getOrigin, getStakingPower } from '../utils/functions'

/**
 * The Akita DAO contract has several responsibilities:
 * [-] Manages the disbursement of the bones token
 * [x] Manages the content policy of the protocol
 * [-] Manages the minimum impact score to qualify for daily disbursement
 * [x] Sets the fee to post on akita social
 * [x] Sets the fee to react on akita social
 * [-] Sets the fee structure for Akita Staking
 * [-] Sets the fee structure for Akita Subscriptions
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
  contentPolicy = GlobalState<CID>({ key: AkitaDAOGlobalStateKeysContentPolicy })
  /** the minimum impact score to qualify for daily disbursement */
  minimumRewardsImpact = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysMinimumRewardsImpact })
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
  proposalSettings = GlobalState<ProposalSettings>({ key: AkitaDAOGlobalStateKeysProposalSettings })
  /** The address this app controls */
  controlledAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysControlledAddress })
  /** The last time state has changed on the abstracted account (not including lastCalled for cooldowns) in unix time */
  lastChange = GlobalState<uint64>({ key: AbstractAccountGlobalStateKeysLastChange })
  /** [TEMPORARY STATE FIELD] The spending address for the currently active plugin */
  spendingAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysSpendingAddress })
  /** the spending account factory to use for allowances */
  spendingAccountFactoryApp = GlobalState<Application>({ key: GlobalStateKeySpendingAccountFactoryApp })
  /** revocation msig */
  revocationAddress = GlobalState<Account>({ key: AkitaDAOGlobalStateKeysRevocationAddress })
  /** the next proposal id */
  proposalID = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysProposalID })
  /** the daily disbursement cursor */
  disbursementCursor = GlobalState<uint64>({ key: AkitaDAOGlobalStateKeysDisbursementCursor })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<PluginKey, arc4DAOPluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, PluginKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins })
  /** The Allowances for plugins installed on the smart contract with useAllowance set to true */
  allowances = BoxMap<AllowanceKey, AllowanceInfo>({ keyPrefix: AbstractAccountBoxPrefixAllowances }) // 38_500
  /** voting state of a proposal */
  proposals = BoxMap<uint64, ProposalDetails>({ keyPrefix: AkitaDAOBoxPrefixProposals })
  /** Group hashes that the DAO has approved to be submitted */
  executions = BoxMap<ExecutionKey, ExecutionInfo>({ keyPrefix: AkitaDAOBoxPrefixExecutions })
  /** named escrow accounts the DAO uses */
  escrows = BoxMap<string, EscrowInfo>({ keyPrefix: AkitDAOBoxPrefixEscrows })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newProposalID(): uint64 {
    const id = this.proposalID.value
    this.proposalID.value += 1
    return id
  }

  private updateLastChange() {
    this.lastChange.value = Global.latestTimestamp
  }

  private pluginCallAllowed(application: uint64, allowedCaller: Account, method: StaticBytes<4>): boolean {
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
      if (methods[i].selector === method) {
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

    const pluginInfo = decodeArc4<PluginInfo>(this.plugins(key).value.bytes)
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
        this.plugins(key).value = new arc4DAOPluginInfo({
          ...this.plugins(key).value.copy(),
          lastCalled: new UintN64(epochRef)
        })
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
    const selectorArg = new StaticBytes<4>(txn.appArgs(0).toFixed({ length: 4 }));

    const methods = this.plugins(key).value.methods.copy()
    const allowedMethod = methods[offset].copy()

    const hasCooldown = allowedMethod.cooldown.native > 0

    const useRounds = this.plugins(key).value.useRounds.native

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;
    const onCooldown = (epochRef - methods[offset].lastCalled.native) < methods[offset].cooldown.native;

    if (methods[offset].selector === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        const lastCalled = useRounds
          ? Global.round
          : Global.latestTimestamp

        methods[offset].lastCalled = new UintN64(lastCalled);

        this.plugins(key).value = new arc4DAOPluginInfo({
          ...this.plugins(key).value,
          methods: methods.copy(),
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
        allowedCaller: key.allowedCaller,
        application: key.application,
        asset: fundsRequests[i].asset
      }

      this.verifyAllowance(
        pluginInfo.start,
        pluginInfo.useRounds,
        allowanceKey,
        fundsRequests[i]
      );

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
    start: uint64,
    useRounds: boolean,
    key: AllowanceKey,
    fundRequest: FundsRequest
  ): void {
    assert(this.allowances(key).exists, 'Allowance does not exist');
    const { type, spent, allowed, last, max, interval } = this.allowances(key).value
    const newLast = useRounds
      ? Global.round
      : Global.latestTimestamp

    if (type === SpendAllowanceTypeFlat) {
      const leftover: uint64 = allowed - spent;

      assert(leftover >= fundRequest.amount, 'Allowance exceeded');

      this.allowances(key).value = {
        ...this.allowances(key).value,
        spent: (spent + fundRequest.amount)
      }
    } else if (type === SpendAllowanceTypeWindow) {
      const currentWindowStart = this.getLatestWindowStart(useRounds, start, interval)

      if (currentWindowStart > last) {
        assert(allowed >= fundRequest.amount, 'Allowance exceeded');
      } else {
        // calc the remaining amount available in the current window
        const leftover: uint64 = allowed - spent;
        assert(leftover >= fundRequest.amount, 'Allowance exceeded');
      }

      this.allowances(key).value = {
        ...this.allowances(key).value,
        spent: (spent + fundRequest.amount),
        last: newLast
      }

    } else if (type === SpendAllowanceTypeDrip) {
      const epochRef = useRounds ? Global.round : Global.latestTimestamp;

      const amount = fundRequest.amount
      const accrualRate = allowed
      const lastLeftover = spent

      const passed: uint64 = epochRef - last
      const accrued: uint64 = lastLeftover + ((passed / interval) * accrualRate)

      const available: uint64 = accrued > max ? max : accrued

      assert(available >= amount, 'Allowance exceeded');

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
      ? this.controlledAddress.value === Global.currentApplicationAddress
        ? Global.zeroAddress // contract controls itself
        : Global.currentApplicationAddress // contract controls a different account
      : Global.zeroAddress; // is a spending account 
  }

  private validateAddPluginProposal(params: ProposalAddPlugin): boolean {
    // app id cant be 0
    // plugin must be open source: aka source link must be provided
    // lastValid must be greater than current round + voting period
    // is useAllowance set to true?
    // validate add allowance requests
    return false
  }

  /**
   * Add an app to the list of approved plugins
   *
   * @param app The app to add
   * @param allowedCaller The address of that's allowed to call the app
   * or the global zero address for all addresses
   * @param delegationType the ownership of the delegation for last_interval updates
   * @param lastValidRound The round when the permission expires
   * @param cooldown  The number of rounds that must pass before the plugin can be called again
   * @param adminPrivileges Whether the plugin has permissions to change the admin account
   * @param methods The methods that are allowed to be called for the plugin by the address
   * 
   */
  private addPlugin(
    app: uint64,
    allowedCaller: Address,
    delegationType: UintN8,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useAllowance: boolean,
    useRounds: boolean,
    useExecutionKey: boolean,
  ): void {
    assert(delegationType !== DelegationTypeSelf, ERR_BAD_DAO_DELEGATION_TYPE)
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native }

    const methodInfos = new DynamicArray<arc4MethodInfo>()
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
          amount: 36_500 + (400 * (13 * methods.length)),
          fee,
        })
        .submit()
    }

    let spendingApp: uint64 = 0
    if (useAllowance) {
      spendingApp =
        abiCall(
          SpendingAccountFactory.prototype.create,
          {
            sender: this.controlledAddress.value,
            appId: this.spendingAccountFactoryApp.value,
            args: [
              itxn.payment({
                amount: 269_500,
                receiver: this.spendingAccountFactoryApp.value.address,
                fee,
              }),
              app,
            ],
            fee,
          }
        ).returnValue

    }

    this.plugins(key).value = new arc4DAOPluginInfo({
      delegationType,
      spendingApp: new UintN64(spendingApp),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useAllowance: new Bool(useAllowance),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
      useExecutionKey: new Bool(useExecutionKey),
    });
  }

  private validateRemovePluginProposal(params: ProposalRemovePlugin): boolean {
    return false
  }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   * @param allowedCaller The address of that's allowed to call the app
   * @param methods The methods that to remove before attempting to uninstall the plugin
   * or the global zero address for all addresses
   */
  private removePlugin(app: uint64, allowedCaller: Address): void {
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };
    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const spendingApp = this.plugins(key).value.spendingApp.native
    const methods = this.plugins(key).value.methods.copy()

    this.plugins(key).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: 36_500 + (400 * (13 * methods.length)),
          fee,
        })
        .submit()
    }

    if (spendingApp !== 0) {
      abiCall(
        SpendingAccountFactory.prototype.delete,
        {
          appId: this.spendingAccountFactoryApp.value,
          args: [spendingApp],
          fee,
        }
      )
    }
  }

  private validateAddNamedPluginProposal(params: ProposalAddNamedPlugin): boolean {
    return false
  }

  /**
   * Add a named plugin
   *
   * @param name The plugin name
   * @param app The plugin app
   * @param allowedCaller The address of that's allowed to call the app
   * or the global zero address for all addresses
   * @param delegationType the ownership of the delegation for last_interval updates
   * @param lastValidRound The round when the permission expires
   * @param cooldown  The number of rounds that must pass before the plugin can be called again
   * @param adminPrivileges Whether the plugin has permissions to change the admin account
   * @param methods The methods that are allowed to be called for the plugin by the address
   * 
   */
  private addNamedPlugin(
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
  ): void {
    assert(!this.namedPlugins(name).exists);

    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };
    this.namedPlugins(name).value = key

    const methodInfos = new DynamicArray<arc4MethodInfo>()
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
          amount: 55_400 + (400 * ((13 * methods.length) + Bytes(name).length)),
          fee,
        })
        .submit()
    }

    let spendingApp: uint64 = 0
    if (useAllowance) {
      spendingApp =
        abiCall(
          SpendingAccountFactory.prototype.create,
          {
            appId: this.spendingAccountFactoryApp.value,
            args: [
              itxn.payment({
                sender: this.controlledAddress.value,
                amount: 12_500,
                receiver: this.spendingAccountFactoryApp.value.address,
                fee,
              }),
              0,
            ],
            fee,
          }
        ).returnValue
    }

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    this.plugins(key).value = new arc4DAOPluginInfo({
      delegationType,
      spendingApp: new UintN64(spendingApp),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useAllowance: new Bool(useAllowance),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
      useExecutionKey: new Bool(useExecutionKey),
    });
  }

  private validateRemoveNamedPluginProposal(params: ProposalRemoveNamedPlugin): void {}

  /**
   * Remove a named plugin
   *
   * @param name The plugin name
  */
  private removeNamedPlugin(name: string): void {
    assert(this.namedPlugins(name).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    const app = this.namedPlugins(name).value
    assert(this.plugins(app).exists, ERR_PLUGIN_DOES_NOT_EXIST);

    const spendingApp = this.plugins(app).value.spendingApp.native
    const methods = this.plugins(app).value.methods.copy()

    this.namedPlugins(name).delete();
    this.plugins(app).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: 55_400 + (400 * ((13 * methods.length) + Bytes(name).length)),
          fee,
        })
        .submit()
    }

    if (spendingApp !== 0) {
      abiCall(
        SpendingAccountFactory.prototype.delete,
        {
          appId: this.spendingAccountFactoryApp.value,
          args: [spendingApp],
          fee,
        }
      )
    }
  }

  private validateAddAllowanceProposal(params: ProposalAddAllowance): void {}

  private addAllowance(
    plugin: uint64,
    caller: Address,
    asset: uint64,
    type: SpendAllowanceType,
    allowed: uint64,
    max: uint64,
    interval: uint64,
  ): void {
    const pkey: PluginKey = { application: plugin, allowedCaller: caller.native };

    const key: AllowanceKey = { ...pkey, asset }

    assert(this.plugins(pkey).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    assert(!this.allowances(key).exists, ERR_ALLOWANCE_ALREADY_EXISTS);

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: 38_500,
          fee,
        })
        .submit()
    }

    this.allowances(key).value = {
      type,
      spent: 0,
      allowed,
      last: 0,
      max,
      interval,
    }
  }

  private validateRemoveAllowanceProposal(params: ProposalRemoveAllowance): void {}

  private removeAllowance(plugin: uint64, caller: Address, asset: uint64): void {
    const pkey: PluginKey = { application: plugin, allowedCaller: caller.native };

    const key = { ...pkey, asset };

    assert(this.plugins(pkey).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    assert(this.allowances(key).exists, ERR_ALLOWANCE_DOES_NOT_EXIST);

    this.allowances(key).delete();

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          receiver: this.controlledAddress.value,
          amount: 38_500,
          fee,
        })
        .submit()
    }
  }

  private validateUpgradeAppProposal(params: ProposalUpgradeApp): void {}

  private validateUpdateFieldsProposal(params: ProposalUpdateField[]): void {
    for (let i: uint64 = 0; i < params.length; i += 1) {
      const { field, value } = params[i]

      switch (field) {
        case AkitaDAOGlobalStateKeysContentPolicy: {
          assert(Bytes(value).length === CID_LENGTH, ERR_INVALID_CONTENT_POLICY)
          break
        }
        case AkitaDAOGlobalStateKeysMinimumRewardsImpact: {
          const minImpact = btoi(Bytes(value))
          assert(minImpact > 0 && minImpact < MAX_IMPACT, ERR_INVALID_MINIMUM_REWARDS_IMPACT)
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

  private validateExecutePluginProposal(params: ProposalExecutePlugin): void {}

  private validateExecuteNamedPluginProposal(params: ProposalExecuteNamedPlugin): void {}

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(spendingAccountFactoryApp: uint64): void {
    this.version.value = ''
    this.spendingAccountFactoryApp.value = Application(spendingAccountFactoryApp)
  }

  @abimethod({ allowActions: ['UpdateApplication'] })
  update(proposalID: uint64): void {
    assert(this.proposals(proposalID).exists, ERR_PROPOSAL_DOES_NOT_EXIST)
    const { status, action, data } = this.proposals(proposalID).value
    assert(status === StatusApproved, ERR_PROPOSAL_NOT_APPROVED)
    assert(action === ProposalActionUpgradeApp, ERR_PROPOSAL_NOT_UPGRADE_APP)
  
    const { app, executionKey } = decodeArc4<ProposalUpgradeApp>(data)
    assert(app === Global.currentApplicationId.id, ERR_PROPOSAL_NOT_UPGRADE_APP)
    assert(Global.groupId === executionKey.bytes, ERR_EXECUTION_KEY_MISMATCH)
  }

  init(
    version: string,
    akta: uint64,
    contentPolicy: StaticBytes<36>,
    minimumRewardsImpact: uint64,
    fees: Fees,
    proposalSettings: ProposalSettings,
    revocationAddress: Address
  ): void {
    assert(this.version.value === '', ERR_ALREADY_INITIALIZED)
    assert(version !== '', ERR_VERSION_CANNOT_BE_EMPTY)

    const bonesCreateTxn = itxn
      .assetConfig({
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
        // metadataHash: Bytes(''), // TODO: figure out the metadata hash we should have here
      })
      .submit()

    this.status.value = STATUS_INIT
    this.version.value = version
    this.contentPolicy.value = contentPolicy.native
    this.minimumRewardsImpact.value = minimumRewardsImpact

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

    this.proposalSettings.value = {
      minimumProposalThreshold: proposalSettings.minimumProposalThreshold,
      minimumVoteThreshold: proposalSettings.minimumVoteThreshold,
    }

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
  // @ts-ignore
  @abimethod({ readonly: true })
  arc58_canCall(
    plugin: uint64,
    global: boolean,
    address: Address,
    method: StaticBytes<4>
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
     * @param methodOffsets The indices of the methods being used in the group
     * if the plugin has method restrictions these indices are required to match
     * the methods used on each subsequent call to the plugin within the group
     * 
     */
  arc58_rekeyToPlugin(
    plugin: uint64,
    global: boolean,
    methodOffsets: uint64[],
    fundsRequest: FundsRequest[]
  ): void {
    const pluginApp = Application(plugin)

    const key = {
      application: plugin,
      allowedCaller: global
        ? Global.zeroAddress
        : Txn.sender
    }

    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    assert(!this.plugins(key).value.useExecutionKey.native, ERR_WRONG_METHOD_FOR_EXECUTION_KEY_LOCKED_PLUGIN)

    this.assertValidGroup(key, methodOffsets);

    if (this.plugins(key).value.spendingApp.native !== 0) {
      const spendingApp = Application(this.plugins(key).value.spendingApp.native)
      this.spendingAddress.value = spendingApp.address;
      this.transferFunds(key, fundsRequest);

      abiCall(
        SpendingAccountContract.prototype.rekey,
        {
          appId: spendingApp,
          args: [new Address(pluginApp.address)],
          fee,
        }
      )
    } else {
      this.spendingAddress.value = this.controlledAddress.value;

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
    assert(status === StatusDraft || status === StatusVoting, ERR_INVALID_PROPOSAL_STATUS)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.proposalFee.value
      }
    )

    const origin = getOrigin(this.spendingAccountFactoryApp.value.id)

    const power = getStakingPower(
      this.akitaAppList.value.staking,
      new Address(origin),
      this.akitaAssets.value.bones
    )

    // validate the origin account has atleast x bones lock staked


    const id = this.newProposalID()
    
    this.proposals(id).value = {
      action,
      status: StatusDraft,
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

  createDailyDisbursement(): void {
    // calc the amount to distribute
    // const bonesAmount = this.app.address.assetBalance(this.bonesID.value);
    const [bonesAmount] = AssetHolding.assetBalance(
      Global.currentApplicationAddress,
      this.akitaAssets.value.bones
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
      status: this.status.value,
      version: this.version.value,
      contentPolicy: new arc4.StaticBytes<36>(this.contentPolicy.value),
      minimumRewardsImpact: this.minimumRewardsImpact.value,
      akitaAppList: this.akitaAppList.value,
      otherAppList: this.otherAppList.value,
      socialFees: this.socialFees.value,
      stakingFees: this.stakingFees.value,
      subscriptionFees: this.subscriptionFees.value,
      nftFees: this.nftFees.value,
      krbyPercentage: this.krbyPercentage.value,
      moderatorPercentage: this.moderatorPercentage.value,
      proposalSettings: this.proposalSettings.value,
      akitaAssets: this.akitaAssets.value,
      revocationAddress: new Address(this.revocationAddress.value),
    }
  }
}
