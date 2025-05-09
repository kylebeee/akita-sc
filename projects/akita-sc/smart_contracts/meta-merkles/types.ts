import { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export type TypesValue = {
    description: string
    schema: string
}

export type SchemaList = arc4.DynamicArray<arc4.UintN8>

export type SchemaPart = arc4.UintN8

export class arc4TypesValue extends arc4.Struct<{
    description: arc4.Str
    // string
    // uint64
    // uint64,uint64
    // address,address,uint64,uint64
    // address,address,uint64,uint64,uint64
    schema: arc4.Str
}> {}

export type RootKey = {
    address: Address
    name: string
}

export class arc4RootKey extends arc4.Struct<{
    address: Address
    name: arc4.Str
}> {}

export type DataKey = {
    address: arc4.StaticBytes<16>
    name: string
    key: string
}

export class arc4DataKey extends arc4.Struct<{
    truncatedAddress: arc4.StaticBytes<16>
    name: arc4.Str
    key: arc4.Str
}> {}

export type MetaMerklesMBRData = {
    types: uint64
    roots: uint64
    data: uint64
}