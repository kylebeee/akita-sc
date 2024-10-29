import { Contract } from '@algorandfoundation/tealscript';

import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from './operators';

export interface RegistryInfo {
    op: Operator;
    values: uint64[];
}

export class AssetGatePlugin extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    // gates based on holding an asset
    private assetGate(user: Address, asset: AssetID, op: Operator, values: uint64[]): boolean {
        if (op === Equal) {
            return user.assetBalance(asset) === values[0];
        } else if (op === NotEqual) {
            return user.assetBalance(asset) !== values[0];
        } else if (op === LessThan) {
            return user.assetBalance(asset) < values[0];
        } else if (op === LessThanOrEqualTo) {
            return user.assetBalance(asset) <= values[0];
        } else if (op === GreaterThan) {
            return user.assetBalance(asset) > values[0];
        } else if (op === GreaterThanOrEqualTo) {
            return user.assetBalance(asset) >= values[0];
        } else if (op === IncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (user.assetBalance(asset) === values[i]) {
                    return true;
                }
            }

            return false;
        } else if (op === NotIncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (user.assetBalance(asset) === values[i]) {
                    return false;
                }
            }

            return true;
        }

        return false
    }

    register(args: bytes[]): uint64 {
        return 0;
    }

    check(args: bytes[]): boolean {
        return false;
    }
}