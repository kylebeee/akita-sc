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
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, Global, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Bool, Contract, decodeArc4, DynamicArray, methodSelector, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AbstractAccountBoxPrefixAllowances,
  AbstractAccountBoxPrefixDomainKeys,
  AbstractAccountBoxPrefixNamedPlugins,
  AbstractAccountBoxPrefixPlugins,
  AbstractAccountGlobalStateKeysAdmin,
  AbstractAccountGlobalStateKeysAvatar,
  AbstractAccountGlobalStateKeysBanner,
  AbstractAccountGlobalStateKeysBio,
  AbstractAccountGlobalStateKeysControlledAddress,
  AbstractAccountGlobalStateKeysFactoryApp,
  AbstractAccountGlobalStateKeysLastChange,
  AbstractAccountGlobalStateKeysLastUserInteraction,
  AbstractAccountGlobalStateKeysNickname,
  AbstractAccountGlobalStateKeysSpendingAddress,
} from './constants'
import {
  ERR_ADMIN_ONLY,
  ERR_ALLOWANCE_ALREADY_EXISTS,
  ERR_ALLOWANCE_DOES_NOT_EXIST,
  ERR_BAD_DEPLOYER,
  ERR_CANNOT_CALL_OTHER_APPS_DURING_REKEY,
  ERR_DOES_NOT_HOLD_ASSET,
  ERR_INVALID_METHOD_SIGNATURE_LENGTH,
  ERR_INVALID_ONCOMPLETE,
  ERR_INVALID_PLUGIN_CALL,
  ERR_INVALID_SENDER_ARG,
  ERR_INVALID_SENDER_VALUE,
  ERR_MALFORMED_OFFSETS,
  ERR_METHOD_ON_COOLDOWN,
  ERR_MISSING_REKEY_BACK,
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
import { AllowanceInfo, AllowanceKey, arc4MethodInfo, arc4PluginInfo, DelegationTypeSelf, FullPluginValidation, FundsRequest, MethodRestriction, MethodValidation, PluginInfo, PluginKey, PluginValidation, SpendAllowanceType, SpendAllowanceTypeDrip, SpendAllowanceTypeFlat, SpendAllowanceTypeWindow } from './types'
import { AkitaDomain } from '../../utils/constants'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyRevocationApp, GlobalStateKeySpendingAccountFactoryApp, GlobalStateKeyVersion } from '../../constants'
import { getAkitaAppList } from '../../utils/functions'
import { fee } from '../../utils/constants'
import { SpendingAccountContract } from '../spending-account/contract.algo'
import { SpendingAccountFactoryInterface } from '../../utils/types/spend-accounts'
import { AbstractedAccountInterface } from '../../utils/abstract-account'

