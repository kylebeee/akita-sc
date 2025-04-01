import {
  Application,
  arc4,
  assert,
  BoxMap,
  bytes,
  Global,
  GlobalState,
  gtxn,
  itxn,
  OnCompleteAction,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, Bool, decodeArc4, DynamicArray, methodSelector, StaticBytes, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { ContractWithCreatorOnlyOptInAndGate } from '../../utils/base_contracts/gate.algo'
import { Staking } from '../staking/staking.algo'
import { Rewards } from '../rewards/rewards.algo'
import { MetaMerkles } from '../meta_merkles/meta_merkles.algo'
import {
  arc4EntryData,
  arc4EntryKey,
  arc4Reward,
  arc4StakeEntry,
  DistributionTypeEven,
  DistributionTypeFlat,
  DistributionTypePercentage,
  DistributionTypeShuffle,
  EntryData,
  POOL_STAKING_TYPE_HEARTBEAT,
  POOL_STAKING_TYPE_NONE,
  POOL_STAKING_TYPE_SOFT,
  PoolStakingType,
  PoolState,
  Reward,
  StakeEntry,
} from './types'
import { arc4RootKey, RootKey } from '../meta_merkles/types'
import { GateArgs } from '../../utils/types/gates'
import { ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../../utils/errors'
import { arc4StakeInfo, StakingType } from '../staking/types'
import { bytes32 } from '../../utils/types/base'
import { MERKLE_TREE_TYPE_ASSET } from '../meta_merkles/constants'
import {
  DisbursementPhaseAllocation,
  DisbursementPhaseFinalization,
  DisbursementPhaseIdle,
  DisbursementPhasePreparation,
  MaxAlgoIterationAmount,
  MaxIterationAmount,
  PoolBoxPrefixDisbursements,
  PoolBoxPrefixEntries,
  PoolBoxPrefixEntriesByAddress,
  PoolGlobalStateKeyActiveDisbursementID,
  PoolGlobalStateKeyAllowLateSignups,
  PoolGlobalStateKeyCreator,
  PoolGlobalStateKeyDisbursementCursor,
  PoolGlobalStateKeyDisbursementPhase,
  PoolGlobalStateKeyEndingRound,
  PoolGlobalStateKeyEntryCount,
  PoolGlobalStateKeyGateID,
  PoolGlobalStateKeyGateSize,
  PoolGlobalStateKeyLastRewardRound,
  PoolGlobalStateKeyMaxEntries,
  PoolGlobalStateKeyMinimumStakeAmount,
  PoolGlobalStateKeyQualifiedStake,
  PoolGlobalStateKeyReward,
  PoolGlobalStateKeyRewardInterval,
  PoolGlobalStateKeySalt,
  PoolGlobalStateKeySignUpRound,
  PoolGlobalStateKeyStakeKey,
  PoolGlobalStateKeyStartingRound,
  PoolGlobalStateKeyStatus,
  PoolGlobalStateKeyTitle,
  PoolGlobalStateKeyTotalStaked,
  PoolGlobalStateKeyType,
  PoolStatusDisbursing,
  PoolStatusDraft,
  PoolStatusFinal,
} from './constants'
import { AkitaDAO } from '../dao/dao.algo'
import { PaymentTxn } from '@algorandfoundation/algorand-typescript/gtxn'
import { arc4UserAllocation, arc4UserAllocations } from '../rewards/types'
import { BasePool } from './base.algo'
import { classes } from 'polytype'
import { Gate } from '../gates/gate.algo'

export class Pool extends classes(ContractWithCreatorOnlyOptInAndGate, BasePool) {
  /** the status the pool is in */
  status = GlobalState<arc4.UintN8>({ key: PoolGlobalStateKeyStatus })
  /** title of the staking pool */
  title = GlobalState<string>({ key: PoolGlobalStateKeyTitle })
  /** the method of staking to be used for the pool */
  type = GlobalState<PoolStakingType>({ key: PoolGlobalStateKeyType })
  /** the reward asset for the pool */
  reward = GlobalState<arc4Reward>({ key: PoolGlobalStateKeyReward })
  /** the round sign ups for the pool are allowed */
  signupRound = GlobalState<uint64>({ key: PoolGlobalStateKeySignUpRound })
  /** whether signups are allowed after the staking pool begins */
  allowLateSignups = GlobalState<boolean>({ key: PoolGlobalStateKeyAllowLateSignups })
  /** the round the pool starts at *if applicable* */
  startingRound = GlobalState<uint64>({ key: PoolGlobalStateKeyStartingRound })
  /** the round the pool ends at *if applicable* */
  endingRound = GlobalState<uint64>({ key: PoolGlobalStateKeyEndingRound })
  /** the interval that rewards should be paid out on */
  rewardInterval = GlobalState<uint64>({ key: PoolGlobalStateKeyRewardInterval })
  /** the round the last reward was last paid out on */
  lastRewardRound = GlobalState<uint64>({ key: PoolGlobalStateKeyLastRewardRound })
  /** the maximum entries allowed for the pool */
  maxEntries = GlobalState<uint64>({ key: PoolGlobalStateKeyMaxEntries })
  /** the number of entries in a pool */
  entryID = GlobalState<uint64>({ key: PoolGlobalStateKeyEntryCount })
  /** the total amount staked in the pool */
  totalStaked = GlobalState<uint64>({ key: PoolGlobalStateKeyTotalStaked })
  /** the total unique assets staked */
  // uniqueAssetsStaked = GlobalState<uint64>({ key: PoolGlobalStateKeyUniqueAssetsStaked })
  /**
   * the name for the meta merkle asset group to validate staking
   * stake key can be empty if distribution !== DistributionTypePercentage
   */
  stakeKey = GlobalState<arc4RootKey>({ key: PoolGlobalStateKeyStakeKey })
  /** minimum stake amount */
  minimumStakeAmount = GlobalState<uint64>({ key: PoolGlobalStateKeyMinimumStakeAmount })
  /** the gate id of the pool */
  gateID = GlobalState<uint64>({ key: PoolGlobalStateKeyGateID })
  /** the size of the gate were using */
  gateSize = GlobalState<uint64>({ key: PoolGlobalStateKeyGateSize })
  /** the address of the creator of the staking pool */
  creator = GlobalState<Address>({ key: PoolGlobalStateKeyCreator })
  /** marketplace is pool creation side marketplace */
  // marketplace = GlobalState<Address>({ key: PoolGlobalStateKeyMarketplace })
  /** salt for randomness */
  salt = GlobalState<bytes>({ key: PoolGlobalStateKeySalt })
  /** a sub status of the disbursement phase of the pool */
  disbursementPhase = GlobalState<UintN8>({ key: PoolGlobalStateKeyDisbursementPhase })
  /** the id of the currently active disbursement */
  activeDisbursementID = GlobalState<uint64>({ key: PoolGlobalStateKeyActiveDisbursementID })
  /** the cursor for the current disbursement */
  disbursementCursor = GlobalState<uint64>({ key: PoolGlobalStateKeyDisbursementCursor })
  /** the count of qualified stake during the preparation phase of a disbursement */
  qualifiedStakers = GlobalState<uint64>({ key: PoolGlobalStateKeyQualifiedStake })
  /** the total qualified stake for the pool */
  qualifiedStake = GlobalState<uint64>({ key: PoolGlobalStateKeyQualifiedStake })


  /** indexed entries for efficient iteration */
  entries = BoxMap<uint64, arc4EntryData>({ keyPrefix: PoolBoxPrefixEntries })
  /** the entries in the pool */
  entriesByAddress = BoxMap<arc4EntryKey, uint64>({ keyPrefix: PoolBoxPrefixEntriesByAddress })
  /** the disbursements this pool as created & finalized */
  disbursements = BoxMap<uint64, StaticBytes<0>>({ keyPrefix: PoolBoxPrefixDisbursements })

  private newEntryID(): uint64 {
    const id = this.entryID.value
    this.entryID.value += 1
    return id
  }

  private getIterationAmount(txnCount: uint64): uint64 {
    const difference = this.entryID.value - this.disbursementCursor.value

    let max = MaxAlgoIterationAmount / txnCount

    return difference > max ? max : difference
  }

  private processPreparationPhase(): void {
    const iterationAmount = this.getIterationAmount(2 + this.gateSize.value)
    
    let count: uint64 = 0
    let total: uint64 = 0
    for (let id = this.disbursementCursor.value; id < iterationAmount; id++) {
      const entry = decodeArc4<EntryData>(this.entries(id).value.bytes)
      if (entry.disqualified) {
        continue
      }

      // stake type none: 0 - 1 ref
      // stake type heartbeat: 1 - 1 ref
      // stake other: 1 - 1 ref
      const { valid } = this.getStakeValue(id)
      if (!valid) {
        continue
      }

      const passes = this.gate(entry.address, this.gateID.value, entry.gateArgs)
      if (!passes) {
        continue
      }

      count += 1
      total += entry.quantity
    }

    this.disbursementCursor.value += iterationAmount
    this.qualifiedStakers.value += count
    this.qualifiedStake.value += total

    if (this.entryID.value === this.disbursementCursor.value) {
      this.disbursementPhase.value = DisbursementPhaseAllocation
      this.disbursementCursor.value = 0
    }
  }

  private createPercentageDisbursement(): void {
    const iterationAmount = this.getIterationAmount()
    const reward = decodeArc4<Reward>(this.reward.value.bytes)

    for (let i = this.disbursementCursor.value; i < iterationAmount; i++) {
      const entry = decodeArc4<EntryData>(this.entries(i).value.bytes)

      if (entry.disqualified) {
        continue
      }

      const userShare = entry.quantity / this.qualifiedStake.value





    }
  }

  private createFlatDisbursement(asset: uint64, amount: uint64): void {
    const iterationAmount = this.getIterationAmount()

    for (let i = this.disbursementCursor.value; i < iterationAmount; i++) {
      const entry = decodeArc4<EntryData>(this.entries(i).value.bytes)

      if (entry.disqualified) {
        continue
      }

      const passes = this.gate(entry.address, this.gateID.value, entry.gateArgs)
      if (!passes) {
        continue
      }

      const allocations = new DynamicArray(
        new arc4UserAllocation({
          address: entry.address,
          amount: new UintN64(amount)
        }),
      )

      this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations)
      this.disbursementCursor.value += 1
    }
  }

  private createEvenDisbursement(): void {
    const iterationAmount = this.getIterationAmount()
  }

  private createShuffleDisbursement(): void {
    const iterationAmount = this.getIterationAmount()
  }

  private checkByID(id: uint64): { valid: boolean, balance: uint64 } {
    assert(
      this.type.value !== POOL_STAKING_TYPE_NONE ||
      this.type.value !== POOL_STAKING_TYPE_HEARTBEAT,
      'check is not relevant for this kind of pool'
    )

    const entry = decodeArc4<EntryData>(this.entries(id).value.bytes)

    if (entry.disqualified) {
      return { valid: false, balance: 0 }
    }

    if (this.type.value === POOL_STAKING_TYPE_SOFT) {
      const check = abiCall(Staking.prototype.softCheck, {
        appId: super.getAppList().staking,
        args: [entry.address, entry.asset],
        fee: 0,
      }).returnValue

      if (check.balance >= entry.quantity) {
        return { valid: true, balance: check.balance }
      }
    } else {
      const info = abiCall(Staking.prototype.getInfo, {
        appId: super.getAppList().staking,
        args: [
          entry.address,
          new arc4StakeInfo({
            asset: new UintN64(entry.asset),
            type: this.stakingType(),
          }),
        ],
        fee: 0,
      }).returnValue

      if (info.amount >= entry.quantity) {
        return { valid: true, balance: info.amount }
      }
    }

    this.entries(id).value.disqualified = new Bool(true)
    return { valid: false, balance: 0 }
  }

  private getLatestWindowStart(): uint64 {
    return Global.round - ((Global.round - this.startingRound.value) % this.rewardInterval.value)
  }

  private validWindow(): boolean {
    const latestWindowStart = this.getLatestWindowStart()
    return latestWindowStart !== Global.round && this.lastRewardRound.value < latestWindowStart
  }

  // private distributeShuffle(): void {

  //   const reward = decodeArc4<Reward>(this.reward.value.bytes)

  //   let winnerCount: uint64 = 1
  //   if (reward.winnerCount > 0) {
  //     winnerCount = reward.winnerCount
  //   }

  //   const seed = abiCall(RandomnessBeacon.prototype.get, {
  //     appId: super.getAppList().vrfBeacon,
  //     args: [roundToUse, this.salt.value],
  //     fee: 0,
  //   }).returnValue

  //   if (seed.length === 0) {
  //     this.vrfGetFailureCount.value += 1
  //     return
  //   }

  //   // Initialize PCG randomness with the seed
  //   const rngState = pcg64Init(seed.slice(0, 16))

  //   // Calculate reward amount per winner
  //   const winnerRewardAmount = reward.quantity / winnerCount

  //   // make upper bounds inclusive if we can
  //   let upperBound = this.weightedBidTotal.value
  //   if (upperBound < MAX_UINT64) {
  //     upperBound = upperBound += 1
  //   }

  //   const rngResult = pcg64Random(rngState, 1, upperBound, reward.winnerCount)
  //   // this.winningTicket.value = rngResult[1][0];
  // }

  private stakingType(): StakingType {
    assert(this.type.value !== POOL_STAKING_TYPE_NONE, 'pool staking type is not set')
    return new UintN8(this.type.value.native - 1)
  }

  private getStakeValue(id: uint64): { valid: boolean, balance: uint64 } {
    if (this.type.value === POOL_STAKING_TYPE_NONE) {
      return { valid: true, balance: 0 }
    } else if (this.type.value === POOL_STAKING_TYPE_HEARTBEAT) {
      const entry = decodeArc4<EntryData>(this.entries(id).value.bytes)

      const avg = abiCall(Staking.prototype.getHeartbeatAverage, {
        appId: super.getAppList().staking,
        args: [entry.address, entry.asset, true],
        fee: 0,
      }).returnValue

      return { valid: true, balance: avg }
    }

    return this.checkByID(id)
  }

  private createRewards(title: string, timeToUnlock: uint64, expiration: uint64): uint64 {

    const rewardsApp = Application(super.getAppList().rewards)

    const mbrPayment = itxn.payment({
      receiver: rewardsApp.address,
      amount: 35_300 + (400 * title.length),
      fee: 0,
    })

    const feePayment = itxn.payment({
      receiver: this.akitaDAO.value.address,
      amount: super.getStakingFees().rewardsFee,
      fee: 0,
    })

    return abiCall(Rewards.prototype.createDisbursement, {
      appId: rewardsApp,
      args: [
        mbrPayment,
        feePayment,
        itxn.applicationCall({
          appId: this.akitaDAO.value,
          onCompletion: OnCompleteAction.NoOp,
          appArgs: [
            methodSelector(AkitaDAO.prototype.receivePayment),
            feePayment
          ],
          fee: 0
        }),
        title,
        timeToUnlock,
        expiration,
        '',
      ],
      fee: 0,
    }).returnValue
  }

  private createRewardAllocations(
    disbursementID: uint64,
    asset: uint64,
    allocations: arc4UserAllocations
  ): void {

    const rewardsApp = Application(super.getAppList().rewards)
    const mbrAmount = this.calculateAllocationMBR(allocations)
    const paymentAmount = this.sumAllocations(allocations)

    if (asset === 0) {
      // ALGO allocations
      abiCall(Rewards.prototype.createUserAllocations, {
        appId: rewardsApp,
        args: [
          itxn.payment({
            receiver: rewardsApp.address,
            amount: mbrAmount + paymentAmount,
            fee: 0,
          }),
          disbursementID,
          allocations,
        ],
      })
    } else {
      // ASA allocations
      abiCall(Rewards.prototype.createAsaUserAllocations, {
        appId: rewardsApp,
        args: [
          itxn.payment({
            receiver: rewardsApp.address,
            amount: mbrAmount,
            fee: 0,
          }),
          itxn.assetTransfer({
            assetReceiver: rewardsApp.address,
            xferAsset: asset,
            assetAmount: paymentAmount,
            fee: 0,
          }),
          disbursementID,
          allocations,
        ],
      })
    }
  }

  private finalizeRewards(disbursementID: uint64): void {
    const rewardsApp = Application(super.getAppList().rewards)

    abiCall(Rewards.prototype.finalizeDisbursement, {
      appId: rewardsApp,
      args: [disbursementID],
      fee: 0,
    })
  }

  private calculateAllocationMBR(allocations: arc4UserAllocations): uint64 {
    return 24_900 * allocations.length
  }

  private sumAllocations(allocations: arc4UserAllocations): uint64 {
    let sum = 0
    for (let i = 0; i < allocations.length; i++) {
      sum += allocations[i].amount.native
    }
    return sum
  }

  // @ts-ignore
  @abimethod({ onCreate: 'require' })
  createApplication(
    title: string,
    type: StakingType,
    reward: arc4Reward,
    creator: Address,
    marketplace: Address,
    stakeKey: arc4RootKey,
    minimumStakeAmount: uint64,
    gateID: uint64,
    maxEntries: uint64,
    akitaDAO: uint64
  ): void {
    this.status.value = PoolStatusDraft
    this.title.value = title
    this.type.value = type
    this.reward.value = reward
    this.creator.value = creator
    this.marketplace.value = marketplace

    // stake key is optional if the distribution type is not percentage based
    // we use this to qualify stakes for the pool but in some cases users may
    // want to distribute rewards on something else like subscription status
    // or impact score. In these cases the gate is the only requirement
    // and the stake key is not needed
    assert(
      stakeKey.address.native !== Global.zeroAddress ||
      reward.distribution !== DistributionTypePercentage,
      'stake key is not set'
    )

    this.stakeKey.value = stakeKey
    this.minimumStakeAmount.value = minimumStakeAmount
    this.gateID.value = gateID
    this.maxEntries.value = maxEntries
    this.akitaDAO.value = Application(akitaDAO)
    this.salt.value = Txn.txId
    this.disbursementPhase.value = DisbursementPhaseIdle
    this.activeDisbursementID.value = 0
    this.disbursementCursor.value = 0
    this.qualifiedStakers.value = 0
  }

  init() {
    assert(Global.callerApplicationAddress === Global.creatorAddress, 'only the factory can init the pool')

    if (this.gateID.value > 0) {
      this.gateSize.value = abiCall(Gate.prototype.size, {
        appId: super.getAppList().gate,
        args: [this.gateID.value],
        fee: 0,
      }).returnValue
    }
  }

  // @ts-ignore
  @abimethod({ allowActions: 'DeleteApplication' })
  deleteApplication(): void {
    assert(Txn.sender === this.creator.value.native, 'only the creator can delete the pool')
    assert(this.status.value === PoolStatusDraft || Global.round > this.endingRound.value, 'the pool must be in draft or ended')
  }

  finalize(signupRound: uint64, startingRound: uint64, endingRound: uint64) {
    assert(Txn.sender === this.creator.value.native, 'only the creator can finalize the pool')
    assert(this.status.value === PoolStatusDraft, 'the pool must be in draft state to finalize')
    assert(
      signupRound > Global.round || (signupRound === 0 && this.allowLateSignups.value),
      'the signup round must be zero and late sign ups allowed or in the future'
    )
    // if startingRound is zero then signUpRound must also be zero and allowLateSignups must be true
    assert(
      startingRound === 0 ||
      startingRound > Global.round,
      'the starting round must be zero or in the future'
    )

    if (startingRound === 0) {
      assert(signupRound === 0 && this.allowLateSignups.value, 'if the starting round is zero, the signup round must be zero and allowLateSignups must be true')
      startingRound = Global.round
    }

    assert(
      endingRound === 0 || endingRound > (startingRound + 10),
      'the ending round must be zero or after the starting round + 10'
    )

    this.signupRound.value = signupRound
    this.startingRound.value = startingRound
    this.endingRound.value = endingRound
    this.status.value = PoolStatusFinal
  }

  enter(payment: PaymentTxn, entries: DynamicArray<arc4StakeEntry>, args: GateArgs): void {
    // Verify the pool is live
    assert(this.isLive(), 'the pool is not live')
    assert(
      this.gate(new Address(Txn.sender), this.gateID.value, args),
      'user does not meet gate requirements'
    )
    assert(
      (this.entryID.value + 1) < this.maxEntries.value ||
      this.maxEntries.value === 0,
      'pool has reached maximum entries'
    )
    // Verify payment for box storage (increased for additional box)
    assert(payment.receiver === Global.currentApplicationAddress, ERR_INVALID_PAYMENT_RECEIVER)

    const costs = this.mbr()
    const entryMBR = costs.entries + costs.entriesByAddress

    assert(payment.amount === (entryMBR * entries.length), ERR_INVALID_PAYMENT_AMOUNT)

    for (let i: uint64 = 0; i < entries.length; i++) {
      const newEntry = decodeArc4<StakeEntry>(entries[i].bytes)

      assert(newEntry.quantity >= this.minimumStakeAmount.value, 'quantity is less than minimum stake amount')

      // check their actual balance if the assets aren't escrowed
      if (
        this.type.value === POOL_STAKING_TYPE_HEARTBEAT ||
        this.type.value === POOL_STAKING_TYPE_SOFT
      ) {
        const [balance, optedIn] = AssetHolding.assetBalance(Txn.sender, newEntry.asset)
        assert(optedIn && balance >= entries[i].quantity.native, 'user does not have min balance')
      }

      const stakeInfo = abiCall(Staking.prototype.getInfo, {
        appId: super.getAppList().staking,
        args: [
          new Address(Txn.sender),
          new arc4StakeInfo({
            asset: new UintN64(newEntry.asset),
            type: this.stakingType(),
          }),
        ],
        fee: 0,
      }).returnValue

      assert(stakeInfo.amount >= newEntry.quantity, 'user does not have enough staked')

      const verified = abiCall(MetaMerkles.prototype.verify, {
        appId: super.getAppList().metaMerkles,
        args: [
          this.stakeKey.value.address,
          this.stakeKey.value.name,
          bytes32(sha256(sha256(itob(newEntry.asset)))),
          newEntry.proof,
          MERKLE_TREE_TYPE_ASSET,
        ],
        fee: 0,
      }).returnValue

      assert(verified, 'failed to verify stake requirements')

      const entryID = this.newEntryID()
      this.entries(entryID).value = new arc4EntryData({
        address: new Address(Txn.sender),
        asset: new UintN64(newEntry.asset),
        quantity: new UintN64(newEntry.quantity),
        gateArgs: args,
        disqualified: new Bool(false)
      })

      const aKey = new arc4EntryKey({
        address: new Address(Txn.sender),
        asset: new UintN64(newEntry.asset),
      })

      this.entriesByAddress(aKey).value = entryID
    }
  }

  withdraw(): void {

  }

  startDisbursement(): void {
    assert(this.isLive(), 'the pool is not live')
    assert(this.validWindow(), 'distribution window is not open')
    assert(this.disbursementPhase.value === DisbursementPhaseIdle, 'distribution already in progress')

    const disbursementID = this.createRewards(
      `${this.title.value} - Rewards`,
      Global.latestTimestamp,
      Global.latestTimestamp + this.reward.value.expiration.native
    )

    this.status.value = PoolStatusDisbursing
    this.activeDisbursementID.value = disbursementID
    this.lastRewardRound.value = Global.round
    this.disbursementCursor.value = 0
    this.qualifiedStakers.value = 0
    this.qualifiedStake.value = 0

    // Set initial phase based on distribution type
    if (this.reward.value.distribution !== DistributionTypeFlat) {
      this.disbursementPhase.value = DisbursementPhasePreparation // Need total calculation first
    } else {
      this.disbursementPhase.value = DisbursementPhaseAllocation // Can go straight to allocation
    }
  }

  disburseRewards(): void {
    assert(this.status.value === PoolStatusDisbursing, 'pool is not in disbursement phase')
    assert(
      this.disbursementPhase.value === DisbursementPhasePreparation ||
      this.disbursementPhase.value === DisbursementPhaseAllocation,
      'not ready to disburse'
    )

    const reward = decodeArc4<Reward>(this.reward.value.bytes)

    if (this.disbursementPhase.value === DisbursementPhasePreparation) {
      this.processPreparationPhase()
    } else {
      if (reward.distribution === DistributionTypePercentage) {
        this.createPercentageDisbursement()
      } else if (reward.distribution === DistributionTypeFlat) {
        this.createFlatDisbursement(reward.asset, reward.rate)
      } else if (reward.distribution === DistributionTypeEven) {
        this.createEvenDisbursement()
      } else if (reward.distribution === DistributionTypeShuffle) {
        this.createShuffleDisbursement()
      } else {
        assert(false, 'unknown reward rate type')
      }
    }
  }

  finalizeDistribution(): void {
    assert(this.disbursementPhase.value === DisbursementPhaseFinalization, 'not ready to finalize')

    this.finalizeRewards(this.activeDisbursementID.value)

    this.disbursements(this.activeDisbursementID.value).value = new StaticBytes<0>()

    this.activeDisbursementID.value = 0
    this.disbursementPhase.value = DisbursementPhaseIdle
    this.disbursementCursor.value = 0
    this.qualifiedStakers.value = 0
    this.qualifiedStake.value = 0
    this.status.value = PoolStatusFinal
  }

  check(address: Address, asset: uint64): { valid: boolean, balance: uint64 } {
    const key = new arc4EntryKey({ address, asset: new UintN64(asset) })
    const id = this.entriesByAddress(key).value
    return this.checkByID(id)
  }

  /** @returns a boolean of whether sign ups are open */
  // @ts-ignore
  @abimethod({ readonly: true })
  signUpsOpen(): boolean {
    return (
      this.status.value !== PoolStatusDraft &&
      Global.round > this.signupRound.value &&
      (Global.round < this.startingRound.value || this.allowLateSignups.value)
    )
  }

  /** @returns a boolean of whether the pool is live */
  // @ts-ignore
  @abimethod({ readonly: true })
  isLive(): boolean {
    return (
      this.status.value !== PoolStatusDraft &&
      (Global.round >= this.startingRound.value) &&
      (Global.round <= this.endingRound.value || this.endingRound.value === 0)
    )
  }

  // @ts-ignore
  @abimethod({ readonly: true })
  getState(): PoolState {
    return {
      status: this.status.value,
      title: this.title.value,
      type: this.type.value,
      reward: decodeArc4<Reward>(this.reward.value.bytes),
      signupRound: this.signupRound.value,
      allowLateSignups: this.allowLateSignups.value,
      startingRound: this.startingRound.value,
      endingRound: this.endingRound.value,
      maxEntries: this.maxEntries.value,
      entryCount: (this.entryID.value + 1),
      totalStaked: this.totalStaked.value,
      stakeKey: decodeArc4<RootKey>(this.stakeKey.value.bytes),
      minimumStakeAmount: this.minimumStakeAmount.value,
      gateID: this.gateID.value,
      creator: this.creator.value,
    }
  }
}
