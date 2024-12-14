import { Contract } from '@algorandfoundation/tealscript';
import { AKITA_TIME_LOCK_PLUGIN_ID, Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { StakeValue, StakingPlugin } from '../arc58/plugins/staking.algo';
import { AkitaAppIDsStakingPlugin } from '../../utils/constants';

const errs = {
    INVALID_ARG_COUNT: 'Invalid number of arguments',
    LOCKS_AND_CHECKS_LENGTH_MISMATCH: 'Locks & checks do not match in length',
    BAD_OPERATION: 'bad operation check',
}

const ONE_DAY = 86400
const ONE_YEAR_IN_DAYS = 365

export const RegistryInfoParamsLength = len<Operator>() + len<AssetID>() + len<uint64>();
export type RegistryInfo = {
    op: Operator;
    asset: AssetID;
    power: uint64;
}

export const StakingPowerGateCheckParamsLength = len<uint64>() + len<Address>();
export type StakingPowerGateCheckParams = {
    registryIndex: uint64;
    user: Address;
}

export class StakingPowerGate extends Contract {
    programVersion = 10;

    registryCounter = GlobalStateKey<uint64>({ key: 'c' });

    registry = BoxMap<uint64, RegistryInfo>();

    private stakingPowerGate(user: Address, op: Operator, asset: AssetID, power: uint64): boolean {
        const lockInfo = sendMethodCall<typeof StakingPlugin.prototype.getLockedInfo, StakeValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsStakingPlugin),
            methodArgs: [ user, asset ],
            fee: 0,
        });
        
        const remainingDays = (lockInfo.expiration - globals.latestTimestamp) / ONE_DAY;
        const userPower = (lockInfo.amount / ONE_YEAR_IN_DAYS) * remainingDays;

        if (op === Equal && userPower !== power) {
            return false;
        } else if (op === NotEqual && userPower === power) {
            return false;
        } else if (op === LessThan && userPower >= power) {
            return false;
        } else if (op === LessThanOrEqualTo && userPower > power) {
            return false;
        } else if (op === GreaterThan && userPower <= power) {
            return false;
        } else if (op === GreaterThanOrEqualTo && userPower < power) {
            return false;
        }

        return true;
    }

    register(args: bytes): uint64 {
        assert(args.length === RegistryInfoParamsLength, errs.INVALID_ARG_COUNT);

        const params = castBytes<RegistryInfo>(args);
        assert(!(params.op > 5), errs.BAD_OPERATION);

        const counter = this.registryCounter.value;
        this.registry(counter).value = castBytes<RegistryInfo>(args);
        this.registryCounter.value += 1;
        return counter;
    }

    check(args: bytes): boolean {
        assert(args.length >= StakingPowerGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<StakingPowerGateCheckParams>(args);
        const info = this.registry(params.registryIndex).value;
        return this.stakingPowerGate(params.user, info.op, info.asset, info.power);
    }
}