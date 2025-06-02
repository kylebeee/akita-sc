import {
  abimethod,
  Application,
  arc4,
  assert,
  assertMatch,
  BoxMap,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { AssetHolding } from '@algorandfoundation/algorand-typescript/op'
import { Address, decodeArc4, StaticArray, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import {
  ONE_YEAR,
  StakingBoxPrefixHeartbeats,
  StakingBoxPrefixStakes,
  StakingGlobalStateKeyHeartbeatManagerAddress,
} from './constants'
import {
  arc4HeartbeatKey,
  arc4Heartbeat,
  arc4StakeInfo,
  arc4StakeKey,
  arc4Stake,
  AssetChecks,
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
} from './types'
import {
  ERR_BAD_EXPIRATION,
  ERR_BAD_EXPIRATION_UPDATE,
  ERR_HEARBEAT_NOT_FOUND,
  ERR_HEARTBEAT_CANNOT_UPDATE,
  ERR_INSUFFICIENT_BALANCE,
  ERR_LOCKED,
  ERR_NO_LOCK,
  ERR_NOT_HEARTBEAT_MANAGER,
  ERR_STAKE_DOESNT_EXIST,
  ERR_STAKE_NOT_FOUND,
  ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK,
} from './errors'
import { arc4Zero } from '../utils/constants'
import {
  ERR_INVALID_ASSET_AMOUNT,
  ERR_INVALID_PAYMENT,
  ERR_INVALID_PAYMENT_AMOUNT,
  ERR_INVALID_PAYMENT_RECEIVER,
  ERR_NOT_OPTED_IN,
} from '../utils/errors'
import { uint64Array } from '../utils/types/base'
import { BaseStaking } from './base'
import { fee } from '../utils/constants'
import { StakingInterface } from '../utils/types/staking'
import { classes } from 'polytype'
import { AkitaBaseContract } from '../utils/base-contracts/base'

export class Staking extends classes(BaseStaking, AkitaBaseContract) implements StakingInterface {

  // GLOBAL STATE ---------------------------------------------------------------------------------
  /** The address that is allowed to call the 'beat' method to create heartbeat records */
  heartbeatManagerAddress = GlobalState<Address>({ key: StakingGlobalStateKeyHeartbeatManagerAddress })

  // BOXES ----------------------------------------------------------------------------------------

  // 2_500 + (400 * (42 + 24)) = 28,900
  stakes = BoxMap<arc4StakeKey, arc4Stake>({ keyPrefix: StakingBoxPrefixStakes })

  // 2_500 + (400 * (41 + 128)) = 44,100
  heartbeats = BoxMap<arc4HeartbeatKey, arc4.StaticArray<arc4Heartbeat, 4>>({
    keyPrefix: StakingBoxPrefixHeartbeats,
  })

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(akitaDAO: uint64, version: string): void {
    this.akitaDAO.value = Application(akitaDAO)
    this.version.value = version
  }

  // STAKING METHODS ------------------------------------------------------------------------------

  stake(payment: gtxn.PaymentTxn, type: StakingType, amount: uint64, expiration: uint64): void {
    const inTheFuture = expiration > Global.latestTimestamp
    const lessThanOneYearInTheFuture = expiration <= Global.latestTimestamp + ONE_YEAR
    const locked = type !== STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = new UintN64(Global.latestTimestamp)

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION)

    const arc4Sender = new Address(Txn.sender)
    const sk = new arc4StakeKey({
      address: arc4Sender,
      asset: arc4Zero,
      type,
    })

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
        const held = new UintN64(Txn.sender.balance)
        let hard = arc4Zero
        let lock = arc4Zero

        const hardStakeKey = new arc4StakeKey({
          address: arc4Sender,
          asset: arc4Zero,
          type: STAKING_TYPE_HARD,
        })

        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey = new arc4StakeKey({
          address: arc4Sender,
          asset: arc4Zero,
          type: STAKING_TYPE_LOCK,
        })

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

        const heartbeatKey = new arc4HeartbeatKey({
          address: new Address(Txn.sender),
          asset: arc4Zero,
        })

        const hbv = new arc4Heartbeat({
          held,
          hard,
          lock,
          timestamp,
        })

        const ehbv = new arc4Heartbeat({
          held: arc4Zero,
          hard: arc4Zero,
          lock: arc4Zero,
          timestamp: arc4Zero,
        })

        const heartbeats = new StaticArray<arc4Heartbeat, 4>(
          hbv.copy(),
          ehbv.copy(),
          ehbv.copy(),
          ehbv.copy()
        )

        this.heartbeats(heartbeatKey).value = heartbeats.copy()
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

      this.stakes(sk).value = new arc4Stake({
        amount: new UintN64(amount),
        lastUpdate: timestamp,
        expiration: new UintN64(expiration),
      })
    } else {
      assert(type !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const currentStake = decodeArc4<Stake>(this.stakes(sk).value.bytes)
      assert(expiration >= currentStake.expiration || !locked, ERR_BAD_EXPIRATION_UPDATE)

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === amount, ERR_INVALID_PAYMENT_AMOUNT)
      } else {
        assert(Txn.sender.balance >= currentStake.amount + amount, ERR_INSUFFICIENT_BALANCE)
      }

      const newAmount = new UintN64(currentStake.amount + amount)

      this.stakes(sk).value = new arc4Stake({
        amount: newAmount,
        lastUpdate: timestamp,
        expiration: new UintN64(expiration),
      })
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
    const lessThanOneYearInTheFuture = expiration <= Global.latestTimestamp + ONE_YEAR
    const locked = type !== STAKING_TYPE_LOCK
    const isEscrow = type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK
    const timestamp = new UintN64(Global.latestTimestamp)

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION)

    const asset = new UintN64(assetXfer.xferAsset.id)
    const arc4Sender = new Address(Txn.sender)
    const sk = new arc4StakeKey({
      address: arc4Sender,
      asset,
      type,
    })

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {

      const costs = this.mbr()

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === costs.stakes, ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount, ERR_INVALID_ASSET_AMOUNT)
      } else if (type === STAKING_TYPE_HEARTBEAT) {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)

        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount > 0, ERR_INVALID_ASSET_AMOUNT)

        const held = new UintN64(holdingAmount)

        const hardStakeKey = new arc4StakeKey({
          address: arc4Sender,
          asset,
          type: STAKING_TYPE_HARD
        })

        let hard = arc4Zero
        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }

        const lockStakeKey = new arc4StakeKey({
          address: arc4Sender,
          asset,
          type: STAKING_TYPE_LOCK
        })

        let lock = arc4Zero
        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (costs.stakes + costs.heartbeats), ERR_INVALID_PAYMENT_AMOUNT)

        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)

        const heartbeatKey = new arc4HeartbeatKey({
          address: arc4Sender,
          asset: asset,
        })

        const hbv = new arc4Heartbeat({
          held,
          hard,
          lock,
          timestamp,
        })

        const ehbv = new arc4Heartbeat({
          held: arc4Zero,
          hard: arc4Zero,
          lock: arc4Zero,
          timestamp: arc4Zero,
        })

        const heartbeats = new arc4.StaticArray<arc4Heartbeat, 4>(
          hbv.copy(),
          ehbv.copy(),
          ehbv.copy(),
          ehbv.copy()
        )

        this.heartbeats(heartbeatKey).value = heartbeats.copy()
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= amount, ERR_INSUFFICIENT_BALANCE)

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === costs.stakes, ERR_INVALID_PAYMENT_AMOUNT)

        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)
      }

      this.stakes(sk).value = new arc4Stake({
        amount: new UintN64(amount),
        lastUpdate: timestamp,
        expiration: new UintN64(expiration),
      })
    } else {
      assert(type !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const currentStake = this.stakes(sk).value.copy()
      assert(expiration >= currentStake.expiration.native || !locked, ERR_BAD_EXPIRATION_UPDATE)

      // updates to asa staking shouldnt require any mbr changes
      assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
      assert(payment.amount === 0, ERR_INVALID_PAYMENT_AMOUNT)

      if (isEscrow) {
        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount, ERR_INVALID_ASSET_AMOUNT)
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= currentStake.amount.native + amount, ERR_INSUFFICIENT_BALANCE)
        // if they aren't escrowing, we need to make sure the asset transfer is 0, doesn't matter to who in this case
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)
      }

      const newAmount = new UintN64(currentStake.amount.native + amount)

      this.stakes(sk).value = new arc4Stake({
        amount: newAmount,
        lastUpdate: timestamp,
        expiration: new UintN64(expiration),
      })
    }
  }

  withdraw(asset: uint64, type: StakingType): void {
    assert(
      type === STAKING_TYPE_HARD || type === STAKING_TYPE_LOCK,
      ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK
    )
    const arc4Sender = new Address(Txn.sender)
    const sk = new arc4StakeKey({ address: arc4Sender, asset: new UintN64(asset), type })
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    const currentStake = this.stakes(sk).value.copy()
    assert(type !== STAKING_TYPE_LOCK || currentStake.expiration.native < Global.latestTimestamp, ERR_LOCKED)

    if (asset === 0) {
      itxn.payment({
        receiver: Txn.sender,
        amount: currentStake.amount.native,
        fee,
      }).submit()
    } else {
      itxn.assetTransfer({
        assetReceiver: Txn.sender,
        assetAmount: currentStake.amount.native,
        xferAsset: asset,
        fee,
      }).submit()
    }
    this.stakes(sk).delete()
  }

  createHeartbeat(address: Address, asset: uint64): void {
    assert(Txn.sender === this.heartbeatManagerAddress.value.native, ERR_NOT_HEARTBEAT_MANAGER)

    const hbk = new arc4HeartbeatKey({ address, asset: new UintN64(asset) })
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const timestamp = new UintN64(Global.latestTimestamp)
    const heartbeats = decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)

    const [holdings] = AssetHolding.assetBalance(address.native, asset)
    const held = new UintN64(holdings)

    const hardStakeKey = new arc4StakeKey({
      address,
      asset: new UintN64(asset),
      type: STAKING_TYPE_HARD
    })

    let hard = arc4Zero
    if (this.stakes(hardStakeKey).exists) {
      hard = this.stakes(hardStakeKey).value.amount
    }

    const lockStakeKey = new arc4StakeKey({
      address,
      asset: new UintN64(asset),
      type: STAKING_TYPE_LOCK
    })

    let lock = arc4Zero
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
          hard,
          lock,
          timestamp,
        })
        return
      }
    }
  }

  softCheck(address: Address, asset: uint64): { valid: boolean, balance: uint64 } {
    const sk = new arc4StakeKey({ address, asset: new UintN64(asset), type: STAKING_TYPE_SOFT })
    assert(this.stakes(sk).exists, ERR_STAKE_DOESNT_EXIST)

    const stake = decodeArc4<Stake>(this.stakes(sk).value.bytes)
    const lastUpdate = new UintN64(Global.latestTimestamp)

    if (asset === 0) {
      const valid = address.native.balance >= stake.amount
      if (!valid) {
        const arc4Balance = new UintN64(address.native.balance)

        this.stakes(sk).value = new arc4Stake({
          amount: arc4Balance,
          lastUpdate,
          expiration: arc4Zero,
        })
      }
      return { valid, balance: address.native.balance }
    }

    const [holdingAmount, optedIn] = AssetHolding.assetBalance(address.native, asset)
    assert(optedIn, ERR_NOT_OPTED_IN)
    const valid = holdingAmount >= stake.amount
    if (!valid) {
      const arc4Balance = new UintN64(holdingAmount)

      this.stakes(sk).value = new arc4Stake({
        amount: arc4Balance,
        lastUpdate,
        expiration: arc4Zero,
      })
    }

    return { valid, balance: holdingAmount }
  }

  // READ ONLY METHODS ----------------------------------------------------------------------------


  @abimethod({ readonly: true })
  getTimeLeft(address: Address, asset: arc4.UintN64): uint64 {
    const sk = new arc4StakeKey({ address, asset, type: STAKING_TYPE_LOCK })

    if (!this.stakes(sk).exists || Global.latestTimestamp >= this.stakes(sk).value.expiration.native) {
      return 0
    }

    return this.stakes(sk).value.expiration.native - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  mustGetTimeLeft(address: Address, asset: arc4.UintN64): uint64 {
    const sk = new arc4StakeKey({ address, asset, type: STAKING_TYPE_LOCK })
    assert(this.stakes(sk).exists, ERR_NO_LOCK)
    assert(Global.latestTimestamp < this.stakes(sk).value.expiration.native, ERR_LOCKED)
    return this.stakes(sk).value.expiration.native - Global.latestTimestamp
  }

  @abimethod({ readonly: true })
  getInfo(address: Address, stake: arc4StakeInfo): Stake {
    const sk = new arc4StakeKey({ address, ...stake })
    if (!this.stakes(sk).exists) {
      return { amount: 0, lastUpdate: 0, expiration: 0 }
    }

    return decodeArc4<Stake>(this.stakes(sk).value.bytes)
  }

  @abimethod({ readonly: true })
  mustGetInfo(address: Address, stake: arc4StakeInfo): Stake {
    const sk = new arc4StakeKey({ address, ...stake })
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    return decodeArc4<Stake>(this.stakes(sk).value.bytes)
  }

  @abimethod({ readonly: true })
  getEscrowInfo(address: Address, asset: arc4.UintN64): Escrow {
    const sk = new arc4StakeKey({ address, asset, type: STAKING_TYPE_HARD })
    const lk = new arc4StakeKey({ address, asset, type: STAKING_TYPE_LOCK })

    let hard: uint64 = 0
    if (this.stakes(sk).exists) {
      hard = this.stakes(sk).value.amount.native
    }

    let lock: uint64 = 0
    if (this.stakes(lk).exists) {
      lock = this.stakes(lk).value.amount.native
    }

    return { hard, lock }
  }

  @abimethod({ readonly: true })
  getHeartbeat(address: Address, asset: uint64): Heartbeats {
    const hbk = new arc4HeartbeatKey({ address, asset: new UintN64(asset) })
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
    const hbk = new arc4HeartbeatKey({ address, asset: new UintN64(asset) })
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)
    return decodeArc4<Heartbeats>(this.heartbeats(hbk).value.bytes)
  }

  @abimethod({ readonly: true })
  getHeartbeatAverage(address: Address, asset: uint64, includeStaked: boolean): uint64 {
    const hbk = new arc4HeartbeatKey({ address, asset: new UintN64(asset) })

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
    const hbk = new arc4HeartbeatKey({ address, asset: new UintN64(asset) })
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
  getInfoList(address: Address, type: StakingType, assets: uint64Array): Stake[] {
    let results: Stake[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assets[i], type })
      if (!this.stakes(sk).exists) {

        const emptyStake: Stake = {
          amount: 0,
          lastUpdate: 0,
          expiration: 0,
        }

        results = [...results, emptyStake]
        continue
      }

      results = [
        ...results,
        decodeArc4<Stake>(this.stakes(sk).value.bytes),
      ]
    }
    return results
  }

  @abimethod({ readonly: true })
  mustGetInfoList(address: Address, type: StakingType, assets: uint64Array): Stake[] {
    let results: Stake[] = []
    for (let i: uint64 = 0; i < assets.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assets[i], type })
      assert(this.stakes(sk).exists, ERR_STAKE_NOT_FOUND)

      results = [
        ...results,
        decodeArc4<Stake>(this.stakes(sk).value.bytes),
      ]
    }
    return results
  }

  @abimethod({ readonly: true })
  stakeCheck(address: Address, assetChecks: AssetChecks, type: StakingType, includeStaked: boolean): boolean {
    const checks = decodeArc4<AssetCheck[]>(assetChecks.bytes)

    for (let i: uint64 = 0; i < assetChecks.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assetChecks[i].asset, type })
      if (!this.stakes(sk).exists) {
        return false
      }

      const stake = decodeArc4<Stake>(this.stakes(sk).value.bytes)

      let amountToCheck: uint64 = stake.amount
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
