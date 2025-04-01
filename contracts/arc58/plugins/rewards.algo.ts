import { Contract } from '@algorandfoundation/tealscript'
import { Rewards, UserAlloction } from '../../rewards/rewards.algo'
import { AkitaAppIDsDAO, AkitaAppIDsRewards } from '../../../utils/constants'

const AKITA_DAO_REWARDS_DISTRIBUTION_FEE_KEY = 'rewards_distribution_fee'

export class RewardsPlugin extends Contract {
    programVersion = 10

    createDisbursement(
        sender: AppID,
        rekeyBack: boolean,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): uint64 {
        const mbrAmount = 2_500 + 400 * (65 + len(title) + len(note))
        const rewardApp = AppID.fromUint64(AkitaAppIDsRewards)
        const akitaDAO = AppID.fromUint64(AkitaAppIDsDAO)
        const akitaFee = akitaDAO.globalState(AKITA_DAO_REWARDS_DISTRIBUTION_FEE_KEY) as uint64

        return sendMethodCall<typeof Rewards.prototype.createDisbursement, uint64>({
            applicationID: rewardApp,
            methodArgs: [
                {
                    sender: sender.address,
                    amount: mbrAmount,
                    receiver: AppID.fromUint64(AkitaAppIDsRewards).address,
                },
                {
                    sender: sender.address,
                    amount: akitaFee,
                    receiver: akitaDAO.address,
                },
                title,
                timeToUnlock,
                expiration,
                note,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    editDisbursement(
        sender: AppID,
        rekeyBack: boolean,
        id: uint64,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): void {
        sendMethodCall<typeof Rewards.prototype.editDisbursement, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [id, title, timeToUnlock, expiration, note],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    createUserAllocations(
        sender: AppID,
        rekeyBack: boolean,
        id: uint64,
        allocations: UserAlloction[],
        sum: uint64
    ): void {
        const mbrAmount = 24_900 * allocations.length
        sendMethodCall<typeof Rewards.prototype.createUserAllocations, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [
                {
                    sender: sender.address,
                    amount: mbrAmount + sum,
                    receiver: AppID.fromUint64(AkitaAppIDsRewards).address,
                },
                id,
                allocations,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    createAsaUserAllocations(
        sender: AppID,
        rekeyBack: boolean,
        id: uint64,
        assetID: AssetID,
        allocations: UserAlloction[],
        sum: uint64
    ): void {
        let mbrAmount = 24_900 * allocations.length
        if (AppID.fromUint64(AkitaAppIDsRewards).address.isOptedInToAsset(assetID)) {
            mbrAmount += globals.assetOptInMinBalance
        }

        sendMethodCall<typeof Rewards.prototype.createAsaUserAllocations, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [
                {
                    sender: sender.address,
                    amount: mbrAmount,
                    receiver: AppID.fromUint64(AkitaAppIDsRewards).address,
                },
                {
                    sender: sender.address,
                    assetAmount: sum,
                    xferAsset: assetID,
                    assetReceiver: AppID.fromUint64(AkitaAppIDsRewards).address,
                },
                id,
                assetID,
                allocations,
                sum,
            ],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    finalizeDisbursement(sender: AppID, rekeyBack: boolean, id: uint64): void {
        sendMethodCall<typeof Rewards.prototype.finalizeDisbursement, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [id],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    claimRewards(sender: AppID, rekeyBack: boolean, ids: uint64[]): void {
        sendMethodCall<typeof Rewards.prototype.claimRewards, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [ids],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }

    reclaimRewards(sender: AppID, rekeyBack: boolean, id: uint64, allocations: UserAlloction[]): void {
        sendMethodCall<typeof Rewards.prototype.reclaimRewards, void>({
            applicationID: AppID.fromUint64(AkitaAppIDsRewards),
            methodArgs: [id, allocations],
            rekeyTo: rekeyBack ? sender.address : Address.zeroAddress,
            fee: 0,
        })
    }
}
