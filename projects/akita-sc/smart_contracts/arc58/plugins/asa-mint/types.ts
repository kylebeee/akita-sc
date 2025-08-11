import { uint64 } from "@algorandfoundation/algorand-typescript";
import { Address } from "@algorandfoundation/algorand-typescript/arc4";

export type CreateAssetParams = {
  assetName: string,
  unitName: string,
  total: uint64,
  decimals: uint64,
  manager: Address,
  reserve: Address,
  freeze: Address,
  clawback: Address,
  defaultFrozen: boolean,
  url: string,
}