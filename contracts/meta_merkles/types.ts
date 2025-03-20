import { arc4 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

export type RootKey = {
  address: Address,
  name: string
}

export class arc4RootKey extends arc4.Struct<{
  address: Address
  name: arc4.Str
}> {}

export type DataKey = {
  address: arc4.StaticBytes<16>,
  name: string,
  key: string
}

export class arc4DataKey extends arc4.Struct<{
  truncatedAddress: arc4.StaticBytes<16>
  name: arc4.Str
  key: arc4.Str
}> {}