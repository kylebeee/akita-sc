import { BasePool } from "../../../pool/base";
import { classes } from 'polytype';
import { ServiceFactoryContract } from "../../../utils/base-contracts/factory";
import { abimethod, Application, assert, Asset, Global, GlobalState, itxn, uint64 } from "@algorandfoundation/algorand-typescript";
import { PoolPluginGlobalStateKeyFactory } from "./constants";
import { fmbr, getSpendingAccount, getStakingFees, rekeyAddress } from "../../../utils/functions";
import { StakingType } from "../../../staking/types";
import { arc4Reward, StakeEntry } from "../../../pool/types";
import { abiCall, Address, compileArc4 } from "@algorandfoundation/algorand-typescript/arc4";
import { arc4RootKey } from "../../../meta-merkles/types";
import { PoolFactory } from "../../../pool/factory.algo";
import { AccountMinimumBalance, fee, GLOBAL_STATE_KEY_BYTES_COST, GLOBAL_STATE_KEY_UINT_COST, MAX_PROGRAM_PAGES } from "../../../utils/constants";
import { Pool } from "../../../pool/contract.algo";
import { GateArgs } from "../../../utils/types/gates";
import { ERR_NOT_A_VALID_POOL } from "./errors";

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
    reward: arc4Reward,
    marketplace: Address,
    stakeKey: arc4RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
  ): void {
    const wallet = Application(walletID)
    const sender = getSpendingAccount(wallet)

    if (!this.factory.value.address.isOptedIn(Asset(reward.asset.native))) {
      abiCall(
        PoolFactory.prototype.optin,
        {
          sender,
          appId: this.factory.value,
          args: [
            itxn.payment({
              sender,
              receiver: this.factory.value.address,
              amount: Global.assetOptInMinBalance,
              fee,
            }),
            reward.asset.native,
          ],
          fee,
        }
      )
    }

    let optinMBR: uint64 = 0
    const prizeAssetIsAlgo = reward.asset.native === 0
    if (prizeAssetIsAlgo) {
      optinMBR = Global.assetOptInMinBalance
    }

    const fcosts = fmbr()
    const childAppMBR: uint64 = AccountMinimumBalance + optinMBR
    const fees = getStakingFees(this.akitaDAO.value)

    const pool = compileArc4(Pool)

    const childContractMBR: uint64 = (
      fees.creationFee +
      MAX_PROGRAM_PAGES +
      (GLOBAL_STATE_KEY_UINT_COST * pool.globalUints) +
      (GLOBAL_STATE_KEY_BYTES_COST * pool.globalBytes) +
      childAppMBR +
      fcosts.appCreators
    )

    const mbrTxn = itxn.payment({
      sender,
      receiver: this.factory.value.address,
      amount: childContractMBR,
      fee,
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
          reward,
          marketplace,
          stakeKey,
          minimumStakeAmount,
          gateID,
          maxEntries,
        ],
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
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
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
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

    const costs = this.mbr()
    const entryMBR: uint64 = costs.entries + costs.entriesByAddress
    const mbrAmount: uint64 = entryMBR * entries.length

    const mbrPayment = itxn.payment({
      sender,
      receiver: Application(poolID).address,
      amount: mbrAmount
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
        rekeyTo: rekeyAddress(rekeyBack, wallet),
        fee,
      }
    )
  }
}