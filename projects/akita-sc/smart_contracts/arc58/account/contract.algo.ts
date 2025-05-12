import {
  GlobalState,
  BoxMap,
  assert,
  arc4,
  uint64,
  Account,
  TransactionType,
  Application,
  abimethod,
  gtxn,
  itxn,
  Asset,
  OnCompleteAction,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding, btoi, Global, len, Txn } from '@algorandfoundation/algorand-typescript/op'
import { abiCall, Address, Contract, DynamicArray, StaticBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  AbstractAccountBoxPrefixDomainKeys,
  AbstractAccountBoxPrefixNamedPlugins,
  AbstractAccountBoxPrefixPlugins,
  AbstractAccountGlobalStateKeysAdmin,
  AbstractAccountGlobalStateKeysAvatar,
  AbstractAccountGlobalStateKeysBanner,
  AbstractAccountGlobalStateKeysBio,
  AbstractAccountGlobalStateKeysControlledAddress,
  AbstractAccountGlobalStateKeysFactoryApp,
  AbstractAccountGlobalStateKeysNickname,
} from './constants'
import {
  ERR_BAD_DEPLOYER,
  ERR_DOES_NOT_HOLD_ASSET,
  ERR_ONLY_ADMIN_CAN_ADD_PLUGIN,
  ERR_ONLY_ADMIN_CAN_CHANGE_NICKNAME,
  ERR_ONLY_ADMIN_CAN_CHANGE_REVOKE,
  ERR_ONLY_ADMIN_CAN_UPDATE,
} from './errors'

import { Staking } from '../../staking/contract.algo'
import { arc4MethodInfo, arc4PluginInfo, arc4PluginsKey, FullPluginValidation, MethodRestriction, MethodValidation, PluginValidation } from './types'
import { AkitaDomain } from '../../utils/constants'
import { GlobalStateKeyAkitaDAO, GlobalStateKeyRevocationApp, GlobalStateKeyVersion } from '../../constants'
import { getAkitaAppList } from '../../utils/functions'

function pluginsKey(app: uint64, caller: Address): arc4PluginsKey {
  return new arc4PluginsKey({ application: new UintN64(app), allowedCaller: caller })
}

