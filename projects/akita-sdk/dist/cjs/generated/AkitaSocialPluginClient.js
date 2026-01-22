"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AkitaSocialPluginClient = exports.AkitaSocialPluginFactory = exports.AkitaSocialPluginParamsFactory = exports.APP_SPEC = void 0;
exports.AkitaSocialMbrDataFromTuple = AkitaSocialMbrDataFromTuple;
exports.ViewPayWallValueFromTuple = ViewPayWallValueFromTuple;
exports.TipMbrInfoFromTuple = TipMbrInfoFromTuple;
const app_arc56_1 = require("@algorandfoundation/algokit-utils/types/app-arc56");
const app_client_1 = require("@algorandfoundation/algokit-utils/types/app-client");
const app_factory_1 = require("@algorandfoundation/algokit-utils/types/app-factory");
exports.APP_SPEC = { "name": "AkitaSocialPlugin", "structs": { "AkitaSocialMBRData": [{ "name": "follows", "type": "uint64" }, { "name": "blocks", "type": "uint64" }, { "name": "posts", "type": "uint64" }, { "name": "votes", "type": "uint64" }, { "name": "votelist", "type": "uint64" }, { "name": "reactions", "type": "uint64" }, { "name": "reactionlist", "type": "uint64" }, { "name": "meta", "type": "uint64" }, { "name": "moderators", "type": "uint64" }, { "name": "banned", "type": "uint64" }, { "name": "actions", "type": "uint64" }], "ViewPayWallValue": [{ "name": "userPayInfo", "type": "(uint8,uint64,uint64)[]" }, { "name": "agentPayInfo", "type": "(uint8,uint64,uint64)[]" }], "tipMBRInfo": [{ "name": "type", "type": "uint8" }, { "name": "arc58", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }, { "type": "uint64", "name": "escrow" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "post", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "uint64", "name": "gateID" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editPost", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedReply", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "gateID" }, { "type": "byte[][]", "name": "args" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "reply", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "gateID" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedEditReply", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editReply", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "vote", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "bool", "name": "isUp" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editVote", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[32]", "name": "ref" }, { "type": "bool", "name": "flip" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedReact", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "NFT" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "react", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "deleteReaction", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[32]", "name": "ref" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedFollow", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "follow", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unfollow", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "block", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unblock", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addModerator", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "removeModerator", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "ban", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }, { "type": "uint64", "name": "expiration" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "flagPost", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[32]", "name": "ref" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unflagPost", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "byte[32]", "name": "ref" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unban", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addAction", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "actionAppID" }, { "type": "byte[36]", "name": "content" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "removeAction", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "actionAppID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "initMeta", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "address", "name": "user" }, { "type": "bool", "name": "automated" }, { "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "NFD" }, { "type": "uint64", "name": "akitaNFT" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateMeta", "args": [{ "type": "uint64", "name": "wallet" }, { "type": "bool", "name": "rekeyBack" }, { "type": "uint64", "name": "followGateID" }, { "type": "uint64", "name": "addressGateID" }, { "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "NFD" }, { "type": "uint64", "name": "akitaNFT" }, { "type": "uint64", "name": "defaultPayWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "mbr", "args": [{ "type": "byte[]", "name": "ref" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)", "struct": "AkitaSocialMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "payWallMbr", "args": [{ "type": "((uint8,uint64,uint64)[],(uint8,uint64,uint64)[])", "struct": "ViewPayWallValue", "name": "paywall" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "checkTipMbrRequirements", "args": [{ "type": "uint64", "name": "akitaDAO" }, { "type": "address", "name": "creator" }, { "type": "uint64", "name": "wallet" }], "returns": { "type": "(uint8,uint64)", "struct": "tipMBRInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [1105, 1523, 1850, 1929, 2246, 2325, 2619, 2889, 2989, 3277, 3642, 4034, 5396, 5865], "errorMessage": "Bytes has valid prefix" }, { "pc": [1068, 1486, 1892, 2288, 2579, 3238, 3603], "errorMessage": "Length must be 32" }, { "pc": [94], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [5574], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [391, 416, 579, 602, 778, 801, 1156, 1179, 1571, 1594, 1980, 2003, 2373, 2396, 2671, 2694, 2907, 2925, 3359, 3382, 3721, 3744, 4047, 4178, 4359, 4541, 4733, 5087, 5306, 5572], "errorMessage": "application exists" }, { "pc": [546, 583, 741, 782, 1017, 1128, 1160, 1445, 1543, 1575, 1772, 1952, 1984, 2178, 2345, 2377, 2552, 2639, 2675, 2840, 2934, 3009, 3212, 3327, 3363, 3587, 3689, 3725, 3883, 3975, 4169, 4273, 4350, 4454, 4531, 4637, 4723, 4833, 4912, 4991, 5077, 5186, 5296, 5484, 5559], "errorMessage": "check GlobalState exists" }, { "pc": [4039], "errorMessage": "invalid number of bytes for (bool1,uint64,uint64,uint64,uint64,uint64,uint64,bool1,uint64,uint64,uint64)" }, { "pc": [948, 1390, 2516, 3162, 3551, 5593], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [431], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [2895], "errorMessage": "invalid number of bytes for (uint64,bool1)" }, { "pc": [484, 528, 711, 895, 986, 1337, 1423, 1717, 2137, 2496, 2541, 2800, 2826, 3142, 3531, 3854, 3944, 4149, 4252, 4330, 4433, 4511, 4616, 4695, 4812, 4891, 4970, 5049, 5166, 5244, 5263, 5424, 5870], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [442, 450, 475, 494, 520, 536, 702, 885, 908, 971, 996, 1327, 1350, 1413, 1433, 1707, 2127, 2486, 2790, 3132, 3186, 3521, 3575, 3845, 3873, 3935, 4140, 4243, 4321, 4424, 4502, 4607, 4686, 4714, 4803, 4882, 4961, 5040, 5059, 5157, 5176, 5235, 5271, 5279, 5287, 5401, 5415, 5434, 5442, 5450, 5458, 5466, 5474, 5552, 5660, 5678], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [961, 1403, 2530, 3175, 3564], "errorMessage": "invalid number of bytes for uint8" }, { "pc": [503, 919, 1361], "errorMessage": "invalid number of bytes for uint8[24]" }, { "pc": [731, 1744, 2164, 2815, 3865, 3955, 4160, 4263, 4341, 4444, 4522, 4627, 4706, 4823, 4902, 4981, 5255, 5670], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [512, 722, 931, 1373, 1732, 2152, 5068], "errorMessage": "invalid number of bytes for uint8[36]" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggNgogICAgYnl0ZWNibG9jayAiYWtpdGFfZGFvIiAic2FsIiAic3BlbmRpbmdfYWRkcmVzcyIgMHgxNTFmN2M3NSAiYWtpdGFfYXNzZXRzIiAic29jaWFsX2ZlZXMiIDB4MTQgMHgzNTc1MmNmMCAiYWFsIiAweDQzOTIyNjU1IDB4OTg0YmFlZjUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE5CiAgICAvLyBleHBvcnQgY2xhc3MgQWtpdGFTb2NpYWxQbHVnaW4gZXh0ZW5kcyBjbGFzc2VzKEJhc2VTb2NpYWwsIEFraXRhQmFzZUNvbnRyYWN0KSB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMzcKICAgIHB1c2hieXRlc3MgMHgxNjU5YzFhNyAweDRhN2ViNTRkIDB4Y2FmOGU3MTMgMHhjMTk4NDU5ZCAweDViNDVlMzZiIDB4NjZiNzI5NjIgMHg3NWFlNDBhNCAweGVjNWJjZWIxIDB4MzVjNmUzOTYgMHg1ZmFhM2E4MyAweDdmZDRjYWI3IDB4M2ZkODVmNGQgMHhiNDY1NDlmYSAweDljMzBhY2VkIDB4YmVjODZjMzQgMHg5ZjU5YTk3MCAweGFhNzY1NjAxIDB4OTA5MWRjYTUgMHg0OTNlOTA4ZiAweDBkOGI2NzcxIDB4MWIyZDA4ZTIgMHg2OGU4ZGI3OCAweDI1NDk4MjI5IDB4NWNmN2UwYTUgMHhhYTI5MDQ4YiAweDc2MjNlZjMzIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAweDkyZTZkZDNiIDB4YTEzNGEyNzggMHgzNDQxNzVmMCAvLyBtZXRob2QgInBvc3QodWludDY0LGJvb2wsdWludDY0LGJ5dGVbMjRdLGJ5dGVbMzZdLHVpbnQ2NCxib29sLHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJlZGl0UG9zdCh1aW50NjQsYm9vbCxieXRlWzM2XSxieXRlWzMyXSl2b2lkIiwgbWV0aG9kICJnYXRlZFJlcGx5KHVpbnQ2NCxib29sLHVpbnQ2NCxieXRlWzI0XSxieXRlWzM2XSxieXRlW10sdWludDgsdWludDY0LGJ5dGVbXVtdLGJvb2wsdWludDY0KXZvaWQiLCBtZXRob2QgInJlcGx5KHVpbnQ2NCxib29sLHVpbnQ2NCxieXRlWzI0XSxieXRlWzM2XSxieXRlW10sdWludDgsdWludDY0LGJvb2wsdWludDY0KXZvaWQiLCBtZXRob2QgImdhdGVkRWRpdFJlcGx5KHVpbnQ2NCxib29sLGJ5dGVbMzZdLGJ5dGVbMzJdLGJ5dGVbXVtdKXZvaWQiLCBtZXRob2QgImVkaXRSZXBseSh1aW50NjQsYm9vbCxieXRlWzM2XSxieXRlWzMyXSl2b2lkIiwgbWV0aG9kICJ2b3RlKHVpbnQ2NCxib29sLGJ5dGVbXSx1aW50OCxib29sKXZvaWQiLCBtZXRob2QgImVkaXRWb3RlKHVpbnQ2NCxib29sLGJ5dGVbMzJdLGJvb2wpdm9pZCIsIG1ldGhvZCAiZ2F0ZWRSZWFjdCh1aW50NjQsYm9vbCxieXRlW10sdWludDgsdWludDY0LGJ5dGVbXVtdKXZvaWQiLCBtZXRob2QgInJlYWN0KHVpbnQ2NCxib29sLGJ5dGVbXSx1aW50OCx1aW50NjQpdm9pZCIsIG1ldGhvZCAiZGVsZXRlUmVhY3Rpb24odWludDY0LGJvb2wsYnl0ZVszMl0sdWludDY0KXZvaWQiLCBtZXRob2QgImdhdGVkRm9sbG93KHVpbnQ2NCxib29sLGFkZHJlc3MsYnl0ZVtdW10pdm9pZCIsIG1ldGhvZCAiZm9sbG93KHVpbnQ2NCxib29sLGFkZHJlc3Mpdm9pZCIsIG1ldGhvZCAidW5mb2xsb3codWludDY0LGJvb2wsYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJibG9jayh1aW50NjQsYm9vbCxhZGRyZXNzKXZvaWQiLCBtZXRob2QgInVuYmxvY2sodWludDY0LGJvb2wsYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJhZGRNb2RlcmF0b3IodWludDY0LGJvb2wsYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJyZW1vdmVNb2RlcmF0b3IodWludDY0LGJvb2wsYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJiYW4odWludDY0LGJvb2wsYWRkcmVzcyx1aW50NjQpdm9pZCIsIG1ldGhvZCAiZmxhZ1Bvc3QodWludDY0LGJvb2wsYnl0ZVszMl0pdm9pZCIsIG1ldGhvZCAidW5mbGFnUG9zdCh1aW50NjQsYm9vbCxieXRlWzMyXSl2b2lkIiwgbWV0aG9kICJ1bmJhbih1aW50NjQsYm9vbCxhZGRyZXNzKXZvaWQiLCBtZXRob2QgImFkZEFjdGlvbih1aW50NjQsYm9vbCx1aW50NjQsYnl0ZVszNl0pdm9pZCIsIG1ldGhvZCAicmVtb3ZlQWN0aW9uKHVpbnQ2NCxib29sLHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJpbml0TWV0YSh1aW50NjQsYm9vbCxhZGRyZXNzLGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQpdWludDY0IiwgbWV0aG9kICJ1cGRhdGVNZXRhKHVpbnQ2NCxib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0KXZvaWQiLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIiwgbWV0aG9kICJtYnIoYnl0ZVtdKSh1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0KSIsIG1ldGhvZCAicGF5V2FsbE1icigoKHVpbnQ4LHVpbnQ2NCx1aW50NjQpW10sKHVpbnQ4LHVpbnQ2NCx1aW50NjQpW10pKXVpbnQ2NCIsIG1ldGhvZCAiY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModWludDY0LGFkZHJlc3MsdWludDY0KSh1aW50OCx1aW50NjQpIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggcG9zdCBlZGl0UG9zdCBnYXRlZFJlcGx5IHJlcGx5IGdhdGVkRWRpdFJlcGx5IGVkaXRSZXBseSB2b3RlIGVkaXRWb3RlIGdhdGVkUmVhY3QgcmVhY3QgZGVsZXRlUmVhY3Rpb24gZ2F0ZWRGb2xsb3cgZm9sbG93IHVuZm9sbG93IGJsb2NrIHVuYmxvY2sgYWRkTW9kZXJhdG9yIHJlbW92ZU1vZGVyYXRvciBiYW4gZmxhZ1Bvc3QgdW5mbGFnUG9zdCB1bmJhbiBhZGRBY3Rpb24gcmVtb3ZlQWN0aW9uIGluaXRNZXRhIHVwZGF0ZU1ldGEgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDMyIG1iciBwYXlXYWxsTWJyIGNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBlcnIKCm1haW5fb3BVcF9yb3V0ZUAzMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQzCiAgICAvLyBvcFVwKCk6IHZvaWQgeyB9CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2NyZWF0ZV9Ob09wQDM3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTkKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbFBsdWdpbiBleHRlbmRzIGNsYXNzZXMoQmFzZVNvY2lhbCwgQWtpdGFCYXNlQ29udHJhY3QpIHsKICAgIHB1c2hieXRlcyAweDg4Yzk0MGY4IC8vIG1ldGhvZCAiY3JlYXRlKHN0cmluZyx1aW50NjQsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OmdldEFjY291bnRzKHdhbGxldDogdWludDY0KSAtPiBieXRlczoKZ2V0QWNjb3VudHM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI1MwogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIGdldEFjY291bnRzKHdhbGxldDogQXBwbGljYXRpb24pOiBBcmM1OEFjY291bnRzIHsKICAgIHByb3RvIDEgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNjEtMTY0CiAgICAvLyBjb25zdCBbY29udHJvbGxlZEFjY291bnRCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0SUQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzKQogICAgLy8gKQogICAgZnJhbWVfZGlnIC0xCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2MwogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MpCiAgICBwdXNoYnl0ZXMgImNvbnRyb2xsZWRfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTYxLTE2NAogICAgLy8gY29uc3QgW2NvbnRyb2xsZWRBY2NvdW50Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldElELAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGZyYW1lX2RpZyAtMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzIgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2OS0xNzIKICAgIC8vIGNvbnN0IFtyZWZlcnJlckJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXRJRCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVmZXJyZXIpCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTcxCiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNSZWZlcnJlcikKICAgIHB1c2hieXRlcyAicmVmZXJyZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2OS0xNzIKICAgIC8vIGNvbnN0IFtyZWZlcnJlckJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXRJRCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVmZXJyZXIpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI1OAogICAgLy8gd2FsbGV0QWRkcmVzczogd2FsbGV0LmFkZHJlc3MsCiAgICBmcmFtZV9kaWcgLTEKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjU3LTI2MgogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgd2FsbGV0QWRkcmVzczogd2FsbGV0LmFkZHJlc3MsCiAgICAvLyAgIG9yaWdpbiwKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWZlcnJlcgogICAgLy8gfQogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJla2V5QWRkcmVzcyhyZWtleUJhY2s6IHVpbnQ2NCwgd2FsbGV0OiB1aW50NjQpIC0+IGJ5dGVzOgpyZWtleUFkZHJlc3M6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMQogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIHJla2V5QWRkcmVzcyhyZWtleUJhY2s6IGJvb2xlYW4sIHdhbGxldDogQXBwbGljYXRpb24pOiBBY2NvdW50IHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMjIKICAgIC8vIGlmICghcmVrZXlCYWNrKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIGJueiByZWtleUFkZHJlc3NfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyMwogICAgLy8gcmV0dXJuIEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICByZXRzdWIKCnJla2V5QWRkcmVzc19hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyNgogICAgLy8gcmV0dXJuIHdhbGxldC5hZGRyZXNzCiAgICBmcmFtZV9kaWcgLTEKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMwogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIHB1c2hieXRlcyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI1CiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI2CiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjMKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLnBvc3Rbcm91dGluZ10oKSAtPiB2b2lkOgpwb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzEtNDAKICAgIC8vIHBvc3QoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgdXNlUGF5V2FsbDogYm9vbGVhbiwKICAgIC8vICAgcGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAyNCAvLyAyNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMjRdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzNiAvLyAzNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzZdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyBjb25zdCBha2l0YVNvY2lhbCA9IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zb2NpYWwpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MwogICAgLy8gY29uc3QgYWtpdGFTb2NpYWwgPSBBcHBsaWNhdGlvbihnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzCiAgICAvLyBjb25zdCBha2l0YVNvY2lhbCA9IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zb2NpYWwpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ0CiAgICAvLyBjb25zdCB7IHBvc3RzLCB2b3Rlcywgdm90ZWxpc3QgfSA9IHRoaXMubWJyKGNpZCkKICAgIGRpZyA1CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGR1cAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgdW5jb3ZlciAyCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDYKICAgIC8vIGNvbnN0IG1ickFtb3VudDogdWludDY0ID0gcG9zdHMgKyB2b3RlcyArIHZvdGVsaXN0CiAgICBjb3ZlciAyCiAgICArCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OQogICAgLy8gcmVjZWl2ZXI6IGFraXRhU29jaWFsLmFkZHJlc3MsCiAgICBkaWcgMQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTMKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTMKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBkdXAKICAgIGJ5dGVjIDQgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIHN3YXAKICAgIGJ5dGVjIDUgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQKICAgIC8vIGNvbnN0IHsgcG9zdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gYXNzZXRSZWNlaXZlcjogYWtpdGFTb2NpYWwuYWRkcmVzcywKICAgIGRpZyA0CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2Mi03NgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnBvc3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogYWtpdGFTb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgNQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ3LTUxCiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogYWtpdGFTb2NpYWwuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NwogICAgLy8gdGlwLAogICAgaXR4bl9uZXh0CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBkaWcgMgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1LTYwCiAgICAvLyBjb25zdCB0aXAgPSBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFzc2V0UmVjZWl2ZXI6IGFraXRhU29jaWFsLmFkZHJlc3MsCiAgICAvLyAgIHhmZXJBc3NldDogYWt0YSwKICAgIC8vICAgYXNzZXRBbW91bnQ6IHBvc3RGZWUKICAgIC8vIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2Mi03NgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnBvc3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogYWtpdGFTb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NQogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDkKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2Mi03NgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnBvc3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogYWtpdGFTb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NzEwNWJiYWQgLy8gbWV0aG9kICJwb3N0KHBheSxheGZlcix1aW50NjQsYnl0ZVsyNF0sYnl0ZVszNl0sdWludDY0LGJvb2wsdWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA4CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA3CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA1CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzEtNDAKICAgIC8vIHBvc3QoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgdXNlUGF5V2FsbDogYm9vbGVhbiwKICAgIC8vICAgcGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5lZGl0UG9zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmVkaXRQb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzktODQKICAgIC8vIGVkaXRQb3N0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPgogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzYgLy8gMzYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzM2XQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODcKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODcKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODgKICAgIC8vIGNvbnN0IHsgcG9zdHMsIHZvdGVzLCB2b3RlbGlzdCB9ID0gdGhpcy5tYnIoY2lkKQogICAgZGlnIDMKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgZHVwCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDEKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICB1bmNvdmVyIDIKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4OQogICAgLy8gY29uc3QgbWJyQW1vdW50OiB1aW50NjQgPSBwb3N0cyArIHZvdGVzICsgdm90ZWxpc3QgKyBBbWVuZG1lbnRNQlIKICAgIGNvdmVyIDIKICAgICsKICAgICsKICAgIHB1c2hpbnQgMTMyMDAgLy8gMTMyMDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkyCiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDEKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk2CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk2CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NgogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBzd2FwCiAgICBieXRlYyA1IC8vICJzb2NpYWxfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3CiAgICAvLyBjb25zdCB7IHBvc3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAwCiAgICAvLyBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgNAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA2LTExNgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmVkaXRQb3N0Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIGNpZCwKICAgIC8vICAgICBhbWVuZG1lbnQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIHVuY292ZXIgNAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDUKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MC05NAogICAgLy8gY29uc3QgbWJyUGF5bWVudCA9IGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTEKICAgIC8vIHRpcCwKICAgIGl0eG5fbmV4dAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgZGlnIDIKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5OC0xMDMKICAgIC8vIGNvbnN0IHRpcCA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgIGFzc2V0QW1vdW50OiBwb3N0RmVlCiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA2LTExNgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmVkaXRQb3N0Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIGNpZCwKICAgIC8vICAgICBhbWVuZG1lbnQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE1CiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDQKICAgIHVuY292ZXIgNQogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNi0xMTYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5lZGl0UG9zdD4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgYW1lbmRtZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhiYTRiZjc5NCAvLyBtZXRob2QgImVkaXRQb3N0KHBheSxheGZlcixieXRlWzM2XSxieXRlWzMyXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc5LTg0CiAgICAvLyBlZGl0UG9zdCgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgYW1lbmRtZW50OiBieXRlczwzMj4KICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5nYXRlZFJlcGx5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2F0ZWRSZXBseToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExOS0xMzEKICAgIC8vIGdhdGVkUmVwbHkoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgcHVzaGludCAyNCAvLyAyNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMjRdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDYKICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDkKICAgIGNvdmVyIDMKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEwCiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMgogICAgLy8gY29uc3QgeyBvcmlnaW4sIHNlbmRlciB9ID0gZ2V0QWNjb3VudHMod2FsbGV0KQogICAgdW5jb3ZlciAyCiAgICBjYWxsc3ViIGdldEFjY291bnRzCiAgICBkdXAKICAgIGV4dHJhY3QgMzIgMzIKICAgIGNvdmVyIDMKICAgIGV4dHJhY3QgNjQgMzIKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM0CiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM0CiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIGR1cAogICAgYnl0ZWMgOCAvLyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM0CiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgcHVzaGludCA0MCAvLyA0MAogICAgZXh0cmFjdF91aW50NjQKICAgIGNvdmVyIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNQogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNgogICAgLy8gY29uc3QgeyBwb3N0cywgdm90ZXMsIHZvdGVsaXN0IH0gPSB0aGlzLm1icihjaWQpCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgZHVwCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDEKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICB1bmNvdmVyIDIKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzcKICAgIC8vIGxldCBtYnJBbW91bnQ6IHVpbnQ2NCA9IHBvc3RzICsgdm90ZXMgKyB2b3RlbGlzdAogICAgY292ZXIgMgogICAgKwogICAgKwogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM5LTE0MwogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRQb3N0TWV0YT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtyZWYudG9GaXhlZCh7IGxlbmd0aDogMzIgfSksIDBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQyCiAgICAvLyBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCAwXQogICAgZGlnIDIKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAzMgogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzOS0xNDMKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCAwXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGJ5dGVjIDcgLy8gbWV0aG9kICJnZXRQb3N0TWV0YShieXRlWzMyXSx1aW50NjQpKChhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50OCxieXRlW10pLChib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCksYm9vbCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NQogICAgLy8gY29uc3QgY3JlYXRvciA9IGluZm8ucG9zdC5jcmVhdG9yCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBjb3ZlciAzCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NgogICAgLy8gY29uc3QgY3JlYXRvcldhbGxldCA9IGluZm8ubWV0YS53YWxsZXQKICAgIHN3YXAKICAgIGV4dHJhY3QgNiA2NgogICAgaW50Y18xIC8vIDEKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDcKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ3CiAgICAvLyBjb25zdCB0aXBJbmZvID0gdGhpcy5jaGVja1RpcE1iclJlcXVpcmVtZW50cyh0aGlzLmFraXRhREFPLnZhbHVlLCBjcmVhdG9yLCBBcHBsaWNhdGlvbihjcmVhdG9yV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBjb3ZlciAyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50cwogICAgZHVwCiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTAKICAgIC8vIGlmICh0aXBJbmZvLnR5cGUgPT09IFRpcFNlbmRUeXBlQVJDNTgpIHsKICAgIGV4dHJhY3QgMCAxCiAgICBieXRlYyA2IC8vIDB4MTQKICAgID09CiAgICBieiBnYXRlZFJlcGx5X2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUxCiAgICAvLyBtYnJBbW91bnQgKz0gdGlwSW5mby5hcmM1OAogICAgZGlnIDEKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgKwoKZ2F0ZWRSZXBseV9hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTYKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMwogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjAKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjAKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY5CiAgICAvLyBjb25zdCBbc29jaWFsRmVlc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1NvY2lhbEZlZXMpKQogICAgc3dhcAogICAgYnl0ZWMgNSAvLyAic29jaWFsX2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjEKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY0CiAgICAvLyBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTc3CiAgICAvLyBpbmZvLnBvc3QuZ2F0ZUlELAogICAgZGlnIDcKICAgIGV4dHJhY3QgNDAgOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTgyLTE5OQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdhdGVkUmVwbHk+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgZ2F0ZVR4biwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgdW5jb3ZlciA2CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgOQogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU0LTE1OAogICAgLy8gY29uc3QgbWJyUGF5bWVudCA9IGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxODcKICAgIC8vIHRpcCwKICAgIGl0eG5fbmV4dAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYyLTE2NwogICAgLy8gY29uc3QgdGlwID0gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgIHhmZXJBc3NldDogYWt0YSwKICAgIC8vICAgYXNzZXRBbW91bnQ6IHJlYWN0RmVlCiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTg4CiAgICAvLyBnYXRlVHhuLAogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNzUKICAgIC8vIG1ldGhvZFNlbGVjdG9yKEdhdGVNdXN0Q2hlY2tBYmlNZXRob2QpLAogICAgYnl0ZWMgOSAvLyBtZXRob2QgIm11c3RDaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW11bXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA4CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA1CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE3MS0xODAKICAgIC8vIGNvbnN0IGdhdGVUeG4gPSBpdHhuLmFwcGxpY2F0aW9uQ2FsbCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IGdhdGUsCiAgICAvLyAgIGFwcEFyZ3M6IFsKICAgIC8vICAgICBtZXRob2RTZWxlY3RvcihHYXRlTXVzdENoZWNrQWJpTWV0aG9kKSwKICAgIC8vICAgICBvcmlnaW4sCiAgICAvLyAgICAgaW5mby5wb3N0LmdhdGVJRCwKICAgIC8vICAgICBlbmNvZGVBcmM0KGFyZ3MpCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpbnRjXzMgLy8gNgogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxODItMTk5CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2F0ZWRSZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBnYXRlVHhuLAogICAgLy8gICAgIHRpbWVzdGFtcCwKICAgIC8vICAgICBub25jZSwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgZ2F0ZUlELAogICAgLy8gICAgIHVzZVBheVdhbGwsCiAgICAvLyAgICAgcGF5V2FsbElECiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE5OAogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgZGlnIDE3CiAgICBkaWcgMTkKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxODItMTk5CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2F0ZWRSZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBnYXRlVHhuLAogICAgLy8gICAgIHRpbWVzdGFtcCwKICAgIC8vICAgICBub25jZSwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgZ2F0ZUlELAogICAgLy8gICAgIHVzZVBheVdhbGwsCiAgICAvLyAgICAgcGF5V2FsbElECiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhkNWM4ZTdiOCAvLyBtZXRob2QgImdhdGVkUmVwbHkocGF5LGF4ZmVyLGFwcGwsdWludDY0LGJ5dGVbMjRdLGJ5dGVbMzZdLGJ5dGVbXSx1aW50OCx1aW50NjQsYm9vbCx1aW50NjQpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTcKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTYKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTUKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTQKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExOS0xMzEKICAgIC8vIGdhdGVkUmVwbHkoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4ucmVwbHlbcm91dGluZ10oKSAtPiB2b2lkOgpyZXBseToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwMi0yMTMKICAgIC8vIHJlcGx5KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBub25jZTogYnl0ZXM8MjQ+LAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgZ2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgcHVzaGludCAyNCAvLyAyNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMjRdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDYKICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDkKICAgIGR1cAogICAgY292ZXIgNAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEwCiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjE2CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMTYKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMTYKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBjb3ZlciA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMTcKICAgIC8vIGNvbnN0IHsgcG9zdHMsIHZvdGVzLCB2b3RlbGlzdCB9ID0gdGhpcy5tYnIoY2lkKQogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGR1cAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgdW5jb3ZlciAyCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjE4CiAgICAvLyBsZXQgbWJyQW1vdW50OiB1aW50NjQgPSBwb3N0cyArIHZvdGVzICsgdm90ZWxpc3QKICAgIGNvdmVyIDIKICAgICsKICAgICsKICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyMC0yMjQKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCAwXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyMwogICAgLy8gYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgMF0KICAgIGRpZyAyCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gTGVuZ3RoIG11c3QgYmUgMzIKICAgIGludGNfMCAvLyAwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMjAtMjI0CiAgICAvLyBjb25zdCBpbmZvID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgMF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBieXRlYyA3IC8vIG1ldGhvZCAiZ2V0UG9zdE1ldGEoYnl0ZVszMl0sdWludDY0KSgoYWRkcmVzcyx1aW50NjQsdWludDY0LGJvb2wsdWludDgsYnl0ZVtdKSwoYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ2NCx1aW50NjQpLGJvb2wpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMjYKICAgIC8vIGNvbnN0IGNyZWF0b3IgPSBpbmZvLnBvc3QuY3JlYXRvcgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjI3CiAgICAvLyBjb25zdCBjcmVhdG9yV2FsbGV0ID0gaW5mby5tZXRhLndhbGxldAogICAgc3dhcAogICAgZXh0cmFjdCA2IDY2CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyOAogICAgLy8gY29uc3QgdGlwSW5mbyA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24oY3JlYXRvcldhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMjgKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGNvdmVyIDIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIzMAogICAgLy8gaWYgKHRpcEluZm8udHlwZSA9PT0gVGlwU2VuZFR5cGVBUkM1OCkgewogICAgZXh0cmFjdCAwIDEKICAgIGJ5dGVjIDYgLy8gMHgxNAogICAgPT0KICAgIGJ6IHJlcGx5X2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjMxCiAgICAvLyBtYnJBbW91bnQgKz0gdGlwSW5mby5hcmM1OAogICAgZGlnIDEKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgKwoKcmVwbHlfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjM2CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDIKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQwCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0MAogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGR1cAogICAgYnl0ZWMgNCAvLyAiYWtpdGFfYXNzZXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQwCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIHN3YXAKICAgIGJ5dGVjIDUgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQxCiAgICAvLyBjb25zdCB7IHJlYWN0RmVlIH0gPSBnZXRTb2NpYWxGZWVzKHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0NAogICAgLy8gYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0OS0yNjUKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5yZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgdW5jb3ZlciA1CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgNgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjM0LTIzOAogICAgLy8gY29uc3QgbWJyUGF5bWVudCA9IGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNTQKICAgIC8vIHRpcCwKICAgIGl0eG5fbmV4dAogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0Mi0yNDcKICAgIC8vIGNvbnN0IHRpcCA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgIGFzc2V0QW1vdW50OiByZWFjdEZlZQogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0OS0yNjUKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5yZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICB0aW1lc3RhbXAsCiAgICAvLyAgICAgbm9uY2UsCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIGdhdGVJRCwKICAgIC8vICAgICB1c2VQYXlXYWxsLAogICAgLy8gICAgIHBheVdhbGxJRAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNjQKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIGRpZyAxMwogICAgZGlnIDE1CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQ5LTI2NQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnJlcGx5Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIHRpbWVzdGFtcCwKICAgIC8vICAgICBub25jZSwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgZ2F0ZUlELAogICAgLy8gICAgIHVzZVBheVdhbGwsCiAgICAvLyAgICAgcGF5V2FsbElECiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHgyZmZjMzEyMyAvLyBtZXRob2QgInJlcGx5KHBheSxheGZlcix1aW50NjQsYnl0ZVsyNF0sYnl0ZVszNl0sYnl0ZVtdLHVpbnQ4LHVpbnQ2NCxib29sLHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA5CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjAyLTIxMwogICAgLy8gcmVwbHkoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgdXNlUGF5V2FsbDogYm9vbGVhbiwKICAgIC8vICAgcGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5nYXRlZEVkaXRSZXBseVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdhdGVkRWRpdFJlcGx5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjY4LTI3NAogICAgLy8gZ2F0ZWRFZGl0UmVwbHkoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIGFtZW5kbWVudDogYnl0ZXM8MzI+LAogICAgLy8gICBhcmdzOiBHYXRlQXJncwogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjc1CiAgICAvLyBjb25zdCB7IG9yaWdpbiwgc2VuZGVyIH0gPSBnZXRBY2NvdW50cyh3YWxsZXQpCiAgICB1bmNvdmVyIDIKICAgIGNhbGxzdWIgZ2V0QWNjb3VudHMKICAgIGR1cAogICAgZXh0cmFjdCAzMiAzMgogICAgY292ZXIgMwogICAgZXh0cmFjdCA2NCAzMgogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MAogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFwcExpc3QpKQogICAgZHVwCiAgICBieXRlYyA4IC8vICJhYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgNAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjc4CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjc5CiAgICAvLyBjb25zdCB7IHBvc3RzLCB2b3Rlcywgdm90ZWxpc3QgfSA9IHRoaXMubWJyKGNpZCkKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBkdXAKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMQogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIHVuY292ZXIgMgogICAgcHVzaGludCAzMiAvLyAzMgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI4MAogICAgLy8gbGV0IG1ickFtb3VudDogdWludDY0ID0gcG9zdHMgKyB2b3RlcyArIHZvdGVsaXN0CiAgICBjb3ZlciAyCiAgICArCiAgICArCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyODItMjg2CiAgICAvLyBjb25zdCBwb3N0QmVpbmdBbWVuZGVkID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbYW1lbmRtZW50XQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIGJ5dGVjIDEwIC8vIG1ldGhvZCAiZ2V0UG9zdChieXRlWzMyXSkoYWRkcmVzcyx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LGJvb2wsdWludDgsYnl0ZVtdKSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyODgKICAgIC8vIGNvbnN0IG9yaWdpbmFsUG9zdFJlZiA9IHBvc3RCZWluZ0FtZW5kZWQucmVmLnNsaWNlKDAsIDMyKS50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KQogICAgZHVwCiAgICBwdXNoaW50IDU5IC8vIDU5CiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgc3Vic3RyaW5nMwogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBkaWcgMgogICAgPj0KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHN1YnN0cmluZzMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTAtMjk0CiAgICAvLyBjb25zdCBpbmZvID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW29yaWdpbmFsUG9zdFJlZiwgMF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTMKICAgIC8vIGFyZ3M6IFtvcmlnaW5hbFBvc3RSZWYsIDBdCiAgICBpbnRjXzAgLy8gMAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjkwLTI5NAogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRQb3N0TWV0YT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtvcmlnaW5hbFBvc3RSZWYsIDBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgYnl0ZWMgNyAvLyBtZXRob2QgImdldFBvc3RNZXRhKGJ5dGVbMzJdLHVpbnQ2NCkoKGFkZHJlc3MsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ4LGJ5dGVbXSksKGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50NjQsdWludDY0KSxib29sKSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5NgogICAgLy8gY29uc3QgY3JlYXRvciA9IGluZm8ucG9zdC5jcmVhdG9yCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBjb3ZlciAzCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5NwogICAgLy8gY29uc3QgY3JlYXRvcldhbGxldCA9IGluZm8ubWV0YS53YWxsZXQKICAgIHN3YXAKICAgIGV4dHJhY3QgNiA2NgogICAgaW50Y18xIC8vIDEKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTkKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjk5CiAgICAvLyBjb25zdCB0aXBJbmZvID0gdGhpcy5jaGVja1RpcE1iclJlcXVpcmVtZW50cyh0aGlzLmFraXRhREFPLnZhbHVlLCBjcmVhdG9yLCBBcHBsaWNhdGlvbihjcmVhdG9yV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBjb3ZlciAyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50cwogICAgZHVwCiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDEKICAgIC8vIGlmICh0aXBJbmZvLnR5cGUgPT09IFRpcFNlbmRUeXBlQVJDNTgpIHsKICAgIGV4dHJhY3QgMCAxCiAgICBieXRlYyA2IC8vIDB4MTQKICAgID09CiAgICBieiBnYXRlZEVkaXRSZXBseV9hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMwMgogICAgLy8gbWJyQW1vdW50ICs9IHRpcEluZm8uYXJjNTgKICAgIGRpZyAxCiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgICsKCmdhdGVkRWRpdFJlcGx5X2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMwNwogICAgLy8gcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIGRpZyAzCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMQogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMTEKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBkdXAKICAgIGJ5dGVjIDQgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMQogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBzd2FwCiAgICBieXRlYyA1IC8vICJzb2NpYWxfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMgogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMTUKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIGRpZyAzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMjYKICAgIC8vIGluZm8ucG9zdC5nYXRlSUQsCiAgICBkaWcgNwogICAgZXh0cmFjdCA0MCA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMzItMzQzCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2F0ZWRFZGl0UmVwbHk+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgZ2F0ZVR4biwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgYW1lbmRtZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICB1bmNvdmVyIDYKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICB1bmNvdmVyIDQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyA5CiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDUtMzA5CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMzNwogICAgLy8gdGlwLAogICAgaXR4bl9uZXh0CiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMTMtMzE4CiAgICAvLyBjb25zdCB0aXAgPSBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFzc2V0UmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgeGZlckFzc2V0OiBha3RhLAogICAgLy8gICBhc3NldEFtb3VudDogcmVhY3RGZWUKICAgIC8vIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMzgKICAgIC8vIGdhdGVUeG4sCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMyNAogICAgLy8gbWV0aG9kU2VsZWN0b3IoR2F0ZU11c3RDaGVja0FiaU1ldGhvZCksCiAgICBieXRlYyA5IC8vIG1ldGhvZCAibXVzdENoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXVtdKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDgKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMjAtMzI5CiAgICAvLyBjb25zdCBnYXRlVHhuID0gaXR4bi5hcHBsaWNhdGlvbkNhbGwoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBnYXRlLAogICAgLy8gICBhcHBBcmdzOiBbCiAgICAvLyAgICAgbWV0aG9kU2VsZWN0b3IoR2F0ZU11c3RDaGVja0FiaU1ldGhvZCksCiAgICAvLyAgICAgb3JpZ2luLAogICAgLy8gICAgIGluZm8ucG9zdC5nYXRlSUQsCiAgICAvLyAgICAgZW5jb2RlQXJjNChhcmdzKQogICAgLy8gICBdCiAgICAvLyB9KQogICAgaW50Y18zIC8vIDYKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzMyLTM0MwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdhdGVkRWRpdFJlcGx5Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIGdhdGVUeG4sCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIGFtZW5kbWVudAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNDIKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIGRpZyAxMQogICAgZGlnIDEzCiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzMyLTM0MwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdhdGVkRWRpdFJlcGx5Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIGdhdGVUeG4sCiAgICAvLyAgICAgY2lkLAogICAgLy8gICAgIGFtZW5kbWVudAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NzI3MjRmOTYgLy8gbWV0aG9kICJnYXRlZEVkaXRSZXBseShwYXksYXhmZXIsYXBwbCxieXRlWzM2XSxieXRlWzMyXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI2OC0yNzQKICAgIC8vIGdhdGVkRWRpdFJlcGx5KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPiwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5lZGl0UmVwbHlbcm91dGluZ10oKSAtPiB2b2lkOgplZGl0UmVwbHk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNDYtMzUxCiAgICAvLyBlZGl0UmVwbHkoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIGFtZW5kbWVudDogYnl0ZXM8MzI+CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzYgLy8gMzYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzM2XQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICB1bmNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNTQKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM1NAogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM1NAogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM1NQogICAgLy8gY29uc3QgeyBwb3N0cywgdm90ZXMsIHZvdGVsaXN0IH0gPSB0aGlzLm1icihjaWQpCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgZHVwCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDEKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICB1bmNvdmVyIDIKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNTYKICAgIC8vIGxldCBtYnJBbW91bnQ6IHVpbnQ2NCA9IHBvc3RzICsgdm90ZXMgKyB2b3RlbGlzdAogICAgY292ZXIgMgogICAgKwogICAgKwogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzU4LTM2MgogICAgLy8gY29uc3QgcG9zdEJlaW5nQW1lbmRlZCA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRQb3N0Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW2FtZW5kbWVudF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICBieXRlYyAxMCAvLyBtZXRob2QgImdldFBvc3QoYnl0ZVszMl0pKGFkZHJlc3MsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ2NCxib29sLHVpbnQ4LGJ5dGVbXSkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGR1cAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18zIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzY0CiAgICAvLyBjb25zdCBvcmlnaW5hbFBvc3RSZWYgPSBwb3N0QmVpbmdBbWVuZGVkLnJlZi5zbGljZSgwLCAzMikudG9GaXhlZCh7IGxlbmd0aDogMzIgfSkKICAgIGR1cAogICAgcHVzaGludCA1OSAvLyA1OQogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgcHVzaGludCAzMiAvLyAzMgogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBzdWJzdHJpbmczCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzY2LTM3MAogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRQb3N0TWV0YT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtvcmlnaW5hbFBvc3RSZWYsIDBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzY5CiAgICAvLyBhcmdzOiBbb3JpZ2luYWxQb3N0UmVmLCAwXQogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2Ni0zNzAKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbb3JpZ2luYWxQb3N0UmVmLCAwXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGJ5dGVjIDcgLy8gbWV0aG9kICJnZXRQb3N0TWV0YShieXRlWzMyXSx1aW50NjQpKChhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50OCxieXRlW10pLChib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCksYm9vbCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNzIKICAgIC8vIGNvbnN0IGNyZWF0b3IgPSBpbmZvLnBvc3QuY3JlYXRvcgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzczCiAgICAvLyBjb25zdCBjcmVhdG9yV2FsbGV0ID0gaW5mby5tZXRhLndhbGxldAogICAgc3dhcAogICAgZXh0cmFjdCA2IDY2CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM3NQogICAgLy8gY29uc3QgdGlwSW5mbyA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24oY3JlYXRvcldhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNzUKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGNvdmVyIDIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM3NwogICAgLy8gaWYgKHRpcEluZm8udHlwZSA9PT0gVGlwU2VuZFR5cGVBUkM1OCkgewogICAgZXh0cmFjdCAwIDEKICAgIGJ5dGVjIDYgLy8gMHgxNAogICAgPT0KICAgIGJ6IGVkaXRSZXBseV9hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM3OAogICAgLy8gbWJyQW1vdW50ICs9IHRpcEluZm8uYXJjNTgKICAgIGRpZyAxCiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgICsKCmVkaXRSZXBseV9hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODMKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMgogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODcKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzg3CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODcKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY5CiAgICAvLyBjb25zdCBbc29jaWFsRmVlc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1NvY2lhbEZlZXMpKQogICAgc3dhcAogICAgYnl0ZWMgNSAvLyAic29jaWFsX2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODgKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzkxCiAgICAvLyBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzk3LTQwNwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmVkaXRSZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgYW1lbmRtZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICB1bmNvdmVyIDUKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyA2CiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODEtMzg1CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwMgogICAgLy8gdGlwLAogICAgaXR4bl9uZXh0CiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzg5LTM5NAogICAgLy8gY29uc3QgdGlwID0gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgIHhmZXJBc3NldDogYWt0YSwKICAgIC8vICAgYXNzZXRBbW91bnQ6IHJlYWN0RmVlCiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzk3LTQwNwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmVkaXRSZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgYW1lbmRtZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwNgogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgZGlnIDcKICAgIGRpZyA5CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzk3LTQwNwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmVkaXRSZXBseT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBjaWQsCiAgICAvLyAgICAgYW1lbmRtZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHgxYzk5ZmU5ZSAvLyBtZXRob2QgImVkaXRSZXBseShwYXksYXhmZXIsYnl0ZVszNl0sYnl0ZVszMl0pdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzQ2LTM1MQogICAgLy8gZWRpdFJlcGx5KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLnZvdGVbcm91dGluZ10oKSAtPiB2b2lkOgp2b3RlOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQxMC00MTYKICAgIC8vIHZvdGUoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgaXNVcDogYm9vbGVhbgogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzIgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MTkKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQxOQogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQxOQogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MjAKICAgIC8vIGxldCBtYnJBbW91bnQ6IHVpbnQ2NCA9IHRoaXMubWJyKEJ5dGVzKCcnKSkudm90ZWxpc3QKICAgIHB1c2hieXRlcyAiIgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDIyCiAgICAvLyBpZiAoaXNVcCkgewogICAgYnogdm90ZV9hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyMy00MjcKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCAwXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyNgogICAgLy8gYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgMF0KICAgIGRpZyA1CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAzMgogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyMy00MjcKICAgIC8vIGNvbnN0IGluZm8gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCAwXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGJ5dGVjIDcgLy8gbWV0aG9kICJnZXRQb3N0TWV0YShieXRlWzMyXSx1aW50NjQpKChhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50OCxieXRlW10pLChib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCksYm9vbCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBkaWcgMgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyOQogICAgLy8gY29uc3QgY3JlYXRvciA9IGluZm8ucG9zdC5jcmVhdG9yCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgc3Vic3RyaW5nMwogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MzAKICAgIC8vIGNvbnN0IGNyZWF0b3JXYWxsZXQgPSBpbmZvLm1ldGEud2FsbGV0CiAgICBzd2FwCiAgICBleHRyYWN0IDYgNjYKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDMxCiAgICAvLyBjb25zdCB0aXBJbmZvID0gdGhpcy5jaGVja1RpcE1iclJlcXVpcmVtZW50cyh0aGlzLmFraXRhREFPLnZhbHVlLCBjcmVhdG9yLCBBcHBsaWNhdGlvbihjcmVhdG9yV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzMQogICAgLy8gY29uc3QgdGlwSW5mbyA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24oY3JlYXRvcldhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgY292ZXIgMgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMKICAgIGR1cAogICAgYnVyeSAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDMzCiAgICAvLyBpZiAodGlwSW5mby50eXBlID09PSBUaXBTZW5kVHlwZUFSQzU4KSB7CiAgICBleHRyYWN0IDAgMQogICAgYnl0ZWMgNiAvLyAweDE0CiAgICA9PQogICAgYnogdm90ZV9hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzNAogICAgLy8gbWJyQW1vdW50ICs9IHRpcEluZm8uYXJjNTgKICAgIGRpZyA5CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxCiAgICArCiAgICBidXJ5IDEKCnZvdGVfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQwCiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDEKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQ0CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ0NAogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGR1cAogICAgYnl0ZWMgNCAvLyAiYWtpdGFfYXNzZXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQ0CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIHN3YXAKICAgIGJ5dGVjIDUgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQ1CiAgICAvLyBjb25zdCB7IHJlYWN0RmVlIH0gPSBnZXRTb2NpYWxGZWVzKHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ0OAogICAgLy8gYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ1My00NjQKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS52b3RlPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIGlzVXAKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIGRpZyA1CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgNgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDM4LTQ0MgogICAgLy8gY29uc3QgbWJyUGF5bWVudCA9IGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NTgKICAgIC8vIHRpcCwKICAgIGl0eG5fbmV4dAogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ0Ni00NTEKICAgIC8vIGNvbnN0IHRpcCA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgIGFzc2V0QW1vdW50OiByZWFjdEZlZQogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ1My00NjQKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS52b3RlPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIGlzVXAKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDYzCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICBkaWcgOQogICAgZGlnIDExCiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDUzLTQ2NAogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnZvdGU+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgaXNVcAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4MDJlOTI2MzEgLy8gbWV0aG9kICJ2b3RlKHBheSxheGZlcixieXRlW10sdWludDgsYm9vbCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA5CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDcKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQxMC00MTYKICAgIC8vIHZvdGUoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgaXNVcDogYm9vbGVhbgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLmVkaXRWb3RlW3JvdXRpbmddKCkgLT4gdm9pZDoKZWRpdFZvdGU6CiAgICBpbnRjXzAgLy8gMAogICAgcHVzaGJ5dGVzICIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NjctNDcyCiAgICAvLyBlZGl0Vm90ZSgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICByZWY6IGJ5dGVzPDMyPiwKICAgIC8vICAgZmxpcDogYm9vbGVhbgogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgY292ZXIgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDc1CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NzUKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBkdXAKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ3NQogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGNvdmVyIDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ3Ny00ODEKICAgIC8vIGNvbnN0IHsgaXNVcDogd2FzVXAgfSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRWb3RlPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZl0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgcHVzaGJ5dGVzIDB4ZjRlYTUwZTQgLy8gbWV0aG9kICJnZXRWb3RlKGJ5dGVbMzJdKSh1aW50NjQsYm9vbCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18zIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOSAvLyA5CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDY0LGJvb2wxKQogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODUKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIHN3YXAKICAgIGNvdmVyIDQKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4NgogICAgLy8gYW1vdW50OiAwLAogICAgaW50Y18wIC8vIDAKICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBzd2FwCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODkKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OTMKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ5NQogICAgLy8gYXNzZXRBbW91bnQ6IDAsCiAgICBpbnRjXzAgLy8gMAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDk4CiAgICAvLyBpZiAoZmxpcCkgewogICAgYnogZWRpdFZvdGVfYWZ0ZXJfaWZfZWxzZUA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OTkKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ5OQogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBieXRlYyA1IC8vICJzb2NpYWxfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ5OQogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDEzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MDQKICAgIC8vIGlmICghd2FzVXApIHsKICAgIGRpZyA1CiAgICBibnogZWRpdFZvdGVfYWZ0ZXJfaWZfZWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MDUtNTA5CiAgICAvLyBjb25zdCBpbmZvID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZiwgMF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTA4CiAgICAvLyBhcmdzOiBbcmVmLCAwXSwKICAgIGludGNfMCAvLyAwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MDUtNTA5CiAgICAvLyBjb25zdCBpbmZvID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZiwgMF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgYnl0ZWMgNyAvLyBtZXRob2QgImdldFBvc3RNZXRhKGJ5dGVbMzJdLHVpbnQ2NCkoKGFkZHJlc3MsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ4LGJ5dGVbXSksKGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50NjQsdWludDY0KSxib29sKSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMTAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDYKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgZGlnIDcKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MTEKICAgIC8vIGNvbnN0IGNyZWF0b3IgPSBpbmZvLnBvc3QuY3JlYXRvcgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTEyCiAgICAvLyBjb25zdCBjcmVhdG9yV2FsbGV0ID0gaW5mby5tZXRhLndhbGxldAogICAgc3dhcAogICAgZXh0cmFjdCA2IDY2CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUxMwogICAgLy8gY29uc3QgdGlwSW5mbyA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24oY3JlYXRvcldhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MTMKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGNvdmVyIDIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBkdXAKICAgIGJ1cnkgMTUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUxNAogICAgLy8gaWYgKHRpcEluZm8udHlwZSA9PT0gVGlwU2VuZFR5cGVBUkM1OCkgewogICAgZXh0cmFjdCAwIDEKICAgIGJ5dGVjIDYgLy8gMHgxNAogICAgPT0KICAgIGJ6IGVkaXRWb3RlX2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTE1CiAgICAvLyBtYnJQYXltZW50LnNldCh7IGFtb3VudDogdGlwSW5mby5hcmM1OCB9KQogICAgZGlnIDEzCiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgNAoKZWRpdFZvdGVfYWZ0ZXJfaWZfZWxzZUA4OgogICAgZGlnIDEyCiAgICBidXJ5IDEKCmVkaXRWb3RlX2FmdGVyX2lmX2Vsc2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUyMC01MzAKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5lZGl0Vm90ZT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICByZWYsCiAgICAvLyAgICAgZmxpcAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIGRpZyAzCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZGlnIDQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyA3CiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODMtNDg3CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IDAsCiAgICAvLyB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTI1CiAgICAvLyB0aXAsCiAgICBpdHhuX25leHQKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBkaWcgMwogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGRpZyAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ5MS00OTYKICAgIC8vIGNvbnN0IHRpcCA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUyMC01MzAKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5lZGl0Vm90ZT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICByZWYsCiAgICAvLyAgICAgZmxpcAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTI5CiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpLAogICAgZGlnIDExCiAgICBkaWcgMTMKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MjAtNTMwCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZWRpdFZvdGU+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIGZsaXAKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KSwKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHg4NGZhNGI1ZSAvLyBtZXRob2QgImVkaXRWb3RlKHBheSxheGZlcixieXRlWzMyXSxib29sKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDExCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDEwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBkaWcgNwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ2Ny00NzIKICAgIC8vIGVkaXRWb3RlKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+LAogICAgLy8gICBmbGlwOiBib29sZWFuCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4uZ2F0ZWRSZWFjdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdhdGVkUmVhY3Q6CiAgICBpbnRjXzAgLy8gMAogICAgZHVwCiAgICBwdXNoYnl0ZXMgIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUzMy01NDAKICAgIC8vIGdhdGVkUmVhY3QoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgTkZUOiB1aW50NjQsCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBjb3ZlciAzCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQxCiAgICAvLyBjb25zdCB7IG9yaWdpbiwgc2VuZGVyIH0gPSBnZXRBY2NvdW50cyh3YWxsZXQpCiAgICB1bmNvdmVyIDIKICAgIGNhbGxzdWIgZ2V0QWNjb3VudHMKICAgIGR1cAogICAgZXh0cmFjdCAzMiAzMgogICAgY292ZXIgMwogICAgZXh0cmFjdCA2NCAzMgogICAgZHVwCiAgICBjb3ZlciAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDMKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDMKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MAogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFwcExpc3QpKQogICAgZHVwCiAgICBieXRlYyA4IC8vICJhYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDMKICAgIC8vIGNvbnN0IHsgZ2F0ZSB9ID0gZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgNAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQ0CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQ2LTU1MAogICAgLy8gY29uc3QgeyBwb3N0LCBtZXRhLCByZWFjdGlvbkV4aXN0cyB9ID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgTkZUXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU0OQogICAgLy8gYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgTkZUXQogICAgZGlnIDMKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQ2LTU1MAogICAgLy8gY29uc3QgeyBwb3N0LCBtZXRhLCByZWFjdGlvbkV4aXN0cyB9ID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdldFBvc3RNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KSwgTkZUXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGJ5dGVjIDcgLy8gbWV0aG9kICJnZXRQb3N0TWV0YShieXRlWzMyXSx1aW50NjQpKChhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50OCxieXRlW10pLChib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCksYm9vbCkiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwbiAyCiAgICBleHRyYWN0IDQgMAogICAgZHVwCiAgICB1bmNvdmVyIDIKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18zIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgcHVzaGludCA1NDQgLy8gNTQ0CiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1MgogICAgLy8gY29uc3QgeyByZWFjdGlvbnMsIHJlYWN0aW9ubGlzdCB9ID0gdGhpcy5tYnIoQnl0ZXMoJycpKQogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGR1cAogICAgcHVzaGludCA0MCAvLyA0MAogICAgZXh0cmFjdF91aW50NjQKICAgIGNvdmVyIDIKICAgIHB1c2hpbnQgNDggLy8gNDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NTQtNTU2CiAgICAvLyBsZXQgbWJyQW1vdW50OiB1aW50NjQgPSByZWFjdGlvbkV4aXN0cwogICAgLy8gICA/IHJlYWN0aW9ubGlzdAogICAgLy8gICA6IHJlYWN0aW9ucyArIHJlYWN0aW9ubGlzdAogICAgYnogZ2F0ZWRSZWFjdF90ZXJuYXJ5X2ZhbHNlQDQKICAgIGJ1cnkgMTQKCmdhdGVkUmVhY3RfdGVybmFyeV9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTU4CiAgICAvLyBjb25zdCBjcmVhdG9yID0gcG9zdC5jcmVhdG9yCiAgICBkaWcgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHN1YnN0cmluZzMKICAgIGR1cAogICAgYnVyeSAxNwogICAgZXh0cmFjdCAwIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NTkKICAgIC8vIGNvbnN0IGNyZWF0b3JXYWxsZXQgPSBtZXRhLndhbGxldAogICAgZGlnIDMKICAgIGV4dHJhY3QgNiA2NgogICAgaW50Y18xIC8vIDEKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NjAKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTYwCiAgICAvLyBjb25zdCB0aXBJbmZvID0gdGhpcy5jaGVja1RpcE1iclJlcXVpcmVtZW50cyh0aGlzLmFraXRhREFPLnZhbHVlLCBjcmVhdG9yLCBBcHBsaWNhdGlvbihjcmVhdG9yV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBjb3ZlciAyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50cwogICAgZHVwCiAgICBidXJ5IDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NjEKICAgIC8vIGlmICh0aXBJbmZvLnR5cGUgPT09IFRpcFNlbmRUeXBlQVJDNTgpIHsKICAgIGV4dHJhY3QgMCAxCiAgICBieXRlYyA2IC8vIDB4MTQKICAgID09CiAgICBieiBnYXRlZFJlYWN0X2FmdGVyX2lmX2Vsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTYyCiAgICAvLyBtYnJBbW91bnQgKz0gdGlwSW5mby5hcmM1OAogICAgZGlnIDE0CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxNAogICAgKwogICAgYnVyeSAxNAoKZ2F0ZWRSZWFjdF9hZnRlcl9pZl9lbHNlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NjcKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMwogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NzEKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTcxCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NzEKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY5CiAgICAvLyBjb25zdCBbc29jaWFsRmVlc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1NvY2lhbEZlZXMpKQogICAgc3dhcAogICAgYnl0ZWMgNSAvLyAic29jaWFsX2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NzIKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTc1CiAgICAvLyBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICBkaWcgMwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTg2CiAgICAvLyBwb3N0LmdhdGVJRCwKICAgIGRpZyAyMAogICAgZXh0cmFjdCA0MCA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1OTEtNjAzCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2F0ZWRSZWFjdD4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICBnYXRlVHhuLAogICAgLy8gICAgIHJlZiwKICAgIC8vICAgICB0eXBlLAogICAgLy8gICAgIE5GVAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgZGlnIDE5CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgMTAKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2NS01NjkKICAgIC8vIGNvbnN0IG1iclBheW1lbnQgPSBpdHhuLnBheW1lbnQoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogbWJyQW1vdW50CiAgICAvLyB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTk2CiAgICAvLyB0aXAsCiAgICBpdHhuX25leHQKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU3My01NzgKICAgIC8vIGNvbnN0IHRpcCA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgIGFzc2V0QW1vdW50OiByZWFjdEZlZQogICAgLy8gfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU5NwogICAgLy8gZ2F0ZVR4biwKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTg0CiAgICAvLyBtZXRob2RTZWxlY3RvcihHYXRlTXVzdENoZWNrQWJpTWV0aG9kKSwKICAgIGJ5dGVjIDkgLy8gbWV0aG9kICJtdXN0Q2hlY2soYWRkcmVzcyx1aW50NjQsYnl0ZVtdW10pdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU4MC01ODkKICAgIC8vIGNvbnN0IGdhdGVUeG4gPSBpdHhuLmFwcGxpY2F0aW9uQ2FsbCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IGdhdGUsCiAgICAvLyAgIGFwcEFyZ3M6IFsKICAgIC8vICAgICBtZXRob2RTZWxlY3RvcihHYXRlTXVzdENoZWNrQWJpTWV0aG9kKSwKICAgIC8vICAgICBvcmlnaW4sCiAgICAvLyAgICAgcG9zdC5nYXRlSUQsCiAgICAvLyAgICAgZW5jb2RlQXJjNChhcmdzKQogICAgLy8gICBdCiAgICAvLyB9KQogICAgaW50Y18zIC8vIDYKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTkxLTYwMwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmdhdGVkUmVhY3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgZ2F0ZVR4biwKICAgIC8vICAgICByZWYsCiAgICAvLyAgICAgdHlwZSwKICAgIC8vICAgICBORlQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjAyCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICBkaWcgMTMKICAgIGRpZyAxNQogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU5MS02MDMKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nYXRlZFJlYWN0Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgdGlwLAogICAgLy8gICAgIGdhdGVUeG4sCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgTkZUCiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHg2ZTdkNDJjMiAvLyBtZXRob2QgImdhdGVkUmVhY3QocGF5LGF4ZmVyLGFwcGwsYnl0ZVtdLHVpbnQ4LHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUzMy01NDAKICAgIC8vIGdhdGVkUmVhY3QoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgTkZUOiB1aW50NjQsCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmdhdGVkUmVhY3RfdGVybmFyeV9mYWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTU2CiAgICAvLyA6IHJlYWN0aW9ucyArIHJlYWN0aW9ubGlzdAogICAgZGlnIDEKICAgICsKICAgIGJ1cnkgMTQKICAgIGIgZ2F0ZWRSZWFjdF90ZXJuYXJ5X21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4ucmVhY3Rbcm91dGluZ10oKSAtPiB2b2lkOgpyZWFjdDoKICAgIGludGNfMCAvLyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYwNi02MTIKICAgIC8vIHJlYWN0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIE5GVDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBjb3ZlciAzCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgdW5jb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjE1CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTUKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTUKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBjb3ZlciA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTctNjIxCiAgICAvLyBjb25zdCB7IHBvc3QsIG1ldGEsIHJlYWN0aW9uRXhpc3RzIH0gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCBORlRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjIwCiAgICAvLyBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCBORlRdCiAgICBkaWcgMwogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTctNjIxCiAgICAvLyBjb25zdCB7IHBvc3QsIG1ldGEsIHJlYWN0aW9uRXhpc3RzIH0gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0UG9zdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pLCBORlRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgYnl0ZWMgNyAvLyBtZXRob2QgImdldFBvc3RNZXRhKGJ5dGVbMzJdLHVpbnQ2NCkoKGFkZHJlc3MsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ4LGJ5dGVbXSksKGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50NjQsdWludDY0KSxib29sKSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXBuIDIKICAgIGV4dHJhY3QgNCAwCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBwdXNoaW50IDU0NCAvLyA1NDQKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjIzCiAgICAvLyBjb25zdCB7IHJlYWN0aW9ucywgcmVhY3Rpb25saXN0IH0gPSB0aGlzLm1icihCeXRlcygnJykpCiAgICBwdXNoYnl0ZXMgIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgZHVwCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgcHVzaGludCA0OCAvLyA0OAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYyNS02MjcKICAgIC8vIGxldCBtYnJBbW91bnQ6IHVpbnQ2NCA9IHJlYWN0aW9uRXhpc3RzCiAgICAvLyAgID8gcmVhY3Rpb25saXN0CiAgICAvLyAgIDogcmVhY3Rpb25zICsgcmVhY3Rpb25saXN0CiAgICBieiByZWFjdF90ZXJuYXJ5X2ZhbHNlQDQKICAgIGJ1cnkgMTEKCnJlYWN0X3Rlcm5hcnlfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYyOQogICAgLy8gY29uc3QgY3JlYXRvciA9IHBvc3QuY3JlYXRvcgogICAgZGlnIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMQogICAgbGVuCiAgICBzdWJzdHJpbmczCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzMAogICAgLy8gY29uc3QgY3JlYXRvcldhbGxldCA9IG1ldGEud2FsbGV0CiAgICBkaWcgMwogICAgZXh0cmFjdCA2IDY2CiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzMQogICAgLy8gY29uc3QgdGlwSW5mbyA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24oY3JlYXRvcldhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MzEKICAgIC8vIGNvbnN0IHRpcEluZm8gPSB0aGlzLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3IsIEFwcGxpY2F0aW9uKGNyZWF0b3JXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGNvdmVyIDIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBkdXAKICAgIGJ1cnkgMTMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzMgogICAgLy8gaWYgKHRpcEluZm8udHlwZSA9PT0gVGlwU2VuZFR5cGVBUkM1OCkgewogICAgZXh0cmFjdCAwIDEKICAgIGJ5dGVjIDYgLy8gMHgxNAogICAgPT0KICAgIGJ6IHJlYWN0X2FmdGVyX2lmX2Vsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjMzCiAgICAvLyBtYnJBbW91bnQgKz0gdGlwSW5mby5hcmM1OAogICAgZGlnIDExCiAgICBpbnRjXzEgLy8gMQogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxMQogICAgKwogICAgYnVyeSAxMQoKcmVhY3RfYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjM4CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDMKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjQyCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY0MgogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGR1cAogICAgYnl0ZWMgNCAvLyAiYWtpdGFfYXNzZXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjQyCiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIHN3YXAKICAgIGJ5dGVjIDUgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjQzCiAgICAvLyBjb25zdCB7IHJlYWN0RmVlIH0gPSBnZXRTb2NpYWxGZWVzKHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY0NgogICAgLy8gYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgZGlnIDMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY1MS02NjIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5yZWFjdD4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIHRpcCwKICAgIC8vICAgICByZWYsCiAgICAvLyAgICAgdHlwZSwKICAgIC8vICAgICBORlQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIGRpZyAxNQogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDgKICAgIGR1cAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzNi02NDAKICAgIC8vIGNvbnN0IG1iclBheW1lbnQgPSBpdHhuLnBheW1lbnQoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogbWJyQW1vdW50CiAgICAvLyB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjU2CiAgICAvLyB0aXAsCiAgICBpdHhuX25leHQKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgc3dhcAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBkdXAKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NDQtNjQ5CiAgICAvLyBjb25zdCB0aXAgPSBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFzc2V0UmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgeGZlckFzc2V0OiBha3RhLAogICAgLy8gICBhc3NldEFtb3VudDogcmVhY3RGZWUKICAgIC8vIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NTEtNjYyCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUucmVhY3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgTkZUCiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY2MQogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgZGlnIDEwCiAgICBkaWcgMTIKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NTEtNjYyCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUucmVhY3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICB0aXAsCiAgICAvLyAgICAgcmVmLAogICAgLy8gICAgIHR5cGUsCiAgICAvLyAgICAgTkZUCiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhkMGU1YjE4ZCAvLyBtZXRob2QgInJlYWN0KHBheSxheGZlcixieXRlW10sdWludDgsdWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDEwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDkKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgOAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYwNi02MTIKICAgIC8vIHJlYWN0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIE5GVDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCnJlYWN0X3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYyNwogICAgLy8gOiByZWFjdGlvbnMgKyByZWFjdGlvbmxpc3QKICAgIGRpZyAxCiAgICArCiAgICBidXJ5IDExCiAgICBiIHJlYWN0X3Rlcm5hcnlfbWVyZ2VANQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5kZWxldGVSZWFjdGlvbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmRlbGV0ZVJlYWN0aW9uOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjY1LTY3MAogICAgLy8gZGVsZXRlUmVhY3Rpb24oCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlczwzMj4sCiAgICAvLyAgIE5GVDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjczCiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NzMKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NzMKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Njc1LTY4MAogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLmRlbGV0ZVJlYWN0aW9uPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogW3JlZiwgTkZUXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY3OQogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDUKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NzUtNjgwCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZGVsZXRlUmVhY3Rpb24+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLCBORlRdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NmU1Yjc3MDIgLy8gbWV0aG9kICJkZWxldGVSZWFjdGlvbihieXRlWzMyXSx1aW50NjQpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDQKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NjUtNjcwCiAgICAvLyBkZWxldGVSZWFjdGlvbigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICByZWY6IGJ5dGVzPDMyPiwKICAgIC8vICAgTkZUOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5nYXRlZEZvbGxvd1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmdhdGVkRm9sbG93OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjgzLTY4OAogICAgLy8gZ2F0ZWRGb2xsb3coCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY4OQogICAgLy8gY29uc3QgeyBvcmlnaW4sIHNlbmRlciB9ID0gZ2V0QWNjb3VudHMod2FsbGV0KQogICAgZGlnIDMKICAgIGNhbGxzdWIgZ2V0QWNjb3VudHMKICAgIGR1cAogICAgZXh0cmFjdCAzMiAzMgogICAgc3dhcAogICAgZXh0cmFjdCA2NCAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjkxCiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjkxCiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIGR1cAogICAgYnl0ZWMgOCAvLyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjkxCiAgICAvLyBjb25zdCB7IGdhdGUgfSA9IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgcHVzaGludCA0MCAvLyA0MAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIHN3YXAKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5MgogICAgLy8gY29uc3QgeyBzb2NpYWwsIGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5NC02OTgKICAgIC8vIGNvbnN0IHsgZm9sbG93R2F0ZUlEIH0gPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuZ2V0TWV0YT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hieXRlcyAweDczOWVhNzBiIC8vIG1ldGhvZCAiZ2V0TWV0YShhZGRyZXNzKShib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBkaWcgMgogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGxlbgogICAgcHVzaGludCA3NCAvLyA3NAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0KQogICAgZXh0cmFjdCA1NCA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MDIKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihncmFwaCkuYWRkcmVzcywKICAgIGRpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MDMKICAgIC8vIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5mb2xsb3dzCiAgICBwdXNoYnl0ZXMgIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTctNzI2CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEdyYXBoLnByb3RvdHlwZS5nYXRlZEZvbGxvdz4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBncmFwaCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgZ2F0ZVR4biwKICAgIC8vICAgICBhZGRyZXNzCiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDMKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MDAtNzA0CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24oZ3JhcGgpLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5mb2xsb3dzCiAgICAvLyB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzIyCiAgICAvLyBnYXRlVHhuLAogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTAKICAgIC8vIG1ldGhvZFNlbGVjdG9yKEdhdGVNdXN0Q2hlY2tBYmlNZXRob2QpLAogICAgYnl0ZWMgOSAvLyBtZXRob2QgIm11c3RDaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW11bXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzA2LTcxNQogICAgLy8gY29uc3QgZ2F0ZVR4biA9IGl0eG4uYXBwbGljYXRpb25DYWxsKHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ2F0ZSwKICAgIC8vICAgYXBwQXJnczogWwogICAgLy8gICAgIG1ldGhvZFNlbGVjdG9yKEdhdGVNdXN0Q2hlY2tBYmlNZXRob2QpLAogICAgLy8gICAgIG9yaWdpbiwKICAgIC8vICAgICBmb2xsb3dHYXRlSUQsCiAgICAvLyAgICAgZW5jb2RlQXJjNChhcmdzKQogICAgLy8gICBdCiAgICAvLyB9KQogICAgaW50Y18zIC8vIDYKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzE3LTcyNgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUuZ2F0ZWRGb2xsb3c+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIGdhdGVUeG4sCiAgICAvLyAgICAgYWRkcmVzcwogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MjUKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzE3LTcyNgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUuZ2F0ZWRGb2xsb3c+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBtYnJQYXltZW50LAogICAgLy8gICAgIGdhdGVUeG4sCiAgICAvLyAgICAgYWRkcmVzcwogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4ODY2NzU0OTQgLy8gbWV0aG9kICJnYXRlZEZvbGxvdyhwYXksYXBwbCxhZGRyZXNzKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjgzLTY4OAogICAgLy8gZ2F0ZWRGb2xsb3coCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5mb2xsb3dbcm91dGluZ10oKSAtPiB2b2lkOgpmb2xsb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MjktNzMzCiAgICAvLyBmb2xsb3coCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzM2CiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjczNgogICAgLy8gY29uc3QgeyBncmFwaCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzM2CiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzQwCiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oZ3JhcGgpLmFkZHJlc3MsCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc0MQogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmZvbGxvd3MKICAgIHB1c2hieXRlcyAiIgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc0NC03NTIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmZvbGxvdz4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBncmFwaCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgYWRkcmVzcwogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzM4LTc0MgogICAgLy8gY29uc3QgbWJyUGF5bWVudCA9IGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKGdyYXBoKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuZm9sbG93cwogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc0NC03NTIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmZvbGxvdz4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBncmFwaCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG1iclBheW1lbnQsCiAgICAvLyAgICAgYWRkcmVzcwogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NTEKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzQ0LTc1MgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUuZm9sbG93Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IGdyYXBoLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICBhZGRyZXNzCiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHg0YjZmOTA3ZiAvLyBtZXRob2QgImZvbGxvdyhwYXksYWRkcmVzcyl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcyOS03MzMKICAgIC8vIGZvbGxvdygKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4udW5mb2xsb3dbcm91dGluZ10oKSAtPiB2b2lkOgp1bmZvbGxvdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc1NS03NTkKICAgIC8vIHVuZm9sbG93KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc2MgogICAgLy8gY29uc3QgeyBncmFwaCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NjIKICAgIC8vIGNvbnN0IHsgZ3JhcGggfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc2MgogICAgLy8gY29uc3QgeyBncmFwaCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc2NC03NjkKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLnVuZm9sbG93Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IGdyYXBoLAogICAgLy8gICBhcmdzOiBbYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NjgKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzY0LTc2OQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUudW5mb2xsb3c+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDE2MWIzYTdhIC8vIG1ldGhvZCAidW5mb2xsb3coYWRkcmVzcyl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc1NS03NTkKICAgIC8vIHVuZm9sbG93KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5ibG9ja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmJsb2NrOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Nzc0LTc3OAogICAgLy8gYmxvY2soCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzgxCiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc4MQogICAgLy8gY29uc3QgeyBncmFwaCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzgxCiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Nzg1CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24oZ3JhcGgpLmFkZHJlc3MsCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc4NgogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmJsb2NrcwogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Nzg5LTc5NAogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUuYmxvY2s+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFttYnJQYXltZW50LCBhZGRyZXNzXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBkaWcgMQogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc4My03ODcKICAgIC8vIGNvbnN0IG1iclBheW1lbnQgPSBpdHhuLnBheW1lbnQoewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihncmFwaCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmJsb2NrcwogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc4OS03OTQKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmJsb2NrPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IGdyYXBoLAogICAgLy8gICBhcmdzOiBbbWJyUGF5bWVudCwgYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc5MwogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDQKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3ODktNzk0CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEdyYXBoLnByb3RvdHlwZS5ibG9jaz4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBncmFwaCwKICAgIC8vICAgYXJnczogW21iclBheW1lbnQsIGFkZHJlc3NdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4YjU5YzhhNTQgLy8gbWV0aG9kICJibG9jayhwYXksYWRkcmVzcyl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc3NC03NzgKICAgIC8vIGJsb2NrKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi51bmJsb2NrW3JvdXRpbmddKCkgLT4gdm9pZDoKdW5ibG9jazoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc5Ny04MDEKICAgIC8vIHVuYmxvY2soCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODA0CiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgwNAogICAgLy8gY29uc3QgeyBncmFwaCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODA0CiAgICAvLyBjb25zdCB7IGdyYXBoIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODA2LTgxMQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxHcmFwaC5wcm90b3R5cGUudW5ibG9jaz4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBncmFwaCwKICAgIC8vICAgYXJnczogW2FkZHJlc3NdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODEwCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgNAogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgwNi04MTEKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLnVuYmxvY2s+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogZ3JhcGgsCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweGFlZWJiMzc4IC8vIG1ldGhvZCAidW5ibG9jayhhZGRyZXNzKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Nzk3LTgwMQogICAgLy8gdW5ibG9jaygKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4uYWRkTW9kZXJhdG9yW3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkTW9kZXJhdG9yOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODE0LTgxOAogICAgLy8gYWRkTW9kZXJhdG9yKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgyMQogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgyMQogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjEKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODI1CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24obW9kZXJhdGlvbikuYWRkcmVzcywKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODI2CiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubW9kZXJhdG9ycwogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjktODM0CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZE1vZGVyYXRvcj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbbWJyUGF5bWVudCwgYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjMtODI3CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24obW9kZXJhdGlvbikuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLm1vZGVyYXRvcnMKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjktODM0CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZE1vZGVyYXRvcj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbbWJyUGF5bWVudCwgYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgzMwogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDQKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjktODM0CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZE1vZGVyYXRvcj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbbWJyUGF5bWVudCwgYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHg3NzY2MmM4ZSAvLyBtZXRob2QgImFkZE1vZGVyYXRvcihwYXksYWRkcmVzcyl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgxNC04MTgKICAgIC8vIGFkZE1vZGVyYXRvcigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4ucmVtb3ZlTW9kZXJhdG9yW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVtb3ZlTW9kZXJhdG9yOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODM4LTg0MgogICAgLy8gcmVtb3ZlTW9kZXJhdG9yKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg0NQogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg0NQogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NDUKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODQ3LTg1MgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS5yZW1vdmVNb2RlcmF0b3I+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogbW9kZXJhdGlvbiwKICAgIC8vICAgYXJnczogW2FkZHJlc3NdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODUxCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgNAogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg0Ny04NTIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUucmVtb3ZlTW9kZXJhdG9yPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IG1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDAzZTNhYjIyIC8vIG1ldGhvZCAicmVtb3ZlTW9kZXJhdG9yKGFkZHJlc3Mpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MzgtODQyCiAgICAvLyByZW1vdmVNb2RlcmF0b3IoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLmJhbltyb3V0aW5nXSgpIC0+IHZvaWQ6CmJhbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg1NS04NjAKICAgIC8vIGJhbigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50LAogICAgLy8gICBleHBpcmF0aW9uOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBkaWcgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzIgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NjMKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NjMKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODYzCiAgICAvLyBjb25zdCB7IG1vZGVyYXRpb24gfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg2NwogICAgLy8gcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKG1vZGVyYXRpb24pLmFkZHJlc3MsCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg2OAogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmJhbm5lZAogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgNzIgLy8gNzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NzEtODc2CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmJhbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbbWJyUGF5bWVudCwgYWRkcmVzcywgZXhwaXJhdGlvbl0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NjUtODY5CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24obW9kZXJhdGlvbikuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmJhbm5lZAogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3MS04NzYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUuYmFuPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IG1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFttYnJQYXltZW50LCBhZGRyZXNzLCBleHBpcmF0aW9uXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODc1CiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDQKICAgIHVuY292ZXIgNQogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3MS04NzYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUuYmFuPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IG1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFttYnJQYXltZW50LCBhZGRyZXNzLCBleHBpcmF0aW9uXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDhlYmMxOWI1IC8vIG1ldGhvZCAiYmFuKHBheSxhZGRyZXNzLHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg1NS04NjAKICAgIC8vIGJhbigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50LAogICAgLy8gICBleHBpcmF0aW9uOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi5mbGFnUG9zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmZsYWdQb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODc5LTg4MwogICAgLy8gZmxhZ1Bvc3QoCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgcmVmOiBieXRlczwzMj4KICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg4NgogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg4NgogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4ODYKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODg4LTg5MwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS5mbGFnUG9zdD4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbcmVmXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg5MgogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDQKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4ODgtODkzCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmZsYWdQb3N0Pih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IG1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFtyZWZdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4NjFkY2QyZWYgLy8gbWV0aG9kICJmbGFnUG9zdChieXRlWzMyXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3OS04ODMKICAgIC8vIGZsYWdQb3N0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4udW5mbGFnUG9zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnVuZmxhZ1Bvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4OTYtOTAwCiAgICAvLyB1bmZsYWdQb3N0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBkaWcgMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzIgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MDMKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MDMKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTAzCiAgICAvLyBjb25zdCB7IG1vZGVyYXRpb24gfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkwNS05MTAKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUudW5mbGFnUG9zdD4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbcmVmXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkwOQogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDQKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MDUtOTEwCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLnVuZmxhZ1Bvc3Q+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogbW9kZXJhdGlvbiwKICAgIC8vICAgYXJnczogW3JlZl0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHg3OTYwZWE3NiAvLyBtZXRob2QgInVuZmxhZ1Bvc3QoYnl0ZVszMl0pdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4OTYtOTAwCiAgICAvLyB1bmZsYWdQb3N0KAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4udW5iYW5bcm91dGluZ10oKSAtPiB2b2lkOgp1bmJhbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkxMy05MTcKICAgIC8vIHVuYmFuKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFkZHJlc3M6IEFjY291bnQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkyMAogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkyMAogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MjAKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTIyLTkyNwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS51bmJhbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MjYKICAgIC8vIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHJla2V5QWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTIyLTkyNwogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS51bmJhbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbYWRkcmVzc10sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhhMGQyMzIxZCAvLyBtZXRob2QgInVuYmFuKGFkZHJlc3Mpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MTMtOTE3CiAgICAvLyB1bmJhbigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxQbHVnaW4uYWRkQWN0aW9uW3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkQWN0aW9uOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTMwLTkzNQogICAgLy8gYWRkQWN0aW9uKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFjdGlvbkFwcElEOiB1aW50NjQsCiAgICAvLyAgIGNvbnRlbnQ6IENJRAogICAgLy8gKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkzOAogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkzOAogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlY18xIC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MzgKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTQyCiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24obW9kZXJhdGlvbikuYWRkcmVzcywKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTQzCiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuYWN0aW9ucwogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgODAgLy8gODAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDYtOTU1CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZEFjdGlvbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICBhY3Rpb25BcHBJRCwKICAgIC8vICAgICBjb250ZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDAtOTQ0CiAgICAvLyBjb25zdCBtYnJQYXltZW50ID0gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24obW9kZXJhdGlvbikuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmFjdGlvbnMKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDYtOTU1CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZEFjdGlvbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICBhY3Rpb25BcHBJRCwKICAgIC8vICAgICBjb250ZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk1NAogICAgLy8gcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDUKICAgIGNhbGxzdWIgcmVrZXlBZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDYtOTU1CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmFkZEFjdGlvbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgbWJyUGF5bWVudCwKICAgIC8vICAgICBhY3Rpb25BcHBJRCwKICAgIC8vICAgICBjb250ZW50CiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhkOTA2NzFiNiAvLyBtZXRob2QgImFkZEFjdGlvbihwYXksdWludDY0LGJ5dGVbMzZdKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTMwLTkzNQogICAgLy8gYWRkQWN0aW9uKAogICAgLy8gICB3YWxsZXQ6IEFwcGxpY2F0aW9uLAogICAgLy8gICByZWtleUJhY2s6IGJvb2xlYW4sCiAgICAvLyAgIGFjdGlvbkFwcElEOiB1aW50NjQsCiAgICAvLyAgIGNvbnRlbnQ6IENJRAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLnJlbW92ZUFjdGlvbltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlbW92ZUFjdGlvbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk1OC05NjIKICAgIC8vIHJlbW92ZUFjdGlvbigKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBhY3Rpb25BcHBJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgZGlnIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY4CiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICBieXRlY18yIC8vICJzcGVuZGluZ19hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjYtMjY5CiAgICAvLyBjb25zdCBbc3BlbmRpbmdBZGRyZXNzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTY1CiAgICAvLyBjb25zdCB7IG1vZGVyYXRpb24gfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTY1CiAgICAvLyBjb25zdCB7IG1vZGVyYXRpb24gfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjXzEgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk2NQogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NjctOTcyCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLnJlbW92ZUFjdGlvbj4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBtb2RlcmF0aW9uLAogICAgLy8gICBhcmdzOiBbYWN0aW9uQXBwSURdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTcxCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgNAogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk2Ny05NzIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsTW9kZXJhdGlvbi5wcm90b3R5cGUucmVtb3ZlQWN0aW9uPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IG1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFthY3Rpb25BcHBJRF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHhmMTQ5MmJmNCAvLyBtZXRob2QgInJlbW92ZUFjdGlvbih1aW50NjQpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIFJla2V5VG8KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBTZW5kZXIKICAgIGludGNfMyAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NTgtOTYyCiAgICAvLyByZW1vdmVBY3Rpb24oCiAgICAvLyAgIHdhbGxldDogQXBwbGljYXRpb24sCiAgICAvLyAgIHJla2V5QmFjazogYm9vbGVhbiwKICAgIC8vICAgYWN0aW9uQXBwSUQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsUGx1Z2luLmluaXRNZXRhW3JvdXRpbmddKCkgLT4gdm9pZDoKaW5pdE1ldGE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NzUtOTgzCiAgICAvLyBpbml0TWV0YSgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICB1c2VyOiBBY2NvdW50LAogICAgLy8gICBhdXRvbWF0ZWQ6IGJvb2xlYW4sCiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsCiAgICAvLyAgIE5GRDogdWludDY0LAogICAgLy8gICBha2l0YU5GVDogdWludDY0CiAgICAvLyApOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGRpZyA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2OAogICAgLy8gQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzU3BlbmRpbmdBZGRyZXNzKQogICAgYnl0ZWNfMiAvLyAic3BlbmRpbmdfYWRkcmVzcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjY2LTI2OQogICAgLy8gY29uc3QgW3NwZW5kaW5nQWRkcmVzc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIC8vICkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk4NgogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTg2CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTg2CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk4OC0xMDA0CiAgICAvLyBjb25zdCBpbXBhY3QgPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuaW5pdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlciwKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubWV0YSArIEltcGFjdE1ldGFNQlIKICAgIC8vICAgICB9KSwKICAgIC8vICAgICB1c2VyLAogICAgLy8gICAgIGF1dG9tYXRlZCwKICAgIC8vICAgICBzdWJzY3JpcHRpb25JbmRleCwKICAgIC8vICAgICBORkQsCiAgICAvLyAgICAgYWtpdGFORlQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk5NAogICAgLy8gcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTk1CiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubWV0YSArIEltcGFjdE1ldGFNQlIKICAgIHB1c2hieXRlcyAiIgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBwdXNoaW50IDU2IC8vIDU2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgcHVzaGludCAzMTcwMCAvLyAzMTcwMAogICAgKwogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTkyLTk5NgogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24oc29jaWFsKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubWV0YSArIEltcGFjdE1ldGFNQlIKICAgIC8vIH0pLAogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTg4LTEwMDQKICAgIC8vIGNvbnN0IGltcGFjdCA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5pbml0TWV0YT4oewogICAgLy8gICBzZW5kZXIsCiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgc2VuZGVyLAogICAgLy8gICAgICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHNvY2lhbCkuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5tZXRhICsgSW1wYWN0TWV0YU1CUgogICAgLy8gICAgIH0pLAogICAgLy8gICAgIHVzZXIsCiAgICAvLyAgICAgYXV0b21hdGVkLAogICAgLy8gICAgIHN1YnNjcmlwdGlvbkluZGV4LAogICAgLy8gICAgIE5GRCwKICAgIC8vICAgICBha2l0YU5GVAogICAgLy8gICBdLAogICAgLy8gICByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDAzCiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDcKICAgIHVuY292ZXIgOAogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk4OC0xMDA0CiAgICAvLyBjb25zdCBpbXBhY3QgPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUuaW5pdE1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHNlbmRlciwKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihzb2NpYWwpLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubWV0YSArIEltcGFjdE1ldGFNQlIKICAgIC8vICAgICB9KSwKICAgIC8vICAgICB1c2VyLAogICAgLy8gICAgIGF1dG9tYXRlZCwKICAgIC8vICAgICBzdWJzY3JpcHRpb25JbmRleCwKICAgIC8vICAgICBORkQsCiAgICAvLyAgICAgYWtpdGFORlQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDg1NjQzM2VhIC8vIG1ldGhvZCAiaW5pdE1ldGEocGF5LGFkZHJlc3MsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA3CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA1CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBSZWtleVRvCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIGl0eG5fZmllbGQgU2VuZGVyCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgZ2l0eG4gMSBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NzUtOTgzCiAgICAvLyBpbml0TWV0YSgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICB1c2VyOiBBY2NvdW50LAogICAgLy8gICBhdXRvbWF0ZWQ6IGJvb2xlYW4sCiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsCiAgICAvLyAgIE5GRDogdWludDY0LAogICAgLy8gICBha2l0YU5GVDogdWludDY0CiAgICAvLyApOiB1aW50NjQgewogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbFBsdWdpbi51cGRhdGVNZXRhW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlTWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMDktMTAxOAogICAgLy8gdXBkYXRlTWV0YSgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBmb2xsb3dHYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgYWRkcmVzc0dhdGVJRDogdWludDY0LAogICAgLy8gICBzdWJzY3JpcHRpb25JbmRleDogdWludDY0LAogICAgLy8gICBORkQ6IHVpbnQ2NCwKICAgIC8vICAgYWtpdGFORlQ6IHVpbnQ2NCwKICAgIC8vICAgZGVmYXVsdFBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBkaWcgNwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNjgKICAgIC8vIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c1NwZW5kaW5nQWRkcmVzcykKICAgIGJ5dGVjXzIgLy8gInNwZW5kaW5nX2FkZHJlc3MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2Ni0yNjkKICAgIC8vIGNvbnN0IFtzcGVuZGluZ0FkZHJlc3NCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNTcGVuZGluZ0FkZHJlc3MpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDIyCiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDIyCiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWNfMSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyMgogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDI0LTEwMzYKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS51cGRhdGVNZXRhPih7CiAgICAvLyAgIHNlbmRlciwKICAgIC8vICAgYXBwSWQ6IHNvY2lhbCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGZvbGxvd0dhdGVJRCwKICAgIC8vICAgICBhZGRyZXNzR2F0ZUlELAogICAgLy8gICAgIHN1YnNjcmlwdGlvbkluZGV4LAogICAgLy8gICAgIE5GRCwKICAgIC8vICAgICBha2l0YU5GVCwKICAgIC8vICAgICBkZWZhdWx0UGF5V2FsbElECiAgICAvLyAgIF0sCiAgICAvLyAgIHJla2V5VG86IHJla2V5QWRkcmVzcyhyZWtleUJhY2ssIHdhbGxldCkKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDM1CiAgICAvLyByZWtleVRvOiByZWtleUFkZHJlc3MocmVrZXlCYWNrLCB3YWxsZXQpCiAgICB1bmNvdmVyIDgKICAgIHVuY292ZXIgOQogICAgY2FsbHN1YiByZWtleUFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMjQtMTAzNgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnVwZGF0ZU1ldGE+KHsKICAgIC8vICAgc2VuZGVyLAogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgZm9sbG93R2F0ZUlELAogICAgLy8gICAgIGFkZHJlc3NHYXRlSUQsCiAgICAvLyAgICAgc3Vic2NyaXB0aW9uSW5kZXgsCiAgICAvLyAgICAgTkZELAogICAgLy8gICAgIGFraXRhTkZULAogICAgLy8gICAgIGRlZmF1bHRQYXlXYWxsSUQKICAgIC8vICAgXSwKICAgIC8vICAgcmVrZXlUbzogcmVrZXlBZGRyZXNzKHJla2V5QmFjaywgd2FsbGV0KQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDY5YTRlZjk3IC8vIG1ldGhvZCAidXBkYXRlTWV0YSh1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgOAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgUmVrZXlUbwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIFNlbmRlcgogICAgaW50Y18zIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMDktMTAxOAogICAgLy8gdXBkYXRlTWV0YSgKICAgIC8vICAgd2FsbGV0OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgcmVrZXlCYWNrOiBib29sZWFuLAogICAgLy8gICBmb2xsb3dHYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgYWRkcmVzc0dhdGVJRDogdWludDY0LAogICAgLy8gICBzdWJzY3JpcHRpb25JbmRleDogdWludDY0LAogICAgLy8gICBORkQ6IHVpbnQ2NCwKICAgIC8vICAgYWtpdGFORlQ6IHVpbnQ2NCwKICAgIC8vICAgZGVmYXVsdFBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBwdXNoYnl0ZXMgIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnJbcm91dGluZ10oKSAtPiB2b2lkOgptYnI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTQKICAgIC8vIG1icihyZWY6IGJ5dGVzKTogQWtpdGFTb2NpYWxNQlJEYXRhIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5wYXlXYWxsTWJyW3JvdXRpbmddKCkgLT4gdm9pZDoKcGF5V2FsbE1icjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMAogICAgLy8gcGF5V2FsbE1icihwYXl3YWxsOiBWaWV3UGF5V2FsbFZhbHVlKTogdWludDY0IHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMwogICAgLy8gUGF5V2FsbFBheU9wdGlvblNpemUgKiAocGF5d2FsbC5hZ2VudFBheUluZm8ubGVuZ3RoICsgcGF5d2FsbC51c2VyUGF5SW5mby5sZW5ndGgpCiAgICBkdXAKICAgIHB1c2hpbnQgMiAvLyAyCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDEKICAgIGxlbgogICAgZGlnIDIKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDIKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgdW5jb3ZlciAzCiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHN1YnN0cmluZzMKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMyLTM0CiAgICAvLyBCb3hDb3N0UGVyQnl0ZSAqICgKICAgIC8vICAgUGF5V2FsbFBheU9wdGlvblNpemUgKiAocGF5d2FsbC5hZ2VudFBheUluZm8ubGVuZ3RoICsgcGF5d2FsbC51c2VyUGF5SW5mby5sZW5ndGgpCiAgICAvLyApCiAgICBwdXNoaW50IDY4MDAgLy8gNjgwMAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMxCiAgICAvLyByZXR1cm4gTWluUGF5V2FsbE1CUiArICgKICAgIHB1c2hpbnQgNTIwMCAvLyA1MjAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzEtMzUKICAgIC8vIHJldHVybiBNaW5QYXlXYWxsTUJSICsgKAogICAgLy8gICBCb3hDb3N0UGVyQnl0ZSAqICgKICAgIC8vICAgICBQYXlXYWxsUGF5T3B0aW9uU2l6ZSAqIChwYXl3YWxsLmFnZW50UGF5SW5mby5sZW5ndGggKyBwYXl3YWxsLnVzZXJQYXlJbmZvLmxlbmd0aCkKICAgIC8vICAgKQogICAgLy8gKQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMwCiAgICAvLyBwYXlXYWxsTWJyKHBheXdhbGw6IFZpZXdQYXlXYWxsVmFsdWUpOiB1aW50NjQgewogICAgaXRvYgogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50c1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjUxCiAgICAvLyBjaGVja1RpcE1iclJlcXVpcmVtZW50cyhha2l0YURBTzogQXBwbGljYXRpb24sIGNyZWF0b3I6IEFjY291bnQsIHdhbGxldDogQXBwbGljYXRpb24pOiB0aXBNQlJJbmZvIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyKHJlZjogYnl0ZXMpIC0+IGJ5dGVzOgpzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE0CiAgICAvLyBtYnIocmVmOiBieXRlcyk6IEFraXRhU29jaWFsTUJSRGF0YSB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxOAogICAgLy8gcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgcHVzaGludCA0MDAgLy8gNDAwCiAgICAqCiAgICBwdXNoaW50IDQwMTAwIC8vIDQwMTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIHB1c2hieXRlcyAweDAwMDAwMDAwMDAwMDdiZDQwMDAwMDAwMDAwMDAzZDU0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxOQogICAgLy8gdm90ZXM6IFZvdGVzTUJSLAogICAgcHVzaGludCAxOTMwMCAvLyAxOTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBzd2FwCiAgICBkaWcgMQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoyMQogICAgLy8gcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICBwdXNoaW50IDIyMTAwIC8vIDIyMTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjIyCiAgICAvLyByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIHB1c2hpbnQgMTg5MDAgLy8gMTg5MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNS0yNwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZm9sbG93czogRm9sbG93c01CUiwKICAgIC8vICAgYmxvY2tzOiBCbG9ja3NNQlIsCiAgICAvLyAgIHBvc3RzOiBNaW5Qb3N0c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIHJlZi5sZW5ndGgpLAogICAgLy8gICB2b3RlczogVm90ZXNNQlIsCiAgICAvLyAgIHZvdGVsaXN0OiBWb3RlbGlzdE1CUiwKICAgIC8vICAgcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICAvLyAgIHJlYWN0aW9ubGlzdDogUmVhY3Rpb25saXN0TUJSLAogICAgLy8gICBtZXRhOiBNZXRhTUJSLAogICAgLy8gICBtb2RlcmF0b3JzOiBNb2RlcmF0b3JzTUJSLAogICAgLy8gICBiYW5uZWQ6IEJhbm5lZE1CUiwKICAgIC8vICAgYWN0aW9uczogQWN0aW9uc01CUgogICAgLy8gfQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjIzCiAgICAvLyBtZXRhOiBNZXRhTUJSLAogICAgcHVzaGludCA0NTMwMCAvLyA0NTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjI2CiAgICAvLyBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICBwdXNoaW50IDI5NzAwIC8vIDI5NzAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIGNvbmNhdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKGFraXRhREFPOiB1aW50NjQsIGNyZWF0b3I6IGJ5dGVzLCB3YWxsZXQ6IHVpbnQ2NCkgLT4gYnl0ZXM6CnNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MQogICAgLy8gY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBjcmVhdG9yOiBBY2NvdW50LCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogdGlwTUJSSW5mbyB7CiAgICBwcm90byAzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBmcmFtZV9kaWcgLTMKICAgIGJ5dGVjIDQgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MgogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKGFraXRhREFPKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTQKICAgIC8vIGlmICghY3JlYXRvci5pc09wdGVkSW4oYWt0YSkgJiYgd2FsbGV0LmlkICE9PSAwKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIHN3YXAKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBibnogc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzX2FmdGVyX2lmX2Vsc2VANQogICAgZnJhbWVfZGlnIC0xCiAgICBieiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzktNDgKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfY2FuQ2FsbD4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGdldFBsdWdpbkFwcExpc3QoYWtpdGFEQU8pLm9wdGluLAogICAgLy8gICAgIHRydWUsCiAgICAvLyAgICAgR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICAgICcnLAogICAgLy8gICAgIG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBPcHRJblBsdWdpbi5wcm90b3R5cGUub3B0SW4+KCkKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTMKICAgIHB1c2hieXRlcyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjQyCiAgICAvLyBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIGV4dHJhY3QgMCA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDQKICAgIC8vIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjM5LTQ4CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2NhbkNhbGw+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIC8vICAgICAnJywKICAgIC8vICAgICBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPigpCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHg0NzI3YWYyMSAvLyBtZXRob2QgImFyYzU4X2NhbkNhbGwodWludDY0LGJvb2wsYWRkcmVzcyxzdHJpbmcsYnl0ZVs0XSlib29sIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDMKICAgIC8vIHRydWUsCiAgICBwdXNoYnl0ZXMgMHg4MAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDUKICAgIC8vICcnLAogICAgcHVzaGJ5dGVzIDB4MDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo0NgogICAgLy8gbWV0aG9kU2VsZWN0b3I8dHlwZW9mIE9wdEluUGx1Z2luLnByb3RvdHlwZS5vcHRJbj4oKQogICAgcHVzaGJ5dGVzIDB4NjgzNWUzYmMgLy8gbWV0aG9kICJvcHRJbih1aW50NjQsYm9vbCx1aW50NjRbXSxwYXkpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjM5LTQ4CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2NhbkNhbGw+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIC8vICAgICAnJywKICAgIC8vICAgICBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPigpCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpbnRjXzMgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1NgogICAgLy8gaWYgKGNhbkNhbGxBcmM1OE9wdEluKSB7CiAgICBieiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTkKICAgIC8vIGFyYzU4OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGdsb2JhbCBBc3NldE9wdEluTWluQmFsYW5jZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjU3LTYwCiAgICAvLyByZXR1cm4gewogICAgLy8gICB0eXBlOiBUaXBTZW5kVHlwZUFSQzU4LAogICAgLy8gICBhcmM1ODogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyB9CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTgKICAgIC8vIHR5cGU6IFRpcFNlbmRUeXBlQVJDNTgsCiAgICBieXRlYyA2IC8vIDB4MTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1Ny02MAogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgdHlwZTogVGlwU2VuZFR5cGVBUkM1OCwKICAgIC8vICAgYXJjNTg6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgLy8gfQogICAgc3dhcAogICAgY29uY2F0CiAgICByZXRzdWIKCnNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NjQtNjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IFRpcFNlbmRUeXBlRGlyZWN0LAogICAgLy8gICBhcmM1ODogMAogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4MGEwMDAwMDAwMDAwMDAwMDAwCiAgICByZXRzdWIK", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAEIBiYLCWFraXRhX2RhbwNzYWwQc3BlbmRpbmdfYWRkcmVzcwQVH3x1DGFraXRhX2Fzc2V0cwtzb2NpYWxfZmVlcwEUBDV1LPADYWFsBEOSJlUEmEuu9TEZFEQxGEEA44IfBBZZwacESn61TQTK+OcTBMGYRZ0EW0XjawRmtyliBHWuQKQE7FvOsQQ1xuOWBF+qOoMEf9TKtwQ/2F9NBLRlSfoEnDCs7QS+yGw0BJ9ZqXAEqnZWAQSQkdylBEk+kI8EDYtncQQbLQjiBGjo23gEJUmCKQRc9+ClBKopBIsEdiPvMwQz6SyUBIVN7eAEkubdOwShNKJ4BDRBdfA2GgCOHwCQAXMCKgPkBWAHBAhqCZgK7QxzDboOFA7hD0gPlg/9EEsQtBEDEXgRxxIWEmUS2hMoE9wUZQABFIgUohTRACNDgASIyUD4NhoAjgEATgCKAQGL/4ASY29udHJvbGxlZF9hZGRyZXNzZUiL/yplSIv/gAhyZWZlcnJlcmVIi/9yCERPA1BPAlBMUImKAgGL/kAAAzIDiYv/cghEiTYaAUkiWYECCEsBFRJEVwIANhoCSRUkEkQXNhoDFSQSRIAHdmVyc2lvbk8CZyhMZyNDNhoBSRUkEkQXNhoCSRUjEkQiUzYaA0kVJBJENhoESRWBGBJENhoFSRWBJBJENhoGSRUkEkQ2GgdJFSMSRDYaCEkVJBJESwcqZUhMIihlRCllSCJbSwWIFAxJgRBbSwGBGFtPAoEgW04CCAhLAXIIRCIoZURJJwRlSCJbTCcFZUgiW0sEcghEsU8EsghPA7IHSwWyACOyECKyAbayFLISshFLArIAgQSyECKyAbZPCE8JiP8JgARxBbutshpPCLIaTweyGk8GshpPBbIaTwSyGk8CshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRWBJBJENhoESRWBIBJESwMqZUhMIihlRCllSCJbSwOIE0lJgRBbSwGBGFtPAoEgW04CCAiBkGcISwFyCEQiKGVESScEZUgiW0wnBWVIIltLBHIIRLFPBLIITwOyB0sFsgAjshAisgG2shSyErIRSwKyAIEEshAisgG2TwRPBYj+QoAEukv3lLIaTwSyGk8CshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBdJNhoCSRUjEkQiU0w2GgNJTgIVJBJENhoESU4CFYEYEkQ2GgVJTgJJFYEkEkQ2GgZJTgNJIlmBAghLARUSRFcCADYaB0lOBBUjEkQ2GghJTgQVJBJENhoJTgM2GgpJTgQVIxJENhoLSU4EFSQSRE8CiP1rSVcgIE4DV0AgSU4DIihlREknCGVIgShbTgQpZUgiW0lOBE8DiBIoSYEQW0sBgRhbTwKBIFtOAggITgOxSwIVgSASRCIWJweyGk8DshqyGrIYsgAlshAisgGztD5JVwQASwFXAAQrEkRJIllLARVSSU4DVwAgTFcGQiNbIihlRE4CiBIbSU4CVwABJwYSQQAFSwEjWwhLA0lyCEQiKGVESScEZUgiW0wnBWVIJFtLA3IIREsHVygIsU8GsghPBLIHSwlJsgAjshAisgG2TwOyEk8DshFPArIUSbIAgQSyECKyAbYnCbIaSwiyGkyyGksKshpLBbIYSbIAJbIQIrIBtksRSxOI/KCABNXI57iyGksRshpLELIaSw+yGksOshpLDbIaSwyyGksKshpLCbIasiCyALIYJbIQIrIBsyNDNhoBSRUkEkQXSTYaAkkVIxJEIlNMNhoDSU4CFSQSRDYaBElOAhWBGBJENhoFSU4CSRWBJBJENhoGSU4DSSJZgQIISwEVEkRXAgA2GgdJTgQVIxJENhoISU4EFSQSRDYaCUlOBBUjEkQ2GgpJTgQVJBJETwIqZUhJTgMiKGVEKWVIIltJTgRPA4gQhkmBEFtLAYEYW08CgSBbTgIICE4DsUsCFYEgEkQiFicHshpPA7IashqyGLIAJbIQIrIBs7Q+SVcEAEsBVwAEKxJESSJZSwEVUlcAIExXBkIjWyIoZUROAogQfElOAlcAAScGEkEABUsBI1sISwJJcghEIihlREknBGVIIltMJwVlSCRbSwNyCESxTwWyCE8DsgdLBkmyACOyECKyAbZPArISTwKyEUyyFEmyAIEEshAisgG2Sw1LD4j7JIAEL/wxI7IaSw2yGksMshpLC7IaSwqyGksJshpLCLIaSweyGksGshqyILIAshglshAisgGzI0M2GgFJFSQSRBdJNhoCSRUjEkQiU0w2GgNJTgJJFYEkEkQ2GgRJTgNJFYEgEkQ2GgVOA08CiPp6SVcgIE4DV0AgSU4CTgMiKGVESScIZUiBKFtOBCllSCJbSU4ETwOIDzVJgRBbSwGBGFtPAoEgW04CCAhOA7EnCrIaTLIaSbIYSwGyACWyECKyAbO0PklXBABMVwAEKxJESYE7WUsBFVJXAgBJFSJLAQ8iSwJPAk2BIEsCD4EgTwNPAk1SSRWBIBJEsSIWJweyGkyyGrIashiyACWyECKyAbO0PklXBABLAVcABCsSREkiWUsBFVJJTgNXACBMVwZCI1siKGVETgKIDuNJTgJXAAEnBhJBAAVLASNbCEsDSXIIRCIoZURJJwRlSCJbTCcFZUgkW0sDcghESwdXKAixTwayCE8EsgdLCUmyACOyECKyAbZPA7ISTwOyEU8CshRJsgCBBLIQIrIBticJshpLCLIaTLIaSwiyGksFshhJsgAlshAisgG2SwtLDYj5aIAEcnJPlrIaSwuyGksKshqyILIAshglshAisgGzI0M2GgFJFSQSRBdJNhoCSRUjEkQiU0w2GgNJTgJJFYEkEkQ2GgRJTgNJFYEgEkRPAiplSElOAk4DIihlRCllSCJbSU4ETwOIDalJgRBbSwGBGFtPAoEgW04CCAhOA7EnCrIaTLIaSbIYSwGyACWyECKyAbO0PklXBABMVwAEKxJESYE7WUsBFVJXAgBJFSJLAQ8iSwJPAk2BIEsCD4EgTwNPAk1SSRWBIBJEsSIWJweyGkyyGrIashiyACWyECKyAbO0PklXBABLAVcABCsSREkiWUsBFVJXACBMVwZCI1siKGVETgKIDVpJTgJXAAEnBhJBAAVLASNbCEsCSXIIRCIoZURJJwRlSCJbTCcFZUgkW0sDcghEsU8FsghPA7IHSwZJsgAjshAisgG2TwKyEk8CshFMshRJsgCBBLIQIrIBtksHSwmI+AKABByZ/p6yGksHshpLBrIasiCyALIYJbIQIrIBsyNDIjYaAUkVJBJEF0k2GgJJFSMSRCJTTDYaA0lOAkkiWYECCEsBFRJEVwIATDYaBElOAhUjEkQ2GgVJTgJJFSMSRCJTTCplSEwiKGVEKWVIIltMgACIDDWBIFtMQQBfsUsFSRWBIBJEIhYnB7IaTLIashpLAbIYSwKyACWyECKyAbO0PklXBABLAVcABCsSREkiWUsBFVJXACBMVwZCI1siKGVETgKIDDRJRQtXAAEnBhJBAAlLCSNbSwEIRQFLAUlyCEQiKGVESScEZUgiW0wnBWVIJFtLA3IIRLFLBbIITwOyB0sGSbIAI7IQIrIBtk8CshJPArIRTLIUSbIAgQSyECKyAbZLCUsLiPbYgAQC6SYxshpLCbIaSweyGksGshqyILIAshglshAisgGzI0MigAA2GgFJFSQSRBdJNhoCSRUjEkQiU0w2GgNJTgJJFYEgEkQ2GgRJTgNJFSMSRCJTTwIqZUhJTgMiKGVESSllSCJbSU4FsYAE9OpQ5LIaTwSyGkmyGE8CsgAlshAisgGztD5JVwQATFcABCsSREkVgQkSRIFAU04DSXIITE4ERCJOA0wnBGVIIltOAnIITE4CRCJMQQBqIihlRCcFZUgkW0UNSwVAAFWxIhYnB7IaSwqyGrIaSwayGEsHsgAlshAisgGztD5JVwQASwFXAAQrEkRJIllLARVSVwAgTFcGQiNbIihlRE4CiArCSUUPVwABJwYSQQAGSw0jW0UESwxFAbFLA7IISwSyB0sHSbIAI7IQIrIBtksBshJLA7IRSwKyFEmyAIEEshAisgG2SwtLDYj1gYAEhPpLXrIaSwuyGksKshqyIEsHshiyACWyECKyAbMjQyJJgAA2GgFJFSQSRBdJNhoCSRUjEkQiU0w2GgNJTgJJIlmBAghLARUSRFcCADYaBElOAxUjEkQ2GgVJTgNJFSQSRDYaBk4DTwKI9NhJVyAgTgNXQCBJTgMiKGVESScIZUiBKFtOBCllSCJbSU4EsUsDFYEgEkQnB7IaTwOyGk8CshqyGLIAJbIQIrIBs7Q+RwJXBABJTwJXAAQrEkSBoARTgACICWJJgShbTgKBMFtMQQDLRQ5LAUkiWUsBFVJJRRFXACBLA1cGQiNbIihlRE4CiAmESUUQVwABJwYSQQAJSw4jW0sOCEUOSwNJcghEIihlREknBGVIIltMJwVlSCRbSwNyCERLFFcoCLFLE7IITwSyB0sKSbIAI7IQIrIBtk8DshJPA7IRTwKyFEmyAIEEshAisgG2JwmyGksJshpMshpLCbIaSwayGEmyACWyECKyAbZLDUsPiPQFgARufULCshpLDbIaSwyyGksLshqyILIAshglshAisgGzI0NLAQhFDkL/LyKAADYaAUkVJBJEF0k2GgJJFSMSRCJTTDYaA0lOAkkiWYECCEsBFRJEVwIANhoESU4DFSMSRDYaBUlOA0kVJBJETwIqZUhJTgMiKGVEKWVIIltJTgSxSwMVgSASRCcHshpPA7IaTwKyGrIYsgAlshAisgGztD5HAlcEAElPAlcABCsSRIGgBFOAAIgH9UmBKFtOAoEwW0xBAKVFC0sBSSJZSwEVUlcAIEsDVwZCI1siKGVETgKICBpJRQ1XAAEnBhJBAAlLCyNbSwsIRQtLA0lyCEQiKGVESScEZUgiW0wnBWVIJFtLA3IIRLFLD7IITwOyB0sISbIAI7IQIrIBtk8CshJPArIRTLIUSbIAgQSyECKyAbZLCksMiPK+gATQ5bGNshpLCrIaSwmyGksIshqyILIAshglshAisgGzI0NLAQhFC0L/VTYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkQ2GgRJFSQSREsDKmVITCIoZUQpZUgiW7FPBE8FiPJYgARuW3cCshpPBLIaTwKyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkQ2GgRLA4jx2UlXICBMV0AgIihlREknCGVIgShbTCllSEkiW0wkW7GABHOepwuyGksGshpMshhLArIAJbIQIrIBs7Q+SVcEAEsBVwAEKxJEFYFKEkRXNghLAXIIRIAAiAZkIluxsgiyB0sDsgAjshAisgG2JwmyGk8EshqyGk8DshpMshhLAbIAJbIQIrIBtk8DTwSI8YeABIZnVJSyGk8DshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRWBIBJESwIqZUgiKGVEKWVIJFtJcghEgACIBeEiW7GyCLIHSwGyACOyECKyAbZPA08EiPEggARLb5B/shpPA7IasiCyGLIAJbIQIrIBsyNDNhoBSRUkEkQXNhoCSRUjEkQiUzYaA0kVgSASREsCKmVITCIoZUQpZUgkW7FPA08EiPDSgAQWGzp6shpPArIasiCyGLIAJbIQIrIBsyNDNhoBSRUkEkQXNhoCSRUjEkQiUzYaA0kVgSASREsCKmVIIihlRCllSCRbSXIIRIAAiAUsJFuxsgiyB0sBsgAjshAisgG2TwNPBIjwa4AEtZyKVLIaTwOyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkRLAiplSEwiKGVEKWVIJFuxTwNPBIjwHYAEruuzeLIaTwKyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkRLAiplSCIoZUQpZUiBGFtJcghEgACIBHaBQFuxsgiyB0sBsgAjshAisgG2TwNPBIjvtIAEd2YsjrIaTwOyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkRLAiplSEwiKGVEKWVIgRhbsU8DTwSI72WABAPjqyKyGk8CshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRWBIBJENhoESRUkEkRLAyplSCIoZUQpZUiBGFtJcghEgACIA7aBSFuxsgiyB0sBsgAjshAisgG2TwRPBYju9IAEjrwZtbIaTwSyGk8DshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRWBIBJESwIqZUhMIihlRCllSIEYW7FPA08EiO6hgARh3NLvshpPArIasiCyGLIAJbIQIrIBsyNDNhoBSRUkEkQXNhoCSRUjEkQiUzYaA0kVgSASREsCKmVITCIoZUQpZUiBGFuxTwNPBIjuUoAEeWDqdrIaTwKyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFYEgEkRLAiplSEwiKGVEKWVIgRhbsU8DTwSI7gOABKDSMh2yGk8CshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRUkEkQ2GgRJFYEkEkRLAyplSCIoZUQpZUiBGFtJcghEgACIAlSBUFuxsgiyB0sBsgAjshAisgG2TwRPBYjtkoAE2QZxtrIaTwSyGk8DshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRUkEkRLAiplSEwiKGVEKWVIgRhbsU8DTwSI7UCABPFJK/SyGk8CshqyILIYsgAlshAisgGzI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRWBIBJENhoESRUjEkQ2GgVJFSQSRDYaBkkVJBJENhoHSRUkEkRLBiplSCIoZUQpZUgiW7FJcghEgACIAXmBOFuB1PcBCLIIsgdLAbIAI7IQIrIBtk8HTwiI7LOABIVkM+qyGk8HshpPBrIaTwWyGk8EshpPA7IasiCyGLIAJbIQIrIBs7cBPklXBABMVwAEKxJESRUkEkQrTFCwI0M2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRUkEkQ2GgRJFSQSRDYaBUkVJBJENhoGSRUkEkQ2GgdJFSQSRDYaCEkVJBJESwcqZUhMIihlRCllSCJbsU8ITwmI7BeABGmk75eyGk8IshpPB7IaTwayGk8FshpPBLIaTwKyGrIgshiyACWyECKyAbMjQzYaAUkVJBJEFzEAIihlRIAGd2FsbGV0ZUhyCEQSRChMZyNDNhoBSSJZgQIISwEVEkRXAgCIAFkrTFCwI0M2GgFJgQJZSwEVSwJLAk8CUiJZSwIiWU8DTE8DUiJZCIGQNQuB0CgIFitMULAjQzYaAUkVJBJEFzYaAkkVgSASRDYaA0kVJBJEF4gAVitMULAjQ4oBAYv/FYGQAwuBpLkCCBaAEAAAAAAAAHvUAAAAAAAAPVRMUIHklgEWTEsBUExQgdSsARZQgdSTARZMSwFQgfThAhZQSwFQTFCBhOgBFlCJigMBi/0nBGVIIluL/kxwAEUBQABei/9BAFmxi/2AA3BhbGVIVwAIMgOABEcnryGyGkyyGoABgLIashqAAgAAshqABGg147yyGov/shglshAisgGztD5JVwQATFcABCsSREkVIxJEIlNBAAgyEBYnBkxQiYAJCgAAAAAAAAAAiQ==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
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
 * Converts the ABI tuple representation of a AkitaSocialMBRData to the struct representation
 */
function AkitaSocialMbrDataFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.AkitaSocialMBRData, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a ViewPayWallValue to the struct representation
 */
function ViewPayWallValueFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.ViewPayWallValue, exports.APP_SPEC.structs);
}
/**
 * Converts the ABI tuple representation of a tipMBRInfo to the struct representation
 */
function TipMbrInfoFromTuple(abiTuple) {
    return (0, app_arc56_1.getABIStructFromABITuple)(abiTuple, exports.APP_SPEC.structs.tipMBRInfo, exports.APP_SPEC.structs);
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the AkitaSocialPlugin smart contract
 */
class AkitaSocialPluginParamsFactory {
    /**
     * Gets available create ABI call param factories
     */
    static get create() {
        return {
            _resolveByMethod(params) {
                switch (params.method) {
                    case 'create':
                    case 'create(string,uint64,uint64)void':
                        return AkitaSocialPluginParamsFactory.create.create(params);
                }
                throw new Error(`Unknown ' + verb + ' method`);
            },
            /**
             * Constructs create ABI call params for the AkitaSocialPlugin smart contract using the create(string,uint64,uint64)void ABI method
             *
             * @param params Parameters for the call
             * @returns An `AppClientMethodCallParams` object for the call
             */
            create(params) {
                return {
                    ...params,
                    method: 'create(string,uint64,uint64)void',
                    args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.akitaDao, params.args.escrow],
                };
            },
        };
    }
    /**
     * Constructs a no op call for the post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static post(params) {
        return {
            ...params,
            method: 'post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.timestamp, params.args.nonce, params.args.cid, params.args.gateId, params.args.usePayWall, params.args.payWallId],
        };
    }
    /**
     * Constructs a no op call for the editPost(uint64,bool,byte[36],byte[32])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static editPost(params) {
        return {
            ...params,
            method: 'editPost(uint64,bool,byte[36],byte[32])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.cid, params.args.amendment],
        };
    }
    /**
     * Constructs a no op call for the gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static gatedReply(params) {
        return {
            ...params,
            method: 'gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.timestamp, params.args.nonce, params.args.cid, params.args.ref, params.args.type, params.args.gateId, params.args.args, params.args.usePayWall, params.args.payWallId],
        };
    }
    /**
     * Constructs a no op call for the reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static reply(params) {
        return {
            ...params,
            method: 'reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.timestamp, params.args.nonce, params.args.cid, params.args.ref, params.args.type, params.args.gateId, params.args.usePayWall, params.args.payWallId],
        };
    }
    /**
     * Constructs a no op call for the gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static gatedEditReply(params) {
        return {
            ...params,
            method: 'gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.cid, params.args.amendment, params.args.args],
        };
    }
    /**
     * Constructs a no op call for the editReply(uint64,bool,byte[36],byte[32])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static editReply(params) {
        return {
            ...params,
            method: 'editReply(uint64,bool,byte[36],byte[32])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.cid, params.args.amendment],
        };
    }
    /**
     * Constructs a no op call for the vote(uint64,bool,byte[],uint8,bool)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static vote(params) {
        return {
            ...params,
            method: 'vote(uint64,bool,byte[],uint8,bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref, params.args.type, params.args.isUp],
        };
    }
    /**
     * Constructs a no op call for the editVote(uint64,bool,byte[32],bool)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static editVote(params) {
        return {
            ...params,
            method: 'editVote(uint64,bool,byte[32],bool)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref, params.args.flip],
        };
    }
    /**
     * Constructs a no op call for the gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static gatedReact(params) {
        return {
            ...params,
            method: 'gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref, params.args.type, params.args.nft, params.args.args],
        };
    }
    /**
     * Constructs a no op call for the react(uint64,bool,byte[],uint8,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static react(params) {
        return {
            ...params,
            method: 'react(uint64,bool,byte[],uint8,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref, params.args.type, params.args.nft],
        };
    }
    /**
     * Constructs a no op call for the deleteReaction(uint64,bool,byte[32],uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static deleteReaction(params) {
        return {
            ...params,
            method: 'deleteReaction(uint64,bool,byte[32],uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref, params.args.nft],
        };
    }
    /**
     * Constructs a no op call for the gatedFollow(uint64,bool,address,byte[][])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static gatedFollow(params) {
        return {
            ...params,
            method: 'gatedFollow(uint64,bool,address,byte[][])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address, params.args.args],
        };
    }
    /**
     * Constructs a no op call for the follow(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static follow(params) {
        return {
            ...params,
            method: 'follow(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the unfollow(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static unfollow(params) {
        return {
            ...params,
            method: 'unfollow(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the block(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static block(params) {
        return {
            ...params,
            method: 'block(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the unblock(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static unblock(params) {
        return {
            ...params,
            method: 'unblock(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the addModerator(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static addModerator(params) {
        return {
            ...params,
            method: 'addModerator(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the removeModerator(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static removeModerator(params) {
        return {
            ...params,
            method: 'removeModerator(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the ban(uint64,bool,address,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static ban(params) {
        return {
            ...params,
            method: 'ban(uint64,bool,address,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address, params.args.expiration],
        };
    }
    /**
     * Constructs a no op call for the flagPost(uint64,bool,byte[32])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static flagPost(params) {
        return {
            ...params,
            method: 'flagPost(uint64,bool,byte[32])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref],
        };
    }
    /**
     * Constructs a no op call for the unflagPost(uint64,bool,byte[32])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static unflagPost(params) {
        return {
            ...params,
            method: 'unflagPost(uint64,bool,byte[32])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.ref],
        };
    }
    /**
     * Constructs a no op call for the unban(uint64,bool,address)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static unban(params) {
        return {
            ...params,
            method: 'unban(uint64,bool,address)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.address],
        };
    }
    /**
     * Constructs a no op call for the addAction(uint64,bool,uint64,byte[36])void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static addAction(params) {
        return {
            ...params,
            method: 'addAction(uint64,bool,uint64,byte[36])void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.actionAppId, params.args.content],
        };
    }
    /**
     * Constructs a no op call for the removeAction(uint64,bool,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static removeAction(params) {
        return {
            ...params,
            method: 'removeAction(uint64,bool,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.actionAppId],
        };
    }
    /**
     * Constructs a no op call for the initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static initMeta(params) {
        return {
            ...params,
            method: 'initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.user, params.args.automated, params.args.subscriptionIndex, params.args.nfd, params.args.akitaNft],
        };
    }
    /**
     * Constructs a no op call for the updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static updateMeta(params) {
        return {
            ...params,
            method: 'updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void',
            args: Array.isArray(params.args) ? params.args : [params.args.wallet, params.args.rekeyBack, params.args.followGateId, params.args.addressGateId, params.args.subscriptionIndex, params.args.nfd, params.args.akitaNft, params.args.defaultPayWallId],
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
    /**
     * Constructs a no op call for the mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static mbr(params) {
        return {
            ...params,
            method: 'mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.ref],
        };
    }
    /**
     * Constructs a no op call for the payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static payWallMbr(params) {
        return {
            ...params,
            method: 'payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64',
            args: Array.isArray(params.args) ? params.args : [params.args.paywall],
        };
    }
    /**
     * Constructs a no op call for the checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64) ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static checkTipMbrRequirements(params) {
        return {
            ...params,
            method: 'checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)',
            args: Array.isArray(params.args) ? params.args : [params.args.akitaDao, params.args.creator, params.args.wallet],
        };
    }
}
exports.AkitaSocialPluginParamsFactory = AkitaSocialPluginParamsFactory;
/**
 * A factory to create and deploy one or more instance of the AkitaSocialPlugin smart contract and to create one or more app clients to interact with those (or other) app instances
 */
class AkitaSocialPluginFactory {
    /**
     * Creates a new instance of `AkitaSocialPluginFactory`
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
                 * Creates a new instance of the AkitaSocialPlugin smart contract using the create(string,uint64,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create params
                 */
                create: (params) => {
                    return this.appFactory.params.create(AkitaSocialPluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the AkitaSocialPlugin smart contract using the create(string,uint64,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create transaction
                 */
                create: (params) => {
                    return this.appFactory.createTransaction.create(AkitaSocialPluginParamsFactory.create.create(params));
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
                 * Creates a new instance of the AkitaSocialPlugin smart contract using an ABI method call using the create(string,uint64,uint64)void ABI method.
                 *
                 * @param params The params for the smart contract call
                 * @returns The create result
                 */
                create: async (params) => {
                    const result = await this.appFactory.send.create(AkitaSocialPluginParamsFactory.create.create(params));
                    return { result: { ...result.result, return: result.result.return }, appClient: new AkitaSocialPluginClient(result.appClient) };
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
        return new AkitaSocialPluginClient(this.appFactory.getAppClientById(params));
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
        return new AkitaSocialPluginClient(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the AkitaSocialPlugin smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
            createParams: params.createParams?.method ? AkitaSocialPluginParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : undefined,
        });
        return { result: result.result, appClient: new AkitaSocialPluginClient(result.appClient) };
    }
}
exports.AkitaSocialPluginFactory = AkitaSocialPluginFactory;
/**
 * A client to make calls to the AkitaSocialPlugin smart contract
 */
class AkitaSocialPluginClient {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaSocialPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            post: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.post(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editPost(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            editPost: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.editPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            gatedReply: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.gatedReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            reply: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.reply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            gatedEditReply: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.gatedEditReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editReply(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            editReply: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.editReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `vote(uint64,bool,byte[],uint8,bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            vote: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.vote(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editVote(uint64,bool,byte[32],bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            editVote: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.editVote(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            gatedReact: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.gatedReact(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `react(uint64,bool,byte[],uint8,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            react: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.react(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `deleteReaction(uint64,bool,byte[32],uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            deleteReaction: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.deleteReaction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedFollow(uint64,bool,address,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            gatedFollow: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.gatedFollow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `follow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            follow: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.follow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unfollow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            unfollow: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.unfollow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `block(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            block: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.block(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unblock(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            unblock: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.unblock(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            addModerator: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.addModerator(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            removeModerator: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.removeModerator(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `ban(uint64,bool,address,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            ban: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.ban(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `flagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            flagPost: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.flagPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unflagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            unflagPost: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.unflagPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unban(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            unban: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.unban(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addAction(uint64,bool,uint64,byte[36])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            addAction: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.addAction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeAction(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            removeAction: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.removeAction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            initMeta: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.initMeta(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateMeta: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.updateMeta(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            updateAkitaDao: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.opUp(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            mbr: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            payWallMbr: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.payWallMbr(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            checkTipMbrRequirements: (params) => {
                return this.appClient.params.call(AkitaSocialPluginParamsFactory.checkTipMbrRequirements(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaSocialPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            post: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.post(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editPost(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            editPost: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.editPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            gatedReply: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.gatedReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            reply: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.reply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            gatedEditReply: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.gatedEditReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editReply(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            editReply: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.editReply(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `vote(uint64,bool,byte[],uint8,bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            vote: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.vote(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editVote(uint64,bool,byte[32],bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            editVote: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.editVote(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            gatedReact: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.gatedReact(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `react(uint64,bool,byte[],uint8,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            react: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.react(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `deleteReaction(uint64,bool,byte[32],uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            deleteReaction: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.deleteReaction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedFollow(uint64,bool,address,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            gatedFollow: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.gatedFollow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `follow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            follow: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.follow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unfollow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            unfollow: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.unfollow(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `block(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            block: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.block(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unblock(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            unblock: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.unblock(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            addModerator: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.addModerator(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            removeModerator: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.removeModerator(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `ban(uint64,bool,address,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            ban: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.ban(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `flagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            flagPost: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.flagPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unflagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            unflagPost: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.unflagPost(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unban(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            unban: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.unban(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addAction(uint64,bool,uint64,byte[36])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            addAction: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.addAction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeAction(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            removeAction: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.removeAction(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            initMeta: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.initMeta(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateMeta: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.updateMeta(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            updateAkitaDao: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.updateAkitaDao(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            opUp: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.opUp(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            mbr: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.mbr(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            payWallMbr: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.payWallMbr(params));
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            checkTipMbrRequirements: (params) => {
                return this.appClient.createTransaction.call(AkitaSocialPluginParamsFactory.checkTipMbrRequirements(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the AkitaSocialPlugin smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            post: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.post(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editPost(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            editPost: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.editPost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            gatedReply: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.gatedReply(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            reply: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.reply(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            gatedEditReply: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.gatedEditReply(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editReply(uint64,bool,byte[36],byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            editReply: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.editReply(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `vote(uint64,bool,byte[],uint8,bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            vote: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.vote(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `editVote(uint64,bool,byte[32],bool)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            editVote: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.editVote(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            gatedReact: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.gatedReact(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `react(uint64,bool,byte[],uint8,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            react: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.react(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `deleteReaction(uint64,bool,byte[32],uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            deleteReaction: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.deleteReaction(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `gatedFollow(uint64,bool,address,byte[][])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            gatedFollow: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.gatedFollow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `follow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            follow: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.follow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unfollow(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            unfollow: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.unfollow(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `block(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            block: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.block(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unblock(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            unblock: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.unblock(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            addModerator: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.addModerator(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeModerator(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            removeModerator: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.removeModerator(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `ban(uint64,bool,address,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            ban: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.ban(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `flagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            flagPost: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.flagPost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unflagPost(uint64,bool,byte[32])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            unflagPost: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.unflagPost(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `unban(uint64,bool,address)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            unban: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.unban(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `addAction(uint64,bool,uint64,byte[36])void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            addAction: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.addAction(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `removeAction(uint64,bool,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            removeAction: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.removeAction(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            initMeta: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.initMeta(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateMeta: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.updateMeta(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `updateAkitaDAO(uint64)void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            updateAkitaDao: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.updateAkitaDao(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `opUp()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            opUp: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.opUp(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            mbr: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.mbr(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            payWallMbr: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.payWallMbr(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the AkitaSocialPlugin smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            checkTipMbrRequirements: async (params) => {
                const result = await this.appClient.send.call(AkitaSocialPluginParamsFactory.checkTipMbrRequirements(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current AkitaSocialPlugin app
         */
        this.state = {
            /**
             * Methods to access global state for the current AkitaSocialPlugin app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        version: result.version,
                        akitaDao: result.akitaDAO,
                    };
                },
                /**
                 * Get the current value of the version key in global state
                 */
                version: async () => { return (await this.appClient.state.global.getValue("version")); },
                /**
                 * Get the current value of the akitaDAO key in global state
                 */
                akitaDao: async () => { return (await this.appClient.state.global.getValue("akitaDAO")); },
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
     * Returns a new `AkitaSocialPluginClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new AkitaSocialPluginClient(await app_client_1.AppClient.fromCreatorAndName({ ...params, appSpec: exports.APP_SPEC }));
    }
    /**
     * Returns an `AkitaSocialPluginClient` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new AkitaSocialPluginClient(await app_client_1.AppClient.fromNetwork({ ...params, appSpec: exports.APP_SPEC }));
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
        return new AkitaSocialPluginClient(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a post(uint64,bool,uint64,byte[24],byte[36],uint64,bool,uint64)void method call against the AkitaSocialPlugin contract
             */
            post(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.post(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a editPost(uint64,bool,byte[36],byte[32])void method call against the AkitaSocialPlugin contract
             */
            editPost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editPost(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a gatedReply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,byte[][],bool,uint64)void method call against the AkitaSocialPlugin contract
             */
            gatedReply(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedReply(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a reply(uint64,bool,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void method call against the AkitaSocialPlugin contract
             */
            reply(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.reply(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a gatedEditReply(uint64,bool,byte[36],byte[32],byte[][])void method call against the AkitaSocialPlugin contract
             */
            gatedEditReply(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedEditReply(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a editReply(uint64,bool,byte[36],byte[32])void method call against the AkitaSocialPlugin contract
             */
            editReply(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editReply(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a vote(uint64,bool,byte[],uint8,bool)void method call against the AkitaSocialPlugin contract
             */
            vote(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.vote(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a editVote(uint64,bool,byte[32],bool)void method call against the AkitaSocialPlugin contract
             */
            editVote(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editVote(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a gatedReact(uint64,bool,byte[],uint8,uint64,byte[][])void method call against the AkitaSocialPlugin contract
             */
            gatedReact(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedReact(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a react(uint64,bool,byte[],uint8,uint64)void method call against the AkitaSocialPlugin contract
             */
            react(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.react(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a deleteReaction(uint64,bool,byte[32],uint64)void method call against the AkitaSocialPlugin contract
             */
            deleteReaction(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteReaction(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a gatedFollow(uint64,bool,address,byte[][])void method call against the AkitaSocialPlugin contract
             */
            gatedFollow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedFollow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a follow(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            follow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.follow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a unfollow(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            unfollow(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unfollow(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a block(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            block(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.block(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a unblock(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            unblock(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unblock(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a addModerator(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            addModerator(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addModerator(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a removeModerator(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            removeModerator(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.removeModerator(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a ban(uint64,bool,address,uint64)void method call against the AkitaSocialPlugin contract
             */
            ban(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.ban(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a flagPost(uint64,bool,byte[32])void method call against the AkitaSocialPlugin contract
             */
            flagPost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.flagPost(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a unflagPost(uint64,bool,byte[32])void method call against the AkitaSocialPlugin contract
             */
            unflagPost(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unflagPost(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a unban(uint64,bool,address)void method call against the AkitaSocialPlugin contract
             */
            unban(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unban(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a addAction(uint64,bool,uint64,byte[36])void method call against the AkitaSocialPlugin contract
             */
            addAction(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addAction(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a removeAction(uint64,bool,uint64)void method call against the AkitaSocialPlugin contract
             */
            removeAction(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.removeAction(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64 method call against the AkitaSocialPlugin contract
             */
            initMeta(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.initMeta(params)));
                resultMappers.push((v) => client.decodeReturnValue('initMeta(uint64,bool,address,bool,uint64,uint64,uint64)uint64', v));
                return this;
            },
            /**
             * Add a updateMeta(uint64,bool,uint64,uint64,uint64,uint64,uint64,uint64)void method call against the AkitaSocialPlugin contract
             */
            updateMeta(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateMeta(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a updateAkitaDAO(uint64)void method call against the AkitaSocialPlugin contract
             */
            updateAkitaDao(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a opUp()void method call against the AkitaSocialPlugin contract
             */
            opUp(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64) method call against the AkitaSocialPlugin contract
             */
            mbr(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
                resultMappers.push((v) => client.decodeReturnValue('mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)', v));
                return this;
            },
            /**
             * Add a payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 method call against the AkitaSocialPlugin contract
             */
            payWallMbr(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.payWallMbr(params)));
                resultMappers.push((v) => client.decodeReturnValue('payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64', v));
                return this;
            },
            /**
             * Add a checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64) method call against the AkitaSocialPlugin contract
             */
            checkTipMbrRequirements(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.checkTipMbrRequirements(params)));
                resultMappers.push((v) => client.decodeReturnValue('checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)', v));
                return this;
            },
            /**
             * Add a clear state call to the AkitaSocialPlugin contract
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
exports.AkitaSocialPluginClient = AkitaSocialPluginClient;
//# sourceMappingURL=AkitaSocialPluginClient.js.map