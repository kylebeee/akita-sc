import { SchemaPart } from './types';
/**
 * A merkle tree implementation compatible with the MetaMerkles contract.
 * Uses SHA256 for hashing (same as the on-chain contract).
 */
export type HexString = `0x${string}`;
export interface MerkleTreeDump<T> {
    format: 'standard-v1';
    tree: string[];
    values: {
        value: T;
        treeIndex: number;
    }[];
    leafEncoding: string;
}
/**
 * Converts a Uint8Array to a hex string prefixed with 0x
 */
export declare function bytesToHex(bytes: Uint8Array): HexString;
/**
 * Converts a hex string (with or without 0x prefix) to Uint8Array
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Encodes a value as bytes according to a schema part type.
 */
export declare function encodeValue(value: unknown, schemaPart: SchemaPart): Uint8Array;
/**
 * Encodes a leaf value using the given schema.
 * For single values, pass a single-element array schema.
 * For tuples, pass values and schema arrays of matching length.
 */
export declare function encodeLeaf(values: unknown[], schema: SchemaPart[]): Uint8Array;
/**
 * Hashes a leaf value using SHA256.
 * The leaf is double-hashed: sha256(sha256(encoded_value))
 * This is the standard "leaf prefix" technique to prevent second preimage attacks.
 */
export declare function hashLeaf(encodedLeaf: Uint8Array): Uint8Array;
/**
 * A standard merkle tree implementation for use with MetaMerkles contract.
 *
 * @example
 * ```ts
 * // Create a tree of uint64 values
 * const tree = MerkleTree.of([1n, 2n, 3n], [SchemaPart.Uint64]);
 *
 * // Get the root to store on-chain
 * const root = tree.root;
 *
 * // Get proof for a specific value
 * const proof = tree.getProof(0); // proof for value at index 0
 *
 * // Verify a proof locally
 * const isValid = tree.verify(0, proof);
 * ```
 */
export declare class MerkleTree<T extends unknown[]> {
    private readonly tree;
    private readonly values;
    private readonly schema;
    private readonly leafIndices;
    private constructor();
    /**
     * Creates a new merkle tree from an array of values.
     *
     * For single-value leaves (e.g., uint64[]), pass each value as an array: [[1n], [2n], [3n]]
     * Or use the convenience form with a single-element schema.
     *
     * @param values - Array of leaf values (each value is an array matching the schema)
     * @param schema - The schema defining how to encode each leaf
     */
    static of<T extends unknown[]>(values: T[], schema: SchemaPart[]): MerkleTree<T>;
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
    static ofSimple<T>(values: T[], schemaPart: SchemaPart): MerkleTree<[T]>;
    /**
     * Loads a merkle tree from a dump (useful for persistence).
     */
    static load<T extends unknown[]>(dump: MerkleTreeDump<T>, schema: SchemaPart[]): MerkleTree<T>;
    private buildTree;
    /**
     * The merkle root as a 32-byte Uint8Array.
     */
    get root(): Uint8Array;
    /**
     * The merkle root as a hex string (0x prefixed).
     */
    get rootHex(): HexString;
    /**
     * Number of leaves in the tree.
     */
    get length(): number;
    /**
     * Gets the proof for a leaf at the given index.
     * @param index - The index of the leaf value
     * @returns Array of 32-byte proof elements
     */
    getProof(index: number): Uint8Array[];
    /**
     * Gets the proof for a leaf at the given index as hex strings.
     */
    getProofHex(index: number): HexString[];
    /**
     * Gets the leaf hash at the given index.
     */
    getLeafHash(index: number): Uint8Array;
    /**
     * Gets the leaf hash at the given index as a hex string.
     */
    getLeafHashHex(index: number): HexString;
    /**
     * Verifies a proof locally (without calling the contract).
     * @param index - The index of the leaf value to verify
     * @param proof - The proof array (optional, will be computed if not provided)
     * @returns true if the proof is valid
     */
    verify(index: number, proof?: Uint8Array[]): boolean;
    private compareBytes;
    /**
     * Iterates over all values with their indices.
     */
    entries(): Generator<[number, T]>;
    /**
     * Gets the value at the given index.
     */
    getValue(index: number): T;
    /**
     * Finds the index of a value in the tree.
     * @param predicate - Function to test each value
     * @returns The index of the first matching value, or -1 if not found
     */
    findIndex(predicate: (value: T, index: number) => boolean): number;
    /**
     * Gets proof for a value matching the predicate.
     */
    getProofFor(predicate: (value: T, index: number) => boolean): {
        index: number;
        proof: Uint8Array[];
    } | null;
    /**
     * Renders the tree as a string for debugging.
     */
    render(): string;
    /**
     * Dumps the tree to a JSON-serializable format.
     */
    dump(): MerkleTreeDump<T>;
}
/**
 * Creates a merkle tree of Algorand addresses.
 * @param addresses - Array of Algorand addresses as Uint8Array (32 bytes each)
 */
export declare function createAddressTree(addresses: Uint8Array[]): MerkleTree<[Uint8Array]>;
/**
 * Creates a merkle tree of uint64 values.
 */
export declare function createUint64Tree(values: (bigint | number)[]): MerkleTree<[bigint | number]>;
/**
 * Creates a merkle tree of asset IDs (uint64).
 */
export declare function createAssetTree(assetIds: (bigint | number)[]): MerkleTree<[bigint | number]>;
/**
 * Verifies a merkle proof against a root.
 * @param root - The expected merkle root (32 bytes)
 * @param leaf - The leaf hash to verify (32 bytes)
 * @param proof - Array of proof elements (each 32 bytes)
 * @returns true if the proof is valid
 */
export declare function verifyProof(root: Uint8Array, leaf: Uint8Array, proof: Uint8Array[]): boolean;
