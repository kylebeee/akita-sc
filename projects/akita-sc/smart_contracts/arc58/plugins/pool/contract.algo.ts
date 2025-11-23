import { abimethod, Account, Application, assert, Asset, Bytes, Global, GlobalState, itxn, op, uint64 } from "@algorandfoundation/algorand-typescript";
import { abiCall, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { btoi } from "@algorandfoundation/algorand-typescript/op";
import { GlobalStateKeyAkitaDAO, GlobalStateKeyAkitaEscrow, GlobalStateKeyVersion } from "../../../constants";
import { GateArgs } from "../../../gates/types";
import { RootKey } from "../../../meta-merkles/types";
import { PoolEntriesByAddressMBR, PoolEntriesMBR, PoolUniquesMBR, WinnerCountCap } from "../../../pool/constants";
import { Reward, StakeEntry } from "../../../pool/types";
import { StakingType } from "../../../staking/types";
import { GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants";
import { getSpendingAccount, getStakingFees, rekeyAddress } from "../../../utils/functions";
import { PoolPluginGlobalStateKeyFactory } from "./constants";
import { ERR_NOT_A_VALID_POOL } from "./errors";

// CONTRACT IMPORTS
import { BasePool } from "../../../pool/base";
import { Pool } from "../../../pool/contract.algo";
import type { PoolFactory } from "../../../pool/factory.algo";


export class PoolPlugin extends BasePool {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  version = GlobalState<string>({ key: GlobalStateKeyVersion })
  /** the factory contract */
  factory = GlobalState<Application>({ key: PoolPluginGlobalStateKeyFactory })
  /** the Akita DAO */
  akitaDAO = GlobalState<Application>({ key: GlobalStateKeyAkitaDAO })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, factory: Application, akitaDAO: Application): void {
    this.version.value = version
    this.factory.value = factory
    this.akitaDAO.value = akitaDAO
  }

  // POOL PLUGIN METHODS --------------------------------------------------------------------------

  newPool(
    wallet: Application,
    rekeyBack: boolean,
    title: string,
    type: StakingType,
    marketplace: Account,
    stakeKey: RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): void {
    const sender = getSpendingAccount(wallet)

    const fees = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    const childContractMBR: uint64 = (
      fees.creationFee +
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
      Global.minBalance
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR
    })

    abiCall<typeof PoolFactory.prototype.newPool>({
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
    })
  }

  initPool(
    wallet: Application,
    rekeyBack: boolean,
    poolID: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const sender = getSpendingAccount(wallet)

    abiCall<typeof Pool.prototype.init>({
      sender,
      appId: poolID,
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  deletePool(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application
  ): void {
    assert(appId.creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const sender = getSpendingAccount(wallet)

    abiCall<typeof PoolFactory.prototype.deletePool>({
      sender,
      appId: this.factory.value,
      args: [appId],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  addReward(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    reward: Reward,
    amount: uint64
  ): void {
    assert(appId.creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const sender = getSpendingAccount(wallet)

    if (reward.asset === 0) {
      abiCall<typeof Pool.prototype.addReward>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: amount + this.rewardsMbr(reward.winnerCount)
          }),
          reward
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
    } else {
      // check if pool is opted into the reward asset
      if (!appId.address.isOptedIn(Asset(reward.asset))) {

        // get the akita dao escrow for the pool factory
        const escrowBytes = op.AppGlobal.getExBytes(this.factory.value, Bytes(GlobalStateKeyAkitaEscrow))[0]
        const escrow = Application(btoi(escrowBytes));
        let optinMBR: uint64 = Global.assetOptInMinBalance * (
          !escrow.address.isOptedIn(Asset(reward.asset)) ? 4 : 1
        )

        const rewardsMBR: uint64 = this.rewardsMbr(WinnerCountCap) * 2

        abiCall<typeof Pool.prototype.optin>({
          sender,
          appId,
          args: [
            itxn.payment({
              sender,
              receiver: appId.address,
              amount: optinMBR + rewardsMBR
            }),
            reward.asset,
          ]
        })
      }

      abiCall<typeof Pool.prototype.addRewardAsa>({
        sender,
        appId,
        args: [
          itxn.payment({
            sender,
            receiver: appId.address,
            amount: this.rewardsMbr(reward.winnerCount)
          }),
          itxn.assetTransfer({
            sender,
            assetReceiver: appId.address,
            assetAmount: amount,
            xferAsset: reward.asset
          }),
          reward
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet)
      })
    }
  }

  finalizePool(
    wallet: Application,
    rekeyBack: boolean,
    poolID: uint64,
    signupTimestamp: uint64,
    startTimestamp: uint64,
    endTimestamp: uint64
  ): void {
    assert(Application(poolID).creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const sender = getSpendingAccount(wallet)

    abiCall<typeof Pool.prototype.finalize>({
      sender,
      appId: poolID,
      args: [
        signupTimestamp,
        startTimestamp,
        endTimestamp,
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }

  enter(
    wallet: Application,
    rekeyBack: boolean,
    appId: Application,
    entries: StakeEntry[],
    args: GateArgs
  ): void {
    assert(appId.creator === this.factory.value.address, ERR_NOT_A_VALID_POOL)

    const sender = getSpendingAccount(wallet)

    const entryMBR: uint64 = PoolEntriesMBR + PoolEntriesByAddressMBR
    let total: uint64 = entryMBR * entries.length

    const isEntered = abiCall<typeof Pool.prototype.isEntered>({
      sender,
      appId,
      args: [sender]
    }).returnValue

    if (!isEntered) {
      total += PoolUniquesMBR
    }

    const mbrPayment = itxn.payment({
      sender,
      receiver: appId.address,
      amount: total
    })

    abiCall<typeof Pool.prototype.enter>({
      sender,
      appId,
      args: [
        mbrPayment,
        entries,
        args
      ],
      rekeyTo: rekeyAddress(rekeyBack, wallet)
    })
  }
}