export class AbstractedAccount extends Contract implements AbstractedAccountInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the version of the wallet contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app id of the akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** The admin of the abstracted account. This address can add plugins and initiate rekeys */
  admin = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysAdmin })
  /** The address this app controls */
  controlledAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysControlledAddress })
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
  spendingAccountFactoryApp = GlobalState<Application>({ key: GlobalStateKeySpendingAccountFactoryApp })
  /** the application ID for the contract that deployed this wallet */
  factoryApp = GlobalState<Application>({ key: AbstractAccountGlobalStateKeysFactoryApp })
  /** The app that can revoke plugins */
  revocationApp = GlobalState<Application>({ key: GlobalStateKeyRevocationApp })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<PluginKey, arc4PluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins })
  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, PluginKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins })
  /** The Allowances for plugins installed on the smart contract with useAllowance set to true */
  allowances = BoxMap<AllowanceKey, AllowanceInfo>({ keyPrefix: AbstractAccountBoxPrefixAllowances }) // 38_500
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

  // private mbr(methods: uint64, name: string, domain: string): AbstractAccountMBRData {
  //     return {
  //         plugins: 28_900 + (400 * (12 * methods)),
  //         namedPlugins: 18_900 + (400 * name.length),
  //         domainKeys: 15_700 + (400 * domain.length),
  //     }
  // }

  private updateLastUserInteraction() {
    this.lastUserInteraction.value = Global.latestTimestamp
  }

  private updateLastChange() {
    this.lastChange.value = Global.latestTimestamp
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
    return Txn.sender === this.revocationApp.value.address
  }

  private pluginCallAllowed(application: uint64, allowedCaller: Account, method: bytes<4>): boolean {
    const key: PluginKey = { application, allowedCaller }

    if (!this.plugins(key).exists) {
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
        this.plugins(key).value = new arc4PluginInfo({
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
    const selectorArg = txn.appArgs(0).toFixed({ length: 4 });

    const methods = this.plugins(key).value.methods.copy()
    const allowedMethod = methods[offset].copy()

    const hasCooldown = allowedMethod.cooldown.native > 0

    const useRounds = this.plugins(key).value.useRounds.native

    const epochRef = useRounds ? Global.round : Global.latestTimestamp;
    const onCooldown = (epochRef - methods[offset].lastCalled.native) < methods[offset].cooldown.native;

    if (methods[offset].selector.native === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        const lastCalled = useRounds
          ? Global.round
          : Global.latestTimestamp

        methods[offset].lastCalled = new UintN64(lastCalled);

        this.plugins(key).value = new arc4PluginInfo({
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
    spendingAccountFactoryApp: uint64,
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
    this.spendingAccountFactoryApp.value = Application(spendingAccountFactoryApp)
    this.spendingAddress.value = Global.zeroAddress;
    this.revocationApp.value = Application(revocationApp)
    this.nickname.value = nickname
    this.factoryApp.value = Application(Global.callerApplicationId)
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
    this.revocationApp.value = Application(newRevocationApp)
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
      this.plugins(key).exists && this.plugins(key).value.admin.native,
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
   * @param addr The address to rekey to
   * @param flash Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call
   */
  arc58_rekeyTo(address: Address, flash: boolean): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);

    itxn
      .payment({
        sender: this.controlledAddress.value,
        receiver: address.native,
        rekeyTo: address.native,
        note: 'rekeying abstracted account',
        fee,
      })
      .submit();

    if (flash) this.assertRekeysBack();

    this.updateLastUserInteraction();
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

    if (this.plugins(key).value.delegationType === DelegationTypeSelf) {
      this.updateLastUserInteraction();
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
  arc58_addPlugin(
    app: uint64,
    allowedCaller: Address,
    admin: boolean,
    delegationType: UintN8,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useAllowance: boolean,
    useRounds: boolean,
  ): void {
    assert(this.isAdmin(), ERR_ADMIN_ONLY);
    const badDelegationCombo = (
      delegationType === DelegationTypeSelf &&
      allowedCaller.native === Global.zeroAddress
    )
    assert(!badDelegationCombo, ERR_ZERO_ADDRESS_DELEGATION_TYPE)
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
          SpendingAccountFactoryInterface.prototype.mint,
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

    this.plugins(key).value = new arc4PluginInfo({
      admin: new Bool(admin),
      delegationType,
      spendingApp: new UintN64(spendingApp),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useAllowance: new Bool(useAllowance),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
    });

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
    this.domainKeys(caller.native).value = domain
  }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   * @param allowedCaller The address of that's allowed to call the app
   * @param methods The methods that to remove before attempting to uninstall the plugin
   * or the global zero address for all addresses
   */
  arc58_removePlugin(app: uint64, allowedCaller: Address): void {
    assert(this.isAdmin() || this.canRevoke(), ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN);

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
        SpendingAccountFactoryInterface.prototype.delete,
        {
          appId: this.spendingAccountFactoryApp.value,
          args: [spendingApp],
          fee,
        }
      )
    }

    this.updateLastUserInteraction();
    this.updateLastChange();
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
  arc58_addNamedPlugin(
    name: string,
    app: uint64,
    allowedCaller: Address,
    admin: boolean,
    delegationType: UintN8,
    lastValid: uint64,
    cooldown: uint64,
    methods: MethodRestriction[],
    useAllowance: boolean,
    useRounds: boolean,
  ): void {
    assert(Txn.sender === this.admin.value, ERR_ADMIN_ONLY);
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
          SpendingAccountFactoryInterface.prototype.mint,
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

    this.plugins(key).value = new arc4PluginInfo({
      admin: new Bool(admin),
      delegationType,
      spendingApp: new UintN64(spendingApp),
      lastValid: new UintN64(lastValid),
      cooldown: new UintN64(cooldown),
      methods: methodInfos.copy(),
      useAllowance: new Bool(useAllowance),
      useRounds: new Bool(useRounds),
      lastCalled: new UintN64(0),
      start: new UintN64(epochRef),
    });

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
        SpendingAccountFactoryInterface.prototype.delete,
        {
          appId: this.spendingAccountFactoryApp.value,
          args: [spendingApp],
          fee,
        }
      )
    }

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  arc58_addAllowance(
    plugin: uint64,
    caller: Address,
    asset: uint64,
    type: SpendAllowanceType,
    allowed: uint64,
    max: uint64,
    interval: uint64,
  ): void {
    assert(Txn.sender === this.admin.value, ERR_ADMIN_ONLY);

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

    this.updateLastUserInteraction();
    this.updateLastChange();
  }

  arc58_removeAllowance(plugin: uint64, caller: Address, asset: uint64): void {
    assert(this.isAdmin() || this.canRevoke(), ERR_ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_METHOD_RESTRICTION);

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

    this.updateLastUserInteraction();
    this.updateLastChange();
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
          new UintN64(asset.id)
        ],
        fee
      }).returnValue

      amounts = [...amounts, (amount + escrowInfo.hard + escrowInfo.lock)]
    }

    return amounts
  }
}
