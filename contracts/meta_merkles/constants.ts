import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { SchemaPart } from './types'

import { UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

export const MetaMerklesGlobalStateKeyTypesID = 'types_id'

export const MetaMerklesBoxPrefixTypes = 't'
export const MetaMerklesBoxPrefixRoots = 'r'
export const MetaMerklesBoxPrefixData = 'd'

export const maxDataKeyLength: uint64 = 15
export const maxDataLength: uint64 = 1024

export const reservedDataKeyPrefix = new arc4.Str('l.')
export const treeTypeKey = new arc4.Str('l.type')

export const SchemaPartUint8: SchemaPart = new UintN8(0)
export const SchemaPartUint16: SchemaPart = new UintN8(1)
export const SchemaPartUint32: SchemaPart = new UintN8(2)
export const SchemaPartUint64: SchemaPart = new UintN8(3)
export const SchemaPartUint128: SchemaPart = new UintN8(4)
export const SchemaPartUint256: SchemaPart = new UintN8(5)
export const SchemaPartUint512: SchemaPart = new UintN8(6)
export const SchemaPartBytes4: SchemaPart = new UintN8(7)
export const SchemaPartBytes8: SchemaPart = new UintN8(8)
export const SchemaPartBytes16: SchemaPart = new UintN8(9)
export const SchemaPartBytes32: SchemaPart = new UintN8(10)
export const SchemaPartBytes64: SchemaPart = new UintN8(11)
export const SchemaPartBytes128: SchemaPart = new UintN8(12)
export const SchemaPartBytes256: SchemaPart = new UintN8(13)
export const SchemaPartBytes512: SchemaPart = new UintN8(14)
export const SchemaPartString: SchemaPart = new UintN8(15)
export const SchemaPartAddress: SchemaPart = new UintN8(16)

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

// export const MAX_ROOT_BOX_MBR: uint64 = 40_900
// export const MAX_TYPE_BOX_MBR: uint64 = 20_900

export const MERKLE_TREE_TYPE_ASSET: uint64 = 1
export const MERKLE_TREE_TYPE_ADDRESS: uint64 = 2
