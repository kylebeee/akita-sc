import { Contract } from '@algorandfoundation/tealscript';
import { AkitaSocialPlugin, MetaValue } from '../arc58/plugins/akita_social.algo';
import { AKITA_SOCIAL_PLUGIN_ID, Operation } from './base.algo';

export class ImpactGatePlugin extends Contract {
    programVersion = 10;

    private impactGate(user: Address, op: Operation, value: uint64[]): boolean {
        const impact = sendMethodCall<typeof AkitaSocialPlugin.prototype.getUserImpact, MetaValue>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [ user ],
            fee: 0,
        });

        if (op === Operation.Equal) {
            return impact === value[0];
        } else if (op === Operation.NotEqual) {
            return impact !== value[0];
        } else if (op === Operation.LessThan) {
            return impact < value[0];
        } else if (op === Operation.LessThanOrEqualTo) {
            return impact <= value[0];
        } else if (op === Operation.GreaterThan) {
            return impact > value[0];
        } else if (op === Operation.GreaterThanOrEqualTo) {
            return impact >= value[0];
        } else if (op === Operation.IncludedIn) {
            value.forEach((v) => {
                if (impact === v)
                    return true;
            });

            return false;
        } else if (op === Operation.NotIncludedIn) {
            value.forEach((v) => {
                if (impact === v)
                    return false;
            });
            
            return true;
        }

        return false
    }
}