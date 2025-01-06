import { Contract } from '@algorandfoundation/tealscript';
import { MetaValue } from '../arc58/plugins/social/social.algo';
import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { AkitaAppIDsAkitaSocialImpactPlugin } from '../../utils/constants';
import { AkitaSocialImpact } from '../arc58/plugins/social/impact.algo';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegistryInfoLength = len<Operator>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    value: uint64;
};

export const ImpactGateCheckParamsLength = len<uint64>() + len<Address>();
export type ImpactGateCheckParams = {
    registryIndex: uint64;
    user: Address;
}

export class ImpactGate extends Contract {
    programVersion = 10;

    _registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this._registryCursor.value;
        this._registryCursor.value += 1;
        return id;
    }

    private impactGate(user: Address, op: Operator, value: uint64): boolean {
        const impact = sendMethodCall<typeof AkitaSocialImpact.prototype.getUserImpact, MetaValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsAkitaSocialImpactPlugin),
            methodArgs: [user],
            fee: 0,
        });

        if (op === Equal) {
            return impact === value;
        } else if (op === NotEqual) {
            return impact !== value;
        } else if (op === LessThan) {
            return impact < value;
        } else if (op === LessThanOrEqualTo) {
            return impact <= value;
        } else if (op === GreaterThan) {
            return impact > value;
        } else if (op === GreaterThanOrEqualTo) {
            return impact >= value;
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
        assert(args.length === ImpactGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<ImpactGateCheckParams>(args);
        const info = this.registry(params.registryIndex).value;
        return this.impactGate(params.user, info.op, info.value);
    }
}