export class AbstractedAccount extends Contract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the version of the wallet contract */
  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the app id of the akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })
  /** The admin of the abstracted account. This address can add plugins and initiate rekeys */
  admin = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysAdmin })
  /** The address this app controls */
  controlledAddress = GlobalState<Account>({ key: AbstractAccountGlobalStateKeysControlledAddress })
  /** the application ID for the contract that deployed this wallet */
  factoryApp = GlobalState<Application>({ key: AbstractAccountGlobalStateKeysFactoryApp })
  /** The app that can revoke plugins */
  revocationApp = GlobalState<Application>({ key: GlobalStateKeyRevocationApp })
  /** A user defined nickname for their wallet */
  nickname = GlobalState<string>({ key: AbstractAccountGlobalStateKeysNickname })
  /** A user defined NFT to display as their avatar that the user owns */
  avatar = GlobalState<Asset>({ key: AbstractAccountGlobalStateKeysAvatar })
  /** A user defined NFT to display as their banner that the user owns */
  banner = GlobalState<Asset>({ key: AbstractAccountGlobalStateKeysBanner })
  /** A user defined description */
  bio = GlobalState<string>({ key: AbstractAccountGlobalStateKeysBio })

  // BOXES ----------------------------------------------------------------------------------------

  /** Plugins that add functionality to the controlledAddress and the account that has permission to use it. */
  plugins = BoxMap<arc4PluginsKey, arc4PluginInfo>({ keyPrefix: AbstractAccountBoxPrefixPlugins })

  /** Plugins that have been given a name for discoverability */
  namedPlugins = BoxMap<string, arc4PluginsKey>({ keyPrefix: AbstractAccountBoxPrefixNamedPlugins })

  /**
   * Passkeys on the account and their corresponding domain names
   * address : domain
   * IMPORTANT: a passkey attached to the akita domain is a co-admin passkey
   * we explicitly have this feature so that the wallet can be used on multiple devices
   * where the admin passkey may be incompatible
   * we track this onchain so we can assist with 'sign-in from another device' functionality
   * as well as uses like DAO based domain revocation
   */
  domainKeys = BoxMap<Address, string>({ keyPrefix: AbstractAccountBoxPrefixDomainKeys })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  // private mbr(methods: uint64, name: string, domain: string): AbstractAccountMBRData {
  //     return {
  //         plugins: 28_900 + (400 * (12 * methods)),
  //         namedPlugins: 18_900 + (400 * name.length),
  //         domainKeys: 15_700 + (400 * domain.length),
  //     }
  // }

  /** @returns whether or not the caller is an admin on the wallet */
  private isAdmin(): boolean {
    return (
      Txn.sender === this.admin.value ||
      (this.domainKeys(new Address(Txn.sender)).exists && this.domainKeys(new Address(Txn.sender)).value === AkitaDomain)
    )
  }

  /** @returns whether the caller is the revocation app address */
  private canRevoke(): boolean {
    return Txn.sender === this.revocationApp.value.address
  }

  private pluginCallAllowed(key: arc4PluginsKey, method: StaticBytes<4>): boolean {
    if (!this.plugins(key).exists) {
      return false
    }

    const methods = this.plugins(key).value.methods.copy()
    let methodAllowed = !(methods.length > 0)
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      if (methods[i].selector === method) {
        methodAllowed = true
        break
      }
    }

    const p = this.plugins(key).value.copy()
    return (
      p.lastValidRound.native >= Global.round &&
      Global.round - p.lastCalled.native >= p.cooldown.native &&
      methodAllowed
    )
  }

  private txnRekeysBack(txn: gtxn.Transaction): boolean {
    if (txn.sender === Global.currentApplicationAddress && txn.rekeyTo === Global.currentApplicationAddress) {
      return true
    }

    return (
      txn.type === TransactionType.ApplicationCall &&
      txn.appId === Global.currentApplicationId &&
      txn.numAppArgs === 1 &&
      txn.onCompletion === OnCompleteAction.NoOp &&
      txn.appArgs(0) === arc4.methodSelector('arc58_verifyAuthAddr()void')
    )
  }

  private assertRekeysBack(): void {
    let rekeysBack = false
    for (let i: uint64 = Txn.groupIndex + 1; i < Global.groupSize; i += 1) {
      const txn = gtxn.Transaction(i)

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true
        break
      }
    }

    assert(rekeysBack, 'rekey back not found')
  }

  private pluginCheck(key: arc4PluginsKey): PluginValidation {
    const exists = this.plugins(key).exists
    if (!exists) {
      return {
        exists: false,
        expired: true,
        hasCooldown: true,
        onCooldown: true,
        hasMethodRestrictions: false,
        valid: false,
      }
    }

    const expired = Global.round > this.plugins(key).value.lastValidRound.native
    const hasCooldown = this.plugins(key).value.cooldown.native > 0
    const onCooldown =
      Global.round - this.plugins(key).value.lastCalled.native < this.plugins(key).value.cooldown.native
    const hasMethodRestrictions = this.plugins(key).value.methods.length > 0

    const valid = exists && !expired && !onCooldown

    return {
      exists,
      expired,
      hasCooldown,
      onCooldown,
      hasMethodRestrictions,
      valid,
    }
  }

  private fullPluginCheck(
    key: arc4PluginsKey,
    txn: gtxn.ApplicationCallTxn,
    app: Application,
    caller: Account,
    methodOffsets: DynamicArray<UintN64>,
    methodIndex: uint64
  ): FullPluginValidation {
    const check = this.pluginCheck(key)

    if (!check.valid) {
      return {
        ...check,
        methodAllowed: false,
        methodHasCooldown: true,
        methodOnCooldown: true,
      }
    }

    let methodCheck: MethodValidation = {
      methodAllowed: !check.hasMethodRestrictions,
      methodHasCooldown: false,
      methodOnCooldown: false,
    }

    if (check.hasMethodRestrictions) {
      assert(methodIndex < methodOffsets.length, 'malformed methodOffsets')
      methodCheck = this.methodCheck(txn, app, caller, methodOffsets[methodIndex].native)
    }

    return {
      ...check,
      ...methodCheck,
      valid: check.valid && methodCheck.methodAllowed,
    }
  }

  /**
   * Guarantee that our txn group is valid in a single loop over all txns in the group
   *
   * @param app the plugin app id being validated
   * @param methodOffsets the indices of the methods being used in the group
   */
  private assertValidGroup(plugin: Application, methodOffsets: DynamicArray<UintN64>) {
    const gKey = new arc4PluginsKey({
      application: new UintN64(plugin.id),
      allowedCaller: new Address(Global.zeroAddress),
    })

    const globalCheck = this.pluginCheck(gKey)

    const lKey = new arc4PluginsKey({
      application: new UintN64(plugin.id),
      allowedCaller: new Address(Txn.sender),
    })

    const localCheck = this.pluginCheck(lKey)

    assert(globalCheck.exists || localCheck.exists, 'plugin not found')
    assert(!globalCheck.expired || !localCheck.expired, 'plugin expired')
    assert(!globalCheck.onCooldown || !localCheck.onCooldown, 'plugin on cooldown')
    /**
     * full assertion to ensure we dont intermix global & local plugin permissions
     * the checks above this are there for returning early with granular error messages
     */
    assert(globalCheck.valid || localCheck.valid, 'invalid plugin call')

    let rekeysBack = false
    let methodIndex: uint64 = 0

    for (let i: uint64 = Txn.groupIndex + 1; i < Global.groupSize; i += 1) {
      const txn = gtxn.Transaction(i)

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true
        break
      }

      if (txn.type !== TransactionType.ApplicationCall) {
        continue
      }

      assert(txn.appId.id === plugin.id, 'cannot call other apps during plugin rekey')
      assert(txn.onCompletion === OnCompleteAction.NoOp, 'invalid onComplete')
      // ensure the first arg to a method call is the app id itself
      // index 1 is used because arg[0] is the method selector
      assert(txn.numAppArgs > 1, 'no app id provided')
      assert(Application(btoi(txn.appArgs(1))) === Global.currentApplicationId, 'wrong app id')

      const globalLoopCheck = this.fullPluginCheck(
        gKey,
        txn,
        plugin,
        Global.zeroAddress,
        methodOffsets,
        methodIndex
      )

      const localLoopCheck = this.fullPluginCheck(lKey, txn, plugin, Txn.sender, methodOffsets, methodIndex)

      assert(!globalLoopCheck.methodOnCooldown || !localLoopCheck.methodOnCooldown, 'method on cooldown')
      assert(globalLoopCheck.valid || localLoopCheck.valid, 'not allowed')

      // default to using global if both are valid
      // due to plugins having cooldowns we want to
      // properly attribute which is being used
      // in the case of both being allowed we default to global
      if (globalLoopCheck.valid && globalLoopCheck.hasCooldown) {
        this.plugins(gKey).value = new arc4PluginInfo({
          ...this.plugins(gKey).value,
          lastCalled: new UintN64(Global.round),
          methods: this.plugins(gKey).value.methods.copy(),
        })
      } else if (localLoopCheck.valid && localLoopCheck.hasCooldown) {
        this.plugins(lKey).value = new arc4PluginInfo({
          ...this.plugins(lKey).value,
          lastCalled: new UintN64(Global.round),
          methods: this.plugins(lKey).value.methods.copy(),
        })
      }

      methodIndex += 1
    }

    assert(rekeysBack, 'no rekey back found')
  }

  /**
   * Checks if the method call is allowed
   *
   * @param txn the transaction being validated
   * @param app the plugin app id being validated
   * @param caller the address that triggered the plugin or global address
   * @param offset the index of the method being used
   * @returns whether the method call is allowed
   */
  private methodCheck(txn: gtxn.ApplicationCallTxn, app: Application, caller: Account, offset: uint64): MethodValidation {
    assert(len(txn.appArgs(0)) === 4, 'invalid method signature length')
    const selectorArg = new arc4.StaticBytes<4>(txn.appArgs(0))

    const key = new arc4PluginsKey({ application: new UintN64(app.id), allowedCaller: new Address(caller) })

    const methods = this.plugins(key).value.methods.copy()
    const allowedMethod = methods[offset].copy()

    const hasCooldown = allowedMethod.cooldown.native > 0
    const onCooldown = Global.round - allowedMethod.lastCalled.native < allowedMethod.cooldown.native

    if (allowedMethod.selector === selectorArg && (!hasCooldown || !onCooldown)) {
      // update the last called round for the method
      if (hasCooldown) {
        methods[offset].lastCalled = new UintN64(Global.round)
        this.plugins(key).value = new arc4PluginInfo({
          ...this.plugins(key).value,
          methods: methods.copy(),
        })
      }

      return {
        methodAllowed: true,
        methodHasCooldown: hasCooldown,
        methodOnCooldown: onCooldown,
      }
    }

    return {
      methodAllowed: false,
      methodHasCooldown: true,
      methodOnCooldown: true,
    }
  }

  /**
   * What the value of this.address.value.authAddr should be when this.controlledAddress
   * is able to be controlled by this app. It will either be this.app.address or zeroAddress
   */
  private getAuthAddr(): Account {
    return this.controlledAddress.value === Global.currentApplicationAddress
      ? Global.zeroAddress // contract controls itself
      : Global.currentApplicationAddress // contract controls a different account
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
  createApplication(
    version: string,
    controlledAddress: Address,
    admin: Address,
    revocationApp: uint64,
    nickname: string
  ) {
    assert(Global.callerApplicationId !== 0, ERR_BAD_DEPLOYER)
    assert(admin !== controlledAddress)

    this.version.value = version
    this.controlledAddress.value =
      controlledAddress.native === Global.zeroAddress
        ? Global.currentApplicationAddress
        : controlledAddress.native
    this.admin.value = admin.native
    this.revocationApp.value = Application(revocationApp)
    this.nickname.value = nickname
    this.factoryApp.value = Application(Global.callerApplicationId)
  }

  /**
   *
   * @param version the version of the wallet
   */
  @abimethod({ allowActions: ['UpdateApplication'] })
  updateApplication(version: string): void {
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
    // verifyTxn(this.txn, { sender: this.admin.value });
    assert(this.isAdmin(), 'Sender must be the admin')
    this.admin.value = newAdmin.native
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
    // verifyTxn(this.txn, { sender: Application(plugin.native).address });
    assert(Txn.sender === Application(plugin).address, 'Sender must be the plugin')
    assert(
      this.controlledAddress.value.authAddress === Application(plugin).address,
      'This plugin is not in control of the account'
    )

    const key = pluginsKey(plugin, allowedCaller)

    assert(
      this.plugins(key).exists && this.plugins(key).value.adminPrivileges.native,
      'This plugin does not have admin privileges'
    )

    this.admin.value = newAdmin.native
  }

  /**
   * Verify the abstracted account is rekeyed to this app
   */
  arc58_verifyAuthAddr(): void {
    assert(this.controlledAddress.value.authAddress === this.getAuthAddr())
  }

  /**
   * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
   *
   * @param addr The address to rekey to
   * @param flash Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call
   */
  arc58_rekeyTo(address: Address, flash: boolean): void {
    // verifyAppCallTxn(this.txn, { sender: this.admin.value });
    assert(this.isAdmin(), 'Sender must be the admin')

    itxn.payment({
      sender: this.controlledAddress.value,
      receiver: address.native,
      rekeyTo: address.native,
      note: 'rekeying abstracted account',
      fee: 0,
    }).submit()

    if (flash) this.assertRekeysBack()
  }

  /**
   * check whether the plugin can be used
   *
   * @param plugin the plugin to be rekeyed to
   * @param address the address that triggered the plugin
   * @returns whether the plugin can be called via txn sender or globally
   */
  @abimethod({ readonly: true })
  arc58_canCall(plugin: uint64, caller: Address, method: StaticBytes<4>): boolean {
    const globalAllowed = this.pluginCallAllowed(pluginsKey(plugin, caller), method)
    if (globalAllowed) return true

    return this.pluginCallAllowed(pluginsKey(plugin, caller), method)
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
  arc58_rekeyToPlugin(plugin: uint64, methodOffsets: DynamicArray<UintN64>): void {
    this.assertValidGroup(Application(plugin), methodOffsets)

    itxn.payment({
      sender: this.controlledAddress.value,
      receiver: this.controlledAddress.value,
      rekeyTo: Application(plugin).address,
      note: 'rekeying to plugin app',
      fee: 0,
    }).submit()
  }

  /**
   * Temporarily rekey to a named plugin app address
   *
   * @param name The name of the plugin to rekey to
   * @param methodOffsets The indices of the methods being used in the group
   * if the plugin has method restrictions these indices are required to match
   * the methods used on each subsequent call to the plugin within the group
   *
   */
  arc58_rekeyToNamedPlugin(name: string, methodOffsets: DynamicArray<UintN64>): void {
    this.arc58_rekeyToPlugin(this.namedPlugins(name).value.application.native, methodOffsets)
  }

  /**
   * Add an app to the list of approved plugins
   *
   * @param app The app to add
   * @param allowedCaller The address of that's allowed to call the app
   * or the global zero address for all addresses
   * @param lastValidRound The round when the permission expires
   * @param cooldown  The number of rounds that must pass before the plugin can be called again
   * @param adminPrivileges Whether the plugin has permissions to change the admin account
   * @param methods The methods that are allowed to be called for the plugin by the address
   *
   */
  arc58_addPlugin(
    app: uint64,
    allowedCaller: Address,
    lastValidRound: uint64,
    cooldown: uint64,
    adminPrivileges: boolean,
    methods: MethodRestriction[]
  ): void {
    assert(this.isAdmin(), 'Sender must be the admin')
    const key = pluginsKey(app, allowedCaller)

    const methodInfos = new arc4.DynamicArray<arc4MethodInfo>()
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push(
        new arc4MethodInfo({
          selector: methods[i].selector,
          cooldown: new UintN64(methods[i].cooldown),
          lastCalled: new UintN64(),
        })
      )
    }

    this.plugins(key).value = new arc4PluginInfo({
      lastValidRound: new UintN64(lastValidRound),
      cooldown: new UintN64(cooldown),
      lastCalled: new UintN64(),
      adminPrivileges: new arc4.Bool(adminPrivileges),
      methods: methodInfos.copy(),
    })
  }

  /**
   * Assign a domain to a passkey
   *
   * @param caller The address of the passkey
   * @param domain The domain to assign to the passkey
   */
  assignDomain(caller: Address, domain: string): void {
    assert(this.isAdmin(), ERR_ONLY_ADMIN_CAN_ADD_PLUGIN)
    this.domainKeys(new Address(caller.native)).value = domain
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
    assert(this.isAdmin() || this.canRevoke(), 'Sender must be the admin')

    const key = pluginsKey(app, allowedCaller)
    assert(this.plugins(key).exists, 'plugin does not exist')
    this.plugins(key).delete()
  }

  /**
   * Add a named plugin
   *
   * @param name The plugin name
   * @param app The plugin app
   * @param allowedCaller The address of that's allowed to call the app
   * or the global zero address for all addresses
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
    lastValidRound: uint64,
    cooldown: uint64,
    adminPrivileges: boolean,
    methods: MethodRestriction[]
  ): void {
    assert(this.isAdmin(), 'Sender must be the admin')
    assert(!this.namedPlugins(name).exists)

    const key = pluginsKey(app, allowedCaller)
    this.namedPlugins(name).value = key.copy()

    const methodInfos = new arc4.DynamicArray<arc4MethodInfo>()
    for (let i: uint64 = 0; i < methods.length; i += 1) {
      methodInfos.push(
        new arc4MethodInfo({
          selector: methods[i].selector,
          cooldown: new UintN64(methods[i].cooldown),
          lastCalled: new UintN64(),
        })
      )
    }

    this.plugins(key).value = new arc4PluginInfo({
      lastValidRound: new UintN64(lastValidRound),
      cooldown: new UintN64(cooldown),
      lastCalled: new UintN64(),
      adminPrivileges: new arc4.Bool(adminPrivileges),
      methods: methodInfos.copy(),
    })
  }

  /**
   * Remove a named plugin
   *
   * @param name The plugin name
   *
   */
  arc58_removeNamedPlugin(name: string): void {
    // verifyTxn(this.txn, { sender: this.admin.value });
    assert(this.isAdmin() || this.canRevoke(), 'Sender must be the admin')
    assert(this.namedPlugins(name).exists, 'plugin does not exist')
    const app = this.namedPlugins(name).value.copy()
    assert(this.plugins(app).exists, 'plugin does not exist')

    this.namedPlugins(name).delete()
    this.plugins(app).delete()
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
        fee: 0
      }).returnValue

      amounts = [...amounts, (amount + escrowInfo.hard + escrowInfo.lock)]
    }

    return amounts
  }
}
