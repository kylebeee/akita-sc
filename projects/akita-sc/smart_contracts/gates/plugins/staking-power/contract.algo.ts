import { assert, BoxMap, bytes, Global, GlobalState, uint64 } from '@algorandfoundation/algorand-typescript'
import {
    abiCall,
    Address,
    interpretAsArc4,
    UintN64,
    UintN8,
} from '@algorandfoundation/algorand-typescript/arc4'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { GateGlobalStateKeyRegistryCursor } from '../../constants'
import { arc4StakingPowerGateCheckParams, arc4StakingPowerRegistryInfo } from './types'
import { Staking } from '../../../staking/contract.algo'
import { arc4StakeInfo, STAKING_TYPE_LOCK } from '../../../staking/types'
import {
    Equal,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo,
    NotEqual,
} from '../../../utils/operators'
import { ERR_BAD_OPERATION, ERR_INVALID_ARG_COUNT } from './errors'
import { ONE_DAY, ONE_YEAR_IN_DAYS } from './constants'

export class StakingPowerGate extends AkitaBaseContract {
    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4StakingPowerRegistryInfo>({ keyPrefix: '' })

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value
        this.registryCursor.value += 1
        return id
    }

    private stakingPowerGate(user: Address, op: UintN8, asset: uint64, power: uint64): boolean {
        const info = abiCall(Staking.prototype.getInfo, {
            appId: super.getAkitaAppList().staking,
            args: [
                user,
                new arc4StakeInfo({
                    asset: new UintN64(asset),
                    type: STAKING_TYPE_LOCK,
                }),
            ],
        }).returnValue

        const remainingDays = (info.expiration - Global.latestTimestamp) / ONE_DAY
        const userPower = (info.amount / ONE_YEAR_IN_DAYS) * remainingDays

        if (op === Equal) {
            return userPower === power
        }
        if (op === NotEqual) {
            return userPower !== power
        }
        if (op === LessThan) {
            return userPower < power
        }
        if (op === LessThanOrEqualTo) {
            return userPower <= power
        }
        if (op === GreaterThan) {
            return userPower > power
        }
        if (op === GreaterThanOrEqualTo) {
            return userPower >= power
        }

        return false
    }

    register(args: bytes): uint64 {
        assert(args.length === arc4StakingPowerRegistryInfo.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4StakingPowerRegistryInfo>(args)

        assert(params.op.native <= 6, ERR_BAD_OPERATION)
        const id = this.newRegistryID()
        this.registry(id).value = params
        return id
    }

    check(args: bytes): boolean {
        assert(args.length >= arc4StakingPowerGateCheckParams.length, ERR_INVALID_ARG_COUNT)
        const params = interpretAsArc4<arc4StakingPowerGateCheckParams>(args)
        const info = this.registry(params.registryID.native).value
        return this.stakingPowerGate(params.user, info.op, info.asset.native, info.power.native)
    }
}
