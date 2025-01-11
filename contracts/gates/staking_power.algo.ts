import { Contract } from '@algorandfoundation/tealscript';
import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { StakeValue, Staking } from '../staking/staking.algo';
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

export const StakingPowerGateCheckParamsLength = len<Address>() + len<uint64>();
export type StakingPowerGateCheckParams = {
    user: Address;
    registryID: uint64;
}

export class StakingPowerGate extends Contract {
    programVersion = 10;

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return id;
    }

    private stakingPowerGate(user: Address, op: Operator, asset: AssetID, power: uint64): boolean {
        const lockInfo = sendMethodCall<typeof Staking.prototype.getLockedInfo, StakeValue>({
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

        const id = this.newRegistryID();
        this.registry(id).value = castBytes<RegistryInfo>(args);
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length >= StakingPowerGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<StakingPowerGateCheckParams>(args);
        const info = this.registry(params.registryID).value;
        return this.stakingPowerGate(params.user, info.op, info.asset, info.power);
    }
}