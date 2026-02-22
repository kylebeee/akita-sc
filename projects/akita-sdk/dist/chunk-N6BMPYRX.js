"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } var _class; var _class2;

var _chunkW5ILLEG6js = require('./chunk-W5ILLEG6.js');


var _chunkHY3H6JQIjs = require('./chunk-HY3H6JQI.js');

// src/meta-merkles/index.ts
var _algokitutils = require('@algorandfoundation/algokit-utils');

// src/generated/MetaMerklesClient.ts
var _apparc56 = require('@algorandfoundation/algokit-utils/types/app-arc56');


var _appclient = require('@algorandfoundation/algokit-utils/types/app-client');
var _appfactory = require('@algorandfoundation/algokit-utils/types/app-factory');
var APP_SPEC = { "name": "MetaMerkles", "structs": { "DataKey": [{ "name": "address", "type": "byte[16]" }, { "name": "name", "type": "string" }, { "name": "key", "type": "string" }], "RootKey": [{ "name": "address", "type": "address" }, { "name": "name", "type": "string" }], "TypesValue": [{ "name": "schema", "type": "string" }, { "name": "description", "type": "string" }] }, "methods": [{ "name": "create", "args": [], "returns": { "type": "void" }, "actions": { "create": ["NoOp"], "call": [] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "addRoot", "args": [{ "type": "pay", "name": "payment" }, { "type": "string", "name": "name", "desc": "the name alias of the root being added" }, { "type": "byte[32]", "name": "root", "desc": "a merkle tree root" }, { "type": "uint64", "name": "type", "desc": "an index of the tree type enum from box storage" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Creates two boxes and adds a merkle root\nusing a `RootKey` to the root box map and also a list type to the\nmetadata attached to the root in the data box map", "events": [], "recommendations": {} }, { "name": "deleteRoot", "args": [{ "type": "string", "name": "name", "desc": "the name of the merkle tree root" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Deletes the merkle root from the root box map", "events": [], "recommendations": {} }, { "name": "updateRoot", "args": [{ "type": "string", "name": "name", "desc": "the name of the merkle group data" }, { "type": "byte[32]", "name": "newRoot", "desc": "the new 32 byte merkle tree root" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Replaces the merkle root with another", "events": [], "recommendations": {} }, { "name": "addData", "args": [{ "type": "pay", "name": "payment" }, { "type": "string", "name": "name", "desc": "the name of the merkle tree root" }, { "type": "string", "name": "key", "desc": "the metadata key eg. `Royalty`" }, { "type": "string", "name": "value", "desc": "the metadata value eg. `5` encoded as a bytestring for 5%" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Registers a key & value in the data box map that\ncorresponds to a merkle root in the root box map", "events": [], "recommendations": {} }, { "name": "deleteData", "args": [{ "type": "string", "name": "name", "desc": "the name of the merkle tree root" }, { "type": "string", "name": "key", "desc": "the metadata key you want to remove" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Deletes a metadata key & value pair from the data box map", "events": [], "recommendations": {} }, { "name": "verify", "args": [{ "type": "address", "name": "address", "desc": "the address of the merkle tree root creator" }, { "type": "string", "name": "name", "desc": "The name alias of the root" }, { "type": "byte[32]", "name": "leaf", "desc": "The hashed leaf to verify" }, { "type": "byte[32][]", "name": "proof", "desc": "The merkle proof" }, { "type": "uint64", "name": "type", "desc": "The type check for the lists purpose" }], "returns": { "type": "bool", "desc": "a boolean indicating whether the proof is valid" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "verify an inclusion in a double sha256 based merkle tree", "events": [], "recommendations": {} }, { "name": "read", "args": [{ "type": "address", "name": "address", "desc": "the address of the merkle tree root creator" }, { "type": "string", "name": "name", "desc": "the name of the merkle tree root" }, { "type": "string", "name": "key", "desc": "the metadata key eg. `Royalty`" }], "returns": { "type": "string", "desc": "the value set eg. `5` encoded as a bytestring for 5%" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "desc": "Fetch a metadata properties", "events": [], "recommendations": {} }, { "name": "verifiedRead", "args": [{ "type": "address", "name": "address", "desc": "the address of the merkle tree root creator" }, { "type": "string", "name": "name", "desc": "the name of the root" }, { "type": "byte[32]", "name": "leaf", "desc": "the leaf node to be verified" }, { "type": "byte[32][]", "name": "proof", "desc": "the proof the hash is included" }, { "type": "uint64", "name": "type", "desc": "the list type that helps contracts ensure\nthe lists purpose isn't being misused ( 0 if the caller doesnt care )" }, { "type": "string", "name": "key", "desc": "the metadata key eg. `Royalty`" }], "returns": { "type": "string", "desc": "a string of metadata" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Read metadata from box storage and verify the data provided is included\nin the merkle tree given a sha256'd 32 byte merkle tree root & a proof\nthats pre-computed off chain.\n\nverify an inclusion in a merkle tree\n& read an associated key value pair\n& check against the underlying data's schema\n& check against the underlying data's list type or purpose", "events": [], "recommendations": {} }, { "name": "verifiedMustRead", "args": [{ "type": "address", "name": "address", "desc": "the address of the merkle tree root creator" }, { "type": "string", "name": "name", "desc": "the name of the root" }, { "type": "byte[32]", "name": "leaf", "desc": "the leaf node to be verified" }, { "type": "byte[32][]", "name": "proof", "desc": "the proof the hash is included" }, { "type": "uint64", "name": "type", "desc": "the list type that helps contracts ensure\nthe lists purpose isn't being misused ( 0 if the caller doesnt care )" }, { "type": "string", "name": "key", "desc": "the metadata key eg. `Royalty`" }], "returns": { "type": "string", "desc": "a string of metadata" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "desc": "Read metadata from box storage and verify the data provided is included\nin the merkle tree given a sha256'd 32 byte merkle tree root & a proof\nthats pre-computed off chain.\n\nverify an inclusion in a merkle tree\n& read an associated key value pair\n& check against the underlying data's schema\n& check against the underlying data's list type or purpose", "events": [], "recommendations": {} }, { "name": "addType", "args": [{ "type": "pay", "name": "payment" }, { "type": "string", "name": "description" }, { "type": "uint8[]", "name": "schemaList" }], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "rootCosts", "args": [{ "type": "string", "name": "name" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }, { "name": "dataCosts", "args": [{ "type": "string", "name": "name" }, { "type": "string", "name": "key" }, { "type": "string", "name": "value" }], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": true, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 1, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "typesID": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "dHlwZXNfaWQ=" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": { "types": { "keyType": "uint64", "valueType": "TypesValue", "desc": "the types (intents) of merkle trees that exist", "prefix": "dA==" }, "roots": { "keyType": "RootKey", "valueType": "AVMBytes", "desc": "the merkle roots we want to attach data to", "prefix": "cg==" }, "data": { "keyType": "DataKey", "valueType": "AVMString", "desc": "rootData is the box map for managing the data associated with a group", "prefix": "ZA==" } } } }, "bareActions": { "create": [], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [2142, 2275, 2347], "errorMessage": "Box must have value" }, { "pc": [261], "errorMessage": "Cannot add root with name longer than 31 bytes" }, { "pc": [364, 728], "errorMessage": "Invalid payment" }, { "pc": [1333], "errorMessage": "Invalid payment amount" }, { "pc": [1323], "errorMessage": "Invalid payment receiver" }, { "pc": [208], "errorMessage": "Length must be 16" }, { "pc": [52], "errorMessage": "OnCompletion must be NoOp" }, { "pc": [453, 531], "errorMessage": "a root with this name does not exist" }, { "pc": [1829], "errorMessage": "check GlobalState exists" }, { "pc": [881], "errorMessage": "data does not exist" }, { "pc": [1250], "errorMessage": "failed to verify inclusion" }, { "pc": [1358, 2239], "errorMessage": "index access is out of bounds" }, { "pc": [965, 1100, 1209], "errorMessage": "invalid number of bytes for (len+uint8[32][])" }, { "pc": [1315], "errorMessage": "invalid number of bytes for (len+uint8[])" }, { "pc": [232, 388, 493, 558, 575, 594, 800, 816, 939, 1013, 1029, 1071, 1123, 1183, 1232, 1291, 1903, 1929, 1942, 1955], "errorMessage": "invalid number of bytes for (len+utf8[])" }, { "pc": [252, 974, 1109, 1218], "errorMessage": "invalid number of bytes for uint64" }, { "pc": [243, 504, 926, 950, 1e3, 1058, 1085, 1170, 1194], "errorMessage": "invalid number of bytes for uint8[32]" }, { "pc": [303, 422, 739, 830, 2084, 2299], "errorMessage": "invalid size" }, { "pc": [683], "errorMessage": "l. is reserved for internals" }, { "pc": [640, 1340], "errorMessage": "max data length is 1024 bytes" }, { "pc": [633], "errorMessage": "max key length is 32 bytes" }, { "pc": [692], "errorMessage": "there must be a root to associate the data to" }, { "pc": [335], "errorMessage": "this name is already in use" }, { "pc": [219, 545, 1278], "errorMessage": "transaction type is pay" }, { "pc": [273], "errorMessage": "tree type does not exist" }, { "pc": [345], "errorMessage": "tree type key already exists for this root" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYXJjNC9pbmRleC5kLnRzOjpDb250cmFjdC5hcHByb3ZhbFByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxIDIgMzIgNDAwCiAgICBieXRlY2Jsb2NrICIiIDB4MDAxNCAiZCIgMHgxNTFmN2M3NSAweDAwMjIgInIiICJ0eXBlc19pZCIgMHgwMDA2NmMyZTc0Nzk3MDY1IDB4MDY4MTAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6ODcKICAgIC8vIGV4cG9ydCBjbGFzcyBNZXRhTWVya2xlcyBleHRlbmRzIENvbnRyYWN0IHsKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gbXVzdCBiZSBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYnogbWFpbl9jcmVhdGVfTm9PcEAxNgogICAgcHVzaGJ5dGVzcyAweGEyNGMwNjdjIDB4ZGYyODdhN2QgMHhjNmQzZDcwNCAweDQyZmM3MjAyIDB4MDZkMzg5MDQgMHgyYmYzY2M1YSAweDUwYzM2ZTQxIDB4MGNmMWI5Y2YgMHgxZmY3Yzc0YyAweDM5YzE3ZGVkIDB4NzJiMjU5ODEgMHg3NjgzY2QyNSAvLyBtZXRob2QgImFkZFJvb3QocGF5LHN0cmluZyxieXRlWzMyXSx1aW50NjQpdm9pZCIsIG1ldGhvZCAiZGVsZXRlUm9vdChzdHJpbmcpdm9pZCIsIG1ldGhvZCAidXBkYXRlUm9vdChzdHJpbmcsYnl0ZVszMl0pdm9pZCIsIG1ldGhvZCAiYWRkRGF0YShwYXksc3RyaW5nLHN0cmluZyxzdHJpbmcpdm9pZCIsIG1ldGhvZCAiZGVsZXRlRGF0YShzdHJpbmcsc3RyaW5nKXZvaWQiLCBtZXRob2QgInZlcmlmeShhZGRyZXNzLHN0cmluZyxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NClib29sIiwgbWV0aG9kICJyZWFkKGFkZHJlc3Msc3RyaW5nLHN0cmluZylzdHJpbmciLCBtZXRob2QgInZlcmlmaWVkUmVhZChhZGRyZXNzLHN0cmluZyxieXRlWzMyXSxieXRlWzMyXVtdLHVpbnQ2NCxzdHJpbmcpc3RyaW5nIiwgbWV0aG9kICJ2ZXJpZmllZE11c3RSZWFkKGFkZHJlc3Msc3RyaW5nLGJ5dGVbMzJdLGJ5dGVbMzJdW10sdWludDY0LHN0cmluZylzdHJpbmciLCBtZXRob2QgImFkZFR5cGUocGF5LHN0cmluZyx1aW50OFtdKXZvaWQiLCBtZXRob2QgInJvb3RDb3N0cyhzdHJpbmcpdWludDY0IiwgbWV0aG9kICJkYXRhQ29zdHMoc3RyaW5nLHN0cmluZyxzdHJpbmcpdWludDY0IgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMAogICAgbWF0Y2ggYWRkUm9vdCBkZWxldGVSb290IHVwZGF0ZVJvb3QgYWRkRGF0YSBkZWxldGVEYXRhIHZlcmlmeSByZWFkIHZlcmlmaWVkUmVhZCB2ZXJpZmllZE11c3RSZWFkIGFkZFR5cGUgcm9vdENvc3RzIGRhdGFDb3N0cwogICAgZXJyCgptYWluX2NyZWF0ZV9Ob09wQDE2OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjg3CiAgICAvLyBleHBvcnQgY2xhc3MgTWV0YU1lcmtsZXMgZXh0ZW5kcyBDb250cmFjdCB7CiAgICBwdXNoYnl0ZXMgMHg0YzVjNjFiYSAvLyBtZXRob2QgImNyZWF0ZSgpdm9pZCIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDAKICAgIG1hdGNoIG1haW5fY3JlYXRlX3JvdXRlQDE3CiAgICBlcnIKCm1haW5fY3JlYXRlX3JvdXRlQDE3OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjk1CiAgICAvLyB0eXBlc0lEID0gR2xvYmFsU3RhdGU8dWludDY0Pih7IGtleTogTWV0YU1lcmtsZXNHbG9iYWxTdGF0ZUtleVR5cGVzSUQgfSkKICAgIGJ5dGVjIDYgLy8gInR5cGVzX2lkIgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE0MAogICAgLy8gdGhpcy50eXBlc0lELnZhbHVlID0gMAogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTM4CiAgICAvLyBAYWJpbWV0aG9kKHsgb25DcmVhdGU6ICdyZXF1aXJlJyB9KQogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9iYXNlLnRzOjpieXRlczE2KHY6IGJ5dGVzKSAtPiBieXRlczoKYnl0ZXMxNjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9iYXNlLnRzOjcKICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBieXRlczE2KHY6IGJ5dGVzKSB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy91dGlscy90eXBlcy9iYXNlLnRzOjgKICAgIC8vIHJldHVybiB2LnNsaWNlKDAsIDE2KS50b0ZpeGVkKHsgbGVuZ3RoOiAxNiB9KQogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMQogICAgPj0KICAgIGludGNfMCAvLyAwCiAgICBkaWcgMgogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGRpZyAyCiAgICA+PQogICAgcHVzaGludCAxNiAvLyAxNgogICAgdW5jb3ZlciAzCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgZnJhbWVfZGlnIC0xCiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCAxNiAvLyAxNgogICAgPT0KICAgIGFzc2VydCAvLyBMZW5ndGggbXVzdCBiZSAxNgogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy5hZGRSb290W3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkUm9vdDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNTUtMTYwCiAgICAvLyBhZGRSb290KAogICAgLy8gICBwYXltZW50OiBndHhuLlBheW1lbnRUeG4sCiAgICAvLyAgIG5hbWU6IHN0cmluZywKICAgIC8vICAgcm9vdDogYnl0ZXM8MzI+LAogICAgLy8gICB0eXBlOiB1aW50NjQKICAgIC8vICk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNjEKICAgIC8vIGFzc2VydChCeXRlcyhuYW1lKS5sZW5ndGggPD0gMzEsICdDYW5ub3QgYWRkIHJvb3Qgd2l0aCBuYW1lIGxvbmdlciB0aGFuIDMxIGJ5dGVzJykKICAgIGRpZyAyCiAgICBsZW4KICAgIGR1cAogICAgcHVzaGludCAzMSAvLyAzMQogICAgPD0KICAgIGFzc2VydCAvLyBDYW5ub3QgYWRkIHJvb3Qgd2l0aCBuYW1lIGxvbmdlciB0aGFuIDMxIGJ5dGVzCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBhc3NlcnQodGhpcy50eXBlcyh0eXBlKS5leGlzdHMsIEVSUl9OT19UUkVFX1RZUEUpCiAgICBzd2FwCiAgICBpdG9iCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTAwCiAgICAvLyB0eXBlcyA9IEJveE1hcDx1aW50NjQsIFR5cGVzVmFsdWU+KHsga2V5UHJlZml4OiBNZXRhTWVya2xlc0JveFByZWZpeFR5cGVzIH0pCiAgICBwdXNoYnl0ZXMgInQiCiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTYyCiAgICAvLyBhc3NlcnQodGhpcy50eXBlcyh0eXBlKS5leGlzdHMsIEVSUl9OT19UUkVFX1RZUEUpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyB0cmVlIHR5cGUgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNjQKICAgIC8vIGNvbnN0IHRydW5jYXRlZEFkZHJlc3MgPSBieXRlczE2KFR4bi5zZW5kZXIuYnl0ZXMpCiAgICB0eG4gU2VuZGVyCiAgICBjYWxsc3ViIGJ5dGVzMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNjYKICAgIC8vIGNvbnN0IHJvb3RLZXk6IFJvb3RLZXkgPSB7IGFkZHJlc3M6IFR4bi5zZW5kZXIsIG5hbWUgfQogICAgdHhuIFNlbmRlcgogICAgdW5jb3ZlciAzCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZGlnIDUKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgNCAvLyAweDAwMjIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE2NwogICAgLy8gY29uc3QgdHlwZUtleTogRGF0YUtleSA9IHsgYWRkcmVzczogdHJ1bmNhdGVkQWRkcmVzcywgbmFtZSwga2V5OiB0cmVlVHlwZUtleSB9CiAgICBkaWcgMgogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgdW5jb3ZlciAyCiAgICBieXRlY18xIC8vIDB4MDAxNAogICAgY29uY2F0CiAgICBkaWcgMgogICAgbGVuCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgYnl0ZWMgNyAvLyAweDAwMDY2YzJlNzQ3OTcwNjUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwMgogICAgLy8gcm9vdHMgPSBCb3hNYXA8Um9vdEtleSwgYnl0ZXM8MzI+Pih7IGtleVByZWZpeDogTWV0YU1lcmtsZXNCb3hQcmVmaXhSb290cyB9KQogICAgYnl0ZWMgNSAvLyAiciIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTY5CiAgICAvLyBhc3NlcnQoIXRoaXMucm9vdHMocm9vdEtleSkuZXhpc3RzLCBFUlJfTkFNRV9UQUtFTikKICAgIGR1cAogICAgYm94X2xlbgogICAgYnVyeSAxCiAgICAhCiAgICBhc3NlcnQgLy8gdGhpcyBuYW1lIGlzIGFscmVhZHkgaW4gdXNlCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTA0CiAgICAvLyBkYXRhID0gQm94TWFwPERhdGFLZXksIHN0cmluZz4oeyBrZXlQcmVmaXg6IE1ldGFNZXJrbGVzQm94UHJlZml4RGF0YSB9KQogICAgYnl0ZWNfMiAvLyAiZCIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTcwCiAgICAvLyBhc3NlcnQoIXRoaXMuZGF0YSh0eXBlS2V5KS5leGlzdHMsIEVSUl9UUkVFX1RZUEVfS0VZX0FMUkVBRFlfRVhJU1RTKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgICEKICAgIGFzc2VydCAvLyB0cmVlIHR5cGUga2V5IGFscmVhZHkgZXhpc3RzIGZvciB0aGlzIHJvb3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNzItMTc5CiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IHRoaXMucm9vdENvc3RzKG5hbWUpLAogICAgLy8gICB9LAogICAgLy8gICBFUlJfSU5WQUxJRF9QQVlNRU5UCiAgICAvLyApCiAgICBkaWcgNQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxNzUKICAgIC8vIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTcyLTE3OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnJvb3RDb3N0cyhuYW1lKSwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHVuY292ZXIgNgogICAgZ3R4bnMgQW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTc2CiAgICAvLyBhbW91bnQ6IHRoaXMucm9vdENvc3RzKG5hbWUpLAogICAgdW5jb3ZlciA2CiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucm9vdENvc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTcyLTE3OQogICAgLy8gYXNzZXJ0TWF0Y2goCiAgICAvLyAgIHBheW1lbnQsCiAgICAvLyAgIHsKICAgIC8vICAgICByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnJvb3RDb3N0cyhuYW1lKSwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTgxCiAgICAvLyB0aGlzLnJvb3RzKHJvb3RLZXkpLnZhbHVlID0gcm9vdAogICAgc3dhcAogICAgdW5jb3ZlciAzCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTgyCiAgICAvLyB0aGlzLmRhdGEodHlwZUtleSkudmFsdWUgPSBTdHJpbmcoaXRvYih0eXBlKSkKICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTU1LTE2MAogICAgLy8gYWRkUm9vdCgKICAgIC8vICAgcGF5bWVudDogZ3R4bi5QYXltZW50VHhuLAogICAgLy8gICBuYW1lOiBzdHJpbmcsCiAgICAvLyAgIHJvb3Q6IGJ5dGVzPDMyPiwKICAgIC8vICAgdHlwZTogdWludDY0CiAgICAvLyApOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLmRlbGV0ZVJvb3Rbcm91dGluZ10oKSAtPiB2b2lkOgpkZWxldGVSb290OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gZGVsZXRlUm9vdChuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE5MQogICAgLy8gY29uc3QgdHJ1bmNhdGVkQWRkcmVzcyA9IGJ5dGVzMTYoVHhuLnNlbmRlci5ieXRlcykKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE5MwogICAgLy8gY29uc3Qgcm9vdEtleTogUm9vdEtleSA9IHsgYWRkcmVzczogVHhuLnNlbmRlciwgbmFtZSB9CiAgICB0eG4gU2VuZGVyCiAgICBkaWcgMgogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgZGlnIDMKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWMgNCAvLyAweDAwMjIKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE5NAogICAgLy8gY29uc3QgdHlwZUtleTogRGF0YUtleSA9IHsgYWRkcmVzczogdHJ1bmNhdGVkQWRkcmVzcywgbmFtZSwga2V5OiB0cmVlVHlwZUtleSB9CiAgICBkaWcgMgogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgdW5jb3ZlciAyCiAgICBieXRlY18xIC8vIDB4MDAxNAogICAgY29uY2F0CiAgICBkaWcgMgogICAgbGVuCiAgICBwdXNoaW50IDIwIC8vIDIwCiAgICArCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgYnl0ZWMgNyAvLyAweDAwMDY2YzJlNzQ3OTcwNjUKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwMgogICAgLy8gcm9vdHMgPSBCb3hNYXA8Um9vdEtleSwgYnl0ZXM8MzI+Pih7IGtleVByZWZpeDogTWV0YU1lcmtsZXNCb3hQcmVmaXhSb290cyB9KQogICAgYnl0ZWMgNSAvLyAiciIKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTk2CiAgICAvLyBhc3NlcnQodGhpcy5yb290cyhyb290S2V5KS5leGlzdHMsIEVSUl9OT19OQU1FKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBhIHJvb3Qgd2l0aCB0aGlzIG5hbWUgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxOTgKICAgIC8vIHRoaXMucm9vdHMocm9vdEtleSkuZGVsZXRlKCkKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwNAogICAgLy8gZGF0YSA9IEJveE1hcDxEYXRhS2V5LCBzdHJpbmc+KHsga2V5UHJlZml4OiBNZXRhTWVya2xlc0JveFByZWZpeERhdGEgfSkKICAgIGJ5dGVjXzIgLy8gImQiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxOTkKICAgIC8vIHRoaXMuZGF0YSh0eXBlS2V5KS5kZWxldGUoKQogICAgYm94X2RlbAogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjAyLTIwNwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnJvb3RDb3N0cyhuYW1lKSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjA0CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMDUKICAgIC8vIGFtb3VudDogdGhpcy5yb290Q29zdHMobmFtZSksCiAgICBzd2FwCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucm9vdENvc3RzCiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIwMi0yMDYKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogdGhpcy5yb290Q29zdHMobmFtZSksCiAgICAvLyAgIH0pCiAgICBpbnRjXzEgLy8gMQogICAgaXR4bl9maWVsZCBUeXBlRW51bQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjAyLTIwNwogICAgLy8gaXR4bgogICAgLy8gICAucGF5bWVudCh7CiAgICAvLyAgICAgcmVjZWl2ZXI6IFR4bi5zZW5kZXIsCiAgICAvLyAgICAgYW1vdW50OiB0aGlzLnJvb3RDb3N0cyhuYW1lKSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX3N1Ym1pdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjE5MAogICAgLy8gZGVsZXRlUm9vdChuYW1lOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnVwZGF0ZVJvb3Rbcm91dGluZ10oKSAtPiB2b2lkOgp1cGRhdGVSb290OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIxNgogICAgLy8gdXBkYXRlUm9vdChuYW1lOiBzdHJpbmcsIG5ld1Jvb3Q6IGJ5dGVzPDMyPik6IHZvaWQgewogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAyCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMTcKICAgIC8vIGNvbnN0IGtleTogUm9vdEtleSA9IHsgYWRkcmVzczogVHhuLnNlbmRlciwgbmFtZSB9CiAgICB0eG4gU2VuZGVyCiAgICBkaWcgMgogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciAzCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGJ5dGVjIDQgLy8gMHgwMDIyCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwMgogICAgLy8gcm9vdHMgPSBCb3hNYXA8Um9vdEtleSwgYnl0ZXM8MzI+Pih7IGtleVByZWZpeDogTWV0YU1lcmtsZXNCb3hQcmVmaXhSb290cyB9KQogICAgYnl0ZWMgNSAvLyAiciIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIxOAogICAgLy8gYXNzZXJ0KHRoaXMucm9vdHMoa2V5KS5leGlzdHMsIEVSUl9OT19OQU1FKQogICAgZHVwCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyBhIHJvb3Qgd2l0aCB0aGlzIG5hbWUgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMTkKICAgIC8vIHRoaXMucm9vdHMoa2V5KS52YWx1ZSA9IG5ld1Jvb3QKICAgIHN3YXAKICAgIGJveF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMTYKICAgIC8vIHVwZGF0ZVJvb3QobmFtZTogc3RyaW5nLCBuZXdSb290OiBieXRlczwzMj4pOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLmFkZERhdGFbcm91dGluZ10oKSAtPiB2b2lkOgphZGREYXRhOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIzMQogICAgLy8gYWRkRGF0YShwYXltZW50OiBndHhuLlBheW1lbnRUeG4sIG5hbWU6IHN0cmluZywga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHsKICAgIHR4biBHcm91cEluZGV4CiAgICBpbnRjXzEgLy8gMQogICAgLQogICAgZHVwCiAgICBndHhucyBUeXBlRW51bQogICAgaW50Y18xIC8vIHBheQogICAgPT0KICAgIGFzc2VydCAvLyB0cmFuc2FjdGlvbiB0eXBlIGlzIHBheQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgZHVwCiAgICBjb3ZlciAyCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgY292ZXIgMwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIzMgogICAgLy8gY29uc3Qgcm9vdEtleTogUm9vdEtleSA9IHsgYWRkcmVzczogVHhuLnNlbmRlciwgbmFtZSB9CiAgICB0eG4gU2VuZGVyCiAgICBkaWcgMwogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciA0CiAgICBjb25jYXQKICAgIGR1cAogICAgY292ZXIgNAogICAgc3dhcAogICAgYnl0ZWMgNCAvLyAweDAwMjIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICBjb3ZlciAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjM1CiAgICAvLyBhc3NlcnQoa2V5Qnl0ZXMubGVuZ3RoIDw9IG1heERhdGFLZXlMZW5ndGgsIEVSUl9LRVlfVE9PX0xPTkcpCiAgICBzd2FwCiAgICBsZW4KICAgIGR1cAogICAgY292ZXIgMgogICAgZHVwCiAgICBwdXNoaW50IDE1IC8vIDE1CiAgICA8PQogICAgYXNzZXJ0IC8vIG1heCBrZXkgbGVuZ3RoIGlzIDMyIGJ5dGVzCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjM2CiAgICAvLyBhc3NlcnQoQnl0ZXModmFsdWUpLmxlbmd0aCA8PSBtYXhEYXRhTGVuZ3RoLCBFUlJfREFUQV9UT09fTE9ORykKICAgIHN3YXAKICAgIGxlbgogICAgcHVzaGludCAxMDI0IC8vIDEwMjQKICAgIDw9CiAgICBhc3NlcnQgLy8gbWF4IGRhdGEgbGVuZ3RoIGlzIDEwMjQgYnl0ZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMzgKICAgIC8vIGtleUJ5dGVzLmxlbmd0aCA8IDIgfHwgIShrZXlCeXRlcy5zbGljZSgwLCAyKSA9PT0gQnl0ZXMocmVzZXJ2ZWREYXRhS2V5UHJlZml4KSksCiAgICBpbnRjXzIgLy8gMgogICAgPAogICAgYm56IGFkZERhdGFfYm9vbF90cnVlQDMKICAgIGludGNfMCAvLyAwCiAgICBkaWcgMQogICAgZHVwCiAgICBjb3ZlciAyCiAgICA+PQogICAgaW50Y18wIC8vIDAKICAgIGRpZyAyCiAgICB1bmNvdmVyIDIKICAgIHNlbGVjdAogICAgaW50Y18yIC8vIDIKICAgIGRpZyAyCiAgICA+PQogICAgaW50Y18yIC8vIDIKICAgIHVuY292ZXIgMwogICAgdW5jb3ZlciAyCiAgICBzZWxlY3QKICAgIGRpZyA2CiAgICBjb3ZlciAyCiAgICBzdWJzdHJpbmczCiAgICBwdXNoYnl0ZXMgImwuIgogICAgPT0KICAgIGJueiBhZGREYXRhX2Jvb2xfZmFsc2VANAoKYWRkRGF0YV9ib29sX3RydWVAMzoKICAgIGludGNfMSAvLyAxCgphZGREYXRhX2Jvb2xfbWVyZ2VANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyMzctMjQwCiAgICAvLyBhc3NlcnQoCiAgICAvLyAgIGtleUJ5dGVzLmxlbmd0aCA8IDIgfHwgIShrZXlCeXRlcy5zbGljZSgwLCAyKSA9PT0gQnl0ZXMocmVzZXJ2ZWREYXRhS2V5UHJlZml4KSksCiAgICAvLyAgIEVSUl9SRVNFUlZFRF9LRVlfUFJFRklYCiAgICAvLyApCiAgICBhc3NlcnQgLy8gbC4gaXMgcmVzZXJ2ZWQgZm9yIGludGVybmFscwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwMgogICAgLy8gcm9vdHMgPSBCb3hNYXA8Um9vdEtleSwgYnl0ZXM8MzI+Pih7IGtleVByZWZpeDogTWV0YU1lcmtsZXNCb3hQcmVmaXhSb290cyB9KQogICAgYnl0ZWMgNSAvLyAiciIKICAgIGRpZyAyCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNDEKICAgIC8vIGFzc2VydCh0aGlzLnJvb3RzKHJvb3RLZXkpLmV4aXN0cywgRVJSX05PX1JPT1RfRk9SX0RBVEEpCiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGFzc2VydCAvLyB0aGVyZSBtdXN0IGJlIGEgcm9vdCB0byBhc3NvY2lhdGUgdGhlIGRhdGEgdG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNDMKICAgIC8vIGNvbnN0IGNvc3RzID0gdGhpcy5tYnIoJycsICcnLCBuYW1lLCBrZXksIHZhbHVlKQogICAgYnl0ZWNfMCAvLyAiIgogICAgZHVwCiAgICBkaWcgNwogICAgZGlnIDcKICAgIGR1cAogICAgY292ZXIgNAogICAgZGlnIDgKICAgIGR1cAogICAgY292ZXIgNgogICAgY2FsbHN1YiBtYnIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNDUtMjUyCiAgICAvLyBhc3NlcnRNYXRjaCgKICAgIC8vICAgcGF5bWVudCwKICAgIC8vICAgewogICAgLy8gICAgIHJlY2VpdmVyOiBHbG9iYWwuY3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcywKICAgIC8vICAgICBhbW91bnQ6IGNvc3RzLmRhdGEsCiAgICAvLyAgIH0sCiAgICAvLyAgIEVSUl9JTlZBTElEX1BBWU1FTlQKICAgIC8vICkKICAgIGRpZyA5CiAgICBkdXAKICAgIGd0eG5zIFJlY2VpdmVyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjQ4CiAgICAvLyByZWNlaXZlcjogR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsCiAgICBnbG9iYWwgQ3VycmVudEFwcGxpY2F0aW9uQWRkcmVzcwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI0NS0yNTIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogY29zdHMuZGF0YSwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgIHN3YXAKICAgIGd0eG5zIEFtb3VudAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI0OQogICAgLy8gYW1vdW50OiBjb3N0cy5kYXRhLAogICAgdW5jb3ZlciAyCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI0NS0yNTIKICAgIC8vIGFzc2VydE1hdGNoKAogICAgLy8gICBwYXltZW50LAogICAgLy8gICB7CiAgICAvLyAgICAgcmVjZWl2ZXI6IEdsb2JhbC5jdXJyZW50QXBwbGljYXRpb25BZGRyZXNzLAogICAgLy8gICAgIGFtb3VudDogY29zdHMuZGF0YSwKICAgIC8vICAgfSwKICAgIC8vICAgRVJSX0lOVkFMSURfUEFZTUVOVAogICAgLy8gKQogICAgPT0KICAgICYmCiAgICBhc3NlcnQgLy8gSW52YWxpZCBwYXltZW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjU0CiAgICAvLyBjb25zdCB0cnVuY2F0ZWRBZGRyZXNzID0gYnl0ZXMxNihUeG4uc2VuZGVyLmJ5dGVzKQogICAgdHhuIFNlbmRlcgogICAgY2FsbHN1YiBieXRlczE2CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjU1CiAgICAvLyBjb25zdCBkYXRhS2V5OiBEYXRhS2V5ID0geyBhZGRyZXNzOiB0cnVuY2F0ZWRBZGRyZXNzLCBuYW1lLCBrZXkgfQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICBieXRlY18xIC8vIDB4MDAxNAogICAgY29uY2F0CiAgICBkaWcgNQogICAgZHVwCiAgICBjb3ZlciAyCiAgICBsZW4KICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICsKICAgIGRpZyA1CiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciA0CiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICB1bmNvdmVyIDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgdW5jb3ZlciAyCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwNAogICAgLy8gZGF0YSA9IEJveE1hcDxEYXRhS2V5LCBzdHJpbmc+KHsga2V5UHJlZml4OiBNZXRhTWVya2xlc0JveFByZWZpeERhdGEgfSkKICAgIGJ5dGVjXzIgLy8gImQiCiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNTcKICAgIC8vIHRoaXMuZGF0YShkYXRhS2V5KS52YWx1ZSA9IHZhbHVlCiAgICBkdXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgc3dhcAogICAgYm94X3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjIzMQogICAgLy8gYWRkRGF0YShwYXltZW50OiBndHhuLlBheW1lbnRUeG4sIG5hbWU6IHN0cmluZywga2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHsKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCmFkZERhdGFfYm9vbF9mYWxzZUA0OgogICAgaW50Y18wIC8vIDAKICAgIGIgYWRkRGF0YV9ib29sX21lcmdlQDUKCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLmRlbGV0ZURhdGFbcm91dGluZ10oKSAtPiB2b2lkOgpkZWxldGVEYXRhOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI2NgogICAgLy8gZGVsZXRlRGF0YShuYW1lOiBzdHJpbmcsIGtleTogc3RyaW5nKTogdm9pZCB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI2NwogICAgLy8gY29uc3QgdHJ1bmNhdGVkQWRkcmVzcyA9IGJ5dGVzMTYoVHhuLnNlbmRlci5ieXRlcykKICAgIHR4biBTZW5kZXIKICAgIGNhbGxzdWIgYnl0ZXMxNgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI2OAogICAgLy8gY29uc3QgZGF0YUtleTogRGF0YUtleSA9IHsgYWRkcmVzczogdHJ1bmNhdGVkQWRkcmVzcywgbmFtZSwga2V5IH0KICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgZGlnIDIKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIGRpZyAzCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGJ5dGVjXzEgLy8gMHgwMDE0CiAgICBjb25jYXQKICAgIGRpZyAxCiAgICBsZW4KICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICsKICAgIGRpZyAzCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBkaWcgNAogICAgY29uY2F0CiAgICBzd2FwCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgdW5jb3ZlciAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBzd2FwCiAgICBjb25jYXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMDQKICAgIC8vIGRhdGEgPSBCb3hNYXA8RGF0YUtleSwgc3RyaW5nPih7IGtleVByZWZpeDogTWV0YU1lcmtsZXNCb3hQcmVmaXhEYXRhIH0pCiAgICBieXRlY18yIC8vICJkIgogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MjcwCiAgICAvLyBhc3NlcnQodGhpcy5kYXRhKGRhdGFLZXkpLmV4aXN0cywgRVJSX05PX0RBVEEpCiAgICBkdXAKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYXNzZXJ0IC8vIGRhdGEgZG9lcyBub3QgZXhpc3QKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNzMKICAgIC8vIGNvbnN0IGNvc3RzID0gdGhpcy5tYnIoJycsICcnLCBuYW1lLCBrZXksIHRoaXMuZGF0YShkYXRhS2V5KS52YWx1ZSkKICAgIGR1cAogICAgYm94X2dldAogICAgcG9wCiAgICBieXRlY18wIC8vICIiCiAgICBkdXAKICAgIHVuY292ZXIgNQogICAgdW5jb3ZlciA1CiAgICB1bmNvdmVyIDQKICAgIGNhbGxzdWIgbWJyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Mjc1CiAgICAvLyB0aGlzLmRhdGEoZGF0YUtleSkuZGVsZXRlKCkKICAgIHN3YXAKICAgIGJveF9kZWwKICAgIHBvcAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI3Ny0yODIKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogY29zdHMuZGF0YSwKICAgIC8vICAgfSkKICAgIC8vICAgLnN1Ym1pdCgpCiAgICBpdHhuX2JlZ2luCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Mjc5CiAgICAvLyByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIHR4biBTZW5kZXIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyODAKICAgIC8vIGFtb3VudDogY29zdHMuZGF0YSwKICAgIHN3YXAKICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgIGV4dHJhY3RfdWludDY0CiAgICBpdHhuX2ZpZWxkIEFtb3VudAogICAgaXR4bl9maWVsZCBSZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI3Ny0yODEKICAgIC8vIGl0eG4KICAgIC8vICAgLnBheW1lbnQoewogICAgLy8gICAgIHJlY2VpdmVyOiBUeG4uc2VuZGVyLAogICAgLy8gICAgIGFtb3VudDogY29zdHMuZGF0YSwKICAgIC8vICAgfSkKICAgIGludGNfMSAvLyAxCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBpbnRjXzAgLy8gMAogICAgaXR4bl9maWVsZCBGZWUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNzctMjgyCiAgICAvLyBpdHhuCiAgICAvLyAgIC5wYXltZW50KHsKICAgIC8vICAgICByZWNlaXZlcjogVHhuLnNlbmRlciwKICAgIC8vICAgICBhbW91bnQ6IGNvc3RzLmRhdGEsCiAgICAvLyAgIH0pCiAgICAvLyAgIC5zdWJtaXQoKQogICAgaXR4bl9zdWJtaXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyNjYKICAgIC8vIGRlbGV0ZURhdGEobmFtZTogc3RyaW5nLCBrZXk6IHN0cmluZyk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5W3JvdXRpbmddKCkgLT4gdm9pZDoKdmVyaWZ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI5NgogICAgLy8gdmVyaWZ5KGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywgbGVhZjogTGVhZiwgcHJvb2Y6IFByb29mLCB0eXBlOiB1aW50NjQpOiBib29sZWFuIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDQKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzMgLy8gMzIKICAgICoKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4WzMyXVtdKQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNQogICAgZHVwCiAgICBsZW4KICAgIHB1c2hpbnQgOCAvLyA4CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50NjQKICAgIGJ0b2kKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnkKICAgIHBvcAogICAgcHVzaGJ5dGVzIDB4MDAKICAgIGludGNfMCAvLyAwCiAgICB1bmNvdmVyIDIKICAgIHNldGJpdAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucmVhZFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnJlYWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzI5CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy5yZWFkCiAgICBkdXAKICAgIGxlbgogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgYnl0ZWNfMyAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZpZWRSZWFkW3JvdXRpbmddKCkgLT4gdm9pZDoKdmVyaWZpZWRSZWFkOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM1NAogICAgLy8gdmVyaWZpZWRSZWFkKGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywgbGVhZjogTGVhZiwgcHJvb2Y6IFByb29mLCB0eXBlOiB1aW50NjQsIGtleTogc3RyaW5nKTogc3RyaW5nIHsKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDEKICAgIGR1cG4gMgogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBkdXAKICAgIGNvdmVyIDIKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDMKICAgIGR1cAogICAgbGVuCiAgICBpbnRjXzMgLy8gMzIKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ4WzMyXQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNAogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMyAvLyAzMgogICAgKgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdWludDhbMzJdW10pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA1CiAgICBkdXAKICAgIGxlbgogICAgcHVzaGludCA4IC8vIDgKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIHVpbnQ2NAogICAgYnRvaQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgNgogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIGV4dHJhY3QgMiAwCiAgICBjb3ZlciA1CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzU1CiAgICAvLyBjb25zdCB2ZXJpZmllZCA9IHRoaXMudmVyaWZ5KGFkZHJlc3MsIG5hbWUsIGxlYWYsIHByb29mLCB0eXBlKQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeQogICAgcG9wCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzU2CiAgICAvLyBpZiAoIXZlcmlmaWVkKSB7CiAgICBibnogdmVyaWZpZWRSZWFkX2FmdGVyX2lmX2Vsc2VAMwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM1NwogICAgLy8gcmV0dXJuICcnCiAgICBieXRlY18wIC8vICIiCgp2ZXJpZmllZFJlYWRfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmaWVkUmVhZEA0OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM1NAogICAgLy8gdmVyaWZpZWRSZWFkKGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywgbGVhZjogTGVhZiwgcHJvb2Y6IFByb29mLCB0eXBlOiB1aW50NjQsIGtleTogc3RyaW5nKTogc3RyaW5nIHsKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18zIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgp2ZXJpZmllZFJlYWRfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM1OQogICAgLy8gcmV0dXJuIHRoaXMucmVhZChhZGRyZXNzLCBuYW1lLCBrZXkpCiAgICBkaWcgMgogICAgZGlnIDIKICAgIGRpZyAyCiAgICBjYWxsc3ViIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucmVhZAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM1NAogICAgLy8gdmVyaWZpZWRSZWFkKGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywgbGVhZjogTGVhZiwgcHJvb2Y6IFByb29mLCB0eXBlOiB1aW50NjQsIGtleTogc3RyaW5nKTogc3RyaW5nIHsKICAgIGIgdmVyaWZpZWRSZWFkX2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZmllZFJlYWRANAoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZpZWRNdXN0UmVhZFtyb3V0aW5nXSgpIC0+IHZvaWQ6CnZlcmlmaWVkTXVzdFJlYWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzgxLTM4OAogICAgLy8gdmVyaWZpZWRNdXN0UmVhZCgKICAgIC8vICAgYWRkcmVzczogQWNjb3VudCwKICAgIC8vICAgbmFtZTogc3RyaW5nLAogICAgLy8gICBsZWFmOiBMZWFmLAogICAgLy8gICBwcm9vZjogUHJvb2YsCiAgICAvLyAgIHR5cGU6IHVpbnQ2NCwKICAgIC8vICAga2V5OiBzdHJpbmcKICAgIC8vICk6IHN0cmluZyB7CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGxlbgogICAgaW50Y18zIC8vIDMyCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciB1aW50OFszMl0KICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICBleHRyYWN0IDIgMAogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwogICAgZHVwCiAgICBsZW4KICAgIGludGNfMyAvLyAzMgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDhbMzJdCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA0CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18zIC8vIDMyCiAgICAqCiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1aW50OFszMl1bXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDUKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDggLy8gOAogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgdWludDY0CiAgICBidG9pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyA2CiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozODkKICAgIC8vIGFzc2VydCh0aGlzLnZlcmlmeShhZGRyZXNzLCBuYW1lLCBsZWFmLCBwcm9vZiwgdHlwZSksIEVSUl9GQUlMRURfVE9fVkVSSUZZX0lOQ0xVU0lPTikKICAgIGRpZyA1CiAgICBkaWcgNQogICAgdW5jb3ZlciA1CiAgICB1bmNvdmVyIDUKICAgIHVuY292ZXIgNQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeQogICAgcG9wCiAgICBhc3NlcnQgLy8gZmFpbGVkIHRvIHZlcmlmeSBpbmNsdXNpb24KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozOTAKICAgIC8vIHJldHVybiB0aGlzLnJlYWQoYWRkcmVzcywgbmFtZSwga2V5KQogICAgY2FsbHN1YiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnJlYWQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozODEtMzg4CiAgICAvLyB2ZXJpZmllZE11c3RSZWFkKAogICAgLy8gICBhZGRyZXNzOiBBY2NvdW50LAogICAgLy8gICBuYW1lOiBzdHJpbmcsCiAgICAvLyAgIGxlYWY6IExlYWYsCiAgICAvLyAgIHByb29mOiBQcm9vZiwKICAgIC8vICAgdHlwZTogdWludDY0LAogICAgLy8gICBrZXk6IHN0cmluZwogICAgLy8gKTogc3RyaW5nIHsKICAgIGR1cAogICAgbGVuCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgc3dhcAogICAgY29uY2F0CiAgICBieXRlY18zIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy5hZGRUeXBlW3JvdXRpbmddKCkgLT4gdm9pZDoKYWRkVHlwZToKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzkzCiAgICAvLyBhZGRUeXBlKHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgZGVzY3JpcHRpb246IHN0cmluZywgc2NoZW1hTGlzdDogU2NoZW1hTGlzdCk6IHZvaWQgewogICAgdHhuIEdyb3VwSW5kZXgKICAgIGludGNfMSAvLyAxCiAgICAtCiAgICBkdXAKICAgIGd0eG5zIFR5cGVFbnVtCiAgICBpbnRjXzEgLy8gcGF5CiAgICA9PQogICAgYXNzZXJ0IC8vIHRyYW5zYWN0aW9uIHR5cGUgaXMgcGF5CiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGR1cAogICAgY292ZXIgMgogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgogICAgZHVwCiAgICBjb3ZlciAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgZHVwCiAgICBjb3ZlciA0CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgc3dhcAogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3VpbnQ4W10pCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Mzk0CiAgICAvLyBhc3NlcnQocGF5bWVudC5yZWNlaXZlciA9PT0gR2xvYmFsLmN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MsIEVSUl9JTlZBTElEX1BBWU1FTlRfUkVDRUlWRVIpCiAgICBkaWcgMQogICAgZ3R4bnMgUmVjZWl2ZXIKICAgIGdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCiAgICA9PQogICAgYXNzZXJ0IC8vIEludmFsaWQgcGF5bWVudCByZWNlaXZlcgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM5NQogICAgLy8gYXNzZXJ0KHBheW1lbnQuYW1vdW50ID09PSAxMDBfMDAwXzAwMCwgRVJSX0lOVkFMSURfUEFZTUVOVF9BTU9VTlQpCiAgICBzd2FwCiAgICBndHhucyBBbW91bnQKICAgIHB1c2hpbnQgMTAwMDAwMDAwIC8vIDEwMDAwMDAwMAogICAgPT0KICAgIGFzc2VydCAvLyBJbnZhbGlkIHBheW1lbnQgYW1vdW50CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Mzk2CiAgICAvLyBhc3NlcnQoQnl0ZXMoZGVzY3JpcHRpb24pLmxlbmd0aCA8PSA4MDAsIEVSUl9EQVRBX1RPT19MT05HKQogICAgbGVuCiAgICBkdXAKICAgIHB1c2hpbnQgODAwIC8vIDgwMAogICAgPD0KICAgIGFzc2VydCAvLyBtYXggZGF0YSBsZW5ndGggaXMgMTAyNCBieXRlcwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjM5OAogICAgLy8gbGV0IHNjaGVtYTogc3RyaW5nID0gJycKICAgIGJ5dGVjXzAgLy8gIiIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozOTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBzY2hlbWFMaXN0Lmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAoKYWRkVHlwZV93aGlsZV90b3BAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozOTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBzY2hlbWFMaXN0Lmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGRpZyA0CiAgICA8CiAgICBieiBhZGRUeXBlX2FmdGVyX3doaWxlQDU5CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDAwCiAgICAvLyBzd2l0Y2ggKHNjaGVtYUxpc3RbaV0pIHsKICAgIGRpZyA0CiAgICBleHRyYWN0IDIgMAogICAgZGlnIDEKICAgIGludGNfMSAvLyAxCiAgICBleHRyYWN0MyAvLyBvbiBlcnJvcjogaW5kZXggYWNjZXNzIGlzIG91dCBvZiBib3VuZHMKICAgIGR1cAogICAgYnVyeSA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDAxCiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50ODoKICAgIHB1c2hieXRlcyAweDBhCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQwMS00MDMKICAgIC8vIGNhc2UgU2NoZW1hUGFydFVpbnQ4OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQ4U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VANgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQwMgogICAgLy8gc2NoZW1hICs9IFNjaGVtYVBhcnRVaW50OFN0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAidWludDgiCiAgICBjb25jYXQKICAgIGJ1cnkgMgoKYWRkVHlwZV9ibG9ja0A1NToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NTQKICAgIC8vIGlmIChzY2hlbWFMaXN0Lmxlbmd0aCA+IDAgJiYgaSAhPT0gc2NoZW1hTGlzdC5sZW5ndGggLSAxKSB7CiAgICBkaWcgMwogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDU4CiAgICBkaWcgMwogICAgaW50Y18xIC8vIDEKICAgIC0KICAgIGRpZyAxCiAgICAhPQogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDU4CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDU1CiAgICAvLyBzY2hlbWEgKz0gJywnCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICIsIgogICAgY29uY2F0CiAgICBidXJ5IDIKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUA1ODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozOTkKICAgIC8vIGZvciAobGV0IGk6IHVpbnQ2NCA9IDA7IGkgPCBzY2hlbWFMaXN0Lmxlbmd0aDsgaSArPSAxKSB7CiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBidXJ5IDEKICAgIGIgYWRkVHlwZV93aGlsZV90b3BAMgoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDA0CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50MTY6CiAgICBkaWcgNgogICAgcHVzaGJ5dGVzIDB4MGIKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDA0LTQwNgogICAgLy8gY2FzZSBTY2hlbWFQYXJ0VWludDE2OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQxNlN0cmluZwogICAgLy8gICBicmVhawogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDkKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MDUKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0VWludDE2U3RyaW5nCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICJ1aW50MTYiCiAgICBjb25jYXQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQwNgogICAgLy8gYnJlYWsKICAgIGIgYWRkVHlwZV9ibG9ja0A1NQoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDA3CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50MzI6CiAgICBkaWcgNgogICAgcHVzaGJ5dGVzIDB4MGMKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDA3LTQwOQogICAgLy8gY2FzZSBTY2hlbWFQYXJ0VWludDMyOgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQzMlN0cmluZwogICAgLy8gICBicmVhawogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDEyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDA4CiAgICAvLyBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQzMlN0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAidWludDMyIgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MDkKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTAKICAgIC8vIGNhc2UgU2NoZW1hUGFydFVpbnQ2NDoKICAgIGRpZyA2CiAgICBwdXNoYnl0ZXMgMHgwZAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTAtNDEyCiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50NjQ6CiAgICAvLyAgIHNjaGVtYSArPSBTY2hlbWFQYXJ0VWludDY0U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMTUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTEKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0VWludDY0U3RyaW5nCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICJ1aW50NjQiCiAgICBjb25jYXQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQxMgogICAgLy8gYnJlYWsKICAgIGIgYWRkVHlwZV9ibG9ja0A1NQoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDE1OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQxMwogICAgLy8gY2FzZSBTY2hlbWFQYXJ0VWludDEyODoKICAgIGRpZyA2CiAgICBwdXNoYnl0ZXMgMHgwZQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTMtNDE1CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50MTI4OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQxMjhTdHJpbmcKICAgIC8vICAgYnJlYWsKICAgIGJ6IGFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAxOAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQxNAogICAgLy8gc2NoZW1hICs9IFNjaGVtYVBhcnRVaW50MTI4U3RyaW5nCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICJ1aW50MTI4IgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTUKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAxODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTYKICAgIC8vIGNhc2UgU2NoZW1hUGFydFVpbnQyNTY6CiAgICBkaWcgNgogICAgcHVzaGJ5dGVzIDB4MGYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDE2LTQxOAogICAgLy8gY2FzZSBTY2hlbWFQYXJ0VWludDI1NjoKICAgIC8vICAgc2NoZW1hICs9IFNjaGVtYVBhcnRVaW50MjU2U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMjEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MTcKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0VWludDI1NlN0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAidWludDI1NiIKICAgIGNvbmNhdAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDE4CiAgICAvLyBicmVhawogICAgYiBhZGRUeXBlX2Jsb2NrQDU1CgphZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMjE6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDE5CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRVaW50NTEyOgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDEwCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQxOS00MjEKICAgIC8vIGNhc2UgU2NoZW1hUGFydFVpbnQ1MTI6CiAgICAvLyAgIHNjaGVtYSArPSBTY2hlbWFQYXJ0VWludDUxMlN0cmluZwogICAgLy8gICBicmVhawogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDI0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDIwCiAgICAvLyBzY2hlbWEgKz0gU2NoZW1hUGFydFVpbnQ1MTJTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgInVpbnQ1MTIiCiAgICBjb25jYXQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQyMQogICAgLy8gYnJlYWsKICAgIGIgYWRkVHlwZV9ibG9ja0A1NQoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDI0OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQyMgogICAgLy8gY2FzZSBTY2hlbWFQYXJ0Qnl0ZXM0OgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDE0CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQyMi00MjQKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzNDoKICAgIC8vICAgc2NoZW1hICs9IFNjaGVtYVBhcnRCeXRlczRTdHJpbmcKICAgIC8vICAgYnJlYWsKICAgIGJ6IGFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAyNwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQyMwogICAgLy8gc2NoZW1hICs9IFNjaGVtYVBhcnRCeXRlczRTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgImJ5dGVzNCIKICAgIGNvbmNhdAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDI0CiAgICAvLyBicmVhawogICAgYiBhZGRUeXBlX2Jsb2NrQDU1CgphZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMjc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDI1CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRCeXRlczg6CiAgICBkaWcgNgogICAgcHVzaGJ5dGVzIDB4MTUKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDI1LTQyNwogICAgLy8gY2FzZSBTY2hlbWFQYXJ0Qnl0ZXM4OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzOFN0cmluZwogICAgLy8gICBicmVhawogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDMwCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDI2CiAgICAvLyBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzOFN0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAiYnl0ZXM4IgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MjcKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAzMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MjgKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMTY6CiAgICBkaWcgNgogICAgcHVzaGJ5dGVzIDB4MTYKICAgID09CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDI4LTQzMAogICAgLy8gY2FzZSBTY2hlbWFQYXJ0Qnl0ZXMxNjoKICAgIC8vICAgc2NoZW1hICs9IFNjaGVtYVBhcnRCeXRlczE2U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMzMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MjkKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0Qnl0ZXMxNlN0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAiYnl0ZXMxNiIKICAgIGNvbmNhdAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDMwCiAgICAvLyBicmVhawogICAgYiBhZGRUeXBlX2Jsb2NrQDU1CgphZGRUeXBlX2FmdGVyX2lmX2Vsc2VAMzM6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDMxCiAgICAvLyBjYXNlIFNjaGVtYVBhcnRCeXRlczMyOgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDE3CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQzMS00MzMKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMzI6CiAgICAvLyAgIHNjaGVtYSArPSBTY2hlbWFQYXJ0Qnl0ZXMzMlN0cmluZwogICAgLy8gICBicmVhawogICAgYnogYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDM2CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDMyCiAgICAvLyBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzMzJTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgImJ5dGVzMzIiCiAgICBjb25jYXQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQzMwogICAgLy8gYnJlYWsKICAgIGIgYWRkVHlwZV9ibG9ja0A1NQoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDM2OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQzNAogICAgLy8gY2FzZSBTY2hlbWFQYXJ0Qnl0ZXM2NDoKICAgIGRpZyA2CiAgICBwdXNoYnl0ZXMgMHgxOAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MzQtNDM2CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRCeXRlczY0OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzNjRTdHJpbmcKICAgIC8vICAgYnJlYWsKICAgIGJ6IGFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAzOQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQzNQogICAgLy8gc2NoZW1hICs9IFNjaGVtYVBhcnRCeXRlczY0U3RyaW5nCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICJieXRlczY0IgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MzYKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUAzOToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MzcKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMTI4OgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDE5CiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQzNy00MzkKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMTI4OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzMTI4U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VANDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MzgKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0Qnl0ZXMxMjhTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgImJ5dGVzMTI4IgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0MzkKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUA0MjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDAKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMjU2OgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDFhCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ0MC00NDIKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzMjU2OgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzMjU2U3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VANDUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDEKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0Qnl0ZXMyNTZTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgImJ5dGVzMjU2IgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDIKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUA0NToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDMKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzNTEyOgogICAgZGlnIDYKICAgIHB1c2hieXRlcyAweDFiCiAgICA9PQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ0My00NDUKICAgIC8vIGNhc2UgU2NoZW1hUGFydEJ5dGVzNTEyOgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEJ5dGVzNTEyU3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VANDgKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDQKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0Qnl0ZXM1MTJTdHJpbmcKICAgIGRpZyAxCiAgICBwdXNoYnl0ZXMgImJ5dGVzNTEyIgogICAgY29uY2F0CiAgICBidXJ5IDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDUKICAgIC8vIGJyZWFrCiAgICBiIGFkZFR5cGVfYmxvY2tANTUKCmFkZFR5cGVfYWZ0ZXJfaWZfZWxzZUA0ODoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDYKICAgIC8vIGNhc2UgU2NoZW1hUGFydFN0cmluZzoKICAgIGRpZyA2CiAgICBwdXNoYnl0ZXMgMHgxZQogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDYtNDQ4CiAgICAvLyBjYXNlIFNjaGVtYVBhcnRTdHJpbmc6CiAgICAvLyAgIHNjaGVtYSArPSBTY2hlbWFQYXJ0U3RyaW5nU3RyaW5nCiAgICAvLyAgIGJyZWFrCiAgICBieiBhZGRUeXBlX2FmdGVyX2lmX2Vsc2VANTEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDcKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0U3RyaW5nU3RyaW5nCiAgICBkaWcgMQogICAgcHVzaGJ5dGVzICJzdHJpbmciCiAgICBjb25jYXQKICAgIGJ1cnkgMgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ0OAogICAgLy8gYnJlYWsKICAgIGIgYWRkVHlwZV9ibG9ja0A1NQoKYWRkVHlwZV9hZnRlcl9pZl9lbHNlQDUxOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ0OQogICAgLy8gY2FzZSBTY2hlbWFQYXJ0QWRkcmVzczoKICAgIGRpZyA2CiAgICBwdXNoYnl0ZXMgMHgyOAogICAgPT0KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NDktNDUxCiAgICAvLyBjYXNlIFNjaGVtYVBhcnRBZGRyZXNzOgogICAgLy8gICBzY2hlbWEgKz0gU2NoZW1hUGFydEFkZHJlc3NTdHJpbmcKICAgIC8vICAgYnJlYWsKICAgIGJ6IGFkZFR5cGVfYmxvY2tANTUKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NTAKICAgIC8vIHNjaGVtYSArPSBTY2hlbWFQYXJ0QWRkcmVzc1N0cmluZwogICAgZGlnIDEKICAgIHB1c2hieXRlcyAiYWRkcmVzcyIKICAgIGNvbmNhdAogICAgYnVyeSAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDUxCiAgICAvLyBicmVhawogICAgYiBhZGRUeXBlX2Jsb2NrQDU1CgphZGRUeXBlX2FmdGVyX3doaWxlQDU5OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEyNAogICAgLy8gY29uc3QgaWQgPSB0aGlzLnR5cGVzSUQudmFsdWUKICAgIGludGNfMCAvLyAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6OTUKICAgIC8vIHR5cGVzSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBNZXRhTWVya2xlc0dsb2JhbFN0YXRlS2V5VHlwZXNJRCB9KQogICAgYnl0ZWMgNiAvLyAidHlwZXNfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTI0CiAgICAvLyBjb25zdCBpZCA9IHRoaXMudHlwZXNJRC52YWx1ZQogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBHbG9iYWxTdGF0ZSBleGlzdHMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMjUKICAgIC8vIHRoaXMudHlwZXNJRC52YWx1ZSArPSAxCiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6OTUKICAgIC8vIHR5cGVzSUQgPSBHbG9iYWxTdGF0ZTx1aW50NjQ+KHsga2V5OiBNZXRhTWVya2xlc0dsb2JhbFN0YXRlS2V5VHlwZXNJRCB9KQogICAgYnl0ZWMgNiAvLyAidHlwZXNfaWQiCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTI1CiAgICAvLyB0aGlzLnR5cGVzSUQudmFsdWUgKz0gMQogICAgc3dhcAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NjEtNDY0CiAgICAvLyB0aGlzLnR5cGVzKGlkKS52YWx1ZSA9IHsKICAgIC8vICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLAogICAgLy8gICBzY2hlbWEsCiAgICAvLyB9CiAgICBkaWcgMgogICAgZHVwCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBzd2FwCiAgICBjb25jYXQKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDQgLy8gNAogICAgKwogICAgZGlnIDUKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBkaWcgOQogICAgY29uY2F0CiAgICBzd2FwCiAgICBpdG9iCiAgICBleHRyYWN0IDYgMgogICAgcHVzaGJ5dGVzIDB4MDAwNAogICAgc3dhcAogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDYxCiAgICAvLyB0aGlzLnR5cGVzKGlkKS52YWx1ZSA9IHsKICAgIHN3YXAKICAgIGl0b2IKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMDAKICAgIC8vIHR5cGVzID0gQm94TWFwPHVpbnQ2NCwgVHlwZXNWYWx1ZT4oeyBrZXlQcmVmaXg6IE1ldGFNZXJrbGVzQm94UHJlZml4VHlwZXMgfSkKICAgIHB1c2hieXRlcyAidCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ2MS00NjQKICAgIC8vIHRoaXMudHlwZXMoaWQpLnZhbHVlID0gewogICAgLy8gICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sCiAgICAvLyAgIHNjaGVtYSwKICAgIC8vIH0KICAgIGR1cAogICAgYm94X2RlbAogICAgcG9wCiAgICBzd2FwCiAgICBib3hfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzkzCiAgICAvLyBhZGRUeXBlKHBheW1lbnQ6IGd0eG4uUGF5bWVudFR4biwgZGVzY3JpcHRpb246IHN0cmluZywgc2NoZW1hTGlzdDogU2NoZW1hTGlzdCk6IHZvaWQgewogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucm9vdENvc3RzW3JvdXRpbmddKCkgLT4gdm9pZDoKcm9vdENvc3RzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ2OQogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAxCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgZXh0cmFjdCAyIDAKICAgIGNhbGxzdWIgc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy5yb290Q29zdHMKICAgIGl0b2IKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLmRhdGFDb3N0c1tyb3V0aW5nXSgpIC0+IHZvaWQ6CmRhdGFDb3N0czoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NzUKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQogICAgZHVwCiAgICBpbnRjXzAgLy8gMAogICAgZXh0cmFjdF91aW50MTYKICAgIGludGNfMiAvLyAyCiAgICArCiAgICBkaWcgMQogICAgbGVuCiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgbnVtYmVyIG9mIGJ5dGVzIGZvciAobGVuK3V0ZjhbXSkKICAgIHR4bmEgQXBwbGljYXRpb25BcmdzIDIKICAgIGR1cAogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBpbnRjXzIgLy8gMgogICAgKwogICAgZGlnIDEKICAgIGxlbgogICAgPT0KICAgIGFzc2VydCAvLyBpbnZhbGlkIG51bWJlciBvZiBieXRlcyBmb3IgKGxlbit1dGY4W10pCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAzCiAgICBkdXAKICAgIGludGNfMCAvLyAwCiAgICBleHRyYWN0X3VpbnQxNgogICAgaW50Y18yIC8vIDIKICAgICsKICAgIGRpZyAxCiAgICBsZW4KICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBudW1iZXIgb2YgYnl0ZXMgZm9yIChsZW4rdXRmOFtdKQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ3NwogICAgLy8gY29uc3QgY29zdHMgPSB0aGlzLm1icignJywgJycsIG5hbWUubmF0aXZlLCBrZXkubmF0aXZlLCB2YWx1ZS5uYXRpdmUpCiAgICB1bmNvdmVyIDIKICAgIGV4dHJhY3QgMiAwCiAgICB1bmNvdmVyIDIKICAgIGV4dHJhY3QgMiAwCiAgICB1bmNvdmVyIDIKICAgIGV4dHJhY3QgMiAwCiAgICBieXRlY18wIC8vICIiCiAgICBkdXAKICAgIGNvdmVyIDQKICAgIGNvdmVyIDQKICAgIGNhbGxzdWIgbWJyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDc4CiAgICAvLyByZXR1cm4gY29zdHMuZGF0YQogICAgZXh0cmFjdCAxNiA4CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6NDc1CiAgICAvLyBAYWJpbWV0aG9kKHsgcmVhZG9ubHk6IHRydWUgfSkKICAgIGJ5dGVjXzMgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCgovLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLm1icih0eXBlRGVzY3JpcHRpb246IGJ5dGVzLCBzY2hlbWE6IGJ5dGVzLCByb290TmFtZTogYnl0ZXMsIGRhdGFLZXk6IGJ5dGVzLCBkYXRhVmFsdWU6IGJ5dGVzKSAtPiBieXRlczoKbWJyOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjEwOS0xMTUKICAgIC8vIHByaXZhdGUgbWJyKAogICAgLy8gICB0eXBlRGVzY3JpcHRpb246IHN0cmluZywKICAgIC8vICAgc2NoZW1hOiBzdHJpbmcsCiAgICAvLyAgIHJvb3ROYW1lOiBzdHJpbmcsCiAgICAvLyAgIGRhdGFLZXk6IHN0cmluZywKICAgIC8vICAgZGF0YVZhbHVlOiBzdHJpbmcKICAgIC8vICk6IE1ldGFNZXJrbGVzTUJSRGF0YSB7CiAgICBwcm90byA1IDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMTcKICAgIC8vIHR5cGVzOiBNaW5UeXBlc01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKHR5cGVEZXNjcmlwdGlvbikubGVuZ3RoICsgQnl0ZXMoc2NoZW1hKS5sZW5ndGgpLAogICAgZnJhbWVfZGlnIC01CiAgICBsZW4KICAgIGludGMgNCAvLyA0MDAKICAgICoKICAgIGZyYW1lX2RpZyAtNAogICAgbGVuCiAgICArCiAgICBwdXNoaW50IDkzMDAgLy8gOTMwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjExOAogICAgLy8gcm9vdHM6IE1pblJvb3RzTUJSICsgKEJveENvc3RQZXJCeXRlICogQnl0ZXMocm9vdE5hbWUpLmxlbmd0aCksCiAgICBmcmFtZV9kaWcgLTMKICAgIGxlbgogICAgaW50YyA0IC8vIDQwMAogICAgZGlnIDEKICAgICoKICAgIHB1c2hpbnQgMzAxMDAgLy8gMzAxMDAKICAgICsKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMTkKICAgIC8vIGRhdGE6IE1pbkRhdGFNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiAoQnl0ZXMocm9vdE5hbWUpLmxlbmd0aCArIEJ5dGVzKGRhdGFLZXkpLmxlbmd0aCArIEJ5dGVzKGRhdGFWYWx1ZSkubGVuZ3RoKSksCiAgICBmcmFtZV9kaWcgLTIKICAgIGxlbgogICAgdW5jb3ZlciAyCiAgICArCiAgICBmcmFtZV9kaWcgLTEKICAgIGxlbgogICAgKwogICAgaW50YyA0IC8vIDQwMAogICAgKgogICAgcHVzaGludCAxMjUwMCAvLyAxMjUwMAogICAgKwogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjExNi0xMjAKICAgIC8vIHJldHVybiB7CiAgICAvLyAgIHR5cGVzOiBNaW5UeXBlc01CUiArIChCb3hDb3N0UGVyQnl0ZSAqIEJ5dGVzKHR5cGVEZXNjcmlwdGlvbikubGVuZ3RoICsgQnl0ZXMoc2NoZW1hKS5sZW5ndGgpLAogICAgLy8gICByb290czogTWluUm9vdHNNQlIgKyAoQm94Q29zdFBlckJ5dGUgKiBCeXRlcyhyb290TmFtZSkubGVuZ3RoKSwKICAgIC8vICAgZGF0YTogTWluRGF0YU1CUiArIChCb3hDb3N0UGVyQnl0ZSAqIChCeXRlcyhyb290TmFtZSkubGVuZ3RoICsgQnl0ZXMoZGF0YUtleSkubGVuZ3RoICsgQnl0ZXMoZGF0YVZhbHVlKS5sZW5ndGgpKSwKICAgIC8vIH0KICAgIHVuY292ZXIgMgogICAgaXRvYgogICAgdW5jb3ZlciAyCiAgICBpdG9iCiAgICBjb25jYXQKICAgIHN3YXAKICAgIGl0b2IKICAgIGNvbmNhdAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnkoYWRkcmVzczogYnl0ZXMsIG5hbWU6IGJ5dGVzLCBsZWFmOiBieXRlcywgcHJvb2Y6IGJ5dGVzLCB0eXBlOiB1aW50NjQpIC0+IHVpbnQ2NCwgYnl0ZXM6CnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5OgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjI5NgogICAgLy8gdmVyaWZ5KGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywgbGVhZjogTGVhZiwgcHJvb2Y6IFByb29mLCB0eXBlOiB1aW50NjQpOiBib29sZWFuIHsKICAgIHByb3RvIDUgMgogICAgaW50Y18wIC8vIDAKICAgIGR1cAogICAgYnl0ZWNfMCAvLyAiIgogICAgZHVwbiAzCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Mjk3CiAgICAvLyBjb25zdCB0cnVuY2F0ZWRBZGRyZXNzID0gYnl0ZXMxNihhZGRyZXNzLmJ5dGVzKQogICAgZnJhbWVfZGlnIC01CiAgICBjYWxsc3ViIGJ5dGVzMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoyOTkKICAgIC8vIGNvbnN0IHJvb3RLZXk6IFJvb3RLZXkgPSB7IGFkZHJlc3MsIG5hbWUgfQogICAgZnJhbWVfZGlnIC00CiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgLTQKICAgIGNvbmNhdAogICAgZnJhbWVfZGlnIC01CiAgICBieXRlYyA0IC8vIDB4MDAyMgogICAgY29uY2F0CiAgICBkaWcgMQogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzAwCiAgICAvLyBjb25zdCB0eXBlS2V5OiBEYXRhS2V5ID0geyBhZGRyZXNzOiB0cnVuY2F0ZWRBZGRyZXNzLCBuYW1lLCBrZXk6IHRyZWVUeXBlS2V5IH0KICAgIGRpZyAyCiAgICBsZW4KICAgIHB1c2hpbnQgMTYgLy8gMTYKICAgID09CiAgICBhc3NlcnQgLy8gaW52YWxpZCBzaXplCiAgICB1bmNvdmVyIDIKICAgIGJ5dGVjXzEgLy8gMHgwMDE0CiAgICBjb25jYXQKICAgIGRpZyAyCiAgICBsZW4KICAgIHB1c2hpbnQgMjAgLy8gMjAKICAgICsKICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBjb25jYXQKICAgIHVuY292ZXIgMgogICAgY29uY2F0CiAgICBieXRlYyA3IC8vIDB4MDAwNjZjMmU3NDc5NzA2NQogICAgY29uY2F0CiAgICBzd2FwCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTAyCiAgICAvLyByb290cyA9IEJveE1hcDxSb290S2V5LCBieXRlczwzMj4+KHsga2V5UHJlZml4OiBNZXRhTWVya2xlc0JveFByZWZpeFJvb3RzIH0pCiAgICBieXRlYyA1IC8vICJyIgogICAgc3dhcAogICAgY29uY2F0CiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozMDIKICAgIC8vIGlmICghdGhpcy5yb290cyhyb290S2V5KS5leGlzdHMgfHwgIXRoaXMuZGF0YSh0eXBlS2V5KS5leGlzdHMpIHsKICAgIGJveF9sZW4KICAgIGJ1cnkgMQogICAgYnogc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfaWZfYm9keUAyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTA0CiAgICAvLyBkYXRhID0gQm94TWFwPERhdGFLZXksIHN0cmluZz4oeyBrZXlQcmVmaXg6IE1ldGFNZXJrbGVzQm94UHJlZml4RGF0YSB9KQogICAgYnl0ZWNfMiAvLyAiZCIKICAgIGZyYW1lX2RpZyA2CiAgICBjb25jYXQKICAgIGR1cAogICAgZnJhbWVfYnVyeSAwCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzAyCiAgICAvLyBpZiAoIXRoaXMucm9vdHMocm9vdEtleSkuZXhpc3RzIHx8ICF0aGlzLmRhdGEodHlwZUtleSkuZXhpc3RzKSB7CiAgICBib3hfbGVuCiAgICBidXJ5IDEKICAgIGJueiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeV9hZnRlcl9pZl9lbHNlQDMKCnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5X2lmX2JvZHlAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozMDMKICAgIC8vIHJldHVybiBmYWxzZQogICAgaW50Y18wIC8vIDAKICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfYnVyeSAxCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfaWZfZWxzZUAzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMwNgogICAgLy8gY29uc3QgdHJlZVR5cGUgPSBidG9pKEJ5dGVzKHRoaXMuZGF0YSh0eXBlS2V5KS52YWx1ZSkpCiAgICBmcmFtZV9kaWcgMAogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIGJ0b2kKICAgIGZyYW1lX2J1cnkgNQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMwNwogICAgLy8gaWYgKHR5cGUgIT09IE1lcmtsZVRyZWVUeXBlVW5zcGVjaWZpZWQgJiYgdHJlZVR5cGUgIT09IHR5cGUpIHsKICAgIGZyYW1lX2RpZyAtMQogICAgYnogc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfaWZfZWxzZUA2CiAgICBmcmFtZV9kaWcgNQogICAgZnJhbWVfZGlnIC0xCiAgICAhPQogICAgYnogc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfaWZfZWxzZUA2CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzA4CiAgICAvLyByZXR1cm4gZmFsc2UKICAgIGludGNfMCAvLyAwCiAgICBmcmFtZV9kaWcgLTIKICAgIGZyYW1lX2J1cnkgMQogICAgZnJhbWVfYnVyeSAwCiAgICByZXRzdWIKCnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5X2FmdGVyX2lmX2Vsc2VANjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozMTEKICAgIC8vIGVuc3VyZUJ1ZGdldChwcm9vZi5sZW5ndGggKiA1MCkKICAgIGZyYW1lX2RpZyAtMgogICAgaW50Y18wIC8vIDAKICAgIGV4dHJhY3RfdWludDE2CiAgICBkdXAKICAgIGZyYW1lX2J1cnkgMgogICAgcHVzaGludCA1MCAvLyA1MAogICAgKgogICAgcHVzaGludCAxMCAvLyAxMAogICAgKwogICAgZnJhbWVfYnVyeSA0CgpzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeV93aGlsZV90b3BAMTU6CiAgICBmcmFtZV9kaWcgNAogICAgZ2xvYmFsIE9wY29kZUJ1ZGdldAogICAgPgogICAgYnogc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfd2hpbGVAMjAKICAgIGl0eG5fYmVnaW4KICAgIHB1c2hpbnQgNiAvLyBhcHBsCiAgICBpdHhuX2ZpZWxkIFR5cGVFbnVtCiAgICBwdXNoaW50IDUgLy8gRGVsZXRlQXBwbGljYXRpb24KICAgIGl0eG5fZmllbGQgT25Db21wbGV0aW9uCiAgICBieXRlYyA4IC8vIDB4MDY4MTAxCiAgICBpdHhuX2ZpZWxkIEFwcHJvdmFsUHJvZ3JhbQogICAgYnl0ZWMgOCAvLyAweDA2ODEwMQogICAgaXR4bl9maWVsZCBDbGVhclN0YXRlUHJvZ3JhbQogICAgaW50Y18wIC8vIDAKICAgIGl0eG5fZmllbGQgRmVlCiAgICBpdHhuX3N1Ym1pdAogICAgYiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeV93aGlsZV90b3BAMTUKCnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5X2FmdGVyX3doaWxlQDIwOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMxNAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHByb29mLmxlbmd0aDsgaSArPSAxKSB7CiAgICBpbnRjXzAgLy8gMAogICAgZnJhbWVfYnVyeSAzCiAgICBmcmFtZV9kaWcgLTMKICAgIGZyYW1lX2J1cnkgMQoKc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfd2hpbGVfdG9wQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzE0CiAgICAvLyBmb3IgKGxldCBpOiB1aW50NjQgPSAwOyBpIDwgcHJvb2YubGVuZ3RoOyBpICs9IDEpIHsKICAgIGZyYW1lX2RpZyAzCiAgICBmcmFtZV9kaWcgMgogICAgPAogICAgYnogc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfd2hpbGVAOQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMxNQogICAgLy8gaGFzaCA9IHRoaXMuaGFzaChwcm9vZltpXSwgaGFzaCkKICAgIGZyYW1lX2RpZyAtMgogICAgZXh0cmFjdCAyIDAKICAgIGZyYW1lX2RpZyAzCiAgICBpbnRjXzMgLy8gMzIKICAgICoKICAgIGludGNfMyAvLyAzMgogICAgZXh0cmFjdDMgLy8gb24gZXJyb3I6IGluZGV4IGFjY2VzcyBpcyBvdXQgb2YgYm91bmRzCiAgICBkdXAKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMzAKICAgIC8vIGlmIChCaWdVaW50KGEpID4gQmlnVWludChiKSkgewogICAgZnJhbWVfZGlnIDEKICAgIGI+CiAgICBieiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeV9hZnRlcl9pZl9lbHNlQDEyCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTMxCiAgICAvLyByZXR1cm4gc2hhMjU2KGIuY29uY2F0KGEpKQogICAgZnJhbWVfZGlnIDEKICAgIHN3YXAKICAgIGNvbmNhdAogICAgc2hhMjU2CiAgICBmcmFtZV9idXJ5IDEKCnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5X2FmdGVyX2lubGluZWRfc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy5oYXNoQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMxNAogICAgLy8gZm9yIChsZXQgaTogdWludDY0ID0gMDsgaSA8IHByb29mLmxlbmd0aDsgaSArPSAxKSB7CiAgICBmcmFtZV9kaWcgMwogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGZyYW1lX2J1cnkgMwogICAgYiBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnZlcmlmeV93aGlsZV90b3BANwoKc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfaWZfZWxzZUAxMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czoxMzMKICAgIC8vIHJldHVybiBzaGEyNTYoYS5jb25jYXQoYikpCiAgICBmcmFtZV9kaWcgMQogICAgY29uY2F0CiAgICBzaGEyNTYKICAgIGZyYW1lX2J1cnkgMQogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMxNQogICAgLy8gaGFzaCA9IHRoaXMuaGFzaChwcm9vZltpXSwgaGFzaCkKICAgIGIgc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjpNZXRhTWVya2xlcy52ZXJpZnlfYWZ0ZXJfaW5saW5lZF9zbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLmhhc2hAMTMKCnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMudmVyaWZ5X2FmdGVyX3doaWxlQDk6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzE4CiAgICAvLyByZXR1cm4gaGFzaCA9PT0gdGhpcy5yb290cyhyb290S2V5KS52YWx1ZQogICAgZnJhbWVfZGlnIDcKICAgIGJveF9nZXQKICAgIGFzc2VydCAvLyBCb3ggbXVzdCBoYXZlIHZhbHVlCiAgICBmcmFtZV9kaWcgMQogICAgPT0KICAgIGZyYW1lX2RpZyAtMgogICAgZnJhbWVfYnVyeSAxCiAgICBmcmFtZV9idXJ5IDAKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucmVhZChhZGRyZXNzOiBieXRlcywgbmFtZTogYnl0ZXMsIGtleTogYnl0ZXMpIC0+IGJ5dGVzOgpzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6Ok1ldGFNZXJrbGVzLnJlYWQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzI5LTMzMAogICAgLy8gQGFiaW1ldGhvZCh7IHJlYWRvbmx5OiB0cnVlIH0pCiAgICAvLyByZWFkKGFkZHJlc3M6IEFjY291bnQsIG5hbWU6IHN0cmluZywga2V5OiBzdHJpbmcpOiBzdHJpbmcgewogICAgcHJvdG8gMyAxCiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MzMxCiAgICAvLyBjb25zdCB0cnVuY2F0ZWRBZGRyZXNzID0gYnl0ZXMxNihhZGRyZXNzLmJ5dGVzKQogICAgZnJhbWVfZGlnIC0zCiAgICBjYWxsc3ViIGJ5dGVzMTYKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czozMzIKICAgIC8vIHJldHVybiB0aGlzLmRhdGEoeyBhZGRyZXNzOiB0cnVuY2F0ZWRBZGRyZXNzLCBuYW1lLCBrZXkgfSkudmFsdWUKICAgIGR1cAogICAgbGVuCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICA9PQogICAgYXNzZXJ0IC8vIGludmFsaWQgc2l6ZQogICAgZnJhbWVfZGlnIC0yCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgLTIKICAgIGNvbmNhdAogICAgc3dhcAogICAgYnl0ZWNfMSAvLyAweDAwMTQKICAgIGNvbmNhdAogICAgZGlnIDEKICAgIGxlbgogICAgcHVzaGludCAyMCAvLyAyMAogICAgKwogICAgZnJhbWVfZGlnIC0xCiAgICBsZW4KICAgIGl0b2IKICAgIGV4dHJhY3QgNiAyCiAgICBmcmFtZV9kaWcgLTEKICAgIGNvbmNhdAogICAgc3dhcAogICAgaXRvYgogICAgZXh0cmFjdCA2IDIKICAgIHVuY292ZXIgMgogICAgc3dhcAogICAgY29uY2F0CiAgICB1bmNvdmVyIDIKICAgIGNvbmNhdAogICAgc3dhcAogICAgY29uY2F0CiAgICAvLyBzbWFydF9jb250cmFjdHMvbWV0YS1tZXJrbGVzL2NvbnRyYWN0LmFsZ28udHM6MTA0CiAgICAvLyBkYXRhID0gQm94TWFwPERhdGFLZXksIHN0cmluZz4oeyBrZXlQcmVmaXg6IE1ldGFNZXJrbGVzQm94UHJlZml4RGF0YSB9KQogICAgYnl0ZWNfMiAvLyAiZCIKICAgIHN3YXAKICAgIGNvbmNhdAogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjMzMgogICAgLy8gcmV0dXJuIHRoaXMuZGF0YSh7IGFkZHJlc3M6IHRydW5jYXRlZEFkZHJlc3MsIG5hbWUsIGtleSB9KS52YWx1ZQogICAgYm94X2dldAogICAgYXNzZXJ0IC8vIEJveCBtdXN0IGhhdmUgdmFsdWUKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucm9vdENvc3RzKG5hbWU6IGJ5dGVzKSAtPiB1aW50NjQ6CnNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo6TWV0YU1lcmtsZXMucm9vdENvc3RzOgogICAgLy8gc21hcnRfY29udHJhY3RzL21ldGEtbWVya2xlcy9jb250cmFjdC5hbGdvLnRzOjQ2OS00NzAKICAgIC8vIEBhYmltZXRob2QoeyByZWFkb25seTogdHJ1ZSB9KQogICAgLy8gcm9vdENvc3RzKG5hbWU6IHN0cmluZyk6IHVpbnQ2NCB7CiAgICBwcm90byAxIDEKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NzEKICAgIC8vIGNvbnN0IGNvc3RzID0gdGhpcy5tYnIoJycsICcnLCBuYW1lLCB0cmVlVHlwZUtleSwgU3RyaW5nKGl0b2IoMCkpKQogICAgaW50Y18wIC8vIDAKICAgIGl0b2IKICAgIGJ5dGVjXzAgLy8gIiIKICAgIGR1cAogICAgZnJhbWVfZGlnIC0xCiAgICBwdXNoYnl0ZXMgImwudHlwZSIKICAgIHVuY292ZXIgNAogICAgY2FsbHN1YiBtYnIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy9tZXRhLW1lcmtsZXMvY29udHJhY3QuYWxnby50czo0NzIKICAgIC8vIHJldHVybiBjb3N0cy5yb290cyArIGNvc3RzLmRhdGEKICAgIGR1cAogICAgcHVzaGludCA4IC8vIDgKICAgIGV4dHJhY3RfdWludDY0CiAgICBzd2FwCiAgICBwdXNoaW50IDE2IC8vIDE2CiAgICBleHRyYWN0X3VpbnQ2NAogICAgKwogICAgcmV0c3ViCg==", "clear": "I3ByYWdtYSB2ZXJzaW9uIDExCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBAYWxnb3JhbmRmb3VuZGF0aW9uL2FsZ29yYW5kLXR5cGVzY3JpcHQvYmFzZS1jb250cmFjdC5kLnRzOjpCYXNlQ29udHJhY3QuY2xlYXJTdGF0ZVByb2dyYW0oKSAtPiB1aW50NjQ6Cm1haW46CiAgICBwdXNoaW50IDEgLy8gMQogICAgcmV0dXJuCg==" }, "byteCode": { "approval": "CyAFAAECIJADJgkAAgAUAWQEFR98dQIAIgFyCHR5cGVzX2lkCAAGbC50eXBlAwaBATEZFEQxGEEAXIIMBKJMBnwE3yh6fQTG09cEBEL8cgIEBtOJBAQr88xaBFDDbkEEDPG5zwQf98dMBDnBfe0EcrJZgQR2g80lNhoAjgwAPQDjAUwBgwJ/AwIDTAOFA/YEXwbOBugAgARMXGG6NhoAjgEAAQAnBiJnI0OKAQGL/xUiSwEPIksCTwJNgRBLAg+BEE8DTwJNi/9OAlJJFYEQEkSJMRYjCUk4ECMSRDYaAUkiWSQISwEVEkRXAgA2GgJJFSUSRDYaA0kVgQgSRBdLAhVJgR8OREwWgAF0SwFQvUUBRDEAiP+TMQBPAxZXBgJLBVBMJwRQSwFQSwIVgRASRE8CKVBLAhWBFAgWVwYCUE8CUCcHUCcFTwJQSb1FARREKk8CUEm9RQEUREsFOAcyChJPBjgITwaIB8MSEERMTwO/SbxITL8jQzYaAUkiWSQISwEVEkRXAgAxAIj/HTEASwIVFlcGAksDUEwnBFBLAVBLAhWBEBJETwIpUEsCFYEUCBZXBgJQTwJQJwdQJwVPAlBJvUUBRLxIKkxQvEixMQBMiAdZsgiyByOyECKyAbMjQzYaAUkiWSQISwEVEkRXAgA2GgJJFSUSRDEASwIVFlcGAk8DUEwnBFBMUCcFTFBJvUUBREy/I0MxFiMJSTgQIxJENhoBSSJZJAhLARUSRFcCAEk2GgJJIlkkCEsBFRJEVwIASU4CNhoDSSJZJAhLARUSRFcCAElOAzEASwMVFlcGAk8EUElOBEwnBFBMUE4CTBVJTgJJgQ8OREwVgYAIDkQkDEAAJCJLAUlOAg8iSwJPAk0kSwIPJE8DTwJNSwZOAlKAAmwuEkAAZiNEJwVLAlC9RQFEKElLB0sHSU4ESwhJTgaIBP9LCUk4BzIKEkw4CE8CgRBbEhBEMQCI/cxJFYEQEkQpUEsFSU4CFYEUCEsFFlcGAk8EUEwWVwYCTwJMUE8CUExQKkxQSbxITL8jQyJC/5c2GgFJIlkkCEsBFRJEVwIANhoCSSJZJAhLARUSRFcCADEAiP1xSRWBEBJESwIVFlcGAksDUEwpUEsBFYEUCEsDFRZXBgJLBFBMFlcGAk8CTFBPAlBMUCpMUEm9RQFESb5IKElPBU8FTwSIBEVMvEixMQBMgRBbsgiyByOyECKyAbMjQzYaAUkVJRJENhoCSSJZJAhLARUSRFcCADYaA0kVJRJENhoESSJZJQskCEsBFRJENhoFSRWBCBJEF4gELEiAAQAiTwJUK0xQsCNDNhoBSRUlEkQ2GgJJIlkkCEsBFRJEVwIANhoDSSJZJAhLARUSRFcCAIgE4kkVFlcGAkxQK0xQsCNDNhoBRwIVJRJENhoCSSJZJAhLARUSRFcCAElOAjYaA0kVJRJENhoESSJZJQskCEsBFRJENhoFSRWBCBJEFzYaBkkiWSQISwEVEkRXAgBOBYgDk0hAAA8oSRUWVwYCTFArTFCwI0NLAksCSwKIBGZC/+Y2GgFJFSUSRDYaAkkiWSQISwEVEkRXAgA2GgNJFSUSRDYaBEkiWSULJAhLARUSRDYaBUkVgQgSRBc2GgZJIlkkCEsBFRJEVwIASwVLBU8FTwVPBYgDHkhEiAQISRUWVwYCTFArTFCwI0MiMRYjCUk4ECMSRDYaAUkiWSQISwEVEkRXAgBJTgI2GgJJTgNJIllJTgQkCEwVEkRLATgHMgoSREw4CIGAwtcvEkQVSYGgBg5EKCJJSwQMQQHbSwRXAgBLASNYSUUIgAEKEkEAK0sBgAV1aW50OFBFAksDQQASSwMjCUsBE0EACEsBgAEsUEUCSSMIRQFC/7tLBoABCxJBABBLAYAGdWludDE2UEUCQv/ISwaAAQwSQQAQSwGABnVpbnQzMlBFAkL/r0sGgAENEkEAEEsBgAZ1aW50NjRQRQJC/5ZLBoABDhJBABFLAYAHdWludDEyOFBFAkL/fEsGgAEPEkEAEUsBgAd1aW50MjU2UEUCQv9iSwaAARASQQARSwGAB3VpbnQ1MTJQRQJC/0hLBoABFBJBABBLAYAGYnl0ZXM0UEUCQv8vSwaAARUSQQAQSwGABmJ5dGVzOFBFAkL/FksGgAEWEkEAEUsBgAdieXRlczE2UEUCQv78SwaAARcSQQARSwGAB2J5dGVzMzJQRQJC/uJLBoABGBJBABFLAYAHYnl0ZXM2NFBFAkL+yEsGgAEZEkEAEksBgAhieXRlczEyOFBFAkL+rUsGgAEaEkEAEksBgAhieXRlczI1NlBFAkL+kksGgAEbEkEAEksBgAhieXRlczUxMlBFAkL+d0sGgAEeEkEAEEsBgAZzdHJpbmdQRQJC/l5LBoABKBJB/lVLAYAHYWRkcmVzc1BFAkL+RCInBmVESSMIJwZMZ0sCSRUWVwYCTFBJFYEECEsFFlcGAksJUEwWVwYCgAIABExQTwJQTFBMFoABdExQSbxITL8jQzYaAUkiWSQISwEVEkRXAgCIAbcWK0xQsCNDNhoBSSJZJAhLARUSRDYaAkkiWSQISwEVEkQ2GgNJIlkkCEsBFRJETwJXAgBPAlcCAE8CVwIAKElOBE4EiAAJVxAIK0xQsCNDigUBi/sVIQQLi/wVCIHUSAiL/RUhBEsBC4GU6wEIi/4VTwIIi/8VCCEEC4HUYQhPAhZPAhZQTBZQiYoFAiJJKEcDi/uI+J6L/BUWVwYCi/xQi/snBFBLAVBLAhWBEBJETwIpUEsCFYEUCBZXBgJQTwJQJwdQTCcFTFBJvUUBQQANKosGUEmMAL1FAUAACCKL/owBjACJiwC+RBeMBYv/QQAQiwWL/xNBAAgii/6MAYwAiYv+IllJjAKBMguBCgiMBIsEMgwNQQAYsYEGshCBBbIZJwiyHicIsh8isgGzQv/gIowDi/2MAYsDiwIMQQAri/5XAgCLAyULJVhJiwGlQQAQiwFMUAGMAYsDIwiMA0L/1osBUAGMAUL/7osHvkSLARKL/owBjACJigMBi/2I97RJFYEQEkSL/hUWVwYCi/5QTClQSwEVgRQIi/8VFlcGAov/UEwWVwYCTwJMUE8CUExQKkxQvkSJigEBIhYoSYv/gAZsLnR5cGVPBIj+gkmBCFtMgRBbCIk=", "clear": "C4EBQw==" }, "events": [], "templateVariables": {} };
var MetaMerklesParamsFactory = class _MetaMerklesParamsFactory {
  /**
   * Gets available create ABI call param factories
   */
  static get create() {
    return {
      _resolveByMethod(params) {
        switch (params.method) {
          case "create":
          case "create()void":
            return _MetaMerklesParamsFactory.create.create(params);
        }
        throw new Error(`Unknown ' + verb + ' method`);
      },
      /**
       * Constructs create ABI call params for the MetaMerkles smart contract using the create()void ABI method
       *
       * @param params Parameters for the call
       * @returns An `AppClientMethodCallParams` object for the call
       */
      create(params) {
        return {
          ...params,
          method: "create()void",
          args: Array.isArray(params.args) ? params.args : []
        };
      }
    };
  }
  /**
     * Constructs a no op call for the addRoot(pay,string,byte[32],uint64)void ABI method
     *
    * Creates two boxes and adds a merkle root
    using a `RootKey` to the root box map and also a list type to the
    metadata attached to the root in the data box map
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
  static addRoot(params) {
    return {
      ...params,
      method: "addRoot(pay,string,byte[32],uint64)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.name, params.args.root, params.args.type]
    };
  }
  /**
   * Constructs a no op call for the deleteRoot(string)void ABI method
   *
   * Deletes the merkle root from the root box map
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static deleteRoot(params) {
    return {
      ...params,
      method: "deleteRoot(string)void",
      args: Array.isArray(params.args) ? params.args : [params.args.name]
    };
  }
  /**
   * Constructs a no op call for the updateRoot(string,byte[32])void ABI method
   *
   * Replaces the merkle root with another
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static updateRoot(params) {
    return {
      ...params,
      method: "updateRoot(string,byte[32])void",
      args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.newRoot]
    };
  }
  /**
     * Constructs a no op call for the addData(pay,string,string,string)void ABI method
     *
    * Registers a key & value in the data box map that
    corresponds to a merkle root in the root box map
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
  static addData(params) {
    return {
      ...params,
      method: "addData(pay,string,string,string)void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.name, params.args.key, params.args.value]
    };
  }
  /**
   * Constructs a no op call for the deleteData(string,string)void ABI method
   *
   * Deletes a metadata key & value pair from the data box map
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static deleteData(params) {
    return {
      ...params,
      method: "deleteData(string,string)void",
      args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.key]
    };
  }
  /**
   * Constructs a no op call for the verify(address,string,byte[32],byte[32][],uint64)bool ABI method
   *
   * verify an inclusion in a double sha256 based merkle tree
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static verify(params) {
    return {
      ...params,
      method: "verify(address,string,byte[32],byte[32][],uint64)bool",
      args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.name, params.args.leaf, params.args.proof, params.args.type]
    };
  }
  /**
   * Constructs a no op call for the read(address,string,string)string ABI method
   *
   * Fetch a metadata properties
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static read(params) {
    return {
      ...params,
      method: "read(address,string,string)string",
      args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.name, params.args.key]
    };
  }
  /**
     * Constructs a no op call for the verifiedRead(address,string,byte[32],byte[32][],uint64,string)string ABI method
     *
    * Read metadata from box storage and verify the data provided is included
    in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
    thats pre-computed off chain.
    
    verify an inclusion in a merkle tree
    & read an associated key value pair
    & check against the underlying data's schema
    & check against the underlying data's list type or purpose
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
  static verifiedRead(params) {
    return {
      ...params,
      method: "verifiedRead(address,string,byte[32],byte[32][],uint64,string)string",
      args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.name, params.args.leaf, params.args.proof, params.args.type, params.args.key]
    };
  }
  /**
     * Constructs a no op call for the verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string ABI method
     *
    * Read metadata from box storage and verify the data provided is included
    in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
    thats pre-computed off chain.
    
    verify an inclusion in a merkle tree
    & read an associated key value pair
    & check against the underlying data's schema
    & check against the underlying data's list type or purpose
  
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
  static verifiedMustRead(params) {
    return {
      ...params,
      method: "verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string",
      args: Array.isArray(params.args) ? params.args : [params.args.address, params.args.name, params.args.leaf, params.args.proof, params.args.type, params.args.key]
    };
  }
  /**
   * Constructs a no op call for the addType(pay,string,uint8[])void ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static addType(params) {
    return {
      ...params,
      method: "addType(pay,string,uint8[])void",
      args: Array.isArray(params.args) ? params.args : [params.args.payment, params.args.description, params.args.schemaList]
    };
  }
  /**
   * Constructs a no op call for the rootCosts(string)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static rootCosts(params) {
    return {
      ...params,
      method: "rootCosts(string)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.name]
    };
  }
  /**
   * Constructs a no op call for the dataCosts(string,string,string)uint64 ABI method
   *
   * @param params Parameters for the call
   * @returns An `AppClientMethodCallParams` object for the call
   */
  static dataCosts(params) {
    return {
      ...params,
      method: "dataCosts(string,string,string)uint64",
      args: Array.isArray(params.args) ? params.args : [params.args.name, params.args.key, params.args.value]
    };
  }
};
var MetaMerklesFactory = (_class = class {
  /**
   * The underlying `AppFactory` for when you want to have more flexibility
   */
  
  /**
   * Creates a new instance of `MetaMerklesFactory`
   *
   * @param params The parameters to initialise the app factory with
   */
  constructor(params) {;_class.prototype.__init.call(this);_class.prototype.__init2.call(this);_class.prototype.__init3.call(this);
    this.appFactory = new (0, _appfactory.AppFactory)({
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
    return new MetaMerklesClient(this.appFactory.getAppClientById(params));
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
    return new MetaMerklesClient(await this.appFactory.getAppClientByCreatorAndName(params));
  }
  /**
   * Idempotently deploys the MetaMerkles smart contract.
   *
   * @param params The arguments for the contract calls and any additional parameters for the call
   * @returns The deployment result
   */
  async deploy(params = {}) {
    var _a;
    const result = await this.appFactory.deploy({
      ...params,
      createParams: ((_a = params.createParams) == null ? void 0 : _a.method) ? MetaMerklesParamsFactory.create._resolveByMethod(params.createParams) : params.createParams ? params.createParams : void 0
    });
    return { result: result.result, appClient: new MetaMerklesClient(result.appClient) };
  }
  /**
   * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
   */
  __init() {this.params = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the MetaMerkles smart contract using the create()void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create params
       */
      create: (params = { args: [] }) => {
        return this.appFactory.params.create(MetaMerklesParamsFactory.create.create(params));
      }
    }
  }}
  /**
   * Create transactions for the current app
   */
  __init2() {this.createTransaction = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the MetaMerkles smart contract using the create()void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create transaction
       */
      create: (params = { args: [] }) => {
        return this.appFactory.createTransaction.create(MetaMerklesParamsFactory.create.create(params));
      }
    }
  }}
  /**
   * Send calls to the current app
   */
  __init3() {this.send = {
    /**
     * Gets available create methods
     */
    create: {
      /**
       * Creates a new instance of the MetaMerkles smart contract using an ABI method call using the create()void ABI method.
       *
       * @param params The params for the smart contract call
       * @returns The create result
       */
      create: async (params = { args: [] }) => {
        const result = await this.appFactory.send.create(MetaMerklesParamsFactory.create.create(params));
        return { result: { ...result.result, return: result.result.return }, appClient: new MetaMerklesClient(result.appClient) };
      }
    }
  }}
}, _class);
var MetaMerklesClient = (_class2 = class _MetaMerklesClient {
  /**
   * The underlying `AppClient` for when you want to have more flexibility
   */
  
  constructor(appClientOrParams) {;_class2.prototype.__init4.call(this);_class2.prototype.__init5.call(this);_class2.prototype.__init6.call(this);_class2.prototype.__init7.call(this);
    this.appClient = appClientOrParams instanceof _appclient.AppClient ? appClientOrParams : new (0, _appclient.AppClient)({
      ...appClientOrParams,
      appSpec: APP_SPEC
    });
  }
  /**
   * Checks for decode errors on the given return value and maps the return value to the return type for the given method
   * @returns The typed return value or undefined if there was no value
   */
  decodeReturnValue(method, returnValue) {
    return returnValue !== void 0 ? _apparc56.getArc56ReturnValue.call(void 0, returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : void 0;
  }
  /**
   * Returns a new `MetaMerklesClient` client, resolving the app by creator address and name
   * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
   * @param params The parameters to create the app client
   */
  static async fromCreatorAndName(params) {
    return new _MetaMerklesClient(await _appclient.AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
  }
  /**
   * Returns an `MetaMerklesClient` instance for the current network based on
   * pre-determined network-specific app IDs specified in the ARC-56 app spec.
   *
   * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
   * @param params The parameters to create the app client
   */
  static async fromNetwork(params) {
    return new _MetaMerklesClient(await _appclient.AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
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
  __init4() {this.params = {
    /**
     * Makes a clear_state call to an existing instance of the MetaMerkles smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.params.bare.clearState(params);
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addRoot(pay,string,byte[32],uint64)void` ABI method.
         *
        * Creates two boxes and adds a merkle root
        using a `RootKey` to the root box map and also a list type to the
        metadata attached to the root in the data box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
    addRoot: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.addRoot(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteRoot(string)void` ABI method.
     *
     * Deletes the merkle root from the root box map
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    deleteRoot: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.deleteRoot(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `updateRoot(string,byte[32])void` ABI method.
     *
     * Replaces the merkle root with another
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    updateRoot: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.updateRoot(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addData(pay,string,string,string)void` ABI method.
         *
        * Registers a key & value in the data box map that
        corresponds to a merkle root in the root box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call params
         */
    addData: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.addData(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteData(string,string)void` ABI method.
     *
     * Deletes a metadata key & value pair from the data box map
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    deleteData: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.deleteData(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `verify(address,string,byte[32],byte[32][],uint64)bool` ABI method.
     *
     * verify an inclusion in a double sha256 based merkle tree
     *
     * @param params The params for the smart contract call
     * @returns The call params: a boolean indicating whether the proof is valid
     */
    verify: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.verify(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `read(address,string,string)string` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Fetch a metadata properties
     *
     * @param params The params for the smart contract call
     * @returns The call params: the value set eg. `5` encoded as a bytestring for 5%
     */
    read: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.read(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call params: a string of metadata
         */
    verifiedRead: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.verifiedRead(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call params: a string of metadata
         */
    verifiedMustRead: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.verifiedMustRead(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `addType(pay,string,uint8[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    addType: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.addType(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `rootCosts(string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    rootCosts: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.rootCosts(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `dataCosts(string,string,string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call params
     */
    dataCosts: (params) => {
      return this.appClient.params.call(MetaMerklesParamsFactory.dataCosts(params));
    }
  }}
  /**
   * Create transactions for the current app
   */
  __init5() {this.createTransaction = {
    /**
     * Makes a clear_state call to an existing instance of the MetaMerkles smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.createTransaction.bare.clearState(params);
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addRoot(pay,string,byte[32],uint64)void` ABI method.
         *
        * Creates two boxes and adds a merkle root
        using a `RootKey` to the root box map and also a list type to the
        metadata attached to the root in the data box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
    addRoot: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.addRoot(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteRoot(string)void` ABI method.
     *
     * Deletes the merkle root from the root box map
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    deleteRoot: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.deleteRoot(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `updateRoot(string,byte[32])void` ABI method.
     *
     * Replaces the merkle root with another
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    updateRoot: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.updateRoot(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addData(pay,string,string,string)void` ABI method.
         *
        * Registers a key & value in the data box map that
        corresponds to a merkle root in the root box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction
         */
    addData: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.addData(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteData(string,string)void` ABI method.
     *
     * Deletes a metadata key & value pair from the data box map
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    deleteData: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.deleteData(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `verify(address,string,byte[32],byte[32][],uint64)bool` ABI method.
     *
     * verify an inclusion in a double sha256 based merkle tree
     *
     * @param params The params for the smart contract call
     * @returns The call transaction: a boolean indicating whether the proof is valid
     */
    verify: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.verify(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `read(address,string,string)string` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Fetch a metadata properties
     *
     * @param params The params for the smart contract call
     * @returns The call transaction: the value set eg. `5` encoded as a bytestring for 5%
     */
    read: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.read(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction: a string of metadata
         */
    verifiedRead: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.verifiedRead(params));
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call transaction: a string of metadata
         */
    verifiedMustRead: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.verifiedMustRead(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `addType(pay,string,uint8[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    addType: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.addType(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `rootCosts(string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    rootCosts: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.rootCosts(params));
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `dataCosts(string,string,string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call transaction
     */
    dataCosts: (params) => {
      return this.appClient.createTransaction.call(MetaMerklesParamsFactory.dataCosts(params));
    }
  }}
  /**
   * Send calls to the current app
   */
  __init6() {this.send = {
    /**
     * Makes a clear_state call to an existing instance of the MetaMerkles smart contract.
     *
     * @param params The params for the bare (raw) call
     * @returns The clearState result
     */
    clearState: (params) => {
      return this.appClient.send.bare.clearState(params);
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addRoot(pay,string,byte[32],uint64)void` ABI method.
         *
        * Creates two boxes and adds a merkle root
        using a `RootKey` to the root box map and also a list type to the
        metadata attached to the root in the data box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
    addRoot: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.addRoot(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteRoot(string)void` ABI method.
     *
     * Deletes the merkle root from the root box map
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    deleteRoot: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.deleteRoot(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `updateRoot(string,byte[32])void` ABI method.
     *
     * Replaces the merkle root with another
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    updateRoot: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.updateRoot(params));
      return { ...result, return: result.return };
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `addData(pay,string,string,string)void` ABI method.
         *
        * Registers a key & value in the data box map that
        corresponds to a merkle root in the root box map
    
         *
         * @param params The params for the smart contract call
         * @returns The call result
         */
    addData: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.addData(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `deleteData(string,string)void` ABI method.
     *
     * Deletes a metadata key & value pair from the data box map
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    deleteData: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.deleteData(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `verify(address,string,byte[32],byte[32][],uint64)bool` ABI method.
     *
     * verify an inclusion in a double sha256 based merkle tree
     *
     * @param params The params for the smart contract call
     * @returns The call result: a boolean indicating whether the proof is valid
     */
    verify: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.verify(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `read(address,string,string)string` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * Fetch a metadata properties
     *
     * @param params The params for the smart contract call
     * @returns The call result: the value set eg. `5` encoded as a bytestring for 5%
     */
    read: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.read(params));
      return { ...result, return: result.return };
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call result: a string of metadata
         */
    verifiedRead: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.verifiedRead(params));
      return { ...result, return: result.return };
    },
    /**
         * Makes a call to the MetaMerkles smart contract using the `verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string` ABI method.
         *
        * Read metadata from box storage and verify the data provided is included
        in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
        thats pre-computed off chain.
        
        verify an inclusion in a merkle tree
        & read an associated key value pair
        & check against the underlying data's schema
        & check against the underlying data's list type or purpose
    
         *
         * @param params The params for the smart contract call
         * @returns The call result: a string of metadata
         */
    verifiedMustRead: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.verifiedMustRead(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `addType(pay,string,uint8[])void` ABI method.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    addType: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.addType(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `rootCosts(string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    rootCosts: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.rootCosts(params));
      return { ...result, return: result.return };
    },
    /**
     * Makes a call to the MetaMerkles smart contract using the `dataCosts(string,string,string)uint64` ABI method.
     * 
     * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
     *
     * @param params The params for the smart contract call
     * @returns The call result
     */
    dataCosts: async (params) => {
      const result = await this.appClient.send.call(MetaMerklesParamsFactory.dataCosts(params));
      return { ...result, return: result.return };
    }
  }}
  /**
   * Clone this app client with different params
   *
   * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
   * @returns A new app client with the altered params
   */
  clone(params) {
    return new _MetaMerklesClient(this.appClient.clone(params));
  }
  /**
   * Makes a readonly (simulated) call to the MetaMerkles smart contract using the `read(address,string,string)string` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * Fetch a metadata properties
   *
   * @param params The params for the smart contract call
   * @returns The call result: the value set eg. `5` encoded as a bytestring for 5%
   */
  async read(params) {
    const result = await this.appClient.send.call(MetaMerklesParamsFactory.read(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the MetaMerkles smart contract using the `rootCosts(string)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async rootCosts(params) {
    const result = await this.appClient.send.call(MetaMerklesParamsFactory.rootCosts(params));
    return result.return;
  }
  /**
   * Makes a readonly (simulated) call to the MetaMerkles smart contract using the `dataCosts(string,string,string)uint64` ABI method.
   * 
   * This method is a readonly method; calling it with onComplete of NoOp will result in a simulated transaction rather than a real transaction.
   *
   * @param params The params for the smart contract call
   * @returns The call result
   */
  async dataCosts(params) {
    const result = await this.appClient.send.call(MetaMerklesParamsFactory.dataCosts(params));
    return result.return;
  }
  /**
   * Methods to access state for the current MetaMerkles app
   */
  __init7() {this.state = {
    /**
     * Methods to access global state for the current MetaMerkles app
     */
    global: {
      /**
       * Get all current keyed values from global state
       */
      getAll: async () => {
        const result = await this.appClient.state.global.getAll();
        return {
          typesId: result.typesID
        };
      },
      /**
       * Get the current value of the typesID key in global state
       */
      typesId: async () => {
        return await this.appClient.state.global.getValue("typesID");
      }
    },
    /**
     * Methods to access box state for the current MetaMerkles app
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
       * Get values from the types map in box state
       */
      types: {
        /**
         * Get all current values of the types map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("types");
        },
        /**
         * Get a current value of the types map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("types", key);
        }
      },
      /**
       * Get values from the roots map in box state
       */
      roots: {
        /**
         * Get all current values of the roots map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("roots");
        },
        /**
         * Get a current value of the roots map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("roots", key);
        }
      },
      /**
       * Get values from the data map in box state
       */
      data: {
        /**
         * Get all current values of the data map in box state
         */
        getMap: async () => {
          return await this.appClient.state.box.getMap("data");
        },
        /**
         * Get a current value of the data map by key from box state
         */
        value: async (key) => {
          return await this.appClient.state.box.getMapValue("data", key);
        }
      }
    }
  }}
  newGroup() {
    const client = this;
    const composer = this.algorand.newGroup();
    let promiseChain = Promise.resolve();
    const resultMappers = [];
    return {
      /**
       * Add a addRoot(pay,string,byte[32],uint64)void method call against the MetaMerkles contract
       */
      addRoot(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addRoot(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a deleteRoot(string)void method call against the MetaMerkles contract
       */
      deleteRoot(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteRoot(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a updateRoot(string,byte[32])void method call against the MetaMerkles contract
       */
      updateRoot(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.updateRoot(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a addData(pay,string,string,string)void method call against the MetaMerkles contract
       */
      addData(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addData(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a deleteData(string,string)void method call against the MetaMerkles contract
       */
      deleteData(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.deleteData(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a verify(address,string,byte[32],byte[32][],uint64)bool method call against the MetaMerkles contract
       */
      verify(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.verify(params)));
        resultMappers.push((v) => client.decodeReturnValue("verify(address,string,byte[32],byte[32][],uint64)bool", v));
        return this;
      },
      /**
       * Add a read(address,string,string)string method call against the MetaMerkles contract
       */
      read(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.read(params)));
        resultMappers.push((v) => client.decodeReturnValue("read(address,string,string)string", v));
        return this;
      },
      /**
       * Add a verifiedRead(address,string,byte[32],byte[32][],uint64,string)string method call against the MetaMerkles contract
       */
      verifiedRead(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.verifiedRead(params)));
        resultMappers.push((v) => client.decodeReturnValue("verifiedRead(address,string,byte[32],byte[32][],uint64,string)string", v));
        return this;
      },
      /**
       * Add a verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string method call against the MetaMerkles contract
       */
      verifiedMustRead(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.verifiedMustRead(params)));
        resultMappers.push((v) => client.decodeReturnValue("verifiedMustRead(address,string,byte[32],byte[32][],uint64,string)string", v));
        return this;
      },
      /**
       * Add a addType(pay,string,uint8[])void method call against the MetaMerkles contract
       */
      addType(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.addType(params)));
        resultMappers.push(void 0);
        return this;
      },
      /**
       * Add a rootCosts(string)uint64 method call against the MetaMerkles contract
       */
      rootCosts(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.rootCosts(params)));
        resultMappers.push((v) => client.decodeReturnValue("rootCosts(string)uint64", v));
        return this;
      },
      /**
       * Add a dataCosts(string,string,string)uint64 method call against the MetaMerkles contract
       */
      dataCosts(params) {
        promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.dataCosts(params)));
        resultMappers.push((v) => client.decodeReturnValue("dataCosts(string,string,string)uint64", v));
        return this;
      },
      /**
       * Add a clear state call to the MetaMerkles contract
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
}, _class2);

// src/meta-merkles/types.ts
var SchemaPart = /* @__PURE__ */ ((SchemaPart2) => {
  SchemaPart2[SchemaPart2["Uint8"] = 10] = "Uint8";
  SchemaPart2[SchemaPart2["Uint16"] = 11] = "Uint16";
  SchemaPart2[SchemaPart2["Uint32"] = 12] = "Uint32";
  SchemaPart2[SchemaPart2["Uint64"] = 13] = "Uint64";
  SchemaPart2[SchemaPart2["Uint128"] = 14] = "Uint128";
  SchemaPart2[SchemaPart2["Uint256"] = 15] = "Uint256";
  SchemaPart2[SchemaPart2["Uint512"] = 16] = "Uint512";
  SchemaPart2[SchemaPart2["Bytes4"] = 20] = "Bytes4";
  SchemaPart2[SchemaPart2["Bytes8"] = 21] = "Bytes8";
  SchemaPart2[SchemaPart2["Bytes16"] = 22] = "Bytes16";
  SchemaPart2[SchemaPart2["Bytes32"] = 23] = "Bytes32";
  SchemaPart2[SchemaPart2["Bytes64"] = 24] = "Bytes64";
  SchemaPart2[SchemaPart2["Bytes128"] = 25] = "Bytes128";
  SchemaPart2[SchemaPart2["Bytes256"] = 26] = "Bytes256";
  SchemaPart2[SchemaPart2["Bytes512"] = 27] = "Bytes512";
  SchemaPart2[SchemaPart2["String"] = 30] = "String";
  SchemaPart2[SchemaPart2["Address"] = 40] = "Address";
  return SchemaPart2;
})(SchemaPart || {});
var MerkleTreeType = /* @__PURE__ */ ((MerkleTreeType2) => {
  MerkleTreeType2[MerkleTreeType2["Unspecified"] = 0] = "Unspecified";
  MerkleTreeType2[MerkleTreeType2["Collection"] = 1] = "Collection";
  MerkleTreeType2[MerkleTreeType2["Trait"] = 2] = "Trait";
  MerkleTreeType2[MerkleTreeType2["Trade"] = 3] = "Trade";
  MerkleTreeType2[MerkleTreeType2["Whitelist"] = 4] = "Whitelist";
  MerkleTreeType2[MerkleTreeType2["Addresses"] = 5] = "Addresses";
  return MerkleTreeType2;
})(MerkleTreeType || {});

// src/meta-merkles/tree.ts
var _sha256 = require('@noble/hashes/sha256');
function bytesToHex(bytes) {
  return `0x${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
function hexToBytes(hex) {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
function compareBytes(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return a.length - b.length;
}
function hashPair(a, b) {
  if (compareBytes(a, b) > 0) {
    return _sha256.sha256.call(void 0, new Uint8Array([...b, ...a]));
  }
  return _sha256.sha256.call(void 0, new Uint8Array([...a, ...b]));
}
function encodeValue(value, schemaPart) {
  switch (schemaPart) {
    case 10 /* Uint8 */: {
      const buf = new Uint8Array(1);
      buf[0] = Number(value) & 255;
      return buf;
    }
    case 11 /* Uint16 */: {
      const buf = new Uint8Array(2);
      const view = new DataView(buf.buffer);
      view.setUint16(0, Number(value), false);
      return buf;
    }
    case 12 /* Uint32 */: {
      const buf = new Uint8Array(4);
      const view = new DataView(buf.buffer);
      view.setUint32(0, Number(value), false);
      return buf;
    }
    case 13 /* Uint64 */: {
      const buf = new Uint8Array(8);
      const view = new DataView(buf.buffer);
      view.setBigUint64(0, BigInt(value), false);
      return buf;
    }
    case 14 /* Uint128 */: {
      const buf = new Uint8Array(16);
      let n = BigInt(value);
      for (let i = 15; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case 15 /* Uint256 */: {
      const buf = new Uint8Array(32);
      let n = BigInt(value);
      for (let i = 31; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case 16 /* Uint512 */: {
      const buf = new Uint8Array(64);
      let n = BigInt(value);
      for (let i = 63; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case 20 /* Bytes4 */:
    case 21 /* Bytes8 */:
    case 22 /* Bytes16 */:
    case 23 /* Bytes32 */:
    case 24 /* Bytes64 */:
    case 25 /* Bytes128 */:
    case 26 /* Bytes256 */:
    case 27 /* Bytes512 */: {
      const sizes = {
        [20 /* Bytes4 */]: 4,
        [21 /* Bytes8 */]: 8,
        [22 /* Bytes16 */]: 16,
        [23 /* Bytes32 */]: 32,
        [24 /* Bytes64 */]: 64,
        [25 /* Bytes128 */]: 128,
        [26 /* Bytes256 */]: 256,
        [27 /* Bytes512 */]: 512
      };
      const size = sizes[schemaPart];
      if (value instanceof Uint8Array) {
        if (value.length !== size) {
          throw new Error(`Expected ${size} bytes, got ${value.length}`);
        }
        return value;
      }
      const bytes = hexToBytes(value);
      if (bytes.length !== size) {
        throw new Error(`Expected ${size} bytes, got ${bytes.length}`);
      }
      return bytes;
    }
    case 30 /* String */: {
      return new TextEncoder().encode(value);
    }
    case 40 /* Address */: {
      const addr = value;
      if (addr.length === 58) {
        throw new Error("Please provide address as Uint8Array (32 bytes) or use decodeAlgorandAddress helper");
      }
      if (value instanceof Uint8Array && value.length === 32) {
        return value;
      }
      throw new Error("Address must be 32 bytes");
    }
    default:
      throw new Error(`Unknown schema part: ${schemaPart}`);
  }
}
function encodeLeaf(values, schema) {
  if (values.length !== schema.length) {
    throw new Error(`Values length (${values.length}) must match schema length (${schema.length})`);
  }
  const encoded = values.map((v, i) => encodeValue(v, schema[i]));
  const totalLength = encoded.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of encoded) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function hashLeaf(encodedLeaf) {
  return _sha256.sha256.call(void 0, _sha256.sha256.call(void 0, encodedLeaf));
}
var MerkleTree = class _MerkleTree {
  
  
  
  
  // value index -> tree index
  constructor(values, schema) {
    this.values = values;
    this.schema = schema;
    this.leafIndices = /* @__PURE__ */ new Map();
    this.tree = this.buildTree();
  }
  /**
   * Creates a new merkle tree from an array of values.
   * 
   * For single-value leaves (e.g., uint64[]), pass each value as an array: [[1n], [2n], [3n]]
   * Or use the convenience form with a single-element schema.
   * 
   * @param values - Array of leaf values (each value is an array matching the schema)
   * @param schema - The schema defining how to encode each leaf
   */
  static of(values, schema) {
    if (values.length === 0) {
      throw new Error("Cannot create merkle tree with no values");
    }
    return new _MerkleTree(values, schema);
  }
  /**
   * Creates a merkle tree for simple single-type values.
   * 
   * @example
   * ```ts
   * // Tree of addresses
   * const tree = MerkleTree.ofSimple(addresses, SchemaPart.Address);
   * 
   * // Tree of uint64 values
   * const tree = MerkleTree.ofSimple([1n, 2n, 3n], SchemaPart.Uint64);
   * ```
   */
  static ofSimple(values, schemaPart) {
    return _MerkleTree.of(values.map((v) => [v]), [schemaPart]);
  }
  /**
   * Loads a merkle tree from a dump (useful for persistence).
   */
  static load(dump, schema) {
    const values = dump.values.map((v) => v.value);
    return _MerkleTree.of(values, schema);
  }
  buildTree() {
    const leaves = this.values.map((v) => hashLeaf(encodeLeaf(v, this.schema)));
    const n = leaves.length;
    const treeSize = 2 * n - 1;
    const tree = new Array(treeSize);
    for (let i = 0; i < n; i++) {
      tree[treeSize - n + i] = leaves[i];
      this.leafIndices.set(i, treeSize - n + i);
    }
    for (let i = treeSize - n - 1; i >= 0; i--) {
      const left = tree[2 * i + 1];
      const right = tree[2 * i + 2];
      tree[i] = right ? hashPair(left, right) : left;
    }
    return tree;
  }
  /**
   * The merkle root as a 32-byte Uint8Array.
   */
  get root() {
    return this.tree[0];
  }
  /**
   * The merkle root as a hex string (0x prefixed).
   */
  get rootHex() {
    return bytesToHex(this.root);
  }
  /**
   * Number of leaves in the tree.
   */
  get length() {
    return this.values.length;
  }
  /**
   * Gets the proof for a leaf at the given index.
   * @param index - The index of the leaf value
   * @returns Array of 32-byte proof elements
   */
  getProof(index) {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.values.length})`);
    }
    const proof = [];
    let treeIndex = this.leafIndices.get(index);
    while (treeIndex > 0) {
      const siblingIndex = treeIndex % 2 === 0 ? treeIndex - 1 : treeIndex + 1;
      if (siblingIndex < this.tree.length && this.tree[siblingIndex]) {
        proof.push(this.tree[siblingIndex]);
      }
      treeIndex = Math.floor((treeIndex - 1) / 2);
    }
    return proof;
  }
  /**
   * Gets the proof for a leaf at the given index as hex strings.
   */
  getProofHex(index) {
    return this.getProof(index).map(bytesToHex);
  }
  /**
   * Gets the leaf hash at the given index.
   */
  getLeafHash(index) {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.values.length})`);
    }
    const treeIndex = this.leafIndices.get(index);
    return this.tree[treeIndex];
  }
  /**
   * Gets the leaf hash at the given index as a hex string.
   */
  getLeafHashHex(index) {
    return bytesToHex(this.getLeafHash(index));
  }
  /**
   * Verifies a proof locally (without calling the contract).
   * @param index - The index of the leaf value to verify
   * @param proof - The proof array (optional, will be computed if not provided)
   * @returns true if the proof is valid
   */
  verify(index, proof) {
    const actualProof = _nullishCoalesce(proof, () => ( this.getProof(index)));
    let hash = this.getLeafHash(index);
    for (const sibling of actualProof) {
      hash = hashPair(hash, sibling);
    }
    return this.compareBytes(hash, this.root);
  }
  compareBytes(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  /**
   * Iterates over all values with their indices.
   */
  *entries() {
    for (let i = 0; i < this.values.length; i++) {
      yield [i, this.values[i]];
    }
  }
  /**
   * Gets the value at the given index.
   */
  getValue(index) {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.values.length})`);
    }
    return this.values[index];
  }
  /**
   * Finds the index of a value in the tree.
   * @param predicate - Function to test each value
   * @returns The index of the first matching value, or -1 if not found
   */
  findIndex(predicate) {
    for (let i = 0; i < this.values.length; i++) {
      if (predicate(this.values[i], i)) {
        return i;
      }
    }
    return -1;
  }
  /**
   * Gets proof for a value matching the predicate.
   */
  getProofFor(predicate) {
    const index = this.findIndex(predicate);
    if (index === -1) return null;
    return { index, proof: this.getProof(index) };
  }
  /**
   * Renders the tree as a string for debugging.
   */
  render() {
    const lines = ["Merkle Tree:"];
    lines.push(`  Root: ${this.rootHex}`);
    lines.push(`  Leaves: ${this.values.length}`);
    lines.push("  Values:");
    for (let i = 0; i < this.values.length; i++) {
      lines.push(`    [${i}] ${JSON.stringify(this.values[i])} -> ${this.getLeafHashHex(i)}`);
    }
    return lines.join("\n");
  }
  /**
   * Dumps the tree to a JSON-serializable format.
   */
  dump() {
    return {
      format: "standard-v1",
      tree: this.tree.map(bytesToHex),
      values: this.values.map((value, i) => ({
        value,
        treeIndex: this.leafIndices.get(i)
      })),
      leafEncoding: this.schema.map((s) => SchemaPart[s]).join(",")
    };
  }
};
function createAddressTree(addresses) {
  return MerkleTree.ofSimple(addresses, 40 /* Address */);
}
function createUint64Tree(values) {
  return MerkleTree.ofSimple(values, 13 /* Uint64 */);
}
function createAssetTree(assetIds) {
  return createUint64Tree(assetIds);
}
function verifyProof(root, leaf, proof) {
  let hash = leaf;
  for (const sibling of proof) {
    hash = hashPair(hash, sibling);
  }
  if (root.length !== hash.length) return false;
  for (let i = 0; i < root.length; i++) {
    if (root[i] !== hash[i]) return false;
  }
  return true;
}

// src/meta-merkles/index.ts
var ADD_TYPE_COST = 100000000n;
var MetaMerklesSDK = class extends _chunkW5ILLEG6js.BaseSDK {
  constructor(params) {
    super({ factory: MetaMerklesFactory, ...params }, _chunkHY3H6JQIjs.ENV_VAR_NAMES.META_MERKLES_APP_ID);
  }
  // ========== Read Methods ==========
  /**
   * Gets the current global state of the MetaMerkles contract.
   */
  async getState() {
    const state = await this.client.state.global.getAll();
    return {
      typesId: _nullishCoalesce(state.typesId, () => ( 0n))
    };
  }
  /**
   * Gets a merkle root by address and name.
   * @returns The 32-byte merkle root or undefined if not found
   */
  async getRoot({ address, name }) {
    const rootKey = { address, name };
    try {
      return await this.client.state.box.roots.value(rootKey);
    } catch (error) {
      if (error instanceof Error && error.message.includes("box not found")) {
        return void 0;
      }
      throw error;
    }
  }
  /**
   * Checks if a merkle root exists.
   */
  async hasRoot({ address, name }) {
    const root = await this.getRoot({ address, name });
    return root !== void 0;
  }
  /**
   * Gets all merkle roots as a map.
   */
  async getRoots() {
    return await this.client.state.box.roots.getMap();
  }
  /**
   * Gets metadata associated with a merkle root.
   * @returns The metadata value or undefined if not found
   */
  async getData({ address, name, key }) {
    const addressBytes = Uint8Array.from(Buffer.from(address.slice(0, 32), "base64"));
    const truncatedAddress = addressBytes.slice(0, 16);
    try {
      return await this.client.state.box.data.value({
        address: truncatedAddress,
        name,
        key
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("box not found")) {
        return void 0;
      }
      throw error;
    }
  }
  /**
   * Gets a tree type by ID.
   * @returns The type value (schema and description) or undefined if not found
   */
  async getType({ id }) {
    return await this.client.state.box.types.value(id);
  }
  /**
   * Gets all tree types as a map.
   */
  async getTypes() {
    return await this.client.state.box.types.getMap();
  }
  /**
   * Gets the cost in microAlgo for creating a merkle root with the given name.
   */
  async rootCosts({ name }) {
    return await this.client.rootCosts({ args: { name } });
  }
  /**
   * Gets the cost in microAlgo for adding data with the given parameters.
   */
  async dataCosts({ name, key, value }) {
    return await this.client.dataCosts({ args: { name, key, value } });
  }
  // ========== Verify Methods ==========
  /**
   * Verifies a leaf is included in a merkle tree.
   * @returns true if the proof is valid
   */
  async verify({ address, name, leaf, proof, type }) {
    const formattedProof = proof.map((p) => {
      if (p.length !== 32) {
        throw new Error("Each proof element must be exactly 32 bytes");
      }
      return p;
    });
    const { return: result } = await this.client.send.verify({
      args: {
        address,
        name,
        leaf,
        proof: formattedProof,
        type
      }
    });
    return _nullishCoalesce(result, () => ( false));
  }
  /**
   * Reads metadata from a merkle root.
   */
  async read({ address, name, key }) {
    return await this.client.read({
      args: { address, name, key }
    });
  }
  /**
   * Verifies inclusion and reads metadata if verified.
   * @returns The metadata value, or empty string if verification fails
   */
  async verifiedRead({ address, name, leaf, proof, type, key }) {
    const formattedProof = proof.map((p) => {
      if (p.length !== 32) {
        throw new Error("Each proof element must be exactly 32 bytes");
      }
      return p;
    });
    const { return: result } = await this.client.send.verifiedRead({
      args: {
        address,
        name,
        leaf,
        proof: formattedProof,
        type,
        key
      }
    });
    return _nullishCoalesce(result, () => ( ""));
  }
  /**
   * Verifies inclusion and reads metadata. Throws if verification fails.
   * @returns The metadata value
   */
  async verifiedMustRead({ address, name, leaf, proof, type, key }) {
    const formattedProof = proof.map((p) => {
      if (p.length !== 32) {
        throw new Error("Each proof element must be exactly 32 bytes");
      }
      return p;
    });
    const { return: result } = await this.client.send.verifiedMustRead({
      args: {
        address,
        name,
        leaf,
        proof: formattedProof,
        type,
        key
      }
    });
    if (result === void 0) {
      throw new Error("Failed to read verified data");
    }
    return result;
  }
  // ========== Write Methods ==========
  /**
   * Adds a new merkle root.
   * @param name - The name alias of the root (max 31 bytes)
   * @param root - The 32-byte merkle tree root
   * @param type - The index of the tree type from box storage
   */
  async addRoot({ sender, signer, name, root, type }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    if (root.length !== 32) {
      throw new Error("Root must be exactly 32 bytes");
    }
    const cost = await this.rootCosts({ name });
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: _algokitutils.microAlgo.call(void 0, cost),
      receiver: this.client.appAddress
    });
    await this.client.send.addRoot({
      ...sendParams,
      args: {
        payment,
        name,
        root,
        type
      }
    });
  }
  /**
   * Updates an existing merkle root.
   * @param name - The name of the merkle group data
   * @param newRoot - The new 32-byte merkle tree root
   */
  async updateRoot({ sender, signer, name, newRoot }) {
    const sendParams = this.getSendParams({ sender, signer });
    if (newRoot.length !== 32) {
      throw new Error("New root must be exactly 32 bytes");
    }
    await this.client.send.updateRoot({
      ...sendParams,
      args: {
        name,
        newRoot
      }
    });
  }
  /**
   * Deletes a merkle root and returns the MBR to the sender.
   * Only the original creator can delete the root.
   */
  async deleteRoot({ sender, signer, name }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.deleteRoot({
      ...sendParams,
      // Extra fee for inner payment to return MBR
      extraFee: _algokitutils.microAlgo.call(void 0, 1e3),
      args: { name }
    });
  }
  /**
   * Adds metadata to an existing merkle root.
   * @param name - The name of the merkle tree root
   * @param key - The metadata key (max 15 bytes, cannot start with "l.")
   * @param value - The metadata value (max 1024 bytes)
   */
  async addData({ sender, signer, name, key, value }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const cost = await this.dataCosts({ name, key, value });
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: _algokitutils.microAlgo.call(void 0, cost),
      receiver: this.client.appAddress
    });
    await this.client.send.addData({
      ...sendParams,
      args: {
        payment,
        name,
        key,
        value
      }
    });
  }
  /**
   * Deletes metadata from a merkle root and returns the MBR to the sender.
   * Only the original creator can delete data.
   */
  async deleteData({ sender, signer, name, key }) {
    const sendParams = this.getSendParams({ sender, signer });
    await this.client.send.deleteData({
      ...sendParams,
      // Extra fee for inner payment to return MBR
      extraFee: _algokitutils.microAlgo.call(void 0, 1e3),
      args: { name, key }
    });
  }
  /**
   * Adds a new tree type definition.
   * Requires a 100 ALGO payment.
   * @param description - Description of the tree type (max 800 bytes)
   * @param schemaList - The schema parts defining the leaf structure
   */
  async addType({ sender, signer, description, schemaList }) {
    const sendParams = this.getRequiredSendParams({ sender, signer });
    const payment = await this.client.algorand.createTransaction.payment({
      ...sendParams,
      amount: _algokitutils.microAlgo.call(void 0, ADD_TYPE_COST),
      receiver: this.client.appAddress
    });
    const schemaListNumbers = schemaList.map((part) => part);
    await this.client.send.addType({
      ...sendParams,
      args: {
        payment,
        description,
        schemaList: schemaListNumbers
      }
    });
  }
  // ========== High-Level Merkle Tree Methods ==========
  /**
   * Adds a merkle root from a MerkleTree instance.
   * This is a convenience method that extracts the root from the tree.
   * 
   * @example
   * ```ts
   * const tree = MerkleTree.ofSimple([1n, 2n, 3n], SchemaPart.Uint64);
   * await sdk.addRootFromTree({ name: 'my-tree', tree, type: 1n });
   * ```
   */
  async addRootFromTree({
    sender,
    signer,
    name,
    tree,
    type
  }) {
    return this.addRoot({
      sender,
      signer,
      name,
      root: tree.root,
      type
    });
  }
  /**
   * Verifies a leaf from a MerkleTree instance.
   * This is a convenience method that extracts the leaf hash and proof from the tree.
   * 
   * @example
   * ```ts
   * const tree = MerkleTree.ofSimple([1n, 2n, 3n], SchemaPart.Uint64);
   * const isValid = await sdk.verifyFromTree({
   *   address: creatorAddress,
   *   name: 'my-tree',
   *   tree,
   *   index: 0, // verify the first leaf
   *   type: 1n,
   * });
   * ```
   */
  async verifyFromTree({
    address,
    name,
    tree,
    index,
    type
  }) {
    return this.verify({
      address,
      name,
      leaf: tree.getLeafHash(index),
      proof: tree.getProof(index),
      type
    });
  }
  /**
   * Verifies and reads metadata using a MerkleTree instance.
   * 
   * @example
   * ```ts
   * const tree = MerkleTree.ofSimple([1n, 2n, 3n], SchemaPart.Uint64);
   * const royalty = await sdk.verifiedReadFromTree({
   *   address: creatorAddress,
   *   name: 'my-tree',
   *   tree,
   *   index: 0,
   *   type: 1n,
   *   key: 'royalty',
   * });
   * ```
   */
  async verifiedReadFromTree({
    address,
    name,
    tree,
    index,
    type,
    key
  }) {
    return this.verifiedRead({
      address,
      name,
      leaf: tree.getLeafHash(index),
      proof: tree.getProof(index),
      type,
      key
    });
  }
  /**
   * Verifies inclusion and reads metadata using a MerkleTree instance.
   * Throws if verification fails.
   */
  async verifiedMustReadFromTree({
    address,
    name,
    tree,
    index,
    type,
    key
  }) {
    return this.verifiedMustRead({
      address,
      name,
      leaf: tree.getLeafHash(index),
      proof: tree.getProof(index),
      type,
      key
    });
  }
};















exports.SchemaPart = SchemaPart; exports.MerkleTreeType = MerkleTreeType; exports.bytesToHex = bytesToHex; exports.hexToBytes = hexToBytes; exports.encodeValue = encodeValue; exports.encodeLeaf = encodeLeaf; exports.hashLeaf = hashLeaf; exports.MerkleTree = MerkleTree; exports.createAddressTree = createAddressTree; exports.createUint64Tree = createUint64Tree; exports.createAssetTree = createAssetTree; exports.verifyProof = verifyProof; exports.MetaMerklesSDK = MetaMerklesSDK;
//# sourceMappingURL=chunk-N6BMPYRX.js.map