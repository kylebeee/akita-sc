import { Application, assert, assertMatch, BoxMap, bytes, clone, Global, GlobalState, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyCheckShape, GateGlobalStateKeyRegistrationShape, GateGlobalStateKeyRegistryCursor } from '../../constants'
import { SubscriptionGateRegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Subscriptions } from '../../../subscriptions/contract.algo'
import { getAkitaAppList } from '../../../utils/functions'
import { ERR_INVALID_PAYMENT } from '../../../utils/errors'
import { SubscriptionGateRegistryMBR } from './constants'

/** [merchant:32][id:8] */
const RegisterArgsByteLength: uint64 = 40

export class SubscriptionGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ initialValue: 1, key: GateGlobalStateKeyRegistryCursor })
  /** the abi string for the register args */
  registrationShape = GlobalState<string>({ initialValue: '(address,uint64)', key: GateGlobalStateKeyRegistrationShape })
  /** the abi string for the check args */
  checkShape = GlobalState<string>({ initialValue: '', key: GateGlobalStateKeyCheckShape })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, SubscriptionGateRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private subscriptionGate(address: Address, merchant: Address, id: uint64): boolean {
    const info = abiCall<typeof Subscriptions.prototype.getSubscription>({
      appId: getAkitaAppList(this.akitaDAO.value).subscriptions,
      args: [address, id],
    }).returnValue

    const toMerchant = info.recipient === merchant

    const lastWindowStart: uint64 =
      Global.latestTimestamp -
      (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

    // this doesn't tell us about the consistency of their payments,
    // only that their subscription isn't currently stale
    const notStale = info.lastPayment > lastWindowStart

    return toMerchant && notStale
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // SUBSCRIPTION GATE METHODS --------------------------------------------------------------------

  cost(args: bytes): uint64 {
    return SubscriptionGateRegistryMBR
  }

  register(mbrPayment: gtxn.PaymentTxn, args: bytes): uint64 {
    assert(args.length === RegisterArgsByteLength, ERR_INVALID_ARG_COUNT)
    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: SubscriptionGateRegistryMBR,
      },
      ERR_INVALID_PAYMENT
    )

    const id = this.newRegistryID()
    this.registry(id).value = decodeArc4<SubscriptionGateRegistryInfo>(args)
    return id
  }

  check(caller: Address, registryID: uint64, args: bytes): boolean {
    assert(args.length === 0, ERR_INVALID_ARG_COUNT)
    const { merchant, id } = clone(this.registry(registryID).value)
    return this.subscriptionGate(caller, merchant, id)
  }

  @abimethod({ readonly: true })
  getRegistrationShape(shape: SubscriptionGateRegistryInfo): SubscriptionGateRegistryInfo {
    return shape
  }

  @abimethod({ readonly: true })
  getEntry(registryID: uint64): bytes {
    return encodeArc4(this.registry(registryID).value)
  }
}
