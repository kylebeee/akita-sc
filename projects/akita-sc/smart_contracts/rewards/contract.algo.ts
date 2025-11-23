import {
  Application,
  assert,
  assertMatch,
  BoxMap,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import {
  ERR_INVALID_PAYMENT,
  ERR_INVALID_TRANSFER,
} from '../utils/errors'

import {
  MinDisbursementsMBR,
  RewardsBoxPrefixDisbursements,
  RewardsBoxPrefixUserAllocations,
  RewardsGlobalStateKeyDisbursementID,
  UserAllocationMBR,
} from './constants'
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
  ERR_YOU_ARE_NOT_THE_CREATOR,
} from './errors'
import {
  AllocationReclaimDetails,
  ClaimDetails,
  DisbursementDetails,
  UserAllocation,
  UserAllocationsKey,
} from './types'

// CONTRACT IMPORTS
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { ContractWithOptIn } from '../utils/base-contracts/optin'
import { BaseRewards } from './base'


export class Rewards extends classes(BaseRewards, AkitaBaseContract, ContractWithOptIn) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the disbursement id cursor */
  disbursementID = GlobalState<uint64>({ key: RewardsGlobalStateKeyDisbursementID })

  // BOXES ----------------------------------------------------------------------------------------

  /** the disbursement map of tokens
   *
   * the key is the uint64 id of the disbursement
   * the value is the details of the disbursement
   *
   */
  disbursements = BoxMap<uint64, DisbursementDetails>({ keyPrefix: RewardsBoxPrefixDisbursements })
  /** the user allocations of disbursements
   *
   * the key is the address of the qualified account with the uint64 id of the disbursement
   * the value is the amount they are owed
   */
  userAllocations = BoxMap<UserAllocationsKey, uint64>({ keyPrefix: RewardsBoxPrefixUserAllocations })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newDisbursementID(): uint64 {
    const id = this.disbursementID.value
    this.disbursementID.value += 1
    return id
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // REWARDS METHODS ------------------------------------------------------------------------------

  createDisbursement(
    mbrPayment: gtxn.PaymentTxn,
    title: string,
    timeToUnlock: uint64,
    expiration: uint64,
    note: string
  ): uint64 {
    const id = this.newDisbursementID()

    const costs = this.mbr(title, note)
    const mbrAmount = costs.disbursements

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount,
      },
      ERR_INVALID_PAYMENT
    )

    this.disbursements(id).value = {
      creator: Txn.sender,
      finalized: false,
      title,
      amount: 0,
      timeToUnlock,
      expiration,
      allocations: 0,
      distributed: 0,
      note,
    }

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

    const { creator, finalized } = this.disbursements(id).value
    assert(Txn.sender === creator, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(finalized === false, ERR_DISBURSEMENT_ALREADY_FINAL)

    this.disbursements(id).value.title = title
    this.disbursements(id).value.timeToUnlock = timeToUnlock
    this.disbursements(id).value.expiration = expiration
    this.disbursements(id).value.note = note
  }

  createUserAllocations(
    payment: gtxn.PaymentTxn,
    id: uint64,
    allocations: UserAllocation[]
  ): void {
    assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const { finalized, title, note } = this.disbursements(id).value
    assert(!finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

    let sum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: id,
        address: allocations[i].address,
        asset: 0,
      }

      assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

      this.userAllocations(userAllocationsKey).value = allocations[i].amount
      this.disbursements(id).value.allocations += 1
      this.disbursements(id).value.amount += allocations[i].amount

      sum += allocations[i].amount
    }

    const costs = this.mbr(title, note)
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
    allocations: UserAllocation[]
  ): void {
    assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

    const { finalized, title, note } = this.disbursements(id).value
    assert(!finalized, ERR_DISBURSEMENT_ALREADY_FINAL)

    let matchSum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: id,
        address: allocations[i].address,
        asset: assetXfer.xferAsset.id,
      }
      assert(!this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_ALREADY_EXISTS)

      this.userAllocations(userAllocationsKey).value = allocations[i].amount

      this.disbursements(id).value.allocations += 1
      this.disbursements(id).value.amount += allocations[i].amount

      matchSum += allocations[i].amount
    }

    // each user allocation box raises the MBR by 24,900 microAlgo
    const costs = this.mbr(title, note)
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

    const { creator, finalized, timeToUnlock, expiration, amount, allocations } = this.disbursements(id).value
    assert(Txn.sender === creator, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(!finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
    assert(
      timeToUnlock >= Global.latestTimestamp || timeToUnlock === 0,
      ERR_INVALID_DISBURSEMENT_UNLOCK_TIME
    )
    assert(
      expiration >= Global.latestTimestamp + 60 || expiration === 0,
      ERR_INVALID_DISBURSEMENT_EXPIRATION_TIME
    )
    assert(amount > 0, ERR_DISBURSEMENTS_CANNOT_BE_EMPTY)
    assert(allocations > 0, ERR_DISBURSEMENTS_MUST_HAVE_ALLOCATIONS)

    this.disbursements(id).value.finalized = true
  }

  createInstantDisbursement(
    mbrPayment: gtxn.PaymentTxn,
    timeToUnlock: uint64,
    expiration: uint64,
    allocations: UserAllocation[]
  ): uint64 {
    const id = this.newDisbursementID()

    const mbrAmount: uint64 = MinDisbursementsMBR + (UserAllocationMBR * allocations.length)

    let sum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: id,
        address: allocations[i].address,
        asset: 0,
      }

      this.userAllocations(userAllocationsKey).value = allocations[i].amount
      sum += allocations[i].amount
    }

    assertMatch(
      mbrPayment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbrAmount + sum,
      },
      ERR_INVALID_PAYMENT
    )

    this.disbursements(id).value = {
      creator: Txn.sender,
      finalized: true,
      title: '',
      amount: sum,
      timeToUnlock,
      expiration,
      allocations: allocations.length,
      distributed: 0,
      note: '',
    }

    return id
  }

  createInstantAsaDisbursement(
    mbrPayment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    timeToUnlock: uint64,
    expiration: uint64,
    allocations: UserAllocation[]
  ): uint64 {
    const id = this.newDisbursementID()

    const mbrAmount: uint64 = MinDisbursementsMBR + (UserAllocationMBR * allocations.length)

    let sum: uint64 = 0
    for (let i: uint64 = 0; i < allocations.length; i += 1) {
      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: id,
        address: allocations[i].address,
        asset: assetXfer.xferAsset.id,
      }

      this.userAllocations(userAllocationsKey).value = allocations[i].amount
      sum += allocations[i].amount
    }

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
        assetAmount: sum,
      },
      ERR_INVALID_TRANSFER
    )

    this.disbursements(id).value = {
      creator: Txn.sender,
      finalized: true,
      title: '',
      amount: sum,
      timeToUnlock,
      expiration,
      allocations: allocations.length,
      distributed: 0,
      note: '',
    }

    return id 
  }

  claimRewards(rewards: ClaimDetails[]): void {
    for (let i: uint64 = 0; i < rewards.length; i += 1) {
      assert(this.disbursements(rewards[i].id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)

      const { timeToUnlock, expiration, amount, distributed, creator, note } = this.disbursements(rewards[i].id).value
      assert(timeToUnlock <= Global.latestTimestamp, ERR_DISBURSEMENT_LOCKED)
      assert(expiration >= Global.latestTimestamp, ERR_DISBURSEMENT_LOCKED)
      assert(amount > distributed, ERR_DISBURSEMENT_FULLY_DISTRIBUTED)

      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: rewards[i].id,
        address: Txn.sender,
        asset: rewards[i].asset,
      }
      assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)
      const userAllocation = this.userAllocations(userAllocationsKey).value

      this.disbursements(rewards[i].id).value.allocations -= 1
      this.disbursements(rewards[i].id).value.distributed += userAllocation
      this.userAllocations(userAllocationsKey).delete()

      const creatorMBRRefund = itxn.payment({
        receiver: creator,
        amount: UserAllocationMBR,
      })

      const isAlgo = rewards[i].asset === 0

      if (!isAlgo) {
        const assetXfer = itxn.assetTransfer({
          assetReceiver: Txn.sender,
          assetAmount: userAllocation,
          xferAsset: rewards[i].asset,
          note,
        })

        itxn.submitGroup(creatorMBRRefund, assetXfer)
      } else {
        const payment = itxn.payment({
          receiver: Txn.sender,
          amount: userAllocation,
          note,
        })

        itxn.submitGroup(creatorMBRRefund, payment)
      }
    }
  }

  reclaimRewards(id: uint64, reclaims: AllocationReclaimDetails[]): void {
    assert(this.disbursements(id).exists, ERR_DISBURSEMENT_DOES_NOT_EXIST)
    const { creator, finalized, expiration } = this.disbursements(id).value

    assert(creator === Txn.sender, ERR_YOU_ARE_NOT_THE_CREATOR)
    assert(finalized, ERR_DISBURSEMENT_ALREADY_FINAL)
    assert(expiration <= Global.latestTimestamp, ERR_DISBURSEMENT_NOT_EXPIRED)

    for (let i: uint64 = 0; i < reclaims.length; i += 1) {
      const userAllocationsKey: UserAllocationsKey = {
        disbursementID: id,
        address: reclaims[i].address,
        asset: reclaims[i].asset,
      }
      assert(this.userAllocations(userAllocationsKey).exists, ERR_ALLOCATION_DOES_NOT_EXIST)

      const userAllocation = this.userAllocations(userAllocationsKey).value

      this.disbursements(id).value.allocations -= 1
      this.disbursements(id).value.amount -= userAllocation
      this.userAllocations(userAllocationsKey).delete()

      const isAlgo = reclaims[i].asset === 0

      if (!isAlgo) {
        const xfer = itxn.assetTransfer({
          assetReceiver: creator,
          assetAmount: userAllocation,
          xferAsset: reclaims[i].asset,
        })

        const mbrRefund = itxn.payment({
          receiver: creator,
          amount: UserAllocationMBR,
        })

        itxn.submitGroup(xfer, mbrRefund)
      } else {
        itxn
          .payment({
            receiver: creator,
            amount: userAllocation + UserAllocationMBR,
          })
          .submit()
      }
    }
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------
}