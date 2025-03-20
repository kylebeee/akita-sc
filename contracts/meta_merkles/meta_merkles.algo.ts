import { arc4, assert, BigUint, BoxMap, Contract, ensureBudget, Global, GlobalState, gtxn, itxn, uint64 } from '@algorandfoundation/algorand-typescript';
import { EMPTY_BYTES_16, EMPTY_BYTES_32 } from '../../utils/constants';
import { arc4DataKey, arc4RootKey } from './types';
import { maxDataKeyLength, maxDataLength, MetaMerklesBoxPrefixData, MetaMerklesBoxPrefixRoots, MetaMerklesBoxPrefixSchemas, MetaMerklesBoxPrefixTypes, MetaMerklesGlobalStateKeySchemaID, MetaMerklesGlobalStateKeyTypesID, reservedDataKeyPrefix, treeSchemaKey, treeTypeKey, zeroDynamicBytes } from './constants';
import { btoi, itob, sha256, Txn } from '@algorandfoundation/algorand-typescript/op';
import { ERR_DATA_TOO_LONG, ERR_FAILED_TO_VERIFY_INCLUSION, ERR_KEY_TOO_LONG, ERR_NAME_TAKEN, ERR_NO_DATA, ERR_NO_NAME, ERR_NO_ROOT_FOR_DATA, ERR_NO_TREE_SCHEMA, ERR_NO_TREE_TYPE, ERR_RESERVED_KEY_PREFIX, ERR_TREE_SCHEMA_KEY_ALREADY_EXISTS, ERR_TREE_TYPE_KEY_ALREADY_EXISTS } from './errors';
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../../utils/errors';
import { bytes16, bytes32 } from '../../utils/types/base';
import { Address } from '@algorandfoundation/algorand-typescript/arc4';
import { Leaf, Proof } from '../../utils/types/merkles';

export class MetaMerkles extends Contract {

  // 0: Unspecified
  // 1: string
  // 2: uint64
  // 3: uint64,uint64
  // 4: address,address,uint64,uint64
  // 5: address,address,uint64,uint64,uint64
  schemaID = GlobalState<uint64>({ key: MetaMerklesGlobalStateKeySchemaID })

  // 0: Unspecified
  // 1: Collection
  // 2: Trait
  // 3: Trade
  typesID = GlobalState<uint64>({ key: MetaMerklesGlobalStateKeyTypesID })


  schemas = BoxMap<arc4.UintN64, arc4.Str>({ keyPrefix: MetaMerklesBoxPrefixSchemas })
  types = BoxMap<arc4.UintN64, arc4.Str>({ keyPrefix: MetaMerklesBoxPrefixTypes })
  // the max size of all args to a contract is 2048
  // which means accounting for box key & leaf
  // and a byte length of 66 for each proof in the
  // array, max we can verify is 30, plenty.
  // max_mbr: (400 * (64 + 32)) = 38_400: + 2_500 = 40_900
  roots = BoxMap<arc4RootKey, arc4.StaticBytes<32>>({ keyPrefix: MetaMerklesBoxPrefixRoots })

  // rootData is the box map for managing the data
  // associated with a group
  // max_schema_mbr: (400 * (32 + 8 + 8)) = 19_200 + 2_500 = 21_700
  // max_type_mbr: (400 * (32 + 6 + 8)) = 18_400 + 2_500 = 20_900
  data = BoxMap<arc4DataKey, arc4.Str>({ keyPrefix: MetaMerklesBoxPrefixData })

  private getRootBoxDelta(name: arc4.Str): uint64 {
    const pre = Global.minBalance
    const address = new Address(Global.zeroAddress)
    const rKey = new arc4RootKey({ address, name })
    this.roots(rKey).value = new arc4.StaticBytes<32>(EMPTY_BYTES_32)
    const delta = Global.minBalance - pre
    this.roots(rKey).delete()
    return delta
  }

