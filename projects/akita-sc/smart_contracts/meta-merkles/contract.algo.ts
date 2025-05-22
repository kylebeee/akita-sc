import {
  Application,
  arc4,
  assert,
  assertMatch,
  BigUint,
  BoxMap,
  bytes,
  Bytes,
  Contract,
  ensureBudget,
  Global,
  GlobalState,
  gtxn,
  itxn,
  TemplateVar,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { btoi, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { abimethod, Address } from '@algorandfoundation/algorand-typescript/arc4'
import { DataKey, MetaMerklesMBRData, RootKey, SchemaList, TypesValue } from './types'
import {
  maxDataKeyLength,
  maxDataLength,
  MerkleTreeTypeUnspecified,
  MetaMerklesBoxPrefixData,
  MetaMerklesBoxPrefixRoots,
  MetaMerklesBoxPrefixTypes,
  MetaMerklesGlobalStateKeyTypesID,
  reservedDataKeyPrefix,
  SchemaPartAddress,
  SchemaPartAddressString,
  SchemaPartBytes128,
  SchemaPartBytes128String,
  SchemaPartBytes16,
  SchemaPartBytes16String,
  SchemaPartBytes256,
  SchemaPartBytes256String,
  SchemaPartBytes32,
  SchemaPartBytes32String,
  SchemaPartBytes4,
  SchemaPartBytes4String,
  SchemaPartBytes512,
  SchemaPartBytes512String,
  SchemaPartBytes64,
  SchemaPartBytes64String,
  SchemaPartBytes8,
  SchemaPartBytes8String,
  SchemaPartString,
  SchemaPartStringString,
  SchemaPartUint128,
  SchemaPartUint128String,
  SchemaPartUint16,
  SchemaPartUint16String,
  SchemaPartUint256,
  SchemaPartUint256String,
  SchemaPartUint32,
  SchemaPartUint32String,
  SchemaPartUint512,
  SchemaPartUint512String,
  SchemaPartUint64,
  SchemaPartUint64String,
  SchemaPartUint8,
  SchemaPartUint8String,
  treeTypeKey,
} from './constants'
import {
  ERR_DATA_TOO_LONG,
  ERR_FAILED_TO_VERIFY_INCLUSION,
  ERR_KEY_TOO_LONG,
  ERR_NAME_TAKEN,
  ERR_NO_DATA,
  ERR_NO_NAME,
  ERR_NO_ROOT_FOR_DATA,
  ERR_NO_TREE_TYPE,
  ERR_RESERVED_KEY_PREFIX,
  ERR_TREE_TYPE_KEY_ALREADY_EXISTS,
} from './errors'
import { ERR_INVALID_PAYMENT, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../utils/errors'
import { bytes16, str } from '../utils/types/base'
import { Leaf, MetaMerklesInterface, Proof } from '../utils/types/merkles'
import { fee } from '../utils/constants'
import { getOrigin } from '../utils/functions'

const spendingAccountFactoryApp = TemplateVar<Application>('SPENDING_ACCOUNT_FACTORY_APP')

export class MetaMerkles extends Contract implements MetaMerklesInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  // 0: Unspecified
  // 1: Collection
  // 2: Trait
  // 3: Trade
  typesID = GlobalState<uint64>({ key: MetaMerklesGlobalStateKeyTypesID })

  // BOXES ----------------------------------------------------------------------------------------

  /** the types (intents) of merkle trees that exist */
  types = BoxMap<uint64, TypesValue>({ keyPrefix: MetaMerklesBoxPrefixTypes })
  /** the merkle roots we want to attach data to */
  roots = BoxMap<RootKey, bytes<32>>({ keyPrefix: MetaMerklesBoxPrefixRoots })
  /** rootData is the box map for managing the data associated with a group */
  data = BoxMap<DataKey, string>({ keyPrefix: MetaMerklesBoxPrefixData })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  /** the type of merkle tree we want to attach data to */
  private mbr(
    typeDescription: string,
    schema: string,
    rootName: string,
    dataKey: string,
    dataValue: string
  ): MetaMerklesMBRData {
    return {
      types: 6_100 + (400 * Bytes(typeDescription).length + Bytes(schema).length),
      roots: 28_500 + (400 * Bytes(rootName).length),
      data: 9_300 + (400 * (Bytes(rootName).length + Bytes(dataKey).length + Bytes(dataValue).length)),
    }
  }

  private newTypesID(): uint64 {
    const id = this.typesID.value
    this.typesID.value += 1
    return id
  }

  private hash(a: Leaf, b: Leaf): Leaf {
    if (BigUint(a) > BigUint(b)) {
      return sha256(b.concat(a))
    }
    return sha256(a.concat(b))
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(): void {
    this.typesID.value = 0
  }

  // META MERKLE METHODS --------------------------------------------------------------------------

  /**
   * Creates two boxes and adds a merkle root
   * using a `RootKey` to the root box map and also a list type to the
   * metadata attached to the root in the data box map
   *
   * @param pmt the fee to cover box storage allocation
   * @param name the name alias of the root being added
   * @param root a merkle tree root
   * @param type an index of the tree type enum from box storage
   */
  addRoot(
    payment: gtxn.PaymentTxn,
    name: string,
    root: bytes<32>,
    type: uint64
  ): void {
    assert(Bytes(name).length <= 31, 'Cannot add root with name longer than 31 bytes')
    assert(this.types(type).exists, ERR_NO_TREE_TYPE)

    const origin = getOrigin(spendingAccountFactoryApp.id)
    const truncatedAddress = bytes16(origin.bytes)

    const rootKey: RootKey = { address: new Address(origin), name }
    const typeKey: DataKey = { address: truncatedAddress, name, key: treeTypeKey }

    assert(!this.roots(rootKey).exists, ERR_NAME_TAKEN)
    assert(!this.data(typeKey).exists, ERR_TREE_TYPE_KEY_ALREADY_EXISTS)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.rootCosts(name),
      },
      ERR_INVALID_PAYMENT
    )

    this.roots(rootKey).value = root
    this.data(typeKey).value = String(itob(type))
  }

  /**
   * Deletes the merkle root from the root box map
   *
   * @param name the name of the merkle tree root
   */
  deleteRoot(name: string): void {
    const origin = getOrigin(spendingAccountFactoryApp.id)
    const truncatedAddress = bytes16(origin.bytes)

    const rootKey: RootKey = { address: new Address(origin), name }
    const typeKey: DataKey = { address: truncatedAddress, name, key: treeTypeKey }

    assert(this.roots(rootKey).exists, ERR_NO_NAME)

    this.roots(rootKey).delete()
    this.data(typeKey).delete()

    // return their MBR
    itxn.payment({
      receiver: origin,
      amount: this.rootCosts(name),
      fee,
    }).submit()
  }

  /**
   * Replaces the merkle root with another
   *
   * @param name the name of the merkle group data
   * @param newRoot the new 32 byte merkle tree root
   */
  updateRoot(name: string, newRoot: bytes<32>): void {
    const origin = getOrigin(spendingAccountFactoryApp.id)
    const key: RootKey = { address: new Address(origin), name }
    assert(this.roots(key).exists, ERR_NO_NAME)
    this.roots(key).value = newRoot
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
  addData(payment: gtxn.PaymentTxn, name: string, key: string, value: string): void {
    const origin = getOrigin(spendingAccountFactoryApp.id)
    const rootKey: RootKey = { address: new Address(origin), name }

    const keyBytes = Bytes(key)
    assert(keyBytes.length <= maxDataKeyLength, ERR_KEY_TOO_LONG)
    assert(Bytes(value).length <= maxDataLength, ERR_DATA_TOO_LONG)
    assert(
      keyBytes.length < 2 || !(keyBytes.slice(0, 2) === Bytes(reservedDataKeyPrefix)),
      ERR_RESERVED_KEY_PREFIX
    )
    assert(this.roots(rootKey).exists, ERR_NO_ROOT_FOR_DATA)

    const costs = this.mbr('', '', name, key, value)

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: costs.data,
      },
      ERR_INVALID_PAYMENT
    )

    const truncatedAddress = bytes16(origin.bytes)
    const dataKey: DataKey = { address: truncatedAddress, name, key }

    this.data(dataKey).value = value
  }

  /**
   * Deletes a metadata key & value pair from the data box map
   *
   * @param name the name of the merkle tree root
   * @param key the metadata key you want to remove
   */
  deleteData(name: string, key: string): void {
    const origin = getOrigin(spendingAccountFactoryApp.id)
    const truncatedAddress = bytes16(origin.bytes)
    const dataKey: DataKey = { address: truncatedAddress, name, key }

    assert(this.data(dataKey).exists, ERR_NO_DATA)

    this.data(dataKey).delete()

    const costs = this.mbr('', '', name, key, this.data(dataKey).value)

    itxn
      .payment({
        receiver: origin,
        amount: costs.data,
        fee,
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
  verify(address: Address, name: string, leaf: Leaf, proof: Proof, type: uint64): boolean {
    const truncatedAddress = bytes16(address.bytes)

    const rootKey: RootKey = { address, name }
    const typeKey: DataKey = { address: truncatedAddress, name, key: treeTypeKey }

    if (!this.roots(rootKey).exists || !this.data(typeKey).exists) {
      return false
    }

    const treeType = btoi(Bytes(this.data(typeKey).value))
    if (type !== MerkleTreeTypeUnspecified && treeType !== type) {
      return false
    }

    ensureBudget(proof.length * 50)

    let hash = leaf
    for (let i: uint64 = 0; i < proof.length; i += 1) {
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
  @abimethod({ readonly: true })
  read(address: Address, name: string, key: string): string {
    const truncatedAddress = bytes16(address.bytes)
    return this.data({ address: truncatedAddress, name, key }).value
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
  verifiedRead(address: Address, name: string, leaf: Leaf, proof: Proof, type: uint64, key: string): string {
    const verified = this.verify(address, name, leaf, proof, type)
    if (!verified) {
      return ''
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
    name: string,
    leaf: Leaf,
    proof: Proof,
    type: uint64,
    key: string
  ): string {
    assert(this.verify(address, name, leaf, proof, type), ERR_FAILED_TO_VERIFY_INCLUSION)
    return this.read(address, name, key)
  }

  addType(payment: gtxn.PaymentTxn, description: string, schemaList: SchemaList): void {
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === 100_000_000, ERR_INVALID_PAYMENT_AMOUNT)
    assert(Bytes(description).length <= 800, ERR_DATA_TOO_LONG)

    let schema: string = ''
    for (let i: uint64 = 0; i < schemaList.length; i += 1) {
      switch (schemaList[i]) {
        case SchemaPartUint8:
          schema += SchemaPartUint8String
          break
        case SchemaPartUint16:
          schema += SchemaPartUint16String
          break
        case SchemaPartUint32:
          schema += SchemaPartUint32String
          break
        case SchemaPartUint64:
          schema += SchemaPartUint64String
          break
        case SchemaPartUint128:
          schema += SchemaPartUint128String
          break
        case SchemaPartUint256:
          schema += SchemaPartUint256String
          break
        case SchemaPartUint512:
          schema += SchemaPartUint512String
          break
        case SchemaPartBytes4:
          schema += SchemaPartBytes4String
          break
        case SchemaPartBytes8:
          schema += SchemaPartBytes8String
          break
        case SchemaPartBytes16:
          schema += SchemaPartBytes16String
          break
        case SchemaPartBytes32:
          schema += SchemaPartBytes32String
          break
        case SchemaPartBytes64:
          schema += SchemaPartBytes64String
          break
        case SchemaPartBytes128:
          schema += SchemaPartBytes128String
          break
        case SchemaPartBytes256:
          schema += SchemaPartBytes256String
          break
        case SchemaPartBytes512:
          schema += SchemaPartBytes512String
          break
        case SchemaPartString:
          schema += SchemaPartStringString
          break
        case SchemaPartAddress:
          schema += SchemaPartAddressString
          break
      }

      if (schemaList.length > 0 && i !== schemaList.length - 1) {
        schema += ','
      }
    }

    const id = this.newTypesID()

    this.types(id).value = {
      description: description,
      schema,
    }
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  rootCosts(name: string): uint64 {
    const costs = this.mbr('', '', name, treeTypeKey, String(itob(0)))
    return costs.roots + costs.data
  }

  @abimethod({ readonly: true })
  dataCosts(name: arc4.Str, key: arc4.Str, value: arc4.Str): uint64 {
    const costs = this.mbr('', '', name.native, key.native, value.native)
    return costs.data
  }
}
