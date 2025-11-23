import { Account, Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { getAkitaAppList } from '../../../utils/functions'
import {
  Equal,
  GreaterThan,
  GreaterThanOrEqualTo,
  LessThan,
  LessThanOrEqualTo,
  NotEqual,
} from '../../../utils/operators'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor, OperatorAndValueRegistryMBR } from '../../constants'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Operator, OperatorAndValue } from '../../types'

// CONTRACT IMPORTS
import type { AkitaSocial } from '../../../social/contract.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'


/** [op: 1][value: 8] */
const RegisterByteLength = 9

export class SocialActivityGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(uint8,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, OperatorAndValue>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private activityGate(user: Account, op: Operator, value: uint64): boolean {
    const { lastActive } = abiCall<typeof AkitaSocial.prototype.getMeta>({
      appId: getAkitaAppList(this.akitaDAO.value).social,
      args: [user],
    }).returnValue

    const since: uint64 = Global.latestTimestamp - value

    switch (op) {
      case Equal: return lastActive === since
      case NotEqual: return lastActive !== since
      case LessThan: return lastActive < since
      case LessThanOrEqualTo: return lastActive <= since
      case GreaterThan: return lastActive > since
      case GreaterThanOrEqualTo: return lastActive >= since
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // SOCIAL ACTIVITY GATE --------------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return OperatorAndValueRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === RegisterByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: OperatorAndValueRegistryMBR
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<OperatorAndValue>(args)
    return id
  }

  check(caller: Account, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { op, value } = clone(this.registry(registryID).value)
    return this.activityGate(caller, op, value)
  }

  @abimethod({ readonly: true })
  getRegistrationShape(shape: OperatorAndValue): OperatorAndValue {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
