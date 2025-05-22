import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { SchemaPart } from './types'

import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export const MetaMerklesGlobalStateKeyTypesID = 'types_id'

export const MetaMerklesBoxPrefixTypes = 't'
export const MetaMerklesBoxPrefixRoots = 'r'
export const MetaMerklesBoxPrefixData = 'd'

export const maxDataKeyLength: uint64 = 15
export const maxDataLength: uint64 = 1024

export const reservedDataKeyPrefix: string = 'l.'
export const treeTypeKey: string = 'l.type'

export const SchemaPartUint8: SchemaPart = new UintN8(10)
export const SchemaPartUint16: SchemaPart = new UintN8(11)
export const SchemaPartUint32: SchemaPart = new UintN8(12)
export const SchemaPartUint64: SchemaPart = new UintN8(13)
export const SchemaPartUint128: SchemaPart = new UintN8(14)
export const SchemaPartUint256: SchemaPart = new UintN8(15)
export const SchemaPartUint512: SchemaPart = new UintN8(16)
export const SchemaPartBytes4: SchemaPart = new UintN8(20)
export const SchemaPartBytes8: SchemaPart = new UintN8(21)
export const SchemaPartBytes16: SchemaPart = new UintN8(22)
export const SchemaPartBytes32: SchemaPart = new UintN8(23)
export const SchemaPartBytes64: SchemaPart = new UintN8(24)
export const SchemaPartBytes128: SchemaPart = new UintN8(25)
export const SchemaPartBytes256: SchemaPart = new UintN8(26)
export const SchemaPartBytes512: SchemaPart = new UintN8(27)
export const SchemaPartString: SchemaPart = new UintN8(30)
export const SchemaPartAddress: SchemaPart = new UintN8(40)

export const SchemaPartUint8String: string = 'uint8'
export const SchemaPartUint16String: string = 'uint16'
export const SchemaPartUint32String: string = 'uint32'
export const SchemaPartUint64String: string = 'uint64'
export const SchemaPartUint128String: string = 'uint128'
export const SchemaPartUint256String: string = 'uint256'
export const SchemaPartUint512String: string = 'uint512'
export const SchemaPartBytes4String: string = 'bytes4'
export const SchemaPartBytes8String: string = 'bytes8'
export const SchemaPartBytes16String: string = 'bytes16'
export const SchemaPartBytes32String: string = 'bytes32'
export const SchemaPartBytes64String: string = 'bytes64'
export const SchemaPartBytes128String: string = 'bytes128'
export const SchemaPartBytes256String: string = 'bytes256'
export const SchemaPartBytes512String: string = 'bytes512'
export const SchemaPartStringString: string = 'string'
export const SchemaPartAddressString: string = 'address'

export const MerkleTreeTypeUnspecified: uint64 = 0 // Unspecified
export const MerkleTreeTypeCollection: uint64 = 1 // Collection: uint64
export const MerkleTreeTypeTrait: uint64 = 2 // Trait: uint64
export const MerkleTreeTypeTrade: uint64 = 3 // Trade: address,address,uint64,uint64
export const MerkleTreeTypeWhitelist: uint64 = 4 // Whitelist: address
export const MerkleTreeTypeAddresses: uint64 = 5 // Addresses: address