import { Application, assert, assertMatch, Bytes, bytes, Global, gtxn, op, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import {
  NFD_NAME_KEY,
  NFD_VERIFIED_ADDRESSES_PROPERTY_NAME,
} from './constants'
import { NFDGateCheckParams } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { NFDRegistry } from '../../../utils/types/nfd-registry'
import { NFD } from '../../../utils/types/nfd'
import { getOtherAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class NFDGate extends AkitaBaseContract implements SubGateInterface {

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private nfdGate(user: Address, appID: uint64): boolean {
    const [nfdName] = op.AppGlobal.getExBytes(appID, Bytes(NFD_NAME_KEY))

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

    return 0
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<NFDGateCheckParams>(args)
    return this.nfdGate(params.user, params.NFD)
  }
}
