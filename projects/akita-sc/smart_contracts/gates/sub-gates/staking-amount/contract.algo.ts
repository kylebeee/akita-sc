import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { StakingAmountGateCheckParams, StakingAmountRegistryInfo } from './types'
import { Operator } from '../../types'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { STAKING_TYPE_HEARTBEAT } from '../../../staking/types'
import { Staking } from '../../../staking/contract.algo'
import { ERR_INVALID_ARG_COUNT } from './errors'
import { ERR_BAD_OPERATION } from '../staking-power/errors'
import { getAkitaAppList } from '../../../utils/functions'
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { StakingAmountGateRegistryMBR } from './constants'

export class StakingAmountGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, StakingAmountRegistryInfo>({ keyPrefix: '' })

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
    includeStaked: boolean
  ): boolean {
    let staked: uint64 = 0

    if (type === STAKING_TYPE_HEARTBEAT) {
      staked = abiCall(
        Staking.prototype.getHeartbeatAverage,
        {
          appId: getAkitaAppList(this.akitaDAO.value).staking,
          args: [user, asset, includeStaked],
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

    if (op === Equal) {
      return staked === amount
    }
    if (op === NotEqual) {
      return staked !== amount
    }
    if (op === LessThan) {
      return staked < amount
    }
    if (op === LessThanOrEqualTo) {
      return staked <= amount
    }
    if (op === GreaterThan) {
      return staked > amount
    }
    if (op === GreaterThanOrEqualTo) {
      return staked >= amount
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

  // STAKING AMOUNT GATE METHODS ------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return StakingAmountGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 19, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: StakingAmountGateRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const params = decodeArc4<StakingAmountRegistryInfo>(args)
    // dont include the list operators includes & not includes
    assert(params.op.native <= 6, ERR_BAD_OPERATION)
    const id = this.newRegistryID()
    this.registry(id).value = clone(params)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<StakingAmountGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.stakingAmountGate(
      params.user,
      info.op,
      info.asset,
      info.amount,
      info.type,
      info.includeStaked
    )
  }
}
