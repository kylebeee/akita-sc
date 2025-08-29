import { Application, assert, assertMatch, Bytes, bytes, Global, GlobalState, gtxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { ERR_INVALID_ARG_COUNT, ERR_INVALID_REGISTRY_ARG } from '../../errors'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { NFD } from '../../../utils/types/nfd'
import { getOtherAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { Uint64ByteLength } from '../../../utils/constants'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape } from '../../constants'
import { NFDGlobalStateKeysName, NFDMetaKeyVerifiedAddresses } from '../../../utils/constants/nfd'

export class NFDGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: 'uint64', key: GateGlobalStateKeyCheckShape })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private nfdGate(user: Address, appID: uint64): boolean {
    const [nfdName] = op.AppGlobal.getExBytes(appID, Bytes(NFDGlobalStateKeysName))

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
        args: [Bytes(NFDMetaKeyVerifiedAddresses)],
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
  }

  // NFD GATE METHODS -----------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return 0
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: 0
      },
      ERR_INVALID_PAYMENT
    )
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)

    return 0
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === Uint64ByteLength, ERR_INVALID_ARG_COUNT)
    assert(registryID === 0, ERR_INVALID_REGISTRY_ARG)
    return this.nfdGate(caller, btoi(args))
  }

  getCheckShape(shape: uint64): uint64 {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return op.bzero(0)
  }
}
