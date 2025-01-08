import { Contract } from '@algorandfoundation/tealscript';

import { Operator } from './gate.algo';
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from '../../utils/operators';
import { Subscriptions } from '../subscriptions/subscriptions.algo';
import { AkitaAppIDsSubscriptions } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegistryInfoLength = len<Address>() + len<uint64>() + len<Operator>() + len<uint64>();
export type RegistryInfo = {
    merchant: Address;
    index: uint64;
    op: Operator;
    streak: uint64;
};

export const SubscriptionGateCheckParamsLength = len<uint64>() + len<Address>();
export type SubscriptionGateCheckParams = {
    registryIndex: uint64;
    user: Address;
};

export class SubscriptionStreakGate extends Contract {
    programVersion = 10;

    _registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this._registryCursor.value;
        this._registryCursor.value += 1;
        return id;
    }

    private subscriptionStreakGate(address: Address, merchant: Address, index: uint64, op: Operator, streak: uint64): boolean {
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

        if (!(toMerchant && notStale)) {
            return false;
        }

        if (op === Equal && info.streak !== streak) {
            return false;
        } else if (op === NotEqual && info.streak === streak) {
            return false;
        } else if (op === LessThan && info.streak >= streak) {
            return false;
        } else if (op === LessThanOrEqualTo && info.streak > streak) {
            return false;
        } else if (op === GreaterThan && info.streak <= streak) {
            return false;
        } else if (op === GreaterThanOrEqualTo && info.streak < streak) {
            return false;
        }
        
        return true;
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
        const info = this.registry(params.registryIndex).value;
        return this.subscriptionStreakGate(params.user, info.merchant, info.index, info.op, info.streak);
    }   
}