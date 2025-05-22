import { Application, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { arc4ImpactGateCheckParams, arc4ImpactRegistryInfo, ImpactRegistryInfo } from './types'
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
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { btoi } from '@algorandfoundation/algorand-typescript/op'
import { getPluginAppList } from '../../../utils/functions'
import { AkitaSocialImpact } from '../../../arc58/plugins/social/contract.algo'
import { fee } from '../../../utils/constants'

export class ImpactGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, arc4ImpactRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private impactGate(user: Address, op: Operator, value: uint64): boolean {

    const impact = abiCall(
      AkitaSocialImpact.prototype.getUserImpact,
      {
        appId: getPluginAppList(this.akitaDAO.value).impact,
        args: [user],
        fee,
      }
    ).returnValue

    if (op === Equal) {
      return impact === value
    }
    if (op === NotEqual) {
      return impact !== value
    }
    if (op === LessThan) {
      return impact < value
    }
    if (op === LessThanOrEqualTo) {
      return impact <= value
    }
    if (op === GreaterThan) {
      return impact > value
    }
    if (op === GreaterThanOrEqualTo) {
      return impact >= value
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

  // IMPACT GATE METHODS --------------------------------------------------------------------------

  register(args: bytes): uint64 {
    assert(args.length === 16, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4ImpactRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params.copy()
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4ImpactGateCheckParams>(args)
    const info = decodeArc4<ImpactRegistryInfo>(this.registry(params.registryID.native).value.bytes)
    return this.impactGate(params.user, info.op, info.value)
  }
}
