import {
  BaseSDK
} from "./chunk-JXQTRU3Z.mjs";
import {
  ENV_VAR_NAMES
} from "./chunk-WBPQYKCD.mjs";

// src/raffle/index.ts
import { microAlgo as microAlgo2 } from "@algorandfoundation/algokit-utils";

// src/generated/RaffleClient.ts
import { getArc56ReturnValue, getABIStructFromABITuple } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC = { "name": "Raffle", "structs": { "EntryData": [{ "name": "account", "type": "address" }, { "name": "marketplace", "type": "address" }], "FindWinnerCursors": [{ "name": "index", "type": "uint64" }, { "name": "amountIndex", "type": "uint64" }], "RaffleMBRData": [{ "name": "entries", "type": "uint64" }, { "name": "weights", "type": "uint64" }, { "name": "entriesByAddress", "type": "uint64" }], "RaffleState": [{ "name": "ticketAsset", "type": "uint64" }, { "name": "startTimestamp", "type": "uint64" }, { "name": "endTimestamp", "type": "uint64" }, { "name": "seller", "type": "address" }, { "name": "minTickets", "type": "uint64" }, { "name": "maxTickets", "type": "uint64" }, { "name": "entryCount", "type": "uint64" }, { "name": "ticketCount", "type": "uint64" }, { "name": "winningTicket", "type": "uint64" }, { "name": "winner", "type": "address" }, { "name": "prize", "type": "uint64" }, { "name": "prizeClaimed", "type": "bool" }, { "name": "gateId", "type": "uint64" }, { "name": "vrfFailureCount", "type": "uint64" }, { "name": "entryId", "type": "uint64" }, { "name": "refundMbrCursor", "type": "uint64" }], "FunderInfo": [{ "name": "account", "type": "address" }, { "name": "amount", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "uint64", "name": "prize" }, { "type": "bool", "name": "isPrizeBox" }, { "type": "uint64", "name": "ticketAsset" }, { "type": "uint64", "name": "startTimestamp" }, { "type": "uint64", "name": "endTimestamp" }, { "type": "address", "name": "seller" }, { "type": "(address,uint64)", "struct": "FunderInfo", "name": "funder" }, { "type": "uint64", "name": "creatorRoyalty" }, { "type": "uint64", "name": "minTickets" }, { "type": "uint64", "name": "maxTickets" }, { "type": "uint64", "name": "gateID" }, { "type": "address", "name": "marketplace" }, { "type": "uint64", "name": "akitaDAO" }, { "type": "uint64", "name": "akitaDAOEscrow" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "init", "args": [{ "type": "pay", "name": "payment" }, { "type": "uint64", "name": "weightListLength" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "refundMBR", "args": [{ "type": "uint64", "name": "iterationAmount" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "clearWeightsBoxes", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "deleteApplication", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["DeleteApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "enter", "args": [{ "type": "pay", "name": "payment" }, { "type": "address", "name": "marketplace" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "enterAsa", "args": [{ "type": "pay", "name": "payment" }, { "type": "axfer", "name": "assetXfer" }, { "type": "address", "name": "marketplace" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "add", "args": [{ "type": "pay", "name": "payment" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedAddAsa", "args": [{ "type": "appl", "name": "gateTxn" }, { "type": "axfer", "name": "assetXfer" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addAsa", "args": [{ "type": "axfer", "name": "assetXfer" }, { "type": "byte[][]", "name": "args" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "raffle", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "findWinner", "args": [{ "type": "uint64", "name": "iterationAmount" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "claimRafflePrize", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "isLive", "args": [], "returns": { "type": "bool", "desc": "a boolean of whether the auction is live" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getState", "args": [], "returns": { "type": "(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)", "struct": "RaffleState" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAOEscrow", "args": [{ "type": "uint64", "name": "app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "mbr", "args": [], "returns": { "type": "(uint64,uint64,uint64)", "struct": "RaffleMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "optin", "args": [{ "type": "pay", "name": "payment", "desc": "The payment transaction" }, { "type": "uint64", "name": "asset", "desc": "The asset to be opted into" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "optin tells the contract to opt into an asa", "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 21, "bytes": 8 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "ticketAsset": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dGlja2V0X2Fzc2V0", "desc": "The asset required to enter the raffle" }, "startTimestamp": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "c3RhcnRfdGltZXN0YW1w", "desc": "The start round of the raffle as a unix timestamp" }, "endTimestamp": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZW5kX3RpbWVzdGFtcA==", "desc": "The end time of the raffle as a unix timestamp" }, "seller": { "keyType": "AVMString", "valueType": "address", "key": "c2VsbGVy", "desc": "the address selling the asset" }, "minTickets": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bWluX3RpY2tldHM=", "desc": "The minimum number of tickets to use for the raffle" }, "maxTickets": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bWF4X3RpY2tldHM=", "desc": "The maximum number of tickets users can enter the raffle with" }, "entryCount": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZW50cnlfY291bnQ=", "desc": "The number of entries for the raffle" }, "ticketCount": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dGlja2V0X2NvdW50", "desc": "The number of tickets entered into the raffle" }, "winningTicket": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "d2lubmluZ190aWNrZXQ=", "desc": "the winning ticket" }, "winner": { "keyType": "AVMString", "valueType": "address", "key": "d2lubmVy", "desc": "the winning address of the raffle" }, "prize": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cHJpemU=", "desc": "the prize for the raffle if prizeBox is true prize represents the app id of the prize box, otherwise the asset being raffled" }, "isPrizeBox": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "aXNfcHJpemVfYm94", "desc": "whether or not the prize is an asset or a prize box" }, "prizeClaimed": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cHJpemVfY2xhaW1lZA==", "desc": "Indicator for whether the prize has been claimed" }, "creatorRoyalty": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Y3JlYXRvcl9yb3lhbHR5", "desc": "the amount the creator will get for the sale" }, "gateID": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Z2F0ZV9pZA==", "desc": "the gate to use for the raffle" }, "marketplace": { "keyType": "AVMString", "valueType": "address", "key": "bWFya2V0cGxhY2U=", "desc": "the address of the creation side marketplace" }, "marketplaceRoyalties": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "bWFya2V0cGxhY2Vfcm95YWx0aWVz", "desc": "the amount the marketplaces will get for the sale" }, "akitaRoyalty": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfcm95YWx0eQ==", "desc": "the minimum impact tax for the raffle" }, "vrfFailureCount": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dnJmX2ZhaWx1cmVfY291bnQ=", "desc": "counter for how many times we've failed to get rng from the beacon" }, "entryID": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "ZW50cnlfaWQ=", "desc": "The id's of the raffle entries" }, "weightsBoxCount": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "d2VpZ2h0c19ib3hfY291bnQ=", "desc": "the number of boxes allocated to tracking weights" }, "weightTotals": { "keyType": "AVMString", "valueType": "uint64[15]", "key": "d190b3RhbHM=", "desc": "totals for each box of weights for our skip list" }, "findWinnerCursors": { "keyType": "AVMString", "valueType": "FindWinnerCursors", "key": "ZmluZF93aW5uZXJfY3Vyc29ycw==", "desc": "cursors to track iteration of finding winner\nindex being for the bid iteration\namountIndex being the index for the amount of the bids seen" }, "refundMBRCursor": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVmdW5kX21icl9jdXJzb3I=", "desc": "cursor to track iteration of MBR refunds" }, "salt": { "keyType": "AVMString", "valueType": "AVMBytes", "key": "c2FsdA==", "desc": "the transaction id of the create application call for salting our VRF call" }, "akitaDAOEscrow": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZXNjcm93", "desc": "the app ID for the akita DAO escrow to use" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" }, "funder": { "keyType": "AVMString", "valueType": "FunderInfo", "key": "ZnVuZGVy" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "entries": { "keyType": "uint64", "valueType": "EntryData", "desc": "The entries for the raffle", "prefix": "ZQ==" }, "weights": { "keyType": "uint64", "valueType": "uint64[4096]", "desc": "weights set for bidders", "prefix": "dw==" }, "entriesByAddress": { "keyType": "address", "valueType": "uint64", "desc": "The address map of entries for the raffle", "prefix": "YQ==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [1803, 1998], "errorMessage": "All refunds have been completed" }, { "pc": [1844, 2511, 2660, 3448, 3791, 3799], "errorMessage": "Box must have value" }, { "pc": [864, 961, 1042, 1242, 1598, 2866, 4360], "errorMessage": "Bytes has valid prefix" }, { "pc": [1450], "errorMessage": "Ending round must be in the future" }, { "pc": [2504, 2653], "errorMessage": "Entry does not exist" }, { "pc": [4380], "errorMessage": "Escrow does not exist" }, { "pc": [2076, 2285, 2495], "errorMessage": "Gate check failed" }, { "pc": [4952], "errorMessage": "Invalid app upgrade" }, { "pc": [1422], "errorMessage": "Invalid asset" }, { "pc": [1737, 2112, 2311, 2562, 5035], "errorMessage": "Invalid payment" }, { "pc": [3625, 3674, 3715], "errorMessage": "Invalid percentage" }, { "pc": [2344, 2719], "errorMessage": "Invalid transfer" }, { "pc": [1712], "errorMessage": "Must allocate at least four weights chunks" }, { "pc": [1717], "errorMessage": "Must allocate at most fifteen weights chunks" }, { "pc": [3269], "errorMessage": "No winning ticket yet" }, { "pc": [2791], "errorMessage": "Not enough time has passed since the raffle ended" }, { "pc": [669], "errorMessage": "OnCompletion must be DeleteApplication && can only call when not creating" }, { "pc": [461], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [657], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [4900, 4941, 4989], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [1403, 1708, 1979], "errorMessage": "Only the creator of this app can call this method" }, { "pc": [3550], "errorMessage": "Prize has already been claimed" }, { "pc": [1898, 1985], "errorMessage": "Prize has not been claimed" }, { "pc": [3263], "errorMessage": "Raffle has not ended" }, { "pc": [2031, 2241, 2450, 2638], "errorMessage": "Raffle is not live" }, { "pc": [2005], "errorMessage": "Still has weights boxes" }, { "pc": [3278], "errorMessage": "Winner has already been found" }, { "pc": [1795, 3543], "errorMessage": "Winner not found" }, { "pc": [2798], "errorMessage": "Winning ticket has already been drawn" }, { "pc": [4390], "errorMessage": "Wrong escrow for this operation" }, { "pc": [2086, 2295], "errorMessage": "You have already entered the raffle" }, { "pc": [996, 3852, 4e3, 4020, 4455, 4506, 4590, 4898, 4937, 4987], "errorMessage": "application exists" }, { "pc": [1421, 3830, 3953, 3973, 4622], "errorMessage": "asset exists" }, { "pc": [1523, 1547, 1552, 1784, 1791, 1800, 1883, 1897, 1904, 1915, 1942, 1984, 1989, 1996, 2003, 2035, 2042, 2049, 2061, 2066, 2102, 2116, 2171, 2189, 2198, 2245, 2251, 2258, 2270, 2275, 2327, 2337, 2348, 2400, 2418, 2427, 2454, 2461, 2468, 2480, 2485, 2548, 2579, 2598, 2642, 2705, 2736, 2755, 2773, 2780, 2796, 2803, 2820, 2890, 3005, 3261, 3268, 3274, 3283, 3295, 3306, 3319, 3351, 3419, 3428, 3474, 3539, 3548, 3555, 3564, 3569, 3596, 3601, 3612, 3620, 3642, 3661, 3669, 3702, 3710, 3732, 3785, 3808, 3827, 3849, 3876, 3914, 3950, 3957, 3970, 3977, 3997, 4004, 4017, 4028, 4046, 4050, 4063, 4072, 4089, 4109, 4129, 4133, 4146, 4150, 4154, 4177, 4182, 4186, 4190, 4201, 4205, 4229, 4234, 4238, 4260, 4276, 4385, 4503, 4587, 4614, 4619, 4626, 4642, 4655, 4669, 4674, 4692, 4697, 4702, 4732, 4737, 4742, 4747, 4752, 4757, 4761, 4765, 4770, 4775, 4780, 4785, 4790, 4795, 4800, 4805, 4891, 4929, 4980, 5062, 5073], "errorMessage": "check GlobalState exists" }, { "pc": [2181, 2410, 2590, 2747], "errorMessage": "index access is out of bounds" }, { "pc": [4373], "errorMessage": "invalid number of bytes for (len+(uint64,bool1)[])" }, { "pc": [874, 2876], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [4920], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [1048], "errorMessage": "invalid number of bytes for (uint64,uint64,bool1,bool1,uint64)" }, { "pc": [1327], "errorMessage": "invalid number of bytes for (uint8[32],uint64)" }, { "pc": [966, 1269], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [1260, 1279, 1291, 1302, 1334, 1342, 1353, 1364, 1386, 1397, 1603, 1698, 1779, 3253, 4884, 4973, 5012], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [1247, 1316, 1378, 2024, 2234], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [3172], "errorMessage": "max array length exceeded" }, { "pc": [2246, 2644], "errorMessage": "ticket asset is algo" }, { "pc": [2037, 2456], "errorMessage": "ticket asset is not algo" }, { "pc": [2615], "errorMessage": "transaction type is appl" }, { "pc": [2225, 2624, 2634], "errorMessage": "transaction type is axfer" }, { "pc": [1690, 2015, 2215, 2443, 5004], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggNCA0MDk2IDEwMDAwMCA2MzY0MTM2MjIzODQ2NzkzMDA1IDUwNjAwIDE0NDI2OTUwNDA4ODg5NjM0MDcgMTQ0MjY5NTA0MDg4ODk2MzQwOSA0Mjk0OTY3Mjk1IDEzMTEzMzAwIDE4NDQ2NzQ0MDczNzA5NTUxNjE1CiAgICBieXRlY2Jsb2NrICJ0aWNrZXRfYXNzZXQiICJha2l0YV9kYW8iICJ0aWNrZXRfY291bnQiICJlbnRyeV9jb3VudCIgIndpbm5lciIgMHgxNTFmN2M3NSAicHJpemUiICJ3X3RvdGFscyIgImEiICJ3aW5uaW5nX3RpY2tldCIgImdhdGVfaWQiICJha2l0YV9lc2Nyb3ciICJ3ZWlnaHRzX2JveF9jb3VudCIgInNlbGxlciIgInciICJtYXhfdGlja2V0cyIgInByaXplX2NsYWltZWQiICJyZWZ1bmRfbWJyX2N1cnNvciIgImVuZF90aW1lc3RhbXAiICJtYXJrZXRwbGFjZSIgInZyZl9mYWlsdXJlX2NvdW50IiAiZSIgIndhbGxldCIgIm1hcmtldHBsYWNlX3JveWFsdGllcyIgIm9hbCIgImlzX3ByaXplX2JveCIgInN0YXJ0X3RpbWVzdGFtcCIgImFraXRhX3JveWFsdHkiICJmaW5kX3dpbm5lcl9jdXJzb3JzIiAiY3JlYXRvcl9yb3lhbHR5IiAweDA2ODEwMSAibWluX3RpY2tldHMiICJlbnRyeV9pZCIgMHgwMDAwICJwYWwiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTAwLTEwNQogICAgLy8gZXhwb3J0IGNsYXNzIFJhZmZsZSBleHRlbmRzIGNsYXNzZXMoCiAgICAvLyAgIEJhc2VSYWZmbGUsCiAgICAvLyAgIEFraXRhQmFzZUZlZUdlbmVyYXRvckNvbnRyYWN0LAogICAgLy8gICBDb250cmFjdFdpdGhDcmVhdG9yT25seU9wdEluLAogICAgLy8gICBDaGlsZENvbnRyYWN0CiAgICAvLyApIHsKICAgIHB1c2hieXRlc3MgMHgyNDg3YzMyYyAweGVhOTE4MGRkIC8vIG1ldGhvZCAiZGVsZXRlQXBwbGljYXRpb24oKXZvaWQiLCBtZXRob2QgInVwZGF0ZShzdHJpbmcpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fZGVsZXRlQXBwbGljYXRpb25fcm91dGVANCBtYWluX3VwZGF0ZV9yb3V0ZUA1CgptYWluX3N3aXRjaF9jYXNlX25leHRANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMDAtMTA1CiAgICAvLyBleHBvcnQgY2xhc3MgUmFmZmxlIGV4dGVuZHMgY2xhc3NlcygKICAgIC8vICAgQmFzZVJhZmZsZSwKICAgIC8vICAgQWtpdGFCYXNlRmVlR2VuZXJhdG9yQ29udHJhY3QsCiAgICAvLyAgIENvbnRyYWN0V2l0aENyZWF0b3JPbmx5T3B0SW4sCiAgICAvLyAgIENoaWxkQ29udHJhY3QKICAgIC8vICkgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDI3CiAgICBwdXNoYnl0ZXNzIDB4YmQ3MTQ4ZDAgMHhmMmNlMmY0NiAweDJjOTQyNTE0IDB4OTczOWNiYjYgMHhlM2EyMWQ1MiAweDA1NGEzMDIwIDB4NjNiYmI3MzUgMHg0ODIxMjFjMyAweDY5NjUwMWRlIDB4YmQxYjI3ZDEgMHg2NWZjYTk4YiAweDhmYTRhMTYwIDB4OWU1NzI2ZjEgMHgxZWFkMjBhOSAweDMzZTkyYzk0IDB4ODU0ZGVkZTAgMHhkOWEzNWZhNCAweDNlYTExODMyIC8vIG1ldGhvZCAiaW5pdChwYXksdWludDY0KXZvaWQiLCBtZXRob2QgInJlZnVuZE1CUih1aW50NjQpdm9pZCIsIG1ldGhvZCAiY2xlYXJXZWlnaHRzQm94ZXMoKXVpbnQ2NCIsIG1ldGhvZCAiZW50ZXIocGF5LGFkZHJlc3MsYnl0ZVtdW10pdm9pZCIsIG1ldGhvZCAiZW50ZXJBc2EocGF5LGF4ZmVyLGFkZHJlc3MsYnl0ZVtdW10pdm9pZCIsIG1ldGhvZCAiYWRkKHBheSxieXRlW11bXSl2b2lkIiwgbWV0aG9kICJnYXRlZEFkZEFzYShhcHBsLGF4ZmVyKXZvaWQiLCBtZXRob2QgImFkZEFzYShheGZlcixieXRlW11bXSl2b2lkIiwgbWV0aG9kICJyYWZmbGUoKXZvaWQiLCBtZXRob2QgImZpbmRXaW5uZXIodWludDY0KXZvaWQiLCBtZXRob2QgImNsYWltUmFmZmxlUHJpemUoKXZvaWQiLCBtZXRob2QgImlzTGl2ZSgpYm9vbCIsIG1ldGhvZCAiZ2V0U3RhdGUoKSh1aW50NjQsdWludDY0LHVpbnQ2NCxhZGRyZXNzLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYWRkcmVzcyx1aW50NjQsYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBT0VzY3Jvdyh1aW50NjQpdm9pZCIsIG1ldGhvZCAidXBkYXRlQWtpdGFEQU8odWludDY0KXZvaWQiLCBtZXRob2QgIm9wVXAoKXZvaWQiLCBtZXRob2QgIm1icigpKHVpbnQ2NCx1aW50NjQsdWludDY0KSIsIG1ldGhvZCAib3B0aW4ocGF5LHVpbnQ2NCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggaW5pdCByZWZ1bmRNQlIgY2xlYXJXZWlnaHRzQm94ZXMgZW50ZXIgZW50ZXJBc2EgYWRkIGdhdGVkQWRkQXNhIGFkZEFzYSByYWZmbGUgZmluZFdpbm5lciBjbGFpbVJhZmZsZVByaXplIGlzTGl2ZSBnZXRTdGF0ZSB1cGRhdGVBa2l0YURBT0VzY3JvdyB1cGRhdGVBa2l0YURBTyBtYWluX29wVXBfcm91dGVAMjMgbWFpbl9tYnJfcm91dGVAMjQgb3B0aW4KICAgIGVycgoKbWFpbl9tYnJfcm91dGVAMjQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2Jhc2UudHM6NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBwdXNoYnl0ZXMgMHgxNTFmN2M3NTAwMDAwMDAwMDAwMDdiZDQwMDAwMDAwMDAwYzgxN2Q0MDAwMDAwMDAwMDAwNDlkNAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX29wVXBfcm91dGVAMjM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MwogICAgLy8gb3BVcCgpOiB2b2lkIHsgfQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfTm9PcEAyNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMDAtMTA1CiAgICAvLyBleHBvcnQgY2xhc3MgUmFmZmxlIGV4dGVuZHMgY2xhc3NlcygKICAgIC8vICAgQmFzZVJhZmZsZSwKICAgIC8vICAgQWtpdGFCYXNlRmVlR2VuZXJhdG9yQ29udHJhY3QsCiAgICAvLyAgIENvbnRyYWN0V2l0aENyZWF0b3JPbmx5T3B0SW4sCiAgICAvLyAgIENoaWxkQ29udHJhY3QKICAgIC8vICkgewogICAgcHVzaGJ5dGVzIDB4ZTIyZTAzOTIgLy8gbWV0aG9kICJjcmVhdGUodWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQsYWRkcmVzcywoYWRkcmVzcyx1aW50NjQpLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxhZGRyZXNzLHVpbnQ2NCx1aW50NjQpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgptYWluX3VwZGF0ZV9yb3V0ZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgaW50Y18zIC8vIFVwZGF0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgVXBkYXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiB1cGRhdGUKCm1haW5fZGVsZXRlQXBwbGljYXRpb25fcm91dGVANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNjYKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6ICdEZWxldGVBcHBsaWNhdGlvbicgfSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIHB1c2hpbnQgNSAvLyBEZWxldGVBcHBsaWNhdGlvbgogICAgPT0KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAmJgogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIERlbGV0ZUFwcGxpY2F0aW9uICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGIgZGVsZXRlQXBwbGljYXRpb24KCgovLyBfcHV5YV9saWIudXRpbC5lbnN1cmVfYnVkZ2V0KHJlcXVpcmVkX2J1ZGdldDogdWludDY0LCBmZWVfc291cmNlOiB1aW50NjQpIC0+IHZvaWQ6CmVuc3VyZV9idWRnZXQ6CiAgICBwcm90byAyIDAKICAgIGZyYW1lX2RpZyAtMgogICAgcHVzaGludCAxMCAvLyAxMAogICAgKwoKZW5zdXJlX2J1ZGdldF93aGlsZV90b3BAMToKICAgIGZyYW1lX2RpZyAwCiAgICBnbG9iYWwgT3Bjb2RlQnVkZ2V0CiAgICA+CiAgICBieiBlbnN1cmVfYnVkZ2V0X2FmdGVyX3doaWxlQDYKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBwdXNoaW50IDUgLy8gRGVsZXRlQXBwbGljYXRpb24KICAgIGl0eG5fZmllbGQgT25Db21wbGV0aW9uCiAgICBieXRlYyAzMCAvLyAweDA2ODEwMQogICAgaXR4bl9maWVsZCBBcHByb3ZhbFByb2dyYW0KICAgIGJ5dGVjIDMwIC8vIDB4MDY4MTAxCiAgICBpdHhuX2ZpZWxkIENsZWFyU3RhdGVQcm9ncmFtCiAgICBmcmFtZV9kaWcgLTEKICAgIHN3aXRjaCBlbnN1cmVfYnVkZ2V0X3N3aXRjaF9jYXNlXzBAMyBlbnN1cmVfYnVkZ2V0X3N3aXRjaF9jYXNlXzFANAoKZW5zdXJlX2J1ZGdldF9zd2l0Y2hfY2FzZV9uZXh0QDU6CiAgICBpdHhuX3N1Ym1pdAogICAgYiBlbnN1cmVfYnVkZ2V0X3doaWxlX3RvcEAxCgplbnN1cmVfYnVkZ2V0X3N3aXRjaF9jYXNlXzFANDoKICAgIGdsb2JhbCBNaW5UeG5GZWUKICAgIGl0eG5fZmllbGQgRmVlCiAgICBiIGVuc3VyZV9idWRnZXRfc3dpdGNoX2Nhc2VfbmV4dEA1CgplbnN1cmVfYnVkZ2V0X3N3aXRjaF9jYXNlXzBAMzoKICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgYiBlbnN1cmVfYnVkZ2V0X3N3aXRjaF9jYXNlX25leHRANQoKZW5zdXJlX2J1ZGdldF9hZnRlcl93aGlsZUA2OgogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czo6X19wY2czMk91dHB1dChzdGF0ZTogdWludDY0KSAtPiB1aW50NjQ6Cl9fcGNnMzJPdXRwdXQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjIzCiAgICAvLyBleHBvcnQgZnVuY3Rpb24gX19wY2czMk91dHB1dChzdGF0ZTogUENHMzJTVEFURSk6IHVpbnQ2NCB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MjQKICAgIC8vIGNvbnN0IHhvcnNoaWZ0ZWQgPSBfX21hc2tUb1VpbnQzMihvcC5zaHIob3Auc2hyKHN0YXRlLCAxOCkgXiBzdGF0ZSwgMjcpKQogICAgZnJhbWVfZGlnIC0xCiAgICBwdXNoaW50IDE4IC8vIDE4CiAgICBzaHIKICAgIGZyYW1lX2RpZyAtMQogICAgXgogICAgcHVzaGludCAyNyAvLyAyNwogICAgc2hyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjEzCiAgICAvLyByZXR1cm4gdmFsdWUgJiAob3Auc2hsKDEsIDMyKSAtIDEpCiAgICBpbnRjIDEwIC8vIDQyOTQ5NjcyOTUKICAgICYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MjUKICAgIC8vIGNvbnN0IHJvdCA9IG9wLnNocihzdGF0ZSwgNTkpCiAgICBmcmFtZV9kaWcgLTEKICAgIHB1c2hpbnQgNTkgLy8gNTkKICAgIHNocgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoyNgogICAgLy8gcmV0dXJuIG9wLnNocih4b3JzaGlmdGVkLCByb3QpIHwgX19tYXNrVG9VaW50MzIob3Auc2hsKHhvcnNoaWZ0ZWQsIF9fdWludDY0VHdvcyhyb3QpICYgMzEpKQogICAgZHVwMgogICAgc2hyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjgKICAgIC8vIGNvbnN0IFssIGFkZExvd10gPSBvcC5hZGR3KH52YWx1ZSwgMSkKICAgIHN3YXAKICAgIH4KICAgIGludGNfMSAvLyAxCiAgICBhZGR3CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MjYKICAgIC8vIHJldHVybiBvcC5zaHIoeG9yc2hpZnRlZCwgcm90KSB8IF9fbWFza1RvVWludDMyKG9wLnNobCh4b3JzaGlmdGVkLCBfX3VpbnQ2NFR3b3Mocm90KSAmIDMxKSkKICAgIHB1c2hpbnQgMzEgLy8gMzEKICAgICYKICAgIHVuY292ZXIgMgogICAgc3dhcAogICAgc2hsCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjEzCiAgICAvLyByZXR1cm4gdmFsdWUgJiAob3Auc2hsKDEsIDMyKSAtIDEpCiAgICBpbnRjIDEwIC8vIDQyOTQ5NjcyOTUKICAgICYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MjYKICAgIC8vIHJldHVybiBvcC5zaHIoeG9yc2hpZnRlZCwgcm90KSB8IF9fbWFza1RvVWludDMyKG9wLnNobCh4b3JzaGlmdGVkLCBfX3VpbnQ2NFR3b3Mocm90KSAmIDMxKSkKICAgIHwKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6Om9yaWdpbk9yVHhuU2VuZGVyKHdhbGxldElEOiB1aW50NjQpIC0+IGJ5dGVzOgpvcmlnaW5PclR4blNlbmRlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTQ1CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gb3JpZ2luT3JUeG5TZW5kZXIod2FsbGV0SUQ6IEFwcGxpY2F0aW9uKTogQWNjb3VudCB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTQ2CiAgICAvLyByZXR1cm4gb3JpZ2luT3Iod2FsbGV0SUQsIFR4bi5zZW5kZXIpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEzOQogICAgLy8gaWYgKHdhbGxldElELmlkID09PSAwKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGJueiBvcmlnaW5PclR4blNlbmRlcl9hZnRlcl9pZl9lbHNlQDMKICAgIGZyYW1lX2RpZyAwCgpvcmlnaW5PclR4blNlbmRlcl9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6Om9yaWdpbk9yQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE0NgogICAgLy8gcmV0dXJuIG9yaWdpbk9yKHdhbGxldElELCBUeG4uc2VuZGVyKQogICAgc3dhcAogICAgcmV0c3ViCgpvcmlnaW5PclR4blNlbmRlcl9hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2MS0xNjQKICAgIC8vIGNvbnN0IFtjb250cm9sbGVkQWNjb3VudEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXRJRCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzQ29udHJvbGxlZEFkZHJlc3MpCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTYzCiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcykKICAgIHB1c2hieXRlcyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNjEtMTY0CiAgICAvLyBjb25zdCBbY29udHJvbGxlZEFjY291bnRCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0SUQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNDYKICAgIC8vIHJldHVybiBvcmlnaW5Pcih3YWxsZXRJRCwgVHhuLnNlbmRlcikKICAgIGIgb3JpZ2luT3JUeG5TZW5kZXJfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpvcmlnaW5PckA0CgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6Z2V0V2FsbGV0SURVc2luZ0FraXRhREFPKGFraXRhREFPOiB1aW50NjQsIGFkZHJlc3M6IGJ5dGVzKSAtPiB1aW50NjQ6CmdldFdhbGxldElEVXNpbmdBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTc2CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbiwgYWRkcmVzczogQWNjb3VudCk6IEFwcGxpY2F0aW9uIHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NQogICAgLy8gY29uc3QgW290aGVyQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c090aGVyQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTIKICAgIGJ5dGVjIDI0IC8vICJvYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjYwCiAgICAvLyByZXR1cm4gZ2V0T3RoZXJBcHBMaXN0KGFraXRhREFPKS5lc2Nyb3cKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE4Mi0xODUKICAgIC8vIGNvbnN0IGRhdGEgPSBhYmlDYWxsPHR5cGVvZiBFc2Nyb3dGYWN0b3J5LnByb3RvdHlwZS5nZXQ+KHsKICAgIC8vICAgYXBwSWQ6IGVzY3Jvd0ZhY3RvcnksCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hieXRlcyAweDNjMWE2ZjMzIC8vIG1ldGhvZCAiZ2V0KGFkZHJlc3MpYnl0ZVtdIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgZGlnIDEKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgNiAwCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTg3CiAgICAvLyBpZiAoQnl0ZXMoZGF0YSkubGVuZ3RoID09PSAwIHx8IEJ5dGVzKGRhdGEpLmxlbmd0aCAhPT0gOCkgewogICAgbGVuCiAgICBkdXAKICAgIGJ6IGdldFdhbGxldElEVXNpbmdBa2l0YURBT19pZl9ib2R5QDYKICAgIGZyYW1lX2RpZyAxCiAgICBpbnRjXzIgLy8gOAogICAgIT0KICAgIGJ6IGdldFdhbGxldElEVXNpbmdBa2l0YURBT19hZnRlcl9pZl9lbHNlQDcKCmdldFdhbGxldElEVXNpbmdBa2l0YURBT19pZl9ib2R5QDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE4OAogICAgLy8gcmV0dXJuIDAKICAgIGludGNfMCAvLyAwCgpnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU9fYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpnZXRXYWxsZXRJREA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNzgKICAgIC8vIHJldHVybiBBcHBsaWNhdGlvbihnZXRXYWxsZXRJRChlc2Nyb3dGYWN0b3J5LCBhZGRyZXNzKSkKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgpnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU9fYWZ0ZXJfaWZfZWxzZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxOTEKICAgIC8vIHJldHVybiBidG9pKGRhdGEpCiAgICBmcmFtZV9kaWcgMAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNzgKICAgIC8vIHJldHVybiBBcHBsaWNhdGlvbihnZXRXYWxsZXRJRChlc2Nyb3dGYWN0b3J5LCBhZGRyZXNzKSkKICAgIGIgZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6Z2V0V2FsbGV0SURAOAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OmdhdGVDYWxsKGFraXRhREFPOiB1aW50NjQsIGNhbGxlcjogYnl0ZXMsIGlkOiB1aW50NjQsIGFyZ3M6IGJ5dGVzKSAtPiB1aW50NjQsIGJ5dGVzOgpnYXRlQ2FsbDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjA0CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gZ2F0ZUNhbGwoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBjYWxsZXI6IEFjY291bnQsIGlkOiB1aW50NjQsIGFyZ3M6IEdhdGVBcmdzKTogYm9vbGVhbiB7CiAgICBwcm90byA0IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjA1LTIxMgogICAgLy8gcmV0dXJuIGFiaUNhbGw8dHlwZW9mIEdhdGUucHJvdG90eXBlLmNoZWNrPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBjYWxsZXIsCiAgICAvLyAgICAgaWQsCiAgICAvLyAgICAgYXJncywKICAgIC8vICAgXSwKICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQwCiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTQKICAgIHB1c2hieXRlcyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMDYKICAgIC8vIGFwcElkOiBnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUsCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMDkKICAgIC8vIGlkLAogICAgZnJhbWVfZGlnIC0yCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIwNS0yMTIKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBHYXRlLnByb3RvdHlwZS5jaGVjaz4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgY2FsbGVyLAogICAgLy8gICAgIGlkLAogICAgLy8gICAgIGFyZ3MsCiAgICAvLyAgIF0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4MjAwZjc0MjEgLy8gbWV0aG9kICJjaGVjayhhZGRyZXNzLHVpbnQ2NCxieXRlW11bXSlib29sIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgZnJhbWVfZGlnIC0xCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjphcmM1OU9wdEluQW5kU2VuZChha2l0YURBTzogdWludDY0LCByZWNpcGllbnQ6IGJ5dGVzLCBhc3NldDogdWludDY0LCBhbW91bnQ6IHVpbnQ2NCwgY2xvc2VPdXQ6IHVpbnQ2NCkgLT4gdm9pZDoKYXJjNTlPcHRJbkFuZFNlbmQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMyOQogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIGFyYzU5T3B0SW5BbmRTZW5kKGFraXRhREFPOiBBcHBsaWNhdGlvbiwgcmVjaXBpZW50OiBBY2NvdW50LCBhc3NldDogdWludDY0LCBhbW91bnQ6IHVpbnQ2NCwgY2xvc2VPdXQ6IGJvb2xlYW4pOiB2b2lkIHsKICAgIHByb3RvIDUgMAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDIKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU1CiAgICAvLyBjb25zdCBbb3RoZXJBcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzT3RoZXJBcHBMaXN0KSkKICAgIGZyYW1lX2RpZyAtNQogICAgYnl0ZWMgMjQgLy8gIm9hbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzMwCiAgICAvLyBjb25zdCBhc3NldEluYm94ID0gZ2V0T3RoZXJBcHBMaXN0KGFraXRhREFPKS5hc3NldEluYm94CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwbiAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMzMQogICAgLy8gY29uc3QgaW5ib3hBZGRyZXNzID0gQXBwbGljYXRpb24oYXNzZXRJbmJveCkuYWRkcmVzcwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgc3dhcAogICAgY292ZXIgMgogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozMzMtMzM2CiAgICAvLyBjb25zdCB7IG1iciwgcm91dGVyT3B0ZWRJbiwgcmVjZWl2ZXJBbGdvTmVlZGVkRm9yQ2xhaW0gfSA9IGFiaUNhbGw8dHlwZW9mIEFzc2V0SW5ib3gucHJvdG90eXBlLmFyYzU5X2dldFNlbmRBc3NldEluZm8+KHsKICAgIC8vICAgYXBwSWQ6IGFzc2V0SW5ib3gsCiAgICAvLyAgIGFyZ3M6IFtyZWNpcGllbnQsIGFzc2V0XQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzM1CiAgICAvLyBhcmdzOiBbcmVjaXBpZW50LCBhc3NldF0KICAgIGZyYW1lX2RpZyAtMwogICAgaXRvYgogICAgZHVwCiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMzMy0zMzYKICAgIC8vIGNvbnN0IHsgbWJyLCByb3V0ZXJPcHRlZEluLCByZWNlaXZlckFsZ29OZWVkZWRGb3JDbGFpbSB9ID0gYWJpQ2FsbDx0eXBlb2YgQXNzZXRJbmJveC5wcm90b3R5cGUuYXJjNTlfZ2V0U2VuZEFzc2V0SW5mbz4oewogICAgLy8gICBhcHBJZDogYXNzZXRJbmJveCwKICAgIC8vICAgYXJnczogW3JlY2lwaWVudCwgYXNzZXRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4Y2FhOGRhYTUgLy8gbWV0aG9kICJhcmM1OV9nZXRTZW5kQXNzZXRJbmZvKGFkZHJlc3MsdWludDY0KSh1aW50NjQsdWludDY0LGJvb2wsYm9vbCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDI1IC8vIDI1CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAodWludDY0LHVpbnQ2NCxib29sMSxib29sMSx1aW50NjQpCiAgICBkaWcgMQogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgMwogICAgcHVzaGludCAxMjggLy8gMTI4CiAgICBnZXRiaXQKICAgIGNvdmVyIDIKICAgIGRpZyAxCiAgICBleHRyYWN0IDIxIDgKICAgIGNvdmVyIDIKICAgIHN3YXAKICAgIHB1c2hpbnQgMjEgLy8gMjEKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMzOAogICAgLy8gaWYgKG1iciB8fCByZWNlaXZlckFsZ29OZWVkZWRGb3JDbGFpbSkgewogICAgYm56IGFyYzU5T3B0SW5BbmRTZW5kX2lmX2JvZHlAMwogICAgZnJhbWVfZGlnIDEwCiAgICBieiBhcmM1OU9wdEluQW5kU2VuZF9hZnRlcl9pZl9lbHNlQDUKCmFyYzU5T3B0SW5BbmRTZW5kX2lmX2JvZHlAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzM5LTM0MgogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgcmVjZWl2ZXI6IGluYm94QWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnIgKyByZWNlaXZlckFsZ29OZWVkZWRGb3JDbGFpbQogICAgLy8gfSkuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzQxCiAgICAvLyBhbW91bnQ6IG1iciArIHJlY2VpdmVyQWxnb05lZWRlZEZvckNsYWltCiAgICBmcmFtZV9kaWcgNwogICAgZnJhbWVfZGlnIDEwCiAgICArCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgZnJhbWVfZGlnIDUKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzM5LTM0MgogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgcmVjZWl2ZXI6IGluYm94QWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnIgKyByZWNlaXZlckFsZ29OZWVkZWRGb3JDbGFpbQogICAgLy8gfSkuc3VibWl0KCkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CgphcmM1OU9wdEluQW5kU2VuZF9hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjM0NQogICAgLy8gaWYgKCFyb3V0ZXJPcHRlZEluKSB7CiAgICBmcmFtZV9kaWcgOAogICAgYm56IGFyYzU5T3B0SW5BbmRTZW5kX2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNDYtMzQ5CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBc3NldEluYm94LnByb3RvdHlwZS5hcmM1OV9vcHRSb3V0ZXJJbj4oewogICAgLy8gICBhcHBJZDogYXNzZXRJbmJveCwKICAgIC8vICAgYXJnczogW2Fzc2V0XQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hieXRlcyAweGU4NTQwODEwIC8vIG1ldGhvZCAiYXJjNTlfb3B0Um91dGVySW4odWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIDYKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgNAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAoKYXJjNTlPcHRJbkFuZFNlbmRfYWZ0ZXJfaWZfZWxzZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNTMKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IGluYm94QWRkcmVzcywKICAgIGludGNfMSAvLyAxCiAgICBmcmFtZV9idXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzU0CiAgICAvLyBhc3NldEFtb3VudDogYW1vdW50LAogICAgaW50Y18xIC8vIDEKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNTIKICAgIC8vIGxldCB4ZmVyVHhuID0gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzU4CiAgICAvLyBpZiAoY2xvc2VPdXQpIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnogYXJjNTlPcHRJbkFuZFNlbmRfYWZ0ZXJfaWZfZWxzZUAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNjEKICAgIC8vIGFzc2V0Q2xvc2VUbzogaW5ib3hBZGRyZXNzCiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjM1OQogICAgLy8geGZlclR4biA9IGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAyCiAgICBmcmFtZV9kaWcgNQogICAgZnJhbWVfYnVyeSAzCgphcmM1OU9wdEluQW5kU2VuZF9hZnRlcl9pZl9lbHNlQDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNjUtMzY4CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBc3NldEluYm94LnByb3RvdHlwZS5hcmM1OV9zZW5kQXNzZXQ+KHsKICAgIC8vICAgYXBwSWQ6IGFzc2V0SW5ib3gsCiAgICAvLyAgIGFyZ3M6IFt4ZmVyVHhuLCByZWNpcGllbnQsIHJlY2VpdmVyQWxnb05lZWRlZEZvckNsYWltXQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzY3CiAgICAvLyBhcmdzOiBbeGZlclR4biwgcmVjaXBpZW50LCByZWNlaXZlckFsZ29OZWVkZWRGb3JDbGFpbV0KICAgIGZyYW1lX2RpZyAxCiAgICBieiBhcmM1OU9wdEluQW5kU2VuZF9uZXh0X2ZpZWxkQDEyCiAgICBmcmFtZV9kaWcgMwogICAgaXR4bl9maWVsZCBBc3NldENsb3NlVG8KCmFyYzU5T3B0SW5BbmRTZW5kX25leHRfZmllbGRAMTI6CiAgICBmcmFtZV9kaWcgLTMKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjM2NwogICAgLy8gYXJnczogW3hmZXJUeG4sIHJlY2lwaWVudCwgcmVjZWl2ZXJBbGdvTmVlZGVkRm9yQ2xhaW1dCiAgICBmcmFtZV9kaWcgMAogICAgYnogYXJjNTlPcHRJbkFuZFNlbmRfbmV4dF9maWVsZEAxNAogICAgZnJhbWVfZGlnIC0yCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CgphcmM1OU9wdEluQW5kU2VuZF9uZXh0X2ZpZWxkQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNjcKICAgIC8vIGFyZ3M6IFt4ZmVyVHhuLCByZWNpcGllbnQsIHJlY2VpdmVyQWxnb05lZWRlZEZvckNsYWltXQogICAgZnJhbWVfZGlnIDIKICAgIGJ6IGFyYzU5T3B0SW5BbmRTZW5kX25leHRfZmllbGRAMTYKICAgIGZyYW1lX2RpZyA1CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKCmFyYzU5T3B0SW5BbmRTZW5kX25leHRfZmllbGRAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjM1Mi0zNTYKICAgIC8vIGxldCB4ZmVyVHhuID0gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogaW5ib3hBZGRyZXNzLAogICAgLy8gICBhc3NldEFtb3VudDogYW1vdW50LAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNjUtMzY4CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBc3NldEluYm94LnByb3RvdHlwZS5hcmM1OV9zZW5kQXNzZXQ+KHsKICAgIC8vICAgYXBwSWQ6IGFzc2V0SW5ib3gsCiAgICAvLyAgIGFyZ3M6IFt4ZmVyVHhuLCByZWNpcGllbnQsIHJlY2VpdmVyQWxnb05lZWRlZEZvckNsYWltXQogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgcHVzaGJ5dGVzIDB4MDg1MzFlZDcgLy8gbWV0aG9kICJhcmM1OV9zZW5kQXNzZXQoYXhmZXIsYWRkcmVzcyx1aW50NjQpYWRkcmVzcyIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTQKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgOQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBnaXR4biAxIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIHB1c2hieXRlcyAiIgogICAgZHVwbiAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjMyCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAzCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMwogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yICh1aW50OFszMl0sdWludDY0KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA5CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMwogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMTAKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAzCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNvdmVyIDMKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEyCiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNvdmVyIDMKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDE0CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI0OQogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkICE9PSAwLCBFUlJfTVVTVF9CRV9DQUxMRURfRlJPTV9GQUNUT1JZKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBPbmx5IHRoZSBjcmVhdG9yIG9mIHRoaXMgYXBwIGNhbiBjYWxsIHRoaXMgbWV0aG9kCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBwcml6ZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemUgfSkKICAgIGJ5dGVjIDYgLy8gInByaXplIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI1MQogICAgLy8gdGhpcy5wcml6ZS52YWx1ZSA9IHByaXplCiAgICB1bmNvdmVyIDMKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMyCiAgICAvLyBpc1ByaXplQm94ID0gR2xvYmFsU3RhdGU8Ym9vbGVhbj4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5SXNQcml6ZUJveCB9KQogICAgYnl0ZWMgMjUgLy8gImlzX3ByaXplX2JveCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNTIKICAgIC8vIHRoaXMuaXNQcml6ZUJveC52YWx1ZSA9IGlzUHJpemVCb3gKICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNTQKICAgIC8vIGlmICh0aWNrZXRBc3NldCAhPT0gMCkgewogICAgYnogY3JlYXRlX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI1NQogICAgLy8gYXNzZXJ0KEFzc2V0KHRpY2tldEFzc2V0KS50b3RhbCA+IDAsIEVSUl9JTlZBTElEX0FTU0VUKQogICAgZGlnIDEwCiAgICBhc3NldF9wYXJhbXNfZ2V0IEFzc2V0VG90YWwKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIGFzc2VydCAvLyBJbnZhbGlkIGFzc2V0CgpjcmVhdGVfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNTcKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUgPSBBc3NldCh0aWNrZXRBc3NldCkKICAgIGRpZyAxMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTIKICAgIC8vIHN0YXJ0VGltZXN0YW1wID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlTdGFydFRpbWVzdGFtcCB9KQogICAgYnl0ZWMgMjYgLy8gInN0YXJ0X3RpbWVzdGFtcCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNTgKICAgIC8vIHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUgPSBzdGFydFRpbWVzdGFtcAogICAgZGlnIDEwCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjU5CiAgICAvLyBhc3NlcnQoZW5kVGltZXN0YW1wID4gc3RhcnRUaW1lc3RhbXAgJiYgZW5kVGltZXN0YW1wID4gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwgRVJSX0lOVkFMSURfRU5ESU5HX1JPVU5EKQogICAgZGlnIDkKICAgIDwKICAgIGJ6IGNyZWF0ZV9ib29sX2ZhbHNlQDYKICAgIGRpZyA4CiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICA+CiAgICBieiBjcmVhdGVfYm9vbF9mYWxzZUA2CiAgICBpbnRjXzEgLy8gMQoKY3JlYXRlX2Jvb2xfbWVyZ2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNTkKICAgIC8vIGFzc2VydChlbmRUaW1lc3RhbXAgPiBzdGFydFRpbWVzdGFtcCAmJiBlbmRUaW1lc3RhbXAgPiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLCBFUlJfSU5WQUxJRF9FTkRJTkdfUk9VTkQpCiAgICBhc3NlcnQgLy8gRW5kaW5nIHJvdW5kIG11c3QgYmUgaW4gdGhlIGZ1dHVyZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExNAogICAgLy8gZW5kVGltZXN0YW1wID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbmRUaW1lc3RhbXAgfSkKICAgIGJ5dGVjIDE4IC8vICJlbmRfdGltZXN0YW1wIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI2MAogICAgLy8gdGhpcy5lbmRUaW1lc3RhbXAudmFsdWUgPSBlbmRUaW1lc3RhbXAKICAgIGRpZyA5CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExNgogICAgLy8gc2VsbGVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5U2VsbGVyIH0pCiAgICBieXRlYyAxMyAvLyAic2VsbGVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI2MQogICAgLy8gdGhpcy5zZWxsZXIudmFsdWUgPSBzZWxsZXIKICAgIGRpZyA4CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2NoaWxkLnRzOjExCiAgICAvLyBmdW5kZXIgPSBHbG9iYWxTdGF0ZTxGdW5kZXJJbmZvPih7IGtleTogR2xvYmFsU3RhdGVLZXlGdW5kZXIgfSkKICAgIHB1c2hieXRlcyAiZnVuZGVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI2MgogICAgLy8gdGhpcy5mdW5kZXIudmFsdWUgPSBjbG9uZShmdW5kZXIpCiAgICBkaWcgNwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTgKICAgIC8vIG1pblRpY2tldHMgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleU1pblRpY2tldHMgfSkKICAgIGJ5dGVjIDMxIC8vICJtaW5fdGlja2V0cyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNjMKICAgIC8vIHRoaXMubWluVGlja2V0cy52YWx1ZSA9IG1pblRpY2tldHMKICAgIGRpZyA2CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMAogICAgLy8gbWF4VGlja2V0cyA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWF4VGlja2V0cyB9KQogICAgYnl0ZWMgMTUgLy8gIm1heF90aWNrZXRzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI2NAogICAgLy8gdGhpcy5tYXhUaWNrZXRzLnZhbHVlID0gbWF4VGlja2V0cwogICAgZGlnIDUKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTIyCiAgICAvLyBlbnRyeUNvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbnRyeUNvdW50IH0pCiAgICBieXRlY18zIC8vICJlbnRyeV9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNjUKICAgIC8vIHRoaXMuZW50cnlDb3VudC52YWx1ZSA9IDAKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gdGlja2V0Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldENvdW50IH0pCiAgICBieXRlY18yIC8vICJ0aWNrZXRfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjY2CiAgICAvLyB0aGlzLnRpY2tldENvdW50LnZhbHVlID0gMAogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI2CiAgICAvLyB3aW5uaW5nVGlja2V0ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlXaW5uaW5nVGlja2V0IH0pCiAgICBieXRlYyA5IC8vICJ3aW5uaW5nX3RpY2tldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNjcKICAgIC8vIHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA9IDAKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjY4CiAgICAvLyB0aGlzLndpbm5lci52YWx1ZSA9IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzNAogICAgLy8gcHJpemVDbGFpbWVkID0gR2xvYmFsU3RhdGU8Ym9vbGVhbj4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemVDbGFpbWVkIH0pCiAgICBieXRlYyAxNiAvLyAicHJpemVfY2xhaW1lZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNjkKICAgIC8vIHRoaXMucHJpemVDbGFpbWVkLnZhbHVlID0gZmFsc2UKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzOAogICAgLy8gZ2F0ZUlEID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlHYXRlSUQgfSkKICAgIGJ5dGVjIDEwIC8vICJnYXRlX2lkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI3MAogICAgLy8gdGhpcy5nYXRlSUQudmFsdWUgPSBnYXRlSUQKICAgIGRpZyA0CiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE0MAogICAgLy8gbWFya2V0cGxhY2UgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZSB9KQogICAgYnl0ZWMgMTkgLy8gIm1hcmtldHBsYWNlIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI3MQogICAgLy8gdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSA9IG1hcmtldHBsYWNlCiAgICBkaWcgMwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI3MgogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBkaWcgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgMTEgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNzMKICAgIC8vIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUgPSBha2l0YURBT0VzY3JvdwogICAgZGlnIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjc2CiAgICAvLyBjb25zdCBmZWVzID0gZ2V0TkZURmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI3NgogICAgLy8gY29uc3QgZmVlcyA9IGdldE5GVEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjg5CiAgICAvLyBjb25zdCBbbmZ0RmVlc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c05GVEZlZXMpKQogICAgcHVzaGJ5dGVzICJuZnRfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIHRoaXMubWFya2V0cGxhY2VSb3lhbHRpZXMudmFsdWUgPSBmZWVzLnJhZmZsZUNvbXBvc2FibGVQZXJjZW50YWdlCiAgICBkdXAKICAgIHB1c2hpbnQgMTEyIC8vIDExMgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDIKICAgIC8vIG1hcmtldHBsYWNlUm95YWx0aWVzID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZVJveWFsdGllcyB9KQogICAgYnl0ZWMgMjMgLy8gIm1hcmtldHBsYWNlX3JveWFsdGllcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNzcKICAgIC8vIHRoaXMubWFya2V0cGxhY2VSb3lhbHRpZXMudmFsdWUgPSBmZWVzLnJhZmZsZUNvbXBvc2FibGVQZXJjZW50YWdlCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI3OQogICAgLy8gY29uc3QgaW1wYWN0ID0gZ2V0VXNlckltcGFjdCh0aGlzLmFraXRhREFPLnZhbHVlLCB0aGlzLnNlbGxlci52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNzkKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldFVzZXJJbXBhY3QodGhpcy5ha2l0YURBTy52YWx1ZSwgdGhpcy5zZWxsZXIudmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTYKICAgIC8vIHNlbGxlciA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVNlbGxlciB9KQogICAgYnl0ZWMgMTMgLy8gInNlbGxlciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyNzkKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldFVzZXJJbXBhY3QodGhpcy5ha2l0YURBTy52YWx1ZSwgdGhpcy5zZWxsZXIudmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMzItMTM1CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxJbXBhY3QucHJvdG90eXBlLmdldFVzZXJJbXBhY3Q+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdChha2l0YURBTykuaW1wYWN0LAogICAgLy8gICBhcmdzOiBbYWNjb3VudF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBzd2FwCiAgICBwdXNoYnl0ZXMgInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTMzCiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KGFraXRhREFPKS5pbXBhY3QsCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMzItMTM1CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxJbXBhY3QucHJvdG90eXBlLmdldFVzZXJJbXBhY3Q+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdChha2l0YURBTykuaW1wYWN0LAogICAgLy8gICBhcmdzOiBbYWNjb3VudF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHhkNTc0YmIxMCAvLyBtZXRob2QgImdldFVzZXJJbXBhY3QoYWRkcmVzcyl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICBidXJ5IDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjgwCiAgICAvLyB0aGlzLmFraXRhUm95YWx0eS52YWx1ZSA9IGltcGFjdFJhbmdlKGltcGFjdCwgZmVlcy5yYWZmbGVTYWxlSW1wYWN0VGF4TWluLCBmZWVzLnJhZmZsZVNhbGVJbXBhY3RUYXhNYXgpCiAgICBkaWcgMQogICAgcHVzaGludCA5NiAvLyA5NgogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgMTQKICAgIHN3YXAKICAgIHB1c2hpbnQgMTA0IC8vIDEwNAogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgMTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTI3CiAgICAvLyBjb25zdCBtaW5JbXBhY3Q6IHVpbnQ2NCA9IChpbXBhY3QgPiAxKSA/IGltcGFjdCAtIDEgOiAxCiAgICBpbnRjXzEgLy8gMQogICAgPgogICAgYnogY3JlYXRlX3Rlcm5hcnlfZmFsc2VAMTQKICAgIGRpZyAxMwogICAgaW50Y18xIC8vIDEKICAgIC0KCmNyZWF0ZV90ZXJuYXJ5X21lcmdlQDE1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMjgKICAgIC8vIHJldHVybiBtYXggLSAoKChtYXggLSBtaW4pICogbWluSW1wYWN0KSAvIElNUEFDVF9ESVZJU09SKQogICAgZGlnIDEzCiAgICBkdXAKICAgIGRpZyAxNAogICAgLQogICAgdW5jb3ZlciAyCiAgICAqCiAgICBwdXNoaW50IDEwMDAgLy8gMTAwMAogICAgLwogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE0NAogICAgLy8gYWtpdGFSb3lhbHR5ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlBa2l0YVJveWFsdHkgfSkKICAgIGJ5dGVjIDI3IC8vICJha2l0YV9yb3lhbHR5IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI4MAogICAgLy8gdGhpcy5ha2l0YVJveWFsdHkudmFsdWUgPSBpbXBhY3RSYW5nZShpbXBhY3QsIGZlZXMucmFmZmxlU2FsZUltcGFjdFRheE1pbiwgZmVlcy5yYWZmbGVTYWxlSW1wYWN0VGF4TWF4KQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDgKICAgIC8vIGVudHJ5SUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVudHJ5SUQgfSkKICAgIGJ5dGVjIDMyIC8vICJlbnRyeV9pZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyODIKICAgIC8vIHRoaXMuZW50cnlJRC52YWx1ZSA9IDAKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE1MAogICAgLy8gd2VpZ2h0c0JveENvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlXZWlnaHRzQm94Q291bnQgfSkKICAgIGJ5dGVjIDEyIC8vICJ3ZWlnaHRzX2JveF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyODMKICAgIC8vIHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlID0gMAogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjg0CiAgICAvLyB0aGlzLndlaWdodFRvdGFscy52YWx1ZSA9IG5ldyBhcmM0LlN0YXRpY0FycmF5PFVpbnQ2NCwgMTU+KCkKICAgIHB1c2hpbnQgMTIwIC8vIDEyMAogICAgYnplcm8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTItMTU0CiAgICAvLyB3ZWlnaHRUb3RhbHMgPSBHbG9iYWxTdGF0ZTxhcmM0LlN0YXRpY0FycmF5PGFyYzQuVWludDY0LCAxNT4+KHsKICAgIC8vICAga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodFRvdGFscywKICAgIC8vIH0pCiAgICBieXRlYyA3IC8vICJ3X3RvdGFscyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyODQKICAgIC8vIHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlID0gbmV3IGFyYzQuU3RhdGljQXJyYXk8VWludDY0LCAxNT4oKQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHJlZnVuZE1CUkN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UmVmdW5kTUJSQ3Vyc29yIH0pCiAgICBieXRlYyAxNyAvLyAicmVmdW5kX21icl9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjg1CiAgICAvLyB0aGlzLnJlZnVuZE1CUkN1cnNvci52YWx1ZSA9IDAKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE0NgogICAgLy8gdnJmRmFpbHVyZUNvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlWUkZGYWlsdXJlQ291bnQgfSkKICAgIGJ5dGVjIDIwIC8vICJ2cmZfZmFpbHVyZV9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyODYKICAgIC8vIHRoaXMudnJmRmFpbHVyZUNvdW50LnZhbHVlID0gMAogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjMyCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKY3JlYXRlX3Rlcm5hcnlfZmFsc2VAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEyNwogICAgLy8gY29uc3QgbWluSW1wYWN0OiB1aW50NjQgPSAoaW1wYWN0ID4gMSkgPyBpbXBhY3QgLSAxIDogMQogICAgaW50Y18xIC8vIDEKICAgIGIgY3JlYXRlX3Rlcm5hcnlfbWVyZ2VAMTUKCmNyZWF0ZV9ib29sX2ZhbHNlQDY6CiAgICBpbnRjXzAgLy8gMAogICAgYiBjcmVhdGVfYm9vbF9tZXJnZUA3CgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaW5pdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmluaXQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjg5CiAgICAvLyBpbml0KHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgd2VpZ2h0TGlzdExlbmd0aDogdWludDY0KSB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyOTAKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSBHbG9iYWwuY3JlYXRvckFkZHJlc3MsIEVSUl9NVVNUX0JFX0NBTExFRF9GUk9NX0ZBQ1RPUlkpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgY3JlYXRvciBvZiB0aGlzIGFwcCBjYW4gY2FsbCB0aGlzIG1ldGhvZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI5MQogICAgLy8gYXNzZXJ0KHdlaWdodExpc3RMZW5ndGggPj0gNCwgRVJSX01VU1RfQUxMT0NBVEVfQVRfTEVBU1RfRk9VUl9ISUdIRVNUX0JJRFNfQ0hVTktTKQogICAgZHVwCiAgICBpbnRjXzMgLy8gNAogICAgPj0KICAgIGFzc2VydCAvLyBNdXN0IGFsbG9jYXRlIGF0IGxlYXN0IGZvdXIgd2VpZ2h0cyBjaHVua3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyOTIKICAgIC8vIGFzc2VydCh3ZWlnaHRMaXN0TGVuZ3RoIDwgMTYsIEVSUl9NVVNUX0FMTE9DQVRFX0FUX01PU1RfRklGVEVFTl9ISUdIRVNUX0JJRFNfQ0hVTktTKQogICAgZHVwCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA8CiAgICBhc3NlcnQgLy8gTXVzdCBhbGxvY2F0ZSBhdCBtb3N0IGZpZnRlZW4gd2VpZ2h0cyBjaHVua3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyOTYKICAgIC8vIGNvbnN0IHdlaWdodHNNQlI6IHVpbnQ2NCA9ICh3ZWlnaHRMaXN0TGVuZ3RoICogdGhpcy5tYnIoKS53ZWlnaHRzKQogICAgZHVwCiAgICBpbnRjIDExIC8vIDEzMTEzMzAwCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjk4LTMwNQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB3ZWlnaHRzTUJSLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMDEKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mjk4LTMwNQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB3ZWlnaHRzTUJSLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgdW5jb3ZlciAzCiAgICBndHhucyBBbW91bnQKICAgIHVuY292ZXIgMgogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUwCiAgICAvLyB3ZWlnaHRzQm94Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodHNCb3hDb3VudCB9KQogICAgYnl0ZWMgMTIgLy8gIndlaWdodHNfYm94X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMwNwogICAgLy8gdGhpcy53ZWlnaHRzQm94Q291bnQudmFsdWUgPSB3ZWlnaHRMaXN0TGVuZ3RoCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMwOAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHdlaWdodExpc3RMZW5ndGg7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCmluaXRfd2hpbGVfdG9wQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzA4CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgd2VpZ2h0TGlzdExlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGRpZyAyCiAgICA8CiAgICBieiBpbml0X2FmdGVyX3doaWxlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMDkKICAgIC8vIHRoaXMud2VpZ2h0cyhpKS5jcmVhdGUoKQogICAgZHVwbiAyCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTcxCiAgICAvLyB3ZWlnaHRzID0gQm94TWFwPHVpbnQ2NCwgV2VpZ2h0c0xpc3Q+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhXZWlnaHRzIH0pCiAgICBieXRlYyAxNCAvLyAidyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMwOQogICAgLy8gdGhpcy53ZWlnaHRzKGkpLmNyZWF0ZSgpCiAgICBwdXNoaW50IDMyNzY4IC8vIDMyNzY4CiAgICBib3hfY3JlYXRlCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMDgKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCB3ZWlnaHRMaXN0TGVuZ3RoOyBpICs9IDEpIHsKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgaW5pdF93aGlsZV90b3BAMgoKaW5pdF9hZnRlcl93aGlsZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjI4OQogICAgLy8gaW5pdChwYXltZW50OiBndHhuLlBheW1lbnRUeG4sIHdlaWdodExpc3RMZW5ndGg6IHVpbnQ2NCkgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLnJlZnVuZE1CUltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlZnVuZE1CUjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMTMKICAgIC8vIHJlZnVuZE1CUihpdGVyYXRpb25BbW91bnQ6IHVpbnQ2NCk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMTQKICAgIC8vIGNvbnN0IHRvdGFsQ2FwOiB1aW50NjQgPSB0aGlzLmVudHJ5Q291bnQudmFsdWUgLSAxCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMgogICAgLy8gZW50cnlDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW50cnlDb3VudCB9KQogICAgYnl0ZWNfMyAvLyAiZW50cnlfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzE0CiAgICAvLyBjb25zdCB0b3RhbENhcDogdWludDY0ID0gdGhpcy5lbnRyeUNvdW50LnZhbHVlIC0gMQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzE2CiAgICAvLyBhc3NlcnQodGhpcy53aW5uZXIudmFsdWUgIT09IEdsb2JhbC56ZXJvQWRkcmVzcywgRVJSX1dJTk5FUl9OT1RfRk9VTkQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzE2CiAgICAvLyBhc3NlcnQodGhpcy53aW5uZXIudmFsdWUgIT09IEdsb2JhbC56ZXJvQWRkcmVzcywgRVJSX1dJTk5FUl9OT1RfRk9VTkQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgYXNzZXJ0IC8vIFdpbm5lciBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMTgKICAgIC8vIGFzc2VydCh0b3RhbENhcCAhPT0gdGhpcy5yZWZ1bmRNQlJDdXJzb3IudmFsdWUsIEVSUl9BTExfUkVGVU5EU19DT01QTEVURSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyByZWZ1bmRNQlJDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVJlZnVuZE1CUkN1cnNvciB9KQogICAgYnl0ZWMgMTcgLy8gInJlZnVuZF9tYnJfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMxOAogICAgLy8gYXNzZXJ0KHRvdGFsQ2FwICE9PSB0aGlzLnJlZnVuZE1CUkN1cnNvci52YWx1ZSwgRVJSX0FMTF9SRUZVTkRTX0NPTVBMRVRFKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGR1cDIKICAgICE9CiAgICBhc3NlcnQgLy8gQWxsIHJlZnVuZHMgaGF2ZSBiZWVuIGNvbXBsZXRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMyMQogICAgLy8gY29uc3QgcmVtYWluZGVyOiB1aW50NjQgPSB0b3RhbENhcCAtIHRoaXMucmVmdW5kTUJSQ3Vyc29yLnZhbHVlCiAgICBzd2FwCiAgICBkaWcgMQogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMyMgogICAgLy8gaXRlcmF0aW9uQW1vdW50ID0gcmVtYWluZGVyID4gaXRlcmF0aW9uQW1vdW50ID8gaXRlcmF0aW9uQW1vdW50IDogcmVtYWluZGVyCiAgICBkdXAKICAgIGRpZyAzCiAgICA+CiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMjcKICAgIC8vIGNvbnN0IG9wVXBJdGVyYXRpb25BbW91bnQ6IHVpbnQ2NCA9IGl0ZXJhdGlvbkFtb3VudCAqIDEwMAogICAgcHVzaGludCAxMDAgLy8gMTAwCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzI4CiAgICAvLyBlbnN1cmVCdWRnZXQob3BVcEl0ZXJhdGlvbkFtb3VudCkKICAgIGludGNfMCAvLyAwCiAgICBjYWxsc3ViIGVuc3VyZV9idWRnZXQKCnJlZnVuZE1CUl93aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMzAKICAgIC8vIGZvciAobGV0IGkgPSBzdGFydGluZ0luZGV4OyBpIDwgaXRlcmF0aW9uQW1vdW50OyBpICs9IDEpIHsKICAgIGR1cAogICAgZGlnIDIKICAgIDwKICAgIGJ6IHJlZnVuZE1CUl9hZnRlcl93aGlsZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzMxCiAgICAvLyBjb25zdCB7IGFjY291bnQgfSA9IHRoaXMuZW50cmllcyhpKS52YWx1ZQogICAgZHVwbiAyCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTY5CiAgICAvLyBlbnRyaWVzID0gQm94TWFwPHVpbnQ2NCwgRW50cnlEYXRhPih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllcyB9KQogICAgYnl0ZWMgMjEgLy8gImUiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMzEKICAgIC8vIGNvbnN0IHsgYWNjb3VudCB9ID0gdGhpcy5lbnRyaWVzKGkpLnZhbHVlCiAgICBkdXAKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBleHRyYWN0IDAgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMzIKICAgIC8vIHRoaXMuZW50cmllcyhpKS5kZWxldGUoKQogICAgc3dhcAogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGJ5dGVjIDggLy8gImEiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzMzCiAgICAvLyB0aGlzLmVudHJpZXNCeUFkZHJlc3MoYWNjb3VudCkuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMzNC0zMzkKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIGFtb3VudDogZW50cnlUb3RhbE1CUiwKICAgIC8vICAgICByZWNlaXZlcjogYWNjb3VudCwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzI1CiAgICAvLyBjb25zdCBlbnRyeVRvdGFsTUJSOiB1aW50NjQgPSBjb3N0cy5lbnRyaWVzICsgY29zdHMuZW50cmllc0J5QWRkcmVzcwogICAgaW50YyA3IC8vIDUwNjAwCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjMzNC0zMzgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIGFtb3VudDogZW50cnlUb3RhbE1CUiwKICAgIC8vICAgICByZWNlaXZlcjogYWNjb3VudCwKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMzQtMzM5CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICBhbW91bnQ6IGVudHJ5VG90YWxNQlIsCiAgICAvLyAgICAgcmVjZWl2ZXI6IGFjY291bnQsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMzAKICAgIC8vIGZvciAobGV0IGkgPSBzdGFydGluZ0luZGV4OyBpIDwgaXRlcmF0aW9uQW1vdW50OyBpICs9IDEpIHsKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgcmVmdW5kTUJSX3doaWxlX3RvcEAyCgpyZWZ1bmRNQlJfYWZ0ZXJfd2hpbGVANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNDIKICAgIC8vIHRoaXMucmVmdW5kTUJSQ3Vyc29yLnZhbHVlICs9IGl0ZXJhdGlvbkFtb3VudAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHJlZnVuZE1CUkN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UmVmdW5kTUJSQ3Vyc29yIH0pCiAgICBieXRlYyAxNyAvLyAicmVmdW5kX21icl9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzQyCiAgICAvLyB0aGlzLnJlZnVuZE1CUkN1cnNvci52YWx1ZSArPSBpdGVyYXRpb25BbW91bnQKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkaWcgMgogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE2MgogICAgLy8gcmVmdW5kTUJSQ3Vyc29yID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlSZWZ1bmRNQlJDdXJzb3IgfSkKICAgIGJ5dGVjIDE3IC8vICJyZWZ1bmRfbWJyX2N1cnNvciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNDIKICAgIC8vIHRoaXMucmVmdW5kTUJSQ3Vyc29yLnZhbHVlICs9IGl0ZXJhdGlvbkFtb3VudAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozMTMKICAgIC8vIHJlZnVuZE1CUihpdGVyYXRpb25BbW91bnQ6IHVpbnQ2NCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmNsZWFyV2VpZ2h0c0JveGVzW3JvdXRpbmddKCkgLT4gdm9pZDoKY2xlYXJXZWlnaHRzQm94ZXM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzQ2CiAgICAvLyBhc3NlcnQodGhpcy5wcml6ZUNsYWltZWQudmFsdWUsIEVSUl9QUklaRV9OT1RfQ0xBSU1FRCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM0CiAgICAvLyBwcml6ZUNsYWltZWQgPSBHbG9iYWxTdGF0ZTxib29sZWFuPih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlQcml6ZUNsYWltZWQgfSkKICAgIGJ5dGVjIDE2IC8vICJwcml6ZV9jbGFpbWVkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM0NgogICAgLy8gYXNzZXJ0KHRoaXMucHJpemVDbGFpbWVkLnZhbHVlLCBFUlJfUFJJWkVfTk9UX0NMQUlNRUQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXJ0IC8vIFByaXplIGhhcyBub3QgYmVlbiBjbGFpbWVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzQ4CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgdGhpcy53ZWlnaHRzQm94Q291bnQudmFsdWU7IGkgKz0gMSkgewogICAgaW50Y18wIC8vIDAKCmNsZWFyV2VpZ2h0c0JveGVzX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM0OAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUwCiAgICAvLyB3ZWlnaHRzQm94Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodHNCb3hDb3VudCB9KQogICAgYnl0ZWMgMTIgLy8gIndlaWdodHNfYm94X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM0OAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlOyBpICs9IDEpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkaWcgMQogICAgPgogICAgYnogY2xlYXJXZWlnaHRzQm94ZXNfYWZ0ZXJfd2hpbGVANAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM0OQogICAgLy8gY29uc3Qgcmk6IHVpbnQ2NCA9ICh0aGlzLndlaWdodHNCb3hDb3VudC52YWx1ZSAtIDEpIC0gaQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTAKICAgIC8vIHdlaWdodHNCb3hDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0c0JveENvdW50IH0pCiAgICBieXRlYyAxMiAvLyAid2VpZ2h0c19ib3hfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzQ5CiAgICAvLyBjb25zdCByaTogdWludDY0ID0gKHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlIC0gMSkgLSBpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGRpZyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNTAKICAgIC8vIHRoaXMud2VpZ2h0cyhyaSkuZGVsZXRlKCkKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNzEKICAgIC8vIHdlaWdodHMgPSBCb3hNYXA8dWludDY0LCBXZWlnaHRzTGlzdD4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeFdlaWdodHMgfSkKICAgIGJ5dGVjIDE0IC8vICJ3IgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzUwCiAgICAvLyB0aGlzLndlaWdodHMocmkpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNDgKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCB0aGlzLndlaWdodHNCb3hDb3VudC52YWx1ZTsgaSArPSAxKSB7CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGNsZWFyV2VpZ2h0c0JveGVzX3doaWxlX3RvcEAyCgpjbGVhcldlaWdodHNCb3hlc19hZnRlcl93aGlsZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM1MwogICAgLy8gY29uc3QgcmV0dXJuQW1vdW50OiB1aW50NjQgPSB0aGlzLndlaWdodHNCb3hDb3VudC52YWx1ZSAqIHRoaXMubWJyKCkud2VpZ2h0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTAKICAgIC8vIHdlaWdodHNCb3hDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0c0JveENvdW50IH0pCiAgICBieXRlYyAxMiAvLyAid2VpZ2h0c19ib3hfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzUzCiAgICAvLyBjb25zdCByZXR1cm5BbW91bnQ6IHVpbnQ2NCA9IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlICogdGhpcy5tYnIoKS53ZWlnaHRzCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50YyAxMSAvLyAxMzExMzMwMAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM1NS0zNjAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3JlYXRvckFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiByZXR1cm5BbW91bnQsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM1NwogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jcmVhdG9yQWRkcmVzcywKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzU1LTM1OQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jcmVhdG9yQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHJldHVybkFtb3VudCwKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNTUtMzYwCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmNyZWF0b3JBZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogcmV0dXJuQW1vdW50LAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUwCiAgICAvLyB3ZWlnaHRzQm94Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodHNCb3hDb3VudCB9KQogICAgYnl0ZWMgMTIgLy8gIndlaWdodHNfYm94X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM2MgogICAgLy8gdGhpcy53ZWlnaHRzQm94Q291bnQudmFsdWUgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNDUKICAgIC8vIGNsZWFyV2VpZ2h0c0JveGVzKCk6IHVpbnQ2NCB7CiAgICBpdG9iCiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuZGVsZXRlQXBwbGljYXRpb25bcm91dGluZ10oKSAtPiB2b2lkOgpkZWxldGVBcHBsaWNhdGlvbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNjgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSBHbG9iYWwuY3JlYXRvckFkZHJlc3MsIEVSUl9NVVNUX0JFX0NBTExFRF9GUk9NX0ZBQ1RPUlkpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgY3JlYXRvciBvZiB0aGlzIGFwcCBjYW4gY2FsbCB0aGlzIG1ldGhvZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM2OQogICAgLy8gYXNzZXJ0KHRoaXMucHJpemVDbGFpbWVkLnZhbHVlLCBFUlJfUFJJWkVfTk9UX0NMQUlNRUQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzNAogICAgLy8gcHJpemVDbGFpbWVkID0gR2xvYmFsU3RhdGU8Ym9vbGVhbj4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemVDbGFpbWVkIH0pCiAgICBieXRlYyAxNiAvLyAicHJpemVfY2xhaW1lZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNjkKICAgIC8vIGFzc2VydCh0aGlzLnByaXplQ2xhaW1lZC52YWx1ZSwgRVJSX1BSSVpFX05PVF9DTEFJTUVEKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFzc2VydCAvLyBQcml6ZSBoYXMgbm90IGJlZW4gY2xhaW1lZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM3MAogICAgLy8gYXNzZXJ0KHRoaXMuZW50cnlDb3VudC52YWx1ZSAtIDEgIT09IHRoaXMucmVmdW5kTUJSQ3Vyc29yLnZhbHVlLCBFUlJfQUxMX1JFRlVORFNfQ09NUExFVEUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMgogICAgLy8gZW50cnlDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW50cnlDb3VudCB9KQogICAgYnl0ZWNfMyAvLyAiZW50cnlfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzcwCiAgICAvLyBhc3NlcnQodGhpcy5lbnRyeUNvdW50LnZhbHVlIC0gMSAhPT0gdGhpcy5yZWZ1bmRNQlJDdXJzb3IudmFsdWUsIEVSUl9BTExfUkVGVU5EU19DT01QTEVURSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNjIKICAgIC8vIHJlZnVuZE1CUkN1cnNvciA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UmVmdW5kTUJSQ3Vyc29yIH0pCiAgICBieXRlYyAxNyAvLyAicmVmdW5kX21icl9jdXJzb3IiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzcwCiAgICAvLyBhc3NlcnQodGhpcy5lbnRyeUNvdW50LnZhbHVlIC0gMSAhPT0gdGhpcy5yZWZ1bmRNQlJDdXJzb3IudmFsdWUsIEVSUl9BTExfUkVGVU5EU19DT01QTEVURSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAhPQogICAgYXNzZXJ0IC8vIEFsbCByZWZ1bmRzIGhhdmUgYmVlbiBjb21wbGV0ZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNzEKICAgIC8vIGFzc2VydCh0aGlzLndlaWdodHNCb3hDb3VudC52YWx1ZSA9PT0gMCwgRVJSX1NUSUxMX0hBU19XRUlHSFRTX0JPWEVTKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTAKICAgIC8vIHdlaWdodHNCb3hDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0c0JveENvdW50IH0pCiAgICBieXRlYyAxMiAvLyAid2VpZ2h0c19ib3hfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzcxCiAgICAvLyBhc3NlcnQodGhpcy53ZWlnaHRzQm94Q291bnQudmFsdWUgPT09IDAsIEVSUl9TVElMTF9IQVNfV0VJR0hUU19CT1hFUykKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAhCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzY2CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiAnRGVsZXRlQXBwbGljYXRpb24nIH0pCiAgICByZXR1cm4gLy8gb24gZXJyb3I6IFN0aWxsIGhhcyB3ZWlnaHRzIGJveGVzCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuZW50ZXJbcm91dGluZ10oKSAtPiB2b2lkOgplbnRlcjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozNzYtMzgwCiAgICAvLyBlbnRlcigKICAgIC8vICAgcGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBtYXJrZXRwbGFjZTogQWNjb3VudCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MKICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzgxCiAgICAvLyBhc3NlcnQodGhpcy5pc0xpdmUoKSwgRVJSX05PVF9MSVZFKQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5pc0xpdmUKICAgIGFzc2VydCAvLyBSYWZmbGUgaXMgbm90IGxpdmUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozODIKICAgIC8vIGFzc2VydCh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkID09PSAwLCBFUlJfVElDS0VUX0FTU0VUX05PVF9BTEdPKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MzgyCiAgICAvLyBhc3NlcnQodGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCA9PT0gMCwgRVJSX1RJQ0tFVF9BU1NFVF9OT1RfQUxHTykKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gdGlja2V0IGFzc2V0IGlzIG5vdCBhbGdvCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mzg0CiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM4CiAgICAvLyBnYXRlSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUdhdGVJRCB9KQogICAgYnl0ZWMgMTAgLy8gImdhdGVfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mzg0CiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieiBlbnRlcl9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozODUKICAgIC8vIGNvbnN0IHdhbGxldCA9IGdldFdhbGxldElEVXNpbmdBa2l0YURBTyh0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM4NQogICAgLy8gY29uc3Qgd2FsbGV0ID0gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozODYKICAgIC8vIGNvbnN0IG9yaWdpbiA9IG9yaWdpbk9yVHhuU2VuZGVyKHdhbGxldCkKICAgIGNhbGxzdWIgb3JpZ2luT3JUeG5TZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozODcKICAgIC8vIGFzc2VydChnYXRlQ2FsbCh0aGlzLmFraXRhREFPLnZhbHVlLCBvcmlnaW4sIHRoaXMuZ2F0ZUlELnZhbHVlLCBhcmdzKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM4NwogICAgLy8gYXNzZXJ0KGdhdGVDYWxsKHRoaXMuYWtpdGFEQU8udmFsdWUsIG9yaWdpbiwgdGhpcy5nYXRlSUQudmFsdWUsIGFyZ3MpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzgKICAgIC8vIGdhdGVJRCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5R2F0ZUlEIH0pCiAgICBieXRlYyAxMCAvLyAiZ2F0ZV9pZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozODcKICAgIC8vIGFzc2VydChnYXRlQ2FsbCh0aGlzLmFraXRhREFPLnZhbHVlLCBvcmlnaW4sIHRoaXMuZ2F0ZUlELnZhbHVlLCBhcmdzKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGRpZyAzCiAgICBjYWxsc3ViIGdhdGVDYWxsCiAgICBwb3AKICAgIGFzc2VydCAvLyBHYXRlIGNoZWNrIGZhaWxlZAoKZW50ZXJfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBieXRlYyA4IC8vICJhIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM5MAogICAgLy8gYXNzZXJ0KCF0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfQUxSRUFEWV9FTlRFUkVEKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozOTAKICAgIC8vIGFzc2VydCghdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX0FMUkVBRFlfRU5URVJFRCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIFlvdSBoYXZlIGFscmVhZHkgZW50ZXJlZCB0aGUgcmFmZmxlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mzk1LTQwNQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB7CiAgICAvLyAgICAgICBncmVhdGVyVGhhbkVxOiAodGhpcy5taW5UaWNrZXRzLnZhbHVlICsgbWJyKSwKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgKyBtYnIpLAogICAgLy8gICAgIH0KICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDIKICAgIGR1cAogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozOTgKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mzk1LTQwNQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB7CiAgICAvLyAgICAgICBncmVhdGVyVGhhbkVxOiAodGhpcy5taW5UaWNrZXRzLnZhbHVlICsgbWJyKSwKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgKyBtYnIpLAogICAgLy8gICAgIH0KICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHN3YXAKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQwMQogICAgLy8gbGVzc1RoYW5FcTogKHRoaXMubWF4VGlja2V0cy52YWx1ZSArIG1iciksCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMAogICAgLy8gbWF4VGlja2V0cyA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWF4VGlja2V0cyB9KQogICAgYnl0ZWMgMTUgLy8gIm1heF90aWNrZXRzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQwMQogICAgLy8gbGVzc1RoYW5FcTogKHRoaXMubWF4VGlja2V0cy52YWx1ZSArIG1iciksCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjM5MwogICAgLy8gY29uc3QgbWJyOiB1aW50NjQgPSBjb3N0cy5lbnRyaWVzICsgY29zdHMuZW50cmllc0J5QWRkcmVzcwogICAgaW50YyA3IC8vIDUwNjAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDAxCiAgICAvLyBsZXNzVGhhbkVxOiAodGhpcy5tYXhUaWNrZXRzLnZhbHVlICsgbWJyKSwKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozOTUtNDA1CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHsKICAgIC8vICAgICAgIGdyZWF0ZXJUaGFuRXE6ICh0aGlzLm1pblRpY2tldHMudmFsdWUgKyBtYnIpLAogICAgLy8gICAgICAgbGVzc1RoYW5FcTogKHRoaXMubWF4VGlja2V0cy52YWx1ZSArIG1iciksCiAgICAvLyAgICAgfQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMQogICAgPj0KICAgIHVuY292ZXIgMgogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MDcKICAgIC8vIGNvbnN0IGxvYyA9IHRoaXMuZW50cnlDb3VudC52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjIKICAgIC8vIGVudHJ5Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVudHJ5Q291bnQgfSkKICAgIGJ5dGVjXzMgLy8gImVudHJ5X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQwNwogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyeUNvdW50LnZhbHVlCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQwOQogICAgLy8gYWNjb3VudDogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MDgtNDExCiAgICAvLyB0aGlzLmVudHJpZXMobG9jKS52YWx1ZSA9IHsKICAgIC8vICAgYWNjb3VudDogVHhuLnNlbmRlciwKICAgIC8vICAgbWFya2V0cGxhY2UsCiAgICAvLyB9CiAgICBkaWcgNAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDA4CiAgICAvLyB0aGlzLmVudHJpZXMobG9jKS52YWx1ZSA9IHsKICAgIGRpZyAxCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTY5CiAgICAvLyBlbnRyaWVzID0gQm94TWFwPHVpbnQ2NCwgRW50cnlEYXRhPih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllcyB9KQogICAgYnl0ZWMgMjEgLy8gImUiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDA4LTQxMQogICAgLy8gdGhpcy5lbnRyaWVzKGxvYykudmFsdWUgPSB7CiAgICAvLyAgIGFjY291bnQ6IFR4bi5zZW5kZXIsCiAgICAvLyAgIG1hcmtldHBsYWNlLAogICAgLy8gfQogICAgdW5jb3ZlciAyCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGJ5dGVjIDggLy8gImEiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDEyCiAgICAvLyB0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikudmFsdWUgPSB0aGlzLmVudHJ5Q291bnQudmFsdWUKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNzMKICAgIC8vIGVudHJpZXNCeUFkZHJlc3MgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllc0J5QWRkcmVzcyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDEyCiAgICAvLyB0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikudmFsdWUgPSB0aGlzLmVudHJ5Q291bnQudmFsdWUKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MTQKICAgIC8vIGNvbnN0IGFtb3VudDogdWludDY0ID0gcGF5bWVudC5hbW91bnQgLSBtYnIKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czozOTMKICAgIC8vIGNvbnN0IG1icjogdWludDY0ID0gY29zdHMuZW50cmllcyArIGNvc3RzLmVudHJpZXNCeUFkZHJlc3MKICAgIGludGMgNyAvLyA1MDYwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQxNAogICAgLy8gY29uc3QgYW1vdW50OiB1aW50NjQgPSBwYXltZW50LmFtb3VudCAtIG1icgogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQxNgogICAgLy8gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXSA9IG5ldyBVaW50NjQoYW1vdW50KQogICAgZHVwCiAgICBpdG9iCiAgICBkaWcgMgogICAgaW50YyA0IC8vIDQwOTYKICAgIC8KICAgIGR1cAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MQogICAgLy8gd2VpZ2h0cyA9IEJveE1hcDx1aW50NjQsIFdlaWdodHNMaXN0Pih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4V2VpZ2h0cyB9KQogICAgYnl0ZWMgMTQgLy8gInciCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MTYKICAgIC8vIHRoaXMud2VpZ2h0cyhsb2MgLyBDaHVua1NpemUpLnZhbHVlW2xvYyAlIENodW5rU2l6ZV0gPSBuZXcgVWludDY0KGFtb3VudCkKICAgIHVuY292ZXIgNAogICAgaW50YyA0IC8vIDQwOTYKICAgICUKICAgIGludGNfMiAvLyA4CiAgICAqCiAgICB1bmNvdmVyIDMKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDE3CiAgICAvLyBjb25zdCBuZXdXZWlnaHQgPSBuZXcgVWludDY0KHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0uYXNVaW50NjQoKSArIGFtb3VudCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUyLTE1NAogICAgLy8gd2VpZ2h0VG90YWxzID0gR2xvYmFsU3RhdGU8YXJjNC5TdGF0aWNBcnJheTxhcmM0LlVpbnQ2NCwgMTU+Pih7CiAgICAvLyAgIGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlXZWlnaHRUb3RhbHMsCiAgICAvLyB9KQogICAgYnl0ZWMgNyAvLyAid190b3RhbHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDE3CiAgICAvLyBjb25zdCBuZXdXZWlnaHQgPSBuZXcgVWludDY0KHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0uYXNVaW50NjQoKSArIGFtb3VudCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBzd2FwCiAgICBpbnRjXzIgLy8gOAogICAgKgogICAgZHVwMgogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAzCiAgICArCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDE4CiAgICAvLyB0aGlzLndlaWdodFRvdGFscy52YWx1ZVtsb2MgLyBDaHVua1NpemVdID0gbmV3V2VpZ2h0CiAgICByZXBsYWNlMyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTItMTU0CiAgICAvLyB3ZWlnaHRUb3RhbHMgPSBHbG9iYWxTdGF0ZTxhcmM0LlN0YXRpY0FycmF5PGFyYzQuVWludDY0LCAxNT4+KHsKICAgIC8vICAga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodFRvdGFscywKICAgIC8vIH0pCiAgICBieXRlYyA3IC8vICJ3X3RvdGFscyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MTgKICAgIC8vIHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0gPSBuZXdXZWlnaHQKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDIwCiAgICAvLyB0aGlzLmVudHJ5Q291bnQudmFsdWUgKz0gMQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjIKICAgIC8vIGVudHJ5Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVudHJ5Q291bnQgfSkKICAgIGJ5dGVjXzMgLy8gImVudHJ5X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQyMAogICAgLy8gdGhpcy5lbnRyeUNvdW50LnZhbHVlICs9IDEKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMgogICAgLy8gZW50cnlDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW50cnlDb3VudCB9KQogICAgYnl0ZWNfMyAvLyAiZW50cnlfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDIwCiAgICAvLyB0aGlzLmVudHJ5Q291bnQudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MjEKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gdGlja2V0Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldENvdW50IH0pCiAgICBieXRlY18yIC8vICJ0aWNrZXRfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDIxCiAgICAvLyB0aGlzLnRpY2tldENvdW50LnZhbHVlICs9IGFtb3VudAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjQKICAgIC8vIHRpY2tldENvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRDb3VudCB9KQogICAgYnl0ZWNfMiAvLyAidGlja2V0X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQyMQogICAgLy8gdGhpcy50aWNrZXRDb3VudC52YWx1ZSArPSBhbW91bnQKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Mzc2LTM4MAogICAgLy8gZW50ZXIoCiAgICAvLyAgIHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgbWFya2V0cGxhY2U6IEFjY291bnQsCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5lbnRlckFzYVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmVudGVyQXNhOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQyNC00MjkKICAgIC8vIGVudGVyQXNhKAogICAgLy8gICBwYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIGFzc2V0WGZlcjogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICBtYXJrZXRwbGFjZTogQWNjb3VudCwKICAgIC8vICAgYXJnczogR2F0ZUFyZ3MKICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMiAvLyAyCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMyAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDMwCiAgICAvLyBhc3NlcnQodGhpcy5pc0xpdmUoKSwgRVJSX05PVF9MSVZFKQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5pc0xpdmUKICAgIGFzc2VydCAvLyBSYWZmbGUgaXMgbm90IGxpdmUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzEKICAgIC8vIGFzc2VydCh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkICE9PSAwLCBFUlJfVElDS0VUX0FTU0VUX0FMR08pCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzEKICAgIC8vIGFzc2VydCh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkICE9PSAwLCBFUlJfVElDS0VUX0FTU0VUX0FMR08pCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXJ0IC8vIHRpY2tldCBhc3NldCBpcyBhbGdvCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDMzCiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM4CiAgICAvLyBnYXRlSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUdhdGVJRCB9KQogICAgYnl0ZWMgMTAgLy8gImdhdGVfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDMzCiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieiBlbnRlckFzYV9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzQKICAgIC8vIGNvbnN0IHdhbGxldCA9IGdldFdhbGxldElEVXNpbmdBa2l0YURBTyh0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQzNAogICAgLy8gY29uc3Qgd2FsbGV0ID0gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzUKICAgIC8vIGNvbnN0IG9yaWdpbiA9IG9yaWdpbk9yVHhuU2VuZGVyKHdhbGxldCkKICAgIGNhbGxzdWIgb3JpZ2luT3JUeG5TZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzYKICAgIC8vIGFzc2VydChnYXRlQ2FsbCh0aGlzLmFraXRhREFPLnZhbHVlLCBvcmlnaW4sIHRoaXMuZ2F0ZUlELnZhbHVlLCBhcmdzKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQzNgogICAgLy8gYXNzZXJ0KGdhdGVDYWxsKHRoaXMuYWtpdGFEQU8udmFsdWUsIG9yaWdpbiwgdGhpcy5nYXRlSUQudmFsdWUsIGFyZ3MpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzgKICAgIC8vIGdhdGVJRCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5R2F0ZUlEIH0pCiAgICBieXRlYyAxMCAvLyAiZ2F0ZV9pZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzYKICAgIC8vIGFzc2VydChnYXRlQ2FsbCh0aGlzLmFraXRhREFPLnZhbHVlLCBvcmlnaW4sIHRoaXMuZ2F0ZUlELnZhbHVlLCBhcmdzKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHN3YXAKICAgIGNvdmVyIDIKICAgIGRpZyAzCiAgICBjYWxsc3ViIGdhdGVDYWxsCiAgICBwb3AKICAgIGFzc2VydCAvLyBHYXRlIGNoZWNrIGZhaWxlZAoKZW50ZXJBc2FfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBieXRlYyA4IC8vICJhIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQzOQogICAgLy8gYXNzZXJ0KCF0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfQUxSRUFEWV9FTlRFUkVEKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MzkKICAgIC8vIGFzc2VydCghdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX0FMUkVBRFlfRU5URVJFRCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIFlvdSBoYXZlIGFscmVhZHkgZW50ZXJlZCB0aGUgcmFmZmxlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDQ0LTQ1MQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBlbnRyeVRvdGFsTUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAzCiAgICBkdXAKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDQ3CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ0NC00NTEKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogZW50cnlUb3RhbE1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgc3dhcAogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDQyCiAgICAvLyBjb25zdCBlbnRyeVRvdGFsTUJSOiB1aW50NjQgPSBjb3N0cy5lbnRyaWVzICsgY29zdHMuZW50cmllc0J5QWRkcmVzcwogICAgaW50YyA3IC8vIDUwNjAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDQ0LTQ1MQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBlbnRyeVRvdGFsTUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ1My00NjQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHsKICAgIC8vICAgICAgIGdyZWF0ZXJUaGFuRXE6IHRoaXMubWluVGlja2V0cy52YWx1ZSwKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6IHRoaXMubWF4VGlja2V0cy52YWx1ZQogICAgLy8gICAgIH0KICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfVFJBTlNGRVIKICAgIC8vICkKICAgIGRpZyAyCiAgICBkdXAKICAgIGd0eG5zIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NTYKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NTMtNDY0CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgYXNzZXRYZmVyLAogICAgLy8gICB7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiB7CiAgICAvLyAgICAgICBncmVhdGVyVGhhbkVxOiB0aGlzLm1pblRpY2tldHMudmFsdWUsCiAgICAvLyAgICAgICBsZXNzVGhhbkVxOiB0aGlzLm1heFRpY2tldHMudmFsdWUKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICA9PQogICAgZGlnIDEKICAgIGd0eG5zIFhmZXJBc3NldAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ1NwogICAgLy8geGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDU3CiAgICAvLyB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ1My00NjQKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHsKICAgIC8vICAgICAgIGdyZWF0ZXJUaGFuRXE6IHRoaXMubWluVGlja2V0cy52YWx1ZSwKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6IHRoaXMubWF4VGlja2V0cy52YWx1ZQogICAgLy8gICAgIH0KICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfVFJBTlNGRVIKICAgIC8vICkKICAgID09CiAgICAmJgogICAgc3dhcAogICAgZ3R4bnMgQXNzZXRBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NjAKICAgIC8vIGxlc3NUaGFuRXE6IHRoaXMubWF4VGlja2V0cy52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjAKICAgIC8vIG1heFRpY2tldHMgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleU1heFRpY2tldHMgfSkKICAgIGJ5dGVjIDE1IC8vICJtYXhfdGlja2V0cyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NjAKICAgIC8vIGxlc3NUaGFuRXE6IHRoaXMubWF4VGlja2V0cy52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NTMtNDY0CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgYXNzZXRYZmVyLAogICAgLy8gICB7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiB7CiAgICAvLyAgICAgICBncmVhdGVyVGhhbkVxOiB0aGlzLm1pblRpY2tldHMudmFsdWUsCiAgICAvLyAgICAgICBsZXNzVGhhbkVxOiB0aGlzLm1heFRpY2tldHMudmFsdWUKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICBkaWcgMQogICAgPj0KICAgIHVuY292ZXIgMgogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHRyYW5zZmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDY2CiAgICAvLyBjb25zdCBsb2MgPSB0aGlzLmVudHJ5Q291bnQudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTIyCiAgICAvLyBlbnRyeUNvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbnRyeUNvdW50IH0pCiAgICBieXRlY18zIC8vICJlbnRyeV9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NjYKICAgIC8vIGNvbnN0IGxvYyA9IHRoaXMuZW50cnlDb3VudC52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NjgKICAgIC8vIGFjY291bnQ6IFR4bi5zZW5kZXIsCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDY3LTQ3MAogICAgLy8gdGhpcy5lbnRyaWVzKGxvYykudmFsdWUgPSB7CiAgICAvLyAgIGFjY291bnQ6IFR4bi5zZW5kZXIsCiAgICAvLyAgIG1hcmtldHBsYWNlCiAgICAvLyB9CiAgICBkaWcgNAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDY3CiAgICAvLyB0aGlzLmVudHJpZXMobG9jKS52YWx1ZSA9IHsKICAgIGRpZyAxCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTY5CiAgICAvLyBlbnRyaWVzID0gQm94TWFwPHVpbnQ2NCwgRW50cnlEYXRhPih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllcyB9KQogICAgYnl0ZWMgMjEgLy8gImUiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDY3LTQ3MAogICAgLy8gdGhpcy5lbnRyaWVzKGxvYykudmFsdWUgPSB7CiAgICAvLyAgIGFjY291bnQ6IFR4bi5zZW5kZXIsCiAgICAvLyAgIG1hcmtldHBsYWNlCiAgICAvLyB9CiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNzMKICAgIC8vIGVudHJpZXNCeUFkZHJlc3MgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllc0J5QWRkcmVzcyB9KQogICAgYnl0ZWMgOCAvLyAiYSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzEKICAgIC8vIHRoaXMuZW50cmllc0J5QWRkcmVzcyhUeG4uc2VuZGVyKS52YWx1ZSA9IGxvYwogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzEKICAgIC8vIHRoaXMuZW50cmllc0J5QWRkcmVzcyhUeG4uc2VuZGVyKS52YWx1ZSA9IGxvYwogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ3NAogICAgLy8gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXSA9IG5ldyBVaW50NjQoYW1vdW50KQogICAgZGlnIDEKICAgIGl0b2IKICAgIGRpZyAxCiAgICBpbnRjIDQgLy8gNDA5NgogICAgLwogICAgZHVwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTcxCiAgICAvLyB3ZWlnaHRzID0gQm94TWFwPHVpbnQ2NCwgV2VpZ2h0c0xpc3Q+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhXZWlnaHRzIH0pCiAgICBieXRlYyAxNCAvLyAidyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ3NAogICAgLy8gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXSA9IG5ldyBVaW50NjQoYW1vdW50KQogICAgdW5jb3ZlciAzCiAgICBpbnRjIDQgLy8gNDA5NgogICAgJQogICAgaW50Y18yIC8vIDgKICAgICoKICAgIHVuY292ZXIgMwogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzUKICAgIC8vIGNvbnN0IG5ld1dlaWdodCA9IG5ldyBVaW50NjQodGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgYW1vdW50KQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTItMTU0CiAgICAvLyB3ZWlnaHRUb3RhbHMgPSBHbG9iYWxTdGF0ZTxhcmM0LlN0YXRpY0FycmF5PGFyYzQuVWludDY0LCAxNT4+KHsKICAgIC8vICAga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodFRvdGFscywKICAgIC8vIH0pCiAgICBieXRlYyA3IC8vICJ3X3RvdGFscyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzUKICAgIC8vIGNvbnN0IG5ld1dlaWdodCA9IG5ldyBVaW50NjQodGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgYW1vdW50KQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHN3YXAKICAgIGludGNfMiAvLyA4CiAgICAqCiAgICBkdXAyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDMKICAgICsKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzYKICAgIC8vIHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0gPSBuZXdXZWlnaHQKICAgIHJlcGxhY2UzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE1Mi0xNTQKICAgIC8vIHdlaWdodFRvdGFscyA9IEdsb2JhbFN0YXRlPGFyYzQuU3RhdGljQXJyYXk8YXJjNC5VaW50NjQsIDE1Pj4oewogICAgLy8gICBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0VG90YWxzLAogICAgLy8gfSkKICAgIGJ5dGVjIDcgLy8gIndfdG90YWxzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ3NgogICAgLy8gdGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXSA9IG5ld1dlaWdodAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzgKICAgIC8vIHRoaXMuZW50cnlDb3VudC52YWx1ZSArPSAxCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMgogICAgLy8gZW50cnlDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW50cnlDb3VudCB9KQogICAgYnl0ZWNfMyAvLyAiZW50cnlfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDc4CiAgICAvLyB0aGlzLmVudHJ5Q291bnQudmFsdWUgKz0gMQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTIyCiAgICAvLyBlbnRyeUNvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbnRyeUNvdW50IH0pCiAgICBieXRlY18zIC8vICJlbnRyeV9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzgKICAgIC8vIHRoaXMuZW50cnlDb3VudC52YWx1ZSArPSAxCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ3OQogICAgLy8gdGhpcy50aWNrZXRDb3VudC52YWx1ZSArPSBhbW91bnQKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0NzkKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gdGlja2V0Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldENvdW50IH0pCiAgICBieXRlY18yIC8vICJ0aWNrZXRfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDc5CiAgICAvLyB0aGlzLnRpY2tldENvdW50LnZhbHVlICs9IGFtb3VudAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0MjQtNDI5CiAgICAvLyBlbnRlckFzYSgKICAgIC8vICAgcGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBhc3NldFhmZXI6IGd0eG4uQXNzZXRUcmFuc2ZlclR4biwKICAgIC8vICAgbWFya2V0cGxhY2U6IEFjY291bnQsCiAgICAvLyAgIGFyZ3M6IEdhdGVBcmdzCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5hZGRbcm91dGluZ10oKSAtPiB2b2lkOgphZGQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDgyCiAgICAvLyBhZGQocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBHYXRlQXJncyk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDgzCiAgICAvLyBhc3NlcnQodGhpcy5pc0xpdmUoKSwgRVJSX05PVF9MSVZFKQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5pc0xpdmUKICAgIGFzc2VydCAvLyBSYWZmbGUgaXMgbm90IGxpdmUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0ODQKICAgIC8vIGFzc2VydCh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkID09PSAwLCBFUlJfVElDS0VUX0FTU0VUX05PVF9BTEdPKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg0CiAgICAvLyBhc3NlcnQodGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCA9PT0gMCwgRVJSX1RJQ0tFVF9BU1NFVF9OT1RfQUxHTykKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gdGlja2V0IGFzc2V0IGlzIG5vdCBhbGdvCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg2CiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM4CiAgICAvLyBnYXRlSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUdhdGVJRCB9KQogICAgYnl0ZWMgMTAgLy8gImdhdGVfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg2CiAgICAvLyBpZiAodGhpcy5nYXRlSUQudmFsdWUgIT09IDApIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieiBhZGRfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg3CiAgICAvLyBjb25zdCB3YWxsZXQgPSBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8odGhpcy5ha2l0YURBTy52YWx1ZSwgVHhuLnNlbmRlcikKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0ODcKICAgIC8vIGNvbnN0IHdhbGxldCA9IGdldFdhbGxldElEVXNpbmdBa2l0YURBTyh0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg4CiAgICAvLyBjb25zdCBvcmlnaW4gPSBvcmlnaW5PclR4blNlbmRlcih3YWxsZXQpCiAgICBjYWxsc3ViIG9yaWdpbk9yVHhuU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg5CiAgICAvLyBhc3NlcnQoZ2F0ZUNhbGwodGhpcy5ha2l0YURBTy52YWx1ZSwgb3JpZ2luLCB0aGlzLmdhdGVJRC52YWx1ZSwgYXJncyksIEVSUl9GQUlMRURfR0FURSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0ODkKICAgIC8vIGFzc2VydChnYXRlQ2FsbCh0aGlzLmFraXRhREFPLnZhbHVlLCBvcmlnaW4sIHRoaXMuZ2F0ZUlELnZhbHVlLCBhcmdzKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM4CiAgICAvLyBnYXRlSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUdhdGVJRCB9KQogICAgYnl0ZWMgMTAgLy8gImdhdGVfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDg5CiAgICAvLyBhc3NlcnQoZ2F0ZUNhbGwodGhpcy5ha2l0YURBTy52YWx1ZSwgb3JpZ2luLCB0aGlzLmdhdGVJRC52YWx1ZSwgYXJncyksIEVSUl9GQUlMRURfR0FURSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBzd2FwCiAgICBjb3ZlciAyCiAgICBkaWcgMwogICAgY2FsbHN1YiBnYXRlQ2FsbAogICAgcG9wCiAgICBhc3NlcnQgLy8gR2F0ZSBjaGVjayBmYWlsZWQKCmFkZF9hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGJ5dGVjIDggLy8gImEiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDkyCiAgICAvLyBhc3NlcnQodGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX0VOVFJZX0RPRVNfTk9UX0VYSVNUKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0OTIKICAgIC8vIGFzc2VydCh0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfRU5UUllfRE9FU19OT1RfRVhJU1QpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFbnRyeSBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBieXRlYyA4IC8vICJhIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ5NAogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLnZhbHVlCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ5NAogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLnZhbHVlCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ5NQogICAgLy8gY29uc3QgYW1vdW50ID0gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXQogICAgZHVwCiAgICBpbnRjIDQgLy8gNDA5NgogICAgLwogICAgZHVwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTcxCiAgICAvLyB3ZWlnaHRzID0gQm94TWFwPHVpbnQ2NCwgV2VpZ2h0c0xpc3Q+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhXZWlnaHRzIH0pCiAgICBieXRlYyAxNCAvLyAidyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ5NQogICAgLy8gY29uc3QgYW1vdW50ID0gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXQogICAgdW5jb3ZlciAyCiAgICBpbnRjIDQgLy8gNDA5NgogICAgJQogICAgaW50Y18yIC8vIDgKICAgICoKICAgIGR1cDIKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjQ5Ny01MDYKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogewogICAgLy8gICAgICAgbGVzc1RoYW5FcTogKHRoaXMubWF4VGlja2V0cy52YWx1ZSAtIGFtb3VudC5hc1VpbnQ2NCgpKQogICAgLy8gICAgIH0KICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDUKICAgIGR1cAogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MDAKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDk3LTUwNgogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB7CiAgICAvLyAgICAgICBsZXNzVGhhbkVxOiAodGhpcy5tYXhUaWNrZXRzLnZhbHVlIC0gYW1vdW50LmFzVWludDY0KCkpCiAgICAvLyAgICAgfQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgc3dhcAogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTAyCiAgICAvLyBsZXNzVGhhbkVxOiAodGhpcy5tYXhUaWNrZXRzLnZhbHVlIC0gYW1vdW50LmFzVWludDY0KCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyMAogICAgLy8gbWF4VGlja2V0cyA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWF4VGlja2V0cyB9KQogICAgYnl0ZWMgMTUgLy8gIm1heF90aWNrZXRzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUwMgogICAgLy8gbGVzc1RoYW5FcTogKHRoaXMubWF4VGlja2V0cy52YWx1ZSAtIGFtb3VudC5hc1VpbnQ2NCgpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHVuY292ZXIgMwogICAgYnRvaQogICAgc3dhcAogICAgZGlnIDEKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo0OTctNTA2CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHsKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgLSBhbW91bnQuYXNVaW50NjQoKSkKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAyCiAgICA+PQogICAgdW5jb3ZlciAzCiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUwOQogICAgLy8gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgcGF5bWVudC5hbW91bnQKICAgIGR1cAogICAgZGlnIDIKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MDgtNTEwCiAgICAvLyBjb25zdCBuZXdXZWlnaHRzID0gbmV3IFVpbnQ2NCgKICAgIC8vICAgdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgcGF5bWVudC5hbW91bnQKICAgIC8vICkKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MTEKICAgIC8vIHRoaXMud2VpZ2h0cyhsb2MgLyBDaHVua1NpemUpLnZhbHVlW2xvYyAlIENodW5rU2l6ZV0gPSBuZXdXZWlnaHRzCiAgICB1bmNvdmVyIDQKICAgIHVuY292ZXIgNAogICAgdW5jb3ZlciAyCiAgICBib3hfcmVwbGFjZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUxMgogICAgLy8gY29uc3QgYm94QW1vdW50ID0gbmV3IFVpbnQ2NCh0aGlzLndlaWdodFRvdGFscy52YWx1ZVtsb2MgLyBDaHVua1NpemVdLmFzVWludDY0KCkgKyBwYXltZW50LmFtb3VudCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUyLTE1NAogICAgLy8gd2VpZ2h0VG90YWxzID0gR2xvYmFsU3RhdGU8YXJjNC5TdGF0aWNBcnJheTxhcmM0LlVpbnQ2NCwgMTU+Pih7CiAgICAvLyAgIGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlXZWlnaHRUb3RhbHMsCiAgICAvLyB9KQogICAgYnl0ZWMgNyAvLyAid190b3RhbHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTEyCiAgICAvLyBjb25zdCBib3hBbW91bnQgPSBuZXcgVWludDY0KHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0uYXNVaW50NjQoKSArIHBheW1lbnQuYW1vdW50KQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHVuY292ZXIgMwogICAgaW50Y18yIC8vIDgKICAgICoKICAgIGR1cDIKICAgIGV4dHJhY3RfdWludDY0CiAgICB1bmNvdmVyIDQKICAgICsKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MTMKICAgIC8vIHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0gPSBib3hBbW91bnQKICAgIHJlcGxhY2UzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE1Mi0xNTQKICAgIC8vIHdlaWdodFRvdGFscyA9IEdsb2JhbFN0YXRlPGFyYzQuU3RhdGljQXJyYXk8YXJjNC5VaW50NjQsIDE1Pj4oewogICAgLy8gICBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0VG90YWxzLAogICAgLy8gfSkKICAgIGJ5dGVjIDcgLy8gIndfdG90YWxzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUxMwogICAgLy8gdGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXSA9IGJveEFtb3VudAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NDgyCiAgICAvLyBhZGQocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhcmdzOiBHYXRlQXJncyk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmdhdGVkQWRkQXNhW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2F0ZWRBZGRBc2E6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTE3CiAgICAvLyBnYXRlZEFkZEFzYShnYXRlVHhuOiBndHhuLkFwcGxpY2F0aW9uQ2FsbFR4biwgYXNzZXRYZmVyOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4pOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBwdXNoaW50IDIgLy8gMgogICAgLQogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXBwbAogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18zIC8vIGF4ZmVyCiAgICA9PQogICAgcmV0dXJuIC8vIG9uIGVycm9yOiB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuYWRkQXNhW3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkQXNhOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUyMQogICAgLy8gYWRkQXNhKGFzc2V0WGZlcjogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLCBhcmdzOiBHYXRlQXJncyk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzMgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUyMgogICAgLy8gYXNzZXJ0KHRoaXMuaXNMaXZlKCksIEVSUl9OT1RfTElWRSkKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaXNMaXZlCiAgICBhc3NlcnQgLy8gUmFmZmxlIGlzIG5vdCBsaXZlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTIzCiAgICAvLyBhc3NlcnQodGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCAhPT0gMCwgRVJSX1RJQ0tFVF9BU1NFVF9BTEdPKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTIzCiAgICAvLyBhc3NlcnQodGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCAhPT0gMCwgRVJSX1RJQ0tFVF9BU1NFVF9BTEdPKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGR1cAogICAgYXNzZXJ0IC8vIHRpY2tldCBhc3NldCBpcyBhbGdvCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGJ5dGVjIDggLy8gImEiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTMxCiAgICAvLyBhc3NlcnQodGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX0VOVFJZX0RPRVNfTk9UX0VYSVNUKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1MzEKICAgIC8vIGFzc2VydCh0aGlzLmVudHJpZXNCeUFkZHJlc3MoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfRU5UUllfRE9FU19OT1RfRVhJU1QpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBFbnRyeSBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MwogICAgLy8gZW50cmllc0J5QWRkcmVzcyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzQnlBZGRyZXNzIH0pCiAgICBieXRlYyA4IC8vICJhIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzMwogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLnZhbHVlCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTczCiAgICAvLyBlbnRyaWVzQnlBZGRyZXNzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IFJhZmZsZUJveFByZWZpeEVudHJpZXNCeUFkZHJlc3MgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzMwogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKFR4bi5zZW5kZXIpLnZhbHVlCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzNAogICAgLy8gY29uc3QgYW1vdW50ID0gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXQogICAgZHVwCiAgICBpbnRjIDQgLy8gNDA5NgogICAgLwogICAgZHVwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTcxCiAgICAvLyB3ZWlnaHRzID0gQm94TWFwPHVpbnQ2NCwgV2VpZ2h0c0xpc3Q+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhXZWlnaHRzIH0pCiAgICBieXRlYyAxNCAvLyAidyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzNAogICAgLy8gY29uc3QgYW1vdW50ID0gdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXQogICAgdW5jb3ZlciAyCiAgICBpbnRjIDQgLy8gNDA5NgogICAgJQogICAgaW50Y18yIC8vIDgKICAgICoKICAgIGR1cDIKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzNi01NDYKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHsKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgLSBhbW91bnQuYXNVaW50NjQoKSkKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICBkaWcgNQogICAgZ3R4bnMgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzOQogICAgLy8gYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzNi01NDYKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHsKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgLSBhbW91bnQuYXNVaW50NjQoKSkKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICA9PQogICAgZGlnIDYKICAgIGd0eG5zIFhmZXJBc3NldAogICAgdW5jb3ZlciA2CiAgICA9PQogICAgJiYKICAgIHVuY292ZXIgNQogICAgZ3R4bnMgQXNzZXRBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NDIKICAgIC8vIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgLSBhbW91bnQuYXNVaW50NjQoKSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTIwCiAgICAvLyBtYXhUaWNrZXRzID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXhUaWNrZXRzIH0pCiAgICBieXRlYyAxNSAvLyAibWF4X3RpY2tldHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTQyCiAgICAvLyBsZXNzVGhhbkVxOiAodGhpcy5tYXhUaWNrZXRzLnZhbHVlIC0gYW1vdW50LmFzVWludDY0KCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdW5jb3ZlciAzCiAgICBidG9pCiAgICBzd2FwCiAgICBkaWcgMQogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjUzNi01NDYKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHsKICAgIC8vICAgICAgIGxlc3NUaGFuRXE6ICh0aGlzLm1heFRpY2tldHMudmFsdWUgLSBhbW91bnQuYXNVaW50NjQoKSkKICAgIC8vICAgICB9CiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICBkaWcgMgogICAgPj0KICAgIHVuY292ZXIgMwogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHRyYW5zZmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTQ5CiAgICAvLyB0aGlzLndlaWdodHMobG9jIC8gQ2h1bmtTaXplKS52YWx1ZVtsb2MgJSBDaHVua1NpemVdLmFzVWludDY0KCkgKyBhc3NldFhmZXIuYXNzZXRBbW91bnQKICAgIGR1cAogICAgZGlnIDIKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NDgtNTUwCiAgICAvLyBjb25zdCBuZXdXZWlnaHRzID0gbmV3IFVpbnQ2NCgKICAgIC8vICAgdGhpcy53ZWlnaHRzKGxvYyAvIENodW5rU2l6ZSkudmFsdWVbbG9jICUgQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgYXNzZXRYZmVyLmFzc2V0QW1vdW50CiAgICAvLyApCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTUxCiAgICAvLyB0aGlzLndlaWdodHMobG9jIC8gQ2h1bmtTaXplKS52YWx1ZVtsb2MgJSBDaHVua1NpemVdID0gbmV3V2VpZ2h0cwogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDQKICAgIHVuY292ZXIgMgogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTIKICAgIC8vIGNvbnN0IGJveEFtb3VudCA9IG5ldyBVaW50NjQodGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgYXNzZXRYZmVyLmFzc2V0QW1vdW50KQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNTItMTU0CiAgICAvLyB3ZWlnaHRUb3RhbHMgPSBHbG9iYWxTdGF0ZTxhcmM0LlN0YXRpY0FycmF5PGFyYzQuVWludDY0LCAxNT4+KHsKICAgIC8vICAga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodFRvdGFscywKICAgIC8vIH0pCiAgICBieXRlYyA3IC8vICJ3X3RvdGFscyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTIKICAgIC8vIGNvbnN0IGJveEFtb3VudCA9IG5ldyBVaW50NjQodGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXS5hc1VpbnQ2NCgpICsgYXNzZXRYZmVyLmFzc2V0QW1vdW50KQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHVuY292ZXIgMwogICAgaW50Y18yIC8vIDgKICAgICoKICAgIGR1cDIKICAgIGV4dHJhY3RfdWludDY0CiAgICB1bmNvdmVyIDQKICAgICsKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTMKICAgIC8vIHRoaXMud2VpZ2h0VG90YWxzLnZhbHVlW2xvYyAvIENodW5rU2l6ZV0gPSBib3hBbW91bnQKICAgIHJlcGxhY2UzIC8vIG9uIGVycm9yOiBpbmRleCBhY2Nlc3MgaXMgb3V0IG9mIGJvdW5kcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE1Mi0xNTQKICAgIC8vIHdlaWdodFRvdGFscyA9IEdsb2JhbFN0YXRlPGFyYzQuU3RhdGljQXJyYXk8YXJjNC5VaW50NjQsIDE1Pj4oewogICAgLy8gICBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0VG90YWxzLAogICAgLy8gfSkKICAgIGJ5dGVjIDcgLy8gIndfdG90YWxzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU1MwogICAgLy8gdGhpcy53ZWlnaHRUb3RhbHMudmFsdWVbbG9jIC8gQ2h1bmtTaXplXSA9IGJveEFtb3VudAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTQKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUgKz0gYW1vdW50LmFzVWludDY0KCkKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTIxCiAgICAvLyBhZGRBc2EoYXNzZXRYZmVyOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sIGFyZ3M6IEdhdGVBcmdzKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUucmFmZmxlW3JvdXRpbmddKCkgLT4gdm9pZDoKcmFmZmxlOgogICAgaW50Y18wIC8vIDAKICAgIGR1cG4gMgogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NTkKICAgIC8vIGNvbnN0IHJvdW5kVG9Vc2U6IHVpbnQ2NCA9IHRoaXMuZW5kVGltZXN0YW1wLnZhbHVlICsgMSArICg0ICogdGhpcy52cmZGYWlsdXJlQ291bnQudmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExNAogICAgLy8gZW5kVGltZXN0YW1wID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbmRUaW1lc3RhbXAgfSkKICAgIGJ5dGVjIDE4IC8vICJlbmRfdGltZXN0YW1wIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU1OQogICAgLy8gY29uc3Qgcm91bmRUb1VzZTogdWludDY0ID0gdGhpcy5lbmRUaW1lc3RhbXAudmFsdWUgKyAxICsgKDQgKiB0aGlzLnZyZkZhaWx1cmVDb3VudC52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDYKICAgIC8vIHZyZkZhaWx1cmVDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VlJGRmFpbHVyZUNvdW50IH0pCiAgICBieXRlYyAyMCAvLyAidnJmX2ZhaWx1cmVfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTU5CiAgICAvLyBjb25zdCByb3VuZFRvVXNlOiB1aW50NjQgPSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZSArIDEgKyAoNCAqIHRoaXMudnJmRmFpbHVyZUNvdW50LnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMyAvLyA0CiAgICAqCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTYwCiAgICAvLyBhc3NlcnQoR2xvYmFsLnJvdW5kID49IHJvdW5kVG9Vc2UgKyA4LCBFUlJfTk9UX0VOT1VHSF9USU1FKQogICAgZ2xvYmFsIFJvdW5kCiAgICBkaWcgMQogICAgaW50Y18yIC8vIDgKICAgICsKICAgID49CiAgICBhc3NlcnQgLy8gTm90IGVub3VnaCB0aW1lIGhhcyBwYXNzZWQgc2luY2UgdGhlIHJhZmZsZSBlbmRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2MQogICAgLy8gYXNzZXJ0KHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA9PT0gMCwgRVJSX1dJTk5FUl9BTFJFQURZX0RSQVdOKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjYKICAgIC8vIHdpbm5pbmdUaWNrZXQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5pbmdUaWNrZXQgfSkKICAgIGJ5dGVjIDkgLy8gIndpbm5pbmdfdGlja2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2MQogICAgLy8gYXNzZXJ0KHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA9PT0gMCwgRVJSX1dJTk5FUl9BTFJFQURZX0RSQVdOKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgICEKICAgIGFzc2VydCAvLyBXaW5uaW5nIHRpY2tldCBoYXMgYWxyZWFkeSBiZWVuIGRyYXduCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTYzLTU2NgogICAgLy8gY29uc3Qgc2VlZCA9IGFiaUNhbGw8dHlwZW9mIFJhbmRvbW5lc3NCZWFjb24ucHJvdG90eXBlLmdldD4oewogICAgLy8gICBhcHBJZDogZ2V0T3RoZXJBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnZyZkJlYWNvbiwKICAgIC8vICAgYXJnczogW3JvdW5kVG9Vc2UsIHRoaXMuc2FsdC52YWx1ZV0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2NAogICAgLy8gYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS52cmZCZWFjb24sCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTY0CiAgICAvLyBhcHBJZDogZ2V0T3RoZXJBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnZyZkJlYWNvbiwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU1CiAgICAvLyBjb25zdCBbb3RoZXJBcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzT3RoZXJBcHBMaXN0KSkKICAgIGJ5dGVjIDI0IC8vICJvYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTY0CiAgICAvLyBhcHBJZDogZ2V0T3RoZXJBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnZyZkJlYWNvbiwKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2NQogICAgLy8gYXJnczogW3JvdW5kVG9Vc2UsIHRoaXMuc2FsdC52YWx1ZV0sCiAgICBzd2FwCiAgICBpdG9iCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE2NAogICAgLy8gc2FsdCA9IEdsb2JhbFN0YXRlPGJ5dGVzPih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlTYWx0IH0pCiAgICBwdXNoYnl0ZXMgInNhbHQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTY1CiAgICAvLyBhcmdzOiBbcm91bmRUb1VzZSwgdGhpcy5zYWx0LnZhbHVlXSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2My01NjYKICAgIC8vIGNvbnN0IHNlZWQgPSBhYmlDYWxsPHR5cGVvZiBSYW5kb21uZXNzQmVhY29uLnByb3RvdHlwZS5nZXQ+KHsKICAgIC8vICAgYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS52cmZCZWFjb24sCiAgICAvLyAgIGFyZ3M6IFtyb3VuZFRvVXNlLCB0aGlzLnNhbHQudmFsdWVdLAogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDE4OTM5MmM1IC8vIG1ldGhvZCAiZ2V0KHVpbnQ2NCxieXRlW10pYnl0ZVtdIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjIDUgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCA2IDAKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2OAogICAgLy8gaWYgKHNlZWQubGVuZ3RoID09PSAwKSB7CiAgICBsZW4KICAgIGR1cAogICAgYm56IHJhZmZsZV9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NjkKICAgIC8vIHRoaXMudnJmRmFpbHVyZUNvdW50LnZhbHVlICs9IDEKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQ2CiAgICAvLyB2cmZGYWlsdXJlQ291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVZSRkZhaWx1cmVDb3VudCB9KQogICAgYnl0ZWMgMjAgLy8gInZyZl9mYWlsdXJlX2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2OQogICAgLy8gdGhpcy52cmZGYWlsdXJlQ291bnQudmFsdWUgKz0gMQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMSAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQ2CiAgICAvLyB2cmZGYWlsdXJlQ291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVZSRkZhaWx1cmVDb3VudCB9KQogICAgYnl0ZWMgMjAgLy8gInZyZl9mYWlsdXJlX2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU2OQogICAgLy8gdGhpcy52cmZGYWlsdXJlQ291bnQudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKCnJhZmZsZV9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLnJhZmZsZUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU1NwogICAgLy8gcmFmZmxlKCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKcmFmZmxlX2FmdGVyX2lmX2Vsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NzMKICAgIC8vIGNvbnN0IHJuZ1N0YXRlID0gcGNnNjRJbml0KHNlZWQuc2xpY2UoMCwgMTYpKQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgID49CiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBkaWcgMgogICAgPj0KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGRpZyAzCiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjE2CiAgICAvLyBhc3NlcnQoc2VlZC5sZW5ndGggPT09IDE2KQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6MTkKICAgIC8vIF9fcGNnMzJJbml0KG9wLmV4dHJhY3RVaW50NjQoc2VlZCwgMCksIHBjZ0ZpcnN0SW5jcmVtZW50KSwKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjkyCiAgICAvLyBjb25zdCBzdGF0ZSA9IF9fcGNnMzJTdGVwKDAsIGluY3IpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoxNwogICAgLy8gY29uc3QgWywgbXVsTG93XSA9IG9wLm11bHcoc3RhdGUsIHBjZ011bHRpcGxpZXIpCiAgICBpbnRjIDYgLy8gNjM2NDEzNjIyMzg0Njc5MzAwNQogICAgbXVsdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjE4CiAgICAvLyBjb25zdCBbLCBhZGRMb3ddID0gb3AuYWRkdyhtdWxMb3csIGluY3IpCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6MTkKICAgIC8vIF9fcGNnMzJJbml0KG9wLmV4dHJhY3RVaW50NjQoc2VlZCwgMCksIHBjZ0ZpcnN0SW5jcmVtZW50KSwKICAgIGludGMgOCAvLyAxNDQyNjk1MDQwODg4OTYzNDA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjE4CiAgICAvLyBjb25zdCBbLCBhZGRMb3ddID0gb3AuYWRkdyhtdWxMb3csIGluY3IpCiAgICBhZGR3CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6OTMKICAgIC8vIGNvbnN0IFssIGFkZExvd10gPSBvcC5hZGR3KHN0YXRlLCBpbml0aWFsU3RhdGUpCiAgICB1bmNvdmVyIDIKICAgIGFkZHcKICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoxNwogICAgLy8gY29uc3QgWywgbXVsTG93XSA9IG9wLm11bHcoc3RhdGUsIHBjZ011bHRpcGxpZXIpCiAgICBpbnRjIDYgLy8gNjM2NDEzNjIyMzg0Njc5MzAwNQogICAgbXVsdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjE5CiAgICAvLyBfX3BjZzMySW5pdChvcC5leHRyYWN0VWludDY0KHNlZWQsIDApLCBwY2dGaXJzdEluY3JlbWVudCksCiAgICBpbnRjIDggLy8gMTQ0MjY5NTA0MDg4ODk2MzQwNwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoxOAogICAgLy8gY29uc3QgWywgYWRkTG93XSA9IG9wLmFkZHcobXVsTG93LCBpbmNyKQogICAgYWRkdwogICAgY292ZXIgMgogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjIwCiAgICAvLyBfX3BjZzMySW5pdChvcC5leHRyYWN0VWludDY0KHNlZWQsIDgpLCBwY2dTZWNvbmRJbmNyZW1lbnQpLAogICAgdW5jb3ZlciAyCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MTgKICAgIC8vIGNvbnN0IFssIGFkZExvd10gPSBvcC5hZGR3KG11bExvdywgaW5jcikKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6MjAKICAgIC8vIF9fcGNnMzJJbml0KG9wLmV4dHJhY3RVaW50NjQoc2VlZCwgOCksIHBjZ1NlY29uZEluY3JlbWVudCksCiAgICBpbnRjIDkgLy8gMTQ0MjY5NTA0MDg4ODk2MzQwOQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoxOAogICAgLy8gY29uc3QgWywgYWRkTG93XSA9IG9wLmFkZHcobXVsTG93LCBpbmNyKQogICAgYWRkdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjkzCiAgICAvLyBjb25zdCBbLCBhZGRMb3ddID0gb3AuYWRkdyhzdGF0ZSwgaW5pdGlhbFN0YXRlKQogICAgYWRkdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjE3CiAgICAvLyBjb25zdCBbLCBtdWxMb3ddID0gb3AubXVsdyhzdGF0ZSwgcGNnTXVsdGlwbGllcikKICAgIGludGMgNiAvLyA2MzY0MTM2MjIzODQ2NzkzMDA1CiAgICBtdWx3CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6MjAKICAgIC8vIF9fcGNnMzJJbml0KG9wLmV4dHJhY3RVaW50NjQoc2VlZCwgOCksIHBjZ1NlY29uZEluY3JlbWVudCksCiAgICBpbnRjIDkgLy8gMTQ0MjY5NTA0MDg4ODk2MzQwOQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnMzIuYWxnby50czoxOAogICAgLy8gY29uc3QgWywgYWRkTG93XSA9IG9wLmFkZHcobXVsTG93LCBpbmNyKQogICAgYWRkdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjE4LTIxCiAgICAvLyByZXR1cm4gWwogICAgLy8gICAgIF9fcGNnMzJJbml0KG9wLmV4dHJhY3RVaW50NjQoc2VlZCwgMCksIHBjZ0ZpcnN0SW5jcmVtZW50KSwKICAgIC8vICAgICBfX3BjZzMySW5pdChvcC5leHRyYWN0VWludDY0KHNlZWQsIDgpLCBwY2dTZWNvbmRJbmNyZW1lbnQpLAogICAgLy8gXQogICAgc3dhcAogICAgaXRvYgogICAgc3dhcAogICAgaXRvYgogICAgY29uY2F0CiAgICBidXJ5IDEyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTc2CiAgICAvLyBsZXQgdXBwZXJCb3VuZCA9IHRoaXMudGlja2V0Q291bnQudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NzYKICAgIC8vIGxldCB1cHBlckJvdW5kID0gdGhpcy50aWNrZXRDb3VudC52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHN3YXAKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA1CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTc3CiAgICAvLyBpZiAodXBwZXJCb3VuZCA8IE1BWF9VSU5UNjQpIHsKICAgIGludGMgMTIgLy8gMTg0NDY3NDQwNzM3MDk1NTE2MTUKICAgIDwKICAgIGJ6IHJhZmZsZV9hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1NzgKICAgIC8vIHVwcGVyQm91bmQgPSB1cHBlckJvdW5kICs9IDEKICAgIGRpZyAyCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAzCgpyYWZmbGVfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnNjQuYWxnby50czozMAogICAgLy8gY29uc3QgcmVzdWx0ID0gbmV3IER5bmFtaWNBcnJheTxhcmM0LlVpbnQ2ND4oKQogICAgYnl0ZWMgMzMgLy8gMHgwMDAwCiAgICBidXJ5IDEzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjQyCiAgICAvLyBpZiAodXBwZXJCb3VuZCAhPT0gMCkgewogICAgZGlnIDIKICAgIGJ6IHJhZmZsZV9lbHNlX2JvZHlAMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6NDMKICAgIC8vIGFzc2VydCh1cHBlckJvdW5kID4gMSkKICAgIGRpZyAyCiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICA+CiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6NDQKICAgIC8vIGFzc2VydChsb3dlckJvdW5kIDwgdXBwZXJCb3VuZCAtIDEpCiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBidXJ5IDExCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTgxCiAgICAvLyBjb25zdCBybmdSZXN1bHQgPSBwY2c2NFJhbmRvbShybmdTdGF0ZSwgMSwgdXBwZXJCb3VuZCwgMSkKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjQ0CiAgICAvLyBhc3NlcnQobG93ZXJCb3VuZCA8IHVwcGVyQm91bmQgLSAxKQogICAgPgogICAgYXNzZXJ0CgpyYWZmbGVfYWZ0ZXJfaWZfZWxzZUAxNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6OAogICAgLy8gY29uc3QgWywgYWRkTG93XSA9IG9wLmFkZHcofnZhbHVlLCAxKQogICAgZGlnIDkKICAgIGR1cAogICAgfgogICAgaW50Y18xIC8vIDEKICAgIGFkZHcKICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnNjQuYWxnby50czo1MwogICAgLy8gY29uc3QgdGhyZXNob2xkOiB1aW50NjQgPSBfX3VpbnQ2NFR3b3MoYWJzb2x1dGVCb3VuZCkgJSBhYnNvbHV0ZUJvdW5kCiAgICBzd2FwCiAgICAlCiAgICBidXJ5IDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6NTUKICAgIC8vIGZvciAobGV0IGkgPSBVaW50NjQoMCk7IGkgPCBsZW5ndGg7IGkgPSBpICsgMSkgewogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgNwogICAgZGlnIDExCiAgICBidXJ5IDExCgpyYWZmbGVfd2hpbGVfdG9wQDE4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnNjQuYWxnby50czo1NQogICAgLy8gZm9yIChsZXQgaSA9IFVpbnQ2NCgwKTsgaSA8IGxlbmd0aDsgaSA9IGkgKyAxKSB7CiAgICBkaWcgNgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU4MQogICAgLy8gY29uc3Qgcm5nUmVzdWx0ID0gcGNnNjRSYW5kb20ocm5nU3RhdGUsIDEsIHVwcGVyQm91bmQsIDEpCiAgICBpbnRjXzEgLy8gMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnNjQuYWxnby50czo1NQogICAgLy8gZm9yIChsZXQgaSA9IFVpbnQ2NCgwKTsgaSA8IGxlbmd0aDsgaSA9IGkgKyAxKSB7CiAgICA8CiAgICBieiByYWZmbGVfYWZ0ZXJfd2hpbGVAMjMKCnJhZmZsZV93aGlsZV90b3BAMjA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjkKICAgIC8vIGNvbnN0IG5ld1N0YXRlMSA9IF9fcGNnMzJTdGVwKHN0YXRlWzBdLCBwY2dGaXJzdEluY3JlbWVudCkKICAgIGRpZyAxMAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgYnVyeSA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjE3CiAgICAvLyBjb25zdCBbLCBtdWxMb3ddID0gb3AubXVsdyhzdGF0ZSwgcGNnTXVsdGlwbGllcikKICAgIGludGMgNiAvLyA2MzY0MTM2MjIzODQ2NzkzMDA1CiAgICBtdWx3CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6OQogICAgLy8gY29uc3QgbmV3U3RhdGUxID0gX19wY2czMlN0ZXAoc3RhdGVbMF0sIHBjZ0ZpcnN0SW5jcmVtZW50KQogICAgaW50YyA4IC8vIDE0NDI2OTUwNDA4ODg5NjM0MDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MTgKICAgIC8vIGNvbnN0IFssIGFkZExvd10gPSBvcC5hZGR3KG11bExvdywgaW5jcikKICAgIGFkZHcKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSAxMgogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjEwCiAgICAvLyBjb25zdCBuZXdTdGF0ZTIgPSBfX3BjZzMyU3RlcChzdGF0ZVsxXSwgbmV3U3RhdGUxID09PSAwID8gb3Auc2hsKHBjZ1NlY29uZEluY3JlbWVudCwgMSkgOiBwY2dTZWNvbmRJbmNyZW1lbnQpCiAgICBzd2FwCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgNwogICAgYm56IHJhZmZsZV90ZXJuYXJ5X2ZhbHNlQDI3CiAgICBwdXNoaW50IDI4ODUzOTAwODE3Nzc5MjY4MTggLy8gMjg4NTM5MDA4MTc3NzkyNjgxOAoKcmFmZmxlX3Rlcm5hcnlfbWVyZ2VAMjg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2czMi5hbGdvLnRzOjE3CiAgICAvLyBjb25zdCBbLCBtdWxMb3ddID0gb3AubXVsdyhzdGF0ZSwgcGNnTXVsdGlwbGllcikKICAgIGRpZyA2CiAgICBkdXAKICAgIGludGMgNiAvLyA2MzY0MTM2MjIzODQ2NzkzMDA1CiAgICBtdWx3CiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzMyLmFsZ28udHM6MTgKICAgIC8vIGNvbnN0IFssIGFkZExvd10gPSBvcC5hZGR3KG11bExvdywgaW5jcikKICAgIHVuY292ZXIgMgogICAgYWRkdwogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjEyCiAgICAvLyByZXR1cm4gW1tuZXdTdGF0ZTEsIG5ld1N0YXRlMl0sIG9wLnNobChfX3BjZzMyT3V0cHV0KHN0YXRlWzBdKSwgMzIpIHwgX19wY2czMk91dHB1dChzdGF0ZVsxXSldCiAgICBkaWcgMTAKICAgIGl0b2IKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZGlnIDYKICAgIGNhbGxzdWIgX19wY2czMk91dHB1dAogICAgcHVzaGludCAzMiAvLyAzMgogICAgc2hsCiAgICB1bmNvdmVyIDIKICAgIGNhbGxzdWIgX19wY2czMk91dHB1dAogICAgfAogICAgaXRvYgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjU3CiAgICAvLyBjb25zdCBbbmV3U3RhdGUsIGNhbmRpZGF0ZV0gPSBfX3BjZzY0VW5ib3VuZGVkUmFuZG9tKHN0YXRlKQogICAgZHVwCiAgICBleHRyYWN0IDAgMTYKICAgIHN3YXAKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGJ1cnkgMTAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6NTkKICAgIC8vIGlmIChjYW5kaWRhdGUgPj0gdGhyZXNob2xkKSB7CiAgICBkaWcgNQogICAgPj0KICAgIGJ6IHJhZmZsZV9hZnRlcl9pZl9lbHNlQDIyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjYwCiAgICAvLyByZXN1bHQucHVzaChuZXcgYXJjNC5VaW50NjQoKGNhbmRpZGF0ZSAlIGFic29sdXRlQm91bmQpICsgbG93ZXJCb3VuZCkpCiAgICBkaWcgOAogICAgZGlnIDExCiAgICAlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTgxCiAgICAvLyBjb25zdCBybmdSZXN1bHQgPSBwY2c2NFJhbmRvbShybmdTdGF0ZSwgMSwgdXBwZXJCb3VuZCwgMSkKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjYwCiAgICAvLyByZXN1bHQucHVzaChuZXcgYXJjNC5VaW50NjQoKGNhbmRpZGF0ZSAlIGFic29sdXRlQm91bmQpICsgbG93ZXJCb3VuZCkpCiAgICArCiAgICBpdG9iCiAgICBkaWcgMTQKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQgLy8gb24gZXJyb3I6IG1heCBhcnJheSBsZW5ndGggZXhjZWVkZWQKICAgIHN3YXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICByZXBsYWNlMiAwCiAgICBidXJ5IDE0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjU1CiAgICAvLyBmb3IgKGxldCBpID0gVWludDY0KDApOyBpIDwgbGVuZ3RoOyBpID0gaSArIDEpIHsKICAgIGRpZyA3CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSA4CiAgICBidXJ5IDExCiAgICBiIHJhZmZsZV93aGlsZV90b3BAMTgKCnJhZmZsZV9hZnRlcl9pZl9lbHNlQDIyOgogICAgYnVyeSAxMQogICAgYiByYWZmbGVfd2hpbGVfdG9wQDIwCgpyYWZmbGVfdGVybmFyeV9mYWxzZUAyNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9saWJfcGNnL3BjZzY0LmFsZ28udHM6MTAKICAgIC8vIGNvbnN0IG5ld1N0YXRlMiA9IF9fcGNnMzJTdGVwKHN0YXRlWzFdLCBuZXdTdGF0ZTEgPT09IDAgPyBvcC5zaGwocGNnU2Vjb25kSW5jcmVtZW50LCAxKSA6IHBjZ1NlY29uZEluY3JlbWVudCkKICAgIGludGMgOSAvLyAxNDQyNjk1MDQwODg4OTYzNDA5CiAgICBiIHJhZmZsZV90ZXJuYXJ5X21lcmdlQDI4CgpyYWZmbGVfYWZ0ZXJfd2hpbGVAMjM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvdHlwZXMvbGliX3BjZy9wY2c2NC5hbGdvLnRzOjY3CiAgICAvLyByZXR1cm4gW3N0YXRlLCByZXN1bHRdCiAgICBkaWcgMTAKICAgIHB1c2hieXRlcyAweDAwMTIKICAgIGNvbmNhdAogICAgZGlnIDEzCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1ODIKICAgIC8vIHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA9IHJuZ1Jlc3VsdFsxXVswXS5hc1VpbnQ2NCgpCiAgICBkdXAKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMQogICAgbGVuCiAgICBzdWJzdHJpbmczCiAgICBwdXNoaW50IDIgLy8gMgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjYKICAgIC8vIHdpbm5pbmdUaWNrZXQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5pbmdUaWNrZXQgfSkKICAgIGJ5dGVjIDkgLy8gIndpbm5pbmdfdGlja2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU4MgogICAgLy8gdGhpcy53aW5uaW5nVGlja2V0LnZhbHVlID0gcm5nUmVzdWx0WzFdWzBdLmFzVWludDY0KCkKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTU3CiAgICAvLyByYWZmbGUoKTogdm9pZCB7CiAgICBiIHJhZmZsZV9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLnJhZmZsZUA3CgpyYWZmbGVfZWxzZV9ib2R5QDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL3R5cGVzL2xpYl9wY2cvcGNnNjQuYWxnby50czo1MAogICAgLy8gYWJzb2x1dGVCb3VuZCA9IG9wLmJ0b2koQnl0ZXMoQmlnVWludCgyICoqIDY0KSAtIEJpZ1VpbnQobG93ZXJCb3VuZCkpKQogICAgaW50YyAxMiAvLyAxODQ0Njc0NDA3MzcwOTU1MTYxNQogICAgYnVyeSAxMAogICAgYiByYWZmbGVfYWZ0ZXJfaWZfZWxzZUAxNwoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmZpbmRXaW5uZXJbcm91dGluZ10oKSAtPiB2b2lkOgpmaW5kV2lubmVyOgogICAgaW50Y18wIC8vIDAKICAgIHB1c2hieXRlcyAiIgogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTg1CiAgICAvLyBmaW5kV2lubmVyKGl0ZXJhdGlvbkFtb3VudDogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU4NgogICAgLy8gYXNzZXJ0KEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgPiB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZSwgRVJSX1JBRkZMRV9IQVNfTk9UX0VOREVEKQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTQKICAgIC8vIGVuZFRpbWVzdGFtcCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW5kVGltZXN0YW1wIH0pCiAgICBieXRlYyAxOCAvLyAiZW5kX3RpbWVzdGFtcCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1ODYKICAgIC8vIGFzc2VydChHbG9iYWwubGF0ZXN0VGltZXN0YW1wID4gdGhpcy5lbmRUaW1lc3RhbXAudmFsdWUsIEVSUl9SQUZGTEVfSEFTX05PVF9FTkRFRCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICA+CiAgICBhc3NlcnQgLy8gUmFmZmxlIGhhcyBub3QgZW5kZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1ODcKICAgIC8vIGFzc2VydCh0aGlzLndpbm5pbmdUaWNrZXQudmFsdWUgIT09IDAsIEVSUl9OT19XSU5OSU5HX1RJQ0tFVF9ZRVQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNgogICAgLy8gd2lubmluZ1RpY2tldCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmluZ1RpY2tldCB9KQogICAgYnl0ZWMgOSAvLyAid2lubmluZ190aWNrZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTg3CiAgICAvLyBhc3NlcnQodGhpcy53aW5uaW5nVGlja2V0LnZhbHVlICE9PSAwLCBFUlJfTk9fV0lOTklOR19USUNLRVRfWUVUKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFzc2VydCAvLyBObyB3aW5uaW5nIHRpY2tldCB5ZXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1ODgKICAgIC8vIGFzc2VydCh0aGlzLndpbm5lci52YWx1ZSA9PT0gR2xvYmFsLnplcm9BZGRyZXNzLCBFUlJfV0lOTkVSX0FMUkVBRFlfRk9VTkQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTg4CiAgICAvLyBhc3NlcnQodGhpcy53aW5uZXIudmFsdWUgPT09IEdsb2JhbC56ZXJvQWRkcmVzcywgRVJSX1dJTk5FUl9BTFJFQURZX0ZPVU5EKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBXaW5uZXIgaGFzIGFscmVhZHkgYmVlbiBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3OAogICAgLy8gbGV0IHN0YXJ0aW5nSW5kZXggPSB0aGlzLmZpbmRXaW5uZXJDdXJzb3JzLnZhbHVlLmluZGV4CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE2MAogICAgLy8gZmluZFdpbm5lckN1cnNvcnMgPSBHbG9iYWxTdGF0ZTxGaW5kV2lubmVyQ3Vyc29ycz4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RmluZFdpbm5lcnNDdXJzb3IgfSkKICAgIGJ5dGVjIDI4IC8vICJmaW5kX3dpbm5lcl9jdXJzb3JzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3OAogICAgLy8gbGV0IHN0YXJ0aW5nSW5kZXggPSB0aGlzLmZpbmRXaW5uZXJDdXJzb3JzLnZhbHVlLmluZGV4CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNzkKICAgIC8vIGxldCBjdXJyZW50UmFuZ2VTdGFydCA9IHRoaXMuZmluZFdpbm5lckN1cnNvcnMudmFsdWUuYW1vdW50SW5kZXgKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCgpmaW5kV2lubmVyX3doaWxlX3RvcEA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlOyBpICs9IDEpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTUwCiAgICAvLyB3ZWlnaHRzQm94Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdlaWdodHNCb3hDb3VudCB9KQogICAgYnl0ZWMgMTIgLy8gIndlaWdodHNfYm94X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4MQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHRoaXMud2VpZ2h0c0JveENvdW50LnZhbHVlOyBpICs9IDEpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkaWcgMQogICAgPgogICAgYnogZmluZFdpbm5lcl9hZnRlcl93aGlsZUAxMwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4MgogICAgLy8gY29uc3QgYm94U3Rha2UgPSB0aGlzLndlaWdodFRvdGFscy52YWx1ZVtpXS5hc1VpbnQ2NCgpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE1Mi0xNTQKICAgIC8vIHdlaWdodFRvdGFscyA9IEdsb2JhbFN0YXRlPGFyYzQuU3RhdGljQXJyYXk8YXJjNC5VaW50NjQsIDE1Pj4oewogICAgLy8gICBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2VpZ2h0VG90YWxzLAogICAgLy8gfSkKICAgIGJ5dGVjIDcgLy8gIndfdG90YWxzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4MgogICAgLy8gY29uc3QgYm94U3Rha2UgPSB0aGlzLndlaWdodFRvdGFscy52YWx1ZVtpXS5hc1VpbnQ2NCgpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZGlnIDEKICAgIGludGNfMiAvLyA4CiAgICAqCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBidXJ5IDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxODMKICAgIC8vIGlmICh0aGlzLndpbm5pbmdUaWNrZXQudmFsdWUgPCBjdXJyZW50UmFuZ2VTdGFydCArIGJveFN0YWtlKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNgogICAgLy8gd2lubmluZ1RpY2tldCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmluZ1RpY2tldCB9KQogICAgYnl0ZWMgOSAvLyAid2lubmluZ190aWNrZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTgzCiAgICAvLyBpZiAodGhpcy53aW5uaW5nVGlja2V0LnZhbHVlIDwgY3VycmVudFJhbmdlU3RhcnQgKyBib3hTdGFrZSkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGRpZyAzCiAgICB1bmNvdmVyIDIKICAgICsKICAgIDwKICAgIGJ6IGZpbmRXaW5uZXJfYWZ0ZXJfaWZfZWxzZUAxMgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4NAogICAgLy8gcmV0dXJuIFtzdGFydGluZ0luZGV4LCBjdXJyZW50UmFuZ2VTdGFydF0KICAgIGRpZyAyCiAgICBpdG9iCiAgICBkaWcgMgogICAgaXRvYgogICAgY29uY2F0CgpmaW5kV2lubmVyX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuZ2V0V2lubmVyV2VpZ2h0Qm94SW5mb0AxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1OTMKICAgIC8vIGNvbnN0IHN0YXJ0aW5nSW5kZXggPSB3aW5uaW5nQm94SW5mb1swXQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NTk0CiAgICAvLyBsZXQgY3VycmVudFJhbmdlU3RhcnQgPSB3aW5uaW5nQm94SW5mb1sxXQogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBidXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1OTcKICAgIC8vIGNvbnN0IHJlbWFpbmRlcjogdWludDY0ID0gdGhpcy5lbnRyeUNvdW50LnZhbHVlIC0gc3RhcnRpbmdJbmRleAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjIKICAgIC8vIGVudHJ5Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVudHJ5Q291bnQgfSkKICAgIGJ5dGVjXzMgLy8gImVudHJ5X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU5NwogICAgLy8gY29uc3QgcmVtYWluZGVyOiB1aW50NjQgPSB0aGlzLmVudHJ5Q291bnQudmFsdWUgLSBzdGFydGluZ0luZGV4CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZGlnIDEKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1OTgKICAgIC8vIGl0ZXJhdGlvbkFtb3VudCA9IHJlbWFpbmRlciA+IGl0ZXJhdGlvbkFtb3VudCA/IGl0ZXJhdGlvbkFtb3VudCA6IHJlbWFpbmRlcgogICAgZHVwCiAgICBkaWcgNgogICAgZHVwCiAgICBjb3ZlciAzCiAgICA+CiAgICBzd2FwCiAgICBjb3ZlciAyCiAgICBzZWxlY3QKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjAwCiAgICAvLyBjb25zdCB3ZWlnaHQgPSBjbG9uZSh0aGlzLndlaWdodHMoc3RhcnRpbmdJbmRleCAvIENodW5rU2l6ZSkudmFsdWUpCiAgICBpbnRjIDQgLy8gNDA5NgogICAgLwogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE3MQogICAgLy8gd2VpZ2h0cyA9IEJveE1hcDx1aW50NjQsIFdlaWdodHNMaXN0Pih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4V2VpZ2h0cyB9KQogICAgYnl0ZWMgMTQgLy8gInciCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ1cnkgOAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYwMgogICAgLy8gY29uc3Qgb3BVcEl0ZXJhdGlvbkFtb3VudDogdWludDY0ID0gaXRlcmF0aW9uQW1vdW50ICogNDAKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgICoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MDMKICAgIC8vIGVuc3VyZUJ1ZGdldChvcFVwSXRlcmF0aW9uQW1vdW50KQogICAgaW50Y18wIC8vIDAKICAgIGNhbGxzdWIgZW5zdXJlX2J1ZGdldAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYwNQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGl0ZXJhdGlvbkFtb3VudDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxCgpmaW5kV2lubmVyX3doaWxlX3RvcEAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYwNQogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGl0ZXJhdGlvbkFtb3VudDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGRpZyA0CiAgICA8CiAgICBieiBmaW5kV2lubmVyX2FmdGVyX3doaWxlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MDYKICAgIC8vIGN1cnJlbnRSYW5nZUVuZCA9IGN1cnJlbnRSYW5nZVN0YXJ0ICsgd2VpZ2h0W2ldLmFzVWludDY0KCkKICAgIGR1cAogICAgaW50Y18yIC8vIDgKICAgICoKICAgIGRpZyA3CiAgICBzd2FwCiAgICBpbnRjXzIgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIGRpZyAyCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgKwogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjA3CiAgICAvLyBpZiAodGhpcy53aW5uaW5nVGlja2V0LnZhbHVlID49IGN1cnJlbnRSYW5nZVN0YXJ0ICYmIHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA8PSBjdXJyZW50UmFuZ2VFbmQpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI2CiAgICAvLyB3aW5uaW5nVGlja2V0ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlXaW5uaW5nVGlja2V0IH0pCiAgICBieXRlYyA5IC8vICJ3aW5uaW5nX3RpY2tldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MDcKICAgIC8vIGlmICh0aGlzLndpbm5pbmdUaWNrZXQudmFsdWUgPj0gY3VycmVudFJhbmdlU3RhcnQgJiYgdGhpcy53aW5uaW5nVGlja2V0LnZhbHVlIDw9IGN1cnJlbnRSYW5nZUVuZCkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIDw9CiAgICBieiBmaW5kV2lubmVyX2FmdGVyX2lmX2Vsc2VANgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjYKICAgIC8vIHdpbm5pbmdUaWNrZXQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5pbmdUaWNrZXQgfSkKICAgIGJ5dGVjIDkgLy8gIndpbm5pbmdfdGlja2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYwNwogICAgLy8gaWYgKHRoaXMud2lubmluZ1RpY2tldC52YWx1ZSA+PSBjdXJyZW50UmFuZ2VTdGFydCAmJiB0aGlzLndpbm5pbmdUaWNrZXQudmFsdWUgPD0gY3VycmVudFJhbmdlRW5kKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZGlnIDUKICAgIDw9CiAgICBieiBmaW5kV2lubmVyX2FmdGVyX2lmX2Vsc2VANgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYwOAogICAgLy8gdGhpcy53aW5uZXIudmFsdWUgPSB0aGlzLmVudHJpZXMoc3RhcnRpbmdJbmRleCArIGkgKyAxKS52YWx1ZS5hY2NvdW50CiAgICBkaWcgMgogICAgZGlnIDEKICAgICsKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTY5CiAgICAvLyBlbnRyaWVzID0gQm94TWFwPHVpbnQ2NCwgRW50cnlEYXRhPih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllcyB9KQogICAgYnl0ZWMgMjEgLy8gImUiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MDgKICAgIC8vIHRoaXMud2lubmVyLnZhbHVlID0gdGhpcy5lbnRyaWVzKHN0YXJ0aW5nSW5kZXggKyBpICsgMSkudmFsdWUuYWNjb3VudAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGV4dHJhY3QgMCAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjA4CiAgICAvLyB0aGlzLndpbm5lci52YWx1ZSA9IHRoaXMuZW50cmllcyhzdGFydGluZ0luZGV4ICsgaSArIDEpLnZhbHVlLmFjY291bnQKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CgpmaW5kV2lubmVyX2FmdGVyX2lmX2Vsc2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTAKICAgIC8vIGN1cnJlbnRSYW5nZVN0YXJ0ID0gY3VycmVudFJhbmdlRW5kICsgMQogICAgZGlnIDQKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MDUKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBpdGVyYXRpb25BbW91bnQ7IGkgKz0gMSkgewogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnVyeSAxCiAgICBiIGZpbmRXaW5uZXJfd2hpbGVfdG9wQDIKCmZpbmRXaW5uZXJfYWZ0ZXJfd2hpbGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTMKICAgIC8vIHRoaXMuZmluZFdpbm5lckN1cnNvcnMudmFsdWUuaW5kZXggKz0gaXRlcmF0aW9uQW1vdW50CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE2MAogICAgLy8gZmluZFdpbm5lckN1cnNvcnMgPSBHbG9iYWxTdGF0ZTxGaW5kV2lubmVyQ3Vyc29ycz4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RmluZFdpbm5lcnNDdXJzb3IgfSkKICAgIGJ5dGVjIDI4IC8vICJmaW5kX3dpbm5lcl9jdXJzb3JzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYxMwogICAgLy8gdGhpcy5maW5kV2lubmVyQ3Vyc29ycy52YWx1ZS5pbmRleCArPSBpdGVyYXRpb25BbW91bnQKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDUKICAgICsKICAgIGl0b2IKICAgIHJlcGxhY2UyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTQKICAgIC8vIHRoaXMuZmluZFdpbm5lckN1cnNvcnMudmFsdWUuYW1vdW50SW5kZXggPSBjdXJyZW50UmFuZ2VTdGFydAogICAgZGlnIDIKICAgIGl0b2IKICAgIHJlcGxhY2UyIDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNjAKICAgIC8vIGZpbmRXaW5uZXJDdXJzb3JzID0gR2xvYmFsU3RhdGU8RmluZFdpbm5lckN1cnNvcnM+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUZpbmRXaW5uZXJzQ3Vyc29yIH0pCiAgICBieXRlYyAyOCAvLyAiZmluZF93aW5uZXJfY3Vyc29ycyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTQKICAgIC8vIHRoaXMuZmluZFdpbm5lckN1cnNvcnMudmFsdWUuYW1vdW50SW5kZXggPSBjdXJyZW50UmFuZ2VTdGFydAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo1ODUKICAgIC8vIGZpbmRXaW5uZXIoaXRlcmF0aW9uQW1vdW50OiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmZpbmRXaW5uZXJfYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxODcKICAgIC8vIHN0YXJ0aW5nSW5kZXggKz0gQ2h1bmtTaXplCiAgICBkaWcgMgogICAgaW50YyA0IC8vIDQwOTYKICAgICsKICAgIGJ1cnkgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE4OAogICAgLy8gY3VycmVudFJhbmdlU3RhcnQgKz0gYm94U3Rha2UgKyAxCiAgICBkaWcgNQogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGRpZyAyCiAgICArCiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxODEKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCB0aGlzLndlaWdodHNCb3hDb3VudC52YWx1ZTsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgZmluZFdpbm5lcl93aGlsZV90b3BAOQoKZmluZFdpbm5lcl9hZnRlcl93aGlsZUAxMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxOTEKICAgIC8vIHJldHVybiBbc3RhcnRpbmdJbmRleCwgY3VycmVudFJhbmdlU3RhcnRdCiAgICBkaWcgMgogICAgaXRvYgogICAgZGlnIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjU5MAogICAgLy8gY29uc3Qgd2lubmluZ0JveEluZm8gPSB0aGlzLmdldFdpbm5lcldlaWdodEJveEluZm8oKQogICAgYiBmaW5kV2lubmVyX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuZ2V0V2lubmVyV2VpZ2h0Qm94SW5mb0AxNAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmNsYWltUmFmZmxlUHJpemVbcm91dGluZ10oKSAtPiB2b2lkOgpjbGFpbVJhZmZsZVByaXplOgogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDExCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjE4CiAgICAvLyBhc3NlcnQodGhpcy53aW5uZXIudmFsdWUgIT09IEdsb2JhbC56ZXJvQWRkcmVzcywgRVJSX1dJTk5FUl9OT1RfRk9VTkQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjE4CiAgICAvLyBhc3NlcnQodGhpcy53aW5uZXIudmFsdWUgIT09IEdsb2JhbC56ZXJvQWRkcmVzcywgRVJSX1dJTk5FUl9OT1RfRk9VTkQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgYXNzZXJ0IC8vIFdpbm5lciBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTkKICAgIC8vIGFzc2VydCghdGhpcy5wcml6ZUNsYWltZWQudmFsdWUsIEVSUl9QUklaRV9BTFJFQURZX0NMQUlNRUQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzNAogICAgLy8gcHJpemVDbGFpbWVkID0gR2xvYmFsU3RhdGU8Ym9vbGVhbj4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemVDbGFpbWVkIH0pCiAgICBieXRlYyAxNiAvLyAicHJpemVfY2xhaW1lZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTkKICAgIC8vIGFzc2VydCghdGhpcy5wcml6ZUNsYWltZWQudmFsdWUsIEVSUl9QUklaRV9BTFJFQURZX0NMQUlNRUQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgIQogICAgYXNzZXJ0IC8vIFByaXplIGhhcyBhbHJlYWR5IGJlZW4gY2xhaW1lZAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYyMgogICAgLy8gaWYgKHRoaXMuaXNQcml6ZUJveC52YWx1ZSkgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzIKICAgIC8vIGlzUHJpemVCb3ggPSBHbG9iYWxTdGF0ZTxib29sZWFuPih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlJc1ByaXplQm94IH0pCiAgICBieXRlYyAyNSAvLyAiaXNfcHJpemVfYm94IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYyMgogICAgLy8gaWYgKHRoaXMuaXNQcml6ZUJveC52YWx1ZSkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfZWxzZV9ib2R5QDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MjMtNjI2CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBQcml6ZUJveC5wcm90b3R5cGUudHJhbnNmZXI+KHsKICAgIC8vICAgYXBwSWQ6IHRoaXMucHJpemUudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFt0aGlzLndpbm5lci52YWx1ZV0sCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYyNAogICAgLy8gYXBwSWQ6IHRoaXMucHJpemUudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzMAogICAgLy8gcHJpemUgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVByaXplIH0pCiAgICBieXRlYyA2IC8vICJwcml6ZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MjQKICAgIC8vIGFwcElkOiB0aGlzLnByaXplLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MjUKICAgIC8vIGFyZ3M6IFt0aGlzLndpbm5lci52YWx1ZV0sCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjI1CiAgICAvLyBhcmdzOiBbdGhpcy53aW5uZXIudmFsdWVdLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MjMtNjI2CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBQcml6ZUJveC5wcm90b3R5cGUudHJhbnNmZXI+KHsKICAgIC8vICAgYXBwSWQ6IHRoaXMucHJpemUudmFsdWUsCiAgICAvLyAgIGFyZ3M6IFt0aGlzLndpbm5lci52YWx1ZV0sCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4YWRmOTJhZTQgLy8gbWV0aG9kICJ0cmFuc2ZlcihhZGRyZXNzKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY0OAogICAgLy8gY29uc3QgYW1vdW50cyA9IHRoaXMuZ2V0QW1vdW50cyh0aGlzLnRpY2tldENvdW50LnZhbHVlLCB0aGlzLmlzUHJpemVCb3gudmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gdGlja2V0Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldENvdW50IH0pCiAgICBieXRlY18yIC8vICJ0aWNrZXRfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjQ4CiAgICAvLyBjb25zdCBhbW91bnRzID0gdGhpcy5nZXRBbW91bnRzKHRoaXMudGlja2V0Q291bnQudmFsdWUsIHRoaXMuaXNQcml6ZUJveC52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBzd2FwCiAgICBidXJ5IDExCiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzMgogICAgLy8gaXNQcml6ZUJveCA9IEdsb2JhbFN0YXRlPGJvb2xlYW4+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUlzUHJpemVCb3ggfSkKICAgIGJ5dGVjIDI1IC8vICJpc19wcml6ZV9ib3giCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjQ4CiAgICAvLyBjb25zdCBhbW91bnRzID0gdGhpcy5nZXRBbW91bnRzKHRoaXMudGlja2V0Q291bnQudmFsdWUsIHRoaXMuaXNQcml6ZUJveC52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTk2CiAgICAvLyBsZXQgY3JlYXRvckFtb3VudDogdWludDY0ID0gMAogICAgaW50Y18wIC8vIDAKICAgIGJ1cnkgOAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE5NwogICAgLy8gaWYgKCFpc1ByaXplQm94ICYmIHRoaXMuY3JlYXRvclJveWFsdHkudmFsdWUgPiAwKSB7CiAgICBibnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDU1CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzNgogICAgLy8gY3JlYXRvclJveWFsdHkgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUNyZWF0b3JSb3lhbHR5IH0pCiAgICBieXRlYyAyOSAvLyAiY3JlYXRvcl9yb3lhbHR5IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE5NwogICAgLy8gaWYgKCFpc1ByaXplQm94ICYmIHRoaXMuY3JlYXRvclJveWFsdHkudmFsdWUgPiAwKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDU1CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTk4CiAgICAvLyBjcmVhdG9yQW1vdW50ID0gY2FsY1BlcmNlbnQoYW1vdW50LCB0aGlzLmNyZWF0b3JSb3lhbHR5LnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzYKICAgIC8vIGNyZWF0b3JSb3lhbHR5ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlDcmVhdG9yUm95YWx0eSB9KQogICAgYnl0ZWMgMjkgLy8gImNyZWF0b3Jfcm95YWx0eSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxOTgKICAgIC8vIGNyZWF0b3JBbW91bnQgPSBjYWxjUGVyY2VudChhbW91bnQsIHRoaXMuY3JlYXRvclJveWFsdHkudmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMDQKICAgIC8vIGFzc2VydChwIDw9IERJVklTT1IsIEVSUl9JTlZBTElEX1BFUkNFTlRBR0UpCiAgICBkdXAKICAgIGludGMgNSAvLyAxMDAwMDAKICAgIDw9CiAgICBhc3NlcnQgLy8gSW52YWxpZCBwZXJjZW50YWdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEwNQogICAgLy8gcmV0dXJuIG9wLmRpdncoLi4ub3AubXVsdyhhLCBwKSwgRElWSVNPUikKICAgIGRpZyAxMAogICAgbXVsdwogICAgaW50YyA1IC8vIDEwMDAwMAogICAgZGl2dwogICAgZHVwCiAgICBidXJ5IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxOTkKICAgIC8vIGlmIChjcmVhdG9yQW1vdW50ID09PSAwICYmIHRoaXMuY3JlYXRvclJveWFsdHkudmFsdWUgPiAwICYmIGFtb3VudCA+IDApIHsKICAgIGJueiBjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VANTUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM2CiAgICAvLyBjcmVhdG9yUm95YWx0eSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5Q3JlYXRvclJveWFsdHkgfSkKICAgIGJ5dGVjIDI5IC8vICJjcmVhdG9yX3JveWFsdHkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTk5CiAgICAvLyBpZiAoY3JlYXRvckFtb3VudCA9PT0gMCAmJiB0aGlzLmNyZWF0b3JSb3lhbHR5LnZhbHVlID4gMCAmJiBhbW91bnQgPiAwKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDU1CiAgICBkaWcgOQogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDU1CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjAwCiAgICAvLyBjcmVhdG9yQW1vdW50ID0gMQogICAgaW50Y18xIC8vIDEKICAgIGJ1cnkgNwoKY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDU1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjIwNAogICAgLy8gbGV0IGFraXRhQW1vdW50OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxMgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjIwNQogICAgLy8gaWYgKHRoaXMuYWtpdGFSb3lhbHR5LnZhbHVlID4gMCkgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDQKICAgIC8vIGFraXRhUm95YWx0eSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5QWtpdGFSb3lhbHR5IH0pCiAgICBieXRlYyAyNyAvLyAiYWtpdGFfcm95YWx0eSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMDUKICAgIC8vIGlmICh0aGlzLmFraXRhUm95YWx0eS52YWx1ZSA+IDApIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieiBjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VANjAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMDYKICAgIC8vIGFraXRhQW1vdW50ID0gY2FsY1BlcmNlbnQoYW1vdW50LCB0aGlzLmFraXRhUm95YWx0eS52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQ0CiAgICAvLyBha2l0YVJveWFsdHkgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUFraXRhUm95YWx0eSB9KQogICAgYnl0ZWMgMjcgLy8gImFraXRhX3JveWFsdHkiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjA2CiAgICAvLyBha2l0YUFtb3VudCA9IGNhbGNQZXJjZW50KGFtb3VudCwgdGhpcy5ha2l0YVJveWFsdHkudmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMDQKICAgIC8vIGFzc2VydChwIDw9IERJVklTT1IsIEVSUl9JTlZBTElEX1BFUkNFTlRBR0UpCiAgICBkdXAKICAgIGludGMgNSAvLyAxMDAwMDAKICAgIDw9CiAgICBhc3NlcnQgLy8gSW52YWxpZCBwZXJjZW50YWdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEwNQogICAgLy8gcmV0dXJuIG9wLmRpdncoLi4ub3AubXVsdyhhLCBwKSwgRElWSVNPUikKICAgIGRpZyAxMAogICAgbXVsdwogICAgaW50YyA1IC8vIDEwMDAwMAogICAgZGl2dwogICAgZHVwCiAgICBidXJ5IDEzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjA3CiAgICAvLyBpZiAoYWtpdGFBbW91bnQgPT09IDAgJiYgYW1vdW50ID4gMCkgewogICAgYm56IGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA2MAogICAgZGlnIDkKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA2MAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjIwOAogICAgLy8gYWtpdGFBbW91bnQgPSAxCiAgICBpbnRjXzEgLy8gMQogICAgYnVyeSAxMgoKY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDYwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjIxMgogICAgLy8gbGV0IG1hcmtldHBsYWNlQW1vdW50OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjEzCiAgICAvLyBpZiAodGhpcy5tYXJrZXRwbGFjZVJveWFsdGllcy52YWx1ZSA+IDApIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQyCiAgICAvLyBtYXJrZXRwbGFjZVJveWFsdGllcyA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWFya2V0cGxhY2VSb3lhbHRpZXMgfSkKICAgIGJ5dGVjIDIzIC8vICJtYXJrZXRwbGFjZV9yb3lhbHRpZXMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjEzCiAgICAvLyBpZiAodGhpcy5tYXJrZXRwbGFjZVJveWFsdGllcy52YWx1ZSA+IDApIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieiBjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VANjYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMTQKICAgIC8vIG1hcmtldHBsYWNlQW1vdW50ID0gY2FsY1BlcmNlbnQoYW1vdW50LCB0aGlzLm1hcmtldHBsYWNlUm95YWx0aWVzLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDIKICAgIC8vIG1hcmtldHBsYWNlUm95YWx0aWVzID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZVJveWFsdGllcyB9KQogICAgYnl0ZWMgMjMgLy8gIm1hcmtldHBsYWNlX3JveWFsdGllcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMTQKICAgIC8vIG1hcmtldHBsYWNlQW1vdW50ID0gY2FsY1BlcmNlbnQoYW1vdW50LCB0aGlzLm1hcmtldHBsYWNlUm95YWx0aWVzLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTA0CiAgICAvLyBhc3NlcnQocCA8PSBESVZJU09SLCBFUlJfSU5WQUxJRF9QRVJDRU5UQUdFKQogICAgZHVwCiAgICBpbnRjIDUgLy8gMTAwMDAwCiAgICA8PQogICAgYXNzZXJ0IC8vIEludmFsaWQgcGVyY2VudGFnZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMDUKICAgIC8vIHJldHVybiBvcC5kaXZ3KC4uLm9wLm11bHcoYSwgcCksIERJVklTT1IpCiAgICBkaWcgMTAKICAgIG11bHcKICAgIGludGMgNSAvLyAxMDAwMDAKICAgIGRpdncKICAgIGR1cAogICAgYnVyeSA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjE1CiAgICAvLyBpZiAobWFya2V0cGxhY2VBbW91bnQgPT09IDAgJiYgdGhpcy5tYXJrZXRwbGFjZVJveWFsdGllcy52YWx1ZSA+IDAgJiYgYW1vdW50ID4gMCkgewogICAgYm56IGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA2NgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDIKICAgIC8vIG1hcmtldHBsYWNlUm95YWx0aWVzID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZVJveWFsdGllcyB9KQogICAgYnl0ZWMgMjMgLy8gIm1hcmtldHBsYWNlX3JveWFsdGllcyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMTUKICAgIC8vIGlmIChtYXJrZXRwbGFjZUFtb3VudCA9PT0gMCAmJiB0aGlzLm1hcmtldHBsYWNlUm95YWx0aWVzLnZhbHVlID4gMCAmJiBhbW91bnQgPiAwKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDY2CiAgICBkaWcgOQogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDY2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MjE2CiAgICAvLyBtYXJrZXRwbGFjZUFtb3VudCA9IDEKICAgIGludGNfMSAvLyAxCiAgICBidXJ5IDYKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA2NjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMjAKICAgIC8vIGNvbnN0IHNlbGxlckFtb3VudDogdWludDY0ID0gYW1vdW50IC0gKGNyZWF0b3JBbW91bnQgKyBha2l0YUFtb3VudCArICgyICogbWFya2V0cGxhY2VBbW91bnQpKQogICAgZGlnIDYKICAgIGR1cAogICAgZGlnIDEzCiAgICBkdXAKICAgIGNvdmVyIDMKICAgICsKICAgIHB1c2hpbnQgMiAvLyAyCiAgICBkaWcgOQogICAgZHVwCiAgICBjb3ZlciA1CiAgICAqCiAgICArCiAgICBkaWcgMTMKICAgIHN3YXAKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoyMjItMjI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBjcmVhdG9yOiBjcmVhdG9yQW1vdW50LAogICAgLy8gICBha2l0YTogYWtpdGFBbW91bnQsCiAgICAvLyAgIG1hcmtldHBsYWNlOiBtYXJrZXRwbGFjZUFtb3VudCwKICAgIC8vICAgc2VsbGVyOiBzZWxsZXJBbW91bnQsCiAgICAvLyB9CiAgICBzd2FwCiAgICBpdG9iCiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgYnVyeSAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1MAogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKHRoaXMud2lubmVyLnZhbHVlKS52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjgKICAgIC8vIHdpbm5lciA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5lciB9KQogICAgYnl0ZWMgNCAvLyAid2lubmVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1MAogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKHRoaXMud2lubmVyLnZhbHVlKS52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNzMKICAgIC8vIGVudHJpZXNCeUFkZHJlc3MgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogUmFmZmxlQm94UHJlZml4RW50cmllc0J5QWRkcmVzcyB9KQogICAgYnl0ZWMgOCAvLyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1MAogICAgLy8gY29uc3QgbG9jID0gdGhpcy5lbnRyaWVzQnlBZGRyZXNzKHRoaXMud2lubmVyLnZhbHVlKS52YWx1ZQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NTEKICAgIC8vIGNvbnN0IG1hcmtldHBsYWNlID0gdGhpcy5lbnRyaWVzKGxvYykudmFsdWUubWFya2V0cGxhY2UKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNjkKICAgIC8vIGVudHJpZXMgPSBCb3hNYXA8dWludDY0LCBFbnRyeURhdGE+KHsga2V5UHJlZml4OiBSYWZmbGVCb3hQcmVmaXhFbnRyaWVzIH0pCiAgICBieXRlYyAyMSAvLyAiZSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1MQogICAgLy8gY29uc3QgbWFya2V0cGxhY2UgPSB0aGlzLmVudHJpZXMobG9jKS52YWx1ZS5tYXJrZXRwbGFjZQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGV4dHJhY3QgMzIgMzIKICAgIGJ1cnkgMTMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NTMKICAgIC8vIGlmICh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkID09PSAwKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NTMKICAgIC8vIGlmICh0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkID09PSAwKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYm56IGNsYWltUmFmZmxlUHJpemVfZWxzZV9ib2R5QDE4CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjU1CiAgICAvLyBpZiAoYW1vdW50cy5jcmVhdG9yID4gMCkgewogICAgZGlnIDEzCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgYnVyeSA0CiAgICBieiBjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VAMTMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NTctNjYyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogQXNzZXQodGhpcy5wcml6ZS52YWx1ZSkuY3JlYXRvciwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuY3JlYXRvciwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjU5CiAgICAvLyByZWNlaXZlcjogQXNzZXQodGhpcy5wcml6ZS52YWx1ZSkuY3JlYXRvciwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBwcml6ZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemUgfSkKICAgIGJ5dGVjIDYgLy8gInByaXplIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1OQogICAgLy8gcmVjZWl2ZXI6IEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldENyZWF0b3IKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIGRpZyAzCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1Ny02NjEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLAogICAgLy8gICAgIGFtb3VudDogYW1vdW50cy5jcmVhdG9yLAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY1Ny02NjIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLAogICAgLy8gICAgIGFtb3VudDogYW1vdW50cy5jcmVhdG9yLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgpjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VAMTM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjY1LTY3MAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuYWtpdGEsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY2NwogICAgLy8gcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDExIC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjY3CiAgICAvLyByZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NjgKICAgIC8vIGFtb3VudDogYW1vdW50cy5ha2l0YSwKICAgIGRpZyAxNAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjY1LTY2OQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuYWtpdGEsCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjY1LTY3MAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuYWtpdGEsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2NzItNjc3CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3NAogICAgLy8gcmVjZWl2ZXI6IHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE0MAogICAgLy8gbWFya2V0cGxhY2UgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZSB9KQogICAgYnl0ZWMgMTkgLy8gIm1hcmtldHBsYWNlIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3NAogICAgLy8gcmVjZWl2ZXI6IHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3NQogICAgLy8gYW1vdW50OiBhbW91bnRzLm1hcmtldHBsYWNlLAogICAgZGlnIDEKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjcyLTY3NgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICAvLyAgICAgYW1vdW50OiBhbW91bnRzLm1hcmtldHBsYWNlLAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3Mi02NzcKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLm1hcmtldHBsYWNlLnZhbHVlLAogICAgLy8gICAgIGFtb3VudDogYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3OS02ODQKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBtYXJrZXRwbGFjZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGRpZyAxMwogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY3OS02ODMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBtYXJrZXRwbGFjZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Njc5LTY4NAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IG1hcmtldHBsYWNlLAogICAgLy8gICAgIGFtb3VudDogYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY4Ni02OTEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuc2VsbGVyLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2ODgKICAgIC8vIHJlY2VpdmVyOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTE2CiAgICAvLyBzZWxsZXIgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlTZWxsZXIgfSkKICAgIGJ5dGVjIDEzIC8vICJzZWxsZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Njg4CiAgICAvLyByZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY4OQogICAgLy8gYW1vdW50OiBhbW91bnRzLnNlbGxlciwKICAgIHN3YXAKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY4Ni02OTAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuc2VsbGVyLAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY4Ni02OTEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhbW91bnQ6IGFtb3VudHMuc2VsbGVyLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgpjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VANDE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTM0CiAgICAvLyBwcml6ZUNsYWltZWQgPSBHbG9iYWxTdGF0ZTxib29sZWFuPih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlQcml6ZUNsYWltZWQgfSkKICAgIGJ5dGVjIDE2IC8vICJwcml6ZV9jbGFpbWVkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc4NwogICAgLy8gdGhpcy5wcml6ZUNsYWltZWQudmFsdWUgPSB0cnVlCiAgICBpbnRjXzEgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MTcKICAgIC8vIGNsYWltUmFmZmxlUHJpemUoKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAxODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2OTUKICAgIC8vIGlmIChhbW91bnRzLmNyZWF0b3IgPiAwKSB7CiAgICBkaWcgMTMKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZHVwCiAgICBidXJ5IDMKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUAyNAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY5NgogICAgLy8gaWYgKEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzMAogICAgLy8gcHJpemUgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVByaXplIH0pCiAgICBieXRlYyA2IC8vICJwcml6ZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2OTYKICAgIC8vIGlmIChBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLmlzT3B0ZWRJbih0aGlzLnRpY2tldEFzc2V0LnZhbHVlKSkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFzc2V0X3BhcmFtc19nZXQgQXNzZXRDcmVhdG9yCiAgICBhc3NlcnQgLy8gYXNzZXQgZXhpc3RzCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2OTYKICAgIC8vIGlmIChBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLmlzT3B0ZWRJbih0aGlzLnRpY2tldEFzc2V0LnZhbHVlKSkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBieiBjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAyMgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY5Ny03MDMKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudHMuY3JlYXRvciwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY5OQogICAgLy8gYXNzZXRSZWNlaXZlcjogQXNzZXQodGhpcy5wcml6ZS52YWx1ZSkuY3JlYXRvciwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBwcml6ZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemUgfSkKICAgIGJ5dGVjIDYgLy8gInByaXplIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY5OQogICAgLy8gYXNzZXRSZWNlaXZlcjogQXNzZXQodGhpcy5wcml6ZS52YWx1ZSkuY3JlYXRvciwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhc3NldF9wYXJhbXNfZ2V0IEFzc2V0Q3JlYXRvcgogICAgYXNzZXJ0IC8vIGFzc2V0IGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcwMQogICAgLy8geGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzAxCiAgICAvLyB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGRpZyAyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2OTctNzAyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnRzLmNyZWF0b3IsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY5Ny03MDMKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudHMuY3JlYXRvciwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUAyNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MTUKICAgIC8vIGlmICh0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlYyAxMSAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcxNQogICAgLy8gaWYgKHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcy5pc09wdGVkSW4odGhpcy50aWNrZXRBc3NldC52YWx1ZSkpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MTUKICAgIC8vIGlmICh0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfZWxzZV9ib2R5QDI3CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzE2LTcyMgogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnRzLmFraXRhLAogICAgLy8gICAgIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzE4CiAgICAvLyBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlYyAxMSAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcxOAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MTkKICAgIC8vIGFzc2V0QW1vdW50OiBhbW91bnRzLmFraXRhLAogICAgZGlnIDE0CiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MjAKICAgIC8vIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyB0aWNrZXRBc3NldCA9IEdsb2JhbFN0YXRlPEFzc2V0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRBc3NldCB9KQogICAgYnl0ZWNfMCAvLyAidGlja2V0X2Fzc2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcyMAogICAgLy8geGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MTYtNzIxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudHMuYWtpdGEsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcxNi03MjIKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogYW1vdW50cy5ha2l0YSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUAyODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MzEKICAgIC8vIGlmICh0aGlzLm1hcmtldHBsYWNlLnZhbHVlLmlzT3B0ZWRJbih0aGlzLnRpY2tldEFzc2V0LnZhbHVlKSkgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDAKICAgIC8vIG1hcmtldHBsYWNlID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWFya2V0cGxhY2UgfSkKICAgIGJ5dGVjIDE5IC8vICJtYXJrZXRwbGFjZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MzEKICAgIC8vIGlmICh0aGlzLm1hcmtldHBsYWNlLnZhbHVlLmlzT3B0ZWRJbih0aGlzLnRpY2tldEFzc2V0LnZhbHVlKSkgewogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyB0aWNrZXRBc3NldCA9IEdsb2JhbFN0YXRlPEFzc2V0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRBc3NldCB9KQogICAgYnl0ZWNfMCAvLyAidGlja2V0X2Fzc2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjczMQogICAgLy8gaWYgKHRoaXMubWFya2V0cGxhY2UudmFsdWUuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfZWxzZV9ib2R5QDMxCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzMyLTczOAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSwKICAgIC8vICAgICBhc3NldEFtb3VudDogYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjczNAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQwCiAgICAvLyBtYXJrZXRwbGFjZSA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleU1hcmtldHBsYWNlIH0pCiAgICBieXRlYyAxOSAvLyAibWFya2V0cGxhY2UiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzM0CiAgICAvLyBhc3NldFJlY2VpdmVyOiB0aGlzLm1hcmtldHBsYWNlLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MzUKICAgIC8vIGFzc2V0QW1vdW50OiBhbW91bnRzLm1hcmtldHBsYWNlLAogICAgZGlnIDE0CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjczNgogICAgLy8geGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzM2CiAgICAvLyB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjczMi03MzcKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjczMi03MzgKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CgpjbGFpbVJhZmZsZVByaXplX2FmdGVyX2lmX2Vsc2VAMzI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzQ5CiAgICAvLyBpZiAobWFya2V0cGxhY2UuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NDkKICAgIC8vIGlmIChtYXJrZXRwbGFjZS5pc09wdGVkSW4odGhpcy50aWNrZXRBc3NldC52YWx1ZSkpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkaWcgMTMKICAgIHN3YXAKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBieiBjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAzNQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc1MC03NTYKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IG1hcmtldHBsYWNlLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnRzLm1hcmtldHBsYWNlLAogICAgLy8gICAgIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzUzCiAgICAvLyBhc3NldEFtb3VudDogYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIGRpZyAxMwogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NTQKICAgIC8vIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyB0aWNrZXRBc3NldCA9IEdsb2JhbFN0YXRlPEFzc2V0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRBc3NldCB9KQogICAgYnl0ZWNfMCAvLyAidGlja2V0X2Fzc2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc1NAogICAgLy8geGZlckFzc2V0OiB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBkaWcgMTIKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc1MC03NTUKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IG1hcmtldHBsYWNlLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBhbW91bnRzLm1hcmtldHBsYWNlLAogICAgLy8gICAgIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIC8vICAgfSkKICAgIGludGNfMyAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NTAtNzU2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBtYXJrZXRwbGFjZSwKICAgIC8vICAgICBhc3NldEFtb3VudDogYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUAzNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NjcKICAgIC8vIGlmICh0aGlzLnNlbGxlci52YWx1ZS5pc09wdGVkSW4odGhpcy50aWNrZXRBc3NldC52YWx1ZSkpIHsKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTE2CiAgICAvLyBzZWxsZXIgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlTZWxsZXIgfSkKICAgIGJ5dGVjIDEzIC8vICJzZWxsZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzY3CiAgICAvLyBpZiAodGhpcy5zZWxsZXIudmFsdWUuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzY3CiAgICAvLyBpZiAodGhpcy5zZWxsZXIudmFsdWUuaXNPcHRlZEluKHRoaXMudGlja2V0QXNzZXQudmFsdWUpKSB7CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfZWxzZV9ib2R5QDM5CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzY4LTc3NQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICAvLyAgICAgYXNzZXRDbG9zZVRvOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhc3NldEFtb3VudDogdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc3MAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExNgogICAgLy8gc2VsbGVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5U2VsbGVyIH0pCiAgICBieXRlYyAxMyAvLyAic2VsbGVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc3MAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc3MgogICAgLy8gYXNzZXRBbW91bnQ6IHRoaXMudGlja2V0Q291bnQudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gdGlja2V0Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldENvdW50IH0pCiAgICBieXRlY18yIC8vICJ0aWNrZXRfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzcyCiAgICAvLyBhc3NldEFtb3VudDogdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzczCiAgICAvLyB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NzMKICAgIC8vIHhmZXJBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFzc2V0Q2xvc2VUbwogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzY4LTc3NAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICAvLyAgICAgYXNzZXRDbG9zZVRvOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhc3NldEFtb3VudDogdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICBpbnRjXzMgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzY4LTc3NQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICAvLyAgICAgYXNzZXRDbG9zZVRvOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIC8vICAgICBhc3NldEFtb3VudDogdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDQxCgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAzOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NzgKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Nzc4CiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NzkKICAgIC8vIHRoaXMuc2VsbGVyLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTYKICAgIC8vIHNlbGxlciA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVNlbGxlciB9KQogICAgYnl0ZWMgMTMgLy8gInNlbGxlciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NzkKICAgIC8vIHRoaXMuc2VsbGVyLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3ODAKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3ODAKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc4MQogICAgLy8gdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyB0aWNrZXRDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0Q291bnQgfSkKICAgIGJ5dGVjXzIgLy8gInRpY2tldF9jb3VudCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3ODEKICAgIC8vIHRoaXMudGlja2V0Q291bnQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc4MgogICAgLy8gdHJ1ZQogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NzctNzgzCiAgICAvLyBhcmM1OU9wdEluQW5kU2VuZCgKICAgIC8vICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgdGhpcy5zZWxsZXIudmFsdWUsCiAgICAvLyAgIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICAvLyAgIHRoaXMudGlja2V0Q291bnQudmFsdWUsCiAgICAvLyAgIHRydWUKICAgIC8vICkKICAgIGNhbGxzdWIgYXJjNTlPcHRJbkFuZFNlbmQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDQxCgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAzNToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NTkKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzU5CiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NjEKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NjEKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc2MgogICAgLy8gYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIGRpZyAxNQogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NTgtNzY0CiAgICAvLyBhcmM1OU9wdEluQW5kU2VuZCgKICAgIC8vICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgbWFya2V0cGxhY2UsCiAgICAvLyAgIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICAvLyAgIGFtb3VudHMubWFya2V0cGxhY2UsCiAgICAvLyAgIGZhbHNlCiAgICAvLyApCiAgICB1bmNvdmVyIDIKICAgIGRpZyAxNQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NjMKICAgIC8vIGZhbHNlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc1OC03NjQKICAgIC8vIGFyYzU5T3B0SW5BbmRTZW5kKAogICAgLy8gICB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgLy8gICBtYXJrZXRwbGFjZSwKICAgIC8vICAgdGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCwKICAgIC8vICAgYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgZmFsc2UKICAgIC8vICkKICAgIGNhbGxzdWIgYXJjNTlPcHRJbkFuZFNlbmQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDM2CgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAzMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NDEKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzQxCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NDIKICAgIC8vIHRoaXMubWFya2V0cGxhY2UudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjE0MAogICAgLy8gbWFya2V0cGxhY2UgPSBHbG9iYWxTdGF0ZTxBY2NvdW50Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXJrZXRwbGFjZSB9KQogICAgYnl0ZWMgMTkgLy8gIm1hcmtldHBsYWNlIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc0MgogICAgLy8gdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzQzCiAgICAvLyB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTAKICAgIC8vIHRpY2tldEFzc2V0ID0gR2xvYmFsU3RhdGU8QXNzZXQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVRpY2tldEFzc2V0IH0pCiAgICBieXRlY18wIC8vICJ0aWNrZXRfYXNzZXQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzQzCiAgICAvLyB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NDQKICAgIC8vIGFtb3VudHMubWFya2V0cGxhY2UsCiAgICBkaWcgMTYKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzQ1CiAgICAvLyBmYWxzZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3NDAtNzQ2CiAgICAvLyBhcmM1OU9wdEluQW5kU2VuZCgKICAgIC8vICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgdGhpcy5tYXJrZXRwbGFjZS52YWx1ZSwKICAgIC8vICAgdGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCwKICAgIC8vICAgYW1vdW50cy5tYXJrZXRwbGFjZSwKICAgIC8vICAgZmFsc2UKICAgIC8vICkKICAgIGNhbGxzdWIgYXJjNTlPcHRJbkFuZFNlbmQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDMyCgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAyNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MjYKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MjYKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgc3dhcAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBidXJ5IDExCiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzI3CiAgICAvLyBhbW91bnRzLmFraXRhLAogICAgZGlnIDE0CiAgICBpbnRjXzIgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGJ1cnkgMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBzd2FwCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGJ1cnkgMTQKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGR1cAogICAgYnl0ZWMgMjIgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUwCiAgICAvLyBjb25zdCBbcGx1Z2luQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1BsdWdpbkFwcExpc3QpKQogICAgZHVwCiAgICBieXRlYyAzNCAvLyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6ODMKICAgIC8vIGNvbnN0IHsgcmV2ZW51ZU1hbmFnZXIgfSA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGR1cAogICAgZXh0cmFjdCA4IDgKICAgIHN3YXAKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBzd2FwCiAgICBieXRlYyAyMiAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NzAtNzMKICAgIC8vIGNvbnN0IGVzY3JvdyA9IGFiaUNhbGw8dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9nZXRFc2Nyb3dzPih7CiAgICAvLyAgIGFwcElkLAogICAgLy8gICBhcmdzOiBbW25hbWVdXSwKICAgIC8vIH0pLnJldHVyblZhbHVlWzBdCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHhhMjQwM2RkZiAvLyBtZXRob2QgImFyYzU4X2dldEVzY3Jvd3Moc3RyaW5nW10pKHVpbnQ2NCxib29sKVtdIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjcyCiAgICAvLyBhcmdzOiBbW25hbWVdXSwKICAgIHB1c2hieXRlcyAweDAwMDEwMDAyMDAwYjcyNjU3NjVmNzI2MTY2NjY2YzY1NzMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjcwLTczCiAgICAvLyBjb25zdCBlc2Nyb3cgPSBhYmlDYWxsPHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfZ2V0RXNjcm93cz4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogW1tuYW1lXV0sCiAgICAvLyB9KS5yZXR1cm5WYWx1ZVswXQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgZGlnIDEKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgOSAvLyA5CiAgICAqCiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuKyh1aW50NjQsYm9vbDEpW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo3NQogICAgLy8gYXNzZXJ0KGVzY3Jvdy5pZCAhPT0gMCwgRVJSX0VTQ1JPV19ET0VTX05PVF9FWElTVCkKICAgIGV4dHJhY3QgNiA5CiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgYXNzZXJ0IC8vIEVzY3JvdyBkb2VzIG5vdCBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6ODYKICAgIC8vIGFzc2VydChpZCA9PT0gdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5pZCwgRVJSX1dST05HX0VTQ1JPV19GT1JfT1BFUkFUSU9OKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgMTEgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjg2CiAgICAvLyBhc3NlcnQoaWQgPT09IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuaWQsIEVSUl9XUk9OR19FU0NST1dfRk9SX09QRVJBVElPTikKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBzd2FwCiAgICBkaWcgMQogICAgPT0KICAgIGFzc2VydCAvLyBXcm9uZyBlc2Nyb3cgZm9yIHRoaXMgb3BlcmF0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo4OC05NwogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW48dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9yZWtleVRvUGx1Z2luPih7CiAgICAvLyAgIGFwcElkOiB3YWxsZXQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgWzBdLCAvLyBhbGwgdGhlIGFraXRhIGVzY3Jvd3MgaGF2ZSBtZXRob2QgcmVzdHJpY3Rpb25zIHdpdGggb3B0aW4gYmVpbmcgaW5kZXggMAogICAgLy8gICAgIFtdCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgcHVzaGJ5dGVzIDB4NTgyZmYzODIgLy8gbWV0aG9kICJhcmM1OF9yZWtleVRvUGx1Z2luKHVpbnQ2NCxib29sLHN0cmluZyx1aW50NjRbXSwodWludDY0LHVpbnQ2NClbXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo5MgogICAgLy8gdHJ1ZSwKICAgIHB1c2hieXRlcyAweDgwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OTMKICAgIC8vIG5hbWUsCiAgICBwdXNoYnl0ZXMgMHgwMDBiNzI2NTc2NWY3MjYxNjY2NjZjNjU3MwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjk0CiAgICAvLyBbMF0sIC8vIGFsbCB0aGUgYWtpdGEgZXNjcm93cyBoYXZlIG1ldGhvZCByZXN0cmljdGlvbnMgd2l0aCBvcHRpbiBiZWluZyBpbmRleCAwCiAgICBwdXNoYnl0ZXMgMHgwMDAxMDAwMDAwMDAwMDAwMDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjk1CiAgICAvLyBbXQogICAgYnl0ZWMgMzMgLy8gMHgwMDAwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo4OC05NwogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW48dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9yZWtleVRvUGx1Z2luPih7CiAgICAvLyAgIGFwcElkOiB3YWxsZXQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgWzBdLCAvLyBhbGwgdGhlIGFraXRhIGVzY3Jvd3MgaGF2ZSBtZXRob2QgcmVzdHJpY3Rpb25zIHdpdGggb3B0aW4gYmVpbmcgaW5kZXggMAogICAgLy8gICAgIFtdCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTAxCiAgICAvLyB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU4OAogICAgLy8gbGV0IGNvdW50OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTAKICAgIC8vIGlmICghZXNjcm93LmlzT3B0ZWRJbihhc3NldCkpIHsKICAgIHN3YXAKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBibnogY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDQ0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk5CiAgICAvLyBjb25zdCBbc3BsaXRzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUmV2ZW51ZVNwbGl0cykpCiAgICBkaWcgMTAKICAgIHB1c2hieXRlcyAicmV2ZW51ZV9zcGxpdHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5NAogICAgLy8gY291bnQgKz0gc3BsaXRzLmxlbmd0aAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5MQogICAgLy8gY291bnQgKz0gMQogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTk0CiAgICAvLyBjb3VudCArPSBzcGxpdHMubGVuZ3RoCiAgICArCiAgICBidXJ5IDgKCmNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA0NDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEwNQogICAgLy8gY29uc3QgbWJyQW1vdW50OiB1aW50NjQgPSBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBvcHRJbkNvdW50CiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGRpZyA4CiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMDctMTE4CiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBSZXZlbnVlTWFuYWdlclBsdWdpblN0dWIucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHdhbGxldCwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIFthc3NldC5pZF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gICAgIH0pCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjExNAogICAgLy8gcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDExIC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMTQKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjExMy0xMTYKICAgIC8vIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogbWJyQW1vdW50CiAgICAvLyB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTA3LTExOAogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgUmV2ZW51ZU1hbmFnZXJQbHVnaW5TdHViLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogcmV2ZW51ZU1hbmFnZXIsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB3YWxsZXQsCiAgICAvLyAgICAgdHJ1ZSwKICAgIC8vICAgICBbYXNzZXQuaWRdLAogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vICAgICB9KQogICAgLy8gICBdCiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMTAKICAgIC8vIHdhbGxldCwKICAgIGR1cG4gMgogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTEyCiAgICAvLyBbYXNzZXQuaWRdLAogICAgZGlnIDEwCiAgICBpdG9iCiAgICBwdXNoYnl0ZXMgMHgwMDAxCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEwNy0xMTgKICAgIC8vIGl0eG5Db21wb3NlLm5leHQ8dHlwZW9mIFJldmVudWVNYW5hZ2VyUGx1Z2luU3R1Yi5wcm90b3R5cGUub3B0SW4+KHsKICAgIC8vICAgYXBwSWQ6IHJldmVudWVNYW5hZ2VyLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgd2FsbGV0LAogICAgLy8gICAgIHRydWUsCiAgICAvLyAgICAgW2Fzc2V0LmlkXSwKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogbWJyQW1vdW50CiAgICAvLyAgICAgfSkKICAgIC8vICAgXQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDY4MzVlM2JjIC8vIG1ldGhvZCAib3B0SW4odWludDY0LGJvb2wsdWludDY0W10scGF5KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjkyCiAgICAvLyB0cnVlLAogICAgcHVzaGJ5dGVzIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDQKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTA3LTExOAogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgUmV2ZW51ZU1hbmFnZXJQbHVnaW5TdHViLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogcmV2ZW51ZU1hbmFnZXIsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB3YWxsZXQsCiAgICAvLyAgICAgdHJ1ZSwKICAgIC8vICAgICBbYXNzZXQuaWRdLAogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vICAgICB9KQogICAgLy8gICBdCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTIwCiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3M+KHsgYXBwSWQ6IHdhbGxldCB9KQogICAgaXR4bl9uZXh0CiAgICBwdXNoYnl0ZXMgMHg2Y2MzZjYwNiAvLyBtZXRob2QgImFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTIyCiAgICAvLyBpZiAoYW1vdW50ID4gMCkgewogICAgZGlnIDkKICAgIGJ6IGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA0NgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTIzLTEyOQogICAgLy8gaXR4bkNvbXBvc2UubmV4dCgKICAgIC8vICAgaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFtb3VudCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0LAogICAgLy8gICB9KQogICAgLy8gKQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMjUKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDExIC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMjUKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGRpZyAxMAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMjQtMTI4CiAgICAvLyBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgIGFzc2V0QW1vdW50OiBhbW91bnQsCiAgICAvLyAgIHhmZXJBc3NldDogYXNzZXQsCiAgICAvLyB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQoKY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDQ2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTMyCiAgICAvLyBpdHhuQ29tcG9zZS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDI4CgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUAyMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MDYKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzA2CiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MDcKICAgIC8vIEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzMAogICAgLy8gcHJpemUgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVByaXplIH0pCiAgICBieXRlYyA2IC8vICJwcml6ZSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MDcKICAgIC8vIEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldENyZWF0b3IKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MDgKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gdGlja2V0QXNzZXQgPSBHbG9iYWxTdGF0ZTxBc3NldD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VGlja2V0QXNzZXQgfSkKICAgIGJ5dGVjXzAgLy8gInRpY2tldF9hc3NldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3MDgKICAgIC8vIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcwNS03MTEKICAgIC8vIGFyYzU5T3B0SW5BbmRTZW5kKAogICAgLy8gICB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgLy8gICBBc3NldCh0aGlzLnByaXplLnZhbHVlKS5jcmVhdG9yLAogICAgLy8gICB0aGlzLnRpY2tldEFzc2V0LnZhbHVlLmlkLAogICAgLy8gICBhbW91bnRzLmNyZWF0b3IsCiAgICAvLyAgIGZhbHNlCiAgICAvLyApCiAgICBkaWcgNAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjcxMAogICAgLy8gZmFsc2UKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NzA1LTcxMQogICAgLy8gYXJjNTlPcHRJbkFuZFNlbmQoCiAgICAvLyAgIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICAvLyAgIEFzc2V0KHRoaXMucHJpemUudmFsdWUpLmNyZWF0b3IsCiAgICAvLyAgIHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICAvLyAgIGFtb3VudHMuY3JlYXRvciwKICAgIC8vICAgZmFsc2UKICAgIC8vICkKICAgIGNhbGxzdWIgYXJjNTlPcHRJbkFuZFNlbmQKICAgIGIgY2xhaW1SYWZmbGVQcml6ZV9hZnRlcl9pZl9lbHNlQDI0CgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYyOAogICAgLy8gY29uc3QgcHJpemVBbW91bnQgPSBvcC5Bc3NldEhvbGRpbmcuYXNzZXRCYWxhbmNlKEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLCB0aGlzLnByaXplLnZhbHVlKVswXQogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBwcml6ZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemUgfSkKICAgIGJ5dGVjIDYgLy8gInByaXplIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYyOAogICAgLy8gY29uc3QgcHJpemVBbW91bnQgPSBvcC5Bc3NldEhvbGRpbmcuYXNzZXRCYWxhbmNlKEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLCB0aGlzLnByaXplLnZhbHVlKVswXQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIHN3YXAKICAgIGRpZyAxCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIHBvcAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjMwCiAgICAvLyBpZiAodGhpcy53aW5uZXIudmFsdWUuaXNPcHRlZEluKEFzc2V0KHRoaXMucHJpemUudmFsdWUpKSkgewogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjgKICAgIC8vIHdpbm5lciA9IEdsb2JhbFN0YXRlPEFjY291bnQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5lciB9KQogICAgYnl0ZWMgNCAvLyAid2lubmVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzMAogICAgLy8gaWYgKHRoaXMud2lubmVyLnZhbHVlLmlzT3B0ZWRJbihBc3NldCh0aGlzLnByaXplLnZhbHVlKSkpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBzd2FwCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIGJ1cnkgMQogICAgYnogY2xhaW1SYWZmbGVQcml6ZV9lbHNlX2JvZHlANwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzMS02MzYKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0Q2xvc2VUbzogdGhpcy53aW5uZXIudmFsdWUsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnByaXplLnZhbHVlLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MzMKICAgIC8vIGFzc2V0Q2xvc2VUbzogdGhpcy53aW5uZXIudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjMzCiAgICAvLyBhc3NldENsb3NlVG86IHRoaXMud2lubmVyLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MzQKICAgIC8vIHhmZXJBc3NldDogdGhpcy5wcml6ZS52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTMwCiAgICAvLyBwcml6ZSA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5UHJpemUgfSkKICAgIGJ5dGVjIDYgLy8gInByaXplIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzNAogICAgLy8geGZlckFzc2V0OiB0aGlzLnByaXplLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBpdHhuX2ZpZWxkIEFzc2V0Q2xvc2VUbwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzMS02MzUKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0Q2xvc2VUbzogdGhpcy53aW5uZXIudmFsdWUsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnByaXplLnZhbHVlLAogICAgLy8gICB9KQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzMS02MzYKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0Q2xvc2VUbzogdGhpcy53aW5uZXIudmFsdWUsCiAgICAvLyAgICAgeGZlckFzc2V0OiB0aGlzLnByaXplLnZhbHVlLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICBiIGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA5CgpjbGFpbVJhZmZsZVByaXplX2Vsc2VfYm9keUA3OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjYzOQogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MzkKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY0MAogICAgLy8gdGhpcy53aW5uZXIudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjQwCiAgICAvLyB0aGlzLndpbm5lci52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjQxCiAgICAvLyB0aGlzLnByaXplLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzAKICAgIC8vIHByaXplID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlQcml6ZSB9KQogICAgYnl0ZWMgNiAvLyAicHJpemUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6NjQxCiAgICAvLyB0aGlzLnByaXplLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MzgtNjQ0CiAgICAvLyBhcmM1OU9wdEluQW5kU2VuZCgKICAgIC8vICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgdGhpcy53aW5uZXIudmFsdWUsCiAgICAvLyAgIHRoaXMucHJpemUudmFsdWUsCiAgICAvLyAgIHByaXplQW1vdW50LAogICAgLy8gICB0cnVlCiAgICAvLyApCiAgICBkaWcgNwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjY0MwogICAgLy8gdHJ1ZQogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo2MzgtNjQ0CiAgICAvLyBhcmM1OU9wdEluQW5kU2VuZCgKICAgIC8vICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgdGhpcy53aW5uZXIudmFsdWUsCiAgICAvLyAgIHRoaXMucHJpemUudmFsdWUsCiAgICAvLyAgIHByaXplQW1vdW50LAogICAgLy8gICB0cnVlCiAgICAvLyApCiAgICBjYWxsc3ViIGFyYzU5T3B0SW5BbmRTZW5kCiAgICBiIGNsYWltUmFmZmxlUHJpemVfYWZ0ZXJfaWZfZWxzZUA5CgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaXNMaXZlW3JvdXRpbmddKCkgLT4gdm9pZDoKaXNMaXZlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc5MwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmlzTGl2ZQogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWMgNSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo6UmFmZmxlLmdldFN0YXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0U3RhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODAzCiAgICAvLyB0aWNrZXRBc3NldDogdGhpcy50aWNrZXRBc3NldC52YWx1ZS5pZCwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTEwCiAgICAvLyB0aWNrZXRBc3NldCA9IEdsb2JhbFN0YXRlPEFzc2V0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRBc3NldCB9KQogICAgYnl0ZWNfMCAvLyAidGlja2V0X2Fzc2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwMwogICAgLy8gdGlja2V0QXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwNAogICAgLy8gc3RhcnRUaW1lc3RhbXA6IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExMgogICAgLy8gc3RhcnRUaW1lc3RhbXAgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVN0YXJ0VGltZXN0YW1wIH0pCiAgICBieXRlYyAyNiAvLyAic3RhcnRfdGltZXN0YW1wIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwNAogICAgLy8gc3RhcnRUaW1lc3RhbXA6IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwNQogICAgLy8gZW5kVGltZXN0YW1wOiB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTE0CiAgICAvLyBlbmRUaW1lc3RhbXAgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVuZFRpbWVzdGFtcCB9KQogICAgYnl0ZWMgMTggLy8gImVuZF90aW1lc3RhbXAiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODA1CiAgICAvLyBlbmRUaW1lc3RhbXA6IHRoaXMuZW5kVGltZXN0YW1wLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MDYKICAgIC8vIHNlbGxlcjogdGhpcy5zZWxsZXIudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExNgogICAgLy8gc2VsbGVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5U2VsbGVyIH0pCiAgICBieXRlYyAxMyAvLyAic2VsbGVyIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwNgogICAgLy8gc2VsbGVyOiB0aGlzLnNlbGxlci52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODA3CiAgICAvLyBtaW5UaWNrZXRzOiB0aGlzLm1pblRpY2tldHMudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjExOAogICAgLy8gbWluVGlja2V0cyA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5TWluVGlja2V0cyB9KQogICAgYnl0ZWMgMzEgLy8gIm1pbl90aWNrZXRzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwNwogICAgLy8gbWluVGlja2V0czogdGhpcy5taW5UaWNrZXRzLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MDgKICAgIC8vIG1heFRpY2tldHM6IHRoaXMubWF4VGlja2V0cy52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTIwCiAgICAvLyBtYXhUaWNrZXRzID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlNYXhUaWNrZXRzIH0pCiAgICBieXRlYyAxNSAvLyAibWF4X3RpY2tldHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODA4CiAgICAvLyBtYXhUaWNrZXRzOiB0aGlzLm1heFRpY2tldHMudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwOQogICAgLy8gZW50cnlDb3VudDogdGhpcy5lbnRyeUNvdW50LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjIKICAgIC8vIGVudHJ5Q291bnQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleUVudHJ5Q291bnQgfSkKICAgIGJ5dGVjXzMgLy8gImVudHJ5X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgwOQogICAgLy8gZW50cnlDb3VudDogdGhpcy5lbnRyeUNvdW50LnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MTAKICAgIC8vIHRpY2tldENvdW50OiB0aGlzLnRpY2tldENvdW50LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjQKICAgIC8vIHRpY2tldENvdW50ID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlUaWNrZXRDb3VudCB9KQogICAgYnl0ZWNfMiAvLyAidGlja2V0X2NvdW50IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxMAogICAgLy8gdGlja2V0Q291bnQ6IHRoaXMudGlja2V0Q291bnQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxMQogICAgLy8gd2lubmluZ1RpY2tldDogdGhpcy53aW5uaW5nVGlja2V0LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMjYKICAgIC8vIHdpbm5pbmdUaWNrZXQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVdpbm5pbmdUaWNrZXQgfSkKICAgIGJ5dGVjIDkgLy8gIndpbm5pbmdfdGlja2V0IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxMQogICAgLy8gd2lubmluZ1RpY2tldDogdGhpcy53aW5uaW5nVGlja2V0LnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MTIKICAgIC8vIHdpbm5lcjogdGhpcy53aW5uZXIudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gd2lubmVyID0gR2xvYmFsU3RhdGU8QWNjb3VudD4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5V2lubmVyIH0pCiAgICBieXRlYyA0IC8vICJ3aW5uZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODEyCiAgICAvLyB3aW5uZXI6IHRoaXMud2lubmVyLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MTMKICAgIC8vIHByaXplOiB0aGlzLnByaXplLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzAKICAgIC8vIHByaXplID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlQcml6ZSB9KQogICAgYnl0ZWMgNiAvLyAicHJpemUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODEzCiAgICAvLyBwcml6ZTogdGhpcy5wcml6ZS52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODE0CiAgICAvLyBwcml6ZUNsYWltZWQ6IHRoaXMucHJpemVDbGFpbWVkLnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMzQKICAgIC8vIHByaXplQ2xhaW1lZCA9IEdsb2JhbFN0YXRlPGJvb2xlYW4+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVByaXplQ2xhaW1lZCB9KQogICAgYnl0ZWMgMTYgLy8gInByaXplX2NsYWltZWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODE0CiAgICAvLyBwcml6ZUNsYWltZWQ6IHRoaXMucHJpemVDbGFpbWVkLnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MTUKICAgIC8vIGdhdGVJRDogdGhpcy5nYXRlSUQudmFsdWUsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjEzOAogICAgLy8gZ2F0ZUlEID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlHYXRlSUQgfSkKICAgIGJ5dGVjIDEwIC8vICJnYXRlX2lkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxNQogICAgLy8gZ2F0ZUlEOiB0aGlzLmdhdGVJRC52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODE2CiAgICAvLyB2cmZGYWlsdXJlQ291bnQ6IHRoaXMudnJmRmFpbHVyZUNvdW50LnZhbHVlLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxNDYKICAgIC8vIHZyZkZhaWx1cmVDb3VudCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5VlJGRmFpbHVyZUNvdW50IH0pCiAgICBieXRlYyAyMCAvLyAidnJmX2ZhaWx1cmVfY291bnQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODE2CiAgICAvLyB2cmZGYWlsdXJlQ291bnQ6IHRoaXMudnJmRmFpbHVyZUNvdW50LnZhbHVlLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo4MTcKICAgIC8vIGVudHJ5SUQ6IHRoaXMuZW50cnlJRC52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTQ4CiAgICAvLyBlbnRyeUlEID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogUmFmZmxlR2xvYmFsU3RhdGVLZXlFbnRyeUlEIH0pCiAgICBieXRlYyAzMiAvLyAiZW50cnlfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODE3CiAgICAvLyBlbnRyeUlEOiB0aGlzLmVudHJ5SUQudmFsdWUsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxOAogICAgLy8gcmVmdW5kTUJSQ3Vyc29yOiB0aGlzLnJlZnVuZE1CUkN1cnNvci52YWx1ZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyByZWZ1bmRNQlJDdXJzb3IgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBSYWZmbGVHbG9iYWxTdGF0ZUtleVJlZnVuZE1CUkN1cnNvciB9KQogICAgYnl0ZWMgMTcgLy8gInJlZnVuZF9tYnJfY3Vyc29yIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjgxOAogICAgLy8gcmVmdW5kTUJSQ3Vyc29yOiB0aGlzLnJlZnVuZE1CUkN1cnNvci52YWx1ZSwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODAyLTgxOQogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgdGlja2V0QXNzZXQ6IHRoaXMudGlja2V0QXNzZXQudmFsdWUuaWQsCiAgICAvLyAgIHN0YXJ0VGltZXN0YW1wOiB0aGlzLnN0YXJ0VGltZXN0YW1wLnZhbHVlLAogICAgLy8gICBlbmRUaW1lc3RhbXA6IHRoaXMuZW5kVGltZXN0YW1wLnZhbHVlLAogICAgLy8gICBzZWxsZXI6IHRoaXMuc2VsbGVyLnZhbHVlLAogICAgLy8gICBtaW5UaWNrZXRzOiB0aGlzLm1pblRpY2tldHMudmFsdWUsCiAgICAvLyAgIG1heFRpY2tldHM6IHRoaXMubWF4VGlja2V0cy52YWx1ZSwKICAgIC8vICAgZW50cnlDb3VudDogdGhpcy5lbnRyeUNvdW50LnZhbHVlLAogICAgLy8gICB0aWNrZXRDb3VudDogdGhpcy50aWNrZXRDb3VudC52YWx1ZSwKICAgIC8vICAgd2lubmluZ1RpY2tldDogdGhpcy53aW5uaW5nVGlja2V0LnZhbHVlLAogICAgLy8gICB3aW5uZXI6IHRoaXMud2lubmVyLnZhbHVlLAogICAgLy8gICBwcml6ZTogdGhpcy5wcml6ZS52YWx1ZSwKICAgIC8vICAgcHJpemVDbGFpbWVkOiB0aGlzLnByaXplQ2xhaW1lZC52YWx1ZSwKICAgIC8vICAgZ2F0ZUlEOiB0aGlzLmdhdGVJRC52YWx1ZSwKICAgIC8vICAgdnJmRmFpbHVyZUNvdW50OiB0aGlzLnZyZkZhaWx1cmVDb3VudC52YWx1ZSwKICAgIC8vICAgZW50cnlJRDogdGhpcy5lbnRyeUlELnZhbHVlLAogICAgLy8gICByZWZ1bmRNQlJDdXJzb3I6IHRoaXMucmVmdW5kTUJSQ3Vyc29yLnZhbHVlLAogICAgLy8gfQogICAgdW5jb3ZlciAxNQogICAgaXRvYgogICAgdW5jb3ZlciAxNQogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDE0CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgMTMKICAgIGNvbmNhdAogICAgdW5jb3ZlciAxMgogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDExCiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgMTAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciA5CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgOAogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDcKICAgIGNvbmNhdAogICAgdW5jb3ZlciA2CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHB1c2hieXRlcyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciA3CiAgICBzZXRiaXQKICAgIGNvbmNhdAogICAgdW5jb3ZlciA0CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgMwogICAgaXRvYgogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgc3dhcAogICAgaXRvYgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6ODAxCiAgICAvLyBnZXRTdGF0ZSgpOiBSYWZmbGVTdGF0ZSB7CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUZlZUdlbmVyYXRvckNvbnRyYWN0LnVwZGF0ZUFraXRhREFPRXNjcm93W3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU9Fc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzcKICAgIC8vIHVwZGF0ZUFraXRhREFPRXNjcm93KGFwcDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWMgMjIgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEzOAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgMTEgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEzOQogICAgLy8gdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZSA9IGFwcAogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEzNwogICAgLy8gdXBkYXRlQWtpdGFEQU9Fc2Nyb3coYXBwOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpVcGdyYWRlYWJsZUFraXRhQmFzZUNvbnRyYWN0LnVwZGF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTAKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBieXRlYyAyMiAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTAKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICB1bmNvdmVyIDIKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBieXRlYyAzNCAvLyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTEKICAgIC8vIGNvbnN0IHVwZGF0ZVBsdWdpbiA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkudXBkYXRlCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTIKICAgIC8vIGFzc2VydChHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCA9PT0gdXBkYXRlUGx1Z2luLCBFUlJfSU5WQUxJRF9VUEdSQURFKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgID09CiAgICBhc3NlcnQgLy8gSW52YWxpZCBhcHAgdXBncmFkZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIHB1c2hieXRlcyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUzCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSBuZXdWZXJzaW9uCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ5dGVjIDIyIC8vICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDAKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURBTwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvb3B0aW4udHM6OkNvbnRyYWN0V2l0aENyZWF0b3JPbmx5T3B0SW4ub3B0aW5bcm91dGluZ10oKSAtPiB2b2lkOgpvcHRpbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9vcHRpbi50czo1MwogICAgLy8gb3B0aW4ocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhc3NldDogdWludDY0KTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvb3B0aW4udHM6NTQKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSBHbG9iYWwuY3JlYXRvckFkZHJlc3MpCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9vcHRpbi50czo1Ni02MwogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL29wdGluLnRzOjU5CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL29wdGluLnRzOjU2LTYzCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvb3B0aW4udHM6NjAKICAgIC8vIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvb3B0aW4udHM6NTYtNjMKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9vcHRpbi50czo2NS02OQogICAgLy8gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KS5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL29wdGluLnRzOjY2CiAgICAvLyBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL29wdGluLnRzOjY3CiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9vcHRpbi50czo2NS02OQogICAgLy8gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KS5zdWJtaXQoKQogICAgaW50Y18zIC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9vcHRpbi50czo1MwogICAgLy8gb3B0aW4ocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhc3NldDogdWludDY0KTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaXNMaXZlKCkgLT4gdWludDY0OgpzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5pc0xpdmU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Nzk2CiAgICAvLyBHbG9iYWwubGF0ZXN0VGltZXN0YW1wID49IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUgJiYKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6MTEyCiAgICAvLyBzdGFydFRpbWVzdGFtcCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5U3RhcnRUaW1lc3RhbXAgfSkKICAgIGJ5dGVjIDI2IC8vICJzdGFydF90aW1lc3RhbXAiCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6Nzk2CiAgICAvLyBHbG9iYWwubGF0ZXN0VGltZXN0YW1wID49IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUgJiYKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc5Ni03OTcKICAgIC8vIEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgPj0gdGhpcy5zdGFydFRpbWVzdGFtcC52YWx1ZSAmJgogICAgLy8gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCA8PSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZQogICAgYnogc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaXNMaXZlX2Jvb2xfZmFsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc5NwogICAgLy8gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCA8PSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czoxMTQKICAgIC8vIGVuZFRpbWVzdGFtcCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IFJhZmZsZUdsb2JhbFN0YXRlS2V5RW5kVGltZXN0YW1wIH0pCiAgICBieXRlYyAxOCAvLyAiZW5kX3RpbWVzdGFtcCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3OTcKICAgIC8vIEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgPD0gdGhpcy5lbmRUaW1lc3RhbXAudmFsdWUKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICA8PQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjc5Ni03OTcKICAgIC8vIEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgPj0gdGhpcy5zdGFydFRpbWVzdGFtcC52YWx1ZSAmJgogICAgLy8gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCA8PSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZQogICAgYnogc21hcnRfY29udHJhY3RzL3JhZmZsZS9jb250cmFjdC5hbGdvLnRzOjpSYWZmbGUuaXNMaXZlX2Jvb2xfZmFsc2VAMwogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3OTUtNzk4CiAgICAvLyByZXR1cm4gKAogICAgLy8gICBHbG9iYWwubGF0ZXN0VGltZXN0YW1wID49IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUgJiYKICAgIC8vICAgR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCA8PSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZQogICAgLy8gKQogICAgcmV0c3ViCgpzbWFydF9jb250cmFjdHMvcmFmZmxlL2NvbnRyYWN0LmFsZ28udHM6OlJhZmZsZS5pc0xpdmVfYm9vbF9mYWxzZUAzOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvY29udHJhY3QuYWxnby50czo3OTUtNzk4CiAgICAvLyByZXR1cm4gKAogICAgLy8gICBHbG9iYWwubGF0ZXN0VGltZXN0YW1wID49IHRoaXMuc3RhcnRUaW1lc3RhbXAudmFsdWUgJiYKICAgIC8vICAgR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCA8PSB0aGlzLmVuZFRpbWVzdGFtcC52YWx1ZQogICAgLy8gKQogICAgcmV0c3ViCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyANAAEIBIAgoI0Grf7V5NSF/ahYqIsDz4Keu+/v3oIU0YKeu+/v3oIU/////w/Ur6AG////////////ASYjDHRpY2tldF9hc3NldAlha2l0YV9kYW8MdGlja2V0X2NvdW50C2VudHJ5X2NvdW50Bndpbm5lcgQVH3x1BXByaXplCHdfdG90YWxzAWEOd2lubmluZ190aWNrZXQHZ2F0ZV9pZAxha2l0YV9lc2Nyb3cRd2VpZ2h0c19ib3hfY291bnQGc2VsbGVyAXcLbWF4X3RpY2tldHMNcHJpemVfY2xhaW1lZBFyZWZ1bmRfbWJyX2N1cnNvcg1lbmRfdGltZXN0YW1wC21hcmtldHBsYWNlEXZyZl9mYWlsdXJlX2NvdW50AWUGd2FsbGV0FW1hcmtldHBsYWNlX3JveWFsdGllcwNvYWwMaXNfcHJpemVfYm94D3N0YXJ0X3RpbWVzdGFtcA1ha2l0YV9yb3lhbHR5E2ZpbmRfd2lubmVyX2N1cnNvcnMPY3JlYXRvcl9yb3lhbHR5AwaBAQttaW5fdGlja2V0cwhlbnRyeV9pZAIAAANwYWyCAgQkh8MsBOqRgN02GgCOAgDLAMAxGRREMRhBAKmCEgS9cUjQBPLOL0YELJQlFASXOcu2BOOiHVIEBUowIARju7c1BEghIcMEaWUB3gS9GyfRBGX8qYsEj6ShYASeVybxBB6tIKkEM+kslASFTe3gBNmjX6QEPqEYMjYaAI4SBDkElAUNBX4GRQcqB9UH6QhyClILcRAQECEQtREOACIAARErAIAcFR98dQAAAAAAAHvUAAAAAADIF9QAAAAAAABJ1LAjQyNDgATiLgOSNhoAjgECWAAxGSUSMRgQREIQljEZgQUSMRgQREIFFYoCAIv+gQoIiwAyDA1BACqxgQayEIEFshknHrIeJx6yH4v/jQIACwAEs0L/2zIAsgFC//UisgFC/++JigEBi/+BEpGL/xuBG5EhChqL/4E7kUqRTBwjHkUBgR8aTwJMkCEKGhmJigEBMQCL/0AABIsATImL/4ASY29udHJvbGxlZF9hZGRyZXNzZUhC/+OKAgGL/icYZUiBGFuxgAQ8Gm8zshqL/7IashiBBrIQIrIBs7Q+SVcEAEsBVwAEJwUSREkiWYECCEwVEkRXBgBJFUlBAAeLASQTQQAEIowAiYsAF0L/94oEArGL/IADYWFsZUiBKFuL/haABCAPdCGyGov9shqyGov/shqyGIEGshAisgGztD5JVwQATFcABCcFEkRJFSMSRCJTi/+JigUAgABHAiKL+ycYZUiBEFtHAnIITE4CRLGL/RZJTgKABMqo2qWyGov8shqyGrIYgQayECKyAbO0PklXBABLAVcABCcFEkRJFYEZEkRLAYEMW0lOAk4DgYABU04CSwFXFQhOAkyBFVtMQAAFiwpBABOxiweLCgiyCIsFsgcjshAisgGziwhAABmxgAToVAgQshqLBrIaiwSyGIEGshAisgGzI4wCI4wAIowBi/9BAA0jjAEijAAijAKLBYwDsYsBQQAEiwOyFYv9shGLAEEABIv+shKLAkEABIsFshQlshAisgG2gAQIUx7XshqL/LIaiwmyGosEshiBBrIQIrIBs7cBPklXBABMVwAEJwUSRBWBIBJEiYAARwI2GgFJFSQSRBc2GgJJFSMSRCJTNhoDSRUkEkQXSU4DNhoESRUkEkQXTgM2GgVJFSQSRBdOAzYaBklOBBWBIBJENhoHSU4EFYEoEkQ2GggVJBJENhoJSRUkEkQXTgM2GgpJFSQSRBdOAzYaC0kVJBJEF04DNhoMSU4EFYEgEkQ2Gg1JFSQSRBdOAzYaDkkVJBJEF04DMg1EJwZPA2cnGU8CZ0EABksKcQBERChLC2cnGksKSU4CZ0sJDEEA7EsIMgcNQQDkI0QnEksJZycNSwhngAZmdW5kZXJLB2cnH0sGZycPSwVnKyJnKiJnJwkiZycEMgNnJxAiZycKSwRnJxNLA2cpSwJnJwtLAWciKWVEgAhuZnRfZmVlc2VISYFwWycXTGciKWVEIicNZUSxTIADc2FsZUiBEFuABNV0uxCyGrIYshqBBrIQIrIBs7Q+SVcEAExXAAQnBRJESRUkEkQXSUUQSwGBYFtFDkyBaFtFDiMNQQAvSw0jCUsNSUsOCU8CC4HoBwoJJxtMZycgImcnDCJngXivJwdMZycRImcnFCJnI0MjQv/RIkL/GTEWIwlJOBAjEkQ2GgFJFSQSRBdJTgIxADIJEkRJJQ9ESYEQDERJIQsLSwI4BzIKEk8DOAhPAhIQRCcMTGciSUsCDEEAFEcCFicOTFCBgIACuUgjCEUBQv/lI0M2GgFJFSQSRBciK2VEIwkiJwRlRDIDE0QiJxFlREoTRExLAQlJSwMNTE8DTwJNSU4CgWQLIoj7fUlLAgxBACxHAhYnFUxQSb5EVwAgTLxIJwhLAVC8SLGyByEHsggjshAisgGzIwhFAUL/zSInEWVESwIIJxFMZyNDIicQZUREIiInDGVESwENQQAbIicMZUQjCUsBSU4CCRYnDkxQvEgjCEUBQv/aIicMZUQhCwuxMglLAbIIsgcjshAisgGzJwwiZxYnBUxQsCNDMQAyCRJEIicQZUREIitlRCMJIicRZUQTRCInDGVEFEMxFiMJSTgQIxJENhoBSRWBIBJENhoCiAvRRCIoZUQURCInCmVEQQAfIillRDEAiPsoiPr8IillRCInCmVETE4CSwOI+2pIRCcIMQBQvUUBFERLAkk4BzIKEkw4CCInD2VEIQcISwEPTwIQRCIrZUQxAEsEUEsBFicVSwFQTwK/JwgxAFBMv0whBwlJFksCIQQKSRYnDkxQTwQhBBgkC08DuyInB2VETCQLSltLAwgWXScHTGciK2VEIwgrTGciKmVECCpMZyNDMRaBAglJOBAjEkQxFiMJSTgQJRJENhoBSRWBIBJENhoCiAr/RCIoZUREIicKZURBAB8iKWVEMQCI+leI+isiKWVEIicKZURMTgJLA4j6mUhEJwgxAFC9RQEUREsDSTgHMgoSTDgIIQcSEERLAkk4FDIKEksBOBEiKGVEEhBMOBIiJw9lREsBD08CEEQiK2VEMQBLBFBLARYnFUsBUE8CvycIMQBQTL9LARZLASEECkkWJw5MUE8DIQQYJAtPA7siJwdlREwkC0pbSwMIFl0nB0xnIitlRCMIK0xnIiplRAgqTGcjQzEWIwlJOBAjEkQ2GgGICi5EIihlRBREIicKZURBAB8iKWVEMQCI+YWI+VkiKWVEIicKZURMTgJLA4j5x0hEJwgxAFC9RQFEJwgxAFC+RBdJIQQKSRYnDkxQTwIhBBgkC0okuksFSTgHMgoSTDgIIicPZURPAxdMSwEJSwIPTwMQRElLAggWTwRPBE8CuyInB2VETwMkC0pbTwQIFl0nB0xnIiplRAgqTGcjQzEWgQIJOBCBBhJEMRYjCTgQJRJDMRYjCUk4ECUSRIgJckQiKGVESUQnCDEAUL1FAUQnCDEAUL5EF0khBApJFicOTFBPAiEEGCQLSiS6SwU4FDIKEksGOBFPBhIQTwU4EiInD2VETwMXTEsBCUsCD08DEERJSwIIFk8ETwRPArsiJwdlRE8DJAtKW08ECBZdJwdMZyIqZUQIKkxnI0MiRwKAAEcHIicSZUQjCCInFGVEJQsIMgZLASQID0QiJwllRBREsSIpZUQnGGVIIltMFiKABHNhbHRlREkVFlcGAkxQgAQYk5LFshpMshqyGrIYgQayECKyAbO0PklXBABLAVcABCcFEkRJIlmBAghMFRJEVwYASRVJQAANIicUZUQjCCcUTGcjQyJLAUlOAg8iSwJPAk2BEEsCD4EQTwNPAk1LA04CUkkVgRASREkiWyIhBh1FAUkhCB5FAU8CHkUBIQYdRQEhCB5OAkhPAiRbTCEJHkUBHkUBIQYdRQEhCR5FAUwWTBZQRQwiKmVMSU4CRQVEIQwMQQAGSwIjCEUDJyFFDUsCQQDQSwJJIw1EIwlJRQsjDURLCUkcIx5FAUwYRQQiRQdLC0ULSwYjDEEAjEsKSSJbSUUHIQYdRQEhCB5JTgJFDEhMJFtFB0AAaYGihbz23t+9hShLBkkhBh1FAU8CHkUBSwoWTBZQSwaI9qGBIJBPAoj2mRkWUElXABBMgRBbSUUKSwUPQQAmSwhLCxgjCBZLDklPAlBMIlkjCBZXBgJcAEUOSwcjCEUIRQtC/3dFC0L/eSEJQv+cSwqAAgASUEsNUEmBEFlLARVSgQJbJwlMZ0L+riEMRQpC/zcigABJNhoBSRUkEkQXMgciJxJlRA1EIicJZUREIicEZUQyAxJEIiccZURJIltMJFsiIicMZURLAQ1BANkiJwdlREsBJAtbSUUHIicJZURLA08CCAxBAKZLAhZLAhZQSSJbSU4CRQUkW0UDIitlREsBCUlLBklOAw1MTgJNSU4CRQYhBAoWJw5MUEUIgSgLIoj1ZSJFAUlLBAxBAEhJJAtLB0wkuhdLAklPAghFBiInCWVEDkEAICInCWVESwUOQQAVSwJLAQgjCBYnFUxQvkRXACAnBExnSwQjCEUCSSMIRQFC/7EiJxxlREkiW0sFCBZcAEsCFlwIJxxMZyNDSwIhBAhFA0sFIwhLAghFAkkjCEUBQv8cSwIWSwIWUEL/PyJJgABHCyInBGVEMgMTRCInEGVEFEQiJxllREEENbEiJwZlRCInBGVEgASt+SrkshqyGrIYgQayECKyAbMiKmVMRQtEIicZZUQiRQhAAC4iJx1lREEAJiInHWVESSEFDkRLCh0hBZdJRQhAABAiJx1lREEACEsJQQADI0UHIkUMIicbZURBAB4iJxtlREkhBQ5ESwodIQWXSUUNQAAISwlBAAMjRQwiRQYiJxdlREEAJiInF2VESSEFDkRLCh0hBZdJRQdAABAiJxdlREEACEsJQQADI0UGSwZJSw1JTgMIgQJLCUlOBQsISw1MCUwWTwIWUE8CFlBMFlBFDiInBGVEJwhMUL5EFxYnFUxQvkRXICBFDSIoZURAAHxLDSJbSUUEQQAWsSInBmVEcQtESwOyCLIHI7IQIrIBs7EiJwtlRHIIREsOSU4CJFuyCLIHI7IQIrIBs7EiJxNlREsBgRBbSbIITLIHI7IQIrIBs7GyCEsNsgcjshAisgGzsSInDWVETIEYW7IIsgcjshAisgGzJxAjZyNDSw0iW0lFA0EALyInBmVEcQtEIihlRHAARQFBAoaxIicGZURxC0QiKGVEshFLArISshQlshAisgGzIicLZURyCEQiKGVEcABFAUEA77EiJwtlRHIIREsOJFsiKGVEshGyErIUJbIQIrIBsyInE2VEIihlRHAARQFBAKixIicTZURLDoEQWyIoZUSyEbISshQlshAisgGzIihlREsNTHAARQFBAGKxSw2BEFsiKGVEshGyEksMshQlshAisgGzIicNZUQiKGVEcABFAUEAIbEiJw1lRCIqZUQiKGVEshGyEkmyFbIUJbIQIrIBs0L/DCIpZUQiJw1lRCIoZUQiKmVEI4jzaUL+9CIpZUQiKGVESw+BEFtPAksPTwNPAyKI801C/5siKWVEIicTZUQiKGVESxCBEFsiiPM0Qv9bIihlTElOAkULREsOJFtFCyIpZUxJTgJFDkRJJxZlSElOAkUESSciZUhJVwgITCRbRQhMJxZlSLGABKJAPd+yGoARAAEAAgALcmV2X3JhZmZsZXOyGrIYgQayECKyAbO0PklXBABLAVcABCcFEkRJIlmBCQuBAghMFRJEVwYJIltJRCInC2VETEsBEkSxgARYL/OCshpMshqAAYCyGoANAAtyZXZfcmFmZmxlc7IagAoAAQAAAAAAAAAAshonIbIaTLIYgQayECKyAXIIRCJFCkxwAEUBQAAaSwqADnJldmVudWVfc3BsaXRzZUgiWSMIRQgyEEsIC7YiJwtlRHIIRLIHsggjshAisgG2RwIWSwoWgAIAAUxQgARoNeO8shpMshqAAYCyGrIaSwSyGIEGshAisgG2gARsw/YGshqyGIEGshAisgFLCUEAGbYiJwtlRHIIREsJshFLCrISshQlshAisgGzQv3HIillRCInBmVEcQtEIihlREsEIojxs0L9fTIKIicGZURMSwFwAEhFBiInBGVETHAARQFBABmxIicEZUQiJwZlRLIRshUlshAisgGzQvu1IillRCInBGVEIicGZURLByOI8WdC+56IAVWAAQAiTwJUJwVMULAjQyIoZUQiJxplRCInEmVEIicNZUQiJx9lRCInD2VEIitlRCIqZUQiJwllRCInBGVEIicGZUQiJxBlRCInCmVEIicUZUQiJyBlRCInEWVETw8WTw8WUE8OFlBPDVBPDBZQTwsWUE8KFlBPCRZQTwgWUE8HUE8GFlCAAQAiTwdUUE8EFlBPAxZQTwIWUEwWUCcFTFCwI0M2GgFJFSQSRBcxACIpZUQnFmVIcghEEkQnC0xnI0M2GgFJIlmBAghLARUSRFcCADEAIillREknFmVIcghETwISRCciZUiBEFsyDRJEgAd2ZXJzaW9uTGcjQzYaAUkVJBJEFzEAIillRCcWZUhyCEQSRClMZyNDMRYjCUk4ECMSRDYaAUkVJBJEFzEAMgkSREsBOAcyChJPAjgIMhASEESxMgpMshEishKyFCWyECKyAbMjQzIHIicaZUQPQQANMgciJxJlRA5BAAIjiSKJ", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var BinaryStateValue = class {
  constructor(value) {
    this.value = value;
  }
  asByteArray() {
    return this.value;
  }
  asString() {
    return this.value !== void 0 ? Buffer.from(this.value).toString("utf-8") : void 0;
  }
};
var RaffleParamsFactory = class _RaffleParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void":
            return _RaffleParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the Raffle smart contract using the create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void",
          args: Array.isArray(params.args) ? params.args : [params.args.prize, params.args.isPrizeBox, params.args.ticketAsset, params.args.startTimestamp, params.args.endTimestamp, params.args.seller, params.args.funder, params.args.creatorRoyalty, params.args.minTickets, params.args.maxTickets, params.args.gateId, params.args.marketplace, params.args.akitaDao, params.args.akitaDaoEscrow]
        };
      }
    };
  }
  /**
   * Gets available update ABI call param factories
   */
  static get update() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "update":
          case "update(string)void":
            return _RaffleParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the Raffle smart contract using the update(string)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      update(params) {
        return {
          ...params,
          method: "update(string)void",
          args: Array.isArray(params.args) ? params.args : [params.args.newVersion]
        };
      }
    };
  }
  /**
   * Gets available delete ABI call param factories
   */
  static get delete() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "deleteApplication":
          case "deleteApplication()void":
            return _RaffleParamsFactory.delete.deleteApplication(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs delete ABI call params for the Raffle smart contract using the deleteApplication()void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      deleteApplication(params) {
        return {
          ...params,
          method: "deleteApplication()void",
          args: Array.isArray(params.args) ? params.args : []
        };
      }
    };
  }
  /**
   * Constructs a no op call for the init(pay,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static init(params) {
    return {
      ...params,
      method: "init(pay,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.weightListLength]
    };
  }
  /**
   * Constructs a no op call for the refundMBR(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static refundMbr(params) {
    return {
      ...params,
      method: "refundMBR(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.iterationAmount]
    };
  }
  /**
   * Constructs a no op call for the clearWeightsBoxes()uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static clearWeightsBoxes(params) {
    return {
      ...params,
      method: "clearWeightsBoxes()uint64",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the enter(pay,address,byte[][])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static enter(params) {
    return {
      ...params,
      method: "enter(pay,address,byte[][])void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.marketplace, params.args.args]
    };
  }
  /**
   * Constructs a no op call for the enterAsa(pay,axfer,address,byte[][])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static enterAsa(params) {
    return {
      ...params,
      method: "enterAsa(pay,axfer,address,byte[][])void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.assetXfer, params.args.marketplace, params.args.args]
    };
  }
  /**
   * Constructs a no op call for the add(pay,byte[][])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static add(params) {
    return {
      ...params,
      method: "add(pay,byte[][])void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.args]
    };
  }
  /**
   * Constructs a no op call for the gatedAddAsa(appl,axfer)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static gatedAddAsa(params) {
    return {
      ...params,
      method: "gatedAddAsa(appl,axfer)void",
      args: Array.isArray(params.args) ? params.args : [params.args.gateTxn, params.args.assetXfer]
    };
  }
  /**
   * Constructs a no op call for the addAsa(axfer,byte[][])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static addAsa(params) {
    return {
      ...params,
      method: "addAsa(axfer,byte[][])void",
      args: Array.isArray(params.args) ? params.args : [params.args.assetXfer, params.args.args]
    };
  }
  /**
   * Constructs a no op call for the raffle()void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static raffle(params) {
    return {
      ...params,
      method: "raffle()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the findWinner(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static findWinner(params) {
    return {
      ...params,
      method: "findWinner(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.iterationAmount]
    };
  }
  /**
   * Constructs a no op call for the claimRafflePrize()void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static claimRafflePrize(params) {
    return {
      ...params,
      method: "claimRafflePrize()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the isLive()bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isLive(params) {
    return {
      ...params,
      method: "isLive()bool",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getState(params) {
    return {
      ...params,
      method: "getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the updateAkitaDAOEscrow(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateAkitaDaoEscrow(params) {
    return {
      ...params,
      method: "updateAkitaDAOEscrow(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.app]
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
      method: "updateAkitaDAO(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.akitaDao]
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
      method: "opUp()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the mbr()(uint64,uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static mbr(params) {
    return {
      ...params,
      method: "mbr()(uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the optin(pay,uint64)void ABI method
   *
   * optin tells the contract to opt into an asa
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static optin(params) {
    return {
      ...params,
      method: "optin(pay,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.asset]
    };
  }
};
var RaffleFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `RaffleFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory({
      ...params,
      appSpec: APP_SPEC
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
    return new RaffleClient(this.appFactory.getAppClientById(params));
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
    return new RaffleClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the Raffle smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b, _c;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? RaffleParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? RaffleParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0,
      deleteParams: ((_c = params.deleteParams) == null ? void 0 : _c.method) ? RaffleParamsFactory.delete._resolveByMethod(params.deleteParams) : params.deleteParams ? params.deleteParams : void 0
    });
    return { result: result.result, appClient: new RaffleClient(result.appClient) };
  }
  /**
   * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the Raffle smart contract using the create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(RaffleParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the Raffle smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(RaffleParamsFactory.update.update(params));
      }
    },
    /**
     * Gets available deployDelete methods
     */
    deployDelete: {
      /**
       * Deletes an existing instance of the Raffle smart contract using the deleteApplication()void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployDelete params
       */
      deleteApplication: (params = { args: [] }) => {
        return this.appFactory.params.deployDelete(RaffleParamsFactory.delete.deleteApplication(params));
      }
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the Raffle smart contract using the create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(RaffleParamsFactory.create.create(params));
      }
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the Raffle smart contract using an ABI method call using the create(uint64,bool,uint64,uint64,uint64,address,(address,uint64),uint64,uint64,uint64,uint64,address,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(RaffleParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new RaffleClient(result.appClient) };
      }
    }
  };
};
var RaffleClient = class _RaffleClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
      ...appClientOrParams,
      appSpec: APP_SPEC
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? getArc56ReturnValue(returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : void 0;
  }
  /**
   * Returns a new `RaffleClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _RaffleClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
  }
  /**
   * Returns an `RaffleClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _RaffleClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
   * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the Raffle smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(RaffleParamsFactory.update.update(params));
      }
    },
    /**
     * Gets available delete methods
     */
    delete: {
      /**
       * Deletes an existing instance of the Raffle smart contract using the `deleteApplication()void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The delete params
       */
      deleteApplication: (params = { args: [] }) => {
        return this.appClient.params.delete(RaffleParamsFactory.delete.deleteApplication(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the Raffle smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the Raffle smart contract using the `init(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    init: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.init(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `refundMBR(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    refundMbr: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.refundMbr(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `clearWeightsBoxes()uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    clearWeightsBoxes: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.clearWeightsBoxes(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `enter(pay,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    enter: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.enter(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `enterAsa(pay,axfer,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    enterAsa: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.enterAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `add(pay,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    add: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.add(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `gatedAddAsa(appl,axfer)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    gatedAddAsa: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.gatedAddAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `addAsa(axfer,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    addAsa: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.addAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `raffle()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    raffle: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.raffle(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `findWinner(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    findWinner: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.findWinner(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `claimRafflePrize()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    claimRafflePrize: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.claimRafflePrize(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `isLive()bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params: a boolean of whether the auction is live
     */
    isLive: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.isLive(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getState: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.getState(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.opUp(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mbr: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `optin(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    optin: (params) => {
      return this.appClient.params.call(RaffleParamsFactory.optin(params));
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the Raffle smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(RaffleParamsFactory.update.update(params));
      }
    },
    /**
     * Gets available delete methods
     */
    delete: {
      /**
       * Deletes an existing instance of the Raffle smart contract using the `deleteApplication()void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The delete transaction
       */
      deleteApplication: (params = { args: [] }) => {
        return this.appClient.createTransaction.delete(RaffleParamsFactory.delete.deleteApplication(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the Raffle smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the Raffle smart contract using the `init(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    init: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.init(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `refundMBR(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    refundMbr: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.refundMbr(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `clearWeightsBoxes()uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    clearWeightsBoxes: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.clearWeightsBoxes(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `enter(pay,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    enter: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.enter(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `enterAsa(pay,axfer,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    enterAsa: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.enterAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `add(pay,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    add: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.add(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `gatedAddAsa(appl,axfer)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    gatedAddAsa: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.gatedAddAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `addAsa(axfer,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    addAsa: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.addAsa(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `raffle()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    raffle: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.raffle(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `findWinner(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    findWinner: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.findWinner(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `claimRafflePrize()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    claimRafflePrize: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.claimRafflePrize(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `isLive()bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction: a boolean of whether the auction is live
     */
    isLive: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.isLive(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getState: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.getState(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.opUp(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mbr: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the Raffle smart contract using the `optin(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    optin: (params) => {
      return this.appClient.createTransaction.call(RaffleParamsFactory.optin(params));
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the Raffle smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(RaffleParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Gets available delete methods
     */
    delete: {
      /**
       * Deletes an existing instance of the Raffle smart contract using the `deleteApplication()void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The delete result
       */
      deleteApplication: async (params = { args: [] }) => {
        const result = await this.appClient.send.delete(RaffleParamsFactory.delete.deleteApplication(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the Raffle smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the Raffle smart contract using the `init(pay,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    init: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.init(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `refundMBR(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    refundMbr: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.refundMbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `clearWeightsBoxes()uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    clearWeightsBoxes: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.clearWeightsBoxes(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `enter(pay,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    enter: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.enter(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `enterAsa(pay,axfer,address,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    enterAsa: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.enterAsa(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `add(pay,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    add: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.add(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `gatedAddAsa(appl,axfer)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    gatedAddAsa: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.gatedAddAsa(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `addAsa(axfer,byte[][])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    addAsa: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.addAsa(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `raffle()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    raffle: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.raffle(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `findWinner(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    findWinner: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.findWinner(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `claimRafflePrize()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    claimRafflePrize: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.claimRafflePrize(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `isLive()bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result: a boolean of whether the auction is live
     */
    isLive: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.isLive(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getState: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.getState(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDaoEscrow: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.updateAkitaDaoEscrow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.updateAkitaDao(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    opUp: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.opUp(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mbr: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.mbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the Raffle smart contract using the `optin(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    optin: async (params) => {
      const result = await this.appClient.send.call(RaffleParamsFactory.optin(params));
      return { ...result, return: result.return };
    }
  };
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _RaffleClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the Raffle smart contract using the `isLive()bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result: a boolean of whether the auction is live
   */
  async isLive(params = { args: [] }) {
    const result = await this.appClient.send.call(RaffleParamsFactory.isLive(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the Raffle smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async mbr(params = { args: [] }) {
    const result = await this.appClient.send.call(RaffleParamsFactory.mbr(params));
    return result.return;
  }
  /**
   * Methods to access state for the current Raffle app
   */
  state = {
    /**
     * Methods to access global state for the current Raffle app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          ticketAsset: result.ticketAsset,
          startTimestamp: result.startTimestamp,
          endTimestamp: result.endTimestamp,
          seller: result.seller,
          minTickets: result.minTickets,
          maxTickets: result.maxTickets,
          entryCount: result.entryCount,
          ticketCount: result.ticketCount,
          winningTicket: result.winningTicket,
          winner: result.winner,
          prize: result.prize,
          isPrizeBox: result.isPrizeBox,
          prizeClaimed: result.prizeClaimed,
          creatorRoyalty: result.creatorRoyalty,
          gateId: result.gateID,
          marketplace: result.marketplace,
          marketplaceRoyalties: result.marketplaceRoyalties,
          akitaRoyalty: result.akitaRoyalty,
          vrfFailureCount: result.vrfFailureCount,
          entryId: result.entryID,
          weightsBoxCount: result.weightsBoxCount,
          weightTotals: result.weightTotals,
          findWinnerCursors: result.findWinnerCursors,
          refundMbrCursor: result.refundMBRCursor,
          salt: new BinaryStateValue(result.salt),
          akitaDaoEscrow: result.akitaDAOEscrow,
          version: result.version,
          akitaDao: result.akitaDAO,
          funder: result.funder
        };
      },
      /**
       * Get the current value of the ticketAsset key in global state
       */
      ticketAsset: async () => {
        return await this.appClient.state.global.getValue("ticketAsset");
      },
      /**
       * Get the current value of the startTimestamp key in global state
       */
      startTimestamp: async () => {
        return await this.appClient.state.global.getValue("startTimestamp");
      },
      /**
       * Get the current value of the endTimestamp key in global state
       */
      endTimestamp: async () => {
        return await this.appClient.state.global.getValue("endTimestamp");
      },
      /**
       * Get the current value of the seller key in global state
       */
      seller: async () => {
        return await this.appClient.state.global.getValue("seller");
      },
      /**
       * Get the current value of the minTickets key in global state
       */
      minTickets: async () => {
        return await this.appClient.state.global.getValue("minTickets");
      },
      /**
       * Get the current value of the maxTickets key in global state
       */
      maxTickets: async () => {
        return await this.appClient.state.global.getValue("maxTickets");
      },
      /**
       * Get the current value of the entryCount key in global state
       */
      entryCount: async () => {
        return await this.appClient.state.global.getValue("entryCount");
      },
      /**
       * Get the current value of the ticketCount key in global state
       */
      ticketCount: async () => {
        return await this.appClient.state.global.getValue("ticketCount");
      },
      /**
       * Get the current value of the winningTicket key in global state
       */
      winningTicket: async () => {
        return await this.appClient.state.global.getValue("winningTicket");
      },
      /**
       * Get the current value of the winner key in global state
       */
      winner: async () => {
        return await this.appClient.state.global.getValue("winner");
      },
      /**
       * Get the current value of the prize key in global state
       */
      prize: async () => {
        return await this.appClient.state.global.getValue("prize");
      },
      /**
       * Get the current value of the isPrizeBox key in global state
       */
      isPrizeBox: async () => {
        return await this.appClient.state.global.getValue("isPrizeBox");
      },
      /**
       * Get the current value of the prizeClaimed key in global state
       */
      prizeClaimed: async () => {
        return await this.appClient.state.global.getValue("prizeClaimed");
      },
      /**
       * Get the current value of the creatorRoyalty key in global state
       */
      creatorRoyalty: async () => {
        return await this.appClient.state.global.getValue("creatorRoyalty");
      },
      /**
       * Get the current value of the gateID key in global state
       */
      gateId: async () => {
        return await this.appClient.state.global.getValue("gateID");
      },
      /**
       * Get the current value of the marketplace key in global state
       */
      marketplace: async () => {
        return await this.appClient.state.global.getValue("marketplace");
      },
      /**
       * Get the current value of the marketplaceRoyalties key in global state
       */
      marketplaceRoyalties: async () => {
        return await this.appClient.state.global.getValue("marketplaceRoyalties");
      },
      /**
       * Get the current value of the akitaRoyalty key in global state
       */
      akitaRoyalty: async () => {
        return await this.appClient.state.global.getValue("akitaRoyalty");
      },
      /**
       * Get the current value of the vrfFailureCount key in global state
       */
      vrfFailureCount: async () => {
        return await this.appClient.state.global.getValue("vrfFailureCount");
      },
      /**
       * Get the current value of the entryID key in global state
       */
      entryId: async () => {
        return await this.appClient.state.global.getValue("entryID");
      },
      /**
       * Get the current value of the weightsBoxCount key in global state
       */
      weightsBoxCount: async () => {
        return await this.appClient.state.global.getValue("weightsBoxCount");
      },
      /**
       * Get the current value of the weightTotals key in global state
       */
      weightTotals: async () => {
        return await this.appClient.state.global.getValue("weightTotals");
      },
      /**
       * Get the current value of the findWinnerCursors key in global state
       */
      findWinnerCursors: async () => {
        return await this.appClient.state.global.getValue("findWinnerCursors");
      },
      /**
       * Get the current value of the refundMBRCursor key in global state
       */
      refundMbrCursor: async () => {
        return await this.appClient.state.global.getValue("refundMBRCursor");
      },
      /**
       * Get the current value of the salt key in global state
       */
      salt: async () => {
        return new BinaryStateValue(await this.appClient.state.global.getValue("salt"));
      },
      /**
       * Get the current value of the akitaDAOEscrow key in global state
       */
      akitaDaoEscrow: async () => {
        return await this.appClient.state.global.getValue("akitaDAOEscrow");
      },
      /**
       * Get the current value of the version key in global state
       */
      version: async () => {
        return await this.appClient.state.global.getValue("version");
      },
      /**
       * Get the current value of the akitaDAO key in global state
       */
      akitaDao: async () => {
        return await this.appClient.state.global.getValue("akitaDAO");
      },
      /**
       * Get the current value of the funder key in global state
       */
      funder: async () => {
        return await this.appClient.state.global.getValue("funder");
      }
    },
    /**
     * Methods to access box state for the current Raffle app
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
       * Get values from the entries map in box state
       */
      entries: {
        /**
         * Get all current values of the entries map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("entries");
        },
        /**
         * Get a current value of the entries map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("entries", key);
        }
      },
      /**
       * Get values from the weights map in box state
       */
      weights: {
        /**
         * Get all current values of the weights map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("weights");
        },
        /**
         * Get a current value of the weights map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("weights", key);
        }
      },
      /**
       * Get values from the entriesByAddress map in box state
       */
      entriesByAddress: {
        /**
         * Get all current values of the entriesByAddress map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("entriesByAddress");
        },
        /**
         * Get a current value of the entriesByAddress map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("entriesByAddress", key);
        }
      }
    }
  };
  newGroup() {
    const client = this;
    const composer = this.algorand.newGroup();
    let promiseChain = Promise.resolve();
    const resultMappers = [];
    return {
      /**
       * Add a init(pay,uint64)void method call against the Raffle contract
       */
      init(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.init(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a refundMBR(uint64)void method call against the Raffle contract
       */
      refundMbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.refundMbr(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a clearWeightsBoxes()uint64 method call against the Raffle contract
       */
      clearWeightsBoxes(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.clearWeightsBoxes(params)));
        resultMappers.push((v) => client.decodeReturnValue("clearWeightsBoxes()uint64", v));
        return this;
      },
      /**
       * Add a enter(pay,address,byte[][])void method call against the Raffle contract
       */
      enter(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.enter(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a enterAsa(pay,axfer,address,byte[][])void method call against the Raffle contract
       */
      enterAsa(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.enterAsa(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a add(pay,byte[][])void method call against the Raffle contract
       */
      add(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.add(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a gatedAddAsa(appl,axfer)void method call against the Raffle contract
       */
      gatedAddAsa(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedAddAsa(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a addAsa(axfer,byte[][])void method call against the Raffle contract
       */
      addAsa(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addAsa(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a raffle()void method call against the Raffle contract
       */
      raffle(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.raffle(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a findWinner(uint64)void method call against the Raffle contract
       */
      findWinner(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.findWinner(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a claimRafflePrize()void method call against the Raffle contract
       */
      claimRafflePrize(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.claimRafflePrize(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a isLive()bool method call against the Raffle contract
       */
      isLive(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isLive(params)));
        resultMappers.push((v) => client.decodeReturnValue("isLive()bool", v));
        return this;
      },
      /**
       * Add a getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64) method call against the Raffle contract
       */
      getState(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getState(params)));
        resultMappers.push((v) => client.decodeReturnValue("getState()(uint64,uint64,uint64,address,uint64,uint64,uint64,uint64,uint64,address,uint64,bool,uint64,uint64,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a updateAkitaDAOEscrow(uint64)void method call against the Raffle contract
       */
      updateAkitaDaoEscrow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDaoEscrow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the Raffle contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a opUp()void method call against the Raffle contract
       */
      opUp(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a mbr()(uint64,uint64,uint64) method call against the Raffle contract
       */
      mbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("mbr()(uint64,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a optin(pay,uint64)void method call against the Raffle contract
       */
      optin(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.optin(params)));
        resultMappers.push(void 0);
        return this;
      },
      get update() {
        return {
          update: (params) => {
            promiseChain = promiseChain.then(async () => composer.addAppUpdateMethodCall(await client.params.update.update(params)));
            resultMappers.push(void 0);
            return this;
          }
        };
      },
      get delete() {
        return {
          deleteApplication: (params) => {
            promiseChain = promiseChain.then(async () => composer.addAppDeleteMethodCall(await client.params.delete.deleteApplication(params)));
            resultMappers.push(void 0);
            return this;
          }
        };
      },
      /**
       * Add a clear state call to the Raffle contract
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
        var _a;
        await promiseChain;
        const result = await (!options ? composer.simulate() : composer.simulate(options));
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      },
      async send(params) {
        var _a;
        await promiseChain;
        const result = await composer.send(params);
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      }
    };
  }
};

// src/raffle/factory.ts
import { microAlgo } from "@algorandfoundation/algokit-utils";

// src/generated/RaffleFactoryClient.ts
import { getArc56ReturnValue as getArc56ReturnValue2, getABIStructFromABITuple as getABIStructFromABITuple2 } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient2
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory2 } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC2 = { "name": "RaffleFactory", "structs": { "RaffleMBRData": [{ "name": "entries", "type": "uint64" }, { "name": "weights", "type": "uint64" }, { "name": "entriesByAddress", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "string", "name": "childVersion" }, { "type": "uint64", "name": "akitaDAO" }, { "type": "uint64", "name": "akitaDAOEscrow" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "newRaffle", "args": [{ "type": "pay", "name": "payment" }, { "type": "axfer", "name": "assetXfer" }, { "type": "uint64", "name": "ticketAsset" }, { "type": "uint64", "name": "startTimestamp" }, { "type": "uint64", "name": "endTimestamp" }, { "type": "uint64", "name": "minTickets" }, { "type": "uint64", "name": "maxTickets" }, { "type": "uint64", "name": "gateID" }, { "type": "address", "name": "marketplace" }, { "type": "string", "name": "name" }, { "type": "byte[32][]", "name": "proof" }, { "type": "uint64", "name": "weightsListCount" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "newPrizeBoxRaffle", "args": [{ "type": "pay", "name": "payment" }, { "type": "uint64", "name": "prizeBox" }, { "type": "uint64", "name": "ticketAsset" }, { "type": "uint64", "name": "startTimestamp" }, { "type": "uint64", "name": "endTimestamp" }, { "type": "uint64", "name": "minTickets" }, { "type": "uint64", "name": "maxTickets" }, { "type": "uint64", "name": "gateID" }, { "type": "address", "name": "marketplace" }, { "type": "uint64", "name": "weightsListCount" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "deleteRaffle", "args": [{ "type": "uint64", "name": "appId" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "initBoxedContract", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "size" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "loadBoxedContract", "args": [{ "type": "uint64", "name": "offset" }, { "type": "byte[]", "name": "data" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "deleteBoxedContract", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "optIn", "args": [{ "type": "pay", "name": "payment", "desc": "The payment transaction" }, { "type": "uint64", "name": "asset", "desc": "The asset to be opted into" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "optin tells the contract to opt into an asa", "events": [], "recommendations": {} }, { "name": "optInCost", "args": [{ "type": "uint64", "name": "asset" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "updateAkitaDAOEscrow", "args": [{ "type": "uint64", "name": "app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "mbr", "args": [], "returns": { "type": "(uint64,uint64,uint64)", "struct": "RaffleMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 2, "bytes": 2 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "childContractVersion": { "keyType": "AVMString", "valueType": "AVMString", "key": "Y2hpbGRfY29udHJhY3RfdmVyc2lvbg==", "desc": "the current version of the child contract" }, "akitaDAOEscrow": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZXNjcm93", "desc": "the app ID for the akita DAO escrow to use" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": { "boxedContract": { "keyType": "AVMString", "valueType": "AVMBytes", "key": "YmM=" } } }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [744], "errorMessage": "Bytes has valid prefix" }, { "pc": [1209], "errorMessage": "Contract not set" }, { "pc": [1432], "errorMessage": "Invalid app upgrade" }, { "pc": [1204], "errorMessage": "Invalid call order" }, { "pc": [1296, 1565], "errorMessage": "Invalid payment" }, { "pc": [537], "errorMessage": "Invalid transfer" }, { "pc": [895], "errorMessage": "Not a prize box" }, { "pc": [986], "errorMessage": "Not a raffle" }, { "pc": [910], "errorMessage": "Not prize box owner" }, { "pc": [111], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [265], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [1087, 1107, 1235, 1380, 1418, 1461], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [592, 633, 882, 893, 940, 982, 1105, 1233, 1270, 1337, 1378, 1414, 1459, 1574, 6830, 6855, 6896], "errorMessage": "application exists" }, { "pc": [675], "errorMessage": "asset exists" }, { "pc": [544, 877, 1099, 1227, 1263, 1267, 1330, 1334, 1372, 1407, 1453, 1521, 1570], "errorMessage": "check GlobalState exists" }, { "pc": [510], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [1136], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [326, 342, 490, 753, 1057, 1398], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [353, 362, 412, 422, 432, 442, 452, 462, 518, 800, 809, 818, 827, 836, 845, 854, 872, 977, 1068, 1121, 1258, 1325, 1365, 1446], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [475, 864], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [404], "errorMessage": "transaction type is axfer" }, { "pc": [393, 792, 1250], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggMiA1MDAwMAogICAgYnl0ZWNibG9jayAiYWtpdGFfZGFvIiAiYmMiICJha2l0YV9lc2Nyb3ciICJ3YWxsZXQiIDB4MTUxZjdjNzUgMHhjNTNiMzJjYyAidmVyc2lvbiIgImNoaWxkX2NvbnRyYWN0X3ZlcnNpb24iIDB4M2VhMTE4MzIgImFhbCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjI3CiAgICAvLyBleHBvcnQgY2xhc3MgUmFmZmxlRmFjdG9yeSBleHRlbmRzIGNsYXNzZXMoQmFzZVJhZmZsZSwgRmFjdG9yeUNvbnRyYWN0KSB7CiAgICBwdXNoYnl0ZXMgMHhlYTkxODBkZCAvLyBtZXRob2QgInVwZGF0ZShzdHJpbmcpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fdXBkYXRlX3JvdXRlQDQKCm1haW5fc3dpdGNoX2Nhc2VfbmV4dEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjcKICAgIC8vIGV4cG9ydCBjbGFzcyBSYWZmbGVGYWN0b3J5IGV4dGVuZHMgY2xhc3NlcyhCYXNlUmFmZmxlLCBGYWN0b3J5Q29udHJhY3QpIHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAyMAogICAgcHVzaGJ5dGVzcyAweDE4NTg0ZjIwIDB4MjkyNDU2NWUgMHg5MWRkM2M3NSAvLyBtZXRob2QgIm5ld1JhZmZsZShwYXksYXhmZXIsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYWRkcmVzcyxzdHJpbmcsYnl0ZVszMl1bXSx1aW50NjQpdWludDY0IiwgbWV0aG9kICJuZXdQcml6ZUJveFJhZmZsZShwYXksdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGFkZHJlc3MsdWludDY0KXVpbnQ2NCIsIG1ldGhvZCAiZGVsZXRlUmFmZmxlKHVpbnQ2NCl2b2lkIgogICAgYnl0ZWMgNSAvLyBtZXRob2QgImluaXRCb3hlZENvbnRyYWN0KHN0cmluZyx1aW50NjQpdm9pZCIKICAgIHB1c2hieXRlc3MgMHhkY2EyZDg2MiAweGQzNDZiMWE0IDB4Mzk0ZWFlYjIgMHgzM2Y3ODgwOCAweDFlYWQyMGE5IDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAweGQ5YTM1ZmE0IC8vIG1ldGhvZCAibG9hZEJveGVkQ29udHJhY3QodWludDY0LGJ5dGVbXSl2b2lkIiwgbWV0aG9kICJkZWxldGVCb3hlZENvbnRyYWN0KCl2b2lkIiwgbWV0aG9kICJvcHRJbihwYXksdWludDY0KXZvaWQiLCBtZXRob2QgIm9wdEluQ29zdCh1aW50NjQpdWludDY0IiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBT0VzY3Jvdyh1aW50NjQpdm9pZCIsIG1ldGhvZCAidXBkYXRlQWtpdGFEQU8odWludDY0KXZvaWQiLCBtZXRob2QgIm9wVXAoKXZvaWQiLCBtZXRob2QgIm1icigpKHVpbnQ2NCx1aW50NjQsdWludDY0KSIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG5ld1JhZmZsZSBuZXdQcml6ZUJveFJhZmZsZSBkZWxldGVSYWZmbGUgaW5pdEJveGVkQ29udHJhY3QgbG9hZEJveGVkQ29udHJhY3QgZGVsZXRlQm94ZWRDb250cmFjdCBvcHRJbiBvcHRJbkNvc3QgdXBkYXRlQWtpdGFEQU9Fc2Nyb3cgdXBkYXRlQWtpdGFEQU8gbWFpbl9vcFVwX3JvdXRlQDE3IG1haW5fbWJyX3JvdXRlQDE4CiAgICBlcnIKCm1haW5fbWJyX3JvdXRlQDE4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9iYXNlLnRzOjYKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgcHVzaGJ5dGVzIDB4MTUxZjdjNzUwMDAwMDAwMDAwMDA3YmQ0MDAwMDAwMDAwMGM4MTdkNDAwMDAwMDAwMDAwMDQ5ZDQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9vcFVwX3JvdXRlQDE3OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDMKICAgIC8vIG9wVXAoKTogdm9pZCB7IH0KICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fY3JlYXRlX05vT3BAMjA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNwogICAgLy8gZXhwb3J0IGNsYXNzIFJhZmZsZUZhY3RvcnkgZXh0ZW5kcyBjbGFzc2VzKEJhc2VSYWZmbGUsIEZhY3RvcnlDb250cmFjdCkgewogICAgcHVzaGJ5dGVzIDB4YzQyNmY0YmEgLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHN0cmluZyx1aW50NjQsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKbWFpbl91cGRhdGVfcm91dGVANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIHB1c2hpbnQgNCAvLyBVcGRhdGVBcHBsaWNhdGlvbgogICAgPT0KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAmJgogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIFVwZGF0ZUFwcGxpY2F0aW9uICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGIgdXBkYXRlCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6c3BsaXRPcHRJbkNvdW50KGFraXRhREFPOiB1aW50NjQsIGVzY3JvdzogYnl0ZXMsIGFzc2V0OiB1aW50NjQpIC0+IHVpbnQ2NDoKc3BsaXRPcHRJbkNvdW50OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1ODcKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBzcGxpdE9wdEluQ291bnQoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBlc2Nyb3c6IEFjY291bnQsIGFzc2V0OiBBc3NldCk6IHVpbnQ2NCB7CiAgICBwcm90byAzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTg4CiAgICAvLyBsZXQgY291bnQ6IHVpbnQ2NCA9IDAKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5MAogICAgLy8gaWYgKCFlc2Nyb3cuaXNPcHRlZEluKGFzc2V0KSkgewogICAgZnJhbWVfZGlnIC0yCiAgICBmcmFtZV9kaWcgLTEKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBibnogc3BsaXRPcHRJbkNvdW50X2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5OQogICAgLy8gY29uc3QgW3NwbGl0c0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1JldmVudWVTcGxpdHMpKQogICAgZnJhbWVfZGlnIC0zCiAgICBwdXNoYnl0ZXMgInJldmVudWVfc3BsaXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTQKICAgIC8vIGNvdW50ICs9IHNwbGl0cy5sZW5ndGgKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTEKICAgIC8vIGNvdW50ICs9IDEKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5NAogICAgLy8gY291bnQgKz0gc3BsaXRzLmxlbmd0aAogICAgKwogICAgZnJhbWVfYnVyeSAwCgpzcGxpdE9wdEluQ291bnRfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTcKICAgIC8vIHJldHVybiBjb3VudAogICAgZnJhbWVfZGlnIDAKICAgIHN3YXAKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjpSYWZmbGVGYWN0b3J5LmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE0OQogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBieXRlYyA2IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTUxCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSB2ZXJzaW9uCiAgICB1bmNvdmVyIDQKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czozNAogICAgLy8gY2hpbGRDb250cmFjdFZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBCYXNlRmFjdG9yeUdsb2JhbFN0YXRlS2V5Q2hpbGRDb250cmFjdFZlcnNpb24gfSkKICAgIGJ5dGVjIDcgLy8gImNoaWxkX2NvbnRyYWN0X3ZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxNTIKICAgIC8vIHRoaXMuY2hpbGRDb250cmFjdFZlcnNpb24udmFsdWUgPSBjaGlsZFZlcnNpb24KICAgIHVuY292ZXIgMwogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTUzCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTU0CiAgICAvLyB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlID0gYWtpdGFEQU9Fc2Nyb3cKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxNDkKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OlJhZmZsZUZhY3RvcnkubmV3UmFmZmxlW3JvdXRpbmddKCkgLT4gdm9pZDoKbmV3UmFmZmxlOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE1OS0xNzIKICAgIC8vIG5ld1JhZmZsZSgKICAgIC8vICAgcGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBhc3NldFhmZXI6IGd0eG4uQXNzZXRUcmFuc2ZlclR4biwKICAgIC8vICAgdGlja2V0QXNzZXQ6IHVpbnQ2NCwKICAgIC8vICAgc3RhcnRUaW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgZW5kVGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG1pblRpY2tldHM6IHVpbnQ2NCwKICAgIC8vICAgbWF4VGlja2V0czogdWludDY0LAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgbWFya2V0cGxhY2U6IEFjY291bnQsCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgcHJvb2Y6IFByb29mLAogICAgLy8gICB3ZWlnaHRzTGlzdENvdW50OiB1aW50NjQKICAgIC8vICk6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18zIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgc3dhcAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHN3YXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDcKICAgIGR1cAogICAgY292ZXIgMgogICAgbGVuCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDgKICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOQogICAgZHVwCiAgICBjb3ZlciAyCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICAqCiAgICBpbnRjXzMgLy8gMgogICAgKwogICAgdW5jb3ZlciAyCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxMAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE3NS0xODIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBhc3NldFhmZXIsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogeyBncmVhdGVyVGhhbjogMCB9LAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9UUkFOU0ZFUgogICAgLy8gKQogICAgZGlnIDEKICAgIGd0eG5zIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE3OAogICAgLy8gYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTc1LTE4MgogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIGFzc2V0WGZlciwKICAgIC8vICAgewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiB7IGdyZWF0ZXJUaGFuOiAwIH0sCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICA9PQogICAgZGlnIDIKICAgIGd0eG5zIEFzc2V0QW1vdW50CiAgICBkdXAKICAgIGNvdmVyIDQKICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCB0cmFuc2ZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTg0CiAgICAvLyBjb25zdCBjcmVhdG9yUm95YWx0eSA9IHJveWFsdGllcyh0aGlzLmFraXRhREFPLnZhbHVlLCBhc3NldFhmZXIueGZlckFzc2V0LCBuYW1lLCBwcm9vZikKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE4NAogICAgLy8gY29uc3QgY3JlYXRvclJveWFsdHkgPSByb3lhbHRpZXModGhpcy5ha2l0YURBTy52YWx1ZSwgYXNzZXRYZmVyLnhmZXJBc3NldCwgbmFtZSwgcHJvb2YpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgc3dhcAogICAgY292ZXIgMwogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgc3dhcAogICAgZ3R4bnMgWGZlckFzc2V0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQxNAogICAgLy8gbGV0IGNyZWF0b3JSb3lhbHR5OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MTYKICAgIC8vIGlmICghKHByb29mLmxlbmd0aCA+IDApKSB7CiAgICBibnogbmV3UmFmZmxlX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MTcKICAgIC8vIHJldHVybiBDcmVhdG9yUm95YWx0eURlZmF1bHQKICAgIHB1c2hpbnQgNTAwMCAvLyA1MDAwCiAgICBidXJ5IDEKCm5ld1JhZmZsZV9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJveWFsdGllc0A4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTg3CiAgICAvLyBmYWxzZSwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxODYtMTk5CiAgICAvLyBjb25zdCByYWZmbGVBcHAgPSB0aGlzLmNyZWF0ZUNoaWxkQXBwKAogICAgLy8gICBmYWxzZSwKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgYXNzZXRYZmVyLnhmZXJBc3NldC5pZCwKICAgIC8vICAgdGlja2V0QXNzZXQsCiAgICAvLyAgIHN0YXJ0VGltZXN0YW1wLAogICAgLy8gICBlbmRUaW1lc3RhbXAsCiAgICAvLyAgIGNyZWF0b3JSb3lhbHR5LAogICAgLy8gICBtaW5UaWNrZXRzLAogICAgLy8gICBtYXhUaWNrZXRzLAogICAgLy8gICBnYXRlSUQsCiAgICAvLyAgIG1hcmtldHBsYWNlLAogICAgLy8gICB3ZWlnaHRzTGlzdENvdW50CiAgICAvLyApCiAgICBkaWcgMTUKICAgIGRpZyAzCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIGRpZyAxNwogICAgZGlnIDE3CiAgICBkaWcgMTcKICAgIGRpZyA3CiAgICBkaWcgMTgKICAgIGRpZyAxOAogICAgZGlnIDE4CiAgICBkaWcgMTgKICAgIGRpZyAxNgogICAgY2FsbHN1YiBjcmVhdGVDaGlsZEFwcAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjA0LTIxMwogICAgLy8gcmFmZmxlLmNhbGwub3B0aW4oewogICAgLy8gICBhcHBJZDogcmFmZmxlQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiByYWZmbGVBcHAuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgLy8gICAgIH0pLAogICAgLy8gICAgIGFzc2V0WGZlci54ZmVyQXNzZXQuaWQsCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjA4CiAgICAvLyByZWNlaXZlcjogcmFmZmxlQXBwLmFkZHJlc3MsCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjIwOQogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyMDctMjEwCiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICByZWNlaXZlcjogcmFmZmxlQXBwLmFkZHJlc3MsCiAgICAvLyAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgLy8gfSksCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyMDQtMjEzCiAgICAvLyByYWZmbGUuY2FsbC5vcHRpbih7CiAgICAvLyAgIGFwcElkOiByYWZmbGVBcHAsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHJhZmZsZUFwcC5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgYXNzZXRYZmVyLnhmZXJBc3NldC5pZCwKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjIxMQogICAgLy8gYXNzZXRYZmVyLnhmZXJBc3NldC5pZCwKICAgIGRpZyAxCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyMDQtMjEzCiAgICAvLyByYWZmbGUuY2FsbC5vcHRpbih7CiAgICAvLyAgIGFwcElkOiByYWZmbGVBcHAsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IHJhZmZsZUFwcC5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgYXNzZXRYZmVyLnhmZXJBc3NldC5pZCwKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBieXRlYyA4IC8vIG1ldGhvZCAib3B0aW4ocGF5LHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBPbkNvbXBsZXRpb24KICAgIGR1cAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjE2LTIyMgogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogcmFmZmxlQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFzc2V0WGZlci5hc3NldEFtb3VudCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0WGZlci54ZmVyQXNzZXQsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjE4CiAgICAvLyBhc3NldFJlY2VpdmVyOiByYWZmbGVBcHAuYWRkcmVzcywKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgZGlnIDUKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjE2LTIyMQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogcmFmZmxlQXBwLmFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IGFzc2V0WGZlci5hc3NldEFtb3VudCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFzc2V0WGZlci54ZmVyQXNzZXQsCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyMTYtMjIyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiByYWZmbGVBcHAuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogYXNzZXRYZmVyLmFzc2V0QW1vdW50LAogICAgLy8gICAgIHhmZXJBc3NldDogYXNzZXRYZmVyLnhmZXJBc3NldCwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTU5LTE3MgogICAgLy8gbmV3UmFmZmxlKAogICAgLy8gICBwYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIGFzc2V0WGZlcjogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICB0aWNrZXRBc3NldDogdWludDY0LAogICAgLy8gICBzdGFydFRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBlbmRUaW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgbWluVGlja2V0czogdWludDY0LAogICAgLy8gICBtYXhUaWNrZXRzOiB1aW50NjQsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICBtYXJrZXRwbGFjZTogQWNjb3VudCwKICAgIC8vICAgbmFtZTogc3RyaW5nLAogICAgLy8gICBwcm9vZjogUHJvb2YsCiAgICAvLyAgIHdlaWdodHNMaXN0Q291bnQ6IHVpbnQ2NAogICAgLy8gKTogdWludDY0IHsKICAgIGl0b2IKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm5ld1JhZmZsZV9hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQyMS00MzEKICAgIC8vIGNvbnN0IGNyZWF0b3JSb3lhbHR5U3RyaW5nID0gYWJpQ2FsbDx0eXBlb2YgTWV0YU1lcmtsZXMucHJvdG90eXBlLnZlcmlmaWVkUmVhZD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5tZXRhTWVya2xlcywKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGFzc2V0LmNyZWF0b3IsCiAgICAvLyAgICAgbmFtZSwKICAgIC8vICAgICBzaGEyNTYoc2hhMjU2KGl0b2IoYXNzZXQuaWQpKSksCiAgICAvLyAgICAgcHJvb2YsCiAgICAvLyAgICAgMSwKICAgIC8vICAgICAncm95YWx0eScsCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQwCiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBkaWcgMgogICAgYnl0ZWMgOSAvLyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MjIKICAgIC8vIGFwcElkOiBnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLm1ldGFNZXJrbGVzLAogICAgcHVzaGludCA3MiAvLyA3MgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDI0CiAgICAvLyBhc3NldC5jcmVhdG9yLAogICAgZGlnIDIKICAgIGR1cAogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldENyZWF0b3IKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDI2CiAgICAvLyBzaGEyNTYoc2hhMjU2KGl0b2IoYXNzZXQuaWQpKSksCiAgICBzd2FwCiAgICBpdG9iCiAgICBzaGEyNTYKICAgIHNoYTI1NgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MjgKICAgIC8vIDEsCiAgICBpbnRjXzEgLy8gMQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MjEtNDMxCiAgICAvLyBjb25zdCBjcmVhdG9yUm95YWx0eVN0cmluZyA9IGFiaUNhbGw8dHlwZW9mIE1ldGFNZXJrbGVzLnByb3RvdHlwZS52ZXJpZmllZFJlYWQ+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhQXBwTGlzdChha2l0YURBTykubWV0YU1lcmtsZXMsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBhc3NldC5jcmVhdG9yLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgc2hhMjU2KHNoYTI1NihpdG9iKGFzc2V0LmlkKSkpLAogICAgLy8gICAgIHByb29mLAogICAgLy8gICAgIDEsCiAgICAvLyAgICAgJ3JveWFsdHknLAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4MGNmMWI5Y2YgLy8gbWV0aG9kICJ2ZXJpZmllZFJlYWQoYWRkcmVzcyxzdHJpbmcsYnl0ZVszMl0sYnl0ZVszMl1bXSx1aW50NjQsc3RyaW5nKXN0cmluZyIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgOQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgNwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQyOQogICAgLy8gJ3JveWFsdHknLAogICAgcHVzaGJ5dGVzIDB4MDAwNzcyNmY3OTYxNmM3NDc5CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQyMS00MzEKICAgIC8vIGNvbnN0IGNyZWF0b3JSb3lhbHR5U3RyaW5nID0gYWJpQ2FsbDx0eXBlb2YgTWV0YU1lcmtsZXMucHJvdG90eXBlLnZlcmlmaWVkUmVhZD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5tZXRhTWVya2xlcywKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGFzc2V0LmNyZWF0b3IsCiAgICAvLyAgICAgbmFtZSwKICAgIC8vICAgICBzaGEyNTYoc2hhMjU2KGl0b2IoYXNzZXQuaWQpKSksCiAgICAvLyAgICAgcHJvb2YsCiAgICAvLyAgICAgMSwKICAgIC8vICAgICAncm95YWx0eScsCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBkaWcgMQogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDYgMAogICAgZHVwCiAgICBidXJ5IDE3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQzMwogICAgLy8gaWYgKEJ5dGVzKGNyZWF0b3JSb3lhbHR5U3RyaW5nKS5sZW5ndGggPiAwKSB7CiAgICBsZW4KICAgIGJ6IG5ld1JhZmZsZV9hZnRlcl9pZl9lbHNlQDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDM0CiAgICAvLyBjcmVhdG9yUm95YWx0eSA9IGJ0b2koQnl0ZXMoY3JlYXRvclJveWFsdHlTdHJpbmcpKQogICAgZGlnIDE1CiAgICBidG9pCiAgICBidXJ5IDEKCm5ld1JhZmZsZV9hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQzNwogICAgLy8gaWYgKGNyZWF0b3JSb3lhbHR5ID4gQ3JlYXRvclJveWFsdHlNYXhpbXVtU2luZ2xlKSB7CiAgICBkdXAKICAgIGludGMgNCAvLyA1MDAwMAogICAgPgogICAgYnogbmV3UmFmZmxlX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6cm95YWx0aWVzQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDM4CiAgICAvLyByZXR1cm4gQ3JlYXRvclJveWFsdHlNYXhpbXVtU2luZ2xlCiAgICBpbnRjIDQgLy8gNTAwMDAKICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTg0CiAgICAvLyBjb25zdCBjcmVhdG9yUm95YWx0eSA9IHJveWFsdGllcyh0aGlzLmFraXRhREFPLnZhbHVlLCBhc3NldFhmZXIueGZlckFzc2V0LCBuYW1lLCBwcm9vZikKICAgIGIgbmV3UmFmZmxlX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6cm95YWx0aWVzQDgKCgovLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo6UmFmZmxlRmFjdG9yeS5uZXdQcml6ZUJveFJhZmZsZVtyb3V0aW5nXSgpIC0+IHZvaWQ6Cm5ld1ByaXplQm94UmFmZmxlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjI3LTIzOAogICAgLy8gbmV3UHJpemVCb3hSYWZmbGUoCiAgICAvLyAgIHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgcHJpemVCb3g6IEFwcGxpY2F0aW9uLAogICAgLy8gICB0aWNrZXRBc3NldDogdWludDY0LAogICAgLy8gICBzdGFydFRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBlbmRUaW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgbWluVGlja2V0czogdWludDY0LAogICAgLy8gICBtYXhUaWNrZXRzOiB1aW50NjQsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICBtYXJrZXRwbGFjZTogQWNjb3VudCwKICAgIC8vICAgd2VpZ2h0c0xpc3RDb3VudDogdWludDY0CiAgICAvLyApOiB1aW50NjQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDYKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA3CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjI0MAogICAgLy8gYXNzZXJ0KGdldFByaXplQm94T3duZXIodGhpcy5ha2l0YURBTy52YWx1ZSwgcHJpemVCb3gpID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgRVJSX05PVF9QUklaRV9CT1hfT1dORVIpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNDAKICAgIC8vIGFzc2VydChnZXRQcml6ZUJveE93bmVyKHRoaXMuYWtpdGFEQU8udmFsdWUsIHByaXplQm94KSA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsIEVSUl9OT1RfUFJJWkVfQk9YX09XTkVSKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDQ1CiAgICAvLyBhc3NlcnQocHJpemVCb3guY3JlYXRvciA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5wcml6ZUJveCkuYWRkcmVzcywgRVJSX05PVF9BX1BSSVpFX0JPWCkKICAgIGRpZyA5CiAgICBhcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQwCiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBzd2FwCiAgICBieXRlYyA5IC8vICJhYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ0NQogICAgLy8gYXNzZXJ0KHByaXplQm94LmNyZWF0b3IgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykucHJpemVCb3gpLmFkZHJlc3MsIEVSUl9OT1RfQV9QUklaRV9CT1gpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBOb3QgYSBwcml6ZSBib3gKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDQ2CiAgICAvLyBjb25zdCBbb3duZXJCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhwcml6ZUJveCwgQnl0ZXMoUHJpemVCb3hHbG9iYWxTdGF0ZUtleU93bmVyKSkKICAgIGRpZyA4CiAgICBwdXNoYnl0ZXMgIm93bmVyIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjQwCiAgICAvLyBhc3NlcnQoZ2V0UHJpemVCb3hPd25lcih0aGlzLmFraXRhREFPLnZhbHVlLCBwcml6ZUJveCkgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLCBFUlJfTk9UX1BSSVpFX0JPWF9PV05FUikKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgYXNzZXJ0IC8vIE5vdCBwcml6ZSBib3ggb3duZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjI0MwogICAgLy8gdHJ1ZSwKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNDItMjU1CiAgICAvLyBjb25zdCByYWZmbGVBcHAgPSB0aGlzLmNyZWF0ZUNoaWxkQXBwKAogICAgLy8gICB0cnVlLAogICAgLy8gICBwYXltZW50LAogICAgLy8gICBwcml6ZUJveC5pZCwKICAgIC8vICAgdGlja2V0QXNzZXQsCiAgICAvLyAgIHN0YXJ0VGltZXN0YW1wLAogICAgLy8gICBlbmRUaW1lc3RhbXAsCiAgICAvLyAgIDAsCiAgICAvLyAgIG1pblRpY2tldHMsCiAgICAvLyAgIG1heFRpY2tldHMsCiAgICAvLyAgIGdhdGVJRCwKICAgIC8vICAgbWFya2V0cGxhY2UsCiAgICAvLyAgIHdlaWdodHNMaXN0Q291bnQKICAgIC8vICkKICAgIHVuY292ZXIgMTAKICAgIGRpZyAxMAogICAgdW5jb3ZlciAxMAogICAgdW5jb3ZlciAxMAogICAgdW5jb3ZlciAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjQ5CiAgICAvLyAwLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjI0Mi0yNTUKICAgIC8vIGNvbnN0IHJhZmZsZUFwcCA9IHRoaXMuY3JlYXRlQ2hpbGRBcHAoCiAgICAvLyAgIHRydWUsCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHByaXplQm94LmlkLAogICAgLy8gICB0aWNrZXRBc3NldCwKICAgIC8vICAgc3RhcnRUaW1lc3RhbXAsCiAgICAvLyAgIGVuZFRpbWVzdGFtcCwKICAgIC8vICAgMCwKICAgIC8vICAgbWluVGlja2V0cywKICAgIC8vICAgbWF4VGlja2V0cywKICAgIC8vICAgZ2F0ZUlELAogICAgLy8gICBtYXJrZXRwbGFjZSwKICAgIC8vICAgd2VpZ2h0c0xpc3RDb3VudAogICAgLy8gKQogICAgdW5jb3ZlciAxMQogICAgdW5jb3ZlciAxMQogICAgdW5jb3ZlciAxMQogICAgdW5jb3ZlciAxMQogICAgdW5jb3ZlciAxMQogICAgY2FsbHN1YiBjcmVhdGVDaGlsZEFwcAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjU5LTI2MgogICAgLy8gYWJpQ2FsbDx0eXBlb2YgUHJpemVCb3gucHJvdG90eXBlLnRyYW5zZmVyPih7CiAgICAvLyAgIGFwcElkOiBwcml6ZUJveC5pZCwKICAgIC8vICAgYXJnczogW3JhZmZsZUFwcC5hZGRyZXNzXSwKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNjEKICAgIC8vIGFyZ3M6IFtyYWZmbGVBcHAuYWRkcmVzc10sCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjI1OS0yNjIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIFByaXplQm94LnByb3RvdHlwZS50cmFuc2Zlcj4oewogICAgLy8gICBhcHBJZDogcHJpemVCb3guaWQsCiAgICAvLyAgIGFyZ3M6IFtyYWZmbGVBcHAuYWRkcmVzc10sCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4YWRmOTJhZTQgLy8gbWV0aG9kICJ0cmFuc2ZlcihhZGRyZXNzKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjIyNy0yMzgKICAgIC8vIG5ld1ByaXplQm94UmFmZmxlKAogICAgLy8gICBwYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHByaXplQm94OiBBcHBsaWNhdGlvbiwKICAgIC8vICAgdGlja2V0QXNzZXQ6IHVpbnQ2NCwKICAgIC8vICAgc3RhcnRUaW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgZW5kVGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG1pblRpY2tldHM6IHVpbnQ2NCwKICAgIC8vICAgbWF4VGlja2V0czogdWludDY0LAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgbWFya2V0cGxhY2U6IEFjY291bnQsCiAgICAvLyAgIHdlaWdodHNMaXN0Q291bnQ6IHVpbnQ2NAogICAgLy8gKTogdWludDY0IHsKICAgIGl0b2IKICAgIGJ5dGVjIDQgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo6UmFmZmxlRmFjdG9yeS5kZWxldGVSYWZmbGVbcm91dGluZ10oKSAtPiB2b2lkOgpkZWxldGVSYWZmbGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNjcKICAgIC8vIGRlbGV0ZVJhZmZsZShhcHBJZDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNjgKICAgIC8vIGFzc2VydChhcHBJZC5jcmVhdG9yID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywgRVJSX05PVF9BX1JBRkZMRSkKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQ3JlYXRvcgogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gTm90IGEgcmFmZmxlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1MQogICAgLy8gY29uc3QgW2Z1bmRlckJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFwcElkLCBCeXRlcyhHbG9iYWxTdGF0ZUtleUZ1bmRlcikpCiAgICBkdXAKICAgIHB1c2hieXRlcyAiZnVuZGVyIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjcxCiAgICAvLyBjb25zdCB7IGFjY291bnQ6IHJlY2VpdmVyLCBhbW91bnQgfSA9IGdldEZ1bmRlcihhcHBJZCkKICAgIGR1cAogICAgZXh0cmFjdCAwIDMyCiAgICBzd2FwCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6Mjc0CiAgICAvLyByYWZmbGUuY2FsbC5kZWxldGVBcHBsaWNhdGlvbih7IGFwcElkIH0pCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHgyNDg3YzMyYyAvLyBtZXRob2QgImRlbGV0ZUFwcGxpY2F0aW9uKCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHB1c2hpbnQgNSAvLyA1CiAgICBpdHhuX2ZpZWxkIE9uQ29tcGxldGlvbgogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNzYtMjc4CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgYW1vdW50LCByZWNlaXZlciB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoyNzYtMjc3CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsgYW1vdW50LCByZWNlaXZlciB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6Mjc2LTI3OAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7IGFtb3VudCwgcmVjZWl2ZXIgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MjY3CiAgICAvLyBkZWxldGVSYWZmbGUoYXBwSWQ6IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6OkZhY3RvcnlDb250cmFjdC5pbml0Qm94ZWRDb250cmFjdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmluaXRCb3hlZENvbnRyYWN0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NDIKICAgIC8vIGluaXRCb3hlZENvbnRyYWN0KHZlcnNpb246IHN0cmluZywgc2l6ZTogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czozNAogICAgLy8gY2hpbGRDb250cmFjdFZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBCYXNlRmFjdG9yeUdsb2JhbFN0YXRlS2V5Q2hpbGRDb250cmFjdFZlcnNpb24gfSkKICAgIGJ5dGVjIDcgLy8gImNoaWxkX2NvbnRyYWN0X3ZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo0MwogICAgLy8gdGhpcy5jaGlsZENvbnRyYWN0VmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czozOAogICAgLy8gYm94ZWRDb250cmFjdCA9IEJveDxieXRlcz4oeyBrZXk6IEJveEtleUJveGVkQ29udHJhY3QgfSkKICAgIGJ5dGVjXzEgLy8gImJjIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NDQKICAgIC8vIGlmICghdGhpcy5ib3hlZENvbnRyYWN0LmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBibnogaW5pdEJveGVkQ29udHJhY3RfZWxzZV9ib2R5QDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjQ1CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gR2xvYmFsLmNyZWF0b3JBZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6MzgKICAgIC8vIGJveGVkQ29udHJhY3QgPSBCb3g8Ynl0ZXM+KHsga2V5OiBCb3hLZXlCb3hlZENvbnRyYWN0IH0pCiAgICBieXRlY18xIC8vICJiYyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjQ2CiAgICAvLyB0aGlzLmJveGVkQ29udHJhY3QuY3JlYXRlKHsgc2l6ZSB9KQogICAgc3dhcAogICAgYm94X2NyZWF0ZQogICAgcG9wCgppbml0Qm94ZWRDb250cmFjdF9hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo0MgogICAgLy8gaW5pdEJveGVkQ29udHJhY3QodmVyc2lvbjogc3RyaW5nLCBzaXplOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmluaXRCb3hlZENvbnRyYWN0X2Vsc2VfYm9keUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NDgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWNfMyAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NDgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czozOAogICAgLy8gYm94ZWRDb250cmFjdCA9IEJveDxieXRlcz4oeyBrZXk6IEJveEtleUJveGVkQ29udHJhY3QgfSkKICAgIGJ5dGVjXzEgLy8gImJjIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NDkKICAgIC8vIHRoaXMuYm94ZWRDb250cmFjdC5yZXNpemUoc2l6ZSkKICAgIHN3YXAKICAgIGJveF9yZXNpemUKICAgIGIgaW5pdEJveGVkQ29udHJhY3RfYWZ0ZXJfaWZfZWxzZUA0CgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6OkZhY3RvcnlDb250cmFjdC5sb2FkQm94ZWRDb250cmFjdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmxvYWRCb3hlZENvbnRyYWN0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTMKICAgIC8vIGxvYWRCb3hlZENvbnRyYWN0KG9mZnNldDogdWludDY0LCBkYXRhOiBieXRlcyk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGR1cAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTQKICAgIC8vIGNvbnN0IGV4cGVjdGVkUHJldmlvdXNDYWxsczogdWludDY0ID0gb2Zmc2V0IC8gMjAzMgogICAgcHVzaGludCAyMDMyIC8vIDIwMzIKICAgIC8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU1CiAgICAvLyBjb25zdCB0eG4gPSBndHhuLlRyYW5zYWN0aW9uKFR4bi5ncm91cEluZGV4IC0gZXhwZWN0ZWRQcmV2aW91c0NhbGxzIC0gMSkKICAgIHR4biBHcm91cEluZGV4CiAgICBzd2FwCiAgICAtCiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo1NwogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDYgLy8gNgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU3LTU4CiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIGJ6IGxvYWRCb3hlZENvbnRyYWN0X2Jvb2xfZmFsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTgKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICBkdXAKICAgIGd0eG5zIEFwcGxpY2F0aW9uSUQKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25JRAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU3LTU4CiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIGJ6IGxvYWRCb3hlZENvbnRyYWN0X2Jvb2xfZmFsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTkKICAgIC8vICYmIHR4bi5udW1BcHBBcmdzID09PSAzCiAgICBkdXAKICAgIGd0eG5zIE51bUFwcEFyZ3MKICAgIHB1c2hpbnQgMyAvLyAzCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTctNTkKICAgIC8vIHR4bi50eXBlID09PSBUcmFuc2FjdGlvblR5cGUuQXBwbGljYXRpb25DYWxsCiAgICAvLyAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgLy8gJiYgdHhuLm51bUFwcEFyZ3MgPT09IDMKICAgIGJ6IGxvYWRCb3hlZENvbnRyYWN0X2Jvb2xfZmFsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NjAKICAgIC8vICYmIHR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcAogICAgZHVwCiAgICBndHhucyBPbkNvbXBsZXRpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU3LTYwCiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIC8vICYmIHR4bi5udW1BcHBBcmdzID09PSAzCiAgICAvLyAmJiB0eG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AKICAgIGJueiBsb2FkQm94ZWRDb250cmFjdF9ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjYxCiAgICAvLyAmJiB0eG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3IodGhpcy5pbml0Qm94ZWRDb250cmFjdCkKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGd0eG5zYXMgQXBwbGljYXRpb25BcmdzCiAgICBieXRlYyA1IC8vIG1ldGhvZCAiaW5pdEJveGVkQ29udHJhY3Qoc3RyaW5nLHVpbnQ2NCl2b2lkIgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU3LTYxCiAgICAvLyB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gJiYgdHhuLmFwcElkID09PSBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uSWQKICAgIC8vICYmIHR4bi5udW1BcHBBcmdzID09PSAzCiAgICAvLyAmJiB0eG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AKICAgIC8vICYmIHR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3Rvcih0aGlzLmluaXRCb3hlZENvbnRyYWN0KQogICAgYnogbG9hZEJveGVkQ29udHJhY3RfYm9vbF9mYWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo2MgogICAgLy8gJiYgdHhuLnNlbmRlciA9PT0gVHhuLnNlbmRlcgogICAgZHVwCiAgICBndHhucyBTZW5kZXIKICAgIHR4biBTZW5kZXIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo1Ny02MgogICAgLy8gdHhuLnR5cGUgPT09IFRyYW5zYWN0aW9uVHlwZS5BcHBsaWNhdGlvbkNhbGwKICAgIC8vICYmIHR4bi5hcHBJZCA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbklkCiAgICAvLyAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMwogICAgLy8gJiYgdHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wCiAgICAvLyAmJiB0eG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3IodGhpcy5pbml0Qm94ZWRDb250cmFjdCkKICAgIC8vICYmIHR4bi5zZW5kZXIgPT09IFR4bi5zZW5kZXIKICAgIGJ6IGxvYWRCb3hlZENvbnRyYWN0X2Jvb2xfZmFsc2VAOAogICAgaW50Y18xIC8vIDEKCmxvYWRCb3hlZENvbnRyYWN0X2Jvb2xfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjU2LTYzCiAgICAvLyBhc3NlcnQoKAogICAgLy8gICB0eG4udHlwZSA9PT0gVHJhbnNhY3Rpb25UeXBlLkFwcGxpY2F0aW9uQ2FsbAogICAgLy8gICAmJiB0eG4uYXBwSWQgPT09IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25JZAogICAgLy8gICAmJiB0eG4ubnVtQXBwQXJncyA9PT0gMwogICAgLy8gICAmJiB0eG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AKICAgIC8vICAgJiYgdHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yKHRoaXMuaW5pdEJveGVkQ29udHJhY3QpCiAgICAvLyAgICYmIHR4bi5zZW5kZXIgPT09IFR4bi5zZW5kZXIKICAgIC8vICksIEVSUl9JTlZBTElEX0NBTExfT1JERVIpCiAgICBhc3NlcnQgLy8gSW52YWxpZCBjYWxsIG9yZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czozOAogICAgLy8gYm94ZWRDb250cmFjdCA9IEJveDxieXRlcz4oeyBrZXk6IEJveEtleUJveGVkQ29udHJhY3QgfSkKICAgIGJ5dGVjXzEgLy8gImJjIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NjQKICAgIC8vIGFzc2VydCh0aGlzLmJveGVkQ29udHJhY3QuZXhpc3RzLCBFUlJfQ09OVFJBQ1RfTk9UX1NFVCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIENvbnRyYWN0IG5vdCBzZXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjM4CiAgICAvLyBib3hlZENvbnRyYWN0ID0gQm94PGJ5dGVzPih7IGtleTogQm94S2V5Qm94ZWRDb250cmFjdCB9KQogICAgYnl0ZWNfMSAvLyAiYmMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvZmFjdG9yeS50czo2NQogICAgLy8gdGhpcy5ib3hlZENvbnRyYWN0LnJlcGxhY2Uob2Zmc2V0LCBkYXRhKQogICAgZGlnIDMKICAgIGRpZyAzCiAgICBib3hfcmVwbGFjZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NTMKICAgIC8vIGxvYWRCb3hlZENvbnRyYWN0KG9mZnNldDogdWludDY0LCBkYXRhOiBieXRlcyk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbG9hZEJveGVkQ29udHJhY3RfYm9vbF9mYWxzZUA4OgogICAgaW50Y18wIC8vIDAKICAgIGIgbG9hZEJveGVkQ29udHJhY3RfYm9vbF9tZXJnZUA5CgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6OkZhY3RvcnlDb250cmFjdC5kZWxldGVCb3hlZENvbnRyYWN0W3JvdXRpbmddKCkgLT4gdm9pZDoKZGVsZXRlQm94ZWRDb250cmFjdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjY5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ5dGVjXzMgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjY5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6MzgKICAgIC8vIGJveGVkQ29udHJhY3QgPSBCb3g8Ynl0ZXM+KHsga2V5OiBCb3hLZXlCb3hlZENvbnRyYWN0IH0pCiAgICBieXRlY18xIC8vICJiYyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9mYWN0b3J5LnRzOjcwCiAgICAvLyB0aGlzLmJveGVkQ29udHJhY3QuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2ZhY3RvcnkudHM6NjgKICAgIC8vIGRlbGV0ZUJveGVkQ29udHJhY3QoKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhRmVlR2VuZXJhdG9yQ29udHJhY3RXaXRoT3B0SW4ub3B0SW5bcm91dGluZ10oKSAtPiB2b2lkOgpvcHRJbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE1MAogICAgLy8gb3B0SW4ocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhc3NldDogQXNzZXQpOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE1MgogICAgLy8gY29uc3QgY291bnQgPSBzcGxpdE9wdEluQ291bnQodGhpcy5ha2l0YURBTy52YWx1ZSwgdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLCBhc3NldCkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE1MgogICAgLy8gY29uc3QgY291bnQgPSBzcGxpdE9wdEluQ291bnQodGhpcy5ha2l0YURBTy52YWx1ZSwgdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLCBhc3NldCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlY18yIC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNTIKICAgIC8vIGNvbnN0IGNvdW50ID0gc3BsaXRPcHRJbkNvdW50KHRoaXMuYWtpdGFEQU8udmFsdWUsIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywgYXNzZXQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZGlnIDIKICAgIGNhbGxzdWIgc3BsaXRPcHRJbkNvdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNTQtMTYxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqICgxICsgY291bnQpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE1NwogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE1NC0xNjEKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlICogKDEgKyBjb3VudCksCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDMKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTU4CiAgICAvLyBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqICgxICsgY291bnQpLAogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBpbnRjXzEgLy8gMQogICAgdW5jb3ZlciA0CiAgICArCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNTQtMTYxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqICgxICsgY291bnQpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE2My0xNjkKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAwLAogICAgLy8gICAgIHhmZXJBc3NldDogYXNzZXQKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNjUKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNjYKICAgIC8vIGFzc2V0QW1vdW50OiAwLAogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTYzLTE2OAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldAogICAgLy8gICB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTYzLTE2OQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNTAKICAgIC8vIG9wdEluKHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYXNzZXQ6IEFzc2V0KTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhRmVlR2VuZXJhdG9yQ29udHJhY3RXaXRoT3B0SW4ub3B0SW5Db3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKb3B0SW5Db3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTcyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNzQKICAgIC8vIGNvbnN0IGNvdW50ID0gc3BsaXRPcHRJbkNvdW50KHRoaXMuYWtpdGFEQU8udmFsdWUsIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywgYXNzZXQpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxNzQKICAgIC8vIGNvbnN0IGNvdW50ID0gc3BsaXRPcHRJbkNvdW50KHRoaXMuYWtpdGFEQU8udmFsdWUsIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywgYXNzZXQpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTc0CiAgICAvLyBjb25zdCBjb3VudCA9IHNwbGl0T3B0SW5Db3VudCh0aGlzLmFraXRhREFPLnZhbHVlLCB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsIGFzc2V0KQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHVuY292ZXIgMgogICAgY2FsbHN1YiBzcGxpdE9wdEluQ291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE3NQogICAgLy8gcmV0dXJuIEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSAqICgxICsgY291bnQpCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGludGNfMSAvLyAxCiAgICB1bmNvdmVyIDIKICAgICsKICAgICoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjE3MgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBpdG9iCiAgICBieXRlYyA0IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUZlZUdlbmVyYXRvckNvbnRyYWN0LnVwZGF0ZUFraXRhREFPRXNjcm93W3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU9Fc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzcKICAgIC8vIHVwZGF0ZUFraXRhREFPRXNjcm93KGFwcDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWNfMyAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTM4CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlY18yIC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzkKICAgIC8vIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUgPSBhcHAKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzcKICAgIC8vIHVwZGF0ZUFraXRhREFPRXNjcm93KGFwcDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6VXBncmFkZWFibGVBa2l0YUJhc2VDb250cmFjdC51cGRhdGVbcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0OAogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogWydVcGRhdGVBcHBsaWNhdGlvbiddIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUwCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGR1cAogICAgYnl0ZWNfMyAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTAKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICB1bmNvdmVyIDIKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBwdXNoYnl0ZXMgInBhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUxCiAgICAvLyBjb25zdCB1cGRhdGVQbHVnaW4gPSBnZXRQbHVnaW5BcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnVwZGF0ZQogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUyCiAgICAvLyBhc3NlcnQoR2xvYmFsLmNhbGxlckFwcGxpY2F0aW9uSWQgPT09IHVwZGF0ZVBsdWdpbiwgRVJSX0lOVkFMSURfVVBHUkFERSkKICAgIGdsb2JhbCBDYWxsZXJBcHBsaWNhdGlvbklECiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgYXBwIHVwZ3JhZGUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBieXRlYyA2IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTMKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IG5ld1ZlcnNpb24KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0OAogICAgLy8gQGFiaW1ldGhvZCh7IGFsbG93QWN0aW9uczogWydVcGRhdGVBcHBsaWNhdGlvbiddIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUNvbnRyYWN0LnVwZGF0ZUFraXRhREFPW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU86CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWNfMyAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OlJhZmZsZUZhY3RvcnkuY3JlYXRlQ2hpbGRBcHAoaXNQcml6ZUJveDogdWludDY0LCBwYXltZW50OiB1aW50NjQsIHByaXplSUQ6IHVpbnQ2NCwgdGlja2V0QXNzZXQ6IHVpbnQ2NCwgc3RhcnRUaW1lc3RhbXA6IHVpbnQ2NCwgZW5kVGltZXN0YW1wOiB1aW50NjQsIGNyZWF0b3JSb3lhbHR5OiB1aW50NjQsIG1pblRpY2tldHM6IHVpbnQ2NCwgbWF4VGlja2V0czogdWludDY0LCBnYXRlSUQ6IHVpbnQ2NCwgbWFya2V0cGxhY2U6IGJ5dGVzLCB3ZWlnaHRzTGlzdENvdW50OiB1aW50NjQpIC0+IHVpbnQ2NDoKY3JlYXRlQ2hpbGRBcHA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czozMS00NAogICAgLy8gcHJpdmF0ZSBjcmVhdGVDaGlsZEFwcCgKICAgIC8vICAgaXNQcml6ZUJveDogYm9vbGVhbiwKICAgIC8vICAgcGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBwcml6ZUlEOiB1aW50NjQsIC8vIEFzc2V0IG9yIFByaXplIEJveCBBcHBsaWNhdGlvbgogICAgLy8gICB0aWNrZXRBc3NldDogdWludDY0LAogICAgLy8gICBzdGFydFRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBlbmRUaW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgY3JlYXRvclJveWFsdHk6IHVpbnQ2NCwKICAgIC8vICAgbWluVGlja2V0czogdWludDY0LAogICAgLy8gICBtYXhUaWNrZXRzOiB1aW50NjQsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICBtYXJrZXRwbGFjZTogQWNjb3VudCwKICAgIC8vICAgd2VpZ2h0c0xpc3RDb3VudDogdWludDY0CiAgICAvLyApOiBBcHBsaWNhdGlvbiB7CiAgICBwcm90byAxMiAxCiAgICBpbnRjXzAgLy8gMAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjQ2CiAgICAvLyBsZXQgb3B0aW5NQlI6IHVpbnQ2NCA9IDAKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo0OAogICAgLy8gY29uc3QgaXNBbGdvT3JQcml6ZUJveCA9IHByaXplSUQgPT09IDAgfHwgaXNQcml6ZUJveAogICAgZnJhbWVfZGlnIC0xMAogICAgIQogICAgZnJhbWVfZGlnIC0xMgogICAgfHwKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjQ5CiAgICAvLyBpZiAoIWlzQWxnb09yUHJpemVCb3gpIHsKICAgIGJueiBjcmVhdGVDaGlsZEFwcF9hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjUwCiAgICAvLyBvcHRpbk1CUiA9IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBmcmFtZV9idXJ5IDMKCmNyZWF0ZUNoaWxkQXBwX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjU0CiAgICAvLyBpZiAoIWlzQWxnb1RpY2tldCkgewogICAgZnJhbWVfZGlnIC05CiAgICBieiBjcmVhdGVDaGlsZEFwcF9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjU1CiAgICAvLyBvcHRpbk1CUiArPSBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGZyYW1lX2RpZyAzCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgICsKICAgIGZyYW1lX2J1cnkgMwoKY3JlYXRlQ2hpbGRBcHBfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6NTkKICAgIC8vIGNvbnN0IGNoaWxkQXBwTUJSOiB1aW50NjQgPSBHbG9iYWwubWluQmFsYW5jZSArIG9wdGluTUJSCiAgICBnbG9iYWwgTWluQmFsYW5jZQogICAgZnJhbWVfZGlnIDMKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjYwCiAgICAvLyBjb25zdCB3ZWlnaHRzTUJSOiB1aW50NjQgPSAod2VpZ2h0c0xpc3RDb3VudCAqIGNvc3RzLndlaWdodHMpCiAgICBmcmFtZV9kaWcgLTEKICAgIHB1c2hpbnQgMTMxMTMzMDAgLy8gMTMxMTMzMDAKICAgICoKICAgIGR1cAogICAgY292ZXIgMgogICAgZnJhbWVfYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo2MQogICAgLy8gY29uc3QgZmVlcyA9IGdldE5GVEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjYxCiAgICAvLyBjb25zdCBmZWVzID0gZ2V0TkZURmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6ODkKICAgIC8vIGNvbnN0IFtuZnRGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzTkZURmVlcykpCiAgICBkdXAKICAgIHB1c2hieXRlcyAibmZ0X2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo2NgogICAgLy8gZmVlcy5yYWZmbGVDcmVhdGlvbkZlZSArCiAgICBwdXNoaW50IDg4IC8vIDg4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6NjYtNjkKICAgIC8vIGZlZXMucmFmZmxlQ3JlYXRpb25GZWUgKwogICAgLy8gTUFYX1BST0dSQU1fUEFHRVMgKwogICAgLy8gKEdMT0JBTF9TVEFURV9LRVlfVUlOVF9DT1NUICogcmFmZmxlLmdsb2JhbFVpbnRzKSArCiAgICAvLyAoR0xPQkFMX1NUQVRFX0tFWV9CWVRFU19DT1NUICogcmFmZmxlLmdsb2JhbEJ5dGVzKSArCiAgICBkdXAKICAgIHB1c2hpbnQgMTM5ODUwMCAvLyAxMzk4NTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo2Ni03MAogICAgLy8gZmVlcy5yYWZmbGVDcmVhdGlvbkZlZSArCiAgICAvLyBNQVhfUFJPR1JBTV9QQUdFUyArCiAgICAvLyAoR0xPQkFMX1NUQVRFX0tFWV9VSU5UX0NPU1QgKiByYWZmbGUuZ2xvYmFsVWludHMpICsKICAgIC8vIChHTE9CQUxfU1RBVEVfS0VZX0JZVEVTX0NPU1QgKiByYWZmbGUuZ2xvYmFsQnl0ZXMpICsKICAgIC8vIGNoaWxkQXBwTUJSICsKICAgIHVuY292ZXIgMwogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6NjYtNzEKICAgIC8vIGZlZXMucmFmZmxlQ3JlYXRpb25GZWUgKwogICAgLy8gTUFYX1BST0dSQU1fUEFHRVMgKwogICAgLy8gKEdMT0JBTF9TVEFURV9LRVlfVUlOVF9DT1NUICogcmFmZmxlLmdsb2JhbFVpbnRzKSArCiAgICAvLyAoR0xPQkFMX1NUQVRFX0tFWV9CWVRFU19DT1NUICogcmFmZmxlLmdsb2JhbEJ5dGVzKSArCiAgICAvLyBjaGlsZEFwcE1CUiArCiAgICAvLyB3ZWlnaHRzTUJSCiAgICB1bmNvdmVyIDMKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjc0LTgxCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRvdGFsTUJSLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTExCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6NzcKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo3NC04MQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0b3RhbE1CUiwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIGZyYW1lX2RpZyAtMTEKICAgIGd0eG5zIEFtb3VudAogICAgZGlnIDIKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6ODMtODgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBmZWVzLnJhZmZsZUNyZWF0aW9uRmVlLAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjg1CiAgICAvLyByZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWNfMiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6ODUKICAgIC8vIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICB1bmNvdmVyIDMKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo4My04NwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGZlZXMucmFmZmxlQ3JlYXRpb25GZWUsCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo4My04OAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGZlZXMucmFmZmxlQ3JlYXRpb25GZWUsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjkwLTEwOAogICAgLy8gY29uc3QgYXBwSWQgPSByYWZmbGUuY2FsbAogICAgLy8gICAuY3JlYXRlKHsKICAgIC8vICAgICBhcmdzOiBbCiAgICAvLyAgICAgICBwcml6ZUlELAogICAgLy8gICAgICAgaXNQcml6ZUJveCwKICAgIC8vICAgICAgIHRpY2tldEFzc2V0LAogICAgLy8gICAgICAgc3RhcnRUaW1lc3RhbXAsCiAgICAvLyAgICAgICBlbmRUaW1lc3RhbXAsCiAgICAvLyAgICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgICAgeyBhY2NvdW50OiBwYXltZW50LnNlbmRlciwgYW1vdW50OiB0b3RhbE1CUiB9LAogICAgLy8gICAgICAgY3JlYXRvclJveWFsdHksCiAgICAvLyAgICAgICBtaW5UaWNrZXRzLAogICAgLy8gICAgICAgbWF4VGlja2V0cywKICAgIC8vICAgICAgIGdhdGVJRCwKICAgIC8vICAgICAgIG1hcmtldHBsYWNlLAogICAgLy8gICAgICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgICAgIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUsCiAgICAvLyAgICAgXSwKICAgIC8vICAgfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjkzCiAgICAvLyBwcml6ZUlELAogICAgZnJhbWVfZGlnIC0xMAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OTQKICAgIC8vIGlzUHJpemVCb3gsCiAgICBwdXNoYnl0ZXMgMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtMTIKICAgIHNldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OTUKICAgIC8vIHRpY2tldEFzc2V0LAogICAgZnJhbWVfZGlnIC05CiAgICBpdG9iCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OTYKICAgIC8vIHN0YXJ0VGltZXN0YW1wLAogICAgZnJhbWVfZGlnIC04CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo5NwogICAgLy8gZW5kVGltZXN0YW1wLAogICAgZnJhbWVfZGlnIC03CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo5OAogICAgLy8gVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjk5CiAgICAvLyB7IGFjY291bnQ6IHBheW1lbnQuc2VuZGVyLCBhbW91bnQ6IHRvdGFsTUJSIH0sCiAgICBmcmFtZV9kaWcgLTExCiAgICBndHhucyBTZW5kZXIKICAgIHVuY292ZXIgOAogICAgaXRvYgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMDAKICAgIC8vIGNyZWF0b3JSb3lhbHR5LAogICAgZnJhbWVfZGlnIC02CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMDEKICAgIC8vIG1pblRpY2tldHMsCiAgICBmcmFtZV9kaWcgLTUKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjEwMgogICAgLy8gbWF4VGlja2V0cywKICAgIGZyYW1lX2RpZyAtNAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTAzCiAgICAvLyBnYXRlSUQsCiAgICBmcmFtZV9kaWcgLTMKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjEwNQogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIHVuY292ZXIgMTIKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjEwNgogICAgLy8gdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZSwKICAgIHVuY292ZXIgMTIKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjkwLTEwOAogICAgLy8gY29uc3QgYXBwSWQgPSByYWZmbGUuY2FsbAogICAgLy8gICAuY3JlYXRlKHsKICAgIC8vICAgICBhcmdzOiBbCiAgICAvLyAgICAgICBwcml6ZUlELAogICAgLy8gICAgICAgaXNQcml6ZUJveCwKICAgIC8vICAgICAgIHRpY2tldEFzc2V0LAogICAgLy8gICAgICAgc3RhcnRUaW1lc3RhbXAsCiAgICAvLyAgICAgICBlbmRUaW1lc3RhbXAsCiAgICAvLyAgICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgICAgeyBhY2NvdW50OiBwYXltZW50LnNlbmRlciwgYW1vdW50OiB0b3RhbE1CUiB9LAogICAgLy8gICAgICAgY3JlYXRvclJveWFsdHksCiAgICAvLyAgICAgICBtaW5UaWNrZXRzLAogICAgLy8gICAgICAgbWF4VGlja2V0cywKICAgIC8vICAgICAgIGdhdGVJRCwKICAgIC8vICAgICAgIG1hcmtldHBsYWNlLAogICAgLy8gICAgICAgdGhpcy5ha2l0YURBTy52YWx1ZSwKICAgIC8vICAgICAgIHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUsCiAgICAvLyAgICAgXSwKICAgIC8vICAgfSkKICAgIHB1c2hieXRlcyAweGUyMmUwMzkyIC8vIG1ldGhvZCAiY3JlYXRlKHVpbnQ2NCxib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LGFkZHJlc3MsKGFkZHJlc3MsdWludDY0KSx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYWRkcmVzcyx1aW50NjQsdWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAxMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICB1bmNvdmVyIDEwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA5CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA4CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA3CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA2CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA1CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciA0CiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgdW5jb3ZlciAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIC0yCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czo2MwogICAgLy8gY29uc3QgcmFmZmxlID0gY29tcGlsZUFyYzQoUmFmZmxlKQogICAgaW50Y18zIC8vIDIKICAgIGl0eG5fZmllbGQgRXh0cmFQcm9ncmFtUGFnZXMKICAgIGludGNfMiAvLyA4CiAgICBpdHhuX2ZpZWxkIEdsb2JhbE51bUJ5dGVTbGljZQogICAgcHVzaGludCAyMSAvLyAyMQogICAgaXR4bl9maWVsZCBHbG9iYWxOdW1VaW50CiAgICBwdXNoYnl0ZXMgYmFzZTY0KEM0RUJRdz09KQogICAgaXR4bl9maWVsZCBDbGVhclN0YXRlUHJvZ3JhbVBhZ2VzCiAgICBwdXNoYnl0ZXMgYmFzZTY0KEN5QU5BQUVJQklBZ29JMEdyZjdWNU5TRi9haFlxSXNEejRLZXUrL3Yzb0lVMFlLZXUrL3Yzb0lVLy8vLy93L1VyNkFHLy8vLy8vLy8vLy8vQVNZakRIUnBZMnRsZEY5aGMzTmxkQWxoYTJsMFlWOWtZVzhNZEdsamEyVjBYMk52ZFc1MEMyVnVkSEo1WDJOdmRXNTBCbmRwYm01bGNnUVZIM3gxQlhCeWFYcGxDSGRmZEc5MFlXeHpBV0VPZDJsdWJtbHVaMTkwYVdOclpYUUhaMkYwWlY5cFpBeGhhMmwwWVY5bGMyTnliM2NSZDJWcFoyaDBjMTlpYjNoZlkyOTFiblFHYzJWc2JHVnlBWGNMYldGNFgzUnBZMnRsZEhNTmNISnBlbVZmWTJ4aGFXMWxaQkZ5WldaMWJtUmZiV0p5WDJOMWNuTnZjZzFsYm1SZmRHbHRaWE4wWVcxd0MyMWhjbXRsZEhCc1lXTmxFWFp5Wmw5bVlXbHNkWEpsWDJOdmRXNTBBV1VHZDJGc2JHVjBGVzFoY210bGRIQnNZV05sWDNKdmVXRnNkR2xsY3dOdllXd01hWE5mY0hKcGVtVmZZbTk0RDNOMFlYSjBYM1JwYldWemRHRnRjQTFoYTJsMFlWOXliM2xoYkhSNUUyWnBibVJmZDJsdWJtVnlYMk4xY25OdmNuTVBZM0psWVhSdmNsOXliM2xoYkhSNUF3YUJBUXR0YVc1ZmRHbGphMlYwY3dobGJuUnllVjlwWkFJQUFBTndZV3lDQWdRa2g4TXNCT3FSZ04wMkdnQ09BZ0RMQU1BeEdSUkVNUmhCQUttQ0VnUzljVWpRQlBMT0wwWUVMSlFsRkFTWE9jdTJCT09pSFZJRUJVb3dJQVJqdTdjMUJFZ2hJY01FYVdVQjNnUzlHeWZSQkdYOHFZc0VqNlNoWUFTZVZ5YnhCQjZ0SUtrRU0ra3NsQVNGVGUzZ0JObWpYNlFFUHFFWU1qWWFBSTRTQkRrRWxBVU5CWDRHUlFjcUI5VUg2UWh5Q2xJTGNSQVFFQ0VRdFJFT0FDSUFBUkVyQUlBY0ZSOThkUUFBQUFBQUFIdlVBQUFBQUFESUY5UUFBQUFBQUFCSjFMQWpReU5EZ0FUaUxnT1NOaG9BamdFQ1dBQXhHU1VTTVJnUVJFSVFsakVaZ1FVU01SZ1FSRUlGRllvQ0FJditnUW9JaXdBeURBMUJBQ3F4Z1FheUVJRUZzaGtuSHJJZUp4NnlINHYvalFJQUN3QUVzMEwvMnpJQXNnRkMvL1Vpc2dGQy8rK0ppZ0VCaS8rQkVwR0wveHVCRzVFaENocUwvNEU3a1VxUlRCd2pIa1VCZ1I4YVR3Sk1rQ0VLR2htSmlnRUJNUUNMLzBBQUJJc0FUSW1MLzRBU1kyOXVkSEp2Ykd4bFpGOWhaR1J5WlhOelpVaEMvK09LQWdHTC9pY1laVWlCR0Z1eGdBUThHbTh6c2hxTC83SWFzaGlCQnJJUUlySUJzN1ErU1ZjRUFFc0JWd0FFSndVU1JFa2lXWUVDQ0V3VkVrUlhCZ0JKRlVsQkFBZUxBU1FUUVFBRUlvd0FpWXNBRjBMLzk0b0VBckdML0lBRFlXRnNaVWlCS0Z1TC9oYUFCQ0FQZENHeUdvdjlzaHF5R292L3NocXlHSUVHc2hBaXNnR3p0RDVKVndRQVRGY0FCQ2NGRWtSSkZTTVNSQ0pUaS8rSmlnVUFnQUJIQWlLTCt5Y1laVWlCRUZ0SEFuSUlURTRDUkxHTC9SWkpUZ0tBQk1xbzJxV3lHb3Y4c2hxeUdySVlnUWF5RUNLeUFiTzBQa2xYQkFCTEFWY0FCQ2NGRWtSSkZZRVpFa1JMQVlFTVcwbE9BazREZ1lBQlUwNENTd0ZYRlFoT0FreUJGVnRNUUFBRml3cEJBQk94aXdlTENnaXlDSXNGc2djanNoQWlzZ0d6aXdoQUFCbXhnQVRvVkFnUXNocUxCcklhaXdTeUdJRUdzaEFpc2dHekk0d0NJNHdBSW93QmkvOUJBQTBqakFFaWpBQWlqQUtMQll3RHNZc0JRUUFFaXdPeUZZdjlzaEdMQUVFQUJJditzaEtMQWtFQUJJc0ZzaFFsc2hBaXNnRzJnQVFJVXg3WHNocUwvTElhaXdteUdvc0VzaGlCQnJJUUlySUJzN2NCUGtsWEJBQk1Wd0FFSndVU1JCV0JJQkpFaVlBQVJ3STJHZ0ZKRlNRU1JCYzJHZ0pKRlNNU1JDSlROaG9EU1JVa0VrUVhTVTRETmhvRVNSVWtFa1FYVGdNMkdnVkpGU1FTUkJkT0F6WWFCa2xPQkJXQklCSkVOaG9IU1U0RUZZRW9Fa1EyR2dnVkpCSkVOaG9KU1JVa0VrUVhUZ00yR2dwSkZTUVNSQmRPQXpZYUMwa1ZKQkpFRjA0RE5ob01TVTRFRllFZ0VrUTJHZzFKRlNRU1JCZE9BellhRGtrVkpCSkVGMDRETWcxRUp3WlBBMmNuR1U4Q1owRUFCa3NLY1FCRVJDaExDMmNuR2tzS1NVNENaMHNKREVFQTdFc0lNZ2NOUVFEa0kwUW5Fa3NKWnljTlN3aG5nQVptZFc1a1pYSkxCMmNuSDBzR1p5Y1BTd1ZuS3lKbktpSm5Kd2tpWnljRU1nTm5KeEFpWnljS1N3Um5KeE5MQTJjcFN3Sm5Kd3RMQVdjaUtXVkVnQWh1Wm5SZlptVmxjMlZJU1lGd1d5Y1hUR2NpS1dWRUlpY05aVVN4VElBRGMyRnNaVWlCRUZ1QUJOVjB1eEN5R3JJWXNocUJCcklRSXJJQnM3UStTVmNFQUV4WEFBUW5CUkpFU1JVa0VrUVhTVVVRU3dHQllGdEZEa3lCYUZ0RkRpTU5RUUF2U3cwakNVc05TVXNPQ1U4Q0M0SG9Cd29KSnh0TVp5Y2dJbWNuRENKbmdYaXZKd2RNWnljUkltY25GQ0puSTBNalF2L1JJa0wvR1RFV0l3bEpPQkFqRWtRMkdnRkpGU1FTUkJkSlRnSXhBRElKRWtSSkpROUVTWUVRREVSSklRc0xTd0k0QnpJS0VrOERPQWhQQWhJUVJDY01UR2NpU1VzQ0RFRUFGRWNDRmljT1RGQ0JnSUFDdVVnakNFVUJRdi9sSTBNMkdnRkpGU1FTUkJjaUsyVkVJd2tpSndSbFJESURFMFFpSnhGbFJFb1RSRXhMQVFsSlN3TU5URThEVHdKTlNVNENnV1FMSW9qN2ZVbExBZ3hCQUN4SEFoWW5GVXhRU2I1RVZ3QWdUTHhJSndoTEFWQzhTTEd5QnlFSHNnZ2pzaEFpc2dHekl3aEZBVUwvelNJbkVXVkVTd0lJSnhGTVp5TkRJaWNRWlVSRUlpSW5ER1ZFU3dFTlFRQWJJaWNNWlVRakNVc0JTVTRDQ1JZbkRreFF2RWdqQ0VVQlF2L2FJaWNNWlVRaEN3dXhNZ2xMQWJJSXNnY2pzaEFpc2dHekp3d2laeFluQlV4UXNDTkRNUUF5Q1JKRUlpY1FaVVJFSWl0bFJDTUpJaWNSWlVRVFJDSW5ER1ZFRkVNeEZpTUpTVGdRSXhKRU5ob0JTUldCSUJKRU5ob0NpQXZSUkNJb1pVUVVSQ0luQ21WRVFRQWZJaWxsUkRFQWlQc29pUHI4SWlsbFJDSW5DbVZFVEU0Q1N3T0krMnBJUkNjSU1RQlF2VVVCRkVSTEFrazRCeklLRWt3NENDSW5EMlZFSVFjSVN3RVBUd0lRUkNJclpVUXhBRXNFVUVzQkZpY1ZTd0ZRVHdLL0p3Z3hBRkJNdjB3aEJ3bEpGa3NDSVFRS1NSWW5Ea3hRVHdRaEJCZ2tDMDhEdXlJbkIyVkVUQ1FMU2x0TEF3Z1dYU2NIVEdjaUsyVkVJd2dyVEdjaUttVkVDQ3BNWnlORE1SYUJBZ2xKT0JBakVrUXhGaU1KU1RnUUpSSkVOaG9CU1JXQklCSkVOaG9DaUFyL1JDSW9aVVJFSWljS1pVUkJBQjhpS1dWRU1RQ0krbGVJK2lzaUtXVkVJaWNLWlVSTVRnSkxBNGo2bVVoRUp3Z3hBRkM5UlFFVVJFc0RTVGdITWdvU1REZ0lJUWNTRUVSTEFrazRGRElLRWtzQk9CRWlLR1ZFRWhCTU9CSWlKdzlsUkVzQkQwOENFRVFpSzJWRU1RQkxCRkJMQVJZbkZVc0JVRThDdnljSU1RQlFUTDlMQVJaTEFTRUVDa2tXSnc1TVVFOERJUVFZSkF0UEE3c2lKd2RsUkV3a0MwcGJTd01JRmwwbkIweG5JaXRsUkNNSUsweG5JaXBsUkFncVRHY2pRekVXSXdsSk9CQWpFa1EyR2dHSUNpNUVJaWhsUkJSRUlpY0taVVJCQUI4aUtXVkVNUUNJK1lXSStWa2lLV1ZFSWljS1pVUk1UZ0pMQTRqNXgwaEVKd2d4QUZDOVJRRkVKd2d4QUZDK1JCZEpJUVFLU1JZbkRreFFUd0loQkJna0Mwb2t1a3NGU1RnSE1nb1NURGdJSWljUFpVUlBBeGRNU3dFSlN3SVBUd01RUkVsTEFnZ1dUd1JQQkU4Q3V5SW5CMlZFVHdNa0MwcGJUd1FJRmwwbkIweG5JaXBsUkFncVRHY2pRekVXZ1FJSk9CQ0JCaEpFTVJZakNUZ1FKUkpETVJZakNVazRFQ1VTUklnSmNrUWlLR1ZFU1VRbkNERUFVTDFGQVVRbkNERUFVTDVFRjBraEJBcEpGaWNPVEZCUEFpRUVHQ1FMU2lTNlN3VTRGRElLRWtzR09CRlBCaElRVHdVNEVpSW5EMlZFVHdNWFRFc0JDVXNDRDA4REVFUkpTd0lJRms4RVR3UlBBcnNpSndkbFJFOERKQXRLVzA4RUNCWmRKd2RNWnlJcVpVUUlLa3huSTBNaVJ3S0FBRWNISWljU1pVUWpDQ0luRkdWRUpRc0lNZ1pMQVNRSUQwUWlKd2xsUkJSRXNTSXBaVVFuR0dWSUlsdE1GaUtBQkhOaGJIUmxSRWtWRmxjR0FreFFnQVFZazVMRnNocE1zaHF5R3JJWWdRYXlFQ0t5QWJPMFBrbFhCQUJMQVZjQUJDY0ZFa1JKSWxtQkFnaE1GUkpFVndZQVNSVkpRQUFOSWljVVpVUWpDQ2NVVEdjalF5SkxBVWxPQWc4aVN3SlBBazJCRUVzQ0Q0RVFUd05QQWsxTEEwNENVa2tWZ1JBU1JFa2lXeUloQmgxRkFVa2hDQjVGQVU4Q0hrVUJJUVlkUlFFaENCNU9Ba2hQQWlSYlRDRUpIa1VCSGtVQklRWWRSUUVoQ1I1RkFVd1dUQlpRUlF3aUttVk1TVTRDUlFWRUlRd01RUUFHU3dJakNFVURKeUZGRFVzQ1FRRFFTd0pKSXcxRUl3bEpSUXNqRFVSTENVa2NJeDVGQVV3WVJRUWlSUWRMQzBVTFN3WWpERUVBakVzS1NTSmJTVVVISVFZZFJRRWhDQjVKVGdKRkRFaE1KRnRGQjBBQWFZR2loYnoyM3QrOWhTaExCa2toQmgxRkFVOENIa1VCU3dvV1RCWlFTd2FJOXFHQklKQlBBb2oybVJrV1VFbFhBQkJNZ1JCYlNVVUtTd1VQUVFBbVN3aExDeGdqQ0JaTERrbFBBbEJNSWxrakNCWlhCZ0pjQUVVT1N3Y2pDRVVJUlF0Qy8zZEZDMEwvZVNFSlF2K2NTd3FBQWdBU1VFc05VRW1CRUZsTEFSVlNnUUpiSndsTVowTCtyaUVNUlFwQy96Y2lnQUJKTmhvQlNSVWtFa1FYTWdjaUp4SmxSQTFFSWljSlpVUkVJaWNFWlVReUF4SkVJaWNjWlVSSklsdE1KRnNpSWljTVpVUkxBUTFCQU5raUp3ZGxSRXNCSkF0YlNVVUhJaWNKWlVSTEEwOENDQXhCQUtaTEFoWkxBaFpRU1NKYlNVNENSUVVrVzBVRElpdGxSRXNCQ1VsTEJrbE9BdzFNVGdKTlNVNENSUVloQkFvV0p3NU1VRVVJZ1NnTElvajFaU0pGQVVsTEJBeEJBRWhKSkF0TEIwd2t1aGRMQWtsUEFnaEZCaUluQ1dWRURrRUFJQ0luQ1dWRVN3VU9RUUFWU3dKTEFRZ2pDQlluRlV4UXZrUlhBQ0FuQkV4blN3UWpDRVVDU1NNSVJRRkMvN0VpSnh4bFJFa2lXMHNGQ0JaY0FFc0NGbHdJSnh4TVp5TkRTd0loQkFoRkEwc0ZJd2hMQWdoRkFra2pDRVVCUXY4Y1N3SVdTd0lXVUVML1B5SkpnQUJIQ3lJbkJHVkVNZ01UUkNJbkVHVkVGRVFpSnhsbFJFRUVOYkVpSndabFJDSW5CR1ZFZ0FTdCtTcmtzaHF5R3JJWWdRYXlFQ0t5QWJNaUttVk1SUXRFSWljWlpVUWlSUWhBQUM0aUp4MWxSRUVBSmlJbkhXVkVTU0VGRGtSTENoMGhCWmRKUlFoQUFCQWlKeDFsUkVFQUNFc0pRUUFESTBVSElrVU1JaWNiWlVSQkFCNGlKeHRsUkVraEJRNUVTd29kSVFXWFNVVU5RQUFJU3dsQkFBTWpSUXdpUlFZaUp4ZGxSRUVBSmlJbkYyVkVTU0VGRGtSTENoMGhCWmRKUlFkQUFCQWlKeGRsUkVFQUNFc0pRUUFESTBVR1N3WkpTdzFKVGdNSWdRSkxDVWxPQlFzSVN3MU1DVXdXVHdJV1VFOENGbEJNRmxCRkRpSW5CR1ZFSndoTVVMNUVGeFluRlV4UXZrUlhJQ0JGRFNJb1pVUkFBSHhMRFNKYlNVVUVRUUFXc1NJbkJtVkVjUXRFU3dPeUNMSUhJN0lRSXJJQnM3RWlKd3RsUkhJSVJFc09TVTRDSkZ1eUNMSUhJN0lRSXJJQnM3RWlKeE5sUkVzQmdSQmJTYklJVExJSEk3SVFJcklCczdHeUNFc05zZ2Nqc2hBaXNnR3pzU0luRFdWRVRJRVlXN0lJc2djanNoQWlzZ0d6SnhBalp5TkRTdzBpVzBsRkEwRUFMeUluQm1WRWNRdEVJaWhsUkhBQVJRRkJBb2F4SWljR1pVUnhDMFFpS0dWRXNoRkxBcklTc2hRbHNoQWlzZ0d6SWljTFpVUnlDRVFpS0dWRWNBQkZBVUVBNzdFaUp3dGxSSElJUkVzT0pGc2lLR1ZFc2hHeUVySVVKYklRSXJJQnN5SW5FMlZFSWlobFJIQUFSUUZCQUtpeElpY1RaVVJMRG9FUVd5SW9aVVN5RWJJU3NoUWxzaEFpc2dHeklpaGxSRXNOVEhBQVJRPT0pCiAgICBpdHhuX2ZpZWxkIEFwcHJvdmFsUHJvZ3JhbVBhZ2VzCiAgICBwdXNoYnl0ZXMgYmFzZTY0KEFVRUFZckZMRFlFUVd5SW9aVVN5RWJJU1N3eXlGQ1d5RUNLeUFiTWlKdzFsUkNJb1pVUndBRVVCUVFBaHNTSW5EV1ZFSWlwbFJDSW9aVVN5RWJJU1NiSVZzaFFsc2hBaXNnR3pRdjhNSWlsbFJDSW5EV1ZFSWlobFJDSXFaVVFqaVBOcFF2NzBJaWxsUkNJb1pVUkxENEVRVzA4Q1N3OVBBMDhESW9qelRVTC9teUlwWlVRaUp4TmxSQ0lvWlVSTEVJRVFXeUtJOHpSQy8xc2lLR1ZNU1U0Q1JRdEVTdzRrVzBVTElpbGxURWxPQWtVT1JFa25GbVZJU1U0Q1JRUkpKeUpsU0VsWENBaE1KRnRGQ0V3bkZtVklzWUFFb2tBOTM3SWFnQkVBQVFBQ0FBdHlaWFpmY21GbVpteGxjN0lhc2hpQkJySVFJcklCczdRK1NWY0VBRXNCVndBRUp3VVNSRWtpV1lFSkM0RUNDRXdWRWtSWEJna2lXMGxFSWljTFpVUk1Td0VTUkxHQUJGZ3Y4NEt5R2t5eUdvQUJnTElhZ0EwQUMzSmxkbDl5WVdabWJHVnpzaHFBQ2dBQkFBQUFBQUFBQUFDeUdpY2hzaHBNc2hpQkJySVFJcklCY2doRUlrVUtUSEFBUlFGQUFCcExDb0FPY21WMlpXNTFaVjl6Y0d4cGRITmxTQ0paSXdoRkNESVFTd2dMdGlJbkMyVkVjZ2hFc2dleUNDT3lFQ0t5QWJaSEFoWkxDaGFBQWdBQlRGQ0FCR2cxNDd5eUdreXlHb0FCZ0xJYXNocExCTElZZ1FheUVDS3lBYmFBQkd6RDlnYXlHcklZZ1FheUVDS3lBVXNKUVFBWnRpSW5DMlZFY2doRVN3bXlFVXNLc2hLeUZDV3lFQ0t5QWJOQy9jY2lLV1ZFSWljR1pVUnhDMFFpS0dWRVN3UWlpUEd6UXYxOU1nb2lKd1psUkV4TEFYQUFTRVVHSWljRVpVUk1jQUJGQVVFQUdiRWlKd1JsUkNJbkJtVkVzaEd5RlNXeUVDS3lBYk5DKzdVaUtXVkVJaWNFWlVRaUp3WmxSRXNISTRqeFowTDdub2dCVllBQkFDSlBBbFFuQlV4UXNDTkRJaWhsUkNJbkdtVkVJaWNTWlVRaUp3MWxSQ0luSDJWRUlpY1BaVVFpSzJWRUlpcGxSQ0luQ1dWRUlpY0VaVVFpSndabFJDSW5FR1ZFSWljS1pVUWlKeFJsUkNJbklHVkVJaWNSWlVSUER4WlBEeFpRVHc0V1VFOE5VRThNRmxCUEN4WlFUd29XVUU4SkZsQlBDQlpRVHdkUVR3WVdVSUFCQUNKUEIxUlFUd1FXVUU4REZsQlBBaFpRVEJaUUp3Vk1VTEFqUXpZYUFVa1ZKQkpFRnpFQUlpbGxSQ2NXWlVoeUNFUVNSQ2NMVEdjalF6WWFBVWtpV1lFQ0NFc0JGUkpFVndJQU1RQWlLV1ZFU1NjV1pVaHlDRVJQQWhKRUp5SmxTSUVRV3pJTkVrU0FCM1psY25OcGIyNU1aeU5ETmhvQlNSVWtFa1FYTVFBaUtXVkVKeFpsU0hJSVJCSkVLVXhuSTBNeEZpTUpTVGdRSXhKRU5ob0JTUlVrRWtRWE1RQXlDUkpFU3dFNEJ6SUtFazhDT0FneUVCSVFSTEV5Q2t5eUVTS3lFcklVSmJJUUlySUJzeU5ETWdjaUp4cGxSQTlCQUEweUJ5SW5FbVZFRGtFQUFpT0pJb2s9KQogICAgaXR4bl9maWVsZCBBcHByb3ZhbFByb2dyYW1QYWdlcwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OTAtMTA4CiAgICAvLyBjb25zdCBhcHBJZCA9IHJhZmZsZS5jYWxsCiAgICAvLyAgIC5jcmVhdGUoewogICAgLy8gICAgIGFyZ3M6IFsKICAgIC8vICAgICAgIHByaXplSUQsCiAgICAvLyAgICAgICBpc1ByaXplQm94LAogICAgLy8gICAgICAgdGlja2V0QXNzZXQsCiAgICAvLyAgICAgICBzdGFydFRpbWVzdGFtcCwKICAgIC8vICAgICAgIGVuZFRpbWVzdGFtcCwKICAgIC8vICAgICAgIFR4bi5zZW5kZXIsCiAgICAvLyAgICAgICB7IGFjY291bnQ6IHBheW1lbnQuc2VuZGVyLCBhbW91bnQ6IHRvdGFsTUJSIH0sCiAgICAvLyAgICAgICBjcmVhdG9yUm95YWx0eSwKICAgIC8vICAgICAgIG1pblRpY2tldHMsCiAgICAvLyAgICAgICBtYXhUaWNrZXRzLAogICAgLy8gICAgICAgZ2F0ZUlELAogICAgLy8gICAgICAgbWFya2V0cGxhY2UsCiAgICAvLyAgICAgICB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgLy8gICAgICAgdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZSwKICAgIC8vICAgICBdLAogICAgLy8gICB9KQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgT25Db21wbGV0aW9uCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6OTAtMTEwCiAgICAvLyBjb25zdCBhcHBJZCA9IHJhZmZsZS5jYWxsCiAgICAvLyAgIC5jcmVhdGUoewogICAgLy8gICAgIGFyZ3M6IFsKICAgIC8vICAgICAgIHByaXplSUQsCiAgICAvLyAgICAgICBpc1ByaXplQm94LAogICAgLy8gICAgICAgdGlja2V0QXNzZXQsCiAgICAvLyAgICAgICBzdGFydFRpbWVzdGFtcCwKICAgIC8vICAgICAgIGVuZFRpbWVzdGFtcCwKICAgIC8vICAgICAgIFR4bi5zZW5kZXIsCiAgICAvLyAgICAgICB7IGFjY291bnQ6IHBheW1lbnQuc2VuZGVyLCBhbW91bnQ6IHRvdGFsTUJSIH0sCiAgICAvLyAgICAgICBjcmVhdG9yUm95YWx0eSwKICAgIC8vICAgICAgIG1pblRpY2tldHMsCiAgICAvLyAgICAgICBtYXhUaWNrZXRzLAogICAgLy8gICAgICAgZ2F0ZUlELAogICAgLy8gICAgICAgbWFya2V0cGxhY2UsCiAgICAvLyAgICAgICB0aGlzLmFraXRhREFPLnZhbHVlLAogICAgLy8gICAgICAgdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZSwKICAgIC8vICAgICBdLAogICAgLy8gICB9KQogICAgLy8gICAuaXR4bgogICAgLy8gICAuY3JlYXRlZEFwcAogICAgZ2l0eG4gMCBDcmVhdGVkQXBwbGljYXRpb25JRAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjExMy0xMTgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLm1pbkJhbGFuY2UKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMTUKICAgIC8vIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTE2CiAgICAvLyBhbW91bnQ6IEdsb2JhbC5taW5CYWxhbmNlCiAgICBnbG9iYWwgTWluQmFsYW5jZQogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjExMy0xMTcKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLm1pbkJhbGFuY2UKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjExMy0xMTgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogR2xvYmFsLm1pbkJhbGFuY2UKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTIwCiAgICAvLyBpZiAoIWlzQWxnb1RpY2tldCkgewogICAgZnJhbWVfZGlnIC05CiAgICBieiBjcmVhdGVDaGlsZEFwcF9hZnRlcl9pZl9lbHNlQDExCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMjEtMTMwCiAgICAvLyByYWZmbGUuY2FsbC5vcHRpbih7CiAgICAvLyAgIGFwcElkLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgdGlja2V0QXNzZXQsCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTI1CiAgICAvLyByZWNlaXZlcjogYXBwSWQuYWRkcmVzcywKICAgIGZyYW1lX2RpZyAxCiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjEyNgogICAgLy8gYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMjQtMTI3CiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICByZWNlaXZlcjogYXBwSWQuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyB9KSwKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjEyMS0xMzAKICAgIC8vIHJhZmZsZS5jYWxsLm9wdGluKHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IGFwcElkLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSwKICAgIC8vICAgICB9KSwKICAgIC8vICAgICB0aWNrZXRBc3NldCwKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIGJ5dGVjIDggLy8gbWV0aG9kICJvcHRpbihwYXksdWludDY0KXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIDAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBPbkNvbXBsZXRpb24KICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKCmNyZWF0ZUNoaWxkQXBwX2FmdGVyX2lmX2Vsc2VAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMzMtMTQyCiAgICAvLyByYWZmbGUuY2FsbC5pbml0KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IGFwcElkLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IHdlaWdodHNNQlIsCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgd2VpZ2h0c0xpc3RDb3VudCwKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMzcKICAgIC8vIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgZnJhbWVfZGlnIDEKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZnJhbWVfZGlnIDIKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMzYtMTM5CiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICByZWNlaXZlcjogYXBwSWQuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiB3ZWlnaHRzTUJSLAogICAgLy8gfSksCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvcmFmZmxlL2ZhY3RvcnkuYWxnby50czoxMzMtMTQyCiAgICAvLyByYWZmbGUuY2FsbC5pbml0KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IGFwcElkLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IHdlaWdodHNNQlIsCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgd2VpZ2h0c0xpc3RDb3VudCwKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE0MAogICAgLy8gd2VpZ2h0c0xpc3RDb3VudCwKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3JhZmZsZS9mYWN0b3J5LmFsZ28udHM6MTMzLTE0MgogICAgLy8gcmFmZmxlLmNhbGwuaW5pdCh7CiAgICAvLyAgIGFwcElkLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBhcHBJZC5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiB3ZWlnaHRzTUJSLAogICAgLy8gICAgIH0pLAogICAgLy8gICAgIHdlaWdodHNMaXN0Q291bnQsCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgcHVzaGJ5dGVzIDB4YmQ3MTQ4ZDAgLy8gbWV0aG9kICJpbml0KHBheSx1aW50NjQpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgT25Db21wbGV0aW9uCiAgICBkdXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9yYWZmbGUvZmFjdG9yeS5hbGdvLnRzOjE0NAogICAgLy8gcmV0dXJuIGFwcElkCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1Ygo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAFAAEIAtCGAyYKCWFraXRhX2RhbwJiYwxha2l0YV9lc2Nyb3cGd2FsbGV0BBUffHUExTsyzAd2ZXJzaW9uFmNoaWxkX2NvbnRyYWN0X3ZlcnNpb24EPqEYMgNhYWyABOqRgN02GgCOAQCVMRkURDEYQQB+ggMEGFhPIAQpJFZeBJHdPHUnBYIIBNyi2GIE00axpAQ5Tq6yBDP3iAgEHq0gqQQz6SyUBIVN7eAE2aNfpDYaAI4MALACQAL7A0YDiwP3BAoEVwR/BNAAIgABAIAcFR98dQAAAAAAAHvUAAAAAADIF9QAAAAAAABJ1LAjQyNDgATEJvS6NhoAjgEAOgAxGYEEEjEYEERCBF2KAwEii/6L/3AARQFAABqL/YAOcmV2ZW51ZV9zcGxpdHNlSCJZIwiMAIsATIk2GgFJIlklCEsBFRJEVwIANhoCSSJZJQhLARUSRFcCADYaA0kVJBJEFzYaBEkVJBJEFycGTwRnJwdPA2coTwJnKkxnI0MiMRYlCUk4ECMSRDEWIwlJOBCBBBJENhoBSRUkEkQXTDYaAkkVJBJEF0w2GgNJFSQSRBdMNhoESRUkEkQXTDYaBUkVJBJEF0w2GgZJFSQSRBdMNhoHSU4CFYEgEkQ2GghJTgJJIlklCEwVEkQ2GglJTgJJIllJgSALJQhPAhUSRDYaCkkVJBJEF04CSwE4FDIKEksCOBJJTgQQRCIoZUxOA0RMOBFMIkxAAGqBiCdFASJLD0sDSU4DSxFLEUsRSwdLEksSSxJLEksQiANvsUlyCEQyELIIsgcjshAisgG2SwEWJwiyGrIaIrIZSbIYgQayECKyAbOxSXIIRE8CshFLBbISshSBBLIQIrIBsxYnBExQsCNDsUsCJwllSIFIW0sCSXELREwWAQEjFoAEDPG5z7IaTwKyGksJshpMshpLB7IashqACQAHcm95YWx0ebIashiBBrIQIrIBs7Q+SVcEAEsBVwAEJwQSREkiWSUITBUSRFcGAElFERVBAAVLDxdFAUkhBA1B/ychBEUBQv8gMRYjCUk4ECMSRDYaAUkVJBJEFzYaAkkVJBJEFzYaA0kVJBJEFzYaBEkVJBJEFzYaBUkVJBJEFzYaBkkVJBJEFzYaB0kVJBJEFzYaCEkVgSASRDYaCUkVJBJEFyIoZURLCXIHREwnCWVIgRhbcghEEkRLCIAFb3duZXJlSDIKEkQjTwpLCk8KTwpPCiJPC08LTwtPC08LiAITsUlyCESABK35KuSyGrIaTLIYgQayECKyAbMWJwRMULAjQzYaAUkVJBJEF0lyB0QyChJESYAGZnVuZGVyZUhJVwAgTIEgW7GABCSHwyyyGoEFshlPArIYgQayECKyAbOxsgiyByOyECKyAbMjQzYaAUkiWSUISwEVEkRXAgA2GgJJFSQSRBdMJwdMZym9RQFAAAwxADIJEkQpTLlII0MxACIoZUQrZUhyCEQSRClM00L/6jYaAUkVJBJEF0k2GgJJIlklCEsBFRJEVwIATIHwDwoxFkwJIwlJOBCBBhJBADpJOBgyCBJBADFJOBuBAxJBAChJOBlAACJJIsIaJwUSQQAYSTgAMQASQQAPI0QpvUUBRClLA0sDuyNDIkL/7jEAIihlRCtlSHIIRBJEKbxII0MxFiMJSTgQIxJENhoBSRUkEkQXIihlRCIqZURyCERLAoj8EUsCOAcyChJPAzgIMhAjTwQICxIQRLEyCkyyESKyErIUgQSyECKyAbMjQzYaAUkVJBJEFyIoZUQiKmVEcghETwKI+84yECNPAggLFicETFCwI0M2GgFJFSQSRBcxACIoZUQrZUhyCEQSRCpMZyNDNhoBSSJZJQhLARUSRFcCADEAIihlREkrZUhyCERPAhJEgANwYWxlSIEQWzINEkQnBkxnI0M2GgFJFSQSRBcxACIoZUQrZUhyCEQSRChMZyNDigwBIoAASSKL9hSL9BFAAAQyEIwDi/dBAAeLAzIQCIwDMgGLAwiL/4HUr6AGC0lOAowCIihlREmACG5mdF9mZWVzZUiBWFtJgeStVQhPAwhPAwiL9TgHMgoSi/U4CEsCEhBEsSIqZURJcghETwOyCLIHI7IQIrIBs7GL9haAAQAii/RUi/cWSYwAi/gWi/kWMQCL9TgATwgWUIv6Fov7Fov8Fov9Fk8MFk8MFoAE4i4DkrIaTwyyGk8LshpPCrIaTwmyGk8IshpPB7IaTwayGk8FshpPBLIaTwOyGk8CshqL/rIaTLIasholsjgksjWBFbI0gAQLgQFDskKAgCALIA0AAQgEgCCgjQat/tXk1IX9qFioiwPPgp677+/eghTRgp677+/eghT/////D9SvoAb///////////8BJiMMdGlja2V0X2Fzc2V0CWFraXRhX2Rhbwx0aWNrZXRfY291bnQLZW50cnlfY291bnQGd2lubmVyBBUffHUFcHJpemUId190b3RhbHMBYQ53aW5uaW5nX3RpY2tldAdnYXRlX2lkDGFraXRhX2VzY3JvdxF3ZWlnaHRzX2JveF9jb3VudAZzZWxsZXIBdwttYXhfdGlja2V0cw1wcml6ZV9jbGFpbWVkEXJlZnVuZF9tYnJfY3Vyc29yDWVuZF90aW1lc3RhbXALbWFya2V0cGxhY2URdnJmX2ZhaWx1cmVfY291bnQBZQZ3YWxsZXQVbWFya2V0cGxhY2Vfcm95YWx0aWVzA29hbAxpc19wcml6ZV9ib3gPc3RhcnRfdGltZXN0YW1wDWFraXRhX3JveWFsdHkTZmluZF93aW5uZXJfY3Vyc29ycw9jcmVhdG9yX3JveWFsdHkDBoEBC21pbl90aWNrZXRzCGVudHJ5X2lkAgAAA3BhbIICBCSHwywE6pGA3TYaAI4CAMsAwDEZFEQxGEEAqYISBL1xSNAE8s4vRgQslCUUBJc5y7YE46IdUgQFSjAgBGO7tzUESCEhwwRpZQHeBL0bJ9EEZfypiwSPpKFgBJ5XJvEEHq0gqQQz6SyUBIVN7eAE2aNfpAQ+oRgyNhoAjhIEOQSUBQ0FfgZFByoH1QfpCHIKUgtxEBAQIRC1EQ4AIgABESsAgBwVH3x1AAAAAAAAe9QAAAAAAMgX1AAAAAAAAEnUsCNDI0OABOIuA5I2GgCOAQJYADEZJRIxGBBEQhCWMRmBBRIxGBBEQgUVigIAi/6BCgiLADIMDUEAKrGBBrIQgQWyGScesh4nHrIfi/+NAgALAASzQv/bMgCyAUL/9SKyAUL/74mKAQGL/4ESkYv/G4EbkSEKGov/gTuRSpFMHCMeRQGBHxpPAkyQIQoaGYmKAQExAIv/QAAEiwBMiYv/gBJjb250cm9sbGVkX2FkZHJlc3NlSEL/44oCAYv+JxhlSIEYW7GABDwabzOyGov/shqyGIEGshAisgGztD5JVwQASwFXAAQnBRJESSJZgQIITBUSRFcGAEkVSUEAB4sBJBNBAAQijACJiwAXQv/3igQCsYv8gANhYWxlSIEoW4v+FoAEIA90IbIai/2yGrIai/+yGrIYgQayECKyAbO0PklXBABMVwAEJwUSREkVIxJEIlOL/4mKBQCAAEcCIov7JxhlSIEQW0cCcghMTgJEsYv9FklOAoAEyqjapbIai/yyGrIashiBBrIQIrIBs7Q+SVcEAEsBVwAEJwUSREkVgRkSREsBgQxbSU4CTgOBgAFTTgJLAVcVCE4CTIEVW0xAAAWLCkEAE7GLB4sKCLIIiwWyByOyECKyAbOLCEAAGbGABOhUCBCyGosGshqLBLIYgQayECKyAbMjjAIjjAAijAGL/0EADSOMASKMACKMAosFjAOxiwFBAASLA7IVi/2yEYsAQQAEi/6yEosCQQAEiwWyFCWyECKyAbaABAhTHteyGov8shqLCbIaiwSyGIEGshAisgGztwE+SVcEAExXAAQnBRJEFYEgEkSJgABHAjYaAUkVJBJEFzYaAkkVIxJEIlM2GgNJFSQSRBdJTgM2GgRJFSQSRBdOAzYaBUkVJBJEF04DNhoGSU4EFYEgEkQ2GgdJTgQVgSgSRDYaCBUkEkQ2GglJFSQSRBdOAzYaCkkVJBJEF04DNhoLSRUkEkQXTgM2GgxJTgQVgSASRDYaDUkVJBJEF04DNhoOSRUkEkQXTgMyDUQnBk8DZycZTwJnQQAGSwpxAEREKEsLZycaSwpJTgJnSwkMQQDsSwgyBw1BAOQjRCcSSwlnJw1LCGeABmZ1bmRlcksHZycfSwZnJw9LBWcrImcqImcnCSJnJwQyA2cnECJnJwpLBGcnE0sDZylLAmcnC0sBZyIpZUSACG5mdF9mZWVzZUhJgXBbJxdMZyIpZUQiJw1lRLFMgANzYWxlSIEQW4AE1XS7ELIashiyGoEGshAisgGztD5JVwQATFcABCcFEkRJFSQSRBdJRRBLAYFgW0UOTIFoW0UOIw1BAC9LDSMJSw1JSw4JTwILgegHCgknG0xnJyAiZycMImeBeK8nB0xnJxEiZycUImcjQyNC/9EiQv8ZMRYjCUk4ECMSRDYaAUkVJBJEF0lOAjEAMgkSREklD0RJgRAMREkhCwtLAjgHMgoSTwM4CE8CEhBEJwxMZyJJSwIMQQAURwIWJw5MUIGAgAK5SCMIRQFC/+UjQzYaAUkVJBJEFyIrZUQjCSInBGVEMgMTRCInEWVEShNETEsBCUlLAw1MTwNPAk1JTgKBZAsiiPt9SUsCDEEALEcCFicVTFBJvkRXACBMvEgnCEsBULxIsbIHIQeyCCOyECKyAbMjCEUBQv/NIicRZURLAggnEUxnI0MiJxBlREQiIicMZURLAQ1BABsiJwxlRCMJSwFJTgIJFicOTFC8SCMIRQFC/9oiJwxlRCELC7EyCUsBsgiyByOyECKyAbMnDCJnFicFTFCwI0MxADIJEkQiJxBlREQiK2VEIwkiJxFlRBNEIicMZUQUQzEWIwlJOBAjEkQ2GgFJFYEgEkQ2GgKIC9FEIihlRBREIicKZURBAB8iKWVEMQCI+yiI+vwiKWVEIicKZURMTgJLA4j7akhEJwgxAFC9RQEUREsCSTgHMgoSTDgIIicPZUQhBwhLAQ9PAhBEIitlRDEASwRQSwEWJxVLAVBPAr8nCDEAUEy/TCEHCUkWSwIhBApJFicOTFBPBCEEGCQLTwO7IicHZURMJAtKW0sDCBZdJwdMZyIrZUQjCCtMZyIqZUQIKkxnI0MxFoECCUk4ECMSRDEWIwlJOBAlEkQ2GgFJFYEgEkQ2GgKICv9EIihlREQiJwplREEAHyIpZUQxAIj6V4j6KyIpZUQiJwplRExOAksDiPqZSEQnCDEAUL1FARRESwNJOAcyChJMOAghBxIQREsCSTgUMgoSSwE4ESIoZUQSEEw4EiInD2VESwEPTwIQRCIrZUQxAEsEUEsBFicVSwFQTwK/JwgxAFBMv0sBFksBIQQKSRYnDkxQTwMhBBgkC08DuyInB2VETCQLSltLAwgWXScHTGciK2VEIwgrTGciKmVECCpMZyNDMRYjCUk4ECMSRDYaAYgKLkQiKGVEFEQiJwplREEAHyIpZUQxAIj5hYj5WSIpZUQiJwplRExOAksDiPnHSEQnCDEAUL1FAUQnCDEAUL5EF0khBApJFicOTFBPAiEEGCQLSiS6SwVJOAcyChJMOAgiJw9lRE8DF0xLAQlLAg9PAxBESUsCCBZPBE8ETwK7IicHZURPAyQLSltPBAgWXScHTGciKmVECCpMZyNDMRaBAgk4EIEGEkQxFiMJOBAlEkMxFiMJSTgQJRJEiAlyRCIoZURJRCcIMQBQvUUBRCcIMQBQvkQXSSEECkkWJw5MUE8CIQQYJAtKJLpLBTgUMgoSSwY4EU8GEhBPBTgSIicPZURPAxdMSwEJSwIPTwMQRElLAggWTwRPBE8CuyInB2VETwMkC0pbTwQIFl0nB0xnIiplRAgqTGcjQyJHAoAARwciJxJlRCMIIicUZUQlCwgyBksBJAgPRCInCWVEFESxIillRCcYZUgiW0wWIoAEc2FsdGVESRUWVwYCTFCABBiTksWyGkyyGrIashiBBrIQIrIBs7Q+SVcEAEsBVwAEJwUSREkiWYECCEwVEkRXBgBJFUlAAA0iJxRlRCMIJxRMZyNDIksBSU4CDyJLAk8CTYEQSwIPgRBPA08CTUsDTgJSSRWBEBJESSJbIiEGHUUBSSEIHkUBTwIeRQEhBh1FASEIHk4CSE8CJFtMIQkeRQEeRQEhBh1FASEJHkUBTBZMFlBFDCIqZUxJTgJFBUQhDAxBAAZLAiMIRQMnIUUNSwJBANBLAkkjDUQjCUlFCyMNREsJSRwjHkUBTBhFBCJFB0sLRQtLBiMMQQCMSwpJIltJRQchBh1FASEIHklOAkUMSEwkW0UHQABpgaKFvPbe372FKEsGSSEGHUUBTwIeRQFLChZMFlBLBoj2oYEgkE8CiPaZGRZQSVcAEEyBEFtJRQpLBQ9BACZLCEsLGCMIFksOSU8CUEwiWSMIFlcGAlwARQ5LByMIRQhFC0L/d0ULQv95IQlC/5xLCoACABJQSw1QSYEQWUsBFVKBAlsnCUxnQv6uIQxFCkL/NyKAAEk2GgFJFSQSRBcyByInEmVEDUQiJwllREQiJwRlRDIDEkQiJxxlREkiW0wkWyIiJwxlREsBDUEA2SInB2VESwEkC1tJRQciJwllREsDTwIIDEEApksCFksCFlBJIltJTgJFBSRbRQMiK2VESwEJSUsGSU4DDUxOAk1JTgJFBiEEChYnDkxQRQiBKAsiiPVlIkUBSUsEDEEASEkkC0sHTCS6F0sCSU8CCEUGIicJZUQOQQAgIicJZURLBQ5BABVLAksBCCMIFicVTFC+RFcAICcETGdLBCMIRQJJIwhFAUL/sSInHGVESSJbSwUIFlwASwIWXAgnHExnI0NLAiEECEUDSwUjCEsCCEUCSSMIRQFC/xxLAhZLAhZQQv8/IkmAAEcLIicEZUQyAxNEIicQZUQURCInGWVEQQQ1sSInBmVEIicEZUSABK35KuSyGrIashiBBrIQIrIBsyIqZUxFC0QiJxllRCJFCEAALiInHWVEQQAmIicdZURJIQUOREsKHSEFl0lFCEAAECInHWVEQQAISwlBAAMjRQciRQwiJxtlREEAHiInG2VESSEFDkRLCh0hBZdJRQ1AAAhLCUEAAyNFDCJFBiInF2VEQQAmIicXZURJIQUOREsKHSEFl0lFB0AAECInF2VEQQAISwlBAAMjRQZLBklLDUlOAwiBAksJSU4FCwhLDUwJTBZPAhZQTwIWUEwWUEUOIicEZUQnCExQvkQXFicVTFC+RFcgIEUNIihlREAAfEsNIltJRQRBABaxIicGZURxC0RLA7IIsgcjshAisgGzsSInC2VEcghESw5JTgIkW7IIsgcjshAisgGzsSInE2VESwGBEFtJsghMsgcjshAisgGzsbIISw2yByOyECKyAbOxIicNZURMgRhbsgiyByOyECKyAbMnECNnI0NLDSJbSUUDQQAvIicGZURxC0QiKGVEcABFAUEChrEiJwZlRHELRCIoZUSyEUsCshKyFCWyECKyAbMiJwtlRHIIRCIoZURwAEUBQQDvsSInC2VEcghESw4kWyIoZUSyEbISshQlshAisgGzIicTZUQiKGVEcABFAUEAqLEiJxNlREsOgRBbIihlRLIRshKyFCWyECKyAbMiKGVESw1McABFskCA2gcBQQBisUsNgRBbIihlRLIRshJLDLIUJbIQIrIBsyInDWVEIihlRHAARQFBACGxIicNZUQiKmVEIihlRLIRshJJshWyFCWyECKyAbNC/wwiKWVEIicNZUQiKGVEIiplRCOI82lC/vQiKWVEIihlREsPgRBbTwJLD08DTwMiiPNNQv+bIillRCInE2VEIihlREsQgRBbIojzNEL/WyIoZUxJTgJFC0RLDiRbRQsiKWVMSU4CRQ5ESScWZUhJTgJFBEknImVISVcICEwkW0UITCcWZUixgASiQD3fshqAEQABAAIAC3Jldl9yYWZmbGVzshqyGIEGshAisgGztD5JVwQASwFXAAQnBRJESSJZgQkLgQIITBUSRFcGCSJbSUQiJwtlRExLARJEsYAEWC/zgrIaTLIagAGAshqADQALcmV2X3JhZmZsZXOyGoAKAAEAAAAAAAAAALIaJyGyGkyyGIEGshAisgFyCEQiRQpMcABFAUAAGksKgA5yZXZlbnVlX3NwbGl0c2VIIlkjCEUIMhBLCAu2IicLZURyCESyB7III7IQIrIBtkcCFksKFoACAAFMUIAEaDXjvLIaTLIagAGAshqyGksEshiBBrIQIrIBtoAEbMP2BrIashiBBrIQIrIBSwlBABm2IicLZURyCERLCbIRSwqyErIUJbIQIrIBs0L9xyIpZUQiJwZlRHELRCIoZURLBCKI8bNC/X0yCiInBmVETEsBcABIRQYiJwRlRExwAEUBQQAZsSInBGVEIicGZUSyEbIVJbIQIrIBs0L7tSIpZUQiJwRlRCInBmVESwcjiPFnQvueiAFVgAEAIk8CVCcFTFCwI0MiKGVEIicaZUQiJxJlRCInDWVEIicfZUQiJw9lRCIrZUQiKmVEIicJZUQiJwRlRCInBmVEIicQZUQiJwplRCInFGVEIicgZUQiJxFlRE8PFk8PFlBPDhZQTw1QTwwWUE8LFlBPChZQTwkWUE8IFlBPB1BPBhZQgAEAIk8HVFBPBBZQTwMWUE8CFlBMFlAnBUxQsCNDNhoBSRUkEkQXMQAiKWVEJxZlSHIIRBJEJwtMZyNDNhoBSSJZgQIISwEVEkRXAgAxACIpZURJJxZlSHIIRE8CEkQnImVIgRBbMg0SRIAHdmVyc2lvbkxnI0M2GgFJFSQSRBcxACIpZUQnFmVIcghEEkQpTGcjQzEWIwlJOBAjEkQ2GgFJFSQSRBcxADIJEkRLATgHMgoSTwI4CDIQEhBEsTIKTLIRIrISshQlshAisgGzI0MyByInGmVED0EADTIHIicSZUQOQQACI4kiibJAIrIZgQayECKyAbO3AD1JjAGxcghEMgGyCLIHI7IQIrIBs4v3QQApsYsBSXIIRDIQsgiyByOyECKyAbYnCLIaiwCyGiKyGbIYgQayECKyAbOxiwFJcghEiwKyCLIHI7IQIrIBtov/FoAEvXFI0LIashoishlJshiBBrIQIrIBs4wAiQ==", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var BinaryStateValue2 = class {
  constructor(value) {
    this.value = value;
  }
  asByteArray() {
    return this.value;
  }
  asString() {
    return this.value !== void 0 ? Buffer.from(this.value).toString("utf-8") : void 0;
  }
};
var RaffleFactoryParamsFactory = class _RaffleFactoryParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(string,string,uint64,uint64)void":
            return _RaffleFactoryParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the RaffleFactory smart contract using the create(string,string,uint64,uint64)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(string,string,uint64,uint64)void",
          args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.childVersion, params.args.akitaDao, params.args.akitaDaoEscrow]
        };
      }
    };
  }
  /**
   * Gets available update ABI call param factories
   */
  static get update() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "update":
          case "update(string)void":
            return _RaffleFactoryParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the RaffleFactory smart contract using the update(string)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      update(params) {
        return {
          ...params,
          method: "update(string)void",
          args: Array.isArray(params.args) ? params.args : [params.args.newVersion]
        };
      }
    };
  }
  /**
   * Constructs a no op call for the newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static newRaffle(params) {
    return {
      ...params,
      method: "newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.assetXfer, params.args.ticketAsset, params.args.startTimestamp, params.args.endTimestamp, params.args.minTickets, params.args.maxTickets, params.args.gateId, params.args.marketplace, params.args.name, params.args.proof, params.args.weightsListCount]
    };
  }
  /**
   * Constructs a no op call for the newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static newPrizeBoxRaffle(params) {
    return {
      ...params,
      method: "newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.prizeBox, params.args.ticketAsset, params.args.startTimestamp, params.args.endTimestamp, params.args.minTickets, params.args.maxTickets, params.args.gateId, params.args.marketplace, params.args.weightsListCount]
    };
  }
  /**
   * Constructs a no op call for the deleteRaffle(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static deleteRaffle(params) {
    return {
      ...params,
      method: "deleteRaffle(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.appId]
    };
  }
  /**
   * Constructs a no op call for the initBoxedContract(string,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static initBoxedContract(params) {
    return {
      ...params,
      method: "initBoxedContract(string,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.size]
    };
  }
  /**
   * Constructs a no op call for the loadBoxedContract(uint64,byte[])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static loadBoxedContract(params) {
    return {
      ...params,
      method: "loadBoxedContract(uint64,byte[])void",
      args: Array.isArray(params.args) ? params.args : [params.args.offset, params.args.data]
    };
  }
  /**
   * Constructs a no op call for the deleteBoxedContract()void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static deleteBoxedContract(params) {
    return {
      ...params,
      method: "deleteBoxedContract()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the optIn(pay,uint64)void ABI method
   *
   * optin tells the contract to opt into an asa
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static optIn(params) {
    return {
      ...params,
      method: "optIn(pay,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.asset]
    };
  }
  /**
   * Constructs a no op call for the optInCost(uint64)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static optInCost(params) {
    return {
      ...params,
      method: "optInCost(uint64)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.asset]
    };
  }
  /**
   * Constructs a no op call for the updateAkitaDAOEscrow(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateAkitaDaoEscrow(params) {
    return {
      ...params,
      method: "updateAkitaDAOEscrow(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.app]
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
      method: "updateAkitaDAO(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.akitaDao]
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
      method: "opUp()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the mbr()(uint64,uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static mbr(params) {
    return {
      ...params,
      method: "mbr()(uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
};
var RaffleFactoryFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `RaffleFactoryFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory2({
      ...params,
      appSpec: APP_SPEC2
    });
  }
  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  get appName() {
    return this.appFactory.appName;
  }
  /** The ARC-56 app spec being used */
  get appSpec() {
    return APP_SPEC2;
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
    return new RaffleFactoryClient(this.appFactory.getAppClientById(params));
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
    return new RaffleFactoryClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the RaffleFactory smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? RaffleFactoryParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? RaffleFactoryParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0
    });
    return { result: result.result, appClient: new RaffleFactoryClient(result.appClient) };
  }
  /**
   * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the RaffleFactory smart contract using the create(string,string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(RaffleFactoryParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the RaffleFactory smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(RaffleFactoryParamsFactory.update.update(params));
      }
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the RaffleFactory smart contract using the create(string,string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(RaffleFactoryParamsFactory.create.create(params));
      }
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the RaffleFactory smart contract using an ABI method call using the create(string,string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(RaffleFactoryParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new RaffleFactoryClient(result.appClient) };
      }
    }
  };
};
var RaffleFactoryClient = class _RaffleFactoryClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient2 ? appClientOrParams : new _AppClient2({
      ...appClientOrParams,
      appSpec: APP_SPEC2
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? getArc56ReturnValue2(returnValue, this.appClient.getABIMethod(method), APP_SPEC2.structs) : void 0;
  }
  /**
   * Returns a new `RaffleFactoryClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _RaffleFactoryClient(await _AppClient2.fromCreatorAndName({ ...params, appSpec: APP_SPEC2 }));
  }
  /**
   * Returns an `RaffleFactoryClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _RaffleFactoryClient(await _AppClient2.fromNetwork({ ...params, appSpec: APP_SPEC2 }));
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
   * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  params = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the RaffleFactory smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(RaffleFactoryParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the RaffleFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    newRaffle: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.newRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    newPrizeBoxRaffle: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.newPrizeBoxRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteRaffle(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    deleteRaffle: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.deleteRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `initBoxedContract(string,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    initBoxedContract: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.initBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `loadBoxedContract(uint64,byte[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    loadBoxedContract: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.loadBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteBoxedContract()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    deleteBoxedContract: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.deleteBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optIn(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    optIn: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.optIn(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optInCost(uint64)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    optInCost: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.optInCost(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.opUp(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mbr: (params = { args: [] }) => {
      return this.appClient.params.call(RaffleFactoryParamsFactory.mbr(params));
    }
  };
  /**
   * Create transactions for the current app
   */
  createTransaction = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the RaffleFactory smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(RaffleFactoryParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the RaffleFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    newRaffle: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.newRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    newPrizeBoxRaffle: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.newPrizeBoxRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteRaffle(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    deleteRaffle: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.deleteRaffle(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `initBoxedContract(string,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    initBoxedContract: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.initBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `loadBoxedContract(uint64,byte[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    loadBoxedContract: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.loadBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteBoxedContract()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    deleteBoxedContract: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.deleteBoxedContract(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optIn(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    optIn: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.optIn(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optInCost(uint64)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    optInCost: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.optInCost(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.opUp(params));
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mbr: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(RaffleFactoryParamsFactory.mbr(params));
    }
  };
  /**
   * Send calls to the current app
   */
  send = {
    /**
     * Gets available update methods
     */
    update: {
      /**
       * Updates an existing instance of the RaffleFactory smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(RaffleFactoryParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the RaffleFactory smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    newRaffle: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.newRaffle(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    newPrizeBoxRaffle: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.newPrizeBoxRaffle(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteRaffle(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    deleteRaffle: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.deleteRaffle(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `initBoxedContract(string,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    initBoxedContract: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.initBoxedContract(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `loadBoxedContract(uint64,byte[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    loadBoxedContract: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.loadBoxedContract(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `deleteBoxedContract()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    deleteBoxedContract: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.deleteBoxedContract(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optIn(pay,uint64)void` ABI method.
     *
     * optin tells the contract to opt into an asa
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    optIn: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.optIn(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `optInCost(uint64)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    optInCost: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.optInCost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDaoEscrow: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.updateAkitaDaoEscrow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.updateAkitaDao(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    opUp: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.opUp(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the RaffleFactory smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mbr: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(RaffleFactoryParamsFactory.mbr(params));
      return { ...result, return: result.return };
    }
  };
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _RaffleFactoryClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the RaffleFactory smart contract using the `optInCost(uint64)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async optInCost(params) {
    const result = await this.appClient.send.call(RaffleFactoryParamsFactory.optInCost(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the RaffleFactory smart contract using the `mbr()(uint64,uint64,uint64)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async mbr(params = { args: [] }) {
    const result = await this.appClient.send.call(RaffleFactoryParamsFactory.mbr(params));
    return result.return;
  }
  /**
   * Methods to access state for the current RaffleFactory app
   */
  state = {
    /**
     * Methods to access global state for the current RaffleFactory app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          childContractVersion: result.childContractVersion,
          akitaDaoEscrow: result.akitaDAOEscrow,
          version: result.version,
          akitaDao: result.akitaDAO
        };
      },
      /**
       * Get the current value of the childContractVersion key in global state
       */
      childContractVersion: async () => {
        return await this.appClient.state.global.getValue("childContractVersion");
      },
      /**
       * Get the current value of the akitaDAOEscrow key in global state
       */
      akitaDaoEscrow: async () => {
        return await this.appClient.state.global.getValue("akitaDAOEscrow");
      },
      /**
       * Get the current value of the version key in global state
       */
      version: async () => {
        return await this.appClient.state.global.getValue("version");
      },
      /**
       * Get the current value of the akitaDAO key in global state
       */
      akitaDao: async () => {
        return await this.appClient.state.global.getValue("akitaDAO");
      }
    },
    /**
     * Methods to access box state for the current RaffleFactory app
     */
    box: {
      /**
       * Get all current keyed values from box state
       */
      getAll: async () => {
        const result = await this.appClient.state.box.getAll();
        return {
          boxedContract: new BinaryStateValue2(result.boxedContract)
        };
      },
      /**
       * Get the current value of the boxedContract key in box state
       */
      boxedContract: async () => {
        return new BinaryStateValue2(await this.appClient.state.box.getValue("boxedContract"));
      }
    }
  };
  newGroup() {
    const client = this;
    const composer = this.algorand.newGroup();
    let promiseChain = Promise.resolve();
    const resultMappers = [];
    return {
      /**
       * Add a newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64 method call against the RaffleFactory contract
       */
      newRaffle(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.newRaffle(params)));
        resultMappers.push((v) => client.decodeReturnValue("newRaffle(pay,axfer,uint64,uint64,uint64,uint64,uint64,uint64,address,string,byte[32][],uint64)uint64", v));
        return this;
      },
      /**
       * Add a newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64 method call against the RaffleFactory contract
       */
      newPrizeBoxRaffle(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.newPrizeBoxRaffle(params)));
        resultMappers.push((v) => client.decodeReturnValue("newPrizeBoxRaffle(pay,uint64,uint64,uint64,uint64,uint64,uint64,uint64,address,uint64)uint64", v));
        return this;
      },
      /**
       * Add a deleteRaffle(uint64)void method call against the RaffleFactory contract
       */
      deleteRaffle(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteRaffle(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a initBoxedContract(string,uint64)void method call against the RaffleFactory contract
       */
      initBoxedContract(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.initBoxedContract(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a loadBoxedContract(uint64,byte[])void method call against the RaffleFactory contract
       */
      loadBoxedContract(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.loadBoxedContract(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a deleteBoxedContract()void method call against the RaffleFactory contract
       */
      deleteBoxedContract(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteBoxedContract(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a optIn(pay,uint64)void method call against the RaffleFactory contract
       */
      optIn(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.optIn(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a optInCost(uint64)uint64 method call against the RaffleFactory contract
       */
      optInCost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.optInCost(params)));
        resultMappers.push((v) => client.decodeReturnValue("optInCost(uint64)uint64", v));
        return this;
      },
      /**
       * Add a updateAkitaDAOEscrow(uint64)void method call against the RaffleFactory contract
       */
      updateAkitaDaoEscrow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDaoEscrow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the RaffleFactory contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a opUp()void method call against the RaffleFactory contract
       */
      opUp(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a mbr()(uint64,uint64,uint64) method call against the RaffleFactory contract
       */
      mbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("mbr()(uint64,uint64,uint64)", v));
        return this;
      },
      get update() {
        return {
          update: (params) => {
            promiseChain = promiseChain.then(async () => composer.addAppUpdateMethodCall(await client.params.update.update(params)));
            resultMappers.push(void 0);
            return this;
          }
        };
      },
      /**
       * Add a clear state call to the RaffleFactory contract
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
        var _a;
        await promiseChain;
        const result = await (!options ? composer.simulate() : composer.simulate(options));
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      },
      async send(params) {
        var _a;
        await promiseChain;
        const result = await composer.send(params);
        return {
          ...result,
          returns: (_a = result.returns) == null ? void 0 : _a.map((val, i) => resultMappers[i] !== void 0 ? resultMappers[i](val) : val.returnValue)
        };
      }
    };
  }
};

// src/raffle/factory.ts
var RaffleFactorySDK = class extends BaseSDK {
  constructor(params) {
    super({ factory: RaffleFactoryFactory, ...params }, ENV_VAR_NAMES.RAFFLE_FACTORY_APP_ID);
  }
  /**
   * Creates a new raffle with an ASA prize and returns a RaffleSDK instance.
   * @returns RaffleSDK for the newly created raffle
   */
  async newRaffle({
    sender,
    signer,
    prizeAsset,
    prizeAmount,
    ticketAsset,
    startTimestamp,
    endTimestamp,
    minTickets,
    maxTickets,
    gateId,
    marketplace,
    name,
    proof,
    weightsListCount
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const isAlgoTicket = BigInt(ticketAsset) === 0n;
    const cost = this.cost({ isPrizeBox: false, isAlgoTicket, weightsListCount });
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress
    });
    const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: BigInt(prizeAmount),
      assetId: BigInt(prizeAsset),
      receiver: this.client.appAddress
    });
    const needsOpUp = BigInt(weightsListCount) > 0n;
    let appId;
    if (needsOpUp) {
      const group = this.client.newGroup();
      group.newRaffle({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          minTickets,
          maxTickets,
          gateId,
          marketplace,
          name,
          proof,
          weightsListCount
        }
      });
      for (let i = 0; i < 10; i++) {
        group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : void 0 });
      }
      const result = await group.send(sendParams);
      appId = result.returns[0];
    } else {
      ({ return: appId } = await this.client.send.newRaffle({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          ticketAsset,
          startTimestamp,
          endTimestamp,
          minTickets,
          maxTickets,
          gateId,
          marketplace,
          name,
          proof,
          weightsListCount
        }
      }));
    }
    if (appId === void 0) {
      throw new Error("Failed to create new raffle");
    }
    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    });
  }
  /**
   * Creates a new raffle with a PrizeBox as the prize.
   * @returns RaffleSDK for the newly created raffle
   */
  async newPrizeBoxRaffle({
    sender,
    signer,
    prizeBox,
    ticketAsset,
    startTimestamp,
    endTimestamp,
    minTickets,
    maxTickets,
    gateId,
    marketplace,
    weightsListCount
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const isAlgoTicket = BigInt(ticketAsset) === 0n;
    const cost = this.cost({ isPrizeBox: true, isAlgoTicket, weightsListCount });
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(cost),
      receiver: this.client.appAddress
    });
    const { return: appId } = await this.client.send.newPrizeBoxRaffle({
      ...sendParams,
      args: {
        payment,
        prizeBox,
        ticketAsset,
        startTimestamp,
        endTimestamp,
        minTickets,
        maxTickets,
        gateId,
        marketplace,
        weightsListCount
      }
    });
    if (appId === void 0) {
      throw new Error("Failed to create new prize box raffle");
    }
    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: sendParams.sender,
        defaultSigner: sendParams.signer
      }
    });
  }
  /**
   * Gets a RaffleSDK instance for an existing raffle.
   * @param appId - The app ID of the raffle
   * @returns RaffleSDK for the specified raffle
   */
  get({ appId }) {
    return new RaffleSDK({
      algorand: this.algorand,
      factoryParams: {
        appId,
        defaultSender: this.sendParams.sender,
        defaultSigner: this.sendParams.signer
      }
    });
  }
  /**
   * Gets the cost to create a new raffle.
   * @param isPrizeBox - Whether the prize is a PrizeBox
   * @param isAlgoTicket - Whether tickets are paid in ALGO (ticketAsset === 0)
   * @param weightsListCount - Number of weights boxes
   * @param raffleCreationFee - Optional: the raffle creation fee from the DAO (default: 10 ALGO)
   */
  cost({ isPrizeBox = false, isAlgoTicket = true, weightsListCount = 1n, raffleCreationFee = 10000000n } = {}) {
    const baseCost = 1398500n;
    const minBalance = 100000n;
    const assetOptInMinBalance = 100000n;
    const weightsMbr = 13113300n;
    let optinMbr = 0n;
    if (!isPrizeBox) {
      optinMbr += assetOptInMinBalance;
    }
    if (!isAlgoTicket) {
      optinMbr += assetOptInMinBalance;
    }
    const childAppMbr = minBalance + optinMbr;
    const weightsMbrTotal = BigInt(weightsListCount) * weightsMbr;
    return raffleCreationFee + baseCost + childAppMbr + weightsMbrTotal;
  }
  /**
   * Deletes a raffle created by this factory.
   * Can only be called after prize is claimed and all MBR is refunded.
   */
  async deleteRaffle({ sender, signer, appId }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.deleteRaffle({
      ...sendParams,
      args: { appId }
    });
  }
  /**
   * Updates the Akita DAO reference.
   */
  async updateAkitaDAO({ sender, signer, akitaDao }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.updateAkitaDao({
      ...sendParams,
      args: { akitaDao }
    });
  }
  /**
   * Updates the Akita DAO Escrow reference.
   */
  async updateAkitaDAOEscrow({ sender, signer, app }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.updateAkitaDaoEscrow({
      ...sendParams,
      args: { app }
    });
  }
};
async function newRaffle({
  factoryParams,
  algorand,
  readerAccount,
  sendParams,
  ...raffleParams
}) {
  const factory = new RaffleFactorySDK({ factoryParams, algorand, readerAccount, sendParams });
  return await factory.newRaffle(raffleParams);
}

// src/raffle/index.ts
var CHUNK_SIZE = 4096n;
var RaffleSDK = class extends BaseSDK {
  constructor(params) {
    super({ factory: RaffleFactory, ...params });
  }
  // ========== Read Methods ==========
  /**
   * Gets the current state of the raffle.
   */
  async state() {
    const { return: state } = await this.client.send.getState({ args: {} });
    if (state === void 0) {
      throw new Error("Failed to get raffle state");
    }
    return state;
  }
  /**
   * Checks if the raffle is currently live (accepting entries).
   */
  async isLive() {
    const isLive = await this.client.isLive();
    return isLive ?? false;
  }
  /**
   * Gets the MBR (Minimum Balance Requirement) data for raffle operations.
   */
  async mbr() {
    const mbrData = await this.client.mbr();
    return {
      entries: mbrData.entries,
      weights: mbrData.weights,
      entriesByAddress: mbrData.entriesByAddress
    };
  }
  /**
   * Gets an entry by its ID.
   */
  async getEntry({ entryId }) {
    const entry = await this.client.state.box.entries.value(entryId);
    if (entry === void 0) {
      throw new Error(`Entry ${entryId} not found`);
    }
    return entry;
  }
  /**
   * Checks if an address has entered the raffle.
   */
  async isEntered({ address }) {
    try {
      const entryId = await this.client.state.box.entriesByAddress.value(address);
      return entryId !== void 0;
    } catch {
      return false;
    }
  }
  /**
   * Gets the entry ID for an address.
   */
  async getEntryByAddress({ address }) {
    const entryId = await this.client.state.box.entriesByAddress.value(address);
    if (entryId === void 0) {
      throw new Error(`No entry found for address ${address}`);
    }
    return entryId;
  }
  /**
   * Gets the ticket count for an entry from the weights boxmap.
   * @param entryId - The entry ID to look up
   * @returns The ticket count for the entry
   */
  async getTicketCount({ entryId }) {
    const id = BigInt(entryId);
    const boxIndex = id / CHUNK_SIZE;
    const slotIndex = Number(id % CHUNK_SIZE);
    const weightsBox = await this.client.state.box.weights.value(boxIndex);
    if (weightsBox === void 0) {
      throw new Error(`Weights box ${boxIndex} not found`);
    }
    return weightsBox[slotIndex];
  }
  /**
   * Gets an entry with its ticket count combined.
   * This is a convenience method that fetches both entry data and the ticket count
   * from the weights boxmap in a single call.
   */
  async getEntryWithTickets({ entryId }) {
    const id = BigInt(entryId);
    const boxIndex = id / CHUNK_SIZE;
    const slotIndex = Number(id % CHUNK_SIZE);
    const [entry, weightsBox] = await Promise.all([
      this.client.state.box.entries.value(id),
      this.client.state.box.weights.value(boxIndex)
    ]);
    if (entry === void 0) {
      throw new Error(`Entry ${entryId} not found`);
    }
    if (weightsBox === void 0) {
      throw new Error(`Weights box ${boxIndex} not found`);
    }
    return {
      ...entry,
      entryId: id,
      ticketCount: weightsBox[slotIndex]
    };
  }
  /**
   * Gets an entry with its ticket count by address.
   * This is a convenience method that looks up the entry ID by address,
   * then fetches both entry data and the ticket count.
   */
  async getEntryWithTicketsByAddress({ address }) {
    var _a, _b;
    let entryId;
    try {
      entryId = await this.client.state.box.entriesByAddress.value(address);
    } catch (error) {
      if (((_a = error == null ? void 0 : error.message) == null ? void 0 : _a.includes("box not found")) || ((_b = error == null ? void 0 : error.message) == null ? void 0 : _b.includes("404"))) {
        throw new Error(`No entry found for address ${address}`);
      }
      throw error;
    }
    if (entryId === void 0) {
      throw new Error(`No entry found for address ${address}`);
    }
    return this.getEntryWithTickets({ entryId });
  }
  /**
   * Gets all entries with their ticket counts.
   * This fetches all entries and their corresponding ticket counts from the weights boxmap.
   * Note: For large raffles, this may require multiple reads.
   */
  async getAllEntriesWithTickets() {
    const [entriesMap, state] = await Promise.all([
      this.client.state.box.entries.getMap(),
      this.state()
    ]);
    const entryCount = state.entryCount;
    const boxCount = (entryCount + CHUNK_SIZE - 1n) / CHUNK_SIZE;
    const weightsPromises = [];
    for (let i = 0n; i < boxCount; i++) {
      weightsPromises.push(this.client.state.box.weights.value(i));
    }
    const weightsBoxes = await Promise.all(weightsPromises);
    const result = [];
    for (const [entryId, entry] of entriesMap) {
      const boxIndex = Number(entryId / CHUNK_SIZE);
      const slotIndex = Number(entryId % CHUNK_SIZE);
      const weightsBox = weightsBoxes[boxIndex];
      if (weightsBox === void 0) {
        throw new Error(`Weights box ${boxIndex} not found`);
      }
      result.push({
        ...entry,
        entryId,
        ticketCount: weightsBox[slotIndex]
      });
    }
    return result;
  }
  // ========== Write Methods ==========
  /**
   * Enters the raffle with tickets.
   * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
   */
  async enter({
    sender,
    signer,
    amount,
    marketplace,
    isAsa = false,
    proofs = [],
    ...rest
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrData = await this.mbr();
    const mbrCost = mbrData.entries + mbrData.entriesByAddress;
    const group = this.client.newGroup();
    if (isAsa) {
      const { ticketAsset } = rest;
      const payment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo2(mbrCost),
        receiver: this.client.appAddress
      });
      const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: BigInt(amount),
        assetId: BigInt(ticketAsset),
        receiver: this.client.appAddress
      });
      group.enterAsa({
        ...sendParams,
        args: {
          payment,
          assetXfer,
          marketplace,
          args: proofs
        }
      });
    } else {
      const payment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo2(BigInt(amount) + mbrCost),
        receiver: this.client.appAddress
      });
      group.enter({
        ...sendParams,
        args: {
          payment,
          marketplace,
          args: proofs
        }
      });
    }
    for (let i = 0; i < 10; i++) {
      group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : void 0 });
    }
    await group.send(sendParams);
  }
  /**
   * Adds more tickets to an existing entry.
   * Use `isAsa: true` and `ticketAsset` for ASA tickets, otherwise ALGO is used.
   */
  async add({
    sender,
    signer,
    amount,
    isAsa = false,
    proofs = [],
    ...rest
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const group = this.client.newGroup();
    if (isAsa) {
      const { ticketAsset } = rest;
      const assetXfer = await this.client.algorand.createTransaction.assetTransfer({
        ...sendParams,
        amount: BigInt(amount),
        assetId: BigInt(ticketAsset),
        receiver: this.client.appAddress
      });
      group.addAsa({
        ...sendParams,
        args: {
          assetXfer,
          args: proofs
        }
      });
    } else {
      const payment = await this.client.algorand.createTransaction.payment({
        ...sendParams,
        amount: microAlgo2(amount),
        receiver: this.client.appAddress
      });
      group.add({
        ...sendParams,
        args: {
          payment,
          args: proofs
        }
      });
    }
    for (let i = 0; i < 10; i++) {
      group.opUp({ ...sendParams, args: {}, note: i > 0 ? `opUp-${i}` : void 0 });
    }
    await group.send(sendParams);
  }
  /**
   * Triggers the raffle to draw the winning ticket number.
   * Can only be called after the raffle has ended.
   */
  async raffle(params) {
    const sendParams = this.getSendParams(params);
    await this.client.send.raffle({
      ...sendParams,
      args: {}
    });
  }
  /**
   * Iterates to find the winner based on the winning ticket.
   * May need to be called multiple times for large raffles.
   */
  async findWinner({ sender, signer, iterationAmount }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.findWinner({
      ...sendParams,
      args: { iterationAmount }
    });
  }
  /**
   * Claims the raffle prize for the winner.
   * Also distributes royalties to marketplace, creator, and Akita.
   */
  async claimPrize(params) {
    const sendParams = this.getSendParams(params);
    await this.client.send.claimRafflePrize({
      ...sendParams,
      args: {}
    });
  }
  /**
   * Refunds MBR to raffle participants after the winner is found.
   * May need to be called multiple times for large raffles.
   */
  async refundMBR({ sender, signer, iterationAmount }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.refundMbr({
      ...sendParams,
      args: { iterationAmount }
    });
  }
  /**
   * Clears the weights boxes after the prize has been claimed.
   * Returns the MBR for the weights boxes to the factory.
   */
  async clearWeightsBoxes(params) {
    const sendParams = this.getSendParams(params);
    const { return: returnAmount } = await this.client.send.clearWeightsBoxes({
      ...sendParams,
      args: {}
    });
    if (returnAmount === void 0) {
      throw new Error("Failed to clear weights boxes");
    }
    return returnAmount;
  }
};

export {
  RaffleFactorySDK,
  newRaffle,
  RaffleSDK
};
//# sourceMappingURL=chunk-LAGT2K7V.mjs.map