import {
  Account,
  Application,
  arc4,
  assert,
  assertMatch,
  Asset,
  BoxMap,
  Bytes,
  bytes,
  Global,
  GlobalState,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'
import { abiCall, abimethod, Address, decodeArc4, DynamicArray, StaticBytes, UintN64, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'
import { AssetHolding, itob, sha256 } from '@algorandfoundation/algorand-typescript/op'
import { Staking } from '../staking/contract.algo'
import { Rewards } from '../rewards/contract.algo'
import { MetaMerkles } from '../meta-merkles/contract.algo'
import {
  arc4EntryKey,
  arc4RaffleCursor,
  arc4Reward,
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
  RaffleCursor,
  Reward,
  StakeEntry,
} from './types'
import { arc4RootKey, RootKey } from '../meta-merkles/types'
import { GateArgs } from '../utils/types/gates'
import { ERR_INVALID_PAYMENT, ERR_INVALID_PAYMENT_AMOUNT, ERR_INVALID_PAYMENT_RECEIVER } from '../utils/errors'
import { arc4StakeInfo, StakingType } from '../staking/types'
import {
  DisbursementPhaseAllocation,
  DisbursementPhaseFinalization,
  DisbursementPhaseIdle,
  DisbursementPhasePreparation,
  MaxGlobalStateUint64Array,
  PoolBoxPrefixDisbursements,
  PoolBoxPrefixEntries,
  PoolBoxPrefixEntriesByAddress,
  PoolGlobalStateKeyActiveDisbursementID,
  PoolGlobalStateKeyActiveDisbursementWindow,
  PoolGlobalStateKeyAkitaRoyalty,
  PoolGlobalStateKeyAkitaRoyaltyAmount,
  PoolGlobalStateKeyAllowLateSignups,
  PoolGlobalStateKeyCreator,
  PoolGlobalStateKeyDisbursementCursor,
  PoolGlobalStateKeyDisbursementPhase,
  PoolGlobalStateKeyEndTimestamp,
  PoolGlobalStateKeyEntryCount,
  PoolGlobalStateKeyGateID,
  PoolGlobalStateKeyGateSize,
  PoolGlobalStateKeyLastDisbursementTimestamp,
  PoolGlobalStateKeyMarketplace,
  PoolGlobalStateKeyMarketplaceRoyalties,
  PoolGlobalStateKeyMaxEntries,
  PoolGlobalStateKeyMinimumStakeAmount,
  PoolGlobalStateKeyQualifiedStake,
  PoolGlobalStateKeyRaffleCursor,
  PoolGlobalStateKeyReward,
  PoolGlobalStateKeyRewardInterval,
  PoolGlobalStateKeySalt,
  PoolGlobalStateKeySignupTimestamp,
  PoolGlobalStateKeyStakeKey,
  PoolGlobalStateKeyStartTimestamp,
  PoolGlobalStateKeyStatus,
  PoolGlobalStateKeyTitle,
  PoolGlobalStateKeyTotalStaked,
  PoolGlobalStateKeyType,
  PoolGlobalStateKeyVRFFailureCount,
  PoolGlobalStateKeyWinningTickets,
  PoolStatusDisbursing,
  PoolStatusDraft,
  PoolStatusFinal,
} from './constants'
import { ERR_DISBURSEMENT_NOT_READY_FOR_FINALIZATION, ERR_INVALID_DISBURSEMENT_PHASE, ERR_INVALID_POOL_TYPE_FOR_CHECK, ERR_MAX_ENTRIES_CANNOT_BE_GREATER_THAN_RATE, ERR_NOT_ENOUGH_FUNDS, ERR_NOT_READY_TO_DISBURSE, ERR_RATE_MUST_BE_GREATER_THAN_WINNER_COUNT, ERR_RATE_MUST_BE_GREATER_THAN_ZERO, ERR_STAKE_KEY_REQUIRED, ERR_WINNING_TICKETS_ALREADY_EXIST } from './errors'
import { arc4UserAllocation, arc4UserAllocations } from '../rewards/types'
import { BasePool } from './base'
import { classes } from 'polytype'
import { Gate } from '../gates/contract.algo'
import { RandomnessBeacon } from '../utils/types/randomness-beacon'
import { pcg64Init, pcg64Random } from '../utils/types/lib_pcg/pcg64.algo'
import { MAX_UINT64 } from '../utils/constants'
import { ContractWithCreatorOnlyOptIn } from '../utils/base-contracts/optin'
import { calcPercent, gateCheck, getAkitaAppList, getOtherAppList, getStakingFees, getUserImpact, impactRange, percentageOf } from '../utils/functions'
import { AkitaBaseEscrow } from '../utils/base-contracts/base'
import { fee } from '../utils/constants'
import { AkitaDAOEscrowAccountStakingPools } from '../dao/constants'

const MERKLE_TREE_TYPE_ASSET: uint64 = 1

export class Pool extends classes(
  BasePool,
  AkitaBaseEscrow,
  ContractWithCreatorOnlyOptIn
) {

  // GLOBAL STATE ---------------------------------------------------------------------------------

  /** the status the pool is in */
  status = GlobalState<arc4.UintN8>({ key: PoolGlobalStateKeyStatus })
  /** title of the staking pool */
  title = GlobalState<string>({ key: PoolGlobalStateKeyTitle })
  /** the method of staking to be used for the pool */
  type = GlobalState<PoolStakingType>({ key: PoolGlobalStateKeyType })
  /** the reward asset for the pool */
  reward = GlobalState<arc4Reward>({ key: PoolGlobalStateKeyReward })
  /** the timestamp when sign ups for the pool are allowed */
  signupTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeySignupTimestamp })
  /** whether signups are allowed after the staking pool begins */
  allowLateSignups = GlobalState<boolean>({ key: PoolGlobalStateKeyAllowLateSignups })
  /** the timestamp when the pool starts */
  startTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeyStartTimestamp })
  /** the timestamp when the pool ends */
  endTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeyEndTimestamp })
  /** the interval that rewards should be paid out on in seconds */
  rewardInterval = GlobalState<uint64>({ key: PoolGlobalStateKeyRewardInterval })
  /** the round the last reward was last paid out on */
  lastDisbursementTimestamp = GlobalState<uint64>({ key: PoolGlobalStateKeyLastDisbursementTimestamp })
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
  creator = GlobalState<Account>({ key: PoolGlobalStateKeyCreator })
  /** marketplace is pool creation side marketplace */
  marketplace = GlobalState<Account>({ key: PoolGlobalStateKeyMarketplace })
  /** the amount the marketplaces will get for the sale */
  marketplaceRoyalties = GlobalState<uint64>({ key: PoolGlobalStateKeyMarketplaceRoyalties })
  /** the akita royalty for the pool */
  akitaRoyalty = GlobalState<uint64>({ key: PoolGlobalStateKeyAkitaRoyalty })
  /** the amount of royalties that were paid in a disbursement */
  akitaRoyaltyAmount = GlobalState<uint64>({ key: PoolGlobalStateKeyAkitaRoyaltyAmount })
  /** salt for randomness */
  salt = GlobalState<bytes<32>>({ key: PoolGlobalStateKeySalt })
  /** a sub status of the disbursement phase of the pool */
  disbursementPhase = GlobalState<UintN8>({ key: PoolGlobalStateKeyDisbursementPhase })
  /** the id of the currently active disbursement */
  activeDisbursementID = GlobalState<uint64>({ key: PoolGlobalStateKeyActiveDisbursementID })
  /** the unix timestamp signifying the start of the current disbursement */
  activeDisbursementWindow = GlobalState<uint64>({ key: PoolGlobalStateKeyActiveDisbursementWindow })
  /** the cursor for the current disbursement */
  disbursementCursor = GlobalState<uint64>({ key: PoolGlobalStateKeyDisbursementCursor })
  /** the count of qualified stake during the preparation phase of a disbursement */
  qualifiedStakers = GlobalState<uint64>({ key: PoolGlobalStateKeyQualifiedStake })
  /** the total qualified stake for the pool */
  qualifiedStake = GlobalState<uint64>({ key: PoolGlobalStateKeyQualifiedStake })
  /** the winning numbers for a raffle disbursement pool */
  winningTickets = GlobalState<DynamicArray<UintN64>>({ key: PoolGlobalStateKeyWinningTickets })
  /** winning ticket cursor for tracking the current position in winning tickets */
  raffleCursor = GlobalState<arc4RaffleCursor>({ key: PoolGlobalStateKeyRaffleCursor })
  /** counter for how many times we've failed to get rng from the beacon */
  vrfGetFailureCount = GlobalState<uint64>({ key: PoolGlobalStateKeyVRFFailureCount })

  // BOXES ----------------------------------------------------------------------------------------

  /** indexed entries for efficient iteration */
  entries = BoxMap<uint64, EntryData>({ keyPrefix: PoolBoxPrefixEntries })
  /** the entries in the pool */
  entriesByAddress = BoxMap<arc4EntryKey, uint64>({ keyPrefix: PoolBoxPrefixEntriesByAddress })
  /** the disbursements this pool as created & finalized */
  disbursements = BoxMap<uint64, StaticBytes<0>>({ keyPrefix: PoolBoxPrefixDisbursements })

  // PRIVATE METHODS ------------------------------------------------------------------------------

  private newEntryID(): uint64 {
    const id = this.entryID.value
    this.entryID.value += 1
    return id
  }

  private payAkitaRoyalty(): void {
    const reward = decodeArc4<Reward>(this.reward.value.bytes)
    
    let amount: uint64 = 0
    if (reward.distribution === DistributionTypeFlat) {
      amount = calcPercent((this.qualifiedStakers.value * reward.rate), this.akitaRoyalty.value)
    } else {
      amount = calcPercent(reward.rate, this.akitaRoyalty.value)
    }

    this.akitaRoyaltyAmount.value = amount 

    // pay the akita dao
    if (this.reward.value.asset.native === 0) {
      itxn
        .payment({
          receiver: this.akitaDAOEscrow.value.address,
          amount,
          fee,
        })
        .submit()
    } else if (this.akitaDAOEscrow.value.address.isOptedIn(Asset(reward.asset))) {
      itxn
        .assetTransfer({
          assetReceiver: this.akitaDAOEscrow.value.address,
          assetAmount: amount,
          xferAsset: reward.asset,
          fee,
        })
        .submit()
    } else {
      this.optAkitaEscrowInAndSend(
        AkitaDAOEscrowAccountStakingPools,
        Asset(reward.asset),
        amount
      )
    }
  }

  private processPreparationPhase(iterationAmount: uint64): void {
    let count: uint64 = 0
    let total: uint64 = 0

    if ((this.disbursementCursor.value + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - this.disbursementCursor.value
    }

    for (let id = this.disbursementCursor.value; id < iterationAmount; id++) {
      const entry = this.entries(id).value
      if (entry.disqualified) {
        continue
      }

      // if its not avg based, this check will disqualify the entry if necessary
      const { valid } = this.getStakeValue(id)
      if (!valid) {
        continue
      }

      const passes = gateCheck(this.akitaDAO.value, entry.address, this.gateID.value, entry.gateArgs)
      if (!passes) {
        if (this.type.value !== POOL_STAKING_TYPE_HEARTBEAT) {
          this.entries(id).value = {
            ...this.entries(id).value,
            disqualified: true
          }
        }
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
      this.payAkitaRoyalty()
    }
  }

  private createPercentageDisbursement(iterationAmount: uint64, asset: uint64, amount: uint64): void {

    if ((this.disbursementCursor.value + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - this.disbursementCursor.value
    }

    const allocations = new DynamicArray<arc4UserAllocation>()
    const actualAmount: uint64 = amount - this.akitaRoyaltyAmount.value
    let sum: uint64 = 0

    for (let id = this.disbursementCursor.value; id < iterationAmount; id++) {
      const entry = this.entries(id).value
      if (entry.disqualified) {
        continue
      }

      const individualAmount = calcPercent(actualAmount, percentageOf(entry.quantity, this.qualifiedStake.value))

      allocations.push(
        new arc4UserAllocation({
          address: entry.address,
          amount: new UintN64(individualAmount)
        }),
      )
      sum += individualAmount
    }

    this.disbursementCursor.value += iterationAmount
    this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations, sum)

    if (this.entryID.value === this.disbursementCursor.value) {
      this.disbursementPhase.value = DisbursementPhaseFinalization
      this.disbursementCursor.value = 0
    }
  }

  private createFlatDisbursement(iterationAmount: uint64, asset: uint64, amount: uint64): void {
    const total: uint64 = (this.qualifiedStakers.value * amount) - this.akitaRoyaltyAmount.value
    const percentageAkitaFee = calcPercent(amount, this.akitaRoyalty.value)
    const adjustedAmount: uint64 = amount - percentageAkitaFee
    const [balance] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)

    assert(balance >= total, ERR_NOT_ENOUGH_FUNDS)

    if ((this.disbursementCursor.value + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - this.disbursementCursor.value
    }

    const allocations = new DynamicArray<arc4UserAllocation>()
    let sum: uint64 = 0

    for (let id = this.disbursementCursor.value; id < iterationAmount; id++) {
      const entry = this.entries(id).value
      if (entry.disqualified) {
        continue
      }

      allocations.push(
        new arc4UserAllocation({
          address: entry.address,
          amount: new UintN64(adjustedAmount)
        }),
      )
      sum += adjustedAmount
    }

    this.disbursementCursor.value += iterationAmount
    this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations, sum)

    if (this.entryID.value === this.disbursementCursor.value) {
      this.disbursementPhase.value = DisbursementPhaseFinalization
      this.disbursementCursor.value = 0
    }
  }

  private createEvenDisbursement(iterationAmount: uint64, asset: uint64, sum: uint64): void {
    const [balance] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)
    const actualSum: uint64 = sum - this.akitaRoyaltyAmount.value
    assert(balance >= actualSum, ERR_NOT_ENOUGH_FUNDS)

    if ((this.disbursementCursor.value + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - this.disbursementCursor.value
    }

    const amount: uint64 = actualSum / this.qualifiedStakers.value
    const allocations = new DynamicArray<arc4UserAllocation>()
    for (let id = this.disbursementCursor.value; id < iterationAmount; id++) {
      const entry = this.entries(id).value
      if (entry.disqualified) {
        continue
      }

      allocations.push(
        new arc4UserAllocation({
          address: entry.address,
          amount: new UintN64(amount)
        }),
      )
    }

    this.disbursementCursor.value += iterationAmount
    this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations, sum)

    if (this.entryID.value === this.disbursementCursor.value) {
      this.disbursementPhase.value = DisbursementPhaseFinalization
      this.disbursementCursor.value = 0
    }
  }

  private resetRaffleState(): void {
    const zero = new UintN64(0)
    this.raffleCursor.value = new arc4RaffleCursor({ ticket: zero, stake: zero, disbursed: zero })
    this.winningTickets.value = new DynamicArray<UintN64>()
  }

  private createShuffleDisbursement(iterationAmount: uint64, asset: uint64, sum: uint64): void {
    const [balance] = AssetHolding.assetBalance(Global.currentApplicationAddress, asset)
    const actualSum: uint64 = sum - this.akitaRoyaltyAmount.value
    assert(balance >= actualSum, ERR_NOT_ENOUGH_FUNDS)

    if ((this.disbursementCursor.value + iterationAmount) > this.entryID.value) {
      iterationAmount = this.entryID.value - this.disbursementCursor.value
    }

    const reward = decodeArc4<Reward>(this.reward.value.bytes)

    let amount = actualSum
    if (reward.winnerCount > 0) {
      amount = actualSum / reward.winnerCount
    }

    const tickets = decodeArc4<uint64[]>(this.winningTickets.value.bytes)
    let { stake, ticket, disbursed } = decodeArc4<RaffleCursor>(this.raffleCursor.value.bytes)
    let currentTicket = tickets[ticket]
    let currentRangeStart = stake
    let currentRangeEnd: uint64 = 0

    const allocations = new DynamicArray<arc4UserAllocation>()
    for (let i = this.disbursementCursor.value; i < iterationAmount; i++) {
      const entry = this.entries(i).value

      currentRangeEnd = currentRangeStart + entry.quantity
      if (currentTicket >= currentRangeStart && currentTicket <= currentRangeEnd) {
        if (!entry.disqualified) {
          allocations.push(
            new arc4UserAllocation({
              address: entry.address,
              amount: new UintN64(amount)
            }),
          )
          disbursed++
        }

        if (ticket === tickets.length - 1) {
          // we didnt find enough winners, reset raffle
          if (reward.winnerCount !== disbursed) {
            this.disbursementCursor.value = 0
            this.raffleCursor.value = new arc4RaffleCursor({
              ticket: new UintN64(0),
              stake: new UintN64(0),
              disbursed: new UintN64(disbursed),
            })
            this.winningTickets.value = new DynamicArray<UintN64>()
            this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations, sum)
            return
          }
          break
        }

        iterationAmount -= i
        ticket++
        currentTicket = tickets[ticket]
        this.disbursementCursor.value = 0
        i = 0
        stake = 0
        currentRangeEnd = 0
      }
      currentRangeStart = currentRangeEnd + 1
    }

    this.disbursementCursor.value += iterationAmount
    this.raffleCursor.value = new arc4RaffleCursor({
      ticket: new UintN64(ticket),
      stake: new UintN64(stake),
      disbursed: new UintN64(disbursed),
    })
    this.createRewardAllocations(this.activeDisbursementID.value, asset, allocations, sum)

    if (reward.winnerCount === disbursed) {
      this.disbursementPhase.value = DisbursementPhaseFinalization
      this.disbursementCursor.value = 0
      this.resetRaffleState()
    }
  }

  private checkByID(id: uint64): { valid: boolean, balance: uint64 } {
    assert(
      this.type.value !== POOL_STAKING_TYPE_NONE || this.type.value !== POOL_STAKING_TYPE_HEARTBEAT,
      ERR_INVALID_POOL_TYPE_FOR_CHECK
    )

    const entry = this.entries(id).value

    if (entry.disqualified) {
      return { valid: false, balance: 0 }
    }

    if (this.type.value === POOL_STAKING_TYPE_SOFT) {
      const check = abiCall(Staking.prototype.softCheck, {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [entry.address, entry.asset],
        fee,
      }).returnValue

      if (check.balance >= entry.quantity) {
        return { valid: true, balance: check.balance }
      }
    } else {
      const info = abiCall(Staking.prototype.getInfo, {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [
          entry.address,
          {
            asset: entry.asset,
            type: this.stakingType(),
          },
        ],
        fee,
      }).returnValue

      if (info.amount >= entry.quantity) {
        return { valid: true, balance: info.amount }
      }
    }

    this.entries(id).value = {
      ...this.entries(id).value,
      disqualified: true
    }
    return { valid: false, balance: 0 }
  }

  private getLatestWindowStart(): uint64 {
    return Global.latestTimestamp - ((Global.latestTimestamp - this.startTimestamp.value) % this.rewardInterval.value)
  }

  private validWindow(): boolean {
    const latestWindowStart = this.getLatestWindowStart()
    return latestWindowStart !== Global.latestTimestamp && this.lastDisbursementTimestamp.value < latestWindowStart
  }

  private stakingType(): StakingType {
    assert(this.type.value !== POOL_STAKING_TYPE_NONE, 'pool staking type is not set')
    return new UintN8(this.type.value.native - 1)
  }

  private getStakeValue(id: uint64): { valid: boolean, balance: uint64 } {
    if (this.type.value === POOL_STAKING_TYPE_NONE) {
      return { valid: true, balance: 0 }
    } else if (this.type.value === POOL_STAKING_TYPE_HEARTBEAT) {
      const entry = this.entries(id).value

      const avg = abiCall(Staking.prototype.getHeartbeatAverage, {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [entry.address, entry.asset, true],
        fee,
      }).returnValue

      return { valid: true, balance: avg }
    }

    return this.checkByID(id)
  }

  private createRewards(title: string, timeToUnlock: uint64, expiration: uint64): uint64 {

    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)
    const rewardMBR: uint64 = 35_300 + (400 * Bytes(title).length)

    const mbrPayment = itxn.payment({
      receiver: rewardsApp.address,
      amount: rewardMBR,
      fee,
    })

    return abiCall(Rewards.prototype.createDisbursement, {
      appId: rewardsApp,
      args: [
        mbrPayment,
        title,
        timeToUnlock,
        expiration,
        '',
      ],
      fee,
    }).returnValue
  }

  private createRewardAllocations(
    disbursementID: uint64,
    asset: uint64,
    allocations: arc4UserAllocations,
    sum: uint64
  ): void {

    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)
    const mbrAmount = this.calculateAllocationMBR(allocations)

    if (asset === 0) {
      // ALGO allocations
      abiCall(Rewards.prototype.createUserAllocations, {
        appId: rewardsApp,
        args: [
          itxn.payment({
            receiver: rewardsApp.address,
            amount: mbrAmount + sum,
            fee,
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
            fee,
          }),
          itxn.assetTransfer({
            assetReceiver: rewardsApp.address,
            xferAsset: asset,
            assetAmount: sum,
            fee,
          }),
          disbursementID,
          allocations,
        ],
      })
    }
  }

  private finalizeRewards(disbursementID: uint64): void {
    const rewardsApp = Application(getAkitaAppList(this.akitaDAO.value).rewards)

    abiCall(Rewards.prototype.finalizeDisbursement, {
      appId: rewardsApp,
      args: [disbursementID],
      fee,
    })
  }

  private calculateAllocationMBR(allocations: arc4UserAllocations): uint64 {
    return 24_900 * allocations.length
  }

  // LIFE CYCLE METHODS ---------------------------------------------------------------------------

  @abimethod({ onCreate: 'require' })
  create(
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
    this.reward.value = reward.copy()
    const decodedReward = decodeArc4<Reward>(reward.bytes)
    assert(decodedReward.rate > 0, ERR_RATE_MUST_BE_GREATER_THAN_ZERO)
    this.creator.value = creator.native
    this.marketplace.value = marketplace.native

    // stake key is optional if the distribution type is not percentage based
    // we use this to qualify stakes for the pool but in some cases users may
    // want to distribute rewards on something else like subscription status
    // or impact score. In these cases the gate is the only requirement
    // and the stake key is not needed
    assert(
      stakeKey.address.native !== Global.zeroAddress ||
      reward.distribution !== DistributionTypePercentage,
      ERR_STAKE_KEY_REQUIRED
    )

    if (reward.distribution === DistributionTypeShuffle) {
      assert(decodedReward.rate > decodedReward.winnerCount, ERR_RATE_MUST_BE_GREATER_THAN_WINNER_COUNT)
    }

    if (reward.distribution === DistributionTypeEven) {
      assert(maxEntries < decodedReward.rate, ERR_MAX_ENTRIES_CANNOT_BE_GREATER_THAN_RATE)
      if (maxEntries === 0) {
        maxEntries = decodedReward.rate
      }
    }

    this.stakeKey.value = stakeKey.copy()
    this.minimumStakeAmount.value = minimumStakeAmount
    this.gateID.value = gateID
    this.maxEntries.value = maxEntries
    this.akitaDAO.value = Application(akitaDAO)
    this.salt.value = Txn.txId
    this.disbursementPhase.value = DisbursementPhaseIdle

    const fees = getStakingFees(this.akitaDAO.value)
    const impact = getUserImpact(this.akitaDAO.value, this.creator.value)
    this.akitaRoyalty.value = impactRange(impact, fees.impactTaxMin, fees.impactTaxMax)

    this.activeDisbursementID.value = 0
    this.activeDisbursementWindow.value = 0
    this.disbursementCursor.value = 0
    this.qualifiedStakers.value = 0
    this.qualifiedStake.value = 0
    this.winningTickets.value = new DynamicArray<UintN64>()
    this.vrfGetFailureCount.value = 0
  }

  init() {
    assert(Global.callerApplicationAddress === Global.creatorAddress, 'only the factory can init the pool')

    if (this.gateID.value > 0) {
      this.gateSize.value = abiCall(Gate.prototype.size, {
        appId: getAkitaAppList(this.akitaDAO.value).gate,
        args: [this.gateID.value],
        fee,
      }).returnValue
    }
  }

  @abimethod({ allowActions: 'DeleteApplication' })
  delete(caller: Address): void {
    assert(Txn.sender === Global.creatorAddress, 'call must come from factory')
    assert(caller.native === this.creator.value, 'only the creator can delete the pool')
    assert(this.status.value === PoolStatusDraft || Global.latestTimestamp > this.endTimestamp.value, 'the pool must be in draft or ended')
  }

  // POOL METHODS ---------------------------------------------------------------------------------

  finalize(signupTimestamp: uint64, startTimestamp: uint64, endTimestamp: uint64) {
    assert(Txn.sender === this.creator.value, 'only the creator can finalize the pool')
    assert(this.status.value === PoolStatusDraft, 'the pool must be in draft state to finalize')
    assert(
      signupTimestamp > Global.latestTimestamp || (signupTimestamp === 0 && this.allowLateSignups.value),
      'the signup round must be zero and late sign ups allowed or in the future'
    )
    // if start is zero then signup must also be zero and allowLateSignups must be true
    assert(
      startTimestamp === 0 ||
      startTimestamp > Global.latestTimestamp,
      'the starting round must be zero or in the future'
    )

    if (startTimestamp === 0) {
      assert(signupTimestamp === 0 && this.allowLateSignups.value, 'if the starting round is zero, the signup round must be zero and allowLateSignups must be true')
      startTimestamp = Global.latestTimestamp
    }

    assert(
      endTimestamp === 0 || endTimestamp > (startTimestamp + 10),
      'the ending round must be zero or after the starting round + 10'
    )

    this.signupTimestamp.value = signupTimestamp
    this.startTimestamp.value = startTimestamp
    this.endTimestamp.value = endTimestamp
    this.status.value = PoolStatusFinal
  }

  enter(payment: gtxn.PaymentTxn, entries: StakeEntry[], args: GateArgs): void {
    // Verify the pool is live
    assert(this.isLive(), 'the pool is not live')
    assert(
      gateCheck(this.akitaDAO.value, new Address(Txn.sender), this.gateID.value, args),
      'user does not meet gate requirements'
    )
    assert(
      (this.entryID.value + 1) < this.maxEntries.value ||
      this.maxEntries.value === 0,
      'pool has reached maximum entries'
    )
    // Verify payment for box storage (increased for additional box)
    const costs = this.mbr()
    const entryMBR: uint64 = costs.entries + costs.entriesByAddress

    assertMatch(
      payment,
      {
        receiver: Global.currentApplicationAddress,
        amount: entryMBR * entries.length,
      },
      ERR_INVALID_PAYMENT
    )

    for (let i: uint64 = 0; i < entries.length; i++) {
      assert(entries[i].quantity >= this.minimumStakeAmount.value, 'quantity is less than minimum stake amount')

      // check their actual balance if the assets aren't escrowed
      if (
        this.type.value === POOL_STAKING_TYPE_HEARTBEAT ||
        this.type.value === POOL_STAKING_TYPE_SOFT
      ) {
        const [balance, optedIn] = AssetHolding.assetBalance(Txn.sender, entries[i].asset)
        assert(optedIn && balance >= entries[i].quantity, 'user does not have min balance')
      }

      const stakeInfo = abiCall(Staking.prototype.getInfo, {
        appId: getAkitaAppList(this.akitaDAO.value).staking,
        args: [
          new Address(Txn.sender),
          {
            asset: entries[i].asset,
            type: this.stakingType(),
          },
        ],
        fee,
      }).returnValue

      assert(stakeInfo.amount >= entries[i].quantity, 'user does not have enough staked')

      const { address, name } = decodeArc4<RootKey>(this.stakeKey.value.bytes)
      const verified = abiCall(MetaMerkles.prototype.verify, {
        appId: getAkitaAppList(this.akitaDAO.value).metaMerkles,
        args: [
          address,
          name,
          sha256(sha256(itob(entries[i].asset))),
          entries[i].proof,
          MERKLE_TREE_TYPE_ASSET,
        ],
        fee,
      }).returnValue

      assert(verified, 'failed to verify stake requirements')

      const entryID = this.newEntryID()
      this.entries(entryID).value = {
        address: new Address(Txn.sender),
        asset: entries[i].asset,
        quantity: entries[i].quantity,
        gateArgs: args,
        disqualified: false
      }

      const aKey = new arc4EntryKey({
        address: new Address(Txn.sender),
        asset: new UintN64(entries[i].asset),
      })

      this.entriesByAddress(aKey).value = entryID
    }
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
    this.activeDisbursementWindow.value = this.getLatestWindowStart()
    this.lastDisbursementTimestamp.value = Global.latestTimestamp
    this.disbursementCursor.value = 0
    this.qualifiedStakers.value = 0
    this.qualifiedStake.value = 0
    this.disbursementPhase.value = DisbursementPhasePreparation
  }

  raffle(): void {
    assert(this.disbursementPhase.value === DisbursementPhaseAllocation, ERR_INVALID_DISBURSEMENT_PHASE)
    assert(this.winningTickets.value.length === 0, ERR_WINNING_TICKETS_ALREADY_EXIST)

    const roundToUse: uint64 = this.activeDisbursementWindow.value + 1 + (4 * this.vrfGetFailureCount.value)

    const seed = abiCall(
      RandomnessBeacon.prototype.get,
      {
        appId: getOtherAppList(this.akitaDAO.value).vrfBeacon,
        args: [roundToUse, this.salt.value],
        fee
      }
    ).returnValue

    if (seed.length === 0) {
      this.vrfGetFailureCount.value += 1
      return
    }

    // Initialize PCG randomness with the seed
    const rngState = pcg64Init(seed.slice(0, 16))

    // make upper bounds inclusive if we can
    let upperBound = this.qualifiedStake.value
    if (upperBound < MAX_UINT64) {
      upperBound += 1
    }

    const rngResult = pcg64Random(rngState, 1, upperBound, MaxGlobalStateUint64Array)
    this.winningTickets.value = rngResult[1].copy()
    this.vrfGetFailureCount.value = 0
  }

  disburseRewards(iterationAmount: uint64): void {
    assert(this.status.value === PoolStatusDisbursing, 'pool is not in disbursement phase')
    assert(
      this.disbursementPhase.value === DisbursementPhasePreparation ||
      this.disbursementPhase.value === DisbursementPhaseAllocation,
      ERR_NOT_READY_TO_DISBURSE
    )

    const reward = decodeArc4<Reward>(this.reward.value.bytes)

    if (this.disbursementPhase.value === DisbursementPhasePreparation) {
      this.processPreparationPhase(iterationAmount)
    } else {
      switch (reward.distribution) {
        case DistributionTypePercentage: {
          this.createPercentageDisbursement(iterationAmount, reward.asset, reward.rate)
          break
        }
        case DistributionTypeFlat: {
          this.createFlatDisbursement(iterationAmount, reward.asset, reward.rate)
          break
        }
        case DistributionTypeEven: {
          this.createEvenDisbursement(iterationAmount, reward.asset, reward.rate)
          break
        }
        case DistributionTypeShuffle: {
          if (this.winningTickets.value.length === 0) {
            this.raffle()
          } else {
            this.createShuffleDisbursement(iterationAmount, reward.asset, reward.rate)
          }
          break
        }
        default: {
          assert(false, 'unknown reward rate type')
        }
      }
    }
  }

  finalizeDistribution(): void {
    assert(this.disbursementPhase.value === DisbursementPhaseFinalization, ERR_DISBURSEMENT_NOT_READY_FOR_FINALIZATION)

    this.finalizeRewards(this.activeDisbursementID.value)

    this.disbursements(this.activeDisbursementID.value).create()

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

  // READ ONLY METHODS ----------------------------------------------------------------------------

  /** @returns a boolean of whether sign ups are open */
  @abimethod({ readonly: true })
  signUpsOpen(): boolean {
    return (
      this.status.value !== PoolStatusDraft &&
      Global.latestTimestamp > this.signupTimestamp.value &&
      (Global.latestTimestamp < this.startTimestamp.value || this.allowLateSignups.value)
    )
  }

  /** @returns a boolean of whether the pool is live */
  @abimethod({ readonly: true })
  isLive(): boolean {
    return (
      this.status.value !== PoolStatusDraft &&
      (Global.latestTimestamp >= this.startTimestamp.value) &&
      (Global.latestTimestamp <= this.endTimestamp.value || this.endTimestamp.value === 0)
    )
  }

  @abimethod({ readonly: true })
  getState(): PoolState {
    return {
      status: this.status.value,
      title: this.title.value,
      type: this.type.value,
      reward: decodeArc4<Reward>(this.reward.value.bytes),
      signupTimestamp: this.signupTimestamp.value,
      allowLateSignups: this.allowLateSignups.value,
      startTimestamp: this.startTimestamp.value,
      endTimestamp: this.endTimestamp.value,
      maxEntries: this.maxEntries.value,
      entryCount: (this.entryID.value + 1),
      totalStaked: this.totalStaked.value,
      stakeKey: decodeArc4<RootKey>(this.stakeKey.value.bytes),
      minimumStakeAmount: this.minimumStakeAmount.value,
      gateID: this.gateID.value,
      creator: new Address(this.creator.value),
    }
  }
}
