

import { Operator } from '../../types';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../../../utils/operators';
import { arc4, assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript';
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo';
import { arc4AssetGateCheckParams, arc4RegistryInfo, AssetGateCheckParams } from './types';
import { Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4';
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op';
import { ERR_INVALID_ARG_COUNT } from '../../errors';
import { GateGlobalStateKeyRegistryCursor } from '../../constants';

export class AssetGate extends AkitaBaseContract {

    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<arc4.UintN64, arc4RegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): arc4.UintN64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return new arc4.UintN64(id)
    }

    // gates based on holding an asset
    private assetGate(user: Address, asset: uint64, operator: Operator, value: uint64): boolean {
        const [balance, optedIn] = AssetHolding.assetBalance(user.native, asset)

        if (!optedIn) {
            return false
        }

        if (operator === Equal) {
            return balance === value;
        } else if (operator === NotEqual) {
            return balance !== value;
        } else if (operator === LessThan) {
            return balance < value;
        } else if (operator === LessThanOrEqualTo) {
            return balance <= value;
        } else if (operator === GreaterThan) {
            return balance > value;
        } else if (operator === GreaterThanOrEqualTo) {
            return balance >= value;
        }

        return false
    }

    createApplication(): void {
        this.registryCursor.value = 0;
    }

    register(args: bytes): arc4.UintN64 {
        assert(args.length === arc4RegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4RegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4AssetGateCheckParams.length, ERR_INVALID_ARG_COUNT);
        const params = decodeArc4<AssetGateCheckParams>(args);
        const info = this.registry(new arc4.UintN64(params.registryID)).value;
        return this.assetGate(params.user, params.asset, info.op.native, info.value.native);
    }
}