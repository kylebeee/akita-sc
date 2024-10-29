import { Contract } from '@algorandfoundation/tealscript';
import { AkitaSocialPlugin, MetaValue } from '../arc58/plugins/akita_social.algo';
import { AKITA_SOCIAL_PLUGIN_ID, Operator } from './gate.algo';
import { Equal, NotEqual, LessThan, LessThanOrEqualTo, GreaterThan, GreaterThanOrEqualTo, IncludedIn, NotIncludedIn } from './operators';


export class FollowerGatePlugin extends Contract {
    programVersion = 10;

    followGate(user: Address, index: uint64, follower: Address): boolean {
        return sendMethodCall<typeof AkitaSocialPlugin.prototype.isFollower, boolean>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [
                user,
                index,
                follower
            ],
            fee: 0,
        });
    }

    // gates based on follower count
    followerCountGate(user: Address, op: Operator, values: uint64[]): boolean {
        const meta = sendMethodCall<typeof AkitaSocialPlugin.prototype.getMeta, MetaValue>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [ user ],
            fee: 0,
        });

        if (op === Equal) {
            return meta.followerCount === values[0];
        } else if (op === NotEqual) {
            return meta.followerCount !== values[0];
        } else if (op === LessThan) {
            return meta.followerCount < values[0];
        } else if (op === LessThanOrEqualTo) {
            return meta.followerCount <= values[0];
        } else if (op === GreaterThan) {
            return meta.followerCount > values[0];
        } else if (op === GreaterThanOrEqualTo) {
            return meta.followerCount >= values[0];
        } else if (op === IncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (meta.followerCount === values[i]) { 
                    return true;
                }
            }

            return false;
        } else if (op === NotIncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (meta.followerCount === values[i]) {
                    return false;
                }
            }

            return true;
        }
        
        return false
    }

    followerIndexGate(user: Address, index: uint64, follower: Address, op: Operator, values: uint64[]): boolean {
        const isFollower = sendMethodCall<typeof AkitaSocialPlugin.prototype.isFollower, boolean>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [
                user,
                index,
                follower
            ],
            fee: 0,
        });

        if (!isFollower) {
            return false;
        }

        if (op === Equal) {
            return index === values[0];
        } else if (op === NotEqual) {
            return index !== values[0];
        } else if (op === LessThan) {
            return index < values[0];
        } else if (op === LessThanOrEqualTo) {
            return index <= values[0];
        } else if (op === GreaterThan) {
            return index > values[0];
        } else if (op === GreaterThanOrEqualTo) {
            return index >= values[0];
        } else if (op === IncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (index === values[i])
                    return true;
            }
            
            return false;
        } else if (op === NotIncludedIn) {
            for (let i = 0; i < values.length; i += 1) {
                if (index === values[i])
                    return false;
            }
            
            return true;
        }

        return false
    }
}