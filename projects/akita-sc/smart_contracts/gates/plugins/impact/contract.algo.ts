import { assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { arc4ImpactGateCheckParams, arc4ImpactRegistryInfo, ImpactRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import { AkitaSocialImpact } from '../../../arc58/plugins/impact/contract.algo'
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

export class ImpactGate extends AkitaBaseContract {
  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  registry = BoxMap<uint64, arc4ImpactRegistryInfo>({ keyPrefix: '' })

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private impactGate(user: Address, op: Operator, value: uint64): boolean {

    const encodedImpact = itxn
      .applicationCall({
        appId: super.getPluginAppList().impact,
        appArgs: [
          methodSelector(AkitaSocialImpact.prototype.getUserImpact),
          user
        ],
        fee: 0,
      })
      .submit()
      .lastLog

    const impact = btoi(encodedImpact)

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

  register(args: bytes): uint64 {
    assert(args.length === arc4ImpactRegistryInfo.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4ImpactRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === arc4ImpactGateCheckParams.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4ImpactGateCheckParams>(args)
    const info = decodeArc4<ImpactRegistryInfo>(this.registry(params.registryID.native).value.bytes)
    return this.impactGate(params.user, info.op, info.value)
  }
}
