import { getArc56ReturnValue, getABIStructFromABITuple } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "AbstractedAccount", "structs": { "AbstractAccountBoxMBRData": [{ "name": "plugins", "type": "uint64" }, { "name": "namedPlugins", "type": "uint64" }, { "name": "escrows", "type": "uint64" }, { "name": "allowances", "type": "uint64" }, { "name": "executions", "type": "uint64" }, { "name": "domainKeys", "type": "uint64" }, { "name": "escrowExists", "type": "bool" }, { "name": "newEscrowMintCost", "type": "uint64" }], "AllowanceInfo": [{ "name": "type", "type": "uint8" }, { "name": "max", "type": "uint64" }, { "name": "amount", "type": "uint64" }, { "name": "spent", "type": "uint64" }, { "name": "interval", "type": "uint64" }, { "name": "last", "type": "uint64" }, { "name": "start", "type": "uint64" }, { "name": "useRounds", "type": "bool" }], "AllowanceKey": [{ "name": "escrow", "type": "string" }, { "name": "asset", "type": "uint64" }], "EscrowInfo": [{ "name": "id", "type": "uint64" }, { "name": "locked", "type": "bool" }], "ExecutionInfo": [{ "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "PluginInfo": [{ "name": "escrow", "type": "uint64" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64,uint64)[]" }, { "name": "admin", "type": "bool" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "canReclaim", "type": "bool" }, { "name": "lastCalled", "type": "uint64" }, { "name": "start", "type": "uint64" }], "PluginKey": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version", "desc": "The version of the abstracted account application" }, { "type": "address", "name": "controlledAddress", "desc": "The address of the abstracted account. If zeroAddress, then the address of the contract account will be used" }, { "type": "address", "name": "admin", "desc": "The address of the admin for this application" }, { "type": "string", "name": "domain", "desc": "The domain associated with the admin account" }, { "type": "uint64", "name": "escrowFactory", "desc": "The app ID of the escrow factory to use for creating escrows" }, { "type": "uint64", "name": "revocationApp", "desc": "The app ID of the revocation app associated with this abstracted account" }, { "type": "string", "name": "nickname", "desc": "A user-friendly name for this abstracted account" }, { "type": "address", "name": "referrer", "desc": "The address that referred the creation of this wallet" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Create an abstracted account application.\nThis is not part of ARC58 and implementation specific.", "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "string", "name": "escrow", "desc": "The name of the escrow to register, or empty string for the main account" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Register the abstracted account with the escrow factory.\nThis allows apps to correlate the account with the app without needing\nit to be explicitly provided.", "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "version", "desc": "the version of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "setDomain", "args": [{ "type": "string", "name": "domain", "desc": "The domain to associate with the admin account" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Set the domain associated with the admin account", "events": [], "recommendations": {} }, { "name": "setRevocationApp", "args": [{ "type": "uint64", "name": "app", "desc": "The app ID of the new revocation app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the revocation app associated with the contract", "events": [], "recommendations": {} }, { "name": "setNickname", "args": [{ "type": "string", "name": "nickname", "desc": "the new nickname of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the nickname of the wallet", "events": [], "recommendations": {} }, { "name": "setAvatar", "args": [{ "type": "uint64", "name": "avatar", "desc": "the new avatar of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the avatar of the wallet", "events": [], "recommendations": {} }, { "name": "setBanner", "args": [{ "type": "uint64", "name": "banner", "desc": "the new banner of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the banner of the wallet", "events": [], "recommendations": {} }, { "name": "setBio", "args": [{ "type": "string", "name": "bio", "desc": "the new bio of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the bio of the wallet", "events": [], "recommendations": {} }, { "name": "arc58_changeAdmin", "args": [{ "type": "address", "name": "newAdmin", "desc": "The new admin" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Attempt to change the admin for this app. Some implementations MAY not support this.", "events": [], "recommendations": {} }, { "name": "arc58_pluginChangeAdmin", "args": [{ "type": "address", "name": "newAdmin", "desc": "The new admin" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Attempt to change the admin via plugin.", "events": [], "recommendations": {} }, { "name": "arc58_verifyAuthAddress", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Verify the abstracted account is rekeyed to this app", "events": [], "recommendations": {} }, { "name": "arc58_rekeyTo", "args": [{ "type": "address", "name": "address", "desc": "The address to rekey to" }, { "type": "bool", "name": "flash", "desc": "Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.", "events": [], "recommendations": {} }, { "name": "arc58_canCall", "args": [{ "type": "uint64", "name": "plugin", "desc": "The app ID of the plugin to check" }, { "type": "bool", "name": "global", "desc": "Whether to check the global (zero address) caller" }, { "type": "address", "name": "address", "desc": "The address that will trigger the plugin" }, { "type": "string", "name": "escrow", "desc": "The escrow associated with the plugin" }, { "type": "byte[4]", "name": "method", "desc": "The method selector being called on the plugin" }], "returns": { "type": "bool", "desc": "Whether the plugin can be called with these parameters" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Check whether the plugin can be used", "events": [], "recommendations": {} }, { "name": "arc58_rekeyToPlugin", "args": [{ "type": "uint64", "name": "plugin", "desc": "The app ID of the plugin to rekey to" }, { "type": "bool", "name": "global", "desc": "Whether the plugin is callable globally" }, { "type": "string", "name": "escrow", "desc": "The escrow associated with the plugin" }, { "type": "uint64[]", "name": "methodOffsets", "desc": "The indices of the methods being used in the group. If the plugin has method restrictions, these indices must match the methods used on each subsequent call to the plugin within the group" }, { "type": "(uint64,uint64)[]", "name": "fundsRequest", "desc": "If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to use during execution" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Temporarily rekey to an approved plugin app address", "events": [], "recommendations": {} }, { "name": "arc58_rekeyToNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The name of the plugin to rekey to" }, { "type": "bool", "name": "global", "desc": "Whether the plugin is callable globally" }, { "type": "string", "name": "escrow", "desc": "The escrow associated with the plugin" }, { "type": "uint64[]", "name": "methodOffsets", "desc": "The indices of the methods being used in the group. If the plugin has method restrictions, these indices must match the methods used on each subsequent call to the plugin within the group" }, { "type": "(uint64,uint64)[]", "name": "fundsRequest", "desc": "If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to use during execution" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Temporarily rekey to a named plugin app address", "events": [], "recommendations": {} }, { "name": "arc58_addPlugin", "args": [{ "type": "uint64", "name": "plugin", "desc": "The app ID of the plugin to add" }, { "type": "address", "name": "caller", "desc": "The address allowed to call the plugin, or the global zero address for any address" }, { "type": "string", "name": "escrow", "desc": "The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created" }, { "type": "bool", "name": "admin", "desc": "Whether the plugin has permissions to change the admin account" }, { "type": "uint8", "name": "delegationType", "desc": "The ownership of the delegation for last_interval updates" }, { "type": "uint64", "name": "lastValid", "desc": "The timestamp or round when the permission expires" }, { "type": "uint64", "name": "cooldown", "desc": "The number of seconds or rounds that must pass before the plugin can be called again" }, { "type": "(byte[4],uint64)[]", "name": "methods", "desc": "The methods that are allowed to be called for the plugin by the address" }, { "type": "bool", "name": "useRounds", "desc": "Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp" }, { "type": "bool", "name": "useExecutionKey", "desc": "Whether the plugin requires an execution key to be used" }, { "type": "bool", "name": "coverFees", "desc": "Whether the plugin reimburses the caller for transaction fees" }, { "type": "bool", "name": "canReclaim", "desc": "Whether the plugin is allowed to reclaim funds from escrows via arc58_pluginReclaim" }, { "type": "bool", "name": "defaultToEscrow", "desc": "Whether to use the named escrow as the default escrow (plugin key uses empty string)" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add an app to the list of approved plugins", "events": [], "recommendations": {} }, { "name": "assignDomain", "args": [{ "type": "address", "name": "caller", "desc": "The address of the passkey" }, { "type": "string", "name": "domain", "desc": "The domain to assign to the passkey" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Assign a domain to a passkey", "events": [], "recommendations": {} }, { "name": "arc58_removePlugin", "args": [{ "type": "uint64", "name": "plugin", "desc": "The app ID of the plugin to remove" }, { "type": "address", "name": "caller", "desc": "The address that was allowed to call the plugin" }, { "type": "string", "name": "escrow", "desc": "The escrow associated with the plugin" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove an app from the list of approved plugins", "events": [], "recommendations": {} }, { "name": "arc58_addNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The plugin name" }, { "type": "uint64", "name": "plugin", "desc": "The app ID of the plugin to add" }, { "type": "address", "name": "caller", "desc": "The address allowed to call the plugin, or the global zero address for any address" }, { "type": "string", "name": "escrow", "desc": "The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created" }, { "type": "bool", "name": "admin", "desc": "Whether the plugin has permissions to change the admin account" }, { "type": "uint8", "name": "delegationType", "desc": "The ownership of the delegation for last_interval updates" }, { "type": "uint64", "name": "lastValid", "desc": "The timestamp or round when the permission expires" }, { "type": "uint64", "name": "cooldown", "desc": "The number of seconds or rounds that must pass before the plugin can be called again" }, { "type": "(byte[4],uint64)[]", "name": "methods", "desc": "The methods that are allowed to be called for the plugin by the address" }, { "type": "bool", "name": "useRounds", "desc": "Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp" }, { "type": "bool", "name": "useExecutionKey", "desc": "Whether the plugin requires an execution key to be used" }, { "type": "bool", "name": "coverFees", "desc": "Whether the plugin reimburses the caller for transaction fees" }, { "type": "bool", "name": "canReclaim", "desc": "Whether the plugin is allowed to reclaim funds from escrows via arc58_pluginReclaim" }, { "type": "bool", "name": "defaultToEscrow", "desc": "Whether to use the named escrow as the default escrow (plugin key uses empty string)" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add a named plugin", "events": [], "recommendations": {} }, { "name": "arc58_removeNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The plugin name" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove a named plugin", "events": [], "recommendations": {} }, { "name": "arc58_newEscrow", "args": [{ "type": "string", "name": "escrow", "desc": "The name of the escrow to create" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Create a new escrow for the controlled address", "events": [], "recommendations": {} }, { "name": "arc58_toggleEscrowLock", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to lock or unlock" }], "returns": { "type": "(uint64,bool)", "struct": "EscrowInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Lock or Unlock an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_reclaim", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to reclaim funds from" }, { "type": "(uint64,uint64,bool)[]", "name": "reclaims", "desc": "The list of reclaims to make from the escrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Transfer funds from an escrow back to the controlled address.", "events": [], "recommendations": {} }, { "name": "arc58_pluginReclaim", "args": [{ "type": "uint64", "name": "plugin", "desc": "The plugin app ID" }, { "type": "address", "name": "caller", "desc": "The address allowed to call the plugin" }, { "type": "string", "name": "escrow", "desc": "The escrow to reclaim funds from" }, { "type": "(uint64,uint64,bool)[]", "name": "reclaims", "desc": "The list of reclaims to make from the escrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Transfer funds from an escrow back to the controlled address via a plugin / allowed caller.\nThe plugin must have canReclaim set to true. CloseOut on asset transfers is blocked when the escrow is locked.", "events": [], "recommendations": {} }, { "name": "arc58_optInEscrow", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to opt-in to" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to opt-in to" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Opt-in an escrow account to assets", "events": [], "recommendations": {} }, { "name": "arc58_pluginOptInEscrow", "args": [{ "type": "uint64", "name": "plugin", "desc": "The plugin app ID" }, { "type": "address", "name": "caller", "desc": "The address allowed to call the plugin" }, { "type": "string", "name": "escrow", "desc": "The escrow to opt-in assets for" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to opt-in to" }, { "type": "pay", "name": "mbrPayment", "desc": "The payment txn that is used to pay for the asset opt-in" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Opt-in an escrow account to assets via a plugin / allowed caller", "events": [], "recommendations": {} }, { "name": "arc58_addAllowances", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to add the allowance for" }, { "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]", "name": "allowances", "desc": "The list of allowances to add" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add an allowance for an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_removeAllowances", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to remove the allowance for" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to remove the allowance for" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove an allowances for an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_addExecutionKey", "args": [{ "type": "byte[32]", "name": "lease", "desc": "The 32-byte lease key that uniquely identifies this execution" }, { "type": "byte[32][]", "name": "groups", "desc": "The list of 32-byte group IDs that are authorized under this key" }, { "type": "uint64", "name": "firstValid", "desc": "The first round or timestamp when this key becomes valid" }, { "type": "uint64", "name": "lastValid", "desc": "The last round or timestamp when this key expires" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add or extend an execution key for pre-authorized plugin usage", "events": [], "recommendations": {} }, { "name": "arc58_removeExecutionKey", "args": [{ "type": "byte[32]", "name": "lease", "desc": "The 32-byte lease key identifying the execution to remove" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove an execution key. Can be called by admin at any time, or by anyone after the key has expired.", "events": [], "recommendations": {} }, { "name": "arc58_getAdmin", "args": [], "returns": { "type": "address" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get the admin of this app. This method SHOULD always be used rather than reading directly from state\nbecause different implementations may have different ways of determining the admin.", "events": [], "recommendations": {} }, { "name": "arc58_getPlugins", "args": [{ "type": "(uint64,address,string)[]", "name": "keys", "desc": "The plugin keys to look up" }], "returns": { "type": "(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]", "desc": "The plugin info for each key, or empty plugin info if the key does not exist" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get plugin info for a list of plugin keys", "events": [], "recommendations": {} }, { "name": "arc58_getNamedPlugins", "args": [{ "type": "string[]", "name": "names", "desc": "The plugin names to look up" }], "returns": { "type": "(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]", "desc": "The plugin info for each name, or empty plugin info if the name does not exist" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get plugin info for a list of named plugins", "events": [], "recommendations": {} }, { "name": "arc58_getEscrows", "args": [{ "type": "string[]", "name": "escrows", "desc": "The escrow names to look up" }], "returns": { "type": "(uint64,bool)[]", "desc": "The escrow info for each name, or empty escrow info if the name does not exist" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get escrow info for a list of escrow names", "events": [], "recommendations": {} }, { "name": "arc58_getAllowances", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to look up allowances for" }, { "type": "uint64[]", "name": "assets", "desc": "The asset IDs to look up allowances for" }], "returns": { "type": "(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]", "desc": "The allowance info for each asset, or empty allowance info if no allowance exists" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get allowance info for a list of assets on a given escrow", "events": [], "recommendations": {} }, { "name": "arc58_getExecutions", "args": [{ "type": "byte[32][]", "name": "leases", "desc": "The 32-byte lease keys to look up" }], "returns": { "type": "(byte[32][],uint64,uint64)[]", "desc": "The execution info for each lease, or empty execution info if the lease does not exist" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get execution key info for a list of leases", "events": [], "recommendations": {} }, { "name": "arc58_getDomainKeys", "args": [{ "type": "address[]", "name": "addresses", "desc": "The addresses to look up domain keys for" }], "returns": { "type": "string[]", "desc": "The domain string for each address, or empty string if no domain is assigned" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get domain key assignments for a list of addresses", "events": [], "recommendations": {} }, { "name": "mbr", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow name to calculate MBR for" }, { "type": "uint64", "name": "methodCount", "desc": "The number of method restrictions on the plugin" }, { "type": "string", "name": "plugin", "desc": "The plugin name to calculate named plugin MBR for" }, { "type": "uint64", "name": "groups", "desc": "The number of execution groups to calculate MBR for" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)", "struct": "AbstractAccountBoxMBRData", "desc": "The MBR costs for plugins, named plugins, escrows, allowances, domain keys, executions, and new escrow creation" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Calculate the minimum balance requirements for various box operations", "events": [], "recommendations": {} }, { "name": "balance", "args": [{ "type": "uint64[]", "name": "assets", "desc": "The asset IDs to check balances for (0 for ALGO)" }], "returns": { "type": "uint64[]", "desc": "The balance for each asset including any staked amounts" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get the balance of a set of assets in the account, including staked amounts", "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 9, "bytes": 9 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the version of the wallet contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app id of the akita DAO" }, "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=", "desc": "The admin of the abstracted account. This address can add plugins and initiate rekeys" }, "domain": { "keyType": "AVMString", "valueType": "AVMString", "key": "ZG9tYWlu", "desc": "The domain associated with the admin account of the abstracted account" }, "controlledAddress": { "keyType": "AVMString", "valueType": "address", "key": "Y29udHJvbGxlZF9hZGRyZXNz", "desc": "The address this app controls" }, "nickname": { "keyType": "AVMString", "valueType": "AVMString", "key": "bmlja25hbWU=", "desc": "A user defined nickname for their wallet" }, "avatar": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YXZhdGFy", "desc": "A user defined NFT to display as their avatar that the user owns" }, "banner": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YmFubmVy", "desc": "A user defined NFT to display as their banner that the user owns" }, "bio": { "keyType": "AVMString", "valueType": "AVMString", "key": "Ymlv", "desc": "A user defined description" }, "lastUserInteraction": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bGFzdF91c2VyX2ludGVyYWN0aW9u", "desc": "The last time the contract was interacted with in unix time" }, "lastChange": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bGFzdF9jaGFuZ2U=", "desc": "The last time state has changed on the abstracted account (not including lastCalled for cooldowns) in unix time" }, "spendingAddress": { "keyType": "AVMString", "valueType": "address", "key": "c3BlbmRpbmdfYWRkcmVzcw==", "desc": "[TEMPORARY STATE FIELD] The spending address for the currently active plugin" }, "currentPlugin": { "keyType": "AVMString", "valueType": "PluginKey", "key": "Y3VycmVudF9wbHVnaW4=", "desc": "[TEMPORARY STATE FIELD] The current plugin key being used" }, "rekeyIndex": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVrZXlfaW5kZXg=", "desc": "[TEMPORARY STATE FIELD] The index of the transaction that created the rekey sandwich" }, "escrowFactory": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZXNjcm93X2ZhY3Rvcnk=", "desc": "the spending account factory to use for allowances" }, "factoryApp": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZmFjdG9yeV9hcHA=", "desc": "the application ID for the contract that deployed this wallet" }, "revocation": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmV2b2NhdGlvbg==", "desc": "The app that can revoke plugins" }, "referrer": { "keyType": "AVMString", "valueType": "address", "key": "cmVmZXJyZXI=", "desc": "The address that created the wallet" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "plugins": { "keyType": "PluginKey", "valueType": "PluginInfo", "desc": "Plugins that add functionality to the controlledAddress and the account that has permission to use it.", "prefix": "cA==" }, "namedPlugins": { "keyType": "AVMString", "valueType": "PluginKey", "desc": "Plugins that have been given a name for discoverability", "prefix": "bg==" }, "escrows": { "keyType": "AVMString", "valueType": "EscrowInfo", "desc": "the escrows that this wallet has created for specific callers with allowances", "prefix": "ZQ==" }, "allowances": { "keyType": "AllowanceKey", "valueType": "AllowanceInfo", "desc": "The Allowances for plugins installed on the smart contract with useAllowance set to true", "prefix": "YQ==" }, "executions": { "keyType": "AVMBytes", "valueType": "ExecutionInfo", "desc": "execution keys", "prefix": "eA==" }, "domainKeys": { "keyType": "address", "valueType": "AVMString", "desc": "Passkeys on the account and their corresponding domain names\naddress : domain\nIMPORTANT: a passkey attached to the akita domain is a co-admin passkey\nwe explicitly have this feature so that the wallet can be used on multiple devices\nwhere the admin passkey may be incompatible\nwe track this onchain so we can assist with 'sign-in from another device' functionality\nas well as uses like DAO based domain revocation", "prefix": "ZA==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [6684, 6823, 6847, 6929], "errorMessage": "Allowance exceeded" }, { "pc": [3555, 4574, 4702, 4718, 4879, 5037, 5181, 5323, 5607, 5781, 6197, 6304, 6543, 6691, 6854], "errorMessage": "Box must have value" }, { "pc": [5734, 7778], "errorMessage": "Bytes has valid prefix" }, { "pc": [3283], "errorMessage": "Escrow already exists" }, { "pc": [1062, 3326, 3411, 3524, 3619, 3741, 3865, 4131], "errorMessage": "Escrow does not exist" }, { "pc": [3626, 3748, 3872, 4138], "errorMessage": "Escrow is locked" }, { "pc": [3287], "errorMessage": "Escrow name is required" }, { "pc": [7013], "errorMessage": "Execution key expired" }, { "pc": [4443, 6986], "errorMessage": "Execution key not found" }, { "pc": [6999], "errorMessage": "Execution key not ready" }, { "pc": [7074], "errorMessage": "Group not found" }, { "pc": [252], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [553], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [2440], "errorMessage": "Only an admin can add a plugin" }, { "pc": [1355], "errorMessage": "Only an admin can change the admin account" }, { "pc": [1231, 1250, 1288, 1333], "errorMessage": "Only an admin can change the nickname" }, { "pc": [1205], "errorMessage": "Only an admin can change the revocation app" }, { "pc": [1155, 1186], "errorMessage": "Only an admin can update the application" }, { "pc": [4122], "errorMessage": "Only an admin or revocation app can remove method restrictions" }, { "pc": [2541, 3147], "errorMessage": "Only an admin or revocation app can remove plugins" }, { "pc": [2571, 3157, 3171, 3506, 3733, 6513, 7092], "errorMessage": "Plugin does not exist" }, { "pc": [1263, 1301], "errorMessage": "The account does not hold the asset" }, { "pc": [943], "errorMessage": "This contract must be deployed from a factory" }, { "pc": [1451], "errorMessage": "This plugin does not have admin privileges" }, { "pc": [1429], "errorMessage": "This plugin is not in control of the account" }, { "pc": [1423, 1494, 7711], "errorMessage": "account funded" }, { "pc": [1576, 2097, 2778, 3274, 3857, 4305, 4463], "errorMessage": "admin only" }, { "pc": [1407], "errorMessage": "admin plugins cannot use escrows" }, { "pc": [4009], "errorMessage": "allowance already exists" }, { "pc": [4227, 6605], "errorMessage": "allowance does not exist" }, { "pc": [1078, 1149, 1414, 1427, 3530, 3754, 5683, 5804, 6206, 6309, 6533, 6551, 7194, 7304], "errorMessage": "application exists" }, { "pc": [7384], "errorMessage": "cannot call other apps during rekey" }, { "pc": [1074, 1146, 1385, 1420, 1487, 1498, 1506, 1581, 2264, 2275, 2444, 2455, 2949, 2960, 3188, 3199, 3784, 3876, 3887, 4142, 4153, 4487, 5626, 5637, 5667, 5679, 5759, 5786, 5801, 6003, 6211, 6349, 6384, 6411, 6720, 6758, 7187, 7299, 7647, 7726, 7739], "errorMessage": "check GlobalState exists" }, { "pc": [2114, 2808], "errorMessage": "delegation type must not be self for global plugins" }, { "pc": [2397, 3101], "errorMessage": "escrow must be set if defaultToEscrow is true" }, { "pc": [4363], "errorMessage": "execution key update must match first valid" }, { "pc": [4373], "errorMessage": "execution key update must match last valid" }, { "pc": [2206, 2900, 3938, 4201, 4543, 4669, 4847, 5003, 5164, 5306, 6333, 6577, 7694], "errorMessage": "index access is out of bounds" }, { "pc": [7463], "errorMessage": "invalid method signature length" }, { "pc": [1841, 1921], "errorMessage": "invalid number of bytes for (len+(uint64,uint64)[])" }, { "pc": [3399, 3476], "errorMessage": "invalid number of bytes for (len+(uint64,uint64,bool1)[])" }, { "pc": [3853], "errorMessage": "invalid number of bytes for (len+(uint64,uint8,uint64,uint64,uint64,bool1)[])" }, { "pc": [2038, 2714], "errorMessage": "invalid number of bytes for (len+(uint8[4],uint64)[])" }, { "pc": [1825, 1905, 3606, 3692, 4108, 4980, 5544], "errorMessage": "invalid number of bytes for (len+uint64[])" }, { "pc": [4279, 5141, 5283], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [849, 886, 924, 1042, 1130, 1179, 1224, 1326, 1721, 1807, 1861, 1887, 1975, 2433, 2524, 2607, 2645, 3130, 3267, 3311, 3380, 3452, 3588, 3666, 3828, 4087, 4959, 5382, 5407], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [7783], "errorMessage": "invalid number of bytes for (uint64,uint64)" }, { "pc": [1570, 1695, 1792, 1872, 1986, 2046, 2057, 2068, 2079, 2090, 2657, 2722, 2734, 2746, 2758, 2770], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [897, 908, 1200, 1245, 1283, 1686, 1783, 1952, 2005, 2015, 2501, 2619, 2679, 2690, 3426, 3640, 4287, 4298, 5393, 5418, 5739], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [1997, 2671], "errorMessage": "invalid number of bytes for uint8" }, { "pc": [864, 873, 940, 1351, 1380, 1562, 1708, 1962, 2420, 2511, 2632, 3439, 3653, 4261, 4434], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [1736], "errorMessage": "invalid number of bytes for uint8[4]" }, { "pc": [7389], "errorMessage": "invalid oncomplete must be no op" }, { "pc": [3796], "errorMessage": "invalid payment" }, { "pc": [7403], "errorMessage": "invalid sender app id" }, { "pc": [7395], "errorMessage": "invalid sender must be this app id" }, { "pc": [2221, 2915], "errorMessage": "invalid size" }, { "pc": [7441], "errorMessage": "malformed method offsets" }, { "pc": [2231, 2925, 4395, 4885, 4921, 5043, 5097, 7807], "errorMessage": "max array length exceeded" }, { "pc": [7593], "errorMessage": "method on cooldown" }, { "pc": [1662, 7148], "errorMessage": "missing rekey back" }, { "pc": [3318, 3403, 3514, 3552, 3610, 3776], "errorMessage": "only the creator wallet can delete a spending account" }, { "pc": [801], "errorMessage": "overflow" }, { "pc": [2171], "errorMessage": "plugin already exists" }, { "pc": [7097, 7424], "errorMessage": "plugin expired" }, { "pc": [7101, 7427], "errorMessage": "plugin on cooldown" }, { "pc": [1416], "errorMessage": "sender must be admin plugin" }, { "pc": [3704], "errorMessage": "transaction type is pay" }, { "pc": [2130, 2824], "errorMessage": "using execution key requires global plugin" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDIgOCA0MDAgMTg5MDAgMjc3MDAKICAgIGJ5dGVjYmxvY2sgImNvbnRyb2xsZWRfYWRkcmVzcyIgIiIgImUiICJwIiAibGFzdF91c2VyX2ludGVyYWN0aW9uIiAweDE1MWY3Yzc1ICJsYXN0X2NoYW5nZSIgMHgwMDAwIDB4MDAgIngiIDB4MDAyYSAic3BlbmRpbmdfYWRkcmVzcyIgMHgwMDAyICJhZG1pbiIgMHgwMSAibiIgImQiIDB4MDAwYSAiYSIgInJla2V5X2luZGV4IiAiZG9tYWluIiAiZXNjcm93X2ZhY3RvcnkiICJyZXZvY2F0aW9uIiAweDAwMDEgImN1cnJlbnRfcGx1Z2luIiAweDZjYzNmNjA2ICJ2ZXJzaW9uIiAibmlja25hbWUiICJmYWN0b3J5X2FwcCIgMHgwMDJjCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OQogICAgLy8gcmVrZXlJbmRleCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDAsIGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVrZXlJbmRleCB9KQogICAgYnl0ZWMgMTkgLy8gInJla2V5X2luZGV4IgogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyLTExOAogICAgLy8gQGNvbnRyYWN0KHsKICAgIC8vICAgc3RhdGVUb3RhbHM6IHsKICAgIC8vICAgICBnbG9iYWxCeXRlczogQWJzdHJhY3RBY2NvdW50TnVtR2xvYmFsQnl0ZXMsCiAgICAvLyAgICAgZ2xvYmFsVWludHM6IEFic3RyYWN0QWNjb3VudE51bUdsb2JhbFVpbnRzCiAgICAvLyAgIH0KICAgIC8vIH0pCiAgICAvLyBleHBvcnQgY2xhc3MgQWJzdHJhY3RlZEFjY291bnQgZXh0ZW5kcyBDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhlYTkxODBkZCAvLyBtZXRob2QgInVwZGF0ZShzdHJpbmcpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fdXBkYXRlX3JvdXRlQDQKCm1haW5fc3dpdGNoX2Nhc2VfbmV4dEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTItMTE4CiAgICAvLyBAY29udHJhY3QoewogICAgLy8gICBzdGF0ZVRvdGFsczogewogICAgLy8gICAgIGdsb2JhbEJ5dGVzOiBBYnN0cmFjdEFjY291bnROdW1HbG9iYWxCeXRlcywKICAgIC8vICAgICBnbG9iYWxVaW50czogQWJzdHJhY3RBY2NvdW50TnVtR2xvYmFsVWludHMKICAgIC8vICAgfQogICAgLy8gfSkKICAgIC8vIGV4cG9ydCBjbGFzcyBBYnN0cmFjdGVkQWNjb3VudCBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEA0NgogICAgcHVzaGJ5dGVzcyAweGJkNjA5OWU1IDB4Nzc4Nzg2N2QgMHgyZDc3MTFiNyAweDlmOTFjY2NkIDB4MTdkOGJjYjQgMHgzODU2NThhYiAweDVlZjBiNDE1IDB4ZDI0Yjc1NTYgMHgxNDdiNmNkNiAvLyBtZXRob2QgInJlZ2lzdGVyKHN0cmluZyl2b2lkIiwgbWV0aG9kICJzZXREb21haW4oc3RyaW5nKXZvaWQiLCBtZXRob2QgInNldFJldm9jYXRpb25BcHAodWludDY0KXZvaWQiLCBtZXRob2QgInNldE5pY2tuYW1lKHN0cmluZyl2b2lkIiwgbWV0aG9kICJzZXRBdmF0YXIodWludDY0KXZvaWQiLCBtZXRob2QgInNldEJhbm5lcih1aW50NjQpdm9pZCIsIG1ldGhvZCAic2V0QmlvKHN0cmluZyl2b2lkIiwgbWV0aG9kICJhcmM1OF9jaGFuZ2VBZG1pbihhZGRyZXNzKXZvaWQiLCBtZXRob2QgImFyYzU4X3BsdWdpbkNoYW5nZUFkbWluKGFkZHJlc3Mpdm9pZCIKICAgIGJ5dGVjIDI1IC8vIG1ldGhvZCAiYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3MoKXZvaWQiCiAgICBwdXNoYnl0ZXNzIDB4Yzk1YTVkM2QgMHg0NzI3YWYyMSAweDU4MmZmMzgyIDB4ZGVmZDVjZDIgMHg1NjcyNDYyZSAweDU3YTUxZDg4IDB4ZWVmNDQ4ZmQgMHg1NzJmZDFlYSAweGUzNTBiOWQ0IDB4MGE4Y2IyYzIgMHgyNWI3MTNjYSAweGViYWYxNGEwIDB4NmEyMDVjZmMgMHhhZTFhNGRjYSAweDY0NGQyZGVjIDB4YmY0ZDdjNTcgMHhkNWRkMzgyYiAweDVjZWJlZDQzIDB4ZDU4Njg1YWYgMHgxM2JjNDRlNCAweDg5YTc2ODI2IDB4MDU3OTRkN2QgMHhhMjQwM2RkZiAweDAyZmU0NTE1IDB4NDFiZGM2ODAgMHg4ODJiYjFjMiAweDE3NjBjNjUyIDB4MTI0YzBhN2YgLy8gbWV0aG9kICJhcmM1OF9yZWtleVRvKGFkZHJlc3MsYm9vbCl2b2lkIiwgbWV0aG9kICJhcmM1OF9jYW5DYWxsKHVpbnQ2NCxib29sLGFkZHJlc3Msc3RyaW5nLGJ5dGVbNF0pYm9vbCIsIG1ldGhvZCAiYXJjNThfcmVrZXlUb1BsdWdpbih1aW50NjQsYm9vbCxzdHJpbmcsdWludDY0W10sKHVpbnQ2NCx1aW50NjQpW10pdm9pZCIsIG1ldGhvZCAiYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luKHN0cmluZyxib29sLHN0cmluZyx1aW50NjRbXSwodWludDY0LHVpbnQ2NClbXSl2b2lkIiwgbWV0aG9kICJhcmM1OF9hZGRQbHVnaW4odWludDY0LGFkZHJlc3Msc3RyaW5nLGJvb2wsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCxib29sKXZvaWQiLCBtZXRob2QgImFzc2lnbkRvbWFpbihhZGRyZXNzLHN0cmluZyl2b2lkIiwgbWV0aG9kICJhcmM1OF9yZW1vdmVQbHVnaW4odWludDY0LGFkZHJlc3Msc3RyaW5nKXZvaWQiLCBtZXRob2QgImFyYzU4X2FkZE5hbWVkUGx1Z2luKHN0cmluZyx1aW50NjQsYWRkcmVzcyxzdHJpbmcsYm9vbCx1aW50OCx1aW50NjQsdWludDY0LChieXRlWzRdLHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sLGJvb2wpdm9pZCIsIG1ldGhvZCAiYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW4oc3RyaW5nKXZvaWQiLCBtZXRob2QgImFyYzU4X25ld0VzY3JvdyhzdHJpbmcpdWludDY0IiwgbWV0aG9kICJhcmM1OF90b2dnbGVFc2Nyb3dMb2NrKHN0cmluZykodWludDY0LGJvb2wpIiwgbWV0aG9kICJhcmM1OF9yZWNsYWltKHN0cmluZywodWludDY0LHVpbnQ2NCxib29sKVtdKXZvaWQiLCBtZXRob2QgImFyYzU4X3BsdWdpblJlY2xhaW0odWludDY0LGFkZHJlc3Msc3RyaW5nLCh1aW50NjQsdWludDY0LGJvb2wpW10pdm9pZCIsIG1ldGhvZCAiYXJjNThfb3B0SW5Fc2Nyb3coc3RyaW5nLHVpbnQ2NFtdKXZvaWQiLCBtZXRob2QgImFyYzU4X3BsdWdpbk9wdEluRXNjcm93KHVpbnQ2NCxhZGRyZXNzLHN0cmluZyx1aW50NjRbXSxwYXkpdm9pZCIsIG1ldGhvZCAiYXJjNThfYWRkQWxsb3dhbmNlcyhzdHJpbmcsKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdKXZvaWQiLCBtZXRob2QgImFyYzU4X3JlbW92ZUFsbG93YW5jZXMoc3RyaW5nLHVpbnQ2NFtdKXZvaWQiLCBtZXRob2QgImFyYzU4X2FkZEV4ZWN1dGlvbktleShieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpdm9pZCIsIG1ldGhvZCAiYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5KGJ5dGVbMzJdKXZvaWQiLCBtZXRob2QgImFyYzU4X2dldEFkbWluKClhZGRyZXNzIiwgbWV0aG9kICJhcmM1OF9nZXRQbHVnaW5zKCh1aW50NjQsYWRkcmVzcyxzdHJpbmcpW10pKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LChieXRlWzRdLHVpbnQ2NCx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCxib29sLHVpbnQ2NCx1aW50NjQpW10iLCBtZXRob2QgImFyYzU4X2dldE5hbWVkUGx1Z2lucyhzdHJpbmdbXSkodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsKGJ5dGVbNF0sdWludDY0LHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sLGJvb2wsdWludDY0LHVpbnQ2NClbXSIsIG1ldGhvZCAiYXJjNThfZ2V0RXNjcm93cyhzdHJpbmdbXSkodWludDY0LGJvb2wpW10iLCBtZXRob2QgImFyYzU4X2dldEFsbG93YW5jZXMoc3RyaW5nLHVpbnQ2NFtdKSh1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdIiwgbWV0aG9kICJhcmM1OF9nZXRFeGVjdXRpb25zKGJ5dGVbMzJdW10pKGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NClbXSIsIG1ldGhvZCAiYXJjNThfZ2V0RG9tYWluS2V5cyhhZGRyZXNzW10pc3RyaW5nW10iLCBtZXRob2QgIm1icihzdHJpbmcsdWludDY0LHN0cmluZyx1aW50NjQpKHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0KSIsIG1ldGhvZCAiYmFsYW5jZSh1aW50NjRbXSl1aW50NjRbXSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIHJlZ2lzdGVyIHNldERvbWFpbiBzZXRSZXZvY2F0aW9uQXBwIHNldE5pY2tuYW1lIHNldEF2YXRhciBzZXRCYW5uZXIgc2V0QmlvIGFyYzU4X2NoYW5nZUFkbWluIGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluIGFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzIGFyYzU4X3Jla2V5VG8gYXJjNThfY2FuQ2FsbCBhcmM1OF9yZWtleVRvUGx1Z2luIGFyYzU4X3Jla2V5VG9OYW1lZFBsdWdpbiBhcmM1OF9hZGRQbHVnaW4gYXNzaWduRG9tYWluIGFyYzU4X3JlbW92ZVBsdWdpbiBhcmM1OF9hZGROYW1lZFBsdWdpbiBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbiBhcmM1OF9uZXdFc2Nyb3cgYXJjNThfdG9nZ2xlRXNjcm93TG9jayBhcmM1OF9yZWNsYWltIGFyYzU4X3BsdWdpblJlY2xhaW0gYXJjNThfb3B0SW5Fc2Nyb3cgYXJjNThfcGx1Z2luT3B0SW5Fc2Nyb3cgYXJjNThfYWRkQWxsb3dhbmNlcyBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzIGFyYzU4X2FkZEV4ZWN1dGlvbktleSBhcmM1OF9yZW1vdmVFeGVjdXRpb25LZXkgYXJjNThfZ2V0QWRtaW4gYXJjNThfZ2V0UGx1Z2lucyBhcmM1OF9nZXROYW1lZFBsdWdpbnMgYXJjNThfZ2V0RXNjcm93cyBhcmM1OF9nZXRBbGxvd2FuY2VzIGFyYzU4X2dldEV4ZWN1dGlvbnMgYXJjNThfZ2V0RG9tYWluS2V5cyBtYnIgYmFsYW5jZQogICAgZXJyCgptYWluX2NyZWF0ZV9Ob09wQDQ2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTItMTE4CiAgICAvLyBAY29udHJhY3QoewogICAgLy8gICBzdGF0ZVRvdGFsczogewogICAgLy8gICAgIGdsb2JhbEJ5dGVzOiBBYnN0cmFjdEFjY291bnROdW1HbG9iYWxCeXRlcywKICAgIC8vICAgICBnbG9iYWxVaW50czogQWJzdHJhY3RBY2NvdW50TnVtR2xvYmFsVWludHMKICAgIC8vICAgfQogICAgLy8gfSkKICAgIC8vIGV4cG9ydCBjbGFzcyBBYnN0cmFjdGVkQWNjb3VudCBleHRlbmRzIENvbnRyYWN0IHsKICAgIHB1c2hieXRlcyAweDE2NjU2YzY2IC8vIG1ldGhvZCAiY3JlYXRlKHN0cmluZyxhZGRyZXNzLGFkZHJlc3Msc3RyaW5nLHVpbnQ2NCx1aW50NjQsc3RyaW5nLGFkZHJlc3Mpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgptYWluX3VwZGF0ZV9yb3V0ZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODUKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgVXBkYXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiB1cGRhdGUKCgovLyBfcHV5YV9saWIuYXJjNC5keW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkKGFycmF5OiBieXRlcywgbmV3X2l0ZW1zX2J5dGVzOiBieXRlcywgbmV3X2l0ZW1zX2NvdW50OiB1aW50NjQpIC0+IGJ5dGVzOgpkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkOgogICAgcHJvdG8gMyAxCiAgICBmcmFtZV9kaWcgLTMKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBmcmFtZV9kaWcgLTEKICAgICsKICAgIHN3YXAKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBjb3ZlciAyCiAgICBmcmFtZV9kaWcgLTMKICAgIGludGNfMiAvLyAyCiAgICBkaWcgMgogICAgc3Vic3RyaW5nMwogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgYnplcm8KICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC0zCiAgICBsZW4KICAgIGZyYW1lX2RpZyAtMwogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBkdXAKICAgIGludGNfMCAvLyAwCgpkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkX2Zvcl9oZWFkZXJAMjoKICAgIGZyYW1lX2RpZyA0CiAgICBmcmFtZV9kaWcgMgogICAgPAogICAgYnogZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZF9hZnRlcl9mb3JANAogICAgZnJhbWVfZGlnIDMKICAgIGR1cAogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAxCiAgICBmcmFtZV9kaWcgNAogICAgZHVwCiAgICBjb3ZlciA0CiAgICB1bmNvdmVyIDIKICAgIHJlcGxhY2UzCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMQogICAgZGlnIDEKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgKwogICAgZnJhbWVfYnVyeSAzCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZnJhbWVfYnVyeSA0CiAgICBiIGR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWRfZm9yX2hlYWRlckAyCgpkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkX2FmdGVyX2ZvckA0OgogICAgZnJhbWVfZGlnIDAKICAgIGZyYW1lX2RpZyAxCiAgICBjb25jYXQKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgoKLy8gX3B1eWFfbGliLmFyYzQuZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50KGFycmF5X2l0ZW1zX2NvdW50OiB1aW50NjQsIGFycmF5X2hlYWRfYW5kX3RhaWw6IGJ5dGVzLCBuZXdfaXRlbXNfY291bnQ6IHVpbnQ2NCwgbmV3X2hlYWRfYW5kX3RhaWw6IGJ5dGVzKSAtPiBieXRlczoKZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50OgogICAgcHJvdG8gNCAxCiAgICBieXRlY18xIC8vICIiCiAgICBkdXAKICAgIGZyYW1lX2RpZyAtMgogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGZyYW1lX2RpZyAtNAogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGludGNfMCAvLyAwCgpkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnRfZm9yX2hlYWRlckAxOgogICAgZnJhbWVfZGlnIDQKICAgIGZyYW1lX2RpZyAzCiAgICA8CiAgICBieiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnRfYWZ0ZXJfZm9yQDQKICAgIGZyYW1lX2RpZyAtMwogICAgZnJhbWVfZGlnIDQKICAgIGR1cAogICAgY292ZXIgMgogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyAyCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZnJhbWVfZGlnIDEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSAxCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZnJhbWVfYnVyeSA0CiAgICBiIGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9mb3JfaGVhZGVyQDEKCmR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9hZnRlcl9mb3JANDoKICAgIGZyYW1lX2RpZyAtMwogICAgbGVuCiAgICBmcmFtZV9idXJ5IDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDQKCmR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9mb3JfaGVhZGVyQDU6CiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfZGlnIDIKICAgIDwKICAgIGJ6IGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9hZnRlcl9mb3JAOAogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgNAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgZnJhbWVfZGlnIDAKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgMQogICAgc3dhcAogICAgY29uY2F0CiAgICBmcmFtZV9idXJ5IDEKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2Zvcl9oZWFkZXJANQoKZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2FmdGVyX2ZvckA4OgogICAgZnJhbWVfZGlnIC00CiAgICBmcmFtZV9kaWcgLTIKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgMQogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTMKICAgIGZyYW1lX2RpZyAzCiAgICBmcmFtZV9kaWcgMAogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgMgogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBjb25jYXQKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2Jhc2UudHM6OnVpbnQ4KHY6IHVpbnQ2NCkgLT4gYnl0ZXM6CnVpbnQ4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2Jhc2UudHM6MwogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4KHY6IHVpbnQ2NCkgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvYmFzZS50czo0CiAgICAvLyByZXR1cm4gbmV3IGFyYzQuVWludDgodikKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgZHVwCiAgICBiaXRsZW4KICAgIGludGNfMyAvLyA4CiAgICA8PQogICAgYXNzZXJ0IC8vIG92ZXJmbG93CiAgICBleHRyYWN0IDcgMQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6OmVtcHR5UGx1Z2luSW5mbygpIC0+IGJ5dGVzOgplbXB0eVBsdWdpbkluZm86CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC91dGlscy50czo3CiAgICAvLyBkZWxlZ2F0aW9uVHlwZTogdWludDgoMCksCiAgICBpbnRjXzAgLy8gMAogICAgY2FsbHN1YiB1aW50OAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6MTAKICAgIC8vIG1ldGhvZHM6IFtdLAogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjUtMTgKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGVzY3JvdzogMCwKICAgIC8vICAgZGVsZWdhdGlvblR5cGU6IHVpbnQ4KDApLAogICAgLy8gICBsYXN0VmFsaWQ6IDAsCiAgICAvLyAgIGNvb2xkb3duOiAwLAogICAgLy8gICBtZXRob2RzOiBbXSwKICAgIC8vICAgYWRtaW46IGZhbHNlLAogICAgLy8gICB1c2VSb3VuZHM6IGZhbHNlLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXk6IGZhbHNlLAogICAgLy8gICBjb3ZlckZlZXM6IGZhbHNlLAogICAgLy8gICBjYW5SZWNsYWltOiBmYWxzZSwKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IDAsCiAgICAvLyB9OwogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgcHVzaGJ5dGVzIDB4MDAyYzAwCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6MTAKICAgIC8vIG1ldGhvZHM6IFtdLAogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjUtMTgKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGVzY3JvdzogMCwKICAgIC8vICAgZGVsZWdhdGlvblR5cGU6IHVpbnQ4KDApLAogICAgLy8gICBsYXN0VmFsaWQ6IDAsCiAgICAvLyAgIGNvb2xkb3duOiAwLAogICAgLy8gICBtZXRob2RzOiBbXSwKICAgIC8vICAgYWRtaW46IGZhbHNlLAogICAgLy8gICB1c2VSb3VuZHM6IGZhbHNlLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXk6IGZhbHNlLAogICAgLy8gICBjb3ZlckZlZXM6IGZhbHNlLAogICAgLy8gICBjYW5SZWNsYWltOiBmYWxzZSwKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IDAsCiAgICAvLyB9OwogICAgY29uY2F0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYyNgogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciA0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgNAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBjb3ZlciA0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGNvdmVyIDUKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYzNwogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkICE9PSAwLCBFUlJfQkFEX0RFUExPWUVSKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBUaGlzIGNvbnRyYWN0IG11c3QgYmUgZGVwbG95ZWQgZnJvbSBhIGZhY3RvcnkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjM4CiAgICAvLyBhc3NlcnQoYWRtaW4gIT09IGNvbnRyb2xsZWRBZGRyZXNzKQogICAgZGlnIDEKICAgIGRpZyAzCiAgICAhPQogICAgYXNzZXJ0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgYnl0ZWMgMjYgLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY0MAogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciA0CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxMyAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY0MQogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IGFkbWluCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOQogICAgLy8gZG9tYWluID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRG9tYWluIH0pOwogICAgYnl0ZWMgMjAgLy8gImRvbWFpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjQyCiAgICAvLyB0aGlzLmRvbWFpbi52YWx1ZSA9IGRvbWFpbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjQ0CiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY0NC02NDYKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICAgPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gICA6IGNvbnRyb2xsZWRBZGRyZXNzCiAgICBieiBjcmVhdGVfdGVybmFyeV9mYWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY0NQogICAgLy8gPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKCmNyZWF0ZV90ZXJuYXJ5X21lcmdlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY0My02NDYKICAgIC8vIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgPQogICAgLy8gICBjb250cm9sbGVkQWRkcmVzcyA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICAgPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gICAgIDogY29udHJvbGxlZEFkZHJlc3MKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MQogICAgLy8gZXNjcm93RmFjdG9yeSA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRXNjcm93RmFjdG9yeSB9KQogICAgYnl0ZWMgMjEgLy8gImVzY3Jvd19mYWN0b3J5IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NDcKICAgIC8vIHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZSA9IEFwcGxpY2F0aW9uKGVzY3Jvd0ZhY3RvcnkpCiAgICBkaWcgNAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMSAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjQ4CiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IEdsb2JhbC56ZXJvQWRkcmVzczsKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1CiAgICAvLyByZXZvY2F0aW9uID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVJldm9jYXRpb24gfSkKICAgIGJ5dGVjIDIyIC8vICJyZXZvY2F0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NDkKICAgIC8vIHRoaXMucmV2b2NhdGlvbi52YWx1ZSA9IEFwcGxpY2F0aW9uKHJldm9jYXRpb25BcHApCiAgICBkaWcgMwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBuaWNrbmFtZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c05pY2tuYW1lIH0pCiAgICBieXRlYyAyNyAvLyAibmlja25hbWUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY1MAogICAgLy8gdGhpcy5uaWNrbmFtZS52YWx1ZSA9IG5pY2tuYW1lCiAgICBkaWcgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUzCiAgICAvLyBmYWN0b3J5QXBwID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNGYWN0b3J5QXBwIH0pCiAgICBieXRlYyAyOCAvLyAiZmFjdG9yeV9hcHAiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY1MQogICAgLy8gdGhpcy5mYWN0b3J5QXBwLnZhbHVlID0gQXBwbGljYXRpb24oR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uSWQpCiAgICBnbG9iYWwgQ2FsbGVyQXBwbGljYXRpb25JRAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3CiAgICAvLyByZWZlcnJlciA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNSZWZlcnJlciB9KQogICAgcHVzaGJ5dGVzICJyZWZlcnJlciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjUyCiAgICAvLyB0aGlzLnJlZmVycmVyLnZhbHVlID0gcmVmZXJyZXIKICAgIGRpZyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjI2CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKY3JlYXRlX3Rlcm5hcnlfZmFsc2VAMzoKICAgIGRpZyA0CiAgICBiIGNyZWF0ZV90ZXJuYXJ5X21lcmdlQDQKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NjUKICAgIC8vIHJlZ2lzdGVyKGVzY3Jvdzogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NjYKICAgIC8vIGxldCBhcHA6IHVpbnQ2NCA9IDAKICAgIGludGNfMCAvLyAwCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY2NwogICAgLy8gaWYgKGVzY3JvdyAhPT0gJycpIHsKICAgIGJ5dGVjXzEgLy8gIiIKICAgICE9CiAgICBieiByZWdpc3Rlcl9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjXzIgLy8gImUiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY2OAogICAgLy8gYXNzZXJ0KHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXNjcm93IGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY2OQogICAgLy8gYXBwID0gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQKICAgIGJveF9nZXQKICAgIHBvcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDEKCnJlZ2lzdGVyX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjcyLTY4MQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgRXNjcm93RmFjdG9yeS5wcm90b3R5cGUucmVnaXN0ZXI+KHsKICAgIC8vICAgYXBwSWQ6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZSwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01icgogICAgLy8gICAgIH0pLAogICAgLy8gICAgIGFwcAogICAgLy8gICBdCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NzYKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MQogICAgLy8gZXNjcm93RmFjdG9yeSA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRXNjcm93RmFjdG9yeSB9KQogICAgYnl0ZWMgMjEgLy8gImVzY3Jvd19mYWN0b3J5IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NzYKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcywKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njc3CiAgICAvLyBhbW91bnQ6IEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01icgogICAgcHVzaGludCAxMjEwMCAvLyAxMjEwMAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njc1LTY3OAogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01icgogICAgLy8gfSksCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY3Mi02ODEKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEVzY3Jvd0ZhY3RvcnkucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIGFwcElkOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIKICAgIC8vICAgICB9KSwKICAgIC8vICAgICBhcHAKICAgIC8vICAgXQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NzkKICAgIC8vIGFwcAogICAgZGlnIDEKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjcyLTY4MQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgRXNjcm93RmFjdG9yeS5wcm90b3R5cGUucmVnaXN0ZXI+KHsKICAgIC8vICAgYXBwSWQ6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZSwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01icgogICAgLy8gICAgIH0pLAogICAgLy8gICAgIGFwcAogICAgLy8gICBdCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NjA3ZTcwNDYgLy8gbWV0aG9kICJyZWdpc3RlcihwYXksdWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjY1CiAgICAvLyByZWdpc3Rlcihlc2Nyb3c6IHN0cmluZyk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LnVwZGF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njg1CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODcKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSB8fCBUeG4uc2VuZGVyID09PSB0aGlzLmZhY3RvcnlBcHAudmFsdWUuYWRkcmVzcywgRVJSX09OTFlfQURNSU5fQ0FOX1VQREFURSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IHVwZGF0ZV9ib29sX3RydWVAMwogICAgdHhuIFNlbmRlcgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUzCiAgICAvLyBmYWN0b3J5QXBwID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNGYWN0b3J5QXBwIH0pCiAgICBieXRlYyAyOCAvLyAiZmFjdG9yeV9hcHAiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY4NwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IFR4bi5zZW5kZXIgPT09IHRoaXMuZmFjdG9yeUFwcC52YWx1ZS5hZGRyZXNzLCBFUlJfT05MWV9BRE1JTl9DQU5fVVBEQVRFKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBieiB1cGRhdGVfYm9vbF9mYWxzZUA0Cgp1cGRhdGVfYm9vbF90cnVlQDM6CiAgICBpbnRjXzEgLy8gMQoKdXBkYXRlX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njg3CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgVHhuLnNlbmRlciA9PT0gdGhpcy5mYWN0b3J5QXBwLnZhbHVlLmFkZHJlc3MsIEVSUl9PTkxZX0FETUlOX0NBTl9VUERBVEUpCiAgICBhc3NlcnQgLy8gT25seSBhbiBhZG1pbiBjYW4gdXBkYXRlIHRoZSBhcHBsaWNhdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjMKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIGJ5dGVjIDI2IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODgKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIGRpZyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODUKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKdXBkYXRlX2Jvb2xfZmFsc2VANDoKICAgIGludGNfMCAvLyAwCiAgICBiIHVwZGF0ZV9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXREb21haW5bcm91dGluZ10oKSAtPiB2b2lkOgpzZXREb21haW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY5OAogICAgLy8gc2V0RG9tYWluKGRvbWFpbjogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njk5CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9PTkxZX0FETUlOX0NBTl9VUERBVEUpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiB1cGRhdGUgdGhlIGFwcGxpY2F0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOQogICAgLy8gZG9tYWluID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRG9tYWluIH0pOwogICAgYnl0ZWMgMjAgLy8gImRvbWFpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzAwCiAgICAvLyB0aGlzLmRvbWFpbi52YWx1ZSA9IGRvbWFpbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njk4CiAgICAvLyBzZXREb21haW4oZG9tYWluOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRSZXZvY2F0aW9uQXBwW3JvdXRpbmddKCkgLT4gdm9pZDoKc2V0UmV2b2NhdGlvbkFwcDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzA4CiAgICAvLyBzZXRSZXZvY2F0aW9uQXBwKGFwcDogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MDkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9SRVZPS0UpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiBjaGFuZ2UgdGhlIHJldm9jYXRpb24gYXBwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NQogICAgLy8gcmV2b2NhdGlvbiA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlSZXZvY2F0aW9uIH0pCiAgICBieXRlYyAyMiAvLyAicmV2b2NhdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzEwCiAgICAvLyB0aGlzLnJldm9jYXRpb24udmFsdWUgPSBBcHBsaWNhdGlvbihhcHApCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MDgKICAgIC8vIHNldFJldm9jYXRpb25BcHAoYXBwOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXROaWNrbmFtZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnNldE5pY2tuYW1lOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MTgKICAgIC8vIHNldE5pY2tuYW1lKG5pY2tuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MTkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBuaWNrbmFtZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c05pY2tuYW1lIH0pCiAgICBieXRlYyAyNyAvLyAibmlja25hbWUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcyMAogICAgLy8gdGhpcy5uaWNrbmFtZS52YWx1ZSA9IG5pY2tuYW1lCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MTgKICAgIC8vIHNldE5pY2tuYW1lKG5pY2tuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRBdmF0YXJbcm91dGluZ10oKSAtPiB2b2lkOgpzZXRBdmF0YXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcyOAogICAgLy8gc2V0QXZhdGFyKGF2YXRhcjogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MjkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzMwCiAgICAvLyBjb25zdCBhbW91bnQgPSB0aGlzLmJhbGFuY2UoW2F2YXRhcl0pCiAgICBkdXAKICAgIGl0b2IKICAgIGJ5dGVjIDIzIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UKICAgIHBvcAogICAgaW50Y18yIC8vIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzMxCiAgICAvLyBhc3NlcnQoYW1vdW50WzBdID4gMCwgRVJSX0RPRVNfTk9UX0hPTERfQVNTRVQpCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXNzZXJ0IC8vIFRoZSBhY2NvdW50IGRvZXMgbm90IGhvbGQgdGhlIGFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNQogICAgLy8gYXZhdGFyID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNBdmF0YXIgfSkKICAgIHB1c2hieXRlcyAiYXZhdGFyIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MzIKICAgIC8vIHRoaXMuYXZhdGFyLnZhbHVlID0gQXNzZXQoYXZhdGFyKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzI4CiAgICAvLyBzZXRBdmF0YXIoYXZhdGFyOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRCYW5uZXJbcm91dGluZ10oKSAtPiB2b2lkOgpzZXRCYW5uZXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc0MAogICAgLy8gc2V0QmFubmVyKGJhbm5lcjogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NDEKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQyCiAgICAvLyBjb25zdCBhbW91bnQgPSB0aGlzLmJhbGFuY2UoW2Jhbm5lcl0pCiAgICBkdXAKICAgIGl0b2IKICAgIGJ5dGVjIDIzIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UKICAgIHBvcAogICAgaW50Y18yIC8vIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQzCiAgICAvLyBhc3NlcnQoYW1vdW50WzBdID4gMCwgRVJSX0RPRVNfTk9UX0hPTERfQVNTRVQpCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXNzZXJ0IC8vIFRoZSBhY2NvdW50IGRvZXMgbm90IGhvbGQgdGhlIGFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNwogICAgLy8gYmFubmVyID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNCYW5uZXIgfSkKICAgIHB1c2hieXRlcyAiYmFubmVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NDQKICAgIC8vIHRoaXMuYmFubmVyLnZhbHVlID0gQXNzZXQoYmFubmVyKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQwCiAgICAvLyBzZXRCYW5uZXIoYmFubmVyOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRCaW9bcm91dGluZ10oKSAtPiB2b2lkOgpzZXRCaW86CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc1MgogICAgLy8gc2V0QmlvKGJpbzogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzUzCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9PTkxZX0FETUlOX0NBTl9DSEFOR0VfTklDS05BTUUpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiBjaGFuZ2UgdGhlIG5pY2tuYW1lCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOQogICAgLy8gYmlvID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQmlvIH0pCiAgICBwdXNoYnl0ZXMgImJpbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzU0CiAgICAvLyB0aGlzLmJpby52YWx1ZSA9IGJpbwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzUyCiAgICAvLyBzZXRCaW8oYmlvOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9jaGFuZ2VBZG1pbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2NoYW5nZUFkbWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NjIKICAgIC8vIGFyYzU4X2NoYW5nZUFkbWluKG5ld0FkbWluOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc2MwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfT05MWV9BRE1JTl9DQU5fQ0hBTkdFX0FETUlOKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgYWRtaW4gYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxMyAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc2NAogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IG5ld0FkbWluOwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWMgNCAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc2MgogICAgLy8gYXJjNThfY2hhbmdlQWRtaW4obmV3QWRtaW46IEFjY291bnQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NzUKICAgIC8vIGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluKG5ld0FkbWluOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc3NgogICAgLy8gY29uc3Qga2V5ID0gY2xvbmUodGhpcy5jdXJyZW50UGx1Z2luLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3CiAgICAvLyBjdXJyZW50UGx1Z2luID0gR2xvYmFsU3RhdGU8UGx1Z2luS2V5Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ3VycmVudFBsdWdpbiB9KQogICAgYnl0ZWMgMjQgLy8gImN1cnJlbnRfcGx1Z2luIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NzYKICAgIC8vIGNvbnN0IGtleSA9IGNsb25lKHRoaXMuY3VycmVudFBsdWdpbi52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc3NwogICAgLy8gY29uc3QgeyBwbHVnaW4sIGVzY3JvdyB9ID0ga2V5CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDEKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMgogICAgbGVuCiAgICBkaWcgMwogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Nzc5CiAgICAvLyBhc3NlcnQoZXNjcm93ID09PSAnJywgRVJSX0FETUlOX1BMVUdJTlNfQ0FOTk9UX1VTRV9FU0NST1dTKTsKICAgIGJ5dGVjXzEgLy8gIiIKICAgID09CiAgICBhc3NlcnQgLy8gYWRtaW4gcGx1Z2lucyBjYW5ub3QgdXNlIGVzY3Jvd3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzgwCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzLCBFUlJfU0VOREVSX01VU1RfQkVfQURNSU5fUExVR0lOKTsKICAgIHR4biBTZW5kZXIKICAgIGRpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIHNlbmRlciBtdXN0IGJlIGFkbWluIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3ODIKICAgIC8vIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUuYXV0aEFkZHJlc3MgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc4MgogICAgLy8gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZS5hdXRoQWRkcmVzcyA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFjY3RfcGFyYW1zX2dldCBBY2N0QXV0aEFkZHIKICAgIGFzc2VydCAvLyBhY2NvdW50IGZ1bmRlZAogICAgc3dhcAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzgxLTc4NAogICAgLy8gYXNzZXJ0KAogICAgLy8gICB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLmF1dGhBZGRyZXNzID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MsCiAgICAvLyAgICdUaGlzIHBsdWdpbiBpcyBub3QgaW4gY29udHJvbCBvZiB0aGUgYWNjb3VudCcKICAgIC8vICk7CiAgICBhc3NlcnQgLy8gVGhpcyBwbHVnaW4gaXMgbm90IGluIGNvbnRyb2wgb2YgdGhlIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Nzg3CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMgJiYgdGhpcy5wbHVnaW5zKGtleSkudmFsdWUuYWRtaW4sCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfZmFsc2VANAogICAgZHVwCiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfZmFsc2VANAogICAgaW50Y18xIC8vIDEKCmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Nzg2LTc4OQogICAgLy8gYXNzZXJ0KAogICAgLy8gICB0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMgJiYgdGhpcy5wbHVnaW5zKGtleSkudmFsdWUuYWRtaW4sCiAgICAvLyAgICdUaGlzIHBsdWdpbiBkb2VzIG5vdCBoYXZlIGFkbWluIHByaXZpbGVnZXMnCiAgICAvLyApOwogICAgYXNzZXJ0IC8vIFRoaXMgcGx1Z2luIGRvZXMgbm90IGhhdmUgYWRtaW4gcHJpdmlsZWdlcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxMyAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc5MQogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IG5ld0FkbWluOwogICAgZGlnIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc5MgogICAgLy8gaWYgKHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlLmRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYpIHsKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgYnl0ZWMgMTQgLy8gMHgwMQogICAgPT0KICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2FmdGVyX2lmX2Vsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKCmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Nzc1CiAgICAvLyBhcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbihuZXdBZG1pbjogQWNjb3VudCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcGx1Z2luQ2hhbmdlQWRtaW5fYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfcGx1Z2luQ2hhbmdlQWRtaW5fYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3Nbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF92ZXJpZnlBdXRoQWRkcmVzczoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODAyCiAgICAvLyBhc3NlcnQodGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUuYXV0aEFkZHJlc3MgPT09IHRoaXMuZ2V0QXV0aEFkZHJlc3MoKSk7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDUKICAgIC8vIHNwZW5kaW5nQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MgfSkKICAgIGJ5dGVjIDExIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MDIKICAgIC8vIGFzc2VydCh0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZS5hdXRoQWRkcmVzcyA9PT0gdGhpcy5nZXRBdXRoQWRkcmVzcygpKTsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGFjY3RfcGFyYW1zX2dldCBBY2N0QXV0aEFkZHIKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGFzc2VydCAvLyBhY2NvdW50IGZ1bmRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MDYKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MDYKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjA2LTYwNwogICAgLy8gdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUKICAgIC8vICYmIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBieiBhcmM1OF92ZXJpZnlBdXRoQWRkcmVzc190ZXJuYXJ5X2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjA3CiAgICAvLyAmJiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjA3CiAgICAvLyAmJiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MDYtNjA3CiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9PT0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZQogICAgLy8gJiYgdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGJ6IGFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfZmFsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MDgKICAgIC8vICkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCgphcmM1OF92ZXJpZnlBdXRoQWRkcmVzc190ZXJuYXJ5X21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgwMgogICAgLy8gYXNzZXJ0KHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLmF1dGhBZGRyZXNzID09PSB0aGlzLmdldEF1dGhBZGRyZXNzKCkpOwogICAgZGlnIDEKICAgID09CiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMSAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODAzCiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MDQKICAgIC8vIHRoaXMuY3VycmVudFBsdWdpbi52YWx1ZSA9IHsgcGx1Z2luOiAwLCBjYWxsZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLCBlc2Nyb3c6ICcnIH0KICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgc3dhcAogICAgY29uY2F0CiAgICBwdXNoYnl0ZXMgMHgwMDJhMDAwMAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NwogICAgLy8gY3VycmVudFBsdWdpbiA9IEdsb2JhbFN0YXRlPFBsdWdpbktleT4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0N1cnJlbnRQbHVnaW4gfSkKICAgIGJ5dGVjIDI0IC8vICJjdXJyZW50X3BsdWdpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODA0CiAgICAvLyB0aGlzLmN1cnJlbnRQbHVnaW4udmFsdWUgPSB7IHBsdWdpbjogMCwgY2FsbGVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgZXNjcm93OiAnJyB9CiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkKICAgIC8vIHJla2V5SW5kZXggPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAwLCBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1Jla2V5SW5kZXggfSkKICAgIGJ5dGVjIDE5IC8vICJyZWtleV9pbmRleCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODA1CiAgICAvLyB0aGlzLnJla2V5SW5kZXgudmFsdWUgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODAxCiAgICAvLyBhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjA4CiAgICAvLyApID8gR2xvYmFsLnplcm9BZGRyZXNzIDogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBiIGFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZWtleVRvOgogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgxNAogICAgLy8gYXJjNThfcmVrZXlUbyhhZGRyZXNzOiBBY2NvdW50LCBmbGFzaDogYm9vbGVhbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTUKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0FETUlOX09OTFkpOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gYWRtaW4gb25seQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTctODI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgxOQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODE5CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MjIKICAgIC8vIG5vdGU6ICdyZWtleWluZyBhYnN0cmFjdGVkIGFjY291bnQnCiAgICBwdXNoYnl0ZXMgInJla2V5aW5nIGFic3RyYWN0ZWQgYWNjb3VudCIKICAgIGl0eG5fZmllbGQgTm90ZQogICAgZGlnIDIKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTctODIzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTctODI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MjYKICAgIC8vIGlmIChmbGFzaCkgdGhpcy5hc3NlcnRSZWtleXNCYWNrKCk7CiAgICBieiBhcmM1OF9yZWtleVRvX2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTkKICAgIC8vIGxldCByZWtleXNCYWNrID0gZmFsc2U7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gKFR4bi5ncm91cEluZGV4ICsgMSk7IGkgPCBHbG9iYWwuZ3JvdXBTaXplOyBpICs9IDEpIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAyCgphcmM1OF9yZWtleVRvX3doaWxlX3RvcEA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMjAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IChUeG4uZ3JvdXBJbmRleCArIDEpOyBpIDwgR2xvYmFsLmdyb3VwU2l6ZTsgaSArPSAxKSB7CiAgICBkaWcgMQogICAgZ2xvYmFsIEdyb3VwU2l6ZQogICAgPAogICAgYnogYXJjNThfcmVrZXlUb19ibG9ja0AxMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMjMKICAgIC8vIGlmICh0aGlzLnR4blJla2V5c0JhY2sodHhuKSkgewogICAgZGlnIDEKICAgIGNhbGxzdWIgdHhuUmVrZXlzQmFjawogICAgYnogYXJjNThfcmVrZXlUb19hZnRlcl9pZl9lbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzI0CiAgICAvLyByZWtleXNCYWNrID0gdHJ1ZTsKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDEKCmFyYzU4X3Jla2V5VG9fYmxvY2tAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyOQogICAgLy8gYXNzZXJ0KHJla2V5c0JhY2ssIEVSUl9NSVNTSU5HX1JFS0VZX0JBQ0spOwogICAgZHVwCiAgICBhc3NlcnQgLy8gbWlzc2luZyByZWtleSBiYWNrCgphcmM1OF9yZWtleVRvX2FmdGVyX2lmX2Vsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWMgNCAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgxNAogICAgLy8gYXJjNThfcmVrZXlUbyhhZGRyZXNzOiBBY2NvdW50LCBmbGFzaDogYm9vbGVhbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcmVrZXlUb19hZnRlcl9pZl9lbHNlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gKFR4bi5ncm91cEluZGV4ICsgMSk7IGkgPCBHbG9iYWwuZ3JvdXBTaXplOyBpICs9IDEpIHsKICAgIGRpZyAxCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAyCiAgICBiIGFyYzU4X3Jla2V5VG9fd2hpbGVfdG9wQDYKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9jYW5DYWxsW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfY2FuQ2FsbDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODQxCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBwdXNoaW50IDQgLy8gNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbNF0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODQ5CiAgICAvLyBpZiAoZ2xvYmFsKSB7CiAgICBieiBhcmM1OF9jYW5DYWxsX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NTAKICAgIC8vIHRoaXMucGx1Z2luQ2FsbEFsbG93ZWQocGx1Z2luLCBHbG9iYWwuemVyb0FkZHJlc3MsIGVzY3JvdywgbWV0aG9kKTsKICAgIGRpZyAzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgIGRpZyAzCiAgICBkaWcgMwogICAgY2FsbHN1YiBwbHVnaW5DYWxsQWxsb3dlZAogICAgcG9wCgphcmM1OF9jYW5DYWxsX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODUyCiAgICAvLyByZXR1cm4gdGhpcy5wbHVnaW5DYWxsQWxsb3dlZChwbHVnaW4sIGFkZHJlc3MsIGVzY3JvdywgbWV0aG9kKTsKICAgIGRpZyAzCiAgICBkaWcgMwogICAgZGlnIDMKICAgIGRpZyAzCiAgICBjYWxsc3ViIHBsdWdpbkNhbGxBbGxvd2VkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZWtleVRvUGx1Z2luOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NjQtODcwCiAgICAvLyBhcmM1OF9yZWtleVRvUGx1Z2luKAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgZ2xvYmFsOiBib29sZWFuLAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgbWV0aG9kT2Zmc2V0czogdWludDY0W10sCiAgICAvLyAgIGZ1bmRzUmVxdWVzdDogRnVuZHNSZXF1ZXN0W10KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbisodWludDY0LHVpbnQ2NClbXSkKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbgogICAgcG9wbiAyCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MzItOTM3CiAgICAvLyBhcmM1OF9yZWtleVRvTmFtZWRQbHVnaW4oCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgZ2xvYmFsOiBib29sZWFuLAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgbWV0aG9kT2Zmc2V0czogdWludDY0W10sCiAgICAvLyAgIGZ1bmRzUmVxdWVzdDogRnVuZHNSZXF1ZXN0W10pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsdWludDY0KVtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQKICAgIC8vIG5hbWVkUGx1Z2lucyA9IEJveE1hcDxzdHJpbmcsIFBsdWdpbktleT4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeE5hbWVkUGx1Z2lucyB9KTsKICAgIGJ5dGVjIDE1IC8vICJuIgogICAgdW5jb3ZlciA1CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTM5CiAgICAvLyB0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS52YWx1ZS5wbHVnaW4sCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzOC05NDQKICAgIC8vIHRoaXMuYXJjNThfcmVrZXlUb1BsdWdpbigKICAgIC8vICAgdGhpcy5uYW1lZFBsdWdpbnMobmFtZSkudmFsdWUucGx1Z2luLAogICAgLy8gICBnbG9iYWwsCiAgICAvLyAgIGVzY3JvdywKICAgIC8vICAgbWV0aG9kT2Zmc2V0cywKICAgIC8vICAgZnVuZHNSZXF1ZXN0CiAgICAvLyApOwogICAgY292ZXIgNAogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luCiAgICBwb3BuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTMyLTkzNwogICAgLy8gYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luKAogICAgLy8gICBuYW1lOiBzdHJpbmcsCiAgICAvLyAgIGdsb2JhbDogYm9vbGVhbiwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIG1ldGhvZE9mZnNldHM6IHVpbnQ2NFtdLAogICAgLy8gICBmdW5kc1JlcXVlc3Q6IEZ1bmRzUmVxdWVzdFtdKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfYWRkUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfYWRkUGx1Z2luOgogICAgaW50Y18wIC8vIDAKICAgIGR1cG4gMwogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk2NC05NzgKICAgIC8vIGFyYzU4X2FkZFBsdWdpbigKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFkbWluOiBib29sZWFuLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogVWludDgsCiAgICAvLyAgIGxhc3RWYWxpZDogdWludDY0LAogICAgLy8gICBjb29sZG93bjogdWludDY0LAogICAgLy8gICBtZXRob2RzOiBNZXRob2RSZXN0cmljdGlvbltdLAogICAgLy8gICB1c2VSb3VuZHM6IGJvb2xlYW4sCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogYm9vbGVhbiwKICAgIC8vICAgY292ZXJGZWVzOiBib29sZWFuLAogICAgLy8gICBjYW5SZWNsYWltOiBib29sZWFuLAogICAgLy8gICBkZWZhdWx0VG9Fc2Nyb3c6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwbiAyCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDcKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIHB1c2hpbnQgMTIgLy8gMTIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ4WzRdLHVpbnQ2NClbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDkKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEwCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk3OQogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfQURNSU5fT05MWSk7CiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBhZG1pbiBvbmx5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4MgogICAgLy8gZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgYnl0ZWMgMTQgLy8gMHgwMQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTgyLTk4MwogICAgLy8gZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgLy8gY2FsbGVyID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGJ6IGFyYzU4X2FkZFBsdWdpbl9ib29sX2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTgzCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZGlnIDEyCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4Mi05ODMKICAgIC8vIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBieiBhcmM1OF9hZGRQbHVnaW5fYm9vbF9mYWxzZUA0CiAgICBpbnRjXzEgLy8gMQoKYXJjNThfYWRkUGx1Z2luX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTgxLTk4NAogICAgLy8gISgKICAgIC8vICAgZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgLy8gICBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gKSwKICAgICEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTgwLTk4NgogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vICAgICBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gICApLAogICAgLy8gICBFUlJfWkVST19BRERSRVNTX0RFTEVHQVRJT05fVFlQRQogICAgLy8gKQogICAgYXNzZXJ0IC8vIGRlbGVnYXRpb24gdHlwZSBtdXN0IG5vdCBiZSBzZWxmIGZvciBnbG9iYWwgcGx1Z2lucwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5ODktOTkwCiAgICAvLyB1c2VFeGVjdXRpb25LZXkgJiYKICAgIC8vIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBkaWcgMwogICAgYnogYXJjNThfYWRkUGx1Z2luX2Jvb2xfZmFsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5OTAKICAgIC8vIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBkaWcgMTIKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTg5LTk5MAogICAgLy8gdXNlRXhlY3V0aW9uS2V5ICYmCiAgICAvLyBjYWxsZXIgIT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkUGx1Z2luX2Jvb2xfZmFsc2VAOAogICAgaW50Y18xIC8vIDEKCmFyYzU4X2FkZFBsdWdpbl9ib29sX21lcmdlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4OC05OTEKICAgIC8vICEoCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gICBjYWxsZXIgIT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gKSwKICAgICEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTg3LTk5MwogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gICAgIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICksCiAgICAvLyAgIEVSUl9VU0lOR19FWEVDVVRJT05fS0VZX1JFUVVJUkVTX0dMT0JBTAogICAgLy8gKQogICAgYXNzZXJ0IC8vIHVzaW5nIGV4ZWN1dGlvbiBrZXkgcmVxdWlyZXMgZ2xvYmFsIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5OTYKICAgIC8vIGlmIChkZWZhdWx0VG9Fc2Nyb3cpIHsKICAgIGR1cAogICAgYm56IGFyYzU4X2FkZFBsdWdpbl9pZl9ib2R5QDEwCiAgICBkaWcgMTEKICAgIGJ1cnkgMTgKCmFyYzU4X2FkZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDAxCiAgICAvLyBjb25zdCBrZXk6IFBsdWdpbktleSA9IHsgcGx1Z2luLCBjYWxsZXIsIGVzY3JvdzogZXNjcm93S2V5IH0KICAgIGRpZyAxMwogICAgaXRvYgogICAgZGlnIDEzCiAgICBjb25jYXQKICAgIGRpZyAxOAogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGJ5dGVjIDEwIC8vIDB4MDAyYQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgMjAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAwMwogICAgLy8gYXNzZXJ0KCF0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMsIEVSUl9QTFVHSU5fQUxSRUFEWV9FWElTVFMpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBwbHVnaW4gYWxyZWFkeSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAwNQogICAgLy8gbGV0IG1ldGhvZEluZm9zOiBNZXRob2RJbmZvW10gPSBbXQogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIGJ1cnkgMjAKICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICBidXJ5IDE3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMDYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxNQoKYXJjNThfYWRkUGx1Z2luX3doaWxlX3RvcEAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAwNgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyAxNAogICAgZGlnIDYKICAgIDwKICAgIGJ6IGFyYzU4X2FkZFBsdWdpbl9hZnRlcl93aGlsZUAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDA3CiAgICAvLyBtZXRob2RJbmZvcy5wdXNoKHsgLi4ubWV0aG9kc1tpXSwgbGFzdENhbGxlZDogMCB9KQogICAgZGlnIDYKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMTUKICAgIGR1cAogICAgY292ZXIgMgogICAgcHVzaGludCAxMiAvLyAxMgogICAgKgogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGV4dHJhY3QgMCA0CiAgICBzd2FwCiAgICBleHRyYWN0IDQgOAogICAgZGlnIDEKICAgIGxlbgogICAgcHVzaGludCA0IC8vIDQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBjb25jYXQKICAgIGRpZyAyMQogICAgY29uY2F0CiAgICBkaWcgMTgKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBidXJ5IDE4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMDYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxNQogICAgYiBhcmM1OF9hZGRQbHVnaW5fd2hpbGVfdG9wQDEyCgphcmM1OF9hZGRQbHVnaW5fYWZ0ZXJfd2hpbGVAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTAKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGRpZyA0CiAgICBieiBhcmM1OF9hZGRQbHVnaW5fdGVybmFyeV9mYWxzZUAxNgogICAgZ2xvYmFsIFJvdW5kCiAgICBidXJ5IDE2CgphcmM1OF9hZGRQbHVnaW5fdGVybmFyeV9tZXJnZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAxMgogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDEyCiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IGFyYzU4X2FkZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDIwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTMtMTAxOQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTUKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTUKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTYKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTcKICAgIC8vIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3Jvd0tleSwgbWV0aG9kSW5mb3MubGVuZ3RoKQogICAgZGlnIDE4CiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAyMAogICAgc3dhcAogICAgY2FsbHN1YiBwbHVnaW5zTWJyCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAxMy0xMDE4CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3Jvd0tleSwgbWV0aG9kSW5mb3MubGVuZ3RoKQogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDEzLTEwMTkKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmFyYzU4X2FkZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDIyCiAgICAvLyBjb25zdCBlc2Nyb3dJRCA9IHRoaXMubWF5YmVOZXdFc2Nyb3coZXNjcm93KTsKICAgIGRpZyAxMQogICAgZHVwCiAgICBjYWxsc3ViIG1heWJlTmV3RXNjcm93CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMzQKICAgIC8vIGNhblJlY2xhaW06IGVzY3JvdyAhPT0gJycgPyBjYW5SZWNsYWltIDogZmFsc2UsCiAgICBzd2FwCiAgICBieXRlY18xIC8vICIiCiAgICAhPQogICAgaW50Y18wIC8vIDAKICAgIGRpZyA0CiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDI0LTEwMzcKICAgIC8vIHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlID0gewogICAgLy8gICBlc2Nyb3c6IGVzY3Jvd0lELAogICAgLy8gICBhZG1pbiwKICAgIC8vICAgZGVsZWdhdGlvblR5cGUsCiAgICAvLyAgIGxhc3RWYWxpZCwKICAgIC8vICAgY29vbGRvd24sCiAgICAvLyAgIG1ldGhvZHM6IGNsb25lKG1ldGhvZEluZm9zKSwKICAgIC8vICAgdXNlUm91bmRzLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXksCiAgICAvLyAgIGNvdmVyRmVlcywKICAgIC8vICAgY2FuUmVjbGFpbTogZXNjcm93ICE9PSAnJyA/IGNhblJlY2xhaW0gOiBmYWxzZSwKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IGVwb2NoUmVmLAogICAgLy8gfQogICAgc3dhcAogICAgaXRvYgogICAgZGlnIDExCiAgICBjb25jYXQKICAgIGRpZyAxMAogICAgaXRvYgogICAgY29uY2F0CiAgICBkaWcgOQogICAgaXRvYgogICAgY29uY2F0CiAgICBieXRlYyAyOSAvLyAweDAwMmMKICAgIGNvbmNhdAogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDE0CiAgICBzZXRiaXQKICAgIGludGNfMSAvLyAxCiAgICBkaWcgOAogICAgc2V0Yml0CiAgICBpbnRjXzIgLy8gMgogICAgZGlnIDcKICAgIHNldGJpdAogICAgcHVzaGludCAzIC8vIDMKICAgIGRpZyA2CiAgICBzZXRiaXQKICAgIHB1c2hpbnQgNCAvLyA0CiAgICB1bmNvdmVyIDMKICAgIHNldGJpdAogICAgY29uY2F0CiAgICBkaWcgMjAKICAgIGNvbmNhdAogICAgZGlnIDE2CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGRpZyAxNwogICAgY29uY2F0CiAgICBkaWcgMTkKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjIDQgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NjQtOTc4CiAgICAvLyBhcmM1OF9hZGRQbHVnaW4oCiAgICAvLyAgIHBsdWdpbjogdWludDY0LAogICAgLy8gICBjYWxsZXI6IEFjY291bnQsCiAgICAvLyAgIGVzY3Jvdzogc3RyaW5nLAogICAgLy8gICBhZG1pbjogYm9vbGVhbiwKICAgIC8vICAgZGVsZWdhdGlvblR5cGU6IFVpbnQ4LAogICAgLy8gICBsYXN0VmFsaWQ6IHVpbnQ2NCwKICAgIC8vICAgY29vbGRvd246IHVpbnQ2NCwKICAgIC8vICAgbWV0aG9kczogTWV0aG9kUmVzdHJpY3Rpb25bXSwKICAgIC8vICAgdXNlUm91bmRzOiBib29sZWFuLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXk6IGJvb2xlYW4sCiAgICAvLyAgIGNvdmVyRmVlczogYm9vbGVhbiwKICAgIC8vICAgY2FuUmVjbGFpbTogYm9vbGVhbiwKICAgIC8vICAgZGVmYXVsdFRvRXNjcm93OiBib29sZWFuCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X2FkZFBsdWdpbl90ZXJuYXJ5X2ZhbHNlQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDEwCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBidXJ5IDE2CiAgICBiIGFyYzU4X2FkZFBsdWdpbl90ZXJuYXJ5X21lcmdlQDE3CgphcmM1OF9hZGRQbHVnaW5faWZfYm9keUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTk3CiAgICAvLyBhc3NlcnQoZXNjcm93ICE9PSAnJywgRVJSX0VTQ1JPV19SRVFVSVJFRF9UT19CRV9TRVRfQVNfREVGQVVMVCkKICAgIGRpZyAxMQogICAgYnl0ZWNfMSAvLyAiIgogICAgIT0KICAgIGFzc2VydCAvLyBlc2Nyb3cgbXVzdCBiZSBzZXQgaWYgZGVmYXVsdFRvRXNjcm93IGlzIHRydWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTk4CiAgICAvLyBlc2Nyb3dLZXkgPSAnJwogICAgYnl0ZWNfMSAvLyAiIgogICAgYnVyeSAxOAogICAgYiBhcmM1OF9hZGRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxMQoKYXJjNThfYWRkUGx1Z2luX2Jvb2xfZmFsc2VAODoKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X2FkZFBsdWdpbl9ib29sX21lcmdlQDkKCmFyYzU4X2FkZFBsdWdpbl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9hZGRQbHVnaW5fYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXNzaWduRG9tYWluW3JvdXRpbmddKCkgLT4gdm9pZDoKYXNzaWduRG9tYWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDQ5CiAgICAvLyBhc3NpZ25Eb21haW4oY2FsbGVyOiBBY2NvdW50LCBkb21haW46IHN0cmluZyk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNTAKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0FERF9QTFVHSU4pCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiBhZGQgYSBwbHVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA1MgogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDUyCiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IGFzc2lnbkRvbWFpbl9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA1My0xMDU5CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5kb21haW5LZXlzTWJyKGRvbWFpbikKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNTUKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNTUKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNTYKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIxNgogICAgLy8gcmV0dXJuIE1pbkRvbWFpbktleXNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhkb21haW4pLmxlbmd0aCkKICAgIGRpZyAyCiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIHB1c2hpbnQgMTU3MDAgLy8gMTU3MDAKICAgICsKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDUzLTEwNTgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmRvbWFpbktleXNNYnIoZG9tYWluKQogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDUzLTEwNTkKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmRvbWFpbktleXNNYnIoZG9tYWluKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0Cgphc3NpZ25Eb21haW5fYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgYnl0ZWMgMTYgLy8gImQiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNjIKICAgIC8vIHRoaXMuZG9tYWluS2V5cyhjYWxsZXIpLnZhbHVlID0gZG9tYWluCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgZGlnIDEKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA0OQogICAgLy8gYXNzaWduRG9tYWluKGNhbGxlcjogQWNjb3VudCwgZG9tYWluOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZW1vdmVQbHVnaW5bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZW1vdmVQbHVnaW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNzIKICAgIC8vIGFyYzU4X3JlbW92ZVBsdWdpbihwbHVnaW46IHVpbnQ2NCwgY2FsbGVyOiBBY2NvdW50LCBlc2Nyb3c6IHN0cmluZyk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDczCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5jYW5SZXZva2UoKSwgRVJSX09OTFlfQURNSU5fT1JfUkVWT0NBVElPTl9BUFBfQ0FOX1JFTU9WRV9QTFVHSU4pOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBibnogYXJjNThfcmVtb3ZlUGx1Z2luX2Jvb2xfdHJ1ZUAzCiAgICBjYWxsc3ViIGNhblJldm9rZQogICAgYnogYXJjNThfcmVtb3ZlUGx1Z2luX2Jvb2xfZmFsc2VANAoKYXJjNThfcmVtb3ZlUGx1Z2luX2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18xIC8vIDEKCmFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNzMKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSB8fCB0aGlzLmNhblJldm9rZSgpLCBFUlJfT05MWV9BRE1JTl9PUl9SRVZPQ0FUSU9OX0FQUF9DQU5fUkVNT1ZFX1BMVUdJTik7CiAgICBhc3NlcnQgLy8gT25seSBhbiBhZG1pbiBvciByZXZvY2F0aW9uIGFwcCBjYW4gcmVtb3ZlIHBsdWdpbnMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA3NQogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyOiBjYWxsZXIsIGVzY3JvdyB9CiAgICBkaWcgMgogICAgaXRvYgogICAgZGlnIDIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBzd2FwCiAgICBieXRlYyAxMCAvLyAweDAwMmEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDc2CiAgICAvLyBhc3NlcnQodGhpcy5wbHVnaW5zKGtleSkuZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQbHVnaW4gZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA3OAogICAgLy8gdGhpcy5wbHVnaW5zKGtleSkuZGVsZXRlKCk7CiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWMgNCAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNzIKICAgIC8vIGFyYzU4X3JlbW92ZVBsdWdpbihwbHVnaW46IHVpbnQ2NCwgY2FsbGVyOiBBY2NvdW50LCBlc2Nyb3c6IHN0cmluZyk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcmVtb3ZlUGx1Z2luX2Jvb2xfZmFsc2VANDoKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9hZGROYW1lZFBsdWdpbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2FkZE5hbWVkUGx1Z2luOgogICAgaW50Y18wIC8vIDAKICAgIGR1cG4gMwogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMDEtMTExNgogICAgLy8gYXJjNThfYWRkTmFtZWRQbHVnaW4oCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFkbWluOiBib29sZWFuLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogVWludDgsCiAgICAvLyAgIGxhc3RWYWxpZDogdWludDY0LAogICAgLy8gICBjb29sZG93bjogdWludDY0LAogICAgLy8gICBtZXRob2RzOiBNZXRob2RSZXN0cmljdGlvbltdLAogICAgLy8gICB1c2VSb3VuZHM6IGJvb2xlYW4sCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogYm9vbGVhbiwKICAgIC8vICAgY292ZXJGZWVzOiBib29sZWFuLAogICAgLy8gICBjYW5SZWNsYWltOiBib29sZWFuLAogICAgLy8gICBkZWZhdWx0VG9Fc2Nyb3c6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDYKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNvdmVyIDIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA5CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIHB1c2hpbnQgMTIgLy8gMTIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ4WzRdLHVpbnQ2NClbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEwCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIGNvdmVyIDIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTE3CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9BRE1JTl9PTkxZKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0CiAgICAvLyBuYW1lZFBsdWdpbnMgPSBCb3hNYXA8c3RyaW5nLCBQbHVnaW5LZXk+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhOYW1lZFBsdWdpbnMgfSk7CiAgICBieXRlYyAxNSAvLyAibiIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTExOAogICAgLy8gYXNzZXJ0KCF0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS5leGlzdHMpOwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyMQogICAgLy8gZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgYnl0ZWMgMTQgLy8gMHgwMQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyMS0xMTIyCiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMjIKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBkaWcgMTMKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyMS0xMTIyCiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA0CiAgICBpbnRjXzEgLy8gMQoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTIwLTExMjMKICAgIC8vICEoCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vICAgY2FsbGVyID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICksCiAgICAhCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMTktMTEyNQogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vICAgICBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gICApLAogICAgLy8gICBFUlJfWkVST19BRERSRVNTX0RFTEVHQVRJT05fVFlQRQogICAgLy8gKQogICAgYXNzZXJ0IC8vIGRlbGVnYXRpb24gdHlwZSBtdXN0IG5vdCBiZSBzZWxmIGZvciBnbG9iYWwgcGx1Z2lucwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI4LTExMjkKICAgIC8vIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyA0CiAgICBieiBhcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyOQogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyAxMwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI4LTExMjkKICAgIC8vIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGJ6IGFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfZmFsc2VAOAogICAgaW50Y18xIC8vIDEKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyNy0xMTMwCiAgICAvLyAhKAogICAgLy8gICB1c2VFeGVjdXRpb25LZXkgJiYKICAgIC8vICAgY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICksCiAgICAhCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMjYtMTEzMgogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gICAgIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICksCiAgICAvLyAgIEVSUl9VU0lOR19FWEVDVVRJT05fS0VZX1JFUVVJUkVTX0dMT0JBTAogICAgLy8gKQogICAgYXNzZXJ0IC8vIHVzaW5nIGV4ZWN1dGlvbiBrZXkgcmVxdWlyZXMgZ2xvYmFsIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTM1CiAgICAvLyBpZiAoZGVmYXVsdFRvRXNjcm93KSB7CiAgICBkaWcgMQogICAgYm56IGFyYzU4X2FkZE5hbWVkUGx1Z2luX2lmX2JvZHlAMTAKICAgIGRpZyAxMgogICAgYnVyeSAyMQoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE0MAogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyOiBjYWxsZXIsIGVzY3JvdzogZXNjcm93S2V5IH0KICAgIGRpZyAxNAogICAgaXRvYgogICAgZGlnIDE0CiAgICBjb25jYXQKICAgIGRpZyAyMQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGJ5dGVjIDEwIC8vIDB4MDAyYQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSAyMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQxCiAgICAvLyB0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS52YWx1ZSA9IGNsb25lKGtleSkKICAgIGRpZyAxCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQzCiAgICAvLyBsZXQgbWV0aG9kSW5mb3M6IE1ldGhvZEluZm9bXSA9IFtdCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgYnVyeSAyMgogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIGJ1cnkgMTkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE0NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDE3CgphcmM1OF9hZGROYW1lZFBsdWdpbl93aGlsZV90b3BAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgMTYKICAgIGRpZyA3CiAgICA8CiAgICBieiBhcmM1OF9hZGROYW1lZFBsdWdpbl9hZnRlcl93aGlsZUAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQ1CiAgICAvLyBtZXRob2RJbmZvcy5wdXNoKHsgLi4ubWV0aG9kc1tpXSwgbGFzdENhbGxlZDogMCB9KQogICAgZGlnIDcKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMTcKICAgIGR1cAogICAgY292ZXIgMgogICAgcHVzaGludCAxMiAvLyAxMgogICAgKgogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGV4dHJhY3QgMCA0CiAgICBzd2FwCiAgICBleHRyYWN0IDQgOAogICAgZGlnIDEKICAgIGxlbgogICAgcHVzaGludCA0IC8vIDQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBjb25jYXQKICAgIGRpZyAyMwogICAgY29uY2F0CiAgICBkaWcgMjAKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBidXJ5IDIwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxNwogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl93aGlsZV90b3BAMTIKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2FmdGVyX3doaWxlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQ4CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDgKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAhPQogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQ5LTExNTUKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpICsgdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTEKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTEKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTIKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTMKICAgIC8vIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3Jvd0tleSwgbWV0aG9kSW5mb3MubGVuZ3RoKSArIHRoaXMubmFtZWRQbHVnaW5zTWJyKG5hbWUpCiAgICBkaWcgMjAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDIzCiAgICBzd2FwCiAgICBjYWxsc3ViIHBsdWdpbnNNYnIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjAwCiAgICAvLyByZXR1cm4gTWluTmFtZWRQbHVnaW5NQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhuYW1lKS5sZW5ndGgpOwogICAgZGlnIDE4CiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGludGMgNSAvLyAxODkwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTUzCiAgICAvLyBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkgKyB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKQogICAgKwogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDktMTE1NAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkgKyB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKQogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQ5LTExNTUKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpICsgdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE1OAogICAgLy8gY29uc3QgZXNjcm93SUQgPSB0aGlzLm1heWJlTmV3RXNjcm93KGVzY3Jvdyk7CiAgICBkaWcgMTIKICAgIGNhbGxzdWIgbWF5YmVOZXdFc2Nyb3cKICAgIGJ1cnkgMTgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2MAogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZGlnIDUKICAgIGJ6IGFyYzU4X2FkZE5hbWVkUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMTkKICAgIGdsb2JhbCBSb3VuZAoKYXJjNThfYWRkTmFtZWRQbHVnaW5fdGVybmFyeV9tZXJnZUAyMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE3MgogICAgLy8gY2FuUmVjbGFpbTogZXNjcm93ICE9PSAnJyA/IGNhblJlY2xhaW0gOiBmYWxzZSwKICAgIGRpZyAxMwogICAgYnl0ZWNfMSAvLyAiIgogICAgIT0KICAgIGludGNfMCAvLyAwCiAgICBkaWcgNQogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2Mi0xMTc1CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgZXNjcm93OiBlc2Nyb3dJRCwKICAgIC8vICAgYWRtaW4sCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlLAogICAgLy8gICBsYXN0VmFsaWQsCiAgICAvLyAgIGNvb2xkb3duLAogICAgLy8gICBtZXRob2RzOiBjbG9uZShtZXRob2RJbmZvcyksCiAgICAvLyAgIHVzZVJvdW5kcywKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5LAogICAgLy8gICBjb3ZlckZlZXMsCiAgICAvLyAgIGNhblJlY2xhaW06IGVzY3JvdyAhPT0gJycgPyBjYW5SZWNsYWltIDogZmFsc2UsCiAgICAvLyAgIGxhc3RDYWxsZWQ6IDAsCiAgICAvLyAgIHN0YXJ0OiBlcG9jaFJlZgogICAgLy8gfQogICAgZGlnIDE5CiAgICBpdG9iCiAgICBkaWcgMTMKICAgIGNvbmNhdAogICAgZGlnIDEyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIGRpZyAxMQogICAgaXRvYgogICAgY29uY2F0CiAgICBieXRlYyAyOSAvLyAweDAwMmMKICAgIGNvbmNhdAogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDE2CiAgICBzZXRiaXQKICAgIGludGNfMSAvLyAxCiAgICBkaWcgMTAKICAgIHNldGJpdAogICAgaW50Y18yIC8vIDIKICAgIGRpZyA5CiAgICBzZXRiaXQKICAgIHB1c2hpbnQgMyAvLyAzCiAgICBkaWcgOAogICAgc2V0Yml0CiAgICBwdXNoaW50IDQgLy8gNAogICAgdW5jb3ZlciAzCiAgICBzZXRiaXQKICAgIGNvbmNhdAogICAgZGlnIDIzCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZGlnIDE5CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZGlnIDIxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2Mi0xMTc1CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgZXNjcm93OiBlc2Nyb3dJRCwKICAgIC8vICAgYWRtaW4sCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlLAogICAgLy8gICBsYXN0VmFsaWQsCiAgICAvLyAgIGNvb2xkb3duLAogICAgLy8gICBtZXRob2RzOiBjbG9uZShtZXRob2RJbmZvcyksCiAgICAvLyAgIHVzZVJvdW5kcywKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5LAogICAgLy8gICBjb3ZlckZlZXMsCiAgICAvLyAgIGNhblJlY2xhaW06IGVzY3JvdyAhPT0gJycgPyBjYW5SZWNsYWltIDogZmFsc2UsCiAgICAvLyAgIGxhc3RDYWxsZWQ6IDAsCiAgICAvLyAgIHN0YXJ0OiBlcG9jaFJlZgogICAgLy8gfQogICAgZHVwCiAgICBib3hfZGVsCiAgICBwb3AKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWMgNCAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMDEtMTExNgogICAgLy8gYXJjNThfYWRkTmFtZWRQbHVnaW4oCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFkbWluOiBib29sZWFuLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogVWludDgsCiAgICAvLyAgIGxhc3RWYWxpZDogdWludDY0LAogICAgLy8gICBjb29sZG93bjogdWludDY0LAogICAgLy8gICBtZXRob2RzOiBNZXRob2RSZXN0cmljdGlvbltdLAogICAgLy8gICB1c2VSb3VuZHM6IGJvb2xlYW4sCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogYm9vbGVhbiwKICAgIC8vICAgY292ZXJGZWVzOiBib29sZWFuLAogICAgLy8gICBjYW5SZWNsYWltOiBib29sZWFuLAogICAgLy8gICBkZWZhdWx0VG9Fc2Nyb3c6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfYWRkTmFtZWRQbHVnaW5fdGVybmFyeV9mYWxzZUAxOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2MAogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl90ZXJuYXJ5X21lcmdlQDIwCgphcmM1OF9hZGROYW1lZFBsdWdpbl9pZl9ib2R5QDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTM2CiAgICAvLyBhc3NlcnQoZXNjcm93ICE9PSAnJywgRVJSX0VTQ1JPV19SRVFVSVJFRF9UT19CRV9TRVRfQVNfREVGQVVMVCkKICAgIGRpZyAxMgogICAgYnl0ZWNfMSAvLyAiIgogICAgIT0KICAgIGFzc2VydCAvLyBlc2Nyb3cgbXVzdCBiZSBzZXQgaWYgZGVmYXVsdFRvRXNjcm93IGlzIHRydWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEzNwogICAgLy8gZXNjcm93S2V5ID0gJycKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGJ1cnkgMjEKICAgIGIgYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxMQoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA4OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9tZXJnZUA5CgphcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZW1vdmVOYW1lZFBsdWdpbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luOgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzEgLy8gIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE4NgogICAgLy8gYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW4obmFtZTogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE4NwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuY2FuUmV2b2tlKCksIEVSUl9PTkxZX0FETUlOX09SX1JFVk9DQVRJT05fQVBQX0NBTl9SRU1PVkVfUExVR0lOKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IGFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luX2Jvb2xfdHJ1ZUAzCiAgICBjYWxsc3ViIGNhblJldm9rZQogICAgYnogYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA0CgphcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgphcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9ib29sX21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExODcKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSB8fCB0aGlzLmNhblJldm9rZSgpLCBFUlJfT05MWV9BRE1JTl9PUl9SRVZPQ0FUSU9OX0FQUF9DQU5fUkVNT1ZFX1BMVUdJTik7CiAgICBhc3NlcnQgLy8gT25seSBhbiBhZG1pbiBvciByZXZvY2F0aW9uIGFwcCBjYW4gcmVtb3ZlIHBsdWdpbnMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0CiAgICAvLyBuYW1lZFBsdWdpbnMgPSBCb3hNYXA8c3RyaW5nLCBQbHVnaW5LZXk+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhOYW1lZFBsdWdpbnMgfSk7CiAgICBieXRlYyAxNSAvLyAibiIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE4OAogICAgLy8gYXNzZXJ0KHRoaXMubmFtZWRQbHVnaW5zKG5hbWUpLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCk7CiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTg5CiAgICAvLyBjb25zdCBhcHAgPSBjbG9uZSh0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS52YWx1ZSkKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIGJ1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE5MAogICAgLy8gYXNzZXJ0KHRoaXMucGx1Z2lucyhhcHApLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCk7CiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTkyCiAgICAvLyBjb25zdCBtZXRob2RzTGVuZ3RoOiB1aW50NjQgPSB0aGlzLnBsdWdpbnMoYXBwKS52YWx1ZS5tZXRob2RzLmxlbmd0aAogICAgZHVwCiAgICBwdXNoaW50IDQ0IC8vIDQ0CiAgICBpbnRjXzIgLy8gMgogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGJ1cnkgNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk0CiAgICAvLyB0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS5kZWxldGUoKTsKICAgIHN3YXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk1CiAgICAvLyB0aGlzLnBsdWdpbnMoYXBwKS5kZWxldGUoKTsKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk3CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTcKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAhPQogICAgYnogYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTgtMTIwMwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKSArIHRoaXMucGx1Z2luc01icihhcHAuZXNjcm93LCBtZXRob2RzTGVuZ3RoKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIwMAogICAgLy8gcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjAwCiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwMAogICAgLy8gcmV0dXJuIE1pbk5hbWVkUGx1Z2luTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMobmFtZSkubGVuZ3RoKTsKICAgIGRpZyAxCiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGludGMgNSAvLyAxODkwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjAxCiAgICAvLyBhbW91bnQ6IHRoaXMubmFtZWRQbHVnaW5zTWJyKG5hbWUpICsgdGhpcy5wbHVnaW5zTWJyKGFwcC5lc2Nyb3csIG1ldGhvZHNMZW5ndGgpCiAgICBkaWcgNAogICAgZHVwCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgc3Vic3RyaW5nMwogICAgZXh0cmFjdCAyIDAKICAgIGRpZyA0CiAgICBjYWxsc3ViIHBsdWdpbnNNYnIKICAgICsKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTgtMTIwMgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKSArIHRoaXMucGx1Z2luc01icihhcHAuZXNjcm93LCBtZXRob2RzTGVuZ3RoKQogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk4LTEyMDMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkgKyB0aGlzLnBsdWdpbnNNYnIoYXBwLmVzY3JvdywgbWV0aG9kc0xlbmd0aCkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE4NgogICAgLy8gYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW4obmFtZTogc3RyaW5nKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9uZXdFc2Nyb3dbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9uZXdFc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMTUKICAgIC8vIGFyYzU4X25ld0VzY3Jvdyhlc2Nyb3c6IHN0cmluZyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIxNgogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfQURNSU5fT05MWSk7CiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBhZG1pbiBvbmx5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjE3CiAgICAvLyBhc3NlcnQoIXRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19BTFJFQURZX0VYSVNUUyk7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBFc2Nyb3cgYWxyZWFkeSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIxOAogICAgLy8gYXNzZXJ0KGVzY3JvdyAhPT0gJycsIEVSUl9FU0NST1dfTkFNRV9SRVFVSVJFRCk7CiAgICBkdXAKICAgIGJ5dGVjXzEgLy8gIiIKICAgICE9CiAgICBhc3NlcnQgLy8gRXNjcm93IG5hbWUgaXMgcmVxdWlyZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIxOQogICAgLy8gcmV0dXJuIHRoaXMubmV3RXNjcm93KGVzY3Jvdyk7CiAgICBjYWxsc3ViIG5ld0VzY3JvdwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjE1CiAgICAvLyBhcmM1OF9uZXdFc2Nyb3coZXNjcm93OiBzdHJpbmcpOiB1aW50NjQgewogICAgaXRvYgogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3RvZ2dsZUVzY3Jvd0xvY2tbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF90b2dnbGVFc2Nyb3dMb2NrOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjI3CiAgICAvLyBhcmM1OF90b2dnbGVFc2Nyb3dMb2NrKGVzY3Jvdzogc3RyaW5nKTogRXNjcm93SW5mbyB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIyOAogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfRk9SQklEREVOKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIG9ubHkgdGhlIGNyZWF0b3Igd2FsbGV0IGNhbiBkZWxldGUgYSBzcGVuZGluZyBhY2NvdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMjkKICAgIC8vIGFzc2VydCh0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpOwogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIzMQogICAgLy8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUubG9ja2VkID0gIXRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmxvY2tlZDsKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICBwdXNoaW50IDY0IC8vIDY0CiAgICBnZXRiaXQKICAgICEKICAgIGRpZyAxCiAgICBpbnRjXzMgLy8gOAogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAyCiAgICBzZXRiaXQKICAgIGRpZyAxCiAgICBpbnRjXzMgLy8gOAogICAgdW5jb3ZlciAyCiAgICBib3hfcmVwbGFjZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIzNgogICAgLy8gcmV0dXJuIHRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlOwogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMjcKICAgIC8vIGFyYzU4X3RvZ2dsZUVzY3Jvd0xvY2soZXNjcm93OiBzdHJpbmcpOiBFc2Nyb3dJbmZvIHsKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWNsYWltW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVjbGFpbToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0NQogICAgLy8gYXJjNThfcmVjbGFpbShlc2Nyb3c6IHN0cmluZywgcmVjbGFpbXM6IEVzY3Jvd1JlY2xhaW1bXSk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAxNyAvLyAxNwogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ2NCx1aW50NjQsYm9vbDEpW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNDYKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0ZPUkJJRERFTik7CiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBvbmx5IHRoZSBjcmVhdG9yIHdhbGxldCBjYW4gZGVsZXRlIGEgc3BlbmRpbmcgYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0NwogICAgLy8gYXNzZXJ0KHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCk7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0OAogICAgLy8gdGhpcy5yZWNsYWltKGVzY3JvdywgcmVjbGFpbXMsIHRydWUpOwogICAgaW50Y18xIC8vIDEKICAgIGNhbGxzdWIgcmVjbGFpbQogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNDUKICAgIC8vIGFyYzU4X3JlY2xhaW0oZXNjcm93OiBzdHJpbmcsIHJlY2xhaW1zOiBFc2Nyb3dSZWNsYWltW10pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9wbHVnaW5SZWNsYWltW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcGx1Z2luUmVjbGFpbToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI2MC0xMjY1CiAgICAvLyBhcmM1OF9wbHVnaW5SZWNsYWltKAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgY2FsbGVyOiBBY2NvdW50LAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgcmVjbGFpbXM6IEVzY3Jvd1JlY2xhaW1bXQogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgY292ZXIgMwogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBjb3ZlciA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAxNyAvLyAxNwogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbisodWludDY0LHVpbnQ2NCxib29sMSlbXSkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI2NgogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyOiBjYWxsZXIsIGVzY3JvdyB9CiAgICBkaWcgMgogICAgaXRvYgogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBkaWcgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBieXRlYyAxMCAvLyAweDAwMmEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjY4CiAgICAvLyBhc3NlcnQodGhpcy5wbHVnaW5zKGtleSkuZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQbHVnaW4gZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI2OQogICAgLy8gYXNzZXJ0KHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlLmNhblJlY2xhaW0sIEVSUl9GT1JCSURERU4pCiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBnZXRiaXQKICAgIGFzc2VydCAvLyBvbmx5IHRoZSBjcmVhdG9yIHdhbGxldCBjYW4gZGVsZXRlIGEgc3BlbmRpbmcgYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNzAKICAgIC8vIGFzc2VydCh0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI3MwogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICB0eG4gU2VuZGVyCiAgICBzd2FwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjczLTEyNzQKICAgIC8vIFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcyB8fAogICAgLy8gVHhuLnNlbmRlciA9PT0gY2FsbGVyIHx8CiAgICBibnogYXJjNThfcGx1Z2luUmVjbGFpbV9ib29sX3RydWVANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjc0CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIHR4biBTZW5kZXIKICAgIGRpZyA0CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjczLTEyNzQKICAgIC8vIFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcyB8fAogICAgLy8gVHhuLnNlbmRlciA9PT0gY2FsbGVyIHx8CiAgICBibnogYXJjNThfcGx1Z2luUmVjbGFpbV9ib29sX3RydWVANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjc1CiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIGRpZyAzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNzMtMTI3NQogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgYnogYXJjNThfcGx1Z2luUmVjbGFpbV9ib29sX2ZhbHNlQDUKCmFyYzU4X3BsdWdpblJlY2xhaW1fYm9vbF90cnVlQDQ6CiAgICBpbnRjXzEgLy8gMQoKYXJjNThfcGx1Z2luUmVjbGFpbV9ib29sX21lcmdlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNzItMTI3NwogICAgLy8gYXNzZXJ0KAogICAgLy8gICBUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MgfHwKICAgIC8vICAgVHhuLnNlbmRlciA9PT0gY2FsbGVyIHx8CiAgICAvLyAgIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICBFUlJfRk9SQklEREVOCiAgICAvLyApCiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciB3YWxsZXQgY2FuIGRlbGV0ZSBhIHNwZW5kaW5nIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI3OQogICAgLy8gdGhpcy5yZWNsYWltKGVzY3JvdywgcmVjbGFpbXMsICF0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQpOwogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICAhCiAgICBkaWcgMwogICAgZGlnIDMKICAgIHVuY292ZXIgMgogICAgY2FsbHN1YiByZWNsYWltCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI2MC0xMjY1CiAgICAvLyBhcmM1OF9wbHVnaW5SZWNsYWltKAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgY2FsbGVyOiBBY2NvdW50LAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgcmVjbGFpbXM6IEVzY3Jvd1JlY2xhaW1bXQogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9wbHVnaW5SZWNsYWltX2Jvb2xfZmFsc2VANToKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X3BsdWdpblJlY2xhaW1fYm9vbF9tZXJnZUA2CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfb3B0SW5Fc2Nyb3dbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9vcHRJbkVzY3JvdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4OAogICAgLy8gYXJjNThfb3B0SW5Fc2Nyb3coZXNjcm93OiBzdHJpbmcsIGFzc2V0czogdWludDY0W10pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4OQogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfRk9SQklEREVOKQogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciB3YWxsZXQgY2FuIGRlbGV0ZSBhIHNwZW5kaW5nIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjXzIgLy8gImUiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOTAKICAgIC8vIGFzc2VydCh0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEVzY3JvdyBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjkxCiAgICAvLyBhc3NlcnQoIXRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmxvY2tlZCwgRVJSX0VTQ1JPV19MT0NLRUQpCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgIQogICAgYXNzZXJ0IC8vIEVzY3JvdyBpcyBsb2NrZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5MgogICAgLy8gdGhpcy5vcHRJbkVzY3Jvdyhlc2Nyb3csIGFzc2V0cyk7CiAgICBjYWxsc3ViIG9wdEluRXNjcm93CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4OAogICAgLy8gYXJjNThfb3B0SW5Fc2Nyb3coZXNjcm93OiBzdHJpbmcsIGFzc2V0czogdWludDY0W10pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3BsdWdpbk9wdEluRXNjcm93OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzA0LTEzMTAKICAgIC8vIGFyYzU4X3BsdWdpbk9wdEluRXNjcm93KAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgY2FsbGVyOiBBY2NvdW50LAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgYXNzZXRzOiB1aW50NjRbXSwKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuCiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICBjb3ZlciAzCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDUKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTEKICAgIC8vIGNvbnN0IGtleTogUGx1Z2luS2V5ID0geyBwbHVnaW4sIGNhbGxlcjogY2FsbGVyLCBlc2Nyb3cgfQogICAgZGlnIDIKICAgIGl0b2IKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBkaWcgMQogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZGlnIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgMTAgLy8gMHgwMDJhCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxMwogICAgLy8gYXNzZXJ0KHRoaXMucGx1Z2lucyhrZXkpLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzE0CiAgICAvLyBhc3NlcnQodGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxNQogICAgLy8gYXNzZXJ0KCF0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQsIEVSUl9FU0NST1dfTE9DS0VEKQogICAgYm94X2dldAogICAgcG9wCiAgICBwdXNoaW50IDY0IC8vIDY0CiAgICBnZXRiaXQKICAgICEKICAgIGFzc2VydCAvLyBFc2Nyb3cgaXMgbG9ja2VkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTgKICAgIC8vIFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcyB8fAogICAgdHhuIFNlbmRlcgogICAgc3dhcAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxOC0xMzE5CiAgICAvLyBUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MgfHwKICAgIC8vIFR4bi5zZW5kZXIgPT09IGNhbGxlciB8fAogICAgYm56IGFyYzU4X3BsdWdpbk9wdEluRXNjcm93X2Jvb2xfdHJ1ZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTkKICAgIC8vIFR4bi5zZW5kZXIgPT09IGNhbGxlciB8fAogICAgdHhuIFNlbmRlcgogICAgZGlnIDUKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTgtMTMxOQogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIGJueiBhcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd19ib29sX3RydWVANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzIwCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIGRpZyA0CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTgtMTMyMAogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgYnogYXJjNThfcGx1Z2luT3B0SW5Fc2Nyb3dfYm9vbF9mYWxzZUA1CgphcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd19ib29sX3RydWVANDoKICAgIGludGNfMSAvLyAxCgphcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd19ib29sX21lcmdlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTctMTMyMgogICAgLy8gYXNzZXJ0KAogICAgLy8gICBUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MgfHwKICAgIC8vICAgVHhuLnNlbmRlciA9PT0gY2FsbGVyIHx8CiAgICAvLyAgIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICBFUlJfRk9SQklEREVOCiAgICAvLyApCiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciB3YWxsZXQgY2FuIGRlbGV0ZSBhIHNwZW5kaW5nIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMyNC0xMzMxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkdXBuIDIKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMjcKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMyNwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzI0LTEzMzEKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICBzd2FwCiAgICBndHhucyBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMyOAogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGRpZyA0CiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMjQtMTMzMQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gaW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzMKICAgIC8vIHRoaXMub3B0SW5Fc2Nyb3coZXNjcm93LCBhc3NldHMpOwogICAgZGlnIDMKICAgIGRpZyAzCiAgICBjYWxsc3ViIG9wdEluRXNjcm93CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMwNC0xMzEwCiAgICAvLyBhcmM1OF9wbHVnaW5PcHRJbkVzY3JvdygKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFzc2V0czogdWludDY0W10sCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4bgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd19ib29sX2ZhbHNlQDU6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9wbHVnaW5PcHRJbkVzY3Jvd19ib29sX21lcmdlQDYKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9hZGRBbGxvd2FuY2VzW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfYWRkQWxsb3dhbmNlczoKICAgIGludGNfMCAvLyAwCiAgICBkdXBuIDQKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQyCiAgICAvLyBhcmM1OF9hZGRBbGxvd2FuY2VzKGVzY3Jvdzogc3RyaW5nLCBhbGxvd2FuY2VzOiBBZGRBbGxvd2FuY2VJbmZvW10pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIHB1c2hpbnQgMzQgLy8gMzQKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sMSlbXSkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM0MwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfQURNSU5fT05MWSk7CiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBhZG1pbiBvbmx5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDQKICAgIC8vIGFzc2VydCh0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpOwogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM0NQogICAgLy8gYXNzZXJ0KCF0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQsIEVSUl9FU0NST1dfTE9DS0VEKTsKICAgIGJveF9nZXQKICAgIHBvcAogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICAhCiAgICBhc3NlcnQgLy8gRXNjcm93IGlzIGxvY2tlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ3CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDcKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAhPQogICAgYnogYXJjNThfYWRkQWxsb3dhbmNlc19hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM0OC0xMzU0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhbGxvd2FuY2VzLmxlbmd0aAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM1MAogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM1MAogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM1MQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjA4CiAgICAvLyByZXR1cm4gTWluQWxsb3dhbmNlTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMoZXNjcm93KS5sZW5ndGgpOwogICAgZGlnIDQKICAgIGxlbgogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgaW50YyA2IC8vIDI3NzAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNTIKICAgIC8vIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhbGxvd2FuY2VzLmxlbmd0aAogICAgZGlnIDMKICAgICoKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ4LTEzNTMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSAqIGFsbG93YW5jZXMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDgtMTM1NAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuYWxsb3dhbmNlc01icihlc2Nyb3cpICogYWxsb3dhbmNlcy5sZW5ndGgKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKYXJjNThfYWRkQWxsb3dhbmNlc19hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNTcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhbGxvd2FuY2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA1CgphcmM1OF9hZGRBbGxvd2FuY2VzX3doaWxlX3RvcEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzU3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWxsb3dhbmNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZGlnIDQKICAgIGRpZyAxCiAgICA8CiAgICBieiBhcmM1OF9hZGRBbGxvd2FuY2VzX2FmdGVyX3doaWxlQDEwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNTgKICAgIC8vIGNvbnN0IHsgYXNzZXQsIHR5cGUsIGFtb3VudCwgbWF4LCBpbnRlcnZhbCwgdXNlUm91bmRzIH0gPSBhbGxvd2FuY2VzW2ldOwogICAgZGlnIDEKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgNQogICAgcHVzaGludCAzNCAvLyAzNAogICAgKgogICAgcHVzaGludCAzNCAvLyAzNAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGV4dHJhY3QgMCA4CiAgICBkaWcgMQogICAgZXh0cmFjdCA4IDEKICAgIGJ1cnkgOAogICAgZGlnIDEKICAgIGV4dHJhY3QgOSA4CiAgICBidXJ5IDEyCiAgICBkaWcgMQogICAgZXh0cmFjdCAxNyA4CiAgICBidXJ5IDExCiAgICBkaWcgMQogICAgZXh0cmFjdCAyNSA4CiAgICBidXJ5IDEwCiAgICBzd2FwCiAgICBwdXNoaW50IDI2NCAvLyAyNjQKICAgIGdldGJpdAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM1OQogICAgLy8gY29uc3Qga2V5OiBBbGxvd2FuY2VLZXkgPSB7IGVzY3JvdywgYXNzZXQgfQogICAgZGlnIDQKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlYyAxNyAvLyAweDAwMGEKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY4CiAgICAvLyBhbGxvd2FuY2VzID0gQm94TWFwPEFsbG93YW5jZUtleSwgQWxsb3dhbmNlSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEFsbG93YW5jZXMgfSkgLy8gMzhfNTAwCiAgICBieXRlYyAxOCAvLyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM2MAogICAgLy8gYXNzZXJ0KCF0aGlzLmFsbG93YW5jZXMoa2V5KS5leGlzdHMsIEVSUl9BTExPV0FOQ0VfQUxSRUFEWV9FWElTVFMpOwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQgLy8gYWxsb3dhbmNlIGFscmVhZHkgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNjEKICAgIC8vIGNvbnN0IHN0YXJ0ID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGJ6IGFyYzU4X2FkZEFsbG93YW5jZXNfdGVybmFyeV9mYWxzZUA4CiAgICBnbG9iYWwgUm91bmQKCmFyYzU4X2FkZEFsbG93YW5jZXNfdGVybmFyeV9tZXJnZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzYzLTEzNzIKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlID0gewogICAgLy8gICB0eXBlLAogICAgLy8gICBzcGVudDogMCwKICAgIC8vICAgYW1vdW50LAogICAgLy8gICBsYXN0OiAwLAogICAgLy8gICBtYXgsCiAgICAvLyAgIGludGVydmFsLAogICAgLy8gICBzdGFydCwKICAgIC8vICAgdXNlUm91bmRzCiAgICAvLyB9CiAgICBkaWcgNgogICAgZGlnIDEwCiAgICBjb25jYXQKICAgIGRpZyAxMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNjUKICAgIC8vIHNwZW50OiAwLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM2My0xMzcyCiAgICAvLyB0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgdHlwZSwKICAgIC8vICAgc3BlbnQ6IDAsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgbGFzdDogMCwKICAgIC8vICAgbWF4LAogICAgLy8gICBpbnRlcnZhbCwKICAgIC8vICAgc3RhcnQsCiAgICAvLyAgIHVzZVJvdW5kcwogICAgLy8gfQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDEwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgc3dhcAogICAgaXRvYgogICAgY29uY2F0CiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICBkaWcgNgogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIGRpZyA3CiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNTcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhbGxvd2FuY2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgNAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgNQogICAgYiBhcmM1OF9hZGRBbGxvd2FuY2VzX3doaWxlX3RvcEA1CgphcmM1OF9hZGRBbGxvd2FuY2VzX3Rlcm5hcnlfZmFsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM2MQogICAgLy8gY29uc3Qgc3RhcnQgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYiBhcmM1OF9hZGRBbGxvd2FuY2VzX3Rlcm5hcnlfbWVyZ2VAOQoKYXJjNThfYWRkQWxsb3dhbmNlc19hZnRlcl93aGlsZUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWMgNCAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDIKICAgIC8vIGFyYzU4X2FkZEFsbG93YW5jZXMoZXNjcm93OiBzdHJpbmcsIGFsbG93YW5jZXM6IEFkZEFsbG93YW5jZUluZm9bXSk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3JlbW92ZUFsbG93YW5jZXNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzOgogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg1CiAgICAvLyBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzKGVzY3Jvdzogc3RyaW5nLCBhc3NldHM6IHVpbnQ2NFtdKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg2CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5jYW5SZXZva2UoKSwgRVJSX09OTFlfQURNSU5fT1JfUkVWT0NBVElPTl9BUFBfQ0FOX1JFTU9WRV9NRVRIT0RfUkVTVFJJQ1RJT04pOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBibnogYXJjNThfcmVtb3ZlQWxsb3dhbmNlc19ib29sX3RydWVAMwogICAgY2FsbHN1YiBjYW5SZXZva2UKICAgIGJ6IGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYm9vbF9mYWxzZUA0CgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18xIC8vIDEKCmFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg2CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5jYW5SZXZva2UoKSwgRVJSX09OTFlfQURNSU5fT1JfUkVWT0NBVElPTl9BUFBfQ0FOX1JFTU9WRV9NRVRIT0RfUkVTVFJJQ1RJT04pOwogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gb3IgcmV2b2NhdGlvbiBhcHAgY2FuIHJlbW92ZSBtZXRob2QgcmVzdHJpY3Rpb25zCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgZGlnIDMKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg3CiAgICAvLyBhc3NlcnQodGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXNjcm93IGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzODgKICAgIC8vIGFzc2VydCghdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUubG9ja2VkLCBFUlJfRVNDUk9XX0xPQ0tFRCk7CiAgICBib3hfZ2V0CiAgICBwb3AKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgIQogICAgYXNzZXJ0IC8vIEVzY3JvdyBpcyBsb2NrZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM5MAogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzkwCiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTEtMTM5NgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTMKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM5MwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMDgKICAgIC8vIHJldHVybiBNaW5BbGxvd2FuY2VNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhlc2Nyb3cpLmxlbmd0aCk7CiAgICBkaWcgMwogICAgbGVuCiAgICBpbnRjIDQgLy8gNDAwCiAgICAqCiAgICBpbnRjIDYgLy8gMjc3MDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM5NAogICAgLy8gYW1vdW50OiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSAqIGFzc2V0cy5sZW5ndGgKICAgIGRpZyAyCiAgICAqCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzkxLTEzOTUKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTEtMTM5NgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKYXJjNThfcmVtb3ZlQWxsb3dhbmNlc19hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDQKCmFyYzU4X3JlbW92ZUFsbG93YW5jZXNfd2hpbGVfdG9wQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyAzCiAgICBkaWcgMQogICAgPAogICAgYnogYXJjNThfcmVtb3ZlQWxsb3dhbmNlc19hZnRlcl93aGlsZUAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDAyCiAgICAvLyBhc3NldDogYXNzZXRzW2ldCiAgICBkaWcgMQogICAgZXh0cmFjdCAyIDAKICAgIGRpZyA0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MDAtMTQwMwogICAgLy8gY29uc3Qga2V5OiBBbGxvd2FuY2VLZXkgPSB7CiAgICAvLyAgIGVzY3JvdywKICAgIC8vICAgYXNzZXQ6IGFzc2V0c1tpXQogICAgLy8gfQogICAgZGlnIDQKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlYyAxNyAvLyAweDAwMGEKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY4CiAgICAvLyBhbGxvd2FuY2VzID0gQm94TWFwPEFsbG93YW5jZUtleSwgQWxsb3dhbmNlSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEFsbG93YW5jZXMgfSkgLy8gMzhfNTAwCiAgICBieXRlYyAxOCAvLyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDA0CiAgICAvLyBhc3NlcnQodGhpcy5hbGxvd2FuY2VzKGtleSkuZXhpc3RzLCBFUlJfQUxMT1dBTkNFX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBhbGxvd2FuY2UgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwNQogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzk5CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSA0CiAgICBiIGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfd2hpbGVfdG9wQDkKCmFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYWZ0ZXJfd2hpbGVAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjIDQgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg1CiAgICAvLyBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzKGVzY3Jvdzogc3RyaW5nLCBhc3NldHM6IHVpbnQ2NFtdKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2Jvb2xfZmFsc2VANDoKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfYWRkRXhlY3V0aW9uS2V5W3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfYWRkRXhlY3V0aW9uS2V5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIwCiAgICAvLyBhcmM1OF9hZGRFeGVjdXRpb25LZXkobGVhc2U6IGJ5dGVzPDMyPiwgZ3JvdXBzOiBieXRlczwzMj5bXSwgZmlyc3RWYWxpZDogdWludDY0LCBsYXN0VmFsaWQ6IHVpbnQ2NCk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAzMiAvLyAzMgogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFszMl1bXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIxCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9BRE1JTl9PTkxZKQogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gYWRtaW4gb25seQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MjIKICAgIC8vIGlmICghdGhpcy5leGVjdXRpb25zKGxlYXNlKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYm56IGFyYzU4X2FkZEV4ZWN1dGlvbktleV9lbHNlX2JvZHlAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIzLTE0MjcKICAgIC8vIHRoaXMuZXhlY3V0aW9ucyhsZWFzZSkudmFsdWUgPSB7CiAgICAvLyAgIGdyb3VwczogY2xvbmUoZ3JvdXBzKSwKICAgIC8vICAgZmlyc3RWYWxpZCwKICAgIC8vICAgbGFzdFZhbGlkCiAgICAvLyB9CiAgICBkaWcgMwogICAgaXRvYgogICAgcHVzaGJ5dGVzIDB4MDAxMgogICAgc3dhcAogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBkaWcgMQogICAgZHVwCiAgICBib3hfZGVsCiAgICBwb3AKICAgIHN3YXAKICAgIGJveF9wdXQKCmFyYzU4X2FkZEV4ZWN1dGlvbktleV9hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjIDQgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIwCiAgICAvLyBhcmM1OF9hZGRFeGVjdXRpb25LZXkobGVhc2U6IGJ5dGVzPDMyPiwgZ3JvdXBzOiBieXRlczwzMj5bXSwgZmlyc3RWYWxpZDogdWludDY0LCBsYXN0VmFsaWQ6IHVpbnQ2NCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfYWRkRXhlY3V0aW9uS2V5X2Vsc2VfYm9keUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDI5CiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKGxlYXNlKS52YWx1ZS5maXJzdFZhbGlkID09PSBmaXJzdFZhbGlkLCBFUlJfRVhFQ1VUSU9OX0tFWV9VUERBVEVfTVVTVF9NQVRDSF9GSVJTVF9WQUxJRCkKICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMiAvLyAyCiAgICBpbnRjXzMgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGRpZyA1CiAgICA9PQogICAgYXNzZXJ0IC8vIGV4ZWN1dGlvbiBrZXkgdXBkYXRlIG11c3QgbWF0Y2ggZmlyc3QgdmFsaWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzMAogICAgLy8gYXNzZXJ0KHRoaXMuZXhlY3V0aW9ucyhsZWFzZSkudmFsdWUubGFzdFZhbGlkID09PSBsYXN0VmFsaWQsIEVSUl9FWEVDVVRJT05fS0VZX1VQREFURV9NVVNUX01BVENIX0xBU1RfVkFMSUQpCiAgICBkdXAKICAgIHB1c2hpbnQgMTAgLy8gMTAKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgdW5jb3ZlciAzCiAgICA9PQogICAgYXNzZXJ0IC8vIGV4ZWN1dGlvbiBrZXkgdXBkYXRlIG11c3QgbWF0Y2ggbGFzdCB2YWxpZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMyCiAgICAvLyB0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlLmdyb3VwcyA9IFsuLi5jbG9uZSh0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlLmdyb3VwcyksIC4uLmNsb25lKGdyb3VwcyldCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIGRpZyAyCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICB1bmNvdmVyIDQKICAgIGV4dHJhY3QgMiAwCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIGR1cAogICAgZXh0cmFjdCAyIDAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgLwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIHVuY292ZXIgMgogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMwogICAgZXh0cmFjdDMKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGJveF9kZWwKICAgIHBvcAogICAgYm94X3B1dAogICAgYiBhcmM1OF9hZGRFeGVjdXRpb25LZXlfYWZ0ZXJfaWZfZWxzZUA0CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5W3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDQ0CiAgICAvLyBhcmM1OF9yZW1vdmVFeGVjdXRpb25LZXkobGVhc2U6IGJ5dGVzPDMyPik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NDUKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLmV4aXN0cywgRVJSX0VYRUNVVElPTl9LRVlfTk9UX0ZPVU5EKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXhlY3V0aW9uIGtleSBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0NgogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuZXhlY3V0aW9ucyhsZWFzZSkudmFsdWUubGFzdFZhbGlkIDwgR2xvYmFsLnJvdW5kLCBFUlJfQURNSU5fT05MWSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IGFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleV9ib29sX3RydWVAMwogICAgZHVwCiAgICBwdXNoaW50IDEwIC8vIDEwCiAgICBpbnRjXzMgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGdsb2JhbCBSb3VuZAogICAgPAogICAgYnogYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5X2Jvb2xfZmFsc2VANAoKYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5X2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18xIC8vIDEKCmFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleV9ib29sX21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NDYKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSB8fCB0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlLmxhc3RWYWxpZCA8IEdsb2JhbC5yb3VuZCwgRVJSX0FETUlOX09OTFkpCiAgICBhc3NlcnQgLy8gYWRtaW4gb25seQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDQ4CiAgICAvLyB0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLmRlbGV0ZSgpCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0NAogICAgLy8gYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5KGxlYXNlOiBieXRlczwzMj4pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleV9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9yZW1vdmVFeGVjdXRpb25LZXlfYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0QWRtaW5bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXRBZG1pbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ2MgogICAgLy8gcmV0dXJuIHRoaXMuYWRtaW4udmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNwogICAgLy8gYWRtaW4gPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQWRtaW4gfSkKICAgIGJ5dGVjIDEzIC8vICJhZG1pbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ2MgogICAgLy8gcmV0dXJuIHRoaXMuYWRtaW4udmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NjAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2dldFBsdWdpbnNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXRQbHVnaW5zOgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzEgLy8gIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NzMKICAgIC8vIGxldCBwbHVnaW5zOiBQbHVnaW5JbmZvW10gPSBbXQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9nZXRQbHVnaW5zX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZGlnIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBidXJ5IDUKICAgIGRpZyAxCiAgICA+CiAgICBieiBhcmM1OF9nZXRQbHVnaW5zX2FmdGVyX3doaWxlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3NQogICAgLy8gaWYgKHRoaXMucGx1Z2lucyhrZXlzW2ldKS5leGlzdHMpIHsKICAgIGRpZyAyCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGRpZyAxCiAgICBzd2FwCiAgICBleHRyYWN0X3VpbnQxNgogICAgdW5jb3ZlciAyCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZHVwCiAgICBidXJ5IDQKICAgIGRpZyA2CiAgICBkaWcgMQogICAgLSAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGRpZyAzCiAgICBsZW4KICAgIHVuY292ZXIgMgogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGRpZyA0CiAgICBzd2FwCiAgICBleHRyYWN0X3VpbnQxNgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHN1YnN0cmluZzMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc1CiAgICAvLyBpZiAodGhpcy5wbHVnaW5zKGtleXNbaV0pLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXRQbHVnaW5zX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc2CiAgICAvLyBwbHVnaW5zLnB1c2godGhpcy5wbHVnaW5zKGtleXNbaV0pLnZhbHVlKQogICAgZGlnIDQKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHN3YXAKICAgIGV4dHJhY3QgMiAwCiAgICBieXRlYyAxMiAvLyAweDAwMDIKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICBjb3ZlciAyCiAgICBpbnRjXzEgLy8gMQogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NzcKICAgIC8vIGNvbnRpbnVlCiAgICBiIGFyYzU4X2dldFBsdWdpbnNfd2hpbGVfdG9wQDIKCmFyYzU4X2dldFBsdWdpbnNfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc5CiAgICAvLyBwbHVnaW5zLnB1c2goZW1wdHlQbHVnaW5JbmZvKCkpCiAgICBjYWxsc3ViIGVtcHR5UGx1Z2luSW5mbwogICAgZGlnIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgYnl0ZWMgMTIgLy8gMHgwMDAyCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXRQbHVnaW5zX3doaWxlX3RvcEAyCgphcmM1OF9nZXRQbHVnaW5zX2FmdGVyX3doaWxlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NzEKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBkaWcgMgogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9nZXROYW1lZFBsdWdpbnNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXROYW1lZFBsdWdpbnM6CiAgICBpbnRjXzAgLy8gMAogICAgZHVwCiAgICBieXRlY18xIC8vICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkyCiAgICAvLyBsZXQgcGx1Z2luczogUGx1Z2luSW5mb1tdID0gW10KICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTMKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCmFyYzU4X2dldE5hbWVkUGx1Z2luc193aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ5MwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMQogICAgPgogICAgZHVwCiAgICBidXJ5IDUKICAgIGJ6IGFyYzU4X2dldE5hbWVkUGx1Z2luc19hZnRlcl93aGlsZUA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTQKICAgIC8vIGlmICh0aGlzLm5hbWVkUGx1Z2lucyhuYW1lc1tpXSkuZXhpc3RzKSB7CiAgICBkaWcgMgogICAgZXh0cmFjdCAyIDAKICAgIGRpZyA0CiAgICBhc3NlcnQgLy8gaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGRpZyAxCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgZGlnIDEKICAgIHN3YXAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGV4dHJhY3QzCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQKICAgIC8vIG5hbWVkUGx1Z2lucyA9IEJveE1hcDxzdHJpbmcsIFBsdWdpbktleT4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeE5hbWVkUGx1Z2lucyB9KTsKICAgIGJ5dGVjIDE1IC8vICJuIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDk0CiAgICAvLyBpZiAodGhpcy5uYW1lZFBsdWdpbnMobmFtZXNbaV0pLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfYWZ0ZXJfaWZfZWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTUKICAgIC8vIGNvbnN0IG5hbWVLZXkgPSBjbG9uZSh0aGlzLm5hbWVkUGx1Z2lucyhuYW1lc1tpXSkudmFsdWUpCiAgICBkaWcgNQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDk2CiAgICAvLyBpZiAodGhpcy5wbHVnaW5zKG5hbWVLZXkpLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfYWZ0ZXJfaWZfZWxzZUA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTcKICAgIC8vIHBsdWdpbnMucHVzaCh0aGlzLnBsdWdpbnMobmFtZUtleSkudmFsdWUpCiAgICBkaWcgNAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIGJ5dGVjIDEyIC8vIDB4MDAwMgogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIGNvdmVyIDIKICAgIGludGNfMSAvLyAxCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50CiAgICBidXJ5IDIKCmFyYzU4X2dldE5hbWVkUGx1Z2luc19ibG9ja0A4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkzCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfd2hpbGVfdG9wQDIKCmFyYzU4X2dldE5hbWVkUGx1Z2luc19hZnRlcl9pZl9lbHNlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MDAKICAgIC8vIHBsdWdpbnMucHVzaChlbXB0eVBsdWdpbkluZm8oKSkKICAgIGNhbGxzdWIgZW1wdHlQbHVnaW5JbmZvCiAgICBkaWcgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHN3YXAKICAgIGV4dHJhY3QgMiAwCiAgICBieXRlYyAxMiAvLyAweDAwMDIKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICBjb3ZlciAyCiAgICBpbnRjXzEgLy8gMQogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MDEKICAgIC8vIGNvbnRpbnVlCiAgICBiIGFyYzU4X2dldE5hbWVkUGx1Z2luc19ibG9ja0A4CgphcmM1OF9nZXROYW1lZFBsdWdpbnNfYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTAzCiAgICAvLyBwbHVnaW5zLnB1c2goZW1wdHlQbHVnaW5JbmZvKCkpCiAgICBjYWxsc3ViIGVtcHR5UGx1Z2luSW5mbwogICAgZGlnIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgYnl0ZWMgMTIgLy8gMHgwMDAyCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfYmxvY2tAOAoKYXJjNThfZ2V0TmFtZWRQbHVnaW5zX2FmdGVyX3doaWxlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OTAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBkaWcgMgogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9nZXRFc2Nyb3dzW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfZ2V0RXNjcm93czoKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MTQKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE2CiAgICAvLyBsZXQgcmVzdWx0OiBFc2Nyb3dJbmZvW10gPSBbXQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxNwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGVzY3Jvd3MubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9nZXRFc2Nyb3dzX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgZXNjcm93cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZGlnIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgID4KICAgIGR1cAogICAgYnVyeSA1CiAgICBieiBhcmM1OF9nZXRFc2Nyb3dzX2FmdGVyX3doaWxlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxOAogICAgLy8gaWYgKHRoaXMuZXNjcm93cyhlc2Nyb3dzW2ldKS5leGlzdHMpIHsKICAgIGRpZyAyCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDQKICAgIGFzc2VydCAvLyBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZGlnIDEKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBkaWcgMQogICAgc3dhcAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cDIKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZXh0cmFjdDMKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE4CiAgICAvLyBpZiAodGhpcy5lc2Nyb3dzKGVzY3Jvd3NbaV0pLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXRFc2Nyb3dzX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE5CiAgICAvLyByZXN1bHQucHVzaCh0aGlzLmVzY3Jvd3MoZXNjcm93c1tpXSkudmFsdWUpCiAgICBkaWcgNAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGRpZyAyCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBzd2FwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcmVwbGFjZTIgMAogICAgYnVyeSAyCgphcmM1OF9nZXRFc2Nyb3dzX2Jsb2NrQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MTcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBlc2Nyb3dzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYXJjNThfZ2V0RXNjcm93c193aGlsZV90b3BAMgoKYXJjNThfZ2V0RXNjcm93c19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MjIKICAgIC8vIHJlc3VsdC5wdXNoKGVtcHR5RXNjcm93SW5mbygpKQogICAgZGlnIDEKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6MjItMjUKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGlkOiAwLAogICAgLy8gICBsb2NrZWQ6IGZhbHNlCiAgICAvLyB9OwogICAgcHVzaGJ5dGVzIDB4MDAwMDAwMDAwMDAwMDAwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MjIKICAgIC8vIHJlc3VsdC5wdXNoKGVtcHR5RXNjcm93SW5mbygpKQogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBzd2FwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcmVwbGFjZTIgMAogICAgYnVyeSAyCiAgICBiIGFyYzU4X2dldEVzY3Jvd3NfYmxvY2tANgoKYXJjNThfZ2V0RXNjcm93c19hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0QWxsb3dhbmNlc1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2dldEFsbG93YW5jZXM6CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTM0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwbiAyCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDY0W10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MzYKICAgIC8vIGxldCByZXN1bHQ6IEFsbG93YW5jZUluZm9bXSA9IFtdCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUzNwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCmFyYzU4X2dldEFsbG93YW5jZXNfd2hpbGVfdG9wQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MzcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgZGlnIDQKICAgIDwKICAgIGJ6IGFyYzU4X2dldEFsbG93YW5jZXNfYWZ0ZXJfd2hpbGVANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTM4CiAgICAvLyBjb25zdCBrZXk6IEFsbG93YW5jZUtleSA9IHsgZXNjcm93LCBhc3NldDogYXNzZXRzW2ldIH0KICAgIGRpZyA0CiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkaWcgNgogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjIDE3IC8vIDB4MDAwYQogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjgKICAgIC8vIGFsbG93YW5jZXMgPSBCb3hNYXA8QWxsb3dhbmNlS2V5LCBBbGxvd2FuY2VJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4QWxsb3dhbmNlcyB9KSAvLyAzOF81MDAKICAgIGJ5dGVjIDE4IC8vICJhIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGJ1cnkgOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTM5CiAgICAvLyBpZiAodGhpcy5hbGxvd2FuY2VzKGtleSkuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IGFyYzU4X2dldEFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NDAKICAgIC8vIHJlc3VsdC5wdXNoKHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlKQogICAgZGlnIDYKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgoKYXJjNThfZ2V0QWxsb3dhbmNlc19ibG9ja0A2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTM3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYXJjNThfZ2V0QWxsb3dhbmNlc193aGlsZV90b3BAMgoKYXJjNThfZ2V0QWxsb3dhbmNlc19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC91dGlscy50czozMAogICAgLy8gdHlwZTogdWludDgoMCksCiAgICBpbnRjXzAgLy8gMAogICAgY2FsbHN1YiB1aW50OAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6MjktMzgKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IHVpbnQ4KDApLAogICAgLy8gICBtYXg6IDAsCiAgICAvLyAgIGFtb3VudDogMCwKICAgIC8vICAgc3BlbnQ6IDAsCiAgICAvLyAgIGludGVydmFsOiAwLAogICAgLy8gICBsYXN0OiAwLAogICAgLy8gICBzdGFydDogMCwKICAgIC8vICAgdXNlUm91bmRzOiBmYWxzZQogICAgLy8gfTsKICAgIGRpZyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTQzCiAgICAvLyByZXN1bHQucHVzaChlbXB0eUFsbG93YW5jZUluZm8oKSkKICAgIGRpZyAyCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBzd2FwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcmVwbGFjZTIgMAogICAgYnVyeSAyCiAgICBiIGFyYzU4X2dldEFsbG93YW5jZXNfYmxvY2tANgoKYXJjNThfZ2V0QWxsb3dhbmNlc19hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTM0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0RXhlY3V0aW9uc1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2dldEV4ZWN1dGlvbnM6CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NTYKICAgIC8vIGxldCByZXN1bHQ6IEV4ZWN1dGlvbkluZm9bXSA9IFtdCiAgICBieXRlYyA3IC8vIDB4MDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbGVhc2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYXJjNThfZ2V0RXhlY3V0aW9uc193aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1NwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGxlYXNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBkaWcgMwogICAgPAogICAgYnogYXJjNThfZ2V0RXhlY3V0aW9uc19hZnRlcl93aGlsZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NTgKICAgIC8vIGlmICh0aGlzLmV4ZWN1dGlvbnMobGVhc2VzW2ldKS5leGlzdHMpIHsKICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1OAogICAgLy8gaWYgKHRoaXMuZXhlY3V0aW9ucyhsZWFzZXNbaV0pLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXRFeGVjdXRpb25zX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU5CiAgICAvLyByZXN1bHQucHVzaCh0aGlzLmV4ZWN1dGlvbnMobGVhc2VzW2ldKS52YWx1ZSkKICAgIGRpZyA0CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZGlnIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgYnl0ZWMgMTIgLy8gMHgwMDAyCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgoKYXJjNThfZ2V0RXhlY3V0aW9uc19ibG9ja0A2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbGVhc2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYXJjNThfZ2V0RXhlY3V0aW9uc193aGlsZV90b3BAMgoKYXJjNThfZ2V0RXhlY3V0aW9uc19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NjIKICAgIC8vIHJlc3VsdC5wdXNoKGVtcHR5RXhlY3V0aW9uSW5mbygpKQogICAgZGlnIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgaW50Y18xIC8vIDEKICAgIHB1c2hieXRlcyAweDAwMDIwMDEyMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudAogICAgYnVyeSAyCiAgICBiIGFyYzU4X2dldEV4ZWN1dGlvbnNfYmxvY2tANgoKYXJjNThfZ2V0RXhlY3V0aW9uc19hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0RG9tYWluS2V5c1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2dldERvbWFpbktleXM6CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTczCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NzUKICAgIC8vIGxldCByZXN1bHQ6IHN0cmluZ1tdID0gW10KICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NzYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhZGRyZXNzZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9nZXREb21haW5LZXlzX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTc2CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWRkcmVzc2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGRpZyAzCiAgICA8CiAgICBieiBhcmM1OF9nZXREb21haW5LZXlzX2FmdGVyX3doaWxlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3NwogICAgLy8gaWYgKHRoaXMuZG9tYWluS2V5cyhhZGRyZXNzZXNbaV0pLmV4aXN0cykgewogICAgZGlnIDMKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMQogICAgcHVzaGludCAzMiAvLyAzMgogICAgKgogICAgcHVzaGludCAzMiAvLyAzMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZG9tYWluS2V5cyA9IEJveE1hcDxBY2NvdW50LCBzdHJpbmc+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhEb21haW5LZXlzIH0pCiAgICBieXRlYyAxNiAvLyAiZCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3NwogICAgLy8gaWYgKHRoaXMuZG9tYWluS2V5cyhhZGRyZXNzZXNbaV0pLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXREb21haW5LZXlzX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTc4CiAgICAvLyByZXN1bHQucHVzaCh0aGlzLmRvbWFpbktleXMoYWRkcmVzc2VzW2ldKS52YWx1ZSkKICAgIGRpZyA0CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGRpZyAyCiAgICBzd2FwCiAgICBpbnRjXzEgLy8gMQogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkCiAgICBidXJ5IDIKCmFyYzU4X2dldERvbWFpbktleXNfYmxvY2tANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3NgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGFyYzU4X2dldERvbWFpbktleXNfd2hpbGVfdG9wQDIKCmFyYzU4X2dldERvbWFpbktleXNfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTgxCiAgICAvLyByZXN1bHQucHVzaCgiIikKICAgIGRpZyAxCiAgICBieXRlYyA3IC8vIDB4MDAwMAogICAgaW50Y18xIC8vIDEKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZAogICAgYnVyeSAyCiAgICBiIGFyYzU4X2dldERvbWFpbktleXNfYmxvY2tANgoKYXJjNThfZ2V0RG9tYWluS2V5c19hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTczCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQubWJyW3JvdXRpbmddKCkgLT4gdm9pZDoKbWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTk1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjA0CiAgICAvLyByZXR1cm4gTWluRXNjcm93c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKGVzY3JvdykubGVuZ3RoKTsKICAgIGRpZyAzCiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIHB1c2hpbnQgNjUwMCAvLyA2NTAwCiAgICBkaWcgMQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjA1CiAgICAvLyBwbHVnaW5zOiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93LCBtZXRob2RDb3VudCksCiAgICBkaWcgNQogICAgdW5jb3ZlciA1CiAgICBjYWxsc3ViIHBsdWdpbnNNYnIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjAwCiAgICAvLyByZXR1cm4gTWluTmFtZWRQbHVnaW5NQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhuYW1lKS5sZW5ndGgpOwogICAgdW5jb3ZlciA0CiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGludGMgNSAvLyAxODkwMAogICAgZGlnIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjA4CiAgICAvLyByZXR1cm4gTWluQWxsb3dhbmNlTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMoZXNjcm93KS5sZW5ndGgpOwogICAgaW50YyA2IC8vIDI3NzAwCiAgICB1bmNvdmVyIDUKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjE2CiAgICAvLyByZXR1cm4gTWluRG9tYWluS2V5c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKGRvbWFpbikubGVuZ3RoKQogICAgcHVzaGludCAxNTcwMCAvLyAxNTcwMAogICAgdW5jb3ZlciAzCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIxMgogICAgLy8gcmV0dXJuIE1pbkV4ZWN1dGlvbnNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiAoZ3JvdXBzICogMzIpKTsKICAgIHVuY292ZXIgNQogICAgcHVzaGludCAxMjgwMCAvLyAxMjgwMAogICAgKgogICAgcHVzaGludCAyMDUwMCAvLyAyMDUwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIHVuY292ZXIgNwogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MTEKICAgIC8vIGVzY3Jvd0V4aXN0czogdGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLAogICAgYm94X2xlbgogICAgY292ZXIgNgogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MTQKICAgIC8vIEdsb2JhbC5taW5CYWxhbmNlICsKICAgIGdsb2JhbCBNaW5CYWxhbmNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MTMtMTYxNQogICAgLy8gTmV3Q29zdEZvckFSQzU4ICsKICAgIC8vIEdsb2JhbC5taW5CYWxhbmNlICsKICAgIC8vIEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01iciArCiAgICBwdXNoaW50IDE2MjEwMCAvLyAxNjIxMDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYxMy0xNjE2CiAgICAvLyBOZXdDb3N0Rm9yQVJDNTggKwogICAgLy8gR2xvYmFsLm1pbkJhbGFuY2UgKwogICAgLy8gQVJDNThXYWxsZXRJRHNCeUFjY291bnRzTWJyICsKICAgIC8vIGVzY3Jvd3MKICAgIGRpZyA3CiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MDQtMTYxOAogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgcGx1Z2luczogdGhpcy5wbHVnaW5zTWJyKGVzY3JvdywgbWV0aG9kQ291bnQpLAogICAgLy8gICBuYW1lZFBsdWdpbnM6IHRoaXMubmFtZWRQbHVnaW5zTWJyKHBsdWdpbiksCiAgICAvLyAgIGVzY3Jvd3MsCiAgICAvLyAgIGFsbG93YW5jZXM6IHRoaXMuYWxsb3dhbmNlc01icihlc2Nyb3cpLAogICAgLy8gICBkb21haW5LZXlzOiB0aGlzLmRvbWFpbktleXNNYnIocGx1Z2luKSwKICAgIC8vICAgZXhlY3V0aW9uczogdGhpcy5leGVjdXRpb25zTWJyKGdyb3VwcyksCiAgICAvLyAgIGVzY3Jvd0V4aXN0czogdGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLAogICAgLy8gICBuZXdFc2Nyb3dNaW50Q29zdDogKAogICAgLy8gICAgIE5ld0Nvc3RGb3JBUkM1OCArCiAgICAvLyAgICAgR2xvYmFsLm1pbkJhbGFuY2UgKwogICAgLy8gICAgIEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01iciArCiAgICAvLyAgICAgZXNjcm93cwogICAgLy8gICApCiAgICAvLyB9CiAgICB1bmNvdmVyIDUKICAgIGl0b2IKICAgIHVuY292ZXIgNQogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDYKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciA0CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgMgogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciA0CiAgICBzZXRiaXQKICAgIGNvbmNhdAogICAgc3dhcAogICAgaXRvYgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1OTUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2Vbcm91dGluZ10oKSAtPiB2b2lkOgpiYWxhbmNlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjI3CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDY0W10pCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UKICAgIHBvcAogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LnBsdWdpbnNNYnIoZXNjcm93OiBieXRlcywgbWV0aG9kQ291bnQ6IHVpbnQ2NCkgLT4gdWludDY0OgpwbHVnaW5zTWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTMKICAgIC8vIHByaXZhdGUgcGx1Z2luc01icihlc2Nyb3c6IHN0cmluZywgbWV0aG9kQ291bnQ6IHVpbnQ2NCk6IHVpbnQ2NCB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTk1CiAgICAvLyBCb3hDb3N0UGVyQnl0ZSAqICgoTWV0aG9kUmVzdHJpY3Rpb25CeXRlTGVuZ3RoICogbWV0aG9kQ291bnQpICsgQnl0ZXMoZXNjcm93KS5sZW5ndGgpCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICBmcmFtZV9kaWcgLTEKICAgICoKICAgIGZyYW1lX2RpZyAtMgogICAgbGVuCiAgICArCiAgICBpbnRjIDQgLy8gNDAwCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5NAogICAgLy8gcmV0dXJuIE1pblBsdWdpbk1CUiArICgKICAgIHB1c2hpbnQgMzg5MDAgLy8gMzg5MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTk0LTE5NgogICAgLy8gcmV0dXJuIE1pblBsdWdpbk1CUiArICgKICAgIC8vICAgQm94Q29zdFBlckJ5dGUgKiAoKE1ldGhvZFJlc3RyaWN0aW9uQnl0ZUxlbmd0aCAqIG1ldGhvZENvdW50KSArIEJ5dGVzKGVzY3JvdykubGVuZ3RoKQogICAgLy8gKTsKICAgICsKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50Lm1heWJlTmV3RXNjcm93KGVzY3JvdzogYnl0ZXMpIC0+IHVpbnQ2NDoKbWF5YmVOZXdFc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIxOQogICAgLy8gcHJpdmF0ZSBtYXliZU5ld0VzY3Jvdyhlc2Nyb3c6IHN0cmluZyk6IHVpbnQ2NCB7CiAgICBwcm90byAxIDEKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIyMAogICAgLy8gaWYgKGVzY3JvdyA9PT0gJycpIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnl0ZWNfMSAvLyAiIgogICAgPT0KICAgIGJ6IG1heWJlTmV3RXNjcm93X2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjEKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAogICAgc3dhcAogICAgcmV0c3ViCgptYXliZU5ld0VzY3Jvd19hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlY18yIC8vICJlIgogICAgZnJhbWVfZGlnIC0xCiAgICBjb25jYXQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIyNAogICAgLy8gcmV0dXJuIHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIyNC0yMjYKICAgIC8vIHJldHVybiB0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMKICAgIC8vICAgPyB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5pZAogICAgLy8gICA6IHRoaXMubmV3RXNjcm93KGVzY3JvdykKICAgIGJ6IG1heWJlTmV3RXNjcm93X3Rlcm5hcnlfZmFsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjUKICAgIC8vID8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQKICAgIGZyYW1lX2RpZyAwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CgptYXliZU5ld0VzY3Jvd190ZXJuYXJ5X21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIyNC0yMjYKICAgIC8vIHJldHVybiB0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMKICAgIC8vICAgPyB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5pZAogICAgLy8gICA6IHRoaXMubmV3RXNjcm93KGVzY3JvdykKICAgIHN3YXAKICAgIHJldHN1YgoKbWF5YmVOZXdFc2Nyb3dfdGVybmFyeV9mYWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjYKICAgIC8vIDogdGhpcy5uZXdFc2Nyb3coZXNjcm93KQogICAgZnJhbWVfZGlnIC0xCiAgICBjYWxsc3ViIG5ld0VzY3JvdwogICAgYiBtYXliZU5ld0VzY3Jvd190ZXJuYXJ5X21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5uZXdFc2Nyb3coZXNjcm93OiBieXRlcykgLT4gdWludDY0OgpuZXdFc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIyOQogICAgLy8gcHJpdmF0ZSBuZXdFc2Nyb3coZXNjcm93OiBzdHJpbmcpOiB1aW50NjQgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIzMAogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzAKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAhPQogICAgYnogbmV3RXNjcm93X2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzEtMjM3CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5lc2Nyb3dzTWJyKGVzY3JvdykKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIzMwogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjMzCiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzQKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwNAogICAgLy8gcmV0dXJuIE1pbkVzY3Jvd3NNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhlc2Nyb3cpLmxlbmd0aCk7CiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgcHVzaGludCA2NTAwIC8vIDY1MDAKICAgICsKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzEtMjM2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5lc2Nyb3dzTWJyKGVzY3JvdykKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjMxLTIzNwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuZXNjcm93c01icihlc2Nyb3cpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCm5ld0VzY3Jvd19hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0MC0yNTAKICAgIC8vIGNvbnN0IGlkID0gYWJpQ2FsbDx0eXBlb2YgRXNjcm93RmFjdG9yeS5wcm90b3R5cGUubmV3Pih7CiAgICAvLyAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYXBwSWQ6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZSwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgICBhbW91bnQ6IE5ld0Nvc3RGb3JBUkM1OCArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgLy8gICAgICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzCiAgICAvLyAgICAgfSksCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0NQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjQ1CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNDYKICAgIC8vIGFtb3VudDogTmV3Q29zdEZvckFSQzU4ICsgR2xvYmFsLm1pbkJhbGFuY2UsCiAgICBwdXNoaW50IDE1MDAwMCAvLyAxNTAwMDAKICAgIGdsb2JhbCBNaW5CYWxhbmNlCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0NwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTEKICAgIC8vIGVzY3Jvd0ZhY3RvcnkgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0VzY3Jvd0ZhY3RvcnkgfSkKICAgIGJ5dGVjIDIxIC8vICJlc2Nyb3dfZmFjdG9yeSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjQ3CiAgICAvLyByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjQ0LTI0OAogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICBhbW91bnQ6IE5ld0Nvc3RGb3JBUkM1OCArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgLy8gICByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MKICAgIC8vIH0pLAogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNDAtMjUwCiAgICAvLyBjb25zdCBpZCA9IGFiaUNhbGw8dHlwZW9mIEVzY3Jvd0ZhY3RvcnkucHJvdG90eXBlLm5ldz4oewogICAgLy8gICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgIGFwcElkOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgICAgYW1vdW50OiBOZXdDb3N0Rm9yQVJDNTggKyBHbG9iYWwubWluQmFsYW5jZSwKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcwogICAgLy8gICAgIH0pLAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9uZXh0CiAgICBwdXNoYnl0ZXMgMHhkODVjZjE4NCAvLyBtZXRob2QgIm5ldyhwYXkpdWludDY0IgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBnaXR4biAxIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjUyCiAgICAvLyB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZSA9IHsgaWQsIGxvY2tlZDogZmFsc2UgfQogICAgZHVwCiAgICBpdG9iCiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI1MgogICAgLy8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUgPSB7IGlkLCBsb2NrZWQ6IGZhbHNlIH0KICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjU0CiAgICAvLyByZXR1cm4gaWQ7CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5pc0FkbWluKCkgLT4gdWludDY0Ogppc0FkbWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNjAKICAgIC8vIFR4bi5zZW5kZXIgPT09IHRoaXMuYWRtaW4udmFsdWUgfHwKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNwogICAgLy8gYWRtaW4gPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQWRtaW4gfSkKICAgIGJ5dGVjIDEzIC8vICJhZG1pbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYwCiAgICAvLyBUeG4uc2VuZGVyID09PSB0aGlzLmFkbWluLnZhbHVlIHx8CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYwLTI2MQogICAgLy8gVHhuLnNlbmRlciA9PT0gdGhpcy5hZG1pbi52YWx1ZSB8fAogICAgLy8gKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIGJueiBpc0FkbWluX2Jvb2xfdHJ1ZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZG9tYWluS2V5cyA9IEJveE1hcDxBY2NvdW50LCBzdHJpbmc+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhEb21haW5LZXlzIH0pCiAgICBieXRlYyAxNiAvLyAiZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYxCiAgICAvLyAodGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLmV4aXN0cyAmJiB0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikudmFsdWUgPT09IHRoaXMuZG9tYWluLnZhbHVlKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MQogICAgLy8gKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogaXNBZG1pbl9ib29sX2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTgxCiAgICAvLyBkb21haW5LZXlzID0gQm94TWFwPEFjY291bnQsIHN0cmluZz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeERvbWFpbktleXMgfSkKICAgIGJ5dGVjIDE2IC8vICJkIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNjEKICAgIC8vICh0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikuZXhpc3RzICYmIHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS52YWx1ZSA9PT0gdGhpcy5kb21haW4udmFsdWUpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZG9tYWluS2V5cyA9IEJveE1hcDxBY2NvdW50LCBzdHJpbmc+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhEb21haW5LZXlzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYxCiAgICAvLyAodGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLmV4aXN0cyAmJiB0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikudmFsdWUgPT09IHRoaXMuZG9tYWluLnZhbHVlKQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOQogICAgLy8gZG9tYWluID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRG9tYWluIH0pOwogICAgYnl0ZWMgMjAgLy8gImRvbWFpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYxCiAgICAvLyAodGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLmV4aXN0cyAmJiB0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikudmFsdWUgPT09IHRoaXMuZG9tYWluLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgID09CiAgICBieiBpc0FkbWluX2Jvb2xfZmFsc2VANAoKaXNBZG1pbl9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI1OS0yNjIKICAgIC8vIHJldHVybiAoCiAgICAvLyAgIFR4bi5zZW5kZXIgPT09IHRoaXMuYWRtaW4udmFsdWUgfHwKICAgIC8vICAgKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIC8vICkKICAgIHJldHN1YgoKaXNBZG1pbl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNTktMjYyCiAgICAvLyByZXR1cm4gKAogICAgLy8gICBUeG4uc2VuZGVyID09PSB0aGlzLmFkbWluLnZhbHVlIHx8CiAgICAvLyAgICh0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikuZXhpc3RzICYmIHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS52YWx1ZSA9PT0gdGhpcy5kb21haW4udmFsdWUpCiAgICAvLyApCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5jYW5SZXZva2UoKSAtPiB1aW50NjQ6CmNhblJldm9rZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjY3CiAgICAvLyByZXR1cm4gVHhuLnNlbmRlciA9PT0gdGhpcy5yZXZvY2F0aW9uLnZhbHVlLmFkZHJlc3MKICAgIHR4biBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NQogICAgLy8gcmV2b2NhdGlvbiA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlSZXZvY2F0aW9uIH0pCiAgICBieXRlYyAyMiAvLyAicmV2b2NhdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjY3CiAgICAvLyByZXR1cm4gVHhuLnNlbmRlciA9PT0gdGhpcy5yZXZvY2F0aW9uLnZhbHVlLmFkZHJlc3MKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQucGx1Z2luQ2FsbEFsbG93ZWQocGx1Z2luOiB1aW50NjQsIGNhbGxlcjogYnl0ZXMsIGVzY3JvdzogYnl0ZXMsIG1ldGhvZDogYnl0ZXMpIC0+IHVpbnQ2NDoKcGx1Z2luQ2FsbEFsbG93ZWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI3MAogICAgLy8gcHJpdmF0ZSBwbHVnaW5DYWxsQWxsb3dlZChwbHVnaW46IHVpbnQ2NCwgY2FsbGVyOiBBY2NvdW50LCBlc2Nyb3c6IHN0cmluZywgbWV0aG9kOiBieXRlczw0Pik6IGJvb2xlYW4gewogICAgcHJvdG8gNCAxCiAgICBieXRlY18xIC8vICIiCiAgICBkdXBuIDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjcxCiAgICAvLyBjb25zdCBrZXk6IFBsdWdpbktleSA9IHsgcGx1Z2luLCBjYWxsZXIsIGVzY3JvdyB9CiAgICBmcmFtZV9kaWcgLTQKICAgIGl0b2IKICAgIGZyYW1lX2RpZyAtMwogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTIKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAtMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBieXRlYyAxMCAvLyAweDAwMmEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI3MwogICAgLy8gaWYgKCF0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYm56IHBsdWdpbkNhbGxBbGxvd2VkX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNzQKICAgIC8vIHJldHVybiBmYWxzZTsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKcGx1Z2luQ2FsbEFsbG93ZWRfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIGNvbnN0IHsgbWV0aG9kcywgdXNlUm91bmRzLCBsYXN0Q2FsbGVkLCBjb29sZG93biwgdXNlRXhlY3V0aW9uS2V5IH0gPSB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZSBhcyBSZWFkb25seTxQbHVnaW5JbmZvPgogICAgZnJhbWVfZGlnIDYKICAgIGR1cAogICAgcHVzaGludCAxNyAvLyAxNwogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9idXJ5IDAKICAgIGR1cAogICAgcHVzaGludCAyNyAvLyAyNwogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICBnZXRiaXQKICAgIGZyYW1lX2J1cnkgNQogICAgaW50Y18yIC8vIDIKICAgIGdldGJpdAogICAgc3dhcAogICAgcHVzaGludCAyOCAvLyAyOAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9idXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjc5CiAgICAvLyBpZiAodXNlRXhlY3V0aW9uS2V5KSB7CiAgICBieiBwbHVnaW5DYWxsQWxsb3dlZF9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjgwCiAgICAvLyByZXR1cm4gZmFsc2UKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKcGx1Z2luQ2FsbEFsbG93ZWRfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyODMKICAgIC8vIGxldCBtZXRob2RBbGxvd2VkID0gbWV0aG9kcy5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlOwogICAgZnJhbWVfZGlnIDYKICAgIHB1c2hpbnQgNDQgLy8gNDQKICAgIGludGNfMiAvLyAyCiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgIQogICAgZnJhbWVfYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI4NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDIKCnBsdWdpbkNhbGxBbGxvd2VkX3doaWxlX3RvcEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyODQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgNgogICAgcHVzaGludCA0NCAvLyA0NAogICAgaW50Y18yIC8vIDIKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9kaWcgMgogICAgPgogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfYmxvY2tAMTAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjg1CiAgICAvLyBpZiAobWV0aG9kc1tpXS5zZWxlY3RvciA9PT0gbWV0aG9kKSB7CiAgICBmcmFtZV9kaWcgMgogICAgcHVzaGludCAyMCAvLyAyMAogICAgKgogICAgcHVzaGludCA0NiAvLyA0NgogICAgKwogICAgZnJhbWVfZGlnIDYKICAgIHN3YXAKICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgIGJveF9leHRyYWN0CiAgICBleHRyYWN0IDAgNAogICAgZnJhbWVfZGlnIC0xCiAgICA9PQogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfYWZ0ZXJfaWZfZWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI4NgogICAgLy8gbWV0aG9kQWxsb3dlZCA9IHRydWU7CiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfYnVyeSA0CgpwbHVnaW5DYWxsQWxsb3dlZF9ibG9ja0AxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjkxCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBmcmFtZV9kaWcgNQogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfdGVybmFyeV9mYWxzZUAxMgogICAgZ2xvYmFsIFJvdW5kCiAgICBmcmFtZV9idXJ5IDEKCnBsdWdpbkNhbGxBbGxvd2VkX3Rlcm5hcnlfbWVyZ2VAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI5NAogICAgLy8gbGFzdENhbGxlZCA+PSBlcG9jaFJlZiAmJgogICAgZnJhbWVfZGlnIDMKICAgIGZyYW1lX2RpZyAxCiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTQtMjk1CiAgICAvLyBsYXN0Q2FsbGVkID49IGVwb2NoUmVmICYmCiAgICAvLyAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA+PSBjb29sZG93biAmJgogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfYm9vbF9mYWxzZUAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTUKICAgIC8vIChlcG9jaFJlZiAtIGxhc3RDYWxsZWQpID49IGNvb2xkb3duICYmCiAgICBmcmFtZV9kaWcgMQogICAgZnJhbWVfZGlnIDMKICAgIC0KICAgIGZyYW1lX2RpZyAwCiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTQtMjk1CiAgICAvLyBsYXN0Q2FsbGVkID49IGVwb2NoUmVmICYmCiAgICAvLyAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA+PSBjb29sZG93biAmJgogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfYm9vbF9mYWxzZUAxNgogICAgaW50Y18xIC8vIDEKCnBsdWdpbkNhbGxBbGxvd2VkX2Jvb2xfbWVyZ2VAMTc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI5NC0yOTYKICAgIC8vIGxhc3RDYWxsZWQgPj0gZXBvY2hSZWYgJiYKICAgIC8vIChlcG9jaFJlZiAtIGxhc3RDYWxsZWQpID49IGNvb2xkb3duICYmCiAgICAvLyBtZXRob2RBbGxvd2VkCiAgICBmcmFtZV9kaWcgNAogICAgJiYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjkzLTI5NwogICAgLy8gcmV0dXJuICgKICAgIC8vICAgbGFzdENhbGxlZCA+PSBlcG9jaFJlZiAmJgogICAgLy8gICAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA+PSBjb29sZG93biAmJgogICAgLy8gICBtZXRob2RBbGxvd2VkCiAgICAvLyApCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKcGx1Z2luQ2FsbEFsbG93ZWRfYm9vbF9mYWxzZUAxNjoKICAgIGludGNfMCAvLyAwCiAgICBiIHBsdWdpbkNhbGxBbGxvd2VkX2Jvb2xfbWVyZ2VAMTcKCnBsdWdpbkNhbGxBbGxvd2VkX3Rlcm5hcnlfZmFsc2VAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI5MQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZnJhbWVfYnVyeSAxCiAgICBiIHBsdWdpbkNhbGxBbGxvd2VkX3Rlcm5hcnlfbWVyZ2VAMTMKCnBsdWdpbkNhbGxBbGxvd2VkX2FmdGVyX2lmX2Vsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjg0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDIKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBmcmFtZV9idXJ5IDIKICAgIGIgcGx1Z2luQ2FsbEFsbG93ZWRfd2hpbGVfdG9wQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC50eG5SZWtleXNCYWNrKHR4bjogdWludDY0KSAtPiB1aW50NjQ6CnR4blJla2V5c0JhY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwMAogICAgLy8gcHJpdmF0ZSB0eG5SZWtleXNCYWNrKHR4bjogZ3R4bi5UcmFuc2FjdGlvbik6IGJvb2xlYW4gewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwMwogICAgLy8gdHhuLnNlbmRlciA9PT0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAmJgogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBTZW5kZXIKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwMwogICAgLy8gdHhuLnNlbmRlciA9PT0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAmJgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwMy0zMDQKICAgIC8vIHR4bi5zZW5kZXIgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgJiYKICAgIC8vIHR4bi5yZWtleVRvID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgYnogdHhuUmVrZXlzQmFja19hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzA0CiAgICAvLyB0eG4ucmVrZXlUbyA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGZyYW1lX2RpZyAtMQogICAgZ3R4bnMgUmVrZXlUbwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwMy0zMDQKICAgIC8vIHR4bi5zZW5kZXIgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgJiYKICAgIC8vIHR4bi5yZWtleVRvID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgYnogdHhuUmVrZXlzQmFja19hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzA2CiAgICAvLyByZXR1cm4gdHJ1ZTsKICAgIGludGNfMSAvLyAxCiAgICByZXRzdWIKCnR4blJla2V5c0JhY2tfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTAKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICBmcmFtZV9kaWcgLTEKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDYgLy8gNgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwLTMxMQogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICBieiB0eG5SZWtleXNCYWNrX2Jvb2xfZmFsc2VAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTEKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICBmcmFtZV9kaWcgLTEKICAgIGd0eG5zIEFwcGxpY2F0aW9uSUQKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25JRAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwLTMxMQogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICBieiB0eG5SZWtleXNCYWNrX2Jvb2xfZmFsc2VAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTIKICAgIC8vICYmIHR4bi5udW1BcHBBcmdzID09PSAxCiAgICBmcmFtZV9kaWcgLTEKICAgIGd0eG5zIE51bUFwcEFyZ3MKICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTAtMzEyCiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIC8vICYmIHR4bi5udW1BcHBBcmdzID09PSAxCiAgICBieiB0eG5SZWtleXNCYWNrX2Jvb2xfZmFsc2VAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTMKICAgIC8vICYmIHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcAogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBPbkNvbXBsZXRpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwLTMxMwogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICAvLyAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMQogICAgLy8gJiYgdHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wCiAgICBibnogdHhuUmVrZXlzQmFja19ib29sX2ZhbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzE0CiAgICAvLyAmJiB0eG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3IoJ2FyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkJykKICAgIGZyYW1lX2RpZyAtMQogICAgaW50Y18wIC8vIDAKICAgIGd0eG5zYXMgQXBwbGljYXRpb25BcmdzCiAgICBieXRlYyAyNSAvLyBtZXRob2QgImFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkIgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwLTMxNAogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICAvLyAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMQogICAgLy8gJiYgdHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wCiAgICAvLyAmJiB0eG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3IoJ2FyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkJykKICAgIGJ6IHR4blJla2V5c0JhY2tfYm9vbF9mYWxzZUA5CiAgICBpbnRjXzEgLy8gMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDktMzE1CiAgICAvLyByZXR1cm4gKAogICAgLy8gICB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gICAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgLy8gICAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMQogICAgLy8gICAmJiB0eG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AKICAgIC8vICAgJiYgdHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yKCdhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpdm9pZCcpCiAgICAvLyApCiAgICByZXRzdWIKCnR4blJla2V5c0JhY2tfYm9vbF9mYWxzZUA5OgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzA5LTMxNQogICAgLy8gcmV0dXJuICgKICAgIC8vICAgdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICAgJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIC8vICAgJiYgdHhuLm51bUFwcEFyZ3MgPT09IDEKICAgIC8vICAgJiYgdHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wCiAgICAvLyAgICYmIHR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3RvcignYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3MoKXZvaWQnKQogICAgLy8gKQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQucGx1Z2luQ2hlY2soa2V5OiBieXRlcykgLT4gYnl0ZXMsIGJ5dGVzOgpwbHVnaW5DaGVjazoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzMyCiAgICAvLyBwcml2YXRlIHBsdWdpbkNoZWNrKGtleTogUGx1Z2luS2V5KTogUGx1Z2luVmFsaWRhdGlvbiB7CiAgICBwcm90byAxIDIKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGR1cG4gMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMzNAogICAgLy8gY29uc3QgZXhpc3RzID0gdGhpcy5wbHVnaW5zKGtleSkuZXhpc3RzOwogICAgYm94X2xlbgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMzUKICAgIC8vIGlmICghZXhpc3RzKSB7CiAgICBibnogcGx1Z2luQ2hlY2tfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMzNi0zNDEKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGV4aXN0czogZmFsc2UsCiAgICAvLyAgIGV4cGlyZWQ6IHRydWUsCiAgICAvLyAgIG9uQ29vbGRvd246IHRydWUsCiAgICAvLyAgIGhhc01ldGhvZFJlc3RyaWN0aW9uczogZmFsc2UsCiAgICAvLyB9CiAgICBwdXNoYnl0ZXMgMHg2MAogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9idXJ5IDEKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgpwbHVnaW5DaGVja19hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM0NAogICAgLy8gY29uc3QgeyB1c2VSb3VuZHMsIGxhc3RWYWxpZCwgY29vbGRvd24sIGxhc3RDYWxsZWQsIG1ldGhvZHMgfSA9IHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlIGFzIFJlYWRvbmx5PFBsdWdpbkluZm8+CiAgICBmcmFtZV9kaWcgMwogICAgZHVwCiAgICBwdXNoaW50IDkgLy8gOQogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9idXJ5IDIKICAgIGR1cAogICAgcHVzaGludCAxNyAvLyAxNwogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9idXJ5IDAKICAgIGR1cAogICAgcHVzaGludCAyNyAvLyAyNwogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBzd2FwCiAgICBwdXNoaW50IDI4IC8vIDI4CiAgICBpbnRjXzMgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNDUKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGJ6IHBsdWdpbkNoZWNrX3Rlcm5hcnlfZmFsc2VANAogICAgZ2xvYmFsIFJvdW5kCgpwbHVnaW5DaGVja190ZXJuYXJ5X21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM0OQogICAgLy8gZXhwaXJlZDogZXBvY2hSZWYgPiBsYXN0VmFsaWQsCiAgICBkdXAKICAgIGZyYW1lX2RpZyAyCiAgICA+CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM1MAogICAgLy8gb25Db29sZG93bjogKGVwb2NoUmVmIC0gbGFzdENhbGxlZCkgPCBjb29sZG93biwKICAgIHN3YXAKICAgIGZyYW1lX2RpZyAxCiAgICAtCiAgICBmcmFtZV9kaWcgMAogICAgPAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNTEKICAgIC8vIGhhc01ldGhvZFJlc3RyaWN0aW9uczogbWV0aG9kcy5sZW5ndGggPiAwLAogICAgZnJhbWVfZGlnIDMKICAgIHB1c2hpbnQgNDQgLy8gNDQKICAgIGludGNfMiAvLyAyCiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgaW50Y18wIC8vIDAKICAgID4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzQ3LTM1MgogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZXhpc3RzLAogICAgLy8gICBleHBpcmVkOiBlcG9jaFJlZiA+IGxhc3RWYWxpZCwKICAgIC8vICAgb25Db29sZG93bjogKGVwb2NoUmVmIC0gbGFzdENhbGxlZCkgPCBjb29sZG93biwKICAgIC8vICAgaGFzTWV0aG9kUmVzdHJpY3Rpb25zOiBtZXRob2RzLmxlbmd0aCA+IDAsCiAgICAvLyB9CiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9kaWcgNAogICAgc2V0Yml0CiAgICBpbnRjXzEgLy8gMQogICAgdW5jb3ZlciA0CiAgICBzZXRiaXQKICAgIGludGNfMiAvLyAyCiAgICB1bmNvdmVyIDMKICAgIHNldGJpdAogICAgcHVzaGludCAzIC8vIDMKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2J1cnkgMQogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCnBsdWdpbkNoZWNrX3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzQ1CiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBiIHBsdWdpbkNoZWNrX3Rlcm5hcnlfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50Lm9wdEluRXNjcm93KGVzY3JvdzogYnl0ZXMsIGFzc2V0czogYnl0ZXMpIC0+IGJ5dGVzOgpvcHRJbkVzY3JvdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDczCiAgICAvLyBwcml2YXRlIG9wdEluRXNjcm93KGVzY3Jvdzogc3RyaW5nLCBhc3NldHM6IHVpbnQ2NFtdKTogdm9pZCB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjXzIgLy8gImUiCiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NzQKICAgIC8vIGNvbnN0IGVzY3Jvd0FkZHJlc3MgPSBBcHBsaWNhdGlvbih0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5pZCkuYWRkcmVzcwogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgc3dhcAogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDc2LTQ4MgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ3OAogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDc4CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0ODAKICAgIC8vIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciA0CiAgICAqCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDc2LTQ4MQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NzYtNDgyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCm9wdEluRXNjcm93X3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0ODQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAyCiAgICBmcmFtZV9kaWcgMQogICAgPAogICAgYnogb3B0SW5Fc2Nyb3dfYWZ0ZXJfd2hpbGVANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0ODUtNDkyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0c1tpXQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ5MAogICAgLy8geGZlckFzc2V0OiBhc3NldHNbaV0KICAgIGZyYW1lX2RpZyAtMQogICAgZXh0cmFjdCAyIDAKICAgIGZyYW1lX2RpZyAyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDg5CiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBmcmFtZV9kaWcgMAogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4NS00OTEKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICAgIHhmZXJBc3NldDogYXNzZXRzW2ldCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4NS00OTIKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICAgIHhmZXJBc3NldDogYXNzZXRzW2ldCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMgogICAgYiBvcHRJbkVzY3Jvd193aGlsZV90b3BAMgoKb3B0SW5Fc2Nyb3dfYWZ0ZXJfd2hpbGVANToKICAgIGZyYW1lX2RpZyAtMQogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5yZWNsYWltKGVzY3JvdzogYnl0ZXMsIHJlY2xhaW1zOiBieXRlcywgYWxsb3dDbG9zZU91dDogdWludDY0KSAtPiBieXRlczoKcmVjbGFpbToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDk2CiAgICAvLyBwcml2YXRlIHJlY2xhaW0oZXNjcm93OiBzdHJpbmcsIHJlY2xhaW1zOiBFc2Nyb3dSZWNsYWltW10sIGFsbG93Q2xvc2VPdXQ6IGJvb2xlYW4pOiB2b2lkIHsKICAgIHByb3RvIDMgMQogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwbiAyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIGZyYW1lX2RpZyAtMwogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ5NwogICAgLy8gY29uc3Qgc2VuZGVyID0gQXBwbGljYXRpb24odGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQpLmFkZHJlc3MKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDk5CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcmVjbGFpbXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgpyZWNsYWltX3doaWxlX3RvcEAxOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0OTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCByZWNsYWltcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIC0yCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyA3CiAgICA+CiAgICBieiByZWNsYWltX2FmdGVyX3doaWxlQDEzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwMAogICAgLy8gaWYgKHJlY2xhaW1zW2ldLmFzc2V0ID09PSAwKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIGV4dHJhY3QgMiAwCiAgICBmcmFtZV9kaWcgNwogICAgcHVzaGludCAxNyAvLyAxNwogICAgKgogICAgcHVzaGludCAxNyAvLyAxNwogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMgogICAgYm56IHJlY2xhaW1fZWxzZV9ib2R5QDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTAxLTUwNQogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYW1vdW50OiByZWNsYWltc1tpXS5hbW91bnQKICAgIC8vIH0pLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MDMKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTAzCiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwNAogICAgLy8gYW1vdW50OiByZWNsYWltc1tpXS5hbW91bnQKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBmcmFtZV9kaWcgNgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTAxLTUwNQogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYW1vdW50OiByZWNsYWltc1tpXS5hbW91bnQKICAgIC8vIH0pLnN1Ym1pdCgpOwogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKCnJlY2xhaW1fYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDk5CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcmVjbGFpbXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyA3CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSA3CiAgICBiIHJlY2xhaW1fd2hpbGVfdG9wQDEKCnJlY2xhaW1fZWxzZV9ib2R5QDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwOQogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwOQogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDEKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTEwCiAgICAvLyBhc3NldEFtb3VudDogcmVjbGFpbXNbaV0uYW1vdW50LAogICAgZnJhbWVfZGlnIDAKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwNwogICAgLy8gY29uc3QgeGZlciA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxNAogICAgLy8gaWYgKGFsbG93Q2xvc2VPdXQgJiYgcmVjbGFpbXNbaV0uY2xvc2VPdXQpIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnogcmVjbGFpbV9hZnRlcl9pZl9lbHNlQDgKICAgIGZyYW1lX2RpZyAwCiAgICBwdXNoaW50IDEyOCAvLyAxMjgKICAgIGdldGJpdAogICAgYnogcmVjbGFpbV9hZnRlcl9pZl9lbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTE1CiAgICAvLyB4ZmVyLnNldCh7IGFzc2V0Q2xvc2VUbzogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSB9KTsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxNQogICAgLy8geGZlci5zZXQoeyBhc3NldENsb3NlVG86IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgfSk7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18xIC8vIDEKICAgIGZyYW1lX2J1cnkgNAogICAgZnJhbWVfYnVyeSA1CgpyZWNsYWltX2FmdGVyX2lmX2Vsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTE4CiAgICAvLyB4ZmVyLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgZnJhbWVfZGlnIDQKICAgIGJ6IHJlY2xhaW1fbmV4dF9maWVsZEAxMAogICAgZnJhbWVfZGlnIDUKICAgIGl0eG5fZmllbGQgQXNzZXRDbG9zZVRvCgpyZWNsYWltX25leHRfZmllbGRAMTA6CiAgICBmcmFtZV9kaWcgMgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGZyYW1lX2RpZyAzCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBmcmFtZV9kaWcgMQogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBmcmFtZV9kaWcgNgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTA3LTUxMgogICAgLy8gY29uc3QgeGZlciA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYXNzZXRBbW91bnQ6IHJlY2xhaW1zW2ldLmFtb3VudCwKICAgIC8vICAgeGZlckFzc2V0OiByZWNsYWltc1tpXS5hc3NldAogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTE4CiAgICAvLyB4ZmVyLnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKICAgIGIgcmVjbGFpbV9hZnRlcl9pZl9lbHNlQDEyCgpyZWNsYWltX2FmdGVyX3doaWxlQDEzOgogICAgZnJhbWVfZGlnIC0yCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW4ocGx1Z2luOiB1aW50NjQsIGdsb2JhbDogdWludDY0LCBlc2Nyb3c6IGJ5dGVzLCBtZXRob2RPZmZzZXRzOiBieXRlcywgZnVuZHNSZXF1ZXN0OiBieXRlcykgLT4gYnl0ZXMsIGJ5dGVzOgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NjQtODcwCiAgICAvLyBhcmM1OF9yZWtleVRvUGx1Z2luKAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgZ2xvYmFsOiBib29sZWFuLAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgbWV0aG9kT2Zmc2V0czogdWludDY0W10sCiAgICAvLyAgIGZ1bmRzUmVxdWVzdDogRnVuZHNSZXF1ZXN0W10KICAgIC8vICk6IHZvaWQgewogICAgcHJvdG8gNSAyCiAgICBpbnRjXzAgLy8gMAogICAgZHVwbiAxMQogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwbiAyMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NzIKICAgIC8vIGNvbnN0IGNhbGxlciA9IGdsb2JhbCA/IEdsb2JhbC56ZXJvQWRkcmVzcyA6IFR4bi5zZW5kZXIKICAgIGZyYW1lX2RpZyAtNAogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDIKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg3MwogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyLCBlc2Nyb3cgfQogICAgZnJhbWVfZGlnIC01CiAgICBpdG9iCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMwogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZnJhbWVfZGlnIC0zCiAgICBjb25jYXQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAxCiAgICBzd2FwCiAgICBieXRlYyAxMCAvLyAweDAwMmEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NzUKICAgIC8vIGFzc2VydCh0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMsIEVSUl9QTFVHSU5fRE9FU19OT1RfRVhJU1QpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDcKICAgIC8vIGN1cnJlbnRQbHVnaW4gPSBHbG9iYWxTdGF0ZTxQbHVnaW5LZXk+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDdXJyZW50UGx1Z2luIH0pCiAgICBieXRlYyAyNCAvLyAiY3VycmVudF9wbHVnaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg3NgogICAgLy8gdGhpcy5jdXJyZW50UGx1Z2luLnZhbHVlID0gY2xvbmUoa2V5KQogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NzcKICAgIC8vIGNvbnN0IHsgZXNjcm93OiBlc2Nyb3dJRCB9ID0gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICBpbnRjXzMgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGR1cAogICAgZnJhbWVfYnVyeSAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NzkKICAgIC8vIGlmIChlc2Nyb3dJRCAhPT0gMCkgewogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4ODEKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID0gc3BlbmRpbmdBcHAuYWRkcmVzcwogICAgZnJhbWVfZGlnIDE2CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NQogICAgLy8gc3BlbmRpbmdBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcyB9KQogICAgYnl0ZWMgMTEgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg4MQogICAgLy8gdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUgPSBzcGVuZGluZ0FwcC5hZGRyZXNzCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWNfMiAvLyAiZSIKICAgIGZyYW1lX2RpZyAtMwogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUyNAogICAgLy8gY29uc3QgZXNjcm93SUQgPSB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5pZDsKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTI1CiAgICAvLyBjb25zdCBlc2Nyb3dBZGRyZXNzID0gQXBwbGljYXRpb24oZXNjcm93SUQpLmFkZHJlc3M7CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDYKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTI3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgZnVuZHNSZXF1ZXN0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMTgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fd2hpbGVfdG9wQDYzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MjcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBmdW5kc1JlcXVlc3RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZnJhbWVfZGlnIDE4CiAgICA+CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MzEKICAgIC8vIGFzc2V0OiBmdW5kc1JlcXVlc3RzW2ldLmFzc2V0CiAgICBmcmFtZV9kaWcgLTEKICAgIGV4dHJhY3QgMiAwCiAgICBmcmFtZV9kaWcgMTgKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgICoKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUyOS01MzIKICAgIC8vIGNvbnN0IGFsbG93YW5jZUtleTogQWxsb3dhbmNlS2V5ID0gewogICAgLy8gICBlc2Nyb3csCiAgICAvLyAgIGFzc2V0OiBmdW5kc1JlcXVlc3RzW2ldLmFzc2V0CiAgICAvLyB9CiAgICBpdG9iCiAgICBieXRlYyAxNyAvLyAweDAwMGEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjgKICAgIC8vIGFsbG93YW5jZXMgPSBCb3hNYXA8QWxsb3dhbmNlS2V5LCBBbGxvd2FuY2VJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4QWxsb3dhbmNlcyB9KSAvLyAzOF81MDAKICAgIGJ5dGVjIDE4IC8vICJhIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTgKICAgIC8vIGFzc2VydCh0aGlzLmFsbG93YW5jZXMoa2V5KS5leGlzdHMsIEVSUl9BTExPV0FOQ0VfRE9FU19OT1RfRVhJU1QpOwogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBhbGxvd2FuY2UgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTU5CiAgICAvLyBjb25zdCB7IHR5cGUsIHNwZW50LCBhbW91bnQsIGxhc3QsIG1heCwgaW50ZXJ2YWwsIHN0YXJ0LCB1c2VSb3VuZHMgfSA9IHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIGR1cAogICAgZXh0cmFjdCAwIDEKICAgIGZyYW1lX2J1cnkgMTEKICAgIGR1cAogICAgcHVzaGludCAxNyAvLyAxNwogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMjkKICAgIGR1cAogICAgcHVzaGludCA5IC8vIDkKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9idXJ5IDEyCiAgICBkdXAKICAgIHB1c2hpbnQgMzMgLy8gMzMKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9idXJ5IDIxCiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAyMwogICAgZHVwCiAgICBwdXNoaW50IDI1IC8vIDI1CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAxOQogICAgZHVwCiAgICBwdXNoaW50IDQxIC8vIDQxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAzMAogICAgcHVzaGludCAzOTIgLy8gMzkyCiAgICBnZXRiaXQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAzMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NjAKICAgIC8vIGNvbnN0IG5ld0xhc3QgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDY2CiAgICBnbG9iYWwgUm91bmQKICAgIGZyYW1lX2J1cnkgMjcKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA2NzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTYyCiAgICAvLyBpZiAodHlwZSA9PT0gU3BlbmRBbGxvd2FuY2VUeXBlRmxhdCkgewogICAgZnJhbWVfZGlnIDExCiAgICBieXRlYyAxNCAvLyAweDAxCiAgICA9PQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlANjkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTYzCiAgICAvLyBjb25zdCBsZWZ0b3ZlcjogdWludDY0ID0gYW1vdW50IC0gc3BlbnQ7CiAgICBmcmFtZV9kaWcgMTIKICAgIGZyYW1lX2RpZyAyOQogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NjQKICAgIC8vIGFzc2VydChsZWZ0b3ZlciA+PSBmdW5kUmVxdWVzdC5hbW91bnQsIEVSUl9BTExPV0FOQ0VfRVhDRUVERUQpOwogICAgZnJhbWVfZGlnIDAKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgZGlnIDEKICAgID49CiAgICBhc3NlcnQgLy8gQWxsb3dhbmNlIGV4Y2VlZGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU2NQogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkudmFsdWUuc3BlbnQgKz0gZnVuZFJlcXVlc3QuYW1vdW50CiAgICBmcmFtZV9kaWcgMwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgcHVzaGludCAxNyAvLyAxNwogICAgZXh0cmFjdF91aW50NjQKICAgICsKICAgIGl0b2IKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIHN3YXAKICAgIGJveF9yZXBsYWNlCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANzg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5MAogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkudmFsdWUubGFzdCA9IG5ld0xhc3QKICAgIGZyYW1lX2RpZyAyNwogICAgaXRvYgogICAgZnJhbWVfZGlnIDMKICAgIHB1c2hpbnQgMzMgLy8gMzMKICAgIHVuY292ZXIgMgogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTM2CiAgICAvLyBpZiAoZnVuZHNSZXF1ZXN0c1tpXS5hc3NldCAhPT0gMCkgewogICAgZnJhbWVfZGlnIDMyCiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA4MAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MzctNTQ0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQsCiAgICAvLyAgICAgeGZlckFzc2V0OiBmdW5kc1JlcXVlc3RzW2ldLmFzc2V0CiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTM5CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MzkKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU0MQogICAgLy8gYXNzZXRBbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50LAogICAgZnJhbWVfZGlnIDAKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfZGlnIDMyCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgZnJhbWVfZGlnIDYKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTM3LTU0MwogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50LAogICAgLy8gICAgIHhmZXJBc3NldDogZnVuZHNSZXF1ZXN0c1tpXS5hc3NldAogICAgLy8gICB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MzctNTQ0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQsCiAgICAvLyAgICAgeGZlckFzc2V0OiBmdW5kc1JlcXVlc3RzW2ldLmFzc2V0CiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAODE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUyNwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGZ1bmRzUmVxdWVzdHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAxOAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMTgKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl93aGlsZV90b3BANjMKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDgwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NDYtNTUyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBmdW5kc1JlcXVlc3RzW2ldLmFtb3VudAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU0OAogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTQ4CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTAKICAgIC8vIGFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBmcmFtZV9kaWcgNgogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTQ2LTU1MQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTQ2LTU1MgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDgxCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA2OToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTY2CiAgICAvLyB9IGVsc2UgaWYgKHR5cGUgPT09IFNwZW5kQWxsb3dhbmNlVHlwZVdpbmRvdykgewogICAgZnJhbWVfZGlnIDExCiAgICBwdXNoYnl0ZXMgMHgwMgogICAgPT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDczCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5NAogICAgLy8gaWYgKHVzZVJvdW5kcykgewogICAgZnJhbWVfZGlnIDMxCiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAODQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTk1CiAgICAvLyByZXR1cm4gR2xvYmFsLnJvdW5kIC0gKChHbG9iYWwucm91bmQgLSBzdGFydCkgJSBpbnRlcnZhbCkKICAgIGdsb2JhbCBSb3VuZAogICAgZHVwCiAgICBmcmFtZV9kaWcgMzAKICAgIC0KICAgIGZyYW1lX2RpZyAxOQogICAgJQogICAgLQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmdldExhdGVzdFdpbmRvd1N0YXJ0QDg1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NjkKICAgIC8vIGlmIChjdXJyZW50V2luZG93U3RhcnQgPiBsYXN0KSB7CiAgICBmcmFtZV9kaWcgMjEKICAgID4KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDcyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU3MAogICAgLy8gYXNzZXJ0KGFtb3VudCA+PSBmdW5kUmVxdWVzdC5hbW91bnQsIEVSUl9BTExPV0FOQ0VfRVhDRUVERUQpOwogICAgZnJhbWVfZGlnIDAKICAgIGR1cAogICAgZXh0cmFjdCA4IDgKICAgIHN3YXAKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfZGlnIDEyCiAgICA8PQogICAgYXNzZXJ0IC8vIEFsbG93YW5jZSBleGNlZWRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NzEKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlLnNwZW50ID0gZnVuZFJlcXVlc3QuYW1vdW50CiAgICBmcmFtZV9kaWcgMwogICAgcHVzaGludCAxNyAvLyAxNwogICAgdW5jb3ZlciAyCiAgICBib3hfcmVwbGFjZQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANzgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDcyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NzQKICAgIC8vIGNvbnN0IGxlZnRvdmVyOiB1aW50NjQgPSBhbW91bnQgLSBzcGVudDsKICAgIGZyYW1lX2RpZyAxMgogICAgZnJhbWVfZGlnIDI5CiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU3NQogICAgLy8gYXNzZXJ0KGxlZnRvdmVyID49IGZ1bmRSZXF1ZXN0LmFtb3VudCwgRVJSX0FMTE9XQU5DRV9FWENFRURFRCk7CiAgICBmcmFtZV9kaWcgMAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBkaWcgMQogICAgPj0KICAgIGFzc2VydCAvLyBBbGxvd2FuY2UgZXhjZWVkZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTc2CiAgICAvLyB0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZS5zcGVudCArPSBmdW5kUmVxdWVzdC5hbW91bnQKICAgIGZyYW1lX2RpZyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICBleHRyYWN0X3VpbnQ2NAogICAgKwogICAgaXRvYgogICAgcHVzaGludCAxNyAvLyAxNwogICAgc3dhcAogICAgYm94X3JlcGxhY2UKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDc4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAODQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5NwogICAgLy8gcmV0dXJuIEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgLSAoKEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgLSBzdGFydCkgJSBpbnRlcnZhbCkKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGR1cAogICAgZnJhbWVfZGlnIDMwCiAgICAtCiAgICBmcmFtZV9kaWcgMTkKICAgICUKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTY3CiAgICAvLyBjb25zdCBjdXJyZW50V2luZG93U3RhcnQgPSB0aGlzLmdldExhdGVzdFdpbmRvd1N0YXJ0KHVzZVJvdW5kcywgc3RhcnQsIGludGVydmFsKQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuZ2V0TGF0ZXN0V2luZG93U3RhcnRAODUKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDczOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NzgKICAgIC8vIH0gZWxzZSBpZiAodHlwZSA9PT0gU3BlbmRBbGxvd2FuY2VUeXBlRHJpcCkgewogICAgZnJhbWVfZGlnIDExCiAgICBwdXNoYnl0ZXMgMHgwMwogICAgPT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA3OAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NzkKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGZyYW1lX2RpZyAzMQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDc2CiAgICBnbG9iYWwgUm91bmQKICAgIGZyYW1lX2J1cnkgMTUKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA3NzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTgwCiAgICAvLyBjb25zdCBwYXNzZWQ6IHVpbnQ2NCA9IGVwb2NoUmVmIC0gbGFzdAogICAgZnJhbWVfZGlnIDE1CiAgICBmcmFtZV9kaWcgMjEKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTg0CiAgICAvLyBjb25zdCBhY2NydWVkOiB1aW50NjQgPSBzcGVudCArICgocGFzc2VkIC8gaW50ZXJ2YWwpICogYW1vdW50KQogICAgZnJhbWVfZGlnIDE5CiAgICAvCiAgICBmcmFtZV9kaWcgMTIKICAgICoKICAgIGZyYW1lX2RpZyAyOQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1ODUKICAgIC8vIGNvbnN0IGF2YWlsYWJsZTogdWludDY0ID0gYWNjcnVlZCA+IG1heCA/IG1heCA6IGFjY3J1ZWQKICAgIGR1cAogICAgZnJhbWVfZGlnIDIzCiAgICBkdXAKICAgIGNvdmVyIDMKICAgID4KICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIHNlbGVjdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1ODcKICAgIC8vIGFzc2VydChhdmFpbGFibGUgPj0gZnVuZFJlcXVlc3QuYW1vdW50LCBFUlJfQUxMT1dBTkNFX0VYQ0VFREVEKTsKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cDIKICAgID49CiAgICBhc3NlcnQgLy8gQWxsb3dhbmNlIGV4Y2VlZGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU4OAogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkudmFsdWUuc3BlbnQgPSAoYXZhaWxhYmxlIC0gZnVuZFJlcXVlc3QuYW1vdW50KQogICAgLQogICAgaXRvYgogICAgZnJhbWVfZGlnIDMKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIHVuY292ZXIgMgogICAgYm94X3JlcGxhY2UKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDc4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VANzY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU3OQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZnJhbWVfYnVyeSAxNQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VANzcKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA2NjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTYwCiAgICAvLyBjb25zdCBuZXdMYXN0ID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGZyYW1lX2J1cnkgMjcKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDY3CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzYzCiAgICAvLyBjb25zdCB7IHVzZVJvdW5kcywgdXNlRXhlY3V0aW9uS2V5IH0gPSB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZQogICAgZnJhbWVfZGlnIDIKICAgIHB1c2hpbnQgMjcgLy8gMjcKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBmcmFtZV9idXJ5IDMxCiAgICBpbnRjXzIgLy8gMgogICAgZ2V0Yml0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM2NQogICAgLy8gaWYgKHVzZUV4ZWN1dGlvbktleSAmJiAhdGhpcy5pc0FkbWluKCkpIHsKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAyOQogICAgY2FsbHN1YiBpc0FkbWluCiAgICBibnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDI5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBieXRlYyA5IC8vICJ4IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjYKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS5leGlzdHMsIEVSUl9FWEVDVVRJT05fS0VZX05PVF9GT1VORCk7CiAgICB0eG4gTGVhc2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjYKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS5leGlzdHMsIEVSUl9FWEVDVVRJT05fS0VZX05PVF9GT1VORCk7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFeGVjdXRpb24ga2V5IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzY3CiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKFR4bi5sZWFzZSkudmFsdWUuZmlyc3RWYWxpZCA8PSBHbG9iYWwucm91bmQsIEVSUl9FWEVDVVRJT05fTk9UX1JFQURZKTsKICAgIHR4biBMZWFzZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM2NwogICAgLy8gYXNzZXJ0KHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLnZhbHVlLmZpcnN0VmFsaWQgPD0gR2xvYmFsLnJvdW5kLCBFUlJfRVhFQ1VUSU9OX05PVF9SRUFEWSk7CiAgICBpbnRjXzIgLy8gMgogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBnbG9iYWwgUm91bmQKICAgIDw9CiAgICBhc3NlcnQgLy8gRXhlY3V0aW9uIGtleSBub3QgcmVhZHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM2OAogICAgLy8gYXNzZXJ0KHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLnZhbHVlLmxhc3RWYWxpZCA+PSBHbG9iYWwucm91bmQsIEVSUl9FWEVDVVRJT05fRVhQSVJFRCk7CiAgICB0eG4gTGVhc2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjgKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS52YWx1ZS5sYXN0VmFsaWQgPj0gR2xvYmFsLnJvdW5kLCBFUlJfRVhFQ1VUSU9OX0VYUElSRUQpOwogICAgcHVzaGludCAxMCAvLyAxMAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBnbG9iYWwgUm91bmQKICAgID49CiAgICBhc3NlcnQgLy8gRXhlY3V0aW9uIGtleSBleHBpcmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBieXRlYyA5IC8vICJ4IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzAKICAgIC8vIGNvbnN0IGdyb3VwcyA9IHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLnZhbHVlLmdyb3VwcyBhcyBSZWFkb25seTxieXRlczwzMj5bXT47CiAgICB0eG4gTGVhc2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM3MgogICAgLy8gbGV0IGZvdW5kR3JvdXAgPSBmYWxzZTsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDE3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM3MwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMTgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fd2hpbGVfdG9wQDI0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzMKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyA1CiAgICBwdXNoaW50IDE4IC8vIDE4CiAgICBpbnRjXzIgLy8gMgogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGZyYW1lX2RpZyAxOAogICAgPgogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl93aGlsZUAyOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzQKICAgIC8vIGlmIChncm91cHNbaV0gPT09IEdsb2JhbC5ncm91cElkKSB7CiAgICBmcmFtZV9kaWcgMTgKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICsKICAgIGZyYW1lX2RpZyA1CiAgICBzd2FwCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgZ2xvYmFsIEdyb3VwSUQKICAgID09CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzc1CiAgICAvLyBmb3VuZEdyb3VwID0gdHJ1ZTsKICAgIGludGNfMSAvLyAxCiAgICBmcmFtZV9idXJ5IDE3CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM3MwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDE4CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSAxOAogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3doaWxlX3RvcEAyNAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl93aGlsZUAyODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzc5CiAgICAvLyBhc3NlcnQoZm91bmRHcm91cCwgRVJSX0dST1VQX05PVF9GT1VORCk7CiAgICBmcmFtZV9kaWcgMTcKICAgIGFzc2VydCAvLyBHcm91cCBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM4MAogICAgLy8gdGhpcy5leGVjdXRpb25zKFR4bi5sZWFzZSkuZGVsZXRlKCk7CiAgICB0eG4gTGVhc2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODAKICAgIC8vIHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLmRlbGV0ZSgpOwogICAgYm94X2RlbAogICAgcG9wCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM4MwogICAgLy8gY29uc3QgaW5pdGlhbENoZWNrID0gdGhpcy5wbHVnaW5DaGVjayhrZXkpOwogICAgZnJhbWVfZGlnIDcKICAgIGNhbGxzdWIgcGx1Z2luQ2hlY2sKICAgIGZyYW1lX2J1cnkgNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODUKICAgIC8vIGFzc2VydChpbml0aWFsQ2hlY2suZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODYKICAgIC8vIGFzc2VydCghaW5pdGlhbENoZWNrLmV4cGlyZWQsIEVSUl9QTFVHSU5fRVhQSVJFRCk7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICBnZXRiaXQKICAgICEKICAgIGFzc2VydCAvLyBwbHVnaW4gZXhwaXJlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODcKICAgIC8vIGFzc2VydCghaW5pdGlhbENoZWNrLm9uQ29vbGRvd24sIEVSUl9QTFVHSU5fT05fQ09PTERPV04pOwogICAgaW50Y18yIC8vIDIKICAgIGdldGJpdAogICAgIQogICAgYXNzZXJ0IC8vIHBsdWdpbiBvbiBjb29sZG93bgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODktMzkxCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcwogICAgLy8gICA/IEdsb2JhbC5yb3VuZAogICAgLy8gICA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBmcmFtZV9kaWcgMzEKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUAzMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozOTAKICAgIC8vID8gR2xvYmFsLnJvdW5kCiAgICBnbG9iYWwgUm91bmQKICAgIGZyYW1lX2J1cnkgMTUKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUAzMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzkzCiAgICAvLyBsZXQgcmVrZXlzQmFjayA9IGZhbHNlOwogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMjgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzk0CiAgICAvLyBsZXQgbWV0aG9kSW5kZXg6IHVpbnQ2NCA9IDA7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAyNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozOTYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IChUeG4uZ3JvdXBJbmRleCArIDEpOyBpIDwgR2xvYmFsLmdyb3VwU2l6ZTsgaSArPSAxKSB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMjAKICAgIGZyYW1lX2RpZyA3CiAgICBmcmFtZV9idXJ5IDgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fd2hpbGVfdG9wQDMzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozOTYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IChUeG4uZ3JvdXBJbmRleCArIDEpOyBpIDwgR2xvYmFsLmdyb3VwU2l6ZTsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgMjAKICAgIGdsb2JhbCBHcm91cFNpemUKICAgIDwKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYmxvY2tANjAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzk5CiAgICAvLyBpZiAodGhpcy50eG5SZWtleXNCYWNrKHR4bikpIHsKICAgIGZyYW1lX2RpZyAyMAogICAgY2FsbHN1YiB0eG5SZWtleXNCYWNrCiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMzYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDAwCiAgICAvLyByZWtleXNCYWNrID0gdHJ1ZTsKICAgIGludGNfMSAvLyAxCiAgICBmcmFtZV9idXJ5IDI4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jsb2NrQDYwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MzAKICAgIC8vIGFzc2VydChyZWtleXNCYWNrLCBFUlJfTUlTU0lOR19SRUtFWV9CQUNLKTsKICAgIGZyYW1lX2RpZyAyOAogICAgYXNzZXJ0IC8vIG1pc3NpbmcgcmVrZXkgYmFjawogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBmcmFtZV9kaWcgOAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4OTAKICAgIC8vIGlmICh0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZS5jb3ZlckZlZXMpIHsKICAgIHB1c2hpbnQgMjcgLy8gMjcKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgcHVzaGludCAzIC8vIDMKICAgIGdldGJpdAogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlAMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODkyCiAgICAvLyBjb25zdCBtYXhGZWU6IHVpbnQ2NCA9IChNQVhfSU5ORVJfVFhOX0NPVU5UICsgTUFYX09VVEVSX1RYTl9DT1VOVCkgKiBHbG9iYWwubWluVHhuRmVlCiAgICBwdXNoaW50IDI3MiAvLyAyNzIKICAgIGdsb2JhbCBNaW5UeG5GZWUKICAgICoKICAgIGR1cAogICAgZnJhbWVfYnVyeSAyNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4OTMKICAgIC8vIGNvbnN0IHJlaW1idXJzZW1lbnQgPSBUeG4uZmVlIDwgbWF4RmVlID8gVHhuLmZlZSA6IG1heEZlZQogICAgdHhuIEZlZQogICAgPgogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDEzCiAgICB0eG4gRmVlCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg5NS05MDMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHJlaW1idXJzZW1lbnQsCiAgICAvLyAgICAgcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgbm90ZTogJ3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAgJiByZWltYnVyc2luZyBjYWxsZXInCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4OTcKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg5NwogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODk4CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTAwCiAgICAvLyByZWtleVRvOiBwbHVnaW5BcHAuYWRkcmVzcywKICAgIGZyYW1lX2RpZyAtNQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MDEKICAgIC8vIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwICYgcmVpbWJ1cnNpbmcgY2FsbGVyJwogICAgcHVzaGJ5dGVzICJyZWtleWluZyB0byBwbHVnaW4gYXBwICYgcmVpbWJ1cnNpbmcgY2FsbGVyIgogICAgaXR4bl9maWVsZCBOb3RlCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg5NS05MDIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHJlaW1idXJzZW1lbnQsCiAgICAvLyAgICAgcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgbm90ZTogJ3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAgJiByZWltYnVyc2luZyBjYWxsZXInCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg5NS05MDMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHJlaW1idXJzZW1lbnQsCiAgICAvLyAgICAgcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgbm90ZTogJ3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAgJiByZWltYnVyc2luZyBjYWxsZXInCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ5CiAgICAvLyByZWtleUluZGV4ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMCwga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNSZWtleUluZGV4IH0pCiAgICBieXRlYyAxOSAvLyAicmVrZXlfaW5kZXgiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkxNgogICAgLy8gdGhpcy5yZWtleUluZGV4LnZhbHVlID0gVHhuLmdyb3VwSW5kZXgKICAgIHR4biBHcm91cEluZGV4CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTgKICAgIC8vIGlmICh0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZS5kZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmKSB7CiAgICBmcmFtZV9kaWcgNAogICAgaW50Y18zIC8vIDgKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgYnl0ZWMgMTQgLy8gMHgwMQogICAgPT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAyMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlYyA0IC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAyMDoKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9idXJ5IDEKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMTM6CiAgICBmcmFtZV9kaWcgMjQKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDE0CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUAxNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTA1LTkxMgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgbm90ZTogJ3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAnCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTA3CiAgICAvLyBzZW5kZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMSAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTA3CiAgICAvLyBzZW5kZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTA5CiAgICAvLyByZWtleVRvOiBwbHVnaW5BcHAuYWRkcmVzcywKICAgIGZyYW1lX2RpZyAtNQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTAKICAgIC8vIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwJwogICAgcHVzaGJ5dGVzICJyZWtleWluZyB0byBwbHVnaW4gYXBwIgogICAgaXR4bl9maWVsZCBOb3RlCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGR1cAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTA1LTkxMQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgbm90ZTogJ3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAnCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkwNS05MTIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwJwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMTgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAzNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDA0CiAgICAvLyBpZiAodHhuLnR5cGUgIT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwpIHsKICAgIGZyYW1lX2RpZyAyMAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNiAvLyA2CiAgICAhPQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDM4CiAgICBmcmFtZV9kaWcgOAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ibG9ja0A1ODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzk2CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAoVHhuLmdyb3VwSW5kZXggKyAxKTsgaSA8IEdsb2JhbC5ncm91cFNpemU7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDIwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSAyMAogICAgZnJhbWVfYnVyeSA4CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fd2hpbGVfdG9wQDMzCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMzg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQwOAogICAgLy8gYXNzZXJ0KHR4bi5hcHBJZC5pZCA9PT0ga2V5LnBsdWdpbiwgRVJSX0NBTk5PVF9DQUxMX09USEVSX0FQUFNfRFVSSU5HX1JFS0VZKTsKICAgIGZyYW1lX2RpZyAyMAogICAgZHVwCiAgICBndHhucyBBcHBsaWNhdGlvbklECiAgICBmcmFtZV9kaWcgNwogICAgZHVwCiAgICBjb3ZlciAzCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgID09CiAgICBhc3NlcnQgLy8gY2Fubm90IGNhbGwgb3RoZXIgYXBwcyBkdXJpbmcgcmVrZXkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDA5CiAgICAvLyBhc3NlcnQodHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wLCBFUlJfSU5WQUxJRF9PTkNPTVBMRVRFKTsKICAgIGR1cAogICAgZ3R4bnMgT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gaW52YWxpZCBvbmNvbXBsZXRlIG11c3QgYmUgbm8gb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDEyCiAgICAvLyBhc3NlcnQodHhuLm51bUFwcEFyZ3MgPiAxLCBFUlJfSU5WQUxJRF9TRU5ERVJfQVJHKTsKICAgIGR1cAogICAgZ3R4bnMgTnVtQXBwQXJncwogICAgaW50Y18xIC8vIDEKICAgID4KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNlbmRlciBtdXN0IGJlIHRoaXMgYXBwIGlkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQxMwogICAgLy8gYXNzZXJ0KEFwcGxpY2F0aW9uKGJ0b2kodHhuLmFwcEFyZ3MoMSkpKSA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkLCBFUlJfSU5WQUxJRF9TRU5ERVJfVkFMVUUpOwogICAgaW50Y18xIC8vIDEKICAgIGd0eG5zYXMgQXBwbGljYXRpb25BcmdzCiAgICBidG9pCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uSUQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzZW5kZXIgYXBwIGlkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQxNQogICAgLy8gY29uc3QgeyBleHBpcmVkLCBvbkNvb2xkb3duLCBoYXNNZXRob2RSZXN0cmljdGlvbnMgfSA9IHRoaXMucGx1Z2luQ2hlY2soa2V5KTsKICAgIGNhbGxzdWIgcGx1Z2luQ2hlY2sKICAgIGZyYW1lX2J1cnkgNwogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBkaWcgMQogICAgaW50Y18yIC8vIDIKICAgIGdldGJpdAogICAgdW5jb3ZlciAyCiAgICBwdXNoaW50IDMgLy8gMwogICAgZ2V0Yml0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQxNwogICAgLy8gYXNzZXJ0KCFleHBpcmVkLCBFUlJfUExVR0lOX0VYUElSRUQpOwogICAgdW5jb3ZlciAyCiAgICAhCiAgICBhc3NlcnQgLy8gcGx1Z2luIGV4cGlyZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDE4CiAgICAvLyBhc3NlcnQoIW9uQ29vbGRvd24sIEVSUl9QTFVHSU5fT05fQ09PTERPV04pOwogICAgc3dhcAogICAgIQogICAgYXNzZXJ0IC8vIHBsdWdpbiBvbiBjb29sZG93bgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjAKICAgIC8vIGlmIChoYXNNZXRob2RSZXN0cmljdGlvbnMpIHsKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA1NwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjEKICAgIC8vIGFzc2VydChtZXRob2RJbmRleCA8IG1ldGhvZE9mZnNldHMubGVuZ3RoLCBFUlJfTUFMRk9STUVEX09GRlNFVFMpOwogICAgZnJhbWVfZGlnIC0yCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyAyNQogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIDwKICAgIGFzc2VydCAvLyBtYWxmb3JtZWQgbWV0aG9kIG9mZnNldHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDIyCiAgICAvLyBjb25zdCB7IG1ldGhvZEFsbG93ZWQsIG1ldGhvZE9uQ29vbGRvd24gfSA9IHRoaXMubWV0aG9kQ2hlY2soa2V5LCB0eG4sIG1ldGhvZE9mZnNldHNbbWV0aG9kSW5kZXhdKTsKICAgIGZyYW1lX2RpZyAtMgogICAgZXh0cmFjdCAyIDAKICAgIHN3YXAKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NDMKICAgIC8vIGFzc2VydChsZW4odHhuLmFwcEFyZ3MoMCkpID09PSA0LCBFUlJfSU5WQUxJRF9NRVRIT0RfU0lHTkFUVVJFX0xFTkdUSCkKICAgIGZyYW1lX2RpZyAyMAogICAgaW50Y18wIC8vIDAKICAgIGd0eG5zYXMgQXBwbGljYXRpb25BcmdzCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMTAKICAgIGxlbgogICAgcHVzaGludCA0IC8vIDQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBtZXRob2Qgc2lnbmF0dXJlIGxlbmd0aAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBmcmFtZV9kaWcgNwogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NDYKICAgIC8vIGNvbnN0IHsgdXNlUm91bmRzIH0gPSB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZQogICAgZHVwCiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGludGNfMSAvLyAxCiAgICBnZXRiaXQKICAgIGR1cAogICAgY292ZXIgMgogICAgZnJhbWVfYnVyeSAzMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NDcKICAgIC8vIGNvbnN0IHsgc2VsZWN0b3IsIGNvb2xkb3duLCBsYXN0Q2FsbGVkIH0gPSB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZS5tZXRob2RzW29mZnNldF0KICAgIHVuY292ZXIgMgogICAgcHVzaGludCAyMCAvLyAyMAogICAgKgogICAgZHVwCiAgICBmcmFtZV9idXJ5IDEzCiAgICBwdXNoaW50IDQ2IC8vIDQ2CiAgICArCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICBib3hfZXh0cmFjdAogICAgZHVwCiAgICBleHRyYWN0IDAgNAogICAgZnJhbWVfYnVyeSA5CiAgICBkdXAKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAxNAogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMjIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDUxCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA0MQogICAgZ2xvYmFsIFJvdW5kCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VANDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1MgogICAgLy8gY29uc3QgbWV0aG9kT25Db29sZG93biA9IChlcG9jaFJlZiAtIGxhc3RDYWxsZWQpIDwgY29vbGRvd24KICAgIGZyYW1lX2RpZyAyMgogICAgLQogICAgZnJhbWVfZGlnIDE0CiAgICA8CiAgICBmcmFtZV9idXJ5IDI2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1NAogICAgLy8gaWYgKHNlbGVjdG9yID09PSBzZWxlY3RvckFyZyAmJiAoIWhhc0Nvb2xkb3duIHx8ICFtZXRob2RPbkNvb2xkb3duKSkgewogICAgZnJhbWVfZGlnIDkKICAgIGZyYW1lX2RpZyAxMAogICAgPT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA1MQogICAgZnJhbWVfZGlnIDE0CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2lmX2JvZHlANDUKICAgIGZyYW1lX2RpZyAyNgogICAgYm56IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA1MQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9pZl9ib2R5QDQ1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NTYKICAgIC8vIGlmIChoYXNDb29sZG93bikgewogICAgZnJhbWVfZGlnIDE0CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDU3CiAgICAvLyBjb25zdCBsYXN0Q2FsbGVkID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGZyYW1lX2RpZyAzMQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDQ4CiAgICBnbG9iYWwgUm91bmQKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA0OToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDU4CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZS5tZXRob2RzW29mZnNldF0ubGFzdENhbGxlZCA9IGxhc3RDYWxsZWQKICAgIGl0b2IKICAgIGZyYW1lX2RpZyAxMwogICAgcHVzaGludCA1OCAvLyA1OAogICAgKwogICAgZnJhbWVfZGlnIDIKICAgIHN3YXAKICAgIHVuY292ZXIgMgogICAgYm94X3JlcGxhY2UKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA1MDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDYxLTQ2NAogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgbWV0aG9kQWxsb3dlZDogdHJ1ZSwKICAgIC8vICAgbWV0aG9kT25Db29sZG93bgogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4ODAKICAgIGludGNfMSAvLyAxCiAgICBmcmFtZV9kaWcgMjYKICAgIHNldGJpdAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50Lm1ldGhvZENoZWNrQDUyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjIKICAgIC8vIGNvbnN0IHsgbWV0aG9kQWxsb3dlZCwgbWV0aG9kT25Db29sZG93biB9ID0gdGhpcy5tZXRob2RDaGVjayhrZXksIHR4biwgbWV0aG9kT2Zmc2V0c1ttZXRob2RJbmRleF0pOwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBmcmFtZV9idXJ5IDI2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQyMwogICAgLy8gYXNzZXJ0KG1ldGhvZEFsbG93ZWQgJiYgIW1ldGhvZE9uQ29vbGRvd24sIEVSUl9NRVRIT0RfT05fQ09PTERPV04pOwogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ib29sX2ZhbHNlQDU1CiAgICBmcmFtZV9kaWcgMjYKICAgIGJueiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jvb2xfZmFsc2VANTUKICAgIGludGNfMSAvLyAxCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jvb2xfbWVyZ2VANTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQyMwogICAgLy8gYXNzZXJ0KG1ldGhvZEFsbG93ZWQgJiYgIW1ldGhvZE9uQ29vbGRvd24sIEVSUl9NRVRIT0RfT05fQ09PTERPV04pOwogICAgYXNzZXJ0IC8vIG1ldGhvZCBvbiBjb29sZG93bgoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDU3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBmcmFtZV9kaWcgNwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDI2CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZS5sYXN0Q2FsbGVkID0gZXBvY2hSZWYKICAgIGZyYW1lX2RpZyAxNQogICAgaXRvYgogICAgcHVzaGludCAyOCAvLyAyOAogICAgc3dhcAogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDI3CiAgICAvLyBtZXRob2RJbmRleCArPSAxOwogICAgZnJhbWVfZGlnIDI1CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSAyNQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jsb2NrQDU4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jvb2xfZmFsc2VANTU6CiAgICBpbnRjXzAgLy8gMAogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jvb2xfbWVyZ2VANTYKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA0ODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDU3CiAgICAvLyBjb25zdCBsYXN0Q2FsbGVkID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDQ5CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ2Ny00NzAKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIG1ldGhvZEFsbG93ZWQ6IGZhbHNlLAogICAgLy8gICBtZXRob2RPbkNvb2xkb3duOiB0cnVlCiAgICAvLyB9CiAgICBwdXNoYnl0ZXMgMHg0MAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjIKICAgIC8vIGNvbnN0IHsgbWV0aG9kQWxsb3dlZCwgbWV0aG9kT25Db29sZG93biB9ID0gdGhpcy5tZXRob2RDaGVjayhrZXksIHR4biwgbWV0aG9kT2Zmc2V0c1ttZXRob2RJbmRleF0pOwogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQubWV0aG9kQ2hlY2tANTIKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA0MToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDUxCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDQyCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMzE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM5MQogICAgLy8gOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZnJhbWVfYnVyeSAxNQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VAMzIKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg4NAogICAgLy8gdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUgPSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4ODQKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMSAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODg0CiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODcyCiAgICAvLyBjb25zdCBjYWxsZXIgPSBnbG9iYWwgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiBUeG4uc2VuZGVyCiAgICB0eG4gU2VuZGVyCiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUAzCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZShhc3NldHM6IGJ5dGVzKSAtPiBieXRlcywgYnl0ZXM6CnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2U6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MjctMTYyOAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICAvLyBiYWxhbmNlKGFzc2V0czogdWludDY0W10pOiB1aW50NjRbXSB7CiAgICBwcm90byAxIDIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICIiCiAgICBkdXBuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyOQogICAgLy8gbGV0IGFtb3VudHM6IHVpbnQ2NFtdID0gW10KICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MzAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX3doaWxlX3RvcEAxOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjMwCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZnJhbWVfZGlnIDUKICAgID4KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2VfYWZ0ZXJfd2hpbGVAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjMxCiAgICAvLyBsZXQgYW1vdW50OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MzIKICAgIC8vIGNvbnN0IGFzc2V0ID0gQXNzZXQoYXNzZXRzW2ldKQogICAgZnJhbWVfZGlnIC0xCiAgICBleHRyYWN0IDIgMAogICAgZnJhbWVfZGlnIDUKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBkdXAyCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBmcmFtZV9idXJ5IDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjM0CiAgICAvLyBpZiAoYXNzZXQuaWQgPT09IDApIHsKICAgIGJueiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX2Vsc2VfYm9keUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MzUKICAgIC8vIGFtb3VudCA9IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLmJhbGFuY2UKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBhY2N0X3BhcmFtc19nZXQgQWNjdEJhbGFuY2UKICAgIHN3YXAKICAgIGZyYW1lX2J1cnkgMQogICAgYXNzZXJ0IC8vIGFjY291bnQgZnVuZGVkCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0My0xNjQ5CiAgICAvLyBjb25zdCBlc2Nyb3dJbmZvID0gYWJpQ2FsbDx0eXBlb2YgU3Rha2luZy5wcm90b3R5cGUuZ2V0RXNjcm93SW5mbz4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFzc2V0LmlkCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NDQKICAgIC8vIGFwcElkOiBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc3Rha2luZywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIHB1c2hieXRlcyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQ0CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MAogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFwcExpc3QpKQogICAgcHVzaGJ5dGVzICJhYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NDQKICAgIC8vIGFwcElkOiBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc3Rha2luZywKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQ2CiAgICAvLyB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0NgogICAgLy8gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NDMtMTY0OQogICAgLy8gY29uc3QgZXNjcm93SW5mbyA9IGFiaUNhbGw8dHlwZW9mIFN0YWtpbmcucHJvdG90eXBlLmdldEVzY3Jvd0luZm8+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhc3NldC5pZAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4NGM4OGVhY2UgLy8gbWV0aG9kICJnZXRFc2Nyb3dJbmZvKGFkZHJlc3MsdWludDY0KSh1aW50NjQsdWludDY0KSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIDAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKHVpbnQ2NCx1aW50NjQpCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NTEKICAgIC8vIGFtb3VudHMgPSBbLi4uYW1vdW50cywgKGFtb3VudCArIGVzY3Jvd0luZm8uaGFyZCArIGVzY3Jvd0luZm8ubG9jayldCiAgICBkdXAKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfZGlnIDEKICAgICsKICAgIHN3YXAKICAgIHB1c2hpbnQgMTIgLy8gMTIKICAgIGV4dHJhY3RfdWludDY0CiAgICArCiAgICBpdG9iCiAgICBieXRlYyAyMyAvLyAweDAwMDEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZXh0cmFjdCAyIDAKICAgIGZyYW1lX2RpZyA0CiAgICBzd2FwCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIGR1cAogICAgZXh0cmFjdCAyIDAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgIC8KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBmcmFtZV9idXJ5IDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYzMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDUKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBmcmFtZV9idXJ5IDUKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV93aGlsZV90b3BAMQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9lbHNlX2JvZHlANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYzNwogICAgLy8gY29uc3QgW2hvbGRpbmdBbW91bnQsIG9wdGVkSW5dID0gQXNzZXRIb2xkaW5nLmFzc2V0QmFsYW5jZShHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgYXNzZXQpCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZnJhbWVfZGlnIDIKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgc3dhcAogICAgZnJhbWVfYnVyeSAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MzgKICAgIC8vIGlmIChvcHRlZEluKSB7CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX2FmdGVyX2lmX2Vsc2VANwogICAgZnJhbWVfZGlnIDMKICAgIGZyYW1lX2J1cnkgMQogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX2FmdGVyX2lmX2Vsc2VANwoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9hZnRlcl93aGlsZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjU0CiAgICAvLyByZXR1cm4gYW1vdW50cwogICAgZnJhbWVfZGlnIDQKICAgIGZyYW1lX2RpZyAtMQogICAgZnJhbWVfYnVyeSAxCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1Ygo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAHAAECCJAD1JMBtNgBJh4SY29udHJvbGxlZF9hZGRyZXNzAAFlAXAVbGFzdF91c2VyX2ludGVyYWN0aW9uBBUffHULbGFzdF9jaGFuZ2UCAAABAAF4AgAqEHNwZW5kaW5nX2FkZHJlc3MCAAIFYWRtaW4BAQFuAWQCAAoBYQtyZWtleV9pbmRleAZkb21haW4OZXNjcm93X2ZhY3RvcnkKcmV2b2NhdGlvbgIAAQ5jdXJyZW50X3BsdWdpbgRsw/YGB3ZlcnNpb24Ibmlja25hbWULZmFjdG9yeV9hcHACACwxGEAABCcTImeABOqRgN02GgCOAQEoMRkURDEYQQERggkEvWCZ5QR3h4Z9BC13EbcEn5HMzQQX2Ly0BDhWWKsEXvC0FQTSS3VWBBR7bNYnGYIcBMlaXT0ERyevIQRYL/OCBN79XNIEVnJGLgRXpR2IBO70SP0EVy/R6gTjULnUBAqMssIEJbcTygTrrxSgBGogXPwErhpNygRkTS3sBL9NfFcE1d04KwRc6+1DBNWGha8EE7xE5ASJp2gmBAV5TX0EokA93wQC/kUVBEG9xoAEiCuxwgQXYMZSBBJMCn82GgCOJgH0An0ClwKqAsQC6gMQAy0DSgO5A/4EfQTeBScFggdaB6wIDAoaCqUK0QsWC0kL5gwfDNEN2A6LDzgPcQ99EA4QwRFAEfASfhLoE4gAgAQWZWxmNhoAjgEBJQAxGYEEEjEYEERCAjGKAwGL/SJZSYv/CEwkCyQISwEWVwYCTgKL/SRLAlKL/yQLr1CL/RWL/U8DTwJSUIv+UEwkC0kiiwSLAgxBACOLA0kWVwYCiwGLBElOBE8CXUmMAUsBWSQICIwDJAiMBEL/1YsAiwFQjACJigQBKUmL/iQLi/wkCyKLBIsDDEEAHIv9iwRJTgJZiwIIFlcGAosBTFCMASQIjARC/9yL/RWMACKMBIsEiwIMQQAci/+LBElOAlmLAAgWVwYCiwFMUIwBJAiMBEL/3Iv8i/4IFlcGAosBUIv9iwOLAFJQi/8Vi/+LAk8CUlCMAImKAQGL/xZJkyUORFcHAYkiiP/tIhZJTwJQSwFQSwFQgAMALABQSwFQTFAnB1CJNhoBSSJZJAhLARUSRFcCADYaAklOAkkVgSASRDYaA0kVgSASRDYaBEkiWSQISwEVEkRXAgA2GgVJFSUSRBdOBDYaBkkVJRJEF04ENhoHSSJZJAhLARUSRFcCAE4ENhoISU4FFYEgEkQyDURLAUsDE0QnGk8EZycNTwJnJxRMZzIDEkEANzIKKExnJxVLBGcnCzIDZycWSwNnJxtLAmcnHDINZ4AIcmVmZXJyZXJLAWcnBDIHZycGMgdnI0NLBEL/xjYaAUkiWSQISwEVEkRXAgBJIkwpE0EADypLAlBJvUUBRL5IIltFAbEiJxVlRElyCESBxF6yCLIHI7IQIrIBtksBFoAEYH5wRrIashqyGIEGshAisgGzI0M2GgFJIlkkCEsBFRJEVwIAiBIIQAAOMQAiJxxlRHIIRBJBAAkjRCcaSwFnI0MiQv/0NhoBSSJZJAhLARUSRFcCAIgR10QnFExnI0M2GgFJFSUSRBeIEcREJxZMZyNDNhoBSSJZJAhLARUSRFcCAIgRqkQnG0xnI0M2GgFJFSUSRBeIEZdESRYnF0xQiBkASCRbRIAGYXZhdGFyTGcjQzYaAUkVJRJEF4gRcURJFicXTFCIGNpIJFtEgAZiYW5uZXJMZyNDNhoBSSJZJAhLARUSRFcCAIgRRESAA2Jpb0xnI0M2GgFJFYEgEkSIES5EJw1MZycEMgdnJwYyB2cjQzYaAUkVgSASRCInGGVESSJbSwGBKFlLAhVLA04CUlcCACkSRDEASwFyCEQSRCIoZURzAkRMcghEEkQrTFBJvUUBQQAnSYEbI7oiU0EAHSNEJw1LAmdJJSO6Jw4SQQAFJwQyB2cnBjIHZyNDIkL/4CInC2VESXMCTE4CRCIoZUQSQQAsIihlRDIKEkEAIjIDSwESRCcLMgNnMgoiFkxQgAQAKgAAUCcYTGcnEyJnI0MyCkL/2ylJNhoBSRWBIBJENhoCSRUjEkQiU4gQUUSxIihlRIAbcmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50sgVLArIgTwKyB7IAI7IQIrIBs0EAHiJFATEWIwhFAksBMgQMQQALSwGIEPJBAAwjRQFJRCcEMgdnI0NLASMIRQJC/9s2GgFJFSUSRBc2GgJJFSMSRCJTNhoDSU4CFYEgEkQ2GgRJIlkkCEsBFRJEVwIATDYaBUlOAhWBBBJEQQAMSwMyA0sDSwOID9hISwNLA0sDSwOID8wnCCJPAlQnBUxQsCNDNhoBSRUlEkQXNhoCSRUjEkQiUzYaA0kiWSQISwEVEkRXAgA2GgRJIlklCyQISwEVEkQ2GgVJIlmBEAskCEsBFRJEiBIGRgIjQzYaAUkiWSQISwEVEkRXAgA2GgJJFSMSRCJTNhoDSSJZJAhLARUSRFcCADYaBEkiWSULJAhLARUSRDYaBUkiWYEQCyQISwEVEkQnD08FUCIluhdOBIgRq0YCI0MiRwMpSTYaAUkVJRJEFzYaAkkVgSASRDYaA0kiWSQISwEVEkRXAgA2GgRJFSMSRCJTNhoFRwIVIxJENhoGSRUlEkQXTDYaB0kVJRJEF0w2GghJTgJJIllJTgOBDAskCEwVEkQ2GglJFSMSRCJTTDYaCkkVIxJEIlNMNhoLSRUjEkQiU0w2GgxJFSMSRCJTTDYaDUkVIxJEIlNMiA5IRCcOEkEBMEsMMgMSQQEoIxRESwNBARxLDDIDE0EBFCMURElAAQJLC0USSw0WSw1QSxJJFRZXBgJMUEwnClBMUCtMUElFFL1FARREIhZFFCcHRREiRQ9LDksGDEEAPUsGVwIASw9JTgKBDAuBDFhJVwAETFcECEsBFYEEEkRQSxVQSxJJTwJQTCJZIwgWVwYCXABFEiMIRQ9C/7tLBEEAgTIGRRAiKGVEMgoTQQAesSIoZUQyCksSIllLFEyIDMSyCLIHsgAjshAisgGzSwtJiAzGTCkTIksETwJNTBZLC1BLChZQSwkWUCcdUCcIIksOVCNLCFQkSwdUgQNLBlSBBE8DVFBLFFBLEBZQSxFQSxNJvEhMvycEMgdnJwYyB2cjQzIHRRBC/3xLCykTRClFEkL+9yJC/ukiQv7VNhoBSRWBIBJENhoCSSJZJAhLARUSRFcCAIgM8UQiKGVEMgoTQQAesSIoZUQyCksCFSEEC4HUegiyCLIHsgAjshAisgGzJxBLAlBJvEhLAb8jQzYaAUkVJRJEFzYaAkkVgSASRDYaA0kiWSQISwEVEkRXAgCIDJZAAAaIDLpBAC4jREsCFksCUEsBSRUWVwYCTFBMJwpQTFArTFBJvUUBRLxIJwQyB2cnBjIHZyNDIkL/zyJHAylJNhoBSSJZJAhLARUSRFcCAEk2GgJJFSUSRBdMNhoDSU4CFYEgEkQ2GgRJIlkkCEsBFRJEVwIATDYaBUkVIxJEIlNMNhoGSU4CSRUjEkQ2GgdJFSUSRBdOAjYaCEkVJRJEF04CNhoJSU4DSSJZSU4EgQwLJAhMFRJENhoKSRUjEkQiU04CNhoLSRUjEkQiU04CNhoMSRUjEkQiU04CNhoNSRUjEkQiU04CNhoOSRUjEkQiU04CiAufRCcPTwJQSU4CvUUBFEQnDhJBATpLDTIDEkEBMiMUREsEQQEmSw0yAxNBAR4jFERLAUABC0sMRRVLDhZLDlBLFUkVFlcGAkxQTCcKUExQSUUVSwFJvEhMvyIWRRYnB0UTIkURSxBLBwxBAD1LB1cCAEsRSU4CgQwLgQxYSVcABExXBAhLARWBBBJEUEsXUEsUSU8CUEwiWSMIFlcGAlwARRQjCEURQv+7IihlRDIKE0EAKLEiKGVEMgpLFCJZSxdMiAoXSxIVIQQLIQUICLIIsgeyACOyECKyAbNLDIgKEEUSSwVBAFQyBksNKRMiSwVPAk1LExZLDVBLDBZQSwsWUCcdUCcIIksQVCNLClQkSwlUgQNLCFSBBE8DVFBLF1BMFlBLE1ArSxVQSbxITL8nBDIHZycGMgdnI0MyB0L/qUsMKRNEKUUVQv7uIkL+3yJC/ssiKTYaAUkiWSQISwEVEkRXAgCICjhAAAaIClxBAGkjRCcPSwFQSb1FAURJvkhJRQUrTFBJvUUBREmBLCS6F0UETLxIvEgiKGVEMgoTQQAssSIoZURLARUhBAshBQhLBEmBKFlLARVSVwIASwSICRkIsgiyByOyECKyAbMnBDIHZycGMgdnI0MiQv+UNhoBSSJZJAhLARUSRFcCAIgJr0QqSwFQvUUBFERJKRNEiAkZFicFTFCwI0M2GgFJIlkkCEsBFRJEVwIAiAmDRCpMUEm9RQFESb5IgUBTFEsBJSO6Ik8CVEsBJU8CuycEMgdnJwYyB2e+SCcFTFCwI0M2GgFJIlkkCEsBFRJEVwIANhoCSSJZgRELJAhLARUSRIgJLkQqSwJQvUUBRCOICzpII0M2GgFJFSUSRBc2GgJJTgJJFYEgEkQ2GgNJIlkkCEsBFRJEVwIASU4DNhoESU4ESSJZgRELJAhMFRJESwIWTwJQSwEVFlcGAksCUEwnClBMUCtMUEm9RQFEgRsjuoEEU0QqTFBJTgK9RQFEMQBMcghEEkAAEDEASwQSQAAISwMyAxJBABUjREm+RIFAUxRLA0sDTwKICqFII0MiQv/oNhoBSSJZJAhLARUSRFcCADYaAkkiWSULJAhLARUSRIgIX0QqSwJQSb1FAUS+SIFAUxREiAn/SCNDNhoBSRUlEkQXNhoCSU4CSRWBIBJENhoDSSJZJAhLARUSRFcCAElOAzYaBElOBEkiWUlOBSULJAhMFRJEMRYjCUlOBDgQIxJESwIWTwJQSwEVFlcGAksCUEwnClBMUCtMUL1FAUQqTFBJvUUBRL5IgUBTFEQxAExyCEQSQAAQMQBLBRJAAAhLBDIDEkEAICNERwI4ByIoZUQSTDgIMhBLBAsSEERLA0sDiAlRSCNDIkL/3SJHBClJNhoBSSJZJAhLARUSRFcCAEk2GgJJTgJJIllJTgOBIgskCEwVEkSIB2hEKkxQSb1FAUS+SIFAUxREIihlRDIKE0EAILEiKGVEMgpLBBUhBAshBghLAwuyCLIHsgAjshAisgGzIkUFSwRLAQxBAIhLAVcCAEsFgSILgSJYSVcACEsBVwgBRQhLAVcJCEUMSwFXEQhFC0sBVxkIRQpMgYgCU0lOAkUGSwRJFRZXBgJMUCcRTwJQTFAnEkxQSUUJvUUBFERBACwyBksGSwpQSwtQIhZMSwFQSwpQTFBMFlAnCCJLBlRQSwdMv0sEIwhFBUL/dTIHQv/RJwQyB2cnBjIHZyNDKTYaAUkiWSQISwEVEkRXAgA2GgJHAiJZSU4CJQskCEwVEkSIBmlAAAaIBo1BAIAjRCpLA1BJvUUBRL5IgUBTFEQiKGVEMgoTQQAcsSIoZURLAxUhBAshBghLAguyCLIHI7IQIrIBsyJFBEsDSwEMQQAxSwFXAgBLBElOAiULJVhLBEkVFlcGAkxQJxFPAlBMUCcSTFBJvUUBRLxIIwhFBEL/xycEMgdnJwYyB2cjQyJC/302GgFJFYEgEkQ2GgJJTgJJIlmBIAskCEwVEkQ2GgNJFSUSRBdOAjYaBEkVJRJEF04CiAWoRCcJTFBJTgO9RQFAACJLAxaAAgASTFBPAhZQTFBLAUm8SEy/JwQyB2cnBjIHZyNDSwJJJCW6F0sFEkRJgQoluhdPAxJESb5ISSJZSwEVSwJLAk8CUk8EVwIAUElXAgAVgSAKFlcGAlwATwIiTwNYTFBLAbxIv0L/qzYaAUkVgSASRCcJTFBJvUUBRIgFGkAADEmBCiW6FzIGDEEAESNESbxIJwQyB2cnBjIHZyNDIkL/7CInDWVEJwVMULAjQyIpNhoBJwciSwIiWUlFBUsBDUEAdEsCVwIASwFJTgIkC0sBTFlPAiMISUUESwZLAQlLAxVPAiQLSwRMWU8CTVIrTFBJRQa9RQFBAB9LBL5ESwJJIllMVwIAJwxPA1BOAiNPA4jwokUCQv+diPEpSwJJIllMVwIAJwxPA1BOAiNPA4jwhEUCQv9/JwVLAlCwI0MiSSk2GgEnByJLAiJZSwENSUUFQQCVSwJXAgBLBERLASQLSwFMWUpZJAhYVwIAJw9MUElFB71FAUEAUksFvkQrTFBJRQa9RQFBACRLBL5ESwJJIllMVwIAJwxPA1BOAiNPA4jwEkUCSSMIRQFC/5qI8JRLAkkiWUxXAgAnDE8DUE4CI08DiO/vRQJC/9qI8HZLAkkiWUxXAgAnDE8DUE4CI08DiO/RRQJC/7wnBUsCULAjQyIpNhoBJwciSwIiWUsBDUlFBUEAYksCVwIASwRESwEkC0sBTFlKWSQIWFcCACpMUElFBr1FAUEAH0sEvkRLAklPAlBMIlkjCBZXBgJcAEUCSSMIRQFC/7BLAUmACQAAAAAAAAAAAFBMIlkjCBZXBgJcAEUCQv/ZJwVLAlCwI0MiNhoBSSJZJAhLARUSRFcCADYaAkcCIllJTgIlCyQITBUSRCIWJwciSUsEDEEAeUsEVwIASwElCyVYSwZJFRZXBgJMUCcRTwJQTFAnEkxQSUUIvUUBQQAfSwa+REsCSU8CUEwiWSMIFlcGAlwARQJJIwhFAUL/sSKI70pLA0lOAlBLAVBLAVBLAVBLAVBMUCcIUEsCSU8CUEwiWSMIFlcGAlwARQJC/8cnBUsCULAjQyI2GgFHAiJZSU4CgSALJAhMFRJEJwciSUsDDEEAaEsDVwIASwGBIAuBIFgnCUxQSUUGvUUBQQAkSwS+REsCSSJZTFcCACcMTwNQTgIjTwOI7kNFAkkjCEUBQv+7SwFJIllMVwIAI4AWAAIAEgAAAAAAAAAAAAAAAAAAAAAAAIjuFEUCQv/OJwVLAlCwI0MiNhoBRwIiWUlOAoEgCyQITBUSRCcHIklLAwxBAERLA1cCAEsBgSALgSBYJxBMUElFBr1FAUEAHUsEvkRJFRZXBgJMUEsCTCOI7VJFAkkjCEUBQv/CSwEnByOI7UBFAkL/6ycFSwJQsCNDNhoBSSJZJAhLARUSRFcCADYaAkkVJRJEFzYaA0kiWSQISwEVEkRXAgA2GgRJFSUSRBdLAxUhBAuB5DJLAQhLBU8FiAB1TwQVIQQLIQVLAQghBk8FCIHUek8DCE8FgYBkC4GUoAEIKk8HUL1OBkgyAYG08gkISwcITwUWTwUWUE8GFlBPBBZQTwIWUE8CFlAnCCJPBFRQTBZQJwVMULAjQzYaAUkiWSULJAhLARUSRIgIQEgnBUxQsCNDigIBgRSL/wuL/hUIIQQLgfSvAgiJigEBIov/KRJBAAMiTIkqi/9QSYwAvUUBQQAIiwC+RCJbTImL/4gAA0L/9ooBASIoZUQyChNBAB6xIihlRDIKi/8VIQQLgeQyCLIIsgeyACOyECKyAbOxIihlRIHwkwkyAQgiJxVlRElyCESyB0yyCEsBsgAjshAisgG2gATYXPGEshqyGLIAgQayECKyAbO3AT5JVwQATFcABCcFEkRJFSUSRBdJFicIUCqL/1BMv4kxACInDWVEEkAAGycQMQBQvUUBQQASJxAxAFC+RCInFGVEEkEAAiOJIokxACInFmVEcghEEomKBAEpRwWL/BaL/VCL/hUWVwYCi/5QTCcKUExQK0xQSb1FAUAABCKMAImLBkmBESW6F4wASYEbI7pJI1OMBSRTTIEcJboXjANBAAQijACJiwaBLCS6FxSMBCKMAosGgSwkuheLAg1BABqLAoEUC4EuCIsGTIEUulcABIv/EkEAMSOMBIsFQQAiMgaMAYsDiwEPQQASiwGLAwmLAA9BAAcjiwQQjACJIkL/9jIHjAFC/9uLAiMIjAJC/6KKAQGL/zgAIihlRBJBAAyL/zggMgoSQQACI4mL/zgQgQYSQQAni/84GDIIEkEAHYv/OBsjEkEAFIv/OBlAAA2L/yLCGicZEkEAAiOJIomKAQIpRwIri/9QSb1JTwJIQAAKgAFgi/+MAYwAiYsDSYEJJboXjAJJgREluheMAEmBGyO6I1NMgRwluheMAUEAMDIGSYsCDUyLAQmLAAyLA4EsJLoXIg0nCCKLBFQjTwRUJE8DVIEDTwJUi/+MAYwAiTIHQv/NigIBKov+UL5EIltyCExJTwJEsSIoZUQyEIv/IllJTgQLsgiyALIHI7IQIrIBsyKLAosBDEEAKbGL/1cCAIsCSU4CJQtbshEishKLAEmyFLIAgQSyECKyAbMjCIwCQv/Pi/+MAImKAwEiSSlHAiIqi/1QvkQiW3IIRCKL/iJZiwcNQQCFi/5XAgCLB4ERC4ERWEmMACJbSYwCQAAhsSIoZUSLACVbsgiyB4sGsgAjshAisgGziwcjCIwHQv+9IihlTIwBRIsAJVuMAyKMBIv/QQASiwCBgAFTQQAJIihlRCOMBIwFsYsEQQAEiwWyFYsCshGLA7ISiwGyFIsGsgCBBLIQIrIBs0L/q4v+jACJigUCIkcLKUcUi/xBBJ4yA4v7FkxQi/0VFlcGAov9UEmMAUwnClBMUEmMBytLAVBJjAJJvUUBRCcYTwJnIiW6F0mMEEEEW4sQcghEJwtMZyqL/VC+RCJbcghMjAZEIowSi/8iWYsSDUEBh4v/VwIAixKBEAuBEFhJjAAiW0mMIBYnEUxQiwFQJxJMUEmMA0m9RQFEvkhJVwABjAtJgRFbjB1JgQlbjAxJgSFbjBVJI1uMF0mBGVuME0mBKVuMHoGIA1NJjB9BASIyBowbiwsnDhJBAG6LDIsdCYsAJVtMSwEPRIsDSU4CvkSBEVsIFoERTLuLGxaLA4EhTwK7iyBBACaxIihlRIsAJVuLILIRshKLBrIUsgCBBLIQIrIBs4sSIwiMEkL/ObEiKGVEiwAlW7IIiwayB7IAI7IQIrIBs0L/3IsLgAECEkEAWosfQQBIMgZJix4JixMYCYsVDUEAF4sASVcICEwlW4sMDkSLA4ERTwK7Qv97iwyLHQmLACVbTEsBD0SLA0lOAr5EgRFbCBaBEUy7Qv9aMgdJix4JixMYCUL/tYsLgAEDEkH/RIsfQQAwMgaMD4sPixUJixMKiwwLix0ISYsXSU4DDUxOAk2LACVbSg9ECRaLA4ERTwK7Qv8PMgeMD0L/zTIHjBtC/tuLAoEbI7pJI1OMHyRTQQBuiPs6QABoJwkxBlC9RQFEJwkxBlAkJboXMgYORCcJMQZQgQoluhcyBg9EJwkxBlCMBSKMESKMEosFgRIkuheLEg1BACCLEoEgC4EUCIsFTIEgujILEkEAAyOMEYsSIwiMEkL/04sRRCcJMQZQvEiLB4j8CIwHSSJTREkjUxREJFMURIsfQQISMgaMDyKMHCKMGTEWIwiMFIsHjAiLFDIEDEEAC4sUiPuFQQDNI4wcixxEK4sIUEmMBIEbI7qBA1NBAICBkAIyAAtJjBgxAQ1BAGwxAbEiKGVEMQCL+3IIRIArcmVrZXlpbmcgdG8gcGx1Z2luIGFwcCAmIHJlaW1idXJzaW5nIGNhbGxlcrIFsiBPArIIsgeyACOyECKyAbMnEzEWZ4sEJSO6Jw4SQQAFJwQyB2eL/ov/jAGMAImLGEL/kbEiJwtlRIv7cghEgBZyZWtleWluZyB0byBwbHVnaW4gYXBwsgWyIEmyB7IAI7IQIrIBs0L/p4sUOBCBBhNBAA2LCIsUIwiMFIwIQv8MixRJOBiLB0lOAyJbEkRJOBkUREk4GyMNRCPCGhcyCBJEiPrIjAdJI1NLASRTTwKBA1NPAhRETBREQQCji/4iWYsZSU8CDESL/lcCAEwlC1uLFCLCGkmMChWBBBJEK4sHUEmMAkmBGyO6I1NJTgKMH08CgRQLSYwNgS4IgRS6SVcABIwJSYEEW4wOgQxbjBZBAHMyBosWCYsODIwaiwmLChJBAFuLDkEABYsaQABRiw5BABOLH0EAQjIGFosNgToIiwJMTwK7gAGAI4saVEkiU0wjU4waQQAeixpAABkjRCuLB0lOAlCLDxaBHEy7ixkjCIwZQv7/IkL/5DIHQv+7gAFAQv/IMgdC/4oyB4wPQv3rIihlRCcLTGdC/UUxAEL7X4oBAiIpRwInByKL/yJZiwUNQQCrIowBi/9XAgCLBSULSiVYjABbSYwCQACAMgpzAEyMAUSxIoAJYWtpdGFfZGFvZUSAA2FhbGVIIlsiKGVEgARMiOrOshqyGosAshqyGIEGshAisgGztD5JVwQASwFXAAQnBRJEFYEQEkRJgQRbiwEITIEMWwgWJxdMUFcCAIsETFBJVwIAFSUKFlcGAlwAjASLBSMIjAVC/14yCosCcABMjANB/3yLA4wBQv91iwSL/4wBjACJ", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
class BinaryStateValue {
    constructor(value) {
        this.value = value;
    }
    asByteArray() {
        return this.value;
    }
    asString() {
        return this.value !== undefined ? Buffer.from(this.value).toString('utf-8') : undefined;
    }
}
/**
 * Converts the ABI tuple representation of a AbstractAccountBoxMBRData to the struct representation
 */
export function AbstractAccountBoxMbrDataFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.AbstractAccountBoxMBRData, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a AllowanceInfo to the struct representation
 */
export function AllowanceInfoFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.AllowanceInfo, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a AllowanceKey to the struct representation
 */
export function AllowanceKeyFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.AllowanceKey, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a EscrowInfo to the struct representation
 */
export function EscrowInfoFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.EscrowInfo, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ExecutionInfo to the struct representation
 */
export function ExecutionInfoFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.ExecutionInfo, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a PluginInfo to the struct representation
 */
export function PluginInfoFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.PluginInfo, APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a PluginKey to the struct representation
 */
export function PluginKeyFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.PluginKey, APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the AbstractedAccount smart contract
 */
export class AbstractedAccountParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,address,address,string,uint64,uint64,string,address)void':
                        return AbstractedAccountParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the AbstractedAccount smart contract using the create(string,address,address,string,uint64,uint64,string,address)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(string,address,address,string,uint64,uint64,string,address)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.controlledAddress, params.args.admin, params.args.domain, params.args.escrowFactory, params.args.revocationApp, params.args.nickname, params.args.referrer],
                };
            },
        };
    }
    /**
     * Gets available update ABI call param factories
     */
    static get update() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'update':
                    case 'update(string)void':
                        return AbstractedAccountParamsFactory.update.update(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs update ABI call params for the AbstractedAccount smart contract using the update(string)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            update(params) {
                return {
                    ...params,
                    method: 'update(string)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.version],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the register(string)void ABI method
     *
    * Register the abstracted account with the escrow factory.
    This allows apps to correlate the account with the app without needing
    it to be explicitly provided.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static register(params) {
        return {
            ...params,
            method: 'register(string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow],
        };
    }
    /**
     * Constructs a no op call for the setDomain(string)void ABI method
     *
     * Set the domain associated with the admin account
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setDomain(params) {
        return {
            ...params,
            method: 'setDomain(string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.domain],
        };
    }
    /**
     * Constructs a no op call for the setRevocationApp(uint64)void ABI method
     *
     * Changes the revocation app associated with the contract
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setRevocationApp(params) {
        return {
            ...params,
            method: 'setRevocationApp(uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.app],
        };
    }
    /**
     * Constructs a no op call for the setNickname(string)void ABI method
     *
     * Changes the nickname of the wallet
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setNickname(params) {
        return {
            ...params,
            method: 'setNickname(string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.nickname],
        };
    }
    /**
     * Constructs a no op call for the setAvatar(uint64)void ABI method
     *
     * Changes the avatar of the wallet
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setAvatar(params) {
        return {
            ...params,
            method: 'setAvatar(uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.avatar],
        };
    }
    /**
     * Constructs a no op call for the setBanner(uint64)void ABI method
     *
     * Changes the banner of the wallet
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setBanner(params) {
        return {
            ...params,
            method: 'setBanner(uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.banner],
        };
    }
    /**
     * Constructs a no op call for the setBio(string)void ABI method
     *
     * Changes the bio of the wallet
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static setBio(params) {
        return {
            ...params,
            method: 'setBio(string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.bio],
        };
    }
    /**
     * Constructs a no op call for the arc58_changeAdmin(address)void ABI method
     *
     * Attempt to change the admin for this app. Some implementations MAY not support this.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58ChangeAdmin(params) {
        return {
            ...params,
            method: 'arc58_changeAdmin(address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.newAdmin],
        };
    }
    /**
     * Constructs a no op call for the arc58_pluginChangeAdmin(address)void ABI method
     *
     * Attempt to change the admin via plugin.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58PluginChangeAdmin(params) {
        return {
            ...params,
            method: 'arc58_pluginChangeAdmin(address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.newAdmin],
        };
    }
    /**
     * Constructs a no op call for the arc58_verifyAuthAddress()void ABI method
     *
     * Verify the abstracted account is rekeyed to this app
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58VerifyAuthAddress(params) {
        return {
            ...params,
            method: 'arc58_verifyAuthAddress()void',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the arc58_rekeyTo(address,bool)void ABI method
     *
     * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RekeyTo(params) {
        return {
            ...params,
            method: 'arc58_rekeyTo(address,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.flash],
        };
    }
    /**
     * Constructs a no op call for the arc58_canCall(uint64,bool,address,string,byte[4])bool ABI method
     *
     * Check whether the plugin can be used
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58CanCall(params) {
        return {
            ...params,
            method: 'arc58_canCall(uint64,bool,address,string,byte[4])bool',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.global, params.args.address, params.args.escrow, params.args.method],
        };
    }
    /**
     * Constructs a no op call for the arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void ABI method
     *
     * Temporarily rekey to an approved plugin app address
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RekeyToPlugin(params) {
        return {
            ...params,
            method: 'arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.global, params.args.escrow, params.args.methodOffsets, params.args.fundsRequest],
        };
    }
    /**
     * Constructs a no op call for the arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void ABI method
     *
     * Temporarily rekey to a named plugin app address
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RekeyToNamedPlugin(params) {
        return {
            ...params,
            method: 'arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.global, params.args.escrow, params.args.methodOffsets, params.args.fundsRequest],
        };
    }
    /**
     * Constructs a no op call for the arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void ABI method
     *
     * Add an app to the list of approved plugins
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddPlugin(params) {
        return {
            ...params,
            method: 'arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.caller, params.args.escrow, params.args.admin, params.args.delegationType, params.args.lastValid, params.args.cooldown, params.args.methods, params.args.useRounds, params.args.useExecutionKey, params.args.coverFees, params.args.canReclaim, params.args.defaultToEscrow],
        };
    }
    /**
     * Constructs a no op call for the assignDomain(address,string)void ABI method
     *
     * Assign a domain to a passkey
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static assignDomain(params) {
        return {
            ...params,
            method: 'assignDomain(address,string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.caller, params.args.domain],
        };
    }
    /**
     * Constructs a no op call for the arc58_removePlugin(uint64,address,string)void ABI method
     *
     * Remove an app from the list of approved plugins
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RemovePlugin(params) {
        return {
            ...params,
            method: 'arc58_removePlugin(uint64,address,string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.caller, params.args.escrow],
        };
    }
    /**
     * Constructs a no op call for the arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void ABI method
     *
     * Add a named plugin
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddNamedPlugin(params) {
        return {
            ...params,
            method: 'arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.plugin, params.args.caller, params.args.escrow, params.args.admin, params.args.delegationType, params.args.lastValid, params.args.cooldown, params.args.methods, params.args.useRounds, params.args.useExecutionKey, params.args.coverFees, params.args.canReclaim, params.args.defaultToEscrow],
        };
    }
    /**
     * Constructs a no op call for the arc58_removeNamedPlugin(string)void ABI method
     *
     * Remove a named plugin
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RemoveNamedPlugin(params) {
        return {
            ...params,
            method: 'arc58_removeNamedPlugin(string)void',
            args: Array.isArray(params.args) ? params.args : [params.args.name],
        };
    }
    /**
     * Constructs a no op call for the arc58_newEscrow(string)uint64 ABI method
     *
     * Create a new escrow for the controlled address
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58NewEscrow(params) {
        return {
            ...params,
            method: 'arc58_newEscrow(string)uint64',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow],
        };
    }
    /**
     * Constructs a no op call for the arc58_toggleEscrowLock(string)(uint64,bool) ABI method
     *
     * Lock or Unlock an escrow account
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58ToggleEscrowLock(params) {
        return {
            ...params,
            method: 'arc58_toggleEscrowLock(string)(uint64,bool)',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow],
        };
    }
    /**
     * Constructs a no op call for the arc58_reclaim(string,(uint64,uint64,bool)[])void ABI method
     *
     * Transfer funds from an escrow back to the controlled address.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58Reclaim(params) {
        return {
            ...params,
            method: 'arc58_reclaim(string,(uint64,uint64,bool)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.reclaims],
        };
    }
    /**
     * Constructs a no op call for the arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void ABI method
     *
    * Transfer funds from an escrow back to the controlled address via a plugin / allowed caller.
    The plugin must have canReclaim set to true. CloseOut on asset transfers is blocked when the escrow is locked.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58PluginReclaim(params) {
        return {
            ...params,
            method: 'arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.caller, params.args.escrow, params.args.reclaims],
        };
    }
    /**
     * Constructs a no op call for the arc58_optInEscrow(string,uint64[])void ABI method
     *
     * Opt-in an escrow account to assets
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58OptInEscrow(params) {
        return {
            ...params,
            method: 'arc58_optInEscrow(string,uint64[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.assets],
        };
    }
    /**
     * Constructs a no op call for the arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void ABI method
     *
     * Opt-in an escrow account to assets via a plugin / allowed caller
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58PluginOptInEscrow(params) {
        return {
            ...params,
            method: 'arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.caller, params.args.escrow, params.args.assets, params.args.mbrPayment],
        };
    }
    /**
     * Constructs a no op call for the arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void ABI method
     *
     * Add an allowance for an escrow account
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddAllowances(params) {
        return {
            ...params,
            method: 'arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.allowances],
        };
    }
    /**
     * Constructs a no op call for the arc58_removeAllowances(string,uint64[])void ABI method
     *
     * Remove an allowances for an escrow account
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RemoveAllowances(params) {
        return {
            ...params,
            method: 'arc58_removeAllowances(string,uint64[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.assets],
        };
    }
    /**
     * Constructs a no op call for the arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void ABI method
     *
     * Add or extend an execution key for pre-authorized plugin usage
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddExecutionKey(params) {
        return {
            ...params,
            method: 'arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.lease, params.args.groups, params.args.firstValid, params.args.lastValid],
        };
    }
    /**
     * Constructs a no op call for the arc58_removeExecutionKey(byte[32])void ABI method
     *
     * Remove an execution key. Can be called by admin at any time, or by anyone after the key has expired.
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58RemoveExecutionKey(params) {
        return {
            ...params,
            method: 'arc58_removeExecutionKey(byte[32])void',
            args: Array.isArray(params.args) ? params.args : [params.args.lease],
        };
    }
    /**
     * Constructs a no op call for the arc58_getAdmin()address ABI method
     *
    * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
    because different implementations may have different ways of determining the admin.
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetAdmin(params) {
        return {
            ...params,
            method: 'arc58_getAdmin()address',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[] ABI method
     *
     * Get plugin info for a list of plugin keys
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetPlugins(params) {
        return {
            ...params,
            method: 'arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.keys],
        };
    }
    /**
     * Constructs a no op call for the arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[] ABI method
     *
     * Get plugin info for a list of named plugins
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetNamedPlugins(params) {
        return {
            ...params,
            method: 'arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.names],
        };
    }
    /**
     * Constructs a no op call for the arc58_getEscrows(string[])(uint64,bool)[] ABI method
     *
     * Get escrow info for a list of escrow names
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetEscrows(params) {
        return {
            ...params,
            method: 'arc58_getEscrows(string[])(uint64,bool)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.escrows],
        };
    }
    /**
     * Constructs a no op call for the arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[] ABI method
     *
     * Get allowance info for a list of assets on a given escrow
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetAllowances(params) {
        return {
            ...params,
            method: 'arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.assets],
        };
    }
    /**
     * Constructs a no op call for the arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[] ABI method
     *
     * Get execution key info for a list of leases
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetExecutions(params) {
        return {
            ...params,
            method: 'arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.leases],
        };
    }
    /**
     * Constructs a no op call for the arc58_getDomainKeys(address[])string[] ABI method
     *
     * Get domain key assignments for a list of addresses
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetDomainKeys(params) {
        return {
            ...params,
            method: 'arc58_getDomainKeys(address[])string[]',
            args: Array.isArray(params.args) ? params.args : [params.args.addresses],
        };
    }
    /**
     * Constructs a no op call for the mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64) ABI method
     *
     * Calculate the minimum balance requirements for various box operations
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static mbr(params) {
        return {
            ...params,
            method: 'mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.methodCount, params.args.plugin, params.args.groups],
        };
    }
    /**
     * Constructs a no op call for the balance(uint64[])uint64[] ABI method
     *
     * Get the balance of a set of assets in the account, including staked amounts
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static balance(params) {
        return {
            ...params,
            method: 'balance(uint64[])uint64[]',
            args: Array.isArray(params.args) ? params.args : [params.args.assets],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the AbstractedAccount smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class AbstractedAccountFactory {
    /**
     * Creates a new instance of `AbstractedAccountFactory`
     *
     * @param params The parameters to initialise the app factory with
     */
    constructor(params) {
        /**
         * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the AbstractedAccount smart contract using the create(string,address,address,string,uint64,uint64,string,address)void ABI method.
                 *
                * Create an abstracted account application.
                This is not part of ARC58 and implementation specific.
          
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(AbstractedAccountParamsFactory.create.create(params));
                },
            },
            /**
             * Gets available deployUpdate methods
             */
            deployUpdate: {
                /**
                 * Updates an existing instance of the AbstractedAccount smart contract using the update(string)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The deployUpdate params
                 */
                update: (params) => {
                    return this.appFactory.params.deployUpdate(AbstractedAccountParamsFactory.update.update(params));
                },
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the AbstractedAccount smart contract using the create(string,address,address,string,uint64,uint64,string,address)void ABI method.
                 *
                * Create an abstracted account application.
                This is not part of ARC58 and implementation specific.
          
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(AbstractedAccountParamsFactory.create.create(params));
                },
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the AbstractedAccount smart contract using an ABI method call using the create(string,address,address,string,uint64,uint64,string,address)void ABI method.
                 *
                * Create an abstracted account application.
                This is not part of ARC58 and implementation specific.
          
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(AbstractedAccountParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new AbstractedAccountClient(result.appClient) };
                },
            },
        };
        this.appFactory = new _AppFactory({
            ...params,
            appSpec: APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return APP_SPEC;
    }
    /** A reference to the underlying `AlgorandClient` this app factory is using. */
    get algorand() {
        return this.appFactory.algorand;
    }
    /**
     * Returns a new `AppClient` client for an app instance of the given ID.
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    getAppClientById(params) {
        return new AbstractedAccountClient(this.appFactory.getAppClientById(params));
    }
    /**
     * Returns a new `AppClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    async getAppClientByCreatorAndName(params) {
        return new AbstractedAccountClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the AbstractedAccount smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? AbstractedAccountParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
            updateParams: params.updateParams?.method ? AbstractedAccountParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : undefined,
        });
        return { result: result.result, appClient: new AbstractedAccountClient(result.appClient) };
    }
}
/**
 * A client to make calls to the AbstractedAccount smart contract
 */
export class AbstractedAccountClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the AbstractedAccount smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update params
                 */
                update: (params) => {
                    return this.appClient.params.update(AbstractedAccountParamsFactory.update.update(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the AbstractedAccount smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `register(string)void` ABI method.
             *
            * Register the abstracted account with the escrow factory.
            This allows apps to correlate the account with the app without needing
            it to be explicitly provided.
        
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.register(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setDomain(string)void` ABI method.
             *
             * Set the domain associated with the admin account
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setDomain: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setDomain(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setRevocationApp(uint64)void` ABI method.
             *
             * Changes the revocation app associated with the contract
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setRevocationApp: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setRevocationApp(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setNickname(string)void` ABI method.
             *
             * Changes the nickname of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setNickname: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setNickname(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setAvatar(uint64)void` ABI method.
             *
             * Changes the avatar of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setAvatar: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setAvatar(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBanner(uint64)void` ABI method.
             *
             * Changes the banner of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setBanner: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setBanner(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBio(string)void` ABI method.
             *
             * Changes the bio of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            setBio: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.setBio(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_changeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin for this app. Some implementations MAY not support this.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58ChangeAdmin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58ChangeAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginChangeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin via plugin.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58PluginChangeAdmin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58PluginChangeAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_verifyAuthAddress()void` ABI method.
             *
             * Verify the abstracted account is rekeyed to this app
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58VerifyAuthAddress: (params = { args: [] }) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58VerifyAuthAddress(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyTo(address,bool)void` ABI method.
             *
             * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RekeyTo: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RekeyTo(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_canCall(uint64,bool,address,string,byte[4])bool` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call params: Whether the plugin can be called with these parameters
             */
            arc58CanCall: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58CanCall(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to an approved plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RekeyToPlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RekeyToPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to a named plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RekeyToNamedPlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RekeyToNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add an app to the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58AddPlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58AddPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `assignDomain(address,string)void` ABI method.
             *
             * Assign a domain to a passkey
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            assignDomain: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.assignDomain(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removePlugin(uint64,address,string)void` ABI method.
             *
             * Remove an app from the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RemovePlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RemovePlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58AddNamedPlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58AddNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeNamedPlugin(string)void` ABI method.
             *
             * Remove a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RemoveNamedPlugin: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RemoveNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_newEscrow(string)uint64` ABI method.
             *
             * Create a new escrow for the controlled address
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58NewEscrow: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58NewEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_toggleEscrowLock(string)(uint64,bool)` ABI method.
             *
             * Lock or Unlock an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58ToggleEscrowLock: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58ToggleEscrowLock(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_reclaim(string,(uint64,uint64,bool)[])void` ABI method.
             *
             * Transfer funds from an escrow back to the controlled address.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58Reclaim: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58Reclaim(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void` ABI method.
             *
            * Transfer funds from an escrow back to the controlled address via a plugin / allowed caller.
            The plugin must have canReclaim set to true. CloseOut on asset transfers is blocked when the escrow is locked.
        
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58PluginReclaim: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58PluginReclaim(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optInEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58OptInEscrow: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58OptInEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58PluginOptInEscrow: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58PluginOptInEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void` ABI method.
             *
             * Add an allowance for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58AddAllowances: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58AddAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeAllowances(string,uint64[])void` ABI method.
             *
             * Remove an allowances for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RemoveAllowances: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RemoveAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void` ABI method.
             *
             * Add or extend an execution key for pre-authorized plugin usage
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58AddExecutionKey: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58AddExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeExecutionKey(byte[32])void` ABI method.
             *
             * Remove an execution key. Can be called by admin at any time, or by anyone after the key has expired.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58RemoveExecutionKey: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58RemoveExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAdmin()address` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
            * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
            because different implementations may have different ways of determining the admin.
        
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetAdmin: (params = { args: [] }) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of plugin keys
             *
             * @param params The params for the smart contract call
             * @returns The call params: The plugin info for each key, or empty plugin info if the key does not exist
             */
            arc58GetPlugins: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of named plugins
             *
             * @param params The params for the smart contract call
             * @returns The call params: The plugin info for each name, or empty plugin info if the name does not exist
             */
            arc58GetNamedPlugins: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get escrow info for a list of escrow names
             *
             * @param params The params for the smart contract call
             * @returns The call params: The escrow info for each name, or empty escrow info if the name does not exist
             */
            arc58GetEscrows: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get allowance info for a list of assets on a given escrow
             *
             * @param params The params for the smart contract call
             * @returns The call params: The allowance info for each asset, or empty allowance info if no allowance exists
             */
            arc58GetAllowances: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get execution key info for a list of leases
             *
             * @param params The params for the smart contract call
             * @returns The call params: The execution info for each lease, or empty execution info if the lease does not exist
             */
            arc58GetExecutions: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get domain key assignments for a list of addresses
             *
             * @param params The params for the smart contract call
             * @returns The call params: The domain string for each address, or empty string if no domain is assigned
             */
            arc58GetDomainKeys: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Calculate the minimum balance requirements for various box operations
             *
             * @param params The params for the smart contract call
             * @returns The call params: The MBR costs for plugins, named plugins, escrows, allowances, domain keys, executions, and new escrow creation
             */
            mbr: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get the balance of a set of assets in the account, including staked amounts
             *
             * @param params The params for the smart contract call
             * @returns The call params: The balance for each asset including any staked amounts
             */
            balance: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.balance(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the AbstractedAccount smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update transaction
                 */
                update: (params) => {
                    return this.appClient.createTransaction.update(AbstractedAccountParamsFactory.update.update(params));
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the AbstractedAccount smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `register(string)void` ABI method.
             *
            * Register the abstracted account with the escrow factory.
            This allows apps to correlate the account with the app without needing
            it to be explicitly provided.
        
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.register(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setDomain(string)void` ABI method.
             *
             * Set the domain associated with the admin account
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setDomain: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setDomain(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setRevocationApp(uint64)void` ABI method.
             *
             * Changes the revocation app associated with the contract
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setRevocationApp: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setRevocationApp(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setNickname(string)void` ABI method.
             *
             * Changes the nickname of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setNickname: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setNickname(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setAvatar(uint64)void` ABI method.
             *
             * Changes the avatar of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setAvatar: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setAvatar(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBanner(uint64)void` ABI method.
             *
             * Changes the banner of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setBanner: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setBanner(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBio(string)void` ABI method.
             *
             * Changes the bio of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            setBio: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.setBio(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_changeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin for this app. Some implementations MAY not support this.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58ChangeAdmin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58ChangeAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginChangeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin via plugin.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58PluginChangeAdmin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58PluginChangeAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_verifyAuthAddress()void` ABI method.
             *
             * Verify the abstracted account is rekeyed to this app
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58VerifyAuthAddress: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58VerifyAuthAddress(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyTo(address,bool)void` ABI method.
             *
             * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RekeyTo: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RekeyTo(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_canCall(uint64,bool,address,string,byte[4])bool` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: Whether the plugin can be called with these parameters
             */
            arc58CanCall: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58CanCall(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to an approved plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RekeyToPlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RekeyToPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to a named plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RekeyToNamedPlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RekeyToNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add an app to the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58AddPlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58AddPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `assignDomain(address,string)void` ABI method.
             *
             * Assign a domain to a passkey
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            assignDomain: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.assignDomain(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removePlugin(uint64,address,string)void` ABI method.
             *
             * Remove an app from the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RemovePlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RemovePlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58AddNamedPlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58AddNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeNamedPlugin(string)void` ABI method.
             *
             * Remove a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RemoveNamedPlugin: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RemoveNamedPlugin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_newEscrow(string)uint64` ABI method.
             *
             * Create a new escrow for the controlled address
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58NewEscrow: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58NewEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_toggleEscrowLock(string)(uint64,bool)` ABI method.
             *
             * Lock or Unlock an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58ToggleEscrowLock: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58ToggleEscrowLock(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_reclaim(string,(uint64,uint64,bool)[])void` ABI method.
             *
             * Transfer funds from an escrow back to the controlled address.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58Reclaim: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58Reclaim(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void` ABI method.
             *
            * Transfer funds from an escrow back to the controlled address via a plugin / allowed caller.
            The plugin must have canReclaim set to true. CloseOut on asset transfers is blocked when the escrow is locked.
        
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58PluginReclaim: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58PluginReclaim(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optInEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58OptInEscrow: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58OptInEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58PluginOptInEscrow: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58PluginOptInEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void` ABI method.
             *
             * Add an allowance for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58AddAllowances: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58AddAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeAllowances(string,uint64[])void` ABI method.
             *
             * Remove an allowances for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RemoveAllowances: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RemoveAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void` ABI method.
             *
             * Add or extend an execution key for pre-authorized plugin usage
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58AddExecutionKey: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58AddExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeExecutionKey(byte[32])void` ABI method.
             *
             * Remove an execution key. Can be called by admin at any time, or by anyone after the key has expired.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58RemoveExecutionKey: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58RemoveExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAdmin()address` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
            * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
            because different implementations may have different ways of determining the admin.
        
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetAdmin: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetAdmin(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of plugin keys
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The plugin info for each key, or empty plugin info if the key does not exist
             */
            arc58GetPlugins: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of named plugins
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The plugin info for each name, or empty plugin info if the name does not exist
             */
            arc58GetNamedPlugins: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get escrow info for a list of escrow names
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The escrow info for each name, or empty escrow info if the name does not exist
             */
            arc58GetEscrows: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get allowance info for a list of assets on a given escrow
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The allowance info for each asset, or empty allowance info if no allowance exists
             */
            arc58GetAllowances: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get execution key info for a list of leases
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The execution info for each lease, or empty execution info if the lease does not exist
             */
            arc58GetExecutions: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get domain key assignments for a list of addresses
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The domain string for each address, or empty string if no domain is assigned
             */
            arc58GetDomainKeys: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Calculate the minimum balance requirements for various box operations
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The MBR costs for plugins, named plugins, escrows, allowances, domain keys, executions, and new escrow creation
             */
            mbr: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get the balance of a set of assets in the account, including staked amounts
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: The balance for each asset including any staked amounts
             */
            balance: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.balance(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available update methods
             */
            update: {
                /**
                 * Updates an existing instance of the AbstractedAccount smart contract using the `update(string)void` ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The update result
                 */
                update: async (params) => {
                    const result = await this.appClient.send.update(AbstractedAccountParamsFactory.update.update(params));
                    return { ...result, return: result.return };
                },
            },
            /**
             * Makes a clear_state call to an existing instance of the AbstractedAccount smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `register(string)void` ABI method.
             *
            * Register the abstracted account with the escrow factory.
            This allows apps to correlate the account with the app without needing
            it to be explicitly provided.
        
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setDomain(string)void` ABI method.
             *
             * Set the domain associated with the admin account
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setDomain: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setDomain(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setRevocationApp(uint64)void` ABI method.
             *
             * Changes the revocation app associated with the contract
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setRevocationApp: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setRevocationApp(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setNickname(string)void` ABI method.
             *
             * Changes the nickname of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setNickname: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setNickname(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setAvatar(uint64)void` ABI method.
             *
             * Changes the avatar of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setAvatar: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setAvatar(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBanner(uint64)void` ABI method.
             *
             * Changes the banner of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setBanner: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setBanner(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `setBio(string)void` ABI method.
             *
             * Changes the bio of the wallet
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            setBio: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.setBio(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_changeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin for this app. Some implementations MAY not support this.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58ChangeAdmin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58ChangeAdmin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginChangeAdmin(address)void` ABI method.
             *
             * Attempt to change the admin via plugin.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58PluginChangeAdmin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58PluginChangeAdmin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_verifyAuthAddress()void` ABI method.
             *
             * Verify the abstracted account is rekeyed to this app
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58VerifyAuthAddress: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58VerifyAuthAddress(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyTo(address,bool)void` ABI method.
             *
             * Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RekeyTo: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RekeyTo(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_canCall(uint64,bool,address,string,byte[4])bool` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call result: Whether the plugin can be called with these parameters
             */
            arc58CanCall: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58CanCall(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to an approved plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RekeyToPlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RekeyToPlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void` ABI method.
             *
             * Temporarily rekey to a named plugin app address
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RekeyToNamedPlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RekeyToNamedPlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add an app to the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58AddPlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58AddPlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `assignDomain(address,string)void` ABI method.
             *
             * Assign a domain to a passkey
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            assignDomain: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.assignDomain(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removePlugin(uint64,address,string)void` ABI method.
             *
             * Remove an app from the list of approved plugins
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RemovePlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RemovePlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void` ABI method.
             *
             * Add a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58AddNamedPlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58AddNamedPlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeNamedPlugin(string)void` ABI method.
             *
             * Remove a named plugin
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RemoveNamedPlugin: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RemoveNamedPlugin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_newEscrow(string)uint64` ABI method.
             *
             * Create a new escrow for the controlled address
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58NewEscrow: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58NewEscrow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_toggleEscrowLock(string)(uint64,bool)` ABI method.
             *
             * Lock or Unlock an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58ToggleEscrowLock: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58ToggleEscrowLock(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_reclaim(string,(uint64,uint64,bool)[])void` ABI method.
             *
             * Transfer funds from an escrow back to the controlled address.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58Reclaim: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58Reclaim(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void` ABI method.
             *
            * Transfer funds from an escrow back to the controlled address via a plugin / allowed caller.
            The plugin must have canReclaim set to true. CloseOut on asset transfers is blocked when the escrow is locked.
        
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58PluginReclaim: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58PluginReclaim(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optInEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58OptInEscrow: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58OptInEscrow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58PluginOptInEscrow: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58PluginOptInEscrow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void` ABI method.
             *
             * Add an allowance for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58AddAllowances: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58AddAllowances(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeAllowances(string,uint64[])void` ABI method.
             *
             * Remove an allowances for an escrow account
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RemoveAllowances: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RemoveAllowances(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void` ABI method.
             *
             * Add or extend an execution key for pre-authorized plugin usage
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58AddExecutionKey: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58AddExecutionKey(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeExecutionKey(byte[32])void` ABI method.
             *
             * Remove an execution key. Can be called by admin at any time, or by anyone after the key has expired.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58RemoveExecutionKey: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58RemoveExecutionKey(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAdmin()address` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
            * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
            because different implementations may have different ways of determining the admin.
        
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58GetAdmin: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetAdmin(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of plugin keys
             *
             * @param params The params for the smart contract call
             * @returns The call result: The plugin info for each key, or empty plugin info if the key does not exist
             */
            arc58GetPlugins: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get plugin info for a list of named plugins
             *
             * @param params The params for the smart contract call
             * @returns The call result: The plugin info for each name, or empty plugin info if the name does not exist
             */
            arc58GetNamedPlugins: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get escrow info for a list of escrow names
             *
             * @param params The params for the smart contract call
             * @returns The call result: The escrow info for each name, or empty escrow info if the name does not exist
             */
            arc58GetEscrows: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get allowance info for a list of assets on a given escrow
             *
             * @param params The params for the smart contract call
             * @returns The call result: The allowance info for each asset, or empty allowance info if no allowance exists
             */
            arc58GetAllowances: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get execution key info for a list of leases
             *
             * @param params The params for the smart contract call
             * @returns The call result: The execution info for each lease, or empty execution info if the lease does not exist
             */
            arc58GetExecutions: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get domain key assignments for a list of addresses
             *
             * @param params The params for the smart contract call
             * @returns The call result: The domain string for each address, or empty string if no domain is assigned
             */
            arc58GetDomainKeys: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Calculate the minimum balance requirements for various box operations
             *
             * @param params The params for the smart contract call
             * @returns The call result: The MBR costs for plugins, named plugins, escrows, allowances, domain keys, executions, and new escrow creation
             */
            mbr: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.mbr(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get the balance of a set of assets in the account, including staked amounts
             *
             * @param params The params for the smart contract call
             * @returns The call result: The balance for each asset including any staked amounts
             */
            balance: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.balance(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current AbstractedAccount app
         */
        this.state = {
            /**
             * Methods to access global state for the current AbstractedAccount app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        version: result.version,
                        akitaDao: result.akitaDAO,
                        admin: result.admin,
                        domain: result.domain,
                        controlledAddress: result.controlledAddress,
                        nickname: result.nickname,
                        avatar: result.avatar,
                        banner: result.banner,
                        bio: result.bio,
                        lastUserInteraction: result.lastUserInteraction,
                        lastChange: result.lastChange,
                        spendingAddress: result.spendingAddress,
                        currentPlugin: result.currentPlugin,
                        rekeyIndex: result.rekeyIndex,
                        escrowFactory: result.escrowFactory,
                        factoryApp: result.factoryApp,
                        revocation: result.revocation,
                        referrer: result.referrer,
                    };
                },
                /**
                 * Get the current value of the version key in global state
                 */
                version: async () => { return (await this.appClient.state.global.getValue("version")); },
                /**
                 * Get the current value of the akitaDAO key in global state
                 */
                akitaDao: async () => { return (await this.appClient.state.global.getValue("akitaDAO")); },
                /**
                 * Get the current value of the admin key in global state
                 */
                admin: async () => { return (await this.appClient.state.global.getValue("admin")); },
                /**
                 * Get the current value of the domain key in global state
                 */
                domain: async () => { return (await this.appClient.state.global.getValue("domain")); },
                /**
                 * Get the current value of the controlledAddress key in global state
                 */
                controlledAddress: async () => { return (await this.appClient.state.global.getValue("controlledAddress")); },
                /**
                 * Get the current value of the nickname key in global state
                 */
                nickname: async () => { return (await this.appClient.state.global.getValue("nickname")); },
                /**
                 * Get the current value of the avatar key in global state
                 */
                avatar: async () => { return (await this.appClient.state.global.getValue("avatar")); },
                /**
                 * Get the current value of the banner key in global state
                 */
                banner: async () => { return (await this.appClient.state.global.getValue("banner")); },
                /**
                 * Get the current value of the bio key in global state
                 */
                bio: async () => { return (await this.appClient.state.global.getValue("bio")); },
                /**
                 * Get the current value of the lastUserInteraction key in global state
                 */
                lastUserInteraction: async () => { return (await this.appClient.state.global.getValue("lastUserInteraction")); },
                /**
                 * Get the current value of the lastChange key in global state
                 */
                lastChange: async () => { return (await this.appClient.state.global.getValue("lastChange")); },
                /**
                 * Get the current value of the spendingAddress key in global state
                 */
                spendingAddress: async () => { return (await this.appClient.state.global.getValue("spendingAddress")); },
                /**
                 * Get the current value of the currentPlugin key in global state
                 */
                currentPlugin: async () => { return (await this.appClient.state.global.getValue("currentPlugin")); },
                /**
                 * Get the current value of the rekeyIndex key in global state
                 */
                rekeyIndex: async () => { return (await this.appClient.state.global.getValue("rekeyIndex")); },
                /**
                 * Get the current value of the escrowFactory key in global state
                 */
                escrowFactory: async () => { return (await this.appClient.state.global.getValue("escrowFactory")); },
                /**
                 * Get the current value of the factoryApp key in global state
                 */
                factoryApp: async () => { return (await this.appClient.state.global.getValue("factoryApp")); },
                /**
                 * Get the current value of the revocation key in global state
                 */
                revocation: async () => { return (await this.appClient.state.global.getValue("revocation")); },
                /**
                 * Get the current value of the referrer key in global state
                 */
                referrer: async () => { return (await this.appClient.state.global.getValue("referrer")); },
            },
            /**
             * Methods to access box state for the current AbstractedAccount app
             */
            box: {
                /**
                 * Get all current keyed values from box state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.box.getAll();
                    return {};
                },
                /**
                 * Get values from the plugins map in box state
                 */
                plugins: {
                    /**
                     * Get all current values of the plugins map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("plugins")); },
                    /**
                     * Get a current value of the plugins map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("plugins", key); },
                },
                /**
                 * Get values from the namedPlugins map in box state
                 */
                namedPlugins: {
                    /**
                     * Get all current values of the namedPlugins map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("namedPlugins")); },
                    /**
                     * Get a current value of the namedPlugins map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("namedPlugins", key); },
                },
                /**
                 * Get values from the escrows map in box state
                 */
                escrows: {
                    /**
                     * Get all current values of the escrows map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("escrows")); },
                    /**
                     * Get a current value of the escrows map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("escrows", key); },
                },
                /**
                 * Get values from the allowances map in box state
                 */
                allowances: {
                    /**
                     * Get all current values of the allowances map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("allowances")); },
                    /**
                     * Get a current value of the allowances map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("allowances", key); },
                },
                /**
                 * Get values from the executions map in box state
                 */
                executions: {
                    /**
                     * Get all current values of the executions map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("executions")); },
                    /**
                     * Get a current value of the executions map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("executions", key); },
                },
                /**
                 * Get values from the domainKeys map in box state
                 */
                domainKeys: {
                    /**
                     * Get all current values of the domainKeys map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("domainKeys")); },
                    /**
                     * Get a current value of the domainKeys map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("domainKeys", key); },
                },
            },
        };
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? getArc56ReturnValue(returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `AbstractedAccountClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new AbstractedAccountClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `AbstractedAccountClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new AbstractedAccountClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
    }
    /** The ID of the app instance this client is linked to. */
    get appId() {
        return this.appClient.appId;
    }
    /** The app address of the app instance this client is linked to. */
    get appAddress() {
        return this.appClient.appAddress;
    }
    /** The name of the app. */
    get appName() {
        return this.appClient.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return this.appClient.appSpec;
    }
    /** A reference to the underlying `AlgorandClient` this app client is using. */
    get algorand() {
        return this.appClient.algorand;
    }
    /**
     * Clone this app client with different params
     *
     * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
     * @returns A new app client with the altered params
     */
    clone(params) {
        return new AbstractedAccountClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_canCall(uint64,bool,address,string,byte[4])bool` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Check whether the plugin can be used
     *
     * @param params The params for the smart contract call
     * @returns The call result: Whether the plugin can be called with these parameters
     */
    async arc58CanCall(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58CanCall(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getAdmin()address` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
    * Get the admin of this app. This method SHOULD always be used rather than reading directly from state
    because different implementations may have different ways of determining the admin.
  
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async arc58GetAdmin(params = { args: [] }) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetAdmin(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get plugin info for a list of plugin keys
     *
     * @param params The params for the smart contract call
     * @returns The call result: The plugin info for each key, or empty plugin info if the key does not exist
     */
    async arc58GetPlugins(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get plugin info for a list of named plugins
     *
     * @param params The params for the smart contract call
     * @returns The call result: The plugin info for each name, or empty plugin info if the name does not exist
     */
    async arc58GetNamedPlugins(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get escrow info for a list of escrow names
     *
     * @param params The params for the smart contract call
     * @returns The call result: The escrow info for each name, or empty escrow info if the name does not exist
     */
    async arc58GetEscrows(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get allowance info for a list of assets on a given escrow
     *
     * @param params The params for the smart contract call
     * @returns The call result: The allowance info for each asset, or empty allowance info if no allowance exists
     */
    async arc58GetAllowances(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get execution key info for a list of leases
     *
     * @param params The params for the smart contract call
     * @returns The call result: The execution info for each lease, or empty execution info if the lease does not exist
     */
    async arc58GetExecutions(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get domain key assignments for a list of addresses
     *
     * @param params The params for the smart contract call
     * @returns The call result: The domain string for each address, or empty string if no domain is assigned
     */
    async arc58GetDomainKeys(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Calculate the minimum balance requirements for various box operations
     *
     * @param params The params for the smart contract call
     * @returns The call result: The MBR costs for plugins, named plugins, escrows, allowances, domain keys, executions, and new escrow creation
     */
    async mbr(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.mbr(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Get the balance of a set of assets in the account, including staked amounts
     *
     * @param params The params for the smart contract call
     * @returns The call result: The balance for each asset including any staked amounts
     */
    async balance(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.balance(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a register(string)void method call against the AbstractedAccount contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setDomain(string)void method call against the AbstractedAccount contract
             */
            setDomain(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setDomain(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setRevocationApp(uint64)void method call against the AbstractedAccount contract
             */
            setRevocationApp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setRevocationApp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setNickname(string)void method call against the AbstractedAccount contract
             */
            setNickname(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setNickname(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setAvatar(uint64)void method call against the AbstractedAccount contract
             */
            setAvatar(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setAvatar(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setBanner(uint64)void method call against the AbstractedAccount contract
             */
            setBanner(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setBanner(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a setBio(string)void method call against the AbstractedAccount contract
             */
            setBio(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setBio(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_changeAdmin(address)void method call against the AbstractedAccount contract
             */
            arc58ChangeAdmin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58ChangeAdmin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_pluginChangeAdmin(address)void method call against the AbstractedAccount contract
             */
            arc58PluginChangeAdmin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58PluginChangeAdmin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_verifyAuthAddress()void method call against the AbstractedAccount contract
             */
            arc58VerifyAuthAddress(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58VerifyAuthAddress(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_rekeyTo(address,bool)void method call against the AbstractedAccount contract
             */
            arc58RekeyTo(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RekeyTo(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_canCall(uint64,bool,address,string,byte[4])bool method call against the AbstractedAccount contract
             */
            arc58CanCall(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58CanCall(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_canCall(uint64,bool,address,string,byte[4])bool', v));
                return this;
            },
            /**
             * Add a arc58_rekeyToPlugin(uint64,bool,string,uint64[],(uint64,uint64)[])void method call against the AbstractedAccount contract
             */
            arc58RekeyToPlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RekeyToPlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_rekeyToNamedPlugin(string,bool,string,uint64[],(uint64,uint64)[])void method call against the AbstractedAccount contract
             */
            arc58RekeyToNamedPlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RekeyToNamedPlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void method call against the AbstractedAccount contract
             */
            arc58AddPlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58AddPlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a assignDomain(address,string)void method call against the AbstractedAccount contract
             */
            assignDomain(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.assignDomain(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_removePlugin(uint64,address,string)void method call against the AbstractedAccount contract
             */
            arc58RemovePlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RemovePlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,bool)void method call against the AbstractedAccount contract
             */
            arc58AddNamedPlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58AddNamedPlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_removeNamedPlugin(string)void method call against the AbstractedAccount contract
             */
            arc58RemoveNamedPlugin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RemoveNamedPlugin(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_newEscrow(string)uint64 method call against the AbstractedAccount contract
             */
            arc58NewEscrow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58NewEscrow(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_newEscrow(string)uint64', v));
                return this;
            },
            /**
             * Add a arc58_toggleEscrowLock(string)(uint64,bool) method call against the AbstractedAccount contract
             */
            arc58ToggleEscrowLock(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58ToggleEscrowLock(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_toggleEscrowLock(string)(uint64,bool)', v));
                return this;
            },
            /**
             * Add a arc58_reclaim(string,(uint64,uint64,bool)[])void method call against the AbstractedAccount contract
             */
            arc58Reclaim(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58Reclaim(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_pluginReclaim(uint64,address,string,(uint64,uint64,bool)[])void method call against the AbstractedAccount contract
             */
            arc58PluginReclaim(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58PluginReclaim(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_optInEscrow(string,uint64[])void method call against the AbstractedAccount contract
             */
            arc58OptInEscrow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58OptInEscrow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_pluginOptInEscrow(uint64,address,string,uint64[],pay)void method call against the AbstractedAccount contract
             */
            arc58PluginOptInEscrow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58PluginOptInEscrow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_addAllowances(string,(uint64,uint8,uint64,uint64,uint64,bool)[])void method call against the AbstractedAccount contract
             */
            arc58AddAllowances(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58AddAllowances(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_removeAllowances(string,uint64[])void method call against the AbstractedAccount contract
             */
            arc58RemoveAllowances(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RemoveAllowances(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_addExecutionKey(byte[32],byte[32][],uint64,uint64)void method call against the AbstractedAccount contract
             */
            arc58AddExecutionKey(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58AddExecutionKey(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_removeExecutionKey(byte[32])void method call against the AbstractedAccount contract
             */
            arc58RemoveExecutionKey(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58RemoveExecutionKey(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_getAdmin()address method call against the AbstractedAccount contract
             */
            arc58GetAdmin(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetAdmin(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getAdmin()address', v));
                return this;
            },
            /**
             * Add a arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[] method call against the AbstractedAccount contract
             */
            arc58GetPlugins(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetPlugins(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]', v));
                return this;
            },
            /**
             * Add a arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[] method call against the AbstractedAccount contract
             */
            arc58GetNamedPlugins(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetNamedPlugins(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,bool,uint64,uint64)[]', v));
                return this;
            },
            /**
             * Add a arc58_getEscrows(string[])(uint64,bool)[] method call against the AbstractedAccount contract
             */
            arc58GetEscrows(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetEscrows(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getEscrows(string[])(uint64,bool)[]', v));
                return this;
            },
            /**
             * Add a arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[] method call against the AbstractedAccount contract
             */
            arc58GetAllowances(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetAllowances(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]', v));
                return this;
            },
            /**
             * Add a arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[] method call against the AbstractedAccount contract
             */
            arc58GetExecutions(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetExecutions(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]', v));
                return this;
            },
            /**
             * Add a arc58_getDomainKeys(address[])string[] method call against the AbstractedAccount contract
             */
            arc58GetDomainKeys(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetDomainKeys(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getDomainKeys(address[])string[]', v));
                return this;
            },
            /**
             * Add a mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64) method call against the AbstractedAccount contract
             */
            mbr(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
                resultMappers.push((v) => client.decodeReturnValue('mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)', v));
                return this;
            },
            /**
             * Add a balance(uint64[])uint64[] method call against the AbstractedAccount contract
             */
            balance(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.balance(params)));
                resultMappers.push((v) => client.decodeReturnValue('balance(uint64[])uint64[]', v));
                return this;
            },
            get update() {
                return {
                    update: (params) => {
                        promiseChain = promiseChain.then(async () => composer.addAppUpdateMethodCall(await client.params.update.update(params)));
                        resultMappers.push(undefined);
                        return this;
                    },
                };
            },
            /**
             * Add a clear state call to the AbstractedAccount contract
             */
            clearState(params) {
                promiseChain = promiseChain.then(() => composer.addAppCall(client.params.clearState(params)));
                return this;
            },
            addTransaction(txn, signer) {
                promiseChain = promiseChain.then(() => composer.addTransaction(txn, signer));
                return this;
            },
            async composer() {
                await promiseChain;
                return composer;
            },
            async simulate(options) {
                await promiseChain;
                const result = await (!options ? composer.simulate() : composer.simulate(options));
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            },
            async send(params) {
                await promiseChain;
                const result = await composer.send(params);
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            }
        };
    }
}
//# sourceMappingURL=AbstractedAccountClient.js.map