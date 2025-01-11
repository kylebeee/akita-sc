import { Contract } from '@algorandfoundation/tealscript';
import { Operator } from './gate.algo';
import { AkitaSocialPlugin } from '../arc58/plugins/social/social.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { AkitaAppIDsAkitaSocialPlugin } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegistryInfoLength = len<Address>() + len<Operator>() + len<uint64>();
export type RegistryInfo = {
    user: Address;
    op: Operator;
    value: uint64;
};

export const FollowerIndexGateCheckParamsLength = len<uint64>() + len<uint64>() + len<Address>();
export type FollowerIndexGateCheckParams = {
    registryID: uint64;
    index: uint64;
    follower: Address;
};

export class FollowerIndexGate extends Contract {
    programVersion = 10;

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return id;
    }

    private followerIndexGate(user: Address, index: uint64, follower: Address, op: Operator, value: uint64): boolean {
        const isFollower = sendMethodCall<typeof AkitaSocialPlugin.prototype.isFollower, boolean>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialPlugin),
            methodArgs: [
                user,
                index,
                follower
            ],
            fee: 0,
        });

        if (!isFollower) {
            return false;
        }

        if (op === Equal) {
            return index === value;
        } else if (op === NotEqual) {
            return index !== value;
        } else if (op === LessThan) {
            return index < value;
        } else if (op === LessThanOrEqualTo) {
            return index <= value;
        } else if (op === GreaterThan) {
            return index > value;
        } else if (op === GreaterThanOrEqualTo) {
            return index >= value;
        }

        return false;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegistryInfoLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<RegistryInfo>(args);
        const id = this.newRegistryID();
        this.registry(id).value = params;
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length === FollowerIndexGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<FollowerIndexGateCheckParams>(args);
        const info = this.registry(params.registryID).value;
        return this.followerIndexGate(info.user, params.index, params.follower, info.op, info.value);
    }
}