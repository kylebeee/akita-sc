import { arc4, assert, BoxMap, bytes, GlobalState, itxn, uint64 } from '@algorandfoundation/algorand-typescript';
import { AkitaBaseContract } from '../../../../utils/base_contracts/base.algo';
import { GateGlobalStateKeyRegistryCursor } from '../../constants';
import { arc4StakingAmountGateCheckParams, arc4StakingAmountRegistryInfo, arc4StakingType } from './types';
import { Operator } from '../../types';
import { Equal, GreaterThan, GreaterThanOrEqualTo, LessThan, LessThanOrEqualTo, NotEqual } from '../../../../utils/operators';
import { Address, decodeArc4, interpretAsArc4, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { arc4StakeInfo, StakeValue, STAKING_TYPE_HEARTBEAT } from '../../../staking/types';
import { Staking } from '../../../staking/staking.algo';
import { ERR_INVALID_ARG_COUNT } from '../../errors';
import { ERR_BAD_OPERATION } from './errors';

export class StakingAmountGate extends AkitaBaseContract {

    registryCursor = GlobalState<uint64>({ key: GateGlobalStateKeyRegistryCursor })

    registry = BoxMap<uint64, arc4StakingAmountRegistryInfo>({ keyPrefix: '' });

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
        type: uint64,
        includeStaked: boolean
    ): boolean {
        let staked: uint64 = 0

        if (type === STAKING_TYPE_HEARTBEAT) {
            // TODO: replace with itxn.abiCall when available
            const stakingInfoTxn = itxn
                .applicationCall({
                    appId: super.getAppList().staking,
                    appArgs: [
                        methodSelector(Staking.prototype.getHeartbeatAverage),
                        user,
                        new arc4.UintN64(asset),
                        new arc4.Bool(includeStaked)
                    ]
                })
                .submit()

            const info = decodeArc4<StakeValue>(stakingInfoTxn.lastLog)
            staked = info.amount
        } else {
            // TODO: replace with itxn.abiCall when available
            const stakingInfoTxn = itxn
                .applicationCall({
                    appId: super.getAppList().staking,
                    appArgs: [
                        methodSelector(Staking.prototype.mustGetInfo),
                        user,
                        new arc4StakeInfo({
                            asset: new arc4.UintN64(asset),
                            type: new arc4.UintN64(type),
                        }),
                    ]
                })
                .submit()

            const info = decodeArc4<StakeValue>(stakingInfoTxn.lastLog)
            staked = info.amount
        }

        if (op === Equal) {
            return staked === amount
        } else if (op === NotEqual) {
            return staked !== amount
        } else if (op === LessThan) {
            return staked < amount
        } else if (op === LessThanOrEqualTo) {
            return staked <= amount
        } else if (op === GreaterThan) {
            return staked > amount
        } else if (op === GreaterThanOrEqualTo) {
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
        const info = this.registry(params.registryID.native).value;
        return this.stakingAmountGate(
            params.user,
            info.op.native,
            info.asset.native,
            info.amount.native,
            info.type.native,
            info.includeStaked.native
        )
    }
}