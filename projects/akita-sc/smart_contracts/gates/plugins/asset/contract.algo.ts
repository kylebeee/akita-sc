import { arc4, assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, decodeArc4, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Operator } from '../../types'
import {
    Equal,
    NotEqual,
    LessThan,
    LessThanOrEqualTo,
    GreaterThan,
    GreaterThanOrEqualTo,
} from '../../../utils/operators'
import { arc4AssetGateCheckParams, arc4RegistryInfo, AssetGateCheckParams, RegistryInfo } from './types'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'

export class AssetGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4RegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    // gates based on holding an asset
    private assetGate(user: Address, asset: uint64, operator: Operator, value: uint64): boolean {
        const [balance, optedIn] = AssetHolding.assetBalance(user.native, asset)

        if (!optedIn) {
            return false
        }

        if (operator === Equal) {
            return balance === value
        }
        if (operator === NotEqual) {
            return balance !== value
        }
        if (operator === LessThan) {
            return balance < value
        }
        if (operator === LessThanOrEqualTo) {
            return balance <= value
        }
        if (operator === GreaterThan) {
            return balance > value
        }
        if (operator === GreaterThanOrEqualTo) {
            return balance >= value
        }

        return false
    }

    createApplication(): void {
        this.registryCursor.value = 0
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4RegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4RegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4AssetGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = decodeArc4<AssetGateCheckParams>(args)
        const info = decodeArc4<RegistryInfo>(this.registry(params.registryID).value.bytes)
        return this.assetGate(params.user, params.asset, info.op, info.value)
    }
}
