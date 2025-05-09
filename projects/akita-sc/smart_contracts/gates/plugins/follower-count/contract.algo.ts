import { assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { arc4FollowerCountGateCheckParams, arc4FollowerCountRegistryInfo, FollowerCountRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import { AkitaSocialPlugin } from '../../../arc58/plugins/social/contract.algo'
import {
    Equal,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    NotEqual,
} from '../../../utils/operators'
import { ERR_INVALID_ARG_COUNT } from '../../errors'
import { MetaValue } from '../../../arc58/plugins/social/types'

export class FollowerCountGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4FollowerCountRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private followerCountGate(user: Address, op: Operator, value: uint64): boolean {

        const encodedMeta = itxn
            .applicationCall({
                appId: super.getPluginAppList().impact,
                appArgs: [
                    methodSelector(AkitaSocialPlugin.prototype.getMeta),
                    user
                ],
                fee: 0,
            })
            .submit()
            .lastLog

        const meta = decodeArc4<MetaValue>(encodedMeta)

        if (op === Equal) {
            return meta.followerCount === value
        }
        if (op === NotEqual) {
            return meta.followerCount !== value
        }
        if (op === LessThan) {
            return meta.followerCount < value
        }
        if (op === LessThanOrEqualTo) {
            return meta.followerCount <= value
        }
        if (op === GreaterThan) {
            return meta.followerCount > value
        }
        if (op === GreaterThanOrEqualTo) {
            return meta.followerCount >= value
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4FollowerCountRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4FollowerCountRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4FollowerCountGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4FollowerCountGateCheckParams>(args)
        const info = decodeArc4<FollowerCountRegistryInfo>(this.registry(params.registryID.native).value.bytes)
        return this.followerCountGate(params.user, info.op, info.value)
    }
}
