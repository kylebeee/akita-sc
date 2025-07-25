import {
  abimethod,
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
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Address, decodeArc4, StaticArray, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  ONE_YEAR,
  StakingBoxPrefixHeartbeats,
  StakingBoxPrefixSettings,
  StakingBoxPrefixStakes,
  StakingGlobalStateKeyHeartbeatManagerAddress,
} from './constants'
import {
  arc4Heartbeat,
  Escrow,
  Heartbeats,
  Stake,
  STAKING_TYPE_HARD,
  STAKING_TYPE_HEARTBEAT,
  STAKING_TYPE_LOCK,
  STAKING_TYPE_SOFT,
  StakingType,
  AssetCheck,
  Heartbeat,
  StakeKey,
  HeartbeatKey,
  StakeInfo,
} from './types'
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
  ERR_INVALID_ASSET_AMOUNT,
  ERR_INVALID_PAYMENT,
  ERR_INVALID_PAYMENT_AMOUNT,
  ERR_INVALID_PAYMENT_RECEIVER,
  ERR_NOT_OPTED_IN,
} from '../utils/errors'
import { BaseStaking } from './base'
import { StakingInterface } from '../utils/types/staking'
import { classes } from 'polytype'
import { AkitaBaseContract } from '../utils/base-contracts/base'
import { arc4Zero } from '../utils/constants'

