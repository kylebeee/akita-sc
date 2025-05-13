import { Application, Asset, Global, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseRewards } from '../../../rewards/base'
import { classes } from 'polytype'
import { abiCall } from '@algorandfoundation/algorand-typescript/arc4'
import { Rewards } from '../../../rewards/contract.algo'
import { arc4Claims, arc4Reclaims, arc4UserAllocations } from '../../../rewards/types'
import { AkitaBaseContract } from '../../../utils/base-contracts/base'
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from '../../../utils/functions'
import { fee } from '../../../utils/constants'

export class RewardsPlugin extends classes(BaseRewards, AkitaBaseContract) {

  createDisbursement(
    walletID: uint64,
    rekeyBack: boolean,
    title: string,
    timeToUnlock: uint64,
    expiration: uint64,
    note: string
  ): uint64 {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const { disbursements: mbrAmount } = this.mbr(title, note)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards

    return abiCall(
      Rewards.prototype.createDisbursement,
      {
        sender,
        appId: rewardsID,
        args: [
          itxn.payment({
            sender,
            amount: mbrAmount,
            receiver: Application(rewardsID).address,
            fee,
          }),
          title,
          timeToUnlock,
          expiration,
          note,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    ).returnValue
  }

  editDisbursement(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    title: string,
    timeToUnlock: uint64,
    expiration: uint64,
    note: string
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Rewards.prototype.editDisbursement,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).rewards,
        args: [id, title, timeToUnlock, expiration, note],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  createUserAllocations(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    allocations: arc4UserAllocations,
    sum: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards

    const mbrAmount: uint64 = this.mbr('', '').userAllocations * allocations.length

    abiCall(
      Rewards.prototype.createUserAllocations,
      {
        sender,
        appId: rewardsID,
        args: [
          itxn.payment({
            sender,
            amount: mbrAmount + sum,
            receiver: Application(rewardsID).address,
            fee,
          }),
          id,
          allocations,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  createAsaUserAllocations(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    assetID: uint64,
    allocations: arc4UserAllocations,
    sum: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)
    const rewardsID = getAkitaAppList(this.akitaDAO.value).rewards
    const rewardsApp = Application(rewardsID)

    let mbrAmount: uint64 = this.mbr('', '').userAllocations * allocations.length
    if (!rewardsApp.address.isOptedIn(Asset(assetID))) {
      mbrAmount += Global.assetOptInMinBalance
    }

    abiCall(
      Rewards.prototype.createAsaUserAllocations,
      {
        sender,
        appId: rewardsApp,
        args: [
          itxn.payment({
            sender,
            amount: mbrAmount,
            receiver: rewardsApp.address,
            fee,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: rewardsApp.address,
            assetAmount: sum,
            xferAsset: assetID,
            fee,
          }),
          id,
          allocations
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  finalizeDisbursement(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Rewards.prototype.finalizeDisbursement,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).rewards,
        args: [id],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  claimRewards(
    walletID: uint64,
    rekeyBack: boolean,
    rewards: arc4Claims
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Rewards.prototype.claimRewards,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).rewards,
        args: [rewards],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  reclaimRewards(
    walletID: uint64,
    rekeyBack: boolean,
    id: uint64,
    reclaims: arc4Reclaims
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Rewards.prototype.reclaimRewards,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).rewards,
        args: [id, reclaims],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}
