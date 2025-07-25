import { Application, assert, assertMatch, BoxMap, bytes, clone, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, Global, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor, MinMetaMerkleRegistryMBR } from '../../constants'
import { MerkleAssetGateCheckParams } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MetaMerkles } from '../../../meta-merkles/contract.algo'
import { MerkleAssetRegistryInfo } from './types'
import { MerkleTreeTypeCollection } from '../../../meta-merkles/constants'
import { getAkitaAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { BoxCostPerBox } from '../../../utils/constants'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class MerkleAssetGate extends AkitaBaseContract implements SubGateInterface {

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

  cost(args: bytes): uint64 {
   assert(args.length >= 33, ERR_INVALID_ARG_COUNT)
   return MinMetaMerkleRegistryMBR + (BoxCostPerBox * (args.length - 32))
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    // arc4MerkleAssetRegistryInfo contains a dynamic string
    // so we need to check that the length of the arguments is at least the length of the static part
    // of the struct plus 1 byte (the smallest length of a string)
    assert(args.length >= 33, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.cost(args)
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<MerkleAssetRegistryInfo>(args)
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

    const registryInfo = clone(this.registry(params.registryID).value)

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