  private getDataBoxDelta(name: arc4.Str, key: arc4.Str, value: arc4.Str): uint64 {
    const pre = Global.minBalance
    const truncatedAddress = bytes16(EMPTY_BYTES_16)
    const dKey = new arc4DataKey({ truncatedAddress, name, key })
    this.data(dKey).value = value
    const delta = Global.minBalance - pre
    this.data(dKey).delete()
    return delta
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  rootCosts(name: arc4.Str): uint64 {
    const rootCost = this.getRootBoxDelta(name)
    const schemaCost = this.getDataBoxDelta(name, treeSchemaKey, zeroDynamicBytes)
    const typeCost = this.getDataBoxDelta(name, treeTypeKey, zeroDynamicBytes)
    return rootCost + schemaCost + typeCost
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
  addRoot(payment: gtxn.PaymentTxn, name: arc4.Str, root: arc4.StaticBytes<32>, schema: arc4.UintN64, type: arc4.UintN64): void {
    assert(name.bytes.length <= 31, 'Cannot add root with name longer than 31 bytes');
    assert(this.schemas(schema).exists, ERR_NO_TREE_SCHEMA)
    assert(this.types(type).exists, ERR_NO_TREE_TYPE)

    const address = new Address(Txn.sender)
    const truncatedAddress = bytes16(Txn.sender.bytes.slice(0, 16))

    const rootKey = new arc4RootKey({ address, name })
    const schemaKey = new arc4DataKey({ truncatedAddress, name, key: treeSchemaKey })
    const typeKey = new arc4DataKey({ truncatedAddress, name, key: treeTypeKey })

    assert(!this.roots(rootKey).exists, ERR_NAME_TAKEN)
    assert(!this.data(schemaKey).exists, ERR_TREE_SCHEMA_KEY_ALREADY_EXISTS)
    assert(!this.data(typeKey).exists, ERR_TREE_TYPE_KEY_ALREADY_EXISTS)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === this.rootCosts(name), 'Payment amount does not match root costs')

    this.roots(rootKey).value = root
    this.data(schemaKey).value = new arc4.Str(String(itob(schema.native)))
    this.data(typeKey).value = new arc4.Str(String(itob(type.native)))
  }

  /**
   * Deletes the merkle root from the root box map
   * 
   * @param name the name of the merkle tree root
   */
  deleteRoot(name: arc4.Str): void {
    const arc4Sender = new Address(Txn.sender)
    const truncatedAddress = bytes16(Txn.sender.bytes.slice(0, 16))

    const rootKey = new arc4RootKey({ address: arc4Sender, name })
    const schemaKey = new arc4DataKey({ truncatedAddress, name, key: treeSchemaKey })
    const typeKey = new arc4DataKey({ truncatedAddress, name, key: treeTypeKey })

    assert(this.roots(rootKey).exists, ERR_NO_NAME)

    this.roots(rootKey).delete()
    this.data(schemaKey).delete()
    this.data(typeKey).delete()

    // return their MBR
    itxn
      .payment({
        receiver: Txn.sender,
        amount: this.rootCosts(name),
        fee: 0,
      })
      .submit()
  }

  /**
   * Replaces the merkle root with another
   * 
   * @param name the name of the merkle group data
   * @param newRoot the new 32 byte merkle tree root
   */
  updateRoot(name: arc4.Str, newRoot: arc4.StaticBytes<32>): void {
    const address = new Address(Txn.sender)
    const key = new arc4RootKey({ address, name })
    assert(this.roots(key).exists, ERR_NO_NAME)
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
  addData(payment: gtxn.PaymentTxn, name: arc4.Str, key: arc4.Str, value: arc4.Str): void {
    const address = new Address(Txn.sender)
    const rootKey = new arc4RootKey({ address, name })

    assert(key.bytes.length <= maxDataKeyLength, ERR_KEY_TOO_LONG)
    assert(value.bytes.length <= maxDataLength, ERR_DATA_TOO_LONG)
    assert(key.bytes.length < 2 || !(key.bytes.slice(0, 2) === reservedDataKeyPrefix.bytes), ERR_RESERVED_KEY_PREFIX)
    assert(this.roots(rootKey).exists, ERR_NO_ROOT_FOR_DATA)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === this.getBoxCreateMinBalance(48 + key.bytes.length, value.bytes.length), ERR_INVALID_PAYMENT_AMOUNT)

    const truncatedAddress = bytes16(Txn.sender.bytes.slice(0, 16))
    const dataKey = new arc4DataKey({ truncatedAddress, name, key })

    this.data(dataKey).value = value;
  }

  /**
   * Deletes a metadata key & value pair from the data box map
   * 
   * @param name the name of the merkle tree root
   * @param key the metadata key you want to remove
   */
  deleteData(name: arc4.Str, key: arc4.Str): void {
    const truncatedAddress = bytes16(Txn.sender.bytes.slice(0, 16))
    const dataKey = new arc4DataKey({ truncatedAddress, name, key })

    assert(this.data(dataKey).exists, ERR_NO_DATA)

    let valueLength = this.data(dataKey).value.bytes.length

    this.data(dataKey).delete()

    itxn
      .payment({
        receiver: Txn.sender,
        amount: this.getBoxCreateMinBalance(32 + key.bytes.length, valueLength),
        fee: 0,
      })
      .submit()
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
  verify(address: Address, name: arc4.Str, leaf: Leaf, proof: Proof, type: uint64): boolean {
    const arc4Sender = new Address(Txn.sender)
    const truncatedAddress = bytes16(address.bytes.slice(0, 16))

    const rootKey = new arc4RootKey({ address: arc4Sender, name })
    const schemaKey = new arc4DataKey({ truncatedAddress, name, key: treeSchemaKey })
    const typeKey = new arc4DataKey({ truncatedAddress, name, key: treeTypeKey })

    if (
      !this.roots(rootKey).exists
      || !this.data(schemaKey).exists
      || !this.data(typeKey).exists
      || btoi(this.data(typeKey).value.bytes) !== type
    ) {
      return false
    }

    ensureBudget(proof.length * 50)

    let hash = leaf
    for (let i = 0; i < proof.length; i += 1) {
      hash = this.hash(proof[i], hash)
    }

    return hash === this.roots(rootKey).value
  }

  /**
   * Fetch a metadata properties
   * 
   * @param address the address of the merkle tree root creator
   * @param name the name of the merkle tree root
   * @param key the metadata key eg. `Royalty`
   * @returns the value set eg. `5` encoded as a bytestring for 5%
   */
  // @ts-ignore
  @abimethod({ readonly: true })
  read(address: Address, name: arc4.Str, key: arc4.Str): arc4.Str {
    const truncatedAddress = bytes16(address.bytes.slice(0, 16))
    return this.data(new arc4DataKey({ truncatedAddress, name, key })).value
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
    name: arc4.Str,
    leaf: Leaf,
    proof: Proof,
    type: uint64,
    key: arc4.Str,
  ): arc4.Str {
    const verified = this.verify(address, name, leaf, proof, type);
    if (!verified) {
      return new arc4.Str('')
    }
    return this.read(address, name, key)
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
  verifiedMustRead(
    address: Address,
    name: arc4.Str,
    leaf: Leaf,
    proof: Proof,
    type: uint64,
    key: arc4.Str,
  ): arc4.Str {
    assert(this.verify(address, name, leaf, proof, type), ERR_FAILED_TO_VERIFY_INCLUSION)
    return this.read(address, name, key)
  }

  addType(payment: gtxn.PaymentTxn, desc: arc4.Str): void {
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === 100_000_000, ERR_INVALID_PAYMENT_AMOUNT)

    assert(desc.bytes.length <= 1024, ERR_DATA_TOO_LONG)

    this.types(new arc4.UintN64(this.typesID.value)).value = desc;
    this.typesID.value += 1
  }

  addSchema(payment: gtxn.PaymentTxn, desc: arc4.Str): void {
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === 100_000_000, ERR_INVALID_PAYMENT_AMOUNT)

    assert(desc.bytes.length <= 1024, ERR_DATA_TOO_LONG)

    this.schemas(new arc4.UintN64(this.schemaID.value)).value = desc
    this.schemaID.value += 1
  }

  private hash(a: Leaf, b: Leaf): Leaf {
    if (BigUint(a.native) > BigUint(b.native)) {
      return bytes32(sha256(b.native.concat(a.native)))
    } else {
      return bytes32(sha256(a.native.concat(b.native)))
    }
  }

  private getBoxCreateMinBalance(a: uint64, b: uint64): uint64 {
    return 2_500 + (400 * (a + b))
  }
}
