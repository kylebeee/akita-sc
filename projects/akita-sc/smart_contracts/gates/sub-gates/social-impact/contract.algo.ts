import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { ImpactGateCheckParams, ImpactRegistryInfo } from './types'
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
import { AkitaSocialImpact } from '../../../social/contract.algo'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

export class SocialImpactGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, ImpactRegistryInfo>({ keyPrefix: '' })

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
        appId: getAkitaAppList(this.akitaDAO.value).impact,
        args: [user],
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

  cost(args: bytes): uint64 {
    return OperatorValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 16, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: OperatorValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<ImpactRegistryInfo>(args)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<ImpactGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.impactGate(params.user, info.op, info.value)
  }
}
