import { Contract } from '@algorandfoundation/tealscript';
import { AkitaDomain } from '../../utils/constants';

const errs = {
  ADMIN_CANNOT_BE_CONTROLLED: 'Admin and controlled address cannot be the same',
  BAD_DEPLOYER: 'This contract must be deployed from a factory',
  ONLY_ADMIN_CAN_UPDATE: 'Only an admin can update the application',
  ONLY_ADMIN_CAN_CHANGE_REVOKE: 'Only an admin can change the revocation app',
  ONLY_ADMIN_CAN_CHANGE_ADMIN: 'Only an admin can change the admin account',
  ONLY_ADMIN_CAN_REKEY: 'Only an admin can rekey the account',
  ONLY_ADMIN_CAN_ADD_PLUGIN: 'Only an admin can add a plugin',
  ONLY_ADMIN_CAN_ADD_METHOD_RESTRICTION: 'Only an admin can add a method restriction',
  ONLY_ADMIN_CAN_CHANGE_NICKNAME: 'Only an admin can change the nickname',
  DOES_NOT_HOLD_ASSET: 'The account does not hold the asset',
  NAMED_PLUGIN_ALREADY_EXISTS: 'A plugin with this name already exists',
  ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN: 'Only an admin or revocation app can remove plugins',
  ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_METHOD_RESTRICTION: 'Only an admin or revocation app can remove method restrictions',
  SENDER_NOT_ALLOWED_TO_CALL_PLUGIN: 'This sender is not allowed to trigger this plugin',
  PLUGIN_DOES_NOT_CONTROL_WALLET: 'This plugin is not in control of the account',
  PLUGIN_DOES_NOT_HAVE_ADMIN_PRIVILEGES: 'This plugin does not have admin privileges',
  DOMAIN_MUST_BE_LONGER_THAN_ZERO: 'Domain must not be length 0',
  PLUGIN_DOES_NOT_EXIST: 'Plugin does not exist',
  METHOD_DOES_NOT_EXIST: 'Method does not exist',
  METHOD_ALREADY_EXISTS: 'Method already exists',
}

export type PluginsKey = {
  /** The application containing plugin logic */
  application: AppID;
  /** The address that is allowed to initiate a rekey to the plugin */
  allowedCaller: Address;
};

export type PluginInfo = {
  /** The last round at which this plugin can be called */
  lastValidRound: uint64;
  /** The number of rounds that must pass before the plugin can be called again */
  cooldown: uint64;
  /** The last round the plugin was called */
  lastCalled: uint64;
  /** Whether the plugin has permissions to change the admin account */
  adminPrivileges: boolean;
  /** The methods that are allowed to be called for the plugin by the address */
  methods: bytes<4>[];
};

export type CallerUsed = {
  global: boolean;
  local: boolean;
};

export class AbstractedAccount extends Contract {
  /** Target AVM 10 */
  programVersion = 10;

  /** the version number of the wallet */
  version = GlobalStateKey<string>({ key: 'version' });

  /** the application ID for the contract that deployed this wallet */
  factoryApp = GlobalStateKey<AppID>({ key: 'factory_app_id' })

  /** The admin of the abstracted account. This address can add plugins and initiate rekeys */
  admin = GlobalStateKey<Address>({ key: 'admin' });

  /** The app that can revoke plugins */
  revocationApp = GlobalStateKey<AppID>({ key: 'revocation_app_id' });

  /** A user defined nickname for their wallet */
  nickname = GlobalStateKey<string>({ key: 'nickname' });
  /** A user defined NFT to display as their avatar that the user owns */
  avatar = GlobalStateKey<AssetID>({ key: 'avatar' });
  /** A user defined NFT to display as their banner that the user owns */
  banner = GlobalStateKey<AssetID>({ key: 'banner' });
  /** A user defined description */
  bio = GlobalStateKey<string>({ key: 'bio' });

