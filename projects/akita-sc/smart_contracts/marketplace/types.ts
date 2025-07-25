import { uint64 } from "@algorandfoundation/algorand-typescript"

export type Royalties = {
  creator: uint64
  marketplace: uint64
}