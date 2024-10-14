import { Contract } from '@algorandfoundation/tealscript';
import { AkitaSocialPlugin, MetaValue } from '../arc58/plugins/akita_social.algo';
import { AKITA_SOCIAL_PLUGIN_ID, Operation } from './base.algo';

export class FollowerGatePlugin extends Contract {
    programVersion = 10;

    private followGate(user: Address, index: uint64, follower: Address): boolean {
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
    private followerCountGate(user: Address, op: Operation, value: uint64[]): boolean {
        const meta = sendMethodCall<typeof AkitaSocialPlugin.prototype.getMeta, MetaValue>({
            applicationID: AppID.fromUint64(AKITA_SOCIAL_PLUGIN_ID),
            methodArgs: [ user ],
            fee: 0,
        });

        if (op === Operation.Equal) {
            return meta.followerCount === value[0];
        } else if (op === Operation.NotEqual) {
            return meta.followerCount !== value[0];
        } else if (op === Operation.LessThan) {
            return meta.followerCount < value[0];
        } else if (op === Operation.LessThanOrEqualTo) {
            return meta.followerCount <= value[0];
        } else if (op === Operation.GreaterThan) {
            return meta.followerCount > value[0];
        } else if (op === Operation.GreaterThanOrEqualTo) {
            return meta.followerCount >= value[0];
        } else if (op === Operation.IncludedIn) {
            value.forEach((v) => {
                if (meta.followerCount === v)
                    return true;
            });

            return false;
        } else if (op === Operation.NotIncludedIn) {
            value.forEach((v) => {
                if (meta.followerCount === v)
                    return false;
            });

            return true;
        }
        
        return false
    }

    private followerIndexGate(user: Address, index: uint64, follower: Address, op: Operation, value: uint64[]): boolean {
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

        if (op === Operation.Equal) {
            return index === value[0];
        } else if (op === Operation.NotEqual) {
            return index !== value[0];
        } else if (op === Operation.LessThan) {
            return index < value[0];
        } else if (op === Operation.LessThanOrEqualTo) {
            return index <= value[0];
        } else if (op === Operation.GreaterThan) {
            return index > value[0];
        } else if (op === Operation.GreaterThanOrEqualTo) {
            return index >= value[0];
        } else if (op === Operation.IncludedIn) {
            value.forEach((v) => {
                if (index === v)
                    return true;
            });
            
            return false;
        } else if (op === Operation.NotIncludedIn) {
            value.forEach((v) => {
                if (index === v)
                    return false;
            });
            
            return true;
        }

        return false
    }
}