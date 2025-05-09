import { Asset, Bytes, Contract, uint64 } from "@algorandfoundation/algorand-typescript";
import { Proof } from "../types/merkles";
import { abiCall, Address } from "@algorandfoundation/algorand-typescript/arc4";
import { MetaMerkles } from "../../meta-merkles/contract.algo";
import { AkitaBaseContract } from "./base";
import { bytes32 } from "../types/base";
import { btoi, itob, sha256 } from "@algorandfoundation/algorand-typescript/op";
import { CreatorRoyaltyDefault, CreatorRoyaltyMaximumBundle, CreatorRoyaltyMaximumSingle } from "../constants";

export class Royalties extends AkitaBaseContract {
  royalties(bundle: boolean, asset: Asset, name: string, proof: Proof): uint64 {
    let creatorRoyalty = 0

    if (!(proof.length > 0)) {
      if (bundle) {
        return 0
      }
      return CreatorRoyaltyDefault
    }

    // fetch the royalty set for the asset being sold
    const creatorRoyaltyString = abiCall(
      MetaMerkles.prototype.verifiedRead,
      {
        appId: super.getAkitaAppList().metaMerkles,
        args: [
          new Address(asset.creator),
          name,
          bytes32(sha256(sha256(itob(asset.id)))),
          proof,
          1,
          'royalty',
        ],
        fee: 0,
      }
    ).returnValue

    if (creatorRoyaltyString.length > 0) {
      creatorRoyalty = btoi(Bytes(creatorRoyaltyString))
    }

    if (!bundle && creatorRoyalty > CreatorRoyaltyMaximumSingle) {
      return CreatorRoyaltyMaximumSingle
    }

    if (bundle && creatorRoyalty > CreatorRoyaltyMaximumBundle) {
      return CreatorRoyaltyMaximumSingle
    }
    
    return creatorRoyalty
  }
}