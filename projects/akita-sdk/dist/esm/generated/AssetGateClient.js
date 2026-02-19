"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetGateClient = exports.AssetGateFactory = exports.AssetGateParamsFactory = exports.APP_SPEC = void 0;
exports.AssetGateRegistryInfoFromTuple = AssetGateRegistryInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "AssetGate", "structs": { "AssetGateRegistryInfo": [{ "name": "asset", "type": "uint64" }, { "name": "op", "type": "uint8" }, { "name": "value", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint64,uint8,uint64)", "struct": "AssetGateRegistryInfo", "name": "shape" }], "returns": { "type": "(uint64,uint8,uint64)", "struct": "AssetGateRegistryInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "AssetGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [370, 532], "errorMessage": "Box must have value" }, { "pc": [292, 367], "errorMessage": "Invalid number of arguments" }, { "pc": [309], "errorMessage": "Invalid payment" }, { "pc": [111], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [576], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [574], "errorMessage": "application exists" }, { "pc": [313, 561], "errorMessage": "check GlobalState exists" }, { "pc": [243, 283, 361], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [202], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [514], "errorMessage": "invalid number of bytes for (uint64,uint8,uint64)" }, { "pc": [213, 347, 528, 554], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [339], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [270], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDIgOAogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJyZWdpc3RyeV9jdXJzb3IiICJha2l0YV9kYW8iCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6MjgKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMSAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgaW50Y18wIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6MzEKICAgIC8vIHJlZ2lzdHJhdGlvblNoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJyh1aW50NjQsdWludDgsdWludDY0KScsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cmF0aW9uU2hhcGUgfSkKICAgIHB1c2hieXRlc3MgInJlZ2lzdHJhdGlvbl9zaGFwZSIgIih1aW50NjQsdWludDgsdWludDY0KSIgLy8gInJlZ2lzdHJhdGlvbl9zaGFwZSIsICIodWludDY0LHVpbnQ4LHVpbnQ2NCkiCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjMzCiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAiY2hlY2tfc2hhcGUiICIiIC8vICJjaGVja19zaGFwZSIsICIiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6MjQKICAgIC8vIGV4cG9ydCBjbGFzcyBBc3NldEdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMTMKICAgIHB1c2hieXRlc3MgMHgzMjlmMDRlZSAweDc3YmI3OWI5IDB4NmUwM2Y1MGEgMHhiNGQ0MTY3MiAweDkwZDRmYTVkIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAvLyBtZXRob2QgImNvc3QoYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXIocGF5LGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgImNoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXSlib29sIiwgbWV0aG9kICJnZXRSZWdpc3RyYXRpb25TaGFwZSgodWludDY0LHVpbnQ4LHVpbnQ2NCkpKHVpbnQ2NCx1aW50OCx1aW50NjQpIiwgbWV0aG9kICJnZXRFbnRyeSh1aW50NjQpYnl0ZVtdIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBTyh1aW50NjQpdm9pZCIsIG1ldGhvZCAib3BVcCgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNvc3QgcmVnaXN0ZXIgY2hlY2sgZ2V0UmVnaXN0cmF0aW9uU2hhcGUgZ2V0RW50cnkgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDExCiAgICBlcnIKCm1haW5fb3BVcF9yb3V0ZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQzCiAgICAvLyBvcFVwKCk6IHZvaWQgeyB9CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgptYWluX2NyZWF0ZV9Ob09wQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjI0CiAgICAvLyBleHBvcnQgY2xhc3MgQXNzZXRHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OkFzc2V0R2F0ZS5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6NjgKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgcHVzaGJ5dGVzICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzIgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo3MQogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IEFwcGxpY2F0aW9uKGFraXRhREFPKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OkFzc2V0R2F0ZS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo3NgogICAgLy8gY29zdChhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDAyNDU0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OkFzc2V0R2F0ZS5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjgwCiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjgxCiAgICAvLyBhc3NlcnQoYXJncy5sZW5ndGggPT09IEFzc2V0R2F0ZVJlZ2lzdHJ5SW5mb0J5dGVMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjgyLTg5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE9wZXJhdG9yQW5kVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo4NQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo4Mi04OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBPcGVyYXRvckFuZFZhbHVlUmVnaXN0cnlNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6ODYKICAgIC8vIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICBwdXNoaW50IDkzMDAgLy8gOTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjgyLTg5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE9wZXJhdG9yQW5kVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo0MgogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjI4CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzEgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo0MgogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIGR1cAogICAgaW50Y18wIC8vIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czoyOAogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18xIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo5MgogICAgLy8gdGhpcy5yZWdpc3RyeShpZCkudmFsdWUgPSBkZWNvZGVBcmM0PEFzc2V0R2F0ZVJlZ2lzdHJ5SW5mbz4oYXJncykKICAgIGl0b2IKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6ODAKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmNoZWNrW3JvdXRpbmddKCkgLT4gdm9pZDoKY2hlY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OTYKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo5NwogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSAwLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBsZW4KICAgICEKICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo5OAogICAgLy8gY29uc3QgeyBhc3NldCwgb3AsIHZhbHVlIH0gPSBjbG9uZSh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMQogICAgZXh0cmFjdCA4IDEKICAgIGNvdmVyIDMKICAgIHN3YXAKICAgIHB1c2hpbnQgOSAvLyA5CiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjQ5CiAgICAvLyBjb25zdCBbYmFsYW5jZSwgb3B0ZWRJbl0gPSBBc3NldEhvbGRpbmcuYXNzZXRCYWxhbmNlKHVzZXIsIGFzc2V0KQogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6NTEKICAgIC8vIGlmICghb3B0ZWRJbikgewogICAgYm56IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjUyCiAgICAvLyByZXR1cm4gZmFsc2UKICAgIGludGNfMSAvLyAwCgpjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmFzc2V0R2F0ZUAxNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo5NgogICAgLy8gY2hlY2soY2FsbGVyOiBBY2NvdW50LCByZWdpc3RyeUlEOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKTogYm9vbGVhbiB7CiAgICBwdXNoYnl0ZXMgMHgwMAogICAgaW50Y18xIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgpjaGVja19hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6NTYKICAgIC8vIGNhc2UgRXF1YWw6IHJldHVybiBiYWxhbmNlID09PSB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA1CiAgICBkdXAKICAgIGRpZyAyCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyByZXR1cm4gdGhpcy5hc3NldEdhdGUoY2FsbGVyLCBhc3NldCwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmFzc2V0R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjU3CiAgICAvLyBjYXNlIE5vdEVxdWFsOiByZXR1cm4gYmFsYW5jZSAhPT0gdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxNAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANwogICAgZHVwCiAgICBkaWcgMgogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo5OQogICAgLy8gcmV0dXJuIHRoaXMuYXNzZXRHYXRlKGNhbGxlciwgYXNzZXQsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OkFzc2V0R2F0ZS5hc3NldEdhdGVAMTYKCmNoZWNrX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo1OAogICAgLy8gY2FzZSBMZXNzVGhhbjogcmV0dXJuIGJhbGFuY2UgPCB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDFlCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA5CiAgICBkdXAKICAgIGRpZyAyCiAgICA8CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFzc2V0R2F0ZShjYWxsZXIsIGFzc2V0LCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjpBc3NldEdhdGUuYXNzZXRHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGNhc2UgTGVzc1RoYW5PckVxdWFsVG86IHJldHVybiBiYWxhbmNlIDw9IHZhbHVlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4MjgKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDExCiAgICBkdXAKICAgIGRpZyAyCiAgICA8PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyByZXR1cm4gdGhpcy5hc3NldEdhdGUoY2FsbGVyLCBhc3NldCwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmFzc2V0R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo2MAogICAgLy8gY2FzZSBHcmVhdGVyVGhhbjogcmV0dXJuIGJhbGFuY2UgPiB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDMyCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMwogICAgZHVwCiAgICBkaWcgMgogICAgPgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyByZXR1cm4gdGhpcy5hc3NldEdhdGUoY2FsbGVyLCBhc3NldCwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmFzc2V0R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo2MQogICAgLy8gY2FzZSBHcmVhdGVyVGhhbk9yRXF1YWxUbzogcmV0dXJuIGJhbGFuY2UgPj0gdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgzYwogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTUKICAgIGR1cAogICAgZGlnIDIKICAgID49CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFzc2V0R2F0ZShjYWxsZXIsIGFzc2V0LCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjpBc3NldEdhdGUuYXNzZXRHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDE1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjYyCiAgICAvLyBkZWZhdWx0OiByZXR1cm4gZmFsc2UKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFzc2V0R2F0ZShjYWxsZXIsIGFzc2V0LCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjpBc3NldEdhdGUuYXNzZXRHYXRlQDE2CgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9hc3NldC9jb250cmFjdC5hbGdvLnRzOjpBc3NldEdhdGUuZ2V0UmVnaXN0cmF0aW9uU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRSZWdpc3RyYXRpb25TaGFwZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czoxMDIKICAgIC8vIGdldFJlZ2lzdHJhdGlvblNoYXBlKHNoYXBlOiBBc3NldEdhdGVSZWdpc3RyeUluZm8pOiBBc3NldEdhdGVSZWdpc3RyeUluZm8gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMTcgLy8gMTcKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yICh1aW50NjQsdWludDgsdWludDY0KQogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czo6QXNzZXRHYXRlLmdldEVudHJ5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0RW50cnk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6MTA2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL2Fzc2V0L2NvbnRyYWN0LmFsZ28udHM6MTA4CiAgICAvLyByZXR1cm4gZW5jb2RlQXJjNCh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvYXNzZXQvY29udHJhY3QuYWxnby50czoxMDYKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzIgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBwdXNoYnl0ZXMgIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18yIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQACCCYDBBUffHUPcmVnaXN0cnlfY3Vyc29yCWFraXRhX2RhbzEYQAA/KSJnggIScmVnaXN0cmF0aW9uX3NoYXBlFSh1aW50NjQsdWludDgsdWludDY0KWeCAgtjaGVja19zaGFwZQBnMRkURDEYQQA7ggcEMp8E7gR3u3m5BG4D9QoEtNQWcgSQ1PpdBDPpLJQEhU3t4DYaAI4HADsAWACeAU0BXAF2AAEAIkOABM2a1n42GgCOAQABADYaAUkjWSQISwEVEkRXAgA2GgJJFSUSRBeAB3ZlcnNpb25PAmcqTGciQzYaAUkjWSQITBUSRIAMFR98dQAAAAAAACRUsCJDMRYiCUk4ECISRDYaAUkjWSQISwEVEkRXAgBJFYEREkRLATgHMgoSTwI4CIHUSBIQRCMpZURJIggpTGcWSU8CvyhMULAiQzYaAUkVgSASRDYaAkkVJRJEFzYaA0kjWSQISwEVEkRXAgAVFEQWvkRJI1tLAVcIAU4DTIEJW04CcABAAA4jgAEAI08CVChMULAiQ0sCgAEKEkEAB0lLAhJC/+NLAoABFBJBAAdJSwITQv/TSwKAAR4SQQAHSUsCDEL/w0sCgAEoEkEAB0lLAg5C/7NLAoABMhJBAAdJSwINQv+jSwKAATwSQQAHSUsCD0L/kyNC/482GgFJFYEREkQoTFCwIkM2GgFJFSUSRBcWvkRJFRZXBgJMUChMULAiQzYaAUkVJRJEFzEAIyplRIAGd2FsbGV0ZUhyCEQSRCpMZyJD", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a AssetGateRegistryInfo to the struct representation
 */
function AssetGateRegistryInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.AssetGateRegistryInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the AssetGate smart contract
 */
class AssetGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return AssetGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the AssetGate smart contract using the create(string,uint64)void ABI method
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
     * Constructs a no op call for the getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64)',
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
exports.AssetGateParamsFactory = AssetGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the AssetGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class AssetGateFactory {
    /**
     * Creates a new instance of `AssetGateFactory`
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
                 * Creates a new instance of the AssetGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(AssetGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the AssetGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(AssetGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the AssetGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(AssetGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new AssetGateClient(result.appClient) };
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
        return new AssetGateClient(this.appFactory.getAppClientById(params));
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
        return new AssetGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the AssetGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? AssetGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new AssetGateClient(result.appClient) };
    }
}
exports.AssetGateFactory = AssetGateFactory;
/**
 * A client to make calls to the AssetGate smart contract
 */
class AssetGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the AssetGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the AssetGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(AssetGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(AssetGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the AssetGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the AssetGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the AssetGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(AssetGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the AssetGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the AssetGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AssetGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(AssetGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current AssetGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current AssetGate app
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
             * Methods to access box state for the current AssetGate app
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
     * Returns a new `AssetGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new AssetGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `AssetGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new AssetGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new AssetGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the AssetGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(AssetGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the AssetGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the AssetGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the AssetGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64) method call against the AssetGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint64,uint8,uint64))(uint64,uint8,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the AssetGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the AssetGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the AssetGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the AssetGate contract
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
exports.AssetGateClient = AssetGateClient;
//# sourceMappingURL=AssetGateClient.js.map