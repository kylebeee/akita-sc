import { getArc56ReturnValue, getABIStructFromABITuple } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "AbstractedAccount", "structs": { "AbstractAccountBoxMBRData": [{ "name": "plugins", "type": "uint64" }, { "name": "namedPlugins", "type": "uint64" }, { "name": "escrows", "type": "uint64" }, { "name": "allowances", "type": "uint64" }, { "name": "executions", "type": "uint64" }, { "name": "domainKeys", "type": "uint64" }, { "name": "escrowExists", "type": "bool" }, { "name": "newEscrowMintCost", "type": "uint64" }], "AllowanceInfo": [{ "name": "type", "type": "uint8" }, { "name": "max", "type": "uint64" }, { "name": "amount", "type": "uint64" }, { "name": "spent", "type": "uint64" }, { "name": "interval", "type": "uint64" }, { "name": "last", "type": "uint64" }, { "name": "start", "type": "uint64" }, { "name": "useRounds", "type": "bool" }], "AllowanceKey": [{ "name": "escrow", "type": "string" }, { "name": "asset", "type": "uint64" }], "EscrowInfo": [{ "name": "id", "type": "uint64" }, { "name": "locked", "type": "bool" }], "ExecutionInfo": [{ "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "PluginInfo": [{ "name": "escrow", "type": "uint64" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64,uint64)[]" }, { "name": "admin", "type": "bool" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "lastCalled", "type": "uint64" }, { "name": "start", "type": "uint64" }], "PluginKey": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version", "desc": "The version of the abstracted account application" }, { "type": "address", "name": "controlledAddress", "desc": "The address of the abstracted account. If zeroAddress, then the address of the contract account will be used" }, { "type": "address", "name": "admin", "desc": "The address of the admin for this application" }, { "type": "string", "name": "domain" }, { "type": "uint64", "name": "escrowFactory" }, { "type": "uint64", "name": "revocationApp", "desc": "The application ID of the revocation app associated with this abstracted account" }, { "type": "string", "name": "nickname", "desc": "A user-friendly name for this abstracted account" }, { "type": "address", "name": "referrer" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Create an abstracted account application.\nThis is not part of ARC58 and implementation specific.", "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "string", "name": "escrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Register the abstracted account with the escrow factory.\nThis allows apps to correlate the account with the app without needing\nit to be explicitly provided.", "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "version", "desc": "the version of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "setDomain", "args": [{ "type": "string", "name": "domain" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "setRevocationApp", "args": [{ "type": "uint64", "name": "app", "desc": "the new revocation app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the revocation app associated with the contract", "events": [], "recommendations": {} }, { "name": "setNickname", "args": [{ "type": "string", "name": "nickname", "desc": "the new nickname of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the nickname of the wallet", "events": [], "recommendations": {} }, { "name": "setAvatar", "args": [{ "type": "uint64", "name": "avatar", "desc": "the new avatar of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the avatar of the wallet", "events": [], "recommendations": {} }, { "name": "setBanner", "args": [{ "type": "uint64", "name": "banner", "desc": "the new banner of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the banner of the wallet", "events": [], "recommendations": {} }, { "name": "setBio", "args": [{ "type": "string", "name": "bio", "desc": "the new bio of the wallet" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Changes the bio of the wallet", "events": [], "recommendations": {} }, { "name": "arc58_changeAdmin", "args": [{ "type": "address", "name": "newAdmin", "desc": "The new admin" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Attempt to change the admin for this app. Some implementations MAY not support this.", "events": [], "recommendations": {} }, { "name": "arc58_pluginChangeAdmin", "args": [{ "type": "address", "name": "newAdmin", "desc": "The new admin" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Attempt to change the admin via plugin.", "events": [], "recommendations": {} }, { "name": "arc58_verifyAuthAddress", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Verify the abstracted account is rekeyed to this app", "events": [], "recommendations": {} }, { "name": "arc58_rekeyTo", "args": [{ "type": "address", "name": "address", "desc": "The address to rekey to" }, { "type": "bool", "name": "flash", "desc": "Whether or not this should be a flash rekey. If true, the rekey back to the app address must done in the same txn group as this call" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Rekey the abstracted account to another address. Primarily useful for rekeying to an EOA.", "events": [], "recommendations": {} }, { "name": "arc58_canCall", "args": [{ "type": "uint64", "name": "plugin", "desc": "the plugin to be rekeyed to" }, { "type": "bool", "name": "global", "desc": "whether this is callable globally" }, { "type": "address", "name": "address", "desc": "the address that will trigger the plugin" }, { "type": "string", "name": "escrow" }, { "type": "byte[4]", "name": "method", "desc": "the method being called on the plugin, if applicable" }], "returns": { "type": "bool", "desc": "whether the plugin can be called with these parameters" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "check whether the plugin can be used", "events": [], "recommendations": {} }, { "name": "arc58_rekeyToPlugin", "args": [{ "type": "uint64", "name": "plugin", "desc": "The app to rekey to" }, { "type": "bool", "name": "global", "desc": "Whether the plugin is callable globally" }, { "type": "string", "name": "escrow" }, { "type": "uint64[]", "name": "methodOffsets", "desc": "The indices of the methods being used in the group if the plugin has method restrictions these indices are required to match the methods used on each subsequent call to the plugin within the group" }, { "type": "(uint64,uint64)[]", "name": "fundsRequest", "desc": "If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to be able to use during execution" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Temporarily rekey to an approved plugin app address", "events": [], "recommendations": {} }, { "name": "arc58_rekeyToNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The name of the plugin to rekey to" }, { "type": "bool", "name": "global", "desc": "Whether the plugin is callable globally" }, { "type": "string", "name": "escrow" }, { "type": "uint64[]", "name": "methodOffsets", "desc": "The indices of the methods being used in the group if the plugin has method restrictions these indices are required to match the methods used on each subsequent call to the plugin within the group" }, { "type": "(uint64,uint64)[]", "name": "fundsRequest", "desc": "If the plugin is using an escrow, this is the list of funds to transfer to the escrow for the plugin to be able to use during execution" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Temporarily rekey to a named plugin app address", "events": [], "recommendations": {} }, { "name": "arc58_addPlugin", "args": [{ "type": "uint64", "name": "plugin" }, { "type": "address", "name": "caller" }, { "type": "string", "name": "escrow", "desc": "The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created" }, { "type": "bool", "name": "admin", "desc": "Whether the plugin has permissions to change the admin account" }, { "type": "uint8", "name": "delegationType", "desc": "the ownership of the delegation for last_interval updates" }, { "type": "uint64", "name": "lastValid", "desc": "The timestamp or round when the permission expires" }, { "type": "uint64", "name": "cooldown", "desc": "The number of seconds or rounds that must pass before the plugin can be called again" }, { "type": "(byte[4],uint64)[]", "name": "methods", "desc": "The methods that are allowed to be called for the plugin by the address" }, { "type": "bool", "name": "useRounds", "desc": "Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp" }, { "type": "bool", "name": "useExecutionKey" }, { "type": "bool", "name": "coverFees" }, { "type": "bool", "name": "defaultToEscrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add an app to the list of approved plugins", "events": [], "recommendations": {} }, { "name": "assignDomain", "args": [{ "type": "address", "name": "caller", "desc": "The address of the passkey" }, { "type": "string", "name": "domain", "desc": "The domain to assign to the passkey" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Assign a domain to a passkey", "events": [], "recommendations": {} }, { "name": "arc58_removePlugin", "args": [{ "type": "uint64", "name": "plugin" }, { "type": "address", "name": "caller" }, { "type": "string", "name": "escrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove an app from the list of approved plugins", "events": [], "recommendations": {} }, { "name": "arc58_addNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The plugin name" }, { "type": "uint64", "name": "plugin" }, { "type": "address", "name": "caller" }, { "type": "string", "name": "escrow", "desc": "The escrow account to use for the plugin, if any. If empty, no escrow will be used, if the named escrow does not exist, it will be created" }, { "type": "bool", "name": "admin", "desc": "Whether the plugin has permissions to change the admin account" }, { "type": "uint8", "name": "delegationType", "desc": "the ownership of the delegation for last_interval updates" }, { "type": "uint64", "name": "lastValid", "desc": "The timestamp or round when the permission expires" }, { "type": "uint64", "name": "cooldown", "desc": "The number of seconds or rounds that must pass before the plugin can be called again" }, { "type": "(byte[4],uint64)[]", "name": "methods", "desc": "The methods that are allowed to be called for the plugin by the address" }, { "type": "bool", "name": "useRounds", "desc": "Whether the plugin uses rounds for cooldowns and lastValid, defaults to timestamp" }, { "type": "bool", "name": "useExecutionKey" }, { "type": "bool", "name": "coverFees" }, { "type": "bool", "name": "defaultToEscrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add a named plugin", "events": [], "recommendations": {} }, { "name": "arc58_removeNamedPlugin", "args": [{ "type": "string", "name": "name", "desc": "The plugin name" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove a named plugin", "events": [], "recommendations": {} }, { "name": "arc58_newEscrow", "args": [{ "type": "string", "name": "escrow", "desc": "The name of the escrow to create" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Create a new escrow for the controlled address", "events": [], "recommendations": {} }, { "name": "arc58_toggleEscrowLock", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to lock or unlock" }], "returns": { "type": "(uint64,bool)", "struct": "EscrowInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Lock or Unlock an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_reclaim", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to reclaim funds from" }, { "type": "(uint64,uint64,bool)[]", "name": "reclaims", "desc": "The list of reclaims to make from the escrow" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Transfer funds from an escrow back to the controlled address.", "events": [], "recommendations": {} }, { "name": "arc58_optinEscrow", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to opt-in to" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to opt-in to" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Opt-in an escrow account to assets", "events": [], "recommendations": {} }, { "name": "arc58_pluginOptinEscrow", "args": [{ "type": "uint64", "name": "plugin" }, { "type": "address", "name": "caller" }, { "type": "string", "name": "escrow" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to opt-in to" }, { "type": "pay", "name": "mbrPayment", "desc": "The payment txn that is used to pay for the asset opt-in" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Opt-in an escrow account to assets via a plugin / allowed caller", "events": [], "recommendations": {} }, { "name": "arc58_addAllowances", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to add the allowance for" }, { "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]", "name": "allowances", "desc": "The list of allowances to add" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Add an allowance for an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_removeAllowances", "args": [{ "type": "string", "name": "escrow", "desc": "The escrow to remove the allowance for" }, { "type": "uint64[]", "name": "assets", "desc": "The list of assets to remove the allowance for" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Remove an allowances for an escrow account", "events": [], "recommendations": {} }, { "name": "arc58_addExecutionKey", "args": [{ "type": "byte[32]", "name": "lease" }, { "type": "byte[32][]", "name": "groups" }, { "type": "uint64", "name": "firstValid" }, { "type": "uint64", "name": "lastValid" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "arc58_removeExecutionKey", "args": [{ "type": "byte[32]", "name": "lease" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "arc58_getAdmin", "args": [], "returns": { "type": "address" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get the admin of this app. This method SHOULD always be used rather than reading directly from state\nbecause different implementations may have different ways of determining the admin.", "events": [], "recommendations": {} }, { "name": "arc58_getPlugins", "args": [{ "type": "(uint64,address,string)[]", "name": "keys" }], "returns": { "type": "(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "arc58_getNamedPlugins", "args": [{ "type": "string[]", "name": "names" }], "returns": { "type": "(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "arc58_getEscrows", "args": [{ "type": "string[]", "name": "escrows" }], "returns": { "type": "(uint64,bool)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "arc58_getAllowances", "args": [{ "type": "string", "name": "escrow" }, { "type": "uint64[]", "name": "assets" }], "returns": { "type": "(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "arc58_getExecutions", "args": [{ "type": "byte[32][]", "name": "leases" }], "returns": { "type": "(byte[32][],uint64,uint64)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "arc58_getDomainKeys", "args": [{ "type": "address[]", "name": "addresses" }], "returns": { "type": "string[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "mbr", "args": [{ "type": "string", "name": "escrow" }, { "type": "uint64", "name": "methodCount" }, { "type": "string", "name": "plugin" }, { "type": "uint64", "name": "groups" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)", "struct": "AbstractAccountBoxMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "balance", "args": [{ "type": "uint64[]", "name": "assets" }], "returns": { "type": "uint64[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Get the balance of a set of assets in the account", "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 9, "bytes": 9 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the version of the wallet contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app id of the akita DAO" }, "admin": { "keyType": "AVMString", "valueType": "address", "key": "YWRtaW4=", "desc": "The admin of the abstracted account. This address can add plugins and initiate rekeys" }, "domain": { "keyType": "AVMString", "valueType": "AVMString", "key": "ZG9tYWlu", "desc": "The domain associated with the admin account of the abstracted account" }, "controlledAddress": { "keyType": "AVMString", "valueType": "address", "key": "Y29udHJvbGxlZF9hZGRyZXNz", "desc": "The address this app controls" }, "nickname": { "keyType": "AVMString", "valueType": "AVMString", "key": "bmlja25hbWU=", "desc": "A user defined nickname for their wallet" }, "avatar": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YXZhdGFy", "desc": "A user defined NFT to display as their avatar that the user owns" }, "banner": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YmFubmVy", "desc": "A user defined NFT to display as their banner that the user owns" }, "bio": { "keyType": "AVMString", "valueType": "AVMString", "key": "Ymlv", "desc": "A user defined description" }, "lastUserInteraction": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bGFzdF91c2VyX2ludGVyYWN0aW9u", "desc": "The last time the contract was interacted with in unix time" }, "lastChange": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bGFzdF9jaGFuZ2U=", "desc": "The last time state has changed on the abstracted account (not including lastCalled for cooldowns) in unix time" }, "spendingAddress": { "keyType": "AVMString", "valueType": "address", "key": "c3BlbmRpbmdfYWRkcmVzcw==", "desc": "[TEMPORARY STATE FIELD] The spending address for the currently active plugin" }, "currentPlugin": { "keyType": "AVMString", "valueType": "PluginKey", "key": "Y3VycmVudF9wbHVnaW4=", "desc": "[TEMPORARY STATE FIELD] The current plugin key being used" }, "rekeyIndex": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVrZXlfaW5kZXg=", "desc": "[TEMPORARY STATE FIELD] The index of the transaction that created the rekey sandwich" }, "escrowFactory": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZXNjcm93X2ZhY3Rvcnk=", "desc": "the spending account factory to use for allowances" }, "factoryApp": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZmFjdG9yeV9hcHA=", "desc": "the application ID for the contract that deployed this wallet" }, "revocation": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmV2b2NhdGlvbg==", "desc": "The app that can revoke plugins" }, "referrer": { "keyType": "AVMString", "valueType": "address", "key": "cmVmZXJyZXI=", "desc": "The address that created the wallet" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "plugins": { "keyType": "PluginKey", "valueType": "PluginInfo", "desc": "Plugins that add functionality to the controlledAddress and the account that has permission to use it.", "prefix": "cA==" }, "namedPlugins": { "keyType": "AVMString", "valueType": "PluginKey", "desc": "Plugins that have been given a name for discoverability", "prefix": "bg==" }, "escrows": { "keyType": "AVMString", "valueType": "EscrowInfo", "desc": "the escrows that this wallet has created for specific callers with allowances", "prefix": "ZQ==" }, "allowances": { "keyType": "AllowanceKey", "valueType": "AllowanceInfo", "desc": "The Allowances for plugins installed on the smart contract with useAllowance set to true", "prefix": "YQ==" }, "executions": { "keyType": "AVMBytes", "valueType": "ExecutionInfo", "desc": "execution keys", "prefix": "eA==" }, "domainKeys": { "keyType": "address", "valueType": "AVMString", "desc": "Passkeys on the account and their corresponding domain names\naddress : domain\nIMPORTANT: a passkey attached to the akita domain is a co-admin passkey\nwe explicitly have this feature so that the wallet can be used on multiple devices\nwhere the admin passkey may be incompatible\nwe track this onchain so we can assist with 'sign-in from another device' functionality\nas well as uses like DAO based domain revocation", "prefix": "ZA==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [6613, 6752, 6776, 6858], "errorMessage": "Allowance exceeded" }, { "pc": [4768, 4896, 4912, 5074, 5232, 5376, 5518, 5804, 5979, 6472, 6620, 6783], "errorMessage": "Box must have value" }, { "pc": [5931, 7706], "errorMessage": "Bytes has valid prefix" }, { "pc": [3234], "errorMessage": "Escrow already exists" }, { "pc": [1054, 3278, 3377, 3605, 3837, 4062, 4328], "errorMessage": "Escrow does not exist" }, { "pc": [3624, 3845, 4069, 4335], "errorMessage": "Escrow is locked" }, { "pc": [3238], "errorMessage": "Escrow name is required" }, { "pc": [6942], "errorMessage": "Execution key expired" }, { "pc": [4638, 6915], "errorMessage": "Execution key not found" }, { "pc": [6928], "errorMessage": "Execution key not ready" }, { "pc": [7003], "errorMessage": "Group not found" }, { "pc": [240], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [534], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [2378], "errorMessage": "Only an admin can add a plugin" }, { "pc": [1324], "errorMessage": "Only an admin can change the admin account" }, { "pc": [1200, 1219, 1257, 1302], "errorMessage": "Only an admin can change the nickname" }, { "pc": [1174], "errorMessage": "Only an admin can change the revocation app" }, { "pc": [1129, 1155], "errorMessage": "Only an admin can update the application" }, { "pc": [4318], "errorMessage": "Only an admin or revocation app can remove method restrictions" }, { "pc": [2480, 3098], "errorMessage": "Only an admin or revocation app can remove plugins" }, { "pc": [2510, 3108, 3122, 3828, 6441, 7021], "errorMessage": "Plugin does not exist" }, { "pc": [1232, 1270], "errorMessage": "The account does not hold the asset" }, { "pc": [924], "errorMessage": "This contract must be deployed from a factory" }, { "pc": [1419], "errorMessage": "This plugin does not have admin privileges" }, { "pc": [1397], "errorMessage": "This plugin is not in control of the account" }, { "pc": [1391, 1461, 7639], "errorMessage": "account funded" }, { "pc": [1543, 2052, 2745, 3224, 4053, 4501, 4658], "errorMessage": "admin only" }, { "pc": [1375], "errorMessage": "admin plugins cannot use escrows" }, { "pc": [4206], "errorMessage": "allowance already exists" }, { "pc": [3695, 3972, 4424, 6534], "errorMessage": "allowance does not exist" }, { "pc": [1070, 1382, 1395, 3384, 3619, 3854, 3886, 5880, 6002, 6461, 6480, 7123, 7232], "errorMessage": "application exists" }, { "pc": [7312], "errorMessage": "cannot call other apps during rekey" }, { "pc": [1066, 1353, 1388, 1454, 1465, 1473, 1548, 2219, 2230, 2382, 2393, 2524, 2535, 2916, 2927, 3139, 3150, 3421, 3440, 3489, 3508, 3629, 3895, 4073, 4084, 4339, 4350, 4681, 5823, 5834, 5864, 5876, 5957, 5984, 5999, 6201, 6649, 6687, 7116, 7227, 7575, 7654, 7667], "errorMessage": "check GlobalState exists" }, { "pc": [2069, 2775], "errorMessage": "delegation type must not be self for global plugins" }, { "pc": [2335, 3052], "errorMessage": "escrow must be set if defaultToEscrow is true" }, { "pc": [4558], "errorMessage": "execution key update must match first valid" }, { "pc": [4568], "errorMessage": "execution key update must match last valid" }, { "pc": [2161, 2867, 3405, 4135, 4398, 4737, 4863, 5041, 5198, 5359, 5501, 6506, 7622], "errorMessage": "index access is out of bounds" }, { "pc": [7391], "errorMessage": "invalid method signature length" }, { "pc": [1807, 1887], "errorMessage": "invalid number of bytes for (len+(uint64,uint64)[])" }, { "pc": [3360], "errorMessage": "invalid number of bytes for (len+(uint64,uint64,bool1)[])" }, { "pc": [4049], "errorMessage": "invalid number of bytes for (len+(uint64,uint8,uint64,uint64,uint64,bool1)[])" }, { "pc": [2004, 2693], "errorMessage": "invalid number of bytes for (len+(uint8[4],uint64)[])" }, { "pc": [1791, 1871, 3591, 3784, 4304, 5175, 5740], "errorMessage": "invalid number of bytes for (len+uint64[])" }, { "pc": [4475, 5336, 5478], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [830, 867, 905, 1033, 1122, 1148, 1193, 1295, 1687, 1773, 1827, 1853, 1941, 2371, 2463, 2586, 2624, 3081, 3217, 3262, 3336, 3565, 3761, 4024, 4283, 5154, 5577, 5602], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [7711], "errorMessage": "invalid number of bytes for (uint64,uint64)" }, { "pc": [1537, 1661, 1758, 1838, 1952, 2012, 2023, 2034, 2045, 2636, 2701, 2713, 2725, 2737], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [878, 889, 1169, 1214, 1252, 1652, 1749, 1918, 1971, 1981, 2440, 2598, 2658, 2669, 3735, 4483, 4494, 5588, 5613, 5936], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [1963, 2650], "errorMessage": "invalid number of bytes for uint8" }, { "pc": [845, 854, 921, 1320, 1348, 1529, 1674, 1928, 2358, 2450, 2611, 3748, 4457, 4629], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [1702], "errorMessage": "invalid number of bytes for uint8[4]" }, { "pc": [7317], "errorMessage": "invalid oncomplete must be no op" }, { "pc": [3914], "errorMessage": "invalid payment" }, { "pc": [7331], "errorMessage": "invalid sender app id" }, { "pc": [7323], "errorMessage": "invalid sender must be this app id" }, { "pc": [2176, 2882], "errorMessage": "invalid size" }, { "pc": [7369], "errorMessage": "malformed method offsets" }, { "pc": [2186, 2892, 4590, 5080, 5116, 5238, 5292, 7735], "errorMessage": "max array length exceeded" }, { "pc": [7521], "errorMessage": "method on cooldown" }, { "pc": [1629, 7077], "errorMessage": "missing rekey back" }, { "pc": [3269, 3368, 3595, 3876], "errorMessage": "only the creator wallet can delete a spending account" }, { "pc": [782], "errorMessage": "overflow" }, { "pc": [2126], "errorMessage": "plugin already exists" }, { "pc": [7026, 7352], "errorMessage": "plugin expired" }, { "pc": [7030, 7355], "errorMessage": "plugin on cooldown" }, { "pc": [1384], "errorMessage": "sender must be admin plugin" }, { "pc": [3796], "errorMessage": "transaction type is pay" }, { "pc": [2085, 2791], "errorMessage": "using execution key requires global plugin" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDIgOCA0MDAgMTg5MDAgMjc3MDAKICAgIGJ5dGVjYmxvY2sgImNvbnRyb2xsZWRfYWRkcmVzcyIgIiIgImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIgInAiIDB4MTUxZjdjNzUgImUiICJsYXN0X2NoYW5nZSIgMHgwMDAwIDB4MDAgIngiICJzcGVuZGluZ19hZGRyZXNzIiAweDAwMmEgMHgwMDBhICJhIiAweDAwMDIgImFkbWluIiAweDAxICJuIiAiZCIgInJla2V5X2luZGV4IiAiZG9tYWluIiAiZXNjcm93X2ZhY3RvcnkiICJyZXZvY2F0aW9uIiAweDAwMDEgImN1cnJlbnRfcGx1Z2luIiAweDZjYzNmNjA2ICJ2ZXJzaW9uIiAibmlja25hbWUiIDB4MDAyYwogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJueiBtYWluX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkKICAgIC8vIHJla2V5SW5kZXggPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAwLCBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1Jla2V5SW5kZXggfSkKICAgIGJ5dGVjIDE5IC8vICJyZWtleV9pbmRleCIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMi0xMTgKICAgIC8vIEBjb250cmFjdCh7CiAgICAvLyAgIHN0YXRlVG90YWxzOiB7CiAgICAvLyAgICAgZ2xvYmFsQnl0ZXM6IEFic3RyYWN0QWNjb3VudE51bUdsb2JhbEJ5dGVzLAogICAgLy8gICAgIGdsb2JhbFVpbnRzOiBBYnN0cmFjdEFjY291bnROdW1HbG9iYWxVaW50cwogICAgLy8gICB9CiAgICAvLyB9KQogICAgLy8gZXhwb3J0IGNsYXNzIEFic3RyYWN0ZWRBY2NvdW50IGV4dGVuZHMgQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4ZWE5MTgwZGQgLy8gbWV0aG9kICJ1cGRhdGUoc3RyaW5nKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX3VwZGF0ZV9yb3V0ZUA0CgptYWluX3N3aXRjaF9jYXNlX25leHRANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyLTExOAogICAgLy8gQGNvbnRyYWN0KHsKICAgIC8vICAgc3RhdGVUb3RhbHM6IHsKICAgIC8vICAgICBnbG9iYWxCeXRlczogQWJzdHJhY3RBY2NvdW50TnVtR2xvYmFsQnl0ZXMsCiAgICAvLyAgICAgZ2xvYmFsVWludHM6IEFic3RyYWN0QWNjb3VudE51bUdsb2JhbFVpbnRzCiAgICAvLyAgIH0KICAgIC8vIH0pCiAgICAvLyBleHBvcnQgY2xhc3MgQWJzdHJhY3RlZEFjY291bnQgZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BANDUKICAgIHB1c2hieXRlc3MgMHhiZDYwOTllNSAweDc3ODc4NjdkIDB4MmQ3NzExYjcgMHg5ZjkxY2NjZCAweDE3ZDhiY2I0IDB4Mzg1NjU4YWIgMHg1ZWYwYjQxNSAweGQyNGI3NTU2IDB4MTQ3YjZjZDYgLy8gbWV0aG9kICJyZWdpc3RlcihzdHJpbmcpdm9pZCIsIG1ldGhvZCAic2V0RG9tYWluKHN0cmluZyl2b2lkIiwgbWV0aG9kICJzZXRSZXZvY2F0aW9uQXBwKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJzZXROaWNrbmFtZShzdHJpbmcpdm9pZCIsIG1ldGhvZCAic2V0QXZhdGFyKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJzZXRCYW5uZXIodWludDY0KXZvaWQiLCBtZXRob2QgInNldEJpbyhzdHJpbmcpdm9pZCIsIG1ldGhvZCAiYXJjNThfY2hhbmdlQWRtaW4oYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJhcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbihhZGRyZXNzKXZvaWQiCiAgICBieXRlYyAyNSAvLyBtZXRob2QgImFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkIgogICAgcHVzaGJ5dGVzcyAweGM5NWE1ZDNkIDB4NDcyN2FmMjEgMHg1ODJmZjM4MiAweGRlZmQ1Y2QyIDB4ZGIwZDZkYmQgMHg1N2E1MWQ4OCAweGVlZjQ0OGZkIDB4ZmZiOGU5MTggMHhlMzUwYjlkNCAweDBhOGNiMmMyIDB4MjViNzEzY2EgMHhlYmFmMTRhMCAweDFmZGEzYjRmIDB4OWQzZjg5MTggMHhiZjRkN2M1NyAweGQ1ZGQzODJiIDB4NWNlYmVkNDMgMHhkNTg2ODVhZiAweDEzYmM0NGU0IDB4MzdkZWY1YTIgMHg1NmRjMTYyYyAweGEyNDAzZGRmIDB4MDJmZTQ1MTUgMHg0MWJkYzY4MCAweDg4MmJiMWMyIDB4MTc2MGM2NTIgMHgxMjRjMGE3ZiAvLyBtZXRob2QgImFyYzU4X3Jla2V5VG8oYWRkcmVzcyxib29sKXZvaWQiLCBtZXRob2QgImFyYzU4X2NhbkNhbGwodWludDY0LGJvb2wsYWRkcmVzcyxzdHJpbmcsYnl0ZVs0XSlib29sIiwgbWV0aG9kICJhcmM1OF9yZWtleVRvUGx1Z2luKHVpbnQ2NCxib29sLHN0cmluZyx1aW50NjRbXSwodWludDY0LHVpbnQ2NClbXSl2b2lkIiwgbWV0aG9kICJhcmM1OF9yZWtleVRvTmFtZWRQbHVnaW4oc3RyaW5nLGJvb2wsc3RyaW5nLHVpbnQ2NFtdLCh1aW50NjQsdWludDY0KVtdKXZvaWQiLCBtZXRob2QgImFyYzU4X2FkZFBsdWdpbih1aW50NjQsYWRkcmVzcyxzdHJpbmcsYm9vbCx1aW50OCx1aW50NjQsdWludDY0LChieXRlWzRdLHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sKXZvaWQiLCBtZXRob2QgImFzc2lnbkRvbWFpbihhZGRyZXNzLHN0cmluZyl2b2lkIiwgbWV0aG9kICJhcmM1OF9yZW1vdmVQbHVnaW4odWludDY0LGFkZHJlc3Msc3RyaW5nKXZvaWQiLCBtZXRob2QgImFyYzU4X2FkZE5hbWVkUGx1Z2luKHN0cmluZyx1aW50NjQsYWRkcmVzcyxzdHJpbmcsYm9vbCx1aW50OCx1aW50NjQsdWludDY0LChieXRlWzRdLHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sKXZvaWQiLCBtZXRob2QgImFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luKHN0cmluZyl2b2lkIiwgbWV0aG9kICJhcmM1OF9uZXdFc2Nyb3coc3RyaW5nKXVpbnQ2NCIsIG1ldGhvZCAiYXJjNThfdG9nZ2xlRXNjcm93TG9jayhzdHJpbmcpKHVpbnQ2NCxib29sKSIsIG1ldGhvZCAiYXJjNThfcmVjbGFpbShzdHJpbmcsKHVpbnQ2NCx1aW50NjQsYm9vbClbXSl2b2lkIiwgbWV0aG9kICJhcmM1OF9vcHRpbkVzY3JvdyhzdHJpbmcsdWludDY0W10pdm9pZCIsIG1ldGhvZCAiYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3codWludDY0LGFkZHJlc3Msc3RyaW5nLHVpbnQ2NFtdLHBheSl2b2lkIiwgbWV0aG9kICJhcmM1OF9hZGRBbGxvd2FuY2VzKHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pdm9pZCIsIG1ldGhvZCAiYXJjNThfcmVtb3ZlQWxsb3dhbmNlcyhzdHJpbmcsdWludDY0W10pdm9pZCIsIG1ldGhvZCAiYXJjNThfYWRkRXhlY3V0aW9uS2V5KGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJhcmM1OF9yZW1vdmVFeGVjdXRpb25LZXkoYnl0ZVszMl0pdm9pZCIsIG1ldGhvZCAiYXJjNThfZ2V0QWRtaW4oKWFkZHJlc3MiLCBtZXRob2QgImFyYzU4X2dldFBsdWdpbnMoKHVpbnQ2NCxhZGRyZXNzLHN0cmluZylbXSkodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsKGJ5dGVbNF0sdWludDY0LHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sLHVpbnQ2NCx1aW50NjQpW10iLCBtZXRob2QgImFyYzU4X2dldE5hbWVkUGx1Z2lucyhzdHJpbmdbXSkodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsKGJ5dGVbNF0sdWludDY0LHVpbnQ2NClbXSxib29sLGJvb2wsYm9vbCxib29sLHVpbnQ2NCx1aW50NjQpW10iLCBtZXRob2QgImFyYzU4X2dldEVzY3Jvd3Moc3RyaW5nW10pKHVpbnQ2NCxib29sKVtdIiwgbWV0aG9kICJhcmM1OF9nZXRBbGxvd2FuY2VzKHN0cmluZyx1aW50NjRbXSkodWludDgsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbClbXSIsIG1ldGhvZCAiYXJjNThfZ2V0RXhlY3V0aW9ucyhieXRlWzMyXVtdKShieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpW10iLCBtZXRob2QgImFyYzU4X2dldERvbWFpbktleXMoYWRkcmVzc1tdKXN0cmluZ1tdIiwgbWV0aG9kICJtYnIoc3RyaW5nLHVpbnQ2NCxzdHJpbmcsdWludDY0KSh1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ2NCkiLCBtZXRob2QgImJhbGFuY2UodWludDY0W10pdWludDY0W10iCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCByZWdpc3RlciBzZXREb21haW4gc2V0UmV2b2NhdGlvbkFwcCBzZXROaWNrbmFtZSBzZXRBdmF0YXIgc2V0QmFubmVyIHNldEJpbyBhcmM1OF9jaGFuZ2VBZG1pbiBhcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbiBhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcyBhcmM1OF9yZWtleVRvIGFyYzU4X2NhbkNhbGwgYXJjNThfcmVrZXlUb1BsdWdpbiBhcmM1OF9yZWtleVRvTmFtZWRQbHVnaW4gYXJjNThfYWRkUGx1Z2luIGFzc2lnbkRvbWFpbiBhcmM1OF9yZW1vdmVQbHVnaW4gYXJjNThfYWRkTmFtZWRQbHVnaW4gYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW4gYXJjNThfbmV3RXNjcm93IGFyYzU4X3RvZ2dsZUVzY3Jvd0xvY2sgYXJjNThfcmVjbGFpbSBhcmM1OF9vcHRpbkVzY3JvdyBhcmM1OF9wbHVnaW5PcHRpbkVzY3JvdyBhcmM1OF9hZGRBbGxvd2FuY2VzIGFyYzU4X3JlbW92ZUFsbG93YW5jZXMgYXJjNThfYWRkRXhlY3V0aW9uS2V5IGFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleSBhcmM1OF9nZXRBZG1pbiBhcmM1OF9nZXRQbHVnaW5zIGFyYzU4X2dldE5hbWVkUGx1Z2lucyBhcmM1OF9nZXRFc2Nyb3dzIGFyYzU4X2dldEFsbG93YW5jZXMgYXJjNThfZ2V0RXhlY3V0aW9ucyBhcmM1OF9nZXREb21haW5LZXlzIG1iciBiYWxhbmNlCiAgICBlcnIKCm1haW5fY3JlYXRlX05vT3BANDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMi0xMTgKICAgIC8vIEBjb250cmFjdCh7CiAgICAvLyAgIHN0YXRlVG90YWxzOiB7CiAgICAvLyAgICAgZ2xvYmFsQnl0ZXM6IEFic3RyYWN0QWNjb3VudE51bUdsb2JhbEJ5dGVzLAogICAgLy8gICAgIGdsb2JhbFVpbnRzOiBBYnN0cmFjdEFjY291bnROdW1HbG9iYWxVaW50cwogICAgLy8gICB9CiAgICAvLyB9KQogICAgLy8gZXhwb3J0IGNsYXNzIEFic3RyYWN0ZWRBY2NvdW50IGV4dGVuZHMgQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4MTY2NTZjNjYgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLGFkZHJlc3MsYWRkcmVzcyxzdHJpbmcsdWludDY0LHVpbnQ2NCxzdHJpbmcsYWRkcmVzcyl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCm1haW5fdXBkYXRlX3JvdXRlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYzMAogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogWydVcGRhdGVBcHBsaWNhdGlvbiddIH0pCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICBwdXNoaW50IDQgLy8gVXBkYXRlQXBwbGljYXRpb24KICAgID09CiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgJiYKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBVcGRhdGVBcHBsaWNhdGlvbiAmJiBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBiIHVwZGF0ZQoKCi8vIF9wdXlhX2xpYi5hcmM0LmR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWQoYXJyYXk6IGJ5dGVzLCBuZXdfaXRlbXNfYnl0ZXM6IGJ5dGVzLCBuZXdfaXRlbXNfY291bnQ6IHVpbnQ2NCkgLT4gYnl0ZXM6CmR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWQ6CiAgICBwcm90byAzIDEKICAgIGZyYW1lX2RpZyAtMwogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGZyYW1lX2RpZyAtMQogICAgKwogICAgc3dhcAogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGNvdmVyIDIKICAgIGZyYW1lX2RpZyAtMwogICAgaW50Y18yIC8vIDIKICAgIGRpZyAyCiAgICBzdWJzdHJpbmczCiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBiemVybwogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTMKICAgIGxlbgogICAgZnJhbWVfZGlnIC0zCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgc3dhcAogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGR1cAogICAgaW50Y18wIC8vIDAKCmR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWRfZm9yX2hlYWRlckAyOgogICAgZnJhbWVfZGlnIDQKICAgIGZyYW1lX2RpZyAyCiAgICA8CiAgICBieiBkeW5hbWljX2FycmF5X2NvbmNhdF9ieXRlX2xlbmd0aF9oZWFkX2FmdGVyX2ZvckA0CiAgICBmcmFtZV9kaWcgMwogICAgZHVwCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZnJhbWVfZGlnIDEKICAgIGZyYW1lX2RpZyA0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIHVuY292ZXIgMgogICAgcmVwbGFjZTMKICAgIGR1cAogICAgZnJhbWVfYnVyeSAxCiAgICBkaWcgMQogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICArCiAgICBmcmFtZV9idXJ5IDMKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZF9mb3JfaGVhZGVyQDIKCmR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWRfYWZ0ZXJfZm9yQDQ6CiAgICBmcmFtZV9kaWcgMAogICAgZnJhbWVfZGlnIDEKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCgovLyBfcHV5YV9saWIuYXJjNC5keW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQoYXJyYXlfaXRlbXNfY291bnQ6IHVpbnQ2NCwgYXJyYXlfaGVhZF9hbmRfdGFpbDogYnl0ZXMsIG5ld19pdGVtc19jb3VudDogdWludDY0LCBuZXdfaGVhZF9hbmRfdGFpbDogYnl0ZXMpIC0+IGJ5dGVzOgpkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQ6CiAgICBwcm90byA0IDEKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGR1cAogICAgZnJhbWVfZGlnIC0yCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgZnJhbWVfZGlnIC00CiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgaW50Y18wIC8vIDAKCmR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9mb3JfaGVhZGVyQDE6CiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfZGlnIDMKICAgIDwKICAgIGJ6IGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudF9hZnRlcl9mb3JANAogICAgZnJhbWVfZGlnIC0zCiAgICBmcmFtZV9kaWcgNAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgZnJhbWVfZGlnIDIKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgMQogICAgc3dhcAogICAgY29uY2F0CiAgICBmcmFtZV9idXJ5IDEKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2Zvcl9oZWFkZXJAMQoKZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2FmdGVyX2ZvckA0OgogICAgZnJhbWVfZGlnIC0zCiAgICBsZW4KICAgIGZyYW1lX2J1cnkgMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgNAoKZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2Zvcl9oZWFkZXJANToKICAgIGZyYW1lX2RpZyA0CiAgICBmcmFtZV9kaWcgMgogICAgPAogICAgYnogZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50X2FmdGVyX2ZvckA4CiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2RpZyA0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGV4dHJhY3RfdWludDE2CiAgICBmcmFtZV9kaWcgMAogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAxCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGZyYW1lX2J1cnkgMQogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGZyYW1lX2J1cnkgNAogICAgYiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnRfZm9yX2hlYWRlckA1CgpkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnRfYWZ0ZXJfZm9yQDg6CiAgICBmcmFtZV9kaWcgLTQKICAgIGZyYW1lX2RpZyAtMgogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAxCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMwogICAgZnJhbWVfZGlnIDMKICAgIGZyYW1lX2RpZyAwCiAgICBzdWJzdHJpbmczCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMQogICAgbGVuCiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2RpZyAyCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvYmFzZS50czo6dWludDgodjogdWludDY0KSAtPiBieXRlczoKdWludDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvYmFzZS50czozCiAgICAvLyBleHBvcnQgZnVuY3Rpb24gdWludDgodjogdWludDY0KSB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9iYXNlLnRzOjQKICAgIC8vIHJldHVybiBuZXcgYXJjNC5VaW50OCh2KQogICAgZnJhbWVfZGlnIC0xCiAgICBpdG9iCiAgICBkdXAKICAgIGJpdGxlbgogICAgaW50Y18zIC8vIDgKICAgIDw9CiAgICBhc3NlcnQgLy8gb3ZlcmZsb3cKICAgIGV4dHJhY3QgNyAxCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC91dGlscy50czo6ZW1wdHlQbHVnaW5JbmZvKCkgLT4gYnl0ZXM6CmVtcHR5UGx1Z2luSW5mbzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjcKICAgIC8vIGRlbGVnYXRpb25UeXBlOiB1aW50OCgwKSwKICAgIGludGNfMCAvLyAwCiAgICBjYWxsc3ViIHVpbnQ4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC91dGlscy50czoxMAogICAgLy8gbWV0aG9kczogW10sCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6NS0xNwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZXNjcm93OiAwLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogdWludDgoMCksCiAgICAvLyAgIGxhc3RWYWxpZDogMCwKICAgIC8vICAgY29vbGRvd246IDAsCiAgICAvLyAgIG1ldGhvZHM6IFtdLAogICAgLy8gICBhZG1pbjogZmFsc2UsCiAgICAvLyAgIHVzZVJvdW5kczogZmFsc2UsCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogZmFsc2UsCiAgICAvLyAgIGNvdmVyRmVlczogZmFsc2UsCiAgICAvLyAgIGxhc3RDYWxsZWQ6IDAsCiAgICAvLyAgIHN0YXJ0OiAwLAogICAgLy8gfTsKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHB1c2hieXRlcyAweDAwMmMwMAogICAgY29uY2F0CiAgICBkaWcgMQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjEwCiAgICAvLyBtZXRob2RzOiBbXSwKICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC91dGlscy50czo1LTE3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBlc2Nyb3c6IDAsCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlOiB1aW50OCgwKSwKICAgIC8vICAgbGFzdFZhbGlkOiAwLAogICAgLy8gICBjb29sZG93bjogMCwKICAgIC8vICAgbWV0aG9kczogW10sCiAgICAvLyAgIGFkbWluOiBmYWxzZSwKICAgIC8vICAgdXNlUm91bmRzOiBmYWxzZSwKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5OiBmYWxzZSwKICAgIC8vICAgY292ZXJGZWVzOiBmYWxzZSwKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IDAsCiAgICAvLyB9OwogICAgY29uY2F0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU3MwogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciA0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgNAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBjb3ZlciA0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGNvdmVyIDUKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU4NAogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkICE9PSAwLCBFUlJfQkFEX0RFUExPWUVSKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBUaGlzIGNvbnRyYWN0IG11c3QgYmUgZGVwbG95ZWQgZnJvbSBhIGZhY3RvcnkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTg1CiAgICAvLyBhc3NlcnQoYWRtaW4gIT09IGNvbnRyb2xsZWRBZGRyZXNzKQogICAgZGlnIDEKICAgIGRpZyAzCiAgICAhPQogICAgYXNzZXJ0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgYnl0ZWMgMjYgLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU4NwogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciA0CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxNSAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU4OAogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IGFkbWluCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOQogICAgLy8gZG9tYWluID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRG9tYWluIH0pOwogICAgYnl0ZWMgMjAgLy8gImRvbWFpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTg5CiAgICAvLyB0aGlzLmRvbWFpbi52YWx1ZSA9IGRvbWFpbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTkxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5MS01OTMKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICAgPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gICA6IGNvbnRyb2xsZWRBZGRyZXNzCiAgICBieiBjcmVhdGVfdGVybmFyeV9mYWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5MgogICAgLy8gPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKCmNyZWF0ZV90ZXJuYXJ5X21lcmdlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5MC01OTMKICAgIC8vIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgPQogICAgLy8gICBjb250cm9sbGVkQWRkcmVzcyA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICAgPyBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gICAgIDogY29udHJvbGxlZEFkZHJlc3MKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MQogICAgLy8gZXNjcm93RmFjdG9yeSA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRXNjcm93RmFjdG9yeSB9KQogICAgYnl0ZWMgMjEgLy8gImVzY3Jvd19mYWN0b3J5IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1OTQKICAgIC8vIHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZSA9IEFwcGxpY2F0aW9uKGVzY3Jvd0ZhY3RvcnkpCiAgICBkaWcgNAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMCAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTk1CiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IEdsb2JhbC56ZXJvQWRkcmVzczsKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1CiAgICAvLyByZXZvY2F0aW9uID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVJldm9jYXRpb24gfSkKICAgIGJ5dGVjIDIyIC8vICJyZXZvY2F0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1OTYKICAgIC8vIHRoaXMucmV2b2NhdGlvbi52YWx1ZSA9IEFwcGxpY2F0aW9uKHJldm9jYXRpb25BcHApCiAgICBkaWcgMwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBuaWNrbmFtZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c05pY2tuYW1lIH0pCiAgICBieXRlYyAyNyAvLyAibmlja25hbWUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5NwogICAgLy8gdGhpcy5uaWNrbmFtZS52YWx1ZSA9IG5pY2tuYW1lCiAgICBkaWcgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUzCiAgICAvLyBmYWN0b3J5QXBwID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNGYWN0b3J5QXBwIH0pCiAgICBwdXNoYnl0ZXMgImZhY3RvcnlfYXBwIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1OTgKICAgIC8vIHRoaXMuZmFjdG9yeUFwcC52YWx1ZSA9IEFwcGxpY2F0aW9uKEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NwogICAgLy8gcmVmZXJyZXIgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVmZXJyZXIgfSkKICAgIHB1c2hieXRlcyAicmVmZXJyZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU5OQogICAgLy8gdGhpcy5yZWZlcnJlci52YWx1ZSA9IHJlZmVycmVyCiAgICBkaWcgMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU3MwogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmNyZWF0ZV90ZXJuYXJ5X2ZhbHNlQDM6CiAgICBkaWcgNAogICAgYiBjcmVhdGVfdGVybmFyeV9tZXJnZUA0CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQucmVnaXN0ZXJbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3RlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjEwCiAgICAvLyByZWdpc3Rlcihlc2Nyb3c6IHN0cmluZyk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjExCiAgICAvLyBsZXQgYXBwOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MTIKICAgIC8vIGlmIChlc2Nyb3cgIT09ICcnKSB7CiAgICBieXRlY18xIC8vICIiCiAgICAhPQogICAgYnogcmVnaXN0ZXJfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlYyA1IC8vICJlIgogICAgZGlnIDIKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MTMKICAgIC8vIGFzc2VydCh0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEVzY3JvdyBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MTQKICAgIC8vIGFwcCA9IHRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmlkCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYnVyeSAxCgpyZWdpc3Rlcl9hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYxNy02MjYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEVzY3Jvd0ZhY3RvcnkucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIGFwcElkOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIKICAgIC8vICAgICB9KSwKICAgIC8vICAgICBhcHAKICAgIC8vICAgXQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjIxCiAgICAvLyByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTEKICAgIC8vIGVzY3Jvd0ZhY3RvcnkgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0VzY3Jvd0ZhY3RvcnkgfSkKICAgIGJ5dGVjIDIxIC8vICJlc2Nyb3dfZmFjdG9yeSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjIxCiAgICAvLyByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYyMgogICAgLy8gYW1vdW50OiBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIKICAgIHB1c2hpbnQgMTIxMDAgLy8gMTIxMDAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYyMC02MjMKICAgIC8vIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIKICAgIC8vIH0pLAogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2MTctNjI2CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBFc2Nyb3dGYWN0b3J5LnByb3RvdHlwZS5yZWdpc3Rlcj4oewogICAgLy8gICBhcHBJZDogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogQVJDNThXYWxsZXRJRHNCeUFjY291bnRzTWJyCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgYXBwCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjI0CiAgICAvLyBhcHAKICAgIGRpZyAxCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYxNy02MjYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEVzY3Jvd0ZhY3RvcnkucHJvdG90eXBlLnJlZ2lzdGVyPih7CiAgICAvLyAgIGFwcElkOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIKICAgIC8vICAgICB9KSwKICAgIC8vICAgICBhcHAKICAgIC8vICAgXQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDYwN2U3MDQ2IC8vIG1ldGhvZCAicmVnaXN0ZXIocGF5LHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYxMAogICAgLy8gcmVnaXN0ZXIoZXNjcm93OiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC51cGRhdGVbcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYzMAogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogWydVcGRhdGVBcHBsaWNhdGlvbiddIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjMyCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9PTkxZX0FETUlOX0NBTl9VUERBVEUpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiB1cGRhdGUgdGhlIGFwcGxpY2F0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgYnl0ZWMgMjYgLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYzMwogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjMwCiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXREb21haW5bcm91dGluZ10oKSAtPiB2b2lkOgpzZXREb21haW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjYzOAogICAgLy8gc2V0RG9tYWluKGRvbWFpbjogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjM5CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9PTkxZX0FETUlOX0NBTl9VUERBVEUpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiB1cGRhdGUgdGhlIGFwcGxpY2F0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOQogICAgLy8gZG9tYWluID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzRG9tYWluIH0pOwogICAgYnl0ZWMgMjAgLy8gImRvbWFpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjQwCiAgICAvLyB0aGlzLmRvbWFpbi52YWx1ZSA9IGRvbWFpbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjM4CiAgICAvLyBzZXREb21haW4oZG9tYWluOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRSZXZvY2F0aW9uQXBwW3JvdXRpbmddKCkgLT4gdm9pZDoKc2V0UmV2b2NhdGlvbkFwcDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjQ4CiAgICAvLyBzZXRSZXZvY2F0aW9uQXBwKGFwcDogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NDkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9SRVZPS0UpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiBjaGFuZ2UgdGhlIHJldm9jYXRpb24gYXBwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NQogICAgLy8gcmV2b2NhdGlvbiA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlSZXZvY2F0aW9uIH0pCiAgICBieXRlYyAyMiAvLyAicmV2b2NhdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjUwCiAgICAvLyB0aGlzLnJldm9jYXRpb24udmFsdWUgPSBBcHBsaWNhdGlvbihhcHApCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NDgKICAgIC8vIHNldFJldm9jYXRpb25BcHAoYXBwOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXROaWNrbmFtZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnNldE5pY2tuYW1lOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NTgKICAgIC8vIHNldE5pY2tuYW1lKG5pY2tuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NTkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBuaWNrbmFtZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c05pY2tuYW1lIH0pCiAgICBieXRlYyAyNyAvLyAibmlja25hbWUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY2MAogICAgLy8gdGhpcy5uaWNrbmFtZS52YWx1ZSA9IG5pY2tuYW1lCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NTgKICAgIC8vIHNldE5pY2tuYW1lKG5pY2tuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRBdmF0YXJbcm91dGluZ10oKSAtPiB2b2lkOgpzZXRBdmF0YXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY2OAogICAgLy8gc2V0QXZhdGFyKGF2YXRhcjogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NjkKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjcwCiAgICAvLyBjb25zdCBhbW91bnQgPSB0aGlzLmJhbGFuY2UoW2F2YXRhcl0pCiAgICBkdXAKICAgIGl0b2IKICAgIGJ5dGVjIDIzIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UKICAgIHBvcAogICAgaW50Y18yIC8vIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjcxCiAgICAvLyBhc3NlcnQoYW1vdW50WzBdID4gMCwgRVJSX0RPRVNfTk9UX0hPTERfQVNTRVQpCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXNzZXJ0IC8vIFRoZSBhY2NvdW50IGRvZXMgbm90IGhvbGQgdGhlIGFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNQogICAgLy8gYXZhdGFyID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNBdmF0YXIgfSkKICAgIHB1c2hieXRlcyAiYXZhdGFyIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2NzIKICAgIC8vIHRoaXMuYXZhdGFyLnZhbHVlID0gQXNzZXQoYXZhdGFyKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjY4CiAgICAvLyBzZXRBdmF0YXIoYXZhdGFyOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRCYW5uZXJbcm91dGluZ10oKSAtPiB2b2lkOgpzZXRCYW5uZXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY4MAogICAgLy8gc2V0QmFubmVyKGJhbm5lcjogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODEKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX09OTFlfQURNSU5fQ0FOX0NIQU5HRV9OSUNLTkFNRSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgbmlja25hbWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjgyCiAgICAvLyBjb25zdCBhbW91bnQgPSB0aGlzLmJhbGFuY2UoW2Jhbm5lcl0pCiAgICBkdXAKICAgIGl0b2IKICAgIGJ5dGVjIDIzIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UKICAgIHBvcAogICAgaW50Y18yIC8vIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjgzCiAgICAvLyBhc3NlcnQoYW1vdW50WzBdID4gMCwgRVJSX0RPRVNfTk9UX0hPTERfQVNTRVQpCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXNzZXJ0IC8vIFRoZSBhY2NvdW50IGRvZXMgbm90IGhvbGQgdGhlIGFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNwogICAgLy8gYmFubmVyID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNCYW5uZXIgfSkKICAgIHB1c2hieXRlcyAiYmFubmVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo2ODQKICAgIC8vIHRoaXMuYmFubmVyLnZhbHVlID0gQXNzZXQoYmFubmVyKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjgwCiAgICAvLyBzZXRCYW5uZXIoYmFubmVyOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5zZXRCaW9bcm91dGluZ10oKSAtPiB2b2lkOgpzZXRCaW86CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjY5MgogICAgLy8gc2V0QmlvKGJpbzogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjkzCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9PTkxZX0FETUlOX0NBTl9DSEFOR0VfTklDS05BTUUpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIGNhbiBjaGFuZ2UgdGhlIG5pY2tuYW1lCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOQogICAgLy8gYmlvID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQmlvIH0pCiAgICBwdXNoYnl0ZXMgImJpbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Njk0CiAgICAvLyB0aGlzLmJpby52YWx1ZSA9IGJpbwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NjkyCiAgICAvLyBzZXRCaW8oYmlvOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9jaGFuZ2VBZG1pbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2NoYW5nZUFkbWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MDIKICAgIC8vIGFyYzU4X2NoYW5nZUFkbWluKG5ld0FkbWluOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcwMwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfT05MWV9BRE1JTl9DQU5fQ0hBTkdFX0FETUlOKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGNoYW5nZSB0aGUgYWRtaW4gYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxNSAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcwNAogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IG5ld0FkbWluOwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcwMgogICAgLy8gYXJjNThfY2hhbmdlQWRtaW4obmV3QWRtaW46IEFjY291bnQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MTUKICAgIC8vIGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluKG5ld0FkbWluOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcxNgogICAgLy8gY29uc3Qga2V5ID0gY2xvbmUodGhpcy5jdXJyZW50UGx1Z2luLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3CiAgICAvLyBjdXJyZW50UGx1Z2luID0gR2xvYmFsU3RhdGU8UGx1Z2luS2V5Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ3VycmVudFBsdWdpbiB9KQogICAgYnl0ZWMgMjQgLy8gImN1cnJlbnRfcGx1Z2luIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MTYKICAgIC8vIGNvbnN0IGtleSA9IGNsb25lKHRoaXMuY3VycmVudFBsdWdpbi52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcxNwogICAgLy8gY29uc3QgeyBwbHVnaW4sIGVzY3JvdyB9ID0ga2V5CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDEKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMgogICAgbGVuCiAgICBkaWcgMwogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzE5CiAgICAvLyBhc3NlcnQoZXNjcm93ID09PSAnJywgRVJSX0FETUlOX1BMVUdJTlNfQ0FOTk9UX1VTRV9FU0NST1dTKTsKICAgIGJ5dGVjXzEgLy8gIiIKICAgID09CiAgICBhc3NlcnQgLy8gYWRtaW4gcGx1Z2lucyBjYW5ub3QgdXNlIGVzY3Jvd3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzIwCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzLCBFUlJfU0VOREVSX01VU1RfQkVfQURNSU5fUExVR0lOKTsKICAgIHR4biBTZW5kZXIKICAgIGRpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIHNlbmRlciBtdXN0IGJlIGFkbWluIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3MjIKICAgIC8vIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUuYXV0aEFkZHJlc3MgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjcyMgogICAgLy8gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZS5hdXRoQWRkcmVzcyA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFjY3RfcGFyYW1zX2dldCBBY2N0QXV0aEFkZHIKICAgIGFzc2VydCAvLyBhY2NvdW50IGZ1bmRlZAogICAgc3dhcAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzIxLTcyNAogICAgLy8gYXNzZXJ0KAogICAgLy8gICB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLmF1dGhBZGRyZXNzID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MsCiAgICAvLyAgICdUaGlzIHBsdWdpbiBpcyBub3QgaW4gY29udHJvbCBvZiB0aGUgYWNjb3VudCcKICAgIC8vICk7CiAgICBhc3NlcnQgLy8gVGhpcyBwbHVnaW4gaXMgbm90IGluIGNvbnRyb2wgb2YgdGhlIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzI3CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMgJiYgdGhpcy5wbHVnaW5zKGtleSkudmFsdWUuYWRtaW4sCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfZmFsc2VANAogICAgZHVwCiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfZmFsc2VANAogICAgaW50Y18xIC8vIDEKCmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzI2LTcyOQogICAgLy8gYXNzZXJ0KAogICAgLy8gICB0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMgJiYgdGhpcy5wbHVnaW5zKGtleSkudmFsdWUuYWRtaW4sCiAgICAvLyAgICdUaGlzIHBsdWdpbiBkb2VzIG5vdCBoYXZlIGFkbWluIHByaXZpbGVnZXMnCiAgICAvLyApOwogICAgYXNzZXJ0IC8vIFRoaXMgcGx1Z2luIGRvZXMgbm90IGhhdmUgYWRtaW4gcHJpdmlsZWdlcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxNSAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjczMQogICAgLy8gdGhpcy5hZG1pbi52YWx1ZSA9IG5ld0FkbWluOwogICAgZGlnIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjczMgogICAgLy8gaWYgKHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlLmRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYpIHsKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgYnl0ZWMgMTYgLy8gMHgwMQogICAgPT0KICAgIGJ6IGFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2FmdGVyX2lmX2Vsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlY18yIC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKCmFyYzU4X3BsdWdpbkNoYW5nZUFkbWluX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzE1CiAgICAvLyBhcmM1OF9wbHVnaW5DaGFuZ2VBZG1pbihuZXdBZG1pbjogQWNjb3VudCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcGx1Z2luQ2hhbmdlQWRtaW5fYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfcGx1Z2luQ2hhbmdlQWRtaW5fYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3Nbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF92ZXJpZnlBdXRoQWRkcmVzczoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQyCiAgICAvLyBhc3NlcnQodGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUuYXV0aEFkZHJlc3MgPT09IHRoaXMuZ2V0QXV0aEFkZHJlc3MoKSk7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDUKICAgIC8vIHNwZW5kaW5nQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MgfSkKICAgIGJ5dGVjIDEwIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NDIKICAgIC8vIGFzc2VydCh0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZS5hdXRoQWRkcmVzcyA9PT0gdGhpcy5nZXRBdXRoQWRkcmVzcygpKTsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGFjY3RfcGFyYW1zX2dldCBBY2N0QXV0aEFkZHIKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGFzc2VydCAvLyBhY2NvdW50IGZ1bmRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTYKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTYKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTU2LTU1NwogICAgLy8gdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUKICAgIC8vICYmIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBieiBhcmM1OF92ZXJpZnlBdXRoQWRkcmVzc190ZXJuYXJ5X2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTU3CiAgICAvLyAmJiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTU3CiAgICAvLyAmJiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTYtNTU3CiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9PT0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZQogICAgLy8gJiYgdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGJ6IGFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfZmFsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NTgKICAgIC8vICkgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCgphcmM1OF92ZXJpZnlBdXRoQWRkcmVzc190ZXJuYXJ5X21lcmdlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc0MgogICAgLy8gYXNzZXJ0KHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLmF1dGhBZGRyZXNzID09PSB0aGlzLmdldEF1dGhBZGRyZXNzKCkpOwogICAgZGlnIDEKICAgID09CiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBzcGVuZGluZ0FkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzIH0pCiAgICBieXRlYyAxMCAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQzCiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NDQKICAgIC8vIHRoaXMuY3VycmVudFBsdWdpbi52YWx1ZSA9IHsgcGx1Z2luOiAwLCBjYWxsZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLCBlc2Nyb3c6ICcnIH0KICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgc3dhcAogICAgY29uY2F0CiAgICBwdXNoYnl0ZXMgMHgwMDJhMDAwMAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NwogICAgLy8gY3VycmVudFBsdWdpbiA9IEdsb2JhbFN0YXRlPFBsdWdpbktleT4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0N1cnJlbnRQbHVnaW4gfSkKICAgIGJ5dGVjIDI0IC8vICJjdXJyZW50X3BsdWdpbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQ0CiAgICAvLyB0aGlzLmN1cnJlbnRQbHVnaW4udmFsdWUgPSB7IHBsdWdpbjogMCwgY2FsbGVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgZXNjcm93OiAnJyB9CiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkKICAgIC8vIHJla2V5SW5kZXggPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAwLCBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1Jla2V5SW5kZXggfSkKICAgIGJ5dGVjIDE5IC8vICJyZWtleV9pbmRleCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQ1CiAgICAvLyB0aGlzLnJla2V5SW5kZXgudmFsdWUgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzQxCiAgICAvLyBhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTU4CiAgICAvLyApID8gR2xvYmFsLnplcm9BZGRyZXNzIDogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBiIGFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzX3Rlcm5hcnlfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZWtleVRvOgogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc1NAogICAgLy8gYXJjNThfcmVrZXlUbyhhZGRyZXNzOiBBY2NvdW50LCBmbGFzaDogYm9vbGVhbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NTUKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0FETUlOX09OTFkpOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gYWRtaW4gb25seQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NTctNzY0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc1OQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzU5CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NjIKICAgIC8vIG5vdGU6ICdyZWtleWluZyBhYnN0cmFjdGVkIGFjY291bnQnCiAgICBwdXNoYnl0ZXMgInJla2V5aW5nIGFic3RyYWN0ZWQgYWNjb3VudCIKICAgIGl0eG5fZmllbGQgTm90ZQogICAgZGlnIDIKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NTctNzYzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NTctNzY0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFkZHJlc3MsCiAgICAvLyAgICAgcmVrZXlUbzogYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50JwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3NjYKICAgIC8vIGlmIChmbGFzaCkgdGhpcy5hc3NlcnRSZWtleXNCYWNrKCk7CiAgICBieiBhcmM1OF9yZWtleVRvX2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMTkKICAgIC8vIGxldCByZWtleXNCYWNrID0gZmFsc2U7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gKFR4bi5ncm91cEluZGV4ICsgMSk7IGkgPCBHbG9iYWwuZ3JvdXBTaXplOyBpICs9IDEpIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAyCgphcmM1OF9yZWtleVRvX3doaWxlX3RvcEA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMjAKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IChUeG4uZ3JvdXBJbmRleCArIDEpOyBpIDwgR2xvYmFsLmdyb3VwU2l6ZTsgaSArPSAxKSB7CiAgICBkaWcgMQogICAgZ2xvYmFsIEdyb3VwU2l6ZQogICAgPAogICAgYnogYXJjNThfcmVrZXlUb19ibG9ja0AxMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMjMKICAgIC8vIGlmICh0aGlzLnR4blJla2V5c0JhY2sodHhuKSkgewogICAgZGlnIDEKICAgIGNhbGxzdWIgdHhuUmVrZXlzQmFjawogICAgYnogYXJjNThfcmVrZXlUb19hZnRlcl9pZl9lbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzI0CiAgICAvLyByZWtleXNCYWNrID0gdHJ1ZTsKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDEKCmFyYzU4X3Jla2V5VG9fYmxvY2tAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyOQogICAgLy8gYXNzZXJ0KHJla2V5c0JhY2ssIEVSUl9NSVNTSU5HX1JFS0VZX0JBQ0spOwogICAgZHVwCiAgICBhc3NlcnQgLy8gbWlzc2luZyByZWtleSBiYWNrCgphcmM1OF9yZWtleVRvX2FmdGVyX2lmX2Vsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc1NAogICAgLy8gYXJjNThfcmVrZXlUbyhhZGRyZXNzOiBBY2NvdW50LCBmbGFzaDogYm9vbGVhbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcmVrZXlUb19hZnRlcl9pZl9lbHNlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMyMAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gKFR4bi5ncm91cEluZGV4ICsgMSk7IGkgPCBHbG9iYWwuZ3JvdXBTaXplOyBpICs9IDEpIHsKICAgIGRpZyAxCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAyCiAgICBiIGFyYzU4X3Jla2V5VG9fd2hpbGVfdG9wQDYKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9jYW5DYWxsW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfY2FuQ2FsbDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzgwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBwdXNoaW50IDQgLy8gNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbNF0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Nzg4CiAgICAvLyBpZiAoZ2xvYmFsKSB7CiAgICBieiBhcmM1OF9jYW5DYWxsX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo3ODkKICAgIC8vIHRoaXMucGx1Z2luQ2FsbEFsbG93ZWQocGx1Z2luLCBHbG9iYWwuemVyb0FkZHJlc3MsIGVzY3JvdywgbWV0aG9kKTsKICAgIGRpZyAzCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgIGRpZyAzCiAgICBkaWcgMwogICAgY2FsbHN1YiBwbHVnaW5DYWxsQWxsb3dlZAogICAgcG9wCgphcmM1OF9jYW5DYWxsX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NzkxCiAgICAvLyByZXR1cm4gdGhpcy5wbHVnaW5DYWxsQWxsb3dlZChwbHVnaW4sIGFkZHJlc3MsIGVzY3JvdywgbWV0aG9kKTsKICAgIGRpZyAzCiAgICBkaWcgMwogICAgZGlnIDMKICAgIGRpZyAzCiAgICBjYWxsc3ViIHBsdWdpbkNhbGxBbGxvd2VkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjc4MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWMgNCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZWtleVRvUGx1Z2luOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MDMtODA5CiAgICAvLyBhcmM1OF9yZWtleVRvUGx1Z2luKAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgZ2xvYmFsOiBib29sZWFuLAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgbWV0aG9kT2Zmc2V0czogdWludDY0W10sCiAgICAvLyAgIGZ1bmRzUmVxdWVzdDogRnVuZHNSZXF1ZXN0W10KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbisodWludDY0LHVpbnQ2NClbXSkKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbgogICAgcG9wbiAyCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NzEtODc2CiAgICAvLyBhcmM1OF9yZWtleVRvTmFtZWRQbHVnaW4oCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgZ2xvYmFsOiBib29sZWFuLAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgbWV0aG9kT2Zmc2V0czogdWludDY0W10sCiAgICAvLyAgIGZ1bmRzUmVxdWVzdDogRnVuZHNSZXF1ZXN0W10pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsdWludDY0KVtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQKICAgIC8vIG5hbWVkUGx1Z2lucyA9IEJveE1hcDxzdHJpbmcsIFBsdWdpbktleT4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeE5hbWVkUGx1Z2lucyB9KTsKICAgIGJ5dGVjIDE3IC8vICJuIgogICAgdW5jb3ZlciA1CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODc4CiAgICAvLyB0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS52YWx1ZS5wbHVnaW4sCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg3Ny04ODMKICAgIC8vIHRoaXMuYXJjNThfcmVrZXlUb1BsdWdpbigKICAgIC8vICAgdGhpcy5uYW1lZFBsdWdpbnMobmFtZSkudmFsdWUucGx1Z2luLAogICAgLy8gICBnbG9iYWwsCiAgICAvLyAgIGVzY3JvdywKICAgIC8vICAgbWV0aG9kT2Zmc2V0cywKICAgIC8vICAgZnVuZHNSZXF1ZXN0CiAgICAvLyApOwogICAgY292ZXIgNAogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luCiAgICBwb3BuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODcxLTg3NgogICAgLy8gYXJjNThfcmVrZXlUb05hbWVkUGx1Z2luKAogICAgLy8gICBuYW1lOiBzdHJpbmcsCiAgICAvLyAgIGdsb2JhbDogYm9vbGVhbiwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIG1ldGhvZE9mZnNldHM6IHVpbnQ2NFtdLAogICAgLy8gICBmdW5kc1JlcXVlc3Q6IEZ1bmRzUmVxdWVzdFtdKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfYWRkUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfYWRkUGx1Z2luOgogICAgaW50Y18wIC8vIDAKICAgIGR1cG4gMwogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkwMC05MTMKICAgIC8vIGFyYzU4X2FkZFBsdWdpbigKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFkbWluOiBib29sZWFuLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogVWludDgsCiAgICAvLyAgIGxhc3RWYWxpZDogdWludDY0LAogICAgLy8gICBjb29sZG93bjogdWludDY0LAogICAgLy8gICBtZXRob2RzOiBNZXRob2RSZXN0cmljdGlvbltdLAogICAgLy8gICB1c2VSb3VuZHM6IGJvb2xlYW4sCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogYm9vbGVhbiwKICAgIC8vICAgY292ZXJGZWVzOiBib29sZWFuLAogICAgLy8gICBkZWZhdWx0VG9Fc2Nyb3c6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwbiAyCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDcKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIHB1c2hpbnQgMTIgLy8gMTIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ4WzRdLHVpbnQ2NClbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDkKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEwCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTE0CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9BRE1JTl9PTkxZKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTE3CiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICBieXRlYyAxNiAvLyAweDAxCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTctOTE4CiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkUGx1Z2luX2Jvb2xfZmFsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTgKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBkaWcgMTEKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTE3LTkxOAogICAgLy8gZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgLy8gY2FsbGVyID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGJ6IGFyYzU4X2FkZFBsdWdpbl9ib29sX2ZhbHNlQDQKICAgIGludGNfMSAvLyAxCgphcmM1OF9hZGRQbHVnaW5fYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTYtOTE5CiAgICAvLyAhKAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyAgIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyApLAogICAgIQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MTUtOTIxCiAgICAvLyBhc3NlcnQoCiAgICAvLyAgICEoCiAgICAvLyAgICAgZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgLy8gICAgIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICksCiAgICAvLyAgIEVSUl9aRVJPX0FERFJFU1NfREVMRUdBVElPTl9UWVBFCiAgICAvLyApCiAgICBhc3NlcnQgLy8gZGVsZWdhdGlvbiB0eXBlIG11c3Qgbm90IGJlIHNlbGYgZm9yIGdsb2JhbCBwbHVnaW5zCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkyNC05MjUKICAgIC8vIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyAyCiAgICBieiBhcmM1OF9hZGRQbHVnaW5fYm9vbF9mYWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkyNQogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyAxMQogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MjQtOTI1CiAgICAvLyB1c2VFeGVjdXRpb25LZXkgJiYKICAgIC8vIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBieiBhcmM1OF9hZGRQbHVnaW5fYm9vbF9mYWxzZUA4CiAgICBpbnRjXzEgLy8gMQoKYXJjNThfYWRkUGx1Z2luX2Jvb2xfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTIzLTkyNgogICAgLy8gISgKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5ICYmCiAgICAvLyAgIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyApLAogICAgIQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5MjItOTI4CiAgICAvLyBhc3NlcnQoCiAgICAvLyAgICEoCiAgICAvLyAgICAgdXNlRXhlY3V0aW9uS2V5ICYmCiAgICAvLyAgICAgY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICAgKSwKICAgIC8vICAgRVJSX1VTSU5HX0VYRUNVVElPTl9LRVlfUkVRVUlSRVNfR0xPQkFMCiAgICAvLyApCiAgICBhc3NlcnQgLy8gdXNpbmcgZXhlY3V0aW9uIGtleSByZXF1aXJlcyBnbG9iYWwgcGx1Z2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzMQogICAgLy8gaWYgKGRlZmF1bHRUb0VzY3JvdykgewogICAgZHVwCiAgICBibnogYXJjNThfYWRkUGx1Z2luX2lmX2JvZHlAMTAKICAgIGRpZyAxMAogICAgYnVyeSAxNwoKYXJjNThfYWRkUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzNgogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyLCBlc2Nyb3c6IGVzY3Jvd0tleSB9CiAgICBkaWcgMTIKICAgIGl0b2IKICAgIGRpZyAxMgogICAgY29uY2F0CiAgICBkaWcgMTcKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBzd2FwCiAgICBieXRlYyAxMSAvLyAweDAwMmEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDE5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzOAogICAgLy8gYXNzZXJ0KCF0aGlzLnBsdWdpbnMoa2V5KS5leGlzdHMsIEVSUl9QTFVHSU5fQUxSRUFEWV9FWElTVFMpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBwbHVnaW4gYWxyZWFkeSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTQwCiAgICAvLyBsZXQgbWV0aG9kSW5mb3M6IE1ldGhvZEluZm9bXSA9IFtdCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgYnVyeSAxOQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIGJ1cnkgMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTQxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgMTQKCmFyYzU4X2FkZFBsdWdpbl93aGlsZV90b3BAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk0MQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyAxMwogICAgZGlnIDUKICAgIDwKICAgIGJ6IGFyYzU4X2FkZFBsdWdpbl9hZnRlcl93aGlsZUAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NDIKICAgIC8vIG1ldGhvZEluZm9zLnB1c2goeyAuLi5tZXRob2RzW2ldLCBsYXN0Q2FsbGVkOiAwIH0pCiAgICBkaWcgNQogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxNAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBwdXNoaW50IDEyIC8vIDEyCiAgICAqCiAgICBwdXNoaW50IDEyIC8vIDEyCiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGR1cAogICAgZXh0cmFjdCAwIDQKICAgIHN3YXAKICAgIGV4dHJhY3QgNCA4CiAgICBkaWcgMQogICAgbGVuCiAgICBwdXNoaW50IDQgLy8gNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGNvbmNhdAogICAgZGlnIDIwCiAgICBjb25jYXQKICAgIGRpZyAxNwogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMTcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTQxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMTQKICAgIGIgYXJjNThfYWRkUGx1Z2luX3doaWxlX3RvcEAxMgoKYXJjNThfYWRkUGx1Z2luX2FmdGVyX3doaWxlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NDUKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGRpZyAzCiAgICBieiBhcmM1OF9hZGRQbHVnaW5fdGVybmFyeV9mYWxzZUAxNgogICAgZ2xvYmFsIFJvdW5kCiAgICBidXJ5IDE1CgphcmM1OF9hZGRQbHVnaW5fdGVybmFyeV9tZXJnZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTQ3CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk0NwogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgICE9CiAgICBieiBhcmM1OF9hZGRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAyMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NDgtOTU0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3Jvd0tleSwgbWV0aG9kSW5mb3MubGVuZ3RoKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTUwCiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NTAKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk1MQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTUyCiAgICAvLyBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkKICAgIGRpZyAxNwogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMTkKICAgIHN3YXAKICAgIGNhbGxzdWIgcGx1Z2luc01icgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk0OC05NTMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk0OC05NTQKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmFyYzU4X2FkZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5NTcKICAgIC8vIGNvbnN0IGVzY3Jvd0lEID0gdGhpcy5tYXliZU5ld0VzY3Jvdyhlc2Nyb3cpOwogICAgZGlnIDEwCiAgICBjYWxsc3ViIG1heWJlTmV3RXNjcm93CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk1OS05NzEKICAgIC8vIHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlID0gewogICAgLy8gICBlc2Nyb3c6IGVzY3Jvd0lELAogICAgLy8gICBhZG1pbiwKICAgIC8vICAgZGVsZWdhdGlvblR5cGUsCiAgICAvLyAgIGxhc3RWYWxpZCwKICAgIC8vICAgY29vbGRvd24sCiAgICAvLyAgIG1ldGhvZHM6IGNsb25lKG1ldGhvZEluZm9zKSwKICAgIC8vICAgdXNlUm91bmRzLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXksCiAgICAvLyAgIGNvdmVyRmVlcywKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IGVwb2NoUmVmLAogICAgLy8gfQogICAgaXRvYgogICAgZGlnIDkKICAgIGNvbmNhdAogICAgZGlnIDgKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZGlnIDcKICAgIGl0b2IKICAgIGNvbmNhdAogICAgYnl0ZWMgMjggLy8gMHgwMDJjCiAgICBjb25jYXQKICAgIGJ5dGVjIDggLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxMgogICAgc2V0Yml0CiAgICBpbnRjXzEgLy8gMQogICAgZGlnIDYKICAgIHNldGJpdAogICAgaW50Y18yIC8vIDIKICAgIGRpZyA1CiAgICBzZXRiaXQKICAgIHB1c2hpbnQgMyAvLyAzCiAgICBkaWcgNAogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIGRpZyAxOQogICAgY29uY2F0CiAgICBkaWcgMTUKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZGlnIDE2CiAgICBjb25jYXQKICAgIGRpZyAxOAogICAgZHVwCiAgICBib3hfZGVsCiAgICBwb3AKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkwMC05MTMKICAgIC8vIGFyYzU4X2FkZFBsdWdpbigKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGNhbGxlcjogQWNjb3VudCwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIGFkbWluOiBib29sZWFuLAogICAgLy8gICBkZWxlZ2F0aW9uVHlwZTogVWludDgsCiAgICAvLyAgIGxhc3RWYWxpZDogdWludDY0LAogICAgLy8gICBjb29sZG93bjogdWludDY0LAogICAgLy8gICBtZXRob2RzOiBNZXRob2RSZXN0cmljdGlvbltdLAogICAgLy8gICB1c2VSb3VuZHM6IGJvb2xlYW4sCiAgICAvLyAgIHVzZUV4ZWN1dGlvbktleTogYm9vbGVhbiwKICAgIC8vICAgY292ZXJGZWVzOiBib29sZWFuLAogICAgLy8gICBkZWZhdWx0VG9Fc2Nyb3c6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfYWRkUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk0NQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYnVyeSAxNQogICAgYiBhcmM1OF9hZGRQbHVnaW5fdGVybmFyeV9tZXJnZUAxNwoKYXJjNThfYWRkUGx1Z2luX2lmX2JvZHlAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzMgogICAgLy8gYXNzZXJ0KGVzY3JvdyAhPT0gJycsIEVSUl9FU0NST1dfUkVRVUlSRURfVE9fQkVfU0VUX0FTX0RFRkFVTFQpCiAgICBkaWcgMTAKICAgIGJ5dGVjXzEgLy8gIiIKICAgICE9CiAgICBhc3NlcnQgLy8gZXNjcm93IG11c3QgYmUgc2V0IGlmIGRlZmF1bHRUb0VzY3JvdyBpcyB0cnVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjkzMwogICAgLy8gZXNjcm93S2V5ID0gJycKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGJ1cnkgMTcKICAgIGIgYXJjNThfYWRkUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMTEKCmFyYzU4X2FkZFBsdWdpbl9ib29sX2ZhbHNlQDg6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9hZGRQbHVnaW5fYm9vbF9tZXJnZUA5CgphcmM1OF9hZGRQbHVnaW5fYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfYWRkUGx1Z2luX2Jvb2xfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFzc2lnbkRvbWFpbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmFzc2lnbkRvbWFpbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTgzCiAgICAvLyBhc3NpZ25Eb21haW4oY2FsbGVyOiBBY2NvdW50LCBkb21haW46IHN0cmluZyk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4NAogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfT05MWV9BRE1JTl9DQU5fQUREX1BMVUdJTikKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gY2FuIGFkZCBhIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5ODYKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTg2CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IGFzc2lnbkRvbWFpbl9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTg3LTk5MwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuZG9tYWluS2V5c01icihkb21haW4pCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5ODkKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4OQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTkwCiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMTYKICAgIC8vIHJldHVybiBNaW5Eb21haW5LZXlzTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMoZG9tYWluKS5sZW5ndGgpCiAgICBkaWcgMgogICAgbGVuCiAgICBpbnRjIDQgLy8gNDAwCiAgICAqCiAgICBwdXNoaW50IDE1NzAwIC8vIDE1NzAwCiAgICArCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OTg3LTk5MgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuZG9tYWluS2V5c01icihkb21haW4pCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk4Ny05OTMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmRvbWFpbktleXNNYnIoZG9tYWluKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0Cgphc3NpZ25Eb21haW5fYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgYnl0ZWMgMTggLy8gImQiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjk5NgogICAgLy8gdGhpcy5kb21haW5LZXlzKGNhbGxlcikudmFsdWUgPSBkb21haW4KICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBkaWcgMQogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo5ODMKICAgIC8vIGFzc2lnbkRvbWFpbihjYWxsZXI6IEFjY291bnQsIGRvbWFpbjogc3RyaW5nKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVtb3ZlUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVtb3ZlUGx1Z2luOgogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDA1CiAgICAvLyBhcmM1OF9yZW1vdmVQbHVnaW4ocGx1Z2luOiB1aW50NjQsIGNhbGxlcjogQWNjb3VudCwgZXNjcm93OiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAwNgogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuY2FuUmV2b2tlKCksIEVSUl9PTkxZX0FETUlOX09SX1JFVk9DQVRJT05fQVBQX0NBTl9SRU1PVkVfUExVR0lOKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IGFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX3RydWVAMwogICAgY2FsbHN1YiBjYW5SZXZva2UKICAgIGJ6IGFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX2ZhbHNlQDQKCmFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgphcmM1OF9yZW1vdmVQbHVnaW5fYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDA2CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5jYW5SZXZva2UoKSwgRVJSX09OTFlfQURNSU5fT1JfUkVWT0NBVElPTl9BUFBfQ0FOX1JFTU9WRV9QTFVHSU4pOwogICAgYXNzZXJ0IC8vIE9ubHkgYW4gYWRtaW4gb3IgcmV2b2NhdGlvbiBhcHAgY2FuIHJlbW92ZSBwbHVnaW5zCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMDgKICAgIC8vIGNvbnN0IGtleTogUGx1Z2luS2V5ID0geyBwbHVnaW4sIGNhbGxlcjogY2FsbGVyLCBlc2Nyb3cgfQogICAgZGlnIDIKICAgIGl0b2IKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgMTEgLy8gMHgwMDJhCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAwOQogICAgLy8gYXNzZXJ0KHRoaXMucGx1Z2lucyhrZXkpLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gUGx1Z2luIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTEKICAgIC8vIGNvbnN0IG1ldGhvZHNMZW5ndGg6IHVpbnQ2NCA9IHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlLm1ldGhvZHMubGVuZ3RoCiAgICBkdXAKICAgIHB1c2hpbnQgNDQgLy8gNDQKICAgIGludGNfMiAvLyAyCiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTMKICAgIC8vIHRoaXMucGx1Z2lucyhrZXkpLmRlbGV0ZSgpOwogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTUKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAxNQogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgICE9CiAgICBieiBhcmM1OF9yZW1vdmVQbHVnaW5fYWZ0ZXJfaWZfZWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTYtMTAyMQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93LCBtZXRob2RzTGVuZ3RoKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAxOAogICAgLy8gcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDE4CiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwMTkKICAgIC8vIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3JvdywgbWV0aG9kc0xlbmd0aCkKICAgIGRpZyAxCiAgICBkaWcgNQogICAgY2FsbHN1YiBwbHVnaW5zTWJyCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDE2LTEwMjAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3JvdywgbWV0aG9kc0xlbmd0aCkKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTAxNi0xMDIxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3csIG1ldGhvZHNMZW5ndGgpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmFyYzU4X3JlbW92ZVBsdWdpbl9hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjXzIgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDA1CiAgICAvLyBhcmM1OF9yZW1vdmVQbHVnaW4ocGx1Z2luOiB1aW50NjQsIGNhbGxlcjogQWNjb3VudCwgZXNjcm93OiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X3JlbW92ZVBsdWdpbl9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9yZW1vdmVQbHVnaW5fYm9vbF9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfYWRkTmFtZWRQbHVnaW5bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9hZGROYW1lZFBsdWdpbjoKICAgIGludGNfMCAvLyAwCiAgICBkdXBuIDMKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDQzLTEwNTcKICAgIC8vIGFyYzU4X2FkZE5hbWVkUGx1Z2luKAogICAgLy8gICBuYW1lOiBzdHJpbmcsCiAgICAvLyAgIHBsdWdpbjogdWludDY0LAogICAgLy8gICBjYWxsZXI6IEFjY291bnQsCiAgICAvLyAgIGVzY3Jvdzogc3RyaW5nLAogICAgLy8gICBhZG1pbjogYm9vbGVhbiwKICAgIC8vICAgZGVsZWdhdGlvblR5cGU6IFVpbnQ4LAogICAgLy8gICBsYXN0VmFsaWQ6IHVpbnQ2NCwKICAgIC8vICAgY29vbGRvd246IHVpbnQ2NCwKICAgIC8vICAgbWV0aG9kczogTWV0aG9kUmVzdHJpY3Rpb25bXSwKICAgIC8vICAgdXNlUm91bmRzOiBib29sZWFuLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXk6IGJvb2xlYW4sCiAgICAvLyAgIGNvdmVyRmVlczogYm9vbGVhbiwKICAgIC8vICAgZGVmYXVsdFRvRXNjcm93OiBib29sZWFuCiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDcKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOQogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciA0CiAgICBwdXNoaW50IDEyIC8vIDEyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50OFs0XSx1aW50NjQpW10pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIGNvdmVyIDIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDU4CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9BRE1JTl9PTkxZKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0CiAgICAvLyBuYW1lZFBsdWdpbnMgPSBCb3hNYXA8c3RyaW5nLCBQbHVnaW5LZXk+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhOYW1lZFBsdWdpbnMgfSk7CiAgICBieXRlYyAxNyAvLyAibiIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA1OQogICAgLy8gYXNzZXJ0KCF0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS5leGlzdHMpOwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA2MgogICAgLy8gZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZiAmJgogICAgYnl0ZWMgMTYgLy8gMHgwMQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA2Mi0xMDYzCiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNjMKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICBkaWcgMTIKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA2Mi0xMDYzCiAgICAvLyBkZWxlZ2F0aW9uVHlwZSA9PT0gRGVsZWdhdGlvblR5cGVTZWxmICYmCiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9mYWxzZUA0CiAgICBpbnRjXzEgLy8gMQoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDYxLTEwNjQKICAgIC8vICEoCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vICAgY2FsbGVyID09PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICksCiAgICAhCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNjAtMTA2NgogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIGRlbGVnYXRpb25UeXBlID09PSBEZWxlZ2F0aW9uVHlwZVNlbGYgJiYKICAgIC8vICAgICBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gICApLAogICAgLy8gICBFUlJfWkVST19BRERSRVNTX0RFTEVHQVRJT05fVFlQRQogICAgLy8gKQogICAgYXNzZXJ0IC8vIGRlbGVnYXRpb24gdHlwZSBtdXN0IG5vdCBiZSBzZWxmIGZvciBnbG9iYWwgcGx1Z2lucwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDY5LTEwNzAKICAgIC8vIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyAzCiAgICBieiBhcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA3MAogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGRpZyAxMgogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDY5LTEwNzAKICAgIC8vIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGJ6IGFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfZmFsc2VAOAogICAgaW50Y18xIC8vIDEKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA2OC0xMDcxCiAgICAvLyAhKAogICAgLy8gICB1c2VFeGVjdXRpb25LZXkgJiYKICAgIC8vICAgY2FsbGVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIC8vICksCiAgICAhCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNjctMTA3MwogICAgLy8gYXNzZXJ0KAogICAgLy8gICAhKAogICAgLy8gICAgIHVzZUV4ZWN1dGlvbktleSAmJgogICAgLy8gICAgIGNhbGxlciAhPT0gR2xvYmFsLnplcm9BZGRyZXNzCiAgICAvLyAgICksCiAgICAvLyAgIEVSUl9VU0lOR19FWEVDVVRJT05fS0VZX1JFUVVJUkVTX0dMT0JBTAogICAgLy8gKQogICAgYXNzZXJ0IC8vIHVzaW5nIGV4ZWN1dGlvbiBrZXkgcmVxdWlyZXMgZ2xvYmFsIHBsdWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDc2CiAgICAvLyBpZiAoZGVmYXVsdFRvRXNjcm93KSB7CiAgICBkaWcgMQogICAgYm56IGFyYzU4X2FkZE5hbWVkUGx1Z2luX2lmX2JvZHlAMTAKICAgIGRpZyAxMQogICAgYnVyeSAyMAoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA4MQogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyOiBjYWxsZXIsIGVzY3JvdzogZXNjcm93S2V5IH0KICAgIGRpZyAxMwogICAgaXRvYgogICAgZGlnIDEzCiAgICBjb25jYXQKICAgIGRpZyAyMAogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGJ5dGVjIDExIC8vIDB4MDAyYQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSAyMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDgyCiAgICAvLyB0aGlzLm5hbWVkUGx1Z2lucyhuYW1lKS52YWx1ZSA9IGNsb25lKGtleSkKICAgIGRpZyAxCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDg0CiAgICAvLyBsZXQgbWV0aG9kSW5mb3M6IE1ldGhvZEluZm9bXSA9IFtdCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgYnVyeSAyMQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIGJ1cnkgMTgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA4NQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDE2CgphcmM1OF9hZGROYW1lZFBsdWdpbl93aGlsZV90b3BAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwODUKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgMTUKICAgIGRpZyA2CiAgICA8CiAgICBieiBhcmM1OF9hZGROYW1lZFBsdWdpbl9hZnRlcl93aGlsZUAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDg2CiAgICAvLyBtZXRob2RJbmZvcy5wdXNoKHsgLi4ubWV0aG9kc1tpXSwgbGFzdENhbGxlZDogMCB9KQogICAgZGlnIDYKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMTYKICAgIGR1cAogICAgY292ZXIgMgogICAgcHVzaGludCAxMiAvLyAxMgogICAgKgogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGV4dHJhY3QgMCA0CiAgICBzd2FwCiAgICBleHRyYWN0IDQgOAogICAgZGlnIDEKICAgIGxlbgogICAgcHVzaGludCA0IC8vIDQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBjb25jYXQKICAgIGRpZyAyMgogICAgY29uY2F0CiAgICBkaWcgMTkKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBidXJ5IDE5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwODUKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxNgogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl93aGlsZV90b3BAMTIKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2FmdGVyX3doaWxlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDg5CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwODkKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAhPQogICAgYnogYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDkwLTEwOTYKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpICsgdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOTIKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOTIKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOTMKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOTQKICAgIC8vIGFtb3VudDogdGhpcy5wbHVnaW5zTWJyKGVzY3Jvd0tleSwgbWV0aG9kSW5mb3MubGVuZ3RoKSArIHRoaXMubmFtZWRQbHVnaW5zTWJyKG5hbWUpCiAgICBkaWcgMTkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDIyCiAgICBzd2FwCiAgICBjYWxsc3ViIHBsdWdpbnNNYnIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjAwCiAgICAvLyByZXR1cm4gTWluTmFtZWRQbHVnaW5NQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhuYW1lKS5sZW5ndGgpOwogICAgZGlnIDE3CiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGludGMgNSAvLyAxODkwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDk0CiAgICAvLyBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkgKyB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKQogICAgKwogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOTAtMTA5NQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMucGx1Z2luc01icihlc2Nyb3dLZXksIG1ldGhvZEluZm9zLmxlbmd0aCkgKyB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKQogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDkwLTEwOTYKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnBsdWdpbnNNYnIoZXNjcm93S2V5LCBtZXRob2RJbmZvcy5sZW5ndGgpICsgdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKYXJjNThfYWRkTmFtZWRQbHVnaW5fYWZ0ZXJfaWZfZWxzZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA5OQogICAgLy8gY29uc3QgZXNjcm93SUQgPSB0aGlzLm1heWJlTmV3RXNjcm93KGVzY3Jvdyk7CiAgICBkaWcgMTEKICAgIGNhbGxzdWIgbWF5YmVOZXdFc2Nyb3cKICAgIGJ1cnkgMTcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEwMQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZGlnIDQKICAgIGJ6IGFyYzU4X2FkZE5hbWVkUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMTkKICAgIGdsb2JhbCBSb3VuZAoKYXJjNThfYWRkTmFtZWRQbHVnaW5fdGVybmFyeV9tZXJnZUAyMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEwMy0xMTE1CiAgICAvLyB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgZXNjcm93OiBlc2Nyb3dJRCwKICAgIC8vICAgYWRtaW4sCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlLAogICAgLy8gICBsYXN0VmFsaWQsCiAgICAvLyAgIGNvb2xkb3duLAogICAgLy8gICBtZXRob2RzOiBjbG9uZShtZXRob2RJbmZvcyksCiAgICAvLyAgIHVzZVJvdW5kcywKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5LAogICAgLy8gICBjb3ZlckZlZXMsCiAgICAvLyAgIGxhc3RDYWxsZWQ6IDAsCiAgICAvLyAgIHN0YXJ0OiBlcG9jaFJlZgogICAgLy8gfQogICAgZGlnIDE3CiAgICBpdG9iCiAgICBkaWcgMTEKICAgIGNvbmNhdAogICAgZGlnIDEwCiAgICBpdG9iCiAgICBjb25jYXQKICAgIGRpZyA5CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGJ5dGVjIDI4IC8vIDB4MDAyYwogICAgY29uY2F0CiAgICBieXRlYyA4IC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICBkaWcgMTQKICAgIHNldGJpdAogICAgaW50Y18xIC8vIDEKICAgIGRpZyA4CiAgICBzZXRiaXQKICAgIGludGNfMiAvLyAyCiAgICBkaWcgNwogICAgc2V0Yml0CiAgICBwdXNoaW50IDMgLy8gMwogICAgZGlnIDYKICAgIHNldGJpdAogICAgY29uY2F0CiAgICBkaWcgMjIKICAgIGNvbmNhdAogICAgc3dhcAogICAgaXRvYgogICAgY29uY2F0CiAgICBkaWcgMTgKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBkaWcgMjAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTAzLTExMTUKICAgIC8vIHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlID0gewogICAgLy8gICBlc2Nyb3c6IGVzY3Jvd0lELAogICAgLy8gICBhZG1pbiwKICAgIC8vICAgZGVsZWdhdGlvblR5cGUsCiAgICAvLyAgIGxhc3RWYWxpZCwKICAgIC8vICAgY29vbGRvd24sCiAgICAvLyAgIG1ldGhvZHM6IGNsb25lKG1ldGhvZEluZm9zKSwKICAgIC8vICAgdXNlUm91bmRzLAogICAgLy8gICB1c2VFeGVjdXRpb25LZXksCiAgICAvLyAgIGNvdmVyRmVlcywKICAgIC8vICAgbGFzdENhbGxlZDogMCwKICAgIC8vICAgc3RhcnQ6IGVwb2NoUmVmCiAgICAvLyB9CiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlY18yIC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA0My0xMDU3CiAgICAvLyBhcmM1OF9hZGROYW1lZFBsdWdpbigKICAgIC8vICAgbmFtZTogc3RyaW5nLAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgY2FsbGVyOiBBY2NvdW50LAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgYWRtaW46IGJvb2xlYW4sCiAgICAvLyAgIGRlbGVnYXRpb25UeXBlOiBVaW50OCwKICAgIC8vICAgbGFzdFZhbGlkOiB1aW50NjQsCiAgICAvLyAgIGNvb2xkb3duOiB1aW50NjQsCiAgICAvLyAgIG1ldGhvZHM6IE1ldGhvZFJlc3RyaWN0aW9uW10sCiAgICAvLyAgIHVzZVJvdW5kczogYm9vbGVhbiwKICAgIC8vICAgdXNlRXhlY3V0aW9uS2V5OiBib29sZWFuLAogICAgLy8gICBjb3ZlckZlZXM6IGJvb2xlYW4sCiAgICAvLyAgIGRlZmF1bHRUb0VzY3JvdzogYm9vbGVhbgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9hZGROYW1lZFBsdWdpbl90ZXJuYXJ5X2ZhbHNlQDE5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTAxCiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBiIGFyYzU4X2FkZE5hbWVkUGx1Z2luX3Rlcm5hcnlfbWVyZ2VAMjAKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2lmX2JvZHlAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNzcKICAgIC8vIGFzc2VydChlc2Nyb3cgIT09ICcnLCBFUlJfRVNDUk9XX1JFUVVJUkVEX1RPX0JFX1NFVF9BU19ERUZBVUxUKQogICAgZGlnIDExCiAgICBieXRlY18xIC8vICIiCiAgICAhPQogICAgYXNzZXJ0IC8vIGVzY3JvdyBtdXN0IGJlIHNldCBpZiBkZWZhdWx0VG9Fc2Nyb3cgaXMgdHJ1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMDc4CiAgICAvLyBlc2Nyb3dLZXkgPSAnJwogICAgYnl0ZWNfMSAvLyAiIgogICAgYnVyeSAyMAogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDExCgphcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDg6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9hZGROYW1lZFBsdWdpbl9ib29sX21lcmdlQDkKCmFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfZmFsc2VANDoKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X2FkZE5hbWVkUGx1Z2luX2Jvb2xfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW46CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI2CiAgICAvLyBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbihuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI3CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5jYW5SZXZva2UoKSwgRVJSX09OTFlfQURNSU5fT1JfUkVWT0NBVElPTl9BUFBfQ0FOX1JFTU9WRV9QTFVHSU4pOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBibnogYXJjNThfcmVtb3ZlTmFtZWRQbHVnaW5fYm9vbF90cnVlQDMKICAgIGNhbGxzdWIgY2FuUmV2b2tlCiAgICBieiBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9ib29sX2ZhbHNlQDQKCmFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luX2Jvb2xfdHJ1ZUAzOgogICAgaW50Y18xIC8vIDEKCmFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEyNwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuY2FuUmV2b2tlKCksIEVSUl9PTkxZX0FETUlOX09SX1JFVk9DQVRJT05fQVBQX0NBTl9SRU1PVkVfUExVR0lOKTsKICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIG9yIHJldm9jYXRpb24gYXBwIGNhbiByZW1vdmUgcGx1Z2lucwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjQKICAgIC8vIG5hbWVkUGx1Z2lucyA9IEJveE1hcDxzdHJpbmcsIFBsdWdpbktleT4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeE5hbWVkUGx1Z2lucyB9KTsKICAgIGJ5dGVjIDE3IC8vICJuIgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI4CiAgICAvLyBhc3NlcnQodGhpcy5uYW1lZFBsdWdpbnMobmFtZSkuZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gUGx1Z2luIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMjkKICAgIC8vIGNvbnN0IGFwcCA9IGNsb25lKHRoaXMubmFtZWRQbHVnaW5zKG5hbWUpLnZhbHVlKQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIGR1cAogICAgYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTMwCiAgICAvLyBhc3NlcnQodGhpcy5wbHVnaW5zKGFwcCkuZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gUGx1Z2luIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMzIKICAgIC8vIGNvbnN0IG1ldGhvZHNMZW5ndGg6IHVpbnQ2NCA9IHRoaXMucGx1Z2lucyhhcHApLnZhbHVlLm1ldGhvZHMubGVuZ3RoCiAgICBkdXAKICAgIHB1c2hpbnQgNDQgLy8gNDQKICAgIGludGNfMiAvLyAyCiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMzQKICAgIC8vIHRoaXMubmFtZWRQbHVnaW5zKG5hbWUpLmRlbGV0ZSgpOwogICAgc3dhcAogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMzUKICAgIC8vIHRoaXMucGx1Z2lucyhhcHApLmRlbGV0ZSgpOwogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMzcKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEzNwogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgICE9CiAgICBieiBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEzOC0xMTQzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubmFtZWRQbHVnaW5zTWJyKG5hbWUpICsgdGhpcy5wbHVnaW5zTWJyKGFwcC5lc2Nyb3csIG1ldGhvZHNMZW5ndGgpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTQwCiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDAKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjAwCiAgICAvLyByZXR1cm4gTWluTmFtZWRQbHVnaW5NQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhuYW1lKS5sZW5ndGgpOwogICAgZGlnIDEKICAgIGxlbgogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgaW50YyA1IC8vIDE4OTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNDEKICAgIC8vIGFtb3VudDogdGhpcy5uYW1lZFBsdWdpbnNNYnIobmFtZSkgKyB0aGlzLnBsdWdpbnNNYnIoYXBwLmVzY3JvdywgbWV0aG9kc0xlbmd0aCkKICAgIGRpZyA0CiAgICBkdXAKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMQogICAgbGVuCiAgICBzdWJzdHJpbmczCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDQKICAgIGNhbGxzdWIgcGx1Z2luc01icgogICAgKwogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTEzOC0xMTQyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubmFtZWRQbHVnaW5zTWJyKG5hbWUpICsgdGhpcy5wbHVnaW5zTWJyKGFwcC5lc2Nyb3csIG1ldGhvZHNMZW5ndGgpCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExMzgtMTE0MwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm5hbWVkUGx1Z2luc01icihuYW1lKSArIHRoaXMucGx1Z2luc01icihhcHAuZXNjcm93LCBtZXRob2RzTGVuZ3RoKQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgphcmM1OF9yZW1vdmVOYW1lZFBsdWdpbl9hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjXzIgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTI2CiAgICAvLyBhcmM1OF9yZW1vdmVOYW1lZFBsdWdpbihuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luX2Jvb2xfZmFsc2VANDoKICAgIGludGNfMCAvLyAwCiAgICBiIGFyYzU4X3JlbW92ZU5hbWVkUGx1Z2luX2Jvb2xfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X25ld0VzY3Jvd1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X25ld0VzY3JvdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE1NQogICAgLy8gYXJjNThfbmV3RXNjcm93KGVzY3Jvdzogc3RyaW5nKTogdWludDY0IHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTU2CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9BRE1JTl9PTkxZKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjIDUgLy8gImUiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTcKICAgIC8vIGFzc2VydCghdGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0FMUkVBRFlfRVhJU1RTKTsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIEVzY3JvdyBhbHJlYWR5IGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTU4CiAgICAvLyBhc3NlcnQoZXNjcm93ICE9PSAnJywgRVJSX0VTQ1JPV19OQU1FX1JFUVVJUkVEKTsKICAgIGR1cAogICAgYnl0ZWNfMSAvLyAiIgogICAgIT0KICAgIGFzc2VydCAvLyBFc2Nyb3cgbmFtZSBpcyByZXF1aXJlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTU5CiAgICAvLyByZXR1cm4gdGhpcy5uZXdFc2Nyb3coZXNjcm93KTsKICAgIGNhbGxzdWIgbmV3RXNjcm93CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNTUKICAgIC8vIGFyYzU4X25ld0VzY3Jvdyhlc2Nyb3c6IHN0cmluZyk6IHVpbnQ2NCB7CiAgICBpdG9iCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfdG9nZ2xlRXNjcm93TG9ja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3RvZ2dsZUVzY3Jvd0xvY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExNjcKICAgIC8vIGFyYzU4X3RvZ2dsZUVzY3Jvd0xvY2soZXNjcm93OiBzdHJpbmcpOiBFc2Nyb3dJbmZvIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTY4CiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCksIEVSUl9GT1JCSURERU4pOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciB3YWxsZXQgY2FuIGRlbGV0ZSBhIHNwZW5kaW5nIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjIDUgLy8gImUiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2OQogICAgLy8gYXNzZXJ0KHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCk7CiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEVzY3JvdyBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTcxCiAgICAvLyB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQgPSAhdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUubG9ja2VkOwogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgIQogICAgZGlnIDEKICAgIGludGNfMyAvLyA4CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgZGlnIDEKICAgIGludGNfMyAvLyA4CiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjXzIgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTc2CiAgICAvLyByZXR1cm4gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWU7CiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE2NwogICAgLy8gYXJjNThfdG9nZ2xlRXNjcm93TG9jayhlc2Nyb3c6IHN0cmluZyk6IEVzY3Jvd0luZm8gewogICAgYnl0ZWMgNCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3JlY2xhaW1bcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9yZWNsYWltOgogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwbiA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExODUKICAgIC8vIGFyYzU4X3JlY2xhaW0oZXNjcm93OiBzdHJpbmcsIHJlY2xhaW1zOiBFc2Nyb3dSZWNsYWltW10pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAzCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsdWludDY0LGJvb2wxKVtdKQogICAgaW50Y18wIC8vIDAKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExODYKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0ZPUkJJRERFTik7CiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGFzc2VydCAvLyBvbmx5IHRoZSBjcmVhdG9yIHdhbGxldCBjYW4gZGVsZXRlIGEgc3BlbmRpbmcgYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTg3CiAgICAvLyBhc3NlcnQodGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXNjcm93IGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExODgKICAgIC8vIGNvbnN0IHNlbmRlciA9IEFwcGxpY2F0aW9uKHRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmlkKS5hZGRyZXNzCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTkwCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcmVjbGFpbXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9yZWNsYWltX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTkwCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcmVjbGFpbXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgZGlnIDUKICAgIDwKICAgIGJ6IGFyYzU4X3JlY2xhaW1fYWZ0ZXJfd2hpbGVAMTcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE5MQogICAgLy8gaWYgKHJlY2xhaW1zW2ldLmFzc2V0ID09PSAwKSB7CiAgICBkaWcgNQogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICAqCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGJ1cnkgMTIKICAgIGJueiBhcmM1OF9yZWNsYWltX2Vsc2VfYm9keUAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk0CiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTQKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHN3YXAKICAgIGJ1cnkgMTUKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE5NQogICAgLy8gYW1vdW50OiByZWNsYWltc1tpXS5hbW91bnQKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDEwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTIKICAgIC8vIGNvbnN0IHBtdCA9IGl0eG4ucGF5bWVudCh7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk4CiAgICAvLyBpZiAocmVjbGFpbXNbaV0uY2xvc2VPdXQpIHsKICAgIHB1c2hpbnQgMTI4IC8vIDEyOAogICAgZ2V0Yml0CiAgICBieiBhcmM1OF9yZWNsYWltX2FmdGVyX2lmX2Vsc2VANgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMTk5CiAgICAvLyBwbXQuc2V0KHsgY2xvc2VSZW1haW5kZXJUbzogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSB9KTsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjExOTkKICAgIC8vIHBtdC5zZXQoeyBjbG9zZVJlbWFpbmRlclRvOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlIH0pOwogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDEyCiAgICBidXJ5IDMKCmFyYzU4X3JlY2xhaW1fYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjAyCiAgICAvLyBwbXQuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICBkaWcgMTAKICAgIGJ6IGFyYzU4X3JlY2xhaW1fbmV4dF9maWVsZEA4CiAgICBkaWcgMgogICAgaXR4bl9maWVsZCBDbG9zZVJlbWFpbmRlclRvCgphcmM1OF9yZWNsYWltX25leHRfZmllbGRAODoKICAgIGRpZyA4CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZGlnIDEyCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE5Mi0xMTk2CiAgICAvLyBjb25zdCBwbXQgPSBpdHhuLnBheW1lbnQoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICBhbW91bnQ6IHJlY2xhaW1zW2ldLmFtb3VudAogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIwMgogICAgLy8gcG10LnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKCmFyYzU4X3JlY2xhaW1fYWZ0ZXJfaWZfZWxzZUAxNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE5MAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHJlY2xhaW1zLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYXJjNThfcmVjbGFpbV93aGlsZV90b3BAMgoKYXJjNThfcmVjbGFpbV9lbHNlX2JvZHlAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMDYKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjA2CiAgICAvLyBhc3NldFJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHN3YXAKICAgIGJ1cnkgMTQKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIwNwogICAgLy8gYXNzZXRBbW91bnQ6IHJlY2xhaW1zW2ldLmFtb3VudCwKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIwNAogICAgLy8gY29uc3QgeGZlciA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMTEKICAgIC8vIGlmIChyZWNsYWltc1tpXS5jbG9zZU91dCkgewogICAgcHVzaGludCAxMjggLy8gMTI4CiAgICBnZXRiaXQKICAgIGJ6IGFyYzU4X3JlY2xhaW1fYWZ0ZXJfaWZfZWxzZUAxMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjEyCiAgICAvLyB4ZmVyLnNldCh7IGFzc2V0Q2xvc2VUbzogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSB9KTsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMTIKICAgIC8vIHhmZXIuc2V0KHsgYXNzZXRDbG9zZVRvOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlIH0pOwogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDgKICAgIGJ1cnkgNAoKYXJjNThfcmVjbGFpbV9hZnRlcl9pZl9lbHNlQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjE1CiAgICAvLyB4ZmVyLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgZGlnIDYKICAgIGJ6IGFyYzU4X3JlY2xhaW1fbmV4dF9maWVsZEAxNAogICAgZGlnIDMKICAgIGl0eG5fZmllbGQgQXNzZXRDbG9zZVRvCgphcmM1OF9yZWNsYWltX25leHRfZmllbGRAMTQ6CiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGRpZyA3CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBkaWcgMTEKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMDQtMTIwOQogICAgLy8gY29uc3QgeGZlciA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYXNzZXRBbW91bnQ6IHJlY2xhaW1zW2ldLmFtb3VudCwKICAgIC8vICAgeGZlckFzc2V0OiByZWNsYWltc1tpXS5hc3NldAogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIxNQogICAgLy8geGZlci5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CiAgICBiIGFyYzU4X3JlY2xhaW1fYWZ0ZXJfaWZfZWxzZUAxNgoKYXJjNThfcmVjbGFpbV9hZnRlcl93aGlsZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTE4NQogICAgLy8gYXJjNThfcmVjbGFpbShlc2Nyb3c6IHN0cmluZywgcmVjbGFpbXM6IEVzY3Jvd1JlY2xhaW1bXSk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X29wdGluRXNjcm93W3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfb3B0aW5Fc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMjYKICAgIC8vIGFyYzU4X29wdGluRXNjcm93KGVzY3Jvdzogc3RyaW5nLCBhc3NldHM6IHVpbnQ2NFtdKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgdW5jb3ZlciAyCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDY0W10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMjcKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0ZPUkJJRERFTikKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIG9ubHkgdGhlIGNyZWF0b3Igd2FsbGV0IGNhbiBkZWxldGUgYSBzcGVuZGluZyBhY2NvdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2NgogICAgLy8gZXNjcm93cyA9IEJveE1hcDxzdHJpbmcsIEVzY3Jvd0luZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFc2Nyb3dzIH0pCiAgICBieXRlYyA1IC8vICJlIgogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIyOAogICAgLy8gYXNzZXJ0KHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXNjcm93IGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMjkKICAgIC8vIGNvbnN0IGVzY3Jvd0lEID0gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQKICAgIGJveF9nZXQKICAgIHBvcAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIzMAogICAgLy8gY29uc3QgZXNjcm93QWRkcmVzcyA9IEFwcGxpY2F0aW9uKGVzY3Jvd0lEKS5hZGRyZXNzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBzd2FwCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGNvdmVyIDQKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIzMQogICAgLy8gYXNzZXJ0KCF0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQsIEVSUl9FU0NST1dfTE9DS0VEKQogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICAhCiAgICBhc3NlcnQgLy8gRXNjcm93IGlzIGxvY2tlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjMzLTEyMzkKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjM1CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjM1CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjM3CiAgICAvLyBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqIGFzc2V0cy5sZW5ndGgKICAgIGdsb2JhbCBBc3NldE9wdEluTWluQmFsYW5jZQogICAgdW5jb3ZlciAzCiAgICAqCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTIzMy0xMjM4CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMzMtMTIzOQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjQxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYXJjNThfb3B0aW5Fc2Nyb3dfd2hpbGVfdG9wQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNDEKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgZGlnIDMKICAgIDwKICAgIGJ6IGFyYzU4X29wdGluRXNjcm93X2FmdGVyX3doaWxlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0MwogICAgLy8gdGhpcy5hbGxvd2FuY2VzKHsgZXNjcm93LCBhc3NldDogYXNzZXRzW2ldIH0pLmV4aXN0cywKICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGR1cAogICAgY292ZXIgMgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgNgogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBpdG9iCiAgICBieXRlYyAxMiAvLyAweDAwMGEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2OAogICAgLy8gYWxsb3dhbmNlcyA9IEJveE1hcDxBbGxvd2FuY2VLZXksIEFsbG93YW5jZUluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhBbGxvd2FuY2VzIH0pIC8vIDM4XzUwMAogICAgYnl0ZWMgMTMgLy8gImEiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0MwogICAgLy8gdGhpcy5hbGxvd2FuY2VzKHsgZXNjcm93LCBhc3NldDogYXNzZXRzW2ldIH0pLmV4aXN0cywKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjQyLTEyNDUKICAgIC8vIGFzc2VydCgKICAgIC8vICAgdGhpcy5hbGxvd2FuY2VzKHsgZXNjcm93LCBhc3NldDogYXNzZXRzW2ldIH0pLmV4aXN0cywKICAgIC8vICAgRVJSX0FMTE9XQU5DRV9ET0VTX05PVF9FWElTVAogICAgLy8gKTsKICAgIGFzc2VydCAvLyBhbGxvd2FuY2UgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0Ny0xMjU0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0c1tpXQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjUxCiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBkaWcgMgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNDctMTI1MwogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldHNbaV0KICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI0Ny0xMjU0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBzZW5kZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0c1tpXQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjQxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGFyYzU4X29wdGluRXNjcm93X3doaWxlX3RvcEAzCgphcmM1OF9vcHRpbkVzY3Jvd19hZnRlcl93aGlsZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjI2CiAgICAvLyBhcmM1OF9vcHRpbkVzY3Jvdyhlc2Nyb3c6IHN0cmluZywgYXNzZXRzOiB1aW50NjRbXSk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3BsdWdpbk9wdGluRXNjcm93W3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3c6CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjY2LTEyNzIKICAgIC8vIGFyYzU4X3BsdWdpbk9wdGluRXNjcm93KAogICAgLy8gICBwbHVnaW46IHVpbnQ2NCwKICAgIC8vICAgY2FsbGVyOiBBY2NvdW50LAogICAgLy8gICBlc2Nyb3c6IHN0cmluZywKICAgIC8vICAgYXNzZXRzOiB1aW50NjRbXSwKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuCiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBjb3ZlciA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciA1CiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBjb3ZlciA0CiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjczCiAgICAvLyBjb25zdCBrZXk6IFBsdWdpbktleSA9IHsgcGx1Z2luLCBjYWxsZXI6IGNhbGxlciwgZXNjcm93IH0KICAgIGRpZyAyCiAgICBpdG9iCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGR1cAogICAgY292ZXIgNAogICAgc3dhcAogICAgYnl0ZWMgMTEgLy8gMHgwMDJhCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI3NQogICAgLy8gYXNzZXJ0KHRoaXMucGx1Z2lucyhrZXkpLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBsdWdpbiBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjc2CiAgICAvLyBhc3NlcnQodGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI3NwogICAgLy8gYXNzZXJ0KCF0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5sb2NrZWQsIEVSUl9FU0NST1dfTE9DS0VEKQogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgIQogICAgYXNzZXJ0IC8vIEVzY3JvdyBpcyBsb2NrZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI3OQogICAgLy8gY29uc3QgZXNjcm93SUQgPSB0aGlzLmVzY3Jvd3MoZXNjcm93KS52YWx1ZS5pZAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyODIKICAgIC8vIFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKHBsdWdpbikuYWRkcmVzcyB8fAogICAgdHhuIFNlbmRlcgogICAgc3dhcAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4Mi0xMjgzCiAgICAvLyBUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MgfHwKICAgIC8vIFR4bi5zZW5kZXIgPT09IGNhbGxlciB8fAogICAgYm56IGFyYzU4X3BsdWdpbk9wdGluRXNjcm93X2Jvb2xfdHJ1ZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyODMKICAgIC8vIFR4bi5zZW5kZXIgPT09IGNhbGxlciB8fAogICAgdHhuIFNlbmRlcgogICAgZGlnIDYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyODItMTI4MwogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIGJueiBhcmM1OF9wbHVnaW5PcHRpbkVzY3Jvd19ib29sX3RydWVANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjg0CiAgICAvLyBjYWxsZXIgPT09IEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIGRpZyA1CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyODItMTI4NAogICAgLy8gVHhuLnNlbmRlciA9PT0gQXBwbGljYXRpb24ocGx1Z2luKS5hZGRyZXNzIHx8CiAgICAvLyBUeG4uc2VuZGVyID09PSBjYWxsZXIgfHwKICAgIC8vIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgYnogYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3dfYm9vbF9mYWxzZUA1CgphcmM1OF9wbHVnaW5PcHRpbkVzY3Jvd19ib29sX3RydWVANDoKICAgIGludGNfMSAvLyAxCgphcmM1OF9wbHVnaW5PcHRpbkVzY3Jvd19ib29sX21lcmdlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyODEtMTI4NgogICAgLy8gYXNzZXJ0KAogICAgLy8gICBUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihwbHVnaW4pLmFkZHJlc3MgfHwKICAgIC8vICAgVHhuLnNlbmRlciA9PT0gY2FsbGVyIHx8CiAgICAvLyAgIGNhbGxlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICBFUlJfRk9SQklEREVOCiAgICAvLyApCiAgICBhc3NlcnQgLy8gb25seSB0aGUgY3JlYXRvciB3YWxsZXQgY2FuIGRlbGV0ZSBhIHNwZW5kaW5nIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4OAogICAgLy8gY29uc3QgZXNjcm93QWRkcmVzcyA9IEFwcGxpY2F0aW9uKGVzY3Jvd0lEKS5hZGRyZXNzCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIHN3YXAKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSAxMAogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjkwLTEyOTcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAzCiAgICBkdXAKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyOTMKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5MwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjkwLTEyOTcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIHN3YXAKICAgIGRpZyAxCiAgICA9PQogICAgdW5jb3ZlciAyCiAgICBndHhucyBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5NAogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGRpZyA4CiAgICBkdXAKICAgIGNvdmVyIDQKICAgICoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5MC0xMjk3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBpbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5OS0xMzA1CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMwMwogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgICoKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjk5LTEzMDQKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqIGFzc2V0cy5sZW5ndGgKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTI5OS0xMzA1CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMDcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDcKCmFyYzU4X3BsdWdpbk9wdGluRXNjcm93X3doaWxlX3RvcEA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzA3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgNgogICAgZGlnIDQKICAgIDwKICAgIGJ6IGFyYzU4X3BsdWdpbk9wdGluRXNjcm93X2FmdGVyX3doaWxlQDExCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMDkKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyh7IGVzY3JvdywgYXNzZXQ6IGFzc2V0c1tpXSB9KS5leGlzdHMsCiAgICBkaWcgNAogICAgZXh0cmFjdCAyIDAKICAgIGRpZyA3CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBpdG9iCiAgICBieXRlYyAxMiAvLyAweDAwMGEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDQKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjgKICAgIC8vIGFsbG93YW5jZXMgPSBCb3hNYXA8QWxsb3dhbmNlS2V5LCBBbGxvd2FuY2VJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4QWxsb3dhbmNlcyB9KSAvLyAzOF81MDAKICAgIGJ5dGVjIDEzIC8vICJhIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMDkKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyh7IGVzY3JvdywgYXNzZXQ6IGFzc2V0c1tpXSB9KS5leGlzdHMsCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMwOC0xMzExCiAgICAvLyBhc3NlcnQoCiAgICAvLyAgIHRoaXMuYWxsb3dhbmNlcyh7IGVzY3JvdywgYXNzZXQ6IGFzc2V0c1tpXSB9KS5leGlzdHMsCiAgICAvLyAgIEVSUl9BTExPV0FOQ0VfRE9FU19OT1RfRVhJU1QKICAgIC8vICk7CiAgICBhc3NlcnQgLy8gYWxsb3dhbmNlIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTMtMTMyMAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldHNbaV0KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxNwogICAgLy8gYXNzZXRBbW91bnQ6IDAsCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgZGlnIDgKICAgIGR1cAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEzLTEzMTkKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICAgIHhmZXJBc3NldDogYXNzZXRzW2ldCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMTMtMTMyMAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldHNbaV0KICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMwNwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgNwogICAgYiBhcmM1OF9wbHVnaW5PcHRpbkVzY3Jvd193aGlsZV90b3BAOAoKYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3dfYWZ0ZXJfd2hpbGVAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEyNjYtMTI3MgogICAgLy8gYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3coCiAgICAvLyAgIHBsdWdpbjogdWludDY0LAogICAgLy8gICBjYWxsZXI6IEFjY291bnQsCiAgICAvLyAgIGVzY3Jvdzogc3RyaW5nLAogICAgLy8gICBhc3NldHM6IHVpbnQ2NFtdLAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4KICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3dfYm9vbF9mYWxzZUA1OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfcGx1Z2luT3B0aW5Fc2Nyb3dfYm9vbF9tZXJnZUA2CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfYWRkQWxsb3dhbmNlc1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2FkZEFsbG93YW5jZXM6CiAgICBpbnRjXzAgLy8gMAogICAgZHVwbiA0CiAgICBieXRlY18xIC8vICIiCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzMAogICAgLy8gYXJjNThfYWRkQWxsb3dhbmNlcyhlc2Nyb3c6IHN0cmluZywgYWxsb3dhbmNlczogQWRkQWxsb3dhbmNlSW5mb1tdKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAzCiAgICBwdXNoaW50IDM0IC8vIDM0CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsdWludDgsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbDEpW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzEKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSwgRVJSX0FETUlOX09OTFkpOwogICAgY2FsbHN1YiBpc0FkbWluCiAgICBhc3NlcnQgLy8gYWRtaW4gb25seQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzMyCiAgICAvLyBhc3NlcnQodGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzLCBFUlJfRVNDUk9XX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXNjcm93IGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzMKICAgIC8vIGFzc2VydCghdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUubG9ja2VkLCBFUlJfRVNDUk9XX0xPQ0tFRCk7CiAgICBib3hfZ2V0CiAgICBwb3AKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgIQogICAgYXNzZXJ0IC8vIEVzY3JvdyBpcyBsb2NrZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzNQogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzM1CiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IGFyYzU4X2FkZEFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzYtMTM0MgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuYWxsb3dhbmNlc01icihlc2Nyb3cpICogYWxsb3dhbmNlcy5sZW5ndGgKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzgKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzgKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMzkKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwOAogICAgLy8gcmV0dXJuIE1pbkFsbG93YW5jZU1CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKGVzY3JvdykubGVuZ3RoKTsKICAgIGRpZyA0CiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGludGMgNiAvLyAyNzcwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQwCiAgICAvLyBhbW91bnQ6IHRoaXMuYWxsb3dhbmNlc01icihlc2Nyb3cpICogYWxsb3dhbmNlcy5sZW5ndGgKICAgIGRpZyAzCiAgICAqCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMzNi0xMzQxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhbGxvd2FuY2VzLmxlbmd0aAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzM2LTEzNDIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSAqIGFsbG93YW5jZXMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmFyYzU4X2FkZEFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ1CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWxsb3dhbmNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgNQoKYXJjNThfYWRkQWxsb3dhbmNlc193aGlsZV90b3BANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM0NQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFsbG93YW5jZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyA0CiAgICBkaWcgMQogICAgPAogICAgYnogYXJjNThfYWRkQWxsb3dhbmNlc19hZnRlcl93aGlsZUAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ2CiAgICAvLyBjb25zdCB7IGFzc2V0LCB0eXBlLCBhbW91bnQsIG1heCwgaW50ZXJ2YWwsIHVzZVJvdW5kcyB9ID0gYWxsb3dhbmNlc1tpXTsKICAgIGRpZyAxCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDUKICAgIHB1c2hpbnQgMzQgLy8gMzQKICAgICoKICAgIHB1c2hpbnQgMzQgLy8gMzQKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZHVwCiAgICBleHRyYWN0IDAgOAogICAgZGlnIDEKICAgIGV4dHJhY3QgOCAxCiAgICBidXJ5IDgKICAgIGRpZyAxCiAgICBleHRyYWN0IDkgOAogICAgYnVyeSAxMgogICAgZGlnIDEKICAgIGV4dHJhY3QgMTcgOAogICAgYnVyeSAxMQogICAgZGlnIDEKICAgIGV4dHJhY3QgMjUgOAogICAgYnVyeSAxMAogICAgc3dhcAogICAgcHVzaGludCAyNjQgLy8gMjY0CiAgICBnZXRiaXQKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDcKICAgIC8vIGNvbnN0IGtleTogQWxsb3dhbmNlS2V5ID0geyBlc2Nyb3csIGFzc2V0IH0KICAgIGRpZyA0CiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWMgMTIgLy8gMHgwMDBhCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2OAogICAgLy8gYWxsb3dhbmNlcyA9IEJveE1hcDxBbGxvd2FuY2VLZXksIEFsbG93YW5jZUluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhBbGxvd2FuY2VzIH0pIC8vIDM4XzUwMAogICAgYnl0ZWMgMTMgLy8gImEiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDgKICAgIC8vIGFzc2VydCghdGhpcy5hbGxvd2FuY2VzKGtleSkuZXhpc3RzLCBFUlJfQUxMT1dBTkNFX0FMUkVBRFlfRVhJU1RTKTsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIGFsbG93YW5jZSBhbHJlYWR5IGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ5CiAgICAvLyBjb25zdCBzdGFydCA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBieiBhcmM1OF9hZGRBbGxvd2FuY2VzX3Rlcm5hcnlfZmFsc2VAOAogICAgZ2xvYmFsIFJvdW5kCgphcmM1OF9hZGRBbGxvd2FuY2VzX3Rlcm5hcnlfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM1MS0xMzYwCiAgICAvLyB0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgdHlwZSwKICAgIC8vICAgc3BlbnQ6IDAsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgbGFzdDogMCwKICAgIC8vICAgbWF4LAogICAgLy8gICBpbnRlcnZhbCwKICAgIC8vICAgc3RhcnQsCiAgICAvLyAgIHVzZVJvdW5kcwogICAgLy8gfQogICAgZGlnIDYKICAgIGRpZyAxMAogICAgY29uY2F0CiAgICBkaWcgMTEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzUzCiAgICAvLyBzcGVudDogMCwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNTEtMTM2MAogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkudmFsdWUgPSB7CiAgICAvLyAgIHR5cGUsCiAgICAvLyAgIHNwZW50OiAwLAogICAgLy8gICBhbW91bnQsCiAgICAvLyAgIGxhc3Q6IDAsCiAgICAvLyAgIG1heCwKICAgIC8vICAgaW50ZXJ2YWwsCiAgICAvLyAgIHN0YXJ0LAogICAgLy8gICB1c2VSb3VuZHMKICAgIC8vIH0KICAgIGl0b2IKICAgIHN3YXAKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxMAogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDYKICAgIHNldGJpdAogICAgY29uY2F0CiAgICBkaWcgNwogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzQ1CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWxsb3dhbmNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZGlnIDQKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDUKICAgIGIgYXJjNThfYWRkQWxsb3dhbmNlc193aGlsZV90b3BANQoKYXJjNThfYWRkQWxsb3dhbmNlc190ZXJuYXJ5X2ZhbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNDkKICAgIC8vIGNvbnN0IHN0YXJ0ID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGIgYXJjNThfYWRkQWxsb3dhbmNlc190ZXJuYXJ5X21lcmdlQDkKCmFyYzU4X2FkZEFsbG93YW5jZXNfYWZ0ZXJfd2hpbGVAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MQogICAgLy8gbGFzdFVzZXJJbnRlcmFjdGlvbiA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RVc2VySW50ZXJhY3Rpb24gfSkKICAgIGJ5dGVjXzIgLy8gImxhc3RfdXNlcl9pbnRlcmFjdGlvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTg2CiAgICAvLyB0aGlzLmxhc3RVc2VySW50ZXJhY3Rpb24udmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDMKICAgIC8vIGxhc3RDaGFuZ2UgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0Q2hhbmdlIH0pCiAgICBieXRlYyA2IC8vICJsYXN0X2NoYW5nZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkwCiAgICAvLyB0aGlzLmxhc3RDaGFuZ2UudmFsdWUgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzMwCiAgICAvLyBhcmM1OF9hZGRBbGxvd2FuY2VzKGVzY3Jvdzogc3RyaW5nLCBhbGxvd2FuY2VzOiBBZGRBbGxvd2FuY2VJbmZvW10pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZW1vdmVBbGxvd2FuY2VzW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfcmVtb3ZlQWxsb3dhbmNlczoKICAgIGJ5dGVjXzEgLy8gIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3MwogICAgLy8gYXJjNThfcmVtb3ZlQWxsb3dhbmNlcyhlc2Nyb3c6IHN0cmluZywgYXNzZXRzOiB1aW50NjRbXSk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50NjRbXSkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3NAogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuY2FuUmV2b2tlKCksIEVSUl9PTkxZX0FETUlOX09SX1JFVk9DQVRJT05fQVBQX0NBTl9SRU1PVkVfTUVUSE9EX1JFU1RSSUNUSU9OKTsKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYm9vbF90cnVlQDMKICAgIGNhbGxzdWIgY2FuUmV2b2tlCiAgICBieiBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2Jvb2xfZmFsc2VANAoKYXJjNThfcmVtb3ZlQWxsb3dhbmNlc19ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3NAogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpIHx8IHRoaXMuY2FuUmV2b2tlKCksIEVSUl9PTkxZX0FETUlOX09SX1JFVk9DQVRJT05fQVBQX0NBTl9SRU1PVkVfTUVUSE9EX1JFU1RSSUNUSU9OKTsKICAgIGFzc2VydCAvLyBPbmx5IGFuIGFkbWluIG9yIHJldm9jYXRpb24gYXBwIGNhbiByZW1vdmUgbWV0aG9kIHJlc3RyaWN0aW9ucwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIGRpZyAzCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3NQogICAgLy8gYXNzZXJ0KHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCk7CiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEVzY3JvdyBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzc2CiAgICAvLyBhc3NlcnQoIXRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmxvY2tlZCwgRVJSX0VTQ1JPV19MT0NLRUQpOwogICAgYm94X2dldAogICAgcG9wCiAgICBwdXNoaW50IDY0IC8vIDY0CiAgICBnZXRiaXQKICAgICEKICAgIGFzc2VydCAvLyBFc2Nyb3cgaXMgbG9ja2VkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzNzgKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3OAogICAgLy8gaWYgKHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgIT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgICE9CiAgICBieiBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzc5LTEzODQKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzgxCiAgICAvLyByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzODEKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjA4CiAgICAvLyByZXR1cm4gTWluQWxsb3dhbmNlTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMoZXNjcm93KS5sZW5ndGgpOwogICAgZGlnIDMKICAgIGxlbgogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgaW50YyA2IC8vIDI3NzAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzODIKICAgIC8vIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhc3NldHMubGVuZ3RoCiAgICBkaWcgMgogICAgKgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3OS0xMzgzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuYWxsb3dhbmNlc01icihlc2Nyb3cpICogYXNzZXRzLmxlbmd0aAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzc5LTEzODQKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5hbGxvd2FuY2VzTWJyKGVzY3JvdykgKiBhc3NldHMubGVuZ3RoCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA0CgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzX3doaWxlX3RvcEA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkaWcgMwogICAgZGlnIDEKICAgIDwKICAgIGJ6IGFyYzU4X3JlbW92ZUFsbG93YW5jZXNfYWZ0ZXJfd2hpbGVAMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM5MAogICAgLy8gYXNzZXQ6IGFzc2V0c1tpXQogICAgZGlnIDEKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgNAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzg4LTEzOTEKICAgIC8vIGNvbnN0IGtleTogQWxsb3dhbmNlS2V5ID0gewogICAgLy8gICBlc2Nyb3csCiAgICAvLyAgIGFzc2V0OiBhc3NldHNbaV0KICAgIC8vIH0KICAgIGRpZyA0CiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWMgMTIgLy8gMHgwMDBhCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2OAogICAgLy8gYWxsb3dhbmNlcyA9IEJveE1hcDxBbGxvd2FuY2VLZXksIEFsbG93YW5jZUluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhBbGxvd2FuY2VzIH0pIC8vIDM4XzUwMAogICAgYnl0ZWMgMTMgLy8gImEiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM5MgogICAgLy8gYXNzZXJ0KHRoaXMuYWxsb3dhbmNlcyhrZXkpLmV4aXN0cywgRVJSX0FMTE9XQU5DRV9ET0VTX05PVF9FWElTVCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gYWxsb3dhbmNlIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzOTMKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM4NwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgNAogICAgYiBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzX3doaWxlX3RvcEA5CgphcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2FmdGVyX3doaWxlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlY18yIC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTM3MwogICAgLy8gYXJjNThfcmVtb3ZlQWxsb3dhbmNlcyhlc2Nyb3c6IHN0cmluZywgYXNzZXRzOiB1aW50NjRbXSk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKYXJjNThfcmVtb3ZlQWxsb3dhbmNlc19ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzAgLy8gMAogICAgYiBhcmM1OF9yZW1vdmVBbGxvd2FuY2VzX2Jvb2xfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2FkZEV4ZWN1dGlvbktleVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2FkZEV4ZWN1dGlvbktleToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwMAogICAgLy8gYXJjNThfYWRkRXhlY3V0aW9uS2V5KGxlYXNlOiBieXRlczwzMj4sIGdyb3VwczogYnl0ZXM8MzI+W10sIGZpcnN0VmFsaWQ6IHVpbnQ2NCwgbGFzdFZhbGlkOiB1aW50NjQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwMQogICAgLy8gYXNzZXJ0KHRoaXMuaXNBZG1pbigpLCBFUlJfQURNSU5fT05MWSkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDAyCiAgICAvLyBpZiAoIXRoaXMuZXhlY3V0aW9ucyhsZWFzZSkuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJueiBhcmM1OF9hZGRFeGVjdXRpb25LZXlfZWxzZV9ib2R5QDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwMy0xNDA3CiAgICAvLyB0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlID0gewogICAgLy8gICBncm91cHM6IGNsb25lKGdyb3VwcyksCiAgICAvLyAgIGZpcnN0VmFsaWQsCiAgICAvLyAgIGxhc3RWYWxpZAogICAgLy8gfQogICAgZGlnIDMKICAgIGl0b2IKICAgIHB1c2hieXRlcyAweDAwMTIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBzd2FwCiAgICBib3hfcHV0CgphcmM1OF9hZGRFeGVjdXRpb25LZXlfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGxhc3RVc2VySW50ZXJhY3Rpb24gPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNMYXN0VXNlckludGVyYWN0aW9uIH0pCiAgICBieXRlY18yIC8vICJsYXN0X3VzZXJfaW50ZXJhY3Rpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4NgogICAgLy8gdGhpcy5sYXN0VXNlckludGVyYWN0aW9uLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQzCiAgICAvLyBsYXN0Q2hhbmdlID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdENoYW5nZSB9KQogICAgYnl0ZWMgNiAvLyAibGFzdF9jaGFuZ2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gdGhpcy5sYXN0Q2hhbmdlLnZhbHVlID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwMAogICAgLy8gYXJjNThfYWRkRXhlY3V0aW9uS2V5KGxlYXNlOiBieXRlczwzMj4sIGdyb3VwczogYnl0ZXM8MzI+W10sIGZpcnN0VmFsaWQ6IHVpbnQ2NCwgbGFzdFZhbGlkOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFyYzU4X2FkZEV4ZWN1dGlvbktleV9lbHNlX2JvZHlAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQwOQogICAgLy8gYXNzZXJ0KHRoaXMuZXhlY3V0aW9ucyhsZWFzZSkudmFsdWUuZmlyc3RWYWxpZCA9PT0gZmlyc3RWYWxpZCwgRVJSX0VYRUNVVElPTl9LRVlfVVBEQVRFX01VU1RfTUFUQ0hfRklSU1RfVkFMSUQpCiAgICBkaWcgMgogICAgZHVwCiAgICBpbnRjXzIgLy8gMgogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkaWcgNQogICAgPT0KICAgIGFzc2VydCAvLyBleGVjdXRpb24ga2V5IHVwZGF0ZSBtdXN0IG1hdGNoIGZpcnN0IHZhbGlkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MTAKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlLmxhc3RWYWxpZCA9PT0gbGFzdFZhbGlkLCBFUlJfRVhFQ1VUSU9OX0tFWV9VUERBVEVfTVVTVF9NQVRDSF9MQVNUX1ZBTElEKQogICAgZHVwCiAgICBwdXNoaW50IDEwIC8vIDEwCiAgICBpbnRjXzMgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIHVuY292ZXIgMwogICAgPT0KICAgIGFzc2VydCAvLyBleGVjdXRpb24ga2V5IHVwZGF0ZSBtdXN0IG1hdGNoIGxhc3QgdmFsaWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxMgogICAgLy8gdGhpcy5leGVjdXRpb25zKGxlYXNlKS52YWx1ZS5ncm91cHMgPSBbLi4uY2xvbmUodGhpcy5leGVjdXRpb25zKGxlYXNlKS52YWx1ZS5ncm91cHMpLCAuLi5jbG9uZShncm91cHMpXQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMQogICAgbGVuCiAgICBkaWcgMgogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgdW5jb3ZlciA0CiAgICBleHRyYWN0IDIgMAogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBkdXAKICAgIGV4dHJhY3QgMiAwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIC8KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICB1bmNvdmVyIDIKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDMKICAgIGV4dHJhY3QzCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBib3hfZGVsCiAgICBwb3AKICAgIGJveF9wdXQKICAgIGIgYXJjNThfYWRkRXhlY3V0aW9uS2V5X2FmdGVyX2lmX2Vsc2VANAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxOQogICAgLy8gYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5KGxlYXNlOiBieXRlczwzMj4pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIwCiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKGxlYXNlKS5leGlzdHMsIEVSUl9FWEVDVVRJT05fS0VZX05PVF9GT1VORCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEV4ZWN1dGlvbiBrZXkgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MjEKICAgIC8vIGFzc2VydCh0aGlzLmlzQWRtaW4oKSB8fCB0aGlzLmV4ZWN1dGlvbnMobGVhc2UpLnZhbHVlLmxhc3RWYWxpZCA8IEdsb2JhbC5yb3VuZCwgRVJSX0FETUlOX09OTFkpCiAgICBjYWxsc3ViIGlzQWRtaW4KICAgIGJueiBhcmM1OF9yZW1vdmVFeGVjdXRpb25LZXlfYm9vbF90cnVlQDMKICAgIGR1cAogICAgcHVzaGludCAxMCAvLyAxMAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBnbG9iYWwgUm91bmQKICAgIDwKICAgIGJ6IGFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleV9ib29sX2ZhbHNlQDQKCmFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleV9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgphcmM1OF9yZW1vdmVFeGVjdXRpb25LZXlfYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDIxCiAgICAvLyBhc3NlcnQodGhpcy5pc0FkbWluKCkgfHwgdGhpcy5leGVjdXRpb25zKGxlYXNlKS52YWx1ZS5sYXN0VmFsaWQgPCBHbG9iYWwucm91bmQsIEVSUl9BRE1JTl9PTkxZKQogICAgYXNzZXJ0IC8vIGFkbWluIG9ubHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQyMwogICAgLy8gdGhpcy5leGVjdXRpb25zKGxlYXNlKS5kZWxldGUoKQogICAgZHVwCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MwogICAgLy8gbGFzdENoYW5nZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0xhc3RDaGFuZ2UgfSkKICAgIGJ5dGVjIDYgLy8gImxhc3RfY2hhbmdlIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTAKICAgIC8vIHRoaXMubGFzdENoYW5nZS52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MTkKICAgIC8vIGFyYzU4X3JlbW92ZUV4ZWN1dGlvbktleShsZWFzZTogYnl0ZXM8MzI+KTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgphcmM1OF9yZW1vdmVFeGVjdXRpb25LZXlfYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgYXJjNThfcmVtb3ZlRXhlY3V0aW9uS2V5X2Jvb2xfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2dldEFkbWluW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfZ2V0QWRtaW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MzcKICAgIC8vIHJldHVybiB0aGlzLmFkbWluLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxNSAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0MzcKICAgIC8vIHJldHVybiB0aGlzLmFkbWluLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDM1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9nZXRQbHVnaW5zW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfZ2V0UGx1Z2luczoKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NDAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDQyCiAgICAvLyBsZXQgcGx1Z2luczogUGx1Z2luSW5mb1tdID0gW10KICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NDMKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYXJjNThfZ2V0UGx1Z2luc193aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0MwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyAyCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGR1cAogICAgYnVyeSA1CiAgICBkaWcgMQogICAgPgogICAgYnogYXJjNThfZ2V0UGx1Z2luc19hZnRlcl93aGlsZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NDQKICAgIC8vIGlmICh0aGlzLnBsdWdpbnMoa2V5c1tpXSkuZXhpc3RzKSB7CiAgICBkaWcgMgogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBkaWcgMQogICAgc3dhcAogICAgZXh0cmFjdF91aW50MTYKICAgIHVuY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGR1cAogICAgYnVyeSA0CiAgICBkaWcgNgogICAgZGlnIDEKICAgIC0gLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkaWcgMwogICAgbGVuCiAgICB1bmNvdmVyIDIKICAgIGludGNfMiAvLyAyCiAgICAqCiAgICBkaWcgNAogICAgc3dhcAogICAgZXh0cmFjdF91aW50MTYKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBzdWJzdHJpbmczCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0NAogICAgLy8gaWYgKHRoaXMucGx1Z2lucyhrZXlzW2ldKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0UGx1Z2luc19hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0NQogICAgLy8gcGx1Z2lucy5wdXNoKHRoaXMucGx1Z2lucyhrZXlzW2ldKS52YWx1ZSkKICAgIGRpZyA0CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZGlnIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgYnl0ZWMgMTQgLy8gMHgwMDAyCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDQ2CiAgICAvLyBjb250aW51ZQogICAgYiBhcmM1OF9nZXRQbHVnaW5zX3doaWxlX3RvcEAyCgphcmM1OF9nZXRQbHVnaW5zX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ0OAogICAgLy8gcGx1Z2lucy5wdXNoKGVtcHR5UGx1Z2luSW5mbygpKQogICAgY2FsbHN1YiBlbXB0eVBsdWdpbkluZm8KICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIGJ5dGVjIDE0IC8vIDB4MDAwMgogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIGNvdmVyIDIKICAgIGludGNfMSAvLyAxCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50CiAgICBidXJ5IDIKICAgIGIgYXJjNThfZ2V0UGx1Z2luc193aGlsZV90b3BAMgoKYXJjNThfZ2V0UGx1Z2luc19hZnRlcl93aGlsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDQwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0TmFtZWRQbHVnaW5zW3JvdXRpbmddKCkgLT4gdm9pZDoKYXJjNThfZ2V0TmFtZWRQbHVnaW5zOgogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDUzCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1NQogICAgLy8gbGV0IHBsdWdpbnM6IFBsdWdpbkluZm9bXSA9IFtdCiAgICBieXRlYyA3IC8vIDB4MDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDU2CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9nZXROYW1lZFBsdWdpbnNfd2hpbGVfdG9wQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NTYKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZGlnIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgID4KICAgIGR1cAogICAgYnVyeSA1CiAgICBieiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfYWZ0ZXJfd2hpbGVAOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDU3CiAgICAvLyBpZiAodGhpcy5uYW1lZFBsdWdpbnMobmFtZXNbaV0pLmV4aXN0cykgewogICAgZGlnIDIKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgNAogICAgYXNzZXJ0IC8vIGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkaWcgMQogICAgaW50Y18yIC8vIDIKICAgICoKICAgIGRpZyAxCiAgICBzd2FwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwMgogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBleHRyYWN0MwogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY0CiAgICAvLyBuYW1lZFBsdWdpbnMgPSBCb3hNYXA8c3RyaW5nLCBQbHVnaW5LZXk+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhOYW1lZFBsdWdpbnMgfSk7CiAgICBieXRlYyAxNyAvLyAibiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1NwogICAgLy8gaWYgKHRoaXMubmFtZWRQbHVnaW5zKG5hbWVzW2ldKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0TmFtZWRQbHVnaW5zX2FmdGVyX2lmX2Vsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDU4CiAgICAvLyBjb25zdCBuYW1lS2V5ID0gY2xvbmUodGhpcy5uYW1lZFBsdWdpbnMobmFtZXNbaV0pLnZhbHVlKQogICAgZGlnIDUKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcGx1Z2lucyA9IEJveE1hcDxQbHVnaW5LZXksIFBsdWdpbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhQbHVnaW5zIH0pOwogICAgYnl0ZWNfMyAvLyAicCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1OQogICAgLy8gaWYgKHRoaXMucGx1Z2lucyhuYW1lS2V5KS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0TmFtZWRQbHVnaW5zX2FmdGVyX2lmX2Vsc2VANgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDYwCiAgICAvLyBwbHVnaW5zLnB1c2godGhpcy5wbHVnaW5zKG5hbWVLZXkpLnZhbHVlKQogICAgZGlnIDQKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHN3YXAKICAgIGV4dHJhY3QgMiAwCiAgICBieXRlYyAxNCAvLyAweDAwMDIKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICBjb3ZlciAyCiAgICBpbnRjXzEgLy8gMQogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2R5bmFtaWNfZWxlbWVudAogICAgYnVyeSAyCgphcmM1OF9nZXROYW1lZFBsdWdpbnNfYmxvY2tAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ1NgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYXJjNThfZ2V0TmFtZWRQbHVnaW5zX3doaWxlX3RvcEAyCgphcmM1OF9nZXROYW1lZFBsdWdpbnNfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDYzCiAgICAvLyBwbHVnaW5zLnB1c2goZW1wdHlQbHVnaW5JbmZvKCkpCiAgICBjYWxsc3ViIGVtcHR5UGx1Z2luSW5mbwogICAgZGlnIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBzd2FwCiAgICBleHRyYWN0IDIgMAogICAgYnl0ZWMgMTQgLy8gMHgwMDAyCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgY292ZXIgMgogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDY0CiAgICAvLyBjb250aW51ZQogICAgYiBhcmM1OF9nZXROYW1lZFBsdWdpbnNfYmxvY2tAOAoKYXJjNThfZ2V0TmFtZWRQbHVnaW5zX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ2NgogICAgLy8gcGx1Z2lucy5wdXNoKGVtcHR5UGx1Z2luSW5mbygpKQogICAgY2FsbHN1YiBlbXB0eVBsdWdpbkluZm8KICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIGJ5dGVjIDE0IC8vIDB4MDAwMgogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIGNvdmVyIDIKICAgIGludGNfMSAvLyAxCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50CiAgICBidXJ5IDIKICAgIGIgYXJjNThfZ2V0TmFtZWRQbHVnaW5zX2Jsb2NrQDgKCmFyYzU4X2dldE5hbWVkUGx1Z2luc19hZnRlcl93aGlsZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDUzCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgZGlnIDIKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfZ2V0RXNjcm93c1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmFyYzU4X2dldEVzY3Jvd3M6CiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDcxCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3MwogICAgLy8gbGV0IHJlc3VsdDogRXNjcm93SW5mb1tdID0gW10KICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NzQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBlc2Nyb3dzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYXJjNThfZ2V0RXNjcm93c193aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGVzY3Jvd3MubGVuZ3RoOyBpICs9IDEpIHsKICAgIGRpZyAyCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICA+CiAgICBkdXAKICAgIGJ1cnkgNQogICAgYnogYXJjNThfZ2V0RXNjcm93c19hZnRlcl93aGlsZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NzUKICAgIC8vIGlmICh0aGlzLmVzY3Jvd3MoZXNjcm93c1tpXSkuZXhpc3RzKSB7CiAgICBkaWcgMgogICAgZXh0cmFjdCAyIDAKICAgIGRpZyA0CiAgICBhc3NlcnQgLy8gaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGRpZyAxCiAgICBpbnRjXzIgLy8gMgogICAgKgogICAgZGlnIDEKICAgIHN3YXAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGV4dHJhY3QzCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3NQogICAgLy8gaWYgKHRoaXMuZXNjcm93cyhlc2Nyb3dzW2ldKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0RXNjcm93c19hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3NgogICAgLy8gcmVzdWx0LnB1c2godGhpcy5lc2Nyb3dzKGVzY3Jvd3NbaV0pLnZhbHVlKQogICAgZGlnIDQKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgoKYXJjNThfZ2V0RXNjcm93c19ibG9ja0A2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgZXNjcm93cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGFyYzU4X2dldEVzY3Jvd3Nfd2hpbGVfdG9wQDIKCmFyYzU4X2dldEVzY3Jvd3NfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc5CiAgICAvLyByZXN1bHQucHVzaChlbXB0eUVzY3Jvd0luZm8oKSkKICAgIGRpZyAxCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjIxLTI0CiAgICAvLyByZXR1cm4gewogICAgLy8gICBpZDogMCwKICAgIC8vICAgbG9ja2VkOiBmYWxzZQogICAgLy8gfTsKICAgIHB1c2hieXRlcyAweDAwMDAwMDAwMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDc5CiAgICAvLyByZXN1bHQucHVzaChlbXB0eUVzY3Jvd0luZm8oKSkKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXRFc2Nyb3dzX2Jsb2NrQDYKCmFyYzU4X2dldEVzY3Jvd3NfYWZ0ZXJfd2hpbGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2dldEFsbG93YW5jZXNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXRBbGxvd2FuY2VzOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4NAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGludGNfMyAvLyA4CiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDg2CiAgICAvLyBsZXQgcmVzdWx0OiBBbGxvd2FuY2VJbmZvW10gPSBbXQogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIGJ5dGVjIDcgLy8gMHgwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0ODcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgphcmM1OF9nZXRBbGxvd2FuY2VzX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDg3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGRpZyA0CiAgICA8CiAgICBieiBhcmM1OF9nZXRBbGxvd2FuY2VzX2FmdGVyX3doaWxlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4OAogICAgLy8gY29uc3Qga2V5OiBBbGxvd2FuY2VLZXkgPSB7IGVzY3JvdywgYXNzZXQ6IGFzc2V0c1tpXSB9CiAgICBkaWcgNAogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZGlnIDYKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlYyAxMiAvLyAweDAwMGEKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY4CiAgICAvLyBhbGxvd2FuY2VzID0gQm94TWFwPEFsbG93YW5jZUtleSwgQWxsb3dhbmNlSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEFsbG93YW5jZXMgfSkgLy8gMzhfNTAwCiAgICBieXRlYyAxMyAvLyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBidXJ5IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4OQogICAgLy8gaWYgKHRoaXMuYWxsb3dhbmNlcyhrZXkpLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBhcmM1OF9nZXRBbGxvd2FuY2VzX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDkwCiAgICAvLyByZXN1bHQucHVzaCh0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZSkKICAgIGRpZyA2CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZGlnIDIKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBidXJ5IDIKCmFyYzU4X2dldEFsbG93YW5jZXNfYmxvY2tANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4NwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGFyYzU4X2dldEFsbG93YW5jZXNfd2hpbGVfdG9wQDIKCmFyYzU4X2dldEFsbG93YW5jZXNfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvdXRpbHMudHM6MjkKICAgIC8vIHR5cGU6IHVpbnQ4KDApLAogICAgaW50Y18wIC8vIDAKICAgIGNhbGxzdWIgdWludDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L3V0aWxzLnRzOjI4LTM3CiAgICAvLyByZXR1cm4gewogICAgLy8gICB0eXBlOiB1aW50OCgwKSwKICAgIC8vICAgbWF4OiAwLAogICAgLy8gICBhbW91bnQ6IDAsCiAgICAvLyAgIHNwZW50OiAwLAogICAgLy8gICBpbnRlcnZhbDogMCwKICAgIC8vICAgbGFzdDogMCwKICAgIC8vICAgc3RhcnQ6IDAsCiAgICAvLyAgIHVzZVJvdW5kczogZmFsc2UKICAgIC8vIH07CiAgICBkaWcgMwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ5MwogICAgLy8gcmVzdWx0LnB1c2goZW1wdHlBbGxvd2FuY2VJbmZvKCkpCiAgICBkaWcgMgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXRBbGxvd2FuY2VzX2Jsb2NrQDYKCmFyYzU4X2dldEFsbG93YW5jZXNfYWZ0ZXJfd2hpbGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4NAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2dldEV4ZWN1dGlvbnNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXRFeGVjdXRpb25zOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ5OAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4WzMyXVtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTAwCiAgICAvLyBsZXQgcmVzdWx0OiBFeGVjdXRpb25JbmZvW10gPSBbXQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUwMQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGxlYXNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCmFyYzU4X2dldEV4ZWN1dGlvbnNfd2hpbGVfdG9wQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MDEKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBsZWFzZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgZGlnIDMKICAgIDwKICAgIGJ6IGFyYzU4X2dldEV4ZWN1dGlvbnNfYWZ0ZXJfd2hpbGVANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTAyCiAgICAvLyBpZiAodGhpcy5leGVjdXRpb25zKGxlYXNlc1tpXSkuZXhpc3RzKSB7CiAgICBkaWcgMwogICAgZXh0cmFjdCAyIDAKICAgIGRpZyAxCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICAqCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MDIKICAgIC8vIGlmICh0aGlzLmV4ZWN1dGlvbnMobGVhc2VzW2ldKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0RXhlY3V0aW9uc19hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUwMwogICAgLy8gcmVzdWx0LnB1c2godGhpcy5leGVjdXRpb25zKGxlYXNlc1tpXSkudmFsdWUpCiAgICBkaWcgNAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIGJ5dGVjIDE0IC8vIDB4MDAwMgogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIGNvdmVyIDIKICAgIGludGNfMSAvLyAxCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfZHluYW1pY19lbGVtZW50CiAgICBidXJ5IDIKCmFyYzU4X2dldEV4ZWN1dGlvbnNfYmxvY2tANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUwMQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGxlYXNlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGFyYzU4X2dldEV4ZWN1dGlvbnNfd2hpbGVfdG9wQDIKCmFyYzU4X2dldEV4ZWN1dGlvbnNfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTA2CiAgICAvLyByZXN1bHQucHVzaChlbXB0eUV4ZWN1dGlvbkluZm8oKSkKICAgIGRpZyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgc3dhcAogICAgZXh0cmFjdCAyIDAKICAgIGludGNfMSAvLyAxCiAgICBwdXNoYnl0ZXMgMHgwMDAyMDAxMjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAogICAgY2FsbHN1YiBkeW5hbWljX2FycmF5X2NvbmNhdF9keW5hbWljX2VsZW1lbnQKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXRFeGVjdXRpb25zX2Jsb2NrQDYKCmFyYzU4X2dldEV4ZWN1dGlvbnNfYWZ0ZXJfd2hpbGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ5OAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X2dldERvbWFpbktleXNbcm91dGluZ10oKSAtPiB2b2lkOgphcmM1OF9nZXREb21haW5LZXlzOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxMQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4WzMyXVtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTEzCiAgICAvLyBsZXQgcmVzdWx0OiBzdHJpbmdbXSA9IFtdCiAgICBieXRlYyA3IC8vIDB4MDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTE0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYWRkcmVzc2VzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYXJjNThfZ2V0RG9tYWluS2V5c193aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxNAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFkZHJlc3Nlcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZHVwCiAgICBkaWcgMwogICAgPAogICAgYnogYXJjNThfZ2V0RG9tYWluS2V5c19hZnRlcl93aGlsZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MTUKICAgIC8vIGlmICh0aGlzLmRvbWFpbktleXMoYWRkcmVzc2VzW2ldKS5leGlzdHMpIHsKICAgIGRpZyAzCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICoKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgYnl0ZWMgMTggLy8gImQiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MTUKICAgIC8vIGlmICh0aGlzLmRvbWFpbktleXMoYWRkcmVzc2VzW2ldKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogYXJjNThfZ2V0RG9tYWluS2V5c19hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxNgogICAgLy8gcmVzdWx0LnB1c2godGhpcy5kb21haW5LZXlzKGFkZHJlc3Nlc1tpXSkudmFsdWUpCiAgICBkaWcgNAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBkaWcgMgogICAgc3dhcAogICAgaW50Y18xIC8vIDEKICAgIGNhbGxzdWIgZHluYW1pY19hcnJheV9jb25jYXRfYnl0ZV9sZW5ndGhfaGVhZAogICAgYnVyeSAyCgphcmM1OF9nZXREb21haW5LZXlzX2Jsb2NrQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1MTQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhZGRyZXNzZXMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ1cnkgMQogICAgYiBhcmM1OF9nZXREb21haW5LZXlzX3doaWxlX3RvcEAyCgphcmM1OF9nZXREb21haW5LZXlzX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxOQogICAgLy8gcmVzdWx0LnB1c2goIiIpCiAgICBkaWcgMQogICAgYnl0ZWMgNyAvLyAweDAwMDAKICAgIGludGNfMSAvLyAxCiAgICBjYWxsc3ViIGR5bmFtaWNfYXJyYXlfY29uY2F0X2J5dGVfbGVuZ3RoX2hlYWQKICAgIGJ1cnkgMgogICAgYiBhcmM1OF9nZXREb21haW5LZXlzX2Jsb2NrQDYKCmFyYzU4X2dldERvbWFpbktleXNfYWZ0ZXJfd2hpbGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxMQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50Lm1icltyb3V0aW5nXSgpIC0+IHZvaWQ6Cm1icjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUyNAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwNAogICAgLy8gcmV0dXJuIE1pbkVzY3Jvd3NNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhlc2Nyb3cpLmxlbmd0aCk7CiAgICBkaWcgMwogICAgbGVuCiAgICBpbnRjIDQgLy8gNDAwCiAgICAqCiAgICBwdXNoaW50IDY1MDAgLy8gNjUwMAogICAgZGlnIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUzNAogICAgLy8gcGx1Z2luczogdGhpcy5wbHVnaW5zTWJyKGVzY3JvdywgbWV0aG9kQ291bnQpLAogICAgZGlnIDUKICAgIHVuY292ZXIgNQogICAgY2FsbHN1YiBwbHVnaW5zTWJyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwMAogICAgLy8gcmV0dXJuIE1pbk5hbWVkUGx1Z2luTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMobmFtZSkubGVuZ3RoKTsKICAgIHVuY292ZXIgNAogICAgbGVuCiAgICBpbnRjIDQgLy8gNDAwCiAgICAqCiAgICBpbnRjIDUgLy8gMTg5MDAKICAgIGRpZyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIwOAogICAgLy8gcmV0dXJuIE1pbkFsbG93YW5jZU1CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKGVzY3JvdykubGVuZ3RoKTsKICAgIGludGMgNiAvLyAyNzcwMAogICAgdW5jb3ZlciA1CiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIxNgogICAgLy8gcmV0dXJuIE1pbkRvbWFpbktleXNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhkb21haW4pLmxlbmd0aCkKICAgIHB1c2hpbnQgMTU3MDAgLy8gMTU3MDAKICAgIHVuY292ZXIgMwogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMTIKICAgIC8vIHJldHVybiBNaW5FeGVjdXRpb25zTUJSICsgKEJveENvc3RQZXJCeXRlICogKGdyb3VwcyAqIDMyKSk7CiAgICB1bmNvdmVyIDUKICAgIHB1c2hpbnQgMTI4MDAgLy8gMTI4MDAKICAgICoKICAgIHB1c2hpbnQgMjA1MDAgLy8gMjA1MDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjIDUgLy8gImUiCiAgICB1bmNvdmVyIDcKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTQwCiAgICAvLyBlc2Nyb3dFeGlzdHM6IHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywKICAgIGJveF9sZW4KICAgIGNvdmVyIDYKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTQzCiAgICAvLyBHbG9iYWwubWluQmFsYW5jZSArCiAgICBnbG9iYWwgTWluQmFsYW5jZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTQyLTE1NDQKICAgIC8vIE5ld0Nvc3RGb3JBUkM1OCArCiAgICAvLyBHbG9iYWwubWluQmFsYW5jZSArCiAgICAvLyBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIgKwogICAgcHVzaGludCAxNjIxMDAgLy8gMTYyMTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NDItMTU0NQogICAgLy8gTmV3Q29zdEZvckFSQzU4ICsKICAgIC8vIEdsb2JhbC5taW5CYWxhbmNlICsKICAgIC8vIEFSQzU4V2FsbGV0SURzQnlBY2NvdW50c01iciArCiAgICAvLyBlc2Nyb3dzCiAgICBkaWcgNwogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTMzLTE1NDcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHBsdWdpbnM6IHRoaXMucGx1Z2luc01icihlc2Nyb3csIG1ldGhvZENvdW50KSwKICAgIC8vICAgbmFtZWRQbHVnaW5zOiB0aGlzLm5hbWVkUGx1Z2luc01icihwbHVnaW4pLAogICAgLy8gICBlc2Nyb3dzLAogICAgLy8gICBhbGxvd2FuY2VzOiB0aGlzLmFsbG93YW5jZXNNYnIoZXNjcm93KSwKICAgIC8vICAgZG9tYWluS2V5czogdGhpcy5kb21haW5LZXlzTWJyKHBsdWdpbiksCiAgICAvLyAgIGV4ZWN1dGlvbnM6IHRoaXMuZXhlY3V0aW9uc01icihncm91cHMpLAogICAgLy8gICBlc2Nyb3dFeGlzdHM6IHRoaXMuZXNjcm93cyhlc2Nyb3cpLmV4aXN0cywKICAgIC8vICAgbmV3RXNjcm93TWludENvc3Q6ICgKICAgIC8vICAgICBOZXdDb3N0Rm9yQVJDNTggKwogICAgLy8gICAgIEdsb2JhbC5taW5CYWxhbmNlICsKICAgIC8vICAgICBBUkM1OFdhbGxldElEc0J5QWNjb3VudHNNYnIgKwogICAgLy8gICAgIGVzY3Jvd3MKICAgIC8vICAgKQogICAgLy8gfQogICAgdW5jb3ZlciA1CiAgICBpdG9iCiAgICB1bmNvdmVyIDUKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciA2CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgNAogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIGJ5dGVjIDggLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgNAogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTI0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlW3JvdXRpbmddKCkgLT4gdm9pZDoKYmFsYW5jZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDgKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ2NFtdKQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlCiAgICBwb3AKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5wbHVnaW5zTWJyKGVzY3JvdzogYnl0ZXMsIG1ldGhvZENvdW50OiB1aW50NjQpIC0+IHVpbnQ2NDoKcGx1Z2luc01icjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTkzCiAgICAvLyBwcml2YXRlIHBsdWdpbnNNYnIoZXNjcm93OiBzdHJpbmcsIG1ldGhvZENvdW50OiB1aW50NjQpOiB1aW50NjQgewogICAgcHJvdG8gMiAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5NQogICAgLy8gQm94Q29zdFBlckJ5dGUgKiAoKE1ldGhvZFJlc3RyaWN0aW9uQnl0ZUxlbmd0aCAqIG1ldGhvZENvdW50KSArIEJ5dGVzKGVzY3JvdykubGVuZ3RoKQogICAgcHVzaGludCAyMCAvLyAyMAogICAgZnJhbWVfZGlnIC0xCiAgICAqCiAgICBmcmFtZV9kaWcgLTIKICAgIGxlbgogICAgKwogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxOTQKICAgIC8vIHJldHVybiBNaW5QbHVnaW5NQlIgKyAoCiAgICBwdXNoaW50IDM4OTAwIC8vIDM4OTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE5NC0xOTYKICAgIC8vIHJldHVybiBNaW5QbHVnaW5NQlIgKyAoCiAgICAvLyAgIEJveENvc3RQZXJCeXRlICogKChNZXRob2RSZXN0cmljdGlvbkJ5dGVMZW5ndGggKiBtZXRob2RDb3VudCkgKyBCeXRlcyhlc2Nyb3cpLmxlbmd0aCkKICAgIC8vICk7CiAgICArCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5tYXliZU5ld0VzY3Jvdyhlc2Nyb3c6IGJ5dGVzKSAtPiB1aW50NjQ6Cm1heWJlTmV3RXNjcm93OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMTkKICAgIC8vIHByaXZhdGUgbWF5YmVOZXdFc2Nyb3coZXNjcm93OiBzdHJpbmcpOiB1aW50NjQgewogICAgcHJvdG8gMSAxCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjAKICAgIC8vIGlmIChlc2Nyb3cgPT09ICcnKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGJ5dGVjXzEgLy8gIiIKICAgID09CiAgICBieiBtYXliZU5ld0VzY3Jvd19hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjIxCiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIHN3YXAKICAgIHJldHN1YgoKbWF5YmVOZXdFc2Nyb3dfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGVzY3Jvd3MgPSBCb3hNYXA8c3RyaW5nLCBFc2Nyb3dJbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXNjcm93cyB9KQogICAgYnl0ZWMgNSAvLyAiZSIKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjQKICAgIC8vIHJldHVybiB0aGlzLmVzY3Jvd3MoZXNjcm93KS5leGlzdHMKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjQtMjI2CiAgICAvLyByZXR1cm4gdGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzCiAgICAvLyAgID8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQKICAgIC8vICAgOiB0aGlzLm5ld0VzY3Jvdyhlc2Nyb3cpCiAgICBieiBtYXliZU5ld0VzY3Jvd190ZXJuYXJ5X2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjI1CiAgICAvLyA/IHRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlLmlkCiAgICBmcmFtZV9kaWcgMAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAoKbWF5YmVOZXdFc2Nyb3dfdGVybmFyeV9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjQtMjI2CiAgICAvLyByZXR1cm4gdGhpcy5lc2Nyb3dzKGVzY3JvdykuZXhpc3RzCiAgICAvLyAgID8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQKICAgIC8vICAgOiB0aGlzLm5ld0VzY3Jvdyhlc2Nyb3cpCiAgICBzd2FwCiAgICByZXRzdWIKCm1heWJlTmV3RXNjcm93X3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjI2CiAgICAvLyA6IHRoaXMubmV3RXNjcm93KGVzY3JvdykKICAgIGZyYW1lX2RpZyAtMQogICAgY2FsbHN1YiBuZXdFc2Nyb3cKICAgIGIgbWF5YmVOZXdFc2Nyb3dfdGVybmFyeV9tZXJnZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQubmV3RXNjcm93KGVzY3JvdzogYnl0ZXMpIC0+IHVpbnQ2NDoKbmV3RXNjcm93OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMjkKICAgIC8vIHByaXZhdGUgbmV3RXNjcm93KGVzY3Jvdzogc3RyaW5nKTogdWludDY0IHsKICAgIHByb3RvIDEgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzAKICAgIC8vIGlmICh0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICE9PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcykgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjMwCiAgICAvLyBpZiAodGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSAhPT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgIT0KICAgIGJ6IG5ld0VzY3Jvd19hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjMxLTIzNwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuZXNjcm93c01icihlc2Nyb3cpCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMzMKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIzMwogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjM0CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyMDQKICAgIC8vIHJldHVybiBNaW5Fc2Nyb3dzTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMoZXNjcm93KS5sZW5ndGgpOwogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIHB1c2hpbnQgNjUwMCAvLyA2NTAwCiAgICArCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjMxLTIzNgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuZXNjcm93c01icihlc2Nyb3cpCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjIzMS0yMzcKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmVzY3Jvd3NNYnIoZXNjcm93KQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgpuZXdFc2Nyb3dfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNDAtMjUwCiAgICAvLyBjb25zdCBpZCA9IGFiaUNhbGw8dHlwZW9mIEVzY3Jvd0ZhY3RvcnkucHJvdG90eXBlLm5ldz4oewogICAgLy8gICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgIGFwcElkOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgICAgYW1vdW50OiBOZXdDb3N0Rm9yQVJDNTggKyBHbG9iYWwubWluQmFsYW5jZSwKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcwogICAgLy8gICAgIH0pLAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNDUKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0NQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjQ2CiAgICAvLyBhbW91bnQ6IE5ld0Nvc3RGb3JBUkM1OCArIEdsb2JhbC5taW5CYWxhbmNlLAogICAgcHVzaGludCAxNTAwMDAgLy8gMTUwMDAwCiAgICBnbG9iYWwgTWluQmFsYW5jZQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNDcKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmVzY3Jvd0ZhY3RvcnkudmFsdWUuYWRkcmVzcwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTUxCiAgICAvLyBlc2Nyb3dGYWN0b3J5ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNFc2Nyb3dGYWN0b3J5IH0pCiAgICBieXRlYyAyMSAvLyAiZXNjcm93X2ZhY3RvcnkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0NwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI0NC0yNDgKICAgIC8vIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgYW1vdW50OiBOZXdDb3N0Rm9yQVJDNTggKyBHbG9iYWwubWluQmFsYW5jZSwKICAgIC8vICAgcmVjZWl2ZXI6IHRoaXMuZXNjcm93RmFjdG9yeS52YWx1ZS5hZGRyZXNzCiAgICAvLyB9KSwKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjQwLTI1MAogICAgLy8gY29uc3QgaWQgPSBhYmlDYWxsPHR5cGVvZiBFc2Nyb3dGYWN0b3J5LnByb3RvdHlwZS5uZXc+KHsKICAgIC8vICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICBhcHBJZDogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICAgIGFtb3VudDogTmV3Q29zdEZvckFSQzU4ICsgR2xvYmFsLm1pbkJhbGFuY2UsCiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5lc2Nyb3dGYWN0b3J5LnZhbHVlLmFkZHJlc3MKICAgIC8vICAgICB9KSwKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fbmV4dAogICAgcHVzaGJ5dGVzIDB4ZDg1Y2YxODQgLy8gbWV0aG9kICJuZXcocGF5KXVpbnQ2NCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgZ2l0eG4gMSBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWMgNCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI1MgogICAgLy8gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUgPSB7IGlkLCBsb2NrZWQ6IGZhbHNlIH0KICAgIGR1cAogICAgaXRvYgogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjIDUgLy8gImUiCiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNTIKICAgIC8vIHRoaXMuZXNjcm93cyhlc2Nyb3cpLnZhbHVlID0geyBpZCwgbG9ja2VkOiBmYWxzZSB9CiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI1NAogICAgLy8gcmV0dXJuIGlkOwogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuaXNBZG1pbigpIC0+IHVpbnQ2NDoKaXNBZG1pbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYwCiAgICAvLyBUeG4uc2VuZGVyID09PSB0aGlzLmFkbWluLnZhbHVlIHx8CiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjcKICAgIC8vIGFkbWluID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0FkbWluIH0pCiAgICBieXRlYyAxNSAvLyAiYWRtaW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MAogICAgLy8gVHhuLnNlbmRlciA9PT0gdGhpcy5hZG1pbi52YWx1ZSB8fAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MC0yNjEKICAgIC8vIFR4bi5zZW5kZXIgPT09IHRoaXMuYWRtaW4udmFsdWUgfHwKICAgIC8vICh0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikuZXhpc3RzICYmIHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS52YWx1ZSA9PT0gdGhpcy5kb21haW4udmFsdWUpCiAgICBibnogaXNBZG1pbl9ib29sX3RydWVAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgYnl0ZWMgMTggLy8gImQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MQogICAgLy8gKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTgxCiAgICAvLyBkb21haW5LZXlzID0gQm94TWFwPEFjY291bnQsIHN0cmluZz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeERvbWFpbktleXMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNjEKICAgIC8vICh0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikuZXhpc3RzICYmIHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS52YWx1ZSA9PT0gdGhpcy5kb21haW4udmFsdWUpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IGlzQWRtaW5fYm9vbF9mYWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZG9tYWluS2V5cyA9IEJveE1hcDxBY2NvdW50LCBzdHJpbmc+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhEb21haW5LZXlzIH0pCiAgICBieXRlYyAxOCAvLyAiZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjYxCiAgICAvLyAodGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLmV4aXN0cyAmJiB0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikudmFsdWUgPT09IHRoaXMuZG9tYWluLnZhbHVlKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGRvbWFpbktleXMgPSBCb3hNYXA8QWNjb3VudCwgc3RyaW5nPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RG9tYWluS2V5cyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MQogICAgLy8gKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjkKICAgIC8vIGRvbWFpbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0RvbWFpbiB9KTsKICAgIGJ5dGVjIDIwIC8vICJkb21haW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2MQogICAgLy8gKHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS5leGlzdHMgJiYgdGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLnZhbHVlID09PSB0aGlzLmRvbWFpbi52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICA9PQogICAgYnogaXNBZG1pbl9ib29sX2ZhbHNlQDQKCmlzQWRtaW5fYm9vbF90cnVlQDM6CiAgICBpbnRjXzEgLy8gMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNTktMjYyCiAgICAvLyByZXR1cm4gKAogICAgLy8gICBUeG4uc2VuZGVyID09PSB0aGlzLmFkbWluLnZhbHVlIHx8CiAgICAvLyAgICh0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikuZXhpc3RzICYmIHRoaXMuZG9tYWluS2V5cyhUeG4uc2VuZGVyKS52YWx1ZSA9PT0gdGhpcy5kb21haW4udmFsdWUpCiAgICAvLyApCiAgICByZXRzdWIKCmlzQWRtaW5fYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjU5LTI2MgogICAgLy8gcmV0dXJuICgKICAgIC8vICAgVHhuLnNlbmRlciA9PT0gdGhpcy5hZG1pbi52YWx1ZSB8fAogICAgLy8gICAodGhpcy5kb21haW5LZXlzKFR4bi5zZW5kZXIpLmV4aXN0cyAmJiB0aGlzLmRvbWFpbktleXMoVHhuLnNlbmRlcikudmFsdWUgPT09IHRoaXMuZG9tYWluLnZhbHVlKQogICAgLy8gKQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuY2FuUmV2b2tlKCkgLT4gdWludDY0OgpjYW5SZXZva2U6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2NwogICAgLy8gcmV0dXJuIFR4bi5zZW5kZXIgPT09IHRoaXMucmV2b2NhdGlvbi52YWx1ZS5hZGRyZXNzCiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTUKICAgIC8vIHJldm9jYXRpb24gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5UmV2b2NhdGlvbiB9KQogICAgYnl0ZWMgMjIgLy8gInJldm9jYXRpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI2NwogICAgLy8gcmV0dXJuIFR4bi5zZW5kZXIgPT09IHRoaXMucmV2b2NhdGlvbi52YWx1ZS5hZGRyZXNzCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LnBsdWdpbkNhbGxBbGxvd2VkKHBsdWdpbjogdWludDY0LCBjYWxsZXI6IGJ5dGVzLCBlc2Nyb3c6IGJ5dGVzLCBtZXRob2Q6IGJ5dGVzKSAtPiB1aW50NjQ6CnBsdWdpbkNhbGxBbGxvd2VkOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNzAKICAgIC8vIHByaXZhdGUgcGx1Z2luQ2FsbEFsbG93ZWQocGx1Z2luOiB1aW50NjQsIGNhbGxlcjogQWNjb3VudCwgZXNjcm93OiBzdHJpbmcsIG1ldGhvZDogYnl0ZXM8ND4pOiBib29sZWFuIHsKICAgIHByb3RvIDQgMQogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwbiA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI3MQogICAgLy8gY29uc3Qga2V5OiBQbHVnaW5LZXkgPSB7IHBsdWdpbiwgY2FsbGVyLCBlc2Nyb3cgfQogICAgZnJhbWVfZGlnIC00CiAgICBpdG9iCiAgICBmcmFtZV9kaWcgLTMKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC0yCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgMTEgLy8gMHgwMDJhCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHBsdWdpbnMgPSBCb3hNYXA8UGx1Z2luS2V5LCBQbHVnaW5JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4UGx1Z2lucyB9KTsKICAgIGJ5dGVjXzMgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyNzMKICAgIC8vIGlmICghdGhpcy5wbHVnaW5zKGtleSkuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJueiBwbHVnaW5DYWxsQWxsb3dlZF9hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjc0CiAgICAvLyByZXR1cm4gZmFsc2U7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCnBsdWdpbkNhbGxBbGxvd2VkX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjc3CiAgICAvLyBjb25zdCB7IG1ldGhvZHMsIHVzZVJvdW5kcywgbGFzdENhbGxlZCwgY29vbGRvd24sIHVzZUV4ZWN1dGlvbktleSB9ID0gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUgYXMgUmVhZG9ubHk8UGx1Z2luSW5mbz4KICAgIGZyYW1lX2RpZyA2CiAgICBkdXAKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZnJhbWVfYnVyeSAwCiAgICBkdXAKICAgIHB1c2hpbnQgMjcgLy8gMjcKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBmcmFtZV9idXJ5IDUKICAgIGludGNfMiAvLyAyCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHB1c2hpbnQgMjggLy8gMjgKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZnJhbWVfYnVyeSAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI3OQogICAgLy8gaWYgKHVzZUV4ZWN1dGlvbktleSkgewogICAgYnogcGx1Z2luQ2FsbEFsbG93ZWRfYWZ0ZXJfaWZfZWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI4MAogICAgLy8gcmV0dXJuIGZhbHNlCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCnBsdWdpbkNhbGxBbGxvd2VkX2FmdGVyX2lmX2Vsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MjgzCiAgICAvLyBsZXQgbWV0aG9kQWxsb3dlZCA9IG1ldGhvZHMubGVuZ3RoID4gMCA/IGZhbHNlIDogdHJ1ZTsKICAgIGZyYW1lX2RpZyA2CiAgICBwdXNoaW50IDQ0IC8vIDQ0CiAgICBpbnRjXzIgLy8gMgogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgICEKICAgIGZyYW1lX2J1cnkgNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyODQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAyCgpwbHVnaW5DYWxsQWxsb3dlZF93aGlsZV90b3BANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjg0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgbWV0aG9kcy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDYKICAgIHB1c2hpbnQgNDQgLy8gNDQKICAgIGludGNfMiAvLyAyCiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZnJhbWVfZGlnIDIKICAgID4KICAgIGJ6IHBsdWdpbkNhbGxBbGxvd2VkX2Jsb2NrQDEwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI4NQogICAgLy8gaWYgKG1ldGhvZHNbaV0uc2VsZWN0b3IgPT09IG1ldGhvZCkgewogICAgZnJhbWVfZGlnIDIKICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICoKICAgIHB1c2hpbnQgNDYgLy8gNDYKICAgICsKICAgIGZyYW1lX2RpZyA2CiAgICBzd2FwCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICBib3hfZXh0cmFjdAogICAgZXh0cmFjdCAwIDQKICAgIGZyYW1lX2RpZyAtMQogICAgPT0KICAgIGJ6IHBsdWdpbkNhbGxBbGxvd2VkX2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyODYKICAgIC8vIG1ldGhvZEFsbG93ZWQgPSB0cnVlOwogICAgaW50Y18xIC8vIDEKICAgIGZyYW1lX2J1cnkgNAoKcGx1Z2luQ2FsbEFsbG93ZWRfYmxvY2tAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI5MQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZnJhbWVfZGlnIDUKICAgIGJ6IHBsdWdpbkNhbGxBbGxvd2VkX3Rlcm5hcnlfZmFsc2VAMTIKICAgIGdsb2JhbCBSb3VuZAogICAgZnJhbWVfYnVyeSAxCgpwbHVnaW5DYWxsQWxsb3dlZF90ZXJuYXJ5X21lcmdlQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTQKICAgIC8vIGxhc3RDYWxsZWQgPj0gZXBvY2hSZWYgJiYKICAgIGZyYW1lX2RpZyAzCiAgICBmcmFtZV9kaWcgMQogICAgPj0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjk0LTI5NQogICAgLy8gbGFzdENhbGxlZCA+PSBlcG9jaFJlZiAmJgogICAgLy8gKGVwb2NoUmVmIC0gbGFzdENhbGxlZCkgPj0gY29vbGRvd24gJiYKICAgIGJ6IHBsdWdpbkNhbGxBbGxvd2VkX2Jvb2xfZmFsc2VAMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjk1CiAgICAvLyAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA+PSBjb29sZG93biAmJgogICAgZnJhbWVfZGlnIDEKICAgIGZyYW1lX2RpZyAzCiAgICAtCiAgICBmcmFtZV9kaWcgMAogICAgPj0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mjk0LTI5NQogICAgLy8gbGFzdENhbGxlZCA+PSBlcG9jaFJlZiAmJgogICAgLy8gKGVwb2NoUmVmIC0gbGFzdENhbGxlZCkgPj0gY29vbGRvd24gJiYKICAgIGJ6IHBsdWdpbkNhbGxBbGxvd2VkX2Jvb2xfZmFsc2VAMTYKICAgIGludGNfMSAvLyAxCgpwbHVnaW5DYWxsQWxsb3dlZF9ib29sX21lcmdlQDE3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTQtMjk2CiAgICAvLyBsYXN0Q2FsbGVkID49IGVwb2NoUmVmICYmCiAgICAvLyAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA+PSBjb29sZG93biAmJgogICAgLy8gbWV0aG9kQWxsb3dlZAogICAgZnJhbWVfZGlnIDQKICAgICYmCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI5My0yOTcKICAgIC8vIHJldHVybiAoCiAgICAvLyAgIGxhc3RDYWxsZWQgPj0gZXBvY2hSZWYgJiYKICAgIC8vICAgKGVwb2NoUmVmIC0gbGFzdENhbGxlZCkgPj0gY29vbGRvd24gJiYKICAgIC8vICAgbWV0aG9kQWxsb3dlZAogICAgLy8gKQogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCnBsdWdpbkNhbGxBbGxvd2VkX2Jvb2xfZmFsc2VAMTY6CiAgICBpbnRjXzAgLy8gMAogICAgYiBwbHVnaW5DYWxsQWxsb3dlZF9ib29sX21lcmdlQDE3CgpwbHVnaW5DYWxsQWxsb3dlZF90ZXJuYXJ5X2ZhbHNlQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoyOTEKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGZyYW1lX2J1cnkgMQogICAgYiBwbHVnaW5DYWxsQWxsb3dlZF90ZXJuYXJ5X21lcmdlQDEzCgpwbHVnaW5DYWxsQWxsb3dlZF9hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjI4NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAyCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSAyCiAgICBiIHBsdWdpbkNhbGxBbGxvd2VkX3doaWxlX3RvcEA1CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQudHhuUmVrZXlzQmFjayh0eG46IHVpbnQ2NCkgLT4gdWludDY0Ogp0eG5SZWtleXNCYWNrOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDAKICAgIC8vIHByaXZhdGUgdHhuUmVrZXlzQmFjayh0eG46IGd0eG4uVHJhbnNhY3Rpb24pOiBib29sZWFuIHsKICAgIHByb3RvIDEgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDMKICAgIC8vIHR4bi5zZW5kZXIgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgJiYKICAgIGZyYW1lX2RpZyAtMQogICAgZ3R4bnMgU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDMKICAgIC8vIHR4bi5zZW5kZXIgPT09IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUgJiYKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDMtMzA0CiAgICAvLyB0eG4uc2VuZGVyID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICYmCiAgICAvLyB0eG4ucmVrZXlUbyA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGJ6IHR4blJla2V5c0JhY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwNAogICAgLy8gdHhuLnJla2V5VG8gPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBmcmFtZV9kaWcgLTEKICAgIGd0eG5zIFJla2V5VG8KICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMDMtMzA0CiAgICAvLyB0eG4uc2VuZGVyID09PSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlICYmCiAgICAvLyB0eG4ucmVrZXlUbyA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGJ6IHR4blJla2V5c0JhY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwNgogICAgLy8gcmV0dXJuIHRydWU7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0c3ViCgp0eG5SZWtleXNCYWNrX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwCiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA2IC8vIDYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMxMC0zMTEKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgYnogdHhuUmVrZXlzQmFja19ib29sX2ZhbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzExCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBBcHBsaWNhdGlvbklECiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uSUQKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMxMC0zMTEKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgYnogdHhuUmVrZXlzQmFja19ib29sX2ZhbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEyCiAgICAvLyAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMQogICAgZnJhbWVfZGlnIC0xCiAgICBndHhucyBOdW1BcHBBcmdzCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEwLTMxMgogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICAvLyAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMQogICAgYnogdHhuUmVrZXlzQmFja19ib29sX2ZhbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzEzCiAgICAvLyAmJiB0eG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AKICAgIGZyYW1lX2RpZyAtMQogICAgZ3R4bnMgT25Db21wbGV0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMxMC0zMTMKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgLy8gJiYgdHhuLm51bUFwcEFyZ3MgPT09IDEKICAgIC8vICYmIHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcAogICAgYm56IHR4blJla2V5c0JhY2tfYm9vbF9mYWxzZUA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMxNAogICAgLy8gJiYgdHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yKCdhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpdm9pZCcpCiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMCAvLyAwCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgYnl0ZWMgMjUgLy8gbWV0aG9kICJhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpdm9pZCIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMxMC0zMTQKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgLy8gJiYgdHhuLm51bUFwcEFyZ3MgPT09IDEKICAgIC8vICYmIHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcAogICAgLy8gJiYgdHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yKCdhcmM1OF92ZXJpZnlBdXRoQWRkcmVzcygpdm9pZCcpCiAgICBieiB0eG5SZWtleXNCYWNrX2Jvb2xfZmFsc2VAOQogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzA5LTMxNQogICAgLy8gcmV0dXJuICgKICAgIC8vICAgdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICAgJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIC8vICAgJiYgdHhuLm51bUFwcEFyZ3MgPT09IDEKICAgIC8vICAgJiYgdHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wCiAgICAvLyAgICYmIHR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3RvcignYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3MoKXZvaWQnKQogICAgLy8gKQogICAgcmV0c3ViCgp0eG5SZWtleXNCYWNrX2Jvb2xfZmFsc2VAOToKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMwOS0zMTUKICAgIC8vIHJldHVybiAoCiAgICAvLyAgIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAgICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICAvLyAgICYmIHR4bi5udW1BcHBBcmdzID09PSAxCiAgICAvLyAgICYmIHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcAogICAgLy8gICAmJiB0eG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3IoJ2FyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkJykKICAgIC8vICkKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LnBsdWdpbkNoZWNrKGtleTogYnl0ZXMpIC0+IGJ5dGVzLCBieXRlczoKcGx1Z2luQ2hlY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjMzMgogICAgLy8gcHJpdmF0ZSBwbHVnaW5DaGVjayhrZXk6IFBsdWdpbktleSk6IFBsdWdpblZhbGlkYXRpb24gewogICAgcHJvdG8gMSAyCiAgICBieXRlY18xIC8vICIiCiAgICBkdXBuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZnJhbWVfZGlnIC0xCiAgICBjb25jYXQKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMzQKICAgIC8vIGNvbnN0IGV4aXN0cyA9IHRoaXMucGx1Z2lucyhrZXkpLmV4aXN0czsKICAgIGJveF9sZW4KICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzM1CiAgICAvLyBpZiAoIWV4aXN0cykgewogICAgYm56IHBsdWdpbkNoZWNrX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozMzYtMzQxCiAgICAvLyByZXR1cm4gewogICAgLy8gICBleGlzdHM6IGZhbHNlLAogICAgLy8gICBleHBpcmVkOiB0cnVlLAogICAgLy8gICBvbkNvb2xkb3duOiB0cnVlLAogICAgLy8gICBoYXNNZXRob2RSZXN0cmljdGlvbnM6IGZhbHNlLAogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4NjAKICAgIGZyYW1lX2RpZyAtMQogICAgZnJhbWVfYnVyeSAxCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKcGx1Z2luQ2hlY2tfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNDQKICAgIC8vIGNvbnN0IHsgdXNlUm91bmRzLCBsYXN0VmFsaWQsIGNvb2xkb3duLCBsYXN0Q2FsbGVkLCBtZXRob2RzIH0gPSB0aGlzLnBsdWdpbnMoa2V5KS52YWx1ZSBhcyBSZWFkb25seTxQbHVnaW5JbmZvPgogICAgZnJhbWVfZGlnIDMKICAgIGR1cAogICAgcHVzaGludCA5IC8vIDkKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZnJhbWVfYnVyeSAyCiAgICBkdXAKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZnJhbWVfYnVyeSAwCiAgICBkdXAKICAgIHB1c2hpbnQgMjcgLy8gMjcKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgaW50Y18xIC8vIDEKICAgIGdldGJpdAogICAgc3dhcAogICAgcHVzaGludCAyOCAvLyAyOAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9idXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzQ1CiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBieiBwbHVnaW5DaGVja190ZXJuYXJ5X2ZhbHNlQDQKICAgIGdsb2JhbCBSb3VuZAoKcGx1Z2luQ2hlY2tfdGVybmFyeV9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNDkKICAgIC8vIGV4cGlyZWQ6IGVwb2NoUmVmID4gbGFzdFZhbGlkLAogICAgZHVwCiAgICBmcmFtZV9kaWcgMgogICAgPgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNTAKICAgIC8vIG9uQ29vbGRvd246IChlcG9jaFJlZiAtIGxhc3RDYWxsZWQpIDwgY29vbGRvd24sCiAgICBzd2FwCiAgICBmcmFtZV9kaWcgMQogICAgLQogICAgZnJhbWVfZGlnIDAKICAgIDwKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzUxCiAgICAvLyBoYXNNZXRob2RSZXN0cmljdGlvbnM6IG1ldGhvZHMubGVuZ3RoID4gMCwKICAgIGZyYW1lX2RpZyAzCiAgICBwdXNoaW50IDQ0IC8vIDQ0CiAgICBpbnRjXzIgLy8gMgogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGludGNfMCAvLyAwCiAgICA+CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM0Ny0zNTIKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGV4aXN0cywKICAgIC8vICAgZXhwaXJlZDogZXBvY2hSZWYgPiBsYXN0VmFsaWQsCiAgICAvLyAgIG9uQ29vbGRvd246IChlcG9jaFJlZiAtIGxhc3RDYWxsZWQpIDwgY29vbGRvd24sCiAgICAvLyAgIGhhc01ldGhvZFJlc3RyaWN0aW9uczogbWV0aG9kcy5sZW5ndGggPiAwLAogICAgLy8gfQogICAgYnl0ZWMgOCAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfZGlnIDQKICAgIHNldGJpdAogICAgaW50Y18xIC8vIDEKICAgIHVuY292ZXIgNAogICAgc2V0Yml0CiAgICBpbnRjXzIgLy8gMgogICAgdW5jb3ZlciAzCiAgICBzZXRiaXQKICAgIHB1c2hpbnQgMyAvLyAzCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9idXJ5IDEKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgpwbHVnaW5DaGVja190ZXJuYXJ5X2ZhbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM0NQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgYiBwbHVnaW5DaGVja190ZXJuYXJ5X21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luKHBsdWdpbjogdWludDY0LCBnbG9iYWw6IHVpbnQ2NCwgZXNjcm93OiBieXRlcywgbWV0aG9kT2Zmc2V0czogYnl0ZXMsIGZ1bmRzUmVxdWVzdDogYnl0ZXMpIC0+IGJ5dGVzLCBieXRlczoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODAzLTgwOQogICAgLy8gYXJjNThfcmVrZXlUb1BsdWdpbigKICAgIC8vICAgcGx1Z2luOiB1aW50NjQsCiAgICAvLyAgIGdsb2JhbDogYm9vbGVhbiwKICAgIC8vICAgZXNjcm93OiBzdHJpbmcsCiAgICAvLyAgIG1ldGhvZE9mZnNldHM6IHVpbnQ2NFtdLAogICAgLy8gICBmdW5kc1JlcXVlc3Q6IEZ1bmRzUmVxdWVzdFtdCiAgICAvLyApOiB2b2lkIHsKICAgIHByb3RvIDUgMgogICAgaW50Y18wIC8vIDAKICAgIGR1cG4gMTEKICAgIGJ5dGVjXzEgLy8gIiIKICAgIGR1cG4gMjAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODExCiAgICAvLyBjb25zdCBjYWxsZXIgPSBnbG9iYWwgPyBHbG9iYWwuemVyb0FkZHJlc3MgOiBUeG4uc2VuZGVyCiAgICBmcmFtZV9kaWcgLTQKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUAyCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTIKICAgIC8vIGNvbnN0IGtleTogUGx1Z2luS2V5ID0geyBwbHVnaW4sIGNhbGxlciwgZXNjcm93IH0KICAgIGZyYW1lX2RpZyAtNQogICAgaXRvYgogICAgc3dhcAogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTMKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAtMwogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMQogICAgc3dhcAogICAgYnl0ZWMgMTEgLy8gMHgwMDJhCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODE0CiAgICAvLyBhc3NlcnQodGhpcy5wbHVnaW5zKGtleSkuZXhpc3RzLCBFUlJfUExVR0lOX0RPRVNfTk9UX0VYSVNUKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQbHVnaW4gZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ3CiAgICAvLyBjdXJyZW50UGx1Z2luID0gR2xvYmFsU3RhdGU8UGx1Z2luS2V5Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ3VycmVudFBsdWdpbiB9KQogICAgYnl0ZWMgMjQgLy8gImN1cnJlbnRfcGx1Z2luIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MTUKICAgIC8vIHRoaXMuY3VycmVudFBsdWdpbi52YWx1ZSA9IGNsb25lKGtleSkKICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODE2CiAgICAvLyBjb25zdCB7IGVzY3JvdzogZXNjcm93SUQgfSA9IHRoaXMucGx1Z2lucyhrZXkpLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODE4CiAgICAvLyBpZiAoZXNjcm93SUQgIT09IDApIHsKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODIwCiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IHNwZW5kaW5nQXBwLmFkZHJlc3MKICAgIGZyYW1lX2RpZyAxNgogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNDUKICAgIC8vIHNwZW5kaW5nQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MgfSkKICAgIGJ5dGVjIDEwIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MjAKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID0gc3BlbmRpbmdBcHAuYWRkcmVzcwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY2CiAgICAvLyBlc2Nyb3dzID0gQm94TWFwPHN0cmluZywgRXNjcm93SW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEVzY3Jvd3MgfSkKICAgIGJ5dGVjIDUgLy8gImUiCiAgICBmcmFtZV9kaWcgLTMKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NzQKICAgIC8vIGNvbnN0IGVzY3Jvd0lEID0gdGhpcy5lc2Nyb3dzKGVzY3JvdykudmFsdWUuaWQ7CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ3NQogICAgLy8gY29uc3QgZXNjcm93QWRkcmVzcyA9IEFwcGxpY2F0aW9uKGVzY3Jvd0lEKS5hZGRyZXNzOwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgc3dhcAogICAgZnJhbWVfYnVyeSA2CiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ3NwogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGZ1bmRzUmVxdWVzdHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDE4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3doaWxlX3RvcEA2MzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDc3CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgZnVuZHNSZXF1ZXN0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyAxOAogICAgPgogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDgxCiAgICAvLyBhc3NldDogZnVuZHNSZXF1ZXN0c1tpXS5hc3NldAogICAgZnJhbWVfZGlnIC0xCiAgICBleHRyYWN0IDIgMAogICAgZnJhbWVfZGlnIDE4CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICAqCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGR1cAogICAgZnJhbWVfYnVyeSAwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NzktNDgyCiAgICAvLyBjb25zdCBhbGxvd2FuY2VLZXk6IEFsbG93YW5jZUtleSA9IHsKICAgIC8vICAgZXNjcm93LAogICAgLy8gICBhc3NldDogZnVuZHNSZXF1ZXN0c1tpXS5hc3NldAogICAgLy8gfQogICAgaXRvYgogICAgYnl0ZWMgMTIgLy8gMHgwMDBhCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTY4CiAgICAvLyBhbGxvd2FuY2VzID0gQm94TWFwPEFsbG93YW5jZUtleSwgQWxsb3dhbmNlSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEFsbG93YW5jZXMgfSkgLy8gMzhfNTAwCiAgICBieXRlYyAxMyAvLyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTA4CiAgICAvLyBhc3NlcnQodGhpcy5hbGxvd2FuY2VzKGtleSkuZXhpc3RzLCBFUlJfQUxMT1dBTkNFX0RPRVNfTk9UX0VYSVNUKTsKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gYWxsb3dhbmNlIGRvZXMgbm90IGV4aXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUwOQogICAgLy8gY29uc3QgeyB0eXBlLCBzcGVudCwgYW1vdW50LCBsYXN0LCBtYXgsIGludGVydmFsLCBzdGFydCwgdXNlUm91bmRzIH0gPSB0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZQogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIGV4dHJhY3QgMCAxCiAgICBmcmFtZV9idXJ5IDExCiAgICBkdXAKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9idXJ5IDI5CiAgICBkdXAKICAgIHB1c2hpbnQgOSAvLyA5CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAxMgogICAgZHVwCiAgICBwdXNoaW50IDMzIC8vIDMzCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAyMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMjMKICAgIGR1cAogICAgcHVzaGludCAyNSAvLyAyNQogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMTkKICAgIGR1cAogICAgcHVzaGludCA0MSAvLyA0MQogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMzAKICAgIHB1c2hpbnQgMzkyIC8vIDM5MgogICAgZ2V0Yml0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMzEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTEwCiAgICAvLyBjb25zdCBuZXdMYXN0ID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA2NgogICAgZ2xvYmFsIFJvdW5kCiAgICBmcmFtZV9idXJ5IDI3CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VANjc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxMgogICAgLy8gaWYgKHR5cGUgPT09IFNwZW5kQWxsb3dhbmNlVHlwZUZsYXQpIHsKICAgIGZyYW1lX2RpZyAxMQogICAgYnl0ZWMgMTYgLy8gMHgwMQogICAgPT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDY5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxMwogICAgLy8gY29uc3QgbGVmdG92ZXI6IHVpbnQ2NCA9IGFtb3VudCAtIHNwZW50OwogICAgZnJhbWVfZGlnIDEyCiAgICBmcmFtZV9kaWcgMjkKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTE0CiAgICAvLyBhc3NlcnQobGVmdG92ZXIgPj0gZnVuZFJlcXVlc3QuYW1vdW50LCBFUlJfQUxMT1dBTkNFX0VYQ0VFREVEKTsKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIGRpZyAxCiAgICA+PQogICAgYXNzZXJ0IC8vIEFsbG93YW5jZSBleGNlZWRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MTUKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlLnNwZW50ICs9IGZ1bmRSZXF1ZXN0LmFtb3VudAogICAgZnJhbWVfZGlnIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIGV4dHJhY3RfdWludDY0CiAgICArCiAgICBpdG9iCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICBzd2FwCiAgICBib3hfcmVwbGFjZQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDc4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NDAKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlLmxhc3QgPSBuZXdMYXN0CiAgICBmcmFtZV9kaWcgMjcKICAgIGl0b2IKICAgIGZyYW1lX2RpZyAzCiAgICBwdXNoaW50IDMzIC8vIDMzCiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4NgogICAgLy8gaWYgKGZ1bmRzUmVxdWVzdHNbaV0uYXNzZXQgIT09IDApIHsKICAgIGZyYW1lX2RpZyAzMgogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlAODAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDg3LTQ5NAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50LAogICAgLy8gICAgIHhmZXJBc3NldDogZnVuZHNSZXF1ZXN0c1tpXS5hc3NldAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4OQogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDg5CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0OTEKICAgIC8vIGFzc2V0QW1vdW50OiBmdW5kc1JlcXVlc3RzW2ldLmFtb3VudCwKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2RpZyAzMgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGZyYW1lX2RpZyA2CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ4Ny00OTMKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBmdW5kc1JlcXVlc3RzW2ldLmFtb3VudCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGZ1bmRzUmVxdWVzdHNbaV0uYXNzZXQKICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDg3LTQ5NAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IGVzY3Jvd0FkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50LAogICAgLy8gICAgIHhmZXJBc3NldDogZnVuZHNSZXF1ZXN0c1tpXS5hc3NldAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX3N1Ym1pdAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDgxOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NzcKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBmdW5kc1JlcXVlc3RzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgMTgKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBmcmFtZV9idXJ5IDE4CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fd2hpbGVfdG9wQDYzCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA4MDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDk2LTUwMgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiBlc2Nyb3dBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogZnVuZHNSZXF1ZXN0c1tpXS5hbW91bnQKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0OTgKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ5OAogICAgLy8gc2VuZGVyOiB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTAwCiAgICAvLyBhbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50CiAgICBmcmFtZV9kaWcgMAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZnJhbWVfZGlnIDYKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ5Ni01MDEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50CiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ5Ni01MDIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWNlaXZlcjogZXNjcm93QWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGZ1bmRzUmVxdWVzdHNbaV0uYW1vdW50CiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKTsKICAgIGl0eG5fc3VibWl0CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA4MQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlANjk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxNgogICAgLy8gfSBlbHNlIGlmICh0eXBlID09PSBTcGVuZEFsbG93YW5jZVR5cGVXaW5kb3cpIHsKICAgIGZyYW1lX2RpZyAxMQogICAgcHVzaGJ5dGVzIDB4MDIKICAgID09CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA3MwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NDQKICAgIC8vIGlmICh1c2VSb3VuZHMpIHsKICAgIGZyYW1lX2RpZyAzMQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDg0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjU0NQogICAgLy8gcmV0dXJuIEdsb2JhbC5yb3VuZCAtICgoR2xvYmFsLnJvdW5kIC0gc3RhcnQpICUgaW50ZXJ2YWwpCiAgICBnbG9iYWwgUm91bmQKICAgIGR1cAogICAgZnJhbWVfZGlnIDMwCiAgICAtCiAgICBmcmFtZV9kaWcgMTkKICAgICUKICAgIC0KCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5nZXRMYXRlc3RXaW5kb3dTdGFydEA4NToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTE5CiAgICAvLyBpZiAoY3VycmVudFdpbmRvd1N0YXJ0ID4gbGFzdCkgewogICAgZnJhbWVfZGlnIDIxCiAgICA+CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA3MgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MjAKICAgIC8vIGFzc2VydChhbW91bnQgPj0gZnVuZFJlcXVlc3QuYW1vdW50LCBFUlJfQUxMT1dBTkNFX0VYQ0VFREVEKTsKICAgIGZyYW1lX2RpZyAwCiAgICBkdXAKICAgIGV4dHJhY3QgOCA4CiAgICBzd2FwCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2RpZyAxMgogICAgPD0KICAgIGFzc2VydCAvLyBBbGxvd2FuY2UgZXhjZWVkZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTIxCiAgICAvLyB0aGlzLmFsbG93YW5jZXMoa2V5KS52YWx1ZS5zcGVudCA9IGZ1bmRSZXF1ZXN0LmFtb3VudAogICAgZnJhbWVfZGlnIDMKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIHVuY292ZXIgMgogICAgYm94X3JlcGxhY2UKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDc4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA3MjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTI0CiAgICAvLyBjb25zdCBsZWZ0b3ZlcjogdWludDY0ID0gYW1vdW50IC0gc3BlbnQ7CiAgICBmcmFtZV9kaWcgMTIKICAgIGZyYW1lX2RpZyAyOQogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MjUKICAgIC8vIGFzc2VydChsZWZ0b3ZlciA+PSBmdW5kUmVxdWVzdC5hbW91bnQsIEVSUl9BTExPV0FOQ0VfRVhDRUVERUQpOwogICAgZnJhbWVfZGlnIDAKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgZGlnIDEKICAgID49CiAgICBhc3NlcnQgLy8gQWxsb3dhbmNlIGV4Y2VlZGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUyNgogICAgLy8gdGhpcy5hbGxvd2FuY2VzKGtleSkudmFsdWUuc3BlbnQgKz0gZnVuZFJlcXVlc3QuYW1vdW50CiAgICBmcmFtZV9kaWcgMwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgcHVzaGludCAxNyAvLyAxNwogICAgZXh0cmFjdF91aW50NjQKICAgICsKICAgIGl0b2IKICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgIHN3YXAKICAgIGJveF9yZXBsYWNlCiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA3OAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDg0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1NDcKICAgIC8vIHJldHVybiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gKChHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gc3RhcnQpICUgaW50ZXJ2YWwpCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBkdXAKICAgIGZyYW1lX2RpZyAzMAogICAgLQogICAgZnJhbWVfZGlnIDE5CiAgICAlCiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxNwogICAgLy8gY29uc3QgY3VycmVudFdpbmRvd1N0YXJ0ID0gdGhpcy5nZXRMYXRlc3RXaW5kb3dTdGFydCh1c2VSb3VuZHMsIHN0YXJ0LCBpbnRlcnZhbCkKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmdldExhdGVzdFdpbmRvd1N0YXJ0QDg1CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA3MzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTI4CiAgICAvLyB9IGVsc2UgaWYgKHR5cGUgPT09IFNwZW5kQWxsb3dhbmNlVHlwZURyaXApIHsKICAgIGZyYW1lX2RpZyAxMQogICAgcHVzaGJ5dGVzIDB4MDMKICAgID09CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANzgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTI5CiAgICAvLyBjb25zdCBlcG9jaFJlZiA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBmcmFtZV9kaWcgMzEKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA3NgogICAgZ2xvYmFsIFJvdW5kCiAgICBmcmFtZV9idXJ5IDE1CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VANzc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUzMAogICAgLy8gY29uc3QgcGFzc2VkOiB1aW50NjQgPSBlcG9jaFJlZiAtIGxhc3QKICAgIGZyYW1lX2RpZyAxNQogICAgZnJhbWVfZGlnIDIxCiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUzNAogICAgLy8gY29uc3QgYWNjcnVlZDogdWludDY0ID0gc3BlbnQgKyAoKHBhc3NlZCAvIGludGVydmFsKSAqIGFtb3VudCkKICAgIGZyYW1lX2RpZyAxOQogICAgLwogICAgZnJhbWVfZGlnIDEyCiAgICAqCiAgICBmcmFtZV9kaWcgMjkKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTM1CiAgICAvLyBjb25zdCBhdmFpbGFibGU6IHVpbnQ2NCA9IGFjY3J1ZWQgPiBtYXggPyBtYXggOiBhY2NydWVkCiAgICBkdXAKICAgIGZyYW1lX2RpZyAyMwogICAgZHVwCiAgICBjb3ZlciAzCiAgICA+CiAgICBzd2FwCiAgICBjb3ZlciAyCiAgICBzZWxlY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NTM3CiAgICAvLyBhc3NlcnQoYXZhaWxhYmxlID49IGZ1bmRSZXF1ZXN0LmFtb3VudCwgRVJSX0FMTE9XQU5DRV9FWENFRURFRCk7CiAgICBmcmFtZV9kaWcgMAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAyCiAgICA+PQogICAgYXNzZXJ0IC8vIEFsbG93YW5jZSBleGNlZWRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MzgKICAgIC8vIHRoaXMuYWxsb3dhbmNlcyhrZXkpLnZhbHVlLnNwZW50ID0gKGF2YWlsYWJsZSAtIGZ1bmRSZXF1ZXN0LmFtb3VudCkKICAgIC0KICAgIGl0b2IKICAgIGZyYW1lX2RpZyAzCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA3OAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDc2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo1MjkKICAgIC8vIGNvbnN0IGVwb2NoUmVmID0gdXNlUm91bmRzID8gR2xvYmFsLnJvdW5kIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGZyYW1lX2J1cnkgMTUKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDc3CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VANjY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjUxMAogICAgLy8gY29uc3QgbmV3TGFzdCA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBmcmFtZV9idXJ5IDI3CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA2NwoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM2MwogICAgLy8gY29uc3QgeyB1c2VSb3VuZHMsIHVzZUV4ZWN1dGlvbktleSB9ID0gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUKICAgIGZyYW1lX2RpZyAyCiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgIGdldGJpdAogICAgZnJhbWVfYnVyeSAzMQogICAgaW50Y18yIC8vIDIKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjUKICAgIC8vIGlmICh1c2VFeGVjdXRpb25LZXkgJiYgIXRoaXMuaXNBZG1pbigpKSB7CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjkKICAgIGNhbGxzdWIgaXNBZG1pbgogICAgYm56IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAyOQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzY2CiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKFR4bi5sZWFzZSkuZXhpc3RzLCBFUlJfRVhFQ1VUSU9OX0tFWV9OT1RfRk9VTkQpOwogICAgdHhuIExlYXNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzY2CiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKFR4bi5sZWFzZSkuZXhpc3RzLCBFUlJfRVhFQ1VUSU9OX0tFWV9OT1RfRk9VTkQpOwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRXhlY3V0aW9uIGtleSBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGJ5dGVjIDkgLy8gIngiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM2NwogICAgLy8gYXNzZXJ0KHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLnZhbHVlLmZpcnN0VmFsaWQgPD0gR2xvYmFsLnJvdW5kLCBFUlJfRVhFQ1VUSU9OX05PVF9SRUFEWSk7CiAgICB0eG4gTGVhc2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBleGVjdXRpb25zID0gQm94TWFwPGJ5dGVzPDMyPiwgRXhlY3V0aW9uSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeEV4ZWN1dGlvbnMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjcKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS52YWx1ZS5maXJzdFZhbGlkIDw9IEdsb2JhbC5yb3VuZCwgRVJSX0VYRUNVVElPTl9OT1RfUkVBRFkpOwogICAgaW50Y18yIC8vIDIKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZ2xvYmFsIFJvdW5kCiAgICA8PQogICAgYXNzZXJ0IC8vIEV4ZWN1dGlvbiBrZXkgbm90IHJlYWR5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBieXRlYyA5IC8vICJ4IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNjgKICAgIC8vIGFzc2VydCh0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS52YWx1ZS5sYXN0VmFsaWQgPj0gR2xvYmFsLnJvdW5kLCBFUlJfRVhFQ1VUSU9OX0VYUElSRUQpOwogICAgdHhuIExlYXNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzY4CiAgICAvLyBhc3NlcnQodGhpcy5leGVjdXRpb25zKFR4bi5sZWFzZSkudmFsdWUubGFzdFZhbGlkID49IEdsb2JhbC5yb3VuZCwgRVJSX0VYRUNVVElPTl9FWFBJUkVEKTsKICAgIHB1c2hpbnQgMTAgLy8gMTAKICAgIGludGNfMyAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZ2xvYmFsIFJvdW5kCiAgICA+PQogICAgYXNzZXJ0IC8vIEV4ZWN1dGlvbiBrZXkgZXhwaXJlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNzAKICAgIC8vIGV4ZWN1dGlvbnMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBFeGVjdXRpb25JbmZvPih7IGtleVByZWZpeDogQWJzdHJhY3RBY2NvdW50Qm94UHJlZml4RXhlY3V0aW9ucyB9KQogICAgYnl0ZWMgOSAvLyAieCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzcwCiAgICAvLyBjb25zdCBncm91cHMgPSB0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS52YWx1ZS5ncm91cHMgYXMgUmVhZG9ubHk8Ynl0ZXM8MzI+W10+OwogICAgdHhuIExlYXNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBjb25jYXQKICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzIKICAgIC8vIGxldCBmb3VuZEdyb3VwID0gZmFsc2U7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAxNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzMKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDE4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3doaWxlX3RvcEAyNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzczCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgNQogICAgcHVzaGludCAxOCAvLyAxOAogICAgaW50Y18yIC8vIDIKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBmcmFtZV9kaWcgMTgKICAgID4KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfd2hpbGVAMjgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzc0CiAgICAvLyBpZiAoZ3JvdXBzW2ldID09PSBHbG9iYWwuZ3JvdXBJZCkgewogICAgZnJhbWVfZGlnIDE4CiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICAqCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICArCiAgICBmcmFtZV9kaWcgNQogICAgc3dhcAogICAgcHVzaGludCAzMiAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIGdsb2JhbCBHcm91cElECiAgICA9PQogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDI3CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM3NQogICAgLy8gZm91bmRHcm91cCA9IHRydWU7CiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfYnVyeSAxNwoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDI3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozNzMKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAxOAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMTgKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl93aGlsZV90b3BAMjQKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfd2hpbGVAMjg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM3OQogICAgLy8gYXNzZXJ0KGZvdW5kR3JvdXAsIEVSUl9HUk9VUF9OT1RfRk9VTkQpOwogICAgZnJhbWVfZGlnIDE3CiAgICBhc3NlcnQgLy8gR3JvdXAgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBieXRlYyA5IC8vICJ4IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODAKICAgIC8vIHRoaXMuZXhlY3V0aW9ucyhUeG4ubGVhc2UpLmRlbGV0ZSgpOwogICAgdHhuIExlYXNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE3MAogICAgLy8gZXhlY3V0aW9ucyA9IEJveE1hcDxieXRlczwzMj4sIEV4ZWN1dGlvbkluZm8+KHsga2V5UHJlZml4OiBBYnN0cmFjdEFjY291bnRCb3hQcmVmaXhFeGVjdXRpb25zIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzgwCiAgICAvLyB0aGlzLmV4ZWN1dGlvbnMoVHhuLmxlYXNlKS5kZWxldGUoKTsKICAgIGJveF9kZWwKICAgIHBvcAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDI5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozODMKICAgIC8vIGNvbnN0IGluaXRpYWxDaGVjayA9IHRoaXMucGx1Z2luQ2hlY2soa2V5KTsKICAgIGZyYW1lX2RpZyA3CiAgICBjYWxsc3ViIHBsdWdpbkNoZWNrCiAgICBmcmFtZV9idXJ5IDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzg1CiAgICAvLyBhc3NlcnQoaW5pdGlhbENoZWNrLmV4aXN0cywgRVJSX1BMVUdJTl9ET0VTX05PVF9FWElTVCk7CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIGFzc2VydCAvLyBQbHVnaW4gZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzg2CiAgICAvLyBhc3NlcnQoIWluaXRpYWxDaGVjay5leHBpcmVkLCBFUlJfUExVR0lOX0VYUElSRUQpOwogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICAhCiAgICBhc3NlcnQgLy8gcGx1Z2luIGV4cGlyZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzg3CiAgICAvLyBhc3NlcnQoIWluaXRpYWxDaGVjay5vbkNvb2xkb3duLCBFUlJfUExVR0lOX09OX0NPT0xET1dOKTsKICAgIGludGNfMiAvLyAyCiAgICBnZXRiaXQKICAgICEKICAgIGFzc2VydCAvLyBwbHVnaW4gb24gY29vbGRvd24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzg5LTM5MQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMKICAgIC8vICAgPyBHbG9iYWwucm91bmQKICAgIC8vICAgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wOwogICAgZnJhbWVfZGlnIDMxCiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VAMzEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MzkwCiAgICAvLyA/IEdsb2JhbC5yb3VuZAogICAgZ2xvYmFsIFJvdW5kCiAgICBmcmFtZV9idXJ5IDE1CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VAMzI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM5MwogICAgLy8gbGV0IHJla2V5c0JhY2sgPSBmYWxzZTsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDI4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM5NAogICAgLy8gbGV0IG1ldGhvZEluZGV4OiB1aW50NjQgPSAwOwogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMjUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzk2CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAoVHhuLmdyb3VwSW5kZXggKyAxKTsgaSA8IEdsb2JhbC5ncm91cFNpemU7IGkgKz0gMSkgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBmcmFtZV9idXJ5IDIwCiAgICBmcmFtZV9kaWcgNwogICAgZnJhbWVfYnVyeSA4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3doaWxlX3RvcEAzMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6Mzk2CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAoVHhuLmdyb3VwSW5kZXggKyAxKTsgaSA8IEdsb2JhbC5ncm91cFNpemU7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIDIwCiAgICBnbG9iYWwgR3JvdXBTaXplCiAgICA8CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Jsb2NrQDYwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM5OQogICAgLy8gaWYgKHRoaXMudHhuUmVrZXlzQmFjayh0eG4pKSB7CiAgICBmcmFtZV9kaWcgMjAKICAgIGNhbGxzdWIgdHhuUmVrZXlzQmFjawogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDM2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQwMAogICAgLy8gcmVrZXlzQmFjayA9IHRydWU7CiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfYnVyeSAyOAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ibG9ja0A2MDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDMwCiAgICAvLyBhc3NlcnQocmVrZXlzQmFjaywgRVJSX01JU1NJTkdfUkVLRVlfQkFDSyk7CiAgICBmcmFtZV9kaWcgMjgKICAgIGFzc2VydCAvLyBtaXNzaW5nIHJla2V5IGJhY2sKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZnJhbWVfZGlnIDgKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODI5CiAgICAvLyBpZiAodGhpcy5wbHVnaW5zKGtleSkudmFsdWUuY292ZXJGZWVzKSB7CiAgICBwdXNoaW50IDI3IC8vIDI3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIHB1c2hpbnQgMyAvLyAzCiAgICBnZXRiaXQKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fZWxzZV9ib2R5QDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgzMQogICAgLy8gY29uc3QgbWF4RmVlOiB1aW50NjQgPSAoTUFYX0lOTkVSX1RYTl9DT1VOVCArIE1BWF9PVVRFUl9UWE5fQ09VTlQpICogR2xvYmFsLm1pblR4bkZlZQogICAgcHVzaGludCAyNzIgLy8gMjcyCiAgICBnbG9iYWwgTWluVHhuRmVlCiAgICAqCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODMyCiAgICAvLyBjb25zdCByZWltYnVyc2VtZW50ID0gVHhuLmZlZSA8IG1heEZlZSA/IFR4bi5mZWUgOiBtYXhGZWUKICAgIHR4biBGZWUKICAgID4KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUAxMwogICAgdHhuIEZlZQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MzQtODQyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiByZWltYnVyc2VtZW50LAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwICYgcmVpbWJ1cnNpbmcgY2FsbGVyJwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODM2CiAgICAvLyBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMzEKICAgIC8vIGNvbnRyb2xsZWRBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzIH0pOwogICAgYnl0ZWNfMCAvLyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MzYKICAgIC8vIHNlbmRlcjogdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgzNwogICAgLy8gcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgzOQogICAgLy8gcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICBmcmFtZV9kaWcgLTUKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODQwCiAgICAvLyBub3RlOiAncmVrZXlpbmcgdG8gcGx1Z2luIGFwcCAmIHJlaW1idXJzaW5nIGNhbGxlcicKICAgIHB1c2hieXRlcyAicmVrZXlpbmcgdG8gcGx1Z2luIGFwcCAmIHJlaW1idXJzaW5nIGNhbGxlciIKICAgIGl0eG5fZmllbGQgTm90ZQogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MzQtODQxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiByZWltYnVyc2VtZW50LAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwICYgcmVpbWJ1cnNpbmcgY2FsbGVyJwogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MzQtODQyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiByZWltYnVyc2VtZW50LAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwICYgcmVpbWJ1cnNpbmcgY2FsbGVyJwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMTg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0OQogICAgLy8gcmVrZXlJbmRleCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDAsIGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVrZXlJbmRleCB9KQogICAgYnl0ZWMgMTkgLy8gInJla2V5X2luZGV4IgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NTUKICAgIC8vIHRoaXMucmVrZXlJbmRleC52YWx1ZSA9IFR4bi5ncm91cEluZGV4CiAgICB0eG4gR3JvdXBJbmRleAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODU3CiAgICAvLyBpZiAodGhpcy5wbHVnaW5zKGtleSkudmFsdWUuZGVsZWdhdGlvblR5cGUgPT09IERlbGVnYXRpb25UeXBlU2VsZikgewogICAgZnJhbWVfZGlnIDQKICAgIGludGNfMyAvLyA4CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGJ5dGVjIDE2IC8vIDB4MDEKICAgID09CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBsYXN0VXNlckludGVyYWN0aW9uID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzTGFzdFVzZXJJbnRlcmFjdGlvbiB9KQogICAgYnl0ZWNfMiAvLyAibGFzdF91c2VyX2ludGVyYWN0aW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxODYKICAgIC8vIHRoaXMubGFzdFVzZXJJbnRlcmFjdGlvbi52YWx1ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGFwcF9nbG9iYWxfcHV0CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMjA6CiAgICBmcmFtZV9kaWcgLTIKICAgIGZyYW1lX2RpZyAtMQogICAgZnJhbWVfYnVyeSAxCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDEzOgogICAgZnJhbWVfZGlnIDI0CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUAxNAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9lbHNlX2JvZHlAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0NC04NTEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwJwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCk7CiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0NgogICAgLy8gc2VuZGVyOiB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NQogICAgLy8gc3BlbmRpbmdBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcyB9KQogICAgYnl0ZWMgMTAgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0NgogICAgLy8gc2VuZGVyOiB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0OAogICAgLy8gcmVrZXlUbzogcGx1Z2luQXBwLmFkZHJlc3MsCiAgICBmcmFtZV9kaWcgLTUKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODQ5CiAgICAvLyBub3RlOiAncmVrZXlpbmcgdG8gcGx1Z2luIGFwcCcKICAgIHB1c2hieXRlcyAicmVrZXlpbmcgdG8gcGx1Z2luIGFwcCIKICAgIGl0eG5fZmllbGQgTm90ZQogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBkdXAKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjg0NC04NTAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHNlbmRlcjogdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJla2V5VG86IHBsdWdpbkFwcC5hZGRyZXNzLAogICAgLy8gICAgIG5vdGU6ICdyZWtleWluZyB0byBwbHVnaW4gYXBwJwogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4NDQtODUxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBzZW5kZXI6IHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlLAogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICByZWtleVRvOiBwbHVnaW5BcHAuYWRkcmVzcywKICAgIC8vICAgICBub3RlOiAncmVrZXlpbmcgdG8gcGx1Z2luIGFwcCcKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpOwogICAgaXR4bl9zdWJtaXQKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDE4CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAMzY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQwNAogICAgLy8gaWYgKHR4bi50eXBlICE9PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsKSB7CiAgICBmcmFtZV9kaWcgMjAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDYgLy8gNgogICAgIT0KICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUAzOAogICAgZnJhbWVfZGlnIDgKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYmxvY2tANTg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjM5NgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gKFR4bi5ncm91cEluZGV4ICsgMSk7IGkgPCBHbG9iYWwuZ3JvdXBTaXplOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAyMAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMjAKICAgIGZyYW1lX2J1cnkgOAogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3doaWxlX3RvcEAzMwoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDM4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MDgKICAgIC8vIGFzc2VydCh0eG4uYXBwSWQuaWQgPT09IGtleS5wbHVnaW4sIEVSUl9DQU5OT1RfQ0FMTF9PVEhFUl9BUFBTX0RVUklOR19SRUtFWSk7CiAgICBmcmFtZV9kaWcgMjAKICAgIGR1cAogICAgZ3R4bnMgQXBwbGljYXRpb25JRAogICAgZnJhbWVfZGlnIDcKICAgIGR1cAogICAgY292ZXIgMwogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICA9PQogICAgYXNzZXJ0IC8vIGNhbm5vdCBjYWxsIG90aGVyIGFwcHMgZHVyaW5nIHJla2V5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQwOQogICAgLy8gYXNzZXJ0KHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCwgRVJSX0lOVkFMSURfT05DT01QTEVURSk7CiAgICBkdXAKICAgIGd0eG5zIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIGludmFsaWQgb25jb21wbGV0ZSBtdXN0IGJlIG5vIG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQxMgogICAgLy8gYXNzZXJ0KHR4bi5udW1BcHBBcmdzID4gMSwgRVJSX0lOVkFMSURfU0VOREVSX0FSRyk7CiAgICBkdXAKICAgIGd0eG5zIE51bUFwcEFyZ3MKICAgIGludGNfMSAvLyAxCiAgICA+CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzZW5kZXIgbXVzdCBiZSB0aGlzIGFwcCBpZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MTMKICAgIC8vIGFzc2VydChBcHBsaWNhdGlvbihidG9pKHR4bi5hcHBBcmdzKDEpKSkgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZCwgRVJSX0lOVkFMSURfU0VOREVSX1ZBTFVFKTsKICAgIGludGNfMSAvLyAxCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgYnRvaQogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbklECiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2VuZGVyIGFwcCBpZAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MTUKICAgIC8vIGNvbnN0IHsgZXhwaXJlZCwgb25Db29sZG93biwgaGFzTWV0aG9kUmVzdHJpY3Rpb25zIH0gPSB0aGlzLnBsdWdpbkNoZWNrKGtleSk7CiAgICBjYWxsc3ViIHBsdWdpbkNoZWNrCiAgICBmcmFtZV9idXJ5IDcKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgIGdldGJpdAogICAgZGlnIDEKICAgIGludGNfMiAvLyAyCiAgICBnZXRiaXQKICAgIHVuY292ZXIgMgogICAgcHVzaGludCAzIC8vIDMKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MTcKICAgIC8vIGFzc2VydCghZXhwaXJlZCwgRVJSX1BMVUdJTl9FWFBJUkVEKTsKICAgIHVuY292ZXIgMgogICAgIQogICAgYXNzZXJ0IC8vIHBsdWdpbiBleHBpcmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQxOAogICAgLy8gYXNzZXJ0KCFvbkNvb2xkb3duLCBFUlJfUExVR0lOX09OX0NPT0xET1dOKTsKICAgIHN3YXAKICAgICEKICAgIGFzc2VydCAvLyBwbHVnaW4gb24gY29vbGRvd24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDIwCiAgICAvLyBpZiAoaGFzTWV0aG9kUmVzdHJpY3Rpb25zKSB7CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDIxCiAgICAvLyBhc3NlcnQobWV0aG9kSW5kZXggPCBtZXRob2RPZmZzZXRzLmxlbmd0aCwgRVJSX01BTEZPUk1FRF9PRkZTRVRTKTsKICAgIGZyYW1lX2RpZyAtMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBmcmFtZV9kaWcgMjUKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICA8CiAgICBhc3NlcnQgLy8gbWFsZm9ybWVkIG1ldGhvZCBvZmZzZXRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQyMgogICAgLy8gY29uc3QgeyBtZXRob2RBbGxvd2VkLCBtZXRob2RPbkNvb2xkb3duIH0gPSB0aGlzLm1ldGhvZENoZWNrKGtleSwgdHhuLCBtZXRob2RPZmZzZXRzW21ldGhvZEluZGV4XSk7CiAgICBmcmFtZV9kaWcgLTIKICAgIGV4dHJhY3QgMiAwCiAgICBzd2FwCiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDQzCiAgICAvLyBhc3NlcnQobGVuKHR4bi5hcHBBcmdzKDApKSA9PT0gNCwgRVJSX0lOVkFMSURfTUVUSE9EX1NJR05BVFVSRV9MRU5HVEgpCiAgICBmcmFtZV9kaWcgMjAKICAgIGludGNfMCAvLyAwCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDEwCiAgICBsZW4KICAgIHB1c2hpbnQgNCAvLyA0CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbWV0aG9kIHNpZ25hdHVyZSBsZW5ndGgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZnJhbWVfZGlnIDcKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDQ2CiAgICAvLyBjb25zdCB7IHVzZVJvdW5kcyB9ID0gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUKICAgIGR1cAogICAgcHVzaGludCAyNyAvLyAyNwogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBpbnRjXzEgLy8gMQogICAgZ2V0Yml0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGZyYW1lX2J1cnkgMzEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDQ3CiAgICAvLyBjb25zdCB7IHNlbGVjdG9yLCBjb29sZG93biwgbGFzdENhbGxlZCB9ID0gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUubWV0aG9kc1tvZmZzZXRdCiAgICB1bmNvdmVyIDIKICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICoKICAgIGR1cAogICAgZnJhbWVfYnVyeSAxMwogICAgcHVzaGludCA0NiAvLyA0NgogICAgKwogICAgcHVzaGludCAyMCAvLyAyMAogICAgYm94X2V4dHJhY3QKICAgIGR1cAogICAgZXh0cmFjdCAwIDQKICAgIGZyYW1lX2J1cnkgOQogICAgZHVwCiAgICBwdXNoaW50IDQgLy8gNAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMTQKICAgIHB1c2hpbnQgMTIgLy8gMTIKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9idXJ5IDIyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1MQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VANDEKICAgIGdsb2JhbCBSb3VuZAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDQyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NTIKICAgIC8vIGNvbnN0IG1ldGhvZE9uQ29vbGRvd24gPSAoZXBvY2hSZWYgLSBsYXN0Q2FsbGVkKSA8IGNvb2xkb3duCiAgICBmcmFtZV9kaWcgMjIKICAgIC0KICAgIGZyYW1lX2RpZyAxNAogICAgPAogICAgZnJhbWVfYnVyeSAyNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NTQKICAgIC8vIGlmIChzZWxlY3RvciA9PT0gc2VsZWN0b3JBcmcgJiYgKCFoYXNDb29sZG93biB8fCAhbWV0aG9kT25Db29sZG93bikpIHsKICAgIGZyYW1lX2RpZyA5CiAgICBmcmFtZV9kaWcgMTAKICAgID09CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTEKICAgIGZyYW1lX2RpZyAxNAogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9pZl9ib2R5QDQ1CiAgICBmcmFtZV9kaWcgMjYKICAgIGJueiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTEKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5faWZfYm9keUA0NToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDU2CiAgICAvLyBpZiAoaGFzQ29vbGRvd24pIHsKICAgIGZyYW1lX2RpZyAxNAogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDUwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1NwogICAgLy8gY29uc3QgbGFzdENhbGxlZCA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBmcmFtZV9kaWcgMzEKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9mYWxzZUA0OAogICAgZ2xvYmFsIFJvdW5kCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VANDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1OAogICAgLy8gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUubWV0aG9kc1tvZmZzZXRdLmxhc3RDYWxsZWQgPSBsYXN0Q2FsbGVkCiAgICBpdG9iCiAgICBmcmFtZV9kaWcgMTMKICAgIHB1c2hpbnQgNTggLy8gNTgKICAgICsKICAgIGZyYW1lX2RpZyAyCiAgICBzd2FwCiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VANTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ2MS00NjQKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIG1ldGhvZEFsbG93ZWQ6IHRydWUsCiAgICAvLyAgIG1ldGhvZE9uQ29vbGRvd24KICAgIC8vIH0KICAgIHB1c2hieXRlcyAweDgwCiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfZGlnIDI2CiAgICBzZXRiaXQKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5tZXRob2RDaGVja0A1MjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDIyCiAgICAvLyBjb25zdCB7IG1ldGhvZEFsbG93ZWQsIG1ldGhvZE9uQ29vbGRvd24gfSA9IHRoaXMubWV0aG9kQ2hlY2soa2V5LCB0eG4sIG1ldGhvZE9mZnNldHNbbWV0aG9kSW5kZXhdKTsKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgc3dhcAogICAgaW50Y18xIC8vIDEKICAgIGdldGJpdAogICAgZnJhbWVfYnVyeSAyNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjMKICAgIC8vIGFzc2VydChtZXRob2RBbGxvd2VkICYmICFtZXRob2RPbkNvb2xkb3duLCBFUlJfTUVUSE9EX09OX0NPT0xET1dOKTsKICAgIGJ6IHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYm9vbF9mYWxzZUA1NQogICAgZnJhbWVfZGlnIDI2CiAgICBibnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ib29sX2ZhbHNlQDU1CiAgICBpbnRjXzEgLy8gMQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ib29sX21lcmdlQDU2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0MjMKICAgIC8vIGFzc2VydChtZXRob2RBbGxvd2VkICYmICFtZXRob2RPbkNvb2xkb3duLCBFUlJfTUVUSE9EX09OX0NPT0xET1dOKTsKICAgIGFzc2VydCAvLyBtZXRob2Qgb24gY29vbGRvd24KCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fYWZ0ZXJfaWZfZWxzZUA1NzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBwbHVnaW5zID0gQm94TWFwPFBsdWdpbktleSwgUGx1Z2luSW5mbz4oeyBrZXlQcmVmaXg6IEFic3RyYWN0QWNjb3VudEJveFByZWZpeFBsdWdpbnMgfSk7CiAgICBieXRlY18zIC8vICJwIgogICAgZnJhbWVfZGlnIDcKICAgIGR1cAogICAgY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQyNgogICAgLy8gdGhpcy5wbHVnaW5zKGtleSkudmFsdWUubGFzdENhbGxlZCA9IGVwb2NoUmVmCiAgICBmcmFtZV9kaWcgMTUKICAgIGl0b2IKICAgIHB1c2hpbnQgMjggLy8gMjgKICAgIHN3YXAKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQyNwogICAgLy8gbWV0aG9kSW5kZXggKz0gMTsKICAgIGZyYW1lX2RpZyAyNQogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMjUKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ibG9ja0A1OAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ib29sX2ZhbHNlQDU1OgogICAgaW50Y18wIC8vIDAKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9ib29sX21lcmdlQDU2CgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VANDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1NwogICAgLy8gY29uc3QgbGFzdENhbGxlZCA9IHVzZVJvdW5kcyA/IEdsb2JhbC5yb3VuZCA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXA7CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA0OQoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pZl9lbHNlQDUxOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo0NjctNDcwCiAgICAvLyByZXR1cm4gewogICAgLy8gICBtZXRob2RBbGxvd2VkOiBmYWxzZSwKICAgIC8vICAgbWV0aG9kT25Db29sZG93bjogdHJ1ZQogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4NDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6NDIyCiAgICAvLyBjb25zdCB7IG1ldGhvZEFsbG93ZWQsIG1ldGhvZE9uQ29vbGRvd24gfSA9IHRoaXMubWV0aG9kQ2hlY2soa2V5LCB0eG4sIG1ldGhvZE9mZnNldHNbbWV0aG9kSW5kZXhdKTsKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50Lm1ldGhvZENoZWNrQDUyCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfZmFsc2VANDE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1MQogICAgLy8gY29uc3QgZXBvY2hSZWYgPSB1c2VSb3VuZHMgPyBHbG9iYWwucm91bmQgOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmFyYzU4X3Jla2V5VG9QbHVnaW5fdGVybmFyeV9tZXJnZUA0MgoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDMxOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czozOTEKICAgIC8vIDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcDsKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGZyYW1lX2J1cnkgMTUKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X21lcmdlQDMyCgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2Vsc2VfYm9keUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo4MjMKICAgIC8vIHRoaXMuc3BlbmRpbmdBZGRyZXNzLnZhbHVlID0gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyBjb250cm9sbGVkQWRkcmVzcyA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcyB9KTsKICAgIGJ5dGVjXzAgLy8gImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6ODIzCiAgICAvLyB0aGlzLnNwZW5kaW5nQWRkcmVzcy52YWx1ZSA9IHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE0NQogICAgLy8gc3BlbmRpbmdBZGRyZXNzID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcyB9KQogICAgYnl0ZWMgMTAgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgyMwogICAgLy8gdGhpcy5zcGVuZGluZ0FkZHJlc3MudmFsdWUgPSB0aGlzLmNvbnRyb2xsZWRBZGRyZXNzLnZhbHVlCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX2FmdGVyX2lmX2Vsc2VAOAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYXJjNThfcmVrZXlUb1BsdWdpbl90ZXJuYXJ5X2ZhbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjgxMQogICAgLy8gY29uc3QgY2FsbGVyID0gZ2xvYmFsID8gR2xvYmFsLnplcm9BZGRyZXNzIDogVHhuLnNlbmRlcgogICAgdHhuIFNlbmRlcgogICAgYiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5hcmM1OF9yZWtleVRvUGx1Z2luX3Rlcm5hcnlfbWVyZ2VAMwoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2UoYXNzZXRzOiBieXRlcykgLT4gYnl0ZXMsIGJ5dGVzOgpzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTUxLTE1NTIKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgLy8gYmFsYW5jZShhc3NldHM6IHVpbnQ2NFtdKTogdWludDY0W10gewogICAgcHJvdG8gMSAyCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAiIgogICAgZHVwbiAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NTMKICAgIC8vIGxldCBhbW91bnRzOiB1aW50NjRbXSA9IFtdCiAgICBieXRlYyA3IC8vIDB4MDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgYXNzZXRzLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV93aGlsZV90b3BAMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1NAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGFzc2V0cy5sZW5ndGg7IGkgKz0gMSkgewogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyA1CiAgICA+CiAgICBieiBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjpBYnN0cmFjdGVkQWNjb3VudC5iYWxhbmNlX2FmdGVyX3doaWxlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1NQogICAgLy8gbGV0IGFtb3VudDogdWludDY0ID0gMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU2CiAgICAvLyBjb25zdCBhc3NldCA9IEFzc2V0KGFzc2V0c1tpXSkKICAgIGZyYW1lX2RpZyAtMQogICAgZXh0cmFjdCAyIDAKICAgIGZyYW1lX2RpZyA1CiAgICBpbnRjXzMgLy8gOAogICAgKgogICAgZHVwMgogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3QzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgZnJhbWVfYnVyeSAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU1OAogICAgLy8gaWYgKGFzc2V0LmlkID09PSAwKSB7CiAgICBibnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9lbHNlX2JvZHlANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTU5CiAgICAvLyBhbW91bnQgPSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcy5iYWxhbmNlCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgYWNjdF9wYXJhbXNfZ2V0IEFjY3RCYWxhbmNlCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDEKICAgIGFzc2VydCAvLyBhY2NvdW50IGZ1bmRlZAoKc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9hZnRlcl9pZl9lbHNlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NjctMTU3MwogICAgLy8gY29uc3QgZXNjcm93SW5mbyA9IGFiaUNhbGw8dHlwZW9mIFN0YWtpbmcucHJvdG90eXBlLmdldEVzY3Jvd0luZm8+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIC8vICAgICBhc3NldC5pZAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTY4CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxMjUKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBwdXNoYnl0ZXMgImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU2OAogICAgLy8gYXBwSWQ6IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIHB1c2hieXRlcyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTY4CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3MAogICAgLy8gdGhpcy5jb250cm9sbGVkQWRkcmVzcy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gY29udHJvbGxlZEFkZHJlc3MgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MgfSk7CiAgICBieXRlY18wIC8vICJjb250cm9sbGVkX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NzAKICAgIC8vIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTY3LTE1NzMKICAgIC8vIGNvbnN0IGVzY3Jvd0luZm8gPSBhYmlDYWxsPHR5cGVvZiBTdGFraW5nLnByb3RvdHlwZS5nZXRFc2Nyb3dJbmZvPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc3Rha2luZywKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHRoaXMuY29udHJvbGxlZEFkZHJlc3MudmFsdWUsCiAgICAvLyAgICAgYXNzZXQuaWQKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDRjODhlYWNlIC8vIG1ldGhvZCAiZ2V0RXNjcm93SW5mbyhhZGRyZXNzLHVpbnQ2NCkodWludDY0LHVpbnQ2NCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yICh1aW50NjQsdWludDY0KQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTc1CiAgICAvLyBhbW91bnRzID0gWy4uLmFtb3VudHMsIChhbW91bnQgKyBlc2Nyb3dJbmZvLmhhcmQgKyBlc2Nyb3dJbmZvLmxvY2spXQogICAgZHVwCiAgICBwdXNoaW50IDQgLy8gNAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2RpZyAxCiAgICArCiAgICBzd2FwCiAgICBwdXNoaW50IDEyIC8vIDEyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgKwogICAgaXRvYgogICAgYnl0ZWMgMjMgLy8gMHgwMDAxCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGV4dHJhY3QgMiAwCiAgICBmcmFtZV9kaWcgNAogICAgc3dhcAogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBkdXAKICAgIGV4dHJhY3QgMiAwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICAvCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcmVwbGFjZTIgMAogICAgZnJhbWVfYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NTQKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyA1CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfYnVyeSA1CiAgICBiIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2Vfd2hpbGVfdG9wQDEKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2VfZWxzZV9ib2R5QDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvYWNjb3VudC9jb250cmFjdC5hbGdvLnRzOjE1NjEKICAgIC8vIGNvbnN0IFtob2xkaW5nQW1vdW50LCBvcHRlZEluXSA9IEFzc2V0SG9sZGluZy5hc3NldEJhbGFuY2UoR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsIGFzc2V0KQogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGZyYW1lX2RpZyAyCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIHN3YXAKICAgIGZyYW1lX2J1cnkgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czoxNTYyCiAgICAvLyBpZiAob3B0ZWRJbikgewogICAgYnogc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9hZnRlcl9pZl9lbHNlQDcKICAgIGZyYW1lX2RpZyAzCiAgICBmcmFtZV9idXJ5IDEKICAgIGIgc21hcnRfY29udHJhY3RzL2FyYzU4L2FjY291bnQvY29udHJhY3QuYWxnby50czo6QWJzdHJhY3RlZEFjY291bnQuYmFsYW5jZV9hZnRlcl9pZl9lbHNlQDcKCnNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6OkFic3RyYWN0ZWRBY2NvdW50LmJhbGFuY2VfYWZ0ZXJfd2hpbGVAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9hY2NvdW50L2NvbnRyYWN0LmFsZ28udHM6MTU3OAogICAgLy8gcmV0dXJuIGFtb3VudHMKICAgIGZyYW1lX2RpZyA0CiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2J1cnkgMQogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIK", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAHAAECCJAD1JMBtNgBJh0SY29udHJvbGxlZF9hZGRyZXNzABVsYXN0X3VzZXJfaW50ZXJhY3Rpb24BcAQVH3x1AWULbGFzdF9jaGFuZ2UCAAABAAF4EHNwZW5kaW5nX2FkZHJlc3MCACoCAAoBYQIAAgVhZG1pbgEBAW4BZAtyZWtleV9pbmRleAZkb21haW4OZXNjcm93X2ZhY3RvcnkKcmV2b2NhdGlvbgIAAQ5jdXJyZW50X3BsdWdpbgRsw/YGB3ZlcnNpb24Ibmlja25hbWUCACwxGEAABCcTImeABOqRgN02GgCOAQEhMRkURDEYQQEKggkEvWCZ5QR3h4Z9BC13EbcEn5HMzQQX2Ly0BDhWWKsEXvC0FQTSS3VWBBR7bNYnGYIbBMlaXT0ERyevIQRYL/OCBN79XNIE2w1tvQRXpR2IBO70SP0E/7jpGATjULnUBAqMssIEJbcTygTrrxSgBB/aO08EnT+JGAS/TXxXBNXdOCsEXOvtQwTVhoWvBBO8ROQEN971ogRW3BYsBKJAPd8EAv5FFQRBvcaABIgrscIEF2DGUgQSTAp/NhoAjiUB/gJxAosCngK4At4DBAMhAz0DqwPwBG4EzwUYBXMHLweBCAoJ/AqGCrMK+AviDI8NqA6vD2IQDhBGEFIQ4xGWEhYSxhNUE74UXwCABBZlbGY2GgCOAQElADEZgQQSMRgQREICPIoDAYv9IllJi/8ITCQLJAhLARZXBgJOAov9JEsCUov/JAuvUIv9FYv9TwNPAlJQi/5QTCQLSSKLBIsCDEEAI4sDSRZXBgKLAYsESU4ETwJdSYwBSwFZJAgIjAMkCIwEQv/ViwCLAVCMAImKBAEpSYv+JAuL/CQLIosEiwMMQQAci/2LBElOAlmLAggWVwYCiwFMUIwBJAiMBEL/3Iv9FYwAIowEiwSLAgxBAByL/4sESU4CWYsACBZXBgKLAUxQjAEkCIwEQv/ci/yL/ggWVwYCiwFQi/2LA4sAUlCL/xWL/4sCTwJSUIwAiYoBAYv/FkmTJQ5EVwcBiSKI/+0iFklPAlBLAVBLAVCAAwAsAFBLAVBMUCcHUIk2GgFJIlkkCEsBFRJEVwIANhoCSU4CSRWBIBJENhoDSRWBIBJENhoESSJZJAhLARUSRFcCADYaBUkVJRJEF04ENhoGSRUlEkQXTgQ2GgdJIlkkCEsBFRJEVwIATgQ2GghJTgUVgSASRDINREsBSwMTRCcaTwRnJw9PAmcnFExnMgMSQQBBMgooTGcnFUsEZycKMgNnJxZLA2cnG0sCZ4ALZmFjdG9yeV9hcHAyDWeACHJlZmVycmVySwFnKjIHZycGMgdnI0NLBEL/vDYaAUkiWSQISwEVEkRXAgBJIkwpE0EAECcFSwJQSb1FAUS+SCJbRQGxIicVZURJcghEgcResgiyByOyECKyAbZLARaABGB+cEayGrIashiBBrIQIrIBsyNDNhoBSSJZJAhLARUSRFcCAIgS1kQnGkxnI0M2GgFJIlkkCEsBFRJEVwIAiBK8RCcUTGcjQzYaAUkVJRJEF4gSqUQnFkxnI0M2GgFJIlkkCEsBFRJEVwIAiBKPRCcbTGcjQzYaAUkVJRJEF4gSfERJFicXTFCIGNdIJFtEgAZhdmF0YXJMZyNDNhoBSRUlEkQXiBJWREkWJxdMUIgYsUgkW0SABmJhbm5lckxnI0M2GgFJIlkkCEsBFRJEVwIAiBIpRIADYmlvTGcjQzYaAUkVgSASRIgSE0QnD0xnKjIHZycGMgdnI0M2GgFJFYEgEkQiJxhlREkiW0sBgShZSwIVSwNOAlJXAgApEkQxAEsBcghEEkQiKGVEcwJETHIIRBJEK0xQSb1FAUEAJkmBGyO6IlNBABwjRCcPSwJnSSUjuicQEkEABCoyB2cnBjIHZyNDIkL/4SInCmVESXMCTE4CRCIoZUQSQQAsIihlRDIKEkEAIjIDSwESRCcKMgNnMgoiFkxQgAQAKgAAUCcYTGcnEyJnI0MyCkL/2ylJNhoBSRWBIBJENhoCSRUjEkQiU4gROESxIihlRIAbcmVrZXlpbmcgYWJzdHJhY3RlZCBhY2NvdW50sgVLArIgTwKyB7IAI7IQIrIBs0EAHiJFATEWIwhFAksBMgQMQQALSwGIEdlBAAsjRQFJRCoyB2cjQ0sBIwhFAkL/3DYaAUkVJRJEFzYaAkkVIxJEIlM2GgNJTgIVgSASRDYaBEkiWSQISwEVEkRXAgBMNhoFSU4CFYEEEkRBAAxLAzIDSwNLA4gQwEhLA0sDSwNLA4gQtCcIIk8CVCcETFCwI0M2GgFJFSUSRBc2GgJJFSMSRCJTNhoDSSJZJAhLARUSRFcCADYaBEkiWSULJAhLARUSRDYaBUkiWYEQCyQISwEVEkSIEeBGAiNDNhoBSSJZJAhLARUSRFcCADYaAkkVIxJEIlM2GgNJIlkkCEsBFRJEVwIANhoESSJZJQskCEsBFRJENhoFSSJZgRALJAhLARUSRCcRTwVQIiW6F04EiBGFRgIjQyJHAylJNhoBSRUlEkQXNhoCSRWBIBJENhoDSSJZJAhLARUSRFcCADYaBEkVIxJEIlM2GgVHAhUjEkQ2GgZJFSUSRBdMNhoHSRUlEkQXTDYaCElOAkkiWUlOA4EMCyQITBUSRDYaCUkVIxJEIlNMNhoKSRUjEkQiU0w2GgtJFSMSRCJTTDYaDEkVIxJEIlNMiA87RCcQEkEBH0sLMgMSQQEXIxRESwJBAQtLCzIDE0EBAyMURElAAPFLCkURSwwWSwxQSxFJFRZXBgJMUEwnC1BMUCtMUElFE71FARREIhZFEycHRRAiRQ5LDUsFDEEAPUsFVwIASw5JTgKBDAuBDFhJVwAETFcECEsBFYEEEkRQSxRQSxFJTwJQTCJZIwgWVwYCXABFESMIRQ5C/7tLA0EAcDIGRQ8iKGVEMgoTQQAesSIoZUQyCksRIllLE0yIDbWyCLIHsgAjshAisgGzSwqIDbgWSwlQSwgWUEsHFlAnHFAnCCJLDFQjSwZUJEsFVIEDSwRUUEsTUEsPFlBLEFBLEkm8SEy/KjIHZycGMgdnI0MyB0UPQv+NSwopE0QpRRFC/wgiQv76IkL+5jYaAUkVgSASRDYaAkkiWSQISwEVEkRXAgCIDfVEIihlRDIKE0EAHrEiKGVEMgpLAhUhBAuB1HoIsgiyB7IAI7IQIrIBsycSSwJQSbxISwG/I0MpNhoBSRUlEkQXNhoCSRWBIBJENhoDSSJZJAhLARUSRFcCAIgNmUAABogNvUEAViNESwIWSwJQSwFJFRZXBgJMUEwnC1BMUCtMUEm9RQFESYEsJLoXRQW8SCIoZUQyChNBABexIihlREsBSwWIDImyCLIHI7IQIrIBsyoyB2cnBjIHZyNDIkL/pyJHAylJNhoBSSJZJAhLARUSRFcCAEk2GgJJFSUSRBdMNhoDSU4CFYEgEkQ2GgRJIlkkCEsBFRJEVwIATDYaBUkVIxJEIlNMNhoGSU4CSRUjEkQ2GgdJFSUSRBdOAjYaCEkVJRJEF04CNhoJSU4DSSJZSU4EgQwLJAhMFRJENhoKSRUjEkQiU04CNhoLSRUjEkQiU04CNhoMSRUjEkQiU04CNhoNSRUjEkQiU04CiAyGRCcRTwJQSU4CvUUBFEQnEBJBASpLDDIDEkEBIiMUREsDQQEWSwwyAxNBAQ4jFERLAUAA+0sLRRRLDRZLDVBLFEkVFlcGAkxQTCcLUExQSUUUSwFJvEhMvyIWRRUnB0USIkUQSw9LBgxBAD1LBlcCAEsQSU4CgQwLgQxYSVcABExXBAhLARWBBBJEUEsWUEsTSU8CUEwiWSMIFlcGAlwARRMjCEUQQv+7IihlRDIKE0EAKLEiKGVEMgpLEyJZSxZMiAr8SxEVIQQLIQUICLIIsgeyACOyECKyAbNLC4gK9UURSwRBAEQyBksRFksLUEsKFlBLCRZQJxxQJwgiSw5UI0sIVCRLB1SBA0sGVFBLFlBMFlBLElArSxRQSbxITL8qMgdnJwYyB2cjQzIHQv+5SwspE0QpRRRC/v4iQv7vIkL+2yIpNhoBSSJZJAhLARUSRFcCAIgLL0AABogLU0EAaCNEJxFLAVBJvUUBREm+SElFBStMUEm9RQFESYEsJLoXRQRMvEi8SCIoZUQyChNBACyxIihlREsBFSEECyEFCEsESYEoWUsBFVJXAgBLBIgKDgiyCLIHI7IQIrIBsyoyB2cnBjIHZyNDIkL/lTYaAUkiWSQISwEVEkRXAgCICqdEJwVLAVC9RQEUREkpE0SICg8WJwRMULAjQzYaAUkiWSQISwEVEkRXAgCICnpEJwVMUEm9RQFESb5IgUBTFEsBJSO6Ik8CVEsBJU8CuyoyB2cnBjIHZ75IJwRMULAjQyJJKUcENhoBSSJZJAhLARUSRFcCADYaAklOAkkiWUlOA4ERCyQITBUSRCJMIkyIChdEJwVMUEm9RQFEvkgiW3IIRCJJSwUMQQCeSwVXAgBLAYERC4ERWEkiW0lFDEAARCIoZUxFD0RJJVtFCiJFDIGAAVNBAAkiKGVEI0UMRQOxSwpBAARLArIJSwiyCEsMsgdLAbIAI7IQIrIBs0kjCEUBQv+fIihlTEUOREklW0UJIkUIgYABU0EACSIoZUQjRQhFBLFLBkEABEsDshVLCbIRSweyEksLshRLAbIAgQSyECKyAbNC/7QjQzYaAUkiWSQISwEVEkRXAgBJNhoCSU4CSSJZSU4DSSULJAhPAhUSRIgJNEQnBU8CUEm9RQFEvkhJIltyCExJTgNOBESBQFMURLEiKGVEMhBPAwuyCLIAsgcjshAisgGzIklLAwxBAERLA1cCAEsBSU4CJQtbSwZJFRZXBgJMUEsBFicMTFBMUCcNTFC9RQFEsbIRIrISSwJJshSyAIEEshAisgGzIwhFAUL/tSNDIik2GgFJFSUSRBc2GgJJTgJJFYEgEkQ2GgNJIlkkCEsBFRJEVwIANhoESU4ESSJZSU4FJQskCEwVEkQxFiMJSU4EOBAjEkRLAhZPAlBLARUWVwYCSwJQSU4ETCcLUExQK0xQvUUBRCcFTFBJvUUBRL5ISYFAUxREIltMMQBMcghEEkAAEDEASwYSQAAISwUyAxJBAIAjRElyCExJTgJFCkRLA0k4ByIoZURMSwESTwI4CDIQSwhJTgQLEhBEsTIQC7IIsgCyByOyECKyAbMiRQdLBksEDEEAOksEVwIASwdJTgIlC1tJFicMTFBLBFAnDUxQvUUBRLGyESKyEksISbIUsgCBBLIQIrIBsyMIRQdC/74jQyJC/30iRwQpSTYaAUkiWSQISwEVEkRXAgBJNhoCSU4CSSJZSU4DgSILJAhMFRJEiAdqRCcFTFBJvUUBRL5IgUBTFEQiKGVEMgoTQQAgsSIoZUQyCksEFSEECyEGCEsDC7IIsgeyACOyECKyAbMiRQVLBEsBDEEAiEsBVwIASwWBIguBIlhJVwAISwFXCAFFCEsBVwkIRQxLAVcRCEULSwFXGQhFCkyBiAJTSU4CRQZLBEkVFlcGAkxQJwxPAlBMUCcNTFBJRQm9RQEUREEALDIGSwZLClBLC1AiFkxLAVBLClBMUEwWUCcIIksGVFBLB0y/SwQjCEUFQv91MgdC/9EqMgdnJwYyB2cjQyk2GgFJIlkkCEsBFRJEVwIANhoCRwIiWUlOAiULJAhMFRJEiAZrQAAGiAaPQQCAI0QnBUsDUEm9RQFEvkiBQFMURCIoZUQyChNBAByxIihlREsDFSEECyEGCEsCC7IIsgcjshAisgGzIkUESwNLAQxBADFLAVcCAEsESU4CJQslWEsESRUWVwYCTFAnDE8CUExQJw1MUEm9RQFEvEgjCEUEQv/HKjIHZycGMgdnI0MiQv99NhoBSRWBIBJENhoCSU4CSSJZgSALJAhMFRJENhoDSRUlEkQXTgI2GgRJFSUSRBdOAogFqkQnCUxQSU4DvUUBQAAhSwMWgAIAEkxQTwIWUExQSwFJvEhMvyoyB2cnBjIHZyNDSwJJJCW6F0sFEkRJgQoluhdPAxJESb5ISSJZSwEVSwJLAk8CUk8EVwIAUElXAgAVgSAKFlcGAlwATwIiTwNYTFBLAbxIv0L/rDYaAUkVgSASRCcJTFBJvUUBRIgFHUAADEmBCiW6FzIGDEEAECNESbxIKjIHZycGMgdnI0MiQv/tIicPZUQnBExQsCNDIik2GgEnByJLAiJZSUUFSwENQQB0SwJXAgBLAUlOAiQLSwFMWU8CIwhJRQRLBksBCUsDFU8CJAtLBExZTwJNUitMUElFBr1FAUEAH0sEvkRLAkkiWUxXAgAnDk8DUE4CI08DiO/NRQJC/52I8FRLAkkiWUxXAgAnDk8DUE4CI08DiO+vRQJC/38nBEsCULAjQyJJKTYaAScHIksCIllLAQ1JRQVBAJVLAlcCAEsEREsBJAtLAUxZSlkkCFhXAgAnEUxQSUUHvUUBQQBSSwW+RCtMUElFBr1FAUEAJEsEvkRLAkkiWUxXAgAnDk8DUE4CI08DiO89RQJJIwhFAUL/mojvv0sCSSJZTFcCACcOTwNQTgIjTwOI7xpFAkL/2ojvoUsCSSJZTFcCACcOTwNQTgIjTwOI7vxFAkL/vCcESwJQsCNDIik2GgEnByJLAiJZSwENSUUFQQBjSwJXAgBLBERLASQLSwFMWUpZJAhYVwIAJwVMUElFBr1FAUEAH0sEvkRLAklPAlBMIlkjCBZXBgJcAEUCSSMIRQFC/69LAUmACQAAAAAAAAAAAFBMIlkjCBZXBgJcAEUCQv/ZJwRLAlCwI0MiNhoBSSJZJAhLARUSRFcCADYaAkcCIllJTgIlCyQITBUSRCIWJwciSUsEDEEAeUsEVwIASwElCyVYSwZJFRZXBgJMUCcMTwJQTFAnDUxQSUUIvUUBQQAfSwa+REsCSU8CUEwiWSMIFlcGAlwARQJJIwhFAUL/sSKI7nRLA0lOAlBLAVBLAVBLAVBLAVBMUCcIUEsCSU8CUEwiWSMIFlcGAlwARQJC/8cnBEsCULAjQyI2GgFHAiJZSU4CgSALJAhMFRJEJwciSUsDDEEAaEsDVwIASwGBIAuBIFgnCUxQSUUGvUUBQQAkSwS+REsCSSJZTFcCACcOTwNQTgIjTwOI7W1FAkkjCEUBQv+7SwFJIllMVwIAI4AWAAIAEgAAAAAAAAAAAAAAAAAAAAAAAIjtPkUCQv/OJwRLAlCwI0MiNhoBRwIiWUlOAoEgCyQITBUSRCcHIklLAwxBAERLA1cCAEsBgSALgSBYJxJMUElFBr1FAUEAHUsEvkRJFRZXBgJMUEsCTCOI7HxFAkkjCEUBQv/CSwEnByOI7GpFAkL/6ycESwJQsCNDNhoBSSJZJAhLARUSRFcCADYaAkkVJRJEFzYaA0kiWSQISwEVEkRXAgA2GgRJFSUSRBdLAxUhBAuB5DJLAQhLBU8FiAB2TwQVIQQLIQVLAQghBk8FCIHUek8DCE8FgYBkC4GUoAEIJwVPB1C9TgZIMgGBtPIJCEsHCE8FFk8FFlBPBhZQTwQWUE8CFlBPAhZQJwgiTwRUUEwWUCcETFCwI0M2GgFJIlklCyQISwEVEkSIBzRIJwRMULAjQ4oCAYEUi/8Li/4VCCEEC4H0rwIIiYoBASKL/ykSQQADIkyJJwWL/1BJjAC9RQFBAAiLAL5EIltMiYv/iAADQv/2igEBIihlRDIKE0EAHrEiKGVEMgqL/xUhBAuB5DIIsgiyB7IAI7IQIrIBs7EiKGVEgfCTCTIBCCInFWVESXIIRLIHTLIISwGyACOyECKyAbaABNhc8YSyGrIYsgCBBrIQIrIBs7cBPklXBABMVwAEJwQSREkVJRJEF0kWJwhQJwWL/1BMv4kxACInD2VEEkAAGycSMQBQvUUBQQASJxIxAFC+RCInFGVEEkEAAiOJIokxACInFmVEcghEEomKBAEpRwWL/BaL/VCL/hUWVwYCi/5QTCcLUExQK0xQSb1FAUAABCKMAImLBkmBESW6F4wASYEbI7pJI1OMBSRTTIEcJboXjANBAAQijACJiwaBLCS6FxSMBCKMAosGgSwkuheLAg1BABqLAoEUC4EuCIsGTIEUulcABIv/EkEAMSOMBIsFQQAiMgaMAYsDiwEPQQASiwGLAwmLAA9BAAcjiwQQjACJIkL/9jIHjAFC/9uLAiMIjAJC/6KKAQGL/zgAIihlRBJBAAyL/zggMgoSQQACI4mL/zgQgQYSQQAni/84GDIIEkEAHYv/OBsjEkEAFIv/OBlAAA2L/yLCGicZEkEAAiOJIomKAQIpRwIri/9QSb1JTwJIQAAKgAFgi/+MAYwAiYsDSYEJJboXjAJJgREluheMAEmBGyO6I1NMgRwluheMAUEAMDIGSYsCDUyLAQmLAAyLA4EsJLoXIg0nCCKLBFQjTwRUJE8DVIEDTwJUi/+MAYwAiTIHQv/NigUCIkcLKUcUi/xBBJ4yA4v7FkxQi/0VFlcGAov9UEmMAUwnC1BMUEmMBytLAVBJjAJJvUUBRCcYTwJnIiW6F0mMEEEEW4sQcghEJwpMZycFi/1QvkQiW3IITIwGRCKMEov/IlmLEg1BAYeL/1cCAIsSgRALgRBYSYwAIltJjCAWJwxMUIsBUCcNTFBJjANJvUUBRL5ISVcAAYwLSYERW4wdSYEJW4wMSYEhW4wVSSNbjBdJgRlbjBNJgSlbjB6BiANTSYwfQQEiMgaMG4sLJxASQQBuiwyLHQmLACVbTEsBD0SLA0lOAr5EgRFbCBaBEUy7ixsWiwOBIU8Cu4sgQQAmsSIoZUSLACVbiyCyEbISiwayFLIAgQSyECKyAbOLEiMIjBJC/zmxIihlRIsAJVuyCIsGsgeyACOyECKyAbNC/9yLC4ABAhJBAFqLH0EASDIGSYseCYsTGAmLFQ1BABeLAElXCAhMJVuLDA5EiwOBEU8Cu0L/e4sMix0JiwAlW0xLAQ9EiwNJTgK+RIERWwgWgRFMu0L/WjIHSYseCYsTGAlC/7WLC4ABAxJB/0SLH0EAMDIGjA+LD4sVCYsTCosMC4sdCEmLF0lOAw1MTgJNiwAlW0oPRAkWiwOBEU8Cu0L/DzIHjA9C/80yB4wbQv7biwKBGyO6SSNTjB8kU0EAboj8R0AAaCcJMQZQvUUBRCcJMQZQJCW6FzIGDkQnCTEGUIEKJboXMgYPRCcJMQZQjAUijBEijBKLBYESJLoXixINQQAgixKBIAuBFAiLBUyBILoyCxJBAAMjjBGLEiMIjBJC/9OLEUQnCTEGULxIiweI/RWMB0kiU0RJI1MURCRTFESLH0ECETIGjA8ijBwijBkxFiMIjBSLB4wIixQyBAxBAAuLFIj8kkEAzCOMHIscRCuLCFBJjASBGyO6gQNTQQB/gZACMgALSYwYMQENQQBrMQGxIihlRDEAi/tyCESAK3Jla2V5aW5nIHRvIHBsdWdpbiBhcHAgJiByZWltYnVyc2luZyBjYWxsZXKyBbIgTwKyCLIHsgAjshAisgGzJxMxFmeLBCUjuicQEkEABCoyB2eL/ov/jAGMAImLGEL/krEiJwplRIv7cghEgBZyZWtleWluZyB0byBwbHVnaW4gYXBwsgWyIEmyB7IAI7IQIrIBs0L/qIsUOBCBBhNBAA2LCIsUIwiMFIwIQv8NixRJOBiLB0lOAyJbEkRJOBkUREk4GyMNRCPCGhcyCBJEiPvWjAdJI1NLASRTTwKBA1NPAhRETBREQQCji/4iWYsZSU8CDESL/lcCAEwlC1uLFCLCGkmMChWBBBJEK4sHUEmMAkmBGyO6I1NJTgKMH08CgRQLSYwNgS4IgRS6SVcABIwJSYEEW4wOgQxbjBZBAHMyBosWCYsODIwaiwmLChJBAFuLDkEABYsaQABRiw5BABOLH0EAQjIGFosNgToIiwJMTwK7gAGAI4saVEkiU0wjU4waQQAeixpAABkjRCuLB0lOAlCLDxaBHEy7ixkjCIwZQv7/IkL/5DIHQv+7gAFAQv/IMgdC/4oyB4wPQv3sIihlRCcKTGdC/UYxAEL7X4oBAiIpRwInByKL/yJZiwUNQQCrIowBi/9XAgCLBSULSiVYjABbSYwCQACAMgpzAEyMAUSxIoAJYWtpdGFfZGFvZUSAA2FhbGVIIlsiKGVEgARMiOrOshqyGosAshqyGIEGshAisgGztD5JVwQASwFXAAQnBBJEFYEQEkRJgQRbiwEITIEMWwgWJxdMUFcCAIsETFBJVwIAFSUKFlcGAlwAjASLBSMIjAVC/14yCosCcABMjANB/3yLA4wBQv91iwSL/4wBjACJ", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
     * check whether the plugin can be used
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
     * Constructs a no op call for the arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void ABI method
     *
     * Add an app to the list of approved plugins
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddPlugin(params) {
        return {
            ...params,
            method: 'arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.plugin, params.args.caller, params.args.escrow, params.args.admin, params.args.delegationType, params.args.lastValid, params.args.cooldown, params.args.methods, params.args.useRounds, params.args.useExecutionKey, params.args.coverFees, params.args.defaultToEscrow],
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
     * Constructs a no op call for the arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void ABI method
     *
     * Add a named plugin
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58AddNamedPlugin(params) {
        return {
            ...params,
            method: 'arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.plugin, params.args.caller, params.args.escrow, params.args.admin, params.args.delegationType, params.args.lastValid, params.args.cooldown, params.args.methods, params.args.useRounds, params.args.useExecutionKey, params.args.coverFees, params.args.defaultToEscrow],
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
     * Constructs a no op call for the arc58_optinEscrow(string,uint64[])void ABI method
     *
     * Opt-in an escrow account to assets
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58OptinEscrow(params) {
        return {
            ...params,
            method: 'arc58_optinEscrow(string,uint64[])void',
            args: Array.isArray(params.args) ? params.args : [params.args.escrow, params.args.assets],
        };
    }
    /**
     * Constructs a no op call for the arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void ABI method
     *
     * Opt-in an escrow account to assets via a plugin / allowed caller
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58PluginOptinEscrow(params) {
        return {
            ...params,
            method: 'arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void',
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
     * Constructs a no op call for the arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[] ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetPlugins(params) {
        return {
            ...params,
            method: 'arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.keys],
        };
    }
    /**
     * Constructs a no op call for the arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[] ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static arc58GetNamedPlugins(params) {
        return {
            ...params,
            method: 'arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]',
            args: Array.isArray(params.args) ? params.args : [params.args.names],
        };
    }
    /**
     * Constructs a no op call for the arc58_getEscrows(string[])(uint64,bool)[] ABI method
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
     * Get the balance of a set of assets in the account
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
             * check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call params: whether the plugin can be called with these parameters
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optinEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58OptinEscrow: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58OptinEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58PluginOptinEscrow: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58PluginOptinEscrow(params));
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
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58AddExecutionKey: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58AddExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeExecutionKey(byte[32])void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetPlugins: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetNamedPlugins: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetEscrows: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetAllowances: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetExecutions: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            arc58GetDomainKeys: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            mbr: (params) => {
                return this.appClient.params.call(AbstractedAccountParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get the balance of a set of assets in the account
             *
             * @param params The params for the smart contract call
             * @returns The call params
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
             * check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call transaction: whether the plugin can be called with these parameters
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optinEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58OptinEscrow: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58OptinEscrow(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58PluginOptinEscrow: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58PluginOptinEscrow(params));
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
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58AddExecutionKey: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58AddExecutionKey(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_removeExecutionKey(byte[32])void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetPlugins: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetNamedPlugins: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetNamedPlugins(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getEscrows(string[])(uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetEscrows: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetEscrows(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getAllowances(string,uint64[])(uint8,uint64,uint64,uint64,uint64,uint64,uint64,bool)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetAllowances: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetAllowances(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getExecutions(byte[32][])(byte[32][],uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetExecutions: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetExecutions(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getDomainKeys(address[])string[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            arc58GetDomainKeys: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.arc58GetDomainKeys(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `mbr(string,uint64,string,uint64)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            mbr: (params) => {
                return this.appClient.createTransaction.call(AbstractedAccountParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `balance(uint64[])uint64[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * Get the balance of a set of assets in the account
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
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
             * check whether the plugin can be used
             *
             * @param params The params for the smart contract call
             * @returns The call result: whether the plugin can be called with these parameters
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void` ABI method.
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_optinEscrow(string,uint64[])void` ABI method.
             *
             * Opt-in an escrow account to assets
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58OptinEscrow: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58OptinEscrow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void` ABI method.
             *
             * Opt-in an escrow account to assets via a plugin / allowed caller
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58PluginOptinEscrow: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58PluginOptinEscrow(params));
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
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            arc58GetPlugins: async (params) => {
                const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
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
             * @param params The params for the smart contract call
             * @returns The call result
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
             * @param params The params for the smart contract call
             * @returns The call result
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
             * @param params The params for the smart contract call
             * @returns The call result
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
             * @param params The params for the smart contract call
             * @returns The call result
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
             * @param params The params for the smart contract call
             * @returns The call result
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
             * Get the balance of a set of assets in the account
             *
             * @param params The params for the smart contract call
             * @returns The call result
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
     * check whether the plugin can be used
     *
     * @param params The params for the smart contract call
     * @returns The call result: whether the plugin can be called with these parameters
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
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async arc58GetPlugins(params) {
        const result = await this.appClient.send.call(AbstractedAccountParamsFactory.arc58GetPlugins(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AbstractedAccount smart contract using the `arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
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
     * @param params The params for the smart contract call
     * @returns The call result
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
     * @param params The params for the smart contract call
     * @returns The call result
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
     * @param params The params for the smart contract call
     * @returns The call result
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
     * @param params The params for the smart contract call
     * @returns The call result
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
     * @param params The params for the smart contract call
     * @returns The call result
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
     * Get the balance of a set of assets in the account
     *
     * @param params The params for the smart contract call
     * @returns The call result
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
             * Add a arc58_addPlugin(uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void method call against the AbstractedAccount contract
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
             * Add a arc58_addNamedPlugin(string,uint64,address,string,bool,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool)void method call against the AbstractedAccount contract
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
             * Add a arc58_optinEscrow(string,uint64[])void method call against the AbstractedAccount contract
             */
            arc58OptinEscrow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58OptinEscrow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a arc58_pluginOptinEscrow(uint64,address,string,uint64[],pay)void method call against the AbstractedAccount contract
             */
            arc58PluginOptinEscrow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58PluginOptinEscrow(params)));
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
             * Add a arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[] method call against the AbstractedAccount contract
             */
            arc58GetPlugins(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetPlugins(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getPlugins((uint64,address,string)[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]', v));
                return this;
            },
            /**
             * Add a arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[] method call against the AbstractedAccount contract
             */
            arc58GetNamedPlugins(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.arc58GetNamedPlugins(params)));
                resultMappers.push((v) => client.decodeReturnValue('arc58_getNamedPlugins(string[])(uint64,uint8,uint64,uint64,(byte[4],uint64,uint64)[],bool,bool,bool,bool,uint64,uint64)[]', v));
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