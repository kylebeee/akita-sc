import { getArc56ReturnValue, getABIStructFromABITuple } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "StakingAmountGate", "structs": { "StakingAmountGateRegistryInfo": [{ "name": "op", "type": "uint8" }, { "name": "asset", "type": "uint64" }, { "name": "type", "type": "uint8" }, { "name": "amount", "type": "uint64" }, { "name": "includeEscrowed", "type": "bool" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint8,uint64,uint8,uint64,bool)", "struct": "StakingAmountGateRegistryInfo", "name": "shape" }], "returns": { "type": "(uint8,uint64,uint8,uint64,bool)", "struct": "StakingAmountGateRegistryInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "StakingAmountGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [390, 702], "errorMessage": "Box must have value" }, { "pc": [494, 662], "errorMessage": "Bytes has valid prefix" }, { "pc": [304, 387], "errorMessage": "Invalid number of arguments" }, { "pc": [321], "errorMessage": "Invalid payment" }, { "pc": [122], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [746], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [744], "errorMessage": "application exists" }, { "pc": [328], "errorMessage": "bad operation check" }, { "pc": [332, 427, 731], "errorMessage": "check GlobalState exists" }, { "pc": [254, 294, 381], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [213], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [667], "errorMessage": "invalid number of bytes for (uint64,uint64,uint64)" }, { "pc": [684], "errorMessage": "invalid number of bytes for (uint8,uint64,uint8,uint64,bool1)" }, { "pc": [224, 367, 499, 698, 724], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [359], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [281], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDIgOAogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJha2l0YV9kYW8iICJyZWdpc3RyeV9jdXJzb3IiICIiCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NDEKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgaW50Y18xIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIHJlZ2lzdHJhdGlvblNoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJyh1aW50OCx1aW50NjQsdWludDgsdWludDY0LGJvb2wpJywga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyYXRpb25TaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAicmVnaXN0cmF0aW9uX3NoYXBlIiAiKHVpbnQ4LHVpbnQ2NCx1aW50OCx1aW50NjQsYm9vbCkiIC8vICJyZWdpc3RyYXRpb25fc2hhcGUiLCAiKHVpbnQ4LHVpbnQ2NCx1aW50OCx1aW50NjQsYm9vbCkiCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjQ1CiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzICJjaGVja19zaGFwZSIKICAgIGJ5dGVjXzMgLy8gIiIKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czozNwogICAgLy8gZXhwb3J0IGNsYXNzIFN0YWtpbmdBbW91bnRHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDEzCiAgICBwdXNoYnl0ZXNzIDB4MzI5ZjA0ZWUgMHg3N2JiNzliOSAweDZlMDNmNTBhIDB4MzUyNDk5MTQgMHg5MGQ0ZmE1ZCAweDMzZTkyYzk0IDB4ODU0ZGVkZTAgLy8gbWV0aG9kICJjb3N0KGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgInJlZ2lzdGVyKHBheSxieXRlW10pdWludDY0IiwgbWV0aG9kICJjaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW10pYm9vbCIsIG1ldGhvZCAiZ2V0UmVnaXN0cmF0aW9uU2hhcGUoKHVpbnQ4LHVpbnQ2NCx1aW50OCx1aW50NjQsYm9vbCkpKHVpbnQ4LHVpbnQ2NCx1aW50OCx1aW50NjQsYm9vbCkiLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRSZWdpc3RyYXRpb25TaGFwZSBnZXRFbnRyeSB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMTEKICAgIGVycgoKbWFpbl9vcFVwX3JvdXRlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MzcKICAgIC8vIGV4cG9ydCBjbGFzcyBTdGFraW5nQW1vdW50R2F0ZSBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IHsKICAgIHB1c2hieXRlcyAweGNkOWFkNjdlIC8vIG1ldGhvZCAiY3JlYXRlKHN0cmluZyx1aW50NjQpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OTcKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgcHVzaGJ5dGVzICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMDAKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBBcHBsaWNhdGlvbihha2l0YURBTykKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OTcKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMDUKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1MDAwMDAwMDAwMDAwMzNmNAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjEwOQogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZHVwCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSBSZWdpc3RlckJ5dGVMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE5IC8vIDE5CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjExMS0xMTgKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogU3Rha2luZ0Ftb3VudEdhdGVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMTQKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTExLTExOAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBTdGFraW5nQW1vdW50R2F0ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDMKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjExNQogICAgLy8gYW1vdW50OiBTdGFraW5nQW1vdW50R2F0ZVJlZ2lzdHJ5TUJSCiAgICBwdXNoaW50IDEzMzAwIC8vIDEzMzAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTExLTExOAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBTdGFraW5nQW1vdW50R2F0ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjEyMgogICAgLy8gYXNzZXJ0KHBhcmFtcy5vcC5hc1VpbnQ2NCgpIDw9IDYsIEVSUl9CQURfT1BFUkFUSU9OKQogICAgc3dhcAogICAgaW50Y18yIC8vIDIKICAgIGdldGJ5dGUKICAgIHB1c2hpbnQgNiAvLyA2CiAgICA8PQogICAgYXNzZXJ0IC8vIGJhZCBvcGVyYXRpb24gY2hlY2sKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo1NAogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjQxCiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo1NAogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjU1CiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo0MQogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NTUKICAgIC8vIHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMjQKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gY2xvbmUocGFyYW1zKQogICAgaXRvYgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMDkKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo6U3Rha2luZ0Ftb3VudEdhdGUuY2hlY2tbcm91dGluZ10oKSAtPiB2b2lkOgpjaGVjazoKICAgIGJ5dGVjXzMgLy8gIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMjgKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMjkKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gMCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgbGVuCiAgICAhCiAgICBhc3NlcnQgLy8gSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBjb25zdCB7IG9wLCBhc3NldCwgYW1vdW50LCB0eXBlLCBpbmNsdWRlRXNjcm93ZWQgfSA9IGNsb25lKHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUpCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBleHRyYWN0IDAgMQogICAgY292ZXIgMgogICAgZHVwCiAgICBleHRyYWN0IDEgOAogICAgY292ZXIgMgogICAgZHVwCiAgICBwdXNoaW50IDEwIC8vIDEwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgZHVwCiAgICBleHRyYWN0IDkgMQogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb3ZlciAzCiAgICBwdXNoaW50IDE0NCAvLyAxNDQKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjY4CiAgICAvLyBjb25zdCBhcHBJZCA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zdGFraW5nCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NjgKICAgIC8vIGNvbnN0IGFwcElkID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQwCiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBwdXNoYnl0ZXMgImFhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gY29uc3QgYXBwSWQgPSBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc3Rha2luZwogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NzAKICAgIC8vIGlmICh0eXBlID09PSBTVEFLSU5HX1RZUEVfSEVBUlRCRUFUKSB7CiAgICBwdXNoYnl0ZXMgMHgwYQogICAgPT0KICAgIGJ6IGNoZWNrX2Vsc2VfYm9keUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NzEtNzQKICAgIC8vIHN0YWtlZCA9IGFiaUNhbGw8dHlwZW9mIFN0YWtpbmcucHJvdG90eXBlLmdldEhlYXJ0YmVhdEF2ZXJhZ2U+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFt1c2VyLCBhc3NldCwgaW5jbHVkZUVzY3Jvd2VkXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NzMKICAgIC8vIGFyZ3M6IFt1c2VyLCBhc3NldCwgaW5jbHVkZUVzY3Jvd2VkXSwKICAgIHB1c2hieXRlcyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDQKICAgIHNldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjcxLTc0CiAgICAvLyBzdGFrZWQgPSBhYmlDYWxsPHR5cGVvZiBTdGFraW5nLnByb3RvdHlwZS5nZXRIZWFydGJlYXRBdmVyYWdlPih7CiAgICAvLyAgIGFwcElkLAogICAgLy8gICBhcmdzOiBbdXNlciwgYXNzZXQsIGluY2x1ZGVFc2Nyb3dlZF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4YzZmZDBjYTUgLy8gbWV0aG9kICJnZXRIZWFydGJlYXRBdmVyYWdlKGFkZHJlc3MsdWludDY0LGJvb2wpdWludDY0IgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkdXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgYnVyeSA3CgpjaGVja19hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6ODUKICAgIC8vIGNhc2UgRXF1YWw6IHJldHVybiBzdGFrZWQgPT09IGFtb3VudAogICAgZGlnIDUKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA2CiAgICBkaWcgNgogICAgZGlnIDQKICAgID09CgpjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo6U3Rha2luZ0Ftb3VudEdhdGUuc3Rha2luZ0Ftb3VudEdhdGVAMTc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTI4CiAgICAvLyBjaGVjayhjYWxsZXI6IEFjY291bnQsIHJlZ2lzdHJ5SUQ6IHVpbnQ2NCwgYXJnczogYnl0ZXMpOiBib29sZWFuIHsKICAgIHB1c2hieXRlcyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAyCiAgICBzZXRiaXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmNoZWNrX2FmdGVyX2lmX2Vsc2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo4NgogICAgLy8gY2FzZSBOb3RFcXVhbDogcmV0dXJuIHN0YWtlZCAhPT0gYW1vdW50CiAgICBkaWcgNQogICAgcHVzaGJ5dGVzIDB4MTQKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDgKICAgIGRpZyA2CiAgICBkaWcgNAogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMzEtMTM4CiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nQW1vdW50R2F0ZSgKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgYXNzZXQsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgdHlwZSwKICAgIC8vICAgaW5jbHVkZUVzY3Jvd2VkCiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5zdGFraW5nQW1vdW50R2F0ZUAxNwoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjg3CiAgICAvLyBjYXNlIExlc3NUaGFuOiByZXR1cm4gc3Rha2VkIDwgYW1vdW50CiAgICBkaWcgNQogICAgcHVzaGJ5dGVzIDB4MWUKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDEwCiAgICBkaWcgNgogICAgZGlnIDQKICAgIDwKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMzEtMTM4CiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nQW1vdW50R2F0ZSgKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgYXNzZXQsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgdHlwZSwKICAgIC8vICAgaW5jbHVkZUVzY3Jvd2VkCiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5zdGFraW5nQW1vdW50R2F0ZUAxNwoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo4OAogICAgLy8gY2FzZSBMZXNzVGhhbk9yRXF1YWxUbzogcmV0dXJuIHN0YWtlZCA8PSBhbW91bnQKICAgIGRpZyA1CiAgICBwdXNoYnl0ZXMgMHgyOAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTIKICAgIGRpZyA2CiAgICBkaWcgNAogICAgPD0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMzEtMTM4CiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nQW1vdW50R2F0ZSgKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgYXNzZXQsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgdHlwZSwKICAgIC8vICAgaW5jbHVkZUVzY3Jvd2VkCiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5zdGFraW5nQW1vdW50R2F0ZUAxNwoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo4OQogICAgLy8gY2FzZSBHcmVhdGVyVGhhbjogcmV0dXJuIHN0YWtlZCA+IGFtb3VudAogICAgZGlnIDUKICAgIHB1c2hieXRlcyAweDMyCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxNAogICAgZGlnIDYKICAgIGRpZyA0CiAgICA+CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxLTEzOAogICAgLy8gcmV0dXJuIHRoaXMuc3Rha2luZ0Ftb3VudEdhdGUoCiAgICAvLyAgIGNhbGxlciwKICAgIC8vICAgb3AsCiAgICAvLyAgIGFzc2V0LAogICAgLy8gICBhbW91bnQsCiAgICAvLyAgIHR5cGUsCiAgICAvLyAgIGluY2x1ZGVFc2Nyb3dlZAogICAgLy8gKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo6U3Rha2luZ0Ftb3VudEdhdGUuc3Rha2luZ0Ftb3VudEdhdGVAMTcKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OTAKICAgIC8vIGNhc2UgR3JlYXRlclRoYW5PckVxdWFsVG86IHJldHVybiBzdGFrZWQgPj0gYW1vdW50CiAgICBkaWcgNQogICAgcHVzaGJ5dGVzIDB4M2MKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDE2CiAgICBkaWcgNgogICAgZGlnIDQKICAgID49CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTMxLTEzOAogICAgLy8gcmV0dXJuIHRoaXMuc3Rha2luZ0Ftb3VudEdhdGUoCiAgICAvLyAgIGNhbGxlciwKICAgIC8vICAgb3AsCiAgICAvLyAgIGFzc2V0LAogICAgLy8gICBhbW91bnQsCiAgICAvLyAgIHR5cGUsCiAgICAvLyAgIGluY2x1ZGVFc2Nyb3dlZAogICAgLy8gKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czo6U3Rha2luZ0Ftb3VudEdhdGUuc3Rha2luZ0Ftb3VudEdhdGVAMTcKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OTEKICAgIC8vIGRlZmF1bHQ6IHJldHVybiBmYWxzZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxMzEtMTM4CiAgICAvLyByZXR1cm4gdGhpcy5zdGFraW5nQW1vdW50R2F0ZSgKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgYXNzZXQsCiAgICAvLyAgIGFtb3VudCwKICAgIC8vICAgdHlwZSwKICAgIC8vICAgaW5jbHVkZUVzY3Jvd2VkCiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjpTdGFraW5nQW1vdW50R2F0ZS5zdGFraW5nQW1vdW50R2F0ZUAxNwoKY2hlY2tfZWxzZV9ib2R5QDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NzYtNzkKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBTdGFraW5nLnByb3RvdHlwZS5tdXN0R2V0SW5mbz4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogW3VzZXIsIHsgYXNzZXQsIHR5cGUgfV0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjc4CiAgICAvLyBhcmdzOiBbdXNlciwgeyBhc3NldCwgdHlwZSB9XSwKICAgIGRpZyA1CiAgICBkaWcgNAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6NzYtNzkKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBTdGFraW5nLnByb3RvdHlwZS5tdXN0R2V0SW5mbz4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogW3VzZXIsIHsgYXNzZXQsIHR5cGUgfV0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4ZjUyMzJiZjMgLy8gbWV0aG9kICJtdXN0R2V0SW5mbyhhZGRyZXNzLCh1aW50NjQsdWludDgpKSh1aW50NjQsdWludDY0LHVpbnQ2NCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkdXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgZGlnIDEKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgbGVuCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDY0LHVpbnQ2NCx1aW50NjQpCiAgICBwdXNoaW50IDQgLy8gNAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zdGFraW5nLWFtb3VudC9jb250cmFjdC5hbGdvLnRzOjgxCiAgICAvLyBzdGFrZWQgPSBpbmZvLmFtb3VudAogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgNwogICAgYiBjaGVja19hZnRlcl9pZl9lbHNlQDQKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdBbW91bnRHYXRlLmdldFJlZ2lzdHJhdGlvblNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0UmVnaXN0cmF0aW9uU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTQxCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE5IC8vIDE5CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDgsdWludDY0LHVpbnQ4LHVpbnQ2NCxib29sMSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6OlN0YWtpbmdBbW91bnRHYXRlLmdldEVudHJ5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0RW50cnk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3N0YWtpbmctYW1vdW50L2NvbnRyYWN0LmFsZ28udHM6MTQ4CiAgICAvLyByZXR1cm4gZW5jb2RlQXJjNCh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc3Rha2luZy1hbW91bnQvY29udHJhY3QuYWxnby50czoxNDYKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBwdXNoYnl0ZXMgIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAECCCYEBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcgAxGEAASSojZ4ICEnJlZ2lzdHJhdGlvbl9zaGFwZSAodWludDgsdWludDY0LHVpbnQ4LHVpbnQ2NCxib29sKWeAC2NoZWNrX3NoYXBlK2cxGRREMRhBADuCBwQynwTuBHe7ebkEbgP1CgQ1JJkUBJDU+l0EM+kslASFTe3gNhoAjgcAOwBYAKYB7AH7AhUAAQAjQ4AEzZrWfjYaAI4BAAEANhoBSSJZJAhLARUSRFcCADYaAkkVJRJEF4AHdmVyc2lvbk8CZylMZyNDNhoBSSJZJAhMFRJEgAwVH3x1AAAAAAAAM/SwI0MxFiMJSTgQIxJENhoBSSJZJAhLARUSRElXAgBJFYETEkRLAjgHMgoSTwM4CIH0ZxIQREwkVYEGDkQiKmVESSMIKkxnFklPAr8oTFCwI0MrNhoBSRWBIBJENhoCSRUlEkQXNhoDSSJZJAhLARUSRFcCABUURBa+RElXAAFOAklXAQhOAkmBCltOAklXCQFJTgJOA4GQAVNOAiIpZUSAA2FhbGVIIltOAoABChJBAK2xgAEAIksEVIAExv0MpbIaTLIaSwWyGrIaSbIYgQayECKyAbO0PklXBABMVwAEKBJESRUlEkQXRQdLBYABChJBABJLBksEEoABACJPAlQoTFCwI0NLBYABFBJBAAhLBksEE0L/4ksFgAEeEkEACEsGSwQMQv/RSwWAASgSQQAISwZLBA5C/8BLBYABMhJBAAhLBksEDUL/r0sFgAE8EkEACEsGSwQPQv+eIkL/mrFLBUsEUIAE9SMr87IaTLIashpJshiBBrIQIrIBs7Q+SVcEAEsBVwAEKBJEFYEYEkSBBFtFB0L/UzYaAUkVgRMSRChMULAjQzYaAUkVJRJEFxa+REkVFlcGAkxQKExQsCNDNhoBSRUlEkQXMQAiKWVEgAZ3YWxsZXRlSHIIRBJEKUxnI0M=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a StakingAmountGateRegistryInfo to the struct representation
 */
export function StakingAmountGateRegistryInfoFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.StakingAmountGateRegistryInfo, APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the StakingAmountGate smart contract
 */
export class StakingAmountGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return StakingAmountGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the StakingAmountGate smart contract using the create(string,uint64)void ABI method
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
     * Constructs a no op call for the getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)',
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
/**
 * A factory to create and deploy one or more instance of the StakingAmountGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class StakingAmountGateFactory {
    /**
     * Creates a new instance of `StakingAmountGateFactory`
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
                 * Creates a new instance of the StakingAmountGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(StakingAmountGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the StakingAmountGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(StakingAmountGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the StakingAmountGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(StakingAmountGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new StakingAmountGateClient(result.appClient) };
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
        return new StakingAmountGateClient(this.appFactory.getAppClientById(params));
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
        return new StakingAmountGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the StakingAmountGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? StakingAmountGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new StakingAmountGateClient(result.appClient) };
    }
}
/**
 * A client to make calls to the StakingAmountGate smart contract
 */
export class StakingAmountGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the StakingAmountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(StakingAmountGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the StakingAmountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(StakingAmountGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the StakingAmountGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the StakingAmountGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(StakingAmountGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current StakingAmountGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current StakingAmountGate app
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
             * Methods to access box state for the current StakingAmountGate app
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
     * Returns a new `StakingAmountGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new StakingAmountGateClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `StakingAmountGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new StakingAmountGateClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new StakingAmountGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the StakingAmountGate smart contract using the `getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getRegistrationShape(params) {
        const result = await this.appClient.send.call(StakingAmountGateParamsFactory.getRegistrationShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the StakingAmountGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(StakingAmountGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the StakingAmountGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the StakingAmountGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the StakingAmountGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool) method call against the StakingAmountGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint8,uint64,uint8,uint64,bool))(uint8,uint64,uint8,uint64,bool)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the StakingAmountGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the StakingAmountGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the StakingAmountGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the StakingAmountGate contract
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
//# sourceMappingURL=StakingAmountGateClient.js.map