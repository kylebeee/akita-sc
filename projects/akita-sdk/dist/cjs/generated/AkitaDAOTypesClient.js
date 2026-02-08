"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkitaDaoTypesClient = exports.AkitaDaoTypesFactory = exports.AkitaDaoTypesParamsFactory = exports.APP_SPEC = void 0;
exports.ProposalAddAllowancesFromTuple = ProposalAddAllowancesFromTuple;
exports.ProposalAddNamedPluginFromTuple = ProposalAddNamedPluginFromTuple;
exports.ProposalAddPluginFromTuple = ProposalAddPluginFromTuple;
exports.ProposalExecuteNamedPluginFromTuple = ProposalExecuteNamedPluginFromTuple;
exports.ProposalExecutePluginFromTuple = ProposalExecutePluginFromTuple;
exports.ProposalNewEscrowFromTuple = ProposalNewEscrowFromTuple;
exports.ProposalRemoveAllowancesFromTuple = ProposalRemoveAllowancesFromTuple;
exports.ProposalRemoveExecutePluginFromTuple = ProposalRemoveExecutePluginFromTuple;
exports.ProposalRemoveNamedPluginFromTuple = ProposalRemoveNamedPluginFromTuple;
exports.ProposalRemovePluginFromTuple = ProposalRemovePluginFromTuple;
exports.ProposalToggleEscrowLockFromTuple = ProposalToggleEscrowLockFromTuple;
exports.ProposalUpdateFieldFromTuple = ProposalUpdateFieldFromTuple;
exports.ProposalUpgradeAppFromTuple = ProposalUpgradeAppFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "AkitaDAOTypes", "structs": { "ProposalAddAllowances": [{ "name": "escrow", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalAddNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64)[]" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "defaultToEscrow", "type": "bool" }, { "name": "fee", "type": "uint64" }, { "name": "power", "type": "uint64" }, { "name": "duration", "type": "uint64" }, { "name": "participation", "type": "uint64" }, { "name": "approval", "type": "uint64" }, { "name": "sourceLink", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalAddPlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64)[]" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "defaultToEscrow", "type": "bool" }, { "name": "fee", "type": "uint64" }, { "name": "power", "type": "uint64" }, { "name": "duration", "type": "uint64" }, { "name": "participation", "type": "uint64" }, { "name": "approval", "type": "uint64" }, { "name": "sourceLink", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalExecuteNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "ProposalExecutePlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "escrow", "type": "string" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "ProposalNewEscrow": [{ "name": "escrow", "type": "string" }], "ProposalRemoveAllowances": [{ "name": "escrow", "type": "string" }, { "name": "assets", "type": "uint64[]" }], "ProposalRemoveExecutePlugin": [{ "name": "executionKey", "type": "byte[32]" }], "ProposalRemoveNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }], "ProposalRemovePlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }], "ProposalToggleEscrowLock": [{ "name": "escrow", "type": "string" }], "ProposalUpdateField": [{ "name": "field", "type": "string" }, { "name": "value", "type": "byte[]" }], "ProposalUpgradeApp": [{ "name": "app", "type": "uint64" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }] }, "methods": [{ "name": "proposalUpgradeAppShape", "args": [{ "type": "(uint64,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalUpgradeApp", "name": "shape" }], "returns": { "type": "(uint64,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalUpgradeApp" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddPluginShape", "args": [{ "type": "(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddPlugin", "name": "shape" }], "returns": { "type": "(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddNamedPluginShape", "args": [{ "type": "(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddNamedPlugin", "name": "shape" }], "returns": { "type": "(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemovePluginShape", "args": [{ "type": "(uint64,address,string)", "struct": "ProposalRemovePlugin", "name": "shape" }], "returns": { "type": "(uint64,address,string)", "struct": "ProposalRemovePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveNamedPluginShape", "args": [{ "type": "(string,uint64,address,string)", "struct": "ProposalRemoveNamedPlugin", "name": "shape" }], "returns": { "type": "(string,uint64,address,string)", "struct": "ProposalRemoveNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalExecutePluginShape", "args": [{ "type": "(uint64,string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecutePlugin", "name": "shape" }], "returns": { "type": "(uint64,string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecutePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalExecuteNamedPluginShape", "args": [{ "type": "(string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecuteNamedPlugin", "name": "shape" }], "returns": { "type": "(string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecuteNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveExecutePluginShape", "args": [{ "type": "(byte[32])", "struct": "ProposalRemoveExecutePlugin", "name": "shape" }], "returns": { "type": "(byte[32])", "struct": "ProposalRemoveExecutePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddAllowancesShape", "args": [{ "type": "(string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddAllowances", "name": "shape" }], "returns": { "type": "(string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddAllowances" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveAllowancesShape", "args": [{ "type": "(string,uint64[])", "struct": "ProposalRemoveAllowances", "name": "shape" }], "returns": { "type": "(string,uint64[])", "struct": "ProposalRemoveAllowances" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalNewEscrowShape", "args": [{ "type": "(string)", "struct": "ProposalNewEscrow", "name": "shape" }], "returns": { "type": "(string)", "struct": "ProposalNewEscrow" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalToggleEscrowLockShape", "args": [{ "type": "(string)", "struct": "ProposalToggleEscrowLock", "name": "shape" }], "returns": { "type": "(string)", "struct": "ProposalToggleEscrowLock" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalUpdateFieldShape", "args": [{ "type": "(string,byte[])", "struct": "ProposalUpdateField", "name": "shape" }], "returns": { "type": "(string,byte[])", "struct": "ProposalUpdateField" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [19], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [129], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [194], "errorMessage": "invalid number of bytes for (uint8[32])" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMQogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6NAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhREFPVHlwZXMgZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVAMjAKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0CiAgICBwdXNoYnl0ZXNzIDB4OTJiMzU4OTYgMHg3ZWU0YmFiNyAweDgyZDVmM2ZmIDB4ZjM5NDFhMmMgMHhmMWNmMjJjYyAweGJkNGVmNzMwIDB4ZWJhYjVlMTQgMHg2YjhhYmQyZiAweGZjYWY4NDIwIDB4NTVjZTVjYTkgMHhhNjM4YmUyMyAweDUwYWFiODFkIDB4MTQ5ZDNjY2IgLy8gbWV0aG9kICJwcm9wb3NhbFVwZ3JhZGVBcHBTaGFwZSgodWludDY0LGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHVpbnQ2NCxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJwcm9wb3NhbEFkZFBsdWdpblNoYXBlKCh1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pKSh1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pIiwgbWV0aG9kICJwcm9wb3NhbEFkZE5hbWVkUGx1Z2luU2hhcGUoKHN0cmluZyx1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pKShzdHJpbmcsdWludDY0LGFkZHJlc3Msc3RyaW5nLHVpbnQ4LHVpbnQ2NCx1aW50NjQsKGJ5dGVbNF0sdWludDY0KVtdLGJvb2wsYm9vbCxib29sLGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxzdHJpbmcsKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdKSIsIG1ldGhvZCAicHJvcG9zYWxSZW1vdmVQbHVnaW5TaGFwZSgodWludDY0LGFkZHJlc3Msc3RyaW5nKSkodWludDY0LGFkZHJlc3Msc3RyaW5nKSIsIG1ldGhvZCAicHJvcG9zYWxSZW1vdmVOYW1lZFBsdWdpblNoYXBlKChzdHJpbmcsdWludDY0LGFkZHJlc3Msc3RyaW5nKSkoc3RyaW5nLHVpbnQ2NCxhZGRyZXNzLHN0cmluZykiLCBtZXRob2QgInByb3Bvc2FsRXhlY3V0ZVBsdWdpblNoYXBlKCh1aW50NjQsc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHVpbnQ2NCxzdHJpbmcsYnl0ZVszMl0sYnl0ZVszMl1bXSx1aW50NjQsdWludDY0KSIsIG1ldGhvZCAicHJvcG9zYWxFeGVjdXRlTmFtZWRQbHVnaW5TaGFwZSgoc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHN0cmluZyxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJwcm9wb3NhbFJlbW92ZUV4ZWN1dGVQbHVnaW5TaGFwZSgoYnl0ZVszMl0pKShieXRlWzMyXSkiLCBtZXRob2QgInByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlKChzdHJpbmcsKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdKSkoc3RyaW5nLCh1aW50NjQsdWludDgsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbClbXSkiLCBtZXRob2QgInByb3Bvc2FsUmVtb3ZlQWxsb3dhbmNlc1NoYXBlKChzdHJpbmcsdWludDY0W10pKShzdHJpbmcsdWludDY0W10pIiwgbWV0aG9kICJwcm9wb3NhbE5ld0VzY3Jvd1NoYXBlKChzdHJpbmcpKShzdHJpbmcpIiwgbWV0aG9kICJwcm9wb3NhbFRvZ2dsZUVzY3Jvd0xvY2tTaGFwZSgoc3RyaW5nKSkoc3RyaW5nKSIsIG1ldGhvZCAicHJvcG9zYWxVcGRhdGVGaWVsZFNoYXBlKChzdHJpbmcsYnl0ZVtdKSkoc3RyaW5nLGJ5dGVbXSkiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBwcm9wb3NhbFVwZ3JhZGVBcHBTaGFwZSBwcm9wb3NhbEFkZFBsdWdpblNoYXBlIHByb3Bvc2FsQWRkTmFtZWRQbHVnaW5TaGFwZSBwcm9wb3NhbFJlbW92ZVBsdWdpblNoYXBlIHByb3Bvc2FsUmVtb3ZlTmFtZWRQbHVnaW5TaGFwZSBwcm9wb3NhbEV4ZWN1dGVQbHVnaW5TaGFwZSBwcm9wb3NhbEV4ZWN1dGVOYW1lZFBsdWdpblNoYXBlIHByb3Bvc2FsUmVtb3ZlRXhlY3V0ZVBsdWdpblNoYXBlIHByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlIHByb3Bvc2FsUmVtb3ZlQWxsb3dhbmNlc1NoYXBlIHByb3Bvc2FsTmV3RXNjcm93U2hhcGUgcHJvcG9zYWxUb2dnbGVFc2Nyb3dMb2NrU2hhcGUgcHJvcG9zYWxVcGRhdGVGaWVsZFNoYXBlCiAgICBlcnIKCm1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YURBT1R5cGVzIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICEKICAgICYmCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AgJiYgY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsVXBncmFkZUFwcFNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKcHJvcG9zYWxVcGdyYWRlQXBwU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6NQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsQWRkUGx1Z2luU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbEFkZFBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjEwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxBZGROYW1lZFBsdWdpblNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKcHJvcG9zYWxBZGROYW1lZFBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjE1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxSZW1vdmVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsUmVtb3ZlUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MjAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbFJlbW92ZU5hbWVkUGx1Z2luU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFJlbW92ZU5hbWVkUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MjUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbEV4ZWN1dGVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsRXhlY3V0ZVBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjMwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxFeGVjdXRlTmFtZWRQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsRXhlY3V0ZU5hbWVkUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MzUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbFJlbW92ZUV4ZWN1dGVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsUmVtb3ZlRXhlY3V0ZVBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDhbMzJdKQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbEFkZEFsbG93YW5jZXNTaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQ1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxSZW1vdmVBbGxvd2FuY2VzU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFJlbW92ZUFsbG93YW5jZXNTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo1MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsTmV3RXNjcm93U2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbE5ld0VzY3Jvd1NoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjU1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxUb2dnbGVFc2Nyb3dMb2NrU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFRvZ2dsZUVzY3Jvd0xvY2tTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo2MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsVXBkYXRlRmllbGRTaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsVXBkYXRlRmllbGRTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo2NQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyABASYBBBUffHUxG0EAajEZFEQxGESCDQSSs1iWBH7kurcEgtXz/wTzlBosBPHPIswEvU73MATrq14UBGuKvS8E/K+EIARVzlypBKY4viMEUKq4HQQUnTzLNhoAjg0ACQARABkAIQApADEAOQBBAFAAWABgAGgAcAAxGRQxGBQQQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDNhoBSRWBIBJEKExQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a ProposalAddAllowances to the struct representation
 */
function ProposalAddAllowancesFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalAddAllowances, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalAddNamedPlugin to the struct representation
 */
function ProposalAddNamedPluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalAddNamedPlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalAddPlugin to the struct representation
 */
function ProposalAddPluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalAddPlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalExecuteNamedPlugin to the struct representation
 */
function ProposalExecuteNamedPluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalExecuteNamedPlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalExecutePlugin to the struct representation
 */
function ProposalExecutePluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalExecutePlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalNewEscrow to the struct representation
 */
function ProposalNewEscrowFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalNewEscrow, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalRemoveAllowances to the struct representation
 */
function ProposalRemoveAllowancesFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalRemoveAllowances, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalRemoveExecutePlugin to the struct representation
 */
function ProposalRemoveExecutePluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalRemoveExecutePlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalRemoveNamedPlugin to the struct representation
 */
function ProposalRemoveNamedPluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalRemoveNamedPlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalRemovePlugin to the struct representation
 */
function ProposalRemovePluginFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalRemovePlugin, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalToggleEscrowLock to the struct representation
 */
function ProposalToggleEscrowLockFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalToggleEscrowLock, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalUpdateField to the struct representation
 */
function ProposalUpdateFieldFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalUpdateField, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ProposalUpgradeApp to the struct representation
 */
function ProposalUpgradeAppFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ProposalUpgradeApp, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the AkitaDaoTypes smart contract
 */
class AkitaDaoTypesParamsFactory {
    /**
     * Constructs a no op call for the proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalUpgradeAppShape(params) {
        return {
            ...params,
            method: 'proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalAddPluginShape(params) {
        return {
            ...params,
            method: 'proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalAddNamedPluginShape(params) {
        return {
            ...params,
            method: 'proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalRemovePluginShape((uint64,address,string))(uint64,address,string) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalRemovePluginShape(params) {
        return {
            ...params,
            method: 'proposalRemovePluginShape((uint64,address,string))(uint64,address,string)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalRemoveNamedPluginShape(params) {
        return {
            ...params,
            method: 'proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalExecutePluginShape(params) {
        return {
            ...params,
            method: 'proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalExecuteNamedPluginShape(params) {
        return {
            ...params,
            method: 'proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalRemoveExecutePluginShape((byte[32]))(byte[32]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalRemoveExecutePluginShape(params) {
        return {
            ...params,
            method: 'proposalRemoveExecutePluginShape((byte[32]))(byte[32])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalAddAllowancesShape(params) {
        return {
            ...params,
            method: 'proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalRemoveAllowancesShape(params) {
        return {
            ...params,
            method: 'proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalNewEscrowShape((string))(string) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalNewEscrowShape(params) {
        return {
            ...params,
            method: 'proposalNewEscrowShape((string))(string)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalToggleEscrowLockShape((string))(string) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalToggleEscrowLockShape(params) {
        return {
            ...params,
            method: 'proposalToggleEscrowLockShape((string))(string)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the proposalUpdateFieldShape((string,byte[]))(string,byte[]) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static proposalUpdateFieldShape(params) {
        return {
            ...params,
            method: 'proposalUpdateFieldShape((string,byte[]))(string,byte[])',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
}
exports.AkitaDaoTypesParamsFactory = AkitaDaoTypesParamsFactory;
/**
 * A factory to create and deploy one or more instance of the AkitaDAOTypes smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class AkitaDaoTypesFactory {
    /**
     * Creates a new instance of `AkitaDaoTypesFactory`
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
                 * Creates a new instance of the AkitaDAOTypes smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The params for a create call
                 */
                bare: (params) => {
                    return this.appFactory.params.bare.create(params);
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
                 * Creates a new instance of the AkitaDAOTypes smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The transaction for a create call
                 */
                bare: (params) => {
                    return this.appFactory.createTransaction.bare.create(params);
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
                 * Creates a new instance of the AkitaDAOTypes smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new AkitaDaoTypesClient(result.appClient) };
                },
            },
        };
        this.appFactory = new app_factory_1.AppFactory({
            ...params,
            appSpec: exports.APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return exports.APP_SPEC;
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
        return new AkitaDaoTypesClient(this.appFactory.getAppClientById(params));
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
        return new AkitaDaoTypesClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the AkitaDAOTypes smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new AkitaDaoTypesClient(result.appClient) };
    }
}
exports.AkitaDaoTypesFactory = AkitaDaoTypesFactory;
/**
 * A client to make calls to the AkitaDAOTypes smart contract
 */
class AkitaDaoTypesClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaDAOTypes smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalUpgradeAppShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalUpgradeAppShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalAddPluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalAddPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalAddNamedPluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalAddNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemovePluginShape((uint64,address,string))(uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalRemovePluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalRemovePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalRemoveNamedPluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalRemoveNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalExecutePluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalExecutePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalExecuteNamedPluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalExecuteNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveExecutePluginShape((byte[32]))(byte[32])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalRemoveExecutePluginShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalRemoveExecutePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalAddAllowancesShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalAddAllowancesShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalRemoveAllowancesShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalRemoveAllowancesShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalNewEscrowShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalNewEscrowShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalNewEscrowShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalToggleEscrowLockShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalToggleEscrowLockShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalToggleEscrowLockShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpdateFieldShape((string,byte[]))(string,byte[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            proposalUpdateFieldShape: (params) => {
                return this.appClient.params.call(AkitaDaoTypesParamsFactory.proposalUpdateFieldShape(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaDAOTypes smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalUpgradeAppShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalUpgradeAppShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalAddPluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalAddPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalAddNamedPluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalAddNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemovePluginShape((uint64,address,string))(uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalRemovePluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalRemovePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalRemoveNamedPluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalRemoveNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalExecutePluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalExecutePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalExecuteNamedPluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalExecuteNamedPluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveExecutePluginShape((byte[32]))(byte[32])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalRemoveExecutePluginShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalRemoveExecutePluginShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalAddAllowancesShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalAddAllowancesShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalRemoveAllowancesShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalRemoveAllowancesShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalNewEscrowShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalNewEscrowShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalNewEscrowShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalToggleEscrowLockShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalToggleEscrowLockShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalToggleEscrowLockShape(params));
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpdateFieldShape((string,byte[]))(string,byte[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            proposalUpdateFieldShape: (params) => {
                return this.appClient.createTransaction.call(AkitaDaoTypesParamsFactory.proposalUpdateFieldShape(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaDAOTypes smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalUpgradeAppShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalUpgradeAppShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalAddPluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddPluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalAddNamedPluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddNamedPluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemovePluginShape((uint64,address,string))(uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalRemovePluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemovePluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalRemoveNamedPluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveNamedPluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalExecutePluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalExecutePluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalExecuteNamedPluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalExecuteNamedPluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveExecutePluginShape((byte[32]))(byte[32])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalRemoveExecutePluginShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveExecutePluginShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalAddAllowancesShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddAllowancesShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalRemoveAllowancesShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveAllowancesShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalNewEscrowShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalNewEscrowShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalNewEscrowShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalToggleEscrowLockShape((string))(string)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalToggleEscrowLockShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalToggleEscrowLockShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaDAOTypes smart contract using the `proposalUpdateFieldShape((string,byte[]))(string,byte[])` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            proposalUpdateFieldShape: async (params) => {
                const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalUpdateFieldShape(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current AkitaDAOTypes app
         */
        this.state = {};
        this.appClient = appClientOrParams instanceof app_client_1.AppClient ? appClientOrParams : new app_client_1.AppClient({
            ...appClientOrParams,
            appSpec: exports.APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? (0, app_arc56_1.getArc56ReturnValue)(returnValue, this.appClient.getABIMethod(method), exports.APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `AkitaDaoTypesClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new AkitaDaoTypesClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `AkitaDaoTypesClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new AkitaDaoTypesClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new AkitaDaoTypesClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalUpgradeAppShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalUpgradeAppShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalAddPluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddPluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalAddNamedPluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddNamedPluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalRemovePluginShape((uint64,address,string))(uint64,address,string)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalRemovePluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemovePluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalRemoveNamedPluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveNamedPluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalExecutePluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalExecutePluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalExecuteNamedPluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalExecuteNamedPluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalRemoveExecutePluginShape((byte[32]))(byte[32])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalRemoveExecutePluginShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveExecutePluginShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalAddAllowancesShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalAddAllowancesShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalRemoveAllowancesShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalRemoveAllowancesShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalNewEscrowShape((string))(string)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalNewEscrowShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalNewEscrowShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalToggleEscrowLockShape((string))(string)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalToggleEscrowLockShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalToggleEscrowLockShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the AkitaDAOTypes smart contract using the `proposalUpdateFieldShape((string,byte[]))(string,byte[])` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async proposalUpdateFieldShape(params) {
        const result = await this.appClient.send.call(AkitaDaoTypesParamsFactory.proposalUpdateFieldShape(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64) method call against the AkitaDAOTypes contract
             */
            proposalUpgradeAppShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalUpgradeAppShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)', v));
                return this;
            },
            /**
             * Add a proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
             */
            proposalAddPluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddPluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])', v));
                return this;
            },
            /**
             * Add a proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
             */
            proposalAddNamedPluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddNamedPluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])', v));
                return this;
            },
            /**
             * Add a proposalRemovePluginShape((uint64,address,string))(uint64,address,string) method call against the AkitaDAOTypes contract
             */
            proposalRemovePluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemovePluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalRemovePluginShape((uint64,address,string))(uint64,address,string)', v));
                return this;
            },
            /**
             * Add a proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string) method call against the AkitaDAOTypes contract
             */
            proposalRemoveNamedPluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveNamedPluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)', v));
                return this;
            },
            /**
             * Add a proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64) method call against the AkitaDAOTypes contract
             */
            proposalExecutePluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalExecutePluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)', v));
                return this;
            },
            /**
             * Add a proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64) method call against the AkitaDAOTypes contract
             */
            proposalExecuteNamedPluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalExecuteNamedPluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)', v));
                return this;
            },
            /**
             * Add a proposalRemoveExecutePluginShape((byte[32]))(byte[32]) method call against the AkitaDAOTypes contract
             */
            proposalRemoveExecutePluginShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveExecutePluginShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalRemoveExecutePluginShape((byte[32]))(byte[32])', v));
                return this;
            },
            /**
             * Add a proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
             */
            proposalAddAllowancesShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddAllowancesShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])', v));
                return this;
            },
            /**
             * Add a proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[]) method call against the AkitaDAOTypes contract
             */
            proposalRemoveAllowancesShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveAllowancesShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])', v));
                return this;
            },
            /**
             * Add a proposalNewEscrowShape((string))(string) method call against the AkitaDAOTypes contract
             */
            proposalNewEscrowShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalNewEscrowShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalNewEscrowShape((string))(string)', v));
                return this;
            },
            /**
             * Add a proposalToggleEscrowLockShape((string))(string) method call against the AkitaDAOTypes contract
             */
            proposalToggleEscrowLockShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalToggleEscrowLockShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalToggleEscrowLockShape((string))(string)', v));
                return this;
            },
            /**
             * Add a proposalUpdateFieldShape((string,byte[]))(string,byte[]) method call against the AkitaDAOTypes contract
             */
            proposalUpdateFieldShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalUpdateFieldShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('proposalUpdateFieldShape((string,byte[]))(string,byte[])', v));
                return this;
            },
            /**
             * Add a clear state call to the AkitaDAOTypes contract
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
exports.AkitaDaoTypesClient = AkitaDaoTypesClient;
//# sourceMappingURL=AkitaDAOTypesClient.js.map