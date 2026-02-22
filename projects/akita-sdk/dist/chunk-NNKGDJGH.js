"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } var _class; var _class2;

var _chunkO6E4VT46js = require('./chunk-O6E4VT46.js');



var _chunk56YZPYCLjs = require('./chunk-56YZPYCL.js');


var _chunkB2QFHBQDjs = require('./chunk-B2QFHBQD.js');


var _chunkW5ILLEG6js = require('./chunk-W5ILLEG6.js');




var _chunkHY3H6JQIjs = require('./chunk-HY3H6JQI.js');


var _chunk2WS6GQO5js = require('./chunk-2WS6GQO5.js');

// src/generated/AkitaDAOTypesClient.ts
var _apparc56 = require('@algorandfoundation/algokit-utils/types/app-arc56');


var _appclient = require('@algorandfoundation/algokit-utils/types/app-client');
var _appfactory = require('@algorandfoundation/algokit-utils/types/app-factory');
var APP_SPEC = { "name": "AkitaDAOTypes", "structs": { "ProposalAddAllowances": [{ "name": "escrow", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalAddNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64)[]" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "defaultToEscrow", "type": "bool" }, { "name": "fee", "type": "uint64" }, { "name": "power", "type": "uint64" }, { "name": "duration", "type": "uint64" }, { "name": "participation", "type": "uint64" }, { "name": "approval", "type": "uint64" }, { "name": "sourceLink", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalAddPlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }, { "name": "delegationType", "type": "uint8" }, { "name": "lastValid", "type": "uint64" }, { "name": "cooldown", "type": "uint64" }, { "name": "methods", "type": "(byte[4],uint64)[]" }, { "name": "useRounds", "type": "bool" }, { "name": "useExecutionKey", "type": "bool" }, { "name": "coverFees", "type": "bool" }, { "name": "defaultToEscrow", "type": "bool" }, { "name": "fee", "type": "uint64" }, { "name": "power", "type": "uint64" }, { "name": "duration", "type": "uint64" }, { "name": "participation", "type": "uint64" }, { "name": "approval", "type": "uint64" }, { "name": "sourceLink", "type": "string" }, { "name": "allowances", "type": "(uint64,uint8,uint64,uint64,uint64,bool)[]" }], "ProposalExecuteNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "ProposalExecutePlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "escrow", "type": "string" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }], "ProposalNewEscrow": [{ "name": "escrow", "type": "string" }], "ProposalRemoveAllowances": [{ "name": "escrow", "type": "string" }, { "name": "assets", "type": "uint64[]" }], "ProposalRemoveExecutePlugin": [{ "name": "executionKey", "type": "byte[32]" }], "ProposalRemoveNamedPlugin": [{ "name": "name", "type": "string" }, { "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }], "ProposalRemovePlugin": [{ "name": "plugin", "type": "uint64" }, { "name": "caller", "type": "address" }, { "name": "escrow", "type": "string" }], "ProposalToggleEscrowLock": [{ "name": "escrow", "type": "string" }], "ProposalUpdateField": [{ "name": "field", "type": "string" }, { "name": "value", "type": "byte[]" }], "ProposalUpgradeApp": [{ "name": "app", "type": "uint64" }, { "name": "executionKey", "type": "byte[32]" }, { "name": "groups", "type": "byte[32][]" }, { "name": "firstValid", "type": "uint64" }, { "name": "lastValid", "type": "uint64" }] }, "methods": [{ "name": "proposalUpgradeAppShape", "args": [{ "type": "(uint64,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalUpgradeApp", "name": "shape" }], "returns": { "type": "(uint64,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalUpgradeApp" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddPluginShape", "args": [{ "type": "(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddPlugin", "name": "shape" }], "returns": { "type": "(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddNamedPluginShape", "args": [{ "type": "(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddNamedPlugin", "name": "shape" }], "returns": { "type": "(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemovePluginShape", "args": [{ "type": "(uint64,address,string)", "struct": "ProposalRemovePlugin", "name": "shape" }], "returns": { "type": "(uint64,address,string)", "struct": "ProposalRemovePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveNamedPluginShape", "args": [{ "type": "(string,uint64,address,string)", "struct": "ProposalRemoveNamedPlugin", "name": "shape" }], "returns": { "type": "(string,uint64,address,string)", "struct": "ProposalRemoveNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalExecutePluginShape", "args": [{ "type": "(uint64,string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecutePlugin", "name": "shape" }], "returns": { "type": "(uint64,string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecutePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalExecuteNamedPluginShape", "args": [{ "type": "(string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecuteNamedPlugin", "name": "shape" }], "returns": { "type": "(string,byte[32],byte[32][],uint64,uint64)", "struct": "ProposalExecuteNamedPlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveExecutePluginShape", "args": [{ "type": "(byte[32])", "struct": "ProposalRemoveExecutePlugin", "name": "shape" }], "returns": { "type": "(byte[32])", "struct": "ProposalRemoveExecutePlugin" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalAddAllowancesShape", "args": [{ "type": "(string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddAllowances", "name": "shape" }], "returns": { "type": "(string,(uint64,uint8,uint64,uint64,uint64,bool)[])", "struct": "ProposalAddAllowances" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalRemoveAllowancesShape", "args": [{ "type": "(string,uint64[])", "struct": "ProposalRemoveAllowances", "name": "shape" }], "returns": { "type": "(string,uint64[])", "struct": "ProposalRemoveAllowances" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalNewEscrowShape", "args": [{ "type": "(string)", "struct": "ProposalNewEscrow", "name": "shape" }], "returns": { "type": "(string)", "struct": "ProposalNewEscrow" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalToggleEscrowLockShape", "args": [{ "type": "(string)", "struct": "ProposalToggleEscrowLock", "name": "shape" }], "returns": { "type": "(string)", "struct": "ProposalToggleEscrowLock" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "proposalUpdateFieldShape", "args": [{ "type": "(string,byte[])", "struct": "ProposalUpdateField", "name": "shape" }], "returns": { "type": "(string,byte[])", "struct": "ProposalUpdateField" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 0, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": {}, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [19], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [129], "errorMessage": "OnCompletion must be NoOp && can only call when creating" }, { "pc": [194], "errorMessage": "invalid number of bytes for (uint8[32])" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMQogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6NAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhREFPVHlwZXMgZXh0ZW5kcyBDb250cmFjdCB7CiAgICB0eG4gTnVtQXBwQXJncwogICAgYnogbWFpbl9fX2FsZ290c19fLmRlZmF1bHRDcmVhdGVAMjAKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0CiAgICBwdXNoYnl0ZXNzIDB4OTJiMzU4OTYgMHg3ZWU0YmFiNyAweDgyZDVmM2ZmIDB4ZjM5NDFhMmMgMHhmMWNmMjJjYyAweGJkNGVmNzMwIDB4ZWJhYjVlMTQgMHg2YjhhYmQyZiAweGZjYWY4NDIwIDB4NTVjZTVjYTkgMHhhNjM4YmUyMyAweDUwYWFiODFkIDB4MTQ5ZDNjY2IgLy8gbWV0aG9kICJwcm9wb3NhbFVwZ3JhZGVBcHBTaGFwZSgodWludDY0LGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHVpbnQ2NCxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJwcm9wb3NhbEFkZFBsdWdpblNoYXBlKCh1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pKSh1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pIiwgbWV0aG9kICJwcm9wb3NhbEFkZE5hbWVkUGx1Z2luU2hhcGUoKHN0cmluZyx1aW50NjQsYWRkcmVzcyxzdHJpbmcsdWludDgsdWludDY0LHVpbnQ2NCwoYnl0ZVs0XSx1aW50NjQpW10sYm9vbCxib29sLGJvb2wsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHN0cmluZywodWludDY0LHVpbnQ4LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wpW10pKShzdHJpbmcsdWludDY0LGFkZHJlc3Msc3RyaW5nLHVpbnQ4LHVpbnQ2NCx1aW50NjQsKGJ5dGVbNF0sdWludDY0KVtdLGJvb2wsYm9vbCxib29sLGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxzdHJpbmcsKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdKSIsIG1ldGhvZCAicHJvcG9zYWxSZW1vdmVQbHVnaW5TaGFwZSgodWludDY0LGFkZHJlc3Msc3RyaW5nKSkodWludDY0LGFkZHJlc3Msc3RyaW5nKSIsIG1ldGhvZCAicHJvcG9zYWxSZW1vdmVOYW1lZFBsdWdpblNoYXBlKChzdHJpbmcsdWludDY0LGFkZHJlc3Msc3RyaW5nKSkoc3RyaW5nLHVpbnQ2NCxhZGRyZXNzLHN0cmluZykiLCBtZXRob2QgInByb3Bvc2FsRXhlY3V0ZVBsdWdpblNoYXBlKCh1aW50NjQsc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHVpbnQ2NCxzdHJpbmcsYnl0ZVszMl0sYnl0ZVszMl1bXSx1aW50NjQsdWludDY0KSIsIG1ldGhvZCAicHJvcG9zYWxFeGVjdXRlTmFtZWRQbHVnaW5TaGFwZSgoc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHVpbnQ2NCkpKHN0cmluZyxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJwcm9wb3NhbFJlbW92ZUV4ZWN1dGVQbHVnaW5TaGFwZSgoYnl0ZVszMl0pKShieXRlWzMyXSkiLCBtZXRob2QgInByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlKChzdHJpbmcsKHVpbnQ2NCx1aW50OCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sKVtdKSkoc3RyaW5nLCh1aW50NjQsdWludDgsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbClbXSkiLCBtZXRob2QgInByb3Bvc2FsUmVtb3ZlQWxsb3dhbmNlc1NoYXBlKChzdHJpbmcsdWludDY0W10pKShzdHJpbmcsdWludDY0W10pIiwgbWV0aG9kICJwcm9wb3NhbE5ld0VzY3Jvd1NoYXBlKChzdHJpbmcpKShzdHJpbmcpIiwgbWV0aG9kICJwcm9wb3NhbFRvZ2dsZUVzY3Jvd0xvY2tTaGFwZSgoc3RyaW5nKSkoc3RyaW5nKSIsIG1ldGhvZCAicHJvcG9zYWxVcGRhdGVGaWVsZFNoYXBlKChzdHJpbmcsYnl0ZVtdKSkoc3RyaW5nLGJ5dGVbXSkiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBwcm9wb3NhbFVwZ3JhZGVBcHBTaGFwZSBwcm9wb3NhbEFkZFBsdWdpblNoYXBlIHByb3Bvc2FsQWRkTmFtZWRQbHVnaW5TaGFwZSBwcm9wb3NhbFJlbW92ZVBsdWdpblNoYXBlIHByb3Bvc2FsUmVtb3ZlTmFtZWRQbHVnaW5TaGFwZSBwcm9wb3NhbEV4ZWN1dGVQbHVnaW5TaGFwZSBwcm9wb3NhbEV4ZWN1dGVOYW1lZFBsdWdpblNoYXBlIHByb3Bvc2FsUmVtb3ZlRXhlY3V0ZVBsdWdpblNoYXBlIHByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlIHByb3Bvc2FsUmVtb3ZlQWxsb3dhbmNlc1NoYXBlIHByb3Bvc2FsTmV3RXNjcm93U2hhcGUgcHJvcG9zYWxUb2dnbGVFc2Nyb3dMb2NrU2hhcGUgcHJvcG9zYWxVcGRhdGVGaWVsZFNoYXBlCiAgICBlcnIKCm1haW5fX19hbGdvdHNfXy5kZWZhdWx0Q3JlYXRlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YURBT1R5cGVzIGV4dGVuZHMgQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICEKICAgICYmCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AgJiYgY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsVXBncmFkZUFwcFNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKcHJvcG9zYWxVcGdyYWRlQXBwU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6NQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsQWRkUGx1Z2luU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbEFkZFBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjEwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxBZGROYW1lZFBsdWdpblNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKcHJvcG9zYWxBZGROYW1lZFBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjE1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxSZW1vdmVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsUmVtb3ZlUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MjAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbFJlbW92ZU5hbWVkUGx1Z2luU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFJlbW92ZU5hbWVkUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MjUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbEV4ZWN1dGVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsRXhlY3V0ZVBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjMwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxFeGVjdXRlTmFtZWRQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsRXhlY3V0ZU5hbWVkUGx1Z2luU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6MzUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbFJlbW92ZUV4ZWN1dGVQbHVnaW5TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsUmVtb3ZlRXhlY3V0ZVBsdWdpblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDhbMzJdKQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo6QWtpdGFEQU9UeXBlcy5wcm9wb3NhbEFkZEFsbG93YW5jZXNTaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsQWRkQWxsb3dhbmNlc1NoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjQ1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxSZW1vdmVBbGxvd2FuY2VzU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFJlbW92ZUFsbG93YW5jZXNTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo1MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsTmV3RXNjcm93U2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbE5ld0VzY3Jvd1NoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjU1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvZGFvL3R5cGVzLmFsZ28udHM6OkFraXRhREFPVHlwZXMucHJvcG9zYWxUb2dnbGVFc2Nyb3dMb2NrU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpwcm9wb3NhbFRvZ2dsZUVzY3Jvd0xvY2tTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo2MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L2Rhby90eXBlcy5hbGdvLnRzOjpBa2l0YURBT1R5cGVzLnByb3Bvc2FsVXBkYXRlRmllbGRTaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnByb3Bvc2FsVXBkYXRlRmllbGRTaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9kYW8vdHlwZXMuYWxnby50czo2NQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyABASYBBBUffHUxG0EAajEZFEQxGESCDQSSs1iWBH7kurcEgtXz/wTzlBosBPHPIswEvU73MATrq14UBGuKvS8E/K+EIARVzlypBKY4viMEUKq4HQQUnTzLNhoAjg0ACQARABkAIQApADEAOQBBAFAAWABgAGgAcAAxGRQxGBQQQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDNhoBSRWBIBJEKExQsCJDKDYaAVCwIkMoNhoBULAiQyg2GgFQsCJDKDYaAVCwIkMoNhoBULAiQw==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var AkitaDaoTypesParamsFactory = class {
  /**
   * Constructs a no op call for the proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static proposalUpgradeAppShape(params) {
    return {
      ...params,
      method: "proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalRemovePluginShape((uint64,address,string))(uint64,address,string)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalRemoveExecutePluginShape((byte[32]))(byte[32])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalNewEscrowShape((string))(string)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalToggleEscrowLockShape((string))(string)",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
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
      method: "proposalUpdateFieldShape((string,byte[]))(string,byte[])",
      args: Array.isArray(params.args) ? params.args : [params.args.shape]
    };
  }
};
var AkitaDaoTypesClient = (_class = class _AkitaDaoTypesClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  
  constructor(appClientOrParams) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);_class.prototype.__init4.call(this);
    this.appClient = appClientOrParams instanceof _appclient.AppClient ? appClientOrParams : new (0, _appclient.AppClient)({
      ...appClientOrParams,
      appSpec: APP_SPEC
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? _apparc56.getArc56ReturnValue.call(void 0, returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : void 0;
  }
  /**
   * Returns a new `AkitaDaoTypesClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _AkitaDaoTypesClient(await _appclient.AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
  }
  /**
   * Returns an `AkitaDaoTypesClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _AkitaDaoTypesClient(await _appclient.AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
   * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  __init() {this.params = {
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
    }
  }}
  /**
   * Create transactions for the current app
   */
  __init2() {this.createTransaction = {
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
    }
  }}
  /**
   * Send calls to the current app
   */
  __init3() {this.send = {
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
    }
  }}
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _AkitaDaoTypesClient(this.appClient.clone(params));
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
  /**
   * Methods to access state for the current AkitaDAOTypes app
   */
  __init4() {this.state = {}}
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
        resultMappers.push((v) => client.decodeReturnValue("proposalUpgradeAppShape((uint64,byte[32],byte[32][],uint64,uint64))(uint64,byte[32],byte[32][],uint64,uint64)", v));
        return this;
      },
      /**
       * Add a proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
       */
      proposalAddPluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddPluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalAddPluginShape((uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", v));
        return this;
      },
      /**
       * Add a proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
       */
      proposalAddNamedPluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddNamedPluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalAddNamedPluginShape((string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,uint64,address,string,uint8,uint64,uint64,(byte[4],uint64)[],bool,bool,bool,bool,uint64,uint64,uint64,uint64,uint64,string,(uint64,uint8,uint64,uint64,uint64,bool)[])", v));
        return this;
      },
      /**
       * Add a proposalRemovePluginShape((uint64,address,string))(uint64,address,string) method call against the AkitaDAOTypes contract
       */
      proposalRemovePluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemovePluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalRemovePluginShape((uint64,address,string))(uint64,address,string)", v));
        return this;
      },
      /**
       * Add a proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string) method call against the AkitaDAOTypes contract
       */
      proposalRemoveNamedPluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveNamedPluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalRemoveNamedPluginShape((string,uint64,address,string))(string,uint64,address,string)", v));
        return this;
      },
      /**
       * Add a proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64) method call against the AkitaDAOTypes contract
       */
      proposalExecutePluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalExecutePluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalExecutePluginShape((uint64,string,byte[32],byte[32][],uint64,uint64))(uint64,string,byte[32],byte[32][],uint64,uint64)", v));
        return this;
      },
      /**
       * Add a proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64) method call against the AkitaDAOTypes contract
       */
      proposalExecuteNamedPluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalExecuteNamedPluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalExecuteNamedPluginShape((string,byte[32],byte[32][],uint64,uint64))(string,byte[32],byte[32][],uint64,uint64)", v));
        return this;
      },
      /**
       * Add a proposalRemoveExecutePluginShape((byte[32]))(byte[32]) method call against the AkitaDAOTypes contract
       */
      proposalRemoveExecutePluginShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveExecutePluginShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalRemoveExecutePluginShape((byte[32]))(byte[32])", v));
        return this;
      },
      /**
       * Add a proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[]) method call against the AkitaDAOTypes contract
       */
      proposalAddAllowancesShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalAddAllowancesShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalAddAllowancesShape((string,(uint64,uint8,uint64,uint64,uint64,bool)[]))(string,(uint64,uint8,uint64,uint64,uint64,bool)[])", v));
        return this;
      },
      /**
       * Add a proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[]) method call against the AkitaDAOTypes contract
       */
      proposalRemoveAllowancesShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalRemoveAllowancesShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalRemoveAllowancesShape((string,uint64[]))(string,uint64[])", v));
        return this;
      },
      /**
       * Add a proposalNewEscrowShape((string))(string) method call against the AkitaDAOTypes contract
       */
      proposalNewEscrowShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalNewEscrowShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalNewEscrowShape((string))(string)", v));
        return this;
      },
      /**
       * Add a proposalToggleEscrowLockShape((string))(string) method call against the AkitaDAOTypes contract
       */
      proposalToggleEscrowLockShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalToggleEscrowLockShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalToggleEscrowLockShape((string))(string)", v));
        return this;
      },
      /**
       * Add a proposalUpdateFieldShape((string,byte[]))(string,byte[]) method call against the AkitaDAOTypes contract
       */
      proposalUpdateFieldShape(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.proposalUpdateFieldShape(params)));
        resultMappers.push((v) => client.decodeReturnValue("proposalUpdateFieldShape((string,byte[]))(string,byte[])", v));
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
        var _a;
        await promiseChain;
        const result = await (!options ? composer.simulate() : composer.simulate(options));
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      },
      async send(params) {
        var _a;
        await promiseChain;
        const result = await composer.send(params);
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      }
    };
  }
}, _class);

