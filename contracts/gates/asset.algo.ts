import { Contract } from '@algorandfoundation/tealscript';

import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from '../../utils/operators';

const errs = {
    NOT_AKITA_DAO: 'Only the Akita DAO can call this function',
    INVALID_ARG_COUNT: 'Invalid number of arguments',
}

export const RegsitryInfoParamsLength = len<Operator>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    value: uint64;
}

export const AssetGateCheckParamsLength = len<Address>() + len<uint64>() + len<AssetID>();
export type AssetGateCheckParams = {
    user: Address;
    registryID: uint64;
    asset: AssetID;
};

export class AssetGate extends Contract {
    programVersion = 10;

    /** The App ID of the Akita DAO contract */
    akitaDaoAppID = TemplateVar<AppID>();

    createApplication(): void {
        this.registryCursor.value = 0;
    }

    updateApplication(): void {
        assert(this.txn.sender === this.akitaDaoAppID.address, errs.NOT_AKITA_DAO);
    }

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
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
        const info = this.registry(params.registryID).value;
        return this.assetGate(params.user, params.asset, info.op, info.value);
    }
}