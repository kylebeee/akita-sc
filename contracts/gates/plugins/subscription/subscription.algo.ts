import { arc4, assert, BoxMap, bytes, Global, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript';
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo';
import { GateGlobalStateKeyRegistryCursor } from '../../constants';
import { arc4SubscriptionGateCheckParams, arc4SubscriptionRegistryInfo } from './types';
import { ERR_INVALID_ARG_COUNT } from '../../errors';
import { decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { Subscriptions } from '../../../subscriptions/subscriptions.algo';
import { SubscriptionInfoWithPasses } from '../../../subscriptions/types';

export class SubscriptionGate extends AkitaBaseContract {

  registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

  registry = BoxMap<uint64, arc4SubscriptionRegistryInfo>({ keyPrefix: '' })

  private newRegistryID(): uint64 {
    const id = this.registryCursor.value
    this.registryCursor.value += 1
    return id
  }

  private subscriptionGate(address: arc4.Address, merchant: arc4.Address, id: uint64): boolean {

    // TODO: replace with itxn.abiCall when available
    const infoTxn = itxn
      .applicationCall({
        appId: super.getAppList().subscriptions,
        appArgs: [
          methodSelector(Subscriptions.prototype.getSubsriptionInfo),
          address,
          id
        ]
      })
      .submit()

    const info = decodeArc4<SubscriptionInfoWithPasses>(infoTxn.lastLog)

    const toMerchant = info.recipient === merchant

    const lastWindowStart = Global.latestTimestamp - (
      ((Global.latestTimestamp - info.startDate) % info.interval) + info.interval
    )

    // this doesn't tell us about the consistency of their payments,
    // only that their subscription isn't currently stale
    const notStale = info.lastPayment > lastWindowStart

    return toMerchant && notStale
  }

  register(args: bytes): uint64 {
    assert(args.length === arc4SubscriptionRegistryInfo.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionRegistryInfo>(args)
    const id = this.newRegistryID()
    this.registry(id).value = params
    return id
  }

  check(args: bytes): boolean {
    assert(args.length === arc4SubscriptionGateCheckParams.length, ERR_INVALID_ARG_COUNT)
    const params = interpretAsArc4<arc4SubscriptionGateCheckParams>(args)
    const info = this.registry(params.registryID.native).value
    return this.subscriptionGate(params.user, info.merchant, info.id.native)
  }
}