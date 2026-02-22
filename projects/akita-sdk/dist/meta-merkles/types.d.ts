import { MaybeSigner } from "../types";
import { MetaMerklesArgs } from '../generated/MetaMerklesClient';
type ContractArgs = MetaMerklesArgs["obj"];
/** Schema part type enum for building leaf schemas */
export declare enum SchemaPart {
    Uint8 = 10,
    Uint16 = 11,
    Uint32 = 12,
    Uint64 = 13,
    Uint128 = 14,
    Uint256 = 15,
    Uint512 = 16,
    Bytes4 = 20,
    Bytes8 = 21,
    Bytes16 = 22,
    Bytes32 = 23,
    Bytes64 = 24,
    Bytes128 = 25,
    Bytes256 = 26,
    Bytes512 = 27,
    String = 30,
    Address = 40
}
/** Merkle tree type constants */
export declare enum MerkleTreeType {
    Unspecified = 0,
    Collection = 1,
    Trait = 2,
    Trade = 3,
    Whitelist = 4,
    Addresses = 5
}
export type MetaMerklesGlobalState = {
    /** The current types ID cursor */
    typesId: bigint;
};
export type GetRootParams = {
    /** The address of the root creator */
    address: string;
    /** The name of the merkle tree root */
    name: string;
};
export type GetDataParams = {
    /** The address of the root creator */
    address: string;
    /** The name of the merkle tree root */
    name: string;
    /** The metadata key */
    key: string;
};
export type GetTypeParams = {
    /** The type ID */
    id: bigint | number;
};
export type RootCostsParams = Pick<ContractArgs['rootCosts(string)uint64'], 'name'>;
export type DataCostsParams = {
    /** The name of the merkle tree root */
    name: string;
    /** The metadata key */
    key: string;
    /** The metadata value */
    value: string;
};
export type VerifyParams = {
    /** The address of the merkle tree root creator */
    address: string;
    /** The name alias of the root */
    name: string;
    /** The hashed leaf to verify (32 bytes) */
    leaf: Uint8Array;
    /** The merkle proof - array of 32-byte hashes */
    proof: Uint8Array[];
    /** The type check for the list's purpose (0 if caller doesn't care) */
    type: bigint | number;
};
export type ReadParams = {
    /** The address of the merkle tree root creator */
    address: string;
    /** The name of the merkle tree root */
    name: string;
    /** The metadata key */
    key: string;
};
export type VerifiedReadParams = VerifyParams & {
    /** The metadata key to read */
    key: string;
};
export type AddRootParams = MaybeSigner & {
    /** The name alias of the root being added (max 31 bytes) */
    name: string;
    /** The merkle tree root (32 bytes) */
    root: Uint8Array;
    /** The index of the tree type from box storage */
    type: bigint | number;
};
export type UpdateRootParams = MaybeSigner & {
    /** The name of the merkle group data */
    name: string;
    /** The new 32 byte merkle tree root */
    newRoot: Uint8Array;
};
export type DeleteRootParams = MaybeSigner & {
    /** The name of the merkle tree root */
    name: string;
};
export type AddDataParams = MaybeSigner & {
    /** The name of the merkle tree root */
    name: string;
    /** The metadata key (max 15 bytes) */
    key: string;
    /** The metadata value (max 1024 bytes) */
    value: string;
};
export type DeleteDataParams = MaybeSigner & {
    /** The name of the merkle tree root */
    name: string;
    /** The metadata key to delete */
    key: string;
};
export type AddTypeParams = MaybeSigner & {
    /** Description of the tree type (max 800 bytes) */
    description: string;
    /** The schema list defining the leaf structure */
    schemaList: SchemaPart[];
};
export {};
