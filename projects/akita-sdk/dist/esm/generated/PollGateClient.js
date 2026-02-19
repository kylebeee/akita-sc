"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollGateClient = exports.PollGateFactory = exports.PollGateParamsFactory = exports.APP_SPEC = void 0;
exports.PollGateRegistryInfoFromTuple = PollGateRegistryInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "PollGate", "structs": { "PollGateRegistryInfo": [{ "name": "poll", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "PollGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [347, 445], "errorMessage": "Box must have value" }, { "pc": [401], "errorMessage": "Bytes has valid prefix" }, { "pc": [269, 344], "errorMessage": "Invalid number of arguments" }, { "pc": [286], "errorMessage": "Invalid payment" }, { "pc": [96], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [489], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [413, 418, 487], "errorMessage": "application exists" }, { "pc": [290, 353, 474], "errorMessage": "check GlobalState exists" }, { "pc": [221, 261, 338], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [180], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [406], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [191, 324, 441, 467], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [316], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [248], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDggMgogICAgYnl0ZWNibG9jayAiYWtpdGFfZGFvIiAweDE1MWY3Yzc1ICJyZWdpc3RyeV9jdXJzb3IiCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czoyMwogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICBpbnRjXzAgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjI2CiAgICAvLyByZWdpc3RyYXRpb25TaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICd1aW50NjQnLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJhdGlvblNoYXBlIH0pCiAgICBwdXNoYnl0ZXNzICJyZWdpc3RyYXRpb25fc2hhcGUiICJ1aW50NjQiIC8vICJyZWdpc3RyYXRpb25fc2hhcGUiLCAidWludDY0IgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjI4CiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJycsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAiY2hlY2tfc2hhcGUiICIiIC8vICJjaGVja19zaGFwZSIsICIiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czoxOQogICAgLy8gZXhwb3J0IGNsYXNzIFBvbGxHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDEyCiAgICBwdXNoYnl0ZXNzIDB4MzI5ZjA0ZWUgMHg3N2JiNzliOSAweDZlMDNmNTBhIDB4OTBkNGZhNWQgMHgzM2U5MmM5NCAweDg1NGRlZGUwIC8vIG1ldGhvZCAiY29zdChieXRlW10pdWludDY0IiwgbWV0aG9kICJyZWdpc3RlcihwYXksYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAiY2hlY2soYWRkcmVzcyx1aW50NjQsYnl0ZVtdKWJvb2wiLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRFbnRyeSB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMTAKICAgIGVycgoKbWFpbl9vcFVwX3JvdXRlQDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czoxOQogICAgLy8gZXhwb3J0IGNsYXNzIFBvbGxHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo6UG9sbEdhdGUuY3JlYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NTgKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgcHVzaGJ5dGVzICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NjAKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NjEKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBBcHBsaWNhdGlvbihha2l0YURBTykKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo1OAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo6UG9sbEdhdGUuY29zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo2NgogICAgLy8gY29zdChhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDAyMmM0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo6UG9sbEdhdGUucmVnaXN0ZXJbcm91dGluZ10oKSAtPiB2b2lkOgpyZWdpc3RlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NzEKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gOCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NzItNzkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogUG9sbEdhdGVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjc1CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6NzItNzkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogUG9sbEdhdGVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgdW5jb3ZlciAyCiAgICBndHhucyBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjc2CiAgICAvLyBhbW91bnQ6IFBvbGxHYXRlUmVnaXN0cnlNQlIKICAgIHB1c2hpbnQgODkwMCAvLyA4OTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo3Mi03OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBQb2xsR2F0ZVJlZ2lzdHJ5TUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6MzcKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjIzCiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzIgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjM3CiAgICAvLyBjb25zdCBpZCA9IHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czozOAogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMCAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czoyMwogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18yIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czozOAogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6ODIKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gZGVjb2RlQXJjNDxQb2xsR2F0ZVJlZ2lzdHJ5SW5mbz4oYXJncykKICAgIGl0b2IKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo3MAogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6OlBvbGxHYXRlLmNoZWNrW3JvdXRpbmddKCkgLT4gdm9pZDoKY2hlY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo4NgogICAgLy8gY2hlY2soY2FsbGVyOiBBY2NvdW50LCByZWdpc3RyeUlEOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKTogYm9vbGVhbiB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9wb2xsL2NvbnRyYWN0LmFsZ28udHM6ODcKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gMCwgRVJSX0lOVkFMSURfQVJHX0NPVU5UKQogICAgbGVuCiAgICAhCiAgICBhc3NlcnQgLy8gSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo4OQogICAgLy8gY29uc3QgeyBwb2xsIH0gPSB0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gY29uc3QgeyBwb2xsIH0gPSBnZXRPdGhlckFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyBjb25zdCB7IHBvbGwgfSA9IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTUKICAgIC8vIGNvbnN0IFtvdGhlckFwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNPdGhlckFwcExpc3QpKQogICAgcHVzaGJ5dGVzICJvYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gY29uc3QgeyBwb2xsIH0gPSBnZXRPdGhlckFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo0NS00OAogICAgLy8gY29uc3Qgdm90ZWQgPSBhYmlDYWxsPHR5cGVvZiBQb2xsLnByb3RvdHlwZS5oYXNWb3RlZD4oewogICAgLy8gICAgIGFwcElkLAogICAgLy8gICAgIGFyZ3M6IFt1c2VyXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHg1YTdmNDkzMiAvLyBtZXRob2QgImhhc1ZvdGVkKGFkZHJlc3MpYm9vbCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzAgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMSAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjUxCiAgICAvLyBhcHBJZC5jcmVhdG9yID09PSBBcHBsaWNhdGlvbihwb2xsKS5hZGRyZXNzICYmCiAgICB1bmNvdmVyIDIKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcENyZWF0b3IKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHVuY292ZXIgMgogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjUxLTUyCiAgICAvLyBhcHBJZC5jcmVhdG9yID09PSBBcHBsaWNhdGlvbihwb2xsKS5hZGRyZXNzICYmCiAgICAvLyB2b3RlZAogICAgJiYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBjaGVjayhjYWxsZXI6IEFjY291bnQsIHJlZ2lzdHJ5SUQ6IHVpbnQ2NCwgYXJnczogYnl0ZXMpOiBib29sZWFuIHsKICAgIHB1c2hieXRlcyAweDAwCiAgICBpbnRjXzEgLy8gMAogICAgdW5jb3ZlciAyCiAgICBzZXRiaXQKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo6UG9sbEdhdGUuZ2V0RW50cnlbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRFbnRyeToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvcG9sbC9jb250cmFjdC5hbGdvLnRzOjk0CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo5NgogICAgLy8gcmV0dXJuIGVuY29kZUFyYzQodGhpcy5yZWdpc3RyeShyZWdpc3RyeUlEKS52YWx1ZSkKICAgIGl0b2IKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3BvbGwvY29udHJhY3QuYWxnby50czo5NAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHB1c2hieXRlcyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQAIAiYDCWFraXRhX2RhbwQVH3x1D3JlZ2lzdHJ5X2N1cnNvcjEYQAAwKiJnggIScmVnaXN0cmF0aW9uX3NoYXBlBnVpbnQ2NGeCAgtjaGVja19zaGFwZQBnMRkURDEYQQA0ggYEMp8E7gR3u3m5BG4D9QoEkNT6XQQz6SyUBIVN7eA2GgCOBgA7AFgAnQEbATUAAQAiQ4AEzZrWfjYaAI4BAAEANhoBSSNZJQhLARUSRFcCADYaAkkVJBJEF4AHdmVyc2lvbk8CZyhMZyJDNhoBSSNZJQhMFRJEgAwVH3x1AAAAAAAAIsSwIkMxFiIJSTgQIhJENhoBSSNZJQhLARUSRFcCAEkVJBJESwE4BzIKEk8COAiBxEUSEEQjKmVESSIIKkxnFklPAr8pTFCwIkM2GgFJFYEgEkQ2GgJJFSQSRBc2GgNJI1klCEsBFRJEVwIAFRREFr5EI1sjKGVEgANvYWxlSIEgW7GABFp/STKyGk8CshpLAbIYgQayECOyAbO0PklXBABMVwAEKRJESRUiEkQjU08CcgdETwJyCEQSEIABACNPAlQpTFCwIkM2GgFJFSQSRBcWvkRJFRZXBgJMUClMULAiQzYaAUkVJBJEFzEAIyhlRIAGd2FsbGV0ZUhyCEQSRChMZyJD", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a PollGateRegistryInfo to the struct representation
 */
function PollGateRegistryInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.PollGateRegistryInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the PollGate smart contract
 */
class PollGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return PollGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the PollGate smart contract using the create(string,uint64)void ABI method
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
exports.PollGateParamsFactory = PollGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the PollGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class PollGateFactory {
    /**
     * Creates a new instance of `PollGateFactory`
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
                 * Creates a new instance of the PollGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(PollGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the PollGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(PollGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the PollGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(PollGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new PollGateClient(result.appClient) };
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
        return new PollGateClient(this.appFactory.getAppClientById(params));
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
        return new PollGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the PollGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? PollGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new PollGateClient(result.appClient) };
    }
}
exports.PollGateFactory = PollGateFactory;
/**
 * A client to make calls to the PollGate smart contract
 */
class PollGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the PollGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the PollGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(PollGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(PollGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(PollGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(PollGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(PollGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(PollGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the PollGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the PollGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the PollGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(PollGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the PollGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the PollGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the PollGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the PollGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the PollGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the PollGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the PollGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(PollGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current PollGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current PollGate app
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
             * Methods to access box state for the current PollGate app
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
     * Returns a new `PollGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new PollGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `PollGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new PollGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new PollGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the PollGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(PollGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the PollGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the PollGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the PollGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the PollGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the PollGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the PollGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the PollGate contract
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
exports.PollGateClient = PollGateClient;
//# sourceMappingURL=PollGateClient.js.map