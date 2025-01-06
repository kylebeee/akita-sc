import { Contract } from '@algorandfoundation/tealscript';

import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from '../../utils/operators';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegsitryInfoParamsLength = len<Operator>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    value: uint64;
}

export const AssetGateCheckParamsLength = len<uint64>() + len<Address>() + len<AssetID>();
export type AssetGateCheckParams = {
    registryIndex: uint64;
    user: Address;
    asset: AssetID;
};

export class AssetGate extends Contract {
    programVersion = 10;

    _registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this._registryCursor.value;
        this._registryCursor.value += 1;
        return id;
    }

    // gates based on holding an asset
    private assetGate(user: Address, asset: AssetID, op: Operator, value: uint64): boolean {        
        if (op === Equal) {
            return user.assetBalance(asset) === value;
        } else if (op === NotEqual) {
            return user.assetBalance(asset) !== value;
        } else if (op === LessThan) {
            return user.assetBalance(asset) < value;
        } else if (op === LessThanOrEqualTo) {
            return user.assetBalance(asset) <= value;
        } else if (op === GreaterThan) {
            return user.assetBalance(asset) > value;
        } else if (op === GreaterThanOrEqualTo) {
            return user.assetBalance(asset) >= value;
        }

        return false;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegsitryInfoParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<RegistryInfo>(args);
        const id = this.newRegistryID();
        this.registry(id).value = params;
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length === AssetGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<AssetGateCheckParams>(args);
        const info = this.registry(params.registryIndex).value;
        return this.assetGate(params.user, params.asset, info.op, info.value);
    }
}