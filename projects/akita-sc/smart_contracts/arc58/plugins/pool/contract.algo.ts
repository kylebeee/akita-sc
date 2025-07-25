import { BasePool } from "../../../pool/base";
import { classes } from 'polytype';
import { ServiceFactoryContract } from "../../../utils/base-contracts/factory";
import { abimethod, Application, assert, Asset, Bytes, Global, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { PoolPluginGlobalStateKeyFactory } from "./constants";
import { fmbr, getSpendingAccount, getStakingFees, rekeyAddress } from "../../../utils/functions";
import { StakingType } from "../../../staking/types";
import { Reward, StakeEntry } from "../../../pool/types";
import { abiCall, Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { RootKey } from "../../../meta-merkles/types";
import { PoolFactory } from "../../../pool/factory.algo";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants";
import { Pool } from "../../../pool/contract.algo";
import { GateArgs } from "../../../utils/types/gates";
import { ERR_NOT_A_VALID_POOL } from "./errors";
import { GlobalStateKeyAkitaEscrow } from "../../../constants";
import { btoi } from "@algorandfoundation/algorand-typescript/op";
import { PoolEntriesByAddressMBR, PoolEntriesMBR, PoolUniquesMBR, WinnerCountCap } from "../../../pool/constants";

export class PoolPlugin extends classes(BasePool, ServiceFactoryContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  factory = GlobalState<Application>({ key: PoolPluginGlobalStateKeyFactory })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: uint64): void {
    this.version.value = version
    this.factory.value = Application(factory)
  }

  // POOL PLUGIN METHODS --------------------------------------------------------------------------

  newPool(
    walletID: uint64,
    rekeyBack: boolean,
    title: string,
    type: StakingType,
    marketplace: Address,
    stakeKey: RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const fcosts = fmbr()
    const fees = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    const childContractMBR: uint64 = (
      fees.creationFee +
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
      Global.minBalance +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR
    })

    abiCall(
      PoolFactory.prototype.newPool,
      {
        sender,
        appId: this.factory.value,
        args: [
          mbrTxn,
          title,
          type,
          marketplace,
          stakeKey,
          minimumStakeAmount,
          gateID,
          maxEntries,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  initPool(
    walletID: uint64,
    rekeyBack: boolean,
    poolID: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Pool.prototype.init,
      {
        sender,
        appId: poolID,
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  deletePool(
    walletID: uint64,
    rekeyBack: boolean,
    poolID: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      PoolFactory.prototype.deletePool,
      {
        sender,
        appId: this.factory.value,
        args: [ poolID ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  addReward(
    walletID: uint64,
    rekeyBack: boolean,
    poolID: uint64,
    reward: Reward,
    amount: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    if (reward.asset === 0) {
      abiCall(
        Pool.prototype.addReward,
        {
          sender,
          appId: poolID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(poolID).address,
              amount: amount + this.rewardsMbr(reward.winnerCount)
            }),
            reward
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      )
    } else {
      // check if pool is opted into the reward asset
      if (!Application(poolID).address.isOptedIn(Asset(reward.asset))) {
        
        // get the akita dao escrow for the pool factory
        const escrowBytes = op.AppGlobal.getExBytes(this.factory.value, Bytes(GlobalStateKeyAkitaEscrow))[0]
        const escrow = Application(btoi(escrowBytes));
        let optinMBR: uint64 = Global.assetOptInMinBalance * (
          !escrow.address.isOptedIn(Asset(reward.asset)) ? 4 : 1
        )

        const rewardsMBR: uint64 = this.rewardsMbr(WinnerCountCap) * 2        

        abiCall(
          Pool.prototype.optin,
          {
            sender,
            appId: poolID,
            args: [
              itxn.payment({
                sender,
                receiver: Application(poolID).address,
                amount: optinMBR + rewardsMBR
              }),
              reward.asset,
            ]
          }
        )
      }

      abiCall(
        Pool.prototype.addRewardAsa,
        {
          sender,
          appId: poolID,
          args: [
            itxn.payment({
              sender,
              receiver: Application(poolID).address,
              amount: this.rewardsMbr(reward.winnerCount)
            }),
            itxn.assetTransfer({
              sender,
              assetReceiver: Application(poolID).address,
              assetAmount: amount,
              xferAsset: reward.asset
            }),
            reward
          ],
          rekeyTo: rekeyAddress(rekeyBack, wallet)
        }
      )
    }
  }

  finalizePool(
    walletID: uint64,
    rekeyBack: boolean,
    poolID: uint64,
    signupTimestamp: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    abiCall(
      Pool.prototype.finalize,
      {
        sender,
        appId: poolID,
        args: [
          signupTimestamp,
          startTimestamp,
          endTimestamp,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }

  enter(
    walletID: uint64,
    rekeyBack: boolean,
    poolID: uint64,
    entries: StakeEntry[],
    args: GateArgs
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    const entryMBR: uint64 = PoolEntriesMBR + PoolEntriesByAddressMBR
    let total: uint64 = entryMBR * entries.length
    
    const isEntered = abiCall(
      Pool.prototype.isEntered,
      {
        sender,
        appId: poolID,
        args: [ new Address(sender) ]
      }
    ).returnValue

    if (!isEntered) {
      total += PoolUniquesMBR
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(poolID).address,
      amount: total
    })

    abiCall(
      Pool.prototype.enter,
      {
        sender,
        appId: poolID,
        args: [
          mbrPayment,
          entries,
          args
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      }
    )
  }
}