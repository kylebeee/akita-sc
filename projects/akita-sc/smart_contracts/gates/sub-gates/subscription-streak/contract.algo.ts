import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { SubscriptionStreakGateCheckParams, SubscriptionStreakRegistryInfo } from './types'
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
import { SubGateInterface } from '../../../utils/types/gates'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { SubscriptionStreakGateRegistryMBR } from './constants'

export class SubscriptionStreakGate extends AkitaBaseContract implements SubGateInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, SubscriptionStreakRegistryInfo>({ keyPrefix: '' })

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
    const info = abiCall(
      Subscriptions.prototype.getSubscriptionInfo,
      {
        appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
        args: [address, id],
      }
    ).returnValue

    const toMerchant = info.recipient === merchant

    const lastWindowStart: uint64 =
      Global.latestTimestamp - (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    const notStale = info.lastPayment > lastWindowStart

    if (!(toMerchant && notStale)) {
      return false
    }

    if (op === Equal) {
      return info.streak === streak
    }
    if (op === NotEqual) {
      return info.streak !== streak
    }
    if (op === LessThan) {
      return info.streak < streak
    }
    if (op === LessThanOrEqualTo) {
      return info.streak <= streak
    }
    if (op === GreaterThan) {
      return info.streak > streak
    }
    if (op === GreaterThanOrEqualTo) {
      return info.streak >= streak
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

  // SUBSCRIPTION STREAK GATE METHODS -------------------------------------------------------------

  cost(args: bytes): uint64 {
    return SubscriptionStreakGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === 49, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: SubscriptionStreakGateRegistryMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<SubscriptionStreakRegistryInfo>(args)
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = decodeArc4<SubscriptionStreakGateCheckParams>(args)
    const info = clone(this.registry(params.registryID).value)
    return this.subscriptionStreakGate(
      params.user,
      info.merchant,
      info.id,
      info.op,
      info.streak
    )
  }
}
