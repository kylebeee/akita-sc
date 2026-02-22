import {
  AkitaDaoFactory
} from "./chunk-P4YWTMZR.mjs";
import {
  DEFAULT_READER,
  DEFAULT_SEND_PARAMS,
  ENV_VAR_NAMES,
  detectNetworkFromClient,
  getAppIdFromEnv,
  resolveAppIdWithClient
} from "./chunk-WBPQYKCD.mjs";
import {
  hasSenderSigner
} from "./chunk-V3TNOMIB.mjs";
import {
  __require
} from "./chunk-BJTO5JO5.mjs";

// src/social/index.ts
import { microAlgo } from "@algorandfoundation/algokit-utils";
import algosdk, { makeEmptyTransactionSigner } from "algosdk";

// src/generated/AkitaSocialClient.ts
import { getArc56ReturnValue, getABIStructFromABITuple } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC = { "name": "AkitaSocial", "structs": { "AkitaSocialMBRData": [{ "name": "follows", "type": "uint64" }, { "name": "blocks", "type": "uint64" }, { "name": "posts", "type": "uint64" }, { "name": "votes", "type": "uint64" }, { "name": "votelist", "type": "uint64" }, { "name": "reactions", "type": "uint64" }, { "name": "reactionlist", "type": "uint64" }, { "name": "meta", "type": "uint64" }, { "name": "moderators", "type": "uint64" }, { "name": "banned", "type": "uint64" }, { "name": "actions", "type": "uint64" }], "MetaValue": [{ "name": "initialized", "type": "bool" }, { "name": "wallet", "type": "uint64" }, { "name": "streak", "type": "uint64" }, { "name": "startDate", "type": "uint64" }, { "name": "lastActive", "type": "uint64" }, { "name": "followerIndex", "type": "uint64" }, { "name": "followerCount", "type": "uint64" }, { "name": "automated", "type": "bool" }, { "name": "followGateId", "type": "uint64" }, { "name": "addressGateId", "type": "uint64" }, { "name": "defaultPayWallId", "type": "uint64" }], "PostValue": [{ "name": "creator", "type": "address" }, { "name": "timestamp", "type": "uint64" }, { "name": "gateId", "type": "uint64" }, { "name": "usePayWall", "type": "bool" }, { "name": "payWallId", "type": "uint64" }, { "name": "againstContentPolicy", "type": "bool" }, { "name": "postType", "type": "uint8" }, { "name": "ref", "type": "byte[]" }], "ReactionListKey": [{ "name": "user", "type": "byte[16]" }, { "name": "ref", "type": "byte[16]" }, { "name": "nft", "type": "uint64" }], "ReactionsKey": [{ "name": "ref", "type": "byte[32]" }, { "name": "nft", "type": "uint64" }], "ViewPayWallValue": [{ "name": "userPayInfo", "type": "(uint8,uint64,uint64)[]" }, { "name": "agentPayInfo", "type": "(uint8,uint64,uint64)[]" }], "VoteListKey": [{ "name": "user", "type": "byte[16]" }, { "name": "ref", "type": "byte[16]" }], "VoteListValue": [{ "name": "impact", "type": "uint64" }, { "name": "isUp", "type": "bool" }], "VotesValue": [{ "name": "voteCount", "type": "uint64" }, { "name": "isNegative", "type": "bool" }], "tipMBRInfo": [{ "name": "type", "type": "uint8" }, { "name": "arc58", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }, { "type": "uint64", "name": "akitaDAOEscrow" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "init", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "post", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "uint64", "name": "gateID" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editPost", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedReply", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "appl", "name": "gateTxn" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "gateID" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "reply", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "uint64", "name": "timestamp" }, { "type": "byte[24]", "name": "nonce" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "gateID" }, { "type": "bool", "name": "usePayWall" }, { "type": "uint64", "name": "payWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedEditReply", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "appl", "name": "gateTxn" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editReply", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "byte[36]", "name": "cid" }, { "type": "byte[32]", "name": "amendment" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "vote", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "bool", "name": "isUp" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "editVote", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "byte[32]", "name": "ref" }, { "type": "bool", "name": "flip" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedReact", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "appl", "name": "gateTxn" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "react", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "axfer", "name": "tip" }, { "type": "byte[]", "name": "ref" }, { "type": "uint8", "name": "type" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "deleteReaction", "args": [{ "type": "byte[32]", "name": "ref" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "setPostFlag", "args": [{ "type": "byte[32]", "name": "ref" }, { "type": "bool", "name": "flagged" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "initMeta", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "address", "name": "user" }, { "type": "bool", "name": "automated" }, { "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "NFD" }, { "type": "uint64", "name": "akitaNFT" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "createPayWall", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "((uint8,uint64,uint64)[],(uint8,uint64,uint64)[])", "struct": "ViewPayWallValue", "name": "payWall" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateMeta", "args": [{ "type": "uint64", "name": "followGateID" }, { "type": "uint64", "name": "addressGateID" }, { "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "NFD" }, { "type": "uint64", "name": "akitaNFT" }, { "type": "uint64", "name": "defaultPayWallID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateFollowerMeta", "args": [{ "type": "address", "name": "address" }, { "type": "uint64", "name": "newFollowerIndex" }, { "type": "uint64", "name": "newFollowerCount" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "isBanned", "args": [{ "type": "address", "name": "account" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getUserSocialImpact", "args": [{ "type": "address", "name": "user" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getMetaExists", "args": [{ "type": "address", "name": "user" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getMeta", "args": [{ "type": "address", "name": "user" }], "returns": { "type": "(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)", "struct": "MetaValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getPostExists", "args": [{ "type": "byte[32]", "name": "ref" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getPost", "args": [{ "type": "byte[32]", "name": "ref" }], "returns": { "type": "(address,uint64,uint64,bool,uint64,bool,uint8,byte[])", "struct": "PostValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getVote", "args": [{ "type": "address", "name": "account" }, { "type": "byte[32]", "name": "ref" }], "returns": { "type": "(uint64,bool)", "struct": "VoteListValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getVotes", "args": [{ "type": "(address,byte[32])[]", "name": "keys" }], "returns": { "type": "(uint64,bool)[]" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getReactionExists", "args": [{ "type": "byte[32]", "name": "ref" }, { "type": "uint64", "name": "NFT" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "mbr", "args": [{ "type": "byte[]", "name": "ref" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)", "struct": "AkitaSocialMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "payWallMbr", "args": [{ "type": "((uint8,uint64,uint64)[],(uint8,uint64,uint64)[])", "struct": "ViewPayWallValue", "name": "paywall" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "checkTipMbrRequirements", "args": [{ "type": "uint64", "name": "akitaDAO" }, { "type": "address", "name": "creator" }, { "type": "uint64", "name": "wallet" }], "returns": { "type": "(uint8,uint64)", "struct": "tipMBRInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAOEscrow", "args": [{ "type": "uint64", "name": "app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 3, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "payWallId": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cGF5d2FsbF9pZA==" }, "akitaDAOEscrow": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZXNjcm93", "desc": "the app ID for the akita DAO escrow to use" }, "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "posts": { "keyType": "AVMBytes", "valueType": "PostValue", "desc": "All the posts on the network", "prefix": "cA==" }, "paywall": { "keyType": "uint64", "valueType": "ViewPayWallValue", "desc": "Pay wall information for posts", "prefix": "dw==" }, "votes": { "keyType": "AVMBytes", "valueType": "VotesValue", "desc": "Counters for each post to track votes", "prefix": "dg==" }, "votelist": { "keyType": "VoteListKey", "valueType": "VoteListValue", "desc": "User votes and their impact", "prefix": "bw==" }, "reactions": { "keyType": "ReactionsKey", "valueType": "uint64", "desc": "Counters for each post to track reactions", "prefix": "cg==" }, "reactionlist": { "keyType": "ReactionListKey", "valueType": "AVMBytes", "desc": "Who has reacted to what", "prefix": "ZQ==" }, "meta": { "keyType": "address", "valueType": "MetaValue", "desc": "The meta data for each user", "prefix": "bQ==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [1819, 2469, 2733, 3479, 4217, 4418, 4892, 5058, 5122, 5361, 5861, 5927, 6164, 6660, 7027], "errorMessage": "Box must have value" }, { "pc": [633, 950, 1080, 1355, 3767, 3842, 4074, 5022, 5270, 7351, 7571], "errorMessage": "Bytes has valid prefix" }, { "pc": [6653], "errorMessage": "Cannot vote on your own content" }, { "pc": [4011], "errorMessage": "ERR:NOPAYWALL" }, { "pc": [3546], "errorMessage": "ERR:NOT_MODERATION" }, { "pc": [6223, 6495], "errorMessage": "ERR:POST_EXISTS" }, { "pc": [1375], "errorMessage": "Escrow does not exist" }, { "pc": [2049, 2562, 3233], "errorMessage": "Gate check failed" }, { "pc": [4929], "errorMessage": "Invalid App" }, { "pc": [4662], "errorMessage": "Invalid app upgrade" }, { "pc": [4836], "errorMessage": "Invalid asset" }, { "pc": [3681, 6757, 6799, 7017, 7203], "errorMessage": "Invalid payment" }, { "pc": [6179], "errorMessage": "Invalid paywall" }, { "pc": [804, 6434, 6726], "errorMessage": "Invalid percentage" }, { "pc": [4801, 4828, 4874, 4920], "errorMessage": "Invalid reference length, must be 32 bytes" }, { "pc": [4959], "errorMessage": "Invalid reply type" }, { "pc": [7112], "errorMessage": "Invalid transfer" }, { "pc": [1789], "errorMessage": "Is a reply" }, { "pc": [1797, 2447, 2711], "errorMessage": "Is already amended" }, { "pc": [516], "errorMessage": "Length must be 16" }, { "pc": [2537, 2801, 4850, 4943], "errorMessage": "Length must be 32" }, { "pc": [3656], "errorMessage": "Meta box values already exist" }, { "pc": [3982, 5792], "errorMessage": "Meta box values dont exist yet" }, { "pc": [2439, 2703], "errorMessage": "Not a reply" }, { "pc": [4119], "errorMessage": "Not the social graph app" }, { "pc": [1783, 2434, 2698], "errorMessage": "Not your post to edit" }, { "pc": [213], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [474], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [4610, 4651, 4692], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [1725, 2023, 2239, 2932, 3207, 3343, 3419, 3555, 4264, 6604, 6846], "errorMessage": "Post not found" }, { "pc": [1645, 2014, 2230], "errorMessage": "Provided timestamp is too far in the past" }, { "pc": [2376, 2640], "errorMessage": "Reply not found" }, { "pc": [3469, 6909], "errorMessage": "This account already reacted to this post with this NFT" }, { "pc": [3410, 6119, 6375, 6595, 6837], "errorMessage": "This account is banned" }, { "pc": [3429, 6390, 6616, 6857], "errorMessage": "This account is blocked by the user" }, { "pc": [2251, 2812, 3355, 4897], "errorMessage": "This has a gate" }, { "pc": [6666], "errorMessage": "This is an automated account" }, { "pc": [6865], "errorMessage": "User does not own this NFT" }, { "pc": [1385], "errorMessage": "Wrong escrow for this operation" }, { "pc": [3046, 4319], "errorMessage": "You haven't voted on this" }, { "pc": [6649], "errorMessage": "You've already voted on this post" }, { "pc": [1227], "errorMessage": "already opted in" }, { "pc": [887, 980, 998, 1015, 1104, 1255, 1444, 1496, 3544, 3699, 4117, 4608, 4647, 4690, 4927, 4949, 5319, 5579, 5633, 6338, 6808, 7228], "errorMessage": "application exists" }, { "pc": [3893], "errorMessage": "assert target is match for conditions" }, { "pc": [4835, 4856], "errorMessage": "asset exists" }, { "pc": [1210, 1252, 1273, 1380, 1493, 2037, 2361, 2550, 3221, 3534, 3632, 3685, 3792, 3898, 4025, 4108, 4601, 4639, 4683, 4977, 5228, 5304, 5316, 5369, 5389, 5412, 5458, 5576, 5627, 6303, 6335, 6399, 6414, 6670, 6685, 6805, 6918, 7060, 7144, 7313], "errorMessage": "check GlobalState exists" }, { "pc": [4371], "errorMessage": "index access is out of bounds" }, { "pc": [1368], "errorMessage": "invalid number of bytes for (len+(uint64,bool1)[])" }, { "pc": [4348], "errorMessage": "invalid number of bytes for (len+(uint8[32],uint8[32])[])" }, { "pc": [643, 1951, 2167, 2878, 3164, 3300, 4525], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [1166, 4630], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [1625, 1979, 2195, 2897, 3011, 3526, 3596, 5027, 7356, 7576], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [955, 1085, 1177, 1186, 1589, 1616, 1635, 1918, 1970, 1989, 2134, 2186, 2205, 3183, 3319, 3402, 3608, 3618, 3628, 3771, 3847, 3931, 3939, 3947, 3955, 3963, 3971, 4078, 4094, 4102, 4490, 4559, 4576, 4594, 4676, 5275], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [1962, 2178, 2889, 3175, 3311], "errorMessage": "invalid number of bytes for uint8" }, { "pc": [1599, 1928, 2144], "errorMessage": "invalid number of bytes for uint8[24]" }, { "pc": [1716, 2357, 2631, 3003, 3394, 3518, 3588, 4086, 4145, 4167, 4185, 4211, 4231, 4256, 4280, 4288, 4482, 4568], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [1608, 1708, 1937, 2153, 2349, 2623], "errorMessage": "invalid number of bytes for uint8[36]" }, { "pc": [3030, 3036, 3446, 3452, 4303, 4309, 4394, 4400, 4808, 6082, 6088, 6633, 6639, 6882, 6888, 6951], "errorMessage": "invalid size" }, { "pc": [4424, 4451], "errorMessage": "max array length exceeded" }, { "pc": [1910, 2340, 3150], "errorMessage": "transaction type is appl" }, { "pc": [1581, 1699, 1899, 2126, 2329, 2614, 2864, 2994, 3139, 3286], "errorMessage": "transaction type is axfer" }, { "pc": [1570, 1688, 1887, 2115, 2317, 2603, 2853, 2983, 3127, 3275, 3580, 3867], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDggMzIgMTAwMDAwIDEzMjAwIDMxNzAwIDYzMDcyMDAwIDg2NDAwIDYwNjAwCiAgICBieXRlY2Jsb2NrICJha2l0YV9kYW8iIDB4MTUxZjdjNzUgInAiIDB4MDAgIm0iIDB4MTQgImFraXRhX2VzY3JvdyIgImFraXRhX2Fzc2V0cyIgInNhbCIgInNvY2lhbF9mZWVzIiAweDAwMDAgIndhbGxldCIgMHg4MCAweDBhIDB4MDMgIm8iICJwYWwiIDB4MDEgInciICJwYXl3YWxsX2lkIiAiYWFsIiAweDAwMDEgMHg2ODM1ZTNiYyAiYSIgMHgwMiAiciIgMHgyN2UzYmI0ZiAweDg0MjY5Yzc4ICJ2ZXJzaW9uIiAweDU4MmZmMzgyIDB4NmNjM2Y2MDYgMHgwMDAwMDAwMDAwMDAwMDAwMDAgMHgwMDNkCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYm56IG1haW5fYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzEKICAgIC8vIHBheVdhbGxJZCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFraXRhU29jaWFsR2xvYmFsU3RhdGVLZXlzUGF5d2FsbElELCBpbml0aWFsVmFsdWU6IDEgfSkKICAgIGJ5dGVjIDE5IC8vICJwYXl3YWxsX2lkIgogICAgaW50Y18xIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsIGV4dGVuZHMgY2xhc3NlcyhCYXNlU29jaWFsLCBBa2l0YUJhc2VGZWVHZW5lcmF0b3JDb250cmFjdCkgewogICAgcHVzaGJ5dGVzIDB4ZWE5MTgwZGQgLy8gbWV0aG9kICJ1cGRhdGUoc3RyaW5nKXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX3VwZGF0ZV9yb3V0ZUA0CgptYWluX3N3aXRjaF9jYXNlX25leHRANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsIGV4dGVuZHMgY2xhc3NlcyhCYXNlU29jaWFsLCBBa2l0YUJhc2VGZWVHZW5lcmF0b3JDb250cmFjdCkgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBieiBtYWluX2NyZWF0ZV9Ob09wQDQwCiAgICBwdXNoYnl0ZXNzIDB4ODNmMTQ3NDggMHg3MTA1YmJhZCAweGJhNGJmNzk0IDB4ZDVjOGU3YjggMHgyZmZjMzEyMyAweDcyNzI0Zjk2IDB4MWM5OWZlOWUgMHgwMmU5MjYzMSAweDg0ZmE0YjVlIDB4NmU3ZDQyYzIgMHhkMGU1YjE4ZCAweDZlNWI3NzAyIDB4ZWFjNmQ5MjIgMHg4NTY0MzNlYSAweGQwOWYzZGU4IDB4NjlhNGVmOTcgMHgzMzA2YjMyYSAvLyBtZXRob2QgImluaXQoKXZvaWQiLCBtZXRob2QgInBvc3QocGF5LGF4ZmVyLHVpbnQ2NCxieXRlWzI0XSxieXRlWzM2XSx1aW50NjQsYm9vbCx1aW50NjQpdm9pZCIsIG1ldGhvZCAiZWRpdFBvc3QocGF5LGF4ZmVyLGJ5dGVbMzZdLGJ5dGVbMzJdKXZvaWQiLCBtZXRob2QgImdhdGVkUmVwbHkocGF5LGF4ZmVyLGFwcGwsdWludDY0LGJ5dGVbMjRdLGJ5dGVbMzZdLGJ5dGVbXSx1aW50OCx1aW50NjQsYm9vbCx1aW50NjQpdm9pZCIsIG1ldGhvZCAicmVwbHkocGF5LGF4ZmVyLHVpbnQ2NCxieXRlWzI0XSxieXRlWzM2XSxieXRlW10sdWludDgsdWludDY0LGJvb2wsdWludDY0KXZvaWQiLCBtZXRob2QgImdhdGVkRWRpdFJlcGx5KHBheSxheGZlcixhcHBsLGJ5dGVbMzZdLGJ5dGVbMzJdKXZvaWQiLCBtZXRob2QgImVkaXRSZXBseShwYXksYXhmZXIsYnl0ZVszNl0sYnl0ZVszMl0pdm9pZCIsIG1ldGhvZCAidm90ZShwYXksYXhmZXIsYnl0ZVtdLHVpbnQ4LGJvb2wpdm9pZCIsIG1ldGhvZCAiZWRpdFZvdGUocGF5LGF4ZmVyLGJ5dGVbMzJdLGJvb2wpdm9pZCIsIG1ldGhvZCAiZ2F0ZWRSZWFjdChwYXksYXhmZXIsYXBwbCxieXRlW10sdWludDgsdWludDY0KXZvaWQiLCBtZXRob2QgInJlYWN0KHBheSxheGZlcixieXRlW10sdWludDgsdWludDY0KXZvaWQiLCBtZXRob2QgImRlbGV0ZVJlYWN0aW9uKGJ5dGVbMzJdLHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJzZXRQb3N0RmxhZyhieXRlWzMyXSxib29sKXZvaWQiLCBtZXRob2QgImluaXRNZXRhKHBheSxhZGRyZXNzLGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQpdWludDY0IiwgbWV0aG9kICJjcmVhdGVQYXlXYWxsKHBheSwoKHVpbnQ4LHVpbnQ2NCx1aW50NjQpW10sKHVpbnQ4LHVpbnQ2NCx1aW50NjQpW10pKXVpbnQ2NCIsIG1ldGhvZCAidXBkYXRlTWV0YSh1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJ1cGRhdGVGb2xsb3dlck1ldGEoYWRkcmVzcyx1aW50NjQsdWludDY0KXZvaWQiCiAgICBieXRlYyAyNyAvLyBtZXRob2QgImlzQmFubmVkKGFkZHJlc3MpYm9vbCIKICAgIHB1c2hieXRlc3MgMHhlODY5OTM0ZCAweGU2ZTY3YmRjIDB4NzM5ZWE3MGIgMHhjMDIyYmU4OSAweDk4NGJhZWY1IDB4OWUxNzRiYjYgMHhhODkxMjA0NCAweGYxMzYwMGQxIDB4OTJlNmRkM2IgMHhhMTM0YTI3OCAweDM0NDE3NWYwIDB4MWVhZDIwYTkgMHgzM2U5MmM5NCAweDg1NGRlZGUwIC8vIG1ldGhvZCAiZ2V0VXNlclNvY2lhbEltcGFjdChhZGRyZXNzKXVpbnQ2NCIsIG1ldGhvZCAiZ2V0TWV0YUV4aXN0cyhhZGRyZXNzKWJvb2wiLCBtZXRob2QgImdldE1ldGEoYWRkcmVzcykoYm9vbCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCxib29sLHVpbnQ2NCx1aW50NjQsdWludDY0KSIsIG1ldGhvZCAiZ2V0UG9zdEV4aXN0cyhieXRlWzMyXSlib29sIiwgbWV0aG9kICJnZXRQb3N0KGJ5dGVbMzJdKShhZGRyZXNzLHVpbnQ2NCx1aW50NjQsYm9vbCx1aW50NjQsYm9vbCx1aW50OCxieXRlW10pIiwgbWV0aG9kICJnZXRWb3RlKGFkZHJlc3MsYnl0ZVszMl0pKHVpbnQ2NCxib29sKSIsIG1ldGhvZCAiZ2V0Vm90ZXMoKGFkZHJlc3MsYnl0ZVszMl0pW10pKHVpbnQ2NCxib29sKVtdIiwgbWV0aG9kICJnZXRSZWFjdGlvbkV4aXN0cyhieXRlWzMyXSx1aW50NjQpYm9vbCIsIG1ldGhvZCAibWJyKGJ5dGVbXSkodWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCkiLCBtZXRob2QgInBheVdhbGxNYnIoKCh1aW50OCx1aW50NjQsdWludDY0KVtdLCh1aW50OCx1aW50NjQsdWludDY0KVtdKSl1aW50NjQiLCBtZXRob2QgImNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKHVpbnQ2NCxhZGRyZXNzLHVpbnQ2NCkodWludDgsdWludDY0KSIsIG1ldGhvZCAidXBkYXRlQWtpdGFEQU9Fc2Nyb3codWludDY0KXZvaWQiLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggaW5pdCBwb3N0IGVkaXRQb3N0IGdhdGVkUmVwbHkgcmVwbHkgZ2F0ZWRFZGl0UmVwbHkgZWRpdFJlcGx5IHZvdGUgZWRpdFZvdGUgZ2F0ZWRSZWFjdCByZWFjdCBkZWxldGVSZWFjdGlvbiBzZXRQb3N0RmxhZyBpbml0TWV0YSBjcmVhdGVQYXlXYWxsIHVwZGF0ZU1ldGEgdXBkYXRlRm9sbG93ZXJNZXRhIGlzQmFubmVkIGdldFVzZXJTb2NpYWxJbXBhY3QgZ2V0TWV0YUV4aXN0cyBnZXRNZXRhIGdldFBvc3RFeGlzdHMgZ2V0UG9zdCBnZXRWb3RlIGdldFZvdGVzIGdldFJlYWN0aW9uRXhpc3RzIG1iciBwYXlXYWxsTWJyIGNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzIHVwZGF0ZUFraXRhREFPRXNjcm93IHVwZGF0ZUFraXRhREFPIG1haW5fb3BVcF9yb3V0ZUAzOAogICAgZXJyCgptYWluX29wVXBfcm91dGVAMzg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MwogICAgLy8gb3BVcCgpOiB2b2lkIHsgfQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfTm9PcEA0MDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNwogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsIGV4dGVuZHMgY2xhc3NlcyhCYXNlU29jaWFsLCBBa2l0YUJhc2VGZWVHZW5lcmF0b3JDb250cmFjdCkgewogICAgcHVzaGJ5dGVzIDB4ODhjOTQwZjggLy8gbWV0aG9kICJjcmVhdGUoc3RyaW5nLHVpbnQ2NCx1aW50NjQpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgptYWluX3VwZGF0ZV9yb3V0ZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgVXBkYXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiB1cGRhdGUKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OmIxNihiOiBieXRlcykgLT4gYnl0ZXM6CmIxNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMwogICAgLy8gZXhwb3J0IGZ1bmN0aW9uIGIxNihiOiBieXRlcyk6IGJ5dGVzPDE2PiB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNAogICAgLy8gcmV0dXJuIGIuc2xpY2UoMCwgMTYpLnRvRml4ZWQoeyBsZW5ndGg6IDE2IH0pCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBmcmFtZV9kaWcgLTEKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDE2CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjppbXBhY3RSYW5nZShpbXBhY3Q6IHVpbnQ2NCwgbWluOiB1aW50NjQsIG1heDogdWludDY0KSAtPiB1aW50NjQ6CmltcGFjdFJhbmdlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMjYKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBpbXBhY3RSYW5nZShpbXBhY3Q6IHVpbnQ2NCwgbWluOiB1aW50NjQsIG1heDogdWludDY0KTogdWludDY0IHsKICAgIHByb3RvIDMgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMjcKICAgIC8vIGNvbnN0IG1pbkltcGFjdDogdWludDY0ID0gKGltcGFjdCA+IDEpID8gaW1wYWN0IC0gMSA6IDEKICAgIGZyYW1lX2RpZyAtMwogICAgaW50Y18xIC8vIDEKICAgID4KICAgIGJ6IGltcGFjdFJhbmdlX3Rlcm5hcnlfZmFsc2VAMgogICAgZnJhbWVfZGlnIC0zCiAgICBpbnRjXzEgLy8gMQogICAgLQoKaW1wYWN0UmFuZ2VfdGVybmFyeV9tZXJnZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMjgKICAgIC8vIHJldHVybiBtYXggLSAoKChtYXggLSBtaW4pICogbWluSW1wYWN0KSAvIElNUEFDVF9ESVZJU09SKQogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgLTIKICAgIC0KICAgICoKICAgIHB1c2hpbnQgMTAwMCAvLyAxMDAwCiAgICAvCiAgICBmcmFtZV9kaWcgLTEKICAgIHN3YXAKICAgIC0KICAgIHJldHN1YgoKaW1wYWN0UmFuZ2VfdGVybmFyeV9mYWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMjcKICAgIC8vIGNvbnN0IG1pbkltcGFjdDogdWludDY0ID0gKGltcGFjdCA+IDEpID8gaW1wYWN0IC0gMSA6IDEKICAgIGludGNfMSAvLyAxCiAgICBiIGltcGFjdFJhbmdlX3Rlcm5hcnlfbWVyZ2VAMwoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJlZmVycmVyT3JaZXJvQWRkcmVzcyh3YWxsZXRJRDogdWludDY0KSAtPiBieXRlczoKcmVmZXJyZXJPclplcm9BZGRyZXNzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNTYKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiByZWZlcnJlck9yWmVyb0FkZHJlc3Mod2FsbGV0SUQ6IEFwcGxpY2F0aW9uKTogQWNjb3VudCB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTU3CiAgICAvLyByZXR1cm4gcmVmZXJyZXJPcih3YWxsZXRJRCwgR2xvYmFsLnplcm9BZGRyZXNzKQogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE1MAogICAgLy8gaWYgKHdhbGxldElELmlkID09PSAwKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGJueiByZWZlcnJlck9yWmVyb0FkZHJlc3NfYWZ0ZXJfaWZfZWxzZUAzCiAgICBmcmFtZV9kaWcgMAoKcmVmZXJyZXJPclplcm9BZGRyZXNzX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6cmVmZXJyZXJPckA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNTcKICAgIC8vIHJldHVybiByZWZlcnJlck9yKHdhbGxldElELCBHbG9iYWwuemVyb0FkZHJlc3MpCiAgICBzd2FwCiAgICByZXRzdWIKCnJlZmVycmVyT3JaZXJvQWRkcmVzc19hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2OS0xNzIKICAgIC8vIGNvbnN0IFtyZWZlcnJlckJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXRJRCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVmZXJyZXIpCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTcxCiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNSZWZlcnJlcikKICAgIHB1c2hieXRlcyAicmVmZXJyZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE2OS0xNzIKICAgIC8vIGNvbnN0IFtyZWZlcnJlckJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKAogICAgLy8gICB3YWxsZXRJRCwKICAgIC8vICAgQnl0ZXMoQWJzdHJhY3RBY2NvdW50R2xvYmFsU3RhdGVLZXlzUmVmZXJyZXIpCiAgICAvLyApCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE1NwogICAgLy8gcmV0dXJuIHJlZmVycmVyT3Iod2FsbGV0SUQsIEdsb2JhbC56ZXJvQWRkcmVzcykKICAgIGIgcmVmZXJyZXJPclplcm9BZGRyZXNzX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6cmVmZXJyZXJPckA0CgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6Z2V0V2FsbGV0SURVc2luZ0FraXRhREFPKGFraXRhREFPOiB1aW50NjQsIGFkZHJlc3M6IGJ5dGVzKSAtPiB1aW50NjQ6CmdldFdhbGxldElEVXNpbmdBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTc2CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbiwgYWRkcmVzczogQWNjb3VudCk6IEFwcGxpY2F0aW9uIHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NQogICAgLy8gY29uc3QgW290aGVyQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c090aGVyQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTIKICAgIHB1c2hieXRlcyAib2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2MAogICAgLy8gcmV0dXJuIGdldE90aGVyQXBwTGlzdChha2l0YURBTykuZXNjcm93CiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxODItMTg1CiAgICAvLyBjb25zdCBkYXRhID0gYWJpQ2FsbDx0eXBlb2YgRXNjcm93RmFjdG9yeS5wcm90b3R5cGUuZ2V0Pih7CiAgICAvLyAgIGFwcElkOiBlc2Nyb3dGYWN0b3J5LAogICAgLy8gICBhcmdzOiBbYWRkcmVzc10KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHgzYzFhNmYzMyAvLyBtZXRob2QgImdldChhZGRyZXNzKWJ5dGVbXSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDYgMAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjE4NwogICAgLy8gaWYgKEJ5dGVzKGRhdGEpLmxlbmd0aCA9PT0gMCB8fCBCeXRlcyhkYXRhKS5sZW5ndGggIT09IDgpIHsKICAgIGxlbgogICAgZHVwCiAgICBieiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU9faWZfYm9keUA2CiAgICBmcmFtZV9kaWcgMQogICAgaW50Y18yIC8vIDgKICAgICE9CiAgICBieiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU9fYWZ0ZXJfaWZfZWxzZUA3CgpnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU9faWZfYm9keUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxODgKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAoKZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo6Z2V0V2FsbGV0SURAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTc4CiAgICAvLyByZXR1cm4gQXBwbGljYXRpb24oZ2V0V2FsbGV0SUQoZXNjcm93RmFjdG9yeSwgYWRkcmVzcykpCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPX2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTkxCiAgICAvLyByZXR1cm4gYnRvaShkYXRhKQogICAgZnJhbWVfZGlnIDAKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTc4CiAgICAvLyByZXR1cm4gQXBwbGljYXRpb24oZ2V0V2FsbGV0SUQoZXNjcm93RmFjdG9yeSwgYWRkcmVzcykpCiAgICBiIGdldFdhbGxldElEVXNpbmdBa2l0YURBT19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OmdldFdhbGxldElEQDgKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpnYXRlQ2hlY2soZ2F0ZVR4bjogdWludDY0LCBha2l0YURBTzogdWludDY0LCBjYWxsZXI6IGJ5dGVzLCBpZDogdWludDY0KSAtPiB1aW50NjQ6CmdhdGVDaGVjazoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI3CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gZ2F0ZUNoZWNrKGdhdGVUeG46IGd0eG4uQXBwbGljYXRpb25DYWxsVHhuLCBha2l0YURBTzogQXBwbGljYXRpb24sIGNhbGxlcjogQWNjb3VudCwgaWQ6IHVpbnQ2NCk6IGJvb2xlYW4gewogICAgcHJvdG8gNCAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOQogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgZnJhbWVfZGlnIC00CiAgICBndHhucyBBcHBsaWNhdGlvbklECiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQwCiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTMKICAgIGJ5dGVjIDIwIC8vICJhYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOQogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgcHVzaGludCA0MCAvLyA0MAogICAgZXh0cmFjdF91aW50NjQKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOS0yMzAKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIC8vIGdhdGVUeG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AgJiYKICAgIGJ6IGdhdGVDaGVja19ib29sX2ZhbHNlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjMwCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICBmcmFtZV9kaWcgLTQKICAgIGd0eG5zIE9uQ29tcGxldGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjktMjMwCiAgICAvLyBnYXRlVHhuLmFwcElkID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUpICYmCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICBibnogZ2F0ZUNoZWNrX2Jvb2xfZmFsc2VANwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMzEKICAgIC8vIGdhdGVUeG4ubnVtQXBwQXJncyA9PT0gNCAmJgogICAgZnJhbWVfZGlnIC00CiAgICBndHhucyBOdW1BcHBBcmdzCiAgICBwdXNoaW50IDQgLy8gNAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI5LTIzMQogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgLy8gZ2F0ZVR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCAmJgogICAgLy8gZ2F0ZVR4bi5udW1BcHBBcmdzID09PSA0ICYmCiAgICBieiBnYXRlQ2hlY2tfYm9vbF9mYWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIzMgogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgR2F0ZS5wcm90b3R5cGUubXVzdENoZWNrPigpICYmCiAgICBmcmFtZV9kaWcgLTQKICAgIGludGNfMCAvLyAwCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgcHVzaGJ5dGVzIDB4NDM5MjI2NTUgLy8gbWV0aG9kICJtdXN0Q2hlY2soYWRkcmVzcyx1aW50NjQsYnl0ZVtdW10pdm9pZCIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOS0yMzIKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIC8vIGdhdGVUeG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AgJiYKICAgIC8vIGdhdGVUeG4ubnVtQXBwQXJncyA9PT0gNCAmJgogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgR2F0ZS5wcm90b3R5cGUubXVzdENoZWNrPigpICYmCiAgICBieiBnYXRlQ2hlY2tfYm9vbF9mYWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIzMwogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDEpID09PSBuZXcgQWRkcmVzcyhjYWxsZXIpLmJ5dGVzICYmCiAgICBmcmFtZV9kaWcgLTQKICAgIGludGNfMSAvLyAxCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIC0yCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjktMjMzCiAgICAvLyBnYXRlVHhuLmFwcElkID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUpICYmCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICAvLyBnYXRlVHhuLm51bUFwcEFyZ3MgPT09IDQgJiYKICAgIC8vIGdhdGVUeG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3I8dHlwZW9mIEdhdGUucHJvdG90eXBlLm11c3RDaGVjaz4oKSAmJgogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDEpID09PSBuZXcgQWRkcmVzcyhjYWxsZXIpLmJ5dGVzICYmCiAgICBieiBnYXRlQ2hlY2tfYm9vbF9mYWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIzNAogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDIpID09PSBpdG9iKGlkKQogICAgZnJhbWVfZGlnIC00CiAgICBwdXNoaW50IDIgLy8gMgogICAgZ3R4bnNhcyBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI5LTIzNAogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgLy8gZ2F0ZVR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCAmJgogICAgLy8gZ2F0ZVR4bi5udW1BcHBBcmdzID09PSA0ICYmCiAgICAvLyBnYXRlVHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBHYXRlLnByb3RvdHlwZS5tdXN0Q2hlY2s+KCkgJiYKICAgIC8vIGdhdGVUeG4uYXBwQXJncygxKSA9PT0gbmV3IEFkZHJlc3MoY2FsbGVyKS5ieXRlcyAmJgogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDIpID09PSBpdG9iKGlkKQogICAgYnogZ2F0ZUNoZWNrX2Jvb2xfZmFsc2VANwogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI4LTIzNQogICAgLy8gcmV0dXJuICgKICAgIC8vICAgZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgLy8gICBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICAvLyAgIGdhdGVUeG4ubnVtQXBwQXJncyA9PT0gNCAmJgogICAgLy8gICBnYXRlVHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBHYXRlLnByb3RvdHlwZS5tdXN0Q2hlY2s+KCkgJiYKICAgIC8vICAgZ2F0ZVR4bi5hcHBBcmdzKDEpID09PSBuZXcgQWRkcmVzcyhjYWxsZXIpLmJ5dGVzICYmCiAgICAvLyAgIGdhdGVUeG4uYXBwQXJncygyKSA9PT0gaXRvYihpZCkKICAgIC8vICkKICAgIHJldHN1YgoKZ2F0ZUNoZWNrX2Jvb2xfZmFsc2VANzoKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOC0yMzUKICAgIC8vIHJldHVybiAoCiAgICAvLyAgIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIC8vICAgZ2F0ZVR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCAmJgogICAgLy8gICBnYXRlVHhuLm51bUFwcEFyZ3MgPT09IDQgJiYKICAgIC8vICAgZ2F0ZVR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgR2F0ZS5wcm90b3R5cGUubXVzdENoZWNrPigpICYmCiAgICAvLyAgIGdhdGVUeG4uYXBwQXJncygxKSA9PT0gbmV3IEFkZHJlc3MoY2FsbGVyKS5ieXRlcyAmJgogICAgLy8gICBnYXRlVHhuLmFwcEFyZ3MoMikgPT09IGl0b2IoaWQpCiAgICAvLyApCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjpzZW5kUmVmZXJyYWxQYXltZW50KGFraXRhREFPOiB1aW50NjQsIGFzc2V0OiB1aW50NjQsIGFtb3VudDogdWludDY0KSAtPiBieXRlczoKc2VuZFJlZmVycmFsUGF5bWVudDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTU4CiAgICAvLyBleHBvcnQgZnVuY3Rpb24gc2VuZFJlZmVycmFsUGF5bWVudChha2l0YURBTzogQXBwbGljYXRpb24sIGFzc2V0OiB1aW50NjQsIGFtb3VudDogdWludDY0KTogUmVmZXJyYWxQYXltZW50SW5mbyB7CiAgICBwcm90byAzIDEKICAgIGludGNfMCAvLyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIGR1cG4gNAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NTkKICAgIC8vIGNvbnN0IHdhbGxldCA9IGdldFdhbGxldElEVXNpbmdBa2l0YURBTyhha2l0YURBTywgVHhuLnNlbmRlcikKICAgIGZyYW1lX2RpZyAtMwogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTYwCiAgICAvLyBjb25zdCByZWZlcnJlciA9IHJlZmVycmVyT3JaZXJvQWRkcmVzcyh3YWxsZXQpCiAgICBjYWxsc3ViIHJlZmVycmVyT3JaZXJvQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NjMKICAgIC8vIGlmIChhbW91bnQgPiAwICYmIHJlZmVycmVyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MpIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnogc2VuZFJlZmVycmFsUGF5bWVudF9hZnRlcl9pZl9lbHNlQDYKICAgIGZyYW1lX2RpZyA2CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgICE9CiAgICBieiBzZW5kUmVmZXJyYWxQYXltZW50X2FmdGVyX2lmX2Vsc2VANgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2NAogICAgLy8gY29uc3QgW3dhbGxldEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXRGZWVzKSkKICAgIGZyYW1lX2RpZyAtMwogICAgcHVzaGJ5dGVzICJ3YWxsZXRfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTY1CiAgICAvLyBjb25zdCB7IHJlZmVycmVyUGVyY2VudGFnZSB9ID0gZ2V0V2FsbGV0RmVlcyhha2l0YURBTykKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxMDQKICAgIC8vIGFzc2VydChwIDw9IERJVklTT1IsIEVSUl9JTlZBTElEX1BFUkNFTlRBR0UpCiAgICBkdXAKICAgIGludGMgNCAvLyAxMDAwMDAKICAgIDw9CiAgICBhc3NlcnQgLy8gSW52YWxpZCBwZXJjZW50YWdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEwNQogICAgLy8gcmV0dXJuIG9wLmRpdncoLi4ub3AubXVsdyhhLCBwKSwgRElWSVNPUikKICAgIGZyYW1lX2RpZyAtMQogICAgbXVsdwogICAgaW50YyA0IC8vIDEwMDAwMAogICAgZGl2dwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTY4CiAgICAvLyBpZiAocmVmZXJyYWxGZWUgPT09IDAgJiYgYW1vdW50ID4gMCkgewogICAgYm56IHNlbmRSZWZlcnJhbFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUA1CiAgICBmcmFtZV9kaWcgLTEKICAgIGJ6IHNlbmRSZWZlcnJhbFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU2OQogICAgLy8gcmVmZXJyYWxGZWUgPSAxCiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfYnVyeSAzCgpzZW5kUmVmZXJyYWxQYXltZW50X2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTc1CiAgICAvLyBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZnJhbWVfYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU3NgogICAgLy8gKEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgKyBPTkVfV0VFSyksCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBwdXNoaW50IDYwNDgwMCAvLyA2MDQ4MDAKICAgICsKICAgIGZyYW1lX2J1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NzcKICAgIC8vIFt7IGFkZHJlc3M6IHJlZmVycmVyLCBhbW91bnQ6IHJlZmVycmFsRmVlIH1dLAogICAgZnJhbWVfZGlnIDMKICAgIGl0b2IKICAgIGZyYW1lX2RpZyA2CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGJ5dGVjIDIxIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0MAogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFwcExpc3QpKQogICAgZnJhbWVfZGlnIC0zCiAgICBieXRlYyAyMCAvLyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0OTMKICAgIC8vIGNvbnN0IHJld2FyZHNBcHAgPSBnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLnJld2FyZHMKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ5NgogICAgLy8gbGV0IGNvc3Q6IHVpbnQ2NCA9IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9ucy5sZW5ndGgpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMjUzMDAgLy8gMjUzMDAKICAgICoKICAgIHB1c2hpbnQgMzUzMDAgLy8gMzUzMDAKICAgICsKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0OTcKICAgIC8vIGlmIChhc3NldCA9PT0gMCkgewogICAgZnJhbWVfZGlnIC0yCiAgICBibnogc2VuZFJlZmVycmFsUGF5bWVudF9lbHNlX2JvZHlAOQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0OTgtNTA5CiAgICAvLyBpZCA9IGFiaUNhbGw8dHlwZW9mIFJld2FyZHMucHJvdG90eXBlLmNyZWF0ZUluc3RhbnREaXNidXJzZW1lbnQ+KHsKICAgIC8vICAgYXBwSWQ6IHJld2FyZHNBcHAsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHJld2FyZHNBcHApLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9ucy5sZW5ndGgpICsgc3VtCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgdGltZVRvVW5sb2NrLAogICAgLy8gICAgIGV4cGlyYXRpb24sCiAgICAvLyAgICAgYWxsb2NhdGlvbnMKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAyCiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIGZyYW1lX2RpZyA0CiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAzCiAgICAvLyBhbW91bnQ6IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9ucy5sZW5ndGgpICsgc3VtCiAgICBmcmFtZV9kaWcgMQogICAgZnJhbWVfZGlnIDMKICAgICsKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUwMS01MDQKICAgIC8vIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICBhbW91bnQ6IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9ucy5sZW5ndGgpICsgc3VtCiAgICAvLyB9KSwKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDk4LTUwOQogICAgLy8gaWQgPSBhYmlDYWxsPHR5cGVvZiBSZXdhcmRzLnByb3RvdHlwZS5jcmVhdGVJbnN0YW50RGlzYnVyc2VtZW50Pih7CiAgICAvLyAgIGFwcElkOiByZXdhcmRzQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBNaW5EaXNidXJzZW1lbnRzTUJSICsgKFVzZXJBbGxvY2F0aW9uTUJSICogYWxsb2NhdGlvbnMubGVuZ3RoKSArIHN1bQogICAgLy8gICAgIH0pLAogICAgLy8gICAgIHRpbWVUb1VubG9jaywKICAgIC8vICAgICBleHBpcmF0aW9uLAogICAgLy8gICAgIGFsbG9jYXRpb25zCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTA1CiAgICAvLyB0aW1lVG9VbmxvY2ssCiAgICBmcmFtZV9kaWcgNQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MDYKICAgIC8vIGV4cGlyYXRpb24sCiAgICBmcmFtZV9kaWcgMgogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0OTgtNTA5CiAgICAvLyBpZCA9IGFiaUNhbGw8dHlwZW9mIFJld2FyZHMucHJvdG90eXBlLmNyZWF0ZUluc3RhbnREaXNidXJzZW1lbnQ+KHsKICAgIC8vICAgYXBwSWQ6IHJld2FyZHNBcHAsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHJld2FyZHNBcHApLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9ucy5sZW5ndGgpICsgc3VtCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgdGltZVRvVW5sb2NrLAogICAgLy8gICAgIGV4cGlyYXRpb24sCiAgICAvLyAgICAgYWxsb2NhdGlvbnMKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDdiN2RjNWZjIC8vIG1ldGhvZCAiY3JlYXRlSW5zdGFudERpc2J1cnNlbWVudChwYXksdWludDY0LHVpbnQ2NCwoYWRkcmVzcyx1aW50NjQpW10pdWludDY0IgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIDAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBnaXR4biAxIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKCnNlbmRSZWZlcnJhbFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTQ0CiAgICAvLyByZXR1cm4geyBpZCwgY29zdCB9CiAgICBpdG9iCiAgICBmcmFtZV9kaWcgMQogICAgaXRvYgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU3Mi01NzkKICAgIC8vIGNvbnN0IHsgY29zdDogcmVmZXJyYWxNYnIgfSA9IGNyZWF0ZUluc3RhbnREaXNidXJzZW1lbnQoCiAgICAvLyAgIGFraXRhREFPLAogICAgLy8gICBhc3NldCwKICAgIC8vICAgR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIC8vICAgKEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgKyBPTkVfV0VFSyksCiAgICAvLyAgIFt7IGFkZHJlc3M6IHJlZmVycmVyLCBhbW91bnQ6IHJlZmVycmFsRmVlIH1dLAogICAgLy8gICByZWZlcnJhbEZlZQogICAgLy8gKQogICAgZXh0cmFjdCA4IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTgxCiAgICAvLyByZXR1cm4geyBsZWZ0b3ZlcjogKGFtb3VudCAtIHJlZmVycmFsRmVlKSwgcmVmZXJyYWxNYnIgfQogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgMwogICAgLQogICAgaXRvYgogICAgc3dhcAogICAgY29uY2F0CiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKc2VuZFJlZmVycmFsUGF5bWVudF9lbHNlX2JvZHlAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTExCiAgICAvLyBpZiAoIUFwcGxpY2F0aW9uKHJld2FyZHNBcHApLmFkZHJlc3MuaXNPcHRlZEluKEFzc2V0KGFzc2V0KSkpIHsKICAgIGZyYW1lX2RpZyA0CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBmcmFtZV9kaWcgLTIKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBieiBzZW5kUmVmZXJyYWxQYXltZW50X2lmX2JvZHlAMTAKICAgIGZyYW1lX2RpZyAxCgpzZW5kUmVmZXJyYWxQYXltZW50X2FmdGVyX2lmX2Vsc2VAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUyNS01NDEKICAgIC8vIGlkID0gYWJpQ2FsbDx0eXBlb2YgUmV3YXJkcy5wcm90b3R5cGUuY3JlYXRlSW5zdGFudEFzYURpc2J1cnNlbWVudD4oewogICAgLy8gICBhcHBJZDogcmV3YXJkc0FwcCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogTWluRGlzYnVyc2VtZW50c01CUiArIChVc2VyQWxsb2NhdGlvbk1CUiAqIGFsbG9jYXRpb25zLmxlbmd0aCkKICAgIC8vICAgICB9KSwKICAgIC8vICAgICBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgICAgYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgICAgIGFzc2V0QW1vdW50OiBzdW0sCiAgICAvLyAgICAgICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgdGltZVRvVW5sb2NrLAogICAgLy8gICAgIGV4cGlyYXRpb24sCiAgICAvLyAgICAgYWxsb2NhdGlvbnMKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTI5CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIGZyYW1lX2RpZyA0CiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGZyYW1lX2RpZyAxCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MjgtNTMxCiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBNaW5EaXNidXJzZW1lbnRzTUJSICsgKFVzZXJBbGxvY2F0aW9uTUJSICogYWxsb2NhdGlvbnMubGVuZ3RoKQogICAgLy8gfSksCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUzMi01MzYKICAgIC8vIGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgIGFzc2V0UmVjZWl2ZXI6IEFwcGxpY2F0aW9uKHJld2FyZHNBcHApLmFkZHJlc3MsCiAgICAvLyAgIGFzc2V0QW1vdW50OiBzdW0sCiAgICAvLyAgIHhmZXJBc3NldDogYXNzZXQKICAgIC8vIH0pLAogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUzMwogICAgLy8gYXNzZXRSZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIGR1cAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZnJhbWVfZGlnIC0yCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgZnJhbWVfZGlnIDMKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MzItNTM2CiAgICAvLyBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICBhc3NldEFtb3VudDogc3VtLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KSwKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTI1LTU0MQogICAgLy8gaWQgPSBhYmlDYWxsPHR5cGVvZiBSZXdhcmRzLnByb3RvdHlwZS5jcmVhdGVJbnN0YW50QXNhRGlzYnVyc2VtZW50Pih7CiAgICAvLyAgIGFwcElkOiByZXdhcmRzQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBNaW5EaXNidXJzZW1lbnRzTUJSICsgKFVzZXJBbGxvY2F0aW9uTUJSICogYWxsb2NhdGlvbnMubGVuZ3RoKQogICAgLy8gICAgIH0pLAogICAgLy8gICAgIGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgICBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYXNzZXRBbW91bnQ6IHN1bSwKICAgIC8vICAgICAgIHhmZXJBc3NldDogYXNzZXQKICAgIC8vICAgICB9KSwKICAgIC8vICAgICB0aW1lVG9VbmxvY2ssCiAgICAvLyAgICAgZXhwaXJhdGlvbiwKICAgIC8vICAgICBhbGxvY2F0aW9ucwogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUzNwogICAgLy8gdGltZVRvVW5sb2NrLAogICAgZnJhbWVfZGlnIDUKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTM4CiAgICAvLyBleHBpcmF0aW9uLAogICAgZnJhbWVfZGlnIDIKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTI1LTU0MQogICAgLy8gaWQgPSBhYmlDYWxsPHR5cGVvZiBSZXdhcmRzLnByb3RvdHlwZS5jcmVhdGVJbnN0YW50QXNhRGlzYnVyc2VtZW50Pih7CiAgICAvLyAgIGFwcElkOiByZXdhcmRzQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBNaW5EaXNidXJzZW1lbnRzTUJSICsgKFVzZXJBbGxvY2F0aW9uTUJSICogYWxsb2NhdGlvbnMubGVuZ3RoKQogICAgLy8gICAgIH0pLAogICAgLy8gICAgIGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgICBhc3NldFJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYXNzZXRBbW91bnQ6IHN1bSwKICAgIC8vICAgICAgIHhmZXJBc3NldDogYXNzZXQKICAgIC8vICAgICB9KSwKICAgIC8vICAgICB0aW1lVG9VbmxvY2ssCiAgICAvLyAgICAgZXhwaXJhdGlvbiwKICAgIC8vICAgICBhbGxvY2F0aW9ucwogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4YWYxYTE0ZjIgLy8gbWV0aG9kICJjcmVhdGVJbnN0YW50QXNhRGlzYnVyc2VtZW50KHBheSxheGZlcix1aW50NjQsdWludDY0LChhZGRyZXNzLHVpbnQ2NClbXSl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGdpdHhuIDIgTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgc3dhcAogICAgZnJhbWVfYnVyeSAxCiAgICBiIHNlbmRSZWZlcnJhbFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUAxMgoKc2VuZFJlZmVycmFsUGF5bWVudF9pZl9ib2R5QDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MTIKICAgIC8vIGNvc3QgKz0gR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBmcmFtZV9kaWcgMQogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUxMy01MjIKICAgIC8vIGFiaUNhbGw8dHlwZW9mIFJld2FyZHMucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiByZXdhcmRzQXBwLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIC8vICAgICB9KSwKICAgIC8vICAgICBBc3NldChhc3NldCkKICAgIC8vICAgXQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTE3CiAgICAvLyByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIGZyYW1lX2RpZyA0CiAgICBkdXAKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTE4CiAgICAvLyBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MTYtNTE5CiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIC8vIH0pLAogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MTMtNTIyCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBSZXdhcmRzLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogcmV3YXJkc0FwcCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgQXNzZXQoYXNzZXQpCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTIwCiAgICAvLyBBc3NldChhc3NldCkKICAgIGZyYW1lX2RpZyAtMgogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MTMtNTIyCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBSZXdhcmRzLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogcmV3YXJkc0FwcCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogQXBwbGljYXRpb24ocmV3YXJkc0FwcCkuYWRkcmVzcywKICAgIC8vICAgICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyAgICAgfSksCiAgICAvLyAgICAgQXNzZXQoYXNzZXQpCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBwdXNoYnl0ZXMgMHgzOTRlYWViMiAvLyBtZXRob2QgIm9wdEluKHBheSx1aW50NjQpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgYiBzZW5kUmVmZXJyYWxQYXltZW50X2FmdGVyX2lmX2Vsc2VAMTEKCnNlbmRSZWZlcnJhbFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1ODQKICAgIC8vIHJldHVybiB7IGxlZnRvdmVyOiBhbW91bnQsIHJlZmVycmFsTWJyOiAwIH0KICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNyZWF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTAKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIGJ5dGVjIDI4IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxMgogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgdW5jb3ZlciAzCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzEzCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgNiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxNAogICAgLy8gdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZSA9IGFraXRhREFPRXNjcm93CiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxMAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmluaXRbcm91dGluZ10oKSAtPiB2b2lkOgppbml0OgogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTgKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxOAogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTgKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MTkKICAgIC8vIGFzc2VydCghR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MuaXNPcHRlZEluKGFrdGEpLCBFUlJfQUxSRUFEWV9PUFRFRF9JTikKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICBkaWcgMQogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBhbHJlYWR5IG9wdGVkIGluCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzIxLTcyNwogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IDAsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcyMwogICAgLy8gYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzI0CiAgICAvLyBhc3NldEFtb3VudDogMCwKICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MjEtNzI2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFrdGEKICAgIC8vICAgfSkKICAgIHB1c2hpbnQgNCAvLyA0CiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3MjEtNzI3CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogMCwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFrdGEKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcyOQogICAgLy8gaWYgKCF0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MuaXNPcHRlZEluKGFrdGEpKSB7CiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlYyA2IC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzI5CiAgICAvLyBpZiAoIXRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcy5pc09wdGVkSW4oYWt0YSkpIHsKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBzd2FwCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIGJ1cnkgMQogICAgYm56IGluaXRfYWZ0ZXJfaWZfZWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgc3dhcAogICAgZHVwCiAgICBjb3ZlciAyCiAgICBidXJ5IDcKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGR1cAogICAgYnl0ZWMgMTEgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgY292ZXIgMgogICAgYnVyeSA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUwCiAgICAvLyBjb25zdCBbcGx1Z2luQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1BsdWdpbkFwcExpc3QpKQogICAgZHVwCiAgICBieXRlYyAxNiAvLyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6ODMKICAgIC8vIGNvbnN0IHsgcmV2ZW51ZU1hbmFnZXIgfSA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGR1cAogICAgZXh0cmFjdCA4IDgKICAgIHN3YXAKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBzd2FwCiAgICBieXRlYyAxMSAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NzAtNzMKICAgIC8vIGNvbnN0IGVzY3JvdyA9IGFiaUNhbGw8dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9nZXRFc2Nyb3dzPih7CiAgICAvLyAgIGFwcElkLAogICAgLy8gICBhcmdzOiBbW25hbWVdXSwKICAgIC8vIH0pLnJldHVyblZhbHVlWzBdCiAgICBpdHhuX2JlZ2luCiAgICBwdXNoYnl0ZXMgMHhhMjQwM2RkZiAvLyBtZXRob2QgImFyYzU4X2dldEVzY3Jvd3Moc3RyaW5nW10pKHVpbnQ2NCxib29sKVtdIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjcyCiAgICAvLyBhcmdzOiBbW25hbWVdXSwKICAgIHB1c2hieXRlcyAweDAwMDEwMDAyMDAwYTcyNjU3NjVmNzM2ZjYzNjk2MTZjCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo3MC03MwogICAgLy8gY29uc3QgZXNjcm93ID0gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2dldEVzY3Jvd3M+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFtbbmFtZV1dLAogICAgLy8gfSkucmV0dXJuVmFsdWVbMF0KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIGRpZyAxCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDkgLy8gOQogICAgKgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIHN3YXAKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbisodWludDY0LGJvb2wxKVtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NzUKICAgIC8vIGFzc2VydChlc2Nyb3cuaWQgIT09IDAsIEVSUl9FU0NST1dfRE9FU19OT1RfRVhJU1QpCiAgICBleHRyYWN0IDYgOQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGFzc2VydCAvLyBFc2Nyb3cgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjg2CiAgICAvLyBhc3NlcnQoaWQgPT09IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuaWQsIEVSUl9XUk9OR19FU0NST1dfRk9SX09QRVJBVElPTikKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDYgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjg2CiAgICAvLyBhc3NlcnQoaWQgPT09IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuaWQsIEVSUl9XUk9OR19FU0NST1dfRk9SX09QRVJBVElPTikKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBzd2FwCiAgICBkaWcgMQogICAgPT0KICAgIGFzc2VydCAvLyBXcm9uZyBlc2Nyb3cgZm9yIHRoaXMgb3BlcmF0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo4OC05NwogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW48dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9yZWtleVRvUGx1Z2luPih7CiAgICAvLyAgIGFwcElkOiB3YWxsZXQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgWzBdLCAvLyBhbGwgdGhlIGFraXRhIGVzY3Jvd3MgaGF2ZSBtZXRob2QgcmVzdHJpY3Rpb25zIHdpdGggb3B0aW4gYmVpbmcgaW5kZXggMAogICAgLy8gICAgIFtdCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgYnl0ZWMgMjkgLy8gbWV0aG9kICJhcmM1OF9yZWtleVRvUGx1Z2luKHVpbnQ2NCxib29sLHN0cmluZyx1aW50NjRbXSwodWludDY0LHVpbnQ2NClbXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo5MgogICAgLy8gdHJ1ZSwKICAgIGJ5dGVjIDEyIC8vIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo5MwogICAgLy8gbmFtZSwKICAgIHB1c2hieXRlcyAweDAwMGE3MjY1NzY1ZjczNmY2MzY5NjE2YwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjk0CiAgICAvLyBbMF0sIC8vIGFsbCB0aGUgYWtpdGEgZXNjcm93cyBoYXZlIG1ldGhvZCByZXN0cmljdGlvbnMgd2l0aCBvcHRpbiBiZWluZyBpbmRleCAwCiAgICBwdXNoYnl0ZXMgMHgwMDAxMDAwMDAwMDAwMDAwMDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjk1CiAgICAvLyBbXQogICAgYnl0ZWMgMTAgLy8gMHgwMDAwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo4OC05NwogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW48dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9yZWtleVRvUGx1Z2luPih7CiAgICAvLyAgIGFwcElkOiB3YWxsZXQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIG5hbWUsCiAgICAvLyAgICAgWzBdLCAvLyBhbGwgdGhlIGFraXRhIGVzY3Jvd3MgaGF2ZSBtZXRob2QgcmVzdHJpY3Rpb25zIHdpdGggb3B0aW4gYmVpbmcgaW5kZXggMAogICAgLy8gICAgIFtdCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTAxCiAgICAvLyB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU4OAogICAgLy8gbGV0IGNvdW50OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgYnVyeSA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5MAogICAgLy8gaWYgKCFlc2Nyb3cuaXNPcHRlZEluKGFzc2V0KSkgewogICAgZGlnIDEKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBibnogaW5pdF9hZnRlcl9pZl9lbHNlQDcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTkKICAgIC8vIGNvbnN0IFtzcGxpdHNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNSZXZlbnVlU3BsaXRzKSkKICAgIGRpZyA0CiAgICBwdXNoYnl0ZXMgInJldmVudWVfc3BsaXRzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTQKICAgIC8vIGNvdW50ICs9IHNwbGl0cy5sZW5ndGgKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1OTEKICAgIC8vIGNvdW50ICs9IDEKICAgIGludGNfMSAvLyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU5NAogICAgLy8gY291bnQgKz0gc3BsaXRzLmxlbmd0aAogICAgKwogICAgYnVyeSA0Cgppbml0X2FmdGVyX2lmX2Vsc2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEwNQogICAgLy8gY29uc3QgbWJyQW1vdW50OiB1aW50NjQgPSBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UgKiBvcHRJbkNvdW50CiAgICBnbG9iYWwgQXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGRpZyA0CiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMDctMTE4CiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBSZXZlbnVlTWFuYWdlclBsdWdpblN0dWIucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHdhbGxldCwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIFthc3NldC5pZF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gICAgIH0pCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjExNAogICAgLy8gcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDYgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjExNAogICAgLy8gcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTEzLTExNgogICAgLy8gaXR4bi5wYXltZW50KHsKICAgIC8vICAgcmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMDctMTE4CiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBSZXZlbnVlTWFuYWdlclBsdWdpblN0dWIucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHdhbGxldCwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIFthc3NldC5pZF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gICAgIH0pCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjExMAogICAgLy8gd2FsbGV0LAogICAgZGlnIDEKICAgIGR1cAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTEyCiAgICAvLyBbYXNzZXQuaWRdLAogICAgZGlnIDIKICAgIGl0b2IKICAgIGJ5dGVjIDIxIC8vIDB4MDAwMQogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMDctMTE4CiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBSZXZlbnVlTWFuYWdlclBsdWdpblN0dWIucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiByZXZlbnVlTWFuYWdlciwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHdhbGxldCwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIFthc3NldC5pZF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIHJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgICBhbW91bnQ6IG1ickFtb3VudAogICAgLy8gICAgIH0pCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBieXRlYyAyMiAvLyBtZXRob2QgIm9wdEluKHVpbnQ2NCxib29sLHVpbnQ2NFtdLHBheSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo5MgogICAgLy8gdHJ1ZSwKICAgIGJ5dGVjIDEyIC8vIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDMKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTA3LTExOAogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgUmV2ZW51ZU1hbmFnZXJQbHVnaW5TdHViLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogcmV2ZW51ZU1hbmFnZXIsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB3YWxsZXQsCiAgICAvLyAgICAgdHJ1ZSwKICAgIC8vICAgICBbYXNzZXQuaWRdLAogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICByZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgICAgYW1vdW50OiBtYnJBbW91bnQKICAgIC8vICAgICB9KQogICAgLy8gICBdCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTIwCiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfdmVyaWZ5QXV0aEFkZHJlc3M+KHsgYXBwSWQ6IHdhbGxldCB9KQogICAgaXR4bl9uZXh0CiAgICBieXRlYyAzMCAvLyBtZXRob2QgImFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTMyCiAgICAvLyBpdHhuQ29tcG9zZS5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKCmluaXRfYWZ0ZXJfaWZfZWxzZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxNwogICAgLy8gaW5pdCgpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLnBvc3Rbcm91dGluZ10oKSAtPiB2b2lkOgpwb3N0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc0MC03NDkKICAgIC8vIHBvc3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBub25jZTogYnl0ZXM8MjQ+LAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgZ2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBwdXNoaW50IDIgLy8gMgogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFsyNF0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc1MQogICAgLy8gYXNzZXJ0KEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgLSB0aW1lc3RhbXAgPD0gTUFYX1RJTUVTVEFNUF9EUklGVCwgRVJSX1RJTUVTVEFNUF9UT09fT0xEKQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZGlnIDYKICAgIC0KICAgIHB1c2hpbnQgNjAgLy8gNjAKICAgIDw9CiAgICBhc3NlcnQgLy8gUHJvdmlkZWQgdGltZXN0YW1wIGlzIHRvbyBmYXIgaW4gdGhlIHBhc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NTQKICAgIC8vIGNvbnN0IHBvc3RLZXkgPSBvcC5zaGEyNTYoVHhuLnNlbmRlci5ieXRlcy5jb25jYXQoaXRvYih0aW1lc3RhbXApKS5jb25jYXQobm9uY2UpKQogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciA2CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgNQogICAgY29uY2F0CiAgICBzaGEyNTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NTYKICAgIC8vIHRoaXMudmFsaWRhdGVUaXAodGlwLCBUaXBBY3Rpb25Qb3N0KQogICAgdW5jb3ZlciA1CiAgICBieXRlYyAxMyAvLyAweDBhCiAgICBjYWxsc3ViIHZhbGlkYXRlVGlwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzU3CiAgICAvLyB0aGlzLmNyZWF0ZVBvc3QocG9zdEtleSwgbWJyUGF5bWVudCwgY2lkLCBnYXRlSUQsIHVzZVBheVdhbGwsIHBheVdhbGxJRCwgUG9zdFR5cGVQb3N0LCBvcC5iemVybygzMikgYXMgYnl0ZXM8MzI+KQogICAgaW50Y18zIC8vIDMyCiAgICBiemVybwogICAgc3dhcAogICAgY292ZXIgNgogICAgY292ZXIgNgogICAgYnl0ZWNfMyAvLyAweDAwCiAgICB1bmNvdmVyIDcKICAgIGNhbGxzdWIgY3JlYXRlUG9zdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc0MC03NDkKICAgIC8vIHBvc3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBub25jZTogYnl0ZXM8MjQ+LAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgZ2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmVkaXRQb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKZWRpdFBvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzYwLTc2NQogICAgLy8gZWRpdFBvc3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPgogICAgLy8gKTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzY2CiAgICAvLyBhc3NlcnQodGhpcy5wb3N0cyhhbWVuZG1lbnQpLmV4aXN0cywgRVJSX1BPU1RfTk9UX0ZPVU5EKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQb3N0IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc2NwogICAgLy8gY29uc3QgeyBjcmVhdG9yLCByZWYsIGdhdGVJRCwgdXNlUGF5V2FsbCwgcGF5V2FsbElELCBwb3N0VHlwZSB9ID0gdGhpcy5wb3N0cyhhbWVuZG1lbnQpLnZhbHVlCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgc3dhcAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgZGlnIDIKICAgIHB1c2hpbnQgNTkgLy8gNTkKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMwogICAgbGVuCiAgICB1bmNvdmVyIDQKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMgogICAgcHVzaGludCA0MCAvLyA0MAogICAgaW50Y18yIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkaWcgMwogICAgcHVzaGludCA0OCAvLyA0OAogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBkaWcgNAogICAgcHVzaGludCA0OSAvLyA0OQogICAgaW50Y18yIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkaWcgNQogICAgcHVzaGludCA1OCAvLyA1OAogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzY4CiAgICAvLyBhc3NlcnQodGhpcy5pc0NyZWF0b3IoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9OT1RfWU9VUl9QT1NUX1RPX0VESVQpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTMKICAgIC8vIHJldHVybiBjcmVhdG9yID09PSBzZW5kZXIKICAgIHVuY292ZXIgNgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NjgKICAgIC8vIGFzc2VydCh0aGlzLmlzQ3JlYXRvcihjcmVhdG9yLCBUeG4uc2VuZGVyKSwgRVJSX05PVF9ZT1VSX1BPU1RfVE9fRURJVCkKICAgIGFzc2VydCAvLyBOb3QgeW91ciBwb3N0IHRvIGVkaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NjkKICAgIC8vIGFzc2VydCghdGhpcy5pc1JlcGx5KHBvc3RUeXBlKSwgRVJSX0lTX0FfUkVQTFkpCiAgICBkdXAKICAgIGNhbGxzdWIgaXNSZXBseQogICAgIQogICAgYXNzZXJ0IC8vIElzIGEgcmVwbHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NzAKICAgIC8vIGFzc2VydCghdGhpcy5pc0FtZW5kZWQocmVmLCBwb3N0VHlwZSksIEVSUl9JU19BTFJFQURZX0FNRU5ERUQpCiAgICBkaWcgNAogICAgc3dhcAogICAgY2FsbHN1YiBpc0FtZW5kZWQKICAgICEKICAgIGFzc2VydCAvLyBJcyBhbHJlYWR5IGFtZW5kZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NzQKICAgIC8vIGNvbnN0IGVkaXRLZXkgPSBvcC5zaGEyNTYoVHhuLnNlbmRlci5ieXRlcy5jb25jYXQoYW1lbmRtZW50KS5jb25jYXQoQnl0ZXMoY2lkKSkpCiAgICB0eG4gU2VuZGVyCiAgICBkaWcgNgogICAgY29uY2F0CiAgICBkaWcgNwogICAgY29uY2F0CiAgICBzaGEyNTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NzcKICAgIC8vIHRoaXMucG9zdHMoYW1lbmRtZW50KS52YWx1ZS5yZWYgPSByZWYuY29uY2F0KEJ5dGVzKCdhJykuY29uY2F0KGVkaXRLZXkpKQogICAgYnl0ZWMgMjMgLy8gImEiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICB1bmNvdmVyIDUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDUKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMQogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBwdXNoaW50IDU5IC8vIDU5CiAgICBleHRyYWN0X3VpbnQxNgogICAgdW5jb3ZlciAyCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAyCiAgICBleHRyYWN0MwogICAgc3dhcAogICAgY29uY2F0CiAgICBkaWcgNQogICAgYm94X2RlbAogICAgcG9wCiAgICB1bmNvdmVyIDUKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NzkKICAgIC8vIHRoaXMudmFsaWRhdGVUaXAodGlwLCBUaXBBY3Rpb25Qb3N0KQogICAgdW5jb3ZlciA2CiAgICBieXRlYyAxMyAvLyAweDBhCiAgICBjYWxsc3ViIHZhbGlkYXRlVGlwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzgwCiAgICAvLyB0aGlzLmNyZWF0ZVBvc3QoZWRpdEtleSwgbWJyUGF5bWVudCwgY2lkLCBnYXRlSUQsIHVzZVBheVdhbGwsIHBheVdhbGxJRCwgUG9zdFR5cGVFZGl0UG9zdCwgYW1lbmRtZW50KQogICAgdW5jb3ZlciA2CiAgICB1bmNvdmVyIDYKICAgIHVuY292ZXIgNQogICAgdW5jb3ZlciA1CiAgICB1bmNvdmVyIDUKICAgIGJ5dGVjIDI0IC8vIDB4MDIKICAgIHVuY292ZXIgNwogICAgY2FsbHN1YiBjcmVhdGVQb3N0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzYwLTc2NQogICAgLy8gZWRpdFBvc3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nYXRlZFJlcGx5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2F0ZWRSZXBseToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3ODMtNzk1CiAgICAvLyBnYXRlZFJlcGx5KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICBnYXRlVHhuOiBndHhuLkFwcGxpY2F0aW9uQ2FsbFR4biwKICAgIC8vICAgdGltZXN0YW1wOiB1aW50NjQsCiAgICAvLyAgIG5vbmNlOiBieXRlczwyND4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgdXNlUGF5V2FsbDogYm9vbGVhbiwKICAgIC8vICAgcGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMyAvLyAzCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNCAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXBwbAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFsyNF0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDYKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA3CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc5NgogICAgLy8gY29uc3QgeyByZWZCeXRlcywgY3JlYXRvcjogZmFsbGJhY2sgfSA9IHRoaXMudG9CeXRlczMyKHR5cGUsIHJlZikKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHRvQnl0ZXMzMgogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIHN3YXAKICAgIGV4dHJhY3QgMzIgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3OTkKICAgIC8vIGFzc2VydChHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gdGltZXN0YW1wIDw9IE1BWF9USU1FU1RBTVBfRFJJRlQsIEVSUl9USU1FU1RBTVBfVE9PX09MRCkKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGRpZyA4CiAgICAtCiAgICBwdXNoaW50IDYwIC8vIDYwCiAgICA8PQogICAgYXNzZXJ0IC8vIFByb3ZpZGVkIHRpbWVzdGFtcCBpcyB0b28gZmFyIGluIHRoZSBwYXN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MDEKICAgIC8vIGFzc2VydCh0aGlzLnBvc3RzKHJlZkJ5dGVzKS5leGlzdHMsIEVSUl9QT1NUX05PVF9GT1VORCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gUG9zdCBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MDIKICAgIC8vIGNvbnN0IHsgY3JlYXRvciwgZ2F0ZUlEOiBwb3N0R2F0ZUlEIH0gPSB0aGlzLnBvc3RzKHJlZkJ5dGVzKS52YWx1ZQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgc3dhcAogICAgcHVzaGludCA0MCAvLyA0MAogICAgaW50Y18yIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODAzCiAgICAvLyBhc3NlcnQoZ2F0ZUNoZWNrKGdhdGVUeG4sIHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIsIHBvc3RHYXRlSUQpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODAzCiAgICAvLyBhc3NlcnQoZ2F0ZUNoZWNrKGdhdGVUeG4sIHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIsIHBvc3RHYXRlSUQpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciAxMgogICAgY292ZXIgMgogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGdhdGVDaGVjawogICAgYXNzZXJ0IC8vIEdhdGUgY2hlY2sgZmFpbGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODA1CiAgICAvLyBjb25zdCBjID0gKGZhbGxiYWNrID09PSBHbG9iYWwuemVyb0FkZHJlc3MpID8gY3JlYXRvciA6IGZhbGxiYWNrCiAgICBkaWcgMQogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICA9PQogICAgc2VsZWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODA2CiAgICAvLyBjb25zdCBhZGRlZE1iciA9IHRoaXMuY3JlYXRlRW1wdHlQb3N0SWZOZWNlc3NhcnkocmVmQnl0ZXMsIGMpCiAgICBkaWcgMQogICAgc3dhcAogICAgY2FsbHN1YiBjcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgwOQogICAgLy8gY29uc3QgcmVwbHlLZXkgPSBvcC5zaGEyNTYoVHhuLnNlbmRlci5ieXRlcy5jb25jYXQoaXRvYih0aW1lc3RhbXApKS5jb25jYXQobm9uY2UpKQogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciA4CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgNwogICAgY29uY2F0CiAgICBzaGEyNTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MTEKICAgIC8vIHRoaXMudmFsaWRhdGVUaXAodGlwLCBUaXBBY3Rpb25SZWFjdCkKICAgIHVuY292ZXIgNwogICAgYnl0ZWMgNSAvLyAweDE0CiAgICBjYWxsc3ViIHZhbGlkYXRlVGlwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODEyCiAgICAvLyB0aGlzLmNyZWF0ZVJlcGx5KHJlcGx5S2V5LCBtYnJQYXltZW50LCBhZGRlZE1iciwgY2lkLCByZWZCeXRlcywgZ2F0ZUlELCB1c2VQYXlXYWxsLCBwYXlXYWxsSUQsIFBvc3RUeXBlUmVwbHksIG9wLmJ6ZXJvKDMyKSBhcyBieXRlczwzMj4pCiAgICBpbnRjXzMgLy8gMzIKICAgIGJ6ZXJvCiAgICBzd2FwCiAgICB1bmNvdmVyIDgKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDUKICAgIHVuY292ZXIgOAogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDgKICAgIGJ5dGVjIDE3IC8vIDB4MDEKICAgIHVuY292ZXIgOQogICAgY2FsbHN1YiBjcmVhdGVSZXBseQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjc4My03OTUKICAgIC8vIGdhdGVkUmVwbHkoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGdhdGVUeG46IGd0eG4uQXBwbGljYXRpb25DYWxsVHhuLAogICAgLy8gICB0aW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgbm9uY2U6IGJ5dGVzPDI0PiwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICB1c2VQYXlXYWxsOiBib29sZWFuLAogICAgLy8gICBwYXlXYWxsSUQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5yZXBseVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlcGx5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgxNS04MjYKICAgIC8vIHJlcGx5KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICB0aW1lc3RhbXA6IHVpbnQ2NCwKICAgIC8vICAgbm9uY2U6IGJ5dGVzPDI0PiwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICB1c2VQYXlXYWxsOiBib29sZWFuLAogICAgLy8gICBwYXlXYWxsSUQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAyNCAvLyAyNAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMjRdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzNiAvLyAzNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzZdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgOAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MjcKICAgIC8vIGNvbnN0IHsgcmVmQnl0ZXMsIGNyZWF0b3I6IGZhbGxiYWNrIH0gPSB0aGlzLnRvQnl0ZXMzMih0eXBlLCByZWYpCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgNAogICAgY2FsbHN1YiB0b0J5dGVzMzIKICAgIGR1cAogICAgZXh0cmFjdCAwIDMyCiAgICBzd2FwCiAgICBleHRyYWN0IDMyIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODMwCiAgICAvLyBhc3NlcnQoR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCAtIHRpbWVzdGFtcCA8PSBNQVhfVElNRVNUQU1QX0RSSUZULCBFUlJfVElNRVNUQU1QX1RPT19PTEQpCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBkaWcgOAogICAgLQogICAgcHVzaGludCA2MCAvLyA2MAogICAgPD0KICAgIGFzc2VydCAvLyBQcm92aWRlZCB0aW1lc3RhbXAgaXMgdG9vIGZhciBpbiB0aGUgcGFzdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODMyCiAgICAvLyBhc3NlcnQodGhpcy5wb3N0cyhyZWZCeXRlcykuZXhpc3RzLCBFUlJfUE9TVF9OT1RfRk9VTkQpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBvc3Qgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODMzCiAgICAvLyBjb25zdCB7IGNyZWF0b3IsIGdhdGVJRDogcG9zdEdhdGVJRCB9ID0gdGhpcy5wb3N0cyhyZWZCeXRlcykudmFsdWUKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGludGNfMyAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIHN3YXAKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgzNAogICAgLy8gYXNzZXJ0KHBvc3RHYXRlSUQgPT09IDAsIEVSUl9IQVNfR0FURSkKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGhhcyBhIGdhdGUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MzYKICAgIC8vIGNvbnN0IGMgPSAoZmFsbGJhY2sgPT09IEdsb2JhbC56ZXJvQWRkcmVzcykgPyBjcmVhdG9yIDogZmFsbGJhY2sKICAgIGRpZyAxCiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICBzZWxlY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MzcKICAgIC8vIGNvbnN0IGFkZGVkTWJyID0gdGhpcy5jcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeShyZWZCeXRlcywgYykKICAgIGRpZyAxCiAgICBzd2FwCiAgICBjYWxsc3ViIGNyZWF0ZUVtcHR5UG9zdElmTmVjZXNzYXJ5CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODQwCiAgICAvLyBjb25zdCByZXBseUtleSA9IG9wLnNoYTI1NihUeG4uc2VuZGVyLmJ5dGVzLmNvbmNhdChpdG9iKHRpbWVzdGFtcCkpLmNvbmNhdChub25jZSkpCiAgICB0eG4gU2VuZGVyCiAgICB1bmNvdmVyIDgKICAgIGl0b2IKICAgIGNvbmNhdAogICAgdW5jb3ZlciA3CiAgICBjb25jYXQKICAgIHNoYTI1NgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg0MgogICAgLy8gdGhpcy52YWxpZGF0ZVRpcCh0aXAsIFRpcEFjdGlvblJlYWN0KQogICAgdW5jb3ZlciA3CiAgICBieXRlYyA1IC8vIDB4MTQKICAgIGNhbGxzdWIgdmFsaWRhdGVUaXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NDMKICAgIC8vIHRoaXMuY3JlYXRlUmVwbHkocmVwbHlLZXksIG1iclBheW1lbnQsIGFkZGVkTWJyLCBjaWQsIHJlZkJ5dGVzLCBnYXRlSUQsIHVzZVBheVdhbGwsIHBheVdhbGxJRCwgUG9zdFR5cGVSZXBseSwgb3AuYnplcm8oMzIpIGFzIGJ5dGVzPDMyPikKICAgIGludGNfMyAvLyAzMgogICAgYnplcm8KICAgIHN3YXAKICAgIHVuY292ZXIgOAogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDgKICAgIHVuY292ZXIgNQogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDgKICAgIHVuY292ZXIgOAogICAgYnl0ZWMgMTcgLy8gMHgwMQogICAgdW5jb3ZlciA5CiAgICBjYWxsc3ViIGNyZWF0ZVJlcGx5CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODE1LTgyNgogICAgLy8gcmVwbHkoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHRpbWVzdGFtcDogdWludDY0LAogICAgLy8gICBub25jZTogYnl0ZXM8MjQ+LAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgZ2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHVzZVBheVdhbGw6IGJvb2xlYW4sCiAgICAvLyAgIHBheVdhbGxJRDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmdhdGVkRWRpdFJlcGx5W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2F0ZWRFZGl0UmVwbHk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODQ2LTg1MgogICAgLy8gZ2F0ZWRFZGl0UmVwbHkoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGdhdGVUeG46IGd0eG4uQXBwbGljYXRpb25DYWxsVHhuLAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgYW1lbmRtZW50OiBieXRlczwzMj4sCiAgICAvLyApOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBwdXNoaW50IDMgLy8gMwogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMiAvLyAyCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGFwcGwKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszNl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg1MwogICAgLy8gY29uc3Qgd2FsbGV0ID0gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODUzCiAgICAvLyBjb25zdCB3YWxsZXQgPSBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8odGhpcy5ha2l0YURBTy52YWx1ZSwgVHhuLnNlbmRlcikKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIGdldFdhbGxldElEVXNpbmdBa2l0YURBTwogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NTUKICAgIC8vIGFzc2VydCh0aGlzLnBvc3RzKGFtZW5kbWVudCkuZXhpc3RzLCBFUlJfUkVQTFlfTk9UX0ZPVU5EKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBSZXBseSBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NTYKICAgIC8vIGNvbnN0IHsgY3JlYXRvciwgcmVmLCBnYXRlSUQsIHVzZVBheVdhbGwsIHBheVdhbGxJRCwgcG9zdFR5cGUgfSA9IHRoaXMucG9zdHMoYW1lbmRtZW50KS52YWx1ZQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIHN3YXAKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGludGNfMyAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIGRpZyAyCiAgICBwdXNoaW50IDU5IC8vIDU5CiAgICBleHRyYWN0X3VpbnQxNgogICAgZGlnIDMKICAgIGxlbgogICAgdW5jb3ZlciA0CiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBleHRyYWN0IDIgMAogICAgZGlnIDIKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZGlnIDMKICAgIHB1c2hpbnQgNDggLy8gNDgKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgZGlnIDQKICAgIHB1c2hpbnQgNDkgLy8gNDkKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgZGlnIDUKICAgIHB1c2hpbnQgNTggLy8gNTgKICAgIGludGNfMSAvLyAxCiAgICBib3hfZXh0cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg1NwogICAgLy8gYXNzZXJ0KHRoaXMuaXNDcmVhdG9yKGNyZWF0b3IsIFR4bi5zZW5kZXIpLCBFUlJfTk9UX1lPVVJfUE9TVF9UT19FRElUKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUzCiAgICAvLyByZXR1cm4gY3JlYXRvciA9PT0gc2VuZGVyCiAgICB1bmNvdmVyIDYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODU3CiAgICAvLyBhc3NlcnQodGhpcy5pc0NyZWF0b3IoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9OT1RfWU9VUl9QT1NUX1RPX0VESVQpCiAgICBhc3NlcnQgLy8gTm90IHlvdXIgcG9zdCB0byBlZGl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODU4CiAgICAvLyBhc3NlcnQodGhpcy5pc1JlcGx5KHBvc3RUeXBlKSwgRVJSX05PVF9BX1JFUExZKQogICAgZHVwCiAgICBjYWxsc3ViIGlzUmVwbHkKICAgIGFzc2VydCAvLyBOb3QgYSByZXBseQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg1OQogICAgLy8gYXNzZXJ0KCF0aGlzLmlzQW1lbmRlZChyZWYsIHBvc3RUeXBlKSwgRVJSX0lTX0FMUkVBRFlfQU1FTkRFRCkKICAgIGRpZyA0CiAgICBzd2FwCiAgICBjYWxsc3ViIGlzQW1lbmRlZAogICAgIQogICAgYXNzZXJ0IC8vIElzIGFscmVhZHkgYW1lbmRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg2MgogICAgLy8gY29uc3QgZWRpdEtleSA9IG9wLnNoYTI1NihUeG4uc2VuZGVyLmJ5dGVzLmNvbmNhdChhbWVuZG1lbnQpLmNvbmNhdChCeXRlcyhjaWQpKSkKICAgIHR4biBTZW5kZXIKICAgIGRpZyA2CiAgICBjb25jYXQKICAgIGRpZyA3CiAgICBjb25jYXQKICAgIHNoYTI1NgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg2NQogICAgLy8gdGhpcy5wb3N0cyhhbWVuZG1lbnQpLnZhbHVlLnJlZiA9IHJlZi5jb25jYXQoQnl0ZXMoJ2EnKS5jb25jYXQoZWRpdEtleSkpCiAgICBieXRlYyAyMyAvLyAiYSIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyA1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGRpZyA2CiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZGlnIDEKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBkaWcgMQogICAgcHVzaGludCA1OSAvLyA1OQogICAgZXh0cmFjdF91aW50MTYKICAgIHVuY292ZXIgMgogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgZXh0cmFjdDMKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDYKICAgIGJveF9kZWwKICAgIHBvcAogICAgdW5jb3ZlciA2CiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODY4CiAgICAvLyBjb25zdCBwYXJlbnRQb3N0UmVmID0gcmVmLnNsaWNlKDM2LCA2OCkudG9GaXhlZCh7IGxlbmd0aDogMzIgfSkKICAgIGRpZyA0CiAgICBsZW4KICAgIHB1c2hpbnQgMzYgLy8gMzYKICAgIGRpZyAxCiAgICA+PQogICAgcHVzaGludCAzNiAvLyAzNgogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBwdXNoaW50IDY4IC8vIDY4CiAgICBkaWcgMgogICAgPj0KICAgIHB1c2hpbnQgNjggLy8gNjgKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHVuY292ZXIgNgogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODY5CiAgICAvLyBjb25zdCB7IGdhdGVJRDogb2dQb3N0R2F0ZUlEIH0gPSB0aGlzLnBvc3RzKHBhcmVudFBvc3RSZWYpLnZhbHVlCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBpbnRjXzIgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NzAKICAgIC8vIGFzc2VydChnYXRlQ2hlY2soZ2F0ZVR4biwgdGhpcy5ha2l0YURBTy52YWx1ZSwgVHhuLnNlbmRlciwgb2dQb3N0R2F0ZUlEKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3MAogICAgLy8gYXNzZXJ0KGdhdGVDaGVjayhnYXRlVHhuLCB0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyLCBvZ1Bvc3RHYXRlSUQpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciAxMAogICAgY292ZXIgMgogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGdhdGVDaGVjawogICAgYXNzZXJ0IC8vIEdhdGUgY2hlY2sgZmFpbGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODcyCiAgICAvLyB0aGlzLnZhbGlkYXRlVGlwKHRpcCwgVGlwQWN0aW9uUmVhY3QpCiAgICB1bmNvdmVyIDcKICAgIGJ5dGVjIDUgLy8gMHgxNAogICAgY2FsbHN1YiB2YWxpZGF0ZVRpcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg3MwogICAgLy8gdGhpcy5jcmVhdGVSZXBseShlZGl0S2V5LCBtYnJQYXltZW50LCAwLCBjaWQsIHBhcmVudFBvc3RSZWYsIGdhdGVJRCwgdXNlUGF5V2FsbCwgcGF5V2FsbElELCBQb3N0VHlwZUVkaXRSZXBseSwgYW1lbmRtZW50KQogICAgc3dhcAogICAgdW5jb3ZlciA3CiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDQKICAgIHVuY292ZXIgNwogICAgdW5jb3ZlciA3CiAgICB1bmNvdmVyIDcKICAgIGJ5dGVjIDE0IC8vIDB4MDMKICAgIHVuY292ZXIgOQogICAgY2FsbHN1YiBjcmVhdGVSZXBseQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg0Ni04NTIKICAgIC8vIGdhdGVkRWRpdFJlcGx5KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICBnYXRlVHhuOiBndHhuLkFwcGxpY2F0aW9uQ2FsbFR4biwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIGFtZW5kbWVudDogYnl0ZXM8MzI+LAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5lZGl0UmVwbHlbcm91dGluZ10oKSAtPiB2b2lkOgplZGl0UmVwbHk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODc2LTg4MQogICAgLy8gZWRpdFJlcGx5KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICBjaWQ6IENJRCwKICAgIC8vICAgYW1lbmRtZW50OiBieXRlczwzMj4KICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMiAvLyAyCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNCAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAzNiAvLyAzNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzZdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg4MgogICAgLy8gYXNzZXJ0KHRoaXMucG9zdHMoYW1lbmRtZW50KS5leGlzdHMsIEVSUl9SRVBMWV9OT1RfRk9VTkQpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFJlcGx5IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg4MwogICAgLy8gY29uc3QgeyBjcmVhdG9yLCByZWYsIGdhdGVJRCwgdXNlUGF5V2FsbCwgcGF5V2FsbElELCBwb3N0VHlwZSB9ID0gdGhpcy5wb3N0cyhhbWVuZG1lbnQpLnZhbHVlCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgc3dhcAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgZGlnIDIKICAgIHB1c2hpbnQgNTkgLy8gNTkKICAgIGV4dHJhY3RfdWludDE2CiAgICBkaWcgMwogICAgbGVuCiAgICB1bmNvdmVyIDQKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMgogICAgcHVzaGludCA0MCAvLyA0MAogICAgaW50Y18yIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkaWcgMwogICAgcHVzaGludCA0OCAvLyA0OAogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBkaWcgNAogICAgcHVzaGludCA0OSAvLyA0OQogICAgaW50Y18yIC8vIDgKICAgIGJveF9leHRyYWN0CiAgICBidG9pCiAgICBkaWcgNQogICAgcHVzaGludCA1OCAvLyA1OAogICAgaW50Y18xIC8vIDEKICAgIGJveF9leHRyYWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODg0CiAgICAvLyBhc3NlcnQodGhpcy5pc0NyZWF0b3IoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9OT1RfWU9VUl9QT1NUX1RPX0VESVQpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTMKICAgIC8vIHJldHVybiBjcmVhdG9yID09PSBzZW5kZXIKICAgIHVuY292ZXIgNgogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4ODQKICAgIC8vIGFzc2VydCh0aGlzLmlzQ3JlYXRvcihjcmVhdG9yLCBUeG4uc2VuZGVyKSwgRVJSX05PVF9ZT1VSX1BPU1RfVE9fRURJVCkKICAgIGFzc2VydCAvLyBOb3QgeW91ciBwb3N0IHRvIGVkaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4ODUKICAgIC8vIGFzc2VydCh0aGlzLmlzUmVwbHkocG9zdFR5cGUpLCBFUlJfTk9UX0FfUkVQTFkpCiAgICBkdXAKICAgIGNhbGxzdWIgaXNSZXBseQogICAgYXNzZXJ0IC8vIE5vdCBhIHJlcGx5CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODg2CiAgICAvLyBhc3NlcnQoIXRoaXMuaXNBbWVuZGVkKHJlZiwgcG9zdFR5cGUpLCBFUlJfSVNfQUxSRUFEWV9BTUVOREVEKQogICAgZGlnIDQKICAgIHN3YXAKICAgIGNhbGxzdWIgaXNBbWVuZGVkCiAgICAhCiAgICBhc3NlcnQgLy8gSXMgYWxyZWFkeSBhbWVuZGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODg5CiAgICAvLyBjb25zdCBlZGl0S2V5ID0gb3Auc2hhMjU2KFR4bi5zZW5kZXIuYnl0ZXMuY29uY2F0KGFtZW5kbWVudCkuY29uY2F0KEJ5dGVzKGNpZCkpKQogICAgdHhuIFNlbmRlcgogICAgZGlnIDYKICAgIGNvbmNhdAogICAgZGlnIDcKICAgIGNvbmNhdAogICAgc2hhMjU2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODkyCiAgICAvLyB0aGlzLnBvc3RzKGFtZW5kbWVudCkudmFsdWUucmVmID0gcmVmLmNvbmNhdChCeXRlcygnYScpLmNvbmNhdChlZGl0S2V5KSkKICAgIGJ5dGVjIDIzIC8vICJhIgogICAgZGlnIDEKICAgIGNvbmNhdAogICAgZGlnIDUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZGlnIDYKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBkaWcgMQogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBwdXNoaW50IDU5IC8vIDU5CiAgICBleHRyYWN0X3VpbnQxNgogICAgdW5jb3ZlciAyCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAyCiAgICBleHRyYWN0MwogICAgc3dhcAogICAgY29uY2F0CiAgICBkaWcgNgogICAgYm94X2RlbAogICAgcG9wCiAgICB1bmNvdmVyIDYKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4OTUKICAgIC8vIGNvbnN0IHBhcmVudFBvc3RSZWYgPSByZWYuc2xpY2UoMzYsIDY4KS50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KQogICAgZGlnIDQKICAgIGxlbgogICAgcHVzaGludCAzNiAvLyAzNgogICAgZGlnIDEKICAgID49CiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHB1c2hpbnQgNjggLy8gNjgKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCA2OCAvLyA2OAogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgdW5jb3ZlciA2CiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4OTYKICAgIC8vIGNvbnN0IHsgZ2F0ZUlEOiBvZ1Bvc3RHYXRlSUQgfSA9IHRoaXMucG9zdHMocGFyZW50UG9zdFJlZikudmFsdWUKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg5NwogICAgLy8gYXNzZXJ0KG9nUG9zdEdhdGVJRCA9PT0gMCwgRVJSX0hBU19HQVRFKQogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgaGFzIGEgZ2F0ZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg5OQogICAgLy8gdGhpcy52YWxpZGF0ZVRpcCh0aXAsIFRpcEFjdGlvblJlYWN0KQogICAgdW5jb3ZlciA3CiAgICBieXRlYyA1IC8vIDB4MTQKICAgIGNhbGxzdWIgdmFsaWRhdGVUaXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MDAKICAgIC8vIHRoaXMuY3JlYXRlUmVwbHkoZWRpdEtleSwgbWJyUGF5bWVudCwgMCwgY2lkLCBwYXJlbnRQb3N0UmVmLCBnYXRlSUQsIHVzZVBheVdhbGwsIHBheVdhbGxJRCwgUG9zdFR5cGVFZGl0UmVwbHksIGFtZW5kbWVudCkKICAgIHN3YXAKICAgIHVuY292ZXIgNwogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgOAogICAgdW5jb3ZlciA0CiAgICB1bmNvdmVyIDcKICAgIHVuY292ZXIgNwogICAgdW5jb3ZlciA3CiAgICBieXRlYyAxNCAvLyAweDAzCiAgICB1bmNvdmVyIDkKICAgIGNhbGxzdWIgY3JlYXRlUmVwbHkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4NzYtODgxCiAgICAvLyBlZGl0UmVwbHkoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGNpZDogQ0lELAogICAgLy8gICBhbWVuZG1lbnQ6IGJ5dGVzPDMyPgogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC52b3RlW3JvdXRpbmddKCkgLT4gdm9pZDoKdm90ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MDMtOTA5CiAgICAvLyB2b3RlKAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBpc1VwOiBib29sZWFuCiAgICAvLyApOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBwdXNoaW50IDIgLy8gMgogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBwdXNoaW50IDQgLy8gYXhmZXIKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBheGZlcgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkxMAogICAgLy8gbGV0IHsgcmVmQnl0ZXMsIGNyZWF0b3IgfSA9IHRoaXMudG9CeXRlczMyKHR5cGUsIHJlZikKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBjYWxsc3ViIHRvQnl0ZXMzMgogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIGNvdmVyIDIKICAgIGV4dHJhY3QgMzIgMzIKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MTEKICAgIC8vIGlmICh0eXBlID09PSBSZWZUeXBlUG9zdCkgewogICAgYnl0ZWMgMTMgLy8gMHgwYQogICAgPT0KICAgIGJ6IHZvdGVfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MTIKICAgIC8vIGFzc2VydCh0aGlzLnBvc3RzKHJlZkJ5dGVzKS5leGlzdHMsIEVSUl9QT1NUX05PVF9GT1VORCk7CiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBvc3Qgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTEzCiAgICAvLyAoeyBjcmVhdG9yIH0gPSB0aGlzLnBvc3RzKHJlZkJ5dGVzKS52YWx1ZSk7CiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgYnVyeSAxCgp2b3RlX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MTYKICAgIC8vIGNvbnN0IGFkZGVkTWJyID0gdGhpcy5jcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeShyZWZCeXRlcywgY3JlYXRvcikKICAgIGRpZyAxCiAgICBkdXAKICAgIGRpZyAyCiAgICBjYWxsc3ViIGNyZWF0ZUVtcHR5UG9zdElmTmVjZXNzYXJ5CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTE4CiAgICAvLyB0aGlzLnZhbGlkYXRlVGlwKHRpcCwgVGlwQWN0aW9uUmVhY3QpCiAgICBkaWcgNQogICAgYnl0ZWMgNSAvLyAweDE0CiAgICBjYWxsc3ViIHZhbGlkYXRlVGlwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTE5CiAgICAvLyBjb25zdCBtYnJOZWVkZWQ6IHVpbnQ2NCA9IHRoaXMubWJyKEJ5dGVzKCcnKSkudm90ZWxpc3QgKyBhZGRlZE1icgogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGludGNfMyAvLyAzMgogICAgZXh0cmFjdF91aW50NjQKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MjAKICAgIC8vIHRoaXMuY3JlYXRlVm90ZShtYnJQYXltZW50LCBtYnJOZWVkZWQsIHJlZkJ5dGVzLCBpc1VwKQogICAgZGlnIDYKICAgIHN3YXAKICAgIHVuY292ZXIgMgogICAgZGlnIDUKICAgIGNhbGxzdWIgY3JlYXRlVm90ZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkwMy05MDkKICAgIC8vIHZvdGUoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIGlzVXA6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuZWRpdFZvdGVbcm91dGluZ10oKSAtPiB2b2lkOgplZGl0Vm90ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MjMtOTI4CiAgICAvLyBlZGl0Vm90ZSgKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICB0aXA6IGd0eG4uQXNzZXRUcmFuc2ZlclR4biwKICAgIC8vICAgcmVmOiBieXRlczwzMj4sCiAgICAvLyAgIGZsaXA6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMiAvLyAyCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNCAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXBuIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MjkKICAgIC8vIGNvbnN0IHZvdGVMaXN0S2V5OiBWb3RlTGlzdEtleSA9IHsgdXNlcjogYjE2KFR4bi5zZW5kZXIuYnl0ZXMpLCByZWY6IGIxNihyZWYpIH0KICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgYjE2CiAgICBkaWcgMgogICAgY2FsbHN1YiBiMTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyCiAgICAvLyB2b3RlbGlzdCA9IEJveE1hcDxWb3RlTGlzdEtleSwgVm90ZUxpc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4Vm90ZUxpc3QgfSkKICAgIGJ5dGVjIDE1IC8vICJvIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTMwCiAgICAvLyBhc3NlcnQodGhpcy52b3RlbGlzdCh2b3RlTGlzdEtleSkuZXhpc3RzLCBFUlJfSEFWRU5UX1ZPVEVEKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBZb3UgaGF2ZW4ndCB2b3RlZCBvbiB0aGlzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTMyCiAgICAvLyBjb25zdCB7IGltcGFjdCwgaXNVcCB9ID0gdGhpcy52b3RlbGlzdCh2b3RlTGlzdEtleSkudmFsdWUKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTM1CiAgICAvLyB0aGlzLnVwZGF0ZVZvdGVzKHJlZiwgIWlzVXAsIGltcGFjdCkKICAgICEKICAgIGR1cAogICAgY292ZXIgNQogICAgdW5jb3ZlciA0CiAgICBzd2FwCiAgICB1bmNvdmVyIDIKICAgIGNhbGxzdWIgdXBkYXRlVm90ZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MzgKICAgIC8vIHRoaXMudm90ZWxpc3Qodm90ZUxpc3RLZXkpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDEKICAgIC8vIGlmICghZmxpcCkgewogICAgYm56IGVkaXRWb3RlX2FmdGVyX2lmX2Vsc2VANAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk0My05NDgKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS52b3RlbGlzdAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDUKICAgIC8vIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk0NgogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLnZvdGVsaXN0CiAgICBwdXNoYnl0ZXMgIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgaW50Y18zIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDMtOTQ3CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkudm90ZWxpc3QKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NDMtOTQ4CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkudm90ZWxpc3QKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAoKZWRpdFZvdGVfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmVkaXRWb3RlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTIzLTkyOAogICAgLy8gZWRpdFZvdGUoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+LAogICAgLy8gICBmbGlwOiBib29sZWFuCiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmVkaXRWb3RlX2FmdGVyX2lmX2Vsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NTQKICAgIC8vIHRoaXMudmFsaWRhdGVUaXAodGlwLCBUaXBBY3Rpb25SZWFjdCkKICAgIGRpZyAyCiAgICBieXRlYyA1IC8vIDB4MTQKICAgIGNhbGxzdWIgdmFsaWRhdGVUaXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NTUKICAgIC8vIHRoaXMuY3JlYXRlVm90ZShtYnJQYXltZW50LCAwLCByZWYsICFpc1VwKQogICAgZGlnIDMKICAgIGludGNfMCAvLyAwCiAgICBkaWcgMwogICAgZGlnIDMKICAgIGNhbGxzdWIgY3JlYXRlVm90ZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjkyMy05MjgKICAgIC8vIGVkaXRWb3RlKAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICByZWY6IGJ5dGVzPDMyPiwKICAgIC8vICAgZmxpcDogYm9vbGVhbgogICAgLy8gKTogdm9pZCB7CiAgICBiIGVkaXRWb3RlX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5lZGl0Vm90ZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nYXRlZFJlYWN0W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2F0ZWRSZWFjdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NTgtOTY1CiAgICAvLyBnYXRlZFJlYWN0KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICBnYXRlVHhuOiBndHhuLkFwcGxpY2F0aW9uQ2FsbFR4biwKICAgIC8vICAgcmVmOiBieXRlcywKICAgIC8vICAgdHlwZTogUmVmVHlwZSwKICAgIC8vICAgTkZUOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIHB1c2hpbnQgMyAvLyAzCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNCAvLyBheGZlcgogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIGF4ZmVyCiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXBwbAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NjYKICAgIC8vIGNvbnN0IHsgcmVmQnl0ZXMsIGNyZWF0b3I6IGZhbGxiYWNrIH0gPSB0aGlzLnRvQnl0ZXMzMih0eXBlLCByZWYpCiAgICBzd2FwCiAgICB1bmNvdmVyIDIKICAgIGNhbGxzdWIgdG9CeXRlczMyCiAgICBkdXAKICAgIGV4dHJhY3QgMCAzMgogICAgc3dhcAogICAgZXh0cmFjdCAzMiAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICBkaWcgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTY4CiAgICAvLyBhc3NlcnQodGhpcy5wb3N0cyhyZWZCeXRlcykuZXhpc3RzLCBFUlJfUE9TVF9OT1RfRk9VTkQpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBvc3Qgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTY5CiAgICAvLyBjb25zdCB7IGNyZWF0b3IsIGdhdGVJRCB9ID0gdGhpcy5wb3N0cyhyZWZCeXRlcykudmFsdWUKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGludGNfMyAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIHN3YXAKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGludGNfMiAvLyA4CiAgICBib3hfZXh0cmFjdAogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3MAogICAgLy8gYXNzZXJ0KGdhdGVDaGVjayhnYXRlVHhuLCB0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyLCBnYXRlSUQpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTcwCiAgICAvLyBhc3NlcnQoZ2F0ZUNoZWNrKGdhdGVUeG4sIHRoaXMuYWtpdGFEQU8udmFsdWUsIFR4bi5zZW5kZXIsIGdhdGVJRCksIEVSUl9GQUlMRURfR0FURSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICB0eG4gU2VuZGVyCiAgICB1bmNvdmVyIDcKICAgIGNvdmVyIDIKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBnYXRlQ2hlY2sKICAgIGFzc2VydCAvLyBHYXRlIGNoZWNrIGZhaWxlZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3MgogICAgLy8gY29uc3QgYyA9IChmYWxsYmFjayA9PT0gR2xvYmFsLnplcm9BZGRyZXNzKSA/IGNyZWF0b3IgOiBmYWxsYmFjawogICAgZGlnIDEKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgPT0KICAgIHNlbGVjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3MwogICAgLy8gY29uc3QgYWRkZWRNYnIgPSB0aGlzLmNyZWF0ZUVtcHR5UG9zdElmTmVjZXNzYXJ5KHJlZkJ5dGVzLCBjKQogICAgZGlnIDEKICAgIHN3YXAKICAgIGNhbGxzdWIgY3JlYXRlRW1wdHlQb3N0SWZOZWNlc3NhcnkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NzUKICAgIC8vIHRoaXMudmFsaWRhdGVUaXAodGlwLCBUaXBBY3Rpb25SZWFjdCkKICAgIHVuY292ZXIgMwogICAgYnl0ZWMgNSAvLyAweDE0CiAgICBjYWxsc3ViIHZhbGlkYXRlVGlwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTc2CiAgICAvLyB0aGlzLmNyZWF0ZVJlYWN0aW9uKG1iclBheW1lbnQsIGFkZGVkTWJyLCByZWZCeXRlcywgTkZUKQogICAgdW5jb3ZlciAzCiAgICBzd2FwCiAgICB1bmNvdmVyIDIKICAgIHVuY292ZXIgMwogICAgY2FsbHN1YiBjcmVhdGVSZWFjdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk1OC05NjUKICAgIC8vIGdhdGVkUmVhY3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIGdhdGVUeG46IGd0eG4uQXBwbGljYXRpb25DYWxsVHhuLAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBORlQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5yZWFjdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlYWN0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3OS05ODUKICAgIC8vIHJlYWN0KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHRpcDogZ3R4bi5Bc3NldFRyYW5zZmVyVHhuLAogICAgLy8gICByZWY6IGJ5dGVzLAogICAgLy8gICB0eXBlOiBSZWZUeXBlLAogICAgLy8gICBORlQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA0IC8vIGF4ZmVyCiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgYXhmZXIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDgKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTg2CiAgICAvLyBjb25zdCB7IHJlZkJ5dGVzLCBjcmVhdG9yOiBmYWxsYmFjayB9ID0gdGhpcy50b0J5dGVzMzIodHlwZSwgcmVmKQogICAgc3dhcAogICAgdW5jb3ZlciAyCiAgICBjYWxsc3ViIHRvQnl0ZXMzMgogICAgZHVwCiAgICBleHRyYWN0IDAgMzIKICAgIHN3YXAKICAgIGV4dHJhY3QgMzIgMzIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZGlnIDIKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk4OAogICAgLy8gYXNzZXJ0KHRoaXMucG9zdHMocmVmQnl0ZXMpLmV4aXN0cywgRVJSX1BPU1RfTk9UX0ZPVU5EKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQb3N0IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk4OQogICAgLy8gY29uc3QgeyBjcmVhdG9yLCBnYXRlSUQ6IHBvc3RHYXRlSUQgfSA9IHRoaXMucG9zdHMocmVmQnl0ZXMpLnZhbHVlCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBpbnRjXzMgLy8gMzIKICAgIGJveF9leHRyYWN0CiAgICBzd2FwCiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBpbnRjXzIgLy8gOAogICAgYm94X2V4dHJhY3QKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5OTAKICAgIC8vIGFzc2VydChwb3N0R2F0ZUlEID09PSAwLCBFUlJfSEFTX0dBVEUpCiAgICAhCiAgICBhc3NlcnQgLy8gVGhpcyBoYXMgYSBnYXRlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTkyCiAgICAvLyBjb25zdCBjID0gKGZhbGxiYWNrID09PSBHbG9iYWwuemVyb0FkZHJlc3MpID8gY3JlYXRvciA6IGZhbGxiYWNrCiAgICBkaWcgMQogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICA9PQogICAgc2VsZWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTkzCiAgICAvLyBjb25zdCBhZGRlZE1iciA9IHRoaXMuY3JlYXRlRW1wdHlQb3N0SWZOZWNlc3NhcnkocmVmQnl0ZXMsIGMpCiAgICBkaWcgMQogICAgc3dhcAogICAgY2FsbHN1YiBjcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk5NQogICAgLy8gdGhpcy52YWxpZGF0ZVRpcCh0aXAsIFRpcEFjdGlvblJlYWN0KQogICAgdW5jb3ZlciAzCiAgICBieXRlYyA1IC8vIDB4MTQKICAgIGNhbGxzdWIgdmFsaWRhdGVUaXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5OTYKICAgIC8vIHRoaXMuY3JlYXRlUmVhY3Rpb24obWJyUGF5bWVudCwgYWRkZWRNYnIsIHJlZkJ5dGVzLCBORlQpCiAgICB1bmNvdmVyIDMKICAgIHN3YXAKICAgIHVuY292ZXIgMgogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGNyZWF0ZVJlYWN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTc5LTk4NQogICAgLy8gcmVhY3QoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdGlwOiBndHhuLkFzc2V0VHJhbnNmZXJUeG4sCiAgICAvLyAgIHJlZjogYnl0ZXMsCiAgICAvLyAgIHR5cGU6IFJlZlR5cGUsCiAgICAvLyAgIE5GVDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmRlbGV0ZVJlYWN0aW9uW3JvdXRpbmddKCkgLT4gdm9pZDoKZGVsZXRlUmVhY3Rpb246CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTk5CiAgICAvLyBkZWxldGVSZWFjdGlvbihyZWY6IGJ5dGVzPDMyPiwgTkZUOiB1aW50NjQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDAwCiAgICAvLyBhc3NlcnQoIXRoaXMuaXNCYW5uZWQoVHhuLnNlbmRlciksIEVSUl9CQU5ORUQpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuaXNCYW5uZWQKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmFubmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDAxCiAgICAvLyBhc3NlcnQodGhpcy5wb3N0cyhyZWYpLmV4aXN0cywgRVJSX1BPU1RfTk9UX0ZPVU5EKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQb3N0IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMDIKICAgIC8vIGNvbnN0IHsgY3JlYXRvciB9ID0gdGhpcy5wb3N0cyhyZWYpLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMDMKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jsb2NrZWQoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9CTE9DS0VEKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBpc0Jsb2NrZWQKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmxvY2tlZCBieSB0aGUgdXNlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMDUKICAgIC8vIGNvbnN0IHJlYWN0aW9uTGlzdEtleTogUmVhY3Rpb25MaXN0S2V5ID0geyB1c2VyOiBiMTYoVHhuLnNlbmRlci5ieXRlcyksIHJlZjogYjE2KHJlZiksIE5GVCB9CiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIGIxNgogICAgZGlnIDIKICAgIGNhbGxzdWIgYjE2CiAgICBkaWcgMQogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIHN3YXAKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NgogICAgLy8gcmVhY3Rpb25saXN0ID0gQm94TWFwPFJlYWN0aW9uTGlzdEtleSwgYnl0ZXM8MD4+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFJlYWN0aW9uTGlzdCB9KQogICAgcHVzaGJ5dGVzICJlIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAwNwogICAgLy8gYXNzZXJ0KHRoaXMucmVhY3Rpb25saXN0KHJlYWN0aW9uTGlzdEtleSkuZXhpc3RzLCBFUlJfQUxSRUFEWV9SRUFDVEVEKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgYWxyZWFkeSByZWFjdGVkIHRvIHRoaXMgcG9zdCB3aXRoIHRoaXMgTkZUCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAwOQogICAgLy8gdGhpcy5yZWFjdGlvbnMoeyByZWYsIE5GVCB9KS52YWx1ZSAtPSAxCiAgICBjb3ZlciAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NAogICAgLy8gcmVhY3Rpb25zID0gQm94TWFwPFJlYWN0aW9uc0tleSwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhSZWFjdGlvbnMgfSkKICAgIGJ5dGVjIDI1IC8vICJyIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAwOQogICAgLy8gdGhpcy5yZWFjdGlvbnMoeyByZWYsIE5GVCB9KS52YWx1ZSAtPSAxCiAgICBkdXAKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBidG9pCiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgaXRvYgogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMTAKICAgIC8vIHRoaXMucmVhY3Rpb25saXN0KHJlYWN0aW9uTGlzdEtleSkuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMTItMTAxOAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLnJlYWN0aW9ubGlzdCwKICAgIC8vIAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDE0CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDE1CiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkucmVhY3Rpb25saXN0LAogICAgcHVzaGJ5dGVzICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgNDggLy8gNDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMTItMTAxNwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLnJlYWN0aW9ubGlzdCwKICAgIC8vIAogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMTItMTAxOAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLnJlYWN0aW9ubGlzdCwKICAgIC8vIAogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTk5CiAgICAvLyBkZWxldGVSZWFjdGlvbihyZWY6IGJ5dGVzPDMyPiwgTkZUOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLnNldFBvc3RGbGFnW3JvdXRpbmddKCkgLT4gdm9pZDoKc2V0UG9zdEZsYWc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyMQogICAgLy8gc2V0UG9zdEZsYWcocmVmOiBieXRlczwzMj4sIGZsYWdnZWQ6IGJvb2xlYW4pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMjMKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbikuYWRkcmVzcywgJ0VSUjpOT1RfTU9ERVJBVElPTicpCiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyMwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5tb2RlcmF0aW9uKS5hZGRyZXNzLCAnRVJSOk5PVF9NT0RFUkFUSU9OJykKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA4IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyMwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5tb2RlcmF0aW9uKS5hZGRyZXNzLCAnRVJSOk5PVF9NT0RFUkFUSU9OJykKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIEVSUjpOT1RfTU9ERVJBVElPTgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMjQKICAgIC8vIGFzc2VydCh0aGlzLnBvc3RzKHJlZikuZXhpc3RzLCBFUlJfUE9TVF9OT1RfRk9VTkQpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBvc3Qgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyNQogICAgLy8gdGhpcy5wb3N0cyhyZWYpLnZhbHVlLmFnYWluc3RDb250ZW50UG9saWN5ID0gZmxhZ2dlZAogICAgZHVwCiAgICBwdXNoaW50IDU3IC8vIDU3CiAgICBpbnRjXzEgLy8gMQogICAgYm94X2V4dHJhY3QKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDMKICAgIHNldGJpdAogICAgcHVzaGludCA1NyAvLyA1NwogICAgc3dhcAogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDIxCiAgICAvLyBzZXRQb3N0RmxhZyhyZWY6IGJ5dGVzPDMyPiwgZmxhZ2dlZDogYm9vbGVhbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuaW5pdE1ldGFbcm91dGluZ10oKSAtPiB2b2lkOgppbml0TWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDI4LTEwMzUKICAgIC8vIGluaXRNZXRhKAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIHVzZXI6IEFjY291bnQsCiAgICAvLyAgIGF1dG9tYXRlZDogYm9vbGVhbiwKICAgIC8vICAgc3Vic2NyaXB0aW9uSW5kZXg6IHVpbnQ2NCwKICAgIC8vICAgTkZEOiB1aW50NjQsCiAgICAvLyAgIGFraXRhTkZUOiB1aW50NjQsCiAgICAvLyApOiB1aW50NjQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgY292ZXIgNAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBjb3ZlciA0CiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDM2CiAgICAvLyBjb25zdCB3YWxsZXQgPSBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8odGhpcy5ha2l0YURBTy52YWx1ZSwgdXNlcikKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDM2CiAgICAvLyBjb25zdCB3YWxsZXQgPSBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8odGhpcy5ha2l0YURBTy52YWx1ZSwgdXNlcikKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkaWcgMgogICAgY2FsbHN1YiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8KICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDM3CiAgICAvLyBjb25zdCB1c2VySXNTZW5kZXIgPSAoVHhuLnNlbmRlciA9PT0gdXNlcikKICAgIHR4biBTZW5kZXIKICAgIHVuY292ZXIgMgogICAgPT0KICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAzOQogICAgLy8gYXNzZXJ0KCF0aGlzLm1ldGEoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfTUVUQV9BTFJFQURZX0VYSVNUUykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMzkKICAgIC8vIGFzc2VydCghdGhpcy5tZXRhKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX01FVEFfQUxSRUFEWV9FWElTVFMpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBNZXRhIGJveCB2YWx1ZXMgYWxyZWFkeSBleGlzdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNDEtMTA0OAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLm1ldGEgKyBJbXBhY3RNZXRhTUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAxCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNDQKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA0MS0xMDQ4CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkubWV0YSArIEltcGFjdE1ldGFNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA0NQogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLm1ldGEgKyBJbXBhY3RNZXRhTUJSCiAgICBwdXNoYnl0ZXMgIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgcHVzaGludCA1NiAvLyA1NgogICAgZXh0cmFjdF91aW50NjQKICAgIGludGMgNiAvLyAzMTcwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNDEtMTA0OAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLm1ldGEgKyBJbXBhY3RNZXRhTUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNTAKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDUwCiAgICAvLyBjb25zdCBpbXBhY3QgPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWMgOCAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNTAKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGNvdmVyIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDUyLTEwNTcKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihpbXBhY3QpLmFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBJbXBhY3RNZXRhTUJSCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNTQKICAgIC8vIHJlY2VpdmVyOiBBcHBsaWNhdGlvbihpbXBhY3QpLmFkZHJlc3MsCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA1NQogICAgLy8gYW1vdW50OiBJbXBhY3RNZXRhTUJSCiAgICBpbnRjIDYgLy8gMzE3MDAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA1Mi0xMDU2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogQXBwbGljYXRpb24oaW1wYWN0KS5hZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogSW1wYWN0TWV0YU1CUgogICAgLy8gICB9KQogICAgaW50Y18xIC8vIDEKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNTItMTA1NwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEFwcGxpY2F0aW9uKGltcGFjdCkuYWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEltcGFjdE1ldGFNQlIKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNTkKICAgIC8vIGlmIChhdXRvbWF0ZWQpIHsKICAgIGJ6IGluaXRNZXRhX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNjAKICAgIC8vIHRoaXMuY3JlYXRlRGVmYXVsdE1ldGEoVHhuLnNlbmRlciwgdXNlcklzU2VuZGVyLCB3YWxsZXQuaWQsIHRydWUpCiAgICB0eG4gU2VuZGVyCiAgICBjb3ZlciAyCiAgICBpbnRjXzEgLy8gMQogICAgY2FsbHN1YiBjcmVhdGVEZWZhdWx0TWV0YQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNjItMTA3MAogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxJbXBhY3QucHJvdG90eXBlLmNhY2hlTWV0YT4oewogICAgLy8gICBhcHBJZDogaW1wYWN0LAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgVHhuLnNlbmRlciwKICAgIC8vICAgICAwLAogICAgLy8gICAgIDAsCiAgICAvLyAgICAgMAogICAgLy8gICBdCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNjUKICAgIC8vIFR4bi5zZW5kZXIsCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA2NgogICAgLy8gMCwKICAgIGludGNfMCAvLyAwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA2Mi0xMDcwCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEltcGFjdC5wcm90b3R5cGUuY2FjaGVNZXRhPih7CiAgICAvLyAgIGFwcElkOiBpbXBhY3QsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgIDAsCiAgICAvLyAgICAgMCwKICAgIC8vICAgICAwCiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBieXRlYyAyNiAvLyBtZXRob2QgImNhY2hlTWV0YShhZGRyZXNzLHVpbnQ2NCx1aW50NjQsdWludDY0KXVpbnQ2NCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZHVwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGR1cAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNzIKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAoKaW5pdE1ldGFfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmluaXRNZXRhQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAyOC0xMDM1CiAgICAvLyBpbml0TWV0YSgKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICB1c2VyOiBBY2NvdW50LAogICAgLy8gICBhdXRvbWF0ZWQ6IGJvb2xlYW4sCiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsCiAgICAvLyAgIE5GRDogdWludDY0LAogICAgLy8gICBha2l0YU5GVDogdWludDY0LAogICAgLy8gKTogdWludDY0IHsKICAgIGl0b2IKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmluaXRNZXRhX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDc1CiAgICAvLyB0aGlzLmNyZWF0ZURlZmF1bHRNZXRhKFR4bi5zZW5kZXIsIHVzZXJJc1NlbmRlciwgd2FsbGV0LmlkLCBmYWxzZSkKICAgIHR4biBTZW5kZXIKICAgIGNvdmVyIDIKICAgIGludGNfMCAvLyAwCiAgICBjYWxsc3ViIGNyZWF0ZURlZmF1bHRNZXRhCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA3Ny0xMDg1CiAgICAvLyBjb25zdCBpbXBhY3RTY29yZSA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsSW1wYWN0LnByb3RvdHlwZS5jYWNoZU1ldGE+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgIHN1YnNjcmlwdGlvbkluZGV4LAogICAgLy8gICAgIE5GRCwKICAgIC8vICAgICBha2l0YU5GVAogICAgLy8gICBdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNzgKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0LAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNzgKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0LAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjIDggLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDc4CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmltcGFjdCwKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA4MAogICAgLy8gVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDc3LTEwODUKICAgIC8vIGNvbnN0IGltcGFjdFNjb3JlID0gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxJbXBhY3QucHJvdG90eXBlLmNhY2hlTWV0YT4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmltcGFjdCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIFR4bi5zZW5kZXIsCiAgICAvLyAgICAgc3Vic2NyaXB0aW9uSW5kZXgsCiAgICAvLyAgICAgTkZELAogICAgLy8gICAgIGFraXRhTkZUCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBieXRlYyAyNiAvLyBtZXRob2QgImNhY2hlTWV0YShhZGRyZXNzLHVpbnQ2NCx1aW50NjQsdWludDY0KXVpbnQ2NCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDQKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAyCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA4NwogICAgLy8gcmV0dXJuIGltcGFjdFNjb3JlICsgdGhpcy5nZXRTb2NpYWxJbXBhY3RTY29yZShUeG4uc2VuZGVyKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBnZXRTb2NpYWxJbXBhY3RTY29yZQogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMjgtMTAzNQogICAgLy8gaW5pdE1ldGEoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgdXNlcjogQWNjb3VudCwKICAgIC8vICAgYXV0b21hdGVkOiBib29sZWFuLAogICAgLy8gICBzdWJzY3JpcHRpb25JbmRleDogdWludDY0LAogICAgLy8gICBORkQ6IHVpbnQ2NCwKICAgIC8vICAgYWtpdGFORlQ6IHVpbnQ2NCwKICAgIC8vICk6IHVpbnQ2NCB7CiAgICBiIGluaXRNZXRhX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pbml0TWV0YUA3CgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5jcmVhdGVQYXlXYWxsW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlUGF5V2FsbDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDkwCiAgICAvLyBjcmVhdGVQYXlXYWxsKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgcGF5V2FsbDogVmlld1BheVdhbGxWYWx1ZSk6IHVpbnQ2NCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDkxLTEwOTkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogewogICAgLy8gICAgICAgZ3JlYXRlclRoYW5FcTogdGhpcy5wYXlXYWxsTWJyKHBheVdhbGwpCiAgICAvLyAgICAgfQogICAgLy8gICB9CiAgICAvLyApCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDk0CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwOTEtMTA5OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB7CiAgICAvLyAgICAgICBncmVhdGVyVGhhbkVxOiB0aGlzLnBheVdhbGxNYnIocGF5V2FsbCkKICAgIC8vICAgICB9CiAgICAvLyAgIH0KICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDIKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwOTYKICAgIC8vIGdyZWF0ZXJUaGFuRXE6IHRoaXMucGF5V2FsbE1icihwYXlXYWxsKQogICAgdW5jb3ZlciAyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5wYXlXYWxsTWJyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA5MS0xMDk5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHsKICAgIC8vICAgICAgIGdyZWF0ZXJUaGFuRXE6IHRoaXMucGF5V2FsbE1icihwYXlXYWxsKQogICAgLy8gICAgIH0KICAgIC8vICAgfQogICAgLy8gKQogICAgY292ZXIgMgogICAgPj0KICAgIHVuY292ZXIgMgogICAgJiYKICAgIGFzc2VydCAvLyBhc3NlcnQgdGFyZ2V0IGlzIG1hdGNoIGZvciBjb25kaXRpb25zCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEwMQogICAgLy8gY29uc3QgaWQgPSB0aGlzLnBheVdhbGxJZC52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMQogICAgLy8gcGF5V2FsbElkID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogQWtpdGFTb2NpYWxHbG9iYWxTdGF0ZUtleXNQYXl3YWxsSUQsIGluaXRpYWxWYWx1ZTogMSB9KQogICAgYnl0ZWMgMTkgLy8gInBheXdhbGxfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEwMQogICAgLy8gY29uc3QgaWQgPSB0aGlzLnBheVdhbGxJZC52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTAyCiAgICAvLyB0aGlzLnBheVdhbGxJZC52YWx1ZSsrCiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzEKICAgIC8vIHBheVdhbGxJZCA9IEdsb2JhbFN0YXRlPHVpbnQ2ND4oeyBrZXk6IEFraXRhU29jaWFsR2xvYmFsU3RhdGVLZXlzUGF5d2FsbElELCBpbml0aWFsVmFsdWU6IDEgfSkKICAgIGJ5dGVjIDE5IC8vICJwYXl3YWxsX2lkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMDIKICAgIC8vIHRoaXMucGF5V2FsbElkLnZhbHVlKysKICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEwNAogICAgLy8gdGhpcy5wYXl3YWxsKGlkKS52YWx1ZSA9IGNsb25lKHBheVdhbGwpCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzgKICAgIC8vIHBheXdhbGwgPSBCb3hNYXA8dWludDY0LCBWaWV3UGF5V2FsbFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxib3hQcmVmaXhQYXlXYWxsIH0pCiAgICBieXRlYyAxOCAvLyAidyIKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTA0CiAgICAvLyB0aGlzLnBheXdhbGwoaWQpLnZhbHVlID0gY2xvbmUocGF5V2FsbCkKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICB1bmNvdmVyIDIKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDkwCiAgICAvLyBjcmVhdGVQYXlXYWxsKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgcGF5V2FsbDogVmlld1BheVdhbGxWYWx1ZSk6IHVpbnQ2NCB7CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC51cGRhdGVNZXRhW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlTWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTA5LTExMTYKICAgIC8vIHVwZGF0ZU1ldGEoCiAgICAvLyAgIGZvbGxvd0dhdGVJRDogdWludDY0LAogICAgLy8gICBhZGRyZXNzR2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsCiAgICAvLyAgIE5GRDogdWludDY0LAogICAgLy8gICBha2l0YU5GVDogdWludDY0LAogICAgLy8gICBkZWZhdWx0UGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgZHVwCiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBieXRlYyA0IC8vICJtIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMTcKICAgIC8vIGFzc2VydCh0aGlzLm1ldGEoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfTUVUQV9ET0VTTlRfRVhJU1QpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTE3CiAgICAvLyBhc3NlcnQodGhpcy5tZXRhKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX01FVEFfRE9FU05UX0VYSVNUKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gTWV0YSBib3ggdmFsdWVzIGRvbnQgZXhpc3QgeWV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBieXRlYyA0IC8vICJtIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMTkKICAgIC8vIHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5mb2xsb3dHYXRlSUQgPSBmb2xsb3dHYXRlSUQKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMTkKICAgIC8vIHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5mb2xsb3dHYXRlSUQgPSBmb2xsb3dHYXRlSUQKICAgIHB1c2hpbnQgNTAgLy8gNTAKICAgIHVuY292ZXIgOAogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEyMAogICAgLy8gdGhpcy5tZXRhKFR4bi5zZW5kZXIpLnZhbHVlLmFkZHJlc3NHYXRlSUQgPSBhZGRyZXNzR2F0ZUlECiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTIwCiAgICAvLyB0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUuYWRkcmVzc0dhdGVJRCA9IGFkZHJlc3NHYXRlSUQKICAgIHB1c2hpbnQgNTggLy8gNTgKICAgIHVuY292ZXIgNwogICAgYm94X3JlcGxhY2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTIxCiAgICAvLyBhc3NlcnQodGhpcy5wYXl3YWxsKGRlZmF1bHRQYXlXYWxsSUQpLmV4aXN0cywgJ0VSUjpOT1BBWVdBTEwnKQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM4CiAgICAvLyBwYXl3YWxsID0gQm94TWFwPHVpbnQ2NCwgVmlld1BheVdhbGxWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsYm94UHJlZml4UGF5V2FsbCB9KQogICAgYnl0ZWMgMTggLy8gInciCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTIxCiAgICAvLyBhc3NlcnQodGhpcy5wYXl3YWxsKGRlZmF1bHRQYXlXYWxsSUQpLmV4aXN0cywgJ0VSUjpOT1BBWVdBTEwnKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gRVJSOk5PUEFZV0FMTAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTIyCiAgICAvLyB0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUuZGVmYXVsdFBheVdhbGxJRCA9IGRlZmF1bHRQYXlXYWxsSUQKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMjIKICAgIC8vIHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5kZWZhdWx0UGF5V2FsbElEID0gZGVmYXVsdFBheVdhbGxJRAogICAgcHVzaGludCA2NiAvLyA2NgogICAgdW5jb3ZlciAyCiAgICBib3hfcmVwbGFjZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMjQKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTI0CiAgICAvLyBjb25zdCBpbXBhY3QgPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0CiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWMgOCAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMjQKICAgIC8vIGNvbnN0IGltcGFjdCA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEyNS0xMTMzCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEltcGFjdC5wcm90b3R5cGUuY2FjaGVNZXRhPih7CiAgICAvLyAgIGFwcElkOiBpbXBhY3QsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgIHN1YnNjcmlwdGlvbkluZGV4LAogICAgLy8gICAgIE5GRCwKICAgIC8vICAgICBha2l0YU5GVAogICAgLy8gICBdCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMjgKICAgIC8vIFR4bi5zZW5kZXIsCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEyNS0xMTMzCiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEltcGFjdC5wcm90b3R5cGUuY2FjaGVNZXRhPih7CiAgICAvLyAgIGFwcElkOiBpbXBhY3QsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBUeG4uc2VuZGVyLAogICAgLy8gICAgIHN1YnNjcmlwdGlvbkluZGV4LAogICAgLy8gICAgIE5GRCwKICAgIC8vICAgICBha2l0YU5GVAogICAgLy8gICBdCiAgICAvLyB9KQogICAgYnl0ZWMgMjYgLy8gbWV0aG9kICJjYWNoZU1ldGEoYWRkcmVzcyx1aW50NjQsdWludDY0LHVpbnQ2NCl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTA5LTExMTYKICAgIC8vIHVwZGF0ZU1ldGEoCiAgICAvLyAgIGZvbGxvd0dhdGVJRDogdWludDY0LAogICAgLy8gICBhZGRyZXNzR2F0ZUlEOiB1aW50NjQsCiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsCiAgICAvLyAgIE5GRDogdWludDY0LAogICAgLy8gICBha2l0YU5GVDogdWludDY0LAogICAgLy8gICBkZWZhdWx0UGF5V2FsbElEOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgcmV0dXJuIC8vIG9uIGVycm9yOiBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC51cGRhdGVGb2xsb3dlck1ldGFbcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVGb2xsb3dlck1ldGE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEzNgogICAgLy8gdXBkYXRlRm9sbG93ZXJNZXRhKGFkZHJlc3M6IEFjY291bnQsIG5ld0ZvbGxvd2VySW5kZXg6IHVpbnQ2NCwgbmV3Rm9sbG93ZXJDb3VudDogdWludDY0KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMzcKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuZ3JhcGgpLmFkZHJlc3MsIEVSUl9OT1RfR1JBUEgpCiAgICB0eG4gU2VuZGVyCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEzNwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ncmFwaCkuYWRkcmVzcywgRVJSX05PVF9HUkFQSCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA4IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEzNwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ncmFwaCkuYWRkcmVzcywgRVJSX05PVF9HUkFQSCkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBOb3QgdGhlIHNvY2lhbCBncmFwaCBhcHAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICB1bmNvdmVyIDMKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMzgKICAgIC8vIHRoaXMubWV0YShhZGRyZXNzKS52YWx1ZS5mb2xsb3dlckluZGV4ID0gbmV3Rm9sbG93ZXJJbmRleAogICAgZHVwCiAgICBwdXNoaW50IDMzIC8vIDMzCiAgICB1bmNvdmVyIDQKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEzOQogICAgLy8gdGhpcy5tZXRhKGFkZHJlc3MpLnZhbHVlLmZvbGxvd2VyQ291bnQgPSBuZXdGb2xsb3dlckNvdW50CiAgICBwdXNoaW50IDQxIC8vIDQxCiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTEzNgogICAgLy8gdXBkYXRlRm9sbG93ZXJNZXRhKGFkZHJlc3M6IEFjY291bnQsIG5ld0ZvbGxvd2VySW5kZXg6IHVpbnQ2NCwgbmV3Rm9sbG93ZXJDb3VudDogdWludDY0KTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc0Jhbm5lZFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmlzQmFubmVkOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNDQKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuaXNCYW5uZWQKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRVc2VyU29jaWFsSW1wYWN0W3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0VXNlclNvY2lhbEltcGFjdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTUyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNTQKICAgIC8vIHJldHVybiB0aGlzLmdldFNvY2lhbEltcGFjdFNjb3JlKHVzZXIpCiAgICBjYWxsc3ViIGdldFNvY2lhbEltcGFjdFNjb3JlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE1MgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBpdG9iCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRNZXRhRXhpc3RzW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0TWV0YUV4aXN0czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTU3CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNTkKICAgIC8vIHJldHVybiB0aGlzLm1ldGEodXNlcikuZXhpc3RzCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTU3CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRNZXRhW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0TWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTYyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNjQKICAgIC8vIHJldHVybiB0aGlzLm1ldGEodXNlcikudmFsdWUKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE2MgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRQb3N0RXhpc3RzW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0UG9zdEV4aXN0czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTY4CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM2CiAgICAvLyBwb3N0cyA9IEJveE1hcDxieXRlczwzMj4sIFBvc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UG9zdHMgfSkKICAgIGJ5dGVjXzIgLy8gInAiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTcwCiAgICAvLyByZXR1cm4gdGhpcy5wb3N0cyhyZWYpLmV4aXN0cwogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE2OAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18zIC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuZ2V0UG9zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldFBvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE3MwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE3NQogICAgLy8gYXNzZXJ0KHRoaXMucG9zdHMocmVmKS5leGlzdHMsIEVSUl9QT1NUX05PVF9GT1VORCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gUG9zdCBub3QgZm91bmQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTc2CiAgICAvLyByZXR1cm4gdGhpcy5wb3N0cyhyZWYpLnZhbHVlCiAgICBib3hfZ2V0CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTczCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmdldFZvdGVbcm91dGluZ10oKSAtPiB2b2lkOgpnZXRWb3RlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNzkKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTgxCiAgICAvLyBjb25zdCB2b3RlTGlzdEtleTogVm90ZUxpc3RLZXkgPSB7IHVzZXI6IGIxNihhY2NvdW50LmJ5dGVzKSwgcmVmOiBiMTYocmVmKSB9CiAgICBzd2FwCiAgICBjYWxsc3ViIGIxNgogICAgc3dhcAogICAgY2FsbHN1YiBiMTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyCiAgICAvLyB2b3RlbGlzdCA9IEJveE1hcDxWb3RlTGlzdEtleSwgVm90ZUxpc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4Vm90ZUxpc3QgfSkKICAgIGJ5dGVjIDE1IC8vICJvIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE4MgogICAgLy8gYXNzZXJ0KHRoaXMudm90ZWxpc3Qodm90ZUxpc3RLZXkpLmV4aXN0cywgRVJSX0hBVkVOVF9WT1RFRCkKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gWW91IGhhdmVuJ3Qgdm90ZWQgb24gdGhpcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExODQKICAgIC8vIHJldHVybiB0aGlzLnZvdGVsaXN0KHZvdGVMaXN0S2V5KS52YWx1ZQogICAgYm94X2dldAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE3OQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRWb3Rlc1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldFZvdGVzOgogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTg3CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgICoKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBzd2FwCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rKHVpbnQ4WzMyXSx1aW50OFszMl0pW10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE4OQogICAgLy8gY29uc3Qgdm90ZXM6IFZvdGVMaXN0VmFsdWVbXSA9IFtdCiAgICBieXRlYyAxMCAvLyAweDAwMDAKICAgIGludGNfMCAvLyAwCgpnZXRWb3Rlc19mb3JfaGVhZGVyQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE5MAogICAgLy8gZm9yIChjb25zdCB7IHVzZXIsIHJlZiB9IG9mIGNsb25lKGtleXMpKSB7CiAgICBkdXAKICAgIGRpZyAzCiAgICA8CiAgICBieiBnZXRWb3Rlc19hZnRlcl9mb3JAOAogICAgZGlnIDMKICAgIGV4dHJhY3QgMiAwCiAgICBkaWcgMQogICAgcHVzaGludCA2NCAvLyA2NAogICAgKgogICAgcHVzaGludCA2NCAvLyA2NAogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIGV4dHJhY3QgMCAzMgogICAgc3dhcAogICAgZXh0cmFjdCAzMiAzMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExOTEKICAgIC8vIGNvbnN0IHZvdGVMaXN0S2V5OiBWb3RlTGlzdEtleSA9IHsgdXNlcjogYjE2KHVzZXIuYnl0ZXMpLCByZWY6IGIxNihyZWYpIH0KICAgIHN3YXAKICAgIGNhbGxzdWIgYjE2CiAgICBzd2FwCiAgICBjYWxsc3ViIGIxNgogICAgZGlnIDEKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDIKICAgIC8vIHZvdGVsaXN0ID0gQm94TWFwPFZvdGVMaXN0S2V5LCBWb3RlTGlzdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhWb3RlTGlzdCB9KQogICAgYnl0ZWMgMTUgLy8gIm8iCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE5MgogICAgLy8gaWYgKHRoaXMudm90ZWxpc3Qodm90ZUxpc3RLZXkpLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBieiBnZXRWb3Rlc19lbHNlX2JvZHlANQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExOTMKICAgIC8vIHZvdGVzLnB1c2godGhpcy52b3RlbGlzdCh2b3RlTGlzdEtleSkudmFsdWUpCiAgICBkaWcgNAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGRpZyAyCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgY29uY2F0IC8vIG9uIGVycm9yOiBtYXggYXJyYXkgbGVuZ3RoIGV4Y2VlZGVkCiAgICBzd2FwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcmVwbGFjZTIgMAogICAgYnVyeSAyCgpnZXRWb3Rlc19hZnRlcl9pZl9lbHNlQDY6CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgZ2V0Vm90ZXNfZm9yX2hlYWRlckAyCgpnZXRWb3Rlc19lbHNlX2JvZHlANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTk1CiAgICAvLyB2b3Rlcy5wdXNoKHsgaW1wYWN0OiAwLCBpc1VwOiBmYWxzZSB9KQogICAgZGlnIDEKICAgIGR1cAogICAgYnl0ZWMgMzEgLy8gMHgwMDAwMDAwMDAwMDAwMDAwMDAKICAgIGNvbmNhdCAvLyBvbiBlcnJvcjogbWF4IGFycmF5IGxlbmd0aCBleGNlZWRlZAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHJlcGxhY2UyIDAKICAgIGJ1cnkgMgogICAgYiBnZXRWb3Rlc19hZnRlcl9pZl9lbHNlQDYKCmdldFZvdGVzX2FmdGVyX2ZvckA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExODcKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICBkaWcgMgogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmdldFJlYWN0aW9uRXhpc3RzW3JvdXRpbmddKCkgLT4gdm9pZDoKZ2V0UmVhY3Rpb25FeGlzdHM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTIwMgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTIwNAogICAgLy8gcmV0dXJuIHRoaXMucmVhY3Rpb25zKHsgcmVmLCBORlQgfSkuZXhpc3RzCiAgICBpdG9iCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NAogICAgLy8gcmVhY3Rpb25zID0gQm94TWFwPFJlYWN0aW9uc0tleSwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhSZWFjdGlvbnMgfSkKICAgIGJ5dGVjIDI1IC8vICJyIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTIwNAogICAgLy8gcmV0dXJuIHRoaXMucmVhY3Rpb25zKHsgcmVmLCBORlQgfSkuZXhpc3RzCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMjAyCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icltyb3V0aW5nXSgpIC0+IHZvaWQ6Cm1icjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNAogICAgLy8gbWJyKHJlZjogYnl0ZXMpOiBBa2l0YVNvY2lhbE1CUkRhdGEgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICBleHRyYWN0IDIgMAogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLnBheVdhbGxNYnJbcm91dGluZ10oKSAtPiB2b2lkOgpwYXlXYWxsTWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMwCiAgICAvLyBwYXlXYWxsTWJyKHBheXdhbGw6IFZpZXdQYXlXYWxsVmFsdWUpOiB1aW50NjQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwucGF5V2FsbE1icgogICAgcG9wCiAgICBpdG9iCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzW3JvdXRpbmddKCkgLT4gdm9pZDoKY2hlY2tUaXBNYnJSZXF1aXJlbWVudHM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTEKICAgIC8vIGNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKGFraXRhREFPOiBBcHBsaWNhdGlvbiwgY3JlYXRvcjogQWNjb3VudCwgd2FsbGV0OiBBcHBsaWNhdGlvbik6IHRpcE1CUkluZm8gewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OkFraXRhQmFzZUZlZUdlbmVyYXRvckNvbnRyYWN0LnVwZGF0ZUFraXRhREFPRXNjcm93W3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlQWtpdGFEQU9Fc2Nyb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzcKICAgIC8vIHVwZGF0ZUFraXRhREFPRXNjcm93KGFwcDogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoxMzgKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWMgMTEgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjEzOAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgNiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTM5CiAgICAvLyB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlID0gYXBwCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MTM3CiAgICAvLyB1cGRhdGVBa2l0YURBT0VzY3JvdyhhcHA6IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OlVwZ3JhZGVhYmxlQWtpdGFCYXNlQ29udHJhY3QudXBkYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGJ5dGVjIDExIC8vICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHVuY292ZXIgMgogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MAogICAgLy8gY29uc3QgW3BsdWdpbkFwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNQbHVnaW5BcHBMaXN0KSkKICAgIGJ5dGVjIDE2IC8vICJwYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MQogICAgLy8gY29uc3QgdXBkYXRlUGx1Z2luID0gZ2V0UGx1Z2luQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS51cGRhdGUKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MgogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkID09PSB1cGRhdGVQbHVnaW4sIEVSUl9JTlZBTElEX1VQR1JBREUpCiAgICBnbG9iYWwgQ2FsbGVyQXBwbGljYXRpb25JRAogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIGFwcCB1cGdyYWRlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgYnl0ZWMgMjggLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MwogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gbmV3VmVyc2lvbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieXRlYyAxMSAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzkKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gYWtpdGFEQU8KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOAogICAgLy8gdXBkYXRlQWtpdGFEQU8oYWtpdGFEQU86IEFwcGxpY2F0aW9uKTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc1JlcGx5KHBvc3RUeXBlOiBieXRlcykgLT4gdWludDY0Ogppc1JlcGx5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2CiAgICAvLyBwcml2YXRlIGlzUmVwbHkocG9zdFR5cGU6IFBvc3RUeXBlKTogYm9vbGVhbiB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gcmV0dXJuIHBvc3RUeXBlID09PSBQb3N0VHlwZVJlcGx5IHx8IHBvc3RUeXBlID09PSBQb3N0VHlwZUVkaXRSZXBseQogICAgZnJhbWVfZGlnIC0xCiAgICBieXRlYyAxNyAvLyAweDAxCiAgICA9PQogICAgYm56IGlzUmVwbHlfYm9vbF90cnVlQDIKICAgIGZyYW1lX2RpZyAtMQogICAgYnl0ZWMgMTQgLy8gMHgwMwogICAgPT0KICAgIGJ6IGlzUmVwbHlfYm9vbF9mYWxzZUAzCgppc1JlcGx5X2Jvb2xfdHJ1ZUAyOgogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NwogICAgLy8gcmV0dXJuIHBvc3RUeXBlID09PSBQb3N0VHlwZVJlcGx5IHx8IHBvc3RUeXBlID09PSBQb3N0VHlwZUVkaXRSZXBseQogICAgcmV0c3ViCgppc1JlcGx5X2Jvb2xfZmFsc2VAMzoKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTcKICAgIC8vIHJldHVybiBwb3N0VHlwZSA9PT0gUG9zdFR5cGVSZXBseSB8fCBwb3N0VHlwZSA9PT0gUG9zdFR5cGVFZGl0UmVwbHkKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuaXNBbWVuZGVkKHJlZjogYnl0ZXMsIHBvc3RUeXBlOiBieXRlcykgLT4gdWludDY0Ogppc0FtZW5kZWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODAKICAgIC8vIHByaXZhdGUgaXNBbWVuZGVkKHJlZjogYnl0ZXMsIHBvc3RUeXBlOiBQb3N0VHlwZSk6IGJvb2xlYW4gewogICAgcHJvdG8gMiAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjcKICAgIC8vIGNhc2UgUG9zdFR5cGVQb3N0OgogICAgZnJhbWVfZGlnIC0xCiAgICBieXRlY18zIC8vIDB4MDAKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjctNjgKICAgIC8vIGNhc2UgUG9zdFR5cGVQb3N0OgogICAgLy8gICByZXR1cm4gMzYKICAgIGJ6IGlzQW1lbmRlZF9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2OAogICAgLy8gcmV0dXJuIDM2CiAgICBwdXNoaW50IDM2IC8vIDM2Cgppc0FtZW5kZWRfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmdldEJhc2VSZWZMZW5ndGhAMTA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODMKICAgIC8vIHJldHVybiByZWYubGVuZ3RoID4gYmFzZUxlbmd0aAogICAgZnJhbWVfZGlnIC0yCiAgICBsZW4KICAgIDwKICAgIHJldHN1YgoKaXNBbWVuZGVkX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2OQogICAgLy8gY2FzZSBQb3N0VHlwZVJlcGx5OgogICAgZnJhbWVfZGlnIC0xCiAgICBieXRlYyAxNyAvLyAweDAxCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5LTcwCiAgICAvLyBjYXNlIFBvc3RUeXBlUmVwbHk6CiAgICAvLyAgIHJldHVybiA2OAogICAgYnogaXNBbWVuZGVkX2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcwCiAgICAvLyByZXR1cm4gNjgKICAgIHB1c2hpbnQgNjggLy8gNjgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo4MgogICAgLy8gY29uc3QgYmFzZUxlbmd0aCA9IHRoaXMuZ2V0QmFzZVJlZkxlbmd0aChwb3N0VHlwZSkKICAgIGIgaXNBbWVuZGVkX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRCYXNlUmVmTGVuZ3RoQDEwCgppc0FtZW5kZWRfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjcxCiAgICAvLyBjYXNlIFBvc3RUeXBlRWRpdFBvc3Q6CiAgICBmcmFtZV9kaWcgLTEKICAgIGJ5dGVjIDI0IC8vIDB4MDIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzEtNzIKICAgIC8vIGNhc2UgUG9zdFR5cGVFZGl0UG9zdDoKICAgIC8vICAgcmV0dXJuIDY4CiAgICBieiBpc0FtZW5kZWRfYWZ0ZXJfaWZfZWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzIKICAgIC8vIHJldHVybiA2OAogICAgcHVzaGludCA2OCAvLyA2OAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjgyCiAgICAvLyBjb25zdCBiYXNlTGVuZ3RoID0gdGhpcy5nZXRCYXNlUmVmTGVuZ3RoKHBvc3RUeXBlKQogICAgYiBpc0FtZW5kZWRfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmdldEJhc2VSZWZMZW5ndGhAMTAKCmlzQW1lbmRlZF9hZnRlcl9pZl9lbHNlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzMKICAgIC8vIGNhc2UgUG9zdFR5cGVFZGl0UmVwbHk6CiAgICBmcmFtZV9kaWcgLTEKICAgIGJ5dGVjIDE0IC8vIDB4MDMKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NzMtNzQKICAgIC8vIGNhc2UgUG9zdFR5cGVFZGl0UmVwbHk6CiAgICAvLyAgIHJldHVybiAxMDAKICAgIGJ6IGlzQW1lbmRlZF9hZnRlcl9pZl9lbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NAogICAgLy8gcmV0dXJuIDEwMAogICAgcHVzaGludCAxMDAgLy8gMTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODIKICAgIC8vIGNvbnN0IGJhc2VMZW5ndGggPSB0aGlzLmdldEJhc2VSZWZMZW5ndGgocG9zdFR5cGUpCiAgICBiIGlzQW1lbmRlZF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuZ2V0QmFzZVJlZkxlbmd0aEAxMAoKaXNBbWVuZGVkX2FmdGVyX2lmX2Vsc2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo3NgogICAgLy8gcmV0dXJuIDM2CiAgICBwdXNoaW50IDM2IC8vIDM2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6ODIKICAgIC8vIGNvbnN0IGJhc2VMZW5ndGggPSB0aGlzLmdldEJhc2VSZWZMZW5ndGgocG9zdFR5cGUpCiAgICBiIGlzQW1lbmRlZF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuZ2V0QmFzZVJlZkxlbmd0aEAxMAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwudG9CeXRlczMyKHR5cGU6IGJ5dGVzLCByZWY6IGJ5dGVzKSAtPiBieXRlczoKdG9CeXRlczMyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg2CiAgICAvLyBwcml2YXRlIHRvQnl0ZXMzMih0eXBlOiBSZWZUeXBlLCByZWY6IGJ5dGVzKTogeyByZWZCeXRlczogYnl0ZXM8MzI+LCBjcmVhdG9yOiBBY2NvdW50IH0gewogICAgcHJvdG8gMiAxCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjg4CiAgICAvLyBsZXQgY3JlYXRvcjogQWNjb3VudCA9IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTAKICAgIC8vIGNhc2UgUmVmVHlwZVBvc3Q6CiAgICBmcmFtZV9kaWcgLTIKICAgIGJ5dGVjIDEzIC8vIDB4MGEKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTAtOTMKICAgIC8vIGNhc2UgUmVmVHlwZVBvc3Q6CiAgICAvLyAgIGFzc2VydChyZWYubGVuZ3RoID09PSAzMiwgRVJSX0lOVkFMSURfUkVGX0xFTkdUSCkKICAgIC8vICAgcmVmQnl0ZXMgPSByZWYudG9GaXhlZCh7IGxlbmd0aDogMzIgfSkKICAgIC8vICAgYnJlYWsKICAgIGJ6IHRvQnl0ZXMzMl9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5MQogICAgLy8gYXNzZXJ0KHJlZi5sZW5ndGggPT09IDMyLCBFUlJfSU5WQUxJRF9SRUZfTEVOR1RIKQogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIHJlZmVyZW5jZSBsZW5ndGgsIG11c3QgYmUgMzIgYnl0ZXMKICAgIGZyYW1lX2RpZyAtMQoKdG9CeXRlczMyX2Jsb2NrQDE5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEyOAogICAgLy8gcmV0dXJuIHsgcmVmQnl0ZXMsIGNyZWF0b3IgfQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGZyYW1lX2RpZyAxCiAgICBjb25jYXQKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgp0b0J5dGVzMzJfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk0CiAgICAvLyBjYXNlIFJlZlR5cGVBc3NldDoKICAgIGZyYW1lX2RpZyAtMgogICAgYnl0ZWMgNSAvLyAweDE0CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk0LTk5CiAgICAvLyBjYXNlIFJlZlR5cGVBc3NldDoKICAgIC8vICAgYXNzZXJ0KHJlZi5sZW5ndGggPT09IDgsIEVSUl9JTlZBTElEX1JFRl9MRU5HVEgpCiAgICAvLyAgIGFzc2VydChBc3NldChidG9pKHJlZikpLnRvdGFsID4gMCwgRVJSX0lOVkFMSURfQVNTRVQpCiAgICAvLyAgIHJlZkJ5dGVzID0gcmVmLmNvbmNhdChvcC5iemVybygyNCkpLnRvRml4ZWQoeyBsZW5ndGg6IDMyIH0pCiAgICAvLyAgIGNyZWF0b3IgPSBBc3NldChidG9pKHJlZikpLmNyZWF0b3IKICAgIC8vICAgYnJlYWsKICAgIGJ6IHRvQnl0ZXMzMl9hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5NQogICAgLy8gYXNzZXJ0KHJlZi5sZW5ndGggPT09IDgsIEVSUl9JTlZBTElEX1JFRl9MRU5HVEgpCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaW50Y18yIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gSW52YWxpZCByZWZlcmVuY2UgbGVuZ3RoLCBtdXN0IGJlIDMyIGJ5dGVzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTYKICAgIC8vIGFzc2VydChBc3NldChidG9pKHJlZikpLnRvdGFsID4gMCwgRVJSX0lOVkFMSURfQVNTRVQpCiAgICBmcmFtZV9kaWcgLTEKICAgIGJ0b2kKICAgIGR1cAogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldFRvdGFsCiAgICBhc3NlcnQgLy8gYXNzZXQgZXhpc3RzCiAgICBhc3NlcnQgLy8gSW52YWxpZCBhc3NldAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjk3CiAgICAvLyByZWZCeXRlcyA9IHJlZi5jb25jYXQob3AuYnplcm8oMjQpKS50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KQogICAgcHVzaGludCAyNCAvLyAyNAogICAgYnplcm8KICAgIGZyYW1lX2RpZyAtMQogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OTgKICAgIC8vIGNyZWF0b3IgPSBBc3NldChidG9pKHJlZikpLmNyZWF0b3IKICAgIGFzc2V0X3BhcmFtc19nZXQgQXNzZXRDcmVhdG9yCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDEKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo5OQogICAgLy8gYnJlYWsKICAgIGIgdG9CeXRlczMyX2Jsb2NrQDE5Cgp0b0J5dGVzMzJfYWZ0ZXJfaWZfZWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMAogICAgLy8gY2FzZSBSZWZUeXBlQWRkcmVzczoKICAgIGZyYW1lX2RpZyAtMgogICAgcHVzaGJ5dGVzIDB4MWUKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTAwLTExMAogICAgLy8gY2FzZSBSZWZUeXBlQWRkcmVzczoKICAgIC8vICAgYXNzZXJ0KHJlZi5sZW5ndGggPT09IDMyLCBFUlJfSU5WQUxJRF9SRUZfTEVOR1RIKQogICAgLy8gICByZWZCeXRlcyA9IHJlZi50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KQogICAgLy8gICBjcmVhdG9yID0gQWNjb3VudChyZWZCeXRlcykKICAgIC8vIAogICAgLy8gICBpZiAodGhpcy5tZXRhKGNyZWF0b3IpLmV4aXN0cykgewogICAgLy8gICAgIGNvbnN0IHsgYWRkcmVzc0dhdGVJRCB9ID0gdGhpcy5tZXRhKGNyZWF0b3IpLnZhbHVlCiAgICAvLyAgICAgYXNzZXJ0KGFkZHJlc3NHYXRlSUQgPT09IDAsIEVSUl9IQVNfR0FURSkKICAgIC8vICAgfQogICAgLy8gCiAgICAvLyAgIGJyZWFrCiAgICBieiB0b0J5dGVzMzJfYWZ0ZXJfaWZfZWxzZUAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwMQogICAgLy8gYXNzZXJ0KHJlZi5sZW5ndGggPT09IDMyLCBFUlJfSU5WQUxJRF9SRUZfTEVOR1RIKQogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIHJlZmVyZW5jZSBsZW5ndGgsIG11c3QgYmUgMzIgYnl0ZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMDUKICAgIC8vIGlmICh0aGlzLm1ldGEoY3JlYXRvcikuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IHRvQnl0ZXMzMl9hZnRlcl9pZl9lbHNlQDEwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTA2CiAgICAvLyBjb25zdCB7IGFkZHJlc3NHYXRlSUQgfSA9IHRoaXMubWV0YShjcmVhdG9yKS52YWx1ZQogICAgZnJhbWVfZGlnIDAKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBwdXNoaW50IDU4IC8vIDU4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEwNwogICAgLy8gYXNzZXJ0KGFkZHJlc3NHYXRlSUQgPT09IDAsIEVSUl9IQVNfR0FURSkKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGhhcyBhIGdhdGUKCnRvQnl0ZXMzMl9hZnRlcl9pZl9lbHNlQDEwOgogICAgZnJhbWVfZGlnIC0xCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMAogICAgLy8gYnJlYWsKICAgIGIgdG9CeXRlczMyX2Jsb2NrQDE5Cgp0b0J5dGVzMzJfYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTEKICAgIC8vIGNhc2UgUmVmVHlwZUFwcDoKICAgIGZyYW1lX2RpZyAtMgogICAgcHVzaGJ5dGVzIDB4MjgKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTExLTExNgogICAgLy8gY2FzZSBSZWZUeXBlQXBwOgogICAgLy8gICBhc3NlcnQocmVmLmxlbmd0aCA9PT0gOCwgRVJSX0lOVkFMSURfUkVGX0xFTkdUSCkKICAgIC8vICAgYXNzZXJ0KEFwcGxpY2F0aW9uKGJ0b2kocmVmKSkuYXBwcm92YWxQcm9ncmFtLmxlbmd0aCA+IDAsIEVSUl9JTlZBTElEX0FQUCkKICAgIC8vICAgcmVmQnl0ZXMgPSByZWYuY29uY2F0KG9wLmJ6ZXJvKDI0KSkudG9GaXhlZCh7IGxlbmd0aDogMzIgfSkKICAgIC8vICAgY3JlYXRvciA9IEFwcGxpY2F0aW9uKGJ0b2kocmVmKSkuY3JlYXRvcgogICAgLy8gICBicmVhawogICAgYnogdG9CeXRlczMyX2FmdGVyX2lmX2Vsc2VAMTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTIKICAgIC8vIGFzc2VydChyZWYubGVuZ3RoID09PSA4LCBFUlJfSU5WQUxJRF9SRUZfTEVOR1RIKQogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgcmVmZXJlbmNlIGxlbmd0aCwgbXVzdCBiZSAzMiBieXRlcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExMwogICAgLy8gYXNzZXJ0KEFwcGxpY2F0aW9uKGJ0b2kocmVmKSkuYXBwcm92YWxQcm9ncmFtLmxlbmd0aCA+IDAsIEVSUl9JTlZBTElEX0FQUCkKICAgIGZyYW1lX2RpZyAtMQogICAgYnRvaQogICAgZHVwCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBcHByb3ZhbFByb2dyYW0KICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIGxlbgogICAgYXNzZXJ0IC8vIEludmFsaWQgQXBwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE0CiAgICAvLyByZWZCeXRlcyA9IHJlZi5jb25jYXQob3AuYnplcm8oMjQpKS50b0ZpeGVkKHsgbGVuZ3RoOiAzMiB9KQogICAgcHVzaGludCAyNCAvLyAyNAogICAgYnplcm8KICAgIGZyYW1lX2RpZyAtMQogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE1CiAgICAvLyBjcmVhdG9yID0gQXBwbGljYXRpb24oYnRvaShyZWYpKS5jcmVhdG9yCiAgICBhcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDEKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTYKICAgIC8vIGJyZWFrCiAgICBiIHRvQnl0ZXMzMl9ibG9ja0AxOQoKdG9CeXRlczMyX2FmdGVyX2lmX2Vsc2VAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE3CiAgICAvLyBjYXNlIFJlZlR5cGVFeHRlcm5hbDoKICAgIGZyYW1lX2RpZyAtMgogICAgcHVzaGJ5dGVzIDB4MzIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE3LTEyMwogICAgLy8gY2FzZSBSZWZUeXBlRXh0ZXJuYWw6CiAgICAvLyAgIC8vIEV4dGVybmFsIHJlZnMgKFR3aXR0ZXIsIEZhcmNhc3RlciwgZXRjLikgLSByZWYgaXMgdGhlIHBsYXRmb3JtLXByZWZpeGVkIGlkZW50aWZpZXIKICAgIC8vICAgLy8gS2V5IGlzIGRlcml2ZWQgZGV0ZXJtaW5pc3RpY2FsbHk6IHNoYTI1NihyZWYpIHdoZXJlIHJlZiA9ICJwbGF0Zm9ybTpleHRlcm5hbElkIgogICAgLy8gICAvLyBDcmVhdG9yIGlzIHplcm8gYWRkcmVzcyBzaW5jZSBleHRlcm5hbCBjb250ZW50IGhhcyBubyBBbGdvcmFuZCBjcmVhdG9yCiAgICAvLyAgIHJlZkJ5dGVzID0gb3Auc2hhMjU2KHJlZikKICAgIC8vICAgY3JlYXRvciA9IEdsb2JhbC56ZXJvQWRkcmVzcwogICAgLy8gICBicmVhawogICAgYXNzZXJ0IC8vIEludmFsaWQgcmVwbHkgdHlwZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEyMQogICAgLy8gcmVmQnl0ZXMgPSBvcC5zaGEyNTYocmVmKQogICAgZnJhbWVfZGlnIC0xCiAgICBzaGEyNTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMjIKICAgIC8vIGNyZWF0b3IgPSBHbG9iYWwuemVyb0FkZHJlc3MKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTIzCiAgICAvLyBicmVhawogICAgYiB0b0J5dGVzMzJfYmxvY2tAMTkKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmlzQmxvY2tlZCh1c2VyOiBieXRlcywgYmxvY2tlZDogYnl0ZXMpIC0+IHVpbnQ2NDoKaXNCbG9ja2VkOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMQogICAgLy8gcHJpdmF0ZSBpc0Jsb2NrZWQodXNlcjogQWNjb3VudCwgYmxvY2tlZDogQWNjb3VudCk6IGJvb2xlYW4gewogICAgcHJvdG8gMiAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMyLTEzNQogICAgLy8gcmV0dXJuIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmlzQmxvY2tlZD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmdyYXBoLAogICAgLy8gICBhcmdzOiBbdXNlciwgYmxvY2tlZF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmdyYXBoLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMwogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ncmFwaCwKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA4IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMzCiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmdyYXBoLAogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMyLTEzNQogICAgLy8gcmV0dXJuIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsR3JhcGgucHJvdG90eXBlLmlzQmxvY2tlZD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmdyYXBoLAogICAgLy8gICBhcmdzOiBbdXNlciwgYmxvY2tlZF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHg0MzAzNjY4ZSAvLyBtZXRob2QgImlzQmxvY2tlZChhZGRyZXNzLGFkZHJlc3MpYm9vbCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMSAvLyAxCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciBib29sOAogICAgaW50Y18wIC8vIDAKICAgIGdldGJpdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRTb2NpYWxJbXBhY3RTY29yZShhY2NvdW50OiBieXRlcykgLT4gdWludDY0OgpnZXRTb2NpYWxJbXBhY3RTY29yZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzgKICAgIC8vIHByaXZhdGUgZ2V0U29jaWFsSW1wYWN0U2NvcmUoYWNjb3VudDogQWNjb3VudCk6IHVpbnQ2NCB7CiAgICBwcm90byAxIDEKICAgIGludGNfMCAvLyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIGR1cG4gNQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDEKICAgIC8vIGlmICghdGhpcy5tZXRhKGFjY291bnQpLmV4aXN0cykgewogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBibnogZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQyCiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgpnZXRTb2NpYWxJbXBhY3RTY29yZV9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ1CiAgICAvLyBjb25zdCB7IHN0cmVhaywgc3RhcnREYXRlIH0gPSBjbG9uZSh0aGlzLm1ldGEoYWNjb3VudCkudmFsdWUpCiAgICBmcmFtZV9kaWcgNwogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgcHVzaGludCA5IC8vIDkKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGZyYW1lX2J1cnkgNgogICAgcHVzaGludCAxNyAvLyAxNwogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0OAogICAgLy8gaWYgKHN0cmVhayA+PSA2MCkgewogICAgcHVzaGludCA2MCAvLyA2MAogICAgPj0KICAgIGJ6IGdldFNvY2lhbEltcGFjdFNjb3JlX2Vsc2VfYm9keUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ5CiAgICAvLyBzb2NpYWxJbXBhY3QgKz0gMTAwCiAgICBwdXNoaW50IDEwMCAvLyAxMDAKICAgIGZyYW1lX2J1cnkgNAoKZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1NwogICAgLy8gY29uc3QgYWNjb3VudEFnZTogdWludDY0ID0gR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCAtIHN0YXJ0RGF0ZQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZnJhbWVfZGlnIDUKICAgIC0KICAgIGR1cAogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU5CiAgICAvLyBpZiAoYWNjb3VudEFnZSA+PSBUV09fWUVBUlMpIHsKICAgIGludGMgNyAvLyA2MzA3MjAwMAogICAgPj0KICAgIGJ6IGdldFNvY2lhbEltcGFjdFNjb3JlX2Vsc2VfYm9keUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwCiAgICAvLyBzb2NpYWxJbXBhY3QgKz0gNzUKICAgIGZyYW1lX2RpZyA0CiAgICBwdXNoaW50IDc1IC8vIDc1CiAgICArCiAgICBmcmFtZV9idXJ5IDQKCmdldFNvY2lhbEltcGFjdFNjb3JlX2FmdGVyX2lmX2Vsc2VAODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MAogICAgLy8gdm90ZXMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBWb3Rlc1ZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhWb3RlcyB9KQogICAgcHVzaGJ5dGVzICJ2IgogICAgZnJhbWVfZGlnIC0xCiAgICBjb25jYXQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY3CiAgICAvLyBpZiAodGhpcy52b3RlcyhhY2NvdW50LmJ5dGVzKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAxOAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2OAogICAgLy8gY29uc3QgeyB2b3RlQ291bnQsIGlzTmVnYXRpdmUgfSA9IHRoaXMudm90ZXMoYWNjb3VudC5ieXRlcykudmFsdWUKICAgIGZyYW1lX2RpZyAwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIHB1c2hpbnQgNjQgLy8gNjQKICAgIGdldGJpdAogICAgZnJhbWVfYnVyeSAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBsZXQgaW1wYWN0OiB1aW50NjQgPSAodm90ZUNvdW50ICogNzUpIC8gMTAwXzAwMAogICAgcHVzaGludCA3NSAvLyA3NQogICAgKgogICAgaW50YyA0IC8vIDEwMDAwMAogICAgLwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNzEKICAgIC8vIGlmIChpbXBhY3QgPiA3NSkgewogICAgcHVzaGludCA3NSAvLyA3NQogICAgPgogICAgYnogZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE3MgogICAgLy8gaW1wYWN0ID0gNzUKICAgIHB1c2hpbnQgNzUgLy8gNzUKICAgIGZyYW1lX2J1cnkgMgoKZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNzUKICAgIC8vIGlmIChpc05lZ2F0aXZlKSB7CiAgICBmcmFtZV9kaWcgMwogICAgYnogZ2V0U29jaWFsSW1wYWN0U2NvcmVfZWxzZV9ib2R5QDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTc3CiAgICAvLyBpZiAoc29jaWFsSW1wYWN0ID4gaW1wYWN0KSB7CiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfZGlnIDIKICAgID4KICAgIGJ6IGdldFNvY2lhbEltcGFjdFNjb3JlX2Vsc2VfYm9keUAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE3OAogICAgLy8gc29jaWFsSW1wYWN0IC09IGltcGFjdAogICAgZnJhbWVfZGlnIDQKICAgIGZyYW1lX2RpZyAyCiAgICAtCiAgICBmcmFtZV9idXJ5IDQKCmdldFNvY2lhbEltcGFjdFNjb3JlX2FmdGVyX2lmX2Vsc2VAMTg6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTg4CiAgICAvLyByZXR1cm4gc29jaWFsSW1wYWN0CiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCmdldFNvY2lhbEltcGFjdFNjb3JlX2Vsc2VfYm9keUAxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxODAKICAgIC8vIHNvY2lhbEltcGFjdCA9IDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAxOAoKZ2V0U29jaWFsSW1wYWN0U2NvcmVfZWxzZV9ib2R5QDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE4NAogICAgLy8gc29jaWFsSW1wYWN0ICs9IGltcGFjdAogICAgZnJhbWVfZGlnIDQKICAgIGZyYW1lX2RpZyAyCiAgICArCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUAxOAoKZ2V0U29jaWFsSW1wYWN0U2NvcmVfZWxzZV9ib2R5QDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzCiAgICAvLyBzb2NpYWxJbXBhY3QgKz0gKGFjY291bnRBZ2UgKiA3NSkgLyBUV09fWUVBUlMKICAgIGZyYW1lX2RpZyAxCiAgICBwdXNoaW50IDc1IC8vIDc1CiAgICAqCiAgICBpbnRjIDcgLy8gNjMwNzIwMDAKICAgIC8KICAgIGZyYW1lX2RpZyA0CiAgICArCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUA4CgpnZXRTb2NpYWxJbXBhY3RTY29yZV9lbHNlX2JvZHlANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTIKICAgIC8vIHNvY2lhbEltcGFjdCArPSAoc3RyZWFrICogMTAwKSAvIDYwCiAgICBmcmFtZV9kaWcgNgogICAgcHVzaGludCAxMDAgLy8gMTAwCiAgICAqCiAgICBwdXNoaW50IDYwIC8vIDYwCiAgICAvCiAgICBmcmFtZV9idXJ5IDQKICAgIGIgZ2V0U29jaWFsSW1wYWN0U2NvcmVfYWZ0ZXJfaWZfZWxzZUA1CgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5nZXRVc2VySW1wYWN0KGFjY291bnQ6IGJ5dGVzKSAtPiB1aW50NjQ6CmdldFVzZXJJbXBhY3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTkxCiAgICAvLyBwcml2YXRlIGdldFVzZXJJbXBhY3QoYWNjb3VudDogQWNjb3VudCk6IHVpbnQ2NCB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxOTItMTk1CiAgICAvLyBjb25zdCBpbXBhY3QgPSBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbEltcGFjdC5wcm90b3R5cGUuZ2V0VXNlckltcGFjdFdpdGhvdXRTb2NpYWw+KHsKICAgIC8vICAgYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QsCiAgICAvLyAgIGFyZ3M6IFthY2NvdW50XQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxOTMKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuaW1wYWN0LAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE5MwogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWMgOCAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE5MwogICAgLy8gYXBwSWQ6IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5pbXBhY3QsCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE5Mi0xOTUKICAgIC8vIGNvbnN0IGltcGFjdCA9IGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsSW1wYWN0LnByb3RvdHlwZS5nZXRVc2VySW1wYWN0V2l0aG91dFNvY2lhbD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLmltcGFjdCwKICAgIC8vICAgYXJnczogW2FjY291bnRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4ZjgxYzdiNjIgLy8gbWV0aG9kICJnZXRVc2VySW1wYWN0V2l0aG91dFNvY2lhbChhZGRyZXNzKXVpbnQ2NCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCA0IDAKICAgIHN3YXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxOTcKICAgIC8vIHJldHVybiBpbXBhY3QgKyB0aGlzLmdldFNvY2lhbEltcGFjdFNjb3JlKGFjY291bnQpCiAgICBmcmFtZV9kaWcgLTEKICAgIGNhbGxzdWIgZ2V0U29jaWFsSW1wYWN0U2NvcmUKICAgICsKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwudGlwQ3JlYXRvcihjcmVhdG9yOiBieXRlcywgZmVlOiB1aW50NjQsIHRheDogdWludDY0KSAtPiB1aW50NjQ6CnRpcENyZWF0b3I6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjg5CiAgICAvLyBwcml2YXRlIHRpcENyZWF0b3IoY3JlYXRvcjogQWNjb3VudCwgZmVlOiB1aW50NjQsIHRheDogdWludDY0KTogdWludDY0IHsKICAgIHByb3RvIDMgMQogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTAKICAgIC8vIGlmIChjcmVhdG9yID09PSBHbG9iYWwuemVyb0FkZHJlc3MpIHsKICAgIGZyYW1lX2RpZyAtMwogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICA9PQogICAgYnogdGlwQ3JlYXRvcl9hZnRlcl9pZl9lbHNlQDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTEKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5MQogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyOTEKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjkyLTI5OAogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBmZWUsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5NAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgNiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5NAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBmcmFtZV9kaWcgLTIKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5Mi0yOTcKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogZmVlLAogICAgLy8gICAgIHhmZXJBc3NldDogYWt0YQogICAgLy8gICB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI5Mi0yOTgKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogZmVlLAogICAgLy8gICAgIHhmZXJBc3NldDogYWt0YQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mjk5CiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgp0aXBDcmVhdG9yX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDIKICAgIC8vIGxldCB3YWxsZXQ6IHVpbnQ2NCA9IDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICBmcmFtZV9kaWcgLTMKICAgIGNvbmNhdAogICAgZHVwCiAgICBmcmFtZV9idXJ5IDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDMKICAgIC8vIGlmICh0aGlzLm1ldGEoY3JlYXRvcikuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IHRpcENyZWF0b3JfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzA0CiAgICAvLyB3YWxsZXQgPSB0aGlzLm1ldGEoY3JlYXRvcikudmFsdWUud2FsbGV0CiAgICBmcmFtZV9kaWcgMAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSA2Cgp0aXBDcmVhdG9yX2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDcKICAgIC8vIGNvbnN0IHsgdHlwZSwgYXJjNTggfSA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24od2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDcKICAgIC8vIGNvbnN0IHsgdHlwZSwgYXJjNTggfSA9IHRoaXMuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHModGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvciwgQXBwbGljYXRpb24od2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBmcmFtZV9kaWcgLTMKICAgIGZyYW1lX2RpZyA2CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50cwogICAgZHVwCiAgICBleHRyYWN0IDAgMQogICAgc3dhcAogICAgaW50Y18xIC8vIDEKICAgIGV4dHJhY3RfdWludDY0CiAgICBmcmFtZV9idXJ5IDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDgKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzA4CiAgICAvLyBjb25zdCBha3RhID0gZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBkdXAKICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMDgKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzA5CiAgICAvLyBjb25zdCB7IGxlZnRvdmVyIH0gPSBzZW5kUmVmZXJyYWxQYXltZW50KHRoaXMuYWtpdGFEQU8udmFsdWUsIGFrdGEsIHRheCkKICAgIGZyYW1lX2RpZyAtMQogICAgY2FsbHN1YiBzZW5kUmVmZXJyYWxQYXltZW50CiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgNAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMAogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMAogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBieXRlYyA5IC8vICJzb2NpYWxfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMTAKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxMgogICAgLy8gaWYgKHR5cGUgPT09IFRpcFNlbmRUeXBlQVJDNTgpIHsKICAgIGJ5dGVjIDUgLy8gMHgxNAogICAgPT0KICAgIGJ6IHRpcENyZWF0b3JfYWZ0ZXJfaWZfZWxzZUA3CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzEzCiAgICAvLyB0aGlzLmFyYzU4U2VuZFJlYWN0aW9uUGF5bWVudHMoQXBwbGljYXRpb24od2FsbGV0KSwgYWt0YSwgbGVmdG92ZXIsIChyZWFjdEZlZSAtIHRheCkpCiAgICBmcmFtZV9kaWcgLTEKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTYxLTE2NAogICAgLy8gY29uc3QgW2NvbnRyb2xsZWRBY2NvdW50Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoCiAgICAvLyAgIHdhbGxldElELAogICAgLy8gICBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcykKICAgIC8vICkKICAgIGZyYW1lX2RpZyA2CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTYzCiAgICAvLyBCeXRlcyhBYnN0cmFjdEFjY291bnRHbG9iYWxTdGF0ZUtleXNDb250cm9sbGVkQWRkcmVzcykKICAgIHB1c2hieXRlcyAiY29udHJvbGxlZF9hZGRyZXNzIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoxNjEtMTY0CiAgICAvLyBjb25zdCBbY29udHJvbGxlZEFjY291bnRCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcygKICAgIC8vICAgd2FsbGV0SUQsCiAgICAvLyAgIEJ5dGVzKEFic3RyYWN0QWNjb3VudEdsb2JhbFN0YXRlS2V5c0NvbnRyb2xsZWRBZGRyZXNzKQogICAgLy8gKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIxNgogICAgLy8gY29uc3Qgb3B0aW4gPSBnZXRQbHVnaW5BcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm9wdGluCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjE2CiAgICAvLyBjb25zdCBvcHRpbiA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkub3B0aW4KICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUwCiAgICAvLyBjb25zdCBbcGx1Z2luQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1BsdWdpbkFwcExpc3QpKQogICAgYnl0ZWMgMTYgLy8gInBhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMTYKICAgIC8vIGNvbnN0IG9wdGluID0gZ2V0UGx1Z2luQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5vcHRpbgogICAgZHVwCiAgICBleHRyYWN0IDAgOAogICAgc3dhcAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjE4LTIyNwogICAgLy8gaXR4bkNvbXBvc2UuYmVnaW48dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF9yZWtleVRvUGx1Z2luPih7CiAgICAvLyAgIGFwcElkOiB3YWxsZXQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBvcHRpbiwKICAgIC8vICAgICB0cnVlLCAvLyBnbG9iYWwKICAgIC8vICAgICAnJywgLy8gZGVmYXVsdCBhY2NvdW50CiAgICAvLyAgICAgW10sIC8vIG5vIG1ldGhvZCBvZmZzZXRzCiAgICAvLyAgICAgW10gLy8gbm8gZnVuZHMgcmVxdWVzdAogICAgLy8gICBdCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgYnl0ZWMgMjkgLy8gbWV0aG9kICJhcmM1OF9yZWtleVRvUGx1Z2luKHVpbnQ2NCxib29sLHN0cmluZyx1aW50NjRbXSwodWludDY0LHVpbnQ2NClbXSl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjIyCiAgICAvLyB0cnVlLCAvLyBnbG9iYWwKICAgIGJ5dGVjIDEyIC8vIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjIzCiAgICAvLyAnJywgLy8gZGVmYXVsdCBhY2NvdW50CiAgICBieXRlYyAxMCAvLyAweDAwMDAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjI0CiAgICAvLyBbXSwgLy8gbm8gbWV0aG9kIG9mZnNldHMKICAgIGJ5dGVjIDEwIC8vIDB4MDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMjUKICAgIC8vIFtdIC8vIG5vIGZ1bmRzIHJlcXVlc3QKICAgIGJ5dGVjIDEwIC8vIDB4MDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGRpZyAxCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMTgtMjI3CiAgICAvLyBpdHhuQ29tcG9zZS5iZWdpbjx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X3Jla2V5VG9QbHVnaW4+KHsKICAgIC8vICAgYXBwSWQ6IHdhbGxldCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIG9wdGluLAogICAgLy8gICAgIHRydWUsIC8vIGdsb2JhbAogICAgLy8gICAgICcnLCAvLyBkZWZhdWx0IGFjY291bnQKICAgIC8vICAgICBbXSwgLy8gbm8gbWV0aG9kIG9mZnNldHMKICAgIC8vICAgICBbXSAvLyBubyBmdW5kcyByZXF1ZXN0CiAgICAvLyAgIF0KICAgIC8vIH0pCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjI5LTI0MAogICAgLy8gaXR4bkNvbXBvc2UubmV4dDx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPih7CiAgICAvLyAgIGFwcElkOiBvcHRpbiwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIHdhbGxldCwKICAgIC8vICAgICB0cnVlLCAvLyByZWtleSBiYWNrIGltbWVkaWF0ZWx5CiAgICAvLyAgICAgW2Fzc2V0XSwKICAgIC8vICAgICBpdHhuLnBheW1lbnQoewogICAgLy8gICAgICAgYW1vdW50OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UsCiAgICAvLyAgICAgICByZWNlaXZlcjogb3JpZ2luCiAgICAvLyAgICAgfSkKICAgIC8vICAgXSwKICAgIC8vIH0pCiAgICBpdHhuX25leHQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMzYKICAgIC8vIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICBkaWcgMwogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMzUtMjM4CiAgICAvLyBpdHhuLnBheW1lbnQoewogICAgLy8gICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSwKICAgIC8vICAgcmVjZWl2ZXI6IG9yaWdpbgogICAgLy8gfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMjktMjQwCiAgICAvLyBpdHhuQ29tcG9zZS5uZXh0PHR5cGVvZiBPcHRJblBsdWdpbi5wcm90b3R5cGUub3B0SW4+KHsKICAgIC8vICAgYXBwSWQ6IG9wdGluLAogICAgLy8gICBhcmdzOiBbCiAgICAvLyAgICAgd2FsbGV0LAogICAgLy8gICAgIHRydWUsIC8vIHJla2V5IGJhY2sgaW1tZWRpYXRlbHkKICAgIC8vICAgICBbYXNzZXRdLAogICAgLy8gICAgIGl0eG4ucGF5bWVudCh7CiAgICAvLyAgICAgICBhbW91bnQ6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZSwKICAgIC8vICAgICAgIHJlY2VpdmVyOiBvcmlnaW4KICAgIC8vICAgICB9KQogICAgLy8gICBdLAogICAgLy8gfSkKICAgIGl0eG5fbmV4dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIzMgogICAgLy8gd2FsbGV0LAogICAgZGlnIDEKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMzQKICAgIC8vIFthc3NldF0sCiAgICBmcmFtZV9kaWcgMgogICAgZHVwCiAgICBjb3ZlciAzCiAgICBpdG9iCiAgICBieXRlYyAyMSAvLyAweDAwMDEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyOS0yNDAKICAgIC8vIGl0eG5Db21wb3NlLm5leHQ8dHlwZW9mIE9wdEluUGx1Z2luLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogb3B0aW4sCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB3YWxsZXQsCiAgICAvLyAgICAgdHJ1ZSwgLy8gcmVrZXkgYmFjayBpbW1lZGlhdGVseQogICAgLy8gICAgIFthc3NldF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgLy8gICAgICAgcmVjZWl2ZXI6IG9yaWdpbgogICAgLy8gICAgIH0pCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgYnl0ZWMgMjIgLy8gbWV0aG9kICJvcHRJbih1aW50NjQsYm9vbCx1aW50NjRbXSxwYXkpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyMgogICAgLy8gdHJ1ZSwgLy8gZ2xvYmFsCiAgICBieXRlYyAxMiAvLyAweDgwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIyOS0yNDAKICAgIC8vIGl0eG5Db21wb3NlLm5leHQ8dHlwZW9mIE9wdEluUGx1Z2luLnByb3RvdHlwZS5vcHRJbj4oewogICAgLy8gICBhcHBJZDogb3B0aW4sCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICB3YWxsZXQsCiAgICAvLyAgICAgdHJ1ZSwgLy8gcmVrZXkgYmFjayBpbW1lZGlhdGVseQogICAgLy8gICAgIFthc3NldF0sCiAgICAvLyAgICAgaXR4bi5wYXltZW50KHsKICAgIC8vICAgICAgIGFtb3VudDogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlLAogICAgLy8gICAgICAgcmVjZWl2ZXI6IG9yaWdpbgogICAgLy8gICAgIH0pCiAgICAvLyAgIF0sCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0Mi0yNDQKICAgIC8vIGl0eG5Db21wb3NlLm5leHQ8dHlwZW9mIEFic3RyYWN0ZWRBY2NvdW50LnByb3RvdHlwZS5hcmM1OF92ZXJpZnlBdXRoQWRkcmVzcz4oewogICAgLy8gICBhcHBJZDogd2FsbGV0CiAgICAvLyB9KQogICAgaXR4bl9uZXh0CiAgICBieXRlYyAzMCAvLyBtZXRob2QgImFyYzU4X3ZlcmlmeUF1dGhBZGRyZXNzKCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI0Ni0yNTIKICAgIC8vIGl0eG5Db21wb3NlLm5leHQoCiAgICAvLyAgIGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiB0YXgsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldAogICAgLy8gICB9KQogICAgLy8gKQogICAgaXR4bl9uZXh0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQ4CiAgICAvLyBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NjUKICAgIC8vIGFraXRhREFPRXNjcm93ID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhRXNjcm93IH0pCiAgICBieXRlYyA2IC8vICJha2l0YV9lc2Nyb3ciCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQ4CiAgICAvLyBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgZGlnIDEKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBmcmFtZV9kaWcgNAogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjQ3LTI1MQogICAgLy8gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICBhc3NldEFtb3VudDogdGF4LAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI1NC0yNjAKICAgIC8vIGl0eG5Db21wb3NlLm5leHQoCiAgICAvLyAgIGl0eG4uYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogb3JpZ2luLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiByZW1haW5kZXIsCiAgICAvLyAgICAgeGZlckFzc2V0OiBhc3NldAogICAgLy8gICB9KQogICAgLy8gKQogICAgaXR4bl9uZXh0CiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjU1LTI1OQogICAgLy8gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogb3JpZ2luLAogICAgLy8gICBhc3NldEFtb3VudDogcmVtYWluZGVyLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI2MgogICAgLy8gaXR4bkNvbXBvc2Uuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzE0CiAgICAvLyByZXR1cm4gYXJjNTgKICAgIGZyYW1lX2RpZyAzCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKdGlwQ3JlYXRvcl9hZnRlcl9pZl9lbHNlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzE3CiAgICAvLyB0aGlzLnNlbmREaXJlY3RSZWFjdGlvblBheW1lbnRzKGNyZWF0b3IsIGFrdGEsIGxlZnRvdmVyLCAocmVhY3RGZWUgLSB0YXgpKQogICAgZnJhbWVfZGlnIC0xCiAgICAtCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI2OAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgNiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI2OAogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIHN3YXAKICAgIGZyYW1lX2J1cnkgMQogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI3MwogICAgLy8gaWYgKHJlbWFpbmRlciA+IDAgJiYgY3JlYXRvci5pc09wdGVkSW4oQXNzZXQoYXNzZXQpKSkgewogICAgYnogdGlwQ3JlYXRvcl9lbHNlX2JvZHlAMTEKICAgIGZyYW1lX2RpZyAtMwogICAgZnJhbWVfZGlnIDIKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBieiB0aXBDcmVhdG9yX2Vsc2VfYm9keUAxMQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI4MAogICAgLy8gaXR4bi5zdWJtaXRHcm91cCh0YXhUeG4sIHhmZXJUeG4pCiAgICBpdHhuX2JlZ2luCiAgICBmcmFtZV9kaWcgMgogICAgZHVwCiAgICBpdHhuX2ZpZWxkIFhmZXJBc3NldAogICAgZnJhbWVfZGlnIDQKICAgIGl0eG5fZmllbGQgQXNzZXRBbW91bnQKICAgIGZyYW1lX2RpZyAxCiAgICBpdHhuX2ZpZWxkIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyNjctMjcxCiAgICAvLyBjb25zdCB0YXhUeG4gPSBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgIGFzc2V0QW1vdW50OiB0YXgsCiAgICAvLyAgIHhmZXJBc3NldDogYXNzZXQKICAgIC8vIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjgwCiAgICAvLyBpdHhuLnN1Ym1pdEdyb3VwKHRheFR4biwgeGZlclR4bikKICAgIGl0eG5fbmV4dAogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGZyYW1lX2RpZyA1CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBmcmFtZV9kaWcgLTMKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI3NC0yNzgKICAgIC8vIGNvbnN0IHhmZXJUeG4gPSBpdHhuLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICBhc3NldFJlY2VpdmVyOiBjcmVhdG9yLAogICAgLy8gICBhc3NldEFtb3VudDogcmVtYWluZGVyLAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI4MAogICAgLy8gaXR4bi5zdWJtaXRHcm91cCh0YXhUeG4sIHhmZXJUeG4pCiAgICBpdHhuX3N1Ym1pdAoKdGlwQ3JlYXRvcl9hZnRlcl9pZl9lbHNlQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMxOAogICAgLy8gcmV0dXJuIDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKdGlwQ3JlYXRvcl9lbHNlX2JvZHlAMTE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjgzCiAgICAvLyBhc3NldEFtb3VudDogdGF4ICsgcmVtYWluZGVyCiAgICBmcmFtZV9kaWcgNAogICAgZnJhbWVfZGlnIDUKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyODUKICAgIC8vIHRheFR4bi5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgZnJhbWVfZGlnIDIKICAgIGl0eG5fZmllbGQgWGZlckFzc2V0CiAgICBpdHhuX2ZpZWxkIEFzc2V0QW1vdW50CiAgICBmcmFtZV9kaWcgMQogICAgaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjY3LTI3MQogICAgLy8gY29uc3QgdGF4VHhuID0gaXR4bi5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICBhc3NldEFtb3VudDogdGF4LAogICAgLy8gICB4ZmVyQXNzZXQ6IGFzc2V0CiAgICAvLyB9KQogICAgcHVzaGludCA0IC8vIDQKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjI4NQogICAgLy8gdGF4VHhuLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgYiB0aXBDcmVhdG9yX2FmdGVyX2lmX2Vsc2VAMTIKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNyZWF0ZUVtcHR5UG9zdElmTmVjZXNzYXJ5KGtleTogYnl0ZXMsIGNyZWF0b3I6IGJ5dGVzKSAtPiB1aW50NjQ6CmNyZWF0ZUVtcHR5UG9zdElmTmVjZXNzYXJ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMyMQogICAgLy8gcHJpdmF0ZSBjcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeShrZXk6IGJ5dGVzPDMyPiwgY3JlYXRvcjogQWNjb3VudCk6IHVpbnQ2NCB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMyMgogICAgLy8gaWYgKCF0aGlzLnBvc3RzKGtleSkuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJueiBjcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeV9hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMzMKICAgIC8vIHRpbWVzdGFtcDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozMjMtMzM5CiAgICAvLyB0aGlzLnBvc3RzKGtleSkudmFsdWUgPSB7CiAgICAvLyAgIHJlZjogb3AuYnplcm8oMCksCiAgICAvLyAgIC8qKgogICAgLy8gICAgKiB3aGVuIGEgdXNlciByZWFjdHMgdG8gY29udGVudCBvdGhlciB0aGFuIHBvc3RzCiAgICAvLyAgICAqIHdlIHNldCB0aGUgY3JlYXRvciB0byB0aGUgZm9sbG93aW5nOgogICAgLy8gICAgKiAtIEFzc2V0SUQ6IEFzc2V0IENyZWF0b3IKICAgIC8vICAgICogLSBBZGRyZXNzOiBBY2NvdW50CiAgICAvLyAgICAqIC0gICBBcHBJRDogQXBwbGljYXRpb24gQ3JlYXRvcgogICAgLy8gICAgKi8KICAgIC8vICAgY3JlYXRvciwKICAgIC8vICAgdGltZXN0YW1wOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgLy8gICBnYXRlSUQ6IDAsCiAgICAvLyAgIHVzZVBheVdhbGw6IGZhbHNlLAogICAgLy8gICBwYXlXYWxsSUQ6IDAsCiAgICAvLyAgIGFnYWluc3RDb250ZW50UG9saWN5OiBmYWxzZSwKICAgIC8vICAgcG9zdFR5cGU6IFBvc3RUeXBlUG9zdCwKICAgIC8vIH0KICAgIGl0b2IKICAgIGZyYW1lX2RpZyAtMQogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzM0CiAgICAvLyBnYXRlSUQ6IDAsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjMyMy0zMzkKICAgIC8vIHRoaXMucG9zdHMoa2V5KS52YWx1ZSA9IHsKICAgIC8vICAgcmVmOiBvcC5iemVybygwKSwKICAgIC8vICAgLyoqCiAgICAvLyAgICAqIHdoZW4gYSB1c2VyIHJlYWN0cyB0byBjb250ZW50IG90aGVyIHRoYW4gcG9zdHMKICAgIC8vICAgICogd2Ugc2V0IHRoZSBjcmVhdG9yIHRvIHRoZSBmb2xsb3dpbmc6CiAgICAvLyAgICAqIC0gQXNzZXRJRDogQXNzZXQgQ3JlYXRvcgogICAgLy8gICAgKiAtIEFkZHJlc3M6IEFjY291bnQKICAgIC8vICAgICogLSAgIEFwcElEOiBBcHBsaWNhdGlvbiBDcmVhdG9yCiAgICAvLyAgICAqLwogICAgLy8gICBjcmVhdG9yLAogICAgLy8gICB0aW1lc3RhbXA6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAsCiAgICAvLyAgIGdhdGVJRDogMCwKICAgIC8vICAgdXNlUGF5V2FsbDogZmFsc2UsCiAgICAvLyAgIHBheVdhbGxJRDogMCwKICAgIC8vICAgYWdhaW5zdENvbnRlbnRQb2xpY3k6IGZhbHNlLAogICAgLy8gICBwb3N0VHlwZTogUG9zdFR5cGVQb3N0LAogICAgLy8gfQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgYnl0ZWNfMyAvLyAweDAwCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgcHVzaGJ5dGVzIDB4MDAwMDAwM2QwMDAwCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAwCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM0MQogICAgLy8gcmV0dXJuIHRoaXMubWJyKEJ5dGVzKCcnKSkucG9zdHMKICAgIHB1c2hieXRlcyAiIgogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgcmV0c3ViCgpjcmVhdGVFbXB0eVBvc3RJZk5lY2Vzc2FyeV9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzQzCiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIHN3YXAKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwudXBkYXRlU3RyZWFrKGFjY291bnQ6IGJ5dGVzKSAtPiB2b2lkOgp1cGRhdGVTdHJlYWs6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzQ2CiAgICAvLyBwcml2YXRlIHVwZGF0ZVN0cmVhayhhY2NvdW50OiBBY2NvdW50KTogdm9pZCB7CiAgICBwcm90byAxIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OAogICAgLy8gbWV0YSA9IEJveE1hcDxBY2NvdW50LCBNZXRhVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1ldGEgfSkKICAgIGJ5dGVjIDQgLy8gIm0iCiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAogICAgZHVwbiAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzQ3CiAgICAvLyBhc3NlcnQodGhpcy5tZXRhKGFjY291bnQpLmV4aXN0cywgRVJSX01FVEFfRE9FU05UX0VYSVNUKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gTWV0YSBib3ggdmFsdWVzIGRvbnQgZXhpc3QgeWV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzQ5CiAgICAvLyBjb25zdCB7IHN0YXJ0RGF0ZSwgbGFzdEFjdGl2ZSB9ID0gdGhpcy5tZXRhKGFjY291bnQpLnZhbHVlCiAgICBkdXAKICAgIGJveF9nZXQKICAgIHBvcAogICAgZHVwCiAgICBwdXNoaW50IDE3IC8vIDE3CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgcHVzaGludCAyNSAvLyAyNQogICAgZXh0cmFjdF91aW50NjQKICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM1MQogICAgLy8gY29uc3QgdGhpc1dpbmRvd1N0YXJ0OiB1aW50NjQgPSBHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gKChHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gc3RhcnREYXRlKSAlIE9ORV9EQVkpCiAgICBnbG9iYWwgTGF0ZXN0VGltZXN0YW1wCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgLQogICAgaW50YyA4IC8vIDg2NDAwCiAgICAlCiAgICAtCiAgICBkdXAKICAgIGNvdmVyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNTIKICAgIC8vIGNvbnN0IGxhc3RXaW5kb3dTdGFydDogdWludDY0ID0gdGhpc1dpbmRvd1N0YXJ0IC0gT05FX0RBWQogICAgaW50YyA4IC8vIDg2NDAwCiAgICAtCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzU0CiAgICAvLyB0aGlzLm1ldGEoYWNjb3VudCkudmFsdWUubGFzdEFjdGl2ZSA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIGl0b2IKICAgIHVuY292ZXIgMwogICAgcHVzaGludCAyNSAvLyAyNQogICAgdW5jb3ZlciAyCiAgICBib3hfcmVwbGFjZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM1NwogICAgLy8gaWYgKGxhc3RXaW5kb3dTdGFydCA+IGxhc3RBY3RpdmUpIHsKICAgIDwKICAgIGJ6IHVwZGF0ZVN0cmVha19hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNTgKICAgIC8vIHRoaXMubWV0YShhY2NvdW50KS52YWx1ZS5zdHJlYWsgPSAxCiAgICBpbnRjXzEgLy8gMQogICAgaXRvYgogICAgZnJhbWVfZGlnIDAKICAgIHB1c2hpbnQgOSAvLyA5CiAgICB1bmNvdmVyIDIKICAgIGJveF9yZXBsYWNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzU5CiAgICAvLyByZXR1cm4KICAgIHJldHN1YgoKdXBkYXRlU3RyZWFrX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNjQKICAgIC8vIGlmIChsYXN0QWN0aXZlIDwgdGhpc1dpbmRvd1N0YXJ0KSB7CiAgICBmcmFtZV9kaWcgMQogICAgZnJhbWVfZGlnIDIKICAgIDwKICAgIGJ6IHVwZGF0ZVN0cmVha19hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNjUKICAgIC8vIHRoaXMubWV0YShhY2NvdW50KS52YWx1ZS5zdHJlYWsgKz0gMQogICAgZnJhbWVfZGlnIDAKICAgIGR1cAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIHB1c2hpbnQgOSAvLyA5CiAgICBleHRyYWN0X3VpbnQ2NAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIHB1c2hpbnQgOSAvLyA5CiAgICBzd2FwCiAgICBib3hfcmVwbGFjZQoKdXBkYXRlU3RyZWFrX2FmdGVyX2lmX2Vsc2VANDoKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwudXBkYXRlVm90ZXMocmVmOiBieXRlcywgaXNVcDogdWludDY0LCBpbXBhY3Q6IHVpbnQ2NCkgLT4gdm9pZDoKdXBkYXRlVm90ZXM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDAxCiAgICAvLyBwcml2YXRlIHVwZGF0ZVZvdGVzKHJlZjogYnl0ZXM8MzI+LCBpc1VwOiBib29sZWFuLCBpbXBhY3Q6IHVpbnQ2NCk6IHZvaWQgewogICAgcHJvdG8gMyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIGR1cG4gMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwCiAgICAvLyB2b3RlcyA9IEJveE1hcDxieXRlczwzMj4sIFZvdGVzVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFZvdGVzIH0pCiAgICBwdXNoYnl0ZXMgInYiCiAgICBmcmFtZV9kaWcgLTMKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzcyCiAgICAvLyBpZiAoIXRoaXMudm90ZXMocmVmKS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYm56IHVwZGF0ZVZvdGVzX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM3MwogICAgLy8gcmV0dXJuIHsgbmV3Q291bnQ6IGltcGFjdCwgaXNOZWdhdGl2ZTogIWlzVXAgfQogICAgZnJhbWVfZGlnIC0yCiAgICAhCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0b2IKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMwogICAgc2V0Yml0CiAgICBjb25jYXQKCnVwZGF0ZVZvdGVzX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5jYWxjVm90ZXNAMjA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDAyCiAgICAvLyBjb25zdCB7IG5ld0NvdW50OiB2b3RlQ291bnQsIGlzTmVnYXRpdmUgfSA9IHRoaXMuY2FsY1ZvdGVzKHJlZiwgaXNVcCwgaW1wYWN0KQogICAgZHVwCiAgICBleHRyYWN0IDAgOAogICAgc3dhcAogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDAzCiAgICAvLyB0aGlzLnZvdGVzKHJlZikudmFsdWUgPSB7IHZvdGVDb3VudCwgaXNOZWdhdGl2ZSB9CiAgICBieXRlY18zIC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgMwogICAgc3dhcAogICAgYm94X3B1dAogICAgcmV0c3ViCgp1cGRhdGVWb3Rlc19hZnRlcl9pZl9lbHNlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzc2CiAgICAvLyBjb25zdCB7IGlzTmVnYXRpdmUsIHZvdGVDb3VudCB9ID0gdGhpcy52b3RlcyhyZWYpLnZhbHVlCiAgICBmcmFtZV9kaWcgMwogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgcHVzaGludCA2NCAvLyA2NAogICAgZ2V0Yml0CiAgICBmcmFtZV9idXJ5IDEKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Mzc5CiAgICAvLyBjb25zdCBkaWZmZXJpbmdEaXJlY3Rpb25zID0gKGlzVXAgJiYgaXNOZWdhdGl2ZSkgfHwgKCFpc1VwICYmICFpc05lZ2F0aXZlKQogICAgZnJhbWVfZGlnIC0yCiAgICBieiB1cGRhdGVWb3Rlc19vcl9jb250ZEA1CiAgICBmcmFtZV9kaWcgMQogICAgYm56IHVwZGF0ZVZvdGVzX2Jvb2xfdHJ1ZUA3Cgp1cGRhdGVWb3Rlc19vcl9jb250ZEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM3OQogICAgLy8gY29uc3QgZGlmZmVyaW5nRGlyZWN0aW9ucyA9IChpc1VwICYmIGlzTmVnYXRpdmUpIHx8ICghaXNVcCAmJiAhaXNOZWdhdGl2ZSkKICAgIGZyYW1lX2RpZyAtMgogICAgYm56IHVwZGF0ZVZvdGVzX2Jvb2xfZmFsc2VAOAogICAgZnJhbWVfZGlnIDEKICAgIGJueiB1cGRhdGVWb3Rlc19ib29sX2ZhbHNlQDgKCnVwZGF0ZVZvdGVzX2Jvb2xfdHJ1ZUA3OgogICAgaW50Y18xIC8vIDEKICAgIGZyYW1lX2J1cnkgMAoKdXBkYXRlVm90ZXNfYm9vbF9tZXJnZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM4MQogICAgLy8gaWYgKHZvdGVDb3VudCA9PT0gMCkgewogICAgZnJhbWVfZGlnIDIKICAgIGJueiB1cGRhdGVWb3Rlc19hZnRlcl9pZl9lbHNlQDExCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzgyCiAgICAvLyByZXR1cm4geyBuZXdDb3VudDogaW1wYWN0LCBpc05lZ2F0aXZlOiAhaXNVcCB9CiAgICBmcmFtZV9kaWcgLTIKICAgICEKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgYnl0ZWNfMyAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAzCiAgICBzZXRiaXQKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwMgogICAgLy8gY29uc3QgeyBuZXdDb3VudDogdm90ZUNvdW50LCBpc05lZ2F0aXZlIH0gPSB0aGlzLmNhbGNWb3RlcyhyZWYsIGlzVXAsIGltcGFjdCkKICAgIGIgdXBkYXRlVm90ZXNfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNhbGNWb3Rlc0AyMAoKdXBkYXRlVm90ZXNfYWZ0ZXJfaWZfZWxzZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODUKICAgIC8vIGlmIChpbXBhY3QgPT09IHZvdGVDb3VudCAmJiBkaWZmZXJpbmdEaXJlY3Rpb25zKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2RpZyAyCiAgICA9PQogICAgYnogdXBkYXRlVm90ZXNfYWZ0ZXJfaWZfZWxzZUAxNAogICAgZnJhbWVfZGlnIDAKICAgIGJ6IHVwZGF0ZVZvdGVzX2FmdGVyX2lmX2Vsc2VAMTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozODYKICAgIC8vIHJldHVybiB7IG5ld0NvdW50OiAwLCBpc05lZ2F0aXZlOiBmYWxzZSB9CiAgICBieXRlYyAzMSAvLyAweDAwMDAwMDAwMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwMgogICAgLy8gY29uc3QgeyBuZXdDb3VudDogdm90ZUNvdW50LCBpc05lZ2F0aXZlIH0gPSB0aGlzLmNhbGNWb3RlcyhyZWYsIGlzVXAsIGltcGFjdCkKICAgIGIgdXBkYXRlVm90ZXNfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNhbGNWb3Rlc0AyMAoKdXBkYXRlVm90ZXNfYWZ0ZXJfaWZfZWxzZUAxNDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozOTEKICAgIC8vIGNvbnN0IGZsaXAgPSBpbXBhY3QgPiB2b3RlQ291bnQgJiYgZGlmZmVyaW5nRGlyZWN0aW9ucwogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgMgogICAgPgogICAgZnJhbWVfZGlnIDAKICAgICYmCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzkyCiAgICAvLyBpZiAoZmxpcCkgewogICAgYnogdXBkYXRlVm90ZXNfYWZ0ZXJfaWZfZWxzZUAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM5MwogICAgLy8gY29uc3QgbmV3Q291bnQ6IHVpbnQ2NCA9IGltcGFjdCAtIHZvdGVDb3VudAogICAgZnJhbWVfZGlnIC0xCiAgICBmcmFtZV9kaWcgMgogICAgLQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM5NAogICAgLy8gcmV0dXJuIHsgbmV3Q291bnQsIGlzTmVnYXRpdmU6ICFpc05lZ2F0aXZlIH0KICAgIGZyYW1lX2RpZyAxCiAgICAhCiAgICBzd2FwCiAgICBpdG9iCiAgICBieXRlY18zIC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDMKICAgIHNldGJpdAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDAyCiAgICAvLyBjb25zdCB7IG5ld0NvdW50OiB2b3RlQ291bnQsIGlzTmVnYXRpdmUgfSA9IHRoaXMuY2FsY1ZvdGVzKHJlZiwgaXNVcCwgaW1wYWN0KQogICAgYiB1cGRhdGVWb3Rlc19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuY2FsY1ZvdGVzQDIwCgp1cGRhdGVWb3Rlc19hZnRlcl9pZl9lbHNlQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM5NwogICAgLy8gY29uc3QgbmV3Q291bnQ6IHVpbnQ2NCA9IGRpZmZlcmluZ0RpcmVjdGlvbnMgPyB2b3RlQ291bnQgLSBpbXBhY3QgOiB2b3RlQ291bnQgKyBpbXBhY3QKICAgIGZyYW1lX2RpZyAwCiAgICBieiB1cGRhdGVWb3Rlc190ZXJuYXJ5X2ZhbHNlQDE4CiAgICBmcmFtZV9kaWcgMgogICAgZnJhbWVfZGlnIC0xCiAgICAtCgp1cGRhdGVWb3Rlc190ZXJuYXJ5X21lcmdlQDE5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM5OAogICAgLy8gcmV0dXJuIHsgbmV3Q291bnQsIGlzTmVnYXRpdmUgfQogICAgaXRvYgogICAgYnl0ZWNfMyAvLyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfZGlnIDEKICAgIHNldGJpdAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDAyCiAgICAvLyBjb25zdCB7IG5ld0NvdW50OiB2b3RlQ291bnQsIGlzTmVnYXRpdmUgfSA9IHRoaXMuY2FsY1ZvdGVzKHJlZiwgaXNVcCwgaW1wYWN0KQogICAgYiB1cGRhdGVWb3Rlc19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuY2FsY1ZvdGVzQDIwCgp1cGRhdGVWb3Rlc190ZXJuYXJ5X2ZhbHNlQDE4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjM5NwogICAgLy8gY29uc3QgbmV3Q291bnQ6IHVpbnQ2NCA9IGRpZmZlcmluZ0RpcmVjdGlvbnMgPyB2b3RlQ291bnQgLSBpbXBhY3QgOiB2b3RlQ291bnQgKyBpbXBhY3QKICAgIGZyYW1lX2RpZyAyCiAgICBmcmFtZV9kaWcgLTEKICAgICsKICAgIGIgdXBkYXRlVm90ZXNfdGVybmFyeV9tZXJnZUAxOQoKdXBkYXRlVm90ZXNfYm9vbF9mYWxzZUA4OgogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgMAogICAgYiB1cGRhdGVWb3Rlc19ib29sX21lcmdlQDkKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNyZWF0ZVZvdGVMaXN0KHJlZjogYnl0ZXMsIGlzVXA6IHVpbnQ2NCwgYWNjb3VudDogYnl0ZXMsIGltcGFjdDogdWludDY0KSAtPiB2b2lkOgpjcmVhdGVWb3RlTGlzdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MDYKICAgIC8vIHByaXZhdGUgY3JlYXRlVm90ZUxpc3QocmVmOiBieXRlczwzMj4sIGlzVXA6IGJvb2xlYW4sIGFjY291bnQ6IEFjY291bnQsIGltcGFjdDogdWludDY0KTogdm9pZCB7CiAgICBwcm90byA0IDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MDcKICAgIC8vIGNvbnN0IHZvdGVMaXN0S2V5OiBWb3RlTGlzdEtleSA9IHsgdXNlcjogYjE2KGFjY291bnQuYnl0ZXMpLCByZWY6IGIxNihyZWYpIH0KICAgIGZyYW1lX2RpZyAtMgogICAgY2FsbHN1YiBiMTYKICAgIGZyYW1lX2RpZyAtNAogICAgY2FsbHN1YiBiMTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQwOAogICAgLy8gdGhpcy52b3RlbGlzdCh2b3RlTGlzdEtleSkudmFsdWUgPSB7IGltcGFjdCwgaXNVcCB9CiAgICBmcmFtZV9kaWcgLTEKICAgIGl0b2IKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtMwogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MgogICAgLy8gdm90ZWxpc3QgPSBCb3hNYXA8Vm90ZUxpc3RLZXksIFZvdGVMaXN0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFZvdGVMaXN0IH0pCiAgICBieXRlYyAxNSAvLyAibyIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDA4CiAgICAvLyB0aGlzLnZvdGVsaXN0KHZvdGVMaXN0S2V5KS52YWx1ZSA9IHsgaW1wYWN0LCBpc1VwIH0KICAgIHN3YXAKICAgIGJveF9wdXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuY3JlYXRlUG9zdChwb3N0S2V5OiBieXRlcywgbWJyUGF5bWVudDogdWludDY0LCBjaWQ6IGJ5dGVzLCBnYXRlSUQ6IHVpbnQ2NCwgdXNlUGF5V2FsbDogdWludDY0LCBwYXlXYWxsSUQ6IHVpbnQ2NCwgcG9zdFR5cGU6IGJ5dGVzLCBhbWVuZG1lbnRPZjogYnl0ZXMpIC0+IHZvaWQ6CmNyZWF0ZVBvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDExLTQyMAogICAgLy8gcHJpdmF0ZSBjcmVhdGVQb3N0KAogICAgLy8gICBwb3N0S2V5OiBieXRlczwzMj4sCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIGdhdGVJRDogdWludDY0LAogICAgLy8gICB1c2VQYXlXYWxsOiBib29sZWFuLAogICAgLy8gICBwYXlXYWxsSUQ6IHVpbnQ2NCwKICAgIC8vICAgcG9zdFR5cGU6IFBvc3RUeXBlLAogICAgLy8gICBhbWVuZG1lbnRPZjogYnl0ZXM8MzI+LAogICAgLy8gKTogdm9pZCB7CiAgICBwcm90byA4IDAKICAgIGludGNfMCAvLyAwCiAgICBwdXNoYnl0ZXMgIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MjEKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jhbm5lZChUeG4uc2VuZGVyKSwgRVJSX0JBTk5FRCkKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MjMKICAgIC8vICghdXNlUGF5V2FsbCAmJiBwYXlXYWxsSUQgPT09IDApIHx8ICgKICAgIGZyYW1lX2RpZyAtNAogICAgYm56IGNyZWF0ZVBvc3Rfb3JfY29udGRAMgogICAgZnJhbWVfZGlnIC0zCiAgICBieiBjcmVhdGVQb3N0X2Jvb2xfdHJ1ZUA3CgpjcmVhdGVQb3N0X29yX2NvbnRkQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDI0LTQyNwogICAgLy8gdXNlUGF5V2FsbCAmJiAoCiAgICAvLyAgIHBheVdhbGxJRCAhPT0gMCAmJiB0aGlzLnBheXdhbGwocGF5V2FsbElEKS5leGlzdHMgfHwKICAgIC8vICAgcGF5V2FsbElEID09PSAwICYmIHRoaXMucGF5d2FsbCh0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUuZGVmYXVsdFBheVdhbGxJRCkuZXhpc3RzCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTQKICAgIGJ6IGNyZWF0ZVBvc3RfYm9vbF9mYWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDI1CiAgICAvLyBwYXlXYWxsSUQgIT09IDAgJiYgdGhpcy5wYXl3YWxsKHBheVdhbGxJRCkuZXhpc3RzIHx8CiAgICBmcmFtZV9kaWcgLTMKICAgIGJ6IGNyZWF0ZVBvc3Rfb3JfY29udGRANQogICAgZnJhbWVfZGlnIC0zCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzgKICAgIC8vIHBheXdhbGwgPSBCb3hNYXA8dWludDY0LCBWaWV3UGF5V2FsbFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxib3hQcmVmaXhQYXlXYWxsIH0pCiAgICBieXRlYyAxOCAvLyAidyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyNQogICAgLy8gcGF5V2FsbElEICE9PSAwICYmIHRoaXMucGF5d2FsbChwYXlXYWxsSUQpLmV4aXN0cyB8fAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBibnogY3JlYXRlUG9zdF9ib29sX3RydWVANwoKY3JlYXRlUG9zdF9vcl9jb250ZEA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyNgogICAgLy8gcGF5V2FsbElEID09PSAwICYmIHRoaXMucGF5d2FsbCh0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUuZGVmYXVsdFBheVdhbGxJRCkuZXhpc3RzCiAgICBmcmFtZV9kaWcgLTMKICAgIGJueiBjcmVhdGVQb3N0X2Jvb2xfZmFsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MjYKICAgIC8vIHBheVdhbGxJRCA9PT0gMCAmJiB0aGlzLnBheXdhbGwodGhpcy5tZXRhKFR4bi5zZW5kZXIpLnZhbHVlLmRlZmF1bHRQYXlXYWxsSUQpLmV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDI2CiAgICAvLyBwYXlXYWxsSUQgPT09IDAgJiYgdGhpcy5wYXl3YWxsKHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5kZWZhdWx0UGF5V2FsbElEKS5leGlzdHMKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBleHRyYWN0IDY2IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozOAogICAgLy8gcGF5d2FsbCA9IEJveE1hcDx1aW50NjQsIFZpZXdQYXlXYWxsVmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbGJveFByZWZpeFBheVdhbGwgfSkKICAgIGJ5dGVjIDE4IC8vICJ3IgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDI2CiAgICAvLyBwYXlXYWxsSUQgPT09IDAgJiYgdGhpcy5wYXl3YWxsKHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5kZWZhdWx0UGF5V2FsbElEKS5leGlzdHMKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogY3JlYXRlUG9zdF9ib29sX2ZhbHNlQDgKCmNyZWF0ZVBvc3RfYm9vbF90cnVlQDc6CiAgICBpbnRjXzEgLy8gMQoKY3JlYXRlUG9zdF9ib29sX21lcmdlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDIyLTQzMAogICAgLy8gYXNzZXJ0KAogICAgLy8gICAoIXVzZVBheVdhbGwgJiYgcGF5V2FsbElEID09PSAwKSB8fCAoCiAgICAvLyAgICAgdXNlUGF5V2FsbCAmJiAoCiAgICAvLyAgICAgICBwYXlXYWxsSUQgIT09IDAgJiYgdGhpcy5wYXl3YWxsKHBheVdhbGxJRCkuZXhpc3RzIHx8CiAgICAvLyAgICAgICBwYXlXYWxsSUQgPT09IDAgJiYgdGhpcy5wYXl3YWxsKHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZS5kZWZhdWx0UGF5V2FsbElEKS5leGlzdHMKICAgIC8vICAgICApCiAgICAvLyAgICksCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWVdBTEwKICAgIC8vICkKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheXdhbGwKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0MzIKICAgIC8vIGNvbnN0IGlzRWRpdFBvc3QgPSBwb3N0VHlwZSA9PT0gUG9zdFR5cGVFZGl0UG9zdAogICAgZnJhbWVfZGlnIC0yCiAgICBieXRlYyAyNCAvLyAweDAyCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzNAogICAgLy8gY29uc3QgZWRpdEV4dHJhTWJyOiB1aW50NjQgPSBpc0VkaXRQb3N0ID8gRWRpdEJhY2tSZWZNQlIgOiAwCiAgICBkdXAKICAgIGludGMgNSAvLyAxMzIwMAogICAgKgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzNQogICAgLy8gdGhpcy52YWxpZGF0ZVBvc3RQYXltZW50KG1iclBheW1lbnQsIGNpZCwgaXNFZGl0UG9zdCwgZWRpdEV4dHJhTWJyKQogICAgZnJhbWVfZGlnIC03CiAgICBmcmFtZV9kaWcgLTYKICAgIGRpZyAzCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgdmFsaWRhdGVQb3N0UGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQzOQogICAgLy8gdGhpcy51cGRhdGVTdHJlYWsoVHhuLnNlbmRlcikKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgdXBkYXRlU3RyZWFrCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQxCiAgICAvLyBjb25zdCBpbXBhY3QgPSB0aGlzLmdldFVzZXJJbXBhY3QoVHhuLnNlbmRlcikKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdAogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGZyYW1lX2RpZyAtOAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ0MwogICAgLy8gYXNzZXJ0KCF0aGlzLnBvc3RzKHBvc3RLZXkpLmV4aXN0cywgJ0VSUjpQT1NUX0VYSVNUUycpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBFUlI6UE9TVF9FWElTVFMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NDgtNDUwCiAgICAvLyBjb25zdCBwb3N0UmVmOiBieXRlcyA9IGlzRWRpdFBvc3QKICAgIC8vICAgPyBCeXRlcyhjaWQpLmNvbmNhdChhbWVuZG1lbnRPZikKICAgIC8vICAgOiBCeXRlcyhjaWQpCiAgICBieiBjcmVhdGVQb3N0X3Rlcm5hcnlfZmFsc2VAMTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NDkKICAgIC8vID8gQnl0ZXMoY2lkKS5jb25jYXQoYW1lbmRtZW50T2YpCiAgICBmcmFtZV9kaWcgLTYKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CgpjcmVhdGVQb3N0X3Rlcm5hcnlfbWVyZ2VAMTI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDU0CiAgICAvLyBjcmVhdG9yOiBUeG4uc2VuZGVyLAogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ1NQogICAgLy8gdGltZXN0YW1wOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ1Mi00NjEKICAgIC8vIHRoaXMucG9zdHMocG9zdEtleSkudmFsdWUgPSB7CiAgICAvLyAgIHJlZjogcG9zdFJlZiwKICAgIC8vICAgY3JlYXRvcjogVHhuLnNlbmRlciwKICAgIC8vICAgdGltZXN0YW1wOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgLy8gICBnYXRlSUQ6IGdhdGVJRCwKICAgIC8vICAgdXNlUGF5V2FsbCwKICAgIC8vICAgcGF5V2FsbElELAogICAgLy8gICBhZ2FpbnN0Q29udGVudFBvbGljeTogZmFsc2UsCiAgICAvLyAgIHBvc3RUeXBlOiBwb3N0VHlwZSwKICAgIC8vIH0KICAgIGl0b2IKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC01CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtNAogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMwogICAgaXRvYgogICAgY29uY2F0CiAgICBieXRlY18zIC8vIDB4MDAKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBzd2FwCiAgICBieXRlYyAzMiAvLyAweDAwM2QKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgMAogICAgZHVwCiAgICBib3hfZGVsCiAgICBwb3AKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NjIKICAgIC8vIHRoaXMudXBkYXRlVm90ZXMocG9zdEtleSwgdHJ1ZSwgaW1wYWN0KQogICAgZnJhbWVfZGlnIC04CiAgICBpbnRjXzEgLy8gMQogICAgZnJhbWVfZGlnIDEKICAgIGR1cAogICAgY292ZXIgMwogICAgY2FsbHN1YiB1cGRhdGVWb3RlcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ2MwogICAgLy8gdGhpcy5jcmVhdGVWb3RlTGlzdChwb3N0S2V5LCB0cnVlLCBUeG4uc2VuZGVyLCBpbXBhY3QpCiAgICBmcmFtZV9kaWcgLTgKICAgIGludGNfMSAvLyAxCiAgICB0eG4gU2VuZGVyCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgY3JlYXRlVm90ZUxpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMDEKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjAxCiAgICAvLyBjb25zdCBha3RhID0gZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBkdXAKICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoyMDEKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBkaWcgMQogICAgYnl0ZWMgOSAvLyAic29jaWFsX2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjAyCiAgICAvLyBjb25zdCB7IHBvc3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwMwogICAgLy8gY29uc3QgeyBsZWZ0b3ZlciB9ID0gc2VuZFJlZmVycmFsUGF5bWVudCh0aGlzLmFraXRhREFPLnZhbHVlLCBha3RhLCBwb3N0RmVlKQogICAgdW5jb3ZlciAyCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBjYWxsc3ViIHNlbmRSZWZlcnJhbFBheW1lbnQKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwNS0yMTEKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogbGVmdG92ZXIsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwNwogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjY1CiAgICAvLyBha2l0YURBT0VzY3JvdyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YUVzY3JvdyB9KQogICAgYnl0ZWMgNiAvLyAiYWtpdGFfZXNjcm93IgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwNwogICAgLy8gYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHVuY292ZXIgMgogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjIwNS0yMTAKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogbGVmdG92ZXIsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MjA1LTIxMQogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiBsZWZ0b3ZlciwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFrdGEKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgcmV0c3ViCgpjcmVhdGVQb3N0X3Rlcm5hcnlfZmFsc2VAMTE6CiAgICBmcmFtZV9kaWcgLTYKICAgIGIgY3JlYXRlUG9zdF90ZXJuYXJ5X21lcmdlQDEyCgpjcmVhdGVQb3N0X2Jvb2xfZmFsc2VAODoKICAgIGludGNfMCAvLyAwCiAgICBiIGNyZWF0ZVBvc3RfYm9vbF9tZXJnZUA5CgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5jcmVhdGVSZXBseShyZXBseUtleTogYnl0ZXMsIG1iclBheW1lbnQ6IHVpbnQ2NCwgbWJyTmVlZGVkOiB1aW50NjQsIGNpZDogYnl0ZXMsIHBhcmVudFJlZjogYnl0ZXMsIGdhdGVJRDogdWludDY0LCB1c2VQYXlXYWxsOiB1aW50NjQsIHBheVdhbGxJRDogdWludDY0LCBwb3N0VHlwZTogYnl0ZXMsIGFtZW5kbWVudE9mOiBieXRlcykgLT4gdm9pZDoKY3JlYXRlUmVwbHk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDY3LTQ3OAogICAgLy8gcHJpdmF0ZSBjcmVhdGVSZXBseSgKICAgIC8vICAgcmVwbHlLZXk6IGJ5dGVzPDMyPiwKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBtYnJOZWVkZWQ6IHVpbnQ2NCwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIHBhcmVudFJlZjogYnl0ZXM8MzI+LAogICAgLy8gICBnYXRlSUQ6IHVpbnQ2NCwKICAgIC8vICAgdXNlUGF5V2FsbDogYm9vbGVhbiwKICAgIC8vICAgcGF5V2FsbElEOiB1aW50NjQsCiAgICAvLyAgIHBvc3RUeXBlOiBQb3N0VHlwZSwKICAgIC8vICAgYW1lbmRtZW50T2Y6IGJ5dGVzPDMyPiwKICAgIC8vICk6IHZvaWQgewogICAgcHJvdG8gMTAgMAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0NzkKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jhbm5lZChUeG4uc2VuZGVyKSwgRVJSX0JBTk5FRCkKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZnJhbWVfZGlnIC02CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODAKICAgIC8vIGNvbnN0IHsgY3JlYXRvciB9ID0gdGhpcy5wb3N0cyhwYXJlbnRSZWYpLnZhbHVlCiAgICBpbnRjXzAgLy8gMAogICAgaW50Y18zIC8vIDMyCiAgICBib3hfZXh0cmFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4MQogICAgLy8gYXNzZXJ0KCF0aGlzLmlzQmxvY2tlZChjcmVhdG9yLCBUeG4uc2VuZGVyKSwgRVJSX0JMT0NLRUQpCiAgICBkdXAKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgaXNCbG9ja2VkCiAgICAhCiAgICBhc3NlcnQgLy8gVGhpcyBhY2NvdW50IGlzIGJsb2NrZWQgYnkgdGhlIHVzZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODUKICAgIC8vIHRoaXMudXBkYXRlU3RyZWFrKFR4bi5zZW5kZXIpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIHVwZGF0ZVN0cmVhawogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4NwogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4NwogICAgLy8gY29uc3QgeyByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjkKICAgIC8vIGNvbnN0IFtzb2NpYWxGZWVzQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzU29jaWFsRmVlcykpCiAgICBieXRlYyA5IC8vICJzb2NpYWxfZmVlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0ODcKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUgfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4OAogICAgLy8gY29uc3QgY3JlYXRvckltcGFjdCA9IHRoaXMuZ2V0VXNlckltcGFjdChjcmVhdG9yKQogICAgZGlnIDEKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4OQogICAgLy8gY29uc3QgdGF4UGVyY2VudGFnZSA9IGFraXRhU29jaWFsRmVlKHRoaXMuYWtpdGFEQU8udmFsdWUsIGNyZWF0b3JJbXBhY3QpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDg5CiAgICAvLyBjb25zdCB0YXhQZXJjZW50YWdlID0gYWtpdGFTb2NpYWxGZWUodGhpcy5ha2l0YURBTy52YWx1ZSwgY3JlYXRvckltcGFjdCkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY5CiAgICAvLyBjb25zdCBbc29jaWFsRmVlc0J5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1NvY2lhbEZlZXMpKQogICAgYnl0ZWMgOSAvLyAic29jaWFsX2ZlZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEyMQogICAgLy8gY29uc3QgeyBpbXBhY3RUYXhNaW4sIGltcGFjdFRheE1heCB9ID0gZ2V0U29jaWFsRmVlcyhha2l0YURBTykKICAgIGR1cAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEyMgogICAgLy8gcmV0dXJuIGltcGFjdFJhbmdlKGltcGFjdCwgaW1wYWN0VGF4TWluLCBpbXBhY3RUYXhNYXgpCiAgICBjYWxsc3ViIGltcGFjdFJhbmdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEwNAogICAgLy8gYXNzZXJ0KHAgPD0gRElWSVNPUiwgRVJSX0lOVkFMSURfUEVSQ0VOVEFHRSkKICAgIGR1cAogICAgaW50YyA0IC8vIDEwMDAwMAogICAgPD0KICAgIGFzc2VydCAvLyBJbnZhbGlkIHBlcmNlbnRhZ2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTA1CiAgICAvLyByZXR1cm4gb3AuZGl2dyguLi5vcC5tdWx3KGEsIHApLCBESVZJU09SKQogICAgZGlnIDEKICAgIG11bHcKICAgIGludGMgNCAvLyAxMDAwMDAKICAgIGRpdncKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OTIKICAgIC8vIGNvbnN0IGlzRWRpdFJlcGx5ID0gcG9zdFR5cGUgPT09IFBvc3RUeXBlRWRpdFJlcGx5CiAgICBmcmFtZV9kaWcgLTIKICAgIGJ5dGVjIDE0IC8vIDB4MDMKICAgID09CiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGNvdmVyIDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OTUKICAgIC8vIGV4dHJhICs9IHRoaXMudGlwQ3JlYXRvcihjcmVhdG9yLCByZWFjdEZlZSwgdGF4KQogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgY2FsbHN1YiB0aXBDcmVhdG9yCiAgICBmcmFtZV9kaWcgLTgKICAgICsKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo0OTcKICAgIC8vIGlmIChpc0VkaXRSZXBseSkgewogICAgYnogY3JlYXRlUmVwbHlfYWZ0ZXJfaWZfZWxzZUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDk4CiAgICAvLyBleHRyYSArPSBFZGl0QmFja1JlZk1CUgogICAgaW50YyA1IC8vIDEzMjAwCiAgICArCgpjcmVhdGVSZXBseV9hZnRlcl9pZl9lbHNlQDI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTAxCiAgICAvLyB0aGlzLnZhbGlkYXRlUG9zdFBheW1lbnQobWJyUGF5bWVudCwgY2lkLCBpc0VkaXRSZXBseSwgZXh0cmEpCiAgICBmcmFtZV9kaWcgLTkKICAgIGZyYW1lX2RpZyAtNwogICAgZnJhbWVfZGlnIDEKICAgIGR1cAogICAgY292ZXIgMwogICAgdW5jb3ZlciA0CiAgICBjYWxsc3ViIHZhbGlkYXRlUG9zdFBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZnJhbWVfZGlnIC0xMAogICAgY29uY2F0CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUwMwogICAgLy8gYXNzZXJ0KCF0aGlzLnBvc3RzKHJlcGx5S2V5KS5leGlzdHMsICdFUlI6UE9TVF9FWElTVFMnKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQgLy8gRVJSOlBPU1RfRVhJU1RTCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTA4LTUxMAogICAgLy8gY29uc3QgcmVwbHlSZWY6IGJ5dGVzID0gaXNFZGl0UmVwbHkKICAgIC8vICAgPyBCeXRlcyhjaWQpLmNvbmNhdChwYXJlbnRSZWYpLmNvbmNhdChhbWVuZG1lbnRPZikKICAgIC8vICAgOiBCeXRlcyhjaWQpLmNvbmNhdChwYXJlbnRSZWYpCiAgICBieiBjcmVhdGVSZXBseV90ZXJuYXJ5X2ZhbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MDkKICAgIC8vID8gQnl0ZXMoY2lkKS5jb25jYXQocGFyZW50UmVmKS5jb25jYXQoYW1lbmRtZW50T2YpCiAgICBmcmFtZV9kaWcgLTcKICAgIGZyYW1lX2RpZyAtNgogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAoKY3JlYXRlUmVwbHlfdGVybmFyeV9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUxNAogICAgLy8gY3JlYXRvcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MTUKICAgIC8vIHRpbWVzdGFtcDogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MTItNTIxCiAgICAvLyB0aGlzLnBvc3RzKHJlcGx5S2V5KS52YWx1ZSA9IHsKICAgIC8vICAgcmVmOiByZXBseVJlZiwKICAgIC8vICAgY3JlYXRvcjogVHhuLnNlbmRlciwKICAgIC8vICAgdGltZXN0YW1wOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgLy8gICBnYXRlSUQsCiAgICAvLyAgIHVzZVBheVdhbGwsCiAgICAvLyAgIHBheVdhbGxJRCwKICAgIC8vICAgYWdhaW5zdENvbnRlbnRQb2xpY3k6IGZhbHNlLAogICAgLy8gICBwb3N0VHlwZTogcG9zdFR5cGUsCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtNQogICAgaXRvYgogICAgY29uY2F0CiAgICBieXRlY18zIC8vIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9kaWcgLTQKICAgIHNldGJpdAogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTMKICAgIGl0b2IKICAgIGNvbmNhdAogICAgYnl0ZWNfMyAvLyAweDAwCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgMzIgLy8gMHgwMDNkCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIDAKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTIzCiAgICAvLyBjb25zdCBzZW5kZXJJbXBhY3QgPSB0aGlzLmdldFVzZXJJbXBhY3QoVHhuLnNlbmRlcikKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUyNAogICAgLy8gdGhpcy51cGRhdGVWb3RlcyhyZXBseUtleSwgdHJ1ZSwgc2VuZGVySW1wYWN0KQogICAgZnJhbWVfZGlnIC0xMAogICAgaW50Y18xIC8vIDEKICAgIGRpZyAyCiAgICBjYWxsc3ViIHVwZGF0ZVZvdGVzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTI1CiAgICAvLyB0aGlzLmNyZWF0ZVZvdGVMaXN0KHJlcGx5S2V5LCB0cnVlLCBUeG4uc2VuZGVyLCBzZW5kZXJJbXBhY3QpCiAgICBmcmFtZV9kaWcgLTEwCiAgICBpbnRjXzEgLy8gMQogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciAzCiAgICBjYWxsc3ViIGNyZWF0ZVZvdGVMaXN0CiAgICByZXRzdWIKCmNyZWF0ZVJlcGx5X3Rlcm5hcnlfZmFsc2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MTAKICAgIC8vIDogQnl0ZXMoY2lkKS5jb25jYXQocGFyZW50UmVmKQogICAgZnJhbWVfZGlnIC03CiAgICBmcmFtZV9kaWcgLTYKICAgIGNvbmNhdAogICAgYiBjcmVhdGVSZXBseV90ZXJuYXJ5X21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNyZWF0ZVZvdGUobWJyUGF5bWVudDogdWludDY0LCBtYnJOZWVkZWQ6IHVpbnQ2NCwgcmVmOiBieXRlcywgaXNVcDogdWludDY0KSAtPiB2b2lkOgpjcmVhdGVWb3RlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUyOC01MzMKICAgIC8vIHByaXZhdGUgY3JlYXRlVm90ZSgKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBtYnJOZWVkZWQ6IHVpbnQ2NCwKICAgIC8vICAgcmVmOiBieXRlczwzMj4sCiAgICAvLyAgIGlzVXA6IGJvb2xlYW4KICAgIC8vICk6IHZvaWQgewogICAgcHJvdG8gNCAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTM0CiAgICAvLyBhc3NlcnQoIXRoaXMuaXNCYW5uZWQoVHhuLnNlbmRlciksIEVSUl9CQU5ORUQpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuaXNCYW5uZWQKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmFubmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MzYKICAgIC8vIHBvc3RzID0gQm94TWFwPGJ5dGVzPDMyPiwgUG9zdFZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhQb3N0cyB9KQogICAgYnl0ZWNfMiAvLyAicCIKICAgIGZyYW1lX2RpZyAtMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTM1CiAgICAvLyBhc3NlcnQodGhpcy5wb3N0cyhyZWYpLmV4aXN0cywgRVJSX1BPU1RfTk9UX0ZPVU5EKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBQb3N0IG5vdCBmb3VuZAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjUzNwogICAgLy8gY29uc3QgeyBjcmVhdG9yIH0gPSB0aGlzLnBvc3RzKHJlZikudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICBpbnRjXzMgLy8gMzIKICAgIGJveF9leHRyYWN0CiAgICBkdXBuIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1MzgKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jsb2NrZWQoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9CTE9DS0VEKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBpc0Jsb2NrZWQKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmxvY2tlZCBieSB0aGUgdXNlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU0MAogICAgLy8gY29uc3Qgdm90ZUxpc3RLZXk6IFZvdGVMaXN0S2V5ID0geyB1c2VyOiBiMTYoVHhuLnNlbmRlci5ieXRlcyksIHJlZjogYjE2KHJlZikgfQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBiMTYKICAgIGZyYW1lX2RpZyAtMgogICAgY2FsbHN1YiBiMTYKICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIHNpemUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQyCiAgICAvLyB2b3RlbGlzdCA9IEJveE1hcDxWb3RlTGlzdEtleSwgVm90ZUxpc3RWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4Vm90ZUxpc3QgfSkKICAgIGJ5dGVjIDE1IC8vICJvIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQxCiAgICAvLyBhc3NlcnQoIXRoaXMudm90ZWxpc3Qodm90ZUxpc3RLZXkpLmV4aXN0cywgRVJSX0FMUkVBRFlfVk9URUQpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBZb3UndmUgYWxyZWFkeSB2b3RlZCBvbiB0aGlzIHBvc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDIKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyICE9PSBjcmVhdG9yLCBFUlJfTk9fU0VMRl9WT1RFKQogICAgdHhuIFNlbmRlcgogICAgIT0KICAgIGFzc2VydCAvLyBDYW5ub3Qgdm90ZSBvbiB5b3VyIG93biBjb250ZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBieXRlYyA0IC8vICJtIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU0NAogICAgLy8gY29uc3Qgc2VuZGVySXNBdXRvbWF0ZWQgPSB0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUuYXV0b21hdGVkCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDgKICAgIC8vIG1ldGEgPSBCb3hNYXA8QWNjb3VudCwgTWV0YVZhbHVlPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNZXRhIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDQKICAgIC8vIGNvbnN0IHNlbmRlcklzQXV0b21hdGVkID0gdGhpcy5tZXRhKFR4bi5zZW5kZXIpLnZhbHVlLmF1dG9tYXRlZAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIHB1c2hpbnQgMzkyIC8vIDM5MgogICAgZ2V0Yml0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTQ1CiAgICAvLyBhc3NlcnQoIXNlbmRlcklzQXV0b21hdGVkLCBFUlJfQVVUT01BVEVEX0FDQ09VTlQpCiAgICAhCiAgICBhc3NlcnQgLy8gVGhpcyBpcyBhbiBhdXRvbWF0ZWQgYWNjb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU0NwogICAgLy8gY29uc3QgYWt0YSA9IGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDcKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo5NAogICAgLy8gY29uc3QgYWtpdGFBc3NldHNCeXRlcyA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXNzZXRzKSlbMF0KICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NDcKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NTEKICAgIC8vIHRoaXMudXBkYXRlU3RyZWFrKFR4bi5zZW5kZXIpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIHVwZGF0ZVN0cmVhawogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1MgogICAgLy8gY29uc3QgeyByZWFjdEZlZSwgaW1wYWN0VGF4TWluLCBpbXBhY3RUYXhNYXggfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NTIKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUsIGltcGFjdFRheE1pbiwgaW1wYWN0VGF4TWF4IH0gPSBnZXRTb2NpYWxGZWVzKHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIGJ5dGVjIDkgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1MgogICAgLy8gY29uc3QgeyByZWFjdEZlZSwgaW1wYWN0VGF4TWluLCBpbXBhY3RUYXhNYXggfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGR1cAogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBkdXAKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBjb3ZlciAyCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1NAogICAgLy8gaWYgKGlzVXApIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnogY3JlYXRlVm90ZV9lbHNlX2JvZHlAMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU1NgogICAgLy8gY29uc3QgcmVjaXBpZW50SW1wYWN0ID0gdGhpcy5nZXRVc2VySW1wYWN0KGNyZWF0b3IpCiAgICBmcmFtZV9kaWcgMAogICAgZHVwCiAgICBjYWxsc3ViIGdldFVzZXJJbXBhY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NTcKICAgIC8vIGNvbnN0IHRheFBlcmNlbnRhZ2UgPSBpbXBhY3RSYW5nZShyZWNpcGllbnRJbXBhY3QsIGltcGFjdFRheE1pbiwgaW1wYWN0VGF4TWF4KQogICAgZnJhbWVfZGlnIDIKICAgIGZyYW1lX2RpZyAzCiAgICBjYWxsc3ViIGltcGFjdFJhbmdlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjEwNAogICAgLy8gYXNzZXJ0KHAgPD0gRElWSVNPUiwgRVJSX0lOVkFMSURfUEVSQ0VOVEFHRSkKICAgIGR1cAogICAgaW50YyA0IC8vIDEwMDAwMAogICAgPD0KICAgIGFzc2VydCAvLyBJbnZhbGlkIHBlcmNlbnRhZ2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MTA1CiAgICAvLyByZXR1cm4gb3AuZGl2dyguLi5vcC5tdWx3KGEsIHApLCBESVZJU09SKQogICAgdW5jb3ZlciAyCiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgbXVsdwogICAgaW50YyA0IC8vIDEwMDAwMAogICAgZGl2dwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2MAogICAgLy8gY29uc3QgZXh0cmEgPSB0aGlzLnRpcENyZWF0b3IoY3JlYXRvciwgcmVhY3RGZWUsIHRheCkKICAgIGNhbGxzdWIgdGlwQ3JlYXRvcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2Mi01NjkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogbWJyTmVlZGVkICsgZXh0cmEKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZnJhbWVfZGlnIC00CiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2NQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NjItNTY5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IG1ick5lZWRlZCArIGV4dHJhCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICBmcmFtZV9kaWcgLTQKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU2NgogICAgLy8gYW1vdW50OiBtYnJOZWVkZWQgKyBleHRyYQogICAgZnJhbWVfZGlnIC0zCiAgICB1bmNvdmVyIDMKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NjItNTY5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IG1ick5lZWRlZCArIGV4dHJhCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAoKY3JlYXRlVm90ZV9hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTkwCiAgICAvLyBjb25zdCBzZW5kZXJJbXBhY3QgPSB0aGlzLmdldFVzZXJJbXBhY3QoVHhuLnNlbmRlcikKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU5MQogICAgLy8gdGhpcy51cGRhdGVWb3RlcyhyZWYsIGlzVXAsIHNlbmRlckltcGFjdCkKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfZGlnIC0xCiAgICBkaWcgMgogICAgY2FsbHN1YiB1cGRhdGVWb3RlcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU5MgogICAgLy8gdGhpcy5jcmVhdGVWb3RlTGlzdChyZWYsIGlzVXAsIFR4bi5zZW5kZXIsIHNlbmRlckltcGFjdCkKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfZGlnIC0xCiAgICB0eG4gU2VuZGVyCiAgICB1bmNvdmVyIDMKICAgIGNhbGxzdWIgY3JlYXRlVm90ZUxpc3QKICAgIHJldHN1YgoKY3JlYXRlVm90ZV9lbHNlX2JvZHlAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1NzEtNTc4CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IG1ick5lZWRlZAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTQKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTc0CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU3MS01NzgKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogbWJyTmVlZGVkCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICBmcmFtZV9kaWcgLTQKICAgIGd0eG5zIEFtb3VudAogICAgZnJhbWVfZGlnIC0zCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1ODAtNTg2CiAgICAvLyBpdHhuCiAgICAvLyAgIC5hc3NldFRyYW5zZmVyKHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiB0aGlzLmFraXRhREFPRXNjcm93LnZhbHVlLmFkZHJlc3MsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IHJlYWN0RmVlLAogICAgLy8gICAgIHhmZXJBc3NldDogYWt0YQogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1ODIKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo2NQogICAgLy8gYWtpdGFEQU9Fc2Nyb3cgPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFFc2Nyb3cgfSkKICAgIGJ5dGVjIDYgLy8gImFraXRhX2VzY3JvdyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo1ODIKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBmcmFtZV9kaWcgMQogICAgaXR4bl9maWVsZCBYZmVyQXNzZXQKICAgIGl0eG5fZmllbGQgQXNzZXRSZWNlaXZlcgogICAgaXR4bl9maWVsZCBBc3NldEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU4MC01ODUKICAgIC8vIGl0eG4KICAgIC8vICAgLmFzc2V0VHJhbnNmZXIoewogICAgLy8gICAgIGFzc2V0UmVjZWl2ZXI6IHRoaXMuYWtpdGFEQU9Fc2Nyb3cudmFsdWUuYWRkcmVzcywKICAgIC8vICAgICBhc3NldEFtb3VudDogcmVhY3RGZWUsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhCiAgICAvLyAgIH0pCiAgICBwdXNoaW50IDQgLy8gNAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NTgwLTU4NgogICAgLy8gaXR4bgogICAgLy8gICAuYXNzZXRUcmFuc2Zlcih7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogdGhpcy5ha2l0YURBT0VzY3Jvdy52YWx1ZS5hZGRyZXNzLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiByZWFjdEZlZSwKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFrdGEKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgYiBjcmVhdGVWb3RlX2FmdGVyX2lmX2Vsc2VANAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwuY3JlYXRlUmVhY3Rpb24obWJyUGF5bWVudDogdWludDY0LCBtYnJOZWVkZWQ6IHVpbnQ2NCwgcmVmOiBieXRlcywgTkZUOiB1aW50NjQpIC0+IHZvaWQ6CmNyZWF0ZVJlYWN0aW9uOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjU5NS02MDAKICAgIC8vIHByaXZhdGUgY3JlYXRlUmVhY3Rpb24oCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgbWJyTmVlZGVkOiB1aW50NjQsCiAgICAvLyAgIHJlZjogYnl0ZXM8MzI+LAogICAgLy8gICBORlQ6IHVpbnQ2NAogICAgLy8gKTogdm9pZCB7CiAgICBwcm90byA0IDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MDEKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jhbm5lZChUeG4uc2VuZGVyKSwgRVJSX0JBTk5FRCkKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czozNgogICAgLy8gcG9zdHMgPSBCb3hNYXA8Ynl0ZXM8MzI+LCBQb3N0VmFsdWU+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeFBvc3RzIH0pCiAgICBieXRlY18yIC8vICJwIgogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MDIKICAgIC8vIGFzc2VydCh0aGlzLnBvc3RzKHJlZikuZXhpc3RzLCBFUlJfUE9TVF9OT1RfRk9VTkQpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFBvc3Qgbm90IGZvdW5kCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjAzCiAgICAvLyBjb25zdCB7IGNyZWF0b3IgfSA9IHRoaXMucG9zdHMocmVmKS52YWx1ZQogICAgaW50Y18wIC8vIDAKICAgIGludGNfMyAvLyAzMgogICAgYm94X2V4dHJhY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MDQKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jsb2NrZWQoY3JlYXRvciwgVHhuLnNlbmRlciksIEVSUl9CTE9DS0VEKQogICAgZHVwCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIGlzQmxvY2tlZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBibG9ja2VkIGJ5IHRoZSB1c2VyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjA2CiAgICAvLyBhc3NlcnQoQXNzZXRIb2xkaW5nLmFzc2V0QmFsYW5jZShUeG4uc2VuZGVyLCBORlQpWzBdID4gMCwgRVJSX1VTRVJfRE9FU19OT1RfT1dOX05GVCkKICAgIHR4biBTZW5kZXIKICAgIGZyYW1lX2RpZyAtMQogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBwb3AKICAgIGFzc2VydCAvLyBVc2VyIGRvZXMgbm90IG93biB0aGlzIE5GVAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYwOAogICAgLy8gY29uc3QgcmVhY3Rpb25MaXN0S2V5OiBSZWFjdGlvbkxpc3RLZXkgPSB7IHVzZXI6IGIxNihUeG4uc2VuZGVyLmJ5dGVzKSwgcmVmOiBiMTYocmVmKSwgTkZUIH0KICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgYjE2CiAgICBmcmFtZV9kaWcgLTIKICAgIGNhbGxzdWIgYjE2CiAgICBkaWcgMQogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBjb25jYXQKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ2CiAgICAvLyByZWFjdGlvbmxpc3QgPSBCb3hNYXA8UmVhY3Rpb25MaXN0S2V5LCBieXRlczwwPj4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UmVhY3Rpb25MaXN0IH0pCiAgICBwdXNoYnl0ZXMgImUiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYxMAogICAgLy8gYXNzZXJ0KCF0aGlzLnJlYWN0aW9ubGlzdChyZWFjdGlvbkxpc3RLZXkpLmV4aXN0cywgRVJSX0FMUkVBRFlfUkVBQ1RFRCkKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBhbHJlYWR5IHJlYWN0ZWQgdG8gdGhpcyBwb3N0IHdpdGggdGhpcyBORlQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTQKICAgIC8vIHRoaXMudXBkYXRlU3RyZWFrKFR4bi5zZW5kZXIpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIHVwZGF0ZVN0cmVhawogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYxNgogICAgLy8gY29uc3QgeyByZWFjdEZlZSwgaW1wYWN0VGF4TWluLCBpbXBhY3RUYXhNYXggfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTYKICAgIC8vIGNvbnN0IHsgcmVhY3RGZWUsIGltcGFjdFRheE1pbiwgaW1wYWN0VGF4TWF4IH0gPSBnZXRTb2NpYWxGZWVzKHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIGJ5dGVjIDkgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYxNgogICAgLy8gY29uc3QgeyByZWFjdEZlZSwgaW1wYWN0VGF4TWluLCBpbXBhY3RUYXhNYXggfSA9IGdldFNvY2lhbEZlZXModGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGR1cAogICAgaW50Y18yIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMQogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIHVuY292ZXIgMgogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MTcKICAgIC8vIGNvbnN0IHJlY2lwaWVudEltcGFjdCA9IHRoaXMuZ2V0VXNlckltcGFjdChjcmVhdG9yKQogICAgZGlnIDQKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYxOAogICAgLy8gY29uc3QgdGF4ID0gaW1wYWN0UmFuZ2UocmVjaXBpZW50SW1wYWN0LCBpbXBhY3RUYXhNaW4sIGltcGFjdFRheE1heCkKICAgIGNvdmVyIDIKICAgIGNhbGxzdWIgaW1wYWN0UmFuZ2UKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MjAKICAgIC8vIGNvbnN0IHJlYWN0aW9uS2V5OiBSZWFjdGlvbnNLZXkgPSB7IHJlZiwgTkZUIH0KICAgIGZyYW1lX2RpZyAtMgogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBmcmFtZV9kaWcgLTIKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NDQKICAgIC8vIHJlYWN0aW9ucyA9IEJveE1hcDxSZWFjdGlvbnNLZXksIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4UmVhY3Rpb25zIH0pCiAgICBieXRlYyAyNSAvLyAiciIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICBjb3ZlciA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjIxCiAgICAvLyBjb25zdCByZWFjdGlvbkV4aXN0cyA9IHRoaXMucmVhY3Rpb25zKHJlYWN0aW9uS2V5KS5leGlzdHMKICAgIGJveF9sZW4KICAgIGR1cAogICAgY292ZXIgMgogICAgY292ZXIgNQogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjI0CiAgICAvLyBleHRyYSArPSB0aGlzLnRpcENyZWF0b3IoY3JlYXRvciwgcmVhY3RGZWUsIHRheCkKICAgIGNvdmVyIDMKICAgIGNhbGxzdWIgdGlwQ3JlYXRvcgogICAgZnJhbWVfZGlnIC0zCiAgICArCiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6Njc3CiAgICAvLyBjb25zdCB7IHJlYWN0aW9ubGlzdCwgcmVhY3Rpb25zIH0gPSB0aGlzLm1icihCeXRlcygnJykpCiAgICBwdXNoYnl0ZXMgIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgZHVwCiAgICBwdXNoaW50IDQ4IC8vIDQ4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgY292ZXIgMgogICAgcHVzaGludCA0MCAvLyA0MAogICAgZXh0cmFjdF91aW50NjQKICAgIGNvdmVyIDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NzgtNjgwCiAgICAvLyBjb25zdCBtYnJBbW91bnQ6IHVpbnQ2NCA9IHJlYWN0aW9uRXhpc3RzCiAgICAvLyAgID8gcmVhY3Rpb25saXN0CiAgICAvLyAgIDogcmVhY3Rpb25zICsgcmVhY3Rpb25saXN0CiAgICBieiBjcmVhdGVSZWFjdGlvbl90ZXJuYXJ5X2ZhbHNlQDYKCmNyZWF0ZVJlYWN0aW9uX3Rlcm5hcnlfbWVyZ2VANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2ODItNjg5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IG1ickFtb3VudCArIGV4dHJhCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGZyYW1lX2RpZyAtNAogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2ODUKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjgyLTY4OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBtYnJBbW91bnQgKyBleHRyYQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgZnJhbWVfZGlnIC00CiAgICBndHhucyBBbW91bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2ODYKICAgIC8vIGFtb3VudDogbWJyQW1vdW50ICsgZXh0cmEKICAgIHVuY292ZXIgMgogICAgZnJhbWVfZGlnIDMKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2ODItNjg5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IG1ickFtb3VudCArIGV4dHJhCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYyOQogICAgLy8gaWYgKHJlYWN0aW9uRXhpc3RzKSB7CiAgICBmcmFtZV9kaWcgMgogICAgYnogY3JlYXRlUmVhY3Rpb25fZWxzZV9ib2R5QDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MzAKICAgIC8vIHRoaXMucmVhY3Rpb25zKHJlYWN0aW9uS2V5KS52YWx1ZSArPSAxCiAgICBmcmFtZV9kaWcgMQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgYnRvaQogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGl0b2IKICAgIGJveF9wdXQKCmNyZWF0ZVJlYWN0aW9uX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2MzUKICAgIC8vIHRoaXMucmVhY3Rpb25saXN0KHJlYWN0aW9uTGlzdEtleSkuY3JlYXRlKCkKICAgIGZyYW1lX2RpZyAwCiAgICBpbnRjXzAgLy8gMAogICAgYm94X2NyZWF0ZQogICAgcG9wCiAgICByZXRzdWIKCmNyZWF0ZVJlYWN0aW9uX2Vsc2VfYm9keUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzMgogICAgLy8gdGhpcy5yZWFjdGlvbnMocmVhY3Rpb25LZXkpLnZhbHVlID0gMQogICAgaW50Y18xIC8vIDEKICAgIGl0b2IKICAgIGZyYW1lX2RpZyAxCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICBiIGNyZWF0ZVJlYWN0aW9uX2FmdGVyX2lmX2Vsc2VAMwoKY3JlYXRlUmVhY3Rpb25fdGVybmFyeV9mYWxzZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY4MAogICAgLy8gOiByZWFjdGlvbnMgKyByZWFjdGlvbmxpc3QKICAgIGZyYW1lX2RpZyA0CiAgICArCiAgICBiIGNyZWF0ZVJlYWN0aW9uX3Rlcm5hcnlfbWVyZ2VANwoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWwudmFsaWRhdGVUaXAodGlwOiB1aW50NjQsIGFjdGlvbjogYnl0ZXMpIC0+IHZvaWQ6CnZhbGlkYXRlVGlwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzOAogICAgLy8gcHJpdmF0ZSB2YWxpZGF0ZVRpcCh0aXA6IGd0eG4uQXNzZXRUcmFuc2ZlclR4biwgYWN0aW9uOiBUaXBBY3Rpb24pIHsKICAgIHByb3RvIDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjYzOQogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKHRoaXMuYWtpdGFEQU8udmFsdWUpLmFrdGEpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjM5CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA3IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjM5CiAgICAvLyBjb25zdCBha3RhID0gQXNzZXQoZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2OQogICAgLy8gY29uc3QgW3NvY2lhbEZlZXNCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNTb2NpYWxGZWVzKSkKICAgIHN3YXAKICAgIGJ5dGVjIDkgLy8gInNvY2lhbF9mZWVzIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY0MAogICAgLy8gY29uc3QgeyBwb3N0RmVlLCByZWFjdEZlZSB9ID0gZ2V0U29jaWFsRmVlcyh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY0MS02NDkKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICB0aXAsCiAgICAvLyAgIHsKICAgIC8vICAgICBhc3NldFJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICB4ZmVyQXNzZXQ6IGFrdGEsCiAgICAvLyAgICAgYXNzZXRBbW91bnQ6IChhY3Rpb24gPT09IFRpcEFjdGlvblBvc3QpID8gcG9zdEZlZSA6IHJlYWN0RmVlCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1RSQU5TRkVSCiAgICAvLyApCiAgICBmcmFtZV9kaWcgLTIKICAgIGd0eG5zIEFzc2V0UmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NDQKICAgIC8vIGFzc2V0UmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NDEtNjQ5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgdGlwLAogICAgLy8gICB7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAoYWN0aW9uID09PSBUaXBBY3Rpb25Qb3N0KSA/IHBvc3RGZWUgOiByZWFjdEZlZQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9UUkFOU0ZFUgogICAgLy8gKQogICAgPT0KICAgIGZyYW1lX2RpZyAtMgogICAgZ3R4bnMgWGZlckFzc2V0CiAgICB1bmNvdmVyIDQKICAgID09CiAgICAmJgogICAgZnJhbWVfZGlnIC0yCiAgICBndHhucyBBc3NldEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY0NgogICAgLy8gYXNzZXRBbW91bnQ6IChhY3Rpb24gPT09IFRpcEFjdGlvblBvc3QpID8gcG9zdEZlZSA6IHJlYWN0RmVlCiAgICBmcmFtZV9kaWcgLTEKICAgIGJ5dGVjIDEzIC8vIDB4MGEKICAgID09CiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgNAogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NDEtNjQ5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgdGlwLAogICAgLy8gICB7CiAgICAvLyAgICAgYXNzZXRSZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgeGZlckFzc2V0OiBha3RhLAogICAgLy8gICAgIGFzc2V0QW1vdW50OiAoYWN0aW9uID09PSBUaXBBY3Rpb25Qb3N0KSA/IHBvc3RGZWUgOiByZWFjdEZlZQogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9UUkFOU0ZFUgogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCB0cmFuc2ZlcgogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC52YWxpZGF0ZVBvc3RQYXltZW50KG1iclBheW1lbnQ6IHVpbnQ2NCwgY2lkOiBieXRlcywgaXNBbWVuZG1lbnQ6IHVpbnQ2NCwgZXh0cmFBbW91bnQ6IHVpbnQ2NCkgLT4gdm9pZDoKdmFsaWRhdGVQb3N0UGF5bWVudDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NTItNjU3CiAgICAvLyBwcml2YXRlIHZhbGlkYXRlUG9zdFBheW1lbnQoCiAgICAvLyAgIG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwKICAgIC8vICAgY2lkOiBDSUQsCiAgICAvLyAgIGlzQW1lbmRtZW50OiBib29sZWFuLAogICAgLy8gICBleHRyYUFtb3VudDogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIHByb3RvIDQgMAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NTgKICAgIC8vIGNvbnN0IHsgcG9zdHMsIHZvdGVzLCB2b3RlbGlzdCB9ID0gdGhpcy5tYnIoY2lkKQogICAgZnJhbWVfZGlnIC0zCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGR1cAogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIGR1cAogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIGludGNfMyAvLyAzMgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NTkKICAgIC8vIGNvbnN0IGFrdGEgPSBnZXRBa2l0YUFzc2V0cyh0aGlzLmFraXRhREFPLnZhbHVlKS5ha3RhCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjU5CiAgICAvLyBjb25zdCBha3RhID0gZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHN3YXAKICAgIGR1cAogICAgdW5jb3ZlciAyCiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgZHVwCiAgICBieXRlYyA3IC8vICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjU5CiAgICAvLyBjb25zdCBha3RhID0gZ2V0QWtpdGFBc3NldHModGhpcy5ha2l0YURBTy52YWx1ZSkuYWt0YQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjU0OAogICAgLy8gY29uc3Qgd2FsbGV0ID0gZ2V0V2FsbGV0SURVc2luZ0FraXRhREFPKGFraXRhREFPLCBUeG4uc2VuZGVyKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBnZXRXYWxsZXRJRFVzaW5nQWtpdGFEQU8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTQ5CiAgICAvLyBjb25zdCByZWZlcnJlciA9IHJlZmVycmVyT3JaZXJvQWRkcmVzcyh3YWxsZXQpCiAgICBjYWxsc3ViIHJlZmVycmVyT3JaZXJvQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NTEKICAgIC8vIGlmIChyZWZlcnJlciA9PT0gR2xvYmFsLnplcm9BZGRyZXNzKSB7CiAgICBnbG9iYWwgWmVyb0FkZHJlc3MKICAgID09CiAgICBieiB2YWxpZGF0ZVBvc3RQYXltZW50X2FmdGVyX2lmX2Vsc2VANQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1NTIKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAoKdmFsaWRhdGVQb3N0UGF5bWVudF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJlZmVycmFsRmVlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjYxCiAgICAvLyBsZXQgYW1vdW50OiB1aW50NjQgPSBwb3N0cyArIHZvdGVzICsgdm90ZWxpc3QgKyByZWZlcnJhbEZlZUFtb3VudCArIGV4dHJhQW1vdW50CiAgICBmcmFtZV9kaWcgMgogICAgZnJhbWVfZGlnIDMKICAgICsKICAgIGZyYW1lX2RpZyA0CiAgICArCiAgICArCiAgICBmcmFtZV9kaWcgLTEKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NjIKICAgIC8vIGlmIChpc0FtZW5kbWVudCkgewogICAgZnJhbWVfZGlnIC0yCiAgICBieiB2YWxpZGF0ZVBvc3RQYXltZW50X2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY2MwogICAgLy8gYW1vdW50ICs9IEFtZW5kbWVudE1CUgogICAgaW50YyA1IC8vIDEzMjAwCiAgICArCgp2YWxpZGF0ZVBvc3RQYXltZW50X2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NjYtNjczCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZnJhbWVfZGlnIC00CiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY2OQogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NjYtNjczCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIGZyYW1lX2RpZyAtNAogICAgZ3R4bnMgQW1vdW50CiAgICB1bmNvdmVyIDIKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgcmV0c3ViCgp2YWxpZGF0ZVBvc3RQYXltZW50X2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIGZyYW1lX2RpZyA1CiAgICBieXRlYyAyMCAvLyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0ODIKICAgIC8vIGNvbnN0IHJld2FyZHNBcHAgPSBnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLnJld2FyZHMKICAgIGludGNfMiAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ4MwogICAgLy8gbGV0IGNvc3Q6IHVpbnQ2NCA9IE1pbkRpc2J1cnNlbWVudHNNQlIgKyAoVXNlckFsbG9jYXRpb25NQlIgKiBhbGxvY2F0aW9uc0xlbmd0aCkKICAgIGludGMgOSAvLyA2MDYwMAogICAgZnJhbWVfYnVyeSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ4NQogICAgLy8gaWYgKGFzc2V0ICE9PSAwICYmICFBcHBsaWNhdGlvbihyZXdhcmRzQXBwKS5hZGRyZXNzLmlzT3B0ZWRJbihBc3NldChhc3NldCkpKSB7CiAgICBmcmFtZV9kaWcgNgogICAgYnogdmFsaWRhdGVQb3N0UGF5bWVudF9hZnRlcl9pZl9lbHNlQDgKICAgIGZyYW1lX2RpZyAxCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICBmcmFtZV9kaWcgNgogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgIGJueiB2YWxpZGF0ZVBvc3RQYXltZW50X2FmdGVyX2lmX2Vsc2VAOAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0ODMKICAgIC8vIGxldCBjb3N0OiB1aW50NjQgPSBNaW5EaXNidXJzZW1lbnRzTUJSICsgKFVzZXJBbGxvY2F0aW9uTUJSICogYWxsb2NhdGlvbnNMZW5ndGgpCiAgICBpbnRjIDkgLy8gNjA2MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDg2CiAgICAvLyBjb3N0ICs9IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICArCiAgICBmcmFtZV9idXJ5IDAKCnZhbGlkYXRlUG9zdFBheW1lbnRfYWZ0ZXJfaWZfZWxzZUA4OgogICAgZnJhbWVfZGlnIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2NjAKICAgIC8vIGNvbnN0IHJlZmVycmFsRmVlQW1vdW50ID0gcmVmZXJyYWxGZWUodGhpcy5ha2l0YURBTy52YWx1ZSwgYWt0YSkKICAgIGIgdmFsaWRhdGVQb3N0UGF5bWVudF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OnJlZmVycmFsRmVlQDkKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmNyZWF0ZURlZmF1bHRNZXRhKG9yaWdpbjogYnl0ZXMsIGluaXRpYWxpemVkOiB1aW50NjQsIHdhbGxldDogdWludDY0LCBhdXRvbWF0ZWQ6IHVpbnQ2NCkgLT4gdm9pZDoKY3JlYXRlRGVmYXVsdE1ldGE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjkyCiAgICAvLyBwcml2YXRlIGNyZWF0ZURlZmF1bHRNZXRhKG9yaWdpbjogQWNjb3VudCwgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4sIHdhbGxldDogdWludDY0LCBhdXRvbWF0ZWQ6IGJvb2xlYW4pOiB2b2lkIHsKICAgIHByb3RvIDQgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5NwogICAgLy8gc3RhcnREYXRlOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5OAogICAgLy8gbGFzdEFjdGl2ZTogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5My03MDUKICAgIC8vIHRoaXMubWV0YShvcmlnaW4pLnZhbHVlID0gewogICAgLy8gICBpbml0aWFsaXplZCwKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBzdHJlYWs6IDEsCiAgICAvLyAgIHN0YXJ0RGF0ZTogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIC8vICAgbGFzdEFjdGl2ZTogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIC8vICAgZm9sbG93ZXJJbmRleDogMCwKICAgIC8vICAgZm9sbG93ZXJDb3VudDogMCwKICAgIC8vICAgYXV0b21hdGVkLAogICAgLy8gICBmb2xsb3dHYXRlSUQ6IDAsCiAgICAvLyAgIGFkZHJlc3NHYXRlSUQ6IDAsCiAgICAvLyAgIGRlZmF1bHRQYXlXYWxsSUQ6IDAKICAgIC8vIH0KICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtMwogICAgc2V0Yml0CiAgICBmcmFtZV9kaWcgLTIKICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5NgogICAgLy8gc3RyZWFrOiAxLAogICAgaW50Y18xIC8vIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2OTMtNzA1CiAgICAvLyB0aGlzLm1ldGEob3JpZ2luKS52YWx1ZSA9IHsKICAgIC8vICAgaW5pdGlhbGl6ZWQsCiAgICAvLyAgIHdhbGxldCwKICAgIC8vICAgc3RyZWFrOiAxLAogICAgLy8gICBzdGFydERhdGU6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAsCiAgICAvLyAgIGxhc3RBY3RpdmU6IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAsCiAgICAvLyAgIGZvbGxvd2VySW5kZXg6IDAsCiAgICAvLyAgIGZvbGxvd2VyQ291bnQ6IDAsCiAgICAvLyAgIGF1dG9tYXRlZCwKICAgIC8vICAgZm9sbG93R2F0ZUlEOiAwLAogICAgLy8gICBhZGRyZXNzR2F0ZUlEOiAwLAogICAgLy8gICBkZWZhdWx0UGF5V2FsbElEOiAwCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHVuY292ZXIgMgogICAgaXRvYgogICAgY29uY2F0CiAgICBzd2FwCiAgICBpdG9iCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czo2OTkKICAgIC8vIGZvbGxvd2VySW5kZXg6IDAsCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjY5My03MDUKICAgIC8vIHRoaXMubWV0YShvcmlnaW4pLnZhbHVlID0gewogICAgLy8gICBpbml0aWFsaXplZCwKICAgIC8vICAgd2FsbGV0LAogICAgLy8gICBzdHJlYWs6IDEsCiAgICAvLyAgIHN0YXJ0RGF0ZTogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIC8vICAgbGFzdEFjdGl2ZTogR2xvYmFsLmxhdGVzdFRpbWVzdGFtcCwKICAgIC8vICAgZm9sbG93ZXJJbmRleDogMCwKICAgIC8vICAgZm9sbG93ZXJDb3VudDogMCwKICAgIC8vICAgYXV0b21hdGVkLAogICAgLy8gICBmb2xsb3dHYXRlSUQ6IDAsCiAgICAvLyAgIGFkZHJlc3NHYXRlSUQ6IDAsCiAgICAvLyAgIGRlZmF1bHRQYXlXYWxsSUQ6IDAKICAgIC8vIH0KICAgIGl0b2IKICAgIHN3YXAKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGJ5dGVjXzMgLy8gMHgwMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtMQogICAgc2V0Yml0CiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjQ4CiAgICAvLyBtZXRhID0gQm94TWFwPEFjY291bnQsIE1ldGFWYWx1ZT4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TWV0YSB9KQogICAgYnl0ZWMgNCAvLyAibSIKICAgIGZyYW1lX2RpZyAtNAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6NjkzLTcwNQogICAgLy8gdGhpcy5tZXRhKG9yaWdpbikudmFsdWUgPSB7CiAgICAvLyAgIGluaXRpYWxpemVkLAogICAgLy8gICB3YWxsZXQsCiAgICAvLyAgIHN0cmVhazogMSwKICAgIC8vICAgc3RhcnREYXRlOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgLy8gICBsYXN0QWN0aXZlOiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wLAogICAgLy8gICBmb2xsb3dlckluZGV4OiAwLAogICAgLy8gICBmb2xsb3dlckNvdW50OiAwLAogICAgLy8gICBhdXRvbWF0ZWQsCiAgICAvLyAgIGZvbGxvd0dhdGVJRDogMCwKICAgIC8vICAgYWRkcmVzc0dhdGVJRDogMCwKICAgIC8vICAgZGVmYXVsdFBheVdhbGxJRDogMAogICAgLy8gfQogICAgc3dhcAogICAgYm94X3B1dAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbC5pc0Jhbm5lZChhY2NvdW50OiBieXRlcykgLT4gdWludDY0OgpzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsLmlzQmFubmVkOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNDQtMTE0NQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICAvLyBpc0Jhbm5lZChhY2NvdW50OiBBY2NvdW50KTogYm9vbGVhbiB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTQ2LTExNDkKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbE1vZGVyYXRpb24ucHJvdG90eXBlLmlzQmFubmVkPih7CiAgICAvLyAgIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbiwKICAgIC8vICAgYXJnczogW2FjY291bnRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNDcKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbiwKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMTQ3CiAgICAvLyBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1vZGVyYXRpb24sCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWMgOCAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjExNDcKICAgIC8vIGFwcElkOiBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkubW9kZXJhdGlvbiwKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTE0Ni0xMTQ5CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS5pc0Jhbm5lZD4oewogICAgLy8gICBhcHBJZDogZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm1vZGVyYXRpb24sCiAgICAvLyAgIGFyZ3M6IFthY2NvdW50XQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGJ5dGVjIDI3IC8vIG1ldGhvZCAiaXNCYW5uZWQoYWRkcmVzcylib29sIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgaW50Y18xIC8vIDEKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIGJvb2w4CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyKHJlZjogYnl0ZXMpIC0+IGJ5dGVzOgpzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE0CiAgICAvLyBtYnIocmVmOiBieXRlcyk6IEFraXRhU29jaWFsTUJSRGF0YSB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxOAogICAgLy8gcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgcHVzaGludCA0MDAgLy8gNDAwCiAgICAqCiAgICBwdXNoaW50IDQwMTAwIC8vIDQwMTAwCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIHB1c2hieXRlcyAweDAwMDAwMDAwMDAwMDdiZDQwMDAwMDAwMDAwMDAzZDU0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxOQogICAgLy8gdm90ZXM6IFZvdGVzTUJSLAogICAgcHVzaGludCAxOTMwMCAvLyAxOTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBzd2FwCiAgICBkaWcgMQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoyMQogICAgLy8gcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICBwdXNoaW50IDIyMTAwIC8vIDIyMTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjIyCiAgICAvLyByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIHB1c2hpbnQgMTg5MDAgLy8gMTg5MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNS0yNwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZm9sbG93czogRm9sbG93c01CUiwKICAgIC8vICAgYmxvY2tzOiBCbG9ja3NNQlIsCiAgICAvLyAgIHBvc3RzOiBNaW5Qb3N0c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIHJlZi5sZW5ndGgpLAogICAgLy8gICB2b3RlczogVm90ZXNNQlIsCiAgICAvLyAgIHZvdGVsaXN0OiBWb3RlbGlzdE1CUiwKICAgIC8vICAgcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICAvLyAgIHJlYWN0aW9ubGlzdDogUmVhY3Rpb25saXN0TUJSLAogICAgLy8gICBtZXRhOiBNZXRhTUJSLAogICAgLy8gICBtb2RlcmF0b3JzOiBNb2RlcmF0b3JzTUJSLAogICAgLy8gICBiYW5uZWQ6IEJhbm5lZE1CUiwKICAgIC8vICAgYWN0aW9uczogQWN0aW9uc01CUgogICAgLy8gfQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjIzCiAgICAvLyBtZXRhOiBNZXRhTUJSLAogICAgcHVzaGludCA0NTMwMCAvLyA0NTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjI2CiAgICAvLyBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICBwdXNoaW50IDI5NzAwIC8vIDI5NzAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIGNvbmNhdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLnBheVdhbGxNYnIocGF5d2FsbDogYnl0ZXMpIC0+IHVpbnQ2NCwgYnl0ZXM6CnNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5wYXlXYWxsTWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMwCiAgICAvLyBwYXlXYWxsTWJyKHBheXdhbGw6IFZpZXdQYXlXYWxsVmFsdWUpOiB1aW50NjQgewogICAgcHJvdG8gMSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzMKICAgIC8vIFBheVdhbGxQYXlPcHRpb25TaXplICogKHBheXdhbGwuYWdlbnRQYXlJbmZvLmxlbmd0aCArIHBheXdhbGwudXNlclBheUluZm8ubGVuZ3RoKQogICAgZnJhbWVfZGlnIC0xCiAgICBwdXNoaW50IDIgLy8gMgogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyAtMQogICAgbGVuCiAgICBmcmFtZV9kaWcgLTEKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGZyYW1lX2RpZyAtMQogICAgc3dhcAogICAgdW5jb3ZlciAzCiAgICBzdWJzdHJpbmczCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMi0zNAogICAgLy8gQm94Q29zdFBlckJ5dGUgKiAoCiAgICAvLyAgIFBheVdhbGxQYXlPcHRpb25TaXplICogKHBheXdhbGwuYWdlbnRQYXlJbmZvLmxlbmd0aCArIHBheXdhbGwudXNlclBheUluZm8ubGVuZ3RoKQogICAgLy8gKQogICAgcHVzaGludCA2ODAwIC8vIDY4MDAKICAgICoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMQogICAgLy8gcmV0dXJuIE1pblBheVdhbGxNQlIgKyAoCiAgICBwdXNoaW50IDUyMDAgLy8gNTIwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMxLTM1CiAgICAvLyByZXR1cm4gTWluUGF5V2FsbE1CUiArICgKICAgIC8vICAgQm94Q29zdFBlckJ5dGUgKiAoCiAgICAvLyAgICAgUGF5V2FsbFBheU9wdGlvblNpemUgKiAocGF5d2FsbC5hZ2VudFBheUluZm8ubGVuZ3RoICsgcGF5d2FsbC51c2VyUGF5SW5mby5sZW5ndGgpCiAgICAvLyAgICkKICAgIC8vICkKICAgICsKICAgIGZyYW1lX2RpZyAtMQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKGFraXRhREFPOiB1aW50NjQsIGNyZWF0b3I6IGJ5dGVzLCB3YWxsZXQ6IHVpbnQ2NCkgLT4gYnl0ZXM6CnNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MQogICAgLy8gY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBjcmVhdG9yOiBBY2NvdW50LCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogdGlwTUJSSW5mbyB7CiAgICBwcm90byAzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6OTQKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBmcmFtZV9kaWcgLTMKICAgIGJ5dGVjIDcgLy8gImFraXRhX2Fzc2V0cyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MgogICAgLy8gY29uc3QgYWt0YSA9IEFzc2V0KGdldEFraXRhQXNzZXRzKGFraXRhREFPKS5ha3RhKQogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTQKICAgIC8vIGlmICghY3JlYXRvci5pc09wdGVkSW4oYWt0YSkgJiYgd2FsbGV0LmlkICE9PSAwKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIHN3YXAKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgYnVyeSAxCiAgICBibnogc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLmNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzX2FmdGVyX2lmX2Vsc2VANQogICAgZnJhbWVfZGlnIC0xCiAgICBieiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzktNDgKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfY2FuQ2FsbD4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGdldFBsdWdpbkFwcExpc3QoYWtpdGFEQU8pLm9wdGluLAogICAgLy8gICAgIHRydWUsCiAgICAvLyAgICAgR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICAgICcnLAogICAgLy8gICAgIG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBPcHRJblBsdWdpbi5wcm90b3R5cGUub3B0SW4+KCkKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBmcmFtZV9kaWcgLTMKICAgIGJ5dGVjIDE2IC8vICJwYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDIKICAgIC8vIGdldFBsdWdpbkFwcExpc3QoYWtpdGFEQU8pLm9wdGluLAogICAgZXh0cmFjdCAwIDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo0NAogICAgLy8gR2xvYmFsLnplcm9BZGRyZXNzLAogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzktNDgKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfY2FuQ2FsbD4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGdldFBsdWdpbkFwcExpc3QoYWtpdGFEQU8pLm9wdGluLAogICAgLy8gICAgIHRydWUsCiAgICAvLyAgICAgR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICAgICcnLAogICAgLy8gICAgIG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBPcHRJblBsdWdpbi5wcm90b3R5cGUub3B0SW4+KCkKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDQ3MjdhZjIxIC8vIG1ldGhvZCAiYXJjNThfY2FuQ2FsbCh1aW50NjQsYm9vbCxhZGRyZXNzLHN0cmluZyxieXRlWzRdKWJvb2wiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo0MwogICAgLy8gdHJ1ZSwKICAgIGJ5dGVjIDEyIC8vIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjQ1CiAgICAvLyAnJywKICAgIGJ5dGVjIDEwIC8vIDB4MDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo0NgogICAgLy8gbWV0aG9kU2VsZWN0b3I8dHlwZW9mIE9wdEluUGx1Z2luLnByb3RvdHlwZS5vcHRJbj4oKQogICAgYnl0ZWMgMjIgLy8gbWV0aG9kICJvcHRJbih1aW50NjQsYm9vbCx1aW50NjRbXSxwYXkpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjM5LTQ4CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2NhbkNhbGw+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIC8vICAgICAnJywKICAgIC8vICAgICBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPigpCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1NgogICAgLy8gaWYgKGNhbkNhbGxBcmM1OE9wdEluKSB7CiAgICBieiBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTkKICAgIC8vIGFyYzU4OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIGdsb2JhbCBBc3NldE9wdEluTWluQmFsYW5jZQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjU3LTYwCiAgICAvLyByZXR1cm4gewogICAgLy8gICB0eXBlOiBUaXBTZW5kVHlwZUFSQzU4LAogICAgLy8gICBhcmM1ODogR2xvYmFsLmFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyB9CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTgKICAgIC8vIHR5cGU6IFRpcFNlbmRUeXBlQVJDNTgsCiAgICBieXRlYyA1IC8vIDB4MTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1Ny02MAogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgdHlwZTogVGlwU2VuZFR5cGVBUkM1OCwKICAgIC8vICAgYXJjNTg6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgLy8gfQogICAgc3dhcAogICAgY29uY2F0CiAgICByZXRzdWIKCnNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pZl9lbHNlQDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NjQtNjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IFRpcFNlbmRUeXBlRGlyZWN0LAogICAgLy8gICBhcmM1ODogMAogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4MGEwMDAwMDAwMDAwMDAwMDAwCiAgICByZXRzdWIK", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAKAAEIIKCNBpBn1PcBgM6JHoCjBbjZAyYhCWFraXRhX2RhbwQVH3x1AXABAAFtARQMYWtpdGFfZXNjcm93DGFraXRhX2Fzc2V0cwNzYWwLc29jaWFsX2ZlZXMCAAAGd2FsbGV0AYABCgEDAW8DcGFsAQEBdwpwYXl3YWxsX2lkA2FhbAIAAQRoNeO8AWEBAgFyBCfju08EhCaceAd2ZXJzaW9uBFgv84IEbMP2BgkAAAAAAAAAAAACAD0xGEAABCcTI2eABOqRgN02GgCOAQEAMRkURDEYQQDpghEEg/FHSARxBbutBLpL95QE1cjnuAQv/DEjBHJyT5YEHJn+ngQC6SYxBIT6S14Ebn1CwgTQ5bGNBG5bdwIE6sbZIgSFZDPqBNCfPegEaaTvlwQzBrMqJxuCDgToaZNNBObme9wEc56nCwTAIr6JBJhLrvUEnhdLtgSokSBEBPE2ANEEkubdOwShNKJ4BDRBdfAEHq0gqQQz6SyUBIVN7eA2GgCOIALyBFcEzQWUBngHQghgCVoJ3ApsCwALegv2DDINUQ2TDi4OaQ5/DpEOqw6/DtgO8A8nD7oP3w/5EAcQKhB8AAEAI0OABIjJQPg2GgCOAQKwADEZgQQSMRgQREIQK4oBAYv/FSJLAQ8iSwJPAk2BEEsCD4EQTwNPAk2L/04CUkkVgRASRImKAwGL/SMNQQATi/0jCYv/i/4JC4HoBwqL/0wJiSNC/+2KAQEyA4v/QAAEiwBMiYv/gAhyZWZlcnJlcmVIQv/tigIBi/6AA29hbGVIgRhbsYAEPBpvM7Iai/+yGrIYgQayECKyAbO0PklXBABLAVcABCkSREkiWYECCEwVEkRXBgBJFUlBAAeLASQTQQAEIowAiYsAF0L/94oEAYv8OBiL/ScUZUiBKFsSQQA6i/w4GUAAM4v8OBuBBBJBACmL/CLCGoAEQ5ImVRJBABqL/CPCGov+EkEAD4v8gQLCGov/FhJBAAIjiSKJigMBIoAARwSL/TEAiP9JiP8ni/9BAXOLBjIDE0EBa4v9gAt3YWxsZXRfZmVlc2VIJFtJIQQORIv/HSEEl0mMA0AACIv/QQADI4wDMgeMBTIHgYD1JAiMAosDFosGTFAnFUxQSYwAi/0nFGVIJFuMBCJZgdTFAQuB5JMCCIwBi/5AAF+xiwRJcghEiwGLAwiyCLIHI7IQIrIBtosFFosCFoAEe33F/LIaTLIashqLALIashiBBrIQIrIBs7cBPklXBABMVwAEKRJESRUkEkQXFosBFlBXCAiL/4sDCRZMUIwAiYsEcghEi/5wAEUBQQBniwGxiwRJcghEiwGyCLIHI7IQIrIBtklyCESL/rIRiwOyErIUgQSyECKyAbaLBRaLAhaABK8aFPKyGkyyGrIaiwCyGrIYgQayECKyAbO3Aj5JVwQATFcABCkSREkVJBJEF0yMAUL/eIsBMhAIsYsESXIIRDIQsgiyByOyECKyAbaL/haABDlOrrKyGrIashiBBrIQIrIBs0L/aIv/FiIWUIwAiTYaAUkiWYECCEsBFRJEVwIANhoCSRUkEkQXNhoDSRUkEkQXJxxPA2coTwJnJwZMZyNDgABHAyIoZUQnB2VIIltJMgpLAXAARQEURLEyCksBshEishKyFIEEshAisgGzIicGZURyCERMcABFAUABJiIoZUxJTgJFB0RJJwtlSElOAkUESScQZUhJVwgITCRbRQZMJwtlSLGABKJAPd+yGoAQAAEAAgAKcmV2X3NvY2lhbLIashiBBrIQIrIBs7Q+SVcEAEsBVwAEKRJESSJZgQkLgQIITBUSRFcGCSJbSUQiJwZlRExLARJEsScdshpMshonDLIagAwACnJldl9zb2NpYWyyGoAKAAEAAAAAAAAAALIaJwqyGkyyGIEGshAisgFyCEQiRQVLAXAARQFAABpLBIAOcmV2ZW51ZV9zcGxpdHNlSCJZIwhFBDIQSwQLtiInBmVEcghEsgeyCCOyECKyAbZLAUkWSwIWJxVMUCcWshpMshonDLIashpLA7IYgQayECKyAbYnHrIashiBBrIQIrIBsyNDMRaBAglJOBAjEkQxFiMJSTgQgQQSRDYaAUkVJBJEFzYaAkkVgRgSRDYaA0kVgSQSRDYaBEkVJBJEFzYaBUkVIxJEIlM2GgZJFSQSRBcyB0sGCYE8DkQxAE8GFlBPBVABTwUnDYgVDyWvTE4GTgYrTweIEU8jQzEWgQIJSTgQIxJEMRYjCUk4EIEEEkQ2GgFJFYEkEkQ2GgJJFSUSRCpLAVBJvUUBREm+SExJIiW6SwKBO1lLAxVPBE4CUlcCAEsCgSgkuhdLA4EwI7oiU0sEgTEkuhdLBYE6I7oxAE8GEkRJiAteFERLBEyIC20URDEASwZQSwdQAScXSwFQTwVMUEsFvkRLARUWVwYCTwJQSwGBO1lPAiJPAlhMUEsFvEhPBUy/TwYnDYgUTE8GTwZPBU8FTwUnGE8HiBCII0MxFoEDCUk4ECMSRDEWgQIJSTgQgQQSRDEWIwlJOBCBBhJENhoBSRUkEkQXNhoCSRWBGBJENhoDSRWBJBJENhoESSJZgQIISwEVEkRXAgA2GgVJFSMSRDYaBkkVJBJEFzYaB0kVIxJEIlM2GghJFSQSRBdPA08EiArgSVcAIExXICAyB0sICYE8DkQqSwJQSb1FAURJIiW6TIEoJLoXIihlRDEATwxOAk8DiPqdREsBMgMSTUsBTIgOSTEATwgWUE8HUAFPBycFiBNvJa9MTwhPA08ITwVPCE8ITwgnEU8JiBCmI0MxFoECCUk4ECMSRDEWIwlJOBCBBBJENhoBSRUkEkQXNhoCSRWBGBJENhoDSRWBJBJENhoESSJZgQIISwEVEkRXAgA2GgVJFSMSRDYaBkkVJBJEFzYaB0kVIxJEIlM2GghJFSQSRBdPA08EiAoISVcAIExXICAyB0sICYE8DkQqSwJQSb1FAURJIiW6TIEoJLoXFERLATIDEk1LAUyIDX8xAE8IFlBPB1ABTwcnBYgSpSWvTE8ITwNPCE8FTwhPCE8IJxFPCYgP3CNDMRaBAwlJOBAjEkQxFoECCUk4EIEEEkQxFiMJSTgQgQYSRDYaAUkVgSQSRDYaAkkVJRJEIihlRDEAiPkHSCpLAVBJvUUBREm+SExJIiW6SwKBO1lLAxVPBE4CUlcCAEsCgSgkuhdLA4EwI7oiU0sEgTEkuhdLBYE6I7oxAE8GEkRJiAjTREsETIgI4xREMQBLBlBLB1ABJxdLAVBLBUxQSwa+REsBFRZXBgJPAlBLAYE7WU8CIk8CWExQSwa8SE8GTL9LBBWBJEsBD4EkSwJPAk2BREsCD4FETwNPAk1PBk4CUkkVJRJEKksBUIEoJLoXIihlRDEATwpOAk8DiPicRE8HJwWIEYRMTwciTwhPBE8HTwdPBycOTwmIDr4jQzEWgQIJSTgQIxJEMRYjCUk4EIEEEkQ2GgFJFYEkEkQ2GgJJFSUSRCpLAVBJvUUBREm+SExJIiW6SwKBO1lLAxVPBE4CUlcCAEsCgSgkuhdLA4EwI7oiU0sEgTEkuhdLBYE6I7oxAE8GEkRJiAfLREsETIgH2xREMQBLBlBLB1ABJxdLAVBLBUxQSwa+REsBFRZXBgJPAlBLAYE7WU8CIk8CWExQSwa8SE8GTL9LBBWBJEsBD4EkSwJPAk2BREsCD4FETwNPAk1PBk4CUkkVJRJEKksBUIEoJLoXFERPBycFiBCKTE8HIk8ITwRPB08HTwcnDk8JiA3EI0MxFoECCUk4ECMSRDEWIwlJOBCBBBJENhoBSSJZgQIISwEVEkRXAgA2GgJJFSMSRDYaA0kVIxJEIlNOAklPAogHUklXACBOAlcgIEwnDRJBAA4qSwJQSb1FAUQiJbpFAUsBSUsCiArVSwUnBYgQBYAAiBEyJVsISwZMTwJLBYgOHyNDMRaBAglJOBAjEkQxFiMJSTgQgQQSRDYaAUcCFSUSRDYaAkkVIxJEIlMxAIj2E0sCiPYOSwEVgRASREkVgRASRFAnD0xQSb1FAURJvkhJIltMgUBTFElOBU8ETE8CiAr0vEhAABexMQCAAIgQtiVbsgiyByOyECKyAbMjQ0sCJwWID25LAyJLA0sDiA2QQv/qMRaBAwlJOBAjEkQxFoECCUk4EIEEEkQxFiMJSTgQgQYSRDYaAUkiWYECCEsBFRJEVwIANhoCSRUjEkQ2GgNJFSQSRBdMTwKIBjdJVwAgTFcgICpLAlBJvUUBREkiJbpMgSgkuhciKGVEMQBPB04CTwOI9f1ESwEyAxJNSwFMiAmpTwMnBYgO2U8DTE8CTwOIDe0jQzEWgQIJSTgQIxJEMRYjCUk4EIEEEkQ2GgFJIlmBAghLARUSRFcCADYaAkkVIxJENhoDSRUkEkQXTE8CiAWvSVcAIExXICAqSwJQSb1FAURJIiW6TIEoJLoXFERLATIDEk1LAUyICS9PAycFiA5fTwNMTwJPA4gNcyNDNhoBSRUlEkQ2GgJJFSQSRBcxAIgPORREKksCUEm9RQFEIiW6MQCIBgYURDEAiPRzSwKI9G5LARWBEBJESRWBEBJEUEwWTEsBUIABZUxQSb1FAUROAlAnGUxQSb5EFyMJFr+8SLExAIAAiA8ZgTBbsgiyByOyECKyAbMjQzYaAUkVJRJENhoCSRUjEkQiUzEAIihlRCcIZUiBGFtyCEQSRCpPAlBJvUUBREmBOSO6Ik8DVIE5TLsjQzEWIwlJOBAjEkQ2GgFJFSUSRDYaAkkVIxJEIlM2GgNJTgQVJBJENhoESU4EFSQSRDYaBUlOBBUkEkQiKGVESwKI9BBOAzEATwISTgMnBDEAUL1FARRESwE4BzIKEk8COAiAAIgOZ4E4WyEGCBIQRCIoZUQnCGVIgRBbSU4EsXIIRCEGsgiyByOyECKyAbNBAEAxAE4CI4gNxrExACIWJxqyGkyyGkmyGkmyGrIaSbIYgQayECKyAbO0PklXBABMVwAEKRJEFSQSRCIWKUxQsCNDMQBOAiKIDYaxIihlRCcIZUiBEFsxACcashqyGksEshpLA7IaSwKyGrIYgQayECKyAbO0PklXBABMVwAEKRJESRUkEkQXMQCIBJkIQv+rMRYjCUk4ECMSRDYaAUsBOAcyChJPAjgITwKIDeFOAg9PAhBEIicTZURJIwgnE0xnFicSSwFQSbxITwK/KUxQsCNDNhoBSRUkEkQ2GgJJFSQSRDYaA0kVJBJENhoESRUkEkQ2GgVJFSQSRDYaBkkVJBJESRcnBDEAUL1FAUQnBDEAUIEyTwi7JwQxAFCBOk8HuxYnEkxQvUUBRCcEMQBQgUJPArsiKGVEJwhlSIEQW7ExACcashqyGk8DshpPArIashiyGoEGshAisgGztD5JVwQATFcABCkSRBUkEkM2GgFJFSUSRDYaAkkVJBJENhoDSRUkEkQxACIoZUQnCGVIJFtyCEQSRCcETwNQSYEhTwS7gSlPArsjQzYaAUkVJRJEiAxVKyJPAlQpTFCwI0M2GgFJFSUSRIgDXBYpTFCwI0M2GgFJFSUSRCcETFC9RQErIk8CVClMULAjQzYaAUkVJRJEJwRMUL5EKUxQsCNDNhoBSRUlEkQqTFC9RQErIk8CVClMULAjQzYaAUkVJRJEKkxQSb1FAUS+SClMULAjQzYaAUkVJRJENhoCSRUlEkRMiPEZTIjxFUsBFYEQEkRJFYEQEkRQJw9MUEm9RQFEvkgpTFCwI0MiNhoBRwIiWUlOAoFAC4ECCEwVEkQnCiJJSwMMQQBtSwNXAgBLAYFAC4FAWElXACBMVyAgTIjwvkyI8LpLARWBEBJESRWBEBJEUCcPTFBJRQa9RQFBAB9LBL5ESwJJTwJQTCJZIwgWVwYCXABFAkkjCEUBQv+iSwFJJx9QTCJZIwgWVwYCXABFAkL/4ilLAlCwI0M2GgFJFSUSRDYaAkkVJBJEFxZQJxlMUL1FASsiTwJUKUxQsCNDNhoBSSJZgQIISwEVEkRXAgCICwwpTFCwI0M2GgGIC1BIFilMULAjQzYaAUkVJBJEFzYaAkkVJRJENhoDSRUkEkQXiAtXKUxQsCNDNhoBSRUkEkQXMQAiKGVEJwtlSHIIRBJEJwZMZyNDNhoBSSJZgQIISwEVEkRXAgAxACIoZURJJwtlSHIIRE8CEkQnEGVIgRBbMg0SRCccTGcjQzYaAUkVJBJEFzEAIihlRCcLZUhyCEQSRChMZyNDigEBi/8nERJAAAiL/ycOEkEAAiOJIomKAgGL/ysSQQAHgSSL/hUMiYv/JxESQQAFgURC/+6L/ycYEkEABYFEQv/hi/8nDhJBAAWBZEL/1IEkQv/PigIBIjIDi/4nDRJBABOL/xUlEkSL/0kVJRJEiwFQjACJi/4nBRJBACWL/xUkEkSL/xdJcQBERIEYr4v/TFBJTgIVJRJEcQtMjAFEQv/Ii/6AAR4SQQAli/8VJRJEJwSL/1BJjAC9RQFBAAmLAL5EgTpbFESL/0mMAUL/mov+gAEoEkEAJov/FSQSRIv/F0lyAEQVRIEYr4v/TFBJTgIVJRJEcgdMjAFEQv9ri/6AATISRIv/ATIDjAFC/1qKAgGxIihlRCcIZUgkW4AEQwNmjrIai/6yGov/shqyGIEGshAisgGztD5JVwQATFcABCkSREkVIxJEIlOJigEBIoAARwUnBIv/UEm9RQFAAAQijACJiwe+REmBCVtJTgKMBoERW4wFgTwPQQCBgWSMBDIHiwUJSYwBIQcPQQBfiwSBSwiMBIABdov/UEmMAL1FAUEANIsAvkRJIltMgUBTjAOBSwshBApJjAKBSw1BAASBS4wCiwNBABqLBIsCDUEADIsEiwIJjASLBIwAiSKMBEL/9YsEiwIIjARC/+uLAYFLCyEHCosECIwEQv+YiwaBZAuBPAqMBEL/dooBAbEiKGVEJwhlSIEQW4AE+Bx7YrIai/+yGrIYgQayECKyAbO0PklXBABMVwAEKRJESRUkEkQXi/+I/wUIiYoDASJJgABHBIv9MgMSQQAoIihlRCcHZUgiW7EiJwZlRHIIREyyEYv+shKyFIEEshAisgGzIowAiSKMBicEi/1QSYwAvUUBQQAIiwC+RCNbjAYiKGVEi/2LBogIO0lXAAFMI1uMAyIoZURJJwdlSCJbSYwCi/+I7dEiW4wEIihlRCcJZUgkW0wnBRJBAL+L/wmLBkmAEmNvbnRyb2xsZWRfYWRkcmVzc2VITCIoZUQnEGVISVcACEwiW7EnHbIaTLIaJwyyGicKshonCrIaJwqyGksBshiBBrIQIrIBtjIQSwOyB7III7IQIrIBtksBFosCSU4DFicVTFAnFrIaTLIaJwyyGrIashiBBrIQIrIBticeshpMshiBBrIQIrIBtiInBmVEcghESwGyEYsEshKyFIEEshAisgG2shGyFLISgQSyECKyAbOLA4wAiYv/CUmMBSInBmVEcghMjAFEQQA3i/2LAnAARQFBACyxiwJJshGLBLISiwGyFIEEshAisgG2shGLBbISi/2yFIEEshAisgGzIowAiYsEiwUIsYsCshGyEosBshSBBLIQIrIBs0L/4YoCASqL/lBJvUUBQAArMgcWi/9MUCIWTEsBUCtQTFCABgAAAD0AAFCLAEm8SEy/gACIBjWBEFtMiSJMiYoBACcEi/9QRwK9RQFESb5ISYERW0yBGVtJTgJOAzIHSU8CCSEIGAlJTgMhCAkyBxZPA4EZTwK7DEEACiMWiwCBCU8Cu4mLAYsCDEEAD4sASb5EgQlbIwgWgQlMu4mKAwCAAEcCgAF2i/1QSb1FAUAAH4v+FIv/FisiTwNUUElXAAhMgUBTKyJPAlRQiwNMv4mLA75ESYFAU4wBIluMAov+QQAFiwFAAAqL/kAAaIsBQABjI4wAiwJAAA+L/hSL/xYrIk8DVFBC/7SL/4sCEkEACosAQQAFJx9C/6KL/4sCDYsAEEEAE4v/iwIJiwEUTBYrIk8DVFBC/4SLAEEAD4sCi/8JFisiiwFUUEL/cIsCi/8IQv/uIowAQv+aigQAi/6I6ieL/IjqIksBFYEQEkRJFYEQEkRQi/8WKyKL/VRQJw9PAlBMv4mKCAAigAAxAIgEpBREi/xAAAWL/UEAMIv8QQDii/1BAA2L/RYnEkxQvUUBQAAZi/1AAMsnBDEAUL5EV0IIJxJMUL1FAUEAtyNEi/4nGBJJIQULi/mL+ksDTwOIA5IxAIj+VjEAiPwjjAEqi/hQSYwAvUUBFERBAIGL+ov/UDEAMgcWUIv7FlArIov8VFCL/RZQK1CL/lBMSRUWVwYCTFBMJyBQTFCLAEm8SEy/i/gjiwFJTgOI/l+L+CMxAE8DiP8TIihlREknB2VIIltLAScJZUgiW08CSwJPAojqNiJbsSInBmVEcghETwKyEbIUshKBBLIQIrIBs4mL+kL/fyJC/0aKCgAiMQCIA6QURCqL+lAiJbpJMQCI+nUURDEAiP2XIihlRCcJZUgkW0sBiPtaIihlRCcJZUhJgRBbTIEYW4jo6EkhBA5ESwEdIQSXi/4nDhJJTgJOBE8DTwNPAoj7aIv4CExBAAMhBQiL94v5iwFJTgNPBIgCdiqL9lBJjAC9RQEUREEAT4v5i/pQi/9QMQAyBxZQi/sWUCsii/xUUIv9FlArUIv+UExJFRZXBgJMUEwnIFBMUIsASbxITL8xAIj6xov2I0sCiP1Ki/YjMQBPA4j9/omL+Yv6UEL/sYoEADEAiALIFEQqi/5QSb1FAUQiJbpHAjEAiPmTFEQxAIjoAIv+iOf7SwEVgRASREkVgRASRFAnD0xQvUUBFEQxABNEJwQxAFC+RIGIA1MURCIoZUQnB2VIIlsxAIj8eSIoZUQnCWVISSRbTEmBEFtOAoEYW0yL/0EAS4sASYj6KosCiwOI58RJIQQORE8CSU8CHSEEl4j6UYv8OAcyChKL/DgIi/1PAwgSEEQxAIj5+ov+i/9LAoj8fYv+i/8xAE8DiP0wiYv8OAcyChKL/DgIi/0SEESxIicGZURyCESLAbIRshSyEoEEshAisgGzQv+6igQAMQCIAdYURCqL/lBJvUUBRCIlukkxAIj4ohREMQCL/3AASEQxAIjnB4v+iOcCSwEVgRASREkVgRASRFCL/xZMSwFQgAFlTFBJTgO9RQEURDEAiPuQIihlRCcJZUhJJFtLAYEQW08CgRhbSwSI+UhOAojm5Iv+FSUSRIv+TwNQJxlMUElOBL1JTgJOBUhOA4j5ZIv9CEyAAIgBd0mBMFtOAoEoW04CQQAxi/w4BzIKEov8OAhPAosDCBIQRIsCQQAQiwFJvkQXIwgWv4sAIrlIiSMWiwFMv0L/8YsECEL/yYoCACIoZURJJwdlSCJbTCcJZUhJIltMJFuL/jgUMgoSi/44EU8EEhCL/jgSi/8nDRJPA08ETwJNEhBEiYoEAIAASYv9iADrSYEQW0xJgRhbTCVbIihlTElPAkRJJwdlSCJbTDEAiOZQiOYuMgMSQQAmIosCiwMIiwQICIv/CIv+QQADIQUIi/w4BzIKEov8OAhPAhIQRImLBScUZUgkW4wBIQmMAIsGQQAViwFyCESLBnAARQFAAAchCTIQCIwAiwBC/66KBAAyB0krIov9VIv+FlAjFlBPAhZQTBZQIhZMSwFQSwFQKyKL/1RQSwFQSwFQTFAnBIv8UEy/iYoBAbEiKGVEJwhlSIEYWycbshqL/7IashiBBrIQIrIBs7Q+SVcEAExXAAQpEkRJFSMSRCJTiYoBAYv/FYGQAwuBpLkCCBaAEAAAAAAAAHvUAAAAAAAAPVRMUIHklgEWTEsBUExQgdSsARZQgdSTARZMSwFQgfThAhZQSwFQTFCBhOgBFlCJigECi/+BAlmL/xWL/0sCTwJSIlmL/yJZi/9MTwNSIlkIgZA1C4HQKAiL/4mKAwGL/ScHZUgiW4v+THAARQFAAFWL/0EAULGL/ScQZUhXAAgyA4AERyevIbIaTLIaJwyyGrIaJwqyGicWshqL/7IYgQayECKyAbO0PklXBABMVwAEKRJESRUjEkQiU0EACDIQFicFTFCJgAkKAAAAAAAAAACJ", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var AkitaSocialParamsFactory = class _AkitaSocialParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(string,uint64,uint64)void":
            return _AkitaSocialParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the AkitaSocial smart contract using the create(string,uint64,uint64)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(string,uint64,uint64)void",
          args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.akitaDao, params.args.akitaDaoEscrow]
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
            return _AkitaSocialParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the AkitaSocial smart contract using the update(string)void ABI method
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
   * Constructs a no op call for the init()void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static init(params) {
    return {
      ...params,
      method: "init()void",
      args: Array.isArray(params.args) ? params.args : []
    };
  }
  /**
   * Constructs a no op call for the post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static post(params) {
    return {
      ...params,
      method: "post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.timestamp, params.args.nonce, params.args.cid, params.args.gateId, params.args.usePayWall, params.args.payWallId]
    };
  }
  /**
   * Constructs a no op call for the editPost(pay,axfer,byte[36],byte[32])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static editPost(params) {
    return {
      ...params,
      method: "editPost(pay,axfer,byte[36],byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.cid, params.args.amendment]
    };
  }
  /**
   * Constructs a no op call for the gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static gatedReply(params) {
    return {
      ...params,
      method: "gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.gateTxn, params.args.timestamp, params.args.nonce, params.args.cid, params.args.ref, params.args.type, params.args.gateId, params.args.usePayWall, params.args.payWallId]
    };
  }
  /**
   * Constructs a no op call for the reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static reply(params) {
    return {
      ...params,
      method: "reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.timestamp, params.args.nonce, params.args.cid, params.args.ref, params.args.type, params.args.gateId, params.args.usePayWall, params.args.payWallId]
    };
  }
  /**
   * Constructs a no op call for the gatedEditReply(pay,axfer,appl,byte[36],byte[32])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static gatedEditReply(params) {
    return {
      ...params,
      method: "gatedEditReply(pay,axfer,appl,byte[36],byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.gateTxn, params.args.cid, params.args.amendment]
    };
  }
  /**
   * Constructs a no op call for the editReply(pay,axfer,byte[36],byte[32])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static editReply(params) {
    return {
      ...params,
      method: "editReply(pay,axfer,byte[36],byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.cid, params.args.amendment]
    };
  }
  /**
   * Constructs a no op call for the vote(pay,axfer,byte[],uint8,bool)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static vote(params) {
    return {
      ...params,
      method: "vote(pay,axfer,byte[],uint8,bool)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.ref, params.args.type, params.args.isUp]
    };
  }
  /**
   * Constructs a no op call for the editVote(pay,axfer,byte[32],bool)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static editVote(params) {
    return {
      ...params,
      method: "editVote(pay,axfer,byte[32],bool)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.ref, params.args.flip]
    };
  }
  /**
   * Constructs a no op call for the gatedReact(pay,axfer,appl,byte[],uint8,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static gatedReact(params) {
    return {
      ...params,
      method: "gatedReact(pay,axfer,appl,byte[],uint8,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.gateTxn, params.args.ref, params.args.type, params.args.nft]
    };
  }
  /**
   * Constructs a no op call for the react(pay,axfer,byte[],uint8,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static react(params) {
    return {
      ...params,
      method: "react(pay,axfer,byte[],uint8,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.tip, params.args.ref, params.args.type, params.args.nft]
    };
  }
  /**
   * Constructs a no op call for the deleteReaction(byte[32],uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static deleteReaction(params) {
    return {
      ...params,
      method: "deleteReaction(byte[32],uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.ref, params.args.nft]
    };
  }
  /**
   * Constructs a no op call for the setPostFlag(byte[32],bool)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static setPostFlag(params) {
    return {
      ...params,
      method: "setPostFlag(byte[32],bool)void",
      args: Array.isArray(params.args) ? params.args : [params.args.ref, params.args.flagged]
    };
  }
  /**
   * Constructs a no op call for the initMeta(pay,address,bool,uint64,uint64,uint64)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static initMeta(params) {
    return {
      ...params,
      method: "initMeta(pay,address,bool,uint64,uint64,uint64)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.user, params.args.automated, params.args.subscriptionIndex, params.args.nfd, params.args.akitaNft]
    };
  }
  /**
   * Constructs a no op call for the createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static createPayWall(params) {
    return {
      ...params,
      method: "createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.payWall]
    };
  }
  /**
   * Constructs a no op call for the updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateMeta(params) {
    return {
      ...params,
      method: "updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.followGateId, params.args.addressGateId, params.args.subscriptionIndex, params.args.nfd, params.args.akitaNft, params.args.defaultPayWallId]
    };
  }
  /**
   * Constructs a no op call for the updateFollowerMeta(address,uint64,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateFollowerMeta(params) {
    return {
      ...params,
      method: "updateFollowerMeta(address,uint64,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.newFollowerIndex, params.args.newFollowerCount]
    };
  }
  /**
   * Constructs a no op call for the isBanned(address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isBanned(params) {
    return {
      ...params,
      method: "isBanned(address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.account]
    };
  }
  /**
   * Constructs a no op call for the getUserSocialImpact(address)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getUserSocialImpact(params) {
    return {
      ...params,
      method: "getUserSocialImpact(address)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.user]
    };
  }
  /**
   * Constructs a no op call for the getMetaExists(address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getMetaExists(params) {
    return {
      ...params,
      method: "getMetaExists(address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.user]
    };
  }
  /**
   * Constructs a no op call for the getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getMeta(params) {
    return {
      ...params,
      method: "getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.user]
    };
  }
  /**
   * Constructs a no op call for the getPostExists(byte[32])bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getPostExists(params) {
    return {
      ...params,
      method: "getPostExists(byte[32])bool",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
    };
  }
  /**
   * Constructs a no op call for the getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[]) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getPost(params) {
    return {
      ...params,
      method: "getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
    };
  }
  /**
   * Constructs a no op call for the getVote(address,byte[32])(uint64,bool) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getVote(params) {
    return {
      ...params,
      method: "getVote(address,byte[32])(uint64,bool)",
      args: Array.isArray(params.args) ? params.args : [params.args.account, params.args.ref]
    };
  }
  /**
   * Constructs a no op call for the getVotes((address,byte[32])[])(uint64,bool)[] ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getVotes(params) {
    return {
      ...params,
      method: "getVotes((address,byte[32])[])(uint64,bool)[]",
      args: Array.isArray(params.args) ? params.args : [params.args.keys]
    };
  }
  /**
   * Constructs a no op call for the getReactionExists(byte[32],uint64)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getReactionExists(params) {
    return {
      ...params,
      method: "getReactionExists(byte[32],uint64)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.ref, params.args.nft]
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
      method: "mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
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
      method: "payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.paywall]
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
      method: "checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.akitaDao, params.args.creator, params.args.wallet]
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
};
var AkitaSocialFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `AkitaSocialFactory`
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
    return new AkitaSocialClient(this.appFactory.getAppClientById(params));
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
    return new AkitaSocialClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the AkitaSocial smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? AkitaSocialParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? AkitaSocialParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0
    });
    return { result: result.result, appClient: new AkitaSocialClient(result.appClient) };
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
       * Creates a new instance of the AkitaSocial smart contract using the create(string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(AkitaSocialParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the AkitaSocial smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(AkitaSocialParamsFactory.update.update(params));
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
       * Creates a new instance of the AkitaSocial smart contract using the create(string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(AkitaSocialParamsFactory.create.create(params));
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
       * Creates a new instance of the AkitaSocial smart contract using an ABI method call using the create(string,uint64,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(AkitaSocialParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new AkitaSocialClient(result.appClient) };
      }
    }
  };
};
var AkitaSocialClient = class _AkitaSocialClient {
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
   * Returns a new `AkitaSocialClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _AkitaSocialClient(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
  }
  /**
   * Returns an `AkitaSocialClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _AkitaSocialClient(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
       * Updates an existing instance of the AkitaSocial smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(AkitaSocialParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocial smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `init()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    init: (params = { args: [] }) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.init(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    post: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.post(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editPost(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    editPost: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.editPost(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    gatedReply: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.gatedReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    reply: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.reply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedEditReply(pay,axfer,appl,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    gatedEditReply: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.gatedEditReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editReply(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    editReply: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.editReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `vote(pay,axfer,byte[],uint8,bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    vote: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.vote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editVote(pay,axfer,byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    editVote: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.editVote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReact(pay,axfer,appl,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    gatedReact: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.gatedReact(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `react(pay,axfer,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    react: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.react(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `deleteReaction(byte[32],uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    deleteReaction: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.deleteReaction(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `setPostFlag(byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    setPostFlag: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.setPostFlag(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `initMeta(pay,address,bool,uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    initMeta: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.initMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    createPayWall: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.createPayWall(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateMeta: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.updateMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateFollowerMeta(address,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateFollowerMeta: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.updateFollowerMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    isBanned: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.isBanned(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getUserSocialImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getUserSocialImpact: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getUserSocialImpact(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMetaExists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getMetaExists: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getMetaExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getMeta: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPostExists(byte[32])bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getPostExists: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getPostExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getPost: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getPost(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVote(address,byte[32])(uint64,bool)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getVote: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getVote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVotes((address,byte[32])[])(uint64,bool)[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getVotes: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getVotes(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getReactionExists(byte[32],uint64)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getReactionExists: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.getReactionExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mbr: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    payWallMbr: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.payWallMbr(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    checkTipMbrRequirements: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.checkTipMbrRequirements(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.params.call(AkitaSocialParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocial smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(AkitaSocialParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocial smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `init()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    init: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.init(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    post: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.post(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editPost(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    editPost: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.editPost(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    gatedReply: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.gatedReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    reply: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.reply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedEditReply(pay,axfer,appl,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    gatedEditReply: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.gatedEditReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editReply(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    editReply: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.editReply(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `vote(pay,axfer,byte[],uint8,bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    vote: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.vote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editVote(pay,axfer,byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    editVote: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.editVote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReact(pay,axfer,appl,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    gatedReact: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.gatedReact(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `react(pay,axfer,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    react: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.react(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `deleteReaction(byte[32],uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    deleteReaction: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.deleteReaction(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `setPostFlag(byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    setPostFlag: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.setPostFlag(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `initMeta(pay,address,bool,uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    initMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.initMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    createPayWall: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.createPayWall(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.updateMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateFollowerMeta(address,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateFollowerMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.updateFollowerMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    isBanned: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.isBanned(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getUserSocialImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getUserSocialImpact: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getUserSocialImpact(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMetaExists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getMetaExists: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getMetaExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getMeta(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPostExists(byte[32])bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getPostExists: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getPostExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getPost: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getPost(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVote(address,byte[32])(uint64,bool)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getVote: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getVote(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVotes((address,byte[32])[])(uint64,bool)[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getVotes: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getVotes(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getReactionExists(byte[32],uint64)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getReactionExists: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.getReactionExists(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mbr: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    payWallMbr: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.payWallMbr(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    checkTipMbrRequirements: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.checkTipMbrRequirements(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDaoEscrow: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.updateAkitaDaoEscrow(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(AkitaSocialParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocial smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(AkitaSocialParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocial smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `init()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    init: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.init(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    post: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.post(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editPost(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    editPost: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.editPost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    gatedReply: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.gatedReply(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    reply: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.reply(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedEditReply(pay,axfer,appl,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    gatedEditReply: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.gatedEditReply(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editReply(pay,axfer,byte[36],byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    editReply: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.editReply(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `vote(pay,axfer,byte[],uint8,bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    vote: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.vote(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `editVote(pay,axfer,byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    editVote: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.editVote(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `gatedReact(pay,axfer,appl,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    gatedReact: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.gatedReact(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `react(pay,axfer,byte[],uint8,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    react: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.react(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `deleteReaction(byte[32],uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    deleteReaction: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.deleteReaction(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `setPostFlag(byte[32],bool)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    setPostFlag: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.setPostFlag(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `initMeta(pay,address,bool,uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    initMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.initMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    createPayWall: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.createPayWall(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.updateMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateFollowerMeta(address,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateFollowerMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.updateFollowerMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    isBanned: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.isBanned(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getUserSocialImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getUserSocialImpact: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getUserSocialImpact(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMetaExists(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getMetaExists: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getMetaExists(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPostExists(byte[32])bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getPostExists: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getPostExists(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getPost: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getPost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVote(address,byte[32])(uint64,bool)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getVote: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getVote(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getVotes((address,byte[32])[])(uint64,bool)[]` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getVotes: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getVotes(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `getReactionExists(byte[32],uint64)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getReactionExists: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.getReactionExists(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mbr: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.mbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    payWallMbr: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.payWallMbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    checkTipMbrRequirements: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.checkTipMbrRequirements(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAOEscrow(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDaoEscrow: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.updateAkitaDaoEscrow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.updateAkitaDao(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocial smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    opUp: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(AkitaSocialParamsFactory.opUp(params));
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
    return new _AkitaSocialClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `isBanned(address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async isBanned(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.isBanned(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getUserSocialImpact(address)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getUserSocialImpact(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getUserSocialImpact(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getMetaExists(address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getMetaExists(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getMetaExists(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getMeta(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getMeta(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getPostExists(byte[32])bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getPostExists(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getPostExists(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getPost(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getPost(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getVote(address,byte[32])(uint64,bool)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getVote(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getVote(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getVotes((address,byte[32])[])(uint64,bool)[]` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getVotes(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getVotes(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocial smart contract using the `getReactionExists(byte[32],uint64)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getReactionExists(params) {
    const result = await this.appClient.send.call(AkitaSocialParamsFactory.getReactionExists(params));
    return result.return;
  }
  /**
   * Methods to access state for the current AkitaSocial app
   */
  state = {
    /**
     * Methods to access global state for the current AkitaSocial app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          payWallId: result.payWallId,
          akitaDaoEscrow: result.akitaDAOEscrow,
          version: result.version,
          akitaDao: result.akitaDAO
        };
      },
      /**
       * Get the current value of the payWallId key in global state
       */
      payWallId: async () => {
        return await this.appClient.state.global.getValue("payWallId");
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
     * Methods to access box state for the current AkitaSocial app
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
       * Get values from the posts map in box state
       */
      posts: {
        /**
         * Get all current values of the posts map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("posts");
        },
        /**
         * Get a current value of the posts map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("posts", key);
        }
      },
      /**
       * Get values from the paywall map in box state
       */
      paywall: {
        /**
         * Get all current values of the paywall map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("paywall");
        },
        /**
         * Get a current value of the paywall map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("paywall", key);
        }
      },
      /**
       * Get values from the votes map in box state
       */
      votes: {
        /**
         * Get all current values of the votes map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("votes");
        },
        /**
         * Get a current value of the votes map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("votes", key);
        }
      },
      /**
       * Get values from the votelist map in box state
       */
      votelist: {
        /**
         * Get all current values of the votelist map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("votelist");
        },
        /**
         * Get a current value of the votelist map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("votelist", key);
        }
      },
      /**
       * Get values from the reactions map in box state
       */
      reactions: {
        /**
         * Get all current values of the reactions map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("reactions");
        },
        /**
         * Get a current value of the reactions map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("reactions", key);
        }
      },
      /**
       * Get values from the reactionlist map in box state
       */
      reactionlist: {
        /**
         * Get all current values of the reactionlist map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("reactionlist");
        },
        /**
         * Get a current value of the reactionlist map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("reactionlist", key);
        }
      },
      /**
       * Get values from the meta map in box state
       */
      meta: {
        /**
         * Get all current values of the meta map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("meta");
        },
        /**
         * Get a current value of the meta map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("meta", key);
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
       * Add a init()void method call against the AkitaSocial contract
       */
      init(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.init(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a post(pay,axfer,uint64,byte[24],byte[36],uint64,bool,uint64)void method call against the AkitaSocial contract
       */
      post(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.post(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a editPost(pay,axfer,byte[36],byte[32])void method call against the AkitaSocial contract
       */
      editPost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editPost(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a gatedReply(pay,axfer,appl,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void method call against the AkitaSocial contract
       */
      gatedReply(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedReply(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a reply(pay,axfer,uint64,byte[24],byte[36],byte[],uint8,uint64,bool,uint64)void method call against the AkitaSocial contract
       */
      reply(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.reply(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a gatedEditReply(pay,axfer,appl,byte[36],byte[32])void method call against the AkitaSocial contract
       */
      gatedEditReply(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedEditReply(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a editReply(pay,axfer,byte[36],byte[32])void method call against the AkitaSocial contract
       */
      editReply(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editReply(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a vote(pay,axfer,byte[],uint8,bool)void method call against the AkitaSocial contract
       */
      vote(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.vote(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a editVote(pay,axfer,byte[32],bool)void method call against the AkitaSocial contract
       */
      editVote(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.editVote(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a gatedReact(pay,axfer,appl,byte[],uint8,uint64)void method call against the AkitaSocial contract
       */
      gatedReact(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedReact(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a react(pay,axfer,byte[],uint8,uint64)void method call against the AkitaSocial contract
       */
      react(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.react(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a deleteReaction(byte[32],uint64)void method call against the AkitaSocial contract
       */
      deleteReaction(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteReaction(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a setPostFlag(byte[32],bool)void method call against the AkitaSocial contract
       */
      setPostFlag(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.setPostFlag(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a initMeta(pay,address,bool,uint64,uint64,uint64)uint64 method call against the AkitaSocial contract
       */
      initMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.initMeta(params)));
        resultMappers.push((v) => client.decodeReturnValue("initMeta(pay,address,bool,uint64,uint64,uint64)uint64", v));
        return this;
      },
      /**
       * Add a createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 method call against the AkitaSocial contract
       */
      createPayWall(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.createPayWall(params)));
        resultMappers.push((v) => client.decodeReturnValue("createPayWall(pay,((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64", v));
        return this;
      },
      /**
       * Add a updateMeta(uint64,uint64,uint64,uint64,uint64,uint64)void method call against the AkitaSocial contract
       */
      updateMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateMeta(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a updateFollowerMeta(address,uint64,uint64)void method call against the AkitaSocial contract
       */
      updateFollowerMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateFollowerMeta(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a isBanned(address)bool method call against the AkitaSocial contract
       */
      isBanned(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isBanned(params)));
        resultMappers.push((v) => client.decodeReturnValue("isBanned(address)bool", v));
        return this;
      },
      /**
       * Add a getUserSocialImpact(address)uint64 method call against the AkitaSocial contract
       */
      getUserSocialImpact(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getUserSocialImpact(params)));
        resultMappers.push((v) => client.decodeReturnValue("getUserSocialImpact(address)uint64", v));
        return this;
      },
      /**
       * Add a getMetaExists(address)bool method call against the AkitaSocial contract
       */
      getMetaExists(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getMetaExists(params)));
        resultMappers.push((v) => client.decodeReturnValue("getMetaExists(address)bool", v));
        return this;
      },
      /**
       * Add a getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64) method call against the AkitaSocial contract
       */
      getMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getMeta(params)));
        resultMappers.push((v) => client.decodeReturnValue("getMeta(address)(bool,uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a getPostExists(byte[32])bool method call against the AkitaSocial contract
       */
      getPostExists(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getPostExists(params)));
        resultMappers.push((v) => client.decodeReturnValue("getPostExists(byte[32])bool", v));
        return this;
      },
      /**
       * Add a getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[]) method call against the AkitaSocial contract
       */
      getPost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getPost(params)));
        resultMappers.push((v) => client.decodeReturnValue("getPost(byte[32])(address,uint64,uint64,bool,uint64,bool,uint8,byte[])", v));
        return this;
      },
      /**
       * Add a getVote(address,byte[32])(uint64,bool) method call against the AkitaSocial contract
       */
      getVote(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getVote(params)));
        resultMappers.push((v) => client.decodeReturnValue("getVote(address,byte[32])(uint64,bool)", v));
        return this;
      },
      /**
       * Add a getVotes((address,byte[32])[])(uint64,bool)[] method call against the AkitaSocial contract
       */
      getVotes(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getVotes(params)));
        resultMappers.push((v) => client.decodeReturnValue("getVotes((address,byte[32])[])(uint64,bool)[]", v));
        return this;
      },
      /**
       * Add a getReactionExists(byte[32],uint64)bool method call against the AkitaSocial contract
       */
      getReactionExists(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getReactionExists(params)));
        resultMappers.push((v) => client.decodeReturnValue("getReactionExists(byte[32],uint64)bool", v));
        return this;
      },
      /**
       * Add a mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64) method call against the AkitaSocial contract
       */
      mbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 method call against the AkitaSocial contract
       */
      payWallMbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.payWallMbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64", v));
        return this;
      },
      /**
       * Add a checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64) method call against the AkitaSocial contract
       */
      checkTipMbrRequirements(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.checkTipMbrRequirements(params)));
        resultMappers.push((v) => client.decodeReturnValue("checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)", v));
        return this;
      },
      /**
       * Add a updateAkitaDAOEscrow(uint64)void method call against the AkitaSocial contract
       */
      updateAkitaDaoEscrow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDaoEscrow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the AkitaSocial contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a opUp()void method call against the AkitaSocial contract
       */
      opUp(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
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
      /**
       * Add a clear state call to the AkitaSocial contract
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

// src/generated/AkitaSocialGraphClient.ts
import { getArc56ReturnValue as getArc56ReturnValue2, getABIStructFromABITuple as getABIStructFromABITuple2 } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient2
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory2 } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC2 = { "name": "AkitaSocialGraph", "structs": { "AkitaSocialMBRData": [{ "name": "follows", "type": "uint64" }, { "name": "blocks", "type": "uint64" }, { "name": "posts", "type": "uint64" }, { "name": "votes", "type": "uint64" }, { "name": "votelist", "type": "uint64" }, { "name": "reactions", "type": "uint64" }, { "name": "reactionlist", "type": "uint64" }, { "name": "meta", "type": "uint64" }, { "name": "moderators", "type": "uint64" }, { "name": "banned", "type": "uint64" }, { "name": "actions", "type": "uint64" }], "BlockListKey": [{ "name": "user", "type": "byte[16]" }, { "name": "blocked", "type": "byte[16]" }], "FollowsKey": [{ "name": "user", "type": "byte[16]" }, { "name": "follower", "type": "byte[16]" }], "ViewPayWallValue": [{ "name": "userPayInfo", "type": "(uint8,uint64,uint64)[]" }, { "name": "agentPayInfo", "type": "(uint8,uint64,uint64)[]" }], "tipMBRInfo": [{ "name": "type", "type": "uint8" }, { "name": "arc58", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "uint64", "name": "akitaDao", "desc": "The Akita DAO app ID" }, { "type": "string", "name": "version", "desc": "The version string for this contract" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "desc": "Create method to initialize the contract with the DAO reference", "events": [], "recommendations": {} }, { "name": "block", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unblock", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "gatedFollow", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "appl", "name": "gateTxn" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "follow", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unfollow", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "isBlocked", "args": [{ "type": "address", "name": "user" }, { "type": "address", "name": "blocked" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "isFollowing", "args": [{ "type": "address", "name": "follower" }, { "type": "address", "name": "user" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getFollowIndex", "args": [{ "type": "address", "name": "follower" }, { "type": "address", "name": "user" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "mbr", "args": [{ "type": "byte[]", "name": "ref" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)", "struct": "AkitaSocialMBRData" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "payWallMbr", "args": [{ "type": "((uint8,uint64,uint64)[],(uint8,uint64,uint64)[])", "struct": "ViewPayWallValue", "name": "paywall" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "checkTipMbrRequirements", "args": [{ "type": "uint64", "name": "akitaDAO" }, { "type": "address", "name": "creator" }, { "type": "uint64", "name": "wallet" }], "returns": { "type": "(uint8,uint64)", "struct": "tipMBRInfo" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "follows": { "keyType": "FollowsKey", "valueType": "uint64", "desc": "Who follows who - key is {user, follower}, value is the follow index", "prefix": "Zg==" }, "blocks": { "keyType": "BlockListKey", "valueType": "AVMBytes", "desc": "All the blocks on the network", "prefix": "Yg==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [1441], "errorMessage": "Already following this user" }, { "pc": [749], "errorMessage": "Box must have value" }, { "pc": [959, 1128, 1327], "errorMessage": "Bytes has valid prefix" }, { "pc": [476], "errorMessage": "Gate check failed" }, { "pc": [1042], "errorMessage": "Invalid app upgrade" }, { "pc": [289, 498, 560], "errorMessage": "Invalid payment" }, { "pc": [1172, 1205, 1243, 1276], "errorMessage": "Length must be 16" }, { "pc": [598], "errorMessage": "Not following this user" }, { "pc": [68], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [197], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [1032, 1073], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [262, 318, 583, 1392], "errorMessage": "This account is banned" }, { "pc": [1407], "errorMessage": "This account is blocked by the user" }, { "pc": [538], "errorMessage": "This has a gate" }, { "pc": [1424], "errorMessage": "This is an automated account" }, { "pc": [268], "errorMessage": "You cannot block yourself" }, { "pc": [1413], "errorMessage": "You cannot follow yourself" }, { "pc": [1028, 1071], "errorMessage": "application exists" }, { "pc": [397, 1020, 1064, 1085, 1285, 1341], "errorMessage": "check GlobalState exists" }, { "pc": [1333], "errorMessage": "invalid number of bytes for (bool1,uint64,uint64,uint64,uint64,uint64,uint64,bool1,uint64,uint64,uint64)" }, { "pc": [771], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [224, 1011], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [964, 1133], "errorMessage": "invalid number of bytes for bool8" }, { "pc": [209, 839, 858, 1057], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [255, 311, 386, 529, 576, 653, 661, 691, 699, 731, 739, 849], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [375], "errorMessage": "transaction type is appl" }, { "pc": [247, 363, 521], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDE2IDMyCiAgICBieXRlY2Jsb2NrIDB4MTUxZjdjNzUgImFraXRhX2RhbyIgIiIgImIiICJmIiAic2FsIiAidmVyc2lvbiIgInBhbCIgIndhbGxldCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsR3JhcGggZXh0ZW5kcyBjbGFzc2VzKEJhc2VTb2NpYWwsIFVwZ3JhZGVhYmxlQWtpdGFCYXNlQ29udHJhY3QpIHsKICAgIHB1c2hieXRlcyAweGVhOTE4MGRkIC8vIG1ldGhvZCAidXBkYXRlKHN0cmluZyl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggbWFpbl91cGRhdGVfcm91dGVANAoKbWFpbl9zd2l0Y2hfY2FzZV9uZXh0QDU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTQKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbEdyYXBoIGV4dGVuZHMgY2xhc3NlcyhCYXNlU29jaWFsLCBVcGdyYWRlYWJsZUFraXRhQmFzZUNvbnRyYWN0KSB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGJ6IG1haW5fY3JlYXRlX05vT3BAMjEKICAgIHB1c2hieXRlc3MgMHhiNTljOGE1NCAweGFlZWJiMzc4IDB4ODY2NzU0OTQgMHg0YjZmOTA3ZiAweDE2MWIzYTdhIDB4NDMwMzY2OGUgMHhlYjYyZjUwOCAweDA5ODM4MGE0IDB4OTJlNmRkM2IgMHhhMTM0YTI3OCAweDM0NDE3NWYwIDB4MzNlOTJjOTQgMHg4NTRkZWRlMCAvLyBtZXRob2QgImJsb2NrKHBheSxhZGRyZXNzKXZvaWQiLCBtZXRob2QgInVuYmxvY2soYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJnYXRlZEZvbGxvdyhwYXksYXBwbCxhZGRyZXNzKXZvaWQiLCBtZXRob2QgImZvbGxvdyhwYXksYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJ1bmZvbGxvdyhhZGRyZXNzKXZvaWQiLCBtZXRob2QgImlzQmxvY2tlZChhZGRyZXNzLGFkZHJlc3MpYm9vbCIsIG1ldGhvZCAiaXNGb2xsb3dpbmcoYWRkcmVzcyxhZGRyZXNzKWJvb2wiLCBtZXRob2QgImdldEZvbGxvd0luZGV4KGFkZHJlc3MsYWRkcmVzcyl1aW50NjQiLCBtZXRob2QgIm1icihieXRlW10pKHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQpIiwgbWV0aG9kICJwYXlXYWxsTWJyKCgodWludDgsdWludDY0LHVpbnQ2NClbXSwodWludDgsdWludDY0LHVpbnQ2NClbXSkpdWludDY0IiwgbWV0aG9kICJjaGVja1RpcE1iclJlcXVpcmVtZW50cyh1aW50NjQsYWRkcmVzcyx1aW50NjQpKHVpbnQ4LHVpbnQ2NCkiLCBtZXRob2QgInVwZGF0ZUFraXRhREFPKHVpbnQ2NCl2b2lkIiwgbWV0aG9kICJvcFVwKCl2b2lkIgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggYmxvY2sgdW5ibG9jayBnYXRlZEZvbGxvdyBmb2xsb3cgdW5mb2xsb3cgaXNCbG9ja2VkIGlzRm9sbG93aW5nIGdldEZvbGxvd0luZGV4IG1iciBwYXlXYWxsTWJyIGNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzIHVwZGF0ZUFraXRhREFPIG1haW5fb3BVcF9yb3V0ZUAxOQogICAgZXJyCgptYWluX29wVXBfcm91dGVAMTk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MwogICAgLy8gb3BVcCgpOiB2b2lkIHsgfQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfTm9PcEAyMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsR3JhcGggZXh0ZW5kcyBjbGFzc2VzKEJhc2VTb2NpYWwsIFVwZ3JhZGVhYmxlQWtpdGFCYXNlQ29udHJhY3QpIHsKICAgIHB1c2hieXRlcyAweDZmOTgxN2Y2IC8vIG1ldGhvZCAiY3JlYXRlKHVpbnQ2NCxzdHJpbmcpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGNyZWF0ZQogICAgZXJyCgptYWluX3VwZGF0ZV9yb3V0ZUA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgICYmCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIG11c3QgYmUgVXBkYXRlQXBwbGljYXRpb24gJiYgY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgYiB1cGRhdGUKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6OkFraXRhU29jaWFsR3JhcGguY3JlYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKY3JlYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjIxCiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MjMKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURhbwogICAgdW5jb3ZlciAyCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIGJ5dGVjIDYgLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MjQKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIHN3YXAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MjEKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjpBa2l0YVNvY2lhbEdyYXBoLmJsb2NrW3JvdXRpbmddKCkgLT4gdm9pZDoKYmxvY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6OTYKICAgIC8vIGJsb2NrKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYWRkcmVzczogQWNjb3VudCk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo5NwogICAgLy8gYXNzZXJ0KCF0aGlzLmlzQmFubmVkKFR4bi5zZW5kZXIpLCBFUlJfQkFOTkVEKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBpc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo5OAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgIT09IGFkZHJlc3MsIEVSUl9TRUxGX0JMT0NLKQogICAgdHhuIFNlbmRlcgogICAgZGlnIDEKICAgICE9CiAgICBhc3NlcnQgLy8gWW91IGNhbm5vdCBibG9jayB5b3Vyc2VsZgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEwMC0xMDcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5ibG9ja3MKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDEKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTAzCiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEwMC0xMDcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5ibG9ja3MKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTA0CiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuYmxvY2tzCiAgICBieXRlY18yIC8vICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgOCAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEwMC0xMDcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5ibG9ja3MKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTA5CiAgICAvLyBjb25zdCBibG9ja3NLZXkgPSB0aGlzLmJsayhUeG4uc2VuZGVyLCBhZGRyZXNzKQogICAgdHhuIFNlbmRlcgogICAgc3dhcAogICAgY2FsbHN1YiBibGsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMAogICAgLy8gYmxvY2tzID0gQm94TWFwPEJsb2NrTGlzdEtleSwgYnl0ZXM8MD4+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEJsb2NrcyB9KQogICAgYnl0ZWNfMyAvLyAiYiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjExMAogICAgLy8gdGhpcy5ibG9ja3MoYmxvY2tzS2V5KS5jcmVhdGUoKQogICAgaW50Y18wIC8vIDAKICAgIGJveF9jcmVhdGUKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjk2CiAgICAvLyBibG9jayhtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6OkFraXRhU29jaWFsR3JhcGgudW5ibG9ja1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVuYmxvY2s6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTEzCiAgICAvLyB1bmJsb2NrKGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjExNAogICAgLy8gYXNzZXJ0KCF0aGlzLmlzQmFubmVkKFR4bi5zZW5kZXIpLCBFUlJfQkFOTkVEKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBpc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMTYKICAgIC8vIGNvbnN0IGJsb2Nrc0tleSA9IHRoaXMuYmxrKFR4bi5zZW5kZXIsIGFkZHJlc3MpCiAgICB0eG4gU2VuZGVyCiAgICBzd2FwCiAgICBjYWxsc3ViIGJsawogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjMwCiAgICAvLyBibG9ja3MgPSBCb3hNYXA8QmxvY2tMaXN0S2V5LCBieXRlczwwPj4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4QmxvY2tzIH0pCiAgICBieXRlY18zIC8vICJiIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTE3CiAgICAvLyB0aGlzLmJsb2NrcyhibG9ja3NLZXkpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMTktMTI0CiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuYmxvY2tzCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEyMQogICAgLy8gcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTIyCiAgICAvLyBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuYmxvY2tzCiAgICBieXRlY18yIC8vICIiCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIHB1c2hpbnQgOCAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMTktMTIzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuYmxvY2tzCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTE5LTEyNAogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmJsb2NrcwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTEzCiAgICAvLyB1bmJsb2NrKGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6OkFraXRhU29jaWFsR3JhcGguZ2F0ZWRGb2xsb3dbcm91dGluZ10oKSAtPiB2b2lkOgpnYXRlZEZvbGxvdzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMjctMTMxCiAgICAvLyBnYXRlZEZvbGxvdygKICAgIC8vICAgbWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBnYXRlVHhuOiBndHhuLkFwcGxpY2F0aW9uQ2FsbFR4biwKICAgIC8vICAgYWRkcmVzczogQWNjb3VudAogICAgLy8gKTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgcHVzaGludCAyIC8vIDIKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwbiAyCiAgICBndHhucyBUeXBlRW51bQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBhcHBsCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEzMgogICAgLy8gY29uc3QgeyBmb2xsb3dHYXRlSUQgfSA9IHRoaXMuZ2V0TWV0YShhZGRyZXNzKQogICAgY2FsbHN1YiBnZXRNZXRhCiAgICBleHRyYWN0IDUwIDgKICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMzMKICAgIC8vIGFzc2VydChnYXRlQ2hlY2soZ2F0ZVR4biwgdGhpcy5ha2l0YURBTy52YWx1ZSwgVHhuLnNlbmRlciwgZm9sbG93R2F0ZUlEKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEzMwogICAgLy8gYXNzZXJ0KGdhdGVDaGVjayhnYXRlVHhuLCB0aGlzLmFraXRhREFPLnZhbHVlLCBUeG4uc2VuZGVyLCBmb2xsb3dHYXRlSUQpLCBFUlJfRkFJTEVEX0dBVEUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgdHhuIFNlbmRlcgogICAgY292ZXIgMgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjkKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIHN3YXAKICAgIGd0eG5zIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDAKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIHN3YXAKICAgIHB1c2hieXRlcyAiYWFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjkKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIHB1c2hpbnQgNDAgLy8gNDAKICAgIGV4dHJhY3RfdWludDY0CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjktMjMwCiAgICAvLyBnYXRlVHhuLmFwcElkID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUpICYmCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICBieiBnYXRlZEZvbGxvd19ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjMwCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICBkaWcgMwogICAgZ3R4bnMgT25Db21wbGV0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOS0yMzAKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIC8vIGdhdGVUeG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AgJiYKICAgIGJueiBnYXRlZEZvbGxvd19ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjMxCiAgICAvLyBnYXRlVHhuLm51bUFwcEFyZ3MgPT09IDQgJiYKICAgIGRpZyAzCiAgICBndHhucyBOdW1BcHBBcmdzCiAgICBwdXNoaW50IDQgLy8gNAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI5LTIzMQogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgLy8gZ2F0ZVR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCAmJgogICAgLy8gZ2F0ZVR4bi5udW1BcHBBcmdzID09PSA0ICYmCiAgICBieiBnYXRlZEZvbGxvd19ib29sX2ZhbHNlQDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjMyCiAgICAvLyBnYXRlVHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBHYXRlLnByb3RvdHlwZS5tdXN0Q2hlY2s+KCkgJiYKICAgIGRpZyAzCiAgICBpbnRjXzAgLy8gMAogICAgZ3R4bnNhcyBBcHBsaWNhdGlvbkFyZ3MKICAgIHB1c2hieXRlcyAweDQzOTIyNjU1IC8vIG1ldGhvZCAibXVzdENoZWNrKGFkZHJlc3MsdWludDY0LGJ5dGVbXVtdKXZvaWQiCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyMjktMjMyCiAgICAvLyBnYXRlVHhuLmFwcElkID09PSBBcHBsaWNhdGlvbihnZXRBa2l0YUFwcExpc3QoYWtpdGFEQU8pLmdhdGUpICYmCiAgICAvLyBnYXRlVHhuLm9uQ29tcGxldGlvbiA9PT0gT25Db21wbGV0ZUFjdGlvbi5Ob09wICYmCiAgICAvLyBnYXRlVHhuLm51bUFwcEFyZ3MgPT09IDQgJiYKICAgIC8vIGdhdGVUeG4uYXBwQXJncygwKSA9PT0gbWV0aG9kU2VsZWN0b3I8dHlwZW9mIEdhdGUucHJvdG90eXBlLm11c3RDaGVjaz4oKSAmJgogICAgYnogZ2F0ZWRGb2xsb3dfYm9vbF9mYWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIzMwogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDEpID09PSBuZXcgQWRkcmVzcyhjYWxsZXIpLmJ5dGVzICYmCiAgICBkaWcgMwogICAgaW50Y18xIC8vIDEKICAgIGd0eG5zYXMgQXBwbGljYXRpb25BcmdzCiAgICBkaWcgMQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjI5LTIzMwogICAgLy8gZ2F0ZVR4bi5hcHBJZCA9PT0gQXBwbGljYXRpb24oZ2V0QWtpdGFBcHBMaXN0KGFraXRhREFPKS5nYXRlKSAmJgogICAgLy8gZ2F0ZVR4bi5vbkNvbXBsZXRpb24gPT09IE9uQ29tcGxldGVBY3Rpb24uTm9PcCAmJgogICAgLy8gZ2F0ZVR4bi5udW1BcHBBcmdzID09PSA0ICYmCiAgICAvLyBnYXRlVHhuLmFwcEFyZ3MoMCkgPT09IG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBHYXRlLnByb3RvdHlwZS5tdXN0Q2hlY2s+KCkgJiYKICAgIC8vIGdhdGVUeG4uYXBwQXJncygxKSA9PT0gbmV3IEFkZHJlc3MoY2FsbGVyKS5ieXRlcyAmJgogICAgYnogZ2F0ZWRGb2xsb3dfYm9vbF9mYWxzZUA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIzNAogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDIpID09PSBpdG9iKGlkKQogICAgZGlnIDMKICAgIHB1c2hpbnQgMiAvLyAyCiAgICBndHhuc2FzIEFwcGxpY2F0aW9uQXJncwogICAgZGlnIDIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjIyOS0yMzQKICAgIC8vIGdhdGVUeG4uYXBwSWQgPT09IEFwcGxpY2F0aW9uKGdldEFraXRhQXBwTGlzdChha2l0YURBTykuZ2F0ZSkgJiYKICAgIC8vIGdhdGVUeG4ub25Db21wbGV0aW9uID09PSBPbkNvbXBsZXRlQWN0aW9uLk5vT3AgJiYKICAgIC8vIGdhdGVUeG4ubnVtQXBwQXJncyA9PT0gNCAmJgogICAgLy8gZ2F0ZVR4bi5hcHBBcmdzKDApID09PSBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgR2F0ZS5wcm90b3R5cGUubXVzdENoZWNrPigpICYmCiAgICAvLyBnYXRlVHhuLmFwcEFyZ3MoMSkgPT09IG5ldyBBZGRyZXNzKGNhbGxlcikuYnl0ZXMgJiYKICAgIC8vIGdhdGVUeG4uYXBwQXJncygyKSA9PT0gaXRvYihpZCkKICAgIGJ6IGdhdGVkRm9sbG93X2Jvb2xfZmFsc2VAOAogICAgaW50Y18xIC8vIDEKCmdhdGVkRm9sbG93X2Jvb2xfbWVyZ2VAOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxMzMKICAgIC8vIGFzc2VydChnYXRlQ2hlY2soZ2F0ZVR4biwgdGhpcy5ha2l0YURBTy52YWx1ZSwgVHhuLnNlbmRlciwgZm9sbG93R2F0ZUlEKSwgRVJSX0ZBSUxFRF9HQVRFKQogICAgYXNzZXJ0IC8vIEdhdGUgY2hlY2sgZmFpbGVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTM1CiAgICAvLyBjb25zdCB7IGZvbGxvd3MgfSA9IHRoaXMubWJyKEJ5dGVzKCcnKSkKICAgIGJ5dGVjXzIgLy8gIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTM2LTE0MwogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBmb2xsb3dzCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyA1CiAgICBkdXAKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTM5CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEzNi0xNDMKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogZm9sbG93cwogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgc3dhcAogICAgZ3R4bnMgQW1vdW50CiAgICB1bmNvdmVyIDIKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE0NQogICAgLy8gdGhpcy5jcmVhdGVGb2xsb3coVHhuLnNlbmRlciwgYWRkcmVzcykKICAgIHR4biBTZW5kZXIKICAgIGRpZyAzCiAgICBjYWxsc3ViIGNyZWF0ZUZvbGxvdwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjEyNy0xMzEKICAgIC8vIGdhdGVkRm9sbG93KAogICAgLy8gICBtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIGdhdGVUeG46IGd0eG4uQXBwbGljYXRpb25DYWxsVHhuLAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmdhdGVkRm9sbG93X2Jvb2xfZmFsc2VAODoKICAgIGludGNfMCAvLyAwCiAgICBiIGdhdGVkRm9sbG93X2Jvb2xfbWVyZ2VAOQoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5mb2xsb3dbcm91dGluZ10oKSAtPiB2b2lkOgpmb2xsb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTQ4CiAgICAvLyBmb2xsb3cobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhZGRyZXNzOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE0OQogICAgLy8gY29uc3QgeyBmb2xsb3dHYXRlSUQgfSA9IHRoaXMuZ2V0TWV0YShhZGRyZXNzKQogICAgZHVwCiAgICBjYWxsc3ViIGdldE1ldGEKICAgIHB1c2hpbnQgNTAgLy8gNTAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTUwCiAgICAvLyBhc3NlcnQoZm9sbG93R2F0ZUlEID09PSAwLCBFUlJfSEFTX0dBVEUpCiAgICAhCiAgICBhc3NlcnQgLy8gVGhpcyBoYXMgYSBnYXRlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTUyCiAgICAvLyBjb25zdCB7IGZvbGxvd3MgfSA9IHRoaXMubWJyKEJ5dGVzKCcnKSkKICAgIGJ5dGVjXzIgLy8gIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTUzLTE2MAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIG1iclBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiBmb2xsb3dzCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyAyCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE1NgogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNTMtMTYwCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGZvbGxvd3MKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMwogICAgZ3R4bnMgQW1vdW50CiAgICB1bmNvdmVyIDIKICAgID09CiAgICAmJgogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE2MgogICAgLy8gdGhpcy5jcmVhdGVGb2xsb3coVHhuLnNlbmRlciwgYWRkcmVzcykKICAgIHR4biBTZW5kZXIKICAgIHN3YXAKICAgIGNhbGxzdWIgY3JlYXRlRm9sbG93CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTQ4CiAgICAvLyBmb2xsb3cobWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhZGRyZXNzOiBBY2NvdW50KTogdm9pZCB7CiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjpBa2l0YVNvY2lhbEdyYXBoLnVuZm9sbG93W3JvdXRpbmddKCkgLT4gdm9pZDoKdW5mb2xsb3c6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTY1CiAgICAvLyB1bmZvbGxvdyhhZGRyZXNzOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNjYKICAgIC8vIGFzc2VydCghdGhpcy5pc0Jhbm5lZChUeG4uc2VuZGVyKSwgRVJSX0JBTk5FRCkKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgaXNCYW5uZWQKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmFubmVkCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTY4CiAgICAvLyBjb25zdCBmb2xsb3dzS2V5ID0gdGhpcy5mbHcoYWRkcmVzcywgVHhuLnNlbmRlcikKICAgIGR1cAogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBmbHcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoyOAogICAgLy8gZm9sbG93cyA9IEJveE1hcDxGb2xsb3dzS2V5LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEZvbGxvd3MgfSkKICAgIGJ5dGVjIDQgLy8gImYiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNzAKICAgIC8vIGFzc2VydCh0aGlzLmZvbGxvd3MoZm9sbG93c0tleSkuZXhpc3RzLCBFUlJfTk9UX0ZPTExPV0lORykKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gTm90IGZvbGxvd2luZyB0aGlzIHVzZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNzIKICAgIC8vIGNvbnN0IHsgZm9sbG93ZXJDb3VudCwgZm9sbG93ZXJJbmRleCB9ID0gdGhpcy5nZXRNZXRhKGFkZHJlc3MpCiAgICBkaWcgMQogICAgY2FsbHN1YiBnZXRNZXRhCiAgICBkdXAKICAgIHB1c2hpbnQgNDEgLy8gNDEKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBwdXNoaW50IDMzIC8vIDMzCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE3NAogICAgLy8gdGhpcy51cGRhdGVGb2xsb3dlck1ldGEoYWRkcmVzcywgZm9sbG93ZXJJbmRleCwgZm9sbG93ZXJDb3VudCAtIDEpCiAgICBzd2FwCiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgdW5jb3ZlciAzCiAgICBjb3ZlciAyCiAgICBjYWxsc3ViIHVwZGF0ZUZvbGxvd2VyTWV0YQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE3NQogICAgLy8gdGhpcy5mb2xsb3dzKGZvbGxvd3NLZXkpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNzctMTgyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKEJ5dGVzKCcnKSkuZm9sbG93cwogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxNzkKICAgIC8vIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE4MAogICAgLy8gYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmZvbGxvd3MKICAgIGJ5dGVjXzIgLy8gIiIKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE3Ny0xODEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5tYnIoQnl0ZXMoJycpKS5mb2xsb3dzCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTc3LTE4MgogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icihCeXRlcygnJykpLmZvbGxvd3MKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE2NQogICAgLy8gdW5mb2xsb3coYWRkcmVzczogQWNjb3VudCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5pc0Jsb2NrZWRbcm91dGluZ10oKSAtPiB2b2lkOgppc0Jsb2NrZWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTg1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTg3CiAgICAvLyBjb25zdCBibG9ja3NLZXkgPSB0aGlzLmJsayh1c2VyLCBibG9ja2VkKQogICAgY2FsbHN1YiBibGsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMAogICAgLy8gYmxvY2tzID0gQm94TWFwPEJsb2NrTGlzdEtleSwgYnl0ZXM8MD4+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEJsb2NrcyB9KQogICAgYnl0ZWNfMyAvLyAiYiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE4OAogICAgLy8gcmV0dXJuIHRoaXMuYmxvY2tzKGJsb2Nrc0tleSkuZXhpc3RzCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxODUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5pc0ZvbGxvd2luZ1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmlzRm9sbG93aW5nOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE5MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE5MwogICAgLy8gY29uc3QgZm9sbG93c0tleSA9IHRoaXMuZmx3KHVzZXIsIGZvbGxvd2VyKQogICAgc3dhcAogICAgY2FsbHN1YiBmbHcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoyOAogICAgLy8gZm9sbG93cyA9IEJveE1hcDxGb2xsb3dzS2V5LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEZvbGxvd3MgfSkKICAgIGJ5dGVjIDQgLy8gImYiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxOTQKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd3MoZm9sbG93c0tleSkuZXhpc3RzCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxOTEKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5nZXRGb2xsb3dJbmRleFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmdldEZvbGxvd0luZGV4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE5NwogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE5OQogICAgLy8gY29uc3QgZm9sbG93c0tleSA9IHRoaXMuZmx3KHVzZXIsIGZvbGxvd2VyKQogICAgc3dhcAogICAgY2FsbHN1YiBmbHcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoyOAogICAgLy8gZm9sbG93cyA9IEJveE1hcDxGb2xsb3dzS2V5LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEZvbGxvd3MgfSkKICAgIGJ5dGVjIDQgLy8gImYiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoyMDAKICAgIC8vIHJldHVybiB0aGlzLmZvbGxvd3MoZm9sbG93c0tleSkudmFsdWUKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MTk3CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGl0b2IKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwubWJyW3JvdXRpbmddKCkgLT4gdm9pZDoKbWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE0CiAgICAvLyBtYnIocmVmOiBieXRlcyk6IEFraXRhU29jaWFsTUJSRGF0YSB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgcHVzaGludCAyIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5tYnIKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwucGF5V2FsbE1icltyb3V0aW5nXSgpIC0+IHZvaWQ6CnBheVdhbGxNYnI6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzAKICAgIC8vIHBheVdhbGxNYnIocGF5d2FsbDogVmlld1BheVdhbGxWYWx1ZSk6IHVpbnQ2NCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzMKICAgIC8vIFBheVdhbGxQYXlPcHRpb25TaXplICogKHBheXdhbGwuYWdlbnRQYXlJbmZvLmxlbmd0aCArIHBheXdhbGwudXNlclBheUluZm8ubGVuZ3RoKQogICAgZHVwCiAgICBwdXNoaW50IDIgLy8gMgogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAxCiAgICBsZW4KICAgIGRpZyAyCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGRpZyAyCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHVuY292ZXIgMwogICAgc3dhcAogICAgdW5jb3ZlciAzCiAgICBzdWJzdHJpbmczCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMi0zNAogICAgLy8gQm94Q29zdFBlckJ5dGUgKiAoCiAgICAvLyAgIFBheVdhbGxQYXlPcHRpb25TaXplICogKHBheXdhbGwuYWdlbnRQYXlJbmZvLmxlbmd0aCArIHBheXdhbGwudXNlclBheUluZm8ubGVuZ3RoKQogICAgLy8gKQogICAgcHVzaGludCA2ODAwIC8vIDY4MDAKICAgICoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMQogICAgLy8gcmV0dXJuIE1pblBheVdhbGxNQlIgKyAoCiAgICBwdXNoaW50IDUyMDAgLy8gNTIwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjMxLTM1CiAgICAvLyByZXR1cm4gTWluUGF5V2FsbE1CUiArICgKICAgIC8vICAgQm94Q29zdFBlckJ5dGUgKiAoCiAgICAvLyAgICAgUGF5V2FsbFBheU9wdGlvblNpemUgKiAocGF5d2FsbC5hZ2VudFBheUluZm8ubGVuZ3RoICsgcGF5d2FsbC51c2VyUGF5SW5mby5sZW5ndGgpCiAgICAvLyAgICkKICAgIC8vICkKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czozMAogICAgLy8gcGF5V2FsbE1icihwYXl3YWxsOiBWaWV3UGF5V2FsbFZhbHVlKTogdWludDY0IHsKICAgIGl0b2IKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNbcm91dGluZ10oKSAtPiB2b2lkOgpjaGVja1RpcE1iclJlcXVpcmVtZW50czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MQogICAgLy8gY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBjcmVhdG9yOiBBY2NvdW50LCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogdGlwTUJSSW5mbyB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgZHVwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjk0CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgc3dhcAogICAgcHVzaGJ5dGVzICJha2l0YV9hc3NldHMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTIKICAgIC8vIGNvbnN0IGFrdGEgPSBBc3NldChnZXRBa2l0YUFzc2V0cyhha2l0YURBTykuYWt0YSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjU0CiAgICAvLyBpZiAoIWNyZWF0b3IuaXNPcHRlZEluKGFrdGEpICYmIHdhbGxldC5pZCAhPT0gMCkgewogICAgYXNzZXRfaG9sZGluZ19nZXQgQXNzZXRCYWxhbmNlCiAgICBidXJ5IDEKICAgIGJueiBjaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pZl9lbHNlQDYKICAgIGR1cAogICAgYnogY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaWZfZWxzZUA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MzktNDgKICAgIC8vIHJldHVybiBhYmlDYWxsPHR5cGVvZiBBYnN0cmFjdGVkQWNjb3VudC5wcm90b3R5cGUuYXJjNThfY2FuQ2FsbD4oewogICAgLy8gICBhcHBJZCwKICAgIC8vICAgYXJnczogWwogICAgLy8gICAgIGdldFBsdWdpbkFwcExpc3QoYWtpdGFEQU8pLm9wdGluLAogICAgLy8gICAgIHRydWUsCiAgICAvLyAgICAgR2xvYmFsLnplcm9BZGRyZXNzLAogICAgLy8gICAgICcnLAogICAgLy8gICAgIG1ldGhvZFNlbGVjdG9yPHR5cGVvZiBPcHRJblBsdWdpbi5wcm90b3R5cGUub3B0SW4+KCkKICAgIC8vICAgXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NTAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBkaWcgMQogICAgYnl0ZWMgNyAvLyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjQyCiAgICAvLyBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIGV4dHJhY3QgMCA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDQKICAgIC8vIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIGdsb2JhbCBaZXJvQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjM5LTQ4CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2NhbkNhbGw+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIC8vICAgICAnJywKICAgIC8vICAgICBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPigpCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHg0NzI3YWYyMSAvLyBtZXRob2QgImFyYzU4X2NhbkNhbGwodWludDY0LGJvb2wsYWRkcmVzcyxzdHJpbmcsYnl0ZVs0XSlib29sIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDMKICAgIC8vIHRydWUsCiAgICBwdXNoYnl0ZXMgMHg4MAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NDUKICAgIC8vICcnLAogICAgcHVzaGJ5dGVzIDB4MDAwMAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo0NgogICAgLy8gbWV0aG9kU2VsZWN0b3I8dHlwZW9mIE9wdEluUGx1Z2luLnByb3RvdHlwZS5vcHRJbj4oKQogICAgcHVzaGJ5dGVzIDB4NjgzNWUzYmMgLy8gbWV0aG9kICJvcHRJbih1aW50NjQsYm9vbCx1aW50NjRbXSxwYXkpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBkdXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjM5LTQ4CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWJzdHJhY3RlZEFjY291bnQucHJvdG90eXBlLmFyYzU4X2NhbkNhbGw+KHsKICAgIC8vICAgYXBwSWQsCiAgICAvLyAgIGFyZ3M6IFsKICAgIC8vICAgICBnZXRQbHVnaW5BcHBMaXN0KGFraXRhREFPKS5vcHRpbiwKICAgIC8vICAgICB0cnVlLAogICAgLy8gICAgIEdsb2JhbC56ZXJvQWRkcmVzcywKICAgIC8vICAgICAnJywKICAgIC8vICAgICBtZXRob2RTZWxlY3Rvcjx0eXBlb2YgT3B0SW5QbHVnaW4ucHJvdG90eXBlLm9wdEluPigpCiAgICAvLyAgIF0KICAgIC8vIH0pLnJldHVyblZhbHVlCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1NgogICAgLy8gaWYgKGNhbkNhbGxBcmM1OE9wdEluKSB7CiAgICBieiBjaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1OQogICAgLy8gYXJjNTg6IEdsb2JhbC5hc3NldE9wdEluTWluQmFsYW5jZQogICAgZ2xvYmFsIEFzc2V0T3B0SW5NaW5CYWxhbmNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTctNjAKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IFRpcFNlbmRUeXBlQVJDNTgsCiAgICAvLyAgIGFyYzU4OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIC8vIH0KICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1OAogICAgLy8gdHlwZTogVGlwU2VuZFR5cGVBUkM1OCwKICAgIHB1c2hieXRlcyAweDE0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTctNjAKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IFRpcFNlbmRUeXBlQVJDNTgsCiAgICAvLyAgIGFyYzU4OiBHbG9iYWwuYXNzZXRPcHRJbk1pbkJhbGFuY2UKICAgIC8vIH0KICAgIHN3YXAKICAgIGNvbmNhdAoKY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6OkJhc2VTb2NpYWwuY2hlY2tUaXBNYnJSZXF1aXJlbWVudHNANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo1MQogICAgLy8gY2hlY2tUaXBNYnJSZXF1aXJlbWVudHMoYWtpdGFEQU86IEFwcGxpY2F0aW9uLCBjcmVhdG9yOiBBY2NvdW50LCB3YWxsZXQ6IEFwcGxpY2F0aW9uKTogdGlwTUJSSW5mbyB7CiAgICBieXRlY18wIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgpjaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pZl9lbHNlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NjQtNjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGU6IFRpcFNlbmRUeXBlRGlyZWN0LAogICAgLy8gICBhcmM1ODogMAogICAgLy8gfQogICAgcHVzaGJ5dGVzIDB4MGEwMDAwMDAwMDAwMDAwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6NTEKICAgIC8vIGNoZWNrVGlwTWJyUmVxdWlyZW1lbnRzKGFraXRhREFPOiBBcHBsaWNhdGlvbiwgY3JlYXRvcjogQWNjb3VudCwgd2FsbGV0OiBBcHBsaWNhdGlvbik6IHRpcE1CUkluZm8gewogICAgYiBjaGVja1RpcE1iclJlcXVpcmVtZW50c19hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czo6QmFzZVNvY2lhbC5jaGVja1RpcE1iclJlcXVpcmVtZW50c0A3CgoKLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6OlVwZ3JhZGVhYmxlQWtpdGFCYXNlQ29udHJhY3QudXBkYXRlW3JvdXRpbmddKCkgLT4gdm9pZDoKdXBkYXRlOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIHB1c2hpbnQgMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBkdXAKICAgIGJ5dGVjIDggLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUwCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgdW5jb3ZlciAyCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjUwCiAgICAvLyBjb25zdCBbcGx1Z2luQXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1BsdWdpbkFwcExpc3QpKQogICAgYnl0ZWMgNyAvLyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTEKICAgIC8vIGNvbnN0IHVwZGF0ZVBsdWdpbiA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkudXBkYXRlCiAgICBpbnRjXzIgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MgogICAgLy8gYXNzZXJ0KEdsb2JhbC5jYWxsZXJBcHBsaWNhdGlvbklkID09PSB1cGRhdGVQbHVnaW4sIEVSUl9JTlZBTElEX1VQR1JBREUpCiAgICBnbG9iYWwgQ2FsbGVyQXBwbGljYXRpb25JRAogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIGFwcCB1cGdyYWRlCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyNwogICAgLy8gdmVyc2lvbiA9IEdsb2JhbFN0YXRlPHN0cmluZz4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiB9KQogICAgYnl0ZWMgNiAvLyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjUzCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSBuZXdWZXJzaW9uCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDgKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGVBa2l0YURBT1tyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ5dGVjIDggLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MAogICAgLy8gdGhpcy5ha2l0YURBTy52YWx1ZSA9IGFraXRhREFPCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFraXRhREFPOiBBcHBsaWNhdGlvbik6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5pc0Jhbm5lZChhY2NvdW50OiBieXRlcykgLT4gdWludDY0Ogppc0Jhbm5lZDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMgogICAgLy8gcHJpdmF0ZSBpc0Jhbm5lZChhY2NvdW50OiBBY2NvdW50KTogYm9vbGVhbiB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMwogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzEgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMwogICAgLy8gY29uc3QgeyBtb2RlcmF0aW9uIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA1IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6MzMKICAgIC8vIGNvbnN0IHsgbW9kZXJhdGlvbiB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBwdXNoaW50IDI0IC8vIDI0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjM0LTM3CiAgICAvLyByZXR1cm4gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWxNb2RlcmF0aW9uLnByb3RvdHlwZS5pc0Jhbm5lZD4oewogICAgLy8gICBhcHBJZDogbW9kZXJhdGlvbiwKICAgIC8vICAgYXJnczogW2FjY291bnRdCiAgICAvLyB9KS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgcHVzaGJ5dGVzIDB4ODQyNjljNzggLy8gbWV0aG9kICJpc0Jhbm5lZChhZGRyZXNzKWJvb2wiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIC0xCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMCAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzEgLy8gMQogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgYm9vbDgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo6QWtpdGFTb2NpYWxHcmFwaC5ibGsodXNlckFkZHJlc3M6IGJ5dGVzLCBibG9ja2VkQWRkcmVzczogYnl0ZXMpIC0+IGJ5dGVzOgpibGs6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6NDEKICAgIC8vIHByaXZhdGUgYmxrKHVzZXJBZGRyZXNzOiBBY2NvdW50LCBibG9ja2VkQWRkcmVzczogQWNjb3VudCk6IEJsb2NrTGlzdEtleSB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo0MgogICAgLy8gY29uc3QgdXNlciA9IHVzZXJBZGRyZXNzLmJ5dGVzLnNsaWNlKDAsIDE2KS50b0ZpeGVkKHsgbGVuZ3RoOiAxNiB9KQogICAgZnJhbWVfZGlnIC0yCiAgICBsZW4KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGludGNfMiAvLyAxNgogICAgZGlnIDIKICAgID49CiAgICBpbnRjXzIgLy8gMTYKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGZyYW1lX2RpZyAtMgogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjQzCiAgICAvLyBjb25zdCBibG9ja2VkID0gYmxvY2tlZEFkZHJlc3MuYnl0ZXMuc2xpY2UoMCwgMTYpLnRvRml4ZWQoeyBsZW5ndGg6IDE2IH0pCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgaW50Y18yIC8vIDE2CiAgICBkaWcgMgogICAgPj0KICAgIGludGNfMiAvLyAxNgogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgZnJhbWVfZGlnIC0xCiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIExlbmd0aCBtdXN0IGJlIDE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6NDQKICAgIC8vIHJldHVybiB7IHVzZXIsIGJsb2NrZWQgfQogICAgY29uY2F0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6OkFraXRhU29jaWFsR3JhcGguZmx3KHVzZXI6IGJ5dGVzLCBmb2xsb3dlcjogYnl0ZXMpIC0+IGJ5dGVzOgpmbHc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6NDgKICAgIC8vIHByaXZhdGUgZmx3KHVzZXI6IEFjY291bnQsIGZvbGxvd2VyOiBBY2NvdW50KTogRm9sbG93c0tleSB7CiAgICBwcm90byAyIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo0OQogICAgLy8gY29uc3QgdXNlckJ5dGVzID0gdXNlci5ieXRlcy5zbGljZSgwLCAxNikudG9GaXhlZCh7IGxlbmd0aDogMTYgfSkKICAgIGZyYW1lX2RpZyAtMgogICAgbGVuCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBpbnRjXzIgLy8gMTYKICAgIGRpZyAyCiAgICA+PQogICAgaW50Y18yIC8vIDE2CiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBmcmFtZV9kaWcgLTIKICAgIGNvdmVyIDIKICAgIHN1YnN0cmluZzMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gTGVuZ3RoIG11c3QgYmUgMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo1MAogICAgLy8gY29uc3QgZm9sbG93ZXJCeXRlcyA9IGZvbGxvd2VyLmJ5dGVzLnNsaWNlKDAsIDE2KS50b0ZpeGVkKHsgbGVuZ3RoOiAxNiB9KQogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGludGNfMiAvLyAxNgogICAgZGlnIDIKICAgID49CiAgICBpbnRjXzIgLy8gMTYKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGZyYW1lX2RpZyAtMQogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjUxCiAgICAvLyByZXR1cm4geyB1c2VyOiB1c2VyQnl0ZXMsIGZvbGxvd2VyOiBmb2xsb3dlckJ5dGVzIH0KICAgIGNvbmNhdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjpBa2l0YVNvY2lhbEdyYXBoLmdldE1ldGEoYWRkcmVzczogYnl0ZXMpIC0+IGJ5dGVzOgpnZXRNZXRhOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjU0CiAgICAvLyBwcml2YXRlIGdldE1ldGEoYWRkcmVzczogQWNjb3VudCk6IE1ldGFWYWx1ZSB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo1NQogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMSAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjU1CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo0NQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YVNvY2lhbEFwcExpc3QpKQogICAgYnl0ZWMgNSAvLyAic2FsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjU1CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo1Ni01OQogICAgLy8gcmV0dXJuIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5nZXRNZXRhPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFthZGRyZXNzXQogICAgLy8gfSkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hieXRlcyAweDczOWVhNzBiIC8vIG1ldGhvZCAiZ2V0TWV0YShhZGRyZXNzKShib29sLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCx1aW50NjQpIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMQogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMCAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDQgMAogICAgc3dhcAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzAgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA3NCAvLyA3NAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wxLHVpbnQ2NCx1aW50NjQsdWludDY0KQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjpBa2l0YVNvY2lhbEdyYXBoLnVwZGF0ZUZvbGxvd2VyTWV0YShhY2NvdW50OiBieXRlcywgbmV3Rm9sbG93ZXJJbmRleDogdWludDY0LCBuZXdGb2xsb3dlckNvdW50OiB1aW50NjQpIC0+IHZvaWQ6CnVwZGF0ZUZvbGxvd2VyTWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo2MgogICAgLy8gcHJpdmF0ZSB1cGRhdGVGb2xsb3dlck1ldGEoYWNjb3VudDogQWNjb3VudCwgbmV3Rm9sbG93ZXJJbmRleDogdWludDY0LCBuZXdGb2xsb3dlckNvdW50OiB1aW50NjQpOiB2b2lkIHsKICAgIHByb3RvIDMgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjYzCiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18xIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6NjMKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA1IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6NjMKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjY0LTY3CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUudXBkYXRlRm9sbG93ZXJNZXRhPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFthY2NvdW50LCBuZXdGb2xsb3dlckluZGV4LCBuZXdGb2xsb3dlckNvdW50XQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo2NgogICAgLy8gYXJnczogW2FjY291bnQsIG5ld0ZvbGxvd2VySW5kZXgsIG5ld0ZvbGxvd2VyQ291bnRdCiAgICBmcmFtZV9kaWcgLTIKICAgIGl0b2IKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjY0LTY3CiAgICAvLyBhYmlDYWxsPHR5cGVvZiBBa2l0YVNvY2lhbC5wcm90b3R5cGUudXBkYXRlRm9sbG93ZXJNZXRhPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFthY2NvdW50LCBuZXdGb2xsb3dlckluZGV4LCBuZXdGb2xsb3dlckNvdW50XQogICAgLy8gfSkKICAgIHB1c2hieXRlcyAweDMzMDZiMzJhIC8vIG1ldGhvZCAidXBkYXRlRm9sbG93ZXJNZXRhKGFkZHJlc3MsdWludDY0LHVpbnQ2NCl2b2lkIgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIHN3YXAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjpBa2l0YVNvY2lhbEdyYXBoLmNyZWF0ZUZvbGxvdyhzZW5kZXI6IGJ5dGVzLCBhZGRyZXNzOiBieXRlcykgLT4gdm9pZDoKY3JlYXRlRm9sbG93OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjcwCiAgICAvLyBwcml2YXRlIGNyZWF0ZUZvbGxvdyhzZW5kZXI6IEFjY291bnQsIGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIHByb3RvIDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjcxCiAgICAvLyBhc3NlcnQoIXRoaXMuaXNCYW5uZWQoc2VuZGVyKSwgRVJSX0JBTk5FRCkKICAgIGZyYW1lX2RpZyAtMgogICAgY2FsbHN1YiBpc0Jhbm5lZAogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgYWNjb3VudCBpcyBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czoxODcKICAgIC8vIGNvbnN0IGJsb2Nrc0tleSA9IHRoaXMuYmxrKHVzZXIsIGJsb2NrZWQpCiAgICBmcmFtZV9kaWcgLTEKICAgIGZyYW1lX2RpZyAtMgogICAgY2FsbHN1YiBibGsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czozMAogICAgLy8gYmxvY2tzID0gQm94TWFwPEJsb2NrTGlzdEtleSwgYnl0ZXM8MD4+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEJsb2NrcyB9KQogICAgYnl0ZWNfMyAvLyAiYiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjE4OAogICAgLy8gcmV0dXJuIHRoaXMuYmxvY2tzKGJsb2Nrc0tleSkuZXhpc3RzCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo3MgogICAgLy8gYXNzZXJ0KCF0aGlzLmlzQmxvY2tlZChhZGRyZXNzLCBzZW5kZXIpLCBFUlJfQkxPQ0tFRCkKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYmxvY2tlZCBieSB0aGUgdXNlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjczCiAgICAvLyBhc3NlcnQoc2VuZGVyICE9PSBhZGRyZXNzLCBFUlJfU0VMRl9GT0xMT1cpCiAgICBmcmFtZV9kaWcgLTIKICAgIGZyYW1lX2RpZyAtMQogICAgIT0KICAgIGFzc2VydCAvLyBZb3UgY2Fubm90IGZvbGxvdyB5b3Vyc2VsZgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjc2CiAgICAvLyBjb25zdCB7IGF1dG9tYXRlZCB9ID0gdGhpcy5nZXRNZXRhKHNlbmRlcikKICAgIGZyYW1lX2RpZyAtMgogICAgY2FsbHN1YiBnZXRNZXRhCiAgICBwdXNoaW50IDM5MiAvLyAzOTIKICAgIGdldGJpdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjc3CiAgICAvLyBhc3NlcnQoIWF1dG9tYXRlZCwgRVJSX0FVVE9NQVRFRF9BQ0NPVU5UKQogICAgIQogICAgYXNzZXJ0IC8vIFRoaXMgaXMgYW4gYXV0b21hdGVkIGFjY291bnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo4MAogICAgLy8gY29uc3QgZm9sbG93c0tleSA9IHRoaXMuZmx3KGFkZHJlc3MsIHNlbmRlcikKICAgIGZyYW1lX2RpZyAtMQogICAgZnJhbWVfZGlnIC0yCiAgICBjYWxsc3ViIGZsdwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjI4CiAgICAvLyBmb2xsb3dzID0gQm94TWFwPEZvbGxvd3NLZXksIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4Rm9sbG93cyB9KQogICAgYnl0ZWMgNCAvLyAiZiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjgzCiAgICAvLyBhc3NlcnQoIXRoaXMuZm9sbG93cyhmb2xsb3dzS2V5KS5leGlzdHMsIEVSUl9BTFJFQURZX0ZPTExPV0lORykKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQgLy8gQWxyZWFkeSBmb2xsb3dpbmcgdGhpcyB1c2VyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2dyYXBoLmFsZ28udHM6ODYKICAgIC8vIGNvbnN0IHsgZm9sbG93ZXJDb3VudCwgZm9sbG93ZXJJbmRleCB9ID0gdGhpcy5nZXRNZXRhKGFkZHJlc3MpCiAgICBmcmFtZV9kaWcgLTEKICAgIGNhbGxzdWIgZ2V0TWV0YQogICAgZHVwCiAgICBwdXNoaW50IDQxIC8vIDQxCiAgICBleHRyYWN0X3VpbnQ2NAogICAgc3dhcAogICAgcHVzaGludCAzMyAvLyAzMwogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvZ3JhcGguYWxnby50czo4OQogICAgLy8gdGhpcy5mb2xsb3dzKGZvbGxvd3NLZXkpLnZhbHVlID0gZm9sbG93ZXJJbmRleCArIDEKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBkdXAKICAgIGl0b2IKICAgIHVuY292ZXIgMwogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9ncmFwaC5hbGdvLnRzOjkxCiAgICAvLyB0aGlzLnVwZGF0ZUZvbGxvd2VyTWV0YShhZGRyZXNzLCBmb2xsb3dlckluZGV4ICsgMSwgZm9sbG93ZXJDb3VudCArIDEpCiAgICBzd2FwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgZnJhbWVfZGlnIC0xCiAgICBjb3ZlciAyCiAgICBjYWxsc3ViIHVwZGF0ZUZvbGxvd2VyTWV0YQogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icihyZWY6IGJ5dGVzKSAtPiBieXRlczoKc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjpCYXNlU29jaWFsLm1icjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNAogICAgLy8gbWJyKHJlZjogYnl0ZXMpOiBBa2l0YVNvY2lhbE1CUkRhdGEgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTgKICAgIC8vIHBvc3RzOiBNaW5Qb3N0c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIHJlZi5sZW5ndGgpLAogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIHB1c2hpbnQgNDAwIC8vIDQwMAogICAgKgogICAgcHVzaGludCA0MDEwMCAvLyA0MDEwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBwdXNoYnl0ZXMgMHgwMDAwMDAwMDAwMDA3YmQ0MDAwMDAwMDAwMDAwM2Q1NAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTkKICAgIC8vIHZvdGVzOiBWb3Rlc01CUiwKICAgIHB1c2hpbnQgMTkzMDAgLy8gMTkzMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNS0yNwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZm9sbG93czogRm9sbG93c01CUiwKICAgIC8vICAgYmxvY2tzOiBCbG9ja3NNQlIsCiAgICAvLyAgIHBvc3RzOiBNaW5Qb3N0c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIHJlZi5sZW5ndGgpLAogICAgLy8gICB2b3RlczogVm90ZXNNQlIsCiAgICAvLyAgIHZvdGVsaXN0OiBWb3RlbGlzdE1CUiwKICAgIC8vICAgcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICAvLyAgIHJlYWN0aW9ubGlzdDogUmVhY3Rpb25saXN0TUJSLAogICAgLy8gICBtZXRhOiBNZXRhTUJSLAogICAgLy8gICBtb2RlcmF0b3JzOiBNb2RlcmF0b3JzTUJSLAogICAgLy8gICBiYW5uZWQ6IEJhbm5lZE1CUiwKICAgIC8vICAgYWN0aW9uczogQWN0aW9uc01CUgogICAgLy8gfQogICAgaXRvYgogICAgc3dhcAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MjEKICAgIC8vIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgcHVzaGludCAyMjEwMCAvLyAyMjEwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoyMgogICAgLy8gcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICBwdXNoaW50IDE4OTAwIC8vIDE4OTAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL2Jhc2UudHM6MTUtMjcKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIGZvbGxvd3M6IEZvbGxvd3NNQlIsCiAgICAvLyAgIGJsb2NrczogQmxvY2tzTUJSLAogICAgLy8gICBwb3N0czogTWluUG9zdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiByZWYubGVuZ3RoKSwKICAgIC8vICAgdm90ZXM6IFZvdGVzTUJSLAogICAgLy8gICB2b3RlbGlzdDogVm90ZWxpc3RNQlIsCiAgICAvLyAgIHJlYWN0aW9uczogUmVhY3Rpb25zTUJSLAogICAgLy8gICByZWFjdGlvbmxpc3Q6IFJlYWN0aW9ubGlzdE1CUiwKICAgIC8vICAgbWV0YTogTWV0YU1CUiwKICAgIC8vICAgbW9kZXJhdG9yczogTW9kZXJhdG9yc01CUiwKICAgIC8vICAgYmFubmVkOiBCYW5uZWRNQlIsCiAgICAvLyAgIGFjdGlvbnM6IEFjdGlvbnNNQlIKICAgIC8vIH0KICAgIGl0b2IKICAgIHN3YXAKICAgIGRpZyAxCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoyMwogICAgLy8gbWV0YTogTWV0YU1CUiwKICAgIHB1c2hpbnQgNDUzMDAgLy8gNDUzMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoxNS0yNwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZm9sbG93czogRm9sbG93c01CUiwKICAgIC8vICAgYmxvY2tzOiBCbG9ja3NNQlIsCiAgICAvLyAgIHBvc3RzOiBNaW5Qb3N0c01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIHJlZi5sZW5ndGgpLAogICAgLy8gICB2b3RlczogVm90ZXNNQlIsCiAgICAvLyAgIHZvdGVsaXN0OiBWb3RlbGlzdE1CUiwKICAgIC8vICAgcmVhY3Rpb25zOiBSZWFjdGlvbnNNQlIsCiAgICAvLyAgIHJlYWN0aW9ubGlzdDogUmVhY3Rpb25saXN0TUJSLAogICAgLy8gICBtZXRhOiBNZXRhTUJSLAogICAgLy8gICBtb2RlcmF0b3JzOiBNb2RlcmF0b3JzTUJSLAogICAgLy8gICBiYW5uZWQ6IEJhbm5lZE1CUiwKICAgIC8vICAgYWN0aW9uczogQWN0aW9uc01CUgogICAgLy8gfQogICAgaXRvYgogICAgY29uY2F0CiAgICBkaWcgMQogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvYmFzZS50czoyNgogICAgLy8gYWN0aW9uczogQWN0aW9uc01CUgogICAgcHVzaGludCAyOTcwMCAvLyAyOTcwMAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9iYXNlLnRzOjE1LTI3CiAgICAvLyByZXR1cm4gewogICAgLy8gICBmb2xsb3dzOiBGb2xsb3dzTUJSLAogICAgLy8gICBibG9ja3M6IEJsb2Nrc01CUiwKICAgIC8vICAgcG9zdHM6IE1pblBvc3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogcmVmLmxlbmd0aCksCiAgICAvLyAgIHZvdGVzOiBWb3Rlc01CUiwKICAgIC8vICAgdm90ZWxpc3Q6IFZvdGVsaXN0TUJSLAogICAgLy8gICByZWFjdGlvbnM6IFJlYWN0aW9uc01CUiwKICAgIC8vICAgcmVhY3Rpb25saXN0OiBSZWFjdGlvbmxpc3RNQlIsCiAgICAvLyAgIG1ldGE6IE1ldGFNQlIsCiAgICAvLyAgIG1vZGVyYXRvcnM6IE1vZGVyYXRvcnNNQlIsCiAgICAvLyAgIGJhbm5lZDogQmFubmVkTUJSLAogICAgLy8gICBhY3Rpb25zOiBBY3Rpb25zTUJSCiAgICAvLyB9CiAgICBpdG9iCiAgICBjb25jYXQKICAgIHJldHN1Ygo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAEAAEQICYJBBUffHUJYWtpdGFfZGFvAAFiAWYDc2FsB3ZlcnNpb24DcGFsBndhbGxldIAE6pGA3TYaAI4BAHwxGRREMRhBAGWCDQS1nIpUBK7rs3gEhmdUlARLb5B/BBYbOnoEQwNmjgTrYvUIBAmDgKQEkubdOwShNKJ4BDRBdfAEM+kslASFTe3gNhoAjg0AQgCEALUBVAGNAdoCAAIoAkoCZAKTA20AAQAjQ4AEb5gX9jYaAI4BAA0AMRmBBBIxGBBEQgMdNhoBSRWBCBJEFzYaAkkiWYECCEsBFRJEVwIAKU8CZycGTGcjQzEWIwlJOBAjEkQ2GgFJFSUSRDEAiAMyFEQxAEsBE0RLATgHMgoSTwI4CCqIBKaBCFsSEEQxAEyIA0krTFAiuUgjQzYaAUkVJRJEMQCIAvoURDEATIgDLCtMULxIsTEAKogEcYEIW7IIsgcjshAisgGzI0MxFoECCUk4ECMSRDEWIwlHAjgQgQYSRDYaAUlOAkkVJRJEiAN5VzIITCIpZUQxAE4CTDgYTIADYWFsZUiBKFsSQQBYSwM4GUAAUUsDOBuBBBJBAEdLAyLCGoAEQ5ImVRJBADhLAyPCGksBEkEALUsDgQLCGksCEkEAISNEKogD4SJbSwVJOAcyChJMOAhPAhIQRDEASwOIA20jQyJC/9wxFiMJSTgQIxJENhoBSRUlEkRJiALpgTJbFEQqiAOjIltLAjgHMgoSTwM4CE8CEhBEMQBMiAMwI0M2GgFJFSUSRDEAiAHxFERJMQCIAmonBExQSb1FAURLAYgCo0mBKVtMgSFbTCMJTwNOAogCybxIsTEAKogDSyJbsgiyByOyECKyAbMjQzYaAUkVJRJENhoCSRUlEkSIAdgrTFC9RQGAAQAiTwJUKExQsCNDNhoBSRUlEkQ2GgJJFSUSREyIAfgnBExQvUUBgAEAIk8CVChMULAjQzYaAUkVJRJENhoCSRUlEkRMiAHQJwRMUL5EFxYoTFCwI0M2GgFJIlmBAghLARUSRFcCAIgCuChMULAjQzYaAUmBAllLARVLAksCTwJSIllLAiJZTwNMTwNSIlkIgZA1C4HQKAgWKExQsCNDNhoBSRWBCBJEF0k2GgJJFSUSRDYaA0kVgQgSRBdOAkyADGFraXRhX2Fzc2V0c2VIIltwAEUBQABgSUEAXLFLAScHZUhXAAgyA4AERyevIbIaTLIagAGAshqyGoACAACyGoAEaDXjvLIaSbIYgQayECKyAbO0PklXBABMVwAEKBJESRUjEkQiU0EADjIQFoABFExQKExQsCNDgAkKAAAAAAAAAABC/+w2GgFJIlmBAghLARUSRFcCADEAIillREknCGVIcghETwISRCcHZUgkWzINEkQnBkxnI0M2GgFJFYEIEkQXMQAiKWVEJwhlSHIIRBJEKUxnI0OKAQEiKWVEJwVlSIEYW7GABIQmnHiyGov/shqyGIEGshAisgGztD5JVwQATFcABCgSREkVIxJEIlOJigIBi/4VIksBDyJLAk8CTSRLAg8kTwNPAk2L/k4CUkkVJBJEi/8VIksBDyJLAk8CTSRLAg8kTwNPAk2L/04CUkkVJBJEUImKAgGL/hUiSwEPIksCTwJNJEsCDyRPA08CTYv+TgJSSRUkEkSL/xUiSwEPIksCTwJNJEsCDyRPA08CTYv/TgJSSRUkEkRQiYoBASIpZUQnBWVIIluxgARznqcLshqL/7IashiBBrIQIrIBs7Q+SVcEAExXAAQoEkRJFYFKEkSJigMAIillRCcFZUgiW7GL/haL/xaABDMGsyqyGov9shpMshqyGrIYgQayECKyAbOJigIAi/6I/sgURIv/i/6I/vkrTFC9RQEURIv+i/8TRIv+iP90gYgDUxREi/+L/oj/ICcETFBJvUUBFESL/4j/WEmBKVtMgSFbIwhJFk8DTL9MIwiL/04CiP92iYoBAYv/FYGQAwuBpLkCCBaAEAAAAAAAAHvUAAAAAAAAPVRMUIHklgEWTEsBUExQgdSsARZQgdSTARZMSwFQgfThAhZQSwFQTFCBhOgBFlCJ", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var AkitaSocialGraphParamsFactory = class _AkitaSocialGraphParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(uint64,string)void":
            return _AkitaSocialGraphParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the AkitaSocialGraph smart contract using the create(uint64,string)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(uint64,string)void",
          args: Array.isArray(params.args) ? params.args : [params.args.akitaDao, params.args.version]
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
            return _AkitaSocialGraphParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the AkitaSocialGraph smart contract using the update(string)void ABI method
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
   * Constructs a no op call for the block(pay,address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static block(params) {
    return {
      ...params,
      method: "block(pay,address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.address]
    };
  }
  /**
   * Constructs a no op call for the unblock(address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static unblock(params) {
    return {
      ...params,
      method: "unblock(address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the gatedFollow(pay,appl,address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static gatedFollow(params) {
    return {
      ...params,
      method: "gatedFollow(pay,appl,address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.gateTxn, params.args.address]
    };
  }
  /**
   * Constructs a no op call for the follow(pay,address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static follow(params) {
    return {
      ...params,
      method: "follow(pay,address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.address]
    };
  }
  /**
   * Constructs a no op call for the unfollow(address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static unfollow(params) {
    return {
      ...params,
      method: "unfollow(address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the isBlocked(address,address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isBlocked(params) {
    return {
      ...params,
      method: "isBlocked(address,address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.user, params.args.blocked]
    };
  }
  /**
   * Constructs a no op call for the isFollowing(address,address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isFollowing(params) {
    return {
      ...params,
      method: "isFollowing(address,address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.follower, params.args.user]
    };
  }
  /**
   * Constructs a no op call for the getFollowIndex(address,address)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getFollowIndex(params) {
    return {
      ...params,
      method: "getFollowIndex(address,address)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.follower, params.args.user]
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
      method: "mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
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
      method: "payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.paywall]
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
      method: "checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.akitaDao, params.args.creator, params.args.wallet]
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
};
var AkitaSocialGraphFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `AkitaSocialGraphFactory`
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
    return new AkitaSocialGraphClient(this.appFactory.getAppClientById(params));
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
    return new AkitaSocialGraphClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the AkitaSocialGraph smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? AkitaSocialGraphParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? AkitaSocialGraphParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0
    });
    return { result: result.result, appClient: new AkitaSocialGraphClient(result.appClient) };
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
       * Creates a new instance of the AkitaSocialGraph smart contract using the create(uint64,string)void ABI method.
       *
       * Create method to initialize the contract with the DAO reference
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(AkitaSocialGraphParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the AkitaSocialGraph smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(AkitaSocialGraphParamsFactory.update.update(params));
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
       * Creates a new instance of the AkitaSocialGraph smart contract using the create(uint64,string)void ABI method.
       *
       * Create method to initialize the contract with the DAO reference
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(AkitaSocialGraphParamsFactory.create.create(params));
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
       * Creates a new instance of the AkitaSocialGraph smart contract using an ABI method call using the create(uint64,string)void ABI method.
       *
       * Create method to initialize the contract with the DAO reference
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(AkitaSocialGraphParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new AkitaSocialGraphClient(result.appClient) };
      }
    }
  };
};
var AkitaSocialGraphClient = class _AkitaSocialGraphClient {
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
   * Returns a new `AkitaSocialGraphClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _AkitaSocialGraphClient(await _AppClient2.fromCreatorAndName({ ...params, appSpec: APP_SPEC2 }));
  }
  /**
   * Returns an `AkitaSocialGraphClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _AkitaSocialGraphClient(await _AppClient2.fromNetwork({ ...params, appSpec: APP_SPEC2 }));
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
       * Updates an existing instance of the AkitaSocialGraph smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(AkitaSocialGraphParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialGraph smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `block(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    block: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.block(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unblock(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    unblock: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.unblock(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `gatedFollow(pay,appl,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    gatedFollow: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.gatedFollow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `follow(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    follow: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.follow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unfollow(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    unfollow: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.unfollow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isBlocked(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    isBlocked: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.isBlocked(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isFollowing(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    isFollowing: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.isFollowing(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `getFollowIndex(address,address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getFollowIndex: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.getFollowIndex(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    mbr: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    payWallMbr: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.payWallMbr(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    checkTipMbrRequirements: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.checkTipMbrRequirements(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.params.call(AkitaSocialGraphParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocialGraph smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(AkitaSocialGraphParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialGraph smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `block(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    block: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.block(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unblock(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    unblock: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.unblock(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `gatedFollow(pay,appl,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    gatedFollow: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.gatedFollow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `follow(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    follow: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.follow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unfollow(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    unfollow: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.unfollow(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isBlocked(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    isBlocked: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.isBlocked(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isFollowing(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    isFollowing: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.isFollowing(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `getFollowIndex(address,address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getFollowIndex: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.getFollowIndex(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    mbr: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.mbr(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    payWallMbr: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.payWallMbr(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    checkTipMbrRequirements: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.checkTipMbrRequirements(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(AkitaSocialGraphParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocialGraph smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(AkitaSocialGraphParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialGraph smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `block(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    block: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.block(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unblock(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    unblock: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.unblock(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `gatedFollow(pay,appl,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    gatedFollow: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.gatedFollow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `follow(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    follow: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.follow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `unfollow(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    unfollow: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.unfollow(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isBlocked(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    isBlocked: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.isBlocked(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `isFollowing(address,address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    isFollowing: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.isFollowing(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `getFollowIndex(address,address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getFollowIndex: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.getFollowIndex(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    mbr: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.mbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    payWallMbr: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.payWallMbr(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    checkTipMbrRequirements: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.checkTipMbrRequirements(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.updateAkitaDao(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialGraph smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    opUp: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.opUp(params));
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
    return new _AkitaSocialGraphClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialGraph smart contract using the `isBlocked(address,address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async isBlocked(params) {
    const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.isBlocked(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialGraph smart contract using the `isFollowing(address,address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async isFollowing(params) {
    const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.isFollowing(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialGraph smart contract using the `getFollowIndex(address,address)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getFollowIndex(params) {
    const result = await this.appClient.send.call(AkitaSocialGraphParamsFactory.getFollowIndex(params));
    return result.return;
  }
  /**
   * Methods to access state for the current AkitaSocialGraph app
   */
  state = {
    /**
     * Methods to access global state for the current AkitaSocialGraph app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          version: result.version,
          akitaDao: result.akitaDAO
        };
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
     * Methods to access box state for the current AkitaSocialGraph app
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
       * Get values from the follows map in box state
       */
      follows: {
        /**
         * Get all current values of the follows map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("follows");
        },
        /**
         * Get a current value of the follows map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("follows", key);
        }
      },
      /**
       * Get values from the blocks map in box state
       */
      blocks: {
        /**
         * Get all current values of the blocks map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("blocks");
        },
        /**
         * Get a current value of the blocks map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("blocks", key);
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
       * Add a block(pay,address)void method call against the AkitaSocialGraph contract
       */
      block(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.block(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a unblock(address)void method call against the AkitaSocialGraph contract
       */
      unblock(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unblock(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a gatedFollow(pay,appl,address)void method call against the AkitaSocialGraph contract
       */
      gatedFollow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.gatedFollow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a follow(pay,address)void method call against the AkitaSocialGraph contract
       */
      follow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.follow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a unfollow(address)void method call against the AkitaSocialGraph contract
       */
      unfollow(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unfollow(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a isBlocked(address,address)bool method call against the AkitaSocialGraph contract
       */
      isBlocked(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isBlocked(params)));
        resultMappers.push((v) => client.decodeReturnValue("isBlocked(address,address)bool", v));
        return this;
      },
      /**
       * Add a isFollowing(address,address)bool method call against the AkitaSocialGraph contract
       */
      isFollowing(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isFollowing(params)));
        resultMappers.push((v) => client.decodeReturnValue("isFollowing(address,address)bool", v));
        return this;
      },
      /**
       * Add a getFollowIndex(address,address)uint64 method call against the AkitaSocialGraph contract
       */
      getFollowIndex(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getFollowIndex(params)));
        resultMappers.push((v) => client.decodeReturnValue("getFollowIndex(address,address)uint64", v));
        return this;
      },
      /**
       * Add a mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64) method call against the AkitaSocialGraph contract
       */
      mbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.mbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("mbr(byte[])(uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64 method call against the AkitaSocialGraph contract
       */
      payWallMbr(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.payWallMbr(params)));
        resultMappers.push((v) => client.decodeReturnValue("payWallMbr(((uint8,uint64,uint64)[],(uint8,uint64,uint64)[]))uint64", v));
        return this;
      },
      /**
       * Add a checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64) method call against the AkitaSocialGraph contract
       */
      checkTipMbrRequirements(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.checkTipMbrRequirements(params)));
        resultMappers.push((v) => client.decodeReturnValue("checkTipMbrRequirements(uint64,address,uint64)(uint8,uint64)", v));
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the AkitaSocialGraph contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a opUp()void method call against the AkitaSocialGraph contract
       */
      opUp(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
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
      /**
       * Add a clear state call to the AkitaSocialGraph contract
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

// src/generated/AkitaSocialImpactClient.ts
import { getArc56ReturnValue as getArc56ReturnValue3, getABIStructFromABITuple as getABIStructFromABITuple3 } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient3
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory3 } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC3 = { "name": "AkitaSocialImpact", "structs": { "arc4ImpactMetaValue": [{ "name": "subscriptionIndex", "type": "uint64" }, { "name": "nfd", "type": "uint64" }, { "name": "nfdTimeChanged", "type": "uint64" }, { "name": "nfdImpact", "type": "uint64" }, { "name": "akitaNft", "type": "uint64" }], "MetaValue": [{ "name": "walletId", "type": "uint64" }, { "name": "streak", "type": "uint64" }, { "name": "startDate", "type": "uint64" }, { "name": "lastActive", "type": "uint64" }, { "name": "followerIndex", "type": "uint64" }, { "name": "followerCount", "type": "uint64" }, { "name": "automated", "type": "bool" }, { "name": "followGateId", "type": "uint64" }, { "name": "addressGateId", "type": "uint64" }] }, "methods": [{ "name": "create", "args": [{ "type": "uint64", "name": "akitaDAO" }, { "type": "string", "name": "version" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cacheMeta", "args": [{ "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "NFDAppID" }, { "type": "uint64", "name": "akitaAssetID" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateSubscriptionStateModifier", "args": [{ "type": "pay", "name": "payment" }, { "type": "uint64", "name": "subscriptionIndex" }, { "type": "uint64", "name": "newModifier" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "getUserImpactWithoutSocial", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getUserImpact", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "getMeta", "args": [{ "type": "address", "name": "user" }], "returns": { "type": "(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)", "struct": "MetaValue" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "app" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "meta": { "keyType": "address", "valueType": "arc4ImpactMetaValue", "desc": "A map of the meta data for each user", "prefix": "bQ==" }, "subscriptionStateModifier": { "keyType": "uint64", "valueType": "uint64", "desc": "A map of how each akita subscription affects impact calculation", "prefix": "cw==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [560, 689, 770, 1750], "errorMessage": "Box must have value" }, { "pc": [481, 627, 763, 1067, 1199, 1250], "errorMessage": "Bytes has valid prefix" }, { "pc": [798], "errorMessage": "Invalid NFD" }, { "pc": [1716], "errorMessage": "Invalid payment" }, { "pc": [800], "errorMessage": "NFD changed since impact last calculated" }, { "pc": [1202], "errorMessage": "Not an NFD" }, { "pc": [1615], "errorMessage": "Not an akita NFT" }, { "pc": [1109], "errorMessage": "Not an akita subscription contract" }, { "pc": [1681], "errorMessage": "Not the DAO" }, { "pc": [202, 238, 313, 333, 353, 383, 412], "errorMessage": "OnCompletion is not NoOp" }, { "pc": [220], "errorMessage": "OnCompletion is not UpdateApplication" }, { "pc": [1817, 1837], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [1335], "errorMessage": "User does not own this NFD" }, { "pc": [1623], "errorMessage": "User does not own this NFT" }, { "pc": [515, 1679, 1815, 1835], "errorMessage": "application exists" }, { "pc": [834, 873, 1611], "errorMessage": "asset exists" }, { "pc": [416], "errorMessage": "can only call when creating" }, { "pc": [205, 223, 241, 316, 336, 356, 386], "errorMessage": "can only call when not creating" }, { "pc": [439, 575, 715, 804, 1137, 1383, 1676, 1812, 1832], "errorMessage": "check GlobalState exists" }, { "pc": [366], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDYgOCAxMDAwMDAwMDAwMDAwIDIwMDAwMDAwMDAwMCAzMTUzNjAwMCAxMDAwMDAwMDAwMAogICAgYnl0ZWNibG9jayAiYWtpdGFfZGFvIiAweDE1MWY3Yzc1ICJha2l0YV9hbCIgIm0iICJha2l0YV9hc3NldHMiICJpLnRpbWVDaGFuZ2VkIiBiYXNlMzIoQUtDVFJESzRPV05XSFRQSDRYUEtMTldOTFozMzNWRTM1U0tRNEZHUUszWkpBNEZJSENMUSkgMHg2YzEzZWRlNCAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMDgKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbEltcGFjdCBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IGltcGxlbWVudHMgQWtpdGFTb2NpYWxJbXBhY3RJbnRlcmZhY2UgewogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fYWZ0ZXJfaWZfZWxzZUAxNAogICAgcHVzaGJ5dGVzcyAweDZmOTgxN2Y2IDB4M2U2ZWUzZDYgMHg5ZDc0ZjVhMSAweGY4MWM3YjYyIDB4ZDU3NGJiMTAgMHgyODgyYmI4YSAweGVhOTE4MGRkIDB4MzNlOTJjOTQgLy8gbWV0aG9kICJjcmVhdGUodWludDY0LHN0cmluZyl2b2lkIiwgbWV0aG9kICJjYWNoZU1ldGEodWludDY0LHVpbnQ2NCx1aW50NjQpdWludDY0IiwgbWV0aG9kICJ1cGRhdGVTdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyKHBheSx1aW50NjQsdWludDY0KXZvaWQiLCBtZXRob2QgImdldFVzZXJJbXBhY3RXaXRob3V0U29jaWFsKGFkZHJlc3MpdWludDY0IiwgbWV0aG9kICJnZXRVc2VySW1wYWN0KGFkZHJlc3MpdWludDY0IiwgbWV0aG9kICJnZXRNZXRhKGFkZHJlc3MpKHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LGJvb2wsdWludDY0LHVpbnQ2NCkiLCBtZXRob2QgInVwZGF0ZShzdHJpbmcpdm9pZCIsIG1ldGhvZCAidXBkYXRlQWtpdGFEQU8odWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX2NyZWF0ZV9yb3V0ZUAzIG1haW5fY2FjaGVNZXRhX3JvdXRlQDQgbWFpbl91cGRhdGVTdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyX3JvdXRlQDUgbWFpbl9nZXRVc2VySW1wYWN0V2l0aG91dFNvY2lhbF9yb3V0ZUA2IG1haW5fZ2V0VXNlckltcGFjdF9yb3V0ZUA3IG1haW5fZ2V0TWV0YV9yb3V0ZUA4IG1haW5fdXBkYXRlX3JvdXRlQDkgbWFpbl91cGRhdGVBa2l0YURBT19yb3V0ZUAxMAoKbWFpbl9hZnRlcl9pZl9lbHNlQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMwOAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsSW1wYWN0IGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgaW1wbGVtZW50cyBBa2l0YVNvY2lhbEltcGFjdEludGVyZmFjZSB7CiAgICBpbnRjXzAgLy8gMAogICAgcmV0dXJuCgptYWluX3VwZGF0ZUFraXRhREFPX3JvdXRlQDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFwcDogdWludDY0KTogdm9pZCB7CiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMDgKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbEltcGFjdCBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IGltcGxlbWVudHMgQWtpdGFTb2NpYWxJbXBhY3RJbnRlcmZhY2UgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFwcDogdWludDY0KTogdm9pZCB7CiAgICBjYWxsc3ViIHVwZGF0ZUFraXRhREFPCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX3VwZGF0ZV9yb3V0ZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjAKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgcHVzaGludCA0IC8vIFVwZGF0ZUFwcGxpY2F0aW9uCiAgICA9PQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgVXBkYXRlQXBwbGljYXRpb24KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMwOAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsSW1wYWN0IGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgaW1wbGVtZW50cyBBa2l0YVNvY2lhbEltcGFjdEludGVyZmFjZSB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjAKICAgIC8vIEBhYmltZXRob2QoeyBhbGxvd0FjdGlvbnM6IFsnVXBkYXRlQXBwbGljYXRpb24nXSB9KQogICAgY2FsbHN1YiB1cGRhdGUKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fZ2V0TWV0YV9yb3V0ZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY2MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMDgKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbEltcGFjdCBleHRlbmRzIEFraXRhQmFzZUNvbnRyYWN0IGltcGxlbWVudHMgQWtpdGFTb2NpYWxJbXBhY3RJbnRlcmZhY2UgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY2MAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBjYWxsc3ViIGdldE1ldGEKICAgIHVuY292ZXIgOAogICAgaXRvYgogICAgdW5jb3ZlciA4CiAgICBpdG9iCiAgICB1bmNvdmVyIDgKICAgIGl0b2IKICAgIHVuY292ZXIgOAogICAgaXRvYgogICAgdW5jb3ZlciA4CiAgICBpdG9iCiAgICB1bmNvdmVyIDgKICAgIGl0b2IKICAgIHB1c2hieXRlcyAweDAwCiAgICBpbnRjXzAgLy8gMAogICAgdW5jb3ZlciAxMAogICAgc2V0Yml0CiAgICB1bmNvdmVyIDgKICAgIGl0b2IKICAgIHVuY292ZXIgOAogICAgaXRvYgogICAgdW5jb3ZlciA4CiAgICB1bmNvdmVyIDgKICAgIGNvbmNhdAogICAgdW5jb3ZlciA3CiAgICBjb25jYXQKICAgIHVuY292ZXIgNgogICAgY29uY2F0CiAgICB1bmNvdmVyIDUKICAgIGNvbmNhdAogICAgdW5jb3ZlciA0CiAgICBjb25jYXQKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2dldFVzZXJJbXBhY3Rfcm91dGVANzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2NTUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzA4CiAgICAvLyBleHBvcnQgY2xhc3MgQWtpdGFTb2NpYWxJbXBhY3QgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCBpbXBsZW1lbnRzIEFraXRhU29jaWFsSW1wYWN0SW50ZXJmYWNlIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2NTUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgY2FsbHN1YiBnZXRVc2VySW1wYWN0CiAgICBpdG9iCiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2dldFVzZXJJbXBhY3RXaXRob3V0U29jaWFsX3JvdXRlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjUwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMwOAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsSW1wYWN0IGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgaW1wbGVtZW50cyBBa2l0YVNvY2lhbEltcGFjdEludGVyZmFjZSB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjUwCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGNhbGxzdWIgZ2V0VXNlckltcGFjdFdpdGhvdXRTb2NpYWwKICAgIGl0b2IKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fdXBkYXRlU3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcl9yb3V0ZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzMgogICAgLy8gdXBkYXRlU3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcihwYXltZW50OiBndHhuLlBheW1lbnRUeG4sIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsIG5ld01vZGlmaWVyOiB1aW50NjQpOiB2b2lkIHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMwOAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsSW1wYWN0IGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgaW1wbGVtZW50cyBBa2l0YVNvY2lhbEltcGFjdEludGVyZmFjZSB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMSAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MzIKICAgIC8vIHVwZGF0ZVN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIocGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBzdWJzY3JpcHRpb25JbmRleDogdWludDY0LCBuZXdNb2RpZmllcjogdWludDY0KTogdm9pZCB7CiAgICBjYWxsc3ViIHVwZGF0ZVN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fY2FjaGVNZXRhX3JvdXRlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTk5CiAgICAvLyBjYWNoZU1ldGEoc3Vic2NyaXB0aW9uSW5kZXg6IHVpbnQ2NCwgTkZEQXBwSUQ6IHVpbnQ2NCwgYWtpdGFBc3NldElEOiB1aW50NjQpOiB1aW50NjQgewogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzA4CiAgICAvLyBleHBvcnQgY2xhc3MgQWtpdGFTb2NpYWxJbXBhY3QgZXh0ZW5kcyBBa2l0YUJhc2VDb250cmFjdCBpbXBsZW1lbnRzIEFraXRhU29jaWFsSW1wYWN0SW50ZXJmYWNlIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGJ0b2kKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1OTkKICAgIC8vIGNhY2hlTWV0YShzdWJzY3JpcHRpb25JbmRleDogdWludDY0LCBORkRBcHBJRDogdWludDY0LCBha2l0YUFzc2V0SUQ6IHVpbnQ2NCk6IHVpbnQ2NCB7CiAgICBjYWxsc3ViIGNhY2hlTWV0YQogICAgaXRvYgogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfcm91dGVAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1OTEKICAgIC8vIEBhYmltZXRob2QoeyBvbkNyZWF0ZTogJ3JlcXVpcmUnIH0pCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgIQogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBjcmVhdGluZwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMwOAogICAgLy8gZXhwb3J0IGNsYXNzIEFraXRhU29jaWFsSW1wYWN0IGV4dGVuZHMgQWtpdGFCYXNlQ29udHJhY3QgaW1wbGVtZW50cyBBa2l0YVNvY2lhbEltcGFjdEludGVyZmFjZSB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU5MQogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIGNhbGxzdWIgY3JlYXRlCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmlzU3Vic2NyaWJlZChhY2NvdW50OiBieXRlcywgaW5kZXg6IHVpbnQ2NCkgLT4gdWludDY0LCB1aW50NjQsIHVpbnQ2NDoKaXNTdWJzY3JpYmVkOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMzMAogICAgLy8gcHJpdmF0ZSBpc1N1YnNjcmliZWQoYWNjb3VudDogQWNjb3VudCwgaW5kZXg6IHVpbnQ2NCk6IHsgYWN0aXZlOiBib29sZWFuOyBzZXJ2aWNlSUQ6IHVpbnQ2NDsgc3RyZWFrOiB1aW50NjQgfSB7CiAgICBwcm90byAyIDMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMzEtMTMzOAogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGwoCiAgICAvLyAgIFN1YnNjcmlwdGlvbnMucHJvdG90eXBlLmdldFN1YnNjcmlwdGlvbkluZm8sCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN1YnNjcmlwdGlvbnMsCiAgICAvLyAgICAgYXJnczogW25ldyBBZGRyZXNzKGFjY291bnQpLCBpbmRleF0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9LAogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czoxCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlBa2l0YURBTyA9ICdha2l0YV9kYW8nCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MjUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0KSkKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2Rhby9jb25zdGFudHMudHM6NwogICAgLy8gZXhwb3J0IGNvbnN0IEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0ID0gJ2FraXRhX2FsJwogICAgYnl0ZWNfMiAvLyAiYWtpdGFfYWwiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2CiAgICAvLyByZXR1cm4gZGVjb2RlQXJjNDxBa2l0YUFwcExpc3Q+KGFwcExpc3RCeXRlcykKICAgIHB1c2hpbnQgMzIgLy8gMzIKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzM1CiAgICAvLyBhcmdzOiBbbmV3IEFkZHJlc3MoYWNjb3VudCksIGluZGV4XSwKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMzMS0xMzM4CiAgICAvLyBjb25zdCBpbmZvID0gYWJpQ2FsbCgKICAgIC8vICAgU3Vic2NyaXB0aW9ucy5wcm90b3R5cGUuZ2V0U3Vic2NyaXB0aW9uSW5mbywKICAgIC8vICAgewogICAgLy8gICAgIGFwcElkOiBnZXRBa2l0YUFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc3Vic2NyaXB0aW9ucywKICAgIC8vICAgICBhcmdzOiBbbmV3IEFkZHJlc3MoYWNjb3VudCksIGluZGV4XSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0sCiAgICAvLyApLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHg0MDE1Yjg0MCAvLyBtZXRob2QgImdldFN1YnNjcmlwdGlvbkluZm8oYWRkcmVzcyx1aW50NjQpKGFkZHJlc3MsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsdWludDY0LHVpbnQ2NCx1aW50NjQsYWRkcmVzc1tdKSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzIgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo0CiAgICAvLyBleHBvcnQgY29uc3QgZmVlOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzMzEtMTMzOAogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGwoCiAgICAvLyAgIFN1YnNjcmlwdGlvbnMucHJvdG90eXBlLmdldFN1YnNjcmlwdGlvbkluZm8sCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN1YnNjcmlwdGlvbnMsCiAgICAvLyAgICAgYXJnczogW25ldyBBZGRyZXNzKGFjY291bnQpLCBpbmRleF0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9LAogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgZXh0cmFjdCA0IDMyCiAgICBkaWcgMQogICAgcHVzaGludCAzNiAvLyAzNgogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAyCiAgICBwdXNoaW50IDQ0IC8vIDQ0CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDMKICAgIHB1c2hpbnQgNjAgLy8gNjAKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgNAogICAgcHVzaGludCA4NCAvLyA4NAogICAgZXh0cmFjdF91aW50NjQKICAgIHVuY292ZXIgNQogICAgcHVzaGludCA5MiAvLyA5MgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNDEKICAgIC8vIGNvbnN0IHRvQWtpdGEgPSBpbmZvLnJlY2lwaWVudC5uYXRpdmUgPT09IHRoaXMuYWtpdGFEQU8udmFsdWUuYWRkcmVzcwogICAgdW5jb3ZlciA2CiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICB1bmNvdmVyIDYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzQ1CiAgICAvLyBjb25zdCBub3REb25hdGluZyA9IGluZm8uc2VydmljZUlEICE9PSAwCiAgICBkaWcgNQogICAgaW50Y18wIC8vIDAKICAgICE9CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzQ3CiAgICAvLyBjb25zdCBsYXN0V2luZG93U3RhcnQ6IHVpbnQ2NCA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgLSAoKChHbG9iYWwubGF0ZXN0VGltZXN0YW1wIC0gaW5mby5zdGFydERhdGUpICUgaW5mby5pbnRlcnZhbCkgKyBpbmZvLmludGVydmFsKQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgZHVwCiAgICB1bmNvdmVyIDcKICAgIC0KICAgIGRpZyA2CiAgICAlCiAgICB1bmNvdmVyIDYKICAgICsKICAgIC0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNTEKICAgIC8vIGNvbnN0IG5vdFN0YWxlID0gaW5mby5sYXN0UGF5bWVudCA+IGxhc3RXaW5kb3dTdGFydAogICAgdW5jb3ZlciA0CiAgICA8CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzU0CiAgICAvLyBhY3RpdmU6IHRvQWtpdGEgJiYgbm90RG9uYXRpbmcgJiYgbm90U3RhbGUsCiAgICBjb3ZlciAyCiAgICAmJgogICAgJiYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNTMtMTM1NwogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgYWN0aXZlOiB0b0FraXRhICYmIG5vdERvbmF0aW5nICYmIG5vdFN0YWxlLAogICAgLy8gICBzZXJ2aWNlSUQ6IGluZm8uc2VydmljZUlELAogICAgLy8gICBzdHJlYWs6IGluZm8uc3RyZWFrLAogICAgLy8gfQogICAgY292ZXIgMgogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LnVzZXJJbXBhY3QoYWNjb3VudDogYnl0ZXMsIGluY2x1ZGVTb2NpYWw6IHVpbnQ2NCkgLT4gdWludDY0Ogp1c2VySW1wYWN0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQwMAogICAgLy8gcHJpdmF0ZSB1c2VySW1wYWN0KGFjY291bnQ6IEFjY291bnQsIGluY2x1ZGVTb2NpYWw6IGJvb2xlYW4pOiB1aW50NjQgewogICAgcHJvdG8gMiAxCiAgICBpbnRjXzAgLy8gMAogICAgcHVzaGJ5dGVzICIiCiAgICBkdXBuIDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MTUKICAgIC8vIGV4cG9ydCBjb25zdCBJbXBhY3RCb3hQcmVmaXhNZXRhID0gJ20nCiAgICBieXRlY18zIC8vICJtIgogICAgZnJhbWVfZGlnIC0yCiAgICBjb25jYXQKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQwMQogICAgLy8gY29uc3QgbWV0YSA9IGRlY29kZUFyYzQ8SW1wYWN0TWV0YVZhbHVlPih0aGlzLm1ldGEoYWNjb3VudCkudmFsdWUuYnl0ZXMpCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIHN3YXAKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBwdXNoaW50IDMyIC8vIDMyCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czoxCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlBa2l0YURBTyA9ICdha2l0YV9kYW8nCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NjUKICAgIC8vIGNvbnN0IGFraXRhQXNzZXRzQnl0ZXMgPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cykpWzBdCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9kYW8vY29uc3RhbnRzLnRzOjE5CiAgICAvLyBleHBvcnQgY29uc3QgQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cyA9ICdha2l0YV9hc3NldHMnCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY1CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2NgogICAgLy8gcmV0dXJuIGRlY29kZUFyYzQ8QWtpdGFBc3NldHM+KGFraXRhQXNzZXRzQnl0ZXMpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MjItMTQzNQogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGwoCiAgICAvLyAgIFN0YWtpbmcucHJvdG90eXBlLmdldEluZm8sCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICAvLyAgICAgYXJnczogWwogICAgLy8gICAgICAgbmV3IEFkZHJlc3MoYWNjb3VudCksCiAgICAvLyAgICAgICB7CiAgICAvLyAgICAgICAgIGFzc2V0OiBha3RhLAogICAgLy8gICAgICAgICB0eXBlOiBTVEFLSU5HX1RZUEVfU09GVCwKICAgIC8vICAgICAgIH0KICAgIC8vICAgICBdLAogICAgLy8gICAgIGZlZSwKICAgIC8vICAgfQogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czoyNQogICAgLy8gY29uc3QgW2FwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFwcExpc3QpKQogICAgc3dhcAogICAgLy8gc21hcnRfY29udHJhY3RzL2Rhby9jb25zdGFudHMudHM6NwogICAgLy8gZXhwb3J0IGNvbnN0IEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0ID0gJ2FraXRhX2FsJwogICAgYnl0ZWNfMiAvLyAiYWtpdGFfYWwiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2CiAgICAvLyByZXR1cm4gZGVjb2RlQXJjNDxBa2l0YUFwcExpc3Q+KGFwcExpc3RCeXRlcykKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQyOQogICAgLy8gYXNzZXQ6IGFrdGEsCiAgICBzd2FwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc3Rha2luZy90eXBlcy50czoxNwogICAgLy8gZXhwb3J0IGNvbnN0IFNUQUtJTkdfVFlQRV9TT0ZUOiBTdGFraW5nVHlwZSA9IG5ldyBhcmM0LlVpbnROOCgxKQogICAgcHVzaGJ5dGVzIDB4MDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MjgtMTQzMQogICAgLy8gewogICAgLy8gICBhc3NldDogYWt0YSwKICAgIC8vICAgdHlwZTogU1RBS0lOR19UWVBFX1NPRlQsCiAgICAvLyB9CiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MjItMTQzNQogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGwoCiAgICAvLyAgIFN0YWtpbmcucHJvdG90eXBlLmdldEluZm8sCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICAvLyAgICAgYXJnczogWwogICAgLy8gICAgICAgbmV3IEFkZHJlc3MoYWNjb3VudCksCiAgICAvLyAgICAgICB7CiAgICAvLyAgICAgICAgIGFzc2V0OiBha3RhLAogICAgLy8gICAgICAgICB0eXBlOiBTVEFLSU5HX1RZUEVfU09GVCwKICAgIC8vICAgICAgIH0KICAgIC8vICAgICBdLAogICAgLy8gICAgIGZlZSwKICAgIC8vICAgfQogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgcHVzaGJ5dGVzIDB4YzkwNjg4MDkgLy8gbWV0aG9kICJnZXRJbmZvKGFkZHJlc3MsKHVpbnQ2NCx1aW50OCkpKHVpbnQ2NCx1aW50NjQsdWludDY0KSIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBmcmFtZV9kaWcgLTIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzIgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo0CiAgICAvLyBleHBvcnQgY29uc3QgZmVlOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MjItMTQzNQogICAgLy8gY29uc3QgaW5mbyA9IGFiaUNhbGwoCiAgICAvLyAgIFN0YWtpbmcucHJvdG90eXBlLmdldEluZm8sCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0QWtpdGFBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLnN0YWtpbmcsCiAgICAvLyAgICAgYXJnczogWwogICAgLy8gICAgICAgbmV3IEFkZHJlc3MoYWNjb3VudCksCiAgICAvLyAgICAgICB7CiAgICAvLyAgICAgICAgIGFzc2V0OiBha3RhLAogICAgLy8gICAgICAgICB0eXBlOiBTVEFLSU5HX1RZUEVfU09GVCwKICAgIC8vICAgICAgIH0KICAgIC8vICAgICBdLAogICAgLy8gICAgIGZlZSwKICAgIC8vICAgfQogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgaXR4bl9zdWJtaXQKICAgIGl0eG4gTGFzdExvZwogICAgZHVwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGR1cAogICAgcHVzaGludCA0IC8vIDQKICAgIGV4dHJhY3RfdWludDY0CiAgICBkdXAKICAgIHVuY292ZXIgMgogICAgcHVzaGludCAxMiAvLyAxMgogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MzcKICAgIC8vIGNvbnN0IGVsYXBzZWQ6IHVpbnQ2NCA9IEdsb2JhbC5sYXRlc3RUaW1lc3RhbXAgLSBpbmZvLmxhc3RVcGRhdGUKICAgIGdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKICAgIHN3YXAKICAgIC0KICAgIHN3YXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MzYKICAgIC8vIGV4cG9ydCBjb25zdCBURU5fVEhPVVNBTkRfQUtJVEE6IHVpbnQ2NCA9IDEwXzAwMF8wMDBfMDAwCiAgICBpbnRjIDcgLy8gMTAwMDAwMDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NDAKICAgIC8vIGlmIChpbmZvLmFtb3VudCA8IFRFTl9USE9VU0FORF9BS0lUQSB8fCBlbGFwc2VkIDwgVEhJUlRZX0RBWVMpIHsKICAgIDwKICAgIGJueiB1c2VySW1wYWN0X2lmX2JvZHlAMjcKICAgIGZyYW1lX2RpZyAxNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czozMQogICAgLy8gZXhwb3J0IGNvbnN0IFRISVJUWV9EQVlTOiB1aW50NjQgPSAyXzU5Ml8wMDAKICAgIHB1c2hpbnQgMjU5MjAwMCAvLyAyNTkyMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDQwCiAgICAvLyBpZiAoaW5mby5hbW91bnQgPCBURU5fVEhPVVNBTkRfQUtJVEEgfHwgZWxhcHNlZCA8IFRISVJUWV9EQVlTKSB7CiAgICA8CiAgICBieiB1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMjgKCnVzZXJJbXBhY3RfaWZfYm9keUAyNzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NDEKICAgIC8vIHJldHVybiAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSA1Cgp1c2VySW1wYWN0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldFN0YWtpbmdJbXBhY3RTY29yZUAzMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NzAKICAgIC8vIGxldCBzdWJzY3JpYmVySW1wYWN0OiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDcyCiAgICAvLyBjb25zdCBzdWJzY3JpcHRpb25TdGF0ZSA9IHRoaXMuaXNTdWJzY3JpYmVkKGFjY291bnQsIHN1YnNjcmlwdGlvbkluZGV4KQogICAgZnJhbWVfZGlnIC0yCiAgICBmcmFtZV9kaWcgMTEKICAgIGNhbGxzdWIgaXNTdWJzY3JpYmVkCiAgICBmcmFtZV9idXJ5IDgKICAgIGZyYW1lX2J1cnkgNwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ3NAogICAgLy8gaWYgKCFzdWJzY3JpcHRpb25TdGF0ZS5hY3RpdmUpIHsKICAgIGJ6IHVzZXJJbXBhY3RfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuZ2V0U3Vic2NyaWJlckltcGFjdFNjb3JlQDM5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDc4CiAgICAvLyBjb25zdCBtb2RpZmllciA9IHRoaXMuc3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcihzdWJzY3JpcHRpb25TdGF0ZS5zZXJ2aWNlSUQpLnZhbHVlCiAgICBmcmFtZV9kaWcgNwogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoxNgogICAgLy8gZXhwb3J0IGNvbnN0IEltcGFjdEJveFByZWZpeFN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIgPSAncycKICAgIHB1c2hieXRlcyAicyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ3OAogICAgLy8gY29uc3QgbW9kaWZpZXIgPSB0aGlzLnN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIoc3Vic2NyaXB0aW9uU3RhdGUuc2VydmljZUlEKS52YWx1ZQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0ODEKICAgIC8vIGlmIChzdWJzY3JpcHRpb25TdGF0ZS5zdHJlYWsgPj0gMTIpIHsKICAgIGZyYW1lX2RpZyA4CiAgICBwdXNoaW50IDEyIC8vIDEyCiAgICA+PQogICAgYnogdXNlckltcGFjdF9lbHNlX2JvZHlAMzcKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0ODIKICAgIC8vIHN1YnNjcmliZXJJbXBhY3QgKz0gMjUwIC8gbW9kaWZpZXIKICAgIHB1c2hpbnQgMjUwIC8vIDI1MAogICAgc3dhcAogICAgLwogICAgZnJhbWVfYnVyeSA2Cgp1c2VySW1wYWN0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldFN1YnNjcmliZXJJbXBhY3RTY29yZUAzOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MDUKICAgIC8vIGNvbnN0IHNvY2lhbEltcGFjdCA9IGluY2x1ZGVTb2NpYWwgPyB0aGlzLmdldFNvY2lhbEltcGFjdFNjb3JlKGFjY291bnQpIDogVWludDY0KDApIC8vIFNvY2lhbCBBY3Rpdml0eSB8IHVwIHRvIDI1MAogICAgZnJhbWVfZGlnIC0xCiAgICBieiB1c2VySW1wYWN0X3Rlcm5hcnlfZmFsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ5MS0xNDk4CiAgICAvLyByZXR1cm4gYWJpQ2FsbCgKICAgIC8vICAgQWtpdGFTb2NpYWxQbHVnaW4ucHJvdG90eXBlLmdldFVzZXJTb2NpYWxJbXBhY3QsCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0UGx1Z2luQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5zb2NpYWwsCiAgICAvLyAgICAgYXJnczogW25ldyBBZGRyZXNzKGFjY291bnQpXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0KICAgIC8vICkucmV0dXJuVmFsdWUKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9jb25zdGFudHMudHM6MQogICAgLy8gZXhwb3J0IGNvbnN0IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gPSAnYWtpdGFfZGFvJwogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvZGFvL2NvbnN0YW50cy50czo4CiAgICAvLyBleHBvcnQgY29uc3QgQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNQbHVnaW5BcHBMaXN0ID0gJ3BsdWduX2FsJwogICAgcHVzaGJ5dGVzICJwbHVnbl9hbCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzAKICAgIC8vIGNvbnN0IFtwbHVnaW5BcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzUGx1Z2luQXBwTGlzdCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjMxCiAgICAvLyByZXR1cm4gZGVjb2RlQXJjNDxQbHVnaW5BcHBMaXN0PihwbHVnaW5BcHBMaXN0Qnl0ZXMpCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0OTEtMTQ5OAogICAgLy8gcmV0dXJuIGFiaUNhbGwoCiAgICAvLyAgIEFraXRhU29jaWFsUGx1Z2luLnByb3RvdHlwZS5nZXRVc2VyU29jaWFsSW1wYWN0LAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsLAogICAgLy8gICAgIGFyZ3M6IFtuZXcgQWRkcmVzcyhhY2NvdW50KV0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9CiAgICAvLyApLnJldHVyblZhbHVlCiAgICBwdXNoYnl0ZXMgMHhlODY5OTM0ZCAvLyBtZXRob2QgImdldFVzZXJTb2NpYWxJbXBhY3QoYWRkcmVzcyl1aW50NjQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIC0yCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzIgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo0CiAgICAvLyBleHBvcnQgY29uc3QgZmVlOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0OTEtMTQ5OAogICAgLy8gcmV0dXJuIGFiaUNhbGwoCiAgICAvLyAgIEFraXRhU29jaWFsUGx1Z2luLnByb3RvdHlwZS5nZXRVc2VyU29jaWFsSW1wYWN0LAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkuc29jaWFsLAogICAgLy8gICAgIGFyZ3M6IFtuZXcgQWRkcmVzcyhhY2NvdW50KV0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9CiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGJ0b2kKICAgIGZyYW1lX2J1cnkgNAoKdXNlckltcGFjdF90ZXJuYXJ5X21lcmdlQDM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTY1CiAgICAvLyBjb25zdCBtZXRhID0gZGVjb2RlQXJjNDxJbXBhY3RNZXRhVmFsdWU+KHRoaXMubWV0YShhY2NvdW50KS52YWx1ZS5ieXRlcykKICAgIGZyYW1lX2RpZyAxMAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGR1cAogICAgaW50Y18zIC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgMQogICAgcHVzaGludCAxNiAvLyAxNgogICAgZXh0cmFjdF91aW50NjQKICAgIHVuY292ZXIgMgogICAgcHVzaGludCAyNCAvLyAyNAogICAgZXh0cmFjdF91aW50NjQKICAgIGZyYW1lX2J1cnkgMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU2NgogICAgLy8gY29uc3QgW2xhc3RDaGFuZ2VkQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMobWV0YS5ORkQsIEJ5dGVzKE5GREdsb2JhbFN0YXRlS2V5c1RpbWVDaGFuZ2VkKSkKICAgIGRpZyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjIxCiAgICAvLyBleHBvcnQgY29uc3QgTkZER2xvYmFsU3RhdGVLZXlzVGltZUNoYW5nZWQgPSAnaS50aW1lQ2hhbmdlZCcKICAgIGJ5dGVjIDUgLy8gImkudGltZUNoYW5nZWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTY2CiAgICAvLyBjb25zdCBbbGFzdENoYW5nZWRCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhtZXRhLk5GRCwgQnl0ZXMoTkZER2xvYmFsU3RhdGVLZXlzVGltZUNoYW5nZWQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU2NwogICAgLy8gY29uc3QgdGltZUNoYW5nZWQgPSBidG9pKGxhc3RDaGFuZ2VkQnl0ZXMpCiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTY5CiAgICAvLyBhc3NlcnQoTkZEQXBwLmlkID09PSBBcHBsaWNhdGlvbihtZXRhLk5GRCkuaWQsIEVSUl9JTlZBTElEX05GRCkKICAgIGZyYW1lX2RpZyAxMgogICAgdW5jb3ZlciAzCiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgTkZECiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTcwCiAgICAvLyBhc3NlcnQobWV0YS5uZmRUaW1lQ2hhbmdlZCA9PT0gdGltZUNoYW5nZWQsIEVSUl9ORkRfQ0hBTkdFRCkKICAgID09CiAgICBhc3NlcnQgLy8gTkZEIGNoYW5nZWQgc2luY2UgaW1wYWN0IGxhc3QgY2FsY3VsYXRlZAogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czoxCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlBa2l0YURBTyA9ICdha2l0YV9kYW8nCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9kYW8vY29uc3RhbnRzLnRzOjE5CiAgICAvLyBleHBvcnQgY29uc3QgQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNBa2l0YUFzc2V0cyA9ICdha2l0YV9hc3NldHMnCiAgICBieXRlYyA0IC8vICJha2l0YV9hc3NldHMiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjY1CiAgICAvLyBjb25zdCBha2l0YUFzc2V0c0J5dGVzID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBc3NldHMpKVswXQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo2NgogICAgLy8gcmV0dXJuIGRlY29kZUFyYzQ8QWtpdGFBc3NldHM+KGFraXRhQXNzZXRzQnl0ZXMpCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NTgKICAgIC8vIGNvbnN0IGJhbGFuY2UgPSBBc3NldEhvbGRpbmcuYXNzZXRCYWxhbmNlKGFjY291bnQsIGFrdGEpWzBdCiAgICBmcmFtZV9kaWcgLTIKICAgIHN3YXAKICAgIGFzc2V0X2hvbGRpbmdfZ2V0IEFzc2V0QmFsYW5jZQogICAgcG9wCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czozNgogICAgLy8gZXhwb3J0IGNvbnN0IFRFTl9USE9VU0FORF9BS0lUQTogdWludDY0ID0gMTBfMDAwXzAwMF8wMDAKICAgIGludGMgNyAvLyAxMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ2MQogICAgLy8gaWYgKGJhbGFuY2UgPCBURU5fVEhPVVNBTkRfQUtJVEEpIHsKICAgIDwKICAgIGJ6IHVzZXJJbXBhY3RfYWZ0ZXJfaWZfZWxzZUAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ2MgogICAgLy8gcmV0dXJuIDAKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9idXJ5IDIKCnVzZXJJbXBhY3RfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuZ2V0SGVsZEFrdGFJbXBhY3RTY29yZUAxMToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1NzYKICAgIC8vIGNvbnN0IHByZWZpeCA9IGFzc2V0LnVuaXROYW1lLnNsaWNlKDAsIDMpCiAgICBmcmFtZV9kaWcgMTMKICAgIGR1cAogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldFVuaXROYW1lCiAgICBhc3NlcnQgLy8gYXNzZXQgZXhpc3RzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18wIC8vIDAKICAgIGRpZyAxCiAgICA+PQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgcHVzaGludCAzIC8vIDMKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCAzIC8vIDMKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHN1YnN0cmluZzMKICAgIGZyYW1lX2J1cnkgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU3NwogICAgLy8gY29uc3QgYmFsYW5jZSA9IEFzc2V0SG9sZGluZy5hc3NldEJhbGFuY2UoYWNjb3VudCwgYXNzZXQpWzBdCiAgICBmcmFtZV9kaWcgLTIKICAgIGRpZyAxCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIHBvcAogICAgZnJhbWVfYnVyeSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTc4CiAgICAvLyBpZiAoYXNzZXQuY3JlYXRvciA9PT0gQWNjb3VudChBa2l0YU5GVENyZWF0b3JBZGRyZXNzKSAmJiBiYWxhbmNlID4gMCkgewogICAgYXNzZXRfcGFyYW1zX2dldCBBc3NldENyZWF0b3IKICAgIGFzc2VydCAvLyBhc3NldCBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9jb25zdGFudHMudHM6NjIKICAgIC8vIGV4cG9ydCBjb25zdCBBa2l0YU5GVENyZWF0b3JBZGRyZXNzID0gJ0FLQ1RSREs0T1dOV0hUUEg0WFBLTE5XTkxaMzMzVkUzNVNLUTRGR1FLM1pKQTRGSUhDTFRSRzNQRkknCiAgICBieXRlYyA2IC8vIGFkZHIgQUtDVFJESzRPV05XSFRQSDRYUEtMTldOTFozMzNWRTM1U0tRNEZHUUszWkpBNEZJSENMVFJHM1BGSQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU3OAogICAgLy8gaWYgKGFzc2V0LmNyZWF0b3IgPT09IEFjY291bnQoQWtpdGFORlRDcmVhdG9yQWRkcmVzcykgJiYgYmFsYW5jZSA+IDApIHsKICAgID09CiAgICBieiB1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMTkKICAgIGZyYW1lX2RpZyAxCiAgICBieiB1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMTkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1NzkKICAgIC8vIGlmIChwcmVmaXggPT09IEJ5dGVzKEFraXRhQ29sbGVjdGlvbnNQcmVmaXhBS0MpKSB7CiAgICBmcmFtZV9kaWcgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo2NAogICAgLy8gZXhwb3J0IGNvbnN0IEFraXRhQ29sbGVjdGlvbnNQcmVmaXhBS0MgPSAnQUtDJwogICAgcHVzaGJ5dGVzICJBS0MiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTc5CiAgICAvLyBpZiAocHJlZml4ID09PSBCeXRlcyhBa2l0YUNvbGxlY3Rpb25zUHJlZml4QUtDKSkgewogICAgPT0KICAgIGJ6IHVzZXJJbXBhY3RfYWZ0ZXJfaWZfZWxzZUAxNgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU4MAogICAgLy8gcmV0dXJuIDUwCiAgICBwdXNoaW50IDUwIC8vIDUwCgp1c2VySW1wYWN0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldE5GVEltcGFjdFNjb3JlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQxMAogICAgLy8gY29uc3QgdG90YWw6IHVpbnQ2NCA9IHN0YWtlZEFrdGFJbXBhY3QgKyBzdWJzY3JpYmVySW1wYWN0ICsgc29jaWFsSW1wYWN0ICsgbmZkU2NvcmUgKyBoZWxkQWtpdGFJbXBhY3QgKyBuZnRJbXBhY3QKICAgIGZyYW1lX2RpZyA1CiAgICBmcmFtZV9kaWcgNgogICAgKwogICAgZnJhbWVfZGlnIDQKICAgICsKICAgIGZyYW1lX2RpZyAzCiAgICArCiAgICBmcmFtZV9kaWcgMgogICAgKwogICAgKwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MTEKICAgIC8vIGlmICh0b3RhbCA9PT0gMCkgewogICAgYm56IHVzZXJJbXBhY3RfYWZ0ZXJfaWZfZWxzZUA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDEyCiAgICAvLyByZXR1cm4gMQogICAgaW50Y18xIC8vIDEKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgp1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MTUKICAgIC8vIHJldHVybiB0b3RhbAogICAgZnJhbWVfZGlnIDkKICAgIGZyYW1lX2J1cnkgMAogICAgcmV0c3ViCgp1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTgyCiAgICAvLyBpZiAocHJlZml4ID09PSBCeXRlcyhBa2l0YUNvbGxlY3Rpb25zUHJlZml4QU9HKSkgewogICAgZnJhbWVfZGlnIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9jb25zdGFudHMudHM6NjUKICAgIC8vIGV4cG9ydCBjb25zdCBBa2l0YUNvbGxlY3Rpb25zUHJlZml4QU9HID0gJ0FPRycKICAgIHB1c2hieXRlcyAiQU9HIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU4MgogICAgLy8gaWYgKHByZWZpeCA9PT0gQnl0ZXMoQWtpdGFDb2xsZWN0aW9uc1ByZWZpeEFPRykpIHsKICAgID09CiAgICBieiB1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMTkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1ODMKICAgIC8vIHJldHVybiAyNQogICAgcHVzaGludCAyNSAvLyAyNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQwOAogICAgLy8gY29uc3QgbmZ0SW1wYWN0ID0gdGhpcy5nZXRORlRJbXBhY3RTY29yZShhY2NvdW50LCBBc3NldChtZXRhLmFraXRhTkZUKSkgLy8gSG9sZHMgQUtDL09tbmlnZW0gfCA1MAogICAgYiB1c2VySW1wYWN0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldE5GVEltcGFjdFNjb3JlQDIwCgp1c2VySW1wYWN0X2FmdGVyX2lmX2Vsc2VAMTk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTg2CiAgICAvLyByZXR1cm4gMAogICAgaW50Y18wIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MDgKICAgIC8vIGNvbnN0IG5mdEltcGFjdCA9IHRoaXMuZ2V0TkZUSW1wYWN0U2NvcmUoYWNjb3VudCwgQXNzZXQobWV0YS5ha2l0YU5GVCkpIC8vIEhvbGRzIEFLQy9PbW5pZ2VtIHwgNTAKICAgIGIgdXNlckltcGFjdF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbEltcGFjdC5nZXRORlRJbXBhY3RTY29yZUAyMAoKdXNlckltcGFjdF9hZnRlcl9pZl9lbHNlQDEwOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ2NQogICAgLy8gY29uc3QgY2FwcGVkID0gYmFsYW5jZSA+PSBPTkVfTUlMTElPTl9BS0lUQSA/IE9ORV9NSUxMSU9OX0FLSVRBIDogYmFsYW5jZQogICAgZnJhbWVfZGlnIDEKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czozNAogICAgLy8gZXhwb3J0IGNvbnN0IE9ORV9NSUxMSU9OX0FLSVRBOiB1aW50NjQgPSAxXzAwMF8wMDBfMDAwXzAwMAogICAgaW50YyA0IC8vIDEwMDAwMDAwMDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NjUKICAgIC8vIGNvbnN0IGNhcHBlZCA9IGJhbGFuY2UgPj0gT05FX01JTExJT05fQUtJVEEgPyBPTkVfTUlMTElPTl9BS0lUQSA6IGJhbGFuY2UKICAgID49CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjM0CiAgICAvLyBleHBvcnQgY29uc3QgT05FX01JTExJT05fQUtJVEE6IHVpbnQ2NCA9IDFfMDAwXzAwMF8wMDBfMDAwCiAgICBpbnRjIDQgLy8gMTAwMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ2NQogICAgLy8gY29uc3QgY2FwcGVkID0gYmFsYW5jZSA+PSBPTkVfTUlMTElPTl9BS0lUQSA/IE9ORV9NSUxMSU9OX0FLSVRBIDogYmFsYW5jZQogICAgc3dhcAogICAgc2VsZWN0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDY2CiAgICAvLyByZXR1cm4gKGNhcHBlZCAqIDUwKSAvIE9ORV9NSUxMSU9OX0FLSVRBCiAgICBwdXNoaW50IDUwIC8vIDUwCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjM0CiAgICAvLyBleHBvcnQgY29uc3QgT05FX01JTExJT05fQUtJVEE6IHVpbnQ2NCA9IDFfMDAwXzAwMF8wMDBfMDAwCiAgICBpbnRjIDQgLy8gMTAwMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ2NgogICAgLy8gcmV0dXJuIChjYXBwZWQgKiA1MCkgLyBPTkVfTUlMTElPTl9BS0lUQQogICAgLwogICAgZnJhbWVfYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDA3CiAgICAvLyBjb25zdCBoZWxkQWtpdGFJbXBhY3QgPSB0aGlzLmdldEhlbGRBa3RhSW1wYWN0U2NvcmUoYWNjb3VudCkgLy8gSGVsZCBBS1RBIHwgdXAgdG8gNTAKICAgIGIgdXNlckltcGFjdF9hZnRlcl9pbmxpbmVkX3NtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbEltcGFjdC5nZXRIZWxkQWt0YUltcGFjdFNjb3JlQDExCgp1c2VySW1wYWN0X3Rlcm5hcnlfZmFsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0MDUKICAgIC8vIGNvbnN0IHNvY2lhbEltcGFjdCA9IGluY2x1ZGVTb2NpYWwgPyB0aGlzLmdldFNvY2lhbEltcGFjdFNjb3JlKGFjY291bnQpIDogVWludDY0KDApIC8vIFNvY2lhbCBBY3Rpdml0eSB8IHVwIHRvIDI1MAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgNAogICAgYiB1c2VySW1wYWN0X3Rlcm5hcnlfbWVyZ2VAMwoKdXNlckltcGFjdF9lbHNlX2JvZHlAMzc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDg0CiAgICAvLyBzdWJzY3JpYmVySW1wYWN0ICs9IChzdWJzY3JpcHRpb25TdGF0ZS5zdHJlYWsgKiAyMCkgLyBtb2RpZmllcgogICAgZnJhbWVfZGlnIDgKICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICoKICAgIHN3YXAKICAgIC8KICAgIGZyYW1lX2J1cnkgNgogICAgYiB1c2VySW1wYWN0X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldFN1YnNjcmliZXJJbXBhY3RTY29yZUAzOQoKdXNlckltcGFjdF9hZnRlcl9pZl9lbHNlQDI4OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ0NQogICAgLy8gY29uc3QgYW10Q2FwcGVkID0gaW5mby5hbW91bnQgPj0gVFdPX0hVTkRSRURfVEhPVVNBTkRfQUtJVEEgPyBUV09fSFVORFJFRF9USE9VU0FORF9BS0lUQSA6IGluZm8uYW1vdW50CiAgICBmcmFtZV9kaWcgMTQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MzUKICAgIC8vIGV4cG9ydCBjb25zdCBUV09fSFVORFJFRF9USE9VU0FORF9BS0lUQTogdWludDY0ID0gMjAwXzAwMF8wMDBfMDAwCiAgICBpbnRjIDUgLy8gMjAwMDAwMDAwMDAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDQ1CiAgICAvLyBjb25zdCBhbXRDYXBwZWQgPSBpbmZvLmFtb3VudCA+PSBUV09fSFVORFJFRF9USE9VU0FORF9BS0lUQSA/IFRXT19IVU5EUkVEX1RIT1VTQU5EX0FLSVRBIDogaW5mby5hbW91bnQKICAgID49CiAgICBieiB1c2VySW1wYWN0X3Rlcm5hcnlfZmFsc2VAMzAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MzUKICAgIC8vIGV4cG9ydCBjb25zdCBUV09fSFVORFJFRF9USE9VU0FORF9BS0lUQTogdWludDY0ID0gMjAwXzAwMF8wMDBfMDAwCiAgICBpbnRjIDUgLy8gMjAwMDAwMDAwMDAwCgp1c2VySW1wYWN0X3Rlcm5hcnlfbWVyZ2VAMzE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNDQ4CiAgICAvLyBjb25zdCBtYXhTY29yZTogdWludDY0ID0gKGFtdENhcHBlZCAqIDI1MCkgLyBUV09fSFVORFJFRF9USE9VU0FORF9BS0lUQQogICAgcHVzaGludCAyNTAgLy8gMjUwCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjM1CiAgICAvLyBleHBvcnQgY29uc3QgVFdPX0hVTkRSRURfVEhPVVNBTkRfQUtJVEE6IHVpbnQ2NCA9IDIwMF8wMDBfMDAwXzAwMAogICAgaW50YyA1IC8vIDIwMDAwMDAwMDAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ0OAogICAgLy8gY29uc3QgbWF4U2NvcmU6IHVpbnQ2NCA9IChhbXRDYXBwZWQgKiAyNTApIC8gVFdPX0hVTkRSRURfVEhPVVNBTkRfQUtJVEEKICAgIC8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NTEKICAgIC8vIGNvbnN0IHRpbWVDYXBwZWQgPSBlbGFwc2VkID49IE9ORV9ZRUFSID8gT05FX1lFQVIgOiBlbGFwc2VkCiAgICBmcmFtZV9kaWcgMTUKICAgIGR1cAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czozMgogICAgLy8gZXhwb3J0IGNvbnN0IE9ORV9ZRUFSOiB1aW50NjQgPSAzMV81MzZfMDAwCiAgICBpbnRjIDYgLy8gMzE1MzYwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NTEKICAgIC8vIGNvbnN0IHRpbWVDYXBwZWQgPSBlbGFwc2VkID49IE9ORV9ZRUFSID8gT05FX1lFQVIgOiBlbGFwc2VkCiAgICA+PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czozMgogICAgLy8gZXhwb3J0IGNvbnN0IE9ORV9ZRUFSOiB1aW50NjQgPSAzMV81MzZfMDAwCiAgICBpbnRjIDYgLy8gMzE1MzYwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NTEKICAgIC8vIGNvbnN0IHRpbWVDYXBwZWQgPSBlbGFwc2VkID49IE9ORV9ZRUFSID8gT05FX1lFQVIgOiBlbGFwc2VkCiAgICBzd2FwCiAgICBzZWxlY3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE0NTMKICAgIC8vIHJldHVybiAodGltZUNhcHBlZCAqIG1heFNjb3JlKSAvIE9ORV9ZRUFSCiAgICAqCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjMyCiAgICAvLyBleHBvcnQgY29uc3QgT05FX1lFQVI6IHVpbnQ2NCA9IDMxXzUzNl8wMDAKICAgIGludGMgNiAvLyAzMTUzNjAwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQ1MwogICAgLy8gcmV0dXJuICh0aW1lQ2FwcGVkICogbWF4U2NvcmUpIC8gT05FX1lFQVIKICAgIC8KICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTQwMwogICAgLy8gY29uc3Qgc3Rha2VkQWt0YUltcGFjdCA9IHRoaXMuZ2V0U3Rha2luZ0ltcGFjdFNjb3JlKGFjY291bnQpIC8vIFN0YWtlZCBBS1RBIHwgdXAgdG8gMjUwCiAgICBiIHVzZXJJbXBhY3RfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuZ2V0U3Rha2luZ0ltcGFjdFNjb3JlQDMyCgp1c2VySW1wYWN0X3Rlcm5hcnlfZmFsc2VAMzA6CiAgICBmcmFtZV9kaWcgMTQKICAgIGIgdXNlckltcGFjdF90ZXJuYXJ5X21lcmdlQDMxCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0Lm5mZFJlYWRGaWVsZChORkRBcHA6IHVpbnQ2NCwgZmllbGQ6IGJ5dGVzKSAtPiBieXRlczoKbmZkUmVhZEZpZWxkOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUwMQogICAgLy8gcHJpdmF0ZSBuZmRSZWFkRmllbGQoTkZEQXBwOiBBcHBsaWNhdGlvbiwgZmllbGQ6IHN0cmluZyk6IGJ5dGVzIHsKICAgIHByb3RvIDIgMQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUwMi0xNTA5CiAgICAvLyBjb25zdCBmaWVsZEJ5dGVzID0gYWJpQ2FsbCgKICAgIC8vICAgTkZELnByb3RvdHlwZS5yZWFkRmllbGQsCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogTkZEQXBwLmlkLAogICAgLy8gICAgIGFyZ3M6IFtCeXRlcyhmaWVsZCldLAogICAgLy8gICAgIGZlZSwKICAgIC8vICAgfQogICAgLy8gKS5yZXR1cm5WYWx1ZQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUwNgogICAgLy8gYXJnczogW0J5dGVzKGZpZWxkKV0sCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTAyLTE1MDkKICAgIC8vIGNvbnN0IGZpZWxkQnl0ZXMgPSBhYmlDYWxsKAogICAgLy8gICBORkQucHJvdG90eXBlLnJlYWRGaWVsZCwKICAgIC8vICAgewogICAgLy8gICAgIGFwcElkOiBORkRBcHAuaWQsCiAgICAvLyAgICAgYXJnczogW0J5dGVzKGZpZWxkKV0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9CiAgICAvLyApLnJldHVyblZhbHVlCiAgICBieXRlYyA3IC8vIG1ldGhvZCAicmVhZEZpZWxkKGJ5dGVbXSlieXRlW10iCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGZyYW1lX2RpZyAtMgogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbklECiAgICBpbnRjXzIgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo0CiAgICAvLyBleHBvcnQgY29uc3QgZmVlOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1MDItMTUwOQogICAgLy8gY29uc3QgZmllbGRCeXRlcyA9IGFiaUNhbGwoCiAgICAvLyAgIE5GRC5wcm90b3R5cGUucmVhZEZpZWxkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IE5GREFwcC5pZCwKICAgIC8vICAgICBhcmdzOiBbQnl0ZXMoZmllbGQpXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0KICAgIC8vICkucmV0dXJuVmFsdWUKICAgIGl0eG5fc3VibWl0CiAgICBpdHhuIExhc3RMb2cKICAgIGR1cAogICAgZXh0cmFjdCAwIDQKICAgIGJ5dGVjXzEgLy8gMHgxNTFmN2M3NQogICAgPT0KICAgIGFzc2VydCAvLyBCeXRlcyBoYXMgdmFsaWQgcHJlZml4CiAgICBleHRyYWN0IDYgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUxMQogICAgLy8gcmV0dXJuIGZpZWxkQnl0ZXMKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjpBa2l0YVNvY2lhbEltcGFjdC5jcmVhdGUoYWtpdGFEQU86IHVpbnQ2NCwgdmVyc2lvbjogYnl0ZXMpIC0+IHZvaWQ6CmNyZWF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1OTEtMTU5MgogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIC8vIGNyZWF0ZShha2l0YURBTzogdWludDY0LCB2ZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHsKICAgIHByb3RvIDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czozCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlWZXJzaW9uID0gJ3ZlcnNpb24nCiAgICBieXRlYyA4IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU5MwogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gdmVyc2lvbgogICAgZnJhbWVfZGlnIC0xCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czoxCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlBa2l0YURBTyA9ICdha2l0YV9kYW8nCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTk0CiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYWtpdGFEQU8pCiAgICBmcmFtZV9kaWcgLTIKICAgIGFwcF9nbG9iYWxfcHV0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuY2FjaGVNZXRhKHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsIE5GREFwcElEOiB1aW50NjQsIGFraXRhQXNzZXRJRDogdWludDY0KSAtPiB1aW50NjQ6CmNhY2hlTWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1OTkKICAgIC8vIGNhY2hlTWV0YShzdWJzY3JpcHRpb25JbmRleDogdWludDY0LCBORkRBcHBJRDogdWludDY0LCBha2l0YUFzc2V0SUQ6IHVpbnQ2NCk6IHVpbnQ2NCB7CiAgICBwcm90byAzIDEKICAgIGludGNfMCAvLyAwCiAgICBkdXBuIDYKICAgIHB1c2hieXRlcyAiIgogICAgZHVwbiA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjAwCiAgICAvLyBpZiAoc3Vic2NyaXB0aW9uSW5kZXggIT09IDApIHsKICAgIGZyYW1lX2RpZyAtMwogICAgYnogY2FjaGVNZXRhX2FmdGVyX2lmX2Vsc2VAMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwMQogICAgLy8gYXNzZXJ0KHRoaXMuaXNTdWJzY3JpYmVkKFR4bi5zZW5kZXIsIHN1YnNjcmlwdGlvbkluZGV4KS5hY3RpdmUsIEVSUl9OT1RfQV9TVUJTQ1JJUFRJT04pCiAgICB0eG4gU2VuZGVyCiAgICBmcmFtZV9kaWcgLTMKICAgIGNhbGxzdWIgaXNTdWJzY3JpYmVkCiAgICBwb3BuIDIKICAgIGFzc2VydCAvLyBOb3QgYW4gYWtpdGEgc3Vic2NyaXB0aW9uIGNvbnRyYWN0CgpjYWNoZU1ldGFfYWZ0ZXJfaWZfZWxzZUAyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwNAogICAgLy8gbGV0IG5mZFRpbWVDaGFuZ2VkOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAxMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwNQogICAgLy8gbGV0IG5mZEltcGFjdDogdWludDY0ID0gMAogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2J1cnkgOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwNgogICAgLy8gaWYgKE5GREFwcElEICE9PSAwKSB7CiAgICBmcmFtZV9kaWcgLTIKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNjEKICAgIC8vIGNvbnN0IFtuZmROYW1lQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoTkZEQXBwLCBCeXRlcyhORkRHbG9iYWxTdGF0ZUtleXNOYW1lKSkKICAgIGZyYW1lX2RpZyAtMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoxOAogICAgLy8gZXhwb3J0IGNvbnN0IE5GREdsb2JhbFN0YXRlS2V5c05hbWUgPSAnaS5uYW1lJwogICAgcHVzaGJ5dGVzICJpLm5hbWUiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzYxCiAgICAvLyBjb25zdCBbbmZkTmFtZUJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKE5GREFwcCwgQnl0ZXMoTkZER2xvYmFsU3RhdGVLZXlzTmFtZSkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzYzLTEzNzAKICAgIC8vIHJldHVybiBhYmlDYWxsKAogICAgLy8gICBORkRSZWdpc3RyeS5wcm90b3R5cGUuaXNWYWxpZE5mZEFwcElkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5uZmRSZWdpc3RyeSwKICAgIC8vICAgICBhcmdzOiBbU3RyaW5nKG5mZE5hbWVCeXRlcyksIE5GREFwcC5pZF0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9CiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvY29uc3RhbnRzLnRzOjEKICAgIC8vIGV4cG9ydCBjb25zdCBHbG9iYWxTdGF0ZUtleUFraXRhREFPID0gJ2FraXRhX2RhbycKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2Rhby9jb25zdGFudHMudHM6OQogICAgLy8gZXhwb3J0IGNvbnN0IEFraXRhREFPR2xvYmFsU3RhdGVLZXlzT3RoZXJBcHBMaXN0ID0gJ290aGVyX2FsJwogICAgcHVzaGJ5dGVzICJvdGhlcl9hbCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6MzUKICAgIC8vIGNvbnN0IFtvdGhlckFwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNPdGhlckFwcExpc3QpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czozNgogICAgLy8gcmV0dXJuIGRlY29kZUFyYzQ8T3RoZXJBcHBMaXN0PihvdGhlckFwcExpc3RCeXRlcykKICAgIGludGNfMyAvLyA4CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM2NwogICAgLy8gYXJnczogW1N0cmluZyhuZmROYW1lQnl0ZXMpLCBORkRBcHAuaWRdLAogICAgZGlnIDEKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBmcmFtZV9kaWcgLTIKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNjMtMTM3MAogICAgLy8gcmV0dXJuIGFiaUNhbGwoCiAgICAvLyAgIE5GRFJlZ2lzdHJ5LnByb3RvdHlwZS5pc1ZhbGlkTmZkQXBwSWQsCiAgICAvLyAgIHsKICAgIC8vICAgICBhcHBJZDogZ2V0T3RoZXJBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpLm5mZFJlZ2lzdHJ5LAogICAgLy8gICAgIGFyZ3M6IFtTdHJpbmcobmZkTmFtZUJ5dGVzKSwgTkZEQXBwLmlkXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0KICAgIC8vICkucmV0dXJuVmFsdWUKICAgIHB1c2hieXRlcyAweDRiZTIyZmM2IC8vIG1ldGhvZCAiaXNWYWxpZE5mZEFwcElkKHN0cmluZyx1aW50NjQpYm9vbCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25JRAogICAgaW50Y18yIC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9jb25zdGFudHMudHM6NAogICAgLy8gZXhwb3J0IGNvbnN0IGZlZTogdWludDY0ID0gMAogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzYzLTEzNzAKICAgIC8vIHJldHVybiBhYmlDYWxsKAogICAgLy8gICBORkRSZWdpc3RyeS5wcm90b3R5cGUuaXNWYWxpZE5mZEFwcElkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IGdldE90aGVyQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5uZmRSZWdpc3RyeSwKICAgIC8vICAgICBhcmdzOiBbU3RyaW5nKG5mZE5hbWVCeXRlcyksIE5GREFwcC5pZF0sCiAgICAvLyAgICAgZmVlLAogICAgLy8gICB9CiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgNCAwCiAgICBzd2FwCiAgICBleHRyYWN0IDAgNAogICAgYnl0ZWNfMSAvLyAweDE1MWY3Yzc1CiAgICA9PQogICAgYXNzZXJ0IC8vIEJ5dGVzIGhhcyB2YWxpZCBwcmVmaXgKICAgIGludGNfMCAvLyAwCiAgICBnZXRiaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MDgKICAgIC8vIGFzc2VydCh0aGlzLmlzTkZEKG5mZEFwcCksIEVSUl9OT1RfQU5fTkZEKQogICAgYXNzZXJ0IC8vIE5vdCBhbiBORkQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MDkKICAgIC8vIGFzc2VydCh0aGlzLmFkZHJlc3NWZXJpZmllZE9uTkZEKFR4bi5zZW5kZXIsIG5mZEFwcCksIEVSUl9VU0VSX0RPRVNfTk9UX09XTl9ORkQpCiAgICB0eG4gU2VuZGVyCiAgICBmcmFtZV9idXJ5IDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNzUtMTM4NAogICAgLy8gY29uc3QgY2FBbGdvRGF0YSA9IGFiaUNhbGwoCiAgICAvLyAgIE5GRC5wcm90b3R5cGUucmVhZEZpZWxkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IE5GREFwcC5pZCwKICAgIC8vICAgICBhcmdzOiBbCiAgICAvLyAgICAgICBCeXRlcyhORkRNZXRhS2V5VmVyaWZpZWRBZGRyZXNzZXMpCiAgICAvLyAgICAgXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0sCiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpdHhuX2JlZ2luCiAgICBieXRlYyA3IC8vIG1ldGhvZCAicmVhZEZpZWxkKGJ5dGVbXSlieXRlW10iCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoyMwogICAgLy8gZXhwb3J0IGNvbnN0IE5GRE1ldGFLZXlWZXJpZmllZEFkZHJlc3NlcyA9ICd2LmNhQWxnby4wLmFzJwogICAgcHVzaGJ5dGVzIDB4MDAwZDc2MmU2MzYxNDE2YzY3NmYyZTMwMmU2MTczCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgZnJhbWVfZGlnIC0yCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNzUtMTM4NAogICAgLy8gY29uc3QgY2FBbGdvRGF0YSA9IGFiaUNhbGwoCiAgICAvLyAgIE5GRC5wcm90b3R5cGUucmVhZEZpZWxkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IE5GREFwcC5pZCwKICAgIC8vICAgICBhcmdzOiBbCiAgICAvLyAgICAgICBCeXRlcyhORkRNZXRhS2V5VmVyaWZpZWRBZGRyZXNzZXMpCiAgICAvLyAgICAgXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0sCiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpbnRjXzIgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2NvbnN0YW50cy50czo0CiAgICAvLyBleHBvcnQgY29uc3QgZmVlOiB1aW50NjQgPSAwCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzNzUtMTM4NAogICAgLy8gY29uc3QgY2FBbGdvRGF0YSA9IGFiaUNhbGwoCiAgICAvLyAgIE5GRC5wcm90b3R5cGUucmVhZEZpZWxkLAogICAgLy8gICB7CiAgICAvLyAgICAgYXBwSWQ6IE5GREFwcC5pZCwKICAgIC8vICAgICBhcmdzOiBbCiAgICAvLyAgICAgICBCeXRlcyhORkRNZXRhS2V5VmVyaWZpZWRBZGRyZXNzZXMpCiAgICAvLyAgICAgXSwKICAgIC8vICAgICBmZWUsCiAgICAvLyAgIH0sCiAgICAvLyApLnJldHVyblZhbHVlCiAgICBpdHhuX3N1Ym1pdAogICAgaXR4biBMYXN0TG9nCiAgICBkdXAKICAgIGV4dHJhY3QgMCA0CiAgICBieXRlY18xIC8vIDB4MTUxZjdjNzUKICAgID09CiAgICBhc3NlcnQgLy8gQnl0ZXMgaGFzIHZhbGlkIHByZWZpeAogICAgZXh0cmFjdCA2IDAKICAgIGZyYW1lX2J1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM4NgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGNhQWxnb0RhdGEubGVuZ3RoOyBpICs9IDMyKSB7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSA3CgpjYWNoZU1ldGFfd2hpbGVfdG9wQDE0OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM4NgogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IGNhQWxnb0RhdGEubGVuZ3RoOyBpICs9IDMyKSB7CiAgICBmcmFtZV9kaWcgMgogICAgbGVuCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMTEKICAgIGZyYW1lX2RpZyA3CiAgICA+CiAgICBieiBjYWNoZU1ldGFfYWZ0ZXJfd2hpbGVAMTkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzODcKICAgIC8vIGNvbnN0IGFkZHIgPSBjYUFsZ29EYXRhLnNsaWNlKGksIGkgKyAzMikKICAgIGZyYW1lX2RpZyA3CiAgICBkdXAKICAgIGZyYW1lX2RpZyAxMQogICAgZHVwCiAgICBjb3ZlciAzCiAgICA+PQogICAgZGlnIDEKICAgIGRpZyAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgc3dhcAogICAgcHVzaGludCAzMiAvLyAzMgogICAgKwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDcKICAgIGR1cAogICAgZGlnIDMKICAgID49CiAgICBzd2FwCiAgICB1bmNvdmVyIDMKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBkdXAKICAgIGRpZyAyCiAgICA8CiAgICBkaWcgMgogICAgc3dhcAogICAgc2VsZWN0CiAgICBmcmFtZV9kaWcgMgogICAgY292ZXIgMgogICAgc3Vic3RyaW5nMwogICAgZHVwCiAgICBmcmFtZV9idXJ5IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzODgKICAgIC8vIGlmIChhZGRyICE9PSBHbG9iYWwuemVyb0FkZHJlc3MuYnl0ZXMgJiYgYWRkciA9PT0gYWNjb3VudC5ieXRlcykgewogICAgZ2xvYmFsIFplcm9BZGRyZXNzCiAgICAhPQogICAgYnogY2FjaGVNZXRhX3doaWxlX3RvcEAxNAogICAgZnJhbWVfZGlnIDEKICAgIGZyYW1lX2RpZyAwCiAgICA9PQogICAgYnogY2FjaGVNZXRhX3doaWxlX3RvcEAxNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM4OQogICAgLy8gcmV0dXJuIHRydWUKICAgIGludGNfMSAvLyAxCgpjYWNoZU1ldGFfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuYWRkcmVzc1ZlcmlmaWVkT25ORkRAMjA6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjA5CiAgICAvLyBhc3NlcnQodGhpcy5hZGRyZXNzVmVyaWZpZWRPbk5GRChUeG4uc2VuZGVyLCBuZmRBcHApLCBFUlJfVVNFUl9ET0VTX05PVF9PV05fTkZEKQogICAgYXNzZXJ0IC8vIFVzZXIgZG9lcyBub3Qgb3duIHRoaXMgTkZECiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjEwCiAgICAvLyBjb25zdCBbdGltZUNoYW5nZWRCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhuZmRBcHAsIEJ5dGVzKE5GREdsb2JhbFN0YXRlS2V5c1RpbWVDaGFuZ2VkKSkKICAgIGZyYW1lX2RpZyAtMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoyMQogICAgLy8gZXhwb3J0IGNvbnN0IE5GREdsb2JhbFN0YXRlS2V5c1RpbWVDaGFuZ2VkID0gJ2kudGltZUNoYW5nZWQnCiAgICBieXRlYyA1IC8vICJpLnRpbWVDaGFuZ2VkIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYxMAogICAgLy8gY29uc3QgW3RpbWVDaGFuZ2VkQnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMobmZkQXBwLCBCeXRlcyhORkRHbG9iYWxTdGF0ZUtleXNUaW1lQ2hhbmdlZCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjExCiAgICAvLyBuZmRUaW1lQ2hhbmdlZCA9IGJ0b2kodGltZUNoYW5nZWRCeXRlcykKICAgIGJ0b2kKICAgIGZyYW1lX2J1cnkgMTAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1MjUKICAgIC8vIGxldCBuZmRJbXBhY3Q6IHVpbnQ2NCA9IDUwCiAgICBwdXNoaW50IDUwIC8vIDUwCiAgICBkdXAKICAgIGZyYW1lX2J1cnkgOAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUyNwogICAgLy8gY29uc3QgW3BhcmVudEFwcElEQnl0ZXMsIHBhcmVudEFwcElEQnl0ZXNFeGlzdF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhORkRBcHAsIEJ5dGVzKE5GREdsb2JhbFN0YXRlS2V5c1BhcmVudEFwcElEKSkKICAgIGZyYW1lX2RpZyAtMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoxOQogICAgLy8gZXhwb3J0IGNvbnN0IE5GREdsb2JhbFN0YXRlS2V5c1BhcmVudEFwcElEID0gJ2kucGFyZW50QXBwSUQnCiAgICBwdXNoYnl0ZXMgImkucGFyZW50QXBwSUQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTI3CiAgICAvLyBjb25zdCBbcGFyZW50QXBwSURCeXRlcywgcGFyZW50QXBwSURCeXRlc0V4aXN0XSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKE5GREFwcCwgQnl0ZXMoTkZER2xvYmFsU3RhdGVLZXlzUGFyZW50QXBwSUQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHN3YXAKICAgIGZyYW1lX2J1cnkgNAogICAgc3dhcAogICAgZnJhbWVfYnVyeSA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTI5CiAgICAvLyBpZiAocGFyZW50QXBwSURCeXRlc0V4aXN0ICYmIGJ0b2kocGFyZW50QXBwSURCeXRlcykgPT09IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ha2l0YU5GRCkgewogICAgYnogY2FjaGVNZXRhX2FmdGVyX2lmX2Vsc2VAMjQKICAgIGZyYW1lX2RpZyA0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvY29uc3RhbnRzLnRzOjEKICAgIC8vIGV4cG9ydCBjb25zdCBHbG9iYWxTdGF0ZUtleUFraXRhREFPID0gJ2FraXRhX2RhbycKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2Rhby9jb25zdGFudHMudHM6NwogICAgLy8gZXhwb3J0IGNvbnN0IEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFBcHBMaXN0ID0gJ2FraXRhX2FsJwogICAgYnl0ZWNfMiAvLyAiYWtpdGFfYWwiCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhQXBwTGlzdCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjI2CiAgICAvLyByZXR1cm4gZGVjb2RlQXJjNDxBa2l0YUFwcExpc3Q+KGFwcExpc3RCeXRlcykKICAgIHB1c2hpbnQgODggLy8gODgKICAgIGV4dHJhY3RfdWludDY0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTI5CiAgICAvLyBpZiAocGFyZW50QXBwSURCeXRlc0V4aXN0ICYmIGJ0b2kocGFyZW50QXBwSURCeXRlcykgPT09IGdldEFraXRhQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKS5ha2l0YU5GRCkgewogICAgPT0KICAgIGZyYW1lX2RpZyA4CiAgICBmcmFtZV9idXJ5IDkKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDI0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTMwCiAgICAvLyBuZmRJbXBhY3QgKz0gNTAKICAgIHB1c2hpbnQgMTAwIC8vIDEwMAogICAgZnJhbWVfYnVyeSA5CgpjYWNoZU1ldGFfYWZ0ZXJfaWZfZWxzZUAyNDoKICAgIGZyYW1lX2RpZyA5CiAgICBmcmFtZV9idXJ5IDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1MzMKICAgIC8vIGNvbnN0IHZlcnNpb24gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhORkRBcHAsIEJ5dGVzKE5GREdsb2JhbFN0YXRlS2V5c1ZlcnNpb24pKVswXS5zbGljZSgwLCAyKQogICAgZnJhbWVfZGlnIC0yCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjIwCiAgICAvLyBleHBvcnQgY29uc3QgTkZER2xvYmFsU3RhdGVLZXlzVmVyc2lvbiA9ICdpLnZlcicKICAgIHB1c2hieXRlcyAiaS52ZXIiCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTMzCiAgICAvLyBjb25zdCB2ZXJzaW9uID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoTkZEQXBwLCBCeXRlcyhORkRHbG9iYWxTdGF0ZUtleXNWZXJzaW9uKSlbMF0uc2xpY2UoMCwgMikKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDEKICAgID49CiAgICBpbnRjXzAgLy8gMAogICAgZGlnIDIKICAgIHVuY292ZXIgMgogICAgc2VsZWN0CiAgICBwdXNoaW50IDIgLy8gMgogICAgZGlnIDIKICAgID49CiAgICBwdXNoaW50IDIgLy8gMgogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgc3Vic3RyaW5nMwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUzNQogICAgLy8gaWYgKHZlcnNpb24gIT09IEJ5dGVzKCczLicpKSB7CiAgICBwdXNoYnl0ZXMgIjMuIgogICAgIT0KICAgIGJueiBjYWNoZU1ldGFfYWZ0ZXJfaWZfZWxzZUA0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTE1CiAgICAvLyBjb25zdCBkb21haW4gPSB0aGlzLm5mZFJlYWRGaWVsZChORkRBcHAsIE5GRE1ldGFLZXlWZXJpZmllZERvbWFpbikKICAgIGZyYW1lX2RpZyAtMgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoyNAogICAgLy8gZXhwb3J0IGNvbnN0IE5GRE1ldGFLZXlWZXJpZmllZERvbWFpbiA9ICd2LmRvbWFpbicKICAgIHB1c2hieXRlcyAidi5kb21haW4iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTE1CiAgICAvLyBjb25zdCBkb21haW4gPSB0aGlzLm5mZFJlYWRGaWVsZChORkRBcHAsIE5GRE1ldGFLZXlWZXJpZmllZERvbWFpbikKICAgIGNhbGxzdWIgbmZkUmVhZEZpZWxkCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTE2CiAgICAvLyBjb25zdCB0d2l0dGVyID0gdGhpcy5uZmRSZWFkRmllbGQoTkZEQXBwLCBORkRNZXRhS2V5VmVyaWZpZWRUd2l0dGVyKQogICAgZnJhbWVfZGlnIC0yCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjI1CiAgICAvLyBleHBvcnQgY29uc3QgTkZETWV0YUtleVZlcmlmaWVkVHdpdHRlciA9ICd2LnR3aXR0ZXInCiAgICBwdXNoYnl0ZXMgInYudHdpdHRlciIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1MTYKICAgIC8vIGNvbnN0IHR3aXR0ZXIgPSB0aGlzLm5mZFJlYWRGaWVsZChORkRBcHAsIE5GRE1ldGFLZXlWZXJpZmllZFR3aXR0ZXIpCiAgICBjYWxsc3ViIG5mZFJlYWRGaWVsZAogICAgZnJhbWVfYnVyeSA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTE3CiAgICAvLyBjb25zdCBkaXNjb3JkID0gdGhpcy5uZmRSZWFkRmllbGQoTkZEQXBwLCBORkRNZXRhS2V5VmVyaWZpZWREaXNjb3JkKQogICAgZnJhbWVfZGlnIC0yCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjI2CiAgICAvLyBleHBvcnQgY29uc3QgTkZETWV0YUtleVZlcmlmaWVkRGlzY29yZCA9ICd2LmRpc2NvcmQnCiAgICBwdXNoYnl0ZXMgInYuZGlzY29yZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE1MTcKICAgIC8vIGNvbnN0IGRpc2NvcmQgPSB0aGlzLm5mZFJlYWRGaWVsZChORkRBcHAsIE5GRE1ldGFLZXlWZXJpZmllZERpc2NvcmQpCiAgICBjYWxsc3ViIG5mZFJlYWRGaWVsZAogICAgZnJhbWVfYnVyeSAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTE4CiAgICAvLyBjb25zdCB0ZWxlZ3JhbSA9IHRoaXMubmZkUmVhZEZpZWxkKE5GREFwcCwgTkZETWV0YUtleVZlcmlmaWVkVGVsZWdyYW0pCiAgICBmcmFtZV9kaWcgLTIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MjcKICAgIC8vIGV4cG9ydCBjb25zdCBORkRNZXRhS2V5VmVyaWZpZWRUZWxlZ3JhbSA9ICd2LnRlbGVncmFtJwogICAgcHVzaGJ5dGVzICJ2LnRlbGVncmFtIgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTUxOAogICAgLy8gY29uc3QgdGVsZWdyYW0gPSB0aGlzLm5mZFJlYWRGaWVsZChORkRBcHAsIE5GRE1ldGFLZXlWZXJpZmllZFRlbGVncmFtKQogICAgY2FsbHN1YiBuZmRSZWFkRmllbGQKICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU0MgogICAgLy8gaWYgKGRvbWFpbi5sZW5ndGggPiAwKSB7CiAgICBsZW4KICAgIGZyYW1lX2RpZyA4CiAgICBmcmFtZV9idXJ5IDkKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDI4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTQzCiAgICAvLyBuZmRJbXBhY3QgKz0gMTAKICAgIGZyYW1lX2RpZyA4CiAgICBwdXNoaW50IDEwIC8vIDEwCiAgICArCiAgICBmcmFtZV9idXJ5IDkKCmNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDI4OgogICAgZnJhbWVfZGlnIDkKICAgIGR1cAogICAgZnJhbWVfYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTQ3CiAgICAvLyBpZiAodHdpdHRlci5sZW5ndGggPiAwKSB7CiAgICBmcmFtZV9kaWcgNgogICAgbGVuCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDkKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDMwCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTQ4CiAgICAvLyBuZmRJbXBhY3QgKz0gMjAKICAgIGZyYW1lX2RpZyA4CiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICArCiAgICBmcmFtZV9idXJ5IDkKCmNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDMwOgogICAgZnJhbWVfZGlnIDkKICAgIGR1cAogICAgZnJhbWVfYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTUyCiAgICAvLyBpZiAoZGlzY29yZC5sZW5ndGggPiAwKSB7CiAgICBmcmFtZV9kaWcgMwogICAgbGVuCiAgICBzd2FwCiAgICBmcmFtZV9idXJ5IDkKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDMyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTUzCiAgICAvLyBuZmRJbXBhY3QgKz0gMTAKICAgIGZyYW1lX2RpZyA4CiAgICBwdXNoaW50IDEwIC8vIDEwCiAgICArCiAgICBmcmFtZV9idXJ5IDkKCmNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDMyOgogICAgZnJhbWVfZGlnIDkKICAgIGR1cAogICAgZnJhbWVfYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNTU3CiAgICAvLyBpZiAodGVsZWdyYW0ubGVuZ3RoID4gMCkgewogICAgZnJhbWVfZGlnIDUKICAgIGxlbgogICAgc3dhcAogICAgZnJhbWVfYnVyeSA5CiAgICBieiBjYWNoZU1ldGFfYWZ0ZXJfaWZfZWxzZUAzNAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTU1OAogICAgLy8gbmZkSW1wYWN0ICs9IDEwCiAgICBmcmFtZV9kaWcgOAogICAgcHVzaGludCAxMCAvLyAxMAogICAgKwogICAgZnJhbWVfYnVyeSA5CgpjYWNoZU1ldGFfYWZ0ZXJfaWZfZWxzZUAzNDoKICAgIGZyYW1lX2RpZyA5CiAgICBmcmFtZV9idXJ5IDgKCmNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjE1CiAgICAvLyBpZiAoYWtpdGFBc3NldElEICE9PSAwKSB7CiAgICBmcmFtZV9kaWcgLTEKICAgIGJ6IGNhY2hlTWV0YV9hZnRlcl9pZl9lbHNlQDYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzOTcKICAgIC8vIHJldHVybiBha2l0YU5GVC5jcmVhdG9yID09PSBBY2NvdW50KEFraXRhTkZUQ3JlYXRvckFkZHJlc3MpCiAgICBmcmFtZV9kaWcgLTEKICAgIGFzc2V0X3BhcmFtc19nZXQgQXNzZXRDcmVhdG9yCiAgICBhc3NlcnQgLy8gYXNzZXQgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvY29uc3RhbnRzLnRzOjYyCiAgICAvLyBleHBvcnQgY29uc3QgQWtpdGFORlRDcmVhdG9yQWRkcmVzcyA9ICdBS0NUUkRLNE9XTldIVFBINFhQS0xOV05MWjMzM1ZFMzVTS1E0RkdRSzNaSkE0RklIQ0xUUkczUEZJJwogICAgYnl0ZWMgNiAvLyBhZGRyIEFLQ1RSREs0T1dOV0hUUEg0WFBLTE5XTkxaMzMzVkUzNVNLUTRGR1FLM1pKQTRGSUhDTFRSRzNQRkkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjEzOTcKICAgIC8vIHJldHVybiBha2l0YU5GVC5jcmVhdG9yID09PSBBY2NvdW50KEFraXRhTkZUQ3JlYXRvckFkZHJlc3MpCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYxNwogICAgLy8gYXNzZXJ0KHRoaXMuaXNBa2l0YU5GVChha2l0YU5GVCksIEVSUl9OT1RfQU5fQUtJVEFfTkZUKQogICAgYXNzZXJ0IC8vIE5vdCBhbiBha2l0YSBORlQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MTgKICAgIC8vIGFzc2VydCh0aGlzLnVzZXJIb2xkcyhUeG4uc2VuZGVyLCBha2l0YU5GVCksIEVSUl9VU0VSX0RPRVNfTk9UX09XTl9ORlQpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxMzI3CiAgICAvLyByZXR1cm4gQXNzZXRIb2xkaW5nLmFzc2V0QmFsYW5jZShhY2NvdW50LCBORlQpWzBdID4gMAogICAgZnJhbWVfZGlnIC0xCiAgICBhc3NldF9ob2xkaW5nX2dldCBBc3NldEJhbGFuY2UKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYxOAogICAgLy8gYXNzZXJ0KHRoaXMudXNlckhvbGRzKFR4bi5zZW5kZXIsIGFraXRhTkZUKSwgRVJSX1VTRVJfRE9FU19OT1RfT1dOX05GVCkKICAgIGFzc2VydCAvLyBVc2VyIGRvZXMgbm90IG93biB0aGlzIE5GVAoKY2FjaGVNZXRhX2FmdGVyX2lmX2Vsc2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MjIKICAgIC8vIHN1YnNjcmlwdGlvbkluZGV4OiBuZXcgVWludE42NChzdWJzY3JpcHRpb25JbmRleCksCiAgICBmcmFtZV9kaWcgLTMKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MjMKICAgIC8vIE5GRDogbmV3IFVpbnRONjQoTkZEQXBwSUQpLAogICAgZnJhbWVfZGlnIC0yCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjI0CiAgICAvLyBuZmRUaW1lQ2hhbmdlZDogbmV3IFVpbnRONjQobmZkVGltZUNoYW5nZWQpLAogICAgZnJhbWVfZGlnIDEwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjI1CiAgICAvLyBuZmRJbXBhY3Q6IG5ldyBVaW50TjY0KG5mZEltcGFjdCksCiAgICBmcmFtZV9kaWcgOAogICAgZHVwCiAgICBjb3ZlciA0CiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjI2CiAgICAvLyBha2l0YU5GVDogbmV3IFVpbnRONjQoYWtpdGFBc3NldElEKSwKICAgIGZyYW1lX2RpZyAtMQogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYyMS0xNjI3CiAgICAvLyB0aGlzLm1ldGEoVHhuLnNlbmRlcikudmFsdWUgPSBuZXcgYXJjNEltcGFjdE1ldGFWYWx1ZSh7CiAgICAvLyAgIHN1YnNjcmlwdGlvbkluZGV4OiBuZXcgVWludE42NChzdWJzY3JpcHRpb25JbmRleCksCiAgICAvLyAgIE5GRDogbmV3IFVpbnRONjQoTkZEQXBwSUQpLAogICAgLy8gICBuZmRUaW1lQ2hhbmdlZDogbmV3IFVpbnRONjQobmZkVGltZUNoYW5nZWQpLAogICAgLy8gICBuZmRJbXBhY3Q6IG5ldyBVaW50TjY0KG5mZEltcGFjdCksCiAgICAvLyAgIGFraXRhTkZUOiBuZXcgVWludE42NChha2l0YUFzc2V0SUQpLAogICAgLy8gfSkKICAgIHVuY292ZXIgNAogICAgdW5jb3ZlciA0CiAgICBjb25jYXQKICAgIHVuY292ZXIgMwogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjE1CiAgICAvLyBleHBvcnQgY29uc3QgSW1wYWN0Qm94UHJlZml4TWV0YSA9ICdtJwogICAgYnl0ZWNfMyAvLyAibSIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MjEKICAgIC8vIHRoaXMubWV0YShUeG4uc2VuZGVyKS52YWx1ZSA9IG5ldyBhcmM0SW1wYWN0TWV0YVZhbHVlKHsKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb25zdGFudHMudHM6MTUKICAgIC8vIGV4cG9ydCBjb25zdCBJbXBhY3RCb3hQcmVmaXhNZXRhID0gJ20nCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MjEtMTYyNwogICAgLy8gdGhpcy5tZXRhKFR4bi5zZW5kZXIpLnZhbHVlID0gbmV3IGFyYzRJbXBhY3RNZXRhVmFsdWUoewogICAgLy8gICBzdWJzY3JpcHRpb25JbmRleDogbmV3IFVpbnRONjQoc3Vic2NyaXB0aW9uSW5kZXgpLAogICAgLy8gICBORkQ6IG5ldyBVaW50TjY0KE5GREFwcElEKSwKICAgIC8vICAgbmZkVGltZUNoYW5nZWQ6IG5ldyBVaW50TjY0KG5mZFRpbWVDaGFuZ2VkKSwKICAgIC8vICAgbmZkSW1wYWN0OiBuZXcgVWludE42NChuZmRJbXBhY3QpLAogICAgLy8gICBha2l0YU5GVDogbmV3IFVpbnRONjQoYWtpdGFBc3NldElEKSwKICAgIC8vIH0pCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjI5CiAgICAvLyByZXR1cm4gbmZkSW1wYWN0CiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKY2FjaGVNZXRhX2FmdGVyX3doaWxlQDE5OgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTM5MwogICAgLy8gcmV0dXJuIGZhbHNlCiAgICBpbnRjXzAgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYwOQogICAgLy8gYXNzZXJ0KHRoaXMuYWRkcmVzc1ZlcmlmaWVkT25ORkQoVHhuLnNlbmRlciwgbmZkQXBwKSwgRVJSX1VTRVJfRE9FU19OT1RfT1dOX05GRCkKICAgIGIgY2FjaGVNZXRhX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmFkZHJlc3NWZXJpZmllZE9uTkZEQDIwCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LnVwZGF0ZVN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIocGF5bWVudDogdWludDY0LCBzdWJzY3JpcHRpb25JbmRleDogdWludDY0LCBuZXdNb2RpZmllcjogdWludDY0KSAtPiB2b2lkOgp1cGRhdGVTdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzMgogICAgLy8gdXBkYXRlU3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcihwYXltZW50OiBndHhuLlBheW1lbnRUeG4sIHN1YnNjcmlwdGlvbkluZGV4OiB1aW50NjQsIG5ld01vZGlmaWVyOiB1aW50NjQpOiB2b2lkIHsKICAgIHByb3RvIDMgMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzMwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuYWtpdGFEQU8udmFsdWUuYWRkcmVzcywgRVJSX05PVF9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvY29uc3RhbnRzLnRzOjEKICAgIC8vIGV4cG9ydCBjb25zdCBHbG9iYWxTdGF0ZUtleUFraXRhREFPID0gJ2FraXRhX2RhbycKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzMwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuYWtpdGFEQU8udmFsdWUuYWRkcmVzcywgRVJSX05PVF9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE5vdCB0aGUgREFPCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjM1CiAgICAvLyB0aGlzLnN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIoc3Vic2NyaXB0aW9uSW5kZXgpLnZhbHVlID0gbmV3TW9kaWZpZXIKICAgIGZyYW1lX2RpZyAtMgogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnN0YW50cy50czoxNgogICAgLy8gZXhwb3J0IGNvbnN0IEltcGFjdEJveFByZWZpeFN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIgPSAncycKICAgIHB1c2hieXRlcyAicyIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzNQogICAgLy8gdGhpcy5zdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyKHN1YnNjcmlwdGlvbkluZGV4KS52YWx1ZSA9IG5ld01vZGlmaWVyCiAgICBmcmFtZV9kaWcgLTEKICAgIGl0b2IKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MzctMTY0NAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icigpLnN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZnJhbWVfZGlnIC0zCiAgICBndHhucyBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY0MAogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MzctMTY0NAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icigpLnN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIGJ6IHVwZGF0ZVN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXJfYm9vbF9mYWxzZUAzCiAgICBmcmFtZV9kaWcgLTMKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTMyMgogICAgLy8gc3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcjogOV8zMDAsCiAgICBwdXNoaW50IDkzMDAgLy8gOTMwMAogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTYzNy0xNjQ0CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMubWJyKCkuc3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgYnogdXBkYXRlU3Vic2NyaXB0aW9uU3RhdGVNb2RpZmllcl9ib29sX2ZhbHNlQDMKICAgIGludGNfMSAvLyAxCgp1cGRhdGVTdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyX2Jvb2xfbWVyZ2VANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2MzctMTY0NAogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLm1icigpLnN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudAogICAgcmV0c3ViCgp1cGRhdGVTdWJzY3JpcHRpb25TdGF0ZU1vZGlmaWVyX2Jvb2xfZmFsc2VAMzoKICAgIGludGNfMCAvLyAwCiAgICBiIHVwZGF0ZVN1YnNjcmlwdGlvblN0YXRlTW9kaWZpZXJfYm9vbF9tZXJnZUA0CgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldFVzZXJJbXBhY3RXaXRob3V0U29jaWFsKGFkZHJlc3M6IGJ5dGVzKSAtPiB1aW50NjQ6CmdldFVzZXJJbXBhY3RXaXRob3V0U29jaWFsOgogICAgLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6MTY1MC0xNjUxCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIC8vIGdldFVzZXJJbXBhY3RXaXRob3V0U29jaWFsKGFkZHJlc3M6IEFkZHJlc3MpOiB1aW50NjQgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjUyCiAgICAvLyByZXR1cm4gdGhpcy51c2VySW1wYWN0KGFkZHJlc3MubmF0aXZlLCBmYWxzZSkKICAgIGZyYW1lX2RpZyAtMQogICAgaW50Y18wIC8vIDAKICAgIGNhbGxzdWIgdXNlckltcGFjdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL2FyYzU4L3BsdWdpbnMvc29jaWFsL2NvbnRyYWN0LmFsZ28udHM6OkFraXRhU29jaWFsSW1wYWN0LmdldFVzZXJJbXBhY3QoYWRkcmVzczogYnl0ZXMpIC0+IHVpbnQ2NDoKZ2V0VXNlckltcGFjdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2NTUtMTY1NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICAvLyBnZXRVc2VySW1wYWN0KGFkZHJlc3M6IEFkZHJlc3MpOiB1aW50NjQgewogICAgcHJvdG8gMSAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjU3CiAgICAvLyByZXR1cm4gdGhpcy51c2VySW1wYWN0KGFkZHJlc3MubmF0aXZlLCB0cnVlKQogICAgZnJhbWVfZGlnIC0xCiAgICBpbnRjXzEgLy8gMQogICAgY2FsbHN1YiB1c2VySW1wYWN0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czo6QWtpdGFTb2NpYWxJbXBhY3QuZ2V0TWV0YSh1c2VyOiBieXRlcykgLT4gdWludDY0LCB1aW50NjQsIHVpbnQ2NCwgdWludDY0LCB1aW50NjQsIHVpbnQ2NCwgdWludDY0LCB1aW50NjQsIHVpbnQ2NDoKZ2V0TWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9hcmM1OC9wbHVnaW5zL3NvY2lhbC9jb250cmFjdC5hbGdvLnRzOjE2NjAtMTY2MQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICAvLyBnZXRNZXRhKHVzZXI6IEFkZHJlc3MpOiBNZXRhVmFsdWUgewogICAgcHJvdG8gMSA5CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29uc3RhbnRzLnRzOjE1CiAgICAvLyBleHBvcnQgY29uc3QgSW1wYWN0Qm94UHJlZml4TWV0YSA9ICdtJwogICAgYnl0ZWNfMyAvLyAibSIKICAgIGZyYW1lX2RpZyAtMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvYXJjNTgvcGx1Z2lucy9zb2NpYWwvY29udHJhY3QuYWxnby50czoxNjYyCiAgICAvLyByZXR1cm4gZGVjb2RlQXJjNDxNZXRhVmFsdWU+KHRoaXMubWV0YSh1c2VyLm5hdGl2ZSkudmFsdWUuYnl0ZXMpCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAxCiAgICBpbnRjXzMgLy8gOAogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyAyCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDMKICAgIHB1c2hpbnQgMjQgLy8gMjQKICAgIGV4dHJhY3RfdWludDY0CiAgICBkaWcgNAogICAgcHVzaGludCAzMiAvLyAzMgogICAgZXh0cmFjdF91aW50NjQKICAgIGRpZyA1CiAgICBwdXNoaW50IDQwIC8vIDQwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgZGlnIDYKICAgIHB1c2hpbnQgMzg0IC8vIDM4NAogICAgZ2V0Yml0CiAgICBwdXNoYnl0ZXMgMHgwMAogICAgaW50Y18wIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBpbnRjXzAgLy8gMAogICAgZ2V0Yml0CiAgICBkaWcgNwogICAgcHVzaGludCA0OSAvLyA0OQogICAgZXh0cmFjdF91aW50NjQKICAgIHVuY292ZXIgOAogICAgcHVzaGludCA1NyAvLyA1NwogICAgZXh0cmFjdF91aW50NjQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpBa2l0YUJhc2VDb250cmFjdC51cGRhdGUobmV3VmVyc2lvbjogYnl0ZXMpIC0+IHZvaWQ6CnVwZGF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjIwLTIxCiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIC8vIHVwZGF0ZShuZXdWZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHsKICAgIHByb3RvIDEgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjIKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmFraXRhREFPLnZhbHVlLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL2NvbnN0YW50cy50czoxCiAgICAvLyBleHBvcnQgY29uc3QgR2xvYmFsU3RhdGVLZXlBa2l0YURBTyA9ICdha2l0YV9kYW8nCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjIyCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5ha2l0YURBTy52YWx1ZS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9jb25zdGFudHMudHM6MwogICAgLy8gZXhwb3J0IGNvbnN0IEdsb2JhbFN0YXRlS2V5VmVyc2lvbiA9ICd2ZXJzaW9uJwogICAgYnl0ZWMgOCAvLyAidmVyc2lvbiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjIzCiAgICAvLyB0aGlzLnZlcnNpb24udmFsdWUgPSBuZXdWZXJzaW9uCiAgICBmcmFtZV9kaWcgLTEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU8oYXBwOiB1aW50NjQpIC0+IHZvaWQ6CnVwZGF0ZUFraXRhREFPOgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjgKICAgIC8vIHVwZGF0ZUFraXRhREFPKGFwcDogdWludDY0KTogdm9pZCB7CiAgICBwcm90byAxIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5ha2l0YURBTy52YWx1ZS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9jb25zdGFudHMudHM6MQogICAgLy8gZXhwb3J0IGNvbnN0IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gPSAnYWtpdGFfZGFvJwogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuYWtpdGFEQU8udmFsdWUuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICBhcHBfcGFyYW1zX2dldCBBcHBBZGRyZXNzCiAgICBhc3NlcnQgLy8gYXBwbGljYXRpb24gZXhpc3RzCiAgICA9PQogICAgYXNzZXJ0IC8vIE9ubHkgdGhlIEFraXRhIERBTyBjYW4gY2FsbCB0aGlzIGZ1bmN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvY29uc3RhbnRzLnRzOjEKICAgIC8vIGV4cG9ydCBjb25zdCBHbG9iYWxTdGF0ZUtleUFraXRhREFPID0gJ2FraXRhX2RhbycKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMwCiAgICAvLyB0aGlzLmFraXRhREFPLnZhbHVlID0gQXBwbGljYXRpb24oYXBwKQogICAgZnJhbWVfZGlnIC0xCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgcmV0c3ViCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CiAIAAEGCICglKWNHYCgt4fpBYDnhA+AyK+gJSYJCWFraXRhX2RhbwQVH3x1CGFraXRhX2FsAW0MYWtpdGFfYXNzZXRzDWkudGltZUNoYW5nZWQgAoU4jVx1m2PN5+XepbbNXne91JvslQ4U0FbykHCoOJcEbBPt5Ad2ZXJzaW9uMRtBAD+CCARvmBf2BD5u49YEnXT1oQT4HHtiBNV0uxAEKIK7igTqkYDdBDPpLJQ2GgCOCADUALcAmQCFAHEAJgASAAIiQzEZFEQxGEQ2GgEXiAZLI0MxGYEEEkQxGEQ2GgFXAgCIBiMjQzEZFEQxGEQ2GgGIBdZPCBZPCBZPCBZPCBZPCBZPCBaAAQAiTwpUTwgWTwgWTwhPCFBPB1BPBlBPBVBPBFBPA1BPAlBMUClMULAjQzEZFEQxGEQ2GgGIBYEWKUxQsCNDMRkURDEYRDYaAYgFYxYpTFCwI0MxGRREMRhEMRYjCUk4ECMSRDYaARc2GgIXiAUKI0MxGRREMRhENhoBFzYaAhc2GgMXiAKrFilMULAjQzEZFEQxGBRENhoBFzYaAlcCAIgCgiNDigIDsSIoZURJKmVIgSBbi/8WgARAFbhAshqL/rIashqyGCSyECKyAbO0PklXAAQpEkRJVwQgSwGBJFtLAoEsW0sDgTxbSwSBVFtPBYFcW08GcghETwYSSwUiEzIHSU8HCUsGGE8GCAlPBAxOAhAQTgKJigIBIoAARwgri/5QSb5ESSJbTEklW0yBIFsiKGVESScEZUgiW7FMKmVIIltMFoABAVCABMkGiAmyGov+shqyGrIYJLIQIrIBs7Q+SVcABCkSREmBBFtJTwKBDFsyB0wJTCEHDEAAC4sPgYCangEMQQFHIowFIowGi/6LC4j/D4wIjAdBABqLBxaAAXNMUL5EF4sIgQwPQQEUgfoBTAqMBov/QQECsSIoZUSACHBsdWduX2FsZUglW4AE6GmTTbIai/6yGrIYJLIQIrIBs7Q+SVcEAExXAAQpEkQXjASLCr5ESSVbSwGBEFtPAoEYW4wDSwEnBWVIF4sMTwMSRBJEIihlRCcEZUgiW4v+THAASEmMASEHDEEAeiKMAosNSXEDREkVIksBDyJLAk8CTYEDSwIPgQNPA08CTVKMAIv+SwFwAEiMAXELRCcGEkEAQIsBQQA7iwCAA0FLQxJBACCBMosFiwYIiwQIiwMIiwIICEmMCUAABCOMAImLCYwAiYsAgANBT0cSQQAFgRlC/9IiQv/OiwFJIQQPIQRMTYEyCyEECowCQv90IowEQv8wiwiBFAtMCowGQv7niw4hBQ9BABwhBYH6AQshBQqLD0khBg8hBkxNCyEGCowFQv6Yiw5C/+GKAgGxi/8VFlcGAov/UCcHshqyGov+shgkshAisgGztD5JVwAEKRJEVwYAiYoCACcIi/9nKIv+Z4mKAwEiRwaAAEcEi/1BAAoxAIv9iP1dRgJEIowKIowIi/5BAeGL/oAGaS5uYW1lZUixIihlRIAIb3RoZXJfYWxlSCVbSwEVFlcGAk8CUIv+FoAES+IvxrIaTLIashqyGCSyECKyAbO0PklXBABMVwAEKRJEIlNEMQCMALEnB7IagA8ADXYuY2FBbGdvLjAuYXOyGov+shgkshAisgGztD5JVwAEKRJEVwYAjAIijAeLAhVJjAuLBw1BAYmLB0mLC0lOAw9LAUsDTwJNTIEgCEmMB0lLAw9MTwNPAk1JSwIMSwJMTYsCTgJSSYwBMgMTQf+9iwGLABJB/7UjRIv+JwVlSBeMCoEySYwIi/6ADWkucGFyZW50QXBwSURlTIwETIwJQQAZiwQXIihlRCplSIFYWxKLCIwJQQAEgWSMCYsJjAiL/oAFaS52ZXJlSEkVIksBDyJLAk8CTYECSwIPgQJPA08CTVKAAjMuE0AAmIv+gAh2LmRvbWFpboj+S4v+gAl2LnR3aXR0ZXKI/juMBov+gAl2LmRpc2NvcmSI/imMA4v+gAp2LnRlbGVncmFtiP4WjAUViwiMCUEAB4sIgQoIjAmLCUmMCIsGFUyMCUEAB4sIgRQIjAmLCUmMCIsDFUyMCUEAB4sIgQoIjAmLCUmMCIsFFUyMCUEAB4sIgQoIjAmLCYwIi/9BABGL/3ELRCcGEkQxAIv/cABIRIv9Fov+FosKFosISU4EFov/Fk8ETwRQTwNQTwJQTFArMQBQTL+MAIkiQv6zigMAMQAiKGVEcghEEkSL/haAAXNMUIv/Fr+L/TgHMgoSQQAOi/04CIHUSBJBAAMjRIkiQv/6igEBi/8iiPtfiYoBAYv/I4j7VYmKAQkri/9QvkRJIltLASVbSwKBEFtLA4EYW0sEgSBbSwWBKFtLBoGAA1OAAQAiTwJUIlNLB4ExW08IgTlbiYoBADEAIihlRHIIRBJEJwiL/2eJigEAMQAiKGVEcghEEkQoi/9niQ==", "clear": "CoEBQw==" }, "events": [], "templateVariables": {} };
var AkitaSocialImpactParamsFactory = class _AkitaSocialImpactParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(uint64,string)void":
            return _AkitaSocialImpactParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the AkitaSocialImpact smart contract using the create(uint64,string)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(uint64,string)void",
          args: Array.isArray(params.args) ? params.args : [params.args.akitaDao, params.args.version]
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
            return _AkitaSocialImpactParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the AkitaSocialImpact smart contract using the update(string)void ABI method
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
   * Constructs a no op call for the cacheMeta(uint64,uint64,uint64)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static cacheMeta(params) {
    return {
      ...params,
      method: "cacheMeta(uint64,uint64,uint64)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.subscriptionIndex, params.args.nfdAppId, params.args.akitaAssetId]
    };
  }
  /**
   * Constructs a no op call for the updateSubscriptionStateModifier(pay,uint64,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateSubscriptionStateModifier(params) {
    return {
      ...params,
      method: "updateSubscriptionStateModifier(pay,uint64,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.subscriptionIndex, params.args.newModifier]
    };
  }
  /**
   * Constructs a no op call for the getUserImpactWithoutSocial(address)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getUserImpactWithoutSocial(params) {
    return {
      ...params,
      method: "getUserImpactWithoutSocial(address)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the getUserImpact(address)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getUserImpact(params) {
    return {
      ...params,
      method: "getUserImpact(address)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static getMeta(params) {
    return {
      ...params,
      method: "getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.user]
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
      args: Array.isArray(params.args) ? params.args : [params.args.app]
    };
  }
};
var AkitaSocialImpactFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `AkitaSocialImpactFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory3({
      ...params,
      appSpec: APP_SPEC3
    });
  }
  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  get appName() {
    return this.appFactory.appName;
  }
  /** The ARC-56 app spec being used */
  get appSpec() {
    return APP_SPEC3;
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
    return new AkitaSocialImpactClient(this.appFactory.getAppClientById(params));
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
    return new AkitaSocialImpactClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the AkitaSocialImpact smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? AkitaSocialImpactParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? AkitaSocialImpactParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0
    });
    return { result: result.result, appClient: new AkitaSocialImpactClient(result.appClient) };
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
       * Creates a new instance of the AkitaSocialImpact smart contract using the create(uint64,string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(AkitaSocialImpactParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the AkitaSocialImpact smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(AkitaSocialImpactParamsFactory.update.update(params));
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
       * Creates a new instance of the AkitaSocialImpact smart contract using the create(uint64,string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(AkitaSocialImpactParamsFactory.create.create(params));
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
       * Creates a new instance of the AkitaSocialImpact smart contract using an ABI method call using the create(uint64,string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(AkitaSocialImpactParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new AkitaSocialImpactClient(result.appClient) };
      }
    }
  };
};
var AkitaSocialImpactClient = class _AkitaSocialImpactClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient3 ? appClientOrParams : new _AppClient3({
      ...appClientOrParams,
      appSpec: APP_SPEC3
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? getArc56ReturnValue3(returnValue, this.appClient.getABIMethod(method), APP_SPEC3.structs) : void 0;
  }
  /**
   * Returns a new `AkitaSocialImpactClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _AkitaSocialImpactClient(await _AppClient3.fromCreatorAndName({ ...params, appSpec: APP_SPEC3 }));
  }
  /**
   * Returns an `AkitaSocialImpactClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _AkitaSocialImpactClient(await _AppClient3.fromNetwork({ ...params, appSpec: APP_SPEC3 }));
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
       * Updates an existing instance of the AkitaSocialImpact smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(AkitaSocialImpactParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialImpact smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `cacheMeta(uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    cacheMeta: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.cacheMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateSubscriptionStateModifier(pay,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateSubscriptionStateModifier: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.updateSubscriptionStateModifier(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpactWithoutSocial(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getUserImpactWithoutSocial: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.getUserImpactWithoutSocial(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getUserImpact: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.getUserImpact(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    getMeta: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.getMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(AkitaSocialImpactParamsFactory.updateAkitaDao(params));
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
       * Updates an existing instance of the AkitaSocialImpact smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(AkitaSocialImpactParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialImpact smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `cacheMeta(uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    cacheMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.cacheMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateSubscriptionStateModifier(pay,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateSubscriptionStateModifier: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.updateSubscriptionStateModifier(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpactWithoutSocial(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getUserImpactWithoutSocial: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.getUserImpactWithoutSocial(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getUserImpact: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.getUserImpact(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    getMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.getMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialImpactParamsFactory.updateAkitaDao(params));
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
       * Updates an existing instance of the AkitaSocialImpact smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(AkitaSocialImpactParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialImpact smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `cacheMeta(uint64,uint64,uint64)uint64` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    cacheMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.cacheMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateSubscriptionStateModifier(pay,uint64,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateSubscriptionStateModifier: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.updateSubscriptionStateModifier(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpactWithoutSocial(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getUserImpactWithoutSocial: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getUserImpactWithoutSocial(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getUserImpact(address)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getUserImpact: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getUserImpact(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    getMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialImpact smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.updateAkitaDao(params));
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
    return new _AkitaSocialImpactClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialImpact smart contract using the `getUserImpactWithoutSocial(address)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getUserImpactWithoutSocial(params) {
    const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getUserImpactWithoutSocial(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialImpact smart contract using the `getUserImpact(address)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getUserImpact(params) {
    const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getUserImpact(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialImpact smart contract using the `getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async getMeta(params) {
    const result = await this.appClient.send.call(AkitaSocialImpactParamsFactory.getMeta(params));
    return result.return;
  }
  /**
   * Methods to access state for the current AkitaSocialImpact app
   */
  state = {
    /**
     * Methods to access global state for the current AkitaSocialImpact app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          version: result.version,
          akitaDao: result.akitaDAO
        };
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
     * Methods to access box state for the current AkitaSocialImpact app
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
       * Get values from the meta map in box state
       */
      meta: {
        /**
         * Get all current values of the meta map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("meta");
        },
        /**
         * Get a current value of the meta map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("meta", key);
        }
      },
      /**
       * Get values from the subscriptionStateModifier map in box state
       */
      subscriptionStateModifier: {
        /**
         * Get all current values of the subscriptionStateModifier map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("subscriptionStateModifier");
        },
        /**
         * Get a current value of the subscriptionStateModifier map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("subscriptionStateModifier", key);
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
       * Add a cacheMeta(uint64,uint64,uint64)uint64 method call against the AkitaSocialImpact contract
       */
      cacheMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cacheMeta(params)));
        resultMappers.push((v) => client.decodeReturnValue("cacheMeta(uint64,uint64,uint64)uint64", v));
        return this;
      },
      /**
       * Add a updateSubscriptionStateModifier(pay,uint64,uint64)void method call against the AkitaSocialImpact contract
       */
      updateSubscriptionStateModifier(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateSubscriptionStateModifier(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a getUserImpactWithoutSocial(address)uint64 method call against the AkitaSocialImpact contract
       */
      getUserImpactWithoutSocial(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getUserImpactWithoutSocial(params)));
        resultMappers.push((v) => client.decodeReturnValue("getUserImpactWithoutSocial(address)uint64", v));
        return this;
      },
      /**
       * Add a getUserImpact(address)uint64 method call against the AkitaSocialImpact contract
       */
      getUserImpact(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getUserImpact(params)));
        resultMappers.push((v) => client.decodeReturnValue("getUserImpact(address)uint64", v));
        return this;
      },
      /**
       * Add a getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64) method call against the AkitaSocialImpact contract
       */
      getMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.getMeta(params)));
        resultMappers.push((v) => client.decodeReturnValue("getMeta(address)(uint64,uint64,uint64,uint64,uint64,uint64,bool,uint64,uint64)", v));
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the AkitaSocialImpact contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
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
      /**
       * Add a clear state call to the AkitaSocialImpact contract
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

// src/generated/AkitaSocialModerationClient.ts
import { getArc56ReturnValue as getArc56ReturnValue4, getABIStructFromABITuple as getABIStructFromABITuple4 } from "@algorandfoundation/algokit-utils/types/app-arc56";
import {
  AppClient as _AppClient4
} from "@algorandfoundation/algokit-utils/types/app-client";
import { AppFactory as _AppFactory4 } from "@algorandfoundation/algokit-utils/types/app-factory";
var APP_SPEC4 = { "name": "AkitaSocialModeration", "structs": { "ObjectAED1FA93": [{ "name": "exists", "type": "bool" }, { "name": "lastActive", "type": "uint64" }], "Action": [{ "name": "content", "type": "byte[36]" }] }, "methods": [{ "name": "create", "args": [{ "type": "string", "name": "version" }, { "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addModerator", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "removeModerator", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "ban", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "address", "name": "address" }, { "type": "uint64", "name": "expiration" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unban", "args": [{ "type": "address", "name": "address" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "flagPost", "args": [{ "type": "byte[32]", "name": "ref" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "unflagPost", "args": [{ "type": "byte[32]", "name": "ref" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addAction", "args": [{ "type": "pay", "name": "mbrPayment" }, { "type": "uint64", "name": "actionAppID" }, { "type": "byte[36]", "name": "content" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "removeAction", "args": [{ "type": "uint64", "name": "actionAppID" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "isBanned", "args": [{ "type": "address", "name": "account" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "isModerator", "args": [{ "type": "address", "name": "account" }], "returns": { "type": "bool" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "moderatorMeta", "args": [{ "type": "address", "name": "user" }], "returns": { "type": "(bool,uint64)", "struct": "ObjectAED1FA93" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "update", "args": [{ "type": "string", "name": "newVersion" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["UpdateApplication"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "updateAkitaDAO", "args": [{ "type": "uint64", "name": "akitaDAO" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "opUp", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 1 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "version": { "keyType": "AVMString", "valueType": "AVMString", "key": "dmVyc2lvbg==", "desc": "the current version of the contract" }, "akitaDAO": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "YWtpdGFfZGFv", "desc": "the app ID of the Akita DAO" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "moderators": { "keyType": "address", "valueType": "uint64", "desc": "Who is a moderator", "prefix": "ZA==" }, "banned": { "keyType": "address", "valueType": "uint64", "desc": "Who is banned and when they can return", "prefix": "bg==" }, "actions": { "keyType": "uint64", "valueType": "Action", "desc": "Actions usable on an akita post", "prefix": "YQ==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [285], "errorMessage": "Already a moderator" }, { "pc": [617, 671], "errorMessage": "Already an action" }, { "pc": [712, 785], "errorMessage": "Box must have value" }, { "pc": [861], "errorMessage": "Invalid app upgrade" }, { "pc": [301, 417, 633], "errorMessage": "Invalid payment" }, { "pc": [76], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [205], "errorMessage": "OnCompletion must be UpdateApplication && can only call when not creating" }, { "pc": [276, 328, 604, 660, 847, 890], "errorMessage": "Only the Akita DAO can call this function" }, { "pc": [336, 391, 438, 477, 528], "errorMessage": "Sender is not a moderator" }, { "pc": [401], "errorMessage": "This account is already banned" }, { "pc": [274, 326, 602, 658, 843, 888], "errorMessage": "application exists" }, { "pc": [268, 320, 481, 532, 596, 652, 836, 882], "errorMessage": "check GlobalState exists" }, { "pc": [222, 827], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [233, 382, 580, 645, 875], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [262, 314, 374, 430, 469, 520, 699, 745, 772], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [590], "errorMessage": "invalid number of bytes for uint8[36]" }, { "pc": [254, 366, 572], "errorMessage": "transaction type is pay" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMSAwIDMyIDggMTg5MDAgMjk3MDAKICAgIGJ5dGVjYmxvY2sgImFraXRhX2RhbyIgImQiICJ3YWxsZXQiICJuIiAweDAwIDB4MTUxZjdjNzUgInZlcnNpb24iICJzYWwiIDB4ZWFjNmQ5MjIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1CiAgICAvLyBleHBvcnQgY2xhc3MgQWtpdGFTb2NpYWxNb2RlcmF0aW9uIGV4dGVuZHMgVXBncmFkZWFibGVBa2l0YUJhc2VDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhlYTkxODBkZCAvLyBtZXRob2QgInVwZGF0ZShzdHJpbmcpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fdXBkYXRlX3JvdXRlQDIKCm1haW5fc3dpdGNoX2Nhc2VfbmV4dEAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTUKICAgIC8vIGV4cG9ydCBjbGFzcyBBa2l0YVNvY2lhbE1vZGVyYXRpb24gZXh0ZW5kcyBVcGdyYWRlYWJsZUFraXRhQmFzZUNvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxOQogICAgcHVzaGJ5dGVzcyAweDc3NjYyYzhlIDB4MDNlM2FiMjIgMHg4ZWJjMTliNSAweGEwZDIzMjFkIDB4NjFkY2QyZWYgMHg3OTYwZWE3NiAweGQ5MDY3MWI2IDB4ZjE0OTJiZjQgMHg4NDI2OWM3OCAweDcxMmVlODIzIDB4MWYzYzYxOGMgMHgzM2U5MmM5NCAweDg1NGRlZGUwIC8vIG1ldGhvZCAiYWRkTW9kZXJhdG9yKHBheSxhZGRyZXNzKXZvaWQiLCBtZXRob2QgInJlbW92ZU1vZGVyYXRvcihhZGRyZXNzKXZvaWQiLCBtZXRob2QgImJhbihwYXksYWRkcmVzcyx1aW50NjQpdm9pZCIsIG1ldGhvZCAidW5iYW4oYWRkcmVzcyl2b2lkIiwgbWV0aG9kICJmbGFnUG9zdChieXRlWzMyXSl2b2lkIiwgbWV0aG9kICJ1bmZsYWdQb3N0KGJ5dGVbMzJdKXZvaWQiLCBtZXRob2QgImFkZEFjdGlvbihwYXksdWludDY0LGJ5dGVbMzZdKXZvaWQiLCBtZXRob2QgInJlbW92ZUFjdGlvbih1aW50NjQpdm9pZCIsIG1ldGhvZCAiaXNCYW5uZWQoYWRkcmVzcylib29sIiwgbWV0aG9kICJpc01vZGVyYXRvcihhZGRyZXNzKWJvb2wiLCBtZXRob2QgIm1vZGVyYXRvck1ldGEoYWRkcmVzcykoYm9vbCx1aW50NjQpIiwgbWV0aG9kICJ1cGRhdGVBa2l0YURBTyh1aW50NjQpdm9pZCIsIG1ldGhvZCAib3BVcCgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIGFkZE1vZGVyYXRvciByZW1vdmVNb2RlcmF0b3IgYmFuIHVuYmFuIGZsYWdQb3N0IHVuZmxhZ1Bvc3QgYWRkQWN0aW9uIHJlbW92ZUFjdGlvbiBpc0Jhbm5lZCBpc01vZGVyYXRvciBtb2RlcmF0b3JNZXRhIHVwZGF0ZUFraXRhREFPIG1haW5fb3BVcF9yb3V0ZUAxNwogICAgZXJyCgptYWluX29wVXBfcm91dGVAMTc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo0MwogICAgLy8gb3BVcCgpOiB2b2lkIHsgfQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKbWFpbl9jcmVhdGVfTm9PcEAxOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1CiAgICAvLyBleHBvcnQgY2xhc3MgQWtpdGFTb2NpYWxNb2RlcmF0aW9uIGV4dGVuZHMgVXBncmFkZWFibGVBa2l0YUJhc2VDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHhjZDlhZDY3ZSAvLyBtZXRob2QgImNyZWF0ZShzdHJpbmcsdWludDY0KXZvaWQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBjcmVhdGUKICAgIGVycgoKbWFpbl91cGRhdGVfcm91dGVAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIHB1c2hpbnQgNCAvLyBVcGRhdGVBcHBsaWNhdGlvbgogICAgPT0KICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAmJgogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBtdXN0IGJlIFVwZGF0ZUFwcGxpY2F0aW9uICYmIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGIgdXBkYXRlCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OkFraXRhU29jaWFsTW9kZXJhdGlvbi5jcmVhdGVbcm91dGluZ10oKSAtPiB2b2lkOgpjcmVhdGU6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoyOAogICAgLy8gQGFiaW1ldGhvZCh7IG9uQ3JlYXRlOiAncmVxdWlyZScgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI3CiAgICAvLyB2ZXJzaW9uID0gR2xvYmFsU3RhdGU8c3RyaW5nPih7IGtleTogR2xvYmFsU3RhdGVLZXlWZXJzaW9uIH0pCiAgICBieXRlYyA2IC8vICJ2ZXJzaW9uIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MzAKICAgIC8vIHRoaXMudmVyc2lvbi52YWx1ZSA9IHZlcnNpb24KICAgIHVuY292ZXIgMgogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MzEKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURBTwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjI4CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjpBa2l0YVNvY2lhbE1vZGVyYXRpb24uYWRkTW9kZXJhdG9yW3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkTW9kZXJhdG9yOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MzYKICAgIC8vIGFkZE1vZGVyYXRvcihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzAgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18wIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czozNwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieXRlY18yIC8vICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czozNwogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjIwCiAgICAvLyBtb2RlcmF0b3JzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TW9kZXJhdG9ycyB9KQogICAgYnl0ZWNfMSAvLyAiZCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MzgKICAgIC8vIGFzc2VydCghdGhpcy5tb2RlcmF0b3JzKGFkZHJlc3MpLmV4aXN0cywgRVJSX0FMUkVBRFlfQV9NT0RFUkFUT1IpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIEFscmVhZHkgYSBtb2RlcmF0b3IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjQwLTQ3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDEKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo0MwogICAgLy8gcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjQwLTQ3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo0NAogICAgLy8gYW1vdW50OiBNb2RlcmF0b3JzTUJSCiAgICBpbnRjIDQgLy8gMTg5MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjQwLTQ3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo0OQogICAgLy8gdGhpcy5tb2RlcmF0b3JzKGFkZHJlc3MpLmNyZWF0ZSgpCiAgICBpbnRjXzMgLy8gOAogICAgYm94X2NyZWF0ZQogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czozNgogICAgLy8gYWRkTW9kZXJhdG9yKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYWRkcmVzczogQWNjb3VudCk6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjpBa2l0YVNvY2lhbE1vZGVyYXRpb24ucmVtb3ZlTW9kZXJhdG9yW3JvdXRpbmddKCkgLT4gdm9pZDoKcmVtb3ZlTW9kZXJhdG9yOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6NTIKICAgIC8vIHJlbW92ZU1vZGVyYXRvcihhZGRyZXNzOiBBY2NvdW50KTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjUzCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ5dGVjXzIgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjUzCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjAKICAgIC8vIG1vZGVyYXRvcnMgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNb2RlcmF0b3JzIH0pCiAgICBieXRlY18xIC8vICJkIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo1NAogICAgLy8gYXNzZXJ0KHRoaXMubW9kZXJhdG9ycyhhZGRyZXNzKS5leGlzdHMsIEVSUl9OT1RfQV9NT0RFUkFUT1IpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFNlbmRlciBpcyBub3QgYSBtb2RlcmF0b3IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjU2CiAgICAvLyB0aGlzLm1vZGVyYXRvcnMoYWRkcmVzcykuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6NTgtNjMKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogTW9kZXJhdG9yc01CUgogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjYwCiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjYxCiAgICAvLyBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIGludGMgNCAvLyAxODkwMAogICAgaXR4bl9maWVsZCBBbW91bnQKICAgIGl0eG5fZmllbGQgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjU4LTYyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIC8vICAgfSkKICAgIGludGNfMCAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjU4LTYzCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IE1vZGVyYXRvcnNNQlIKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6NTIKICAgIC8vIHJlbW92ZU1vZGVyYXRvcihhZGRyZXNzOiBBY2NvdW50KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OkFraXRhU29jaWFsTW9kZXJhdGlvbi5iYW5bcm91dGluZ10oKSAtPiB2b2lkOgpiYW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo2NgogICAgLy8gYmFuKG1iclBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgYWRkcmVzczogQWNjb3VudCwgZXhwaXJhdGlvbjogdWludDY0KTogdm9pZCB7CiAgICB0eG4gR3JvdXBJbmRleAogICAgaW50Y18wIC8vIDEKICAgIC0KICAgIGR1cAogICAgZ3R4bnMgVHlwZUVudW0KICAgIGludGNfMCAvLyBwYXkKICAgID09CiAgICBhc3NlcnQgLy8gdHJhbnNhY3Rpb24gdHlwZSBpcyBwYXkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjIwCiAgICAvLyBtb2RlcmF0b3JzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TW9kZXJhdG9ycyB9KQogICAgYnl0ZWNfMSAvLyAiZCIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjY3CiAgICAvLyBhc3NlcnQodGhpcy5tb2RlcmF0b3JzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX05PVF9BX01PREVSQVRPUikKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjIwCiAgICAvLyBtb2RlcmF0b3JzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TW9kZXJhdG9ycyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo2NwogICAgLy8gYXNzZXJ0KHRoaXMubW9kZXJhdG9ycyhUeG4uc2VuZGVyKS5leGlzdHMsIEVSUl9OT1RfQV9NT0RFUkFUT1IpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBTZW5kZXIgaXMgbm90IGEgbW9kZXJhdG9yCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoyMgogICAgLy8gYmFubmVkID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4QmFubmVkIH0pCiAgICBieXRlY18zIC8vICJuIgogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjY4CiAgICAvLyBhc3NlcnQoIXRoaXMuYmFubmVkKGFkZHJlc3MpLmV4aXN0cywgRVJSX0FMUkVBRFlfQkFOTkVEKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyBUaGlzIGFjY291bnQgaXMgYWxyZWFkeSBiYW5uZWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjcwLTc3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEJhbm5lZE1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgMgogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjczCiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6NzAtNzcKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBtYnJQYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogQmFubmVkTUJSCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgID09CiAgICB1bmNvdmVyIDMKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6NzQKICAgIC8vIGFtb3VudDogQmFubmVkTUJSCiAgICBpbnRjIDQgLy8gMTg5MDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjcwLTc3CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEJhbm5lZE1CUgogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICA9PQogICAgJiYKICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjc5CiAgICAvLyB0aGlzLmJhbm5lZChhZGRyZXNzKS52YWx1ZSA9IGV4cGlyYXRpb24KICAgIHN3YXAKICAgIGl0b2IKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjY2CiAgICAvLyBiYW4obWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhZGRyZXNzOiBBY2NvdW50LCBleHBpcmF0aW9uOiB1aW50NjQpOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLnVuYmFuW3JvdXRpbmddKCkgLT4gdm9pZDoKdW5iYW46CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo4MgogICAgLy8gdW5iYW4oYWRkcmVzczogQWNjb3VudCk6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoyMAogICAgLy8gbW9kZXJhdG9ycyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1vZGVyYXRvcnMgfSkKICAgIGJ5dGVjXzEgLy8gImQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo4MwogICAgLy8gYXNzZXJ0KHRoaXMubW9kZXJhdG9ycyhUeG4uc2VuZGVyKS5leGlzdHMsIEVSUl9OT1RfQV9NT0RFUkFUT1IpCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoyMAogICAgLy8gbW9kZXJhdG9ycyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1vZGVyYXRvcnMgfSkKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6ODMKICAgIC8vIGFzc2VydCh0aGlzLm1vZGVyYXRvcnMoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfTk9UX0FfTU9ERVJBVE9SKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gU2VuZGVyIGlzIG5vdCBhIG1vZGVyYXRvcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjIKICAgIC8vIGJhbm5lZCA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEJhbm5lZCB9KQogICAgYnl0ZWNfMyAvLyAibiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6ODQKICAgIC8vIHRoaXMuYmFubmVkKGFkZHJlc3MpLmRlbGV0ZSgpCiAgICBib3hfZGVsCiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjg2LTkxCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IEJhbm5lZE1CUgogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fYmVnaW4KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjg4CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjg5CiAgICAvLyBhbW91bnQ6IEJhbm5lZE1CUgogICAgaW50YyA0IC8vIDE4OTAwCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6ODYtOTAKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogQmFubmVkTUJSCiAgICAvLyAgIH0pCiAgICBpbnRjXzAgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo4Ni05MQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiBCYW5uZWRNQlIKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6ODIKICAgIC8vIHVuYmFuKGFkZHJlc3M6IEFjY291bnQpOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLmZsYWdQb3N0W3JvdXRpbmddKCkgLT4gdm9pZDoKZmxhZ1Bvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo5NAogICAgLy8gZmxhZ1Bvc3QocmVmOiBieXRlczwzMj4pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjAKICAgIC8vIG1vZGVyYXRvcnMgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNb2RlcmF0b3JzIH0pCiAgICBieXRlY18xIC8vICJkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OTUKICAgIC8vIGFzc2VydCh0aGlzLm1vZGVyYXRvcnMoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfTk9UX0FfTU9ERVJBVE9SKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjAKICAgIC8vIG1vZGVyYXRvcnMgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNb2RlcmF0b3JzIH0pCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk1CiAgICAvLyBhc3NlcnQodGhpcy5tb2RlcmF0b3JzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX05PVF9BX01PREVSQVRPUikKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIFNlbmRlciBpcyBub3QgYSBtb2RlcmF0b3IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk3CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo5NwogICAgLy8gY29uc3QgeyBzb2NpYWwgfSA9IGdldEFraXRhU29jaWFsQXBwTGlzdCh0aGlzLmFraXRhREFPLnZhbHVlKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9mdW5jdGlvbnMudHM6NDUKICAgIC8vIGNvbnN0IFthcHBMaXN0Qnl0ZXNdID0gb3AuQXBwR2xvYmFsLmdldEV4Qnl0ZXMoYWtpdGFEQU8sIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzQWtpdGFTb2NpYWxBcHBMaXN0KSkKICAgIGJ5dGVjIDcgLy8gInNhbCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk3CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzEgLy8gMAogICAgZXh0cmFjdF91aW50NjQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk4LTEwMQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnNldFBvc3RGbGFnPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtyZWYsIHRydWVdCiAgICAvLyB9KQogICAgaXR4bl9iZWdpbgogICAgYnl0ZWMgOCAvLyBtZXRob2QgInNldFBvc3RGbGFnKGJ5dGVbMzJdLGJvb2wpdm9pZCIKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBzd2FwCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTAwCiAgICAvLyBhcmdzOiBbcmVmLCB0cnVlXQogICAgcHVzaGJ5dGVzIDB4ODAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk4LTEwMQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnNldFBvc3RGbGFnPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtyZWYsIHRydWVdCiAgICAvLyB9KQogICAgcHVzaGludCA2IC8vIGFwcGwKICAgIGl0eG5fZmllbGQgVHlwZUVudW0KICAgIGludGNfMSAvLyAwCiAgICBpdHhuX2ZpZWxkIEZlZQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjk0CiAgICAvLyBmbGFnUG9zdChyZWY6IGJ5dGVzPDMyPik6IHZvaWQgewogICAgaW50Y18wIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjpBa2l0YVNvY2lhbE1vZGVyYXRpb24udW5mbGFnUG9zdFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnVuZmxhZ1Bvc3Q6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMDQKICAgIC8vIHVuZmxhZ1Bvc3QocmVmOiBieXRlczwzMj4pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjAKICAgIC8vIG1vZGVyYXRvcnMgPSBCb3hNYXA8QWNjb3VudCwgdWludDY0Pih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhNb2RlcmF0b3JzIH0pCiAgICBieXRlY18xIC8vICJkIgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTA1CiAgICAvLyBhc3NlcnQodGhpcy5tb2RlcmF0b3JzKFR4bi5zZW5kZXIpLmV4aXN0cywgRVJSX05PVF9BX01PREVSQVRPUikKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjIwCiAgICAvLyBtb2RlcmF0b3JzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TW9kZXJhdG9ycyB9KQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMDUKICAgIC8vIGFzc2VydCh0aGlzLm1vZGVyYXRvcnMoVHhuLnNlbmRlcikuZXhpc3RzLCBFUlJfTk9UX0FfTU9ERVJBVE9SKQogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICBhc3NlcnQgLy8gU2VuZGVyIGlzIG5vdCBhIG1vZGVyYXRvcgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTA3CiAgICAvLyBjb25zdCB7IHNvY2lhbCB9ID0gZ2V0QWtpdGFTb2NpYWxBcHBMaXN0KHRoaXMuYWtpdGFEQU8udmFsdWUpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMDcKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvZnVuY3Rpb25zLnRzOjQ1CiAgICAvLyBjb25zdCBbYXBwTGlzdEJ5dGVzXSA9IG9wLkFwcEdsb2JhbC5nZXRFeEJ5dGVzKGFraXRhREFPLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c0FraXRhU29jaWFsQXBwTGlzdCkpCiAgICBieXRlYyA3IC8vICJzYWwiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMDcKICAgIC8vIGNvbnN0IHsgc29jaWFsIH0gPSBnZXRBa2l0YVNvY2lhbEFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkKICAgIGludGNfMSAvLyAwCiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTA4LTExMQogICAgLy8gYWJpQ2FsbDx0eXBlb2YgQWtpdGFTb2NpYWwucHJvdG90eXBlLnNldFBvc3RGbGFnPih7CiAgICAvLyAgIGFwcElkOiBzb2NpYWwsCiAgICAvLyAgIGFyZ3M6IFtyZWYsIGZhbHNlXQogICAgLy8gfSkKICAgIGl0eG5fYmVnaW4KICAgIGJ5dGVjIDggLy8gbWV0aG9kICJzZXRQb3N0RmxhZyhieXRlWzMyXSxib29sKXZvaWQiCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uQXJncwogICAgc3dhcAogICAgaXR4bl9maWVsZCBBcHBsaWNhdGlvbkFyZ3MKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjExMAogICAgLy8gYXJnczogW3JlZiwgZmFsc2VdCiAgICBieXRlYyA0IC8vIDB4MDAKICAgIGl0eG5fZmllbGQgQXBwbGljYXRpb25BcmdzCiAgICBpdHhuX2ZpZWxkIEFwcGxpY2F0aW9uSUQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjEwOC0xMTEKICAgIC8vIGFiaUNhbGw8dHlwZW9mIEFraXRhU29jaWFsLnByb3RvdHlwZS5zZXRQb3N0RmxhZz4oewogICAgLy8gICBhcHBJZDogc29jaWFsLAogICAgLy8gICBhcmdzOiBbcmVmLCBmYWxzZV0KICAgIC8vIH0pCiAgICBwdXNoaW50IDYgLy8gYXBwbAogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18xIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTA0CiAgICAvLyB1bmZsYWdQb3N0KHJlZjogYnl0ZXM8MzI+KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OkFraXRhU29jaWFsTW9kZXJhdGlvbi5hZGRBY3Rpb25bcm91dGluZ10oKSAtPiB2b2lkOgphZGRBY3Rpb246CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMTQKICAgIC8vIGFkZEFjdGlvbihtYnJQYXltZW50OiBndHhuLlBheW1lbnRUeG4sIGFjdGlvbkFwcElEOiB1aW50NjQsIGNvbnRlbnQ6IENJRCk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMCAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMzYgLy8gMzYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzM2XQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTE1CiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgdHhuIFNlbmRlcgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgaW50Y18xIC8vIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MzIKICAgIC8vIGNvbnN0IFt3YWxsZXRJRF0gPSBvcC5BcHBHbG9iYWwuZ2V0RXhVaW50NjQodGhpcy5ha2l0YURBTy52YWx1ZSwgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNXYWxsZXQpKQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIGJ5dGVjXzIgLy8gIndhbGxldCIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBwb3AKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjExNQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjExNgogICAgLy8gYXNzZXJ0KCF0aGlzLmFjdGlvbnMoYWN0aW9uQXBwSUQpLmV4aXN0cywgRVJSX0FMUkVBRFlfQU5fQUNUSU9OKQogICAgc3dhcAogICAgaXRvYgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjQKICAgIC8vIGFjdGlvbnMgPSBCb3hNYXA8dWludDY0LCBBY3Rpb24+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEFjdGlvbnMgfSkKICAgIHB1c2hieXRlcyAiYSIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTE2CiAgICAvLyBhc3NlcnQoIXRoaXMuYWN0aW9ucyhhY3Rpb25BcHBJRCkuZXhpc3RzLCBFUlJfQUxSRUFEWV9BTl9BQ1RJT04pCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgIQogICAgYXNzZXJ0IC8vIEFscmVhZHkgYW4gYWN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMTgtMTI1CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEFjdGlvbnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgZGlnIDIKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMjEKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMTgtMTI1CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEFjdGlvbnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgMwogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMjIKICAgIC8vIGFtb3VudDogQWN0aW9uc01CUgogICAgaW50YyA1IC8vIDI5NzAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMTgtMTI1CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgbWJyUGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IEFjdGlvbnNNQlIKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMjcKICAgIC8vIHRoaXMuYWN0aW9ucyhhY3Rpb25BcHBJRCkudmFsdWUgPSB7IGNvbnRlbnQgfQogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTE0CiAgICAvLyBhZGRBY3Rpb24obWJyUGF5bWVudDogZ3R4bi5QYXltZW50VHhuLCBhY3Rpb25BcHBJRDogdWludDY0LCBjb250ZW50OiBDSUQpOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLnJlbW92ZUFjdGlvbltyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlbW92ZUFjdGlvbjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjEzMAogICAgLy8gcmVtb3ZlQWN0aW9uKGFjdGlvbkFwcElEOiB1aW50NjQpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMzEKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgYnl0ZWNfMiAvLyAid2FsbGV0IgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTMxCiAgICAvLyBhc3NlcnQoVHhuLnNlbmRlciA9PT0gdGhpcy5nZXRBa2l0YURBT1dhbGxldCgpLmFkZHJlc3MsIEVSUl9OT1RfQUtJVEFfREFPKQogICAgYXBwX3BhcmFtc19nZXQgQXBwQWRkcmVzcwogICAgYXNzZXJ0IC8vIGFwcGxpY2F0aW9uIGV4aXN0cwogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTMyCiAgICAvLyBhc3NlcnQodGhpcy5hY3Rpb25zKGFjdGlvbkFwcElEKS5leGlzdHMsIEVSUl9BTFJFQURZX0FOX0FDVElPTikKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjI0CiAgICAvLyBhY3Rpb25zID0gQm94TWFwPHVpbnQ2NCwgQWN0aW9uPih7IGtleVByZWZpeDogQWtpdGFTb2NpYWxCb3hQcmVmaXhBY3Rpb25zIH0pCiAgICBwdXNoYnl0ZXMgImEiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjEzMgogICAgLy8gYXNzZXJ0KHRoaXMuYWN0aW9ucyhhY3Rpb25BcHBJRCkuZXhpc3RzLCBFUlJfQUxSRUFEWV9BTl9BQ1RJT04pCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIEFscmVhZHkgYW4gYWN0aW9uCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMzQKICAgIC8vIHRoaXMuYWN0aW9ucyhhY3Rpb25BcHBJRCkuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTM2LTE0MQogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiBBY3Rpb25zTUJSCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9iZWdpbgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTM4CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjEzOQogICAgLy8gYW1vdW50OiBBY3Rpb25zTUJSCiAgICBpbnRjIDUgLy8gMjk3MDAKICAgIGl0eG5fZmllbGQgQW1vdW50CiAgICBpdHhuX2ZpZWxkIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMzYtMTQwCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IEFjdGlvbnNNQlIKICAgIC8vICAgfSkKICAgIGludGNfMCAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjEzNi0xNDEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogQWN0aW9uc01CUgogICAgLy8gICB9KQogICAgLy8gICAuc3VibWl0KCkKICAgIGl0eG5fc3VibWl0CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxMzAKICAgIC8vIHJlbW92ZUFjdGlvbihhY3Rpb25BcHBJRDogdWludDY0KTogdm9pZCB7CiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OkFraXRhU29jaWFsTW9kZXJhdGlvbi5pc0Jhbm5lZFtyb3V0aW5nXSgpIC0+IHZvaWQ6CmlzQmFubmVkOgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTQ2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzIgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MjIKICAgIC8vIGJhbm5lZCA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeEJhbm5lZCB9KQogICAgYnl0ZWNfMyAvLyAibiIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxNDgKICAgIC8vIHJldHVybiB0aGlzLmJhbm5lZChhY2NvdW50KS5leGlzdHMgJiYgdGhpcy5iYW5uZWQoYWNjb3VudCkudmFsdWUgPiBHbG9iYWwubGF0ZXN0VGltZXN0YW1wCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IGlzQmFubmVkX2Jvb2xfZmFsc2VANAogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgYnRvaQogICAgZ2xvYmFsIExhdGVzdFRpbWVzdGFtcAogICAgPgogICAgYnogaXNCYW5uZWRfYm9vbF9mYWxzZUA0CiAgICBpbnRjXzAgLy8gMQoKaXNCYW5uZWRfYm9vbF9tZXJnZUA1OgogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTQ2CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgwMAogICAgaW50Y18xIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgppc0Jhbm5lZF9ib29sX2ZhbHNlQDQ6CiAgICBpbnRjXzEgLy8gMAogICAgYiBpc0Jhbm5lZF9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLmlzTW9kZXJhdG9yW3JvdXRpbmddKCkgLT4gdm9pZDoKaXNNb2RlcmF0b3I6CiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxNTEKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBsZW4KICAgIGludGNfMiAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoyMAogICAgLy8gbW9kZXJhdG9ycyA9IEJveE1hcDxBY2NvdW50LCB1aW50NjQ+KHsga2V5UHJlZml4OiBBa2l0YVNvY2lhbEJveFByZWZpeE1vZGVyYXRvcnMgfSkKICAgIGJ5dGVjXzEgLy8gImQiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1MwogICAgLy8gcmV0dXJuIHRoaXMubW9kZXJhdG9ycyhhY2NvdW50KS5leGlzdHMKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTUxCiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjIDQgLy8gMHgwMAogICAgaW50Y18xIC8vIDAKICAgIHVuY292ZXIgMgogICAgc2V0Yml0CiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6OkFraXRhU29jaWFsTW9kZXJhdGlvbi5tb2RlcmF0b3JNZXRhW3JvdXRpbmddKCkgLT4gdm9pZDoKbW9kZXJhdG9yTWV0YToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18yIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjIwCiAgICAvLyBtb2RlcmF0b3JzID0gQm94TWFwPEFjY291bnQsIHVpbnQ2ND4oeyBrZXlQcmVmaXg6IEFraXRhU29jaWFsQm94UHJlZml4TW9kZXJhdG9ycyB9KQogICAgYnl0ZWNfMSAvLyAiZCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgZHVwCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxNTgKICAgIC8vIGlmICh0aGlzLm1vZGVyYXRvcnModXNlcikuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJ6IG1vZGVyYXRvck1ldGFfYWZ0ZXJfaWZfZWxzZUAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czoxNjEKICAgIC8vIGxhc3RBY3RpdmU6IHRoaXMubW9kZXJhdG9ycyh1c2VyKS52YWx1ZQogICAgZHVwCiAgICBib3hfZ2V0CiAgICBhc3NlcnQgLy8gQm94IG11c3QgaGF2ZSB2YWx1ZQogICAgYnRvaQogICAgLy8gc21hcnRfY29udHJhY3RzL3NvY2lhbC9tb2RlcmF0aW9uLmFsZ28udHM6MTU5LTE2MgogICAgLy8gcmV0dXJuIHsKICAgIC8vICAgZXhpc3RzOiB0cnVlLAogICAgLy8gICBsYXN0QWN0aXZlOiB0aGlzLm1vZGVyYXRvcnModXNlcikudmFsdWUKICAgIC8vIH0KICAgIGl0b2IKICAgIHB1c2hieXRlcyAweDgwCiAgICBzd2FwCiAgICBjb25jYXQKCm1vZGVyYXRvck1ldGFfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLm1vZGVyYXRvck1ldGFANDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBieXRlYyA1IC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzAgLy8gMQogICAgcmV0dXJuCgptb2RlcmF0b3JNZXRhX2FmdGVyX2lmX2Vsc2VAMzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE2NAogICAgLy8gcmV0dXJuIHsgZXhpc3RzOiBmYWxzZSwgbGFzdEFjdGl2ZTogMCB9CiAgICBwdXNoYnl0ZXMgMHgwMDAwMDAwMDAwMDAwMDAwMDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9zb2NpYWwvbW9kZXJhdGlvbi5hbGdvLnRzOjE1NgogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICBiIG1vZGVyYXRvck1ldGFfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvc29jaWFsL21vZGVyYXRpb24uYWxnby50czo6QWtpdGFTb2NpYWxNb2RlcmF0aW9uLm1vZGVyYXRvck1ldGFANAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjpVcGdyYWRlYWJsZUFraXRhQmFzZUNvbnRyYWN0LnVwZGF0ZVtyb3V0aW5nXSgpIC0+IHZvaWQ6CnVwZGF0ZToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBwdXNoaW50IDIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTAKICAgIC8vIGFzc2VydChUeG4uc2VuZGVyID09PSB0aGlzLmdldEFraXRhREFPV2FsbGV0KCkuYWRkcmVzcywgRVJSX05PVF9BS0lUQV9EQU8pCiAgICB0eG4gU2VuZGVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBpbnRjXzEgLy8gMAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjkKICAgIC8vIGFraXRhREFPID0gR2xvYmFsU3RhdGU8QXBwbGljYXRpb24+KHsga2V5OiBHbG9iYWxTdGF0ZUtleUFraXRhREFPIH0pCiAgICBieXRlY18wIC8vICJha2l0YV9kYW8iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozMgogICAgLy8gY29uc3QgW3dhbGxldElEXSA9IG9wLkFwcEdsb2JhbC5nZXRFeFVpbnQ2NCh0aGlzLmFraXRhREFPLnZhbHVlLCBCeXRlcyhBa2l0YURBT0dsb2JhbFN0YXRlS2V5c1dhbGxldCkpCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIEdsb2JhbFN0YXRlIGV4aXN0cwogICAgZHVwCiAgICBieXRlY18yIC8vICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MAogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgIHVuY292ZXIgMgogICAgPT0KICAgIGFzc2VydCAvLyBPbmx5IHRoZSBBa2l0YSBEQU8gY2FuIGNhbGwgdGhpcyBmdW5jdGlvbgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Z1bmN0aW9ucy50czo1MAogICAgLy8gY29uc3QgW3BsdWdpbkFwcExpc3RCeXRlc10gPSBvcC5BcHBHbG9iYWwuZ2V0RXhCeXRlcyhha2l0YURBTywgQnl0ZXMoQWtpdGFEQU9HbG9iYWxTdGF0ZUtleXNQbHVnaW5BcHBMaXN0KSkKICAgIHB1c2hieXRlcyAicGFsIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTEKICAgIC8vIGNvbnN0IHVwZGF0ZVBsdWdpbiA9IGdldFBsdWdpbkFwcExpc3QodGhpcy5ha2l0YURBTy52YWx1ZSkudXBkYXRlCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NTIKICAgIC8vIGFzc2VydChHbG9iYWwuY2FsbGVyQXBwbGljYXRpb25JZCA9PT0gdXBkYXRlUGx1Z2luLCBFUlJfSU5WQUxJRF9VUEdSQURFKQogICAgZ2xvYmFsIENhbGxlckFwcGxpY2F0aW9uSUQKICAgID09CiAgICBhc3NlcnQgLy8gSW52YWxpZCBhcHAgdXBncmFkZQogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6MjcKICAgIC8vIHZlcnNpb24gPSBHbG9iYWxTdGF0ZTxzdHJpbmc+KHsga2V5OiBHbG9iYWxTdGF0ZUtleVZlcnNpb24gfSkKICAgIGJ5dGVjIDYgLy8gInZlcnNpb24iCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo1MwogICAgLy8gdGhpcy52ZXJzaW9uLnZhbHVlID0gbmV3VmVyc2lvbgogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjQ4CiAgICAvLyBAYWJpbWV0aG9kKHsgYWxsb3dBY3Rpb25zOiBbJ1VwZGF0ZUFwcGxpY2F0aW9uJ10gfSkKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czo6QWtpdGFCYXNlQ29udHJhY3QudXBkYXRlQWtpdGFEQU9bcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVBa2l0YURBTzoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGludGNfMSAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czoyOQogICAgLy8gYWtpdGFEQU8gPSBHbG9iYWxTdGF0ZTxBcHBsaWNhdGlvbj4oeyBrZXk6IEdsb2JhbFN0YXRlS2V5QWtpdGFEQU8gfSkKICAgIGJ5dGVjXzAgLy8gImFraXRhX2RhbyIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjMyCiAgICAvLyBjb25zdCBbd2FsbGV0SURdID0gb3AuQXBwR2xvYmFsLmdldEV4VWludDY0KHRoaXMuYWtpdGFEQU8udmFsdWUsIEJ5dGVzKEFraXRhREFPR2xvYmFsU3RhdGVLZXlzV2FsbGV0KSkKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgR2xvYmFsU3RhdGUgZXhpc3RzCiAgICBieXRlY18yIC8vICJ3YWxsZXQiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvdXRpbHMvYmFzZS1jb250cmFjdHMvYmFzZS50czozOQogICAgLy8gYXNzZXJ0KFR4bi5zZW5kZXIgPT09IHRoaXMuZ2V0QWtpdGFEQU9XYWxsZXQoKS5hZGRyZXNzLCBFUlJfTk9UX0FLSVRBX0RBTykKICAgIGFwcF9wYXJhbXNfZ2V0IEFwcEFkZHJlc3MKICAgIGFzc2VydCAvLyBhcHBsaWNhdGlvbiBleGlzdHMKICAgID09CiAgICBhc3NlcnQgLy8gT25seSB0aGUgQWtpdGEgREFPIGNhbiBjYWxsIHRoaXMgZnVuY3Rpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjI5CiAgICAvLyBha2l0YURBTyA9IEdsb2JhbFN0YXRlPEFwcGxpY2F0aW9uPih7IGtleTogR2xvYmFsU3RhdGVLZXlBa2l0YURBTyB9KQogICAgYnl0ZWNfMCAvLyAiYWtpdGFfZGFvIgogICAgLy8gc21hcnRfY29udHJhY3RzL3V0aWxzL2Jhc2UtY29udHJhY3RzL2Jhc2UudHM6NDAKICAgIC8vIHRoaXMuYWtpdGFEQU8udmFsdWUgPSBha2l0YURBTwogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy9iYXNlLWNvbnRyYWN0cy9iYXNlLnRzOjM4CiAgICAvLyB1cGRhdGVBa2l0YURBTyhha2l0YURBTzogQXBwbGljYXRpb24pOiB2b2lkIHsKICAgIGludGNfMCAvLyAxCiAgICByZXR1cm4K", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAGAQAgCNSTAYToASYJCWFraXRhX2RhbwFkBndhbGxldAFuAQAEFR98dQd2ZXJzaW9uA3NhbATqxtkigATqkYDdNhoAjgEAfDEZFEQxGEEAZYINBHdmLI4EA+OrIgSOvBm1BKDSMh0EYdzS7wR5YOp2BNkGcbYE8Ukr9ASEJpx4BHEu6CMEHzxhjAQz6SyUBIVN7eA2GgCODQBBAH8AsQDzARoBTQF/AcoCAAIuAkkCsAABACJDgATNmtZ+NhoAjgEADQAxGYEEEjEYEERCAl02GgFJI1mBAghLARUSRFcCADYaAkkVJRJEFycGTwJnKExnIkMxFiIJSTgQIhJENhoBSRUkEkQxACMoZUQqZUhyCEQSRClMUEm9RQEUREsBOAcyChJPAjgIIQQSEEQluUgiQzYaAUkVJBJEMQAjKGVEKmVIcghEEkQpTFBJvUUBRLxIsTEAIQSyCLIHIrIQI7IBsyJDMRYiCUk4ECISRDYaAUkVJBJENhoCSRUlEkQXKTEAUL1FAUQrTwJQSb1FARRESwI4BzIKEk8DOAghBBIQREwWvyJDNhoBSRUkEkQpMQBQvUUBRCtMULxIsTEAIQSyCLIHIrIQI7IBsyJDNhoBSRUkEkQpMQBQvUUBRCMoZUQnB2VII1uxJwiyGkyyGoABgLIashiBBrIQI7IBsyJDNhoBSRUkEkQpMQBQvUUBRCMoZUQnB2VII1uxJwiyGkyyGicEshqyGIEGshAjsgGzIkMxFiIJSTgQIhJENhoBSRUlEkQXNhoCSRWBJBJEMQAjKGVEKmVIcghEEkRMFoABYUxQSb1FARRESwI4BzIKEk8DOAghBRIQREy/IkM2GgFJFSUSRBcxACMoZUQqZUhyCEQSRBaAAWFMUEm9RQFEvEixMQAhBbIIsgcishAjsgGzIkM2GgFJFSQSRCtMUEm9RQFBABhJvkQXMgcNQQAOIicEI08CVCcFTFCwIkMjQv/vNhoBSRUkEkQpTFC9RQEnBCNPAlQnBUxQsCJDNhoBSRUkEkQpTFBJvUUBQQARSb5EFxaAAYBMUCcFTFCwIkOACQAAAAAAAAAAAEL/6zYaAUkjWYECCEsBFRJEVwIAMQAjKGVESSplSHIIRE8CEkSAA3BhbGVIgRBbMg0SRCcGTGciQzYaAUkVJRJEFzEAIyhlRCplSHIIRBJEKExnIkM=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var AkitaSocialModerationParamsFactory = class _AkitaSocialModerationParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create(string,uint64)void":
            return _AkitaSocialModerationParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the AkitaSocialModeration smart contract using the create(string,uint64)void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create(string,uint64)void",
          args: Array.isArray(params.args) ? params.args : [params.args.version, params.args.akitaDao]
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
            return _AkitaSocialModerationParamsFactory.update.update(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs update ABI call params for the AkitaSocialModeration smart contract using the update(string)void ABI method
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
   * Constructs a no op call for the addModerator(pay,address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static addModerator(params) {
    return {
      ...params,
      method: "addModerator(pay,address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.address]
    };
  }
  /**
   * Constructs a no op call for the removeModerator(address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static removeModerator(params) {
    return {
      ...params,
      method: "removeModerator(address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the ban(pay,address,uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static ban(params) {
    return {
      ...params,
      method: "ban(pay,address,uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.address, params.args.expiration]
    };
  }
  /**
   * Constructs a no op call for the unban(address)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static unban(params) {
    return {
      ...params,
      method: "unban(address)void",
      args: Array.isArray(params.args) ? params.args : [params.args.address]
    };
  }
  /**
   * Constructs a no op call for the flagPost(byte[32])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static flagPost(params) {
    return {
      ...params,
      method: "flagPost(byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
    };
  }
  /**
   * Constructs a no op call for the unflagPost(byte[32])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static unflagPost(params) {
    return {
      ...params,
      method: "unflagPost(byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.ref]
    };
  }
  /**
   * Constructs a no op call for the addAction(pay,uint64,byte[36])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static addAction(params) {
    return {
      ...params,
      method: "addAction(pay,uint64,byte[36])void",
      args: Array.isArray(params.args) ? params.args : [params.args.mbrPayment, params.args.actionAppId, params.args.content]
    };
  }
  /**
   * Constructs a no op call for the removeAction(uint64)void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static removeAction(params) {
    return {
      ...params,
      method: "removeAction(uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.actionAppId]
    };
  }
  /**
   * Constructs a no op call for the isBanned(address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isBanned(params) {
    return {
      ...params,
      method: "isBanned(address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.account]
    };
  }
  /**
   * Constructs a no op call for the isModerator(address)bool ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static isModerator(params) {
    return {
      ...params,
      method: "isModerator(address)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.account]
    };
  }
  /**
   * Constructs a no op call for the moderatorMeta(address)(bool,uint64) ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static moderatorMeta(params) {
    return {
      ...params,
      method: "moderatorMeta(address)(bool,uint64)",
      args: Array.isArray(params.args) ? params.args : [params.args.user]
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
};
var AkitaSocialModerationFactory = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  appFactory;
  /**
   * Creates a new instance of `AkitaSocialModerationFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {
    this.appFactory = new _AppFactory4({
      ...params,
      appSpec: APP_SPEC4
    });
  }
  /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
  get appName() {
    return this.appFactory.appName;
  }
  /** The ARC-56 app spec being used */
  get appSpec() {
    return APP_SPEC4;
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
    return new AkitaSocialModerationClient(this.appFactory.getAppClientById(params));
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
    return new AkitaSocialModerationClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the AkitaSocialModeration smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a, _b;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? AkitaSocialModerationParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0,
      updateParams: ((_b = params.updateParams) == null ? void 0 : _b.method) ? AkitaSocialModerationParamsFactory.update._resolveByMethod(params.updateParams) : params.updateParams ? params.updateParams : void 0
    });
    return { result: result.result, appClient: new AkitaSocialModerationClient(result.appClient) };
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
       * Creates a new instance of the AkitaSocialModeration smart contract using the create(string,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params) => {
        return this.appFactory.params.create(AkitaSocialModerationParamsFactory.create.create(params));
      }
    },
    /**
     * Gets available deployUpdate methods
     */
    deployUpdate: {
      /**
       * Updates an existing instance of the AkitaSocialModeration smart contract using the update(string)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The deployUpdate params
       */
      update: (params) => {
        return this.appFactory.params.deployUpdate(AkitaSocialModerationParamsFactory.update.update(params));
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
       * Creates a new instance of the AkitaSocialModeration smart contract using the create(string,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params) => {
        return this.appFactory.createTransaction.create(AkitaSocialModerationParamsFactory.create.create(params));
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
       * Creates a new instance of the AkitaSocialModeration smart contract using an ABI method call using the create(string,uint64)void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params) => {
        const result = await this.appFactory.send.create(AkitaSocialModerationParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new AkitaSocialModerationClient(result.appClient) };
      }
    }
  };
};
var AkitaSocialModerationClient = class _AkitaSocialModerationClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  appClient;
  constructor(appClientOrParams) {
    this.appClient = appClientOrParams instanceof _AppClient4 ? appClientOrParams : new _AppClient4({
      ...appClientOrParams,
      appSpec: APP_SPEC4
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? getArc56ReturnValue4(returnValue, this.appClient.getABIMethod(method), APP_SPEC4.structs) : void 0;
  }
  /**
   * Returns a new `AkitaSocialModerationClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _AkitaSocialModerationClient(await _AppClient4.fromCreatorAndName({ ...params, appSpec: APP_SPEC4 }));
  }
  /**
   * Returns an `AkitaSocialModerationClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _AkitaSocialModerationClient(await _AppClient4.fromNetwork({ ...params, appSpec: APP_SPEC4 }));
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
       * Updates an existing instance of the AkitaSocialModeration smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update params
       */
      update: (params) => {
        return this.appClient.params.update(AkitaSocialModerationParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialModeration smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addModerator(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    addModerator: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.addModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeModerator(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    removeModerator: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.removeModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `ban(pay,address,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    ban: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.ban(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unban(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    unban: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.unban(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `flagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    flagPost: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.flagPost(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unflagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    unflagPost: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.unflagPost(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addAction(pay,uint64,byte[36])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    addAction: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.addAction(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeAction(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    removeAction: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.removeAction(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    isBanned: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.isBanned(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isModerator(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    isModerator: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.isModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `moderatorMeta(address)(bool,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    moderatorMeta: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.moderatorMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateAkitaDao: (params) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.params.call(AkitaSocialModerationParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocialModeration smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update transaction
       */
      update: (params) => {
        return this.appClient.createTransaction.update(AkitaSocialModerationParamsFactory.update.update(params));
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialModeration smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addModerator(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    addModerator: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.addModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeModerator(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    removeModerator: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.removeModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `ban(pay,address,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    ban: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.ban(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unban(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    unban: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.unban(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `flagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    flagPost: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.flagPost(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unflagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    unflagPost: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.unflagPost(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addAction(pay,uint64,byte[36])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    addAction: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.addAction(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeAction(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    removeAction: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.removeAction(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    isBanned: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.isBanned(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isModerator(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    isModerator: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.isModerator(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `moderatorMeta(address)(bool,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    moderatorMeta: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.moderatorMeta(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateAkitaDao: (params) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.updateAkitaDao(params));
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    opUp: (params = { args: [] }) => {
      return this.appClient.createTransaction.call(AkitaSocialModerationParamsFactory.opUp(params));
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
       * Updates an existing instance of the AkitaSocialModeration smart contract using the `update(string)void` ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The update result
       */
      update: async (params) => {
        const result = await this.appClient.send.update(AkitaSocialModerationParamsFactory.update.update(params));
        return { ...result, return: result.return };
      }
    },
    /**
     * Makes a clear_state call to an existing instance of the AkitaSocialModeration smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addModerator(pay,address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    addModerator: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.addModerator(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeModerator(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    removeModerator: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.removeModerator(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `ban(pay,address,uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    ban: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.ban(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unban(address)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    unban: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.unban(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `flagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    flagPost: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.flagPost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `unflagPost(byte[32])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    unflagPost: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.unflagPost(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `addAction(pay,uint64,byte[36])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    addAction: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.addAction(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `removeAction(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    removeAction: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.removeAction(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isBanned(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    isBanned: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.isBanned(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `isModerator(address)bool` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    isModerator: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.isModerator(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `moderatorMeta(address)(bool,uint64)` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    moderatorMeta: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.moderatorMeta(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `updateAkitaDAO(uint64)void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateAkitaDao: async (params) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.updateAkitaDao(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the AkitaSocialModeration smart contract using the `opUp()void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    opUp: async (params = { args: [] }) => {
      const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.opUp(params));
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
    return new _AkitaSocialModerationClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialModeration smart contract using the `isBanned(address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async isBanned(params) {
    const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.isBanned(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialModeration smart contract using the `isModerator(address)bool` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async isModerator(params) {
    const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.isModerator(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the AkitaSocialModeration smart contract using the `moderatorMeta(address)(bool,uint64)` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async moderatorMeta(params) {
    const result = await this.appClient.send.call(AkitaSocialModerationParamsFactory.moderatorMeta(params));
    return result.return;
  }
  /**
   * Methods to access state for the current AkitaSocialModeration app
   */
  state = {
    /**
     * Methods to access global state for the current AkitaSocialModeration app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          version: result.version,
          akitaDao: result.akitaDAO
        };
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
     * Methods to access box state for the current AkitaSocialModeration app
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
       * Get values from the moderators map in box state
       */
      moderators: {
        /**
         * Get all current values of the moderators map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("moderators");
        },
        /**
         * Get a current value of the moderators map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("moderators", key);
        }
      },
      /**
       * Get values from the banned map in box state
       */
      banned: {
        /**
         * Get all current values of the banned map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("banned");
        },
        /**
         * Get a current value of the banned map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("banned", key);
        }
      },
      /**
       * Get values from the actions map in box state
       */
      actions: {
        /**
         * Get all current values of the actions map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("actions");
        },
        /**
         * Get a current value of the actions map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("actions", key);
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
       * Add a addModerator(pay,address)void method call against the AkitaSocialModeration contract
       */
      addModerator(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addModerator(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a removeModerator(address)void method call against the AkitaSocialModeration contract
       */
      removeModerator(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.removeModerator(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a ban(pay,address,uint64)void method call against the AkitaSocialModeration contract
       */
      ban(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.ban(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a unban(address)void method call against the AkitaSocialModeration contract
       */
      unban(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unban(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a flagPost(byte[32])void method call against the AkitaSocialModeration contract
       */
      flagPost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.flagPost(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a unflagPost(byte[32])void method call against the AkitaSocialModeration contract
       */
      unflagPost(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.unflagPost(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a addAction(pay,uint64,byte[36])void method call against the AkitaSocialModeration contract
       */
      addAction(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addAction(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a removeAction(uint64)void method call against the AkitaSocialModeration contract
       */
      removeAction(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.removeAction(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a isBanned(address)bool method call against the AkitaSocialModeration contract
       */
      isBanned(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isBanned(params)));
        resultMappers.push((v) => client.decodeReturnValue("isBanned(address)bool", v));
        return this;
      },
      /**
       * Add a isModerator(address)bool method call against the AkitaSocialModeration contract
       */
      isModerator(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.isModerator(params)));
        resultMappers.push((v) => client.decodeReturnValue("isModerator(address)bool", v));
        return this;
      },
      /**
       * Add a moderatorMeta(address)(bool,uint64) method call against the AkitaSocialModeration contract
       */
      moderatorMeta(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.moderatorMeta(params)));
        resultMappers.push((v) => client.decodeReturnValue("moderatorMeta(address)(bool,uint64)", v));
        return this;
      },
      /**
       * Add a updateAkitaDAO(uint64)void method call against the AkitaSocialModeration contract
       */
      updateAkitaDao(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateAkitaDao(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a opUp()void method call against the AkitaSocialModeration contract
       */
      opUp(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.opUp(params)));
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
      /**
       * Add a clear state call to the AkitaSocialModeration contract
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

// src/social/types.ts
var RefType = /* @__PURE__ */ ((RefType2) => {
  RefType2[RefType2["Post"] = 10] = "Post";
  RefType2[RefType2["Asset"] = 20] = "Asset";
  RefType2[RefType2["Address"] = 30] = "Address";
  RefType2[RefType2["App"] = 40] = "App";
  RefType2[RefType2["External"] = 50] = "External";
  return RefType2;
})(RefType || {});
var PayWallType = /* @__PURE__ */ ((PayWallType2) => {
  PayWallType2[PayWallType2["OneTimePayment"] = 0] = "OneTimePayment";
  PayWallType2[PayWallType2["Subscription"] = 1] = "Subscription";
  return PayWallType2;
})(PayWallType || {});

// src/social/constants.ts
var BOX_COST_PER_BYTE = 400n;
var FOLLOWS_MBR = 31700n;
var BLOCKS_MBR = 15700n;
var MIN_POSTS_MBR = 40100n;
var MIN_PAYWALL_MBR = 5200n;
var VOTES_MBR = 19300n;
var VOTELIST_MBR = 19300n;
var REACTIONS_MBR = 22100n;
var REACTIONLIST_MBR = 18900n;
var META_MBR = 45300n;
var MODERATORS_MBR = 18900n;
var BANNED_MBR = 18900n;
var ACTIONS_MBR = 29700n;
var AMENDMENT_MBR = 13200n;
var EDIT_BACK_REF_MBR = 13200n;
var PAYWALL_PAY_OPTION_SIZE = 17n;
var IMPACT_META_MBR = 31700n;
var SUBSCRIPTION_STATE_MODIFIER_MBR = 9300n;
var POST_BASE_MBR = MIN_POSTS_MBR + VOTES_MBR + VOTELIST_MBR;
var REPLY_BASE_MBR = POST_BASE_MBR;
var VOTE_BASE_MBR = VOTELIST_MBR;
var REACT_BASE_MBR = REACTIONLIST_MBR;
var REACT_NEW_NFT_MBR = REACTIONLIST_MBR + REACTIONS_MBR;
var ONE_DAY_SECONDS = 86400n;
var ONE_WEEK_SECONDS = 604800n;
var ONE_MONTH_SECONDS = 2592000n;
var ONE_YEAR_SECONDS = 31536000n;
var TWO_YEARS_SECONDS = 63072000n;
var MAX_TIMESTAMP_DRIFT_SECONDS = 60n;
var CID_LENGTH = 36;
var POST_REF_LENGTH = 32;
var REPLY_TYPE_POST = 10;
var REPLY_TYPE_ASSET = 20;
var REPLY_TYPE_ADDRESS = 30;
var REPLY_TYPE_APP = 40;
var REF_TYPE_EXTERNAL = 50;
var POST_TYPE_POST = 0;
var POST_TYPE_REPLY = 1;
var POST_TYPE_EDIT_POST = 2;
var POST_TYPE_EDIT_REPLY = 3;
var TIP_ACTION_POST = 10;
var TIP_ACTION_REACT = 20;
var TIP_SEND_TYPE_DIRECT = 10;
var TIP_SEND_TYPE_ARC59 = 20;
var TIP_SEND_TYPE_ARC58 = 30;

// src/social/index.ts
var SocialSDK = class _SocialSDK {
  // Core clients for each contract
  socialClient;
  graphClient;
  impactClient;
  moderationClient;
  // DAO client for reading config (lightweight - only used for state reads)
  // Optional: only created when daoAppId is provided
  daoClient = null;
  // App IDs for easy access
  socialAppId;
  graphAppId;
  impactAppId;
  moderationAppId;
  daoAppId;
  // Shared properties
  algorand;
  readerAccount;
  sendParams;
  ipfsUrl;
  /** The detected network for this SDK instance */
  network;
  // Cached DAO data (to avoid repeated calls)
  _socialFees = null;
  _akitaAssets = null;
  constructor({
    algorand,
    daoAppId,
    socialFactoryParams = {},
    graphFactoryParams = {},
    impactFactoryParams = {},
    moderationFactoryParams = {},
    readerAccount = DEFAULT_READER,
    sendParams = DEFAULT_SEND_PARAMS,
    ipfsUrl = ""
  }) {
    this.algorand = algorand;
    this.network = detectNetworkFromClient(algorand);
    this.daoAppId = daoAppId ?? getAppIdFromEnv(ENV_VAR_NAMES.DAO_APP_ID);
    this.readerAccount = readerAccount;
    this.sendParams = { ...sendParams };
    this.ipfsUrl = ipfsUrl;
    if (socialFactoryParams.defaultSender) {
      this.sendParams.sender = socialFactoryParams.defaultSender;
    }
    if (socialFactoryParams.defaultSigner) {
      this.sendParams.signer = socialFactoryParams.defaultSigner;
    }
    const resolvedSocialAppId = resolveAppIdWithClient(algorand, socialFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_APP_ID, "SocialSDK.social");
    const resolvedGraphAppId = resolveAppIdWithClient(algorand, graphFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_GRAPH_APP_ID, "SocialSDK.graph");
    const resolvedImpactAppId = resolveAppIdWithClient(algorand, impactFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_IMPACT_APP_ID, "SocialSDK.impact");
    const resolvedModerationAppId = resolveAppIdWithClient(algorand, moderationFactoryParams.appId, ENV_VAR_NAMES.SOCIAL_MODERATION_APP_ID, "SocialSDK.moderation");
    this.socialClient = new AkitaSocialFactory({ algorand }).getAppClientById({
      ...socialFactoryParams,
      appId: resolvedSocialAppId
    });
    this.graphClient = new AkitaSocialGraphFactory({ algorand }).getAppClientById({
      ...graphFactoryParams,
      appId: resolvedGraphAppId
    });
    this.impactClient = new AkitaSocialImpactFactory({ algorand }).getAppClientById({
      ...impactFactoryParams,
      appId: resolvedImpactAppId
    });
    this.moderationClient = new AkitaSocialModerationFactory({ algorand }).getAppClientById({
      ...moderationFactoryParams,
      appId: resolvedModerationAppId
    });
    if (this.daoAppId !== void 0 && this.daoAppId > 0n) {
      this.daoClient = new AkitaDaoFactory({ algorand }).getAppClientById({ appId: this.daoAppId });
    }
    this.socialAppId = this.socialClient.appId;
    this.graphAppId = this.graphClient.appId;
    this.impactAppId = this.impactClient.appId;
    this.moderationAppId = this.moderationClient.appId;
  }
  // ============================================================================
  // Blockchain Utilities
  // ============================================================================
  /**
   * Get the latest timestamp from the blockchain.
   * This is useful when creating posts/replies since the contract validates
   * that the provided timestamp is not too far from Global.latestTimestamp.
   * 
   * @returns The latest block timestamp as a bigint (unix seconds)
   */
  async getBlockchainTimestamp() {
    const status = await this.algorand.client.algod.status().do();
    const block = await this.algorand.client.algod.block(status.lastRound).do();
    return BigInt(block.block.header.timestamp);
  }
  // ============================================================================
  // Configuration Methods
  // ============================================================================
  setReaderAccount(readerAccount) {
    this.readerAccount = readerAccount;
  }
  setSendParams(sendParams) {
    this.sendParams = sendParams;
  }
  getSendParams({ sender, signer } = {}) {
    return {
      ...this.sendParams,
      ...sender !== void 0 && { sender },
      ...signer !== void 0 && { signer }
    };
  }
  getRequiredSendParams(params = {}) {
    const sendParams = this.getSendParams(params);
    if (!hasSenderSigner(sendParams)) {
      throw new Error("Sender and signer must be provided either explicitly or through defaults at SDK instantiation");
    }
    return sendParams;
  }
  getReaderSendParams({ sender } = {}) {
    return {
      ...this.sendParams,
      ...sender !== void 0 ? { sender } : { sender: this.readerAccount },
      signer: makeEmptyTransactionSigner()
    };
  }
  // ============================================================================
  // Post Key Methods - Deterministic key derivation for posts
  // ============================================================================
  /**
   * Generate a random 24-byte nonce for post key derivation
   * The contract will combine this with the chain timestamp to derive the full key.
   * @returns A random 24-byte Uint8Array
   */
  static generatePostNonce() {
    return crypto.getRandomValues(new Uint8Array(24));
  }
  /**
   * Compute the deterministic post key from creator address, timestamp, and nonce
   * The key is sha256(creatorAddressBytes + timestamp + nonce)
   * 
   * Note: The timestamp used by the contract is Global.latestTimestamp at execution time.
   * This method allows estimating the key for a given timestamp.
   * 
   * @param creatorAddress - The Algorand address of the post creator
   * @param timestamp - The timestamp (unix seconds) - use current time to estimate
   * @param nonce - A 24-byte nonce (use generatePostNonce() or provide your own)
   * @returns The 32-byte post key
   */
  computePostKey(creatorAddress, timestamp, nonce) {
    const { decodeAddress } = __require("algosdk");
    const addressBytes = decodeAddress(creatorAddress).publicKey;
    const timestampBytes = new Uint8Array(8);
    const ts = BigInt(timestamp);
    for (let i = 7; i >= 0; i--) {
      timestampBytes[i] = Number(ts >> BigInt((7 - i) * 8) & 0xFFn);
    }
    const combined = new Uint8Array(addressBytes.length + 8 + nonce.length);
    combined.set(addressBytes, 0);
    combined.set(timestampBytes, addressBytes.length);
    combined.set(nonce, addressBytes.length + 8);
    return this.sha256(combined);
  }
  /**
   * Compute the deterministic key for external content (Twitter, Farcaster, etc.)
   * The key is sha256(platformPrefix + externalId)
   * 
   * @param platform - The platform identifier (e.g., "twitter", "farcaster")
   * @param externalId - The external content identifier (e.g., tweet ID, cast hash)
   * @returns The 32-byte external ref key
   */
  static computeExternalRefKey(platform, externalId) {
    const combined = new TextEncoder().encode(`${platform}:${externalId}`);
    return _SocialSDK.sha256Static(combined);
  }
  /**
   * Compute the deterministic key for an edit
   * The key is sha256(creatorAddressBytes + originalPostKey + newCID)
   * 
   * This cryptographically links the edit to its original and makes same edits idempotent.
   * 
   * @param creatorAddress - The Algorand address of the edit creator
   * @param originalKey - The 32-byte key of the post being edited
   * @param newCid - The CID of the new content
   * @returns The 32-byte edit key
   */
  computeEditKey(creatorAddress, originalKey, newCid) {
    const { decodeAddress } = __require("algosdk");
    const addressBytes = decodeAddress(creatorAddress).publicKey;
    const combined = new Uint8Array(addressBytes.length + originalKey.length + newCid.length);
    combined.set(addressBytes, 0);
    combined.set(originalKey, addressBytes.length);
    combined.set(newCid, addressBytes.length + originalKey.length);
    return this.sha256(combined);
  }
  /**
   * Internal sha256 helper using Web Crypto API (sync wrapper)
   * Note: This is a synchronous approximation - for production, consider using
   * a proper crypto library like @noble/hashes
   */
  sha256(data) {
    return _SocialSDK.sha256Static(data);
  }
  /**
   * Static sha256 helper
   * Uses Web Crypto API synchronously (via SubtleCrypto workaround)
   */
  static sha256Static(data) {
    if (typeof globalThis !== "undefined" && "crypto" in globalThis) {
      const { sha256 } = __require("@noble/hashes/sha256");
      return sha256(data);
    }
    throw new Error("No sha256 implementation available - install @noble/hashes");
  }
  // ============================================================================
  // DAO Config Methods - Fetch social fees and AKTA asset ID from DAO
  // ============================================================================
  /**
   * Get social fees from the DAO config (cached after first call)
   * @returns Social fees including postFee, reactFee, impactTaxMin, impactTaxMax
   * @throws Error if daoAppId was not provided during SDK construction
   */
  async getSocialFees() {
    if (this._socialFees) {
      return this._socialFees;
    }
    if (!this.daoClient) {
      throw new Error("DAO client not available - daoAppId must be provided during SDK construction to fetch social fees");
    }
    const fees = await this.daoClient.state.global.socialFees();
    if (!fees) {
      throw new Error("Failed to fetch social fees from DAO");
    }
    this._socialFees = fees;
    return fees;
  }
  /**
   * Get AKTA asset info from the DAO config (cached after first call)
   * @returns Akita assets including akta and bones asset IDs
   * @throws Error if daoAppId was not provided during SDK construction
   */
  async getAkitaAssets() {
    if (this._akitaAssets) {
      return this._akitaAssets;
    }
    if (!this.daoClient) {
      throw new Error("DAO client not available - daoAppId must be provided during SDK construction to fetch akita assets");
    }
    const assets = await this.daoClient.state.global.akitaAssets();
    if (!assets) {
      throw new Error("Failed to fetch akita assets from DAO");
    }
    this._akitaAssets = assets;
    return assets;
  }
  /**
   * Clear cached DAO config (call this if fees change)
   */
  clearCache() {
    this._socialFees = null;
    this._akitaAssets = null;
  }
  // ============================================================================
  // Contract MBR Methods - Call contract directly for MBR calculations
  // ============================================================================
  /**
   * Get MBR values from the contract for various box types
   * @param ref - Optional reference bytes (empty for default MBR values)
   * @returns MBR data for all social box types
   */
  async getMbr({ sender, signer, ref = new Uint8Array() }) {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.send.mbr({
      ...sendParams,
      args: { ref }
    });
    return result.return;
  }
  /**
   * Check tip MBR requirements for sending tips to a recipient
   * This determines if the recipient can receive tips directly, via ARC-58, or ARC-59
   * @param creator - The address of the tip recipient
   * @param wallet - The wallet app ID of the recipient (0 if none)
   * @returns Tip MBR info including type and additional MBR needed
   */
  async checkTipMbrRequirements({
    sender,
    signer,
    creator,
    wallet = 0n
  }) {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.send.checkTipMbrRequirements({
      ...sendParams,
      args: {
        akitaDao: this.daoAppId ?? 0n,
        creator,
        wallet: BigInt(wallet)
      }
    });
    return result.return;
  }
  /**
   * Calculate the extra MBR needed for tip delivery based on recipient wallet type
   * @param tipMbrInfo - The tip MBR info from checkTipMbrRequirements
   * @returns Extra MBR amount in microAlgos
   */
  calculateTipExtraMbr(tipMbrInfo) {
    if (tipMbrInfo.type === TIP_SEND_TYPE_ARC58) {
      return tipMbrInfo.arc58;
    }
    return 0n;
  }
  // ============================================================================
  // MBR Calculation Methods (Static calculations)
  // ============================================================================
  /**
   * Calculate the MBR required for a post
   * Formula: posts + votes + votelist
   * Where posts = MinPostsMBR + (BoxCostPerByte * cid.length)
   * 
   * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
   * @param isAmendment - Whether this is an edit/amendment (adds extra MBR)
   * @returns MBR in microAlgos
   */
  calculatePostMBR(cidLength = CID_LENGTH, isAmendment = false) {
    const postsMbr = MIN_POSTS_MBR + BOX_COST_PER_BYTE * BigInt(cidLength);
    let total = postsMbr + VOTES_MBR + VOTELIST_MBR;
    if (isAmendment) {
      total += AMENDMENT_MBR + EDIT_BACK_REF_MBR;
    }
    return total;
  }
  /**
   * Calculate the MBR required for a reply
   * Same as post, but may include extra MBR for creating empty post for reference
   * 
   * @param cidLength - Length of the CID (default 36 for IPFS CIDv1)
   * @param isAmendment - Whether this is an edit/amendment
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateReplyMBR(cidLength = CID_LENGTH, isAmendment = false, needsEmptyPost = false) {
    let total = this.calculatePostMBR(cidLength, isAmendment);
    if (needsEmptyPost) {
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }
  /**
   * Calculate the MBR required for a vote
   * Formula: votelist (+ extra if creating empty post for reference)
   * 
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateVoteMBR(needsEmptyPost = false) {
    let total = VOTELIST_MBR;
    if (needsEmptyPost) {
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }
  /**
   * Calculate the MBR required for a reaction
   * Formula: reactionlist (+ reactions if first reaction with this NFT)
   * 
   * @param isFirstReactionWithNFT - Whether this is the first reaction with this specific NFT
   * @param needsEmptyPost - Whether an empty post needs to be created for the reference
   * @returns MBR in microAlgos
   */
  calculateReactMBR(isFirstReactionWithNFT = true, needsEmptyPost = false) {
    let total = REACTIONLIST_MBR;
    if (isFirstReactionWithNFT) {
      total += REACTIONS_MBR;
    }
    if (needsEmptyPost) {
      total += MIN_POSTS_MBR + VOTES_MBR;
    }
    return total;
  }
  /**
   * Calculate the MBR required for a follow
   * @returns MBR in microAlgos
   */
  calculateFollowMBR() {
    return FOLLOWS_MBR;
  }
  /**
   * Calculate the MBR required for a block
   * @returns MBR in microAlgos
   */
  calculateBlockMBR() {
    return BLOCKS_MBR;
  }
  /**
   * Calculate the MBR required for initializing meta
   * Includes META_MBR for the social contract + IMPACT_META_MBR for the impact contract
   * @returns MBR in microAlgos
   */
  calculateMetaMBR() {
    return META_MBR + IMPACT_META_MBR;
  }
  /**
   * Calculate the MBR required for a paywall
   * Formula: MinPayWallMBR + (BoxCostPerByte * PayWallPayOptionSize * totalOptions)
   * 
   * @param userOptionsCount - Number of user pay options
   * @param agentOptionsCount - Number of agent pay options
   * @returns MBR in microAlgos
   */
  calculatePayWallMBR(userOptionsCount, agentOptionsCount) {
    const totalOptions = userOptionsCount + agentOptionsCount;
    return MIN_PAYWALL_MBR + BOX_COST_PER_BYTE * PAYWALL_PAY_OPTION_SIZE * BigInt(totalOptions);
  }
  /**
   * Calculate the MBR required for adding a moderator
   * @returns MBR in microAlgos
   */
  calculateModeratorMBR() {
    return MODERATORS_MBR;
  }
  /**
   * Calculate the MBR required for banning a user
   * @returns MBR in microAlgos
   */
  calculateBanMBR() {
    return BANNED_MBR;
  }
  /**
   * Calculate the MBR required for adding an action
   * @returns MBR in microAlgos
   */
  calculateActionMBR() {
    return ACTIONS_MBR;
  }
  // ============================================================================
  // READ METHODS - Social Contract
  // ============================================================================
  /**
   * Check if an account is banned
   */
  async isBanned({ sender, signer, account }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.isBanned({ ...sendParams, args: { account } });
  }
  /**
   * Get user's social impact score from the Social contract
   */
  async getUserSocialImpact({ sender, signer, user }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getUserSocialImpact({ ...sendParams, args: { user } });
  }
  /**
   * Get moderator metadata for a user
   */
  async getModeratorMeta({ sender, signer, user }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.moderationClient.moderatorMeta({ ...sendParams, args: { user } });
  }
  /**
   * Get user metadata from the Social contract
   */
  async getMeta({ sender, signer, user }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getMeta({ ...sendParams, args: { user } });
  }
  /**
   * Get a post by reference
   */
  async getPost({ sender, signer, ref }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getPost({ ...sendParams, args: { ref } });
  }
  /**
   * Get a post and its creator's metadata
   * This is a convenience method that fetches both post and creator meta in sequence
   */
  async getPostAndCreatorMeta({ sender, signer, ref }) {
    const sendParams = this.getSendParams({ sender, signer });
    const post = await this.socialClient.getPost({ ...sendParams, args: { ref } });
    const meta = await this.socialClient.getMeta({ ...sendParams, args: { user: post.creator } });
    return { post, meta };
  }
  /**
   * Get vote data for a post reference (returns impact and direction of vote)
   */
  async getVote({ sender, signer, account, ref }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.socialClient.getVote({ ...sendParams, args: { account, ref } });
  }
  /**
   * Get vote data for multiple post references at once
   * Returns an array of VoteListValue in the same order as the input refs
   * For posts the user hasn't voted on, returns { impact: 0n, isUp: false }
   * This method is more efficient than calling getVote multiple times and won't error on missing votes
   */
  async getVotes({ sender, signer, keys }) {
    const sendParams = this.getSendParams({ sender, signer });
    const result = await this.socialClient.getVotes({ ...sendParams, args: { keys: keys.map(({ account, ref }) => [account, ref]) } });
    return result.map(([impact, isUp]) => ({ impact, isUp }));
  }
  // ============================================================================
  // READ METHODS - Graph Contract
  // ============================================================================
  /**
   * Check if a user is blocked by another user
   */
  async isBlocked({ sender, signer, user, blocked }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.graphClient.isBlocked({ ...sendParams, args: { user, blocked } });
  }
  /**
   * Check if one account is following another
   * @param follower - The account that may be following
   * @param user - The account that may be followed
   */
  async isFollowing({ sender, signer, follower, user }) {
    const sendParams = this.getReaderSendParams();
    return await this.graphClient.isFollowing({ ...sendParams, args: { follower, user } });
  }
  /**
   * Get the follow index for a follower-user pair
   * @param follower - The account that is following
   * @param user - The account that is followed
   */
  async getFollowIndex({ sender, signer, follower, user }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.graphClient.getFollowIndex({ ...sendParams, args: { follower, user } });
  }
  // ============================================================================
  // READ METHODS - Impact Contract
  // ============================================================================
  /**
   * Get user impact score (including social impact)
   */
  async getUserImpact({ sender, signer, address }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getUserImpact({ ...sendParams, args: { address } });
  }
  /**
   * Get user impact score (excluding social impact)
   */
  async getUserImpactWithoutSocial({ sender, signer, address }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getUserImpactWithoutSocial({ ...sendParams, args: { address } });
  }
  /**
   * Get impact metadata for a user
   */
  async getImpactMeta({ sender, signer, user }) {
    const sendParams = this.getSendParams({ sender, signer });
    return await this.impactClient.getMeta({ ...sendParams, args: { user } });
  }
  async init({
    sender,
    signer
  } = {}) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const group = this.socialClient.newGroup();
    group.init({
      ...sendParams,
      args: [],
      maxFee: 1e4.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    return await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  // ============================================================================
  // WRITE METHODS - Meta Operations
  // ============================================================================
  /**
   * Initialize meta for a user (required before using social features)
   */
  async initMeta({
    sender,
    signer,
    user,
    automated = false,
    subscriptionIndex = 0n,
    nfd = 0n,
    akitaNFT = 0n
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateMetaMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const result = await this.socialClient.send.initMeta({
      ...sendParams,
      args: {
        mbrPayment,
        user: user ?? sendParams.sender.toString(),
        automated,
        subscriptionIndex,
        nfd,
        akitaNft: akitaNFT
      }
    });
    return result.return;
  }
  /**
   * Update meta settings for the sender
   */
  async updateMeta({
    sender,
    signer,
    followGateId = 0n,
    addressGateId = 0n,
    subscriptionIndex = 0n,
    nfd = 0n,
    akitaNFT = 0n,
    defaultPayWallId = 0n
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.socialClient.send.updateMeta({
      ...sendParams,
      args: {
        followGateId,
        addressGateId,
        subscriptionIndex,
        nfd,
        akitaNft: akitaNFT,
        defaultPayWallId
      }
    });
  }
  // ============================================================================
  // WRITE METHODS - Post Operations
  // ============================================================================
  /**
   * Create a new post
   * 
   * @param args - Post arguments including optional timestamp, nonce and CID
   * @returns The post key, timestamp, and nonce used
   * 
   * Automatically calculates:
   * - MBR: posts + votes + votelist
   * - Tip: postFee in AKTA from DAO social fees
   * 
   * The post key is derived as sha256(creator + timestamp + nonce).
   * The timestamp is validated by the contract to be within 60 seconds of chain time.
   */
  async post({
    sender,
    signer,
    timestamp: providedTimestamp,
    nonce: providedNonce,
    cid,
    gateId = 0n,
    usePayWall = false,
    payWallId = 0n
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const [socialFees, akitaAssets, blockchainTimestamp] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
      providedTimestamp ? Promise.resolve(BigInt(providedTimestamp)) : this.getBlockchainTimestamp()
    ]);
    const timestamp = BigInt(providedTimestamp ?? blockchainTimestamp);
    const nonce = providedNonce ?? _SocialSDK.generatePostNonce();
    const creatorAddress = sendParams.sender.toString();
    const postKey = this.computePostKey(creatorAddress, timestamp, nonce);
    const mbrAmount = this.calculatePostMBR(cid.length, false);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.postFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    group.post({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        timestamp,
        nonce,
        cid,
        gateId,
        usePayWall,
        payWallId
      }
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    return { postKey, timestamp, nonce };
  }
  /**
   * Edit an existing post (creates an amendment)
   * 
   * @param args - Edit post arguments including new CID and amendment reference
   * @returns The deterministic post key for the edited post (derived from creator + original + CID)
   * 
   * Automatically calculates:
   * - MBR: posts + votes + votelist + amendment + edit back-ref
   * - Tip: postFee in AKTA from DAO social fees
   * 
   * The edit key is derived as sha256(creator + originalPostKey + newCID), making edits
   * cryptographically linked to their original and idempotent (same edit = same key).
   */
  async editPost({
    sender,
    signer,
    cid,
    amendment
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const postKey = this.computeEditKey(sendParams.sender.toString(), amendment, cid);
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets()
    ]);
    const mbrAmount = this.calculatePostMBR(cid.length, true);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.postFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    await this.socialClient.send.editPost({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        cid,
        amendment
      }
    });
    return postKey;
  }
  /**
   * Reply to a post or comment
   * 
   * @param args - Reply arguments including optional timestamp, nonce, CID and reference
   * @returns The reply key, timestamp, and nonce used
   * 
   * Automatically calculates:
   * - MBR: reply base + potential tip delivery MBR (ARC-58/ARC-59)
   * - Tip: reactFee in AKTA from DAO social fees
   * 
   * Note: Replies validate tips using TipActionReact (reactFee), not postFee
   */
  async reply({
    sender,
    signer,
    timestamp: providedTimestamp,
    nonce: providedNonce,
    cid,
    ref,
    refType,
    gateId = 0n,
    usePayWall = false,
    payWallId = 0n,
    gateTxn
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const [socialFees, akitaAssets, blockchainTimestamp] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets(),
      providedTimestamp ? Promise.resolve(BigInt(providedTimestamp)) : this.getBlockchainTimestamp()
    ]);
    const timestamp = BigInt(providedTimestamp ?? blockchainTimestamp);
    const nonce = providedNonce ?? _SocialSDK.generatePostNonce();
    const creatorAddress = sendParams.sender.toString();
    const replyKey = this.computePostKey(creatorAddress, timestamp, nonce);
    const mbrAmount = this.calculateReplyMBR(cid.length, false, false);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    if (gateTxn) {
      group.gatedReply({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          gateTxn,
          timestamp,
          nonce,
          cid,
          ref,
          type: refType,
          gateId,
          usePayWall,
          payWallId
        }
      });
    } else {
      group.reply({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          timestamp,
          nonce,
          cid,
          ref,
          type: refType,
          gateId,
          usePayWall,
          payWallId
        }
      });
    }
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
    return { replyKey, timestamp, nonce };
  }
  // ============================================================================
  // WRITE METHODS - Vote Operations
  // ============================================================================
  /**
   * Vote on a post (upvote or downvote)
   * 
   * @param args - Vote arguments including reference and vote direction
   * 
   * Automatically calculates:
   * - MBR: votelist + potential tip delivery MBR (ARC-58/ARC-59) for upvotes
   * - Tip: reactFee in AKTA from DAO social fees
   */
  async vote({
    sender,
    signer,
    ref,
    refType,
    isUp
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets()
    ]);
    const mbrAmount = this.calculateVoteMBR(false);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    group.vote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        type: refType,
        isUp
      }
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  /**
   * Edit an existing vote (undo or flip)
   * 
   * @param args - Edit vote arguments
   * 
   * Note: If flip=false, the vote is removed and MBR is refunded.
   * If flip=true, reactFee is charged.
   */
  /**
   * Invert an existing vote (upvote becomes downvote, or vice versa)
   * 
   * @param args - Invert vote arguments including the post reference
   * 
   * Automatically calculates tip fee from DAO social fees.
   */
  async invertVote({
    sender,
    signer,
    ref
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets()
    ]);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    group.editVote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        flip: true
      }
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  /**
   * Delete an existing vote (undo the vote entirely)
   * 
   * @param args - Delete vote arguments including the post reference
   * 
   * Refunds the MBR for the vote box storage.
   */
  async deleteVote({
    sender,
    signer,
    ref
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const akitaAssets = await this.getAkitaAssets();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(0),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: 0n,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    group.editVote({
      ...sendParams,
      args: {
        mbrPayment,
        tip: tipTxn,
        ref,
        flip: false
      }
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  // ============================================================================
  // WRITE METHODS - Reaction Operations
  // ============================================================================
  /**
   * React to a post with an NFT
   * 
   * @param args - React arguments including reference and NFT
   * 
   * Automatically calculates:
   * - MBR: reaction boxes + potential tip delivery MBR (ARC-58/ARC-59)
   * - Tip: reactFee in AKTA from DAO social fees
   * 
   * Note: MBR is higher if this is the first reaction with this specific NFT on the post
   */
  async react({
    sender,
    signer,
    ref,
    refType,
    nft,
    gateTxn
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const [socialFees, akitaAssets] = await Promise.all([
      this.getSocialFees(),
      this.getAkitaAssets()
    ]);
    const mbrAmount = this.calculateReactMBR(true, false);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const tipTxn = this.algorand.createTransaction.assetTransfer({
      ...sendParams,
      amount: socialFees.reactFee,
      assetId: akitaAssets.akta,
      receiver: this.socialClient.appAddress
    });
    const group = this.socialClient.newGroup();
    if (gateTxn) {
      group.gatedReact({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          gateTxn,
          ref,
          type: refType,
          nft
        }
      });
    } else {
      group.react({
        ...sendParams,
        args: {
          mbrPayment,
          tip: tipTxn,
          ref,
          type: refType,
          nft
        }
      });
    }
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  /**
   * Delete a reaction from a post
   */
  async deleteReaction({
    sender,
    signer,
    ref,
    nft
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const group = this.socialClient.newGroup();
    group.deleteReaction({
      ...sendParams,
      args: { ref, nft }
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos()
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "1"
    });
    group.opUp({
      ...sendParams,
      args: {},
      maxFee: 1e3.microAlgos(),
      note: "2"
    });
    await group.send({ populateAppCallResources: true, coverAppCallInnerTransactionFees: true });
  }
  // ============================================================================
  // READ METHODS - Reactions
  // ============================================================================
  /**
   * Get all reactions for a post
   * 
   * @param ref - The 32-byte post reference
   * @param userAddress - Optional user address to check which NFTs they've reacted with
   * @returns Object containing reactions array and set of NFT IDs the user has reacted with
   */
  async getPostReactions({
    ref,
    userAddress
  }) {
    const appId = this.socialAppId;
    const reactions = [];
    const userReactedNfts = /* @__PURE__ */ new Set();
    try {
      const boxesResponse = await this.algorand.client.algod.getApplicationBoxes(Number(appId)).do();
      const reactionPrefix = new Uint8Array([114]);
      const reactionListPrefix = new Uint8Array([101]);
      for (const box of boxesResponse.boxes) {
        const boxName = box.name;
        if (boxName.length === 41 && boxName[0] === reactionPrefix[0]) {
          const boxRef = boxName.slice(1, 33);
          if (this.compareBytes(boxRef, ref)) {
            const nftIdBytes = boxName.slice(33, 41);
            const nftId = this.bytesToBigInt(nftIdBytes);
            try {
              const boxValue = await this.algorand.client.algod.getApplicationBoxByName(Number(appId), boxName).do();
              const count = this.bytesToBigInt(boxValue.value);
              reactions.push({ nftId, count });
            } catch {
            }
          }
        }
        if (userAddress && boxName.length === 41 && boxName[0] === reactionListPrefix[0]) {
          const userBytes = this.addressToBytes16(userAddress);
          const boxUserBytes = boxName.slice(1, 17);
          const boxRefBytes = boxName.slice(17, 33);
          const refFirst16 = ref.slice(0, 16);
          if (this.compareBytes(boxUserBytes, userBytes) && this.compareBytes(boxRefBytes, refFirst16)) {
            const nftIdBytes = boxName.slice(33, 41);
            const nftId = this.bytesToBigInt(nftIdBytes);
            userReactedNfts.add(nftId);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch post reactions:", error);
    }
    return { reactions, userReactedNfts };
  }
  /**
   * Compare two Uint8Arrays for equality
   */
  compareBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  /**
   * Convert Uint8Array to bigint (big-endian)
   */
  bytesToBigInt(bytes) {
    let result = 0n;
    for (const byte of bytes) {
      result = result << 8n | BigInt(byte);
    }
    return result;
  }
  /**
   * Convert address to first 16 bytes for reaction list lookup
   */
  addressToBytes16(address) {
    const decoded = algosdk.decodeAddress(address);
    return decoded.publicKey.slice(0, 16);
  }
  // ============================================================================
  // WRITE METHODS - Graph Operations (follows/blocks)
  // ============================================================================
  /**
   * Follow a user
   * 
   * @param args - Follow arguments
   * 
   * Required MBR: Use calculateFollowMBR() to get the exact amount
   */
  async follow({
    sender,
    signer,
    address,
    gateTxn
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateFollowMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.graphClient.appAddress
    });
    if (gateTxn) {
      await this.graphClient.send.gatedFollow({
        ...sendParams,
        args: {
          mbrPayment,
          gateTxn,
          address
        }
      });
    } else {
      await this.graphClient.send.follow({
        ...sendParams,
        args: {
          mbrPayment,
          address
        }
      });
    }
  }
  /**
   * Unfollow a user
   */
  async unfollow({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.graphClient.send.unfollow({
      ...sendParams,
      args: { address }
    });
  }
  /**
   * Block a user
   * 
   * @param args - Block arguments
   * 
   * Required MBR: Use calculateBlockMBR() to get the exact amount
   */
  async block({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateBlockMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.graphClient.appAddress
    });
    await this.graphClient.send.block({
      ...sendParams,
      args: {
        mbrPayment,
        address
      }
    });
  }
  /**
   * Unblock a user
   */
  async unblock({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.graphClient.send.unblock({
      ...sendParams,
      args: { address }
    });
  }
  // ============================================================================
  // WRITE METHODS - PayWall Operations
  // ============================================================================
  /**
   * Create a paywall configuration
   * 
   * @param args - PayWall arguments with user and agent payment options
   * 
   * Required MBR: Use calculatePayWallMBR() to get the exact amount
   */
  async createPayWall({
    sender,
    signer,
    userPayInfo,
    agentPayInfo
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculatePayWallMBR(userPayInfo.length, agentPayInfo.length);
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.socialClient.appAddress
    });
    const payWall = {
      userPayInfo: userPayInfo.map((opt) => [
        opt.type,
        BigInt(opt.assetOrSubId),
        BigInt(opt.amount)
      ]),
      agentPayInfo: agentPayInfo.map((opt) => [
        opt.type,
        BigInt(opt.assetOrSubId),
        BigInt(opt.amount)
      ])
    };
    const result = await this.socialClient.send.createPayWall({
      ...sendParams,
      args: {
        mbrPayment,
        payWall
      }
    });
    return result.return;
  }
  // ============================================================================
  // WRITE METHODS - Moderation Operations (DAO-only)
  // ============================================================================
  /**
   * Add a moderator (requires DAO wallet sender)
   * 
   * Required MBR: Use calculateModeratorMBR() to get the exact amount
   */
  async addModerator({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateModeratorMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress
    });
    await this.moderationClient.send.addModerator({
      ...sendParams,
      args: {
        mbrPayment,
        address
      }
    });
  }
  /**
   * Remove a moderator (requires DAO wallet sender)
   */
  async removeModerator({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.moderationClient.send.removeModerator({
      ...sendParams,
      args: { address }
    });
  }
  /**
   * Ban a user (requires moderator)
   * 
   * Required MBR: Use calculateBanMBR() to get the exact amount
   */
  async ban({
    sender,
    signer,
    address,
    expiration
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateBanMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress
    });
    await this.moderationClient.send.ban({
      ...sendParams,
      args: {
        mbrPayment,
        address,
        expiration
      }
    });
  }
  /**
   * Unban a user (requires moderator)
   */
  async unban({
    sender,
    signer,
    address
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.moderationClient.send.unban({
      ...sendParams,
      args: { address }
    });
  }
  /**
   * Flag a post as against content policy (requires moderator)
   */
  async flagPost({
    sender,
    signer,
    ref
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.moderationClient.send.flagPost({
      ...sendParams,
      args: { ref }
    });
  }
  /**
   * Unflag a post (requires moderator)
   */
  async unflagPost({
    sender,
    signer,
    ref
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.moderationClient.send.unflagPost({
      ...sendParams,
      args: { ref }
    });
  }
  // ============================================================================
  // WRITE METHODS - Action Operations (DAO-only)
  // ============================================================================
  /**
   * Add a new action type (requires DAO wallet sender)
   * 
   * Required MBR: Use calculateActionMBR() to get the exact amount
   */
  async addAction({
    sender,
    signer,
    actionAppId,
    content
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const mbrAmount = this.calculateActionMBR();
    const mbrPayment = this.algorand.createTransaction.payment({
      ...sendParams,
      amount: microAlgo(mbrAmount),
      receiver: this.moderationClient.appAddress
    });
    await this.moderationClient.send.addAction({
      ...sendParams,
      args: {
        mbrPayment,
        actionAppId,
        content
      }
    });
  }
  /**
   * Remove an action type (requires DAO wallet sender)
   */
  async removeAction({
    sender,
    signer,
    actionAppId
  }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    await this.moderationClient.send.removeAction({
      ...sendParams,
      args: { actionAppId }
    });
  }
};

export {
  RefType,
  PayWallType,
  BOX_COST_PER_BYTE,
  FOLLOWS_MBR,
  BLOCKS_MBR,
  MIN_POSTS_MBR,
  MIN_PAYWALL_MBR,
  VOTES_MBR,
  VOTELIST_MBR,
  REACTIONS_MBR,
  REACTIONLIST_MBR,
  META_MBR,
  MODERATORS_MBR,
  BANNED_MBR,
  ACTIONS_MBR,
  AMENDMENT_MBR,
  EDIT_BACK_REF_MBR,
  PAYWALL_PAY_OPTION_SIZE,
  IMPACT_META_MBR,
  SUBSCRIPTION_STATE_MODIFIER_MBR,
  POST_BASE_MBR,
  REPLY_BASE_MBR,
  VOTE_BASE_MBR,
  REACT_BASE_MBR,
  REACT_NEW_NFT_MBR,
  ONE_DAY_SECONDS,
  ONE_WEEK_SECONDS,
  ONE_MONTH_SECONDS,
  ONE_YEAR_SECONDS,
  TWO_YEARS_SECONDS,
  MAX_TIMESTAMP_DRIFT_SECONDS,
  CID_LENGTH,
  POST_REF_LENGTH,
  REPLY_TYPE_POST,
  REPLY_TYPE_ASSET,
  REPLY_TYPE_ADDRESS,
  REPLY_TYPE_APP,
  REF_TYPE_EXTERNAL,
  POST_TYPE_POST,
  POST_TYPE_REPLY,
  POST_TYPE_EDIT_POST,
  POST_TYPE_EDIT_REPLY,
  TIP_ACTION_POST,
  TIP_ACTION_REACT,
  TIP_SEND_TYPE_DIRECT,
  TIP_SEND_TYPE_ARC59,
  TIP_SEND_TYPE_ARC58,
  SocialSDK
};
//# sourceMappingURL=chunk-WXXQDISC.mjs.map