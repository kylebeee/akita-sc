import { arc4, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo'
import { arc4FollowerIndexGateCheckParams, arc4FollowerIndexRegistryInfo } from './types'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { Operator } from '../../types'
import {
    Equal,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    NotEqual,
} from '../../../../utils/operators'
import { AkitaSocialPlugin } from '../../../arc58/plugins/social/social.algo'
import { ERR_INVALID_ARG_COUNT } from '../../errors'

export class FollowerIndexGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4FollowerIndexRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private followerIndexGate(user: Address, index: uint64, follower: Address, op: Operator, value: uint64): boolean {
        const isFollowerTxn = itxn
            .applicationCall({
                appId: super.getAppList().social,
                appArgs: [methodSelector(AkitaSocialPlugin.prototype.isFollower), user, index, follower],
            })
            .submit()

        const isFollower = decodeArc4<boolean>(isFollowerTxn.lastLog)

        if (!isFollower) {
            return false
        }

        if (op === Equal) {
            return index === value
        }
        if (op === NotEqual) {
            return index !== value
        }
        if (op === LessThan) {
            return index < value
        }
        if (op === LessThanOrEqualTo) {
            return index <= value
        }
        if (op === GreaterThan) {
            return index > value
        }
        if (op === GreaterThanOrEqualTo) {
            return index >= value
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4FollowerIndexRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4FollowerIndexRegistryInfo>(args)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4FollowerIndexGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4FollowerIndexGateCheckParams>(args)
        const info = this.registry(params.registryID.native).value
        return this.followerIndexGate(
            info.user,
            params.index.native,
            params.follower,
            info.op.native,
            info.value.native
        )
    }
}
