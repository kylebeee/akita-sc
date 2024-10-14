import { Contract } from '@algorandfoundation/tealscript';

import { META_MERKLE_APP_ID, Operation } from './base.algo';
import { MetaMerkles } from '../metamerkles/metamerkles.algo';

export class AssetGatePlugin extends Contract {
    programVersion = 10;

    // gates based on holding an asset
    private assetGate(user: Address, asset: AssetID, op: Operation, value: uint64[]): boolean {
        if (op === Operation.Equal) {
            return user.assetBalance(asset) === value[0];
        } else if (op === Operation.NotEqual) {
            return user.assetBalance(asset) !== value[0];
        } else if (op === Operation.LessThan) {
            return user.assetBalance(asset) < value[0];
        } else if (op === Operation.LessThanOrEqualTo) {
            return user.assetBalance(asset) <= value[0];
        } else if (op === Operation.GreaterThan) {
            return user.assetBalance(asset) > value[0];
        } else if (op === Operation.GreaterThanOrEqualTo) {
            return user.assetBalance(asset) >= value[0];
        } else if (op === Operation.IncludedIn) {
            value.forEach((v) => {
                if (user.assetBalance(asset) === v)
                    return true;
            });
            
            return false;
        } else if (op === Operation.NotIncludedIn) {
            value.forEach((v) => {
                if (user.assetBalance(asset) === v)
                    return false;
            });
            
            return true;
        }

        return false
    }

    private assetMerkleGate(user: Address, asset: AssetID, rootCreator: Address, root: bytes32, proof: bytes32[], schema: uint64, treeType: uint64): boolean {

        if (!(user.assetBalance(asset) > 0)) {
            return false;
        }

        return sendMethodCall<typeof MetaMerkles.prototype.verify, boolean>({
            applicationID: AppID.fromUint64(META_MERKLE_APP_ID),
            methodArgs: [
                rootCreator,
                root,
                sha256(sha256(itob(asset.id))),
                proof,
                schema,
                treeType
            ],
            fee: 0,
        });
    }
}