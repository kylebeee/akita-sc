import {
  GlobalState,
  BoxMap,
  assert,
  uint64,
  Account,
  TransactionType,
  Application,
  abimethod,
  gtxn,
  itxn,
  Asset,
  OnCompleteAction,
  Bytes,
  bytes,
  assertMatch,
  clone,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, Global, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Contract, methodSelector, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AbstractAccountBoxPrefixAllowances,
  AbstractAccountBoxPrefixDomainKeys,
  AbstractAccountBoxPrefixEscrows,
  AbstractAccountBoxPrefixExecutions,
  AbstractAccountBoxPrefixNamedPlugins,
  AbstractAccountBoxPrefixPlugins,
  AbstractAccountGlobalStateKeysAdmin,
  AbstractAccountGlobalStateKeysAvatar,
  AbstractAccountGlobalStateKeysBanner,
  AbstractAccountGlobalStateKeysBio,
  AbstractAccountGlobalStateKeysControlledAddress,
  AbstractAccountGlobalStateKeysEscrowFactory,
  AbstractAccountGlobalStateKeysFactoryApp,
  AbstractAccountGlobalStateKeysLastChange,
  AbstractAccountGlobalStateKeysLastUserInteraction,
  AbstractAccountGlobalStateKeysNickname,
  AbstractAccountGlobalStateKeysSpendingAddress,
  AllowanceMBR,
  EscrowsMBR,
  MethodRestrictionByteLength,
  MinDomainKeysMBR,
  MinNamedEscrowsMBR,
  MinNamedPluginMBR,
  MinPluginMBR,
} from './constants'
import {
  ERR_ADMIN_ONLY,
  ERR_ALLOWANCE_ALREADY_EXISTS,
  ERR_ALLOWANCE_DOES_NOT_EXIST,
  ERR_ALLOWANCE_EXCEEDED,
  ERR_BAD_DEPLOYER,
  ERR_BAD_EXECUTION_KEY,
  ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY,
  ERR_DOES_NOT_HOLD_ASSET,
  ERR_ESCROW_ALREADY_EXISTS,
  ERR_EXECUTION_KEY_ALREADY_EXISTS,
  ERR_EXECUTION_KEY_DOES_NOT_EXIST,
  ERR_FORBIDDEN,
  ERR_INVALID_METHOD_SIGNATURE_LENGTH,
  ERR_INVALID_ONCOMPLETE,
  ERR_INVALID_PAYMENT,
  ERR_INVALID_PLUGIN_CALL,
  ERR_INVALID_SENDER_ARG,
  ERR_INVALID_SENDER_VALUE,
  ERR_MALFORMED_OFFSETS,
  ERR_METHOD_ON_COOLDOWN,
  ERR_MISSING_REKEY_BACK,
  ERR_NOT_USING_ESCROW,
  ERR_ONLY_ADMIN_CAN_ADD_PLUGIN,
  ERR_ONLY_ADMIN_CAN_CHANGE_ADMIN,
  ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME,
  ERR_ONLY_ADMIN_CAN_CHANGE_REVOKE,
  ERR_ONLY_ADMIN_CAN_UPDATE,
  ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_METHOD_RESTRICTION,
  ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN,
  ERR_PLUGIN_DOES_NOT_EXIST,
  ERR_PLUGIN_EXPIRED,
  ERR_PLUGIN_ON_COOLDOWN,
  ERR_SENDER_MUST_BE_ADMIN_PLUGIN,
  ERR_ZERO_ADDRESS_DELEGATION_TYPE,
} from './errors'

import { Staking } from '../../staking/contract.algo'
import { AbstractAccountBoxMBRData, AddAllowanceInfo, AllowanceInfo, AllowanceKey, arc4MethodInfo, arc4PluginInfo, DelegationTypeSelf, EscrowInfo, EscrowReclaim, ExecutionKey, FullPluginValidation, FundsRequest, MethodInfo, MethodRestriction, MethodValidation, PluginInfo, PluginKey, PluginValidation, SpendAllowanceType, SpendAllowanceTypeDrip, SpendAllowanceTypeFlat, SpendAllowanceTypeWindow } from './types'
import { AkitaDomain, BoxCostPerByte } from '../../utils/constants'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyRevocation, GlobalStateKeyVersion } from '../../constants'
import { getAkitaAppList } from '../../utils/functions'
import { AbstractedAccountInterface } from '../../utils/abstract-account'
import { EscrowFactory } from '../../escrow/factory.algo'
import { ERR_ESCROW_DOES_NOT_EXIST, ERR_ESCROW_LOCKED } from '../../dao/errors'
import { ARC58WalletIDsByAccountsMbr, NewCostForARC58 } from '../../escrow/constants'

