import { abimethod, Account, arc4, assert, BoxMap, Global, GlobalState, gtxn, itxn, Txn, uint64 } from "@algorandfoundation/algorand-typescript";
import { AkitaBaseContract } from "../../utils/base_contracts/base.algo";
import { EmptyHeartbeatValue, heartBeatMBR, lockMBR, ONE_YEAR, StakingBoxPrefixHeartbeats, StakingBoxPrefixStakes, StakingGlobalStateKeyHeartbeatManagerAddress } from "./constants";
import { arc4AssetCheck, arc4EscrowValue, arc4HeartbeatKey, arc4HeartbeatValues, arc4StakeInfo, arc4StakeKey, arc4StakeValue, arc4STAKING_TYPE_HARD, arc4STAKING_TYPE_HEARTBEAT, arc4STAKING_TYPE_LOCK, arc4STAKING_TYPE_SOFT, StakeKey, STAKING_TYPE_HARD, STAKING_TYPE_HEARTBEAT, STAKING_TYPE_LOCK, STAKING_TYPE_SOFT } from "./types";
import { ERR_BAD_EXPIRATION, ERR_BAD_EXPIRATION_UPDATE, ERR_HEARBEAT_NOT_FOUND, ERR_HEARTBEAT_CANNOT_UPDATE, ERR_INSUFFICIENT_BALANCE, ERR_LOCKED, ERR_NO_LOCK, ERR_NOT_HEARTBEAT_MANAGER, ERR_STAKE_DOESNT_EXIST, ERR_STAKE_NOT_FOUND, ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK } from "./errors";
import { arc4Zero } from "../../utils/constants";
import { ERR_INVALID_ASSET_AMOUNT, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER, ERR_NOT_OPTED_IN } from "../../utils/errors";
import { AssetHolding } from "@algorandfoundation/algorand-typescript/op";

export class Staking extends AkitaBaseContract {

  /** The address that is allowed to call the 'beat' method to create heartbeat records */
  heartbeatManagerAddress = GlobalState<Account>({ key: StakingGlobalStateKeyHeartbeatManagerAddress })

  // 2_500 + (400 * (42 + 24)) = 28,900
  stakes = BoxMap<arc4StakeKey, arc4StakeValue>({ keyPrefix: StakingBoxPrefixStakes });
  // 2_500 + (400 * (40 + 64)) = 44,100
  heartbeats = BoxMap<arc4HeartbeatKey, arc4.StaticArray<arc4HeartbeatValues, 4>>({ keyPrefix: StakingBoxPrefixHeartbeats })

