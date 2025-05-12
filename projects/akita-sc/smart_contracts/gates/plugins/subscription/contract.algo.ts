import { Application, assert, BoxMap, bytes, Global, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4SubscriptionGateCheckParams, arc4SubscriptionRegistryInfo, SubscriptionRegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Subscriptions } from '../../../subscriptions/contract.algo'
import { getAkitaAppList } from '../../../utils/functions'

export class SubscriptionGate extends AkitaBaseContract {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  // BOXES ----------------------------------------------------------------------------------------

  registry = BoxMap<uint64, arc4SubscriptionRegistryInfo>({ keyPrefix: '' })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private subscriptionGate(address: Address, merchant: Address, id: uint64): boolean {
    const info = abiCall(Subscriptions.prototype.getSubsriptionInfo, {
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
  createApplication(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
    this.registryCursor.value = 0
  }

  // SUBSCRIPTION GATE METHODS --------------------------------------------------------------------

  register(args: bytes): uint64 {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === 40, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionGateCheckParams>(args)
    const info = decodeArc4<SubscriptionRegistryInfo>(this.registry(params.registryID.native).value.bytes)
    return this.subscriptionGate(params.user, info.merchant, info.id)
  }
}
