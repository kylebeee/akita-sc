import { Account, Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { HyperSwapMBRData } from "./types";
import { AkitaBaseContract } from "../utils/base-contracts/base";

export class BaseHyperSwap extends AkitaBaseContract {
  protected mbr(): HyperSwapMBRData {
    return {
      offers: 50_900,
      participants: 34_900,
      hashes: 34_900,
      mm: {
        root: 40_900,
        data: 27_300,
      }
    }
  }

  protected getOfferFee(address: Account): uint64 {
    const impact = this.getUserImpact(address)
    const { HyperSwapImpactTaxMin, HyperSwapImpactTaxMax } = this.getSwapFees()
    return this.impactRange(impact, HyperSwapImpactTaxMin, HyperSwapImpactTaxMax)
  }
} 