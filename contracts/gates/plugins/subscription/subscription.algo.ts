import { arc4, assert, BoxMap, bytes, Global, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
    abiCall,
    Address,
    decodeArc4,
    interpretAsArc4,
    methodSelector,
} from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4SubscriptionGateCheckParams, arc4SubscriptionRegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Subscriptions } from '../../../subscriptions/subscriptions.algo'
import { SubscriptionInfoWithPasses } from '../../../subscriptions/types'

export class SubscriptionGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4SubscriptionRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private subscriptionGate(address: Address, merchant: Address, id: arc4.UintN64): boolean {
        const info = abiCall(Subscriptions.prototype.getSubsriptionInfo, {
            appId: super.getAppList().subscriptions,
            args: [address, id],
        }).returnValue

        const toMerchant = info.recipient === merchant

        const lastWindowStart =
            Global.latestTimestamp -
            (((Global.latestTimestamp - info.startDate.native) % info.interval.native) + info.interval.native)

        // this doesn't tell us about the consistency of their payments,
        // only that their subscription isn't currently stale
        const notStale = info.lastPayment.native > lastWindowStart

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
        return this.subscriptionGate(params.user, info.merchant, info.id)
    }
}
