import { arc4, assert, BoxMap, Bytes, bytes, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../../../utils/base_contracts/base.algo";
import { GateGlobalStateKeyRegistryCursor } from "../../constants";
import { arc4NFDRootGateCheckParams, arc4NFDRootRegistryInfo, NFDRootGateCheckParams } from "./types";
import { Address, decodeArc4, interpretAsArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { ERR_INVALID_ARG_COUNT } from "../../errors";
import { itob } from "@algorandfoundation/algorand-typescript/op";
import { NFD_NAME_KEY, NFD_PARENT_APP_KEY, NFD_READ_PROPERTY_ARG, NFD_VALID_APP_ARG, NFD_VERIFIED_ADDRESSES_PROPERTY_NAME } from "./constants";

export class NFDGate extends AkitaBaseContract {

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  registry = BoxMap<uint64, arc4NFDRootRegistryInfo>({ keyPrefix: '' })

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private nfdGate(user: Address, NFD: uint64, root: bytes): boolean {
    const [nfdName] = op.AppGlobal.getExBytes(NFD, Bytes(NFD_NAME_KEY))
    const [_, parentExists] = op.AppGlobal.getExBytes(NFD, Bytes(NFD_PARENT_APP_KEY))

    if (
      parentExists
      && root !== nfdName.slice(nfdName.length - (root.length + 5), (nfdName.length - 5))
    ) {
      return false
    }

    // TODO: replace with itxn.abiCall when available
    const verifyTxn = itxn
      .applicationCall({
        appId: super.getAppList().nfdRegistry,
        appArgs: [
          NFD_VALID_APP_ARG,
          nfdName,
          itob(NFD),
        ],
        apps: [NFD],
        fee: 0
      })
      .submit()

    const verified = decodeArc4<boolean>(verifyTxn.lastLog)

    if (!verified) {
      return false
    }

    // TODO: replace with itxn.abiCall when available
    const vaddressesTxn = itxn
      .applicationCall({
        appId: NFD,
        appArgs: [
          NFD_READ_PROPERTY_ARG,
          NFD_VERIFIED_ADDRESSES_PROPERTY_NAME
        ],
        fee: 0
      })
      .submit()

    const caAlgoData = vaddressesTxn.lastLog

    let exists: boolean = false
    for (let i: uint64 = 0; i < caAlgoData.length; i += 32) {
      const addr = caAlgoData.slice(i, 32)
      if (addr === user.bytes) {
        exists = true
      }
    }

    return exists
  }

  register(args: bytes): uint64 {
    assert(args.length >= 0, ERR_INVALID_ARG_COUNT);
    const id = this.newRegistryID();
    this.registry(id).value = interpretAsArc4<arc4NFDRootRegistryInfo>(args);
    return id;
  }

  check(args: bytes): boolean {
    assert(args.length === arc4NFDRootGateCheckParams.length, ERR_INVALID_ARG_COUNT);
    const params = interpretAsArc4<arc4NFDRootGateCheckParams>(args);
    const root = this.registry(params.registryID.native).value.root;

    return this.nfdGate(params.user, params.NFD.native, root.bytes);
  }
}