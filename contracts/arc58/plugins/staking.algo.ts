import { Contract } from '@algorandfoundation/tealscript';
import { Staking, STAKING_TYPE_HARD, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_LOCK, STAKING_TYPE_SOFT, StakingType } from '../../staking/staking.algo';
import { AkitaAppIDsStaking } from '../../../utils/constants';

const lockMBR = 28_900;
const heartBeatMBR = 44_100;
// const ONE_YEAR = 31_536_000; // 365 days * 24 hours * 60 minutes * 60 seconds

// const errs = {
//     NO_LOCK: 'Lock not found',
//     BAD_EXPIRATION: 'Expiration must be in the future or hardlock disabled',
//     BAD_EXPIRATION_UPDATE: 'Expiration must be greater than or equal to the current unlock time or hardlock disabled',
//     LOCKED: 'This asset is still locked',
//     PLUGIN_NOT_AUTH_ADDR: 'This plugin does not have control of the account'
// }

export class StakingPlugin extends Contract {

    stake(
        sender: AppID,
        rekeyBack: boolean,
        asset: AssetID,
        type: StakingType,
        amount: uint64,
        expiration: uint64,
        isUpdate: boolean
    ): void {
        const akitaStakingApp = AppID.fromUint64(AkitaAppIDsStaking);
        const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK;
        const isAlgo = asset.id === 0;

        let sendAmount = 0;
        if (!isUpdate) {
            if (isEscrow && isAlgo) {
                sendAmount = amount + lockMBR;
            } else if (type === STAKING_TYPE_HEARTBEAT) {
                sendAmount = lockMBR + heartBeatMBR;
            } else {
                sendAmount = lockMBR
            }
        } else {
            if (isEscrow && isAlgo) {
                sendAmount = amount;
            }
        }

        if (isAlgo) {
            sendMethodCall<typeof Staking.prototype.stake, void>({
                applicationID: akitaStakingApp,
                methodArgs: [
                    {
                        sender: sender.address,
                        amount: sendAmount,
                        receiver: akitaStakingApp.address,
                    },
                    type,
                    amount,
                    expiration,
                    isUpdate
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        } else {
            sendMethodCall<typeof Staking.prototype.stakeAsa, void>({
                applicationID: akitaStakingApp,
                methodArgs: [
                    {
                        sender: sender.address,
                        amount: sendAmount,
                        receiver: akitaStakingApp.address,
                    },
                    {
                        sender: sender.address,
                        assetAmount: amount,
                        assetReceiver: akitaStakingApp.address,
                        xferAsset: asset,
                    },
                    type,
                    amount,
                    expiration,
                    isUpdate
                ],
                rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
                fee: 0,
            });
        }
    }

    withdraw(
        sender: AppID,
        rekeyBack: boolean,
        asset: AssetID,
        type: StakingType
    ): void {
        sendMethodCall<typeof Staking.prototype.withdraw, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsStaking),
            methodArgs: [ asset, type ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    createHeartbeat(
        sender: AppID,
        rekeyBack: boolean,
        address: Address,
        asset: AssetID
    ): void {
        sendMethodCall<typeof Staking.prototype.createHeartbeat, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsStaking),
            methodArgs: [ address, asset ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }

    softCheck(
        sender: AppID,
        rekeyBack: boolean,
        address: Address,
        asset: AssetID,
    ): void {
        sendMethodCall<typeof Staking.prototype.softCheck, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsStaking),
            methodArgs: [ address, asset ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        });
    }
}