import {
    arc4,
    assert,
    assertMatch,
    BoxMap,
    Bytes,
    Global,
    GlobalState,
    gtxn,
    itxn,
    OnCompleteAction,
    Txn,
    uint64,
} from '@algorandfoundation/algorand-typescript'
import { classes } from 'polytype'
import { Address, Bool, decodeArc4, methodSelector, Str, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4Zero } from '../../utils/constants'
import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo'
import { AkitaBaseContract } from '../../utils/base_contracts/base.algo'
import {
    arc4Claims,
    arc4DisbursementDetails,
    arc4Reclaims,
    arc4UserAllocations,
    arc4UserAllocationsKey,
    DisbursementDetails,
    RewardsMBRData,
} from './types'
import {
    ERR_ALLOCATION_ALREADY_EXISTS,
    ERR_ALLOCATION_DOES_NOT_EXIST,
    ERR_DISBURSEMENT_ALREADY_FINAL,
    ERR_DISBURSEMENT_DOES_NOT_EXIST,
    ERR_DISBURSEMENT_FULLY_DISTRIBUTED,
    ERR_DISBURSEMENT_LOCKED,
    ERR_DISBURSEMENT_NOT_EXPIRED,
    ERR_DISBURSEMENTS_CANNOT_BE_EMPTY,
    ERR_DISBURSEMENTS_MUST_HAVE_ALLOCATIONS,
    ERR_INVALID_DISBURSEMENT_EXPIRATION_TIME,
    ERR_INVALID_DISBURSEMENT_UNLOCK_TIME,
    ERR_INVALID_MBR_AMOUNT,
    ERR_YOU_ARE_NOT_THE_CREATOR,
} from './errors'
import {
    ERR_INVALID_ABI_METHOD,
    ERR_INVALID_APP_ID,
    ERR_INVALID_NUMBER_OF_APP_ARGS,
    ERR_INVALID_ON_COMPLETE,
    ERR_INVALID_PAYMENT,
    ERR_INVALID_PAYMENT_RECEIVER,
    ERR_INVALID_TRANSFER,
} from '../../utils/errors'
import { AkitaDAO } from '../dao/dao.algo'
import {
    allocationMBR,
    RewardsBoxPrefixDisbursements,
    RewardsBoxPrefixUserAllocations,
    RewardsGlobalStateKeyDisbursementID,
} from './constants'
import { len } from '@algorandfoundation/algorand-typescript/op'

export class Rewards extends classes(AkitaBaseContract, ContractWithOptIn) {
    /** the disbursement */
    disbursementID = GlobalState<uint64>({ key: RewardsGlobalStateKeyDisbursementID })

    /** the disbursement map of the bones token
     *
     * the key is the uint64 id of the disbursement
     * the value is the details of the disbursement
     *
     */
    disbursements = BoxMap<uint64, arc4DisbursementDetails>({ keyPrefix: RewardsBoxPrefixDisbursements })
    /** the user allocations of disbursements
     *
     * the key is the address of the qualified account with the uint64 id of the disbursement
     * the value is the asset and amount they are owed
     */
    userAllocations = BoxMap<arc4UserAllocationsKey, uint64>({ keyPrefix: RewardsBoxPrefixUserAllocations })


    mbr(title: string, note: string): RewardsMBRData {
        return {
            disbursements: 35_300 + (400 * (Bytes(title).length + Bytes(note).length)),
            userAllocations: 25_300
        }
    }

    private newDisbursementID(): uint64 {
        const id = this.disbursementID.value
        this.disbursementID.value += 1
        return id
    }

