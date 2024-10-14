import { Contract } from '@algorandfoundation/tealscript';
import { AKITA_TIME_LOCK_PLUGIN_ID, Operation } from './base.algo';
import { AssetLock, StakeValue, StakingPlugin } from '../arc58/plugins/staking.algo';

const errs = {
    LOCKS_AND_CHECKS_LENGTH_MISMATCH: 'Locks & checks do not match in length',
    BAD_OPERATION: 'bad operation check',
}

const ONE_DAY = 86400
const ONE_YEAR_IN_DAYS = 365

interface AssetLockChecks {
    op: Operation;
    value: uint64;
}

interface LockExpirationChecks {
    power: uint64;
    op: Operation;
    value: uint64;
}

export class StakingGatePlugin extends Contract {
    programVersion = 10;

    private stakingAmountGate(user: Address, locks: AssetLock[], checks: AssetLockChecks[]): boolean {

        assert(locks.length === checks.length, errs.LOCKS_AND_CHECKS_LENGTH_MISMATCH)

        const lockInfo = sendMethodCall<typeof StakingPlugin.prototype.getInfoList, StakeValue[]>({
            applicationID: AppID.fromUint64(AKITA_TIME_LOCK_PLUGIN_ID),
            methodArgs: [ user, locks ],
            fee: 0,
        });

        for (let i = 0; i < checks.length; i++) {

            assert(checks[i].op > 5, errs.BAD_OPERATION);

            if (checks[i].op === Operation.Equal && lockInfo[i].amount !== checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.NotEqual && lockInfo[i].amount === checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.LessThan && lockInfo[i].amount >= checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.LessThanOrEqualTo && lockInfo[i].amount > checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.GreaterThan && lockInfo[i].amount <= checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.GreaterThanOrEqualTo && lockInfo[i].amount < checks[i].value) {
                return false;
            }
        }

        return true;
    }

    private stakingPowerGate(user: Address, assets: AssetID[], checks: LockExpirationChecks[]): boolean {

        assert(assets.length === checks.length, errs.LOCKS_AND_CHECKS_LENGTH_MISMATCH)

        const lockInfo = sendMethodCall<typeof StakingPlugin.prototype.getLockedInfoList, StakeValue[]>({
            applicationID: AppID.fromUint64(AKITA_TIME_LOCK_PLUGIN_ID),
            methodArgs: [ user, assets ],
            fee: 0,
        });
        
        for (let i = 0; i < checks.length; i++) {

            assert(checks[i].op > 5, errs.BAD_OPERATION);

            const remainingDays = (lockInfo[i].expiration - globals.latestTimestamp) / ONE_DAY;
            const power = (lockInfo[i].amount / ONE_YEAR_IN_DAYS) * remainingDays;

            if (checks[i].op === Operation.Equal && power !== checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.NotEqual && power === checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.LessThan && power >= checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.LessThanOrEqualTo && power > checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.GreaterThan && power <= checks[i].value) {
                return false;
            } else if (checks[i].op === Operation.GreaterThanOrEqualTo && power < checks[i].value) {
                return false;
            }
        }

        return true;
    }
}