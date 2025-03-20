import { arc4, uint64 } from "@algorandfoundation/algorand-typescript";
import { itob } from "@algorandfoundation/algorand-typescript/op";

export const MetaMerklesGlobalStateKeySchemaID = 'schema_id'
export const MetaMerklesGlobalStateKeyTypesID = 'types_id'

export const MetaMerklesBoxPrefixSchemas = 's'
export const MetaMerklesBoxPrefixTypes = 't'
export const MetaMerklesBoxPrefixRoots = 'r'
export const MetaMerklesBoxPrefixData = 'd'

export const maxDataKeyLength: uint64 = 15
export const maxDataLength: uint64 = 1024

export const reservedDataKeyPrefix = new arc4.Str('l.')
export const treeSchemaKey = new arc4.Str('l.schema')
export const treeTypeKey = new arc4.Str('l.type')

export const zeroDynamicBytes = new arc4.Str(String(itob(0)))

export const MAX_ROOT_BOX_MBR: uint64 = 40_900
export const MAX_SCHEMA_BOX_MBR: uint64 = 21_700
export const MAX_TYPE_BOX_MBR: uint64 = 20_900