import { Application, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { arc4FollowerIndexGateCheckParams, arc4FollowerIndexRegistryInfo, FollowerIndexRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { AkitaSocialPlugin } from '../../../arc58/plugins/social/contract.algo'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { getPluginAppList } from '../../../utils/functions'
import { fee } from '../../../utils/constants'

export class FollowerIndexGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, arc4FollowerIndexRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private followerIndexGate(user: Address, index: uint64, follower: Address, op: Operator, value: uint64): boolean {
    const isFollowerTxn = itxn
      .applicationCall({
        appId: getPluginAppList(this.akitaDAO.value).social,
        appArgs: [methodSelector(AkitaSocialPlugin.prototype.isFollower), user, index, follower],
        fee,
      })
      .submit()

    const isFollower = decodeArc4<boolean>(isFollowerTxn.lastLog)

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
  createApplication(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // FOLLOWER INDEX GATE --------------------------------------------------------------------------

  register(args: bytes): uint64 {
    assert(args.length === 48, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4FollowerIndexRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params.copy()
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 48, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4FollowerIndexGateCheckParams>(args)
    const info = decodeArc4<FollowerIndexRegistryInfo>(this.registry(params.registryID.native).value.bytes)
    return this.followerIndexGate(
      info.user,
      params.index.native,
      params.follower,
      info.op,
      info.value
    )
  }
}