  /**
   * Plugins that add functionality to the contract wallet and the account that has permission to use it.
   */
  plugins = BoxMap<PluginsKey, PluginInfo>({ prefix: 'p', dynamicSize: true });

  /**
   * Passkeys on the account and their corresponding domain names
   * address : domain
   * IMPORTANT: a passkey attached to the akita domain is a co-admin passkey
   * we explicitly have this feature so that the wallet can be used on multiple devices 
   * where the admin passkey may be incompatible
   * we track this onchain so we can assist with 'sign-in from another device' functionality
   * as well as uses like DAO based domain revocation
   */
  domainKeys = BoxMap<Address, string>();

  /**
   * Plugins that have been given a name for discoverability
   */
  namedPlugins = BoxMap<bytes, PluginsKey>({ prefix: 'n' });

  /**
   * 
   * @returns whether or not the caller is an admin on the wallet
   */
  private isAdmin(): boolean {
    return (
      this.txn.sender === this.admin.value ||
      this.domainKeys(this.txn.sender).exists &&
      this.domainKeys(this.txn.sender).value == AkitaDomain
    );
  }

  /**
   * 
   * @returns whether the caller is the revocation app address
   */
  private canRevoke(): boolean {
    return this.txn.sender === this.revocationApp.value.address
  }

  private assertPluginCallAllowed(app: AppID, caller: Address): void {
    const key: PluginsKey = { application: app, allowedCaller: caller };

    assert(this.plugins(key).exists, 'plugin does not exist');
    assert(this.plugins(key).value.lastValidRound >= globals.round, 'plugin is expired');
    assert(
      globals.round - this.plugins(key).value.lastCalled >= this.plugins(key).value.cooldown,
      'plugin is on cooldown'
    );
  }

  private pluginCallAllowed(app: AppID, caller: Address): boolean {
    const key: PluginsKey = { application: app, allowedCaller: caller };

    return (
      this.plugins(key).exists &&
      this.plugins(key).value.lastValidRound >= globals.round &&
      globals.round - this.plugins(key).value.lastCalled >= this.plugins(key).value.cooldown
    );
  }

  private txnRekeysBack(txn: Txn): boolean {
    if (txn.sender === this.app.address && txn.rekeyTo === this.app.address) {
      return true;
    }

    return (
      txn.typeEnum === TransactionType.ApplicationCall &&
      txn.applicationID === this.app &&
      txn.numAppArgs === 1 &&
      txn.onCompletion === 0 &&
      txn.applicationArgs[0] === method('arc58_verifyAuthAddr()void')
    )
  }

  private assertRekeysBack(): void {
    let rekeysBack = false;
    for (let i = (this.txn.groupIndex + 1); i < this.txnGroup.length; i += 1) {
      const txn = this.txnGroup[i];

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true;
      }
    }

