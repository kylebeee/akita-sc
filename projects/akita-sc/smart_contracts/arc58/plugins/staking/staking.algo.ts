import { Application, itxn, uint64 } from "@algorandfoundation/algorand-typescript"
import { STAKING_TYPE_HARD, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_LOCK, StakingType } from "../../../staking/types"
import { classes } from 'polytype'
import { BaseStaking } from "../../../staking/base"
import { abiCall, abimethod, Address } from "@algorandfoundation/algorand-typescript/arc4"
import { Staking } from "../../../staking/contract.algo"
import { getAkitaAppList, getSpendingAccount, rekeyAddress } from "../../../utils/functions"
import { AkitaBaseContract } from "../../../utils/base-contracts/base"

export class StakingPlugin extends classes(BaseStaking, AkitaBaseContract) {

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  createApplication(akitaDAO: uint64, version: string): void {
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
              fee: 0,
            }),
            type,
            amount,
            expiration,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
              fee: 0,
            }),
            itxn.assetTransfer({
              sender,
              assetReceiver: stakingApp.address,
              assetAmount: amount,
              xferAsset: assetID,
              fee: 0,
            }),
            type,
            amount,
            expiration,
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet),
          fee: 0,
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
        fee: 0,
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
        fee: 0,
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
        fee: 0,
      }
    )
  }
}
