import { getArc56ReturnValue } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "NFDRootGate", "structs": {}, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "AVMString", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [373, 711], "errorMessage": "Box must have value" }, { "pc": [537, 605], "errorMessage": "Bytes has valid prefix" }, { "pc": [366], "errorMessage": "Invalid number of arguments" }, { "pc": [298], "errorMessage": "Invalid payment" }, { "pc": [102], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [755], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [753], "errorMessage": "application exists" }, { "pc": [302, 479, 740], "errorMessage": "check GlobalState exists" }, { "pc": [228, 270, 358, 614], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [186], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [542], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [197, 344, 707, 733], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [336], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [257], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggMgogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJha2l0YV9kYW8iICJyZWdpc3RyeV9jdXJzb3IiCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MjIKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgaW50Y18xIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MjUKICAgIC8vIHJlZ2lzdHJhdGlvblNoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJ3N0cmluZycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cmF0aW9uU2hhcGUgfSkKICAgIHB1c2hieXRlc3MgInJlZ2lzdHJhdGlvbl9zaGFwZSIgInN0cmluZyIgLy8gInJlZ2lzdHJhdGlvbl9zaGFwZSIsICJzdHJpbmciCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjI3CiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJ3VpbnQ2NCcsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAiY2hlY2tfc2hhcGUiICJ1aW50NjQiIC8vICJjaGVja19zaGFwZSIsICJ1aW50NjQiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MTgKICAgIC8vIGV4cG9ydCBjbGFzcyBORkRSb290R2F0ZSBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxMgogICAgcHVzaGJ5dGVzcyAweDMyOWYwNGVlIDB4NzdiYjc5YjkgMHg2ZTAzZjUwYSAweDkwZDRmYTVkIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAvLyBtZXRob2QgImNvc3QoYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXIocGF5LGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgImNoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXSlib29sIiwgbWV0aG9kICJnZXRFbnRyeSh1aW50NjQpYnl0ZVtdIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBTyh1aW50NjQpdm9pZCIsIG1ldGhvZCAib3BVcCgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNvc3QgcmVnaXN0ZXIgY2hlY2sgZ2V0RW50cnkgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDEwCiAgICBlcnIKCm1haW5fb3BVcF9yb3V0ZUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQzCiAgICAvLyBvcFVwKCk6IHZvaWQgeyB9CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2NyZWF0ZV9Ob09wQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjE4CiAgICAvLyBleHBvcnQgY2xhc3MgTkZEUm9vdEdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhjZDlhZDY3ZSAvLyBtZXRob2QgImNyZWF0ZShzdHJpbmcsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo6TkZEUm9vdEdhdGUuY3JlYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjgzCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIHB1c2hieXRlcyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo4NQogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6ODYKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBBcHBsaWNhdGlvbihha2l0YURBTykKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6ODMKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjpORkRSb290R2F0ZS5jb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKY29zdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo5MQogICAgLy8gY29zdChhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6OTIKICAgIC8vIHJldHVybiBNaW5ORkRSb290R2F0ZVJlZ2lzdHJ5TUJSICsgKEJveENvc3RQZXJCb3ggKiBhcmdzLmxlbmd0aCkKICAgIGxlbgogICAgcHVzaGludCAyNTAwIC8vIDI1MDAKICAgICoKICAgIHB1c2hpbnQgNTcwMCAvLyA1NzAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6OTEKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgaXRvYgogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo6TkZEUm9vdEdhdGUucmVnaXN0ZXJbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3RlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo5NQogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo5Ny0xMDQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5jb3N0KGFyZ3MpCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjEwMAogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo5Ny0xMDQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5jb3N0KGFyZ3MpCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDIKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjkyCiAgICAvLyByZXR1cm4gTWluTkZEUm9vdEdhdGVSZWdpc3RyeU1CUiArIChCb3hDb3N0UGVyQm94ICogYXJncy5sZW5ndGgpCiAgICBkaWcgMgogICAgbGVuCiAgICBwdXNoaW50IDI1MDAgLy8gMjUwMAogICAgKgogICAgcHVzaGludCA1NzAwIC8vIDU3MDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo5Ny0xMDQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5jb3N0KGFyZ3MpCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBjb25zdCBpZCA9IHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MjIKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMiAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBjb25zdCBpZCA9IHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MzcKICAgIC8vIHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUgKz0gMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjIyCiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czozNwogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjEwNwogICAgLy8gdGhpcy5yZWdpc3RyeShpZCkudmFsdWUgPSBTdHJpbmcoYXJncykKICAgIGl0b2IKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjk1CiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6Ok5GRFJvb3RHYXRlLmNoZWNrW3JvdXRpbmddKCkgLT4gdm9pZDoKY2hlY2s6CiAgICBpbnRjXzAgLy8gMAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czoxMTEKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czoxMTIKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gVWludDY0Qnl0ZUxlbmd0aCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjExMwogICAgLy8gY29uc3Qgcm9vdCA9IHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUKICAgIHN3YXAKICAgIGl0b2IKICAgIGJveF9nZXQKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6MTE0CiAgICAvLyByZXR1cm4gdGhpcy5uZmRHYXRlKGNhbGxlciwgYnRvaShhcmdzKSwgcm9vdCkKICAgIGJ0b2kKICAgIGR1cG4gMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjQyCiAgICAvLyBjb25zdCBuZmROYW1lID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYXBwSUQsIEJ5dGVzKE5GREdsb2JhbFN0YXRlS2V5c05hbWUpKVswXQogICAgcHVzaGJ5dGVzICJpLm5hbWUiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIGNvbnN0IHBhcmVudEV4aXN0cyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFwcElELCBCeXRlcyhORkRHbG9iYWxTdGF0ZUtleXNQYXJlbnRBcHBJRCkpWzFdCiAgICBwdXNoYnl0ZXMgImkucGFyZW50QXBwSUQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDctNTEKICAgIC8vIHBhcmVudEV4aXN0cyAmJgogICAgLy8gcm9vdEJ5dGVzICE9PSBuZmROYW1lLnNsaWNlKAogICAgLy8gICBuZmROYW1lLmxlbmd0aCAtIChyb290Qnl0ZXMubGVuZ3RoICsgNSksCiAgICAvLyAgIG5mZE5hbWUubGVuZ3RoIC0gNQogICAgLy8gKQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDgtNTEKICAgIC8vIHJvb3RCeXRlcyAhPT0gbmZkTmFtZS5zbGljZSgKICAgIC8vICAgbmZkTmFtZS5sZW5ndGggLSAocm9vdEJ5dGVzLmxlbmd0aCArIDUpLAogICAgLy8gICBuZmROYW1lLmxlbmd0aCAtIDUKICAgIC8vICkKICAgIGR1cG4gMgogICAgbGVuCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDkKICAgIC8vIG5mZE5hbWUubGVuZ3RoIC0gKHJvb3RCeXRlcy5sZW5ndGggKyA1KSwKICAgIGRpZyA0CiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGxlbgogICAgcHVzaGludCA1IC8vIDUKICAgICsKICAgIGRpZyAxCiAgICBzd2FwCiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDgtNTEKICAgIC8vIHJvb3RCeXRlcyAhPT0gbmZkTmFtZS5zbGljZSgKICAgIC8vICAgbmZkTmFtZS5sZW5ndGggLSAocm9vdEJ5dGVzLmxlbmd0aCArIDUpLAogICAgLy8gICBuZmROYW1lLmxlbmd0aCAtIDUKICAgIC8vICkKICAgIGR1cAogICAgZGlnIDIKICAgID49CiAgICBkaWcgMgogICAgc3dhcAogICAgc2VsZWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NTAKICAgIC8vIG5mZE5hbWUubGVuZ3RoIC0gNQogICAgZGlnIDEKICAgIHB1c2hpbnQgNSAvLyA1CiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NDgtNTEKICAgIC8vIHJvb3RCeXRlcyAhPT0gbmZkTmFtZS5zbGljZSgKICAgIC8vICAgbmZkTmFtZS5sZW5ndGggLSAocm9vdEJ5dGVzLmxlbmd0aCArIDUpLAogICAgLy8gICBuZmROYW1lLmxlbmd0aCAtIDUKICAgIC8vICkKICAgIGR1cAogICAgZGlnIDMKICAgID49CiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkdXAKICAgIGRpZyAyCiAgICA8CiAgICBkaWcgMgogICAgc3dhcAogICAgc2VsZWN0CiAgICBzdWJzdHJpbmczCiAgICAhPQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjQ3LTUxCiAgICAvLyBwYXJlbnRFeGlzdHMgJiYKICAgIC8vIHJvb3RCeXRlcyAhPT0gbmZkTmFtZS5zbGljZSgKICAgIC8vICAgbmZkTmFtZS5sZW5ndGggLSAocm9vdEJ5dGVzLmxlbmd0aCArIDUpLAogICAgLy8gICBuZmROYW1lLmxlbmd0aCAtIDUKICAgIC8vICkKICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyByZXR1cm4gZmFsc2UKICAgIGludGNfMCAvLyAwCgpjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo6TkZEUm9vdEdhdGUubmZkR2F0ZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czoxMTEKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjU2LTU5CiAgICAvLyBjb25zdCB2ZXJpZmllZCA9IGFiaUNhbGw8dHlwZW9mIE5GRFJlZ2lzdHJ5LnByb3RvdHlwZS5pc1ZhbGlkTmZkQXBwSWQ+KHsKICAgIC8vICAgYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5uZmRSZWdpc3RyeSwKICAgIC8vICAgYXJnczogW1N0cmluZyhuZmROYW1lKSwgYXBwSURdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5uZmRSZWdpc3RyeSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5uZmRSZWdpc3RyeSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU1CiAgICAvLyBjb25zdCBbb3RoZXJBcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzT3RoZXJBcHBMaXN0KSkKICAgIHB1c2hieXRlcyAib2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjU3CiAgICAvLyBhcHBJZDogZ2V0T3RoZXJBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm5mZFJlZ2lzdHJ5LAogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NTgKICAgIC8vIGFyZ3M6IFtTdHJpbmcobmZkTmFtZSksIGFwcElEXSwKICAgIGRpZyAxCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDMKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo1Ni01OQogICAgLy8gY29uc3QgdmVyaWZpZWQgPSBhYmlDYWxsPHR5cGVvZiBORkRSZWdpc3RyeS5wcm90b3R5cGUuaXNWYWxpZE5mZEFwcElkPih7CiAgICAvLyAgIGFwcElkOiBnZXRPdGhlckFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubmZkUmVnaXN0cnksCiAgICAvLyAgIGFyZ3M6IFtTdHJpbmcobmZkTmFtZSksIGFwcElEXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHg0YmUyMmZjNiAvLyBtZXRob2QgImlzVmFsaWROZmRBcHBJZChzdHJpbmcsdWludDY0KWJvb2wiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjYxCiAgICAvLyBpZiAoIXZlcmlmaWVkKSB7CiAgICBibnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NjIKICAgIC8vIHJldHVybiBmYWxzZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czoxMTQKICAgIC8vIHJldHVybiB0aGlzLm5mZEdhdGUoY2FsbGVyLCBidG9pKGFyZ3MpLCByb290KQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo6TkZEUm9vdEdhdGUubmZkR2F0ZUAxMgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjY1LTY4CiAgICAvLyBjb25zdCBjYUFsZ29EYXRhID0gYWJpQ2FsbDx0eXBlb2YgTkZELnByb3RvdHlwZS5yZWFkRmllbGQ+KHsKICAgIC8vICAgYXBwSWQ6IGFwcElELAogICAgLy8gICBhcmdzOiBbQnl0ZXMoTkZETWV0YUtleVZlcmlmaWVkQWRkcmVzc2VzKV0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgcHVzaGJ5dGVzIDB4NmMxM2VkZTQgLy8gbWV0aG9kICJyZWFkRmllbGQoYnl0ZVtdKWJ5dGVbXSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NjcKICAgIC8vIGFyZ3M6IFtCeXRlcyhORkRNZXRhS2V5VmVyaWZpZWRBZGRyZXNzZXMpXSwKICAgIHB1c2hieXRlcyAweDAwMGQ3NjJlNjM2MTQxNmM2NzZmMmUzMDJlNjE3MwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo2NS02OAogICAgLy8gY29uc3QgY2FBbGdvRGF0YSA9IGFiaUNhbGw8dHlwZW9mIE5GRC5wcm90b3R5cGUucmVhZEZpZWxkPih7CiAgICAvLyAgIGFwcElkOiBhcHBJRCwKICAgIC8vICAgYXJnczogW0J5dGVzKE5GRE1ldGFLZXlWZXJpZmllZEFkZHJlc3NlcyldLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDYgMAogICAgYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NzAKICAgIC8vIGxldCBleGlzdHM6IGJvb2xlYW4gPSBmYWxzZQogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgNwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjcxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgY2FBbGdvRGF0YS5sZW5ndGg7IGkgKz0gMzIpIHsKICAgIGludGNfMCAvLyAwCiAgICBidXJ5IDYKCmNoZWNrX3doaWxlX3RvcEA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjcxCiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgY2FBbGdvRGF0YS5sZW5ndGg7IGkgKz0gMzIpIHsKICAgIGRpZyA3CiAgICBsZW4KICAgIGR1cAogICAgYnVyeSA2CiAgICBkaWcgNgogICAgPgogICAgYnogY2hlY2tfYWZ0ZXJfd2hpbGVAMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbmZkLXJvb3QvY29udHJhY3QuYWxnby50czo3MgogICAgLy8gY29uc3QgYWRkciA9IGNhQWxnb0RhdGEuc2xpY2UoaSwgMzIpCiAgICBkaWcgNQogICAgZHVwCiAgICBkaWcgNgogICAgZHVwCiAgICBjb3ZlciAzCiAgICA+PQogICAgZGlnIDIKICAgIHN3YXAKICAgIHNlbGVjdAogICAgcHVzaGludCAzMiAvLyAzMgogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkdXAKICAgIGRpZyAyCiAgICA8CiAgICBkaWcgMgogICAgc3dhcAogICAgc2VsZWN0CiAgICBkaWcgOQogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjczCiAgICAvLyBpZiAoYWRkciA9PT0gdXNlci5ieXRlcykgewogICAgZGlnIDQKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDEwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NzQKICAgIC8vIGV4aXN0cyA9IHRydWUKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDcKCmNoZWNrX2FmdGVyX2lmX2Vsc2VAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL25mZC1yb290L2NvbnRyYWN0LmFsZ28udHM6NzEKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBjYUFsZ29EYXRhLmxlbmd0aDsgaSArPSAzMikgewogICAgZGlnIDUKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgICsKICAgIGJ1cnkgNgogICAgYiBjaGVja193aGlsZV90b3BANwoKY2hlY2tfYWZ0ZXJfd2hpbGVAMTE6CiAgICBkaWcgNgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjExNAogICAgLy8gcmV0dXJuIHRoaXMubmZkR2F0ZShjYWxsZXIsIGJ0b2koYXJncyksIHJvb3QpCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjpORkRSb290R2F0ZS5uZmRHYXRlQDEyCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjpORkRSb290R2F0ZS5nZXRFbnRyeVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldEVudHJ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjExNwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjExOQogICAgLy8gcmV0dXJuIEJ5dGVzKHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUpCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9uZmQtcm9vdC9jb250cmFjdC5hbGdvLnRzOjExNwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHB1c2hieXRlcyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAEIAiYDBBUffHUJYWtpdGFfZGFvD3JlZ2lzdHJ5X2N1cnNvcjEYQAA2KiNnggIScmVnaXN0cmF0aW9uX3NoYXBlBnN0cmluZ2eCAgtjaGVja19zaGFwZQZ1aW50NjRnMRkURDEYQQA0ggYEMp8E7gR3u3m5BG4D9QoEkNT6XQQz6SyUBIVN7eA2GgCOBgA7AFsApgIfAjkAAQAjQ4AEzZrWfjYaAI4BAAEANhoBSSJZJQhLARUSRFcCADYaAkkVJBJEF4AHdmVyc2lvbk8CZylMZyNDNhoBSSJZJQhLARUSRFcCABWBxBMLgcQsCBYoTFCwI0MxFiMJSTgQIxJENhoBSSJZJQhLARUSRFcCAEsBOAcyChJPAjgISwIVgcQTC4HELAgSEEQiKmVESSMIKkxnFkm8SElPAr8oTFCwI0MigABHAjYaAUkVgSASRDYaAkkVJBJEFzYaA0kiWSUISwEVEkRXAgBJFSQSREwWvkxOAkQXRwKABmkubmFtZWVITIANaS5wYXJlbnRBcHBJRGVFAUEAQkcCFUsESU4DFYEFCEsBTAlJSwIPSwJMTUsBgQUJSUsDD0xPA08CTUlLAgxLAkxNUhNBAA4igAEAIk8CVChMULAjQ7EiKWVEgANvYWxlSCRbSwFJFRZXBgJMUEsDFoAES+IvxrIaTLIashqyGIEGshAisgGztD5JVwQATFcABCgSREkVIxJEIlNAAAQiQv+msYAEbBPt5LIagA8ADXYuY2FBbGdvLjAuYXOyGksBshiBBrIQIrIBs7Q+SVcEAEsBVwAEKBJESSJZJQhMFRJEVwYARQgiRQciRQZLBxVJRQZLBg1BADlLBUlLBklOAw9LAkxNgSBLAg+BIE8DTwJNSUsCDEsCTE1LCU4CUksEEkEAAyNFB0sFgSAIRQZC/7tLBkL/EjYaAUkVJBJEFxa+REkVFlcGAkxQKExQsCNDNhoBSRUkEkQXMQAiKWVEgAZ3YWxsZXRlSHIIRBJEKUxnI0M=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the NfdRootGate smart contract
 */
export class NfdRootGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return NfdRootGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the NFDRootGate smart contract using the create(string,uint64)void ABI method
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
 * A factory to create and deploy one or more instance of the NFDRootGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class NfdRootGateFactory {
    /**
     * Creates a new instance of `NfdRootGateFactory`
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
                 * Creates a new instance of the NFDRootGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(NfdRootGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the NFDRootGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(NfdRootGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the NFDRootGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(NfdRootGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new NfdRootGateClient(result.appClient) };
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
        return new NfdRootGateClient(this.appFactory.getAppClientById(params));
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
        return new NfdRootGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the NFDRootGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? NfdRootGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new NfdRootGateClient(result.appClient) };
    }
}
/**
 * A client to make calls to the NFDRootGate smart contract
 */
export class NfdRootGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the NFDRootGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(NfdRootGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the NFDRootGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(NfdRootGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the NFDRootGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the NFDRootGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(NfdRootGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current NFDRootGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current NFDRootGate app
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
             * Methods to access box state for the current NFDRootGate app
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
     * Returns a new `NfdRootGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new NfdRootGateClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `NfdRootGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new NfdRootGateClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
        return new NfdRootGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the NFDRootGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(NfdRootGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the NFDRootGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the NFDRootGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the NFDRootGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the NFDRootGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the NFDRootGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the NFDRootGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the NFDRootGate contract
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
//# sourceMappingURL=NFDRootGateClient.js.map