  // @ts-ignore
  @abimethod({ readonly: true })
  getTimeLeft(address: arc4.Address, asset: arc4.UintN64): uint64 {
    const sk = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_LOCK })

    if (!this.stakes(sk).exists || Global.latestTimestamp >= this.stakes(sk).value.expiration.native) {
      return 0
    }

    return this.stakes(sk).value.expiration.native - Global.latestTimestamp
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetTimeLeft(address: arc4.Address, asset: arc4.UintN64): uint64 {
    const sk = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_LOCK })
    assert(this.stakes(sk).exists, ERR_NO_LOCK)
    assert(Global.latestTimestamp < this.stakes(sk).value.expiration.native, ERR_LOCKED)
    return this.stakes(sk).value.expiration.native - Global.latestTimestamp
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getInfo(address: arc4.Address, stake: arc4StakeInfo): arc4StakeValue {
    const sk = new arc4StakeKey({ address, ...stake })
    if (!this.stakes(sk).exists) {
      return new arc4StakeValue({
        amount: arc4Zero,
        lastUpdate: arc4Zero,
        expiration: arc4Zero
      })
    }
    return this.stakes(sk).value;
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetInfo(address: arc4.Address, stake: arc4StakeInfo): arc4StakeValue {
    const sk = new arc4StakeKey({ address, ...stake })
    assert(this.stakes(sk).exists, ERR_NO_LOCK);
    return this.stakes(sk).value;
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getEscrowInfo(address: arc4.Address, asset: arc4.UintN64): arc4EscrowValue {
    const sk = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_HARD })
    const lk = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_LOCK })

    let hard = arc4Zero
    if (this.stakes(sk).exists) {
      hard = this.stakes(sk).value.amount
    }

    let lock = arc4Zero
    if (this.stakes(lk).exists) {
      lock = this.stakes(lk).value.amount
    }

    return new arc4EscrowValue({ hard, lock })
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getHeartbeat(address: arc4.Address, asset: arc4.UintN64): arc4.StaticArray<arc4HeartbeatValues, 4> {
    const hbk = new arc4HeartbeatKey({ address, asset })
    if (!this.heartbeats(hbk).exists) {
      return new arc4.StaticArray(
        EmptyHeartbeatValue,
        EmptyHeartbeatValue,
        EmptyHeartbeatValue,
        EmptyHeartbeatValue
      )
    }

    return this.heartbeats(hbk).value
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetHeartbeat(address: arc4.Address, asset: arc4.UintN64): arc4.StaticArray<arc4HeartbeatValues, 4> {
    const hbk = new arc4HeartbeatKey({ address, asset })
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)
    return this.heartbeats(hbk).value
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getHeartbeatAverage(address: arc4.Address, asset: arc4.UintN64, includeStaked: arc4.Bool): uint64 {
    const hbk = new arc4HeartbeatKey({ address, asset })

    if (!this.heartbeats(hbk).exists) {
      return 0
    }

    const heartbeats = this.heartbeats(hbk).value
    let total: uint64 = 0

    for (let i = 0; i < heartbeats.length; i += 1) {
      if (includeStaked.native) {
        total += (
          heartbeats[i].held.native
          + heartbeats[i].hard.native
          + heartbeats[i].lock.native
        )
      } else {
        total += heartbeats[i].held.native
      }
    }

    return total / heartbeats.length
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetHeartbeatAverage(address: arc4.Address, asset: arc4.UintN64, includeStaked: arc4.Bool): uint64 {
    const hbk = new arc4HeartbeatKey({ address, asset })
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const heartbeats = this.heartbeats(hbk).value

    let total: uint64 = 0

    for (let i = 0; i < heartbeats.length; i += 1) {
      if (includeStaked.native) {
        total += (
          heartbeats[i].held.native
          + heartbeats[i].hard.native
          + heartbeats[i].lock.native
        )
      } else {
        total += heartbeats[i].held.native
      }
    }

    return total / heartbeats.length
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getInfoList(address: arc4.Address, type: arc4.UintN64, assets: arc4.DynamicArray<arc4.UintN64>): arc4.DynamicArray<arc4StakeValue> {
    let results = new arc4.DynamicArray<arc4StakeValue>()
    for (let i = 0; i < assets.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assets[i], type })
      if (!this.stakes(sk).exists) {
        results.push(new arc4StakeValue({
          amount: arc4Zero,
          lastUpdate: arc4Zero,
          expiration: arc4Zero
        }))
        continue
      }
      results.push(this.stakes(sk).value)
    }
    return results
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  mustGetInfoList(address: arc4.Address, type: arc4.UintN64, assets: arc4.DynamicArray<arc4.UintN64>): arc4.DynamicArray<arc4StakeValue> {
    let results = new arc4.DynamicArray<arc4StakeValue>()
    for (let i = 0; i < assets.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assets[i], type })
      assert(this.stakes(sk).exists, ERR_STAKE_NOT_FOUND)
      results.push(this.stakes(sk).value)
    }
    return results
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  stakeCheck(address: arc4.Address, assetChecks: arc4.DynamicArray<arc4AssetCheck>, type: arc4.UintN64, includeStaked: arc4.Bool): boolean {
    for (let i = 0; i < assetChecks.length; i += 1) {
      const sk = new arc4StakeKey({ address, asset: assetChecks[i].asset, type })
      if (!this.stakes(sk).exists) {
        return false
      }

      const stake = this.stakes(sk).value;

      let amountToCheck: uint64 = stake.amount.native
      if (type === arc4STAKING_TYPE_HEARTBEAT) {
        amountToCheck = this.getHeartbeatAverage(address, assetChecks[i].asset, includeStaked)
      }

      if (assetChecks[i].amount.native >= amountToCheck) {
        return false
      }
    }

    return true
  }

  // @ts-ignore
  @abimethod({ onCreate: 'require' })
  createApplication(): void { }

  stake(
    payment: gtxn.PaymentTxn,
    type: arc4.UintN64,
    amount: arc4.UintN64,
    expiration: arc4.UintN64
  ): void {
    const inTheFuture = expiration.native > Global.latestTimestamp
    const lessThanOneYearInTheFuture = expiration.native <= (Global.latestTimestamp + ONE_YEAR)
    const locked = type.native !== STAKING_TYPE_LOCK
    const isEscrow = type.native === STAKING_TYPE_HARD || type.native === STAKING_TYPE_LOCK
    const timestamp = new arc4.UintN64(Global.latestTimestamp)

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION);

    const arc4Sender = new arc4.Address(Txn.sender)
    const sk = new arc4StakeKey({
      address: arc4Sender,
      asset: arc4Zero,
      type
    })

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {
      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (amount.native + lockMBR), ERR_INVALID_PAYMENT_AMOUNT)

      } else if (type.native === STAKING_TYPE_HEARTBEAT) {
        // when heartbeat staking, the amount is ignored
        // instead we record balances across wallet & escrow
        const held = new arc4.UintN64(Txn.sender.balance)
        let hard = arc4Zero
        let lock = arc4Zero

        const hardStakeKey = new arc4StakeKey({ address: arc4Sender, asset: arc4Zero, type: arc4STAKING_TYPE_HARD })
        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }
    
        const lockStakeKey = new arc4StakeKey({ address: arc4Sender, asset: arc4Zero, type: arc4STAKING_TYPE_LOCK })
        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (heartBeatMBR + lockMBR), ERR_INVALID_PAYMENT_AMOUNT)

        const heartbeatKey = new arc4HeartbeatKey({
          address: new arc4.Address(Txn.sender),
          asset: arc4Zero
        })

        this.heartbeats(heartbeatKey).value = new arc4.StaticArray<arc4HeartbeatValues, 4>(
          new arc4HeartbeatValues({
            held,
            hard,
            lock,
            timestamp
          }),
          EmptyHeartbeatValue,
          EmptyHeartbeatValue,
          EmptyHeartbeatValue
        )
      } else {
        assert(Txn.sender.balance >= amount.native, ERR_INSUFFICIENT_BALANCE)
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === lockMBR, ERR_INVALID_PAYMENT_AMOUNT)
      }

      this.stakes(sk).value = new arc4StakeValue({
        amount,
        lastUpdate: timestamp,
        expiration,
      })
    } else {

      assert(type.native !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const currentStake = this.stakes(sk).value
      assert(expiration >= currentStake.expiration || !locked, ERR_BAD_EXPIRATION_UPDATE)

      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === amount.native, ERR_INVALID_PAYMENT_AMOUNT)
      } else {
        assert(Txn.sender.balance >= (currentStake.amount.native + amount.native), ERR_INSUFFICIENT_BALANCE)
      }

      const newAmount = new arc4.UintN64(currentStake.amount.native + amount.native)

      this.stakes(sk).value = new arc4StakeValue({
        amount: newAmount,
        lastUpdate: timestamp,
        expiration
      })
    }
  }

  stakeAsa(
    payment: gtxn.PaymentTxn,
    assetXfer: gtxn.AssetTransferTxn,
    type: arc4.UintN64,
    amount: arc4.UintN64,
    expiration: arc4.UintN64
  ): void {
    const inTheFuture = expiration.native > Global.latestTimestamp
    const lessThanOneYearInTheFuture = expiration.native <= (Global.latestTimestamp + ONE_YEAR)
    const locked = type.native !== STAKING_TYPE_LOCK
    const isEscrow = type.native === STAKING_TYPE_HARD || type.native === STAKING_TYPE_LOCK
    const timestamp = new arc4.UintN64(Global.latestTimestamp)

    assert((inTheFuture && lessThanOneYearInTheFuture) || !locked, ERR_BAD_EXPIRATION)

    const asset = new arc4.UintN64(assetXfer.xferAsset.id)
    const arc4Sender = new arc4.Address(Txn.sender)
    const sk = new arc4StakeKey({
      address: arc4Sender,
      asset,
      type
    })

    const isUpdate = this.stakes(sk).exists

    if (!isUpdate) {
      if (isEscrow) {
        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === lockMBR, ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount.native, ERR_INVALID_ASSET_AMOUNT)

      } else if (type.native === STAKING_TYPE_HEARTBEAT) {

        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)

        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount > 0, ERR_INVALID_ASSET_AMOUNT)

        const held = new arc4.UintN64(holdingAmount)
        let hard = arc4Zero
        let lock = arc4Zero

        const hardStakeKey = new arc4StakeKey({ address: arc4Sender, asset, type: arc4STAKING_TYPE_HARD })
        if (this.stakes(hardStakeKey).exists) {
          hard = this.stakes(hardStakeKey).value.amount
        }
    
        const lockStakeKey = new arc4StakeKey({ address: arc4Sender, asset, type: arc4STAKING_TYPE_LOCK })
        if (this.stakes(lockStakeKey).exists) {
          lock = this.stakes(lockStakeKey).value.amount
        }

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === (heartBeatMBR + lockMBR), ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)

        const heartbeatKey = new arc4HeartbeatKey({
          address: arc4Sender,
          asset: asset
        })

        this.heartbeats(heartbeatKey).value = new arc4.StaticArray<arc4HeartbeatValues, 4>(
          new arc4HeartbeatValues({
            held,
            hard,
            lock,
            timestamp
          }),
          EmptyHeartbeatValue,
          EmptyHeartbeatValue,
          EmptyHeartbeatValue
        )
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= amount.native, ERR_INSUFFICIENT_BALANCE)

        assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
        assert(payment.amount === lockMBR, ERR_INVALID_PAYMENT_AMOUNT)

        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === 0, ERR_INVALID_ASSET_AMOUNT)
      }

      this.stakes(sk).value = new arc4StakeValue({
        amount,
        lastUpdate: timestamp,
        expiration,
      })
    } else {

      assert(type.native !== STAKING_TYPE_HEARTBEAT, ERR_HEARTBEAT_CANNOT_UPDATE)
      const currentStake = this.stakes(sk).value
      assert(expiration >= currentStake.expiration || !locked, ERR_BAD_EXPIRATION_UPDATE)

      // updates to asa staking shouldnt require any mbr changes
      assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)
      assert(payment.amount === 0, ERR_INVALID_PAYMENT_AMOUNT)

      if (isEscrow) {
        assert(assetXfer.assetReceiver === Global.currentApplicationAddress, ERR_INVALID_ASSET_AMOUNT)
        assert(assetXfer.assetAmount === amount.native, ERR_INVALID_ASSET_AMOUNT)
      } else {
        const [holdingAmount, optedIn] = AssetHolding.assetBalance(Txn.sender, asset.native)
        assert(optedIn, ERR_NOT_OPTED_IN)
        assert(holdingAmount >= (currentStake.amount.native + amount.native), ERR_INSUFFICIENT_BALANCE)
      }

      const newAmount = new arc4.UintN64(currentStake.amount.native + amount.native)

      this.stakes(sk).value = new arc4StakeValue({
        amount: newAmount,
        lastUpdate: timestamp,
        expiration
      })
    }
  }

  withdraw(asset: arc4.UintN64, type: arc4.UintN64): void {
    assert(type.native === STAKING_TYPE_HARD || type.native === STAKING_TYPE_LOCK, ERR_WITHDRAW_IS_ONLY_FOR_HARD_OR_LOCK)
    const arc4Sender = new arc4.Address(Txn.sender)
    const sk = new arc4StakeKey({ address: arc4Sender, asset, type })
    assert(this.stakes(sk).exists, ERR_NO_LOCK)

    const currentStake = this.stakes(sk).value
    assert(type.native !== STAKING_TYPE_LOCK || currentStake.expiration.native < Global.latestTimestamp, ERR_LOCKED)

    if (asset.native === 0) {
      itxn
        .payment({
          receiver: Txn.sender,
          amount: currentStake.amount.native,
          fee: 0
        })
        .submit()
    } else {
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          assetAmount: currentStake.amount.native,
          xferAsset: asset.native,
          fee: 0
        })
        .submit()
    }
    this.stakes(sk).delete();
  }

  createHeartbeat(address: arc4.Address, asset: arc4.UintN64): void {
    assert(Txn.sender === this.heartbeatManagerAddress.value, ERR_NOT_HEARTBEAT_MANAGER)

    const hbk = new arc4HeartbeatKey({ address, asset })
    assert(this.heartbeats(hbk).exists, ERR_HEARBEAT_NOT_FOUND)

    const timestamp = new arc4.UintN64(Global.latestTimestamp)
    const heartbeats = this.heartbeats(hbk).value

    const [holdings] = AssetHolding.assetBalance(address.native, asset.native)
    const held = new arc4.UintN64(holdings)
    let hard = arc4Zero
    let lock = arc4Zero

    const hardStakeKey = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_HARD })
    if (this.stakes(hardStakeKey).exists) {
      hard = this.stakes(hardStakeKey).value.amount
    }

    const lockStakeKey = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_LOCK })
    if (this.stakes(lockStakeKey).exists) {
      lock = this.stakes(lockStakeKey).value.amount
    }

    /**
     * The index with the highest timestamp is the newest 
     * since we only keep history of the last 4 heartbeats
     * all we need to do is check which timestamp in the array
     * is the highest and replace the one after it with the new heartbeat
     * 
    */
    for (let i = 0; i < 4; i += 1) {
      if (i === 3 || heartbeats[i].timestamp > heartbeats[i + 1].timestamp) {
        const indexToModify = i === 3 ? 0 : i + 1;
        this.heartbeats(hbk).value[indexToModify] = new arc4HeartbeatValues({
          held,
          hard,
          lock,
          timestamp
        })
        return
      }
    }
  }

  softCheck(address: arc4.Address, asset: arc4.UintN64): boolean {
    const sk = new arc4StakeKey({ address, asset, type: arc4STAKING_TYPE_SOFT })
    assert(this.stakes(sk).exists, ERR_STAKE_DOESNT_EXIST)
    
    const stake = this.stakes(sk).value
    const lastUpdate = new arc4.UintN64(Global.latestTimestamp)
    
    if (asset.native === 0) {
      const valid = address.native.balance >= stake.amount.native
      if (!valid) {
        const arc4Balance = new arc4.UintN64(address.native.balance)

        this.stakes(sk).value = new arc4StakeValue({
          amount: arc4Balance,
          lastUpdate,
          expiration: arc4Zero,
        })
      }
      return valid
    }

    const [holdingAmount, optedIn] = AssetHolding.assetBalance(address.native, asset.native)
    assert(optedIn, ERR_NOT_OPTED_IN)
    const valid = holdingAmount >= stake.amount.native
    if (!valid) {
      const arc4Balance = new arc4.UintN64(holdingAmount)
      
      this.stakes(sk).value = new arc4StakeValue({
        amount: arc4Balance,
        lastUpdate,
        expiration: arc4Zero,
      })
    }

    return valid
  }
}