import { Account, uint64 } from "@algorandfoundation/algorand-typescript"

export type FunderInfo = {
  account: Account
  amount: uint64
}

export type RefundValue = {
  amount: uint64
  payor: Account
}