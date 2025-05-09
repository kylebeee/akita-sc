import { arc4, uint64 } from "@algorandfoundation/algorand-typescript"
import { Address, UintN64, UintN8 } from "@algorandfoundation/algorand-typescript/arc4"

export type Royalties = {
  creator: uint64
  marketplace: uint64
}

export class arc4Royalties extends arc4.Struct<{
  creator: UintN64
  marketplace: UintN64
}> { }

export type FloorData = {
  type: uint64
  price: uint64
  asset: uint64
  app: uint64
}

export class arc4FloorData extends arc4.Struct<{
  app: UintN64
  type: UintN8
  price: UintN64
  paymentAsset: UintN64
}> { }