export class AbstractedAccount extends Contract implements AbstractedAccountInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the version of the wallet contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app id of the akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** The admin of the abstracted account. This address can add plugins and initiate rekeys */
  admin = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysAdmin })
  /** The address this app controls */
  controlledAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysControlledAddress });
  /** A user defined nickname for their wallet */
  nickname = GlobalState<string>({ key: AbstractAccountGlobalStateKeysNickname })
  /** A user defined NFT to display as their avatar that the user owns */
  avatar = GlobalState<Asset>({ key: AbstractAccountGlobalStateKeysAvatar })
  /** A user defined NFT to display as their banner that the user owns */
  banner = GlobalState<Asset>({ key: AbstractAccountGlobalStateKeysBanner })
  /** A user defined description */
  bio = GlobalState<string>({ key: AbstractAccountGlobalStateKeysBio })
  /** The last time the contract was interacted with in unix time */
  lastUserInteraction = GlobalState<uint64>({ key: AbstractAccountGlobalStateKeysLastUserInteraction })
  /** The last time state has changed on the abstracted account (not including lastCalled for cooldowns) in unix time */
  lastChange = GlobalState<uint64>({ key: AbstractAccountGlobalStateKeysLastChange })
  /** [TEMPORARY STATE FIELD] The spending address for the currently active plugin */
  spendingAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysSpendingAddress })
  /** the spending account factory to use for allowances */
  escrowFactory = GlobalState<Application>({ key: AbstractAccountGlobalStateKeysEscrowFactory })
  /** the application ID for the contract that deployed this wallet */
  factoryApp = GlobalState<Application>({ key: AbstractAccountGlobalStateKeysFactoryApp })
  /** The app that can revoke plugins */
  revocation = GlobalState<Application>({ key: GlobalStateKeyRevocation })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<PluginKey, PluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins });
  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, PluginKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins });
  /** the escrows that this wallet has created for specific callers with allowances */
  escrows = BoxMap<uint64, boolean>({ keyPrefix: AbstractAccountBoxPrefixEscrows })
  /** Escrows that have been given a name */
  namedEscrows = BoxMap<string, uint64>({ keyPrefix: AbstractAccountBoxPrefixEscrows }) // 6_100
  /** The Allowances for plugins installed on the smart contract with useAllowance set to true */
  allowances = BoxMap<AllowanceKey, AllowanceInfo>({ keyPrefix: AbstractAccountBoxPrefixAllowances }) // 38_500
  /** execution keys */
  executions = BoxMap<ExecutionKey, uint64>({ keyPrefix: AbstractAccountBoxPrefixExecutions })

  /**
   * Passkeys on the account and their corresponding domain names
   * address : domain
   * IMPORTANT: a passkey attached to the akita domain is a co-admin passkey
   * we explicitly have this feature so that the wallet can be used on multiple devices
   * where the admin passkey may be incompatible
   * we track this onchain so we can assist with 'sign-in from another device' functionality
   * as well as uses like DAO based domain revocation
  */
  domainKeys = BoxMap<Account, string>({ keyPrefix: AbstractAccountBoxPrefixDomainKeys })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private updateLastUserInteraction() {
    this.lastUserInteraction.value = Global.latestTimestamp
  }

  private updateLastChange() {
    this.lastChange.value = Global.latestTimestamp
  }

  private pluginsMbr(methodCount: uint64): uint64 {
    return MinPluginMBR + (
      BoxCostPerByte * (MethodRestrictionByteLength * methodCount)
    );
  }

  private namedPluginsMbr(name: string): uint64 {
    return MinNamedPluginMBR + (BoxCostPerByte * Bytes(name).length);
  }

  private escrowsMbr(): uint64 {
    return EscrowsMBR;
  }

  private namedEscrowsMbr(name: string): uint64 {
    return MinNamedEscrowsMBR + (BoxCostPerByte * Bytes(name).length);
  }

  private allowancesMbr(): uint64 {
    return AllowanceMBR;
  }

  private domainKeysMbr(domain: string): uint64 {
    return MinDomainKeysMBR + (BoxCostPerByte * Bytes(domain).length)
  }

  private maybeNewEscrow(escrow: string): uint64 {
    if (escrow === '') {
      return 0
    }

    return this.namedEscrows(escrow).exists
      ? this.namedEscrows(escrow).value
      : this.newEscrow(escrow)
  }

  private newEscrow(escrow: string): uint64 {
    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.namedEscrowsMbr(escrow) + this.escrowsMbr()
        })
        .submit()
    }

    const id = abiCall(
      EscrowFactory.prototype.new,
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

    this.escrows(id).value = false
    this.namedEscrows(escrow).value = id

    return id;
  }

  /** @returns whether or not the caller is an admin on the wallet */
  private isAdmin(): boolean {
    return (
      Txn.sender === this.admin.value ||
      (this.domainKeys(Txn.sender).exists && this.domainKeys(Txn.sender).value === AkitaDomain)
    )
  }

  /** @returns whether the caller is the revocation app address */
  private canRevoke(): boolean {
    return Txn.sender === this.revocation.value.address
  }

  private pluginCallAllowed(application: uint64, allowedCaller: Account, method: bytes<4>): boolean {
    const key: PluginKey = { application, allowedCaller }

    if (!this.plugins(key).exists) {
      return false;
    }

    const { methods, useRounds, lastCalled, cooldown, useExecutionKey } = clone(this.plugins(key).value)
    
    if (useExecutionKey) {
      return false
    }

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

  private assertRekeysBack(): void {
    let rekeysBack = false;
    for (let i: uint64 = (Txn.groupIndex + 1); i < Global.groupSize; i += 1) {
      const txn = gtxn.Transaction(i)

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true;
        break;
      }
    }

    assert(rekeysBack, ERR_MISSING_REKEY_BACK);
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

    const { useRounds, lastValid, cooldown, lastCalled, methods } = clone(this.plugins(key).value)
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

  /**
   * Guarantee that our txn group is valid in a single loop over all txns in the group
   * 
   * @param key the box key for the plugin were checking
   * @param methodOffsets the indices of the methods being used in the group
  */
  private assertValidGroup(key: PluginKey, methodOffsets: uint64[]): void {

    const { useRounds, useExecutionKey } = this.plugins(key).value

    const epochRef = useRounds
      ? Global.round
      : Global.latestTimestamp;

    if (useExecutionKey) {
      assert(
        this.executions(Global.groupId).exists &&
        epochRef < this.executions(Global.groupId).value,
        ERR_BAD_EXECUTION_KEY
      )
    }

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

      const { hasMethodRestrictions, valid } = this.pluginCheck(key);

      assert(valid, ERR_INVALID_PLUGIN_CALL);

      if (hasMethodRestrictions) {
        assert(methodIndex < methodOffsets.length, ERR_MALFORMED_OFFSETS);
        const { methodAllowed, methodOnCooldown } = this.methodCheck(key, txn, methodOffsets[methodIndex]);
        assert(methodAllowed && !methodOnCooldown, ERR_METHOD_ON_COOLDOWN);
      }

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

    assert(len(txn.appArgs(0)) === 4, ERR_INVALID_METHOD_SIGNATURE_LENGTH)
    const selectorArg = txn.appArgs(0).toFixed({ length: 4 })

    const { useRounds } = this.plugins(key).value
    const { selector, cooldown, lastCalled } = this.plugins(key).value.methods[offset]

    const hasCooldown = cooldown > 0

    const epochRef = useRounds ? Global.round : Global.latestTimestamp
    const onCooldown = (epochRef - lastCalled) < cooldown

    if (selector === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        const lastCalled = useRounds ? Global.round : Global.latestTimestamp;
        this.plugins(key).value.methods[offset].lastCalled = lastCalled
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

  private verifyAllowance(key: AllowanceKey, fundRequest: FundsRequest): void {
    assert(this.allowances(key).exists, ERR_ALLOWANCE_DOES_NOT_EXIST);
    const { type, spent, allowed, last, max, interval, start, useRounds } = this.allowances(key).value
    const newLast = useRounds ? Global.round : Global.latestTimestamp;

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

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  /**
   * Create an abstracted account application.
   * This is not part of ARC58 and implementation specific.
   *
   * @param version The version of the abstracted account application
   * @param controlledAddress The address of the abstracted account. If zeroAddress, then the address of the contract account will be used
   * @param admin The address of the admin for this application
   * @param revocationApp The application ID of the revocation app associated with this abstracted account
   * @param nickname A user-friendly name for this abstracted account
  */
  @abimethod({ onCreate: 'require' })
  create(
    version: string,
    controlledAddress: Address,
    admin: Address,
    escrowFactory: uint64,
    revocationApp: uint64,
    nickname: string
  ): void {
    assert(Global.callerApplicationId !== 0, ERR_BAD_DEPLOYER)
    assert(admin !== controlledAddress)

    this.version.value = version
    this.admin.value = admin.native
    this.controlledAddress.value =
      controlledAddress.native === Global.zeroAddress
        ? Global.currentApplicationAddress
        : controlledAddress.native
    this.escrowFactory.value = Application(escrowFactory)
    this.spendingAddress.value = Global.zeroAddress;
    this.revocation.value = Application(revocationApp)
    this.nickname.value = nickname
    this.factoryApp.value = Application(Global.callerApplicationId)

    this.updateLastUserInteraction()
    this.updateLastChange()
  }

  /**
   * Register the abstracted account with the escrow factory.
   * This allows apps to correlate the account with the app without needing
   * it to be explicitly provided.
   */
  init(): void {
    abiCall(
      EscrowFactory.prototype.register,
      {
        appId: this.escrowFactory.value,
        args: [
          itxn.payment({
            receiver: this.escrowFactory.value.address,
            amount: ARC58WalletIDsByAccountsMbr
          })
        ]
      }
    )
  }

  /** @param version the version of the wallet */
  @abimethod({ allowActions: ['UpdateApplication'] })
  update(version: string): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_UPDATE)
    this.version.value = version
  }

  // ABSTRACTED ACCOUNT METHODS -------------------------------------------------------------------

  /**
   * Changes the revocation app associated with the contract
   *
   * @param newRevocationApp the new revocation app
  */
  changeRevocationApp(newRevocationApp: uint64): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_REVOKE)
    this.revocation.value = Application(newRevocationApp)
  }

  /**
   * Changes the nickname of the wallet
   *
   * @param nickname the new nickname of the wallet
  */
  setNickname(nickname: string): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    this.nickname.value = nickname
  }

  /**
   * Changes the avatar of the wallet
   *
   * @param avatar the new avatar of the wallet
  */
  setAvatar(avatar: uint64): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    const amount = this.balance([avatar])
    assert(amount[0] > 0, ERR_DOES_NOT_HOLD_ASSET)
    this.avatar.value = Asset(avatar)
  }

  /**
   * Changes the banner of the wallet
   *
   * @param banner the new banner of the wallet
  */
  setBanner(banner: uint64): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    const amount = this.balance([banner])
    assert(amount[0] > 0, ERR_DOES_NOT_HOLD_ASSET)
    this.banner.value = Asset(banner)
  }

  /**
   * Changes the bio of the wallet
   *
   * @param bio the new bio of the wallet
  */
  setBio(bio: string): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    this.bio.value = bio
  }

  /**
   * Attempt to change the admin for this app. Some implementations MAY not support this.
   *
   * @param newAdmin The new admin
  */
  arc58_changeAdmin(newAdmin: Address): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_CHANGE_ADMIN);
    this.admin.value = newAdmin.native;
    this.updateLastUserInteraction()
    this.updateLastChange()
  }

  /**
   * Attempt to change the admin via plugin.
   *
   * @param plugin The app calling the plugin
   * @param allowedCaller The address that triggered the plugin
   * @param newAdmin The new admin
   *
  */
  arc58_pluginChangeAdmin(plugin: uint64, allowedCaller: Address, newAdmin: Address): void {
    assert(Txn.sender === Application(plugin).address, ERR_SENDER_MUST_BE_ADMIN_PLUGIN);
    assert(
      this.controlledAddress.value.authAddress === Application(plugin).address,
      'This plugin is not in control of the account'
    );

    const key = { application: plugin, allowedCaller: allowedCaller.native };

    assert(
      this.plugins(key).exists && this.plugins(key).value.admin,
      'This plugin does not have admin privileges'
    );

    this.admin.value = newAdmin.native;
    if (this.plugins(key).value.delegationType === DelegationTypeSelf) {
      this.updateLastUserInteraction();
    }
    this.updateLastChange()
  }

  /**
   * Verify the abstracted account is rekeyed to this app
  */
  arc58_verifyAuthAddr(): void {
    assert(this.spendingAddress.value.authAddress === this.getAuthAddr());
    this.spendingAddress.value = Global.zeroAddress
  }

  /**
   * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
   *
   * @param address The address to rekey to
   * @param flash Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call
  */
  arc58_rekeyTo(address: Address, flash: boolean): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);

    itxn
      .payment({
        sender: this.controlledAddress.value,
        receiver: address.native,
        rekeyTo: address.native,
        note: 'rekeying abstracted account'
      })
      .submit();

    if (flash) this.assertRekeysBack();

    this.updateLastUserInteraction();
  }

  /**
   * check whether the plugin can be used
   *
   * @param plugin the plugin to be rekeyed to
   * @param global whether this is callable globally
   * @param address the address that will trigger the plugin
   * @param method the method being called on the plugin, if applicable
   * @returns whether the plugin can be called with these parameters
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

    if (this.plugins(key).value.delegationType === DelegationTypeSelf) {
      this.updateLastUserInteraction();
    }
  }

  /**
   * Temporarily rekey to a named plugin app address
   *
   * @param name The name of the plugin to rekey to
   * @param global Whether the plugin is callable globally
   * @param methodOffsets The indices of the methods being used in the group if the plugin has method restrictions these indices are required to match the methods used on each subsequent call to the plugin within the group
   * @param fundsRequest If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to be able to use during execution
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
  */
  arc58_addPlugin(
    app: uint64,
    allowedCaller: Address,
    admin: boolean,
    delegationType: Uint8,
    escrow: string,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean
  ): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);
    const badDelegationCombo = (
      delegationType === DelegationTypeSelf &&
      allowedCaller.native === Global.zeroAddress
    )
    assert(!badDelegationCombo, ERR_ZERO_ADDRESS_DELEGATION_TYPE)
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
          amount: this.pluginsMbr(methodInfos.length)
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    this.plugins(key).value = {
      admin,
      delegationType,
      escrow: escrowID,
      lastValid,
      cooldown,
      methods: clone(methodInfos),
      useRounds,
      useExecutionKey,
      lastCalled: 0,
      start: epochRef,
    }

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  /**
   * Assign a domain to a passkey
   *
   * @param caller The address of the passkey
   * @param domain The domain to assign to the passkey
  */
  assignDomain(caller: Address, domain: string): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_ADD_PLUGIN)

    if (this.controlledAddress.value !== Global.currentApplicationAddress) {
      itxn
        .payment({
          sender: this.controlledAddress.value,
          receiver: Global.currentApplicationAddress,
          amount: this.domainKeysMbr(domain)
        })
        .submit()
    }

    this.domainKeys(caller.native).value = domain
  }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   * @param allowedCaller The address that's allowed to call the app
  */
  arc58_removePlugin(app: uint64, allowedCaller: Address): void {
    assert(this.isAdmin() || this.canRevoke(), ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN);

    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native }
    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST)

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

    this.updateLastUserInteraction();
    this.updateLastChange();
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
  */
  arc58_addNamedPlugin(
    name: string,
    app: uint64,
    allowedCaller: Address,
    admin: boolean,
    delegationType: Uint8,
    escrow: string,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useRounds: boolean,
    useExecutionKey: boolean
  ): void {
    assert(Txn.sender === this.admin.value, ERR_ADMIN_ONLY);
    assert(!this.namedPlugins(name).exists);

    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native }
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
          amount: this.pluginsMbr(methodInfos.length) + this.namedPluginsMbr(name)
        })
        .submit()
    }

    const escrowID = this.maybeNewEscrow(escrow);

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;

    this.plugins(key).value = {
      admin,
      delegationType,
      escrow: escrowID,
      lastValid,
      cooldown,
      methods: clone(methodInfos),
      useRounds,
      useExecutionKey,
      lastCalled: 0,
      start: epochRef
    }

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  /**
     * Remove a named plugin
     *
     * @param name The plugin name
    */
  arc58_removeNamedPlugin(name: string): void {
    assert(this.isAdmin() || this.canRevoke(), ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN);
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
          amount: this.namedPluginsMbr(name) + this.pluginsMbr(methodsLength)
        })
        .submit()
    }

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  /**
   * Create a new escrow for the controlled address
   *
   * @param escrow The name of the escrow to create
  */
  arc58_newEscrow(escrow: string): uint64 {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);
    assert(!this.namedEscrows(escrow).exists, ERR_ESCROW_ALREADY_EXISTS);
    return this.newEscrow(escrow);
  }

  /**
   * Lock or Unlock an escrow account
   *
   * @param escrow The escrow to lock or unlock
  */
  arc58_toggleEscrowLock(escrow: string): boolean {
    assert(this.isAdmin(), ERR_FORBIDDEN);
    assert(this.namedEscrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);
    const escrowID = this.namedEscrows(escrow).value

    this.escrows(escrowID).value = !this.escrows(escrowID).value;

    this.updateLastUserInteraction();
    this.updateLastChange();

    return this.escrows(escrowID).value;
  }

  /**
   * Transfer funds from an escrow back to the controlled address.
   * 
   * @param escrow The escrow to reclaim funds from
   * @param reclaims The list of reclaims to make from the escrow
  */
  arc58_reclaim(escrow: string, reclaims: EscrowReclaim[]): void {
    assert(this.isAdmin(), ERR_FORBIDDEN);
    assert(this.namedEscrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);
    const sender = Application(this.namedEscrows(escrow).value).address

    for (let i: uint64 = 0; i < reclaims.length; i += 1) {
      if (reclaims[i].asset === 0) {
        const pmt = itxn.payment({
          sender,
          receiver: this.controlledAddress.value,
          amount: reclaims[i].amount
        })

        if (reclaims[i].closeOut) {
          pmt.set({ closeRemainderTo: this.controlledAddress.value });
        }

        pmt.submit();
      } else {
        const xfer = itxn.assetTransfer({
          sender,
          assetReceiver: this.controlledAddress.value,
          assetAmount: reclaims[i].amount,
          xferAsset: reclaims[i].asset
        })

        if (reclaims[i].closeOut) {
          xfer.set({ assetCloseTo: this.controlledAddress.value });
        }

        xfer.submit();
      }
    }
  }

  /**
   * Opt-in an escrow account to assets
   *
   * @param escrow The escrow to opt-in to
   * @param assets The list of assets to opt-in to
  */
  arc58_optinEscrow(escrow: string, assets: uint64[]): void {
    assert(this.isAdmin(), ERR_FORBIDDEN)
    assert(this.namedEscrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    const escrowID = this.namedEscrows(escrow).value
    const escrowAddress = Application(escrowID).address
    assert(!this.escrows(escrowID).value, ERR_ESCROW_LOCKED)

    itxn
      .payment({
        sender: this.controlledAddress.value,
        receiver: escrowAddress,
        amount: Global.assetOptInMinBalance * assets.length
      })
      .submit();

    for (let i: uint64 = 0; i < assets.length; i += 1) {
      assert(
        this.allowances({ escrow: escrowID, asset: assets[i] }).exists,
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
   * Opt-in an escrow account to assets via a plugin / allowed caller
   *
   * @param app The app related to the escrow optin
   * @param allowedCaller The address allowed to call the plugin related to the escrow optin
   * @param assets The list of assets to opt-in to
   * @param mbrPayment The payment txn that is used to pay for the asset opt-in
  */
  arc58_pluginOptinEscrow(
    app: uint64,
    allowedCaller: Address,
    assets: uint64[],
    mbrPayment: gtxn.PaymentTxn
  ): void {
    const key: PluginKey = { application: app, allowedCaller: allowedCaller.native };

    assert(this.plugins(key).exists, ERR_PLUGIN_DOES_NOT_EXIST);
    const { escrow } = this.plugins(key).value
    assert(escrow !== 0, ERR_NOT_USING_ESCROW);
    assert(
      Txn.sender === Application(app).address ||
      Txn.sender === allowedCaller.native ||
      allowedCaller.native === Global.zeroAddress,
      ERR_FORBIDDEN
    )
    assert(this.escrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST)
    assert(!this.escrows(escrow).value, ERR_ESCROW_LOCKED)

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
   * Add an allowance for an escrow account
   *
   * @param escrow The escrow to add the allowance for
   * @param allowances The list of allowances to add
  */
  arc58_addAllowances(escrow: string, allowances: AddAllowanceInfo[]): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);
    assert(this.namedEscrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);
    const escrowID = this.namedEscrows(escrow).value
    assert(!this.escrows(escrowID).value, ERR_ESCROW_LOCKED);

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
      const key: AllowanceKey = { escrow: escrowID, asset }
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

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  /**
   * Remove an allowances for an escrow account
   *
   * @param escrow The escrow to remove the allowance for
   * @param assets The list of assets to remove the allowance for
  */
  arc58_removeAllowances(escrow: string, assets: uint64[]): void {
    assert(this.isAdmin() || this.canRevoke(), ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_METHOD_RESTRICTION);
    assert(this.namedEscrows(escrow).exists, ERR_ESCROW_DOES_NOT_EXIST);
    const escrowID = this.namedEscrows(escrow).value
    assert(!this.escrows(escrowID).value, ERR_ESCROW_LOCKED);

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
        escrow: escrowID,
        asset: assets[i]
      }
      assert(this.allowances(key).exists, ERR_ALLOWANCE_DOES_NOT_EXIST)
      this.allowances(key).delete()
    }

    this.updateLastUserInteraction()
    this.updateLastChange()
  }

  arc58_addExecutionKey(key: ExecutionKey, lastValidRound: uint64): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY)
    assert(!this.executions(key).exists, ERR_EXECUTION_KEY_ALREADY_EXISTS)

    this.executions(key).value = lastValidRound

    this.updateLastUserInteraction()
    this.updateLastChange()
  }

  arc58_removeExecutionKey(key: ExecutionKey): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY)
    assert(this.executions(key).exists, ERR_EXECUTION_KEY_DOES_NOT_EXIST)
    this.executions(key).delete()

    this.updateLastUserInteraction()
    this.updateLastChange()
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  /**
   * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
   * because different implementations may have different ways of determining the admin.
  */
  @abimethod({ readonly: true })
  arc58_getAdmin(): Address {
    return new Address(this.admin.value)
  }

  @abimethod({ readonly: true })
  arc58_getEscrow(name: string): uint64 {
    if (this.namedEscrows(name).exists) {
      return this.namedEscrows(name).value
    }
    return 0
  }

  @abimethod({ readonly: true })
  arc58_mustGetEscrow(name: string): uint64 {
    assert(this.namedEscrows(name).exists, ERR_ESCROW_DOES_NOT_EXIST);
    return this.namedEscrows(name).value
  }

  @abimethod({ readonly: true })
  mbr(
    methodCount: uint64,
    pluginName: string,
    escrowName: string
  ): AbstractAccountBoxMBRData {
    return {
      plugins: this.pluginsMbr(methodCount),
      namedPlugins: this.namedPluginsMbr(pluginName),
      escrows: this.escrowsMbr(),
      namedEscrows: this.namedEscrowsMbr(escrowName),
      allowances: this.allowancesMbr(),
      domainKeys: this.domainKeysMbr(pluginName),
    }
  }

  /** Get the balance of a set of assets in the account */
  @abimethod({ readonly: true })
  balance(assets: uint64[]): uint64[] {
    let amounts: uint64[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      let amount: uint64 = 0
      const asset = Asset(assets[i])

      if (asset.id === 0) {
        amount = Global.currentApplicationAddress.balance
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)
        if (optedIn) {
          amount = holdingAmount
        }
      }

      const escrowInfo = abiCall(Staking.prototype.getEscrowInfo, {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [
          new Address(this.controlledAddress.value),
          asset.id
        ]
      }).returnValue

      amounts = [...amounts, (amount + escrowInfo.hard + escrowInfo.lock)]
    }

    return amounts
  }
}
