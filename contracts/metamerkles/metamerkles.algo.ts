import { Contract } from '@algorandfoundation/tealscript';

const errs = {
  KEY_TOO_LONG: 'max key length is 32 bytes',
  DATA_TOO_LONG: 'max data length is 1024 bytes',
  RESERVED_KEY_PREFIX: 'l. is reserved for internals',
  NO_ROOT: 'the root does not exist in box storage',
  NO_ROOT_FOR_DATA: 'there must be a root to associate the data to',
  ROOT_ALREADY_EXISTS: 'this root already exists',
  FAILED_TO_VERIFY_INCLUSION: 'failed to verify inclusion',
  SCHEMA_MISMATCH: 'list schema does not match',
  TYPE_MISMATCH: 'list type does not match',
  NO_DATA: 'data does not exist',
  NEW_DATA_ALREADY_EXISTS: 'new data already exists',
  NO_TREE_SCHEMA: 'tree schema does not exist',
  TREE_SCHEMA_KEY_ALREADY_EXISTS: 'tree schema key already exists for this root',
  NO_TREE_TYPE: 'tree type does not exist',
  TREE_TYPE_KEY_ALREADY_EXISTS: 'tree type key already exists for this root'
}

const rootKeyLength = 64;
const truncatedKeyLength = 32;
const schemaKeyByteLength = 8;
const treeTypeKeyByteLength = 5;
const uint64ByteLength = 8;

const maxDataKeyLength = 32;
const maxDataLength = 1024;

const reservedDataKeyPrefix = 'l.';
const treeSchemaKey = 'l.schema';
const treeTypeKey = 'l.type';

export const rootMinBalance: uint64 = 2_500 + (400 * rootKeyLength);
export const schemaMinBalance: uint64 = 2_500 + (400 * ((truncatedKeyLength + schemaKeyByteLength) + uint64ByteLength));
export const treeTypeMinBalance: uint64 = 2_500 + (400 * ((truncatedKeyLength + treeTypeKeyByteLength) + uint64ByteLength));

type bytes16 = bytes<16>;

interface NamedRootKey { address: Address, name: string };

interface RootKey { address: Address, root: bytes32 };

interface DataKey { address: bytes16, root: bytes16, key: string };

export class MetaMerkles extends Contract {

  // 0: Unspecified
  // 1: String
  // 2: Uint64
  // 3: DoubleUint64
  treeSchemaIndex = GlobalStateKey<uint64>({ key: 'tsi' });
  treeSchemas = BoxMap<uint64, string>();

  // 0: Unspecified
  // 1: Collection
  // 2: Trait
  // 3: Trade
  treeTypesIndex = GlobalStateKey<uint64>({ key: 'tti' });
  treeTypes = BoxMap<uint64, string>({ prefix: 't' });

  // named root
  namedRoots = BoxMap<NamedRootKey, bytes32>();

  // the max size of all args to a contract is 2048
  // which means accounting for box key & leaf
  // and a byte length of 66 for each proof in the
  // array, max we can verify is 30, plenty.
  roots = BoxMap<RootKey, bytes<0>>();

  // rootData is the box map for managing the data
  // associated with a group
  data = BoxMap<DataKey, string>();

