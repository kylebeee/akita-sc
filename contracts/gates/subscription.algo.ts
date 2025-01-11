import { Contract } from '@algorandfoundation/tealscript';
import { Subscriptions } from '../subscriptions/subscriptions.algo';
import { AkitaAppIDsSubscriptions } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegistryInfoLength = len<Address>() + len<uint64>();
export type RegistryInfo = {
    merchant: Address;
    index: uint64;
};

export const SubscriptionGateCheckParamsLength = len<Address>() + len<uint64>();
export type SubscriptionGateCheckParams = {
    user: Address;
    registryID: uint64;
};

export class SubscriptionGate extends Contract {
    programVersion = 10;

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return id;
    }

    private subscriptionGate(address: Address, merchant: Address, index: uint64): boolean {
        const info = sendMethodCall<typeof Subscriptions.prototype.getSubsriptionInfo>({
            applicationID: AppID.fromUint64(AkitaAppIDsSubscriptions),
            methodArgs: [address, index],
            fee: 0,
        });

        // ensure they're subscribed to an Akita offering
        const toMerchant = info.recipient === merchant;

        const lastWindowStart = globals.latestTimestamp - (
            ((globals.latestTimestamp - info.startDate) % info.interval) + info.interval
        );

        // this doesn't tell us about the consistency of their payments,
        // only that their subscription isn't currently stale
        const notStale = info.lastPayment > lastWindowStart;

        return toMerchant && notStale;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegistryInfoLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<RegistryInfo>(args);
        const id = this.newRegistryID();
        this.registry(id).value = params;
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length === SubscriptionGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<SubscriptionGateCheckParams>(args);
        const info = this.registry(params.registryID).value;
        return this.subscriptionGate(params.user, info.merchant, info.index);
    }   
}