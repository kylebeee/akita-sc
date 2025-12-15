import { getArc56ReturnValue, getABIStructFromABITuple } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "SocialModeratorGate", "structs": { "OperatorAndValue": [{ "name": "op", "type": "uint8" }, { "name": "value", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(uint8,uint64)", "struct": "OperatorAndValue", "name": "shape" }], "returns": { "type": "(uint8,uint64)", "struct": "OperatorAndValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "OperatorAndValue", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [364, 586], "errorMessage": "Box must have value" }, { "pc": [422], "errorMessage": "Bytes has valid prefix" }, { "pc": [285, 361], "errorMessage": "Invalid number of arguments" }, { "pc": [302], "errorMessage": "Invalid payment" }, { "pc": [104], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [630], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [628], "errorMessage": "application exists" }, { "pc": [306, 378, 615], "errorMessage": "check GlobalState exists" }, { "pc": [428], "errorMessage": "invalid number of bytes for (bool1,uint64)" }, { "pc": [236, 276, 355], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [195], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [568], "errorMessage": "invalid number of bytes for (uint8,uint64)" }, { "pc": [206, 341, 582, 608], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [333], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [263], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDIgOAogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJha2l0YV9kYW8iICJyZWdpc3RyeV9jdXJzb3IiICIiCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czoyNgogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICBpbnRjXzAgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjI5CiAgICAvLyByZWdpc3RyYXRpb25TaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICcodWludDgsdWludDY0KScsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cmF0aW9uU2hhcGUgfSkKICAgIHB1c2hieXRlc3MgInJlZ2lzdHJhdGlvbl9zaGFwZSIgIih1aW50OCx1aW50NjQpIiAvLyAicmVnaXN0cmF0aW9uX3NoYXBlIiwgIih1aW50OCx1aW50NjQpIgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjMxCiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzICJjaGVja19zaGFwZSIKICAgIGJ5dGVjXzMgLy8gIiIKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjIyCiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsTW9kZXJhdG9yR2F0ZSBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxMwogICAgcHVzaGJ5dGVzcyAweDMyOWYwNGVlIDB4NzdiYjc5YjkgMHg2ZTAzZjUwYSAweDgxZjE2NTQzIDB4OTBkNGZhNWQgMHgzM2U5MmM5NCAweDg1NGRlZGUwIC8vIG1ldGhvZCAiY29zdChieXRlW10pdWludDY0IiwgbWV0aG9kICJyZWdpc3RlcihwYXksYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAiY2hlY2soYWRkcmVzcyx1aW50NjQsYnl0ZVtdKWJvb2wiLCBtZXRob2QgImdldFJlZ2lzdHJhdGlvblNoYXBlKCh1aW50OCx1aW50NjQpKSh1aW50OCx1aW50NjQpIiwgbWV0aG9kICJnZXRFbnRyeSh1aW50NjQpYnl0ZVtdIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBTyh1aW50NjQpdm9pZCIsIG1ldGhvZCAib3BVcCgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNvc3QgcmVnaXN0ZXIgY2hlY2sgZ2V0UmVnaXN0cmF0aW9uU2hhcGUgZ2V0RW50cnkgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDExCiAgICBlcnIKCm1haW5fb3BVcF9yb3V0ZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQzCiAgICAvLyBvcFVwKCk6IHZvaWQgeyB9CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgptYWluX2NyZWF0ZV9Ob09wQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MjIKICAgIC8vIGV4cG9ydCBjbGFzcyBTb2NpYWxNb2RlcmF0b3JHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo3MAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBwdXNoYnl0ZXMgInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo3MgogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo3MwogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IEFwcGxpY2F0aW9uKGFraXRhREFPKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxNb2RlcmF0b3JHYXRlLmNvc3Rbcm91dGluZ10oKSAtPiB2b2lkOgpjb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NzgKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIHB1c2hieXRlcyAweDE1MWY3Yzc1MDAwMDAwMDAwMDAwMjQ1NAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbE1vZGVyYXRvckdhdGUucmVnaXN0ZXJbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3RlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjgyCiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6ODMKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gT3BlcmF0b3JBbmRWYWx1ZUJ5dGVMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDkgLy8gOQogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjg0LTkxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE9wZXJhdG9yQW5kVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjg3CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6ODQtOTEKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDIKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6ODgKICAgIC8vIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICBwdXNoaW50IDkzMDAgLy8gOTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6ODQtOTEKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogT3BlcmF0b3JBbmRWYWx1ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NDAKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjI2CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjQwCiAgICAvLyBjb25zdCBpZCA9IHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo0MQogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMCAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czoyNgogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo0MQogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6OTQKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gZGVjb2RlQXJjNDxPcGVyYXRvckFuZFZhbHVlPihhcmdzKQogICAgaXRvYgogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjgyCiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5jaGVja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmNoZWNrOgogICAgYnl0ZWNfMyAvLyAiIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6OTgKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjk5CiAgICAvLyBhc3NlcnQoYXJncy5sZW5ndGggPT09IDAsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGxlbgogICAgIQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTAwCiAgICAvLyBjb25zdCB7IG9wLCB2YWx1ZSB9ID0gY2xvbmUodGhpcy5yZWdpc3RyeShyZWdpc3RyeUlEKS52YWx1ZSkKICAgIGl0b2IKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkdXAKICAgIGV4dHJhY3QgMCAxCiAgICBjb3ZlciAyCiAgICBpbnRjXzAgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjQ2LTQ5CiAgICAvLyBjb25zdCB7IGV4aXN0cywgbGFzdEFjdGl2ZSB9ID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS5tb2RlcmF0b3JNZXRhPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbiwKICAgIC8vICAgYXJnczogW3VzZXJdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjQ3CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1vZGVyYXRpb24sCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo0NwogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5tb2RlcmF0aW9uLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIHB1c2hieXRlcyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NDcKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbiwKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo0Ni00OQogICAgLy8gY29uc3QgeyBleGlzdHMsIGxhc3RBY3RpdmUgfSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUubW9kZXJhdG9yTWV0YT4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFt1c2VyXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHgxZjNjNjE4YyAvLyBtZXRob2QgIm1vZGVyYXRvck1ldGEoYWRkcmVzcykoYm9vbCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDkgLy8gOQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGJvb2wxLHVpbnQ2NCkKICAgIGludGNfMSAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHB1c2hpbnQgNSAvLyA1CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NTEKICAgIC8vIGlmICghZXhpc3RzKSB7CiAgICBibnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo1MgogICAgLy8gcmV0dXJuIGZhbHNlCiAgICBpbnRjXzEgLy8gMAoKY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5tb2RlcmF0b3JHYXRlQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6OTgKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMSAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NTUKICAgIC8vIGNvbnN0IHNpbmNlOiB1aW50NjQgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gdmFsdWUKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGRpZyAyCiAgICAtCiAgICBidXJ5IDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBjYXNlIEVxdWFsOiByZXR1cm4gbGFzdEFjdGl2ZSA9PT0gc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgwYQogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANQogICAgZHVwCiAgICBkaWcgNAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjEwMQogICAgLy8gcmV0dXJuIHRoaXMubW9kZXJhdG9yR2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5tb2RlcmF0b3JHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo1OQogICAgLy8gY2FzZSBOb3RFcXVhbDogcmV0dXJuIGxhc3RBY3RpdmUgIT09IHNpbmNlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4MTQKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDcKICAgIGR1cAogICAgZGlnIDQKICAgICE9CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czoxMDEKICAgIC8vIHJldHVybiB0aGlzLm1vZGVyYXRvckdhdGUoY2FsbGVyLCBvcCwgdmFsdWUpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbE1vZGVyYXRvckdhdGUubW9kZXJhdG9yR2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NjAKICAgIC8vIGNhc2UgTGVzc1RoYW46IHJldHVybiBsYXN0QWN0aXZlIDwgc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxZQogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAOQogICAgZHVwCiAgICBkaWcgNAogICAgPAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTAxCiAgICAvLyByZXR1cm4gdGhpcy5tb2RlcmF0b3JHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxNb2RlcmF0b3JHYXRlLm1vZGVyYXRvckdhdGVAMTYKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjYxCiAgICAvLyBjYXNlIExlc3NUaGFuT3JFcXVhbFRvOiByZXR1cm4gbGFzdEFjdGl2ZSA8PSBzaW5jZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDI4CiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMQogICAgZHVwCiAgICBkaWcgNAogICAgPD0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjEwMQogICAgLy8gcmV0dXJuIHRoaXMubW9kZXJhdG9yR2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5tb2RlcmF0b3JHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NjIKICAgIC8vIGNhc2UgR3JlYXRlclRoYW46IHJldHVybiBsYXN0QWN0aXZlID4gc2luY2UKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgzMgogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAMTMKICAgIGR1cAogICAgZGlnIDQKICAgID4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjEwMQogICAgLy8gcmV0dXJuIHRoaXMubW9kZXJhdG9yR2F0ZShjYWxsZXIsIG9wLCB2YWx1ZSkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5tb2RlcmF0b3JHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6NjMKICAgIC8vIGNhc2UgR3JlYXRlclRoYW5PckVxdWFsVG86IHJldHVybiBsYXN0QWN0aXZlID49IHNpbmNlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4M2MKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDE1CiAgICBkdXAKICAgIGRpZyA0CiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTAxCiAgICAvLyByZXR1cm4gdGhpcy5tb2RlcmF0b3JHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxNb2RlcmF0b3JHYXRlLm1vZGVyYXRvckdhdGVAMTYKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAMTU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo2NAogICAgLy8gZGVmYXVsdDogcmV0dXJuIGZhbHNlCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTAxCiAgICAvLyByZXR1cm4gdGhpcy5tb2RlcmF0b3JHYXRlKGNhbGxlciwgb3AsIHZhbHVlKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLW1vZGVyYXRvci9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxNb2RlcmF0b3JHYXRlLm1vZGVyYXRvckdhdGVAMTYKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5nZXRSZWdpc3RyYXRpb25TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldFJlZ2lzdHJhdGlvblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTA0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDkgLy8gOQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKHVpbnQ4LHVpbnQ2NCkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czo6U29jaWFsTW9kZXJhdG9yR2F0ZS5nZXRFbnRyeVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldEVudHJ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTA5CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1tb2RlcmF0b3IvY29udHJhY3QuYWxnby50czoxMTEKICAgIC8vIHJldHVybiBlbmNvZGVBcmM0KHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUpCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtbW9kZXJhdG9yL2NvbnRyYWN0LmFsZ28udHM6MTA5CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUNvbnRyYWN0LnVwZGF0ZUFraXRhREFPW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU86CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgcHVzaGJ5dGVzICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDAKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURBTwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQACCCYEBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcgAxGEAANyoiZ4ICEnJlZ2lzdHJhdGlvbl9zaGFwZQ4odWludDgsdWludDY0KWeAC2NoZWNrX3NoYXBlK2cxGRREMRhBADuCBwQynwTuBHe7ebkEbgP1CgSB8WVDBJDU+l0EM+kslASFTe3gNhoAjgcAOwBYAJ4BigGZAbMAAQAiQ4AEzZrWfjYaAI4BAAEANhoBSSNZJAhLARUSRFcCADYaAkkVJRJEF4AHdmVyc2lvbk8CZylMZyJDNhoBSSNZJAhMFRJEgAwVH3x1AAAAAAAAJFSwIkMxFiIJSTgQIhJENhoBSSNZJAhLARUSRFcCAEkVgQkSREsBOAcyChJPAjgIgdRIEhBEIyplREkiCCpMZxZJTwK/KExQsCJDKzYaAUkVgSASRDYaAkkVJRJEFzYaA0kjWSQISwEVEkRXAgAVFEQWvkRJVwABTgIiW0yxIyllRIADc2FsZUiBGFuABB88YYyyGrIYshqBBrIQI7IBs7Q+SVcEAEsBVwAEKBJESRWBCRJEI1NMgQVbTEAADiOAAQAjTwJUKExQsCJDMgdLAglFBEsCgAEKEkEAB0lLBBJC/9xLAoABFBJBAAdJSwQTQv/MSwKAAR4SQQAHSUsEDEL/vEsCgAEoEkEAB0lLBA5C/6xLAoABMhJBAAdJSwQNQv+cSwKAATwSQQAHSUsED0L/jCNC/4g2GgFJFYEJEkQoTFCwIkM2GgFJFSUSRBcWvkRJFRZXBgJMUChMULAiQzYaAUkVJRJEFzEAIyllRIAGd2FsbGV0ZUhyCEQSRClMZyJD", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the SocialModeratorGate smart contract
 */
export class SocialModeratorGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return SocialModeratorGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the SocialModeratorGate smart contract using the create(string,uint64)void ABI method
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
 * A factory to create and deploy one or more instance of the SocialModeratorGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class SocialModeratorGateFactory {
    /**
     * Creates a new instance of `SocialModeratorGateFactory`
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
                 * Creates a new instance of the SocialModeratorGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(SocialModeratorGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialModeratorGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(SocialModeratorGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialModeratorGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(SocialModeratorGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new SocialModeratorGateClient(result.appClient) };
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
        return new SocialModeratorGateClient(this.appFactory.getAppClientById(params));
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
        return new SocialModeratorGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the SocialModeratorGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? SocialModeratorGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new SocialModeratorGateClient(result.appClient) };
    }
}
/**
 * A client to make calls to the SocialModeratorGate smart contract
 */
export class SocialModeratorGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the SocialModeratorGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(SocialModeratorGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the SocialModeratorGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(SocialModeratorGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the SocialModeratorGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialModeratorGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current SocialModeratorGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current SocialModeratorGate app
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
             * Methods to access box state for the current SocialModeratorGate app
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
     * Returns a new `SocialModeratorGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new SocialModeratorGateClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `SocialModeratorGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new SocialModeratorGateClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new SocialModeratorGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the SocialModeratorGate smart contract using the `getRegistrationShape((uint8,uint64))(uint8,uint64)` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getRegistrationShape(params) {
        const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.getRegistrationShape(params));
        return result.return;
    }
    /**
     * Makes a readonly (simulated) call to the SocialModeratorGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(SocialModeratorGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the SocialModeratorGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the SocialModeratorGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the SocialModeratorGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((uint8,uint64))(uint8,uint64) method call against the SocialModeratorGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((uint8,uint64))(uint8,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the SocialModeratorGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the SocialModeratorGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the SocialModeratorGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the SocialModeratorGate contract
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
//# sourceMappingURL=SocialModeratorGateClient.js.map