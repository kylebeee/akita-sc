import { BaseSDK } from "../base";
import { MetaMerklesClient, TypesValue, RootKey } from '../generated/MetaMerklesClient';
import { NewContractSDKParams, MaybeSigner } from "../types";
import { AddRootParams, UpdateRootParams, DeleteRootParams, AddDataParams, DeleteDataParams, AddTypeParams, GetRootParams, GetDataParams, GetTypeParams, VerifyParams, ReadParams, VerifiedReadParams, RootCostsParams, DataCostsParams, MetaMerklesGlobalState } from "./types";
import { MerkleTree } from "./tree";
export * from "./types";
export * from "./tree";
/**
 * SDK for interacting with the MetaMerkles contract.
 * Use this to manage merkle tree roots, metadata, and verify merkle proofs.
 */
export declare class MetaMerklesSDK extends BaseSDK<MetaMerklesClient> {
    constructor(params: NewContractSDKParams);
    /**
     * Gets the current global state of the MetaMerkles contract.
     */
    getState(): Promise<MetaMerklesGlobalState>;
    /**
     * Gets a merkle root by address and name.
     * @returns The 32-byte merkle root or undefined if not found
     */
    getRoot({ address, name }: GetRootParams): Promise<Uint8Array | undefined>;
    /**
     * Checks if a merkle root exists.
     */
    hasRoot({ address, name }: GetRootParams): Promise<boolean>;
    /**
     * Gets all merkle roots as a map.
     */
    getRoots(): Promise<Map<RootKey, Uint8Array>>;
    /**
     * Gets metadata associated with a merkle root.
     * @returns The metadata value or undefined if not found
     */
    getData({ address, name, key }: GetDataParams): Promise<string | undefined>;
    /**
     * Gets a tree type by ID.
     * @returns The type value (schema and description) or undefined if not found
     */
    getType({ id }: GetTypeParams): Promise<TypesValue | undefined>;
    /**
     * Gets all tree types as a map.
     */
    getTypes(): Promise<Map<bigint, TypesValue>>;
    /**
     * Gets the cost in microAlgo for creating a merkle root with the given name.
     */
    rootCosts({ name }: RootCostsParams): Promise<bigint>;
    /**
     * Gets the cost in microAlgo for adding data with the given parameters.
     */
    dataCosts({ name, key, value }: DataCostsParams): Promise<bigint>;
    /**
     * Verifies a leaf is included in a merkle tree.
     * @returns true if the proof is valid
     */
    verify({ address, name, leaf, proof, type }: VerifyParams): Promise<boolean>;
    /**
     * Reads metadata from a merkle root.
     */
    read({ address, name, key }: ReadParams): Promise<string>;
    /**
     * Verifies inclusion and reads metadata if verified.
     * @returns The metadata value, or empty string if verification fails
     */
    verifiedRead({ address, name, leaf, proof, type, key }: VerifiedReadParams): Promise<string>;
    /**
     * Verifies inclusion and reads metadata. Throws if verification fails.
     * @returns The metadata value
     */
    verifiedMustRead({ address, name, leaf, proof, type, key }: VerifiedReadParams): Promise<string>;
    /**
     * Adds a new merkle root.
     * @param name - The name alias of the root (max 31 bytes)
     * @param root - The 32-byte merkle tree root
     * @param type - The index of the tree type from box storage
     */
    addRoot({ sender, signer, name, root, type }: AddRootParams): Promise<void>;
    /**
     * Updates an existing merkle root.
     * @param name - The name of the merkle group data
     * @param newRoot - The new 32-byte merkle tree root
     */
    updateRoot({ sender, signer, name, newRoot }: UpdateRootParams): Promise<void>;
    /**
     * Deletes a merkle root and returns the MBR to the sender.
     * Only the original creator can delete the root.
     */
    deleteRoot({ sender, signer, name }: DeleteRootParams): Promise<void>;
    /**
     * Adds metadata to an existing merkle root.
     * @param name - The name of the merkle tree root
     * @param key - The metadata key (max 15 bytes, cannot start with "l.")
     * @param value - The metadata value (max 1024 bytes)
     */
    addData({ sender, signer, name, key, value }: AddDataParams): Promise<void>;
    /**
     * Deletes metadata from a merkle root and returns the MBR to the sender.
     * Only the original creator can delete data.
     */
    deleteData({ sender, signer, name, key }: DeleteDataParams): Promise<void>;
    /**
     * Adds a new tree type definition.
     * Requires a 100 ALGO payment.
     * @param description - Description of the tree type (max 800 bytes)
     * @param schemaList - The schema parts defining the leaf structure
     */
    addType({ sender, signer, description, schemaList }: AddTypeParams): Promise<void>;
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
    addRootFromTree<T extends unknown[]>({ sender, signer, name, tree, type, }: MaybeSigner & {
        name: string;
        tree: MerkleTree<T>;
        type: bigint | number;
    }): Promise<void>;
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
    verifyFromTree<T extends unknown[]>({ address, name, tree, index, type, }: {
        address: string;
        name: string;
        tree: MerkleTree<T>;
        index: number;
        type: bigint | number;
    }): Promise<boolean>;
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
    verifiedReadFromTree<T extends unknown[]>({ address, name, tree, index, type, key, }: {
        address: string;
        name: string;
        tree: MerkleTree<T>;
        index: number;
        type: bigint | number;
        key: string;
    }): Promise<string>;
    /**
     * Verifies inclusion and reads metadata using a MerkleTree instance.
     * Throws if verification fails.
     */
    verifiedMustReadFromTree<T extends unknown[]>({ address, name, tree, index, type, key, }: {
        address: string;
        name: string;
        tree: MerkleTree<T>;
        index: number;
        type: bigint | number;
        key: string;
    }): Promise<string>;
}