    assert(rekeysBack, 'rekey back not found');
  }

  /**
   * Guarantee that our txn group is valid in a single loop over all txns in the group
   * 
   * @param app the plugin app id being validated
   * @param checkGlobal whether to check the global caller for method restrictions
   * @param checkLocal whether to check the local caller for method restrictions
   */
  private assertValidGroup(app: AppID, methodOffsets: uint64[], checkGlobal: boolean, checkLocal: boolean): CallerUsed {
    const gkey: PluginsKey = { application: app, allowedCaller: Address.zeroAddress };
    const key: PluginsKey = { application: app, allowedCaller: this.txn.sender };

    // whether restrictions are applicable and applied to the plugin calls in the group
    const globalRestrictions = checkGlobal && this.plugins(gkey).value.methods.length > 0;
    const localRestrictions = checkLocal && this.plugins(key).value.methods.length > 0;
    
    let rekeysBack = false;
    let methodIndex = 0;
    // caller used is used to track which caller was used in the group
    // that way on the return we can properly update the lastCalled round
    // incase the plugin has a cooldown restriction
    let callerUsed: CallerUsed = {
      global: checkGlobal && !globalRestrictions,
      local: checkLocal && !localRestrictions,
    };

    for (let i = (this.txn.groupIndex + 1); i < this.txnGroup.length; i += 1) {
      const txn = this.txnGroup[i];

      if (this.txnRekeysBack(txn)) {
        rekeysBack = true;
        break;
      }

      // we dont need to check method restrictions at all if none exist
      // & skip transactions that aren't relevant
      if ((!globalRestrictions && !localRestrictions) || this.shouldSkipMethodCheck(txn, app)) {
        continue;
      }

      const globalValid = (
        checkGlobal && (
          !globalRestrictions
          || (
            methodIndex < methodOffsets.length
            && this.methodCallAllowed(txn, app, Address.zeroAddress, methodOffsets[methodIndex])
          )
        )
      );

      const localValid = (
        checkLocal && (
          !localRestrictions
          || (
            methodIndex < methodOffsets.length
            && this.methodCallAllowed(txn, app, this.txn.sender, methodOffsets[methodIndex])
          )
        )
      );

      assert(globalValid || localValid, 'method not allowed');

      // default to using global if both are valid
      // due to plugins having cooldowns we want to
      // properly attribute which is being used
      // in the case of both being allowed we default to global
      if (globalValid) {
        callerUsed.global = true;
      } else if (localValid) {
        callerUsed.local = true;
      }

      methodIndex += 1;
    }

    assert(rekeysBack, 'no rekey back found');

    return callerUsed;
  }

  private shouldSkipMethodCheck(txn: Txn, app: AppID): boolean {
    if (
      // ignore non-application calls
      txn.typeEnum !== TransactionType.ApplicationCall ||
      // ignore calls to other applications
      (txn.applicationID !== app && txn.applicationID !== this.app) ||
      // ignore rekey back assert app call
      this.txnRekeysBack(txn)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Checks if the method call is allowed
   * 
   * @param txn the transaction being validated
   * @param app the plugin app id being validated
   * @param caller the address that triggered the plugin or global address
   * @param offset the starting index of the method in the txn
   * @returns whether the method call is allowed
   */
  private methodCallAllowed(txn: Txn, app: AppID, caller: Address, offset: uint64): boolean {
    assert(txn.numAppArgs > 0, 'no method signature provided');
    assert(len(txn.applicationArgs[0]) === 4, 'invalid method signature length');

    const key: PluginsKey = {
      application: app,
      allowedCaller: caller,
    };

    const methods = this.plugins(key).value.methods;
    const allowedMethod = methods[offset];

    if (allowedMethod === txn.applicationArgs[0] as bytes<4>) {
      return false;
    }

    return true;
  }

  /**
   * Create an abstracted account application.
   * This is not part of ARC58 and implementation specific.
   *
   * @param version The version of the abstracted account application
   * @param admin The address of the admin for this application
   * @param revocationApp The application ID of the revocation app associated with this abstracted account
   * @param nickname A user-friendly name for this abstracted account
   */
  createApplication(
    version: string,
    admin: Address,
    revocationApp: AppID,
    nickname: string,
  ): void {
    assert(globals.callerApplicationID !== AppID.fromUint64(0), errs.BAD_DEPLOYER)

    this.version.value = version;
    this.admin.value = admin;
    this.revocationApp.value = revocationApp;
    this.nickname.value = nickname;
    this.factoryApp.value = globals.callerApplicationID
  }

  @allow.call("UpdateApplication")
  updateApplication(version: string): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_UPDATE);
    this.version.value = version;
  }

  /**
   * Changes the revocation app associated with the contract
   * 
   * @param newRevocationApp the new revocation app
   */
  changeRevocationApp(newRevocationApp: AppID): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_REVOKE);
    this.revocationApp.value = newRevocationApp;
  }

  /**
   * Changes the nickname of the wallet
   * 
   * @param nickname the new nickname of the wallet
   */
  setNickname(nickname: string): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    this.nickname.value = nickname;
  }

  /**
   * Changes the avatar of the wallet
   * 
   * @param avatar the new avatar of the wallet
   */
  setAvatar(avatar: AssetID): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    assert(this.app.address.assetBalance(avatar) > 0, errs.DOES_NOT_HOLD_ASSET);
    this.avatar.value = avatar;
  }

  /**
   * Changes the banner of the wallet
   * 
   * @param banner the new banner of the wallet
   */
  setBanner(banner: AssetID): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    assert(this.app.address.assetBalance(banner) > 0, errs.DOES_NOT_HOLD_ASSET);
    this.banner.value = banner;
  }

  /**
   * Changes the bio of the wallet
   * 
   * @param bio the new bio of the wallet
   */
  setBio(bio: string): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_NICKNAME)
    this.bio.value = bio;
  }

  /**
   * Attempt to change the admin for this app. Some implementations MAY not support this.
   *
   * @param newAdmin The new admin
   */
  arc58_changeAdmin(newAdmin: Address): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_CHANGE_ADMIN);
    this.admin.value = newAdmin;
  }

  /**
   * Attempt to change the admin via plugin.
   *
   * @param plugin The app calling the plugin
   * @param allowedCaller The address that triggered the plugin
   * @param newAdmin The new admin
   * 
   */
  arc58_pluginChangeAdmin(plugin: AppID, allowedCaller: Address, newAdmin: Address): void {
    verifyTxn(this.txn, { sender: plugin.address });

    assert(this.app.address.authAddr === plugin.address, errs.PLUGIN_DOES_NOT_CONTROL_WALLET);

    const key: PluginsKey = { application: plugin, allowedCaller: allowedCaller };

    assert(this.plugins(key).exists && this.plugins(key).value.adminPrivileges, errs.PLUGIN_DOES_NOT_HAVE_ADMIN_PRIVILEGES);

    this.admin.value = newAdmin;
  }

  /**
   * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
   * because different implementations may have different ways of determining the admin.
   * @returns the default admin address
   */
  arc58_getAdmin(): Address {
    return this.admin.value;
  }

  /**
   * Verify the abstracted account is rekeyed to this app
   */
  arc58_verifyAuthAddr(): void {
    assert(this.app.address.authAddr === globals.zeroAddress);
  }

  /**
   * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
   *
   * @param addr The address to rekey to
   * @param flash Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call
   */
  arc58_rekeyTo(addr: Address, flash: boolean): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_REKEY);

    sendPayment({
      receiver: addr,
      rekeyTo: addr,
      fee: 0,
    });

    if (flash) this.assertRekeysBack();
  }

  /**
   * check whether the plugin can be used
   * 
   * @param plugin the plugin to be rekeyed to
   * @returns whether the plugin can be called via txn sender or globally
   */
  @abi.readonly
  arc58_canCall(plugin: AppID, address: Address): boolean {
    const globalAllowed = this.pluginCallAllowed(plugin, Address.zeroAddress);
    if (globalAllowed)
      return true;

    return this.pluginCallAllowed(plugin, address);
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
  arc58_rekeyToPlugin(plugin: AppID, methodOffsets: uint64[]): void {
    const globalExists = this.plugins({ application: plugin, allowedCaller: Address.zeroAddress }).exists;
    const localExists = this.plugins({ application: plugin, allowedCaller: this.txn.sender }).exists;

    let globallyAllowed = false;
    let locallyAllowed = false;

    if (globalExists) {
      globallyAllowed = this.pluginCallAllowed(plugin, Address.zeroAddress);
    }

    if (localExists) {
      locallyAllowed = this.pluginCallAllowed(plugin, this.txn.sender);
    }

    // if the plugin does not exist or is not allowed by either the global or local caller
    // then the call is not allowed, assert check so we error out cleanly
    if (
      (!globalExists && !localExists)
      || (globalExists && !globallyAllowed && !locallyAllowed)
    ) {
      this.assertPluginCallAllowed(plugin, Address.zeroAddress);
    } else if (localExists && !locallyAllowed && !globallyAllowed) {
      this.assertPluginCallAllowed(plugin, this.txn.sender);
    }

    const used = this.assertValidGroup(plugin, methodOffsets, globallyAllowed, locallyAllowed);

    sendPayment({
      receiver: this.app.address,
      rekeyTo: plugin.address,
      note: 'rekeying to plugin app',
      fee: 0,
    });

    if (used.global) {
      this.plugins({
        application: plugin,
        allowedCaller: Address.zeroAddress
      }).value.lastCalled = globals.round;
    }

    if (used.local) {
      this.plugins({
        application: plugin,
        allowedCaller: this.txn.sender
      }).value.lastCalled = globals.round;
    }
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
  arc58_rekeyToNamedPlugin(name: string, methodOffsets: uint64[]): void {
    this.arc58_rekeyToPlugin(this.namedPlugins(name).value.application, methodOffsets);
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
    app: AppID,
    allowedCaller: Address,
    lastValidRound: uint64,
    cooldown: uint64,
    adminPrivileges: boolean,
    methods: bytes<4>[],
  ): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_ADD_PLUGIN);
    const key: PluginsKey = { application: app, allowedCaller: allowedCaller };

    this.plugins(key).value = {
      lastValidRound: lastValidRound,
      cooldown: cooldown,
      lastCalled: 0,
      adminPrivileges: adminPrivileges,
      methods: methods,
    };
  }

  /**
   * Assign a domain to a passkey
   *
   * @param caller The address of the passkey
   * @param domain The domain to assign to the passkey
   */
  assignDomain(caller: Address, domain: string): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_ADD_PLUGIN);
    this.domainKeys(caller).value = domain;
  }

  /**
   * Remove an app from the list of approved plugins
   *
   * @param app The app to remove
   */
  arc58_removePlugin(app: AppID, allowedCaller: Address): void {
    assert(this.isAdmin() || this.canRevoke(), errs.ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN);

    const key: PluginsKey = { application: app, allowedCaller: allowedCaller };

    assert(this.plugins(key).exists, 'plugin does not exist');

    this.plugins(key).delete();
  }

  /**
   * Add a named plugin
   *
   * @param app The plugin app
   * @param name The plugin name
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
    app: AppID,
    allowedCaller: Address,
    lastValidRound: uint64,
    cooldown: uint64,
    adminPrivileges: boolean,
    methods: bytes<4>[],
  ): void {
    assert(this.isAdmin(), errs.ONLY_ADMIN_CAN_ADD_PLUGIN);
    assert(!this.namedPlugins(name).exists, errs.NAMED_PLUGIN_ALREADY_EXISTS);

    const key: PluginsKey = { application: app, allowedCaller: allowedCaller };
    this.namedPlugins(name).value = key;

    const pluginInfo: PluginInfo = {
      lastValidRound: lastValidRound,
      cooldown: cooldown,
      lastCalled: 0,
      adminPrivileges: adminPrivileges,
      methods: methods,
    };

    this.plugins(key).value = pluginInfo
  }

  /**
   * Remove a named plugin
   *
   * @param name The plugin name
   * 
   */
  arc58_removeNamedPlugin(name: string): void {
    assert(this.isAdmin() || this.canRevoke(), errs.ONLY_ADMIN_OR_REVOCATION_APP_CAN_REMOVE_PLUGIN);

    assert(this.namedPlugins(name).exists, 'plugin does not exist');
    const app = this.namedPlugins(name).value;
    assert(this.plugins(app).exists, 'plugin does not exist');

    this.namedPlugins(name).delete();
    this.plugins(app).delete();
  }
}
