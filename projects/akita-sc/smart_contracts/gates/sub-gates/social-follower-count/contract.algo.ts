import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor, OperatorAndValueRegistryMBR } from '../../constants'
import { Operator, OperatorAndValue } from '../../types'
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
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'

// CONTRACT IMPORTS
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import type { AkitaSocial } from '../../../social/contract.algo'

/** [op: 1][value: 8] */
const RegisterByteLength = 9

export class SocialFollowerCountGate extends AkitaBaseContract {

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

  private followerCountGate(user: Address, op: Operator, value: uint64): boolean {

    const meta = abiCall<typeof AkitaSocial.prototype.getMeta>({
      appId: getAkitaAppList(this.akitaDAO.value).impact,
      args: [user],
    }).returnValue

    switch (op) {
      case Equal: return meta.followerCount === value
      case NotEqual: return meta.followerCount !== value
      case LessThan: return meta.followerCount < value
      case LessThanOrEqualTo: return meta.followerCount <= value
      case GreaterThan: return meta.followerCount > value
      case GreaterThanOrEqualTo: return meta.followerCount >= value
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // FOLLOWER COUNT GATE METHODS ------------------------------------------------------------------

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

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { op, value } = clone(this.registry(registryID).value)
    return this.followerCountGate(caller, op, value)
  }

  getRegistrationShape(shape: OperatorAndValue): OperatorAndValue {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
