"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingPowerGateClient = exports.StakingPowerGateFactory = exports.StakingPowerGateParamsFactory = exports.APP_SPEC = void 0;
exports.StakingPowerGateRegistryInfoFromTuple = StakingPowerGateRegistryInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "StakingPowerGate", "structs": { "StakingPowerGateRegistryInfo": [{ "name": "op", "type": "uint8" }, { "name": "asset", "type": "uint64" }, { "name": "power", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint8,uint64,uint64)", "struct": "StakingPowerGateRegistryInfo", "name": "shape" }], "returns": { "type": "(uint8,uint64,uint64)", "struct": "StakingPowerGateRegistryInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "StakingPowerGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [448, 748], "errorMessage": "Box must have value" }, { "pc": [522], "errorMessage": "Bytes has valid prefix" }, { "pc": [361, 445], "errorMessage": "Invalid number of arguments" }, { "pc": [378], "errorMessage": "Invalid payment" }, { "pc": [229, 251], "errorMessage": "Invalid percentage" }, { "pc": [131], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [792], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [790], "errorMessage": "application exists" }, { "pc": [385], "errorMessage": "bad operation check" }, { "pc": [389, 468, 777], "errorMessage": "check GlobalState exists" }, { "pc": [311, 351, 439], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [270], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [527], "errorMessage": "invalid number of bytes for (uint64,uint64,uint64)" }, { "pc": [730], "errorMessage": "invalid number of bytes for (uint8,uint64,uint64)" }, { "pc": [281, 425, 744, 770], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [417], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [338], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggMiAxMDAwMDAwCiAgICBieXRlY2Jsb2NrIDB4MTUxZjdjNzUgImFraXRhX2RhbyIgInJlZ2lzdHJ5X2N1cnNvciIgIiIgMHgwMDAwMDAwMDAwMDAwMTZkMDAwMDAwMDAwMDBmNDI0MAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJueiBtYWluX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MzkKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgaW50Y18xIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo0MQogICAgLy8gcmVnaXN0cmF0aW9uU2hhcGUgPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsgaW5pdGlhbFZhbHVlOiAnKHVpbnQ4LHVpbnQ2NCx1aW50NjQpJywga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyYXRpb25TaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAicmVnaXN0cmF0aW9uX3NoYXBlIiAiKHVpbnQ4LHVpbnQ2NCx1aW50NjQpIiAvLyAicmVnaXN0cmF0aW9uX3NoYXBlIiwgIih1aW50OCx1aW50NjQsdWludDY0KSIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gY2hlY2tTaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICcnLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleUNoZWNrU2hhcGUgfSkKICAgIHB1c2hieXRlcyAiY2hlY2tfc2hhcGUiCiAgICBieXRlY18zIC8vICIiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czozNQogICAgLy8gZXhwb3J0IGNsYXNzIFN0YWtpbmdQb3dlckdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMTMKICAgIHB1c2hieXRlc3MgMHgzMjlmMDRlZSAweDc3YmI3OWI5IDB4NmUwM2Y1MGEgMHhiNWRjNjYzNyAweDkwZDRmYTVkIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAvLyBtZXRob2QgImNvc3QoYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXIocGF5LGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgImNoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXSlib29sIiwgbWV0aG9kICJnZXRSZWdpc3RyYXRpb25TaGFwZSgodWludDgsdWludDY0LHVpbnQ2NCkpKHVpbnQ4LHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJnZXRFbnRyeSh1aW50NjQpYnl0ZVtdIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBTyh1aW50NjQpdm9pZCIsIG1ldGhvZCAib3BVcCgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNvc3QgcmVnaXN0ZXIgY2hlY2sgZ2V0UmVnaXN0cmF0aW9uU2hhcGUgZ2V0RW50cnkgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDExCiAgICBlcnIKCm1haW5fb3BVcF9yb3V0ZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQzCiAgICAvLyBvcFVwKCk6IHZvaWQgeyB9CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2NyZWF0ZV9Ob09wQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MzUKICAgIC8vIGV4cG9ydCBjbGFzcyBTdGFraW5nUG93ZXJHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjp3aWRlUmF0aW8obnVtZXJhdG9yczogYnl0ZXMsIGRlbm9taW5hdG9yczogYnl0ZXMpIC0+IHVpbnQ2NDoKd2lkZVJhdGlvOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMTMKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiB3aWRlUmF0aW8obnVtZXJhdG9yczogW3VpbnQ2NCwgdWludDY0XSwgZGVub21pbmF0b3JzOiBbdWludDY0LCB1aW50NjRdKTogdWludDY0IHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMTQKICAgIC8vIGFzc2VydChkZW5vbWluYXRvcnNbMF0gPiAwICYmIGRlbm9taW5hdG9yc1sxXSA+IDAsIEVSUl9JTlZBTElEX1BFUkNFTlRBR0UpCiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBieiB3aWRlUmF0aW9fYm9vbF9mYWxzZUAzCiAgICBmcmFtZV9kaWcgLTEKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgYnogd2lkZVJhdGlvX2Jvb2xfZmFsc2VAMwogICAgaW50Y18xIC8vIDEKCndpZGVSYXRpb19ib29sX21lcmdlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjExNAogICAgLy8gYXNzZXJ0KGRlbm9taW5hdG9yc1swXSA+IDAgJiYgZGVub21pbmF0b3JzWzFdID4gMCwgRVJSX0lOVkFMSURfUEVSQ0VOVEFHRSkKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBlcmNlbnRhZ2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTE1CiAgICAvLyBjb25zdCBbb3ZlcmZsb3csIHJlc3VsdF0gPSBvcC5kaXZtb2R3KC4uLm9wLm11bHcoLi4ubnVtZXJhdG9ycyksIC4uLm9wLm11bHcoLi4uZGVub21pbmF0b3JzKSkKICAgIGZyYW1lX2RpZyAtMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9kaWcgLTIKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgbXVsdwogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2RpZyAwCiAgICBtdWx3CiAgICBkaXZtb2R3CiAgICBwb3BuIDIKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTE2CiAgICAvLyBhc3NlcnQob3ZlcmZsb3cgPT09IDAsIEVSUl9JTlZBTElEX1BFUkNFTlRBR0UpCiAgICAhCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwZXJjZW50YWdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjExNwogICAgLy8gcmV0dXJuIHJlc3VsdAogICAgc3dhcAogICAgcmV0c3ViCgp3aWRlUmF0aW9fYm9vbF9mYWxzZUAzOgogICAgaW50Y18wIC8vIDAKICAgIGIgd2lkZVJhdGlvX2Jvb2xfbWVyZ2VANAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nUG93ZXJHYXRlLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjc3CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIHB1c2hieXRlcyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjc5CiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjgwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NzcKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuY29zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo4NQogICAgLy8gY29zdChhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDAzMGQ0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo6U3Rha2luZ1Bvd2VyR2F0ZS5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6ODkKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGR1cAogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjkwCiAgICAvLyBhc3NlcnQoYXJncy5sZW5ndGggPT09IENoZWNrQXJnc0J5dGVzTGVuZ3RoLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNyAvLyAxNwogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjkxLTk4CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IFN0YWtpbmdQb3dlckdhdGVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjk0CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OTEtOTgKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogU3Rha2luZ1Bvd2VyR2F0ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDMKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OTUKICAgIC8vIGFtb3VudDogU3Rha2luZ1Bvd2VyR2F0ZVJlZ2lzdHJ5TUJSCiAgICBwdXNoaW50IDEyNTAwIC8vIDEyNTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo5MS05OAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBTdGFraW5nUG93ZXJHYXRlUmVnaXN0cnlNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czoxMDEKICAgIC8vIGFzc2VydChwYXJhbXMub3AuYXNVaW50NjQoKSA8PSA2LCBFUlJfQkFEX09QRVJBVElPTikKICAgIHN3YXAKICAgIGludGNfMyAvLyAyCiAgICBnZXRieXRlCiAgICBwdXNoaW50IDYgLy8gNgogICAgPD0KICAgIGFzc2VydCAvLyBiYWQgb3BlcmF0aW9uIGNoZWNrCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo1MgogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MzkKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NTIKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjM5CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czoxMDMKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gY2xvbmUocGFyYW1zKQogICAgaXRvYgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjg5CiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo6U3Rha2luZ1Bvd2VyR2F0ZS5jaGVja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmNoZWNrOgogICAgYnl0ZWNfMyAvLyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czoxMDcKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjEwOAogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSAwLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBsZW4KICAgICEKICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjEwOQogICAgLy8gY29uc3QgeyBvcCwgYXNzZXQsIHBvd2VyIH0gPSBjbG9uZSh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgZXh0cmFjdCAwIDEKICAgIGNvdmVyIDIKICAgIGR1cAogICAgZXh0cmFjdCAxIDgKICAgIHN3YXAKICAgIHB1c2hpbnQgOSAvLyA5CiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIHB1c2hieXRlcyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1Ni00NjUKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBTdGFraW5nLnByb3RvdHlwZS5nZXRJbmZvPih7CiAgICAvLyAgIGFwcElkOiBzdGFraW5nQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgdXNlciwKICAgIC8vICAgICB7CiAgICAvLyAgICAgICBhc3NldCwKICAgIC8vICAgICAgIHR5cGU6IFNUQUtJTkdfVFlQRV9MT0NLLAogICAgLy8gICAgIH0sCiAgICAvLyAgIF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NjAtNDYzCiAgICAvLyB7CiAgICAvLyAgIGFzc2V0LAogICAgLy8gICB0eXBlOiBTVEFLSU5HX1RZUEVfTE9DSywKICAgIC8vIH0sCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ2MgogICAgLy8gdHlwZTogU1RBS0lOR19UWVBFX0xPQ0ssCiAgICBwdXNoYnl0ZXMgMHgyOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NjAtNDYzCiAgICAvLyB7CiAgICAvLyAgIGFzc2V0LAogICAgLy8gICB0eXBlOiBTVEFLSU5HX1RZUEVfTE9DSywKICAgIC8vIH0sCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDU2LTQ2NQogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGw8dHlwZW9mIFN0YWtpbmcucHJvdG90eXBlLmdldEluZm8+KHsKICAgIC8vICAgYXBwSWQ6IHN0YWtpbmdBcHAsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB1c2VyLAogICAgLy8gICAgIHsKICAgIC8vICAgICAgIGFzc2V0LAogICAgLy8gICAgICAgdHlwZTogU1RBS0lOR19UWVBFX0xPQ0ssCiAgICAvLyAgICAgfSwKICAgIC8vICAgXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHhjOTA2ODgwOSAvLyBtZXRob2QgImdldEluZm8oYWRkcmVzcywodWludDY0LHVpbnQ4KSkodWludDY0LHVpbnQ2NCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cG4gMgogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGxlbgogICAgcHVzaGludCAyNCAvLyAyNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKHVpbnQ2NCx1aW50NjQsdWludDY0KQogICAgcHVzaGludCAyMCAvLyAyMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NjcKICAgIC8vIGlmIChpbmZvLmV4cGlyYXRpb24gPD0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCkgewogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgPD0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NjgKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA1CgpjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OmdldFN0YWtpbmdQb3dlckA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NjUKICAgIC8vIGNhc2UgRXF1YWw6IHJldHVybiB1c2VyUG93ZXIgPT09IHBvd2VyCiAgICBkaWcgMwogICAgcHVzaGJ5dGVzIDB4MGEKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDgKICAgIGRpZyA0CiAgICBkaWcgMwogICAgPT0KCmNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuc3Rha2luZ1Bvd2VyR2F0ZUAxOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjEwNwogICAgLy8gY2hlY2soY2FsbGVyOiBBY2NvdW50LCByZWdpc3RyeUlEOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKTogYm9vbGVhbiB7CiAgICBwdXNoYnl0ZXMgMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgpjaGVja19hZnRlcl9pZl9lbHNlQDg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo2NgogICAgLy8gY2FzZSBOb3RFcXVhbDogcmV0dXJuIHVzZXJQb3dlciAhPT0gcG93ZXIKICAgIGRpZyAzCiAgICBwdXNoYnl0ZXMgMHgxNAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTAKICAgIGRpZyA0CiAgICBkaWcgMwogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gcmV0dXJuIHRoaXMuc3Rha2luZ1Bvd2VyR2F0ZShjYWxsZXIsIG9wLCBhc3NldCwgcG93ZXIpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuc3Rha2luZ1Bvd2VyR2F0ZUAxOQoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjY3CiAgICAvLyBjYXNlIExlc3NUaGFuOiByZXR1cm4gdXNlclBvd2VyIDwgcG93ZXIKICAgIGRpZyAzCiAgICBwdXNoYnl0ZXMgMHgxZQogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTIKICAgIGRpZyA0CiAgICBkaWcgMwogICAgPAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nUG93ZXJHYXRlKGNhbGxlciwgb3AsIGFzc2V0LCBwb3dlcikKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo6U3Rha2luZ1Bvd2VyR2F0ZS5zdGFraW5nUG93ZXJHYXRlQDE5CgpjaGVja19hZnRlcl9pZl9lbHNlQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NjgKICAgIC8vIGNhc2UgTGVzc1RoYW5PckVxdWFsVG86IHJldHVybiB1c2VyUG93ZXIgPD0gcG93ZXIKICAgIGRpZyAzCiAgICBwdXNoYnl0ZXMgMHgyOAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTQKICAgIGRpZyA0CiAgICBkaWcgMwogICAgPD0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gcmV0dXJuIHRoaXMuc3Rha2luZ1Bvd2VyR2F0ZShjYWxsZXIsIG9wLCBhc3NldCwgcG93ZXIpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuc3Rha2luZ1Bvd2VyR2F0ZUAxOQoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjY5CiAgICAvLyBjYXNlIEdyZWF0ZXJUaGFuOiByZXR1cm4gdXNlclBvd2VyID4gcG93ZXIKICAgIGRpZyAzCiAgICBwdXNoYnl0ZXMgMHgzMgogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTYKICAgIGRpZyA0CiAgICBkaWcgMwogICAgPgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nUG93ZXJHYXRlKGNhbGxlciwgb3AsIGFzc2V0LCBwb3dlcikKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czo6U3Rha2luZ1Bvd2VyR2F0ZS5zdGFraW5nUG93ZXJHYXRlQDE5CgpjaGVja19hZnRlcl9pZl9lbHNlQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NzAKICAgIC8vIGNhc2UgR3JlYXRlclRoYW5PckVxdWFsVG86IHJldHVybiB1c2VyUG93ZXIgPj0gcG93ZXIKICAgIGRpZyAzCiAgICBwdXNoYnl0ZXMgMHgzYwogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTgKICAgIGRpZyA0CiAgICBkaWcgMwogICAgPj0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gcmV0dXJuIHRoaXMuc3Rha2luZ1Bvd2VyR2F0ZShjYWxsZXIsIG9wLCBhc3NldCwgcG93ZXIpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuc3Rha2luZ1Bvd2VyR2F0ZUAxOQoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjcxCiAgICAvLyBkZWZhdWx0OiByZXR1cm4gZmFsc2UKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctcG93ZXIvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHJldHVybiB0aGlzLnN0YWtpbmdQb3dlckdhdGUoY2FsbGVyLCBvcCwgYXNzZXQsIHBvd2VyKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nUG93ZXJHYXRlLnN0YWtpbmdQb3dlckdhdGVAMTkKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDcxCiAgICAvLyBjb25zdCByZW1haW5pbmdUaW1lOiB1aW50NjQgPSBpbmZvLmV4cGlyYXRpb24gLSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBkdXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIC0KICAgIGR1cAogICAgYnVyeSA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ3MwogICAgLy8gaWYgKHJlbWFpbmluZ1RpbWUgPCBPTkVfV0VFSykgewogICAgcHVzaGludCA2MDQ4MDAgLy8gNjA0ODAwCiAgICA8CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDc0CiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6NTgtNjIKICAgIC8vIGNvbnN0IHVzZXJQb3dlciA9IGdldFN0YWtpbmdQb3dlcigKICAgIC8vICAgZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICAvLyAgIHVzZXIsCiAgICAvLyAgIGFzc2V0CiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6Z2V0U3Rha2luZ1Bvd2VyQDYKCmNoZWNrX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDc3CiAgICAvLyBjb25zdCByZW1haW5pbmdEYXlzOiB1aW50NjQgPSByZW1haW5pbmdUaW1lIC8gT05FX0RBWQogICAgZGlnIDUKICAgIHB1c2hpbnQgODY0MDAgLy8gODY0MDAKICAgIC8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDc4CiAgICAvLyByZXR1cm4gb3AuZGl2dyguLi5vcC5tdWx3KHdpZGVSYXRpbyhbaW5mby5hbW91bnQsIDFfMDAwXzAwMF0sIFtPTkVfWUVBUl9JTl9EQVlTLCAxXzAwMF8wMDBdKSwgcmVtYWluaW5nRGF5cyksIDFfMDAwXzAwMCkKICAgIGRpZyAyCiAgICBleHRyYWN0IDQgOAogICAgaW50YyA0IC8vIDEwMDAwMDAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZHVwCiAgICBieXRlYyA0IC8vIDB4MDAwMDAwMDAwMDAwMDE2ZDAwMDAwMDAwMDAwZjQyNDAKICAgIGNhbGxzdWIgd2lkZVJhdGlvCiAgICBkaWcgMgogICAgbXVsdwogICAgcG9wCiAgICBjb3ZlciAyCiAgICBieXRlYyA0IC8vIDB4MDAwMDAwMDAwMDAwMDE2ZDAwMDAwMDAwMDAwZjQyNDAKICAgIGNhbGxzdWIgd2lkZVJhdGlvCiAgICBtdWx3CiAgICBidXJ5IDEKICAgIGludGMgNCAvLyAxMDAwMDAwCiAgICBkaXZ3CiAgICBidXJ5IDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjU4LTYyCiAgICAvLyBjb25zdCB1c2VyUG93ZXIgPSBnZXRTdGFraW5nUG93ZXIoCiAgICAvLyAgIGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nLAogICAgLy8gICB1c2VyLAogICAgLy8gICBhc3NldAogICAgLy8gKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OmdldFN0YWtpbmdQb3dlckA2CgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuZ2V0UmVnaXN0cmF0aW9uU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRSZWdpc3RyYXRpb25TaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExMwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNyAvLyAxNwogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKHVpbnQ4LHVpbnQ2NCx1aW50NjQpCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdQb3dlckdhdGUuZ2V0RW50cnlbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRFbnRyeToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExOAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLXBvd2VyL2NvbnRyYWN0LmFsZ28udHM6MTIwCiAgICAvLyByZXR1cm4gZW5jb2RlQXJjNCh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1wb3dlci9jb250cmFjdC5hbGdvLnRzOjExOAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHB1c2hieXRlcyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAFAAEIAsCEPSYFBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcgAQAAAAAAAAAW0AAAAAAA9CQDEYQAA+KiNnggIScmVnaXN0cmF0aW9uX3NoYXBlFSh1aW50OCx1aW50NjQsdWludDY0KWeAC2NoZWNrX3NoYXBlK2cxGRREMRhBADuCBwQynwTuBHe7ebkEbgP1CgS13GY3BJDU+l0EM+kslASFTe3gNhoAjgcAawCIANYCEQIgAjoAAQAjQ4AEzZrWfjYaAI4BADEAigIBi/8iW0lBACGL/yRbQQAaI0SL/iJbi/4kWx2L/yRbiwAdH0YCTBRETIkiQv/jNhoBSSJZJQhLARUSRFcCADYaAkkVJBJEF4AHdmVyc2lvbk8CZylMZyNDNhoBSSJZJQhMFRJEgAwVH3x1AAAAAAAAMNSwI0MxFiMJSTgQIxJENhoBSSJZJQhLARUSRElXAgBJFYEREkRLAjgHMgoSTwM4CIHUYRIQREwlVYEGDkQiKmVESSMIKkxnFklPAr8oTFCwI0MrSTYaAUkVgSASRDYaAkkVJBJEFzYaA0kiWSUISwEVEkRXAgAVFEQWvkRJVwABTgJJVwEITIEJW04CIillRIADYWFsZUgiW7FMgAEoUIAEyQaICbIaTwKyGrIashiBBrIQIrIBs7Q+RwJXBABLAVcABCgSRBWBGBJEgRRbSTIHDkEAdyJFBUsDgAEKEkEAEksESwMSgAEAIk8CVChMULAjQ0sDgAEUEkEACEsESwMTQv/iSwOAAR4SQQAISwRLAwxC/9FLA4ABKBJBAAhLBEsDDkL/wEsDgAEyEkEACEsESwMNQv+vSwOAATwSQQAISwRLAw9C/54iQv+aSTIHCUlFB4GA9SQMQQAGIkUFQv93SwWBgKMFCksCVwQIIQQWUEknBIj+FksCHUhOAicEiP4LHUUBIQSXRQVC/0s2GgFJFYEREkQoTFCwI0M2GgFJFSQSRBcWvkRJFRZXBgJMUChMULAjQzYaAUkVJBJEFzEAIillRIAGd2FsbGV0ZUhyCEQSRClMZyND", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a StakingPowerGateRegistryInfo to the struct representation
 */
function StakingPowerGateRegistryInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.StakingPowerGateRegistryInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the StakingPowerGate smart contract
 */
class StakingPowerGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return StakingPowerGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the StakingPowerGate smart contract using the create(string,uint64)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(string,uint64)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.akitaDao],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the cost(byte[])uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static cost(params) {
        return {
            ...params,
            method: 'cost(byte[])uint64',
            args: Array.isArray(params.args) ? params.args : [params.args.args],
        };
    }
    /**
     * Constructs a no op call for the register(pay,byte[])uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static register(params) {
        return {
            ...params,
            method: 'register(pay,byte[])uint64',
            args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.args],
        };
    }
    /**
     * Constructs a no op call for the check(address,uint64,byte[])bool ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static check(params) {
        return {
            ...params,
            method: 'check(address,uint64,byte[])bool',
            args: Array.isArray(params.args) ? params.args : [params.args.caller, params.args.registryId, params.args.args],
        };
    }
    /**
     * Constructs a no op call for the getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the getEntry(uint64)byte[] ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getEntry(params) {
        return {
            ...params,
            method: 'getEntry(uint64)byte[]',
            args: Array.isArray(params.args) ? params.args : [params.args.registryId],
        };
    }
    /**
     * Constructs a no op call for the updateAkitaDAO(uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static updateAkitaDao(params) {
        return {
            ...params,
            method: 'updateAkitaDAO(uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.akitaDao],
        };
    }
    /**
     * Constructs a no op call for the opUp()void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static opUp(params) {
        return {
            ...params,
            method: 'opUp()void',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
}
exports.StakingPowerGateParamsFactory = StakingPowerGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the StakingPowerGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class StakingPowerGateFactory {
    /**
     * Creates a new instance of `StakingPowerGateFactory`
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
                 * Creates a new instance of the StakingPowerGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(StakingPowerGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the StakingPowerGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(StakingPowerGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the StakingPowerGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(StakingPowerGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new StakingPowerGateClient(result.appClient) };
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
        return new StakingPowerGateClient(this.appFactory.getAppClientById(params));
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
        return new StakingPowerGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the StakingPowerGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? StakingPowerGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new StakingPowerGateClient(result.appClient) };
    }
}
exports.StakingPowerGateFactory = StakingPowerGateFactory;
/**
 * A client to make calls to the StakingPowerGate smart contract
 */
class StakingPowerGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the StakingPowerGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(StakingPowerGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the StakingPowerGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(StakingPowerGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the StakingPowerGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingPowerGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(StakingPowerGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current StakingPowerGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current StakingPowerGate app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        registryCursor: result.registryCursor,
                        registrationShape: result.registrationShape,
                        checkShape: result.checkShape,
                        version: result.version,
                        akitaDao: result.akitaDAO,
                    };
                },
                /**
                 * Get the current value of the registryCursor key in global state
                 */
                registryCursor: async () => { return (await this.appClient.state.global.getValue("registryCursor")); },
                /**
                 * Get the current value of the registrationShape key in global state
                 */
                registrationShape: async () => { return (await this.appClient.state.global.getValue("registrationShape")); },
                /**
                 * Get the current value of the checkShape key in global state
                 */
                checkShape: async () => { return (await this.appClient.state.global.getValue("checkShape")); },
                /**
                 * Get the current value of the version key in global state
                 */
                version: async () => { return (await this.appClient.state.global.getValue("version")); },
                /**
                 * Get the current value of the akitaDAO key in global state
                 */
                akitaDao: async () => { return (await this.appClient.state.global.getValue("akitaDAO")); },
            },
            /**
             * Methods to access box state for the current StakingPowerGate app
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
                 * Get values from the registry map in box state
                 */
                registry: {
                    /**
                     * Get all current values of the registry map in box state
                     */
                    getMap: async () => { return (await this.appClient.state.box.getMap("registry")); },
                    /**
                     * Get a current value of the registry map by key from box state
                     */
                    value: async (key) => { return await this.appClient.state.box.getMapValue("registry", key); },
                },
            },
        };
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
     * Returns a new `StakingPowerGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new StakingPowerGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `StakingPowerGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new StakingPowerGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new StakingPowerGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the StakingPowerGate smart contract using the `getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getRegistrationShape(params) {
        const result = await this.appClient.send.call(StakingPowerGateParamsFactory.getRegistrationShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the StakingPowerGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(StakingPowerGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the StakingPowerGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the StakingPowerGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the StakingPowerGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64) method call against the StakingPowerGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint8,uint64,uint64))(uint8,uint64,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the StakingPowerGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the StakingPowerGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the StakingPowerGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the StakingPowerGate contract
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
exports.StakingPowerGateClient = StakingPowerGateClient;
//# sourceMappingURL=StakingPowerGateClient.js.map