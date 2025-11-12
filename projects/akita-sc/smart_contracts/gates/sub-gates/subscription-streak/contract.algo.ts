import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, encodeArc4, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { SubscriptionStreakGateRegistryInfo } from './types'
import { Subscriptions } from '../../../subscriptions/contract.algo'
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
import { SubscriptionStreakGateRegistryMBR } from './constants'

/** [merchant:32][id:8][op:1][streak:8] */
const RegisterByteLength: uint64 = 49

export class SubscriptionStreakGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(address,uint64,uint8,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, SubscriptionStreakGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private subscriptionStreakGate(
    address: Address,
    merchant: Address,
    id: uint64,
    op: Uint8,
    streak: uint64
  ): boolean {
    const info = abiCall<typeof Subscriptions.prototype.getSubscription>({
      appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
      args: [address, id],
    }).returnValue

    const toMerchant = info.recipient === merchant

    const lastWindowStart: uint64 =
      Global.latestTimestamp - (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    const notStale = info.lastPayment > lastWindowStart

    if (!(toMerchant && notStale)) {
      return false
    }

    switch (op) {
      case Equal: return info.streak === streak
      case NotEqual: return info.streak !== streak
      case LessThan: return info.streak < streak
      case LessThanOrEqualTo: return info.streak <= streak
      case GreaterThan: return info.streak > streak
      case GreaterThanOrEqualTo: return info.streak >= streak
      default: return false
    }
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // SUBSCRIPTION STREAK GATE METHODS -------------------------------------------------------------

  cost(args: bytes): uint64 {
    return SubscriptionStreakGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === RegisterByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: SubscriptionStreakGateRegistryMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<SubscriptionStreakGateRegistryInfo>(args)
    return id
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { merchant, id, op, streak } = clone(this.registry(registryID).value)
    return this.subscriptionStreakGate(
      caller,
      merchant,
      id,
      op,
      streak
    )
  }

  @abimethod({ readonly: true })
  getRegistrationShape(shape: SubscriptionStreakGateRegistryInfo): SubscriptionStreakGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
