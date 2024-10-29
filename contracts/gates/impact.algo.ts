import { Contract } from '@algorandfoundation/tealscript';
import { AkitaSocialPlugin, MetaValue } from '../arc58/plugins/akita_social.algo';
import { AKITA_SOCIAL_PLUGIN_ID, Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from './operators';

export class ImpactGatePlugin extends Contract {
    programVersion = 10;

    impactGate(user: Address, op: Operator, values: uint64[]): boolean {
        const impact = sendMethodCall<typeof AkitaSocialPlugin.prototype.getUserImpact, MetaValue>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [ user ],
            fee: 0,
        });

        if (op === Equal) {
            return impact === values[0];
        } else if (op === NotEqual) {
            return impact !== values[0];
        } else if (op === LessThan) {
            return impact < values[0];
        } else if (op === LessThanOrEqualTo) {
            return impact <= values[0];
        } else if (op === GreaterThan) {
            return impact > values[0];
        } else if (op === GreaterThanOrEqualTo) {
            return impact >= values[0];
        } else if (op === IncludedIn) {
            for (let i = 0; i < values.length; i += 0) {
                if (impact === values[i]) {
                    return true;
                }
            }

            return false;
        } else if (op === NotIncludedIn) {
            for (let i = 0; i < values.length; i += 0) {
                if (impact === values[i]) {
                    return false;
                }
            }
            
            return true;
        }

        return false
    }
}