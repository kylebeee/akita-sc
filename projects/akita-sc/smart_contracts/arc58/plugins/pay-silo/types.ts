import { uint64 } from "@algorandfoundation/algorand-typescript"

export type PaySiloParams = {
  asset: uint64
  amount: uint64
}