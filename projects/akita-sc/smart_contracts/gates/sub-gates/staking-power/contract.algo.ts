import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Address,
  decodeArc4
} from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { StakingPowerGateCheckParams, StakingPowerRegistryInfo } from './types'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { ERR_BAD_OPERATION, ERR_INVALID_ARG_COUNT } from './errors'
import { getAkitaAppList, getStakingPower } from '../../../utils/functions'
import { Operator } from '../../types'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { StakingPowerGateRegistryMBR } from './constants'

export class StakingPowerGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, StakingPowerRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private stakingPowerGate(user: Address, op: Operator, asset: uint64, power: uint64): boolean {
    const userPower = getStakingPower(
      getAkitaAppList(this.akitaDAO.value).staking,
      user,
      asset
    )

    if (op === Equal) {
      return userPower === power
    }
    if (op === NotEqual) {
      return userPower !== power
    }
    if (op === LessThan) {
      return userPower < power
    }
    if (op === LessThanOrEqualTo) {
      return userPower <= power
    }
    if (op === GreaterThan) {
      return userPower > power
    }
    if (op === GreaterThanOrEqualTo) {
      return userPower >= power
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

  // STAKING POWER GATE METHODS -------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return StakingPowerGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 17, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: StakingPowerGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const params = decodeArc4<StakingPowerRegistryInfo>(args)
    assert(params.op.native <= 6, ERR_BAD_OPERATION)
    const id = this.newRegistryID()
    this.registry(id).value = clone(params)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length >= 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<StakingPowerGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.stakingPowerGate(
      params.user,
      info.op,
      info.asset,
      info.power
    )
  }
}
