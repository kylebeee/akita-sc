import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { FollowerIndexGateCheckParams, FollowerIndexRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor, UserOperatorValueRegistryMBR } from '../../constants'
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
import { AkitaSocial } from '../../../social/contract.algo'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class SocialFollowerIndexGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, FollowerIndexRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerIndexGate(user: Address, index: uint64, follower: Address, op: Operator, value: uint64): boolean {
    const isFollower = abiCall(
      AkitaSocial.prototype.isFollower,
      {
        appId: getAkitaAppList(this.akitaDAO.value).social,
        args: [user, index, follower],
      }
    ).returnValue

    if (!isFollower) {
      return false
    }

    if (op === Equal) {
      return index === value
    }
    if (op === NotEqual) {
      return index !== value
    }
    if (op === LessThan) {
      return index < value
    }
    if (op === LessThanOrEqualTo) {
      return index <= value
    }
    if (op === GreaterThan) {
      return index > value
    }
    if (op === GreaterThanOrEqualTo) {
      return index >= value
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

  // FOLLOWER INDEX GATE --------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return UserOperatorValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 41, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: UserOperatorValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<FollowerIndexRegistryInfo>(args)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 48, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<FollowerIndexGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.followerIndexGate(
      info.user,
      params.index,
      params.follower,
      info.op,
      info.value
    )
  }
}