    createDisbursement(
        mbrPayment: gtxn.PaymentTxn,
        feePayment: gtxn.PaymentTxn,
        akitaDAOReceivePayment: gtxn.ApplicationCallTxn,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): uint64 {
        const id = this.newDisbursementID()
        const arc4Zero = new UintN64(0)

        const costs = this.mbr(title, note)
        const mbrAmount = costs.disbursements

        assert(mbrPayment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(mbrPayment.amount === mbrAmount, ERR_INVALID_MBR_AMOUNT)

        const rewardsFee = this.getStakingFees().rewardsFee

        assert(feePayment.receiver === this.akitaDAO.value.address, ERR_INVALID_PAYMENT_RECEIVER)
        assert(feePayment.amount === rewardsFee, ERR_INVALID_MBR_AMOUNT)

        assert(akitaDAOReceivePayment.appId === this.akitaDAO.value, ERR_INVALID_APP_ID)
        assert(akitaDAOReceivePayment.onCompletion === OnCompleteAction.NoOp, ERR_INVALID_ON_COMPLETE)
        assert(akitaDAOReceivePayment.numAppArgs > 1, ERR_INVALID_NUMBER_OF_APP_ARGS)
        assert(
            akitaDAOReceivePayment.appArgs(0) === methodSelector(AkitaDAO.prototype.receivePayment),
            ERR_INVALID_ABI_METHOD
        )

        this.disbursements(id).value = new arc4DisbursementDetails({
            creator: new Address(Txn.sender),
            finalized: new Bool(false),
            title: new Str(title),
            amount: arc4Zero,
            timeToUnlock: new UintN64(timeToUnlock),
            expiration: new UintN64(expiration),
            allocations: arc4Zero,
            distributed: arc4Zero,
            note: new Str(note),
        })

        return id
    }

    editDisbursement(
        id: uint64,
        title: string,
        timeToUnlock: uint64,
        expiration: uint64,
        note: string
    ): void {
        assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

        const disbursement = this.disbursements(id).value.copy()
        assert(Txn.sender === disbursement.creator.native, ERR_YOU_ARE_NOT_THE_CREATOR)
        assert(disbursement.finalized.native === false, ERR_DISBURSEMENT_ALREADY_FINAL)

        this.disbursements(id).value = new arc4DisbursementDetails({
            ...disbursement,
            title: new Str(title),
            timeToUnlock: new UintN64(timeToUnlock),
            expiration: new UintN64(expiration),
            note: new Str(note),
        })
    }

    createUserAllocations(
        payment: gtxn.PaymentTxn,
        id: uint64,
        allocations: arc4UserAllocations
    ): void {
        assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

        const disbursement = decodeArc4<DisbursementDetails>(this.disbursements(id).value.bytes)
        assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

        let sum: uint64 = 0
        for (let i: uint64 = 0; i < allocations.length; i += 1) {
            const userAllocationsKey = new arc4UserAllocationsKey({
                disbursementID: new UintN64(id),
                address: allocations[i].address,
                asset: arc4Zero,
            })
            assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

            this.userAllocations(userAllocationsKey).value = allocations[i].amount.native

            const newAllocAmount = new UintN64(this.disbursements(id).value.allocations.native + 1)
            this.disbursements(id).value.allocations = newAllocAmount
            const newAmount = new UintN64(
                this.disbursements(id).value.amount.native + allocations[i].amount.native
            )
            this.disbursements(id).value.amount = newAmount
            sum += allocations[i].amount.native
        }

        // each user allocation box raises the MBR by 24,900 microAlgo
        const costs = this.mbr(disbursement.title, disbursement.note)
        const mbrAmount: uint64 = costs.userAllocations * allocations.length

        assertMatch(
            payment,
            {
                receiver: Global.currentApplicationAddress,
                amount: mbrAmount + sum,
            },
            ERR_INVALID_PAYMENT
        )
    }

    createAsaUserAllocations(
        mbrPayment: gtxn.PaymentTxn,
        assetXfer: gtxn.AssetTransferTxn,
        id: uint64,
        allocations: arc4UserAllocations
    ): void {
        assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

        const disbursement = decodeArc4<DisbursementDetails>(this.disbursements(id).value.bytes)
        assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

        let matchSum: uint64 = 0
        for (let i: uint64 = 0; i < allocations.length; i += 1) {
            const userAllocationsKey = new arc4UserAllocationsKey({
                disbursementID: new UintN64(id),
                address: allocations[i].address,
                asset: new UintN64(assetXfer.xferAsset.id),
            })
            assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

            this.userAllocations(userAllocationsKey).value = allocations[i].amount.native

            const newAllocAmount = new UintN64(this.disbursements(id).value.allocations.native + 1)
            this.disbursements(id).value.allocations = newAllocAmount
            const newAmount = new UintN64(
                this.disbursements(id).value.amount.native + allocations[i].amount.native
            )
            this.disbursements(id).value.amount = newAmount
            matchSum += allocations[i].amount.native
        }

        // each user allocation box raises the MBR by 24,900 microAlgo
        const costs = this.mbr(disbursement.title, disbursement.note)
        const mbrAmount: uint64 = costs.userAllocations * allocations.length

        assertMatch(
            mbrPayment,
            {
                receiver: Global.currentApplicationAddress,
                amount: mbrAmount,
            },
            ERR_INVALID_PAYMENT
        )

        assertMatch(
            assetXfer,
            {
                assetReceiver: Global.currentApplicationAddress,
                assetAmount: matchSum,
            },
            ERR_INVALID_TRANSFER
        )
    }

    finalizeDisbursement(id: uint64): void {
        assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

        const disbursement = decodeArc4<DisbursementDetails>(this.disbursements(id).value.bytes)
        assert(Txn.sender === disbursement.creator.native, ERR_YOU_ARE_NOT_THE_CREATOR)
        assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
        assert(
            disbursement.timeToUnlock >= Global.latestTimestamp || disbursement.timeToUnlock === 0,
            ERR_INVALID_DISBURSEMENT_UNLOCK_TIME
        )
        assert(
            disbursement.expiration >= Global.latestTimestamp + 60 || disbursement.expiration === 0,
            ERR_INVALID_DISBURSEMENT_EXPIRATION_TIME
        )
        assert(disbursement.amount > 0, ERR_DISBURSEMENTS_CANNOT_BE_EMPTY)
        assert(disbursement.allocations > 0, ERR_DISBURSEMENTS_MUST_HAVE_ALLOCATIONS)

        this.disbursements(id).value.finalized = new Bool(true)
    }

    claimRewards(rewards: arc4Claims): void {
        for (let i: uint64 = 0; i < rewards.length; i += 1) {
            assert(this.disbursements(rewards[i].id.native).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

            const disbursement = decodeArc4<DisbursementDetails>(this.disbursements(rewards[i].id.native).value.bytes)
            assert(disbursement.timeToUnlock <= Global.latestTimestamp - 60, ERR_DISBURSEMENT_LOCKED)
            assert(disbursement.expiration >= Global.latestTimestamp, ERR_DISBURSEMENT_LOCKED)
            assert(disbursement.amount > disbursement.distributed, ERR_DISBURSEMENT_FULLY_DISTRIBUTED)

            const userAllocationsKey = new arc4UserAllocationsKey({
                disbursementID: rewards[i].id,
                address: new Address(Txn.sender),
                asset: rewards[i].asset,
            })
            assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)
            const userAllocation = this.userAllocations(userAllocationsKey).value

            const newAllocAmount = new UintN64(disbursement.allocations - 1)
            this.disbursements(rewards[i].id.native).value.allocations = newAllocAmount
            const newAmount = new UintN64(disbursement.amount - userAllocation)
            this.disbursements(rewards[i].id.native).value.distributed = newAmount
            this.userAllocations(userAllocationsKey).delete()

            const creatorMBRRefund = itxn.payment({
                receiver: disbursement.creator.native,
                amount: 24_900,
                fee: 0,
            })

            const isAlgo = rewards[i].asset.native === 0

            if (!isAlgo) {
                const assetXfer = itxn.assetTransfer({
                    assetReceiver: Txn.sender,
                    assetAmount: userAllocation,
                    xferAsset: rewards[i].asset.native,
                    fee: 0,
                    note: disbursement.note,
                })

                itxn.submitGroup(creatorMBRRefund, assetXfer)
            } else {
                const payment = itxn.payment({
                    receiver: Txn.sender,
                    amount: userAllocation,
                    fee: 0,
                    note: disbursement.note,
                })

                itxn.submitGroup(creatorMBRRefund, payment)
            }
        }
    }

    reclaimRewards(id: uint64, reclaims: arc4Reclaims): void {
        assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)
        const disbursement = decodeArc4<DisbursementDetails>(this.disbursements(id).value.bytes) 

        assert(disbursement.creator.native === Txn.sender, ERR_YOU_ARE_NOT_THE_CREATOR)
        assert(disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
        assert(disbursement.expiration <= Global.latestTimestamp, ERR_DISBURSEMENT_NOT_EXPIRED)

        for (let i: uint64 = 0; i < reclaims.length; i += 1) {
            const userAllocationsKey = new arc4UserAllocationsKey({
                disbursementID: new UintN64(id),
                address: reclaims[i].address,
                asset: reclaims[i].asset,
            })
            assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)

            const userAllocation = this.userAllocations(userAllocationsKey).value
            this.disbursements(id).value.amount = new UintN64(userAllocation)
            const newAllocAmount = new UintN64(disbursement.allocations - 1)
            this.disbursements(id).value.allocations = newAllocAmount
            this.userAllocations(userAllocationsKey).delete()

            const isAlgo = reclaims[i].asset.native === 0

            if (!isAlgo) {
                const xfer = itxn.assetTransfer({
                    assetReceiver: disbursement.creator.native,
                    assetAmount: userAllocation,
                    xferAsset: reclaims[i].asset.native,
                    fee: 0,
                })

                const mbrRefund = itxn.payment({
                    receiver: disbursement.creator.native,
                    amount: allocationMBR,
                    fee: 0,
                })

                itxn.submitGroup(xfer, mbrRefund)
            } else {
                itxn.payment({
                    receiver: disbursement.creator.native,
                    amount: userAllocation + allocationMBR,
                    fee: 0,
                }).submit()
            }
        }
    }
}