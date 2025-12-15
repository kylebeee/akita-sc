"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialFollowerCountGateClient = exports.SocialFollowerCountGateFactory = exports.SocialFollowerCountGateParamsFactory = exports.APP_SPEC = void 0;
exports.OperatorAndValueFromTuple = OperatorAndValueFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "SocialFollowerCountGate", "structs": { "OperatorAndValue": [{ "name": "op", "type": "uint8" }, { "name": "value", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint8,uint64)", "struct": "OperatorAndValue", "name": "shape" }], "returns": { "type": "(uint8,uint64)", "struct": "OperatorAndValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "OperatorAndValue", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [365, 584], "errorMessage": "Box must have value" }, { "pc": [431], "errorMessage": "Bytes has valid prefix" }, { "pc": [286, 362], "errorMessage": "Invalid number of arguments" }, { "pc": [303], "errorMessage": "Invalid payment" }, { "pc": [104], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [629], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [627], "errorMessage": "application exists" }, { "pc": [307, 383, 614], "errorMessage": "check GlobalState exists" }, { "pc": [436], "errorMessage": "invalid number of bytes for (bool1,uint64,uint64,uint64,uint64,uint64,uint64,bool1,uint64,uint64,uint64)" }, { "pc": [237, 277, 356], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [195], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [565], "errorMessage": "invalid number of bytes for (uint8,uint64)" }, { "pc": [207, 342, 580, 607], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [333], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [264], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDQ1IDIKICAgIGJ5dGVjYmxvY2sgMHgxNTFmN2M3NSAiYWtpdGFfZGFvIiAicmVnaXN0cnlfY3Vyc29yIgogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJueiBtYWluX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czoyOQogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICBpbnRjXzAgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6MzIKICAgIC8vIHJlZ2lzdHJhdGlvblNoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJyh1aW50OCx1aW50NjQpJywga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyYXRpb25TaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAicmVnaXN0cmF0aW9uX3NoYXBlIiAiKHVpbnQ4LHVpbnQ2NCkiIC8vICJyZWdpc3RyYXRpb25fc2hhcGUiLCAiKHVpbnQ4LHVpbnQ2NCkiCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czozNAogICAgLy8gY2hlY2tTaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICcnLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleUNoZWNrU2hhcGUgfSkKICAgIHB1c2hieXRlc3MgImNoZWNrX3NoYXBlIiAiIiAvLyAiY2hlY2tfc2hhcGUiLCAiIgogICAgYXBwX2dsb2JhbF9wdXQKCm1haW5fYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czoyNQogICAgLy8gZXhwb3J0IGNsYXNzIFNvY2lhbEZvbGxvd2VyQ291bnRHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDEzCiAgICBwdXNoYnl0ZXNzIDB4MzI5ZjA0ZWUgMHg3N2JiNzliOSAweDZlMDNmNTBhIDB4ODFmMTY1NDMgMHg5MGQ0ZmE1ZCAweDMzZTkyYzk0IDB4ODU0ZGVkZTAgLy8gbWV0aG9kICJjb3N0KGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgInJlZ2lzdGVyKHBheSxieXRlW10pdWludDY0IiwgbWV0aG9kICJjaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW10pYm9vbCIsIG1ldGhvZCAiZ2V0UmVnaXN0cmF0aW9uU2hhcGUoKHVpbnQ4LHVpbnQ2NCkpKHVpbnQ4LHVpbnQ2NCkiLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRSZWdpc3RyYXRpb25TaGFwZSBnZXRFbnRyeSB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMTEKICAgIGVycgoKbWFpbl9vcFVwX3JvdXRlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjI1CiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsRm9sbG93ZXJDb3VudEdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhjZDlhZDY3ZSAvLyBtZXRob2QgImNyZWF0ZShzdHJpbmcsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VyQ291bnRHYXRlLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6NjgKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgcHVzaGJ5dGVzICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo3MAogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjcxCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckNvdW50R2F0ZS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6NzYKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1MDAwMDAwMDAwMDAwMjQ1NAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJDb3VudEdhdGUucmVnaXN0ZXJbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3RlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6ODAKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMCAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjgxCiAgICAvLyBhc3NlcnQoYXJncy5sZW5ndGggPT09IFJlZ2lzdGVyQnl0ZUxlbmd0aCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOSAvLyA5CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo4Mi04OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBPcGVyYXRvckFuZFZhbHVlUmVnaXN0cnlNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDEKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjg1CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo4Mi04OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBPcGVyYXRvckFuZFZhbHVlUmVnaXN0cnlNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBhbW91bnQ6IE9wZXJhdG9yQW5kVmFsdWVSZWdpc3RyeU1CUgogICAgcHVzaGludCA5MzAwIC8vIDkzMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6ODItODkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czoyOQogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyBjb25zdCBpZCA9IHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjQ0CiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIGR1cAogICAgaW50Y18wIC8vIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6MjkKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo0NAogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo5MgogICAgLy8gdGhpcy5yZWdpc3RyeShpZCkudmFsdWUgPSBkZWNvZGVBcmM0PE9wZXJhdG9yQW5kVmFsdWU+KGFyZ3MpCiAgICBpdG9iCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo4MAogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJDb3VudEdhdGUuY2hlY2tbcm91dGluZ10oKSAtPiB2b2lkOgpjaGVjazoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTYKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTcKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gMCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgbGVuCiAgICAhCiAgICBhc3NlcnQgLy8gSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjk4CiAgICAvLyBjb25zdCB7IG9wLCB2YWx1ZSB9ID0gY2xvbmUodGhpcy5yZWdpc3RyeShyZWdpc3RyeUlEKS52YWx1ZSkKICAgIGl0b2IKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkdXAKICAgIGV4dHJhY3QgMCAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGNvdmVyIDMKICAgIGludGNfMCAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo1MC01MwogICAgLy8gY29uc3QgbWV0YSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRNZXRhPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0LAogICAgLy8gICBhcmdzOiBbdXNlcl0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo1MQogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QsCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjUxCiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmltcGFjdCwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBwdXNoYnl0ZXMgInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6NTEKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0LAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6NTAtNTMKICAgIC8vIGNvbnN0IG1ldGEgPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0TWV0YT4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmltcGFjdCwKICAgIC8vICAgYXJnczogW3VzZXJdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDczOWVhNzBiIC8vIG1ldGhvZCAiZ2V0TWV0YShhZGRyZXNzKShib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGxlbgogICAgcHVzaGludCA3NCAvLyA3NAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0KQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo1NgogICAgLy8gY2FzZSBFcXVhbDogcmV0dXJuIG1ldGEuZm9sbG93ZXJDb3VudCA9PT0gdmFsdWUKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICBkdXAKICAgIGludGNfMiAvLyA0NQogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAyCiAgICA9PQoKY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckNvdW50R2F0ZS5mb2xsb3dlckNvdW50R2F0ZUAxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTYKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMSAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gY2FzZSBOb3RFcXVhbDogcmV0dXJuIG1ldGEuZm9sbG93ZXJDb3VudCAhPT0gdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxNAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANQogICAgZHVwCiAgICBpbnRjXzIgLy8gNDUKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMgogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd2VyQ291bnRHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VyQ291bnRHYXRlLmZvbGxvd2VyQ291bnRHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBjYXNlIExlc3NUaGFuOiByZXR1cm4gbWV0YS5mb2xsb3dlckNvdW50IDwgdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxZQogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANwogICAgZHVwCiAgICBpbnRjXzIgLy8gNDUKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMgogICAgPAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo5OQogICAgLy8gcmV0dXJuIHRoaXMuZm9sbG93ZXJDb3VudEdhdGUoY2FsbGVyLCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJDb3VudEdhdGUuZm9sbG93ZXJDb3VudEdhdGVAMTQKCmNoZWNrX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGNhc2UgTGVzc1RoYW5PckVxdWFsVG86IHJldHVybiBtZXRhLmZvbGxvd2VyQ291bnQgPD0gdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgyOAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAOQogICAgZHVwCiAgICBpbnRjXzIgLy8gNDUKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMgogICAgPD0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd2VyQ291bnRHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VyQ291bnRHYXRlLmZvbGxvd2VyQ291bnRHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjYwCiAgICAvLyBjYXNlIEdyZWF0ZXJUaGFuOiByZXR1cm4gbWV0YS5mb2xsb3dlckNvdW50ID4gdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgzMgogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTEKICAgIGR1cAogICAgaW50Y18yIC8vIDQ1CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDIKICAgID4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd2VyQ291bnRHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VyQ291bnRHYXRlLmZvbGxvd2VyQ291bnRHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo2MQogICAgLy8gY2FzZSBHcmVhdGVyVGhhbk9yRXF1YWxUbzogcmV0dXJuIG1ldGEuZm9sbG93ZXJDb3VudCA+PSB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDNjCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMwogICAgZHVwCiAgICBpbnRjXzIgLy8gNDUKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMgogICAgPj0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd2VyQ291bnRHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VyQ291bnRHYXRlLmZvbGxvd2VyQ291bnRHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo2MgogICAgLy8gZGVmYXVsdDogcmV0dXJuIGZhbHNlCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo5OQogICAgLy8gcmV0dXJuIHRoaXMuZm9sbG93ZXJDb3VudEdhdGUoY2FsbGVyLCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJDb3VudEdhdGUuZm9sbG93ZXJDb3VudEdhdGVAMTQKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckNvdW50R2F0ZS5nZXRSZWdpc3RyYXRpb25TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldFJlZ2lzdHJhdGlvblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czoxMDIKICAgIC8vIGdldFJlZ2lzdHJhdGlvblNoYXBlKHNoYXBlOiBPcGVyYXRvckFuZFZhbHVlKTogT3BlcmF0b3JBbmRWYWx1ZSB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA5IC8vIDkKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yICh1aW50OCx1aW50NjQpCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItY291bnQvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJDb3VudEdhdGUuZ2V0RW50cnlbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRFbnRyeToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWNvdW50L2NvbnRyYWN0LmFsZ28udHM6MTA2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOAogICAgLy8gcmV0dXJuIGVuY29kZUFyYzQodGhpcy5yZWdpc3RyeShyZWdpc3RyeUlEKS52YWx1ZSkKICAgIGl0b2IKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1jb3VudC9jb250cmFjdC5hbGdvLnRzOjEwNgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHB1c2hieXRlcyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQAtAiYDBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcjEYQAA4KiJnggIScmVnaXN0cmF0aW9uX3NoYXBlDih1aW50OCx1aW50NjQpZ4ICC2NoZWNrX3NoYXBlAGcxGRREMRhBADuCBwQynwTuBHe7ebkEbgP1CgSB8WVDBJDU+l0EM+kslASFTe3gNhoAjgcAPABZAJ8BhwGWAbEAAQAiQ4AEzZrWfjYaAI4BAAEANhoBSSNZJQhLARUSRFcCADYaAkkVgQgSRBeAB3ZlcnNpb25PAmcpTGciQzYaAUkjWSUITBUSRIAMFR98dQAAAAAAACRUsCJDMRYiCUk4ECISRDYaAUkjWSUISwEVEkRXAgBJFYEJEkRLATgHMgoSTwI4CIHUSBIQRCMqZURJIggqTGcWSU8CvyhMULAiQzYaAUkVgSASRDYaAkkVgQgSRBc2GgNJI1klCEsBFRJEVwIAFRREFr5ESVcAAUlOAk4DIltOArEjKWVEgANzYWxlSIEQW4AEc56nC7IaTwKyGrIYgQayECOyAbO0PklOAklXBABMVwAEKBJEFYFKEkSAAQoSQQATSSRbSwISgAEAI08CVChMULAiQ0sCgAEUEkEACUkkW0sCE0L/4UsCgAEeEkEACUkkW0sCDEL/z0sCgAEoEkEACUkkW0sCDkL/vUsCgAEyEkEACUkkW0sCDUL/q0sCgAE8EkEACUkkW0sCD0L/mSNC/5U2GgFJFYEJEkQoTFCwIkM2GgFJFYEIEkQXFr5ESRUWVwYCTFAoTFCwIkM2GgFJFYEIEkQXMQAjKWVEgAZ3YWxsZXRlSHIIRBJEKUxnIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a OperatorAndValue to the struct representation
 */
function OperatorAndValueFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.OperatorAndValue, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the SocialFollowerCountGate smart contract
 */
class SocialFollowerCountGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return SocialFollowerCountGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the SocialFollowerCountGate smart contract using the create(string,uint64)void ABI method
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
     * Constructs a no op call for the getRegistrationShape((uint8,uint64))(uint8,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((uint8,uint64))(uint8,uint64)',
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
exports.SocialFollowerCountGateParamsFactory = SocialFollowerCountGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the SocialFollowerCountGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class SocialFollowerCountGateFactory {
    /**
     * Creates a new instance of `SocialFollowerCountGateFactory`
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
                 * Creates a new instance of the SocialFollowerCountGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(SocialFollowerCountGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialFollowerCountGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(SocialFollowerCountGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialFollowerCountGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(SocialFollowerCountGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new SocialFollowerCountGateClient(result.appClient) };
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
        return new SocialFollowerCountGateClient(this.appFactory.getAppClientById(params));
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
        return new SocialFollowerCountGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the SocialFollowerCountGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? SocialFollowerCountGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new SocialFollowerCountGateClient(result.appClient) };
    }
}
exports.SocialFollowerCountGateFactory = SocialFollowerCountGateFactory;
/**
 * A client to make calls to the SocialFollowerCountGate smart contract
 */
class SocialFollowerCountGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerCountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(SocialFollowerCountGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerCountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(SocialFollowerCountGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerCountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerCountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current SocialFollowerCountGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current SocialFollowerCountGate app
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
             * Methods to access box state for the current SocialFollowerCountGate app
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
     * Returns a new `SocialFollowerCountGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new SocialFollowerCountGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `SocialFollowerCountGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new SocialFollowerCountGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new SocialFollowerCountGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the SocialFollowerCountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(SocialFollowerCountGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the SocialFollowerCountGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the SocialFollowerCountGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the SocialFollowerCountGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint8,uint64))(uint8,uint64) method call against the SocialFollowerCountGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint8,uint64))(uint8,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the SocialFollowerCountGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the SocialFollowerCountGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the SocialFollowerCountGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the SocialFollowerCountGate contract
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
exports.SocialFollowerCountGateClient = SocialFollowerCountGateClient;
//# sourceMappingURL=SocialFollowerCountGateClient.js.map