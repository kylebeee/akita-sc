import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { FollowerCountGateCheckParams, FollowerCountRegistryInfo } from './types'
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
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { AkitaSocial } from '../../../social/contract.algo'
import { getAkitaAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class SocialFollowerCountGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, FollowerCountRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerCountGate(user: Address, op: Operator, value: uint64): boolean {

    const meta = abiCall(
      AkitaSocial.prototype.getMeta,
      {
        appId: getAkitaAppList(this.akitaDAO.value).impact,
        args: [user],
      }
    ).returnValue

    if (op === Equal) {
      return meta.followerCount === value
    }
    if (op === NotEqual) {
      return meta.followerCount !== value
    }
    if (op === LessThan) {
      return meta.followerCount < value
    }
    if (op === LessThanOrEqualTo) {
      return meta.followerCount <= value
    }
    if (op === GreaterThan) {
      return meta.followerCount > value
    }
    if (op === GreaterThanOrEqualTo) {
      return meta.followerCount >= value
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

  // FOLLOWER COUNT GATE METHODS ------------------------------------------------------------------

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
    this.registry(id).value = decodeArc4<FollowerCountRegistryInfo>(args)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<FollowerCountGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.followerCountGate(params.user, info.op, info.value)
  }
}
