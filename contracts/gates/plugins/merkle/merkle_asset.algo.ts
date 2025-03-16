import { assert, BoxMap, bytes, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { arc4MerkleAssetGateCheckParams, arc4MerkleAssetRegistryInfo } from "./types";
import { decodeArc4, interpretAsArc4, methodSelector } from "@algorandfoundation/algorand-typescript/arc4";
import { ERR_INVALID_ARG_COUNT } from "../../errors";
import { AssetHolding, itob, sha256 } from "@algorandfoundation/algorand-typescript/op";
import { MERKLE_TREE_TYPE_ASSET } from "./constants";
import { MetaMerkles } from "../../../meta_merkles/meta_merkles.algo";

export class MerkleAssetGate extends AkitaBaseContract {
  programVersion = 10;

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor });

  registry = BoxMap<uint64, arc4MerkleAssetRegistryInfo>({ keyPrefix: '' });

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  register(args: bytes): uint64 {
    // arc4MerkleAssetRegistryInfo contains a dynamic string
    // so we need to check that the length of the arguments is at least the length of the static part
    // of the struct plus 1 byte (the smallest length of a string)
    assert(args.length > (arc4MerkleAssetRegistryInfo.length + 1), ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4MerkleAssetRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    // arc4MerkleAssetGateCheckParams contains a dynamic array of proofs
    // so we need to check that the length of the arguments is at least the length of the static part
    // of the struct plus 64 bytes (the smallest length of a single proof)
    assert(args.length >= (arc4MerkleAssetGateCheckParams.length + 64), ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4MerkleAssetGateCheckParams>(args)

    const [holdings, optedIn] = AssetHolding.assetBalance(params.user.native, params.asset.native)
    if (!optedIn || holdings === 0) {
      return false
    }

    const registryInfo = this.registry(params.registryID.native).value

    // TODO: replace with itxn.abiCall when available
    const verifyTxn = itxn
      .applicationCall({
        appId: super.getAppList().metaMerkles,
        appArgs: [
          methodSelector(MetaMerkles.prototype.verify),
          registryInfo.creator,
          registryInfo.name,
          sha256(sha256(itob(params.asset.native))),
          params.proof,
          MERKLE_TREE_TYPE_ASSET,
        ]
      })
      .submit()

    return decodeArc4<boolean>(verifyTxn.lastLog)
  }
}