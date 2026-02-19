"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMerklesSDK = void 0;
const algokit_utils_1 = require("@algorandfoundation/algokit-utils");
const base_1 = require("../base");
const config_1 = require("../config");
const MetaMerklesClient_1 = require("../generated/MetaMerklesClient");
__exportStar(require("./types"), exports);
__exportStar(require("./tree"), exports);
/** Cost in microAlgo for adding a new tree type */
const ADD_TYPE_COST = 100000000n;
/**
 * SDK for interacting with the MetaMerkles contract.
 * Use this to manage merkle tree roots, metadata, and verify merkle proofs.
 */
class MetaMerklesSDK extends base_1.BaseSDK {
    constructor(params) {
        super({ factory: MetaMerklesClient_1.MetaMerklesFactory, ...params }, config_1.ENV_VAR_NAMES.META_MERKLES_APP_ID);
    }
    // ========== Read Methods ==========
    /**
     * Gets the current global state of the MetaMerkles contract.
     */
    async getState() {
        const state = await this.client.state.global.getAll();
        return {
            typesId: state.typesId ?? 0n,
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
        }
        catch (error) {
            // Box doesn't exist - return undefined
            if (error instanceof Error && error.message.includes('box not found')) {
                return undefined;
            }
            throw error;
        }
    }
    /**
     * Checks if a merkle root exists.
     */
    async hasRoot({ address, name }) {
        const root = await this.getRoot({ address, name });
        return root !== undefined;
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
        // Truncate address to first 16 bytes for the data key
        const addressBytes = Uint8Array.from(Buffer.from(address.slice(0, 32), 'base64'));
        const truncatedAddress = addressBytes.slice(0, 16);
        try {
            return await this.client.state.box.data.value({
                address: truncatedAddress,
                name,
                key,
            });
        }
        catch (error) {
            // Box doesn't exist - return undefined
            if (error instanceof Error && error.message.includes('box not found')) {
                return undefined;
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
        // Convert proof array to format expected by contract
        const formattedProof = proof.map(p => {
            if (p.length !== 32) {
                throw new Error('Each proof element must be exactly 32 bytes');
            }
            return p;
        });
        const { return: result } = await this.client.send.verify({
            args: {
                address,
                name,
                leaf,
                proof: formattedProof,
                type,
            },
        });
        return result ?? false;
    }
    /**
     * Reads metadata from a merkle root.
     */
    async read({ address, name, key }) {
        return await this.client.read({
            args: { address, name, key },
        });
    }
    /**
     * Verifies inclusion and reads metadata if verified.
     * @returns The metadata value, or empty string if verification fails
     */
    async verifiedRead({ address, name, leaf, proof, type, key }) {
        const formattedProof = proof.map(p => {
            if (p.length !== 32) {
                throw new Error('Each proof element must be exactly 32 bytes');
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
                key,
            },
        });
        return result ?? '';
    }
    /**
     * Verifies inclusion and reads metadata. Throws if verification fails.
     * @returns The metadata value
     */
    async verifiedMustRead({ address, name, leaf, proof, type, key }) {
        const formattedProof = proof.map(p => {
            if (p.length !== 32) {
                throw new Error('Each proof element must be exactly 32 bytes');
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
                key,
            },
        });
        if (result === undefined) {
            throw new Error('Failed to read verified data');
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
            throw new Error('Root must be exactly 32 bytes');
        }
        const cost = await this.rootCosts({ name });
        const payment = await this.client.algorand.createTransaction.payment({
            ...sendParams,
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        await this.client.send.addRoot({
            ...sendParams,
            args: {
                payment,
                name,
                root,
                type,
            },
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
            throw new Error('New root must be exactly 32 bytes');
        }
        await this.client.send.updateRoot({
            ...sendParams,
            args: {
                name,
                newRoot,
            },
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
            extraFee: (0, algokit_utils_1.microAlgo)(1000),
            args: { name },
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
            amount: (0, algokit_utils_1.microAlgo)(cost),
            receiver: this.client.appAddress,
        });
        await this.client.send.addData({
            ...sendParams,
            args: {
                payment,
                name,
                key,
                value,
            },
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
            extraFee: (0, algokit_utils_1.microAlgo)(1000),
            args: { name, key },
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
            amount: (0, algokit_utils_1.microAlgo)(ADD_TYPE_COST),
            receiver: this.client.appAddress,
        });
        // Convert SchemaPart enum values to numbers for the contract
        const schemaListNumbers = schemaList.map(part => part);
        await this.client.send.addType({
            ...sendParams,
            args: {
                payment,
                description,
                schemaList: schemaListNumbers,
            },
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
    async addRootFromTree({ sender, signer, name, tree, type, }) {
        return this.addRoot({
            sender,
            signer,
            name,
            root: tree.root,
            type,
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
    async verifyFromTree({ address, name, tree, index, type, }) {
        return this.verify({
            address,
            name,
            leaf: tree.getLeafHash(index),
            proof: tree.getProof(index),
            type,
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
    async verifiedReadFromTree({ address, name, tree, index, type, key, }) {
        return this.verifiedRead({
            address,
            name,
            leaf: tree.getLeafHash(index),
            proof: tree.getProof(index),
            type,
            key,
        });
    }
    /**
     * Verifies inclusion and reads metadata using a MerkleTree instance.
     * Throws if verification fails.
     */
    async verifiedMustReadFromTree({ address, name, tree, index, type, key, }) {
        return this.verifiedMustRead({
            address,
            name,
            leaf: tree.getLeafHash(index),
            proof: tree.getProof(index),
            type,
            key,
        });
    }
}
exports.MetaMerklesSDK = MetaMerklesSDK;
//# sourceMappingURL=index.js.map