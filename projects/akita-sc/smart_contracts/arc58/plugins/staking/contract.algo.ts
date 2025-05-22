import { Application, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { STAKING_TYPE_HARD, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_LOCK, StakingType } from "../../../staking/types"
import { classes } from 'polytype'
import { BaseStaking } from "../../../staking/base"
import { abiCall, abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4"
import { Staking } from "../../../staking/contract.algo"
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"
import { fee } from "../../../utils/constants"

export class StakingPlugin extends classes(BaseStaking, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }
  
  // STAKING PLUGIN METHODS -----------------------------------------------------------------------

  stake(
    walletID: uint64,
    rekeyBack: boolean,
    assetID: uint64,
    type: StakingType,
    amount: uint64,
    expiration: uint64,
    isUpdate: boolean
  ): void {
    const wallet = Application(walletID)
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
      abiCall(
        Staking.prototype.stake,
        {
          sender,
          appId: stakingAppID,
          args: [
            itxn.payment({
              sender,
              receiver: stakingApp.address,
              amount: sendAmount,
              fee,
            }),
            type,
            amount,
            expiration,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    } else {
      abiCall(
        Staking.prototype.stakeAsa,
        {
          sender,
          appId: stakingAppID,
          args: [
            itxn.payment({
              sender,
              receiver: stakingApp.address,
              amount: sendAmount,
              fee,
            }),
            itxn.assetTransfer({
              sender,
              assetReceiver: stakingApp.address,
              assetAmount: amount,
              xferAsset: assetID,
              fee,
            }),
            type,
            amount,
            expiration,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee,
        }
      )
    }
  }

  withdraw(
    walletID: uint64,
    rekeyBack: boolean,
    asset: uint64,
    type: StakingType
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Staking.prototype.withdraw,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [asset, type],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  createHeartbeat(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address,
    asset: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Staking.prototype.createHeartbeat,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [address, asset],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }

  softCheck(
    walletID: uint64,
    rekeyBack: boolean,
    address: Address,
    asset: uint64
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Staking.prototype.softCheck,
      {
        sender,
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [address, asset],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}
