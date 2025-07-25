import { Application, assert, assertMatch, BoxMap, Bytes, bytes, Global, GlobalState, gtxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { NFDRootGateCheckParams } from '../nfd/types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MinNFDRootGateRegistryMBR, NFD_NAME_KEY, NFD_PARENT_APP_KEY, NFD_VERIFIED_ADDRESSES_PROPERTY_NAME } from './constants'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { NFD } from '../../../utils/types/nfd'
import { getOtherAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { BoxCostPerBox } from '../../../utils/constants'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class NFDGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, bytes>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private nfdGate(user: Address, appID: uint64, root: bytes): boolean {
    const [nfdName] = op.AppGlobal.getExBytes(appID, Bytes(NFD_NAME_KEY))
    const [_, parentExists] = op.AppGlobal.getExBytes(appID, Bytes(NFD_PARENT_APP_KEY))

    if (parentExists && root !== nfdName.slice(nfdName.length - (root.length + 5), nfdName.length - 5)) {
      return false
    }

    const verified = abiCall(
      NFDRegistry.prototype.isValidNfdAppId,
      {
        appId: getOtherAppList(this.akitaDAO.value).nfdRegistry,
        args: [String(nfdName), appID],
      }
    ).returnValue

    if (!verified) {
      return false
    }

    const caAlgoData = abiCall(
      NFD.prototype.readField,
      {
        appId: appID,
        args: [Bytes(NFD_VERIFIED_ADDRESSES_PROPERTY_NAME)],
      }
    ).returnValue

    let exists: boolean = false
    for (let i: uint64 = 0; i < caAlgoData.length; i += 32) {
      const addr = caAlgoData.slice(i, 32)
      if (addr === user.bytes) {
        exists = true
      }
    }

    return exists
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // NFD ROOT GATE METHODS ------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return MinNFDRootGateRegistryMBR + (BoxCostPerBox * args.length)
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length >= 0, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.cost(args)
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = args
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 48, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<NFDRootGateCheckParams>(args)
    const root = this.registry(params.registryID).value

    return this.nfdGate(params.user, params.NFD, root)
  }
}
