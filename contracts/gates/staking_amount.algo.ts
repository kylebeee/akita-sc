import { Contract } from '@algorandfoundation/tealscript';
import { Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo } from '../../utils/operators';
import { StakeValue, Staking, StakingType } from '../staking/staking.algo';
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
    type: StakingType;
    amount: uint64;
}

export const StakingAmountGateCheckParamsLength = len<Address>() + len<uint64>();
export type StakingAmountGateCheckParams = {
    user: Address;
    registryID: uint64;
}

export class StakingAmountGate extends Contract {
    programVersion = 10;

    registryCursor = GlobalStateKey<uint64>({ key: 'registry_cursor' });

    registry = BoxMap<uint64, RegistryInfo>();

    private newRegistryID(): uint64 {
        const id = this.registryCursor.value;
        this.registryCursor.value += 1;
        return id;
    }

    private stakingAmountGate(user: Address, op: Operator, asset: AssetID, type: StakingType, amount: uint64): boolean {
        const lockInfo = sendMethodCall<typeof Staking.prototype.getInfo, StakeValue>({
            applicationID: AppID.fromUint64(AkitaAppIDsStakingPlugin),
            methodArgs: [ user, { asset: asset, type: type } ],
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

        const id = this.newRegistryID();
        this.registry(id).value = params;
        return id;
    }

    check(args: bytes): boolean {
        assert(args.length >= StakingAmountGateCheckParamsLength, errs.INVALID_ARG_COUNT);
        const params = castBytes<StakingAmountGateCheckParams>(args);
        const info = this.registry(params.registryID).value;
        return this.stakingAmountGate(params.user, info.op, info.asset, info.type, info.amount);
    }
}