// src/dao/types.ts
var SplitDistributionType = /* @__PURE__ */ ((SplitDistributionType2) => {
  SplitDistributionType2[SplitDistributionType2["Flat"] = 10] = "Flat";
  SplitDistributionType2[SplitDistributionType2["Percentage"] = 20] = "Percentage";
  SplitDistributionType2[SplitDistributionType2["Remainder"] = 30] = "Remainder";
  return SplitDistributionType2;
})(SplitDistributionType || {});
function SplitsToTuples(splits) {
  return splits.map((split) => [[split.receiver.wallet, split.receiver.escrow], split.type, split.value]);
}

// src/dao/constants.ts
var ProposalActionEnum = /* @__PURE__ */ ((ProposalActionEnum2) => {
  ProposalActionEnum2[ProposalActionEnum2["UpgradeApp"] = 10] = "UpgradeApp";
  ProposalActionEnum2[ProposalActionEnum2["AddPlugin"] = 20] = "AddPlugin";
  ProposalActionEnum2[ProposalActionEnum2["AddNamedPlugin"] = 21] = "AddNamedPlugin";
  ProposalActionEnum2[ProposalActionEnum2["ExecutePlugin"] = 30] = "ExecutePlugin";
  ProposalActionEnum2[ProposalActionEnum2["RemoveExecutePlugin"] = 31] = "RemoveExecutePlugin";
  ProposalActionEnum2[ProposalActionEnum2["RemovePlugin"] = 40] = "RemovePlugin";
  ProposalActionEnum2[ProposalActionEnum2["RemoveNamedPlugin"] = 41] = "RemoveNamedPlugin";
  ProposalActionEnum2[ProposalActionEnum2["AddAllowances"] = 50] = "AddAllowances";
  ProposalActionEnum2[ProposalActionEnum2["RemoveAllowances"] = 60] = "RemoveAllowances";
  ProposalActionEnum2[ProposalActionEnum2["NewEscrow"] = 70] = "NewEscrow";
  ProposalActionEnum2[ProposalActionEnum2["ToggleEscrowLock"] = 71] = "ToggleEscrowLock";
  ProposalActionEnum2[ProposalActionEnum2["UpdateFields"] = 80] = "UpdateFields";
  return ProposalActionEnum2;
})(ProposalActionEnum || {});
var EMPTY_CID = Buffer.from("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
var DAOProposalVotesMBR = 22500n;

// src/dao/index.ts

var _algosdk = require('algosdk');
var _algokitutils = require('@algorandfoundation/algokit-utils');
var AkitaDaoSDK = (_class2 = class extends _chunkW5ILLEG6js.BaseSDK {
  
  __init5() {this._wallet = null}
  __init6() {this._walletInitPromise = null}
  
  constructor(params) {
    super({ factory: _chunkB2QFHBQDjs.AkitaDaoFactory, ...params }, _chunkHY3H6JQIjs.ENV_VAR_NAMES.DAO_APP_ID);_class2.prototype.__init5.call(this);_class2.prototype.__init6.call(this);;
    this.typeClient = new AkitaDaoTypesClient({ algorand: this.algorand, appId: 0n });
    this._constructorParams = params;
  }
  /**
   * Get the wallet SDK associated with this DAO.
   * Lazily fetches the wallet app ID from the DAO's global state on first access.
   */
  async getWallet() {
    if (this._wallet) {
      return this._wallet;
    }
    if (!this._walletInitPromise) {
      this._walletInitPromise = this._initializeWallet();
    }
    return this._walletInitPromise;
  }
  async _initializeWallet() {
    const walletAppId = await this.client.state.global.wallet();
    if (!walletAppId) {
      throw new Error("Could not read wallet app ID from DAO global state. Has the DAO been set up?");
    }
    this._wallet = new (0, _chunkO6E4VT46js.WalletSDK)({
      ...this._constructorParams,
      factoryParams: {
        ...this._constructorParams.factoryParams,
        appId: walletAppId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    });
    return this._wallet;
  }
  /**
   * @deprecated Use getWallet() instead for proper async initialization.
   * This getter exists for backwards compatibility but will throw if the wallet
   * hasn't been initialized yet via getWallet() or setup().
   */
  get wallet() {
    if (!this._wallet) {
      throw new Error(
        'Wallet not initialized. Call "await dao.getWallet()" first to initialize the wallet SDK, or use "await dao.setup()" to create a new DAO with its wallet.'
      );
    }
    return this._wallet;
  }
  /**
   * Allows setting the wallet directly (used by setup() and for testing)
   */
  set wallet(wallet) {
    this._wallet = wallet;
    this._walletInitPromise = Promise.resolve(wallet);
  }
  async prepProposalActions(actions) {
    const needsWallet = actions.some(
      (a) => a.type === 30 /* ExecutePlugin */ || a.type === 31 /* RemoveExecutePlugin */ || a.type === 40 /* RemovePlugin */ || a.type === 41 /* RemoveNamedPlugin */
    );
    const wallet = needsWallet ? await this.getWallet() : null;
    const preppedActions = [];
    for (let i = 0; i < actions.length; i++) {
      const typedAction = actions[i];
      let abiAction;
      let structType = "";
      switch (typedAction.type) {
        case 10 /* UpgradeApp */: {
          const { type, ...action } = typedAction;
          abiAction = action;
          structType = "ProposalUpgradeApp";
          break;
        }
        case 20 /* AddPlugin */:
        case 21 /* AddNamedPlugin */: {
          const { type, ...action } = typedAction;
          let {
            name = "",
            client,
            caller,
            global = false,
            methods = [],
            escrow = "",
            admin = false,
            delegationType = 0n,
            lastValid = _chunkHY3H6JQIjs.MAX_UINT64,
            cooldown = 0n,
            useRounds = false,
            useExecutionKey = false,
            coverFees = false,
            defaultToEscrow = false,
            sourceLink = "",
            allowances = []
          } = action;
          let fee = 0n;
          let power = 0n;
          let duration = 0n;
          let participation = 0n;
          let approval = 0n;
          if (action.useExecutionKey) {
            fee = action.fee;
            power = action.power;
            duration = action.duration;
            participation = action.participation;
            approval = action.approval;
            if (duration === 0n || participation === 0n || approval === 0n) {
              throw new Error("Proposal Settings must be set when using execution key");
            }
          }
          const plugin = client.appId;
          if (global) {
            caller = _algosdk.ALGORAND_ZERO_ADDRESS_STRING;
          }
          let transformedMethods = [];
          if (methods.length > 0) {
            transformedMethods = methods.reduce(
              (acc, method) => {
                if (_chunk2WS6GQO5js.isPluginSDKReturn.call(void 0, method.name)) {
                  const selectors = _nullishCoalesce(method.name().selectors, () => ( []));
                  selectors.forEach((selector) => acc.push([selector, method.cooldown]));
                } else {
                  method.name.forEach((x) => acc.push([x, method.cooldown]));
                }
                return acc;
              },
              []
            );
          }
          const args = {
            plugin,
            caller,
            escrow,
            admin,
            delegationType,
            lastValid,
            cooldown,
            methods: transformedMethods,
            useRounds,
            useExecutionKey,
            coverFees,
            canReclaim: false,
            defaultToEscrow,
            fee,
            power,
            duration,
            participation,
            approval,
            sourceLink,
            allowances: _chunk56YZPYCLjs.AllowancesToTuple.call(void 0, allowances)
          };
          if (name) {
            abiAction = { name, ...args };
            structType = "ProposalAddNamedPlugin";
          } else {
            abiAction = args;
            structType = "ProposalAddPlugin";
          }
          break;
        }
        case 30 /* ExecutePlugin */: {
          const { type, ...action } = typedAction;
          const { plugin, escrow } = action;
          if (!wallet.plugins.has({ plugin, caller: _algosdk.ALGORAND_ZERO_ADDRESS_STRING, escrow })) {
            try {
              await wallet.getPluginByKey({ plugin, caller: _algosdk.ALGORAND_ZERO_ADDRESS_STRING, escrow });
            } catch (e) {
              throw new Error(`Plugin: ${plugin} for escrow: ${escrow} not found`);
            }
          }
          abiAction = action;
          structType = "ProposalExecutePlugin";
          break;
        }
        case 31 /* RemoveExecutePlugin */: {
          const { type, ...action } = typedAction;
          if (!wallet.executions.has(action.executionKey)) {
            try {
              await wallet.getExecution(action.executionKey);
            } catch (e) {
              throw new Error(`Execution with key: ${action.executionKey} not found`);
            }
          }
          abiAction = action;
          structType = "ProposalRemoveExecutePlugin";
          break;
        }
        case 40 /* RemovePlugin */: {
          const { type, ...action } = typedAction;
          const { plugin, caller, escrow } = action;
          if (!wallet.plugins.has({ plugin, caller, escrow })) {
            try {
              await wallet.getPluginByKey({ plugin, caller, escrow });
            } catch (e) {
              throw new Error(`Plugin: ${plugin} with caller: ${caller} for escrow: ${escrow} not found`);
            }
          }
          abiAction = action;
          structType = "ProposalRemovePlugin";
          break;
        }
        case 41 /* RemoveNamedPlugin */: {
          const { type, ...action } = typedAction;
          const { name } = action;
          if (!wallet.namedPlugins.has(name)) {
            try {
              await wallet.getPluginByName(name);
            } catch (e) {
              throw new Error(`Plugin named: ${name} not found`);
            }
          }
          abiAction = action;
          structType = "ProposalRemoveNamedPlugin";
          break;
        }
        case 50 /* AddAllowances */: {
          const { escrow, allowances } = typedAction;
          abiAction = { escrow, allowances: _chunk56YZPYCLjs.AllowancesToTuple.call(void 0, allowances) };
          structType = "ProposalAddAllowances";
          break;
        }
        case 60 /* RemoveAllowances */: {
          const { type, ...action } = typedAction;
          abiAction = action;
          structType = "ProposalRemoveAllowances";
          break;
        }
        case 70 /* NewEscrow */: {
          const { type, ...action } = typedAction;
          abiAction = action;
          structType = "ProposalNewEscrow";
          break;
        }
        case 71 /* ToggleEscrowLock */: {
          const { type, ...action } = typedAction;
          abiAction = action;
          structType = "ProposalToggleEscrowLock";
          break;
        }
        case 80 /* UpdateFields */: {
          const { type, ...action } = typedAction;
          let data;
          switch (action.field) {
            case "content_policy": {
              data = action.value;
              break;
            }
            case "proposal_action_limit":
            case "min_rewards_impact": {
              data = _algosdk.encodeUint64.call(void 0, action.value);
              break;
            }
            case "aal": {
              const currentApps = await this.client.state.global.akitaAppList();
              const {
                staking = _nullishCoalesce((currentApps == null ? void 0 : currentApps.staking), () => ( 0n)),
                rewards = _nullishCoalesce((currentApps == null ? void 0 : currentApps.rewards), () => ( 0n)),
                pool = _nullishCoalesce((currentApps == null ? void 0 : currentApps.pool), () => ( 0n)),
                prizeBox = _nullishCoalesce((currentApps == null ? void 0 : currentApps.prizeBox), () => ( 0n)),
                subscriptions = _nullishCoalesce((currentApps == null ? void 0 : currentApps.subscriptions), () => ( 0n)),
                gate = _nullishCoalesce((currentApps == null ? void 0 : currentApps.gate), () => ( 0n)),
                auction = _nullishCoalesce((currentApps == null ? void 0 : currentApps.auction), () => ( 0n)),
                hyperSwap = _nullishCoalesce((currentApps == null ? void 0 : currentApps.hyperSwap), () => ( 0n)),
                raffle = _nullishCoalesce((currentApps == null ? void 0 : currentApps.raffle), () => ( 0n)),
                metaMerkles = _nullishCoalesce((currentApps == null ? void 0 : currentApps.metaMerkles), () => ( 0n)),
                marketplace = _nullishCoalesce((currentApps == null ? void 0 : currentApps.marketplace), () => ( 0n)),
                wallet: wallet2 = _nullishCoalesce((currentApps == null ? void 0 : currentApps.wallet), () => ( 0n))
              } = action.value;
              const abiData = {
                staking,
                rewards,
                pool,
                prizeBox,
                subscriptions,
                gate,
                auction,
                hyperSwap,
                raffle,
                metaMerkles,
                marketplace,
                wallet: wallet2
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "AkitaAppList", this.client.appClient.appSpec.structs);
              break;
            }
            case "sal": {
              const currentApps = await this.client.state.global.akitaSocialAppList();
              const {
                social = _nullishCoalesce((currentApps == null ? void 0 : currentApps.social), () => ( 0n)),
                graph = _nullishCoalesce((currentApps == null ? void 0 : currentApps.graph), () => ( 0n)),
                impact = _nullishCoalesce((currentApps == null ? void 0 : currentApps.impact), () => ( 0n)),
                moderation = _nullishCoalesce((currentApps == null ? void 0 : currentApps.moderation), () => ( 0n))
              } = action.value;
              const abiData = {
                social,
                graph,
                impact,
                moderation
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "AkitaSocialAppList", this.client.appClient.appSpec.structs);
              break;
            }
            case "pal": {
              const currentApps = await this.client.state.global.pluginAppList();
              const {
                optin = _nullishCoalesce((currentApps == null ? void 0 : currentApps.optin), () => ( 0n)),
                revenueManager = _nullishCoalesce((currentApps == null ? void 0 : currentApps.revenueManager), () => ( 0n)),
                update = _nullishCoalesce((currentApps == null ? void 0 : currentApps.update), () => ( 0n))
              } = action.value;
              data = _apparc56.getABIEncodedValue.call(void 0, { optin, revenueManager, update }, "PluginAppList", this.client.appClient.appSpec.structs);
              break;
            }
            case "oal": {
              const currentApps = await this.client.state.global.otherAppList();
              const {
                vrfBeacon = _nullishCoalesce((currentApps == null ? void 0 : currentApps.vrfBeacon), () => ( 0n)),
                nfdRegistry = _nullishCoalesce((currentApps == null ? void 0 : currentApps.nfdRegistry), () => ( 0n)),
                assetInbox = _nullishCoalesce((currentApps == null ? void 0 : currentApps.assetInbox), () => ( 0n)),
                escrow = _nullishCoalesce((currentApps == null ? void 0 : currentApps.escrow), () => ( 0n)),
                poll = _nullishCoalesce((currentApps == null ? void 0 : currentApps.poll), () => ( 0n)),
                akitaNfd = _nullishCoalesce((currentApps == null ? void 0 : currentApps.akitaNfd), () => ( 0n))
              } = action.value;
              const abiData = {
                vrfBeacon,
                nfdRegistry,
                assetInbox,
                escrow,
                poll,
                akitaNfd
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "OtherAppList", this.client.appClient.appSpec.structs);
              break;
            }
            case "wallet_fees": {
              const currentFees = await this.client.state.global.walletFees();
              const {
                createFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.createFee), () => ( 0n))
              } = action.value;
              data = _apparc56.getABIEncodedValue.call(void 0, { createFee }, "WalletFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "social_fees": {
              const currentFees = await this.client.state.global.socialFees();
              const {
                postFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.postFee), () => ( 0n)),
                reactFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.reactFee), () => ( 0n)),
                impactTaxMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMin), () => ( 0n)),
                impactTaxMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMax), () => ( 0n))
              } = action.value;
              const abiData = {
                postFee,
                reactFee,
                impactTaxMin,
                impactTaxMax
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "SocialFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "staking_fees": {
              const currentFees = await this.client.state.global.stakingFees();
              const {
                creationFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.creationFee), () => ( 0n)),
                impactTaxMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMin), () => ( 0n)),
                impactTaxMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMax), () => ( 0n))
              } = action.value;
              const abiData = {
                creationFee,
                impactTaxMin,
                impactTaxMax
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "StakingFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "subscription_fees": {
              const currentFees = await this.client.state.global.subscriptionFees();
              const {
                serviceCreationFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.serviceCreationFee), () => ( 0n)),
                paymentPercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.paymentPercentage), () => ( 0n)),
                triggerPercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.triggerPercentage), () => ( 0n))
              } = action.value;
              const abiData = {
                serviceCreationFee,
                paymentPercentage,
                triggerPercentage
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "SubscriptionFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "nft_fees": {
              const currentFees = await this.client.state.global.nftFees();
              const {
                marketplaceSalePercentageMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.marketplaceSalePercentageMin), () => ( 0n)),
                marketplaceSalePercentageMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.marketplaceSalePercentageMax), () => ( 0n)),
                marketplaceComposablePercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.marketplaceComposablePercentage), () => ( 0n)),
                marketplaceRoyaltyDefaultPercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.marketplaceRoyaltyDefaultPercentage), () => ( 0n)),
                shuffleSalePercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.shuffleSalePercentage), () => ( 0n)),
                omnigemSaleFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.omnigemSaleFee), () => ( 0n)),
                auctionCreationFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.auctionCreationFee), () => ( 0n)),
                auctionSaleImpactTaxMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.auctionSaleImpactTaxMin), () => ( 0n)),
                auctionSaleImpactTaxMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.auctionSaleImpactTaxMax), () => ( 0n)),
                auctionComposablePercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.auctionComposablePercentage), () => ( 0n)),
                auctionRafflePercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.auctionRafflePercentage), () => ( 0n)),
                raffleCreationFee = _nullishCoalesce((currentFees == null ? void 0 : currentFees.raffleCreationFee), () => ( 0n)),
                raffleSaleImpactTaxMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.raffleSaleImpactTaxMin), () => ( 0n)),
                raffleSaleImpactTaxMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.raffleSaleImpactTaxMax), () => ( 0n)),
                raffleComposablePercentage = _nullishCoalesce((currentFees == null ? void 0 : currentFees.raffleComposablePercentage), () => ( 0n))
              } = action.value;
              const abiData = {
                marketplaceSalePercentageMin,
                marketplaceSalePercentageMax,
                marketplaceComposablePercentage,
                marketplaceRoyaltyDefaultPercentage,
                shuffleSalePercentage,
                omnigemSaleFee,
                auctionCreationFee,
                auctionSaleImpactTaxMin,
                auctionSaleImpactTaxMax,
                auctionComposablePercentage,
                auctionRafflePercentage,
                raffleCreationFee,
                raffleSaleImpactTaxMin,
                raffleSaleImpactTaxMax,
                raffleComposablePercentage
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "NftFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "swap_fees": {
              const currentFees = await this.client.state.global.swapFees();
              const {
                impactTaxMin = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMin), () => ( 0n)),
                impactTaxMax = _nullishCoalesce((currentFees == null ? void 0 : currentFees.impactTaxMax), () => ( 0n))
              } = action.value;
              const abiData = {
                impactTaxMin,
                impactTaxMax
              };
              data = _apparc56.getABIEncodedValue.call(void 0, abiData, "SwapFees", this.client.appClient.appSpec.structs);
              break;
            }
            case "akita_assets": {
              const currentAssets = await this.client.state.global.akitaAssets();
              const {
                akta = _nullishCoalesce((currentAssets == null ? void 0 : currentAssets.akta), () => ( 0n)),
                bones = _nullishCoalesce((currentAssets == null ? void 0 : currentAssets.bones), () => ( 0n))
              } = action.value;
              data = _apparc56.getABIEncodedValue.call(void 0, { akta, bones }, "AkitaAssets", this.client.appClient.appSpec.structs);
              break;
            }
            case "upgrade_app_ps":
            case "add_plugin_ps":
            case "remove_plugin_ps":
            case "add_allowance_ps":
            case "remove_allowance_ps":
            case "new_escrow_ps":
            case "update_fields_ps": {
              data = _apparc56.getABIEncodedValue.call(void 0, action.value, "ProposalSettings", this.client.appClient.appSpec.structs);
              break;
            }
            case "revenue_splits": {
              data = _apparc56.getABIEncodedValue.call(void 0, SplitsToTuples(action.value), "((uint64,string),uint8,uint64)[]", this.client.appClient.appSpec.structs);
              break;
            }
            default:
              throw new Error(`Unsupported field`);
          }
          abiAction = { field: action.field, value: data };
          structType = "ProposalUpdateField";
          break;
        }
        default: {
          throw new Error(`Unsupported proposal action type`);
        }
      }
      preppedActions.push([
        typedAction.type,
        _apparc56.getABIEncodedValue.call(void 0, abiAction, structType, this.typeClient.appClient.appSpec.structs)
      ]);
    }
    return preppedActions;
  }
  async initialize(params) {
    const sendParams = this.getSendParams(params);
    return await this.client.send.initialize({
      ...sendParams,
      args: {}
    });
  }
  async newProposal({
    sender,
    signer,
    cid = EMPTY_CID,
    actions,
    consolidateFees = true
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const preppedActions = await this.prepProposalActions(actions);
    const group = this.client.newGroup();
    const { total } = await this.client.proposalCost({ args: { actions: preppedActions } });
    const payment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress.toString(),
      amount: _algokitutils.microAlgo.call(void 0, total)
    });
    group.newProposal({
      ...sendParams,
      args: {
        payment,
        cid,
        actions: preppedActions
      }
    });
    for (let i = 0; i < actions.length; i++) {
      group.opUp({ args: {}, note: `${i}` });
    }
    const length = await (await group.composer()).count();
    const suggestedParams = await this.client.algorand.getSuggestedParams();
    const foundation = (await (await group.composer()).build()).atc;
    const maxFees = /* @__PURE__ */ new Map();
    for (let i = 0; i < length; i += 1) {
      maxFees.set(i, _algokitutils.microAlgo.call(void 0, 257e3));
    }
    const populatedGroup = await _algokitutils.prepareGroupForSending.call(void 0, 
      foundation,
      this.client.algorand.client.algod,
      {
        coverAppCallInnerTransactionFees: true,
        populateAppCallResources: true
      },
      {
        maxFees,
        suggestedParams
      }
    );
    let overwrite = {};
    if (consolidateFees) {
      const feeConsolidation = populatedGroup.clone().buildGroup();
      const totalFees = feeConsolidation.reduce((acc, txn) => acc + txn.txn.fee, 0n);
      overwrite.fees = new Map([
        [0, _algokitutils.microAlgo.call(void 0, totalFees)],
        ...Array.from({ length: length - 1 }, (_, i) => [i + 1, _algokitutils.microAlgo.call(void 0, 0)])
      ]);
    }
    const finalGroup = _chunk56YZPYCLjs.forceProperties.call(void 0, populatedGroup, overwrite);
    const groupId = finalGroup.buildGroup()[0].txn.group.toString();
    const { methodResults, ...rest } = await finalGroup.execute(this.client.algorand.client.algod, 10);
    return { groupId, ...rest, return: methodResults ? methodResults[0].returnValue : void 0 };
  }
  async editProposal({
    sender,
    signer,
    id,
    cid,
    actions
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const preppedActions = await this.prepProposalActions(actions);
    const req = await Promise.allSettled([
      this.client.state.box.proposals.value(id),
      this.client.proposalCost({ args: { actions: preppedActions } })
    ]);
    if (req[0].status === "rejected" || req[0].value === void 0) {
      throw new Error(`Proposal with id: ${id} not found`);
    }
    const { feesPaid } = req[0].value;
    if (req[1].status === "rejected") {
      throw new Error(`Failed to calculate proposal cost: ${req[1].reason}`);
    }
    const results = req[1].value;
    const cost = _nullishCoalesce(results.total, () => ( 0n));
    let paymentRequired = feesPaid < cost;
    if (paymentRequired) {
      const payment = this.client.algorand.createTransaction.payment({
        ...sendParams,
        receiver: this.client.appAddress.toString(),
        amount: _algokitutils.microAlgo.call(void 0, cost - feesPaid)
      });
      return await this.client.send.editProposalWithPayment({
        ...sendParams,
        args: {
          payment,
          id,
          cid,
          actions: preppedActions
        }
      });
    } else {
      return await this.client.send.editProposal({
        ...sendParams,
        args: {
          id,
          cid,
          actions: preppedActions
        }
      });
    }
  }
  async submitProposal({ sender, signer, proposalId }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    return await this.client.send.submitProposal({
      ...sendParams,
      args: { proposalId }
    });
  }
  async voteProposal({ proposalId, vote, sender, signer }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrPayment = this.client.algorand.createTransaction.payment({
      ...sendParams,
      receiver: this.client.appAddress.toString(),
      amount: _algokitutils.microAlgo.call(void 0, DAOProposalVotesMBR)
    });
    return await this.client.send.voteProposal({
      ...sendParams,
      args: { mbrPayment, proposalId, vote }
    });
  }
  async finalizeProposal({ sender, signer, proposalId }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    return await this.client.send.finalizeProposal({
      ...sendParams,
      args: { proposalId }
    });
  }
  async executeProposal({ proposalId, sender, signer }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    return await this.client.send.executeProposal({
      ...sendParams,
      args: { proposalId }
    });
  }
  async getGlobalState() {
    return await this.client.state.global.getAll();
  }
  async setupCost(params) {
    const sendParams = this.getSendParams({
      sender: this.readerAccount,
      signer: _chunkHY3H6JQIjs.emptySigner,
      ...params
    });
    const cost = await this.client.setupCost({
      ...sendParams,
      args: {}
    });
    return cost;
  }
  async proposalCost({ sender, signer, actions }) {
    const sendParams = this.getSendParams({
      sender: _nullishCoalesce(sender, () => ( this.readerAccount)),
      signer: _nullishCoalesce(signer, () => ( _chunkHY3H6JQIjs.emptySigner))
    });
    const requirements = await this.client.proposalCost({
      ...sendParams,
      args: { actions: await this.prepProposalActions(actions) }
    });
    return requirements;
  }
  /**
   * Maps proposal action type enum to its corresponding struct type name
   */
  getActionStructType(actionType) {
    switch (actionType) {
      case 10 /* UpgradeApp */:
        return "ProposalUpgradeApp";
      case 20 /* AddPlugin */:
        return "ProposalAddPlugin";
      case 21 /* AddNamedPlugin */:
        return "ProposalAddNamedPlugin";
      case 30 /* ExecutePlugin */:
        return "ProposalExecutePlugin";
      case 31 /* RemoveExecutePlugin */:
        return "ProposalRemoveExecutePlugin";
      case 40 /* RemovePlugin */:
        return "ProposalRemovePlugin";
      case 41 /* RemoveNamedPlugin */:
        return "ProposalRemoveNamedPlugin";
      case 50 /* AddAllowances */:
        return "ProposalAddAllowances";
      case 60 /* RemoveAllowances */:
        return "ProposalRemoveAllowances";
      case 70 /* NewEscrow */:
        return "ProposalNewEscrow";
      case 71 /* ToggleEscrowLock */:
        return "ProposalToggleEscrowLock";
      case 80 /* UpdateFields */:
        return "ProposalUpdateField";
      default:
        throw new Error(`Unknown proposal action type: ${actionType}`);
    }
  }
  /**
   * Decodes the raw action bytes into their typed struct representation
   */
  decodeProposalAction(actionType, actionData) {
    const structType = this.getActionStructType(actionType);
    const structs = this.typeClient.appClient.appSpec.structs;
    switch (actionType) {
      case 10 /* UpgradeApp */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 10 /* UpgradeApp */, ...decoded };
      }
      case 20 /* AddPlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 20 /* AddPlugin */, ...decoded };
      }
      case 21 /* AddNamedPlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 21 /* AddNamedPlugin */, ...decoded };
      }
      case 30 /* ExecutePlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 30 /* ExecutePlugin */, ...decoded };
      }
      case 31 /* RemoveExecutePlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 31 /* RemoveExecutePlugin */, ...decoded };
      }
      case 40 /* RemovePlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 40 /* RemovePlugin */, ...decoded };
      }
      case 41 /* RemoveNamedPlugin */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 41 /* RemoveNamedPlugin */, ...decoded };
      }
      case 50 /* AddAllowances */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 50 /* AddAllowances */, ...decoded };
      }
      case 60 /* RemoveAllowances */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 60 /* RemoveAllowances */, ...decoded };
      }
      case 70 /* NewEscrow */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 70 /* NewEscrow */, ...decoded };
      }
      case 71 /* ToggleEscrowLock */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 71 /* ToggleEscrowLock */, ...decoded };
      }
      case 80 /* UpdateFields */: {
        const decoded = _apparc56.getABIDecodedValue.call(void 0, actionData, structType, structs);
        return { type: 80 /* UpdateFields */, ...decoded };
      }
      default:
        throw new Error(`Unknown proposal action type: ${actionType}`);
    }
  }
  /**
   * Fetches a proposal by ID and decodes all action data into typed structs
   */
  async getProposal(proposalId) {
    const proposal = await this.client.getProposal({ args: { proposalId } });
    if (!proposal) {
      throw new Error(`Proposal with id: ${proposalId} not found`);
    }
    const decodedActions = proposal.actions.map(([actionType, actionData]) => {
      return this.decodeProposalAction(actionType, actionData);
    });
    return {
      status: proposal.status,
      cid: proposal.cid,
      votes: proposal.votes,
      creator: proposal.creator,
      votingTs: proposal.votingTs,
      created: proposal.created,
      feesPaid: proposal.feesPaid,
      actions: decodedActions
    };
  }
}, _class2);








exports.SplitDistributionType = SplitDistributionType; exports.SplitsToTuples = SplitsToTuples; exports.ProposalActionEnum = ProposalActionEnum; exports.EMPTY_CID = EMPTY_CID; exports.DAOProposalVotesMBR = DAOProposalVotesMBR; exports.AkitaDaoSDK = AkitaDaoSDK;
//# sourceMappingURL=chunk-NNKGDJGH.js.map