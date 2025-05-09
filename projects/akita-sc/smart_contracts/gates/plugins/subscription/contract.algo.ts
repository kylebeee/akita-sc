import { assert, BoxMap, bytes, Global, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4SubscriptionGateCheckParams, arc4SubscriptionRegistryInfo, SubscriptionRegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { Subscriptions } from '../../../subscriptions/contract.algo'

export class SubscriptionGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4SubscriptionRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private subscriptionGate(address: Address, merchant: Address, id: uint64): boolean {
        const info = abiCall(Subscriptions.prototype.getSubsriptionInfo, {
            appId: super.getAkitaAppList().subscriptions,
            args: [address, id],
        }).returnValue

        const toMerchant = info.recipient === merchant

        const lastWindowStart =
            Global.latestTimestamp -
            (((Global.latestTimestamp - info.startDate) % info.interval) + info.interval)

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
        const info = decodeArc4<SubscriptionRegistryInfo>(this.registry(params.registryID.native).value.bytes)
        return this.subscriptionGate(params.user, info.merchant, info.id)
    }
}
