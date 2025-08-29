import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, encodeArc4, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { STAKING_TYPE_HEARTBEAT, StakingType } from '../../../staking/types'
import { Staking } from '../../../staking/contract.algo'
import { getAkitaAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { ERR_BAD_OPERATION } from '../../errors'

const ERR_INVALID_ARG_COUNT = 'Invalid number of arguments'

type StakingAmountGateRegistryInfo = {
  op: Operator
  asset: uint64
  type: StakingType
  amount: uint64
  includeEscrowed: boolean
}

const StakingAmountGateRegistryMBR: uint64 = 13_300
/** [op:1][asset:8][type:1][amount:8][includeEscrowed:1] */
const RegisterByteLength: uint64 = 19

export class StakingAmountGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(uint8,uint64,uint8,uint64,bool)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, StakingAmountGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private stakingAmountGate(
    user: Address,
    op: Operator,
    asset: uint64,
    amount: uint64,
    type: Uint8,
    includeEscrowed: boolean
  ): boolean {
    let staked: uint64 = 0

    if (type === STAKING_TYPE_HEARTBEAT) {
      staked = abiCall(
        Staking.prototype.getHeartbeatAverage,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [user, asset, includeEscrowed],
        }
      ).returnValue
    } else {
      const info = abiCall(
        Staking.prototype.mustGetInfo,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [user, { asset, type }],
        }
      ).returnValue

      staked = info.amount
    }

    switch (op) {
      case Equal: return staked === amount
      case NotEqual: return staked !== amount
      case LessThan: return staked < amount
      case LessThanOrEqualTo: return staked <= amount
      case GreaterThan: return staked > amount
      case GreaterThanOrEqualTo: return staked >= amount
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // STAKING AMOUNT GATE METHODS ------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return StakingAmountGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === RegisterByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: StakingAmountGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const params = decodeArc4<StakingAmountGateRegistryInfo>(args)
    // dont include the list operators includes & not includes
    assert(params.op.native <= 6, ERR_BAD_OPERATION)
    const id = this.newRegistryID()
    this.registry(id).value = clone(params)
    return id
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { op, asset, amount, type, includeEscrowed } = clone(this.registry(registryID).value)
    return this.stakingAmountGate(
      caller,
      op,
      asset,
      amount,
      type,
      includeEscrowed
    )
  }

  @abimethod({ readonly: true })
  getRegistrationShape(shape: StakingAmountGateRegistryInfo): StakingAmountGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
