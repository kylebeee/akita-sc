import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'

import { GateGlobalStateKeyRegistryCursor, OperatorValueRegistryMBR } from '../../constants'
import { Operator } from '../../types'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { getAkitaAppList } from '../../../utils/functions'
import { ActivityGateCheckParams, ActivityRegistryInfo } from './types'
import { AkitaSocial } from '../../../social/contract.algo'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class SocialActivityGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, ActivityRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private activityGate(user: Address, op: Operator, value: uint64): boolean {
    const { lastActive } = abiCall(
      AkitaSocial.prototype.getMeta,
      {
        appId: getAkitaAppList(this.akitaDAO.value).social,
        args: [user],
      }
    ).returnValue

    const since: uint64 = Global.latestTimestamp - value

    if (op === Equal) {
      return lastActive === since
    }
    if (op === NotEqual) {
      return lastActive !== since
    }
    if (op === LessThan) {
      return lastActive < since
    }
    if (op === LessThanOrEqualTo) {
      return lastActive <= since
    }
    if (op === GreaterThan) {
      return lastActive > since
    }
    if (op === GreaterThanOrEqualTo) {
      return lastActive >= since
    }

    return false
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // SOCIAL ACTIVITY GATE --------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return OperatorValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 9, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: OperatorValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<ActivityRegistryInfo>(args)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<ActivityGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.activityGate(
      params.user,
      info.op,
      info.value
    )
  }
}
