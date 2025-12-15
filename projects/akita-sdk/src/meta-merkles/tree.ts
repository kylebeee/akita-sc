import { sha256 } from '@noble/hashes/sha256';
import { SchemaPart } from './types';

/**
 * A merkle tree implementation compatible with the MetaMerkles contract.
 * Uses SHA256 for hashing (same as the on-chain contract).
 */

// ========== Types ==========

export type HexString = `0x${string}`;

export interface MerkleTreeDump<T> {
  format: 'standard-v1';
  tree: string[];
  values: { value: T; treeIndex: number }[];
  leafEncoding: string;
}

// ========== Utility Functions ==========

/**
 * Converts a Uint8Array to a hex string prefixed with 0x
 */
export function bytesToHex(bytes: Uint8Array): HexString {
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Converts a hex string (with or without 0x prefix) to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Compares two byte arrays for sorting (used in merkle tree hashing)
 */
function compareBytes(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return a.length - b.length;
}

/**
 * Hash two nodes together, sorting them first (sorted pair hashing)
 * This matches the contract's hash function behavior
 */
function hashPair(a: Uint8Array, b: Uint8Array): Uint8Array {
  // Sort the pair - larger value second (same as contract: if BigUint(a) > BigUint(b) then sha256(b.concat(a)))
  if (compareBytes(a, b) > 0) {
    return sha256(new Uint8Array([...b, ...a]));
  }
  return sha256(new Uint8Array([...a, ...b]));
}

// ========== Leaf Encoding Functions ==========

/**
 * Encodes a value as bytes according to a schema part type.
 */
export function encodeValue(value: unknown, schemaPart: SchemaPart): Uint8Array {
  switch (schemaPart) {
    case SchemaPart.Uint8: {
      const buf = new Uint8Array(1);
      buf[0] = Number(value) & 0xff;
      return buf;
    }
    case SchemaPart.Uint16: {
      const buf = new Uint8Array(2);
      const view = new DataView(buf.buffer);
      view.setUint16(0, Number(value), false);
      return buf;
    }
    case SchemaPart.Uint32: {
      const buf = new Uint8Array(4);
      const view = new DataView(buf.buffer);
      view.setUint32(0, Number(value), false);
      return buf;
    }
    case SchemaPart.Uint64: {
      const buf = new Uint8Array(8);
      const view = new DataView(buf.buffer);
      view.setBigUint64(0, BigInt(value as bigint | number), false);
      return buf;
    }
    case SchemaPart.Uint128: {
      const buf = new Uint8Array(16);
      let n = BigInt(value as bigint | number);
      for (let i = 15; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case SchemaPart.Uint256: {
      const buf = new Uint8Array(32);
      let n = BigInt(value as bigint | number);
      for (let i = 31; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case SchemaPart.Uint512: {
      const buf = new Uint8Array(64);
      let n = BigInt(value as bigint | number);
      for (let i = 63; i >= 0; i--) {
        buf[i] = Number(n & 0xffn);
        n >>= 8n;
      }
      return buf;
    }
    case SchemaPart.Bytes4:
    case SchemaPart.Bytes8:
    case SchemaPart.Bytes16:
    case SchemaPart.Bytes32:
    case SchemaPart.Bytes64:
    case SchemaPart.Bytes128:
    case SchemaPart.Bytes256:
    case SchemaPart.Bytes512: {
      const sizes: Record<number, number> = {
        [SchemaPart.Bytes4]: 4,
        [SchemaPart.Bytes8]: 8,
        [SchemaPart.Bytes16]: 16,
        [SchemaPart.Bytes32]: 32,
        [SchemaPart.Bytes64]: 64,
        [SchemaPart.Bytes128]: 128,
        [SchemaPart.Bytes256]: 256,
        [SchemaPart.Bytes512]: 512,
      };
      const size = sizes[schemaPart];
      if (value instanceof Uint8Array) {
        if (value.length !== size) {
          throw new Error(`Expected ${size} bytes, got ${value.length}`);
        }
        return value;
      }
      // Handle hex string
      const bytes = hexToBytes(value as string);
      if (bytes.length !== size) {
        throw new Error(`Expected ${size} bytes, got ${bytes.length}`);
      }
      return bytes;
    }
    case SchemaPart.String: {
      return new TextEncoder().encode(value as string);
    }
    case SchemaPart.Address: {
      // Algorand addresses are 32 bytes when decoded from base32
      const addr = value as string;
      // Use algosdk-style decoding or raw bytes
      if (addr.length === 58) {
        // Base32 encoded Algorand address - decode it
        // For simplicity, if you have algosdk available, use decodeAddress
        // Here we'll just use raw bytes if provided as Uint8Array
        throw new Error('Please provide address as Uint8Array (32 bytes) or use decodeAlgorandAddress helper');
      }
      if (value instanceof Uint8Array && value.length === 32) {
        return value;
      }
      throw new Error('Address must be 32 bytes');
    }
    default:
      throw new Error(`Unknown schema part: ${schemaPart}`);
  }
}

/**
 * Encodes a leaf value using the given schema.
 * For single values, pass a single-element array schema.
 * For tuples, pass values and schema arrays of matching length.
 */
export function encodeLeaf(values: unknown[], schema: SchemaPart[]): Uint8Array {
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

/**
 * Hashes a leaf value using SHA256.
 * The leaf is double-hashed: sha256(sha256(encoded_value))
 * This is the standard "leaf prefix" technique to prevent second preimage attacks.
 */
export function hashLeaf(encodedLeaf: Uint8Array): Uint8Array {
  // Double hash for leaf nodes (standard merkle tree practice)
  return sha256(sha256(encodedLeaf));
}

// ========== Merkle Tree Class ==========

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
export class MerkleTree<T extends unknown[]> {
  private readonly tree: Uint8Array[];
  private readonly values: T[];
  private readonly schema: SchemaPart[];
  private readonly leafIndices: Map<number, number>; // value index -> tree index

  private constructor(values: T[], schema: SchemaPart[]) {
    this.values = values;
    this.schema = schema;
    this.leafIndices = new Map();
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
  static of<T extends unknown[]>(values: T[], schema: SchemaPart[]): MerkleTree<T> {
    if (values.length === 0) {
      throw new Error('Cannot create merkle tree with no values');
    }
    return new MerkleTree(values, schema);
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
  static ofSimple<T>(values: T[], schemaPart: SchemaPart): MerkleTree<[T]> {
    return MerkleTree.of(values.map(v => [v] as [T]), [schemaPart]);
  }

  /**
   * Loads a merkle tree from a dump (useful for persistence).
   */
  static load<T extends unknown[]>(dump: MerkleTreeDump<T>, schema: SchemaPart[]): MerkleTree<T> {
    const values = dump.values.map(v => v.value);
    return MerkleTree.of(values, schema);
  }

  private buildTree(): Uint8Array[] {
    const leaves = this.values.map(v => hashLeaf(encodeLeaf(v, this.schema)));
    
    // Handle power of 2 padding
    const n = leaves.length;
    const treeSize = 2 * n - 1;
    const tree: Uint8Array[] = new Array(treeSize);
    
    // Place leaves at the end of the tree array
    for (let i = 0; i < n; i++) {
      tree[treeSize - n + i] = leaves[i];
      this.leafIndices.set(i, treeSize - n + i);
    }
    
    // Build internal nodes from bottom up
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
  get root(): Uint8Array {
    return this.tree[0];
  }

  /**
   * The merkle root as a hex string (0x prefixed).
   */
  get rootHex(): HexString {
    return bytesToHex(this.root);
  }

  /**
   * Number of leaves in the tree.
   */
  get length(): number {
    return this.values.length;
  }

  /**
   * Gets the proof for a leaf at the given index.
   * @param index - The index of the leaf value
   * @returns Array of 32-byte proof elements
   */
  getProof(index: number): Uint8Array[] {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.values.length})`);
    }
    
    const proof: Uint8Array[] = [];
    let treeIndex = this.leafIndices.get(index)!;
    
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
  getProofHex(index: number): HexString[] {
    return this.getProof(index).map(bytesToHex);
  }

  /**
   * Gets the leaf hash at the given index.
   */
  getLeafHash(index: number): Uint8Array {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Index ${index} out of bounds [0, ${this.values.length})`);
    }
    const treeIndex = this.leafIndices.get(index)!;
    return this.tree[treeIndex];
  }

  /**
   * Gets the leaf hash at the given index as a hex string.
   */
  getLeafHashHex(index: number): HexString {
    return bytesToHex(this.getLeafHash(index));
  }

  /**
   * Verifies a proof locally (without calling the contract).
   * @param index - The index of the leaf value to verify
   * @param proof - The proof array (optional, will be computed if not provided)
   * @returns true if the proof is valid
   */
  verify(index: number, proof?: Uint8Array[]): boolean {
    const actualProof = proof ?? this.getProof(index);
    let hash = this.getLeafHash(index);
    
    for (const sibling of actualProof) {
      hash = hashPair(hash, sibling);
    }
    
    return this.compareBytes(hash, this.root);
  }

  private compareBytes(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Iterates over all values with their indices.
   */
  *entries(): Generator<[number, T]> {
    for (let i = 0; i < this.values.length; i++) {
      yield [i, this.values[i]];
    }
  }

  /**
   * Gets the value at the given index.
   */
  getValue(index: number): T {
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
  findIndex(predicate: (value: T, index: number) => boolean): number {
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
  getProofFor(predicate: (value: T, index: number) => boolean): { index: number; proof: Uint8Array[] } | null {
    const index = this.findIndex(predicate);
    if (index === -1) return null;
    return { index, proof: this.getProof(index) };
  }

  /**
   * Renders the tree as a string for debugging.
   */
  render(): string {
    const lines: string[] = ['Merkle Tree:'];
    lines.push(`  Root: ${this.rootHex}`);
    lines.push(`  Leaves: ${this.values.length}`);
    lines.push('  Values:');
    for (let i = 0; i < this.values.length; i++) {
      lines.push(`    [${i}] ${JSON.stringify(this.values[i])} -> ${this.getLeafHashHex(i)}`);
    }
    return lines.join('\n');
  }

  /**
   * Dumps the tree to a JSON-serializable format.
   */
  dump(): MerkleTreeDump<T> {
    return {
      format: 'standard-v1',
      tree: this.tree.map(bytesToHex),
      values: this.values.map((value, i) => ({
        value,
        treeIndex: this.leafIndices.get(i)!,
      })),
      leafEncoding: this.schema.map(s => SchemaPart[s]).join(','),
    };
  }
}

// ========== Helper Functions for Common Use Cases ==========

/**
 * Creates a merkle tree of Algorand addresses.
 * @param addresses - Array of Algorand addresses as Uint8Array (32 bytes each)
 */
export function createAddressTree(addresses: Uint8Array[]): MerkleTree<[Uint8Array]> {
  return MerkleTree.ofSimple(addresses, SchemaPart.Address);
}

/**
 * Creates a merkle tree of uint64 values.
 */
export function createUint64Tree(values: (bigint | number)[]): MerkleTree<[bigint | number]> {
  return MerkleTree.ofSimple(values, SchemaPart.Uint64);
}

/**
 * Creates a merkle tree of asset IDs (uint64).
 */
export function createAssetTree(assetIds: (bigint | number)[]): MerkleTree<[bigint | number]> {
  return createUint64Tree(assetIds);
}

/**
 * Verifies a merkle proof against a root.
 * @param root - The expected merkle root (32 bytes)
 * @param leaf - The leaf hash to verify (32 bytes)
 * @param proof - Array of proof elements (each 32 bytes)
 * @returns true if the proof is valid
 */
export function verifyProof(root: Uint8Array, leaf: Uint8Array, proof: Uint8Array[]): boolean {
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

