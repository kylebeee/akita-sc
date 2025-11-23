import { Account, uint64 } from "@algorandfoundation/algorand-typescript"

export type PayParams = {
  receiver: Account
  asset: uint64
  amount: uint64
}