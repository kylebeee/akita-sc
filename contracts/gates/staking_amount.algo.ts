import { Contract } from '@algorandfoundation/tealscript';
import { AKITA_TIME_LOCK_PLUGIN_ID, Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { AssetLock, StakeValue, StakingPlugin } from '../arc58/plugins/staking.algo';
import { AkitaAppIDsStakingPlugin } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
    LOCKS_AND_CHECKS_LENGTH_MISMATCH: 'Locks & checks do not match in length',
    BAD_OPERATION: 'bad operation check',
}

export const RegistryInfoParamsLength = len<Operator>() + len<AssetID>() + len<boolean>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    asset: AssetID;
    locked: boolean;
    amount: uint64;
}

export const StakingAmountGateCheckParamsLength = len<uint64>() + len<Address>();
export type StakingAmountGateCheckParams = {
    registryIndex: uint64;
    user: Address;
}

export class StakingAmountGate extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    private stakingAmountGate(user: Address, op: Operator, asset: AssetID, locked: boolean, amount: uint64): boolean {
        const lockInfo = sendMethodCall<typeof StakingPlugin.prototype.getInfo, StakeValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsStakingPlugin),
            methodArgs: [ user, { asset: asset, locked: locked } ],
            fee: 0,
        });

        if (op === Equal && lockInfo.amount !== amount) {
            return false;
        } else if (op === NotEqual && lockInfo.amount === amount) {
            return false;
        } else if (op === LessThan && lockInfo.amount >= amount) {
            return false;
        } else if (op === LessThanOrEqualTo && lockInfo.amount > amount) {
            return false;
        } else if (op === GreaterThan && lockInfo.amount <= amount) {
            return false;
        } else if (op === GreaterThanOrEqualTo && lockInfo.amount < amount) {
            return false;
        }

        return true;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegistryInfoParamsLength, errs.INVALID_ARG_COUNT);
        
        const params = castBytes<RegistryInfo>(args);
        assert(!(params.op > 5), errs.BAD_OPERATION);

        const counter = this.registryCounter.value;
        this.registry(counter).value = params;
        this.registryCounter.value += 1;
        return counter;
    }

    check(args: bytes): boolean {
        assert(args.length >= StakingAmountGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<StakingAmountGateCheckParams>(args);
        const info = this.registry(params.registryIndex).value;
        return this.stakingAmountGate(params.user, info.op, info.asset, info.locked, info.amount);
    }
}