  private createRoot(pmt: PayTxn, root: bytes32, treeSchema: uint64, treeType: uint64): void {
    const rootKey: RootKey = { address: this.txn.sender, root: root };

    const treeSchemaDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeSchemaKey);
    const treeTypeDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeTypeKey);

    assert(!this.roots(rootKey).exists, errs.NO_ROOT)
    assert(this.treeSchemas(treeSchema).exists, errs.NO_TREE_SCHEMA);
    assert(!this.data(treeSchemaDataKey).exists, errs.TREE_SCHEMA_KEY_ALREADY_EXISTS);
    assert(this.treeTypes(treeType).exists, errs.NO_TREE_TYPE);
    assert(!this.data(treeTypeDataKey).exists, errs.TREE_TYPE_KEY_ALREADY_EXISTS);

    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: rootMinBalance + schemaMinBalance + treeTypeMinBalance,
    })

    this.roots(rootKey).create(0);
    this.data(treeSchemaDataKey).value = itob(treeSchema);
    this.data(treeTypeDataKey).value = itob(treeType);
  }

  addNamedRoot(name: string, pmt: PayTxn, root: bytes32, treeSchema: uint64, treeType: uint64): void {
    assert(name.length <= 32, 'Cannot add root with name longer than 32 bytes');
    this.namedRoots({ address: this.txn.sender, name: name }).value = root;
    this.createRoot(pmt, root, treeSchema, treeType);
  }

  /** 
   * Creates two boxes and adds a merkle root
   * using a `RootKey` to the root box map and also a list type to the 
   * metadata attached to the root in the data box map
   * 
   * @param pmt the fee to cover box storage allocation
   * @param root a merkle tree root
   * @param treeSchema an index of the schema enum from box storage
   * @param treeType an index of the tree type enum from box storage
   */
  addRoot(pmt: PayTxn, root: bytes32, treeSchema: uint64, treeType: uint64): void {
    this.createRoot(pmt, root, treeSchema, treeType);
  }

  /**
   * Deletes the merkle root from the root box map
   * 
   * @param root the 32 byte merkle tree root
   */
  deleteRoot(root: bytes32): void {
    const rootKey: RootKey = { address: this.txn.sender, root: root };

    const treeSchemaDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeSchemaKey);
    const treeTypeDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeTypeKey);

    assert(this.roots(rootKey).exists)

    this.roots(rootKey).delete();
    this.data(treeSchemaDataKey).delete();
    this.data(treeTypeDataKey).delete();

    // return their MBR
    sendPayment({
      receiver: this.txn.sender,
      amount: rootMinBalance,
    })
  }

  /**
   * Replaces the merkle root with another
   * 
   * @param root the 32 byte merkle tree root
   * @param newRoot the new 32 byte merkle tree root
   */
  private createReplaceRoot(root: bytes32, newRoot: bytes32): void {
    const rootKey: RootKey = { address: this.txn.sender, root: root };
    assert(this.roots(rootKey).exists, errs.NO_ROOT);

    const newRootKey: RootKey = { address: this.txn.sender, root: newRoot };
    assert(!this.roots(newRootKey).exists, errs.ROOT_ALREADY_EXISTS);

    const treeSchemaDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeSchemaKey);
    const treeTypeDataKey: DataKey = this.getDataKey(this.txn.sender, root, treeTypeKey);

    const schema = this.data(treeSchemaDataKey).value;
    const treeType = this.data(treeTypeDataKey).value;

    this.roots(rootKey).delete();
    this.data(treeSchemaDataKey).delete();
    this.data(treeTypeDataKey).delete();

    const newTreeSchemaDataKey: DataKey = this.getDataKey(this.txn.sender, newRoot, treeSchemaKey);
    const newTreeTypeDataKey: DataKey = this.getDataKey(this.txn.sender, newRoot, treeTypeKey);

    this.roots(newRootKey).create(0);
    this.data(newTreeSchemaDataKey).value = schema;
    this.data(newTreeTypeDataKey).value = treeType;
  }

  replaceNamedRoot(name: string, root: bytes32, newRoot: bytes32): void {
    const nameKey = { address: this.txn.sender, name: name };
    assert(this.namedRoots(nameKey).exists, 'Cannot add root with name longer than 32 bytes');
    this.namedRoots(nameKey).value = root;
    this.createReplaceRoot(root, newRoot);
  }
  
  /**
   * Replaces the merkle root with another
   * 
   * @param root the 32 byte merkle tree root
   * @param newRoot the new 32 byte merkle tree root
   */
  replaceRoot(root: bytes32, newRoot: bytes32): void {
    this.createReplaceRoot(root, newRoot);
  }

  /**
   * Replaces metadata between roots
   * 
   * @param root the 32 byte merkle tree root
   * @param newRoot the new 32 byte merkle tree root
   * @param key the key for the data being transfered to the new root
   */
  replaceDataRoot(root: bytes32, newRoot: bytes32, key: string): void {
    const rootKey: RootKey = { address: this.txn.sender, root: root };
    assert(this.roots(rootKey).exists, errs.NO_ROOT);

    const newRootKey: RootKey = { address: this.txn.sender, root: newRoot };
    assert(!this.roots(newRootKey).exists, errs.ROOT_ALREADY_EXISTS);

    const dataKey: DataKey = this.getDataKey(this.txn.sender, root, key);
    const newDataKey: DataKey = this.getDataKey(this.txn.sender, newRoot, key)

    assert(this.data(dataKey).exists, errs.NO_DATA);
    assert(!this.data(dataKey).exists, errs.NEW_DATA_ALREADY_EXISTS);
    const value = this.data(dataKey).value;
    this.data(dataKey).delete();
    this.data(newDataKey).value = value;
  }

  /**
   * Registers a key & value in the data box map that
   * corresponds to a merkle root in the root box map
   * 
   * @param pmt the payment to cover the increased mbr of adding to box storage
   * @param root the 32 byte merkle tree root
   * @param key the metadata key eg. `Royalty`
   * @param value the metadata value eg. `5` encoded as a bytestring for 5%
   */
  addData(pmt: PayTxn, root: bytes32, key: string, value: string): void {
    const rootKey: RootKey = { address: this.txn.sender, root: root };

    assert(key.length <= maxDataKeyLength, errs.KEY_TOO_LONG);
    assert(value.length <= maxDataLength, errs.DATA_TOO_LONG);
    assert(key.length < 2 || !(extract3(key, 0, 2) === reservedDataKeyPrefix), errs.RESERVED_KEY_PREFIX)
    assert(this.roots(rootKey).exists, errs.NO_ROOT_FOR_DATA);

    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: this.getBoxCreateMinBalance(32 + key.length, value.length),
    });

    const dataKey: DataKey = this.getDataKey(this.txn.sender, root, key);

    this.data(dataKey).value = value;
  }

  /**
   * Deletes a metadata key & value pair from the data box map
   * 
   * @param root the sha256'd 32 byte merkle tree root
   * @param key the metadata key you want to remove
   */
  deleteData(root: bytes32, key: string): void {
    const dataKey: DataKey = this.getDataKey(this.txn.sender, root, key);

    assert(this.data(dataKey).exists);

    let valueLength = this.data(dataKey).value.length;

    this.data(dataKey).delete();

    sendPayment({
      receiver: this.txn.sender,
      amount: this.getBoxCreateMinBalance(32 + key.length, valueLength),
    })
  }

  /**
     * verify an inclusion in a double sha256 based merkle tree
     *
     * @param address the address of the merkle tree root creator
     * @param root The merkle root
     * @param leaf The hashed leaf to verify
     * @param proof The merkle proof
     *
     * @returns a boolean indicating whether the proof is valid
     */
  verify(address: Address, root: bytes32, leaf: bytes32, proof: bytes32[], schema: uint64, treeType: uint64): boolean {
    const rootKey: RootKey = { address: address, root: root };
    assert(this.roots(rootKey).exists);
    assert(this.getTreeSchema(address, root) === schema, errs.SCHEMA_MISMATCH);
    assert(this.getTreeType(address, root) === treeType, errs.TYPE_MISMATCH);

    let hash = leaf;
    for (let i = 0; i < proof.length; i += 1) {
      if (globals.opcodeBudget < 50) {
        increaseOpcodeBudget();
      }

      hash = this.hash(proof[i], hash)
    }

    return hash === root;
  }

  /**
   * Fetch a metadata property
   * 
   * @param address the address of the merkle tree root creator
   * @param root the 32 byte merkle tree root
   * @param key the metadata key eg. `Royalty`
   * @returns the value set eg. `5` encoded as a bytestring for 5%
   */
  read(address: Address, root: bytes32, key: string): string {
    const dataKey: DataKey = this.getDataKey(address, root, key);
    assert(this.data(dataKey).exists)
    return this.data(dataKey).value
  }

  /**
   * Read metadata from box storage and verify the data provided is included
   * in the merkle tree given a sha256'd 32 byte merkle tree root & a proof
   * thats pre-computed off chain.
   * 
   * verify an inclusion in a merkle tree 
   * & read an associated key value pair
   * & check against the underlying data's schema
   * & check against the underlying data's list type or purpose
   * 
   * @param address the address of the merkle tree root creator
   * @param root the sha256'd 32 byte merkle tree root
   * @param proof the proof the hash is included
   * @param data the data being verified
   * @param key the metadata key eg. `Royalty`
   * @param schema the schema to verify the underlying data shape ( 0 if the caller doesnt care )
   * @param treeType the list type that helps contracts ensure 
   * the lists purpose isn't being misused ( 0 if the caller doesnt care )
   * @returns a string of metadata
   */
  verifiedRead(
    address: Address,
    root: bytes32,
    leaf: bytes32,
    proof: bytes32[],
    schema: uint64,
    treeType: uint64,
    key: string,
  ): string {
    assert(this.verify(address, root, leaf, proof, schema, treeType), errs.FAILED_TO_VERIFY_INCLUSION);

    return this.read(address, root, key);
  }

  addTreeType(pmt: PayTxn, desc: string): void {
    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: 100_000_000,
    });

    assert(desc.length <= 1024, errs.DATA_TOO_LONG);

    this.treeTypes(this.treeTypesIndex.value).value = desc;
    this.treeTypesIndex.value = (this.treeTypesIndex.value + 1);
  }

  addTreeSchema(pmt: PayTxn, desc: string): void {
    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: 100_000_000,
    });

    assert(desc.length <= 1024, errs.DATA_TOO_LONG);

    this.treeSchemas(this.treeSchemaIndex.value).value = desc;
    this.treeSchemaIndex.value = (this.treeSchemaIndex.value + 1);
  }

  private getTreeSchema(address: Address, root: bytes32): uint64 {
    const schemaDataKey: DataKey = this.getDataKey(address, root, treeSchemaKey);
    assert(this.data(schemaDataKey).exists)
    return btoi(this.data(schemaDataKey).value)
  }

  private getTreeType(address: Address, root: bytes32): uint64 {
    const treeTypeDataKey: DataKey = this.getDataKey(address, root, treeTypeKey);
    assert(this.data(treeTypeDataKey).exists)
    return btoi(this.data(treeTypeDataKey).value)
  }

  private hash(a: bytes32, b: bytes32): bytes32 {
    if (btobigint(a) > btobigint(b)) {
      return sha256(b + a)
    } else {
      return sha256(a + b);
    }
  }

  private getBoxCreateMinBalance(a: uint64, b: uint64): uint64 {
    return 2_500 + (400 * (a + b))
  }

  private getDataKey(address: Address, root: bytes32, key: string): DataKey {
    let truncatedAddress = extract3(address, 0, 16) as bytes16;
    let truncatedRoot = extract3(root, 0, 16) as bytes16;

    return { address: truncatedAddress, root: truncatedRoot, key: key };
  }
}
