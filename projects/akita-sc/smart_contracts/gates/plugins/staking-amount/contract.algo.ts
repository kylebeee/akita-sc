import { assert, BoxMap, bytes, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, Address, decodeArc4, interpretAsArc4, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4StakingAmountGateCheckParams, arc4StakingAmountRegistryInfo, StakingAmountRegistryInfo } from './types'
import { Operator } from '../../types'
import {
    Equal,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    NotEqual,
} from '../../../utils/operators'
import { arc4StakeInfo, STAKING_TYPE_HEARTBEAT } from '../../../staking/types'
import { Staking } from '../../../staking/contract.algo'
import { ERR_INVALID_ARG_COUNT } from './errors'
import { ERR_BAD_OPERATION } from '../staking-power/errors'

export class StakingAmountGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4StakingAmountRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private stakingAmountGate(
        user: Address,
        op: Operator,
        asset: uint64,
        amount: uint64,
        type: UintN8,
        includeStaked: boolean
    ): boolean {
        let staked: uint64 = 0

        if (type === STAKING_TYPE_HEARTBEAT) {
            staked = abiCall(Staking.prototype.getHeartbeatAverage, {
                appId: super.getAkitaAppList().staking,
                args: [user, asset, includeStaked],
                fee: 0,
            }).returnValue
        } else {
            const info = abiCall(Staking.prototype.mustGetInfo, {
                appId: super.getAkitaAppList().staking,
                args: [
                    user,
                    new arc4StakeInfo({
                        asset: new UintN64(asset),
                        type,
                    }),
                ],
                fee: 0,
            }).returnValue

            staked = info.amount
        }

        if (op === Equal) {
            return staked === amount
        }
        if (op === NotEqual) {
            return staked !== amount
        }
        if (op === LessThan) {
            return staked < amount
        }
        if (op === LessThanOrEqualTo) {
            return staked <= amount
        }
        if (op === GreaterThan) {
            return staked > amount
        }
        if (op === GreaterThanOrEqualTo) {
            return staked >= amount
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4StakingAmountRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4StakingAmountRegistryInfo>(args)
        // dont include the list operators includes & not includes
        assert(params.op.native <= 6, ERR_BAD_OPERATION)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length === arc4StakingAmountGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4StakingAmountGateCheckParams>(args)
        const info = decodeArc4<StakingAmountRegistryInfo>(this.registry(params.registryID.native).value.bytes)
        return this.stakingAmountGate(
            params.user,
            info.op,
            info.asset,
            info.amount,
            info.type,
            info.includeStaked
        )
    }
}
