import { Application, assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4MerkleAssetGateCheckParams, arc4MerkleAssetRegistryInfo, MerkleAssetGateCheckParams } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MetaMerkles } from '../../../meta-merkles/contract.algo'
import { MerkleAssetRegistryInfo } from './types'
import { MerkleTreeTypeCollection } from '../../../meta-merkles/constants'
import { getAkitaAppList } from '../../../utils/functions'

export class MerkleAssetGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, MerkleAssetRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // MERKLE ASSET GATE METHODS --------------------------------------------------------------------

  register(args: bytes): uint64 {
    // arc4MerkleAssetRegistryInfo contains a dynamic string
    // so we need to check that the length of the arguments is at least the length of the static part
    // of the struct plus 1 byte (the smallest length of a string)
    assert(args.length >= 33, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<MerkleAssetRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    // arc4MerkleAssetGateCheckParams contains a dynamic array of proofs
    // so we need to check that the length of the arguments is at least the length of the static part
    // of the struct plus 64 bytes (the smallest length of a single proof)
    assert(args.length >= 112, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<MerkleAssetGateCheckParams>(args)

    const [holdings, optedIn] = AssetHolding.assetBalance(params.user.native, params.asset)
    if (!optedIn || holdings === 0) {
      return false
    }

    const registryInfo = this.registry(params.registryID).value

    return abiCall(MetaMerkles.prototype.verify, {
      appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
      args: [
        registryInfo.creator,
        registryInfo.name,
        sha256(sha256(itob(params.asset))),
        params.proof,
        MerkleTreeTypeCollection,
      ],
    }).returnValue
  }
}
