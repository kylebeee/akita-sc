import { assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, interpretAsArc4 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo'
import { arc4ImpactGateCheckParams, arc4ImpactRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import { AkitaSocialImpact } from '../../../arc58/plugins/social/impact.algo'
import {
    Equal,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    NotEqual,
} from '../../../../utils/operators'
import { ERR_INVALID_ARG_COUNT } from '../../errors'

export class ImpactGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4ImpactRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private impactGate(user: Address, op: Operator, value: uint64): boolean {
        const impact = abiCall(AkitaSocialImpact.prototype.getUserImpact, {
            appId: super.getAppList().impact,
            args: [user],
        }).returnValue

        if (op === Equal) {
            return impact === value
        }
        if (op === NotEqual) {
            return impact !== value
        }
        if (op === LessThan) {
            return impact < value
        }
        if (op === LessThanOrEqualTo) {
            return impact <= value
        }
        if (op === GreaterThan) {
            return impact > value
        }
        if (op === GreaterThanOrEqualTo) {
            return impact >= value
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4ImpactRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4ImpactRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4ImpactGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4ImpactGateCheckParams>(args)
        const info = this.registry(params.registryID.native).value
        return this.impactGate(params.user, info.op.native, info.value.native)
    }
}
