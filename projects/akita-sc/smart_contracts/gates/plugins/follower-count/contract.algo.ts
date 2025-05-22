import { Application, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4FollowerCountGateCheckParams, arc4FollowerCountRegistryInfo, FollowerCountRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import { AkitaSocialPlugin } from '../../../arc58/plugins/social/contract.algo'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MetaValue } from '../../../arc58/plugins/social/types'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { getPluginAppList } from '../../../utils/functions'
import { fee } from '../../../utils/constants'

export class FollowerCountGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, arc4FollowerCountRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerCountGate(user: Address, op: Operator, value: uint64): boolean {

    const encodedMeta = itxn
      .applicationCall({
        appId: getPluginAppList(this.akitaDAO.value).impact,
        appArgs: [
          methodSelector(AkitaSocialPlugin.prototype.getMeta),
          user
        ],
        fee,
      })
      .submit()
      .lastLog

    const meta = decodeArc4<MetaValue>(encodedMeta)

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

  register(args: bytes): uint64 {
    assert(args.length === 16, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4FollowerCountRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params.copy()
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4FollowerCountGateCheckParams>(args)
    const info = decodeArc4<FollowerCountRegistryInfo>(this.registry(params.registryID.native).value.bytes)
    return this.followerCountGate(params.user, info.op, info.value)
  }
}
