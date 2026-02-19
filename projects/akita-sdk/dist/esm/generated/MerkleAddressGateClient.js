"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleAddressGateClient = exports.MerkleAddressGateFactory = exports.MerkleAddressGateParamsFactory = exports.APP_SPEC = void 0;
exports.MerkleAddressGateRegistryInfoFromTuple = MerkleAddressGateRegistryInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "MerkleAddressGate", "structs": { "MerkleAddressGateRegistryInfo": [{ "name": "creator", "type": "address" }, { "name": "name", "type": "string" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(address,string)", "struct": "MerkleAddressGateRegistryInfo", "name": "shape" }], "returns": { "type": "(address,string)", "struct": "MerkleAddressGateRegistryInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getCheckShape", "args": [{ "type": "byte[32][]", "name": "shape" }], "returns": { "type": "byte[32][]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "MerkleAddressGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [393, 531], "errorMessage": "Box must have value" }, { "pc": [478], "errorMessage": "Bytes has valid prefix" }, { "pc": [305, 388, 592], "errorMessage": "Invalid number of arguments" }, { "pc": [324], "errorMessage": "Invalid payment" }, { "pc": [116], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [576], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [574], "errorMessage": "application exists" }, { "pc": [328, 414, 561], "errorMessage": "check GlobalState exists" }, { "pc": [512], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [260, 296, 379], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [214], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [483], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [226, 365, 527, 554], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [356], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [283], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDIgMzIKICAgIGJ5dGVjYmxvY2sgMHgxNTFmN2M3NSAicmVnaXN0cnlfY3Vyc29yIiAiYWtpdGFfZGFvIgogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJueiBtYWluX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjMwCiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzEgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIGludGNfMCAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjMyCiAgICAvLyByZWdpc3RyYXRpb25TaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICcoYWRkcmVzcyxzdHJpbmcpJywga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyYXRpb25TaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAicmVnaXN0cmF0aW9uX3NoYXBlIiAiKGFkZHJlc3Msc3RyaW5nKSIgLy8gInJlZ2lzdHJhdGlvbl9zaGFwZSIsICIoYWRkcmVzcyxzdHJpbmcpIgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czozNAogICAgLy8gY2hlY2tTaGFwZSA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBpbml0aWFsVmFsdWU6ICdieXRlWzMyXVtdJywga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlDaGVja1NoYXBlIH0pCiAgICBwdXNoYnl0ZXNzICJjaGVja19zaGFwZSIgImJ5dGVbMzJdW10iIC8vICJjaGVja19zaGFwZSIsICJieXRlWzMyXVtdIgogICAgYXBwX2dsb2JhbF9wdXQKCm1haW5fYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjI2CiAgICAvLyBleHBvcnQgY2xhc3MgTWVya2xlQWRkcmVzc0dhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMTQKICAgIHB1c2hieXRlc3MgMHgzMjlmMDRlZSAweDc3YmI3OWI5IDB4NmUwM2Y1MGEgMHhiYmI4YTJhYyAweGI0NTViMDVlIDB4OTBkNGZhNWQgMHgzM2U5MmM5NCAweDg1NGRlZGUwIC8vIG1ldGhvZCAiY29zdChieXRlW10pdWludDY0IiwgbWV0aG9kICJyZWdpc3RlcihwYXksYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAiY2hlY2soYWRkcmVzcyx1aW50NjQsYnl0ZVtdKWJvb2wiLCBtZXRob2QgImdldFJlZ2lzdHJhdGlvblNoYXBlKChhZGRyZXNzLHN0cmluZykpKGFkZHJlc3Msc3RyaW5nKSIsIG1ldGhvZCAiZ2V0Q2hlY2tTaGFwZShieXRlWzMyXVtdKWJ5dGVbMzJdW10iLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRSZWdpc3RyYXRpb25TaGFwZSBnZXRDaGVja1NoYXBlIGdldEVudHJ5IHVwZGF0ZUFraXRhREFPIG1haW5fb3BVcF9yb3V0ZUAxMgogICAgZXJyCgptYWluX29wVXBfcm91dGVAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MwogICAgLy8gb3BVcCgpOiB2b2lkIHsgfQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfTm9PcEAxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czoyNgogICAgLy8gZXhwb3J0IGNsYXNzIE1lcmtsZUFkZHJlc3NHYXRlIGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgewogICAgcHVzaGJ5dGVzIDB4Y2Q5YWQ2N2UgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY3JlYXRlCiAgICBlcnIKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo1MAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBwdXNoYnl0ZXMgInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NTIKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjMwCiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzEgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo1NAogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSA9IDEKICAgIGludGNfMCAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjUwCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo6TWVya2xlQWRkcmVzc0dhdGUuY29zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmNvc3QKICAgIGl0b2IKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLnJlZ2lzdGVyW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVnaXN0ZXI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NjQKICAgIC8vIHJlZ2lzdGVyKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMCAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NjUKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA+PSBNaW5SZWdpc3RlckFyZ3NMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM1IC8vIDM1CiAgICA+PQogICAgYXNzZXJ0IC8vIEludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjY2LTczCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMuY29zdChhcmdzKQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo2OQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo2Ni03MwogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmNvc3QoYXJncykKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NzAKICAgIC8vIGFtb3VudDogdGhpcy5jb3N0KGFyZ3MpCiAgICBkaWcgMgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmNvc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo2Ni03MwogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLmNvc3QoYXJncykKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czozMAogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18xIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NDMKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo0NAogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMCAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6MzAKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMSAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjQ0CiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlICs9IDEKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NzYKICAgIC8vIHRoaXMucmVnaXN0cnkoaWQpLnZhbHVlID0gZGVjb2RlQXJjNDxNZXJrbGVBZGRyZXNzR2F0ZVJlZ2lzdHJ5SW5mbz4oYXJncykKICAgIGl0b2IKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjY0CiAgICAvLyByZWdpc3RlcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFyZ3M6IGJ5dGVzKTogdWludDY0IHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmNoZWNrW3JvdXRpbmddKCkgLT4gdm9pZDoKY2hlY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6ODAKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjgxCiAgICAvLyBhc3NlcnQoYXJncy5sZW5ndGggPj0gTWluQ2hlY2tBcmdzTGVuZ3RoLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA2NiAvLyA2NgogICAgPj0KICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo4MwogICAgLy8gY29uc3QgeyBjcmVhdG9yLCBuYW1lIH0gPSBjbG9uZSh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgc3dhcAogICAgaXRvYgogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgc3dhcAogICAgaW50Y18xIC8vIDAKICAgIGludGNfMyAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIGRpZyAxCiAgICBpbnRjXzMgLy8gMzIKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMgogICAgbGVuCiAgICB1bmNvdmVyIDMKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo4NS05NAogICAgLy8gcmV0dXJuIGFiaUNhbGw8dHlwZW9mIE1ldGFNZXJrbGVzLnByb3RvdHlwZS52ZXJpZnk+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5tZXRhTWVya2xlcywKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGNyZWF0b3IsCiAgICAvLyAgICAgbmFtZSwKICAgIC8vICAgICBzaGEyNTYoc2hhMjU2KGNhbGxlci5ieXRlcykpLAogICAgLy8gICAgIHByb29mLAogICAgLy8gICAgIE1lcmtsZVRyZWVUeXBlVW5zcGVjaWZpZWQsCiAgICAvLyAgIF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1ldGFNZXJrbGVzLAogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1ldGFNZXJrbGVzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIHB1c2hieXRlcyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1ldGFNZXJrbGVzLAogICAgcHVzaGludCA3MiAvLyA3MgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo5MAogICAgLy8gc2hhMjU2KHNoYTI1NihjYWxsZXIuYnl0ZXMpKSwKICAgIHVuY292ZXIgNAogICAgc2hhMjU2CiAgICBzaGEyNTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo5MgogICAgLy8gTWVya2xlVHJlZVR5cGVVbnNwZWNpZmllZCwKICAgIGludGNfMSAvLyAwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6ODUtOTQKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBNZXRhTWVya2xlcy5wcm90b3R5cGUudmVyaWZ5Pih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubWV0YU1lcmtsZXMsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBjcmVhdG9yLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgc2hhMjU2KHNoYTI1NihjYWxsZXIuYnl0ZXMpKSwKICAgIC8vICAgICBwcm9vZiwKICAgIC8vICAgICBNZXJrbGVUcmVlVHlwZVVuc3BlY2lmaWVkLAogICAgLy8gICBdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDJiZjNjYzVhIC8vIG1ldGhvZCAidmVyaWZ5KGFkZHJlc3Msc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0KWJvb2wiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMCAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjgwCiAgICAvLyBjaGVjayhjYWxsZXI6IEFjY291bnQsIHJlZ2lzdHJ5SUQ6IHVpbnQ2NCwgYXJnczogYnl0ZXMpOiBib29sZWFuIHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmdldFJlZ2lzdHJhdGlvblNoYXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0UmVnaXN0cmF0aW9uU2hhcGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6OTcKICAgIC8vIGdldFJlZ2lzdHJhdGlvblNoYXBlKHNoYXBlOiBNZXJrbGVBZGRyZXNzR2F0ZVJlZ2lzdHJ5SW5mbyk6IE1lcmtsZUFkZHJlc3NHYXRlUmVnaXN0cnlJbmZvIHsKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmdldENoZWNrU2hhcGVbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRDaGVja1NoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9tZXJrbGUtYWRkcmVzcy9jb250cmFjdC5hbGdvLnRzOjEwMQogICAgLy8gZ2V0Q2hlY2tTaGFwZShzaGFwZTogUHJvb2YpOiBQcm9vZiB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFszMl1bXSkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmdldEVudHJ5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0RW50cnk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6MTA1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6MTA3CiAgICAvLyByZXR1cm4gZW5jb2RlQXJjNCh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czoxMDUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzIgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBwdXNoYnl0ZXMgIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18yIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvbWVya2xlLWFkZHJlc3MvY29udHJhY3QuYWxnby50czo6TWVya2xlQWRkcmVzc0dhdGUuY29zdChhcmdzOiBieXRlcykgLT4gdWludDY0OgpzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6Ok1lcmtsZUFkZHJlc3NHYXRlLmNvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NTkKICAgIC8vIGNvc3QoYXJnczogYnl0ZXMpOiB1aW50NjQgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NjAKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA+PSBNaW5SZWdpc3RlckFyZ3NMZW5ndGgsIEVSUl9JTlZBTElEX0FSR19DT1VOVCkKICAgIGZyYW1lX2RpZyAtMQogICAgbGVuCiAgICBkdXAKICAgIHB1c2hpbnQgMzUgLy8gMzUKICAgID49CiAgICBhc3NlcnQgLy8gSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL21lcmtsZS1hZGRyZXNzL2NvbnRyYWN0LmFsZ28udHM6NjEKICAgIC8vIHJldHVybiBNaW5NZXRhTWVya2xlUmVnaXN0cnlNQlIgKyAoQm94Q29zdFBlckJveCAqIChhcmdzLmxlbmd0aCAtIDMyKSkKICAgIGludGNfMyAvLyAzMgogICAgLQogICAgcHVzaGludCAyNTAwIC8vIDI1MDAKICAgICoKICAgIHB1c2hpbnQgMTg1MDAgLy8gMTg1MDAKICAgICsKICAgIHJldHN1Ygo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQACICYDBBUffHUPcmVnaXN0cnlfY3Vyc29yCWFraXRhX2RhbzEYQABEKSJnggIScmVnaXN0cmF0aW9uX3NoYXBlEChhZGRyZXNzLHN0cmluZylnggILY2hlY2tfc2hhcGUKYnl0ZVszMl1bXWcxGRREMRhBAEKCCAQynwTuBHe7ebkEbgP1CgS7uKKsBLRVsF4EkNT6XQQz6SyUBIVN7eA2GgCOCAA/AFkApAExATkBTgFpAAEAIkOABM2a1n42GgCOAQABADYaAUkjWSQISwEVEkRXAgA2GgJJFYEIEkQXgAd2ZXJzaW9uTwJnKkxnKSJnIkM2GgFJI1kkCEsBFRJEVwIAiAE7FihMULAiQzEWIglJOBAiEkQ2GgFJI1kkCEsBFRJEVwIASRWBIw9ESwE4BzIKEk8COAhLAogBBBIQRCMpZURJIggpTGcWSbxISU8CvyhMULAiQzYaAUkVJRJENhoCSRWBCBJEFzYaA0kjWSQISwEVEkRXAgBJFYFCD0RMFkm+REwjJbpLASVZSwIVTwNOAlKxIyplRIADYWFsZUiBSFtPBAEBIxaABCvzzFqyGk8EshpPA7IaTLIaTwKyGrIashiBBrIQI7IBs7Q+SVcEAExXAAQoEkRJFSISRChMULAiQyg2GgFQsCJDNhoBSSNZJQskCEsBFRJEKExQsCJDNhoBSRWBCBJEFxa+REkVFlcGAkxQKExQsCJDNhoBSRWBCBJEFzEAIyplRIAGd2FsbGV0ZUhyCEQSRCpMZyJDigEBi/8VSYEjD0QlCYHEEwuBxJABCIk=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a MerkleAddressGateRegistryInfo to the struct representation
 */
function MerkleAddressGateRegistryInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.MerkleAddressGateRegistryInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the MerkleAddressGate smart contract
 */
class MerkleAddressGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return MerkleAddressGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the MerkleAddressGate smart contract using the create(string,uint64)void ABI method
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
     * Constructs a no op call for the getRegistrationShape((address,string))(address,string) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((address,string))(address,string)',
            args: Array.isArray(params.args) ? params.args : [params.args.shape],
        };
    }
    /**
     * Constructs a no op call for the getCheckShape(byte[32][])byte[32][] ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getCheckShape(params) {
        return {
            ...params,
            method: 'getCheckShape(byte[32][])byte[32][]',
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
exports.MerkleAddressGateParamsFactory = MerkleAddressGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the MerkleAddressGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class MerkleAddressGateFactory {
    /**
     * Creates a new instance of `MerkleAddressGateFactory`
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
                 * Creates a new instance of the MerkleAddressGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(MerkleAddressGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the MerkleAddressGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(MerkleAddressGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the MerkleAddressGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(MerkleAddressGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new MerkleAddressGateClient(result.appClient) };
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
        return new MerkleAddressGateClient(this.appFactory.getAppClientById(params));
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
        return new MerkleAddressGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the MerkleAddressGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? MerkleAddressGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new MerkleAddressGateClient(result.appClient) };
    }
}
exports.MerkleAddressGateFactory = MerkleAddressGateFactory;
/**
 * A client to make calls to the MerkleAddressGate smart contract
 */
class MerkleAddressGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the MerkleAddressGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getRegistrationShape((address,string))(address,string)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getCheckShape(byte[32][])byte[32][]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getCheckShape: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.getCheckShape(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(MerkleAddressGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the MerkleAddressGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getRegistrationShape((address,string))(address,string)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getCheckShape(byte[32][])byte[32][]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getCheckShape: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.getCheckShape(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(MerkleAddressGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the MerkleAddressGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getRegistrationShape((address,string))(address,string)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getCheckShape(byte[32][])byte[32][]` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getCheckShape: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.getCheckShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the MerkleAddressGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current MerkleAddressGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current MerkleAddressGate app
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
             * Methods to access box state for the current MerkleAddressGate app
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
     * Returns a new `MerkleAddressGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new MerkleAddressGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `MerkleAddressGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new MerkleAddressGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new MerkleAddressGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the MerkleAddressGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(MerkleAddressGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the MerkleAddressGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the MerkleAddressGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the MerkleAddressGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((address,string))(address,string) method call against the MerkleAddressGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((address,string))(address,string)', v));
                return this;
            },
            /**
             * Add a getCheckShape(byte[32][])byte[32][] method call against the MerkleAddressGate contract
             */
            getCheckShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getCheckShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getCheckShape(byte[32][])byte[32][]', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the MerkleAddressGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the MerkleAddressGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the MerkleAddressGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the MerkleAddressGate contract
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
exports.MerkleAddressGateClient = MerkleAddressGateClient;
//# sourceMappingURL=MerkleAddressGateClient.js.map