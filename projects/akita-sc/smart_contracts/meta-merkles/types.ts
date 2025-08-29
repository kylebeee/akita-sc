import { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export type TypesValue = {
  // string
  // uint64
  // uint64,uint64
  // address,address,uint64,uint64
  // address,address,uint64,uint64,uint64
  schema: string
  description: string
}

export type SchemaList = SchemaPart[]
export type SchemaPart = Uint8

export type RootKey = {
  address: Address
  name: string
}

export type DataKey = {
  address: bytes<16>
  name: string
  key: string
}

export type MetaMerklesMBRData = {
  types: uint64
  roots: uint64
  data: uint64
}