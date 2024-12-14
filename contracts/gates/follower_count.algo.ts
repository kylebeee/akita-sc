import { Contract } from '@algorandfoundation/tealscript';
import { Operator } from './gate.algo';
import { AkitaSocialPlugin, MetaValue } from '../arc58/plugins/akita_social.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from '../../utils/operators';
import { AkitaAppIDsAkitaSocialPlugin } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
};

export const RegistryInfoLength = len<Operator>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    value: uint64;
}

export const FollowerCountGateCheckParamsLength = len<uint64>() + len<Address>();
export type FollowerCountGateCheckParams = {
    registryIndex: uint64;
    user: Address;
}

export class FollowerCountGate extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    private followerCountGate(user: Address, op: Operator, value: uint64): boolean {        
        const meta = sendMethodCall<typeof AkitaSocialPlugin.prototype.getMeta, MetaValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialPlugin),
            methodArgs: [ user ],
            fee: 0,
        });

        if (op === Equal) {
            return meta.followerCount === value;
        } else if (op === NotEqual) {
            return meta.followerCount !== value;
        } else if (op === LessThan) {
            return meta.followerCount < value;
        } else if (op === LessThanOrEqualTo) {
            return meta.followerCount <= value;
        } else if (op === GreaterThan) {
            return meta.followerCount > value;
        } else if (op === GreaterThanOrEqualTo) {
            return meta.followerCount >= value;
        }

        return false;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegistryInfoLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<RegistryInfo>(args);
        const counter = this.registryCounter.value;
        this.registry(counter).value = params;
        this.registryCounter.value += 1;
        return counter;
    }

    check(args: bytes): boolean {
        assert(args.length === FollowerCountGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<FollowerCountGateCheckParams>(args);
        const info = this.registry(params.registryIndex).value;
        return this.followerCountGate(params.user, info.op, info.value);
    }
}