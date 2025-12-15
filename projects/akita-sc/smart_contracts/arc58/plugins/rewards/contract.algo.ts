import { Application, Asset, Global, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod } from '@algorandfoundation/algorand-typescript/arc4'
import { classes } from 'polytype'
import { AllocationReclaimDetails, ClaimDetails, UserAllocation } from '../../../rewards/types'
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from '../../../utils/functions'

// CONTRACT IMPORTS
import { BaseRewards } from '../../../rewards/base'
import type { Rewards } from '../../../rewards/contract.algo'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'

export class RewardsPlugin extends classes(BaseRewards, AkitaBaseContract) {

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
  }

  createDisbursement(
    wallet: Application,
    rekeyBack: boolean,
    title: string,
    timeToUnlock: uint64,
    expiration: uint64,
    note: string
  ): uint64 {
    const sender = getSpendingAccount(wallet)

    const { disbursements: mbrAmount } = this.mbr(title, note)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards

    return abiCall<typeof Rewards.prototype.createDisbursement>({
      sender,
      appId: rewardsID,
      args: [
        itxn.payment({
          sender,
          amount: mbrAmount,
          receiver: Application(rewardsID).address,
        }),
        title,
        timeToUnlock,
        expiration,
        note,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    }).returnValue
  }

  editDisbursement(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    title: string,
    timeToUnlock: uint64,
    expiration: uint64,
    note: string
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Rewards.prototype.editDisbursement>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).rewards,
      args: [id, title, timeToUnlock, expiration, note],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  createUserAllocations(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    allocations: UserAllocation[],
    sum: uint64
  ): void {
    const sender = getSpendingAccount(wallet)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards

    const mbrAmount: uint64 = this.mbr('', '').userAllocations * allocations.length

    abiCall<typeof Rewards.prototype.createUserAllocations>({
      sender,
      appId: rewardsID,
      args: [
        itxn.payment({
          sender,
          amount: mbrAmount + sum,
          receiver: Application(rewardsID).address,
        }),
        id,
        allocations,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  createAsaUserAllocations(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    assetID: uint64,
    allocations: UserAllocation[],
    sum: uint64
  ): void {
    const sender = getSpendingAccount(wallet)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards
    const rewardsApp = Application(rewardsID)

    let mbrAmount: uint64 = this.mbr('', '').userAllocations * allocations.length
    if (!rewardsApp.address.isOptedIn(Asset(assetID))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    abiCall<typeof Rewards.prototype.createAsaUserAllocations>({
      sender,
      appId: rewardsApp,
      args: [
        itxn.payment({
          sender,
          amount: mbrAmount,
          receiver: rewardsApp.address,
        }),
        itxn.assetTransfer({
          sender,
          assetReceiver: rewardsApp.address,
          assetAmount: sum,
          xferAsset: assetID,
        }),
        id,
        allocations
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  finalizeDisbursement(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Rewards.prototype.finalizeDisbursement>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).rewards,
      args: [id],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  claimRewards(
    wallet: Application,
    rekeyBack: boolean,
    rewards: ClaimDetails[]
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Rewards.prototype.claimRewards>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).rewards,
      args: [rewards],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  reclaimRewards(
    wallet: Application,
    rekeyBack: boolean,
    id: uint64,
    reclaims: AllocationReclaimDetails[]
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Rewards.prototype.reclaimRewards>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).rewards,
      args: [id, reclaims],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
