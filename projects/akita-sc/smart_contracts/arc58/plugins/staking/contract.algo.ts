import { Account, Application, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { abiCall, abimethod } from "@algorandfoundation/algorand-typescript/arc4"
import { classes } from 'polytype'
import { STAKING_TYPE_HARD, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_LOCK, StakingType } from "../../../staking/types"
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"

// CONTRACT IMPORTS
import { BaseStaking } from "../../../staking/base"
import type { Staking } from "../../../staking/contract.algo"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class StakingPlugin extends classes(BaseStaking, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // STAKING PLUGIN METHODS -----------------------------------------------------------------------

  stake(
    wallet: Application,
    rekeyBack: boolean,
    assetID: uint64,
    type: StakingType,
    amount: uint64,
    expiration: uint64,
    isUpdate: boolean
  ): void {
    const sender = getSpendingAccount(wallet)
    const stakingAppID = getAkitaAppList(this.akitaDAO.value).staking
    const stakingApp = Application(stakingAppID)

    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const isAlgo = assetID === 0

    const costs = this.mbr()

    let sendAmount: uint64 = 0
    if (!isUpdate) {
      if (isEscrow && isAlgo) {
        sendAmount = amount + costs.stakes
      } else if (type === STAKING_TYPE_HEARTBEAT) {
        sendAmount = (costs.stakes + costs.heartbeats)
      } else {
        sendAmount = costs.stakes
      }
    } else if (isEscrow && isAlgo) {
      sendAmount = amount
    }

    if (isAlgo) {
      abiCall<typeof Staking.prototype.stake>({
        sender,
        appId: stakingAppID,
        args: [
          itxn.payment({
            sender,
            receiver: stakingApp.address,
            amount: sendAmount,
          }),
          type,
          amount,
          expiration,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    } else {
      abiCall<typeof Staking.prototype.stakeAsa>({
        sender,
        appId: stakingAppID,
        args: [
          itxn.payment({
            sender,
            receiver: stakingApp.address,
            amount: sendAmount,
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: stakingApp.address,
            assetAmount: amount,
            xferAsset: assetID,
          }),
          type,
          amount,
          expiration,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
      })
    }
  }

  withdraw(
    wallet: Application,
    rekeyBack: boolean,
    asset: uint64,
    type: StakingType
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Staking.prototype.withdraw>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).staking,
      args: [asset, type],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  createHeartbeat(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    asset: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Staking.prototype.createHeartbeat>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).staking,
      args: [address, asset],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }

  softCheck(
    wallet: Application,
    rekeyBack: boolean,
    address: Account,
    asset: uint64
  ): void {
    const sender = getSpendingAccount(wallet)

    abiCall<typeof Staking.prototype.softCheck>({
      sender,
      appId: getAkitaAppList(this.akitaDAO.value).staking,
      args: [address, asset],
      rekeyTo: rekeyAddress(rekeyBack, wallet),
    })
  }
}
