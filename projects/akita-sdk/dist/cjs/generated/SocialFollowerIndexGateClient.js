"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialFollowerIndexGateClient = exports.SocialFollowerIndexGateFactory = exports.SocialFollowerIndexGateParamsFactory = exports.APP_SPEC = void 0;
exports.SocialFollowerIndexGateRegistryInfoFromTuple = SocialFollowerIndexGateRegistryInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "SocialFollowerIndexGate", "structs": { "SocialFollowerIndexGateRegistryInfo": [{ "name": "user", "type": "address" }, { "name": "op", "type": "uint8" }, { "name": "value", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cost", "args": [{ "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "register", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "check", "args": [{ "type": "address", "name": "caller" }, { "type": "uint64", "name": "registryID" }, { "type": "byte[]", "name": "args" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getRegistrationShape", "args": [{ "type": "(address,uint8,uint64)", "struct": "SocialFollowerIndexGateRegistryInfo", "name": "shape" }], "returns": { "type": "(address,uint8,uint64)", "struct": "SocialFollowerIndexGateRegistryInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getEntry", "args": [{ "type": "uint64", "name": "registryID" }], "returns": { "type": "byte[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 3 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "registryCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cnlfY3Vyc29y" }, "registrationShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "cmVnaXN0cmF0aW9uX3NoYXBl", "desc": "the abi string for the register args" }, "checkShape": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hlY2tfc2hhcGU=", "desc": "the abi string for the check args" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "registry": { "keyType": "uint64", "valueType": "SocialFollowerIndexGateRegistryInfo", "prefix": "" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [384, 612], "errorMessage": "Box must have value" }, { "pc": [461], "errorMessage": "Bytes has valid prefix" }, { "pc": [302, 380], "errorMessage": "Invalid number of arguments" }, { "pc": [320], "errorMessage": "Invalid payment" }, { "pc": [118], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [656], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [654], "errorMessage": "application exists" }, { "pc": [324, 411, 641], "errorMessage": "check GlobalState exists" }, { "pc": [253, 293, 372], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [209], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [594], "errorMessage": "invalid number of bytes for (uint8[32],uint8,uint64)" }, { "pc": [466], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [220, 358, 608, 634], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [350], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [280], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDggMgogICAgYnl0ZWNibG9jayAweDE1MWY3Yzc1ICJyZWdpc3RyeV9jdXJzb3IiICJha2l0YV9kYW8iCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjM3CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzEgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIGludGNfMCAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czozOQogICAgLy8gcmVnaXN0cmF0aW9uU2hhcGUgPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsgaW5pdGlhbFZhbHVlOiAnKGFkZHJlc3MsdWludDgsdWludDY0KScsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cmF0aW9uU2hhcGUgfSkKICAgIHB1c2hieXRlc3MgInJlZ2lzdHJhdGlvbl9zaGFwZSIgIihhZGRyZXNzLHVpbnQ4LHVpbnQ2NCkiIC8vICJyZWdpc3RyYXRpb25fc2hhcGUiLCAiKGFkZHJlc3MsdWludDgsdWludDY0KSIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjQxCiAgICAvLyBjaGVja1NoYXBlID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGluaXRpYWxWYWx1ZTogJ3VpbnQ2NCcsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5Q2hlY2tTaGFwZSB9KQogICAgcHVzaGJ5dGVzcyAiY2hlY2tfc2hhcGUiICJ1aW50NjQiIC8vICJjaGVja19zaGFwZSIsICJ1aW50NjQiCiAgICBhcHBfZ2xvYmFsX3B1dAoKbWFpbl9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjMzCiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsRm9sbG93ZXJJbmRleEdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMTMKICAgIHB1c2hieXRlc3MgMHgzMjlmMDRlZSAweDc3YmI3OWI5IDB4NmUwM2Y1MGEgMHg0ZGViODYxNSAweDkwZDRmYTVkIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAvLyBtZXRob2QgImNvc3QoYnl0ZVtdKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0ZXIocGF5LGJ5dGVbXSl1aW50NjQiLCBtZXRob2QgImNoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXSlib29sIiwgbWV0aG9kICJnZXRSZWdpc3RyYXRpb25TaGFwZSgoYWRkcmVzcyx1aW50OCx1aW50NjQpKShhZGRyZXNzLHVpbnQ4LHVpbnQ2NCkiLCBtZXRob2QgImdldEVudHJ5KHVpbnQ2NClieXRlW10iLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggY29zdCByZWdpc3RlciBjaGVjayBnZXRSZWdpc3RyYXRpb25TaGFwZSBnZXRFbnRyeSB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMTEKICAgIGVycgoKbWFpbl9vcFVwX3JvdXRlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjMzCiAgICAvLyBleHBvcnQgY2xhc3MgU29jaWFsRm9sbG93ZXJJbmRleEdhdGUgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhjZDlhZDY3ZSAvLyBtZXRob2QgImNyZWF0ZShzdHJpbmcsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VySW5kZXhHYXRlLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NzgKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgcHVzaGJ5dGVzICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo4MAogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18yIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjgxCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czozNwogICAgLy8gcmVnaXN0cnlDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsgaW5pdGlhbFZhbHVlOiAxLCBrZXk6IEdhdGVHbG9iYWxTdGF0ZUtleVJlZ2lzdHJ5Q3Vyc29yIH0pCiAgICBieXRlY18xIC8vICJyZWdpc3RyeV9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjgyCiAgICAvLyB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlID0gMQogICAgaW50Y18wIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjc4CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VySW5kZXhHYXRlLmNvc3Rbcm91dGluZ10oKSAtPiB2b2lkOgpjb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo4NwogICAgLy8gY29zdChhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDA1NjU0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5yZWdpc3Rlcltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZ2lzdGVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo5MQogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18wIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMCAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OTIKICAgIC8vIGFzc2VydChhcmdzLmxlbmd0aCA9PT0gUmVnaXN0ZXJCeXRlTGVuZ3RoLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA0MSAvLyA0MQogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OTMtMTAwCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IFVzZXJPcGVyYXRvclZhbHVlUmVnaXN0cnlNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDEKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjk2CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo5My0xMDAKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogVXNlck9wZXJhdG9yVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgdW5jb3ZlciAyCiAgICBndHhucyBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OTcKICAgIC8vIGFtb3VudDogVXNlck9wZXJhdG9yVmFsdWVSZWdpc3RyeU1CUgogICAgcHVzaGludCAyMjEwMCAvLyAyMjEwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo5My0xMDAKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogVXNlck9wZXJhdG9yVmFsdWVSZWdpc3RyeU1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NTAKICAgIC8vIGNvbnN0IGlkID0gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MzcKICAgIC8vIHJlZ2lzdHJ5Q3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGluaXRpYWxWYWx1ZTogMSwga2V5OiBHYXRlR2xvYmFsU3RhdGVLZXlSZWdpc3RyeUN1cnNvciB9KQogICAgYnl0ZWNfMSAvLyAicmVnaXN0cnlfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo1MAogICAgLy8gY29uc3QgaWQgPSB0aGlzLnJlZ2lzdHJ5Q3Vyc29yLnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo1MQogICAgLy8gdGhpcy5yZWdpc3RyeUN1cnNvci52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMCAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjM3CiAgICAvLyByZWdpc3RyeUN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBpbml0aWFsVmFsdWU6IDEsIGtleTogR2F0ZUdsb2JhbFN0YXRlS2V5UmVnaXN0cnlDdXJzb3IgfSkKICAgIGJ5dGVjXzEgLy8gInJlZ2lzdHJ5X2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NTEKICAgIC8vIHRoaXMucmVnaXN0cnlDdXJzb3IudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MTAzCiAgICAvLyB0aGlzLnJlZ2lzdHJ5KGlkKS52YWx1ZSA9IGRlY29kZUFyYzQ8U29jaWFsRm9sbG93ZXJJbmRleEdhdGVSZWdpc3RyeUluZm8+KGFyZ3MpCiAgICBpdG9iCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo5MQogICAgLy8gcmVnaXN0ZXIobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBieXRlcyk6IHVpbnQ2NCB7CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJJbmRleEdhdGUuY2hlY2tbcm91dGluZ10oKSAtPiB2b2lkOgpjaGVjazoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MTA3CiAgICAvLyBjaGVjayhjYWxsZXI6IEFjY291bnQsIHJlZ2lzdHJ5SUQ6IHVpbnQ2NCwgYXJnczogYnl0ZXMpOiBib29sZWFuIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjEwOAogICAgLy8gYXNzZXJ0KGFyZ3MubGVuZ3RoID09PSBVaW50NjRCeXRlTGVuZ3RoLCBFUlJfSU5WQUxJRF9BUkdfQ09VTlQpCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjEwOQogICAgLy8gY29uc3QgeyB1c2VyLCBvcCwgdmFsdWUgfSA9IGNsb25lKHRoaXMucmVnaXN0cnkocmVnaXN0cnlJRCkudmFsdWUpCiAgICBzd2FwCiAgICBpdG9iCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIGRpZyAxCiAgICBleHRyYWN0IDMyIDEKICAgIGNvdmVyIDQKICAgIHN3YXAKICAgIHB1c2hpbnQgMzMgLy8gMzMKICAgIGV4dHJhY3RfdWludDY0CiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjExMgogICAgLy8gYnRvaShhcmdzKSwKICAgIHN3YXAKICAgIGJ0b2kKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo1Ni01OQogICAgLy8gY29uc3QgaXNGb2xsb3dlciA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmlzRm9sbG93ZXI+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ncmFwaCwKICAgIC8vICAgYXJnczogW3VzZXIsIGluZGV4LCBmb2xsb3dlcl0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ncmFwaCwKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzIgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NTcKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuZ3JhcGgsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgcHVzaGJ5dGVzICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjU3CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmdyYXBoLAogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjU4CiAgICAvLyBhcmdzOiBbdXNlciwgaW5kZXgsIGZvbGxvd2VyXSwKICAgIHN3YXAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NTYtNTkKICAgIC8vIGNvbnN0IGlzRm9sbG93ZXIgPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEdyYXBoLnByb3RvdHlwZS5pc0ZvbGxvd2VyPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFt1c2VyLCBpbmRleCwgZm9sbG93ZXJdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDcwZTVjNDhiIC8vIG1ldGhvZCAiaXNGb2xsb3dlcihhZGRyZXNzLHVpbnQ2NCxhZGRyZXNzKWJvb2wiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMCAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18xIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo2MQogICAgLy8gaWYgKCFpc0ZvbGxvd2VyKSB7CiAgICBibnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjYyCiAgICAvLyByZXR1cm4gZmFsc2UKICAgIGludGNfMSAvLyAwCgpjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VySW5kZXhHYXRlLmZvbGxvd2VySW5kZXhHYXRlQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMDcKICAgIC8vIGNoZWNrKGNhbGxlcjogQWNjb3VudCwgcmVnaXN0cnlJRDogdWludDY0LCBhcmdzOiBieXRlcyk6IGJvb2xlYW4gewogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMSAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo2NgogICAgLy8gY2FzZSBFcXVhbDogcmV0dXJuIGluZGV4ID09PSB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA1CiAgICBkdXAKICAgIGRpZyAyCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTAtMTE2CiAgICAvLyByZXR1cm4gdGhpcy5mb2xsb3dlckluZGV4R2F0ZSgKICAgIC8vICAgdXNlciwKICAgIC8vICAgYnRvaShhcmdzKSwKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgdmFsdWUKICAgIC8vICkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5mb2xsb3dlckluZGV4R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo2NwogICAgLy8gY2FzZSBOb3RFcXVhbDogcmV0dXJuIGluZGV4ICE9PSB2YWx1ZQogICAgZGlnIDIKICAgIHB1c2hieXRlcyAweDE0CiAgICA9PQogICAgYnogY2hlY2tfYWZ0ZXJfaWZfZWxzZUA3CiAgICBkdXAKICAgIGRpZyAyCiAgICAhPQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTAtMTE2CiAgICAvLyByZXR1cm4gdGhpcy5mb2xsb3dlckluZGV4R2F0ZSgKICAgIC8vICAgdXNlciwKICAgIC8vICAgYnRvaShhcmdzKSwKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgdmFsdWUKICAgIC8vICkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5mb2xsb3dlckluZGV4R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gY2FzZSBMZXNzVGhhbjogcmV0dXJuIGluZGV4IDwgdmFsdWUKICAgIGRpZyAyCiAgICBwdXNoYnl0ZXMgMHgxZQogICAgPT0KICAgIGJ6IGNoZWNrX2FmdGVyX2lmX2Vsc2VAOQogICAgZHVwCiAgICBkaWcgMgogICAgPAogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTAtMTE2CiAgICAvLyByZXR1cm4gdGhpcy5mb2xsb3dlckluZGV4R2F0ZSgKICAgIC8vICAgdXNlciwKICAgIC8vICAgYnRvaShhcmdzKSwKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgdmFsdWUKICAgIC8vICkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5mb2xsb3dlckluZGV4R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo2OQogICAgLy8gY2FzZSBMZXNzVGhhbk9yRXF1YWxUbzogcmV0dXJuIGluZGV4IDw9IHZhbHVlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4MjgKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDExCiAgICBkdXAKICAgIGRpZyAyCiAgICA8PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTAtMTE2CiAgICAvLyByZXR1cm4gdGhpcy5mb2xsb3dlckluZGV4R2F0ZSgKICAgIC8vICAgdXNlciwKICAgIC8vICAgYnRvaShhcmdzKSwKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgdmFsdWUKICAgIC8vICkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5mb2xsb3dlckluZGV4R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NzAKICAgIC8vIGNhc2UgR3JlYXRlclRoYW46IHJldHVybiBpbmRleCA+IHZhbHVlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4MzIKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDEzCiAgICBkdXAKICAgIGRpZyAyCiAgICA+CiAgICAvLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjExMC0xMTYKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd2VySW5kZXhHYXRlKAogICAgLy8gICB1c2VyLAogICAgLy8gICBidG9pKGFyZ3MpLAogICAgLy8gICBjYWxsZXIsCiAgICAvLyAgIG9wLAogICAgLy8gICB2YWx1ZQogICAgLy8gKQogICAgYiBjaGVja19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6OlNvY2lhbEZvbGxvd2VySW5kZXhHYXRlLmZvbGxvd2VySW5kZXhHYXRlQDE2CgpjaGVja19hZnRlcl9pZl9lbHNlQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo3MQogICAgLy8gY2FzZSBHcmVhdGVyVGhhbk9yRXF1YWxUbzogcmV0dXJuIGluZGV4ID49IHZhbHVlCiAgICBkaWcgMgogICAgcHVzaGJ5dGVzIDB4M2MKICAgID09CiAgICBieiBjaGVja19hZnRlcl9pZl9lbHNlQDE1CiAgICBkdXAKICAgIGRpZyAyCiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTAtMTE2CiAgICAvLyByZXR1cm4gdGhpcy5mb2xsb3dlckluZGV4R2F0ZSgKICAgIC8vICAgdXNlciwKICAgIC8vICAgYnRvaShhcmdzKSwKICAgIC8vICAgY2FsbGVyLAogICAgLy8gICBvcCwKICAgIC8vICAgdmFsdWUKICAgIC8vICkKICAgIGIgY2hlY2tfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5mb2xsb3dlckluZGV4R2F0ZUAxNgoKY2hlY2tfYWZ0ZXJfaWZfZWxzZUAxNToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6NzIKICAgIC8vIGRlZmF1bHQ6IHJldHVybiBmYWxzZQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MTEwLTExNgogICAgLy8gcmV0dXJuIHRoaXMuZm9sbG93ZXJJbmRleEdhdGUoCiAgICAvLyAgIHVzZXIsCiAgICAvLyAgIGJ0b2koYXJncyksCiAgICAvLyAgIGNhbGxlciwKICAgIC8vICAgb3AsCiAgICAvLyAgIHZhbHVlCiAgICAvLyApCiAgICBiIGNoZWNrX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czo6U29jaWFsRm9sbG93ZXJJbmRleEdhdGUuZm9sbG93ZXJJbmRleEdhdGVAMTYKCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5nZXRSZWdpc3RyYXRpb25TaGFwZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldFJlZ2lzdHJhdGlvblNoYXBlOgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMTkKICAgIC8vIGdldFJlZ2lzdHJhdGlvblNoYXBlKHNoYXBlOiBTb2NpYWxGb2xsb3dlckluZGV4R2F0ZVJlZ2lzdHJ5SW5mbyk6IFNvY2lhbEZvbGxvd2VySW5kZXhHYXRlUmVnaXN0cnlJbmZvIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDQxIC8vIDQxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDhbMzJdLHVpbnQ4LHVpbnQ2NCkKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvZ2F0ZXMvc3ViLWdhdGVzL3NvY2lhbC1mb2xsb3dlci1pbmRleC9jb250cmFjdC5hbGdvLnRzOjpTb2NpYWxGb2xsb3dlckluZGV4R2F0ZS5nZXRFbnRyeVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldEVudHJ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2dhdGVzL3N1Yi1nYXRlcy9zb2NpYWwtZm9sbG93ZXItaW5kZXgvY29udHJhY3QuYWxnby50czoxMjMKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MTI1CiAgICAvLyByZXR1cm4gZW5jb2RlQXJjNCh0aGlzLnJlZ2lzdHJ5KHJlZ2lzdHJ5SUQpLnZhbHVlKQogICAgaXRvYgogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9nYXRlcy9zdWItZ2F0ZXMvc29jaWFsLWZvbGxvd2VyLWluZGV4L2NvbnRyYWN0LmFsZ28udHM6MTIzCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUNvbnRyYWN0LnVwZGF0ZUFraXRhREFPW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU86CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18yIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgcHVzaGJ5dGVzICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDAKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURBTwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAQAIAiYDBBUffHUPcmVnaXN0cnlfY3Vyc29yCWFraXRhX2RhbzEYQABGKSJnggIScmVnaXN0cmF0aW9uX3NoYXBlFihhZGRyZXNzLHVpbnQ4LHVpbnQ2NClnggILY2hlY2tfc2hhcGUGdWludDY0ZzEZFEQxGEEAO4IHBDKfBO4Ed7t5uQRuA/UKBE3rhhUEkNT6XQQz6SyUBIVN7eA2GgCOBwA+AFsAogGWAaUBvwABACJDgATNmtZ+NhoAjgEAAQA2GgFJI1klCEsBFRJEVwIANhoCSRUkEkQXgAd2ZXJzaW9uTwJnKkxnKSJnIkM2GgFJI1klCEwVEkSADBUffHUAAAAAAABWVLAiQzEWIglJOBAiEkQ2GgFJI1klCEsBFRJEVwIASRWBKRJESwE4BzIKEk8COAiB1KwBEhBEIyllREkiCClMZxZJTwK/KExQsCJDNhoBSRWBIBJENhoCSRUkEkQXNhoDSSNZJQhLARUSRFcCAEkVJBJETBa+RElXACBLAVcgAU4ETIEhW04DTBdJTgOxIyplRIADc2FsZUgkW0wWgARw5cSLshpPArIashqyGLIagQayECOyAbO0PklXBABMVwAEKBJESRUiEkQjU0AADiOAAQAjTwJUKExQsCJDSwKAAQoSQQAHSUsCEkL/40sCgAEUEkEAB0lLAhNC/9NLAoABHhJBAAdJSwIMQv/DSwKAASgSQQAHSUsCDkL/s0sCgAEyEkEAB0lLAg1C/6NLAoABPBJBAAdJSwIPQv+TI0L/jzYaAUkVgSkSRChMULAiQzYaAUkVJBJEFxa+REkVFlcGAkxQKExQsCJDNhoBSRUkEkQXMQAjKmVEgAZ3YWxsZXRlSHIIRBJEKkxnIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a SocialFollowerIndexGateRegistryInfo to the struct representation
 */
function SocialFollowerIndexGateRegistryInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.SocialFollowerIndexGateRegistryInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the SocialFollowerIndexGate smart contract
 */
class SocialFollowerIndexGateParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64)void':
                        return SocialFollowerIndexGateParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the SocialFollowerIndexGate smart contract using the create(string,uint64)void ABI method
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
     * Constructs a no op call for the getRegistrationShape((address,uint8,uint64))(address,uint8,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static getRegistrationShape(params) {
        return {
            ...params,
            method: 'getRegistrationShape((address,uint8,uint64))(address,uint8,uint64)',
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
exports.SocialFollowerIndexGateParamsFactory = SocialFollowerIndexGateParamsFactory;
/**
 * A factory to create and deploy one or more instance of the SocialFollowerIndexGate smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class SocialFollowerIndexGateFactory {
    /**
     * Creates a new instance of `SocialFollowerIndexGateFactory`
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
                 * Creates a new instance of the SocialFollowerIndexGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(SocialFollowerIndexGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialFollowerIndexGate smart contract using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(SocialFollowerIndexGateParamsFactory.create.create(params));
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
                 * Creates a new instance of the SocialFollowerIndexGate smart contract using an ABI method call using the create(string,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(SocialFollowerIndexGateParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new SocialFollowerIndexGateClient(result.appClient) };
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
        return new SocialFollowerIndexGateClient(this.appFactory.getAppClientById(params));
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
        return new SocialFollowerIndexGateClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the SocialFollowerIndexGate smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? SocialFollowerIndexGateParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new SocialFollowerIndexGateClient(result.appClient) };
    }
}
exports.SocialFollowerIndexGateFactory = SocialFollowerIndexGateFactory;
/**
 * A client to make calls to the SocialFollowerIndexGate smart contract
 */
class SocialFollowerIndexGateClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerIndexGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cost: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            register: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            check: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getRegistrationShape((address,uint8,uint64))(address,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getRegistrationShape: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            getEntry: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(SocialFollowerIndexGateParamsFactory.opUp(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerIndexGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cost: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.cost(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            register: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.register(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            check: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.check(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getRegistrationShape((address,uint8,uint64))(address,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getRegistrationShape: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.getRegistrationShape(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            getEntry: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.getEntry(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(SocialFollowerIndexGateParamsFactory.opUp(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the SocialFollowerIndexGate smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `cost(byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cost: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.cost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `register(pay,byte[])uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            register: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.register(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `check(address,uint64,byte[])bool` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            check: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.check(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getRegistrationShape((address,uint8,uint64))(address,uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getRegistrationShape: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.getRegistrationShape(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `getEntry(uint64)byte[]` ABI method.
             *
             * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            getEntry: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.getEntry(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the SocialFollowerIndexGate smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current SocialFollowerIndexGate app
         */
        this.state = {
            /**
             * Methods to access global state for the current SocialFollowerIndexGate app
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
             * Methods to access box state for the current SocialFollowerIndexGate app
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
     * Returns a new `SocialFollowerIndexGateClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new SocialFollowerIndexGateClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `SocialFollowerIndexGateClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new SocialFollowerIndexGateClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new SocialFollowerIndexGateClient(this.appClient.clone(params));
    }
    /**
     * Makes a readonly (simulated) call to the SocialFollowerIndexGate smart contract using the `getEntry(uint64)byte[]` ABI method.
     *
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    async getEntry(params) {
        const result = await this.appClient.send.call(SocialFollowerIndexGateParamsFactory.getEntry(params));
        return result.return;
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a cost(byte[])uint64 method call against the SocialFollowerIndexGate contract
             */
            cost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cost(params)));
                resultMappers.push((v) => client.decodeReturnValue('cost(byte[])uint64', v));
                return this;
            },
            /**
             * Add a register(pay,byte[])uint64 method call against the SocialFollowerIndexGate contract
             */
            register(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.register(params)));
                resultMappers.push((v) => client.decodeReturnValue('register(pay,byte[])uint64', v));
                return this;
            },
            /**
             * Add a check(address,uint64,byte[])bool method call against the SocialFollowerIndexGate contract
             */
            check(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.check(params)));
                resultMappers.push((v) => client.decodeReturnValue('check(address,uint64,byte[])bool', v));
                return this;
            },
            /**
             * Add a getRegistrationShape((address,uint8,uint64))(address,uint8,uint64) method call against the SocialFollowerIndexGate contract
             */
            getRegistrationShape(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getRegistrationShape(params)));
                resultMappers.push((v) => client.decodeReturnValue('getRegistrationShape((address,uint8,uint64))(address,uint8,uint64)', v));
                return this;
            },
            /**
             * Add a getEntry(uint64)byte[] method call against the SocialFollowerIndexGate contract
             */
            getEntry(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getEntry(params)));
                resultMappers.push((v) => client.decodeReturnValue('getEntry(uint64)byte[]', v));
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the SocialFollowerIndexGate contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the SocialFollowerIndexGate contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a clear state call to the SocialFollowerIndexGate contract
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
exports.SocialFollowerIndexGateClient = SocialFollowerIndexGateClient;
//# sourceMappingURL=SocialFollowerIndexGateClient.js.map