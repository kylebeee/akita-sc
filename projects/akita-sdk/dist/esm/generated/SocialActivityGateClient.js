import { getArc56ReturnValue, getABIStructFromABITuple } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "SocialActivityGate", "structs": { "OperatorAndValue": [{ "name": "op", "type": "uint8" }, { "name": "value", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint8,uint64)", "struct": "OperatorAndValue", "name": "shape" }], "returns": { "type": "(uint8,uint64)", "struct": "OperatorAndValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "OperatorAndValue", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [363, 562], "errorMessage": "Box must have value" }, { "pc": [424], "errorMessage": "Bytes has valid prefix" }, { "pc": [285, 360], "errorMessage": "Invalid number of arguments" }, { "pc": [302], "errorMessage": "Invalid payment" }, { "pc": [104], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [606], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [604], "errorMessage": "application exists" }, { "pc": [306, 379, 591], "errorMessage": "check GlobalState exists" }, { "pc": [429], "errorMessage": "invalid number of bytes for (bool1,uint64,uint64,uint64,uint64,uint64,uint64,bool1,uint64,uint64,uint64)" }, { "pc": [236, 276, 354], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [195], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [544], "errorMessage": "invalid number of bytes for (uint8,uint64)" }, { "pc": [206, 340, 558, 584], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [332], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [263], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDIgOAogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJha2l0YV9kYW8iICJyZWdpc3RyeV9jdXJzb3IiCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIGludGNfMCAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czozMQogICAgLy8gcmVnaXN0cmF0aW9uU2hhcGUgPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsgaW5pdGlhbFZhbHVlOiAnKHVpbnQ4LHVpbnQ2NCknLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJhdGlvblNoYXBlIH0pCiAgICBwdXNoYnl0ZXNzICJyZWdpc3RyYXRpb25fc2hhcGUiICIodWludDgsdWludDY0KSIgLy8gInJlZ2lzdHJhdGlvbl9zaGFwZSIsICIodWludDgsdWludDY0KSIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjMzCiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAiY2hlY2tfc2hhcGUiICIiIC8vICJjaGVja19zaGFwZSIsICIiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjI1CiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsQWN0aXZpdHlHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDEzCiAgICBwdXNoYnl0ZXNzIDB4MzI5ZjA0ZWUgMHg3N2JiNzliOSAweDZlMDNmNTBhIDB4ODFmMTY1NDMgMHg5MGQ0ZmE1ZCAweDMzZTkyYzk0IDB4ODU0ZGVkZTAgLy8gbWV0aG9kICJjb3N0KGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgInJlZ2lzdGVyKHBheSxieXRlW10pdWludDY0IiwgbWV0aG9kICJjaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW10pYm9vbCIsIG1ldGhvZCAiZ2V0UmVnaXN0cmF0aW9uU2hhcGUoKHVpbnQ4LHVpbnQ2NCkpKHVpbnQ4LHVpbnQ2NCkiLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRSZWdpc3RyYXRpb25TaGFwZSBnZXRFbnRyeSB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMTEKICAgIGVycgoKbWFpbl9vcFVwX3JvdXRlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjI1CiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsQWN0aXZpdHlHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuY3JlYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBwdXNoYnl0ZXMgInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NzEKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBBcHBsaWNhdGlvbihha2l0YURBTykKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjY4CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEFjdGl2aXR5R2F0ZS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NzYKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1MDAwMDAwMDAwMDAwMjQ1NAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo6U29jaWFsQWN0aXZpdHlHYXRlLnJlZ2lzdGVyW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVnaXN0ZXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjgwCiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo4MQogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSBSZWdpc3RlckJ5dGVMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDkgLy8gOQogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6ODItODkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo4NQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6ODItODkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDIKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo4NgogICAgLy8gYW1vdW50OiBPcGVyYXRvckFuZFZhbHVlUmVnaXN0cnlNQlIKICAgIHB1c2hpbnQgOTMwMCAvLyA5MzAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjgyLTg5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE9wZXJhdG9yQW5kVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NDIKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6MjkKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo0MgogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMCAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTIKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gZGVjb2RlQXJjNDxPcGVyYXRvckFuZFZhbHVlPihhcmdzKQogICAgaXRvYgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6ODAKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEFjdGl2aXR5R2F0ZS5jaGVja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmNoZWNrOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo5NgogICAgLy8gY2hlY2soY2FsbGVyOiBBY2NvdW50LCByZWdpc3RyeUlEOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKTogYm9vbGVhbiB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo5NwogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSAwLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBsZW4KICAgICEKICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTgKICAgIC8vIGNvbnN0IHsgb3AsIHZhbHVlIH0gPSBjbG9uZSh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgZXh0cmFjdCAwIDEKICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgMwogICAgaW50Y18wIC8vIDEKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjQ4LTUxCiAgICAvLyBjb25zdCB7IGxhc3RBY3RpdmUgfSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRNZXRhPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsLAogICAgLy8gICBhcmdzOiBbdXNlcl0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo0OQogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zb2NpYWwsCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjQ5CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnNvY2lhbCwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBwdXNoYnl0ZXMgInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NDkKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsLAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjQ4LTUxCiAgICAvLyBjb25zdCB7IGxhc3RBY3RpdmUgfSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRNZXRhPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsLAogICAgLy8gICBhcmdzOiBbdXNlcl0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4NzM5ZWE3MGIgLy8gbWV0aG9kICJnZXRNZXRhKGFkZHJlc3MpKGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBsZW4KICAgIHB1c2hpbnQgNzQgLy8gNzQKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChib29sMSx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sMSx1aW50NjQsdWludDY0LHVpbnQ2NCkKICAgIHB1c2hpbnQgMjkgLy8gMjkKICAgIGV4dHJhY3RfdWludDY0CiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyBjb25zdCBzaW5jZTogdWludDY0ID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCAtIHZhbHVlCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBzd2FwCiAgICAtCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjU2CiAgICAvLyBjYXNlIEVxdWFsOiByZXR1cm4gbGFzdEFjdGl2ZSA9PT0gc2luY2UKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICBkdXAyCiAgICA9PQoKY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuYWN0aXZpdHlHYXRlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo5NgogICAgLy8gY2hlY2soY2FsbGVyOiBBY2NvdW50LCByZWdpc3RyeUlEOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKTogYm9vbGVhbiB7CiAgICBwdXNoYnl0ZXMgMHgwMAogICAgaW50Y18xIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgpjaGVja19hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjU3CiAgICAvLyBjYXNlIE5vdEVxdWFsOiByZXR1cm4gbGFzdEFjdGl2ZSAhPT0gc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxNAogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANQogICAgZHVwMgogICAgIT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFjdGl2aXR5R2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuYWN0aXZpdHlHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBjYXNlIExlc3NUaGFuOiByZXR1cm4gbGFzdEFjdGl2ZSA8IHNpbmNlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4MWUKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDcKICAgIGR1cDIKICAgIDwKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFjdGl2aXR5R2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuYWN0aXZpdHlHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjU5CiAgICAvLyBjYXNlIExlc3NUaGFuT3JFcXVhbFRvOiByZXR1cm4gbGFzdEFjdGl2ZSA8PSBzaW5jZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDI4CiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA5CiAgICBkdXAyCiAgICA8PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo5OQogICAgLy8gcmV0dXJuIHRoaXMuYWN0aXZpdHlHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEFjdGl2aXR5R2F0ZS5hY3Rpdml0eUdhdGVAMTQKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NjAKICAgIC8vIGNhc2UgR3JlYXRlclRoYW46IHJldHVybiBsYXN0QWN0aXZlID4gc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgzMgogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTEKICAgIGR1cDIKICAgID4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFjdGl2aXR5R2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuYWN0aXZpdHlHYXRlQDE0CgpjaGVja19hZnRlcl9pZl9lbHNlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo2MQogICAgLy8gY2FzZSBHcmVhdGVyVGhhbk9yRXF1YWxUbzogcmV0dXJuIGxhc3RBY3RpdmUgPj0gc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgzYwogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTMKICAgIGR1cDIKICAgID49CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyByZXR1cm4gdGhpcy5hY3Rpdml0eUdhdGUoY2FsbGVyLCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo6U29jaWFsQWN0aXZpdHlHYXRlLmFjdGl2aXR5R2F0ZUAxNAoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6NjIKICAgIC8vIGRlZmF1bHQ6IHJldHVybiBmYWxzZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWFjdGl2aXR5L2NvbnRyYWN0LmFsZ28udHM6OTkKICAgIC8vIHJldHVybiB0aGlzLmFjdGl2aXR5R2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxBY3Rpdml0eUdhdGUuYWN0aXZpdHlHYXRlQDE0CgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo6U29jaWFsQWN0aXZpdHlHYXRlLmdldFJlZ2lzdHJhdGlvblNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0UmVnaXN0cmF0aW9uU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjEwMgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA5IC8vIDkKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yICh1aW50OCx1aW50NjQpCiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czo6U29jaWFsQWN0aXZpdHlHYXRlLmdldEVudHJ5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0RW50cnk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1hY3Rpdml0eS9jb250cmFjdC5hbGdvLnRzOjEwNwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czoxMDkKICAgIC8vIHJldHVybiBlbmNvZGVBcmM0KHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUpCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtYWN0aXZpdHkvY29udHJhY3QuYWxnby50czoxMDcKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBwdXNoYnl0ZXMgIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQACCCYDBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcjEYQAA4KiJnggIScmVnaXN0cmF0aW9uX3NoYXBlDih1aW50OCx1aW50NjQpZ4ICC2NoZWNrX3NoYXBlAGcxGRREMRhBADuCBwQynwTuBHe7ebkEbgP1CgSB8WVDBJDU+l0EM+kslASFTe3gNhoAjgcAOwBYAJ4BcgGBAZsAAQAiQ4AEzZrWfjYaAI4BAAEANhoBSSNZJAhLARUSRFcCADYaAkkVJRJEF4AHdmVyc2lvbk8CZylMZyJDNhoBSSNZJAhMFRJEgAwVH3x1AAAAAAAAJFSwIkMxFiIJSTgQIhJENhoBSSNZJAhLARUSRFcCAEkVgQkSREsBOAcyChJPAjgIgdRIEhBEIyplREkiCCpMZxZJTwK/KExQsCJDNhoBSRWBIBJENhoCSRUlEkQXNhoDSSNZJAhLARUSRFcCABUURBa+RElXAAFJTgJOAyJbsSMpZUSAA3NhbGVII1uABHOepwuyGk8DshqyGIEGshAjsgGztD5JVwQASwFXAAQoEkQVgUoSRIEdW04CMgdMCUyAAQoSQQAPShKAAQAjTwJUKExQsCJDSwKAARQSQQAFShNC/+VLAoABHhJBAAVKDEL/10sCgAEoEkEABUoOQv/JSwKAATISQQAFSg1C/7tLAoABPBJBAAVKD0L/rSNC/6k2GgFJFYEJEkQoTFCwIkM2GgFJFSUSRBcWvkRJFRZXBgJMUChMULAiQzYaAUkVJRJEFzEAIyllRIAGd2FsbGV0ZUhyCEQSRClMZyJD", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
export function OperatorAndValueFromTuple(abiTuple) {
    return getABIStructFromABITuple(abiTuple, APP_SPEC.structs.OperatorAndValue, APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the SocialActivityGate smart contract
 */
export class SocialActivityGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return SocialActivityGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the SocialActivityGate smart contract using the create(string,uint64)void ABI method
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
/**
 * A factory to create and deploy one or more instance of the SocialActivityGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class SocialActivityGateFactory {
    /**
     * Creates a new instance of `SocialActivityGateFactory`
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
                 * Creates a new instance of the SocialActivityGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(SocialActivityGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialActivityGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(SocialActivityGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialActivityGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(SocialActivityGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new SocialActivityGateClient(result.appClient) };
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
        return new SocialActivityGateClient(this.appFactory.getAppClientById(params));
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
        return new SocialActivityGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the SocialActivityGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? SocialActivityGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new SocialActivityGateClient(result.appClient) };
    }
}
/**
 * A client to make calls to the SocialActivityGate smart contract
 */
export class SocialActivityGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the SocialActivityGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(SocialActivityGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the SocialActivityGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(SocialActivityGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the SocialActivityGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialActivityGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(SocialActivityGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current SocialActivityGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current SocialActivityGate app
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
             * Methods to access box state for the current SocialActivityGate app
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
     * Returns a new `SocialActivityGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new SocialActivityGateClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `SocialActivityGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new SocialActivityGateClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new SocialActivityGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the SocialActivityGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getRegistrationShape(params) {
        const result = await this.appClient.send.call(SocialActivityGateParamsFactory.getRegistrationShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the SocialActivityGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(SocialActivityGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the SocialActivityGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the SocialActivityGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the SocialActivityGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint8,uint64))(uint8,uint64) method call against the SocialActivityGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint8,uint64))(uint8,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the SocialActivityGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the SocialActivityGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the SocialActivityGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the SocialActivityGate contract
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
//# sourceMappingURL=SocialActivityGateClient.js.map