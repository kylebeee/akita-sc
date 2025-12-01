import {
  abimethod,
  Account,
  Application,
  arc4,
  assert,
  assertMatch,
  Asset,
  BoxMap,
  clone,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { StaticArray, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { classes } from 'polytype'
import { arc4Zero } from '../utils/constants'
import {
  ERR_INVALID_ASSET_AMOUNT,
  ERR_INVALID_PAYMENT,
  ERR_INVALID_PAYMENT_AMOUNT,
  ERR_INVALID_PAYMENT_RECEIVER,
  ERR_NOT_OPTED_IN,
} from '../utils/errors'
import {
  ONE_YEAR,
  StakingBoxPrefixHeartbeats,
  StakingBoxPrefixSettings,
  StakingBoxPrefixStakes,
  StakingBoxPrefixTotals,
  StakingGlobalStateKeyHeartbeatManagerAddress,
  totalsMBR,
} from './constants'
import {
  ERR_BAD_EXPIRATION,
  ERR_BAD_EXPIRATION_UPDATE,
  ERR_HEARBEAT_NOT_FOUND,
  ERR_HEARTBEAT_CANNOT_UPDATE,
  ERR_INSUFFICIENT_BALANCE,
  ERR_LOCKED,
  ERR_NO_LOCK,
  ERR_NOT_ASSET_CREATOR,
  ERR_NOT_HEARTBEAT_MANAGER,
  ERR_STAKE_DOESNT_EXIST,
  ERR_STAKE_NOT_FOUND,
  ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK,
} from './errors'
import {
  arc4Heartbeat,
  AssetCheck,
  Escrow,
  HeartbeatKey,
  Stake,
  StakeCheck,
  StakeInfo,
  StakeKey,
  STAKING_TYPE_HARD,
  STAKING_TYPE_HEARTBEAT,
  STAKING_TYPE_LOCK,
  STAKING_TYPE_SOFT,
  StakingType,
  TotalsInfo
} from './types'

// CONTRACT IMPORTS
import { ERR_ALREADY_OPTED_IN } from '../subscriptions/errors'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { BaseStaking } from './base'
import { emptyHeartbeat } from './utils'

export class Staking extends classes(BaseStaking, AkitaBaseContract) {

  // GLOBAL STATE ---------------------------------------------------------------------------------
  /** The address that is allowed to call the 'beat' method to create heartbeat records */
  heartbeatManagerAddress = GlobalState<Account>({ key: StakingGlobalStateKeyHeartbeatManagerAddress })

  // BOXES ----------------------------------------------------------------------------------------

  // 2_500 + (400 * (42 + 24)) = 28,900
  stakes = BoxMap<StakeKey, Stake>({ keyPrefix: StakingBoxPrefixStakes })

  // 2_500 + (400 * (41 + 128)) = 44,100
  heartbeats = BoxMap<HeartbeatKey, arc4.StaticArray<arc4Heartbeat, 4>>({
    keyPrefix: StakingBoxPrefixHeartbeats,
  })

  totals = BoxMap<uint64, TotalsInfo>({ keyPrefix: StakingBoxPrefixTotals })

  settings = BoxMap<uint64, uint64>({ keyPrefix: StakingBoxPrefixSettings })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: Application): void {
    this.version.value = version
    this.akitaDAO.value = akitaDAO
  }

  init(): void {
    this.totals(0).value = { locked: 0, escrowed: 0 }
  }

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private updateTotals(asset: uint64, type: StakingType, amount: uint64, isAdd: boolean): void {
    if (type === STAKING_TYPE_HARD) {
      if (isAdd) {
        this.totals(asset).value.escrowed += amount
      } else {
        this.totals(asset).value.escrowed -= amount
      }
    } else if (type === STAKING_TYPE_LOCK) {
      if (isAdd) {
        this.totals(asset).value.locked += amount
      } else {
        this.totals(asset).value.locked -= amount
      }
    }
  }

  // STAKING METHODS ------------------------------------------------------------------------------

  /**
   * optin tells the contract to opt into an asa
   * @param payment The payment transaction
   * @param asset The asset to be opted into
   */
  optIn(payment: gtxn.PaymentTxn, asset: uint64): void {
    assert(!Global.currentApplicationAddress.isOptedIn(Asset(asset)), ERR_ALREADY_OPTED_IN)

    // totals mbr
    const mbr: uint64 = (
      totalsMBR +
      Global.assetOptInMinBalance
    )

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: mbr,
      },
      ERR_INVALID_PAYMENT
    )

    itxn.assetTransfer({
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: 0,
      xferAsset: asset
    }).submit()

    this.totals(asset).value = {
      locked: 0,
      escrowed: 0,
    }
  }

  stake(payment: gtxn.PaymentTxn, type: StakingType, amount: uint64, expiration: uint64): void {
    const inTheFuture = expiration > Global.latestTimestamp
    const lessThanOneYearInTheFuture = expiration <= Global.latestTimestamp + ONE_YEAR
    const locked = type === STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = Global.latestTimestamp

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION)

    const sk: StakeKey = {
      address: Txn.sender,
      asset: 0,
      type,
    }

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {

      const costs = this.mbr()

      if (isEscrow) {

        assertMatch(
          payment,
          {
            receiver: Global.currentApplicationAddress,
            amount: amount + costs.stakes,
          },
          ERR_INVALID_PAYMENT
        )

        this.updateTotals(0, type, amount, true)

      } else if (type === STAKING_TYPE_HEARTBEAT) {
        // when heartbeat staking, the amount is ignored
        // instead we record balances across wallet & escrow
        const held = new Uint64(Txn.sender.balance)
        let hard: uint64 = 0
        let lock: uint64 = 0

        const hardStakeKey: StakeKey = {
          address: Txn.sender,
          asset: 0,
          type: STAKING_TYPE_HARD,
        }

        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey: StakeKey = {
          address: Txn.sender,
          asset: 0,
          type: STAKING_TYPE_LOCK,
        }

        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }

        assertMatch(
          payment,
          {
            receiver: Global.currentApplicationAddress,
            amount: costs.stakes + costs.heartbeats,
          },
          ERR_INVALID_PAYMENT
        )

        const heartbeatKey: HeartbeatKey = {
          address: Txn.sender,
          asset: 0,
        }

        const hbv = new arc4Heartbeat({
          held,
          hard: new Uint64(hard),
          lock: new Uint64(lock),
          timestamp: new Uint64(timestamp),
        })

        const ehbv = new arc4Heartbeat({
          held: arc4Zero,
          hard: arc4Zero,
          lock: arc4Zero,
          timestamp: arc4Zero,
        })

        const heartbeats = new StaticArray<arc4Heartbeat, 4>(
          clone(hbv),
          clone(ehbv),
          clone(ehbv),
          clone(ehbv)
        )

        this.heartbeats(heartbeatKey).value = clone(heartbeats)

      } else {
        assert(Txn.sender.balance >= amount, ERR_INSUFFICIENT_BALANCE)
        assertMatch(
          payment,
          {
            receiver: Global.currentApplicationAddress,
            amount: costs.stakes,
          },
          ERR_INVALID_PAYMENT
        )
      }

      this.stakes(sk).value = {
        amount,
        lastUpdate: timestamp,
        expiration,
      }

    } else {
      assert(type !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const { expiration: currentStakeExpiration, amount: currentStakeAmount } = this.stakes(sk).value
      assert(expiration >= currentStakeExpiration || !locked, ERR_BAD_EXPIRATION_UPDATE)

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === amount, ERR_INVALID_PAYMENT_AMOUNT)

        this.updateTotals(0, type, amount, true)
      } else {
        assert(Txn.sender.balance >= currentStakeAmount + amount, ERR_INSUFFICIENT_BALANCE)
      }

      const newAmount: uint64 = currentStakeAmount + amount

      this.stakes(sk).value = {
        amount: newAmount,
        lastUpdate: timestamp,
        expiration
      }
    }
  }

  stakeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    type: StakingType,
    amount: uint64,
    expiration: uint64
  ): void {
    const inTheFuture = expiration > Global.latestTimestamp
    let lessThanMaxLockup = expiration <= Global.latestTimestamp + ONE_YEAR
    if (this.settings(assetXfer.xferAsset.id).exists) {
      lessThanMaxLockup = expiration <= Global.latestTimestamp + this.settings(assetXfer.xferAsset.id).value
    }
    const locked = type === STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = Global.latestTimestamp

    assert((inTheFuture && lessThanMaxLockup) || !locked, ERR_BAD_EXPIRATION)

    const asset = assetXfer.xferAsset.id

    const sk: StakeKey = { address: Txn.sender, asset, type }

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {

      const costs = this.mbr()

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === costs.stakes, ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount, ERR_INVALID_ASSET_AMOUNT)

        this.updateTotals(asset, type, amount, true)

      } else if (type === STAKING_TYPE_HEARTBEAT) {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset)

        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount > 0, ERR_INVALID_ASSET_AMOUNT)

        const held = new Uint64(holdingAmount)

        const hardStakeKey: StakeKey = { address: Txn.sender, asset, type: STAKING_TYPE_HARD }

        let hard: uint64 = 0
        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey: StakeKey = { address: Txn.sender, asset, type: STAKING_TYPE_LOCK }

        let lock: uint64 = 0
        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (costs.stakes + costs.heartbeats), ERR_INVALID_PAYMENT_AMOUNT)

        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)

        const heartbeatKey: HeartbeatKey = { address: Txn.sender, asset }

        const hbv = new arc4Heartbeat({
          held,
          hard: new Uint64(hard),
          lock: new Uint64(lock),
          timestamp: new Uint64(timestamp),
        })

        const ehbv = new arc4Heartbeat({
          held: arc4Zero,
          hard: arc4Zero,
          lock: arc4Zero,
          timestamp: arc4Zero,
        })

        this.heartbeats(heartbeatKey).value = new arc4.StaticArray<arc4Heartbeat, 4>(
          clone(hbv),
          clone(ehbv),
          clone(ehbv),
          clone(ehbv)
        )
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= amount, ERR_INSUFFICIENT_BALANCE)

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === costs.stakes, ERR_INVALID_PAYMENT_AMOUNT)

        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)
      }

      this.stakes(sk).value = {
        amount,
        lastUpdate: timestamp,
        expiration,
      }
    } else {
      assert(type !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const { expiration: currentStakeExpiration, amount: currentStakeAmount } = this.stakes(sk).value
      assert(expiration >= currentStakeExpiration || !locked, ERR_BAD_EXPIRATION_UPDATE)

      // updates to asa staking shouldnt require any mbr changes
      assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
      assert(payment.amount === 0, ERR_INVALID_PAYMENT_AMOUNT)

      if (isEscrow) {
        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount, ERR_INVALID_ASSET_AMOUNT)

        this.updateTotals(asset, type, amount, true)
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= currentStakeAmount + amount, ERR_INSUFFICIENT_BALANCE)
        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)
      }

      const newAmount: uint64 = currentStakeAmount + amount

      this.stakes(sk).value = {
        amount: newAmount,
        lastUpdate: timestamp,
        expiration,
      }
    }
  }

  withdraw(asset: uint64, type: StakingType): void {
    assert(
      type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK,
      ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK
    )

    const sk = { address: Txn.sender, asset, type }
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    const { expiration, amount } = this.stakes(sk).value
    assert(type !== STAKING_TYPE_LOCK || expiration < Global.latestTimestamp, ERR_LOCKED)

    if (asset === 0) {
      itxn
        .payment({
          receiver: Txn.sender,
          amount: amount
        })
        .submit()
    } else {
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          assetAmount: amount,
          xferAsset: asset
        })
        .submit()
    }

    this.updateTotals(asset, type, amount, false)

    this.stakes(sk).delete()
  }

  createHeartbeat(address: Account, asset: uint64): void {
    assert(Txn.sender === this.heartbeatManagerAddress.value, ERR_NOT_HEARTBEAT_MANAGER)

    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const timestamp = new Uint64(Global.latestTimestamp)
    const heartbeats = clone(this.heartbeats(hbk).value)

    const [holdings] = AssetHolding.assetBalance(address, asset)
    const held = new Uint64(holdings)

    const hardStakeKey = {
      address,
      asset,
      type: STAKING_TYPE_HARD
    }

    let hard: uint64 = 0
    if (this.stakes(hardStakeKey).exists) {
      hard = this.stakes(hardStakeKey).value.amount
    }

    const lockStakeKey = {
      address,
      asset,
      type: STAKING_TYPE_LOCK
    }

    let lock: uint64 = 0
    if (this.stakes(lockStakeKey).exists) {
      lock = this.stakes(lockStakeKey).value.amount
    }

    /**
     * The index with the highest timestamp is the newest
     * since we only keep history of the last 4 heartbeats
     * all we need to do is check which timestamp in the array
     * is the highest and replace the one after it with the new heartbeat
     */
    for (let i: uint64 = 0; i < 4; i += 1) {
      if (
        i === 3 ||
        heartbeats[i].timestamp.asUint64() > heartbeats[i + 1].timestamp.asUint64()
      ) {
        const indexToModify: uint64 = i === 3 ? 0 : i + 1
        this.heartbeats(hbk).value[indexToModify] = new arc4Heartbeat({
          held,
          hard: new Uint64(hard),
          lock: new Uint64(lock),
          timestamp,
        })
        return
      }
    }
  }

  softCheck(address: Account, asset: uint64): StakeCheck {
    const sk = { address, asset, type: STAKING_TYPE_SOFT }
    assert(this.stakes(sk).exists, ERR_STAKE_DOESNT_EXIST)

    const { amount } = this.stakes(sk).value
    const lastUpdate = Global.latestTimestamp

    if (asset === 0) {
      const valid = address.balance >= amount
      if (!valid) {
        this.stakes(sk).value = {
          amount: address.balance,
          lastUpdate,
          expiration: 0,
        }
      }
      return { valid, balance: address.balance }
    }

    const [holdingAmount, optedIn] = AssetHolding.assetBalance(address, asset)
    assert(optedIn, ERR_NOT_OPTED_IN)
    const valid = holdingAmount >= amount
    if (!valid) {
      this.stakes(sk).value = {
        amount: holdingAmount,
        lastUpdate,
        expiration: 0,
      }
    }

    return { valid, balance: holdingAmount }
  }

  updateSettings(payment: gtxn.PaymentTxn, asset: uint64, value: uint64): void {
    assert(Txn.sender === Asset(asset).creator, ERR_NOT_ASSET_CREATOR)
    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: this.settings(asset).exists ? 0 : this.mbr().settings,
      },
      ERR_INVALID_PAYMENT
    )

    this.settings(asset).value = value
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------

  @abimethod({ readonly: true })
  optInCost(): uint64 {
    return totalsMBR + Global.assetOptInMinBalance
  }

  @abimethod({ readonly: true })
  stakeCost(asset: uint64, type: StakingType): uint64 {
    const { stakes, heartbeats } = this.mbr()
    const sk: StakeKey = { address: Txn.sender, asset, type }
    const isUpdate = this.stakes(sk).exists

    if (isUpdate) {
      return 0
    }

    if (type === STAKING_TYPE_HEARTBEAT) {
      return stakes + heartbeats
    }

    return stakes
  }

  @abimethod({ readonly: true })
  getTimeLeft(address: Account, asset: uint64): uint64 {
    const sk = { address, asset, type: STAKING_TYPE_LOCK }
    if (!this.stakes(sk).exists || Global.latestTimestamp >= this.stakes(sk).value.expiration) {
      return 0
    }

    return this.stakes(sk).value.expiration - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  mustGetTimeLeft(address: Account, asset: uint64): uint64 {
    const sk = { address, asset, type: STAKING_TYPE_LOCK }
    assert(this.stakes(sk).exists, ERR_NO_LOCK)
    assert(Global.latestTimestamp < this.stakes(sk).value.expiration, ERR_LOCKED)
    return this.stakes(sk).value.expiration - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  getInfo(address: Account, stake: StakeInfo): Stake {
    const sk = { address, ...stake }
    if (!this.stakes(sk).exists) {
      return { amount: 0, lastUpdate: 0, expiration: 0 }
    }

    return this.stakes(sk).value
  }

  @abimethod({ readonly: true })
  mustGetInfo(address: Account, stake: StakeInfo): Stake {
    const sk = { address, ...stake }
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    return this.stakes(sk).value
  }

  @abimethod({ readonly: true })
  getEscrowInfo(address: Account, asset: uint64): Escrow {
    const sk = { address, asset, type: STAKING_TYPE_HARD }
    const lk = { address, asset, type: STAKING_TYPE_LOCK }

    let hard: uint64 = 0
    if (this.stakes(sk).exists) {
      hard = this.stakes(sk).value.amount
    }

    let lock: uint64 = 0
    if (this.stakes(lk).exists) {
      lock = this.stakes(lk).value.amount
    }

    return { hard, lock }
  }

  @abimethod({ readonly: true })
  getHeartbeat(address: Account, asset: uint64): arc4.StaticArray<arc4Heartbeat, 4> {
    const hbk = { address, asset }
    if (!this.heartbeats(hbk).exists) {
      return new arc4.StaticArray<arc4Heartbeat, 4>(
        emptyHeartbeat(),
        emptyHeartbeat(),
        emptyHeartbeat(),
        emptyHeartbeat()
      )
    }

    return this.heartbeats(hbk).value
  }

  @abimethod({ readonly: true })
  mustGetHeartbeat(address: Account, asset: uint64): arc4.StaticArray<arc4Heartbeat, 4> {
    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)
    return this.heartbeats(hbk).value
  }

  @abimethod({ readonly: true })
  getHeartbeatAverage(address: Account, asset: uint64, includeEscrowed: boolean): uint64 {
    const hbk = { address, asset }

    if (!this.heartbeats(hbk).exists) {
      return 0
    }

    const heartbeats = clone(this.heartbeats(hbk).value)

    let total: uint64 = 0
    let count: uint64 = 0
    for (let i: uint64 = 0; i < heartbeats.length; i += 1) {
      if (heartbeats[i].timestamp.asUint64() > 0) {
        count += 1
        if (includeEscrowed) {
          total += heartbeats[i].held.asUint64() + heartbeats[i].hard.asUint64() + heartbeats[i].lock.asUint64()
        } else {
          total += heartbeats[i].held.asUint64()
        }
      }
    }

    if (count === 0) {
      return 0
    }

    return total / count
  }

  @abimethod({ readonly: true })
  mustGetHeartbeatAverage(address: Account, asset: uint64, includeEscrowed: boolean): uint64 {
    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const heartbeats = clone(this.heartbeats(hbk).value)

    let total: uint64 = 0
    let count: uint64 = 0
    for (let i: uint64 = 0; i < 4; i += 1) {
      // Only count entries with non-zero timestamps (valid entries)
      if (heartbeats[i].timestamp.asUint64() > 0) {
        count += 1
        if (includeEscrowed) {
          total += heartbeats[i].held.asUint64() + heartbeats[i].hard.asUint64() + heartbeats[i].lock.asUint64()
        } else {
          total += heartbeats[i].held.asUint64()
        }
      }
    }

    if (count === 0) {
      return 0
    }

    return total / count
  }

  @abimethod({ readonly: true })
  getInfoList(address: Account, type: StakingType, assets: uint64[]): Stake[] {
    let results: Stake[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const sk = { address, asset: assets[i], type }
      if (!this.stakes(sk).exists) {

        const emptyStake: Stake = {
          amount: 0,
          lastUpdate: 0,
          expiration: 0,
        }

        results.push(emptyStake)
        continue
      }

      results.push(this.stakes(sk).value)
    }
    return results
  }

  @abimethod({ readonly: true })
  mustGetInfoList(address: Account, type: StakingType, assets: uint64[]): Stake[] {
    let results: Stake[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const sk = { address, asset: assets[i], type }
      assert(this.stakes(sk).exists, ERR_STAKE_NOT_FOUND)
      results.push(this.stakes(sk).value)
    }
    return results
  }

  @abimethod({ readonly: true })
  stakeCheck(address: Account, checks: AssetCheck[], type: StakingType, includeEscrowed: boolean): boolean {
    for (let i: uint64 = 0; i < checks.length; i += 1) {
      const sk = { address, asset: checks[i].asset, type }
      if (!this.stakes(sk).exists) {
        return false
      }

      let amountToCheck: uint64 = this.stakes(sk).value.amount
      if (type === STAKING_TYPE_HEARTBEAT) {
        amountToCheck = this.getHeartbeatAverage(address, checks[i].asset, includeEscrowed)
      }

      if (checks[i].amount >= amountToCheck) {
        return false
      }
    }

    return true
  }

  @abimethod({ readonly: true })
  getTotals(assets: uint64[]): TotalsInfo[] {
    let results: TotalsInfo[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      results.push(this.totals(assets[i]).value)
    }
    return results
  }
}
