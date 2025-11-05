import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  Address,
  decodeArc4,
  encodeArc4
} from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { getAkitaAppList, getStakingPower } from '../../../utils/functions'
import { Operator } from '../../types'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { ERR_BAD_OPERATION, ERR_INVALID_ARG_COUNT } from '../../errors'

type StakingPowerGateRegistryInfo = {
  op: Operator
  asset: uint64
  power: uint64
}

const StakingPowerGateRegistryMBR: uint64 = 12_500
/** [op:1][asset:8][power:8] */
const CheckArgsBytesLength: uint64 = 17

export class StakingPowerGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(uint8,uint64,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, StakingPowerGateRegistryInfo>({ keyPrefix: '' })

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

    switch (op) {
      case Equal: return userPower === power
      case NotEqual: return userPower !== power
      case LessThan: return userPower < power
      case LessThanOrEqualTo: return userPower <= power
      case GreaterThan: return userPower > power
      case GreaterThanOrEqualTo: return userPower >= power
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // STAKING POWER GATE METHODS -------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return StakingPowerGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === CheckArgsBytesLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: StakingPowerGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const params = decodeArc4<StakingPowerGateRegistryInfo>(args)
    assert(params.op.asUint64() <= 6, ERR_BAD_OPERATION)
    const id = this.newRegistryID()
    this.registry(id).value = clone(params)
    return id
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { op, asset, power } = clone(this.registry(registryID).value)
    return this.stakingPowerGate(caller, op, asset, power)
  }

  @abimethod({ readonly: true })
  getRegistrationShape(shape: StakingPowerGateRegistryInfo): StakingPowerGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
