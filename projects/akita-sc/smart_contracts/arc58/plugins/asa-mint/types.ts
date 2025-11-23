import { Account, uint64 } from "@algorandfoundation/algorand-typescript";

export type CreateAssetParams = {
  assetName: string,
  unitName: string,
  total: uint64,
  decimals: uint64,
  manager: Account,
  reserve: Account,
  freeze: Account,
  clawback: Account,
  defaultFrozen: boolean,
  url: string,
}