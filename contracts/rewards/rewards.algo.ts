import { arc4Zero, MAX_UINT64 } from '../../utils/constants';
import { ContractWithOptIn } from '../../utils/base_contracts/optin.algo';
import { arc4, assert, Asset, BoxMap, Global, GlobalState, gtxn, itxn, OnCompleteAction, Txn, uint64 } from '@algorandfoundation/algorand-typescript';
import { AkitaBaseContract } from '../../utils/base_contracts/base.algo';
import { classes } from 'polytype'
import { arc4AllocationReclaimDetails, arc4ClaimDetails, arc4DisbursementDetails, arc4UserAllocation, arc4UserAllocationsKey } from './types';
import { ERR_ALLOCATION_ALREADY_EXISTS, ERR_ALLOCATION_DOES_NOT_EXIST, ERR_DISBURSEMENT_ALREADY_FINAL, ERR_DISBURSEMENT_DOES_NOT_EXIST, ERR_DISBURSEMENT_FULLY_DISTRIBUTED, ERR_DISBURSEMENT_LOCKED, ERR_DISBURSEMENT_NOT_EXPIRED, ERR_DISBURSEMENTS_CANNOT_BE_EMPTY, ERR_DISBURSEMENTS_MUST_HAVE_ALLOCATIONS, ERR_INVALID_DISBURSEMENT_EXPIRATION_TIME, ERR_INVALID_DISBURSEMENT_UNLOCK_TIME, ERR_INVALID_MBR_AMOUNT, ERR_INVALID_SUM, ERR_YOU_ARE_NOT_THE_CREATOR } from './errors';
import { ERR_INVALID_ABI_METHOD, ERR_INVALID_APP_ID, ERR_INVALID_NUMBER_OF_APP_ARGS, ERR_INVALID_ON_COMPLETE, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../../utils/errors';
import { Address, methodSelector } from '@algorandfoundation/algorand-typescript/arc4';
import { AkitaDAO } from '../dao/dao.algo';
import { allocationMBR, RewardsBoxPrefixDisbursements, RewardsBoxPrefixUserAllocations, RewardsGlobalStateKeyDisbursementID } from './constants';

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
  userAllocations = BoxMap<arc4UserAllocationsKey, arc4.UintN64>({ keyPrefix: RewardsBoxPrefixUserAllocations })

  private newDisbursementID(): uint64 {
    const id = this.disbursementID.value
    this.disbursementID.value += 1
    return id
  }

  getDisbursementMBR(title: arc4.Str, note: arc4.Str): uint64 {
    const arc4Zero = new arc4.UintN64(0)
    const currentMBR = Global.minBalance
    this.disbursements(MAX_UINT64).value = new arc4DisbursementDetails({
      creator: new Address(Txn.sender),
      finalized: new arc4.Bool(false),
      title: title,
      amount: arc4Zero,
      timeToUnlock: arc4Zero,
      expiration: arc4Zero,
      allocations: arc4Zero,
      distributed: arc4Zero,
      note: note,
    })
    const afterMBR = Global.minBalance
    this.disbursements(MAX_UINT64).delete()
    return (afterMBR - currentMBR)
  }

  createDisbursement(
    mbrPayment: gtxn.PaymentTxn,
    feePayment: gtxn.PaymentTxn,
    akitaDAOReceivePayment: gtxn.ApplicationTxn,
    title: arc4.Str,
    timeToUnlock: arc4.UintN64,
    expiration: arc4.UintN64,
    note: arc4.Str,
  ): uint64 {

    const id = this.newDisbursementID()
    const arc4Zero = new arc4.UintN64(0)
    const currentMBR = Global.minBalance
    this.disbursements(id).value = new arc4DisbursementDetails({
      creator: new Address(Txn.sender),
      finalized: new arc4.Bool(false),
      title: title,
      amount: arc4Zero,
      timeToUnlock: timeToUnlock,
      expiration: expiration,
      allocations: arc4Zero,
      distributed: arc4Zero,
      note: note,
    })
    const afterMBR = Global.minBalance

    const mbrAmount = (afterMBR - currentMBR)

    assert(mbrPayment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(mbrPayment.amount === mbrAmount, ERR_INVALID_MBR_AMOUNT)

    const rewardsFee = this.getStakingFees().rewardsFee

    assert(feePayment.receiver === this.akitaDAO.value.address, ERR_INVALID_PAYMENT_RECEIVER)
    assert(feePayment.amount === rewardsFee, ERR_INVALID_MBR_AMOUNT)

    assert(akitaDAOReceivePayment.appId === this.akitaDAO.value, ERR_INVALID_APP_ID)
    // @ts-expect-error
    assert(akitaDAOReceivePayment.onCompletion === OnCompleteAction.NoOp, ERR_INVALID_ON_COMPLETE)
    assert(akitaDAOReceivePayment.appArgs.length > 1, ERR_INVALID_NUMBER_OF_APP_ARGS)
    assert(akitaDAOReceivePayment.appArgs(0) === methodSelector(AkitaDAO.prototype.receivePayment), ERR_INVALID_ABI_METHOD)

    return id
  }

  editDisbursement(
    id: uint64,
    title: arc4.Str,
    timeToUnlock: arc4.UintN64,
    expiration: arc4.UintN64,
    note: arc4.Str,
  ): void {
    assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const disbursement = this.disbursements(id).value.copy()
    assert(Txn.sender === disbursement.creator.native, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(disbursement.finalized.native === false, ERR_DISBURSEMENT_ALREADY_FINAL)

    this.disbursements(id).value = new arc4DisbursementDetails({
      ...disbursement,
      title: title,
      timeToUnlock: timeToUnlock,
      expiration: expiration,
      note: note,
    })
  }

  createUserAllocations(payment: gtxn.PaymentTxn, id: arc4.UintN64, allocations: arc4.DynamicArray<arc4UserAllocation>): void {
    assert(this.disbursements(id.native).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const disbursement = this.disbursements(id.native).value
    assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

    let sum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey = new arc4UserAllocationsKey({
        disbursementID: id,
        address: allocations[i].address,
        asset: arc4Zero,
      })
      assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

      this.userAllocations(userAllocationsKey).value = allocations[i].amount

      const newAllocAmount = new arc4.UintN64(this.disbursements(id.native).value.allocations.native + 1)
      this.disbursements(id.native).value.allocations = newAllocAmount
      const newAmount = new arc4.UintN64(this.disbursements(id.native).value.amount.native + allocations[i].amount.native)
      this.disbursements(id.native).value.amount = newAmount
      sum += allocations[i].amount.native
    }

    // each user allocation box raises the MBR by 24,900 microAlgo
    const mbrAmount = (24_900 * allocations.length)

    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(payment.amount === mbrAmount + sum, ERR_INVALID_PAYMENT_AMOUNT)
  }

  createAsaUserAllocations(
    mbrPayment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    id: arc4.UintN64,
    allocations: arc4.DynamicArray<arc4UserAllocation>,
  ): void {
    assert(this.disbursements(id.native).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const disbursement = this.disbursements(id.native).value
    assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

    let matchSum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey = new arc4UserAllocationsKey({
        disbursementID: id,
        address: allocations[i].address,
        asset: new arc4.UintN64(assetXfer.xferAsset.id),
      })
      assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

      this.userAllocations(userAllocationsKey).value = allocations[i].amount

      const newAllocAmount = new arc4.UintN64(this.disbursements(id.native).value.allocations.native + 1)
      this.disbursements(id.native).value.allocations = newAllocAmount
      const newAmount = new arc4.UintN64(this.disbursements(id.native).value.amount.native + allocations[i].amount.native)
      this.disbursements(id.native).value.amount = newAmount
      matchSum += allocations[i].amount.native
    }

    // each user allocation box raises the MBR by 24,900 microAlgo
    const mbrAmount = (24_900 * allocations.length)

    assert(mbrPayment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(mbrPayment.amount === mbrAmount, ERR_INVALID_MBR_AMOUNT)

    assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
    assert(assetXfer.assetAmount === matchSum, ERR_INVALID_SUM)
  }

  finalizeDisbursement(id: uint64): void {
    assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const disbursement = this.disbursements(id).value
    assert(Txn.sender === disbursement.creator.native, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(!disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
    assert(
      disbursement.timeToUnlock.native >= Global.latestTimestamp
      || disbursement.timeToUnlock.native === 0,
      ERR_INVALID_DISBURSEMENT_UNLOCK_TIME
    )
    assert(
      disbursement.expiration.native >= (Global.latestTimestamp + 60)
      || disbursement.expiration.native === 0,
      ERR_INVALID_DISBURSEMENT_EXPIRATION_TIME
    )
    assert(disbursement.amount.native > 0, ERR_DISBURSEMENTS_CANNOT_BE_EMPTY)
    assert(disbursement.allocations.native > 0, ERR_DISBURSEMENTS_MUST_HAVE_ALLOCATIONS)

    this.disbursements(id).value.finalized = new arc4.Bool(true)
  }

  claimRewards(rewards: arc4.DynamicArray<arc4ClaimDetails>): void {
    for (let i: uint64 = 0; i < rewards.length; i += 1) {
      assert(this.disbursements(rewards[i].id.native).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

      const disbursement = this.disbursements(rewards[i].id.native).value
      assert(disbursement.timeToUnlock.native <= (Global.latestTimestamp - 60), ERR_DISBURSEMENT_LOCKED)
      assert(disbursement.expiration.native >= Global.latestTimestamp, ERR_DISBURSEMENT_LOCKED)
      assert(disbursement.amount.native > disbursement.distributed.native, ERR_DISBURSEMENT_FULLY_DISTRIBUTED)

      const userAllocationsKey = new arc4UserAllocationsKey({
        disbursementID: rewards[i].id,
        address: new Address(Txn.sender),
        asset: rewards[i].asset,
      })
      assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)
      const userAllocation = this.userAllocations(userAllocationsKey).value

      const newAllocAmount = new arc4.UintN64(disbursement.allocations.native - 1)
      this.disbursements(rewards[i].id.native).value.allocations = newAllocAmount
      const newAmount = new arc4.UintN64(disbursement.amount.native - userAllocation.native)
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
          assetAmount: userAllocation.native,
          xferAsset: rewards[i].asset.native,
          fee: 0,
          note: disbursement.note.native,
        })

        itxn.submitGroup(creatorMBRRefund, assetXfer)
      } else {
        const payment = itxn.payment({
          receiver: Txn.sender,
          amount: userAllocation.native,
          fee: 0,
          note: disbursement.note.native,
        })

        itxn.submitGroup(creatorMBRRefund, payment)
      }
    }
  }

  reclaimRewards(id: arc4.UintN64, allocations: arc4.DynamicArray<arc4AllocationReclaimDetails>): void {
    assert(this.disbursements(id.native).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)
    const disbursement = this.disbursements(id.native).value

    assert(disbursement.creator.native === Txn.sender, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(disbursement.finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
    assert(disbursement.expiration.native <= Global.latestTimestamp, ERR_DISBURSEMENT_NOT_EXPIRED)

    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey = new arc4UserAllocationsKey({
        disbursementID: id,
        address: allocations[i].address,
        asset: allocations[i].asset,
      })
      assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)

      const userAllocation = this.userAllocations(userAllocationsKey).value
      this.disbursements(id.native).value.amount = userAllocation
      const newAllocAmount = new arc4.UintN64(disbursement.allocations.native - 1)
      this.disbursements(id.native).value.allocations = newAllocAmount
      this.userAllocations(userAllocationsKey).delete()

      const isAlgo = allocations[i].asset.native === 0

      if (!isAlgo) {
        const xfer = itxn.assetTransfer({
          assetReceiver: disbursement.creator.native,
          assetAmount: userAllocation.native,
          xferAsset: allocations[i].asset.native,
          fee: 0,
        })

        const mbrRefund = itxn.payment({
          receiver: disbursement.creator.native,
          amount: allocationMBR,
          fee: 0,
        })

        itxn.submitGroup(xfer, mbrRefund)
      } else {
        itxn
          .payment({
            receiver: disbursement.creator.native,
            amount: userAllocation.native + allocationMBR,
            fee: 0,
          })
          .submit()
      }
    }
  }
}