import { Contract } from '@algorandfoundation/tealscript';
import { EMPTY_BYTES_16, EMPTY_BYTES_32 } from '../../utils/constants';

const errs = {
  KEY_TOO_LONG: 'max key length is 32 bytes',
  DATA_TOO_LONG: 'max data length is 1024 bytes',
  RESERVED_KEY_PREFIX: 'l. is reserved for internals',
  NAME_TAKEN: 'this name is already in use',
  NO_NAME: 'a root with this name does not exist',
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

const maxDataKeyLength = 15;
const maxDataLength = 1024;

const reservedDataKeyPrefix = 'l.';
const treeSchemaKey = 'l.schema';
const treeTypeKey = 'l.type';

export const MAX_ROOT_BOX_MBR = 40_900;
export const MAX_SCHEMA_BOX_MBR = 21_700;
export const MAX_TYPE_BOX_MBR = 20_900;

export type RootKey = {
  address: Address,
  name: string
};

export type DataKey = {
  address: bytes<16>,
  name: string,
  key: string
};

export class MetaMerkles extends Contract {

  // 0: Unspecified
  // 1: string
  // 2: uint64
  // 3: uint64,uint64
  // 4: address,address,uint64,uint64
  // 5: address,address,uint64,uint64,uint64
  schemaIndex = GlobalStateKey<uint64>({ key: 's' });
  schemas = BoxMap<uint64, string>();

  // 0: Unspecified
  // 1: Collection
  // 2: Trait
  // 3: Trade
  typesIndex = GlobalStateKey<uint64>({ key: 't' });
  types = BoxMap<uint64, string>({ prefix: 't' });

  // the max size of all args to a contract is 2048
  // which means accounting for box key & leaf
  // and a byte length of 66 for each proof in the
  // array, max we can verify is 30, plenty.
  // max_mbr: (400 * (64 + 32)) = 38_400: + 2_500 = 40_900
  roots = BoxMap<RootKey, bytes32>();

  // rootData is the box map for managing the data
  // associated with a group
  // max_schema_mbr: (400 * (32 + 8 + 8)) = 19_200 + 2_500 = 21_700
  // max_type_mbr: (400 * (32 + 6 + 8)) = 18_400 + 2_500 = 20_900
  data = BoxMap<DataKey, string>({ prefix: 'd' });

  private getRootBoxDelta(name: string): uint64 {
    const pre = globals.currentApplicationAddress.minBalance;
    const rKey: RootKey = { address: globals.zeroAddress, name: name };
    this.roots(rKey).value = EMPTY_BYTES_32;
    const delta = globals.currentApplicationAddress.minBalance - pre;
    this.roots(rKey).delete();
    return delta;
  }

  private getDataBoxDelta(name: string, key: string, value: string): uint64 {
    const pre = globals.currentApplicationAddress.minBalance;
    const dKey: DataKey = { address: EMPTY_BYTES_16, name: name, key: key };
    this.data(dKey).value = value;
    const delta = globals.currentApplicationAddress.minBalance - pre;
    this.data(dKey).delete();
    return delta;
  }

  @abi.readonly
  rootCosts(name: string): uint64 {
    const rootCost = this.getRootBoxDelta(name);
    const schemaCost = this.getDataBoxDelta(name, treeSchemaKey, itob(0));
    const typeCost = this.getDataBoxDelta(name, treeTypeKey, itob(0));
    return rootCost + schemaCost + typeCost;
  }

  /** 
   * Creates two boxes and adds a merkle root
   * using a `RootKey` to the root box map and also a list type to the 
   * metadata attached to the root in the data box map
   * 
   * @param pmt the fee to cover box storage allocation
   * @param name the name alias of the root being added
   * @param root a merkle tree root
   * @param schema an index of the schema enum from box storage
   * @param type an index of the tree type enum from box storage
   */
  addRoot(pmt: PayTxn, name: string, root: bytes32, schema: uint64, type: uint64): void {
    assert(name.length <= 32, 'Cannot add root with name longer than 32 bytes');
    assert(this.schemas(schema).exists, errs.NO_TREE_SCHEMA);
    assert(this.types(type).exists, errs.NO_TREE_TYPE);

    const truncatedAddress = extract3(this.txn.sender, 0, 16) as bytes<16>;
    
    const rootKey: RootKey = {
      address: this.txn.sender,
      name: name
    };

    const schemaKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeSchemaKey
    };

    const typeKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeTypeKey
    };

    assert(!this.roots(rootKey).exists, errs.NAME_TAKEN);
    assert(!this.data(schemaKey).exists, errs.TREE_SCHEMA_KEY_ALREADY_EXISTS);
    assert(!this.data(typeKey).exists, errs.TREE_TYPE_KEY_ALREADY_EXISTS);

    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: this.rootCosts(name),
    });

    this.roots(rootKey).value = root;
    this.data(schemaKey).value = itob(schema);
    this.data(typeKey).value = itob(type);
  }

  /**
   * Deletes the merkle root from the root box map
   * 
   * @param name the name of the merkle tree root
   */
  deleteRoot(name: string): void {
    const truncatedAddress = extract3(this.txn.sender, 0, 16) as bytes<16>;
    
    const rootKey: RootKey = {
      address: this.txn.sender,
      name: name
    };

    const schemaKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeSchemaKey
    };

    const typeKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeTypeKey
    };

    assert(this.roots(rootKey).exists, errs.NO_NAME);

    this.roots(rootKey).delete();
    this.data(schemaKey).delete();
    this.data(typeKey).delete();

    // return their MBR
    sendPayment({
      receiver: this.txn.sender,
      amount: this.rootCosts(name),
      fee: 0,
    })
  }

  /**
   * Replaces the merkle root with another
   * 
   * @param name the name of the merkle group data
   * @param newRoot the new 32 byte merkle tree root
   */
  updateRoot(name: string, newRoot: bytes32): void {
    const key: RootKey = { address: this.txn.sender, name: name };
    assert(this.roots(key).exists, errs.NO_NAME);
    this.roots(key).value = newRoot;
  }

  /**
   * Registers a key & value in the data box map that
   * corresponds to a merkle root in the root box map
   * 
   * @param pmt the payment to cover the increased mbr of adding to box storage
   * @param name the name of the merkle tree root
   * @param key the metadata key eg. `Royalty`
   * @param value the metadata value eg. `5` encoded as a bytestring for 5%
   */
  addData(pmt: PayTxn, name: string, key: string, value: string): void {
    const rootKey: RootKey = { address: this.txn.sender, name: name };

    assert(key.length <= maxDataKeyLength, errs.KEY_TOO_LONG);
    assert(value.length <= maxDataLength, errs.DATA_TOO_LONG);
    assert(key.length < 2 || !(extract3(key, 0, 2) === reservedDataKeyPrefix), errs.RESERVED_KEY_PREFIX)
    assert(this.roots(rootKey).exists, errs.NO_ROOT_FOR_DATA);

    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: this.getBoxCreateMinBalance(48 + key.length, value.length),
    });

    const dataKey: DataKey = {
      address: extract3(this.txn.sender, 0, 16) as bytes<16>,
      name: name,
      key: key,
    };

    this.data(dataKey).value = value;
  }

  /**
   * Deletes a metadata key & value pair from the data box map
   * 
   * @param name the name of the merkle tree root
   * @param key the metadata key you want to remove
   */
  deleteData(name: string, key: string): void {
    const dataKey: DataKey = {
      address: extract3(this.txn.sender, 0, 16) as bytes<16>,
      name: name,
      key: key,
    };

    assert(this.data(dataKey).exists, errs.NO_DATA);

    let valueLength = this.data(dataKey).value.length;

    this.data(dataKey).delete();

    sendPayment({
      receiver: this.txn.sender,
      amount: this.getBoxCreateMinBalance(32 + key.length, valueLength),
      fee: 0,
    });
  }

  /**
     * verify an inclusion in a double sha256 based merkle tree
     *
     * @param address the address of the merkle tree root creator
     * @param name The name alias of the root
     * @param leaf The hashed leaf to verify
     * @param proof The merkle proof
     * @param type The type check for the lists purpose
     *
     * @returns a boolean indicating whether the proof is valid
     */
  verify(address: Address, name: string, leaf: bytes32, proof: bytes32[], type: uint64): boolean {
    const truncatedAddress = extract3(address, 0, 16) as bytes<16>;
    
    const rootKey: RootKey = {
      address: this.txn.sender,
      name: name
    };

    const schemaKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeSchemaKey
    };

    const typeKey: DataKey = {
      address: truncatedAddress,
      name: name,
      key: treeTypeKey
    };

    assert(this.roots(rootKey).exists, errs.NO_NAME);
    assert(this.data(schemaKey).exists, errs.NO_TREE_SCHEMA);
    assert(this.data(typeKey).exists, errs.NO_TREE_TYPE);

    assert(btoi(this.data(typeKey).value) === type, errs.TYPE_MISMATCH);

    let hash = leaf;
    for (let i = 0; i < proof.length; i += 1) {
      if (globals.opcodeBudget < 50) {
        increaseOpcodeBudget();
      }

      hash = this.hash(proof[i], hash)
    }

    return hash === this.roots(rootKey).value;
  }

  /**
   * Fetch a metadata properties
   * 
   * @param address the address of the merkle tree root creator
   * @param name the name of the merkle tree root
   * @param key the metadata key eg. `Royalty`
   * @returns the value set eg. `5` encoded as a bytestring for 5%
   */
  @abi.readonly
  read(address: Address, name: string, key: string): string {
    const truncatedAddress = extract3(address, 0, 16) as bytes<16>;
    return this.data({ address: truncatedAddress, name: name, key: key }).value
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
   * @param name the name of the root
   * @param leaf the leaf node to be verified
   * @param proof the proof the hash is included
   * @param key the metadata key eg. `Royalty`
   * @param type the list type that helps contracts ensure 
   * the lists purpose isn't being misused ( 0 if the caller doesnt care )
   * @returns a string of metadata
   */
  verifiedRead(
    address: Address,
    name: string,
    leaf: bytes32,
    proof: bytes32[],
    type: uint64,
    key: string,
  ): string {
    assert(this.verify(address, name, leaf, proof, type), errs.FAILED_TO_VERIFY_INCLUSION);
    return this.read(address, name, key);
  }

  addType(pmt: PayTxn, desc: string): void {
    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: 100_000_000,
    });

    assert(desc.length <= 1024, errs.DATA_TOO_LONG);

    this.types(this.typesIndex.value).value = desc;
    this.typesIndex.value = (this.typesIndex.value + 1);
  }

  addSchema(pmt: PayTxn, desc: string): void {
    verifyPayTxn(pmt, {
      receiver: this.app.address,
      amount: 100_000_000,
    });

    assert(desc.length <= 1024, errs.DATA_TOO_LONG);

    this.schemas(this.schemaIndex.value).value = desc;
    this.schemaIndex.value = (this.schemaIndex.value + 1);
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
}
