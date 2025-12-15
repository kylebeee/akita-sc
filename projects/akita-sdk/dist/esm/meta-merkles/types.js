// ========== Schema Part Constants ==========
/** Schema part type enum for building leaf schemas */
export var SchemaPart;
(function (SchemaPart) {
    SchemaPart[SchemaPart["Uint8"] = 10] = "Uint8";
    SchemaPart[SchemaPart["Uint16"] = 11] = "Uint16";
    SchemaPart[SchemaPart["Uint32"] = 12] = "Uint32";
    SchemaPart[SchemaPart["Uint64"] = 13] = "Uint64";
    SchemaPart[SchemaPart["Uint128"] = 14] = "Uint128";
    SchemaPart[SchemaPart["Uint256"] = 15] = "Uint256";
    SchemaPart[SchemaPart["Uint512"] = 16] = "Uint512";
    SchemaPart[SchemaPart["Bytes4"] = 20] = "Bytes4";
    SchemaPart[SchemaPart["Bytes8"] = 21] = "Bytes8";
    SchemaPart[SchemaPart["Bytes16"] = 22] = "Bytes16";
    SchemaPart[SchemaPart["Bytes32"] = 23] = "Bytes32";
    SchemaPart[SchemaPart["Bytes64"] = 24] = "Bytes64";
    SchemaPart[SchemaPart["Bytes128"] = 25] = "Bytes128";
    SchemaPart[SchemaPart["Bytes256"] = 26] = "Bytes256";
    SchemaPart[SchemaPart["Bytes512"] = 27] = "Bytes512";
    SchemaPart[SchemaPart["String"] = 30] = "String";
    SchemaPart[SchemaPart["Address"] = 40] = "Address";
})(SchemaPart || (SchemaPart = {}));
/** Merkle tree type constants */
export var MerkleTreeType;
(function (MerkleTreeType) {
    MerkleTreeType[MerkleTreeType["Unspecified"] = 0] = "Unspecified";
    MerkleTreeType[MerkleTreeType["Collection"] = 1] = "Collection";
    MerkleTreeType[MerkleTreeType["Trait"] = 2] = "Trait";
    MerkleTreeType[MerkleTreeType["Trade"] = 3] = "Trade";
    MerkleTreeType[MerkleTreeType["Whitelist"] = 4] = "Whitelist";
    MerkleTreeType[MerkleTreeType["Addresses"] = 5] = "Addresses";
})(MerkleTreeType || (MerkleTreeType = {}));
//# sourceMappingURL=types.js.map