export class Staking extends classes(BaseStaking, AkitaBaseContract) implements StakingInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------
  /** The address that is allowed to call the 'beat' method to create heartbeat records */
  heartbeatManagerAddress = GlobalState<Address>({ key: StakingGlobalStateKeyHeartbeatManagerAddress })

  // BOXES ----------------------------------------------------------------------------------------

  // 2_500 + (400 * (42 + 24)) = 28,900
  stakes = BoxMap<StakeKey, Stake>({ keyPrefix: StakingBoxPrefixStakes })

  // 2_500 + (400 * (41 + 128)) = 44,100
  heartbeats = BoxMap<HeartbeatKey, arc4.StaticArray<arc4Heartbeat, 4>>({
    keyPrefix: StakingBoxPrefixHeartbeats,
  }) 

  settings = BoxMap<uint64, uint64>({ keyPrefix: StakingBoxPrefixSettings })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(version: string, akitaDAO: uint64): void {
    this.version.value = version
    this.akitaDAO.value = Application(akitaDAO)
  }

  // STAKING METHODS ------------------------------------------------------------------------------

  stake(payment: gtxn.PaymentTxn, type: StakingType, amount: uint64, expiration: uint64): void {
    const inTheFuture = expiration > Global.latestTimestamp
    const lessThanOneYearInTheFuture = expiration <= Global.latestTimestamp + ONE_YEAR
    const locked = type !== STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = Global.latestTimestamp

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION)

    const arc4Sender = new Address(Txn.sender)
    const sk: StakeKey = {
      address: arc4Sender,
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
      } else if (type === STAKING_TYPE_HEARTBEAT) {
        // when heartbeat staking, the amount is ignored
        // instead we record balances across wallet & escrow
        const held = new Uint64(Txn.sender.balance)
        let hard: uint64 = 0
        let lock: uint64 = 0

        const hardStakeKey: StakeKey = {
          address: arc4Sender,
          asset: 0,
          type: STAKING_TYPE_HARD,
        }

        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey: StakeKey = {
          address: arc4Sender,
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
          address: new Address(Txn.sender),
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
    const locked = type !== STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = Global.latestTimestamp

    assert((inTheFuture && lessThanMaxLockup) || !locked, ERR_BAD_EXPIRATION)

    const asset = assetXfer.xferAsset.id
    const arc4Sender = new Address(Txn.sender)

    const sk: StakeKey = { address: arc4Sender, asset, type }

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {

      const costs = this.mbr()

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === costs.stakes, ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount, ERR_INVALID_ASSET_AMOUNT)
      } else if (type === STAKING_TYPE_HEARTBEAT) {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset)

        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount > 0, ERR_INVALID_ASSET_AMOUNT)

        const held = new Uint64(holdingAmount)

        const hardStakeKey: StakeKey = { address: arc4Sender, asset, type: STAKING_TYPE_HARD }

        let hard: uint64 = 0
        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey: StakeKey = { address: arc4Sender, asset, type: STAKING_TYPE_LOCK }

        let lock: uint64 = 0
        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (costs.stakes + costs.heartbeats), ERR_INVALID_PAYMENT_AMOUNT)

        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)

        const heartbeatKey: HeartbeatKey = { address: arc4Sender, asset }

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
    const arc4Sender = new Address(Txn.sender)
    const sk = { address: arc4Sender, asset, type }
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
    this.stakes(sk).delete()
  }

  createHeartbeat(address: Address, asset: uint64): void {
    assert(Txn.sender === this.heartbeatManagerAddress.value.native, ERR_NOT_HEARTBEAT_MANAGER)

    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const timestamp = new Uint64(Global.latestTimestamp)
    const heartbeats = decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)

    const [holdings] = AssetHolding.assetBalance(address.native, asset)
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
        heartbeats[i].timestamp > heartbeats[i + 1].timestamp
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

  softCheck(address: Address, asset: uint64): { valid: boolean, balance: uint64 } {
    const sk = { address, asset, type: STAKING_TYPE_SOFT }
    assert(this.stakes(sk).exists, ERR_STAKE_DOESNT_EXIST)

    const { amount } = this.stakes(sk).value
    const lastUpdate = Global.latestTimestamp

    if (asset === 0) {
      const valid = address.native.balance >= amount
      if (!valid) {
        this.stakes(sk).value = {
          amount: address.native.balance,
          lastUpdate,
          expiration: 0,
        }
      }
      return { valid, balance: address.native.balance }
    }

    const [holdingAmount, optedIn] = AssetHolding.assetBalance(address.native, asset)
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
  getTimeLeft(address: Address, asset: uint64): uint64 {
    const sk = { address, asset, type: STAKING_TYPE_LOCK }

    if (!this.stakes(sk).exists || Global.latestTimestamp >= this.stakes(sk).value.expiration) {
      return 0
    }

    return this.stakes(sk).value.expiration - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  mustGetTimeLeft(address: Address, asset: uint64): uint64 {
    const sk = { address, asset, type: STAKING_TYPE_LOCK }
    assert(this.stakes(sk).exists, ERR_NO_LOCK)
    assert(Global.latestTimestamp < this.stakes(sk).value.expiration, ERR_LOCKED)
    return this.stakes(sk).value.expiration - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  getInfo(address: Address, stake: StakeInfo): Stake {
    const sk = { address, ...stake }
    if (!this.stakes(sk).exists) {
      return { amount: 0, lastUpdate: 0, expiration: 0 }
    }

    return this.stakes(sk).value
  }

  @abimethod({ readonly: true })
  mustGetInfo(address: Address, stake: StakeInfo): Stake {
    const sk = { address, ...stake }
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    return this.stakes(sk).value
  }

  @abimethod({ readonly: true })
  getEscrowInfo(address: Address, asset: uint64): Escrow {
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
  getHeartbeat(address: Address, asset: uint64): Heartbeats {
    const hbk = { address, asset }
    if (!this.heartbeats(hbk).exists) {

      const ehbv: Heartbeat = {
        held: 0,
        hard: 0,
        lock: 0,
        timestamp: 0,
      }

      return [ehbv, ehbv, ehbv, ehbv]
    }

    return decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)
  }

  @abimethod({ readonly: true })
  mustGetHeartbeat(address: Address, asset: uint64): Heartbeats {
    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)
    return decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)
  }

  @abimethod({ readonly: true })
  getHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 {
    const hbk = { address, asset }

    if (!this.heartbeats(hbk).exists) {
      return 0
    }

    const heartbeats = decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)

    let total: uint64 = 0
    for (let i: uint64 = 0; i < heartbeats.length; i += 1) {
      if (includeStaked) {
        total += heartbeats[i].held + heartbeats[i].hard + heartbeats[i].lock
      } else {
        total += heartbeats[i].held
      }
    }

    return total / heartbeats.length
  }

  @abimethod({ readonly: true })
  mustGetHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 {
    const hbk = { address, asset }
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const heartbeats = decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)

    let total: uint64 = 0
    for (let i: uint64 = 0; i < heartbeats.length; i += 1) {
      if (includeStaked) {
        total += heartbeats[i].held + heartbeats[i].hard + heartbeats[i].lock
      } else {
        total += heartbeats[i].held
      }
    }

    return total / heartbeats.length
  }

  @abimethod({ readonly: true })
  getInfoList(address: Address, type: StakingType, assets: uint64[]): Stake[] {
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
  mustGetInfoList(address: Address, type: StakingType, assets: uint64[]): Stake[] {
    let results: Stake[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const sk = { address, asset: assets[i], type }
      assert(this.stakes(sk).exists, ERR_STAKE_NOT_FOUND)
      results.push(this.stakes(sk).value)
    }
    return results
  }

  @abimethod({ readonly: true })
  stakeCheck(address: Address, checks: AssetCheck[], type: StakingType, includeStaked: boolean): boolean {
    for (let i: uint64 = 0; i < checks.length; i += 1) {
      const sk = { address, asset: checks[i].asset, type }
      if (!this.stakes(sk).exists) {
        return false
      }

      let amountToCheck: uint64 = this.stakes(sk).value.amount
      if (type === STAKING_TYPE_HEARTBEAT) {
        amountToCheck = this.getHeartbeatAverage(address, checks[i].asset, includeStaked)
      }

      if (checks[i].amount >= amountToCheck) {
        return false
      }
    }

    return true
  }
}
